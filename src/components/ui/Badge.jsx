import { motion } from 'framer-motion'

const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    neutral: 'badge-neutral',
    ghost: 'badge-ghost',
    outline: 'badge-outline',
    // Legacy mappings
    bloom: 'badge-accent',
    moss: 'badge-primary',
    berry: 'badge-error',
    linen: 'badge-secondary',
}

function Badge({
    children,
    variant = 'primary',
    icon,
    animate = false,
    className = '',
}) {
    return (
        <motion.span
            className={`badge ${variantClasses[variant] || variantClasses.primary} gap-1 ${className}`}
            initial={animate ? { scale: 0 } : false}
            animate={animate ? { scale: 1 } : false}
            transition={{ type: 'spring', damping: 15 }}
        >
            {icon && <span>{icon}</span>}
            {children}
        </motion.span>
    )
}

export default Badge
