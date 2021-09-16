import Character from './character.js';
import Collision from './collision.js';

const MIN_STEP = 10;
const SPRITE_HEIGHT = 80;
const SPRITE_WIDTH = 80;
const BORDER_WIDTH = 0;
const SPACING_WIDTH = 0;



function gameLoop(timestamp) {

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    updateGame(deltaTime, ctx);
    
    var element = document.getElementById("deathlist");
    element.innerHTML = "";
    for (var i = 0; i < deathList.length; i++) {
        element.innerHTML = element.innerHTML + (i+1) + ". " +  deathList[i] + "<br />";
    }

    requestAnimationFrame(gameLoop);
}

function updateGame(dt, ctx) {
    let step = dt;
    do {
        var hit = findFirstCollision(step);
        if (hit != null) {

            step = Math.max(hit.getTime(), MIN_STEP);
            updateObjects(step);
            updateVelocities(hit, step);
        }
        else {
            updateObjects(step);
            
        }

        for (var i = 0; i < characterList.length; i++) {
            characterList[i].draw(ctx, step);
        }

        dt -= step;
        step = dt;

    } while (dt > 0);

}

function findFirstCollision(dt) {
    var result = null
    for (var i = 0; i < characterList.length; i++) {
        for (var j = i+1; j < characterList.length; j++) {
            var hit = findCollision(i, j, dt);
            if (hit != null) {
                if (result == null || hit.getTime() < result.getTime()) {
                    result = hit;
                }
            }
        }
    }
    return result;
}

function findCollision(i, j, dt) {
    var obj1 = characterList[i];
    var obj2 = characterList[j];
    var obj1Pos = obj1.getPosition();
    var obj2Pos = obj2.getPosition();
    if (obj1Pos.x <= obj2Pos.x + obj2.getWidth() && obj1Pos.x + obj1.getWidth() >= obj2Pos.x && obj1Pos.y + obj1.getHeight() >= obj2Pos.y && obj1Pos.y <= obj2Pos.y + obj2.getHeight()) {
        var dir = 0;
        let col = new Collision(obj1, obj2, dir, dt);
        return col;
    }
    return null;
}

function updateObjects(step) {
    for (var i = 0; i < characterList.length; i++) {
        var character = characterList[i];
        var pos = character.getPosition();
        var v = character.getVelocity();

        character.keepInside();

        console.log(character.getGoal(), character.getPosition());

        character.cooldownAttackTimer(step);

        if (character.isDead()) {
            deathList.push(character.getName());
            
            characterList.splice(i, 1);
            continue;
        }

        if (character.isKBed()) {
            character.setVX(v.x * 0.95);
            character.setVY(v.y * 0.95);
            character.setPosition(pos.x + step * v.x / 1000, pos.y + step * v.y / 1000);
            character.addTime(step);

            if (character.getTime() > 1000) {
                character.setKBed(false);
                character.setRunning(true);
                
                character.setSprite("running");
                character.setTime(0);
            }
        }
        else {
            character.setGoal(character.getClosestEnemy(characterList));
            character.updateVelocities();
    
            character.setPosition(pos.x + (step * v.x / 1000), pos.y + (step * v.y / 1000));
        }
    }
}

function updateVelocities(collision, step) {
    var obj1 = collision.getObj1();
    var obj2 = collision.getObj2();
    if (obj1 != null && obj2 != null) {
        if (obj1.getAttackTimer() == 0 && obj2.getAttackTimer() != 0 ) {
            if (!obj1.isKBed() && !obj2.isKBed()) {
                obj1.hit(obj2, step);
            }
            
        }
        else if (obj1.getAttackTimer() != 0 && obj2.getAttackTimer() == 0) {
            if (!obj1.isKBed() && !obj2.isKBed()) {
                obj2.hit(obj1, step);
            }
        }
        else if (obj1.getAttackTimer() == 0 && obj2.getAttackTimer() == 0){
            var coinflip = Math.floor(Math.random() * 2);

            if(coinflip == 0) {
                if (!obj1.isKBed() && !obj2.isKBed()) {
                    obj1.hit(obj2, step);
                }
            }
            else {
                if (!obj1.isKBed() && !obj2.isKBed()) {
                    obj2.hit(obj1, step);
                }
            }
        }
    }
}

function checkXYOverlap(xpos, ypos, characterList) {
    for (const character of characterList) {
        if (character.getPosition().x == xpos && character.getPosition().y == ypos) {
            return true;
        }
    }
    return false;
}

function getRandomTile(max_tiles) {
    // tile size of 50x50 - 10 up, 16 across
    return Math.floor(Math.random() * max_tiles);
}

function spritePositionToImagePosition(row, col) {
    return {
        x: (
            BORDER_WIDTH +
            row * (SPACING_WIDTH + SPRITE_WIDTH)
        ),
        y: (
            BORDER_WIDTH +
            col * (SPACING_WIDTH + SPRITE_HEIGHT)
        )
    }
}




var characterSize = 40;
var canvas = document.getElementById("gameScreen");
canvas.height = 720;
canvas.width = 960;

var ctx = canvas.getContext("2d");
ctx.font = "16px serif";

const GAME_WIDTH = 960;
const GAME_HEIGHT = 720;

ctx.clearRect(0,0, canvas.width, canvas.height);

var names = [];
var characterList = [];
var deathList = [];

var spriteSheetURL = "Assets/output-onlinepngtools.png";




document.getElementById("start").addEventListener("click", function(s) {
    names = $("#entries").val().split('\n');
        for (var i = names.length - 1; i > -1; i--) {
            if (names[i].trim() == "") {
                names.splice(i, 1);
                
            }
        }
    characterList = [];

    for (var i = 0; i < names.length; i++) {
        var xp = getRandomTile(10) * characterSize * 2 + characterSize;
        var yp = getRandomTile(8) * characterSize * 2 + characterSize;

        while (checkXYOverlap(xp, yp, characterList)) {
            xp = getRandomTile(10) * characterSize * 2 + characterSize;
            yp = getRandomTile(8) * characterSize * 2 + characterSize;
        }
        
        
        let pos = {x: xp, y: yp};   

        var position = spritePositionToImagePosition(1, 0);

        var image = new Image();
        image.src = spriteSheetURL;
        image.crossOrigin = true;
        

            
        
        let character = new Character(GAME_WIDTH, GAME_HEIGHT, names[i], pos, image, ctx);
        
        characterList.push(character);
        
    }
    
    var ele = document.getElementById("deathlist");
    deathList = [];
    ele.innerHTML = "";


});

let lastTime = 0;

gameLoop(characterList);



