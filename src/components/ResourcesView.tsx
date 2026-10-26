import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  ArrowRight, 
  X, 
  FileText, 
  Sparkles,
  Download,
  MessageSquare
} from 'lucide-react';
import { ResourceItem, UserAccount } from '../types';
import { LEARNING_RESOURCES } from '../data/learningResources';

interface ResourcesViewProps {
  currentUser: UserAccount;
  onToggleBookmark: (resourceId: string) => void;
  onAskTutorAboutResource: (prompt: string) => void;
  initialSelectedResourceId?: string | null;
  onClearInitialSelectedResource?: () => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  currentUser,
  onToggleBookmark,
  onAskTutorAboutResource,
  initialSelectedResourceId,
  onClearInitialSelectedResource,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeResourceId, setActiveResourceId] = useState<string | null>(initialSelectedResourceId || null);

  const categories = ['all', 'bookmarked', 'Neural Networks & Deep Learning', 'Probability & Statistics', 'Optimization & Algorithms', 'Cognitive Science & Learning'];

  const filteredResources = LEARNING_RESOURCES.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'bookmarked') {
      return (currentUser.bookmarkedResourceIds || []).includes(res.id);
    }
    if (selectedCategory !== 'all') {
      return res.category === selectedCategory;
    }
    return true;
  });

  const activeResource = LEARNING_RESOURCES.find((r) => r.id === activeResourceId);

  const handleDownloadResource = (res: ResourceItem) => {
    const blob = new Blob([res.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${res.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs font-mono text-amber-400 mb-0.5">
            CURATED KNOWLEDGE BASE · {currentUser.id}
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Learning Resources & Study Guides
          </h2>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources, topics, tags..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors capitalize ${
              selectedCategory === cat
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Resources' : cat === 'bookmarked' ? 'My Saved Bookmarks' : cat}
          </button>
        ))}
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => {
          const isBookmarked = (currentUser.bookmarkedResourceIds || []).includes(res.id);

          return (
            <div
              key={res.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[11px] font-mono text-amber-400/90 font-medium line-clamp-1">
                    {res.category}
                  </span>
                  <button
                    onClick={() => onToggleBookmark(res.id)}
                    className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                  {res.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {res.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{res.estimatedReadTime}</span>
                </span>

                <button
                  onClick={() => setActiveResourceId(res.id)}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No matching resources found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or category filters.</p>
        </div>
      )}

      {/* Reader Modal */}
      {activeResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
              <div>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                  {activeResource.category} · {activeResource.estimatedReadTime}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">{activeResource.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleBookmark(activeResource.id)}
                  className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Bookmark"
                >
                  {(currentUser.bookmarkedResourceIds || []).includes(activeResource.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDownloadResource(activeResource)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Download Markdown"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveResourceId(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {activeResource.content}
            </div>

            {/* Modal Footer with Ask Tutor CTA */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Want to test your understanding of this resource?
              </span>
              <button
                onClick={() => {
                  const prompt = `I am reading the resource: "${activeResource.title}". Can you give me a Socratic question to test if I truly understand its core intuition?`;
                  setActiveResourceId(null);
                  onAskTutorAboutResource(prompt);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discuss with AI Tutor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
