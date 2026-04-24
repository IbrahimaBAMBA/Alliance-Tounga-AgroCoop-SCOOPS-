const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('dist/actualites.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });
const document = dom.window.document;
setTimeout(() => {
  try {
    const card = document.querySelector('.news-article-card');
    card.click();
    const modal = document.getElementById('articleModalOverlay');
    if (modal.classList.contains('active')) {
      console.log('SUCCESS: Modal is active!');
    } else {
      console.log('FAILURE: Modal is not active!');
    }
  } catch(e) {
    console.log('ERROR:', e.message);
  }
}, 500);
