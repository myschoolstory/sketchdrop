import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ShareMetadata } from '@shared/types';
import { SketchButton } from '@/components/ui/sketch-button';
import { ExternalLink, ArrowLeft, Download, FileText, Globe, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
export function ViewPage() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  const { data: share, isLoading, error } = useQuery({
    queryKey: ['share', id],
    queryFn: () => api<ShareMetadata>(`/api/shares/${id}`),
    enabled: !!id
  });
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
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
  const fullContentUrl = `${window.location.origin}${contentUrl}`;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-sketch-yellow/10 p-6 sketch-card relative">
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center text-sm font-bold hover:underline mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to SketchPad
            </Link>
            <h1 className="text-4xl font-display font-bold flex items-center gap-3">
              {share.isWebsite ? <Globe className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
              {share.title}
            </h1>
            <p className="text-muted-foreground font-hand text-lg italic">
              Created {new Date(share.createdAt).toLocaleDateString()} • {share.fileCount} {share.fileCount === 1 ? 'file' : 'files'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <SketchButton variant="secondary" onClick={handleCopyLink}>
              {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy Link
            </SketchButton>
            <a href={contentUrl} download={share.title}>
              <SketchButton variant="secondary">
                <Download className="w-4 h-4 mr-2" /> Download
              </SketchButton>
            </a>
            <a href={contentUrl} target="_blank" rel="noopener noreferrer">
              <SketchButton variant="accent">
                <ExternalLink className="w-4 h-4 mr-2" /> Open Raw
              </SketchButton>
            </a>
          </div>
        </header>
        <main className="w-full h-[75vh] sketch-card overflow-hidden bg-white flex flex-col group relative">
          <div className="bg-sketch-black px-4 py-2 border-b-3 border-sketch-black flex items-center justify-between text-white">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-sketch-pink border border-white/20" />
              <div className="w-3 h-3 rounded-full bg-sketch-yellow border border-white/20" />
              <div className="w-3 h-3 rounded-full bg-green-400 border border-white/20" />
            </div>
            <span className="text-xs font-mono truncate px-4 opacity-70 hidden md:block">{fullContentUrl}</span>
            <div className="w-16" />
          </div>
          <div className="flex-1 bg-white relative overflow-auto">
            {share.isWebsite ? (
              <iframe
                src={contentUrl}
                className="w-full h-full border-none"
                title={share.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                {share.mainFile?.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                  <img src={contentUrl} alt={share.title} className="max-w-full max-h-full sketch-card shadow-sketch-lg" />
                ) : (
                  <embed src={contentUrl} type="application/pdf" className="w-full h-full sketch-card" />
                )}
              </div>
            )}
          </div>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-sketch-yellow border-2 border-sketch-black px-3 py-1 text-xs font-bold shadow-sketch rotate-3">
              LIVE PREVIEW
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}