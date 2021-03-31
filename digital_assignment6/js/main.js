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

        this.p;
    }
    
    preload() {
        this.load.image('pb', 'assets/PlayerB.png');
    }
    
    create() {
        this.p = new Player(this, 0, 'pb');
    }
    
    update() {
        this.p
    }
}

class Player extends Phaser.GameObjects.Sprite {
    pNum;

    constructor(scene, num, sprite) {
        super(scene, 400, 300, sprite);

        this.pNum = num;

        scene.add.existing(this);
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
