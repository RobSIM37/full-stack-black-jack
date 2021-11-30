//Player Account Code:

//Black Jack Game Play Code:

const resetTable=()=>{ //hide secondary hands, clear cards from primary hand and dealer hand, unlock player wager form

    for (let i=0; i<playerCards.length; i++) {
        playerCards[i].cards.length=0;
        playerCards[i].active = false

        const resetHand = findHand(i);
        hideAllButtons(resetHand);
        updateCardDisplay(resetHand.querySelector('p'), []);

        if (resetHand.classList.contains('active')) {
            toggleHandActivation(resetHand);
        }

    }

    dealerCards.length=0;
    updateCardDisplay(dealerCardsHolder, dealerCards);

    if (shoe.length <= shoeShuffleValue) {
        shoe = buildShoe(buildDeck(),deckCount)
    }

    setCurrentHand(0);
    lockUnlockPlayerWager(currentHand);
    toggleHandActivation(currentHand);

}

const gatherWinnings=()=>{ //increase the players total chips the ammount of the winnings

    for (let i=0; i<playerCards.length; i++) {
        if (playerCards[i].active) {
            
            const checkHand = findHand(i);
            const wagerValue = getNumber(checkHand.querySelector('.hand-controls>p'))

            if (!isNaN(wagerValue)) {

                const playerChipValue = getNumber(playerChipTotal.innerText);
                playerChipTotal.innerText = `Chip Total: $${playerChipValue + wagerValue}`

            }
        }
    }
}

const totalCardsValue=cards=> {

    let aceCount = 0;
    let total = 0;

    for (let i=0; i<cards.length; i++) {
        if (cards[i].value === 11) {
            aceCount++;
        }

        total += cards[i].value;

        if (total > blackJackTotal && aceCount > 0){
            aceCount--;
            total -= 10;
        }
    }

    if (total > blackJackTotal) {
        total = 0;
    }

    return total;

}

const compareHands=(player, dealer)=>{ //check to see if a hand wins or loses
    
    const pValue = totalCardsValue(player);
    const dValue = totalCardsValue(dealer);

    return pValue - dValue;

}

const resolveRound=(gameOver)=>{ //checks all live hands against dealer cards, gathers winnings, checks shoe for shuffle, resets the board.

    if (!gameOver) {

        let playerWins = false;
        let dealerWins = false;

        for (i=0; i<playerHands.length; i++) {

            const checkHand = findHand(i);
            const wagerValue = getNumber(checkHand.querySelector('.hand-controls>p').innerText);

            if (!isNaN(wagerValue) && wagerValue !== 0 && playerCards[i].active) {

                if (compareHands(playerCards[i].cards, dealerCards) > 0) {
                    playerWins = true;
                    setHandPayout(checkHand, standardPayout);
                } else if (compareHands(playerCards[i].cards, dealerCards) < 0){
                    dealerWins = true;
                    setHandPayout(checkHand, 0);
                }

            }

        }

        if (playerWins && dealerWins) {
            gameStatus.innerText = "You win some, you lose some. Click here for the next hand.";
        } else if (playerWins) {
            gameStatus.innerText = "Looks like you are getting some chips back! Click here for the next hand.";
        } else if (dealerWins) {
            gameStatus.innerText = "The House wins. Click here for the next hand.";
        } else {
            gameStatus.innerText = "Push. Click here for the next hand.";
        }
    }

    gameStatus.classList.toggle('hide');

}

const dealerSequence=()=>{ // dealer draws until they have 17 or are busted

    updateCardDisplay(dealerCardsHolder, dealerCards, false);

    let aceCount = 0
    let total = calculateHandTotal(dealerCards);

    while (total < 17) {

        dealCard(dealerCards);
        updateCardDisplay(dealerCardsHolder, dealerCards, false);

        if (dealerCards[dealerCards.length-1].value === 11) {
            aceCount++;
        }

        total += dealerCards[dealerCards.length-1].value;

        if (total > 21 && aceCount > 0) {
            total -= 10;
            aceCount--;
        }

    }
}

