import React from "react";
import ImageStatistics from "./ImageStatistics";
import { useImage } from "../../store/image/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.tsx";
import EmptyAnalysis from "./EmptyAnalysis";
import { ColorAnalysis } from "./ColorAnalysis";
import LuminanceAnalysisView from "./luminiscence/LuminanceAnalysis";

import CompressionVisualizer from "./compress/CompressionVisualizer";
import ImageStructure from "./ImageStructure";
import ImagePerformance from "./perf/ImagePerformance";

const Analysis: React.FC = () => {
  const { image, canvasResult } = useImage();
  if (!image?.preview || !canvasResult) return <EmptyAnalysis />;

  return (
    <Tabs defaultValue="statistics" className="w-full h-full flex flex-col">
      <TabsList>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
        <TabsTrigger value="color">Color</TabsTrigger>
        <TabsTrigger value="luminance">Luminance</TabsTrigger>
        <TabsTrigger value="quality">Quality</TabsTrigger>
        <TabsTrigger value="compression">Compression</TabsTrigger>
        <TabsTrigger value="structure">Structure</TabsTrigger>
      </TabsList>
      <div>
        <TabsContent value="statistics" className="h-full">
          <ImageStatistics imageInfo={image} canvasResult={canvasResult} />
        </TabsContent>
        <TabsContent value="color" className="h-full">
          <ColorAnalysis imageData={image.image} />
        </TabsContent>
        <TabsContent value="luminance" className="h-full">
          <LuminanceAnalysisView canvasResult={canvasResult} />
        </TabsContent>
        <TabsContent value="quality" className="h-full">
          <ImagePerformance imageFile={image} />
        </TabsContent>
        <TabsContent value="compression" className="h-full">
          <CompressionVisualizer
            imageFile={image}
            canvasResult={canvasResult}
          />
        </TabsContent>
        <TabsContent value="structure" className="h-full">
          <ImageStructure file={image.image} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default Analysis;
