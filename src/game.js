
import { Bot, botscore } from "./bot.js";
import { Player, Playerscore } from "./player.js";
import { body, scoreDisplay, UI } from "./onUI.js";

export const Playercanvas = document.getElementById('gameCanvas');
Playercanvas.width =(window.innerWidth-100);
Playercanvas.height = (window.innerHeight-100);
export const Playercanvaswidth=Playercanvas.width;
export const Playercanvasheight=Playercanvas.height;
export const playerCtx =Playercanvas.getContext('2d');

export const botCanvas = document.getElementById('bot-canvas');
botCanvas.width =window.innerWidth;
botCanvas.height = window.innerHeight;
export const Botcanvaswidth=(Playercanvas.width-100);
export const Botcanvasheight=(Playercanvas.height-100);
export const botCtx =botCanvas.getContext('2d');

//ui Elements
const SinglePlayerBtn = document.getElementById('singlePlayer');
const MultiPlayerBtn = document.getElementById('multiPlayer');
const x1 = document.getElementById('x1');
const x2 = document.getElementById('x2');
const x3 = document.getElementById('x3');
const muteButton = document.getElementById('mute');
export const spectateButton = document.getElementById('spectate-button');

//sounds
const boom = document.getElementById('boom');
const spliced = document.getElementById('spliced');
const missed = document.getElementById('missed');
const start = document.getElementById('start');
const over = document.getElementById('over');

const backgroundImage = new Image();
backgroundImage.src = 'BG.png';
const splash = new Image();
splash.src = 'public/splash.png';
splash.opacity=0.5;

export let fxList = [];
let PlayergameInterval;
let BotgameInterval;
let animationFrameId;
let lastMousePosition = { x: 0, y: 0 };
let touchStart;
let touchEnd;
let isTouchStarted=false;

let isMouseDown = true;
let isStarted = false;
export let isSpectating = false;
export let isMultiPlayer = false;
export let botgameisOver = false;
let isMuted = false; 


const bot = new Bot(botCanvas,500, 0.6); // initializig bot
const player = new Player(spliced);
const ui = new UI();


function updateGame() { //update at each frame
    
    player.updateAndDrawFruits(backgroundImage);
    if(isMultiPlayer){
       bot.updateAndDrawFruits(backgroundImage);
    }
}




function gameLoop() {
    updateGame();
    animationFrameId = requestAnimationFrame(gameLoop);

    fxList.forEach((fx, index) => {
        fx.draw(playerCtx);
        if (fx.isFinished()) {
            fxList.splice(index, 1); 
        }
    });
    bot.update();
    if(isSpectating){
        scoreDisplay.textContent=`Score: ${botscore}`;
        body.style.backgroundColor='#a01b00';

    
    }else{
        scoreDisplay.textContent=`Score: ${Playerscore}`;
        body.style.backgroundColor='black';

    }
        
}

//mouse events
/*Playercanvas.addEventListener('mousedown', (event) => {
   isMouseDown = true;
    lastMousePosition = { x: event.clientX, y: event.clientY };
});
Playercanvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});*/
Playercanvas.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const currentMousePosition = { x: event.clientX, y: event.clientY };
        player.handleSlice(currentMousePosition.x, currentMousePosition.y, lastMousePosition.x, lastMousePosition.y);
        lastMousePosition = currentMousePosition;
    }
});


Playercanvas.addEventListener('touchstart', (event) => {
    
    touchStart = event.touches[0];
    player.handleSlice(touchStart.pageX, touchStart.pageY, 0, 0);


});


// starting game
SinglePlayerBtn.addEventListener('click', function(){
    singlePlayerGame();
});
MultiPlayerBtn.addEventListener('click', function(){
    multiPlayerGame();
});

