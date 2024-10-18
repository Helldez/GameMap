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
            debug: false // Cambia a true se vuoi vedere i box di collisione
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
    this.load.image('tiles', 'assets/tilesets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/maps/mappa.json');
    this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Create map
    map = this.make.tilemap({ key: 'map' });
    
    // Add tileset
    tileset = map.addTilesetImage('tileset', 'tiles');
    
    // Create layer
    layer = map.createLayer('Livello1', tileset, 0, 0);
    
    // Set world bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Create player
    player = this.physics.add.sprite(160, 160, 'player');
    player.setCollideWorldBounds(true);
    
    // Set camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player, true, 0.05, 0.05);
    this.cameras.main.setZoom(2); // Zoom in to make everything larger

    // Player animations
    this.anims.create({
        key: 'cammina',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    // Set up collision
    layer.setCollisionByExclusion([0]);
    this.physics.add.collider(player, layer);

    // Cursor keys
    cursors = this.input.keyboard.createCursorKeys();

    // Debug text
    debugText = this.add.text(10, 10, 'Debug Info', { fontSize: '8px', fill: '#ffffff' }).setScrollFactor(0);
}

function update() {
    // Player movement
    const speed = 100;
    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
        player.anims.play('cammina', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
        player.anims.play('cammina', true);
        player.flipX = false;
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-speed);
        player.anims.play('cammina', true);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(speed);
        player.anims.play('cammina', true);
    }

    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
        player.anims.stop();
    }

    // Update debug text
    debugText.setText(`
        X: ${Math.round(player.x)}
        Y: ${Math.round(player.y)}
        VX: ${Math.round(player.body.velocity.x)}
        VY: ${Math.round(player.body.velocity.y)}
        FPS: ${Math.round(this.game.loop.actualFps)}
    `);
}