import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/niche-picker', label: 'Niche', icon: '🌸' },
    { path: '/branding-studio', label: 'Brand', icon: '🎨' },
    { path: '/biz-builder', label: 'Build', icon: '🌿' },
    { path: '/product-forge', label: 'Create', icon: '✨' },
    { path: '/prompt-vault', label: 'Vault', icon: '📜' },
]

function Navigation() {
    return (
        <>
            {/* Desktop: Left Sidebar */}
            <nav className="hidden md:flex fixed top-0 left-0 bottom-0 w-52 bg-base-100 border-r border-base-300 flex-col pt-24 pb-6 px-3 z-40">
                <ul className="menu gap-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 ${isActive ? 'active bg-primary text-primary-content' : ''}`
                                }
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile: Bottom navigation */}
            <nav className="md:hidden btm-nav btm-nav-sm bg-base-100 border-t border-base-300 z-50">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? 'active text-primary' : 'text-base-content'
                        }
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="btm-nav-label text-xs">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </>
    )
}

export default Navigation
