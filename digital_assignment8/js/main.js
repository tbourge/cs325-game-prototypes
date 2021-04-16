import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var tileSize = 68, firstTile = tileSize / 2;

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();

        this.board;

        this.tank;

        this.start;
    }
    
    preload() {
        this.load.image('space', 'assets/Square.png');
        this.load.image("startButton", "assets/START.png");
        this.load.spritesheet('tank', 'assets/Tank.png', { frameWidth: 50, frameHeight: 62 });
        this.load.spritesheet('tankForward', 'assets/TankMove.png', { frameWidth: 50, frameHeight: 62 + tileSize });
    }
    
    create() {
        this.board = this.physics.add.group({ key: 'space', repeat: 63 });

        let c = this.board.getChildren();

        Phaser.Actions.GridAlign(c, { width: 8, cellWidth: tileSize, cellHeight: tileSize, x: firstTile, y: firstTile });

        this.anims.create({
            key: 'shoot',
            frames: this.anims.generateFrameNumbers('tank', { frames: [0, 1] }),
            frameRate: 4,
            repeat: 0
        });

        this.anims.create({
            key: 'tankMove',
            frames: this.anims.generateFrameNumbers('tankForward', { frames: [0, 1, 2, 3] }),
            frameRate: 4,
            repeat: 0
        });

        this.tank = new Tank(this, firstTile, firstTile);

        this.start = new StartButton(this, 400, 300, () => this.startAction());

        console.log("beanz");
    }
    
    update() {
        
    }

    startAction() {
        console.log("start");
    }
}

class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, sprite, action) {
        super(scene, x, y);

        this.setTexture(sprite);
        this.setPosition(x, y);
        this.setInteractive();
        this.on('pointerover', () => this.setTint(0xcccccc));
        this.on('pointerout', () => this.clearTint());
        this.on('pointerdown', () => this.setTint(0x333333));
        this.on('pointerup', () => {
            this.setTint(0xcccccc);
            action();
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

class StartButton extends Button {
    constructor(scene, x, y, action) {
        super(scene, x, y, "startButton", action);

        scene.add.existing(this);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

class Tank extends Phaser.Physics.Arcade.Sprite {
    dir;

    constructor(scene, x, y) {
        super(scene, x, y, "tank");

        this.dir = 2;

        scene.add.existing(this);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.resetSprite()); 

        //test
        this.setInteractive();
        this.on('pointerdown', () => this.startMove());
        this.on('pointerout', () => this.turnRight());
    }

    resetSprite() {
        this.setTexture("tank");
    }

    turnLeft() {
        this.dir--;
    }

    turnRight() {
        this.dir++;
    }

    startMove() {
        this.play("tankMove");
        this.move();
    }

    move() {
        switch (this.dir) {
            case 0:
                this.y -= tileSize;
                break;

            case 1:
                this.x += tileSize;
                break;

            case 2:
                this.y += tileSize;
                break;

            case 3:
                this.x -= tileSize;
                break;
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.setAngle(this.dir * 90);

        if (this.dir > 3) {
            this.dir = 0;
        }
        else if (this.dir < 0) {
            this.dir = 3;
        }
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 650,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
