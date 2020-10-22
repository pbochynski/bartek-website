var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 576,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 } }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var map;
var cursors;
var debugGraphics;
var text;
var player;
var showDebug = false;
var groundLayer;
var coinLayer;
var coinsCollected = 0;

function preload ()
{
    this.load.image('ground_1x1', 'assets/ground_1x1.png');
    this.load.spritesheet('coin', 'assets/coin.png', { frameWidth: 32, frameHeight: 32 });
    this.load.tilemapTiledJSON('map', 'assets/bartek-map.json');
    this.load.image('player', 'assets/phaser-dude.png');
}

function create ()
{
    map = this.make.tilemap({ key: 'map' });
    var groundTiles = map.addTilesetImage('ground_1x1');
    var coinTiles = map.addTilesetImage('coin');

    map.createDynamicLayer('Background Layer', groundTiles, 0, 0);
    groundLayer = map.createDynamicLayer('Ground Layer', groundTiles, 0, 0);
    coinLayer = map.createDynamicLayer('Coin Layer', coinTiles, 0, 0);

    groundLayer.setCollisionBetween(1, 25);

    // This will set Tile ID 26 (the coin tile) to call the function "hitCoin" when collided with
    coinLayer.setTileIndexCallback(26, hitCoin, this);
    

    player = this.physics.add.sprite(80, 70, 'player')
        .setBounce(0.1);
    
    // We want the player to physically collide with the ground, but the coin layer should only
    // trigger an overlap so that collection a coin doesn'td kill player movement.
    this.physics.add.collider(player, groundLayer);
    this.physics.add.overlap(player, coinLayer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    debugGraphics = this.add.graphics();

   this.input.keyboard.on('keydown_S', function (event)
    {
        player.body.allowGravity= !player.body.allowGravity;
        updateText()
    });

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(16, 16, '', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    text.setScrollFactor(0);
    updateText();
}

function hitCoin (sprite, tile)
{
    coinLayer.removeTileAt(tile.x, tile.y);

    coinsCollected += 1;
    console.log(coinLayer);
    updateText();

    // Return true to exit processing collision of this tile vs the sprite - in this case, it
    // doesn't matter since the coin tiles are not set to collide.
    return false;
}


function update (time, delta)
{
    // Horizontal movement
    player.body.setVelocityX(0);
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200);
    }
    // Jumping
    if ((cursors.space.isDown || cursors.up.isDown) && (player.body.onFloor() || player.body.allowGravity==false))
    {
        player.body.setVelocityY(-300);
    }
    if (cursors.down.isDown){
        player.body.setVelocityY(300);
    }
}


function updateText ()
{
    text.setText(
        'Coins collected: ' + coinsCollected +
        '\nGravity: '+player.body.allowGravity
    );
}
