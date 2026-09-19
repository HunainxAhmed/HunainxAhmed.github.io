export interface CapabilityPillar {
  id: string;
  pillarNumber: string;
  name: string;
  tagline: string;
  description: string;
  skills: {
    name: string;
    description: string;
    tags: string[];
  }[];
}

export const capabilitiesData: CapabilityPillar[] = [
  {
    id: "ai-ml",
    pillarNumber: "01",
    name: "AI / Machine Learning",
    tagline: "Neural Architectures, Autonomous Agents & Applied Inference",
    description: "Architecting intelligent algorithms from mathematical foundations to resilient production inferencing. Bridging deep neural models with real-world application pipelines.",
    skills: [
      {
        name: "Deep Learning & Neural Networks",
        description: "Designing, training, and fine-tuning custom architectures using PyTorch and TensorFlow for classification, segmentation, and sequence modeling.",
        tags: ["PyTorch", "TensorFlow", "Backprop", "Loss Geometry"]
      },
      {
        name: "Computer Vision Pipelines",
        description: "Feature extraction, spatial image preprocessing, video frame processing, and object detection using OpenCV and convolutional networks.",
        tags: ["OpenCV", "Convolutional Nets", "Spatial Analysis", "Frame Extraction"]
      },
      {
        name: "Natural Language Processing & RAG",
        description: "Vector embeddings, dense semantic retrieval, hybrid lexical-vector search, tokenization, and semantic clustering across high-dimensional text.",
        tags: ["Vector Embeddings", "Semantic Search", "RAG", "Chunking Strategies"]
      },
      {
        name: "LLMs & Autonomous Multi-Agent Loops",
        description: "Autonomous reasoning architectures with structured JSON outputs, self-correcting agent reflection loops, multi-modal Gemini & OpenAI API integration.",
        tags: ["Gemini API", "Autonomous Loops", "Agentic Tool Use", "Prompt Architecture"]
      },
      {
        name: "Model Optimization & Integration",
        description: "Quantization, latency tuning, sub-millisecond inference API wrappers, and embedding storage in vector databases.",
        tags: ["pgvector", "Inference Latency", "Model Serialization"]
      }
    ]
  },
  {
    id: "engineering",
    pillarNumber: "02",
    name: "Full-Stack Engineering",
    tagline: "High-Performance Client Architectures & Distributed Systems",
    description: "Crafting software where user experience matches computational rigor. From 60fps canvas render loops to robust microservices handling concurrent state.",
    skills: [
      {
        name: "Python & Asynchronous Backends",
        description: "High-throughput asynchronous web microservices with FastAPI, AsyncIO, background workers, and structured OpenAPI schemas.",
        tags: ["Python", "FastAPI", "AsyncIO", "Uvicorn", "Pydantic"]
      },
      {
        name: "TypeScript & Modern React",
        description: "Type-safe reactive state machines, component architecture, custom hook composition, and optimized virtual DOM rendering cycles.",
        tags: ["TypeScript", "React 18/19", "Zustand", "State Engines"]
      },
      {
        name: "Next.js & Server-Driven Architecture",
        description: "Production web applications leveraging server-side rendering, streaming interfaces, route handlers, and edge caching.",
        tags: ["Next.js", "SSR", "Edge Routes", "App Router"]
      },
      {
        name: "Client-Side Media & Canvas 2D",
        description: "Direct manipulation of raster buffers, non-linear video timeline sequencing, Web Audio API context graphs, and 60fps animation loops.",
        tags: ["HTML5 Canvas", "Web Audio API", "rAF Pipelines", "Keyframing"]
      },
      {
        name: "Node.js & Real-Time WebSockets",
        description: "Event-driven WebSocket orchestration for instant bidirectional state synchronization, live bidding, and telemetry streams.",
        tags: ["Node.js", "WebSockets", "Socket.IO", "Event Loop"]
      },
      {
        name: "PHP & Laravel Foundations",
        description: "Enterprise MVC architectures, database migrations, service providers, authentication pipelines, and RESTful endpoints.",
        tags: ["PHP", "Laravel", "MVC", "REST APIs"]
      }
    ]
  },
  {
    id: "infrastructure",
    pillarNumber: "03",
    name: "Data & Infrastructure",
    tagline: "Resilient Storage, Containerization & Scalable Pipelines",
    description: "Reliable database schemas, cache layers, container topologies, and deployment workflows built for repeatability and data integrity.",
    skills: [
      {
        name: "Relational & Vector Databases",
        description: "Complex relational schema design, query plan optimization, indexing strategies, and vector distance operators in PostgreSQL & pgvector.",
        tags: ["PostgreSQL", "pgvector", "SQL Optimization", "ACID Compliance"]
      },
      {
        name: "NoSQL & In-Memory Caching",
        description: "Document models with MongoDB for dynamic schemas; Redis caching layers, pub/sub message brokering, and transient session stores.",
        tags: ["MongoDB", "Redis", "Pub/Sub", "Data Modeling"]
      },
      {
        name: "Docker & Container Topologies",
        description: "Multi-stage Docker builds, development-production environment parity, Docker Compose multi-service topologies, and minimal image footprints.",
        tags: ["Docker", "Docker Compose", "Multi-Stage Builds", "Networking"]
      },
      {
        name: "Kubernetes & Cloud Workflows",
        description: "Container orchestration concepts, pod scheduling, service definitions, ingress routing, and automated continuous integration pipelines.",
        tags: ["Kubernetes", "CI/CD", "Cloud Deployments", "Environment Configs"]
      }
    ]
  }
];
