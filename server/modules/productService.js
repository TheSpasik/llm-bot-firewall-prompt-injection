const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '..', 'data', 'products.json');

function getProducts() {
  try {
    const raw = fs.readFileSync(productsFile, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function formatProductsForPrompt() {
  const products = getProducts();
  if (!Array.isArray(products)) {
    return 'Available product catalog is not available.';
  }

  const lines = ['Available product catalog:'];
  products.forEach((product, index) => {
    lines.push(`${index + 1}. Name: ${product.name}`);
    lines.push(`   Category: ${product.category}`);
    lines.push(`   Price: ${product.price}`);
    lines.push(`   Description: ${product.description}`);
    lines.push(`   Specifications: CPU: ${product.specs.cpu}, RAM: ${product.specs.ram}, Storage: ${product.specs.storage}, Display: ${product.specs.display}`);
    lines.push(`   Recommended for: ${product.recommendedFor.join(', ')}`);
  });
  lines.push('');
  lines.push('Instruction: Use only this product catalog when answering product-related questions.');

  return lines.join('\n');
}

module.exports = { getProducts, formatProductsForPrompt };
