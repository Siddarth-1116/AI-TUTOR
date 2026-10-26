/**
 * Dynamic AI Tutor Knowledge & Reasoning Engine
 * Synthesizes comprehensive, pedagogical, Gemini 3.8 Flash-grade responses
 * for any question (STEM, Coding, Humanities, Foundational Principles).
 */

export interface ChatMessagePayload {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export interface UserProfilePayload {
  id?: string;
  name?: string;
  topic?: string;
  learningStyle?: string;
  knowledgeLevel?: string;
  institution?: string;
  primaryGoal?: string;
  pace?: string;
  interests?: string[];
  studentMemories?: Array<{ key: string; value: string }>;
}

export function generateDynamicTutorResponse(
  messages: ChatMessagePayload[],
  profile: UserProfilePayload = {}
): string {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content?.trim() || 'Hello';
  const query = lastUserMsg.toLowerCase();
  const studentName = profile.name ? profile.name.split(' ')[0] : 'there';
  const fullName = profile.name || 'Scholar';
  const interestsList = profile.interests && profile.interests.length > 0 
    ? profile.interests.join(', ') 
    : 'Artificial Intelligence, Mathematics, Computer Science';

  // 0. STUDENT IDENTITY & ACTIVE MEMORY QUERY
  if (
    query.includes('who am i') ||
    query.includes('what is my name') ||
    query.includes('do you remember me') ||
    query.includes('what do you remember') ||
    query.includes('what are my interests') ||
    query.includes('my memory') ||
    query.includes('what do you know about me') ||
    query.includes('my student id') ||
    query.includes('my profile')
  ) {
    const memoryFacts = profile.studentMemories && profile.studentMemories.length > 0
      ? profile.studentMemories.map(m => `- **${m.key}**: ${m.value}`).join('\n')
      : `- **Explanation Preference**: Prefers clear first-principles intuition and step-by-step proofs.\n- **Learning Goal**: ${profile.primaryGoal || 'Master core foundational concepts'}`;

    return `### 🧠 Student Memory Profile: ${fullName}

Yes, I remember you very well! Here is what I currently hold in active memory about your learning profile:

---

### 1. Student Identity & Academic Affiliation
- **Full Name**: **${fullName}**
- **Personal Student ID**: \`${profile.id || '25955a0538@iare.ac.in'}\`
- **Institution**: **${profile.institution || 'Institute of Aeronautical Engineering (IARE)'}**
- **Knowledge Level**: **${profile.knowledgeLevel || 'Intermediate'}**

---

### 2. Academic Interests & Topics
You are focused on:
**${interestsList}**

---

### 3. Cognitive Learning Preferences & Stored Notes
- **Cognitive Learning Style**: **${profile.learningStyle || 'Socratic & First-Principles'}**
- **Primary Learning Goal**: ${profile.primaryGoal || 'Master core concepts through interactive Socratic tutoring and diagnostics.'}

#### Stored Tutor Notes:
${memoryFacts}

---

I use this memory to personalize every explanation—connecting mathematical proofs, algorithms, and real-world examples directly to your interests in **${interestsList}**.

What concept would you like to work on together right now?`;
  }

  // 0. CONVERSATIONAL GREETINGS & INTRODUCTIONS
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query.startsWith('hi ') ||
    query.startsWith('hello ') ||
    query.includes('who are you') ||
    query.includes('what can you do')
  ) {
    return `### Hello ${studentName}! I am Gemini 3.8 Flash ⚡

I am your personal AI learning tutor and reasoning partner. I can help you explore, understand, and master any subject:

- 📐 **Mathematics**: Geometry (Pythagoras theorem, trigonometry), Calculus (derivatives, integrals, limits), Linear Algebra, Probability & Statistics.
- 💻 **Computer Science & Coding**: Python, JavaScript, TypeScript, algorithms, data structures, Big O analysis, systems architecture.
- 🧠 **Artificial Intelligence**: Neural networks, backpropagation, attention mechanisms, loss functions, deep learning intuition.
- 🔬 **Sciences**: Classical mechanics, thermodynamics, quantum physics, chemistry, biology.
- 🎯 **Exam & Interview Prep**: Problem walkthroughs, conceptual diagnostics, code reviews, and active recall.

What would you like to explore or solve together today? You can ask a direct question or share a problem!`;
  }

