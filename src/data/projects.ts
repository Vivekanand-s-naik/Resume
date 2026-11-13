import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: "nexus-agentic-rag",
    number: "01",
    title: "NEXUS COGNITION",
    subtitle: "Hierarchical Multi-Agent RAG Engine & Visual Canvas",
    category: "AI Systems × Distributed Backend",
    period: "2025 – 2026",
    role: "Lead Systems Architect & Full-Stack Engineer",
    summary: "An enterprise-grade multi-agent autonomous reasoning platform combining hybrid semantic/sparse vector search, deterministic tool execution loops, and real-time streaming graph visualizer.",
    problem: "Single-agent LLM systems degrade quickly when navigating enterprise repositories exceeding 100k heterogeneous documents, suffering from context hallucination and unpredictable latency.",
    solution: "Architected a dual-plane agent topology: an asynchronous supervisor router orchestrating specialized sub-agents with hierarchical document partitioning, hybrid BM25 + dense embedding reranking, and dynamic AST code verification sandbox.",
    architectureHighlight: "Sub-50ms vector indexing pipeline over 2.4M embeddings with raft-based consensus routing, semantic caching, and SSE token streaming.",
    aiComponent: "Hierarchical agent DAG router, Cohere Rerank v3, Qdrant vector index, structured JSON schema validation, tool-use execution sandboxes.",
    frontendStack: "React, TypeScript, Three.js node visualizer, Tailwind CSS, WebSockets client, Web Audio feedback.",
    backendStack: "Python FastAPI, Go gRPC microservices, Qdrant, Redis Cluster, Celery distributed tasks, Docker.",
    technologies: ["TypeScript", "Python", "Go", "Qdrant", "Redis", "FastAPI", "React", "Three.js", "Docker"],
    metrics: "Reduced retrieval hallucinations by 74% and accelerated multi-hop query resolution time from 14.2s to 1.8s.",
    liveUrl: "https://nexus-cognition-demo.dev",
    githubUrl: "https://github.com/example/nexus-cognition",
    images: {
      leftTop: "/images/projects/nexus-topology.svg",
      leftBottom: "/images/projects/nexus-latency.svg",
      rightMain: "/images/projects/nexus-blueprint.svg"
    }
  },
  {
    id: "aegis-stream-inference",
    number: "02",
    title: "AEGIS MULTIMODAL",
    subtitle: "Realtime Low-Latency Audio & Vision Inference Engine",
    category: "Full-Stack System × WebRTC / WebGL",
    period: "2025",
    role: "Full-Stack AI Engineer",
    summary: "Full-duplex real-time conversational intelligence platform delivering bidirectional WebRTC audio/vision streaming with sub-220ms glass-to-glass latency and dynamic WebGL waveform visualization.",
    problem: "Standard HTTP request-response interfaces fail completely for real-time conversational AI, requiring synchronous WebSockets, jitter buffering, and sub-second token acoustic rendering.",
    solution: "Engineered an end-to-end WebRTC media gateway in Rust with zero-copy ring buffers, running on-device acoustic VAD (Voice Activity Detection), quantized whisper speech transcription, and WebGL spectral visualizer.",
    architectureHighlight: "Rust WebRTC SFU bridge, streaming multi-token speculative decoding, SIMD audio resamplers, sub-220ms roundtrip audio loop.",
    aiComponent: "Quantized Speech-to-Speech pipeline, Silero VAD, Fast-speculative token decoding, streaming audio mel-spectrogram embeddings.",
    frontendStack: "React, WebRTC DataChannels, Web Audio API, Three.js shaders, Tailwind CSS.",
    backendStack: "Rust (Actix & WebRTC), Python PyTorch worker pool, C++ Triton Inference Server, NATS message bus.",
    technologies: ["Rust", "TypeScript", "Python", "WebRTC", "Triton", "PyTorch", "WebGL", "Three.js"],
    metrics: "Achieved continuous conversational latency under 220ms with 60 FPS GPU audio-reactive visual output.",
    liveUrl: "https://aegis-inference.dev",
    githubUrl: "https://github.com/example/aegis-stream",
    images: {
      leftTop: "/images/projects/aegis-topology.svg",
      leftBottom: "/images/projects/aegis-latency.svg",
      rightMain: "/images/projects/aegis-blueprint.svg"
    }
  },
  {
    id: "hyper-vector-engine",
    number: "03",
    title: "VECTORFLOW CORE",
    subtitle: "High-Throughput Distributed Vector Index & Search Engine",
    category: "Distributed Systems & Data Infrastructure",
    period: "2024 – 2025",
    role: "Backend & Systems Engineer",
    summary: "A high-performance approximate nearest neighbor (HNSW) vector indexing engine built for sub-millisecond similarity search over high-dimensional embedding spaces with memory-mapped persistence.",
    problem: "Traditional relational and document databases buckle under high-concurrency vector similarity queries, resulting in CPU saturation and linear search bottlenecks.",
    solution: "Constructed an optimized C++/Go SIMD-accelerated HNSW graph index with product quantization (PQ), LRU embedding cache, and Raft consensus replication across multi-region edge clusters.",
    architectureHighlight: "AVX-512 distance metric acceleration (Cosine, Euclidean, Dot Product), zero-allocation memory mapped I/O, partitioned shard balancing.",
    aiComponent: "High-dimensional embedding representations, Product Quantization (PQ-16), scalar quantization algorithms.",
    frontendStack: "React, TypeScript, Interactive 3D vector cluster visualizer (Three.js), Tailwind CSS.",
    backendStack: "Go, C++ (SIMD kernels), gRPC, Protobuf, LevelDB storage engine, Prometheus.",
    technologies: ["Go", "C++", "SIMD", "gRPC", "Protobuf", "TypeScript", "Three.js", "Docker", "Prometheus"],
    metrics: "Maintained 99.9th percentile query latency under 3.4ms under 45,000 requests/sec synthetic workload.",
    liveUrl: "https://vectorflow-benchmarks.dev",
    githubUrl: "https://github.com/example/vectorflow-core",
    images: {
      leftTop: "/images/projects/vectorflow-topology.svg",
      leftBottom: "/images/projects/vectorflow-latency.svg",
      rightMain: "/images/projects/vectorflow-blueprint.svg"
    }
  },
  {
    id: "prism-code-intelligence",
    number: "04",
    title: "PRISM SYNTAX AGENT",
    subtitle: "AST-Driven Autonomous Code Transformation & Refactoring Engine",
    category: "Developer Tooling × LLM Orchestration",
    period: "2024",
    role: "Full-Stack Creator & Systems Engineer",
    summary: "An autonomous developer agent that parses complex codebases into Abstract Syntax Trees (AST), runs symbolic safety invariants, and orchestrates LLM transformations with automated test suites.",
    problem: "Generic coding assistants perform naive string search-and-replace, frequently breaking semantic variable scopes, type invariants, and build pipelines in production repositories.",
    solution: "Combined Tree-sitter AST parsing with bidirectional semantic dependency graphs, multi-step LLM planning, and localized Docker execution sandboxes to verify every code patch before proposing diffs.",
    architectureHighlight: "Tree-sitter WASM parser in browser, WebSocket RPC server, incremental AST diffing engine, sandboxed microVM test runner.",
    aiComponent: "Self-correcting code generation loops, structured patch schemas, compiler error feedback loops, automated regression prevention.",
    frontendStack: "React, Monaco Editor integration, Tailwind CSS, Tree-sitter WASM, Framer Motion.",
    backendStack: "Node.js / TypeScript, Rust AST core, Docker container sandbox, Redis.",
    technologies: ["TypeScript", "Rust", "Tree-sitter", "Monaco Editor", "Docker", "React", "Node.js"],
    metrics: "Successfully automated 400+ complex codebase migrations with 99.2% build verification pass rate.",
    liveUrl: "https://prism-syntax.dev",
    githubUrl: "https://github.com/example/prism-syntax-agent",
    images: {
      leftTop: "/images/projects/prism-topology.svg",
      leftBottom: "/images/projects/prism-latency.svg",
      rightMain: "/images/projects/prism-blueprint.svg"
    }
  }
];
