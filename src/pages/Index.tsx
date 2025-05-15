
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PieChart, Download, CakeSlice, Utensils } from 'lucide-react';
import { generateRandomPieRecipe, PieRecipe } from '@/utils/recipeGenerator';
import RecipeCard from '@/components/RecipeCard';
import SparkleEffect from '@/components/SparkleEffect';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generatePDF } from '@/utils/pdfGenerator';

const Index = () => {
  const [recipe, setRecipe] = useState<PieRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [pieType, setPieType] = useState<"sweet" | "savory">("sweet");
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
      const newRecipe = generateRandomPieRecipe(pieType);
      setRecipe(newRecipe);
      setIsGenerating(false);
      toast.success(`Created "${newRecipe.title}"!`, {
        description: `Your magical ${pieType} pie recipe is ready.`,
        position: "bottom-center",
      });
    }, 800);
  };
  
  const handleDownloadPDF = () => {
    if (!recipe) {
      toast.error("No recipe to download", {
        description: "Please generate a recipe first.",
        position: "bottom-center",
      });
      return;
    }
    
    generatePDF(recipe);
    toast.success("Download started!", {
      description: "Your magical recipe PDF is being conjured.",
      position: "bottom-center",
    });
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
        <div className="w-full max-w-md mx-auto mb-6">
          <RadioGroup 
            defaultValue="sweet" 
            value={pieType} 
            onValueChange={(value: "sweet" | "savory") => setPieType(value)} 
            className="flex justify-center gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sweet" id="sweet" />
              <Label htmlFor="sweet" className="flex items-center gap-2 text-lg cursor-pointer">
                <CakeSlice className="h-5 w-5" />
                Sweet
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="savory" id="savory" />
              <Label htmlFor="savory" className="flex items-center gap-2 text-lg cursor-pointer">
                <Utensils className="h-5 w-5" />
                Savory
              </Label>
            </div>
          </RadioGroup>
        </div>
        
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
          
          {recipe && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleDownloadPDF} 
                variant="outline" 
                className="border-wizard-accent/50 hover:bg-wizard-accent/20 text-wizard-accent"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Recipe PDF
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-4 text-center text-wizard-foreground/50 text-sm">
        <p>Crafted with magical ingredients and a hint of whimsy</p>
      </footer>
    </div>
  );
};

export default Index;