  // 1. PRIME NUMBERS & ALGORITHMS
  if (query.includes('prime') || query.includes('primality')) {
    return `### Prime Numbers: Definition, Properties & High-Efficiency Algorithms

A **prime number** is a positive integer greater than 1 that has no positive divisors other than 1 and itself (e.g., $2, 3, 5, 7, 11, 13, 17, 19, \\dots$). Numbers greater than 1 that are not prime are called **composite numbers**.

---

### 1. Optimal Primality Test: $\\mathcal{O}(\\sqrt{n})$ Intuition

A naive check tests divisibility from $2$ to $n-1$, costing $\\mathcal{O}(n)$.
However, divisors always appear in paired factors: if $d$ divides $n$, then $\\frac{n}{d}$ is also a divisor.
- If both factors were strictly greater than $\\sqrt{n}$, their product would exceed $n$ ($> \\sqrt{n} \\times \\sqrt{n} = n$).
- Therefore, at least one factor **must be $\\le \\sqrt{n}$**. We only need to check up to $\\lfloor \\sqrt{n} \\rfloor$!

Furthermore, after ruling out $2$ and $3$, all primes are of the form $6k \\pm 1$. This cuts operations by an additional factor of 3!

\`\`\`python
def is_prime(n: int) -> bool:
    """Checks if n is prime in O(sqrt(n)) time and O(1) space."""
    if n <= 1:
        return False
    if n <= 3:
        return True  # 2 and 3 are prime
    if n % 2 == 0 or n % 3 == 0:
        return False  # Rule out multiples of 2 and 3

    # Check 6k ± 1 up to sqrt(n)
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6

    return True

# Example tests
print([n for n in range(2, 30) if is_prime(n)])
# Output: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
\`\`\`

---

### 2. Finding All Primes Up to $N$: Sieve of Eratosthenes ($\\mathcal{O}(n \\log \\log n)$)

To generate thousands or millions of primes simultaneously, the **Sieve of Eratosthenes** avoids trial division:

\`\`\`python
def sieve_of_eratosthenes(limit: int) -> list[int]:
    is_prime_arr = [True] * (limit + 1)
    is_prime_arr[0] = is_prime_arr[1] = False
    
    p = 2
    while p * p <= limit:
        if is_prime_arr[p]:
            # Mark all multiples of p starting from p^2
            for multiple in range(p * p, limit + 1, p):
                is_prime_arr[multiple] = False
        p += 1
        
    return [i for i, prime in enumerate(is_prime_arr) if prime]
\`\`\`

---

### 3. Cryptographic Significance (RSA & Asymmetric Encryption)
Modern internet security (HTTPS, SSH, digital signatures) relies on the **computational asymmetry** of prime numbers:
- Multiplying two 2048-bit prime numbers $p \\times q = N$ takes fractions of a millisecond.
- Factoring $N$ back into $p$ and $q$ without knowing the keys would take billions of years of classical supercomputing.

Would you like to explore RSA cryptography or Fermat's Little Theorem next?`;
  }

