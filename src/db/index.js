import Dexie from 'dexie'

/**
 * Moss & Monetise IndexedDB database using Dexie.js
 * Provides persistent storage for prompts, brands, and user progress
 */
export const db = new Dexie('mossMonetise')

// Define database schema
db.version(1).stores({
    savedPrompts: '++id, prompt, title, category, tags, timestamp',
    savedBrands: '++id, name, moodboard, palette, vibe, timestamp',
    userProgress: '++id, module, badges, completedTasks, points, timestamp'
})

// Helper functions for savedPrompts
export const promptsDB = {
    async add(prompt) {
        return db.savedPrompts.add({
            ...prompt,
            timestamp: Date.now()
        })
    },

    async getAll() {
        return db.savedPrompts.toArray()
    },

    async getById(id) {
        return db.savedPrompts.get(id)
    },

    async update(id, changes) {
        return db.savedPrompts.update(id, {
            ...changes,
            timestamp: Date.now()
        })
    },

    async delete(id) {
        return db.savedPrompts.delete(id)
    },

    async search(query) {
        const lowerQuery = query.toLowerCase()
        return db.savedPrompts
            .filter(prompt =>
                prompt.prompt?.toLowerCase().includes(lowerQuery) ||
                prompt.title?.toLowerCase().includes(lowerQuery) ||
                prompt.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
            )
            .toArray()
    },

    async getByCategory(category) {
        return db.savedPrompts
            .where('category')
            .equals(category)
            .toArray()
    },

    async clear() {
        return db.savedPrompts.clear()
    }
}

// Helper functions for savedBrands
export const brandsDB = {
    async add(brand) {
        return db.savedBrands.add({
            ...brand,
            timestamp: Date.now()
        })
    },

    async getAll() {
        return db.savedBrands.toArray()
    },

    async getById(id) {
        return db.savedBrands.get(id)
    },

    async update(id, changes) {
        return db.savedBrands.update(id, {
            ...changes,
            timestamp: Date.now()
        })
    },

    async delete(id) {
        return db.savedBrands.delete(id)
    },

    async clear() {
        return db.savedBrands.clear()
    }
}

// Helper functions for userProgress
export const progressDB = {
    async getByModule(moduleId) {
        return db.userProgress
            .where('module')
            .equals(moduleId)
            .first()
    },

    async upsert(moduleId, data) {
        const existing = await this.getByModule(moduleId)
        if (existing) {
            return db.userProgress.update(existing.id, {
                ...data,
                timestamp: Date.now()
            })
        } else {
            return db.userProgress.add({
                module: moduleId,
                ...data,
                timestamp: Date.now()
            })
        }
    },

    async getAllProgress() {
        return db.userProgress.toArray()
    },

    async getBadges() {
        const progress = await db.userProgress.toArray()
        return progress.reduce((badges, p) => {
            return [...badges, ...(p.badges || [])]
        }, [])
    },

    async getTotalPoints() {
        const progress = await db.userProgress.toArray()
        return progress.reduce((total, p) => total + (p.points || 0), 0)
    },

    async clear() {
        return db.userProgress.clear()
    }
}

export default db
