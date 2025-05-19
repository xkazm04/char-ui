import { LucideUploadCloud, LucideWand2, LucideCode, LucideSparkles } from "lucide-react";
export const WORKFLOW_STEPS = [
	{
		step: 1,
		title: "Upload",
		icon: <LucideUploadCloud size={16}/>,
		desc: "Upload your reference images",
		longDesc:
			"Drag and drop reference images from your PC with your favorite characters, objects, or background.",
		image: "/landing/superman_extract.gif", 
	},
	{
		step: 2,
		title: "Process",
		icon: <LucideSparkles size={16} />,
		desc: "LLM detects and extracts assets",
		longDesc:
			"LLM breaks down image into individual assets. Use Llama, Gemini, GPT to compare results.",
		image: "/landing/superman_save.gif",
	},
	{
		step: 3,
		title: "Customize",
		icon: <LucideWand2 size={16} />,
		desc: "Apply styles and make adjustments",
		longDesc:
			"Combine various assets, styles and create a character in your story beyond imagination.",
		image: "/landing/jinx_superman.png",
	},
	{
		step: 4,
		title: "Export",
		icon: <LucideCode size={16} />,
		desc: "Get game-ready assets and code",
		longDesc:
			"Export the character or equipment into optimized 3D assets in multiple formats compatible with all major game engines.",
		image: "/landing/jinx_superman.gif",
	},
];