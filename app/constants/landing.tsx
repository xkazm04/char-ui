import { LucideCode, Gamepad2, BookCheck } from "lucide-react";
export const techStacks = [
  {
    name: "Next.js",
    logo: "/logos/nextjs.svg",
    description: "Production-grade React framework",
    url: "https://nextjs.org"
  },
  {
    name: "MongoDB",
    logo: "/logos/mongo.svg",
    description: "NoSQL database for modern apps",
    url: "https://www.mongodb.com"
  },
  {
    name: "Google Cloud",
    logo: "/logos/cloud.svg",
    description: "Cloud infrastructure & ML services",
    url: "https://cloud.google.com"
  },
  {
    name: "Meshy",
    logo: "/logos/meshy.svg",
    description: "Text/Image to 3D model generation",
    url: "https://meshy.ai"
  },
  {
    name: "LeonardoAI",
    logo: "/logos/leo.svg",
    description: "Generative AI platform for images and 3D assets",
    url: "https://leonardo.ai"
  },
  {
    name: "OpenAI",
    logo: "/logos/openai.svg",
    description: "Embedding and text generation API",
    url: "https://openai.com"
  },
  {
    name: "Groq",
    logo: "/logos/groq.svg",
    description: "LLama inference and text generation",
    url: "https://groq.com"
  }
];


export const useCases = [
  {
    icon: <Gamepad2 size={28} />,
    title: "Game Asset Generation",
    desc: "Auto-extract gear, weapons, armor from any image with AI precision.",
    features: ["Real-time processing", "Multiple formats", "Game engine ready"],
    color: "from-emerald-600/5 to-green-600/5",
    borderColor: "border-emerald-500/30",
    glowColor: "shadow-emerald-500/20"
  },
  {
    icon: <BookCheck size={28} />,
    title: "Storytelling Assets",
    desc: "Generate unique character assets for visual novels and interactive stories.",
    features: ["Style transfer", "Virtual try-on", "Batch processing"],
    color: "from-blue-600/5 to-cyan-600/5",
    borderColor: "border-blue-500/30",
    glowColor: "shadow-blue-500/20"
  },
  {
    icon: <LucideCode size={28} />,
    title: "Code Asset Analysis",
    desc: "Analyze and extract code assets from images for game development.",
    features: ["Code snippet extraction", "Syntax highlighting", "Integration with IDEs"],
    color: "from-purple-600/20 to-pink-600/5",
    borderColor: "border-purple-500/30",
    glowColor: "shadow-purple-500/20"
  }
];