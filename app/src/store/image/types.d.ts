export type dimensions = {
  width: number;
  height: number;
};

export type ImageInfo = {
  image: File;
  preview: string | null;
  dimensions: dimensions | null;
};

export type ImageStatistics = {
  dimensions: dimensions;
  fileSize: string;
  aspectRatio: string;
  averageLuminance: number;
};

export type ExifData = {
  Make?: string;
  Model?: string;
  DateTime?: string;
  ExposureTime?: number;
  FNumber?: number;
  ISO?: number;
  GPSLatitude?: number[];
  GPSLongitude?: number[];
};
