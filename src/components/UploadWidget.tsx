import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, FileCode, CheckCircle2, Loader2 } from 'lucide-react';
import { SketchButton } from './ui/sketch-button';
import { processFiles } from '@/lib/file-utils';
import { api } from '@/lib/api-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
export function UploadWidget() {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);
    const toastId = toast.loading('Sketching your files...');
    try {
      const processed = await processFiles(acceptedFiles);
      const res = await api<{ id: string }>('/api/shares', {
        method: 'POST',
        body: JSON.stringify({
          metadata: { title: acceptedFiles[0].name.split('.')[0] },
          files: processed
        })
      });
      toast.success('Sketch uploaded!', { id: toastId });
      navigate(`/s/${res.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload sketch', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }, [navigate]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
    multiple: true
  });
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`sketch-card p-12 text-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'bg-sketch-yellow/10 border-dashed' : 'bg-white'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-sketch-yellow/20 rounded-full flex items-center justify-center animate-sketch-bounce">
            {isUploading ? (
              <Loader2 className="w-10 h-10 animate-spin text-sketch-black" />
            ) : (
              <CloudUpload className="w-10 h-10 text-sketch-black" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold">
              {isDragActive ? 'Drop it here!' : 'Drop your sketches'}
            </h3>
            <p className="text-muted-foreground mt-2">
              Images, PDFs, or ZIPs (for static websites)
            </p>
          </div>
          <SketchButton disabled={isUploading} className="mt-4">
            Select Files
          </SketchButton>
        </div>
      </div>
    </div>
  );
}