/*! For license information please see Production.js.LICENSE.txt */
(()=>{"use strict";var t={877:()=>{function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){e=function(){return r};var n,r={},o=Object.prototype,a=o.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},c="function"==typeof Symbol?Symbol:{},s=c.iterator||"@@iterator",l=c.asyncIterator||"@@asyncIterator",u=c.toStringTag||"@@toStringTag";function d(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{d({},"")}catch(n){d=function(t,e,n){return t[e]=n}}function p(t,e,n,r){var o=e&&e.prototype instanceof g?e:g,a=Object.create(o.prototype),c=new N(r||[]);return i(a,"_invoke",{value:C(t,n,c)}),a}function f(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}r.wrap=p;var m="suspendedStart",h="suspendedYield",v="executing",y="completed",b={};function g(){}function w(){}function x(){}var E={};d(E,s,(function(){return this}));var L=Object.getPrototypeOf,A=L&&L(L(M([])));A&&A!==o&&a.call(A,s)&&(E=A);var P=x.prototype=g.prototype=Object.create(E);function T(t){["next","throw","return"].forEach((function(e){d(t,e,(function(t){return this._invoke(e,t)}))}))}function k(e,n){function r(o,i,c,s){var l=f(e[o],e,i);if("throw"!==l.type){var u=l.arg,d=u.value;return d&&"object"==t(d)&&a.call(d,"__await")?n.resolve(d.__await).then((function(t){r("next",t,c,s)}),(function(t){r("throw",t,c,s)})):n.resolve(d).then((function(t){u.value=t,c(u)}),(function(t){return r("throw",t,c,s)}))}s(l.arg)}var o;i(this,"_invoke",{value:function(t,e){function a(){return new n((function(n,o){r(t,e,n,o)}))}return o=o?o.then(a,a):a()}})}function C(t,e,r){var o=m;return function(a,i){if(o===v)throw Error("Generator is already running");if(o===y){if("throw"===a)throw i;return{value:n,done:!0}}for(r.method=a,r.arg=i;;){var c=r.delegate;if(c){var s=O(c,r);if(s){if(s===b)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===m)throw o=y,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=v;var l=f(t,e,r);if("normal"===l.type){if(o=r.done?y:h,l.arg===b)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(o=y,r.method="throw",r.arg=l.arg)}}}function O(t,e){var r=e.method,o=t.iterator[r];if(o===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=n,O(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),b;var a=f(o,t.iterator,e.arg);if("throw"===a.type)return e.method="throw",e.arg=a.arg,e.delegate=null,b;var i=a.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,b):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,b)}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function S(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function M(e){if(e||""===e){var r=e[s];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function t(){for(;++o<e.length;)if(a.call(e,o))return t.value=e[o],t.done=!1,t;return t.value=n,t.done=!0,t};return i.next=i}}throw new TypeError(t(e)+" is not iterable")}return w.prototype=x,i(P,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:w,configurable:!0}),w.displayName=d(x,u,"GeneratorFunction"),r.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,d(t,u,"GeneratorFunction")),t.prototype=Object.create(P),t},r.awrap=function(t){return{__await:t}},T(k.prototype),d(k.prototype,l,(function(){return this})),r.AsyncIterator=k,r.async=function(t,e,n,o,a){void 0===a&&(a=Promise);var i=new k(p(t,e,n,o),a);return r.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},T(P),d(P,u,"Generator"),d(P,s,(function(){return this})),d(P,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},r.values=M,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(S),!t)for(var e in this)"t"===e.charAt(0)&&a.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,o){return c.type="throw",c.arg=t,e.next=r,o&&(e.method="next",e.arg=n),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var s=a.call(i,"catchLoc"),l=a.call(i,"finallyLoc");if(s&&l){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&a.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var o=r;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,b):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),S(n),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;S(n)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:M(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),b}},r}function n(t,e,n,r,o,a,i){try{var c=t[a](i),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,o)}function r(t){return function(){var e=this,r=arguments;return new Promise((function(o,a){var i=t.apply(e,r);function c(t){n(i,o,a,c,s,"next",t)}function s(t){n(i,o,a,c,s,"throw",t)}c(void 0)}))}}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,i(r.key),r)}}function a(t,e,n){return(e=i(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(e){var n=function(e,n){if("object"!=t(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,n||"default");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(e)}(e,"string");return"symbol"==t(n)?n:n+""}var c=function(){return t=function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)},n=null,a=[{key:"confirmDialog",value:(u=r(e().mark((function t(n,r){var o,a,i,c,s,l,u;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=document.createElement("dialog"),a=document.createElement("h4"),i=document.createElement("div"),c=document.createElement("div"),s=document.createElement("button"),l=document.createElement("button"),o.setAttribute("id","inputDialog"),a.setAttribute("id","title"),i.setAttribute("id","message"),c.setAttribute("id","divButtons"),s.setAttribute("id","btnOk"),s.innerText="OK",l.setAttribute("id","btnCancel"),l.innerText="Cancel",c.append(s,l),o.append(a,i,c),$("body").prepend(o),u={operation:0},t.abrupt("return",new Promise((function(t){o.open||(o.showModal(),a.innerText=n,i.innerHTML=r,s.addEventListener("click",(function(){o.close(),$(o).remove(),u.operation=1,t(u)})),l.addEventListener("click",(function(){o.close(),$(o).remove(),u.operation=0,t(u)})))})));case 19:case"end":return t.stop()}}),t)}))),function(t,e){return u.apply(this,arguments)})},{key:"changePasswordDialog",value:(l=r(e().mark((function t(n,r){var o,a,i,c,s,l,u,d,p,f,m;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=document.createElement("dialog"),a=document.createElement("h4"),i=document.createElement("div"),c=document.createElement("form"),s=document.createElement("input"),l=document.createElement("input"),u=document.createElement("div"),d=document.createElement("button"),p=document.createElement("button"),f=document.createElement("div"),s.setAttribute("class","form-control mb-3"),l.setAttribute("class","form-control"),o.setAttribute("id","inputDialog"),a.setAttribute("id","title"),i.setAttribute("id","message"),u.setAttribute("id","divButtons"),d.setAttribute("id","btnSave"),d.innerText="Save",p.setAttribute("id","btnCancel"),p.innerText="Cancel",s.setAttribute("type","password"),s.setAttribute("placeholder","New Password"),s.setAttribute("id","newPassword"),l.setAttribute("type","password"),l.setAttribute("placeholder","Confirm Password"),l.setAttribute("id","confirmPassword"),f.setAttribute("id","errorMessage"),f.style.color="red",c.append(s,l,f),u.append(d,p),o.append(a,i,c,u),document.body.prepend(o),m={operation:0,newPassword:null},t.abrupt("return",new Promise((function(t){function e(){var t=s.value.trim(),e=l.value.trim();t!==e&&e.length>0?f.innerText="Passwords do not match.":/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(t)?f.innerText="":f.innerText="Password must be at least 8 characters \nand include both letters and numbers."}o.showModal(),a.innerText=n,i.innerHTML=r,d.addEventListener("click",(function(){var e=s.value.trim();e===l.value.trim()?(o.close(),$(o).remove(),m.operation=1,m.newPassword=e,t(m)):f.innerText="Passwords do not match. Please try again."})),p.addEventListener("click",(function(){o.close(),$(o).remove(),t(m)})),s.addEventListener("input",e),l.addEventListener("input",e)})));case 34:case"end":return t.stop()}}),t)}))),function(t,e){return l.apply(this,arguments)})},{key:"showCropModal",value:(s=r(e().mark((function t(n,r,o,a){var i,c;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(i=document.createElement("dialog")).setAttribute("id","messageDialog"),i.style.width="700px",i.style.padding="20px",i.style.textAlign="center",i.style.borderRadius="0.5rem",a.sort((function(t,e){return e.totalAreaPlanted-t.totalAreaPlanted})),i.innerHTML='\n        <div class="container-fluid">\n            <ul class="nav nav-tabs d-flex justify-content-around w-100" style="border-bottom: 2px solid #007bff;">\n                <li class="nav-item w-50">\n                    <a class="nav-link active bg-white text-center w-100" id="cropInfoTab" href="#" style="font-weight: bold; color: #28a745;">Crop Information</a>\n                </li>\n                <li class="nav-item w-50">\n                    <a class="nav-link bg-white text-center w-100" id="varietyTab" href="#" style="font-weight: bold; color: #6c757d;">Variety</a>\n                </li>\n            </ul>\n            <div class="tab-content">\n                <div class="tab-pane fade show active bg-transparent" id="cropInfoContent" style="text-align: justify; font-size: 0.9rem; margin-top: 15px;">\n                    <div class="text-center">\n                        <div style="background-color: #C9AF94; color: white; padding: 10px; border-radius: 8px; font-weight: bold; font-size: 1.5rem; margin-bottom: 15px;">\n                            '.concat(o,'\n                        </div>\n                        <img id="cropImg" src="').concat(n,'" alt="Crop Image" class="img-fluid border border-primary rounded" style="width: 30rem; height: auto; margin-bottom: 10px;">\n                    </div>\n    \n                    <div class="text-dark mt-2">').concat(r,'</div>\n                </div>\n                <div class="tab-pane fade bg-transparent" id="varietyContent" style="text-align: justify; font-size: 0.9rem; color: #333;">\n                    <div class="accordion" id="varietyAccordion">\n                        ').concat(a.map((function(t,e){return'\n                        <div class="accordion-item">\n                            <h2 class="accordion-header" id="heading'.concat(e,'">\n                                <button class="bg-success accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse').concat(e,'" aria-expanded="false" aria-controls="collapse').concat(e,'">\n                                    ').concat(t.varietyName," (Total Area Planted: ").concat(t.totalAreaPlanted,')\n                                </button>\n                            </h2>\n                            <div id="collapse').concat(e,'" class="accordion-collapse collapse" aria-labelledby="heading').concat(e,'" data-bs-parent="#varietyAccordion">\n                                <div class="accordion-body">\n                                    <img src="').concat(t.cropImg,'" alt="').concat(t.varietyName,' Image" class="img-fluid border border-primary rounded" style="width: 20rem; height: auto; margin-bottom: 10px;">\n                                    <p><strong>Characteristics:</strong></p>\n                                    <p><strong>Color:</strong> ').concat(t.color,"</p>\n                                    <p><strong>Size:</strong> ").concat(t.size,"</p>\n                                    <p><strong>Flavor:</strong> ").concat(t.flavor,"</p>\n                                    <p><strong>Growth Conditions:</strong> ").concat(t.growthConditions,"</p>\n                                    <p><strong>Pest/Disease Resistance:</strong> ").concat(t.pestDiseaseResistance,"</p>\n                                    <p><strong>Recommended Practices:</strong> ").concat(t.recommendedPractices,"</p>\n                                </div>\n                            </div>\n                        </div>\n                        ")})).join(""),'\n                    </div>\n                </div>\n            </div>\n            <div class="d-flex justify-content-center mt-3">\n                <button id="btnClose" class="btn btn-danger" style="font-weight: bold;">Close</button>\n            </div>\n        </div>\n        '),document.body.append(i),c={operation:0},t.abrupt("return",new Promise((function(t){if(!i.open){i.showModal();var e=i.querySelector("#cropInfoContent"),n=i.querySelector("#varietyContent");i.querySelector(".nav-tabs").addEventListener("click",(function(t){var r=t.target;"cropInfoTab"===r.id?(e.classList.add("show","active"),n.classList.remove("show","active"),r.style.color="#28a745",i.querySelector("#varietyTab").style.color="#6c757d"):"varietyTab"===r.id&&(n.classList.add("show","active"),e.classList.remove("show","active"),r.style.color="#28a745",i.querySelector("#cropInfoTab").style.color="#6c757d")})),i.querySelector("#btnClose").addEventListener("click",(function(){i.close(),i.remove(),c.operation=1,t(c)}))}})));case 11:case"end":return t.stop()}}),t)}))),function(t,e,n,r){return s.apply(this,arguments)})},{key:"downloadDialog",value:(c=r(e().mark((function t(){var n,r,o,a,i,c,s,l,u,d;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=document.createElement("dialog"),r=document.createElement("div"),o=document.createElement("h5"),a=document.createElement("div"),i=document.createElement("button"),c=document.createElement("button"),s=document.createElement("button"),l=document.createElement("button"),n.setAttribute("id","downloadModal"),n.setAttribute("role","dialog"),n.setAttribute("aria-labelledby","downloadModalLabel"),n.style.padding="20px",n.style.borderRadius="8px",n.style.maxWidth="400px",n.style.boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)",o.className="modal-title text-center mb-4",o.id="downloadModalLabel",o.innerText="Download Options",l.type="button",l.innerText="Close",l.className="dialog-close btn btn-secondary",l.style.width="100%",l.addEventListener("click",(function(){n.close()})),i.className="btn btn-primary mb-3",i.innerHTML='<i class="fas fa-file-csv"></i> Download CSV',i.setAttribute("data-format","csv"),i.style.width="100%",c.className="btn btn-success mb-3",c.innerHTML='<i class="fas fa-file-excel"></i> Download Excel',c.setAttribute("data-format","xlsx"),c.style.width="100%",s.className="btn btn-danger mb-3",s.innerHTML='<i class="fas fa-file-pdf"></i> Download PDF',s.setAttribute("data-format","pdf"),s.style.width="100%",d=new Promise((function(t){u=t})),[i,c,s].forEach((function(t){t.addEventListener("click",(function(t){var e=t.currentTarget.getAttribute("data-format");u&&u(e),n.close()}))})),a.className="d-grid gap-3",a.append(i,c,s,l),r.className="text-center",r.append(o,a),n.appendChild(r),document.body.appendChild(n),n.showModal(),t.abrupt("return",d);case 45:case"end":return t.stop()}}),t)}))),function(){return c.apply(this,arguments)})},{key:"showInfoModal",value:(i=r(e().mark((function t(n){var r,o,a,i,c;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=document.createElement("dialog"),o=document.createElement("div"),a=document.createElement("button"),i=document.createElement("div"),r.setAttribute("id","messageDialog"),a.setAttribute("id","btnClose"),a.innerText="Close",r.style.maxWidth="1000px",r.style.padding="20px",r.style.fontSize="1em",r.style.textAlign="justify",r.style.margin="20px",o.style.display="flex",o.style.flexDirection="column",o.style.alignItems="center",o.style.gap="20px",o.style.margin="20px",o.innerHTML=n,i.style.display="flex",i.style.justifyContent="flex-end",i.append(a),o.append(i),r.append(o),document.body.append(r),c={operation:0},t.abrupt("return",new Promise((function(t){r.open||(r.showModal(),a.addEventListener("click",(function(){r.close(),r.remove(),c.operation=1,t(c)})))})));case 26:case"end":return t.stop()}}),t)}))),function(t){return i.apply(this,arguments)})}],n&&o(t.prototype,n),a&&o(t,a),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,n,a,i,c,s,l,u}();a(c,"OK_OPTION",1),a(c,"CANCEL_OPTION",0)}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var a=e[r]={exports:{}};return t[r](a,a.exports,n),a.exports}n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);n(877)})();