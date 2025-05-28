import { LucideUploadCloud, LucideWand2, LucideCode, LucideSparkles } from "lucide-react";
export const WORKFLOW_STEPS = [
	{
		step: 1,
		title: "Extract",
		icon: <LucideUploadCloud size={25}/>,
		desc: "Extract any image",
		longDesc:
			"Extract reference images from your PC with favorite characters, objects, or environment.",
		image: "/landing/superman_extract.gif", 
		timeout: 8000,
	},
	{
		step: 2,
		title: "Generate",
		icon: <LucideSparkles size={25} />,
		desc: "Reuse extracted assets infinitely",
		longDesc: "Generate new characters, equipment, and environments using the extracted assets as a base.",
		image: "/landing/jinx_generate.gif",
		timeout: 15000,
	},
	{
		step: 3,
		title: "Customize",
		icon: <LucideWand2 size={25} />,
		desc: "Apply styles and make adjustments",
		longDesc:
			"Combine various assets, styles and create a character in your story beyond imagination.",
		image: "/landing/jinx_superman.png",
		timeout: 4000,
	},
	{
		step: 4,
		title: "Export",
		icon: <LucideCode size={25} />,
		desc: "Get game-ready assets",
		longDesc:
			"Export the character or equipment into optimized 3D assets in multiple formats compatible with all major game engines.",
		image: "/landing/jinx_superman.gif",
		timeout: 4000,
	},
];