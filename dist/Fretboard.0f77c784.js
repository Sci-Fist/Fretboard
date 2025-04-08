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
console.log("app.js: Starting app.js");
/**
 * Sets up the entire application.
 */ async function setupApp() {
    console.log("app.js: setupApp called");
    try {
        (0, _tabDataJs.initializeTabData)();
        _renderingJs.renderTab((0, _tabDataJs.getTabData)());
        setupUI();
    // Config variables and log are now inside setupUI.
    } catch (error) {
        console.error("app.js: Error during app setup:", error);
        alert("Failed to initialize the application. Please check the console for details.");
    }
    console.log("app.js: Finished setupApp");
}

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
    const tabDisplay = document.getElementById("tab-display");
    if (!tabDisplay) {
        console.error("rendering.js: tabDisplay element not found!");
        return;
    }
    tabDisplay.innerHTML = ""; // Clear the tab display
    if (!tabData.measures || tabData.measures.length === 0) return; // Exit if there are no measures
    tabData.measures.forEach((measure, measureIndex)=>{
        const measureDiv = document.createElement("div");
        measureDiv.className = "measure";
        for(let stringIndex = 0; stringIndex < 6; stringIndex++){
            const stringDiv = document.createElement("div");
            stringDiv.className = "string";
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
            for(let fretIndex = 0; fretIndex < 4; fretIndex++){
                const fretDiv = document.createElement("div");
                fretDiv.className = "fret";
                fretDiv.contentEditable = true;
                fretDiv.role = "textbox"; // Accessibility: Identify as text input
                fretDiv.inputMode = "numeric"; // Accessibility: Suggest numeric keyboard on mobile
                // fretDiv.pattern = "[0-9]*"; // Pattern doesn't work directly on contentEditable
                fretDiv.dataset.measure = measureIndex;
                fretDiv.dataset.string = stringIndex;
                fretDiv.dataset.fret = fretIndex;
                fretDiv.id = `fret-${measureIndex}-${stringIndex}-${fretIndex}`;
                fretDiv.name = `fret-${measureIndex}-${stringIndex}-${fretIndex}`;
                fretDiv.textContent = measure.strings[stringIndex][fretIndex] || ""; // Set the fret text content
                fretDiv.setAttribute('tabindex', '0'); // Make the frets focusable
                fretDiv.setAttribute('aria-label', `Fret ${fretDiv.textContent || 'empty'}`); // Provide accessible label
                stringDiv.appendChild(fretDiv);
            }
            measureDiv.appendChild(stringDiv);
        }
        tabDisplay.appendChild(measureDiv);
    });
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
    capo: 0
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
        measures: [] // Start with empty measures before adding one
    };
    addMeasure(); // Add the initial measure
}
/**
 * Adds a new measure to the tab data.
 */ function addMeasure() {
    console.log('tab-data.js: addMeasure called');
    const measure = {
        strings: [
            [
                '',
                '',
                '',
                ''
            ],
            [
                '',
                '',
                '',
                ''
            ],
            [
                '',
                '',
                '',
                ''
            ],
            [
                '',
                '',
                '',
                ''
            ],
            [
                '',
                '',
                '',
                ''
            ],
            [
                '',
                '',
                '',
                ''
            ]
        ]
    };
    tabData.measures.push(measure);
    console.log('tab-data.js: tabData after addMeasure:', tabData);
}
/**
 * Clears all measures from the tab data.
 */ function clearTab() {
    console.log('tab-data.js: clearTab called');
    tabData.measures = []; // Correctly clears measures
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
var _audioJs = require("./audio.js"); // Moved import to the top
/**
 * Sets up the tool bar by attaching event listeners to the tool bar buttons.
 * @param {object} dependencies - Object containing functions from other modules.
 */ function setupToolBar(dependencies) {
    const { addMeasure, clearTab, exportTab, showBPMInput, playTab, stopPlayback, saveTab, loadTab, exportMIDI, renderTab, getTabData, setTabData } = dependencies;
    // Select buttons by their specific IDs
    const addMeasureButton = document.getElementById("addMeasureBtn");
    const clearTabButton = document.getElementById("clearTabBtn");
    const exportTabButton = document.getElementById("exportTabBtn");
    const showBPMInputButton = document.getElementById("setBPMBtn");
    const playTabButton = document.getElementById("playTabBtn");
    const stopTabButton = document.getElementById("stopTabBtn");
    const saveTabButton = document.getElementById("saveTabBtn");
    const loadTabButton = document.getElementById("loadTabBtn");
    const exportMIDButton = document.getElementById("exportMIDIBtn");
    // Add event listeners only if the button exists
    if (addMeasureButton) addMeasureButton.addEventListener("click", ()=>{
        addMeasure();
        renderTab(getTabData());
    });
    else console.error("Button with ID 'addMeasureBtn' not found.");
    // Implement Load Tab button
    if (loadTabButton) loadTabButton.addEventListener('click', ()=>{
        const savedTab = localStorage.getItem('guitarTab');
        if (savedTab) try {
            const tabData = JSON.parse(savedTab);
            setTabData(tabData);
            renderTab(getTabData());
            alert('Tab loaded from local storage!');
        } catch (error) {
            console.error('Error loading tab from local storage:', error);
            alert('Error loading tab.  Check the console for more details.');
        }
        else alert('No tab found in local storage.');
    });
    if (clearTabButton) clearTabButton.addEventListener("click", ()=>{
        clearTab();
        addMeasure(); // Add an initial measure after clearing
        renderTab(getTabData());
    });
    else console.error("Button with ID 'clearTabBtn' not found.");
    if (exportTabButton) exportTabButton.addEventListener("click", exportTab);
    else console.error("Button with ID 'exportTabBtn' not found.");
    if (showBPMInputButton) showBPMInputButton.addEventListener("click", showBPMInput);
    else console.error("Button with ID 'setBPMBtn' not found.");
    if (playTabButton) playTabButton.addEventListener("click", ()=>{
        try {
            playTab(getTabData());
            playTabButton.style.display = "none";
            playTabButton.setAttribute("aria-pressed", "false");
            if (stopTabButton) {
                stopTabButton.style.display = "inline-block";
                stopTabButton.setAttribute("aria-pressed", "true");
                stopTabButton.focus(); // Move focus to stop button
            }
        } catch (err) {
            console.error("Error initiating playback:", err);
            alert("There was an error playing the tab. Please check the console for more details."); // User-friendly message
            // Ensure UI is reset if playTab fails immediately
            stopPlayback(); // Call stopPlayback to clean up potentially partially started audio
            playTabButton.style.display = "inline-block";
            playTabButton.setAttribute("aria-pressed", "false");
            if (stopTabButton) {
                stopTabButton.style.display = "none";
                stopTabButton.setAttribute("aria-pressed", "false");
            }
        }
    });
    else console.error("Button with ID 'playTabBtn' not found.");
    if (stopTabButton) stopTabButton.addEventListener("click", ()=>{
        try {
            stopPlayback();
        } finally{
            // Ensure button states are reset regardless of stopPlayback success/failure
            stopTabButton.style.display = "none";
            stopTabButton.setAttribute("aria-pressed", "false");
            if (playTabButton) {
                playTabButton.style.display = "inline-block";
                playTabButton.setAttribute("aria-pressed", "false"); // Ensure play is not pressed
                playTabButton.focus(); // Move focus back to play button
            }
        }
    });
    else console.error("Button with ID 'stopTabBtn' not found.");
    if (saveTabButton) saveTabButton.addEventListener("click", saveTab);
    else console.error("Button with ID 'saveTabBtn' not found.");
    if (loadTabButton) loadTabButton.addEventListener("click", loadTab);
    else console.error("Button with ID 'loadTabBtn' not found.");
    // Implement Load Tab button
    if (loadTabButton) loadTabButton.addEventListener('click', ()=>{
        const savedTab = localStorage.getItem('guitarTab');
        if (savedTab) try {
            const tabData = JSON.parse(savedTab);
            setTabData(tabData);
            renderTab(getTabData());
            alert('Tab loaded from local storage!');
        } catch (error) {
            console.error('Error loading tab from local storage:', error);
            alert('Error loading tab.  Check the console for more details.');
        }
        else alert('No tab found in local storage.');
    });
    if (exportMIDButton) exportMIDButton.addEventListener("click", exportMIDI);
    else console.error("Button with ID 'exportMIDIBtn' not found.");
    // Implement Save Tab button
    if (saveTabButton) saveTabButton.addEventListener('click', ()=>{
        const tabData = getTabData();
        localStorage.setItem('guitarTab', JSON.stringify(tabData));
        alert('Tab saved to local storage!');
    });
    // Implement Save Tab button
    if (saveTabButton) saveTabButton.addEventListener('click', ()=>{
        const tabData = getTabData();
        localStorage.setItem('guitarTab', JSON.stringify(tabData));
        alert('Tab saved to local storage!');
    });
    // Implement Export Tab button
    if (exportTabButton) exportTabButton.addEventListener("click", ()=>{
        const tabData = getTabData();
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
        document.body.appendChild(a); // Required for Firefox
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    console.log("ui-elements.js: Toolbar setup complete");
}
function generateTablature(tabData) {
    if (!tabData || !tabData.measures || tabData.measures.length === 0) return "No tab data.";
    let tabString = "";
    const tuning = tabData.tuning;
    const stringLabels = tuning.map((_, i)=>[
            "E",
            "A",
            "D",
            "G",
            "B",
            "e"
        ][i] || "").join("\n");
    tabData.measures.forEach((measure, measureIndex)=>{
        tabString += `${measureIndex + 1}. Measure:\n`;
        for(let stringIndex = 0; stringIndex < 6; stringIndex++){
            tabString += `${stringLabels.split("\n")[stringIndex]}|`;
            for(let fretIndex = 0; fretIndex < 4; fretIndex++){
                tabString += measure.strings[stringIndex][fretIndex] || "-";
                tabString += "|";
            }
            tabString += "\n";
        }
        tabString += "\n";
    });
    return tabString;
}
/**
 * Handles input events on fret elements.
 * @param {Event} e - The input event.
 * @param {function} getTabData - Function to get tab data.
 * @param {function} setTabData - Function to set tab data.
 * @param {function} renderTab - Function to render the tab.
 */ function handleFretInput(e, getTabData, setTabData, renderTab) {
    let shouldUpdateDisplay = false;
    const fretElement = e.target;
    const measureIndex = parseInt(fretElement.dataset.measure);
    const stringIndex = parseInt(fretElement.dataset.string);
    const fretIndex = parseInt(fretElement.dataset.fret);
    let value = fretElement.textContent.replace(/[^0-9]/g, "").slice(0, 2); // Allow only numbers, max 2 digits
    const tabData = getTabData();
    if (tabData.measures[measureIndex]) // Only update and re-render if the value actually changed
    {
        if (tabData.measures[measureIndex].strings[stringIndex][fretIndex] !== value) {
            tabData.measures[measureIndex].strings[stringIndex][fretIndex] = value;
            setTabData(tabData);
            shouldUpdateDisplay = true;
        }
    }
    if (shouldUpdateDisplay) {
        renderTab(getTabData()); // Re-render the tab after data update
        // Find the specific fret element again after re-render to set its text content
        const updatedFretElement = document.querySelector(`.fret[data-measure='${measureIndex}'][data-string='${stringIndex}'][data-fret='${fretIndex}']`);
        if (updatedFretElement) updatedFretElement.textContent = value; // Update displayed text on the *newly rendered* element
        else console.warn("handleFretInput: Could not find fret element after re-render.");
    } else if (fretElement.textContent !== value) // If only the display text needs correction (e.g., invalid chars removed)
    fretElement.textContent = value;
}
/**
 * Displays the number circle for fret selection.
 * @param {HTMLElement} fret - The fret element.
 */ function showNumberCircle(fret) {
    // Remove any existing number circle
    removeOpenNumberCircle();
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
        };
        circle.appendChild(number);
    });
    if (typeof document !== "undefined") {
        document.body.appendChild(circle);
        positionNumberCircle(circle, fret);
    }
}
// Close number circle when clicking outside
if (typeof document !== "undefined") document.addEventListener("click", function(event) {
    const numberCircle = document.querySelector(".number-circle");
    if (numberCircle) {
        let isClickInside = numberCircle.contains(event.target);
        let isClickOnFret = event.target.classList.contains("fret");
        if (!isClickInside && !isClickOnFret) setTimeout(()=>{
            if (!event.target.closest(".number-circle")) removeOpenNumberCircle(); // Use dedicated function to remove
        }, 100);
    }
});

},{"./audio.js":"bTyvi","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bTyvi":[function(require,module,exports,__globalThis) {
// audio.js
// This module handles audio playback using AudioWorkletNode.
// It provides functions to initialize the audio context, play individual notes,
// play a complete tab, and stop playback.
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "initializeAudio", ()=>initializeAudio);
parcelHelpers.export(exports, "loadSound", ()=>loadSound);
parcelHelpers.export(exports, "playSound", ()=>playSound);
parcelHelpers.export(exports, "playTab", ()=>playTab);
parcelHelpers.export(exports, "stopPlayback", ()=>stopPlayback);
parcelHelpers.export(exports, "exportMIDI", ()=>exportMIDI);
var _tabDataJs = require("./tab-data.js"); // Import getNote function
let isPlaying = false;
let currentMeasureIndex = 0;
let currentFretIndex = 0;
let playbackInterval;
let actx; // Audio context
let fretboardNode; // AudioWorkletNode
let bpm = 120; // Default BPM
const NUMBER_OF_STRINGS = 6;
// Initialize audio context and AudioWorklet
async function initializeAudio() {
    try {
        actx = new AudioContext();
        await actx.audioWorklet.addModule("src/fretboard-processor.js"); // Path to the processor file
        fretboardNode = new AudioWorkletNode(actx, "fretboard-processor"); // Use the processor's registered name
        // Connect the AudioWorkletNode to the destination
        fretboardNode.connect(actx.destination);
        console.log("Audio initialized successfully");
    } catch (error) {
        console.error("Failed to initialize audio:", error);
        alert("Failed to initialize audio playback. Please check your browser settings and the console.");
    }
}
// Add a function to resume the AudioContext on user interaction
async function resumeAudioContextOnInteraction() {
    if (actx.state === "suspended") {
        await actx.resume();
        console.log("AudioContext resumed successfully");
    }
}
// Attach the event listeners for user interaction
document.addEventListener("touchstart", resumeAudioContextOnInteraction, false);
document.addEventListener("click", resumeAudioContextOnInteraction, false);
document.addEventListener("keydown", resumeAudioContextOnInteraction, false);
/**
 * Loads a sound (not currently used).
 */ async function loadSound() {
    // Placeholder function for loading a sound
    // In a future version, this function would handle loading a sound file.
    alert("Sound loading not yet implemented.");
}
/**
 * Plays a single note using the AudioWorkletNode.
 * @param {string} note - The note to play (e.g., "E4").
 * @param {number} duration - The duration of the note in seconds (not fully implemented).
 */ function playNote(note, duration) {
    //console.log("audio.js: playNote called with", note, duration);
    if (!fretboardNode) {
        console.warn("AudioWorkletNode not initialized.");
        return;
    }
    fretboardNode.port.postMessage({
        type: "noteOn",
        note: note,
        velocity: 0.75
    });
}
/**
 * Plays a sound (not currently used).
 */ function playSound() {
    // Placeholder function for playing a sound
    // In a future version, this function would handle playing a sound.
    alert("Sound playing not yet implemented.");
}
/**
 * Stops the audio playback.
 */ function stopPlayback() {
    console.log("audio.js: stopPlayback called");
    if (!isPlaying) {
        console.log("No playback in progress, ignoring.");
        return;
    }
    isPlaying = false;
    clearInterval(playbackInterval);
    currentMeasureIndex = 0;
    currentFretIndex = 0;
    if (fretboardNode) fretboardNode.port.postMessage({
        type: "noteOff"
    });
}
/**
 * Exports the tab data as a MIDI file (placeholder).
 */ function exportMIDI() {
    // Placeholder function for MIDI export
    // In a future version, this function would handle MIDI file generation and download.
    alert("MIDI export not yet implemented.");
}
/**
 * Plays the entire tab.
 * @param {object} tabData - The tab data object.
 */ async function playTab(tabData) {
    console.log("audio.js: playTab called");
    // Ensure the AudioContext is running
    if (actx.state === "suspended") await actx.resume();
    if (isPlaying) stopPlayback();
    if (!tabData || !tabData.measures || tabData.measures.length === 0) {
        alert("No tab data to play.");
        return;
    }
    bpm = tabData.bpm || 120; // Use tabData BPM or default
    const sixteenthNoteDuration = 60 / bpm / 4; // Recalculate based on BPM
    isPlaying = true;
    currentMeasureIndex = 0;
    currentFretIndex = 0;
    function playMeasure(measureIndex) {
        if (!isPlaying) return; // Stop if playback is cancelled
        const measure = tabData.measures[measureIndex];
        if (!measure) {
            stopPlayback();
            return;
        }
        let fretIndex = 0;
        function playFret(stringIndex) {
            if (!isPlaying) return;
            const fretValue = measure.strings[stringIndex][fretIndex];
            if (fretValue !== "" && fretValue !== undefined) {
                const note = (0, _tabDataJs.getNote)(stringIndex, parseInt(fretValue), tabData.tuning);
                playNote(note, sixteenthNoteDuration); // Play the note
            }
        }
        function playNextFret() {
            if (!isPlaying) return;
            if (fretIndex < 4) {
                // Assuming 4 frets per beat (0,1,2,3)
                fretIndex++;
                for(let stringIndex = 0; stringIndex < NUMBER_OF_STRINGS; stringIndex++)playFret(stringIndex);
                setTimeout(playNextFret, sixteenthNoteDuration * 1000); // Play each fret for the duration
            } else {
                currentFretIndex = 0;
                playNextMeasure();
            }
        }
        // Start playing the first fret of the measure
        for(let stringIndex = 0; stringIndex < NUMBER_OF_STRINGS; stringIndex++)playFret(stringIndex);
        setTimeout(playNextFret, sixteenthNoteDuration * 1000); // Play each fret for the duration
    }
    function playNextMeasure() {
        if (!isPlaying) return;
        currentMeasureIndex++;
        if (currentMeasureIndex < tabData.measures.length) playMeasure(currentMeasureIndex);
        else stopPlayback(); // Stop when all measures are played
    }
    // Start playing the first measure
    playMeasure(0);
}

},{"./tab-data.js":"1uM0m","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"kjaMg":[function(require,module,exports,__globalThis) {
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
