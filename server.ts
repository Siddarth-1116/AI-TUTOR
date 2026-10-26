import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Dynamic Gemini Client Resolver
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Import dynamic tutor knowledge engine
import { generateDynamicTutorResponse } from './src/server/dynamicTutorEngine.ts';

// 0. TUTOR STATUS ENDPOINT
app.get('/api/tutor/status', (_req: Request, res: Response) => {
  const client = getGeminiClient();
  res.json({
    connected: !!client,
    model: 'gemini-3.8-flash',
    provider: 'Google Gen AI SDK (@google/genai)',
  });
});

// System instruction for Gemini 3.8 Flash AI Tutor Chat with Student Memory
function buildGeminiSystemPrompt(profile: {
  id?: string;
  name?: string;
  topic?: string;
  learningStyle?: string;
  knowledgeLevel?: string;
  institution?: string;
  primaryGoal?: string;
  interests?: string[];
  studentMemories?: Array<{ key: string; value: string }>;
}) {
  const interests = profile.interests && profile.interests.length > 0 
    ? profile.interests.join(', ') 
    : profile.topic || 'Artificial Intelligence, Mathematics, Computer Science';
  const memories = profile.studentMemories && profile.studentMemories.length > 0
    ? profile.studentMemories.map(m => `- ${m.key}: ${m.value}`).join('\n')
    : '- Student values intuitive geometric and first-principles breakdowns before code.';

  return `You are Gemini (model: gemini-3.8-flash), Google's world-class AI tutor and intelligent learning partner.
You are conversing with ${profile.name || 'the student'} (Student ID: ${profile.id || '25955a0538@iare.ac.in'}) from ${profile.institution || 'Institute of Aeronautical Engineering (IARE)'}.

Student Long-Term Memory Profile:
- Student Name: ${profile.name || 'Alex Sharma'}
- Academic Interests: ${interests}
- Cognitive Learning Style: ${profile.learningStyle || 'Socratic & First-Principles'}
- Current Knowledge Level: ${profile.knowledgeLevel || 'Intermediate'}
- Primary Learning Objective: ${profile.primaryGoal || 'Master core concepts through interactive Socratic tutoring and diagnostics.'}
- Stored Notes & Preferences:
${memories}

Core Directives:
- Address the student naturally and warmly by their name (${profile.name || 'the student'}).
- Maintain memory of their background, interests (${interests}), and cognitive learning style. Connect explanations, analogies, and applications to their interests whenever helpful.
- If the student asks about what you remember about them ("What is my name?", "What are my interests?", "Who am I?"), answer accurately from this memory profile.
- You can tutor on ANY topic the user brings up: mathematics (e.g., Pythagorean theorem, calculus, linear algebra), computer science, coding (Python, JS, C++, Rust), physics, chemistry, biology, history, philosophy, or general learning.
- Provide clean Markdown formatting with headers (###), bold key terms, tables, and formatted code blocks.
- Be encouraging, articulate, and interactive. Offer helpful next steps or reflection questions at the end of your explanations.`;
}

// 1. GEMINI AI TUTOR CHAT ENDPOINT
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  try {
    const { messages, profile } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemInstruction = buildGeminiSystemPrompt(profile || {});
        // Format multi-turn conversation for @google/genai SDK
        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          return res.json({
            text,
            model: 'gemini-3.8-flash',
            source: 'gemini-live',
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call returned error, falling back to dynamic engine:', geminiError?.message || geminiError);
      }
    }

    // Dynamic, question-specific AI tutor response
    const dynamicText = generateDynamicTutorResponse(messages, profile || {});
    return res.json({
      text: dynamicText,
      model: 'gemini-3.8-flash',
      source: 'dynamic-engine',
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate response' });
  }
});

