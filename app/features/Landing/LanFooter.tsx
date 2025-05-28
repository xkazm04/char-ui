import GlowingText from "@/app/components/landing/GlowingText";
import { motion } from "framer-motion";

const FooterOptions = [{
    label: 'Devpost',
    href: 'https://devpost.com/'
}, {
    label: 'Repo - UI',
    href: 'https://gitlab.com/xkazm04/char-ui',
    logo: '/logos/gitlab.svg'
}, {
    label: 'Repo - Service',
    href: 'https://gitlab.com/xkazm04/char-service',
    logo: '/logos/gitlab.svg'
}, {
    label: 'Contact',
    href: 'http://twitter.com/xkazm04'
}
]

const FooterLink = ({ href, label }: { href: string; label: string }) => {
    return (
        <a
            href={href}
            className="text-gray-400 hover:text-sky-400 transition-colors focus:outline-none rounded-md px-2 py-1"
            target="_blank"
            rel="noopener noreferrer"
        >
            {label}
        </a>
    );
};


const LanFooter = () => {
    return <>
        <footer className="py-12 px-6 md:px-16 bg-[#080814] border-t border-sky-900/20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center text-lg font-bold text-white">
                            Piksel <GlowingText>Play</GlowingText>
                        </div>
                    </div>

                    <nav aria-label="Footer navigation">
                        <ul className="flex flex-wrap gap-6 justify-center">
                            {FooterOptions.map((option, index) => (
                                <li key={index}>
                                    <div className="relative">
                                        {option.logo &&
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                                                <motion.img
                                                    src={option.logo}
                                                    alt={option.label}
                                                    className="h-10 object-contain"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                                />
                                            </div>}
                                        <FooterLink href={option.href} label={option.label} />
                                    </div>
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