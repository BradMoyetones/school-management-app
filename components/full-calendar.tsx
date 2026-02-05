"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
    addMonths,
    addWeeks,
    addDays,
    subMonths,
    subWeeks,
    subDays,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isToday,
    type Locale,
} from "date-fns"
import { TZDate } from "@date-fns/tz"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slot } from "@radix-ui/react-slot"

// --- Tipos y Constantes ---

export type CalendarViewType = "month" | "week" | "day"

export type CalendarEventColor = "default" | "blue" | "green" | "red" | "yellow" | "purple"

export interface BaseCalendarEvent {
    start: Date | string
    end: Date | string
    color?: CalendarEventColor
}

type CalendarContextProps<T extends BaseCalendarEvent> = {
    date: Date
    setDate: (date: Date) => void
    view: CalendarViewType
    setView: (view: CalendarViewType) => void
    events: T[]
    eventsByDay: Map<string, T[]>
    setEvents: React.Dispatch<React.SetStateAction<T[]>>
    locale?: Locale // date-fns locale
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    days: Date[]
    formattedDate: string
    weekDays: Date[]
    timezone: string
}

const CalendarContext = React.createContext<CalendarContextProps<any> | null>(null)

function useCalendar<T extends BaseCalendarEvent>() {
    const context = React.useContext(CalendarContext) as CalendarContextProps<T>
    if (!context) {
        throw new Error("useCalendar must be used within a CalendarProvider")
    }
    return context
}

// --- Provider ---

interface CalendarProviderProps<T extends BaseCalendarEvent> extends React.ComponentProps<"div"> {
    defaultDate?: Date
    defaultView?: CalendarViewType
    events?: T[]
    eventsByDay?: Map<string, T[]>
    locale?: Locale
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 Sunday, 1 Monday
    timezone?: string
    children: React.ReactNode
}

function CalendarProvider<T extends BaseCalendarEvent>({
    defaultDate = new Date(),
    defaultView = "month",
    events: initialEvents = [],
    locale,
    weekStartsOn = 0,
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    className,
    children,
    ...props
}: CalendarProviderProps<T>) {
    const [date, setDate] = React.useState(defaultDate)
    const [events, setEvents] = React.useState(initialEvents)
    const [view, setView] = React.useState<CalendarViewType>(defaultView)

    const days = React.useMemo(() => {
        const monthStart = startOfMonth(date)
        const monthEnd = endOfMonth(date)
        const startDate = startOfWeek(monthStart, { weekStartsOn })
        const endDate = endOfWeek(monthEnd, { weekStartsOn })
        return eachDayOfInterval({ start: startDate, end: endDate })
    }, [date, weekStartsOn])

    const eventsByDay = React.useMemo(() => {
        const map = new Map<string, T[]>()

        for (const event of events) {
            // 1. Normalización:
            // Creamos una instancia de TZDate. Esto crea un objeto fecha que "vive" en Bogota (o la zona que sea).
            // Si event.start es string "2026-02-04T05:00Z", TZDate lo convierte a la hora local de la zona target.
            const zonedDate = new TZDate(new Date(event.start), timezone)

            // 2. Generar Clave:
            // Al usar format() sobre un TZDate, date-fns v4 detecta automáticamente la zona.
            // Ya no necesitamos trucos raros.
            const key = format(zonedDate, "yyyy-MM-dd")

            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(event)
        }

        return map
    }, [events, timezone])

    const formattedDate = React.useMemo(() => {
        switch (view) {
            case "month":
                return format(new TZDate(date, timezone), "MMMM yyyy", { locale })
            case "week":
                return `Semana de ${format(new TZDate(date, timezone), "MMM d", { locale })}`
            case "day":
                return format(new TZDate(date, timezone), "EEEE, d MMMM yyyy", { locale })
            default:
                return ""
        }
    }, [date, view, locale])

    const weekDays = React.useMemo(() => {
        const start = startOfWeek(new Date(), { weekStartsOn })
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i))
    }, [date, weekStartsOn])


    const contextValue = React.useMemo(
        () => ({
            date,
            setDate,
            view,
            setView,
            events,
            eventsByDay,
            setEvents,
            locale,
            weekStartsOn,
            days,
            formattedDate,
            weekDays,
            timezone
        }),
        [
            date,
            view,
            events,
            eventsByDay,
            locale,
            weekStartsOn,
            days,
            formattedDate,
            weekDays,
            timezone
        ]
    )

    return (
        <CalendarContext.Provider value={contextValue}>
            <div
                className={cn(className)}
                {...props}
            >
                {children}
            </div>
        </CalendarContext.Provider>
    )
}

