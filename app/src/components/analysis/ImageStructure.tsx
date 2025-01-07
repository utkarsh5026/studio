import React, { useEffect, useState } from "react";

interface ImageAnalysis {
  pixelDensity: number[];
  noiseLevel: number;
  edgeDetection: {
    edges: number;
    strength: number;
  };
  textureComplexity: number;
  solidRegions: number;
  resolution: {
    width: number;
    height: number;
    isAdequate: boolean;
  };
}

const ImageStructure: React.FC<{ file: File }> = ({ file }) => {
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);

  useEffect(() => {
    analyzeImage(file);
  }, [file]);

  const analyzeImage = async (file: File) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculate pixel density distribution
      const pixelDensity = calculatePixelDensity(data);

      // Calculate noise level
      const noiseLevel = calculateImageNoise(data);

      // Detect edges
      const edgeInfo = detectEdges(imageData);

      // Calculate texture complexity
      const textureComplexity = calculateTextureComplexity(data);

      // Detect solid regions
      const solidRegions = detectSolidRegions(data);

      // Assess resolution
      const resolution = {
        width: img.width,
        height: img.height,
        isAdequate: img.width >= 800 && img.height >= 600,
      };

      setAnalysis({
        pixelDensity,
        noiseLevel,
        edgeDetection: edgeInfo,
        textureComplexity,
        solidRegions,
        resolution,
      });

      URL.revokeObjectURL(img.src);
    };
  };

  const calculatePixelDensity = (data: Uint8ClampedArray): number[] => {
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
      const brightness = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
      histogram[brightness]++;
    }
    return histogram;
  };

  const calculateImageNoise = (data: Uint8ClampedArray): number => {
    let totalVariation = 0;
    for (let i = 0; i < data.length - 4; i += 4) {
      const currentPixel = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const nextPixel = (data[i + 4] + data[i + 5] + data[i + 6]) / 3;
      totalVariation += Math.abs(currentPixel - nextPixel);
    }
    return totalVariation / (data.length / 4);
  };

  const detectEdges = (imageData: ImageData) => {
    const sobelData = applySobelOperator(imageData);
    let edges = 0;
    let totalStrength = 0;

    for (let i = 0; i < sobelData.length; i++) {
      if (sobelData[i] > 30) {
        // threshold for edge detection
        edges++;
        totalStrength += sobelData[i];
      }
    }

    return {
      edges,
      strength: totalStrength / edges || 0,
    };
  };

  const applySobelOperator = (imageData: ImageData): number[] => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new Array(width * height).fill(0);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const gx = calculateGradientX(data, idx, width);
        const gy = calculateGradientY(data, idx, width);
        output[y * width + x] = Math.sqrt(gx * gx + gy * gy);
      }
    }

    return output;
  };

  const calculateGradientX = (
    data: Uint8ClampedArray,
    idx: number,
    width: number
  ): number => {
    const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;
    const left = (data[idx - 4] + data[idx - 3] + data[idx - 2]) / 3;
    return right - left;
  };

  const calculateGradientY = (
    data: Uint8ClampedArray,
    idx: number,
    width: number
  ): number => {
    const below =
      (data[idx + width * 4] +
        data[idx + width * 4 + 1] +
        data[idx + width * 4 + 2]) /
      3;
    const above =
      (data[idx - width * 4] +
        data[idx - width * 4 + 1] +
        data[idx - width * 4 + 2]) /
      3;
    return below - above;
  };

  const calculateTextureComplexity = (data: Uint8ClampedArray): number => {
    let complexity = 0;
    for (let i = 0; i < data.length - 4; i += 4) {
      const currentPixel = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const nextPixel = (data[i + 4] + data[i + 5] + data[i + 6]) / 3;
      complexity += Math.abs(currentPixel - nextPixel);
    }
    return complexity / (data.length / 4);
  };

  const detectSolidRegions = (data: Uint8ClampedArray): number => {
    let solidPixels = 0;
    const threshold = 5; // tolerance for color variation

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Check if neighboring pixels are similar
      if (i + 4 < data.length) {
        const nextR = data[i + 4];
        const nextG = data[i + 5];
        const nextB = data[i + 6];

        if (
          Math.abs(r - nextR) <= threshold &&
          Math.abs(g - nextG) <= threshold &&
          Math.abs(b - nextB) <= threshold
        ) {
          solidPixels++;
        }
      }
    }

    return (solidPixels / (data.length / 4)) * 100;
  };

  if (!analysis) {
    return <p className="text-gray-600">Analyzing image...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Technical Image Structure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">
            Pixel Density Distribution
          </h3>
          <div className="h-40">
            {/* Add visualization component for pixel density */}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Noise Levels</h3>
          <p>Overall Noise: {analysis.noiseLevel.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Edge Detection</h3>
          <p>Edge Count: {analysis.edgeDetection.edges}</p>
          <p>Edge Strength: {analysis.edgeDetection.strength.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Texture Complexity</h3>
          <p>Score: {analysis.textureComplexity.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Solid Regions</h3>
          <p>Percentage: {analysis.solidRegions.toFixed(2)}%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Resolution Assessment</h3>
          <p>
            {analysis.resolution.width} x {analysis.resolution.height}
            <span
              className={`ml-2 ${
                analysis.resolution.isAdequate
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ({analysis.resolution.isAdequate ? "Adequate" : "Insufficient"})
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageStructure;
