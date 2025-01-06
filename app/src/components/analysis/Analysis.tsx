import React from "react";
import ImageStatistics from "./ImageStatistics";
import { useImage } from "../../store/image/hooks";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { ColorAnalysis } from "./ColorAnalysis";

const Analysis: React.FC = () => {
  const { image } = useImage();
  if (!image) return null;

  return (
    <Tabs defaultValue="statistics" className="w-full">
      <TabsList>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
        <TabsTrigger value="histogram">Histogram</TabsTrigger>
      </TabsList>
      <TabsContent value="statistics">
        <ImageStatistics image={image.image} />
      </TabsContent>
      <TabsContent value="histogram">
        <ColorAnalysis imageData={image.image} />
      </TabsContent>
    </Tabs>
  );
};

export default Analysis;
