const express = require('express');
const app = express();
app.listen(3000, () => console.log("IM LISTENING"));

app.use(express.static('public'));
