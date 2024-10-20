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
  this.load.image('hongo', './img/assets/honguito.png');
  this.load.json('levelData', './data/levelData.json');
  


  this.load.spritesheet('hams', './img/assets/hamsCaminando2.png', {
    frameWidth: 79,
    frameHeight: 99,
    margin: 1,
    spacing: 1
  });

  this.load.spritesheet('fresita', './img/assets/fresita.png', {
    frameWidth: 50,
    frameHeight: 50,
    margin: 1,
    spacing: 1
  });

  this.load.spritesheet('estrellitaAzul', './img/assets/estrellitaAzul.png', {
    frameWidth: 49,
    frameHeight: 49,
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

this.anims.create({
  key: 'fresita',
  frames: this.anims.generateFrameNumbers('fresita', {start: 0, end: 24}),
  frameRate: 12,
  yoyo: true,
  repeat: -1
});

this.anims.create({
  key: 'estrellitaAzul',
  frames: this.anims.generateFrameNumbers('estrellitaAzul', {start: 0, end: 39}),
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

  this.enemies = this.physics.add.group();

//ia
this.levelData.enemies.forEach((enemyData) => {
  let enemy = this.enemies.create(enemyData.x, enemyData.y, 'hongo');
  enemy.setOrigin(0.5, 0.5);
  enemy.body.allowGravity = false;

  // animación de movimiento izquierda a derecha con un retraso aleatorio
  this.tweens.add({
    targets: enemy,
    x: enemy.x + 90, // cantidad de movimiento
    duration: 1020, // duración del movimiento
    yoyo: true, // volver al punto original
    repeat: -1, // repetir indefinidamente
    delay: Phaser.Math.Between(0, 500) // retraso aleatorio para cada hongo
  });
});


this.physics.add.collider(this.hams, this.enemies, () => {
  this.restartGame(); 
});

//FRESAS
this.fresitas = this.physics.add.group();

this.levelData.fresitas.forEach((collectibleData) => {
  let fresita = this.fresitas.create(collectibleData.x, collectibleData.y, 'fresita');
  fresita.setOrigin(0.5, 0.5);
  fresita.body.allowGravity = false;
  fresita.anims.play('fresita');
});

this.physics.add.overlap(this.hams, this.fresitas, (player, fresita) => {
  fresita.destroy(); 
});

this.fresitas = this.physics.add.group();

this.levelData.fresitas.forEach((collectibleData) => {
  let fresita = this.fresitas.create(collectibleData.x, collectibleData.y, 'fresita');
  fresita.setOrigin(0.5, 0.5);
  fresita.body.allowGravity = false;
  fresita.anims.play('fresita');
});

this.physics.add.overlap(this.hams, this.fresitas, (player, fresita) => {
  fresita.destroy(); 
});


///ESTRELLLAAAAA
this.estrellitaAzul = this.physics.add.group();

this.levelData.estrellitaAzul.forEach((collectible2Data) => {
  let estrellitaAzul = this.estrellitaAzul.create(collectible2Data.x, collectible2Data.y, 'estrellitaAzul');
  estrellitaAzul.setOrigin(0.5, 0.5);
  estrellitaAzul.body.allowGravity = false;
  estrellitaAzul.anims.play('estrellitaAzul'); 
});

this.physics.add.overlap(this.hams, this.collectibles, (player, fresita) => {
  fresita.destroy(); 
});

this.physics.add.overlap(this.hams, this.estrellitaAzul, (player, estrellitaAzul) => {
  estrellitaAzul.destroy(); 
});

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