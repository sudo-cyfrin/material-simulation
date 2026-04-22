import React from 'react';
import { motion } from 'motion/react';
import { Users, User } from 'lucide-react';
import { cn } from '../types';

interface TeamMember {
  name: string;
  sapId: string;
  rollNo: string;
  photo: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Sarmistha Jena",
    sapId: "70362500082",
    rollNo: "E025",
    photo: "/sarmistha.jpeg"
  },
  {
    name: "Paridhi Ghoyal", 
    sapId: "70362500025",
    rollNo: "E014",
    photo: "/paridhi.jpeg"
  },
  {
    name: "Ishani Parate",
    sapId: "70362500009", 
    rollNo: "E042",
    photo: "/ishani.jpeg"
  }
];

export function TeamMembers() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass p-6 rounded-3xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Development Team</h3>
          <p className="text-xs text-slate-400">CsBs E1 Division</p>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="space-y-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
          >
            {/* Photo */}
            <div className="relative">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-purple-500/30">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Member Info */}
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm mb-1">{member.name}</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">SAP ID:</span>
                  <span className="text-xs font-mono text-purple-400">{member.sapId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Roll No:</span>
                  <span className="text-xs font-mono text-purple-400">{member.rollNo}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-slate-500">
            <span className="text-purple-400 font-bold">3 Members</span> · CsBs E1 Division
          </p>
        </div>
      </div>
    </motion.div>
  );
}
