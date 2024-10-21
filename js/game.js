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
let debugText;

function preload() {
    this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
    this.load.image('tiles', 'assets/tilesets/tileset3.png');
    this.load.spritesheet('player', 'assets/sprites/player3.png', { 
        frameWidth: 32,  // Modifica da 16 a 32
        frameHeight: 48  // Modifica da 24 a 48
    });
}

function create() {
    // Creazione della mappa
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset3', 'tiles');
    const layer = map.createLayer('Terrain', tileset, 0, 0);

    // Creazione del player
    player = this.physics.add.sprite(400, 300, 'player');
    // Rimuovi o modifica questa linea
    // player.setScale(2);
    player.setScale(2);
    player.setCollideWorldBounds(true);

    // Creazione delle animazioni del player
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

    cursors = this.input.keyboard.createCursorKeys();

    // Testo di debug
    debugText = this.add.text(16, 16, '', { fontSize: '18px', fill: '#000' });
}

function update() {
    if (!player) return;

    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('turn');
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
        player.anims.play('turn');
    } else {
        player.anims.play('turn');
    }

    // Aggiorna il testo di debug con la posizione del player
    debugText.setText(`Player - X: ${Math.round(player.x)}, Y: ${Math.round(player.y)}`);
}