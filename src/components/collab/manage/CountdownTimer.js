import { useState, useEffect } from "react";

export const CountdownTimer = ({ endDate, onComplete }) => {

    const calculateTimeRemaining = () => {
        const now = new Date();
        const difference = Math.abs(endDate - now)

        return Math.floor((difference / 1000) % 60)
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining())

    useEffect(() => {
        let timerFunc = setTimeout(() => {
            const remaining = calculateTimeRemaining()
            setTimeLeft(remaining)
        }, 1000)

        return () => clearTimeout(timerFunc)
    })

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete()
        }
    }, [timeLeft]) // eslint-disable-line react-hooks/exhaustive-deps

    return timeLeft > 0 ? `${timeLeft}s` : 'checking...'
}