const express = require('express');
const {exec, spawn} = require('child_process');
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const {git} = req.query;
    if (git === undefined) return res.json({message: 'No data'})
    const repoUrl = git; // URL репозитория
    let repoPath = './repositories/';
    repoPath += fs.readdirSync(repoPath).length;
    fs.mkdirSync(repoPath);
    exec(`git clone ${repoUrl} ${repoPath}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return res.json({message: 'Invalid link'});
        }
        const script = spawn('python', ['script.py', repoPath]);
        let data = '';
        script.stdout.on('data', (chunk) => {
            data += chunk;
        });
        script.on('close', () => {
            res.json({message: data});
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});