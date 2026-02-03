import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import useTransformersAI from '../hooks/useTransformersAI'
import useLocalStorage from '../hooks/useLocalStorage'
import quizData from '../data/quiz-questions.json'

function NichePickerPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)
    const [suggestions, setSuggestions] = useState(null)
    const [savedNiches, setSavedNiches] = useLocalStorage('moss-saved-niches', [])
    const [showSaveModal, setShowSaveModal] = useState(false)

    const { generateNicheSuggestions, isLoading, error } = useTransformersAI()

    const questions = quizData.questions
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

        const answerSummary = {
            interests: Object.values(finalAnswers)[0]?.label || 'various interests',
            skills: Object.values(finalAnswers)[1]?.label || 'diverse skills',
            time: Object.values(finalAnswers)[2]?.label || 'flexible time',
            audience: Object.values(finalAnswers)[3]?.label || 'general audience',
            aesthetic: Object.values(finalAnswers)[4]?.label || 'beautiful aesthetics'
        }

        try {
            const response = await generateNicheSuggestions(answerSummary)
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
        localStorage.setItem('moss-niche-results', JSON.stringify(niche))
        setShowSaveModal(true)
    }

    const restartQuiz = () => {
        setCurrentQuestion(0)
        setAnswers({})
        setShowResults(false)
        setSuggestions(null)
    }

    const exportToPdf = async () => {
        const html2canvas = (await import('html2canvas')).default
        const jsPDF = (await import('jspdf')).default

        const element = document.getElementById('niche-results')
        if (!element) return

        const canvas = await html2canvas(element, {
            backgroundColor: '#fff',
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
                <h2 className="text-4xl font-handwritten text-primary mb-2">
                    🌸 Wildflower Niche Picker
                </h2>
                <p className="text-base-content/70">
                    Discover your perfect digital product niche in 5 cozy questions
                </p>
            </div>

            {/* Progress */}
            {!showResults && (
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <div className="flex justify-between text-sm text-base-content/60 mb-2">
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <span>{Math.round(progress)}% complete</span>
                        </div>
                        <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
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
                            <h3 className="text-2xl font-handwritten text-primary text-center mb-6">
                                {questions[currentQuestion].question}
                            </h3>

                            <div className="grid gap-3">
                                {questions[currentQuestion].options.map((option) => (
                                    <motion.button
                                        key={option.value}
                                        onClick={() => handleAnswer(option)}
                                        className="btn btn-outline btn-primary justify-start text-left h-auto py-4"
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
                            <h2 className="text-3xl font-handwritten text-primary mt-2">
                                Your Niche Garden
                            </h2>
                            <p className="text-base-content/60">
                                AI-curated suggestions based on your unique blend
                            </p>
                        </div>

                        {isLoading && (
                            <div className="text-center py-8">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <p className="text-base-content/60 mt-4">Growing your niche suggestions...</p>
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
                                        className="card bg-base-200"
                                    >
                                        <div className="card-body">
                                            <div className="flex items-start justify-between">
                                                <h3 className="card-title text-xl font-handwritten text-secondary">
                                                    {niche.name}
                                                </h3>
                                                <button
                                                    onClick={() => saveNiche(niche)}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    💾 Save
                                                </button>
                                            </div>

                                            <div className="mb-2">
                                                <span className="text-sm font-medium text-base-content/60">Product Ideas:</span>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {(Array.isArray(niche.products) ? niche.products : [niche.products]).map((product, i) => (
                                                        <Badge key={i} variant="secondary">{product}</Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-sm text-base-content/70">
                                                <strong>Target:</strong> {niche.persona}
                                            </p>
                                            <p className="text-sm text-success italic">
                                                ✨ {niche.fit}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button onClick={exportToPdf} variant="primary">
                            📄 Export as PDF
                        </Button>
                        <Button onClick={restartQuiz} variant="secondary">
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
