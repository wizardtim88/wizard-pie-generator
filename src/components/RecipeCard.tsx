
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PieRecipe } from '@/utils/recipeGenerator';
import { PieChart, CakeSlice, Utensils, Sparkles, Download, Book, Wand2, Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/utils/pdfGenerator";
import { toast } from 'sonner';

interface RecipeCardProps {
  recipe: PieRecipe | null;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className }) => {
  if (!recipe) {
    return (
      <Card className={`h-full w-full bg-wizard-muted/20 border-wizard-muted/30 ${className}`}>
        <CardContent className="flex flex-col items-center justify-center h-full p-8">
          <div className="text-wizard-accent-tertiary mb-4">
            <PieChart className="h-12 w-12 animate-pulse-glow" />
          </div>
          <p className="text-wizard-foreground/50 italic font-retro text-xl">YOUR MAGICAL PIE RECIPE WILL APPEAR HERE...</p>
          <div className="mt-4 flex gap-2 text-wizard-accent-secondary">
            <span className="animate-pulse">•</span>
            <span className="animate-pulse delay-100">•</span>
            <span className="animate-pulse delay-200">•</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const TypeIcon = recipe.type === "sweet" ? CakeSlice : Utensils;
  
  // Extract magical ingredients and create substitution mapping
  const magicalIngredients = new Map([
    ["moonbeam sugar", "granulated sugar"],
    ["starlight zest", "lemon or orange zest"],
    ["powdered dragon scales", "cinnamon or chili powder"],
    ["crystalized honey", "honey"],
    ["enchanted maple syrup", "maple syrup"],
    ["unicorn milk", "whole milk or heavy cream"],
    ["mermaid tears", "lemon juice or rosewater"],
    ["phoenix ash", "smoked paprika"],
    ["fairy nectar", "honey or agave syrup"],
    ["wizard's brew", "strong tea or coffee"],
    ["goblin gold flakes", "edible gold leaf or yellow sprinkles"],
    ["levitation powder", "baking powder"],
    ["time-turning sugar", "brown sugar"],
    ["whispering wind salt", "sea salt"],
    ["magical moonstone dust", "vanilla sugar"],
    ["dragon's breath peppers", "chili peppers or cayenne"],
    ["fairy dust", "powdered sugar or cinnamon sugar"],
    ["wizard's broth", "vegetable or chicken broth"],
    ["dragon scale salt", "smoked salt"],
    ["moonlit herbs", "fresh herbs"],
    ["forest mushroom powder", "dried mushroom powder"],
    ["enchanted garlic", "roasted garlic"],
    ["thunderstruck pepper", "black pepper"],
    ["mystical thyme", "thyme"],
    ["fae rosemary", "rosemary"],
    ["goblin's favorite spice blend", "mixed herbs and spices"],
    ["crystallized vegetable stock", "vegetable bouillon"],
    ["magical butter", "butter"],
    ["fairy butter", "cultured butter"],
    ["unicorn butter", "European-style butter"],
    ["magical thickener", "cornstarch or flour"],
    ["magical fat", "butter or oil"],
    ["enchanted oil", "olive oil"],
    ["wizard's cheese blend", "mixed grated cheeses"],
    ["magical onions", "caramelized onions"],
    ["dragon eggs", "large eggs"],
    ["phoenix eggs", "duck eggs"],
    ["fairy eggs", "quail eggs"],
    ["magical stock", "homemade stock"],
    ["enchanted berries", "mixed berries"],
    ["fairy cream", "whipped cream"],
    ["wizard's herb blend", "Italian herb blend"]
  ]);

  // Collect all ingredients
  const allIngredients: string[] = [
    ...recipe.ingredients.crust,
    ...recipe.ingredients.filling,
    ...(recipe.ingredients.topping || [])
  ];

  // Find magical ingredients mentioned in the recipe
  const mentionedMagicalIngredients = Array.from(magicalIngredients.keys())
    .filter(magicalIngredient => 
      allIngredients.some(ingredient => 
        ingredient.toLowerCase().includes(magicalIngredient.toLowerCase())
      )
    );

  const hasMagicalIngredients = mentionedMagicalIngredients.length > 0;
  
  const handleDownloadPDF = () => {
    try {
      toast.loading("Crafting your magical PDF...", {
        className: "font-retro text-lg"
      });
      generatePDF(recipe);
      toast.success("PDF successfully created!", {
        description: "Your enchanted recipe has been saved to your device.",
        className: "font-retro text-lg"
      });
    } catch (error) {
      toast.error("Magical mishap!", {
        description: "Something went wrong while creating your PDF.",
        className: "font-retro text-lg"
      });
      console.error("PDF generation error:", error);
    }
  };

  return (
    <Card className={`bg-wizard-muted/20 border-wizard-muted/30 overflow-hidden animate-fade-in ${className}`}>
      <CardHeader className="bg-gradient-to-r from-wizard-accent-secondary/30 to-transparent">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-wizard-accent-secondary p-1.5 rounded">
              <PieChart className="h-6 w-6 text-wizard" />
            </div>
            <CardTitle className="text-xl font-pixel text-wizard-accent-secondary">{recipe.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-wizard-accent/50 bg-wizard-muted/30 text-wizard-accent flex items-center gap-1.5 font-retro">
              <TypeIcon className="h-3.5 w-3.5" />
              {recipe.type === "sweet" ? "SWEET" : "SAVORY"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadPDF} 
              className="border-wizard-accent-tertiary/50 text-wizard-accent-tertiary hover:bg-wizard-accent-tertiary/10 font-retro"
              aria-label="Download Recipe as PDF"
            >
              <Download className="h-3.5 w-3.5 mr-1" /> PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-pixel mb-2 flex items-center gap-2 text-wizard-accent">
              <Book className="h-5 w-5" />
              INGREDIENTS
            </h3>
            
            <h4 className="font-retro text-wizard-foreground/90 mt-4 mb-2 flex items-center text-lg">
              <span className="text-wizard-accent-tertiary mr-2">▶</span>FOR THE CRUST:
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-wizard-foreground/80 font-retro text-lg">
              {recipe.ingredients.crust.map((item, index) => (
                <li key={`crust-${index}`} className="transition-colors duration-300 hover:text-wizard-accent">{item}</li>
              ))}
            </ul>
            
            <h4 className="font-retro text-wizard-foreground/90 mt-4 mb-2 flex items-center text-lg">
              <span className="text-wizard-accent-tertiary mr-2">▶</span>FOR THE FILLING:
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-wizard-foreground/80 font-retro text-lg">
              {recipe.ingredients.filling.map((item, index) => (
                <li key={`filling-${index}`} className="transition-colors duration-300 hover:text-wizard-accent">{item}</li>
              ))}
            </ul>
            
            {recipe.ingredients.topping && (
              <>
                <h4 className="font-retro text-wizard-foreground/90 mt-4 mb-2 flex items-center text-lg">
                  <span className="text-wizard-accent-tertiary mr-2">▶</span>FOR THE TOPPING:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-wizard-foreground/80 font-retro text-lg">
                  {recipe.ingredients.topping.map((item, index) => (
                    <li key={`topping-${index}`} className="transition-colors duration-300 hover:text-wizard-accent">{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          
          <div>
            <div className="bg-wizard-muted/30 p-4 rounded-lg mb-4 border border-wizard-accent/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-wizard-accent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-wizard-accent"></div>
              
              <h3 className="text-lg font-pixel mb-2 text-wizard-accent flex items-center gap-2">
                <Star className="h-5 w-5" /> 
                BAKING DETAILS
              </h3>
              <div className="space-y-2 text-wizard-foreground/80 font-retro text-lg">
                <p><span className="font-medium text-wizard-accent-tertiary">TEMPERATURE:</span> {recipe.bakingTemp}</p>
                <p><span className="font-medium text-wizard-accent-tertiary">TIME:</span> {recipe.bakingTime}</p>
                <p><span className="font-medium text-wizard-accent-tertiary">SERVINGS:</span> {recipe.servings}</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6 bg-wizard-accent/20" />
        
        <div>
          <h3 className="text-lg font-pixel mb-4 text-wizard-accent flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            MAGICAL INSTRUCTIONS
          </h3>
          <ol className="list-decimal pl-5 space-y-2 text-wizard-foreground/80 font-retro text-lg">
            {recipe.instructions.map((instruction, index) => (
              <li key={`instruction-${index}`} className="pl-1 transition-colors duration-300 hover:text-wizard-foreground/100">{instruction}</li>
            ))}
          </ol>
        </div>

        {hasMagicalIngredients && (
          <>
            <Separator className="my-6 bg-wizard-accent/20" />
            <div className="bg-wizard-accent-secondary/10 p-4 rounded-lg border-2 border-wizard-accent-secondary/30">
              <h3 className="text-lg font-pixel mb-3 flex items-center gap-2 text-wizard-accent-secondary">
                <Sparkles className="h-5 w-5" />
                REAL WORLD SUBSTITUTIONS
              </h3>
              <p className="mb-3 text-wizard-foreground/80 font-retro text-lg">
                To make this pie in the non-magical world, use these substitutions:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-wizard-foreground/80 font-retro text-lg grid grid-cols-1 md:grid-cols-2 gap-x-4">
                {mentionedMagicalIngredients.map((magicalIngredient, index) => (
                  <li key={`sub-${index}`} className="transition-colors duration-300 hover:text-wizard-accent-secondary">
                    <span className="font-medium text-wizard-accent-secondary">{magicalIngredient}</span> → {magicalIngredients.get(magicalIngredient) || "regular equivalent"}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
