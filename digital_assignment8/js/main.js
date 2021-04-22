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
        this.hooks;

        this.robot;
        this.tanks;

        this.tank;

        this.start;
    }
    
    preload() {
        this.load.image('space', 'assets/Square.png');
        this.load.image("startButton", "assets/START.png");
        this.load.image("robot", "assets/Rob.png");
        this.load.spritesheet('robotAnims', 'assets/Robot.png', { frameWidth: 192, frameHeight: 64 });
        this.load.spritesheet('tank', 'assets/Tank.png', { frameWidth: 62, frameHeight: 62 });
        this.load.spritesheet('rocket', 'assets/Rocket.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('bullet', 'assets/Bullet.png', { frameWidth: 24, frameHeight: 24 });
        this.load.image('hook', 'assets/Hook.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('rope', 'assets/TinyRope.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('explosion', 'assets/Explosion.png', { frameWidth: 224, frameHeight: 224 });
    }
    
    create() {
        this.board = this.physics.add.group({ key: 'space', repeat: 63 });

        let c = this.board.getChildren();

        Phaser.Actions.GridAlign(c, { width: 8, cellWidth: tileSize, cellHeight: tileSize, x: firstTile, y: firstTile });

        this.rockets = this.physics.add.group({ key: 'rocket', classType: Rocket });
        this.hooks = this.physics.add.group({ key: 'hook', classType: Hook });
        this.tanks = this.physics.add.group({ key: 'tank', classType: Tank });

        this.rockets.getChildren().forEach(function (r) {
            r.setVisible(false);
            r.setActive(false);
            r.body.enable = false;
        });

        this.hooks.getChildren().forEach(function (h) {
            h.setVisible(false);
            h.setActive(false);
            h.body.enable = false;
        });

        this.tanks.getChildren().forEach(function (t) {
            t.setVisible(false);
            t.setActive(false);
            t.body.enable = false;
        });

        this.physics.add.collider(this.rockets, this.tanks, function (r, t) {
            r.explode();

            t.destroy();

            this.robot.score++;
        }.bind(this));

        this.physics.add.collider(this.hooks, this.tanks, function (h, t) {
            if (!h.hasHit) {
                t.pulled(h);

                h.hit(t);
            }
        }.bind(this));

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
            frames: this.anims.generateFrameNumbers('robotAnims', { frames: [0, 7, 6, 5, 4, 3, 2, 1] }),
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

        this.tank = this.tanks.create(this.getCoord(0), this.getCoord(0));
        this.robot = new Robot(this, this.getCoord(3), this.getCoord(4), this.rockets, this.hooks);

        this.start = new StartButton(this, 400, 300, () => this.startAction());

        console.log("beanz");
    }
    
    update() {
        
    }

    getCoord(num) {
        return firstTile + tileSize * num;
    }

    getTile(num) {
        return Phaser.Math.RoundTo(tileSize / num) - firstTile;
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

     //   scene.add.existing(this);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

class Hook extends Phaser.Physics.Arcade.Sprite {
    dir;
    robot;
    hasHit;
    tank;

    constructor(scene, x, y) {
        super(scene, x, y, "hook");
        this.hasHit = false;
        this.robot = null;
        this.tank = null;
    }

    make(robot) {
        this.robot = robot;
        this.dir = robot.dir;
        this.setAngle(this.dir * 90);

        robot.scene.add.existing(this);
        robot.scene.physics.add.existing(this);

        this.hasHit = false;

        switch (this.dir) {
            case 0:
                this.x = robot.x + tileSize;
                this.y = robot.y;
                break;

            case 1:
                this.x = robot.x;
                this.y = robot.y + tileSize;
                break;

            case 2:
                this.x = robot.x - tileSize;
                this.y = robot.y;
                break;

            case 3:
                this.x = robot.x;
                this.y = robot.y - tileSize;
                break;

            default:
                this.retract();
        }
    }

    hit(tank) {
        this.tank = tank;
        this.retract();
    }

    retract() {
        this.hasHit = true;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        let speed = 2;

        if (this.hasHit) {
            speed = -2;
        }

        switch (this.dir) {
            case 0:
                this.y -= speed;

                if (this.y >= this.robot.y - tileSize && this.tank != null) {
                    this.tank.letGo();
                }

                break;

            case 1:
                this.x += speed;

                if (this.x <= this.robot.x + tileSize && this.tank != null) {
                    this.tank.letGo();
                }

                break;

            case 2:
                this.y += speed;

                if (this.y <= this.robot.y + tileSize && this.tank != null) {
                    this.tank.letGo();
                }

                break;

            case 3:
                this.x -= speed;

                if (this.x >= this.robot.x - tileSize && this.tank != null) {
                    this.tank.letGo();
                }

                break;

            default:
                this.retract();
        }

        if (this.robot != null && (this.x === this.robot.x || this.y === this.robot.y)) {
            this.robot.weaponGone();
            this.destroy();
        }

        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 650) {
            this.retract();
        }
    }
}


class Rocket extends Phaser.Physics.Arcade.Sprite {
    dir;
    robot;
    hasExploded;
    damage = 2;

    constructor(scene, x, y) {
        super(scene, x, y, "rocket");
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.endAnim()); 
    }

    make(robot) {
        robot.scene.add.existing(this);
        robot.scene.physics.add.existing(this);

        this.dir = robot.dir;
        this.robot = robot;
        this.hasExploded = false;

        this.setAngle(this.dir * 90);

        switch (this.dir) {
            case 0:
                this.x = robot.x - tileSize;
                this.y = robot.y;
                break;

            case 1:
                this.x = robot.x;
                this.y = robot.y - tileSize;
                break;

            case 2:
                this.x = robot.x + tileSize;
                this.y = robot.y;
                break;

            case 3:
                this.x = robot.x;
                this.y = robot.y + tileSize;
                break;

            default:
                this.explode();
        }

        this.play("fly");
    }

    endAnim() {
        this.robot.weaponGone();
        this.destroy();
    }

    explode() {
        if (!this.hasExploded) {
            this.play('explode');
            this.hasExploded = true;
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        let speed = 2;

        if (this.hasExploded) {
            speed = 0;
        }

        switch (this.dir) {
            case 0:
                this.y -= speed;
                break;

            case 1:
                this.x += speed;
                break;

            case 2:
                this.y += speed;
                break;

            case 3:
                this.x -= speed;
                break;

            default:
                this.explode();
        }

        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 650) {
            this.endAnim();
        }
    }
}

class Robot extends Phaser.Physics.Arcade.Sprite {
    dir;
    anim;
    slide;
    t;
    r;
    rot
    fakex;
    fakey;
    attackDone;
    rockets;
    hooks;
    scene;
    health;
    score;

    constructor(scene, x, y, rockets, hooks) {
        super(scene, x, y, "robot");

        this.dir = 0;
        this.rot = this.dir * 90;
        this.t = this.rot;
        this.setAngle(this.t);
        this.r = false;
        this.anim = -1;
        this.rockets = rockets;
        this.hooks = hooks;
        this.attackDone = true;
        this.scene = scene;
        this.health = 10;
        this.score = 0;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.endAnim()); 

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

        //test
        this.setInteractive();
        this.on('pointerdown', () => this.attack(this.dir));
        this.on('pointerover', () => {
            if (!this.slide.isPlaying()) {
                this.turnRight();
            }
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
        if (this.dir < 1) {
            this.dir = 3;
        }
        else {
            this.dir--;
        }

        this.r = false;

        this.rot = this.dir * 90;
    }

    turnRight() {
        if (this.dir > 2) {
            this.dir = 0;
        }
        else {
            this.dir++;
        }

        this.r = true;

        this.rot = this.dir * 90;
    }

    afterTween() {

    }

    move() {
        if (!this.slide.isPlaying() && !this.anims.isPlaying && this.t === this.rot) {
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
        this.rockets.create().make(this);
    }

    rocketAway() {
        this.play("rocketIn");
    }

    hookShoot() {
        this.anim = 1;
        this.play("hookOut");
    }

    hookSpawn() {
        this.hooks.create().make(this);
    }

    hookAway() {
        this.play("hookIn");
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        let speed = 2;

        if (this.t != this.rot) {
            if (this.r) {
                this.t += speed;
            }
            else {
                this.t -= speed;
            }

            if (this.t > 359) {
                this.t = 0;
            }
            else if (this.t < 0) {
                this.t = 358;
            }

            this.setAngle(this.t);
        }

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
    rot;
    r;
    t;
    fakex;
    fakey;
    health;
    hook;
    isPulled;

    constructor(scene, x, y) {
        super(scene, x, y, "tank");

        this.dir = 2;
        this.rot = this.dir * 90;
        this.t = this.rot;
        this.setAngle(this.t);
        this.health = 4;
        this.hook = null;
        this.isPulled = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.endAnim()); 

        //test
        this.setInteractive();
        this.on('pointerdown', () => this.move());
        this.on('pointerover', () => {
            if (!this.slide.isPlaying()) {
                this.turnRight();
            }
        });

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

        this.r = false;
    }

    getCoord(num) {
        return firstTile + tileSize * num;
    }

    getTile(num) {
        return Phaser.Math.RoundTo(tileSize / num) - firstTile;
    }

    retile() {
        this.x = this.getCoord(this.getTile(this.x));
        this.y = this.getCoord(this.getTile(this.y));

    }

    pulled(h) {
        this.hook = h;
        this.isPulled = true;
    }

    letGo() {
        this.isPulled = false;
        this.retile();
        this.fakex = this.x;
        this.fakey = this.y;
    }

    endAnim() {
        this.setTexture("tank");
    }

    turnLeft() {
        if (this.dir < 1) {
            this.dir = 3;
        }
        else {
            this.dir--;
        }

        this.r = false;

        this.rot = this.dir * 90;
    }

    turnRight() {
        if (this.dir > 2) {
            this.dir = 0;
        }
        else {
            this.dir++;
        }

        this.r = true;

        this.rot = this.dir * 90;
    }

    afterTween() {

    }

    move() {
        if (!this.slide.isPlaying() && this.t === this.rot) {
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

        if (this.slide.isPlaying() || this.isPulled) {
            this.slide.updateTo('x', this.fakex, true);
            this.slide.updateTo('y', this.fakey, true);
        }

        let speed = 2;

        if (this.t != this.rot) {
            if (this.r) {
                this.t += speed;
            }
            else {
                this.t -= speed;
            }

            if (this.t > 359) {
                this.t = 0;
            }
            else if (this.t < 0) {
                this.t = 358;
            }

            this.setAngle(this.t);
        }

        if (this.hook != null && this.isPulled) {
            this.x = this.hook.x;
            this.y = this.hook.y;
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
