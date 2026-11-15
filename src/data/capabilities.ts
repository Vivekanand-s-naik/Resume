import { CapabilityItem } from '../types';

export const CAPABILITIES: CapabilityItem[] = [
  {
    number: "01",
    title: "Agentic AI & Stateful RAG Workflows",
    tagline: "Autonomous multi-step LLM graphs, local vector stores & similarity retrieval.",
    description: "Architecting end-to-end Generative AI applications leveraging LangGraph stateful cyclic DAGs, recursive document chunking, ChromaDB vector indexing, and low-latency similarity retrieval pipelines.",
    coreStrengths: [
      "LangGraph Stateful Cyclic Graphs & Agent Memory Loops",
      "RAG Document Ingestion, Recursive Chunking & Embeddings",
      "ChromaDB Embedded Vector Retrieval (Sub-50ms)",
      "Strict Schema Validation with Pydantic & Tool Abstractions"
    ],
    technologies: ["Python", "LangChain", "LangGraph", "ChromaDB", "FastAPI", "OpenAI / LLM APIs"]
  },
  {
    number: "02",
    title: "Computer Vision & Real-Time Analytics",
    tagline: "Live video processing, object detection, gaze analysis & anti-spoof verification.",
    description: "Building production computer vision pipelines using Python, OpenCV, and YOLO capable of concurrent facial recognition, activity detection, MediaPipe gaze vector tracking, and anti-spoofing heuristics.",
    coreStrengths: [
      "Real-Time Multi-Stream Frame Ingestion (OpenCV & RTSP)",
      "YOLOv8 Multi-Class Object & Activity Detection",
      "MediaPipe Facial Mesh, Landmark & Gaze Tracking",
      "dlib Liveness Verification & Anti-Spoof Protection"
    ],
    technologies: ["Python", "OpenCV", "YOLO", "MediaPipe", "dlib", "face_recognition", "Flask"]
  },
  {
    number: "03",
    title: "Python Backend & Microservice Architecture",
    tagline: "Asynchronous APIs, background workers, alert throttling & WebSocket feeds.",
    description: "Developing robust, asynchronous backend services using FastAPI and Flask. Engineered with Pydantic schemas, background worker queues with notification cooldown throttling, and low-latency database connectivity.",
    coreStrengths: [
      "Async FastAPI & Flask REST API Microservices",
      "Background Alert Handling with Intelligent Cooldown Throttling",
      "Bidirectional WebSocket Feeds & Realtime State Sync",
      "Authentication, RBAC & Enterprise API Security"
    ],
    technologies: ["Python", "FastAPI", "Flask", "Pydantic", "WebSockets", "Firebase", "Docker"]
  },
  {
    number: "04",
    title: "Full-Stack Web Development & GIS Spatial Systems",
    tagline: "Modern React frontends, spatial database queries & multi-tier administrative portals.",
    description: "Engineering responsive full-stack applications with React, TypeScript, and Tailwind CSS. Specializing in connecting spatial GIS map coordinates with PostgreSQL databases and multi-role administrative workflows.",
    coreStrengths: [
      "Modern React 19 Single Page Applications with TypeScript",
      "Spatial GIS Mapping & Coordinate Geotagging Integrations",
      "Multi-Tier Workflows for Citizens, Authorities & Admins",
      "Mobile-First Responsive UI with Hardware-Accelerated CSS"
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "PostgreSQL", "GIS/Mapping APIs", "HTML5/CSS3"]
  },
  {
    number: "05",
    title: "Databases, Data Structures & Cloud Infrastructure",
    tagline: "Relational persistence, vector stores, Docker containerization & Git CI/CD.",
    description: "Designing structured relational schemas in PostgreSQL and MySQL, document stores in MongoDB and Firebase, and deploying containerized services with Docker, Git version control, and Postman testing suites.",
    coreStrengths: [
      "Relational Schema Design & Optimization (PostgreSQL, MySQL)",
      "Real-time Document Sync with Firebase & MongoDB",
      "Strong Foundations in DSA & Object-Oriented Programming (Java/Python)",
      "Docker Containerization, VS Code Tooling & Postman API Testing"
    ],
    technologies: ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Docker", "Git", "Java", "Postman"]
  }
];
