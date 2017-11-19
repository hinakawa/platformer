requirejs([
    './levelPlaner',
    './DOMDisplay'
], function(planer, display) {
    lvl1 = [
            "                      ",
            "                      ",
            "  x              = x  ",
            "  x         o o    x  ",
            "  x @      xxxxx   x  ",
            "  xxxxx            x  ",
            "      x!!!!!!!!!!!!x  ",
            "      xxxxxxxxxxxxxx  ",
            "                      "]
    var simpleLevel = planer(lvl1);
    var DOMDisplay = display(document.body, simpleLevel);
});