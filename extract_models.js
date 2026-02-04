const fs = require('fs');
const data = JSON.parse(fs.readFileSync('models.json', 'utf8'));
const providers = ['openai', 'google', 'perplexity'];
const models = data.data.filter(m => providers.some(p => m.id.includes(p)));
console.log(JSON.stringify(models.map(m => ({id: m.id, name: m.name})), null, 2));
