import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import Timer from '../components/ui/Timer'
import Modal from '../components/ui/Modal'
import useLocalStorage from '../hooks/useLocalStorage'
import bizModules from '../data/biz-modules.json'

function BizBuilderPage() {
    const [currentModule, setCurrentModule] = useState(0)
    const [completedTasks, setCompletedTasks] = useLocalStorage('moss-biz-tasks', {})
    const [earnedBadges, setEarnedBadges] = useLocalStorage('moss-biz-badges', [])
    const [showBadgeModal, setShowBadgeModal] = useState(false)
    const [newBadge, setNewBadge] = useState(null)
    const [showTimer, setShowTimer] = useState(false)

    const modules = bizModules.modules
    const module = modules[currentModule]

    const getModuleProgress = (moduleId) => {
        const moduleTasks = completedTasks[moduleId] || []
        const totalTasks = modules.find(m => m.id === moduleId)?.checklist.length || 1
        return (moduleTasks.length / totalTasks) * 100
    }

    const getTotalPoints = () => {
        let total = 0
        Object.entries(completedTasks).forEach(([moduleId, tasks]) => {
            const moduleData = modules.find(m => m.id === moduleId)
            if (moduleData) {
                tasks.forEach(taskId => {
                    const task = moduleData.checklist.find(t => t.id === taskId)
                    if (task) total += task.points
                })
            }
        })
        return total
    }

    const toggleTask = (taskId, points) => {
        const moduleTasks = completedTasks[module.id] || []
        const isCompleted = moduleTasks.includes(taskId)

        let newTasks
        if (isCompleted) {
            newTasks = moduleTasks.filter(id => id !== taskId)
        } else {
            newTasks = [...moduleTasks, taskId]
        }

        setCompletedTasks(prev => ({
            ...prev,
            [module.id]: newTasks
        }))

        // Check for badge unlock
        if (!isCompleted && newTasks.length === module.checklist.length) {
            if (!earnedBadges.includes(module.id)) {
                setEarnedBadges(prev => [...prev, module.id])
                setNewBadge(module.badge)
                setShowBadgeModal(true)
            }
        }
    }

    const isTaskCompleted = (taskId) => {
        return (completedTasks[module.id] || []).includes(taskId)
    }

    const handleSwipe = (direction) => {
        if (direction === 'left' && currentModule < modules.length - 1) {
            setCurrentModule(prev => prev + 1)
        } else if (direction === 'right' && currentModule > 0) {
            setCurrentModule(prev => prev - 1)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto py-6 space-y-6"
        >
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-handwritten text-bark dark:text-linen mb-2">
                    🌿 Herb Garden Biz Builder
                </h1>
                <p className="text-bark/70 dark:text-linen/70">
                    Grow your business one task at a time
                </p>
                <Badge variant="moss" icon="🌟" className="mt-3">
                    {getTotalPoints()} Bloom Points
                </Badge>
            </div>

            {/* Module Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 px-1">
                {modules.map((m, index) => (
                    <button
                        key={m.id}
                        onClick={() => setCurrentModule(index)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${currentModule === index
                                ? 'bg-moss text-cream'
                                : 'bg-linen-light/50 dark:bg-bark/30 text-bark dark:text-linen hover:bg-moss/10'
                            }`}
                    >
                        <span className="mr-1">{m.icon}</span>
                        {m.title}
                    </button>
                ))}
            </div>

            {/* Current Module */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                >
                    <Card hover={false}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{module.icon}</span>
                            <div>
                                <h2 className="text-2xl font-handwritten text-bark dark:text-linen">
                                    {module.title}
                                </h2>
                                <p className="text-sm text-bark/60 dark:text-linen/60">
                                    {module.subtitle}
                                </p>
                            </div>
                        </div>

                        <ProgressBar
                            value={getModuleProgress(module.id)}
                            label="Module Progress"
                            className="mb-6"
                        />

                        {/* Checklist */}
                        <ul className="space-y-3">
                            {module.checklist.map((task) => (
                                <motion.li
                                    key={task.id}
                                    layout
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isTaskCompleted(task.id)
                                            ? 'bg-moss/10'
                                            : 'bg-linen-light/30 dark:bg-bark/20'
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleTask(task.id, task.points)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isTaskCompleted(task.id)
                                                ? 'bg-moss border-moss text-cream'
                                                : 'border-moss/40 hover:border-moss'
                                            }`}
                                    >
                                        {isTaskCompleted(task.id) && (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                    <span className={`flex-1 ${isTaskCompleted(task.id) ? 'line-through text-bark/50 dark:text-linen/50' : 'text-bark dark:text-linen'}`}>
                                        {task.task}
                                    </span>
                                    <Badge variant={isTaskCompleted(task.id) ? 'moss' : 'linen'} className="text-xs">
                                        +{task.points}
                                    </Badge>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Badge Preview */}
                        {earnedBadges.includes(module.id) && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="mt-6 text-center p-4 bg-petal/10 rounded-xl"
                            >
                                <span className="text-3xl">{module.badge.emoji}</span>
                                <p className="text-sm font-medium text-petal mt-1">
                                    {module.badge.name} Badge Earned!
                                </p>
                            </motion.div>
                        )}
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Swipe Indicators */}
            <div className="flex justify-center gap-2">
                {modules.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${currentModule === index ? 'bg-moss w-6' : 'bg-moss/30'
                            }`}
                    />
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <Button
                    onClick={() => handleSwipe('right')}
                    variant="linen"
                    disabled={currentModule === 0}
                >
                    ← Previous
                </Button>
                <Button onClick={() => setShowTimer(!showTimer)} variant="ghost">
                    {showTimer ? '🌿 Hide Timer' : '⏱️ Focus Timer'}
                </Button>
                <Button
                    onClick={() => handleSwipe('left')}
                    variant="linen"
                    disabled={currentModule === modules.length - 1}
                >
                    Next →
                </Button>
            </div>

            {/* Focus Timer */}
            {showTimer && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card hover={false}>
                        <Timer
                            initialMinutes={25}
                            onComplete={(mode) => {
                                if (mode === 'work') {
                                    // Could trigger a celebration
                                }
                            }}
                        />
                    </Card>
                </motion.div>
            )}

            {/* Earned Badges Display */}
            {earnedBadges.length > 0 && (
                <Card hover={false}>
                    <h3 className="text-lg font-handwritten text-bark dark:text-linen mb-3">
                        Your Bloom Badges
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {earnedBadges.map(badgeId => {
                            const badgeModule = modules.find(m => m.id === badgeId)
                            return badgeModule && (
                                <div key={badgeId} className="text-center">
                                    <span className="text-3xl">{badgeModule.badge.emoji}</span>
                                    <p className="text-xs text-bark/60 dark:text-linen/60 mt-1">
                                        {badgeModule.badge.name}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            )}

            {/* Badge Unlock Modal */}
            <Modal
                isOpen={showBadgeModal}
                onClose={() => setShowBadgeModal(false)}
                title="🎉 Badge Unlocked!"
            >
                {newBadge && (
                    <div className="text-center">
                        <motion.span
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 10 }}
                            className="text-6xl block mb-4"
                        >
                            {newBadge.emoji}
                        </motion.span>
                        <h3 className="text-2xl font-handwritten text-moss mb-2">
                            {newBadge.name}
                        </h3>
                        <p className="text-bark/70 dark:text-linen/70 mb-4">
                            You've completed all tasks in this module! Keep blooming! 🌸
                        </p>
                        <Button onClick={() => setShowBadgeModal(false)}>
                            Continue Growing
                        </Button>
                    </div>
                )}
            </Modal>
        </motion.div>
    )
}

export default BizBuilderPage
