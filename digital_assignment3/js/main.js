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

var animNotDone;
var pirateTimer, cannonTimer;
var target;

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
    }
    
    preload() {
        this.load.image('background', 'assets/art/Background.png');
        //Copied from Create Animation From Sprite Sheet
        this.load.spritesheet('ball', 'assets/art/Cannon ball.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('cannon', 'assets/art/Cannon.png', { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet('pirateb', 'assets/art/PirateBSheet.png', { frameWidth: 32, frameHeight: 32 });

    }
    
    create() {
        animNotDone = 1;

        //Copied from
        target = this.physics.add.image(400, 550, 'assets', 'target').setImmovable();

        this.input.on('pointermove', function (pointer) {

            //  Keep the paddle within the game
            this.target.y = Phaser.Math.Clamp(pointer.y, 52, 748);
        }, this);

        //Copied from phaser timer example.
        pirateTimer = this.time.addEvent({ delay: 1000, callback: this., callbackScope: this, repeat: -1, paused: true });
        cannonTimer = this.time.addEvent({ delay: 500, callback: this.shoot, callbackScope: this, repeat: -1, paused: true });

        //Copied from Create Animation From Sprite Sheet
        this.anims.create({
            key: 'roll',
            frames: this.anims.generateFrameNumbers('ball', { frames: [0, 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('pirateb', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('cannon', { frames: [2, 3, 2] }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'load',
            frames: this.anims.generateFrameNumbers('cannon', { frames: [2, 1, 0, 0, 1, 2] }),
            frameRate: 8,
            repeat: 0
        });

        this.add.sprite(0, 0, 'background');

        let cannon = this.add.sprite(600, 300, 'cannon');

        cannon.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            if (animNotDone) {
                new Ball(this, cannon.x, cannon.y);
                this.reload(cannon);
                animNotDone--;
            }
        }, this);

        this.shoot(cannon);
    }
    
    update() {

    }

    shoot(cannon) {
        cannon.play('fire');

        animNotDone = 1;
    }

    reload(cannon) {
        cannon.play('load');
    }
}

class Ball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ball');
        scene.add.existing(this);

        this.play('roll');
        scene.physics.world.enableBody(this);
        this.body.velocity.x = -60;
    }

    update() {
        if (this.x < 0) {
            this.destroy();
        }
    }
}

class Pirate extends Phaser.GameObjects.Sprite {

}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
