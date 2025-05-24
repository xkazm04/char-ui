# PixelPlay

Hackathon project to experiment with capabilities of multimodal LLMs 

- Image analysis and breakdown into 2D videogames assets
- 2D assets to 3D models
- Automated workflows

 
---
TBD record new screen snippet

## 📚 Table of Contents

- [Studio Story](#studio-story)
  - [📚 Table of Contents](#-table-of-contents)
  - [🧠 About](#-about)
  - [✨ Roadmap](#-roadmap)
  - [🛠 Tech Stack](#-tech-stack)
  - [🏗 Project Structure](#-project-structure)
    - [Layout](#layout)
  - [🚀 Getting Started](#-getting-started)
    - [⚙️ Installation](#️-installation)
    - [🖧 Microservices](#-microservices)
    - [🔐 Environment Variables](#-environment-variables)

---
---

## 🛠 Tech Stack
- **Frontend:** NextJS, Typescript, TailwindCSS
- **Backend:** FastAPI services (Agentic workflow, Image processing), MongoDB for multiformat storage (image, vector, text in one)
- **LLMs:** Gemini, LLama for image processing. Flux dev for image gneration. Meshy for 3D generation
- **Infra:** Google Cloud for services deployment

## 🧠 About
All-in-one project to learn latest trends in web development and generative AI


### A. Asset generator
The Asset Management System serves as a comprehensive toolkit for creating, organizing, and utilizing visual assets for characters in creative and entertainment environment. It allows creators to:

#### Asset extraction
1. **Categorize and organize assets** into a hierarchical structure based on four main categories:
- **Body elements** (hairstyles, facial features, body modifications)
- **Equipment** (weapons, armor, tools, wearable technology)
- **Clothing** (upper/lower wear, footwear, headwear, accessories)
- **Background elements** (settings, visual effects, environmental objects)

2. **Search** and filter assets through an intuitive interface, allowing quick discovery of specific items across an extensive library.
3. **Analyze and extract** metadata from visual content, automatically categorizing new assets through AI vision technology.
4. **Preview and modify** assets before implementing them in character designs.

#### Value Proposition
- **Accelerating character creation** workflows through intelligent organization and quick-access filtering.
- **Enhancing creative consistency** by providing a centralized repository of pre-approved visual elements.
- **Reducing redundant asset creation** by making existing assets discoverable and reusable with vector comparison.
- **Bridging technical and creative roles** with a visual interface that **doesn't require programming knowledge**.
- **Scaling** content production by enabling efficient management of large asset libraries without performance degradation.

#### Innovations & Tech
The solution leverages several innovative technologies:

- **AI-powered categorization** that automatically analyzes and tags visual assets, reducing manual classification work.
- Reactive UI architecture that provides **real-time feedback** as users select and combine different assets.
- Advanced search capabilities that go beyond simple text matching to include visual similarity and contextual relevance.
- Category-based visualization that helps users understand the relationships between different asset types.

#### LLM models
Multimodal LLMs for image analysis, up to user to select from
- Groq provider: meta-llama/**llama-4-scout-17b-16e-instruct** - Provided for demo users for free
- Google: **gemini-1.5-flash** - Requires Gemini API Key from user 
- OpenAI: **gpt-4o** - Requires OpenAI API Key from user

#### MongoDB
- TBD after playing with image processing a bit more. Core concepts
- Easy BE asset management thanks to text/vector/image representation in one table
- Real-time fast vector similarity search


### B. Model builder
The Builder module provides an interactive, asset-driven interface for character creation. Users can select and organize assets (body, clothing, equipment, background), generate AI-powered sketches, and preview results in both 2D and 3D. The design emphasizes real-time feedback, intuitive asset management, and seamless integration with the rest of the app.


#### ✨ Key Features
- **Asset Selection & Organization**  
  Drag-and-drop or click to add assets from categorized groups (Body, Equipment, Clothing, Background).  
  Real-time asset count and category management.

- **AI Sketch Generation**  
  Instantly generate character sketches using selected assets and prompts.  
  Progress feedback and error handling for generation process.

- **Bulk Actions**  
  Select multiple sketches for batch operations (e.g., download, clear selection).

- **3D Model Preview**  
  Generate and toggle between 2D sketches and 3D model previews (GLB format) for each character.

- **Asset Usage Transparency**  
  View detailed overlays showing which assets contributed to each generated sketch.

- **Responsive & Animated UI**  
  Smooth transitions, animated feedback, and adaptive layouts for different screen sizes.


#### Value proposition
- **Accelerates creative workflows** by making asset selection and sketch generation seamless.
- **Bridges 2D and 3D creation** for richer character design experiences.
- **Empowers non-technical users** with an intuitive, visually-driven interface.
- **Scales to large asset libraries** with fast search, filtering, and bulk actions.

---

## 🏗 Code Structure

High-level overview of the folder structure:

```bash
├── public/          # Static assets
├── src/             
│   ├── components/  # UI basic components and animated components
│   ├── lib/         # Utilities and helpers
│   ├── hooks/       # Custom React hooks
│   ├── stores/      # Zustand store for cross-app states
│   ├── features/    # Pages/Modules: Landing, Asset analysis, Character Builder, Cooks
│   ├── functions/   # API calls and supporting services
│   ├── constants/   # Configuration files, enums
│   └── types/       # TypeScript types
```

---

## 🚀 Running locally

TBD 
- char-service wuth Mongo first,then UI

### ⚙️ Installation

```bash
# Frontend repository
git clone https://github.com/xkazm04/char-ui.git
cd char-ui
npm install
npm run dev
```

### Architecture 

TBD diagram

### 🔐 Environment Variables

TBD after done


![Seeya bitches](public/gifs/jinx_smile.gif)