import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'

/**
 * Custom hook for dark mode toggle with system preference detection
 */
export function useDarkMode() {
    const [isDark, setIsDark] = useLocalStorage('moss-dark-mode', () => {
        // Check system preference
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return false
    })

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [isDark])

    const toggleDark = () => setIsDark(prev => !prev)

    return { isDark, toggleDark, setIsDark }
}

export default useDarkMode
