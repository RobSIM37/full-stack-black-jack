const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("client"))

const acctCtrl = require('./account-controller');
const acctURL = '/api/account/';

app.get("/", (req, res)=> res.sendFile(path.join(__dirname, "client/index.html")));

app.post(`${acctURL}:chips`, acctCtrl.newAccount);
app.put(`${acctURL}`, acctCtrl.saveAccount);
app.get(`${acctURL}:account`, acctCtrl.loadAccount);

const port = process.env.PORT || 5252

app.listen(port, ()=>console.log(`Server running on ${port}`));