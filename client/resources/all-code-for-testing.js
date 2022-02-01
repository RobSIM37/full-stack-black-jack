//logical game constants

const deckCount = 8;
const blackJackPayout = 3/2;
const standardPayout = 2;
const playerStartingHandSize = 2;
const dealerHit = 16;
const blackJackTotal = 21;
const aceValue = 11;
const aceDelta = 10;
const shoeShuffleValue = 40;
const cardBack = '##';
const startingPlayerChipTotal = 200;
const tableMinimum = 10;
const tableMaximum = 500;

class Card {
    constructor(value, faceValue, suit, faceUp, cardBack){
        this.value = value;
        this.faceValue = faceValue;
        this.suit = suit;
        this.faceUp = faceUp;
        this.cardBack = cardBack;

    }

    display() {
        if (this.faceUp) {
            return `${this.faceValue}${this.suit}`
        } else {
            return `${this.cardBack}`
        }
    }
}

class Shoe {
    constructor(deck, deckCount, reshufflePoint) {
        this.deck = deck;
        this.deckCount = deckCount;
        this.reshufflePoint = reshufflePoint;
        this.cardPool = [];
        this.buildShoe();
    }

    buildShoe(){
        this.cardPool.length = 0;
        for (let d=0; d<this.deckCount; d++){
            for(let c=0; c<this.deck.length; c++){
                this.cardPool.push(this.deck[c]);
            }
        }
    }

    dealCard(faceDown){

        const cardIndex = Math.floor(Math.random()*this.cardPool.length)
        const card = this.cardPool.splice(cardIndex,1)[0];
        card.faceUp = !faceDown;

        return card;

    }

    checkReshuffle(){
        if (this.cardPool.length <= this.reshufflePoint) {
            this.buildShoe()
        }
    }
}

class Dealer {
    constructor(){
        this.hand = null;
        this.hasFinalHand = false;
    }

    takeCard(card){
        if (!this.hand) {
            this.hand = new Hand();
        }

        this.hand.cards.push(card)

        const handValue = this.hand.calculatedValue();
        if (handValue > dealerHit) {
            this.hasFinalHand = true
        }

        return !this.hasFinalHand;
    }

    compareHand(playerHand){
        if (this.hand.isBust()) {
            return 1;
        }
        return playerHand.calculatedValue() - this.hand.calculatedValue();
    }
}

class Player {
    constructor(chips) {
        this.chips = chips;
        this.hands = [];
        this.playingHand = 0;
        this.wager = 0;
    }

    canPlaceWager() {

        return this.chips >= this.wager;

    }

    placeWager(hand) {
        if (!hand) {
            hand = this.currentHand()
        }
        this.chips -= this.wager
        hand.wager += this.wager
    }

    takeCard(card, index) {

        if (!index) {
            index = this.playingHand;
        }

        if (!this.hands[index]) {
            this.hands.push(new Hand());
        }

        card.faceUp = true;
        this.hands[index].cards.push(card);

        return this.hands[index].cards.length !== playerStartingHandSize;

    }

    currentHand() {
        return this.hands[this.playingHand];
    }

    lastHand() {
        return this.hands[this.hands.length-1];
    }

    lastHandIndex() {
        return this.hands.length - 1;
    }

    hasPair() {
        const hand = this.currentHand();
        return hand.cards.length === playerStartingHandSize && hand.cards[0].value === hand.cards[1].value;
    }
}

class Hand {
    constructor(card) {
        this.cards = [];

        if (card){
            this.cards.push(card)
        }

        this.status = 'active';
        this.wager = 0;
    }

    updateStatus(str) {
        if (str === 'completed' || str === 'pending' || str === 'payout') {
            this.status = str;
        }
    }

    calculatedValue() {

        let aceCount = 0;
        let total = 0;

        for (let i=0; i<this.cards.length; i++){
            
            const card = this.cards[i];
            total +=card.value;
            if (card.value === aceValue) {
                aceCount++
            }

        }

        while (total > blackJackTotal && aceCount > 0) {
            aceCount--;
            total -= aceDelta
        }

        return total;

    }

    displayString(check) {
        return this.cards.map(c=>c.display()).join(' ');
    }

    isBlackJack() {
        return this.calculatedValue() === blackJackTotal && this.cards.length === 2;
    }

