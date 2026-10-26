import React, { useState } from 'react';
import { 
  LogIn, 
  Sparkles, 
  ShieldCheck, 
  Brain, 
  BookOpen, 
  Award, 
  ArrowRight,
  CheckCircle2,
  Atom,
  ChevronRight
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (personalId: string, name?: string, interests?: string[]) => void;
}

const POPULAR_INTERESTS = [
  'Artificial Intelligence',
  'Deep Learning & Neural Networks',
  'Mathematics & Proofs',
  'Calculus & Linear Algebra',
  'Algorithms & Data Structures',
  'Python & PyTorch',
  'Quantum Computing',
  'Physics & Mechanics',
  'Web & Systems Engineering',
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [personalId, setPersonalId] = useState<string>('25955a0538@iare.ac.in');
  const [studentName, setStudentName] = useState<string>('Alex Sharma');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Artificial Intelligence',
    'Mathematics & Proofs',
    'Python & PyTorch',
  ]);
  const [customInterestInput, setCustomInterestInput] = useState<string>('');

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddCustomInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customInterestInput.trim()) {
      e.preventDefault();
      if (!selectedInterests.includes(customInterestInput.trim())) {
        setSelectedInterests([...selectedInterests, customInterestInput.trim()]);
      }
      setCustomInterestInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalId.trim()) return;
    onLogin(personalId.trim(), studentName.trim() || undefined, selectedInterests);
  };

  const selectPreset = (id: string, name: string, interests: string[]) => {
    setPersonalId(id);
    setStudentName(name);
    setSelectedInterests(interests);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-300 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-amber-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-sm">
            <Atom className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">SynapseAI</span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-mono">
              IARE Academic Learning Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gemini 3.8 Flash Ready</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-1">
              <Brain className="w-3.5 h-3.5" />
              <span>Personalized AI Learning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign In with Your Student ID
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Access your personalized Gemini AI tutor with active memory of your name, learning style, and academic interests.
            </p>
          </div>

          {/* Quick Select Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Quick Select Account
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => selectPreset(
                  '25955a0538@iare.ac.in',
                  'Alex Sharma',
                  ['Artificial Intelligence', 'Mathematics & Proofs', 'Python & PyTorch']
                )}
                className={`p-3 rounded-xl border text-left transition-all ${
                  personalId === '25955a0538@iare.ac.in'
                    ? 'bg-amber-500/15 border-amber-500/80 shadow-xs'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Alex Sharma</span>
                  {personalId === '25955a0538@iare.ac.in' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <div className="text-[11px] font-mono text-amber-300 truncate mt-0.5">
                  25955a0538@iare.ac.in
                </div>
                <div className="text-[10px] text-slate-400 mt-1">CS & AI Scholar (IARE)</div>
              </button>

              <button
                type="button"
                onClick={() => selectPreset(
                  'demo.student@iare.ac.in',
                  'Priya Patel',
                  ['Probability & Statistics', 'Data Science', 'Machine Learning']
                )}
                className={`p-3 rounded-xl border text-left transition-all ${
                  personalId === 'demo.student@iare.ac.in'
                    ? 'bg-amber-500/15 border-amber-500/80 shadow-xs'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Priya Patel</span>
                  {personalId === 'demo.student@iare.ac.in' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <div className="text-[11px] font-mono text-amber-300 truncate mt-0.5">
                  demo.student@iare.ac.in
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Data Science Scholar</div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Personal Student ID / College Email <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={personalId}
                onChange={(e) => setPersonalId(e.target.value)}
                placeholder="e.g. 25955a0538@iare.ac.in"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Student Name (What Gemini will address you as)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Alex Sharma"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>

            {/* Academic Interests (Stored in Chat Memory) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-amber-400" />
                  <span>Academic Interests & Topics (AI Memory)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedInterests.length} selected
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                Gemini memorizes these topics and tailors mathematical analogies and explanations to them:
              </p>

              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {POPULAR_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleToggleInterest(interest)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={customInterestInput}
                onChange={(e) => setCustomInterestInput(e.target.value)}
                onKeyDown={handleAddCustomInterest}
                placeholder="Type other interest and press Enter..."
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <span>Sign In to Learning Portal</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>

          {/* Privacy & Safety Note */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Isolated Local Persistence</span>
            </span>
            <span>History & Memory Saved Locally</span>
          </div>
        </div>
      </main>

      {/* Feature Footnotes */}
      <footer className="px-6 py-6 max-w-5xl mx-auto w-full relative z-10 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span>Persistent Tutor Memory</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Gemini 3.8 Flash</span>
          </span>
        </div>
        <div>
          <span>Institute of Aeronautical Engineering · Personal Learning Engine</span>
        </div>
      </footer>
    </div>
  );
};
