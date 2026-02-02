import { useDarkMode } from '../../hooks/useDarkMode'
import { useAmbientSound } from '../../hooks/useAmbientSound'

function Header() {
    const { isDark, toggleDark } = useDarkMode()
    const { isPlaying, toggle: toggleSound } = useAmbientSound()

    return (
        <header className="sticky top-0 z-40 glass-card mx-4 mt-4 mb-6 px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-moss rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-cream" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.5 2 6 5 6 8c0 2 1 3.5 2 4.5V22h8v-9.5c1-1 2-2.5 2-4.5 0-3-2.5-6-6-6zm0 2c2.5 0 4 2 4 4 0 1.5-.5 2.5-1.5 3.5-.3.3-.5.7-.5 1v7h-4v-7c0-.3-.2-.7-.5-1C8.5 10.5 8 9.5 8 8c0-2 1.5-4 4-4z" />
                        <circle cx="10" cy="8" r="1" />
                        <circle cx="14" cy="8" r="1" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-handwritten text-bark dark:text-linen-light leading-none">
                        Moss & Monetise
                    </h1>
                    <p className="text-xs text-bark/60 dark:text-linen/60">
                        Cozy Creator Hub
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                {/* Rain sound toggle */}
                <button
                    onClick={toggleSound}
                    className="p-2 rounded-full hover:bg-moss/10 transition-colors"
                    aria-label={isPlaying ? 'Mute rain sounds' : 'Play rain sounds'}
                >
                    <svg className="w-5 h-5 text-bark dark:text-linen" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isPlaying ? (
                            <>
                                <path d="M12 2v20M8 6v12M4 10v4M16 4v16M20 8v8" />
                            </>
                        ) : (
                            <>
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </>
                        )}
                    </svg>
                </button>

                {/* Dark mode toggle */}
                <button
                    onClick={toggleDark}
                    className="p-2 rounded-full hover:bg-moss/10 transition-colors"
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    <svg className="w-5 h-5 text-bark dark:text-linen" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isDark ? (
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        ) : (
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        )}
                    </svg>
                </button>
            </div>
        </header>
    )
}

export default Header
