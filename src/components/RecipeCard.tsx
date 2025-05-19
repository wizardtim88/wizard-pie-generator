
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PieRecipe } from '@/utils/recipeGenerator';
import { PieChart, CakeSlice, Utensils, Sparkles, Download } from 'lucide-react';
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
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-wizard-foreground/50 italic">Your magical pie recipe will appear here...</p>
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
      toast.loading("Crafting your magical PDF...");
      generatePDF(recipe);
      toast.success("PDF successfully created!", {
        description: "Your enchanted recipe has been saved to your device."
      });
    } catch (error) {
      toast.error("Magical mishap!", {
        description: "Something went wrong while creating your PDF."
      });
      console.error("PDF generation error:", error);
    }
  };

  return (
    <Card className={`bg-wizard-muted/20 border-wizard-muted/30 overflow-hidden animate-fade-in ${className}`}>
      <CardHeader className="bg-gradient-to-r from-wizard-accent/30 to-transparent">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <PieChart className="h-6 w-6 text-wizard-accent" />
            <CardTitle className="text-xl font-semibold">{recipe.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-wizard-accent/50 text-wizard-accent flex items-center gap-1.5">
              <TypeIcon className="h-3.5 w-3.5" />
              {recipe.type === "sweet" ? "Sweet" : "Savory"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadPDF} 
              className="border-wizard-accent/50 text-wizard-accent hover:bg-wizard-accent/10"
            >
              <Download className="h-3.5 w-3.5 mr-1" /> PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium mb-2 magic-gradient">Ingredients</h3>
            
            <h4 className="font-medium text-wizard-foreground/90 mt-4 mb-2">For the Crust:</h4>
            <ul className="list-disc pl-5 space-y-1 text-wizard-foreground/80">
              {recipe.ingredients.crust.map((item, index) => (
                <li key={`crust-${index}`}>{item}</li>
              ))}
            </ul>
            
            <h4 className="font-medium text-wizard-foreground/90 mt-4 mb-2">For the Filling:</h4>
            <ul className="list-disc pl-5 space-y-1 text-wizard-foreground/80">
              {recipe.ingredients.filling.map((item, index) => (
                <li key={`filling-${index}`}>{item}</li>
              ))}
            </ul>
            
            {recipe.ingredients.topping && (
              <>
                <h4 className="font-medium text-wizard-foreground/90 mt-4 mb-2">For the Topping:</h4>
                <ul className="list-disc pl-5 space-y-1 text-wizard-foreground/80">
                  {recipe.ingredients.topping.map((item, index) => (
                    <li key={`topping-${index}`}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          
          <div>
            <div className="bg-wizard-muted/30 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-medium mb-2 magic-gradient">Baking Details</h3>
              <div className="space-y-2 text-wizard-foreground/80">
                <p><span className="font-medium text-wizard-foreground/90">Temperature:</span> {recipe.bakingTemp}</p>
                <p><span className="font-medium text-wizard-foreground/90">Time:</span> {recipe.bakingTime}</p>
                <p><span className="font-medium text-wizard-foreground/90">Servings:</span> {recipe.servings}</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6 bg-wizard-muted/40" />
        
        <div>
          <h3 className="text-lg font-medium mb-4 magic-gradient">Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2 text-wizard-foreground/80">
            {recipe.instructions.map((instruction, index) => (
              <li key={`instruction-${index}`} className="pl-1">{instruction}</li>
            ))}
          </ol>
        </div>

        {hasMagicalIngredients && (
          <>
            <Separator className="my-6 bg-wizard-muted/40" />
            <div className="bg-wizard-accent/10 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2 magic-gradient">
                <Sparkles className="h-5 w-5 text-wizard-accent" />
                Real World Substitutions
              </h3>
              <p className="mb-3 text-wizard-foreground/80">
                To make this pie in the non-magical world, use these substitutions:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-wizard-foreground/80">
                {mentionedMagicalIngredients.map((magicalIngredient, index) => (
                  <li key={`sub-${index}`}>
                    <span className="font-medium text-wizard-accent/90">{magicalIngredient}</span> → {magicalIngredients.get(magicalIngredient) || "regular equivalent"}
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
