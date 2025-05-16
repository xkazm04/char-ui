import { LucideSparkles } from "lucide-react"

const LanFooter = () => {
    return <>
        <footer className="py-12 px-6 md:px-16 bg-[#080814] border-t border-sky-900/20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-sky-900/30 rounded-lg flex items-center justify-center mr-3">
                                <LucideSparkles className="h-6 w-6 text-sky-400" />
                            </div>
                            <span className="text-xl font-bold text-white">PixelPlay</span>
                        </div>
                    </div>

                    <nav aria-label="Footer navigation">
                        <ul className="flex flex-wrap gap-6 justify-center">
                            {['Demo', 'Hackathon event', 'Devpost'].map(item => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="text-gray-400 hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#080814] rounded-md px-2 py-1"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    </>
}

export default LanFooter;