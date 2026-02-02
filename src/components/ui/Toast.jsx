import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

function Toast({ message, type = 'success', duration = 3000, onClose }) {
    const [isVisible, setIsVisible] = useState(true)

    const icons = {
        success: '🌿',
        info: '🍃',
        warning: '🌻',
        error: '🥀',
    }

    const colors = {
        success: 'bg-moss/90 text-cream',
        info: 'bg-linen/90 text-bark',
        warning: 'bg-petal/90 text-bark',
        error: 'bg-berry/90 text-cream',
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
        }, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg ${colors[type]}`}
                    initial={{ opacity: 0, y: 20, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -20, x: '-50%' }}
                >
                    <span className="flex items-center gap-2">
                        <span>{icons[type]}</span>
                        <span className="font-medium">{message}</span>
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Toast
