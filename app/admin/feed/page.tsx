"use client";

import React from "react"

import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
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
  MoreHorizontal,
  ImagePlus,
  Paperclip,
  Smile,
  Send,
  Calendar,
  Trash2,
  Flag,
  Edit,
  Eye,
} from "lucide-react";
import { mockPosts, mockUsers, mockGroups, upcomingEvents } from "@/lib/mock-data";
import type { Post } from "@/lib/types";

const postFormSchema = z.object({
  content: z.string().min(1, "Post content is required"),
});

type PostFormValues = z.infer<typeof postFormSchema>;

// Lexical content renderer
interface LexicalNode {
  type: string;
  text?: string;
  format?: number;
  children?: LexicalNode[];
}

interface LexicalRoot {
  root: {
    children: LexicalNode[];
  };
}

function renderLexicalNode(node: LexicalNode, index: number): React.ReactNode {
  if (node.type === "text") {
    let content: React.ReactNode = node.text || "";
    // format: 1 = bold, 2 = italic, 3 = bold+italic
    if (node.format === 1) {
      content = <strong key={index}>{content}</strong>;
    } else if (node.format === 2) {
      content = <em key={index}>{content}</em>;
    } else if (node.format === 3) {
      content = (
        <strong key={index}>
          <em>{content}</em>
        </strong>
      );
    }
    return <span key={index}>{content}</span>;
  }

  if (node.type === "paragraph") {
    return (
      <p key={index} className="mb-2 last:mb-0">
        {node.children?.map((child, i) => renderLexicalNode(child, i))}
      </p>
    );
  }

  if (node.type === "root") {
    return node.children?.map((child, i) => renderLexicalNode(child, i));
  }

  return null;
}

function LexicalViewer({ content }: { content: string }) {
  const parsed = useMemo(() => {
    try {
      return JSON.parse(content) as LexicalRoot;
    } catch {
      // If not valid JSON, render as plain text
      return null;
    }
  }, [content]);

  if (!parsed) {
    return <p className="text-foreground leading-relaxed">{content}</p>;
  }

  return (
    <div className="text-foreground leading-relaxed">
      {renderLexicalNode(parsed.root, 0)}
    </div>
  );
}

