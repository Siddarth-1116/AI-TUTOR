import React from 'react';
import { 
  Flame, 
  Target, 
  Clock, 
  Award, 
  MessageSquare, 
  BookOpen, 
  History as HistoryIcon, 
  BarChart2, 
  ArrowRight, 
  Sparkles,
  Zap,
  BookmarkCheck
} from 'lucide-react';
import { UserAccount, HistoryItem } from '../types';
import { NavTab } from './Navbar';
import { LEARNING_RESOURCES } from '../data/learningResources';

interface HomeViewProps {
  currentUser: UserAccount;
  history: HistoryItem[];
  onNavigate: (tab: NavTab) => void;
  onOpenChatWithTopic?: (topic: string) => void;
  onOpenResourceReader?: (resourceId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  history,
  onNavigate,
  onOpenChatWithTopic,
  onOpenResourceReader,
}) => {
  const recentHistory = history.slice(0, 3);
  const featuredResource = LEARNING_RESOURCES[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Personalized Welcome Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-amber-400 mb-2 flex flex-wrap items-center gap-2">
              <span>PERSONALIZED PORTAL</span>
              <span>·</span>
              <span className="text-slate-300 font-semibold">{currentUser.institution}</span>
              <span>·</span>
              <span className="text-emerald-400 font-mono">ID: {currentUser.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed max-w-xl">
              Your AI tutor is configured for <strong className="text-amber-300">{currentUser.learningStyle}</strong> in <strong className="text-white">{currentUser.targetTopic}</strong>. Ready to continue your mastery journey?
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('chat')}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Launch AI Tutor Chat</span>
            </button>
            <button
              onClick={() => onNavigate('resources')}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Study Resources</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative bg-slate-950 min-h-[220px] lg:min-h-full">
          <img
            src="/src/assets/images/hero_ai_tutor_learning_1792951103943.jpg"
            alt="Personalized Learning Tree"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-900 lg:to-transparent" />
        </div>
      </div>

      {/* 4 Personal KPI Cards tied to Login ID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
            {currentUser.streakDays} <span className="text-sm font-sans font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Continuous daily inquiry
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Average Mastery</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {currentUser.averageMastery}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Calibrated to {currentUser.knowledgeLevel}
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Study Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono tabular-nums">
            {currentUser.studyHours} <span className="text-sm font-sans font-normal text-slate-400">hrs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Logged under {currentUser.id}
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Concepts Mastered</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono tabular-nums">
            {currentUser.conceptsMastered}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across active modules
          </div>
        </div>
      </div>

      {/* Main Home Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Learning History (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <HistoryIcon className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">Recent Activity</h2>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentHistory.length > 0 ? (
            <div className="space-y-3">
              {recentHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span className="uppercase text-amber-400/90 font-semibold">{item.type}</span>
                      <span>·</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-1">{item.preview}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (item.type === 'chat') {
                        onNavigate('chat');
                      } else if (item.type === 'resource') {
                        onNavigate('resources');
                      } else {
                        onNavigate('history');
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors shrink-0 mt-1"
                    title="Resume or inspect"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent activity found. Start a conversation with your AI Tutor!
            </div>
          )}
        </div>

        {/* Right Column: Featured Learning Resource & Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Featured Resource Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-amber-400 font-semibold">
                RECOMMENDED STUDY GUIDE
              </span>
              <span className="text-[11px] font-mono text-slate-400">{featuredResource.estimatedReadTime}</span>
            </div>

            <h3 className="text-sm font-bold text-white">{featuredResource.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{featuredResource.summary}</p>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  if (onOpenResourceReader) {
                    onOpenResourceReader(featuredResource.id);
                  } else {
                    onNavigate('resources');
                  }
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>Read Resource Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('resources')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                All Resources
              </button>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('analytics')}
              className="p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-left transition-colors flex flex-col justify-between h-24"
            >
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-white">Analytics Hub</div>
                <div className="text-[11px] text-slate-400">Mastery breakdown</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className="p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-left transition-colors flex flex-col justify-between h-24"
            >
              <Award className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs font-bold text-white">Learner Profile</div>
                <div className="text-[11px] text-slate-400">{currentUser.learningStyle.split(' ')[0]} mode</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
