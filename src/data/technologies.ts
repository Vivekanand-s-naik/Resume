import { TechNode } from '../types';

export const TECH_NODES: TechNode[] = [
  // AI / Model Layer
  {
    id: "llm-orch",
    name: "Multi-Agent DAGs",
    category: "AI / Model Layer",
    description: "Hierarchical agent routing, dynamic tool dispatch, and structured output schemas.",
    x: 20,
    y: 25,
    connections: ["qdrant", "python", "fastapi"]
  },
  {
    id: "rag-hybrid",
    name: "Hybrid RAG & Rerank",
    category: "AI / Model Layer",
    description: "BM25 sparse + dense embeddings fusion with Cohere Rerank v3 and semantic caching.",
    x: 32,
    y: 18,
    connections: ["qdrant", "llm-orch", "pgvector"]
  },
  {
    id: "eval-guardrails",
    name: "Evals & Guardrails",
    category: "AI / Model Layer",
    description: "Automated regression testing, invariant checks, and hallucination scoring pipelines.",
    x: 15,
    y: 40,
    connections: ["llm-orch", "python"]
  },
  {
    id: "webrtc-stream",
    name: "Streaming Audio VAD",
    category: "AI / Model Layer",
    description: "Full-duplex real-time audio token synthesis with Silero Voice Activity Detection.",
    x: 28,
    y: 35,
    connections: ["rust", "three-js", "webrtc"]
  },

  // Backend & Distributed
  {
    id: "python",
    name: "Python (FastAPI/PyTorch)",
    category: "Backend & Distributed",
    description: "Async web services, model orchestration, and data transformation microservices.",
    x: 42,
    y: 30,
    connections: ["fastapi", "llm-orch", "redis"]
  },
  {
    id: "fastapi",
    name: "FastAPI / gRPC",
    category: "Backend & Distributed",
    description: "High-throughput asynchronous APIs and type-safe Protobuf microservice communication.",
    x: 48,
    y: 20,
    connections: ["python", "redis", "docker"]
  },
  {
    id: "rust",
    name: "Rust (Actix / Tokio)",
    category: "Backend & Distributed",
    description: "Zero-copy memory safety, high-concurrency WebRTC gateways, and WASM AST parsers.",
    x: 38,
    y: 48,
    connections: ["webrtc", "webrtc-stream", "docker"]
  },
  {
    id: "go-lang",
    name: "Go (Distributed)",
    category: "Backend & Distributed",
    description: "Raft consensus engines, concurrent worker pools, and SIMD vector kernels.",
    x: 52,
    y: 42,
    connections: ["redis", "qdrant", "docker"]
  },
  {
    id: "node-ts",
    name: "Node.js / TypeScript",
    category: "Backend & Distributed",
    description: "Full-stack server runtimes, build automation tooling, and developer agent sandboxes.",
    x: 58,
    y: 32,
    connections: ["react-ecosystem", "docker", "redis"]
  },

  // Data & Vector Stores
  {
    id: "qdrant",
    name: "Qdrant Vector DB",
    category: "Data & Vector Stores",
    description: "HNSW high-dimensional index management with Product Quantization and payload filtering.",
    x: 25,
    y: 60,
    connections: ["rag-hybrid", "go-lang", "redis"]
  },
  {
    id: "pgvector",
    name: "PostgreSQL + pgvector",
    category: "Data & Vector Stores",
    description: "Relational persistence, ACID transactions, and embedded vector similarity indexing.",
    x: 35,
    y: 68,
    connections: ["redis", "node-ts"]
  },
  {
    id: "redis",
    name: "Redis Cluster",
    category: "Data & Vector Stores",
    description: "In-memory caching, distributed rate limiters, pub/sub streams, and Celery task queues.",
    x: 45,
    y: 58,
    connections: ["python", "go-lang", "pgvector"]
  },

  // Frontend & 3D WebGL
  {
    id: "react-ecosystem",
    name: "React 18/19 & Next.js",
    category: "Frontend & 3D WebGL",
    description: "Optimistic UI patterns, server components, custom hooks, and concurrent rendering.",
    x: 70,
    y: 28,
    connections: ["typescript", "tailwind", "three-js"]
  },
  {
    id: "typescript",
    name: "TypeScript (Strict)",
    category: "Frontend & 3D WebGL",
    description: "Type safety, polymorphic generic interfaces, and AST structural transformations.",
    x: 65,
    y: 42,
    connections: ["react-ecosystem", "node-ts", "three-js"]
  },
  {
    id: "three-js",
    name: "Three.js / WebGL / GLSL",
    category: "Frontend & 3D WebGL",
    description: "Procedural geometry, custom vertex/fragment shaders, GPU particle engines, and camera math.",
    x: 78,
    y: 45,
    connections: ["react-ecosystem", "framer-gsap", "webrtc-stream"]
  },
  {
    id: "framer-gsap",
    name: "GSAP & Framer Motion",
    category: "Frontend & 3D WebGL",
    description: "ScrollTrigger coordination, Lenis smooth scrolling, layout springs, and magnetic micro-interactions.",
    x: 82,
    y: 30,
    connections: ["three-js", "tailwind"]
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Frontend & 3D WebGL",
    description: "Architectural design tokens, fluid typography, and dark mode color harmony.",
    x: 72,
    y: 58,
    connections: ["react-ecosystem", "framer-gsap"]
  },

  // Cloud & Infra
  {
    id: "docker",
    name: "Docker & Container Sandboxes",
    category: "Cloud & Infra",
    description: "Isolated code execution sandboxes, multi-stage builds, and containerized microservices.",
    x: 55,
    y: 75,
    connections: ["k8s", "fastapi", "rust"]
  },
  {
    id: "k8s",
    name: "Kubernetes / Cloud Native",
    category: "Cloud & Infra",
    description: "Horizontal pod autoscaling, ingress routing, zero-downtime rolling deploys.",
    x: 68,
    y: 78,
    connections: ["docker", "prometheus"]
  },
  {
    id: "webrtc",
    name: "WebRTC & WebSockets",
    category: "Cloud & Infra",
    description: "Peer-to-peer data channels, low-latency media streams, and bi-directional RPC gateways.",
    x: 48,
    y: 82,
    connections: ["rust", "webrtc-stream"]
  },
  {
    id: "prometheus",
    name: "Prometheus & Grafana",
    category: "Cloud & Infra",
    description: "High-resolution latency metrics, P99 latency tracking, and automated alerts.",
    x: 80,
    y: 72,
    connections: ["k8s", "go-lang"]
  }
];
