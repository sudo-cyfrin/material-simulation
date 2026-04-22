import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, FileText, Eye, ExternalLink } from 'lucide-react';
import { cn } from '../types';

interface PowerPointViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const POWERPOINT_FILE = '/Green Geometric Gradient SWOT Analysis Professional Animation Presentation.pptx';
const PDF_FILE = '/Green Geometric Gradient SWOT Analysis Professional Animation Presentation.pdf';
const CANVA_LINK = 'https://www.canva.com/design/DAHB-HuE_jc/TJ5weLDBRYxryjEtNCns3w/edit';

export function PowerPointViewer({ isOpen, onClose }: PowerPointViewerProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleDownload = () => {
    // Open Canva link in new tab
    window.open(CANVA_LINK, '_blank');
  };

  const handlePreview = () => {
    // Open PDF in new tab for preview
    window.open(PDF_FILE, '_blank');
  };

  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">PowerPoint Presentation</h2>
                <p className="text-sm text-slate-400">SWOT Analysis Professional Animation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Preview Section */}
            <div className="glass p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Document Information</h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <FileText className="w-4 h-4" />
                  <span>.pptx</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-12 text-center border border-purple-500/20">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">SWOT Analysis Presentation</h4>
                <p className="text-slate-400 mb-4">Professional Animation Presentation</p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-6">
                  <span>PowerPoint Document</span>
                  <span>•</span>
                  <span>~117 MB</span>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                  <p className="text-purple-400 text-sm">
                    <strong>Great options!</strong> Preview the PDF for quick viewing or open in Canva to edit the presentation online.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handlePreview}
                className="glass p-6 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-bold">Preview PDF</h4>
                    <p className="text-sm text-slate-400">View in browser</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleDownload}
                className="glass p-6 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-bold">Open in Canva</h4>
                    <p className="text-sm text-slate-400">Edit presentation online</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Instructions */}
            <div className="glass p-6 rounded-2xl">
              <h4 className="text-white font-bold mb-3">Instructions</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">·</span>
                  <span>Click "Preview PDF" to view the presentation in your browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">·</span>
                  <span>Click "Open in Canva" to edit the presentation online</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">·</span>
                  <span>Canva allows you to view and edit the presentation directly</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
