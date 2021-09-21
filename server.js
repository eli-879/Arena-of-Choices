const express = require('express');
const app = express();
app.listen(3000, () => console.log("IM LISTENING"));

app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

app.post('/api', (request, response) => {
    console.log("I got a request!");
    console.log(request.body);
    response.json({
        status: "success"
    });
});
