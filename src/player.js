
import { Fruit, loadedSprites } from './fruit.js';
import { gameOver, Playercanvas, SlashFX, fxList, Playercanvaswidth, Playercanvasheight, playerCtx, pointToLineDistance } from './game.js';

let fruits=[];
export var Playerscore=0;
const x1 = document.getElementById('x1');
const x2 = document.getElementById('x2');
const x3 = document.getElementById('x3');

export class Player {
    constructor( sliceSound) {
        this.spliced = sliceSound;
        
        this.lives=3;
        
    }

    handleSlice(x1, y1, x2, y2) {
        fruits.forEach(fruit => {
            if (!fruit.isSliced) {
                
                const dist = pointToLineDistance(fruit.x, fruit.y, x1, y1, x2, y2);
                if (dist < fruit.radius) {
                    fruits.slice();
                    spliced.currentTime = 0;
                    spliced.play();
                    if(fruit.spriteindex==0){
                        gameOver(playerCtx,Playercanvas);
                    }else{
                        Playerscore+=10;
                        console.log(Playerscore);
                        fruit.isSliced = true;
                   
                    }
                    fxList.push(new SlashFX(x1, y1, x2+100, y2));
                    
                }
    
            }
        });
    }

    spawnFruit() {
        const side = Math.floor(Math.random() * 2);
        let x
        let y
        let initialVelocityX=0;
        let initialVelocityY=0;
        let spriteindex= Math.floor(Math.random() * loadedSprites.length);
        
    
        if (side === 0) {
    
            x = Math.random() * Playercanvaswidth;
            y =  Playercanvasheight-100; 
            initialVelocityX = Math.floor(Math.random() * (12 - 11 + 1)) + 11;
            initialVelocityY = -(Math.floor(Math.random() * (12 - 11 + 1)) + 11);; 
        } else if (side === 1) {
    
            x = 50; 
            y = (Math.random() *  Playercanvasheight)-100;
            initialVelocityX = (5 + Math.random() * 10);
            initialVelocityY = -(Math.random() * 10);
        } else {
            x = Playercanvaswidth-50; 
            y = (Math.random() *Playercanvasheight)-100;
            initialVelocityX = (5 + Math.random() * 10); 
            initialVelocityY = -(Math.random() * 10);
        }
        fruits.push(new Fruit(x, y, initialVelocityX, initialVelocityY,spriteindex));
    }

    updateAndDrawFruits(backgroundImage) {
        playerCtx.drawImage(backgroundImage, 0, 0, Playercanvaswidth,  Playercanvasheight);
   
       fruits.forEach((fruit, index) => {
            fruit.update();
            fruit.draw(playerCtx);
            if ( fruit.y > Playercanvasheight) {
                fruits.splice(index, 1);
                if( fruit.spriteindex !=0){
                    if(!fruit.isSliced){
                        this.lives -=0.5;
                        this.HandlePlayerlives();
                    }
                
                }
            
                
            }
        });
        }
        HandlePlayerlives(){
            if( this.lives == 2 ){
                x1.style.backgroundImage='url(public/xx1.png)';
            }else if( this.lives==1){
                x1.style.backgroundImage='url(public/xx1.png)';
                x2.style.backgroundImage='url(public/xx2.png)';
            }else if( this.lives == 0){
                x1.style.backgroundImage='url(public/xx1.png)';
                x2.style.backgroundImage='url(public/xx2.png)';
                x3.style.backgroundImage='url(public/xx3.png)';
                gameOver(playerCtx,Playercanvas);
            }
            
        }
        reset(){
            this.lives=3;
            Playerscore=0;
            fruits=[];
        }
        
}