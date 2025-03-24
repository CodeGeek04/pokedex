"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send, RefreshCw, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  getPokemonChatResponse,
  ChatMessage,
  PokemonDetails,
} from "@/actions/chat";

// Helper functions
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.replace(/-/g, " ").slice(1);
};

const formatPokemonNumber = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

export default function PokemonChatPage() {
  // Get the Pokémon name from the URL
  const params = useParams();
  const pokemonName = params.name as string;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loadingPokemon, setLoadingPokemon] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch Pokémon data when component mounts
  useEffect(() => {
    async function fetchPokemonData() {
      try {
        setLoadingPokemon(true);

        // Fetch basic Pokemon data
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        if (!response.ok) throw new Error("Pokemon not found");
        const pokemonData = await response.json();

        // Fetch species data for additional information
        const speciesResponse = await fetch(pokemonData.species.url);
        if (!speciesResponse.ok) throw new Error("Species data not found");
        const speciesData = await speciesResponse.json();

        // Find English description
        const englishFlavorText = speciesData.flavor_text_entries
          .find((entry: any) => entry.language.name === "en")
          ?.flavor_text.replace(/\f/g, " ")
          .replace(/\n/g, " ");

        // Find English genus
        const englishGenus =
          speciesData.genera.find((g: any) => g.language.name === "en")
            ?.genus || "";

        // Format the Pokémon details for the chat
        const formattedPokemon: PokemonDetails = {
          id: pokemonData.id,
          name: pokemonData.name,
          types: pokemonData.types.map((t: any) => t.type.name),
          abilities: pokemonData.abilities.map((a: any) =>
            capitalizeFirstLetter(a.ability.name)
          ),
          height: pokemonData.height / 10, // Convert to meters
          weight: pokemonData.weight / 10, // Convert to kg
          stats: pokemonData.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
          description: englishFlavorText,
          genus: englishGenus,
          isLegendary: speciesData.is_legendary,
          isMythical: speciesData.is_mythical,
          habitat: speciesData.habitat?.name,
        };

        setPokemon(formattedPokemon);

        // Get the welcome message from the server
        const welcomeMessage = await getPokemonChatResponse(
          [],
          formattedPokemon
        );

        // Add welcome message
        setMessages([
          {
            role: "assistant",
            content: welcomeMessage,
          },
        ]);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoadingPokemon(false);
      }
    }

    fetchPokemonData();
  }, [pokemonName]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !pokemon) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare the messages array for the server action
      const messageHistory = [...messages, userMessage];

      // Get response from the server action
      const response = await getPokemonChatResponse(messageHistory, pokemon);

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error getting response:", error);
      // Create a default error message based on the Pokémon's name
      const nameSound = pokemon.name.substring(
        0,
        Math.min(4, pokemon.name.length)
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${nameSound}... (Sorry, I couldn't understand you. Can you try again?)`,
        },
      ]);
    } finally {
      setIsLoading(false);
      // Focus the input field for the next message
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  // Get the main color for the Pokémon based on its primary type
  const getPokemonTypeColor = (): string => {
    if (!pokemon) return "bg-slate-600";

    const typeColorMap: { [key: string]: string } = {
      normal: "bg-neutral-500",
      fire: "bg-orange-600",
      water: "bg-blue-600",
      electric: "bg-yellow-400",
      grass: "bg-green-600",
      ice: "bg-cyan-400",
      fighting: "bg-red-700",
      poison: "bg-purple-700",
      ground: "bg-amber-800",
      flying: "bg-indigo-400",
      psychic: "bg-pink-600",
      bug: "bg-lime-600",
      rock: "bg-stone-600",
      ghost: "bg-violet-800",
      dragon: "bg-indigo-700",
      dark: "bg-neutral-800",
      steel: "bg-slate-500",
      fairy: "bg-pink-400",
    };

    return typeColorMap[pokemon.types[0]] || "bg-slate-600";
  };

  // Get the gradient color for the Pokémon based on its primary type
  const getPokemonTypeGradient = (): string => {
    if (!pokemon) return "from-slate-700 to-slate-900";

    const typeGradientMap: { [key: string]: string } = {
      normal: "from-neutral-400 to-neutral-600",
      fire: "from-orange-500 to-orange-700",
      water: "from-blue-500 to-blue-700",
      electric: "from-yellow-300 to-yellow-500",
      grass: "from-green-500 to-green-700",
      ice: "from-cyan-300 to-cyan-500",
      fighting: "from-red-600 to-red-800",
      poison: "from-purple-600 to-purple-800",
      ground: "from-amber-700 to-amber-900",
      flying: "from-indigo-300 to-indigo-500",
      psychic: "from-pink-500 to-pink-700",
      bug: "from-lime-500 to-lime-700",
      rock: "from-stone-500 to-stone-700",
      ghost: "from-violet-700 to-violet-900",
      dragon: "from-indigo-600 to-indigo-800",
      dark: "from-neutral-700 to-neutral-900",
      steel: "from-slate-400 to-slate-600",
      fairy: "from-pink-300 to-pink-500",
    };

    return typeGradientMap[pokemon.types[0]] || "from-slate-700 to-slate-900";
  };

  // Get the image URL for the Pokémon
  const getPokemonImageUrl = (): string => {
    if (!pokemon) return "";
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/pokemon/${pokemonName}`}
              className="text-sm font-medium flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {capitalizeFirstLetter(pokemonName)}
            </Link>
          </div>

          {pokemon && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-white"
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    You are chatting with {capitalizeFirstLetter(pokemon.name)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar with Pokémon info */}
        <div className="md:w-1/4 lg:w-1/5 border-r border-slate-800 bg-slate-900/50">
          <div className="p-4 sticky top-16">
            {loadingPokemon ? (
              <div className="animate-pulse space-y-4">
                <div className="h-48 w-48 mx-auto rounded-full bg-slate-800"></div>
                <div className="h-6 w-3/4 mx-auto bg-slate-800 rounded"></div>
                <div className="h-4 w-1/2 mx-auto bg-slate-800 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-800 rounded"></div>
                  <div className="h-4 bg-slate-800 rounded"></div>
                  <div className="h-4 bg-slate-800 rounded"></div>
                </div>
              </div>
            ) : pokemon ? (
              <div className="flex flex-col items-center space-y-4">
                <div className={`rounded-full p-2 ${getPokemonTypeColor()}`}>
                  <div className="relative h-36 w-36 bg-black/30 rounded-full">
                    <Image
                      src={getPokemonImageUrl()}
                      alt={pokemon.name}
                      fill
                      className="object-contain drop-shadow-xl"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold">
                    {capitalizeFirstLetter(pokemon.name)}
                  </h2>
                  <p className="text-slate-400">
                    {formatPokemonNumber(pokemon.id)}
                  </p>
                </div>

                <div className="flex gap-2">
                  {pokemon.types.map((type: string) => (
                    <Badge
                      key={type}
                      className={`${type}-bg text-white font-medium px-3 py-1`}
                    >
                      {capitalizeFirstLetter(type)}
                    </Badge>
                  ))}
                </div>

                <div className="w-full space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400">Species</p>
                    <p>{pokemon.genus}</p>
                  </div>

                  <div>
                    <p className="text-slate-400">Abilities</p>
                    <p>{pokemon.abilities.join(", ")}</p>
                  </div>

                  {pokemon.habitat && (
                    <div>
                      <p className="text-slate-400">Habitat</p>
                      <p>{capitalizeFirstLetter(pokemon.habitat)}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-slate-400">Height</p>
                    <p>{pokemon.height} m</p>
                  </div>

                  <div>
                    <p className="text-slate-400">Weight</p>
                    <p>{pokemon.weight} kg</p>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointor"
                >
                  <Link href={`/pokemon/${pokemonName}`}>
                    View full details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Pokémon not found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat background - dynamic gradient based on Pokémon type */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${getPokemonTypeGradient()} opacity-10 z-0`}
          ></div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 relative z-10">
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && pokemon && (
                    <Avatar className={`h-10 w-10 ${getPokemonTypeColor()}`}>
                      <AvatarImage
                        src={getPokemonImageUrl()}
                        alt={pokemon.name}
                      />
                      <AvatarFallback>
                        {pokemon.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : `${getPokemonTypeColor()} bg-opacity-50 border border-slate-700`
                    }`}
                  >
                    <p className="text-sm md:text-base whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-10 w-10 bg-blue-600">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  {pokemon && (
                    <Avatar className={`h-10 w-10 ${getPokemonTypeColor()}`}>
                      <AvatarImage
                        src={getPokemonImageUrl()}
                        alt={pokemon.name}
                      />
                      <AvatarFallback>
                        {pokemon.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className="rounded-lg p-4 bg-slate-800 bg-opacity-50 border border-slate-700">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="border-t border-slate-800 p-4 bg-slate-900/50 relative z-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Talk to ${capitalizeFirstLetter(
                  pokemonName || "Pokémon"
                )}...`}
                disabled={isLoading || loadingPokemon}
                className="flex-1 bg-slate-800 border-slate-700"
              />
              <Button
                type="submit"
                disabled={isLoading || loadingPokemon || !inputValue.trim()}
                className={`${getPokemonTypeColor()} hover:opacity-90`}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
