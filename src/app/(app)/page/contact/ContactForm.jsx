"use client";

import { createInquiryAction } from "@/actions/public/inquiry";
import LoadingSpinner from "@/components/loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";

export default function ContactForm() {
  const { user: currentUser, loading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({
    isAlert: false,
    color: "",
    message: "",
  });

  // Pre-fill user info if available
  const user = currentUser || {};
  const userId = user.id || null;
  const defaultName = user.name || "";
  const defaultEmail = user.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg({ isAlert: false, color: "", message: "" });

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;

    const formData = {
      userId,
      name,
      email,
      subject,
      message,
    };

    try {
      const result = await createInquiryAction(formData);
      if (result.success) {
        setStatusMsg({
          isAlert: true,
          color: "success",
          message: "Thank you! Your message has been sent successfully.",
        });
        form.reset();
      } else {
        setStatusMsg({
          isAlert: true,
          color: "danger",
          message: result.error || "Failed to send message.",
        });
      }
    } catch (e) {
      console.error("Submission error:", e);
      setStatusMsg({
        isAlert: true,
        color: "danger",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid overflow-clip overflow-hidden rounded-xl border-2 bg-muted shadow-xl md:grid-cols-2">
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <div className="grid gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Contact Us</h1>
            <p className="text-balance text-muted-foreground">
              Send us a message and we&apos;ll get back to you.
            </p>
          </div>

          {statusMsg.isAlert && (
            <Alert
              variant={
                statusMsg.color === "success" ? "default" : "destructive"
              }
              className={
                statusMsg.color === "success"
                  ? "border-emerald-500/50 text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-400"
                  : ""
              }
            >
              {statusMsg.color === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {statusMsg.color === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{statusMsg.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your full name"
              defaultValue={defaultName}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              defaultValue={defaultEmail}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="What is this regarding?"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Type your message here..."
              className="resize-none"
              rows={4}
              required
            />
          </div>

          <div className="grid gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
      <div className="relative hidden bg-muted md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/contact.webp"
          alt="Contact Support"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] dark:grayscale"
        />
      </div>
    </div>
  );
}
