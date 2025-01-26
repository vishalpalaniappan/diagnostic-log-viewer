/*! For license information please see 100.04c8b58cadf213fa4847.bundle.js.LICENSE.txt */
(()=>{"use strict";var t,e,r={46100:(t,e,r)=>{var n=r(33594),o={LOAD_FILE:1,GET_METADATA:2,GET_POSITION_DATA:3,GET_VARIABLE_STACK:4,STEP_INTO:5,STEP_OUT:6,STEP_OVER_FORWARD:7,STEP_OVER_BACKWARD:8,GO_TO_START:9,GO_TO_END:10};const i=o=Object.freeze(o);function a(t){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a(t)}function c(){c=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},u=i.iterator||"@@iterator",s=i.asyncIterator||"@@asyncIterator",l=i.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var i=e&&e.prototype instanceof m?e:m,a=Object.create(i.prototype),c=new I(n||[]);return o(a,"_invoke",{value:_(t,r,c)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var y="suspendedStart",v="suspendedYield",g="executing",d="completed",b={};function m(){}function w(){}function S(){}var T={};f(T,u,(function(){return this}));var k=Object.getPrototypeOf,E=k&&k(k(N([])));E&&E!==r&&n.call(E,u)&&(T=E);var x=S.prototype=m.prototype=Object.create(T);function O(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function P(t,e){function r(o,i,c,u){var s=p(t[o],t,i);if("throw"!==s.type){var l=s.arg,f=l.value;return f&&"object"==a(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(f).then((function(t){l.value=t,c(l)}),(function(t){return r("throw",t,c,u)}))}u(s.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function _(e,r,n){var o=y;return function(i,a){if(o===g)throw Error("Generator is already running");if(o===d){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=L(c,n);if(u){if(u===b)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=g;var s=p(e,r,n);if("normal"===s.type){if(o=n.done?d:v,s.arg===b)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=d,n.method="throw",n.arg=s.arg)}}}function L(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,L(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var i=p(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,b;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,b):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[u];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(a(e)+" is not iterable")}return w.prototype=S,o(x,"constructor",{value:S,configurable:!0}),o(S,"constructor",{value:w,configurable:!0}),w.displayName=f(S,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,S):(t.__proto__=S,f(t,l,"GeneratorFunction")),t.prototype=Object.create(x),t},e.awrap=function(t){return{__await:t}},O(P.prototype),f(P.prototype,s,(function(){return this})),e.AsyncIterator=P,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new P(h(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},O(x),f(x,l,"Generator"),f(x,u,(function(){return this})),f(x,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,I.prototype={constructor:I,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(A),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,b):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),A(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;A(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),b}},e}function u(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function s(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){u(i,n,o,a,c,"next",t)}function c(t){u(i,n,o,a,c,"throw",t)}a(void 0)}))}}function l(t){var e="function"==typeof Map?new Map:void 0;return l=function(t){if(null===t||!function(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(e){return"function"==typeof t}}(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return function(t,e,r){if(f())return Reflect.construct.apply(null,arguments);var n=[null];n.push.apply(n,e);var o=new(t.bind.apply(t,n));return r&&h(o,r.prototype),o}(t,arguments,p(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),h(r,t)},l(t)}function f(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(f=function(){return!!t})()}function h(t,e){return h=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},h(t,e)}function p(t){return p=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},p(t)}var y=function(t){function e(t,r,n){var o;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(o=function(t,e,r){return e=p(e),function(t,e){if(e&&("object"==a(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}(t,f()?Reflect.construct(e,r||[],p(t).constructor):e.apply(t,r))}(this,e,["".concat(t," returned ").concat(r," ").concat(n)])).name="HTTPRequestError",o.url=t,o.status=r,o.statusText=n,o}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&h(t,e)}(e,t),r=e,Object.defineProperty(r,"prototype",{writable:!1}),r;var r}(l(Error));function v(t){return new Promise(function(){var e=s(c().mark((function e(r,n){return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.debug("Loading ".concat(t)),fetch(t,{cache:"no-cache"}).then(function(){var e=s(c().mark((function e(n){var o,i,a,u,s,l,f,h,p,v,g,d;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!1!==n.ok){e.next=2;break}throw new y(t,n.status,n.statusText);case 2:o=n.body.getReader(),i=+n.headers.get("Content-Length"),a=0,u=[];case 6:return e.next=9,o.read();case 9:if(s=e.sent,l=s.done,f=s.value,!l){e.next=14;break}return e.abrupt("break",19);case 14:u.push(f),a+=f.length,console.debug("Received ".concat(a,"B of ").concat(i,"B")),e.next=6;break;case 19:for(h=new Uint8Array(a),p=0,v=0,g=u;v<g.length;v++)d=g[v],h.set(d,p),p+=d.length;r(h);case 23:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(t){n(t)}));case 2:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}())}function g(t){return new Promise(function(){var e=s(c().mark((function e(r,n){var o;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(o=new FileReader).onload=function(t){r(new Uint8Array(t.target.result))},o.onerror=function(){n(o.error)},o.readAsArrayBuffer(t);case 4:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}())}var d=r(81219),b=r.n(d);function m(t){return m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},m(t)}function w(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,S(n.key),n)}}function S(t){var e=function(t){if("object"!=m(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=m(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==m(e)?e:e+""}const T=function(){return t=function t(e,r,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.lt=e,this.lt.fid=r,this.lt.filePath=n,this.lt.fileName=n.split("/").pop(),this.childIds=[]},(e=[{key:"addChildId",value:function(t){this.childIds.push(t)}},{key:"getLineNo",value:function(){return this.lt.lineno}},{key:"getfName",value:function(){return this.lt.lineno}},{key:"setFuncName",value:function(t){t.includes("def")?this.lt.funcName=t.split("def ")[1].split("(")[0]:this.lt.funcName=t}},{key:"getFuncName",value:function(){return this.lt.funcName}},{key:"getFilePath",value:function(){return this.lt.filePath}},{key:"getFileName",value:function(){return this.lt.fileName}},{key:"getId",value:function(){return this.lt.id}},{key:"getfId",value:function(){return this.lt.fid}},{key:"getVariables",value:function(){return this.lt.variables}},{key:"getType",value:function(){return this.lt.type}},{key:"getSyntax",value:function(){return this.lt.syntax}},{key:"containsChild",value:function(t){return this.childIds.includes(t)}}])&&w(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function k(t){return k="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},k(t)}function E(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,x(n.key),n)}}function x(t){var e=function(t){if("object"!=k(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=k(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==k(e)?e:e+""}const O=function(){return t=function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t);var r=b().parse(e);this.fileTree=r,this.logTypeMap={},this.extractLogTypeMap()},(e=[{key:"extractLogTypeMap",value:function(){var t=this;this.logTypeMap[0]=new T({type:"root",id:0,syntax:"<module>",children:[],siblings:[]},0,""),Object.keys(this.fileTree).forEach((function(e,r){t.processSST(t.fileTree[e].sst,0,e)})),Object.keys(this.logTypeMap).forEach((function(e,r){var n=t.logTypeMap[e];t.logTypeMap[n.getfId()].addChildId(n.getId())}))}},{key:"processSST",value:function(t,e,r){var n=this;t.children.concat(t.siblings).forEach((function(t,o){switch(t.type){case"function":n.logTypeMap[t.id]=new T(t,t.id,r),n.logTypeMap[t.id].setFuncName(n.logTypeMap[t.id].getSyntax()),n.processSST(t,t.id,r);break;case"root":n.logTypeMap[t.id]=new T(t,e,r),n.logTypeMap[t.id].setFuncName(n.logTypeMap[e].getSyntax()),n.processSST(t,e,r);break;case"child":n.logTypeMap[t.id]=new T(t,e,r),n.logTypeMap[t.id].setFuncName(n.logTypeMap[e].getSyntax());break;default:console.debug("Unknown SST Node Type:".concat(t.type))}}))}},{key:"getSourceFiles",value:function(){var t=this,e={};return Object.keys(this.fileTree).forEach((function(r,n){e[r]=t.fileTree[r].source})),e}}])&&E(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function P(t){return P="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},P(t)}function _(t){return function(t){if(Array.isArray(t))return t}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return L(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?L(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function L(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function j(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,A(n.key),n)}}function A(t){var e=function(t){if("object"!=P(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=P(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==P(e)?e:e+""}const I=function(){return t=function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.log=e,this._classifyLogLine()},(e=[{key:"_classifyLogLine",value:function(){var t=this.log[0].split("root ").slice(1).join(" ").trim();switch(t.charAt(0)){case"#":this._processVariable(t);break;case"?":this._processExeception(t);break;case"{":this._processIRHeader(t);break;default:this.type=3,this.lt=parseInt(t)}}},{key:"_processVariable",value:function(t){this.type=1;var e=_(t.slice(2).split(" ")),r=e[0],n=e.slice(1);this.value=n.join(" "),this.lt=parseInt(r)}},{key:"_processExeception",value:function(t){this.type=2;var e=_(t.slice(1).split(" ")),r=e[0],n=e.slice(1);this.value=n.join(" "),this.lt=parseInt(r)}},{key:"_processIRHeader",value:function(t){this.type=4,this.value=t}}])&&j(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function N(t){return N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},N(t)}function F(t){return function(t){if(Array.isArray(t))return M(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return M(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?M(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function M(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function C(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,R(n.key),n)}}function R(t){var e=function(t){if("object"!=N(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=N(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==N(e)?e:e+""}const G=function(){return t=function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.logFile=e,this.execution=[],this.variables={},this.exceptions={},this.header={},this.executionTree={},this.callStacks=[],this._processBody()},e=[{key:"getLogTypeInfoAtPosition",value:function(t){var e=this.execution[t];return this.header.logTypeMap[e]}},{key:"getFunctionLogTypeInfoAtPosition",value:function(t){var e=this.getLogTypeInfoAtPosition(t).getfId();return this.header.logTypeMap[e]}},{key:"getFunctionOfLogType",value:function(t){var e=this.header.logTypeMap[t].getfId();return this.header.logTypeMap[e]}},{key:"getCallStackAtPosition",value:function(t){var e=this,r=this.callStacks[t],n=[];return r.forEach((function(t,r){var o=e.getLogTypeInfoAtPosition(t),i=e.exceptions[t];n.push({functionName:o.getFuncName(),filePath:o.getFilePath(),fileName:o.getFileName(),lineno:o.getLineNo(),position:t,exceptions:i})})),n.reverse()}},{key:"getExceptionsAtPosition",value:function(t){return t in this.exceptions?this.exceptions[t]:null}},{key:"getVariableStackAtPosition",value:function(t){for(var e=this,r={},n=this.getFunctionLogTypeInfoAtPosition(t).getfId(),o=this.getLogTypeInfoAtPosition(t),i=o.getId();i!=n&&t>=0;)i=(o=this.getLogTypeInfoAtPosition(t)).getId(),o.getfId()===n&&o.getVariables().forEach((function(n,o){if(!(n in r)&&e.variables[t])try{r[n]=b().parse(e.variables[t][o])}catch(i){r[n]=e.variables[t][o]}})),t--;return r}},{key:"_processBody",value:function(){var t=0;do{var e=new I(this.logFile[t]);switch(e.type){case 4:this.header=new O(e.value),this.callStack=[];break;case 3:this._processExecutionLog(e);break;case 2:t=this._processExceptionLog(e,t);break;case 1:this._processVariableLog(e);break;default:console.error("Invalid CDL line type.")}t++}while(t<this.logFile.length)}},{key:"_processExecutionLog",value:function(t){this.execution.push(t.lt);var e=this.header.logTypeMap[t.lt],r=this.execution.length-1;"function"===e.getType()&&this.callStack.push(r);for(var n=e.getId();this.callStack.length>=1;){var o=this.callStack[this.callStack.length-1];if(this.getLogTypeInfoAtPosition(o).containsChild(n))break;this.callStack.pop()}var i=F(this.callStack).map((function(t){return t-1}));i.push(r),this.callStacks.push(i)}},{key:"_processVariableLog",value:function(t){var e=this.execution.length-1;do{if(this.execution[e]===t.lt)break;e--}while(e>=0);var r=this.variables;r[e]=e in r?[].concat(F(r[e]),[t.value]):[t.value]}},{key:"_processExceptionLog",value:function(t,e){var r=new I(this.logFile[e]).value,n=this.execution.length-1,o=this.exceptions;return o[n]=n in o?[].concat(F(o[n]),[r]):[r],e}}],e&&C(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();function D(t){return D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},D(t)}function V(){V=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var i=e&&e.prototype instanceof d?e:d,a=Object.create(i.prototype),c=new j(n||[]);return o(a,"_invoke",{value:O(t,r,c)}),a}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var h="suspendedStart",p="suspendedYield",y="executing",v="completed",g={};function d(){}function b(){}function m(){}var w={};s(w,a,(function(){return this}));var S=Object.getPrototypeOf,T=S&&S(S(A([])));T&&T!==r&&n.call(T,a)&&(w=T);var k=m.prototype=d.prototype=Object.create(w);function E(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,e){function r(o,i,a,c){var u=f(t[o],t,i);if("throw"!==u.type){var s=u.arg,l=s.value;return l&&"object"==D(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(l).then((function(t){s.value=t,a(s)}),(function(t){return r("throw",t,a,c)}))}c(u.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function O(e,r,n){var o=h;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===v){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=P(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var s=f(e,r,n);if("normal"===s.type){if(o=n.done?v:p,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=v,n.method="throw",n.arg=s.arg)}}}function P(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,P(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=f(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function _(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function L(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(_,this),this.reset(!0)}function A(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(D(e)+" is not iterable")}return b.prototype=m,o(k,"constructor",{value:m,configurable:!0}),o(m,"constructor",{value:b,configurable:!0}),b.displayName=s(m,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,s(t,u,"GeneratorFunction")),t.prototype=Object.create(k),t},e.awrap=function(t){return{__await:t}},E(x.prototype),s(x.prototype,c,(function(){return this})),e.AsyncIterator=x,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new x(l(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(k),s(k,u,"Generator"),s(k,a,(function(){return this})),s(k,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=A,j.prototype={constructor:j,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(L),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),L(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;L(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:A(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function B(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function U(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,K(n.key),n)}}function K(t){var e=function(t){if("object"!=D(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=D(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==D(e)?e:e+""}const $=function(){return t=function t(e){var r,o=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),(r=e,new Promise(function(){var t=s(c().mark((function t(e,n){return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r instanceof File?g(r).then((function(t){e(t)})).catch((function(t){n(t)})):"string"==typeof r?v(r).then((function(t){e(t)})).catch((function(t){n(t)})):n(new Error("Invalid file"));case 1:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}())).then(function(){var t,e=(t=V().mark((function t(e){var r,i,a;return V().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,n.A)();case 2:r=t.sent,i=new r.ClpStreamReader(e,{}),a=i.decodeRange(0,i.deserializeStream(),!1),o.parseLogAndInitializeDebugger(a);case 6:case"end":return t.stop()}}),t)})),function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){B(i,n,o,a,c,"next",t)}function c(t){B(i,n,o,a,c,"throw",t)}a(void 0)}))});return function(t){return e.apply(this,arguments)}}())},(e=[{key:"parseLogAndInitializeDebugger",value:function(t){this.cdl=new G(t),console.info(this.cdl),postMessage({code:i.GET_METADATA,args:{fileTree:this.cdl.header.getSourceFiles()}}),this.getPositionData(this.cdl.execution.length-1)}},{key:"getPositionData",value:function(t){var e=this.cdl.execution[t],r=this.cdl.header.logTypeMap[e],n=this.cdl.getCallStackAtPosition(t),o=this.cdl.getExceptionsAtPosition(t);postMessage({code:i.GET_POSITION_DATA,args:{currLtInfo:r,callStack:n,exceptions:o}})}},{key:"getVariableStack",value:function(t){var e=this.cdl.getVariableStackAtPosition(t);postMessage({code:i.GET_VARIABLE_STACK,args:{variableStack:e}})}},{key:"goToStart",value:function(){this.getPositionData(0)}},{key:"goToEnd",value:function(){this.getPositionData(this.cdl.execution.length-1)}},{key:"stepInto",value:function(t){if(!(t+1>=this.cdl.execution.length)){var e=this.cdl.getCallStackAtPosition(t+1);this.getPositionData(e[0].position)}}},{key:"stepOut",value:function(t){var e=this.cdl.getCallStackAtPosition(t);e.length<=1||this.getPositionData(e[1].position)}},{key:"stepOverForward",value:function(t){if(!(t+1>=this.cdl.execution.length)){for(var e=t,r=this.cdl.getCallStackAtPosition(t);++t<this.cdl.execution.length;){var n=this.cdl.getCallStackAtPosition(t);if(r.length>=n.length)return void this.getPositionData(t)}this.getPositionData(e+1)}}},{key:"stepOverBackward",value:function(t){if(!(t-1<0)){for(var e=t,r=this.cdl.getCallStackAtPosition(t);--t>=0;){var n=this.cdl.getCallStackAtPosition(t);if(r.length>=n.length)return void this.getPositionData(t)}this.getPositionData(e-1)}}}])&&U(t.prototype,e),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e}();var z;onmessage=function(t){switch(t.data.code){case i.LOAD_FILE:try{z=new $(t.data.fileInfo)}catch(t){console.error(t)}break;case i.GET_VARIABLE_STACK:try{z.getVariableStack(t.data.args.position)}catch(t){console.error(t)}break;case i.STEP_INTO:try{z.stepInto(t.data.args.position)}catch(t){console.error(t)}break;case i.STEP_OUT:try{z.stepOut(t.data.args.position)}catch(t){console.error(t)}break;case i.STEP_OVER_FORWARD:try{z.stepOverForward(t.data.args.position)}catch(t){console.error(t)}break;case i.STEP_OVER_BACKWARD:try{z.stepOverBackward(t.data.args.position)}catch(t){console.error(t)}break;case i.GO_TO_START:try{z.goToStart()}catch(t){console.error(t)}break;case i.GO_TO_END:try{z.goToEnd()}catch(t){console.error(t)}}},onerror=function(t){console.debug(t)}}},n={};function o(t){var e=n[t];if(void 0!==e)return e.exports;var i=n[t]={id:t,exports:{}};return r[t].call(i.exports,i,i.exports,o),i.exports}o.m=r,o.x=()=>{var t=o.O(void 0,[96],(()=>o(46100)));return o.O(t)},o.amdO={},t=[],o.O=(e,r,n,i)=>{if(!r){var a=1/0;for(l=0;l<t.length;l++){for(var[r,n,i]=t[l],c=!0,u=0;u<r.length;u++)(!1&i||a>=i)&&Object.keys(o.O).every((t=>o.O[t](r[u])))?r.splice(u--,1):(c=!1,i<a&&(a=i));if(c){t.splice(l--,1);var s=n();void 0!==s&&(e=s)}}return e}i=i||0;for(var l=t.length;l>0&&t[l-1][2]>i;l--)t[l]=t[l-1];t[l]=[r,n,i]},o.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return o.d(e,{a:e}),e},o.d=(t,e)=>{for(var r in e)o.o(e,r)&&!o.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},o.f={},o.e=t=>Promise.all(Object.keys(o.f).reduce(((e,r)=>(o.f[r](t,e),e)),[])),o.u=t=>"vendors.a157fb703438065ecfee.bundle.js",o.miniCssF=t=>{},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),o.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.j=100,(()=>{var t;o.g.importScripts&&(t=o.g.location+"");var e=o.g.document;if(!t&&e&&(e.currentScript&&"SCRIPT"===e.currentScript.tagName.toUpperCase()&&(t=e.currentScript.src),!t)){var r=e.getElementsByTagName("script");if(r.length)for(var n=r.length-1;n>-1&&(!t||!/^http(s?):/.test(t));)t=r[n--].src}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=t})(),(()=>{o.b=self.location+"";var t={100:1};o.f.i=(e,r)=>{t[e]||importScripts(o.p+o.u(e))};var e=self.webpackChunkdiagnostic_log_viewer=self.webpackChunkdiagnostic_log_viewer||[],r=e.push.bind(e);e.push=e=>{var[n,i,a]=e;for(var c in i)o.o(i,c)&&(o.m[c]=i[c]);for(a&&a(o);n.length;)t[n.pop()]=1;r(e)}})(),o.nc=void 0,e=o.x,o.x=()=>o.e(96).then(e),o.x()})();
//# sourceMappingURL=100.04c8b58cadf213fa4847.bundle.js.map