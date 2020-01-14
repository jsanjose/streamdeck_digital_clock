/**
 * Simple Clock with adjustable colors (heavily inspired by kirupa: https://www.kirupa.com/html5/create_an_analog_clock_using_the_canvas.htm)
 * @param {canvas} cnv an existing canvas element in the DOM
 * API:
 * - drawClock() -> draws the clock - would normally called every second
 * - getImageData() -> returns base64-encode string of the canvas
 * - setColors(jsonObj) -> set colors of the clock's components as JSON
 * 		{
 *			hour:	"#efefef",
 *			minute: "#cccccc",
 *			second: "#ff9933",
 *			stroke: "#cccccc",
 *			background: "#000000"
 *		}
 * - getColors() -> get current color values
 */

function Clock(cnv) {
    if (!cnv) return;
    var ctx = cnv.getContext('2d');
    var clockRadius = cnv.width / 2;
    var clockX = cnv.width / 2;
    var clockY = cnv.height / 2;
    var twoPi = 2 * Math.PI;
    var colors = {};

    resetColors();

    function resetColors() {
        setColors({
            hour: "#efefef",
            minute: "#cccccc",
            second: "#ff9933",
            stroke: "#cccccc",
            background: "#000000"
        });
    }

    function drawArm(progress, armThickness, armLength, armColor) {
        var armRadians = (twoPi * progress) - (twoPi / 4);
        var targetX = clockX + Math.cos(armRadians) * (armLength * clockRadius);
        var targetY = clockY + Math.sin(armRadians) * (armLength * clockRadius);

        ctx.lineWidth = armThickness;
        ctx.strokeStyle = armColor;

        ctx.beginPath();
        ctx.moveTo(clockX, clockY); // Start at the center
        ctx.lineTo(targetX, targetY); // Draw a line outwards
        ctx.stroke();
    }

    function drawClock() {
        var now = new Date();
        var h = now.getHours() % 12;
        var m = now.getMinutes();
        var s = now.getSeconds();

        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, cnv.width, cnv.height);

        /* draw radians */
        /*
        for (var i = 0; i < 12; i++) {
            var innerDist = (i % 3) ? 0.8 : 0.775;
            var outerDist = 1; //(i % 3) ? 0.95 : 1.0;
            ctx.lineWidth = (i % 3) ? 4 : 5;
            ctx.strokeStyle = colors.stroke;

            var armRadians = (twoPi * (i / 12)) - (twoPi / 4);
            var x1 = clockX + Math.cos(armRadians) * (innerDist * clockRadius);
            var y1 = clockY + Math.sin(armRadians) * (innerDist * clockRadius);
            var x2 = clockX + Math.cos(armRadians) * (outerDist * clockRadius);
            var y2 = clockY + Math.sin(armRadians) * (outerDist * clockRadius);

            ctx.beginPath();
            ctx.moveTo(x1, y1); // Start at the center
            ctx.lineTo(x2, y2); // Draw a line outwards
            ctx.stroke();
        }
        */



        /* draw arms */
        /*
        var hProgress = (h / 12) + (1 / 12) * (m / 60) + (1 / 12) * (1 / 60) * (s / 60);
        var mProgress = (m / 60) + (1 / 60) * (s / 60);
        var sProgress = (s / 60);

        drawArm(hProgress, 6, 1 / 2, colors.hour); // Hour
        drawArm(hProgress, 6, -5 / clockRadius, colors.hour); // Hour

        drawArm(mProgress, 4, 3 / 4, colors.minute); // Minute
        drawArm(mProgress, 4, -2 / clockRadius, colors.minute); // Minute

        drawArm(sProgress, 2, 1, colors.second); // Second
        drawArm(sProgress, 2, -10 / clockRadius, colors.second); // Second
        */
    }

    function setColors(jsnColors) {
        (typeof jsnColors === 'object') && Object.keys(jsnColors).map(c => colors[c] = jsnColors[c]);
    }

    function getColors() {
        return this.colors;
    }

    function getImageData() {
        return cnv.toDataURL();
    }

    return {
        drawClock: drawClock,
        getImageData: getImageData,
        setColors: setColors,
        getColors: getColors,
        colors: colors,
        resetColors: resetColors
    }
}