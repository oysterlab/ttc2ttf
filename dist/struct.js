"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rechk = /^([<>])?(([1-9]\d*)?([xcbB?hHiIfdsp]))*$/;
var refmt = /([1-9]\d*)?([xcbB?hHiIfdsp])/g;
var str = function (v, o, c) { return String.fromCharCode.apply(String, __spread(new Uint8Array(v.buffer, v.byteOffset + o, c))); };
var rts = function (v, o, c, s) { return new Uint8Array(v.buffer, v.byteOffset + o, c)
    .set(s.split('').map(function (str) { return str.charCodeAt(0); })); };
var pst = function (v, o, c) { return str(v, o + 1, Math.min(v.getUint8(o), c - 1)); };
var tsp = function (v, o, c, s) { v.setUint8(o, s.length); rts(v, o + 1, c - 1, s); };
var lut = function (le) { return ({
    x: function (c) { return [1, c, 0]; },
    c: function (c) { return [c, 1, function (o) { return ({ u: function (v) { return str(v, o, 1); }, p: function (v, c) { return rts(v, o, 1, c); } }); }]; },
    '?': function (c) { return [c, 1, function (o) { return ({ u: function (v) { return Boolean(v.getUint8(o)); }, p: function (v, B) { return v.setUint8(o, B); } }); }]; },
    b: function (c) { return [c, 1, function (o) { return ({ u: function (v) { return v.getInt8(o); }, p: function (v, b) { return v.setInt8(o, b); } }); }]; },
    B: function (c) { return [c, 1, function (o) { return ({ u: function (v) { return v.getUint8(o); }, p: function (v, B) { return v.setUint8(o, B); } }); }]; },
    h: function (c) { return [c, 2, function (o) { return ({ u: function (v) { return v.getInt16(o, le); }, p: function (v, h) { return v.setInt16(o, h, le); } }); }]; },
    H: function (c) { return [c, 2, function (o) { return ({ u: function (v) { return v.getUint16(o, le); }, p: function (v, H) { return v.setUint16(o, H, le); } }); }]; },
    i: function (c) { return [c, 4, function (o) { return ({ u: function (v) { return v.getInt32(o, le); }, p: function (v, i) { return v.setInt32(o, i, le); } }); }]; },
    I: function (c) { return [c, 4, function (o) { return ({ u: function (v) { return v.getUint32(o, le); }, p: function (v, I) { return v.setUint32(o, I, le); } }); }]; },
    f: function (c) { return [c, 4, function (o) { return ({ u: function (v) { return v.getFloat32(o, le); }, p: function (v, f) { return v.setFloat32(o, f, le); } }); }]; },
    d: function (c) { return [c, 8, function (o) { return ({ u: function (v) { return v.getFloat64(o, le); }, p: function (v, d) { return v.setFloat64(o, d, le); } }); }]; },
    s: function (c) { return [1, c, function (o) { return ({ u: function (v) { return str(v, o, c); }, p: function (v, s) { return rts(v, o, c, s.slice(0, c)); } }); }]; },
    p: function (c) { return [1, c, function (o) { return ({ u: function (v) { return pst(v, o, c); }, p: function (v, s) { return tsp(v, o, c, s.slice(0, c - 1)); } }); }]; }
}); };
var errbuf = new RangeError("Structure larger than remaining buffer");
var errval = new RangeError("Not enough values for structure");
function struct(format) {
    var fns = [], size = 0, m = rechk.exec(format);
    if (!m) {
        throw new RangeError("Invalid format string");
    }
    var t = lut('<' === m[1]), lu = function (n, c) { return t[c](n ? parseInt(n, 10) : 1); };
    while ((m = refmt.exec(format))) {
        (function (r, s, f) {
            for (var i = 0; i < r; ++i, size += s) {
                if (f) {
                    fns.push(f(size));
                }
            }
        }).apply(void 0, __spread(lu.apply(void 0, __spread(m.slice(1)))));
    }
    var unpack_from = function (arrb, offs) {
        if (arrb.byteLength < (offs | 0) + size) {
            throw errbuf;
        }
        var v = new DataView(arrb, offs | 0);
        return fns.map(function (f) { return f.u(v); });
    };
    var pack_into = function (arrb, offs) {
        var values = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            values[_i - 2] = arguments[_i];
        }
        if (values.length < fns.length) {
            throw errval;
        }
        if (arrb.byteLength < offs + size) {
            throw errbuf;
        }
        var v = new DataView(arrb, offs);
        new Uint8Array(arrb, offs, size).fill(0);
        fns.forEach(function (f, i) { return f.p(v, values[i]); });
    };
    var pack_into_with_array = function (arrb, offs, values) {
        var v = new DataView(arrb, offs);
        new Uint8Array(arrb, offs, size).fill(0);
        fns.forEach(function (f, i) { return f.p(v, values[i]); });
    };
    var pack = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var b = new ArrayBuffer(size);
        pack_into.apply(void 0, __spread([b, 0], values));
        return b;
    };
    var unpack = function (arrb) { return unpack_from(arrb, 0); };
    function iter_unpack(arrb) {
        var offs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offs = 0;
                    _a.label = 1;
                case 1:
                    if (!(offs + size <= arrb.byteLength)) return [3 /*break*/, 4];
                    return [4 /*yield*/, unpack_from(arrb, offs)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    offs += size;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }
    return Object.freeze({
        unpack: unpack, pack: pack, unpack_from: unpack_from, pack_into: pack_into, pack_into_with_array: pack_into_with_array, iter_unpack: iter_unpack, format: format, size: size
    });
}
exports.default = struct;