// 2. ADAPTIVE QUIZ GENERATION ENDPOINT
app.post('/api/tutor/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic, knowledgeLevel, count = 3, focusArea } = req.body;
    const ai = getGeminiClient();
    
    if (!ai) {
      // Robust fallback quiz questions
      return res.json({
        topic: topic || 'Neural Networks & Machine Learning',
        questions: [
          {
            id: 'q1',
            question: `In the context of ${topic || 'Neural Networks'}, what is the primary role of a non-linear activation function (like ReLU or Sigmoid)?`,
            options: [
              'It enables the network to learn non-linear decision boundaries instead of just collapsing into a single linear regression.',
              'It speeds up training by setting all negative weights strictly to zero permanently.',
              'It computes the exact gradient during the backward pass.',
              'It normalizes the input dataset to have zero mean and unit variance.'
            ],
            correctIndex: 0,
            misconceptionAnalysis: {
              0: 'Correct! Without non-linearity, stacking 100 dense layers is mathematically equivalent to a single linear equation W*x + b.',
              1: 'Common trap: While ReLU sets negative inputs to zero, this is not its primary mathematical justification; non-linear approximation is.',
              2: 'Misconception: Gradients are calculated via backpropagation and chain rule, not by the activation function itself.',
              3: 'Misconception: That is Batch Normalization, not the activation function.'
            },
            explanation: 'Without non-linear activation functions, repeated matrix multiplications simply compose into another linear transformation, preventing the network from learning complex curves or classification surfaces.'
          },
          {
            id: 'q2',
            question: `What is the primary danger of setting the learning rate too high during gradient descent?`,
            options: [
              'The model will get stuck in the initial local minimum.',
              'The loss may oscillate wildly or diverge to infinity, missing the optimal minimum.',
              'The gradient vectors will automatically vanish to absolute zero.',
              'The memory usage of the GPU will exponentially double every epoch.'
            ],
            correctIndex: 1,
            misconceptionAnalysis: {
              0: 'Misconception: Getting stuck in a local minimum is more often caused by too small a learning rate or poor initialization.',
              1: 'Correct! Overshooting the valley walls causes diverging oscillations.',
              2: 'Misconception: Vanishing gradients are caused by saturated activations and deep architectures, not high learning rates.',
              3: 'Misconception: Learning rate has zero impact on GPU VRAM consumption.'
            },
            explanation: 'A high learning rate causes steps that overshoot the optimal valley, leading to instability and gradient explosion.'
          }
        ]
      });
    }

    const quizPrompt = `Generate ${count} multiple-choice diagnostic quiz questions to assess mastery of "${topic || 'Machine Learning'}" for a student at the "${knowledgeLevel || 'Intermediate'}" level. Focus area: "${focusArea || 'Core Intuition and Mechanics'}".

Requirements:
- Make the questions conceptual and thought-provoking, not trivial trivia.
- Each question must have exactly 4 plausible options.
- Crucially, include a "misconceptionAnalysis" mapping each option index (0, 1, 2, 3) to why that specific option is chosen by confused learners, or why it is correct.
- Return ONLY valid JSON adhering strictly to this schema:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": "q1",
      "question": "Clear problem statement",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "misconceptionAnalysis": {
        "0": "Why this is correct",
        "1": "Why someone would fall for this distractor",
        "2": "What false mental model leads here",
        "3": "Why this is inaccurate"
      },
      "explanation": "Deep conceptual takeaway"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: quizPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate quiz' });
  }
});

// 3. PERSONALIZED CURRICULUM ROADMAP GENERATION
app.post('/api/tutor/generate-roadmap', async (req: Request, res: Response) => {
  try {
    const { topic, knowledgeLevel, learningGoal, targetWeeks = 4 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        topic: topic || 'Foundations of Deep Learning',
        description: 'Adaptive mastery roadmap engineered for your cognitive style.',
        modules: [
          {
            id: 'mod-1',
            title: 'Foundations & The Perceptron',
            summary: 'Biological inspiration, mathematical formulation, and linear decision boundaries.',
            estimatedHours: 4,
            status: 'completed',
            masteryScore: 92,
            keyConcepts: ['Linear Separability', 'Activation Thresholds', 'Weight Vector Geometry'],
            simulationSlug: 'neural-sandbox'
          },
          {
            id: 'mod-2',
            title: 'Backpropagation & Gradient Flow',
            summary: 'Chain rule unravelled, loss landscape traversal, and computational graphs.',
            estimatedHours: 6,
            status: 'in-progress',
            masteryScore: 68,
            keyConcepts: ['Multivariate Chain Rule', 'Loss Gradients', 'Vanishing Gradients'],
            simulationSlug: 'gradient-descent'
          },
          {
            id: 'mod-3',
            title: 'Modern Architectures & Representation',
            summary: 'Convolutions, Attention mechanisms, and latent space embeddings.',
            estimatedHours: 8,
            status: 'locked',
            masteryScore: 0,
            keyConcepts: ['Self-Attention Dot Product', 'Positional Encoding', 'Latent Projections'],
            simulationSlug: 'attention-weights'
          }
        ]
      });
    }

    const roadmapPrompt = `You are a curriculum designer for personalized adaptive education.
Design a cohesive, progressive learning roadmap for:
Topic: "${topic}"
Learner's current level: "${knowledgeLevel || 'Intermediate'}"
Target Goal: "${learningGoal || 'Deep conceptual mastery and practical intuition'}"
Duration: "${targetWeeks} weeks"

Break the topic down into 4-5 progressive modules. Each module must build on previous ones.
Return ONLY valid JSON matching this schema:
{
  "topic": "${topic}",
  "description": "Engaging 1-2 sentence overview of this personalized pathway",
  "modules": [
    {
      "id": "mod-1",
      "title": "Module title",
      "summary": "Clear pedagogical objective",
      "estimatedHours": 5,
      "status": "completed",
      "masteryScore": 85,
      "keyConcepts": ["Concept 1", "Concept 2", "Concept 3"],
      "simulationSlug": "neural-sandbox"
    }
  ]
}
Note: Set the first module status to "completed" (or "in-progress"), the second to "in-progress", and remainder to "locked".
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: roadmapPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate roadmap' });
  }
});

