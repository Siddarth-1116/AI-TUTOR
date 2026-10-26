import React, { useState } from 'react';
import { X, UserCheck, LogIn, ArrowRight, Shield, Sparkles, LogOut } from 'lucide-react';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onLogin: (personalId: string, name?: string) => void;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  if (!isOpen) return null;

  const [personalId, setPersonalId] = useState<string>(currentUser.id);
  const [studentName, setStudentName] = useState<string>(currentUser.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalId.trim()) return;
    onLogin(personalId.trim(), studentName.trim());
    onClose();
  };

  const handleQuickLogin = (id: string, name: string) => {
    onLogin(id, name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Personal Login Portal</h2>
              <p className="text-xs text-slate-400">Sign in with your personal student ID or email</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Account Indicator */}
        <div className="my-4 p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Current Active Login ID:</span>
            <span className="font-semibold text-amber-300 font-mono">{currentUser.id}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Active Session
          </span>
        </div>

        {/* Quick Demo Login Cards */}
        <div className="space-y-1.5 mb-5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Quick One-Click Sign In:
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('25955a0538@iare.ac.in', 'Alex Sharma')}
              className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                currentUser.id === '25955a0538@iare.ac.in'
                  ? 'bg-amber-500/10 border-amber-500/60 text-amber-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="font-semibold text-white">25955a0538@iare.ac.in</div>
                <div className="text-[10px] text-slate-400">Alex Sharma · IARE CS & AI Scholar</div>
              </div>
              <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('demo.student@iare.ac.in', 'Priya Patel')}
              className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                currentUser.id === 'demo.student@iare.ac.in'
                  ? 'bg-amber-500/10 border-amber-500/60 text-amber-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="font-semibold text-white">demo.student@iare.ac.in</div>
                <div className="text-[10px] text-slate-400">Priya Patel · Data Science</div>
              </div>
              <UserCheck className="w-4 h-4 text-slate-500 shrink-0" />
            </button>
          </div>
        </div>

        {/* Custom Personal Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Or Enter Any Personal Login ID / Email
            </label>
            <input
              type="text"
              required
              value={personalId}
              onChange={(e) => setPersonalId(e.target.value)}
              placeholder="e.g. 25955a0538@iare.ac.in or student_id"
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name (Optional)
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Alex Sharma"
              className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-2">
            {onLogout ? (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Switch to this ID</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
