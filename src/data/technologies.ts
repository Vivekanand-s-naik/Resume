import { TechNode } from '../types';

export const TECH_NODES: TechNode[] = [
  // AI / Model Layer
  {
    id: "langgraph",
    name: "LangGraph (Stateful DAGs)",
    category: "AI / Model Layer",
    description: "Multi-agent cyclic orchestration, state persistence, checkpointing, and dynamic tool calling.",
    x: 20,
    y: 25,
    connections: ["chromadb", "python", "fastapi"]
  },
  {
    id: "rag-chroma",
    name: "RAG & ChromaDB",
    category: "AI / Model Layer",
    description: "Document loading, recursive text chunking, embedding generation, and similarity retrieval.",
    x: 32,
    y: 18,
    connections: ["langgraph", "langchain", "postgres"]
  },
  {
    id: "langchain",
    name: "LangChain & LLM APIs",
    category: "AI / Model Layer",
    description: "Prompt chaining, tool abstractions, structured outputs, and LLM integrations.",
    x: 16,
    y: 38,
    connections: ["langgraph", "python", "fastapi"]
  },
  {
    id: "yolo-cv",
    name: "YOLO (Computer Vision)",
    category: "AI / Model Layer",
    description: "Real-time object detection, civic issue classification, activity analysis, and tracking.",
    x: 28,
    y: 38,
    connections: ["opencv", "python", "flask"]
  },
  {
    id: "opencv",
    name: "OpenCV & MediaPipe",
    category: "AI / Model Layer",
    description: "Live video capture streams, facial landmarks, gaze tracking, and dlib anti-spoofing.",
    x: 36,
    y: 48,
    connections: ["yolo-cv", "python", "firebase"]
  },

  // Backend & Distributed
  {
    id: "python",
    name: "Python (Core Runtime)",
    category: "Backend & Distributed",
    description: "High-performance asynchronous backend services, AI models, and data pipelines.",
    x: 48,
    y: 28,
    connections: ["fastapi", "flask", "langgraph"]
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "Backend & Distributed",
    description: "Async REST APIs, WebSockets, background tasks, and high-concurrency event routing.",
    x: 55,
    y: 18,
    connections: ["python", "pydantic", "docker"]
  },
  {
    id: "flask",
    name: "Flask Microservices",
    category: "Backend & Distributed",
    description: "Lightweight web services for computer vision processing and modular backend features.",
    x: 52,
    y: 42,
    connections: ["python", "opencv", "postgres"]
  },
  {
    id: "pydantic",
    name: "Pydantic & WebSockets",
    category: "Backend & Distributed",
    description: "Runtime data validation, strict schema serialization, and bidirectional event streams.",
    x: 64,
    y: 26,
    connections: ["fastapi", "react"]
  },
  {
    id: "java",
    name: "Java & OOP",
    category: "Backend & Distributed",
    description: "Strong object-oriented design, robust data structures, and enterprise system design fundamentals.",
    x: 60,
    y: 38,
    connections: ["python", "postgres"]
  },

  // Frontend & 3D WebGL
  {
    id: "react",
    name: "React 19",
    category: "Frontend & 3D WebGL",
    description: "Component architecture, interactive dashboards, hooks, and responsive client state.",
    x: 72,
    y: 22,
    connections: ["typescript", "tailwind", "fastapi"]
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Frontend & 3D WebGL",
    description: "End-to-end type safety, modern ES modules, and deterministic interface abstractions.",
    x: 82,
    y: 18,
    connections: ["react", "three-js"]
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Frontend & 3D WebGL",
    description: "Utility-first design system, dark-mode ergonomics, and hardware-accelerated animations.",
    x: 75,
    y: 35,
    connections: ["react"]
  },
  {
    id: "three-js",
    name: "Three.js & WebGL",
    category: "Frontend & 3D WebGL",
    description: "Real-time 3D rendering, skeletal mocap avatar animations, and GPU particle shaders.",
    x: 86,
    y: 32,
    connections: ["react", "typescript"]
  },

  // Data & Vector Stores
  {
    id: "chromadb",
    name: "ChromaDB",
    category: "Data & Vector Stores",
    description: "Embedded vector database for local document chunk embeddings and similarity search.",
    x: 24,
    y: 65,
    connections: ["langgraph", "rag-chroma", "python"]
  },
  {
    id: "postgres",
    name: "PostgreSQL & SQL",
    category: "Data & Vector Stores",
    description: "Relational persistence, spatial coordinates, schema migrations, and ACID compliance.",
    x: 40,
    y: 62,
    connections: ["fastapi", "python", "chromadb"]
  },
  {
    id: "firebase",
    name: "Firebase (Realtime DB)",
    category: "Data & Vector Stores",
    description: "Real-time surveillance event logging, monitoring data sync, and instant alerts.",
    x: 32,
    y: 75,
    connections: ["opencv", "flask"]
  },
  {
    id: "mysql-mongo",
    name: "MySQL & MongoDB",
    category: "Data & Vector Stores",
    description: "Structured relational tables and document-oriented data storage solutions.",
    x: 48,
    y: 72,
    connections: ["postgres", "python"]
  },

  // Cloud & Infra
  {
    id: "docker",
    name: "Docker",
    category: "Cloud & Infra",
    description: "Containerization, reproducible deployment environments, and microservice isolation.",
    x: 65,
    y: 62,
    connections: ["fastapi", "git", "postgres"]
  },
  {
    id: "git",
    name: "Git & GitHub",
    category: "Cloud & Infra",
    description: "Version control, automated CI/CD workflows, issue tracking, and collaborative repos.",
    x: 76,
    y: 58,
    connections: ["docker", "vscode"]
  },
  {
    id: "vscode",
    name: "VS Code & Postman",
    category: "Cloud & Infra",
    description: "API testing, automated endpoint collections, debugging runtimes, and profiling.",
    x: 84,
    y: 68,
    connections: ["git", "fastapi"]
  },
  {
    id: "gis-apis",
    name: "GIS & Mapping APIs",
    category: "Cloud & Infra",
    description: "Spatial coordinate mapping, GPS geotagging for civic reports, and interactive maps.",
    x: 60,
    y: 78,
    connections: ["postgres", "react"]
  }
];
