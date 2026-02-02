import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'
import usePuterAI from '../hooks/usePuterAI'
import { useSavedPrompts } from '../hooks/useDexieStorage'
import promptsData from '../data/prompts.json'

function PromptVaultPage() {
    // Tab state: 'vault' or 'saved'
    const [activeTab, setActiveTab] = useState('vault')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [savedSearchQuery, setSavedSearchQuery] = useState('')
    const [selectedPrompt, setSelectedPrompt] = useState(null)
    const [refinedPrompt, setRefinedPrompt] = useState(null)
    const [copiedId, setCopiedId] = useState(null)
    const [recentlySavedId, setRecentlySavedId] = useState(null)

    // Rename modal state
    const [renameModal, setRenameModal] = useState({ isOpen: false, prompt: null })
    const [newTitle, setNewTitle] = useState('')

    // Toast notification
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

    // Dexie.js persistent storage
    const { savedPrompts, savePrompt: savePromptToDB, removePrompt, updatePrompt, isSaved, isLoading: isLoadingPrompts } = useSavedPrompts()

    const { refinePrompt, isLoading } = usePuterAI()

    const categories = promptsData.categories

    // Filter vault prompts based on search and category
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

    // Filter saved prompts based on search
    const filteredSavedPrompts = useMemo(() => {
        if (!savedSearchQuery) return savedPrompts

        const query = savedSearchQuery.toLowerCase()
        return savedPrompts.filter(prompt =>
            prompt.title?.toLowerCase().includes(query) ||
            prompt.prompt?.toLowerCase().includes(query) ||
            prompt.category?.toLowerCase().includes(query) ||
            prompt.tags?.some(tag => tag.toLowerCase().includes(query))
        )
    }, [savedPrompts, savedSearchQuery])

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type })
    }

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
            // Trigger glow animation
            setRecentlySavedId(prompt.id)
            setTimeout(() => setRecentlySavedId(null), 1500)
            // Show toast
            showToast('🌿 Saved to your moss garden!')
        }
    }

    const handleRemovePrompt = async (promptId) => {
        const saved = savedPrompts.find(p => p.originalId === promptId || p.id === promptId)
        if (saved) {
            await removePrompt(saved.id)
            showToast('Removed from saved prompts', 'info')
        }
    }

    const handleDeleteSavedPrompt = async (id) => {
        await removePrompt(id)
        showToast('Prompt deleted', 'info')
    }

    const openRenameModal = (prompt) => {
        setRenameModal({ isOpen: true, prompt })
        setNewTitle(prompt.title || '')
    }

    const handleRename = async () => {
        if (renameModal.prompt && newTitle.trim()) {
            await updatePrompt(renameModal.prompt.id, { title: newTitle.trim() })
            setRenameModal({ isOpen: false, prompt: null })
            setNewTitle('')
            showToast('Prompt renamed! 🌸')
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
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center gap-2">
                <button
                    onClick={() => setActiveTab('vault')}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'vault'
                            ? 'bg-moss text-cream shadow-lg'
                            : 'bg-linen-light/50 dark:bg-bark/30 text-bark dark:text-linen hover:bg-moss/10'
                        }`}
                >
                    🔮 Vault
                    <Badge variant={activeTab === 'vault' ? 'linen' : 'moss'} className="text-xs">
                        {filteredPrompts.length}
                    </Badge>
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'saved'
                            ? 'bg-moss text-cream shadow-lg'
                            : 'bg-linen-light/50 dark:bg-bark/30 text-bark dark:text-linen hover:bg-moss/10'
                        }`}
                >
                    💚 Saved
                    <Badge variant={activeTab === 'saved' ? 'linen' : 'moss'} className="text-xs">
                        {savedPrompts.length}
                    </Badge>
                </button>
            </div>

            {/* Vault Tab Content */}
            {activeTab === 'vault' && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
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
                                            {/* Heart button with glow animation */}
                                            <motion.div
                                                animate={recentlySavedId === prompt.id ? {
                                                    scale: [1, 1.3, 1],
                                                    filter: ['drop-shadow(0 0 0px #8B9A46)', 'drop-shadow(0 0 12px #8B9A46)', 'drop-shadow(0 0 4px #8B9A46)']
                                                } : {}}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => isSaved(prompt.id) ? handleRemovePrompt(prompt.id) : handleSavePrompt(prompt)}
                                                    className={`transition-all ${isSaved(prompt.id) ? 'text-moss' : ''}`}
                                                >
                                                    {isSaved(prompt.id) ? '💚' : '🤍'}
                                                </Button>
                                            </motion.div>
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
                </motion.div>
            )}

            {/* Saved Tab Content */}
            {activeTab === 'saved' && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    {/* Saved Search Bar */}
                    <Card hover={false}>
                        <div className="relative">
                            <input
                                type="text"
                                value={savedSearchQuery}
                                onChange={(e) => setSavedSearchQuery(e.target.value)}
                                placeholder="Search your saved prompts..."
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
                            {savedSearchQuery && (
                                <button
                                    onClick={() => setSavedSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-bark/40 hover:text-bark"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </Card>

                    {/* Saved Prompts List */}
                    {filteredSavedPrompts.length > 0 ? (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {filteredSavedPrompts.map((prompt, index) => (
                                    <motion.div
                                        key={prompt.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ delay: index * 0.03 }}
                                    >
                                        <Card hover={false} className="group">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-handwritten text-bark dark:text-linen truncate">
                                                            {prompt.title}
                                                        </h3>
                                                        {prompt.category && (
                                                            <Badge variant="linen" className="text-xs flex-shrink-0">
                                                                {prompt.category}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-bark/70 dark:text-linen/70 line-clamp-2 mb-2">
                                                        {prompt.prompt}
                                                    </p>
                                                    {prompt.tags && prompt.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {prompt.tags.slice(0, 3).map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="text-xs px-2 py-0.5 bg-moss/10 text-moss rounded-full"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        size="sm"
                                                        variant={copiedId === prompt.id ? 'moss' : 'ghost'}
                                                        onClick={() => copyToClipboard(prompt)}
                                                        title="Copy prompt"
                                                    >
                                                        {copiedId === prompt.id ? '✓' : '📋'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => openRenameModal(prompt)}
                                                        title="Rename prompt"
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteSavedPrompt(prompt.id)}
                                                        title="Delete prompt"
                                                        className="hover:text-red-500"
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            {savedPrompts.length === 0 ? (
                                <>
                                    <span className="text-4xl block mb-4">🌱</span>
                                    <p className="text-bark/60 dark:text-linen/60 mb-2">
                                        Your moss garden is empty
                                    </p>
                                    <p className="text-sm text-bark/50 dark:text-linen/50">
                                        Save prompts from the Vault to grow your collection!
                                    </p>
                                    <Button
                                        onClick={() => setActiveTab('vault')}
                                        variant="moss"
                                        className="mt-4"
                                    >
                                        🔮 Browse Vault
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <span className="text-4xl block mb-4">🔍</span>
                                    <p className="text-bark/60 dark:text-linen/60">
                                        No saved prompts match "{savedSearchQuery}"
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </motion.div>
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

            {/* Rename Modal */}
            <Modal
                isOpen={renameModal.isOpen}
                onClose={() => {
                    setRenameModal({ isOpen: false, prompt: null })
                    setNewTitle('')
                }}
                title="✏️ Rename Prompt"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-bark/60 dark:text-linen/60 mb-2">
                            New title
                        </label>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Enter a new title..."
                            className="w-full p-3 rounded-xl border-2 border-moss/20 focus:border-moss bg-cream dark:bg-bark/30 text-bark dark:text-linen outline-none transition-colors"
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="linen"
                            onClick={() => {
                                setRenameModal({ isOpen: false, prompt: null })
                                setNewTitle('')
                            }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRename}
                            disabled={!newTitle.trim()}
                            className="flex-1"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Toast Notification */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </motion.div>
    )
}

export default PromptVaultPage
