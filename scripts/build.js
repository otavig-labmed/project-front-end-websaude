const fs = require('fs');
const path = require('path');

// Função para copiar arquivo
function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    console.log(`✅ Copiado: ${source} -> ${destination}`);
  } catch (error) {
    console.error(`❌ Erro ao copiar ${source}:`, error.message);
  }
}

// Função para criar diretório se não existir
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Diretório de destino
const distDir = path.join(__dirname, '../dist');

// Garantir que o diretório dist existe
ensureDir(distDir);

// Lista de arquivos para copiar
const filesToCopy = [
  { source: 'public/_redirects', dest: 'dist/_redirects' },
  { source: 'public/.htaccess', dest: 'dist/.htaccess' },
  { source: 'nginx.conf', dest: 'dist/nginx.conf' },
  { source: 'vercel.json', dest: 'dist/vercel.json' }
];

console.log('🚀 Copiando arquivos de configuração para dist/...');

// Copiar arquivos
filesToCopy.forEach(({ source, dest }) => {
  if (fs.existsSync(source)) {
    copyFile(source, dest);
  } else {
    console.warn(`⚠️  Arquivo não encontrado: ${source}`);
  }
});

console.log('✅ Build finalizado com configurações de roteamento!');
console.log('\n📋 Instruções de deploy:');
console.log('• Para Netlify: O arquivo _redirects já está configurado');
console.log('• Para Apache: Use o arquivo .htaccess');
console.log('• Para Nginx: Use o arquivo nginx.conf como referência');
console.log('• Para Vercel: O arquivo vercel.json já está configurado'); 