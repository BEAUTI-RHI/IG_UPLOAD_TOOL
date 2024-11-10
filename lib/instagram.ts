export async function getContainerStatus(mediaId: string, accessToken: string) {
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

export async function createContainer(
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

export async function publishContainer(
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
