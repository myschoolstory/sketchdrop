import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ShareMetadata } from '@shared/types';
import { SketchButton } from '@/components/ui/sketch-button';
import { MediaPreview } from '@/components/MediaPreview';
import { getMimeType } from '@/lib/file-utils';
import {
  ExternalLink,
  ArrowLeft,
  Download,
  FileText,
  Globe,
  Copy,
  Check,
  Info,
  Calendar,
  HardDrive,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
        <div className="inline-block p-4 sketch-card animate-sketch-bounce bg-sketch-yellow">
           <Globe className="w-12 h-12 animate-pulse" />
        </div>
        <h2 className="text-3xl font-display mt-6">Fetching your sketch...</h2>
      </div>
    );
  }
  if (error || !share) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-4xl font-display text-sketch-pink">Sketch Not Found</h2>
        <p className="font-hand text-xl max-w-md mx-auto italic">
          The page you're looking for has been erased or never existed.
        </p>
        <Link to="/">
          <SketchButton variant="secondary">Back to SketchPad</SketchButton>
        </Link>
      </div>
    );
  }
  const contentUrl = `/api/content/${share.id}/${share.mainFile}`;
  const fullContentUrl = `${window.location.origin}${contentUrl}`;
  const mainFileType = getMimeType(share.mainFile || "");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 flex-1">
            <Link to="/" className="inline-flex items-center text-sm font-bold hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Pad
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sketch-yellow sketch-card rotate-[-2deg]">
                {share.isWebsite ? <Globe className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                  {share.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground font-hand text-lg">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {new Date(share.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-4 h-4" /> {(share.totalSize / 1024).toFixed(1)} KB
                  </span>
                  <span>• {share.fileCount} {share.fileCount === 1 ? 'file' : 'files'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <SketchButton variant="secondary" onClick={handleCopyLink} className="min-w-[140px]">
              {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Link'}
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
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="w-full h-[65vh] md:h-[75vh] sketch-card overflow-hidden bg-white flex flex-col group relative">
              <div className="bg-sketch-black px-4 py-2 border-b-3 border-sketch-black flex items-center justify-between text-white shrink-0">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-sketch-pink border border-white/20" />
                  <div className="w-3 h-3 rounded-full bg-sketch-yellow border border-white/20" />
                  <div className="w-3 h-3 rounded-full bg-green-400 border border-white/20" />
                </div>
                <span className="text-[10px] md:text-xs font-mono truncate px-4 opacity-70 hidden sm:block">
                  {fullContentUrl}
                </span>
                <div className="w-12 h-1 rounded-full bg-white/20" />
              </div>
              <div className="flex-1 overflow-hidden">
                <MediaPreview
                  url={contentUrl}
                  type={share.isWebsite ? 'text/html' : mainFileType}
                  title={share.title}
                  isWebsite={share.isWebsite}
                />
              </div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-sketch-purple text-white border-2 border-sketch-black px-3 py-1 text-[10px] font-bold shadow-sketch -rotate-2">
                  SKETCHDROP RENDERER
                </div>
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="sketch-card p-6 bg-white space-y-4">
              <h4 className="font-display text-xl flex items-center gap-2">
                <Info className="w-5 h-5" /> Details
              </h4>
              <Accordion type="single" collapsible defaultValue="files" className="w-full">
                <AccordionItem value="files" className="border-sketch-black/10">
                  <AccordionTrigger className="font-hand text-lg py-2 hover:no-underline">
                    File List ({share.fileCount})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                      {(share.filePaths || [share.mainFile]).filter(Boolean).map((path) => (
                        <div 
                          key={path}
                          className={cn(
                            "text-sm font-mono p-2 border rounded truncate flex items-center justify-between gap-2 group",
                            path === share.mainFile 
                              ? "bg-sketch-yellow/10 border-sketch-black/20" 
                              : "bg-white border-sketch-black/5 hover:border-sketch-black/20"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              path === share.mainFile ? "bg-sketch-pink" : "bg-gray-300"
                            )} />
                            <span className="truncate">{path}</span>
                          </div>
                          {path === share.mainFile && <Star className="w-3 h-3 text-sketch-pink shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="share" className="border-none">
                  <AccordionTrigger className="font-hand text-lg py-2 hover:no-underline">
                    QR & Links
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-gray-50 border-2 border-dashed border-sketch-black/10 text-center space-y-2">
                       <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Public Share Link</p>
                       <p className="text-xs font-mono break-all bg-white p-2 border border-sketch-black/5 selection:bg-sketch-yellow">{window.location.href}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="sketch-card p-6 bg-sketch-pink/5 border-dashed">
              <p className="font-hand text-lg leading-snug">
                "Sharing is sketching. Thanks for using SketchDrop to host your {share.isWebsite ? 'site' : 'creation'}!"
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}