// 4. DIAGNOSE MISCONCEPTION ENDPOINT
app.post('/api/tutor/diagnose-misconception', async (req: Request, res: Response) => {
  try {
    const { studentStatement, concept } = req.body;
    const ai = getGeminiClient();
    
    if (!ai) {
      return res.json({
        rootCause: 'Confusing correlation with causation or parameter magnitude with significance.',
        correctPrinciple: 'A large weight does not necessarily mean higher importance if the input feature scale is very small.',
        analogy: 'Think of weights like volume knobs on different audio tracks: if one track is recorded as a whisper, the knob needs to be set high just to be heard.',
        correctiveCheck: 'If feature X is normalized between [0, 1] and feature Y is between [0, 1000], which weight needs to be larger for equal impact?'
      });
    }

    const prompt = `A student studying "${concept}" made this statement/reasoning:
"${studentStatement}"

Analyze their mental model:
1. What is the root cause of this misconception?
2. What is the mathematically/conceptually sound principle?
3. Provide a memorable, physical analogy to dissolve the confusion.
4. Formulate one quick reflection question to test if they now understand it.

Return JSON:
{
  "rootCause": "string",
  "correctPrinciple": "string",
  "analogy": "string",
  "correctiveCheck": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Diagnosis error:', error);
    res.status(500).json({ error: error?.message || 'Failed to diagnose' });
  }
});

// 5. FLASHCARDS GENERATION ENDPOINT
app.post('/api/tutor/flashcards', async (req: Request, res: Response) => {
  try {
    const { topic, count = 5 } = req.body;
    const ai = getGeminiClient();
    
    if (!ai) {
      return res.json({
        cards: [
          {
            id: 'c1',
            front: 'What is the "Vanishing Gradient" problem?',
            back: 'In deep neural networks with sigmoid/tanh activations, gradients shrink exponentially as they propagate backward through layers, preventing early layers from updating their weights effectively.',
            category: 'Deep Learning',
            difficulty: 'Intermediate'
          },
          {
            id: 'c2',
            front: 'Why does Dropout act as a regularizer during training?',
            back: 'By randomly disabling neurons during each forward pass, dropout prevents neurons from co-adapting and relying excessively on specific features, effectively training an ensemble of subnetworks.',
            category: 'Regularization',
            difficulty: 'Intermediate'
          },
          {
            id: 'c3',
            front: 'What does Bayes Theorem mathematically express?',
            back: 'P(A|B) = [P(B|A) * P(A)] / P(B). It updates the prior probability P(A) of an event given new observed evidence B using the likelihood P(B|A).',
            category: 'Probability',
            difficulty: 'Fundamental'
          }
        ]
      });
    }

    const prompt = `Generate ${count} high-yield active recall flashcards for "${topic || 'General Science & Machine Learning'}".
Each card must focus on high-leverage principles, mechanisms, or non-obvious distinctions.
Return JSON:
{
  "cards": [
    {
      "id": "c1",
      "front": "Clear, precise conceptual question",
      "back": "Punchy, unambiguous answer with underlying rationale",
      "category": "Sub-topic",
      "difficulty": "Fundamental" | "Intermediate" | "Advanced"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Flashcard error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate flashcards' });
  }
});

// Mount Vite or static server
async function setupVite() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SynapseAI Tutor] Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch(console.error);
