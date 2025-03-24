"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InlineStyle from "@/components/inline-style";

export default function PrivacyPage() {
  return (
    <InlineStyle>
      <div className="flex flex-col min-h-screen bg-black text-white">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60">
          <div className="container mx-auto px-4 flex h-16 items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="inline-flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Pokédex
              </Link>
            </Button>
          </div>
        </header>

        {/* Main content */}
        <section className="py-12 container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-blue-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-slate-400">Last updated: March 25, 2025</p>
            </div>

            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Welcome to the Modern Pokédex privacy policy. This document
                  explains how we collect, use, and protect your information
                  when you use our service.
                </p>
                <p>
                  We respect your privacy and are committed to protecting your
                  personal data. Please read this privacy policy carefully to
                  understand how we handle your information.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We collect several types of information to provide and improve
                  our Service to you:
                </p>

                <h3 className="text-lg font-medium mt-4 mb-2">1. Usage Data</h3>
                <p>
                  We may collect usage data including information about how you
                  interact with our application, pages visited, time spent on
                  the application, and other diagnostic data.
                </p>

                <h3 className="text-lg font-medium mt-4 mb-2">
                  2. Chat Interactions
                </h3>
                <p>
                  When you use the "Chat with Pokémon" feature, we process the
                  messages you send to generate appropriate responses. These
                  messages may be temporarily stored to improve the AI service
                  but are not associated with any personal identifiers.
                </p>

                <h3 className="text-lg font-medium mt-4 mb-2">
                  3. Cookies and Tracking
                </h3>
                <p>
                  We use cookies and similar tracking technologies to track
                  activity on our Service and hold certain information to
                  improve and analyze our Service.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We use the collected data for various purposes:</p>

                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>To provide and maintain our Service</li>
                  <li>To improve and personalize user experience</li>
                  <li>To analyze usage patterns and optimize performance</li>
                  <li>To develop new features and functionality</li>
                  <li>To prevent technical issues and secure our Service</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We retain your information only for as long as necessary to
                  fulfill the purposes outlined in this privacy policy. Usage
                  data may be kept for internal analysis purposes for a longer
                  period.
                </p>
                <p className="mt-4">
                  Chat conversations with Pokémon are stored temporarily to
                  provide the service but are automatically deleted after 30
                  days.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our Service may contain links to other websites or services
                  that are not operated by us. If you click on a third-party
                  link, you will be directed to that third party's site. We
                  strongly advise you to review the Privacy Policy of every site
                  you visit.
                </p>
                <p>
                  We have no control over and assume no responsibility for the
                  content, privacy policies, or practices of any third-party
                  sites or services.
                </p>
                <h3 className="text-lg font-medium mt-4 mb-2">
                  Services We Use:
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>PokéAPI - For Pokémon data</li>
                  <li>Google Gemini API - For AI chat functionality</li>
                  <li>Vercel - For hosting and analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Our Service is suitable for users of all ages. We do not
                  knowingly collect personally identifiable information from
                  anyone under the age of 13. If you are a parent or guardian
                  and you are aware that your child has provided us with
                  personal information, please contact us.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardHeader>
                <CardTitle>Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date.
                </p>
                <p className="mt-4">
                  You are advised to review this Privacy Policy periodically for
                  any changes. Changes to this Privacy Policy are effective when
                  they are posted on this page.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <p className="mt-4 font-medium">email@example.com</p>
                <div className="mt-6 flex justify-center">
                  <Button className="bg-red-500 hover:bg-red-600" asChild>
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto py-8 border-t border-slate-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative h-6 w-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                  <div className="absolute inset-[2px] rounded-full bg-white"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-[1px] w-full bg-black"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full border border-black bg-white"></div>
                </div>
                <span className="text-sm font-medium">
                  © 2025 Modern Pokédex
                </span>
              </div>

              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </InlineStyle>
  );
}
