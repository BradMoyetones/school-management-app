"use client";

import { useMemo } from "react";
import {
  Line,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  TrendingUp,
  Download,
  Calendar,
  AlertTriangle,
  Filter,
  Baby,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  UserCheck,
  Activity,
} from "lucide-react";
import {
  mockIncidents,
  mockChildren,
  mockGroups,
  mockPosts,
  mockCalendarDays,
  mockAttendance,
  mockAgendaItems,
  mockUsers,
} from "@/lib/mock-data";

const chartColors = {
  present: "#3B82F6",
  absent: "#94A3B8",
  primary: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
};

const SEVERITY_COLORS = {
  critical: "#EF4444",
  high: "#F97316",
  medium: "#EAB308",
  low: "#3B82F6",
};

export default function AnalyticsPage() {
  // Calculate real statistics from mock data
  const stats = useMemo(() => {
    const totalChildren = mockChildren.filter((c) => c.is_active).length;
    const totalCapacity = 160; // mock capacity

    // Attendance stats
    const checkedIn = mockAttendance.filter((a) => a.attended).length;
    const totalAttendanceRecords = mockAttendance.length;
    const attendanceRate =
      totalAttendanceRecords > 0
        ? Math.round((checkedIn / totalAttendanceRecords) * 100)
        : 0;

    // Incident stats
    const openIncidents = mockIncidents.filter(
      (i) => !i.parent_acknowledged_at
    ).length;
    const acknowledgedIncidents = mockIncidents.filter(
      (i) => i.parent_acknowledged_at
    ).length;

    // Group distribution
    const groupDistribution = mockGroups.map((group) => ({
      name: group.name,
      count: mockChildren.filter((c) => c.group_id === group.id && c.is_active)
        .length,
      color: group.color,
    }));

    // Incident severity distribution
    const severityDistribution = {
      critical: mockIncidents.filter((i) => i.severity === "critical").length,
      high: mockIncidents.filter((i) => i.severity === "high").length,
      medium: mockIncidents.filter((i) => i.severity === "medium").length,
      low: mockIncidents.filter((i) => i.severity === "low").length,
    };

    // Calendar stats
    const workableDays = mockCalendarDays.filter((d) => d.is_workable).length;
    const totalDays = mockCalendarDays.length;

    // Posts stats
    const totalPosts = mockPosts.length;
    const postsWithMedia = mockPosts.filter(
      (p) => p.media_urls && p.media_urls.length > 0
    ).length;

    // Agenda stats
    const totalAgendaItems = mockAgendaItems.length;

    return {
      totalChildren,
      totalCapacity,
      capacityUtilization: Math.round((totalChildren / totalCapacity) * 100),
      slotsAvailable: totalCapacity - totalChildren,
      attendanceRate,
      checkedIn,
      openIncidents,
      acknowledgedIncidents,
      totalIncidents: mockIncidents.length,
      groupDistribution,
      severityDistribution,
      workableDays,
      totalDays,
      totalPosts,
      postsWithMedia,
      totalAgendaItems,
      staffCount: mockUsers.length,
    };
  }, []);

  // Generate attendance trend data
  const attendanceTrend = useMemo(() => {
    return [
      { date: "Oct 1", present: 125, absent: 17 },
      { date: "Oct 5", present: 130, absent: 12 },
      { date: "Oct 10", present: 128, absent: 14 },
      { date: "Oct 15", present: 135, absent: 7 },
      { date: "Oct 20", present: 138, absent: 4 },
      { date: "Oct 25", present: 132, absent: 10 },
      { date: "Oct 31", present: 140, absent: 2 },
    ];
  }, []);

  // Incident by day data
  const incidentsByDay = useMemo(() => {
    const dayMap: Record<string, number> = {};
    mockIncidents.forEach((incident) => {
      const day = new Date(incident.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    return Object.entries(dayMap).map(([day, count]) => ({ day, count }));
  }, []);

  // Pie chart data for groups
  const pieData = stats.groupDistribution.map((g) => ({
    name: g.name,
    value: g.count,
    color: g.color,
  }));

  const handleExportReport = () => {
    console.log("[v0] Exporting analytics report...");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Operational Analytics
          </h1>
          <p className="text-muted-foreground">
            Real-time overview of attendance, capacity, and operational incidents.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="oct">
            <SelectTrigger className="w-48">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oct">Oct 1 - Oct 31, 2023</SelectItem>
              <SelectItem value="sep">Sep 1 - Sep 30, 2023</SelectItem>
              <SelectItem value="aug">Aug 1 - Aug 31, 2023</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-36">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {mockGroups.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="gap-2" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Children */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Baby className="h-6 w-6 text-primary" />
              </div>
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 border-0"
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                Active
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Children</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalChildren}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Capacity Utilization */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                <Building2 className="h-6 w-6 text-teal-600" />
              </div>
              <Badge variant="secondary" className="border-0">
                {stats.slotsAvailable} slots free
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Capacity</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-foreground">
                  {stats.capacityUtilization}%
                </p>
                <Progress
                  value={stats.capacityUtilization}
                  className="flex-1 h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Today */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 border-0"
              >
                Today
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Checked In</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.checkedIn}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Incidents */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              {stats.openIncidents > 0 && (
                <Badge variant="destructive">Action Needed</Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Open Incidents</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.openIncidents}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Trends Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Attendance Trends
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <span className="text-muted-foreground">Absent</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                present: {
                  label: "Present",
                  color: chartColors.present,
                },
                absent: {
                  label: "Absent",
                  color: chartColors.absent,
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={attendanceTrend}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartColors.present}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartColors.present}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke={chartColors.present}
                    strokeWidth={2}
                    fill="url(#colorPresent)"
                  />
                  <Line
                    type="monotone"
                    dataKey="absent"
                    stroke={chartColors.absent}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Group Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Children by Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Children",
                },
              }}
              className="h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Incidents by Severity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Incidents by Severity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Incidents",
                },
              }}
              className="h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Critical",
                      count: stats.severityDistribution.critical,
                      fill: SEVERITY_COLORS.critical,
                    },
                    {
                      name: "High",
                      count: stats.severityDistribution.high,
                      fill: SEVERITY_COLORS.high,
                    },
                    {
                      name: "Medium",
                      count: stats.severityDistribution.medium,
                      fill: SEVERITY_COLORS.medium,
                    },
                    {
                      name: "Low",
                      count: stats.severityDistribution.low,
                      fill: SEVERITY_COLORS.low,
                    },
                  ]}
                  layout="vertical"
                  margin={{ top: 0, right: 0, left: 60, bottom: 0 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={4}>
                    {[
                      SEVERITY_COLORS.critical,
                      SEVERITY_COLORS.high,
                      SEVERITY_COLORS.medium,
                      SEVERITY_COLORS.low,
                    ].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Recent Incidents
            </CardTitle>
            <Button variant="link" className="h-auto p-0 text-primary">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockIncidents.slice(0, 4).map((incident) => {
              const child = mockChildren.find((c) => c.id === incident.child_id);
              const severityColors = {
                critical: "bg-red-50 border-l-red-500",
                high: "bg-orange-50 border-l-orange-500",
                medium: "bg-yellow-50 border-l-yellow-500",
                low: "bg-blue-50 border-l-blue-500",
              };
              const severityLabels = {
                critical: "CRITICAL",
                high: "HIGH",
                medium: "MEDIUM",
                low: "LOW",
              };
              const statusLabels = {
                critical: "text-red-600",
                high: "text-orange-600",
                medium: "text-yellow-600",
                low: "text-blue-600",
              };

              return (
                <div
                  key={incident.id}
                  className={`rounded-lg border-l-4 p-3 ${severityColors[incident.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold uppercase ${statusLabels[incident.severity]}`}
                      >
                        {severityLabels[incident.severity]}
                      </span>
                      {incident.parent_acknowledged_at ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 text-[10px] h-5"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Acknowledged
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-700 text-[10px] h-5"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(incident.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h4 className="mt-1 font-medium text-foreground">
                    {incident.title}
                  </h4>
                  {child && (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[8px] bg-slate-200">
                          {child.name[0]}
                          {child.lastname[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {child.name} {child.lastname}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Workable Days</p>
                <p className="text-xl font-bold text-foreground">
                  {stats.workableDays}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{stats.totalDays}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agenda Items</p>
                <p className="text-xl font-bold text-foreground">
                  {stats.totalAgendaItems}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50">
                <FileText className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posts</p>
                <p className="text-xl font-bold text-foreground">
                  {stats.totalPosts}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    ({stats.postsWithMedia} media)
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50">
                <Users className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staff Members</p>
                <p className="text-xl font-bold text-foreground">
                  {stats.staffCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Distribution Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Group Capacity Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockGroups.map((group) => {
            const childrenInGroup = mockChildren.filter(
              (c) => c.group_id === group.id && c.is_active
            ).length;
            const groupCapacity = [16, 30, 50, 64][mockGroups.indexOf(group)];
            const percentage = Math.round((childrenInGroup / groupCapacity) * 100);

            return (
              <div key={group.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {group.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({group.min_age}-{group.max_age} months)
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {childrenInGroup}/{groupCapacity} Enrolled ({percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: group.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
