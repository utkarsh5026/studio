import React, { useState, useEffect } from "react";
import LuminanceAnalyzer from "./luminance";

import GammaAnalysis from "./GammaAnalysis";
import Container from "../utils/Container";
import DynamicRange from "./DynamicRange";
import DarkLight from "./DarkLight";
import LumHist from "./LumHist";
import BrightnessDistributionCard from "./BrightnessDistributionCard";
import ClippingAnalysisCard from "./ClippingAnalysis";

import type { LuminanceAnalysis } from "./types";
import type { CanvasResult } from "../../../canvas/useCanvas";

interface LuminanceAnalysisProps {
  canvasResult: CanvasResult;
}

const LuminanceAnalysisView: React.FC<LuminanceAnalysisProps> = ({
  canvasResult,
}) => {
  const [analysis, setAnalysis] = useState<LuminanceAnalysis | null>(null);

  useEffect(() => {
    const analyzeLuminance = async () => {
      if (!canvasResult.imageData) {
        return;
      }

      const analyzer = new LuminanceAnalyzer(canvasResult.imageData);
      setAnalysis(analyzer.getAnalysis());
    };

    analyzeLuminance();
  }, [canvasResult]);

  console.log(analysis);

  if (!analysis) {
    return <div className="text-center p-4">Analyzing image luminance...</div>;
  }

  return (
    <Container>
      <div className="space-y-8 p-6">
        <BrightnessDistributionCard
          analysis={analysis.brightnessDistribution}
        />
        <LumHist analysis={analysis.histogram} />
        <DarkLight analysis={analysis.regions} />
        <DynamicRange analysis={analysis.dynamicRangeAnalysis} />
        <GammaAnalysis analysis={analysis.gammaCurveAnalysis} />
        <ClippingAnalysisCard analysis={analysis.clippingAnalysis} />
      </div>
    </Container>
  );
};

export default LuminanceAnalysisView;
