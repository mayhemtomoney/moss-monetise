import { motion } from 'framer-motion'
import Navigation from './Navigation'

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            {/* Fixed Header */}
            <header className="navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-50 px-6 md:pl-56">
                <div className="flex-1">
                    <h1 className="text-4xl font-handwritten text-primary">Moss & Monetise</h1>
                    <p className="text-sm text-base-content/60 ml-4 hidden md:block">
                        Your cottagecore path to digital products
                    </p>
                </div>
            </header>

            {/* Main content with left padding for desktop sidebar */}
            <motion.main
                className="flex-1 pb-24 md:pb-8 pt-20 md:pl-56 px-4 md:px-8 max-w-5xl w-full"
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
