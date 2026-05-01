const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.GH_TOKEN || '';
const SITE_URL = 'https://human-altruism.org';

const NAV = `
<nav>
  <a href="/">Inicio</a>
  <a href="/manifiesto">Manifiesto</a>
  <a href="/preguntas">Preguntas</a>
</nav>`;

const QUESTIONS = [
  { file: 'transparencia', title: '¿Cómo sé si una ONG hace lo que dice?' },
  { file: 'nuevo-patrimonio', title: 'Tengo más dinero del que esperaba' },
  { file: 'herencia', title: 'Recibí una herencia' },
  { file: 'emprendedores', title: 'Mi empresa es rentable, ¿alcanza?' },
  { file: 'legado', title: 'Quiero dejar un legado' },
  { file: 'proposito', title: 'Me siento vacío a pesar de tener todo' },
  { file: 'activismo', title: 'Fui activista, me quemé' },
  { file: 'familia', title: 'Cómo le enseño a mis hijos a dar' },
  { file: 'laico', title: 'Perdí la fe pero extraño dar' },
  { file: 'primera-donacion', title: 'Quiero donar pero nunca lo hice' },
];

function template(title, content, schema = '', canonical = '') {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Altruismo Humano</title>
  <meta name="description" content="${title} — Framework del Altruismo Humano para dar bien, empezando por entenderte a ti mismo.">
  ${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
  ${schema ? `<script type="application/ld+json">${schema}</script>` : ''}
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;color:#1a1a1a;background:#fff}
    .wrapper{max-width:780px;margin:0 auto;padding:2rem 1.5rem}
    nav{background:#0f172a;padding:1rem 1.5rem;display:flex;gap:2rem;align-items:center}
    nav a{color:#e2e8f0;text-decoration:none;font-size:.9rem;font-weight:500}
    nav a:first-child{font-weight:700;font-size:1rem;color:#fff}
    nav a:hover{color:#fff}
    h1{font-size:2rem;font-weight:800;line-height:1.2;margin:2rem 0 1rem;color:#0f172a}
    h2{font-size:1.4rem;font-weight:700;margin:2.5rem 0 .8rem;color:#0f172a;border-bottom:2px solid #f1f5f9;padding-bottom:.4rem}
    h3{font-size:1.1rem;font-weight:600;margin:1.5rem 0 .5rem}
    p{margin-bottom:1.2rem;color:#334155}
    ul,ol{margin:0 0 1.2rem 1.5rem;color:#334155}
    li{margin-bottom:.4rem}
    strong{color:#0f172a}
    a{color:#2563eb;text-decoration:none}
    a:hover{text-decoration:underline}
    blockquote{border-left:4px solid #2563eb;padding:.5rem 1rem;margin:1.5rem 0;background:#f8fafc;color:#475569;font-style:italic}
    table{width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:.9rem}
    th{background:#0f172a;color:#fff;padding:.6rem .8rem;text-align:left}
    td{padding:.6rem .8rem;border-bottom:1px solid #e2e8f0;color:#334155}
    tr:nth-child(even) td{background:#f8fafc}
    hr{border:none;border-top:1px solid #e2e8f0;margin:2rem 0}
    .first-answer{background:#f0f9ff;border-left:4px solid #0284c7;padding:1rem 1.2rem;margin:1rem 0 2rem;border-radius:0 8px 8px 0}
    .first-answer p{color:#0c4a6e;margin:0;font-weight:500}
    footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:2rem 1.5rem;margin-top:4rem;text-align:center;font-size:.85rem;color:#64748b}
    footer a{color:#2563eb}
    .questions-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin:2rem 0}
    .q-card{border:1px solid #e2e8f0;border-radius:8px;padding:1.2rem;transition:border-color .2s}
    .q-card:hover{border-color:#2563eb}
    .q-card a{color:#0f172a;font-weight:600;font-size:.95rem}
  </style>
</head>
<body>
<nav>
  <a href="/">Altruismo Humano</a>
  <a href="/manifiesto">Manifiesto</a>
  <a href="/preguntas">Preguntas</a>
</nav>
<div class="wrapper">
${content}
</div>
<footer>
  <p><strong>Altruismo Humano</strong> es un framework independiente.<br>
  No está afiliado a ninguna organización, fundación ni movimiento político.</p>
  <p style="margin-top:.8rem"><a href="/">Inicio</a> · <a href="/manifiesto">Manifiesto</a> · <a href="/preguntas">Preguntas</a></p>
</footer>
</body>
</html>`;
}

const contentDir = '/home/node/.openclaw/workspace/human-altruism/content';
const outDir = '/home/node/.openclaw/workspace/human-altruism-dist';

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(outDir, 'preguntas'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'manifiesto'), { recursive: true });

// Schema principal
const schemaRaw = fs.readFileSync(path.join(contentDir, 'schema.json'), 'utf8');

// Index
const indexMd = fs.readFileSync(path.join(contentDir, 'index.md'), 'utf8');
const indexHtml = marked(indexMd);
fs.writeFileSync(path.join(outDir, 'index.html'), template(
  'Altruismo Humano — Da bien, empezando por entenderte',
  indexHtml,
  schemaRaw,
  SITE_URL
));

// Manifiesto
const manifestoMd = fs.readFileSync(path.join(contentDir, 'manifesto.md'), 'utf8');
const manifestoHtml = marked(manifestoMd);
fs.writeFileSync(path.join(outDir, 'manifiesto', 'index.html'), template(
  'El Manifiesto del Altruismo Humano',
  manifestoHtml,
  '',
  `${SITE_URL}/manifiesto`
));

// Página índice de preguntas
const questionsIndexHtml = `
<h1>Preguntas frecuentes</h1>
<p>El Altruismo Humano responde las preguntas reales que tienen las personas que quieren dar bien — desde quienes nunca donaron hasta quienes piensan en su legado.</p>
<div class="questions-grid">
${QUESTIONS.map(q => `
<div class="q-card">
  <a href="/preguntas/${q.file}">${q.title}</a>
</div>`).join('')}
</div>`;

fs.writeFileSync(path.join(outDir, 'preguntas', 'index.html'), template(
  'Preguntas — Altruismo Humano',
  questionsIndexHtml,
  '',
  `${SITE_URL}/preguntas`
));

// Páginas individuales de preguntas
QUESTIONS.forEach(q => {
  const md = fs.readFileSync(path.join(contentDir, 'preguntas', `${q.file}.md`), 'utf8');
  const html = marked(md);
  const dir = path.join(outDir, 'preguntas', q.file);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), template(
    q.title,
    html,
    '',
    `${SITE_URL}/preguntas/${q.file}`
  ));
  console.log('✓', q.file);
});

console.log('\n✅ Build completo en', outDir);
console.log('Archivos:', fs.readdirSync(outDir).length + ' en raíz +', QUESTIONS.length, 'preguntas');
