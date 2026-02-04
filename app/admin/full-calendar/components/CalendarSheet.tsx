import { CalendarEvent } from "@/components/full-calendar";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface CalendarSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event: any | null;
    onSubmit: (event: any) => void;
}

export default function CalendarSheet({
    open,
    onOpenChange,
    event,
    onSubmit,
}: CalendarSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{event ? "Editar Evento" : "Agregar Evento"}</SheetTitle>
                    <SheetDescription>
                        You can use the <SheetClose>Close</SheetClose> component to close the sheet.
                    </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                    <SheetClose asChild>
                        <button className="btn">Close</button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
