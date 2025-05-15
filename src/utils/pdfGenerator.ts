
import { PieRecipe } from './recipeGenerator';
import jsPDF from 'jspdf';

export const generatePDF = (recipe: PieRecipe): void => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Set initial cursor position
  let yPosition = 20;
  const leftMargin = 20;
  const maxWidth = 170; // Maximum width for text to prevent overflow
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(126, 105, 171); // Purple color similar to wizard-accent
  doc.text(recipe.title, 105, yPosition, { align: "center" });
  yPosition += 15;

  // Add recipe type
  doc.setFontSize(14);
  doc.text(`Type: ${recipe.type === "sweet" ? "Sweet" : "Savory"} Pie`, leftMargin, yPosition);
  yPosition += 10;
  
  // Add baking details
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text("Baking Details", leftMargin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(12);
  doc.text(`Temperature: ${recipe.bakingTemp}`, leftMargin + 5, yPosition);
  yPosition += 7;
  doc.text(`Time: ${recipe.bakingTime}`, leftMargin + 5, yPosition);
  yPosition += 7;
  doc.text(`Servings: ${recipe.servings}`, leftMargin + 5, yPosition);
  yPosition += 12;
  
  // Add ingredients section
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text("Ingredients", leftMargin, yPosition);
  yPosition += 8;
  
  // For the crust
  doc.setFontSize(14);
  doc.text("For the Crust:", leftMargin, yPosition);
  yPosition += 7;
  
  // Add crust ingredients with proper line wrapping
  doc.setFontSize(12);
  recipe.ingredients.crust.forEach((item) => {
    // Check if line would exceed page width
    const textLines = doc.splitTextToSize(`• ${item}`, maxWidth);
    textLines.forEach(line => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(line, leftMargin + 5, yPosition);
      yPosition += 6;
    });
  });
  yPosition += 2;
  
  // For the filling
  doc.setFontSize(14);
  // Check if we need a new page
  if (yPosition > 260) {
    doc.addPage();
    yPosition = 20;
  }
  doc.text("For the Filling:", leftMargin, yPosition);
  yPosition += 7;
  
  // Add filling ingredients with proper line wrapping
  doc.setFontSize(12);
  recipe.ingredients.filling.forEach((item) => {
    // Check if line would exceed page width
    const textLines = doc.splitTextToSize(`• ${item}`, maxWidth);
    textLines.forEach(line => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(line, leftMargin + 5, yPosition);
      yPosition += 6;
    });
  });
  yPosition += 2;
  
  // For the topping (if exists)
  if (recipe.ingredients.topping && recipe.ingredients.topping.length > 0) {
    // Check if we need a new page
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.text("For the Topping:", leftMargin, yPosition);
    yPosition += 7;
    
    // Add topping ingredients with proper line wrapping
    doc.setFontSize(12);
    recipe.ingredients.topping.forEach((item) => {
      // Check if line would exceed page width
      const textLines = doc.splitTextToSize(`• ${item}`, maxWidth);
      textLines.forEach(line => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(line, leftMargin + 5, yPosition);
        yPosition += 6;
      });
    });
    yPosition += 2;
  }
  
  // Add instructions section
  // Check if we need a new page or if we're close to bottom
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text("Instructions", leftMargin, yPosition);
  yPosition += 8;
  
  // Add instructions with proper line wrapping and numbering
  doc.setFontSize(12);
  recipe.instructions.forEach((instruction, index) => {
    const numberText = `${index + 1}. `;
    const instructionText = instruction;
    
    // Split long instructions into multiple lines
    const textLines = doc.splitTextToSize(instructionText, maxWidth - 10);
    
    // Check if we need a new page before starting this instruction
    if (yPosition > 270 - (textLines.length * 6)) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add the number
    doc.text(numberText, leftMargin, yPosition);
    
    // Add the instruction text with proper indentation
    textLines.forEach((line, i) => {
      // First line goes next to the number, rest are indented
      const xPosition = i === 0 ? leftMargin + 7 : leftMargin + 7;
      doc.text(line, xPosition, yPosition);
      yPosition += 6;
    });
    
    yPosition += 3; // Add space between instructions
  });
  
  // Add a note about magical ingredients
  yPosition += 5;
  doc.setFontSize(14);
  doc.setTextColor(126, 105, 171);
  
  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.text("Note on Magical Ingredients:", leftMargin, yPosition);
  yPosition += 7;
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  const magicNote = "Any magical ingredients (moonbeam sugar, fairy dust, etc.) can be replaced with their non-magical counterparts (regular sugar, cinnamon, etc.) while maintaining the same measurements for a delicious real-world version of this magical pie.";
  
  const noteLines = doc.splitTextToSize(magicNote, maxWidth);
  noteLines.forEach(line => {
    doc.text(line, leftMargin, yPosition);
    yPosition += 6;
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
