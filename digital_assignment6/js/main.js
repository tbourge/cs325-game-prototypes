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
        this.load.image('G', 'assets/G.png');
        this.load.image('H', 'assets/H.png');
        this.load.image('Z', 'assets/ZB.png');
        this.load.image('I', 'assets/I.png');
        this.load.image('X', 'assets/X.png');
    }
    
    create() {
        let symbols = ['Z', 'H', 'G', 'X', 'I'];

        this.cards = this.physics.add.group({ key: 'card', classType: Card });

        for (var i = 0; i < 1; i++) {
            this.cards.add(new Card(this, i, 'c', symbols[i]));
            this.cards.add(new Card(this, i, 'c', symbols[i]));
        }

        this.cards.getFirstAlive().destroy();

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
            card.activate(this);

            if (card.num === this.cardActive.num) {
                this.score++;
            }
            else {
                this.cardActive.deactivate();
                card.deactivate();
            }

            this.cardActive = null;
        }
    }
}

class Card extends Phaser.Physics.Arcade.Sprite {
    num;
    isActive;
    willFlip = false;
    count;
    front;
    back;

    constructor(scene, n, back, front) {
        super(scene, 400, 300, back);

        this.front = front;
        this.back = back;
        this.num = n;

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    activate(player) {
        this.setTint(player.getColor());
        this.isActive = true;

        this.show();
    }

    deactivate() {
        this.clearTint();

        this.willFlip = true;
        this.count = 60;
    }

    show() {
        this.setTexture(this.front);
    }

    hide() {
        this.isActive = false;
        this.setTexture(this.back);
        this.willFlip = false;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.willFlip) {
            if (this.count < 1) {
                this.hide();
            }
            else {
                this.count--;
            }
        }
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
