export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface ShareFile {
  path: string;
  content: string; // Base64 or Text
  type: string;
  size: number;
}
export interface ShareMetadata {
  id: string;
  title: string;
  createdAt: number;
  expiresAt?: number;
  fileCount: number;
  totalSize: number;
  isWebsite: boolean;
  mainFile?: string; // index.html for websites
}
export interface ShareState extends ShareMetadata {
  files: Record<string, ShareFile>;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}