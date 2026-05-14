"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".json", ".parquet"];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

type FilePreviewRow = Record<string, string | number | boolean | null>;

interface UploadResult {
  dataset_id: string;
  filename: string;
  rows: number;
  columns: number;
  column_names: string[];
  message: string;
}

interface UploadState {
  status: "idle" | "dragging" | "uploading" | "success" | "error";
  progress: number;
  file: File | null;
  error: string | null;
  preview: FilePreviewRow[] | null;
  result: UploadResult | null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot >= 0 ? filename.slice(lastDot).toLowerCase() : "";
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

export function FileUpload() {
  const [state, setState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    file: null,
    error: null,
    preview: null,
    result: null,
  });

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    const ext = getFileExtension(file.name);
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return `Unsupported file type "${ext}". Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large (${formatFileSize(file.size)}). Maximum size is 100 MB.`;
    }
    if (file.size === 0) {
      return "File is empty. Please select a file with data.";
    }
    return null;
  }, []);

  const parseCSVPreview = useCallback((text: string): FilePreviewRow[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1, 6).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row: FilePreviewRow = {};
      headers.forEach((header, i) => {
        row[header] = values[i] ?? "";
      });
      return row;
    });
  }, []);

  const parseJSONPreview = useCallback((text: string): FilePreviewRow[] => {
    try {
      const data = JSON.parse(text);
      const arr = Array.isArray(data) ? data : [data];
      return arr.slice(0, 5);
    } catch {
      return [];
    }
  }, []);

  const generatePreview = useCallback(
    (file: File) => {
      const ext = getFileExtension(file.name);
      if (ext === ".csv" || ext === ".json") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const preview =
            ext === ".csv" ? parseCSVPreview(text) : parseJSONPreview(text);
          setState((prev) => ({ ...prev, preview }));
        };
        reader.readAsText(file.slice(0, 50000));
      }
    },
    [parseCSVPreview, parseJSONPreview]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      setState((prev) => ({
        ...prev,
        status: "uploading",
        progress: 0,
        error: null,
        result: null,
      }));

      const formData = new FormData();
      formData.append("file", file);

      try {
        const xhr = new XMLHttpRequest();

        const uploadPromise = new Promise<UploadResult>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setState((prev) => ({ ...prev, progress: Math.min(pct, 99) }));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              let message = "Upload failed. Please try again.";
              try {
                const err = JSON.parse(xhr.responseText);
                message = err.detail || message;
              } catch {
                // keep default message
              }
              reject(new Error(message));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Network error. Check your connection and try again."));
          });

          xhr.open("POST", "/api/ingest/upload");
          xhr.send(formData);
        });

        const result = await uploadPromise;

        generatePreview(file);

        setState((prev) => ({
          ...prev,
          status: "success",
          progress: 100,
          result,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          status: "error",
          progress: 0,
          error: err instanceof Error ? err.message : "Upload failed",
        }));
      }
    },
    [generatePreview]
  );

  const handleFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setState({
          status: "error",
          progress: 0,
          file,
          error,
          preview: null,
          result: null,
        });
        return;
      }
      setState({
        status: "uploading",
        progress: 0,
        file,
        error: null,
        preview: null,
        result: null,
      });
      uploadFile(file);
    },
    [validateFile, uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({
      ...prev,
      status: prev.status === "uploading" ? "uploading" : "dragging",
    }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setState((prev) => ({
        ...prev,
        status: prev.status === "dragging" ? "idle" : prev.status,
      }));
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleReset = useCallback(() => {
    setState({
      status: "idle",
      progress: 0,
      file: null,
      error: null,
      preview: null,
      result: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleBrowseClick();
      }
    },
    [handleBrowseClick]
  );

  return (
    <div className="space-y-4">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={handleInputChange}
          className="sr-only"
          aria-label="Choose file to upload"
          id="file-upload-input"
        />

        {/* Drop zone */}
        <div
          ref={dropZoneRef}
          role="button"
          tabIndex={0}
          aria-label="Drop zone. Click or press Enter to browse files"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          onKeyDown={handleKeyDown}
          className={`
            relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center
            rounded-lg border-2 border-dashed p-8
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dga-primary-500 focus-visible:ring-offset-2
            ${
              state.status === "dragging"
                ? "border-dga-primary-500 bg-dga-primary-50"
                : state.status === "error"
                  ? "border-dga-error-300 bg-dga-error-50"
                  : state.status === "success"
                    ? "border-dga-success-300 bg-dga-success-50"
                    : "border-dga-gray-300 hover:border-dga-primary-400 hover:bg-dga-primary-25"
            }
          `}
        >
          {state.status === "idle" || state.status === "dragging" ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-full bg-dga-primary-100 p-4">
                <UploadIcon className="size-8 text-dga-primary-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-dga-gray-900">
                  {state.status === "dragging"
                    ? "Drop your file here"
                    : "Drag & drop your file here"}
                </p>
                <p className="mt-1 text-xs text-dga-gray-500">
                  or{" "}
                  <span className="font-medium text-dga-primary-600 underline underline-offset-2">
                    browse files
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {ACCEPTED_EXTENSIONS.map((ext) => (
                  <span
                    key={ext}
                    className="rounded-md bg-dga-gray-100 px-2 py-0.5 text-xs font-medium text-dga-gray-700"
                  >
                    {ext.toUpperCase().slice(1)}
                  </span>
                ))}
              </div>
            </div>
          ) : state.status === "uploading" ? (
            <div className="flex w-full max-w-xs flex-col items-center gap-3">
              <div className="rounded-full bg-dga-primary-100 p-3">
                <FileIcon className="size-6 text-dga-primary-600" />
              </div>
              <p className="text-sm font-medium text-dga-gray-900">
                Uploading {state.file?.name}
              </p>
              <div className="w-full space-y-1">
                <Progress value={state.progress} className="h-2" />
                <p className="text-center text-xs text-dga-gray-500">
                  {Math.round(state.progress)}%
                </p>
              </div>
            </div>
          ) : state.status === "success" ? (
            <div className="flex w-full flex-col items-center gap-3">
              <div className="rounded-full bg-dga-success-100 p-3">
                <CheckIcon className="size-6 text-dga-success-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-dga-gray-900">
                  {state.file?.name}
                </p>
                <p className="text-xs text-dga-gray-500">
                  {state.file ? formatFileSize(state.file.size) : ""} — Upload
                  complete
                </p>
                {state.result && (
                  <p className="mt-1 text-xs text-dga-success-700">
                    {state.result.rows.toLocaleString()} rows, {state.result.columns} columns
                  </p>
                )}
              </div>
            </div>
          ) : state.status === "error" ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-full bg-dga-error-100 p-3">
                <AlertIcon className="size-6 text-dga-error-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-dga-error-700">
                  Upload failed
                </p>
                <p className="mt-1 text-xs text-dga-gray-600">
                  {state.error}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Preview table */}
        {state.status === "success" && state.preview && state.preview.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-dga-gray-900">
              Preview (first {state.preview.length} rows)
            </h3>
            <div className="overflow-x-auto rounded-lg border border-dga-gray-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-dga-gray-200 bg-dga-gray-50">
                    {Object.keys(state.preview[0]).map((key) => (
                      <th
                        key={key}
                        className="whitespace-nowrap px-3 py-2 font-medium text-dga-gray-600"
                        scope="col"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.preview.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-dga-gray-100 last:border-0"
                    >
                      {Object.values(row).map((val, j) => (
                        <td
                          key={j}
                          className="whitespace-nowrap px-3 py-2 text-dga-gray-800"
                        >
                          {String(val ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Binary file preview placeholder */}
        {state.status === "success" && !state.preview && (
          <div className="rounded-lg border border-dga-gray-200 bg-dga-gray-50 p-4 text-center">
            <p className="text-sm text-dga-gray-600">
              Preview not available for{" "}
              {state.file
                ? getFileExtension(state.file.name).toUpperCase().slice(1)
                : ""}{" "}
              files. The file has been uploaded and is ready for analysis.
            </p>
          </div>
        )}

        {/* Action buttons */}
        {(state.status === "success" || state.status === "error") && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="flex-1 border-dga-gray-300 text-dga-gray-700 hover:bg-dga-gray-50"
            >
              Upload another file
            </Button>
            {state.status === "success" && state.result && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/${state.result!.dataset_id}`);
                }}
                className="flex-1 bg-dga-primary-500 text-white hover:bg-dga-primary-600"
              >
                Analyze data
              </Button>
            )}
          </div>
        )}
    </div>
  );
}
