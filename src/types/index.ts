export interface ProjectImageGroup {
  leftTop: string;
  leftBottom: string;
  rightMain: string;
  leftTopAlt?: string;
  leftBottomAlt?: string;
  rightMainAlt?: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  period: string;
  role: string;
  summary: string;
  problem: string;
  solution: string;
  architectureHighlight: string;
  aiComponent?: string;
  frontendStack?: string;
  backendStack?: string;
  technologies: string[];
  metrics?: string;
  liveUrl?: string;
  githubUrl?: string;
  images: ProjectImageGroup;
}

export interface CapabilityItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
  coreStrengths: string[];
  technologies: string[];
}

export interface LabExperiment {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  type: 'vector-field' | 'neural-latent' | 'agent-orchestration' | 'audio-mesh' | 'kinetic-physics';
  tags: string[];
  codeSnippet?: string;
}

export interface TechNode {
  id: string;
  name: string;
  category: 'AI / Model Layer' | 'Backend & Distributed' | 'Frontend & 3D WebGL' | 'Data & Vector Stores' | 'Cloud & Infra';
  description: string;
  x: number; // percentage 0-100 for constellation layout
  y: number; // percentage 0-100 for constellation layout
  connections: string[]; // target node IDs
}

export interface SystemLayer {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  code: string;
}
