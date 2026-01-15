import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ShareMetadata } from '@shared/types';
import { SketchButton } from '@/components/ui/sketch-button';
import { ExternalLink, ArrowLeft, Download, FileText, Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
export function ViewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: share, isLoading, error } = useQuery({
    queryKey: ['share', id],
    queryFn: () => api<ShareMetadata>(`/api/shares/${id}`),
    enabled: !!id
  });
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display animate-pulse">Loading Sketch...</h2>
      </div>
    );
  }
  if (error || !share) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-3xl font-display text-sketch-pink">Sketch Not Found</h2>
        <Link to="/">
          <SketchButton variant="secondary">Go Home</SketchButton>
        </Link>
      </div>
    );
  }
  const contentUrl = `/api/content/${share.id}/${share.mainFile}`;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-sketch-yellow/10 p-6 sketch-card">
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center text-sm font-bold hover:underline mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to SketchPad
            </Link>
            <h1 className="text-4xl font-display font-bold flex items-center gap-3">
              {share.isWebsite ? <Globe className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
              {share.title}
            </h1>
            <p className="text-muted-foreground">
              Shared on {new Date(share.createdAt).toLocaleDateString()} • {share.fileCount} files
            </p>
          </div>
          <div className="flex gap-3">
            <a href={contentUrl} download={share.title}>
              <SketchButton variant="secondary">
                <Download className="w-4 h-4 mr-2" /> Download
              </SketchButton>
            </a>
          </div>
        </header>
        <main className="w-full h-[70vh] sketch-card overflow-hidden bg-white flex flex-col">
          <div className="bg-sketch-black/5 px-4 py-2 border-b-3 border-sketch-black flex items-center justify-between">
            <span className="text-xs font-mono truncate max-w-[50%]">{contentUrl}</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-sketch-pink border border-sketch-black" />
              <div className="w-3 h-3 rounded-full bg-sketch-yellow border border-sketch-black" />
              <div className="w-3 h-3 rounded-full bg-green-400 border border-sketch-black" />
            </div>
          </div>
          <div className="flex-1 bg-white relative">
            {share.isWebsite ? (
              <iframe 
                src={contentUrl} 
                className="w-full h-full border-none"
                title={share.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8 overflow-auto">
                {share.mainFile?.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                  <img src={contentUrl} alt={share.title} className="max-w-full max-h-full shadow-lg border border-gray-100" />
                ) : (
                  <embed src={contentUrl} type="application/pdf" className="w-full h-full" />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}