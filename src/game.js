define([
    './levelPlaner',
    './DOMDisplay'
], function(planer, display) {
    'use strict';
    class Game {
        constructor(plans, codes) {
            this.plans = plans;
            this.arrows = trackKeys(codes);
        }
        runLevel(level, andThen) {
            var arrows = this.arrows;
            var domDisplay = display(document.body, level);
            runAnimation(function(step) {
                level.animate(step, arrows);
                domDisplay.drawFrame(step);
                if (level.isFinished()) {
                    domDisplay.clear();
                    if (andThen)
                        andThen(level.status);
                    return false;
                }
            });
        }
        run() {
            var inst = this;
            var plans = this.plans;
            function startLevel(n) {
                inst.runLevel(planer(plans[n]), function(status) {
                    if (status == "lost")
                        startLevel(n);
                    else if (n < plans.length - 1)
                        startLevel(n + 1);
                    else
                        console.log("You win!");
                });
            }
            startLevel(0);
        }
    }
    function runAnimation(frameFunc) {
        var lastTime = null;
        function frame(time) {
            var stop = false;
            if (lastTime != null) {
                var timeStep = Math.min(time - lastTime, 100) / 1000;
                stop = frameFunc(timeStep) === false;
            }
            lastTime = time;
            if (!stop)
                requestAnimationFrame(frame);
            }
        requestAnimationFrame(frame);
    }
    function trackKeys(codes) {
        var pressed = Object.create(null);
        function handler(event) {
            if (codes.hasOwnProperty(event.keyCode)) {
                var down = event.type == "keydown";
                pressed[codes[event.keyCode]] = down;
                event.preventDefault();
            }
        }
        addEventListener("keydown", handler);
        addEventListener("keyup", handler);
        return pressed;
    }

    return function(plans, codes) {
        return new Game(plans, codes);
    }
});