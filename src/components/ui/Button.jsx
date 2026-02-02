import { motion } from 'framer-motion'

const variants = {
    moss: 'bg-moss text-cream hover:bg-moss-deep shadow-md hover:shadow-lg',
    linen: 'bg-linen text-bark hover:bg-linen-light border border-moss/20',
    outline: 'bg-transparent border-2 border-moss text-moss hover:bg-moss hover:text-cream',
    ghost: 'bg-transparent text-moss hover:bg-moss/10',
}

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
}

function Button({
    children,
    variant = 'moss',
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
            className={`
        rounded-full font-medium transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}
        ${className}
      `}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                </span>
            ) : children}
        </motion.button>
    )
}

export default Button
