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

        this.push = false;

        this.up, this.down, this.left, this.right, this.space;
    }
    
    preload() {
        this.load.image('pb', 'assets/PlayerB.png');
        this.load.image('c', 'assets/Card.png');

    }
    
    create() {
        this.cards = this.physics.add.group({ key: 'card', classType: Card });
        this.physics.debug = true;
        for (var i = 0; i < 255; i+=20) {
            this.cards.add(new Card(this, i, 'c'));
            this.cards.add(new Card(this, i, 'c'));
        }

        //this.cards.getFirstAlive().destroy();

        Phaser.Actions.Shuffle(this.cards.getChildren());

        Phaser.Actions.GridAlign(this.cards.getChildren(), { width: 6, cellWidth: 96, cellHeight: 96, x: 64, y: 64 }); 



        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.p = new Player(this, 64, 64, 0, 'pb');

        this.physics.add.overlap(this.p, this.cards, this.pick.bind(this));
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.up)) {
            this.p.y -= 96; 
        }

        if (Phaser.Input.Keyboard.JustDown(this.left)) {
            this.p.x -= 96;
        }

        if (Phaser.Input.Keyboard.JustDown(this.down)) {
            this.p.y += 96;
        }

        if (Phaser.Input.Keyboard.JustDown(this.right)) {
            this.p.x += 96;
        }

        if (this.space.isDown) {
            console.log("space");
        }
    }

    pick(player, card) {
        //console.log("overlap");
        if (Phaser.Input.Keyboard.JustDown(this.space)) {

            if (!card.isActive) {
                console.log("pick");
                player.check(card);
            }
        }
    }
}

class Player extends Phaser.Physics.Arcade.Sprite {
    pNum;
    cardActive = null;
    color = 0x0000ff;
    score = 0;

    constructor(scene, x, y, num, sprite) {
        super(scene, x, y, sprite);

        this.pNum = num;

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    getColor() {
        return this.color;
    }

    check(card) {
        if (this.cardActive === null) {
            this.cardActive = card;
            this.cardActive.activate(this);
            console.log(this.cardActive.num);
            return;
        }
        else {
            console.log(card.num);

            if (card.num === this.cardActive.num) {
                this.score++;
                card.activate(this);
                this.cardActive = null;
            }
            else {
                this.cardActive.deactivate();
                card.deactivate();

                this.cardActive = null;
            }
        }
    }
}

class Card extends Phaser.Physics.Arcade.Sprite {
    num;
    isActive;

    constructor(scene, n, sprite) {
        super(scene, 400, 300, sprite);

        this.num = n;

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    activate(player) {
        this.setTint(player.getColor());

        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
        this.clearTint();
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
