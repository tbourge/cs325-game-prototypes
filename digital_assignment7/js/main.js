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
var flipSound, failSound, matchSound, stealSound;
var timer, startTimer, bt3, bt2, bt4;
var start, restartButton;
var playing;

class MyScene extends Phaser.Scene {


    constructor() {
        super();        

        this.p1, this.p2, this.p3, this.p4;
        this.c1, this.c2;

        this.cards;

        this.players;
        this.numPlayers = 0;

        this.text;
        this.timeText;
        this.scoreText1;
        this.scoreText2;
        this.scoreText3;
        this.scoreText4;

        this.scores;
        this.colors = ["#3030ff", "#ff3030", "#000000", "#ffff30"]; //30ff30

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
        this.load.image("2", "assets/2.png");
        this.load.image("3", "assets/3.png");
        this.load.image("4", "assets/4.png");


        this.load.audio('flip', 'assets/flip.ogg');
        this.load.audio('match', 'assets/match.ogg');
        this.load.audio('fail', 'assets/fail.ogg');
        this.load.audio('steal', 'assets/steal.wav');
    }
    
    create() {
        flipSound = this.sound.add('flip');
        matchSound = this.sound.add('match');
        failSound = this.sound.add('fail');
        stealSound = this.sound.add('steal', { volume: 0.5 });

        this.scoreText1 = this.add.text(100, 450, "0", { fontSize: 25 });
        this.scoreText2 = this.add.text(100, 450, "0", { fontSize: 25 });
        this.scoreText3 = this.add.text(100, 450, "0", { fontSize: 25 });
        this.scoreText4 = this.add.text(100, 450, "0", { fontSize: 25 });

        this.scores = [this.scoreText1, this.scoreText2, this.scoreText3, this.scoreText4];

        var x;

        for (x = 0; x < 4; x++) {
            this.scores[x].setVisible(false);
        }
        

        this.timeCount = 120;
        playing = false;

        let symbols = ['Z', 'H', 'G', 'X', 'I', 'A', 'C', 'B', 'D', 'E'];

        this.cards = this.physics.add.group({ key: 'card', classType: Card });
        this.players = this.physics.add.group({ key: 'player', classType: Player });

        for (var i = 0; i < 10; i++) {
            this.c1 = new Card(this, i, 'back', symbols[i]);
            this.cards.add(this.c1);
            this.c2 = new Card(this, i, 'back', symbols[i]);
            this.cards.add(this.c2);

            this.c1.match = this.c2;
            this.c2.match = this.c1;
        }

        this.cards.getFirstAlive().destroy();
        //Shuffle
        Phaser.Actions.Shuffle(this.cards.getChildren());
        //Destroy Child
        Phaser.Actions.GridAlign(this.cards.getChildren(), { width: 5, cellWidth: size2, cellHeight: size2, x: size1, y: size1 });
        Phaser.Actions.GridAlign(this.scores, { width: 1, cellWidth: 1, cellHeight: 20, x: 760, y: 80 }); 
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

        this.i = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.k = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.l = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.n = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);

