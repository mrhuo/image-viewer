const fs = require('fs');
const { minify } = require('terser');

// Function to minify CSS in template literals
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around braces and semicolons
    .replace(/\s*([{};:,])\s*/g, '$1')
    // Remove leading and trailing whitespace
    .trim()
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Remove spaces before certain characters
    .replace(/\s+([!{};:>+~])\s*/g, '$1')
    // Remove trailing semicolons
    .replace(/;}/g, '}');
}

// Function to extract and minify CSS from template literals
function processTemplateLiterals(code) {
  return code.replace(/`([^`]*)`/g, (match, templateContent) => {
    // Only process template literals that contain CSS
    if (templateContent.includes('style>') || templateContent.includes('#')) {
      return '`' + templateContent.replace(/<style>([\s\S]*?)<\/style>/g, (styleMatch, cssContent) => {
        return `<style>${minifyCSS(cssContent)}</style>`;
      }).replace(/\n\s*/g, '') + '`';
    }
    return match;
  });
}

async function build() {
  try {
    console.log('📦 Building ImageViewer.js...');
    
    // Read the source file
    const sourceCode = fs.readFileSync('src/image-viewer.js', 'utf8');
    
    // First, minify CSS in template literals
    const codeWithMinifiedCSS = processTemplateLiterals(sourceCode);
    
    // Then minify the JavaScript code
    const result = await minify(codeWithMinifiedCSS, {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: {
        toplevel: true
      },
      format: {
        comments: false
      }
    });
    
    if (result.error) {
      throw result.error;
    }
    
    // Ensure dist directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
    
    // Write minified file
    fs.writeFileSync('dist/image-viewer.min.js', result.code);
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Minified file: dist/image-viewer.min.js');
    
    // Show some stats
    const originalSize = Buffer.byteLength(sourceCode, 'utf8');
    const minifiedSize = Buffer.byteLength(result.code, 'utf8');
    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
    
    console.log(`📊 Size reduction: ${originalSize} bytes → ${minifiedSize} bytes (${reduction}% smaller)`);
    
    // Show CSS optimization info
    console.log('🎨 CSS optimization: Removed whitespace and comments from inline styles');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the build
build();
