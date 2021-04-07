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

var size1 = 96, size2 = 144;
var flipSound, failSound, matchSound;
var timer, startTimer;
var start, restartButton;
var playing = false;

class MyScene extends Phaser.Scene {


    constructor() {
        super();        

        this.p1, this.p2, this.p3, this.p4;

        this.cards;
        this.activeCards;
        this.inactiveCards;

        this.players;
        this.numPlayers = 0;

        this.text;
        this.timeText;

        this.timeCount;

        this.up, this.down, this.left, this.right, this.ctrl;

        this.w, this.s, this.a, this.d, this.c;

        this.i, this.k, this.j, this.l, this.n;

        this.five, this.one, this.two, this.three, this.zero;
    }
    
    preload() {
        this.load.image('pb', 'assets/PlayerB.png');
        this.load.image('py', 'assets/PlayerY.png');
        this.load.image('pr', 'assets/PlayerR.png');
        this.load.image('pg', 'assets/PlayerG.png');

        this.load.image('back', 'assets/CardB.png');
        this.load.image('G', 'assets/GB.png');
        this.load.image('H', 'assets/HB.png');
        this.load.image('Z', 'assets/ZB.png');
        this.load.image('I', 'assets/IB.png');
        this.load.image('X', 'assets/XB.png');
        this.load.image('A', 'assets/AB.png');
        this.load.image('C', 'assets/CB.png');
        this.load.image('B', 'assets/BB.png');
        this.load.image('D', 'assets/DB.png');
        this.load.image('E', 'assets/EB.png');

        this.load.image("startButton", "assets/START.png");
        this.load.image("resetButton", "assets/RESET.png");

        this.load.audio('flip', 'assets/flip.ogg');
        this.load.audio('match', 'assets/match.ogg');
        this.load.audio('fail', 'assets/fail.ogg');
    }
    
