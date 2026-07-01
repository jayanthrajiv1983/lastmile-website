/**
 * Lastmile Logi Solutions — Static asset minifier
 * Combines CSS imports into main.min.css and minifies all JS files.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = __dirname;
const cssDir = path.join(root, 'assets', 'css');
const jsDir = path.join(root, 'assets', 'js');

function minifyCss(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/(\d(?:\.\d+)?(?:%|rem|em|ex|ch|vw|vh|vmin|vmax|px|deg|rad|turn|s|ms))\+(\d)/g, '$1 + $2')
    .replace(/(\d(?:\.\d+)?(?:%|rem|em|ex|ch|vw|vh|vmin|vmax|px|deg|rad|turn|s|ms))\-(\d)/g, '$1 - $2')
    .trim();
}

function minifyJs(source) {
  const strings = [];
  const protectedSource = source.replace(
    /'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g,
    (match) => {
      strings.push(match);
      return `__STR${strings.length - 1}__`;
    }
  );

  const minified = protectedSource
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,:<>+*/=|&?[\]])\s*/g, '$1')
    .trim();

  return minified.replace(/__STR(\d+)__/g, (_, index) => strings[Number(index)]);
}

const cssChain = [
  'variables.css',
  'base.css',
  'animations.css',
  'components.css',
  'layout.css',
  'pages.css'
];

let combinedCss = '';
cssChain.forEach((file) => {
  const filePath = path.join(cssDir, file);
  combinedCss += fs.readFileSync(filePath, 'utf8') + '\n';
});

fs.writeFileSync(path.join(cssDir, 'main.min.css'), minifyCss(combinedCss));
console.log('Created assets/css/main.min.css');

const jsFiles = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js') && !f.endsWith('.min.js'));
jsFiles.forEach((file) => {
  const source = fs.readFileSync(path.join(jsDir, file), 'utf8');
  const minName = file.replace(/\.js$/, '.min.js');
  fs.writeFileSync(path.join(jsDir, minName), minifyJs(source));
  console.log('Created assets/js/' + minName);
});

console.log('Minification complete.');
