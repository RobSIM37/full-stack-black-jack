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

    displayString() {
        return this.cards.map(c=>c.display()).join(' ');;
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