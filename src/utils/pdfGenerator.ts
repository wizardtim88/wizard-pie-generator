
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

// Helper function to abbreviate common measurement terms
const abbreviateMeasurements = (text: string): string => {
  return text
    .replace(/tablespoon(s)?/gi, 'tbsp')
    .replace(/teaspoon(s)?/gi, 'tsp')
    .replace(/pound(s)?/gi, 'lb')
    .replace(/ounce(s)?/gi, 'oz')
    .replace(/cup(s)?/gi, 'c.')
    .replace(/gallon(s)?/gi, 'gal')
    .replace(/quart(s)?/gi, 'qt')
    .replace(/pint(s)?/gi, 'pt')
    .replace(/gram(s)?/gi, 'g')
    .replace(/kilogram(s)?/gi, 'kg')
    .replace(/milliliter(s)?/gi, 'ml')
    .replace(/liter(s)?/gi, 'L');
};

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
  
  // Content margins (inside the yellow rectangle)
  const contentMarginLeft = 25;
  const contentMarginRight = 25;
  const contentMarginTop = 30;
  const contentMarginBottom = 35;
  const contentWidth = pageWidth - contentMarginLeft - contentMarginRight;
  
  // Calculate total content length to estimate space needs
  const allInstructions = recipe.instructions.join(' ');
  const allIngredients = [
    ...recipe.ingredients.crust,
    ...recipe.ingredients.filling,
    ...(recipe.ingredients.topping || [])
  ].join(' ');
  const totalContentLength = allInstructions.length + allIngredients.length;
  const totalIngredientsCount = recipe.ingredients.crust.length + 
                              recipe.ingredients.filling.length + 
                              (recipe.ingredients.topping?.length || 0);
  
  // Dynamically set initial font sizes based on content length and count
  let titleFontSize = 16;
  let headingFontSize = 12;
  let subheadingFontSize = 10;
  let textFontSize = 9;
  
  // More aggressive font size reduction based on content length and ingredient count
  if (totalContentLength > 3000 || totalIngredientsCount > 20 || recipe.instructions.length > 15) {
    titleFontSize = 14;
    headingFontSize = 10;
    subheadingFontSize = 8;
    textFontSize = 7;
  } else if (totalContentLength > 2500 || totalIngredientsCount > 15 || recipe.instructions.length > 12) {
    titleFontSize = 15;
    headingFontSize = 11;
    subheadingFontSize = 9;
    textFontSize = 8;
  } else if (totalContentLength > 2000 || totalIngredientsCount > 12 || recipe.instructions.length > 10) {
    titleFontSize = 16;
    headingFontSize = 12;
    subheadingFontSize = 10;
    textFontSize = 9;
  }
  
  // Start position for content
  let yPosition = contentMarginTop;
  
  // Add title
  doc.setFontSize(titleFontSize);
  doc.setTextColor(126, 105, 171); // Purple color similar to wizard-accent
  doc.text(recipe.title, pageWidth / 2, yPosition, { align: "center" });
  yPosition += titleFontSize / 2 + 3;
  
  // Add recipe type
  doc.setFontSize(headingFontSize);
  doc.setTextColor(80, 80, 80);
  doc.text(`${recipe.type === "sweet" ? "Sweet" : "Savory"} Pie`, pageWidth / 2, yPosition, { align: "center" });
  yPosition += headingFontSize / 2 + 4;
  
  // --- OPTIMIZE BAKING DETAILS SECTION ---
  // Use horizontal layout for baking details to save vertical space
  const bakingDetailsFontSize = Math.max(7, textFontSize - 0.5);
  doc.setFontSize(bakingDetailsFontSize);
  doc.setTextColor(80, 80, 80);
  
  // Calculate widths for each baking detail item
  const bakingDetailsWidth = contentWidth / 3;
  
  doc.text(`Temp: ${recipe.bakingTemp}`, contentMarginLeft, yPosition);
  doc.text(`Time: ${recipe.bakingTime}`, contentMarginLeft + bakingDetailsWidth, yPosition);
  doc.text(`Servings: ${recipe.servings}`, contentMarginLeft + bakingDetailsWidth * 2, yPosition);
  yPosition += bakingDetailsFontSize + 6;
  
  // --- OPTIMIZE INGREDIENTS SECTION ---
  // Determine if we should use multi-column layout for ingredients based on count
  const useMultiColumnIngredients = totalIngredientsCount > 10;
  let columnWidth = contentWidth;
  let midPoint = Math.ceil(totalIngredientsCount / 2);
  let ingredientCount = 0;
  
  if (useMultiColumnIngredients) {
    columnWidth = (contentWidth - 10) / 2;
  }
  
  // Add ingredients heading
  doc.setFontSize(headingFontSize);
  doc.setTextColor(80, 80, 80);
  doc.text("Ingredients", contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2 + 2;
  
  // Start position for ingredients columns
  let leftColY = yPosition;
  let rightColY = yPosition;
  
  // Process each ingredient section
  const processIngredientSection = (sectionTitle: string, ingredients: string[], startingColumn: 'left' | 'right' = 'left') => {
    let currentY = startingColumn === 'left' ? leftColY : rightColY;
    const currentX = startingColumn === 'left' ? contentMarginLeft : contentMarginLeft + columnWidth + 5;
    
    // Add section title
    doc.setFontSize(subheadingFontSize);
    doc.setTextColor(60, 60, 60);
    doc.text(sectionTitle, currentX, currentY);
    currentY += subheadingFontSize + 1;
    
    // Add ingredients with abbreviated measurements
    doc.setFontSize(textFontSize);
    doc.setTextColor(80, 80, 80);
    ingredients.forEach((item) => {
      const abbreviatedItem = abbreviateMeasurements(item);
      const textLines = doc.splitTextToSize(`• ${abbreviatedItem}`, columnWidth - 5);
      textLines.forEach(line => {
        doc.text(line, currentX, currentY);
        currentY += textFontSize + 0.5;
      });
    });
    
    if (startingColumn === 'left') {
      leftColY = currentY + 2;
    } else {
      rightColY = currentY + 2;
    }
  };
  
  // For the crust
  if (useMultiColumnIngredients) {
    // Determine which sections go in which column
    if (recipe.ingredients.crust.length < midPoint) {
      processIngredientSection("For the Crust:", recipe.ingredients.crust, 'left');
      ingredientCount += recipe.ingredients.crust.length;
      
      if (ingredientCount < midPoint) {
        processIngredientSection("For the Filling:", recipe.ingredients.filling, 'left');
        ingredientCount += recipe.ingredients.filling.length;
        
        if (recipe.ingredients.topping && recipe.ingredients.topping.length > 0) {
          processIngredientSection("For the Topping:", recipe.ingredients.topping, 'right');
        }
      } else {
        processIngredientSection("For the Filling:", recipe.ingredients.filling, 'right');
        
        if (recipe.ingredients.topping && recipe.ingredients.topping.length > 0) {
          rightColY += 2;
          processIngredientSection("For the Topping:", recipe.ingredients.topping, 'right');
        }
      }
    } else {
      // Crust is larger than half, so put filling and topping in right column
      processIngredientSection("For the Crust:", recipe.ingredients.crust, 'left');
      processIngredientSection("For the Filling:", recipe.ingredients.filling, 'right');
      
      if (recipe.ingredients.topping && recipe.ingredients.topping.length > 0) {
        rightColY += 2;
        processIngredientSection("For the Topping:", recipe.ingredients.topping, 'right');
      }
    }
  } else {
    // Single column layout
    processIngredientSection("For the Crust:", recipe.ingredients.crust);
    processIngredientSection("For the Filling:", recipe.ingredients.filling);
    
    if (recipe.ingredients.topping && recipe.ingredients.topping.length > 0) {
      processIngredientSection("For the Topping:", recipe.ingredients.topping);
    }
  }
  
  // Update y position to the maximum of both columns
  yPosition = Math.max(leftColY, rightColY) + 2;
  
  // --- OPTIMIZE INSTRUCTIONS SECTION ---
  // Determine if instructions need two columns based on count and remaining space
  const remainingSpace = pageHeight - contentMarginBottom - yPosition;
  const estimatedInstructionHeight = recipe.instructions.length * (textFontSize + 2);
  const useMultiColumnInstructions = 
    recipe.instructions.length > 10 || 
    estimatedInstructionHeight > remainingSpace;
  
  // Adjust instruction font size if needed
  let instructionFontSize = textFontSize;
  if (estimatedInstructionHeight > remainingSpace) {
    instructionFontSize = Math.max(6.5, textFontSize - 1);
  }
  
  // Add instructions heading
  doc.setFontSize(headingFontSize);
  doc.setTextColor(80, 80, 80);
  doc.text("Instructions", contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2 + 2;
  
  // Process instructions
  doc.setFontSize(instructionFontSize);
  doc.setTextColor(80, 80, 80);
  
  if (useMultiColumnInstructions) {
    // Two-column layout for instructions
    const midInstructionPoint = Math.ceil(recipe.instructions.length / 2);
    const leftInstructions = recipe.instructions.slice(0, midInstructionPoint);
    const rightInstructions = recipe.instructions.slice(midInstructionPoint);
    
    let leftInstrY = yPosition;
    let rightInstrY = yPosition;
    
    // Process left column
    leftInstructions.forEach((instruction, index) => {
      // Abbreviate and condense where possible
      const condensedInstruction = abbreviateMeasurements(instruction);
      
      const numberText = `${index + 1}. `;
      const textLines = doc.splitTextToSize(condensedInstruction, columnWidth - 10);
      
      // Add the number
      doc.text(numberText, contentMarginLeft, leftInstrY);
      
      // Add the instruction text with proper indentation
      textLines.forEach((line, i) => {
        const xPosition = i === 0 ? contentMarginLeft + 5 : contentMarginLeft + 5;
        doc.text(line, xPosition, leftInstrY);
        leftInstrY += instructionFontSize + 0.5;
      });
      
      leftInstrY += 1; // Add small space between instructions
    });
    
    // Process right column
    rightInstructions.forEach((instruction, index) => {
      // Abbreviate and condense where possible
      const condensedInstruction = abbreviateMeasurements(instruction);
      
      const numberText = `${index + midInstructionPoint + 1}. `;
      const textLines = doc.splitTextToSize(condensedInstruction, columnWidth - 10);
      
      // Add the number
      doc.text(numberText, contentMarginLeft + columnWidth + 5, rightInstrY);
      
      // Add the instruction text with proper indentation
      textLines.forEach((line, i) => {
        const xPosition = i === 0 ? contentMarginLeft + columnWidth + 10 : contentMarginLeft + columnWidth + 10;
        doc.text(line, xPosition, rightInstrY);
        rightInstrY += instructionFontSize + 0.5;
      });
      
      rightInstrY += 1; // Add small space between instructions
    });
    
    yPosition = Math.max(leftInstrY, rightInstrY) + 2;
  } else {
    // Single column layout for instructions
    recipe.instructions.forEach((instruction, index) => {
      // Abbreviate and condense where possible
      const condensedInstruction = abbreviateMeasurements(instruction);
      
      const numberText = `${index + 1}. `;
      const textLines = doc.splitTextToSize(condensedInstruction, contentWidth - 10);
      
      // Add the number
      doc.text(numberText, contentMarginLeft, yPosition);
      
      // Add the instruction text with proper indentation
      textLines.forEach((line, i) => {
        const xPosition = i === 0 ? contentMarginLeft + 5 : contentMarginLeft + 5;
        doc.text(line, xPosition, yPosition);
        yPosition += instructionFontSize + 0.5;
      });
      
      yPosition += 1; // Add small space between instructions
    });
  }
  
  // --- OPTIMIZE SUBSTITUTIONS SECTION ---
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
  
  // Check if we have enough space for substitutions
  const remainingHeightAfterInstructions = pageHeight - contentMarginBottom - yPosition;
  const expectedSubstitutionHeight = mentionedMagicalIngredients.length * (textFontSize + 1) + 15;
  
  // Only add substitutions if we have magical ingredients and enough space
  if (mentionedMagicalIngredients.length > 0 && remainingHeightAfterInstructions > 20) {
    // Adjust font size for substitutions based on remaining space
    let substitutionFontSize = Math.max(6.5, textFontSize - 0.5);
    
    if (expectedSubstitutionHeight > remainingHeightAfterInstructions) {
      substitutionFontSize = Math.max(6, substitutionFontSize - 0.5);
    }
    
    yPosition += 3;
    
    doc.setFontSize(Math.min(subheadingFontSize, 10));
    doc.setTextColor(126, 105, 171); // Purple for magical content
    doc.text("Real World Substitutions", contentMarginLeft, yPosition);
    yPosition += Math.min(subheadingFontSize, 10) + 1;
    
    doc.setFontSize(substitutionFontSize);
    doc.setTextColor(80, 80, 80);
    
    // Determine whether to use multiple columns based on count and space
    if (mentionedMagicalIngredients.length > 4 && remainingHeightAfterInstructions < 40) {
      // Use two columns for many substitutions
      const subColumnWidth = (contentWidth - 10) / 2;
      const column1 = mentionedMagicalIngredients.slice(0, Math.ceil(mentionedMagicalIngredients.length / 2));
      const column2 = mentionedMagicalIngredients.slice(Math.ceil(mentionedMagicalIngredients.length / 2));
      
      let col1Y = yPosition;
      let col2Y = yPosition;
      
      column1.forEach(sub => {
        const subLines = doc.splitTextToSize(`• ${sub}`, subColumnWidth);
        subLines.forEach(line => {
          doc.text(line, contentMarginLeft, col1Y);
          col1Y += substitutionFontSize + 0.5;
        });
      });
      
      column2.forEach(sub => {
        const subLines = doc.splitTextToSize(`• ${sub}`, subColumnWidth);
        subLines.forEach(line => {
          doc.text(line, contentMarginLeft + subColumnWidth + 5, col2Y);
          col2Y += substitutionFontSize + 0.5;
        });
      });
      
      yPosition = Math.max(col1Y, col2Y);
    } else {
      // Single column for fewer substitutions
      mentionedMagicalIngredients.forEach(substitution => {
        const substitutionLines = doc.splitTextToSize(`• ${substitution}`, contentWidth - 10);
        substitutionLines.forEach(line => {
          doc.text(line, contentMarginLeft + 5, yPosition);
          yPosition += substitutionFontSize + 0.5;
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
