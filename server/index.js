const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const acctCtrl = require('./account-controller');
const acctURL = '/api/account/';

// get css, js, and icon files
// app.get("/reset",()=>res.sendFile(path.join(__dirname, "client/reset.css")));
// app.get("/style",()=>res.sendFile(path.join(__dirname, "client/styles.css")));
// app.get("/disp-set",()=>res.sendFile(path.join(__dirname, "client/scripts/display/display-settings.js")));
// app.get("/disp-ctrl",()=>res.sendFile(path.join(__dirname, "client/scripts/display/display-controller.js")));
// app.get("/logic-ctrl",()=>res.sendFile(path.join(__dirname, "client/scripts/logic/black-jack-logic-controller.js")));
// app.get("/logic-model",()=>res.sendFile(path.join(__dirname, "client/scripts/logic/black-jack-model.js")));
// app.get("/logic-set",()=>res.sendFile(path.join(__dirname, "client/scripts/logic/logic-settings.js")));
// app.get("/save",()=>res.sendFile(path.join(__dirname, "client/scripts/logic/save-system.js")));
// app.get("/icon",()=>res.sendFile(path.join(__dirname, "client/resources/icon.png/")));

app.post(`${acctURL}:chips`, acctCtrl.newAccount);
app.put(`${acctURL}`, acctCtrl.saveAccount);
app.get(`${acctURL}:account`, acctCtrl.loadAccount);

// const port = process.env.PORT || 5252
const port = 5252;

app.listen(port, ()=>console.log(`Server running on ${port}`));