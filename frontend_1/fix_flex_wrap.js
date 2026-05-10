import fs from 'fs';
import path from 'path';

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src/pages');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Let's replace <div className="flex gap-2"> with <div className="flex gap-2 flex-wrap">
  content = content.replace(/<div className="flex gap-2">/g, '<div className="flex gap-2 flex-wrap">');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated flex-wrap in ${file}`);
  }
});
