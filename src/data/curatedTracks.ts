import { RoadmapModule, Flashcard, QuizQuestion } from '../types';

export interface SubjectTrack {
  id: string;
  name: string;
  category: string;
  description: string;
  suggestedGoal: string;
  defaultRoadmap: RoadmapModule[];
  defaultFlashcards: Flashcard[];
  defaultQuiz: QuizQuestion[];
  starterQuestions: string[];
}

export const CURATED_TRACKS: SubjectTrack[] = [
  {
    id: 'neural-networks',
    name: 'Neural Networks & Deep Learning',
    category: 'Computer Science & AI',
    description: 'Master the mathematical foundations of artificial neurons, backpropagation, and latent representations.',
    suggestedGoal: 'Build an intuitive and mathematical grasp of how neural networks approximate complex functions.',
    starterQuestions: [
      'Why is a non-linear activation function strictly required in multi-layer perceptrons?',
      'How does gradient descent avoid oscillating endlessly when crossing steep loss ravines?',
      'Explain the difference between L1 and L2 regularization using a geometric analogy.'
    ],
    defaultRoadmap: [
      {
        id: 'nn-mod-1',
        title: 'The Perceptron & Geometric Decision Boundaries',
        summary: 'Explore weights, biases, and hyperplanes separating high-dimensional spaces.',
        estimatedHours: 4,
        status: 'completed',
        masteryScore: 94,
        keyConcepts: ['Dot Products', 'Hyperplane Geometry', 'Linear Separability'],
        simulationSlug: 'neural-sandbox'
      },
      {
        id: 'nn-mod-2',
        title: 'Non-Linear Activations & Universal Approximation',
        summary: 'Understand ReLU, Sigmoid, GELU, and why non-linearity bends feature space.',
        estimatedHours: 5,
        status: 'in-progress',
        masteryScore: 72,
        keyConcepts: ['Activation Thresholds', 'Dying ReLU Problem', 'Universal Approximation Theorem'],
        simulationSlug: 'neural-sandbox'
      },
      {
        id: 'nn-mod-3',
        title: 'Backpropagation & Vector Calculus',
        summary: 'Trace the multivariate chain rule across computational graphs to compute exact weight gradients.',
        estimatedHours: 7,
        status: 'locked',
        masteryScore: 0,
        keyConcepts: ['Computational Graphs', 'Jacobians', 'Gradient Flow Dynamics'],
        simulationSlug: 'gradient-descent'
      },
      {
        id: 'nn-mod-4',
        title: 'Optimization & Loss Landscape Dynamics',
        summary: 'Momentum, Adam optimizer, learning rate schedules, and escaping saddle points.',
        estimatedHours: 6,
        status: 'locked',
        masteryScore: 0,
        keyConcepts: ['Stochastic Mini-Batches', 'Exponential Moving Averages', 'Saddle Point Traversal'],
        simulationSlug: 'gradient-descent'
      }
    ],
    defaultFlashcards: [
      {
        id: 'fc-nn-1',
        front: 'Why does stacking multiple purely linear layers fail to produce a deep neural network?',
        back: 'The composition of any number of linear transformations W2(W1x + b1) + b2 is simply another single linear transformation W\'x + b\'. Without non-linear activations, depth adds zero expressive capacity.',
        category: 'Foundations',
        difficulty: 'Fundamental'
      },
      {
        id: 'fc-nn-2',
        front: 'What causes the Vanishing Gradient problem during backpropagation?',
        back: 'When using activations like Sigmoid whose derivative has a maximum of 0.25, chaining multiple derivative terms together causes the gradient to shrink exponentially toward zero for early layers.',
        category: 'Backprop',
        difficulty: 'Intermediate'
      },
      {
        id: 'fc-nn-3',
        front: 'How does Batch Normalization accelerate training stability?',
        back: 'It re-centers and re-scales layer activations to zero mean and unit variance for each mini-batch, reducing internal covariate shift and allowing higher learning rates.',
        category: 'Optimization',
        difficulty: 'Intermediate'
      },
      {
        id: 'fc-nn-4',
        front: 'What is the intuitive difference between L1 (Lasso) and L2 (Ridge) weight regularization?',
        back: 'L1 penalizes absolute weight magnitude (|w|), creating sharp diamond contours that drive weights exactly to zero (sparsity). L2 penalizes squared magnitude (w²), shrinking all weights smoothly without exact zeroing.',
        category: 'Regularization',
        difficulty: 'Advanced'
      }
    ],
    defaultQuiz: [
      {
        id: 'quiz-nn-1',
        question: 'Suppose you train a 5-layer neural network with no activation functions (f(x) = x). What is the maximum decision boundary complexity this model can learn?',
        options: [
          'A strictly flat linear hyperplane.',
          'A smooth quadratic polynomial curve.',
          'An arbitrary piecewise linear boundary.',
          'Any continuous compact function.'
        ],
        correctIndex: 0,
        misconceptionAnalysis: {
          0: 'Correct! The product of linear matrices W5 · W4 · W3 · W2 · W1 collapses algebraically into a single matrix W_composite.',
          1: 'Misconception: Quadratic curves require non-linear interactions like x1 · x2 or x².',
          2: 'Misconception: Piecewise linear boundaries require non-linear activations like ReLU.',
          3: 'Misconception: This confuses the model with the Universal Approximation Theorem, which requires non-linear activations.'
        },
        explanation: 'Because matrix multiplication is associative, any sequential cascade of linear operations is mathematically identical to a single affine transformation y = Wx + b.'
      },
      {
        id: 'quiz-nn-2',
        question: 'Why is ReLU (Rectified Linear Unit) f(x) = max(0, x) preferred over Sigmoid in modern deep convolutional and transformer feedforward layers?',
        options: [
          'It solves the vanishing gradient problem for positive inputs because its gradient is constantly 1.',
          'It forces every weight in the network to stay positive.',
          'It computes the exact analytical inverse of the cross-entropy loss function.',
          'It completely eliminates the possibility of overfitting.'
        ],
        correctIndex: 0,
        misconceptionAnalysis: {
          0: 'Correct! When x > 0, the derivative df/dx is 1.0, preserving gradient magnitude through deep chains.',
          1: 'Misconception: ReLU acts on activations (outputs), not on weights, and allows negative weights.',
          2: 'Misconception: ReLU has no relationship with the analytical inverse of cross-entropy.',
          3: 'Misconception: ReLU models can still overfit without proper regularization.'
        },
        explanation: 'Sigmoids saturate at 0 and 1 with tiny derivatives (< 0.25). ReLU maintains a constant gradient of 1 for all positive inputs, allowing deep networks to train efficiently.'
      }
    ]
  },
  {
    id: 'quantum-computing',
    name: 'Quantum Mechanics & Qubits',
    category: 'Physics & Computing',
    description: 'Explore superposition, quantum entanglement, Bloch sphere rotations, and quantum algorithms.',
    suggestedGoal: 'Develop geometric and linear algebraic intuition for quantum states and unitary operators.',
    starterQuestions: [
      'What does a point on the surface of the Bloch Sphere physically represent?',
      'Why cannot an unknown quantum state be copied perfectly (No-Cloning Theorem)?',
      'How does quantum interference enable Grover’s search algorithm to achieve quadratic speedup?'
    ],
    defaultRoadmap: [
      {
        id: 'qc-mod-1',
        title: 'Qubits & The Bloch Sphere',
        summary: 'Superposition of basis states |0⟩ and |1⟩, probability amplitudes, and 3D state visualization.',
        estimatedHours: 4,
        status: 'completed',
        masteryScore: 88,
        keyConcepts: ['Dirac Bra-Ket Notation', 'Complex Amplitudes', 'Bloch Sphere Coordinates'],
        simulationSlug: 'bloch-sphere'
      },
      {
        id: 'qc-mod-2',
        title: 'Quantum Gates & Unitary Transformations',
        summary: 'Pauli matrices, Hadamard gate, phase shifts, and reversible quantum circuits.',
        estimatedHours: 6,
        status: 'in-progress',
        masteryScore: 65,
        keyConcepts: ['Hadamard Gate', 'Unitary Matrix Invariance', 'Phase Inversion'],
        simulationSlug: 'quantum-gates'
      },
      {
        id: 'qc-mod-3',
        title: 'Entanglement & Bell States',
        summary: 'Composite systems, tensor products, CNOT gates, and non-local correlations.',
        estimatedHours: 6,
        status: 'locked',
        masteryScore: 0,
        keyConcepts: ['CNOT Gate', 'Bell Basis', 'EPR Paradox'],
        simulationSlug: 'entanglement'
      }
    ],
    defaultFlashcards: [
      {
        id: 'fc-qc-1',
        front: 'What is the physical meaning of the squared magnitude |α|² in a qubit state |ψ⟩ = α|0⟩ + β|1⟩?',
        back: 'By the Born rule, |α|² represents the exact probability of measuring the qubit in the basis state |0⟩ upon projective measurement.',
        category: 'Superposition',
        difficulty: 'Fundamental'
      },
      {
        id: 'fc-qc-2',
        front: 'Why must all quantum gates (apart from measurement) be represented by Unitary matrices (U†U = I)?',
        back: 'Unitary transformations preserve the norm (inner product) of state vectors, guaranteeing that the total probability sum |α|² + |β|² remains exactly 1.0 at all times.',
        category: 'Quantum Gates',
        difficulty: 'Intermediate'
      }
    ],
    defaultQuiz: [
      {
        id: 'quiz-qc-1',
        question: 'Applying a Hadamard gate H to the pure ground state |0⟩ produces which state?',
        options: [
          '(|0⟩ + |1⟩) / √2',
          '(|0⟩ - |1⟩) / √2',
          '|1⟩ with 100% certainty',
          'A mixed classical state with 0 entropy'
        ],
        correctIndex: 0,
        misconceptionAnalysis: {
          0: 'Correct! H|0⟩ produces the symmetric superposition |+⟩.',
          1: 'Misconception: (|0⟩ - |1⟩) / √2 is |-⟩, which is produced by applying H to |1⟩.',
          2: 'Misconception: That is the Pauli-X (NOT) gate, not the Hadamard gate.',
          3: 'Misconception: The resulting state is a pure quantum state, not a classical mixed state.'
        },
        explanation: 'The Hadamard gate maps basis states onto equal superpositions with specific relative phases: H|0⟩ = |+⟩ and H|1⟩ = |-⟩.'
      }
    ]
  },
  {
    id: 'probability-bayes',
    name: 'Bayesian Probability & Inference',
    category: 'Mathematics & Statistics',
    description: 'Transform prior beliefs into calibrated posterior estimates using likelihoods and evidence.',
    suggestedGoal: 'Master conditional probability, Bayes rule, and avoid the base rate fallacy.',
    starterQuestions: [
      'Why do most people intuitively fail the Medical Diagnostic test probability problem?',
      'What is the difference between Frequentist confidence intervals and Bayesian credible intervals?',
      'How does conjugate prior selection simplify Bayesian updating mathematically?'
    ],
    defaultRoadmap: [
      {
        id: 'prob-mod-1',
        title: 'Conditional Probability & Independence',
        summary: 'Joint probability spaces, sample partitions, and tree diagrams.',
        estimatedHours: 3,
        status: 'completed',
        masteryScore: 90,
        keyConcepts: ['Joint Distributions', 'Marginalization', 'Conditional Law'],
        simulationSlug: 'bayes-sandbox'
      },
      {
        id: 'prob-mod-2',
        title: 'Bayes Theorem & The Base Rate Fallacy',
        summary: 'Prior distributions, likelihood functions, and evidence normalization.',
        estimatedHours: 5,
        status: 'in-progress',
        masteryScore: 70,
        keyConcepts: ['Prior vs Posterior', 'Likelihood Ratios', 'Base Rate Calibrations'],
        simulationSlug: 'bayes-sandbox'
      }
    ],
    defaultFlashcards: [
      {
        id: 'fc-prob-1',
        front: 'What is the "Base Rate Fallacy"?',
        back: 'The cognitive error where people judge the probability of a hypothesis solely based on specific evidence (e.g. a 99% accurate test) while ignoring the prior prevalence (base rate) of the condition in the population.',
        category: 'Cognitive Biases',
        difficulty: 'Fundamental'
      }
    ],
    defaultQuiz: [
      {
        id: 'quiz-prob-1',
        question: 'A rare disease affects 1 in 1,000 people (0.1%). A test is 99% accurate (true positive 99%, false positive 1%). If a random person tests positive, approximately what is the true probability they have the disease?',
        options: [
          'Around 9%',
          'Around 99%',
          'Around 50%',
          'Around 0.1%'
        ],
        correctIndex: 0,
        misconceptionAnalysis: {
          0: 'Correct! Out of 100,000 people: 100 have it (99 test positive) and 99,900 do not (999 test false positive). 99 / (99 + 999) ≈ 9%.',
          1: 'Base Rate Fallacy: Ignoring that the healthy population is 1000x larger than the infected population.',
          2: 'Misconception: Arbitrary guess without computing false positive absolute counts.',
          3: 'Misconception: Believing the test gives no information at all.'
        },
        explanation: 'Because the false positive rate (1%) acts on the overwhelmingly large non-diseased population, false positives outnumber true positives by roughly 10 to 1.'
      }
    ]
  }
];
