"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var struct_1 = __importDefault(require("./struct"));
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return view.buffer;
}
function byteArray(length) {
    var ab = new ArrayBuffer(length);
    var view = new Uint8Array(ab);
    return view.buffer;
}
function ceil4(n) {
    return (n + 3) & ~3;
}
function ttc2ttf(ttcPath, distPath) {
    var buf = toArrayBuffer(fs_1.default.readFileSync(ttcPath));
    var type = struct_1.default('4c').unpack_from(buf, 0).join('');
    var fileHeadName = path_1.default.basename(ttcPath, path_1.default.extname(ttcPath));
    if (type == 'ttcf') {
        var ttfCount = struct_1.default('I').unpack_from(buf, 0x08)[0];
        Array.from(new Array(ttfCount)).forEach(function (_, i) {
            var _a;
            var tableHeaderOffset = struct_1.default('I').unpack_from(buf, 0x0C + 0x04 * i)[0];
            var tableCount = struct_1.default('H').unpack_from(buf, tableHeaderOffset + 0x04)[0];
            var headerLength = 0x0C + tableCount * 0x10;
            var tableLength = 0;
            for (var j = 0; j < tableCount; j++) {
                var length = struct_1.default('I').unpack_from(buf, tableHeaderOffset + +0x0C + 0x0C + j * 0x10)[0];
                tableLength += ceil4(length);
            }
            var totalLength = headerLength + tableLength;
            var newBuf = byteArray(totalLength);
            var header = struct_1.default(headerLength + 'b').unpack_from(buf, tableHeaderOffset);
            (_a = struct_1.default(headerLength + "b")).pack_into.apply(_a, __spread([newBuf, 0], header));
            var currentOffset = headerLength;
            var ttfName = fileHeadName + "_" + i + ".ttf";
            var ttfPath = path_1.default.join(distPath, ttfName);
            if (fs_1.default.existsSync(ttfPath))
                return;
            var _loop_1 = function (j) {
                var offset = struct_1.default('I').unpack_from(buf, tableHeaderOffset + 0x0C + 0x08 + j * 0x10)[0];
                var length = struct_1.default('I').unpack_from(buf, tableHeaderOffset + 0x0C + 0x0C + j * 0x10)[0];
                struct_1.default('I').pack_into(newBuf, 0x0C + 0x08 + j * 0x10, currentOffset);
                var CHUCK_LENGTH = 1024 * 1024;
                var lastLength = length % CHUCK_LENGTH;
                var steps = parseInt((length / CHUCK_LENGTH).toString());
                if (lastLength > 0)
                    steps++;
                Array.from(Array(steps)).forEach(function (_, i) {
                    var chuckOffset = offset + i * CHUCK_LENGTH;
                    var chunckLength = (steps != i + 1) ? CHUCK_LENGTH : lastLength;
                    var currentTable = struct_1.default(chunckLength + 'b').unpack_from(buf, chuckOffset);
                    struct_1.default(chunckLength + 'b').pack_into_with_array(newBuf, currentOffset, currentTable);
                    currentOffset += ceil4(chunckLength);
                });
            };
            for (var j = 0; j < tableCount; j++) {
                _loop_1(j);
            }
            console.log(ttfPath + ' is extracted');
            fs_1.default.writeFileSync(ttfPath, Buffer.from(newBuf));
        });
    }
    else {
        console.log(ttcPath + 'has not format of ttc...');
    }
}
exports.default = ttc2ttf;
