const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('local Bootstrap Icons distribution is complete and minimal', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /bootstrap-icons\/font\/bootstrap-icons\.min\.css/);
  for (const file of [
    'bootstrap-icons/font/bootstrap-icons.min.css',
    'bootstrap-icons/font/fonts/bootstrap-icons.woff',
    'bootstrap-icons/font/fonts/bootstrap-icons.woff2',
    'bootstrap-icons/LICENSE.md'
  ]) {
    assert.ok(fs.statSync(path.join(root, file)).size > 0, `${file} is missing`);
  }
  const svgFiles = fs.readdirSync(path.join(root, 'bootstrap-icons')).filter(file => file.endsWith('.svg'));
  assert.deepEqual(svgFiles, []);
});
