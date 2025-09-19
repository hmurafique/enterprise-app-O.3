const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/health', (req,res) => res.json({ status: 'ok', time: new Date() }));
app.get('/api/users', (req,res) => res.json([{ id:1, name:'Alice' }]));

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> console.log('Backend listening', PORT));
