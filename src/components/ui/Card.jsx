import { motion } from 'framer-motion'

function Card({
    children,
    className = '',
    hover = true,
    variant = 'parchment',
    onClick,
    ...props
}) {
    const variants = {
        parchment: 'parchment-card',
        glass: 'glass-card',
        wood: 'bg-wood border-2 border-wood-light rounded-lg'
    }

    return (
        <motion.div
            className={`
        ${variants[variant] || variants.parchment} p-6
        ${hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}
        transition-all duration-300
        ${className}
      `}
            onClick={onClick}
            whileHover={hover ? { scale: 1.01 } : {}}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export default Card
