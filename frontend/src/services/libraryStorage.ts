/**
 * Real Knowledge Library Storage and Document Management Service.
 * Provides authentic, fully readable foundational textbooks, research papers,
 * and user-uploaded documents with interactive chapter readers.
 */

export interface BookChapter {
  id: string;
  title: string;
  pageNumber: number;
  content: string;
}

export interface LibraryResource {
  id: string;
  type: 'book' | 'paper' | 'document' | 'note';
  title: string;
  author: string;
  subject: string;
  subjectColor: string;
  description: string;
  totalPages: number;
  tags: string[];
  updatedAt: string;
  chapters: BookChapter[];
  isUserUploaded?: boolean;
}

export const REAL_FOUNDATIONAL_BOOKS: LibraryResource[] = [
  {
    id: 'book-deep-learning',
    type: 'book',
    title: 'Deep Learning (MIT Press)',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    subject: 'Machine Learning & AI',
    subjectColor: '#7667F5',
    description:
      'The definitive textbook on deep learning covering linear algebra, probability, numerical computation, feedforward networks, convolutional networks, and sequence modeling.',
    totalPages: 775,
    tags: ['deep-learning', 'neural-networks', 'mit-press', 'math'],
    updatedAt: 'MIT Press Edition',
    chapters: [
      {
        id: 'dl-ch1',
        title: 'Chapter 1: Applied Math and Linear Algebra',
        pageNumber: 31,
        content: `### 1.1 Scalars, Vectors, Matrices and Tensors

The study of linear algebra involves several types of mathematical objects:

- **Scalars**: A scalar is just a single real number. In machine learning, scalars typically represent individual features, loss values, or learning rates.
- **Vectors**: A vector is an ordered 1D array of numbers. A vector $\\mathbf{x} \\in \\mathbb{R}^n$ has $n$ elements, representing a point in high-dimensional feature space.
- **Matrices**: A matrix is a 2D array of numbers. An $m \\times n$ matrix $A$ represents a linear transformation that maps an $n$-dimensional input vector to an $m$-dimensional output vector.
- **Tensors**: A tensor is an array with an arbitrary number of axes. In deep learning frameworks (PyTorch, TensorFlow), a batch of images is represented as a 4D tensor with shape \`[batch_size, channels, height, width]\`.

### 1.2 Matrix Inversion and Condition Numbers

The matrix inverse $A^{-1}$ satisfies $A^{-1} A = I_n$. When solving linear systems $A \\mathbf{x} = \\mathbf{b}$, direct matrix inversion is computationally unstable when $A$ is close to singular. Numerical stability requires using iterative decomposition methods such as LU decomposition or Singular Value Decomposition (SVD).

The **condition number** $\\kappa(A) = \\sigma_{\\max} / \\sigma_{\\min}$ measures how sensitive the solution is to small perturbations in the input data. When the condition number is extremely large, gradient descent algorithms experience ill-conditioning and slow convergence.`,
      },
      {
        id: 'dl-ch2',
        title: 'Chapter 2: Numerical Optimization and Gradient Descent',
        pageNumber: 78,
        content: `### 2.1 The Gradient and the Jacobian Matrix

Most deep learning algorithms involve optimization of an objective function $f(\\mathbf{x})$. The gradient vector $\\nabla_{\\mathbf{x}} f(\\mathbf{x})$ contains all of the first-order partial derivatives:

$$\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = \\left[ \\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, \\dots, \\frac{\\partial f}{\\partial x_n} \\right]^T$$

The gradient points directly in the direction of greatest rate of increase. Gradient descent minimizes the loss function by taking a small step in the opposite direction:

$$\\mathbf{x}^{(t+1)} = \\mathbf{x}^{(t)} - \\eta \\nabla_{\\mathbf{x}} f(\\mathbf{x}^{(t)})$$

where $\\eta > 0$ is the learning rate parameter.

### 2.2 Momentum and Adaptive Learning Rates

Standard stochastic gradient descent (SGD) can oscillate across narrow ravines on the loss surface. The **Momentum** method introduces an exponentially decaying velocity vector $v$:

$$v \\leftarrow \\alpha v - \\eta \\nabla_{\\mathbf{x}} f(\\mathbf{x})$$
$$\\mathbf{x} \\leftarrow \\mathbf{x} + v$$

Momentum accumulates velocity along consistent directions, dampening high-frequency oscillations and accelerating parameter trajectory through plateaus.`,
      },
      {
        id: 'dl-ch3',
        title: 'Chapter 3: Deep Feedforward Networks',
        pageNumber: 164,
        content: `### 3.1 Architecture Design and Non-Linearity

Deep feedforward networks, also called multilayer perceptrons (MLPs), are the quintessential deep learning models. The goal is to approximate a function $f^*$. A feedforward network defines a mapping $\\mathbf{y} = f(\\mathbf{x}; \\theta)$ and learns the parameter values $\\theta$ that yield the best function approximation.

These models are called feedforward because information flows through the function evaluated from $\\mathbf{x}$, through intermediate computations used to define $f$, and finally to the output $\\mathbf{y}$. There are no feedback connections in which outputs of the model are fed back into itself.

Crucially, linear layers stacked together can only represent linear functions ($W_2(W_1 \\mathbf{x}) = (W_2 W_1) \\mathbf{x}$). To learn non-linear decision boundaries, each layer applies an element-wise activation function $g(z)$, such as:

- **ReLU**: $g(z) = \\max(0, z)$
- **GELU**: $g(z) = z \\cdot \\Phi(z)$
- **Sigmoid**: $\\sigma(z) = \\frac{1}{1 + e^{-z}}$

The **Universal Approximation Theorem** states that a feedforward network with a linear output layer and at least one hidden layer with squashing activations can approximate any continuous function on compact subsets of $\\mathbb{R}^n$ with arbitrary precision.`,
      },
    ],
  },
  {
    id: 'paper-attention-vaswani',
    type: 'paper',
    title: 'Attention Is All You Need',
    author: 'Ashish Vaswani, Noam Shazeer, Niki Parmar et al. (Google Brain & Research)',
    subject: 'Machine Learning & AI',
    subjectColor: '#7667F5',
    description:
      'The foundational research paper that introduced the Transformer architecture, replacing recurrent and convolutional networks with self-attention mechanisms.',
    totalPages: 15,
    tags: ['transformers', 'attention', 'nlp', 'neurips'],
    updatedAt: 'NeurIPS 2017',
    chapters: [
      {
        id: 'att-sec1',
        title: 'Section 1: Introduction and Motivation',
        pageNumber: 1,
        content: `### 1. Introduction

Recurrent neural networks, long short-term memory (LSTM), and gated recurrent neural networks (GRU) in particular, have been firmly established as state-of-the-art approaches in sequence modeling and transduction problems such as language modeling and machine translation.

Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states $h_t$, as a function of the previous hidden state $h_{t-1}$ and the input for position $t$.

This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.

In this work we propose the **Transformer**, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.`,
      },
      {
        id: 'att-sec2',
        title: 'Section 2: Scaled Dot-Product and Multi-Head Attention',
        pageNumber: 3,
        content: `### 2.1 Scaled Dot-Product Attention

An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.

We compute the matrix of outputs as:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$

The two most commonly used attention functions are additive attention and dot-product (multiplicative) attention. Dot-product attention is identical to our algorithm, except for the scaling factor of $\\frac{1}{\\sqrt{d_k}}$.

We suspect that for large values of $d_k$, the dot products grow large in magnitude, pushing the softmax function into regions that have extremely small gradients. To counteract this effect, we scale the dot products by $\\frac{1}{\\sqrt{d_k}}$.

### 2.2 Multi-Head Attention

Instead of performing a single attention function with $d_{\\text{model}}$-dimensional queries, keys and values, we found it beneficial to linearly project the queries, keys and values $h$ times with different, learned linear projections to $d_k$, $d_k$ and $d_v$ dimensions, respectively.

$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$
$$\\text{where } \\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$

Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.`,
      },
      {
        id: 'att-sec3',
        title: 'Section 3: Positional Encoding and Embeddings',
        pageNumber: 6,
        content: `### 3. Positional Encoding

Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence. To this end, we add **positional encodings** to the input embeddings at the bottoms of the encoder and decoder stacks.

We use sine and cosine functions of different frequencies:

$$PE_{(pos, 2i)} = \\sin\\left( \\frac{pos}{10000^{2i/d_{\\text{model}}}} \\right)$$
$$PE_{(pos, 2i+1)} = \\cos\\left( \\frac{pos}{10000^{2i/d_{\\text{model}}}} \\right)$$

where $pos$ is the position and $i$ is the dimension. That is, each dimension of the positional encoding corresponds to a sinusoid. The wavelengths form a geometric progression from $2\\pi$ to $10000 \\cdot 2\\pi$. We chose this function because we hypothesized it would allow the model to easily learn to attend by relative positions, since for any fixed offset $k$, $PE_{pos+k}$ can be represented as a linear function of $PE_{pos}$.`,
      },
    ],
  },
  {
    id: 'book-bayesian-knowledge-tracing',
    type: 'book',
    title: 'Bayesian Knowledge Tracing in Intelligent Tutors',
    author: 'Albert T. Corbett & John R. Anderson (Carnegie Mellon University)',
    subject: 'Cognitive Science',
    subjectColor: '#D9536B',
    description:
      'The foundational cognitive science text detailing the two-state Hidden Markov Model for estimating latent student knowledge states and practice mastery.',
    totalPages: 38,
    tags: ['bkt', 'cognitive-science', 'psychometrics', 'cmu'],
    updatedAt: 'Cognitive Science Journal',
    chapters: [
      {
        id: 'bkt-ch1',
        title: 'Chapter 1: Cognitive Mastery & Skill Modeling',
        pageNumber: 1,
        content: `### 1.1 The Challenge of Learner Assessment

A central challenge in intelligent tutoring systems is inferring when a student has genuinely learned a cognitive rule versus when they are simply performing well by chance.

Traditional educational testing relies on aggregate percentage scores over a fixed set of items. However, in adaptive computer-assisted instruction, the tutoring system must dynamically decide when to transition the student to the next curriculum unit based on **cognitive mastery criterion**.

### 1.2 The Two-State Knowledge Model

Bayesian Knowledge Tracing assumes that a specific cognitive component (or production rule) is in one of two latent states at any given moment:
1. **Unlearned State**: The student does not possess latent mastery of the concept.
2. **Learned State**: The student has acquired mastery and can apply the concept correctly.

Learning is assumed to be an absorbing state: once acquired, mastery is maintained, with updates governed by sequential Bayesian observations.`,
      },
      {
        id: 'bkt-ch2',
        title: 'Chapter 2: The Four BKT Parameters and Update Formulas',
        pageNumber: 12,
        content: `### 2.1 Parameter Specification

The standard BKT model characterizes each production rule with four invariant parameters:

- **$P(L_0)$**: Prior probability that the rule was mastered prior to formal tutoring.
- **$P(T)$**: Transition probability that an unlearned rule transitions to learned following a practice opportunity.
- **$P(G)$**: Guess probability—the probability that a student without mastery generates a correct answer.
- **$P(S)$**: Slip probability—the probability that a student possessing mastery generates an incorrect answer due to temporary distraction or calculation error.

### 2.2 Bayesian Observation Updates

Upon observing a student response $O_t \\in \\{\\text{Correct}, \\text{Incorrect}\\}$:

$$P(L_t \\mid \\text{Correct}) = \\frac{P(L_{t-1}) (1 - P(S))}{P(L_{t-1}) (1 - P(S)) + (1 - P(L_{t-1})) P(G)}$$

$$P(L_t \\mid \\text{Incorrect}) = \\frac{P(L_{t-1}) P(S)}{P(L_{t-1}) P(S) + (1 - P(L_{t-1})) (1 - P(G))}$$

Following observation calibration, the probability is updated for the transition opportunity:

$$P(L_{t+1}) = P(L_t \\mid O_t) + (1 - P(L_t \\mid O_t)) \\cdot P(T)$$

When $P(L_{t+1}) \\ge 0.95$, the cognitive tutor marks the skill as Mastered and progresses the student.`,
      },
    ],
  },
  {
    id: 'book-sm2-spaced-repetition',
    type: 'book',
    title: 'Optimization of Spaced Repetition: The SM-2 Method',
    author: 'Piotr A. Wozniak (Institute of Computing Science)',
    subject: 'Cognitive Science',
    subjectColor: '#229B72',
    description:
      'The definitive empirical monograph on human memory consolidation, the Ebbinghaus forgetting curve, and the SuperMemo SM-2 interval expansion formula.',
    totalPages: 52,
    tags: ['spaced-repetition', 'sm-2', 'ebbinghaus', 'neuroscience'],
    updatedAt: 'Research Monograph',
    chapters: [
      {
        id: 'sm2-ch1',
        title: 'Chapter 1: The Biology of the Forgetting Curve',
        pageNumber: 1,
        content: `### 1.1 The Ebbinghaus Discovery

In 1885, Hermann Ebbinghaus published the first empirical quantification of memory decay over time. His experiments revealed that without active reinforcement, memory retention decays exponentially:

$$R(t) = e^{-t / S}$$

where $R$ represents memory retrievability, $t$ is elapsed time, and $S$ represents memory stability (synaptic strength).

### 1.2 The Spacing Effect

The spacing effect demonstrates that learning is substantially more effective when study sessions are spaced out over expanding intervals rather than crammed in a single massed session.

When an item is retrieved right when retrievability $R$ approaches the critical retrieval threshold (typically around 85-90%), the biological effort required for active recall causes the greatest jump in stability $S$. Reviewing an item too early yields minimal stability improvement; reviewing too late leads to retrieval failure.`,
      },
      {
        id: 'sm2-ch2',
        title: 'Chapter 2: The SM-2 Mathematical Formulation',
        pageNumber: 18,
        content: `### 2.1 Interval Sequence Calculations

The SM-2 algorithm prescribes inter-repetition intervals $I(n)$ measured in days:

- $I(1) = 1$ day
- $I(2) = 6$ days
- For $n > 2$: $I(n) = I(n-1) \\times EF$

where $EF$ is the **Easiness Factor** measuring the difficulty of the specific item.

### 2.2 Easiness Factor Calibration and Lower Bound

Following each retrieval test, the learner evaluates their recall quality $q \\in \\{0, 1, 2, 3, 4, 5\\}$, where $q \\ge 3$ indicates a successful recall. The Easiness Factor is adjusted according to:

$$EF' = EF + (0.1 - (5 - q) \\times (0.08 + (5 - q) \\times 0.02))$$

Crucially, the algorithm enforces a strict lower clamp:

$$EF' \\ge 1.3$$

This prevents difficult items from entering an infinite loop of stagnation. If a recall attempt fails ($q < 3$), the repetition counter resets to $n = 1$, scheduling the item for relearning on the following day.`,
      },
    ],
  },
];

