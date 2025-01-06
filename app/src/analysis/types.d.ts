export type ImageDimensions = {
  width: number;
  height: number;
};

export type ColorAnalysisResult = {
  histograms: {
    red: number[];
    green: number[];
    blue: number[];
  };
  dominantColors: Array<Color>;
  saturation: number;
  dimensions: ImageDimensions;
};

export type Color = {
  r: number;
  g: number;
  b: number;
};
