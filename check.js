const fs = require('fs'); const content = fs.readFileSync('src\\screens\\auth\\RegisterScreen.jsx', 'utf8'); console.log(JSON.stringify(content.substring(3400, 4200)));  
