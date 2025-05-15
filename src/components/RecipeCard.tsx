
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PieRecipe } from '@/utils/recipeGenerator';
import { PieChart, CakeSlice, Utensils } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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

  return (
    <Card className={`bg-wizard-muted/20 border-wizard-muted/30 overflow-hidden animate-fade-in ${className}`}>
      <CardHeader className="bg-gradient-to-r from-wizard-accent/30 to-transparent">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <PieChart className="h-6 w-6 text-wizard-accent" />
            <CardTitle className="text-xl font-semibold">{recipe.title}</CardTitle>
          </div>
          <Badge variant="outline" className="border-wizard-accent/50 text-wizard-accent flex items-center gap-1.5">
            <TypeIcon className="h-3.5 w-3.5" />
            {recipe.type === "sweet" ? "Sweet" : "Savory"}
          </Badge>
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
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