const calculateHandTotal=cards=>{

    let aceCount = 0;
    let handTotal = 0;

    cards.forEach(card=>{
        if (card.value === aceValue) {
            aceCount++;
        }
        handTotal += card.value;
    })

    while (handTotal > blackJackTotal && aceCount > 0) {
        aceCount--
        handTotal -= aceDelta;
    }

    return handTotal;

}

const findNextActiveHand=currentHand=>{

    const currentId = currentHand.id;
    let checkIndex = parseInt(currentId)+1;

    while (playerCards[checkIndex].active === false && getNumber(findHand(checkIndex).querySelector('.hand-controls>p')) === originalWager && checkIndex<parseInt(lastHandId)) {
        checkIndex++
    }

    if (playerCards[checkIndex].active) {
        return findHand(checkIndex)
    } else {
        return null
    }

}

const findNextAvailableHand=currentHand=>{

    const currentId = currentHand.id;
    let checkIndex = parseInt(currentId)+1;

    while (playerCards[checkIndex].active === true && checkIndex<parseInt(lastHandId)) {
        
        checkIndex++

        
    }

    if (!playerCards[checkIndex].active) {
        return findHand(checkIndex)
    } else {
        return null
    }
}

const splitButtonClickEventHandler=event=>{ //handles clicking the split button

    let hand = event.target.parentNode;
    while (hand.querySelector('.cards') === null) {
        hand = hand.parentNode;
    }

    const newHand = findNextAvailableHand(hand);
    toggleHandActivation(newHand);

    const wagerDisplay = hand.querySelector(".hand-controls>p");
    const currentWager = getNumber(wagerDisplay.innerText);
    const currentChipTotal = getNumber(playerChipTotal.innerText);

    playerChipTotal.innerText = `Chip Total: $${currentChipTotal-currentWager}`

    const oldHandCards = playerCards[parseInt(hand.id)].cards;
    const newHandCards = playerCards[parseInt(newHand.id)].cards;

    const oldHandCardsHolder = hand.querySelector('.cards');
    const newHandCardsHolder = newHand.querySelector('.cards');

    const transferCard = oldHandCards.splice(1,1)[0];
    newHandCards.push(transferCard);

    dealCard(oldHandCards);
    updateCardDisplay(oldHandCardsHolder, oldHandCards, false);

    dealCard(newHandCards);
    updateCardDisplay(newHandCardsHolder, newHandCards, false);
    if (oldHandCards[0].value !== oldHandCards[1].value || currentChipTotal < currentWager || hand.id === lastHandId) {
        toggleButtonDisp(event.target);
    }

    if (isBlackJack(newHandCards)) {
        hideAllButtons(event.target.parentNode)
        setHandPayout(newHand, blackJackPayout)
    }

    if (isBlackJack(oldHandCards)) {
        setHandPayout(hand, blackJackPayout)

        const nextActiveHand = findNextActiveHand(hand);

        if (!(nextActiveHand===null)) {
            setCurrentHand(nextActiveHand.id)
            setButtonsDisplay(currentHand, playerCards[parseInt(currentHand.id)].cards)
        } else {
            dealerSequence();
            resolveRound();
        }
    }

}

const doubleButtonClickEventHandler=event=>{ //handles clicking the double down button

    hideAllButtons(event.target.parentNode);
    let hand = event.target.parentNode;
    while (hand.querySelector('.cards') === null) {
        hand = hand.parentNode;
    }

    const wagerDisplay = hand.querySelector(".hand-controls>p");
    const currentWager = getNumber(wagerDisplay.innerText);
    const currentChipTotal = getNumber(playerChipTotal.innerText);

    playerChipTotal.innerText = `Chip Total: $${currentChipTotal-currentWager}`
    wagerDisplay.innerText = `$${currentWager * 2}`

    const cards = playerCards[parseInt(hand.id)].cards;
    const cardsDisplay = hand.querySelector('.cards');

    dealCard(cards);
    updateCardDisplay(cardsDisplay, cards, false);

    const nextActiveHand = findNextActiveHand(hand);

    if (calculateHandTotal(cards) > blackJackTotal){
        setHandPayout(hand, 0) // player busts
    }

    if (!(nextActiveHand===null)) {
        setCurrentHand(nextActiveHand.id)
        setButtonsDisplay(currentHand, playerCards[parseInt(currentHand.id)].cards)
    } else {
        dealerSequence();
        resolveRound();
    }

}

