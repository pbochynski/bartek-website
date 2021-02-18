var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1024,
    height: 600,
    physics: {
        default: 'arcade',
        debug: true
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var leftCards = [];
var rightCards = [];
var leftWar = [];
var rightWar = [];
var leftScore;
var rightScore;
var roundsText;
var rounds=0;


function preload() {
    this.load.atlas('cards', 'cards.png', 'cards.json');
}

function cardValue(name) {
    var result = name.match(/\d+/g)
    if (result && result[0])
        return parseInt(result[0])
    if (name.endsWith("Ace"))
        return 14;
    if (name.endsWith("King"))
        return 13;
    if (name.endsWith("Queen"))
        return 12;
    if (name.endsWith("Jack"))
        return 11;
    if (name == "joker")
        return 15;
    throw "Unknow card"
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function createCards(names){
    var cards = []
    names.forEach(name => {
        let c = game.scene.scenes[0].physics.add.image(500, 300, 'cards', name);
        c.cardValue = cardValue(name);
        cards.push(c)
    });
    return cards;
}

function create() {

    var frames = this.textures.get('cards').getFrameNames();
    frames.shift();
    shuffle(frames);
    shuffle(frames);
    shuffle(frames);

    leftCards = createCards(frames.slice(0,frames.length/2))
    rightCards = createCards(frames.slice(frames.length/2))
    moveCardTo(leftCards,100,100);
    moveCardTo(rightCards,900,100);
    leftCards[0].depth = 1;
    rightCards[0].depth = 1;
    leftScore = this.add.text(100, 550, leftCards.length);
    rightScore = this.add.text(900, 550, rightCards.length);
    roundsText = this.add.text(450,50,"Round: "+rounds)
    this.input.on('pointerdown', onClick);

}

function gameOver() {
    leftScore.text = leftCards.length ? "Winner" : "Loser"
    rightScore.text = rightCards.length ? "Winner" : "Loser"
}

function goToWar() {
    rounds++;
    roundsText.text="Round: "+rounds;
    if (leftCards.length == 0 || rightCards.length == 0) {
        gameOver();
        return;
    }
    var left = leftCards.shift();
    var right = rightCards.shift();

    leftWar.push(left);
    rightWar.push(right);
    var level = leftWar.length;
    left.depth = level + 1;
    right.depth = level + 1;

    if (leftCards.length) {
        leftCards[0].depth = 1;
    }
    if (rightCards.length) {
        rightCards[0].depth = 1;
    }
    moveCardTo(left, 400 - level * 40, 300);
    var action;
    if (level % 2 == 1) {
        action = fight
    } else {
        action = goToWar
    }
    moveCardTo(right, 600 + level * 40, 300, action);
}

function fight() {
    var l = leftWar[leftWar.length - 1];
    var r = rightWar[rightWar.length - 1];
    if (l.cardValue == r.cardValue) {
        goToWar();
        return;
    }
    var warCards = leftWar.concat(rightWar);
    if (l.cardValue > r.cardValue) {
        leftCards.push(...warCards);
        moveCardTo(warCards, 100, 100)
    } else {
        rightCards.push(...warCards);
        moveCardTo(warCards, 900, 100)
    } 
    warCards.forEach(c => c.depth = 0)
    leftWar.length = 0;
    rightWar.length = 0;
    leftScore.text = leftCards.length;
    rightScore.text = rightCards.length;
    goToWar();
}

function moveCardTo(card, x, y, onComplete) {
    game.scene.scenes[0].tweens.add({
        targets: card,
        x: x,
        y: y,
        ease: 'Power1',
        duration: 100,
        onComplete: onComplete
    });
}

function onClick() {
    if (leftWar.length == 0) {
        goToWar();
    }
}