import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSavedPrompts, useSavedBrands } from '../hooks/useDexieStorage'

function HomePage() {
    const { savedPrompts, isLoading: isLoadingPrompts } = useSavedPrompts()
    const { savedBrands, isLoading: isLoadingBrands } = useSavedBrands()
    const [nicheCount, setNicheCount] = useState(0)

    // Load niche count from localStorage
    useEffect(() => {
        const savedNiche = localStorage.getItem('moss-niche-results')
        setNicheCount(savedNiche ? 1 : 0)
    }, [])

    const promptCount = savedPrompts?.length || 0
    const brandCount = savedBrands?.length || 0


    const ctaButtons = [
        { path: '/niche-picker', label: '🌿 Pick a Niche', icon: '🌿' },
        { path: '/prompt-vault', label: '📜 Open Prompt Vault', icon: '📜' },
        { path: '/branding-studio', label: '🧵 Forge a Brand', icon: '🧵' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 py-6"
        >
            {/* Central Parchment Card */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center"
            >
                <div className="parchment-card max-w-2xl w-full text-center">
                    {/* Decorative leaf corners */}
                    <span className="absolute top-3 left-4 text-2xl opacity-60">🍃</span>
                    <span className="absolute bottom-3 right-4 text-2xl opacity-60 rotate-180">🍃</span>

                    {/* Stats */}
                    <p className="stats-text text-2xl md:text-3xl font-handwritten">
                        Saved <span className="text-moss font-bold">{promptCount}</span> prompts
                        <span className="mx-3">•</span>
                        <span className="text-moss font-bold">{nicheCount}</span> niche{nicheCount !== 1 ? 's' : ''} bloomed
                        <span className="mx-3">•</span>
                        <span className="text-moss font-bold">{brandCount}</span> brand{brandCount !== 1 ? 's' : ''}
                    </p>

                    {/* Motivational text */}
                    <p className="mt-6 text-lg text-wood opacity-80 font-body">
                        Your cottage awaits. Let's grow something beautiful together.
                    </p>
                </div>
            </motion.section>

            {/* CTA Buttons */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap justify-center gap-4"
            >
                {ctaButtons.map((btn, index) => (
                    <motion.div
                        key={btn.path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link
                            to={btn.path}
                            className="wood-cta-btn inline-block"
                        >
                            {btn.label}
                        </Link>
                    </motion.div>
                ))}
            </motion.section>

            {/* Footer nudge */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center pt-8"
            >
                <p className="text-amber/60 text-sm font-body">
                    🕯️ Light a candle, pour some tea, and let's build your digital garden 🌿
                </p>
            </motion.section>
        </motion.div>
    )
}

export default HomePage
