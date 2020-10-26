const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const port = 5000;
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yydfc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
    const lunchFoodsCollection = client.db(`${process.env.DB_NAME}`).collection("lunchFoods");

    // to add foodItems to db
    app.post("/addLunchItem", (req, res) => {
        const lunchItems = req.body;
        lunchFoodsCollection.insertMany(lunchItems).then((result) => {
            res.send(result);
        });
    });

    // to retrieve foodItems
    app.get("/showFoodItems", (req, res) => {
        lunchFoodsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });
});

app.listen(process.env.PORT || port, console.log("server is running at ", port));
