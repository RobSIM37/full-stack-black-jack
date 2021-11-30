const show=elem=> {
    elem.classList.remove('hide');
}

const hide=elem=> {
    elem.classList.add('hide');
}

const clearAllDisplays=()=> {
    playerChipTotalDisplay.innerText = '';
    dealerHandDisplay.innerText = '';
}

const updatePlayerChipTotal=()=> {
    playerChipTotalDisplay.innerText = `Chip Total: $${updateDisplay('player chips')}`
}

const updateDealerCards=()=> {
    dealerHandDisplay.innerText = updateDisplay('dealer hand');
}

const updateStatusMessage=str=> {
    statusDisplay.innerText = str;
}

const updateButtonMessage=str=> {
    continueButton.innerText = str;
}

const setFocus=()=> {

    for (let i=0; i<playerHandDisplays.length; i++) {
        playerHandDisplays[i].classList.remove('focus');
    }

    playerHandDisplays[updateDisplay('active hand')].classList.add('focus');
}

const hideAllControls=()=> {

    hide(wagerInput);
    hide(submitWagerButton);
    hide(hit);
    hide(stand);
    hide(double);
    hide(split);
    hide(statusDisplay);
    hide(continueButton);
    
}

const showWagerControls=()=> {
    hideAllControls();
    show(wagerInput);
    show(submitWagerButton);
}

const showActionButtons=()=> {
    hideAllControls();
    show(hit);
    show(stand);

    if (isDoubleButtonVisible()) {
        show(double);
    }
    
    if (isSplitButtonVisible() && updateDisplay('player hands').length < 6) {
        show(split);
    }
}

const showStatusControls=()=> {
    hideAllControls();
    show(statusDisplay);
    show(continueButton);
}

const clearPlayerHand=index=> {
    playerHandDisplays[index].querySelector('.cards').innerText = '';
    playerHandDisplays[index].querySelector('.wager').innerText = '';
    playerHandDisplays[index].classList.remove('focus');
}

const clearAllPlayerHands=()=> {

    for (let i=0; i<playerHandDisplays.length; i++) {
        clearPlayerHand(i);
    }

}

const updateAllDisplays=status=> {

    clearAllDisplays();
    updatePlayerChipTotal();
    updateDealerCards();

    const playerHands = updateDisplay('player hands');

    for (let i=0; i<playerHands.length; i++) {

        if (playerHands[i]) {
            playerHandDisplays[i].querySelector('.cards').innerText = playerHands[i].displayString();
            playerHandDisplays[i].querySelector('.wager').innerText = playerHands[i].wager;
        } else {
            playerHandDisplays[i].querySelector('.cards').innerText = '';
            playerHandDisplays[i].querySelector('.wager').innerText = '';
        }

    }

    if (status) {
        const statusMessage = status.split(':')[0];
        const buttonMessage = status.split(':')[1];
        updateStatusMessage(statusMessage);
        updateButtonMessage(buttonMessage);
        showStatusControls();
    } else {
        setFocus();
        showActionButtons();
    }

}

const resetDisplay=()=> {

    updatePlayerChipTotal();
    clearAllPlayerHands();
    dealerHandDisplay.innerText = '';
    showWagerControls();

}

const continueButtonEventHandler=event=> {

    playerContinues();

}

const splitButtonEventHandler=event=> {

    playerSplits();

}

const doubleButtonEventHandler=event=> {

    playerDoublesDown();

}

const standButtonEventHandler=event=> {

    playerStands();

}

const hitButtonEventHandler=event=> {

    playerHits();

}

const wagerFormSubmitEventHandler=event=> {

    event.preventDefault();

    if (!playerEntersWager(wagerInput.value)) {

        wagerInput.value = '';
        alert(`Please enter a valid bet amount.\nIt must only contain numbers, no symbols or letters.\nIt must be between the table minimum and maximum.\nIt must be less than or equal your remaining chip total.\nIf you find yourself with too few chips to make a valid bet,\nplease reload the page and better luck next time!`)

    }
}

const initDisplay=()=> {

    tableMinimumDisplay.innerText = `Table Minimum: $${table.minimum}`;
    tableMaximumDisplay.innerText = `Table Maximum: $${table.maximum}`;
    updatePlayerChipTotal();

}

playerControlsForm.addEventListener('submit', wagerFormSubmitEventHandler);
hit.addEventListener('click', hitButtonEventHandler);
stand.addEventListener('click', standButtonEventHandler);
double.addEventListener('click', doubleButtonEventHandler);
split.addEventListener('click', splitButtonEventHandler);
continueButton.addEventListener('click', continueButtonEventHandler);

initDisplay();