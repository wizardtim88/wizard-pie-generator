
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PieChart, Download, CakeSlice, Utensils, Sparkles, Wand2 } from 'lucide-react';
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
  const [scanlineVisible, setScanlineVisible] = useState(true);

  useEffect(() => {
    // Add the Google Fonts to the document
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap';
    document.head.appendChild(linkEl);
    
    return () => {
      document.head.removeChild(linkEl);
    };
  }, []);

  const generateRecipe = () => {
    setIsGenerating(true);
    setSparkle(true);
    
    // Add glitch effect to the body temporarily
    document.body.classList.add('animate-glitch');
    setTimeout(() => {
      document.body.classList.remove('animate-glitch');
    }, 300);
    
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
        className: "font-retro text-lg",
      });
    }, 800);
  };
  
  const handleDownloadPDF = () => {
    if (!recipe) {
      toast.error("No recipe to download", {
        description: "Please generate a recipe first.",
        position: "bottom-center",
        className: "font-retro text-lg",
      });
      return;
    }
    
    // Add visual feedback
    if (buttonRef.current) {
      buttonRef.current.classList.add('animate-glitch');
      setTimeout(() => {
        buttonRef.current?.classList.remove('animate-glitch');
      }, 300);
    }
    
    generatePDF(recipe);
    toast.success("Download started!", {
      description: "Your magical recipe PDF is being conjured.",
      position: "bottom-center",
      className: "font-retro text-lg",
    });
  };

  // Toggle scanline effect every few seconds for a dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      setScanlineVisible(prev => !prev);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-wizard text-wizard-foreground flex flex-col relative overflow-hidden">
      {/* Grid background for retro feel */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-10 pointer-events-none"></div>
      
      {/* Scanline effect */}
      {scanlineVisible && (
        <div className="absolute inset-0 bg-scanline-pattern animate-scanline opacity-30 pointer-events-none"></div>
      )}
      
      <SparkleEffect trigger={sparkle} targetRef={buttonRef} />
      
      <header className="py-8 px-4 relative z-10">
        <div className="pb-1 mb-3">
          <div className="animate-pulse-glow inline-block px-4 py-2 border-2 border-wizard-accent rounded">
            <h1 className="text-3xl md:text-4xl font-pixel text-center mb-1 text-wizard-accent">
              WIZARD PIE GENERATOR
            </h1>
          </div>
        </div>
        <p className="text-center font-retro text-wizard-foreground/75 max-w-xl mx-auto text-xl">
          CAST A SPELL TO CONJURE A RANDOM PIE RECIPE
        </p>
      </header>
      
      <main className="flex-1 container mx-auto px-4 pb-16 flex flex-col relative z-10">
        <div className="w-full max-w-md mx-auto mb-6 border-2 border-wizard-accent-tertiary bg-wizard-muted/30 p-4 rounded">
          <p className="font-retro text-center text-xl mb-2 text-wizard-accent-tertiary">SELECT PIE TYPE:</p>
          <RadioGroup 
            defaultValue="sweet" 
            value={pieType} 
            onValueChange={(value: "sweet" | "savory") => setPieType(value)} 
            className="flex justify-center gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sweet" id="sweet" className="border-wizard-accent-secondary text-wizard-accent-secondary" />
              <Label htmlFor="sweet" className="flex items-center gap-2 text-lg cursor-pointer font-retro">
                <CakeSlice className="h-5 w-5 text-wizard-accent-secondary" />
                <span className="text-wizard-accent-secondary">SWEET</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="savory" id="savory" className="border-wizard-accent-tertiary text-wizard-accent-tertiary" />
              <Label htmlFor="savory" className="flex items-center gap-2 text-lg cursor-pointer font-retro">
                <Utensils className="h-5 w-5 text-wizard-accent-tertiary" />
                <span className="text-wizard-accent-tertiary">SAVORY</span>
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
            className="bg-wizard-accent hover:bg-wizard-accent-hover text-wizard font-pixel text-lg px-6 py-8 h-auto transition-all duration-300 border-4 border-wizard-accent/50 hover:animate-pulse-glow relative overflow-hidden group"
            aria-label="Generate Pie Recipe"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span>CASTING SPELL...</span>
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5 animate-float" />
                <span>CAST PIE SPELL</span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-wizard-accent to-wizard-accent-hover opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </Button>
        </div>
        
        <div className="flex-1 w-full max-w-4xl mx-auto">
          <div className="font-retro text-2xl text-wizard-accent-secondary mb-4 text-center">
            {recipe ? "YOUR MAGICAL RECIPE:" : "AWAITING MAGICAL INGREDIENTS..."}
          </div>
          
          <div className={`border-2 ${recipe ? 'border-wizard-accent' : 'border-wizard-muted'} rounded-lg overflow-hidden transition-all duration-300`}>
            <RecipeCard recipe={recipe} className="min-h-[400px]" />
          </div>
          
          {recipe && (
            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleDownloadPDF} 
                variant="outline" 
                className="font-pixel border-2 border-wizard-accent-tertiary text-wizard-accent-tertiary hover:bg-wizard-accent-tertiary/20 flex items-center gap-2 px-6 py-3 h-auto"
                aria-label="Download Recipe as PDF"
              >
                <Download className="h-4 w-4" />
                DOWNLOAD SPELLBOOK
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 text-center font-retro text-wizard-foreground/50 text-md relative z-10 border-t border-wizard-muted/30">
        <p className="flex items-center justify-center gap-2">
          <span className="text-wizard-accent">◈</span>
          CRAFTED WITH MAGICAL CODE AND A HINT OF BINARY WHIMSY
          <span className="text-wizard-accent">◈</span>
        </p>
      </footer>
    </div>
  );
};

export default Index;
