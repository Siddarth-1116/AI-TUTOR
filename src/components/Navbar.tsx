import React from 'react';
import { UserCheck, Shield, LogIn, ChevronDown, LogOut } from 'lucide-react';
import { UserAccount } from '../types';

export type NavTab = 'home' | 'resources' | 'chat' | 'history' | 'analytics' | 'profile';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: UserAccount;
  onOpenAuth: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('home');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block" />
          <span>SynapseAI</span>
        </a>

        {/* Zone 2: Exactly the 6 requested options */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'home'
                ? 'text-white border-amber-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'resources'
                ? 'text-white border-amber-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Resources
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'chat'
                ? 'text-white border-amber-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            AI Tutor Chat
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'history'
                ? 'text-white border-amber-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            History
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'analytics'
                ? 'text-white border-amber-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Analytics
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'profile'
                ? 'text-white border-amber-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Profile
          </button>
        </nav>

        {/* Zone 3: 1 primary action displaying personal login ID and quick sign out */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
            title="Click to switch personal login ID"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-amber-300 max-w-[140px] sm:max-w-[180px] truncate">
              {currentUser.id}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 rounded-md transition-colors flex items-center gap-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Navigation Scroll Strip */}
      <div className="lg:hidden flex items-center gap-5 px-4 py-2 border-t border-slate-800/60 overflow-x-auto text-xs font-medium text-slate-300 no-scrollbar">
        <button
          onClick={() => setActiveTab('home')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'home' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'resources' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          Resources
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'chat' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          AI Tutor Chat
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'history' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'analytics' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'profile' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          Profile
        </button>
      </div>
    </header>
  );
};
