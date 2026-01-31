"use client";

import { use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ArrowLeft,
  Printer,
  Download,
  Clock,
  Send,
  Mail,
  User,
  FileText,
  AlertCircle,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { mockIncidents, mockChildren, mockUsers, mockGroups } from "@/lib/mock-data";

const severityConfig = {
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: AlertTriangle,
    iconColor: "text-red-600",
    borderColor: "border-l-red-500",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: AlertCircle,
    iconColor: "text-orange-600",
    borderColor: "border-l-orange-500",
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: AlertCircle,
    iconColor: "text-yellow-600",
    borderColor: "border-l-yellow-500",
  },
  low: {
    label: "Low",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Bell,
    iconColor: "text-blue-600",
    borderColor: "border-l-blue-500",
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function IncidentDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const incident = mockIncidents.find((i) => i.id === id);
  const child = incident
    ? mockChildren.find((c) => c.id === incident.child_id)
    : null;
  const reporter = incident
    ? mockUsers.find((u) => u.id === incident.reporter_id)
    : null;
  const childGroup = child?.group_id
    ? mockGroups.find((g) => g.id === child.group_id)
    : null;

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold text-foreground">
          Incident not found
        </h1>
        <p className="text-muted-foreground mt-2">
          The incident you are looking for does not exist.
        </p>
        <Link href="/admin/incidents">
          <Button variant="outline" className="mt-4 gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Incidents
          </Button>
        </Link>
      </div>
    );
  }

  const config = severityConfig[incident.severity];
  const Icon = config.icon;

  const handleResendNotification = () => {
    console.log("[v0] Resending notification for incident:", incident.id);
  };

  const handleExportPDF = () => {
    console.log("[v0] Exporting incident to PDF:", incident.id);
  };

  const handlePrint = () => {
    console.log("[v0] Printing incident:", incident.id);
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin" className="text-primary hover:underline">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href="/admin/incidents" className="text-primary hover:underline">
          Incidents
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">
          Incident #{id.split("-")[1]}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Incident #{id.split("-")[1]}
          </h1>
          <p className="text-muted-foreground">
            Reported on{" "}
            {new Date(incident.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at{" "}
            {new Date(incident.created_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button className="gap-2" onClick={handleExportPDF}>
            <Download className="h-4 w-4" />
            Export to PDF
          </Button>
        </div>
      </div>

      {/* Severity Badge */}
      <Card className={`border-l-4 ${config.borderColor}`}>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Badge className={config.color}>
            <Icon className={`mr-1 h-3 w-3 ${config.iconColor}`} />
            {config.label} Severity
          </Badge>
          {incident.parent_notified && !incident.parent_acknowledged_at && (
            <Badge variant="secondary" className="bg-amber-50 text-amber-700">
              <Clock className="mr-1 h-3 w-3" />
              Pending Acknowledgement
            </Badge>
          )}
          {incident.parent_acknowledged_at && (
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Parent Acknowledged
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Title */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {incident.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase text-primary mb-2">
                  Description
                </p>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {incident.description}
                </p>
              </div>

              {incident.action_taken && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary mb-2">
                      Action Taken
                    </p>
                    <p className="text-foreground leading-relaxed bg-slate-50 rounded-lg p-4 border-l-2 border-primary">
                      {incident.action_taken}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">
                      Incident Reported
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-primary text-xs">
                      {new Date(incident.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(incident.created_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground italic">
                    Incident report created by {reporter?.name} {reporter?.lastname}
                  </p>
                </div>
              </div>

              {incident.parent_notified && (
                <div className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-foreground">
                        Parent Notified
                      </span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-primary text-xs">
                        {new Date(incident.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground italic">
                      Notification sent to parent/guardian
                    </p>
                  </div>
                </div>
              )}

              {incident.parent_acknowledged_at && (
                <div className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-foreground">
                        Parent Acknowledged
                      </span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-primary text-xs">
                        {new Date(incident.parent_acknowledged_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}{" "}
                        at{" "}
                        {new Date(incident.parent_acknowledged_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground italic">
                      Parent reviewed and acknowledged the incident
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Parent Acknowledgement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase text-primary">
                Parent Acknowledgement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {incident.parent_acknowledged_at ? (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Acknowledged</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(incident.parent_acknowledged_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              ) : incident.parent_notified ? (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-3">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Waiting for Review
                  </h3>
                  <p className="text-sm text-primary mt-1">
                    Notification sent
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3">
                    <Bell className="h-6 w-6 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Not Notified
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Parent has not been notified yet
                  </p>
                </div>
              )}
              {incident.parent_notified && !incident.parent_acknowledged_at && (
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  onClick={handleResendNotification}
                >
                  <Send className="h-4 w-4" />
                  Resend Notification
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Parties Involved */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase text-primary">
                Parties Involved
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Student */}
              {child && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className="font-semibold"
                      style={{
                        backgroundColor: `${childGroup?.color}20`,
                        color: childGroup?.color,
                      }}
                    >
                      {child.name[0]}
                      {child.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary">
                      Student
                    </p>
                    <p className="font-semibold text-foreground">
                      {child.name} {child.lastname}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {childGroup?.name || "No Group"} - ID: {child.document}
                    </p>
                    {child.health_info && (
                      <Badge
                        variant="secondary"
                        className="mt-1 bg-amber-50 text-amber-700"
                      >
                        {child.health_info}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Reporter */}
              {reporter && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {reporter.name[0]}
                      {reporter.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary">
                      Reported By
                    </p>
                    <p className="font-semibold text-foreground">
                      {reporter.name} {reporter.lastname}
                    </p>
                    <p className="text-sm text-muted-foreground">Staff Member</p>
                    <Link
                      href={`mailto:${reporter.email}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                    >
                      <Mail className="h-3 w-3" />
                      Contact
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Incident Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase text-primary">
                Child Incident History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total incidents (YTD)
                  </span>
                  <span className="font-semibold text-foreground">
                    {
                      mockIncidents.filter((i) => i.child_id === incident.child_id)
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    This is incident #
                  </span>
                  <span className="font-semibold text-foreground">
                    {mockIncidents
                      .filter((i) => i.child_id === incident.child_id)
                      .findIndex((i) => i.id === incident.id) + 1}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4">
        <Link href="/admin/incidents">
          <Button variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to All Incidents
          </Button>
        </Link>
      </div>
    </div>
  );
}
