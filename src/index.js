import Character from './character.js';
import InputHandler from './input.js';

let characterSize = 40;

function gameLoop(timestamp) {

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;


    ctx.clearRect(0,0, canvas.width, canvas.height);
    

    for (var i = 0; i < characterList.length; i++) {
        characterList[i].update(deltaTime);
        characterList[i].move(characterList);
        characterList[i].draw(ctx);
        if (characterList[i].isDead()) {
            deathList.push(characterList[i].getName());
            characterList.splice(i, 1);
        }
        
        
    }

    var element = document.getElementById("deathlist");
    console.log(deathList);
    element.innerHTML = "";
    for (const name of deathList) {
        element.innerHTML = element.innerHTML + name + "\n";
    }
    
    requestAnimationFrame(gameLoop);
}


function getRandomTile(max_tiles) {
    // tile size of 50x50 - 10 up, 16 across
    return Math.floor(Math.random() * max_tiles);
}

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
        let xp = getRandomTile(10) * characterSize * 2 + characterSize;
        let yp = getRandomTile(8) * characterSize * 2 + characterSize;
        let pos = {x: xp, 
                    y: yp,};
        let character = new Character(GAME_WIDTH, GAME_HEIGHT, names[i], pos, ctx);
        
        characterList.push(character);
        
    }
    console.log(characterList);
});



let lastTime = 0;

gameLoop(characterList);



