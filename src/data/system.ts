import { SystemLayer } from '../types';

export const SYSTEM_LAYERS: SystemLayer[] = [
  {
    step: "01",
    title: "INTELLIGENCE",
    subtitle: "Reasoning & Model Topology",
    description: "Architecting agent graphs, structured output schemas, dynamic tool selection, and context-window optimization to extract deterministic reasoning from probabilistic foundation models.",
    details: [
      "Agent DAG orchestration & tool dispatch",
      "Model routing (Latency vs Quality trade-offs)",
      "Strict JSON/Pydantic structured output validation",
      "Self-correction loops & regression guardrails"
    ],
    code: `// Agent Decision Pipeline
const supervisor = new AgentSupervisor({
  strategy: 'hierarchical-dag',
  tools: [vectorSearch, codeSandbox, webExtractor],
  fallbackPolicy: 'exponential-backoff'
});
const response = await supervisor.evaluate(intent);`
  },
  {
    step: "02",
    title: "DATA",
    subtitle: "Embeddings, Vectors & Pipelines",
    description: "Structuring high-dimensional vector representations, hybrid semantic search, chunking heuristics, and low-latency cache layers that keep context fresh and precise.",
    details: [
      "HNSW vector indexing & Product Quantization",
      "Hybrid sparse (BM25) + dense embedding fusion",
      "Distributed cache coherence via Redis Cluster",
      "Realtime ingestion pipelines with CDC (Change Data Capture)"
    ],
    code: `// Hybrid Retrieval Fusion
const matches = await qdrant.searchHybrid({
  collection: 'corpus_v2',
  denseVector: await embedQuery(userQuery),
  sparseIndices: bm25Tokenize(userQuery),
  rerank: 'cohere-rerank-v3',
  limit: 10
});`
  },
  {
    step: "03",
    title: "SYSTEMS",
    subtitle: "Resilient Distributed Microservices",
    description: "Constructing high-throughput gRPC services, WebSocket/WebRTC media gateways, worker pools, and memory-mapped persistence engines that never bottleneck.",
    details: [
      "Sub-20ms gRPC & WebRTC media transmission",
      "Asynchronous worker queues with Celery & Redis",
      "Fault-tolerant Raft consensus state machines",
      "Dockerized microVM code execution sandboxes"
    ],
    code: `// High-Concurrency Event Stream
let stream = WebRTCGateway::bind("0.0.0.0:8080")
    .with_zero_copy_ring_buffer(64 * 1024)
    .spawn_worker_pool(16);
stream.listen_bidirectional(|frame| process_audio(frame));`
  },
  {
    step: "04",
    title: "EXPERIENCE",
    subtitle: "Pixel-Level Kinetic Ergonomics",
    description: "Translating complex backend streams into instant, joyful interfaces with sub-16ms framerates, WebGL spatial computing, optimistic state updates, and accessible design.",
    details: [
      "Zero-latency optimistic UI with rollback",
      "GPU-accelerated Three.js & GLSL shaders",
      "Lenis smooth physics & GSAP ScrollTrigger",
      "Accessible ARIA landmarks & WCAG 2.1 compliance"
    ],
    code: `// 60fps GPU Kinetic Viewport
useFrame(({ clock, mouse }) => {
  material.uniforms.uTime.value = clock.getElapsedTime();
  material.uniforms.uPointer.value.lerp(mouse, 0.05);
  camera.lookAt(targetPosition);
});`
  }
];
