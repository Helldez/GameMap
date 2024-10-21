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
    console.log('Preload function started');

    this.load.on('complete', () => console.log('All assets loaded'));

    this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
    this.load.on('filecomplete-tilemapJSON-map', function() {
        console.log('Map JSON loaded successfully');
    });

    this.load.image('tiles', 'assets/tilesets/tileset3.png');
    this.load.on('filecomplete-image-tiles', function() {
        console.log('Tileset image loaded successfully');
    });

    this.load.spritesheet('player', 'assets/sprites/player3.png', { 
        frameWidth: 16, 
        frameHeight: 24 
    });
    this.load.on('filecomplete-spritesheet-player', function() {
        console.log('Player spritesheet loaded successfully');
    });
}

function create() {
    console.log('Create function started');
    console.log('Phaser version:', Phaser.VERSION);
    console.log('Canvas size:', this.sys.game.canvas.width, this.sys.game.canvas.height);

    this.cameras.main.setBackgroundColor('#FFFFFF');
    console.log('Background color set to white');

    try {
        const map = this.make.tilemap({ key: 'map' });
        console.log('Tilemap created');
        
        const tileset = map.addTilesetImage('tileset3', 'tiles');
        console.log('Tileset added to map');
        
        const layer = map.createLayer('Terrain', tileset, 0, 0);
        console.log('Layer created:', layer);
    } catch (error) {
        console.error('Error creating map:', error);
    }

    try {
        player = this.physics.add.sprite(100, 150, 'player');
        player.setScale(2);
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

    console.log('Create function completed');
}

function update() {
    console.log('Update called');

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
}

// Aggiungi un listener per gli errori non catturati
window.addEventListener('error', function(event) {
    console.error('Uncaught error:', event.error);
});