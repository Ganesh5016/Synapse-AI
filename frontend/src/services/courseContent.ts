/**
 * Comprehensive Course Curriculum, Learning Materials, and Assessment Question Bank.
 * Provides structured educational lessons ("something to learn") followed by tailored MCQ assessments.
 */

export interface CourseQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

export interface LessonSection {
  title: string;
  content: string;
  formula?: string;
  codeSnippet?: string;
}

export interface CourseData {
  id: string;
  slug: string;
  title: string;
  subject: string;
  subjectId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  overview: string;
  sections: LessonSection[];
  keyTakeaways: string[];
  questions: CourseQuestion[];
}

export const COURSE_CURRICULUM: Record<string, CourseData> = {
  // 1. Linear Algebra Foundations
  'c0000000-0000-0000-0000-000000000001': {
    id: 'c0000000-0000-0000-0000-000000000001',
    slug: 'linear-algebra-foundations',
    title: 'Linear Algebra Foundations',
    subject: 'Mathematics & Stats',
    subjectId: 'a0000000-0000-0000-0000-000000000003',
    difficulty: 'beginner',
    estimatedMinutes: 6,
    overview:
      'Linear algebra is the foundational mathematical language of modern machine learning. Neural network weights, activation vectors, and embeddings are expressed and transformed using matrix operations.',
    sections: [
      {
        title: '1. Vectors, Norms, and Dot Products',
        content:
          'A vector is an ordered collection of scalars representing coordinates in high-dimensional space. The dot product of two vectors measures both their directional alignment and magnitude. When normalized by vector magnitudes, the dot product computes Cosine Similarity, which forms the basis for semantic search and neural attention.',
        formula: 'x · y = ∑(x_i * y_i) = ||x|| ||y|| cos(θ)',
      },
      {
        title: '2. Matrices as Linear Transformations',
        content:
          'A matrix is not merely a 2D table of numbers; it defines a geometric linear transformation. Multiplying a vector by a matrix rotates, scales, or shears the underlying vector space while preserving the origin and straight coordinate lines.',
        formula: 'y = A x',
      },
      {
        title: '3. Eigenvalues and Eigenvectors',
        content:
          'For a square transformation matrix A, an eigenvector is a special non-zero vector whose direction does not change under multiplication by A—it is merely scaled by a factor λ called the eigenvalue. Eigen-decomposition underlies Principal Component Analysis (PCA) and dimensionality reduction.',
        formula: 'A v = λ v',
      },
    ],
    keyTakeaways: [
      'The dot product measures directional alignment between vectors; normalized, it gives cosine similarity.',
      'Matrix multiplication represents a geometric transformation that reshapes high-dimensional spaces.',
      'Eigenvectors maintain their spatial direction when multiplied by a matrix, being scaled solely by their eigenvalue λ.',
    ],
    questions: [
      {
        id: 'la-q1',
        prompt: 'What geometric property is measured by the dot product of two unit vectors (magnitude = 1)?',
        options: [
          'The cosine of the angle between them',
          'The Euclidean distance between their endpoints',
          'The determinant of their spanning subspace',
          'The orthogonal projection area only',
        ],
        correctAnswer: 'The cosine of the angle between them',
        explanation:
          'For unit vectors where ||x|| = 1 and ||y|| = 1, x · y = cos(θ). If they point in the exact same direction, cos(0) = 1; if orthogonal, cos(90°) = 0.',
        hint: 'Recall the formula x · y = ||x|| ||y|| cos(θ).',
      },
      {
        id: 'la-q2',
        prompt: 'Given matrix equation A v = λ v, what does λ represent if v is non-zero?',
        options: [
          'The eigenvalue corresponding to eigenvector v',
          'The trace of matrix A',
          'The inverse matrix determinant',
          'The learning rate multiplier',
        ],
        correctAnswer: 'The eigenvalue corresponding to eigenvector v',
        explanation:
          'In the characteristic equation A v = λ v, v is the eigenvector and scalar λ is its corresponding eigenvalue.',
        hint: 'This scalar determines how much the eigenvector stretches or shrinks.',
      },
      {
        id: 'la-q3',
        prompt: 'What happens to the vector space origin (0, 0, ...) under a linear transformation A x?',
        options: [
          'It is strictly invariant and remains mapped to the origin',
          'It translates by the Frobenius norm of A',
          'It shifts according to the eigenvalues',
          'It collapses to undefined singularity',
        ],
        correctAnswer: 'It is strictly invariant and remains mapped to the origin',
        explanation:
          'By definition of linearity, T(0) = A * 0 = 0. Linear transformations never shift or translate the origin.',
        hint: 'Think about multiplying matrix A by a vector of all zeros.',
      },
      {
        id: 'la-q4',
        prompt: 'Which matrix operation is required to rotate coordinates while strictly preserving vector lengths and angles?',
        options: [
          'Orthogonal matrix multiplication (Q^T Q = I)',
          'Upper triangular row reduction',
          'Singular value thresholding',
          'Diagonal matrix scalar expansion',
        ],
        correctAnswer: 'Orthogonal matrix multiplication (Q^T Q = I)',
        explanation:
          'An orthogonal matrix satisfies Q^T Q = I, which guarantees isometric transformations that preserve inner products, vector lengths, and mutual angles.',
        hint: 'Its transpose is equal to its inverse.',
      },
    ],
  },

  // 2. Gradient Descent & Backpropagation
  'c0000000-0000-0000-0000-000000000002': {
    id: 'c0000000-0000-0000-0000-000000000002',
    slug: 'gradient-descent-backprop',
    title: 'Gradient Descent & Backpropagation',
    subject: 'Machine Learning',
    subjectId: 'a0000000-0000-0000-0000-000000000001',
    difficulty: 'beginner',
    estimatedMinutes: 7,
    overview:
      'Gradient Descent is the workhorse optimization algorithm of deep learning. Coupled with the Chain Rule of calculus (Backpropagation), it enables neural networks to iteratively update millions of weights to minimize training loss.',
    sections: [
      {
        title: '1. The Optimization Objective',
        content:
          'A neural network calculates predictions ŷ = f(x; θ). The scalar loss function L(y, ŷ) quantifies how wrong the predictions are. Gradient descent computes the partial derivative of the loss with respect to every parameter vector θ, pointing in the direction of steepest increase.',
        formula: 'θ_{t+1} = θ_t - η * ∇_θ L(θ_t)',
      },
      {
        title: '2. The Chain Rule & Computational Graphs',
        content:
          'Because deep networks compose multiple layers (e.g., L(f_3(f_2(f_1(x))))), Backpropagation applies the multivariate chain rule backwards from the loss node to early weight tensors, reusing intermediate partial derivatives (Jacobians) efficiently.',
        formula: '∂L/∂w_1 = (∂L/∂y) * (∂y/∂a_2) * (∂a_2/∂z_1) * (∂z_1/∂w_1)',
      },
      {
        title: '3. Learning Rate and Convergence Dynamics',
        content:
          'The learning rate η governs the step size along the negative gradient. If η is too small, convergence is prohibitively slow or gets trapped in shallow local minima. If η is excessively large, parameter updates overshoot the valley and diverge uncontrollably.',
      },
    ],
    keyTakeaways: [
      'Gradients indicate the direction of steepest ascent; parameters update in the opposite (negative) direction.',
      'Backpropagation applies the multivariate chain rule across the computational graph in reverse topological order.',
      'An optimal learning rate η is critical: too low stalls convergence, while too high causes mathematical divergence.',
    ],
    questions: [
      {
        id: 'gd-q1',
        prompt: 'In stochastic gradient descent, why do parameter updates subtract the gradient vector (θ - η * ∇L)?',
        options: [
          'Because the gradient points in the direction of steepest ascent, so subtracting moves downhill toward the minimum',
          'Because subtracting regularizes weight magnitudes to prevent numerical overflow',
          'Because neural networks require inverse Hessian transformations',
          'Because backpropagation requires positive loss eigenvalues',
        ],
        correctAnswer:
          'Because the gradient points in the direction of steepest ascent, so subtracting moves downhill toward the minimum',
        explanation:
          'The gradient ∇L points toward the greatest rate of loss increase. To minimize loss, the optimizer takes a step in the exact opposite (negative) direction.',
        hint: 'Think of walking down a foggy hill by following the steepest slope downward.',
      },
      {
        id: 'gd-q2',
        prompt: 'What fundamental mathematical theorem makes Backpropagation computationally efficient?',
        options: [
          'The Chain Rule of differential calculus',
          'Bayes Theorem of conditional probability',
          'The Central Limit Theorem of distributions',
          'Euler characteristic formula',
        ],
        correctAnswer: 'The Chain Rule of differential calculus',
        explanation:
          'The Chain Rule allows decomposing the derivative of composite functions ∂L/∂w = (∂L/∂a)(∂a/∂w), caching intermediate activations so each layer only performs local gradient multiplications.',
        hint: 'It allows differentiating nested functions f(g(x)).',
      },
      {
        id: 'gd-q3',
        prompt: 'What happens when the learning rate η is set excessively high during deep learning training?',
        options: [
          'The optimization trajectory oscillates wildly, overshoots minima, and can diverge to NaN/infinity',
          'The model parameters immediately freeze into a local saddle point',
          'The training loss drops monotonically in a single epoch',
          'Backpropagation gradients vanish to zero',
        ],
        correctAnswer:
          'The optimization trajectory oscillates wildly, overshoots minima, and can diverge to NaN/infinity',
        explanation:
          'A step size larger than the local curvature radius overshoots the minimum into steeper uphill terrain, compounding loss until floating point overflow occurs.',
        hint: 'Consider taking huge leaps across a steep V-shaped valley.',
      },
      {
        id: 'gd-q4',
        prompt: 'Why are activations cached during the forward pass of a neural network?',
        options: [
          'To compute intermediate partial derivatives during the backward backpropagation pass',
          'To save RAM during model inference',
          'To calculate categorical entropy for the validation set',
          'To avoid executing matrix multiplications during test time',
        ],
        correctAnswer:
          'To compute intermediate partial derivatives during the backward backpropagation pass',
        explanation:
          'Many activation derivatives (such as sigmoid ∂σ/∂z = σ(1-σ) or ReLU) depend directly on the forward activation value z, so caching them avoids costly recomputations.',
        hint: 'The backward pass requires values computed during the forward pass.',
      },
    ],
  },

  // 3. Scaled Dot-Product Attention
  'c0000000-0000-0000-0000-000000000003': {
    id: 'c0000000-0000-0000-0000-000000000003',
    slug: 'scaled-dot-product-attention',
    title: 'Scaled Dot-Product Attention',
    subject: 'Machine Learning',
    subjectId: 'a0000000-0000-0000-0000-000000000001',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    overview:
      'Introduced in "Attention Is All You Need" (Vaswani et al., 2017), Scaled Dot-Product Attention is the core routing engine of Transformers, replacing recurrence with parallel relational scoring.',
    sections: [
      {
        title: '1. Queries, Keys, and Values (Q, K, V)',
        content:
          'Every input token embedding is linearly projected into three distinct vectors: a Query (Q) representing what this token is searching for, a Key (K) representing what this token advertises, and a Value (V) representing the actual semantic content to extract.',
      },
      {
        title: '2. The Mathematical Formulation',
        content:
          'Attention scores are computed by taking the dot product QK^T between all queries and keys. These raw logits are scaled by 1/sqrt(d_k) and passed through a softmax function to produce a valid probability distribution summing to 1 across tokens. The final output is the weighted sum of Value vectors.',
        formula: 'Attention(Q, K, V) = softmax((Q K^T) / √d_k) * V',
      },
      {
        title: '3. Why Scale by 1/√d_k?',
        content:
          'Assume components of Q and K are independent random variables with mean 0 and variance 1. Their dot product has mean 0 and variance d_k. For large projection dimensions (e.g., d_k = 64 or 128), large dot product magnitudes push the softmax function into regions with near-zero gradients. Dividing by √d_k normalizes the variance back to 1, preserving healthy gradients.',
      },
    ],
    keyTakeaways: [
      'Queries (Q) ask questions, Keys (K) identify matches, and Values (V) provide the extracted information.',
      'Attention(Q, K, V) computes a normalized dynamic weighted sum of Value vectors based on Query-Key compatibility.',
      'Scaling by 1/√d_k is critical: it prevents softmax saturation and vanishing backpropagation gradients.',
    ],
    questions: [
      {
        id: 'sdpa-q1',
        prompt: 'Why is the dot-product inner matrix QK^T scaled by 1/sqrt(d_k) in Transformer self-attention?',
        options: [
          'To prevent dot products from pushing softmax into vanishingly small gradient regions',
          'To reduce computational complexity from quadratic to linear time',
          'To normalize the positional encodings across variable sequence lengths',
          'To enforce strict orthogonality between Query and Value projections',
        ],
        correctAnswer:
          'To prevent dot products from pushing softmax into vanishingly small gradient regions',
        explanation:
          'When projection dimension d_k is large, dot product variance equals d_k. Large values drive softmax inputs to extreme saturation where its gradient is virtually zero. Dividing by √d_k stabilizes the variance to 1.',
        hint: 'Consider what happens to the slope of softmax when inputs become extremely large.',
      },
      {
        id: 'sdpa-q2',
        prompt: 'In the equation Attention(Q, K, V) = softmax(QK^T / √d_k) V, what does the softmax matrix represent?',
        options: [
          'A normalized attention weight distribution indicating how much each token attends to every other token',
          'A permutation matrix that reorders the tokens alphabetically',
          'The discrete positional embedding offset matrix',
          'The learned bias weights for feed-forward layers',
        ],
        correctAnswer:
          'A normalized attention weight distribution indicating how much each token attends to every other token',
        explanation:
          'Each row of the softmax matrix is a probability distribution summing to 1.0, representing the attention coefficients assigned by that row token to all tokens in the sequence.',
        hint: 'Softmax converts raw logits into probabilities that sum to 1.',
      },
      {
        id: 'sdpa-q3',
        prompt: 'If sequence length is N and projection dimension is d_k, what is the dimension of the matrix Q K^T before multiplying with V?',
        options: [
          'N × N',
          'N × d_k',
          'd_k × d_k',
          '1 × N',
        ],
        correctAnswer: 'N × N',
        explanation:
          'Multiplying Q (shape N × d_k) by K^T (shape d_k × N) produces an N × N pairwise attention affinity matrix.',
        hint: 'Every token compares itself against every other token in the sequence.',
      },
      {
        id: 'sdpa-q4',
        prompt: 'What role do Value (V) vectors play in the attention computation?',
        options: [
          'They contain the contextual content that is aggregated according to the computed attention weights',
          'They store the sinusoidal frequency multipliers for positional encoding',
          'They act as the learning rate decay schedule',
          'They filter out Stop words through static thresholding',
        ],
        correctAnswer:
          'They contain the contextual content that is aggregated according to the computed attention weights',
        explanation:
          'Once attention weights are established via Q and K, they act as blending coefficients to compute a weighted sum over the Value vectors V.',
        hint: 'Values are what get blended together in the final output.',
      },
    ],
  },

  // 4. Multi-Head Attention
  'c0000000-0000-0000-0000-000000000004': {
    id: 'c0000000-0000-0000-0000-000000000004',
    slug: 'multi-head-attention',
    title: 'Multi-Head Attention',
    subject: 'Machine Learning',
    subjectId: 'a0000000-0000-0000-0000-000000000001',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    overview:
      'Single attention often averages information across diverse linguistic and semantic relationships. Multi-Head Attention projects Q, K, and V into multiple independent representation subspaces simultaneously.',
    sections: [
      {
        title: '1. Why Multiple Heads?',
        content:
          'In natural language and code, a single word carries multiple relationships: syntactic subject-verb agreement, semantic co-reference, and distant contextual dependencies. A single attention head would average these distinct relationships into a blurry distribution. Multi-Head Attention allows different heads to specialize in different linguistic phenomena.',
      },
      {
        title: '2. Architecture and Computation',
        content:
          'Given h heads and model dimension d_model, each head projects inputs into dimension d_k = d_v = d_model / h. Each head computes independent scaled dot-product attention in parallel. The head outputs are concatenated and multiplied by a final projection matrix W^O.',
        formula: 'MultiHead(Q,K,V) = Concat(head_1, ..., head_h) * W^O',
      },
      {
        title: '3. Computational Efficiency',
        content:
          'Due to the reduced dimension of each head (d_k = d_model / h), the total computational cost of multi-head attention is identical to single-head attention with full dimensionality, while offering vastly superior expressive capacity.',
      },
    ],
    keyTakeaways: [
      'Multi-Head Attention allows the model to jointly attend to information from different representation subspaces.',
      'Head dimension is scaled to d_model / h so total computational cost remains comparable to single-head attention.',
      'Outputs from all h heads are concatenated and projected through an output parameter matrix W^O.',
    ],
    questions: [
      {
        id: 'mha-q1',
        prompt: 'Why is Multi-Head Attention superior to a single attention head of the same total dimension?',
        options: [
          'It enables the model to simultaneously focus on different positions and semantic relationships in parallel subspaces',
          'It eliminates the need for feed-forward neural networks in the Transformer block',
          'It replaces matrix multiplications with cheaper element-wise operations',
          'It enforces causal masking without requiring triangle matrices',
        ],
        correctAnswer:
          'It enables the model to simultaneously focus on different positions and semantic relationships in parallel subspaces',
        explanation:
          'Different heads learn specialized functions (e.g. one head tracks grammatical syntax, another tracks pronoun antecedents, another attends to immediate neighbors).',
        hint: 'Think about multiple specialists analyzing a text from different perspectives.',
      },
      {
        id: 'mha-q2',
        prompt: 'In a Transformer with d_model = 512 and h = 8 attention heads, what is the dimension d_k of each individual head?',
        options: ['64', '128', '256', '512'],
        correctAnswer: '64',
        explanation:
          'The dimension per head is d_k = d_model / h = 512 / 8 = 64.',
        hint: 'Divide total model dimension by number of heads.',
      },
      {
        id: 'mha-q3',
        prompt: 'What operation joins the individual outputs of all attention heads before multiplying by matrix W^O?',
        options: [
          'Concatenation along the feature dimension',
          'Element-wise addition across heads',
          'Singular value decomposition pooling',
          'Random dropout sampling',
        ],
        correctAnswer: 'Concatenation along the feature dimension',
        explanation:
          'The outputs head_1 through head_h (each shape N × d_v) are concatenated along the final dimension to reform shape N × d_model before being multiplied by W^O.',
        hint: 'The heads are glued together side-by-side.',
      },
      {
        id: 'mha-q4',
        prompt: 'What is the role of the final projection matrix W^O in Multi-Head Attention?',
        options: [
          'To linearly mix and integrate the concatenated representations from all independent attention heads',
          'To normalize the output vector magnitudes to unit length',
          'To predict the final vocabulary logits directly',
          'To apply non-linear ReLU activation before residual connection',
        ],
        correctAnswer:
          'To linearly mix and integrate the concatenated representations from all independent attention heads',
        explanation:
          'W^O combines the diverse subspace signals extracted by the individual heads into a unified contextualized token representation.',
        hint: 'It synthesizes the concatenated head signals back into d_model space.',
      },
    ],
  },

  // 5. Transformer Architecture & Self-Attention
  'c0000000-0000-0000-0000-000000000005': {
    id: 'c0000000-0000-0000-0000-000000000005',
    slug: 'transformer-architecture',
    title: 'Transformer Architecture & Self-Attention',
    subject: 'Machine Learning',
    subjectId: 'a0000000-0000-0000-0000-000000000001',
    difficulty: 'advanced',
    estimatedMinutes: 9,
    overview:
      'The complete Transformer model combines Multi-Head Attention with Feed-Forward networks, Residual Connections, Layer Normalization, and Positional Encodings to create the modern foundation of LLMs.',
    sections: [
      {
        title: '1. Encoder vs. Decoder Blocks',
        content:
          'The Transformer consists of stacked identical layers. Encoder layers use bidirectional self-attention so every token can attend to all past and future tokens. Autoregressive Decoder layers use Causal Masking (setting upper-triangle attention logits to -∞) so tokens can only attend to prior positions during text generation.',
      },
      {
        title: '2. Residual Connections & LayerNorm',
        content:
          'To stabilize deep backpropagation across dozens of layers, each sub-layer employs a residual connection x + Sublayer(x) followed by Layer Normalization. LayerNorm normalizes across the feature dimension independently for each token.',
        formula: 'Output = LayerNorm(x + SubLayer(x))',
      },
      {
        title: '3. Position-Wise Feed-Forward Networks (FFN)',
        content:
          'Following attention, each token passes through a two-layer MLP with an activation function (e.g. GELU or SwiGLU). The inner dimension is typically expanded to 4 × d_model, providing the network with non-linear memory capacity to store factual associations.',
        formula: 'FFN(x) = max(0, x W_1 + b_1) W_2 + b_2',
      },
    ],
    keyTakeaways: [
      'Causal masking in decoder blocks sets future attention logits to -∞ to prevent cheating during autoregressive generation.',
      'Residual skip connections (x + Sublayer(x)) allow gradients to propagate directly through hundreds of layers.',
      'The position-wise FFN expands to 4 × d_model to inject non-linear factual memory into each token representation.',
    ],
    questions: [
      {
        id: 'trans-q1',
        prompt: 'In autoregressive Transformer decoders (like GPT), why is Causal Masking applied to attention logits before softmax?',
        options: [
          'To prevent positions from attending to future tokens during training and generation',
          'To compress the model weights into 8-bit quantized precision',
          'To remove padding tokens from the vocabulary embedding table',
          'To invert the attention matrix for faster gradient descent',
        ],
        correctAnswer:
          'To prevent positions from attending to future tokens during training and generation',
        explanation:
          'Autoregressive language models predict token t using only tokens 1 to t-1. Causal masking replaces future positions with -∞ so softmax assigns them 0 probability.',
        hint: 'The model should not peek at upcoming words.',
      },
      {
        id: 'trans-q2',
        prompt: 'Why are residual skip connections (x + Sublayer(x)) essential throughout the Transformer stack?',
        options: [
          'They provide an unobstructed gradient highway that prevents vanishing gradients in deep networks',
          'They eliminate the need for matrix multiplication in the feed-forward blocks',
          'They reduce the total sequence length by half at each layer',
          'They enforce strict unit variance on all attention matrices',
        ],
        correctAnswer:
          'They provide an unobstructed gradient highway that prevents vanishing gradients in deep networks',
        explanation:
          'The identity shortcut ∂(x + F(x))/∂x = 1 + F\'(x) ensures that gradient signals can pass directly backwards through dozens of layers without exponentially vanishing.',
        hint: 'Think about gradient flow through deep layer stacks.',
      },
      {
        id: 'trans-q3',
        prompt: 'Why do Transformers require Positional Encodings added to input token embeddings?',
        options: [
          'Because self-attention is permutation-invariant and has no inherent sense of word order',
          'Because token embeddings have zero mean without positional offsets',
          'To compress vocabulary size into discrete integer buckets',
          'To convert categorical tokens into floating point vectors',
        ],
        correctAnswer:
          'Because self-attention is permutation-invariant and has no inherent sense of word order',
        explanation:
          'Without positional encodings, "dog bites man" and "man bites dog" would produce identical self-attention outputs because set operations are invariant to word order.',
        hint: 'Without it, shuffling the sentence words produces the same representation.',
      },
      {
        id: 'trans-q4',
        prompt: 'What is the standard expansion ratio for the inner hidden dimension of the Transformer Feed-Forward Network (FFN)?',
        options: ['4 × d_model', '1 × d_model', '16 × d_model', '0.5 × d_model'],
        correctAnswer: '4 × d_model',
        explanation:
          'In the standard Transformer architecture (Vaswani et al.), d_model = 512 and d_ff = 2048, which is exactly a 4x expansion.',
        hint: 'If d_model is 512, d_ff is 2048.',
      },
    ],
  },

  // 6. Bayesian Probability & Posterior Updates
  'c0000000-0000-0000-0000-000000000006': {
    id: 'c0000000-0000-0000-0000-000000000006',
    slug: 'bayesian-probability-posterior',
    title: 'Bayesian Probability & Posterior Updates',
    subject: 'Mathematics & Stats',
    subjectId: 'a0000000-0000-0000-0000-000000000003',
    difficulty: 'beginner',
    estimatedMinutes: 6,
    overview:
      'Bayesian probability frames uncertainty as a degree of belief rather than long-run frequency. Bayes theorem mathematically prescribes how an agent should update prior beliefs upon observing new empirical evidence.',
    sections: [
      {
        title: '1. Bayes Theorem Formulation',
        content:
          'Bayes theorem relates the conditional and marginal probabilities of stochastic events. P(θ) represents prior knowledge about parameter θ. P(D|θ) is the likelihood of observing data D given θ. P(D) is the marginal evidence normalizing the distribution. P(θ|D) is the updated posterior belief.',
        formula: 'P(θ | D) = (P(D | θ) * P(θ)) / P(D)',
      },
      {
        title: '2. Prior, Likelihood, and Posterior',
        content:
          'Prior: Your initial degree of belief before observing any data.\nLikelihood: The probability that the observed data was generated by parameter θ.\nPosterior: The updated probability after combining prior assumptions with observed empirical evidence.',
      },
      {
        title: '3. Sequential Bayesian Updating',
        content:
          'A defining strength of Bayesian inference is sequential updating: today’s posterior becomes tomorrow’s prior. As more evidence arrives, the influence of the initial prior diminishes, converging toward the true underlying parameter.',
      },
    ],
    keyTakeaways: [
      'Bayes theorem provides the mathematically optimal framework for belief updating under uncertainty.',
      'Posterior probability is proportional to Likelihood multiplied by Prior: Posterior ∝ Likelihood × Prior.',
      'Sequential updating allows continuous calibration: yesterday\'s posterior serves as today\'s prior.',
    ],
    questions: [
      {
        id: 'bayes-q1',
        prompt: 'In Bayes theorem P(θ|D) = [P(D|θ) * P(θ)] / P(D), what does P(θ) represent?',
        options: [
          'The Prior probability representing initial belief before seeing data D',
          'The Likelihood of the parameter given evidence',
          'The Posterior probability after observing data D',
          'The marginal likelihood of all possible hypotheses',
        ],
        correctAnswer: 'The Prior probability representing initial belief before seeing data D',
        explanation:
          'P(θ) is the prior distribution, quantifying belief about parameter θ prior to the arrival of new evidence D.',
        hint: 'It represents what you believed prior to the experiment.',
      },
      {
        id: 'bayes-q2',
        prompt: 'What mathematical principle enables continuous learning in Bayesian systems?',
        options: [
          'Today\'s posterior probability distribution becomes tomorrow\'s prior when new evidence is observed',
          'Eliminating all prior assumptions and relying strictly on sample frequency',
          'Inverting the covariance matrix at every time step',
          'Clamping all probabilities between 0.5 and 1.0',
        ],
        correctAnswer:
          'Today\'s posterior probability distribution becomes tomorrow\'s prior when new evidence is observed',
        explanation:
          'Sequential Bayesian updating treats the current posterior distribution as the prior for subsequent observations, dynamically refining knowledge as data arrives.',
        hint: 'Yesterday\'s updated belief is the starting point for today\'s evidence.',
      },
      {
        id: 'bayes-q3',
        prompt: 'If the likelihood of an outcome under hypothesis A is zero (P(D|A) = 0), what is the resulting posterior P(A|D)?',
        options: ['Exactly 0', 'Equal to the prior P(A)', '0.5', 'Undefined'],
        correctAnswer: 'Exactly 0',
        explanation:
          'Because posterior is proportional to likelihood times prior, if P(D|A) = 0, then P(A|D) = (0 * P(A)) / P(D) = 0.',
        hint: 'Multiply anything by zero.',
      },
      {
        id: 'bayes-q4',
        prompt: 'What is the role of the marginal likelihood evidence term P(D) in the denominator of Bayes Theorem?',
        options: [
          'It acts as a normalizing constant ensuring that all posterior probabilities sum to 1.0',
          'It penalizes model complexity via L2 regularization',
          'It computes the gradient descent step size',
          'It estimates the standard error of the mean',
        ],
        correctAnswer:
          'It acts as a normalizing constant ensuring that all posterior probabilities sum to 1.0',
        explanation:
          'P(D) integrates the numerator across all possible parameter values, ensuring the posterior integrates to exactly 1.0 as a valid probability measure.',
        hint: 'It ensures the total probability is exactly 100%.',
      },
    ],
  },

  // 7. Bayesian Knowledge Tracing (BKT)
  'c0000000-0000-0000-0000-000000000007': {
    id: 'c0000000-0000-0000-0000-000000000007',
    slug: 'bayesian-knowledge-tracing',
    title: 'Bayesian Knowledge Tracing (BKT)',
    subject: 'Cognitive Science',
    subjectId: 'a0000000-0000-0000-0000-000000000005',
    difficulty: 'intermediate',
    estimatedMinutes: 7,
    overview:
      'Bayesian Knowledge Tracing (Corbett & Anderson, 1994) is the gold standard psychometric algorithm in cognitive science. It models a student’s latent mastery of a specific skill over time as a Hidden Markov Model.',
    sections: [
      {
        title: '1. The Four Fundamental BKT Parameters',
        content:
          '• P(L_0): Prior probability that the learner already possesses mastery before practice.\n• P(T): Transition probability that a student transitions from non-mastery to mastery during an opportunity.\n• P(G): Guess parameter—probability a student gets a question right despite NOT knowing the skill.\n• P(S): Slip parameter—probability a student makes a mistake despite having mastered the skill.',
      },
      {
        title: '2. Observation Posterior Update',
        content:
          'When a student answers correctly or incorrectly, BKT applies Bayes rule to compute the posterior probability that the student was in the learned state L at step t.',
        formula: 'P(L_t | Correct) = (P(L_{t-1}) * (1 - P(S))) / (P(L_{t-1}) * (1 - P(S)) + (1 - P(L_{t-1})) * P(G))',
      },
      {
        title: '3. Skill Transition to Next Step',
        content:
          'After factoring in the observation, BKT updates for the opportunity to learn before the next question:',
        formula: 'P(L_{t+1}) = P(L_t | Obs) + (1 - P(L_t | Obs)) * P(T)',
      },
    ],
    keyTakeaways: [
      'BKT models mastery as a latent binary state governed by 4 psychometric parameters: L_0, T, G, and S.',
      'Guess P(G) handles lucky guesses on assessments; Slip P(S) handles accidental mistakes by proficient students.',
      'A concept is deemed mastered when the latent probability P(L) crosses an empirical threshold (typically ≥ 0.95 or 0.85).',
    ],
    questions: [
      {
        id: 'bkt-q1',
        prompt: 'In standard Bayesian Knowledge Tracing (BKT), which parameter denotes the probability of answering correctly without having mastered the latent skill?',
        options: [
          'Guess parameter P(G)',
          'Slip parameter P(S)',
          'Transit parameter P(T)',
          'Prior parameter P(L0)',
        ],
        correctAnswer: 'Guess parameter P(G)',
        explanation:
          'P(G) represents the probability that a student answers correctly by guessing without possessing latent mastery.',
        hint: 'This accounts for lucky guessing on multiple-choice assessments.',
      },
      {
        id: 'bkt-q2',
        prompt: 'What does the Slip parameter P(S) account for in student modeling?',
        options: [
          'A student who has mastered the concept but makes an accidental error or typo',
          'The student forgetting the concept over time',
          'The question being too difficult for beginner learners',
          'The transition probability between consecutive days',
        ],
        correctAnswer:
          'A student who has mastered the concept but makes an accidental error or typo',
        explanation:
          'P(S) accounts for slips: instances where the student truly knows the underlying material but slips due to distraction or misreading.',
        hint: 'Even experts occasionally slip and make careless mistakes.',
      },
      {
        id: 'bkt-q3',
        prompt: 'What happens to the posterior probability P(L_t) when a student answers an item incorrectly?',
        options: [
          'P(L_t) decreases according to Bayes rule, but remains non-zero due to the Slip parameter P(S)',
          'P(L_t) instantly drops to exactly 0',
          'P(L_t) increases because struggling proves active engagement',
          'P(L_t) remains unchanged until 3 consecutive errors occur',
        ],
        correctAnswer:
          'P(L_t) decreases according to Bayes rule, but remains non-zero due to the Slip parameter P(S)',
        explanation:
          'Because P(S) > 0, an error reduces belief in mastery, but does not definitively prove non-mastery because the mistake could have been a slip.',
        hint: 'A single wrong answer lowers the probability, but doesn\'t wipe out past evidence.',
      },
      {
        id: 'bkt-q4',
        prompt: 'Under standard cognitive tutor heuristics, at what posterior probability P(L) is a skill typically considered "Mastered"?',
        options: ['P(L) ≥ 0.95', 'P(L) ≥ 0.50', 'P(L) ≥ 0.25', 'P(L) = 1.00 strictly'],
        correctAnswer: 'P(L) ≥ 0.95',
        explanation:
          'In Corbett & Anderson\'s canonical Cognitive Tutors, the skill mastery threshold is conventionally set at 0.95.',
        hint: 'It requires high statistical confidence (typically 95%).',
      },
    ],
  },

  // 8. SuperMemo SM-2 Spaced Repetition
  'c0000000-0000-0000-0000-000000000008': {
    id: 'c0000000-0000-0000-0000-000000000008',
    slug: 'sm-2-spaced-repetition',
    title: 'SuperMemo SM-2 Spaced Repetition',
    subject: 'Cognitive Science',
    subjectId: 'a0000000-0000-0000-0000-000000000005',
    difficulty: 'intermediate',
    estimatedMinutes: 7,
    overview:
      'Developed by Piotr Wozniak in 1987, the SuperMemo SM-2 algorithm models the biological Ebbinghaus forgetting curve. It schedules reviews at expanding intervals to maximize memory consolidation with minimal study time.',
    sections: [
      {
        title: '1. The Spacing Effect & Retrieval Practice',
        content:
          'Human memory decays exponentially unless reinforced. The Spacing Effect proves that reviewing material right when it is on the verge of being forgotten produces the strongest synaptic consolidation and longest-lasting retention.',
      },
      {
        title: '2. The Interval Scheduling Algorithm',
        content:
          '• Review 1: Interval I(1) = 1 day\n• Review 2: Interval I(2) = 6 days\n• Review n (n > 2): Interval I(n) = I(n-1) × EF\nWhere EF is the item\'s Easiness Factor (initialized to 2.5).',
        formula: 'I(n) = I(n-1) * EF',
      },
      {
        title: '3. Easiness Factor Adjustment & Minimum Clamp',
        content:
          'After each review, the learner rates recall quality q on a scale of 0 to 5. EF is updated dynamically. If EF falls, reviews happen more frequently. Crucially, EF is clamped at a minimum of 1.3 to prevent infinite stagnation.',
        formula: 'EF\' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))  [EF >= 1.3]',
      },
    ],
    keyTakeaways: [
      'SM-2 schedules reviews at expanding intervals (1 day, 6 days, then I * EF) right before memory decays.',
      'The Easiness Factor (EF) starts at 2.5 and dynamically adjusts based on recall quality ratings (0 to 5).',
      'EF is clamped to a minimum lower bound of 1.3 so intervals never completely collapse into stagnation.',
    ],
    questions: [
      {
        id: 'sm2-q1',
        prompt: 'What is the minimum lower bound enforced on the Easiness Factor (EF) in the SM-2 algorithm?',
        options: ['1.3', '1.0', '2.5', '0.5'],
        correctAnswer: '1.3',
        explanation:
          'In SM-2, EF is bounded from below at 1.3 to prevent intervals from permanently collapsing into infinite stagnation for difficult items.',
        hint: 'The formula clamps the multiplier so it never drops below this value greater than 1.0.',
      },
      {
        id: 'sm2-q2',
        prompt: 'In the standard SM-2 interval sequence, what are the scheduled intervals for the 1st and 2nd successful reviews?',
        options: [
          '1 day, then 6 days',
          '1 day, then 2 days',
          '3 days, then 7 days',
          '2 days, then 4 days',
        ],
        correctAnswer: '1 day, then 6 days',
        explanation:
          'In Piotr Wozniak\'s canonical SM-2 algorithm, I(1) = 1 day, and I(2) = 6 days. Subsequent intervals multiply by EF.',
        hint: 'The second review is roughly one week later.',
      },
      {
        id: 'sm2-q3',
        prompt: 'What happens in SM-2 when a user rates their recall quality as q < 3 (failure to recall)?',
        options: [
          'The repetition count resets to 1 and the interval collapses back to 1 day for urgent relearning',
          'The item is permanently archived and never reviewed again',
          'The interval expands by 2.5x to reduce cognitive load',
          'The Easiness Factor resets to zero',
        ],
        correctAnswer:
          'The repetition count resets to 1 and the interval collapses back to 1 day for urgent relearning',
        explanation:
          'A grade lower than 3 indicates failed recall. The algorithm resets repetitions to 1 and schedules review for the following day to prevent memory extinction.',
        hint: 'If you forgot the item, you need to relearn it tomorrow.',
      },
      {
        id: 'sm2-q4',
        prompt: 'What cognitive phenomenon does the SM-2 algorithm optimize for?',
        options: [
          'The Spacing Effect and Ebbinghaus memory consolidation',
          'Cognitive dissonance reduction',
          'Working memory bandwidth expansion',
          'Perceptual priming suppression',
        ],
        correctAnswer: 'The Spacing Effect and Ebbinghaus memory consolidation',
        explanation:
          'SM-2 directly operationalizes the spacing effect, scheduling retrieval practice right before the Ebbinghaus forgetting curve drops below the retrieval threshold.',
        hint: 'Think about spacing reviews over time rather than cramming.',
      },
    ],
  },
};

/**
 * Helper to fetch a course by its UUID id or slug string.
 */
export function getCourseData(idOrSlug: string): CourseData | undefined {
  if (COURSE_CURRICULUM[idOrSlug]) {
    return COURSE_CURRICULUM[idOrSlug];
  }
  return Object.values(COURSE_CURRICULUM).find(
    (c) => c.slug === idOrSlug || c.id === idOrSlug
  );
}

