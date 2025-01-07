import React from "react";
import { BsImage } from "react-icons/bs";

const EmptyAnalysis: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
      <BsImage className="w-16 h-16 text-gray-400 dark:text-gray-500" />
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
          No Image Selected
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload an image to see detailed analysis results
        </p>
      </div>
    </div>
  );
};

export default EmptyAnalysis;
