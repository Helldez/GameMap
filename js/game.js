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
let lastLogTime = 0;

function preload() {
    console.log('Preload function started');

    this.load.on('complete', () => console.log('All assets loaded'));

    this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
    this.load.image('tiles', 'assets/tilesets/tileset3.png');
    this.load.spritesheet('player', 'assets/sprites/player3.png', { 
        frameWidth: 16, 
        frameHeight: 24 
    });
}

function create() {
    console.log('Create function started');
    console.log('Phaser version:', Phaser.VERSION);
    console.log('Canvas size:', this.sys.game.canvas.width, this.sys.game.canvas.height);

    this.cameras.main.setBackgroundColor('#FFFFFF');

    try {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tileset3', 'tiles');
        const layer = map.createLayer('Terrain', tileset, 0, 0);
        console.log('Map and layers created successfully');
    } catch (error) {
        console.error('Error creating map:', error);
    }

    try {
        player = this.physics.add.sprite(100, 150, 'player');
        player.setScale(2);
        player.setCollideWorldBounds(true);

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
        console.log('Player created and animations set up');
    } catch (error) {
        console.error('Error setting up player:', error);
    }

    cursors = this.input.keyboard.createCursorKeys();

    // Aggiungi un rettangolo rosso per test
    this.add.rectangle(400, 300, 100, 100, 0xFF0000);

    // Aggiungi del testo per ulteriore conferma visiva
    this.add.text(400, 200, 'Hello Phaser!', { fill: '#000000' }).setOrigin(0.5);

    // Aggiungi il testo di debug
    debugText = this.add.text(16, 16, '', { fontSize: '18px', fill: '#000' });

    console.log('Create function completed');
}

function update(time) {
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

    // Aggiorna il testo di debug con la posizione del giocatore
    debugText.setText(`X: ${Math.round(player.x)}, Y: ${Math.round(player.y)}`);

    // Log della posizione del giocatore ogni secondo
    if (time - lastLogTime > 1000) {
        console.log('Player position:', Math.round(player.x), Math.round(player.y));
        lastLogTime = time;
    }
}

// Aggiungi un listener per gli errori non catturati
window.addEventListener('error', function(event) {
    console.error('Uncaught error:', event.error);
});