function singlePlayerGame() {
    isMultiPlayer=false;
    if (!isStarted) {
        start.currentTime = 0;
        start.play();
        isMultiPlayer=false;
        ui.onSinglePlayer();
        
        resetLives();
        player.reset();
        bot.reset();
        bottom.style.opacity=0;
        clearInterval(PlayergameInterval);
        clearInterval(BotgameInterval);
        PlayergameInterval = setInterval(player.spawnFruit, 1500);//spawing in every 1.5sec
        BotgameInterval = setInterval(bot.spawnFruit, 1500);//spawing in every 1.5sec
        isSpectating=false;
        gameLoop();
}
}
function multiPlayerGame() {
    isMultiPlayer=true;
    if (!isStarted) {
        isStarted = true;
        start.currentTime = 0;
        start.play();

        ui.onMultiplayer();

        player.reset();
        bot.reset();
        resetLives();
        bottom.style.opacity=0;
        clearInterval(PlayergameInterval);
        clearInterval(BotgameInterval);
        PlayergameInterval = setInterval(player.spawnFruit, 1500);//spawing in every 1.5sec
        BotgameInterval = setInterval(bot.spawnFruit, 1500);
        isSpectating=false;
        
        gameLoop();
}
}

export function gameOver(){ // if players game is over
    over.currentTime = 0;
    over.play();
    clearInterval(PlayergameInterval);
    clearInterval(BotgameInterval);
    cancelAnimationFrame(animationFrameId); 
    isStarted = false;
    ui.onGameover();

    playerCtx.clearRect(0, 0, Playercanvas.width, Playercanvas.height);
    botCtx.clearRect(0, 0, botCanvas.width, botCanvas.height);
    isMultiPlayer=false;
    
}
export function botgameOver(ctx){ // if bots game is over
    clearInterval(BotgameInterval);
    ui.onBotGameover();
    ctx.clearRect(0, 0, botCanvas.width, botCanvas.height);
    botgameisOver = true;
    
}

function resetLives(){
    x1.style.backgroundImage='url(public/x1.png)';
    x2.style.backgroundImage='url(public/x2.png)';
    x3.style.backgroundImage='url(public/x3.png)';
}

export class SlashFX { // Drawing fx
    
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.opacity = 1.0; 
        this.fadeSpeed = 0.1;
        this.lineWidth = 10; 
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = 'rgba(40,16,9,0.7)'; 
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.restore();

        
        this.opacity -= this.fadeSpeed/10000;
        this.lineWidth -= 0.5;
        ctx.drawImage(splash, this.x1, this.y1,150,150 ); //drawing splash

    }

    isFinished() {
        return this.opacity <= 0 || this.lineWidth <= 0;
    }
}
export function pointToLineDistance(px, py, x1, y1, x2, y2) { // drag functionality
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

spectateButton.addEventListener('click', () => { // spactate button
    isSpectating = !isSpectating;
    if (isSpectating) {
        Playercanvas.style.display = 'none';
        botCanvas.style.display = 'block';
        spectateButton.textContent = 'Return to Game';
    } else {
        Playercanvas.style.display = 'block';
        botCanvas.style.display = 'none';
        spectateButton.textContent = 'Spectate';
    }
});
muteButton.addEventListener('click', toggleMute);

function toggleMute() {
    isMuted = !isMuted;  // Toggle the mute state

    if (isMuted) {
        // Mute all sounds
        spliced.volume = 0;
        boom.volume=0;
        missed.volume=0;
        start.volume=0;
        over.volume=0;
        muteButton.style.backgroundImage='url(public/mute.png';
    } else {
        // Unmute all sounds
        spliced.volume = 1;
        boom.volume=1;
        missed.volume=1;
        start.volume=1;
        over.volume=1;  // Set volume back to normal
        muteButton.style.backgroundImage='url(public/unmute.png';

    }}
    function openFullscreen() {
        let elem = document.documentElement; // This targets the entire document (web page)
        
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    }
    
    // Automatically trigger fullscreen when the page loads
    window.onload = function() {
        openFullscreen();
    };