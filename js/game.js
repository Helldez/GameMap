const config = {
    type: Phaser.AUTO,
    width: 336,  // 21 tiles * 16 pixels
    height: 672, // 42 tiles * 16 pixels
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let map;
let groundLayer;
let objectLayer;

function preload() {
    // Carica la tilemap
    this.load.tilemapTiledXML('map', 'assets/maps/map1.tmx');
    
    // Carica il tileset (assicurati che il percorso sia corretto)
    this.load.image('tiles', 'assets/tilesets/grass_biome.png');
    
    // Carica lo spritesheet del player
    this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 16, frameHeight: 16 });
}

function create() {
    // Crea la mappa
    map = this.make.tilemap({ key: 'map' });
    
    // Aggiungi il tileset alla mappa
    const tileset = map.addTilesetImage('grass_biome', 'tiles');
    
    // Crea i layer
    groundLayer = map.createLayer('Kachelebene 1', tileset, 0, 0);
    objectLayer = map.createLayer('Tile Layer 2', tileset, 0, 0);
    
    // Imposta le collisioni (modifica questi valori in base alle tue esigenze)
    groundLayer.setCollisionByProperty({ collides: true });
    
    // Crea il player
    player = this.physics.add.sprite(100, 100, 'player');
    player.setCollideWorldBounds(true);
    
    // Aggiungi collisione tra player e groundLayer
    this.physics.add.collider(player, groundLayer);
    
    // Crea le animazioni del player
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    // Imposta la camera per seguire il player
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
    
    // Crea i controlli
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Movimento del player
    const speed = 100;
    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
        player.anims.play('walk', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
        player.anims.play('walk', true);
        player.flipX = false;
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-speed);
        player.anims.play('walk', true);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(speed);
        player.anims.play('walk', true);
    }

    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
        player.anims.stop();
    }
}