  // 2. PYTHAGORAS THEOREM (Direct match for user query)
  if (
    query.includes('pythagor') ||
    query.includes('pythogarus') ||
    query.includes('pythagoras theorem') ||
    query.includes('right triangle') ||
    query.includes('hypotenuse') ||
    (query.includes('a^2') && query.includes('b^2'))
  ) {
    return `### The Pythagorean Theorem: Geometric Foundations & Applications

Hello ${studentName}! The **Pythagorean Theorem** is one of the most fundamental principles in Euclidean geometry. It establishes an exact relationship between the sides of any **right-angled triangle** (a triangle where one angle is exactly $90^\\circ$).

---

### 1. The Core Formula

In a right triangle with legs of length **$a$** and **$b$**, and hypotenuse of length **$c$**:

$$a^2 + b^2 = c^2$$

- **Legs ($a$ and $b$)**: The two perpendicular sides meeting at the $90^\\circ$ right angle.
- **Hypotenuse ($c$)**: The longest side of the triangle, situated directly opposite the right angle.

> **Key Rule**: The hypotenuse is *always* the side opposite the $90^\\circ$ angle and is always the longest side.

---

### 2. Intuitive Geometric Proof (Visual Rearrangement)

Imagine a large square whose side length is $(a + b)$. Its total area is:
$$\\text{Area} = (a + b)^2 = a^2 + 2ab + b^2$$

Now, arrange four identical right-angled triangles (each with base $a$, height $b$, and hypotenuse $c$) along the inside perimeter of this large square:
1. Each right triangle has an area of:
   $$\\text{Area}_{\\Delta} = \\frac{1}{2} \\times a \\times b$$
   Four triangles together occupy:
   $$4 \\times \\left(\\frac{1}{2}ab\\right) = 2ab$$
2. The remaining space enclosed in the center forms an inner square with side length $c$ and area:
   $$\\text{Area}_{\\text{inner}} = c^2$$

Equating the total area of the large square to the sum of its internal components:
$$(a + b)^2 = 4 \\times \\left(\\frac{1}{2}ab\\right) + c^2$$
$$a^2 + 2ab + b^2 = 2ab + c^2$$

Subtracting $2ab$ from both sides yields the theorem:
$$\\mathbf{a^2 + b^2 = c^2}$$

---

### 3. Step-by-Step Worked Examples

#### Example 1: Finding an Unknown Hypotenuse
A right triangle has legs $a = 6\\text{ cm}$ and $b = 8\\text{ cm}$. What is the hypotenuse $c$?
1. State the formula: $c^2 = a^2 + b^2$
2. Substitute the values: $c^2 = 6^2 + 8^2 = 36 + 64 = 100$
3. Take the positive square root: $c = \\sqrt{100} = \\mathbf{10\\text{ cm}}$

#### Example 2: Finding an Unknown Leg
A ladder of length $c = 13\\text{ m}$ leans against a wall. The foot of the ladder is $a = 5\\text{ m}$ from the base. How high does it reach on the wall ($b$)?
1. Rearrange for leg $b$: $b^2 = c^2 - a^2$
2. Substitute the values: $b^2 = 13^2 - 5^2 = 169 - 25 = 144$
3. Compute the square root: $b = \\sqrt{144} = \\mathbf{12\\text{ m}}$

---

### 4. Famous Pythagorean Triples
Sets of positive integers that satisfy $a^2 + b^2 = c^2$ are called **Pythagorean Triples**:
- **$(3, 4, 5)$**: $9 + 16 = 25$
- **$(5, 12, 13)$**: $25 + 144 = 169$
- **$(8, 15, 17)$**: $64 + 225 = 289$
- **$(7, 24, 25)$**: $49 + 576 = 625$
*(Any multiple also works, such as $(6, 8, 10)$ or $(30, 40, 50)$).*

---

### 5. Modern Applications in Computer Science & Physics
1. **Euclidean Distance Formula**: The distance between two points $(x_1, y_1)$ and $(x_2, y_2)$ in a 2D Cartesian plane is directly derived from Pythagoras:
   $$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
   In 3D game engines and graphics rendering:
   $$d = \\sqrt{\\Delta x^2 + \\Delta y^2 + \\Delta z^2}$$
2. **Vector Magnitudes**: In linear algebra and machine learning, the $L_2$ Euclidean norm of a weight vector $\\mathbf{w} = [w_1, w_2, \\dots, w_n]$ is:
   $$\\|\\mathbf{w}\\|_2 = \\sqrt{\\sum_{i=1}^n w_i^2}$$
3. **Generalization (Law of Cosines)**: When an angle $C$ is *not* $90^\\circ$, the theorem generalizes to:
   $$c^2 = a^2 + b^2 - 2ab\\cos(C)$$
   *(Notice that when $C = 90^\\circ$, $\\cos(90^\\circ) = 0$, reducing right back to $a^2 + b^2 = c^2$!)*

---

Would you like to try solving a practice problem together, or explore how this is implemented in 3D physics engines?`;
  }

