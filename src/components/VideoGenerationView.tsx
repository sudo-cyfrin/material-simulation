import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Play, Loader2, ShieldAlert, CheckCircle2, Info, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey?: () => Promise<boolean>;
      openSelectKey?: () => Promise<void>;
    };
  }
}

interface VideoGenerationViewProps {
  onClose: () => void;
}

export const VideoGenerationView: React.FC<VideoGenerationViewProps> = ({ onClose }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } else {
      setHasKey(false);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const generateVideo = async () => {
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setStatus('Initializing high-speed camera system...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Photorealistic high-speed camera footage of a ballistic laboratory test. Two human-shaped ballistic mannequins stand side-by-side. The mannequin on the left wears a sleek black spider silk vest with a soft fabric texture. The mannequin on the right wears an olive drab Kevlar tactical vest. A bullet is fired simultaneously at both. Ultra slow motion, 1000fps. On impact, the spider silk vest stretches significantly, spreading the kinetic energy across the torso. The Kevlar vest shows a rigid impact with a deep localized indentation. A subtle semi-transparent cross-section appears at the point of impact showing the bullet pushing into the internal fiber layers. Realistic bullet flattening, fabric ripples, and shockwave propagation. Natural laboratory lighting, documentary style, 4K resolution, cinematic physics.`;

      setStatus('Calibrating physics engine and lighting...');
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      const loadingMessages = [
        'Simulating ballistic impact dynamics...',
        'Rendering high-speed fabric deformation...',
        'Calculating shockwave propagation...',
        'Finalizing photorealistic textures...',
        'Encoding 4K cinematic sequence...'
      ];

      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        setStatus(loadingMessages[messageIndex % loadingMessages.length]);
        messageIndex++;
      }, 8000);

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      clearInterval(messageInterval);
      setStatus('Processing capture...');

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.API_KEY || '',
          },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setIsGenerating(false);
      } else {
        throw new Error('Video generation failed: No download link received.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('Requested entity was not found')) {
        setHasKey(false);
        setError('API Key session expired. Please re-select your key.');
      } else {
        setError(err.message || 'An error occurred during generation.');
      }
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
    >
      <div className="max-w-4xl w-full glass rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-2xl">
              <Video className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Cinematic High-Speed Capture</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Veo 3.1 AI Generation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {!hasKey ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto">
              <div className="p-6 bg-amber-500/10 rounded-full">
                <ShieldAlert className="w-12 h-12 text-amber-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">API Key Required</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  To generate cinematic high-speed videos, you must select a paid Gemini API key. 
                  This ensures high-quality 4K output and complex physics simulation.
                </p>
                <div className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl text-xs text-slate-400">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <p>Make sure your project has billing enabled. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline inline-flex items-center gap-1">Billing Docs <ExternalLink className="w-3 h-3" /></a></p>
                </div>
              </div>
              <button 
                onClick={handleSelectKey}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-600/20"
              >
                Select API Key
              </button>
            </div>
          ) : isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
                <Loader2 className="w-20 h-20 text-purple-500 animate-spin relative z-10" />
              </div>
              <div className="space-y-4 max-w-sm">
                <h3 className="text-2xl font-bold animate-pulse">{status}</h3>
                <p className="text-slate-500 text-sm">
                  This process typically takes 2-4 minutes as our AI simulates trillions of fiber interactions.
                </p>
              </div>
            </div>
          ) : videoUrl ? (
            <div className="space-y-6">
              <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-center p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <div>
                    <p className="font-bold text-emerald-400">Capture Complete</p>
                    <p className="text-xs text-emerald-500/60 font-mono">1080p • 1000 FPS • Realistic Physics</p>
                  </div>
                </div>
                <button 
                  onClick={() => setVideoUrl(null)}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  New Capture
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-xl mx-auto">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-6 glass rounded-3xl text-left space-y-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="font-bold text-sm">Spider Silk</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">Simulates high-elasticity energy distribution and fiber stretching.</p>
                </div>
                <div className="p-6 glass rounded-3xl text-left space-y-2">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h4 className="font-bold text-sm">Kevlar</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">Simulates rigid impact resistance and localized deformation.</p>
                </div>
              </div>

              {error && (
                <div className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-6 w-full">
                <div className="text-left space-y-2">
                  <h3 className="text-xl font-bold">Ready for Capture?</h3>
                  <p className="text-slate-400 text-sm">
                    We will generate a photorealistic side-by-side comparison of a ballistic impact test using ultra-high-speed camera physics.
                  </p>
                </div>
                <button 
                  onClick={generateVideo}
                  className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-white font-black text-lg uppercase tracking-widest rounded-3xl transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-4"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Start High-Speed Capture
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const RotateCcw = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const Zap = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.71 12 4.5l-1 7.5h9l-8 10.21 1-7.5H4z"/></svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
);
