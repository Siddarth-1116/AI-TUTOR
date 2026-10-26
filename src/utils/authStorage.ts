import { UserAccount, HistoryItem, MemoryFact } from '../types';

const USERS_STORAGE_KEY = 'synapse_users_db_v1';
const ACTIVE_USER_ID_KEY = 'synapse_active_user_id_v1';
const HISTORY_STORAGE_KEY_PREFIX = 'synapse_history_';

const DEFAULT_USERS: Record<string, UserAccount> = {
  '25955a0538@iare.ac.in': {
    id: '25955a0538@iare.ac.in',
    name: 'Alex Sharma',
    email: '25955a0538@iare.ac.in',
    institution: 'Institute of Aeronautical Engineering (IARE)',
    role: 'Computer Science & AI Scholar',
    joinedDate: 'October 2026',
    learningStyle: 'Socratic & First-Principles',
    knowledgeLevel: 'Intermediate',
    pace: 'Balanced',
    primaryGoal: 'Master deep learning architectures, gradient mechanics, and loss landscapes.',
    targetTopic: 'Neural Networks & Deep Learning',
    topic: 'Neural Networks & Deep Learning',
    interests: ['Artificial Intelligence', 'Mathematics & Proofs', 'Python & PyTorch', 'Data Structures & Algorithms'],
    studentMemories: [
      {
        id: 'mem-1',
        key: 'Preferred Explanation Style',
        value: 'Prefers step-by-step mathematical proofs and visual geometric intuition before jumping to code.',
        category: 'preference',
        createdAt: 'Oct 20, 2026',
      },
      {
        id: 'mem-2',
        key: 'Core Interests',
        value: 'Passionate about deep learning, geometric proofs (Pythagoras theorem), calculus, and algorithm optimization.',
        category: 'interest',
        createdAt: 'Oct 22, 2026',
      },
      {
        id: 'mem-3',
        key: 'Active Target',
        value: 'Aspirations to understand backpropagation mechanics, attention layers, and Euclidean distance formulas.',
        category: 'concept',
        createdAt: 'Oct 25, 2026',
      },
    ],
    streakDays: 6,
    studyHours: 28.5,
    averageMastery: 86,
    conceptsMastered: 24,
    quizzesTaken: 8,
    bookmarkedResourceIds: ['res-1', 'res-3', 'res-5'],
  },
  'demo.student@iare.ac.in': {
    id: 'demo.student@iare.ac.in',
    name: 'Priya Patel',
    email: 'demo.student@iare.ac.in',
    institution: 'Institute of Aeronautical Engineering (IARE)',
    role: 'Data Science Undergraduate',
    joinedDate: 'September 2026',
    learningStyle: 'Visual & Spatial',
    knowledgeLevel: 'Novice',
    pace: 'Self-Paced',
    primaryGoal: 'Understand Bayesian probability and foundational machine learning algorithms.',
    targetTopic: 'Bayesian Probability & Inference',
    topic: 'Bayesian Probability & Inference',
    interests: ['Probability & Statistics', 'Data Science', 'Python', 'Machine Learning'],
    studentMemories: [
      {
        id: 'mem-p1',
        key: 'Preferred Learning Style',
        value: 'Understands best with visual charts, medical test analogies, and tangible everyday examples.',
        category: 'preference',
        createdAt: 'Oct 15, 2026',
      },
    ],
    streakDays: 3,
    studyHours: 12.0,
    averageMastery: 74,
    conceptsMastered: 11,
    quizzesTaken: 4,
    bookmarkedResourceIds: ['res-2', 'res-4'],
  },
};

