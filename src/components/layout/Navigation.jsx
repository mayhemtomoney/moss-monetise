import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/niche-picker', label: 'Niche', icon: 'flower' },
    { path: '/branding-studio', label: 'Brand', icon: 'palette' },
    { path: '/biz-builder', label: 'Build', icon: 'seedling' },
    { path: '/product-forge', label: 'Create', icon: 'scroll' },
    { path: '/prompt-vault', label: 'Vault', icon: 'key' },
]

const icons = {
    home: (
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />
    ),
    flower: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2a3 3 0 0 0 0 6 3 3 0 0 0 0-6zM4.93 4.93a3 3 0 0 0 4.24 4.24 3 3 0 0 0-4.24-4.24zM2 12a3 3 0 0 0 6 0 3 3 0 0 0-6 0zM4.93 19.07a3 3 0 0 0 4.24-4.24 3 3 0 0 0-4.24 4.24zM12 16a3 3 0 0 0 0 6 3 3 0 0 0 0-6zM14.83 14.83a3 3 0 0 0 4.24 4.24 3 3 0 0 0-4.24-4.24zM16 12a3 3 0 0 0 6 0 3 3 0 0 0-6 0zM14.83 9.17a3 3 0 0 0 4.24-4.24 3 3 0 0 0-4.24 4.24z" />
        </>
    ),
    palette: (
        <path d="M12 2a10 10 0 1 0 10 10c0-1.1-.9-2-2-2h-3c-.55 0-1-.45-1-1 0-.55.45-1 1-1h1.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H17c-.55 0-1-.45-1-1s.45-1 1-1h1c1.1 0 2-.9 2-2A10 10 0 0 0 12 2zM6.5 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4-1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    ),
    seedling: (
        <path d="M12 22v-8M12 14c4-1 6-4 6-8-4 0-7 2-8 6-1-4-4-6-8-6 0 4 2 7 6 8" />
    ),
    scroll: (
        <path d="M8 21h8a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3zM8 3v18M16 3v18M5 8h14M5 12h14M5 16h14" />
    ),
    key: (
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    ),
}

function Navigation() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:left-auto md:right-4">
            <div className="glass-card mx-4 mb-4 md:m-0 md:rounded-2xl">
                <ul className="flex md:flex-col items-center justify-around md:justify-center md:py-4 md:px-2 md:gap-4">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${isActive
                                        ? 'text-moss-deep bg-moss/10'
                                        : 'text-bark/60 dark:text-linen/60 hover:text-moss hover:bg-moss/5'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <motion.svg
                                            className="w-6 h-6"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {icons[item.icon]}
                                        </motion.svg>
                                        <span className="text-xs font-medium hidden md:block">
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default Navigation
