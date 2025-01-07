import React, { useState, useEffect } from "react";

import Container from "../utils/Container";
import CompressionCalculator from "./compression";

import type { CompressionAnalysis } from "./types";
import type { ImageInfo } from "../../../store/image/types";
import type { CanvasResult } from "../../../canvas/useCanvas";
import Overview from "./Overview";
import CompressionTabs from "./CompressionTabs";

interface CompressionVisualizerProps {
  imageFile: ImageInfo;
  canvasResult: CanvasResult;
}

const CompressionVisualizer: React.FC<CompressionVisualizerProps> = ({
  imageFile,
  canvasResult,
}) => {
  const [analysisResults, setAnalysisResults] = useState<CompressionAnalysis>();

  console.log(analysisResults);

  useEffect(() => {
    const analyzeImage = async () => {
      if (!imageFile) return;

      const imgData = canvasResult.imageData;

      if (!imgData) return;
      const calculator = new CompressionCalculator(
        imgData,
        imageFile.image.size
      );

      setAnalysisResults({
        currentCompression: calculator.analyzeCurrentCompression(),
        formatPotential: calculator.analyzeFormatPotential(),
        artifacts: calculator.analyzeArtifacts(),
        qualityImpact: calculator.predictQualityImpact(80),
        losslessPotential: calculator.analyzeLosslessPotential(),
      });
    };

    analyzeImage();
  }, [imageFile, canvasResult]);

  if (!analysisResults) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Analyzing image...</div>
      </div>
    );
  }

  return (
    <Container>
      {/* Overview Section */}
      <Overview analysisResults={analysisResults} />

      <CompressionTabs analysisResults={analysisResults} />
    </Container>
  );
};

export default CompressionVisualizer;
