import React, { useState, useEffect } from 'react';
import { UploadWidget } from '@/components/UploadWidget';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { PenTool, Share2, Globe, Library } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SketchButton } from '@/components/ui/sketch-button';
import { getMyShareIds } from '@/lib/storage';
export function HomePage() {
  const [sketchCount, setSketchCount] = useState(0);
  useEffect(() => {
    setSketchCount(getMyShareIds().length);
  }, []);
  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <ThemeToggle />
      <div className="absolute top-4 left-4 z-50">
        <Link to="/dashboard">
          <SketchButton variant="secondary" className="relative">
            <Library className="w-4 h-4 mr-2" />
            My Sketches
            {sketchCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-sketch-pink text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-sketch-black">
                {sketchCount}
              </span>
            )}
          </SketchButton>
        </Link>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20 lg:py-24 space-y-16">
          <header className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-sketch-yellow sketch-card animate-sketch-bounce mb-4 rotate-3">
              <PenTool className="w-10 h-10 text-sketch-black" />
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight">
              Sketch<span className="text-sketch-pink">Drop</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto font-hand text-sketch-black/70 italic">
              "The most illustrative way to share files, host websites, and doodle on the web."
            </p>
          </header>
          <UploadWidget />
          <section className="grid md:grid-cols-3 gap-8 pt-12">
            {[
              {
                icon: <Share2 className="w-6 h-6" />,
                title: "Instant Sharing",
                desc: "Upload images, PDFs, or docs and get a unique link to share with anyone instantly.",
                color: "bg-blue-100"
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Static Hosting",
                desc: "Drop a ZIP of your static site (HTML/CSS/JS) and we'll host it live in seconds.",
                color: "bg-sketch-yellow/20"
              },
              {
                icon: <PenTool className="w-6 h-6" />,
                title: "Draft Style",
                desc: "Your files deserve a better frame than a boring white page. Welcome to the sketchbook.",
                color: "bg-sketch-pink/10"
              }
            ].map((feature, i) => (
              <div key={i} className={`sketch-card p-8 ${feature.color} space-y-4 hover:-translate-y-1 transition-transform`}>
                <div className="w-12 h-12 rounded-full bg-white border-3 border-sketch-black flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-bold">{feature.title}</h3>
                <p className="font-hand leading-relaxed text-sketch-black/80">{feature.desc}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
      <footer className="py-12 border-t-3 border-sketch-black bg-white text-center">
        <p className="font-display text-xl">Crafted with a pencil and Cloudflare.</p>
      </footer>
      <Toaster richColors position="bottom-center" />
    </div>
  );
}