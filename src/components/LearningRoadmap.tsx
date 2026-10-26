import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Play, 
  RotateCw,
  Award
} from 'lucide-react';
import { RoadmapModule, StudentProfile } from '../types';

interface LearningRoadmapProps {
  roadmap: RoadmapModule[];
  profile: StudentProfile;
  onSelectModule: (module: RoadmapModule) => void;
  onOpenSandbox: (slug?: string) => void;
  onGenerateNewRoadmap: (topic: string, goal: string) => Promise<void>;
  isLoadingRoadmap?: boolean;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({
  roadmap,
  profile,
  onSelectModule,
  onOpenSandbox,
  onGenerateNewRoadmap,
  isLoadingRoadmap = false,
}) => {
  const [customGoal, setCustomGoal] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.topic) return;
    setIsGenerating(true);
    try {
      await onGenerateNewRoadmap(profile.topic, customGoal || profile.primaryGoal);
    } finally {
      setIsGenerating(false);
    }
  };

  const completedCount = roadmap.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (roadmap.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Visual Roadmap Hero Split */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-amber-400 mb-1 flex items-center gap-1.5">
              <span>ADAPTIVE LEARNING PATHWAY</span>
              <span>·</span>
              <span>{profile.pace.toUpperCase()}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {profile.topic}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
              Sequenced around your cognitive profile: <strong className="text-amber-300">{profile.learningStyle}</strong>. Each milestone unlocks verified mastery criteria before proceeding to higher-order synthesis.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6">
            <div>
              <span className="text-xs text-slate-400 block font-mono">ROADMAP PROGRESS</span>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums mt-0.5">
                {progressPercent}%
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-mono">MILESTONES COMPLETE</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums mt-0.5">
                {completedCount} / {roadmap.length}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-mono">ESTIMATED EFFORT</span>
              <div className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums mt-0.5">
                {roadmap.reduce((acc, m) => acc + m.estimatedHours, 0)} hrs
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative bg-slate-950 min-h-[220px] lg:min-h-full">
          <img
            src="/src/assets/images/roadmap_progression_1792951137292.jpg"
            alt="Adaptive roadmap visualization"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-900 lg:to-transparent" />
        </div>
      </div>

      {/* AI Roadmap Regeneration Prompt Tray */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-white block sm:inline">Want a specialized curriculum focus?</span>{' '}
          Regenerate an AI-tailored pathway for your specific project or exam objectives.
        </div>
        <form onSubmit={handleGenerate} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="e.g. Focus on Transformers & Attention"
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={isGenerating || isLoadingRoadmap}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate Roadmap</span>
          </button>
        </form>
      </div>

      {/* Roadmap Modules List */}
      <div className="space-y-4">
        {roadmap.map((module, index) => {
          const isCompleted = module.status === 'completed';
          const isInProgress = module.status === 'in-progress';
          const isLocked = module.status === 'locked';

          return (
            <div
              key={module.id}
              className={`p-5 rounded-xl border transition-all ${
                isInProgress
                  ? 'bg-slate-900 border-amber-500/60 shadow-lg'
                  : isCompleted
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isInProgress ? (
                      <Circle className="w-5 h-5 text-amber-400 animate-pulse" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <span>MODULE {index + 1}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{module.estimatedHours}h</span>
                      </span>
                      <span>·</span>
                      <span
                        className={
                          isCompleted
                            ? 'text-emerald-400 font-semibold'
                            : isInProgress
                            ? 'text-amber-400 font-semibold'
                            : 'text-slate-500'
                        }
                      >
                        {module.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-0.5">
                      {module.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                      {module.summary}
                    </p>

                    {/* Key Concepts Unboxed Text Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-2.5">
                      <span className="font-semibold text-slate-300">Core Concepts:</span>
                      {module.keyConcepts.map((c, i) => (
                        <React.Fragment key={i}>
                          <span className="text-slate-300">{c}</span>
                          {i < module.keyConcepts.length - 1 && <span>·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2.5 sm:self-center shrink-0">
                  {module.masteryScore > 0 && (
                    <div className="text-right hidden sm:block mr-2 font-mono">
                      <span className="text-[10px] text-slate-400 block">MASTERY</span>
                      <span className="text-sm font-bold text-emerald-400 tabular-nums">
                        {module.masteryScore}%
                      </span>
                    </div>
                  )}

                  {module.simulationSlug && (
                    <button
                      onClick={() => onOpenSandbox(module.simulationSlug)}
                      className="px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Sandbox</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectModule(module)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      isInProgress
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        : isCompleted
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : 'bg-slate-800/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{isCompleted ? 'Review with Tutor' : isInProgress ? 'Resume Module' : 'Preview'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
