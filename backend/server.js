const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/generate', (req, res) => {
  res.json({ imageUrl: 'https://via.placeholder.com/300?text=NFT' });
});

app.listen(5000, () => console.log('Backend ready'));