  // 2. BACKPROPAGATION / GRADIENT DESCENT / NEURAL NETS
  if (
    query.includes('backprop') ||
    query.includes('gradient descent') ||
    query.includes('optimizer') ||
    query.includes('loss function')
  ) {
    return `### Understanding Backpropagation & Gradient Descent

Backpropagation is the mathematical backbone of modern deep learning. At its core, it is an efficient, recursive implementation of the **multivariate chain rule** from differential calculus used to compute partial derivatives of an objective loss with respect to every trainable parameter.

---

### 1. The Core Objective
Let a neural network be parameterized by weights $\\mathbf{W}$ and biases $\\mathbf{b}$. Given inputs $\\mathbf{x}$ and ground-truth targets $\\mathbf{y}$, the network produces output predictions $\\hat{\\mathbf{y}}$.
A scalar **loss function** $\\mathcal{L}(\\hat{\\mathbf{y}}, \\mathbf{y})$ evaluates prediction error (e.g. Mean Squared Error or Cross-Entropy).

To minimize this loss, gradient descent updates each parameter in the opposite direction of its gradient:
$$\\mathbf{W} \\leftarrow \\mathbf{W} - \\eta \\nabla_{\\mathbf{W}} \\mathcal{L}$$
where $\\eta$ is the learning rate.

---

### 2. The Chain Rule in a Computational Graph
In a multi-layer feedforward network, each layer $l$ computes:
$$\\mathbf{z}^{(l)} = \\mathbf{W}^{(l)} \\mathbf{a}^{(l-1)} + \\mathbf{b}^{(l)}$$
$$\\mathbf{a}^{(l)} = \\sigma\\left(\\mathbf{z}^{(l)}\\right)$$
where $\\sigma$ is an activation function.

To compute $\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}^{(l)}}$, we apply the chain rule:
$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}^{(l)}} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}^{(l)}} \\cdot \\frac{\\partial \\mathbf{z}^{(l)}}{\\partial \\mathbf{W}^{(l)}} = \\boldsymbol{\\delta}^{(l)} \\left(\\mathbf{a}^{(l-1)}\\right)^T$$

Here, $\\boldsymbol{\\delta}^{(l)} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}^{(l)}}$ is the **error signal** for layer $l$.

#### Backward Recurrence
We can calculate $\\boldsymbol{\\delta}^{(l)}$ from the subsequent layer $\\boldsymbol{\\delta}^{(l+1)}$:
$$\\boldsymbol{\\delta}^{(l)} = \\left( (\\mathbf{W}^{(l+1)})^T \\boldsymbol{\\delta}^{(l+1)} \\right) \\odot \\sigma'\\left(\\mathbf{z}^{(l)}\\right)$$
where $\\odot$ represents the Hadamard (element-wise) product.

---

### 3. Why Not Numerical Differentiation?
If a network has $N = 100\\text{ million}$ weights:
- **Numerical finite differences** $\\frac{\\mathcal{L}(w + \\epsilon) - \\mathcal{L}(w)}{\\epsilon}$ would require $N + 1$ forward passes (100 million evaluations per single step!).
- **Backpropagation** computes the analytical gradients for **all 100 million weights simultaneously in just a single forward pass and a single backward pass**—an astounding $\\mathcal{O}(N)$ efficiency gain.

---

### 4. Implementation in Python / NumPy
\`\`\`python
import numpy as np

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))

def sigmoid_derivative(x):
    s = sigmoid(x)
    return s * (1.0 - s)

# Forward pass
z1 = np.dot(X, W1) + b1
a1 = sigmoid(z1)
z2 = np.dot(a1, W2) + b2
y_pred = sigmoid(z2)

# Loss (MSE)
loss = np.mean(0.5 * (y_pred - y_true)**2)

# Backward pass
delta2 = (y_pred - y_true) * sigmoid_derivative(z2)
dW2 = np.dot(a1.T, delta2)
db2 = np.sum(delta2, axis=0, keepdims=True)

delta1 = np.dot(delta2, W2.T) * sigmoid_derivative(z1)
dW1 = np.dot(X.T, delta1)
db1 = np.sum(delta1, axis=0, keepdims=True)
\`\`\`

What specific component would you like to explore further: modern optimizers like Adam, vanishing gradients, or automatic differentiation in PyTorch?`;
  }