export default function CommunityFeedPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const filterButtons = [
    { id: "all", label: "All Groups" },
    { id: "group-1", label: "Infants" },
    { id: "group-2", label: "Toddlers" },
    { id: "group-3", label: "Preschool" },
  ];

  const filteredPosts = mockPosts.filter((post) => {
    if (activeFilter === "all") return true;
    return post.group_id === activeFilter || post.group_id === null;
  });

  const onSubmit = (data: PostFormValues) => {
    // Create Lexical-formatted content
    const lexicalContent = {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: data.content,
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    };
    console.log("[v0] New post submitted:", {
      content: JSON.stringify(lexicalContent),
      plainText: data.content,
    });
    form.reset();
  };

  const handleDeletePost = (postId: string) => {
    console.log("[v0] Deleting post:", postId);
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date("2023-10-24T18:00:00Z");
    const date = new Date(dateStr);
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  const getUserRole = (userId: string): { label: string; color: string } => {
    if (userId === "user-1")
      return { label: "Admin", color: "bg-primary text-primary-foreground" };
    if (userId === "user-2")
      return { label: "Staff", color: "bg-green-100 text-green-700" };
    return { label: "Parent", color: "bg-slate-100 text-slate-700" };
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Feed Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Feed</h1>
          <p className="text-muted-foreground">
            Updates, photos, and announcements from your daycare community.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={
                activeFilter !== filter.id ? "bg-transparent" : undefined
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* New Post Form */}
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea
                            placeholder="Share an update with the parents..."
                            className="min-h-[80px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <ImagePlus className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button type="submit" className="gap-2">
                    Post
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const author = mockUsers.find((u) => u.id === post.author_id);
            const group = post.group_id
              ? mockGroups.find((g) => g.id === post.group_id)
              : null;
            const role = getUserRole(post.author_id);

            return (
              <Card key={post.id}>
                <CardContent className="p-4 space-y-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-slate-100 text-slate-600">
                          {author
                            ? `${author.name[0]}${author.lastname[0]}`
                            : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {author
                              ? `${author.name} ${author.lastname}`
                              : "Unknown"}
                          </span>
                          <Badge className={role.color}>{role.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(post.created_at)}
                          {group && ` - ${group.name} Group`}
                          {!group &&
                            post.author_id === "user-1" &&
                            " - All Parents"}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewPost(post)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Post
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Post
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Flag className="mr-2 h-4 w-4" />
                          Report
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Post Content - Lexical Viewer */}
                  <LexicalViewer content={post.content} />

                  {/* Media */}
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {post.media_urls.slice(0, 2).map((url, index) => (
                        <div
                          key={url}
                          className="relative aspect-square rounded-lg bg-slate-100 overflow-hidden"
                        >
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Post media ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          {post.media_urls &&
                            post.media_urls.length > 2 &&
                            index === 1 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                  +{post.media_urls.length - 2}
                                </span>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Post metadata */}
                  <div className="flex items-center gap-4 pt-2 border-t border-border text-xs text-muted-foreground">
                    <span>
                      Posted{" "}
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {group && (
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: `${group.color}20`,
                          color: group.color,
                        }}
                      >
                        {group.name}
                      </Badge>
                    )}
                    {!group && <Badge variant="secondary">All Groups</Badge>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <Button variant="link" className="h-auto p-0 text-primary">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => {
              const date = new Date(event.date);
              return (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-slate-100 px-3 py-2 min-w-[50px]">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      {date.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-xl font-bold text-foreground">
                      {date.getDate().toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {event.title}
                    </h4>
                    <p className="text-sm text-primary">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Feed Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Posts</span>
              <span className="font-semibold text-foreground">
                {mockPosts.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Posts with Media
              </span>
              <span className="font-semibold text-foreground">
                {mockPosts.filter((p) => p.media_urls && p.media_urls.length > 0).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Global Announcements
              </span>
              <span className="font-semibold text-foreground">
                {mockPosts.filter((p) => !p.group_id).length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">
            Privacy Policy
          </a>
          <span>-</span>
          <a href="#" className="hover:text-foreground">
            Terms of Service
          </a>
          <span>-</span>
          <a href="#" className="hover:text-foreground">
            Help Center
          </a>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          2023 LittleLearners Inc.
        </p>
      </div>

      {/* Post Preview Dialog */}
      <Dialog open={!!previewPost} onOpenChange={() => setPreviewPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post Preview</DialogTitle>
            <DialogDescription>
              Viewing post content in Lexical format
            </DialogDescription>
          </DialogHeader>
          {previewPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-100 text-slate-600">
                    {mockUsers.find((u) => u.id === previewPost.author_id)
                      ?.name[0] || "?"}
                    {mockUsers.find((u) => u.id === previewPost.author_id)
                      ?.lastname[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {mockUsers.find((u) => u.id === previewPost.author_id)
                      ?.name}{" "}
                    {mockUsers.find((u) => u.id === previewPost.author_id)
                      ?.lastname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(previewPost.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <LexicalViewer content={previewPost.content} />
              </div>
              {previewPost.media_urls && previewPost.media_urls.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {previewPost.media_urls.map((url, index) => (
                    <img
                      key={url}
                      src={url || "/placeholder.svg"}
                      alt={`Media ${index + 1}`}
                      className="rounded-lg object-cover aspect-video"
                    />
                  ))}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Raw Lexical JSON:</p>
                <pre className="bg-slate-100 p-2 rounded text-xs overflow-x-auto max-h-32">
                  {JSON.stringify(JSON.parse(previewPost.content), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
