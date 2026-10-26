import React, { useState } from 'react';
import { X, Check, Brain, Sparkles, BookOpen, Layers } from 'lucide-react';
import { StudentProfile, LearningStyle, KnowledgeLevel } from '../types';
import { CURATED_TRACKS } from '../data/curatedTracks';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSave: (updated: StudentProfile) => void;
  onSelectTrack: (trackId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onSelectTrack,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(profile.learningStyle);
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>(profile.knowledgeLevel);
  const [pace, setPace] = useState(profile.pace);
  const [topic, setTopic] = useState(profile.topic);
  const [primaryGoal, setPrimaryGoal] = useState(profile.primaryGoal);

  const learningStyles: { id: LearningStyle; title: string; desc: string }[] = [
    {
      id: 'Socratic & First-Principles',
      title: 'Socratic & Guided Inquiry',
      desc: 'Learns through targeted probing questions, uncovering contradictions and principles by deduction.',
    },
    {
      id: 'Visual & Spatial',
      title: 'Visual & Geometric Flow',
      desc: 'Prefers ASCII diagrams, geometric representations, and spatial coordinate mental models.',
    },
    {
      id: 'Analogical & Real-World',
      title: 'Analogical & Metaphorical',
      desc: 'Anchors abstractions to physical machinery, everyday scenarios, and intuitive parallels.',
    },
    {
      id: 'Rigorous & Mathematical',
      title: 'Rigorous & Mathematical',
      desc: 'Craves formal definitions, calculus/linear algebra derivations, and exact invariant conditions.',
    },
    {
      id: 'ELI5 / Intuitive',
      title: 'Feynman Technique (ELI5)',
      desc: 'Crystalline clarity without gatekeeping jargon. Simple, vivid, first-principles language.',
    },
  ];

  const handleSave = () => {
    onSave({
      ...profile,
      name,
      learningStyle,
      knowledgeLevel,
      pace,
      topic,
      primaryGoal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Personalized Learner Profile</h2>
            <p className="text-xs text-slate-400 mt-1">
              Customize how your AI tutor shapes explanations, questioning depth, and roadmaps.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 py-4">
          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Learner Identifier
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              placeholder="e.g. Alex"
            />
          </div>

          {/* Current Focus Topic & Curated Tracks */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Current Subject Track
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
              {CURATED_TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTopic(t.name);
                    setPrimaryGoal(t.suggestedGoal);
                    onSelectTrack(t.id);
                  }}
                  className={`p-3 text-left rounded-lg border text-xs transition-colors ${
                    topic === t.name
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{t.category}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Or enter any custom topic (e.g. Graph Neural Networks, Photosynthesis)"
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Cognitive Learning Style */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Cognitive Learning Style
            </label>
            <div className="space-y-2">
              {learningStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setLearningStyle(style.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all flex items-start justify-between gap-3 ${
                    learningStyle === style.id
                      ? 'bg-amber-500/10 border-amber-500/80 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{style.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{style.desc}</div>
                  </div>
                  {learningStyle === style.id && (
                    <span className="text-amber-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Knowledge Level & Pace in 2-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Knowledge Level
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
                {(['Novice', 'Intermediate', 'Advanced'] as KnowledgeLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setKnowledgeLevel(level)}
                    className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                      knowledgeLevel === level
                        ? 'bg-slate-800 text-amber-300 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Study Intensity
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
                {(['Self-Paced', 'Balanced', 'Intensive'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPace(p)}
                    className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                      pace === p
                        ? 'bg-slate-800 text-amber-300 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Learning Goal */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Primary Learning Objective
            </label>
            <input
              type="text"
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              placeholder="e.g. Master gradient backprop to implement custom loss functions from scratch"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
          >
            Apply & Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
