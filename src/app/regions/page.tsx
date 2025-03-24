"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InlineStyle from "@/components/inline-style";

// Region data (same as in region/[name]/page.tsx)
const regionData = {
  kanto: {
    id: 1,
    name: "Kanto",
    generation: "Generation I",
    description:
      "Kanto is a region based on the real-life Kantō region of Japan. It was the first region to be introduced in the Pokémon series, featured in the original games Pokémon Red, Green, Blue, and Yellow.",
    mainGames: [
      "Red",
      "Blue",
      "Yellow",
      "FireRed",
      "LeafGreen",
      "Let's Go Pikachu",
      "Let's Go Eevee",
    ],
    pokeapiId: 1,
    gradient: "from-red-600 to-red-800",
  },
  johto: {
    id: 2,
    name: "Johto",
    generation: "Generation II",
    description:
      "Johto is a region located west of Kanto. It was introduced in Pokémon Gold, Silver, and Crystal. The landscape consists of rural and urban areas with many old traditions and legends.",
    mainGames: ["Gold", "Silver", "Crystal", "HeartGold", "SoulSilver"],
    pokeapiId: 2,
    gradient: "from-indigo-600 to-indigo-800",
  },
  hoenn: {
    id: 3,
    name: "Hoenn",
    generation: "Generation III",
    description:
      "Hoenn is a region with many natural wonders, including routes, towns, caves, oceans, and more. It hosts contests and gyms, and is the setting for Pokémon Ruby, Sapphire, and Emerald.",
    mainGames: ["Ruby", "Sapphire", "Emerald", "Omega Ruby", "Alpha Sapphire"],
    pokeapiId: 3,
    gradient: "from-blue-600 to-blue-800",
  },
  sinnoh: {
    id: 4,
    name: "Sinnoh",
    generation: "Generation IV",
    description:
      "Sinnoh is based on the Japanese island of Hokkaido and is characterized by its many mountains, which include Mt. Coronet, which divides the region into two parts.",
    mainGames: [
      "Diamond",
      "Pearl",
      "Platinum",
      "Brilliant Diamond",
      "Shining Pearl",
    ],
    pokeapiId: 4,
    gradient: "from-cyan-600 to-cyan-800",
  },
  unova: {
    id: 5,
    name: "Unova",
    generation: "Generation V",
    description:
      "Unova is based on New York City and the surrounding New York metropolitan area. It is a region with a large city center and diverse environments, including deserts, mountains, and forests.",
    mainGames: ["Black", "White", "Black 2", "White 2"],
    pokeapiId: 5,
    gradient: "from-gray-600 to-gray-800",
  },
  kalos: {
    id: 6,
    name: "Kalos",
    generation: "Generation VI",
    description:
      "Kalos is inspired by France and is known for its focus on beauty. The region has a variety of towns and cities, with the largest being Lumiose City, which is based on Paris.",
    mainGames: ["X", "Y"],
    pokeapiId: 6,
    gradient: "from-blue-500 to-blue-700",
  },
  alola: {
    id: 7,
    name: "Alola",
    generation: "Generation VII",
    description:
      "Alola is based on Hawaii and consists of four main islands and one artificial island. Each island features unique challenges and environments.",
    mainGames: ["Sun", "Moon", "Ultra Sun", "Ultra Moon"],
    pokeapiId: 7,
    gradient: "from-orange-500 to-orange-700",
  },
  galar: {
    id: 8,
    name: "Galar",
    generation: "Generation VIII",
    description:
      "Galar is based on Great Britain and features diverse landscapes ranging from rural countryside to industrial cities.",
    mainGames: ["Sword", "Shield"],
    pokeapiId: 8,
    gradient: "from-purple-600 to-purple-800",
  },
  paldea: {
    id: 9,
    name: "Paldea",
    generation: "Generation IX",
    description:
      "Paldea is inspired by the Iberian Peninsula (Spain and Portugal) and features a large, open world with three main storylines that players can pursue in any order.",
    mainGames: ["Scarlet", "Violet"],
    pokeapiId: 9,
    gradient: "from-violet-600 to-violet-800",
  },
};

