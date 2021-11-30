const baseAcctURL = 'http://localhost:5252/api/account/';
const accountMax = 9000000000000000;
const accountMin = 1000000000000000;

const title = document.querySelector('#account-number-title');
const acctNumber = document.querySelector('#account-number');
const newBtn = document.querySelector('#open-account');
const saveBtn = document.querySelector('#save-account');
const loadBtn = document.querySelector('#load-account');

const hideAllAccountElements=()=> {

    hide(title);
    hide(acctNumber);
    hide(newBtn);
    hide(saveBtn);
    hide(loadBtn);

}

const showAccount=()=> {

    hideAllAccountElements();
    show(title);
    show(acctNumber);
    show(saveBtn);

}

const accountResponseHandler=res=> {

    const {account} = res.data;
    acctNumber.innerText = account;
    showAccount();

}

const chipsResponseHandler=res=> {
    
    const {chips} = res.data;
    player.chips = chips;
    document.querySelector('#player-chip-total').innerText = `Chip Total: $${chips}`;

}

const newCall=(chips)=> {

    axios.post(`${baseAcctURL}${chips}`)
    .then(accountResponseHandler)
    .catch(res=>alert(res.data));

}

const saveCall=body=> {

    axios.put(baseAcctURL, body)
    .then(res=>alert('Chips saved.'))
    .catch(res=>alert(res.data));

}

const loadCall=account=> {

    axios.get(`${baseAcctURL}${account}`)
    .then(chipsResponseHandler)
    .catch(res=>alert(res.data));
    
}

const isValidAccountNumberFormat=acct=>{

    let valid = true;

    valid = valid && !isNaN(acct)
    valid = valid && acct >= accountMin
    valid = valid && acct < accountMax

    return valid;

}
const newBtnEventHandler=event=> {

    newCall(player.chips);

}

const saveBtnEventHandler=event=> {

    const account = parseInt(acctNumber.innerText);
    const chips = player.chips;

    saveCall({account, chips});

}

const loadBtnEventHandler=event=> {

    const enteredAccount = prompt("Please enter your Account Number");
    const account = parseInt(enteredAccount);

    if (isValidAccountNumberFormat(account)) {
        loadCall(account);
    } else {
        alert("Please enter a valid Accout Number. \nIt must only contain numbers and must be 16 digits long.");
    }

}

newBtn.addEventListener('click', newBtnEventHandler);
saveBtn.addEventListener('click', saveBtnEventHandler);
loadBtn.addEventListener('click', loadBtnEventHandler);