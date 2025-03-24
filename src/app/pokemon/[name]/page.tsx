"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Heart,
  Shield,
  Zap,
  BarChart,
  Dumbbell,
  Eye,
  Flame,
  Activity,
  Sparkles,
  Award,
  Disc,
  Swords,
  PlusCircle,
  Hash,
  Ruler,
  Weight,
  BadgeInfo,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/custom-progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import InlineStyle from "@/components/inline-style";

// Types for detailed Pokémon data
interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  is_default: boolean;
  order: number;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  forms: {
    name: string;
    url: string;
  }[];
  game_indices: {
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }[];
  held_items: {
    item: {
      name: string;
      url: string;
    };
    version_details: {
      rarity: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
  location_area_encounters: string;
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }[];
  }[];
  species: {
    name: string;
    url: string;
  };
  sprites: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: {
      dream_world: {
        front_default: string | null;
        front_female: string | null;
      };
      home: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      "official-artwork": {
        front_default: string | null;
        front_shiny: string | null;
      };
      showdown: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
    versions: {
      [key: string]: {
        [key: string]: {
          back_default?: string | null;
          back_female?: string | null;
          back_gray?: string | null;
          back_transparent?: string | null;
          back_shiny?: string | null;
          back_shiny_female?: string | null;
          back_shiny_transparent?: string | null;
          front_default?: string | null;
          front_female?: string | null;
          front_gray?: string | null;
          front_transparent?: string | null;
          front_shiny?: string | null;
          front_shiny_female?: string | null;
          front_shiny_transparent?: string | null;
          animated?: {
            back_default?: string | null;
            back_female?: string | null;
            back_shiny?: string | null;
            back_shiny_female?: string | null;
            front_default?: string | null;
            front_female?: string | null;
            front_shiny?: string | null;
            front_shiny_female?: string | null;
          };
        };
      };
    };
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  past_types: {
    generation: {
      name: string;
      url: string;
    };
    types: {
      slot: number;
      type: {
        name: string;
        url: string;
      };
    }[];
  }[];
}

