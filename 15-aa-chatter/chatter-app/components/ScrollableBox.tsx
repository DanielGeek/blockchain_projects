import { useState, useEffect, useRef } from 'react'

// https://dev.to/martinez/real-scroll-for-a-chat-application-22co
export default function ScrollableBox({children, className}: {children: React.ReactNode, className: string}) {
    const container = useRef<HTMLDivElement>(null)

    const Scroll = () => {
        const { offsetHeight, scrollHeight, scrollTop } = container.current as HTMLDivElement
        if (scrollHeight <= scrollTop + offsetHeight + 100) {
            container.current?.scrollTo(0, scrollHeight)
        }
    }

    useEffect(() => {
        Scroll()
    }, [children])

    return <div ref={container} className={className}>
                <div className='flex shrink grow'>{children}</div>
            </div>
}