const standButtonClickEventHandler=event=>{ //handles clicking the stand button

    let hand = event.target.parentNode;
    while (hand.querySelector('.cards') === null) {
        hand = hand.parentNode;
    }

    hideAllButtons(event.target.parentNode);
    const nextActiveHand = findNextActiveHand(hand);
    if (!(nextActiveHand===null)) {
        setCurrentHand(nextActiveHand.id)
        setButtonsDisplay(currentHand, playerCards[parseInt(currentHand.id)].cards)
    } else {
        dealerSequence();
        resolveRound();
    }

}

const hitButtonClickEventHandler=event=>{ //handles clicking the hit button

    let hand = event.target.parentNode;
    while (hand.querySelector('.cards') === null) {
        hand = hand.parentNode;
    }

    const doubleButton = event.target.parentNode.querySelector('.double');
    const splitButton = event.target.parentNode.querySelector('.split');

    hideButton(doubleButton);
    hideButton(splitButton);

    const cards = playerCards[parseInt(hand.id)].cards;
    const cardsDisplay = hand.querySelector('.cards');

    dealCard(cards);
    updateCardDisplay(cardsDisplay, cards, false);

    const nextActiveHand = findNextActiveHand(hand);

    if (calculateHandTotal(cards) > blackJackTotal){
        hideAllButtons(event.target.parentNode);
        setHandPayout(hand, 0) // player busts
        
        if (!(nextActiveHand===null)) {
            setCurrentHand(nextActiveHand.id)
            setButtonsDisplay(currentHand, playerCards[parseInt(currentHand.id)].cards)
        } else {
            resolveRound();
        }
    }
}

const hideAllButtons=arr=>{
    Array.from(arr.querySelectorAll('button')).forEach(btn=>hideButton(btn))
}

const hideButton=btn=>{

    if (!btn.classList.contains('hide')) {
        toggleButtonDisp(btn);
    }
}

const toggleButtonDisp=btn=>{ //sets the visibility of a single button
    btn.classList.toggle('hide')
}

const setButtonsDisplay=(hand, cards)=>{ //sets the buttons of a hand as visible or invisible

    const hit = hand.querySelector('.hit');
    const stand = hand.querySelector('.stand');
    const double = hand.querySelector('.double');
    const split = hand.querySelector('.split');

    toggleButtonDisp(hit);
    toggleButtonDisp(stand);

    const remainingChipTotal = getNumber(playerChipTotal.innerText);
    const currentWager = getNumber(hand.querySelector('.hand-controls>p').innerText)

    if (remainingChipTotal >= currentWager) {
        toggleButtonDisp(double);
    }

    if (cards[0].value === cards[1].value && remainingChipTotal >= currentWager && hand.id != lastHandId) {
        toggleButtonDisp(split);
    }
}

const setHandPayout=(hand, delta)=>{ //sets payout ammount for a hand

    const wagerArea = hand.querySelector('.hand-controls>p');
    const initialWager = getNumber(wagerArea.innerText);
    
    if (delta === blackJackPayout) {

        const initialChips = getNumber(playerChipTotal.innerText);
        playerChipTotal.innerText = `Chip Total: $${initialChips + (initialWager * delta)}`
        wagerArea = 'Black Jack!'

    } else {

        wagerArea.innerText = `$${initialWager * delta}`

    }

}

const isBlackJack=(cards)=>{ //checks for Black Jack

    return (cards[0].value + cards[1].value) === blackJackTotal;

}

