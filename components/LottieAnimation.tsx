'use client'

import Lottie from 'lottie-react'

export default function LottieAnimation({ animationData }: { animationData: any }) {
    return (
        <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full"
        />
    )
}
