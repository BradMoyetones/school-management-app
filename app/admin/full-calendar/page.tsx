'use client'
import {
    CalendarHeader,
    CalendarTitle,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    CalendarNextTrigger,
    CalendarBody,
    CalendarMonthView,
    useCalendar,
    CalendarDay,
    CalendarMonthGrid,
    CalendarDayHeader,
    CalendarDayDate,
    CalendarMonthHeader,
    CalendarMonthHeaderTitle,
    CalendarEvent,
    CalendarEventContent,
    CalendarEventDot,
    CalendarEventTitle,
    CalendarEventTime,
    CalendarEventColor
} from '@/components/full-calendar'
import { Switch } from '@/components/ui/switch';
import { format, isSameMonth, isToday } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import CalendarSheet from './components/CalendarSheet';
import { TZDate } from '@date-fns/tz';

const initialEvents: {
    id: string;
    title: string;
    start: Date | string;
    end: Date | string;
    color: CalendarEventColor;
    description?: string;
    location?: string;
}[] = [
        {
            id: '1',
            title: 'Reunión de Diseño',
            start: new Date(2026, 2, 15, 10, 0),
            end: new Date(2026, 2, 15, 11, 0),
            color: 'blue',
            description: 'Revisar los mocks del dashboard',
        },
        {
            id: '2',
            title: 'Otro evento',
            start: new Date(2026, 1, 15, 10, 0),
            end: new Date(2026, 1, 15, 11, 0),
            color: 'red',
            description: 'Revisar los mocks del dashboard',
        },
        {
            id: '3',
            title: 'Otro evento',
            start: new Date(2026, 1, 15, 10, 0),
            end: new Date(2026, 1, 15, 11, 0),
            color: 'green',
            description: 'Revisar los mocks del dashboard',
        },
        {
            id: '4',
            title: 'Otro evento',
            start: new Date(2026, 1, 15, 10, 0),
            end: new Date(2026, 1, 15, 11, 0),
            color: 'yellow',
            description: 'Revisar los mocks del dashboard',
        },
        {
            id: '5',
            title: 'Lanzamiento',
            start: new Date(2026, 1, 20, 9, 0),
            end: new Date(2026, 1, 20, 18, 0),
            color: 'blue',
            location: 'Oficina Central',
        },
    ];

export default function Page() {
    const { days, setEvents, formattedDate, weekDays, locale } = useCalendar<typeof initialEvents[0]>()
    const [openSheet, setOpenSheet] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<typeof initialEvents[0] | null>(null)

    useEffect(() => {
        setEvents(initialEvents)
    }, [])

    const handleEventClick = useCallback((event: typeof initialEvents[0]) => {
        setSelectedEvent(event)
        setOpenSheet(true)
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
                                    onClick={handleEventClick}
                                />
                            )
                        })}
                    </CalendarMonthGrid>
                </CalendarMonthView>
            </CalendarBody>
            <CalendarSheet
                open={openSheet}
                onOpenChange={(open) => {
                    setOpenSheet(open)
                    setSelectedEvent(null)
                }}
                event={selectedEvent}
                onSubmit={(event) => {
                    console.log("Evento agregado:", event)
                    setOpenSheet(false)
                }}
            />
        </>
    )
}

const CalendarDayRender = memo(({ day, onClick }: { day: Date, onClick: (event: any) => void }) => {
    const { eventsByDay, date, timezone } = useCalendar<typeof initialEvents[0]>()
    const dayKey = format(day, "yyyy-MM-dd")
    const dayEvents = eventsByDay.get(dayKey) || []
    // Validar si el dia está en el mes actual
    const isCurrentMonth = isSameMonth(day, date)
    const isTodayDate = isToday(day)
    return (
        <CalendarDay
            date={day}
            isCurrentMonth={isCurrentMonth}
            isToday={isTodayDate}
            onClick={() => console.log("Click en el día:", day)}
        >
            <CalendarDayHeader>
                <CalendarDayDate date={day} />
                {isCurrentMonth && (
                    <Switch
                        onClick={e => e.stopPropagation()}
                        className='md:inline-flex hidden cursor-pointer'
                    />
                )}
            </CalendarDayHeader>
            <div className="flex flex-col gap-1 mt-1 justify-end flex-1">
                {/* Limitar iteraciones a 2 eventos y mostrar un badge con la cantidad de eventos restantes */}
                {dayEvents.length > 0 ? (
                    <>
                        {dayEvents.slice(0, 2).map((event) => {
                            const zonedDate = new TZDate(new Date(event.start), timezone)
                            return (
                                <CalendarEvent
                                    key={event.id}
                                    color={event.color}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Click en evento:", event.title)
                                        onClick(event)
                                    }}
                                >
                                    <CalendarEventContent>
                                        <CalendarEventDot />
                                        <CalendarEventTitle>{event.title}</CalendarEventTitle>
                                        <CalendarEventTime>{format(zonedDate, "HH:mm")}</CalendarEventTime>
                                    </CalendarEventContent>
                                </CalendarEvent>
                            )
                        })}
                        {dayEvents.length > 2 && (
                            <div className='py-1 px-2 text-xs text-muted-foreground cursor-pointer'>
                                {`+${dayEvents.length - 2} eventos más`}
                            </div>
                        )}
                    </>
                ) : (
                    isCurrentMonth && (
                        <div className='p-4 rounded-md border-2 border-dashed hidden md:flex items-center gap-2 text-muted-foreground text-xs cursor-pointer hover:border-primary hover:text-primary transition-colors overflow-hidden'>
                            <PlusCircle className='size-4 shrink-0' /> <span>Agregar evento</span>
                        </div>
                    )
                )}
            </div>
        </CalendarDay>
    )
})