const isOpeningDealBlackJack=(dealerCards, playerCards)=>{ //checks if opening deal produced Black Jacks
    const dealerBJ = isBlackJack(dealerCards);
    const playerBJ = isBlackJack(playerCards);

    if (dealerBJ && playerBJ) {
        updateCardDisplay(dealerCardsHolder, dealerCards, false);
        gameStatus.innerText = "Double Black Jack! This hand is a Push. Click here for the next hand.";
        resolveRound(true);
        return true;
    } else if (playerBJ) {
        setHandPayout(currentHand,blackJackPayout);
        gameStatus.innerText = "Black Jack! You Win!! Click here to collect your winnings!";
        resolveRound(true);
        return true;
    } else if (dealerBJ) {
        setHandPayout(currentHand,0);
        updateCardDisplay(dealerCardsHolder, dealerCards, false);
        gameStatus.innerText = "The Dealer has a Black Jack! Better luck next time! Click here for the next hand.";
        resolveRound(true);
        return true;
    }

    return false;

}

const updateCardDisplay=(cardsHolder, cardsArr, hidden)=>{ //draws cards to screen

    let buildText = ''
    for (let i=0; i<cardsArr.length; i++) {
        if (hidden && i===cardsArr.length - 1) {
            buildText += ' ' + hiddenCard;
        } else {
            if (buildText === '') {
                buildText += cardsArr[i].display;
            } else {
                buildText += ' ' + cardsArr[i].display;
            }
        }
    }

    cardsHolder.innerText = buildText;

}

const dealCard=(arr)=>{ //deals a card

    const cardIndex = Math.floor(Math.random()*shoe.length);
    const card = shoe.splice(cardIndex,1)[0];
    arr.push(card);

}

const openingDeal=()=>{ //deals cards to player and dealer

    const playerCardsHolder = currentHand.querySelector('p');

    for (let d=1; d<=2; d++){
        
        dealCard(playerCards[0].cards);
        updateCardDisplay(playerCardsHolder, playerCards[0].cards);

        dealCard(dealerCards);
        updateCardDisplay(dealerCardsHolder, dealerCards, (d===2));

    }

}

const lockUnlockPlayerWager=hand=>{ //prevents player from changing wager during play
    const handControls = hand.querySelector('.hand-controls');
    const betForm = handControls.querySelector('.hand-wager');
    betForm.classList.toggle('hide');
    betForm.querySelector('button').classList.toggle('hide');
    const wager = handControls.querySelector('p');
    wager.classList.toggle('hide');
}

function getNumber(str) { // pulls the numner value out of a string

    let result = ''

    for (let i=0; i<str.length; i++){
        if (!isNaN(str[i])){
            result += str[i];
        } 
    }

    return parseInt(result);

}

const isValidPlayerWager=bet=> { //checks the players wager against the table min, table max, and player chip total
    let valid = true;
    valid = valid && !isNaN(bet);
    valid = valid && bet >= getNumber(tableMinimum.innerText);
    valid = valid && bet <= getNumber(tableMaximum.innerText);
    valid = valid && bet <= getNumber(playerChipTotal.innerText);

    return valid;
}

const propagateWager=(bet)=>{

    for (let h=0; h<playerHands.length; h++) {
        const wagerDisplay = playerHands[h].querySelector('.hand-controls>p');
        wagerDisplay.innerText = `$${bet}`;
    }

}

const playerWagerSubmitHandler=event=>{ //handles the player wager submission

    event.preventDefault()

    const textBox = event.target.querySelector('#wager');
    const wagerValue = parseInt(textBox.value);

    if (isValidPlayerWager(wagerValue)){
        originalWager = wagerValue;
        propagateWager(wagerValue);
        lockUnlockPlayerWager(currentHand);
        const initialChips = getNumber(playerChipTotal.innerText);
        playerChipTotal.innerText = `Chip Total: $${initialChips-wagerValue}`;
        openingDeal();
        if (!isOpeningDealBlackJack(dealerCards, playerCards[0].cards)) {
            setButtonsDisplay(currentHand, playerCards[0].cards);
        }
    } else {
        alert(`Please enter a valid bet amount.\nIt must contain numbers, no symbols or letters.\nIt must be between the table minimum and maximum.\nIt must be less than or equal you remaining chip total.\nIf you find yourself with too few chips to make a valid bet,\nplease reload the page and better luck next time!`)
    }

}

