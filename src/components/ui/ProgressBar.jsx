import { motion } from 'framer-motion'

function ProgressBar({ value, max = 100, label, showValue = true, className = '' }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
        <div className={`w-full ${className}`}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-2 text-sm">
                    {label && <span className="text-bark dark:text-linen">{label}</span>}
                    {showValue && (
                        <span className="text-moss font-medium">{Math.round(percentage)}%</span>
                    )}
                </div>
            )}

            <div className="h-3 bg-linen-light dark:bg-bark/30 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-moss to-moss-light rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    )
}

export default ProgressBar
