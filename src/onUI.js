import { botscore } from "./bot.js";
import { isMultiPlayer, spectateButton } from './game.js';
import { Playerscore } from "./player.js";

export const body = document.getElementById('body');
export const gameOverMessage = document.getElementById('gameOverMessage');
export const livesImg = document.getElementById('lives');
export const scoreText = document.getElementById('scoreText');
export const BotscoreText = document.getElementById('BotscoreText');
export const bottom = document.getElementById('bottom');
export const menu = document.getElementById('menu');
export const winnerText = document.getElementById('winner');
export const scoreDisplay = document.getElementById('scoreDisplay');

export class UI{


    onSinglePlayer(){
        winnerText.style.display = 'none';
        BotscoreText.style.display='none';
        menu.style.display = 'none';
        gameOverMessage.style.display = 'none';
        bottom.style.display = 'flex';
        scoreDisplay.style.display='inline';
        livesImg.style.display='flex';
        body.style.backgroundImage='none'
        body.style.backgroundColor='black';
        scoreDisplay.textContent = `Score: ${Playerscore}`;
        spectateButton.style.display='none';
    }
    onMultiplayer(){
        menu.style.display = 'none';
        gameOverMessage.style.display = 'none';
        bottom.style.display = 'flex';
        scoreDisplay.style.display='inline';
        livesImg.style.display='flex';
        body.style.backgroundImage='none';
        body.style.backgroundColor='black';
        winnerText.style.display = 'inline';
        BotscoreText.style.display='inline';
        scoreDisplay.textContent = `Score: ${Playerscore}`;
        spectateButton.style.display='flex';

    }
    onGameover(){
        scoreDisplay.textContent = `Score: ${Playerscore}`;
        menu.style.display = 'flex';
        gameOverMessage.style.display = 'block';
        scoreText.textContent=`Score: ${Playerscore}`;
        bottom.style.display = 'none';
        body.style.backgroundImage='url(BG.png)'
        body.style.backgroundColor='none';
        if(isMultiPlayer){
            BotscoreText.textContent=` opponents Score: ${botscore}`;
            if(Playerscore>botscore){
    
            winnerText.textContent='You win';
            }else if(Playerscore<botscore)
            {
            winnerText.textContent='Opponent wins';
            }else{
                winnerText.textContent='Its a tie';
            }
        }else{
            BotscoreText.textContent=" ";
            winnerText.textContent=" ";
    
        }

    }
    onBotGameover(){
        scoreDisplay.textContent = `Score: ${Playerscore}`;
        BotscoreText.textContent=`Opponents Score: ${botscore}`;
    }

}