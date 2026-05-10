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

const replacements = [
  { from: 'className="grid grid-cols-4 gap-4"', to: 'className="grid grid-cols-2 lg:grid-cols-4 gap-4"' },
  { from: 'className="grid grid-cols-3 gap-4"', to: 'className="grid grid-cols-1 md:grid-cols-3 gap-4"' },
  { from: '<div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4">', to: '<div className="flex gap-1 mt-4 border-b border-gray-100 -mb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">' },
  { from: 'className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4"', to: 'className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-md p-0 sm:p-4"' },
  { from: 'className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"', to: 'className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"' },
  { from: 'className="max-w-7xl mx-auto px-6 py-8 pb-16"', to: 'className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16"' },
  { from: 'className="max-w-5xl mx-auto px-6 py-8 pb-16"', to: 'className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16"' },
];

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(({from, to}) => {
    content = content.split(from).join(to);
  });

  content = content.split('className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full"').join('className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"');
  content = content.split('className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full"').join('className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"');
  content = content.split('className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"').join('className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"');
  content = content.split('className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full"').join('className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"');
  content = content.split('className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full"').join('className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
