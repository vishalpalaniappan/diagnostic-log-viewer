/*! For license information please see 648.607baae001c4ba78e4bc.bundle.js.LICENSE.txt */
(()=>{"use strict";var t,e,r={8648:(t,e,r)=>{var n=r(33594),o={LOAD_FILE:1,GET_METADATA:2,GET_POSITION_DATA:3,GET_VARIABLE_STACK:4,STEP_INTO:5,STEP_OUT:6,STEP_OVER_FORWARD:7,STEP_OVER_BACKWARD:8,GO_TO_START:9,GO_TO_END:10,TOGGLE_BREAKPOINT:11,BREAKPOINTS:12,PLAY_FORWARD:13,PLAY_BACKWARD:14,REPLAY:15,TOGGLE_BREAKPOINT_ENABLED:16};const i=o=Object.freeze(o);function a(t){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a(t)}function c(){c=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},u=i.iterator||"@@iterator",l=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var i=e&&e.prototype instanceof m?e:m,a=Object.create(i.prototype),c=new I(n||[]);return o(a,"_invoke",{value:x(t,r,c)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var y="suspendedStart",v="suspendedYield",d="executing",g="completed",b={};function m(){}function w(){}function k(){}var P={};f(P,u,(function(){return this}));var O=Object.getPrototypeOf,S=O&&O(O(N([])));S&&S!==r&&n.call(S,u)&&(P=S);var E=k.prototype=m.prototype=Object.create(P);function T(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function _(t,e){function r(o,i,c,u){var l=p(t[o],t,i);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==a(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return r("throw",t,c,u)}))}u(l.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function x(e,r,n){var o=y;return function(i,a){if(o===d)throw Error("Generator is already running");if(o===g){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=L(c,n);if(u){if(u===b)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var l=p(e,r,n);if("normal"===l.type){if(o=n.done?g:v,l.arg===b)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=g,n.method="throw",n.arg=l.arg)}}}function L(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,L(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var i=p(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,b;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,b):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[u];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(a(e)+" is not iterable")}return w.prototype=k,o(E,"constructor",{value:k,configurable:!0}),o(k,"constructor",{value:w,configurable:!0}),w.displayName=f(k,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,k):(t.__proto__=k,f(t,s,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},T(_.prototype),f(_.prototype,l,(function(){return this})),e.AsyncIterator=_,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new _(h(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},T(E),f(E,s,"Generator"),f(E,u,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,I.prototype={constructor:I,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(A),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,b):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),A(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;A(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),b}},e}function u(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function l(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){u(i,n,o,a,c,"next",t)}function c(t){u(i,n,o,a,c,"throw",t)}a(void 0)}))}}function s(t){var e="function"==typeof Map?new Map:void 0;return s=function(t){if(null===t||!function(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(e){return"function"==typeof t}}(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return function(t,e,r){if(f())return Reflect.construct.apply(null,arguments);var n=[null];n.push.apply(n,e);var o=new(t.bind.apply(t,n));return r&&h(o,r.prototype),o}(t,arguments,p(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),h(r,t)},s(t)}function f(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(f=function(){return!!t})()}function h(t,e){return h=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},h(t,e)}function p(t){return p=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},p(t)}var y=function(t){function e(t,r,n){var o;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(o=function(t,e,r){return e=p(e),function(t,e){if(e&&("object"==a(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}(t,f()?Reflect.construct(e,r||[],p(t).constructor):e.apply(t,r))}(this,e,["".concat(t," returned ").concat(r," ").concat(n)])).name="HTTPRequestError",o.url=t,o.status=r,o.statusText=n,o}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&h(t,e)}(e,t),r=e,Object.defineProperty(r,"prototype",{writable:!1}),r;var r}(s(Error));function v(t){return new Promise(function(){var e=l(c().mark((function e(r,n){return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.debug("Loading ".concat(t)),fetch(t,{cache:"no-cache"}).then(function(){var e=l(c().mark((function e(n){var o,i,a,u,l,s,f,h,p,v,d,g;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!1!==n.ok){e.next=2;break}throw new y(t,n.status,n.statusText);case 2:o=n.body.getReader(),i=+n.headers.get("Content-Length"),a=0,u=[];case 6:return e.next=9,o.read();case 9:if(l=e.sent,s=l.done,f=l.value,!s){e.next=14;break}return e.abrupt("break",19);case 14:u.push(f),a+=f.length,console.debug("Received ".concat(a,"B of ").concat(i,"B")),e.next=6;break;case 19:for(h=new Uint8Array(a),p=0,v=0,d=u;v<d.length;v++)g=d[v],h.set(g,p),p+=g.length;r(h);case 23:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(t){n(t)}));case 2:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}())}function d(t){return new Promise(function(){var e=l(c().mark((function e(r,n){var o;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(o=new FileReader).onload=function(t){r(new Uint8Array(t.target.result))},o.onerror=function(){n(o.error)},o.readAsArrayBuffer(t);case 4:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}())}var g=r(81219),b=r.n(g);function m(t){return m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},m(t)}function w(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,k(n.key),n)}}function k(t){var e=function(t){if("object"!=m(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=m(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==m(e)?e:e+""}const P=function(){return t=function t(e,r){for(var n in function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),e)n&&(this[n]=e[n]);this.filePath=r,this.fileName=r.split("/").pop()},(e=[{key:"isFunction",value:function(){return"function"===this.type}},{key:"getLineNo",value:function(){return this.lineno}},{key:"getFuncName",value:function(){return this.name}},{key:"getFilePath",value:function(){return this.filePath}},{key:"getFileName",value:function(){return this.fileName}},{key:"getId",value:function(){return this.id}},{key:"getfId",value:function(){return this.funcid}},{key:"getVariables",value:function(){return this.vars}},{key:"getType",value:function(){return this.type}},{key:"getSyntax",value:function(){return this.syntax}}])&&w(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function O(t){return O="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},O(t)}function S(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,E(n.key),n)}}function E(t){var e=function(t){if("object"!=O(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=O(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==O(e)?e:e+""}const T=function(){return t=function t(e){for(var r in function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),e)Object.prototype.hasOwnProperty.call(e,r)&&(this[r]=e[r])},(e=[{key:"getVarId",value:function(){return this.varId}},{key:"isGlobal",value:function(){return"global"in this&&!0===this.global}}])&&S(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function _(t){return _="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_(t)}function x(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,L(n.key),n)}}function L(t){var e=function(t){if("object"!=_(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=_(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==_(e)?e:e+""}const j=function(){return t=function t(e){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),!e)throw new Error("IRStreamHeader is required.");if(this.header=b().parse(e),!this.header||"object"!==_(this.header))throw new Error("Invalid header format.");this.logTypeMap={},this.variableMap={},this.parseHeader()},(e=[{key:"parseHeader",value:function(){var t;if(null===(t=this.header)||void 0===t||!t.ltMap)throw new Error("Invalid header: ltMap is missing.");for(var e in this.header.ltMap)if(e){var r=this.header.ltMap[e],n=this._getFileFromLogType(e);this.logTypeMap[e]=new P(r,n)}for(var o in this.header.varMap)if(o){var i=this.header.varMap[o];this.variableMap[o]=new T(i)}}},{key:"getLogTypeFromLineNumber",value:function(t,e){for(var r=this.header.fileTree[t].minLt,n=this.header.fileTree[t].maxLt,o=r+1;o<=n;o++)if(e==this.logTypeMap[o].lineno)return this.logTypeMap[o];return null}},{key:"_getFileFromLogType",value:function(t){for(var e in this.header.fileTree)if(e){var r=this.header.fileTree[e].minLt,n=this.header.fileTree[e].maxLt;if(r<t&&n>=t)return e}return null}},{key:"getSourceFiles",value:function(){var t=this,e={};return Object.keys(this.header.fileTree).forEach((function(r,n){var o=t.header.fileTree[r];if(!o.source)throw new Error("Source missing for file: ".concat(r));e[r]=o.source})),e}}])&&x(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function A(t){return A="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},A(t)}function I(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,N(n.key),n)}}function N(t){var e=function(t){if("object"!=A(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=A(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==A(e)?e:e+""}const R=function(){return t=function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t);var r=/^[.:a-zA-Z0-9_.-]+ [INFO|ERROR]+ adli ([^]*$)/gm.exec(e[0])[1];switch(r.charAt(0)){case"#":this._processVariable(r);break;case"?":this._processExeception(r);break;case"{":this._processIRHeader(r);break;default:this.type=3,this.lt=parseInt(r)}},(e=[{key:"_processVariable",value:function(t){this.type=1;var e=/^# ([0-9]+) (.*$)/gm.exec(t);this.value=this._parseVariableIfJSON(e[2]),this.varid=parseInt(e[1])}},{key:"_processExeception",value:function(t){this.type=2,this.value=t.slice(2)}},{key:"_processIRHeader",value:function(t){this.type=4,this.value=t}},{key:"_parseVariableIfJSON",value:function(t){try{return b().parse(t)}catch(e){return t}}}])&&I(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function F(t){return F="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},F(t)}function G(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,M(n.key),n)}}function M(t){var e=function(t){if("object"!=F(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=F(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==F(e)?e:e+""}const B=function(){return t=function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.exception=null,this.header={},this.execution=[],this.callStacks={},this.callStack=[],this.globalVariables={},this._processLog(e),this.lastPosition=this.getLastPosition()},(e=[{key:"_processLog",value:function(t){var e=0;do{var r=new R(t[e]);switch(r.type){case 3:this.execution.push(r),this._addToCallStacks(r);break;case 1:this.execution.push(r),this._saveGlobalVariables(r);break;case 4:this.header=new j(r.value);break;case 2:this.exception=r.value}}while(++e<t.length)}},{key:"_addToCallStacks",value:function(t){var e=this,r=this.execution.length-1,n=this.header.logTypeMap[t.lt],o=this.callStack;for(n.isFunction()&&0!=n.getfId()&&o.push(r);o.length>0;){var i=o[o.length-1];if(this.execution[i].lt===n.getfId())break;o.pop()}this.callStacks[r]=o.map((function(t,r){return e._getPreviousPosition(t)})),this.callStacks[r].push(r)}},{key:"_saveGlobalVariables",value:function(t){var e=this.header.variableMap[t.varid];0===this.header.logTypeMap[e.logType].getfId()&&(this.globalVariables[e.name]=t.value)}},{key:"_updateVariable",value:function(t,e,r,n){if(0==t.keys.length)r[t.name]=e;else{for(var o=(t.name in r?Object.assign({},r[t.name]):{}),i=o,a=0;a<t.keys.length;a++){var c,u=t.keys[a];(c="variable"===u.type?r[u.value]:"temp_variable"===u.type?n[u.value]:u.value)in i&&"object"===F(i[c])||(i[c]={}),a===t.keys.length-1?"object"===F(e)?i[c]=Object.assign({},e):i[c]=e.valueOf():i=i[c]}r[t.name]=Object.assign({},o)}}},{key:"getVariablesAtPosition",value:function(t){var e={},r={},n={},o=this.execution[t],i=this.header.logTypeMap[o.lt].getfId(),a=0;do{var c=this.execution[a];if(1===c.type){var u=this.header.variableMap[c.varid],l=this.header.logTypeMap[u.logType].getfId();u.isTemp?n[u.name]=c.value:0==l||u.isGlobal()?this._updateVariable(u,c.value,r,n):l===i&&this._updateVariable(u,c.value,e,n)}}while(++a<=t);return[e,r]}},{key:"_getPreviousPosition",value:function(t){for(;--t>=0;)if(3===this.execution[t].type)return t;return null}},{key:"_getNextPosition",value:function(t){for(;++t<this.execution.length;)if(3===this.execution[t].type)return t;return null}},{key:"getCallStackAtPosition",value:function(t){var e=this,r=this.callStacks[t],n=[];return r.forEach((function(t,r){var o=e.execution[t],i=e.header.logTypeMap[o.lt],a=e.header.logTypeMap[i.getfId()],c=0===i.getfId()?"<module>":a.getFuncName(),u=t===e.execution.length-1?e.exception:null;n.push({functionName:c,filePath:i.getFilePath(),fileName:i.getFileName(),lineno:i.getLineNo(),position:t,exceptions:u})})),n}},{key:"getPositionData",value:function(t){do{var e=this.execution[t];if(3===e.type){postMessage({code:i.GET_POSITION_DATA,args:{currLtInfo:this.header.logTypeMap[e.lt],callStack:this.getCallStackAtPosition(t).reverse(),exceptions:this.exception}});break}}while(--t>0)}},{key:"getLastPosition",value:function(){var t=this.execution.length-1;do{if(3===this.execution[t].type)return t}while(--t>=0)}}])&&G(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function C(t){return C="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},C(t)}function D(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=V(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function V(t,e){if(t){if("string"==typeof t)return K(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?K(t,e):void 0}}function K(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function Y(){Y=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function s(t,e,r,n){var i=e&&e.prototype instanceof g?e:g,a=Object.create(i.prototype),c=new j(n||[]);return o(a,"_invoke",{value:T(t,r,c)}),a}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=s;var h="suspendedStart",p="suspendedYield",y="executing",v="completed",d={};function g(){}function b(){}function m(){}var w={};l(w,a,(function(){return this}));var k=Object.getPrototypeOf,P=k&&k(k(A([])));P&&P!==r&&n.call(P,a)&&(w=P);var O=m.prototype=g.prototype=Object.create(w);function S(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function r(o,i,a,c){var u=f(t[o],t,i);if("throw"!==u.type){var l=u.arg,s=l.value;return s&&"object"==C(s)&&n.call(s,"__await")?e.resolve(s.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(s).then((function(t){l.value=t,a(l)}),(function(t){return r("throw",t,a,c)}))}c(u.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function T(e,r,n){var o=h;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===v){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=_(c,n);if(u){if(u===d)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var l=f(e,r,n);if("normal"===l.type){if(o=n.done?v:p,l.arg===d)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=v,n.method="throw",n.arg=l.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),d;var i=f(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,d;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,d):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function x(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function L(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(x,this),this.reset(!0)}function A(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(C(e)+" is not iterable")}return b.prototype=m,o(O,"constructor",{value:m,configurable:!0}),o(m,"constructor",{value:b,configurable:!0}),b.displayName=l(m,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,l(t,u,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},S(E.prototype),l(E.prototype,c,(function(){return this})),e.AsyncIterator=E,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new E(s(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},S(O),l(O,u,"Generator"),l(O,a,(function(){return this})),l(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=A,j.prototype={constructor:j,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(L),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),L(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;L(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:A(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),d}},e}function W(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function H(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,U(n.key),n)}}function U(t){var e=function(t){if("object"!=C(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=C(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==C(e)?e:e+""}const $=function(){return t=function t(e){var r,o=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),(r=e,new Promise(function(){var t=l(c().mark((function t(e,n){return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r instanceof File?d(r).then((function(t){e(t)})).catch((function(t){n(t)})):"string"==typeof r?v(r).then((function(t){e(t)})).catch((function(t){n(t)})):n(new Error("Invalid file"));case 1:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}())).then(function(){var t,e=(t=Y().mark((function t(e){var r,i,a;return Y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,n.A)();case 2:r=t.sent,i=new r.ClpStreamReader(e,{}),a=i.decodeRange(0,i.deserializeStream(),!1),o.parseLogAndInitializeDebugger(a);case 6:case"end":return t.stop()}}),t)})),function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){W(i,n,o,a,c,"next",t)}function c(t){W(i,n,o,a,c,"throw",t)}a(void 0)}))});return function(t){return e.apply(this,arguments)}}())},(e=[{key:"parseLogAndInitializeDebugger",value:function(t){this.cdl=new B(t),this.breakpoints=[],console.info(this.cdl),postMessage({code:i.GET_METADATA,args:{fileTree:this.cdl.header.getSourceFiles()}}),this.replayProgram()}},{key:"getVariableStack",value:function(t){var e=function(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,i,a,c=[],u=!0,l=!1;try{if(i=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=i.call(r)).done)&&(c.push(n.value),c.length!==e);u=!0);}catch(t){l=!0,o=t}finally{try{if(!u&&null!=r.return&&(a=r.return(),Object(a)!==a))return}finally{if(l)throw o}}return c}}(t,e)||V(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}(this.cdl.getVariablesAtPosition(t),2),r=e[0],n=e[1];postMessage({code:i.GET_VARIABLE_STACK,args:{localVariables:r,globalVariables:n}})}},{key:"goToStart",value:function(){this.cdl.getPositionData(0)}},{key:"goToEnd",value:function(){this.cdl.getPositionData(this.cdl.lastPosition)}},{key:"stepInto",value:function(t){var e=this.cdl._getNextPosition(t);if(null!=e){var r=this.cdl.getCallStackAtPosition(e);this.cdl.getPositionData(r[r.length-1].position)}}},{key:"stepOut",value:function(t){var e=this.cdl.getCallStackAtPosition(t);e.length<=1||this.cdl.getPositionData(e[e.length-2].position)}},{key:"stepOverForward",value:function(t){for(var e=this.cdl.getCallStackAtPosition(t);t<this.cdl.execution.length;){if(null==(t=this.cdl._getNextPosition(t)))return;if(this.cdl.getCallStackAtPosition(t).length<=e.length)return void this.cdl.getPositionData(t)}}},{key:"stepOverBackward",value:function(t){for(var e=this.cdl.getCallStackAtPosition(t);t>=0;){if(null==(t=this.cdl._getPreviousPosition(t)))return;if(this.cdl.getCallStackAtPosition(t).length<=e.length)return void this.cdl.getPositionData(t)}}},{key:"replayProgram",value:function(t){this.playForward(0)}},{key:"playForward",value:function(t){do{if(null==(t=this.cdl._getNextPosition(t)))return void this.cdl.getPositionData(this.cdl.lastPosition);var e,r=D(this.breakpoints);try{for(r.s();!(e=r.n()).done;){var n=e.value;if(n.enabled&&n.id===this.cdl.execution[t].lt)return void this.cdl.getPositionData(t)}}catch(t){r.e(t)}finally{r.f()}}while(t<this.cdl.execution.length)}},{key:"playBackward",value:function(t){do{if(null==(t=this.cdl._getPreviousPosition(t)))return void this.cdl.getPositionData(0);var e,r=D(this.breakpoints);try{for(r.s();!(e=r.n()).done;){var n=e.value;if(n.enabled&&n.id===this.cdl.execution[t].lt)return void this.cdl.getPositionData(t)}}catch(t){r.e(t)}finally{r.f()}}while(t>=0)}},{key:"toggleBreakpoint",value:function(t,e){var r=this.cdl.header.getLogTypeFromLineNumber(t,e);null!==r&&(this.breakpoints.includes(r)?this.breakpoints.splice(this.breakpoints.indexOf(r),1):(r.enabled=!0,this.breakpoints.push(r)),postMessage({code:i.BREAKPOINTS,args:{breakpoints:this.breakpoints}}))}},{key:"toggleBreakpointEnabled",value:function(t,e){var r=this.cdl.header.getLogTypeFromLineNumber(t,e);if(null!==r){var n=this.breakpoints.indexOf(r);-1!==n?(this.breakpoints[n].enabled=!this.breakpoints[n].enabled,postMessage({code:i.BREAKPOINTS,args:{breakpoints:this.breakpoints}})):console.warn("Breakpoint not in active breakpoints list")}else console.warn("Breakpoint not found")}}])&&H(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();var z;onmessage=function(t){try{var e,r=null!=t&&null!==(e=t.data)&&void 0!==e&&e.args?t.data.args:{};switch(t.data.code){case i.LOAD_FILE:z=new $(r.fileInfo);break;case i.GET_VARIABLE_STACK:z.getVariableStack(r.position);break;case i.STEP_INTO:z.stepInto(r.position);break;case i.STEP_OUT:z.stepOut(r.position);break;case i.STEP_OVER_FORWARD:z.stepOverForward(r.position);break;case i.STEP_OVER_BACKWARD:z.stepOverBackward(r.position);break;case i.GO_TO_START:z.goToStart();break;case i.GO_TO_END:z.goToEnd();break;case i.PLAY_BACKWARD:z.playBackward(r.position);break;case i.PLAY_FORWARD:z.playForward(r.position);break;case i.REPLAY:z.replayProgram();break;case i.TOGGLE_BREAKPOINT:z.toggleBreakpoint(r.fileName,r.lineNumber);break;case i.TOGGLE_BREAKPOINT_ENABLED:z.toggleBreakpointEnabled(r.fileName,r.lineNumber)}}catch(t){console.error(t)}},onerror=function(t){console.debug(t)}}},n={};function o(t){var e=n[t];if(void 0!==e)return e.exports;var i=n[t]={id:t,exports:{}};return r[t].call(i.exports,i,i.exports,o),i.exports}o.m=r,o.x=()=>{var t=o.O(void 0,[96],(()=>o(8648)));return o.O(t)},o.amdO={},t=[],o.O=(e,r,n,i)=>{if(!r){var a=1/0;for(s=0;s<t.length;s++){for(var[r,n,i]=t[s],c=!0,u=0;u<r.length;u++)(!1&i||a>=i)&&Object.keys(o.O).every((t=>o.O[t](r[u])))?r.splice(u--,1):(c=!1,i<a&&(a=i));if(c){t.splice(s--,1);var l=n();void 0!==l&&(e=l)}}return e}i=i||0;for(var s=t.length;s>0&&t[s-1][2]>i;s--)t[s]=t[s-1];t[s]=[r,n,i]},o.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return o.d(e,{a:e}),e},o.d=(t,e)=>{for(var r in e)o.o(e,r)&&!o.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},o.f={},o.e=t=>Promise.all(Object.keys(o.f).reduce(((e,r)=>(o.f[r](t,e),e)),[])),o.u=t=>"vendors.aea524e44c4b98f74bb0.bundle.js",o.miniCssF=t=>{},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),o.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.j=648,(()=>{var t;o.g.importScripts&&(t=o.g.location+"");var e=o.g.document;if(!t&&e&&(e.currentScript&&"SCRIPT"===e.currentScript.tagName.toUpperCase()&&(t=e.currentScript.src),!t)){var r=e.getElementsByTagName("script");if(r.length)for(var n=r.length-1;n>-1&&(!t||!/^http(s?):/.test(t));)t=r[n--].src}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=t})(),(()=>{o.b=self.location+"";var t={648:1};o.f.i=(e,r)=>{t[e]||importScripts(o.p+o.u(e))};var e=self.webpackChunkdiagnostic_log_viewer=self.webpackChunkdiagnostic_log_viewer||[],r=e.push.bind(e);e.push=e=>{var[n,i,a]=e;for(var c in i)o.o(i,c)&&(o.m[c]=i[c]);for(a&&a(o);n.length;)t[n.pop()]=1;r(e)}})(),o.nc=void 0,e=o.x,o.x=()=>o.e(96).then(e),o.x()})();
//# sourceMappingURL=648.607baae001c4ba78e4bc.bundle.js.map