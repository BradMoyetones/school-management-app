'use client'
import { CalendarHeader, CalendarTitle, CalendarPrevTrigger, CalendarTodayTrigger, CalendarNextTrigger, CalendarBody, CalendarMonthView, CalendarEvent, useCalendar, CalendarDay, CalendarEventCard, CalendarMonthGrid, CalendarDayHeader, CalendarDayDate, CalendarMonthHeader, CalendarMonthHeaderTitle } from '@/components/full-calendar'
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import { Plus } from 'lucide-react';
import { useCallback, useEffect } from 'react';

const initialEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'Reunión de Diseño',
        start: new Date(2026, 1, 15, 10, 0),
        end: new Date(2026, 1, 15, 11, 0),
        color: 'blue',
        description: 'Revisar los mocks del dashboard',
    },
    {
        id: '2',
        title: 'Lanzamiento',
        start: new Date(2026, 1, 20, 9, 0),
        end: new Date(2026, 1, 20, 18, 0),
        color: 'blue',
        location: 'Oficina Central',
    },
];

export default function Page() {
    const { days, setEvents, eventsByDay, formattedDate, weekDays, locale, date } = useCalendar()

    useEffect(() => {
        setEvents(initialEvents)
    }, [])

    return (
        <>
            <CalendarHeader className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <CalendarTitle className="text-2xl">{formattedDate}</CalendarTitle>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarPrevTrigger />
                    <CalendarTodayTrigger />
                    <CalendarNextTrigger />
                </div>
            </CalendarHeader>

            <CalendarBody>
                <CalendarMonthView>
                    <CalendarMonthHeader>
                        {weekDays.map((day) => (
                            <CalendarMonthHeaderTitle key={day.toISOString()}>
                                {format(day, "EEEE", { locale }).slice(0, 3)}
                            </CalendarMonthHeaderTitle>
                        ))}
                    </CalendarMonthHeader>
                    <CalendarMonthGrid>
                        {days.map((day) => {
                            return (
                                <CalendarDayRender
                                    key={day.getTime()}
                                    day={day}
                                />
                            )
                        })}
                    </CalendarMonthGrid>
                </CalendarMonthView>
            </CalendarBody>
        </>
    )
}

const CalendarDayRender = ({ day }: { day: Date }) => {
    const { eventsByDay, date } = useCalendar()
    const dayEvents = useCallback(() => eventsByDay.get(day.toDateString()) || [], [eventsByDay, day])
    // Validar si el dia está en el mes actual
    const isCurrentMonth = useCallback(() => isSameMonth(day, date), [day, date])
    const isTodayDate = useCallback(() => isToday(day), [day])
    return (
        <CalendarDay 
            date={day} 
            isCurrentMonth={isCurrentMonth()} 
            isToday={isTodayDate()}
            onClick={() => console.log("Click en el día:", day)}
        >
            <CalendarDayHeader>
                <CalendarDayDate date={day} />
                <Switch 
                    onClick={e => e.stopPropagation()}
                />
            </CalendarDayHeader>
            <div className="flex flex-col gap-1 mt-1">
                {dayEvents().map(event => (
                    <CalendarEventCard
                        key={event.id}
                        event={event}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("Click en evento:", event.title)
                        }}
                    />
                ))}
            </div>
        </CalendarDay>
    )
}