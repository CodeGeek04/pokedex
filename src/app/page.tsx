"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Moon,
  Sun,
  ChevronRight,
  Star,
  Flame,
  Sparkles,
  Zap,
  Filter,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InlineStyle from "~/components/inline-style";
import { AutocompleteSearch } from "~/components/autocomplete-search";

// Types for PokeAPI responses
interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
      home: {
        front_default: string;
      };
    };
    front_default: string;
  };
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.replace(/-/g, " ").slice(1);
};

// Helper function to format pokemon number
const formatPokemonNumber = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

// Pokemon Card Component
const PokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
  // Get primary type for styling
  const primaryType = pokemon.types[0]?.type.name || "normal";

  // Get image
  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.other.home.front_default ||
    pokemon.sprites.front_default;

  return (
    <div
      className={`pokemon-card rounded-xl overflow-hidden border border-slate-800 relative ${primaryType}-gradient`}
    >
      <div className="absolute top-0 right-0 p-3 z-10 flex space-x-1">
        {pokemon.types.map((typeInfo) => (
          <Badge
            key={typeInfo.type.name}
            className={`${typeInfo.type.name}-bg text-white font-medium px-3 py-1`}
          >
            {capitalizeFirstLetter(typeInfo.type.name)}
          </Badge>
        ))}
      </div>

      <div className="relative p-4 h-full bg-gradient-to-b from-transparent to-black/80">
        <div className="pt-10 pb-4 flex justify-center items-center">
          {imageUrl && (
            <div className="relative h-48 w-48">
              <Image
                src={imageUrl}
                alt={pokemon.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain drop-shadow-xl animate-pulse-glow"
                priority
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              {capitalizeFirstLetter(pokemon.name)}
            </h3>
            <span className="text-white/70 font-mono">
              {formatPokemonNumber(pokemon.id)}
            </span>
          </div>

          <Button
            variant="secondary"
            className="w-full justify-between bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-none"
            asChild
          >
            <Link href={`/pokemon/${pokemon.name}`}>
              View details
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <Link href={`/pokemon/${pokemon.name}`} className="stretched-link" />
    </div>
  );
};

// Loading card skeleton
const LoadingCard = () => (
  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 animate-pulse">
    <div className="p-4 h-full">
      <div className="absolute top-0 right-0 p-3 z-10 flex space-x-1">
        <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
      </div>

      <div className="pt-10 pb-4 flex justify-center items-center">
        <div className="h-48 w-48 bg-slate-800 rounded-full"></div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-6 w-24 bg-slate-800 rounded"></div>
          <div className="h-6 w-12 bg-slate-800 rounded"></div>
        </div>

        <div className="h-10 w-full bg-slate-800 rounded-md"></div>
      </div>
    </div>
  </div>
);

// Main Page Component
export default function Home() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [randomHeroPokemon, setRandomHeroPokemon] = useState<Pokemon | null>(
    null
  );
  const [featuredPokemon, setFeaturedPokemon] = useState<Pokemon[]>([]);
  const [popularPokemon, setPopularPokemon] = useState<Pokemon[]>([]);
  const [legendaryPokemon, setLegendaryPokemon] = useState<Pokemon[]>([]);
  const [starterPokemon, setStarterPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch a single Pokémon by name or ID
  const fetchPokemon = async (
    nameOrId: string | number
  ): Promise<Pokemon | null> => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nameOrId}`
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`Error fetching Pokémon ${nameOrId}:`, error);
      return null;
    }
  };

  // Function to fetch a random Pokémon for the hero section
  const fetchRandomHeroPokemon = async () => {
    try {
      // Get a random Pokémon ID between 1 and 649 (Gen 1-5 for better artwork)
      const randomId = Math.floor(Math.random() * 649) + 1;
      const data = await fetchPokemon(randomId);
      if (data) setRandomHeroPokemon(data);
    } catch (error) {
      console.error("Error fetching random Pokémon:", error);
    }
  };

  // Function to fetch featured Pokémon (predefined list of popular ones)
  const fetchFeaturedPokemon = async () => {
    // Popular Pokémon IDs
    const featuredIds = [25, 6, 150, 448, 658, 282, 94, 133];

    const pokemonPromises = featuredIds.map((id) => fetchPokemon(id));
    const results = await Promise.all(pokemonPromises);
    setFeaturedPokemon(results.filter(Boolean) as Pokemon[]);
  };

  // Function to fetch "most viewed" Pokémon (random selection for demo)
  const fetchPopularPokemon = async () => {
    try {
      // Get a random selection of Pokémon from the first 151
      const randomIds: number[] = [];
      while (randomIds.length < 8) {
        const id = Math.floor(Math.random() * 1024) + 1;
        if (!randomIds.includes(id)) {
          randomIds.push(id);
        }
      }

      const pokemonPromises = randomIds.map((id) => fetchPokemon(id));
      const results = await Promise.all(pokemonPromises);
      setPopularPokemon(results.filter(Boolean) as Pokemon[]);
    } catch (error) {
      console.error("Error fetching popular Pokémon:", error);
    }
  };

  // Function to fetch legendary Pokémon
  const fetchLegendaryPokemon = async () => {
    // Legendary Pokémon IDs
    const legendaryIds = [150, 249, 384, 483, 644, 716, 792, 890];

    const pokemonPromises = legendaryIds.map((id) => fetchPokemon(id));
    const results = await Promise.all(pokemonPromises);
    setLegendaryPokemon(results.filter(Boolean) as Pokemon[]);
  };

  // Function to fetch starter Pokémon
  const fetchStarterPokemon = async () => {
    // Starter Pokémon IDs
    const starterIds = [1, 4, 7, 152, 155, 158, 252, 255];

    const pokemonPromises = starterIds.map((id) => fetchPokemon(id));
    const results = await Promise.all(pokemonPromises);
    setStarterPokemon(results.filter(Boolean) as Pokemon[]);
  };

  // Initialize page data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      await Promise.all([
        fetchRandomHeroPokemon(),
        fetchFeaturedPokemon(),
        fetchPopularPokemon(),
        fetchLegendaryPokemon(),
        fetchStarterPokemon(),
      ]);

      setIsLoading(false);
    };

    loadData();

    // Refresh random hero Pokémon every 60 seconds
    const interval = setInterval(() => {
      fetchRandomHeroPokemon();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <InlineStyle>
      <div className="flex flex-col min-h-screen bg-black text-white">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60">
          <div className="container mx-auto px-4 flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                <div className="absolute inset-[3px] rounded-full bg-white"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[2px] w-full bg-black"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-black bg-white"></div>
              </div>
              <span className="hidden sm:inline-block text-xl font-bold tracking-tight">
                Pokédex
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-1 md:space-x-4">
              <Link
                href="/browse"
                className="px-3 py-2 text-sm font-medium hover:text-white"
              >
                Browse All
              </Link>

              {/* Search Bar with Autocomplete */}
              <AutocompleteSearch />

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-slate-400 hover:text-white"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all light:-rotate-90 light:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
          {/* Random hero Pokémon */}
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="md:w-1/2 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Modern Pokédex
                </h1>
                <p className="text-xl md:text-2xl text-slate-300">
                  Explore the world of Pokémon with our beautifully designed,
                  interactive Pokédex
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none gap-2"
                  asChild
                >
                  <Link href="/browse">
                    Browse All <Filter className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white gap-2"
                >
                  <Link href="https://pokeapi.co" target="_blank">
                    Powered by PokeAPI <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
              {randomHeroPokemon ? (
                <div className="relative h-64 w-64 md:h-80 md:w-80">
                  <Image
                    src={
                      randomHeroPokemon.sprites.other["official-artwork"]
                        .front_default ||
                      randomHeroPokemon.sprites.other.home.front_default ||
                      randomHeroPokemon.sprites.front_default ||
                      "/pokemon-placeholder.png"
                    }
                    alt={randomHeroPokemon.name}
                    onClick={() =>
                      router.push(`/pokemon/${randomHeroPokemon.name}`)
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain drop-shadow-xl animate-float cursor-pointer"
                    priority
                  />
                </div>
              ) : (
                <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center">
                  <div className="pokeball-loader"></div>
                </div>
              )}
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-20">
            <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-[16px] border-white relative animate-slow-spin">
              <div className="absolute top-1/2 left-0 right-0 h-[16px] bg-white -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-red-600 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </section>

        {/* Featured Pokémon section */}
        <section className="py-16 container mx-auto px-4 md:px-6">
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Pokémon
              </h2>
            </div>
            <p className="text-slate-400">
              Discover these popular Pokémon from across the regions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array(8)
                  .fill(0)
                  .map((_, i) => <LoadingCard key={i} />)
              : featuredPokemon.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
          </div>
        </section>

        {/* Trending now section with tabs */}
        <section className="py-16 bg-slate-900/50">
          <div className="container mx-auto px-4 md:px-6 space-y-8">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-red-500" />
              <h2 className="text-3xl font-bold tracking-tight">
                Trending Now
              </h2>
            </div>

            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="mb-6 bg-slate-800/50 p-1">
                <TabsTrigger
                  value="popular"
                  className="data-[state=active]:bg-red-500"
                >
                  Most Viewed
                </TabsTrigger>
                <TabsTrigger
                  value="legendary"
                  className="data-[state=active]:bg-red-500"
                >
                  Legendary
                </TabsTrigger>
                <TabsTrigger
                  value="starters"
                  className="data-[state=active]:bg-red-500"
                >
                  Starter Pokémon
                </TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {isLoading
                    ? Array(8)
                        .fill(0)
                        .map((_, i) => <LoadingCard key={i} />)
                    : popularPokemon.map((pokemon) => (
                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                      ))}
                </div>
              </TabsContent>

              <TabsContent value="legendary" className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {isLoading
                    ? Array(8)
                        .fill(0)
                        .map((_, i) => <LoadingCard key={i} />)
                    : legendaryPokemon.map((pokemon) => (
                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                      ))}
                </div>
              </TabsContent>

              <TabsContent value="starters" className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {isLoading
                    ? Array(8)
                        .fill(0)
                        .map((_, i) => <LoadingCard key={i} />)
                    : starterPokemon.map((pokemon) => (
                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                      ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Region exploration section */}
        <section className="py-16 container mx-auto px-4 md:px-6">
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-500" />
              <h2 className="text-3xl font-bold tracking-tight">
                Explore Regions
              </h2>
            </div>
            <p className="text-slate-400">
              Discover Pokémon from across the different regions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Kanto",
                generation: "I",
                pokemon: "151",
                color: "from-red-500 to-red-600",
              },
              {
                name: "Johto",
                generation: "II",
                pokemon: "100",
                color: "from-yellow-500 to-yellow-600",
              },
              {
                name: "Hoenn",
                generation: "III",
                pokemon: "135",
                color: "from-blue-500 to-blue-600",
              },
              {
                name: "Sinnoh",
                generation: "IV",
                pokemon: "107",
                color: "from-teal-500 to-teal-600",
              },
              {
                name: "Unova",
                generation: "V",
                pokemon: "156",
                color: "from-gray-500 to-gray-600",
              },
              {
                name: "Kalos",
                generation: "VI",
                pokemon: "72",
                color: "from-indigo-500 to-indigo-600",
              },
              {
                name: "Alola",
                generation: "VII",
                pokemon: "88",
                color: "from-orange-500 to-orange-600",
              },
              {
                name: "Galar",
                generation: "VIII",
                pokemon: "89",
                color: "from-purple-500 to-purple-600",
              },
            ].map((region) => (
              <div
                key={region.name}
                className="rounded-xl overflow-hidden pokemon-card bg-slate-800 border border-slate-700"
              >
                <div
                  className={`h-32 bg-gradient-to-r ${region.color} flex items-center justify-center relative`}
                >
                  <h3 className="text-2xl font-bold text-white z-10">
                    {region.name}
                  </h3>
                  <div className="absolute inset-0 pokemon-bg-pattern opacity-10"></div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-700/50 p-2 rounded-lg">
                      <div className="text-xs text-slate-400">Generation</div>
                      <div className="font-bold">{region.generation}</div>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded-lg">
                      <div className="text-xs text-slate-400">Pokémon</div>
                      <div className="font-bold">{region.pokemon}</div>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <Link href={`/region/${region.name.toLowerCase()}`}>
                      Explore Region
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter section */}
        <section className="py-16 bg-slate-900/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                <h2 className="text-3xl font-bold tracking-tight">
                  Stay Updated
                </h2>
              </div>
              <p className="text-slate-400">
                Subscribe to our newsletter to get the latest updates about new
                Pokémon, features, and events.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-slate-800 border-slate-700"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none"
                >
                  Subscribe
                </Button>
              </form>
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
                <Link
                  href="https://github.com"
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
