const config = {
    type: Phaser.AUTO,
    width: 336,
    height: 672,
    pixelArt: true,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let map;
let groundLayer;
let objectLayer;
let debugText;

function preload() {
    console.log('Preload started');
    this.load.tilemapTiledXML('map', 'assets/maps/map1.tmx');
    this.load.image('tiles', 'assets/tilesets/grass_biome.png');
    this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
    console.log('Preload completed');
}

function create() {
    console.log('Create function started');

    // Create debug text
    debugText = this.add.text(10, 10, 'Debug Info', { fontSize: '16px', fill: '#ffffff' });

    try {
        // Create map
        map = this.make.tilemap({ key: 'map' });
        console.log('Map created:', map);

        // Add tileset
        const tileset = map.addTilesetImage('grass_biome', 'tiles');
        console.log('Tileset added:', tileset);

        // Create layers
        groundLayer = map.createLayer('Kachelebene 1', tileset, 0, 0);
        objectLayer = map.createLayer('Tile Layer 2', tileset, 0, 0);
        console.log('Layers created:', groundLayer, objectLayer);

        // Set collisions (adjust as needed)
        groundLayer.setCollisionByProperty({ collides: true });

        // Create player
        player = this.physics.add.sprite(100, 100, 'player');
        player.setCollideWorldBounds(true);
        console.log('Player created:', player);

        // Add collision between player and groundLayer
        this.physics.add.collider(player, groundLayer);

        // Create player animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Set up camera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player);

        // Set up controls
        cursors = this.input.keyboard.createCursorKeys();

        console.log('Create function completed successfully');
    } catch (error) {
        console.error('Error in create function:', error);
        debugText.setText('Error: ' + error.message);
    }

    // Add a simple shape for debug
    this.add.rectangle(168, 336, 50, 50, 0xff0000);
}

function update() {
    if (!player) return;

    const speed = 100;
    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
        player.anims.play('walk', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
        player.anims.play('walk', true);
        player.flipX = false;
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-speed);
        player.anims.play('walk', true);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(speed);
        player.anims.play('walk', true);
    }

    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
        player.anims.stop();
    }

    // Update debug text
    debugText.setText(`
        Player X: ${Math.round(player.x)}
        Player Y: ${Math.round(player.y)}
        FPS: ${Math.round(this.game.loop.actualFps)}
    `);
}