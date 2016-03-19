var g_maxX = 4;
var g_maxY = 10;
var g_maxPegs = 6;
var g_running = false;
var g_timeout = 0;

var grid = new Array();
var gridCache = new Array();
var currentX = 1;
var currentY = g_maxY;
var fadeElm = null;
var fadeInValue = 0;

var shieldY = 42;

function initGame()
{
    for (var x = 1; x <= g_maxX; x++) {
        grid[x] = new Array();
        for (var y = 1; y <= g_maxY; y++) {
            grid[x][y] = 0;
        }
    }
    createGridCache();

    for (var x = 1; x <= g_maxX; x++) {
        grid[x][1] = getRandomInt(1, g_maxPegs);
    }

    updateDisplay();
    g_running = true;
}

function createGridCache()
{
    for (var x = 1; x <= g_maxX; x++) {
        gridCache[x] = new Array();
        for (var y = 1; y <= g_maxY; y++) {
            gridCache[x][y] = grid[x][y];
        }
    }
}

function pickPeg(n)
{
    if (g_running) {
        grid[currentX][currentY] = n;
        updateDisplay();
        currentX++;
        if (currentX > g_maxX) {
            setTimeout("resolveRow(" + currentY + ")", 1000);
            if (getNumberOfCorrectColorAndPositionInRow(currentY) == g_maxX) {
                g_running = false;
                resolveGame();
            }
            else {
                currentX = 1;
                currentY--;
                if (currentY == 1) {
                    currentY++;
                    g_running = false;
                    setTimeout("resolveRow(" + 2 + ")", 1000);
                    resolveGame();
                }
            }
        }
    }
}

function resolveRow(row)
{
    var correct = getNumberOfCorrectColorAndPositionInRow(row);
    var semiCorrect = getNumberOfCorrectColorFalsePositionInRow(row);

    for (var keyHole = 1; keyHole <= g_maxY; keyHole++) {
        var elm = document.getElementById("keyHole" + keyHole + "_" + row);
        if (elm) {
            if (correct >= 1) {
                correct--;
                elm.innerHTML = "<img src=\"image/keypeg-correct.png\" alt=\"\" />";
            }
            else if (semiCorrect >= 1) {
                semiCorrect--;
                elm.innerHTML = "<img src=\"image/keypeg-semi-correct.png\" alt=\"\" />";
            }
            else {
                break;
            }
        }
    }
}

function resolveGame()
{
    if (shieldY < 55) {
        shieldY++;
        var elm = document.getElementById("shield");
        if (elm) {
            elm.style.top = shieldY + "px";
        }
        setTimeout("resolveGame()", 100);
    }
    else {
        hideElm("codepegSelectionLabel");
        if (getNumberOfCorrectColorAndPositionInRow(currentY) == g_maxX) {
            showElm("won");
        }
        else {
            showElm("lost");
        }
    }    
}

function getNumberOfCorrectColorAndPositionInRow(row)
{
    var correctColorAndPosition = 0;
    for (x = 1; x <= g_maxX; x++) {
        if (grid[x][1] == grid[x][row]) {
            correctColorAndPosition++;
        }
    }
    return correctColorAndPosition;
}

function getNumberOfCorrectColorFalsePositionInRow(row)
{
    var correct = new Array();
    for (var i = 1; i <= g_maxX; i++) {
        correct[i] = grid[i][1];
    }

    var correctColorFalsePosition = 0;
    for (var x = 1; x <= g_maxX; x++) {
        if (grid[x][1] != grid[x][row]) {
            for (var x2 = 1; x2 <= g_maxX; x2++) {
                if ( (x != x2) && (correct[x2] != -1) && (correct[x2] == grid[x][row]) && (correct[x2] != grid[x2][row]) ) {
                    correctColorFalsePosition++;
                    correct[x2] = -1;
                    break;
                }
            }
        }
    }
    return correctColorFalsePosition;
}

function updateDisplay()
{
    for (var x = 1; x <= g_maxX; x++) {
        for (var y = 1; y <= g_maxY; y++) {
            if (grid[x][y] != gridCache[x][y]) {

                gridCache[x][y] = grid[x][y];
                var s = "";
                if (grid[x][y] == 0) {
                    s = "&nbsp;";
                }
                else {
                    s = "<img src=\"image/codepeg" + grid[x][y] + ".png\" alt=\"\" />";
                }
                var elm = document.getElementById("codeHole" + x + "_" + y);
                if (elm) {
                    if (g_timeout == 0 && y >= 2) {
                        elm.style.MozOpacity = 0;
                        elm.style.filter = "alpha(opacity=0)";
                        elm.innerHTML = s;
                        fadeElm = document.getElementById("codeHole" + x + "_" + y);
                        fadeInValue = 0;
                        g_timeout = setTimeout("fadeIn()", 20);
                    }
                    else {
                        elm.innerHTML = s;
                    }
                }

            }
        }
    }
}

function fadeIn()
{
    fadeInValue += 5;
    fadeElm.style.MozOpacity = fadeInValue / 100;
    fadeElm.style.filter = "alpha(opacity=" + fadeInValue + ")";
    if (fadeInValue < 100) {
        g_timeout = setTimeout("fadeIn()", 20);
    }
    else {
        g_timeout = 0;
    }
}

function showElm(id)
{
    var elm = document.getElementById(id);
    if (elm) {
        elm.style.display = "block";
    }
}

function hideElm(id)
{
    var elm = document.getElementById(id);
    if (elm) {
        elm.style.display = "none";
    }
}

function hiliteSprite(id)
{
    if (g_running) {
        var elm = document.getElementById(id);
        if (elm) {
            elm.style.marginLeft = "-3px";
            elm.style.marginTop = "-3px";
            elm.style.width = "32px";
            elm.style.height = "32px";
        }
    }
}

function loliteSprite(id)
{
    var elm = document.getElementById(id);
    if (elm) {
        elm.style.marginLeft = "0";
        elm.style.marginTop = "0";
        elm.style.width = "25px";
        elm.style.height = "25px";
    }
}

function getRandomInt(min, max)
{
    return Math.floor( ( (max + 1 - min) * Math.random() ) + min );
}