const DEFAULT_HISTORIES: Record<string, HistoryItem[]> = {
  '25955a0538@iare.ac.in': [
    {
      id: 'hist-1',
      userId: '25955a0538@iare.ac.in',
      type: 'chat',
      title: 'Vanishing Gradients & Activation Functions',
      topic: 'Neural Networks & Deep Learning',
      timestamp: 'Today, 02:45 PM',
      preview: 'Explored why sigmoid saturates at the extremes and why ReLU enables deep backpropagation without gradient collapse.',
      messages: [
        {
          id: 'm1',
          role: 'user',
          content: 'Why does stacking multiple linear layers without activations fail to create a deep network?',
          timestamp: '02:40 PM',
        },
        {
          id: 'm2',
          role: 'assistant',
          content: 'Because linear functions compose into another linear function: W2(W1x + b1) + b2 = (W2W1)x + (W2b1 + b2). Depth without non-linearity yields zero additional expressive power.',
          timestamp: '02:41 PM',
          keyTakeaway: 'Without non-linearity, a 100-layer net collapses to a single regression hyperplane.',
        },
      ],
    },
    {
      id: 'hist-2',
      userId: '25955a0538@iare.ac.in',
      type: 'quiz',
      title: 'Neural Networks Foundations Assessment',
      topic: 'Neural Networks & Deep Learning',
      timestamp: 'Yesterday, 05:20 PM',
      preview: 'Completed diagnostic quiz with 100% score on non-linear activation mechanics.',
      score: 100,
    },
    {
      id: 'hist-3',
      userId: '25955a0538@iare.ac.in',
      type: 'chat',
      title: 'Geometric Intuition for Hyperplanes',
      topic: 'Neural Networks & Deep Learning',
      timestamp: '2 days ago',
      preview: 'Investigated how weights set hyperplane orientation and bias sets offset distance from origin.',
    },
  ],
  'demo.student@iare.ac.in': [
    {
      id: 'hist-demo-1',
      userId: 'demo.student@iare.ac.in',
      type: 'chat',
      title: 'Base Rate Fallacy in Medical Tests',
      topic: 'Bayesian Probability & Inference',
      timestamp: 'Yesterday, 11:30 AM',
      preview: 'Analyzed why a 99% accurate test for a rare disease yields only ~9% posterior probability.',
    },
  ],
};

function getAllUsers(): Record<string, UserAccount> {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    // Ensure default users have interests and studentMemories if migrated
    if (parsed['25955a0538@iare.ac.in'] && !parsed['25955a0538@iare.ac.in'].interests) {
      parsed['25955a0538@iare.ac.in'].interests = DEFAULT_USERS['25955a0538@iare.ac.in'].interests;
      parsed['25955a0538@iare.ac.in'].studentMemories = DEFAULT_USERS['25955a0538@iare.ac.in'].studentMemories;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_USERS;
  }
}

function saveAllUsers(users: Record<string, UserAccount>) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users database:', e);
  }
}

export function getActiveUserId(): string | null {
  try {
    const saved = localStorage.getItem(ACTIVE_USER_ID_KEY);
    if (saved && getAllUsers()[saved]) {
      return saved;
    }
    // Return null when logged out
    return null;
  } catch {
    return null;
  }
}

export function getCurrentUser(): UserAccount | null {
  const users = getAllUsers();
  const activeId = getActiveUserId();
  if (activeId && users[activeId]) {
    return users[activeId];
  }
  return null;
}

export function loginUser(personalId: string, name?: string, interests?: string[]): UserAccount {
  const cleanId = personalId.trim().toLowerCase();
  const users = getAllUsers();

  let user = users[cleanId];
  if (!user) {
    // Create new personal account on the fly
    const displayName = name?.trim() || cleanId.split('@')[0] || 'Student Scholar';
    const institution = cleanId.includes('@') ? cleanId.split('@')[1].toUpperCase() : 'Institute of Aeronautical Engineering (IARE)';

    user = {
      id: cleanId,
      name: displayName,
      email: cleanId.includes('@') ? cleanId : `${cleanId}@iare.ac.in`,
      institution: institution.includes('IARE') ? 'Institute of Aeronautical Engineering (IARE)' : institution,
      role: 'Student Scholar',
      joinedDate: 'October 2026',
      learningStyle: 'Socratic & First-Principles',
      knowledgeLevel: 'Intermediate',
      pace: 'Balanced',
      primaryGoal: 'Master core concepts through interactive Socratic tutoring and diagnostics.',
      targetTopic: 'Computer Science & AI',
      topic: 'Computer Science & AI',
      interests: interests && interests.length > 0 ? interests : ['Artificial Intelligence', 'Mathematics', 'Computer Science'],
      studentMemories: [
        {
          id: `mem-${Date.now()}`,
          key: 'Initial Onboarding',
          value: `Student logged in as ${displayName}. Target focus: Computer Science & AI.`,
          category: 'note',
          createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        },
      ],
      streakDays: 1,
      studyHours: 1.0,
      averageMastery: 75,
      conceptsMastered: 5,
      quizzesTaken: 1,
      bookmarkedResourceIds: ['res-1'],
    };
    users[cleanId] = user;
    saveAllUsers(users);
  } else if (interests && interests.length > 0) {
    user.interests = interests;
    users[cleanId] = user;
    saveAllUsers(users);
  }

  localStorage.setItem(ACTIVE_USER_ID_KEY, cleanId);
  return user;
}