    isBust() {
        return this.calculatedValue() > blackJackTotal;
    }

    length() {
        return this.cards.length;
    }
}

class Table {
    constructor(minimum, maximum){
        this.minimum = minimum;
        this.maximum = maximum;
    }

    isValid(wager){
        return wager>=this.minimum && wager<=this.maximum;
    }
}

const buildDeck=()=> {

    const deck = [];
    const suits = ['C', 'H', 'D', 'S'];
    const faceValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const values = [2,3,4,5,6,7,8,9,10,10,10,10,11];

    for (let s=0; s<suits.length; s++) {
        for (let v=0; v<values.length; v++) {
            deck.push(new Card(values[v], faceValues[v], suits[s], true, cardBack));
        }
    }

    return deck;
}

const shoe = new Shoe(buildDeck(), deckCount, shoeShuffleValue);
const dealer = new Dealer();
const player = new Player(startingPlayerChipTotal);
const table = new Table(tableMinimum, tableMaximum);

// display update functions

const updateDisplay=str=> {

    switch (str) {
        case 'player chips':
            return player.chips;

        case 'dealer hand':

            let dealerTotal = '';
            if (dealer.hand.calculatedValue() > dealerHit && dealer.hand.cards[1].display() !== cardBack) {
                dealerTotal = ` : ${dealer.hand.calculatedValue()}`
            }

            return dealer.hand.displayString() + dealerTotal;

        case 'player hands':

            // for (let h=0; h<player.hands.length; h++) {
            //     const hand = player.hands[h];
            //     for (let c=0; c<hand.cards.length; c++) {
            //         const card = hand.cards[c];
            //         card.faceUp = true;
            //     }
            // }

            return player.hands;

        case 'active hand':
            return player.playingHand;
    }

}

const isDoubleButtonVisible=()=> {

    return player.canPlaceWager() && player.currentHand().length() === playerStartingHandSize;

}

const isSplitButtonVisible=()=> {

    const canWager = player.canPlaceWager()
    const hasPair = player.hasPair();
    return canWager && hasPair;

}

// independant functions

const nextActiveHand=index=> {
    for (let i=index; i<player.hands.length; i++) {
        if (player.hands[i].status === 'active') {
            return i;
        }
    }

    return -1;

}

const setHandBlackjack=hand=>{
    hand.wager *= blackJackPayout;
    hand.updateStatus('payout');
}

const setHandBust=hand=> {
    hand.wager = 0;
    hand.updateStatus('completed');
}

const setHandStand=()=> {
    player.currentHand().updateStatus('pending');
}

const progressRound=()=> {

    player.playingHand = nextActiveHand(player.playingHand);
    if (player.playingHand === -1) {
        player.playingHand = player.lastHandIndex();
        dealerShowdown();
        updateAllDisplays("Click Continue to start the next round.:Continue")
    } else {
        updateAllDisplays();
    }
}

const payOutPlayer=chips=> {
    player.chips += chips;
}

const turnDealerCardsUp=()=> {

    for (let i=0; i<dealer.hand.length(); i++) {
        dealer.hand.cards[i].faceUp = true;
    }

}

const openingDeal=()=> {
    while (player.takeCard(shoe.dealCard())) {
        dealer.takeCard(shoe.dealCard());
    }
    dealer.takeCard(shoe.dealCard(true));
}

const dealerShowdown=()=> {
    turnDealerCardsUp();

    for (let i=0; i<=player.lastHandIndex(); i++) {

        if (player.hands[i].status === 'pending') {

            const hand = player.hands[i];

            if (!dealer.hasFinalHand) {
                while (dealer.takeCard(shoe.dealCard())){}
            }
            
            const handComparison = dealer.compareHand(hand);
            if (handComparison >= 0) {
                hand.updateStatus('payout');
            }

            if (handComparison > 0) {
                hand.wager *= standardPayout;
            }

            if (handComparison < 0) {
                setHandBust(hand);
            }
        }
        
    }

}

const resetLogic=()=> {

    dealer.hand = null;
    dealer.hasFinalHand = false;
    player.hands.length = 0;
    player.playingHand = 0;
    shoe.checkReshuffle();

}

// player action functions. Validate action, complete sequence, update display

