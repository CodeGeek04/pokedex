"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Github, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InlineStyle from "@/components/inline-style";

export default function AboutPage() {
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

        {/* Hero section */}
        <section className="bg-gradient-to-b from-red-600 to-red-800 py-12 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              About Modern Pokédex
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              A comprehensive guide to the world of Pokémon, designed for
              trainers of all levels.
            </p>
          </div>

          {/* Background decoration */}
          <div className="absolute -right-16 -bottom-16 opacity-10">
            <div className="w-64 h-64 rounded-full border-[16px] border-white relative">
              <div className="absolute top-1/2 left-0 right-0 h-[16px] bg-white -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The Modern Pokédex is built to be the ultimate companion for
                    Pokémon fans and trainers. Our mission is to provide
                    comprehensive, accurate information about all Pokémon,
                    regions, moves, and more in an easy-to-use, modern
                    interface.
                  </p>
                  <p>
                    Whether you're a competitive player looking for detailed
                    stats, a collector tracking your progress, or a casual fan
                    exploring the wonderful world of Pokémon, our Pokédex is
                    designed with you in mind.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <h3 className="font-bold mb-2">Comprehensive Database</h3>
                      <p className="text-slate-300">
                        Detailed information on all Pokémon, including stats,
                        abilities, evolutions, and more.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <h3 className="font-bold mb-2">Region Guides</h3>
                      <p className="text-slate-300">
                        Explore the different regions of the Pokémon world, with
                        details on locations and native Pokémon.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <h3 className="font-bold mb-2">Chat with Pokémon</h3>
                      <p className="text-slate-300">
                        Unique AI experience that lets you have conversations
                        with your favorite Pokémon characters.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <h3 className="font-bold mb-2">Advanced Search</h3>
                      <p className="text-slate-300">
                        Find exactly what you're looking for with powerful
                        filtering and sorting options.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Technology</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Modern Pokédex is built using cutting-edge web technologies
                    to provide a fast, responsive experience:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-600">Next.js</Badge>
                    <Badge className="bg-cyan-600">React</Badge>
                    <Badge className="bg-green-600">Tailwind CSS</Badge>
                    <Badge className="bg-yellow-600">PokéAPI</Badge>
                    <Badge className="bg-purple-600">Google Gemini AI</Badge>
                    <Badge className="bg-gray-600">Vercel</Badge>
                  </div>
                  <p className="mt-4">
                    Our data is sourced from the excellent{" "}
                    <a
                      href="https://pokeapi.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center"
                    >
                      PokéAPI <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                    , which provides a comprehensive RESTful API for Pokémon
                    data.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Developer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6">
                    Modern Pokédex is a passion project created by Shivam
                    Mittal, a developer and Pokémon enthusiast.
                  </p>
                  <div className="flex justify-center">
                    <div className="text-center max-w-xs">
                      <div className="relative h-32 w-32 mx-auto mb-4 rounded-full overflow-hidden bg-slate-800 border-2 border-red-500">
                        <Image
                          src="https://lh3.googleusercontent.com/a/ACg8ocI4ARDkH-nbQZQ-cYJ51E5j5wt8E_ODRuaDtbuM0nIc21owDEKQ=s192-c-rg-br100"
                          alt="Shivam Mittal"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-medium">Shivam Mittal</h3>
                      <p className="text-sm text-slate-400 mb-2">
                        Full Stack Developer
                      </p>
                      <div className="flex justify-center gap-3 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          asChild
                        >
                          <a
                            href="https://shivammittal.in"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="h-4 w-4" />
                            Website
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          asChild
                        >
                          <a
                            href="https://github.com/CodeGeek04"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                            GitHub
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Project Repository</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <p>
                      This project is open source and available on GitHub. Feel
                      free to contribute, report issues, or fork the repository
                      to create your own version.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                      <Button
                        className="bg-slate-800 hover:bg-slate-700 gap-2"
                        asChild
                      >
                        <a
                          href="https://github.com/CodeGeek04/pokedex"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-5 w-5" />
                          View on GitHub
                        </a>
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 gap-2"
                        asChild
                      >
                        <Link href="/privacy">Privacy Policy</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                  href="https://pokeapi.co"
                  target="_blank"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  PokeAPI
                </Link>
                <Link
                  href="https://github.com/CodeGeek04/pokedex"
                  target="_blank"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  GitHub
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </InlineStyle>
  );
}
