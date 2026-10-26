import { ResourceItem } from '../types';

export const LEARNING_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'The Geometric Anatomy of Deep Neural Networks',
    category: 'Neural Networks & Deep Learning',
    type: 'guide',
    difficulty: 'Intermediate',
    estimatedReadTime: '8 min read',
    summary: 'A first-principles geometric visualization of affine transformations, hyperplane boundaries, and why non-linear activations warp metric spaces.',
    tags: ['Linear Separability', 'Hyperplanes', 'ReLU', 'Universal Approximation'],
    content: `# The Geometric Anatomy of Deep Neural Networks

## 1. The Single Perceptron as a Hyperplane
In $n$-dimensional Euclidean space $\\mathbb{R}^n$, an artificial neuron computes:
$$z = \\mathbf{w}^T \\mathbf{x} + b = \\sum_{i=1}^n w_i x_i + b$$

Geometrically, the equation $\\mathbf{w}^T \\mathbf{x} + b = 0$ defines an **$(n-1)$-dimensional hyperplane**:
- The weight vector $\\mathbf{w}$ represents the **orthogonal normal vector** specifying the orientation of the separating hyperplane.
- The scalar bias $b$ determines the **perpendicular distance** of the hyperplane from the origin:
$$\\text{Distance} = \\frac{|b|}{\\|\\mathbf{w}\\|}$$

## 2. Why Pure Linear Stacking Collapses
Consider a 3-layer deep network without non-linear activations:
$$\\mathbf{h}_1 = \\mathbf{W}_1 \\mathbf{x} + \\mathbf{b}_1$$
$$\\mathbf{h}_2 = \\mathbf{W}_2 \\mathbf{h}_1 + \\mathbf{b}_2 = \\mathbf{W}_2 (\\mathbf{W}_1 \\mathbf{x} + \\mathbf{b}_1) + \\mathbf{b}_2$$
$$\\hat{\\mathbf{y}} = \\mathbf{W}_3 \\mathbf{h}_2 + \\mathbf{b}_3 = (\\mathbf{W}_3 \\mathbf{W}_2 \\mathbf{W}_1) \\mathbf{x} + (\\mathbf{W}_3 \\mathbf{W}_2 \\mathbf{b}_1 + \\mathbf{W}_3 \\mathbf{b}_2 + \\mathbf{b}_3)$$

Because matrix multiplication is associative, the composite matrix $\\mathbf{W}_{\\text{comp}} = \\mathbf{W}_3 \\mathbf{W}_2 \\mathbf{W}_1$ is just another single linear transformation. Stacking 100 linear layers provides zero additional representational capacity over a single linear regression!

## 3. The Role of Non-Linear Activation Functions
When we apply non-linearities like $\\sigma(z) = \\max(0, z)$ (ReLU), each layer **folds and bends the coordinate space**, allowing previously non-separable data points (like the classic XOR problem) to be mapped into a latent space where they become linearly separable.`,
  },
  {
    id: 'res-2',
    title: 'Bayesian Updating & Avoiding the Base Rate Fallacy',
    category: 'Probability & Statistics',
    type: 'cheat_sheet',
    difficulty: 'Novice',
    estimatedReadTime: '6 min read',
    summary: 'A visual mental model for conditional probability, likelihood ratios, and the counter-intuitive dominance of low prevalence.',
    tags: ['Bayes Rule', 'Prior vs Posterior', 'Base Rate', 'False Positives'],
    content: `# Bayesian Updating & The Base Rate Fallacy

## 1. Bayes' Theorem Formulation
$$P(H \\mid E) = \\frac{P(E \\mid H) \\cdot P(H)}{P(E)}$$

Where:
- $P(H)$ = **Prior probability**: Your initial degree of belief before observing evidence.
- $P(E \\mid H)$ = **Likelihood**: How probable the observed evidence $E$ is assuming hypothesis $H$ is true.
- $P(E)$ = **Marginal Evidence**: Total probability of observing $E$ across all hypotheses:
$$P(E) = P(E \\mid H)P(H) + P(E \\mid \\neg H)P(\\neg H)$$
- $P(H \\mid E)$ = **Posterior probability**: Your updated calibrated belief.

## 2. The Medical Test Intuition Trap
Imagine a disease affecting **1 in 1,000 individuals** ($0.1\\%$ prior). A diagnostic test has:
- **True Positive Rate (Sensitivity)**: $99\\%$
- **False Positive Rate**: $1\\%$

If someone tests positive, what is the chance they actually have the condition?
Most people guess $>90\\%$. The real answer is approximately **$9\\%$**!

### The 100,000 People Visual Grid:
- **100 people** have the disease: 99 test positive, 1 tests negative.
- **99,900 people** do NOT have the disease: $1\\%$ of them ($999$ people) test false positive!
- Total positive tests = $99 + 999 = 1,098$.
- True probability given positive test = $99 / 1,098 \\approx 9.01\\%$.`,
  },
  {
    id: 'res-3',
    title: 'Gradient Descent & Optimization Dynamics',
    category: 'Optimization & Algorithms',
    type: 'formula_sheet',
    difficulty: 'Intermediate',
    estimatedReadTime: '7 min read',
    summary: 'Essential formulas, momentum mechanisms, Adam optimizer updates, and loss landscape traversal strategies.',
    tags: ['SGD', 'Momentum', 'Adam', 'Learning Rate', 'Loss Ravines'],
    content: `# Gradient Descent & Optimization Cheat Sheet

## 1. Vanilla Gradient Descent
$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta \\mathcal{L}(\\theta_t)$$

- **Pitfall**: In anisotropic ravines (valleys where curvature is much steeper in one direction than another), vanilla GD oscillates wildly across the steep walls while creeping agonizingly slowly along the valley floor.

## 2. Polyak Momentum
Adds a physical inertia term:
$$v_{t+1} = \\beta v_t + \\nabla_\\theta \\mathcal{L}(\\theta_t)$$
$$\\theta_{t+1} = \\theta_t - \\eta v_{t+1}$$

- Typically $\\beta \\approx 0.9$. Oscillating gradients cancel out along high-frequency directions while reinforcing along consistent directions.

## 3. Adam (Adaptive Moment Estimation)
Maintains running exponential averages of both gradients and squared gradients:
$$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t \\quad \\text{(First moment - mean)}$$
$$v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2 \\quad \\text{(Second moment - uncentered variance)}$$

Bias corrections:
$$\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t}$$

Parameter update:
$$\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$$`,
  },
  {
    id: 'res-4',
    title: 'The Socratic Self-Inquiry Method for STEM Mastery',
    category: 'Cognitive Science & Learning',
    type: 'guide',
    difficulty: 'Novice',
    estimatedReadTime: '5 min read',
    summary: 'How to interrogate formulas, identify hidden assumptions, and reconstruct complex theorems from memory using first principles.',
    tags: ['Feynman Technique', 'Socratic Method', 'Active Recall', 'Mental Models'],
    content: `# The Socratic Self-Inquiry Framework

## 1. The 4 Diagnostic Questions
Whenever you encounter a new equation or theorem, never memorize it until you can answer:

1. **The Boundary Check**: What happens if the primary variable goes to $0$? What happens if it approaches $\\infty$? Does the formula yield intuitive physical limits?
2. **The Dimensional Analysis**: What are the fundamental physical units on both sides of the equals sign?
3. **The Elimination Test**: If I remove this specific term, what realistic constraint breaks?
4. **The Physical Metaphor**: How would I explain this mechanism to a 10-year-old using water pipes, gravity, or bank accounts?

## 2. Misconception Auditing
Before studying solutions, articulate your current guess explicitly in one sentence. Being wrong and discovering *why* creates an emotional and neurological trigger that cements the true principle permanently.`,
  },
  {
    id: 'res-5',
    title: 'Attention & Transformer Architecture Deconstructed',
    category: 'Computer Science & AI',
    type: 'guide',
    difficulty: 'Advanced',
    estimatedReadTime: '10 min read',
    summary: 'Scaled dot-product attention, Query-Key-Value projection matrices, and multi-head representation subspaces.',
    tags: ['Transformers', 'Self-Attention', 'QKV Matrices', 'Softmax Scaling'],
    content: `# Attention & Transformer Mechanisms

## 1. Scaled Dot-Product Attention
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$

### Why the $\\sqrt{d_k}$ Scaling Factor?
For large projection dimensions $d_k$, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients (vanishing softmax gradient). Dividing by $\\sqrt{d_k}$ normalizes the variance back to $1.0$.

## 2. The Query, Key, Value Intuition
- **Query ($Q$)**: "What concept or syntactic role am I looking for?"
- **Key ($K$)**: "What concepts or features do I contain?"
- **Value ($V$)**: "If my Key matches your Query, here is the substantive content to pass downstream."`,
  },
];
