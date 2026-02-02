import { useState, useCallback, useRef } from 'react'
import { pipeline, env } from '@xenova/transformers'

// Configure transformers.js for browser
env.allowLocalModels = false
env.backends.onnx.wasm.numThreads = 1

// Model cache to avoid reloading
const modelCache = {}
const CACHE_STATUS = { loading: {}, loaded: {} }

// Static fallback data for slow devices
const FALLBACK_NICHES = [
    {
        name: "Cozy Printable Planners",
        products: ["Daily gratitude journals", "Meal planning templates", "Garden planners"],
        persona: "Busy mums seeking calm organisation",
        fit: "Combines your love of cozy aesthetics with practical digital products"
    },
    {
        name: "Cottagecore Clipart Shop",
        products: ["Botanical illustrations", "Vintage frames", "Handwritten fonts"],
        persona: "Small business owners and crafters",
        fit: "Your artistic skills create evergreen digital assets"
    },
    {
        name: "Mindful Digital Courses",
        products: ["Slow living workshops", "Creative journaling guides", "Nature photography tips"],
        persona: "Creative souls seeking intentional living",
        fit: "Share your expertise in bite-sized, cozy formats"
    }
]

const FALLBACK_MOODBOARD = {
    colors: ['#8B9A46', '#D2B48C', '#E8A4B0', '#5D4E37', '#FDF8F0'],
    fonts: ['Caveat for headers', 'Inter for body text', 'Playfair Display for accents'],
    textures: ['Linen fabric', 'Pressed flowers', 'Vintage paper', 'Watercolor washes'],
    imagery: ['Wildflowers', 'Cozy reading nooks', 'Handmade pottery', 'Morning tea'],
    adjectives: ['Cozy', 'Authentic', 'Gentle', 'Nurturing', 'Whimsical']
}

const FALLBACK_DESCRIPTIONS = {
    planner: "A gentle companion for your daily journey, crafted with love and linen textures. This cozy planner invites you to slow down, breathe, and embrace intentional living.",
    ebook: "Wrapped in warmth like a favourite blanket, this digital guide whispers wisdom through beautifully designed pages. Perfect for quiet afternoons and mindful moments.",
    course: "Step into a virtual cottage classroom where learning feels like sharing tea with a dear friend. Gentle lessons that nurture your creative spirit.",
    template: "Like finding pressed flowers in an old book, these templates bring vintage charm to your digital creations. Simple, beautiful, and ready to bloom."
}

/**
 * Custom hook for Transformers.js AI integration
 * Runs locally in browser, caches models, works offline after first load
 */
