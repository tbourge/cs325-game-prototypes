import "./phaser.js";

var space;
var text1, text2;
var p, f, m;
var count, score, burnt;
var timer1, timer2;

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
    }
    
    preload() {
        this.load.audio("fireSound", "assets/fireSound.mp3");
        this.load.audio("bubbleSound", "assets/boilingSound.mp3");

        this.load.path = 'assets/Anim/';

        this.load.image('pot0', 'Pot0.png');
        this.load.image('pot1', 'Pot1.png');
        this.load.image('pot2', 'Pot2.png');
        this.load.image('pot3', 'Pot3.png');
        this.load.image('pot4', 'Pot4.png');
        this.load.image('pot5', 'Pot5.png');
        this.load.image('pot6', 'Pot6.png');
        this.load.image('pot7', 'Pot7.png');
        this.load.image('pot8', 'Pot8.png');
        this.load.image('pot9', 'Pot9.png');
        this.load.image('pot10', 'Pot10.png');
        this.load.image('pot11', 'Pot11.png');

        this.load.image('fire0', 'fire0.png');
        this.load.image('fire1', 'fire1.png');
        this.load.image('fire2', 'fire2.png');
        this.load.image('fire3', 'fire3.png');
        this.load.image('fire4', 'fire4.png');
        this.load.image('fire5', 'fire5.png');
        this.load.image('fire6', 'fire6.png');
        this.load.image('fire7', 'fire7.png');

        this.load.image('man0', 'man0.png');
        this.load.image('man1', 'man1.png');
        this.load.image('man2', 'man2.png');
        this.load.image('man3', 'man3.png');
        this.load.image('man4', 'man4.png');

        this.load.image('burn0', 'burn0.png');
        this.load.image('burn1', 'burn1.png');

        this.load.image('dance0', 'dance0.png');
        this.load.image('dance1', 'dance1.png');
    }

    create() {    
        text1 = this.add.text(150, 500, { fontSize: 1000 });
        text2 = this.add.text(150, 550, { fontSize: 1000 });

        //Copied from phaser basic playback example
        this.fireSound = this.sound.add("fireSound");
        this.fireSound.setLoop(true);
        this.fireSound.stop();
        this.bubbleSound = this.sound.add("bubbleSound", { volume: 0.2 });
        this.bubbleSound.setLoop(true);

        text1.setText('Your goal is to stop cooking after 20 seconds.');
        text2.setText('Press SPACEBAR to START/STOP cooking.');

        score = 0;
        burnt = false;

        count = 0;

        //Copied from phaser keyboard press example.
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Copied from phaser timer example.
        timer1 = this.time.addEvent({ delay: 200, callback: this.gainScore, callbackScope: this, repeat: 100, paused: true });
        timer2 = this.time.addEvent({ delay: 10, callback: this.loseScore, callbackScope: this, repeat: 99, paused: true });

        //Copied from phaser animation from series of images example.
        this.anims.create({
            key: 'boiling',
            frames: [
                { key: 'pot1' },
                { key: 'pot2' },
                { key: 'pot3' },
                { key: 'pot4' },
                { key: 'pot5' },
                { key: 'pot6' },
                { key: 'pot7' },
                { key: 'pot8' },
                { key: 'pot9' },
                { key: 'pot10' },
                { key: 'pot11', duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'fire',
            frames: [
                { key: 'fire0' },
                { key: 'fire1' },
                { key: 'fire2' },
                { key: 'fire3' },
                { key: 'fire4' },
                { key: 'fire5' },
                { key: 'fire6' },
                { key: 'fire7', duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'burn',
            frames: [
                { key: 'burn0' },
                { key: 'burn1', duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'dance',
            frames: [
                { key: 'dance0' },
                { key: 'dance1', duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'stir',
            frames: [
                { key: 'man0' },
                { key: 'man1' },
                { key: 'man2' },
                { key: 'man3' },
                { key: 'man4', duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });

        p = this.add.sprite(400, 300, 'pot0');
            
        f = this.add.sprite(400, 300, 'fire0').play('fire');
        f.setVisible(false);

        m = this.add.sprite(340, 236, 'man0');        
    }
    
    update() {
        //Copied from phaser keyboard press example.
        if (Phaser.Input.Keyboard.JustDown(space)) {
            if (count > 1) {
                this.scene.restart();                
            }
            else {
                if (count > 0) {
                    timer1.paused = true;
                    timer2.paused = true;

                    text2.setText('Press SPACEBAR to RESTART.');

                    if (score > 99) {
                        text1.setText('Score: ' + score + ' Perfect!');

                        m.x -= 64;
                        m.play('dance');
                    }
                    else {
                        if (score > 89) {
                            text1.setText('Score: ' + score + ' Great');

                            m.x -= 64;
                            m.play('dance');
                        }
                        else {
                            if (score > 69) {
                                text1.setText('Score: ' + score + ' Good');
                            }
                            else {
                                if (burnt) {
                                    text1.setText('Score: ' + score + ' Burnt');
                                }
                                else {
                                    text1.setText('Score: ' + score + ' Undercooked');
                                }
                            }
                        }
                    }
                }
                else {
                    m.play('stir');
                    p.play('boiling');

                    this.bubbleSound.play()
                    timer1.paused = false;
                }
            }
            count++;            
        }
        
    }

    gainScore() {
        if (score < 100) {
            score++;
        }
        else {
            timer2.paused = false;

            f.setVisible(true);

            this.fireSound.play();
            this.bubbleSound.stop();

            p.setVisible(false);

            m.play('burn');
            m.x -= 48;
            burnt = true;
        }
    }

    loseScore() {
        score--;
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
