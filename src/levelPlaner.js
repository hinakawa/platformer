// Level planer module
define([
    './actorTypes'
], function(actorTypes) {
    // I'm too lazy to write a level-redactor
    // (throw this.module)
    'use strict';
    // Create level object from its plan
    class Level {
        constructor(plan) {
            this.width = plan[0].length;
            this.height = plan.length;
            this.grid = [];
            this.actors = [];
            for (var y = 0; y < this.height; y++) {
                var line = plan[y], gridLine = [];
                for (var x = 0; x < this.width; x++) {
                    var ch = line[x], fieldType = null;
                    var Actor = actorTypes[ch];
                    if (Actor)
                        this.actors.push(new Actor(x, y, ch));
                    else if (ch == "x")
                        fieldType = "wall";
                    else if (ch == "!")
                        fieldType = "lava";
                    gridLine.push(fieldType);
                }
                this.grid.push(gridLine);
            }
            this.player = this.actors.filter(function(actor) {
                return actor.type == "player";
            })[0];
            this.status = this.finishDelay = null;
        }
        isFinished() {
            return this.status != null && this.finishDelay < 0;
        }
        obstacleAt(pos, size) {
            var xStart = Math.floor(pos.x);
            var xEnd = Math.ceil(pos.x + size.x);
            var yStart = Math.floor(pos.y);
            var yEnd = Math.ceil(pos.y + size.y);
            if (xStart < 0 || xEnd > this.width || yStart < 0)
                return "wall";
            if (yEnd > this.height)
                return "lava";
            for (var y = yStart; y < yEnd; y++) {
              for (var x = xStart; x < xEnd; x++) {
                var fieldType = this.grid[y][x];
                if (fieldType) 
                    return fieldType;
                }
            }
        };
        actorAt(actor) {
            for (var i = 0; i < this.actors.length; i++) {
                var other = this.actors[i];
                if (other != actor &&
                    actor.pos.x + actor.size.x > other.pos.x &&
                    actor.pos.x < other.pos.x + other.size.x &&
                    actor.pos.y + actor.size.y > other.pos.y &&
                    actor.pos.y < other.pos.y + other.size.y)
                    return other;
            }
        };
        animate(step, keys, maxStep) {
            if (!maxStep)
                maxStep = 0.05;
            if (this.status != null)
                this.finishDelay -= step;
            while (step > 0) {
                var thisStep = Math.min(step, maxStep);
                this.actors.forEach(function(actor) {
                    actor.act(thisStep, this, keys);
                }, this);
                step -= thisStep;
            }
        };
        playerTouched(type, actor) {
            if (type == "lava" && this.status == null) {
                this.status = "lost";
                this.finishDelay = 1;
            } 
            else if (type == "coin") {
                this.actors = this.actors.filter(function(other) { return other != actor; });
                if (!this.actors.some(function(actor) { return actor.type == "coin";})) {
                    this.status = "won";
                    this.finishDelay = 1;
                }
            }
        };
    }
    return function(plan) {
        return new Level(plan);
    }
});