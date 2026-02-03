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
            className={`card bg-base-100 shadow-md ${hover ? 'hover:shadow-xl cursor-pointer' : ''} ${className}`}
            onClick={onClick}
            whileHover={hover ? { scale: 1.01 } : {}}
            {...props}
        >
            <div className="card-body">
                {children}
            </div>
        </motion.div>
    )
}

export default Card
