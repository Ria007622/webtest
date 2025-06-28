const fs = require('fs');
const path = require('path');

// Create static build directory
const staticDir = 'static-build';
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir);
}

// Copy client files
const clientSrc = 'client';
const clientDest = path.join(staticDir, 'client');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy necessary files
copyDir(clientSrc, clientDest);

// Copy shared folder
if (fs.existsSync('shared')) {
  copyDir('shared', path.join(staticDir, 'shared'));
}

// Copy config files
const configFiles = [
  'package.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'tsconfig.json',
  'components.json',
  'postcss.config.js'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(staticDir, file));
  }
});

console.log('Static build files copied to:', staticDir);