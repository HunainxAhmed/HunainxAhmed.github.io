export interface Profile {
  name: string;
  role: string;
  subRole: string;
  technologiesLine: string;
  statement: string;
  philosophyHeadline: string;
  philosophyIntro: string;
  philosophyDomains: string[];
  location: string;
  phone: string;
  status: string;
  email: string;
  socials: {
    github: string;
    linkedin: string;
    upwork: string;
    twitter?: string;
  };
  education: {
    degree: string;
    institution: string;
    period: string;
    details: string;
  };
  stats: {
    value: string;
    label: string;
    detail: string;
  }[];
}

export const profileData: Profile = {
  name: "Hunain Ahmed",
  role: "AI / Machine Learning & Full-Stack Developer",
  subRole: "Deep Learning, LLMs & Autonomous Agents",
  technologiesLine: "Python • React • TypeScript",
  statement: "I build intelligent systems and scalable digital products where AI meets engineering.",
  philosophyHeadline: "I build things that are meant to move.",
  philosophyIntro: "Engineering is not merely writing code to satisfy static requirements. It is about understanding complex dynamical systems — from high-dimensional neural representations and autonomous agent feedback loops to zero-latency canvas rendering engines and resilient distributed services.",
  philosophyDomains: [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "LLMs & Prompt Systems",
    "Autonomous Agents",
    "Backend Microservices",
    "High-Scale APIs",
    "Frontend Engineering"
  ],
  location: "Karachi, Pakistan",
  phone: "+92 3708607811",
  status: "Available for select roles & AI engineering initiatives",
  email: "hunainahmed984@gmail.com",
  socials: {
    github: "https://github.com/HunainxAhmed",
    linkedin: "https://www.linkedin.com/in/hunain-ahmed-a654793b1/",
    upwork: "https://www.upwork.com/freelancers/~017666d6bc5fb3ee01",
  },
  education: {
    degree: "Bachelor of Science in Artificial Intelligence",
    institution: "Bahria University Karachi",
    period: "2024 — Present",
    details: "Deep exploration of neural networks, probability & statistics, computer vision, natural language processing, autonomous agents, and systems engineering."
  },
  stats: [
    { value: "05+", label: "Flagship Architectures", detail: "From client-side video editors to LLM trading agents" },
    { value: "20+", label: "Core Technologies", detail: "Python, PyTorch, TypeScript, React, Docker, FastAPI" },
    { value: "60fps", label: "Render Target", detail: "Sub-millisecond latency focus in state and animation loops" },
  ]
};
