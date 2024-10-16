// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  //player parameters
  this.playerSpeed = 150;
  this.playerJump = -500;

  //set platform parameters for levels
  //https://www.freeformatter.com/json-formatter.html
};

// load asset files for our game
gameScene.preload = function() {

  // load images
  this.load.image('background', './img/assets/fondo.png');
  this.load.image('plataforma', './img/assets/plataforma.png');
  this.load.image('superPlataforma', './img/assets/superplataforma.png');
  this.load.image('arbustos', './img/assets/ArbustosFrente.png');
  this.load.image('flores', './img/assets/Flores.png');
  this.load.json('levelData', './data/levelData.json');


  this.load.spritesheet('hams', './img/assets/hamsCaminando2.png', {
    frameWidth: 79,
    frameHeight: 99,
    margin: 1,
    spacing: 1
  });
};

// executed once, after assets were loaded
gameScene.create = function() {

  this.add.image(0,0,'background').setOrigin(0,0).setScale(1);
  //this.setupLevel();

  this.input.on('pointerdown', function (pointer) {
    console.log("🦐" + pointer.x, pointer.y);
  });
  this.add.image(300,460,'flores').setOrigin(0,0).setScale(1);

  this.hams=this.physics.add.sprite(0,0 ,'hams',true);
  this.hams.setOrigin(0,0);
  


  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('hams', {start: 0, end: 36}),
    frameRate: 12,
    yoyo: true,
    repeat: -1
});
this.hams.body.allowGravity = true;
this.cursors = this.input.keyboard.createCursorKeys();
this.hams.body.collideWorldBounds = true;

this.levelData = this.cache.json.get('levelData');

  //create platforms
  this.platforms = this.physics.add.staticGroup();
  
  this.levelData.platforms.forEach((item)=>{
    let platform;
    if(item.tiles == 1){
      platform = this.add.sprite(item.x, item.y, item.key).setOrigin(0,0);
    }else{
      let w = this.textures.get(item.key).get(0).width;
      let h = this.textures.get(item.key).get(0).height;
      //create tile sprite
      platform = this.add.tileSprite(item.x, item.y, item.tiles*w, h, item.key);
    }
    //enable physics
    this.physics.add.existing(platform, true);
    //add sprite to group
    this.platforms.add(platform);
    this.physics.add.collider(this.hams, this.platforms);
    this.add.image(0,600,'arbustos').setOrigin(0,0).setScale(1);
  });
  

    //fire animation
    /* this.anims.create({
      key: 'burning',
      frames: this.anims.generateFrameNumbers('fire', {start: 0, end: 1}),
      frameRate: 4,
      repeat: -1
    });

    //camera bounds
    this.cameras.main.setBounds(0, 0, 360, 650);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

  
    this.goal.body.collideWorldBounds = true;

    //collision detection between player and platforms
    this.physics.add.collider([this.player, this.goal], this.platforms);

    //overlap detection between player and fires
    this.physics.add.overlap(this.player, [this.fires, this.goal], this.restartGame, null, this);

    //enable cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();

    */

};

gameScene.update = function() {
  let onGround = this.hams.body.onFloor()

  if (this.cursors.left.isDown) {
    this.hams.body.setVelocityX(-this.playerSpeed);
    this.hams.flipX = true;
    //validate if animation is not already playing
    if(!this.hams.anims.isPlaying){
      this.hams.anims.play('walk');
    }
    
  }else if(this.cursors.right.isDown){
    this.hams.body.setVelocityX(this.playerSpeed);
    this.hams.flipX = false;
    //validate if animation is not already playing
    if(!this.hams.anims.isPlaying){
      this.hams.anims.play('walk');
    }
  }else{
    this.hams.body.setVelocityX(0);
    //stop animation
    this.hams.anims.stop('walk');
    //set default frame
    this.hams.setFrame(3);
  }

  if((this.cursors.up.isDown || this.cursors.space.isDown) && onGround){
    this.hams.body.setVelocityY(this.playerJump);
  }

  /*

//setup elements in the level
gameScene.setupLevel = function() {

  //load json data
  this.levelData = this.cache.json.get('levelData');

  //create platforms
  this.platforms = this.physics.add.staticGroup();
  
  this.levelData.platforms.forEach((item)=>{
    let platform;
    if(item.tiles == 1){
      platform = this.add.sprite(item.x, item.y, item.key).setOrigin(0,0);
    }else{
      let w = this.textures.get(item.key).get(0).width;
      let h = this.textures.get(item.key).get(0).height;
      //create tile sprite
      platform = this.add.tileSprite(item.x, item.y, item.tiles*w, h, item.key);
    }
    //enable physics
    this.physics.add.existing(platform, true);
    //add sprite to group
    this.platforms.add(platform);
  });

  //create fires
  /*this.fires = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  this.levelData.fires.forEach((item)=>{
    let fire = this.add.sprite(item.x, item.y, 'fire').setOrigin(0,0);

    //enable physics
    this.add.existing(fire, true);

    //play burning animation
    fire.anims.play('burning');

    //add sprite to group
    this.fires.add(fire);

  });

  //player - last number it's frame number in sprite sheet
  this.player = this.add.sprite(this.levelData.player.x, this.levelData.player.y, 'player', 3);
  this.physics.add.existing(this.player);

  //constraint player to the world
  this.player.body.collideWorldBounds = true;

  //set goal element
  this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal').setOrigin(0, 0);
  this.physics.add.existing(this.goal);
*/
}

//restart game
gameScene.restartGame = function() {
  console.log("restart game ");
  //fade out camera
  this.cameras.main.fade(1000);

  //when fade is completed, restart game
  this.cameras.main.on('camerafadeoutcomplete', function (camera, effect) {
    //restart game 
    this.scene.restart();
  }, this)
  
}

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 700,
  scene: gameScene,
  title: 'Hams - The Game',
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  }
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);