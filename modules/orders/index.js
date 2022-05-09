// Project Path Assignment : MongoDB & Webapps
// Order Management Module
// Nate Arkin

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
const client = new MongoClient('mongodb://localhost');
const bodyParser = require('body-parser')


const app = module.exports = express();
app.use(bodyParser.json())

app.put('/api/order', (req, res) => {
    recordOrder(req.body.userID, req.body.orderInformation).then(function (result) {
        if (result.success) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    })
});

async function recordOrder(username, orderInformation) {
    try {
        await client.connect();
        const db = client.db('Arkin-WebAppProjectPath').collection('CustomerOrders');
        const date = new Date();
        const recordOrder = await db.insertOne({
            userID: username,
            date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
            order: orderInformation
        })
        console.log(recordOrder)
        return { success: true }
    } catch (err) {
        return { success: false, err: err }
    }
}

app.get('/api/orders/:username', (req, res) => {
    getOrders(req.params.username).then(result => res.send(result));
})

async function getOrders(username) {
    try {
        await client.connect();
        const db = client.db('Arkin-WebAppProjectPath').collection('CustomerOrders');
        const userOrders = await db.find({ userID: username }).toArray();
        return { success: true, data: userOrders };
    } catch (err) {
        return { success: false, err: err }
    }
}

app.put('/api/rating', (req, res) => {
    addReview(req.body.order, req.body.item, req.body.rating).then(result => res.send(result));
})

async function addReview(order, item, rating) {
    try {
        await client.connect();
        const db = client.db('Arkin-WebAppProjectPath').collection('Reviews');
        const recordRating = await db.insertOne({
            orderId: order,
            itemId: item,
            rating: parseInt(rating)
        })
        if (recordRating.acknowledged) {
            return { success: true }
        } else {
            return { success: false, err: 'db error' }
        }
    } catch (err) {
        return { success: false, err: err }
    }
}

app.get('/api/ratings', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('Arkin-WebAppProjectPath').collection('Reviews');
        const ratings = await db.find({}).toArray();
        res.send({ success: true, data: ratings })
    } catch (err) {
        res.send({ success: false, err: err })
    }
})

app.get('/api/rating', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('Arkin-WebAppProjectPath').collection('Reviews');
        const ratings = await db.aggregate([{'$group': {'_id': '$itemId', 'rating': {'$avg': '$rating'}, 'count': {'$sum': 1}}}]).toArray();
        res.send({ success: true, data: ratings })
    } catch (err) {
        res.send({ success: false, err: err })
    }
})