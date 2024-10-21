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
    // Carica la mappa e il tileset aggiornato
    this.load.tilemapTiledJSON('map', 'assets/maps/map.json'); // Sostituisci con il percorso del tuo file JSON
    this.load.image('tiles', 'assets/tilesets/tileset3.png'); // Sostituisci con il percorso del tileset aggiornato

    // Carica lo sprite aggiornato del personaggio
    this.load.spritesheet('player', 'assets/sprites/player3.png', { frameWidth: 32, frameHeight: 48 }); // Dimensioni dello sprite
}

function create() {
    // Creazione della mappa
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset3', 'tiles'); // Nome deve corrispondere a quello del JSON
    const layer = map.createLayer('Terrain', tileset, 0, 0); // Assicurati che il nome del layer corrisponda a quello nel JSON

    // Aggiunta del personaggio
    player = this.physics.add.sprite(100, 150, 'player');

    // Anima il personaggio
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
};



