
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PieChart } from 'lucide-react';
import { generateRandomPieRecipe, PieRecipe } from '@/utils/recipeGenerator';
import RecipeCard from '@/components/RecipeCard';
import SparkleEffect from '@/components/SparkleEffect';
import { toast } from 'sonner';

const Index = () => {
  const [recipe, setRecipe] = useState<PieRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const generateRecipe = () => {
    setIsGenerating(true);
    setSparkle(true);
    
    // Trigger sparkle effect
    setTimeout(() => {
      setSparkle(false);
    }, 1000);
    
    // Add a slight delay for magical effect
    setTimeout(() => {
      const newRecipe = generateRandomPieRecipe();
      setRecipe(newRecipe);
      setIsGenerating(false);
      toast.success(`Created "${newRecipe.title}"!`, {
        description: "Your magical pie recipe is ready.",
        position: "bottom-center",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-wizard text-wizard-foreground flex flex-col">
      <SparkleEffect trigger={sparkle} targetRef={buttonRef} />
      
      <header className="py-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
          <span className="magic-gradient">Magical Pie Recipe Generator</span>
        </h1>
        <p className="text-center text-wizard-foreground/75 max-w-xl mx-auto">
          Click the button below to conjure a completely random pie recipe, crafted with mystical ingredients and enchanted instructions.
        </p>
      </header>
      
      <main className="flex-1 container mx-auto px-4 pb-16 flex flex-col">
        <div className="flex justify-center mb-8">
          <Button
            ref={buttonRef}
            onClick={generateRecipe}
            disabled={isGenerating}
            size="lg"
            className="bg-wizard-accent hover:bg-wizard-accent-hover text-white font-medium text-lg px-6 py-6 h-auto transition-all duration-300 hover:shadow-lg hover:shadow-wizard-accent/30 relative overflow-hidden group"
          >
            <PieChart className="mr-2 h-5 w-5 animate-float" />
            <span>Generate Pie Recipe</span>
            <div className="absolute inset-0 bg-gradient-to-r from-wizard-accent to-wizard-accent-hover opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </Button>
        </div>
        
        <div className="flex-1 w-full max-w-4xl mx-auto">
          <RecipeCard recipe={recipe} className="min-h-[400px]" />
        </div>
      </main>
      
      <footer className="py-4 text-center text-wizard-foreground/50 text-sm">
        <p>Crafted with magical ingredients and a hint of whimsy</p>
      </footer>
    </div>
  );
};

export default Index;