export function useTransformersAI() {
    const [isLoading, setIsLoading] = useState(false)
    const [modelProgress, setModelProgress] = useState(0)
    const [error, setError] = useState(null)
    const timeoutRef = useRef(null)

    // Get pipeline from Transformers.js
    const getPipeline = useCallback(async (task, model) => {
        const cacheKey = `${task}-${model}`

        // Return cached model
        if (modelCache[cacheKey]) {
            return modelCache[cacheKey]
        }

        // Check if already loading
        if (CACHE_STATUS.loading[cacheKey]) {
            // Wait for existing load
            while (CACHE_STATUS.loading[cacheKey]) {
                await new Promise(r => setTimeout(r, 100))
            }
            return modelCache[cacheKey]
        }

        CACHE_STATUS.loading[cacheKey] = true

        try {
            const pipe = await pipeline(task, model, {
                progress_callback: (progress) => {
                    if (progress.status === 'progress') {
                        setModelProgress(Math.round(progress.progress || 0))
                    }
                }
            })

            modelCache[cacheKey] = pipe
            CACHE_STATUS.loaded[cacheKey] = true
            return pipe
        } finally {
            CACHE_STATUS.loading[cacheKey] = false
        }
    }, [])

    // Generate text with timeout and fallback
    const generateWithFallback = useCallback(async (generator, fallback, timeoutMs = 10000) => {
        return new Promise(async (resolve) => {
            // Set timeout for fallback
            timeoutRef.current = setTimeout(() => {
                console.log('AI generation timeout, using fallback')
                resolve(fallback)
            }, timeoutMs)

            try {
                const result = await generator()
                clearTimeout(timeoutRef.current)
                resolve(result)
            } catch (err) {
                clearTimeout(timeoutRef.current)
                console.error('AI generation failed, using fallback:', err)
                resolve(fallback)
            }
        })
    }, [])

    const generateNicheSuggestions = useCallback(async (answers) => {
        setIsLoading(true)
        setError(null)
        setModelProgress(0)

        try {
            const result = await generateWithFallback(async () => {
                const pipe = await getPipeline('text-generation', 'Xenova/distilgpt2')

                const prompt = `Cottagecore niche for ${answers.interests}: `
                const output = await pipe(prompt, {
                    max_new_tokens: 50,
                    temperature: 0.8,
                    do_sample: true
                })

                // Parse and enhance the basic output
                const generated = output[0]?.generated_text || ''

                // Create structured response based on generated text
                return FALLBACK_NICHES.map((niche, i) => ({
                    ...niche,
                    name: i === 0 && generated.length > 20
                        ? generated.split('\n')[0].replace(prompt, '').trim().slice(0, 40) || niche.name
                        : niche.name
                }))
            }, FALLBACK_NICHES, 20000) // 20s timeout for first model load

            setIsLoading(false)
            return JSON.stringify(result)
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
            return JSON.stringify(FALLBACK_NICHES)
        }
    }, [getPipeline, generateWithFallback])

    const generateMoodboard = useCallback(async (brandVibe) => {
        setIsLoading(true)
        setError(null)
        setModelProgress(0)

        try {
            const result = await generateWithFallback(async () => {
                const pipe = await getPipeline('text-generation', 'Xenova/distilgpt2')

                const prompt = `Brand mood for ${brandVibe}: colors are `
                const output = await pipe(prompt, {
                    max_new_tokens: 30,
                    temperature: 0.7,
                    do_sample: true
                })

                const generated = output[0]?.generated_text || ''

                // Enhance fallback with generated content
                const moodboard = { ...FALLBACK_MOODBOARD }

                // Try to extract adjectives from generated text
                const words = generated.toLowerCase().split(/\s+/).filter(w =>
                    w.length > 3 && !['the', 'and', 'for', 'are', 'with'].includes(w)
                )
                if (words.length > 0) {
                    moodboard.adjectives = [...new Set([...words.slice(0, 3), ...moodboard.adjectives])].slice(0, 5)
                }

                return moodboard
            }, FALLBACK_MOODBOARD, 15000) // 15s timeout

            setIsLoading(false)
            return JSON.stringify(result)
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
            return JSON.stringify(FALLBACK_MOODBOARD)
        }
    }, [getPipeline, generateWithFallback])

    const generateProductDescription = useCallback(async (template, productDetails) => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await generateWithFallback(async () => {
                const pipe = await getPipeline('text-generation', 'Xenova/distilgpt2')

                const prompt = `Product: ${productDetails.name}. Description: `
                const output = await pipe(prompt, {
                    max_new_tokens: 60,
                    temperature: 0.7,
                    do_sample: true
                })

                const generated = output[0]?.generated_text || ''
                const description = generated.replace(prompt, '').trim()

                const templateKey = Object.keys(FALLBACK_DESCRIPTIONS).find(k =>
                    template.toLowerCase().includes(k)
                ) || 'template'

                const finalDesc = description.length > 50
                    ? description
                    : FALLBACK_DESCRIPTIONS[templateKey]

                return {
                    description: finalDesc,
                    tagline: `${productDetails.name} - crafted with love`,
                    keywords: ['cottagecore', 'digital product', 'cozy', productDetails.name.toLowerCase(), 'handcrafted']
                }
            }, {
                description: FALLBACK_DESCRIPTIONS.template,
                tagline: `${productDetails.name} - crafted with love`,
                keywords: ['cottagecore', 'digital product', 'cozy', 'handcrafted', 'mindful']
            }, 12000)

            setIsLoading(false)
            return JSON.stringify(result)
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
            return JSON.stringify({
                description: FALLBACK_DESCRIPTIONS.template,
                tagline: 'Crafted with love',
                keywords: ['cottagecore', 'digital', 'cozy']
            })
        }
    }, [getPipeline, generateWithFallback])

    const refinePrompt = useCallback(async (originalPrompt, style) => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await generateWithFallback(async () => {
                const pipe = await getPipeline('text-generation', 'Xenova/distilgpt2')

                const prompt = `Improve this prompt with ${style} style: ${originalPrompt.slice(0, 100)}. Better version: `
                const output = await pipe(prompt, {
                    max_new_tokens: 80,
                    temperature: 0.6,
                    do_sample: true
                })

                const generated = output[0]?.generated_text || ''
                const refined = generated.replace(prompt, '').trim()

                return refined.length > 20
                    ? refined
                    : `${originalPrompt}\n\n[Enhanced with ${style} warmth and natural imagery. Add sensory details about textures, scents, and cozy atmospheres.]`
            }, `${originalPrompt}\n\n[Enhanced with ${style} warmth and natural imagery. Consider adding details about textures, lighting, and gentle atmospheres.]`, 10000)

            setIsLoading(false)
            return result
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
            return `${originalPrompt}\n\n[Enhanced with cottagecore warmth]`
        }
    }, [getPipeline, generateWithFallback])

    return {
        isLoading,
        modelProgress,
        error,
        generateNicheSuggestions,
        generateMoodboard,
        generateProductDescription,
        refinePrompt
    }
}

export default useTransformersAI
