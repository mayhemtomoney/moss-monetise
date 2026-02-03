import { motion } from 'framer-motion'

const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    neutral: 'btn-neutral',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
    // Legacy mappings
    moss: 'btn-primary',
    linen: 'btn-secondary',
}

const sizeClasses = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
}

function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    ...props
}) {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size]} ${className}`}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
            ) : children}
        </motion.button>
    )
}

export default Button