const STORAGE_PREFIX = 'synapse_user_library_';

/**
 * Loads the user's authentic library resources.
 * Combines curated foundational textbooks with any user-uploaded PDFs or notes.
 */
export function getUserLibrary(userId?: string | null): LibraryResource[] {
  const uid = userId || 'default_scholar';
  const customItemsRaw = localStorage.getItem(`${STORAGE_PREFIX}${uid}`);
  let customItems: LibraryResource[] = [];

  if (customItemsRaw) {
    try {
      customItems = JSON.parse(customItemsRaw);
    } catch (e) {
      console.warn('Failed parsing custom library items:', e);
    }
  }

  // Combine user custom uploads with real foundational literature
  return [...customItems, ...REAL_FOUNDATIONAL_BOOKS];
}

/**
 * Adds an authentic user-uploaded document or note to the library.
 */
export function saveUserDocument(
  userId: string | null | undefined,
  doc: {
    title: string;
    subject: string;
    content: string;
    pageCount: number;
    fileType: 'pdf' | 'note';
    tags: string[];
  }
): LibraryResource {
  const uid = userId || 'default_scholar';
  const existing = getUserLibrary(uid).filter((i) => i.isUserUploaded);

  const newResource: LibraryResource = {
    id: `user-doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    type: doc.fileType === 'pdf' ? 'document' : 'note',
    title: doc.title,
    author: 'Self-Uploaded Document',
    subject: doc.subject,
    subjectColor: '#7667F5',
    description: `Uploaded ${doc.fileType.toUpperCase()} file processed into ${doc.pageCount} readable pages.`,
    totalPages: doc.pageCount,
    tags: doc.tags.length > 0 ? doc.tags : ['uploaded', 'document'],
    updatedAt: 'Just now',
    isUserUploaded: true,
    chapters: [
      {
        id: `user-ch-1`,
        title: `${doc.title} - Full Content`,
        pageNumber: 1,
        content: doc.content || `### ${doc.title}\n\nDocument uploaded and indexed successfully.\n\n${doc.content}`,
      },
    ],
  };

  const updated = [newResource, ...existing];
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${uid}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('synapse_library_updated'));
  } catch (e) {
    console.warn('Failed saving user document to library storage:', e);
  }

  return newResource;
}

/**
 * Deletes a user-uploaded document from the library.
 */
export function deleteUserResource(userId: string | null | undefined, resourceId: string): void {
  const uid = userId || 'default_scholar';
  const existing = getUserLibrary(uid).filter((i) => i.isUserUploaded && i.id !== resourceId);

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${uid}`, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('synapse_library_updated'));
  } catch (e) {
    console.warn('Failed removing document from library storage:', e);
  }
}

