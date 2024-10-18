const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    parent: 'phaser-game',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let cursors;
let player;
let map;
let tileset;
let layer;
let debugText;

function preload() {
    console.log('Preload function called');
    this.load.image('tiles', 'assets/tilesets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/maps/mappa.json');
    this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    console.log('Create function called');

    // Create map
    map = this.make.tilemap({ key: 'map' });
    console.log('Map created:', map);

    // Add tileset
    tileset = map.addTilesetImage('tileset', 'tiles');
    console.log('Tileset added:', tileset);

    // Create layer
    layer = map.createLayer('Livello1', tileset, 0, 0);
    console.log('Layer created:', layer);

    // Set collisions
    layer.setCollisionByExclusion([0]);

    // Create player
    player = this.physics.add.sprite(160, 160, 'player');
    player.setCollideWorldBounds(true);
    console.log('Player created:', player);

    // Add collision between player and layer
    this.physics.add.collider(player, layer);

    // Create animations
    this.anims.create({
        key: 'cammina',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    // Set up camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    // Create cursor keys
    cursors = this.input.keyboard.createCursorKeys();

    // Debug text
    debugText = this.add.text(10, 10, 'Debug Info', { fontSize: '16px', fill: '#ffffff' });
    debugText.setScrollFactor(0);

    // Debug rectangle
    this.add.rectangle(0, 0, 320, 320, 0x00ff00, 0.2).setOrigin(0, 0).setScrollFactor(0);

    console.log('Create function completed');
}

function update() {
    // Player movement
    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-100);
        player.anims.play('cammina', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(100);
        player.anims.play('cammina', true);
        player.flipX = false;
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-100);
        player.anims.play('cammina', true);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(100);
        player.anims.play('cammina', true);
    }

    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
        player.anims.stop();
    }

    // Update debug text
    debugText.setText(`
        Player X: ${Math.round(player.x)}
        Player Y: ${Math.round(player.y)}
        Velocity X: ${Math.round(player.body.velocity.x)}
        Velocity Y: ${Math.round(player.body.velocity.y)}
        FPS: ${Math.round(this.game.loop.actualFps)}
    `);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Runtime error:', e.message);
    console.error('Stack:', e.error.stack);
});