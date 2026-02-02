import { motion } from 'framer-motion'
import Navigation from './Navigation'

function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Fireplace glow effect */}
            <div className="fireplace-glow" />

            {/* Fixed Header */}
            <header className="cottage-header fixed top-0 left-0 right-0 z-50 px-6 md:pl-56">
                <h1 className="lantern-glow">Moss & Monetise</h1>
                <p className="tagline">Your cottagecore path to digital products that sell while you dream.</p>
            </header>

            {/* Main content with left padding for desktop sidebar */}
            <motion.main
                className="flex-1 pb-24 md:pb-8 pt-32 md:pl-56 px-4 md:px-8 max-w-5xl w-full relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {children}
            </motion.main>

            <Navigation />
        </div>
    )
}

export default Layout
