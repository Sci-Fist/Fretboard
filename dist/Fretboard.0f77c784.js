// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"7wZbQ":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "9440bf780f77c784";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"2R06K":[function(require,module,exports,__globalThis) {
// src/app.js
// Main app logic - setting things up and making it go!
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _renderingJs = require("./rendering.js");
var _tabDataJs = require("./tab-data.js");
var _uiElementsJs = require("./ui-elements.js");
var _audioJs = require("./audio.js");
var _configJs = require("../config.js");
var _configJsDefault = parcelHelpers.interopDefault(_configJs);
console.log("app.js: Starting Fretboard app.js");
// Application State
let isMeasureRotated = false;
let isPlaying = false;
let currentMeasureIndex = -1;
let playbackIntervalId = null;
// --- Helper Functions ---
function exportTab() {
    console.log("app.js: exportTab called (placeholder)");
    const tabData = (0, _tabDataJs.getTabData)();
    const tabText = generateTablature(tabData);
    const blob = new Blob([
        tabText
    ], {
        type: "text/plain"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guitar_tab.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Tab exported as text!");
}
function saveTab() {
    console.log("app.js: saveTab called");
    try {
        const tabData = (0, _tabDataJs.getTabData)();
        localStorage.setItem('guitarTab', JSON.stringify(tabData));
        alert('Tab saved to local storage!');
    } catch (error) {
        console.error('Error saving tab to local storage:', error);
        alert('Error saving tab. Check the console for more details.');
    }
}
function loadTab() {
    console.log("app.js: loadTab called");
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json'; // Accept only JSON files
    fileInput.addEventListener('change', (event)=>{
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e)=>{
                try {
                    const tabData = JSON.parse(e.target.result);
                    (0, _tabDataJs.setTabData)(tabData);
                    _renderingJs.renderTab((0, _tabDataJs.getTabData)());
                    alert('Tab loaded from file!');
                } catch (error) {
                    console.error('Error loading tab from file:', error);
                    alert('Error loading tab from file. Check the console for more details.');
                }
            };
            reader.readAsText(file);
        }
    });
    fileInput.click(); // Trigger the file selection dialog
}
function generateTablature(tabData) {
    if (!tabData || !tabData.measures || tabData.measures.length === 0) return "No tab data.";
    let tabString = "";
    const tuning = tabData.tuning || [
        'E',
        'A',
        'D',
        'G',
        'B',
        'E'
    ];
    const stringLabels = [
        "E",
        "A",
        "D",
        "G",
        "B",
        "e"
    ];
    tabData.measures.forEach((measure, measureIndex)=>{
        tabString += `Measure ${measureIndex + 1}:\n`;
        const strings = measure.strings && measure.strings.length === 6 ? measure.strings : Array(6).fill([
            '-',
            '-',
            '-',
            '-'
        ]);
        for(let stringIndex = 0; stringIndex < 6; stringIndex++){
            tabString += `${stringLabels[stringIndex]}|`;
            const frets = strings[stringIndex] && strings[stringIndex].length === 4 ? strings[stringIndex] : [
                '-',
                '-',
                '-',
                '-'
            ];
            for(let fretIndex = 0; fretIndex < 4; fretIndex++){
                const fretValue = frets[fretIndex] !== undefined && frets[fretIndex] !== '' ? String(frets[fretIndex]) : "-";
                tabString += fretValue.padEnd(2, ' ');
                tabString += "|";
            }
            tabString += "\n";
        }
        tabString += "\n";
    });
    tabString += `BPM: ${tabData.bpm || 120}\n`;
    tabString += `Time Signature: ${tabData.timeSignature || '4/4'}\n`;
    return tabString;
}
function toggleMeasureRotation() {
    console.log("app.js: toggleMeasureRotation - before toggle:", isMeasureRotated);
    isMeasureRotated = !isMeasureRotated;
    const tabData = (0, _tabDataJs.getTabData)();
    tabData.isMeasureRotated = isMeasureRotated;
    (0, _tabDataJs.setTabData)(tabData);
    console.log("toggleMeasureRotation - after toggle:", isMeasureRotated);
    console.log("toggleMeasureRotation - tabData.isMeasureRotated:", tabData.isMeasureRotated);
    console.log(`app.js: Measure rotation toggled to: ${isMeasureRotated}`);
    _renderingJs.renderTab((0, _tabDataJs.getTabData)()); // Re-render the tab to apply the rotation
}
// --- Playback Controls ---
function handlePlay() {
    if (!isPlaying) {
        console.log("app.js: Playback started");
        (0, _audioJs.playTab)();
        isPlaying = true;
        const playButton = document.getElementById('playTabBtn');
        const pauseButton = document.getElementById('pauseTabBtn');
        const stopButton = document.getElementById('stopTabBtn');
        if (playButton && pauseButton && stopButton) {
            playButton.style.display = 'none';
            pauseButton.style.display = 'inline-block';
            stopButton.style.display = 'inline-block';
            playButton.textContent = 'Resume';
        }
        startPlaybackHighlight();
    } else handlePause();
}
function handlePause() {
    if (isPlaying) {
        console.log("app.js: Playback paused");
        (0, _audioJs.stopPlayback)();
        isPlaying = false;
        const playButton = document.getElementById('playTabBtn');
        const pauseButton = document.getElementById('pauseTabBtn');
        const stopButton = document.getElementById('stopTabBtn');
        if (playButton && pauseButton && stopButton) {
            playButton.style.display = 'inline-block';
            pauseButton.style.display = 'none';
            stopButton.style.display = 'inline-block';
            playButton.textContent = 'Resume';
        }
        stopPlaybackHighlight();
    }
}
function handleStop() {
    if (isPlaying) {
        console.log("app.js: Playback stopped");
        (0, _audioJs.stopPlayback)();
        isPlaying = false;
        currentMeasureIndex = -1;
        const playButton = document.getElementById('playTabBtn');
        const pauseButton = document.getElementById('pauseTabBtn');
        const stopButton = document.getElementById('stopTabBtn');
        if (playButton && pauseButton && stopButton) {
            playButton.style.display = 'inline-block';
            pauseButton.style.display = 'none';
            stopButton.style.display = 'none';
            playButton.textContent = 'Play';
        }
        stopPlaybackHighlight();
        resetMeasureHighlight();
    }
}
function handleTimeSignatureChange(event) {
    const newTimeSignature = event.target.value;
    console.log(`app.js: Time signature changed to: ${newTimeSignature}`);
    const tabData = (0, _tabDataJs.getTabData)();
    tabData.timeSignature = newTimeSignature;
    // Update the number of frets in each measure
    tabData.measures.forEach((measure)=>{
        const [beats] = newTimeSignature.split('/').map(Number);
        for(let stringIndex = 0; stringIndex < measure.strings.length; stringIndex++)measure.strings[stringIndex] = Array(beats).fill('-');
    });
    (0, _tabDataJs.setTabData)(tabData);
    _renderingJs.renderTab((0, _tabDataJs.getTabData)());
// TODO: Implement logic to change playback behavior based on time signature
}
// --- Playback Highlighting ---
function startPlaybackHighlight() {
    if (!isPlaying) {
        isPlaying = true;
        currentMeasureIndex = 0;
        const tabData = (0, _tabDataJs.getTabData)();
        const bpm = tabData.bpm || 120;
        const measures = tabData.measures;
        if (!measures || measures.length === 0) {
            console.warn("No measures to play.");
            isPlaying = false;
            return;
        }
        const millisecondsPerBeat = 60000 / bpm;
        const millisecondsPerMeasure = millisecondsPerBeat * 4; // Default to 4 beats/measure
        playbackIntervalId = setInterval(()=>{
            if (currentMeasureIndex < measures.length) {
                highlightMeasure(currentMeasureIndex);
                currentMeasureIndex++;
            } else {
                stopPlaybackHighlight();
                handleStop();
            }
        }, millisecondsPerMeasure);
    }
}
function stopPlaybackHighlight() {
    isPlaying = false;
    if (playbackIntervalId) {
        clearInterval(playbackIntervalId);
        playbackIntervalId = null;
    }
    resetMeasureHighlight();
}
function highlightMeasure(measureIndex) {
    resetMeasureHighlight();
    const measureDiv = document.querySelector(`.measure:nth-child(${measureIndex + 1})`);
    if (measureDiv) measureDiv.classList.add('playing-measure');
}
function resetMeasureHighlight() {
    document.querySelectorAll('.measure.playing-measure').forEach((measure)=>{
        measure.classList.remove('playing-measure');
    });
}
// --- UI Setup ---
/**
 * Sets up UI elements and event listeners.
 */ function setupUI() {
    console.log("app.js: setupUI called"); // DEBUG LOG
    // Apply config (example - could be more extensive)
    document.body.style.fontSize = (0, _configJsDefault.default).bodyFontSize;
    // Get time signature select element
    const timeSignatureSelect = document.getElementById('timeSignatureSelect');
    if (timeSignatureSelect) timeSignatureSelect.addEventListener('change', handleTimeSignatureChange);
    else console.error("app.js: timeSignatureSelect element not found.");
    // Get BPM input element
    const bpmInputElement = document.getElementById('bpmInput');
    if (bpmInputElement) bpmInputElement.addEventListener('change', (event)=>{
        const newBPM = parseInt(event.target.value, 10);
        if (!isNaN(newBPM) && newBPM > 0) {
            const tabData = (0, _tabDataJs.getTabData)();
            tabData.bpm = newBPM;
            (0, _tabDataJs.setTabData)(tabData);
            console.log(`BPM set to ${tabData.bpm}`);
        } else {
            alert("Invalid BPM value. Please enter a number greater than 0.");
            bpmInputElement.value = (0, _tabDataJs.getTabData)().bpm || 120; // Revert to previous value
        }
    });
    else console.error("app.js: bpmInput element not found.");
    // --- Add Measure Modal Setup ---
    const addMeasureModal = document.createElement('div');
    addMeasureModal.id = 'addMeasureModal';
    addMeasureModal.style.display = 'none'; // Initially hidden
    addMeasureModal.style.position = 'fixed';
    addMeasureModal.style.zIndex = '1000'; // Ensure it's on top
    addMeasureModal.style.left = '50%';
    addMeasureModal.style.top = '50%';
    addMeasureModal.style.transform = 'translate(-50%, -50%)';
    addMeasureModal.style.backgroundColor = '#fff';
    addMeasureModal.style.padding = '20px';
    addMeasureModal.style.border = '1px solid #ccc';
    addMeasureModal.style.borderRadius = '5px';
    addMeasureModal.innerHTML = `
        <h2>Add Measure</h2>
        <label for="timeSignature">Time Signature:</label>
        <select id="timeSignature">
            <option value="4/4">4/4</option>
            <option value="3/4">3/4</option>
            <option value="6/8">6/8</option>
            <option value="2/4">2/4</option>
        </select>
        <br><br>
        <button id="addMeasureModalSubmit">Add Measure</button>
        <button id="addMeasureModalCancel">Cancel</button>
    `;
    document.body.appendChild(addMeasureModal);
    // Modal event listeners
    const addMeasureModalSubmit = document.getElementById('addMeasureModalSubmit');
    const addMeasureModalCancel = document.getElementById('addMeasureModalCancel');
    const timeSignatureSelectModal = document.getElementById('timeSignature');
    if (addMeasureModalSubmit) addMeasureModalSubmit.addEventListener('click', ()=>{
        const selectedTimeSignature = timeSignatureSelectModal.value;
        handleAddMeasureWithInput(selectedTimeSignature);
        closeAddMeasureModal();
    });
    else console.error("app.js: addMeasureModalSubmit element not found.");
    if (addMeasureModalCancel) addMeasureModalCancel.addEventListener('click', closeAddMeasureModal);
    else console.error("app.js: addMeasureModalCancel element not found.");
    function openAddMeasureModal() {
        addMeasureModal.style.display = 'block';
    }
    function closeAddMeasureModal() {
        addMeasureModal.style.display = 'none';
    }
    // --- End Add
    // --- Context Menu Setup ---
    const tabDisplay = document.getElementById("tab-display");
    if (tabDisplay) tabDisplay.addEventListener('contextmenu', (e)=>{
        e.preventDefault(); // Prevent the default context menu
        if (e.target.classList.contains('fret')) showFretContextMenu(e);
    });
    // --- End Context Menu Setup ---
    console.log("app.js: UI setup complete.");
    // Call setupToolBar *after* the tab display is rendered and the buttons are in the DOM
    (0, _uiElementsJs.setupToolBar)({
        addMeasure: handleAddMeasureWithInput,
        clearTab: (0, _tabDataJs.clearTab),
        exportTab: exportTab,
        playTab: handlePlay,
        pauseTab: handlePause,
        stopPlayback: (0, _audioJs.stopPlayback),
        saveTab: saveTab,
        loadTab: loadTab,
        renderTab: _renderingJs.renderTab,
        getTabData: (0, _tabDataJs.getTabData),
        setTabData: (0, _tabDataJs.setTabData),
        toggleMeasureRotation: toggleMeasureRotation
    });
}
/**
 * Shows the context menu for a fret element.
 * @param {Event} e - The contextmenu event.
 */ function showFretContextMenu(e) {
    console.log("app.js: showFretContextMenu called");
    // Create the context menu
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.position = 'absolute';
    contextMenu.style.backgroundColor = '#333';
    contextMenu.style.color = '#fff';
    contextMenu.style.padding = '5px';
    contextMenu.style.borderRadius = '5px';
    contextMenu.style.zIndex = '1000'; // Ensure it's on top
    // Get the fret element
    const fretElement = e.target;
    // Add menu items
    const menuItems = [
        {
            text: 'Clear Fret',
            action: ()=>{
                fretElement.textContent = '';
                (0, _uiElementsJs.handleFretInput)({
                    target: fretElement
                }, (0, _tabDataJs.getTabData), (0, _tabDataJs.setTabData), _renderingJs.renderTab);
            }
        },
        {
            text: 'Set to 0',
            action: ()=>{
                fretElement.textContent = '0';
                (0, _uiElementsJs.handleFretInput)({
                    target: fretElement
                }, (0, _tabDataJs.getTabData), (0, _tabDataJs.setTabData), _renderingJs.renderTab);
            }
        },
        {
            text: 'Set to 1',
            action: ()=>{
                fretElement.textContent = '1';
                (0, _uiElementsJs.handleFretInput)({
                    target: fretElement
                }, (0, _tabDataJs.getTabData), (0, _tabDataJs.setTabData), _renderingJs.renderTab);
            }
        }
    ];
    menuItems.forEach((item)=>{
        const menuItem = document.createElement('div');
        menuItem.textContent = item.text;
        menuItem.style.padding = '5px';
        menuItem.style.cursor = 'pointer';
        menuItem.addEventListener('mouseover', ()=>{
            menuItem.style.backgroundColor = '#555';
        });
        menuItem.addEventListener('mouseout', ()=>{
            menuItem.style.backgroundColor = '#333';
        });
        menuItem.addEventListener('click', item.action);
        contextMenu.appendChild(menuItem);
    });
    // Position the context menu
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
    // Append the context menu to the body
    document.body.appendChild(contextMenu);
    // Remove the context menu when clicking outside, *except* when clicking on a fret
    document.addEventListener('click', function removeContextMenu(event) {
        if (!contextMenu.contains(event.target) && !event.target.classList.contains('fret')) {
            contextMenu.remove();
            document.removeEventListener('click', removeContextMenu); // Remove the listener after use
        }
    });
}
/**
 * Handles arrow key navigation between frets.
 * @param {string} key - The arrow key pressed.
 * @param {HTMLElement} currentFret - The currently focused fret element.
 */ function handleArrowKeyNavigation(key, currentFret) {
    const measureIndex = parseInt(currentFret.dataset.measure);
    const stringIndex = parseInt(currentFret.dataset.string);
    const fretIndex = parseInt(currentFret.dataset.fret);
    let nextFret;
    switch(key){
        case 'ArrowLeft':
            if (fretIndex > 0) nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex}-${fretIndex - 1}`);
            else if (measureIndex > 0) nextFret = document.getElementById(`fret-${measureIndex - 1}-${stringIndex}-3`);
            break;
        case 'ArrowRight':
            if (fretIndex < 3) nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex}-${fretIndex + 1}`);
            else {
                const nextMeasureIndex = measureIndex + 1;
                if (document.querySelector(`.fret[data-measure='${nextMeasureIndex}'][data-string='${stringIndex}'][data-fret='0']`)) nextFret = document.getElementById(`fret-${nextMeasureIndex}-${stringIndex}-0`);
            }
            break;
        case 'ArrowUp':
            if (stringIndex > 0) nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex - 1}-${fretIndex}`);
            break;
        case 'ArrowDown':
            if (stringIndex < 5) nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex + 1}-${fretIndex}`);
            break;
    }
    if (nextFret) {
        currentFret.classList.remove('active-fret');
        nextFret.classList.add('active-fret');
        nextFret.focus();
        localStorage.setItem('activeFretId', nextFret.id);
    }
}
function handleAddMeasureWithInput(timeSignature) {
    console.log("app.js: handleAddMeasureWithInput called");
    const tabData = (0, _tabDataJs.getTabData)();
    // Validate time signature format
    const timeSignatureRegex = /^\d+\/\d+$/;
    if (!timeSignatureRegex.test(timeSignature)) {
        alert("Invalid time signature format. Please use the format 'X/Y'.");
        return;
    }
    const [beats, noteValue] = timeSignature.split('/').map(Number);
    if (isNaN(beats) || isNaN(noteValue) || beats <= 0 || noteValue <= 0) {
        alert("Invalid time signature. Please enter positive numbers for beats and note value.");
        return;
    }
    // Create a new measure with the specified time signature
    const newMeasure = {
        strings: Array(6).fill(Array(beats).fill('-')) // Initialize with '-' for each fret based on beats
    };
    tabData.measures.push(newMeasure);
    tabData.timeSignature = timeSignature; // Set the time signature for the new measure
    (0, _tabDataJs.setTabData)(tabData);
    _renderingJs.renderTab((0, _tabDataJs.getTabData)());
}
/**
 * Sets up the entire application.
 */ async function setupApp() {
    console.log("app.js: setupApp called");
    try {
        console.log("app.js: Calling initializeTabData...");
        (0, _tabDataJs.initializeTabData)();
        console.log("app.js: initializeTabData finished.");
        const currentTabData = (0, _tabDataJs.getTabData)();
        console.log("app.js: Calling renderTab with data:", JSON.stringify(currentTabData)); // Log the data being passed
        _renderingJs.renderTab(currentTabData);
        console.log("app.js: renderTab finished.");
        setupUI();
        console.log("app.js: setupUI finished.");
        // Initialize Audio after UI setup (or ensure context is resumed on interaction)
        await (0, _audioJs.initializeAudio)();
        console.log("app.js: initializeAudio finished.");
    // Config variables and log are now inside setupUI.
    } catch (error) {
        // This catch block now handles errors from initializeTabData, renderTab, setupUI, AND initializeAudio
        console.error("app.js: Error during app setup:", error);
        console.trace(); // Add stack trace
        alert("Failed to initialize the application. Please check the console for details.");
    }
    console.log("app.js: Finished setupApp");
}
// --- Start the App ---
setupApp();

},{"./rendering.js":"4eVfQ","./tab-data.js":"1uM0m","./ui-elements.js":"fUhVs","./audio.js":"bTyvi","../config.js":"kjaMg","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"4eVfQ":[function(require,module,exports,__globalThis) {
// src/rendering.js
// Functions for rendering the tab to the DOM
/**
 * Renders the tab data to the tab display.
 * @param {object} tabData - The tab data object.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "renderTab", ()=>renderTab);
function renderTab(tabData) {
    console.log("rendering.js: renderTab called with data:", JSON.stringify(tabData)); // Log entry and data
    console.log("rendering.js: tabData.isMeasureRotated:", tabData.isMeasureRotated); // ADDED LOG
    const tabDisplay = document.getElementById("tab-display");
    if (!tabDisplay) {
        console.error("rendering.js: tabDisplay element not found!");
        return;
    }
    tabDisplay.innerHTML = ""; // Clear the tab display
    if (!tabData.measures || tabData.measures.length === 0) return; // Exit if there are no measures
    const isRotated = tabData.isMeasureRotated || false; // Get rotation state from tabData
    const timeSignature = tabData.timeSignature || '4/4'; // Default to 4/4 if not set
    const [beats, noteValue] = timeSignature.split('/').map(Number);
    const fretsPerMeasure = beats; // Use beats for the number of frets
    tabData.measures.forEach((measure, measureIndex)=>{
        const measureDiv = document.createElement("div");
        measureDiv.className = "measure";
        if (isRotated) measureDiv.classList.add('rotated-measure'); // Add class for rotation
        for(let stringIndex = 0; stringIndex < 6; stringIndex++){
            const stringDiv = document.createElement("div");
            stringDiv.className = "string";
            if (isRotated) stringDiv.classList.add('rotated-string'); // Add class for rotated string layout
            // Add string label
            const stringLabel = document.createElement("div");
            stringLabel.className = "string-label";
            stringLabel.textContent = [
                "E",
                "A",
                "D",
                "G",
                "B",
                "e"
            ][stringIndex];
            stringDiv.appendChild(stringLabel);
            // Add visual string representation (horizontal line)
            const stringLine = document.createElement("div");
            stringLine.className = "string-line";
            stringDiv.appendChild(stringLine);
            for(let fretIndex = 0; fretIndex < fretsPerMeasure; fretIndex++){
                const fretDiv = document.createElement("div");
                fretDiv.className = "fret";
                if (isRotated) fretDiv.classList.add('rotated-fret'); // Add class for rotated fret layout
                fretDiv.contentEditable = true;
                fretDiv.role = "textbox"; // Accessibility: Identify as text input
                fretDiv.inputMode = "numeric"; // Accessibility: Suggest numeric keyboard on mobile
                // fretDiv.pattern = "[0-9]*"; // Pattern doesn't work directly on contentEditable
                fretDiv.dataset.measure = measureIndex;
                fretDiv.dataset.string = stringIndex;
                fretDiv.dataset.fret = fretIndex;
                fretDiv.id = `fret-${measureIndex}-${stringIndex}-${fretIndex}`;
                fretDiv.name = `fret-${measureIndex}-${stringIndex}-${fretIndex}`;
                fretDiv.textContent = measure.strings[stringIndex][fretIndex] || "-"; // Set the fret text content, default to '-'
                fretDiv.setAttribute('tabindex', '0'); // Make the frets focusable
                fretDiv.setAttribute('aria-label', `Fret ${fretDiv.textContent || 'empty'}`); // Provide accessible label
                // Add click event listener to each fret
                fretDiv.addEventListener('click', (event)=>{
                    console.log("Fret clicked:", fretDiv.id); // DEBUG LOG
                    showNumberCircle(fretDiv);
                });
                stringDiv.appendChild(fretDiv);
            }
            measureDiv.appendChild(stringDiv);
        }
        tabDisplay.appendChild(measureDiv);
    });
    // After rendering, re-apply active-fret class if needed (e.g., after re-render on input)
    const activeFretId = localStorage.getItem('activeFretId');
    if (activeFretId) {
        const activeFret = document.getElementById(activeFretId);
        if (activeFret) activeFret.classList.add('active-fret');
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"1uM0m":[function(require,module,exports,__globalThis) {
// tab-data.js
// This module is responsible for managing the tab data structure.
// It defines the default tab data, provides functions to add, clear, and get tab data,
// and includes a function to calculate the note based on string and fret.
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "addMeasure", ()=>addMeasure);
parcelHelpers.export(exports, "clearTab", ()=>clearTab);
parcelHelpers.export(exports, "getTabData", ()=>getTabData);
parcelHelpers.export(exports, "setTabData", ()=>setTabData);
parcelHelpers.export(exports, "getNote", ()=>getNote);
parcelHelpers.export(exports, "initializeTabData", ()=>initializeTabData);
const defaultTabData = {
    measures: [],
    bpm: 120,
    tuning: [
        'E',
        'A',
        'D',
        'G',
        'B',
        'E'
    ],
    capo: 0,
    timeSignature: '4/4' // Added time signature to default data
};
let tabData = {
    ...defaultTabData
};
/**
 * Initializes the tab data to the default values.
 */ function initializeTabData() {
    // Ensure deep copy for measures array if defaultTabData could be modified elsewhere (though unlikely here)
    tabData = {
        ...defaultTabData,
        measures: [],
        timeSignature: defaultTabData.timeSignature // Initialize time signature
    };
    addMeasure(); // Add the initial measure with default time signature
}
/**
 * Adds a new measure to the tab data with default '-' values.
 */ function addMeasure() {
    console.log('tab-data.js: addMeasure called');
    const timeSignature = tabData.timeSignature;
    const beatsPerMeasure = parseInt(timeSignature.split('/')[0], 10); // Get numerator
    const measure = {
        strings: Array(6).fill(Array(beatsPerMeasure).fill('-')) // Use beatsPerMeasure for fret count, default '-'
    };
    tabData.measures.push(measure);
    console.log('tab-data.js: tabData after addMeasure:', tabData);
}
/**
 * Clears all measures from the tab data.
 */ function clearTab() {
    console.log('tab-data.js: clearTab called');
    tabData.measures = []; // Correctly clears measures
    tabData.timeSignature = defaultTabData.timeSignature; // Reset time signature to default
    addMeasure(); // Add an initial measure with default time signature after clearing
// Optionally reset other properties if needed, e.g., bpm
// tabData.bpm = defaultTabData.bpm;
}
/**
 * Returns the current tab data.
 * @returns {object} The tab data object.
 */ function getTabData() {
    return tabData;
}
/**
 * Sets the tab data.
 * @param {object} data - The new tab data object.
 */ function setTabData(data) {
    tabData = data;
}
/**
 * Gets the note for a given string and fret number, based on the tuning.
 * @param {number} stringIndex - The index of the string (0-5).
 * @param {number} fretNumber - The fret number (0-24).
 * @param {string[]} tuning - The tuning of the guitar (e.g., ['E', 'A', 'D', 'G', 'B', 'E']).
 * @returns {string} The note name (e.g., "E4", "A3").
 */ function getNote(stringIndex, fretNumber, tuning) {
    const notes = [
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
        'C',
        'C#',
        'D',
        'D#'
    ];
    const baseNote = tuning[stringIndex];
    const baseIndex = notes.indexOf(baseNote);
    const noteIndex = (baseIndex + fretNumber) % 12;
    const octave = Math.floor((baseIndex + fretNumber) / 12) + 2; // Determine octave
    return notes[noteIndex] + octave;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"fUhVs":[function(require,module,exports,__globalThis) {
// src/ui-elements.js
// This module handles the user interface elements and their interactions.
// It sets up the toolbar, handles fret input, and displays the number circle for fret selection.
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "setupToolBar", ()=>setupToolBar);
parcelHelpers.export(exports, "handleFretInput", ()=>handleFretInput);
parcelHelpers.export(exports, "showNumberCircle", ()=>showNumberCircle);
parcelHelpers.export(exports, "showSecondNumberCircle", ()=>showSecondNumberCircle);
parcelHelpers.export(exports, "removeOpenNumberCircle", ()=>removeOpenNumberCircle);
parcelHelpers.export(exports, "removeActiveFretClass", ()=>removeActiveFretClass // Export the function
);
var _audioJs = require("./audio.js"); // Moved import to the top
/**
 * Sets up the tool bar by attaching event listeners to the tool bar buttons.
 * @param {object} dependencies - Object containing functions from other modules.
 */ function setupToolBar(dependencies) {
    const { addMeasure, clearTab, exportTab, playTab, pauseTab, stopPlayback, saveTab, loadTab, renderTab, getTabData, setTabData, toggleMeasureRotation } = dependencies;
    // Select buttons by their specific IDs
    const addMeasureButton = document.getElementById("addMeasureBtn");
    const clearTabButton = document.getElementById("clearTabBtn");
    const exportTabButton = document.getElementById("exportTabBtn");
    const playTabButton = document.getElementById("playTabBtn");
    const pauseTabButton = document.getElementById("pauseTabBtn"); // Pause button
    const stopTabButton = document.getElementById("stopTabBtn");
    const saveTabButton = document.getElementById("saveTabBtn");
    const loadTabButton = document.getElementById("loadTabBtn");
    const rotateMeasureButton = document.getElementById("rotateMeasureBtn"); // Rotate measure button
    // Add event listeners only if the button exists
    if (addMeasureButton) {
        addMeasureButton.addEventListener("click", ()=>{
            alert("Add Measure button clicked!"); // DEBUG ALERT
        // addMeasure(); // Original function call - COMMENTED OUT
        });
        addMeasureButton.title = "Add a new measure (Ctrl+M)"; // Tooltip
    }
    // Removed duplicate Load Tab button logic block
    if (clearTabButton) {
        clearTabButton.addEventListener("click", ()=>{
            alert("Clear Tab button clicked!"); // DEBUG ALERT
        // clearTab(); // Original function call - COMMENTED OUT
        // addMeasure(); // Add an initial measure after clearing - COMMENTED OUT
        // renderTab(getTabData()); // - COMMENTED OUT
        });
        clearTabButton.title = "Clear the entire tab (Ctrl+Shift+C)"; // Tooltip
    } else console.error("Button with ID 'clearTabBtn' not found.");
    if (exportTabButton) {
        // Use the passed exportTab function directly
        exportTabButton.addEventListener("click", ()=>{
            alert("Export Tab button clicked!"); // DEBUG ALERT
        // exportTab(); // Original function call - COMMENTED OUT
        });
        exportTabButton.title = "Export tab as text file (Ctrl+E)"; // Tooltip
    } else console.error("Button with ID 'exportTabBtn' not found.");
    if (playTabButton) {
        playTabButton.addEventListener("click", ()=>{
            alert("Play Tab button clicked!"); // DEBUG ALERT
        // playTab(); // Use the playTab function passed as dependency - COMMENTED OUT
        });
        playTabButton.title = "Play the tab (Spacebar)"; // Tooltip
    } else console.error("Button with ID 'playTabBtn' not found.");
    if (pauseTabButton) {
        pauseTabButton.addEventListener("click", ()=>{
            alert("Pause Tab button clicked!"); // DEBUG ALERT
        // if (pauseTab) { // - COMMENTED OUT
        //   pauseTab(); // Call the pauseTab function passed as dependency - COMMENTED OUT
        // } // - COMMENTED OUT
        });
        pauseTabButton.title = "Pause the tab (Spacebar)"; // Tooltip
    } else console.error("Button with ID 'pauseTabBtn' not found.");
    if (stopTabButton) {
        stopTabButton.addEventListener("click", ()=>{
            alert("Stop Tab button clicked!"); // DEBUG ALERT
        // if (stopPlayback) { // - COMMENTED OUT
        //   stopPlayback(); // Use the stopPlayback function passed as dependency - COMMENTED OUT
        // } // - COMMENTED OUT
        });
        stopTabButton.title = "Stop playback (Esc)"; // Tooltip
    } else console.error("Button with ID 'stopTabBtn' not found.");
    if (saveTabButton) {
        // Use the passed saveTab function directly
        saveTabButton.addEventListener("click", ()=>{
            alert("Save Tab button clicked!"); // DEBUG ALERT
        // saveTab(); // Original function call - COMMENTED OUT
        });
        saveTabButton.title = "Save tab to local storage (Ctrl+S)"; // Tooltip
    } else console.error("Button with ID 'saveTabBtn' not found.");
    if (loadTabButton) {
        // Use the passed loadTab function directly
        loadTabButton.addEventListener("click", ()=>{
            alert("Load Tab button clicked!"); // DEBUG ALERT
        // loadTab(); // Original function call - COMMENTED OUT
        });
        loadTabButton.title = "Load tab from local storage (Ctrl+O)"; // Tooltip
    } else console.error("Button with ID 'loadTabBtn' not found.");
    // Removed duplicate Load Tab button logic block
    if (rotateMeasureButton) {
        rotateMeasureButton.addEventListener("click", ()=>{
            alert("Rotate Measure button clicked!"); // DEBUG ALERT
        // toggleMeasureRotation(); // Call the toggle function from dependencies - COMMENTED OUT
        // renderTab(getTabData()); // Re-render to apply/remove rotation - COMMENTED OUT
        });
        rotateMeasureButton.title = "Rotate measure (Ctrl+R)"; // Tooltip
    } else console.error("Button with ID 'rotateMeasureBtn' not found.");
    console.log("ui-elements.js: Toolbar setup complete"); // DEBUG LOG
}
/**
 * Handles input events on fret elements.
 * @param {Event} e - The input event.
 * @param {function} getTabData - Function to get tab data.
 * @param {function} setTabData - Function to set tab data.
 * @param {function} renderTab - Function to render the tab.
 */ function handleFretInput(e, getTabData, setTabData, renderTab) {
    const fretElement = e.target;
    const measureIndex = parseInt(fretElement.dataset.measure);
    const stringIndex = parseInt(fretElement.dataset.string);
    const fretIndex = parseInt(fretElement.dataset.fret);
    let value = fretElement.textContent.replace(/[^0-9]/g, "").slice(0, 2); // Allow only numbers, max 2 digits
    const tabData = getTabData();
    if (tabData.measures[measureIndex]) {
        tabData.measures[measureIndex].strings[stringIndex][fretIndex] = value;
        setTabData(tabData);
        renderTab(getTabData()); // Re-render after input
    }
}
/**
 * Displays the number circle for fret selection.
 * @param {HTMLElement} fret - The fret element.
 */ function showNumberCircle(fret) {
    // Remove any existing number circle
    removeOpenNumberCircle();
    // Remove active class from any previously active fret
    removeActiveFretClass();
    // Add active class to the currently focused fret
    fret.classList.add('active-fret');
    // Store the active fret's ID in localStorage so it can be re-applied after re-render
    localStorage.setItem('activeFretId', fret.id);
    const circle = document.createElement("div");
    circle.className = "number-circle";
    const radius = 50;
    const centerX = fret.offsetWidth / 2;
    const centerY = fret.offsetHeight / 2;
    const numbers = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "1x",
        "2x"
    ];
    numbers.forEach((num, i)=>{
        const angle = i / numbers.length * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const number = document.createElement("div");
        number.className = "number";
        number.textContent = num;
        number.style.left = `${x}px`;
        number.style.top = `${y}px`;
        number.style.animationDelay = `${i * 0.1}s`;
        number.onclick = ()=>{
            if (num === "1x" || num === "2x") {
                removeOpenNumberCircle();
                showSecondNumberCircle(fret, num);
            } else {
                fret.textContent = num; // Set the text first
                // Dispatch an input event so handleFretInput updates the data model and handles re-rendering
                fret.dispatchEvent(new Event("input", {
                    bubbles: true,
                    cancelable: true
                }));
                removeOpenNumberCircle(); // Remove the circle after dispatching, using the dedicated function
                fret.focus(); // Re-focus the fret after input
            }
        };
        circle.appendChild(number);
    });
    if (typeof document !== "undefined") {
        document.body.appendChild(circle);
        positionNumberCircle(circle, fret);
    }
}
/**
 * Removes any open number circle from the DOM.
 */ function removeOpenNumberCircle() {
    const openCircle = document.querySelector(".number-circle");
    if (openCircle) openCircle.remove();
}
/**
 * Removes the 'active-fret' class from any fret that has it.
 */ function removeActiveFretClass() {
    document.querySelectorAll('.fret.active-fret').forEach((fret)=>{
        fret.classList.remove('active-fret');
    });
    localStorage.removeItem('activeFretId'); // Clear stored active fret ID
}
/**
 * Positions the number circle relative to the fret element.
 * @param {HTMLElement} circle - The number circle element.
 * @param {HTMLElement} fret - The fret element.
 */ function positionNumberCircle(circle, fret) {
    const fretRect = fret.getBoundingClientRect();
    circle.style.top = `${fretRect.top + window.scrollY - circle.offsetHeight / 2 + fret.offsetHeight / 2}px`;
    circle.style.left = `${fretRect.left + window.scrollX - circle.offsetWidth / 2 + fret.offsetWidth / 2}px`;
}
/**
 * Displays the second number circle for bends and slides.
 * @param {HTMLElement} fret - The fret element.
 * @param {string} firstDigit - The first digit selected ("1x" or "2x").
 */ function showSecondNumberCircle(fret, firstDigit) {
    removeOpenNumberCircle(); // Remove any existing number circle
    const circle = document.createElement("div");
    circle.className = "number-circle";
    circle.classList.add("second-number-circle");
    const radius = 50;
    const centerX = fret.offsetWidth / 2;
    const centerY = fret.offsetHeight / 2;
    const numbers = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
    ];
    numbers.forEach((num, i)=>{
        const angle = i / numbers.length * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const number = document.createElement("div");
        number.className = "number";
        number.textContent = num;
        number.style.left = `${x}px`;
        number.style.top = `${y}px`;
        number.style.animationDelay = `${i * 0.1}s`;
        number.onclick = ()=>{
            fret.textContent = firstDigit.replace(/x/, num); // Set the text first
            // Dispatch an input event so handleFretInput updates the data model and handles re-rendering
            fret.dispatchEvent(new Event("input", {
                bubbles: true,
                cancelable: true
            }));
            removeOpenNumberCircle(); // Remove the circle after dispatching, using the dedicated function
            fret.focus(); // Re-focus the fret after input
        };
        circle.appendChild(number);
    });
    if (typeof document !== "undefined") {
        document.body.appendChild(circle);
        positionNumberCircle(circle, fret);
    }
}
// Close number circle when clicking outside
if (typeof document !== "undefined") {
    document.addEventListener("click", function(event) {
        const numberCircle = document.querySelector(".number-circle");
        if (numberCircle) {
            let isClickInside = numberCircle.contains(event.target);
            let isClickOnFret = event.target.classList.contains("fret");
            if (!isClickInside && !isClickOnFret) setTimeout(()=>{
                if (!event.target.closest(".number-circle")) removeOpenNumberCircle(); // Use dedicated function to remove
            }, 100);
        }
    });
    // Remove active fret class when clicking outside of frets
    document.addEventListener('click', function(event) {
        if (!event.target.classList.contains('fret')) removeActiveFretClass();
    });
}

},{"./audio.js":"bTyvi","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bTyvi":[function(require,module,exports,__globalThis) {
// audio.js
// This module handles audio playback using the Web Audio API.
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "initializeAudio", ()=>initializeAudio);
parcelHelpers.export(exports, "playTab", ()=>playTab);
parcelHelpers.export(exports, "stopPlayback", ()=>stopPlayback);
parcelHelpers.export(exports, "exportMIDI", ()=>exportMIDI);
var _tabDataJs = require("./tab-data.js"); // Import getTabData and getNote
let audioContext;
let fretboardProcessorNode;
let resumeListenersAttached = false; // Flag to track if listeners are attached
let tabData; // To hold tab data for playback
let isPlaying = false; // Track playback state
let currentMeasureIndex = 0;
let currentStringIndex = 0;
let currentFretIndex = 0;
let playbackIntervalId = null;
/**
 * Initializes the audio context and processor.
 */ async function initializeAudio() {
    console.log("audio.js: initializeAudio called.");
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("audio.js: AudioContext created:", audioContext);
        if (audioContext.state === 'suspended') {
            console.log("audio.js: AudioContext is suspended, attaching resume listeners.");
            if (!resumeListenersAttached) {
                resumeAudioContextOnInteraction();
                resumeListenersAttached = true;
            }
        }
    }
    if (!fretboardProcessorNode) await setupAudioWorklet();
    console.log("audio.js: initializeAudio finished.");
}
/**
 * Resumes the audio context on user interaction.
 */ function resumeAudioContextOnInteraction() {
    console.log("audio.js: resumeAudioContextOnInteraction called. actx is:", audioContext);
    const resume = async ()=>{
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
            console.log("audio.js: AudioContext resumed successfully.");
        }
        document.removeEventListener('mousedown', resume);
        document.removeEventListener('touchstart', resume);
        document.removeEventListener('keydown', resume);
    };
    document.addEventListener('mousedown', resume);
    document.addEventListener('touchstart', resume);
    document.addEventListener('keydown', resume);
    console.log("audio.js: Audio resume listeners attached.");
}
/**
 * Sets up the AudioWorklet processor for sound generation.
 */ async function setupAudioWorklet() {
    try {
        await audioContext.audioWorklet.addModule('src/fretboard-processor.js');
        fretboardProcessorNode = new AudioWorkletNode(audioContext, 'fretboard-processor');
        fretboardProcessorNode.connect(audioContext.destination);
        console.log("audio.js: AudioWorkletNode created and connected.");
    } catch (error) {
        console.error("audio.js: Error setting up AudioWorklet:", error);
        alert('Failed to initialize audio. Please check console for details.');
    }
}
/**
 * Plays the guitar tab data.
 * @param {object} currentTabData - The guitar tab data.
 */ function playTab() {
    console.log("audio.js: playTab called");
    if (isPlaying) {
        console.log("audio.js: Already playing, ignoring playTab call.");
        return; // Prevent multiple playbacks
    }
    isPlaying = true;
    tabData = (0, _tabDataJs.getTabData)(); // Get tab data directly from module
    if (!tabData || !tabData.measures || tabData.measures.length === 0) {
        console.warn("audio.js: No tab data to play or tabData is invalid.");
        alert("No tab data available to play. Please add measures and notes.");
        isPlaying = false; // Reset the flag
        return;
    }
    console.log("audio.js: playTab - Tab data received:", tabData); // Log tabData
    // --- Playback Logic ---
    currentMeasureIndex = 0;
    currentStringIndex = 0;
    currentFretIndex = 0;
    playMeasure(currentMeasureIndex);
}
function playMeasure(measureIndex) {
    if (!isPlaying) return; // Stop if playback has been stopped
    if (measureIndex >= tabData.measures.length) {
        stopPlayback();
        return;
    }
    const measure = tabData.measures[measureIndex];
    const timeSignature = tabData.timeSignature || '4/4';
    const [beats] = timeSignature.split('/').map(Number);
    const bpm = tabData.bpm || 120;
    const millisecondsPerBeat = 60000 / bpm;
    const millisecondsPerMeasure = millisecondsPerBeat * beats;
    let fretValue = measure.strings[currentStringIndex][currentFretIndex];
    if (fretValue !== '-' && fretValue !== '') {
        const note = (0, _tabDataJs.getNote)(currentStringIndex, parseInt(fretValue), tabData.tuning);
        if (note) {
            console.log(`audio.js: Playing note ${note} at measure ${measureIndex}, string ${currentStringIndex}, fret ${currentFretIndex}`);
            if (fretboardProcessorNode) fretboardProcessorNode.port.postMessage({
                type: 'noteOn',
                note: note,
                velocity: 0.8
            });
        }
    }
    // Move to the next fret
    currentFretIndex++;
    if (currentFretIndex >= beats) {
        currentFretIndex = 0;
        currentStringIndex++;
        if (currentStringIndex >= 6) {
            currentStringIndex = 0;
            // Move to the next measure
            currentMeasureIndex++;
            if (currentMeasureIndex < tabData.measures.length) {
                setTimeout(()=>{
                    playMeasure(currentMeasureIndex);
                }, millisecondsPerMeasure);
                return; // Exit to prevent immediate next fret playback
            } else {
                stopPlayback();
                return;
            }
        }
    }
    // Play the next fret immediately
    setTimeout(()=>{
        if (isPlaying) playMeasure(measureIndex);
    }, millisecondsPerBeat);
}
/**
 * Stops the audio playback.
 */ function stopPlayback() {
    console.log("audio.js: stopPlayback called");
    if (fretboardProcessorNode) fretboardProcessorNode.port.postMessage({
        type: 'allNotesOff'
    });
    isPlaying = false; // Reset the flag
    currentMeasureIndex = 0;
    currentStringIndex = 0;
    currentFretIndex = 0;
    if (playbackIntervalId) {
        clearInterval(playbackIntervalId);
        playbackIntervalId = null;
    }
// Additional stop logic if needed (e.g., clearing intervals, UI reset)
}
/**
 * Exports the current tab data as a MIDI file (placeholder).
 */ function exportMIDI() {
    console.log("audio.js: exportMIDI called (placeholder)");
    alert("MIDI export functionality is not yet implemented."); // Placeholder alert
// TODO: Implement MIDI export logic
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"kjaMg":[function(require,module,exports,__globalThis) {
// config.js
// Configuration settings for the Guitar Tab Editor
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const config = {
    bodyFontSize: '16px',
    tabEditorWidth: '85%',
    tabEditorMaxWidth: '1000px',
    tabEditorBorder: '1.5px solid #333',
    tabEditorPadding: '15px',
    tabEditorBoxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
    tabEditorBorderRadius: '10px',
    tabDisplayMarginBottom: '15px',
    tabDisplayBorder: '1.5px solid #333',
    tabDisplayPadding: '10px',
    tabDisplayMinHeight: '120px',
    tabDisplayMaxHeight: '400px',
    tabDisplayBorderRadius: '6px',
    toolBarPadding: '10px',
    toolBarBorder: '1.5px solid #333',
    toolBarButtonPadding: '12px 18px',
    toolBarButtonFontSize: '16px',
    toolBarButtonBorderRadius: '6px',
    measureBorder: '1.5px solid #333',
    measurePadding: '8px',
    measureMarginRight: '10px',
    measureMarginBottom: '10px',
    measureBorderRadius: '6px',
    stringBorderBottom: '1px solid #666',
    stringPadding: '4px 0',
    fretWidth: '55px',
    fretHeight: '55px',
    fretBorder: '1.5px solid #555',
    fretPadding: '8px',
    fretMargin: '3px',
    fretFontSize: '16px',
    fretBorderRadius: '6px',
    numberCircleWidth: '140px',
    numberCircleHeight: '140px',
    numberCircleBorderRadius: '50%'
};
exports.default = config;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["7wZbQ","2R06K"], "2R06K", "parcelRequiref18f", {})

//# sourceMappingURL=Fretboard.0f77c784.js.map
