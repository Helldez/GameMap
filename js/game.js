// main.js

// Configurazione del gioco
const config = {
    type: Phaser.AUTO,
    width: 640,   // 20 tile * 32 pixel
    height: 480,  // 15 tile * 32 pixel
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },  // Nessuna gravità per un gioco top-down
            debug: false        // Imposta true per vedere i riquadri di collisione
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Creazione dell'istanza del gioco
const game = new Phaser.Game(config);

let player;
let cursors;
let worldLayer;

function preload() {
    // Caricamento delle risorse
    this.load.image('tiles', 'assets/tilesets/tileset4.png');
    this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
    this.load.spritesheet('player', 'assets/sprites/player4.png', {
        frameWidth: 32,
        frameHeight: 48
    });
}

function create() {
    // Creazione della mappa
    const map = this.make.tilemap({ key: 'map' });

    // Aggiunta del tileset alla mappa
    const tileset = map.addTilesetImage('tileset', 'tiles');

    // Creazione dei layer
    const worldLayer = map.createLayer('World', tileset, 0, 0);

    // Impostazione delle collisioni in base alla proprietà 'collides'
    worldLayer.setCollisionByProperty({ collides: true });

    // Creazione del player
    player = this.physics.add.sprite(100, 100, 'player', 0);

    // Impostazione delle collisioni tra il player e il mondo
    this.physics.add.collider(player, worldLayer);

    // Limiti della fotocamera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // La fotocamera segue il player
    this.cameras.main.startFollow(player);

    // Limiti del mondo fisico
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Il player non può uscire dai limiti del mondo
    player.setCollideWorldBounds(true);

    // Creazione delle animazioni del player
    this.anims.create({
        key: 'walk-down',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk-right',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk-up',
        frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1
    });

    // Input dalla tastiera
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();

    // Stop movimento precedente
    player.body.setVelocity(0);

    // Movimento orizzontale
    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
    }

    // Movimento verticale
    if (cursors.up.isDown) {
        player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(speed);
    }

    // Normalizza la velocità per evitare velocità diagonali maggiori
    player.body.velocity.normalize().scale(speed);

    // Aggiornamento delle animazioni
    if (cursors.left.isDown) {
        player.anims.play('walk-left', true);
    } else if (cursors.right.isDown) {
        player.anims.play('walk-right', true);
    } else if (cursors.up.isDown) {
        player.anims.play('walk-up', true);
    } else if (cursors.down.isDown) {
        player.anims.play('walk-down', true);
    } else {
        player.anims.stop();
    }
}
