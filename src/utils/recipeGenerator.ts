// Recipe types and generator functions

export interface PieRecipe {
  id: string;
  title: string;
  type: "sweet" | "savory";
  ingredients: {
    crust: string[];
    filling: string[];
    topping?: string[];
  };
  instructions: string[];
  bakingTime: string;
  bakingTemp: string;
  servings: number;
}

// Arrays of possible pie components
const sweetPieTypes = [
  "Apple", "Cherry", "Blueberry", "Pumpkin", "Pecan", "Strawberry", 
  "Lemon Meringue", "Key Lime", "Chocolate", "Banana Cream", "Coconut Cream",
  "Dragon Fruit", "Enchanted Berry", "Magical Mincemeat", "Mystical Maple", 
  "Fairy's Favorite", "Unicorn Dream", "Phoenix Fire", "Mermaid's Pearl"
];

const savoryPieTypes = [
  "Shepherd's", "Chicken Pot", "Stargazy", "Moon", "Wizard's",
  "Dragon's Lair", "Forest Mushroom", "Goblin's Gold", "Knight's Feast",
  "Hearty Vegetable", "Rustic Potato", "Enchanted Spinach", "Mystical Meat",
  "Seafarer's Delight", "Huntsman's", "Wizard's Stew", "Woodcutter's"
];

const crusts = [
  "All-Butter Pie Crust", "Graham Cracker Crust", "Chocolate Cookie Crust", 
  "Oatmeal Crust", "Shortbread Crust", "Flaky Phyllo Crust", "Gingerbread Crust",
  "Enchanted Walnut Crust", "Spellbound Pecan Crust", "Fairy Dust Crumb Crust",
  "Moonstone Crust", "Stardust Cookie Crust", "Dragon Scale Crust",
  "Whispered Wish Almond Crust", "Midnight Shadow Crust"
];

const sweetFillings = [
  "fresh apples", "cherries", "blueberries", "strawberries", "peaches", 
  "blackberries", "raspberries", "mangoes", "dragon fruit", "star fruit"
];

const savoryFillings = [
  "tender chicken", "seasoned beef", "wild mushrooms", "roasted vegetables",
  "spinach and feta", "potato and leek", "smoked fish", "spiced lentils",
  "caramelized onions", "butternut squash", "dragon's breath peppers"
];

const creamFillings = [
  "vanilla custard", "chocolate ganache", "butterscotch pudding", "lemon curd", 
  "caramel custard", "peanut butter filling", "marshmallow cream", "moonshadow cream",
  "whispering cloud custard", "enchanted vanilla bean"
];

const spices = [
  "cinnamon", "nutmeg", "ginger", "cardamom", "allspice", "cloves", 
  "vanilla beans", "dragon's breath peppers", "fairy dust", "star anise",
  "wizardroot", "thunder salt", "moonlight extract", "phoenix feather powder"
];

const specialIngredients = [
  "moonbeam sugar", "starlight zest", "powdered dragon scales", "crystalized honey", 
  "enchanted maple syrup", "unicorn milk", "mermaid tears", "phoenix ash", 
  "fairy nectar", "wizard's brew", "goblin gold flakes", "levitation powder",
  "time-turning sugar", "whispering wind salt", "magical moonstone dust"
];

const toppings = [
  "whipped cream", "meringue", "streusel", "chopped nuts", "caramel drizzle", 
  "chocolate shavings", "powdered sugar", "glittering stardust", "golden sparkles",
  "enchanted berries", "crystallized flower petals", "spun sugar webs",
  "shimmering pearl dust", "levitating marshmallows", "color-changing sprinkles"
];

const savorySpices = [
  "thyme", "rosemary", "sage", "black pepper", "garlic powder",
  "onion powder", "paprika", "cumin", "dragon's breath", "wizard's herb blend",
  "enchanted bay leaves", "mystic oregano", "shadow salt"
];

const savorySpecialIngredients = [
  "wizard's broth", "dragon scale salt", "moonlit herbs", "forest mushroom powder",
  "enchanted garlic", "thunderstruck pepper", "mystical thyme", "fae rosemary",
  "goblin's favorite spice blend", "crystallized vegetable stock"
];

