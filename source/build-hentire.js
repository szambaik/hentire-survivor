const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const packaged = path.basename(root) === 'source';
const outputDir = packaged ? path.dirname(root) : path.join(root, 'hentire-survivor');
const sourcePath = path.join(root, 'survivors-grimoire.html');
const scriptPath = path.join(root, 'survivors-grimoire.js');
const themePath = path.join(root, 'hentire-theme.css');
const fontPath = '/tmp/grenze-gotisch-700.ttf';

let source = fs.readFileSync(sourcePath, 'utf8');
const embeddedFont = source.match(/font-family: "Grenze Gotisch";\s*src: url\("data:font\/ttf;base64,([^"]+)/)?.[1];
const font = embeddedFont || (fs.existsSync(fontPath) ? fs.readFileSync(fontPath).toString('base64') : null);
if (!font) throw new Error('A beágyazott Grenze Gotisch betűtípus nem található.');
const pixelFont = fs.readFileSync(path.join(root, 'hentire-pixelify-700.ttf')).toString('base64');
const pixelLicense = fs.readFileSync(path.join(outputDir, 'FONT-LICENSE.txt'), 'utf8').replace(/\r/g, '');
const theme = fs.readFileSync(themePath, 'utf8').replace('__GRENZE_FONT__', font).replace('__PIXEL_FONT__', pixelFont).replace('__PIXEL_LICENSE__', pixelLicense);
source = source.replace(/<style id="hentire-theme">[\s\S]*?<\/style>/, `<style id="hentire-theme">${theme}</style>`);
source = source.replace(/[ \t\r]+$/gm, '');
source = source.replace(/<script src="survivors-grimoire.js"><\/script>(?:<script src="hentire-companion.js"><\/script>)?(?:<script src="hentire-library.js"><\/script>)?/, '<script src="survivors-grimoire.js"></script><script src="hentire-companion.js"></script><script src="hentire-library.js"></script>');
fs.writeFileSync(sourcePath, source);

const script = fs.readFileSync(scriptPath, 'utf8');
const companion = fs.readFileSync(path.join(root, 'hentire-companion.js'), 'utf8');
const library = fs.readFileSync(path.join(root, 'hentire-library.js'), 'utf8');
const locale = fs.readFileSync(path.join(root, 'pocket-locale.js'), 'utf8');
const beta = fs.readFileSync(path.join(root, 'pocket-beta.js'), 'utf8');
const betaCss = fs.readFileSync(path.join(root, 'pocket-beta.css'), 'utf8');
const book = fs.readFileSync(path.join(outputDir, 'icon.svg'), 'utf8');
const standalone = source.replace('__POCKET_BOOK__', book)
  .replace('</head>', '<style>' + betaCss + '</style></head>')
  .replace('<script src="survivors-grimoire.js"></script><script src="hentire-companion.js"></script><script src="hentire-library.js"></script>', () => '<script>' + locale + '</script><script>' + script + '\n' + companion + '\n' + library + '\n' + beta + '</script>');
if (!packaged) fs.writeFileSync(path.join(root, 'survivors-grimoire-iphone.html'), standalone);
fs.writeFileSync(path.join(outputDir, 'index.html'), standalone);
// Keep the public repository reproducible; runtime remains one embedded HTML file.
if (!packaged) {
  const sources=path.join(outputDir,'source');
  fs.mkdirSync(sources,{recursive:true});
  for (const name of ['build-hentire.js','survivors-grimoire.html','survivors-grimoire.js','hentire-theme.css','hentire-companion.js','hentire-library.js','hentire-pixelify-700.ttf','pocket-locale.js','pocket-beta.js','pocket-beta.css']) {
    fs.copyFileSync(path.join(root,name),path.join(sources,name));
  }
}
