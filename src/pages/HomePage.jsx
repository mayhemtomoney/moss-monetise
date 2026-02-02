import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import useLocalStorage from '../hooks/useLocalStorage'

const features = [
    {
        path: '/niche-picker',
        title: 'Wildflower Niche Picker',
        description: 'Discover your perfect digital product niche with our cozy 5-question quiz',
        icon: '🌸',
        color: 'from-petal to-berry',
    },
    {
        path: '/branding-studio',
        title: 'Thimble Branding Studio',
        description: 'Create beautiful moodboards and define your cottagecore brand identity',
        icon: '🎨',
        color: 'from-moss to-moss-deep',
    },
    {
        path: '/biz-builder',
        title: 'Herb Garden Biz Builder',
        description: 'Build your business step-by-step with gamified checklists and bloom badges',
        icon: '🌿',
        color: 'from-moss-light to-moss',
    },
    {
        path: '/product-forge',
        title: 'Pressed Flower Product Forge',
        description: 'Create stunning digital products with AI-powered templates',
        icon: '📜',
        color: 'from-linen to-linen-light',
    },
    {
        path: '/prompt-vault',
        title: 'Enchanted Prompt Vault',
        description: '100+ AI prompts to supercharge your content and product creation',
        icon: '🔮',
        color: 'from-berry to-petal',
    },
]

const dailyQuests = [
    { id: 'q1', task: 'Write 1 social media post', points: 10, icon: '✍️' },
    { id: 'q2', task: 'Spend 25 mins on product creation', points: 15, icon: '⏱️' },
    { id: 'q3', task: 'Save 3 prompts from the Vault', points: 5, icon: '💾' },
]

function HomePage() {
    const [completedQuests, setCompletedQuests] = useLocalStorage('moss-daily-quests', [])
    const [lastQuestReset, setLastQuestReset] = useLocalStorage('moss-quest-reset', null)
    const [totalPoints, setTotalPoints] = useLocalStorage('moss-total-points', 0)

    // Reset quests daily
    useEffect(() => {
        const today = new Date().toDateString()
        if (lastQuestReset !== today) {
            setCompletedQuests([])
            setLastQuestReset(today)
        }
    }, [lastQuestReset, setCompletedQuests, setLastQuestReset])

    const toggleQuest = (quest) => {
        if (completedQuests.includes(quest.id)) {
            setCompletedQuests(prev => prev.filter(id => id !== quest.id))
            setTotalPoints(prev => prev - quest.points)
        } else {
            setCompletedQuests(prev => [...prev, quest.id])
            setTotalPoints(prev => prev + quest.points)
        }
    }

    const questProgress = (completedQuests.length / dailyQuests.length) * 100

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 py-6"
        >
            {/* Hero Section */}
            <section className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-5xl md:text-6xl font-handwritten text-bark dark:text-linen-light">
                        Welcome to Your
                        <span className="block text-moss">Cozy Creator Cottage</span>
                    </h1>
                </motion.div>
                <p className="text-lg text-bark/70 dark:text-linen/70 max-w-xl mx-auto">
                    Build your AI-powered digital product empire, one peaceful step at a time 🌿
                </p>
                <div className="flex justify-center gap-3">
                    <Badge variant="moss" icon="🌱">
                        {totalPoints} Bloom Points
                    </Badge>
                </div>
            </section>

            {/* Daily Quests */}
            <section>
                <Card className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-handwritten text-bark dark:text-linen">
                            Today's Garden Quests
                        </h2>
                        <span className="text-sm text-moss">{completedQuests.length}/{dailyQuests.length}</span>
                    </div>

                    <ProgressBar value={questProgress} className="mb-4" showValue={false} />

                    <ul className="space-y-3">
                        {dailyQuests.map((quest) => (
                            <li key={quest.id}>
                                <button
                                    onClick={() => toggleQuest(quest)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${completedQuests.includes(quest.id)
                                            ? 'bg-moss/10 line-through text-bark/50 dark:text-linen/50'
                                            : 'hover:bg-linen-light/50 dark:hover:bg-bark/30'
                                        }`}
                                >
                                    <span className="text-xl">{quest.icon}</span>
                                    <span className="flex-1 text-left text-bark dark:text-linen">{quest.task}</span>
                                    <Badge variant={completedQuests.includes(quest.id) ? 'moss' : 'linen'} className="text-xs">
                                        +{quest.points}
                                    </Badge>
                                </button>
                            </li>
                        ))}
                    </ul>
                </Card>
            </section>

            {/* Feature Grid */}
            <section>
                <h2 className="text-3xl font-handwritten text-center text-bark dark:text-linen mb-6">
                    Explore Your Cottage
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.path}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={feature.path}>
                                <Card className="h-full group">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-handwritten text-bark dark:text-linen mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-bark/70 dark:text-linen/70">
                                        {feature.description}
                                    </p>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Motivational Quote */}
            <section className="text-center py-8">
                <blockquote className="max-w-lg mx-auto">
                    <p className="text-2xl font-elegant italic text-bark/80 dark:text-linen/80">
                        "Every wildflower started as a tiny seed. Your digital garden is already growing."
                    </p>
                    <footer className="mt-3 text-moss text-sm">— Your Cottage Companion</footer>
                </blockquote>
            </section>
        </motion.div>
    )
}

export default HomePage
