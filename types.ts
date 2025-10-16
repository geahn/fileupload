export interface UploadedFile {
  file: File;
  url: string; // The simulated display URL e.g., http://.../file.pdf
  blobUrl: string; // The actual browser blob URL for memory management
  expiryTimestamp: number;
}