// Generate a random number between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Pick a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Pick multiple random items from an array
const getRandomItems = <T>(array: T[], min: number, max: number): T[] => {
  const count = getRandomInt(min, max);
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generate a random pie title based on pie type
const generatePieTitle = (pieType: "sweet" | "savory"): string => {
  const typeArray = pieType === "sweet" ? sweetPieTypes : savoryPieTypes;
  const type = getRandomItem(typeArray);
  const prefixes = ["Magical", "Enchanted", "Wizard's", "Mystical", "Spellbound", "Secret", "Ancient", "Celestial", ""];
  const suffixes = ["Delight", "Wonder", "Surprise", "Dream", "Spell", "Creation", "Pie", "Charm", "Treasure", ""];
  
  // 50% chance to use a prefix
  const prefix = Math.random() > 0.5 ? `${getRandomItem(prefixes)} ` : "";
  // 50% chance to use a suffix
  const suffix = Math.random() > 0.5 && prefix === "" ? ` ${getRandomItem(suffixes)}` : "";
  
  return `${prefix}${type}${suffix}`;
};

// Generate random baking time
const generateBakingTime = (): string => {
  const minTime = getRandomInt(30, 60);
  const maxTime = minTime + getRandomInt(5, 15);
  return `${minTime} - ${maxTime} minutes`;
};

// Generate random baking temperature
const generateBakingTemp = (): string => {
  const temps = [350, 375, 400, 425];
  const temp = getRandomItem(temps);
  return `${temp}°F`;
};

// Generate random servings
const generateServings = (): number => {
  return getRandomInt(6, 12);
};

// Generate random pie crust ingredients
const generateCrustIngredients = (pieType: "sweet" | "savory"): string[] => {
  const ingredients = [
    `2 cups flour`,
    `1 teaspoon salt`,
    `${getRandomInt(6, 10)} tablespoons cold ${getRandomItem(["butter", "magical butter", "fairy butter", "unicorn butter"])}, cubed`,
    `${getRandomInt(4, 6)} tablespoons ice ${getRandomItem(["water", "milk", "cream", "unicorn milk"])}`
  ];
  
  // Add random special ingredient
  if (Math.random() > 0.7) {
    ingredients.push(`1 pinch of ${getRandomItem(pieType === "sweet" ? specialIngredients : savorySpecialIngredients)}`);
  }

  // Add special savory crust ingredients
  if (pieType === "savory" && Math.random() > 0.5) {
    ingredients.push(`${getRandomInt(1, 3)} teaspoons ${getRandomItem(savorySpices)}`);
  }
  
  return ingredients;
};

// Generate random filling ingredients based on pie type
const generateFillingIngredients = (pieType: "sweet" | "savory"): string[] => {
  const ingredients: string[] = [];
  
  if (pieType === "sweet") {
    // Decide if fruit or cream based
    const isFruitBased = Math.random() > 0.4;
    
    if (isFruitBased) {
      // Fruit based
      const mainFruit = getRandomItem(sweetFillings);
      const fruitAmount = getRandomInt(3, 6);
      ingredients.push(`${fruitAmount} cups ${mainFruit}, ${getRandomItem(["sliced", "diced", "chopped", "whole"])}`);
      ingredients.push(`${getRandomInt(3, 8) / 4} cup ${getRandomItem(["sugar", "brown sugar", "maple sugar", "honey", "moonbeam sugar"])}`);
      
      // Add spices
      const pieSpices = getRandomItems(spices, 1, 3);
      pieSpices.forEach(spice => {
        ingredients.push(`${getRandomInt(1, 2)} teaspoon${getRandomInt(1, 2) === 1 ? "" : "s"} ${spice}`);
      });
      
      // Add thickener
      ingredients.push(`${getRandomInt(2, 4)} tablespoons ${getRandomItem(["cornstarch", "flour", "tapioca starch", "arrowroot", "magical thickener"])}`);
    } else {
      // Cream based
      const baseCream = getRandomItem(creamFillings);
      ingredients.push(`2 cups ${baseCream}`);
      ingredients.push(`${getRandomInt(2, 4)} large ${getRandomItem(["eggs", "dragon eggs", "phoenix eggs", "fairy eggs"])}`);
      ingredients.push(`1 cup ${getRandomItem(["heavy cream", "milk", "half-and-half", "unicorn milk", "fairy cream"])}`);
      ingredients.push(`${getRandomInt(1, 2)} teaspoon${getRandomInt(1, 2) === 1 ? "" : "s"} vanilla extract`);
      
      // Maybe add a special ingredient
      if (Math.random() > 0.5) {
        ingredients.push(`2 tablespoons ${getRandomItem(specialIngredients)}`);
      }
    }
  } else {
    // Savory pie
    const mainFilling = getRandomItem(savoryFillings);
    ingredients.push(`${getRandomInt(2, 4)} cups ${mainFilling}, ${getRandomItem(["diced", "chopped", "sliced", "cubed"])}`);
    ingredients.push(`${getRandomInt(1, 3)} ${getRandomItem(["onions", "magical onions", "shallots", "leeks"])}, finely chopped`);
    ingredients.push(`${getRandomInt(1, 3)} tablespoons ${getRandomItem(["butter", "olive oil", "enchanted oil", "magical fat"])}`);
    
    // Add spices
    const savoryPieSpices = getRandomItems(savorySpices, 1, 3);
    savoryPieSpices.forEach(spice => {
      ingredients.push(`${getRandomInt(1, 2)} teaspoon${getRandomInt(1, 2) === 1 ? "" : "s"} ${spice}`);
    });
    
    // Add thickener
    ingredients.push(`${getRandomInt(2, 3)} tablespoons ${getRandomItem(["flour", "magical thickener", "cornstarch"])}`);
    ingredients.push(`${getRandomInt(1, 2)} cup${getRandomInt(1, 2) === 1 ? "" : "s"} ${getRandomItem(["broth", "stock", "wizard's broth", "magical stock"])}`);
  }
  
  return ingredients;
};

// Generate random topping ingredients
const generateToppingIngredients = (pieType: "sweet" | "savory"): string[] => {
  // 30% chance of no topping
  if (Math.random() < 0.3) {
    return [];
  }
  
  const ingredients: string[] = [];
  
  if (pieType === "sweet") {
    const mainTopping = getRandomItem(toppings);
    ingredients.push(`1 cup ${mainTopping}`);
    
    // 40% chance of a second topping
    if (Math.random() < 0.4) {
      const secondTopping = getRandomItem(toppings.filter(t => t !== mainTopping));
      ingredients.push(`${getRandomInt(2, 4)} tablespoons ${secondTopping}`);
    }
  } else {
    // Savory toppings
    const savoryToppings = [
      "grated cheese", "breadcrumbs", "herb butter", "crispy onions", 
      "crushed nuts", "golden pastry stars", "wizard's cheese blend", 
      "enchanted herb mixture", "mystical seeds"
    ];
    
    const mainTopping = getRandomItem(savoryToppings);
    ingredients.push(`${getRandomInt(1, 2)} cup${getRandomInt(1, 2) === 1 ? "" : "s"} ${mainTopping}`);
    
    // 30% chance of a second topping
    if (Math.random() < 0.3) {
      const secondTopping = getRandomItem(savoryToppings.filter(t => t !== mainTopping));
      ingredients.push(`${getRandomInt(2, 4)} tablespoons ${secondTopping}`);
    }
  }
  
  return ingredients;
};

// Generate random instructions based on pie type
const generateInstructions = (pieType: "sweet" | "savory", hasTopping: boolean): string[] => {
  const instructions = [
    "Preheat your oven with a wave of your wand (or just turn the knob).",
    `Prepare the crust by mixing dry ingredients, then incorporate the cold butter until the mixture resembles coarse crumbs. Add liquid gradually until the dough forms. Chill for 30 minutes.`,
    "Roll out the dough and transfer to a pie dish. Perform a silent incantation (optional) for extra flakiness.",
  ];

  if (pieType === "sweet") {
    instructions.push("Mix the filling ingredients in a cauldron (or regular bowl) until well combined.");
    instructions.push("Pour the filling into the prepared crust, ensuring even distribution of the magical energies (and ingredients).");
  } else {
    instructions.push("Sauté the main filling ingredients until they release their magical aromas (about 5-7 minutes).");
    instructions.push("Add spices and cook for another minute to awaken their mystical properties.");
    instructions.push("Pour in the liquid ingredients and simmer until slightly thickened.");
    instructions.push("Allow the mixture to cool slightly before transferring to the prepared crust.");
  }

  if (hasTopping) {
    instructions.push("Prepare the topping according to the ancient scrolls (or just follow common sense).");
    instructions.push("Add the topping to the pie, creating mystical patterns for enhanced flavor transmission.");
  }

  instructions.push("Bake in the preheated oven until the crust is golden and the filling has set.");
  instructions.push("Allow to cool while contemplating the universe (or just for about an hour).");
  instructions.push("Slice with an enchanted blade (or regular knife) and serve to grateful recipients.");

  return instructions;
};

// Generate a random pie recipe with specified type
export const generateRandomPieRecipe = (pieType: "sweet" | "savory" = "sweet"): PieRecipe => {
  const title = generatePieTitle(pieType);
  const crust = generateCrustIngredients(pieType);
  const filling = generateFillingIngredients(pieType);
  const topping = generateToppingIngredients(pieType);
  const instructions = generateInstructions(pieType, topping.length > 0);
  
  return {
    id: generateId(),
    title,
    type: pieType,
    ingredients: {
      crust,
      filling,
      topping: topping.length > 0 ? topping : undefined
    },
    instructions,
    bakingTime: generateBakingTime(),
    bakingTemp: generateBakingTemp(),
    servings: generateServings()
  };
};
