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

            for (let h=0; h<player.hands.length; h++) {
                const hand = player.hands[h];
                for (let c=0; c<hand.cards.length; c++) {
                    const card = hand.cards[c];
                    card.faceUp = true;
                }
            }
            
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