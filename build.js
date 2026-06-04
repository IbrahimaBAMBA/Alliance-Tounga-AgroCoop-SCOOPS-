const fs = require('fs');
const path = require('path');
let sharp;
try {
    sharp = require('sharp');
} catch (err) {
    console.warn('Warning: sharp module could not be loaded. Image conversion to WebP will be skipped, but assets will be copied directly.');
}

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

// Ensure directories
function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(DIST_DIR);
ensureDir(path.join(DIST_DIR, 'css'));
ensureDir(path.join(DIST_DIR, 'js'));
ensureDir(path.join(DIST_DIR, 'assets'));

// Read components
const navHtml = fs.readFileSync(path.join(SRC_DIR, 'components', 'nav.html'), 'utf-8');
const footerHtml = fs.readFileSync(path.join(SRC_DIR, 'components', 'footer.html'), 'utf-8');

// Process HTML files
const htmlFiles = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(SRC_DIR, file), 'utf-8');
    
    // Inject components
    content = content.replace(/<!--\s*INJECT:NAV\s*-->/g, navHtml);
    content = content.replace(/<!--\s*INJECT:FOOTER\s*-->/g, footerHtml);
    
    // Replace .jpg and .png with .webp for assets
    content = content.replace(/(assets\/[^"']+)\.(jpg|jpeg|png|JPG|JPEG|PNG)/g, '$1.webp');
    
    // Add cache buster to styles and scripts to prevent stale browser cache
    const cacheBuster = `?v=${Date.now()}`;
    content = content.replace(/href="css\/styles\.css(\?v=[0-9]+)?"/g, `href="css/styles.css${cacheBuster}"`);
    content = content.replace(/src="js\/main\.js(\?v=[0-9]+)?"/g, `src="js/main.js${cacheBuster}"`);
    
    fs.writeFileSync(path.join(DIST_DIR, file), content);
    console.log(`Processed: ${file} (with cache busting)`);
});

// Copy CSS and JS
if (fs.existsSync(path.join(SRC_DIR, 'css', 'styles.css'))) {
    fs.copyFileSync(path.join(SRC_DIR, 'css', 'styles.css'), path.join(DIST_DIR, 'css', 'styles.css'));
}
if (fs.existsSync(path.join(SRC_DIR, 'js', 'main.js'))) {
    fs.copyFileSync(path.join(SRC_DIR, 'js', 'main.js'), path.join(DIST_DIR, 'js', 'main.js'));
}

// Convert images
const assetDir = path.join(SRC_DIR, 'assets');
if (fs.existsSync(assetDir)) {
    const images = fs.readdirSync(assetDir);
    images.forEach(img => {
        const ext = path.extname(img).toLowerCase();
        const base = path.basename(img, ext);
        const inputPath = path.join(assetDir, img);
        
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const outputPath = path.join(DIST_DIR, 'assets', `${base}.webp`);
            if (sharp) {
                sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath)
                    .then(() => console.log(`Converted to WebP: ${img}`))
                    .catch(err => console.error(`Error converting ${img}:`, err));
            } else {
                // If sharp is not available, check if the webp already exists or copy the file
                const fallbackPath = path.join(DIST_DIR, 'assets', img);
                fs.copyFileSync(inputPath, fallbackPath);
                
                // Also check if a webp copy exists, if not, copy original
                const webpPath = path.join(DIST_DIR, 'assets', `${base}.webp`);
                if (!fs.existsSync(webpPath)) {
                    fs.copyFileSync(inputPath, webpPath);
                }
                console.log(`Copied image (sharp unavailable): ${img}`);
            }
        } else {
            // just copy other files (like SVG, WEBP if it exists)
            fs.copyFileSync(inputPath, path.join(DIST_DIR, 'assets', img));
        }
    });
}
console.log('Build script executed!');
