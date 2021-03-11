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

//Boolean
var animNotDone, gameOver, gameStart;
//Timers
var pirateTimer, cannonTimer, timer, winTimer;
//Objects
var target, cannon;
//Groups
var balls, pirates;
//Ints
var score, time;
//Text
var scoreText, timeText;


class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
    }
    
    preload() {
        this.load.image('background', 'assets/art/Background.png');
        this.load.image('target', 'assets/art/Target.png');
        this.load.image('still', 'assets/art/CannonStill.png');

        this.load.audio('cannonSound', 'assets/sound/Cannon.mp3');
        this.load.audio('bgm', 'assets/sound/music.mp3');
        this.load.audio('boom', 'assets/sound/explosionSound.mp3');

        //Copied from Create Animation From Sprite Sheet
        this.load.spritesheet('ball', 'assets/art/Cannon ball.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('cannon', 'assets/art/Cannon.png', { frameWidth: 192, frameHeight: 96 });
        this.load.spritesheet('pirateb', 'assets/art/PirateBSheet.png', { frameWidth: 78, frameHeight: 84 });
        this.load.spritesheet('exp', 'assets/art/Explosion.png', { frameWidth: 128, frameHeight: 128 });

    }
    
    create() {
        this.add.image(400, 300, 'background');

        scoreText = this.add.text(200, 300, "", { fontSize: "32px" });
        scoreText.setText('Click to Start');
        timeText = this.add.text(20, 20, '', { fontSize: 16 , color: "0x000000"});
        timeText.setText('Time: 0');

        gameOver = 0;
        animNotDone = 1;
        score = 0;
        time = 0;
        gameStart = false;

        this.cannonSound = this.sound.add('cannonSound', { volume: 0.4, rate: 0.75 });

        this.bgm = this.sound.add('bgm', { volume: '0.2' });
        this.boomSound = this.sound.add('boom');


        //Copied from Phaser Breakout example.
        target = this.physics.add.image(150, 300, 'target').setImmovable();

        this.input.on('pointermove', function (pointer) {
            if (!gameOver) {
                target.y = Phaser.Math.Clamp(pointer.y, 60, 540);
            }
        }, this);

        this.input.on('pointerup', function (pointer) {
            if (gameOver) {                
                this.bgm.destroy(true);
                
                this.scene.restart();
            }
            else {
                scoreText.setVisible(false);
                timer.paused = false;
                pirateTimer.paused = false;
                cannonTimer.paused = false;
                winTimer.paused = false;
                gameStart = true;

                if (!this.bgm.isPlaying) {
                    this.bgm.play();
                }
            }
        }.bind(this) , this);

        //Copied from Phaser Group vs Group example.
        balls = this.physics.add.group({ key: 'ball', classType: Ball });
        pirates = this.physics.add.group({ key: 'pirate', classType: Pirate });
        pirates.x = -200;

        this.physics.add.collider(balls, pirates, function (ball, pirate) {
            if (gameStart) {
                pirate.explode();

                ball.explode();

                this.boomSound.play();
            }
        }.bind(this));

        //Copied from phaser timer example.
        pirateTimer = this.time.addEvent({ delay: 3500, callback: this.spawn, callbackScope: this, repeat: -1, paused: true });
        cannonTimer = this.time.addEvent({ delay: 3000, callback: this.shoot, callbackScope: this, repeat: -1, paused: true });
        timer = this.time.addEvent({ delay: 1000, callback: this.addTime, callbackScope: this, repeat: -1, paused: true });
        winTimer = this.time.addEvent({ delay: 120000, callback: this.win, callbackScope: this, repeat: 0, paused: true });


        //Copied from Phaser Create Animation From Sprite Sheet example.
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

        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('exp', { frames: [0, 1, 2] }),
            frameRate: 8,
            repeat: 0
        });

        cannon = this.add.sprite(690, 300, 'still');

        //Copied from Phaser On complete event example
        cannon.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            if (animNotDone) {
                var ball = balls.get().setActive(true).setVisible(true);

                if (ball) {
                    ball.make(this);                    
                }

                this.reload(cannon);
                animNotDone--;
            }
        }, this);
    }
    
    update() {

        if (!gameOver) {
            if (cannon.y > target.y) {
                cannon.y--;
            }
            else {
                cannon.y++;
            }

            this.physics.world.collide(target, balls, this.explode);
        }

        timeText.setText('Time: ' + time);
    }

    explode(target, ball) {
        target.setActive(false);
        target.body.setEnable(false);
        target.setVisible(false);

        ball.explode();

        ball.lose();
    }

    shoot() {
        cannon.play('fire');
        this.cannonSound.play();

        animNotDone = 1;
    }

    reload(cannon) {
        cannon.play('load');
    }

    spawn() {
        var p = pirates.get()

        if (p) {
            p.make(this);
            p.setActive(true).setVisible(true);

            //Copied from Phaser moveto example
            this.physics.moveTo(p, 640, p.y, 25);
        }
    }

    addTime() {
        time++;  
    }

    win() {
        timer.paused = true;
        pirateTimer.paused = true;
        cannonTimer.paused = true;
        winTimer.paused = true;

        timeText.setVisible(false);
        scoreText.setVisible(true);
        score = time * 10;
        pirates.clear(true);
        balls.clear(true);
        scoreText.setPosition(150, 300)
        scoreText.setText('You survived! Score: ' + score + '\n' + "Click to restart");
        gameOver = 1;
    }

    lose() {
        timer.paused = true;
        pirateTimer.paused = true;
        cannonTimer.paused = true;
        winTimer.paused = true;

        timeText.setVisible(false);
        scoreText.setVisible(true);
        scoreText.setText("The pirates got you..." + '\n' + 'You survived for: ' + time + ' seconds.');
        gameOver = 1;  
    }
}

