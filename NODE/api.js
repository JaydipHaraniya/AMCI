
const express = require('express')
var cors = require('cors')

const app = express()
const port = 1900


var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
var MongoClient = require('mongodb').MongoClient;
var MONGODB_URL = "mongodb://localhost:27017"
const ObjectID = require('mongodb').ObjectID;

var dbo;

app.use(cors())

MongoClient.connect(MONGODB_URL, function (err, db) {
    if (err) throw err;
    dbo = db.db("amci");

    if (dbo.namespace) {

        console.log("mongo  connected succsefully ................con", dbo.namespace)
        app.listen(port, () => console.log(` app listening at http://localhost:${port}`))

    }


});


app.post('/upload', (req, res) => {
    let dataToAdd = req.body
    dbo.collection("testing").insertOne(dataToAdd, (err, result) => {

        if (err) {
            console.log("------>", err);
        } else {
            res.send({ code: 200 })
        }
    })



})


app.get('/upload', (req, res) => {

    dbo.collection("testing").find({})
        .toArray((err, result) => {

            if (err) {
                console.log("------>", err);
            } else {
                res.send(result)

            }
        })



})


app.get('/upload/:id', (req, res) => {


    dbo.collection("testing").find({ "_id": ObjectID(req.params.id) }, { name: 1, discriptiom: 1, imgeUrl: 1 })
        .toArray((err, result) => {

            if (err) {
                console.log("------>", err);
            } else {
                res.send(result)

            }
        })



})


app.delete('/upload/:id', (req, res) => {


    dbo.collection("testing").deleteOne({ "_id": ObjectID(req.params.id) }, (err, result) => {

        if (err) {
            console.log("------>", err);
        } else {
            res.send(result)

        }
    })



})

app.put('/upload/:id', (req, res) => {
    let dataToupdate = req.body


    dbo.collection("testing").update({ "_id": ObjectID(req.params.id) }, { $set: dataToupdate }, (err, result) => {

        if (err) {
            console.log("------>", err);
        } else {
            res.send(result)

        }
    })



})


