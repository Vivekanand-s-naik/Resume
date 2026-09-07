import { LabExperiment } from '../types';

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: "vector-field-sim",
    number: "EXP-01",
    title: "GPU Vector Field Simulation",
    category: "WebGL / GLSL",
    description: "Interactive 50,000 particle curl-noise flow field calculated directly on the GPU with dynamic mouse attractor forces and velocity decay.",
    type: "vector-field",
    tags: ["GLSL", "Particles", "Three.js", "Noise Algorithms"],
    codeSnippet: `vec3 curlNoise(vec3 p) {
  const float e = 0.0009;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  return normalize(vec3(
    snoise(p + dy) - snoise(p - dy) - snoise(p + dz) + snoise(p - dz),
    snoise(p + dz) - snoise(p - dz) - snoise(p + dx) + snoise(p - dx),
    snoise(p + dx) - snoise(p - dx) - snoise(p + dy) + snoise(p - dy)
  ));
}`
  },
  {
    id: "neural-latent-projector",
    number: "EXP-02",
    title: "Neural Latent Space Visualizer",
    category: "AI / Dimensionality Reduction",
    description: "Interactive 3D t-SNE & UMAP cluster projector rendering 1,536-dimensional semantic embeddings mapped into interactive orbital point clouds.",
    type: "neural-latent",
    tags: ["Embeddings", "t-SNE", "Point Clouds", "Three.js"],
    codeSnippet: `// High-Dimensional Projection
const projector = new EmbeddingProjector({
  dimensions: 1536,
  targetSpace: '3D_ORBITAL',
  metric: 'cosine'
});
projector.projectClusters(embeddings);`
  },
  {
    id: "agent-dag-runner",
    number: "EXP-03",
    title: "Autonomous Tool DAG Engine",
    category: "AI Systems",
    description: "Visual runtime inspector displaying streaming execution graphs for asynchronous sub-agents with state rewind, step-by-step debugger, and token telemetry.",
    type: "agent-orchestration",
    tags: ["Agent DAG", "State Rewind", "Streaming SSE", "TypeScript"],
    codeSnippet: `// Parallel Task Dispatch
await Promise.all([
  agentRouter.dispatch('extract_entities'),
  agentRouter.dispatch('semantic_retrieve'),
  agentRouter.dispatch('evaluate_invariants')
]);`
  },
  {
    id: "audio-reactive-mesh",
    number: "EXP-04",
    title: "Acoustic Shader Displacement",
    category: "Web Audio / GLSL",
    description: "Real-time FFT audio frequency spectrum mapped into vertex displacement shaders on an icosahedron geometry with chromatic aberration.",
    type: "audio-mesh",
    tags: ["Web Audio API", "Vertex Displacement", "GLSL", "FFT"],
    codeSnippet: `void main() {
  vec3 pos = position + normal * (audioFrequency * 0.45);
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`
  },
  {
    id: "kinetic-physics-typo",
    number: "EXP-05",
    title: "Kinetic Constraint Typography",
    category: "Physics & Interaction",
    description: "Verlet integration physics simulation where letterforms react elastically to cursor velocity, boundary collisions, and gravity wells.",
    type: "kinetic-physics",
    tags: ["Verlet Physics", "Typography", "Canvas 2D", "Elasticity"],
    codeSnippet: `// Verlet Particle Integration
particle.pos += (particle.pos - particle.prevPos) * friction;
particle.pos += gravity * dt * dt;
particle.prevPos = tempPos;`
  }
];