class Ball extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 800, 0, 'ball');
    }

    make(scene) {
        this.setPosition(cannon.x - 55, cannon.y);

        this.play('roll');

        scene.physics.world.enableBody(this);
        this.body.velocity.x = -60;
        this.body.setCircle(40);
    }

    explode() {
        this.body.velocity.x = 0;

        this.play('explosion');


        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.die, this);
    }

    die() {
        this.body.setEnable(false);
        this.setActive(false);
        this.setVisible(false);
    }

    lose() {
        timer.paused = true;
        pirateTimer.paused = true;
        cannonTimer.paused = true;
        winTimer.paused = true;

        timeText.setVisible(false);
        scoreText.setVisible(true);
        scoreText.setText("The pirates got you..." + '\n' + 'You survived for: ' + time + ' seconds.');
        gameOver = 1;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.x < 0) {
            this.die();
        }
    }
}

class Pirate extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 400, 300, 'pirateb');
        this.setActive(false);
        this.setVisible(false);

        this.targetNotSet = true;
        this.offPlank = false;
        this.pointY = 0;
        this.move = 0;
    }

    make(scene) {
        if (Math.random() < 0.5) {
            this.setPosition(50, 145 + Math.random() * 10);
        }
        else {
            this.setPosition(50, 445 + Math.random() * 10);
        }

        this.play('walk');
        this.offPlank = false;
        this.targetNotSet = true;
        scene.physics.world.enableBody(this);
    }

    lose() {
        timer.paused = true;
        pirateTimer.paused = true;
        cannonTimer.paused = true;
        winTimer.paused = true;

        timeText.setVisible(false);
        scoreText.setVisible(true);
        scoreText.setText("The pirates got you..." + '\n' + 'You survived for: ' + time + ' seconds.');
        gameOver = 1;
    }

    explode() {
        this.setActive(false);
        this.body.setEnable(false);
        this.setVisible(false);
    }

    getPoint() {
        var rand = Math.trunc(Math.random() * 7);

        switch (rand) {
            case 0:
                this.pointY = 50;
                break;

            case 1:
                this.pointY = 150;
                break;

            case 2:
                this.pointY = 270;
                break;

            case 3:
                this.pointY = 390;
                break;

            case 4:
                this.pointY = 410;
                break;

            case 5:
                this.pointY = 530;
                break;

            case 6:
                this.pointY = 550;
                break;

            default:
                this.pointY = cannon.y;
        };

        this.targetNotSet = false;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.x > 150) {
            this.offPlank = true;
        }
        else {
            this.offPlank = false;
        }

        if (this.x > 600) {
            this.lose();
        }

        if (this.offPlank && this.targetNotSet) {
            this.getPoint();
        }

        if (this.move < 1 && this.x < 600 && gameStart) {
            this.x++;

            if (this.y < this.pointY) {
                this.y++;
            }
            else {
                this.y--;
            }

            this.move = 3;
        }
        else {
            this.move--;
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
