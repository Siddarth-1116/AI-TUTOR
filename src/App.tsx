import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ResourcesView } from './components/ResourcesView';
import { TutorStudio } from './components/TutorStudio';
import { HistoryView } from './components/HistoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { UserAccount, HistoryItem, ChatMessage } from './types';
import { 
  getCurrentUser, 
  loginUser, 
  logoutUser, 
  updateUserProfile, 
  getUserHistory, 
  saveUserHistoryItem, 
  clearUserHistory, 
  toggleUserBookmark 
} from './utils/authStorage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const active = getCurrentUser();
    if (active) return active;
    const isExplicitlyLoggedOut = localStorage.getItem('synapse_logged_out_flag') === 'true';
    if (isExplicitlyLoggedOut) return null;
    return loginUser('25955a0538@iare.ac.in', 'Alex Sharma');
  });
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [history, setHistory] = useState<HistoryItem[]>(() => currentUser ? getUserHistory(currentUser.id) : []);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Cross-view navigation state
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string>('');
  const [loadedSessionMessages, setLoadedSessionMessages] = useState<ChatMessage[] | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  // Sync history when user changes
  useEffect(() => {
    if (currentUser) {
      setHistory(getUserHistory(currentUser.id));
    } else {
      setHistory([]);
    }
  }, [currentUser?.id]);

  const handleLogin = (personalId: string, name?: string, interests?: string[]) => {
    localStorage.removeItem('synapse_logged_out_flag');
    const user = loginUser(personalId, name, interests);
    setCurrentUser(user);
    setHistory(getUserHistory(user.id));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    localStorage.setItem('synapse_logged_out_flag', 'true');
    setCurrentUser(null);
    setHistory([]);
    setIsAuthModalOpen(false);
    setActiveTab('home');
  };

  const handleUpdateProfile = (updates: Partial<UserAccount>) => {
    const updated = updateUserProfile(updates);
    if (updated) setCurrentUser(updated);
  };

  const handleToggleBookmark = (resourceId: string) => {
    if (!currentUser) return;
    const updatedBookmarks = toggleUserBookmark(currentUser.id, resourceId);
    setCurrentUser((prev) => prev ? ({ ...prev, bookmarkedResourceIds: updatedBookmarks }) : null);
  };

  const handleSaveChatHistory = (title: string, preview: string, messages: ChatMessage[]) => {
    if (!currentUser) return;
    saveUserHistoryItem(currentUser.id, {
      type: 'chat',
      title,
      topic: currentUser.targetTopic,
      preview,
      messages,
    });
    setHistory(getUserHistory(currentUser.id));
  };

  const handleClearHistory = () => {
    if (!currentUser) return;
    clearUserHistory(currentUser.id);
    setHistory([]);
  };

  const handleResumeChatSession = (item: HistoryItem) => {
    if (item.messages && item.messages.length > 0) {
      setLoadedSessionMessages(item.messages);
    } else {
      setTutorInitialPrompt(`Let's resume exploring our previous session on: "${item.title}".`);
    }
    setActiveTab('chat');
  };

  const handleAskTutorPrompt = (prompt: string) => {
    setTutorInitialPrompt(prompt);
    setActiveTab('chat');
  };

  const handleOpenResourceReader = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    setActiveTab('resources');
  };

  // If user is logged out, render the dedicated LoginPage
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Navbar with exactly the 6 requested options */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 1. Home */}
        {activeTab === 'home' && (
          <HomeView
            currentUser={currentUser}
            history={history}
            onNavigate={setActiveTab}
            onOpenChatWithTopic={handleAskTutorPrompt}
            onOpenResourceReader={handleOpenResourceReader}
          />
        )}

        {/* 2. Resources */}
        {activeTab === 'resources' && (
          <ResourcesView
            currentUser={currentUser}
            onToggleBookmark={handleToggleBookmark}
            onAskTutorAboutResource={handleAskTutorPrompt}
            initialSelectedResourceId={selectedResourceId}
            onClearInitialSelectedResource={() => setSelectedResourceId(null)}
          />
        )}

        {/* 3. AI Tutor Chat */}
        {activeTab === 'chat' && (
          <TutorStudio
            currentUser={currentUser}
            initialPrompt={tutorInitialPrompt}
            onClearInitialPrompt={() => setTutorInitialPrompt('')}
            loadedSessionMessages={loadedSessionMessages}
            onSaveHistorySession={handleSaveChatHistory}
            onUpdateUser={handleUpdateProfile}
          />
        )}

        {/* 4. History */}
        {activeTab === 'history' && (
          <HistoryView
            currentUser={currentUser}
            history={history}
            onClearHistory={handleClearHistory}
            onResumeChatSession={handleResumeChatSession}
          />
        )}

        {/* 5. Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsView currentUser={currentUser} />
        )}

        {/* 6. Profile */}
        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Clean Anti-slop Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">SynapseAI</span>
            <span>—</span>
            <span>Personalized AI Learning Portal</span>
            <span>·</span>
            <span className="font-mono text-slate-400">ID: {currentUser.id}</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-slate-300 transition-colors">
              Home
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('resources')} className="hover:text-slate-300 transition-colors">
              Resources
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('chat')} className="hover:text-slate-300 transition-colors">
              AI Tutor Chat
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('history')} className="hover:text-slate-300 transition-colors">
              History
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-slate-300 transition-colors">
              Analytics
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('profile')} className="hover:text-slate-300 transition-colors">
              Profile
            </button>
          </div>
        </div>
      </footer>

      {/* Auth / Personal ID Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
}
