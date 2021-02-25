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
var pirateTimer, cannonTimer, timer;
var target, cannon;

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
    }
    
    preload() {
        this.load.image('background', 'assets/art/Background.png');
        this.load.image('target', 'assets/art/Target.png');

        //Copied from Create Animation From Sprite Sheet
        this.load.spritesheet('ball', 'assets/art/Cannon ball.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('cannon', 'assets/art/Cannon.png', { frameWidth: 192, frameHeight: 96 });
        this.load.spritesheet('pirateb', 'assets/art/PirateBSheet.png', { frameWidth: 96, frameHeight: 96 });

    }
    
    create() {
        this.add.image(400, 300, 'background');

        animNotDone = 1;

        //Copied from Phaser Breakout example.
        target = this.physics.add.image(50, 300, 'target').setImmovable();

        this.input.on('pointermove', function (pointer) {          
            target.y = Phaser.Math.Clamp(pointer.y, 52, 748);
        }, this);

        let balls = this.physics.add.group({ key: 'ball', classType: Ball });
        let pirates = this.physics.add.group({ key: 'pirate', classType: Pirate });

        this.physics.add.collider(balls, pirates, function (ball, pirate) {
            pirate.setActive(false);
            ball.setActive(false);
        });

        //Copied from phaser timer example.
        pirateTimer = this.time.addEvent({ delay: 3000, callback: this.spawn, callbackScope: this, repeat: -1, paused: false });
        cannonTimer = this.time.addEvent({ delay: 3000, callback: this.shoot, callbackScope: this, repeat: -1, paused: false });
        timer = this.time.addEvent({ delay: 1000, callback: this.addScore, callbackScope: this, repeat: -1, paused: true });

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
            frameRate: 6,
            repeat: 0
        });

        this.anims.create({
            key: 'load',
            frames: this.anims.generateFrameNumbers('cannon', { frames: [2, 1, 0, 0, 1, 2] }),
            frameRate: 8,
            repeat: 0
        });

        cannon = this.add.sprite(600, 300, 'cannon');

        cannon.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            if (animNotDone) {
                var ball = balls.get().setActive(true).setVisible(true);

                if (ball) {

                    ball.play('roll');

                    this.physics.world.enableBody(ball);
                    ball.body.velocity.x = -60;
                }

                this.reload(cannon);
                animNotDone--;
            }
        }, this);

    }
    
    update() {
        if (cannon.y > target.y) {
            cannon.y--;
        }
        else {
            cannon.y++;
        }
    }

    shoot() {
        cannon.play('fire');

        animNotDone = 1;
    }

    reload(cannon) {
        cannon.play('load');
    }

    spawn() {
        var p = Pirate(this, -16, Math.random() * 36 + 32);

        if (p) {
            p.play('walk');

            this.physics.world.enableBody(p);
            p.body.velocity.x = 30;
        }
    }

    addScore() {

    }
}

class Ball extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 0, 0, 'ball');
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'ball');
    }

    update() {
        if (this.x < 0) {
            this.destroy();
        }
    }
}

class Pirate extends Phaser.GameObjects.Sprite {
    constructor(scene,) {
        super(scene, 0, 0, 'pirateb');
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'pirateb');
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
