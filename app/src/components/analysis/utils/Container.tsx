import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="h-[calc(100vh-6rem)] overflow-y-auto space-y-8 p-6 scrollbar-thin scrollbar-w-1 scrollbar-thumb-gray-300/40 scrollbar-track-gray-100/10 hover:scrollbar-thumb-gray-400/50 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
      {children}
    </div>
  );
};

export default Container;
