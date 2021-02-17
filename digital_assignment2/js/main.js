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

        this.load.image('fire0', 'fire0.png');
        this.load.image('fire1', 'fire1.png');
        this.load.image('fire2', 'fire2.png');
        this.load.image('fire3', 'fire3.png');
        this.load.image('fire4', 'fire4.png');
        this.load.image('fire5', 'fire5.png');
        this.load.image('fire6', 'fire6.png');
        this.load.image('fire7', 'fire7.png');

        this.load.image('man0', 'man0.png');
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

        this.anims.create({
            key: 'fire',
            frames: [
                { key: 'fire0' },
                { key: 'fire1' },
                { key: 'fire2' },
                { key: 'fire3' },
                { key: 'fire4' },
                { key: 'fire5' },
                { key: 'fire6' },
                { key: 'fire7', duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'man',
            frames: [
                { key: 'man0' },
                { key: 'man0' },
                { key: 'man0' },
                { key: 'man0' },
                { key: 'man0' },
                { key: 'man0' },
                { key: 'man0' },
                { key: 'man0', duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.add.sprite(400, 300, 'pot0').play('boiling');
            
        var f = this.add.sprite(400, 300, 'fire0').play('fire');
        f.disable();

        this.add.sprite(380, 236, 'man0').play('man');        
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
