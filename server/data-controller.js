const accountMax = 9000000000000000;
const accountMin = 1000000000000000;
const timeOutMax = 99;
const accounts = [];

const randomAccountNumber=()=> {
    return Math.floor(Math.random() * (accountMax - accountMin)) + accountMin;
}

const isUniqueAccoutNumber=acct=> {
    return accountIndex(acct) === -1;
}

const isValidAccountNumber=acct=> {
    return acct >=accountMin && acct <=accountMax
}

const accountIndex=acct=> {
    for (let i=0; i<accounts.length; i++) {
        if (accounts[i].account === acct) {
            return i;
        }
    }

    return -1;
}

module.exports = {

    new(chips) {

        let newAcct = 0;
        let timeOut = 0;

        do {

            newAcct = randomAccountNumber();
            timeOut++

        } while ((!isUniqueAccoutNumber(newAcct) || !isValidAccountNumber(newAcct)) && timeOut <= timeOutMax);

        if (timeOut <= timeOutMax) {
            accounts.push({account: newAcct, chips});
            return newAcct;
        } else {
            return false;
        }
    },

    save(account, chips) {

        if (accounts[accountIndex(account)]) {

            accounts[accountIndex(account)].chips = chips;
            return true;

        }
        
        return false;
    },

    load(account) {

        if (!isUniqueAccoutNumber(account)) {

            return accounts[accountIndex(account)].chips;

        }

        return false;

    }

}