'use client'
import { CalendarProvider } from '@/components/full-calendar'
import { es } from 'date-fns/locale'
import { Profiler } from 'react'

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
    return (
        <Profiler id='calendar' onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) => {
            console.log('STATS', {
                id,
                phase,
                actualDuration,
                baseDuration,
                startTime,
                commitTime
            })
        }}>
            <CalendarProvider
                weekStartsOn={1} // Lunes
                locale={es}
                className="h-screen bg-background border rounded-md overflow-hidden"
            >
                {children}
            </CalendarProvider>
        </Profiler>

    )
}
