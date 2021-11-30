class Card {
    constructor(value, faceValue, suit, uniCode, faceUp, cardBack){

        this.value = value;
        this.faceValue = faceValue;
        this.suit = suit;
        this.uniCode = uniCode;
        this.faceUp = faceUp;
        this.cardBack = cardBack;

    }

    display() {
        if (this.faceUp) {
            return `${this.uniCode}`
        } else {
            return `${this.cardBack}`
        }
    }
}

class Shoe {
    constructor(deckCount, reshufflePoint) {
        this.deckCount = deckCount;
        this.reshufflePoint = reshufflePoint;
        this.cardPool = [];
        this.buildShoe();
    }

    buildShoe(){
        this.cardPool.length = 0;

        const cardBackImage = '<span class="gold">\u{1F0A0}</span>';
        const deck = [];
        const suits = ['C', 'D', 'H', 'S'];
        const faceValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
        const values = [2,3,4,5,6,7,8,9,10,10,10,10,11];

        const clubs = ['<span class="black">\u{1F0D2}</span>','<span class="black">\u{1F0D3}</span>','<span class="black">\u{1F0D4}</span>','<span class="black">\u{1F0D5}</span>','<span class="black">\u{1F0D6}</span>','<span class="black">\u{1F0D7}</span>','<span class="black">\u{1F0D8}</span>','<span class="black">\u{1F0D9}</span>','<span class="black">\u{1F0DA}</span>','<span class="black">\u{1F0DB}</span>','<span class="black">\u{1F0DD}</span>','<span class="black">\u{1F0DE}</span>','<span class="black">\u{1F0D1}</span>']
        const diamonds = ['<span class="red">\u{1F0C2}</span>','<span class="red">\u{1F0C3}</span>','<span class="red">\u{1F0C4}</span>','<span class="red">\u{1F0C5}</span>','<span class="red">\u{1F0C6}</span>','<span class="red">\u{1F0C7}</span>','<span class="red">\u{1F0C8}</span>','<span class="red">\u{1F0C9}</span>','<span class="red">\u{1F0CA}</span>','<span class="red">\u{1F0CB}</span>','<span class="red">\u{1F0CD}</span>','<span class="red">\u{1F0CE}</span>','<span class="red">\u{1F0C1}</span>']
        const hearts = ['<span class="red">\u{1F0B2}</span>','<span class="red">\u{1F0B3}</span>','<span class="red">\u{1F0B4}</span>','<span class="red">\u{1F0B5}</span>','<span class="red">\u{1F0B6}</span>','<span class="red">\u{1F0B7}</span>','<span class="red">\u{1F0B8}</span>','<span class="red">\u{1F0B9}</span>','<span class="red">\u{1F0BA}</span>','<span class="red">\u{1F0BB}</span>','<span class="red">\u{1F0BD}</span>','<span class="red">\u{1F0BE}</span>','<span class="red">\u{1F0B1}</span>']
        const spades = ['<span class="black">\u{1F0A2}</span>','<span class="black">\u{1F0A3}</span>','<span class="black">\u{1F0A4}</span>','<span class="black">\u{1F0A5}</span>','<span class="black">\u{1F0A6}</span>','<span class="black">\u{1F0A7}</span>','<span class="black">\u{1F0A8}</span>','<span class="black">\u{1F0A9}</span>','<span class="black">\u{1F0AA}</span>','<span class="black">\u{1F0AB}</span>','<span class="black">\u{1F0AD}</span>','<span class="black">\u{1F0AE}</span>','<span class="black">\u{1F0A1}</span>']
        const cardArray = [clubs, diamonds, hearts, spades];

        for (let d=0; d<this.deckCount; d++){
            for (let s=0; s<suits.length; s++) {
                for (let v=0; v<values.length; v++) {
                    const uniCode = cardArray[s][v];
                    this.cardPool.push(new Card(values[v], faceValues[v], suits[s], uniCode, true, cardBackImage));
                }
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
        return this.cards.map(c=>c.display()).join('');
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