// --- Componentes de Estructura ---

function Calendar({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar"
            className={cn("flex flex-col h-full w-full bg-background border rounded-xl overflow-hidden", className)}
            {...props}
        />
    )
}

function CalendarHeader({ className, ...props }: React.ComponentProps<"header">) {
    return (
        <header
            data-slot="calendar-header"
            className={cn("flex items-center justify-between p-4 border-b bg-card", className)}
            {...props}
        />
    )
}

function CalendarTitle({ className, ...props }: React.ComponentProps<"h2">) {
    return (
        <h2
            data-slot="calendar-title"
            className={cn("text-lg font-semibold capitalize", className)}
            {...props}
        />
    )
}

function CalendarDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            data-slot="calendar-description"
            className={cn("text-sm capitalize", className)}
            {...props}
        />
    )
}
// --- Controles de Navegación ---

interface CalendarTriggerProps extends React.ComponentProps<typeof Button> { }

function CalendarPrevTrigger({ asChild, className, ...props }: React.ComponentProps<typeof Button>) {
    const { date, setDate, view } = useCalendar()
    const Comp = asChild ? Slot : Button
    const handlePrev = () => {
        if (view === "month") setDate(subMonths(date, 1))
        else if (view === "week") setDate(subWeeks(date, 1))
        else setDate(subDays(date, 1))
    }

    return (
        <Comp
            data-slot="calendar-prev"
            variant="outline"
            size="icon-sm"
            className={cn(className)}
            onClick={handlePrev}
            {...props}
        >
            {asChild ? props.children : (<><ChevronLeft /> <span className="sr-only">Previous</span></>)}
        </Comp>
    )
}

function CalendarNextTrigger({ asChild, className, ...props }: CalendarTriggerProps) {
    const { date, setDate, view } = useCalendar()
    const Comp = asChild ? Slot : Button
    const handleNext = () => {
        if (view === "month") setDate(addMonths(date, 1))
        else if (view === "week") setDate(addWeeks(date, 1))
        else setDate(addDays(date, 1))
    }

    return (
        <Comp
            data-slot="calendar-next"
            variant="outline"
            size="icon-sm"
            className={cn(className)}
            onClick={handleNext}
            {...props}
        >
            {asChild ? props.children : (<><ChevronRight /> <span className="sr-only">Next</span></>)}
        </Comp>
    )
}

function CalendarTodayTrigger({ asChild, className, ...props }: CalendarTriggerProps) {
    const { setDate } = useCalendar()
    const Comp = asChild ? Slot : Button
    return (
        <Comp
            data-slot="calendar-today"
            variant="outline"
            size="sm"
            className={className}
            onClick={() => setDate(new Date())}
            {...props}
        >
            {asChild ? props.children : "Today"}
        </Comp>
    )
}

// --- View Structures ---

function CalendarBody({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar-body"
            className={cn("flex-1 w-full overflow-hidden flex flex-col", className)}
            {...props}
        />
    )
}

function CalendarMonthView({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar-month-view"
            className={cn("flex flex-col h-full", className)}
            {...props}
        />
    )
}

function CalendarMonthHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar-month-header"
            className={cn("grid grid-cols-7 border-b bg-card", className)}
            {...props}
        />
    )
}

function CalendarMonthHeaderTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar-month-header-title"
            className={cn("p-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide", className)}
            {...props}
        />
    )
}

function CalendarMonthGrid({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="calendar-month-grid" className={cn("grid grid-cols-7 flex-1", className)} {...props} />
}

// --- Day Primitives (The heart of the Lego) ---

const calendarDayVariants = cva(
    "group relative flex flex-col gap-1 border-b border-r p-2 transition-colors hover:bg-accent/5 focus-within:bg-accent/5",
    {
        variants: {
            isCurrentMonth: {
                true: "bg-card",
                false: "bg-muted/20 text-muted-foreground"
            },
            isToday: {
                true: "",
                false: ""
            }
        },
        defaultVariants: {
            isCurrentMonth: true,
            isToday: false
        }
    }
)

type CalendarDayProps =
    React.ComponentProps<"div"> & {
        date: Date
        isCurrentMonth: boolean
        isToday: boolean
    }

const CalendarDay = React.memo(function CalendarDay({
    date,
    isCurrentMonth,
    isToday,
    className,
    ...props
}: CalendarDayProps) {
    return (
        <div
            data-slot="calendar-day"
            data-today={isToday}
            data-current-month={isCurrentMonth}
            className={cn(
                calendarDayVariants({
                    isCurrentMonth,
                    isToday
                }),
                className
            )}
            {...props}
        />
    )
})

function CalendarDayHeader({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="calendar-day-header" className={cn("flex items-center justify-between", className)} {...props} />
}

function CalendarDayDate({ date, className, children, ...props }: React.ComponentProps<"span"> & { date: Date }) {
    const isTodayDate = isToday(date)
    return (
        <span
            data-slot="calendar-day-date"
            data-today={isTodayDate}
            className={cn(
                "flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full text-xs font-medium shrink-0",
                isTodayDate ? "bg-primary text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                className
            )}
            {...props}
        >
            {children || format(date, "d")}
        </span>
    )
}
// --- Event Card ---

const eventVariants = cva(
    "w-full text-left px-2 py-1 rounded-sm text-xs font-medium border truncate transition-all hover:brightness-95 focus:ring-2 ring-primary/20 outline-none cursor-pointer",
    {
        variants: {
            color: {
                default: "bg-primary text-primary-foreground border-primary",
                blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
                green: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
                red: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
                yellow: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
                purple: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
            },
        },
        defaultVariants: {
            color: "default",
        },
    }
)

function CalendarEvent({
    color,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { color?: BaseCalendarEvent["color"] }) {
    return (
        <button
            data-slot="calendar-event"
            className={cn(eventVariants({ color }), className)}
            {...props}
        />
    )
}

function CalendarEventContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar-event-content"
            className={cn("flex items-center gap-1.5", className)}
            {...props}
        />
    )
}

function CalendarEventDot({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="calendar-event-dot"
            className={cn("w-1.5 h-1.5 rounded-full aspect-square bg-current shrink-0", className)}
            {...props}
        />
    )
}

function CalendarEventTitle({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="calendar-event-title"
            className={cn("truncate font-semibold", className)}
            {...props}
        />
    )
}

function CalendarEventTime({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="calendar-event-time"
            className={cn("ml-auto opacity-70 text-[10px] hidden sm:inline-block", className)}
            {...props}
        />
    )
}

export {
    CalendarProvider,
    useCalendar,
    Calendar,
    CalendarHeader,
    CalendarTitle,
    CalendarDescription,
    CalendarPrevTrigger,
    CalendarNextTrigger,
    CalendarTodayTrigger,
    CalendarBody,
    CalendarMonthView,
    CalendarMonthHeader,
    CalendarMonthHeaderTitle,
    CalendarMonthGrid,
    CalendarDay,
    CalendarDayHeader,
    CalendarDayDate,
    CalendarEvent,
    CalendarEventContent,
    CalendarEventDot,
    CalendarEventTitle,
    CalendarEventTime,
}