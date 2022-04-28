// Project Path Assignment : MongoDB & Webapps
// Authentication Module
// Nate Arkin

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb')
const client = new MongoClient('mongodb://localhost');
const path = require('path');
const bodyParser = require('body-parser')

const app = module.exports = express();
app.use(bodyParser.json())

app.post('/register', (req, res) => {
    registerUser(req.body.userID).then(result => res.send(result));
})

async function registerUser(username) {
    try {
        await client.connect()
        const db = client.db('Arkin-WebAppProjectPath').collection('Users');
        const preRegistrationCheck = await db.find({ userID: username }).toArray();
        if (preRegistrationCheck.length === 0) {
            const addResult = await db.insertOne({ userID: username })
            if (addResult.acknowledged) {
                return { success: true }
            }
        } else {
            return { success: false, err: 'A user with this username already exists.' }
        }
    } catch (err) {
        return { success: false, err: err }
    }
}

app.post('/authUser', (req, res) => {
    checkUserID(req.body.userID).then(result => res.send(result));
})

async function checkUserID(username) {
    try {
        await client.connect();
        const db = client.db('Arkin-WebAppProjectPath').collection('Users');
        const usernameCheck = await db.find({ userID: username }).toArray();
        if (usernameCheck.length === 1) {
            return { success: true }
        } else {
            return { success: false, err: 'username does not exist' }
        }
    } catch (err) {
        return { success: false, err: err }
    }
}