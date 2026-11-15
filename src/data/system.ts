import { SystemLayer } from '../types';

export const SYSTEM_LAYERS: SystemLayer[] = [
  {
    step: "01",
    title: "INTELLIGENCE",
    subtitle: "Reasoning & LangGraph DAGs",
    description: "Architecting stateful multi-step agent graphs, structured output schemas, dynamic tool execution, and cyclic context optimization with LangChain and LangGraph.",
    details: [
      "LangGraph cyclic state graph & checkpointing",
      "Dynamic tool selection & execution loops",
      "Strict Pydantic structured output validation",
      "Autonomous error recovery & self-correction"
    ],
    code: `# LangGraph Stateful Cyclic Agent Workflow
workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_executor)
workflow.add_conditional_edges(
    "agent", should_continue,
    {"continue": "tools", "end": END}
)
app = workflow.compile(checkpointer=MemorySaver())`
  },
  {
    step: "02",
    title: "DATA & EMBEDDINGS",
    subtitle: "ChromaDB, Vectors & RAG Pipelines",
    description: "Structuring document loading, recursive chunking, dense vector representations, and low-latency similarity retrieval that keeps context fresh and grounded.",
    details: [
      "Recursive text chunking & token optimization",
      "ChromaDB local vector store indexing",
      "Cosine & Euclidean vector similarity search",
      "PostgreSQL relational & GIS spatial persistence"
    ],
    code: `# ChromaDB Similarity Retrieval Pipeline
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("docs_rag")
results = collection.query(
    query_texts=["Explain LangGraph cyclic state"],
    n_results=5,
    include=["documents", "distances", "metadatas"]
)`
  },
  {
    step: "03",
    title: "VISION & BACKEND",
    subtitle: "YOLO Inference & FastAPI Microservices",
    description: "Constructing high-throughput FastAPI and Flask services, real-time OpenCV video streams, YOLO multi-class object detection, and background alert throttling with Firebase.",
    details: [
      "Real-time video frame processing with OpenCV",
      "YOLOv8 multi-class object & activity detection",
      "Background alert throttling with cooldown timers",
      "Firebase live surveillance event streaming"
    ],
    code: `# Real-Time Vision & Alert Throttling
@app.post("/stream/detect")
async def process_frame(payload: FramePayload):
    boxes = yolo_model(payload.frame, conf=0.65)
    gaze = estimate_gaze(payload.frame, face_landmarks)
    if should_trigger_alert(boxes, cooldown=60):
        await firebase_sync.dispatch_event(boxes)
    return {"status": "ok", "fps": 32.4}`
  },
  {
    step: "04",
    title: "INTERFACE & 3D",
    subtitle: "React 19 & GPU-Accelerated WebGL",
    description: "Translating complex backend streams and AI models into instant interfaces with sub-16ms framerates, Three.js 3D avatar mocap playback, and responsive Tailwind styling.",
    details: [
      "Sub-16ms React 19 UI with optimistic updates",
      "Three.js 3D character with Mixamo mocap rigs",
      "Leaflet GIS map coordinate integrations",
      "Custom dark-mode ergonomics & green HUD glow"
    ],
    code: `// Sub-16ms 3D Kinematics & React Loop
const animate = () => {
  requestAnimationFrame(animate);
  mixer.update(clock.getDelta());
  camera.position.lerp(targetCam, 0.05);
  renderer.render(scene, camera);
};`
  }
];
