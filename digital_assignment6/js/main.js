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
        this.cards;
        this.activeCards;
        this.inactiveCards;
    }
    
    preload() {
        this.load.image('pb', 'assets/PlayerB.png');
        this.load.image('c', 'assets/Card.png');

    }
    
    create() {
        this.p = new Player(this, 0, 'pb');

        this.cards = this.physics.add.group({ key: 'card', classType: Card });

        for (var i = 0; i < 12; i++) {
            this.cards.add(new Card(this, i, 'c'));
        }

        Phaser.Actions.SetXY(this.cards.getChildren(), 32, 100, 32);

        this.cards.get(0).destroy();
    }
    
    update() {
        this.p
    }
}

class Player extends Phaser.GameObjects.Sprite {
    pNum;
    cardActive;

    constructor(scene, num, sprite) {
        super(scene, 400, 300, sprite);

        this.pNum = num;

        scene.add.existing(this);
    }
}

class Card extends Phaser.GameObjects.Sprite {
    num;
    isActive;

    constructor(scene, n, sprite) {
        super(scene, 400, 300, sprite);

        this.num = n;

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
