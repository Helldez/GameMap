const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    parent: 'phaser-game',
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

let cursors;
let player;
let map;
let tileset;
let layer;

function preload() {
    this.load.image('tiles', 'assets/tilesets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/maps/mappa.json');
    this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Crea la mappa
    map = this.make.tilemap({ key: 'map' });
    
    // Aggiungi il tileset alla mappa
    tileset = map.addTilesetImage('tileset', 'tiles');
    
    // Crea il layer
    layer = map.createLayer('Livello1', tileset, 0, 0);
    
    // Imposta le collisioni
    layer.setCollisionByExclusion([0]);

    // Crea il player
    player = this.physics.add.sprite(160, 160, 'player');
    player.setCollideWorldBounds(true);

    // Aggiungi collisione tra player e layer
    this.physics.add.collider(player, layer);

    // Crea l'animazione del player
    this.anims.create({
        key: 'cammina',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    // Imposta la camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    // Crea i controlli
    cursors = this.input.keyboard.createCursorKeys();

    // Aggiungi testo di debug
    this.debugText = this.add.text(10, 10, 'Debug Info', { fontSize: '16px', fill: '#ffffff' });
}

function update() {
    // Movimento del player
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

    // Aggiorna il testo di debug
    this.debugText.setText(`
        Player X: ${Math.round(player.x)}
        Player Y: ${Math.round(player.y)}
        Velocity X: ${Math.round(player.body.velocity.x)}
        Velocity Y: ${Math.round(player.body.velocity.y)}
    `);
}