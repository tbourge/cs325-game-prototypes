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
        this.load.image("bg", "assets/blurredGym.jpg");

        this.load.spritesheet("lift", "assets/Weight lifter lift", { frameWidth: 96, frameHeight: 128 });
        this.load.spritesheet("pant", "assets/Weight lifter pant", { frameWidth: 64, frameHeight: 128 });
        this.load.spritesheet("sweat", "assets/Weight lifter sweat", { frameWidth: 64, frameHeight: 128 });
        this.load.spritesheet("drop", "assets/Weight lifter drop", { frameWidth: 64, frameHeight: 128 });
    }

    create() {
        this.add.image(400, 300, "bg");

        b = new Bar(this, 400, 300);

        this.add.sprite(400, 500, "lift");
    }

    update() {

    }
}

//Copied from Phaser health bar example
class Bar {
    constructor(scene, x, y) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 76 / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    draw() {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.bar.y, 16, 80);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 12, 76);

        if (this.value < 30) {
            this.bar.fillStyle(0xff0000);
        }
        else {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 76);
    }

    change(amount) {
        this.value += amount;

        if (this.value < 0) {
            this.value = 0;
        }

        if (this.value > 100) {
            this.value = 100;
        }

        this.draw();
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
