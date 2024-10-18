const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
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
    // Carica tileset standard di Phaser
    this.load.image('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/dungeon-16-16.png');
    
    // Carica una mappa JSON semplice
    this.load.tilemapTiledJSON('map', 'https://labs.phaser.io/assets/tilemaps/maps/dungeon-16-16.json');
    
    // Carica sprite del player standard
    this.load.spritesheet('player', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Crea la mappa
    const map = this.make.tilemap({ key: 'map' });
    
    // Aggiungi il tileset alla mappa
    const tileset = map.addTilesetImage('dungeon', 'tiles');
    
    // Crea i layer
    const groundLayer = map.createLayer('Ground', tileset);
    const wallsLayer = map.createLayer('Walls', tileset);
    
    // Imposta le collisioni per il layer delle mura
    wallsLayer.setCollisionByProperty({ collides: true });
    
    // Crea il player
    player = this.physics.add.sprite(100, 100, 'player');
    player.setCollideWorldBounds(true);
    
    // Aggiungi collisione tra player e wallsLayer
    this.physics.add.collider(player, wallsLayer);
    
    // Crea le animazioni del player
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
    // Imposta la camera per seguire il player
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
    
    // Crea i controlli
    cursors = this.input.keyboard.createCursorKeys();
    
    // Testo di debug
    debugText = this.add.text(16, 16, 'Debug info', { fontSize: '18px', fill: '#ffffff' });
    debugText.setScrollFactor(0);
}

function update() {
    // Movimento del player
    const speed = 160;
    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
        player.anims.play('right', true);
    } else {
        player.anims.play('turn');
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(speed);
    }

    // Aggiorna il testo di debug
    debugText.setText(`
        Player X: ${Math.round(player.x)}
        Player Y: ${Math.round(player.y)}
        FPS: ${Math.round(game.loop.actualFps)}
    `);
}