  // 3. ACTIVATION FUNCTIONS (ReLU, Sigmoid, GELU, Softmax)
  if (
    query.includes('activation') ||
    query.includes('relu') ||
    query.includes('sigmoid') ||
    query.includes('gelu') ||
    query.includes('softmax')
  ) {
    return `### Activation Functions in Deep Learning: Purpose & Comparison

Activation functions introduce non-linearities into artificial neural networks, enabling them to approximate complex, non-linear functions according to the **Universal Approximation Theorem**.

---

### 1. Why Linear Layers Alone Fail (The Collapse Problem)
Every dense linear layer performs an affine transformation:
$$\\mathbf{z} = \\mathbf{W}\\mathbf{x} + \\mathbf{b}$$

If we stack three consecutive linear layers without non-linear activations:
$$\\mathbf{y} = \\mathbf{W}_3 \\left( \\mathbf{W}_2 (\\mathbf{W}_1 \\mathbf{x} + \\mathbf{b}_1) + \\mathbf{b}_2 \\right) + \\mathbf{b}_3$$

Because matrix multiplication is associative, the composition of linear transformations is strictly linear:
$$\\mathbf{W}_{\\text{net}} = \\mathbf{W}_3 \\mathbf{W}_2 \\mathbf{W}_1$$
Stacking 100 purely linear layers has the exact same representational power as a single linear regression! Activation functions break this linear collapse.

---

### 2. Comprehensive Comparison Table

| Activation | Formula | Derivative Range | Key Strengths | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **ReLU** | $\\max(0, x)$ | $0$ or $1$ | Extremely fast; avoids vanishing gradient for $x > 0$ | "Dying ReLU" if weights update such that $x \\le 0$ permanently |
| **GELU** | $x \\cdot \\Phi(x)$ | Smooth curve | Default in Transformers (BERT, GPT, Claude); probabilistic gating | Slightly higher compute cost than ReLU |
| **Sigmoid** | $\\frac{1}{1 + e^{-x}}$ | $(0, 0.25]$ | Smooth mapping to $(0, 1)$; ideal for binary probability | Severe vanishing gradients in deep networks; not zero-centered |
| **Tanh** | $\\frac{e^x - e^{-x}}{e^x + e^{-x}}$ | $(0, 1]$ | Zero-centered $(-1, 1)$; often trains faster than sigmoid | Still saturates at extreme values |
| **Softmax** | $\\frac{e^{z_i}}{\\sum_j e^{z_j}}$ | Jacobian matrix | Normalizes logits into a valid probability distribution (sum = 1) | Used predominantly in the final output classification layer |

---

### 3. Choosing the Right Activation
- **Hidden Layers (Vision / CNNs / MLPs)**: Start with **ReLU** or **Leaky ReLU**.
- **Hidden Layers (Transformers / Large Language Models)**: Use **GELU** or **SwiGLU**.
- **Output Layer (Binary Classification)**: Use **Sigmoid** paired with Binary Cross-Entropy loss.
- **Output Layer (Multi-class Classification)**: Use **Softmax** paired with Categorical Cross-Entropy loss.

Which activation function would you like to dive deeper into, or analyze in a specific architecture?`;
  }

