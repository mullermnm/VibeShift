/**
 * Icon Generator Script for VibeShift
 * 
 * This script generates PNG icons from canvas drawings.
 * Run with Node.js and canvas package, or open generate-icons.html in browser.
 * 
 * Browser method (recommended):
 * 1. Open assets/icons/generate-icons.html in Chrome
 * 2. Click download links for each icon size
 * 3. Save to assets/icons/ folder
 * 
 * Node.js method:
 * 1. npm install canvas
 * 2. node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if canvas is available (Node.js environment)
let createCanvas;
try {
  createCanvas = require('canvas').createCanvas;
} catch (e) {
  console.log('Canvas package not found.');
  console.log('');
  console.log('To generate icons, either:');
  console.log('1. Open assets/icons/generate-icons.html in a browser');
  console.log('2. Or install canvas: npm install canvas');
  process.exit(0);
}

function drawIcon(canvas, size) {
  const ctx = canvas.getContext('2d');
  const center = size / 2;
  const radius = size * 0.45;
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(0.5, '#764ba2');
  gradient.addColorStop(1, '#f093fb');
  
  // Draw circle background
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw leaf/vibe shape
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  const leafWidth = size * 0.15;
  const leafHeight = size * 0.35;
  
  ctx.moveTo(center, center - leafHeight);
  ctx.bezierCurveTo(
    center + leafWidth, center - leafHeight * 0.5,
    center + leafWidth, center + leafHeight * 0.5,
    center, center + leafHeight * 0.3
  );
  ctx.bezierCurveTo(
    center - leafWidth, center + leafHeight * 0.5,
    center - leafWidth, center - leafHeight * 0.5,
    center, center - leafHeight
  );
  ctx.fill();
  
  // Draw center dot for larger icons
  if (size >= 48) {
    ctx.beginPath();
    ctx.arc(center, center, size * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
  }
}

// Generate icons
const sizes = [16, 48, 128];
const outputDir = path.join(__dirname, '..', 'assets', 'icons');

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  drawIcon(canvas, size);
  
  const buffer = canvas.toBuffer('image/png');
  const filename = path.join(outputDir, `icon${size}.png`);
  
  fs.writeFileSync(filename, buffer);
  console.log(`Generated: icon${size}.png`);
});

console.log('');
console.log('Icons generated successfully!');
