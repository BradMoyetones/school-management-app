"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  User,
  CalendarCheck,
  CalendarX,
  AlertCircle,
} from "lucide-react";
import { mockCalendarDays, mockChildren, mockGroups } from "@/lib/mock-data";

// Mock: hijos del padre actual
const parentChildren = mockChildren.filter((c) =>
  ["child-1", "child-2"].includes(c.id)
);

interface Enrollment {
  childId: string;
  calendarDayId: string;
  status: "enrolled" | "not_enrolled";
  enrolledAt: string | null;
}

export default function ParentCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    childId: string | null;
    action: "enroll" | "unenroll";
  }>({ open: false, childId: null, action: "enroll" });
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>(
    () => {
      const initial: Record<string, Enrollment> = {};
      // Pre-enroll some children
      parentChildren.forEach((child) => {
        mockCalendarDays.forEach((day) => {
          if (day.is_workable) {
            const key = `${child.id}-${day.id}`;
            const isEnrolled = Math.random() > 0.3;
            initial[key] = {
              childId: child.id,
              calendarDayId: day.id,
              status: isEnrolled ? "enrolled" : "not_enrolled",
              enrolledAt: isEnrolled ? "2023-10-01T10:00:00Z" : null,
            };
          }
        });
      });
      return initial;
    }
  );

  const year = 2023;
  const month = 10;
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const getDayData = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return mockCalendarDays.find((d) => d.date === dateStr);
  };

  const getEnrollmentStatus = (childId: string, calendarDayId: string) => {
    const key = `${childId}-${calendarDayId}`;
    return enrollments[key]?.status || "not_enrolled";
  };

  const openDaySheet = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setSheetOpen(true);
  };

  const selectedDayData = selectedDate
    ? mockCalendarDays.find((d) => d.date === selectedDate)
    : null;

  const handleEnrollmentAction = (childId: string, action: "enroll" | "unenroll") => {
    setConfirmDialog({ open: true, childId, action });
  };

  const confirmEnrollment = () => {
    if (!confirmDialog.childId || !selectedDayData) return;

    const key = `${confirmDialog.childId}-${selectedDayData.id}`;
    setEnrollments((prev) => ({
      ...prev,
      [key]: {
        childId: confirmDialog.childId!,
        calendarDayId: selectedDayData.id,
        status: confirmDialog.action === "enroll" ? "enrolled" : "not_enrolled",
        enrolledAt:
          confirmDialog.action === "enroll" ? new Date().toISOString() : null,
      },
    }));

    console.log("[v0] Enrollment action:", {
      childId: confirmDialog.childId,
      date: selectedDate,
      action: confirmDialog.action,
    });

    setConfirmDialog({ open: false, childId: null, action: "enroll" });
  };

  const stats = {
    totalEnrolled: Object.values(enrollments).filter(
      (e) => e.status === "enrolled"
    ).length,
    thisMonth: Object.values(enrollments).filter((e) => e.status === "enrolled")
      .length,
    children: parentChildren.length,
  };

  const renderCalendarGrid = () => {
    const days = [];
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    for (const weekDay of weekDays) {
      days.push(
        <div
          key={`header-${weekDay}-${days.length}`}
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
          className="p-2 text-center text-muted-foreground/30 text-sm"
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
      const dayOfWeek = new Date(year, month - 1, day).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = day === 25;
      const isWorkable = dayData?.is_workable ?? false;

      // Count enrollments for this day
      const enrolledCount = parentChildren.filter((child) => {
        if (!dayData) return false;
        return getEnrollmentStatus(child.id, dayData.id) === "enrolled";
      }).length;

      days.push(
        <button
          type="button"
          key={day}
          onClick={() => isWorkable && openDaySheet(day)}
          disabled={!isWorkable}
          className={`relative aspect-square flex flex-col items-center justify-center rounded-lg transition-colors ${
            isToday
              ? "bg-primary text-primary-foreground"
              : isWeekend || !isWorkable
                ? "bg-muted/30 text-muted-foreground cursor-not-allowed"
                : "bg-card hover:bg-accent cursor-pointer border border-border"
          }`}
        >
          <span className="text-sm font-medium">{day}</span>
          {isWorkable && enrolledCount > 0 && !isToday && (
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: enrolledCount }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-green-500"
                />
              ))}
            </div>
          )}
          {isWorkable && enrolledCount > 0 && isToday && (
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: enrolledCount }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-primary-foreground"
                />
              ))}
            </div>
          )}
          {!isWorkable && !isWeekend && (
            <CalendarX className="h-3 w-3 text-muted-foreground/50 mt-0.5" />
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Attendance Calendar
              </h1>
              <p className="text-sm text-muted-foreground">
                Enroll your children for upcoming days
              </p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                MP
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.children}</p>
              <p className="text-xs text-muted-foreground">Children</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-700">
                {stats.thisMonth}
              </p>
              <p className="text-xs text-green-600">Days Enrolled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">22</p>
              <p className="text-xs text-muted-foreground">Available Days</p>
            </CardContent>
          </Card>
        </div>

        {/* Children List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Children</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {parentChildren.map((child) => {
              const group = mockGroups.find((g) => g.id === child.group_id);
              const initials = `${child.name[0]}${child.lastname[0]}`;
              return (
                <div
                  key={child.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <Avatar
                    className="h-10 w-10"
                    style={{ backgroundColor: `${group?.color}20` }}
                  >
                    <AvatarFallback
                      style={{ color: group?.color }}
                      className="font-semibold bg-transparent"
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {child.name} {child.lastname}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {group?.name || "No Group"}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: `${group?.color}20`,
                      color: group?.color,
                    }}
                  >
                    {group?.name}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">October 2023</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">{renderCalendarGrid()}</div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Enrolled
              </div>
              <div className="flex items-center gap-1">
                <CalendarX className="h-3 w-3" />
                Closed
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Day Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle className="text-left">
              {selectedDate &&
                new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
            </SheetTitle>
            <SheetDescription>
              {selectedDayData?.is_workable
                ? "Enroll or remove your children for this day"
                : "This day is not available for enrollment"}
            </SheetDescription>
          </SheetHeader>

          {selectedDayData?.is_workable ? (
            <div className="mt-6 space-y-4">
              {selectedDayData.description && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-3 flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">
                        {selectedDayData.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Special day planned
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <p className="font-medium text-foreground">Enrollment Status</p>
                {parentChildren.map((child) => {
                  const group = mockGroups.find((g) => g.id === child.group_id);
                  const initials = `${child.name[0]}${child.lastname[0]}`;
                  const isEnrolled =
                    getEnrollmentStatus(child.id, selectedDayData.id) ===
                    "enrolled";

                  return (
                    <Card
                      key={child.id}
                      className={
                        isEnrolled
                          ? "border-green-200 bg-green-50"
                          : "border-border"
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar
                              className="h-12 w-12"
                              style={{ backgroundColor: `${group?.color}20` }}
                            >
                              <AvatarFallback
                                style={{ color: group?.color }}
                                className="font-semibold bg-transparent"
                              >
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">
                                {child.name} {child.lastname}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {group?.name}
                              </p>
                            </div>
                          </div>
                          {isEnrolled ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Enrolled
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Enrolled</Badge>
                          )}
                        </div>

                        <div className="mt-4">
                          {isEnrolled ? (
                            <Button
                              variant="outline"
                              className="w-full gap-2 bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                handleEnrollmentAction(child.id, "unenroll")
                              }
                            >
                              <CalendarX className="h-4 w-4" />
                              Remove Enrollment
                            </Button>
                          ) : (
                            <Button
                              className="w-full gap-2"
                              onClick={() =>
                                handleEnrollmentAction(child.id, "enroll")
                              }
                            >
                              <CalendarCheck className="h-4 w-4" />
                              Enroll for this Day
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center py-12">
              <CalendarX className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium text-foreground">Day Not Available</p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                This day is closed or not available for enrollment.
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ ...confirmDialog, open })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === "enroll"
                ? "Confirm Enrollment"
                : "Remove Enrollment"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === "enroll"
                ? "Are you sure you want to enroll your child for this day?"
                : "Are you sure you want to remove the enrollment for this day?"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {confirmDialog.childId && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">
                    {
                      parentChildren.find((c) => c.id === confirmDialog.childId)
                        ?.name
                    }{" "}
                    {
                      parentChildren.find((c) => c.id === confirmDialog.childId)
                        ?.lastname
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate &&
                      new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ open: false, childId: null, action: "enroll" })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={confirmEnrollment}
              variant={
                confirmDialog.action === "unenroll" ? "destructive" : "default"
              }
            >
              {confirmDialog.action === "enroll" ? "Enroll" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
