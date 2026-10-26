import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Building, 
  BookOpen, 
  Sliders, 
  Check, 
  LogOut, 
  UserCheck, 
  Save,
  Zap,
  Award
} from 'lucide-react';
import { UserAccount, LearningStyle, KnowledgeLevel } from '../types';

interface ProfileViewProps {
  currentUser: UserAccount;
  onUpdateProfile: (updates: Partial<UserAccount>) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateProfile,
  onOpenAuthModal,
  onLogout,
}) => {
  const [name, setName] = useState<string>(currentUser.name);
  const [institution, setInstitution] = useState<string>(currentUser.institution);
  const [role, setRole] = useState<string>(currentUser.role);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(currentUser.learningStyle);
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>(currentUser.knowledgeLevel);
  const [pace, setPace] = useState(currentUser.pace);
  const [targetTopic, setTargetTopic] = useState<string>(currentUser.targetTopic);
  const [primaryGoal, setPrimaryGoal] = useState<string>(currentUser.primaryGoal);
  const [interests, setInterests] = useState<string[]>(currentUser.interests || ['Artificial Intelligence', 'Mathematics', 'Computer Science']);
  const [newInterestTag, setNewInterestTag] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const learningStyles: { id: LearningStyle; title: string; desc: string }[] = [
    {
      id: 'Socratic & First-Principles',
      title: 'Socratic & Guided Inquiry',
      desc: 'Learns through targeted probing questions, uncovering principles by active deduction.',
    },
    {
      id: 'Visual & Spatial',
      title: 'Visual & Geometric Flow',
      desc: 'Prefers coordinate geometries, diagrams, and spatial flow mental models.',
    },
    {
      id: 'Analogical & Real-World',
      title: 'Analogical & Metaphorical',
      desc: 'Anchors complex math to everyday physical systems and tangible parallels.',
    },
    {
      id: 'Rigorous & Mathematical',
      title: 'Rigorous & Mathematical',
      desc: 'Derives formulas from invariants, tensor formulations, and analytical proofs.',
    },
    {
      id: 'ELI5 / Intuitive',
      title: 'Feynman Technique (ELI5)',
      desc: 'Crystalline intuition with zero unexplained technical jargon.',
    },
  ];

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterestTag.trim()) return;
    if (!interests.includes(newInterestTag.trim())) {
      setInterests([...interests, newInterestTag.trim()]);
    }
    setNewInterestTag('');
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter((i) => i !== tag));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      institution,
      role,
      learningStyle,
      knowledgeLevel,
      pace,
      targetTopic,
      primaryGoal,
      interests,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Profile ID Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 font-bold text-2xl font-mono">
            {name.charAt(0) || 'U'}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Verified Personal ID
              </span>
            </div>

            <div className="text-xs font-mono text-amber-300 mt-1 flex items-center gap-1.5">
              <span>Login ID:</span>
              <strong className="text-white">{currentUser.id}</strong>
            </div>

            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
              <span>{institution}</span>
              <span>·</span>
              <span>{role}</span>
              <span>·</span>
              <span>Member since {currentUser.joinedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenAuthModal}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch Login ID</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            title="Sign out of this session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Editable Cognitive & Personal Preferences Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Cognitive & Academic Settings</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Updates how the AI tutor constructs analogies, adjusts question depth, and sequences topics.
            </p>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-950 font-bold" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Changes Saved!' : 'Save Preferences'}</span>
          </button>
        </div>

        {/* Basic Info Fields in 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Student Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Institution / University
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Current Focus Subject */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Active Study Topic
          </label>
          <input
            type="text"
            value={targetTopic}
            onChange={(e) => setTargetTopic(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            placeholder="e.g. Neural Networks & Deep Learning"
          />
        </div>

        {/* Academic Interests (Stored in AI Tutor Memory) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Academic Interests (Stored in AI Tutor Memory)
          </label>
          <p className="text-xs text-slate-400 mb-2">
            The AI tutor holds these in memory to generate relatable examples and interdisciplinary connections.
          </p>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {interests.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(tag)}
                  className="text-amber-400 hover:text-white"
                  title="Remove interest"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newInterestTag}
              onChange={(e) => setNewInterestTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest(e);
                }
              }}
              placeholder="Add new academic interest (e.g. Robotics, Quantum Computing)..."
              className="flex-1 px-3.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Add Interest
            </button>
          </div>
        </div>

        {/* Cognitive Learning Style */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Cognitive Learning Style Preference
          </label>
          <div className="space-y-2">
            {learningStyles.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setLearningStyle(style.id)}
                className={`w-full p-3.5 rounded-lg border text-left transition-all flex items-start justify-between gap-3 ${
                  learningStyle === style.id
                    ? 'bg-amber-500/10 border-amber-500/80 shadow-xs'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-white">{style.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{style.desc}</div>
                </div>
                {learningStyle === style.id && (
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Knowledge Level & Study Intensity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Pacing
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

        {/* Primary Learning Objective */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Primary Learning Objective
          </label>
          <input
            type="text"
            value={primaryGoal}
            onChange={(e) => setPrimaryGoal(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </form>
    </div>
  );
};
