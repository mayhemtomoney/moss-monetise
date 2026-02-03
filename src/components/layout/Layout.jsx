import { useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/niche-picker', label: 'Niche', icon: '🌸' },
    { path: '/branding-studio', label: 'Brand', icon: '🎨' },
    { path: '/biz-builder', label: 'Build', icon: '🌿' },
    { path: '/product-forge', label: 'Create', icon: '✨' },
    { path: '/prompt-vault', label: 'Vault', icon: '📜' },
]

function Layout({ children }) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const location = useLocation()

    return (
        <div className="drawer lg:drawer-open">
            {/* Drawer toggle for mobile */}
            <input
                id="main-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={drawerOpen}
                onChange={(e) => setDrawerOpen(e.target.checked)}
            />

            {/* Main content area */}
            <div className="drawer-content flex flex-col min-h-screen bg-base-200">
                {/* Fixed Navbar - 80px */}
                <nav className="navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-40 h-20 px-4 lg:pl-72">
                    {/* Mobile hamburger */}
                    <div className="flex-none lg:hidden">
                        <label htmlFor="main-drawer" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>

                    {/* Logo - left - IM Fell English */}
                    <div className="flex-1">
                        <h1 className="text-3xl lg:text-4xl font-fell text-primary">Moss & Monetise</h1>
                    </div>

                    {/* Tagline - right */}
                    <div className="flex-none hidden sm:block">
                        <span className="text-base-content/60 font-fell text-lg">Your cottagecore path</span>
                    </div>
                </nav>

                {/* Page content with top padding for navbar */}
                <motion.main
                    className="flex-1 pt-24 pb-20 lg:pb-8 px-4 lg:px-6 lg:ml-0 font-fell"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={location.pathname}
                >
                    <div className="max-w-4xl mx-auto">
                        {children}
                    </div>
                </motion.main>
            </div>

            {/* Sidebar drawer - 280px, vertically centered */}
            <div className="drawer-side z-50">
                <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <aside className="bg-base-100 w-70 min-h-screen border-r border-base-300 flex flex-col justify-center">
                    {/* Navigation menu - vertically centered */}
                    <ul className="menu p-4 gap-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => setDrawerOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 py-3 px-4 rounded-lg font-fell text-lg ${isActive
                                            ? 'bg-primary text-primary-content font-medium'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>

            {/* Mobile bottom navigation */}
            <nav className="btm-nav btm-nav-sm lg:hidden bg-base-100 border-t border-base-300 z-40">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `${isActive ? 'active text-primary border-t-2 border-primary' : 'text-base-content/60'}`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="btm-nav-label font-fell text-xs">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}

export default Layout
