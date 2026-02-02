import { motion } from 'framer-motion'
import Navigation from './Navigation'
import Header from './Header'
import ParallaxBackground from './ParallaxBackground'

function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <ParallaxBackground />
            <Header />

            <motion.main
                className="flex-1 pb-20 md:pb-6 px-4 md:px-8 max-w-6xl mx-auto w-full"
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
