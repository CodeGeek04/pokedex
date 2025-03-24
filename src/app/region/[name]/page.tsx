"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Rabbit as PokemonIcon,
  Star,
  Flame,
  Award,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InlineStyle from "@/components/inline-style";

// Define types
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

interface Region {
  id: number;
  name: string;
  locations: string[];
  mainGames: string[];
  generation: string;
  starter_pokemon: number[];
  legendary_pokemon: number[];
  description: string;
  imageUrl: string;
  mapUrl: string;
}

// Helper functions
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.replace(/-/g, " ").slice(1);
};

const formatPokemonNumber = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

// Region data (since the PokeAPI doesn't provide all the data we need)
const regionData: Record<string, Region> = {
  kanto: {
    id: 1,
    name: "Kanto",
    locations: [
      "Pallet Town",
      "Viridian City",
      "Pewter City",
      "Cerulean City",
      "Vermilion City",
      "Lavender Town",
      "Celadon City",
      "Fuchsia City",
      "Saffron City",
      "Cinnabar Island",
      "Indigo Plateau",
      "Victory Road",
      "Viridian Forest",
      "Mt. Moon",
      "Rock Tunnel",
      "Safari Zone",
    ],
    mainGames: [
      "Red",
      "Blue",
      "Yellow",
      "FireRed",
      "LeafGreen",
      "Let's Go Pikachu",
      "Let's Go Eevee",
    ],
    generation: "Generation I",
    starter_pokemon: [1, 4, 7], // Bulbasaur, Charmander, Squirtle
    legendary_pokemon: [144, 145, 146, 150, 151], // Articuno, Zapdos, Moltres, Mewtwo, Mew
    description:
      "Kanto is a region based on the real-life Kantō region of Japan. It was the first region to be introduced in the Pokémon series, featured in the original games Pokémon Red, Green, Blue, and Yellow. It is a diverse land with varying terrain including mountains, forests, and urban areas, all connected by Routes. The region contains cities like Viridian City and Cerulean City, and landmarks such as Mt. Moon and the Safari Zone.",
    imageUrl: "/regions/kanto.jpg",
    mapUrl: "/regions/kanto-map.jpg",
  },
  johto: {
    id: 2,
    name: "Johto",
    locations: [
      "New Bark Town",
      "Cherrygrove City",
      "Violet City",
      "Azalea Town",
      "Goldenrod City",
      "Ecruteak City",
      "Olivine City",
      "Cianwood City",
      "Mahogany Town",
      "Blackthorn City",
      "Mt. Silver",
      "Ruins of Alph",
      "Union Cave",
      "Ilex Forest",
      "Lake of Rage",
      "Ice Path",
    ],
    mainGames: ["Gold", "Silver", "Crystal", "HeartGold", "SoulSilver"],
    generation: "Generation II",
    starter_pokemon: [152, 155, 158], // Chikorita, Cyndaquil, Totodile
    legendary_pokemon: [243, 244, 245, 249, 250, 251], // Raikou, Entei, Suicune, Lugia, Ho-Oh, Celebi
    description:
      "Johto is a region located west of Kanto. It was introduced in Pokémon Gold, Silver, and Crystal. The landscape consists of rural and urban areas with many old traditions and legends. It has its own Pokémon League and is closely connected to Kanto, with players able to travel between the two regions in the games Gold, Silver, Crystal, HeartGold, and SoulSilver.",
    imageUrl: "/regions/johto.jpg",
    mapUrl: "/regions/johto-map.jpg",
  },
  hoenn: {
    id: 3,
    name: "Hoenn",
    locations: [
      "Littleroot Town",
      "Oldale Town",
      "Petalburg City",
      "Rustboro City",
      "Dewford Town",
      "Slateport City",
      "Mauville City",
      "Fallarbor Town",
      "Lavaridge Town",
      "Fortree City",
      "Lilycove City",
      "Mossdeep City",
      "Sootopolis City",
      "Pacifidlog Town",
      "Ever Grande City",
      "Meteor Falls",
    ],
    mainGames: ["Ruby", "Sapphire", "Emerald", "Omega Ruby", "Alpha Sapphire"],
    generation: "Generation III",
    starter_pokemon: [252, 255, 258], // Treecko, Torchic, Mudkip
    legendary_pokemon: [377, 378, 379, 380, 381, 382, 383, 384, 385], // Regirock, Regice, Registeel, Latias, Latios, Kyogre, Groudon, Rayquaza, Jirachi
    description:
      "Hoenn is a region with many natural wonders, including routes, towns, caves, oceans, and more. It hosts contests and gyms, and is the setting for Pokémon Ruby, Sapphire, and Emerald. The landscape features diverse biomes, including beaches, forests, mountains, and a large ocean. It's known for having more water routes than previous regions, reflecting its island-like geography.",
    imageUrl: "/regions/hoenn.jpg",
    mapUrl: "/regions/hoenn-map.jpg",
  },
  sinnoh: {
    id: 4,
    name: "Sinnoh",
    locations: [
      "Twinleaf Town",
      "Sandgem Town",
      "Jubilife City",
      "Oreburgh City",
      "Floaroma Town",
      "Eterna City",
      "Hearthome City",
      "Solaceon Town",
      "Veilstone City",
      "Pastoria City",
      "Celestic Town",
      "Canalave City",
      "Snowpoint City",
      "Sunyshore City",
      "Fight Area",
      "Mt. Coronet",
    ],
    mainGames: [
      "Diamond",
      "Pearl",
      "Platinum",
      "Brilliant Diamond",
      "Shining Pearl",
    ],
    generation: "Generation IV",
    starter_pokemon: [387, 390, 393], // Turtwig, Chimchar, Piplup
    legendary_pokemon: [
      480, 481, 482, 483, 484, 485, 486, 487, 488, 491, 492, 493,
    ], // Uxie, Mesprit, Azelf, Dialga, Palkia, Heatran, Regigigas, Giratina, Cresselia, Darkrai, Shaymin, Arceus
    description:
      "Sinnoh is based on the Japanese island of Hokkaido and is characterized by its many mountains, which include Mt. Coronet, which divides the region into two parts. It's known for its colder climate, with snow covering the northern areas. Sinnoh is also home to many myths and legends, particularly surrounding the creation of the universe and the legendary Pokémon Dialga, Palkia, and Giratina.",
    imageUrl: "/regions/sinnoh.jpg",
    mapUrl: "/regions/sinnoh-map.jpg",
  },
  unova: {
    id: 5,
    name: "Unova",
    locations: [
      "Nuvema Town",
      "Accumula Town",
      "Striaton City",
      "Nacrene City",
      "Castelia City",
      "Nimbasa City",
      "Driftveil City",
      "Mistralton City",
      "Icirrus City",
      "Opelucid City",
      "Victory Road",
      "N's Castle",
      "Pinwheel Forest",
      "Desert Resort",
      "Chargestone Cave",
      "Giant Chasm",
    ],
    mainGames: ["Black", "White", "Black 2", "White 2"],
    generation: "Generation V",
    starter_pokemon: [495, 498, 501], // Snivy, Tepig, Oshawott
    legendary_pokemon: [
      638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
    ], // Cobalion, Terrakion, Virizion, Tornadus, Thundurus, Reshiram, Zekrom, Landorus, Kyurem, Keldeo, Meloetta, Genesect
    description:
      "Unova is based on New York City and the surrounding New York metropolitan area. It is a region with a large city center and diverse environments, including deserts, mountains, and forests. Unova is geographically distant from the previous four regions, which reflects how the U.S. is geographically distant from Japan. It introduced 156 new Pokémon, the most of any region at the time.",
    imageUrl: "/regions/unova.jpg",
    mapUrl: "/regions/unova-map.jpg",
  },
  kalos: {
    id: 6,
    name: "Kalos",
    locations: [
      "Vaniville Town",
      "Aquacorde Town",
      "Santalune City",
      "Lumiose City",
      "Camphrier Town",
      "Cyllage City",
      "Ambrette Town",
      "Geosenge Town",
      "Shalour City",
      "Coumarine City",
      "Laverre City",
      "Dendemille Town",
      "Anistar City",
      "Couriway Town",
      "Snowbelle City",
      "Kiloude City",
    ],
    mainGames: ["X", "Y"],
    generation: "Generation VI",
    starter_pokemon: [650, 653, 656], // Chespin, Fennekin, Froakie
    legendary_pokemon: [716, 717, 718, 719, 720, 721], // Xerneas, Yveltal, Zygarde, Diancie, Hoopa, Volcanion
    description:
      "Kalos is inspired by France and is known for its focus on beauty. The region has a variety of towns and cities, with the largest being Lumiose City, which is based on Paris and features a tower similar to the Eiffel Tower. It's the setting for Pokémon X and Y, which introduced 3D graphics to the main series games. Kalos also introduced the Fairy type and Mega Evolution.",
    imageUrl: "/regions/kalos.jpg",
    mapUrl: "/regions/kalos-map.jpg",
  },
  alola: {
    id: 7,
    name: "Alola",
    locations: [
      "Iki Town",
      "Hau'oli City",
      "Heahea City",
      "Konikoni City",
      "Malie City",
      "Seafolk Village",
      "Poni Wilds",
      "Exeggutor Island",
      "Ten Carat Hill",
      "Wela Volcano Park",
      "Lush Jungle",
      "Aether Paradise",
    ],
    mainGames: ["Sun", "Moon", "Ultra Sun", "Ultra Moon"],
    generation: "Generation VII",
    starter_pokemon: [722, 725, 728], // Rowlet, Litten, Popplio
    legendary_pokemon: [
      772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797,
      798, 799, 800, 801, 802, 805, 806, 807,
    ], // Type: Null, Silvally, Tapu Koko, Tapu Lele, Tapu Bulu, Tapu Fini, Cosmog, Cosmoem, Solgaleo, Lunala, Nihilego, Buzzwole, Pheromosa, Xurkitree, Celesteela, Kartana, Guzzlord, Necrozma, Magearna, Marshadow, Poipole, Naganadel, Stakataka, Blacephalon, Zeraora
    description:
      "Alola is based on Hawaii and consists of four main islands and one artificial island. Each island features unique challenges and environments. The region features a rich culture deeply connected to Pokémon and nature, with Island Trials replacing the traditional Gym system. Alola introduced Regional Variants, Pokémon that adapted to the unique environment of Alola and evolved differently from their counterparts in other regions.",
    imageUrl: "/regions/alola.jpg",
    mapUrl: "/regions/alola-map.jpg",
  },
  galar: {
    id: 8,
    name: "Galar",
    locations: [
      "Postwick",
      "Wedgehurst",
      "Motostoke",
      "Turffield",
      "Hulbury",
      "Hammerlocke",
      "Stow-on-Side",
      "Ballonlea",
      "Circhester",
      "Spikemuth",
      "Wyndon",
      "Slumbering Weald",
      "Galar Mine",
      "Glimwood Tangle",
      "Wild Area",
      "Isle of Armor",
    ],
    mainGames: ["Sword", "Shield"],
    generation: "Generation VIII",
    starter_pokemon: [810, 813, 816], // Grookey, Scorbunny, Sobble
    legendary_pokemon: [888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898], // Zacian, Zamazenta, Eternatus, Kubfu, Urshifu, Zarude, Regieleki, Regidrago, Glastrier, Spectrier, Calyrex
    description:
      "Galar is based on Great Britain and features diverse landscapes ranging from rural countryside to industrial cities. The region is known for its Pokémon League being structured like a soccer tournament, with Gym battles taking place in stadiums filled with cheering crowds. Galar introduced the Dynamax and Gigantamax phenomena, allowing Pokémon to grow to enormous sizes during battle.",
    imageUrl: "/regions/galar.jpg",
    mapUrl: "/regions/galar-map.jpg",
  },
  paldea: {
    id: 9,
    name: "Paldea",
    locations: [
      "Mesagoza",
      "Cortondo",
      "Levincia",
      "Cascarrafa",
      "Medali",
      "Montenevera",
      "Artazon",
      "Alfornada",
      "Porto Marinada",
      "Area Zero",
      "Mesagoza",
      "North Province",
      "South Province",
      "East Province",
      "West Province",
      "Glaseado Mountain",
    ],
    mainGames: ["Scarlet", "Violet"],
    generation: "Generation IX",
    starter_pokemon: [906, 909, 912], // Sprigatito, Fuecoco, Quaxly
    legendary_pokemon: [
      993, 994, 995, 997, 998, 999, 1000, 1001, 1002, 1003, 1004,
    ], // Koraidon, Miraidon, Ting-Lu, Chien-Pao, Wo-Chien, Chi-Yu, Roaring Moon, Iron Valiant, Walking Wake, Iron Leaves, Ogerpon
    description:
      "Paldea is inspired by the Iberian Peninsula (Spain and Portugal) and features a large, open world with three main storylines that players can pursue in any order. The region is known for the Terastal phenomenon, which can change a Pokémon's appearance and type. A prominent feature is the Paldea Academy, where players attend as students, taking classes and going on field trips.",
    imageUrl: "/regions/paldea.jpg",
    mapUrl: "/regions/paldea-map.jpg",
  },
};

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

