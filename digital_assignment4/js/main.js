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

var mode;
var timer;
var b, l;
var playing;

class MyScene extends Phaser.Scene {

    constructor() {
        super();
    }

    preload() {
        this.load.image("bg", "assets/blurredGym.jpg");

        this.load.image("startButton", "assets/START.png");
        this.load.image("liftButton", "assets/LIFT.png");

        this.load.spritesheet("lift", "assets/Weight lifter lift.png", { frameWidth: 256, frameHeight: 512 });
        this.load.spritesheet("pant", "assets/Weight lifter pant.png", { frameWidth: 256, frameHeight: 512 });
        this.load.spritesheet("sweat", "assets/Weight lifter sweat.png", { frameWidth: 256, frameHeight: 512 });
        this.load.spritesheet("drop", "assets/Weight lifter drop.png", { frameWidth: 256, frameHeight: 512 });
    }

    create() {
        this.add.image(400, 300, "bg");

        playing = false;
        mode = 0;

        //Copied from Phaser Create Animation From Sprite Sheet example.
        this.anims.create({
            key: 'lift',
            frames: this.anims.generateFrameNumbers('lift', { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'pant',
            frames: this.anims.generateFrameNumbers('pant', { frames: [0, 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'drop',
            frames: this.anims.generateFrameNumbers('drop', { frames: [0, 1, 2, 3, 4, 5, 6] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'sweat',
            frames: this.anims.generateFrameNumbers('sweat', { frames: [2, 3, 4, 5] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'struggle',
            frames: this.anims.generateFrameNumbers('lift', { frames: [4, 5, 6, 5, 4] }),
            frameRate: 8,
            repeat: -1
        });

        b = new Bar(this, 20, 500);

        //Copied from phaser timer example.
        timer = this.time.addEvent({ delay: 10, callback: b.change, callbackScope: b, repeat: 0, paused: true });

        //Copied from phaser click on sprite example.
        var lift = this.add.sprite(106, 542, 'liftButton').setInteractive();

        var start = this.add.sprite(400, 150, 'startButton').setInteractive();

        start.on('pointerover', function (pointer) {

            this.setTint(0xcccccc);

        });

        start.on('pointerdown', function (pointer) {

            this.setTint(0x333333);
        });

        start.on('pointerout', function (pointer) {

            this.clearTint();

        });

        start.on('pointerup', function (pointer) {

            this.setTint(0xcccccc);

            playing = true;
            l.setVisible(true);

            this.setActive(false);
            this.setVisible(false);

        });

        lift.on('pointerover', function (pointer) {

            this.setTint(0xcccccc);

        });

        lift.on('pointerdown', function (pointer) {

            this.setTint(0x333333);
        });

        lift.on('pointerout', function (pointer) {

            this.clearTint();

        });

        lift.on('pointerup', function (pointer) {

            this.setTint(0xcccccc);

            b.directChange(10);

            this.scene.cameras.main.shake(100);

        });

        l = this.add.sprite(400, 300, "lift").play('struggle');
        l.setVisible(false);
    }

    update() {
        if (mode === 0) {
            b.directChange(-1);
        }
        else {
            b.change();
        }
    }
}

//Copied from Phaser health bar example
class Bar {
    constructor(scene, x, y) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = 0;
        this.p = 76 / 100;
        //My var
        this.add = true;

        this.draw();

        scene.add.existing(this.bar);
    }


    draw() {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, -16, -80);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x - 2, this.y - 2, -12, -76);

        if (this.value < 30 || this.value > 70) {
            this.bar.fillStyle(0xff0000);
        }
        else {
            if ((this.value > 29 && this.value < 40) || (this.value > 60)) {
                this.bar.fillStyle(0xffff00);
            }
            else {
                this.bar.fillStyle(0x00ff00);
                }
            }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x - 2, this.y - 2, -12, -d);
    }

     change() {
        //My added check
        if (this.add) {
            this.directChange(10);
        }
        else {
            this.directChange(-10);
        }
    }

    directChange(num) {
        this.value += num;

        if (this.value < 0) {
            this.value = 0;
            this.add = !this.add;
        }

        if (this.value > 100) {
            this.value = 100;
            this.add = !this.add;
        }

        this.draw();
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
