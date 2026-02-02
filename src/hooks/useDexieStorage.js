import { useState, useEffect, useCallback } from 'react'
import { promptsDB, brandsDB, progressDB } from '../db'

/**
 * Hook for managing saved prompts with Dexie persistence
 */
export function useSavedPrompts() {
    const [savedPrompts, setSavedPrompts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Load on mount
    useEffect(() => {
        const loadPrompts = async () => {
            try {
                const prompts = await promptsDB.getAll()
                setSavedPrompts(prompts)
            } catch (err) {
                console.error('Failed to load saved prompts:', err)
            } finally {
                setIsLoading(false)
            }
        }
        loadPrompts()
    }, [])

    const savePrompt = useCallback(async (prompt) => {
        try {
            const id = await promptsDB.add(prompt)
            const newPrompt = { ...prompt, id, timestamp: Date.now() }
            setSavedPrompts(prev => [...prev, newPrompt])
            return id
        } catch (err) {
            console.error('Failed to save prompt:', err)
            throw err
        }
    }, [])

    const removePrompt = useCallback(async (id) => {
        try {
            await promptsDB.delete(id)
            setSavedPrompts(prev => prev.filter(p => p.id !== id))
        } catch (err) {
            console.error('Failed to remove prompt:', err)
            throw err
        }
    }, [])

    const searchPrompts = useCallback(async (query) => {
        if (!query.trim()) {
            const all = await promptsDB.getAll()
            setSavedPrompts(all)
            return all
        }
        try {
            const results = await promptsDB.search(query)
            return results
        } catch (err) {
            console.error('Failed to search prompts:', err)
            return []
        }
    }, [])

    const isSaved = useCallback((promptId) => {
        return savedPrompts.some(p => p.originalId === promptId || p.id === promptId)
    }, [savedPrompts])

    const updatePrompt = useCallback(async (id, changes) => {
        try {
            await promptsDB.update(id, changes)
            setSavedPrompts(prev => prev.map(p =>
                p.id === id ? { ...p, ...changes, timestamp: Date.now() } : p
            ))
        } catch (err) {
            console.error('Failed to update prompt:', err)
            throw err
        }
    }, [])

    return {
        savedPrompts,
        isLoading,
        savePrompt,
        removePrompt,
        updatePrompt,
        searchPrompts,
        isSaved
    }
}

/**
 * Hook for managing saved brands with Dexie persistence
 */
export function useSavedBrands() {
    const [savedBrands, setSavedBrands] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Load on mount
    useEffect(() => {
        const loadBrands = async () => {
            try {
                const brands = await brandsDB.getAll()
                setSavedBrands(brands)
            } catch (err) {
                console.error('Failed to load saved brands:', err)
            } finally {
                setIsLoading(false)
            }
        }
        loadBrands()
    }, [])

    const saveBrand = useCallback(async (brand) => {
        try {
            const id = await brandsDB.add(brand)
            const newBrand = { ...brand, id, timestamp: Date.now() }
            setSavedBrands(prev => [...prev, newBrand])
            return id
        } catch (err) {
            console.error('Failed to save brand:', err)
            throw err
        }
    }, [])

    const removeBrand = useCallback(async (id) => {
        try {
            await brandsDB.delete(id)
            setSavedBrands(prev => prev.filter(b => b.id !== id))
        } catch (err) {
            console.error('Failed to remove brand:', err)
            throw err
        }
    }, [])

    const updateBrand = useCallback(async (id, changes) => {
        try {
            await brandsDB.update(id, changes)
            setSavedBrands(prev => prev.map(b =>
                b.id === id ? { ...b, ...changes, timestamp: Date.now() } : b
            ))
        } catch (err) {
            console.error('Failed to update brand:', err)
            throw err
        }
    }, [])

    return {
        savedBrands,
        isLoading,
        saveBrand,
        removeBrand,
        updateBrand
    }
}

/**
 * Hook for managing user progress with Dexie persistence
 */
export function useUserProgress() {
    const [progress, setProgress] = useState({})
    const [earnedBadges, setEarnedBadges] = useState([])
    const [totalPoints, setTotalPoints] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    // Load on mount
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const allProgress = await progressDB.getAllProgress()
                const progressMap = {}
                let badges = []
                let points = 0

                allProgress.forEach(p => {
                    progressMap[p.module] = p
                    badges = [...badges, ...(p.badges || [])]
                    points += p.points || 0
                })

                setProgress(progressMap)
                setEarnedBadges(badges)
                setTotalPoints(points)
            } catch (err) {
                console.error('Failed to load progress:', err)
            } finally {
                setIsLoading(false)
            }
        }
        loadProgress()
    }, [])

    const updateModuleProgress = useCallback(async (moduleId, data) => {
        try {
            await progressDB.upsert(moduleId, data)
            setProgress(prev => ({
                ...prev,
                [moduleId]: { ...prev[moduleId], ...data, module: moduleId }
            }))

            // Update derived state
            if (data.badges) {
                setEarnedBadges(prev => {
                    const existing = new Set(prev)
                    data.badges.forEach(b => existing.add(b))
                    return Array.from(existing)
                })
            }
            if (data.points !== undefined) {
                const allProgress = await progressDB.getAllProgress()
                const total = allProgress.reduce((sum, p) => sum + (p.points || 0), 0)
                setTotalPoints(total)
            }
        } catch (err) {
            console.error('Failed to update progress:', err)
            throw err
        }
    }, [])

    const getModuleProgress = useCallback((moduleId) => {
        return progress[moduleId] || { completedTasks: [], badges: [], points: 0 }
    }, [progress])

    const addBadge = useCallback(async (moduleId, badge) => {
        const current = progress[moduleId] || { badges: [], completedTasks: [], points: 0 }
        if (!current.badges.includes(badge)) {
            await updateModuleProgress(moduleId, {
                ...current,
                badges: [...current.badges, badge]
            })
        }
    }, [progress, updateModuleProgress])

    const addPoints = useCallback(async (moduleId, pointsToAdd) => {
        const current = progress[moduleId] || { badges: [], completedTasks: [], points: 0 }
        await updateModuleProgress(moduleId, {
            ...current,
            points: (current.points || 0) + pointsToAdd
        })
    }, [progress, updateModuleProgress])

    return {
        progress,
        earnedBadges,
        totalPoints,
        isLoading,
        updateModuleProgress,
        getModuleProgress,
        addBadge,
        addPoints
    }
}
