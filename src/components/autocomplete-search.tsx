"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.replace(/-/g, " ").slice(1);
};

export function AutocompleteSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Pokemon[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Fetch all pokemon names on component mount
  useEffect(() => {
    const fetchAllPokemon = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1000"
        );
        const data: PokemonListResponse = await response.json();
        setAllPokemon(data.results);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  // Filter pokemon based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = allPokemon
      .filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions

    setSuggestions(filtered);
  }, [searchQuery, allPokemon]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      router.push(`/pokemon/${query}`);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (pokemonName: string) => {
    router.push(`/pokemon/${pokemonName}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex-1 max-w-sm" ref={suggestionRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          placeholder="Search Pokémon..."
          className="w-full bg-slate-900 border-slate-700 pl-10 focus:ring-2 focus:ring-red-500"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute mt-1 w-full bg-slate-900 border border-slate-700 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
          <ul className="py-1">
            {suggestions.map((pokemon) => (
              <li
                key={pokemon.name}
                className="px-4 py-2 hover:bg-slate-800 cursor-pointer flex items-center"
                onClick={() => handleSuggestionClick(pokemon.name)}
              >
                {capitalizeFirstLetter(pokemon.name)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
