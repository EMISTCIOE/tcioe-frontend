"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export default function ContactPage() {
  const [category, setCategory] = useState<string>("");
  const [subscribe, setSubscribe] = useState<boolean>(false);
  const [form, setForm] = useState({ subject: "", email: "", description: "" });
  const [state, setState] = useState<FormState>({ status: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, category, subscribe }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit");
      setState({
        status: "success",
        message: data?.message || "Message received.",
      });
      setForm({ subject: "", email: "", description: "" });
      setCategory("");
      setSubscribe(false);
    } catch (err: any) {
      setState({
        status: "error",
        message: err?.message || "Something went wrong",
      });
    }
  };

  return (
    <AnimatedSection className="container mx-auto px-4 lg:px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-blue mb-2">
          Contact Us
        </h1>
        <p className="text-text-dark mb-8">We’d love to hear from you.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input
                  required
                  placeholder="Subject of your message"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="admissions">Admissions</SelectItem>
                      <SelectItem value="academics">Academics</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  required
                  placeholder="Your message in detail"
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="subscribe"
                  checked={subscribe}
                  onCheckedChange={(v) => setSubscribe(Boolean(v))}
                />
                <label htmlFor="subscribe" className="text-sm text-text-dark">
                  Subscribe to campus newsletters
                </label>
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={state.status === "submitting"}>
                  {state.status === "submitting"
                    ? "Submitting..."
                    : "Send Message"}
                </Button>
              </div>
              {state.status === "success" && (
                <p className="text-green-600 text-sm">{state.message}</p>
              )}
              {state.status === "error" && (
                <p className="text-red-600 text-sm">{state.message}</p>
              )}
            </form>
          </div>

          {/* Contact details & map */}
          <div className="space-y-6">
            <Card className="p-5">
              <h2 className="text-xl font-semibold mb-3">
                Contact Information
              </h2>
              <div className="text-sm text-text-dark space-y-2">
                <p>Thapathali Campus, Institute of Engineering</p>
                <p>Thapathali, Kathmandu 44600, Nepal</p>
                <p>Phone: +977-01-xxxxxxx</p>
                <div className="space-y-1">
                  <p>General: info@tcioe.edu.np</p>
                  <p>Admissions: admissions@tcioe.edu.np</p>
                  <p>Exams: exams@tcioe.edu.np</p>
                </div>
              </div>
            </Card>

            <Card className="p-2 overflow-hidden">
              <iframe
                title="Google Map - Thapathali Campus"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.752784108311!2d85.31625117617288!3d27.694034676190064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19ae08c068d9%3A0x475bed1f66d060c!2sIOE%2C%20Thapathali%20Campus!5e0!3m2!1sen!2snp!4v1758826773147!5m2!1sen!2snp"
                className="w-full h-64 rounded-md border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>

            {/* Placeholder: Dynamic Section Numbers (awaiting API) */}
            <Card className="p-5 bg-yellow-50 border-yellow-200">
              <h3 className="text-base font-semibold mb-2">
                Campus Section Numbers
              </h3>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
