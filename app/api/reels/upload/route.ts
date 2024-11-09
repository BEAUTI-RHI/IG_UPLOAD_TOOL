// // app/api/reels/upload/route.ts
// import { NextResponse } from "next/server";
// import {
//   generateSignedUrl,
//   generateReadSignedUrl,
// } from "@/utils/googleStorage";
// import { validateVideo } from "@/utils/videoValidation";

// interface UploadTarget {
//   instagramAccountId: string;
//   pageAccessToken: string;
// }

// async function getContainerStatus(mediaId: string, accessToken: string) {
//   try {
//     const response = await fetch(
//       `https://graph.facebook.com/v18.0/${mediaId}?fields=status_code,status&access_token=${accessToken}`
//     );
//     const data = await response.json();

//     if (data.error) {
//       console.error(`Status check error for ${mediaId}:`, data.error);
//       return null;
//     }

//     console.log(`Status check for ${mediaId}:`, data);
//     return data.status_code;
//   } catch (error) {
//     console.error("Status check failed:", error);
//     return null;
//   }
// }

// async function createContainer(
//   instagramAccountId: string,
//   pageAccessToken: string,
//   videoUrl: string,
//   caption: string
// ) {
//   const response = await fetch(
//     `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
//     {
//       method: "POST",
//       body: JSON.stringify({
//         media_type: "REELS",
//         video_url: videoUrl,
//         caption: caption || "",
//         access_token: pageAccessToken,
//         share_to_feed: "true",
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   const data = await response.json();
//   console.log(`Container creation response for ${instagramAccountId}:`, data);

//   if (data.error) {
//     throw new Error(`Container creation failed: ${JSON.stringify(data.error)}`);
//   }

//   return data;
// }

// async function publishContainer(
//   instagramAccountId: string,
//   containerId: string,
//   pageAccessToken: string
// ) {
//   const response = await fetch(
//     `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
//     {
//       method: "POST",
//       body: JSON.stringify({
//         creation_id: containerId,
//         access_token: pageAccessToken,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   const data = await response.json();
//   console.log(`Publish response for ${instagramAccountId}:`, data);

//   if (data.error) {
//     throw new Error(`Publishing failed: ${JSON.stringify(data.error)}`);
//   }

//   return data;
// }

// export async function POST(request: Request) {
//   try {
//     console.log("Starting upload process...");
//     const formData = await request.formData();
//     const video = formData.get("video") as File;
//     const caption = formData.get("caption") as string;
//     const targetsString = formData.get("targets") as string;

//     // Basic validation only on server
//     const validation = await validateVideo(video);
//     if (!validation.isValid) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: `Invalid video: ${validation.errors.join(", ")}`,
//         },
//         { status: 400 }
//       );
//     }

//     console.log("Video validation passed:", {
//       metadata: validation.metadata,
//       videoName: video.name,
//       videoSize: video.size,
//       videoType: video.type,
//     });

//     let targets: UploadTarget[];
//     try {
//       targets = JSON.parse(targetsString);
//       console.log(`Processing upload for ${targets.length} accounts`);
//     } catch (error) {
//       console.log(error);
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Invalid targets data",
//         },
//         { status: 400 }
//       );
//     }

//     // Upload to Google Cloud Storage
//     const timestamp = Date.now();
//     const safeFileName = video.name.replace(/[^a-zA-Z0-9.-]/g, "_");
//     const filePath = `reels/${timestamp}-${safeFileName}`;

//     try {
//       console.log("Uploading to Google Storage...");
//       const uploadUrl = await generateSignedUrl(filePath);

//       const uploadResponse = await fetch(uploadUrl, {
//         method: "PUT",
//         body: video,
//         headers: {
//           "Content-Type": video.type,
//           "Content-Length": video.size.toString(),
//         },
//       });

//       if (!uploadResponse.ok) {
//         throw new Error(`Storage upload failed: ${uploadResponse.statusText}`);
//       }
//       console.log("Storage upload successful:", uploadResponse.status);
//     } catch (error) {
//       console.error("Storage upload error:", error);
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Failed to upload video to storage",
//         },
//         { status: 500 }
//       );
//     }

//     // Get public URL for Instagram
//     const videoUrl = await generateReadSignedUrl(filePath);
//     console.log("Video URL generated");

//     // Process each account
//     const results = await Promise.all(
//       targets.map(async (target) => {
//         try {
//           // Create container
//           const containerData = await createContainer(
//             target.instagramAccountId,
//             target.pageAccessToken,
//             videoUrl,
//             caption
//           );

//           // Wait for processing
//           console.log(
//             `Waiting for container ${containerData.id} to be ready...`
//           );
//           let attempts = 0;
//           const maxAttempts = 24; // 2 minutes total
//           let status;

