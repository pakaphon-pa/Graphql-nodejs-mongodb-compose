const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('API RUNNING'));

const PORT = process.env.PORT || 1170;

app.listen(PORT, () => console.log(`Server Started on PORT : ${PORT}`));
