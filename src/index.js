import Character from './character.js';



function gameLoop(timestamp) {

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    


    ctx.clearRect(0,0, canvas.width, canvas.height);
    

    for (var i = 0; i < characterList.length; i++) {

        if (characterList[i].isKBed()) {
            
            characterList[i].bounce(characterList, deltaTime);

            if (characterList[i].getTime() > 1000) {
                characterList[i].setKBed(false);
            }

        }
        else {
            characterList[i].move(characterList, deltaTime);
        }


        characterList[i].draw(ctx);

        if (characterList[i].isDead()) {
            deathList.push(characterList[i].getName());
            delete characterList[i];
            characterList.splice(i, 1);
        }
    }

    var element = document.getElementById("deathlist");
    element.innerHTML = "";
    for (var i = 0; i < deathList.length; i++) {
        element.innerHTML = element.innerHTML + (i+1) + ". " +  deathList[i] + "<br />";
    }
    
    requestAnimationFrame(gameLoop);
}


function getRandomTile(max_tiles) {
    // tile size of 50x50 - 10 up, 16 across
    return Math.floor(Math.random() * max_tiles);
}

function checkXYOverlap(xpos, ypos, characterList) {
    for (const character of characterList) {
        if (character.getPos().x == xpos && character.getPos().y == ypos) {
            return true;
        }
    }
    return false;
}



let characterSize = 40;
let canvas = document.getElementById("gameScreen");
canvas.height = 720;
canvas.width = 960;



let ctx = canvas.getContext("2d");
ctx.font = "16px serif";

const GAME_WIDTH = 960;
const GAME_HEIGHT = 720;

ctx.clearRect(0,0, canvas.width, canvas.height);

let names = [];
let characterList = [];
let deathList = [];


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
            console.log(xp, yp);
            xp = getRandomTile(10) * characterSize * 2 + characterSize;
            yp = getRandomTile(8) * characterSize * 2 + characterSize;
        }
        
        
        let pos = {x: xp, 
                    y: yp,};
        let character = new Character(GAME_WIDTH, GAME_HEIGHT, names[i], pos, ctx);
        
        characterList.push(character);
        
    }

    document.getElementById("deathlist").innerHTML = "";

});



let lastTime = 0;

gameLoop(characterList);



