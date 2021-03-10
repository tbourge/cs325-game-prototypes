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
var animNotDone, gameOver;
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
//Sound
var grunt;

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();
    }
    
    preload() {
        this.load.image('background', 'assets/art/Background.png');
        this.load.image('target', 'assets/art/Target.png');

        this.load.audio('cannonSound', 'assets/sound/Cannon.mp3');
        this.load.audio('grunt', 'assets/sound/Grunt.mp3');

        //Copied from Create Animation From Sprite Sheet
        this.load.spritesheet('ball', 'assets/art/Cannon ball.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('cannon', 'assets/art/Cannon.png', { frameWidth: 192, frameHeight: 96 });
        this.load.spritesheet('pirateb', 'assets/art/PirateBSheet.png', { frameWidth: 78, frameHeight: 84 });

    }
    
    create() {
        this.add.image(400, 300, 'background');

        scoreText = this.add.text(350, 300, { fontSize: 10000 });
        scoreText.setText('Click to Start');
        timeText = this.add.text(20, 20, { fontSize: 1000 });
  
        timeText.setText('Time: 0');

        gameOver = 0;
        animNotDone = 1;
        score = 0;
        time = 0;

        this.cannonSound = this.sound.add('cannonSound', { volume: 0.4, rate: 0.8 });
        this.gruntSound = this.sound.add('grunt');
        grunt = this.gruntSound;

        //Copied from Phaser Breakout example.
        target = this.physics.add.image(50, 300, 'target').setImmovable();

        this.input.on('pointermove', function (pointer) {          
            target.y = Phaser.Math.Clamp(pointer.y, 52, 748);
        }, this);

        this.input.on('pointerup', function (pointer) {
            if (gameOver) {
                this.scene.restart();
            }
            else {
                scoreText.setVisible(false);
                timer.paused = false;
                pirateTimer.paused = false;
                cannonTimer.paused = false;
                winTimer.paused = false;
            }
        }, this);

        //Copied from Phaser Group vs Group example.
        balls = this.physics.add.group({ key: 'ball', classType: Ball });
        pirates = this.physics.add.group({ key: 'pirate', classType: Pirate });

        this.physics.add.collider(balls, pirates, function (ball, pirate) {
            pirate.setActive(false);

            pirate.setVisible(false);

            ball.setActive(false);
            ball.setVisible(false);

            grunt.play();
        });

        //Copied from Phaser group world bounds example.
        Phaser.Actions.Call(pirates.getChildren(), function (pir) {
            pir.body.onWorldBounds = true;
        });

        this.physics.world.on('worldbounds', this.onWorldBounds);

        //Copied from phaser timer example.
        pirateTimer = this.time.addEvent({ delay: 3500, callback: this.spawn, callbackScope: this, repeat: -1, paused: true });
        cannonTimer = this.time.addEvent({ delay: 3000, callback: this.shoot, callbackScope: this, repeat: -1, paused: true });
        timer = this.time.addEvent({ delay: 1000, callback: this.addTime, callbackScope: this, repeat: -1, paused: true });
        winTimer = this.time.addEvent({ delay: 180000, callback: this.win, callbackScope: this, repeat: 0, paused: true });


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

        cannon = this.add.sprite(690, 300, 'cannon');

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
        if (cannon.y > target.y) {
            cannon.y--;
        }
        else {
            cannon.y++;
        }

        timeText.setText('Time: ' + time);
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
        var p = pirates.get({ x: 400, y: 300 })

        if (p) {
            p.make(this);
            p.setActive(true).setVisible(true);
            this.physics.moveToObject(p, cannon, 20);
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

        timeText.setVisible(false)
        scoreText.setVisible(true);
        score = time * 10;
        pirates.clear(true);
        scoreText.setText('You survived! Score: ' + score + ' Click to restart');
        gameOver = 1;
    }

    onWorldBounds() {
        timer.paused = true;
        pirateTimer.paused = true;
        cannonTimer.paused = true;
        winTimer.paused = true;

        timeText.setVisible(false);
        scoreText.setVisible(true);
        scoreText.setText('You survived for: ' + time + ' seconds.');
        gameOver = 1;  
    }

    lose() {
        timer.paused = true;
        pirateTimer.paused = true;
        cannonTimer.paused = true;
        winTimer.paused = true;

        timeText.setVisible(false);
        scoreText.setVisible(true);
        scoreText.setText('You survived for: ' + time + ' seconds.');
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
    }

    update() {
        if (this.x < 0) {
            this.setActive(false);
        }
    }
}

class Pirate extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 400, 300, 'pirateb');
        this.setActive(false);
    }

    make(scene) {
        if (Math.random() < 0.5) {
            this.setPosition(50, 145 + Math.random() * 10);
        }
        else {
            this.setPosition(50, 445 + Math.random() * 10);
        }
        this.play('walk');

        scene.physics.world.enableBody(this);
        this.body.collideWorldBounds = true;
        //this.body.velocity.x = 30;
    }

    lose() {
        timer.paused = true;
        pirateTimer.paused = true;
        cannonTimer.paused = true;
        winTimer.paused = true;

        timeText.setVisible(false);
        scoreText.setVisible(true);
        scoreText.setText('You survived for: ' + time + ' seconds.');
        gameOver = 1;
    }

    preUpdate() {
        super.preUpdate();

        if (this.x > 500) {
            this.lose();
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