const setCurrentHand=id=>{ //determines the current player hand

    currentHand = findHand(id);

}

const toggleHandActivation=(hand)=>{ //sets a hand active or not (visible)

    hand.classList.toggle('active');
    const currentIndex = parseInt(hand.id);

    playerCards[currentIndex].active = !playerCards[currentIndex].active;

    if (hand.id === `0`) {
        const wagerForm = hand.querySelector('form');
        wagerForm.addEventListener('submit', playerWagerSubmitHandler);
        wagerForm.classList.toggle('hide');
    } else {
        const wagerDisplay = hand.querySelector('.hand-controls>p')
        wagerDisplay.classList.toggle('hide');
    }

}

const gameStatusClickEventHandler=(event)=>{ //gather winnings, reset table

    gameStatus.classList.toggle('hide');
    gatherWinnings();
    resetTable();

}

const findHand=(handId)=>{

    for (let h=0; h<playerHands.length; h++) {

        if (playerHands[h].id === `${handId}`) {
            return playerHands[h];
        }

    }

}

const initGame=()=>{

    gameStatus.addEventListener('click', gameStatusClickEventHandler);
    

    const hitButtons = Array.from(document.querySelectorAll('.hit'));
    const standButtons = Array.from(document.querySelectorAll('.stand'));
    const doubleButtons = Array.from(document.querySelectorAll('.double'));
    const splitButtons = Array.from(document.querySelectorAll('.split'));

    for (let i=0; i<hitButtons.length; i++) {
        hitButtons[i].addEventListener('click', hitButtonClickEventHandler);
        standButtons[i].addEventListener('click', standButtonClickEventHandler);
        doubleButtons[i].addEventListener('click', doubleButtonClickEventHandler);
        splitButtons[i].addEventListener('click', splitButtonClickEventHandler);

        playerCards.push({cards: [], active: false})
    }

    setCurrentHand(0);
    toggleHandActivation(currentHand);
}

const buildShoe=(deck, count)=>{ //build a shoe of cards

    const shoe = [];
    for (let i=0; i<count; i++) {
        for (let j=0; j<deck.length; j++) {
            shoe.push(deck[j]);
        }
        
    }
    return shoe;
}

const buildDeck=()=>{ //build a single deck of cards
    const deck = [];
    const suits = ['C', 'D', 'H', 'S'];
    const faceValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const values = [2,3,4,5,6,7,8,9,10,10,10,10,11];
    for (suit = 0; suit<suits.length; suit++){
        for (value = 0; value<faceValues.length; value++){

            deck.push({value: values[value], display: faceValues[value]+suits[suit]});

        }
    }

    return deck;
}

const deckCount = 8;
const blackJackPayout = 3/2;
const standardPayout = 2;
const dealerHit = 16;
const blackJackTotal = 21;
const aceValue = 11;
const aceDelta = 10;
const fiveCardCharlieLength = 5;
const shoeShuffleValue = 40;
const hiddenCard = '##'
let shoe = buildShoe(buildDeck(), deckCount);
const dealerCards = [];
const playerCards = [];
const dealerCardsHolder = document.querySelector('#dealer-area>.cards');
const playerHands = Array.from(document.querySelectorAll('.player-hand'));
const lastHandId = '5';
const gameStatus = document.querySelector('#game-status');
const playerChipTotal = document.querySelector('#player-chip-total');
const tableMinimum = document.querySelector('#table-minimum');
const tableMaximum = document.querySelector('#table-maximum');
let currentHand = null;
let originalWager = 0;

initGame();