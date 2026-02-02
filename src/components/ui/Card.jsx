import { motion } from 'framer-motion'

function Card({
    children,
    className = '',
    hover = true,
    onClick,
    ...props
}) {
    return (
        <motion.div
            className={`
        glass-card linen-texture p-6
        ${hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}
        transition-all duration-300
        ${className}
      `}
            onClick={onClick}
            whileHover={hover ? { scale: 1.02 } : {}}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export default Card
