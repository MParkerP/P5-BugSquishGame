let bugs = [];
let currentBugSpeed = 1;
let speedIncrement = 0.1;
let respawnDelay = 3;
let timeRemaining = 30;
let currentScore = 0;
let gameOver = false;

class Bug
{
  constructor(sheetPath)
  {
    this.respawnTimer = 0;
    this.isDead = false;
    this.xPos = randomXSpawn();
    this.yPos = randomYSpawn();
    this.sprite = new Sprite(this.xPos, this.yPos, 32, 32);
    this.sprite.spriteSheet = sheetPath;
    this.sprite.anis.frameDelay = 3;
    this.animations = {
      walkLeft: {row: 0, frames: 8},
      squished: {row: 1, frames: 1}
    };
    this.sprite.addAnis(this.animations);
    this.sprite.changeAni('walkLeft');
    this.sprite.collider = 'none';
  }

  handleClick()
  {
    let distance = Math.sqrt(((this.sprite.x-mouseX)*(this.sprite.x-mouseX))+((this.sprite.y-mouseY)*(this.sprite.y-mouseY)));
    console.log(distance);
    if (distance < 10 && !this.isDead)
    {
      currentBugSpeed += speedIncrement;
      this.sprite.velocity.x = 0;
      this.sprite.changeAni('squished');
      this.isDead = true;
      addToScore(1);
    }
  }

  respawn()
  {
    let newX = randomXSpawn();
    let newY = randomYSpawn();

    this.sprite.changeAni('walkLeft');
    this.sprite.x = newX;
    this.sprite.y = newY;


    if(this.xPos < 0)
    {
      this.sprite.scale.x = -1;
      this.sprite.velocity.x = currentBugSpeed;
    }
    else
    {
      this.sprite.velocity.x = -currentBugSpeed;
    }
  }

  flipSides()
  {
      if (this.sprite.velocity.x > 0)
      {
        this.sprite.scale.x = 1;
        this.sprite.x = 405;
        this.sprite.y = randomYSpawn();
        this.sprite.velocity.x = -currentBugSpeed;
        
      }
      else if (this.sprite.velocity.x < 0)
      {
        this.sprite.scale.x = -1;
        this.sprite.x = -5;
        this.sprite.y = randomYSpawn();
        this.sprite.velocity.x = currentBugSpeed;
        
      }
  }
}

function randomXSpawn()
{
  let position;
  let sides = [0,1]
  let side = random(sides);
  switch (side)
  {
    case 0:
      position = 405;
      break;
    case 1:
      position = -5;
      break;
  }
  return position;
}

function randomYSpawn()
{
  return random(50, 430);
}

function spawnBug()
{
  let newBug = new Bug('assets/BugAnimations.png');
  bugs.unshift(newBug);

  if(newBug.xPos < 0)
  {
    newBug.sprite.scale.x = -1;
    newBug.sprite.velocity.x = currentBugSpeed;
  }
  else
  {
    newBug.sprite.velocity.x = -currentBugSpeed;
  }
}

function mouseClicked()
{
  bugs.forEach(element => {
      element.handleClick();
  });
}



function preload()
{
  for (let i = 0; i < 10; i++)
  {
    spawnBug();
  }
  
}

function setup() {
  createCanvas(400, 440);
}

function flipBugs()
{
  bugs.forEach(element => {
    if (element.sprite.x > 410 || element.sprite.x < -10)
    {
      element.flipSides();
    }
  });
}

function addToRespawnTimers()
{
  bugs.forEach(element => {
    if (element.isDead)
    {
      element.respawnTimer += deltaTime/1000;
    }

    if (element.respawnTimer > respawnDelay)
    {
      element.isDead = false;
      element.respawnTimer = 0;
      element.respawn();
    }
  });
}

function addToScore(amount)
{
  currentScore += amount;
}

function draw() {
  //background
  clear();
  background('brown');

  //game state
  textAlign(CENTER);
  textFont('Courier New');
  textStyle(BOLD);
  textSize(20);

  text("Time: " + ceil(timeRemaining), width/2,20);
  timeRemaining -= deltaTime/1000;

  text("Score: " + currentScore, width/2, 40);

  //handle bug behavior
  flipBugs();
  addToRespawnTimers();
}
