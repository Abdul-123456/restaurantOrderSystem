const express = require("express");
// const session = require('express-session');
const mysql = require('mysql');
const dotenv = require('dotenv');
const { ColorNoneIcon } = require("@shopify/polaris-icons");
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const path = require("path");
const app = express();
const PORT  = process.env.PORT || 3000;

dotenv.config({path: './.env'});

db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

app.listen(PORT, () => console.log('Server running on: http://localhost:' + PORT));
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: 'false'}));
app.use(express.json());

app.get("/", (req, res) => {});

app.get("/items", async (req, res) => {
    var query = 'SELECT * FROM item;';
    
    await db.query(query, (error, results) => {
        if (error) {
            console.log(error);
        }
        else {
            res.send(results);
        }
    });
});

app.get("/incompleteorders", async (req, res) => {
    const getItemName = (query) => {
        return new Promise ((resolve, reject) => {
            db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                    return ;
                }
                else {
                    resolve(results[0].name);
                }
            });
        });
    };

    var query = "SELECT * FROM restaurant_order_system.order WHERE completed = 0;";
    await db.query(query, async (error, results) => {
        if (error) {
            console.log(error);
            return;
        }

        for (let i=0; i<results.length; i++) {
            query = "SELECT name FROM item WHERE id = " + results[i].item_id + ";";
            results[i].itemName = await getItemName(query);
        }

        res.send(results)
    });
});

app.post("/completeorder", async (req, res) => {
    var orderId = req.body["orderId"];
    var query = "UPDATE restaurant_order_system.order SET completed = 1 WHERE id = " + orderId + ";";

    await db.query(query, (error, results) => {
        if (error) {
            console.log(error);
            return;
        }

        res.status(200);
        res.send(results);
    });
});

app.post("/neworder", async (req, res) => {
    var orderType = req.body["type"];
    var itemId = req.body["itemId"];
    var quantity = req.body["quantity"];

    if (quantity.length == 0) {
        quantity = 1;
    }

    console.log("hello");
    var query = "INSERT INTO restaurant_order_system.order (type, item_id, quantity) VALUES (\'" + orderType + "\', \'" + itemId + "\', " + quantity + ");";

    await db.query(query, (error, results) => {
        if (error) {
            console.log(error);
            return error;
        }

        res.status(200);
        res.send(results);
    });
});

