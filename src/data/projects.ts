import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: "parallax-ai-assistant",
    number: "01",
    title: "PARALLAX AI",
    subtitle: "LLM-Powered Intelligent Assistant & Stateful LangGraph RAG",
    category: "Generative AI • RAG • Python Backend",
    period: "2024 – 2025",
    role: "AI & Full-Stack Engineer",
    summary: "An intelligent autonomous assistant built using Python, LangChain, and LangGraph, featuring a modular RAG pipeline covering document loading, recursive text chunking, ChromaDB vector indexing, and stateful multi-step AI reasoning workflows.",
    problem: "Traditional LLM interfaces lack domain-specific document grounding, suffer from hallucinations on unstructured documents, and cannot execute reliable multi-step workflows with persistent state.",
    solution: "Engineered an end-to-end RAG architecture with ChromaDB for local vector storage, recursive chunking heuristics, similarity-based retrieval, and cyclic LangGraph state machines exposed via asynchronous FastAPI endpoints and a modern React frontend.",
    architectureHighlight: "Sub-50ms local ChromaDB similarity retrieval, LangGraph cyclic state machine loops, Pydantic schema validation, and streaming FastAPI response pipeline.",
    aiComponent: "LangChain, LangGraph stateful DAG, ChromaDB vector store, RAG retrieval engine, dynamic prompt orchestration, multi-step agent reasoning.",
    frontendStack: "React, TypeScript, Tailwind CSS, Markdown renderer, SSE streaming client.",
    backendStack: "Python, FastAPI, Flask, LangChain, LangGraph, ChromaDB, Pydantic, REST APIs.",
    technologies: ["Python", "LangChain", "LangGraph", "RAG", "ChromaDB", "FastAPI", "Flask", "React", "TypeScript"],
    metrics: "Sub-50ms vector similarity lookup, zero context drift across multi-step agent loops, and automated document chunking.",
    liveUrl: "https://github.com/Vivekanand-s-naik/ParallaxAI",
    githubUrl: "https://github.com/Vivekanand-s-naik/ParallaxAI",
    images: {
      leftTop: "/images/projects/parallax-topology.svg",
      leftBottom: "/images/projects/parallax-latency.svg",
      rightMain: "/images/projects/parallax-blueprint.svg"
    }
  },
  {
    id: "ai-vision-surveillance",
    number: "02",
    title: "AI SURVEILLANCE",
    subtitle: "Real-Time Vision Analytics, Facial Recognition & Gaze Tracking",
    category: "AI/ML • Computer Vision • Python Backend",
    period: "2024 – 2025",
    role: "Computer Vision & Backend Engineer",
    summary: "A real-time intelligent computer vision platform built with Python, OpenCV, and YOLO delivering simultaneous facial recognition, activity detection, gaze tracking, and anti-spoof verification with background alert cooldowns and Firebase synchronization.",
    problem: "Conventional surveillance requires continuous human observation, generates high false-alarm rates, suffers from spoofing attacks, and floods operators with duplicate notifications during ongoing events.",
    solution: "Constructed a multi-stage vision pipeline integrating OpenCV frame capture, YOLOv8 object/activity detection, MediaPipe facial landmarks, dlib anti-spoof classification, and Flask/FastAPI services with background alert cooldown throttling and Firebase real-time data persistence.",
    architectureHighlight: "Live multi-stream OpenCV processing at 30+ FPS, YOLO batch inference, automated notification cooldown scheduler, and Firebase live data sync.",
    aiComponent: "YOLO object & activity detection, MediaPipe facial mesh & gaze vector estimation, dlib spoof classification, face_recognition biometric vector matching.",
    frontendStack: "React, TypeScript, HTML5 Canvas overlay, Tailwind CSS, Real-time telemetry dashboard.",
    backendStack: "Python, OpenCV, MediaPipe, dlib, face_recognition, YOLO, Flask, FastAPI, Firebase.",
    technologies: ["Python", "OpenCV", "MediaPipe", "dlib", "face_recognition", "YOLO", "FastAPI", "Flask", "Firebase"],
    metrics: "30+ FPS live multi-stream video inference with intelligent notification cooldown preventing alert fatigue.",
    liveUrl: "https://github.com/Vivekanand-s-naik/PROJECT-VISION-REBUILD",
    githubUrl: "https://github.com/Vivekanand-s-naik/PROJECT-VISION-REBUILD",
    images: {
      leftTop: "/images/projects/surveillance-topology.svg",
      leftBottom: "/images/projects/surveillance-latency.svg",
      rightMain: "/images/projects/surveillance-blueprint.svg"
    }
  },
  {
    id: "civiceye-platform",
    number: "03",
    title: "CIVICEYE",
    subtitle: "Smart Civic Issue Reporting with YOLO Vision & GIS Mapping",
    category: "Computer Vision • Python Backend • Full Stack",
    period: "2024",
    role: "Full-Stack & Computer Vision Developer",
    summary: "A smart civic reporting ecosystem enabling citizens to report municipal issues via photos and location data, automatically verified by YOLO object detection, linked to GIS mapping, and routed through dedicated multi-tier authority workflows.",
    problem: "Municipal issue triage is slow and inaccurate due to ambiguous user descriptions, lack of geolocation data, duplicate tickets, and disconnected resolution workflows between citizens and city officials.",
    solution: "Developed an automated platform combining YOLO image detection for automatic issue verification, GIS map coordinate tracking, PostgreSQL relational storage, and FastAPI/Flask backends with distinct portals for citizens, municipal authorities, and administrators.",
    architectureHighlight: "YOLO automated image defect validation, GIS geolocation tagging, PostgreSQL spatial database, and role-based multi-tier approval workflows.",
    aiComponent: "YOLO civic issue detection (potholes, garbage overflow, structural damage), automated severity categorization, OpenCV preprocessing.",
    frontendStack: "React, TypeScript, Tailwind CSS, GIS/Mapping APIs, Responsive mobile-first interface.",
    backendStack: "Python, YOLO, OpenCV, FastAPI, Flask, PostgreSQL, SQLAlchemy, REST APIs.",
    technologies: ["Python", "YOLO", "OpenCV", "FastAPI", "Flask", "PostgreSQL", "React", "GIS/Mapping APIs", "TypeScript"],
    metrics: "Automated 100% of image issue classifications with instant GPS tagging and streamlined resolution routing across 3 administrative tiers.",
    liveUrl: "https://github.com/Vivekanand-s-naik/civiceye-1",
    githubUrl: "https://github.com/Vivekanand-s-naik/civiceye-1",
    images: {
      leftTop: "/images/projects/civiceye-topology.svg",
      leftBottom: "/images/projects/civiceye-latency.svg",
      rightMain: "/images/projects/civiceye-blueprint.svg"
    }
  }
];
