// "use client";

// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Progress } from "@/components/ui/progress";
// import { useInstagramAccounts } from "@/context/InstagramAccountsContext";
// import { useState } from "react";
// import { CheckCircle2, Loader2, XCircle } from "lucide-react";

// interface UploadStage {
//   label: string;
//   status: "waiting" | "loading" | "complete" | "error";
//   message?: string;
// }

// export default function UploadReel() {
//   const [file, setFile] = useState<File | null>(null);
//   const [caption, setCaption] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showError, setShowError] = useState<string | null>(null);
//   const [uploadStages, setUploadStages] = useState<UploadStage[]>([
//     { label: "Preparing video", status: "waiting" },
//     { label: "Uploading to storage", status: "waiting" },
//     { label: "Processing video", status: "waiting" },
//     { label: "Publishing to Instagram", status: "waiting" },
//   ]);
//   const { accounts, selectedAccounts } = useInstagramAccounts();

//   const updateStage = (
//     index: number,
//     status: UploadStage["status"],
//     message?: string
//   ) => {
//     setUploadStages((prev) =>
//       prev.map((stage, i) =>
//         i === index ? { ...stage, status, message } : stage
//       )
//     );
//   };

//   const resetUpload = () => {
//     setUploadProgress(0);
//     setShowSuccess(false);
//     setShowError(null);
//     setUploadStages((stages) =>
//       stages.map((stage) => ({
//         ...stage,
//         status: "waiting",
//         message: undefined,
//       }))
//     );
//   };

//   const handleUpload = async () => {
//     if (!file || selectedAccounts.length === 0) return;

//     setIsUploading(true);
//     resetUpload();

//     try {
//       // Update first stage - Preparing
//       updateStage(0, "loading");
//       setUploadProgress(25);

//       const selectedAccountsData = accounts.filter((acc) =>
//         selectedAccounts.includes(acc.id)
//       );

//       const formData = new FormData();
//       formData.append("video", file);
//       formData.append("caption", caption);
//       formData.append(
//         "targets",
//         JSON.stringify(
//           selectedAccountsData.map((account) => ({
//             instagramAccountId: account.id,
//             pageAccessToken: account.pageAccessToken,
//           }))
//         )
//       );

//       // Update second stage - Uploading
//       updateStage(0, "complete");
//       updateStage(1, "loading");
//       setUploadProgress(50);

//       const response = await fetch("/api/reels/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.success) {
//         // Update final stages
//         updateStage(1, "complete");
//         updateStage(2, "complete");
//         updateStage(3, "complete");
//         setUploadProgress(100);
//         setShowSuccess(true);

//         // Clear form
//         setFile(null);
//         setCaption("");
//       } else {
//         throw new Error(data.error || "Upload failed");
//       }
//     } catch (error: any) {
//       console.error("Upload failed:", error);
//       setShowError(error.message);

//       // Mark current stage as error
//       const currentStageIndex = uploadStages.findIndex(
//         (s) => s.status === "loading"
//       );
//       if (currentStageIndex !== -1) {
//         updateStage(currentStageIndex, "error", error.message);
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* Alerts */}
//       {showSuccess && (
//         <Alert className="bg-green-50 border-green-200">
//           <CheckCircle2 className="h-4 w-4 text-green-600" />
//           <AlertTitle className="text-green-800">Upload Complete!</AlertTitle>
//           <AlertDescription className="text-green-700">
//             Your reel has been successfully uploaded to Instagram
//           </AlertDescription>
//         </Alert>
//       )}

//       {showError && (
//         <Alert variant="destructive">
//           <XCircle className="h-4 w-4" />
//           <AlertTitle>Upload Failed</AlertTitle>
//           <AlertDescription>{showError}</AlertDescription>
//         </Alert>
//       )}

//       {/* Upload Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Left Column - Media Upload */}
//         <div className="space-y-4">
//           <div className="border-2 border-dashed rounded-lg p-4 text-center">
//             {!file ? (
//               <div
//                 className="flex flex-col items-center justify-center h-64 cursor-pointer"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <Upload className="h-10 w-10 text-gray-400 mb-2" />
//                 <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
//                 <p className="text-xs text-gray-500 mt-1">MP4 or MOV up to 100MB</p>
//               </div>
//             ) : (
//               <div className="relative">
//                 <video
//                   src={previewUrl!}
//                   className="w-full rounded-lg"
//                   controls
//                   preload="metadata"
//                 />
//                 <button
//                   onClick={clearFile}
//                   className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
//                 >
//                   <X className="h-4 w-4 text-white" />
//                 </button>
//                 <div className="mt-2 text-sm text-gray-600">
//                   {file.name}
//                 </div>
//               </div>
//             )}
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="video/*"
//               onChange={handleFileSelect}
//               className="hidden"
//               disabled={isUploading}
//             />
//           </div>
//         </div>

