const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true // Abilita il debug
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
    console.log('Preload function started');
    this.load.on('complete', () => console.log('All assets loaded'));

    // Carica la mappa e il tileset
    this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
    this.load.image('tiles', 'assets/tilesets/tileset3.png');
    
    // Carica lo sprite del personaggio
    this.load.spritesheet('player', 'assets/sprites/player3.png', { 
        frameWidth: 16, 
        frameHeight: 24 
    });
}

function create() {
    console.log('Create function started');

    // Creazione della mappa
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset3', 'tiles');
    const layer = map.createLayer('Terrain', tileset, 0, 0);

    // Aggiunta del personaggio
    player = this.physics.add.sprite(100, 150, 'player');
    player.setScale(2); // Scala il player per compensare le dimensioni ridotte

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

    // Aggiungi collisione con i bordi del mondo
    player.setCollideWorldBounds(true);
}

function update() {
    // Resetta la velocità
    player.setVelocity(0);

    // Controlla l'input e muovi il personaggio
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
}