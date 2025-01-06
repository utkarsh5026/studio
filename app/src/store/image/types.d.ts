export type ImageInfo = {
  image: File;
  preview: string | null;
};

export type ImageStatistics = {
  dimensions: { width: number; height: number };
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
