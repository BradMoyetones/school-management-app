"use client";

import React from "react"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  LogIn,
  LogOut,
  UserX,
  Check,
  Clock,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Apple,
  Book,
  Sun,
  Users,
  Search,
} from "lucide-react";
import {
  mockChildren,
  mockGroups,
  mockAgendaItems,
  mockActivityTypes,
} from "@/lib/mock-data";
import type { Child } from "@/lib/types";

interface AttendanceRecord {
  childId: string;
  status: "not_checked" | "checked_in" | "checked_out" | "absent";
  checkInTime: string | null;
  checkOutTime: string | null;
  droppedBy: string | null;
  pickedBy: string | null;
  observation: string | null;
}

interface AgendaCompletion {
  childId: string;
  agendaItemId: string;
  completed: boolean;
  observation: string | null;
}

const activityIcons: Record<string, React.ElementType> = {
  apple: Apple,
  book: Book,
  sun: Sun,
};

export default function AttendancePage() {
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 9, 25));
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
  const [agendaSheetOpen, setAgendaSheetOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, AttendanceRecord>
  >(() => {
    const initial: Record<string, AttendanceRecord> = {};
    mockChildren.forEach((child) => {
      if (child.id === "child-2") {
        initial[child.id] = {
          childId: child.id,
          status: "checked_in",
          checkInTime: "08:15 AM",
          checkOutTime: null,
          droppedBy: "Dad",
          pickedBy: null,
          observation: null,
        };
      } else if (child.id === "child-3") {
        initial[child.id] = {
          childId: child.id,
          status: "checked_in",
          checkInTime: "08:30 AM",
          checkOutTime: null,
          droppedBy: "Mom",
          pickedBy: null,
          observation: null,
        };
      } else {
        initial[child.id] = {
          childId: child.id,
          status: "not_checked",
          checkInTime: null,
          checkOutTime: null,
          droppedBy: null,
          pickedBy: null,
          observation: null,
        };
      }
    });
    return initial;
  });

  const [agendaCompletions, setAgendaCompletions] = useState<
    Record<string, AgendaCompletion>
  >(() => {
    const initial: Record<string, AgendaCompletion> = {};
    mockChildren.forEach((child) => {
      mockAgendaItems.forEach((item) => {
        const key = `${child.id}-${item.id}`;
        initial[key] = {
          childId: child.id,
          agendaItemId: item.id,
          completed: Math.random() > 0.5,
          observation: null,
        };
      });
    });
    return initial;
  });

  const filteredChildren =
    selectedGroup === "all"
      ? mockChildren
      : mockChildren.filter((child) => child.group_id === selectedGroup);

  const searchedChildren = filteredChildren.filter(
    (child) =>
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.lastname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockChildren.length,
    present: mockChildren.filter(
      (c) =>
        attendanceRecords[c.id]?.status === "checked_in" ||
        attendanceRecords[c.id]?.status === "checked_out"
    ).length,
    expected: mockChildren.filter(
      (c) => attendanceRecords[c.id]?.status === "not_checked"
    ).length,
    absent: mockChildren.filter(
      (c) => attendanceRecords[c.id]?.status === "absent"
    ).length,
  };

  const handleCheckIn = (child: Child) => {
    setSelectedChild(child);
    setCheckInDialogOpen(true);
  };

  const handleCheckOut = (child: Child) => {
    setSelectedChild(child);
    setCheckOutDialogOpen(true);
  };

  const handleOpenAgenda = (child: Child) => {
    setSelectedChild(child);
    setAgendaSheetOpen(true);
  };

  const confirmCheckIn = (droppedBy: string) => {
    if (!selectedChild) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setAttendanceRecords((prev) => ({
      ...prev,
      [selectedChild.id]: {
        ...prev[selectedChild.id],
        status: "checked_in",
        checkInTime: timeStr,
        droppedBy,
      },
    }));
    setCheckInDialogOpen(false);
    setSelectedChild(null);
    console.log("[v0] Check-in confirmed:", {
      childId: selectedChild.id,
      droppedBy,
      time: timeStr,
    });
  };

  const confirmCheckOut = (pickedBy: string) => {
    if (!selectedChild) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setAttendanceRecords((prev) => ({
      ...prev,
      [selectedChild.id]: {
        ...prev[selectedChild.id],
        status: "checked_out",
        checkOutTime: timeStr,
        pickedBy,
      },
    }));
    setCheckOutDialogOpen(false);
    setSelectedChild(null);
    console.log("[v0] Check-out confirmed:", {
      childId: selectedChild.id,
      pickedBy,
      time: timeStr,
    });
  };

  const markAbsent = (childId: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        status: "absent",
      },
    }));
    console.log("[v0] Marked absent:", { childId });
  };

  const toggleAgendaItem = (childId: string, agendaItemId: string) => {
    const key = `${childId}-${agendaItemId}`;
    setAgendaCompletions((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        completed: !prev[key]?.completed,
      },
    }));
    console.log("[v0] Toggled agenda item:", {
      childId,
      agendaItemId,
      completed: !agendaCompletions[key]?.completed,
    });
  };

  const markAllPresent = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const updates: Record<string, AttendanceRecord> = {};
    searchedChildren.forEach((child) => {
      if (attendanceRecords[child.id]?.status === "not_checked") {
        updates[child.id] = {
          ...attendanceRecords[child.id],
          status: "checked_in",
          checkInTime: timeStr,
          droppedBy: "Bulk check-in",
        };
      }
    });
    setAttendanceRecords((prev) => ({ ...prev, ...updates }));
    console.log("[v0] Bulk check-in:", updates);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const changeDate = (delta: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + delta);
    setSelectedDate(newDate);
  };

  const getChildRecord = (childId: string) => {
    return (
      attendanceRecords[childId] || {
        childId,
        status: "not_checked",
        checkInTime: null,
        checkOutTime: null,
        droppedBy: null,
        pickedBy: null,
        observation: null,
      }
    );
  };

  const getAgendaCompletion = (childId: string, agendaItemId: string) => {
    const key = `${childId}-${agendaItemId}`;
    return agendaCompletions[key]?.completed || false;
  };

  const getChildAgendaProgress = (childId: string) => {
    const completed = mockAgendaItems.filter((item) =>
      getAgendaCompletion(childId, item.id)
    ).length;
    return { completed, total: mockAgendaItems.length };
  };

  const ChildCard = ({ child }: { child: Child }) => {
    const record = getChildRecord(child.id);
    const group = mockGroups.find((g) => g.id === child.group_id);
    const agendaProgress = getChildAgendaProgress(child.id);
    const initials = `${child.name[0]}${child.lastname[0]}`;

    const statusConfig = {
      not_checked: {
        label: "Not checked in",
        borderColor: "border-l-slate-300",
      },
      checked_in: {
        label: "Checked in",
        borderColor: "border-l-green-500",
      },
      checked_out: {
        label: "Checked out",
        borderColor: "border-l-blue-500",
      },
      absent: {
        label: "Absent",
        borderColor: "border-l-red-500",
      },
    };
    const config = statusConfig[record.status];

    return (
      <Card className={`border-l-4 ${config.borderColor}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
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
                {record.status === "checked_in" && (
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {child.name} {child.lastname}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: `${group?.color}20`,
                      color: group?.color,
                    }}
                  >
                    {group?.name}
                  </Badge>
                </div>
                {record.status === "checked_in" && record.checkInTime && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                    <Clock className="h-3 w-3" />
                    {record.checkInTime}
                    {record.droppedBy && (
                      <span className="text-muted-foreground">
                        - {record.droppedBy}
                      </span>
                    )}
                  </div>
                )}
                {record.status === "checked_out" && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 mt-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Out at {record.checkOutTime}
                  </div>
                )}
                {record.status === "absent" && (
                  <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                    <XCircle className="h-3 w-3" />
                    Absent
                  </div>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleCheckIn(child)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Check In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCheckOut(child)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Check Out
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => markAbsent(child.id)}>
                  <UserX className="mr-2 h-4 w-4" />
                  Mark Absent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenAgenda(child)}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Daily Agenda
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Agenda Progress */}
          {record.status === "checked_in" && (
            <div className="mt-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => handleOpenAgenda(child)}
                className="w-full flex items-center justify-between text-sm hover:bg-accent/50 -mx-2 px-2 py-1.5 rounded-md transition-colors"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ClipboardList className="h-4 w-4" />
                  Daily Agenda
                </span>
                <span className="text-foreground font-medium">
                  {agendaProgress.completed}/{agendaProgress.total}
                </span>
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {record.status === "not_checked" && (
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2 bg-transparent"
                onClick={() => markAbsent(child.id)}
              >
                <UserX className="h-4 w-4" />
                Absent
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => handleCheckIn(child)}
              >
                <LogIn className="h-4 w-4" />
                Check In
              </Button>
            </div>
          )}

          {record.status === "checked_in" && (
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full gap-2 bg-transparent"
                onClick={() => handleCheckOut(child)}
              >
                <LogOut className="h-4 w-4" />
                Check Out
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">
            Manage daily attendance and activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 lg:hidden">
            <AvatarFallback className="bg-primary/10 text-primary">
              SJ
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Date Selector */}
      <Card>
        <CardContent className="flex items-center justify-between p-3">
          <Button variant="ghost" size="icon" onClick={() => changeDate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <p className="font-semibold text-foreground">
              {formatDate(selectedDate)}
            </p>
            <p className="text-xs text-muted-foreground uppercase">Today</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => changeDate(1)}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Group Tabs with "All" */}
      <Tabs value={selectedGroup} onValueChange={setSelectedGroup}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all" className="min-w-fit gap-2">
            <Users className="h-4 w-4" />
            All
          </TabsTrigger>
          {mockGroups.map((group) => (
            <TabsTrigger key={group.id} value={group.id} className="min-w-fit">
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground uppercase">Total</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{stats.present}</p>
            <p className="text-xs text-green-600 uppercase">Present</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-700">{stats.expected}</p>
            <p className="text-xs text-amber-600 uppercase">Expected</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-700">{stats.absent}</p>
            <p className="text-xs text-red-600 uppercase">Absent</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search children..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={markAllPresent} className="gap-2 bg-transparent">
          <Check className="h-4 w-4" />
          Mark All Present
        </Button>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Agenda</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchedChildren.map((child) => {
                const record = getChildRecord(child.id);
                const group = mockGroups.find((g) => g.id === child.group_id);
                const agendaProgress = getChildAgendaProgress(child.id);
                const initials = `${child.name[0]}${child.lastname[0]}`;

                return (
                  <TableRow key={child.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          className="h-9 w-9"
                          style={{ backgroundColor: `${group?.color}20` }}
                        >
                          <AvatarFallback
                            style={{ color: group?.color }}
                            className="text-sm font-semibold bg-transparent"
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {child.name} {child.lastname}
                          </p>
                          {child.health_info && (
                            <p className="text-xs text-amber-600">
                              {child.health_info}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: `${group?.color}20`,
                          color: group?.color,
                        }}
                      >
                        {group?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.status === "checked_in" && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <Check className="mr-1 h-3 w-3" />
                          Present
                        </Badge>
                      )}
                      {record.status === "checked_out" && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Checked Out
                        </Badge>
                      )}
                      {record.status === "absent" && (
                        <Badge className="bg-red-100 text-red-700 border-red-200">
                          <XCircle className="mr-1 h-3 w-3" />
                          Absent
                        </Badge>
                      )}
                      {record.status === "not_checked" && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.checkInTime ? (
                        <div className="text-sm">
                          <p className="text-foreground">{record.checkInTime}</p>
                          {record.droppedBy && (
                            <p className="text-xs text-muted-foreground">
                              by {record.droppedBy}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleOpenAgenda(child)}
                      >
                        <ClipboardList className="h-4 w-4" />
                        {agendaProgress.completed}/{agendaProgress.total}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {record.status === "not_checked" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAbsent(child.id)}
                              className="bg-transparent"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleCheckIn(child)}
                            >
                              <LogIn className="h-4 w-4 mr-1" />
                              Check In
                            </Button>
                          </>
                        )}
                        {record.status === "checked_in" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckOut(child)}
                            className="bg-transparent"
                          >
                            <LogOut className="h-4 w-4 mr-1" />
                            Check Out
                          </Button>
                        )}
                        {(record.status === "checked_out" ||
                          record.status === "absent") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCheckIn(child)}
                          >
                            <LogIn className="h-4 w-4 mr-1" />
                            Re-check
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {searchedChildren.map((child) => (
          <ChildCard key={child.id} child={child} />
        ))}
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-2 lg:hidden z-50">
        <div className="flex justify-around">
          <Button
            variant="ghost"
            className="flex-col gap-1 h-auto py-2 text-primary"
          >
            <Check className="h-5 w-5" />
            <span className="text-xs">Attendance</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col gap-1 h-auto py-2 text-muted-foreground"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Agenda</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col gap-1 h-auto py-2 text-muted-foreground"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-xs">Incidents</span>
          </Button>
        </div>
      </div>

      {/* Check-In Dialog */}
      <Dialog open={checkInDialogOpen} onOpenChange={setCheckInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In</DialogTitle>
            <DialogDescription>
              {selectedChild && (
                <span>
                  Checking in {selectedChild.name} {selectedChild.lastname}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Dropped off by</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => confirmCheckIn("Mom")}>
                  Mom
                </Button>
                <Button variant="outline" onClick={() => confirmCheckIn("Dad")}>
                  Dad
                </Button>
                <Button
                  variant="outline"
                  onClick={() => confirmCheckIn("Grandparent")}
                >
                  Grandparent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => confirmCheckIn("Other")}
                >
                  Other
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea placeholder="Any notes about the drop-off..." />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Check-Out Dialog */}
      <Dialog open={checkOutDialogOpen} onOpenChange={setCheckOutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check Out</DialogTitle>
            <DialogDescription>
              {selectedChild && (
                <span>
                  Checking out {selectedChild.name} {selectedChild.lastname}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Picked up by</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => confirmCheckOut("Mom")}
                >
                  Mom
                </Button>
                <Button
                  variant="outline"
                  onClick={() => confirmCheckOut("Dad")}
                >
                  Dad
                </Button>
                <Button
                  variant="outline"
                  onClick={() => confirmCheckOut("Grandparent")}
                >
                  Grandparent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => confirmCheckOut("Other")}
                >
                  Other
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea placeholder="Any notes about the pickup..." />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Agenda Sheet */}
      <Sheet open={agendaSheetOpen} onOpenChange={setAgendaSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Daily Agenda</SheetTitle>
            <SheetDescription>
              {selectedChild && (
                <span>
                  Activities for {selectedChild.name} {selectedChild.lastname} -{" "}
                  {formatDate(selectedDate)}
                </span>
              )}
            </SheetDescription>
          </SheetHeader>

          {selectedChild && (
            <ScrollArea className="h-[calc(100vh-180px)] mt-6">
              <div className="space-y-4 pr-4">
                {mockAgendaItems.map((item) => {
                  const activityType = mockActivityTypes.find(
                    (a) => a.id === item.activity_type_id
                  );
                  const isCompleted = getAgendaCompletion(
                    selectedChild.id,
                    item.id
                  );
                  const Icon =
                    activityType && activityIcons[activityType.icon]
                      ? activityIcons[activityType.icon]
                      : ClipboardList;

                  return (
                    <Card
                      key={item.id}
                      className={isCompleted ? "bg-green-50 border-green-200" : ""}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() =>
                              toggleAgendaItem(selectedChild.id, item.id)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${isCompleted ? "bg-green-100" : "bg-amber-50"}`}
                              >
                                <Icon
                                  className={`h-4 w-4 ${isCompleted ? "text-green-600" : "text-amber-600"}`}
                                />
                              </div>
                              <div>
                                <p
                                  className={`font-medium ${isCompleted ? "text-green-700 line-through" : "text-foreground"}`}
                                >
                                  {activityType?.name || "Activity"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.title}
                                </p>
                              </div>
                            </div>
                            {activityType?.requires_observation && (
                              <div className="mt-3">
                                <Textarea
                                  placeholder="Add observation..."
                                  className="text-sm min-h-[60px]"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                <div className="pt-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      console.log("[v0] Saving agenda for:", selectedChild.id);
                      setAgendaSheetOpen(false);
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Progress
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
