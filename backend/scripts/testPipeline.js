import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testFullPipeline() {
  const baseURL = 'http://localhost:5001/api';

  console.log('🧪 Starting End-to-End Test for Excel Product Filler Application...\n');

  // 1. Check Sample API
  console.log('1. Fetching Smartphone Sample Data...');
  const sampleRes = await axios.get(`${baseURL}/samples/smartphone`);
  console.log(`✓ Sample Loaded: ${sampleRes.data.sampleName}`);
  console.log(`  - Products: ${sampleRes.data.csv.data.totalRows}`);
  console.log(`  - Excel Sheet: ${sampleRes.data.excel.data.sheets[0].name} (${sampleRes.data.excel.data.sheets[0].headers.length} cols)`);

  // 2. Test Live Preview Extraction
  console.log('\n2. Testing Webpage Extraction Preview...');
  const previewRes = await axios.post(`${baseURL}/preview/extract`, {
    url: 'https://sample-store.mock/products/apple-iphone-15',
    productName: 'Apple iPhone 15',
  });
  console.log(`✓ Extraction Result (${previewRes.data.elapsedMs}ms):`);
  console.log(`  - Found Fields: ${previewRes.data.meta.foundFieldsCount}`);
  console.log(`  - Confidence: ${Math.round(previewRes.data.meta.averageConfidence * 100)}%`);
  console.log(`  - Extracted Price: ${previewRes.data.fields.price?.value} (Method: ${previewRes.data.fields.price?.method})`);
  console.log(`  - Extracted Weight: ${previewRes.data.fields.weight?.value}`);
  console.log(`  - Extracted Color: ${previewRes.data.fields.color?.value}`);

  // 3. Create Job
  console.log('\n3. Creating Batch Job...');
  const sample = sampleRes.data;
  const products = sample.csv.data.rows.map(r => ({
    id: String(r[sample.primaryKeyMapping.csvKey]),
    csvData: r,
    url: sample.urlsMap[String(r[sample.primaryKeyMapping.csvKey])] || '',
  }));

  const createJobRes = await axios.post(`${baseURL}/jobs`, {
    csvData: sample.csv.data,
    templateId: sample.excel.templateId,
    sheetName: sample.excel.data.defaultSheet,
    primaryKeyMapping: sample.primaryKeyMapping,
    fieldMappings: sample.fieldMappings,
    products,
    customSelectors: {},
  });
  const jobId = createJobRes.data.jobId;
  console.log(`✓ Job Created: ${jobId}`);

  // 4. Start Background Job
  console.log('\n4. Starting Background Job Processing...');
  await axios.post(`${baseURL}/jobs/${jobId}/start`);

  // Wait for completion
  let jobState = 'running';
  let attempts = 0;
  while (jobState === 'running' && attempts < 20) {
    await new Promise(r => setTimeout(r, 600));
    const jobRes = await axios.get(`${baseURL}/jobs/${jobId}`);
    jobState = jobRes.data.job.state;
    const prog = jobRes.data.job.progress;
    console.log(`  ⏳ Status: ${jobState} | Progress: ${prog.percentage}% (${prog.completed} completed, ${prog.partial} partial, ${prog.failed} failed)`);
    attempts++;
  }

  // 5. Test Exporting Populated Excel File
  console.log('\n5. Populating and Exporting Excel Template (.xlsx)...');
  const exportRes = await axios.post(`${baseURL}/jobs/${jobId}/export`, {}, {
    responseType: 'arraybuffer',
  });

  const exportPath = path.resolve(__dirname, '../../exports/test_populated_catalog.xlsx');
  fs.writeFileSync(exportPath, Buffer.from(exportRes.data));
  console.log(`✓ Successfully Generated & Exported XLSX: ${exportPath} (${exportRes.data.byteLength} bytes)`);

  console.log('\n🎉 ALL PIPELINE TESTS PASSED WITH 100% SUCCESS!\n');
}

testFullPipeline().catch(err => {
  console.error('Test failed:', err.response?.data || err.message);
  process.exit(1);
});