    create() {
        flipSound = this.sound.add('flip');
        matchSound = this.sound.add('match');
        failSound = this.sound.add('fail');

        this.timeCount = 120;

        let symbols = ['Z', 'H', 'G', 'X', 'I', 'A', 'C', 'B', 'D', 'E'];

        this.cards = this.physics.add.group({ key: 'card', classType: Card });
        this.players = this.physics.add.group({ key: 'player', classType: Player });

        for (var i = 0; i < 10; i++) {
            this.cards.add(new Card(this, i, 'back', symbols[i]));
            this.cards.add(new Card(this, i, 'back', symbols[i]));
        }

        this.cards.getFirstAlive().destroy();
        //Shuffle
        Phaser.Actions.Shuffle(this.cards.getChildren());
        //Destroy Child
        Phaser.Actions.GridAlign(this.cards.getChildren(), { width: 5, cellWidth: size2, cellHeight: size2, x: size1, y: size1 }); 
        //Just Down
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.ctrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

        this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.c = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

      //  this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        //this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        //this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        //this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.n = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);

    //    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      //  this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        //this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        //this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.zero = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);

        this.p1 = new Player(this, size1 - 50, size1 - 50, 0, 'pb', 0x2020ff);
        this.players.add(this.p1);

        this.p2 = new Player(this, size1 + 50, size1 - 50, 1, 'pr', 0xff2020);
        this.players.add(this.p2);

        this.p3 = new Player(this, size1 - 50, size1 + 50, 2, 'pg', 0x20ff20);
        this.players.add(this.p3);

        this.p4 = new Player(this, size1 + 50, size1 + 50, 3, 'py', 0xffff20);
        this.players.add(this.p4);

        this.players.getFirstAlive().destroy();
        //Overlap Group
        this.physics.add.overlap(this.players, this.cards, this.pick.bind(this));

        startTimer = this.time.addEvent({ delay: 3000, callback: this.startGame, callbackScope: this, repeat: 0, paused: true });
        timer = this.time.addEvent({ delay: 1000, callback: this.subTime, callbackScope: this, repeat: -1, paused: true });

        this.text = this.add.text(100, 450, "You will have 3 seconds to memorize the board\n Click START when ready", { fontSize: 25 }).setColor('#ffffff');
        this.timeText = this.add.text(700, 10, "Time: 0", { fontSize: 10 }).setColor('#ffffff');

        start = this.add.sprite(400, 300, 'startButton').setInteractive();

        restartButton = this.add.sprite(400, 300, 'resetButton').setInteractive();
        restartButton.setVisible(false);
        restartButton.setActive(false);

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

            playing = true;

            this.showCards();
            startTimer.paused = false;

            start.setVisible(false);
            start.setActive(false);

            this.text.setVisible(false);

            this.cards.getChildren().forEach(function (c) {
                c.turnOn();
            });

        }.bind(this));

        restartButton.on('pointerover', function (pointer) {

            this.setTint(0xcccccc);

        });

        restartButton.on('pointerdown', function (pointer) {

            this.setTint(0x333333);
        });

        restartButton.on('pointerout', function (pointer) {

            this.clearTint();

        });

        restartButton.on('pointerup', function (pointer) {

            this.scene.restart();

        }.bind(this));
    }
    
    update() {
        //Just Down
        if (Phaser.Input.Keyboard.JustDown(this.up) && this.p1.y > 50) {
            this.p1.y -= size2; 
        }

        if (Phaser.Input.Keyboard.JustDown(this.left) && this.p1.x > 50) {
            this.p1.x -= size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.down) && this.p1.y < 450) {
            this.p1.y += size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.right) && this.p1.x < 500) {
            this.p1.x += size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.w) && this.p2.y > 50) {
            this.p2.y -= size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.a) && this.p2.x > 50) {
            this.p2.x -= size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.s) && this.p2.y < 450) {
            this.p2.y += size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.d) && this.p2.x < 500) {
            this.p2.x += size2;
        }

        if (this.ctrl.isDown) {
            console.log("ctrl");
        }

        if (this.p1.score > 9) {
            this.win();
        }

        this.timeText.setText("Time: " + this.timeCount);

        if (this.timeCount === 0) {
            this.lose();
        }
    }

    pick(player, card) {
        if (((Phaser.Input.Keyboard.JustDown(this.n) && player.pNum === 2) || (Phaser.Input.Keyboard.JustDown(this.zero) && player.pNum === 3) || (Phaser.Input.Keyboard.JustDown(this.c) && player.pNum === 1) || (Phaser.Input.Keyboard.JustDown(this.ctrl) && player.pNum === 0)) && !card.isActive) {
            console.log(player.pNum);
            player.check(card);            
        }
    }

    showCards() {
        this.cards.getChildren().forEach(function (c) {
            c.show();
        });    
    }

    hideCards() {
        this.cards.getChildren().forEach(function (c) {
            c.hide();
        });
    }

    startGame() {
        this.hideCards();

        timer.paused = false;

        this.players.getChildren().forEach(function (p) {
            p.turnOn();
        });
    }

    lose() {
        this.p1.turnOff();

        this.showCards();

        this.endGame();

        this.text.setText("You lost... You did earn " + this.p1.score + " points though!");
    }

    endGame() {
        restartButton.setActive(true);
        restartButton.setVisible(true);
        this.text.setVisible(true);
        this.text.setColor('#000fff');
        timer.paused = true;
    }

    win() {
        this.endGame();

        loseTimer.paused = true;

        this.text.setText("You Won!");
    }

    subTime() {
        this.timeCount--;
    }
}

class Player extends Phaser.Physics.Arcade.Sprite {
    pNum;
    cardActive = null;
    color;
    score = 0;

    constructor(scene, x, y, num, sprite, color) {
        super(scene, x, y, sprite);

        this.pNum = num;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.color = color;

        this.turnOff();
    }

    turnOff() {
        this.setVisible(false);
        this.setActive(false);
    }

    turnOn() {
        this.setVisible(true);
        this.setActive(true);
    }

    getColor() {
        return this.color;
    }

    check(card) {
        if (this.cardActive === null) {
            this.cardActive = card;
            this.cardActive.activate(this);
            console.log(this.cardActive.num);
            flipSound.play();
            return;
        }
        else {
            console.log(card.num);
            card.activate(this);

            if (card.num === this.cardActive.num) {
                this.score++;
                matchSound.play();
            }
            else {
                this.cardActive.deactivate();
                card.deactivate();
                failSound.play();
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

        this.turnOff();
    }

    turnOff() {
        this.setVisible(false);
        this.setActive(false);
    }

    turnOn() {
        this.setVisible(true);
        this.setActive(true);
    }

    activate(player) {
        this.setTint(player.getColor());
        this.show();
    }

    deactivate() {
        this.clearTint();

        this.willFlip = true;
        this.count = 60;
    }

    show() {
        this.isActive = true;
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
