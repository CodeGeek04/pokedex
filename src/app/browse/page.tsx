"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Filter,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import InlineStyle from "@/components/inline-style";

// Types
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

interface FilterState {
  types: string[];
  sort: string;
  search: string;
}

// Helper functions
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.replace(/-/g, " ").slice(1);
};

const formatPokemonNumber = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

// Pokemon Card Component
const PokemonBrowseCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const primaryType = pokemon.types[0]?.type.name || "normal";

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.other.home.front_default ||
    pokemon.sprites.front_default;

  return (
    <Link href={`/pokemon/${pokemon.name}`} className="block h-full">
      <div
        className={`rounded-lg overflow-hidden border border-slate-800 hover:border-slate-600 transition-all duration-300 h-full ${primaryType}-gradient hover:shadow-lg hover:shadow-${primaryType}-bg/20 cursor-pointer`}
      >
        <div className="p-3 relative bg-gradient-to-b from-transparent to-black/80">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-white/70">
              {formatPokemonNumber(pokemon.id)}
            </span>
            <div className="flex gap-1">
              {pokemon.types.map((typeInfo) => (
                <Badge
                  key={typeInfo.type.name}
                  className={`${typeInfo.type.name}-bg text-white text-xs font-medium px-2 py-0`}
                >
                  {capitalizeFirstLetter(typeInfo.type.name)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center p-2">
            {imageUrl && (
              <div className="relative h-24 w-24">
                <Image
                  src={imageUrl}
                  alt={pokemon.name}
                  fill
                  sizes="100px"
                  className="object-contain drop-shadow-md hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
          </div>

          <h3 className="text-center text-sm font-bold text-white">
            {capitalizeFirstLetter(pokemon.name)}
          </h3>
        </div>
      </div>
    </Link>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="rounded-lg overflow-hidden border border-slate-800 h-full bg-slate-900 animate-pulse">
    <div className="p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 w-10 bg-slate-800 rounded"></div>
        <div className="flex gap-1">
          <div className="h-4 w-12 bg-slate-800 rounded-full"></div>
        </div>
      </div>

      <div className="flex justify-center items-center p-2">
        <div className="h-24 w-24 bg-slate-800 rounded-full"></div>
      </div>

      <div className="h-4 w-24 bg-slate-800 rounded mx-auto"></div>
    </div>
  </div>
);

// Type Pill Component
const TypePill = ({
  type,
  active,
  onClick,
}: {
  type: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Button
    variant={active ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className={`rounded-full ${
      active
        ? `${type}-bg text-white`
        : "bg-slate-900 hover:bg-slate-800 border-slate-700"
    } cursor-pointer transition-all`}
  >
    <span
      className={`inline-block w-2 h-2 rounded-full ${type}-bg mr-2`}
    ></span>
    {capitalizeFirstLetter(type)}
  </Button>
);

// SearchParams wrapper component
import { useSearchParams } from "next/navigation";

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // All available types
  const pokemonTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  // States
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    sort: "id-asc",
    search: "",
  });

  // Constants
  const itemsPerPage = 24;
  const maxPagesToShow = 5;

  // Load URL parameters
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page));
    }

    const search = searchParams.get("search");
    if (search) {
      setFilters((prev) => ({ ...prev, search }));
    }

    const sort = searchParams.get("sort");
    if (sort) {
      setFilters((prev) => ({ ...prev, sort }));
    }

    const types = searchParams.get("types");
    if (types) {
      setFilters((prev) => ({ ...prev, types: types.split(",") }));
    }
  }, [searchParams]);

  // Fetch all Pokémon data on component mount
  useEffect(() => {
    const fetchAllPokemonData = async () => {
      setIsLoading(true);
      try {
        // First get list of all Pokémon
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1025"
        );
        const data: PokemonListResponse = await response.json();

        // Then fetch details for each Pokémon in batches to avoid overwhelming the API
        const batchSize = 20;
        const pokemonDataArray: Pokemon[] = [];

        for (let i = 0; i < data.results.length; i += batchSize) {
          const batch = data.results.slice(i, i + batchSize);

          const batchPromises = batch.map(async (pokemon) => {
            try {
              const detailsResponse = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
              );
              if (!detailsResponse.ok) return null;
              return await detailsResponse.json();
            } catch (error) {
              console.error(
                `Error fetching details for ${pokemon.name}:`,
                error
              );
              return null;
            }
          });

          const batchResults = await Promise.all(batchPromises);
          pokemonDataArray.push(...(batchResults.filter(Boolean) as Pokemon[]));
        }

        setAllPokemon(pokemonDataArray);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPokemonData();
  }, []);

  // Apply filters whenever filter state or all Pokémon change
  useEffect(() => {
    if (!allPokemon.length) return;

    // Apply filters in this order: search, type, sort
    let results = [...allPokemon];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(searchLower) ||
          pokemon.id.toString().includes(searchLower)
      );
    }

    // Apply type filter
    if (filters.types.length > 0) {
      results = results.filter((pokemon) =>
        pokemon.types.some((typeInfo) =>
          filters.types.includes(typeInfo.type.name)
        )
      );
    }

    // Apply sorting
    switch (filters.sort) {
      case "id-asc":
        results.sort((a, b) => a.id - b.id);
        break;
      case "id-desc":
        results.sort((a, b) => b.id - a.id);
        break;
      case "name-asc":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredPokemon(results);

    // Reset to page 1 if current page would be out of bounds with new filter results
    const totalPages = Math.ceil(results.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }

    updateUrl();
  }, [filters, allPokemon]);

  // Paginate filtered results
  useEffect(() => {
    if (!filteredPokemon.length) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedPokemon(filteredPokemon.slice(startIndex, endIndex));

    // Update URL with current page
    updateUrl();
  }, [filteredPokemon, currentPage]);

  // Update URL with current filters and page
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    // Add page
    params.set("page", currentPage.toString());

    // Add search text
    if (filters.search) {
      params.set("search", filters.search);
    }

    // Add sort
    params.set("sort", filters.sort);

    // Add types
    if (filters.types.length > 0) {
      params.set("types", filters.types.join(","));
    }

    // Update URL
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [currentPage, filters, router]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setCurrentPage(1); // Reset to first page on search change
  };

  // Handle type filter toggle
  const handleTypeToggle = (typeName: string) => {
    setFilters((prev) => {
      if (prev.types.includes(typeName)) {
        return {
          ...prev,
          types: prev.types.filter((t) => t !== typeName),
        };
      } else {
        return {
          ...prev,
          types: [...prev.types, typeName],
        };
      }
    });

    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle removing a single type filter
  const handleRemoveType = (typeName: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.filter((t) => t !== typeName),
    }));

    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sort: value }));
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setFilters({
      types: [],
      sort: "id-asc",
      search: "",
    });
    setCurrentPage(1);
  };

  // Generate pagination range
  const generatePaginationRange = () => {
    const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);
    const range: number[] = [];

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to max pages to show
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // If current page is near the start
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          range.push(i);
        }
      }
      // If current page is near the end
      else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          range.push(i);
        }
      }
      // If current page is in the middle
      else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          range.push(i);
        }
      }
    }

    return { range, totalPages };
  };

  const { range: paginationRange, totalPages } = generatePaginationRange();

  // Count active filters for UI display
  const activeFilterCount = filters.types.length + (filters.search ? 1 : 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium flex items-center gap-1 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-lg font-bold">Browse All Pokémon</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2 lg:w-2/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search by name or Pokédex number..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-10 bg-slate-900 border-slate-700 focus:ring-2 focus:ring-red-500 w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Type Filter */}
            <Popover open={isFilterMenuOpen} onOpenChange={setIsFilterMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-slate-900 border-slate-700 cursor-pointer hover:bg-slate-800"
                >
                  <Filter className="h-4 w-4" />
                  Types
                  {filters.types.length > 0 && (
                    <Badge className="ml-1 bg-red-500 text-white">
                      {filters.types.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-slate-900 border-slate-700">
                <div className="p-4 border-b border-slate-800">
                  <h3 className="font-medium">Filter by Type</h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-2 max-h-80 overflow-auto">
                  {pokemonTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.types.includes(type)}
                        onCheckedChange={() => handleTypeToggle(type)}
                        className={`${type}-bg border-0 text-white cursor-pointer`}
                      />
                      <Label
                        htmlFor={`type-${type}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${type}-bg`}
                        ></span>
                        {capitalizeFirstLetter(type)}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-800 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, types: [] }));
                      setIsFilterMenuOpen(false);
                    }}
                    disabled={filters.types.length === 0}
                    className="cursor-pointer disabled:cursor-not-allowed hover:bg-slate-800"
                  >
                    Clear Types
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsFilterMenuOpen(false)}
                    className="cursor-pointer hover:bg-red-600"
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Sort Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-slate-900 border-slate-700 cursor-pointer hover:bg-slate-800"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900 border-slate-700">
                <DropdownMenuItem
                  onClick={() => handleSortChange("id-asc")}
                  className={`cursor-pointer ${
                    filters.sort === "id-asc" ? "bg-slate-800" : ""
                  }`}
                >
                  ID (Ascending)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("id-desc")}
                  className={`cursor-pointer ${
                    filters.sort === "id-desc" ? "bg-slate-800" : ""
                  }`}
                >
                  ID (Descending)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("name-asc")}
                  className={`cursor-pointer ${
                    filters.sort === "name-asc" ? "bg-slate-800" : ""
                  }`}
                >
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("name-desc")}
                  className={`cursor-pointer ${
                    filters.sort === "name-desc" ? "bg-slate-800" : ""
                  }`}
                >
                  Name (Z-A)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear All Filters */}
            {activeFilterCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 bg-slate-900 border-slate-700 cursor-pointer hover:bg-slate-800"
                    onClick={handleClearFilters}
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove all filters and search</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Active Type Filters - Horizontal Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {pokemonTypes.map((type) => (
            <TypePill
              key={type}
              type={type}
              active={filters.types.includes(type)}
              onClick={() => handleTypeToggle(type)}
            />
          ))}
        </div>

        {/* Results Statistics */}
        <div className="flex justify-between items-center my-4">
          <div className="text-sm text-slate-400">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Loading Pokémon data...
              </div>
            ) : (
              `Showing ${displayedPokemon.length} of ${filteredPokemon.length} Pokémon`
            )}
          </div>

          <div className="text-sm text-slate-400">
            {!isLoading &&
              totalPages > 0 &&
              `Page ${currentPage} of ${totalPages}`}
          </div>
        </div>

        {/* Pokémon Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(itemsPerPage)
              .fill(0)
              .map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
          </div>
        ) : filteredPokemon.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayedPokemon.map((pokemon) => (
              <PokemonBrowseCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/30 rounded-lg border border-slate-800">
            <div className="mb-4 text-lg font-medium">
              No Pokémon found matching your criteria
            </div>
            <Button
              onClick={handleClearFilters}
              className="cursor-pointer bg-red-500 hover:bg-red-600"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="bg-slate-900 border-slate-700 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-0" />
                  <ChevronLeft className="h-4 w-4 ml-[-14px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>First page</TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-slate-900 border-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex flex-wrap gap-2">
              {paginationRange.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  className={`cursor-pointer ${
                    currentPage === page
                      ? "bg-red-500 hover:bg-red-600 border-red-500"
                      : "bg-slate-900 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-slate-900 border-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="bg-slate-900 border-slate-700 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4 ml-0" />
                  <ChevronRight className="h-4 w-4 ml-[-14px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Last page</TooltipContent>
            </Tooltip>
          </div>
        )}
      </main>
    </div>
  );
}

// Main component with Suspense
export default function BrowsePage() {
  return (
    <InlineStyle>
      <TooltipProvider>
        <Suspense
          fallback={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <p>Loading Pokédex...</p>
              </div>
            </div>
          }
        >
          <BrowseContent />
        </Suspense>
      </TooltipProvider>
    </InlineStyle>
  );
}
