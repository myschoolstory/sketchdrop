import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileWarning, Loader2, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { SketchButton } from './ui/sketch-button';
import { cn } from '@/lib/utils';
interface MediaPreviewProps {
  url: string;
  type: string;
  title: string;
  isWebsite?: boolean;
}
export function MediaPreview({ url, type, title, isWebsite }: MediaPreviewProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isImage = type.startsWith('image/');
  const isPdf = type === 'application/pdf';
  if (isWebsite) {
    return (
      <div className="w-full h-full relative bg-white">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <Loader2 className="w-10 h-10 animate-spin text-sketch-black opacity-20" />
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-none"
          title={title}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    );
  }
  if (isImage) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-[#fafafa] overflow-hidden relative">
        <motion.div
          layout
          className={cn(
            "relative cursor-zoom-in",
            isZoomed ? "cursor-zoom-out z-50" : "max-w-full max-h-full"
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <motion.img
            src={url}
            alt={title}
            className={cn(
              "sketch-card shadow-sketch-lg object-contain transition-shadow",
              isZoomed ? "max-w-[95vw] max-h-[95vh] scale-100" : "max-w-full max-h-[70vh]"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          />
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm border-2 border-sketch-black p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </div>
        </motion.div>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-sketch-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsZoomed(false)}
          />
        )}
      </div>
    );
  }
  if (isPdf) {
    return (
      <div className="w-full h-full p-4 md:p-8 flex items-center justify-center bg-gray-100">
        <object
          data={url}
          type="application/pdf"
          className="w-full h-full sketch-card shadow-sketch-lg bg-white"
        >
          <iframe
            src={url}
            className="w-full h-full"
            title={title}
          >
            <p className="p-4 text-center font-hand text-xl">
              This browser does not support PDFs. 
              <a href={url} className="text-sketch-pink underline ml-2">Download instead.</a>
            </p>
          </iframe>
        </object>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
      <div className="w-24 h-24 bg-sketch-yellow/10 rounded-full flex items-center justify-center border-4 border-dashed border-sketch-black/20">
        <FileWarning className="w-12 h-12 text-sketch-black/40" />
      </div>
      <div>
        <h3 className="text-2xl font-display font-bold">Preview Not Available</h3>
        <p className="text-muted-foreground font-hand text-lg mt-2 italic">
          We can't sketch a preview for "{type}" files yet.
        </p>
      </div>
      <a href={url} download={title}>
        <SketchButton variant="primary">
          <Download className="w-4 h-4 mr-2" /> Download File
        </SketchButton>
      </a>
    </div>
  );
}