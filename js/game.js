const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    parent: null,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true  // Imposta a true per vedere i confini di collisione
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
    this.load.tilemapTiledJSON('map', 'assets/maps/mappa.json');
    this.load.image('tiles', 'assets/tilesets/tileset.png');
    this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    map = this.make.tilemap({ key: 'map' });
    tileset = map.addTilesetImage('tileset', 'tiles');
    layer = map.createLayer('Livello1', tileset, 0, 0);
    
    layer.setCollisionByExclusion([0]);  // Imposta collisione per tutti i tile tranne 0

    player = this.physics.add.sprite(48, 48, 'player');
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
}