//         {/* Right Column - Caption & Upload */}
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-2">Caption</label>
//             <textarea
//               value={caption}
//               onChange={(e) => setCaption(e.target.value)}
//               placeholder="Write a caption..."
//               className="w-full p-3 border rounded-lg h-32 resize-none"
//               disabled={isUploading}
//             />
//           </div>

//           {selectedAccounts.length > 0 && (
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <p className="text-sm font-medium mb-2">Uploading to:</p>
//               {accounts
//                 .filter(acc => selectedAccounts.includes(acc.id))
//                 .map(acc => (
//                   <div key={acc.id} className="text-sm text-gray-600">
//                     @{acc.username}
//                   </div>
//                 ))}
//             </div>
//           )}

//           <Button
//             onClick={handleUpload}
//             disabled={!file || selectedAccounts.length === 0 || isUploading}
//             className="w-full"
//           >
//             {isUploading ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Uploading...
//               </span>
//             ) : (
//               'Upload Reel'
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Upload Progress */}
//       {isUploading && (
//         <div className="border rounded-lg p-4 space-y-4">
//           <Progress value={uploadProgress} className="w-full" />

//           <div className="space-y-2">
//             {uploadStages.map((stage, index) => (
//               <div key={index} className="flex items-center gap-2">
//                 {stage.status === 'waiting' && (
//                   <div className="h-4 w-4 rounded-full border" />
//                 )}
//                 {stage.status === 'loading' && (
//                   <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//                 )}
//                 {stage.status === 'complete' && (
//                   <CheckCircle2 className="h-4 w-4 text-green-500" />
//                 )}
//                 {stage.status === 'error' && (
//                   <XCircle className="h-4 w-4 text-red-500" />
//                 )}
//                 <span className="text-sm">
//                   {stage.label}
//                   {stage.message && (
//                     <span className="text-xs text-gray-500 ml-2">
//                       {stage.message}
//                     </span>
//                   )}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
// components/UploadReel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useInstagramAccounts } from "@/context/InstagramAccountsContext";
import { useState, useRef } from "react";
import {
  CheckCircle2,
  Loader2,
  XCircle,
  Upload,
  X,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import { validateVideoClient } from "@/utils/videoValidation";

export default function UploadReel() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accounts, selectedAccounts } = useInstagramAccounts();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        // Do detailed validation on client side
        const validation = await validateVideoClient(selectedFile);
        if (!validation.isValid) {
          setShowError(validation.errors.join("\n"));
          return;
        }

        setFile(selectedFile);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } catch (error) {
        console.log(error);
        setShowError("Error validating video");
      }
    }
  };

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file || selectedAccounts.length === 0) return;

    setIsUploading(true);
    setShowSuccess(false);
    setShowError(null);

    try {
      const selectedAccountsData = accounts.filter((acc) =>
        selectedAccounts.includes(acc.id)
      );

      const formData = new FormData();
      formData.append("video", file);
      formData.append("caption", caption);
      formData.append(
        "targets",
        JSON.stringify(
          selectedAccountsData.map((account) => ({
            instagramAccountId: account.id,
            pageAccessToken: account.pageAccessToken,
          }))
        )
      );

      const response = await fetch("/api/reels/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        clearFile();
        setCaption("");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      setShowError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Status Messages */}
      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Upload Complete!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your reel has been successfully uploaded to Instagram
          </AlertDescription>
        </Alert>
      )}

      {showError && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription>{showError}</AlertDescription>
        </Alert>
      )}

      {/* Main Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Video Upload */}
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-xl bg-gray-50">
            {!file ? (
              <div
                className="flex flex-col items-center justify-center h-[400px] cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  MP4 or MOV up to 100MB
                </p>
              </div>
            ) : (
              <div className="relative h-[400px] bg-black rounded-xl overflow-hidden">
                <video
                  src={previewUrl!}
                  className="w-full h-full object-contain"
                  controls
                  preload="metadata"
                />
                <button
                  onClick={clearFile}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {file && (
            <div className="text-sm text-gray-600">
              Selected file: {file.name}
            </div>
          )}
        </div>

        {/* Right Column - Caption & Settings */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for your reel..."
              className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUploading}
            />
          </div>

          {selectedAccounts.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Instagram className="h-4 w-4" />
                <span className="font-medium">Selected Accounts</span>
              </div>
              <div className="space-y-2">
                {accounts
                  .filter((acc) => selectedAccounts.includes(acc.id))
                  .map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {acc.profilePicture ? (
                          <Image
                            src={acc.profilePicture}
                            alt={acc.username}
                            className="w-full h-full rounded-full"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <Instagram className="h-4 w-4" />
                        )}
                      </div>
                      @{acc.username}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || selectedAccounts.length === 0 || isUploading}
            className="w-full h-12"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading...
              </span>
            ) : (
              "Upload Reel"
            )}
          </Button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-lg font-medium text-center">
              Uploading your reel to Instagram...
            </p>
            <p className="text-sm text-gray-500 text-center">
              This may take a few minutes depending on your connection speed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
