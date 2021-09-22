import Woody from './woody.js';
import Firzen from './firzen.js';
import Henry from './henry.js';
import Collision from './collision.js';

const MIN_STEP = 10;
const SPRITE_HEIGHT = 80;
const SPRITE_WIDTH = 80;
const BORDER_WIDTH = 0;
const SPACING_WIDTH = 0;

var PLAYERS = 0;


const states = {
    RUNNING: "running",
    KNOCKEDBACK: "knockedback",
    ATTACKING: "attacking",
    WINNING: "winning",
}


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

    if (deathList.length == PLAYERS - 1) {
        deathList.push(characterList[0].getName());
        const data = {deathList};
        const options = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        }

        
        fetch('/api', options)
        .then(response => response.json())
        .then((json) => {
            console.log(json);
        })

        PLAYERS = 0;
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

        character.cooldownAttackTimer(step);

        if (character.isDead()) {
            deathList.push(character.getName());
            
            characterList.splice(i, 1);
            continue;
        }

        if (character.getStatus() == states.KNOCKEDBACK) {
            character.setVX(v.x * 0.95);
            character.setVY(v.y * 0.95);
            character.setPosition(pos.x + step * v.x / 1000, pos.y + step * v.y / 1000);
            character.addTime(step);

            if (character.getTime() > 1000) {
                character.setStatus(states.RUNNING);
                character.setSprite(states.RUNNING);
                character.setTime(0);
            }
        }

        else {
            character.setGoal(character.getClosestEnemy(characterList));
            character.updateVelocities();
    
            character.setPosition(pos.x + (step * v.x / 1000), pos.y + (step * v.y / 1000));
        }

        if (character.getAttackTimer() < character.getTimeForAttackAnimation() && character.getStatus() == states.ATTACKING) {
            character.setSprite(states.RUNNING);
            character.setStatus(states.RUNNING);
        }

        if (character.getStatus() == states.RUNNING) {
            character.updateDirection();
        }
    }
}

function updateVelocities(collision, step) {
    var obj1 = collision.getObj1();
    var obj2 = collision.getObj2();
    if (obj1 != null && obj2 != null) {
        if (obj1.getAttackTimer() == 0 && obj2.getAttackTimer() != 0 ) {
            if (obj1.getStatus() != states.KNOCKEDBACK && obj2.getStatus() != states.KNOCKEDBACK) {
                obj1.hit(obj2, step);
                updateStatus(obj1, obj2);
                updateHealth(obj1, obj2);
                
            }
            
        }
        else if (obj1.getAttackTimer() != 0 && obj2.getAttackTimer() == 0) {
            if (obj1.getStatus() != states.KNOCKEDBACK && obj2.getStatus() != states.KNOCKEDBACK) {
                obj2.hit(obj1, step);
                updateStatus(obj2, obj1);
                updateHealth(obj2, obj1);
            }
        }
        else if (obj1.getAttackTimer() == 0 && obj2.getAttackTimer() == 0){
            var coinflip = Math.floor(Math.random() * 2);

            if(coinflip == 0) {
                if (obj1.getStatus() != states.KNOCKEDBACK && obj2.getStatus() != states.KNOCKEDBACK) {
                    obj1.hit(obj2, step);
                    updateStatus(obj1, obj2);
                    updateHealth(obj1, obj2);
                }
            }
            else {
                if (obj1.getStatus() != states.KNOCKEDBACK && obj2.getStatus() != states.KNOCKEDBACK) {
                    obj2.hit(obj1, step);
                    updateStatus(obj2, obj1);
                    updateHealth(obj2, obj1);
                }
            }
        }
    }
}

function updateStatus(obj1, obj2) {
    // obj1 is the hitter, obj2 is the hittee(is that a word?)
    obj1.setStatus(states.ATTACKING);
    obj1.setSprite(states.ATTACKING);

    obj2.setStatus(states.KNOCKEDBACK);
    obj2.setSprite(states.KNOCKEDBACK);

}

function updateHealth(obj1, obj2) {
    // obj1 is the hitter, obj2 is the hittee
    var dmg = obj1.getDmg();
    obj2.minusHealth(dmg);

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
    // tile size of 80x80 - 9 up, 12 across
    return Math.floor(Math.random() * max_tiles);
}

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

    PLAYERS = names.length;

    for (var i = 0; i < names.length; i++) {
        var xp = getRandomTile(5) * SPRITE_HEIGHT * 2 + SPRITE_HEIGHT;
        var yp = getRandomTile(3) * SPRITE_HEIGHT * 2 + SPRITE_HEIGHT;

        while (checkXYOverlap(xp, yp, characterList)) {
            xp = getRandomTile(5) * SPRITE_HEIGHT * 2 + SPRITE_HEIGHT;
            yp = getRandomTile(3) * SPRITE_HEIGHT * 2 + SPRITE_HEIGHT;
        }
        
        
        let pos = {x: xp, y: yp};
        
        let rand = Math.floor(Math.random() * 3);

        if (rand == 0) {
            var character = new Henry(GAME_WIDTH, GAME_HEIGHT, names[i], pos, i, ctx);
        }
        else if (rand == 1) {
            var character = new Firzen(GAME_WIDTH, GAME_HEIGHT, names[i], pos, i, ctx);
        }
        else if (rand == 2) {
            var character = new Woody(GAME_WIDTH, GAME_HEIGHT, names[i], pos, i, ctx);
        }
        
        characterList.push(character);
        
    }
    
});

let lastTime = 0;

gameLoop(characterList);



