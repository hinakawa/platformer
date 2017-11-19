requirejs([
    './game',
    './gameLevels'
], function(game, plans) {
    var arrowCodes = {37: "left", 38: "up", 39: "right"};
    var app = game(plans, arrowCodes);
    app.run();
});