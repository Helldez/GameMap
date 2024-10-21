const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',  // Aggiungi questa linea
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
    console.log('Preload function started');
    this.load.on('complete', () => console.log('All assets loaded'));

    this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
    this.load.image('tiles', 'assets/tilesets/tileset3.png');
    this.load.spritesheet('player', 'assets/sprites/player3.png', { 
        frameWidth: 32, 
        frameHeight: 48 
    });
}

function create() {
    console.log('Create function started');
    console.log('Phaser version:', Phaser.VERSION);
    console.log('Canvas created:', this.sys.game.canvas);
    console.log('Canvas size:', this.sys.game.canvas.width, this.sys.game.canvas.height);

    this.cameras.main.setBackgroundColor('#FFFFFF');
    console.log('Background color set to white');

    try {
        const map = this.make.tilemap({ key: 'map' });
        console.log('Tilemap created:', map);
        
        const tileset = map.addTilesetImage('tileset3', 'tiles');
        console.log('Tileset added:', tileset);
        
        const layer = map.createLayer('Terrain', tileset, 0, 0);
        console.log('Layer created:', layer);
    } catch (error) {
        console.error('Error creating map:', error);
    }

    try {
        player = this.physics.add.sprite(400, 300, 'player');
        console.log('Player created:', player);

        player.setCollideWorldBounds(true);
        console.log('Player collision with world bounds set');

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
        console.log('Player animations created');
    } catch (error) {
        console.error('Error setting up player:', error);
    }

    cursors = this.input.keyboard.createCursorKeys();
    console.log('Cursor keys created');

    // Aggiungi un rettangolo rosso per test
    this.add.rectangle(400, 300, 100, 100, 0xFF0000);
    console.log('Red rectangle added for testing');

    // Aggiungi del testo per ulteriore conferma visiva
    this.add.text(400, 200, 'Hello Phaser!', { fill: '#000000' }).setOrigin(0.5);
    console.log('Test text added');

    // Testo di debug
    debugText = this.add.text(16, 16, '', { fontSize: '18px', fill: '#000' });
    console.log('Debug text created');

    console.log('Create function completed');
}

function update() {
    if (!player) {
        console.warn('Player not initialized in update');
        return;
    }

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

// Aggiungi un listener per gli errori non catturati
window.addEventListener('error', function(event) {
    console.error('Uncaught error:', event.error);
});