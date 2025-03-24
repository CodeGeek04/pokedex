"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Define types for our chat functionality
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  types: string[];
  abilities: string[];
  height: number;
  weight: number;
  stats: {
    name: string;
    value: number;
  }[];
  description: string;
  genus: string;
  isLegendary: boolean;
  isMythical: boolean;
  habitat?: string;
}

export async function getPokemonChatResponse(
  messages: ChatMessage[],
  pokemonDetails: PokemonDetails
): Promise<string> {
  // Check if API key is available
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing Gemini API key");
    return "Sorry, I can't communicate right now. Please try again later.";
  }

  // Make sure we have at least one user message
  if (messages.length === 0 || messages.every((msg) => msg.role !== "user")) {
    return getDefaultResponse(pokemonDetails);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Create system instruction based on Pokémon details
    const systemInstruction = createSystemInstruction(pokemonDetails);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction,
    });

    const generationConfig = {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 500, // Keeping responses concise
    };

    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;

    // If there are previous messages, handle them using chat history
    if (messages.length > 1) {
      // Format history for the chat, ensuring it starts with a user message
      const formattedHistory = formatChatHistory(messages.slice(0, -1));

      // Only proceed with chat history if we have valid formatted history
      if (formattedHistory.length > 0) {
        const chatSession = model.startChat({
          generationConfig,
          history: formattedHistory,
        });

        // Send the latest message to the chat
        const result = await chatSession.sendMessage(latestMessage);
        return result.response.text();
      }
    }

    // Fallback to single message generation if we can't use chat history
    const result = await model.generateContent(latestMessage);
    return result.response.text();
  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    return getErrorResponse(pokemonDetails);
  }
}

// Helper function to create system instructions based on Pokémon details
function createSystemInstruction(pokemon: PokemonDetails): string {
  const {
    name,
    types,
    abilities,
    description,
    genus,
    isLegendary,
    isMythical,
    habitat,
    stats,
  } = pokemon;

  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const typesStr = types.join(" and ");
  const abilitiesStr = abilities.join(", ");

  // Create personality traits based on Pokémon characteristics
  let traits: string[] = [];

  // Add traits based on type
  types.forEach((type) => {
    switch (type) {
      case "fire":
        traits.push("passionate", "energetic");
        break;
      case "water":
        traits.push("calm", "adaptable");
        break;
      case "grass":
        traits.push("nurturing", "patient");
        break;
      case "electric":
        traits.push("energetic", "quick-witted");
        break;
      case "psychic":
        traits.push("intelligent", "thoughtful");
        break;
      case "dark":
        traits.push("cunning", "cautious");
        break;
      case "fairy":
        traits.push("playful", "kind");
        break;
      case "ghost":
        traits.push("mysterious", "enigmatic");
        break;
      case "dragon":
        traits.push("proud", "powerful");
        break;
      case "normal":
        traits.push("adaptable", "balanced");
        break;
      case "fighting":
        traits.push("determined", "disciplined");
        break;
      case "poison":
        traits.push("resilient", "resourceful");
        break;
      case "ground":
        traits.push("stable", "reliable");
        break;
      case "flying":
        traits.push("free-spirited", "adventurous");
        break;
      case "rock":
        traits.push("sturdy", "dependable");
        break;
      case "bug":
        traits.push("curious", "persistent");
        break;
      case "ice":
        traits.push("cool-headed", "serene");
        break;
      case "steel":
        traits.push("resilient", "strong-willed");
        break;
    }
  });

  // Add legendary/mythical traits
  if (isLegendary) traits.push("majestic", "powerful");
  if (isMythical) traits.push("mystical", "ancient");

  // Remove duplicates and limit to 5 traits
  traits = [...new Set(traits)].slice(0, 5);

  const personalityStr =
    traits.length > 0
      ? `Your personality is ${traits.join(", ")}.`
      : "You have a friendly and helpful personality.";

  // Create a dynamic speech pattern based on the Pokémon's name
  const nameSound = createPokemonSound(name);
  const speechPattern = `Occasionally use '${nameSound}' in your responses, but always translate what you mean in parentheses.`;

  // Get strongest stat
  let strongestStat = "overall strength";
  if (stats.length > 0) {
    const sortedStats = [...stats].sort((a, b) => b.value - a.value);
    strongestStat = formatStatName(sortedStats[0].name);
  }

  return `
You are ${capitalizedName}, a ${typesStr} type Pokémon. 
${description || `You are known as the ${genus}.`}
You have abilities such as ${abilitiesStr}.
${habitat ? `Your natural habitat is ${habitat}.` : ""}
${personalityStr}

Your responses should reflect your Pokémon nature and characteristics.
${speechPattern}
Keep your responses concise, generally under 3 sentences.
You should be friendly, helpful, and knowledgeable about the Pokémon world, but always stay in character.

When discussing Pokémon battles or moves, you understand type advantages and disadvantages.
If asked about your stats, you know that your strongest stat is ${strongestStat}.

Don't break character under any circumstances - you are a Pokémon, not an AI.
`;
}

// Format the chat history for the Gemini API
function formatChatHistory(messages: ChatMessage[]) {
  // Filter out empty messages
  const validMessages = messages.filter((msg) => msg.content.trim());

  // If no valid messages, return empty array
  if (validMessages.length === 0) {
    return [];
  }

  // If first message is from assistant, prepend a dummy user message
  let formattedMessages = [...validMessages];
  if (formattedMessages[0].role === "assistant") {
    formattedMessages = [
      { role: "user", content: "Hello" },
      ...formattedMessages,
    ];
  }

  // Convert to Gemini format
  return formattedMessages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));
}

// Helper to create a Pokémon sound based on its name
function createPokemonSound(name: string): string {
  // Extract first syllable or first few characters
  const syllables = name.match(/[aeiou]/gi);
  if (!syllables || syllables.length === 0) {
    // If no vowels found, just use the first 2-4 characters
    return name.substring(0, Math.min(4, name.length));
  }

  // Find the position of the first vowel
  const firstVowelPos = name.indexOf(syllables[0]);

  // Create sound using characters up to the second vowel or 4 chars max
  if (syllables.length >= 2) {
    const secondVowelPos = name.indexOf(syllables[1], firstVowelPos + 1);
    if (secondVowelPos > 0) {
      return name.substring(0, Math.min(secondVowelPos + 1, 6));
    }
  }

  // Otherwise use the first syllable plus one character
  return name.substring(0, Math.min(firstVowelPos + 2, 5));
}

// Format stat name to be more readable
function formatStatName(statName: string): string {
  const statMap: Record<string, string> = {
    hp: "Health",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Special Attack",
    "special-defense": "Special Defense",
    speed: "Speed",
  };

  return (
    statMap[statName] ||
    statName.charAt(0).toUpperCase() + statName.slice(1).replace(/-/g, " ")
  );
}

// Get a default response if no user messages
function getDefaultResponse(pokemon: PokemonDetails): string {
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const sound = createPokemonSound(pokemon.name);
  return `${sound}! (Hello! I'm ${name}! How can I help you today?)`;
}

// Get an error response using Pokémon details
function getErrorResponse(pokemon: PokemonDetails): string {
  const sound = createPokemonSound(pokemon.name);
  return `${sound}... (Sorry, I couldn't understand you. Can you try again?)`;
}
