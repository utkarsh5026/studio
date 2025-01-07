import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingCardProps {
  message?: string;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ message }) => {
  return (
    <Card className="w-full h-full">
      <CardContent className="w-full h-full flex items-center justify-center gap-2">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </CardContent>
    </Card>
  );
};

export default LoadingCard;
