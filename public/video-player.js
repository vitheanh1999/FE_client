(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory)
    } else if (typeof exports === "object") {
        module.exports = factory()
    } else {
        root.Decoder = factory()
    }
})(this, function() {
    var global;

    function initglobal() {
        global = this;
        if (!global) {
            if (typeof window != "undefined") {
                global = window
            } else if (typeof self != "undefined") {
                global = self
            }
        }
    }
    initglobal();

    function error(message) {
        console.error(message);
        console.trace()
    }

    function assert(condition, message) {
        if (!condition) {
            error(message)
        }
    }
    var getModule = function(par_broadwayOnHeadersDecoded, par_broadwayOnPictureDecoded) {
        var Module = typeof Module !== "undefined" ? Module : {};
        var moduleOverrides = {};
        var key;
        for (key in Module) {
            if (Module.hasOwnProperty(key)) {
                moduleOverrides[key] = Module[key]
            }
        }
        Module["arguments"] = [];
        Module["thisProgram"] = "./this.program";
        Module["quit"] = function(status, toThrow) {
            throw toThrow
        };
        Module["preRun"] = [];
        Module["postRun"] = [];
        var ENVIRONMENT_IS_WEB = false;
        var ENVIRONMENT_IS_WORKER = false;
        var ENVIRONMENT_IS_NODE = false;
        var ENVIRONMENT_IS_SHELL = false;
        if (Module["ENVIRONMENT"]) {
            if (Module["ENVIRONMENT"] === "WEB") {
                ENVIRONMENT_IS_WEB = true
            } else if (Module["ENVIRONMENT"] === "WORKER") {
                ENVIRONMENT_IS_WORKER = true
            } else if (Module["ENVIRONMENT"] === "NODE") {
                ENVIRONMENT_IS_NODE = true
            } else if (Module["ENVIRONMENT"] === "SHELL") {
                ENVIRONMENT_IS_SHELL = true
            } else {
                throw new Error("Module['ENVIRONMENT'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.")
            }
        } else {
            ENVIRONMENT_IS_WEB = typeof window === "object";
            ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
            ENVIRONMENT_IS_NODE = typeof process === "object" && typeof null === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
            ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER
        }
        if (ENVIRONMENT_IS_NODE) {
            var nodeFS;
            var nodePath;
            Module["read"] = function shell_read(filename, binary) {
                var ret;
                if (!nodeFS) nodeFS = null("fs");
                if (!nodePath) nodePath = null("path");
                filename = nodePath["normalize"](filename);
                ret = nodeFS["readFileSync"](filename);
                return binary ? ret : ret.toString()
            };
            Module["readBinary"] = function readBinary(filename) {
                var ret = Module["read"](filename, true);
                if (!ret.buffer) {
                    ret = new Uint8Array(ret)
                }
                assert(ret.buffer);
                return ret
            };
            if (process["argv"].length > 1) {
                Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/")
            }
            Module["arguments"] = process["argv"].slice(2);
            if (typeof module !== "undefined") {
                module["exports"] = Module
            }
            process["on"]("uncaughtException", function(ex) {
                if (!(ex instanceof ExitStatus)) {
                    throw ex
                }
            });
            process["on"]("unhandledRejection", function(reason, p) {
                process["exit"](1)
            });
            Module["inspect"] = function() {
                return "[Emscripten Module object]"
            }
        } else if (ENVIRONMENT_IS_SHELL) {
            if (typeof read != "undefined") {
                Module["read"] = function shell_read(f) {
                    return read(f)
                }
            }
            Module["readBinary"] = function readBinary(f) {
                var data;
                if (typeof readbuffer === "function") {
                    return new Uint8Array(readbuffer(f))
                }
                data = read(f, "binary");
                assert(typeof data === "object");
                return data
            };
            if (typeof scriptArgs != "undefined") {
                Module["arguments"] = scriptArgs
            } else if (typeof arguments != "undefined") {
                Module["arguments"] = arguments
            }
            if (typeof quit === "function") {
                Module["quit"] = function(status, toThrow) {
                    quit(status)
                }
            }
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            Module["read"] = function shell_read(url) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.send(null);
                return xhr.responseText
            };
            if (ENVIRONMENT_IS_WORKER) {
                Module["readBinary"] = function readBinary(url) {
                    var xhr = new XMLHttpRequest;
                    xhr.open("GET", url, false);
                    xhr.responseType = "arraybuffer";
                    xhr.send(null);
                    return new Uint8Array(xhr.response)
                }
            }
            Module["readAsync"] = function readAsync(url, onload, onerror) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = function xhr_onload() {
                    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                        onload(xhr.response);
                        return
                    }
                    onerror()
                };
                xhr.onerror = onerror;
                xhr.send(null)
            };
            Module["setWindowTitle"] = function(title) {
                document.title = title
            }
        } else {
            throw new Error("not compiled for this environment")
        }
        Module["print"] = typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null;
        Module["printErr"] = typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || Module["print"];
        Module.print = Module["print"];
        Module.printErr = Module["printErr"];
        for (key in moduleOverrides) {
            if (moduleOverrides.hasOwnProperty(key)) {
                Module[key] = moduleOverrides[key]
            }
        }
        moduleOverrides = undefined;
        var STACK_ALIGN = 16;

        function staticAlloc(size) {
            assert(!staticSealed);
            var ret = STATICTOP;
            STATICTOP = STATICTOP + size + 15 & -16;
            return ret
        }

        function alignMemory(size, factor) {
            if (!factor) factor = STACK_ALIGN;
            var ret = size = Math.ceil(size / factor) * factor;
            return ret
        }
        var asm2wasmImports = {
            "f64-rem": function(x, y) {
                return x % y
            },
            debugger: function() {
                debugger
            }
        };
        var functionPointers = new Array(0);
        var GLOBAL_BASE = 1024;
        var ABORT = 0;
        var EXITSTATUS = 0;

        function assert(condition, text) {
            if (!condition) {
                abort("Assertion failed: " + text)
            }
        }

        function Pointer_stringify(ptr, length) {
            if (length === 0 || !ptr) return "";
            var hasUtf = 0;
            var t;
            var i = 0;
            while (1) {
                t = HEAPU8[ptr + i >> 0];
                hasUtf |= t;
                if (t == 0 && !length) break;
                i++;
                if (length && i == length) break
            }
            if (!length) length = i;
            var ret = "";
            if (hasUtf < 128) {
                var MAX_CHUNK = 1024;
                var curr;
                while (length > 0) {
                    curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
                    ret = ret ? ret + curr : curr;
                    ptr += MAX_CHUNK;
                    length -= MAX_CHUNK
                }
                return ret
            }
            return UTF8ToString(ptr)
        }
        var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

        function UTF8ArrayToString(u8Array, idx) {
            var endPtr = idx;
            while (u8Array[endPtr]) ++endPtr;
            if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
                return UTF8Decoder.decode(u8Array.subarray(idx, endPtr))
            } else {
                var u0, u1, u2, u3, u4, u5;
                var str = "";
                while (1) {
                    u0 = u8Array[idx++];
                    if (!u0) return str;
                    if (!(u0 & 128)) {
                        str += String.fromCharCode(u0);
                        continue
                    }
                    u1 = u8Array[idx++] & 63;
                    if ((u0 & 224) == 192) {
                        str += String.fromCharCode((u0 & 31) << 6 | u1);
                        continue
                    }
                    u2 = u8Array[idx++] & 63;
                    if ((u0 & 240) == 224) {
                        u0 = (u0 & 15) << 12 | u1 << 6 | u2
                    } else {
                        u3 = u8Array[idx++] & 63;
                        if ((u0 & 248) == 240) {
                            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3
                        } else {
                            u4 = u8Array[idx++] & 63;
                            if ((u0 & 252) == 248) {
                                u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4
                            } else {
                                u5 = u8Array[idx++] & 63;
                                u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5
                            }
                        }
                    }
                    if (u0 < 65536) {
                        str += String.fromCharCode(u0)
                    } else {
                        var ch = u0 - 65536;
                        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                    }
                }
            }
        }

        function UTF8ToString(ptr) {
            return UTF8ArrayToString(HEAPU8, ptr)
        }
        var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
        var WASM_PAGE_SIZE = 65536;
        var ASMJS_PAGE_SIZE = 16777216;

        function alignUp(x, multiple) {
            if (x % multiple > 0) {
                x += multiple - x % multiple
            }
            return x
        }
        var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

        function updateGlobalBuffer(buf) {
            Module["buffer"] = buffer = buf
        }

        function updateGlobalBufferViews() {
            Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
            Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
            Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
            Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
            Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
            Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
            Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
            Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer)
        }
        var STATIC_BASE, STATICTOP, staticSealed;
        var STACK_BASE, STACKTOP, STACK_MAX;
        var DYNAMIC_BASE, DYNAMICTOP_PTR;
        STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
        staticSealed = false;

        function abortOnCannotGrowMemory() {
            abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
        }

        function enlargeMemory() {
            abortOnCannotGrowMemory()
        }
        var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
        var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 52428800;
        if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
        if (Module["buffer"]) {
            buffer = Module["buffer"]
        } else {
            if (typeof WebAssembly === "object" && typeof WebAssembly.Memory === "function") {
                Module["wasmMemory"] = new WebAssembly.Memory({
                    initial: TOTAL_MEMORY / WASM_PAGE_SIZE,
                    maximum: TOTAL_MEMORY / WASM_PAGE_SIZE
                });
                buffer = Module["wasmMemory"].buffer
            } else {
                buffer = new ArrayBuffer(TOTAL_MEMORY)
            }
            Module["buffer"] = buffer
        }
        updateGlobalBufferViews();

        function getTotalMemory() {
            return TOTAL_MEMORY
        }
        HEAP32[0] = 1668509029;
        HEAP16[1] = 25459;
        if (HEAPU8[2] !== 115 || HEAPU8[3] !== 99) throw "Runtime error: expected the system to be little-endian!";

        function callRuntimeCallbacks(callbacks) {
            while (callbacks.length > 0) {
                var callback = callbacks.shift();
                if (typeof callback == "function") {
                    callback();
                    continue
                }
                var func = callback.func;
                if (typeof func === "number") {
                    if (callback.arg === undefined) {
                        Module["dynCall_v"](func)
                    } else {
                        Module["dynCall_vi"](func, callback.arg)
                    }
                } else {
                    func(callback.arg === undefined ? null : callback.arg)
                }
            }
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        var runtimeExited = false;

        function preRun() {
            if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                while (Module["preRun"].length) {
                    addOnPreRun(Module["preRun"].shift())
                }
            }
            callRuntimeCallbacks(__ATPRERUN__)
        }

        function ensureInitRuntime() {
            if (runtimeInitialized) return;
            runtimeInitialized = true;
            callRuntimeCallbacks(__ATINIT__)
        }

        function preMain() {
            callRuntimeCallbacks(__ATMAIN__)
        }

        function exitRuntime() {
            callRuntimeCallbacks(__ATEXIT__);
            runtimeExited = true
        }

        function postRun() {
            if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                while (Module["postRun"].length) {
                    addOnPostRun(Module["postRun"].shift())
                }
            }
            callRuntimeCallbacks(__ATPOSTRUN__)
        }

        function addOnPreRun(cb) {
            __ATPRERUN__.unshift(cb)
        }

        function addOnPostRun(cb) {
            __ATPOSTRUN__.unshift(cb)
        }
        var Math_abs = Math.abs;
        var Math_cos = Math.cos;
        var Math_sin = Math.sin;
        var Math_tan = Math.tan;
        var Math_acos = Math.acos;
        var Math_asin = Math.asin;
        var Math_atan = Math.atan;
        var Math_atan2 = Math.atan2;
        var Math_exp = Math.exp;
        var Math_log = Math.log;
        var Math_sqrt = Math.sqrt;
        var Math_ceil = Math.ceil;
        var Math_floor = Math.floor;
        var Math_pow = Math.pow;
        var Math_imul = Math.imul;
        var Math_fround = Math.fround;
        var Math_round = Math.round;
        var Math_min = Math.min;
        var Math_max = Math.max;
        var Math_clz32 = Math.clz32;
        var Math_trunc = Math.trunc;
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;

        function addRunDependency(id) {
            runDependencies++;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies)
            }
        }

        function removeRunDependency(id) {
            runDependencies--;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies)
            }
            if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null
                }
                if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback()
                }
            }
        }
        Module["preloadedImages"] = {};
        Module["preloadedAudios"] = {};
        var dataURIPrefix = "data:application/octet-stream;base64,";

        function isDataURI(filename) {
            return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0
        }

        function integrateWasmJS() {
            var wasmTextFile = "avc.wast";
            var wasmBinaryFile = "avc.wasm";
            var asmjsCodeFile = "avc.temp.asm.js";
            if (typeof Module["locateFile"] === "function") {
                if (!isDataURI(wasmTextFile)) {
                    wasmTextFile = Module["locateFile"](wasmTextFile)
                }
                if (!isDataURI(wasmBinaryFile)) {
                    wasmBinaryFile = Module["locateFile"](wasmBinaryFile)
                }
                if (!isDataURI(asmjsCodeFile)) {
                    asmjsCodeFile = Module["locateFile"](asmjsCodeFile)
                }
            }
            var wasmPageSize = 64 * 1024;
            var info = {
                global: null,
                env: null,
                asm2wasm: asm2wasmImports,
                parent: Module
            };
            var exports = null;

            function mergeMemory(newBuffer) {
                var oldBuffer = Module["buffer"];
                if (newBuffer.byteLength < oldBuffer.byteLength) {
                    Module["printErr"]("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here")
                }
                var oldView = new Int8Array(oldBuffer);
                var newView = new Int8Array(newBuffer);
                newView.set(oldView);
                updateGlobalBuffer(newBuffer);
                updateGlobalBufferViews()
            }

            function fixImports(imports) {
                return imports
            }

            function getBinary() {
                try {
                    if (Module["wasmBinary"]) {
                        return new Uint8Array(Module["wasmBinary"])
                    }
                    if (Module["readBinary"]) {
                        return Module["readBinary"](wasmBinaryFile)
                    } else {
                        throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)"
                    }
                } catch (err) {
                    abort(err)
                }
            }

            function getBinaryPromise() {
                if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
                    return fetch(wasmBinaryFile, {
                        credentials: "same-origin"
                    }).then(function(response) {
                        if (!response["ok"]) {
                            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                        }
                        return response["arrayBuffer"]()
                    }).catch(function() {
                        return getBinary()
                    })
                }
                return new Promise(function(resolve, reject) {
                    resolve(getBinary())
                })
            }

            function doNativeWasm(global, env, providedBuffer) {
                if (typeof WebAssembly !== "object") {
                    Module["printErr"]("no native wasm support detected");
                    return false
                }
                if (!(Module["wasmMemory"] instanceof WebAssembly.Memory)) {
                    Module["printErr"]("no native wasm Memory in use");
                    return false
                }
                env["memory"] = Module["wasmMemory"];
                info["global"] = {
                    NaN: NaN,
                    Infinity: Infinity
                };
                info["global.Math"] = Math;
                info["env"] = env;

                function receiveInstance(instance, module) {
                    exports = instance.exports;
                    if (exports.memory) mergeMemory(exports.memory);
                    Module["asm"] = exports;
                    Module["usingWasm"] = true;
                    removeRunDependency("wasm-instantiate")
                }
                addRunDependency("wasm-instantiate");
                if (Module["instantiateWasm"]) {
                    try {
                        return Module["instantiateWasm"](info, receiveInstance)
                    } catch (e) {
                        Module["printErr"]("Module.instantiateWasm callback failed with error: " + e);
                        return false
                    }
                }

                function receiveInstantiatedSource(output) {
                    receiveInstance(output["instance"], output["module"])
                }

                function instantiateArrayBuffer(receiver) {
					console.log('receiver = ', receiver);
                    getBinaryPromise().then(function(binary) {
                        return WebAssembly.instantiate(binary, info)
                    }).then(receiver).catch(function(reason) {
                        Module["printErr"]("failed to asynchronously prepare wasm: " + reason);
                        abort(reason)
                    })
                }
                if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
                    WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, {
                        credentials: "same-origin"
                    }), info).then(receiveInstantiatedSource).catch(function(reason) {
                        Module["printErr"]("wasm streaming compile failed: " + reason);
                        Module["printErr"]("falling back to ArrayBuffer instantiation");
                        instantiateArrayBuffer(receiveInstantiatedSource)
                    })
                } else {
                    instantiateArrayBuffer(receiveInstantiatedSource)
                }
                return {}
            }
            Module["asmPreload"] = Module["asm"];
            var asmjsReallocBuffer = Module["reallocBuffer"];
            var wasmReallocBuffer = function(size) {
                var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
                size = alignUp(size, PAGE_MULTIPLE);
                var old = Module["buffer"];
                var oldSize = old.byteLength;
                if (Module["usingWasm"]) {
                    try {
                        var result = Module["wasmMemory"].grow((size - oldSize) / wasmPageSize);
                        if (result !== (-1 | 0)) {
                            return Module["buffer"] = Module["wasmMemory"].buffer
                        } else {
                            return null
                        }
                    } catch (e) {
                        return null
                    }
                }
            };
            Module["reallocBuffer"] = function(size) {
                if (finalMethod === "asmjs") {
                    return asmjsReallocBuffer(size)
                } else {
                    return wasmReallocBuffer(size)
                }
            };
            var finalMethod = "";
            Module["asm"] = function(global, env, providedBuffer) {
                env = fixImports(env);
                if (!env["table"]) {
                    var TABLE_SIZE = Module["wasmTableSize"];
                    if (TABLE_SIZE === undefined) TABLE_SIZE = 1024;
                    var MAX_TABLE_SIZE = Module["wasmMaxTableSize"];
                    if (typeof WebAssembly === "object" && typeof WebAssembly.Table === "function") {
                        if (MAX_TABLE_SIZE !== undefined) {
                            env["table"] = new WebAssembly.Table({
                                initial: TABLE_SIZE,
                                maximum: MAX_TABLE_SIZE,
                                element: "anyfunc"
                            })
                        } else {
                            env["table"] = new WebAssembly.Table({
                                initial: TABLE_SIZE,
                                element: "anyfunc"
                            })
                        }
                    } else {
                        env["table"] = new Array(TABLE_SIZE)
                    }
                    Module["wasmTable"] = env["table"]
                }
                if (!env["memoryBase"]) {
                    env["memoryBase"] = Module["STATIC_BASE"]
                }
                if (!env["tableBase"]) {
                    env["tableBase"] = 0
                }
                var exports;
                exports = doNativeWasm(global, env, providedBuffer);
                assert(exports, "no binaryen method succeeded.");
                return exports
            }
        }
        integrateWasmJS();
        STATIC_BASE = GLOBAL_BASE;
        STATICTOP = STATIC_BASE + 9888;
        __ATINIT__.push();
        var STATIC_BUMP = 9888;
        Module["STATIC_BASE"] = STATIC_BASE;
        Module["STATIC_BUMP"] = STATIC_BUMP;
        STATICTOP += 16;
        var SYSCALLS = {
            varargs: 0,
            get: function(varargs) {
                SYSCALLS.varargs += 4;
                var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
                return ret
            },
            getStr: function() {
                var ret = Pointer_stringify(SYSCALLS.get());
                return ret
            },
            get64: function() {
                var low = SYSCALLS.get(),
                    high = SYSCALLS.get();
                if (low >= 0) assert(high === 0);
                else assert(high === -1);
                return low
            },
            getZero: function() {
                assert(SYSCALLS.get() === 0)
            }
        };

        function ___syscall140(which, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.getStreamFromFD(),
                    offset_high = SYSCALLS.get(),
                    offset_low = SYSCALLS.get(),
                    result = SYSCALLS.get(),
                    whence = SYSCALLS.get();
                var offset = offset_low;
                FS.llseek(stream, offset, whence);
                HEAP32[result >> 2] = stream.position;
                if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
                return 0
            } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
                return -e.errno
            }
        }

        function ___syscall146(which, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.get(),
                    iov = SYSCALLS.get(),
                    iovcnt = SYSCALLS.get();
                var ret = 0;
                if (!___syscall146.buffers) {
                    ___syscall146.buffers = [null, [],
                        []
                    ];
                    ___syscall146.printChar = function(stream, curr) {
                        var buffer = ___syscall146.buffers[stream];
                        assert(buffer);
                        if (curr === 0 || curr === 10) {
                            (stream === 1 ? Module["print"] : Module["printErr"])(UTF8ArrayToString(buffer, 0));
                            buffer.length = 0
                        } else {
                            buffer.push(curr)
                        }
                    }
                }
                for (var i = 0; i < iovcnt; i++) {
                    var ptr = HEAP32[iov + i * 8 >> 2];
                    var len = HEAP32[iov + (i * 8 + 4) >> 2];
                    for (var j = 0; j < len; j++) {
                        ___syscall146.printChar(stream, HEAPU8[ptr + j])
                    }
                    ret += len
                }
                return ret
            } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
                return -e.errno
            }
        }

        function ___syscall54(which, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                return 0
            } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
                return -e.errno
            }
        }

        function ___syscall6(which, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.getStreamFromFD();
                FS.close(stream);
                return 0
            } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
                return -e.errno
            }
        }

        function _broadwayOnHeadersDecoded() {
            par_broadwayOnHeadersDecoded()
        }
        Module["_broadwayOnHeadersDecoded"] = _broadwayOnHeadersDecoded;

        function _broadwayOnPictureDecoded($buffer, width, height) {
            par_broadwayOnPictureDecoded($buffer, width, height)
        }
        Module["_broadwayOnPictureDecoded"] = _broadwayOnPictureDecoded;

        function _emscripten_memcpy_big(dest, src, num) {
            HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
            return dest
        }

        function ___setErrNo(value) {
            if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
            return value
        }
        DYNAMICTOP_PTR = staticAlloc(4);
        STACK_BASE = STACKTOP = alignMemory(STATICTOP);
        STACK_MAX = STACK_BASE + TOTAL_STACK;
        DYNAMIC_BASE = alignMemory(STACK_MAX);
        HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
        staticSealed = true;
        Module["wasmTableSize"] = 10;
        Module["wasmMaxTableSize"] = 10;
        Module.asmGlobalArg = {};
        Module.asmLibraryArg = {
            abort: abort,
            enlargeMemory: enlargeMemory,
            getTotalMemory: getTotalMemory,
            abortOnCannotGrowMemory: abortOnCannotGrowMemory,
            ___setErrNo: ___setErrNo,
            ___syscall140: ___syscall140,
            ___syscall146: ___syscall146,
            ___syscall54: ___syscall54,
            ___syscall6: ___syscall6,
            _broadwayOnHeadersDecoded: _broadwayOnHeadersDecoded,
            _broadwayOnPictureDecoded: _broadwayOnPictureDecoded,
            _emscripten_memcpy_big: _emscripten_memcpy_big,
            DYNAMICTOP_PTR: DYNAMICTOP_PTR,
            STACKTOP: STACKTOP
        };
        var asm = Module["asm"](Module.asmGlobalArg, Module.asmLibraryArg, buffer);
        Module["asm"] = asm;
        var _broadwayCreateStream = Module["_broadwayCreateStream"] = function() {
            return Module["asm"]["_broadwayCreateStream"].apply(null, arguments)
        };
        var _broadwayExit = Module["_broadwayExit"] = function() {
            return Module["asm"]["_broadwayExit"].apply(null, arguments)
        };
        var _broadwayGetMajorVersion = Module["_broadwayGetMajorVersion"] = function() {
            return Module["asm"]["_broadwayGetMajorVersion"].apply(null, arguments)
        };
        var _broadwayGetMinorVersion = Module["_broadwayGetMinorVersion"] = function() {
            return Module["asm"]["_broadwayGetMinorVersion"].apply(null, arguments)
        };
        var _broadwayInit = Module["_broadwayInit"] = function() {
            return Module["asm"]["_broadwayInit"].apply(null, arguments)
        };
        var _broadwayPlayStream = Module["_broadwayPlayStream"] = function() {
            return Module["asm"]["_broadwayPlayStream"].apply(null, arguments)
        };
        Module["asm"] = asm;

        function ExitStatus(status) {
            this.name = "ExitStatus";
            this.message = "Program terminated with exit(" + status + ")";
            this.status = status
        }
        ExitStatus.prototype = new Error;
        ExitStatus.prototype.constructor = ExitStatus;
        var initialStackTop;
        dependenciesFulfilled = function runCaller() {
            if (!Module["calledRun"]) run();
            if (!Module["calledRun"]) dependenciesFulfilled = runCaller
        };

        function run(args) {
            args = args || Module["arguments"];
            if (runDependencies > 0) {
                return
            }
            preRun();
            if (runDependencies > 0) return;
            if (Module["calledRun"]) return;

            function doRun() {
                if (Module["calledRun"]) return;
                Module["calledRun"] = true;
                if (ABORT) return;
                ensureInitRuntime();
                preMain();
                if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                postRun()
            }
            if (Module["setStatus"]) {
                Module["setStatus"]("Running...");
                setTimeout(function() {
                    setTimeout(function() {
                        Module["setStatus"]("")
                    }, 1);
                    doRun()
                }, 1)
            } else {
                doRun()
            }
        }
        Module["run"] = run;

        function exit(status, implicit) {
            if (implicit && Module["noExitRuntime"] && status === 0) {
                return
            }
            if (Module["noExitRuntime"]) {} else {
                ABORT = true;
                EXITSTATUS = status;
                STACKTOP = initialStackTop;
                exitRuntime();
                if (Module["onExit"]) Module["onExit"](status)
            }
            if (ENVIRONMENT_IS_NODE) {
                process["exit"](status)
            }
            Module["quit"](status, new ExitStatus(status))
        }
        Module["exit"] = exit;

        function abort(what) {
            if (Module["onAbort"]) {
                Module["onAbort"](what)
            }
            if (what !== undefined) {
                Module.print(what);
                Module.printErr(what);
                what = JSON.stringify(what)
            } else {
                what = ""
            }
            ABORT = true;
            EXITSTATUS = 1;
            throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info."
        }
        Module["abort"] = abort;
        if (Module["preInit"]) {
            if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
            while (Module["preInit"].length > 0) {
                Module["preInit"].pop()()
            }
        }
        Module["noExitRuntime"] = true;
        run();
        var resultModule;
        if (typeof global !== "undefined") {
            if (global.Module) {
                resultModule = global.Module
            }
        }
        if (typeof Module != "undefined") {
            resultModule = Module
        }
        resultModule._broadwayOnHeadersDecoded = par_broadwayOnHeadersDecoded;
        resultModule._broadwayOnPictureDecoded = par_broadwayOnPictureDecoded;
        var moduleIsReady = false;
        var cbFun;
        var moduleReady = function() {
            moduleIsReady = true;
            if (cbFun) {
                cbFun(resultModule)
            }
        };
        resultModule.onRuntimeInitialized = function() {
            moduleReady(resultModule)
        };
        return function(callback) {
            if (moduleIsReady) {
                callback(resultModule)
            } else {
                cbFun = callback
            }
        }
    };
    return function() {
        "use strict";
        var nowValue = function() {
            return (new Date).getTime()
        };
        if (typeof performance != "undefined") {
            if (performance.now) {
                nowValue = function() {
                    return performance.now()
                }
            }
        }
        var Decoder = function(parOptions) {
            this.options = parOptions || {};
            this.now = nowValue;
            var asmInstance;
            var fakeWindow = {};
            var toU8Array;
            var toU32Array;
            var onPicFun = function($buffer, width, height) {
                var buffer = this.pictureBuffers[$buffer];
                if (!buffer) {
                    buffer = this.pictureBuffers[$buffer] = toU8Array($buffer, width * height * 3 / 2)
                }
                var infos;
                var doInfo = false;
                if (this.infoAr.length) {
                    doInfo = true;
                    infos = this.infoAr
                }
                this.infoAr = [];
                if (this.options.rgb) {
                    if (!asmInstance) {
                        asmInstance = getAsm(width, height)
                    }
                    asmInstance.inp.set(buffer);
                    asmInstance.doit();
                    var copyU8 = new Uint8Array(asmInstance.outSize);
                    copyU8.set(asmInstance.out);
                    if (doInfo) {
                        infos[0].finishDecoding = nowValue()
                    }
                    this.onPictureDecoded(copyU8, width, height, infos);
                    return
                }
                if (doInfo) {
                    infos[0].finishDecoding = nowValue()
                }
                this.onPictureDecoded(buffer, width, height, infos)
            }.bind(this);
            var ignore = false;
            if (this.options.sliceMode) {
                onPicFun = function($buffer, width, height, $sliceInfo) {
                    if (ignore) {
                        return
                    }
                    var buffer = this.pictureBuffers[$buffer];
                    if (!buffer) {
                        buffer = this.pictureBuffers[$buffer] = toU8Array($buffer, width * height * 3 / 2)
                    }
                    var sliceInfo = this.pictureBuffers[$sliceInfo];
                    if (!sliceInfo) {
                        sliceInfo = this.pictureBuffers[$sliceInfo] = toU32Array($sliceInfo, 18)
                    }
                    var infos;
                    var doInfo = false;
                    if (this.infoAr.length) {
                        doInfo = true;
                        infos = this.infoAr
                    }
                    this.infoAr = [];
                    infos[0].finishDecoding = nowValue();
                    var sliceInfoAr = [];
                    for (var i = 0; i < 20; ++i) {
                        sliceInfoAr.push(sliceInfo[i])
                    }
                    infos[0].sliceInfoAr = sliceInfoAr;
                    this.onPictureDecoded(buffer, width, height, infos)
                }.bind(this)
            }
            var ModuleCallback = getModule.apply(fakeWindow, [function() {}, onPicFun]);
            var MAX_STREAM_BUFFER_LENGTH = 1024 * 1024;
            var instance = this;
            this.onPictureDecoded = function(buffer, width, height, infos) {};
            this.onDecoderReady = function() {};
            var bufferedCalls = [];
            this.decode = function decode(typedAr, parInfo, copyDoneFun) {
                bufferedCalls.push([typedAr, parInfo, copyDoneFun])
            };
            ModuleCallback(function(Module) {
                var HEAP8 = Module.HEAP8;
                var HEAPU8 = Module.HEAPU8;
                var HEAP16 = Module.HEAP16;
                var HEAP32 = Module.HEAP32;
                Module._broadwayInit();
                toU8Array = function(ptr, length) {
                    return HEAPU8.subarray(ptr, ptr + length)
                };
                toU32Array = function(ptr, length) {
                    return new Uint32Array(HEAPU8.buffer, ptr, length)
                };
                instance.streamBuffer = toU8Array(Module._broadwayCreateStream(MAX_STREAM_BUFFER_LENGTH), MAX_STREAM_BUFFER_LENGTH);
                instance.pictureBuffers = {};
                instance.infoAr = [];
                var sliceNum = 0;
                if (instance.options.sliceMode) {
                    sliceNum = instance.options.sliceNum;
                    instance.decode = function decode(typedAr, parInfo, copyDoneFun) {
                        instance.infoAr.push(parInfo);
                        parInfo.startDecoding = nowValue();
                        var nals = parInfo.nals;
                        var i;
                        if (!nals) {
                            nals = [];
                            parInfo.nals = nals;
                            var l = typedAr.length;
                            var foundSomething = false;
                            var lastFound = 0;
                            var lastStart = 0;
                            for (i = 0; i < l; ++i) {
                                if (typedAr[i] === 1) {
                                    if (typedAr[i - 1] === 0 && typedAr[i - 2] === 0) {
                                        var startPos = i - 2;
                                        if (typedAr[i - 3] === 0) {
                                            startPos = i - 3
                                        }
                                        if (foundSomething) {
                                            nals.push({
                                                offset: lastFound,
                                                end: startPos,
                                                type: typedAr[lastStart] & 31
                                            })
                                        }
                                        lastFound = startPos;
                                        lastStart = startPos + 3;
                                        if (typedAr[i - 3] === 0) {
                                            lastStart = startPos + 4
                                        }
                                        foundSomething = true
                                    }
                                }
                            }
                            if (foundSomething) {
                                nals.push({
                                    offset: lastFound,
                                    end: i,
                                    type: typedAr[lastStart] & 31
                                })
                            }
                        }
                        var currentSlice = 0;
                        var playAr;
                        var offset = 0;
                        for (i = 0; i < nals.length; ++i) {
                            if (nals[i].type === 1 || nals[i].type === 5) {
                                if (currentSlice === sliceNum) {
                                    playAr = typedAr.subarray(nals[i].offset, nals[i].end);
                                    instance.streamBuffer[offset] = 0;
                                    offset += 1;
                                    instance.streamBuffer.set(playAr, offset);
                                    offset += playAr.length
                                }
                                currentSlice += 1
                            } else {
                                playAr = typedAr.subarray(nals[i].offset, nals[i].end);
                                instance.streamBuffer[offset] = 0;
                                offset += 1;
                                instance.streamBuffer.set(playAr, offset);
                                offset += playAr.length;
                                Module._broadwayPlayStream(offset);
                                offset = 0
                            }
                        }
                        copyDoneFun();
                        Module._broadwayPlayStream(offset)
                    }
                } else {
                    instance.decode = function decode(typedAr, parInfo) {
                        if (parInfo) {
                            instance.infoAr.push(parInfo);
                            parInfo.startDecoding = nowValue()
                        }
                        instance.streamBuffer.set(typedAr);
                        Module._broadwayPlayStream(typedAr.length)
                    }
                }
                if (bufferedCalls.length) {
                    var bi = 0;
                    for (bi = 0; bi < bufferedCalls.length; ++bi) {
                        instance.decode(bufferedCalls[bi][0], bufferedCalls[bi][1], bufferedCalls[bi][2])
                    }
                    bufferedCalls = []
                }
                instance.onDecoderReady(instance)
            })
        };
        Decoder.prototype = {};
        var asmInstances = {};
        var getAsm = function(parWidth, parHeight) {
            var idStr = "" + parWidth + "x" + parHeight;
            if (asmInstances[idStr]) {
                return asmInstances[idStr]
            }
            var lumaSize = parWidth * parHeight;
            var chromaSize = (lumaSize | 0) >> 2;
            var inpSize = lumaSize + chromaSize + chromaSize;
            var outSize = parWidth * parHeight * 4;
            var cacheSize = Math.pow(2, 24) * 4;
            var size = inpSize + outSize + cacheSize;
            var chunkSize = Math.pow(2, 24);
            var heapSize = chunkSize;
            while (heapSize < size) {
                heapSize += chunkSize
            }
            var heap = new ArrayBuffer(heapSize);
            var res = asmFactory(global, {}, heap);
            res.init(parWidth, parHeight);
            asmInstances[idStr] = res;
            res.heap = heap;
            res.out = new Uint8Array(heap, 0, outSize);
            res.inp = new Uint8Array(heap, outSize, inpSize);
            res.outSize = outSize;
            return res
        };

        function asmFactory(stdlib, foreign, heap) {
            "use asm";
            var imul = stdlib.Math.imul;
            var min = stdlib.Math.min;
            var max = stdlib.Math.max;
            var pow = stdlib.Math.pow;
            var out = new stdlib.Uint8Array(heap);
            var out32 = new stdlib.Uint32Array(heap);
            var inp = new stdlib.Uint8Array(heap);
            var mem = new stdlib.Uint8Array(heap);
            var mem32 = new stdlib.Uint32Array(heap);
            var width = 0;
            var height = 0;
            var lumaSize = 0;
            var chromaSize = 0;
            var inpSize = 0;
            var outSize = 0;
            var inpStart = 0;
            var outStart = 0;
            var widthFour = 0;
            var cacheStart = 0;

            function init(parWidth, parHeight) {
                parWidth = parWidth | 0;
                parHeight = parHeight | 0;
                var i = 0;
                var s = 0;
                width = parWidth;
                widthFour = imul(parWidth, 4) | 0;
                height = parHeight;
                lumaSize = imul(width | 0, height | 0) | 0;
                chromaSize = (lumaSize | 0) >> 2;
                outSize = imul(imul(width, height) | 0, 4) | 0;
                inpSize = lumaSize + chromaSize | 0 + chromaSize | 0;
                outStart = 0;
                inpStart = outStart + outSize | 0;
                cacheStart = inpStart + inpSize | 0;
                s = ~~+pow(+2, +24);
                s = imul(s, 4) | 0;
                for (i = 0 | 0;
                    (i | 0) < (s | 0) | 0; i = i + 4 | 0) {
                    mem32[(cacheStart + i | 0) >> 2] = 0
                }
            }

            function doit() {
                var ystart = 0;
                var ustart = 0;
                var vstart = 0;
                var y = 0;
                var yn = 0;
                var u = 0;
                var v = 0;
                var o = 0;
                var line = 0;
                var col = 0;
                var usave = 0;
                var vsave = 0;
                var ostart = 0;
                var cacheAdr = 0;
                ostart = outStart | 0;
                ystart = inpStart | 0;
                ustart = ystart + lumaSize | 0 | 0;
                vstart = ustart + chromaSize | 0;
                for (line = 0;
                    (line | 0) < (height | 0); line = line + 2 | 0) {
                    usave = ustart;
                    vsave = vstart;
                    for (col = 0;
                        (col | 0) < (width | 0); col = col + 2 | 0) {
                        y = inp[ystart >> 0] | 0;
                        yn = inp[(ystart + width | 0) >> 0] | 0;
                        u = inp[ustart >> 0] | 0;
                        v = inp[vstart >> 0] | 0;
                        cacheAdr = ((y << 16 | 0) + (u << 8 | 0) | 0) + v | 0;
                        o = mem32[(cacheStart + cacheAdr | 0) >> 2] | 0;
                        if (o) {} else {
                            o = yuv2rgbcalc(y, u, v) | 0;
                            mem32[(cacheStart + cacheAdr | 0) >> 2] = o | 0
                        }
                        mem32[ostart >> 2] = o;
                        cacheAdr = ((yn << 16 | 0) + (u << 8 | 0) | 0) + v | 0;
                        o = mem32[(cacheStart + cacheAdr | 0) >> 2] | 0;
                        if (o) {} else {
                            o = yuv2rgbcalc(yn, u, v) | 0;
                            mem32[(cacheStart + cacheAdr | 0) >> 2] = o | 0
                        }
                        mem32[(ostart + widthFour | 0) >> 2] = o;
                        ostart = ostart + 4 | 0;
                        ystart = ystart + 1 | 0;
                        y = inp[ystart >> 0] | 0;
                        yn = inp[(ystart + width | 0) >> 0] | 0;
                        cacheAdr = ((y << 16 | 0) + (u << 8 | 0) | 0) + v | 0;
                        o = mem32[(cacheStart + cacheAdr | 0) >> 2] | 0;
                        if (o) {} else {
                            o = yuv2rgbcalc(y, u, v) | 0;
                            mem32[(cacheStart + cacheAdr | 0) >> 2] = o | 0
                        }
                        mem32[ostart >> 2] = o;
                        cacheAdr = ((yn << 16 | 0) + (u << 8 | 0) | 0) + v | 0;
                        o = mem32[(cacheStart + cacheAdr | 0) >> 2] | 0;
                        if (o) {} else {
                            o = yuv2rgbcalc(yn, u, v) | 0;
                            mem32[(cacheStart + cacheAdr | 0) >> 2] = o | 0
                        }
                        mem32[(ostart + widthFour | 0) >> 2] = o;
                        ostart = ostart + 4 | 0;
                        ystart = ystart + 1 | 0;
                        ustart = ustart + 1 | 0;
                        vstart = vstart + 1 | 0
                    }
                    ostart = ostart + widthFour | 0;
                    ystart = ystart + width | 0
                }
            }

            function yuv2rgbcalc(y, u, v) {
                y = y | 0;
                u = u | 0;
                v = v | 0;
                var r = 0;
                var g = 0;
                var b = 0;
                var o = 0;
                var a0 = 0;
                var a1 = 0;
                var a2 = 0;
                var a3 = 0;
                var a4 = 0;
                a0 = imul(1192, y - 16 | 0) | 0;
                a1 = imul(1634, v - 128 | 0) | 0;
                a2 = imul(832, v - 128 | 0) | 0;
                a3 = imul(400, u - 128 | 0) | 0;
                a4 = imul(2066, u - 128 | 0) | 0;
                r = (a0 + a1 | 0) >> 10 | 0;
                g = ((a0 - a2 | 0) - a3 | 0) >> 10 | 0;
                b = (a0 + a4 | 0) >> 10 | 0;
                if ((r & 255 | 0) != (r | 0) | 0) {
                    r = min(255, max(0, r | 0) | 0) | 0
                }
                if ((g & 255 | 0) != (g | 0) | 0) {
                    g = min(255, max(0, g | 0) | 0) | 0
                }
                if ((b & 255 | 0) != (b | 0) | 0) {
                    b = min(255, max(0, b | 0) | 0) | 0
                }
                o = 255;
                o = o << 8 | 0;
                o = o + b | 0;
                o = o << 8 | 0;
                o = o + g | 0;
                o = o << 8 | 0;
                o = o + r | 0;
                return o | 0
            }
            return {
                init: init,
                doit: doit
            }
        }
        if (typeof self != "undefined") {
            var isWorker = false;
            var decoder;
            var reuseMemory = false;
            var sliceMode = false;
            var sliceNum = 0;
            var sliceCnt = 0;
            var lastSliceNum = 0;
            var sliceInfoAr;
            var lastBuf;
            var awaiting = 0;
            var pile = [];
            var startDecoding;
            var finishDecoding;
            var timeDecoding;
            var memAr = [];
            var getMem = function(length) {
                if (memAr.length) {
                    var u = memAr.shift();
                    while (u && u.byteLength !== length) {
                        u = memAr.shift()
                    }
                    if (u) {
                        return u
                    }
                }
                return new ArrayBuffer(length)
            };
            var copySlice = function(source, target, infoAr, width, height) {
                var length = width * height;
                var length4 = length / 4;
                var plane2 = length;
                var plane3 = length + length4;
                var copy16 = function(parBegin, parEnd) {
                    var i = 0;
                    for (i = 0; i < 16; ++i) {
                        var begin = parBegin + width * i;
                        var end = parEnd + width * i;
                        target.set(source.subarray(begin, end), begin)
                    }
                };
                var copy8 = function(parBegin, parEnd) {
                    var i = 0;
                    for (i = 0; i < 8; ++i) {
                        var begin = parBegin + width / 2 * i;
                        var end = parEnd + width / 2 * i;
                        target.set(source.subarray(begin, end), begin)
                    }
                };
                var copyChunk = function(begin, end) {
                    target.set(source.subarray(begin, end), begin)
                };
                var begin = infoAr[0];
                var end = infoAr[1];
                if (end > 0) {
                    copy16(begin, end);
                    copy8(infoAr[2], infoAr[3]);
                    copy8(infoAr[4], infoAr[5])
                }
                begin = infoAr[6];
                end = infoAr[7];
                if (end > 0) {
                    copy16(begin, end);
                    copy8(infoAr[8], infoAr[9]);
                    copy8(infoAr[10], infoAr[11])
                }
                begin = infoAr[12];
                end = infoAr[15];
                if (end > 0) {
                    copyChunk(begin, end);
                    copyChunk(infoAr[13], infoAr[16]);
                    copyChunk(infoAr[14], infoAr[17])
                }
            };
            var sliceMsgFun = function() {};
            var setSliceCnt = function(parSliceCnt) {
                sliceCnt = parSliceCnt;
                lastSliceNum = sliceCnt - 1
            };
            self.addEventListener("message", function(e) {
                if (isWorker) {
                    if (reuseMemory) {
                        if (e.data.reuse) {
                            memAr.push(e.data.reuse)
                        }
                    }
                    if (e.data.buf) {
                        if (sliceMode && awaiting !== 0) {
                            pile.push(e.data)
                        } else {
                            decoder.decode(new Uint8Array(e.data.buf, e.data.offset || 0, e.data.length), e.data.info, function() {
                                if (sliceMode && sliceNum !== lastSliceNum) {
                                    postMessage(e.data, [e.data.buf])
                                }
                            })
                        }
                        return
                    }
                    if (e.data.slice) {
                        var copyStart = nowValue();
                        copySlice(new Uint8Array(e.data.slice), lastBuf, e.data.infos[0].sliceInfoAr, e.data.width, e.data.height);
                        if (e.data.theOne) {
                            copySlice(lastBuf, new Uint8Array(e.data.slice), sliceInfoAr, e.data.width, e.data.height);
                            if (timeDecoding > e.data.infos[0].timeDecoding) {
                                e.data.infos[0].timeDecoding = timeDecoding
                            }
                            e.data.infos[0].timeCopy += nowValue() - copyStart
                        }
                        postMessage(e.data, [e.data.slice]);
                        awaiting -= 1;
                        if (awaiting === 0 && pile.length) {
                            var data = pile.shift();
                            decoder.decode(new Uint8Array(data.buf, data.offset || 0, data.length), data.info, function() {
                                if (sliceMode && sliceNum !== lastSliceNum) {
                                    postMessage(data, [data.buf])
                                }
                            })
                        }
                        return
                    }
                    if (e.data.setSliceCnt) {
                        setSliceCnt(e.data.sliceCnt);
                        return
                    }
                } else {
                    if (e.data && e.data.type === "Broadway.js - Worker init") {
                        isWorker = true;
						console.log('e = ', e);
                        decoder = new Decoder(e.data.options);
                        if (e.data.options.sliceMode) {
                            reuseMemory = true;
                            sliceMode = true;
                            sliceNum = e.data.options.sliceNum;
                            setSliceCnt(e.data.options.sliceCnt);
                            decoder.onPictureDecoded = function(buffer, width, height, infos) {
                                var copyU8 = new Uint8Array(getMem(buffer.length));
                                copySlice(buffer, copyU8, infos[0].sliceInfoAr, width, height);
                                startDecoding = infos[0].startDecoding;
                                finishDecoding = infos[0].finishDecoding;
                                timeDecoding = finishDecoding - startDecoding;
                                infos[0].timeDecoding = timeDecoding;
                                infos[0].timeCopy = 0;
                                postMessage({
                                    slice: copyU8.buffer,
                                    sliceNum: sliceNum,
                                    width: width,
                                    height: height,
                                    infos: infos
                                }, [copyU8.buffer]);
                                awaiting = sliceCnt - 1;
                                lastBuf = buffer;
                                sliceInfoAr = infos[0].sliceInfoAr
                            }
                        } else if (e.data.options.reuseMemory) {
                            reuseMemory = true;
                            decoder.onPictureDecoded = function(buffer, width, height, infos) {
                                var copyU8 = new Uint8Array(getMem(buffer.length));
                                copyU8.set(buffer, 0, buffer.length);
                                postMessage({
                                    buf: copyU8.buffer,
                                    length: buffer.length,
                                    width: width,
                                    height: height,
                                    infos: infos
                                }, [copyU8.buffer])
                            }
                        } else {
                            decoder.onPictureDecoded = function(buffer, width, height, infos) {
                                if (buffer) {
                                    buffer = new Uint8Array(buffer)
                                }
                                var copyU8 = new Uint8Array(buffer.length);
                                copyU8.set(buffer, 0, buffer.length);
                                postMessage({
                                    buf: copyU8.buffer,
                                    length: buffer.length,
                                    width: width,
                                    height: height,
                                    infos: infos
                                }, [copyU8.buffer])
                            }
                        }
                        postMessage({
                            consoleLog: "broadway worker initialized"
                        })
                    }
                }
            }, false)
        }
        Decoder.nowValue = nowValue;
        return Decoder
    }()
});
(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory)
    } else if (typeof exports === "object") {
        module.exports = factory()
    } else {
        root.YUVCanvas = factory()
    }
})(this, function() {
    function YUVCanvas(parOptions) {
        parOptions = parOptions || {};
        this.canvasElement = parOptions.canvas || document.createElement("canvas");
        this.contextOptions = parOptions.contextOptions;
        this.type = parOptions.type || "yuv420";
        this.customYUV444 = parOptions.customYUV444;
        this.conversionType = parOptions.conversionType || "rec601";
        this.width = parOptions.width || 640;
        this.height = parOptions.height || 320;
        this.animationTime = parOptions.animationTime || 0;
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
        this.initContextGL();
        if (this.contextGL) {
            this.initProgram();
            this.initBuffers();
            this.initTextures()
        }
        if (this.type === "yuv420") {
            this.drawNextOuptutPictureGL = function(par) {
                var gl = this.contextGL;
                var texturePosBuffer = this.texturePosBuffer;
                var uTexturePosBuffer = this.uTexturePosBuffer;
                var vTexturePosBuffer = this.vTexturePosBuffer;
                var yTextureRef = this.yTextureRef;
                var uTextureRef = this.uTextureRef;
                var vTextureRef = this.vTextureRef;
                var yData = par.yData;
                var uData = par.uData;
                var vData = par.vData;
                var width = this.width;
                var height = this.height;
                var yDataPerRow = par.yDataPerRow || width;
                var yRowCnt = par.yRowCnt || height;
                var uDataPerRow = par.uDataPerRow || width / 2;
                var uRowCnt = par.uRowCnt || height / 2;
                var vDataPerRow = par.vDataPerRow || uDataPerRow;
                var vRowCnt = par.vRowCnt || uRowCnt;
                gl.viewport(0, 0, width, height);
                var tTop = 0;
                var tLeft = 0;
                var tBottom = height / yRowCnt;
                var tRight = width / yDataPerRow;
                var texturePosValues = new Float32Array([tRight, tTop, tLeft, tTop, tRight, tBottom, tLeft, tBottom]);
                gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, texturePosValues, gl.DYNAMIC_DRAW);
                if (this.customYUV444) {
                    tBottom = height / uRowCnt;
                    tRight = width / uDataPerRow
                } else {
                    tBottom = height / 2 / uRowCnt;
                    tRight = width / 2 / uDataPerRow
                }
                var uTexturePosValues = new Float32Array([tRight, tTop, tLeft, tTop, tRight, tBottom, tLeft, tBottom]);
                gl.bindBuffer(gl.ARRAY_BUFFER, uTexturePosBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, uTexturePosValues, gl.DYNAMIC_DRAW);
                if (this.customYUV444) {
                    tBottom = height / vRowCnt;
                    tRight = width / vDataPerRow
                } else {
                    tBottom = height / 2 / vRowCnt;
                    tRight = width / 2 / vDataPerRow
                }
                var vTexturePosValues = new Float32Array([tRight, tTop, tLeft, tTop, tRight, tBottom, tLeft, tBottom]);
                gl.bindBuffer(gl.ARRAY_BUFFER, vTexturePosBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, vTexturePosValues, gl.DYNAMIC_DRAW);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, yTextureRef);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, yDataPerRow, yRowCnt, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, yData);
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, uTextureRef);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, uDataPerRow, uRowCnt, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, uData);
                gl.activeTexture(gl.TEXTURE2);
                gl.bindTexture(gl.TEXTURE_2D, vTextureRef);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, vDataPerRow, vRowCnt, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, vData);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            }
        } else if (this.type === "yuv422") {
            this.drawNextOuptutPictureGL = function(par) {
                var gl = this.contextGL;
                var texturePosBuffer = this.texturePosBuffer;
                var textureRef = this.textureRef;
                var data = par.data;
                var width = this.width;
                var height = this.height;
                var dataPerRow = par.dataPerRow || width * 2;
                var rowCnt = par.rowCnt || height;
                gl.viewport(0, 0, width, height);
                var tTop = 0;
                var tLeft = 0;
                var tBottom = height / rowCnt;
                var tRight = width / (dataPerRow / 2);
                var texturePosValues = new Float32Array([tRight, tTop, tLeft, tTop, tRight, tBottom, tLeft, tBottom]);
                gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, texturePosValues, gl.DYNAMIC_DRAW);
                gl.uniform2f(gl.getUniformLocation(this.shaderProgram, "resolution"), dataPerRow, height);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, textureRef);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, dataPerRow, rowCnt, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            }
        }
    }
    YUVCanvas.prototype.isWebGL = function() {
        return this.contextGL
    };
    YUVCanvas.prototype.initContextGL = function() {
        var canvas = this.canvasElement;
        var gl = null;
        var validContextNames = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];
        var nameIndex = 0;
        while (!gl && nameIndex < validContextNames.length) {
            var contextName = validContextNames[nameIndex];
            try {
                if (this.contextOptions) {
                    gl = canvas.getContext(contextName, this.contextOptions)
                } else {
                    gl = canvas.getContext(contextName)
                }
            } catch (e) {
                gl = null
            }
            if (!gl || typeof gl.getParameter !== "function") {
                gl = null
            }++nameIndex
        }
        this.contextGL = gl
    };
    YUVCanvas.prototype.initProgram = function() {
        var gl = this.contextGL;
        var vertexShaderScript;
        var fragmentShaderScript;
        if (this.type === "yuv420") {
            vertexShaderScript = ["attribute vec4 vertexPos;", "attribute vec4 texturePos;", "attribute vec4 uTexturePos;", "attribute vec4 vTexturePos;", "varying vec2 textureCoord;", "varying vec2 uTextureCoord;", "varying vec2 vTextureCoord;", "void main()", "{", "  gl_Position = vertexPos;", "  textureCoord = texturePos.xy;", "  uTextureCoord = uTexturePos.xy;", "  vTextureCoord = vTexturePos.xy;", "}"].join("\n");
            fragmentShaderScript = ["precision highp float;", "varying highp vec2 textureCoord;", "varying highp vec2 uTextureCoord;", "varying highp vec2 vTextureCoord;", "uniform sampler2D ySampler;", "uniform sampler2D uSampler;", "uniform sampler2D vSampler;", "uniform mat4 YUV2RGB;", "void main(void) {", "  highp float y = texture2D(ySampler,  textureCoord).r;", "  highp float u = texture2D(uSampler,  uTextureCoord).r;", "  highp float v = texture2D(vSampler,  vTextureCoord).r;", "  gl_FragColor = vec4(y, u, v, 1) * YUV2RGB;", "}"].join("\n")
        } else if (this.type === "yuv422") {
            vertexShaderScript = ["attribute vec4 vertexPos;", "attribute vec4 texturePos;", "varying vec2 textureCoord;", "void main()", "{", "  gl_Position = vertexPos;", "  textureCoord = texturePos.xy;", "}"].join("\n");
            fragmentShaderScript = ["precision highp float;", "varying highp vec2 textureCoord;", "uniform sampler2D sampler;", "uniform highp vec2 resolution;", "uniform mat4 YUV2RGB;", "void main(void) {", "  highp float texPixX = 1.0 / resolution.x;", "  highp float logPixX = 2.0 / resolution.x;", "  highp float logHalfPixX = 4.0 / resolution.x;", "  highp float steps = floor(textureCoord.x / logPixX);", "  highp float uvSteps = floor(textureCoord.x / logHalfPixX);", "  highp float y = texture2D(sampler, vec2((logPixX * steps) + texPixX, textureCoord.y)).r;", "  highp float u = texture2D(sampler, vec2((logHalfPixX * uvSteps), textureCoord.y)).r;", "  highp float v = texture2D(sampler, vec2((logHalfPixX * uvSteps) + texPixX + texPixX, textureCoord.y)).r;", "  gl_FragColor = vec4(y, u, v, 1.0) * YUV2RGB;", "}"].join("\n")
        }
        var YUV2RGB = [];
        if (this.conversionType == "rec709") {
            YUV2RGB = [1.16438, 0, 1.79274, -.97295, 1.16438, -.21325, -.53291, .30148, 1.16438, 2.1124, 0, -1.1334, 0, 0, 0, 1]
        } else {
            YUV2RGB = [1.16438, 0, 1.59603, -.87079, 1.16438, -.39176, -.81297, .52959, 1.16438, 2.01723, 0, -1.08139, 0, 0, 0, 1]
        }
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderScript);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.log("Vertex shader failed to compile: " + gl.getShaderInfoLog(vertexShader))
        }
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderScript);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.log("Fragment shader failed to compile: " + gl.getShaderInfoLog(fragmentShader))
        }
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log("Program failed to compile: " + gl.getProgramInfoLog(program))
        }
        gl.useProgram(program);
        var YUV2RGBRef = gl.getUniformLocation(program, "YUV2RGB");
        gl.uniformMatrix4fv(YUV2RGBRef, false, YUV2RGB);
        this.shaderProgram = program
    };
    YUVCanvas.prototype.initBuffers = function() {
        var gl = this.contextGL;
        var program = this.shaderProgram;
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);
        var vertexPosRef = gl.getAttribLocation(program, "vertexPos");
        gl.enableVertexAttribArray(vertexPosRef);
        gl.vertexAttribPointer(vertexPosRef, 2, gl.FLOAT, false, 0, 0);
        if (this.animationTime) {
            var animationTime = this.animationTime;
            var timePassed = 0;
            var stepTime = 15;
            var aniFun = function() {
                timePassed += stepTime;
                var mul = 1 * timePassed / animationTime;
                if (timePassed >= animationTime) {
                    mul = 1
                } else {
                    setTimeout(aniFun, stepTime)
                }
                var neg = -1 * mul;
                var pos = 1 * mul;
                var vertexPosBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([pos, pos, neg, pos, pos, neg, neg, neg]), gl.STATIC_DRAW);
                var vertexPosRef = gl.getAttribLocation(program, "vertexPos");
                gl.enableVertexAttribArray(vertexPosRef);
                gl.vertexAttribPointer(vertexPosRef, 2, gl.FLOAT, false, 0, 0);
                try {
                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
                } catch (e) {}
            };
            aniFun()
        }
        var texturePosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
        var texturePosRef = gl.getAttribLocation(program, "texturePos");
        gl.enableVertexAttribArray(texturePosRef);
        gl.vertexAttribPointer(texturePosRef, 2, gl.FLOAT, false, 0, 0);
        this.texturePosBuffer = texturePosBuffer;
        if (this.type === "yuv420") {
            var uTexturePosBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uTexturePosBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
            var uTexturePosRef = gl.getAttribLocation(program, "uTexturePos");
            gl.enableVertexAttribArray(uTexturePosRef);
            gl.vertexAttribPointer(uTexturePosRef, 2, gl.FLOAT, false, 0, 0);
            this.uTexturePosBuffer = uTexturePosBuffer;
            var vTexturePosBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vTexturePosBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
            var vTexturePosRef = gl.getAttribLocation(program, "vTexturePos");
            gl.enableVertexAttribArray(vTexturePosRef);
            gl.vertexAttribPointer(vTexturePosRef, 2, gl.FLOAT, false, 0, 0);
            this.vTexturePosBuffer = vTexturePosBuffer
        }
    };
    YUVCanvas.prototype.initTextures = function() {
        var gl = this.contextGL;
        var program = this.shaderProgram;
        if (this.type === "yuv420") {
            var yTextureRef = this.initTexture();
            var ySamplerRef = gl.getUniformLocation(program, "ySampler");
            gl.uniform1i(ySamplerRef, 0);
            this.yTextureRef = yTextureRef;
            var uTextureRef = this.initTexture();
            var uSamplerRef = gl.getUniformLocation(program, "uSampler");
            gl.uniform1i(uSamplerRef, 1);
            this.uTextureRef = uTextureRef;
            var vTextureRef = this.initTexture();
            var vSamplerRef = gl.getUniformLocation(program, "vSampler");
            gl.uniform1i(vSamplerRef, 2);
            this.vTextureRef = vTextureRef
        } else if (this.type === "yuv422") {
            var textureRef = this.initTexture();
            var samplerRef = gl.getUniformLocation(program, "sampler");
            gl.uniform1i(samplerRef, 0);
            this.textureRef = textureRef
        }
    };
    YUVCanvas.prototype.initTexture = function() {
        var gl = this.contextGL;
        var textureRef = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textureRef);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return textureRef
    };
    YUVCanvas.prototype.drawNextOutputPicture = function(width, height, croppingParams, data) {
        var gl = this.contextGL;
        if (gl) {
            this.drawNextOuptutPictureGL(width, height, croppingParams, data)
        } else {
            this.drawNextOuptutPictureRGBA(width, height, croppingParams, data)
        }
    };
    YUVCanvas.prototype.drawNextOuptutPictureRGBA = function(width, height, croppingParams, data) {
        var canvas = this.canvasElement;
        var croppingParams = null;
        var argbData = data;
        var ctx = canvas.getContext("2d");
        var imageData = ctx.getImageData(0, 0, width, height);
        imageData.data.set(argbData);
        if (croppingParams === null) {
            ctx.putImageData(imageData, 0, 0)
        } else {
            ctx.putImageData(imageData, -croppingParams.left, -croppingParams.top, 0, 0, croppingParams.width, croppingParams.height)
        }
    };
    return YUVCanvas
});
(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["./Decoder", "./YUVCanvas"], factory)
    } else if (typeof exports === "object") {
        module.exports = factory(require("./Decoder"), require("./YUVCanvas"))
    } else {
        root.Player = factory(root.Decoder, root.YUVCanvas)
    }
})(this, function(Decoder, WebGLCanvas) {
    "use strict";
    var nowValue = Decoder.nowValue;
    var QualityReporter = function(callback) {
        this.firstPacketTs = 0;
        this.callback = callback;
        this.discard_decrease_to = 0;
        this.nowFrameDelay = 0;
        this.reset()
    };
    QualityReporter.prototype.reset = function() {
        this.startTime = (new Date).getTime();
        this.sumDelay = 0;
        this.frameCount = 0;
        this.slowFrameCount = 0;
        this.dropFrameCount = 0
    };
    QualityReporter.prototype.addDrop = function() {
        this.drop_frame_count++;
        if (this.drop_frame_count > 2) {
            this.callback("increase", "drop");
            this.reset();
            return
        }
    };
    QualityReporter.prototype.addPackage = function(delay, timestamp) {
        var now_time = (new Date).getTime();
        var delta = Math.abs(now_time - delay - timestamp);
        this.nowFrameDelay = Math.abs(now_time - timestamp);
        if (delta > 20) {
            this.slowFrameCount++
        }
        this.sumDelay += delta;
        this.frameCount++;
        if (this.slowFrameCount > 5) {
            this.callback("increase", "slow " + delta);
            this.discard_decrease_to = timestamp + 5e3;
            this.reset();
            return
        }
        if (now_time - this.start_time > 3e3) {
            if (this.discard_decrease_to > timestamp) {
                this.reset();
                return
            }
            console.log("Stats:", this.slow_frame_count, this.drop_frame_count, this.sum_delay / this.frame_count);
            if (this.sum_delay / this.frame_count < 10 && this.slow_frame_count < 2 && this.drop_frame_count == 0) {
                this.callback("decrease", "fast");
                this.discard_decrease_to = timestamp + 5e3;
                this.reset();
                return
            }
            this.reset()
        }
    };
    QualityReporter.prototype.getDelay = function() {
        return {
            nowDelay: this.nowFrameDelay
        }
    };
    var Player = function(parOptions, callback) {
        var self = this;
        this._config = parOptions || {};
        this._callback = callback;
        this.trackerInterval = null;
        this.render = true;
        if (this._config.render === false) {
            this.render = false
        }
        this.nowValue = nowValue;
        this._config.workerFile = this._config.workerFile || window.decodeFile;
		console.log('this._config.workerFile = ', this._config.workerFile);
		console.log('window.decodeFile = ', window.decodeFile);
        if (this._config.preserveDrawingBuffer) {
            this._config.contextOptions = this._config.contextOptions || {};
            this._config.contextOptions.preserveDrawingBuffer = true
        }
        var webgl = "auto";
        if (this._config.webgl === true) {
            webgl = true
        } else if (this._config.webgl === false) {
            webgl = false
        }
        if (webgl == "auto") {
            webgl = true;
            try {
                if (!window.WebGLRenderingContext) {
                    webgl = false
                } else {
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("webgl");
                    if (!ctx) {
                        webgl = false
                    }
                }
            } catch (e) {
                webgl = false
            }
        }
        this.webgl = webgl;
        if (this.webgl) {
            this.createCanvasObj = this.createCanvasWebGL;
            this.renderFrame = this.renderFrameWebGL
        } else {
            this.createCanvasObj = this.createCanvasRGB;
            this.renderFrame = this.renderFrameRGB
        }
        var lastWidth;
        var lastHeight;
        this.onPictureDecoded2 = function(buffer, width, height, infos) {
            self.onPictureDecoded(buffer, width, height, infos);
            var startTime = nowValue();
            if (!buffer || !self.render) {
                return
            }
            self.frameQueue.push({
                buffer: buffer,
                width: width,
                height: height,
                infos: infos
            })
        };
        if (!this._config.size) {
            this._config.size = {}
        }
        this._config.size.width = this._config.size.width || 200;
        this._config.size.height = this._config.size.height || 200;
        this.initDecoder();
        if (this.render) {
            this.canvasObj = this.createCanvasObj({
                contextOptions: this._config.contextOptions
            });
            this.canvas = this.canvasObj.canvas
        }
        this.domNode = this.canvas;
        lastWidth = this._config.size.width;
        lastHeight = this._config.size.height;
        this.frameQueue = [];
        this.renderQueueBind = this.renderQueue.bind(this);
        this.renderQueueBind();
        this.delay = 300;
        this.quality_reporter = new QualityReporter(this.onQualityControl.bind(this))
    };
    Player.prototype = {
        onPictureDecoded: function(buffer, width, height, infos) {},
        recycleMemory: function(buf) {},
        createCanvasWebGL: function(options) {
            var canvasObj = this._createBasicCanvasObj(options);
            canvasObj.contextOptions = options.contextOptions;
            return canvasObj
        },
        createCanvasRGB: function(options) {
            var canvasObj = this._createBasicCanvasObj(options);
            return canvasObj
        },
        _createBasicCanvasObj: function(options) {
            options = options || {};
            var obj = {};
            var width = options.width;
            if (!width) {
                width = this._config.size.width
            }
            var height = options.height;
            if (!height) {
                height = this._config.size.height
            }
            obj.canvas = document.createElement("canvas");
            obj.canvas.width = width;
            obj.canvas.height = height;
            obj.canvas.style.backgroundColor = "#0D0E1B";
            return obj
        },
        increaseDelay: function(reason) {
            if (this.delay < 1e3) {
                this.delay += 50
            } else {
                this._callback("DELAY_LIMITED")
            }
        },
        decreaseDelay: function(reason) {
            if (this.delay > 300) {
                this.delay -= 50
            } else {}
        },
        onQualityControl: function(action, reason) {
            if (action == "increase") {
                this.increaseDelay(reason)
            } else if (action == "decrease") {
                this.decreaseDelay(reason)
            }
        },
        renderQueue: function() {
            if (this.frameQueue.length > 0) {
                var frame = null;
                var currentTime = (new Date).getTime();
                while (this.frameQueue.length > 0) {
                    var firstFrame = this.frameQueue[0];
                    if (this.firstPacketTs == 0) this.firstPacketTs = firstFrame.infos[0].ts;
                    var delta = currentTime - this.delay - firstFrame.infos[0].ts;
                    if (delta > 0) {
                        if (frame != null) {
                            this.quality_reporter.addDrop()
                        }
                        this.quality_reporter.addPackage(this.delay, firstFrame.infos[0].ts);
                        frame = firstFrame;
                        this.frameQueue.shift()
                    } else {
                        break
                    }
                }
                if (frame != null) {
                    var delayTime = window.DELAY_TIME ? window.DELAY_TIME : 3e3;
                    if ((new Date).getTime() - frame.infos[0].ts > delayTime) {
                        console.log("delay more than 3s");
                        this._callback("DELAYED")
                    } else {
                        this._callback("LIVED")
                    }
                    this.lastTime = currentTime;
                    this.doRender(frame)
                }
            }
            requestAnimationFrame(this.renderQueueBind)
        },
        doRender: function(frame) {
            this.renderFrame({
                canvasObj: this.canvasObj,
                data: frame.buffer,
                width: frame.width,
                height: frame.height
            });
            if (this.onRenderFrameComplete) {
                this.onRenderFrameComplete({
                    data: frame.buffer,
                    width: frame.width,
                    height: frame.height,
                    infos: frame.infos,
                    canvasObj: this.canvasObj
                })
            }
        },
        renderFrameWebGL: function(options) {
            var canvasObj = options.canvasObj;
            var width = options.width || canvasObj.canvas.width;
            var height = options.height || canvasObj.canvas.height;
            if (canvasObj.canvas.width !== width || canvasObj.canvas.height !== height || !canvasObj.webGLCanvas) {
                canvasObj.canvas.width = width;
                canvasObj.canvas.height = height;
                canvasObj.webGLCanvas = new WebGLCanvas({
                    canvas: canvasObj.canvas,
                    contextOptions: canvasObj.contextOptions,
                    width: width,
                    height: height
                })
            }
            var ylen = width * height;
            var uvlen = width / 2 * (height / 2);
            canvasObj.webGLCanvas.drawNextOutputPicture({
                yData: options.data.subarray(0, ylen),
                uData: options.data.subarray(ylen, ylen + uvlen),
                vData: options.data.subarray(ylen + uvlen, ylen + uvlen + uvlen)
            });
            var self = this;
            self.recycleMemory(options.data)
        },
        renderFrameRGB: function(options) {
            var canvasObj = options.canvasObj;
            var width = options.width || canvasObj.canvas.width;
            var height = options.height || canvasObj.canvas.height;
            if (canvasObj.canvas.width !== width || canvasObj.canvas.height !== height) {
                canvasObj.canvas.width = width;
                canvasObj.canvas.height = height
            }
            var ctx = canvasObj.ctx;
            var imgData = canvasObj.imgData;
            if (!ctx) {
                canvasObj.ctx = canvasObj.canvas.getContext("2d");
                ctx = canvasObj.ctx;
                canvasObj.imgData = ctx.createImageData(width, height);
                imgData = canvasObj.imgData
            }
            imgData.data.set(options.data);
            ctx.putImageData(imgData, 0, 0);
            var self = this;
            self.recycleMemory(options.data)
        },
        initDecoder: function() {
            var onPictureDecoded = this.onPictureDecoded2;
            this.trackerInterval = setInterval(function() {
                var delay = this.quality_reporter.getDelay();
                this._callback("DELAY", delay)
            }.bind(this), 500);
            if (this._config.useWorker) {
                var worker = new Worker(this._config.workerFile);
                this.worker = worker;
                worker.addEventListener("message", function(e) {
                    var data = e.data;
                    if (data.consoleLog) {
                        return
                    }
                    onPictureDecoded.call(self, new Uint8Array(data.buf, 0, data.length), data.width, data.height, data.infos)
                }, false);
                worker.postMessage({
                    type: "Broadway.js - Worker init",
                    options: {
                        rgb: !this.webgl,
                        memsize: this.memsize,
                        reuseMemory: this._config.reuseMemory ? true : false
                    }
                });
                if (this._config.transferMemory) {
                    this.decode = function(parData, parInfo) {
                        worker.postMessage({
                            buf: parData.buffer,
                            offset: parData.byteOffset,
                            length: parData.length,
                            info: parInfo
                        }, [parData.buffer])
                    }
                } else {
                    this.decode = function(parData, parInfo) {
                        var copyU8 = new Uint8Array(parData.length);
                        copyU8.set(parData, 0, parData.length);
                        worker.postMessage({
                            buf: copyU8.buffer,
                            offset: 0,
                            length: parData.length,
                            info: parInfo
                        }, [copyU8.buffer])
                    }
                }
                if (this._config.reuseMemory) {
                    this.recycleMemory = function(parArray) {
                        worker.postMessage({
                            reuse: parArray.buffer
                        }, [parArray.buffer])
                    }
                }
            } else {
                this.decoder = new Decoder({
                    rgb: !this.webgl
                });
                this.decoder.onPictureDecoded = onPictureDecoded;
                this.decode = function(parData, parInfo) {
                    self.decoder.decode(parData, parInfo)
                }
            }
        },
        close: function() {
            clearInterval(this.trackerInterval);
            this.frameQueue = [];
            if (this.worker) {
                this.worker.terminate();
                this.worker = null
            } else if (this.decoder) {
                delete this.decoder;
                delete this.decode
            }
        },
        reinitDecoder: function() {
            console.log("Will reinit decoder");
            this.close();
            this.initDecoder()
        }
    };
    return Player
});