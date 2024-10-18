const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;

function preload() {
    // Load a Phaser 3 compatible tilemap and tileset image
    this.load.tilemapTiledJSON('map', 'https://labs.phaser.io/assets/tilemaps/maps/simple-map.json');
    this.load.image('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/simple_tileset.png');

    // Load a Phaser 3 compatible player sprite
    this.load.spritesheet('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Create the map
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('simple_tileset', 'tiles');
    const layer = map.createLayer('background', tileset, 0, 0);

    // Add the player sprite
    player = this.physics.add.sprite(100, 150, 'player');

    // Set up player animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Set up keyboard controls
    cursors = this.input.keyboard.createCursorKeys();

    // Set camera to follow the player
    this.cameras.main.startFollow(player);
}

function update() {
    // Reset player velocity
    player.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }

    // Vertical movement
    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    }

    // If no movement, play idle animation
    if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
        player.anims.play('turn');
    }
}
