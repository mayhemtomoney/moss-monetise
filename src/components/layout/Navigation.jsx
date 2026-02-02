import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/niche-picker', label: 'Niche', icon: '🌸' },
    { path: '/branding-studio', label: 'Brand', icon: '🧵' },
    { path: '/biz-builder', label: 'Build', icon: '🌿' },
    { path: '/product-forge', label: 'Create', icon: '✨' },
    { path: '/prompt-vault', label: 'Vault', icon: '📜' },
]

function Navigation() {
    return (
        <>
            {/* Desktop: Left Ivy Sidebar */}
            <nav className="hidden md:flex fixed top-0 left-0 bottom-0 w-48 ivy-sidebar flex-col pt-28 pb-6 px-3 z-40">
                <ul className="flex flex-col gap-3">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `wood-nav-btn ${isActive ? 'active' : ''}`
                                }
                            >
                                {({ isActive }) => (
                                    <motion.span
                                        className="flex items-center gap-3 w-full"
                                        animate={isActive ? { x: [0, 3, 0] } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </motion.span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Ivy vine decoration */}
                <div className="absolute left-0 top-0 bottom-0 w-3 opacity-40"
                    style={{
                        background: 'repeating-linear-gradient(180deg, transparent 0px, #2a3a2a 2px, transparent 4px, transparent 20px)'
                    }}
                />
            </nav>

            {/* Mobile: Bottom navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-bottom-nav px-2 py-2">
                <ul className="flex items-center justify-around">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${isActive
                                        ? 'text-amber-bright'
                                        : 'text-amber/60 hover:text-amber'
                                    }`
                                }
                                style={({ isActive }) => ({
                                    color: isActive ? '#e8c89e' : '#a89070'
                                })}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-xs font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    )
}

export default Navigation