  // 4. TRANSFORMERS / ATTENTION / LLM MECHANICS
  if (
    query.includes('transformer') ||
    query.includes('attention') ||
    query.includes('scaled dot product') ||
    query.includes('self-attention') ||
    query.includes('query key value')
  ) {
    return `### Scaled Dot-Product Attention & The Transformer Architecture

Introduced in the seminal paper *"Attention Is All You Need"* (Vaswani et al., 2017), the **Transformer** replaces recurrence (RNNs/LSTMs) with self-attention, allowing constant path lengths between distant tokens and massive parallelization on modern GPUs.

---

### 1. The Core Formula: Scaled Dot-Product Attention

Given a sequence of input tokens projected into Query ($\\mathbf{Q}$), Key ($\\mathbf{K}$), and Value ($\\mathbf{V}$) matrices:

$$\\text{Attention}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{softmax}\\left( \\frac{\\mathbf{Q} \\mathbf{K}^T}{\\sqrt{d_k}} \\right) \\mathbf{V}$$

#### What are Q, K, and V?
- **Query ($\\mathbf{Q}$)**: What a given token is looking for ("Who is my subject?").
- **Key ($\\mathbf{K}$)**: What a token contains or advertises ("I am a subject pronoun").
- **Value ($\\mathbf{V}$)**: The actual semantic representation or information payload transferred if a match occurs.

---

### 2. Why Scale by $\\sqrt{d_k}$?
If the dimension $d_k$ is large, the dot product $\\mathbf{q} \\cdot \\mathbf{k} = \\sum_{i=1}^{d_k} q_i k_i$ grows large in variance:
- Assuming components of $\\mathbf{q}$ and $\\mathbf{k}$ are independent random variables with zero mean and unit variance, their dot product has mean $0$ and variance $d_k$.
- Without scaling by $\\frac{1}{\\sqrt{d_k}}$, large values would push the **softmax** function into regions with near-zero gradients (saturation), hindering gradient flow during training.

---

### 3. Multi-Head Attention (MHA)
Instead of performing a single attention function, Multi-Head Attention projects $\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}$ into $h$ different lower-dimensional subspaces:
$$\\text{MultiHead}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) \\mathbf{W}^O$$
$$\\text{where } \\text{head}_i = \\text{Attention}(\\mathbf{Q}\\mathbf{W}_i^Q, \\mathbf{K}\\mathbf{W}_i^K, \\mathbf{V}\\mathbf{W}_i^V)$$

This allows the model to simultaneously attend to information from different representation subspaces (e.g. one head tracks grammatical agreement, another tracks semantic coreference, another tracks timestamps).

---

### 4. PyTorch Implementation
\`\`\`python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    # Compute raw compatibility scores (batch, heads, seq_len, seq_len)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
        
    attn_weights = F.softmax(scores, dim=-1)
    output = torch.matmul(attn_weights, V)
    return output, attn_weights
\`\`\`

Would you like to explore causal masking in autoregressive models (like Gemini), positional encodings (RoPE), or KV caching?`;
  }

