// Level planer module
define(function() {
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
                    var Actor = actorChars[ch];
                    if (Actor)
                        this.actors.push(new Actor(new Vector(x, y), ch));
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
    }
    // Location, object proportions and directions express by vector
    class Vector {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        plus(other) {
            return new Vector(this.x + other.x, this.y + other.y);
        }
        times(factor) {
            return new Vector(this.x * factor, this.y * factor);
        }
    }
    // Player is an actor type
    function Player(pos) {
        this.pos = pos.plus(new Vector(0, -0.5));
        this.size = new Vector(0.8, 1.5);
        this.speed = new Vector(0, 0);
    }
    Player.prototype.type = "player";
    // Moving lava is an actor-type too
    function Lava(pos, ch) {
        this.pos = pos;
        this.size = new Vector(1, 1);
        if (ch == "=") {
            this.speed = new Vector(2, 0);
        }
        else if (ch == "|") {
            this.speed = new Vector(0, 2);
        }
        else if (ch == "v") {
            this.speed = new Vector(0, 3);
            this.repeatPos = pos;
        }
    }
    Lava.prototype.type = "lava";
    // Coins can`t move and feel scary
    function Coin(pos) {
        this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
        this.size = new Vector(0.6, 0.6);
        this.wobble = Math.random() * Math.PI * 2;
    }
    Coin.prototype.type = "coin";
    // actor-types define
    var actorChars = {
        "@": Player,
        "o": Coin,
        "=": Lava, "|": Lava, "v": Lava
    };

    return function(plan) {
        return new Level(plan);
    };
});