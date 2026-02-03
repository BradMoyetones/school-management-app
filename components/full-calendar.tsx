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
    Locale,
} from "date-fns"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slot } from "@radix-ui/react-slot"

// --- Tipos y Constantes ---

type CalendarViewType = "month" | "week" | "day"

export type CalendarEvent = {
    id: string
    title: string
    description?: string
    start: Date
    end: Date
    color?: "default" | "blue" | "green" | "red" | "yellow" | "purple"
    location?: string
    className?: string
}

type CalendarContextProps = {
    date: Date
    setDate: (date: Date) => void
    view: CalendarViewType
    setView: (view: CalendarViewType) => void
    events: CalendarEvent[]
    eventsByDay: Map<string, CalendarEvent[]>
    setEvents: (events: CalendarEvent[]) => void
    locale?: Locale // date-fns locale
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    days: Date[]
    formattedDate: string
    weekDays: Date[]
}

const CalendarContext = React.createContext<CalendarContextProps | null>(null)

function useCalendar() {
    const context = React.useContext(CalendarContext)
    if (!context) {
        throw new Error("useCalendar must be used within a CalendarProvider")
    }
    return context
}

// --- Provider ---

interface CalendarProviderProps extends React.ComponentProps<"div"> {
    defaultDate?: Date
    defaultView?: CalendarViewType
    events?: CalendarEvent[]
    eventsByDay?: Map<string, CalendarEvent[]>
    locale?: Locale
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 Sunday, 1 Monday
    children: React.ReactNode
}

function CalendarProvider({
    defaultDate = new Date(),
    defaultView = "month",
    events: initialEvents = [],
    locale,
    weekStartsOn = 0,
    className,
    children,
    ...props
}: CalendarProviderProps) {
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
        const map = new Map<string, CalendarEvent[]>()

        for (const event of events) {
            const key = event.start.toDateString()
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(event)
        }

        return map
    }, [events])

    const formattedDate = React.useMemo(() => {
        switch (view) {
            case "month":
                return format(date, "MMMM yyyy", { locale })
            case "week":
                return `Semana de ${format(date, "MMM d", { locale })}`
            case "day":
                return format(date, "EEEE, d MMMM yyyy", { locale })
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
            weekDays
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
            weekDays
        ]
    )

    return (
        <CalendarContext.Provider value={contextValue}>
            <div
                className={cn("flex flex-col h-full w-full", className)}
                {...props}
            >
                {children}
            </div>
        </CalendarContext.Provider>
    )
}

// --- Componentes de Estructura ---

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
            className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
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

function CalendarEventCard({ event, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { event: CalendarEvent }) {
    return (
        <button
            data-slot="calendar-event"
            className={cn(eventVariants({ color: event.color }), className)}
            {...props}
            onClick={(e) => {
                e.stopPropagation()
                props.onClick?.(e)
            }}
        >
            <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-current shrink-0" />
                <span className="truncate font-semibold">{event.title}</span>
                {event.start && (
                    <span className="opacity-70 text-[10px] ml-auto hidden sm:inline-block">
                        {format(event.start, "HH:mm")}
                    </span>
                )}
            </div>
        </button>
    )
}

export {
    CalendarProvider,
    useCalendar,
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
    CalendarEventCard,
}