// Function to get a starter Pokémon image for each region
// We'll use the first starter from each region's list to represent the region
const getRegionRepresentativePokemonId = (regionId: number): number => {
  const regionStarterMap: Record<number, number> = {
    1: 25, // Kanto - Pikachu
    2: 152, // Johto - Chikorita
    3: 252, // Hoenn - Treecko
    4: 387, // Sinnoh - Turtwig
    5: 495, // Unova - Snivy
    6: 650, // Kalos - Chespin
    7: 722, // Alola - Rowlet
    8: 810, // Galar - Grookey
    9: 906, // Paldea - Sprigatito
  };

  return regionStarterMap[regionId] || 25; // Default to Pikachu if not found
};

export default function RegionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Convert region data to array and sort by ID
  const regionsArray = Object.entries(regionData)
    .map(([key, value]) => ({
      ...value,
      slug: key,
    }))
    .sort((a, b) => a.id - b.id);

  // Filter regions based on search term
  const filteredRegions = regionsArray.filter(
    (region) =>
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.generation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.mainGames.some((game) =>
        game.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

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
        <section className="bg-gradient-to-b from-blue-600 to-blue-800 py-12 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                Pokémon Regions
              </h1>
              <p className="text-xl text-white/90 mb-6">
                Explore the diverse regions of the Pokémon world, each with its
                own unique landscapes, Pokémon, and adventures.
              </p>

              {/* Search bar */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 focus:border-white placeholder-white/50 text-white"
                />
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -right-16 -bottom-16 opacity-10">
            <div className="w-64 h-64 rounded-full border-[16px] border-white"></div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRegions.length > 0 ? (
              filteredRegions.map((region) => (
                <Card
                  key={region.id}
                  className="bg-slate-900 border-slate-800 overflow-hidden hover:border-slate-600 transition-all group"
                >
                  <div
                    className={`h-48 bg-gradient-to-br ${region.gradient} relative`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-32 w-32">
                        <Image
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getRegionRepresentativePokemonId(
                            region.id
                          )}.png`}
                          alt={`${region.name} representative Pokémon`}
                          fill
                          className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-black/30 backdrop-blur-sm border-none text-white">
                        {region.generation}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl font-bold">
                        {region.name}
                      </CardTitle>
                      <Badge variant="outline"># {region.id}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-slate-300 line-clamp-3">
                      {region.description}
                    </p>

                    <div>
                      <p className="text-sm text-slate-400 mb-2">
                        Featured Games
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {region.mainGames.slice(0, 3).map((game) => (
                          <Badge
                            key={game}
                            variant="secondary"
                            className="bg-slate-800"
                          >
                            {game}
                          </Badge>
                        ))}
                        {region.mainGames.length > 3 && (
                          <Badge variant="secondary" className="bg-slate-800">
                            +{region.mainGames.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full gap-2 justify-center group-hover:bg-red-600 transition-colors"
                      asChild
                    >
                      <Link href={`/region/${region.slug}`}>
                        Explore Region
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-xl text-slate-400 mb-4">
                  No regions found matching "{searchTerm}"
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="bg-slate-800 hover:bg-slate-700"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-12 bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  About Pokémon Regions
                </h2>
                <p className="text-slate-300">
                  In the world of Pokémon, regions are distinct geographical
                  areas featuring unique Pokémon species, landscapes, cities,
                  and characters. Each region represents a new adventure in the
                  Pokémon video games, anime series, and other media.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Pokémon Species</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">
                      Each region introduces new Pokémon species, with some
                      regions featuring entirely unique Pokémon while others
                      include a mix of new and familiar species.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Gym Leaders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">
                      Most regions have their own Pokémon League with eight Gym
                      Leaders who specialize in specific Pokémon types,
                      challenging trainers as they journey.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Geography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">
                      Regions feature diverse landscapes including mountains,
                      oceans, forests, deserts, and cities, often inspired by
                      real-world locations.
                    </p>
                  </CardContent>
                </Card>
              </div>
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
                  href="/privacy"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="https://pokeapi.co"
                  target="_blank"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  PokeAPI
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </InlineStyle>
  );
}
