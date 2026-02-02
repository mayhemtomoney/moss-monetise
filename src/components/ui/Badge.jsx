import { motion } from 'framer-motion'

const variants = {
    bloom: 'bg-petal text-bark',
    moss: 'bg-moss text-cream',
    berry: 'bg-berry text-cream',
    linen: 'bg-linen text-bark',
}

function Badge({
    children,
    variant = 'moss',
    icon,
    animate = false,
    className = '',
}) {
    return (
        <motion.span
            className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
        ${variants[variant]}
        ${className}
      `}
            initial={animate ? { scale: 0 } : false}
            animate={animate ? { scale: 1 } : false}
            transition={{ type: 'spring', damping: 15 }}
        >
            {icon && <span className="text-base">{icon}</span>}
            {children}
        </motion.span>
    )
}

export default Badge
