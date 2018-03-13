import BKDRHash from './bkdr-hash'

export default class ColorHash {

    /**
     * Convert RGB to HEX
     * 
     * @param r R ∈ [0, 255]
     * @param g G ∈ [0, 255]
     * @param b B ∈ [0, 255]
     */
    static rgb2hex(r, g, b: number) {
        return [r, g, b].reduce((prev, curr) => prev + (curr < 16 ? `0${curr}` : curr), '#')
    }

    /**
     * Convert HSL to RGB
     * 
     * @see {@link http://zh.wikipedia.org/wiki/HSL和HSV色彩空间} for further information.
     * @param h Hue ∈ [0, 360)
     * @param s Saturation ∈ [0, 1]
     * @param l Lightness ∈ [0, 1]
     * @returns {Array} R, G, B ∈ [0, 255]
     */
    static hsl2rgb(h, s, l: number) {
        h /= 360;

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
    
        return [h + 1/3, h, h - 1/3].map((color) => {
            if(color < 0) {
                color++;
            }
            if(color > 1) {
                color--;
            }
            if(color < 1/6) {
                color = p + (q - p) * 6 * color;
            } else if(color < 0.5) {
                color = q;
            } else if(color < 2/3) {
                color = p + (q - p) * 6 * (2/3 - color);
            } else {
                color = p;
            }
            return Math.round(color * 255);
        });
    }

}


/**
 * Color Hash Class
 *
 * @class
 */
var ColorHashOld = function(options) {
    options = options || {};

    var LS = [options.lightness, options.saturation].map(function(param) {
        param = param || [0.35, 0.5, 0.65]; // note that 3 is a prime
        return Array.isArray(param) ? param.concat() : [param];
    });

    this.L = LS[0];
    this.S = LS[1];

    if (typeof options.hue === 'number') {
        options.hue = {min: options.hue, max: options.hue};
    }
    if (typeof options.hue === 'object' && !Array.isArray(options.hue)) {
        options.hue = [options.hue];
    }
    if (typeof options.hue === 'undefined') {
        options.hue = [];
    }
    this.hueRanges = options.hue.map(function (range) {
        return {
            min: typeof range.min === 'undefined' ? 0 : range.min,
            max: typeof range.max === 'undefined' ? 360: range.max
        };
    });

    this.hash = options.hash || BKDRHash;
};

/**
 * Returns the hash in [h, s, l].
 * Note that H ∈ [0, 360); S ∈ [0, 1]; L ∈ [0, 1];
 *
 * @param {String} str string to hash
 * @returns {Array} [h, s, l]
 */
ColorHash.prototype.hsl = function(str) {
    var H, S, L;
    var hash = this.hash(str);

    if (this.hueRanges.length) {
        var range = this.hueRanges[hash % this.hueRanges.length];
        var hueResolution = 727; // note that 727 is a prime
        H = ((hash / this.hueRanges.length) % hueResolution) * (range.max - range.min) / hueResolution + range.min;
    } else {
        H = hash % 359; // note that 359 is a prime
    }
    hash = Math.floor(hash / 360);
    S = this.S[hash % this.S.length];
    hash = Math.floor(hash / this.S.length);
    L = this.L[hash % this.L.length];

    return [H, S, L];
};

/**
 * Returns the hash in [r, g, b].
 * Note that R, G, B ∈ [0, 255]
 *
 * @param {String} str string to hash
 * @returns {Array} [r, g, b]
 */
ColorHash.prototype.rgb = function(str) {
    var hsl = this.hsl(str);
    return HSL2RGB.apply(this, hsl);
};

/**
 * Returns the hash in hex
 *
 * @param {String} str string to hash
 * @returns {String} hex with #
 */
ColorHash.prototype.hex = function(str) {
    var rgb = this.rgb(str);
    return RGB2HEX(rgb);
};

