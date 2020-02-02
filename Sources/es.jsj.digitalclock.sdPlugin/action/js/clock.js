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
    var ctx = cnv.getContext("2d");
    var digitLineWidth = 4;
    var digitWidth = (cnv.width / 5) - (digitLineWidth * 2);
    var digitHorizSpace = (cnv.width / 20) + digitLineWidth;
    var digitHeight = (2 * cnv.height / 4) - (digitLineWidth * 2);
    var w = digitWidth;
    var h = digitHeight;
    var l = digitLineWidth;

    //     1
    //    ---
    // 0 |   | 2
    //    ---  3
    // 4 |   | 5
    //    ---
    //     6
    var digit = [
        /*0*/ [l/2, l, l/2, (h/2)+(l/2)],
        /*1*/ [l, l/2, l+w, l/2],
        /*2*/ [(3*l/2)+w, l, (3*l/2)+w, (h/2)+(l/2)],
        /*3*/ [l, (h/2)+l, l+w, (h/2)+l],
        /*4*/ [l/2, (h/2)+(3*l/2), l/2, h+(3*l/2)-l],
        /*5*/ [(3*l/2)+w, (h/2)+(3*l/2), (3*l/2)+w, h+(3*l/2)-l],
        /*6*/ [l/2, h+l, l+w, h+l]
    ];
    var segments = [
        /*0*/ [0, 1, 2, 4, 5, 6],
        /*1*/ [2, 5],
        /*2*/ [1, 2, 3, 4, 6],
        /*3*/ [1, 2, 3, 5, 6],
        /*4*/ [0, 2, 3, 5],
        /*5*/ [0, 1, 3, 5, 6],
        /*6*/ [0, 1, 3, 4, 5, 6],
        /*7*/ [1, 2, 5],
        /*8*/ [0, 1, 2, 3, 4, 5, 6],
        /*9*/ [0, 1, 2, 3, 5, 6]
    ];
    var points = [
        [0, (h/4)+(l/2)],
        [0, (3*h/4)+(3*l/2)]
    ];

    var colors = {};
    resetColors();

    function resetColors() {
        setColors({
            background: "#200000",
            lineOn: "#FF0000",
            lineOff: "#5A0000"
        });
    }

    function formatNumber(n) {
        return ("0" + n).slice(-2);
    }

    function drawClock() {
        var date  = new Date();
        var seconds = date.getSeconds();
        var minutes = date.getMinutes()
        var hour = date.getHours();
        var hhmm = formatNumber(hour) + formatNumber(minutes);

        ctx.beginPath();
        ctx.rect(0, 0, cnv.width - 1, cnv.height - 1);
        ctx.fillStyle = colors.background;
        ctx.fill();

        ctx.strokeStyle = colors.lineOn;
        ctx.fillStyle = colors.lineOn;
        ctx.lineWidth = digitLineWidth;

        var dX = l;
        var dY = (cnv.height - digitHeight) / 2;
        var pointColor = colors.lineOn;
        for(var d = 0; d < 4; d++) {
            var n = hhmm.substr(d, 1);
            var seg = segments[n];
            for(var i = 0; i < digit.length; i++) {
                if(seg.includes(i)) ctx.strokeStyle = colors.lineOn;
                else ctx.strokeStyle = colors.lineOff;
                var x1 = digit[i][0] + dX;
                var y1 = digit[i][1] + dY;
                var x2 = digit[i][2] + dX;
                var y2 = digit[i][3] + dY;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            dX += digitWidth + digitHorizSpace;
            /* separation points */
            if(d == 1) {
                pointColor = colors.lineOn;
                if((seconds % 2) == 0) pointColor = colors.lineOff;
                for(var i = 0; i < points.length; i++) {
                    var x1 = points[i][0] + (l/2) + dX;
                    var y1 = points[i][1] + dY;
                    var x2 = l;
                    var y2 = l;
                    ctx.fillStyle = pointColor;
                    ctx.beginPath();
                    ctx.rect(x1, y1, x2, y2);
                    ctx.fillRect(x1, y1, x2, y2);
                }
                dX += digitHorizSpace;
            }
        }
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