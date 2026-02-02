import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import usePuterAI from '../hooks/usePuterAI'
import useLocalStorage from '../hooks/useLocalStorage'
import quizData from '../data/quiz-questions.json'

function NichePickerPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)
    const [suggestions, setSuggestions] = useState(null)
    const [savedNiches, setSavedNiches] = useLocalStorage('moss-saved-niches', [])
    const [showSaveModal, setShowSaveModal] = useState(false)

    const { generateNicheSuggestions, isLoading, error } = usePuterAI()

    const questions = quizData.questions
    const isComplete = currentQuestion >= questions.length
    const progress = (currentQuestion / questions.length) * 100

    const handleAnswer = (option) => {
        const question = questions[currentQuestion]
        setAnswers(prev => ({
            ...prev,
            [question.id]: option
        }))

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1)
        } else {
            generateResults({ ...answers, [question.id]: option })
        }
    }

    const generateResults = async (finalAnswers) => {
        setShowResults(true)

        // Map answers to readable format
        const answerSummary = {
            interests: Object.values(finalAnswers)[0]?.label || 'various interests',
            skills: Object.values(finalAnswers)[1]?.label || 'diverse skills',
            time: Object.values(finalAnswers)[2]?.label || 'flexible time',
            audience: Object.values(finalAnswers)[3]?.label || 'general audience',
            aesthetic: Object.values(finalAnswers)[4]?.label || 'beautiful aesthetics'
        }

        try {
            const response = await generateNicheSuggestions(answerSummary)
            // Try to parse JSON from response
            const jsonMatch = response.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                setSuggestions(JSON.parse(jsonMatch[0]))
            } else {
                setSuggestions([{
                    name: "Cozy Digital Products",
                    products: ["Planners", "Journals", "Templates"],
                    persona: "Creative souls seeking organization",
                    fit: response
                }])
            }
        } catch (err) {
            console.error('AI generation error:', err)
            // Fallback suggestions
            setSuggestions([
                {
                    name: "Botanical Planning Paradise",
                    products: ["Digital garden planners", "Seed tracking journals", "Seasonal meal planners"],
                    persona: "Home gardeners & nature lovers seeking organization",
                    fit: "Perfect for your botanical aesthetic and teaching passion"
                },
                {
                    name: "Cozy Content Creator Kit",
                    products: ["Social media templates", "Caption prompt cards", "Brand style guides"],
                    persona: "Fellow creators building their online presence",
                    fit: "Matches your creative skills and time availability"
                },
                {
                    name: "Mindful Mum Essentials",
                    products: ["Self-care journals", "Family routine planners", "Gratitude workbooks"],
                    persona: "Busy mums craving calm and organization",
                    fit: "Connects with new mums seeking peaceful solutions"
                }
            ])
        }
    }

    const saveNiche = (niche) => {
        setSavedNiches(prev => [...prev, { ...niche, savedAt: new Date().toISOString() }])
        setShowSaveModal(true)
    }

    const restartQuiz = () => {
        setCurrentQuestion(0)
        setAnswers({})
        setShowResults(false)
        setSuggestions(null)
    }

    const exportToPdf = async () => {
        // Dynamic import for code splitting
        const html2canvas = (await import('html2canvas')).default
        const jsPDF = (await import('jspdf')).default

        const element = document.getElementById('niche-results')
        if (!element) return

        const canvas = await html2canvas(element, {
            backgroundColor: '#FDF8F0',
            scale: 2
        })
        const imgData = canvas.toDataURL('image/png')

        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgWidth = 190
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
        pdf.save('my-cottagecore-niches.pdf')
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
                    🌸 Wildflower Niche Picker
                </h1>
                <p className="text-bark/70 dark:text-linen/70">
                    Discover your perfect digital product niche in 5 cozy questions
                </p>
            </div>

            {/* Progress */}
            {!showResults && (
                <div className="glass-card p-4">
                    <div className="flex justify-between text-sm text-bark/60 dark:text-linen/60 mb-2">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
                    <div className="h-2 bg-linen-light dark:bg-bark/30 rounded-full">
                        <motion.div
                            className="h-full bg-gradient-to-r from-petal to-berry rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Question Card */}
            <AnimatePresence mode="wait">
                {!showResults && currentQuestion < questions.length && (
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                    >
                        <Card hover={false}>
                            <h2 className="text-2xl font-handwritten text-bark dark:text-linen mb-6 text-center">
                                {questions[currentQuestion].question}
                            </h2>

                            <div className="grid gap-3">
                                {questions[currentQuestion].options.map((option) => (
                                    <motion.button
                                        key={option.value}
                                        onClick={() => handleAnswer(option)}
                                        className="w-full p-4 text-left rounded-xl border-2 border-moss/20 hover:border-moss hover:bg-moss/5 transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="text-lg">{option.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            {showResults && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="niche-results"
                    className="space-y-6"
                >
                    <Card hover={false}>
                        <div className="text-center mb-6">
                            <span className="text-4xl">🌻</span>
                            <h2 className="text-3xl font-handwritten text-bark dark:text-linen mt-2">
                                Your Niche Garden
                            </h2>
                            <p className="text-bark/60 dark:text-linen/60">
                                AI-curated suggestions based on your unique blend
                            </p>
                        </div>

                        {isLoading && (
                            <div className="text-center py-8">
                                <div className="animate-spin w-8 h-8 border-4 border-moss border-t-transparent rounded-full mx-auto mb-4" />
                                <p className="text-bark/60 dark:text-linen/60">Growing your niche suggestions...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-4 text-berry">
                                <p>Oops! Something went wrong. Using curated suggestions instead.</p>
                            </div>
                        )}

                        {suggestions && (
                            <div className="space-y-4">
                                {suggestions.map((niche, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="p-5 bg-linen-light/50 dark:bg-bark/30 rounded-2xl"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-handwritten text-moss-deep dark:text-moss-light">
                                                {niche.name}
                                            </h3>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => saveNiche(niche)}
                                            >
                                                💾 Save
                                            </Button>
                                        </div>

                                        <div className="mb-3">
                                            <span className="text-sm font-medium text-bark/60 dark:text-linen/60">Product Ideas:</span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {(Array.isArray(niche.products) ? niche.products : [niche.products]).map((product, i) => (
                                                    <Badge key={i} variant="linen">{product}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-sm text-bark/70 dark:text-linen/70 mb-2">
                                            <strong>Target:</strong> {niche.persona}
                                        </p>
                                        <p className="text-sm text-moss italic">
                                            ✨ {niche.fit}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button onClick={exportToPdf} variant="moss">
                            📄 Export as PDF
                        </Button>
                        <Button onClick={restartQuiz} variant="linen">
                            🔄 Retake Quiz
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Save Confirmation Modal */}
            <Modal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                title="Niche Saved! 🌱"
            >
                <p className="mb-4">
                    Your niche has been saved to your collection. You can find it in your saved items anytime!
                </p>
                <div className="text-center">
                    <Button onClick={() => setShowSaveModal(false)}>
                        Continue Exploring
                    </Button>
                </div>
            </Modal>
        </motion.div>
    )
}

export default NichePickerPage
