import { useState, useCallback } from 'react'

/**
 * Custom hook for Puter.js AI integration
 * Uses the global puter object loaded via script tag
 */
export function usePuterAI() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const generateText = useCallback(async (prompt, options = {}) => {
        setIsLoading(true)
        setError(null)

        try {
            // Check if puter is available (loaded from CDN)
            if (typeof window.puter === 'undefined') {
                throw new Error('Puter.js not loaded. Please refresh the page.')
            }

            const response = await window.puter.ai.chat(prompt, {
                model: options.model || 'gpt-4o-mini',
                ...options
            })

            setIsLoading(false)
            return response
        } catch (err) {
            setError(err.message || 'AI generation failed')
            setIsLoading(false)
            throw err
        }
    }, [])

    const generateNicheSuggestions = useCallback(async (answers) => {
        const prompt = `Based on these cottagecore creator preferences:
- Interests: ${answers.interests}
- Skills: ${answers.skills}
- Time available: ${answers.time}
- Dream audience: ${answers.audience}
- Favorite aesthetic: ${answers.aesthetic}

Suggest 3 unique digital product niches that blend cottagecore aesthetics with passive income potential. For each niche, provide:
1. Niche name (creative & cozy)
2. Product ideas (3 specific offerings)
3. Target customer persona
4. Why it fits their profile

Format as JSON array with keys: name, products, persona, fit`

        return generateText(prompt)
    }, [generateText])

    const generateMoodboard = useCallback(async (brandVibe) => {
        const prompt = `Create a cottagecore brand moodboard concept for: "${brandVibe}"
    
Include:
- Color palette (5 hex codes with names)
- Font pairing suggestions
- Texture/pattern ideas
- Key imagery themes
- Brand adjectives (5 words)

Format as JSON with keys: colors, fonts, textures, imagery, adjectives`

        return generateText(prompt)
    }, [generateText])

    const generateProductDescription = useCallback(async (template, productDetails) => {
        const prompt = `Write a cozy, cottagecore-style product description for:
Template type: ${template}
Product: ${productDetails.name}
Features: ${productDetails.features}

The description should:
- Feel warm and inviting like a handwritten note
- Use sensory language
- Highlight the value for the buyer
- Include a gentle call-to-action
- Be 100-150 words

Also provide:
- 5 SEO keywords
- A short tagline (under 10 words)`

        return generateText(prompt)
    }, [generateText])

    const refinePrompt = useCallback(async (originalPrompt, style) => {
        const prompt = `Refine this prompt for ${style} style:
"${originalPrompt}"

Make it more specific, add relevant details, and optimize for better AI outputs.
Keep the cottagecore/cozy aesthetic.
Return the refined prompt only.`

        return generateText(prompt)
    }, [generateText])

    return {
        isLoading,
        error,
        generateText,
        generateNicheSuggestions,
        generateMoodboard,
        generateProductDescription,
        refinePrompt
    }
}

export default usePuterAI
