# ⚡ VIVEK NAIK — Autonomous Agentic Systems & 3D Interactive Portfolio

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-00FF66?style=flat-square)](LICENSE)

> **High-impact, production-grade interactive portfolio** engineering the convergence of **Agentic AI (LangGraph & LangChain)**, **Computer Vision (YOLO & OpenCV)**, **High-Performance Python Backends (FastAPI & Flask)**, and **GPU-accelerated 3D WebGL (Three.js)**.

---

## 🌐 Live System Overview
Demo - https://viveknaik.vercel.app/
- **Developer**: Vivekanand S. Naik (`0xVN // PROTOCOL ARCHITECT`)
- **Role**: Software Engineer • AI Engineer • Backend Developer
- **Palette**: Dark Graphite (`#0C0C0C`) × Emerald Light Green (`#00FF66`)
- **Framerate Target**: Sub-16ms Framerate (60 FPS P99)
- **Direct Transmission**: [vivekanandnaik333@gmail.com](mailto:vivekanandnaik333@gmail.com)
- **GitHub**: [github.com/Vivekanand-s-naik](https://github.com/Vivekanand-s-naik)
- **LinkedIn**: [linkedin.com/in/vivekanand-s-naik-codersparadise](https://www.linkedin.com/in/vivekanand-s-naik-codersparadise/)
<img width="1917" height="916" alt="image" src="https://github.com/user-attachments/assets/b5f2acc9-7507-4d13-b573-d2c8f71d7311" />

---

## 🚀 Key Architectural Highlights

### 1. 🤖 Interactive 3D Digital Human Viewport
- **GPU Kinematics**: Powered by Three.js `WebGLRenderer` with ACESFilmic tone mapping and dynamic hardware DPR scaling.
- **Continuous Non-Repeating Mocap Cycle**: Smoothly transitions through a natural human cadence without waiting for clicks:
  `idle` → `waving` → `crossedArms` → `explaining` → `thoughtful` → `casualHip` → `dance`.
- **Responsive Cursor Gaze Tracking**: Absolute mathematical eye and head vectoring tracking user cursor position with zero cumulative drift or spinning.
- **Interactive Director Controls**:
  - **Camera Angles**: `FRONT`, `ANGLED`, `CLOSE`
  - **Holographic Render Modes**: `AGENT` (PBR), `HOLO` (translucent scan), `WIREFRAME` (emerald mesh)
  - **Quantum Shockwave**: Click or tap anywhere in the 3D viewport to trigger localized expanding shockwave ripples.
- **Mobile First-Class Citizen**: Prominently highlights the 3D character at the very top of mobile displays with touch-pan-y smooth scrolling.

### 2. ⚡ Live Agentic DAG Execution Console
- Interactive stateful graph simulator in the Hero section demonstrating LangGraph cyclic orchestration.
- Real-time topological node state transitions (`STATE_LOAD` → `DISPATCH` → `CONSENSUS` → `TELEMETRY` → `CONVERGED`).
- Live simulated execution logs displaying sub-millisecond Postgres checkpointing and asynchronous Redis task queue dispatching.

### 3. 💼 Flagship Systems & Projects
1. **ParallaxAI — LLM-Powered Intelligent Assistant**
   - *Tech*: Python, LangChain, LangGraph, RAG, ChromaDB, FastAPI, Flask, React
   - *Architecture*: Modular RAG pipeline with recursive document chunking, sub-50ms local ChromaDB similarity retrieval, and stateful LangGraph cyclic agent reasoning loops.
2. **Intelligent AI Surveillance & Real-Time Vision Analytics Platform**
   - *Tech*: Python, OpenCV, MediaPipe, dlib, face_recognition, YOLOv8, Flask, FastAPI, Firebase
   - *Architecture*: 30+ FPS live multi-stream video pipeline with simultaneous facial recognition, activity detection, gaze estimation, anti-spoof protection, and alert cooldown throttling.
3. **CivicEye — Smart Civic Issue Reporting Platform**
   - *Tech*: Python, YOLO, OpenCV, FastAPI, Flask, PostgreSQL, React, GIS/Mapping APIs
   - *Architecture*: Automated civic reporting with YOLO image defect classification, GIS coordinate mapping, PostgreSQL spatial storage, and role-based portals for citizens and authorities.

### 4. 🌌 Interactive Technology Constellation
- Dynamic SVG synaptic dependency graph connecting 20+ technologies across:
  - `AI / Model Layer` (LangGraph, ChromaDB, LangChain, YOLO, OpenCV)
  - `Backend & Distributed` (FastAPI, Flask, Python, Pydantic, Java)
  - `Frontend & 3D WebGL` (React 19, TypeScript, Tailwind, Three.js)
  - `Data & Vector Stores` (ChromaDB, PostgreSQL, Firebase, MongoDB)
  - `Cloud & Infra` (Docker, Git, VS Code, GIS APIs)
- Real-time edge highlighting and architectural dependency inspection on hover.

### 5. 🧪 Experiment Lab
- Live WebGL shader experiments including:
  - Vector Field Particle Dynamics (2,500 particles with pointer gravity)
  - Neural Latent Space (multi-cluster high-dimensional embeddings)
  - Interactive GLSL shader inspection modals with syntax highlighting.

### 6. 📬 Resilient Direct Transmission Channel
- Contact modal with dual delivery channels:
  - Primary: Direct API transmission to `vivekanandnaik333@gmail.com` via FormSubmit JSON endpoint.
  - Fallback: Pre-filled mail client (`mailto:`) with automatic parameter encoding.
  - 1-click clipboard copy with celebratory confetti physics.

---

## 📂 Repository Structure

```
├── public/
│   ├── images/
│   │   └── projects/           # Static SVG technical blueprints & latency graphs
│   │       ├── parallax-*.svg
│   │       ├── surveillance-*.svg
│   │       └── civiceye-*.svg
│   └── models/                 # 3D assets & Ready Player Me avatar
│       ├── digital-human.glb   # Optimized PBR character rig (1.3 MB)
│       └── animations/         # Skeletal Mixamo animation clips (GLB)
│           ├── idle.glb
│           ├── waving.glb
│           ├── crossed-arms.glb
│           ├── explaining.glb
│           ├── thoughtful.glb
│           ├── casual.glb
│           └── dance.glb
├── src/
│   ├── components/
│   │   ├── 3d/                 # Three.js canvases, rigging & procedural fallbacks
│   │   │   ├── DigitalHumanCanvas.tsx
│   │   │   ├── InteractiveCanvas.tsx
│   │   │   └── digitalHuman/
│   │   ├── sections/           # Modular high-contrast editorial portfolio sections
│   │   │   ├── Hero.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── SystemSection.tsx
│   │   │   ├── ProjectStack.tsx
│   │   │   ├── CapabilityList.tsx
│   │   │   ├── ExperimentLab.tsx
│   │   │   ├── TechConstellation.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                 # Reusable micro-interactions & primitives
│   │       ├── CommandPalette.tsx
│   │       ├── ContactModal.tsx
│   │       ├── CustomCursor.tsx
│   │       └── Magnetic.tsx
│   ├── data/                   # Structured content schemas & resume specifications
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   ├── capabilities.ts
│   │   ├── technologies.ts
│   │   ├── system.ts
│   │   └── experiments.ts
│   ├── hooks/                  # Media queries & hardware capability detectors
│   └── types/                  # Strict TypeScript domain interfaces
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Quickstart & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### 1. Clone the repository
```bash
git clone https://github.com/Vivekanand-s-naik/portfolio.git
cd portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch the development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/` to view the live interactive portfolio.

### 4. Run TypeScript checks
```bash
npm run typecheck
```

### 5. Create production build
```bash
npm run build
```
The optimized static bundle will be generated in `dist/`, ready for zero-config deployment on Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

---

## ⚙️ Customization Guide

### Update Personal Information
Edit [`src/data/profile.ts`](file:///c:/Users/Vivek/Desktop/Resume/src/data/profile.ts) to update your name, callsign, contact channels, bio, education, or certifications:
```typescript
export const PROFILE = {
  name: "VIVEK NAIK",
  fullName: "Vivekanand S. Naik",
  phone: "+91 8217516956",
  callsign: "0xVN // PROTOCOL ARCHITECT",
  role: "SOFTWARE ENGINEER | AI ENGINEER | BACKEND ENGINEERING",
  // ...
};
```

### Update Projects
Edit [`src/data/projects.ts`](file:///c:/Users/Vivek/Desktop/Resume/src/data/projects.ts) to customize project cards, technical problem/solution definitions, architecture metrics, and live demo links.

### Customize 3D Avatar
- Replace `/public/models/digital-human.glb` with any Ready Player Me or standard humanoid GLB model.
- Place new animation clips in `/public/models/animations/*.glb`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use it as inspiration for your own digital presence.

---

<p align="center">
  <b>Designed &amp; Engineered by Vivekanand S. Naik</b><br>
  <sub>Mangalore, Karnataka &bull; Available for AI &amp; Backend Engineering Roles</sub>
</p>

