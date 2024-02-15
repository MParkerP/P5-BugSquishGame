let bugs = [];

class Bug
{
  constructor(sheetPath, xPos, yPos)
  {
    this.xPos = xPos;
    this.yPos = yPos;
    this.sprite = new Sprite(xPos, yPos, 32, 32);
    this.sprite.spriteSheet = sheetPath;
    this.sprite.anis.frameDelay = 6;
    this.animations = {
      walkLeft: {row: 0, frames: 8},
      squished: {row: 1, frames: 1}
    };
    this.sprite.addAnis(this.animations);
    this.sprite.changeAni('walkLeft');
  }
}

function preload()
{
    let newBug = new Bug('assets/BugAnimations.png', 100, 100);
    bugs.unshift(newBug);

}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  clear();
  background(220);

  //animations are drawn last
  scale(2);
}
