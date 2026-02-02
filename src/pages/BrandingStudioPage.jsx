import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import usePuterAI from '../hooks/usePuterAI'
import { useSavedBrands } from '../hooks/useDexieStorage'

const defaultElements = [
    { id: 'color1', type: 'color', value: '#8B9A46', label: 'Moss Green' },
    { id: 'color2', type: 'color', value: '#D2B48C', label: 'Linen' },
    { id: 'color3', type: 'color', value: '#E8A4B0', label: 'Petal Pink' },
    { id: 'color4', type: 'color', value: '#5D4E37', label: 'Bark Brown' },
    { id: 'texture1', type: 'texture', value: 'linen', emoji: '🧵' },
    { id: 'texture2', type: 'texture', value: 'botanical', emoji: '🌿' },
    { id: 'texture3', type: 'texture', value: 'vintage', emoji: '📜' },
    { id: 'font1', type: 'font', value: 'Caveat', label: 'Handwritten' },
    { id: 'font2', type: 'font', value: 'Playfair Display', label: 'Elegant' },
    { id: 'font3', type: 'font', value: 'Inter', label: 'Modern' },
]

const vibePresets = [
    { name: 'Rustic Farmhouse', adjectives: ['warm', 'homey', 'natural', 'heritage', 'grounded'] },
    { name: 'Botanical Garden', adjectives: ['fresh', 'verdant', 'growth', 'serene', 'organic'] },
    { name: 'Vintage Charm', adjectives: ['nostalgic', 'romantic', 'timeless', 'delicate', 'treasured'] },
    { name: 'Fairy Cottage', adjectives: ['whimsical', 'magical', 'enchanting', 'dreamy', 'mystical'] },
]

function SortableItem({ element }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
        >
            {element.type === 'color' && (
                <div className="w-16 h-16 rounded-xl shadow-md" style={{ backgroundColor: element.value }}>
                    <span className="sr-only">{element.label}</span>
                </div>
            )}
            {element.type === 'texture' && (
                <div className="w-16 h-16 rounded-xl bg-linen-light dark:bg-bark/50 flex items-center justify-center text-2xl shadow-md">
                    {element.emoji}
                </div>
            )}
            {element.type === 'font' && (
                <div
                    className="w-16 h-16 rounded-xl bg-cream dark:bg-bark/50 flex items-center justify-center shadow-md"
                    style={{ fontFamily: element.value }}
                >
                    <span className="text-xl text-bark dark:text-linen">Aa</span>
                </div>
            )}
        </div>
    )
}

