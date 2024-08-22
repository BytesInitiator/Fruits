
import { Fruit, loadedSprites } from './fruit.js';
import { Botcanvasheight, Botcanvaswidth, botCtx, botgameOver, BotscoreText, fxList, isSpectating, SlashFX } from './game.js';


let fruits = [];
export var botscore=0;
export class Bot {
    constructor(canvas,reactionTime, accuracy) {

        this.reactionTime = reactionTime;
        this.accuracy = accuracy;
        this.currentTarget = null;
        this.lives=3;
        this.fxList = fxList;
    }

    update() {
        if (this.currentTarget && this.currentTarget.isSliced) {
            this.currentTarget = null; 
        }

        if (!this.currentTarget) {
            this.findTarget(fruits);
        }

        if (this.currentTarget) {
            this.attemptSlice();
        }
    }

    findTarget() {
        const unslicedFruits = fruits.filter(fruit => !fruit.isSliced);
        if (unslicedFruits.length > 0) {
            this.currentTarget = unslicedFruits[Math.floor(Math.random() * unslicedFruits.length)];
        }
    }

    attemptSlice() {
        setTimeout(() => {
            if (Math.random() < this.accuracy && this.currentTarget && !this.currentTarget.isSliced) {
                const i = Math.floor(Math.random() * 20)
                if(i>=19){
                    if(this.currentTarget.spriteindex==0){
                        this.currentTarget.slice();
                        botgameOver(botCtx);
                    }
                }else{
                    if(this.currentTarget.spriteindex!=0){
                        this.currentTarget.slice();
                        botscore+=10;
                        this.currentTarget.isSliced=true;
                        BotscoreText.textContent=`Score: ${botscore}`;
                        if(isSpectating){
                            this.fxList.push(new SlashFX(this.currentTarget.x, this.currentTarget.y,this.currentTarget.x+100,this.currentTarget.y+100));
                        }
                        
                    }
                }
                
                
            }
            this.currentTarget = null;
        }, this.reactionTime);
    }
    spawnFruit() {
        
        const side = Math.floor(Math.random() * 2);
        let x, y, initialVelocityX, initialVelocityY,sprite;
        let spriteindex= Math.floor(Math.random() * loadedSprites.length);
        
    
        if (side === 0) {
    
            x = Math.random() * Botcanvaswidth;
            y = Botcanvasheight-100; 
            initialVelocityX = (5 + Math.random() * 7);
            initialVelocityY = -(Math.floor(Math.random() * (12 - 11 + 1)) + 11);; 
        } else if (side === 1) {
    
            x = 50; 
            y = (Math.random() * Botcanvasheight)-100;
            initialVelocityX = (5 + Math.random() * 7);
            initialVelocityY = -(Math.random() * 12);
        } else {
            x =Botcanvaswidth-50; 
            y = (Math.random() * Botcanvasheight)-100;
            initialVelocityX = (5 + Math.random() * 7); 
            initialVelocityY = -(Math.random() * 12);
        }
        fruits.push(new Fruit(x, y, initialVelocityX, initialVelocityY,spriteindex));
        
    }
    updateAndDrawFruits(backgroundImage) {
        botCtx.drawImage(backgroundImage, 0, 0,Botcanvaswidth, Botcanvasheight);
   
       fruits.forEach((fruit, index) => {
            fruit.update();
            fruit.draw(botCtx);
            if (fruit.y > Botcanvasheight) {
               fruits.splice(index, 1);
                if(fruit.spriteindex !=0){
                    if(!fruit.isSliced){
                        this.lives -=0.5;
                        this.HandleBotlives();
                    }
                
                }
            
                
            }
        });
        }
         HandleBotlives(){
            if(this.lives == 0){
              botgameOver(botCtx);
           }
           

        }
        reset(){
            this.lives=3;
            botscore=0;
            fruits=[];
        }
       
}