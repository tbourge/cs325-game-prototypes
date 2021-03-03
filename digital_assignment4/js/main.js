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

        this.bar;

    }

    preload() {
        this.load.image("bg", "blurredGym.jpg")
    }

    create() {
        this.add.image()
        //Copied from Phaser health bar example

        this.bar = new Phaser.GameObjects.Graphics(this);

        this.bar.x = 400;
        this.bar.y = 300;
        this.bar.value = 100;
        this.bar.p = 76 / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    update() {

    }

    //Copied from Phaser health bar example
    draw() {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.bar.x, this.bar.y, 16, 80);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.bar.x + 2, this.bar.y + 2, 12, 76);

        if (this.value < 30) {
            this.bar.fillStyle(0xff0000);
        }
        else {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.bar.p * this.bar.value);

        this.bar.fillRect(this.bar.x + 2, this.bar.y + 2, d, 76);
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
