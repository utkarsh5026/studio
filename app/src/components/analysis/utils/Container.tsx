import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="h-[calc(100vh-6rem)] overflow-y-auto space-y-8 p-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
      {children}
    </div>
  );
};

export default Container;
