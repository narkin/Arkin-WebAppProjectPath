// Project Path Assignment : MongoDB & Webapps
// Product Management Module using Faker
// Nate Arkin

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
const client = new MongoClient('mongodb://localhost');
const path = require('path');
const faker = require('faker');
const bodyParser = require('body-parser')


const app = module.exports = express();
app.use(bodyParser.json())

// API endpoint for generating data
app.get('/api/generateData', (req, res) => {
    generateTheData().then(result => res.send(result));
})

async function generateTheData() {
    try {
        await client.connect();
        const db = client.db('Arkin-WebAppProjectPath').collection('Products');
        db.deleteMany({}); // Clear out entire product table before rebuilding
        const productArray = [];
        for (let i = 0; i < 30; i++) {
            productArray.push({
                productName: faker.commerce.productName(),
                productUnitPrice: parseFloat(faker.finance.amount(0, 1000, 2, '')),
                productDescription: faker.lorem.sentences(4),
                productImageURL: faker.image.imageUrl(),
                productInventory: faker.datatype.number({ min: 1, max: 10 })
            })
        }
        const insertResult = await db.insertMany(productArray);
        return ({ success: true, data: insertResult });
    } catch (err) {
        console.error(err);
        return ({ success: false, err: err });
    }
}

app.get('/api/getProducts', (req, res) => {
    getProducts().then(result => res.send(result));
})

async function getProducts() {
    try {
        await client.connect()
        const db = client.db('Arkin-WebAppProjectPath').collection('Products');
        const products = await db.find({}).toArray();
        return ({ success: true, data: products })
    } catch (err) {
        console.error(err);
        return ({ success: false, err: err })
    }
}

app.post('/api/updateOnHand', (req, res) => {
    updateQtys(req.body.items).then(result => res.send(result));
})

async function updateQtys(itemList) {
    try {
        await client.connect()
        const db = client.db('Arkin-WebAppProjectPath').collection('Products');
        itemList.forEach(item => {
            db.updateOne({ "_id": new mongo.ObjectID(item.id) }, { "$inc": { "productInventory": (item.qty * -1) } }, (err) => {
                if (err) {
                    throw err;
                }
            })
        })
        return { success: true }
    } catch (err) {
        throw err;
    }
}