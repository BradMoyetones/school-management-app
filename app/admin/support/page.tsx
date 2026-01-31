"use client";

import React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  MessageCircle,
  Book,
  Video,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";

const faqs = [
  {
    question: "How do I add a new child to the system?",
    answer: "Navigate to the Children section from the sidebar, click 'Add Child', and fill in the required information including name, birthdate, group assignment, and guardian details.",
  },
  {
    question: "How do parents register their children for attendance?",
    answer: "Parents can access their portal, view the calendar, select a date, choose their child, and click 'Register'. This creates a base attendance record that administrators then complete with check-in/check-out times.",
  },
  {
    question: "Can I export attendance reports?",
    answer: "Yes! Go to Analytics & Reports, select your desired date range and filters, then click 'Export Report' to download the data in PDF or CSV format.",
  },
  {
    question: "How do incident notifications work?",
    answer: "When an incident is reported, the system automatically sends an email to the parent/guardian. They can acknowledge receipt through a link in the email, which updates the incident status in your dashboard.",
  },
  {
    question: "How do I manage staff permissions?",
    answer: "Go to Staff & Roles, select the staff member you want to modify, and change their role. Each role (Admin, Director, Teacher, Assistant) has different permission levels.",
  },
];

export default function SupportPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Support request submitted");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help, find answers, and contact our support team.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Documentation</h3>
              <p className="text-sm text-muted-foreground">Browse our guides</p>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
              <Video className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">Watch and learn</p>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Chat with support</p>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Can't find what you're looking for? Send us a message.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="Brief description of your issue" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select a category</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Describe your issue or question in detail..."
                  className="min-h-[120px]"
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <Card>
        <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email us at</p>
              <p className="font-medium text-foreground">support@littlelearners.com</p>
            </div>
          </div>
          <div className="hidden md:block h-10 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Call us at</p>
              <p className="font-medium text-foreground">+1 (800) 555-0123</p>
            </div>
          </div>
          <div className="hidden md:block h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Support Hours</p>
            <p className="font-medium text-foreground">Mon-Fri, 9AM - 6PM EST</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
