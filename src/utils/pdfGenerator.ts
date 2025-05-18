
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
  
  // Add dark navy background rectangle first (full page)
  doc.setFillColor(12, 18, 55); // Dark navy background
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Add pale yellow content rectangle with rounded corners
  // We'll simulate rounded corners by drawing a regular rectangle
  const rectX = 15;
  const rectY = 15;
  const rectWidth = pageWidth - 30;
  const rectHeight = pageHeight - 30;
  
  // Set pale yellow background rectangle
  doc.setFillColor(254, 222, 180); // #FEDEB4 - Pale peach color to match image
  doc.rect(rectX, rectY, rectWidth, rectHeight, 'F');
  
  // Add wizard image in bottom right corner
  // This would use an image, but we'll leave space for it
  const wizardWidth = 100; // Width of the space to reserve for wizard
  const wizardHeight = 100; // Height of space to reserve for wizard
  
  // Content margins (inside the yellow rectangle)
  const contentMarginLeft = 30;
  const contentMarginRight = 30;
  const contentMarginTop = 35;
  const contentMarginBottom = 80; // Leave space for wizard image and website
  const contentWidth = pageWidth - contentMarginLeft - contentMarginRight;
  
  // Start position for content
  let yPosition = contentMarginTop;
  
  // Calculate total content length to estimate space needs
  const allInstructions = recipe.instructions.join(' ');
  const allIngredients = [
    ...recipe.ingredients.crust,
    ...recipe.ingredients.filling,
    ...(recipe.ingredients.topping || [])
  ].join(' ');
  const totalContentLength = allInstructions.length + allIngredients.length;
  
  // Dynamically set initial font sizes based on content length
  let titleFontSize = 18;
  let headingFontSize = 14;
  let textFontSize = 11;
  
  // Adjust font sizes based on content length to ensure fit on one page
  if (totalContentLength > 2500) {
    titleFontSize = 16;
    headingFontSize = 11;
    textFontSize = 8;
  } else if (totalContentLength > 2000) {
    titleFontSize = 17;
    headingFontSize = 12;
    textFontSize = 9;
  } else if (totalContentLength > 1500) {
    titleFontSize = 18;
    headingFontSize = 13;
    textFontSize = 10;
  }
  
  // Further reduce font size if we have many instructions or ingredients
  if (recipe.instructions.length > 10 || allIngredients.length > 15) {
    titleFontSize -= 1;
    headingFontSize -= 1;
    textFontSize -= 1;
  }
  
  // Add title
  doc.setFontSize(titleFontSize);
  doc.setTextColor(126, 105, 171); // Purple color similar to wizard-accent
  doc.text(recipe.title, pageWidth / 2, yPosition, { align: "center" });
  yPosition += titleFontSize / 2 + 5;
  
  // Add recipe type
  doc.setFontSize(headingFontSize);
  doc.setTextColor(80, 80, 80);
  doc.text(`${recipe.type === "sweet" ? "Sweet" : "Savory"} Pie`, pageWidth / 2, yPosition, { align: "center" });
  yPosition += headingFontSize + 6;
  
  // Add baking details
  doc.setFontSize(headingFontSize);
  doc.setTextColor(80, 80, 80);
  doc.text("Baking Details", contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2 + 3;
  
  doc.setFontSize(textFontSize);
  const bakingDetails = [
    `Temperature: ${recipe.bakingTemp}`,
    `Time: ${recipe.bakingTime}`,
    `Servings: ${recipe.servings}`
  ];
  
  bakingDetails.forEach(detail => {
    doc.text(detail, contentMarginLeft + 5, yPosition);
    yPosition += textFontSize + 2;
  });
  yPosition += 5;
  
  // Add ingredients section
  doc.setFontSize(headingFontSize);
  doc.setTextColor(80, 80, 80);
  doc.text("Ingredients", contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2 + 4;
  
  // For the crust
  doc.setFontSize(textFontSize + 1);
  doc.setTextColor(60, 60, 60);
  doc.text("For the Crust:", contentMarginLeft, yPosition);
  yPosition += (textFontSize + 1) + 2;
  
  // Add crust ingredients
  doc.setFontSize(textFontSize);
  doc.setTextColor(80, 80, 80);
  recipe.ingredients.crust.forEach((item) => {
    const textLines = doc.splitTextToSize(`• ${item}`, contentWidth - 10);
    textLines.forEach(line => {
      doc.text(line, contentMarginLeft + 5, yPosition);
      yPosition += textFontSize + 1;
    });
  });
  yPosition += 3;
  
  // For the filling
  doc.setFontSize(textFontSize + 1);
  doc.setTextColor(60, 60, 60);
  doc.text("For the Filling:", contentMarginLeft, yPosition);
  yPosition += (textFontSize + 1) + 2;
  
  // Add filling ingredients
  doc.setFontSize(textFontSize);
  doc.setTextColor(80, 80, 80);
  recipe.ingredients.filling.forEach((item) => {
    const textLines = doc.splitTextToSize(`• ${item}`, contentWidth - 10);
    textLines.forEach(line => {
      doc.text(line, contentMarginLeft + 5, yPosition);
      yPosition += textFontSize + 1;
    });
  });
  yPosition += 3;
  
  // For the topping (if exists)
  if (recipe.ingredients.topping && recipe.ingredients.topping.length > 0) {
    doc.setFontSize(textFontSize + 1);
    doc.setTextColor(60, 60, 60);
    doc.text("For the Topping:", contentMarginLeft, yPosition);
    yPosition += (textFontSize + 1) + 2;
    
    // Add topping ingredients
    doc.setFontSize(textFontSize);
    doc.setTextColor(80, 80, 80);
    recipe.ingredients.topping.forEach((item) => {
      const textLines = doc.splitTextToSize(`• ${item}`, contentWidth - 10);
      textLines.forEach(line => {
        doc.text(line, contentMarginLeft + 5, yPosition);
        yPosition += textFontSize + 1;
      });
    });
    yPosition += 3;
  }
  
  // Add instructions section
  // Check remaining space and adjust font size if needed
  const remainingSpace = pageHeight - contentMarginBottom - yPosition;
  const estimatedInstructionHeight = (recipe.instructions.length * (textFontSize + 2));
  
  if (estimatedInstructionHeight > remainingSpace) {
    // Reduce font size for instructions to fit
    textFontSize = Math.max(7, textFontSize - 1);
  }
  
  doc.setFontSize(headingFontSize);
  doc.setTextColor(80, 80, 80);
  doc.text("Instructions", contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2 + 4;
  
  // Add instructions with proper line wrapping and numbering
  doc.setFontSize(textFontSize);
  doc.setTextColor(80, 80, 80);
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
      yPosition += textFontSize + 1;
    });
    
    yPosition += 2; // Add small space between instructions
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
  
  // Check remaining space again
  const spaceLeft = pageHeight - contentMarginBottom - yPosition;
  
  // Only add substitutions if we have magical ingredients and enough space
  if (mentionedMagicalIngredients.length > 0 && spaceLeft > 30) {
    // Adjust font size for substitutions based on remaining space
    let substitutionFontSize = Math.min(textFontSize, 9);
    
    if (spaceLeft < 50 && mentionedMagicalIngredients.length > 3) {
      substitutionFontSize = Math.max(7, substitutionFontSize - 1);
    }
    
    yPosition += 5;
    
    doc.setFontSize(Math.min(headingFontSize, 12));
    doc.setTextColor(126, 105, 171); // Purple for magical content
    doc.text("Real World Substitutions", contentMarginLeft, yPosition);
    yPosition += Math.min(headingFontSize, 12) + 2;
    
    doc.setFontSize(substitutionFontSize);
    doc.setTextColor(80, 80, 80);
    
    // Determine whether to use multiple columns based on count and space
    if (mentionedMagicalIngredients.length > 6 && contentWidth > 100) {
      // Use two columns for many substitutions
      const column1 = mentionedMagicalIngredients.slice(0, Math.ceil(mentionedMagicalIngredients.length / 2));
      const column2 = mentionedMagicalIngredients.slice(Math.ceil(mentionedMagicalIngredients.length / 2));
      const columnWidth = (contentWidth - 20) / 2;
      
      let col1Y = yPosition;
      let col2Y = yPosition;
      
      column1.forEach(sub => {
        const subLines = doc.splitTextToSize(`• ${sub}`, columnWidth);
        subLines.forEach(line => {
          doc.text(line, contentMarginLeft, col1Y);
          col1Y += substitutionFontSize + 1;
        });
      });
      
      column2.forEach(sub => {
        const subLines = doc.splitTextToSize(`• ${sub}`, columnWidth);
        subLines.forEach(line => {
          doc.text(line, contentMarginLeft + columnWidth + 10, col2Y);
          col2Y += substitutionFontSize + 1;
        });
      });
      
      yPosition = Math.max(col1Y, col2Y);
    } else {
      // Single column for fewer substitutions
      mentionedMagicalIngredients.forEach(substitution => {
        const substitutionLines = doc.splitTextToSize(`• ${substitution}`, contentWidth - 10);
        substitutionLines.forEach(line => {
          doc.text(line, contentMarginLeft + 5, yPosition);
          yPosition += substitutionFontSize + 1;
        });
      });
    }
  }
  
  // Add website URL at the bottom
  doc.setFontSize(10);
  doc.setTextColor(126, 105, 171);
  doc.text('WizardTim.com', pageWidth / 2, pageHeight - 20, { align: "center" });
  
  // Download the PDF with the recipe title
  doc.save(`${recipe.title.replace(/\s+/g, '_').toLowerCase()}_recipe.pdf`);
};
