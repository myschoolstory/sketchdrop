import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { getMyShareIds, removeShareId } from '@/lib/storage';
import { SketchButton } from '@/components/ui/sketch-button';
import { SketchCard } from '@/components/ui/sketch-card';
import { Trash2, ExternalLink, FileText, Globe, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ShareMetadata } from '@shared/types';
export default function DashboardPage() {
  const queryClient = useQueryClient();
  const localIds = getMyShareIds();
  const { data, isLoading } = useQuery({
    queryKey: ['my-shares', localIds],
    queryFn: () => api<{ items: ShareMetadata[] }>(`/api/shares?ids=${localIds.join(',')}`),
    enabled: localIds.length > 0
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/shares/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => {
      removeShareId(id);
      queryClient.invalidateQueries({ queryKey: ['my-shares'] });
      toast.success('Sketch deleted from your history');
    },
    onError: () => toast.error('Failed to delete sketch')
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center text-sm font-bold hover:underline mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Pad
            </Link>
            <h1 className="text-5xl font-display font-bold">My Sketches</h1>
            <p className="text-muted-foreground font-hand text-lg italic">
              "Your private gallery of shared doodles and sites."
            </p>
          </div>
        </header>
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 sketch-card bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : !data?.items.length ? (
          <div className="text-center py-20 sketch-card bg-white space-y-6">
            <h2 className="text-3xl font-display">No sketches found!</h2>
            <p className="font-hand text-xl text-muted-foreground">Your sketchbook is currently empty.</p>
            <Link to="/" className="inline-block">
              <SketchButton size="lg">Start Sketching</SketchButton>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((share) => (
              <SketchCard key={share.id} className="p-6 flex flex-col justify-between hover:rotate-1 transition-transform">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-full bg-sketch-yellow/20 flex items-center justify-center border-2 border-sketch-black">
                      {share.isWebsite ? <Globe className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/s/${share.id}`}>
                        <SketchButton size="sm" variant="secondary" className="p-2">
                          <ExternalLink className="w-4 h-4" />
                        </SketchButton>
                      </Link>
                      <SketchButton 
                        size="sm" 
                        variant="accent" 
                        className="p-2"
                        onClick={() => deleteMutation.mutate(share.id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </SketchButton>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold truncate">{share.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(share.createdAt).toLocaleDateString()} • {share.fileCount} files
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-sketch-black/5 flex items-center justify-between text-xs font-mono uppercase text-muted-foreground">
                  <span>{(share.totalSize / 1024).toFixed(1)} KB</span>
                  <span>{share.isWebsite ? 'Website' : 'Files'}</span>
                </div>
              </SketchCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}