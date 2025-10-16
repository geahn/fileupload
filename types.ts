export interface UploadedFile {
  file: File; // Keep the original file object to display name and size
  url: string; // The real, temporary URL from the backend API
  expiryTimestamp: number;
}