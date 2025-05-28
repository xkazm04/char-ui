import { techStacks } from "@/app/constants/landing"
import Image from "next/image"
import { m } from "framer-motion"

const LanHeroTech = () => {
    const handleArrowClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }
    return <m.div
        className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
    >
        {techStacks.map((t, index) => (
            <m.div
                key={index}
                className="group flex flex-col justify-between relative p-6 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm hover:bg-black/5 transition-all"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
            >
                <Image
                    src={t.logo}
                    alt={t.name}
                    fill
                    className="absolute top-4 right-4 opacity-7 hover:opacity-60 transition-all z-10 duraiton-300 ease-linear"
                />
                <div
                    className="text-sky-400 font-mono text-sm cursor-pointer hover:text-sky-300 transition-colors duration-200 self-end z-20 relative"
                    onClick={() => handleArrowClick(t.url)}
                    role="button"
                    title={t.description}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleArrowClick(t.url)
                        }
                    }}
                >
                    {'->'}
                </div>
            </m.div>
        ))}
    </m.div>
}

export default LanHeroTech