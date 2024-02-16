//variables and containers
let bugs = [];
let currentBugSpeed = 1;
let speedIncrement = 0.1;
let respawnDelay = 3;
let timeRemaining = 30;
let currentScore = 0;
let gameState = 'starting';

//class for the bugs that are to be squished
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

  //handle bug squishing based on how close a mouseclick is to the bug
  handleClick()
  {
    let distance = Math.sqrt(((this.sprite.x-mouseX)*(this.sprite.x-mouseX))+((this.sprite.y-mouseY)*(this.sprite.y-mouseY)));
    if (distance < 20 && !this.isDead)
    {
      currentBugSpeed += speedIncrement;
      this.sprite.velocity.x = 0;
      this.sprite.changeAni('squished');
      this.isDead = true;
      addToScore(1);
    }
  }

  //pick a new spawn location and begin movement immediately
  //called once time of death reaches designated amount
  respawn()
  {
    if (gameState == 'running')
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
  }

  //move to opposite side of screen determined by current direction of movement
  flipSides()
  {
      if (this.sprite.velocity.x > 0)
      {
        this.sprite.scale.x = 1;
        this.sprite.x = 415;
        this.sprite.y = randomYSpawn();
        this.sprite.velocity.x = -currentBugSpeed;
        
      }
      else if (this.sprite.velocity.x < 0)
      {
        this.sprite.scale.x = -1;
        this.sprite.x = -15;
        this.sprite.y = randomYSpawn();
        this.sprite.velocity.x = currentBugSpeed;
        
      }
  }
}


//USEFUL FUNCTIONS//

//pick random side of screen to spawn
function randomXSpawn()
{
  let position;
  let sides = [0,1]
  let side = random(sides);
  switch (side)
  {
    case 0:
      position = 415;
      break;
    case 1:
      position = -15;
      break;
  }
  return position;
}

//generate random approprite y position for bugs
function randomYSpawn()
{
  return random(50, 430);
}

//[to be called only after 'resetBugs()']
//gives all bugs movement in proper direction
function startBugs()
{
  bugs.forEach(element => {
    if(element.xPos < 0)
    {
      element.sprite.scale.x = -1;
      element.sprite.velocity.x = currentBugSpeed;
    }
    else
    {
      element.sprite.scale.x = 1;
      element.sprite.velocity.x = -currentBugSpeed;
    }
  });
}

//create all instances of the bugs that will be used
//place bugs in container to access all of them
function spawnBug()
{
  let newBug = new Bug('assets/BugAnimations.png');
  bugs.unshift(newBug);
}

//move bugs to other side of screen when crossing the other
function flipBugs()
{
  bugs.forEach(element => {
    if (element.sprite.x > 420 || element.sprite.x < -20)
    {
      element.flipSides();
    }
  });
}

//if a bug is dead, a timer will be used increment how long it has been dead
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

//place bugs in new spawn positions off screen w/o movement
function resetBugs()
{
  bugs.forEach(element => {
    element.sprite.velocity.x = 0;
    element.sprite.changeAni('walkLeft');
    element.sprite.x = randomXSpawn();
    element.sprite.y = randomYSpawn();
    currentBugSpeed = 1;
  });
}

//BUILT-IN FUNCTIONS//
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

function draw() {
  //background
  clear();
  background('brown');

  //GAME STATE//

  //handle timer
  textAlign(CENTER);
  textFont('Courier New');
  textStyle(BOLD);
  textSize(20);

  text("Time: " + ceil(timeRemaining), width/2,20);

  //when game is running
  if (gameState == 'running')
  {
    timeRemaining -= deltaTime/1000;
    text("Score: " + currentScore, width/2, 40);
    
    if (timeRemaining <= 0)
    {
      gameState = 'ending';
      resetBugs();
    }
  }

  //when game has ended (time reached zero)
  if (gameState == 'ending')
  {
    fill('gray');
    rect(0,0,width,height);
    fill('black');
    text("You squished " + currentScore + " bugs!", width/2, height/2 - 15);
    text("Press 'R' to restart.",width/2, height/2 + 15);
  }

  //when game is starting, having just been loaded and not running
  if (gameState == 'starting')
  {
    fill('gray');
    rect(0,0,width,height);
    fill('black');
    text("Press 'S' to start!",width/2, height/2);
  }

  //handle bug behavior
  flipBugs();
  addToRespawnTimers();
}

function keyTyped()
{
  if (key === 's' && gameState == 'starting')
  {
    gameState = 'running';
    startBugs();
  }

  if (key === 'r' && gameState == 'ending')
  {
    timeRemaining = 30;
    currentScore = 0;
    gameState = 'running';
    startBugs();
  }
}


