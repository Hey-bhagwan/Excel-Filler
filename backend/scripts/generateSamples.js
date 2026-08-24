import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSampleExcelTemplate, createSampleCsvString } from '../services/sampleDataService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const sampleDir = path.resolve(__dirname, '../../sample_data');
  if (!fs.existsSync(sampleDir)) {
    fs.mkdirSync(sampleDir, { recursive: true });
  }

  // 1. Generate Sample CSV
  const csvContent = createSampleCsvString();
  const csvPath = path.join(sampleDir, 'products_sample.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf-8');
  console.log(`✓ Created Sample CSV: ${csvPath}`);

  // 2. Generate Sample XLSX Template
  const excelBuffer = await createSampleExcelTemplate();
  const excelPath = path.join(sampleDir, 'Product_Catalog_Template.xlsx');
  fs.writeFileSync(excelPath, Buffer.from(excelBuffer));
  console.log(`✓ Created Sample Excel Template: ${excelPath}`);

  // 3. Generate URL Mapping CSV
  const urlMappingContent = `Product ID,Product URL
PH-101,https://sample-store.mock/products/apple-iphone-15
PH-102,https://sample-store.mock/products/samsung-galaxy-s24-ultra
PH-103,https://sample-store.mock/products/google-pixel-9-pro
PH-104,https://sample-store.mock/products/oneplus-12-5g
PH-105,https://sample-store.mock/products/apple-macbook-air-m3
PH-106,https://sample-store.mock/products/sony-wh-1000xm5
PH-107,https://sample-store.mock/products/nike-air-zoom-pegasus-40`;

  const urlCsvPath = path.join(sampleDir, 'sample_urls_mapping.csv');
  fs.writeFileSync(urlCsvPath, urlMappingContent, 'utf-8');
  console.log(`✓ Created Sample URLs Mapping CSV: ${urlCsvPath}`);
}

main().catch(console.error);
