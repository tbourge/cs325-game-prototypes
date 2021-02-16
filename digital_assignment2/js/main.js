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
    }
    
    preload() {
        this.load.path = 'assets/Anim/';

        this.load.image('pot0', 'Pot0.png');
        this.load.image('pot1', 'Pot1.png');
        this.load.image('pot2', 'Pot2.png');
        this.load.image('pot3', 'Pot3.png');
        this.load.image('pot4', 'Pot4.png');
        this.load.image('pot5', 'Pot5.png');
        this.load.image('pot6', 'Pot6.png');
        this.load.image('pot7', 'Pot7.png');
        this.load.image('pot8', 'Pot8.png');
        this.load.image('pot9', 'Pot9.png');
        this.load.image('pot10', 'Pot10.png');
        this.load.image('pot11', 'Pot11.png');
    }
    
    create() {
        this.anims.create({
            key: 'boiling',
            frames: [
                { key: 'pot1' },
                { key: 'pot2' },
                { key: 'pot3' },
                { key: 'pot4' },
                { key: 'pot5' },
                { key: 'pot6' },
                { key: 'pot7' },
                { key: 'pot8' },
                { key: 'pot9' },
                { key: 'pot10' },
                { key: 'pot11', duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.add.sprite(400, 300, 'pot0').play('boiling');
            
        
        
    }
    
    update() {
        
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
