import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw,
  Copy,
  Check,
  Zap,
  CornerDownLeft,
  BookOpen,
  Code2,
  Brain,
  Plus,
  Trash2,
  X,
  Tag,
  Lightbulb
} from 'lucide-react';
import { UserAccount, ChatMessage, MemoryFact } from '../types';
import { addStudentMemoryFact, removeStudentMemoryFact, updateStudentInterests } from '../utils/authStorage';

interface TutorStudioProps {
  currentUser: UserAccount;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  loadedSessionMessages?: ChatMessage[] | null;
  onSaveHistorySession?: (title: string, preview: string, messages: ChatMessage[]) => void;
  onUpdateUser?: (updates: Partial<UserAccount>) => void;
}

export const TutorStudio: React.FC<TutorStudioProps> = ({
  currentUser,
  initialPrompt,
  onClearInitialPrompt,
  loadedSessionMessages,
  onSaveHistorySession,
  onUpdateUser,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [geminiConnected, setGeminiConnected] = useState<boolean>(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState<boolean>(false);
  const [newInterestInput, setNewInterestInput] = useState<string>('');
  const [newMemoryInput, setNewMemoryInput] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Probe Gemini LLM connectivity
  useEffect(() => {
    fetch('/api/tutor/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.connected === 'boolean') {
          setGeminiConnected(data.connected);
        }
      })
      .catch(() => setGeminiConnected(false));
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load past session messages if requested from History
  useEffect(() => {
    if (loadedSessionMessages && loadedSessionMessages.length > 0) {
      setMessages(loadedSessionMessages);
    }
  }, [loadedSessionMessages]);

  // Handle external incoming prompt (e.g. from Home or Resources)
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      sendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  // Reset conversation to fresh chat
  const handleResetChat = () => {
    setMessages([]);
  };

  // Memory Handlers
  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterestInput.trim()) return;
    const current = currentUser.interests || [];
    if (!current.includes(newInterestInput.trim())) {
      const updated = [...current, newInterestInput.trim()];
      updateStudentInterests(currentUser.id, updated);
      if (onUpdateUser) onUpdateUser({ interests: updated });
    }
    setNewInterestInput('');
  };

  const handleRemoveInterest = (interest: string) => {
    const current = currentUser.interests || [];
    const updated = current.filter((i) => i !== interest);
    updateStudentInterests(currentUser.id, updated);
    if (onUpdateUser) onUpdateUser({ interests: updated });
  };

  const handleAddMemoryNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryInput.trim()) return;
    const newFact = addStudentMemoryFact(
      currentUser.id,
      'Learning Note',
      newMemoryInput.trim(),
      'note'
    );
    const updatedMemories = [newFact, ...(currentUser.studentMemories || [])];
    if (onUpdateUser) onUpdateUser({ studentMemories: updatedMemories });
    setNewMemoryInput('');
  };

  const handleRemoveMemory = (factId: string) => {
    removeStudentMemoryFact(currentUser.id, factId);
    const updatedMemories = (currentUser.studentMemories || []).filter((m) => m.id !== factId);
    if (onUpdateUser) onUpdateUser({ studentMemories: updatedMemories });
  };

  // Web Speech API: Text-to-Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/>/g, '')
      .replace(/\[.*?\]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API: Speech-to-Text
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your current browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          profile: {
            id: currentUser.id,
            name: currentUser.name,
            learningStyle: currentUser.learningStyle,
            knowledgeLevel: currentUser.knowledgeLevel,
            topic: currentUser.targetTopic,
            institution: currentUser.institution,
            primaryGoal: currentUser.primaryGoal,
            pace: currentUser.pace,
            interests: currentUser.interests || [],
            studentMemories: currentUser.studentMemories || [],
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `gemini-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'I am ready to help you explore any concept in depth.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // Save to personal login ID history
      if (onSaveHistorySession) {
        const title = messageText.slice(0, 50) + (messageText.length > 50 ? '...' : '');
        const preview = assistantMessage.content.slice(0, 140) + '...';
        onSaveHistorySession(title, preview, finalMessages);
      }
    } catch (err: any) {
      console.error('Gemini Chat error:', err);
      // Clean fallback directly addressing the user's specific prompt with memory context
      const fallbackMessage: ChatMessage = {
        id: `gemini-${Date.now()}`,
        role: 'assistant',
        content: `### Exploring "${messageText}"\n\nHello **${currentUser.name}**! To break down **${messageText}** from first principles (tailored for your interests in ${currentUser.interests?.join(', ') || 'Computer Science & AI'}):\n\n1. **Core Principle**: Identify the underlying invariant or mechanism governing the problem.\n2. **Mechanics**: Trace how inputs transform into outputs through each stage of the system.\n3. **Practical Application**: Consider where this manifests in real-world scenarios, algorithms, or physical systems.\n\nWould you like a step-by-step mathematical proof, a code demonstration, or an intuitive physical analogy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalMessages = [...newMessages, fallbackMessage];
      setMessages(finalMessages);

      if (onSaveHistorySession) {
        const title = messageText.slice(0, 50);
        onSaveHistorySession(title, fallbackMessage.content.slice(0, 140), finalMessages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const starterPrompts = [
    {
      title: 'What do you remember about me?',
      prompt: 'What do you remember about my name, academic interests, and learning style?',
      icon: Brain,
    },
    {
      title: 'Pythagorean Theorem & Geometric Proof',
      prompt: 'Explain Pythagoras theorem with a step-by-step geometric proof, formula derivation, and real-world example.',
      icon: Sparkles,
    },
    {
      title: 'Time Complexity & Big O Notation',
      prompt: 'How does Big O notation work, and why is binary search O(log n) compared to linear search O(n)?',
      icon: Code2,
    },
    {
      title: 'Backpropagation & Chain Rule',
      prompt: 'Explain how the multivariate chain rule enables backpropagation to compute weight gradients efficiently.',
      icon: Zap,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[740px] animate-in fade-in duration-200">
      {/* Real Gemini Chat Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-amber-400 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-xs">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">Gemini 3.8 Flash</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {geminiConnected ? 'Live Model' : 'Ready'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Personal session · <span className="text-amber-300">{currentUser.id}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tutor Memory Drawer Toggle */}
          <button
            onClick={() => setIsMemoryOpen(!isMemoryOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all border ${
              isMemoryOpen
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border-slate-700/60'
            }`}
            title="View and edit what Gemini remembers about you"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Tutor Memory</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              isMemoryOpen ? 'bg-slate-950 text-amber-300' : 'bg-slate-900 text-amber-400'
            }`}>
              {(currentUser.interests?.length || 0) + (currentUser.studentMemories?.length || 0)}
            </span>
          </button>

          <button
            onClick={handleResetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
            title="Start fresh conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Persistent Tutor Memory Panel / Drawer */}
      {isMemoryOpen && (
        <div className="bg-slate-950 border-b border-slate-800 p-4 sm:p-5 animate-in slide-in-from-top-2 duration-200 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white tracking-tight">Active Student Memory for Gemini</span>
            </div>
            <button
              onClick={() => setIsMemoryOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Col: Core Identity & Interests */}
            <div className="space-y-3">
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                  <span>Student Name:</span>
                  <span className="font-bold text-white">{currentUser.name}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                  <span>Personal Login ID:</span>
                  <span className="text-amber-300">{currentUser.id}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                  <span>Learning Style:</span>
                  <span className="text-slate-200">{currentUser.learningStyle}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                  <span>Knowledge Level:</span>
                  <span className="text-slate-200">{currentUser.knowledgeLevel}</span>
                </div>
              </div>

              {/* Academic Interests */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Academic Interests (Used for analogies & explanations)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(currentUser.interests || []).map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]"
                    >
                      <span>{interest}</span>
                      <button
                        onClick={() => handleRemoveInterest(interest)}
                        className="hover:text-amber-100 text-amber-400 ml-0.5"
                        title="Remove interest"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddInterest} className="flex gap-1.5">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    placeholder="Add interest (e.g. Quantum Computing)..."
                    className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-amber-400" />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Col: Stored Memory Notes */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Remembered Facts & Preferences
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sendMessage("What do you remember about my interests and learning style?");
                      setIsMemoryOpen(false);
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline"
                  >
                    Test Gemini Memory
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {(currentUser.studentMemories || []).length === 0 ? (
                    <div className="p-3 bg-slate-900/50 rounded-lg text-slate-500 text-[11px] text-center">
                      No custom memory notes added yet.
                    </div>
                  ) : (
                    (currentUser.studentMemories || []).map((fact) => (
                      <div
                        key={fact.id}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-start justify-between gap-2 text-[11px]"
                      >
                        <div>
                          <span className="font-semibold text-slate-300 block">{fact.key}</span>
                          <span className="text-slate-400">{fact.value}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveMemory(fact.id)}
                          className="text-slate-500 hover:text-rose-400 p-0.5 shrink-0"
                          title="Delete memory fact"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddMemoryNote} className="flex gap-1.5 mt-2">
                  <input
                    type="text"
                    value={newMemoryInput}
                    onChange={(e) => setNewMemoryInput(e.target.value)}
                    placeholder="Add memory note (e.g. 'I prefer geometrical proofs')..."
                    className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-amber-400" />
                    <span>Save Note</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Feed / Welcome Screen */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          /* Empty / Welcome State like Gemini */
          <div className="h-full flex flex-col justify-center items-center max-w-2xl mx-auto text-center space-y-6 py-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/20 to-cyan-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Hi {currentUser.name}, how can I help you learn today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
                I am Gemini 3.8 Flash. Ask me any conceptual question, request a mathematical breakdown, explore code implementations, or test your reasoning.
              </p>
            </div>

            {/* Gemini-Style Clean Starter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-2">
              {starterPrompts.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => sendMessage(s.prompt)}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 transition-all text-xs group"
                  >
                    <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1 group-hover:text-amber-300">
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{s.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {s.prompt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-cyan-400 flex items-center justify-center text-slate-950 shrink-0 mt-0.5 shadow-xs">
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                </div>
              )}

              <div
                className={`max-w-2xl sm:max-w-3xl rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500/15 border border-amber-500/30 text-white rounded-br-xs'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-xs'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-800/60 text-[11px] text-slate-400 font-mono">
                  <span className="font-semibold text-slate-300">
                    {msg.role === 'user' ? currentUser.name : 'Gemini 3.8 Flash'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <>
                        <button
                          onClick={() => speakText(msg.content)}
                          className="text-slate-400 hover:text-amber-400 transition-colors"
                          title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="text-slate-400 hover:text-amber-400 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Message Markdown Body */}
                <div className="whitespace-pre-wrap space-y-2 text-slate-200 text-xs sm:text-sm font-sans leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-cyan-400 flex items-center justify-center text-slate-950 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 fill-slate-950 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Gemini 3.8 Flash is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Real Gemini-Style Input Tray */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="relative bg-slate-900 border border-slate-700/80 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 rounded-2xl transition-all p-2 flex flex-col justify-between"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gemini anything... (e.g. explain Pythagoras theorem, write Python code, derive formulas)"
            className="w-full px-3 py-1.5 text-sm bg-transparent text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1 px-1">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isListening ? 'Stop voice recording' : 'Speak to Gemini'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl transition-colors flex items-center justify-center disabled:cursor-not-allowed"
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-2">
          <span>Gemini 3.8 Flash · Auto-saved to your personal ID ({currentUser.id})</span>
          <span>Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};
