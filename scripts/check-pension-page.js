import assert from 'node:assert/strict';
import fs from 'node:fs';
const slug = 'why-i-built-payday-to-pension';
const canonical = `https://jiazhenxie.com/blog/${slug}`;
const html = fs.readFileSync(`dist/blog/${slug}/index.html`, 'utf8');
for (const pattern of [/<title>[\s\S]*?<\/title>/g, /<meta name="description"[^>]*>/g, /<link rel="canonical"[^>]*>/g, /<meta property="og:title"[^>]*>/g]) {
  assert.equal([...html.matchAll(pattern)].length, 1, `Expected one ${pattern}`);
}
assert.ok(html.includes(`href="${canonical}"`));
assert.ok(html.includes(`content="${canonical}"`));
assert.ok(html.includes('Same headline percentages. Quite different amounts.'));
assert.ok(html.includes('Why: the percentage hides the actual question'));
assert.ok(html.includes('How: change one thing and follow it through'));
assert.ok(html.includes('href="/payday-to-pension"'));
assert.equal((html.match(/<h1\b/g) || []).length, 1);
const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
const article = schema.find(value => value['@type'] === 'BlogPosting');
assert.ok(article);
assert.equal(article.url, canonical);
assert.equal(article.author.name, 'Jiazhen Xie');
assert.ok(article.datePublished);
for (const name of ['payday-tradeoff', 'extra-pot-growth']) {
  assert.ok(html.includes(`/images/pension/${name}.svg`));
  assert.ok(fs.existsSync(`dist/images/pension/${name}.svg`));
}
assert.ok(fs.readFileSync('dist/sitemap.xml','utf8').includes(`<loc>${canonical}</loc>`));
assert.ok(fs.readFileSync('dist/robots.txt','utf8').includes('Sitemap: https://jiazhenxie.com/sitemap.xml'));
const example = JSON.parse(fs.readFileSync('dist/images/pension/example.json','utf8'));
assert.ok(Math.abs(example.cashCostMonthly - 290) < .01);
assert.equal(example.extraGrossMonthly, 500);
assert.ok(example.extraPot > 192000 && example.extraPot < 350000);
assert.ok(example.extraIncomeMonthly > 800 && example.extraIncomeMonthly < 1000);
assert.equal(example.points[0].pot, 0);
assert.equal(example.points.at(-1).pot, example.extraPot);
console.log('Pension page: unique metadata, full article HTML, schema, images, links, sitemap and model example verified.');
