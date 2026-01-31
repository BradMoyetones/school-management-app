"use client";

import React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertTriangle,
  PartyPopper,
  CalendarOff,
  Grid3X3,
  Clock,
  Apple,
  Book,
  Sun,
  Palette,
  Music,
  Leaf,
  Droplet,
  Brush,
  Trash2,
  X,
} from "lucide-react";
import {
  mockCalendarDays,
  mockActivityTypes,
  mockAgendaItems,
  mockGroups,
} from "@/lib/mock-data";
import type { DailyAgendaItem } from "@/lib/types";

const activityIcons: Record<string, React.ElementType> = {
  apple: Apple,
  book: Book,
  sun: Sun,
  palette: Palette,
  music: Music,
  leaf: Leaf,
  droplet: Droplet,
  brush: Brush,
};

const calendarStats = {
  totalWorkableDays: 22,
  agendasCreated: 18,
  pendingAgendas: 4,
  holidaysClosed: 9,
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [workableDays, setWorkableDays] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      mockCalendarDays.forEach((day) => {
        initial[day.date] = day.is_workable;
      });
      return initial;
    }
  );
  const [agendaItems, setAgendaItems] = useState<DailyAgendaItem[]>(mockAgendaItems);

  const year = 2023;
  const month = 10;
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const getDayData = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return mockCalendarDays.find((d) => d.date === dateStr);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const calDay = mockCalendarDays.find((d) => d.date === dateStr);
    if (!calDay) return [];

    return agendaItems.filter((item) => item.calendar_day_id === calDay.id);
  };

  const toggleWorkableDay = (dateStr: string) => {
    setWorkableDays((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr],
    }));
  };

  const openDaySheet = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setSheetOpen(true);
  };

  const selectedDayData = selectedDate
    ? mockCalendarDays.find((d) => d.date === selectedDate)
    : null;
  const selectedDayAgenda = selectedDayData
    ? agendaItems.filter((item) => item.calendar_day_id === selectedDayData.id)
    : [];

  const addAgendaItem = () => {
    if (!selectedDayData) return;
    const newItem: DailyAgendaItem = {
      id: `agenda-${Date.now()}`,
      activity_type_id: "act-1",
      group_id: null,
      calendar_day_id: selectedDayData.id,
      order_index: selectedDayAgenda.length + 1,
      title: "",
      created_at: new Date().toISOString(),
      updated_at: null,
    };
    setAgendaItems((prev) => [...prev, newItem]);
  };

  const removeAgendaItem = (itemId: string) => {
    setAgendaItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateAgendaItem = (
    itemId: string,
    field: keyof DailyAgendaItem,
    value: string | null
  ) => {
    setAgendaItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveChanges = () => {
    console.log("[v0] Saving calendar day:", {
      date: selectedDate,
      isWorkable: selectedDate ? workableDays[selectedDate] : false,
      agenda: selectedDayAgenda,
    });
    setSheetOpen(false);
  };

  const renderCalendarGrid = () => {
    const days = [];
    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    for (const weekDay of weekDays) {
      days.push(
        <div
          key={`header-${weekDay}`}
          className="p-2 text-center text-xs font-semibold text-muted-foreground"
        >
          {weekDay}
        </div>
      );
    }

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="p-2 text-center text-muted-foreground/30"
        >
          {new Date(
            year,
            month - 2,
            daysInMonth - firstDayOfMonth + i + 1
          ).getDate()}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = getDayData(day);
      const events = getEventsForDay(day);
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isWorkable = workableDays[dateStr] ?? dayData?.is_workable ?? false;
      const dayOfWeek = new Date(year, month - 1, day).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = day === 5;
      const hasStaffSick = day === 5;

      days.push(
        <button
          type="button"
          key={day}
          onClick={() => openDaySheet(day)}
          className={`relative min-h-[80px] md:min-h-[120px] border border-border p-2 transition-colors text-left cursor-pointer ${
            isToday
              ? "bg-primary/5 ring-2 ring-primary ring-inset"
              : "bg-card hover:bg-accent/50"
          } ${isWeekend ? "bg-muted/30" : ""}`}
        >
          <div className="flex items-start justify-between">
            <span
              className={`text-sm font-medium ${
                isToday
                  ? "flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  : isWeekend
                    ? "text-muted-foreground"
                    : "text-foreground"
              }`}
            >
              {day}
            </span>
            {/* Switch solo visible en desktop */}
            {!isWeekend && (
              <div
                className="hidden md:block"
                onClick={(e) => e.stopPropagation()}
              >
                <Switch
                  checked={isWorkable}
                  onCheckedChange={() => toggleWorkableDay(dateStr)}
                  className="scale-75"
                />
              </div>
            )}
          </div>

          {isWeekend && (
            <span className="mt-1 block text-xs text-muted-foreground">
              Weekend
            </span>
          )}

          {/* Indicador mobile de estado */}
          <div className="md:hidden mt-1">
            {!isWeekend && (
              <div
                className={`h-1.5 w-1.5 rounded-full ${isWorkable ? "bg-green-500" : "bg-red-400"}`}
              />
            )}
          </div>

          {/* Events - solo visibles en desktop */}
          <div className="mt-2 space-y-1 hidden md:block">
            {dayData?.description && (
              <div
                className={`w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium ${
                  dayData.description.includes("Holiday")
                    ? "bg-rose-100 text-rose-700"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {dayData.description.includes("Holiday") ? (
                  <span className="flex items-center gap-1">
                    <PartyPopper className="h-3 w-3" />
                    {dayData.description}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {dayData.description}
                  </span>
                )}
              </div>
            )}
            {events.slice(0, 1).map((event) => {
              const activityType = mockActivityTypes.find(
                (a) => a.id === event.activity_type_id
              );
              const Icon = activityType
                ? activityIcons[activityType.icon] || CalendarIcon
                : CalendarIcon;
              return (
                <div
                  key={event.id}
                  className="flex w-full items-center gap-1 truncate rounded bg-slate-100 px-1.5 py-0.5 text-left text-xs text-foreground"
                >
                  <Icon className="h-3 w-3 text-primary" />
                  {activityType?.name || event.title}
                </div>
              );
            })}
            {hasStaffSick && (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                2 Staff Sick
              </div>
            )}
          </div>

          {/* Mobile - mostrar indicadores compactos */}
          <div className="md:hidden mt-1">
            {events.length > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1 py-0 h-4 bg-primary/10 text-primary"
              >
                {events.length}
              </Badge>
            )}
          </div>
        </button>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">October 2023</h1>
          <p className="text-muted-foreground">
            Manage operational status and daily programming.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border bg-card">
            <Button variant="ghost" size="icon" className="rounded-r-none">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="px-4">
              Today
            </Button>
            <Button variant="ghost" size="icon" className="rounded-l-none">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Template</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Grid3X3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Workable Days</p>
              <p className="text-2xl font-bold text-foreground">
                {calendarStats.totalWorkableDays}
              </p>
              <p className="text-xs text-primary hidden sm:block">Standard Month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-2xl font-bold text-foreground">
                {calendarStats.agendasCreated}
              </p>
              <p className="text-xs text-green-600 hidden sm:block">82% Complete</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground">
                {calendarStats.pendingAgendas}
              </p>
              <p className="text-xs text-amber-600 hidden sm:block">Action Needed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <CalendarOff className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Holidays</p>
              <p className="text-2xl font-bold text-foreground">
                {calendarStats.holidaysClosed}
              </p>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Includes weekends
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7">{renderCalendarGrid()}</div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        2023 LittleLearners Inc. All rights reserved.
      </p>

      {/* Day Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              Calendar Management
            </div>
            <SheetTitle className="text-xl">
              {selectedDate &&
                new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Manage this day agenda and settings
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Workable Day Toggle */}
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Workable Day</p>
                    <p className="text-sm text-muted-foreground">
                      Is the school open for children?
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={
                      selectedDate ? (workableDays[selectedDate] ?? false) : false
                    }
                    onCheckedChange={() =>
                      selectedDate && toggleWorkableDay(selectedDate)
                    }
                  />
                  <span className="text-sm text-primary font-medium">
                    {selectedDate && workableDays[selectedDate] ? "Open" : "Closed"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Day Description */}
            <div className="space-y-2">
              <Label>Day Description / Theme</Label>
              <Textarea
                placeholder="e.g., Autumn Leaves Workshop"
                defaultValue={selectedDayData?.description || ""}
                className="min-h-[80px]"
              />
              <p className="text-right text-xs text-muted-foreground">
                {selectedDayData?.description?.length || 0}/500
              </p>
            </div>

            {/* Daily Agenda */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Daily Agenda</h3>
                </div>
                <Badge variant="secondary" className="text-primary">
                  {selectedDayAgenda.length} Activities
                </Badge>
              </div>

              <div className="space-y-3">
                {selectedDayAgenda.length > 0 ? (
                  selectedDayAgenda.map((item) => {
                    const activityType = mockActivityTypes.find(
                      (a) => a.id === item.activity_type_id
                    );
                    const Icon = activityType
                      ? activityIcons[activityType.icon] || CalendarIcon
                      : CalendarIcon;

                    return (
                      <Card key={item.id}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                                <Icon className="h-4 w-4 text-amber-600" />
                              </div>
                              <Select
                                value={item.activity_type_id}
                                onValueChange={(val) =>
                                  updateAgendaItem(item.id, "activity_type_id", val)
                                }
                              >
                                <SelectTrigger className="w-[180px] h-8">
                                  <SelectValue placeholder="Activity Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockActivityTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeAgendaItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Description..."
                            value={item.title || ""}
                            onChange={(e) =>
                              updateAgendaItem(item.id, "title", e.target.value)
                            }
                            className="min-h-[60px] text-sm"
                          />
                          <Select
                            value={item.group_id || "all"}
                            onValueChange={(val) =>
                              updateAgendaItem(
                                item.id,
                                "group_id",
                                val === "all" ? null : val
                              )
                            }
                          >
                            <SelectTrigger className="w-full h-8">
                              <SelectValue placeholder="Target Group" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Ages</SelectItem>
                              {mockGroups.map((group) => (
                                <SelectItem key={group.id} value={group.id}>
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <CalendarIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No activities scheduled for this day
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Button
                  variant="outline"
                  className="w-full gap-2 border-dashed bg-transparent"
                  onClick={addAgendaItem}
                >
                  <Plus className="h-4 w-4" />
                  Add another activity
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 gap-2 bg-transparent"
                onClick={() => setSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 gap-2" onClick={handleSaveChanges}>
                <CheckCircle2 className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
