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

var offset = 20, tileSize = 68, firstTile = tileSize / 2 + offset;

class MyScene extends Phaser.Scene {
    
    constructor() {
        super();

        this.board;
        this.rockets;

        this.robot;
        this.tank;

        this.start;
    }
    
    preload() {
        this.load.image('space', 'assets/Square.png');
        this.load.image("startButton", "assets/START.png");
        this.load.image("robot", "assets/Rob.png");
        this.load.spritesheet('robotAnims', 'assets/Robot.png', { frameWidth: 192, frameHeight: 64 });
        this.load.spritesheet('tank', 'assets/Tank.png', { frameWidth: 50, frameHeight: 62 });
        this.load.spritesheet('rocket', 'assets/Rocket.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('bullet', 'assets/Bullet.png', { frameWidth: 24, frameHeight: 24 });
        this.load.image('hook', 'assets/Hook.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('rope', 'assets/TinyRope.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('explosion', 'assets/Explosion.png', { frameWidth: 256, frameHeight: 256 });
    }
    
    create() {
        this.board = this.physics.add.group({ key: 'space', repeat: 63 });

        let c = this.board.getChildren();

        Phaser.Actions.GridAlign(c, { width: 8, cellWidth: tileSize, cellHeight: tileSize, x: firstTile, y: firstTile });

        this.rockets = this.physics.add.group({ key: 'rocket', classType: Rocket });

        this.anims.create({
            key: 'shoot',
            frames: this.anims.generateFrameNumbers('tank', { frames: [0, 1] }),
            frameRate: 4,
            repeat: 0
        });

        this.anims.create({
            key: 'rocketOut',
            frames: this.anims.generateFrameNumbers('robotAnims', { frames: [0, 8, 9, 10, 11, 12, 13, 14, 15] }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'rocketIn',
            frames: this.anims.generateFrameNumbers('robotAnims', { frames: [15, 16, 0] }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'hookOut',
            frames: this.anims.generateFrameNumbers('robotAnims', { frames: [0, 7, 6, 5, 4, 3, 2] }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'hookIn',
            frames: this.anims.generateFrameNumbers('robotAnims', { frames: [2, 3, 4, 5, 6, 7, 0] }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { frames: [0, 1, 2, 3, 4] }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('rocket', { frames: [0, 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        });

        this.tank = new Tank(this, this.getTile(0), this.getTile(0));
        this.robot = new Robot(this, this.getTile(0), this.getTile(7), this.rockets, null);

        this.start = new StartButton(this, 400, 300, () => this.startAction());

        console.log("beanz");
    }
    
    update() {
        
    }

    getTile(num) {
        return firstTile + tileSize * num;
    }

    startAction() {
        console.log("start");
    }
}

class Button extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, sprite, action) {
        super(scene, x, y);

        this.setTexture(sprite);
        this.setPosition(x, y);
        this.setInteractive();
        this.on('pointerover', () => this.setTint(0xcccccc));
        this.on('pointerout', () => this.clearTint());
        this.on('pointerdown', () => this.setTint(0x333333));
        this.on('pointerup', () => {
            this.setTint(0xcccccc);
            action();
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

class StartButton extends Button {
    constructor(scene, x, y, action) {
        super(scene, x, y, "startButton", action);

        scene.add.existing(this);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

class Rocket extends Phaser.Physics.Arcade.Sprite {
    dir;
    slide;
    fakex;
    fakey;
    robot;

    constructor(scene, x, y) {
        super(scene, x, y, "rocket");

        this.fakex = x;
        this.fakey = y;

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.endAnim()); 

        this.slide = scene.tweens.add({
            targets: this,
            x: this.fakex,
            y: this.fakey,
            ease: 'Power0',
            onComplete: this.explode,
            callbackScope: this,
            duration: 8000,
            paused: true
        });

        switch (this.dir) {
            case 0:
                this.fakey -= tileSize;
                break;

            case 1:
                this.fakex += tileSize;
                break;

            case 2:
                this.fakey += tileSize;
                break;

            case 3:
                this.fakex -= tileSize;
                break;

            default:
                this.explode();
        }
    }

    make(scene, dir, robot) {
        this.dir = dir;
        this.robot = robot;

        switch (dir) {
            case 0:
                this.x = robot.x + tileSize;
                this.y = robot.y;
                this.fakex = this.x;
                this.fakey = this.y + tileSize * 8;
                break;

            case 1:
                this.x = robot.x;
                this.y = robot.y - tileSize;
                this.fakex = this.x + tileSize * 8;
                this.fakey = this.y;
                break;

            case 2:
                this.x = robot.x - tileSize;
                this.y = robot.y;
                this.fakex = this.x;
                this.fakey = this.y - tileSize * 8;
                break;

            case 3:
                this.x = robot.x;
                this.y = robot.y + tileSize;
                this.fakex = this.x - tileSize * 8;
                this.fakey = this.y;
                break;

            default:
                this.explode();
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.play("fly");

        this.slide.play();
    }

    endAnim() {
        this.robot.weaponGone();
        this.destroy();
    }

    explode() {
        this.play('explode');
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.setAngle(this.dir * 90);

        if (this.slide.isPlaying()) {
            this.slide.updateTo('x', this.fakex, true);
            this.slide.updateTo('y', this.fakey, true);
        }

        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 650) {
            this.explode();
        }
    }
}

class Robot extends Phaser.Physics.Arcade.Sprite {
    dir;
    anim;
    slide;
    fakex;
    fakey;
    attackDone;
    rockets;
    hooks;
    scene;

    constructor(scene, x, y, rockets, hooks) {
        super(scene, x, y, "robot");

        this.dir = 0;
        this.anim = -1;
        this.rockets = rockets;
        this.hooks = hooks;
        this.attackDone = true;
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.endAnim()); 

        //test
        this.setInteractive();
        this.on('pointerdown', () => this.attack(this.dir));
        this.on('pointerover', () => this.turnRight());

        this.fakex = x;
        this.fakey = y;

        this.slide = scene.tweens.add({
            targets: this,
            x: this.fakex,
            y: this.fakey,
            ease: 'Power1',
            paused: true,
            onComplete: this.afterTween,
            callbackScope: this,
            duration: 2000
        });
    }

    attack(dir) {
        this.attackDone = false;

        if (dir < 2) {
            this.rocketShoot();
        }
        else {
            this.hookShoot();
        }
    }

    weaponGone() {
        switch (this.anim) {
            case 0:
                this.rocketAway();
                break;

            case 1:
                this.hookAway();
                break;
        }

        this.anim = 2;
    }

    endAnim() {
        switch (this.anim) {
            case 0:
                this.rocketSpawn();
                break;

            case 1:
                this.hookSpawn();
                break;

            default:
                this.setTexture("robot");
                this.anim = -1;
                this.attackDone = true;
        }
    }

    turnLeft() {
        this.dir--;
    }

    turnRight() {
        this.dir++;
    }

    afterTween() {

    }

    move() {
        if (!this.slide.isPlaying() && !this.anims.isPlaying) {
            switch (this.dir) {
                case 0:
                    this.fakey -= tileSize;
                    break;

                case 1:
                    this.fakex += tileSize;
                    break;

                case 2:
                    this.fakey += tileSize;
                    break;

                case 3:
                    this.fakex -= tileSize;
                    break;
            }

            this.slide.play();
        }
    }

    rocketShoot() {
        this.anim = 0;
        this.play("rocketOut");
    }

    rocketSpawn() {
        this.rockets.get().make(this.scene, this.dir, this);
    }

    rocketAway() {
        this.play("rocketIn");
    }

    hookShoot() {
        this.anim = 1;
        this.play("hookOut");
    }

    hookSpawn() {

    }

    hookAway() {
        this.play("hookIn");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.setAngle(this.dir * 90);

        if (this.dir > 3) {
            this.dir = 0;
        }
        else if (this.dir < 0) {
            this.dir = 3;
        }

        if (this.slide.isPlaying()) {
            this.slide.updateTo('x', this.fakex, true);
            this.slide.updateTo('y', this.fakey, true);
        }
    }
}

class Tank extends Phaser.Physics.Arcade.Sprite {
    dir;
    slide;
    fakex;
    fakey;

    constructor(scene, x, y) {
        super(scene, x, y, "tank");

        this.dir = 1;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.endAnim()); 

        //test
        this.setInteractive();
        this.on('pointerdown', () => this.move());
        this.on('pointerover', () => this.turnRight());

        this.fakex = x;
        this.fakey = y;

        this.slide = scene.tweens.add({
            targets: this,
            x: this.fakex,
            y: this.fakey,
            ease: 'Power1',
            paused: true,
            onComplete: this.afterTween,
            callbackScope: this,
            duration: 2000
        });
    }

    endAnim() {
        this.setTexture("tank");
    }

    turnLeft() {
        this.dir--;
    }

    turnRight() {
        this.dir++;
    }

    afterTween() {

    }

    move() {
        if (!this.slide.isPlaying()) {
            switch (this.dir) {
                case 0:
                    this.fakey -= tileSize;
                    break;

                case 1:
                    this.fakex += tileSize;
                    break;

                case 2:
                    this.fakey += tileSize;
                    break;

                case 3:
                    this.fakex -= tileSize;
                    break;
            }

            this.slide.play();
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.setAngle(this.dir * 90);

        if (this.dir > 3) {
            this.dir = 0;
        }
        else if (this.dir < 0) {
            this.dir = 3;
        }

        if (this.slide.isPlaying()) {
            this.slide.updateTo('x', this.fakex, true);
            this.slide.updateTo('y', this.fakey, true);
        }
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 650,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