export function logoutUser(): void {
  // Clear the active session key so that user is taken to login page
  localStorage.removeItem(ACTIVE_USER_ID_KEY);
}

export function updateUserProfile(updates: Partial<UserAccount>): UserAccount | null {
  const users = getAllUsers();
  const current = getCurrentUser();
  if (!current) return null;
  const updated = { ...current, ...updates };
  users[current.id] = updated;
  saveAllUsers(users);
  return updated;
}

export function addStudentMemoryFact(
  userId: string,
  key: string,
  value: string,
  category: 'interest' | 'preference' | 'concept' | 'note' = 'note'
): MemoryFact {
  const users = getAllUsers();
  const user = users[userId];
  const newFact: MemoryFact = {
    id: `mem-${Date.now()}`,
    key,
    value,
    category,
    createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
  };
  if (user) {
    user.studentMemories = [newFact, ...(user.studentMemories || [])];
    users[userId] = user;
    saveAllUsers(users);
  }
  return newFact;
}

export function removeStudentMemoryFact(userId: string, factId: string): void {
  const users = getAllUsers();
  const user = users[userId];
  if (user && user.studentMemories) {
    user.studentMemories = user.studentMemories.filter((m) => m.id !== factId);
    users[userId] = user;
    saveAllUsers(users);
  }
}

export function updateStudentInterests(userId: string, interests: string[]): string[] {
  const users = getAllUsers();
  const user = users[userId];
  if (user) {
    user.interests = interests;
    users[userId] = user;
    saveAllUsers(users);
  }
  return interests;
}

export function getUserHistory(userId: string): HistoryItem[] {
  try {
    const raw = localStorage.getItem(`${HISTORY_STORAGE_KEY_PREFIX}${userId}`);
    if (!raw) {
      const initial = DEFAULT_HISTORIES[userId] || [];
      localStorage.setItem(`${HISTORY_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_HISTORIES[userId] || [];
  }
}

export function saveUserHistoryItem(userId: string, item: Omit<HistoryItem, 'id' | 'userId' | 'timestamp'> & { timestamp?: string }): HistoryItem {
  const history = getUserHistory(userId);
  const newItem: HistoryItem = {
    ...item,
    id: `hist-${Date.now()}`,
    userId,
    timestamp: item.timestamp || new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };
  const updated = [newItem, ...history];
  try {
    localStorage.setItem(`${HISTORY_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
  return newItem;
}

export function clearUserHistory(userId: string): void {
  try {
    localStorage.removeItem(`${HISTORY_STORAGE_KEY_PREFIX}${userId}`);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

export function toggleUserBookmark(userId: string, resourceId: string): string[] {
  const user = getCurrentUser();
  if (!user) return [];
  const currentBookmarks = user.bookmarkedResourceIds || [];
  const exists = currentBookmarks.includes(resourceId);
  const updatedBookmarks = exists
    ? currentBookmarks.filter((id) => id !== resourceId)
    : [...currentBookmarks, resourceId];

  updateUserProfile({ bookmarkedResourceIds: updatedBookmarks });
  return updatedBookmarks;
}
