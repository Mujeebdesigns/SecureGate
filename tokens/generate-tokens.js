const fs = require('fs');
const path = require('path');

const designTokensPath = path.join(__dirname, 'design-tokens.json');
const colorTokensPath = path.join(__dirname, 'color-tokens.json');
const outputCssPath = path.join(__dirname, 'tokens.css');

// Load JSON data safely
let designData, colorData;
try {
  designData = JSON.parse(fs.readFileSync(designTokensPath, 'utf8'));
  colorData = JSON.parse(fs.readFileSync(colorTokensPath, 'utf8'));
} catch (error) {
  console.error('Error loading token JSON files:', error.message);
  process.exit(1);
}

// Utility to convert camelCase to kebab-case
const toKebabCase = (str) => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

const cssLines = [];
cssLines.push('/* =================================================== */');
cssLines.push('/* AUTO-GENERATED DESIGN TOKENS — DO NOT EDIT MANUALLY */');
cssLines.push('/* Generated via tokens/generate-tokens.js             */');
cssLines.push('/* =================================================== */');
cssLines.push('');
cssLines.push(':root {');

// 1. Process Semantic Design Tokens (Colors, Borders, States, Buttons, Inputs, Shadows)
cssLines.push('  /* ==========================================');
cssLines.push('     COLOR & SEMANTIC TOKENS (design-tokens.json)');
cssLines.push('     ========================================== */');

for (const [groupName, tokens] of Object.entries(designData)) {
  cssLines.push(`\n  /* --- ${groupName.charAt(0).toUpperCase() + groupName.slice(1)} --- */`);
  for (const [key, value] of Object.entries(tokens)) {
    const cssVarName = `--${toKebabCase(groupName)}-${toKebabCase(key)}`;
    
    // Check if value is a shadow definition or simple string
    if (groupName === 'shadow') {
      cssLines.push(`  ${cssVarName}: ${value};`);
    } else {
      cssLines.push(`  ${cssVarName}: ${value};`);
    }
  }
}

// 2. Process Typography Tokens (FontFamilies, Weights, Sizes, Component Typography)
cssLines.push('\n  /* ==========================================');
cssLines.push('     TYPOGRAPHY TOKENS (color-tokens.json)');
cssLines.push('     ========================================== */');

// Font Families
if (colorData.fontFamily) {
  cssLines.push('\n  /* --- Font Families --- */');
  for (const [key, value] of Object.entries(colorData.fontFamily)) {
    cssLines.push(`  --font-${toKebabCase(key)}: ${value};`);
  }
}

// Font Weights
if (colorData.fontWeight) {
  cssLines.push('\n  /* --- Font Weights --- */');
  for (const [key, value] of Object.entries(colorData.fontWeight)) {
    cssLines.push(`  --font-weight-${toKebabCase(key)}: ${value};`);
  }
}

// Font Sizes & Line Heights
if (colorData.fontSize) {
  cssLines.push('\n  /* --- Font Sizes & Line Heights --- */');
  for (const [key, tokenInfo] of Object.entries(colorData.fontSize)) {
    cssLines.push(`  --font-size-${toKebabCase(key)}: ${tokenInfo.size};`);
    cssLines.push(`  --line-height-${toKebabCase(key)}: ${tokenInfo.lineHeight};`);
  }
}

// Headings
if (colorData.heading) {
  cssLines.push('\n  /* --- Heading Configurations --- */');
  for (const [key, tokenInfo] of Object.entries(colorData.heading)) {
    cssLines.push(`  --heading-${toKebabCase(key)}-size: ${tokenInfo.fontSize};`);
    cssLines.push(`  --heading-${toKebabCase(key)}-lh: ${tokenInfo.lineHeight};`);
    cssLines.push(`  --heading-${toKebabCase(key)}-weight: ${tokenInfo.fontWeight};`);
  }
}

// Component Typography Defaults (body, label, button, input)
const componentTypographyKeys = ['body', 'label', 'button', 'input'];
cssLines.push('\n  /* --- Component Typography Rules --- */');

for (const key of componentTypographyKeys) {
  const tokenInfo = colorData[key];
  if (!tokenInfo) continue;
  
  if (key === 'body') {
    // Body has nested 'default' and 'small' levels
    for (const [level, subInfo] of Object.entries(tokenInfo)) {
      cssLines.push(`  --body-${toKebabCase(level)}-size: ${subInfo.fontSize};`);
      cssLines.push(`  --body-${toKebabCase(level)}-lh: ${subInfo.lineHeight};`);
      cssLines.push(`  --body-${toKebabCase(level)}-weight: ${subInfo.fontWeight};`);
    }
  } else {
    // Flat structures
    cssLines.push(`  --${toKebabCase(key)}-size: ${tokenInfo.fontSize};`);
    cssLines.push(`  --${toKebabCase(key)}-lh: ${tokenInfo.lineHeight};`);
    cssLines.push(`  --${toKebabCase(key)}-weight: ${tokenInfo.fontWeight};`);
  }
}

cssLines.push('}');
cssLines.push('');

// Write to tokens.css
try {
  fs.writeFileSync(outputCssPath, cssLines.join('\n'), 'utf8');
  console.log(`\n💎 Success! Compiled CSS Variables to: ${outputCssPath}`);
} catch (error) {
  console.error('Error compiling tokens.css:', error.message);
  process.exit(1);
}
