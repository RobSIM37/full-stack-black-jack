const data = require('./data-controller');

module.exports = {

    newAccount: (req, res)=> {
        const {chips} = req.params;
        const account = data.new(chips);

        if (account) {
            res.status(200).send({account});
        } else {
            res.status(400).send(`Timeout while making new account.`);
        }

    },

    saveAccount: (req, res)=> {

        const {account, chips} = req.body;
        if (data.save(account, chips)) {
            res.sendStatus(200);
        } else {
            res.status(400).send('Unable to save. That appears to be an invalid account number.');
        }

    },

    loadAccount: (req, res)=> {

        const {account} = req.params;

        const chips = parseInt(data.load(parseInt(account)));
        if (chips) {
            res.status(200).send({chips});
        } else {
            res.status(400).send('Unable to load. That appears to be an invalid account number.');
        }
    }
}