const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

require('./routes/htmlRoutes')(app)
require('./routes/APIRoures')(app)


// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articles";

// mongoose.connect(MONGODB_URI);

// app.listen(PORT, () => console.log(`Listening on Port ${PORT}`))

app.listen(PORT, function() {
    console.log(`Listening on Port ${PORT}`)
 });