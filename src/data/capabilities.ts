import { CapabilityItem } from '../types';

export const CAPABILITIES: CapabilityItem[] = [
  {
    number: "01",
    title: "AI Products & Cognitive Engines",
    tagline: "From fine-tuned reasoning loops to intuitive generative user experiences.",
    description: "Architecting end-to-end AI applications leveraging multi-agent orchestration, hybrid RAG pipelines, streaming inference, structured schema validation, and context memory caching.",
    coreStrengths: [
      "Multi-Agent DAG Workflows & Dynamic Tool Calling",
      "Hybrid Semantic & BM25 Vector Retrieval (Qdrant, Pinecone, pgvector)",
      "Streaming Low-Latency LLM UX with Optimistic UI States",
      "Model Evaluation, Guardrails, & Automated Regression Suites"
    ],
    technologies: ["LangChain", "LlamaIndex", "Qdrant", "PyTorch", "FastAPI", "OpenAI / Anthropic APIs"]
  },
  {
    number: "02",
    title: "Full-Stack Web Applications",
    tagline: "Resilient, responsive, and beautifully crafted software systems.",
    description: "Building production web applications from ground up with obsessive attention to state management, optimistic updates, database indexing, edge caching, and pixel-level ergonomics.",
    coreStrengths: [
      "Modern React / Next.js Architecture with Server Components",
      "Type-Safe End-to-End APIs (tRPC, GraphQL, REST, gRPC)",
      "Real-Time Collaborative Multi-User State Synchronizations",
      "Sub-16ms Framerate UI & Micro-Interaction Design"
    ],
    technologies: ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "PostgreSQL", "Redis"]
  },
  {
    number: "03",
    title: "Intelligent Automation & Agent Systems",
    tagline: "Autonomous workflows that execute complex multi-step digital operations.",
    description: "Developing robust background worker networks and automated intelligence pipelines that ingest unstructured data, run symbolic transformations, and trigger deterministic real-world actions.",
    coreStrengths: [
      "AST Code Parsing & Automated Syntax Transformations (Tree-sitter)",
      "Distributed Task Queues & Event-Driven Message Brokers",
      "Browser & System Automation with Sandboxed Execution",
      "Self-Healing Error Recovery & Automated Retries"
    ],
    technologies: ["Python", "Rust", "Tree-sitter", "Celery", "RabbitMQ", "Docker", "WASM"]
  },
  {
    number: "04",
    title: "Backend & Distributed Systems",
    tagline: "High-throughput, fault-tolerant infrastructure built to scale gracefully.",
    description: "Designing cloud-native microservices, custom protocol gateways, SIMD-accelerated data algorithms, and low-latency storage layers engineered for high-concurrency workloads.",
    coreStrengths: [
      "Concurrent Microservices in Go, Rust, and Node.js",
      "High-Performance In-Memory Caching & Distributed Locks",
      "Custom WebRTC / WebSocket Realtime Audio & Data Gateways",
      "Zero-Downtime Database Migrations & Observability Telemetry"
    ],
    technologies: ["Go", "Rust", "PostgreSQL", "Redis", "gRPC", "Docker", "Kubernetes", "Prometheus"]
  },
  {
    number: "05",
    title: "Interactive 3D & Creative WebGL",
    tagline: "Digital art direction merged with GPU-accelerated computing.",
    description: "Crafting memorable spatial interfaces, custom GLSL shaders, particle simulations, and dynamic interactive 3D elements that elevate digital products into unforgettable brand experiences.",
    coreStrengths: [
      "Custom GLSL Vertex & Fragment Shader Development",
      "Performant Procedural 3D Mesh Generation & Particle Systems",
      "Physics-Based Kinetic Typography & Scroll-Tied Motion",
      "Adaptive Mobile Level-of-Detail (LOD) & GPU Memory Management"
    ],
    technologies: ["Three.js", "WebGL", "GLSL", "React Three Fiber", "GSAP ScrollTrigger", "Framer Motion"]
  }
];
