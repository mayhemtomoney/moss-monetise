import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSavedPrompts, useSavedBrands } from '../hooks/useDexieStorage'

function HomePage() {
    const navigate = useNavigate()
    const { savedPrompts } = useSavedPrompts()
    const { savedBrands } = useSavedBrands()
    const [nicheCount, setNicheCount] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const savedNiche = localStorage.getItem('moss-niche-results')
        setNicheCount(savedNiche ? 1 : 0)
    }, [])

    const promptCount = savedPrompts?.length || 0
    const brandCount = savedBrands?.length || 0

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/prompt-vault?search=${encodeURIComponent(searchQuery)}`)
        }
    }

    const handleNewProject = () => {
        navigate('/niche-picker')
    }

    // Daily prompt - could be randomized
    const dailyPrompt = "Prompt to start namvto your prompt."

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* 3 Horizontal Stat Cards - 8px gap */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Saved Prompts */}
                <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300 py-4 px-6">
                    <div className="stat-title text-xs">Saved Prompts:</div>
                    <div className="stat-value text-3xl flex items-center gap-2">
                        <span className="text-base-content/40">📋</span>
                        <span>{promptCount}</span>
                    </div>
                </div>

                {/* Niches Bloomed */}
                <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300 py-4 px-6">
                    <div className="stat-title text-xs">Niches Bloomed:</div>
                    <div className="stat-value text-3xl flex items-center gap-2">
                        <span className="text-base-content/40">🌸</span>
                        <span>{nicheCount}</span>
                    </div>
                </div>

                {/* Brands Forged */}
                <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300 py-4 px-6">
                    <div className="stat-title text-xs">Brands Forged:</div>
                    <div className="stat-value text-3xl flex items-center gap-2">
                        <span className="text-base-content/40">🎨</span>
                        <span>{brandCount}</span>
                    </div>
                </div>
            </div>

            {/* Quick Start: Daily Prompt - 50vh height as per wireframe */}
            <div className="card bg-base-100 shadow-sm border border-base-300" style={{ minHeight: '40vh' }}>
                <div className="card-body">
                    <h2 className="card-title text-lg font-bold">Quick Start: Daily Prompt</h2>
                    <p className="text-base-content/70">{dailyPrompt}</p>

                    <div className="card-actions justify-end mt-auto">
                        <Link to="/prompt-vault" className="btn btn-primary btn-sm">
                            Get Inspired →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Utility Row: Search + New Project Button - 24px gap */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                {/* Search Input - 64px height as per wireframe */}
                <form onSubmit={handleSearch} className="join flex-1 max-w-md w-full">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered join-item w-full h-16"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-ghost join-item h-16">
                        🔍
                    </button>
                </form>

                {/* New Project Button */}
                <button
                    onClick={handleNewProject}
                    className="btn btn-neutral h-16 px-6"
                >
                    New Project +
                </button>
            </div>

            {/* Footer - 40px height as per wireframe */}
            <footer className="text-center py-4 text-base-content/50 text-sm">
                built for cozy creators
            </footer>
        </motion.div>
    )
}

export default HomePage
