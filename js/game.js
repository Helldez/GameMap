const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Impostato su false per la produzione
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

    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset3', 'tiles');
    const layer = map.createLayer('Terrain', tileset, 0, 0);
    console.log('Layer created:', layer);

    player = this.physics.add.sprite(100, 150, 'player');
    player.setScale(2);
    console.log('Player position:', player.x, player.y);

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
    player.setCollideWorldBounds(true);

    // Aggiungi un rettangolo rosso per test
    this.add.rectangle(400, 300, 100, 100, 0xFF0000);
}

function update() {
    console.log('Update called');

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