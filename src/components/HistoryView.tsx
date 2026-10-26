import React, { useState } from 'react';
import { 
  History as HistoryIcon, 
  MessageSquare, 
  Award, 
  BookOpen, 
  Search, 
  Trash2, 
  ArrowRight, 
  ExternalLink,
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import { HistoryItem, UserAccount } from '../types';

interface HistoryViewProps {
  currentUser: UserAccount;
  history: HistoryItem[];
  onClearHistory: () => void;
  onResumeChatSession: (item: HistoryItem) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  currentUser,
  history,
  onClearHistory,
  onResumeChatSession,
}) => {
  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewingItem, setViewingItem] = useState<HistoryItem | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.preview.toLowerCase().includes(search.toLowerCase()) ||
      item.topic.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType !== 'all') {
      return item.type === filterType;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs font-mono text-amber-400 mb-0.5">
            PERSONAL ACTIVITY TIMELINE · {currentUser.id}
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Learning History & Session Logs
          </h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history sessions..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Clear all session history for this ID"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {(['all', 'chat', 'quiz', 'resource'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors capitalize ${
              filterType === type
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {type === 'all' ? 'All Activity' : type === 'chat' ? 'AI Tutor Chats' : type === 'quiz' ? 'Diagnostic Quizzes' : 'Resource Notes'}
          </button>
        ))}
      </div>

      {/* History Items Feed */}
      <div className="space-y-3">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 shrink-0 mt-0.5">
                {item.type === 'chat' ? (
                  <MessageSquare className="w-4 h-4" />
                ) : item.type === 'quiz' ? (
                  <Award className="w-4 h-4" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                  <span className="uppercase text-amber-400 font-semibold">{item.type}</span>
                  <span>·</span>
                  <span>{item.timestamp}</span>
                  <span>·</span>
                  <span className="text-slate-300">{item.topic}</span>
                  {item.score !== undefined && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-400 font-semibold font-mono">Score: {item.score}%</span>
                    </>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">{item.preview}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 sm:self-center">
              {item.messages && item.messages.length > 0 && (
                <button
                  onClick={() => setViewingItem(item)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  View Transcript
                </button>
              )}

              <button
                onClick={() => onResumeChatSession(item)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Resume in Tutor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredHistory.length === 0 && (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <HistoryIcon className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No history records found</h3>
            <p className="text-xs text-slate-400">
              Activity performed with your login ID ({currentUser.id}) will automatically appear here.
            </p>
          </div>
        )}
      </div>

      {/* Transcript Detail Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                  SESSION TRANSCRIPT · {viewingItem.timestamp}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{viewingItem.title}</h3>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {viewingItem.messages?.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-100 ml-8'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">
                      {msg.role === 'user' ? currentUser.name : 'AI Tutor'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => {
                  onResumeChatSession(viewingItem);
                  setViewingItem(null);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Continue this Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
