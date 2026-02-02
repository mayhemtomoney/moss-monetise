import { useState, useRef, useCallback } from 'react'
import { Howl } from 'howler'

/**
 * Custom hook for ambient rain sounds
 */
export function useAmbientSound() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.3)
    const soundRef = useRef(null)

    // Initialize sound on first use
    const initSound = useCallback(() => {
        if (!soundRef.current) {
            soundRef.current = new Howl({
                src: ['/sounds/rain-ambient.mp3'],
                loop: true,
                volume: volume,
                onplayerror: () => {
                    console.warn('Rain sound could not play')
                }
            })
        }
    }, [volume])

    const toggle = useCallback(() => {
        initSound()

        if (isPlaying) {
            soundRef.current?.pause()
            setIsPlaying(false)
        } else {
            soundRef.current?.play()
            setIsPlaying(true)
        }
    }, [isPlaying, initSound])

    const updateVolume = useCallback((newVolume) => {
        setVolume(newVolume)
        if (soundRef.current) {
            soundRef.current.volume(newVolume)
        }
    }, [])

    const stop = useCallback(() => {
        soundRef.current?.stop()
        setIsPlaying(false)
    }, [])

    return {
        isPlaying,
        volume,
        toggle,
        updateVolume,
        stop
    }
}

export default useAmbientSound
