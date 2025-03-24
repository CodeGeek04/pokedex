"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Search, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import InlineStyle from "@/components/inline-style";

export default function NotFound() {
  return (
    <InlineStyle>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <main className="flex-1 flex items-center justify-center">
          <div className="container px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              {/* Pokéball with question mark */}
              <div className="relative h-40 w-40 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600 animate-pulse"></div>
                <div className="absolute inset-[8px] rounded-full bg-white"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[8px] w-full bg-black"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-white border-4 border-black -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <span className="text-3xl font-bold text-black">?</span>
                </div>
              </div>

              <h1 className="text-4xl font-extrabold mb-4">Page Not Found</h1>

              <p className="text-xl text-slate-400 mb-8">
                Looks like this Pokémon has fled! The page you're looking for
                doesn't exist or has been moved.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-red-500 hover:bg-red-600 gap-2" asChild>
                  <Link href="/">
                    <Home className="h-5 w-5" />
                    Return Home
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="border-slate-700 gap-2"
                  asChild
                >
                  <Link href="/browse">
                    <Search className="h-5 w-5" />
                    Browse Pokémon
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="border-slate-700 gap-2"
                  asChild
                >
                  <Link href="/regions">
                    <Map className="h-5 w-5" />
                    Explore Regions
                  </Link>
                </Button>
              </div>

              {/* Lost Pokémon easter egg */}
              <div className="mt-16 relative">
                <p className="text-sm text-slate-500 mb-4 italic">
                  Some wild Pokémon appeared!
                </p>
                <div className="flex justify-center gap-4">
                  {[132, 92, 79].map((id) => (
                    <div
                      key={id}
                      className="w-16 h-16 relative opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                        alt="Lost Pokémon"
                        fill
                        className="pixelated object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            © 2025 Modern Pokédex •{" "}
            <Link href="/" className="hover:text-white">
              Go back home
            </Link>
          </p>
        </footer>
      </div>
    </InlineStyle>
  );
}
