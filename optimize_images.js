const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const galleryPath = path.join(__dirname, 'public', 'images', 'gallery');

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  try {
    const tempPath = filePath + '.tmp' + ext;
    
    // Resize to max width/height of 1200 and optimize quality (75) to significantly reduce size
    await sharp(filePath)
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 75, progressive: true })
      .toFile(tempPath);

    const stat = fs.statSync(filePath);
    const newStat = fs.statSync(tempPath);
    console.log(`Optimized ${path.basename(filePath)}: ${(stat.size/1024).toFixed(2)}KB -> ${(newStat.size/1024).toFixed(2)}KB`);

    // Replace original file
    fs.renameSync(tempPath, filePath);
  } catch (e) {
    console.error(`Failed to process ${filePath}:`, e);
  }
}

async function scanAndProcess(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await scanAndProcess(fullPath);
    } else {
      if (fullPath.includes(`${path.sep}sq`)) {
        await processImage(fullPath);
      }
    }
  }
}

console.log('Starting image optimization (max 1200px, 75 quality)...');
scanAndProcess(galleryPath).then(() => {
  console.log('Finished optimizing images.');
});
