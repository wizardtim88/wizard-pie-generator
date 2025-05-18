
import { PieRecipe } from './recipeGenerator';
import jsPDF from 'jspdf';

// Define magical ingredient substitutions
const magicalIngredientSubstitutions = new Map([
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

export const generatePDF = (recipe: PieRecipe): void => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Page dimensions
  const pageWidth = 210;
  const pageHeight = 297;
  
  // Yellow background rectangle dimensions
  const rectX = 15;
  const rectY = 15;
  const rectWidth = pageWidth - 30;
  const rectHeight = pageHeight - 30;
  
  // Set yellow background rectangle
  doc.setFillColor(254, 247, 205); // #FEF7CD - Soft Yellow
  doc.rect(rectX, rectY, rectWidth, rectHeight, 'F');
  
  // Add wizard image in bottom right corner
  // This would be a placeholder for now as we need to add actual wizard image assets
  
  // Content margins (inside the yellow rectangle)
  const contentMarginLeft = 25;
  const contentMarginRight = 25;
  const contentMarginTop = 25;
  const contentMarginBottom = 60; // Leave space for wizard image
  const contentWidth = pageWidth - contentMarginLeft - contentMarginRight;
  
  // Start position for content
  let yPosition = contentMarginTop;
  
  // Function to check available space and adjust font sizes if needed
  const checkAndAdjustContent = (content: string[], estimatedHeight: number, currentFontSize: number): number => {
    const availableSpace = pageHeight - contentMarginBottom - yPosition;
    if (estimatedHeight > availableSpace && currentFontSize > 8) {
      // Reduce font size and recalculate
      return currentFontSize - 0.5;
    }
    return currentFontSize;
  };
  
  // Calculate total content length to estimate space needs
  const allInstructions = recipe.instructions.join(' ');
  const allIngredients = [
    ...recipe.ingredients.crust,
    ...recipe.ingredients.filling,
    ...(recipe.ingredients.topping || [])
  ].join(' ');
  const totalContentLength = allInstructions.length + allIngredients.length;
  
  // Dynamically set initial font sizes based on content length
  let titleFontSize = 20;
  let headingFontSize = 14;
  let textFontSize = 11;
  
  if (totalContentLength > 2000) {
    titleFontSize = 18;
    headingFontSize = 12;
    textFontSize = 9;
  } else if (totalContentLength > 1500) {
    titleFontSize = 19;
    headingFontSize = 13;
    textFontSize = 10;
  }
  
  // Add title
  doc.setFontSize(titleFontSize);
  doc.setTextColor(126, 105, 171); // Purple color similar to wizard-accent
  doc.text(recipe.title, pageWidth / 2, yPosition, { align: "center" });
  yPosition += titleFontSize / 2;
  
  // Add recipe type
  doc.setFontSize(headingFontSize);
  doc.setTextColor(100, 100, 100);
  doc.text(`Type: ${recipe.type === "sweet" ? "Sweet" : "Savory"} Pie`, contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2;
  
  // Add baking details
  doc.setFontSize(headingFontSize);
  doc.setTextColor(100, 100, 100);
  doc.text("Baking Details", contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2;
  
  doc.setFontSize(textFontSize);
  const bakingDetails = [
    `Temperature: ${recipe.bakingTemp}`,
    `Time: ${recipe.bakingTime}`,
    `Servings: ${recipe.servings}`
  ];
  
  bakingDetails.forEach(detail => {
    doc.text(detail, contentMarginLeft + 5, yPosition);
    yPosition += textFontSize / 1.5;
  });
  yPosition += textFontSize / 2;
  
  // Add ingredients section
  doc.setFontSize(headingFontSize);
  doc.setTextColor(100, 100, 100);
  doc.text("Ingredients", contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2;
  
  // For the crust
  doc.setFontSize(textFontSize + 1);
  doc.text("For the Crust:", contentMarginLeft, yPosition);
  yPosition += (textFontSize + 1) / 1.5;
  
  // Add crust ingredients
  doc.setFontSize(textFontSize);
  recipe.ingredients.crust.forEach((item) => {
    const textLines = doc.splitTextToSize(`• ${item}`, contentWidth - 10);
    textLines.forEach(line => {
      doc.text(line, contentMarginLeft + 5, yPosition);
      yPosition += textFontSize / 1.5;
    });
  });
  yPosition += textFontSize / 3;
  
  // For the filling
  doc.setFontSize(textFontSize + 1);
  doc.text("For the Filling:", contentMarginLeft, yPosition);
  yPosition += (textFontSize + 1) / 1.5;
  
  // Add filling ingredients
  doc.setFontSize(textFontSize);
  recipe.ingredients.filling.forEach((item) => {
    const textLines = doc.splitTextToSize(`• ${item}`, contentWidth - 10);
    textLines.forEach(line => {
      doc.text(line, contentMarginLeft + 5, yPosition);
      yPosition += textFontSize / 1.5;
    });
  });
  yPosition += textFontSize / 3;
  
  // For the topping (if exists)
  if (recipe.ingredients.topping && recipe.ingredients.topping.length > 0) {
    doc.setFontSize(textFontSize + 1);
    doc.text("For the Topping:", contentMarginLeft, yPosition);
    yPosition += (textFontSize + 1) / 1.5;
    
    // Add topping ingredients
    doc.setFontSize(textFontSize);
    recipe.ingredients.topping.forEach((item) => {
      const textLines = doc.splitTextToSize(`• ${item}`, contentWidth - 10);
      textLines.forEach(line => {
        doc.text(line, contentMarginLeft + 5, yPosition);
        yPosition += textFontSize / 1.5;
      });
    });
    yPosition += textFontSize / 3;
  }
  
  // Check if we need to reduce font size for instructions
  const estimatedInstructionHeight = (recipe.instructions.length * textFontSize * 2); // Rough estimation
  textFontSize = checkAndAdjustContent(recipe.instructions, estimatedInstructionHeight, textFontSize);
  
  // Add instructions section
  doc.setFontSize(headingFontSize);
  doc.setTextColor(100, 100, 100);
  doc.text("Instructions", contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2;
  
  // Add instructions with proper line wrapping and numbering
  doc.setFontSize(textFontSize);
  recipe.instructions.forEach((instruction, index) => {
    const numberText = `${index + 1}. `;
    const instructionText = instruction;
    
    // Split long instructions into multiple lines
    const textLines = doc.splitTextToSize(instructionText, contentWidth - 15);
    
    // Add the number
    doc.text(numberText, contentMarginLeft, yPosition);
    
    // Add the instruction text with proper indentation
    textLines.forEach((line, i) => {
      // First line goes next to the number, rest are indented
      const xPosition = i === 0 ? contentMarginLeft + 7 : contentMarginLeft + 7;
      doc.text(line, xPosition, yPosition);
      yPosition += textFontSize / 1.5;
    });
    
    yPosition += textFontSize / 5; // Add small space between instructions
  });
  
  // Collect all ingredients to find magical ones
  const allIngredientsList = [
    ...recipe.ingredients.crust,
    ...recipe.ingredients.filling,
    ...(recipe.ingredients.topping || [])
  ];
  
  // Find magical ingredients mentioned in the recipe
  const mentionedMagicalIngredients: string[] = [];
  magicalIngredientSubstitutions.forEach((realValue, magicalKey) => {
    if (allIngredientsList.some(ingredient => 
      ingredient.toLowerCase().includes(magicalKey.toLowerCase())
    )) {
      mentionedMagicalIngredients.push(`${magicalKey} → ${realValue}`);
    }
  });
  
  // Check remaining space and adjust font size for substitutions if needed
  let substitutionFontSize = textFontSize;
  if (mentionedMagicalIngredients.length > 0) {
    const estimatedSubstitutionHeight = mentionedMagicalIngredients.length * textFontSize;
    const remainingSpace = pageHeight - contentMarginBottom - yPosition;
    
    if (estimatedSubstitutionHeight > remainingSpace) {
      substitutionFontSize = Math.max(8, textFontSize - 1);
    }
    
    yPosition += textFontSize / 2;
    
    doc.setFontSize(headingFontSize);
    doc.setTextColor(126, 105, 171);
    doc.text("Real World Substitutions", contentMarginLeft, yPosition);
    yPosition += headingFontSize / 2;
    
    doc.setFontSize(substitutionFontSize);
    doc.setTextColor(100, 100, 100);
    const introText = "To make this pie in the non-magical world, use these substitutions:";
    const introLines = doc.splitTextToSize(introText, contentWidth);
    introLines.forEach(line => {
      doc.text(line, contentMarginLeft, yPosition);
      yPosition += substitutionFontSize / 1.5;
    });
    
    // Add substitutions in multiple columns if there are many
    if (mentionedMagicalIngredients.length > 5) {
      const column1 = mentionedMagicalIngredients.slice(0, Math.ceil(mentionedMagicalIngredients.length / 2));
      const column2 = mentionedMagicalIngredients.slice(Math.ceil(mentionedMagicalIngredients.length / 2));
      const columnWidth = (contentWidth - 10) / 2;
      
      let col1Y = yPosition;
      let col2Y = yPosition;
      
      column1.forEach(sub => {
        const subLines = doc.splitTextToSize(`• ${sub}`, columnWidth);
        subLines.forEach(line => {
          doc.text(line, contentMarginLeft, col1Y);
          col1Y += substitutionFontSize / 1.5;
        });
      });
      
      column2.forEach(sub => {
        const subLines = doc.splitTextToSize(`• ${sub}`, columnWidth);
        subLines.forEach(line => {
          doc.text(line, contentMarginLeft + columnWidth + 10, col2Y);
          col2Y += substitutionFontSize / 1.5;
        });
      });
      
      yPosition = Math.max(col1Y, col2Y);
    } else {
      // Single column for fewer substitutions
      mentionedMagicalIngredients.forEach(substitution => {
        const substitutionLines = doc.splitTextToSize(`• ${substitution}`, contentWidth);
        substitutionLines.forEach(line => {
          doc.text(line, contentMarginLeft, yPosition);
          yPosition += substitutionFontSize / 1.5;
        });
      });
    }
  } else {
    // Add a general note about magical ingredients if no specific magical ingredients found
    yPosition += textFontSize / 2;
    doc.setFontSize(textFontSize);
    doc.setTextColor(126, 105, 171);
    doc.text("Note on Magical Ingredients:", contentMarginLeft, yPosition);
    yPosition += textFontSize / 1.5;
    
    doc.setFontSize(textFontSize);
    doc.setTextColor(100, 100, 100);
    const magicNote = "Any magical ingredients can be replaced with their non-magical counterparts while maintaining the same measurements for a delicious real-world version of this magical pie.";
    
    const noteLines = doc.splitTextToSize(magicNote, contentWidth);
    noteLines.forEach(line => {
      doc.text(line, contentMarginLeft, yPosition);
      yPosition += textFontSize / 1.5;
    });
  }
  
  // Add footer text
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Magical Pie Recipe Generator', pageWidth / 2, pageHeight - 20, { align: "center" });
  
  // Download the PDF
  doc.save(`${recipe.title.replace(/\s+/g, '_').toLowerCase()}_recipe.pdf`);
};

