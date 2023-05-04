const express = require('express');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const {git} = req.query;
    if (git === undefined) return res.json({message: 'No data'})
    const script = spawn('python', ['script.py', git]);
    let data = '';
    script.stdout.on('data', (chunk) => {
        data += chunk;
    });
    script.on('close', () => {
        res.json({message: data});
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});