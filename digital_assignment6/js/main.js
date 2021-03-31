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

        this.up, this.down, this.left, this.right;
    }
    
    preload() {
        this.load.image('pb', 'assets/PlayerB.png');
        this.load.image('c', 'assets/Card.png');

    }
    
    create() {
        this.cards = this.physics.add.group({ key: 'card', classType: Card });

        for (var i = 0; i < 12; i++) {
            this.cards.add(new Card(this, i, 'c').SetTint(0xffff00 + i));
            this.cards.add(new Card(this, i, 'c').SetTint(0xffff00 + i));
        }

        this.cards.getFirstAlive().destroy();

        Phaser.Actions.Shuffle(this.cards.getChildren());

        Phaser.Actions.GridAlign(this.cards.getChildren(), { width: 6, cellWidth: 96, cellHeight: 96, x: 64, y: 64 });   

        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.p = new Player(this, 0, 'pb');
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.up)) {
            this.p.y -= 64; 
        }
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
