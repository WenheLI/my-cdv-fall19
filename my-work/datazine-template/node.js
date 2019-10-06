const fs = require('fs');
let data = JSON.parse(fs.readFileSync('./data.json'));

data = data.map((it) => {
    if(it.platform !== 'Bilibili') it.device = 'desktop';
    return it;
});

fs.writeFileSync('data.json', JSON.stringify(data))