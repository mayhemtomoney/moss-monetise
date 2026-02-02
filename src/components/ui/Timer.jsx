import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Button from './Button'

function Timer({ initialMinutes = 25, onComplete }) {
    const [seconds, setSeconds] = useState(initialMinutes * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [mode, setMode] = useState('work') // work | break

    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60

    useEffect(() => {
        let interval
        if (isRunning && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(s => s - 1)
            }, 1000)
        } else if (seconds === 0) {
            setIsRunning(false)
            onComplete?.(mode)
            // Switch modes
            if (mode === 'work') {
                setMode('break')
                setSeconds(5 * 60) // 5 min break
            } else {
                setMode('work')
                setSeconds(initialMinutes * 60)
            }
        }
        return () => clearInterval(interval)
    }, [isRunning, seconds, mode, initialMinutes, onComplete])

    const toggle = useCallback(() => setIsRunning(r => !r), [])
    const reset = useCallback(() => {
        setIsRunning(false)
        setSeconds(initialMinutes * 60)
        setMode('work')
    }, [initialMinutes])

    return (
        <div className="text-center">
            <div className="mb-4">
                <span className={`text-sm font-medium ${mode === 'work' ? 'text-moss' : 'text-petal'}`}>
                    {mode === 'work' ? '🌿 Focus Time' : '🌸 Break Time'}
                </span>
            </div>

            <motion.div
                className="text-5xl font-handwritten text-bark dark:text-linen mb-6"
                key={seconds}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
            >
                {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </motion.div>

            <div className="flex justify-center gap-3">
                <Button onClick={toggle} variant="moss">
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={reset} variant="linen">
                    Reset
                </Button>
            </div>
        </div>
    )
}

export default Timer