        this.five = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        this.two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.three = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.zero = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);

        this.p1 = new Player(this, size1 - 50, size1 - 50, 0, 'pb', 0x3030ff, "#3030ff", 'Blue');
        this.players.add(this.p1);

        this.p2 = new Player(this, size1 + 50, size1 - 50, 1, 'pr', 0xff3030, "#ff3030", 'Red');
        this.players.add(this.p2);

        this.p3 = new Player(this, size1 - 50, size1 + 50, 2, 'pg', 0x30ff30, "#30ff30", 'Green');
        this.players.add(this.p3);

        this.p4 = new Player(this, size1 + 50, size1 + 50, 3, 'py', 0xffff30, "#ffff30", 'Yellow');
        this.players.add(this.p4);

        this.players.getFirstAlive().destroy();
        //Overlap Group
        this.physics.add.overlap(this.players, this.cards, this.pick.bind(this));

        startTimer = this.time.addEvent({ delay: 3000, callback: this.startGame, callbackScope: this, repeat: 0, paused: true });
        timer = this.time.addEvent({ delay: 1000, callback: this.subTime, callbackScope: this, repeat: -1, paused: true });

        bt2 = this.add.sprite(400-70, 300, '2').setInteractive();
        bt3 = this.add.sprite(400, 300, '3').setInteractive();
        bt4 = this.add.sprite(400+70, 300, '4').setInteractive();

        start = this.add.sprite(400, 300, 'startButton').setInteractive();
        start.setVisible(false);
        start.setActive(false);

        restartButton = this.add.sprite(400, 300, 'resetButton').setInteractive();
        restartButton.setVisible(false);
        restartButton.setActive(false);

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

        this.text = this.add.text(100, 450, "          How many players?", { fontSize: 25 }).setColor('#ffffff');
        this.timeText = this.add.text(700, 10, "Time: 0", { fontSize: 10 }).setColor('#ffffff');

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
            this.showCards();
            startTimer.paused = false;

            start.setVisible(false);
            start.setActive(false);

            this.text.setVisible(false);

            this.cards.getChildren().forEach(function (c) {
                c.turnOn();
            });

            this.addPlayers();

        }.bind(this));

        bt2.on('pointerover', function (pointer) {

            this.setTint(0xcccccc);

        });

        bt2.on('pointerdown', function (pointer) {

            this.setTint(0x333333);
        });

        bt2.on('pointerout', function (pointer) {

            this.clearTint();
        });

        bt2.on('pointerup', function (pointer) {
            start.setVisible(true);
            start.setActive(true);

            bt2.setVisible(false);
            bt2.setActive(false);

            bt3.setVisible(false);
            bt3.setActive(false);

            bt4.setVisible(false);
            bt4.setActive(false);

            this.numPlayers = 2;

            this.text.setText("You will have 3 seconds to memorize the board\n        Click START when ready");
        }.bind(this));

        bt3.on('pointerover', function (pointer) {

            this.setTint(0xcccccc);

        });

        bt3.on('pointerdown', function (pointer) {

            this.setTint(0x333333);
        });

        bt3.on('pointerout', function (pointer) {

            this.clearTint();
        });

        bt3.on('pointerup', function (pointer) {
            start.setVisible(true);
            start.setActive(true);

            bt2.setVisible(false);
            bt2.setActive(false);

            bt3.setVisible(false);
            bt3.setActive(false);

            bt4.setVisible(false);
            bt4.setActive(false);

            this.numPlayers = 3;

            this.text.setText("You will have 3 seconds to memorize the board\n        Click START when ready");
        }.bind(this));

        bt4.on('pointerover', function (pointer) {

            this.setTint(0xcccccc);

        });

        bt4.on('pointerdown', function (pointer) {

            this.setTint(0x333333);
        });

        bt4.on('pointerout', function (pointer) {

            this.clearTint();
        });

        bt4.on('pointerup', function (pointer) {
            start.setVisible(true);
            start.setActive(true);

            bt2.setVisible(false);
            bt2.setActive(false);

            bt3.setVisible(false);
            bt3.setActive(false);

            bt4.setVisible(false);
            bt4.setActive(false);

            this.numPlayers = 4;

            this.text.setText("You will have 3 seconds to memorize the board\n        Click START when ready");
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

        if (Phaser.Input.Keyboard.JustDown(this.a) && this.p2.x > 150) {
            this.p2.x -= size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.s) && this.p2.y < 450) {
            this.p2.y += size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.d) && this.p2.x < 600) {
            this.p2.x += size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.i) && this.p3.y > 150) {
            this.p3.y -= size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.j) && this.p3.x > 50) {
            this.p3.x -= size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.k) && this.p3.y < 450) {
            this.p3.y += size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.l) && this.p3.x < 500) {
            this.p3.x += size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.five) && this.p4.y > 150) {
            this.p4.y -= size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.one) && this.p4.x > 150) {
            this.p4.x -= size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.two) && this.p4.y < 450) {
            this.p4.y += size2;
        }

        if (Phaser.Input.Keyboard.JustDown(this.three) && this.p4.x < 600) {
            this.p4.x += size2;
        }

        if (this.ctrl.isDown) {
            console.log("ctrl");
        }

        this.timeText.setText("Time: " + this.timeCount);

        this.scoreText1.setText(this.p1.score);
        this.scoreText1.setColor(this.p1.color2);

        this.scoreText2.setText(this.p2.score);
        this.scoreText2.setColor(this.p2.color2);

        this.scoreText3.setText(this.p3.score);
        this.scoreText3.setColor(this.p3.color2);

        this.scoreText4.setText(this.p4.score);
        this.scoreText4.setColor(this.p4.color2);

        if ((this.allFlipped() || this.timeCount === 0) && playing) {
            this.endGame();
        }
    }

    allFlipped() {
        let c = this.cards.getChildren();

        let isAllFlipped = true;

        c.forEach(function (card) {
            if (!card.isActive) {
                isAllFlipped = false;
            }
        });  

        return isAllFlipped;
    }

    pick(player, card) {
        if (((this.n.isDown && player.getNum() === 2) || (this.zero.isDown && player.getNum() === 3) || (this.c.isDown && player.getNum() === 1) || (this.ctrl.isDown && player.getNum() === 0)) && !card.isActive) {
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

        playing = true;

        timer.paused = false;

        this.players.getChildren().forEach(function (p) {
            p.turnOn();
        });
    }

    endGame() {
        let winner = this.getWinner();

        restartButton.setActive(true);
        restartButton.setVisible(true);

        this.text.setText(winner.name + " is the winner!");
        this.text.setVisible(true);
        this.text.setColor(this.colors[winner.getNum()]);
        this.text.y = 360;
        this.text.x = 250;

        timer.paused = true;
        this.showCards();

        this.players.getChildren().forEach(function (p) {
            p.destroy();
        });

        playing = false;
    }

    getWinner() {
        let ps = this.players.getChildren();

        let winner = ps[0];

        let topScore = 0;

        ps.forEach(function (p) {
            if (p.score > topScore) {
                winner = p;
                topScore = p.score;
            }
        });

        return winner;
    }

    subTime() {
        this.timeCount--;
    }

    addPlayers() {
        var z;

        for (z = this.numPlayers; z < 4; z++) {
            this.players.getLast().destroy();
        }

        for (z = 0; z < this.numPlayers; z++) {
            this.scores[z].setVisible(true);
        }        
    }
}

class Player extends Phaser.Physics.Arcade.Sprite {
    pNum;
    cardActive = null;
    color;
    color2;
    score = 0;
    name;

    constructor(scene, x, y, num, sprite, color, c2, name) {
        super(scene, x, y, sprite);

        this.pNum = num;

        this.color = color;
        this.color2 = c2;

        this.name = name;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.turnOff();
    }

    getNum() {
        return this.pNum;
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
        let m = card.match;

        if (this.cardActive === null) {
            if (m.isActive) {
                m.activator.cardActive = null;
                m.activate(this);
                card.activate(this);
                stealSound.play();
                this.score++;
            }
            else {
                this.cardActive = card;
                this.cardActive.activate(this);
                flipSound.play();
            }

            return;
        }
        else {
            card.activate(this);

            if (card.num === this.cardActive.num) {
                this.score += 2;
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
    isActive = false;
    willFlip = false;
    count;
    front;
    back;
    match;
    activator = null;

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
        this.activator = player;
        this.isActive = true;
        this.setTint(player.getColor());
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
