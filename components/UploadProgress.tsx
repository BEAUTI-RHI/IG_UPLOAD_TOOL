// components/UploadProgress.tsx
"use client";

import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface UploadStage {
  label: string;
  status: "waiting" | "loading" | "complete" | "error";
  message?: string;
}

interface UploadProgressProps {
  stages: UploadStage[];
  progress: number;
  accountName?: string;
}

export function UploadProgress({
  stages,
  progress,
  accountName,
}: UploadProgressProps) {
  return (
    <div className="w-full space-y-4 rounded-lg border p-4">
      {accountName && (
        <div className="font-medium text-sm">Uploading to @{accountName}</div>
      )}

      <Progress value={progress} className="w-full" />

      <div className="space-y-2">
        {stages.map((stage, index) => (
          <div key={index} className="flex items-center gap-2">
            {stage.status === "waiting" && (
              <div className="h-4 w-4 rounded-full border" />
            )}
            {stage.status === "loading" && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            )}
            {stage.status === "complete" && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {stage.status === "error" && (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">
              {stage.label}
              {stage.message && (
                <span className="text-xs text-gray-500 ml-2">
                  {stage.message}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
