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
    // Carichiamo la mappa predefinita e il tileset di Phaser
    this.load.tilemapTiledJSON('map', 'https://labs.phaser.io/assets/tilemaps/maps/simple-map.json');
    this.load.image('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/tileset.png');
    
    // Carichiamo un personaggio predefinito di Phaser
    this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Creiamo la mappa
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tiles');
    const layer = map.createLayer('Tile Layer 1', tileset, 0, 0);

    // Aggiungiamo il personaggio
    player = this.physics.add.sprite(100, 150, 'dude');

    // Anima il personaggio
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Imposta i controlli della tastiera
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Resetta la velocità
    player.setVelocity(0);

    // Controlla l'input e muovi il personaggio
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('turn');
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(160);
        player.anims.play('turn');
    } else {
        player.anims.play('turn');
    }
}