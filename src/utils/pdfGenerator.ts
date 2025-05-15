
import { PieRecipe } from './recipeGenerator';
import jsPDF from 'jspdf';

export const generatePDF = (recipe: PieRecipe): void => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set font size and styles
  doc.setFontSize(24);
  doc.setTextColor(126, 105, 171); // Purple color similar to wizard-accent

  // Add title
  doc.text(recipe.title, 105, 20, { align: "center" });

  // Add recipe type
  doc.setFontSize(14);
  doc.text(`Type: ${recipe.type === "sweet" ? "Sweet" : "Savory"} Pie`, 20, 30);
  
  // Add baking details
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text("Baking Details", 20, 40);
  doc.setFontSize(12);
  doc.text(`Temperature: ${recipe.bakingTemp}`, 25, 48);
  doc.text(`Time: ${recipe.bakingTime}`, 25, 55);
  doc.text(`Servings: ${recipe.servings}`, 25, 62);
  
  // Add ingredients section
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text("Ingredients", 20, 75);
  
  // For the crust
  doc.setFontSize(14);
  doc.text("For the Crust:", 20, 85);
  
  let yPosition = 92;
  
  // Add crust ingredients
  doc.setFontSize(12);
  recipe.ingredients.crust.forEach((item) => {
    doc.text(`• ${item}`, 25, yPosition);
    yPosition += 7;
  });
  
  // For the filling
  doc.setFontSize(14);
  doc.text("For the Filling:", 20, yPosition + 5);
  yPosition += 12;
  
  // Add filling ingredients
  doc.setFontSize(12);
  recipe.ingredients.filling.forEach((item) => {
    doc.text(`• ${item}`, 25, yPosition);
    yPosition += 7;
    
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  // For the topping (if exists)
  if (recipe.ingredients.topping && recipe.ingredients.topping.length > 0) {
    doc.setFontSize(14);
    doc.text("For the Topping:", 20, yPosition + 5);
    yPosition += 12;
    
    // Add topping ingredients
    doc.setFontSize(12);
    recipe.ingredients.topping.forEach((item) => {
      doc.text(`• ${item}`, 25, yPosition);
      yPosition += 7;
      
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
  }
  
  // Check if we need a new page for instructions
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Add instructions section
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text("Instructions", 20, yPosition + 5);
  yPosition += 12;
  
  // Add instructions
  doc.setFontSize(12);
  recipe.instructions.forEach((instruction, index) => {
    doc.text(`${index + 1}. ${instruction}`, 20, yPosition);
    yPosition += 15;
    
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Magical Pie Recipe Generator', 105, 290, { align: "center" });
    doc.text(`Page ${i} of ${pageCount}`, 195, 290, { align: "right" });
  }
  
  // Download the PDF
  doc.save(`${recipe.title.replace(/\s+/g, '_').toLowerCase()}_recipe.pdf`);
};