interface PokemonSpecies {
  base_happiness: number;
  capture_rate: number;
  color: {
    name: string;
    url: string;
  };
  egg_groups: {
    name: string;
    url: string;
  }[];
  evolution_chain: {
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }[];
  form_descriptions: {
    description: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  forms_switchable: boolean;
  gender_rate: number;
  genera: {
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  generation: {
    name: string;
    url: string;
  };
  growth_rate: {
    name: string;
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  has_gender_differences: boolean;
  hatch_counter: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  names: {
    language: {
      name: string;
      url: string;
    };
    name: string;
  }[];
  order: number;
  pal_park_encounters: {
    area: {
      name: string;
      url: string;
    };
    base_score: number;
    rate: number;
  }[];
  pokedex_numbers: {
    entry_number: number;
    pokedex: {
      name: string;
      url: string;
    };
  }[];
  shape: {
    name: string;
    url: string;
  };
  varieties: {
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
}

interface EvolutionChain {
  id: number;
  baby_trigger_item: null | {
    name: string;
    url: string;
  };
  chain: {
    is_baby: boolean;
    species: {
      name: string;
      url: string;
    };
    evolution_details:
      | null
      | {
          item: null | {
            name: string;
            url: string;
          };
          trigger: {
            name: string;
            url: string;
          };
          gender: null | number;
          held_item: null | {
            name: string;
            url: string;
          };
          known_move: null | {
            name: string;
            url: string;
          };
          known_move_type: null | {
            name: string;
            url: string;
          };
          location: null | {
            name: string;
            url: string;
          };
          min_level: null | number;
          min_happiness: null | number;
          min_beauty: null | number;
          min_affection: null | number;
          needs_overworld_rain: boolean;
          party_species: null | {
            name: string;
            url: string;
          };
          party_type: null | {
            name: string;
            url: string;
          };
          relative_physical_stats: null | number;
          time_of_day: string;
          trade_species: null | {
            name: string;
            url: string;
          };
          turn_upside_down: boolean;
        }[];
    evolves_to: {
      is_baby: boolean;
      species: {
        name: string;
        url: string;
      };
      evolution_details: {
        item: null | {
          name: string;
          url: string;
        };
        trigger: {
          name: string;
          url: string;
        };
        gender: null | number;
        held_item: null | {
          name: string;
          url: string;
        };
        known_move: null | {
          name: string;
          url: string;
        };
        known_move_type: null | {
          name: string;
          url: string;
        };
        location: null | {
          name: string;
          url: string;
        };
        min_level: null | number;
        min_happiness: null | number;
        min_beauty: null | number;
        min_affection: null | number;
        needs_overworld_rain: boolean;
        party_species: null | {
          name: string;
          url: string;
        };
        party_type: null | {
          name: string;
          url: string;
        };
        relative_physical_stats: null | number;
        time_of_day: string;
        trade_species: null | {
          name: string;
          url: string;
        };
        turn_upside_down: boolean;
      }[];
      evolves_to: {
        is_baby: boolean;
        species: {
          name: string;
          url: string;
        };
        evolution_details: {
          item: null | {
            name: string;
            url: string;
          };
          trigger: {
            name: string;
            url: string;
          };
          gender: null | number;
          held_item: null | {
            name: string;
            url: string;
          };
          known_move: null | {
            name: string;
            url: string;
          };
          known_move_type: null | {
            name: string;
            url: string;
          };
          location: null | {
            name: string;
            url: string;
          };
          min_level: null | number;
          min_happiness: null | number;
          min_beauty: null | number;
          min_affection: null | number;
          needs_overworld_rain: boolean;
          party_species: null | {
            name: string;
            url: string;
          };
          party_type: null | {
            name: string;
            url: string;
          };
          relative_physical_stats: null | number;
          time_of_day: string;
          trade_species: null | {
            name: string;
            url: string;
          };
          turn_upside_down: boolean;
        }[];
        evolves_to: any[];
      }[];
    }[];
  };
}

interface EvolutionData {
  species: {
    name: string;
    url: string;
  };
  details: any;
  image?: string | null;
  id?: number;
}

interface AbilityDetail {
  effect_entries: {
    effect: string;
    language: {
      name: string;
      url: string;
    };
    short_effect: string;
  }[];
  name: string;
}

interface MoveDetail {
  accuracy: number | null;
  damage_class: {
    name: string;
    url: string;
  };
  effect_chance: number | null;
  effect_entries: {
    effect: string;
    language: {
      name: string;
      url: string;
    };
    short_effect: string;
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
  generation: {
    name: string;
    url: string;
  };
  id: number;
  name: string;
  power: number | null;
  pp: number | null;
  priority: number;
  type: {
    name: string;
    url: string;
  };
}

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.replace(/-/g, " ").slice(1);
};

// Helper function to format pokemon number
const formatPokemonNumber = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

// Helper function to convert decimeters to feet and inches
const heightToFeetInches = (heightInDecimeters: number): string => {
  const totalInches = heightInDecimeters * 3.937;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
};

// Helper function to convert hectograms to pounds
const weightToPounds = (weightInHectograms: number): string => {
  const pounds = weightInHectograms / 4.536;
  return `${pounds.toFixed(1)} lbs`;
};

// Function to get evolution chain data
const getEvolutionChainData = async (evolutionChainUrl: string) => {
  try {
    const response = await fetch(evolutionChainUrl);
    if (!response.ok) throw new Error("Failed to fetch evolution chain");
    return await response.json();
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return null;
  }
};

// Function to extract evolution data recursively
const extractEvolutions = async (
  chain: any,
  evolutionList: EvolutionData[] = []
): Promise<EvolutionData[]> => {
  if (!chain) return evolutionList;

  // Add current species to the list
  const speciesUrl = chain.species.url;
  const speciesId = parseInt(speciesUrl.split("/").slice(-2, -1)[0]);

  // Get Pokémon data to find image
  let pokemonImageUrl = null;
  try {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${speciesId}`
    );
    if (pokemonResponse.ok) {
      const pokemonData = await pokemonResponse.json();
      pokemonImageUrl =
        pokemonData.sprites.other["official-artwork"].front_default ||
        pokemonData.sprites.other.home.front_default ||
        pokemonData.sprites.front_default;
    }
  } catch (error) {
    console.error(
      `Error fetching Pokémon data for ${chain.species.name}:`,
      error
    );
  }

  evolutionList.push({
    species: chain.species,
    details: chain.evolution_details,
    image: pokemonImageUrl,
    id: speciesId,
  });

  // Process evolution chains recursively
  if (chain.evolves_to && chain.evolves_to.length > 0) {
    for (const evolution of chain.evolves_to) {
      await extractEvolutions(evolution, evolutionList);
    }
  }

  return evolutionList;
};

// Helper function to get a description of evolution method
const getEvolutionMethod = (details: any): string => {
  if (!details || !details[0]) return "Unknown";

  const detail = details[0];

  if (detail.min_level) {
    return `Level ${detail.min_level}`;
  } else if (detail.min_happiness) {
    return `Happiness (${detail.min_happiness}+)`;
  } else if (detail.item) {
    return `Use ${capitalizeFirstLetter(detail.item.name)}`;
  } else if (detail.held_item) {
    return `Level up holding ${capitalizeFirstLetter(detail.held_item.name)}`;
  } else if (detail.trade_species) {
    return `Trade for ${capitalizeFirstLetter(detail.trade_species.name)}`;
  } else if (detail.known_move) {
    return `Learn ${capitalizeFirstLetter(detail.known_move.name)}`;
  } else if (detail.location) {
    return `Level up at ${capitalizeFirstLetter(detail.location.name)}`;
  } else if (detail.trigger && detail.trigger.name === "trade") {
    return "Trade";
  } else if (
    detail.trigger &&
    detail.trigger.name === "use-item" &&
    detail.item
  ) {
    return `Use ${capitalizeFirstLetter(detail.item.name)}`;
  } else if (detail.time_of_day && detail.time_of_day !== "") {
    return `Level up during ${detail.time_of_day}`;
  }

  return "Special conditions";
};

// Helper function to get English flavor text
const getEnglishFlavorText = (flavorTextEntries: any[]): string => {
  if (!flavorTextEntries || flavorTextEntries.length === 0) {
    return "No description available.";
  }

  // Find the most recent English flavor text
  const englishEntries = flavorTextEntries.filter(
    (entry) => entry.language.name === "en"
  );

  if (englishEntries.length === 0) {
    return "No English description available.";
  }

  // Return the most recent entry
  return englishEntries[englishEntries.length - 1].flavor_text
    .replace(/\f/g, " ")
    .replace(/\n/g, " ")
    .replace(/POKéMON/g, "Pokémon");
};

// Helper function to get English genus
const getEnglishGenus = (genera: any[]): string => {
  if (!genera || genera.length === 0) {
    return "";
  }

  const englishGenus = genera.find((g) => g.language.name === "en");
  return englishGenus ? englishGenus.genus : "";
};

// Map stat name to icon and label
const getStatInfo = (statName: string) => {
  const statMap: Record<string, { icon: any; label: string }> = {
    hp: { icon: Heart, label: "HP" },
    attack: { icon: Swords, label: "Attack" },
    defense: { icon: Shield, label: "Defense" },
    "special-attack": { icon: Zap, label: "Sp. Attack" },
    "special-defense": { icon: ShieldCheck, label: "Sp. Defense" },
    speed: { icon: Activity, label: "Speed" },
  };

  return (
    statMap[statName] || {
      icon: BarChart,
      label: capitalizeFirstLetter(statName),
    }
  );
};

// Get color for stat based on value (0-255 scale)
const getStatColor = (value: number): string => {
  if (value < 50) return "bg-red-500";
  if (value < 80) return "bg-orange-500";
  if (value < 110) return "bg-yellow-500";
  if (value < 140) return "bg-green-500";
  return "bg-blue-500";
};

// Calculate total stats
const calculateTotalStats = (stats: any[]): number => {
  return stats.reduce((sum, stat) => sum + stat.base_stat, 0);
};

export default function PokemonDetailPage({}: {}) {
  const router = useRouter();
  const { name: pokemonName } = useParams();

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutions, setEvolutions] = useState<EvolutionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageTab, setActiveImageTab] = useState("official");
  const [activeTab, setActiveTab] = useState("about");
  const [abilityDetails, setAbilityDetails] = useState<
    Record<string, AbilityDetail>
  >({});
  const [moveDetails, setMoveDetails] = useState<Record<string, MoveDetail>>(
    {}
  );
  const [showAllMoves, setShowAllMoves] = useState(false);

  // Fetch Pokémon data
  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      try {
        // Fetch basic Pokémon data
        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        if (!pokemonResponse.ok) throw new Error("Pokemon not found");
        const pokemonData = await pokemonResponse.json();
        setPokemon(pokemonData);

        // Fetch species data
        const speciesResponse = await fetch(pokemonData.species.url);
        if (!speciesResponse.ok) throw new Error("Species data not found");
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData);

        // Fetch evolution chain
        if (speciesData.evolution_chain) {
          const evolutionChain = await getEvolutionChainData(
            speciesData.evolution_chain.url
          );
          if (evolutionChain) {
            const evolutions = await extractEvolutions(evolutionChain.chain);
            setEvolutions(evolutions);
          }
        }

        // Fetch ability details
        const abilityPromises = pokemonData.abilities.map(
          async (ability: any) => {
            const abilityResponse = await fetch(ability.ability.url);
            if (abilityResponse.ok) {
              const abilityData = await abilityResponse.json();
              return { name: ability.ability.name, data: abilityData };
            }
            return { name: ability.ability.name, data: null };
          }
        );

        const abilityResults = await Promise.all(abilityPromises);
        const abilityDetailsMap: Record<string, AbilityDetail> = {};
        abilityResults.forEach((result) => {
          if (result.data) {
            abilityDetailsMap[result.name] = result.data;
          }
        });
        setAbilityDetails(abilityDetailsMap);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        // Handle error - maybe redirect to 404 page
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [pokemonName]);

  // Fetch move details when a move is selected
  const fetchMoveDetails = async (moveName: string) => {
    if (moveDetails[moveName]) return; // Already fetched

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/move/${moveName}`
      );
      if (!response.ok) throw new Error(`Failed to fetch move ${moveName}`);
      const data = await response.json();
      setMoveDetails((prev) => ({ ...prev, [moveName]: data }));
    } catch (error) {
      console.error(`Error fetching move ${moveName}:`, error);
    }
  };

  // Get ability description in English
  const getAbilityDescription = (abilityName: string): string => {
    const abilityDetail = abilityDetails[abilityName];
    if (!abilityDetail) return "Loading ability details...";

    const englishEntry = abilityDetail.effect_entries.find(
      (entry) => entry.language.name === "en"
    );
    return englishEntry ? englishEntry.effect : "No description available";
  };

  // Get short ability description in English
  const getAbilityShortDescription = (abilityName: string): string => {
    const abilityDetail = abilityDetails[abilityName];
    if (!abilityDetail) return "Loading...";

    const englishEntry = abilityDetail.effect_entries.find(
      (entry) => entry.language.name === "en"
    );
    return englishEntry
      ? englishEntry.short_effect
      : "No description available";
  };

  // Get all available sprite images in an organized way
  const getAllSprites = (): {
    category: string;
    images: { label: string; url: string | null }[];
  }[] => {
    if (!pokemon) return [];

    const sprites = pokemon.sprites;
    const result: {
      category: string;
      images: { label: string; url: string | null }[];
    }[] = [];

    // Main sprites
    const mainSprites = [
      { label: "Front Default", url: sprites.front_default },
      { label: "Back Default", url: sprites.back_default },
      { label: "Front Shiny", url: sprites.front_shiny },
      { label: "Back Shiny", url: sprites.back_shiny },
    ];

    if (
      sprites.front_female ||
      sprites.back_female ||
      sprites.front_shiny_female ||
      sprites.back_shiny_female
    ) {
      mainSprites.push(
        { label: "Front Female", url: sprites.front_female },
        { label: "Back Female", url: sprites.back_female },
        { label: "Front Shiny Female", url: sprites.front_shiny_female },
        { label: "Back Shiny Female", url: sprites.back_shiny_female }
      );
    }

    result.push({
      category: "Default Sprites",
      images: mainSprites.filter((sprite) => sprite.url !== null),
    });

    // Other artwork
    const otherArtwork = [
      {
        label: "Official Artwork",
        url: sprites.other["official-artwork"].front_default,
      },
      {
        label: "Official Artwork Shiny",
        url: sprites.other["official-artwork"].front_shiny,
      },
      { label: "Home Default", url: sprites.other.home.front_default },
      { label: "Home Shiny", url: sprites.other.home.front_shiny },
      { label: "Dream World", url: sprites.other.dream_world.front_default },
    ];

    if (
      sprites.other.home.front_female ||
      sprites.other.home.front_shiny_female ||
      sprites.other.dream_world.front_female
    ) {
      otherArtwork.push(
        { label: "Home Female", url: sprites.other.home.front_female },
        {
          label: "Home Shiny Female",
          url: sprites.other.home.front_shiny_female,
        },
        {
          label: "Dream World Female",
          url: sprites.other.dream_world.front_female,
        }
      );
    }

    result.push({
      category: "Artwork",
      images: otherArtwork.filter((sprite) => sprite.url !== null),
    });

    // Showdown sprites
    if (sprites.other.showdown) {
      const showdownSprites = [
        { label: "Showdown Front", url: sprites.other.showdown.front_default },
        { label: "Showdown Back", url: sprites.other.showdown.back_default },
        {
          label: "Showdown Shiny Front",
          url: sprites.other.showdown.front_shiny,
        },
        {
          label: "Showdown Shiny Back",
          url: sprites.other.showdown.back_shiny,
        },
      ];

      if (
        sprites.other.showdown.front_female ||
        sprites.other.showdown.back_female ||
        sprites.other.showdown.front_shiny_female ||
        sprites.other.showdown.back_shiny_female
      ) {
        showdownSprites.push(
          {
            label: "Showdown Female Front",
            url: sprites.other.showdown.front_female,
          },
          {
            label: "Showdown Female Back",
            url: sprites.other.showdown.back_female,
          },
          {
            label: "Showdown Female Shiny Front",
            url: sprites.other.showdown.front_shiny_female,
          },
          {
            label: "Showdown Female Shiny Back",
            url: sprites.other.showdown.back_shiny_female,
          }
        );
      }

      result.push({
        category: "Showdown Sprites",
        images: showdownSprites.filter((sprite) => sprite.url !== null),
      });
    }

    // Process all game versions
    if (sprites.versions) {
      Object.entries(sprites.versions).forEach(
        ([generationKey, generation]) => {
          Object.entries(generation).forEach(([versionKey, version]) => {
            const versionSprites: { label: string; url: string | null }[] = [];

            // Process all sprite types for this version
            Object.entries(version).forEach(([spriteKey, spriteUrl]) => {
              // Skip animated category since it's an object
              if (spriteKey === "animated") return;

              if (spriteUrl) {
                versionSprites.push({
                  label: capitalizeFirstLetter(spriteKey),
                  url: spriteUrl as string | null,
                });
              }
            });

            // Process animated sprites if present
            if (version.animated) {
              Object.entries(version.animated).forEach(
                ([animSpriteKey, animSpriteUrl]) => {
                  if (animSpriteUrl) {
                    versionSprites.push({
                      label: `Animated ${capitalizeFirstLetter(animSpriteKey)}`,
                      url: animSpriteUrl as string | null,
                    });
                  }
                }
              );
            }

            if (versionSprites.length > 0) {
              result.push({
                category: `${capitalizeFirstLetter(
                  generationKey
                )} - ${capitalizeFirstLetter(versionKey)}`,
                images: versionSprites,
              });
            }
          });
        }
      );
    }

    return result;
  };

  // Get primary type for styling
  const primaryType = pokemon?.types[0]?.type.name || "normal";

  // Filter moves by learn method
  const getMovesByLearnMethod = (method: string) => {
    if (!pokemon) return [];

    const movesByMethod = pokemon.moves
      .filter((move) =>
        move.version_group_details.some(
          (detail) => detail.move_learn_method.name === method
        )
      )
      .sort((a, b) => {
        // Get the minimum level for each move
        const aMinLevel = Math.min(
          ...a.version_group_details
            .filter((detail) => detail.move_learn_method.name === method)
            .map((detail) => detail.level_learned_at)
        );
        const bMinLevel = Math.min(
          ...b.version_group_details
            .filter((detail) => detail.move_learn_method.name === method)
            .map((detail) => detail.level_learned_at)
        );

        // Sort by level if "level-up" method, otherwise by name
        if (method === "level-up") {
          return aMinLevel - bMinLevel;
        } else {
          return a.move.name.localeCompare(b.move.name);
        }
      });

    return movesByMethod;
  };

  // Get the minimum learn level for a move
  const getMinLearnLevel = (move: any): number => {
    if (
      !move.version_group_details ||
      move.version_group_details.length === 0
    ) {
      return 0;
    }

    return Math.min(
      ...move.version_group_details
        .filter((detail: any) => detail.move_learn_method.name === "level-up")
        .map((detail: any) => detail.level_learned_at)
    );
  };

  // Get move details in English
  const getMoveDescription = (moveName: string): string => {
    const moveDetail = moveDetails[moveName];
    if (!moveDetail) return "Loading move details...";

    const englishEntry = moveDetail.effect_entries.find(
      (entry) => entry.language.name === "en"
    );

    let description = englishEntry
      ? englishEntry.effect
      : "No description available";

    // Replace effect_chance with the actual number
    if (moveDetail.effect_chance !== null) {
      description = description.replace(
        /\$effect_chance/g,
        moveDetail.effect_chance.toString()
      );
    }

    return description;
  };

  // Get move short description in English
  const getMoveShortDescription = (moveName: string): string => {
    const moveDetail = moveDetails[moveName];
    if (!moveDetail) return "Loading...";

    const englishEntry = moveDetail.effect_entries.find(
      (entry) => entry.language.name === "en"
    );

    let description = englishEntry
      ? englishEntry.short_effect
      : "No description available";

    // Replace effect_chance with the actual number
    if (moveDetail.effect_chance !== null) {
      description = description.replace(
        /\$effect_chance/g,
        moveDetail.effect_chance.toString()
      );
    }

    return description;
  };

  // Get move flavor text in English
  const getMoveFlavorText = (moveName: string): string => {
    const moveDetail = moveDetails[moveName];
    if (!moveDetail) return "";

    const englishEntry = moveDetail.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );

    return englishEntry ? englishEntry.flavor_text : "";
  };

  if (loading) {
    return (
      <InlineStyle>
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="text-center">
            <div className="pokeball-loader mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Pokémon data...</p>
          </div>
        </div>
      </InlineStyle>
    );
  }

  if (!pokemon || !species) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Pokémon Not Found</h2>
          <p className="mb-6">
            Sorry, we couldn't find data for "{pokemonName}".
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get previous and next Pokémon links
  const prevPokemonId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextPokemonId = pokemon.id < 1010 ? pokemon.id + 1 : null; // Assuming 1010 is the current max

  // Main image to display
  const mainImage =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.other.home.front_default ||
    pokemon.sprites.front_default;

  // Get Pokémon description
  const description = getEnglishFlavorText(species.flavor_text_entries);
  const genus = getEnglishGenus(species.genera);

  // Format gender ratio
  const genderRatio =
    species.gender_rate === -1
      ? "Genderless"
      : `${(8 - species.gender_rate) * 12.5}% Male, ${
          species.gender_rate * 12.5
        }% Female`;

  // Calculate stats
  const totalStats = calculateTotalStats(pokemon.stats);

  // Organize moves by learn method
  const levelUpMoves = getMovesByLearnMethod("level-up");
  const tmMoves = getMovesByLearnMethod("machine");
  const eggMoves = getMovesByLearnMethod("egg");
  const tutorMoves = getMovesByLearnMethod("tutor");

  return (
    <InlineStyle>
      <div className={`flex flex-col min-h-screen bg-black text-white`}>
        {/* Top navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60">
          <div className="container mx-auto px-4 flex h-16 items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="inline-flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Pokédex
              </Link>
            </Button>

            <div className="flex items-center gap-4">
              {prevPokemonId && (
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={`/pokemon/${prevPokemonId}`}
                    className="inline-flex items-center"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />#{prevPokemonId}
                  </Link>
                </Button>
              )}

              {/* Add Chat button here */}
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-600"
                asChild
              >
                <Link
                  href={`/pokemon/${pokemonName}/chat`}
                  className="inline-flex items-center"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                  Chat with {capitalizeFirstLetter(String(pokemonName))}
                </Link>
              </Button>

              {nextPokemonId && (
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={`/pokemon/${nextPokemonId}`}
                    className="inline-flex items-center"
                  >
                    #{nextPokemonId}
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Hero section */}
        <section
          className={`py-12 ${primaryType}-gradient relative overflow-hidden`}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Pokemon image */}
              <div className="order-2 md:order-1 flex justify-center">
                {mainImage && (
                  <div className="relative h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96">
                    <Image
                      src={mainImage}
                      alt={pokemon.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain drop-shadow-xl animate-float"
                      priority
                    />
                  </div>
                )}
              </div>

              {/* Pokemon info */}
              <div className="order-1 md:order-2 text-center md:text-left">
                <div className="mb-2 flex flex-wrap justify-center md:justify-start gap-1">
                  {pokemon.types.map((typeInfo) => (
                    <Badge
                      key={typeInfo.type.name}
                      className={`${typeInfo.type.name}-bg text-white font-medium px-4 py-1 text-sm rounded-full`}
                    >
                      {capitalizeFirstLetter(typeInfo.type.name)}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2">
                  {capitalizeFirstLetter(pokemon.name)}
                </h1>

                <p className="text-lg text-white/70 mb-4">
                  {formatPokemonNumber(pokemon.id)} • {genus}
                </p>

                <p className="text-xl text-white/90 mb-6 max-w-lg">
                  {description}
                </p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {species.is_legendary && (
                    <Badge className="bg-amber-500 text-white px-3 py-1">
                      Legendary
                    </Badge>
                  )}

                  {species.is_mythical && (
                    <Badge className="bg-pink-500 text-white px-3 py-1">
                      Mythical
                    </Badge>
                  )}

                  {species.is_baby && (
                    <Badge className="bg-blue-400 text-white px-3 py-1">
                      Baby
                    </Badge>
                  )}
                  <Button
                    className={`${primaryType}-bg text-white border-none hover:opacity-90`}
                    asChild
                  >
                    <Link
                      href={`/pokemon/${pokemonName}/chat`}
                      className="inline-flex items-center"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Chat with {capitalizeFirstLetter(String(pokemonName))}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Background pokeball */}
          <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4 opacity-10">
            <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-[16px] border-white relative animate-slow-spin">
              <div className="absolute top-1/2 left-0 right-0 h-[16px] bg-white -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-transparent -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12 container mx-auto px-4">
          <Tabs
            defaultValue="about"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start mb-8 bg-slate-800/50 p-1 overflow-x-auto flex-nowrap">
              <TabsTrigger
                value="about"
                className="data-[state=active]:bg-red-500"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="data-[state=active]:bg-red-500"
              >
                Stats
              </TabsTrigger>
              <TabsTrigger
                value="evolution"
                className="data-[state=active]:bg-red-500"
              >
                Evolution
              </TabsTrigger>
              <TabsTrigger
                value="moves"
                className="data-[state=active]:bg-red-500"
              >
                Moves
              </TabsTrigger>
              <TabsTrigger
                value="sprites"
                className="data-[state=active]:bg-red-500"
              >
                Sprites
              </TabsTrigger>
              <TabsTrigger
                value="locations"
                className="data-[state=active]:bg-red-500"
              >
                Locations
              </TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <BadgeInfo className="h-6 w-6 mr-2 text-blue-400" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-400">
                          Height
                        </h4>
                        <p className="flex items-center mt-1">
                          <Ruler className="h-4 w-4 mr-2 text-slate-400" />
                          {pokemon.height / 10} m (
                          {heightToFeetInches(pokemon.height)})
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-400">
                          Weight
                        </h4>
                        <p className="flex items-center mt-1">
                          <Weight className="h-4 w-4 mr-2 text-slate-400" />
                          {pokemon.weight / 10} kg (
                          {weightToPounds(pokemon.weight)})
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Species
                      </h4>
                      <p className="mt-1">{genus}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Abilities
                      </h4>
                      <div className="mt-2 space-y-3">
                        {pokemon.abilities.map((ability) => (
                          <TooltipProvider key={ability.ability.name}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex justify-between items-center p-2 rounded bg-slate-800 hover:bg-slate-700 transition-colors">
                                  <span>
                                    {capitalizeFirstLetter(
                                      ability.ability.name
                                    )}
                                  </span>
                                  {ability.is_hidden && (
                                    <Badge variant="outline" className="ml-2">
                                      Hidden
                                    </Badge>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <div className="space-y-2">
                                  <p className="font-bold">
                                    {capitalizeFirstLetter(
                                      ability.ability.name
                                    )}
                                  </p>
                                  <p>
                                    {getAbilityShortDescription(
                                      ability.ability.name
                                    )}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Species Info */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Award className="h-6 w-6 mr-2 text-yellow-400" />
                      Species Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Habitat
                      </h4>
                      <p className="mt-1">
                        {species.habitat
                          ? capitalizeFirstLetter(species.habitat.name)
                          : "Unknown"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Color
                      </h4>
                      <div className="flex items-center mt-1">
                        <div
                          className="h-4 w-4 rounded-full mr-2"
                          style={{
                            backgroundColor: species.color
                              ? species.color.name
                              : "#888",
                          }}
                        ></div>
                        {capitalizeFirstLetter(species.color.name)}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Gender Ratio
                      </h4>
                      <p className="mt-1">{genderRatio}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Egg Groups
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {species.egg_groups.map((group) => (
                          <Badge key={group.name} variant="outline">
                            {capitalizeFirstLetter(group.name)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Growth Rate
                      </h4>
                      <p className="mt-1">
                        {capitalizeFirstLetter(species.growth_rate.name)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Base Happiness
                      </h4>
                      <p className="mt-1">{species.base_happiness} / 255</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Capture Rate
                      </h4>
                      <p className="mt-1">
                        {species.capture_rate} / 255 (
                        {((species.capture_rate / 255) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Training Info & Game Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Dumbbell className="h-6 w-6 mr-2 text-green-400" />
                      Training
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Base Experience
                      </h4>
                      <p className="mt-1">
                        {pokemon.base_experience || "Unknown"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Base Friendship
                      </h4>
                      <p className="mt-1">{species.base_happiness} / 255</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Catch Rate
                      </h4>
                      <p className="mt-1">{species.capture_rate} / 255</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Growth Rate
                      </h4>
                      <p className="mt-1">
                        {capitalizeFirstLetter(species.growth_rate.name)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Effort Values (EV)
                      </h4>
                      <div className="space-y-2 mt-1">
                        {pokemon.stats.map((stat) => {
                          if (stat.effort > 0) {
                            return (
                              <div
                                key={stat.stat.name}
                                className="flex justify-between"
                              >
                                <span>
                                  {getStatInfo(stat.stat.name).label}:
                                </span>
                                <span>{stat.effort}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Disc className="h-6 w-6 mr-2 text-purple-400" />
                      Game Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Generation
                      </h4>
                      <p className="mt-1">
                        {capitalizeFirstLetter(species.generation.name)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Pokédex Numbers
                      </h4>
                      <div className="mt-2 space-y-2">
                        {species.pokedex_numbers.slice(0, 5).map((entry) => (
                          <div
                            key={entry.pokedex.name}
                            className="flex justify-between"
                          >
                            <span>
                              {capitalizeFirstLetter(entry.pokedex.name)}:
                            </span>
                            <span>#{entry.entry_number}</span>
                          </div>
                        ))}
                        {species.pokedex_numbers.length > 5 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                          >
                            Show {species.pokedex_numbers.length - 5} more
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-400">
                        Game Indices
                      </h4>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                        {pokemon.game_indices.slice(0, 6).map((game) => (
                          <div key={game.version.name}>
                            <span>
                              {capitalizeFirstLetter(game.version.name)}
                            </span>
                          </div>
                        ))}
                        {pokemon.game_indices.length > 6 && (
                          <div className="col-span-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs"
                            >
                              Show {pokemon.game_indices.length - 6} more
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {pokemon.held_items.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400">
                          Held Items
                        </h4>
                        <div className="mt-2 space-y-2">
                          {pokemon.held_items.map((heldItem) => (
                            <div
                              key={heldItem.item.name}
                              className="flex justify-between"
                            >
                              <span>
                                {capitalizeFirstLetter(heldItem.item.name)}
                              </span>
                              <span>
                                {heldItem.version_details[0]?.rarity}% chance
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="mt-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <BarChart className="h-6 w-6 mr-2 text-indigo-400" />
                    Base Stats
                  </CardTitle>
                  <CardDescription>
                    Base stats total: <strong>{totalStats}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pokemon.stats.map((stat) => {
                      const { icon: StatIcon, label } = getStatInfo(
                        stat.stat.name
                      );
                      const statColor = getStatColor(stat.base_stat);

                      return (
                        <div key={stat.stat.name} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <StatIcon className="h-5 w-5 mr-2 text-slate-400" />
                              <span>{label}</span>
                            </div>
                            <span className="font-mono">{stat.base_stat}</span>
                          </div>
                          <Progress
                            value={stat.base_stat}
                            max={255}
                            className="h-2 bg-slate-700"
                            indicatorClassName={statColor}
                          />
                        </div>
                      );
                    })}

                    <div className="pt-4 border-t border-slate-800">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                          <span>Total</span>
                        </div>
                        <span className="font-mono">{totalStats}</span>
                      </div>
                      <Progress
                        value={totalStats}
                        max={600}
                        className="h-2 bg-slate-700"
                        indicatorClassName={getStatColor(totalStats / 6)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Type Effectiveness */}
              <Card className="bg-slate-900 border-slate-800 mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Shield className="h-6 w-6 mr-2 text-cyan-400" />
                    Type Effectiveness
                  </CardTitle>
                  <CardDescription>
                    Damage taken by this Pokémon from different types of moves
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Would need to implement type effectiveness calculation based on Pokémon types */}
                    <p className="text-slate-400">
                      Type effectiveness calculation would be implemented here
                      based on the Pokémon's type(s).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evolution Tab */}
            <TabsContent value="evolution" className="mt-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Sparkles className="h-6 w-6 mr-2 text-purple-400" />
                    Evolution Chain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {evolutions.length <= 1 ? (
                    <div className="text-center py-8">
                      <p>This Pokémon does not evolve.</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2"></div>
                      <div className="relative flex flex-wrap justify-center md:justify-between items-center gap-8 py-8">
                        {evolutions.map((evolution, index) => {
                          const isCurrentPokemon =
                            pokemon.name === evolution.species.name;

                          return (
                            <div
                              key={evolution.species.name}
                              className="flex flex-col items-center"
                            >
                              {/* Evolution method (except for first Pokémon) */}
                              {index > 0 && (
                                <div className="mb-4 px-4 py-2 bg-slate-800 rounded-full text-sm whitespace-nowrap">
                                  {getEvolutionMethod(evolution.details)}
                                </div>
                              )}

                              {/* Pokémon image and name */}
                              <div
                                className={`relative ${
                                  isCurrentPokemon ? "ring-4 ring-red-500" : ""
                                } rounded-full bg-slate-800 p-4 z-10`}
                              >
                                {evolution.image ? (
                                  <div className="relative h-24 w-24">
                                    <Image
                                      src={evolution.image}
                                      alt={evolution.species.name}
                                      fill
                                      sizes="96px"
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-24 w-24 bg-slate-700 rounded-full flex items-center justify-center">
                                    <span>?</span>
                                  </div>
                                )}
                              </div>

                              <h3 className="mt-3 font-medium">
                                {capitalizeFirstLetter(evolution.species.name)}
                              </h3>

                              {evolution.id && (
                                <p className="text-sm text-slate-400">
                                  {formatPokemonNumber(evolution.id)}
                                </p>
                              )}

                              {!isCurrentPokemon && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2"
                                  asChild
                                >
                                  <Link
                                    href={`/pokemon/${evolution.species.name}`}
                                  >
                                    View
                                  </Link>
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Moves Tab */}
            <TabsContent value="moves" className="mt-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Swords className="h-6 w-6 mr-2 text-red-400" />
                    Moves
                  </CardTitle>
                  <CardDescription>
                    This Pokémon can learn {pokemon.moves.length} moves in total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="level-up" className="w-full">
                    <TabsList className="w-full mb-4 bg-slate-800/50 p-1 overflow-x-auto flex-nowrap">
                      <TabsTrigger value="level-up">Level Up</TabsTrigger>
                      <TabsTrigger value="tm">TM/HM</TabsTrigger>
                      <TabsTrigger value="egg">Egg</TabsTrigger>
                      <TabsTrigger value="tutor">Tutor</TabsTrigger>
                    </TabsList>

                    <TabsContent value="level-up">
                      {levelUpMoves.length === 0 ? (
                        <p className="py-4 text-center text-slate-400">
                          This Pokémon doesn't learn any moves by leveling up.
                        </p>
                      ) : (
                        <div className="rounded-md border border-slate-800 overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-800">
                              <tr>
                                <th className="p-2 text-left">Level</th>
                                <th className="p-2 text-left">Move</th>
                                <th className="p-2 text-left">Type</th>
                                <th className="p-2 text-left">Category</th>
                                <th className="p-2 text-right">Power</th>
                                <th className="p-2 text-right">Accuracy</th>
                                <th className="p-2 text-right">PP</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {levelUpMoves
                                .slice(0, showAllMoves ? undefined : 10)
                                .map((moveData) => {
                                  const level = getMinLearnLevel(moveData);
                                  const moveName = moveData.move.name;
                                  // Fetch move details if not already fetched
                                  if (!moveDetails[moveName]) {
                                    fetchMoveDetails(moveName);
                                  }
                                  const move = moveDetails[moveName];

                                  return (
                                    <tr
                                      key={moveName}
                                      className="hover:bg-slate-800/50 transition-colors"
                                      onClick={() => fetchMoveDetails(moveName)}
                                    >
                                      <td className="p-2">{level}</td>
                                      <td className="p-2">
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger className="text-left">
                                              {capitalizeFirstLetter(moveName)}
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-md">
                                              {move ? (
                                                <div className="space-y-1">
                                                  <div className="font-bold">
                                                    {capitalizeFirstLetter(
                                                      moveName
                                                    )}
                                                  </div>
                                                  <div>
                                                    {getMoveShortDescription(
                                                      moveName
                                                    )}
                                                  </div>
                                                  {getMoveFlavorText(
                                                    moveName
                                                  ) && (
                                                    <div className="text-xs italic text-slate-300">
                                                      "
                                                      {getMoveFlavorText(
                                                        moveName
                                                      )}
                                                      "
                                                    </div>
                                                  )}
                                                </div>
                                              ) : (
                                                "Loading move details..."
                                              )}
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </td>
                                      <td className="p-2">
                                        {move ? (
                                          <Badge
                                            className={`${move.type.name}-bg text-white`}
                                          >
                                            {capitalizeFirstLetter(
                                              move.type.name
                                            )}
                                          </Badge>
                                        ) : (
                                          <div className="w-16 h-5 bg-slate-700 animate-pulse rounded"></div>
                                        )}
                                      </td>
                                      <td className="p-2">
                                        {move?.damage_class ? (
                                          capitalizeFirstLetter(
                                            move.damage_class.name
                                          )
                                        ) : (
                                          <div className="w-16 h-5 bg-slate-700 animate-pulse rounded"></div>
                                        )}
                                      </td>
                                      <td className="p-2 text-right">
                                        {move?.power !== undefined ? (
                                          move.power !== null ? (
                                            move.power
                                          ) : (
                                            "—"
                                          )
                                        ) : (
                                          <div className="w-8 h-5 bg-slate-700 animate-pulse rounded ml-auto"></div>
                                        )}
                                      </td>
                                      <td className="p-2 text-right">
                                        {move?.accuracy !== undefined ? (
                                          move.accuracy !== null ? (
                                            `${move.accuracy}%`
                                          ) : (
                                            "—"
                                          )
                                        ) : (
                                          <div className="w-12 h-5 bg-slate-700 animate-pulse rounded ml-auto"></div>
                                        )}
                                      </td>
                                      <td className="p-2 text-right">
                                        {move?.pp !== undefined ? (
                                          move.pp !== null ? (
                                            move.pp
                                          ) : (
                                            "—"
                                          )
                                        ) : (
                                          <div className="w-8 h-5 bg-slate-700 animate-pulse rounded ml-auto"></div>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>

                          {levelUpMoves.length > 10 && !showAllMoves && (
                            <div className="p-3 text-center border-t border-slate-800">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAllMoves(true)}
                              >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Show {levelUpMoves.length - 10} more moves
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="tm">
                      {tmMoves.length === 0 ? (
                        <p className="py-4 text-center text-slate-400">
                          This Pokémon doesn't learn any moves from TMs/HMs.
                        </p>
                      ) : (
                        <div className="rounded-md border border-slate-800 overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-800">
                              <tr>
                                <th className="p-2 text-left">Move</th>
                                <th className="p-2 text-left">Type</th>
                                <th className="p-2 text-left">Category</th>
                                <th className="p-2 text-right">Power</th>
                                <th className="p-2 text-right">Accuracy</th>
                                <th className="p-2 text-right">PP</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {tmMoves.slice(0, 10).map((moveData) => {
                                const moveName = moveData.move.name;
                                // Fetch move details if not already fetched
                                if (!moveDetails[moveName]) {
                                  fetchMoveDetails(moveName);
                                }
                                const move = moveDetails[moveName];

                                return (
                                  <tr
                                    key={moveName}
                                    className="hover:bg-slate-800/50 transition-colors"
                                    onClick={() => fetchMoveDetails(moveName)}
                                  >
                                    <td className="p-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger className="text-left">
                                            {capitalizeFirstLetter(moveName)}
                                          </TooltipTrigger>
                                          <TooltipContent className="max-w-md">
                                            {move ? (
                                              <div className="space-y-1">
                                                <div className="font-bold">
                                                  {capitalizeFirstLetter(
                                                    moveName
                                                  )}
                                                </div>
                                                <div>
                                                  {getMoveShortDescription(
                                                    moveName
                                                  )}
                                                </div>
                                                {getMoveFlavorText(
                                                  moveName
                                                ) && (
                                                  <div className="text-xs italic text-slate-300">
                                                    "
                                                    {getMoveFlavorText(
                                                      moveName
                                                    )}
                                                    "
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              "Loading move details..."
                                            )}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </td>
                                    <td className="p-2">
                                      {move ? (
                                        <Badge
                                          className={`${move.type.name}-bg text-white`}
                                        >
                                          {capitalizeFirstLetter(
                                            move.type.name
                                          )}
                                        </Badge>
                                      ) : (
                                        <div className="w-16 h-5 bg-slate-700 animate-pulse rounded"></div>
                                      )}
                                    </td>
                                    <td className="p-2">
                                      {move?.damage_class ? (
                                        capitalizeFirstLetter(
                                          move.damage_class.name
                                        )
                                      ) : (
                                        <div className="w-16 h-5 bg-slate-700 animate-pulse rounded"></div>
                                      )}
                                    </td>
                                    <td className="p-2 text-right">
                                      {move?.power !== undefined ? (
                                        move.power !== null ? (
                                          move.power
                                        ) : (
                                          "—"
                                        )
                                      ) : (
                                        <div className="w-8 h-5 bg-slate-700 animate-pulse rounded ml-auto"></div>
                                      )}
                                    </td>
                                    <td className="p-2 text-right">
                                      {move?.accuracy !== undefined ? (
                                        move.accuracy !== null ? (
                                          `${move.accuracy}%`
                                        ) : (
                                          "—"
                                        )
                                      ) : (
                                        <div className="w-12 h-5 bg-slate-700 animate-pulse rounded ml-auto"></div>
                                      )}
                                    </td>
                                    <td className="p-2 text-right">
                                      {move?.pp !== undefined ? (
                                        move.pp !== null ? (
                                          move.pp
                                        ) : (
                                          "—"
                                        )
                                      ) : (
                                        <div className="w-8 h-5 bg-slate-700 animate-pulse rounded ml-auto"></div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          {tmMoves.length > 10 && (
                            <div className="p-3 text-center border-t border-slate-800">
                              <Button variant="ghost" size="sm">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Show {tmMoves.length - 10} more moves
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="egg">
                      {eggMoves.length === 0 ? (
                        <p className="py-4 text-center text-slate-400">
                          This Pokémon doesn't learn any moves from breeding.
                        </p>
                      ) : (
                        <div className="rounded-md border border-slate-800">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-800">
                              <tr>
                                <th className="p-2 text-left">Move</th>
                                <th className="p-2 text-left">Type</th>
                                <th className="p-2 text-left">Category</th>
                                <th className="p-2 text-right">Power</th>
                                <th className="p-2 text-right">Accuracy</th>
                                <th className="p-2 text-right">PP</th>
                              </tr>
                            </thead>
                            <tbody>
                              {eggMoves.map((moveData) => {
                                const moveName = moveData.move.name;
                                return (
                                  <tr key={moveName}>
                                    <td className="p-2">
                                      {capitalizeFirstLetter(moveName)}
                                    </td>
                                    <td className="p-2">-</td>
                                    <td className="p-2">-</td>
                                    <td className="p-2 text-right">-</td>
                                    <td className="p-2 text-right">-</td>
                                    <td className="p-2 text-right">-</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="tutor">
                      {tutorMoves.length === 0 ? (
                        <p className="py-4 text-center text-slate-400">
                          This Pokémon doesn't learn any moves from move tutors.
                        </p>
                      ) : (
                        <div className="rounded-md border border-slate-800">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-800">
                              <tr>
                                <th className="p-2 text-left">Move</th>
                                <th className="p-2 text-left">Type</th>
                                <th className="p-2 text-left">Category</th>
                                <th className="p-2 text-right">Power</th>
                                <th className="p-2 text-right">Accuracy</th>
                                <th className="p-2 text-right">PP</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tutorMoves.map((moveData) => {
                                const moveName = moveData.move.name;
                                return (
                                  <tr key={moveName}>
                                    <td className="p-2">
                                      {capitalizeFirstLetter(moveName)}
                                    </td>
                                    <td className="p-2">-</td>
                                    <td className="p-2">-</td>
                                    <td className="p-2 text-right">-</td>
                                    <td className="p-2 text-right">-</td>
                                    <td className="p-2 text-right">-</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sprites Tab */}
            <TabsContent value="sprites" className="mt-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Eye className="h-6 w-6 mr-2 text-green-400" />
                    Sprites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue="official"
                    value={activeImageTab}
                    onValueChange={setActiveImageTab}
                    className="w-full"
                  >
                    <TabsList className="w-full mb-6 bg-slate-800/50 p-1 overflow-x-auto flex-nowrap">
                      <TabsTrigger value="official">
                        Official Artwork
                      </TabsTrigger>
                      <TabsTrigger value="home">HOME</TabsTrigger>
                      <TabsTrigger value="3d">3D Models</TabsTrigger>
                      <TabsTrigger value="sprites">Game Sprites</TabsTrigger>
                      <TabsTrigger value="all">All Sprites</TabsTrigger>
                    </TabsList>

                    <TabsContent value="official" className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pokemon.sprites.other["official-artwork"]
                          .front_default && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-64 w-64">
                              <Image
                                src={
                                  pokemon.sprites.other["official-artwork"]
                                    .front_default
                                }
                                alt={`${pokemon.name} official artwork`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              Official Artwork
                            </p>
                          </div>
                        )}

                        {pokemon.sprites.other["official-artwork"]
                          .front_shiny && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-64 w-64">
                              <Image
                                src={
                                  pokemon.sprites.other["official-artwork"]
                                    .front_shiny
                                }
                                alt={`${pokemon.name} official artwork shiny`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              Official Artwork (Shiny)
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="home" className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {pokemon.sprites.other.home.front_default && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={pokemon.sprites.other.home.front_default}
                                alt={`${pokemon.name} home default`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              HOME (Default)
                            </p>
                          </div>
                        )}

                        {pokemon.sprites.other.home.front_shiny && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={pokemon.sprites.other.home.front_shiny}
                                alt={`${pokemon.name} home shiny`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              HOME (Shiny)
                            </p>
                          </div>
                        )}

                        {pokemon.sprites.other.home.front_female && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={pokemon.sprites.other.home.front_female}
                                alt={`${pokemon.name} home female`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              HOME (Female)
                            </p>
                          </div>
                        )}

                        {pokemon.sprites.other.home.front_shiny_female && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={
                                  pokemon.sprites.other.home.front_shiny_female
                                }
                                alt={`${pokemon.name} home shiny female`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              HOME (Shiny Female)
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="3d" className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {pokemon.sprites.other.showdown?.front_default && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={
                                  pokemon.sprites.other.showdown.front_default
                                }
                                alt={`${pokemon.name} showdown default`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              Showdown (Default)
                            </p>
                          </div>
                        )}

                        {pokemon.sprites.other.showdown?.back_default && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={
                                  pokemon.sprites.other.showdown.back_default
                                }
                                alt={`${pokemon.name} showdown back default`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              Showdown (Back)
                            </p>
                          </div>
                        )}

                        {pokemon.sprites.other.showdown?.front_shiny && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={pokemon.sprites.other.showdown.front_shiny}
                                alt={`${pokemon.name} showdown shiny`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              Showdown (Shiny)
                            </p>
                          </div>
                        )}

                        {pokemon.sprites.other.showdown?.back_shiny && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={pokemon.sprites.other.showdown.back_shiny}
                                alt={`${pokemon.name} showdown back shiny`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              Showdown (Back Shiny)
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="sprites" className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {pokemon.sprites.front_default && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={pokemon.sprites.front_default}
                                alt={`${pokemon.name} front default`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain pixelated"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              Front (Default)
                            </p>
                          </div>
                        )}

                        {pokemon.sprites.back_default && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={pokemon.sprites.back_default}
                                alt={`${pokemon.name} back default`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain pixelated"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              Back (Default)
                            </p>
                          </div>
                        )}

                        {pokemon.sprites.front_shiny && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={pokemon.sprites.front_shiny}
                                alt={`${pokemon.name} front shiny`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain pixelated"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              Front (Shiny)
                            </p>
                          </div>
                        )}

                        {pokemon.sprites.back_shiny && (
                          <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg">
                            <div className="relative h-32 w-32">
                              <Image
                                src={pokemon.sprites.back_shiny}
                                alt={`${pokemon.name} back shiny`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain pixelated"
                              />
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                              Back (Shiny)
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="all" className="space-y-8">
                      {getAllSprites().map((category) => (
                        <div key={category.category} className="mb-10">
                          <h3 className="text-xl font-bold mb-4">
                            {category.category}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {category.images.map((image) => (
                              <div
                                key={image.label}
                                className="flex flex-col items-center p-4 bg-slate-800/50 rounded-lg"
                              >
                                <div className="relative h-32 w-32">
                                  {image.url && (
                                    <Image
                                      src={image.url}
                                      alt={`${
                                        pokemon.name
                                      } ${image.label.toLowerCase()}`}
                                      fill
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      className="object-contain pixelated"
                                    />
                                  )}
                                </div>
                                <p className="mt-4 text-sm text-slate-300">
                                  {image.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations" className="mt-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Hash className="h-6 w-6 mr-2 text-yellow-400" />
                    Locations
                  </CardTitle>
                  <CardDescription>
                    Areas where this Pokémon can be found in different games
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="py-4 text-center text-slate-400">
                    To see where you can find{" "}
                    {capitalizeFirstLetter(pokemon.name)}, use the API endpoint:
                    <code className="block mt-2 p-2 bg-slate-800 rounded">
                      {pokemon.location_area_encounters}
                    </code>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
