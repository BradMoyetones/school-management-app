"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  Bell,
  Send,
  Search,
} from "lucide-react";
import { mockChildren } from "@/lib/mock-data";

const incidentFormSchema = z.object({
  child_id: z.string().min(1, "Please select a student"),
  date_time: z.string().min(1, "Date and time is required"),
  severity: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Please select a severity level",
  }),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  action_taken: z.string().optional(),
  parent_notified: z.boolean().default(false),
});

type IncidentFormValues = z.infer<typeof incidentFormSchema>;

const severityOptions = [
  {
    value: "low",
    label: "Low",
    description: "Minor bumps, bruises, or scratches requiring no first aid",
    icon: Bell,
    color: "border-blue-200 bg-blue-50 text-blue-700",
    iconColor: "text-blue-600",
  },
  {
    value: "medium",
    label: "Medium",
    description: "First aid administered. Cuts, scrapes, or minor swelling",
    icon: AlertCircle,
    color: "border-yellow-200 bg-yellow-50 text-yellow-700",
    iconColor: "text-yellow-600",
  },
  {
    value: "high",
    label: "High",
    description: "Medical attention recommended. Deep cuts, sprains, head bumps",
    icon: AlertCircle,
    color: "border-orange-200 bg-orange-50 text-orange-700",
    iconColor: "text-orange-600",
  },
  {
    value: "critical",
    label: "Critical",
    description: "Emergency services called. Severe injury or unconsciousness",
    icon: AlertTriangle,
    color: "border-red-200 bg-red-50 text-red-700",
    iconColor: "text-red-600",
  },
];

export default function NewIncidentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      child_id: "",
      date_time: new Date().toISOString().slice(0, 16),
      severity: undefined,
      title: "",
      description: "",
      action_taken: "",
      parent_notified: false,
    },
  });

  const onSubmit = async (data: IncidentFormValues) => {
    setIsSubmitting(true);
    
    // Log the form data
    console.log("[v0] New incident report submitted:", data);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    
    // Navigate back to incidents list
    router.push("/admin/incidents");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/incidents" className="text-primary hover:underline">
          Incidents
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-primary">New Report</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Incident Report</h1>
        <p className="text-muted-foreground">
          Document details of the incident for school records. Ensure all required fields
          are accurate before submission.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Student & Time */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  1
                </span>
                <h2 className="text-lg font-semibold text-foreground">Student & Time</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="child_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Student Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select a child..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockChildren.map((child) => (
                            <SelectItem key={child.id} value={child.id}>
                              {child.name} {child.lastname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date & Time of Incident <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Severity Level */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  2
                </span>
                <h2 className="text-lg font-semibold text-foreground">
                  Severity Level <span className="text-destructive">*</span>
                </h2>
              </div>

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-3 md:grid-cols-4">
                        {severityOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = field.value === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => field.onChange(option.value)}
                              className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                                isSelected
                                  ? `${option.color} border-current ring-2 ring-current ring-offset-2`
                                  : "border-border bg-card hover:border-muted-foreground/50"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Icon
                                  className={`h-5 w-5 ${
                                    isSelected ? option.iconColor : "text-muted-foreground"
                                  }`}
                                />
                                <span className="font-semibold">{option.label}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {option.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section 3: Incident Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  3
                </span>
                <h2 className="text-lg font-semibold text-foreground">Incident Details</h2>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Incident Title <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fall on playground near slide" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Detailed Description <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe exactly what happened, who was involved, and the environment..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="action_taken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action Taken</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What immediate steps were taken? (e.g., Ice applied, wound cleaned, parents called)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Parent Notification */}
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="parent_notified"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <FormLabel className="text-base font-semibold cursor-pointer">
                          Parent Notifications
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Has a parent or guardian been informed about this incident?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="text-sm text-muted-foreground">
                        Parent Notified
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit Report
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            This report will be logged in the secure school database.{" "}
            <Link href="#" className="text-primary hover:underline">
              View Privacy Policy
            </Link>
            .
          </p>
        </form>
      </Form>
    </div>
  );
}
