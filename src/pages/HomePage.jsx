import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSavedPrompts, useSavedBrands } from '../hooks/useDexieStorage'

function HomePage() {
    const { savedPrompts } = useSavedPrompts()
    const { savedBrands } = useSavedBrands()
    const [nicheCount, setNicheCount] = useState(0)

    useEffect(() => {
        const savedNiche = localStorage.getItem('moss-niche-results')
        setNicheCount(savedNiche ? 1 : 0)
    }, [])

    const promptCount = savedPrompts?.length || 0
    const brandCount = savedBrands?.length || 0

    const ctaButtons = [
        { path: '/niche-picker', label: '🌿 Pick a Niche', color: 'btn-primary' },
        { path: '/prompt-vault', label: '📜 Open Prompt Vault', color: 'btn-secondary' },
        { path: '/branding-studio', label: '🎨 Forge a Brand', color: 'btn-accent' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 py-6"
        >
            {/* Stats Card */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center"
            >
                <div className="card bg-base-100 shadow-xl max-w-2xl w-full">
                    <div className="card-body text-center">
                        <h2 className="card-title text-3xl font-handwritten text-primary justify-center">
                            Your Cottage Garden
                        </h2>

                        {/* Stats */}
                        <div className="stats stats-vertical sm:stats-horizontal shadow mt-4">
                            <div className="stat">
                                <div className="stat-figure text-primary text-2xl">📜</div>
                                <div className="stat-title">Prompts</div>
                                <div className="stat-value text-primary">{promptCount}</div>
                                <div className="stat-desc">saved to vault</div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-secondary text-2xl">🌸</div>
                                <div className="stat-title">Niches</div>
                                <div className="stat-value text-secondary">{nicheCount}</div>
                                <div className="stat-desc">bloomed</div>
                            </div>

                            <div className="stat">
                                <div className="stat-figure text-accent text-2xl">🎨</div>
                                <div className="stat-title">Brands</div>
                                <div className="stat-value text-accent">{brandCount}</div>
                                <div className="stat-desc">created</div>
                            </div>
                        </div>

                        <p className="mt-4 text-base-content/70">
                            Your cottage awaits. Let's grow something beautiful together. 🌿
                        </p>
                    </div>
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
                        <Link to={btn.path} className={`btn ${btn.color} btn-lg`}>
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
                <p className="text-base-content/50 text-sm">
                    🕯️ Light a candle, pour some tea, and let's build your digital garden 🌿
                </p>
            </motion.section>
        </motion.div>
    )
}

export default HomePage
