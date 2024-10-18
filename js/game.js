const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
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

function preload() {
    console.log('Preload function called');
    this.load.tilemapTiledJSON('map', 'assets/maps/mappa.json');
    this.load.image('tiles', 'assets/tilesets/tileset.png');
    this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    console.log('Create function called');

    console.log('Tileset loaded:', this.textures.exists('tiles'));
    console.log('Player sprite loaded:', this.textures.exists('player'));

    map = this.make.tilemap({ key: 'map' });
    console.log('Map created:', map);
    console.log('Map dimensions:', map.width, 'x', map.height, 'tiles');
    console.log('Tile dimensions:', map.tileWidth, 'x', map.tileHeight, 'pixels');

    tileset = map.addTilesetImage('tileset', 'tiles');
    console.log('Tileset added:', tileset);

    layer = map.createLayer('Livello1', tileset, 0, 0);
    console.log('Layer created:', layer);

    layer.setCollisionByExclusion([0]);

    player = this.physics.add.sprite(160, 160, 'player');
    console.log('Player created:', player);

    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, layer);

    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'cammina',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    this.debugText = this.add.text(10, 10, 'Debug Info', { fontSize: '16px', fill: '#ffffff' });

    console.log('Canvas size:', this.sys.game.canvas.width, 'x', this.sys.game.canvas.height);

    this.add.rectangle(0, 0, 320, 320, 0x00ff00, 0.3).setOrigin(0, 0);
    this.add.text(10, 290, 'Game Loaded', { fill: '#ffffff' });
}

function update() {
    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-100);
        player.anims.play('cammina', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(100);
        player.anims.play('cammina', true);
        player.flipX = false;
    } else if (cursors.up.isDown) {
        player.body.setVelocityY(-100);
        player.anims.play('cammina', true);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(100);
        player.anims.play('cammina', true);
    } else {
        player.anims.stop();
    }

    this.debugText.setText(`
        Player X: ${Math.round(player.x)}
        Player Y: ${Math.round(player.y)}
        Velocity X: ${Math.round(player.body.velocity.x)}
        Velocity Y: ${Math.round(player.body.velocity.y)}
    `);
}