//           while (attempts < maxAttempts) {
//             await new Promise((resolve) => setTimeout(resolve, 5000));
//             status = await getContainerStatus(
//               containerData.id,
//               target.pageAccessToken
//             );
//             console.log(
//               `Attempt ${attempts + 1}: Container ${containerData.id} status:`,
//               status
//             );

//             if (status === "FINISHED") {
//               break;
//             }

//             if (status === "ERROR") {
//               throw new Error("Video processing failed");
//             }

//             attempts++;
//           }

//           if (attempts >= maxAttempts) {
//             throw new Error("Video processing timed out");
//           }

//           // Publish the container
//           const publishData = await publishContainer(
//             target.instagramAccountId,
//             containerData.id,
//             target.pageAccessToken
//           );

//           return {
//             accountId: target.instagramAccountId,
//             success: true,
//             data: publishData,
//           };
//         } catch (error: unknown) {
//           console.error(
//             `Error for account ${target.instagramAccountId}:`,
//             error
//           );
//           return {
//             accountId: target.instagramAccountId,
//             success: false,
//             error: error instanceof Error ? error.message : String(error),
//           };
//         }
//       })
//     );

//     // // Cleanup storage
//     // try {
//     //   const storage = new Storage();
//     //   await storage.bucket(process.env.BUCKET_NAME!).file(filePath).delete();
//     //   console.log("Cleaned up video file from storage");
//     // } catch (error) {
//     //   console.error("Failed to cleanup video:", error);
//     // }

//     return NextResponse.json({
//       success: true,
//       results,
//     });
//   } catch (error: unknown) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error
//             ? error.message
//             : String(error) || "Unknown error occurred",
//       },
//       { status: 500 }
//     );
//   }
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// app/api/reels/upload/route.ts
import { NextResponse } from "next/server";

interface UploadTarget {
  instagramAccountId: string;
  pageAccessToken: string;
}

async function getContainerStatus(mediaId: string, accessToken: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${mediaId}?fields=status_code,status&access_token=${accessToken}`
    );
    const data = await response.json();

    if (data.error) {
      console.error(`Status check error for ${mediaId}:`, data.error);
      return null;
    }

    console.log(`Status check for ${mediaId}:`, data);
    return data.status_code;
  } catch (error) {
    console.error("Status check failed:", error);
    return null;
  }
}

async function createContainer(
  instagramAccountId: string,
  pageAccessToken: string,
  videoUrl: string,
  caption: string
) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
    {
      method: "POST",
      body: JSON.stringify({
        media_type: "REELS",
        video_url: videoUrl,
        caption: caption || "",
        access_token: pageAccessToken,
        share_to_feed: "true",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  console.log(`Container creation response for ${instagramAccountId}:`, data);

  if (data.error) {
    throw new Error(`Container creation failed: ${JSON.stringify(data.error)}`);
  }

  return data;
}

async function publishContainer(
  instagramAccountId: string,
  containerId: string,
  pageAccessToken: string
) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
    {
      method: "POST",
      body: JSON.stringify({
        creation_id: containerId,
        access_token: pageAccessToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  console.log(`Publish response for ${instagramAccountId}:`, data);

  if (data.error) {
    throw new Error(`Publishing failed: ${JSON.stringify(data.error)}`);
  }

  return data;
}

export async function POST(request: Request) {
  try {
    const { videoUrl, caption, targets } = await request.json();

    if (!videoUrl || !targets) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Process each account
    const results = await Promise.all(
      targets.map(async (target: UploadTarget) => {
        try {
          // Create container
          const containerData = await createContainer(
            target.instagramAccountId,
            target.pageAccessToken,
            videoUrl,
            caption
          );

          // Wait for processing
          console.log(
            `Waiting for container ${containerData.id} to be ready...`
          );
          let attempts = 0;
          const maxAttempts = 24; // 2 minutes total
          let status;

          while (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            status = await getContainerStatus(
              containerData.id,
              target.pageAccessToken
            );
            console.log(
              `Attempt ${attempts + 1}: Container ${containerData.id} status:`,
              status
            );

            if (status === "FINISHED") {
              break;
            }

            if (status === "ERROR") {
              throw new Error("Video processing failed");
            }

            attempts++;
          }

          if (attempts >= maxAttempts) {
            throw new Error("Video processing timed out");
          }

          // Publish the container
          const publishData = await publishContainer(
            target.instagramAccountId,
            containerData.id,
            target.pageAccessToken
          );

          return {
            accountId: target.instagramAccountId,
            success: true,
            data: publishData,
          };
        } catch (error: unknown) {
          console.error(
            `Error for account ${target.instagramAccountId}:`,
            error
          );
          return {
            accountId: target.instagramAccountId,
            success: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error) || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