function BrandingStudioPage() {
    const [elements, setElements] = useState(defaultElements)
    const [brandName, setBrandName] = useState('')
    const [selectedVibe, setSelectedVibe] = useState(null)
    const [aiMoodboard, setAiMoodboard] = useState(null)
    const [showExportModal, setShowExportModal] = useState(false)

    // Dexie.js persistent storage
    const { savedBrands, saveBrand: saveBrandToDB, removeBrand, isLoading: isLoadingBrands } = useSavedBrands()

    const { generateMoodboard, isLoading } = usePuterAI()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    )

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            setElements((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id)
                const newIndex = items.findIndex(i => i.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const generateAIMoodboard = async () => {
        if (!brandName && !selectedVibe) return

        const vibeDescription = selectedVibe
            ? `${selectedVibe.name} style with ${selectedVibe.adjectives.join(', ')} vibes`
            : brandName

        try {
            const response = await generateMoodboard(vibeDescription)
            // Try to parse JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                setAiMoodboard(JSON.parse(jsonMatch[0]))
            } else {
                setAiMoodboard({
                    colors: ['#8B9A46', '#D2B48C', '#E8A4B0', '#5D4E37', '#FDF8F0'],
                    fonts: ['Caveat for headers', 'Inter for body text'],
                    textures: ['Linen', 'Pressed flowers', 'Vintage paper'],
                    imagery: ['Wildflowers', 'Cozy interiors', 'Handmade items'],
                    adjectives: ['Cozy', 'Authentic', 'Gentle', 'Creative', 'Nurturing']
                })
            }
        } catch (err) {
            // Fallback
            setAiMoodboard({
                colors: ['#8B9A46', '#D2B48C', '#E8A4B0', '#5D4E37', '#FDF8F0'],
                fonts: ['Caveat for headers', 'Inter for body text'],
                textures: ['Linen', 'Pressed flowers', 'Vintage paper'],
                imagery: ['Wildflowers', 'Cozy interiors', 'Handmade items'],
                adjectives: ['Cozy', 'Authentic', 'Gentle', 'Creative', 'Nurturing']
            })
        }
    }

    const saveBrand = async () => {
        const brand = {
            name: brandName || 'Untitled Brand',
            vibe: selectedVibe?.name,
            moodboard: elements.slice(0, 6),
            palette: aiMoodboard?.colors || [],
            aiMoodboard
        }
        await saveBrandToDB(brand)
        setShowExportModal(true)
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
                    🎨 Thimble Branding Studio
                </h1>
                <p className="text-bark/70 dark:text-linen/70">
                    Create your cottagecore brand identity with drag-drop moodboards
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Brand Setup */}
                <div className="space-y-6">
                    {/* Brand Name Input */}
                    <Card hover={false}>
                        <label className="block text-lg font-handwritten text-bark dark:text-linen mb-3">
                            What's your brand called?
                        </label>
                        <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="e.g., Mossy Meadow Creations"
                            className="w-full p-3 rounded-xl border-2 border-moss/20 focus:border-moss bg-cream dark:bg-bark/30 text-bark dark:text-linen outline-none transition-colors"
                        />
                    </Card>

                    {/* Vibe Presets */}
                    <Card hover={false}>
                        <h3 className="text-lg font-handwritten text-bark dark:text-linen mb-3">
                            Choose your vibe
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {vibePresets.map((vibe) => (
                                <button
                                    key={vibe.name}
                                    onClick={() => setSelectedVibe(vibe)}
                                    className={`p-3 rounded-xl text-left transition-all ${selectedVibe?.name === vibe.name
                                        ? 'bg-moss text-cream'
                                        : 'bg-linen-light/50 dark:bg-bark/30 hover:bg-moss/10'
                                        }`}
                                >
                                    <span className="font-medium text-sm">{vibe.name}</span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* AI Generate Button */}
                    <Button
                        onClick={generateAIMoodboard}
                        loading={isLoading}
                        className="w-full"
                        disabled={!brandName && !selectedVibe}
                    >
                        ✨ Generate AI Moodboard
                    </Button>
                </div>

                {/* Right Column - Moodboard Canvas */}
                <div className="space-y-6">
                    <Card hover={false}>
                        <h3 className="text-lg font-handwritten text-bark dark:text-linen mb-3">
                            Your Moodboard Canvas
                        </h3>
                        <p className="text-sm text-bark/60 dark:text-linen/60 mb-4">
                            Drag and drop to rearrange elements
                        </p>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={elements} strategy={rectSortingStrategy}>
                                <div className="grid grid-cols-5 gap-2 p-4 bg-linen-light/30 dark:bg-bark/20 rounded-xl min-h-[200px]">
                                    {elements.map((element) => (
                                        <SortableItem key={element.id} element={element} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </Card>

                    {/* AI Generated Moodboard */}
                    {aiMoodboard && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card hover={false}>
                                <h3 className="text-lg font-handwritten text-moss-deep dark:text-moss-light mb-4">
                                    ✨ AI-Generated Moodboard
                                </h3>

                                {/* Colors */}
                                <div className="mb-4">
                                    <span className="text-sm font-medium text-bark/60 dark:text-linen/60">Colors</span>
                                    <div className="flex gap-2 mt-2">
                                        {(aiMoodboard.colors || []).map((color, i) => (
                                            <div
                                                key={i}
                                                className="w-10 h-10 rounded-lg shadow-sm"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Adjectives */}
                                <div className="mb-4">
                                    <span className="text-sm font-medium text-bark/60 dark:text-linen/60">Brand Adjectives</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(aiMoodboard.adjectives || []).map((adj, i) => (
                                            <span key={i} className="px-3 py-1 bg-moss/10 text-moss rounded-full text-sm">
                                                {adj}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Imagery */}
                                <div>
                                    <span className="text-sm font-medium text-bark/60 dark:text-linen/60">Imagery Themes</span>
                                    <p className="mt-1 text-bark dark:text-linen">
                                        {(aiMoodboard.imagery || []).join(' • ')}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Save Button */}
                    <Button onClick={saveBrand} variant="moss" className="w-full">
                        💾 Save Brand Kit
                    </Button>
                </div>
            </div>

            {/* Saved Brands */}
            {savedBrands.length > 0 && (
                <Card hover={false}>
                    <h3 className="text-lg font-handwritten text-bark dark:text-linen mb-3">
                        Your Saved Brands
                    </h3>
                    <div className="grid gap-2">
                        {savedBrands.map((brand, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-linen-light/30 dark:bg-bark/20 rounded-xl">
                                <span className="font-medium text-bark dark:text-linen">{brand.name}</span>
                                <span className="text-sm text-bark/60 dark:text-linen/60">{brand.vibe || 'Custom'}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Export Modal */}
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Brand Kit Saved! 🎨"
            >
                <p className="mb-4">
                    Your brand kit has been saved! You can access it anytime from the studio.
                </p>
                <Button onClick={() => setShowExportModal(false)}>
                    Continue Creating
                </Button>
            </Modal>
        </motion.div>
    )
}

export default BrandingStudioPage
