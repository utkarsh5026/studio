import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { Button } from "../ui/button";
import { useImage } from "../../store/image/hooks";

const FileUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { image, addFile, removeImage, loading } = useImage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) addFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) addFile(file);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <div
        className={`w-full aspect-square relative border-2 border-dashed rounded-xl p-8 text-center ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50"
        } transition-all duration-200 ease-in-out shadow-sm dark:shadow-gray-900/30`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Drop zone for image upload"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            document.getElementById("file-upload")?.click();
          }
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />

        {image?.preview ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <img
              src={image.preview}
              alt="Preview"
              className="max-h-[80%] w-auto mx-auto rounded-xl shadow-md dark:shadow-gray-900/50 object-contain"
            />
            <button
              onClick={() => removeImage()}
              className="px-4 py-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <label
            htmlFor="file-upload"
            className="h-full cursor-pointer flex flex-col items-center justify-center space-y-6 group"
          >
            <FiUploadCloud className="w-16 h-16 text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
            <div className="space-y-2">
              <p className="text-xl font-medium text-gray-700 dark:text-gray-200">
                Drag and drop your image here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or{" "}
                <span className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                  click to select
                </span>
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Supports JPG, PNG and GIF up to 10MB
              </p>
            </div>
          </label>
        )}
      </div>

      <Button
        disabled={!image?.preview || loading}
        className="w-full py-6 text-lg font-medium disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          "Analyze Image"
        )}
      </Button>
    </div>
  );
};
export default FileUpload;
