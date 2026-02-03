import { motion, AnimatePresence } from 'framer-motion'

function Modal({ isOpen, onClose, title, children }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-base-content/30 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full z-50"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25 }}
                    >
                        <div className="card bg-base-100 shadow-xl h-full md:h-auto overflow-auto">
                            <div className="card-body">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h2 className="card-title text-2xl font-handwritten text-primary">
                                        {title}
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="btn btn-sm btn-circle btn-ghost"
                                        aria-label="Close modal"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="text-base-content">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Modal
