"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bell,
} from "lucide-react";
import { mockIncidents, mockChildren, mockUsers } from "@/lib/mock-data";

const severityConfig = {
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: AlertTriangle,
    iconColor: "text-red-600",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: AlertCircle,
    iconColor: "text-orange-600",
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: AlertCircle,
    iconColor: "text-yellow-600",
  },
  low: {
    label: "Low",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Bell,
    iconColor: "text-blue-600",
  },
};

export default function IncidentsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const stats = {
    total: mockIncidents.length,
    critical: mockIncidents.filter((i) => i.severity === "critical").length,
    pending: mockIncidents.filter((i) => !i.parent_acknowledged_at).length,
    resolved: mockIncidents.filter((i) => i.parent_acknowledged_at).length,
  };

  const filteredIncidents = mockIncidents.filter((incident) => {
    const child = mockChildren.find((c) => c.id === incident.child_id);
    const matchesSearch =
      searchQuery === "" ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child?.lastname.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || incident.severity === severityFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !incident.parent_acknowledged_at) ||
      (statusFilter === "resolved" && incident.parent_acknowledged_at);
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incident Reports</h1>
          <p className="text-muted-foreground">
            Track, manage, and review all incident reports.
          </p>
        </div>
        <Link href="/admin/incidents/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Report
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <AlertTriangle className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Incidents</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incidents Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => {
                const child = mockChildren.find((c) => c.id === incident.child_id);
                const reporter = mockUsers.find((u) => u.id === incident.reporter_id);
                const config = severityConfig[incident.severity];
                const Icon = config.icon;
                const isResolved = !!incident.parent_acknowledged_at;

                return (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-sm">
                      #{incident.id.split("-")[1]}
                    </TableCell>
                    <TableCell>
                      <Badge className={config.color}>
                        <Icon className={`mr-1 h-3 w-3 ${config.iconColor}`} />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{incident.title}</TableCell>
                    <TableCell>
                      {child && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-slate-100">
                              {child.name[0]}
                              {child.lastname[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {child.name} {child.lastname}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {reporter && (
                        <span className="text-muted-foreground">
                          {reporter.name} {reporter.lastname}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isResolved ? (
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(incident.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/incidents/${incident.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