const playerEntersWager=(wagerStr)=> {

    const wager = parseInt(wagerStr);
    if (isNaN(wager)) {
        return false;
    }

    player.wager = wager;

    if (player.canPlaceWager() && table.isValid(wager)) {

        openingDeal();
        player.placeWager();
        const playerBJ = player.currentHand().isBlackJack();
        const dealerBJ = dealer.hand.isBlackJack();

        if (playerBJ || dealerBJ) {
            turnDealerCardsUp();
        }

        if (playerBJ && dealerBJ) {
            player.currentHand().updateStatus('payout');
            updateAllDisplays("Double Blackjack! This hand is a Push. Click Collect to take your chips back.:Collect");
        } else if (playerBJ){
            setHandBlackjack(player.currentHand());
            updateAllDisplays("Blackjack! Click Collect to get your winnings!:Collect!");
        } else if (dealerBJ){
            setHandBust(player.currentHand());
            updateAllDisplays("Dealer Blackjack. Better luck next time! Click Continue to start the next round.:Continue");
        } else {
            updateAllDisplays();
        }
        return true;
    } else {
        return false;
    }
}

const playerHits=()=> {

    player.takeCard(shoe.dealCard());
    if (player.currentHand().isBust()) {
        setHandBust(player.currentHand());
        progressRound();
    } else {
        updateAllDisplays();
    }
}

const playerStands=()=> {
    setHandStand();
    progressRound();
}

const playerDoublesDown=()=> {
    player.placeWager();
    player.takeCard(shoe.dealCard());
    if (player.currentHand().isBust()) {
        setHandBust(player.currentHand());
        progressRound();
    } else {
        setHandStand();
        progressRound();
    }
}

const playerSplits=()=> {

    const transferCard = player.currentHand().cards.splice(1,1)[0];
    player.takeCard(transferCard, player.lastHandIndex() + 1);
    player.takeCard(shoe.dealCard());
    player.takeCard(shoe.dealCard(), player.lastHandIndex());

    player.placeWager(player.lastHand());
    const oldHandBJ = player.currentHand().isBlackJack();
    const newHandBj = player.lastHand().isBlackJack();

    if (oldHandBJ || newHandBj) {

        if (oldHandBJ) {
            setHandBlackjack(player.currentHand());

        }

        if (newHandBj) {
            setHandBlackjack(player.lastHand());
        }

        updateAllDisplays("Blackjack! Click Collect to get your winnings!:Collect!")
    } else {
        updateAllDisplays();
    }

}

const playerContinues=()=> {

    let activeHands = false;
    for (let i=0; i<player.hands.length; i++) {
        const hand = player.hands[i]
        if (hand.status === 'payout') {
            player.chips += hand.wager;
        } else if (hand.status === 'active') {
            activeHands = true;
        }
    }

    if (activeHands) {
        player.playingHand = nextActiveHand(player.playingHand);
        updateAllDisplays();
    } else {
        resetLogic();
        resetDisplay();
    }
}

const updateAllDisplays=str=> {

    console.log('player chips =>', updateDisplay('player chips'));
    console.log('dealer hand =>', updateDisplay('dealer hand'));
    const displayHands = updateDisplay('player hands');
    console.log('player hand', displayHands[0].displayString(true), ' =>', displayHands[0].calculatedValue())
    console.log('active hand =>', updateDisplay('active hand'));

    if (displayHands[0].displayString().includes('#')) {
        console.log("HERE HERE HERE HERE!!!!!!!!!!!!!!!!!!!!!!!!")
    }

    if (str) {
        const statusMsg = str.split(':')[0];
        const btnMsg = str.split(':')[1];
        console.log(statusMsg);
        console.log(btnMsg);
    } else {
        const hitBtn = 'hit';
        const standBtn = 'stand';
        let doubleBtn = '';
        let splitBtn = '';

        if (isDoubleButtonVisible()) {
            doubleBtn = 'double'
        }

        if (isSplitButtonVisible()) {
            splitBtn = 'split'
        }

        console.log(`${hitBtn} ${standBtn} ${doubleBtn} ${splitBtn}`.trim())
    }
}

const testLoops = 1000;
const testChips = 20000;
const testWager = 10;
function test() {
    player.chips = testChips;
    for (let i=0; i<testLoops; i++){
        if (!playerEntersWager(testWager)) {
            console.log('invalid wager');
        }
        playerDoublesDown();
        resetLogic();
    }
}

test()