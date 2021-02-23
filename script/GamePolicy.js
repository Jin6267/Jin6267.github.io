
function GamePolicy(){
    this.foul = false;
    this.leftBorderX = Game.size.x/2 - BORDER_SIZE/2;
    this.rightBorderX = Game.size.x/2 + BORDER_SIZE/2;
    this.topBorderY = Game.size.y - BORDER_SIZE;
    this.bottomBorderY = Game.size.y;
    this.target = 0;
    this.whiteHitRed = false;
    this.hitBorderTimes = 0;

    this.heightInterv = 45;
    this.weithInterv = 210;
    this.gameover = false;
}

GamePolicy.prototype.reset = function(){
    this.foul = false;
    this.whiteHitRed = false;
    this.hitBorderTimes = 0;
}
GamePolicy.prototype.drawOver = function(){
    if(this.gameover && !Game.gameWorld.ballsMoving()){
        Canvas2D.clear();
        Canvas2D.drawImage(sprites.background);
        Canvas2D.drawText("Well done, Thank you !", new Vector2(this.weithInterv, Game.size.y/2), new Vector2(150,0), "#11b85c", "top", "Impact", "100px");
    }
}
GamePolicy.prototype.drawScores = function(){//"#096834"

    if(this.whiteHitRed){
        if(1 == this.hitBorderTimes && 0 == this.target){
            this.target = 1;
        }else if(2 == this.hitBorderTimes && 1 == this.target){
            this.target = 2;
        }
    }

    if(0 == this.target){
        Canvas2D.drawText("Hit the red ball with 1 bounce !", new Vector2(this.weithInterv,0), new Vector2(150,0), "#11b85c", "top", "Impact", "40px");
    }else if(1 == this.target){
        Canvas2D.drawText("Hit the red ball with 2 bounces !", new Vector2(this.weithInterv,0), new Vector2(150,0), "#11b85c", "top", "Impact", "40px");
    }else if(2 == this.target){
        Canvas2D.drawText("Hit the red ball with 2 bounces !", new Vector2(this.weithInterv,0), new Vector2(150,0), "#11b85c", "top", "Impact", "40px");
        this.gameover = true;
    }
    Canvas2D.drawText("Bouncing from borders times: " + (this.hitBorderTimes), new Vector2(this.weithInterv, this.heightInterv), new Vector2(150,0), "#0e964b", "top", "Impact", "40px");
    if(this.whiteHitRed){
        Canvas2D.drawText("The white ball hit the red ball: Yes", new Vector2(this.weithInterv,  this.heightInterv * 2), new Vector2(150,0), "#0e964b", "top", "Impact", "40px");
    }else{
        Canvas2D.drawText("The white ball hit the red ball: No", new Vector2(this.weithInterv, this.heightInterv * 2), new Vector2(150,0), "#0e964b", "top", "Impact", "40px");
    }
}

GamePolicy.prototype.checkColisionValidity = function(ball1,ball2){
    if(ball1.color != ball2.color && ball1.color != Color.yellow && ball2.color != Color.yellow){
        this.whiteHitRed = true;
    }
}

GamePolicy.prototype.isXOutsideLeftBorder = function(pos, origin){
    return (pos.x - origin.x) < this.leftBorderX;
}
GamePolicy.prototype.isXOutsideRightBorder = function(pos, origin){
    return (pos.x + origin.x) > this.rightBorderX;
}
GamePolicy.prototype.isYOutsideTopBorder = function(pos, origin){
    return (pos.y - origin.y) < this.topBorderY;
}
GamePolicy.prototype.isYOutsideBottomBorder = function(pos , origin){
    return (pos.y + origin.y) > this.bottomBorderY;
}

GamePolicy.prototype.isOutsideBorder = function(pos,origin){
    return this.isXOutsideLeftBorder(pos,origin) || this.isXOutsideRightBorder(pos,origin) || 
    this.isYOutsideTopBorder(pos, origin) || this.isYOutsideBottomBorder(pos , origin);
}
//this is only working for the triangle case
GamePolicy.prototype.isOutsidePolyBorder = function(pos, origin){
    var pos0 = Game.gameWorld.borders[0].pos[0].copy();
    var pos1 = Game.gameWorld.borders[0].pos[1].copy();
    var pos2 = Game.gameWorld.borders[0].pos[2].copy();
    //remove the size of ball
    pos0.x = pos0.x + origin.y * Math.sqrt(3); 
    pos0.y = pos0.y - origin.y; 
    //
    pos1.x = pos1.x - origin.y * Math.sqrt(3); 
    pos1.y = pos1.y - origin.y;
    //
    pos2.x = pos2.x; 
    pos2.y = pos2.y + origin.y * 2;
    //
    var v = pos;
    var v0 = pos0;
    var v1 = pos1.subtract(pos0);
    var v2 = pos2.subtract(pos0);
    var a = (v.det(v2) - v0.det(v2)) / v1.det(v2);
    var b = -(v.det(v1) - v0.det(v1))/ v1.det(v2);
    //-1 is no solution, 
    //0 is out of edge (pos0, pos1), 
    //1 is out of edge (pos1, pos2)
    //2 is out of edge (pos2, pos0)
    if(a > 0 && b > 0 && ((a + b) < 1)){
        return -1;
    }
    else if(b <= 0){
        return 0;
    }else if(a <= 0){
        return 2;
    }else{
        return 1;
    }
}
GamePolicy.prototype.countHittingBorderTimes = function(){
    if(!this.whiteHitRed){
        this.hitBorderTimes= this.hitBorderTimes + 1;
    }
}