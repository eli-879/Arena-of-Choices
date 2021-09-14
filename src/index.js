import Character from './character.js';
import Collision from './collision.js';

let MIN_STEP = 10;

function gameLoop(timestamp) {

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    updateGame(deltaTime, ctx);

    requestAnimationFrame(gameLoop);
}

function updateGame(dt, ctx) {
    let step = dt;
    do {
        var hit = findFirstCollision(step);
        if (hit != null) {
            if (hit.getTime() )

            step = Math.max(hit.getTime(), MIN_STEP);
            
            updateObjects(step);
            updateVelocities(hit);
        }
        else {
            updateObjects(step);
            
        }

        for (var i = 0; i < characterList.length; i++) {
            characterList[i].draw(ctx);
            //console.log(characterList[i].getPosition());
        }

        dt -= step;
        step = dt;

    } while (dt > 0);

}

function findFirstCollision(dt) {
    var result = null;
    for (var i = 0; i < characterList.length; i++) {
        for (var j = i+1; j < characterList.length; j++) {
            var hit = findCollision(i, j, dt);
            if (hit != null) {
                if (result == null || hit.time < result.time) {
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
    if (obj1Pos.x < obj2Pos.x + obj2.getWidth() && obj1Pos.x + obj1.getWidth() > obj2Pos.x && obj1Pos.y + obj1.getHeight() > obj2Pos.y && obj1Pos.y < obj2Pos.y + obj2.getHeight()) {
        var dir = 0;
        return new Collision(obj1, obj2, dir, dt);
    }
    return null;
}

function updateObjects(step) {
    for (var i = 0; i < characterList.length; i++) {
        var pos = characterList[i].getPosition();
        var v = characterList[i].getVelocity();
        console.log(pos.x, step, v.x, characterList[i].getName());
        characterList[i].setPosition(pos.x + step * v.x / 1000, pos.y + step * v.y / 1000);
        

    }
}

function updateVelocities(collision) {
    if (collision.getObj1() != null && collision.getObj2() != null) {
        collision.getObj1().multiplyVX(-1);
        collision.getObj2().multiplyVY(-1);
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
            
        
        let character = new Character(GAME_WIDTH, GAME_HEIGHT, names[i], pos, ctx);
        
        characterList.push(character);
        
    }
    
    var ele = document.getElementById("deathlist");
    deathList = [];
    ele.innerHTML = "";


});

let lastTime = 0;

gameLoop(characterList);



