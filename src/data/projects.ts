export interface Project {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: "AI & Autonomous Systems" | "Creative Engineering" | "Full-Stack & Mobile" | "Data & Systems";
  description: string;
  technicalDetails: string[];
  technologies: string[];
  metrics?: { label: string; value: string };
  links: {
    github: string;
    live?: string;
  };
  featured: boolean;
  accent: string;
}

export const projectsData: Project[] = [
  {
    id: "klyptic",
    number: "01",
    title: "Klyptic",
    tagline: "Browser-Native Non-Linear Video Editor",
    category: "Creative Engineering",
    description: "A production-grade client-side video editing suite running entirely inside modern web browsers. Architected using HTML5 Canvas 2D render loops and the Web Audio API, featuring multi-track sequencing, sub-frame keyframe interpolation, custom procedural shader passes, and local speech-to-text integration with word-by-word dynamic typography.",
    technicalDetails: [
      "Custom 60fps frame compositor built on HTML5 Canvas 2D and requestAnimationFrame loops",
      "Multi-track non-destructive timeline supporting synchronous video, audio waveforms, and typography layers",
      "In-browser AI auto-caption generator with per-word timestamp alignment and viral animation presets",
      "Zero-server audio processing via Web Audio API context and offline audio graph rendering"
    ],
    technologies: ["React 18", "TypeScript", "Canvas 2D", "Web Audio API", "Tailwind CSS", "Zustand"],
    metrics: { label: "Frame Rate", value: "60 FPS native" },
    links: {
      github: "https://github.com/HunainxAhmed/Klyptic",
      live: "https://github.com/HunainxAhmed/Klyptic"
    },
    featured: true,
    accent: "from-zinc-400 to-zinc-600"
  },
  {
    id: "trade-bot-gemini",
    number: "02",
    title: "Trade Bot Gemini",
    tagline: "Autonomous Multi-Modal LLM Trading Agent",
    category: "AI & Autonomous Systems",
    description: "An autonomous quantitative analysis and algorithmic execution engine leveraging Google Gemini multi-modal models. The system consumes real-time price feeds, order-book depth, and live macroeconomic sentiment to generate structured risk-weighted trade hypotheses and autonomously adapt positioning during regime shifts.",
    technicalDetails: [
      "Multi-agent autonomous decision loop executing real-time hypothesis generation and risk auditing",
      "Structured output enforcement with schema-validated rationale generation before trade dispatch",
      "Dynamic volatility calibration adapting position sizing based on rolling drawdown parameters",
      "High-throughput asynchronous data pipelines processing financial feeds and technical indicators"
    ],
    technologies: ["Python", "Google Gemini API", "NumPy", "Pandas", "Autonomous Agents", "AsyncIO"],
    metrics: { label: "Latency", value: "< 800ms decision loop" },
    links: {
      github: "https://github.com/HunainxAhmed",
      live: "https://github.com/HunainxAhmed"
    },
    featured: true,
    accent: "from-amber-400/80 to-zinc-500"
  },
  {
    id: "pakistan-super-app",
    number: "03",
    title: "Pakistan Super App",
    tagline: "Mobility & Roadside Logistics Monorepo",
    category: "Full-Stack & Mobile",
    description: "A comprehensive cross-platform mobility ecosystem integrating real-time peer-to-peer ride bidding, emergency roadside breakdown assistance, tow-truck fleet routing, and mobile mechanic dispatch with live spatial coordinates and resilient connection recovery.",
    technicalDetails: [
      "Monorepo architecture harmonizing driver, passenger, and service-partner mobile clients",
      "Sub-second WebSocket state distribution with automatic fallback and geospatial geohash indexing",
      "Reverse-auction bidding mechanism allowing drivers and passengers to negotiate ride fairs in real-time",
      "Resilient background location sync with battery-optimized GPS ping throttling"
    ],
    technologies: ["TypeScript", "React Native", "Node.js", "WebSockets", "Mapbox", "Redis"],
    metrics: { label: "Architecture", value: "Monorepo / Multi-Client" },
    links: {
      github: "https://github.com/HunainxAhmed/Pakistan-Super-App",
      live: "https://github.com/HunainxAhmed/Pakistan-Super-App"
    },
    featured: true,
    accent: "from-emerald-400/80 to-zinc-500"
  },
  {
    id: "movie-recommender-ai",
    number: "04",
    title: "Movie Recommender AI",
    tagline: "Hybrid Collaborative & Content-Based ML Engine",
    category: "AI & Autonomous Systems",
    description: "A personalized recommendation engine blending NLP metadata embeddings with sparse matrix factorization. Overcomes traditional cold-start limitations by dynamically weighing cosine similarity across plot synopses against collaborative rating vectors.",
    technicalDetails: [
      "High-dimensional vector space modeling over genre, crew, cast, and keyword representations",
      "TF-IDF and cosine similarity optimization with truncated SVD for dimensionality reduction",
      "Sub-10 millisecond retrieval latency across large candidate sets",
      "Interactive evaluation benchmark comparing prediction accuracy across diverse user profiles"
    ],
    technologies: ["Python", "Scikit-Learn", "Pandas", "NLP", "Vector Modeling"],
    metrics: { label: "Retrieval", value: "< 10ms inference" },
    links: {
      github: "https://github.com/HunainxAhmed/movie-recommender-ai",
      live: "https://github.com/HunainxAhmed/movie-recommender-ai"
    },
    featured: false,
    accent: "from-zinc-300 to-zinc-500"
  },
  {
    id: "neural-search",
    number: "05",
    title: "Neural Search Platform",
    tagline: "Vector Embeddings & Semantic Document Intelligence",
    category: "Data & Systems",
    description: "Contextual search and retrieval platform engineered for high-accuracy document exploration. Combines dense semantic vector search with exact lexical ranking (BM25 hybrid) and re-ranking models for zero-hallucination factual query resolution.",
    technicalDetails: [
      "Hybrid dense-sparse retrieval pipeline with configurable reciprocal rank fusion (RRF)",
      "High-performance FastAPI microservice interfacing with pgvector and PostgreSQL indexing",
      "Containerized deployment with Docker and automated embedding ingestion pipelines",
      "Token-aware semantic chunking strategy preserving contextual boundaries across long documents"
    ],
    technologies: ["Python", "FastAPI", "PostgreSQL", "pgvector", "Docker", "Hugging Face"],
    metrics: { label: "Precision", value: "Hybrid Dense/Sparse" },
    links: {
      github: "https://github.com/HunainxAhmed",
      live: "https://github.com/HunainxAhmed"
    },
    featured: false,
    accent: "from-zinc-400 to-zinc-600"
  },
  {
    id: "mindcare-ai",
    number: "06",
    title: "MindCare AI",
    tagline: "AI Mental Health Therapist & Crisis Support Agent",
    category: "AI & Autonomous Systems",
    description: "A full-stack AI-powered mental health support system providing empathetic conversational responses, real-time emotional intent detection, crisis safety triage, and geolocation-based facility recommendations.",
    technicalDetails: [
      "Empathetic conversational agent pipeline fine-tuned for emotional sentiment and crisis risk classification",
      "High-throughput FastAPI backend with SQLAlchemy ORM, SQLite persistence, and structured chat histories",
      "Enterprise authentication layer combining Google OAuth 2.0 and cryptographically signed JWT sessions",
      "Automated geolocation dispatch linking at-risk users with nearby accredited healthcare centers"
    ],
    technologies: ["React.js", "FastAPI", "Python", "AI / NLP", "SQLAlchemy", "JWT & OAuth", "Responsive UI"],
    metrics: { label: "Response Mode", value: "Empathetic AI" },
    links: {
      github: "https://github.com/HunainxAhmed",
      live: "https://github.com/HunainxAhmed"
    },
    featured: false,
    accent: "from-teal-400/80 to-zinc-500"
  }
];
