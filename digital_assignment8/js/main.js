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

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();

        this.board;

        this.tank;

        this.start;
    }
    
    preload() {
        this.load.image('space', 'assets/Square.png');
        this.load.image('tank', 'assets/Tank.png');
        this.load.image("startButton", "assets/START.png");
    }
    
    create() {
        this.board = this.physics.add.group({ key: 'space', repeat: 63 });

        let c = this.board.getChildren();

        Phaser.Actions.GridAlign(c, { width: 8, cellWidth: 64, cellHeight: 64, x: 32, y: 32 });

        this.tank = this.add.sprite(32, 32, 'tank').setAngle(180);

        this.start = new StartButton(this, 400, 300);

        console.log("beanz");
    }
    
    update() {
        
    }
}

class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, sprite) {
        super(scene, x, y);

        this.setTexture(sprite);
        this.setPosition(x, y);
        this.setInteractive();
        this.on('pointerover', () => this.setTint(0xcccccc));
        this.on('pointerout', () => this.clearTint());
        this.on('pointerdown', () => this.setTint(0x333333));
        this.on('pointerup', () => this.setTint(0xcccccc));
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

class StartButton extends Button {
    constructor(scene, x, y) {
        super(scene, x, y, "startButton");

        scene.add.existing(this);

        this.on('pointerup', () => this.action());
    }

    action() {
        console.log("start");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