// Pokemon Card Component
const PokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const primaryType = pokemon.types[0]?.type.name || "normal";

  const getImageUrl = () => {
    if (pokemon.sprites.other["official-artwork"].front_default) {
      return pokemon.sprites.other["official-artwork"].front_default;
    }
    if (pokemon.sprites.other.home?.front_default) {
      return pokemon.sprites.other.home.front_default;
    }
    if (pokemon.sprites.front_default) {
      return pokemon.sprites.front_default;
    }
    // Fallback to a placeholder if no image is available
    return `/api/placeholder/${pokemon.id}`;
  };

  const imageUrl = getImageUrl();

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

// Location Card Component
const LocationCard = ({ location }: { location: string }) => (
  <Card className="bg-slate-900 border-slate-800 hover:bg-slate-800 transition-colors">
    <CardContent className="p-4 flex items-center gap-3">
      <MapPin className="h-5 w-5 text-slate-400" />
      <span>{location}</span>
    </CardContent>
  </Card>
);

// Main Region Page Component
export default function RegionPage() {
  const { name: regionName }: { name: string } = useParams();

  const [regionInfo, setRegionInfo] = useState<Region | null>(null);
  const [regionNotFound, setRegionNotFound] = useState<string>("looking");
  const [starterPokemon, setStarterPokemon] = useState<Pokemon[]>([]);
  const [legendaryPokemon, setLegendaryPokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingPokemon, setLoadingPokemon] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch region data
  useEffect(() => {
    if (regionName && regionData[regionName]) {
      setRegionInfo(regionData[regionName]);
      setRegionNotFound("found");

      // Fetch starter and legendary Pokémon data
      const fetchPokemonData = async () => {
        setLoadingPokemon(true);
        try {
          // Fetch starter Pokémon
          const starterPromises = regionData[regionName].starter_pokemon.map(
            async (id) => {
              const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${id}`
              );
              if (!response.ok) return null;
              return await response.json();
            }
          );

          // Fetch legendary Pokémon
          const legendaryPromises = regionData[
            regionName
          ].legendary_pokemon.map(async (id) => {
            const response = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${id}`
            );
            if (!response.ok) return null;
            return await response.json();
          });

          const starterResults = await Promise.all(starterPromises);
          setStarterPokemon(
            starterResults
              .filter(Boolean)
              .map((pokemon) => {
                // Ensure we're using the official artwork from PokeAPI
                if (
                  pokemon &&
                  pokemon.sprites &&
                  pokemon.sprites.other &&
                  pokemon.sprites.other["official-artwork"]
                ) {
                  return pokemon;
                }
                return null;
              })
              .filter(Boolean) as Pokemon[]
          );
          const legendaryResults = await Promise.all(legendaryPromises);
          setLegendaryPokemon(
            legendaryResults
              .filter(Boolean)
              .map((pokemon) => {
                // Ensure we're using the official artwork from PokeAPI
                if (
                  pokemon &&
                  pokemon.sprites &&
                  pokemon.sprites.other &&
                  pokemon.sprites.other["official-artwork"]
                ) {
                  return pokemon;
                }
                return null;
              })
              .filter(Boolean) as Pokemon[]
          );

          setStarterPokemon(starterResults.filter(Boolean) as Pokemon[]);
          setLegendaryPokemon(legendaryResults.filter(Boolean) as Pokemon[]);
        } catch (error) {
          console.error("Error fetching Pokémon data:", error);
          setRegionNotFound("not-found");
        } finally {
          setLoadingPokemon(false);
        }
      };

      fetchPokemonData();
    }
  }, [regionName]);

  // Filter locations based on search term
  const filteredLocations =
    regionInfo?.locations.filter((location) =>
      location.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // If region not found
  if (!regionInfo && regionNotFound === "not-found") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Region Not Found</h2>
          <p className="mb-6">
            Sorry, we couldn't find data for "{regionName}".
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!regionInfo && regionNotFound === "looking") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  // Choose gradient based on region
  const getRegionGradient = () => {
    const gradientMap: Record<string, string> = {
      kanto: "from-red-600 to-red-800",
      johto: "from-indigo-600 to-indigo-800",
      hoenn: "from-blue-600 to-blue-800",
      sinnoh: "from-cyan-600 to-cyan-800",
      unova: "from-gray-600 to-gray-800",
      kalos: "from-blue-500 to-blue-700",
      alola: "from-orange-500 to-orange-700",
      galar: "from-purple-600 to-purple-800",
      paldea: "from-violet-600 to-violet-800",
    };

    return gradientMap[regionName] || "from-slate-700 to-slate-900";
  };

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
        <section
          className={`py-12 bg-gradient-to-b ${getRegionGradient()} relative overflow-hidden`}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Region map image */}
              <div className="order-2 md:order-1 flex justify-center">
                <div className="relative h-64 w-full md:h-80 md:w-full rounded-lg overflow-hidden border-4 border-white/20">
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getRegionRepresentativePokemonId(
                      regionInfo?.id!
                    )}.png`}
                    alt={`${regionInfo?.name} representative Pokémon`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain bg-black/50"
                    priority
                  />
                </div>
              </div>

              {/* Region info */}
              <div className="order-1 md:order-2 text-center md:text-left">
                <Badge className="mb-2 bg-white/20 text-white">
                  {regionInfo?.generation}
                </Badge>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                  {regionInfo?.name} Region
                </h1>

                <p className="text-xl text-white/90 mb-6 max-w-lg">
                  {regionInfo?.description.split(".")[0] + "."}
                </p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {regionInfo?.mainGames.map((game) => (
                    <Badge key={game} className="bg-slate-700">
                      Pokémon {game}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute right-0 bottom-0 translate-y-1/3 translate-x-1/3 opacity-20">
            <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-[16px] border-white"></div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12 container mx-auto px-4">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start mb-8 bg-slate-800/50 p-1 overflow-x-auto flex-nowrap">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-red-500"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="locations"
                className="data-[state=active]:bg-red-500"
              >
                Locations
              </TabsTrigger>
              <TabsTrigger
                value="starters"
                className="data-[state=active]:bg-red-500"
              >
                Starter Pokémon
              </TabsTrigger>
              <TabsTrigger
                value="legendary"
                className="data-[state=active]:bg-red-500"
              >
                Legendary Pokémon
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Sparkles className="h-6 w-6 mr-2 text-yellow-400" />
                    About {regionInfo?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 leading-relaxed">
                    {regionInfo?.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-white">
                        Featured Games
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {regionInfo?.mainGames.map((game) => (
                          <div
                            key={game}
                            className="bg-slate-800 p-3 rounded flex items-center gap-2"
                          >
                            <PokemonIcon className="h-5 w-5 text-red-500" />
                            <span>{game}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3 text-white">
                        Key Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between p-2 bg-slate-800 rounded">
                          <span className="text-slate-300">Generation:</span>
                          <span className="font-medium">
                            {regionInfo?.generation}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-800 rounded">
                          <span className="text-slate-300">
                            Starter Pokémon:
                          </span>
                          <span className="font-medium">
                            {regionInfo?.starter_pokemon.length}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-800 rounded">
                          <span className="text-slate-300">
                            Legendary Pokémon:
                          </span>
                          <span className="font-medium">
                            {regionInfo?.legendary_pokemon.length}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-800 rounded">
                          <span className="text-slate-300">Key Locations:</span>
                          <span className="font-medium">
                            {regionInfo?.locations.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Star className="h-5 w-5 mr-2 text-yellow-400" />
                      Starter Pokémon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {loadingPokemon
                        ? Array(3)
                            .fill(0)
                            .map((_, i) => <LoadingSkeleton key={i} />)
                        : starterPokemon.map((pokemon) => (
                            <PokemonCard key={pokemon.id} pokemon={pokemon} />
                          ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Award className="h-5 w-5 mr-2 text-purple-400" />
                      Legendary Pokémon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {loadingPokemon
                        ? Array(3)
                            .fill(0)
                            .map((_, i) => <LoadingSkeleton key={i} />)
                        : legendaryPokemon
                            .slice(0, 3)
                            .map((pokemon) => (
                              <PokemonCard key={pokemon.id} pokemon={pokemon} />
                            ))}
                    </div>
                    {legendaryPokemon.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-3"
                        onClick={() => setActiveTab("legendary")}
                      >
                        View all {legendaryPokemon.length} legendary Pokémon
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                      Featured Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {regionInfo?.locations.slice(0, 5).map((location) => (
                        <div
                          key={location}
                          className="p-2 bg-slate-800 rounded text-sm"
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                    {regionInfo?.locations.length! > 5 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-3"
                        onClick={() => setActiveTab("locations")}
                      >
                        View all {regionInfo?.locations.length} locations
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <MapPin className="h-6 w-6 mr-2 text-blue-400" />
                    Locations in {regionInfo?.name}
                  </CardTitle>
                  <CardDescription>
                    Explore the {regionInfo?.locations.length} locations across
                    the {regionInfo?.name} region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="search"
                        placeholder="Search locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <LocationCard key={location} location={location} />
                      ))
                    ) : (
                      <p className="text-center py-8 text-slate-400">
                        No locations found matching "{searchTerm}"
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Starter Pokémon Tab */}
            <TabsContent value="starters" className="space-y-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Star className="h-6 w-6 mr-2 text-yellow-400" />
                    Starter Pokémon
                  </CardTitle>
                  <CardDescription>
                    The beginning Pokémon available to trainers in the{" "}
                    {regionInfo?.name} region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingPokemon ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <LoadingSkeleton key={i} />
                        ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {starterPokemon.map((pokemon) => (
                        <div
                          key={pokemon.id}
                          className="p-4 bg-slate-800 rounded-lg"
                        >
                          <PokemonCard pokemon={pokemon} />
                          <div className="mt-4 space-y-2">
                            <h4 className="font-medium text-center">
                              Evolution Chain
                            </h4>
                            <p className="text-center text-slate-400 text-sm">
                              See the full details on the Pokémon page
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Legendary Pokémon Tab */}
            <TabsContent value="legendary" className="space-y-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Flame className="h-6 w-6 mr-2 text-orange-400" />
                    Legendary Pokémon
                  </CardTitle>
                  <CardDescription>
                    Rare and powerful Pokémon found in the {regionInfo?.name}{" "}
                    region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingPokemon ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {Array(8)
                        .fill(0)
                        .map((_, i) => (
                          <LoadingSkeleton key={i} />
                        ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {legendaryPokemon.map((pokemon) => (
                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                      ))}
                    </div>
                  )}
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