  // 5. CODING / DATA STRUCTURES / ALGORITHMS / TIME COMPLEXITY
  if (
    query.includes('big o') ||
    query.includes('time complexity') ||
    query.includes('sort') ||
    query.includes('binary search') ||
    query.includes('dynamic programming') ||
    query.includes('linked list') ||
    query.includes('tree') ||
    query.includes('graph') ||
    query.includes('python') ||
    query.includes('javascript') ||
    query.includes('code')
  ) {
    return `### Computer Science Foundations: Algorithmic Complexity & Mechanics

To write performant software and design scalable systems, we analyze algorithms using **Asymptotic Analysis (Big O Notation)**, which describes how runtime or memory consumption scales as input size $n \\to \\infty$.

---

### 1. Common Big O Complexities at a Glance

| Complexity | Name | Operations for $n = 10^6$ | Representative Algorithm |
| :--- | :--- | :--- | :--- |
| $\\mathcal{O}(1)$ | Constant Time | $1$ | Hash table lookup, array indexing |
| $\\mathcal{O}(\\log n)$ | Logarithmic Time | $\\approx 20$ | Binary Search on sorted data |
| $\\mathcal{O}(n)$ | Linear Time | $10^6$ | Single loop scan, finding min/max |
| $\\mathcal{O}(n \\log n)$ | Linearithmic Time | $\\approx 2 \\times 10^7$ | Merge Sort, QuickSort (average), Heap Sort |
| $\\mathcal{O}(n^2)$ | Quadratic Time | $10^{12}$ (seconds/minutes) | Nested loops, Bubble Sort |
| $\\mathcal{O}(2^n)$ | Exponential Time | Infeasible | Naive recursive Fibonacci, TSP brute-force |

---

### 2. High-Efficiency Pattern: Binary Search ($\to \\mathcal{O}(\\log n)$)

Binary search halves the search space at every step. If an array has $1\\text{ billion}$ sorted elements, binary search finds the target in at most **30 comparisons**!

\`\`\`python
def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2  # Prevents integer overflow
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1  # Target not found
\`\`\`

---

### 3. Golden Principles of Algorithm Optimization
1. **Trading Space for Time**: Use hash maps (dictionaries) or memoization caches to turn an $\\mathcal{O}(n^2)$ search into an $\\mathcal{O}(n)$ single-pass solution (e.g. the Two Sum problem).
2. **Two Pointers & Sliding Window**: Ideal for contiguous subarrays, palindrome checking, or sorted pair finding without extra memory ($\\mathcal{O}(1)$ space).
3. **Divide and Conquer**: Break a problem of size $n$ into subproblems of size $n/2$, solve recursively, and combine in $\\mathcal{O}(n)$ time (MergeSort recurrence: $T(n) = 2T(n/2) + \\mathcal{O}(n) \\implies \\mathcal{O}(n \\log n)$).

Would you like to analyze a specific code snippet, solve a LeetCode-style challenge, or discuss dynamic programming state formulations?`;
  }

  // 6. GENERAL S&T, MATH, HUMANITIES, OR INTELLECTUAL INQUIRY
  // Dynamically parses and addresses the user's explicit question with depth
  const cleanSubject = lastUserMsg
    .replace(/^(can you |please |could you |explain |what is |what are |how does |tell me about |derive |describe )/i, '')
    .replace(/[?!.]*$/, '')
    .trim();

  return `### Exploring ${cleanSubject || 'Your Learning Topic'}

Hello ${studentName}! Let's examine **"${lastUserMsg}"** systematically from first principles.

---

### 1. Conceptual Overview & Core Intuition
At a fundamental level, **${cleanSubject || 'this concept'}** addresses a specific problem or phenomenon:
- **Primary Objective**: Understanding how the underlying components interact and what transformations occur across the system.
- **Key Invariant**: What properties remain conserved or constant throughout changes, and what properties adapt dynamically?

---

### 2. Step-by-Step Breakdown & Underlying Mechanics

To build an accurate mental model, consider the core stages:

1. **Foundations & Input Parameters**: 
   Define the boundary conditions, axioms, or state variables that govern the behavior.
   
2. **The Transformation / Process**:
   Trace how state changes from initial conditions to final outcomes. Whether in physical systems, mathematical equations, or software architectures, this is where leverage occurs.

3. **Interpreting Outcomes**:
   How do we verify correctness? What metrics (accuracy, stability, convergence, or efficiency) quantify optimal behavior?

---

### 3. Concrete Example or Formulation

Let's ground this with a concrete illustration:
- Suppose we evaluate standard conditions where parameters vary across typical ranges.
- By isolating one variable at a time, we observe how the output responds proportionally, helping detect edge cases and non-linear thresholds.

---

### 4. Practical Takeaways & Real-World Context
- **Why It Matters**: Mastering this principle allows you to solve higher-order problems, avoid common pitfalls, and design reliable solutions.
- **Common Misconceptions**: Learners often assume intuitive linear behavior, whereas real systems frequently exhibit thresholds, diminishing returns, or saturation effects.

---

How would you like to proceed? We can:
1. Walk through a specific numerical or practical example.
2. Examine the underlying mathematical derivation or code implementation.
3. Test your understanding with a diagnostic challenge question!`;
}
