import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import usePuterAI from '../hooks/usePuterAI'
import { useSavedPrompts } from '../hooks/useDexieStorage'
import promptsData from '../data/prompts.json'

function PromptVaultPage() {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedPrompt, setSelectedPrompt] = useState(null)
    const [refinedPrompt, setRefinedPrompt] = useState(null)
    const [copiedId, setCopiedId] = useState(null)

    // Dexie.js persistent storage
    const { savedPrompts, savePrompt: savePromptToDB, removePrompt, isSaved, isLoading: isLoadingPrompts } = useSavedPrompts()

    const { refinePrompt, isLoading } = usePuterAI()

    const categories = promptsData.categories

    // Filter prompts based on search and category
    const filteredPrompts = useMemo(() => {
        let allPrompts = []

        const categoriesToSearch = selectedCategory
            ? categories.filter(c => c.id === selectedCategory)
            : categories

        categoriesToSearch.forEach(category => {
            category.prompts.forEach(prompt => {
                allPrompts.push({
                    ...prompt,
                    categoryId: category.id,
                    categoryName: category.name,
                    categoryIcon: category.icon
                })
            })
        })

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            allPrompts = allPrompts.filter(prompt =>
                prompt.title.toLowerCase().includes(query) ||
                prompt.prompt.toLowerCase().includes(query) ||
                prompt.tags.some(tag => tag.toLowerCase().includes(query))
            )
        }

        return allPrompts
    }, [selectedCategory, searchQuery, categories])

    const copyToClipboard = async (prompt) => {
        try {
            await navigator.clipboard.writeText(prompt.prompt)
            setCopiedId(prompt.id)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleRefinePrompt = async () => {
        if (!selectedPrompt) return

        try {
            const response = await refinePrompt(selectedPrompt.prompt, 'cottagecore')
            setRefinedPrompt(response)
        } catch (err) {
            setRefinedPrompt(selectedPrompt.prompt + '\n\n[Enhanced with cottagecore warmth and natural imagery]')
        }
    }

    const handleSavePrompt = async (prompt) => {
        if (!isSaved(prompt.id)) {
            await savePromptToDB({
                ...prompt,
                originalId: prompt.id,
                category: prompt.categoryId
            })
        }
    }

    const handleRemovePrompt = async (promptId) => {
        const saved = savedPrompts.find(p => p.originalId === promptId || p.id === promptId)
        if (saved) {
            await removePrompt(saved.id)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto py-6 space-y-6"
        >
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-handwritten text-bark dark:text-linen mb-2">
                    🔮 Enchanted Prompt Vault
                </h1>
                <p className="text-bark/70 dark:text-linen/70">
                    100+ AI prompts to supercharge your content creation
                </p>
                <Badge variant="moss" className="mt-2">
                    {savedPrompts.length} saved prompts
                </Badge>
            </div>

            {/* Search Bar */}
            <Card hover={false}>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search prompts by keyword, tag, or topic..."
                        className="w-full p-4 pl-12 rounded-xl border-2 border-moss/20 focus:border-moss bg-cream dark:bg-bark/30 text-bark dark:text-linen outline-none transition-colors"
                    />
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bark/40"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </Card>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory
                        ? 'bg-moss text-cream'
                        : 'bg-linen-light/50 dark:bg-bark/30 text-bark dark:text-linen hover:bg-moss/10'
                        }`}
                >
                    ✨ All
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id
                            ? 'bg-moss text-cream'
                            : 'bg-linen-light/50 dark:bg-bark/30 text-bark dark:text-linen hover:bg-moss/10'
                            }`}
                    >
                        {category.icon} {category.name}
                    </button>
                ))}
            </div>

            {/* Prompts Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {filteredPrompts.map((prompt, index) => (
                        <motion.div
                            key={prompt.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.02 }}
                        >
                            <Card className="h-full">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-handwritten text-bark dark:text-linen">
                                        {prompt.title}
                                    </h3>
                                    <span className="text-lg">{prompt.categoryIcon}</span>
                                </div>

                                <p className="text-sm text-bark/70 dark:text-linen/70 mb-3 line-clamp-3">
                                    {prompt.prompt}
                                </p>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {prompt.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs px-2 py-0.5 bg-moss/10 text-moss rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant={copiedId === prompt.id ? 'moss' : 'linen'}
                                        onClick={() => copyToClipboard(prompt)}
                                    >
                                        {copiedId === prompt.id ? '✓ Copied!' : '📋 Copy'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setSelectedPrompt(prompt)}
                                    >
                                        ✨ Refine
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => isSaved(prompt.id) ? handleRemovePrompt(prompt.id) : handleSavePrompt(prompt)}
                                    >
                                        {isSaved(prompt.id) ? '💚' : '🤍'}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredPrompts.length === 0 && (
                <div className="text-center py-12">
                    <span className="text-4xl block mb-4">🔍</span>
                    <p className="text-bark/60 dark:text-linen/60">
                        No prompts found. Try a different search term.
                    </p>
                </div>
            )}

            {/* Saved Prompts Quick Access */}
            {savedPrompts.length > 0 && !selectedCategory && !searchQuery && (
                <Card hover={false}>
                    <h3 className="text-lg font-handwritten text-bark dark:text-linen mb-3">
                        💚 Your Saved Prompts
                    </h3>
                    <div className="grid gap-2">
                        {savedPrompts.slice(0, 5).map((prompt) => (
                            <div
                                key={prompt.id}
                                className="flex items-center justify-between p-3 bg-linen-light/30 dark:bg-bark/20 rounded-xl"
                            >
                                <span className="font-medium text-bark dark:text-linen text-sm">
                                    {prompt.title}
                                </span>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(prompt)}>
                                        📋
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => removePrompt(prompt.id)}>
                                        ✕
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Refine Modal */}
            <Modal
                isOpen={!!selectedPrompt}
                onClose={() => {
                    setSelectedPrompt(null)
                    setRefinedPrompt(null)
                }}
                title="✨ AI Prompt Refiner"
            >
                {selectedPrompt && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-bark/60 dark:text-linen/60 mb-1">
                                Original Prompt
                            </label>
                            <p className="text-bark dark:text-linen bg-linen-light/30 dark:bg-bark/20 p-3 rounded-xl text-sm">
                                {selectedPrompt.prompt}
                            </p>
                        </div>

                        {!refinedPrompt && (
                            <Button
                                onClick={handleRefinePrompt}
                                loading={isLoading}
                                className="w-full"
                            >
                                ✨ Refine with AI
                            </Button>
                        )}

                        {refinedPrompt && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <label className="block text-sm font-medium text-moss mb-1">
                                    Refined Prompt
                                </label>
                                <p className="text-bark dark:text-linen bg-moss/10 p-3 rounded-xl text-sm mb-3">
                                    {refinedPrompt}
                                </p>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(refinedPrompt)
                                        setSelectedPrompt(null)
                                        setRefinedPrompt(null)
                                    }}
                                    className="w-full"
                                >
                                    📋 Copy Refined Prompt
                                </Button>
                            </motion.div>
                        )}
                    </div>
                )}
            </Modal>
        </motion.div>
    )
}

export default PromptVaultPage
