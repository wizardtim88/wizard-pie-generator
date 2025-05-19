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
  
  // Add dark blue border rectangle first (full page)
  doc.setFillColor(28, 37, 38); // Dark blue border #1C2526
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Add pale yellow content rectangle (with margin from border)
  const margin = 15;
  const rectX = margin;
  const rectY = margin;
  const rectWidth = pageWidth - (margin * 2);
  const rectHeight = pageHeight - (margin * 2);
  
  // Set pale yellow background rectangle
  doc.setFillColor(245, 230, 200); // #F5E6C8 - Pale yellow background
  doc.rect(rectX, rectY, rectWidth, rectHeight, 'F');
  
  // Content margins (inside the yellow rectangle)
  const contentMarginLeft = 25;
  const contentMarginRight = 25;
  const contentMarginTop = 30;
  const contentMarginBottom = 25; // Reduced margin now that we're removing the wizard image
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
  doc.setTextColor(28, 37, 38); // Dark blue color for title
  doc.setFont('helvetica', 'bold');
  doc.text(recipe.title, pageWidth / 2, yPosition, { align: "center" });
  yPosition += titleFontSize / 2 + 2; // Reduced spacing after title
  
  // Add recipe type
  doc.setFontSize(headingFontSize);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(`${recipe.type === "sweet" ? "Sweet" : "Savory"} Pie`, pageWidth / 2, yPosition, { align: "center" });
  yPosition += headingFontSize / 2 + 3; // Reduced spacing after type
  
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
  yPosition += bakingDetailsFontSize + 4; // Reduced spacing after baking details
  
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
  doc.setTextColor(28, 37, 38); // Dark blue for headings
  doc.setFont('helvetica', 'bold');
  doc.text("Ingredients", contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2 + 1; // Reduced spacing after ingredients heading
  
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
    doc.setFont('helvetica', 'bold');
    doc.text(sectionTitle, currentX, currentY);
    currentY += subheadingFontSize / 2 + 1; // Reduced spacing after section title
    
    // Add ingredients with abbreviated measurements
    doc.setFontSize(textFontSize);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    
    ingredients.forEach((item) => {
      const abbreviatedItem = abbreviateMeasurements(item);
      // Ensure text wrapping by calculating the maximum width for the column
      const maxWidth = columnWidth - 5;
      const textLines = doc.splitTextToSize(`• ${abbreviatedItem}`, maxWidth);
      
      textLines.forEach((line, i) => {
        doc.text(line, currentX, currentY);
        currentY += textFontSize * 0.5; // Even more reduced line spacing (single-spacing)
      });
    });
    
    if (startingColumn === 'left') {
      leftColY = currentY + 1; // Reduced space between sections
    } else {
      rightColY = currentY + 1; // Reduced space between sections
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
          rightColY += 1; // Reduced spacing before topping section
          processIngredientSection("For the Topping:", recipe.ingredients.topping, 'right');
        }
      }
    } else {
      // Crust is larger than half, so put filling and topping in right column
      processIngredientSection("For the Crust:", recipe.ingredients.crust, 'left');
      processIngredientSection("For the Filling:", recipe.ingredients.filling, 'right');
      
      if (recipe.ingredients.topping && recipe.ingredients.topping.length > 0) {
        rightColY += 1; // Reduced spacing before topping section
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
  yPosition = Math.max(leftColY, rightColY) + 1; // Reduced spacing after ingredients
  
  // --- IMPROVED INSTRUCTIONS SECTION WITH OVERFLOW PREVENTION ---
  
  // Calculate available height for instructions
  const availableHeight = pageHeight - contentMarginBottom - yPosition;
  
  // Estimate instruction content size
  const estimatedInstructionHeight = recipe.instructions.length * (textFontSize * 0.7);
  
  // Dynamic decision for layout based on content and space
  let instructionFontSize = textFontSize;
  let instructionLineHeight = 0.5; // Default to single-spacing
  let useMultiColumnInstructions = recipe.instructions.length > 8;
  
  // Progressively adjust layout parameters based on content amount
  if (estimatedInstructionHeight > availableHeight * 1.5) {
    // Very long content - smallest font, tightest spacing, forced single column
    instructionFontSize = Math.max(8, textFontSize - 1.5);
    instructionLineHeight = 0.4;
    useMultiColumnInstructions = false; // Force single column for very long content
  } 
  else if (estimatedInstructionHeight > availableHeight) {
    // Long content - reduced font and spacing
    instructionFontSize = Math.max(8, textFontSize - 1);
    instructionLineHeight = 0.45;
    // If instructions are extremely long, switch to single column
    if (recipe.instructions.length > 15) {
      useMultiColumnInstructions = false;
    }
  }
  
  // Add instructions heading
  doc.setFontSize(headingFontSize);
  doc.setTextColor(28, 37, 38); // Dark blue for headings
  doc.setFont('helvetica', 'bold');
  doc.text("Instructions", contentMarginLeft, yPosition);
  yPosition += headingFontSize / 2 + 1; // Reduced spacing after instructions heading
  
  // Process instructions with improved wrapping
  doc.setFontSize(instructionFontSize);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  
  if (useMultiColumnInstructions) {
    // Two-column layout for instructions
    const midInstructionPoint = Math.ceil(recipe.instructions.length / 2);
    const leftInstructions = recipe.instructions.slice(0, midInstructionPoint);
    const rightInstructions = recipe.instructions.slice(midInstructionPoint);
    
    // Calculate safe column width - ensure it's not too wide
    let safeColumnWidth = (contentWidth - 15) / 2; // Extra padding between columns
    
    let leftInstrY = yPosition;
    let rightInstrY = yPosition;
    
    // Process left column
    leftInstructions.forEach((instruction, index) => {
      const condensedInstruction = abbreviateMeasurements(instruction);
      const numberText = `${index + 1}. `;
      const numberWidth = doc.getTextWidth(numberText);
      
      // Ensure text fits in column with proper wrapping
      const textLines = doc.splitTextToSize(
        condensedInstruction, 
        safeColumnWidth - numberWidth - 2 // Subtract number width and some padding
      );
      
      // Add the number
      doc.text(numberText, contentMarginLeft, leftInstrY);
      
      // Add the instruction text with proper indentation and wrapping
      textLines.forEach((line, i) => {
        const xPosition = i === 0 ? 
          contentMarginLeft + numberWidth : 
          contentMarginLeft + numberWidth;
          
        doc.text(line, xPosition, leftInstrY);
        leftInstrY += instructionFontSize * instructionLineHeight; // Single-spacing
      });
      
      leftInstrY += 0.5; // Minimal spacing between instructions
    });
    
    // Process right column with same careful wrapping
    rightInstructions.forEach((instruction, index) => {
      const condensedInstruction = abbreviateMeasurements(instruction);
      const numberText = `${index + midInstructionPoint + 1}. `;
      const numberWidth = doc.getTextWidth(numberText);
      const rightColumnX = contentMarginLeft + safeColumnWidth + 10;
      
      // Ensure text fits in column with proper wrapping
      const textLines = doc.splitTextToSize(
        condensedInstruction, 
        safeColumnWidth - numberWidth - 2 // Subtract number width and some padding
      );
      
      // Add the number
      doc.text(numberText, rightColumnX, rightInstrY);
      
      // Add the instruction text with proper indentation and wrapping
      textLines.forEach((line, i) => {
        const xPosition = i === 0 ? 
          rightColumnX + numberWidth : 
          rightColumnX + numberWidth;
          
        doc.text(line, xPosition, rightInstrY);
        rightInstrY += instructionFontSize * instructionLineHeight; // Single-spacing
      });
      
      rightInstrY += 0.5; // Minimal spacing between instructions
    });
    
    yPosition = Math.max(leftInstrY, rightInstrY) + 1; // Update position after instructions
  } else {
    // Single column layout for instructions - better for longer content
    const fullWidth = contentWidth - 10; // Full width with small margin
    
    recipe.instructions.forEach((instruction, index) => {
      const condensedInstruction = abbreviateMeasurements(instruction);
      const numberText = `${index + 1}. `;
      const numberWidth = doc.getTextWidth(numberText);
      
      // Ensure text fits in full width with proper wrapping
      const textLines = doc.splitTextToSize(
        condensedInstruction, 
        fullWidth - numberWidth - 2 // Subtract number width and some padding
      );
      
      // Add the number
      doc.text(numberText, contentMarginLeft, yPosition);
      
      // Add the instruction text with proper indentation and wrapping
      textLines.forEach((line, i) => {
        const xPosition = i === 0 ? 
          contentMarginLeft + numberWidth : 
          contentMarginLeft + numberWidth;
          
        doc.text(line, xPosition, yPosition);
        yPosition += instructionFontSize * instructionLineHeight; // Single-spacing
      });
      
      yPosition += 0.5; // Minimal spacing between instructions
    });
  }
  
  // Check if there's enough space for substitutions
  const remainingHeight = pageHeight - contentMarginBottom - yPosition;
  
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
  const expectedSubstitutionHeight = mentionedMagicalIngredients.length * (textFontSize * 0.5) + 12; // Reduced height estimate
  
  // Only add substitutions if we have magical ingredients and enough space
  if (mentionedMagicalIngredients.length > 0 && remainingHeightAfterInstructions > 15) {
    // Adjust font size for substitutions based on remaining space
    let substitutionFontSize = Math.max(6.5, textFontSize - 0.5);
    let substitutionLineHeight = 0.5; // Single-spacing
    
    if (expectedSubstitutionHeight > remainingHeightAfterInstructions) {
      substitutionFontSize = Math.max(6, substitutionFontSize - 0.5);
    }
    
    yPosition += 2; // Reduced spacing before substitutions section
    
    doc.setFontSize(Math.min(subheadingFontSize, 10));
    doc.setTextColor(126, 105, 171); // Purple for magical content
    doc.setFont('helvetica', 'bold');
    doc.text("Real World Substitutions", contentMarginLeft, yPosition);
    yPosition += Math.min(subheadingFontSize, 10) / 2 + 1; // Reduced spacing after substitutions heading
    
    doc.setFontSize(substitutionFontSize);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    
    // Determine layout based on space and content
    if (mentionedMagicalIngredients.length > 4 && remainingHeightAfterInstructions < 40) {
      // Two columns for many substitutions
      const subColumnWidth = (contentWidth - 15) / 2; // More space between columns
      const column1 = mentionedMagicalIngredients.slice(0, Math.ceil(mentionedMagicalIngredients.length / 2));
      const column2 = mentionedMagicalIngredients.slice(Math.ceil(mentionedMagicalIngredients.length / 2));
      
      let col1Y = yPosition;
      let col2Y = yPosition;
      
      // Process first column with proper wrapping
      column1.forEach(sub => {
        const subLines = doc.splitTextToSize(`• ${sub}`, subColumnWidth);
        
        subLines.forEach((line, i) => {
          doc.text(line, contentMarginLeft, col1Y);
          col1Y += substitutionFontSize * substitutionLineHeight; // Single-spacing
        });
        
        col1Y += 0.5; // Minimal spacing between items
      });
      
      // Process second column with proper wrapping
      column2.forEach(sub => {
        const subLines = doc.splitTextToSize(`• ${sub}`, subColumnWidth);
        const col2X = contentMarginLeft + subColumnWidth + 10;
        
        subLines.forEach((line, i) => {
          doc.text(line, col2X, col2Y);
          col2Y += substitutionFontSize * substitutionLineHeight; // Single-spacing
        });
        
        col2Y += 0.5; // Minimal spacing between items
      });
      
      yPosition = Math.max(col1Y, col2Y);
    } else {
      // Single column for fewer substitutions
      const fullWidth = contentWidth - 10;
      
      mentionedMagicalIngredients.forEach(substitution => {
        const substitutionLines = doc.splitTextToSize(`• ${substitution}`, fullWidth);
        
        substitutionLines.forEach((line, i) => {
          doc.text(line, contentMarginLeft + 5, yPosition);
          yPosition += substitutionFontSize * substitutionLineHeight; // Single-spacing
        });
        
        yPosition += 0.5; // Minimal spacing between items
      });
    }
  }
  
  // Add website URL at the bottom (white text on dark blue border)
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255); // White color for footer
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by Magical Pie Recipe Generator | WIZARDTIM.com', pageWidth / 2, pageHeight - 5, { align: "center" });
  
  // Download the PDF with the recipe title
  doc.save(`${recipe.title.replace(/\s+/g, '_').toLowerCase()}_recipe.pdf`);
};
