import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Loader2, Sparkles, X, Download, ShieldCheck, RotateCcw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ProteinVestShowcaseProps {
  onClose: () => void;
}

export const ProteinVestShowcase = ({ onClose }: ProteinVestShowcaseProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVestImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: 'A hyper-detailed, 8K resolution front-facing product shot of a futuristic bio-engineered ballistic vest. The vest features a complex hexagonal micro-lattice weave made of iridescent recombinant spider silk protein. It has integrated carbon-fiber reinforcement plates, sleek ergonomic shoulder straps, and a matte black tactical finish with subtle pearlescent highlights. The lighting is dramatic, studio-quality, highlighting the intricate texture of the protein fibers. Set in a high-tech laboratory with holographic data displays in the background. Professional industrial design photography.',
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate prototype image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-4xl glass rounded-[2rem] overflow-hidden border-white/10 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full glass glass-hover text-white/50 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2 h-full min-h-[600px]">
          <div className="p-12 flex flex-col justify-center gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-purple-400">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-xs font-mono uppercase tracking-[0.3em]">Advanced Bio-Materials</span>
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
                The Protein <br /> <span className="text-purple-500">Aegis</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Visualize the next generation of ballistic protection. Our bio-engineered protein fibers offer 5x the strength of steel with the flexibility of silk.
              </p>
            </div>

            <div className="space-y-4">
              {!image && !loading && (
                <button
                  onClick={generateVestImage}
                  className="w-full group relative flex items-center justify-center gap-3 px-8 py-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Generate Visual Prototype
                </button>
              )}

              {image && (
                <button
                  onClick={generateVestImage}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass glass-hover text-white font-bold uppercase tracking-widest transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Regenerate Design
                </button>
              )}
            </div>

            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Material Base</p>
                <p className="text-white font-bold">Recombinant Silk</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Weight Class</p>
                <p className="text-white font-bold">Ultra-Light (1.2kg)</p>
              </div>
            </div>

            <div className="p-6 glass rounded-2xl border-purple-500/20 bg-purple-500/5">
              <h4 className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.2em] mb-3">Technical Blueprint</h4>
              <ul className="space-y-2 text-[10px] font-mono text-slate-400">
                <li className="flex justify-between"><span>Lattice Geometry</span> <span className="text-white">Hex-A-Grid</span></li>
                <li className="flex justify-between"><span>Fiber Diameter</span> <span className="text-white">4.2 μm</span></li>
                <li className="flex justify-between"><span>Tensile Limit</span> <span className="text-white">1.2 GPa</span></li>
                <li className="flex justify-between"><span>Energy Absorption</span> <span className="text-white">165 J/g</span></li>
              </ul>
            </div>
          </div>

          <div className="relative bg-slate-900/50 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                  <p className="text-purple-400 font-mono text-xs animate-pulse uppercase tracking-widest">Synthesizing Visuals...</p>
                </motion.div>
              ) : image ? (
                <motion.div 
                  key="image"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full p-8"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img 
                      src={image} 
                      alt="Protein Vest Prototype" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Prototype v2.4</p>
                        <p className="text-white font-bold text-lg tracking-tight">Bio-Tactical Chassis</p>
                      </div>
                      <button className="p-3 rounded-xl glass glass-hover text-white">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : error ? (
                <div className="text-center p-8">
                  <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-400 font-mono text-sm uppercase tracking-widest">{error}</p>
                </div>
              ) : (
                <div className="text-center p-12 opacity-20">
                  <ImageIcon className="w-24 h-24 text-white mx-auto mb-6" />
                  <p className="text-white font-mono text-xs uppercase tracking-[0.4em]">Visualizer Standby</p>
                </div>
              )}
            </AnimatePresence>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-8 left-8 w-16 h-[1px] bg-white/10" />
              <div className="absolute top-8 left-8 w-[1px] h-16 bg-white/10" />
              <div className="absolute bottom-8 right-8 w-16 h-[1px] bg-white/10" />
              <div className="absolute bottom-8 right-8 w-[1px] h-16 bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import { RotateCcw as RotateIcon, ShieldAlert } from 'lucide-react';
