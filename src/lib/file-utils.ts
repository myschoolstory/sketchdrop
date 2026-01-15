import JSZip from 'jszip';
export interface ProcessedFile {
  path: string;
  content: string; // base64
  type: string;
  size: number;
}
export async function processFiles(files: File[]): Promise<ProcessedFile[]> {
  const processed: ProcessedFile[] = [];
  for (const file of files) {
    if (file.name.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(file);
      const zipEntries = Object.keys(zip.files);
      for (const path of zipEntries) {
        const entry = zip.files[path];
        if (!entry.dir) {
          const content = await entry.async('base64');
          const type = getMimeType(path);
          const size = (entry.options as any)?.uncompressedSize ?? 0;
          processed.push({
            path,
            content,
            type,
            size
          });
        }
      }
    } else {
      const base64 = await fileToBase64(file);
      processed.push({
        path: file.name,
        content: base64,
        type: file.type || getMimeType(file.name),
        size: file.size
      });
    }
  }
  return processed;
}
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}
export function getMimeType(filename: string | null | undefined): string {
  if (!filename) return 'application/octet-stream';
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimes: Record<string, string> = {
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'ico': 'image/x-icon',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'json': 'application/json',
    'xml': 'application/xml',
    'md': 'text/markdown',
    'zip': 'application/zip'
  };
  return mimes[ext || ''] || 'application/octet-stream';
}