export interface Milestone {
  year: string;
  quarter?: string;
  title: string;
  category: "Education" | "Architecture" | "Research & AI" | "Production Engineering";
  organization: string;
  description: string;
  keyOutputs: string[];
}

export const journeyData: Milestone[] = [
  {
    year: "2026",
    quarter: "Q1",
    title: "Trade Bot Gemini & Autonomous Agent Infrastructure",
    category: "Research & AI",
    organization: "Independent AI Exploration",
    description: "Engineered an autonomous multi-modal quantitative trading agent utilizing Google Gemini API. Created a structured reflection loop evaluating live market order books, technical momentum, and sentiment data to autonomously formulate risk-managed trading strategies.",
    keyOutputs: [
      "Autonomous reasoning loop with dynamic stop-loss calibration",
      "Real-time financial stream parser using asynchronous Python",
      "Risk auditing protocols enforcing strict downside boundaries"
    ]
  },
  {
    year: "2026",
    quarter: "Q1",
    title: "Klyptic — Browser-Native Video Editor",
    category: "Architecture",
    organization: "Flagship Creative Engineering",
    description: "Conceived and built a full non-linear video editing suite operating entirely inside the client browser. Overcame HTML5 performance bottlenecks by utilizing custom Canvas 2D composition pipelines, sub-frame audio synchronization, and integrated dynamic subtitle typography.",
    keyOutputs: [
      "60fps multi-track canvas render compositor",
      "Sub-frame keyframing and transition interpolation",
      "Local in-browser AI auto-captions with word-level timing"
    ]
  },
  {
    year: "2025",
    quarter: "Q3",
    title: "Pakistan Super App Monorepo",
    category: "Production Engineering",
    organization: "Multi-Service Mobility Infrastructure",
    description: "Architected a comprehensive cross-platform mobility and emergency roadside assistance platform. Implemented low-latency bidirectional WebSocket auctions, geo-fenced towing logistics, and cross-platform driver and rider experiences.",
    keyOutputs: [
      "Real-time reverse bidding protocol over persistent WebSockets",
      "Scalable monorepo uniting React Native mobile clients and Node.js backends",
      "High-reliability geolocation tracking with connection auto-recovery"
    ]
  },
  {
    year: "2025",
    quarter: "Q1",
    title: "Movie Recommender AI & Vector Retrieval",
    category: "Research & AI",
    organization: "Applied Machine Learning",
    description: "Formulated a hybrid recommendation pipeline fusing high-dimensional NLP text embeddings with sparse user-interaction matrices, achieving sub-10ms inference and effectively mitigating cold-start item evaluation.",
    keyOutputs: [
      "Hybrid collaborative and content-based scoring engine",
      "Vector similarity clustering over multidimensional metadata",
      "Interactive evaluation benchmark for algorithmic fidelity"
    ]
  },
  {
    year: "2023 — Present",
    title: "BS in Artificial Intelligence",
    category: "Education",
    organization: "Bahria University Karachi",
    description: "Rigorous academic study covering core foundations: Linear Algebra, Multivariate Calculus, Discrete Mathematics, Neural Networks, Computer Vision, Natural Language Processing, and Distributed Systems.",
    keyOutputs: [
      "Mathematical foundation of deep learning loss surfaces & optimization",
      "Hands-on research across neural architecture design and feature modeling",
      "Algorithmic analysis and memory-efficient data structures"
    ]
  }
];
