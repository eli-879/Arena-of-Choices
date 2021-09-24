const express = require('express');
const Datastore = require('nedb');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("IM LISTENING"));

app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore("database.db");
database.loadDatabase();

app.post('/api', (request, response) => {
    console.log("I got a request!");
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    
    response.json({
        status: "success"
    });
});
