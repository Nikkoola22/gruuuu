(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();var Xa={exports:{}},ni={},Ya={exports:{}},R={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Jt=Symbol.for("react.element"),cd=Symbol.for("react.portal"),pd=Symbol.for("react.fragment"),md=Symbol.for("react.strict_mode"),fd=Symbol.for("react.profiler"),vd=Symbol.for("react.provider"),gd=Symbol.for("react.context"),hd=Symbol.for("react.forward_ref"),yd=Symbol.for("react.suspense"),Ed=Symbol.for("react.memo"),xd=Symbol.for("react.lazy"),Fo=Symbol.iterator;function Sd(e){return e===null||typeof e!="object"?null:(e=Fo&&e[Fo]||e["@@iterator"],typeof e=="function"?e:null)}var Za={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},el=Object.assign,nl={};function ot(e,n,t){this.props=e,this.context=n,this.refs=nl,this.updater=t||Za}ot.prototype.isReactComponent={};ot.prototype.setState=function(e,n){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,n,"setState")};ot.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function tl(){}tl.prototype=ot.prototype;function Us(e,n,t){this.props=e,this.context=n,this.refs=nl,this.updater=t||Za}var Vs=Us.prototype=new tl;Vs.constructor=Us;el(Vs,ot.prototype);Vs.isPureReactComponent=!0;var Mo=Array.isArray,rl=Object.prototype.hasOwnProperty,Hs={current:null},il={key:!0,ref:!0,__self:!0,__source:!0};function sl(e,n,t){var r,i={},s=null,o=null;if(n!=null)for(r in n.ref!==void 0&&(o=n.ref),n.key!==void 0&&(s=""+n.key),n)rl.call(n,r)&&!il.hasOwnProperty(r)&&(i[r]=n[r]);var a=arguments.length-2;if(a===1)i.children=t;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];i.children=l}if(e&&e.defaultProps)for(r in a=e.defaultProps,a)i[r]===void 0&&(i[r]=a[r]);return{$$typeof:Jt,type:e,key:s,ref:o,props:i,_owner:Hs.current}}function jd(e,n){return{$$typeof:Jt,type:e.type,key:n,ref:e.ref,props:e.props,_owner:e._owner}}function Bs(e){return typeof e=="object"&&e!==null&&e.$$typeof===Jt}function Ld(e){var n={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(t){return n[t]})}var bo=/\/+/g;function xi(e,n){return typeof e=="object"&&e!==null&&e.key!=null?Ld(""+e.key):n.toString(36)}function Er(e,n,t,r,i){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Jt:case cd:o=!0}}if(o)return o=e,i=i(o),e=r===""?"."+xi(o,0):r,Mo(i)?(t="",e!=null&&(t=e.replace(bo,"$&/")+"/"),Er(i,n,t,"",function(c){return c})):i!=null&&(Bs(i)&&(i=jd(i,t+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(bo,"$&/")+"/")+e)),n.push(i)),1;if(o=0,r=r===""?".":r+":",Mo(e))for(var a=0;a<e.length;a++){s=e[a];var l=r+xi(s,a);o+=Er(s,n,t,l,i)}else if(l=Sd(e),typeof l=="function")for(e=l.call(e),a=0;!(s=e.next()).done;)s=s.value,l=r+xi(s,a++),o+=Er(s,n,t,l,i);else if(s==="object")throw n=String(e),Error("Objects are not valid as a React child (found: "+(n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n)+"). If you meant to render a collection of children, use an array instead.");return o}function tr(e,n,t){if(e==null)return e;var r=[],i=0;return Er(e,r,"","",function(s){return n.call(t,s,i++)}),r}function Cd(e){if(e._status===-1){var n=e._result;n=n(),n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var le={current:null},xr={transition:null},wd={ReactCurrentDispatcher:le,ReactCurrentBatchConfig:xr,ReactCurrentOwner:Hs};function ol(){throw Error("act(...) is not supported in production builds of React.")}R.Children={map:tr,forEach:function(e,n,t){tr(e,function(){n.apply(this,arguments)},t)},count:function(e){var n=0;return tr(e,function(){n++}),n},toArray:function(e){return tr(e,function(n){return n})||[]},only:function(e){if(!Bs(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};R.Component=ot;R.Fragment=pd;R.Profiler=fd;R.PureComponent=Us;R.StrictMode=md;R.Suspense=yd;R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=wd;R.act=ol;R.cloneElement=function(e,n,t){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=el({},e.props),i=e.key,s=e.ref,o=e._owner;if(n!=null){if(n.ref!==void 0&&(s=n.ref,o=Hs.current),n.key!==void 0&&(i=""+n.key),e.type&&e.type.defaultProps)var a=e.type.defaultProps;for(l in n)rl.call(n,l)&&!il.hasOwnProperty(l)&&(r[l]=n[l]===void 0&&a!==void 0?a[l]:n[l])}var l=arguments.length-2;if(l===1)r.children=t;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];r.children=a}return{$$typeof:Jt,type:e.type,key:i,ref:s,props:r,_owner:o}};R.createContext=function(e){return e={$$typeof:gd,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:vd,_context:e},e.Consumer=e};R.createElement=sl;R.createFactory=function(e){var n=sl.bind(null,e);return n.type=e,n};R.createRef=function(){return{current:null}};R.forwardRef=function(e){return{$$typeof:hd,render:e}};R.isValidElement=Bs;R.lazy=function(e){return{$$typeof:xd,_payload:{_status:-1,_result:e},_init:Cd}};R.memo=function(e,n){return{$$typeof:Ed,type:e,compare:n===void 0?null:n}};R.startTransition=function(e){var n=xr.transition;xr.transition={};try{e()}finally{xr.transition=n}};R.unstable_act=ol;R.useCallback=function(e,n){return le.current.useCallback(e,n)};R.useContext=function(e){return le.current.useContext(e)};R.useDebugValue=function(){};R.useDeferredValue=function(e){return le.current.useDeferredValue(e)};R.useEffect=function(e,n){return le.current.useEffect(e,n)};R.useId=function(){return le.current.useId()};R.useImperativeHandle=function(e,n,t){return le.current.useImperativeHandle(e,n,t)};R.useInsertionEffect=function(e,n){return le.current.useInsertionEffect(e,n)};R.useLayoutEffect=function(e,n){return le.current.useLayoutEffect(e,n)};R.useMemo=function(e,n){return le.current.useMemo(e,n)};R.useReducer=function(e,n,t){return le.current.useReducer(e,n,t)};R.useRef=function(e){return le.current.useRef(e)};R.useState=function(e){return le.current.useState(e)};R.useSyncExternalStore=function(e,n,t){return le.current.useSyncExternalStore(e,n,t)};R.useTransition=function(){return le.current.useTransition()};R.version="18.3.1";Ya.exports=R;var K=Ya.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Td=K,Nd=Symbol.for("react.element"),Ad=Symbol.for("react.fragment"),Pd=Object.prototype.hasOwnProperty,kd=Td.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Rd={key:!0,ref:!0,__self:!0,__source:!0};function al(e,n,t){var r,i={},s=null,o=null;t!==void 0&&(s=""+t),n.key!==void 0&&(s=""+n.key),n.ref!==void 0&&(o=n.ref);for(r in n)Pd.call(n,r)&&!Rd.hasOwnProperty(r)&&(i[r]=n[r]);if(e&&e.defaultProps)for(r in n=e.defaultProps,n)i[r]===void 0&&(i[r]=n[r]);return{$$typeof:Nd,type:e,key:s,ref:o,props:i,_owner:kd.current}}ni.Fragment=Ad;ni.jsx=al;ni.jsxs=al;Xa.exports=ni;var f=Xa.exports,ll={exports:{}},Ee={},ul={exports:{}},dl={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function n(C,P){var k=C.length;C.push(P);e:for(;0<k;){var B=k-1>>>1,J=C[B];if(0<i(J,P))C[B]=P,C[k]=J,k=B;else break e}}function t(C){return C.length===0?null:C[0]}function r(C){if(C.length===0)return null;var P=C[0],k=C.pop();if(k!==P){C[0]=k;e:for(var B=0,J=C.length,er=J>>>1;B<er;){var yn=2*(B+1)-1,Ei=C[yn],En=yn+1,nr=C[En];if(0>i(Ei,k))En<J&&0>i(nr,Ei)?(C[B]=nr,C[En]=k,B=En):(C[B]=Ei,C[yn]=k,B=yn);else if(En<J&&0>i(nr,k))C[B]=nr,C[En]=k,B=En;else break e}}return P}function i(C,P){var k=C.sortIndex-P.sortIndex;return k!==0?k:C.id-P.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;e.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();e.unstable_now=function(){return o.now()-a}}var l=[],c=[],g=1,v=null,m=3,E=!1,x=!1,S=!1,T=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,u=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function p(C){for(var P=t(c);P!==null;){if(P.callback===null)r(c);else if(P.startTime<=C)r(c),P.sortIndex=P.expirationTime,n(l,P);else break;P=t(c)}}function h(C){if(S=!1,p(C),!x)if(t(l)!==null)x=!0,hi(L);else{var P=t(c);P!==null&&yi(h,P.startTime-C)}}function L(C,P){x=!1,S&&(S=!1,d(A),A=-1),E=!0;var k=m;try{for(p(P),v=t(l);v!==null&&(!(v.expirationTime>P)||C&&!Ne());){var B=v.callback;if(typeof B=="function"){v.callback=null,m=v.priorityLevel;var J=B(v.expirationTime<=P);P=e.unstable_now(),typeof J=="function"?v.callback=J:v===t(l)&&r(l),p(P)}else r(l);v=t(l)}if(v!==null)var er=!0;else{var yn=t(c);yn!==null&&yi(h,yn.startTime-P),er=!1}return er}finally{v=null,m=k,E=!1}}var w=!1,N=null,A=-1,H=5,I=-1;function Ne(){return!(e.unstable_now()-I<H)}function ut(){if(N!==null){var C=e.unstable_now();I=C;var P=!0;try{P=N(!0,C)}finally{P?dt():(w=!1,N=null)}}else w=!1}var dt;if(typeof u=="function")dt=function(){u(ut)};else if(typeof MessageChannel<"u"){var Oo=new MessageChannel,dd=Oo.port2;Oo.port1.onmessage=ut,dt=function(){dd.postMessage(null)}}else dt=function(){T(ut,0)};function hi(C){N=C,w||(w=!0,dt())}function yi(C,P){A=T(function(){C(e.unstable_now())},P)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(C){C.callback=null},e.unstable_continueExecution=function(){x||E||(x=!0,hi(L))},e.unstable_forceFrameRate=function(C){0>C||125<C?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):H=0<C?Math.floor(1e3/C):5},e.unstable_getCurrentPriorityLevel=function(){return m},e.unstable_getFirstCallbackNode=function(){return t(l)},e.unstable_next=function(C){switch(m){case 1:case 2:case 3:var P=3;break;default:P=m}var k=m;m=P;try{return C()}finally{m=k}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(C,P){switch(C){case 1:case 2:case 3:case 4:case 5:break;default:C=3}var k=m;m=C;try{return P()}finally{m=k}},e.unstable_scheduleCallback=function(C,P,k){var B=e.unstable_now();switch(typeof k=="object"&&k!==null?(k=k.delay,k=typeof k=="number"&&0<k?B+k:B):k=B,C){case 1:var J=-1;break;case 2:J=250;break;case 5:J=1073741823;break;case 4:J=1e4;break;default:J=5e3}return J=k+J,C={id:g++,callback:P,priorityLevel:C,startTime:k,expirationTime:J,sortIndex:-1},k>B?(C.sortIndex=k,n(c,C),t(l)===null&&C===t(c)&&(S?(d(A),A=-1):S=!0,yi(h,k-B))):(C.sortIndex=J,n(l,C),x||E||(x=!0,hi(L))),C},e.unstable_shouldYield=Ne,e.unstable_wrapCallback=function(C){var P=m;return function(){var k=m;m=P;try{return C.apply(this,arguments)}finally{m=k}}}})(dl);ul.exports=dl;var Id=ul.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Dd=K,ye=Id;function y(e){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+e,t=1;t<arguments.length;t++)n+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var cl=new Set,It={};function In(e,n){Zn(e,n),Zn(e+"Capture",n)}function Zn(e,n){for(It[e]=n,e=0;e<n.length;e++)cl.add(n[e])}var Ge=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Wi=Object.prototype.hasOwnProperty,qd=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,zo={},Uo={};function _d(e){return Wi.call(Uo,e)?!0:Wi.call(zo,e)?!1:qd.test(e)?Uo[e]=!0:(zo[e]=!0,!1)}function Od(e,n,t,r){if(t!==null&&t.type===0)return!1;switch(typeof n){case"function":case"symbol":return!0;case"boolean":return r?!1:t!==null?!t.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Fd(e,n,t,r){if(n===null||typeof n>"u"||Od(e,n,t,r))return!0;if(r)return!1;if(t!==null)switch(t.type){case 3:return!n;case 4:return n===!1;case 5:return isNaN(n);case 6:return isNaN(n)||1>n}return!1}function ue(e,n,t,r,i,s,o){this.acceptsBooleans=n===2||n===3||n===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=t,this.propertyName=e,this.type=n,this.sanitizeURL=s,this.removeEmptyString=o}var ne={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ne[e]=new ue(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var n=e[0];ne[n]=new ue(n,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){ne[e]=new ue(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ne[e]=new ue(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ne[e]=new ue(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){ne[e]=new ue(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){ne[e]=new ue(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){ne[e]=new ue(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){ne[e]=new ue(e,5,!1,e.toLowerCase(),null,!1,!1)});var $s=/[\-:]([a-z])/g;function Gs(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var n=e.replace($s,Gs);ne[n]=new ue(n,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var n=e.replace($s,Gs);ne[n]=new ue(n,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var n=e.replace($s,Gs);ne[n]=new ue(n,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){ne[e]=new ue(e,1,!1,e.toLowerCase(),null,!1,!1)});ne.xlinkHref=new ue("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){ne[e]=new ue(e,1,!1,e.toLowerCase(),null,!0,!0)});function Qs(e,n,t,r){var i=ne.hasOwnProperty(n)?ne[n]:null;(i!==null?i.type!==0:r||!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(Fd(n,t,i,r)&&(t=null),r||i===null?_d(n)&&(t===null?e.removeAttribute(n):e.setAttribute(n,""+t)):i.mustUseProperty?e[i.propertyName]=t===null?i.type===3?!1:"":t:(n=i.attributeName,r=i.attributeNamespace,t===null?e.removeAttribute(n):(i=i.type,t=i===3||i===4&&t===!0?"":""+t,r?e.setAttributeNS(r,n,t):e.setAttribute(n,t))))}var Ke=Dd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,rr=Symbol.for("react.element"),_n=Symbol.for("react.portal"),On=Symbol.for("react.fragment"),Ws=Symbol.for("react.strict_mode"),Ji=Symbol.for("react.profiler"),pl=Symbol.for("react.provider"),ml=Symbol.for("react.context"),Js=Symbol.for("react.forward_ref"),Ki=Symbol.for("react.suspense"),Xi=Symbol.for("react.suspense_list"),Ks=Symbol.for("react.memo"),Ye=Symbol.for("react.lazy"),fl=Symbol.for("react.offscreen"),Vo=Symbol.iterator;function ct(e){return e===null||typeof e!="object"?null:(e=Vo&&e[Vo]||e["@@iterator"],typeof e=="function"?e:null)}var U=Object.assign,Si;function Et(e){if(Si===void 0)try{throw Error()}catch(t){var n=t.stack.trim().match(/\n( *(at )?)/);Si=n&&n[1]||""}return`
`+Si+e}var ji=!1;function Li(e,n){if(!e||ji)return"";ji=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(n)if(n=function(){throw Error()},Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(n,[])}catch(c){var r=c}Reflect.construct(e,[],n)}else{try{n.call()}catch(c){r=c}e.call(n.prototype)}else{try{throw Error()}catch(c){r=c}e()}}catch(c){if(c&&r&&typeof c.stack=="string"){for(var i=c.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,a=s.length-1;1<=o&&0<=a&&i[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(i[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||i[o]!==s[a]){var l=`
`+i[o].replace(" at new "," at ");return e.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",e.displayName)),l}while(1<=o&&0<=a);break}}}finally{ji=!1,Error.prepareStackTrace=t}return(e=e?e.displayName||e.name:"")?Et(e):""}function Md(e){switch(e.tag){case 5:return Et(e.type);case 16:return Et("Lazy");case 13:return Et("Suspense");case 19:return Et("SuspenseList");case 0:case 2:case 15:return e=Li(e.type,!1),e;case 11:return e=Li(e.type.render,!1),e;case 1:return e=Li(e.type,!0),e;default:return""}}function Yi(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case On:return"Fragment";case _n:return"Portal";case Ji:return"Profiler";case Ws:return"StrictMode";case Ki:return"Suspense";case Xi:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case ml:return(e.displayName||"Context")+".Consumer";case pl:return(e._context.displayName||"Context")+".Provider";case Js:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Ks:return n=e.displayName||null,n!==null?n:Yi(e.type)||"Memo";case Ye:n=e._payload,e=e._init;try{return Yi(e(n))}catch{}}return null}function bd(e){var n=e.type;switch(e.tag){case 24:return"Cache";case 9:return(n.displayName||"Context")+".Consumer";case 10:return(n._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=n.render,e=e.displayName||e.name||"",n.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return n;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Yi(n);case 8:return n===Ws?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n}return null}function mn(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function vl(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function zd(e){var n=vl(e)?"checked":"value",t=Object.getOwnPropertyDescriptor(e.constructor.prototype,n),r=""+e[n];if(!e.hasOwnProperty(n)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var i=t.get,s=t.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(e,n,{enumerable:t.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function ir(e){e._valueTracker||(e._valueTracker=zd(e))}function gl(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var t=n.getValue(),r="";return e&&(r=vl(e)?e.checked?"true":"false":e.value),e=r,e!==t?(n.setValue(e),!0):!1}function Rr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Zi(e,n){var t=n.checked;return U({},n,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??e._wrapperState.initialChecked})}function Ho(e,n){var t=n.defaultValue==null?"":n.defaultValue,r=n.checked!=null?n.checked:n.defaultChecked;t=mn(n.value!=null?n.value:t),e._wrapperState={initialChecked:r,initialValue:t,controlled:n.type==="checkbox"||n.type==="radio"?n.checked!=null:n.value!=null}}function hl(e,n){n=n.checked,n!=null&&Qs(e,"checked",n,!1)}function es(e,n){hl(e,n);var t=mn(n.value),r=n.type;if(t!=null)r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+t):e.value!==""+t&&(e.value=""+t);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}n.hasOwnProperty("value")?ns(e,n.type,t):n.hasOwnProperty("defaultValue")&&ns(e,n.type,mn(n.defaultValue)),n.checked==null&&n.defaultChecked!=null&&(e.defaultChecked=!!n.defaultChecked)}function Bo(e,n,t){if(n.hasOwnProperty("value")||n.hasOwnProperty("defaultValue")){var r=n.type;if(!(r!=="submit"&&r!=="reset"||n.value!==void 0&&n.value!==null))return;n=""+e._wrapperState.initialValue,t||n===e.value||(e.value=n),e.defaultValue=n}t=e.name,t!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,t!==""&&(e.name=t)}function ns(e,n,t){(n!=="number"||Rr(e.ownerDocument)!==e)&&(t==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+t&&(e.defaultValue=""+t))}var xt=Array.isArray;function Qn(e,n,t,r){if(e=e.options,n){n={};for(var i=0;i<t.length;i++)n["$"+t[i]]=!0;for(t=0;t<e.length;t++)i=n.hasOwnProperty("$"+e[t].value),e[t].selected!==i&&(e[t].selected=i),i&&r&&(e[t].defaultSelected=!0)}else{for(t=""+mn(t),n=null,i=0;i<e.length;i++){if(e[i].value===t){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}n!==null||e[i].disabled||(n=e[i])}n!==null&&(n.selected=!0)}}function ts(e,n){if(n.dangerouslySetInnerHTML!=null)throw Error(y(91));return U({},n,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function $o(e,n){var t=n.value;if(t==null){if(t=n.children,n=n.defaultValue,t!=null){if(n!=null)throw Error(y(92));if(xt(t)){if(1<t.length)throw Error(y(93));t=t[0]}n=t}n==null&&(n=""),t=n}e._wrapperState={initialValue:mn(t)}}function yl(e,n){var t=mn(n.value),r=mn(n.defaultValue);t!=null&&(t=""+t,t!==e.value&&(e.value=t),n.defaultValue==null&&e.defaultValue!==t&&(e.defaultValue=t)),r!=null&&(e.defaultValue=""+r)}function Go(e){var n=e.textContent;n===e._wrapperState.initialValue&&n!==""&&n!==null&&(e.value=n)}function El(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function rs(e,n){return e==null||e==="http://www.w3.org/1999/xhtml"?El(n):e==="http://www.w3.org/2000/svg"&&n==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var sr,xl=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(n,t,r,i){MSApp.execUnsafeLocalFunction(function(){return e(n,t,r,i)})}:e}(function(e,n){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=n;else{for(sr=sr||document.createElement("div"),sr.innerHTML="<svg>"+n.valueOf().toString()+"</svg>",n=sr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;n.firstChild;)e.appendChild(n.firstChild)}});function Dt(e,n){if(n){var t=e.firstChild;if(t&&t===e.lastChild&&t.nodeType===3){t.nodeValue=n;return}}e.textContent=n}var Lt={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ud=["Webkit","ms","Moz","O"];Object.keys(Lt).forEach(function(e){Ud.forEach(function(n){n=n+e.charAt(0).toUpperCase()+e.substring(1),Lt[n]=Lt[e]})});function Sl(e,n,t){return n==null||typeof n=="boolean"||n===""?"":t||typeof n!="number"||n===0||Lt.hasOwnProperty(e)&&Lt[e]?(""+n).trim():n+"px"}function jl(e,n){e=e.style;for(var t in n)if(n.hasOwnProperty(t)){var r=t.indexOf("--")===0,i=Sl(t,n[t],r);t==="float"&&(t="cssFloat"),r?e.setProperty(t,i):e[t]=i}}var Vd=U({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function is(e,n){if(n){if(Vd[e]&&(n.children!=null||n.dangerouslySetInnerHTML!=null))throw Error(y(137,e));if(n.dangerouslySetInnerHTML!=null){if(n.children!=null)throw Error(y(60));if(typeof n.dangerouslySetInnerHTML!="object"||!("__html"in n.dangerouslySetInnerHTML))throw Error(y(61))}if(n.style!=null&&typeof n.style!="object")throw Error(y(62))}}function ss(e,n){if(e.indexOf("-")===-1)return typeof n.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var os=null;function Xs(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var as=null,Wn=null,Jn=null;function Qo(e){if(e=Yt(e)){if(typeof as!="function")throw Error(y(280));var n=e.stateNode;n&&(n=oi(n),as(e.stateNode,e.type,n))}}function Ll(e){Wn?Jn?Jn.push(e):Jn=[e]:Wn=e}function Cl(){if(Wn){var e=Wn,n=Jn;if(Jn=Wn=null,Qo(e),n)for(e=0;e<n.length;e++)Qo(n[e])}}function wl(e,n){return e(n)}function Tl(){}var Ci=!1;function Nl(e,n,t){if(Ci)return e(n,t);Ci=!0;try{return wl(e,n,t)}finally{Ci=!1,(Wn!==null||Jn!==null)&&(Tl(),Cl())}}function qt(e,n){var t=e.stateNode;if(t===null)return null;var r=oi(t);if(r===null)return null;t=r[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(t&&typeof t!="function")throw Error(y(231,n,typeof t));return t}var ls=!1;if(Ge)try{var pt={};Object.defineProperty(pt,"passive",{get:function(){ls=!0}}),window.addEventListener("test",pt,pt),window.removeEventListener("test",pt,pt)}catch{ls=!1}function Hd(e,n,t,r,i,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{n.apply(t,c)}catch(g){this.onError(g)}}var Ct=!1,Ir=null,Dr=!1,us=null,Bd={onError:function(e){Ct=!0,Ir=e}};function $d(e,n,t,r,i,s,o,a,l){Ct=!1,Ir=null,Hd.apply(Bd,arguments)}function Gd(e,n,t,r,i,s,o,a,l){if($d.apply(this,arguments),Ct){if(Ct){var c=Ir;Ct=!1,Ir=null}else throw Error(y(198));Dr||(Dr=!0,us=c)}}function Dn(e){var n=e,t=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,n.flags&4098&&(t=n.return),e=n.return;while(e)}return n.tag===3?t:null}function Al(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function Wo(e){if(Dn(e)!==e)throw Error(y(188))}function Qd(e){var n=e.alternate;if(!n){if(n=Dn(e),n===null)throw Error(y(188));return n!==e?null:e}for(var t=e,r=n;;){var i=t.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){t=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===t)return Wo(i),e;if(s===r)return Wo(i),n;s=s.sibling}throw Error(y(188))}if(t.return!==r.return)t=i,r=s;else{for(var o=!1,a=i.child;a;){if(a===t){o=!0,t=i,r=s;break}if(a===r){o=!0,r=i,t=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===t){o=!0,t=s,r=i;break}if(a===r){o=!0,r=s,t=i;break}a=a.sibling}if(!o)throw Error(y(189))}}if(t.alternate!==r)throw Error(y(190))}if(t.tag!==3)throw Error(y(188));return t.stateNode.current===t?e:n}function Pl(e){return e=Qd(e),e!==null?kl(e):null}function kl(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var n=kl(e);if(n!==null)return n;e=e.sibling}return null}var Rl=ye.unstable_scheduleCallback,Jo=ye.unstable_cancelCallback,Wd=ye.unstable_shouldYield,Jd=ye.unstable_requestPaint,$=ye.unstable_now,Kd=ye.unstable_getCurrentPriorityLevel,Ys=ye.unstable_ImmediatePriority,Il=ye.unstable_UserBlockingPriority,qr=ye.unstable_NormalPriority,Xd=ye.unstable_LowPriority,Dl=ye.unstable_IdlePriority,ti=null,Me=null;function Yd(e){if(Me&&typeof Me.onCommitFiberRoot=="function")try{Me.onCommitFiberRoot(ti,e,void 0,(e.current.flags&128)===128)}catch{}}var Ie=Math.clz32?Math.clz32:nc,Zd=Math.log,ec=Math.LN2;function nc(e){return e>>>=0,e===0?32:31-(Zd(e)/ec|0)|0}var or=64,ar=4194304;function St(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function _r(e,n){var t=e.pendingLanes;if(t===0)return 0;var r=0,i=e.suspendedLanes,s=e.pingedLanes,o=t&268435455;if(o!==0){var a=o&~i;a!==0?r=St(a):(s&=o,s!==0&&(r=St(s)))}else o=t&~i,o!==0?r=St(o):s!==0&&(r=St(s));if(r===0)return 0;if(n!==0&&n!==r&&!(n&i)&&(i=r&-r,s=n&-n,i>=s||i===16&&(s&4194240)!==0))return n;if(r&4&&(r|=t&16),n=e.entangledLanes,n!==0)for(e=e.entanglements,n&=r;0<n;)t=31-Ie(n),i=1<<t,r|=e[t],n&=~i;return r}function tc(e,n){switch(e){case 1:case 2:case 4:return n+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function rc(e,n){for(var t=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,s=e.pendingLanes;0<s;){var o=31-Ie(s),a=1<<o,l=i[o];l===-1?(!(a&t)||a&r)&&(i[o]=tc(a,n)):l<=n&&(e.expiredLanes|=a),s&=~a}}function ds(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function ql(){var e=or;return or<<=1,!(or&4194240)&&(or=64),e}function wi(e){for(var n=[],t=0;31>t;t++)n.push(e);return n}function Kt(e,n,t){e.pendingLanes|=n,n!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,n=31-Ie(n),e[n]=t}function ic(e,n){var t=e.pendingLanes&~n;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=n,e.mutableReadLanes&=n,e.entangledLanes&=n,n=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<t;){var i=31-Ie(t),s=1<<i;n[i]=0,r[i]=-1,e[i]=-1,t&=~s}}function Zs(e,n){var t=e.entangledLanes|=n;for(e=e.entanglements;t;){var r=31-Ie(t),i=1<<r;i&n|e[r]&n&&(e[r]|=n),t&=~i}}var q=0;function _l(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Ol,eo,Fl,Ml,bl,cs=!1,lr=[],sn=null,on=null,an=null,_t=new Map,Ot=new Map,en=[],sc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ko(e,n){switch(e){case"focusin":case"focusout":sn=null;break;case"dragenter":case"dragleave":on=null;break;case"mouseover":case"mouseout":an=null;break;case"pointerover":case"pointerout":_t.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ot.delete(n.pointerId)}}function mt(e,n,t,r,i,s){return e===null||e.nativeEvent!==s?(e={blockedOn:n,domEventName:t,eventSystemFlags:r,nativeEvent:s,targetContainers:[i]},n!==null&&(n=Yt(n),n!==null&&eo(n)),e):(e.eventSystemFlags|=r,n=e.targetContainers,i!==null&&n.indexOf(i)===-1&&n.push(i),e)}function oc(e,n,t,r,i){switch(n){case"focusin":return sn=mt(sn,e,n,t,r,i),!0;case"dragenter":return on=mt(on,e,n,t,r,i),!0;case"mouseover":return an=mt(an,e,n,t,r,i),!0;case"pointerover":var s=i.pointerId;return _t.set(s,mt(_t.get(s)||null,e,n,t,r,i)),!0;case"gotpointercapture":return s=i.pointerId,Ot.set(s,mt(Ot.get(s)||null,e,n,t,r,i)),!0}return!1}function zl(e){var n=jn(e.target);if(n!==null){var t=Dn(n);if(t!==null){if(n=t.tag,n===13){if(n=Al(t),n!==null){e.blockedOn=n,bl(e.priority,function(){Fl(t)});return}}else if(n===3&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Sr(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var t=ps(e.domEventName,e.eventSystemFlags,n[0],e.nativeEvent);if(t===null){t=e.nativeEvent;var r=new t.constructor(t.type,t);os=r,t.target.dispatchEvent(r),os=null}else return n=Yt(t),n!==null&&eo(n),e.blockedOn=t,!1;n.shift()}return!0}function Xo(e,n,t){Sr(e)&&t.delete(n)}function ac(){cs=!1,sn!==null&&Sr(sn)&&(sn=null),on!==null&&Sr(on)&&(on=null),an!==null&&Sr(an)&&(an=null),_t.forEach(Xo),Ot.forEach(Xo)}function ft(e,n){e.blockedOn===n&&(e.blockedOn=null,cs||(cs=!0,ye.unstable_scheduleCallback(ye.unstable_NormalPriority,ac)))}function Ft(e){function n(i){return ft(i,e)}if(0<lr.length){ft(lr[0],e);for(var t=1;t<lr.length;t++){var r=lr[t];r.blockedOn===e&&(r.blockedOn=null)}}for(sn!==null&&ft(sn,e),on!==null&&ft(on,e),an!==null&&ft(an,e),_t.forEach(n),Ot.forEach(n),t=0;t<en.length;t++)r=en[t],r.blockedOn===e&&(r.blockedOn=null);for(;0<en.length&&(t=en[0],t.blockedOn===null);)zl(t),t.blockedOn===null&&en.shift()}var Kn=Ke.ReactCurrentBatchConfig,Or=!0;function lc(e,n,t,r){var i=q,s=Kn.transition;Kn.transition=null;try{q=1,no(e,n,t,r)}finally{q=i,Kn.transition=s}}function uc(e,n,t,r){var i=q,s=Kn.transition;Kn.transition=null;try{q=4,no(e,n,t,r)}finally{q=i,Kn.transition=s}}function no(e,n,t,r){if(Or){var i=ps(e,n,t,r);if(i===null)_i(e,n,r,Fr,t),Ko(e,r);else if(oc(i,e,n,t,r))r.stopPropagation();else if(Ko(e,r),n&4&&-1<sc.indexOf(e)){for(;i!==null;){var s=Yt(i);if(s!==null&&Ol(s),s=ps(e,n,t,r),s===null&&_i(e,n,r,Fr,t),s===i)break;i=s}i!==null&&r.stopPropagation()}else _i(e,n,r,null,t)}}var Fr=null;function ps(e,n,t,r){if(Fr=null,e=Xs(r),e=jn(e),e!==null)if(n=Dn(e),n===null)e=null;else if(t=n.tag,t===13){if(e=Al(n),e!==null)return e;e=null}else if(t===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null);return Fr=e,null}function Ul(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Kd()){case Ys:return 1;case Il:return 4;case qr:case Xd:return 16;case Dl:return 536870912;default:return 16}default:return 16}}var tn=null,to=null,jr=null;function Vl(){if(jr)return jr;var e,n=to,t=n.length,r,i="value"in tn?tn.value:tn.textContent,s=i.length;for(e=0;e<t&&n[e]===i[e];e++);var o=t-e;for(r=1;r<=o&&n[t-r]===i[s-r];r++);return jr=i.slice(e,1<r?1-r:void 0)}function Lr(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function ur(){return!0}function Yo(){return!1}function xe(e){function n(t,r,i,s,o){this._reactName=t,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in e)e.hasOwnProperty(a)&&(t=e[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ur:Yo,this.isPropagationStopped=Yo,this}return U(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=ur)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=ur)},persist:function(){},isPersistent:ur}),n}var at={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ro=xe(at),Xt=U({},at,{view:0,detail:0}),dc=xe(Xt),Ti,Ni,vt,ri=U({},Xt,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:io,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==vt&&(vt&&e.type==="mousemove"?(Ti=e.screenX-vt.screenX,Ni=e.screenY-vt.screenY):Ni=Ti=0,vt=e),Ti)},movementY:function(e){return"movementY"in e?e.movementY:Ni}}),Zo=xe(ri),cc=U({},ri,{dataTransfer:0}),pc=xe(cc),mc=U({},Xt,{relatedTarget:0}),Ai=xe(mc),fc=U({},at,{animationName:0,elapsedTime:0,pseudoElement:0}),vc=xe(fc),gc=U({},at,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),hc=xe(gc),yc=U({},at,{data:0}),ea=xe(yc),Ec={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},xc={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Sc={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function jc(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=Sc[e])?!!n[e]:!1}function io(){return jc}var Lc=U({},Xt,{key:function(e){if(e.key){var n=Ec[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=Lr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?xc[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:io,charCode:function(e){return e.type==="keypress"?Lr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Lr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Cc=xe(Lc),wc=U({},ri,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),na=xe(wc),Tc=U({},Xt,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:io}),Nc=xe(Tc),Ac=U({},at,{propertyName:0,elapsedTime:0,pseudoElement:0}),Pc=xe(Ac),kc=U({},ri,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Rc=xe(kc),Ic=[9,13,27,32],so=Ge&&"CompositionEvent"in window,wt=null;Ge&&"documentMode"in document&&(wt=document.documentMode);var Dc=Ge&&"TextEvent"in window&&!wt,Hl=Ge&&(!so||wt&&8<wt&&11>=wt),ta=" ",ra=!1;function Bl(e,n){switch(e){case"keyup":return Ic.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function $l(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Fn=!1;function qc(e,n){switch(e){case"compositionend":return $l(n);case"keypress":return n.which!==32?null:(ra=!0,ta);case"textInput":return e=n.data,e===ta&&ra?null:e;default:return null}}function _c(e,n){if(Fn)return e==="compositionend"||!so&&Bl(e,n)?(e=Vl(),jr=to=tn=null,Fn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Hl&&n.locale!=="ko"?null:n.data;default:return null}}var Oc={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ia(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!Oc[e.type]:n==="textarea"}function Gl(e,n,t,r){Ll(r),n=Mr(n,"onChange"),0<n.length&&(t=new ro("onChange","change",null,t,r),e.push({event:t,listeners:n}))}var Tt=null,Mt=null;function Fc(e){ru(e,0)}function ii(e){var n=zn(e);if(gl(n))return e}function Mc(e,n){if(e==="change")return n}var Ql=!1;if(Ge){var Pi;if(Ge){var ki="oninput"in document;if(!ki){var sa=document.createElement("div");sa.setAttribute("oninput","return;"),ki=typeof sa.oninput=="function"}Pi=ki}else Pi=!1;Ql=Pi&&(!document.documentMode||9<document.documentMode)}function oa(){Tt&&(Tt.detachEvent("onpropertychange",Wl),Mt=Tt=null)}function Wl(e){if(e.propertyName==="value"&&ii(Mt)){var n=[];Gl(n,Mt,e,Xs(e)),Nl(Fc,n)}}function bc(e,n,t){e==="focusin"?(oa(),Tt=n,Mt=t,Tt.attachEvent("onpropertychange",Wl)):e==="focusout"&&oa()}function zc(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ii(Mt)}function Uc(e,n){if(e==="click")return ii(n)}function Vc(e,n){if(e==="input"||e==="change")return ii(n)}function Hc(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var qe=typeof Object.is=="function"?Object.is:Hc;function bt(e,n){if(qe(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var t=Object.keys(e),r=Object.keys(n);if(t.length!==r.length)return!1;for(r=0;r<t.length;r++){var i=t[r];if(!Wi.call(n,i)||!qe(e[i],n[i]))return!1}return!0}function aa(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function la(e,n){var t=aa(e);e=0;for(var r;t;){if(t.nodeType===3){if(r=e+t.textContent.length,e<=n&&r>=n)return{node:t,offset:n-e};e=r}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=aa(t)}}function Jl(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?Jl(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function Kl(){for(var e=window,n=Rr();n instanceof e.HTMLIFrameElement;){try{var t=typeof n.contentWindow.location.href=="string"}catch{t=!1}if(t)e=n.contentWindow;else break;n=Rr(e.document)}return n}function oo(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}function Bc(e){var n=Kl(),t=e.focusedElem,r=e.selectionRange;if(n!==t&&t&&t.ownerDocument&&Jl(t.ownerDocument.documentElement,t)){if(r!==null&&oo(t)){if(n=r.start,e=r.end,e===void 0&&(e=n),"selectionStart"in t)t.selectionStart=n,t.selectionEnd=Math.min(e,t.value.length);else if(e=(n=t.ownerDocument||document)&&n.defaultView||window,e.getSelection){e=e.getSelection();var i=t.textContent.length,s=Math.min(r.start,i);r=r.end===void 0?s:Math.min(r.end,i),!e.extend&&s>r&&(i=r,r=s,s=i),i=la(t,s);var o=la(t,r);i&&o&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(n=n.createRange(),n.setStart(i.node,i.offset),e.removeAllRanges(),s>r?(e.addRange(n),e.extend(o.node,o.offset)):(n.setEnd(o.node,o.offset),e.addRange(n)))}}for(n=[],e=t;e=e.parentNode;)e.nodeType===1&&n.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<n.length;t++)e=n[t],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var $c=Ge&&"documentMode"in document&&11>=document.documentMode,Mn=null,ms=null,Nt=null,fs=!1;function ua(e,n,t){var r=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;fs||Mn==null||Mn!==Rr(r)||(r=Mn,"selectionStart"in r&&oo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Nt&&bt(Nt,r)||(Nt=r,r=Mr(ms,"onSelect"),0<r.length&&(n=new ro("onSelect","select",null,n,t),e.push({event:n,listeners:r}),n.target=Mn)))}function dr(e,n){var t={};return t[e.toLowerCase()]=n.toLowerCase(),t["Webkit"+e]="webkit"+n,t["Moz"+e]="moz"+n,t}var bn={animationend:dr("Animation","AnimationEnd"),animationiteration:dr("Animation","AnimationIteration"),animationstart:dr("Animation","AnimationStart"),transitionend:dr("Transition","TransitionEnd")},Ri={},Xl={};Ge&&(Xl=document.createElement("div").style,"AnimationEvent"in window||(delete bn.animationend.animation,delete bn.animationiteration.animation,delete bn.animationstart.animation),"TransitionEvent"in window||delete bn.transitionend.transition);function si(e){if(Ri[e])return Ri[e];if(!bn[e])return e;var n=bn[e],t;for(t in n)if(n.hasOwnProperty(t)&&t in Xl)return Ri[e]=n[t];return e}var Yl=si("animationend"),Zl=si("animationiteration"),eu=si("animationstart"),nu=si("transitionend"),tu=new Map,da="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function vn(e,n){tu.set(e,n),In(n,[e])}for(var Ii=0;Ii<da.length;Ii++){var Di=da[Ii],Gc=Di.toLowerCase(),Qc=Di[0].toUpperCase()+Di.slice(1);vn(Gc,"on"+Qc)}vn(Yl,"onAnimationEnd");vn(Zl,"onAnimationIteration");vn(eu,"onAnimationStart");vn("dblclick","onDoubleClick");vn("focusin","onFocus");vn("focusout","onBlur");vn(nu,"onTransitionEnd");Zn("onMouseEnter",["mouseout","mouseover"]);Zn("onMouseLeave",["mouseout","mouseover"]);Zn("onPointerEnter",["pointerout","pointerover"]);Zn("onPointerLeave",["pointerout","pointerover"]);In("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));In("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));In("onBeforeInput",["compositionend","keypress","textInput","paste"]);In("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));In("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));In("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var jt="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Wc=new Set("cancel close invalid load scroll toggle".split(" ").concat(jt));function ca(e,n,t){var r=e.type||"unknown-event";e.currentTarget=t,Gd(r,n,void 0,e),e.currentTarget=null}function ru(e,n){n=(n&4)!==0;for(var t=0;t<e.length;t++){var r=e[t],i=r.event;r=r.listeners;e:{var s=void 0;if(n)for(var o=r.length-1;0<=o;o--){var a=r[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&i.isPropagationStopped())break e;ca(i,a,c),s=l}else for(o=0;o<r.length;o++){if(a=r[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&i.isPropagationStopped())break e;ca(i,a,c),s=l}}}if(Dr)throw e=us,Dr=!1,us=null,e}function O(e,n){var t=n[Es];t===void 0&&(t=n[Es]=new Set);var r=e+"__bubble";t.has(r)||(iu(n,e,2,!1),t.add(r))}function qi(e,n,t){var r=0;n&&(r|=4),iu(t,e,r,n)}var cr="_reactListening"+Math.random().toString(36).slice(2);function zt(e){if(!e[cr]){e[cr]=!0,cl.forEach(function(t){t!=="selectionchange"&&(Wc.has(t)||qi(t,!1,e),qi(t,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[cr]||(n[cr]=!0,qi("selectionchange",!1,n))}}function iu(e,n,t,r){switch(Ul(n)){case 1:var i=lc;break;case 4:i=uc;break;default:i=no}t=i.bind(null,n,t,e),i=void 0,!ls||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(i=!0),r?i!==void 0?e.addEventListener(n,t,{capture:!0,passive:i}):e.addEventListener(n,t,!0):i!==void 0?e.addEventListener(n,t,{passive:i}):e.addEventListener(n,t,!1)}function _i(e,n,t,r,i){var s=r;if(!(n&1)&&!(n&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var a=r.stateNode.containerInfo;if(a===i||a.nodeType===8&&a.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===i||l.nodeType===8&&l.parentNode===i))return;o=o.return}for(;a!==null;){if(o=jn(a),o===null)return;if(l=o.tag,l===5||l===6){r=s=o;continue e}a=a.parentNode}}r=r.return}Nl(function(){var c=s,g=Xs(t),v=[];e:{var m=tu.get(e);if(m!==void 0){var E=ro,x=e;switch(e){case"keypress":if(Lr(t)===0)break e;case"keydown":case"keyup":E=Cc;break;case"focusin":x="focus",E=Ai;break;case"focusout":x="blur",E=Ai;break;case"beforeblur":case"afterblur":E=Ai;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":E=Zo;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":E=pc;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":E=Nc;break;case Yl:case Zl:case eu:E=vc;break;case nu:E=Pc;break;case"scroll":E=dc;break;case"wheel":E=Rc;break;case"copy":case"cut":case"paste":E=hc;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":E=na}var S=(n&4)!==0,T=!S&&e==="scroll",d=S?m!==null?m+"Capture":null:m;S=[];for(var u=c,p;u!==null;){p=u;var h=p.stateNode;if(p.tag===5&&h!==null&&(p=h,d!==null&&(h=qt(u,d),h!=null&&S.push(Ut(u,h,p)))),T)break;u=u.return}0<S.length&&(m=new E(m,x,null,t,g),v.push({event:m,listeners:S}))}}if(!(n&7)){e:{if(m=e==="mouseover"||e==="pointerover",E=e==="mouseout"||e==="pointerout",m&&t!==os&&(x=t.relatedTarget||t.fromElement)&&(jn(x)||x[Qe]))break e;if((E||m)&&(m=g.window===g?g:(m=g.ownerDocument)?m.defaultView||m.parentWindow:window,E?(x=t.relatedTarget||t.toElement,E=c,x=x?jn(x):null,x!==null&&(T=Dn(x),x!==T||x.tag!==5&&x.tag!==6)&&(x=null)):(E=null,x=c),E!==x)){if(S=Zo,h="onMouseLeave",d="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(S=na,h="onPointerLeave",d="onPointerEnter",u="pointer"),T=E==null?m:zn(E),p=x==null?m:zn(x),m=new S(h,u+"leave",E,t,g),m.target=T,m.relatedTarget=p,h=null,jn(g)===c&&(S=new S(d,u+"enter",x,t,g),S.target=p,S.relatedTarget=T,h=S),T=h,E&&x)n:{for(S=E,d=x,u=0,p=S;p;p=qn(p))u++;for(p=0,h=d;h;h=qn(h))p++;for(;0<u-p;)S=qn(S),u--;for(;0<p-u;)d=qn(d),p--;for(;u--;){if(S===d||d!==null&&S===d.alternate)break n;S=qn(S),d=qn(d)}S=null}else S=null;E!==null&&pa(v,m,E,S,!1),x!==null&&T!==null&&pa(v,T,x,S,!0)}}e:{if(m=c?zn(c):window,E=m.nodeName&&m.nodeName.toLowerCase(),E==="select"||E==="input"&&m.type==="file")var L=Mc;else if(ia(m))if(Ql)L=Vc;else{L=zc;var w=bc}else(E=m.nodeName)&&E.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(L=Uc);if(L&&(L=L(e,c))){Gl(v,L,t,g);break e}w&&w(e,m,c),e==="focusout"&&(w=m._wrapperState)&&w.controlled&&m.type==="number"&&ns(m,"number",m.value)}switch(w=c?zn(c):window,e){case"focusin":(ia(w)||w.contentEditable==="true")&&(Mn=w,ms=c,Nt=null);break;case"focusout":Nt=ms=Mn=null;break;case"mousedown":fs=!0;break;case"contextmenu":case"mouseup":case"dragend":fs=!1,ua(v,t,g);break;case"selectionchange":if($c)break;case"keydown":case"keyup":ua(v,t,g)}var N;if(so)e:{switch(e){case"compositionstart":var A="onCompositionStart";break e;case"compositionend":A="onCompositionEnd";break e;case"compositionupdate":A="onCompositionUpdate";break e}A=void 0}else Fn?Bl(e,t)&&(A="onCompositionEnd"):e==="keydown"&&t.keyCode===229&&(A="onCompositionStart");A&&(Hl&&t.locale!=="ko"&&(Fn||A!=="onCompositionStart"?A==="onCompositionEnd"&&Fn&&(N=Vl()):(tn=g,to="value"in tn?tn.value:tn.textContent,Fn=!0)),w=Mr(c,A),0<w.length&&(A=new ea(A,e,null,t,g),v.push({event:A,listeners:w}),N?A.data=N:(N=$l(t),N!==null&&(A.data=N)))),(N=Dc?qc(e,t):_c(e,t))&&(c=Mr(c,"onBeforeInput"),0<c.length&&(g=new ea("onBeforeInput","beforeinput",null,t,g),v.push({event:g,listeners:c}),g.data=N))}ru(v,n)})}function Ut(e,n,t){return{instance:e,listener:n,currentTarget:t}}function Mr(e,n){for(var t=n+"Capture",r=[];e!==null;){var i=e,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=qt(e,t),s!=null&&r.unshift(Ut(e,s,i)),s=qt(e,n),s!=null&&r.push(Ut(e,s,i))),e=e.return}return r}function qn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function pa(e,n,t,r,i){for(var s=n._reactName,o=[];t!==null&&t!==r;){var a=t,l=a.alternate,c=a.stateNode;if(l!==null&&l===r)break;a.tag===5&&c!==null&&(a=c,i?(l=qt(t,s),l!=null&&o.unshift(Ut(t,l,a))):i||(l=qt(t,s),l!=null&&o.push(Ut(t,l,a)))),t=t.return}o.length!==0&&e.push({event:n,listeners:o})}var Jc=/\r\n?/g,Kc=/\u0000|\uFFFD/g;function ma(e){return(typeof e=="string"?e:""+e).replace(Jc,`
`).replace(Kc,"")}function pr(e,n,t){if(n=ma(n),ma(e)!==n&&t)throw Error(y(425))}function br(){}var vs=null,gs=null;function hs(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var ys=typeof setTimeout=="function"?setTimeout:void 0,Xc=typeof clearTimeout=="function"?clearTimeout:void 0,fa=typeof Promise=="function"?Promise:void 0,Yc=typeof queueMicrotask=="function"?queueMicrotask:typeof fa<"u"?function(e){return fa.resolve(null).then(e).catch(Zc)}:ys;function Zc(e){setTimeout(function(){throw e})}function Oi(e,n){var t=n,r=0;do{var i=t.nextSibling;if(e.removeChild(t),i&&i.nodeType===8)if(t=i.data,t==="/$"){if(r===0){e.removeChild(i),Ft(n);return}r--}else t!=="$"&&t!=="$?"&&t!=="$!"||r++;t=i}while(t);Ft(n)}function ln(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?")break;if(n==="/$")return null}}return e}function va(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="$"||t==="$!"||t==="$?"){if(n===0)return e;n--}else t==="/$"&&n++}e=e.previousSibling}return null}var lt=Math.random().toString(36).slice(2),Fe="__reactFiber$"+lt,Vt="__reactProps$"+lt,Qe="__reactContainer$"+lt,Es="__reactEvents$"+lt,ep="__reactListeners$"+lt,np="__reactHandles$"+lt;function jn(e){var n=e[Fe];if(n)return n;for(var t=e.parentNode;t;){if(n=t[Qe]||t[Fe]){if(t=n.alternate,n.child!==null||t!==null&&t.child!==null)for(e=va(e);e!==null;){if(t=e[Fe])return t;e=va(e)}return n}e=t,t=e.parentNode}return null}function Yt(e){return e=e[Fe]||e[Qe],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function zn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(y(33))}function oi(e){return e[Vt]||null}var xs=[],Un=-1;function gn(e){return{current:e}}function F(e){0>Un||(e.current=xs[Un],xs[Un]=null,Un--)}function _(e,n){Un++,xs[Un]=e.current,e.current=n}var fn={},se=gn(fn),pe=gn(!1),Nn=fn;function et(e,n){var t=e.type.contextTypes;if(!t)return fn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===n)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in t)i[s]=n[s];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=n,e.__reactInternalMemoizedMaskedChildContext=i),i}function me(e){return e=e.childContextTypes,e!=null}function zr(){F(pe),F(se)}function ga(e,n,t){if(se.current!==fn)throw Error(y(168));_(se,n),_(pe,t)}function su(e,n,t){var r=e.stateNode;if(n=n.childContextTypes,typeof r.getChildContext!="function")return t;r=r.getChildContext();for(var i in r)if(!(i in n))throw Error(y(108,bd(e)||"Unknown",i));return U({},t,r)}function Ur(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||fn,Nn=se.current,_(se,e),_(pe,pe.current),!0}function ha(e,n,t){var r=e.stateNode;if(!r)throw Error(y(169));t?(e=su(e,n,Nn),r.__reactInternalMemoizedMergedChildContext=e,F(pe),F(se),_(se,e)):F(pe),_(pe,t)}var Ve=null,ai=!1,Fi=!1;function ou(e){Ve===null?Ve=[e]:Ve.push(e)}function tp(e){ai=!0,ou(e)}function hn(){if(!Fi&&Ve!==null){Fi=!0;var e=0,n=q;try{var t=Ve;for(q=1;e<t.length;e++){var r=t[e];do r=r(!0);while(r!==null)}Ve=null,ai=!1}catch(i){throw Ve!==null&&(Ve=Ve.slice(e+1)),Rl(Ys,hn),i}finally{q=n,Fi=!1}}return null}var Vn=[],Hn=0,Vr=null,Hr=0,Se=[],je=0,An=null,He=1,Be="";function xn(e,n){Vn[Hn++]=Hr,Vn[Hn++]=Vr,Vr=e,Hr=n}function au(e,n,t){Se[je++]=He,Se[je++]=Be,Se[je++]=An,An=e;var r=He;e=Be;var i=32-Ie(r)-1;r&=~(1<<i),t+=1;var s=32-Ie(n)+i;if(30<s){var o=i-i%5;s=(r&(1<<o)-1).toString(32),r>>=o,i-=o,He=1<<32-Ie(n)+i|t<<i|r,Be=s+e}else He=1<<s|t<<i|r,Be=e}function ao(e){e.return!==null&&(xn(e,1),au(e,1,0))}function lo(e){for(;e===Vr;)Vr=Vn[--Hn],Vn[Hn]=null,Hr=Vn[--Hn],Vn[Hn]=null;for(;e===An;)An=Se[--je],Se[je]=null,Be=Se[--je],Se[je]=null,He=Se[--je],Se[je]=null}var he=null,ge=null,M=!1,Re=null;function lu(e,n){var t=Le(5,null,null,0);t.elementType="DELETED",t.stateNode=n,t.return=e,n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)}function ya(e,n){switch(e.tag){case 5:var t=e.type;return n=n.nodeType!==1||t.toLowerCase()!==n.nodeName.toLowerCase()?null:n,n!==null?(e.stateNode=n,he=e,ge=ln(n.firstChild),!0):!1;case 6:return n=e.pendingProps===""||n.nodeType!==3?null:n,n!==null?(e.stateNode=n,he=e,ge=null,!0):!1;case 13:return n=n.nodeType!==8?null:n,n!==null?(t=An!==null?{id:He,overflow:Be}:null,e.memoizedState={dehydrated:n,treeContext:t,retryLane:1073741824},t=Le(18,null,null,0),t.stateNode=n,t.return=e,e.child=t,he=e,ge=null,!0):!1;default:return!1}}function Ss(e){return(e.mode&1)!==0&&(e.flags&128)===0}function js(e){if(M){var n=ge;if(n){var t=n;if(!ya(e,n)){if(Ss(e))throw Error(y(418));n=ln(t.nextSibling);var r=he;n&&ya(e,n)?lu(r,t):(e.flags=e.flags&-4097|2,M=!1,he=e)}}else{if(Ss(e))throw Error(y(418));e.flags=e.flags&-4097|2,M=!1,he=e}}}function Ea(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;he=e}function mr(e){if(e!==he)return!1;if(!M)return Ea(e),M=!0,!1;var n;if((n=e.tag!==3)&&!(n=e.tag!==5)&&(n=e.type,n=n!=="head"&&n!=="body"&&!hs(e.type,e.memoizedProps)),n&&(n=ge)){if(Ss(e))throw uu(),Error(y(418));for(;n;)lu(e,n),n=ln(n.nextSibling)}if(Ea(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(317));e:{for(e=e.nextSibling,n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="/$"){if(n===0){ge=ln(e.nextSibling);break e}n--}else t!=="$"&&t!=="$!"&&t!=="$?"||n++}e=e.nextSibling}ge=null}}else ge=he?ln(e.stateNode.nextSibling):null;return!0}function uu(){for(var e=ge;e;)e=ln(e.nextSibling)}function nt(){ge=he=null,M=!1}function uo(e){Re===null?Re=[e]:Re.push(e)}var rp=Ke.ReactCurrentBatchConfig;function gt(e,n,t){if(e=t.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(y(309));var r=t.stateNode}if(!r)throw Error(y(147,e));var i=r,s=""+e;return n!==null&&n.ref!==null&&typeof n.ref=="function"&&n.ref._stringRef===s?n.ref:(n=function(o){var a=i.refs;o===null?delete a[s]:a[s]=o},n._stringRef=s,n)}if(typeof e!="string")throw Error(y(284));if(!t._owner)throw Error(y(290,e))}return e}function fr(e,n){throw e=Object.prototype.toString.call(n),Error(y(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e))}function xa(e){var n=e._init;return n(e._payload)}function du(e){function n(d,u){if(e){var p=d.deletions;p===null?(d.deletions=[u],d.flags|=16):p.push(u)}}function t(d,u){if(!e)return null;for(;u!==null;)n(d,u),u=u.sibling;return null}function r(d,u){for(d=new Map;u!==null;)u.key!==null?d.set(u.key,u):d.set(u.index,u),u=u.sibling;return d}function i(d,u){return d=pn(d,u),d.index=0,d.sibling=null,d}function s(d,u,p){return d.index=p,e?(p=d.alternate,p!==null?(p=p.index,p<u?(d.flags|=2,u):p):(d.flags|=2,u)):(d.flags|=1048576,u)}function o(d){return e&&d.alternate===null&&(d.flags|=2),d}function a(d,u,p,h){return u===null||u.tag!==6?(u=Bi(p,d.mode,h),u.return=d,u):(u=i(u,p),u.return=d,u)}function l(d,u,p,h){var L=p.type;return L===On?g(d,u,p.props.children,h,p.key):u!==null&&(u.elementType===L||typeof L=="object"&&L!==null&&L.$$typeof===Ye&&xa(L)===u.type)?(h=i(u,p.props),h.ref=gt(d,u,p),h.return=d,h):(h=kr(p.type,p.key,p.props,null,d.mode,h),h.ref=gt(d,u,p),h.return=d,h)}function c(d,u,p,h){return u===null||u.tag!==4||u.stateNode.containerInfo!==p.containerInfo||u.stateNode.implementation!==p.implementation?(u=$i(p,d.mode,h),u.return=d,u):(u=i(u,p.children||[]),u.return=d,u)}function g(d,u,p,h,L){return u===null||u.tag!==7?(u=Tn(p,d.mode,h,L),u.return=d,u):(u=i(u,p),u.return=d,u)}function v(d,u,p){if(typeof u=="string"&&u!==""||typeof u=="number")return u=Bi(""+u,d.mode,p),u.return=d,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case rr:return p=kr(u.type,u.key,u.props,null,d.mode,p),p.ref=gt(d,null,u),p.return=d,p;case _n:return u=$i(u,d.mode,p),u.return=d,u;case Ye:var h=u._init;return v(d,h(u._payload),p)}if(xt(u)||ct(u))return u=Tn(u,d.mode,p,null),u.return=d,u;fr(d,u)}return null}function m(d,u,p,h){var L=u!==null?u.key:null;if(typeof p=="string"&&p!==""||typeof p=="number")return L!==null?null:a(d,u,""+p,h);if(typeof p=="object"&&p!==null){switch(p.$$typeof){case rr:return p.key===L?l(d,u,p,h):null;case _n:return p.key===L?c(d,u,p,h):null;case Ye:return L=p._init,m(d,u,L(p._payload),h)}if(xt(p)||ct(p))return L!==null?null:g(d,u,p,h,null);fr(d,p)}return null}function E(d,u,p,h,L){if(typeof h=="string"&&h!==""||typeof h=="number")return d=d.get(p)||null,a(u,d,""+h,L);if(typeof h=="object"&&h!==null){switch(h.$$typeof){case rr:return d=d.get(h.key===null?p:h.key)||null,l(u,d,h,L);case _n:return d=d.get(h.key===null?p:h.key)||null,c(u,d,h,L);case Ye:var w=h._init;return E(d,u,p,w(h._payload),L)}if(xt(h)||ct(h))return d=d.get(p)||null,g(u,d,h,L,null);fr(u,h)}return null}function x(d,u,p,h){for(var L=null,w=null,N=u,A=u=0,H=null;N!==null&&A<p.length;A++){N.index>A?(H=N,N=null):H=N.sibling;var I=m(d,N,p[A],h);if(I===null){N===null&&(N=H);break}e&&N&&I.alternate===null&&n(d,N),u=s(I,u,A),w===null?L=I:w.sibling=I,w=I,N=H}if(A===p.length)return t(d,N),M&&xn(d,A),L;if(N===null){for(;A<p.length;A++)N=v(d,p[A],h),N!==null&&(u=s(N,u,A),w===null?L=N:w.sibling=N,w=N);return M&&xn(d,A),L}for(N=r(d,N);A<p.length;A++)H=E(N,d,A,p[A],h),H!==null&&(e&&H.alternate!==null&&N.delete(H.key===null?A:H.key),u=s(H,u,A),w===null?L=H:w.sibling=H,w=H);return e&&N.forEach(function(Ne){return n(d,Ne)}),M&&xn(d,A),L}function S(d,u,p,h){var L=ct(p);if(typeof L!="function")throw Error(y(150));if(p=L.call(p),p==null)throw Error(y(151));for(var w=L=null,N=u,A=u=0,H=null,I=p.next();N!==null&&!I.done;A++,I=p.next()){N.index>A?(H=N,N=null):H=N.sibling;var Ne=m(d,N,I.value,h);if(Ne===null){N===null&&(N=H);break}e&&N&&Ne.alternate===null&&n(d,N),u=s(Ne,u,A),w===null?L=Ne:w.sibling=Ne,w=Ne,N=H}if(I.done)return t(d,N),M&&xn(d,A),L;if(N===null){for(;!I.done;A++,I=p.next())I=v(d,I.value,h),I!==null&&(u=s(I,u,A),w===null?L=I:w.sibling=I,w=I);return M&&xn(d,A),L}for(N=r(d,N);!I.done;A++,I=p.next())I=E(N,d,A,I.value,h),I!==null&&(e&&I.alternate!==null&&N.delete(I.key===null?A:I.key),u=s(I,u,A),w===null?L=I:w.sibling=I,w=I);return e&&N.forEach(function(ut){return n(d,ut)}),M&&xn(d,A),L}function T(d,u,p,h){if(typeof p=="object"&&p!==null&&p.type===On&&p.key===null&&(p=p.props.children),typeof p=="object"&&p!==null){switch(p.$$typeof){case rr:e:{for(var L=p.key,w=u;w!==null;){if(w.key===L){if(L=p.type,L===On){if(w.tag===7){t(d,w.sibling),u=i(w,p.props.children),u.return=d,d=u;break e}}else if(w.elementType===L||typeof L=="object"&&L!==null&&L.$$typeof===Ye&&xa(L)===w.type){t(d,w.sibling),u=i(w,p.props),u.ref=gt(d,w,p),u.return=d,d=u;break e}t(d,w);break}else n(d,w);w=w.sibling}p.type===On?(u=Tn(p.props.children,d.mode,h,p.key),u.return=d,d=u):(h=kr(p.type,p.key,p.props,null,d.mode,h),h.ref=gt(d,u,p),h.return=d,d=h)}return o(d);case _n:e:{for(w=p.key;u!==null;){if(u.key===w)if(u.tag===4&&u.stateNode.containerInfo===p.containerInfo&&u.stateNode.implementation===p.implementation){t(d,u.sibling),u=i(u,p.children||[]),u.return=d,d=u;break e}else{t(d,u);break}else n(d,u);u=u.sibling}u=$i(p,d.mode,h),u.return=d,d=u}return o(d);case Ye:return w=p._init,T(d,u,w(p._payload),h)}if(xt(p))return x(d,u,p,h);if(ct(p))return S(d,u,p,h);fr(d,p)}return typeof p=="string"&&p!==""||typeof p=="number"?(p=""+p,u!==null&&u.tag===6?(t(d,u.sibling),u=i(u,p),u.return=d,d=u):(t(d,u),u=Bi(p,d.mode,h),u.return=d,d=u),o(d)):t(d,u)}return T}var tt=du(!0),cu=du(!1),Br=gn(null),$r=null,Bn=null,co=null;function po(){co=Bn=$r=null}function mo(e){var n=Br.current;F(Br),e._currentValue=n}function Ls(e,n,t){for(;e!==null;){var r=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,r!==null&&(r.childLanes|=n)):r!==null&&(r.childLanes&n)!==n&&(r.childLanes|=n),e===t)break;e=e.return}}function Xn(e,n){$r=e,co=Bn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&n&&(ce=!0),e.firstContext=null)}function we(e){var n=e._currentValue;if(co!==e)if(e={context:e,memoizedValue:n,next:null},Bn===null){if($r===null)throw Error(y(308));Bn=e,$r.dependencies={lanes:0,firstContext:e}}else Bn=Bn.next=e;return n}var Ln=null;function fo(e){Ln===null?Ln=[e]:Ln.push(e)}function pu(e,n,t,r){var i=n.interleaved;return i===null?(t.next=t,fo(n)):(t.next=i.next,i.next=t),n.interleaved=t,We(e,r)}function We(e,n){e.lanes|=n;var t=e.alternate;for(t!==null&&(t.lanes|=n),t=e,e=e.return;e!==null;)e.childLanes|=n,t=e.alternate,t!==null&&(t.childLanes|=n),t=e,e=e.return;return t.tag===3?t.stateNode:null}var Ze=!1;function vo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function mu(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function $e(e,n){return{eventTime:e,lane:n,tag:0,payload:null,callback:null,next:null}}function un(e,n,t){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,D&2){var i=r.pending;return i===null?n.next=n:(n.next=i.next,i.next=n),r.pending=n,We(e,t)}return i=r.interleaved,i===null?(n.next=n,fo(r)):(n.next=i.next,i.next=n),r.interleaved=n,We(e,t)}function Cr(e,n,t){if(n=n.updateQueue,n!==null&&(n=n.shared,(t&4194240)!==0)){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,Zs(e,t)}}function Sa(e,n){var t=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,t===r)){var i=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?i=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?i=s=n:s=s.next=n}else i=s=n;t={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},e.updateQueue=t;return}e=t.lastBaseUpdate,e===null?t.firstBaseUpdate=n:e.next=n,t.lastBaseUpdate=n}function Gr(e,n,t,r){var i=e.updateQueue;Ze=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,a=i.shared.pending;if(a!==null){i.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var g=e.alternate;g!==null&&(g=g.updateQueue,a=g.lastBaseUpdate,a!==o&&(a===null?g.firstBaseUpdate=c:a.next=c,g.lastBaseUpdate=l))}if(s!==null){var v=i.baseState;o=0,g=c=l=null,a=s;do{var m=a.lane,E=a.eventTime;if((r&m)===m){g!==null&&(g=g.next={eventTime:E,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var x=e,S=a;switch(m=n,E=t,S.tag){case 1:if(x=S.payload,typeof x=="function"){v=x.call(E,v,m);break e}v=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=S.payload,m=typeof x=="function"?x.call(E,v,m):x,m==null)break e;v=U({},v,m);break e;case 2:Ze=!0}}a.callback!==null&&a.lane!==0&&(e.flags|=64,m=i.effects,m===null?i.effects=[a]:m.push(a))}else E={eventTime:E,lane:m,tag:a.tag,payload:a.payload,callback:a.callback,next:null},g===null?(c=g=E,l=v):g=g.next=E,o|=m;if(a=a.next,a===null){if(a=i.shared.pending,a===null)break;m=a,a=m.next,m.next=null,i.lastBaseUpdate=m,i.shared.pending=null}}while(!0);if(g===null&&(l=v),i.baseState=l,i.firstBaseUpdate=c,i.lastBaseUpdate=g,n=i.shared.interleaved,n!==null){i=n;do o|=i.lane,i=i.next;while(i!==n)}else s===null&&(i.shared.lanes=0);kn|=o,e.lanes=o,e.memoizedState=v}}function ja(e,n,t){if(e=n.effects,n.effects=null,e!==null)for(n=0;n<e.length;n++){var r=e[n],i=r.callback;if(i!==null){if(r.callback=null,r=t,typeof i!="function")throw Error(y(191,i));i.call(r)}}}var Zt={},be=gn(Zt),Ht=gn(Zt),Bt=gn(Zt);function Cn(e){if(e===Zt)throw Error(y(174));return e}function go(e,n){switch(_(Bt,n),_(Ht,e),_(be,Zt),e=n.nodeType,e){case 9:case 11:n=(n=n.documentElement)?n.namespaceURI:rs(null,"");break;default:e=e===8?n.parentNode:n,n=e.namespaceURI||null,e=e.tagName,n=rs(n,e)}F(be),_(be,n)}function rt(){F(be),F(Ht),F(Bt)}function fu(e){Cn(Bt.current);var n=Cn(be.current),t=rs(n,e.type);n!==t&&(_(Ht,e),_(be,t))}function ho(e){Ht.current===e&&(F(be),F(Ht))}var b=gn(0);function Qr(e){for(var n=e;n!==null;){if(n.tag===13){var t=n.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if(n.flags&128)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Mi=[];function yo(){for(var e=0;e<Mi.length;e++)Mi[e]._workInProgressVersionPrimary=null;Mi.length=0}var wr=Ke.ReactCurrentDispatcher,bi=Ke.ReactCurrentBatchConfig,Pn=0,z=null,Q=null,X=null,Wr=!1,At=!1,$t=0,ip=0;function te(){throw Error(y(321))}function Eo(e,n){if(n===null)return!1;for(var t=0;t<n.length&&t<e.length;t++)if(!qe(e[t],n[t]))return!1;return!0}function xo(e,n,t,r,i,s){if(Pn=s,z=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,wr.current=e===null||e.memoizedState===null?lp:up,e=t(r,i),At){s=0;do{if(At=!1,$t=0,25<=s)throw Error(y(301));s+=1,X=Q=null,n.updateQueue=null,wr.current=dp,e=t(r,i)}while(At)}if(wr.current=Jr,n=Q!==null&&Q.next!==null,Pn=0,X=Q=z=null,Wr=!1,n)throw Error(y(300));return e}function So(){var e=$t!==0;return $t=0,e}function Oe(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return X===null?z.memoizedState=X=e:X=X.next=e,X}function Te(){if(Q===null){var e=z.alternate;e=e!==null?e.memoizedState:null}else e=Q.next;var n=X===null?z.memoizedState:X.next;if(n!==null)X=n,Q=e;else{if(e===null)throw Error(y(310));Q=e,e={memoizedState:Q.memoizedState,baseState:Q.baseState,baseQueue:Q.baseQueue,queue:Q.queue,next:null},X===null?z.memoizedState=X=e:X=X.next=e}return X}function Gt(e,n){return typeof n=="function"?n(e):n}function zi(e){var n=Te(),t=n.queue;if(t===null)throw Error(y(311));t.lastRenderedReducer=e;var r=Q,i=r.baseQueue,s=t.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,t.pending=null}if(i!==null){s=i.next,r=r.baseState;var a=o=null,l=null,c=s;do{var g=c.lane;if((Pn&g)===g)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),r=c.hasEagerState?c.eagerState:e(r,c.action);else{var v={lane:g,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=v,o=r):l=l.next=v,z.lanes|=g,kn|=g}c=c.next}while(c!==null&&c!==s);l===null?o=r:l.next=a,qe(r,n.memoizedState)||(ce=!0),n.memoizedState=r,n.baseState=o,n.baseQueue=l,t.lastRenderedState=r}if(e=t.interleaved,e!==null){i=e;do s=i.lane,z.lanes|=s,kn|=s,i=i.next;while(i!==e)}else i===null&&(t.lanes=0);return[n.memoizedState,t.dispatch]}function Ui(e){var n=Te(),t=n.queue;if(t===null)throw Error(y(311));t.lastRenderedReducer=e;var r=t.dispatch,i=t.pending,s=n.memoizedState;if(i!==null){t.pending=null;var o=i=i.next;do s=e(s,o.action),o=o.next;while(o!==i);qe(s,n.memoizedState)||(ce=!0),n.memoizedState=s,n.baseQueue===null&&(n.baseState=s),t.lastRenderedState=s}return[s,r]}function vu(){}function gu(e,n){var t=z,r=Te(),i=n(),s=!qe(r.memoizedState,i);if(s&&(r.memoizedState=i,ce=!0),r=r.queue,jo(Eu.bind(null,t,r,e),[e]),r.getSnapshot!==n||s||X!==null&&X.memoizedState.tag&1){if(t.flags|=2048,Qt(9,yu.bind(null,t,r,i,n),void 0,null),Y===null)throw Error(y(349));Pn&30||hu(t,n,i)}return i}function hu(e,n,t){e.flags|=16384,e={getSnapshot:n,value:t},n=z.updateQueue,n===null?(n={lastEffect:null,stores:null},z.updateQueue=n,n.stores=[e]):(t=n.stores,t===null?n.stores=[e]:t.push(e))}function yu(e,n,t,r){n.value=t,n.getSnapshot=r,xu(n)&&Su(e)}function Eu(e,n,t){return t(function(){xu(n)&&Su(e)})}function xu(e){var n=e.getSnapshot;e=e.value;try{var t=n();return!qe(e,t)}catch{return!0}}function Su(e){var n=We(e,1);n!==null&&De(n,e,1,-1)}function La(e){var n=Oe();return typeof e=="function"&&(e=e()),n.memoizedState=n.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Gt,lastRenderedState:e},n.queue=e,e=e.dispatch=ap.bind(null,z,e),[n.memoizedState,e]}function Qt(e,n,t,r){return e={tag:e,create:n,destroy:t,deps:r,next:null},n=z.updateQueue,n===null?(n={lastEffect:null,stores:null},z.updateQueue=n,n.lastEffect=e.next=e):(t=n.lastEffect,t===null?n.lastEffect=e.next=e:(r=t.next,t.next=e,e.next=r,n.lastEffect=e)),e}function ju(){return Te().memoizedState}function Tr(e,n,t,r){var i=Oe();z.flags|=e,i.memoizedState=Qt(1|n,t,void 0,r===void 0?null:r)}function li(e,n,t,r){var i=Te();r=r===void 0?null:r;var s=void 0;if(Q!==null){var o=Q.memoizedState;if(s=o.destroy,r!==null&&Eo(r,o.deps)){i.memoizedState=Qt(n,t,s,r);return}}z.flags|=e,i.memoizedState=Qt(1|n,t,s,r)}function Ca(e,n){return Tr(8390656,8,e,n)}function jo(e,n){return li(2048,8,e,n)}function Lu(e,n){return li(4,2,e,n)}function Cu(e,n){return li(4,4,e,n)}function wu(e,n){if(typeof n=="function")return e=e(),n(e),function(){n(null)};if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function Tu(e,n,t){return t=t!=null?t.concat([e]):null,li(4,4,wu.bind(null,n,e),t)}function Lo(){}function Nu(e,n){var t=Te();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&Eo(n,r[1])?r[0]:(t.memoizedState=[e,n],e)}function Au(e,n){var t=Te();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&Eo(n,r[1])?r[0]:(e=e(),t.memoizedState=[e,n],e)}function Pu(e,n,t){return Pn&21?(qe(t,n)||(t=ql(),z.lanes|=t,kn|=t,e.baseState=!0),n):(e.baseState&&(e.baseState=!1,ce=!0),e.memoizedState=t)}function sp(e,n){var t=q;q=t!==0&&4>t?t:4,e(!0);var r=bi.transition;bi.transition={};try{e(!1),n()}finally{q=t,bi.transition=r}}function ku(){return Te().memoizedState}function op(e,n,t){var r=cn(e);if(t={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null},Ru(e))Iu(n,t);else if(t=pu(e,n,t,r),t!==null){var i=ae();De(t,e,r,i),Du(t,n,r)}}function ap(e,n,t){var r=cn(e),i={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null};if(Ru(e))Iu(n,i);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=n.lastRenderedReducer,s!==null))try{var o=n.lastRenderedState,a=s(o,t);if(i.hasEagerState=!0,i.eagerState=a,qe(a,o)){var l=n.interleaved;l===null?(i.next=i,fo(n)):(i.next=l.next,l.next=i),n.interleaved=i;return}}catch{}finally{}t=pu(e,n,i,r),t!==null&&(i=ae(),De(t,e,r,i),Du(t,n,r))}}function Ru(e){var n=e.alternate;return e===z||n!==null&&n===z}function Iu(e,n){At=Wr=!0;var t=e.pending;t===null?n.next=n:(n.next=t.next,t.next=n),e.pending=n}function Du(e,n,t){if(t&4194240){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,Zs(e,t)}}var Jr={readContext:we,useCallback:te,useContext:te,useEffect:te,useImperativeHandle:te,useInsertionEffect:te,useLayoutEffect:te,useMemo:te,useReducer:te,useRef:te,useState:te,useDebugValue:te,useDeferredValue:te,useTransition:te,useMutableSource:te,useSyncExternalStore:te,useId:te,unstable_isNewReconciler:!1},lp={readContext:we,useCallback:function(e,n){return Oe().memoizedState=[e,n===void 0?null:n],e},useContext:we,useEffect:Ca,useImperativeHandle:function(e,n,t){return t=t!=null?t.concat([e]):null,Tr(4194308,4,wu.bind(null,n,e),t)},useLayoutEffect:function(e,n){return Tr(4194308,4,e,n)},useInsertionEffect:function(e,n){return Tr(4,2,e,n)},useMemo:function(e,n){var t=Oe();return n=n===void 0?null:n,e=e(),t.memoizedState=[e,n],e},useReducer:function(e,n,t){var r=Oe();return n=t!==void 0?t(n):n,r.memoizedState=r.baseState=n,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:n},r.queue=e,e=e.dispatch=op.bind(null,z,e),[r.memoizedState,e]},useRef:function(e){var n=Oe();return e={current:e},n.memoizedState=e},useState:La,useDebugValue:Lo,useDeferredValue:function(e){return Oe().memoizedState=e},useTransition:function(){var e=La(!1),n=e[0];return e=sp.bind(null,e[1]),Oe().memoizedState=e,[n,e]},useMutableSource:function(){},useSyncExternalStore:function(e,n,t){var r=z,i=Oe();if(M){if(t===void 0)throw Error(y(407));t=t()}else{if(t=n(),Y===null)throw Error(y(349));Pn&30||hu(r,n,t)}i.memoizedState=t;var s={value:t,getSnapshot:n};return i.queue=s,Ca(Eu.bind(null,r,s,e),[e]),r.flags|=2048,Qt(9,yu.bind(null,r,s,t,n),void 0,null),t},useId:function(){var e=Oe(),n=Y.identifierPrefix;if(M){var t=Be,r=He;t=(r&~(1<<32-Ie(r)-1)).toString(32)+t,n=":"+n+"R"+t,t=$t++,0<t&&(n+="H"+t.toString(32)),n+=":"}else t=ip++,n=":"+n+"r"+t.toString(32)+":";return e.memoizedState=n},unstable_isNewReconciler:!1},up={readContext:we,useCallback:Nu,useContext:we,useEffect:jo,useImperativeHandle:Tu,useInsertionEffect:Lu,useLayoutEffect:Cu,useMemo:Au,useReducer:zi,useRef:ju,useState:function(){return zi(Gt)},useDebugValue:Lo,useDeferredValue:function(e){var n=Te();return Pu(n,Q.memoizedState,e)},useTransition:function(){var e=zi(Gt)[0],n=Te().memoizedState;return[e,n]},useMutableSource:vu,useSyncExternalStore:gu,useId:ku,unstable_isNewReconciler:!1},dp={readContext:we,useCallback:Nu,useContext:we,useEffect:jo,useImperativeHandle:Tu,useInsertionEffect:Lu,useLayoutEffect:Cu,useMemo:Au,useReducer:Ui,useRef:ju,useState:function(){return Ui(Gt)},useDebugValue:Lo,useDeferredValue:function(e){var n=Te();return Q===null?n.memoizedState=e:Pu(n,Q.memoizedState,e)},useTransition:function(){var e=Ui(Gt)[0],n=Te().memoizedState;return[e,n]},useMutableSource:vu,useSyncExternalStore:gu,useId:ku,unstable_isNewReconciler:!1};function Pe(e,n){if(e&&e.defaultProps){n=U({},n),e=e.defaultProps;for(var t in e)n[t]===void 0&&(n[t]=e[t]);return n}return n}function Cs(e,n,t,r){n=e.memoizedState,t=t(r,n),t=t==null?n:U({},n,t),e.memoizedState=t,e.lanes===0&&(e.updateQueue.baseState=t)}var ui={isMounted:function(e){return(e=e._reactInternals)?Dn(e)===e:!1},enqueueSetState:function(e,n,t){e=e._reactInternals;var r=ae(),i=cn(e),s=$e(r,i);s.payload=n,t!=null&&(s.callback=t),n=un(e,s,i),n!==null&&(De(n,e,i,r),Cr(n,e,i))},enqueueReplaceState:function(e,n,t){e=e._reactInternals;var r=ae(),i=cn(e),s=$e(r,i);s.tag=1,s.payload=n,t!=null&&(s.callback=t),n=un(e,s,i),n!==null&&(De(n,e,i,r),Cr(n,e,i))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var t=ae(),r=cn(e),i=$e(t,r);i.tag=2,n!=null&&(i.callback=n),n=un(e,i,r),n!==null&&(De(n,e,r,t),Cr(n,e,r))}};function wa(e,n,t,r,i,s,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,s,o):n.prototype&&n.prototype.isPureReactComponent?!bt(t,r)||!bt(i,s):!0}function qu(e,n,t){var r=!1,i=fn,s=n.contextType;return typeof s=="object"&&s!==null?s=we(s):(i=me(n)?Nn:se.current,r=n.contextTypes,s=(r=r!=null)?et(e,i):fn),n=new n(t,s),e.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=ui,e.stateNode=n,n._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=s),n}function Ta(e,n,t,r){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(t,r),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(t,r),n.state!==e&&ui.enqueueReplaceState(n,n.state,null)}function ws(e,n,t,r){var i=e.stateNode;i.props=t,i.state=e.memoizedState,i.refs={},vo(e);var s=n.contextType;typeof s=="object"&&s!==null?i.context=we(s):(s=me(n)?Nn:se.current,i.context=et(e,s)),i.state=e.memoizedState,s=n.getDerivedStateFromProps,typeof s=="function"&&(Cs(e,n,s,t),i.state=e.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(n=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),n!==i.state&&ui.enqueueReplaceState(i,i.state,null),Gr(e,t,i,r),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function it(e,n){try{var t="",r=n;do t+=Md(r),r=r.return;while(r);var i=t}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:n,stack:i,digest:null}}function Vi(e,n,t){return{value:e,source:null,stack:t??null,digest:n??null}}function Ts(e,n){try{console.error(n.value)}catch(t){setTimeout(function(){throw t})}}var cp=typeof WeakMap=="function"?WeakMap:Map;function _u(e,n,t){t=$e(-1,t),t.tag=3,t.payload={element:null};var r=n.value;return t.callback=function(){Xr||(Xr=!0,Os=r),Ts(e,n)},t}function Ou(e,n,t){t=$e(-1,t),t.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var i=n.value;t.payload=function(){return r(i)},t.callback=function(){Ts(e,n)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){Ts(e,n),typeof r!="function"&&(dn===null?dn=new Set([this]):dn.add(this));var o=n.stack;this.componentDidCatch(n.value,{componentStack:o!==null?o:""})}),t}function Na(e,n,t){var r=e.pingCache;if(r===null){r=e.pingCache=new cp;var i=new Set;r.set(n,i)}else i=r.get(n),i===void 0&&(i=new Set,r.set(n,i));i.has(t)||(i.add(t),e=wp.bind(null,e,n,t),n.then(e,e))}function Aa(e){do{var n;if((n=e.tag===13)&&(n=e.memoizedState,n=n!==null?n.dehydrated!==null:!0),n)return e;e=e.return}while(e!==null);return null}function Pa(e,n,t,r,i){return e.mode&1?(e.flags|=65536,e.lanes=i,e):(e===n?e.flags|=65536:(e.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(n=$e(-1,1),n.tag=2,un(t,n,1))),t.lanes|=1),e)}var pp=Ke.ReactCurrentOwner,ce=!1;function oe(e,n,t,r){n.child=e===null?cu(n,null,t,r):tt(n,e.child,t,r)}function ka(e,n,t,r,i){t=t.render;var s=n.ref;return Xn(n,i),r=xo(e,n,t,r,s,i),t=So(),e!==null&&!ce?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~i,Je(e,n,i)):(M&&t&&ao(n),n.flags|=1,oe(e,n,r,i),n.child)}function Ra(e,n,t,r,i){if(e===null){var s=t.type;return typeof s=="function"&&!Ro(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(n.tag=15,n.type=s,Fu(e,n,s,r,i)):(e=kr(t.type,null,r,n,n.mode,i),e.ref=n.ref,e.return=n,n.child=e)}if(s=e.child,!(e.lanes&i)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:bt,t(o,r)&&e.ref===n.ref)return Je(e,n,i)}return n.flags|=1,e=pn(s,r),e.ref=n.ref,e.return=n,n.child=e}function Fu(e,n,t,r,i){if(e!==null){var s=e.memoizedProps;if(bt(s,r)&&e.ref===n.ref)if(ce=!1,n.pendingProps=r=s,(e.lanes&i)!==0)e.flags&131072&&(ce=!0);else return n.lanes=e.lanes,Je(e,n,i)}return Ns(e,n,t,r,i)}function Mu(e,n,t){var r=n.pendingProps,i=r.children,s=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(n.mode&1))n.memoizedState={baseLanes:0,cachePool:null,transitions:null},_(Gn,ve),ve|=t;else{if(!(t&1073741824))return e=s!==null?s.baseLanes|t:t,n.lanes=n.childLanes=1073741824,n.memoizedState={baseLanes:e,cachePool:null,transitions:null},n.updateQueue=null,_(Gn,ve),ve|=e,null;n.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:t,_(Gn,ve),ve|=r}else s!==null?(r=s.baseLanes|t,n.memoizedState=null):r=t,_(Gn,ve),ve|=r;return oe(e,n,i,t),n.child}function bu(e,n){var t=n.ref;(e===null&&t!==null||e!==null&&e.ref!==t)&&(n.flags|=512,n.flags|=2097152)}function Ns(e,n,t,r,i){var s=me(t)?Nn:se.current;return s=et(n,s),Xn(n,i),t=xo(e,n,t,r,s,i),r=So(),e!==null&&!ce?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~i,Je(e,n,i)):(M&&r&&ao(n),n.flags|=1,oe(e,n,t,i),n.child)}function Ia(e,n,t,r,i){if(me(t)){var s=!0;Ur(n)}else s=!1;if(Xn(n,i),n.stateNode===null)Nr(e,n),qu(n,t,r),ws(n,t,r,i),r=!0;else if(e===null){var o=n.stateNode,a=n.memoizedProps;o.props=a;var l=o.context,c=t.contextType;typeof c=="object"&&c!==null?c=we(c):(c=me(t)?Nn:se.current,c=et(n,c));var g=t.getDerivedStateFromProps,v=typeof g=="function"||typeof o.getSnapshotBeforeUpdate=="function";v||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==r||l!==c)&&Ta(n,o,r,c),Ze=!1;var m=n.memoizedState;o.state=m,Gr(n,r,o,i),l=n.memoizedState,a!==r||m!==l||pe.current||Ze?(typeof g=="function"&&(Cs(n,t,g,r),l=n.memoizedState),(a=Ze||wa(n,t,a,r,m,l,c))?(v||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(n.flags|=4194308)):(typeof o.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=l),o.props=r,o.state=l,o.context=c,r=a):(typeof o.componentDidMount=="function"&&(n.flags|=4194308),r=!1)}else{o=n.stateNode,mu(e,n),a=n.memoizedProps,c=n.type===n.elementType?a:Pe(n.type,a),o.props=c,v=n.pendingProps,m=o.context,l=t.contextType,typeof l=="object"&&l!==null?l=we(l):(l=me(t)?Nn:se.current,l=et(n,l));var E=t.getDerivedStateFromProps;(g=typeof E=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==v||m!==l)&&Ta(n,o,r,l),Ze=!1,m=n.memoizedState,o.state=m,Gr(n,r,o,i);var x=n.memoizedState;a!==v||m!==x||pe.current||Ze?(typeof E=="function"&&(Cs(n,t,E,r),x=n.memoizedState),(c=Ze||wa(n,t,c,r,m,x,l)||!1)?(g||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,x,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,x,l)),typeof o.componentDidUpdate=="function"&&(n.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(n.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=x),o.props=r,o.state=x,o.context=l,r=c):(typeof o.componentDidUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(n.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(n.flags|=1024),r=!1)}return As(e,n,t,r,s,i)}function As(e,n,t,r,i,s){bu(e,n);var o=(n.flags&128)!==0;if(!r&&!o)return i&&ha(n,t,!1),Je(e,n,s);r=n.stateNode,pp.current=n;var a=o&&typeof t.getDerivedStateFromError!="function"?null:r.render();return n.flags|=1,e!==null&&o?(n.child=tt(n,e.child,null,s),n.child=tt(n,null,a,s)):oe(e,n,a,s),n.memoizedState=r.state,i&&ha(n,t,!0),n.child}function zu(e){var n=e.stateNode;n.pendingContext?ga(e,n.pendingContext,n.pendingContext!==n.context):n.context&&ga(e,n.context,!1),go(e,n.containerInfo)}function Da(e,n,t,r,i){return nt(),uo(i),n.flags|=256,oe(e,n,t,r),n.child}var Ps={dehydrated:null,treeContext:null,retryLane:0};function ks(e){return{baseLanes:e,cachePool:null,transitions:null}}function Uu(e,n,t){var r=n.pendingProps,i=b.current,s=!1,o=(n.flags&128)!==0,a;if((a=o)||(a=e!==null&&e.memoizedState===null?!1:(i&2)!==0),a?(s=!0,n.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),_(b,i&1),e===null)return js(n),e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(n.mode&1?e.data==="$!"?n.lanes=8:n.lanes=1073741824:n.lanes=1,null):(o=r.children,e=r.fallback,s?(r=n.mode,s=n.child,o={mode:"hidden",children:o},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=pi(o,r,0,null),e=Tn(e,r,t,null),s.return=n,e.return=n,s.sibling=e,n.child=s,n.child.memoizedState=ks(t),n.memoizedState=Ps,e):Co(n,o));if(i=e.memoizedState,i!==null&&(a=i.dehydrated,a!==null))return mp(e,n,o,r,a,i,t);if(s){s=r.fallback,o=n.mode,i=e.child,a=i.sibling;var l={mode:"hidden",children:r.children};return!(o&1)&&n.child!==i?(r=n.child,r.childLanes=0,r.pendingProps=l,n.deletions=null):(r=pn(i,l),r.subtreeFlags=i.subtreeFlags&14680064),a!==null?s=pn(a,s):(s=Tn(s,o,t,null),s.flags|=2),s.return=n,r.return=n,r.sibling=s,n.child=r,r=s,s=n.child,o=e.child.memoizedState,o=o===null?ks(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=e.childLanes&~t,n.memoizedState=Ps,r}return s=e.child,e=s.sibling,r=pn(s,{mode:"visible",children:r.children}),!(n.mode&1)&&(r.lanes=t),r.return=n,r.sibling=null,e!==null&&(t=n.deletions,t===null?(n.deletions=[e],n.flags|=16):t.push(e)),n.child=r,n.memoizedState=null,r}function Co(e,n){return n=pi({mode:"visible",children:n},e.mode,0,null),n.return=e,e.child=n}function vr(e,n,t,r){return r!==null&&uo(r),tt(n,e.child,null,t),e=Co(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function mp(e,n,t,r,i,s,o){if(t)return n.flags&256?(n.flags&=-257,r=Vi(Error(y(422))),vr(e,n,o,r)):n.memoizedState!==null?(n.child=e.child,n.flags|=128,null):(s=r.fallback,i=n.mode,r=pi({mode:"visible",children:r.children},i,0,null),s=Tn(s,i,o,null),s.flags|=2,r.return=n,s.return=n,r.sibling=s,n.child=r,n.mode&1&&tt(n,e.child,null,o),n.child.memoizedState=ks(o),n.memoizedState=Ps,s);if(!(n.mode&1))return vr(e,n,o,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var a=r.dgst;return r=a,s=Error(y(419)),r=Vi(s,r,void 0),vr(e,n,o,r)}if(a=(o&e.childLanes)!==0,ce||a){if(r=Y,r!==null){switch(o&-o){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|o)?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,We(e,i),De(r,e,i,-1))}return ko(),r=Vi(Error(y(421))),vr(e,n,o,r)}return i.data==="$?"?(n.flags|=128,n.child=e.child,n=Tp.bind(null,e),i._reactRetry=n,null):(e=s.treeContext,ge=ln(i.nextSibling),he=n,M=!0,Re=null,e!==null&&(Se[je++]=He,Se[je++]=Be,Se[je++]=An,He=e.id,Be=e.overflow,An=n),n=Co(n,r.children),n.flags|=4096,n)}function qa(e,n,t){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n),Ls(e.return,n,t)}function Hi(e,n,t,r,i){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:t,tailMode:i}:(s.isBackwards=n,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=t,s.tailMode=i)}function Vu(e,n,t){var r=n.pendingProps,i=r.revealOrder,s=r.tail;if(oe(e,n,r.children,t),r=b.current,r&2)r=r&1|2,n.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&qa(e,t,n);else if(e.tag===19)qa(e,t,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(_(b,r),!(n.mode&1))n.memoizedState=null;else switch(i){case"forwards":for(t=n.child,i=null;t!==null;)e=t.alternate,e!==null&&Qr(e)===null&&(i=t),t=t.sibling;t=i,t===null?(i=n.child,n.child=null):(i=t.sibling,t.sibling=null),Hi(n,!1,i,t,s);break;case"backwards":for(t=null,i=n.child,n.child=null;i!==null;){if(e=i.alternate,e!==null&&Qr(e)===null){n.child=i;break}e=i.sibling,i.sibling=t,t=i,i=e}Hi(n,!0,t,null,s);break;case"together":Hi(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function Nr(e,n){!(n.mode&1)&&e!==null&&(e.alternate=null,n.alternate=null,n.flags|=2)}function Je(e,n,t){if(e!==null&&(n.dependencies=e.dependencies),kn|=n.lanes,!(t&n.childLanes))return null;if(e!==null&&n.child!==e.child)throw Error(y(153));if(n.child!==null){for(e=n.child,t=pn(e,e.pendingProps),n.child=t,t.return=n;e.sibling!==null;)e=e.sibling,t=t.sibling=pn(e,e.pendingProps),t.return=n;t.sibling=null}return n.child}function fp(e,n,t){switch(n.tag){case 3:zu(n),nt();break;case 5:fu(n);break;case 1:me(n.type)&&Ur(n);break;case 4:go(n,n.stateNode.containerInfo);break;case 10:var r=n.type._context,i=n.memoizedProps.value;_(Br,r._currentValue),r._currentValue=i;break;case 13:if(r=n.memoizedState,r!==null)return r.dehydrated!==null?(_(b,b.current&1),n.flags|=128,null):t&n.child.childLanes?Uu(e,n,t):(_(b,b.current&1),e=Je(e,n,t),e!==null?e.sibling:null);_(b,b.current&1);break;case 19:if(r=(t&n.childLanes)!==0,e.flags&128){if(r)return Vu(e,n,t);n.flags|=128}if(i=n.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),_(b,b.current),r)break;return null;case 22:case 23:return n.lanes=0,Mu(e,n,t)}return Je(e,n,t)}var Hu,Rs,Bu,$u;Hu=function(e,n){for(var t=n.child;t!==null;){if(t.tag===5||t.tag===6)e.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break;for(;t.sibling===null;){if(t.return===null||t.return===n)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};Rs=function(){};Bu=function(e,n,t,r){var i=e.memoizedProps;if(i!==r){e=n.stateNode,Cn(be.current);var s=null;switch(t){case"input":i=Zi(e,i),r=Zi(e,r),s=[];break;case"select":i=U({},i,{value:void 0}),r=U({},r,{value:void 0}),s=[];break;case"textarea":i=ts(e,i),r=ts(e,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=br)}is(t,r);var o;t=null;for(c in i)if(!r.hasOwnProperty(c)&&i.hasOwnProperty(c)&&i[c]!=null)if(c==="style"){var a=i[c];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(It.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in r){var l=r[c];if(a=i!=null?i[c]:void 0,r.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(t||(t={}),t[o]=l[o])}else t||(s||(s=[]),s.push(c,t)),t=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(It.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&O("scroll",e),s||a===l||(s=[])):(s=s||[]).push(c,l))}t&&(s=s||[]).push("style",t);var c=s;(n.updateQueue=c)&&(n.flags|=4)}};$u=function(e,n,t,r){t!==r&&(n.flags|=4)};function ht(e,n){if(!M)switch(e.tailMode){case"hidden":n=e.tail;for(var t=null;n!==null;)n.alternate!==null&&(t=n),n=n.sibling;t===null?e.tail=null:t.sibling=null;break;case"collapsed":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function re(e){var n=e.alternate!==null&&e.alternate.child===e.child,t=0,r=0;if(n)for(var i=e.child;i!==null;)t|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)t|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=t,n}function vp(e,n,t){var r=n.pendingProps;switch(lo(n),n.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return re(n),null;case 1:return me(n.type)&&zr(),re(n),null;case 3:return r=n.stateNode,rt(),F(pe),F(se),yo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(mr(n)?n.flags|=4:e===null||e.memoizedState.isDehydrated&&!(n.flags&256)||(n.flags|=1024,Re!==null&&(bs(Re),Re=null))),Rs(e,n),re(n),null;case 5:ho(n);var i=Cn(Bt.current);if(t=n.type,e!==null&&n.stateNode!=null)Bu(e,n,t,r,i),e.ref!==n.ref&&(n.flags|=512,n.flags|=2097152);else{if(!r){if(n.stateNode===null)throw Error(y(166));return re(n),null}if(e=Cn(be.current),mr(n)){r=n.stateNode,t=n.type;var s=n.memoizedProps;switch(r[Fe]=n,r[Vt]=s,e=(n.mode&1)!==0,t){case"dialog":O("cancel",r),O("close",r);break;case"iframe":case"object":case"embed":O("load",r);break;case"video":case"audio":for(i=0;i<jt.length;i++)O(jt[i],r);break;case"source":O("error",r);break;case"img":case"image":case"link":O("error",r),O("load",r);break;case"details":O("toggle",r);break;case"input":Ho(r,s),O("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},O("invalid",r);break;case"textarea":$o(r,s),O("invalid",r)}is(t,s),i=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?r.textContent!==a&&(s.suppressHydrationWarning!==!0&&pr(r.textContent,a,e),i=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&pr(r.textContent,a,e),i=["children",""+a]):It.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&O("scroll",r)}switch(t){case"input":ir(r),Bo(r,s,!0);break;case"textarea":ir(r),Go(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=br)}r=i,n.updateQueue=r,r!==null&&(n.flags|=4)}else{o=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=El(t)),e==="http://www.w3.org/1999/xhtml"?t==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(t,{is:r.is}):(e=o.createElement(t),t==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,t),e[Fe]=n,e[Vt]=r,Hu(e,n,!1,!1),n.stateNode=e;e:{switch(o=ss(t,r),t){case"dialog":O("cancel",e),O("close",e),i=r;break;case"iframe":case"object":case"embed":O("load",e),i=r;break;case"video":case"audio":for(i=0;i<jt.length;i++)O(jt[i],e);i=r;break;case"source":O("error",e),i=r;break;case"img":case"image":case"link":O("error",e),O("load",e),i=r;break;case"details":O("toggle",e),i=r;break;case"input":Ho(e,r),i=Zi(e,r),O("invalid",e);break;case"option":i=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},i=U({},r,{value:void 0}),O("invalid",e);break;case"textarea":$o(e,r),i=ts(e,r),O("invalid",e);break;default:i=r}is(t,i),a=i;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?jl(e,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&xl(e,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&Dt(e,l):typeof l=="number"&&Dt(e,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(It.hasOwnProperty(s)?l!=null&&s==="onScroll"&&O("scroll",e):l!=null&&Qs(e,s,l,o))}switch(t){case"input":ir(e),Bo(e,r,!1);break;case"textarea":ir(e),Go(e);break;case"option":r.value!=null&&e.setAttribute("value",""+mn(r.value));break;case"select":e.multiple=!!r.multiple,s=r.value,s!=null?Qn(e,!!r.multiple,s,!1):r.defaultValue!=null&&Qn(e,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=br)}switch(t){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(n.flags|=4)}n.ref!==null&&(n.flags|=512,n.flags|=2097152)}return re(n),null;case 6:if(e&&n.stateNode!=null)$u(e,n,e.memoizedProps,r);else{if(typeof r!="string"&&n.stateNode===null)throw Error(y(166));if(t=Cn(Bt.current),Cn(be.current),mr(n)){if(r=n.stateNode,t=n.memoizedProps,r[Fe]=n,(s=r.nodeValue!==t)&&(e=he,e!==null))switch(e.tag){case 3:pr(r.nodeValue,t,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&pr(r.nodeValue,t,(e.mode&1)!==0)}s&&(n.flags|=4)}else r=(t.nodeType===9?t:t.ownerDocument).createTextNode(r),r[Fe]=n,n.stateNode=r}return re(n),null;case 13:if(F(b),r=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(M&&ge!==null&&n.mode&1&&!(n.flags&128))uu(),nt(),n.flags|=98560,s=!1;else if(s=mr(n),r!==null&&r.dehydrated!==null){if(e===null){if(!s)throw Error(y(318));if(s=n.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(y(317));s[Fe]=n}else nt(),!(n.flags&128)&&(n.memoizedState=null),n.flags|=4;re(n),s=!1}else Re!==null&&(bs(Re),Re=null),s=!0;if(!s)return n.flags&65536?n:null}return n.flags&128?(n.lanes=t,n):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(n.child.flags|=8192,n.mode&1&&(e===null||b.current&1?W===0&&(W=3):ko())),n.updateQueue!==null&&(n.flags|=4),re(n),null);case 4:return rt(),Rs(e,n),e===null&&zt(n.stateNode.containerInfo),re(n),null;case 10:return mo(n.type._context),re(n),null;case 17:return me(n.type)&&zr(),re(n),null;case 19:if(F(b),s=n.memoizedState,s===null)return re(n),null;if(r=(n.flags&128)!==0,o=s.rendering,o===null)if(r)ht(s,!1);else{if(W!==0||e!==null&&e.flags&128)for(e=n.child;e!==null;){if(o=Qr(e),o!==null){for(n.flags|=128,ht(s,!1),r=o.updateQueue,r!==null&&(n.updateQueue=r,n.flags|=4),n.subtreeFlags=0,r=t,t=n.child;t!==null;)s=t,e=r,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,e=o.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t=t.sibling;return _(b,b.current&1|2),n.child}e=e.sibling}s.tail!==null&&$()>st&&(n.flags|=128,r=!0,ht(s,!1),n.lanes=4194304)}else{if(!r)if(e=Qr(o),e!==null){if(n.flags|=128,r=!0,t=e.updateQueue,t!==null&&(n.updateQueue=t,n.flags|=4),ht(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!M)return re(n),null}else 2*$()-s.renderingStartTime>st&&t!==1073741824&&(n.flags|=128,r=!0,ht(s,!1),n.lanes=4194304);s.isBackwards?(o.sibling=n.child,n.child=o):(t=s.last,t!==null?t.sibling=o:n.child=o,s.last=o)}return s.tail!==null?(n=s.tail,s.rendering=n,s.tail=n.sibling,s.renderingStartTime=$(),n.sibling=null,t=b.current,_(b,r?t&1|2:t&1),n):(re(n),null);case 22:case 23:return Po(),r=n.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(n.flags|=8192),r&&n.mode&1?ve&1073741824&&(re(n),n.subtreeFlags&6&&(n.flags|=8192)):re(n),null;case 24:return null;case 25:return null}throw Error(y(156,n.tag))}function gp(e,n){switch(lo(n),n.tag){case 1:return me(n.type)&&zr(),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return rt(),F(pe),F(se),yo(),e=n.flags,e&65536&&!(e&128)?(n.flags=e&-65537|128,n):null;case 5:return ho(n),null;case 13:if(F(b),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(y(340));nt()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return F(b),null;case 4:return rt(),null;case 10:return mo(n.type._context),null;case 22:case 23:return Po(),null;case 24:return null;default:return null}}var gr=!1,ie=!1,hp=typeof WeakSet=="function"?WeakSet:Set,j=null;function $n(e,n){var t=e.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(r){V(e,n,r)}else t.current=null}function Is(e,n,t){try{t()}catch(r){V(e,n,r)}}var _a=!1;function yp(e,n){if(vs=Or,e=Kl(),oo(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{t=(t=e.ownerDocument)&&t.defaultView||window;var r=t.getSelection&&t.getSelection();if(r&&r.rangeCount!==0){t=r.anchorNode;var i=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,a=-1,l=-1,c=0,g=0,v=e,m=null;n:for(;;){for(var E;v!==t||i!==0&&v.nodeType!==3||(a=o+i),v!==s||r!==0&&v.nodeType!==3||(l=o+r),v.nodeType===3&&(o+=v.nodeValue.length),(E=v.firstChild)!==null;)m=v,v=E;for(;;){if(v===e)break n;if(m===t&&++c===i&&(a=o),m===s&&++g===r&&(l=o),(E=v.nextSibling)!==null)break;v=m,m=v.parentNode}v=E}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(gs={focusedElem:e,selectionRange:t},Or=!1,j=n;j!==null;)if(n=j,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,j=e;else for(;j!==null;){n=j;try{var x=n.alternate;if(n.flags&1024)switch(n.tag){case 0:case 11:case 15:break;case 1:if(x!==null){var S=x.memoizedProps,T=x.memoizedState,d=n.stateNode,u=d.getSnapshotBeforeUpdate(n.elementType===n.type?S:Pe(n.type,S),T);d.__reactInternalSnapshotBeforeUpdate=u}break;case 3:var p=n.stateNode.containerInfo;p.nodeType===1?p.textContent="":p.nodeType===9&&p.documentElement&&p.removeChild(p.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(y(163))}}catch(h){V(n,n.return,h)}if(e=n.sibling,e!==null){e.return=n.return,j=e;break}j=n.return}return x=_a,_a=!1,x}function Pt(e,n,t){var r=n.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var s=i.destroy;i.destroy=void 0,s!==void 0&&Is(n,t,s)}i=i.next}while(i!==r)}}function di(e,n){if(n=n.updateQueue,n=n!==null?n.lastEffect:null,n!==null){var t=n=n.next;do{if((t.tag&e)===e){var r=t.create;t.destroy=r()}t=t.next}while(t!==n)}}function Ds(e){var n=e.ref;if(n!==null){var t=e.stateNode;switch(e.tag){case 5:e=t;break;default:e=t}typeof n=="function"?n(e):n.current=e}}function Gu(e){var n=e.alternate;n!==null&&(e.alternate=null,Gu(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&(delete n[Fe],delete n[Vt],delete n[Es],delete n[ep],delete n[np])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Qu(e){return e.tag===5||e.tag===3||e.tag===4}function Oa(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Qu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function qs(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.nodeType===8?t.parentNode.insertBefore(e,n):t.insertBefore(e,n):(t.nodeType===8?(n=t.parentNode,n.insertBefore(e,t)):(n=t,n.appendChild(e)),t=t._reactRootContainer,t!=null||n.onclick!==null||(n.onclick=br));else if(r!==4&&(e=e.child,e!==null))for(qs(e,n,t),e=e.sibling;e!==null;)qs(e,n,t),e=e.sibling}function _s(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.insertBefore(e,n):t.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(_s(e,n,t),e=e.sibling;e!==null;)_s(e,n,t),e=e.sibling}var Z=null,ke=!1;function Xe(e,n,t){for(t=t.child;t!==null;)Wu(e,n,t),t=t.sibling}function Wu(e,n,t){if(Me&&typeof Me.onCommitFiberUnmount=="function")try{Me.onCommitFiberUnmount(ti,t)}catch{}switch(t.tag){case 5:ie||$n(t,n);case 6:var r=Z,i=ke;Z=null,Xe(e,n,t),Z=r,ke=i,Z!==null&&(ke?(e=Z,t=t.stateNode,e.nodeType===8?e.parentNode.removeChild(t):e.removeChild(t)):Z.removeChild(t.stateNode));break;case 18:Z!==null&&(ke?(e=Z,t=t.stateNode,e.nodeType===8?Oi(e.parentNode,t):e.nodeType===1&&Oi(e,t),Ft(e)):Oi(Z,t.stateNode));break;case 4:r=Z,i=ke,Z=t.stateNode.containerInfo,ke=!0,Xe(e,n,t),Z=r,ke=i;break;case 0:case 11:case 14:case 15:if(!ie&&(r=t.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var s=i,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Is(t,n,o),i=i.next}while(i!==r)}Xe(e,n,t);break;case 1:if(!ie&&($n(t,n),r=t.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=t.memoizedProps,r.state=t.memoizedState,r.componentWillUnmount()}catch(a){V(t,n,a)}Xe(e,n,t);break;case 21:Xe(e,n,t);break;case 22:t.mode&1?(ie=(r=ie)||t.memoizedState!==null,Xe(e,n,t),ie=r):Xe(e,n,t);break;default:Xe(e,n,t)}}function Fa(e){var n=e.updateQueue;if(n!==null){e.updateQueue=null;var t=e.stateNode;t===null&&(t=e.stateNode=new hp),n.forEach(function(r){var i=Np.bind(null,e,r);t.has(r)||(t.add(r),r.then(i,i))})}}function Ae(e,n){var t=n.deletions;if(t!==null)for(var r=0;r<t.length;r++){var i=t[r];try{var s=e,o=n,a=o;e:for(;a!==null;){switch(a.tag){case 5:Z=a.stateNode,ke=!1;break e;case 3:Z=a.stateNode.containerInfo,ke=!0;break e;case 4:Z=a.stateNode.containerInfo,ke=!0;break e}a=a.return}if(Z===null)throw Error(y(160));Wu(s,o,i),Z=null,ke=!1;var l=i.alternate;l!==null&&(l.return=null),i.return=null}catch(c){V(i,n,c)}}if(n.subtreeFlags&12854)for(n=n.child;n!==null;)Ju(n,e),n=n.sibling}function Ju(e,n){var t=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Ae(n,e),_e(e),r&4){try{Pt(3,e,e.return),di(3,e)}catch(S){V(e,e.return,S)}try{Pt(5,e,e.return)}catch(S){V(e,e.return,S)}}break;case 1:Ae(n,e),_e(e),r&512&&t!==null&&$n(t,t.return);break;case 5:if(Ae(n,e),_e(e),r&512&&t!==null&&$n(t,t.return),e.flags&32){var i=e.stateNode;try{Dt(i,"")}catch(S){V(e,e.return,S)}}if(r&4&&(i=e.stateNode,i!=null)){var s=e.memoizedProps,o=t!==null?t.memoizedProps:s,a=e.type,l=e.updateQueue;if(e.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&hl(i,s),ss(a,o);var c=ss(a,s);for(o=0;o<l.length;o+=2){var g=l[o],v=l[o+1];g==="style"?jl(i,v):g==="dangerouslySetInnerHTML"?xl(i,v):g==="children"?Dt(i,v):Qs(i,g,v,c)}switch(a){case"input":es(i,s);break;case"textarea":yl(i,s);break;case"select":var m=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var E=s.value;E!=null?Qn(i,!!s.multiple,E,!1):m!==!!s.multiple&&(s.defaultValue!=null?Qn(i,!!s.multiple,s.defaultValue,!0):Qn(i,!!s.multiple,s.multiple?[]:"",!1))}i[Vt]=s}catch(S){V(e,e.return,S)}}break;case 6:if(Ae(n,e),_e(e),r&4){if(e.stateNode===null)throw Error(y(162));i=e.stateNode,s=e.memoizedProps;try{i.nodeValue=s}catch(S){V(e,e.return,S)}}break;case 3:if(Ae(n,e),_e(e),r&4&&t!==null&&t.memoizedState.isDehydrated)try{Ft(n.containerInfo)}catch(S){V(e,e.return,S)}break;case 4:Ae(n,e),_e(e);break;case 13:Ae(n,e),_e(e),i=e.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(No=$())),r&4&&Fa(e);break;case 22:if(g=t!==null&&t.memoizedState!==null,e.mode&1?(ie=(c=ie)||g,Ae(n,e),ie=c):Ae(n,e),_e(e),r&8192){if(c=e.memoizedState!==null,(e.stateNode.isHidden=c)&&!g&&e.mode&1)for(j=e,g=e.child;g!==null;){for(v=j=g;j!==null;){switch(m=j,E=m.child,m.tag){case 0:case 11:case 14:case 15:Pt(4,m,m.return);break;case 1:$n(m,m.return);var x=m.stateNode;if(typeof x.componentWillUnmount=="function"){r=m,t=m.return;try{n=r,x.props=n.memoizedProps,x.state=n.memoizedState,x.componentWillUnmount()}catch(S){V(r,t,S)}}break;case 5:$n(m,m.return);break;case 22:if(m.memoizedState!==null){ba(v);continue}}E!==null?(E.return=m,j=E):ba(v)}g=g.sibling}e:for(g=null,v=e;;){if(v.tag===5){if(g===null){g=v;try{i=v.stateNode,c?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=v.stateNode,l=v.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=Sl("display",o))}catch(S){V(e,e.return,S)}}}else if(v.tag===6){if(g===null)try{v.stateNode.nodeValue=c?"":v.memoizedProps}catch(S){V(e,e.return,S)}}else if((v.tag!==22&&v.tag!==23||v.memoizedState===null||v===e)&&v.child!==null){v.child.return=v,v=v.child;continue}if(v===e)break e;for(;v.sibling===null;){if(v.return===null||v.return===e)break e;g===v&&(g=null),v=v.return}g===v&&(g=null),v.sibling.return=v.return,v=v.sibling}}break;case 19:Ae(n,e),_e(e),r&4&&Fa(e);break;case 21:break;default:Ae(n,e),_e(e)}}function _e(e){var n=e.flags;if(n&2){try{e:{for(var t=e.return;t!==null;){if(Qu(t)){var r=t;break e}t=t.return}throw Error(y(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(Dt(i,""),r.flags&=-33);var s=Oa(e);_s(e,s,i);break;case 3:case 4:var o=r.stateNode.containerInfo,a=Oa(e);qs(e,a,o);break;default:throw Error(y(161))}}catch(l){V(e,e.return,l)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function Ep(e,n,t){j=e,Ku(e)}function Ku(e,n,t){for(var r=(e.mode&1)!==0;j!==null;){var i=j,s=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||gr;if(!o){var a=i.alternate,l=a!==null&&a.memoizedState!==null||ie;a=gr;var c=ie;if(gr=o,(ie=l)&&!c)for(j=i;j!==null;)o=j,l=o.child,o.tag===22&&o.memoizedState!==null?za(i):l!==null?(l.return=o,j=l):za(i);for(;s!==null;)j=s,Ku(s),s=s.sibling;j=i,gr=a,ie=c}Ma(e)}else i.subtreeFlags&8772&&s!==null?(s.return=i,j=s):Ma(e)}}function Ma(e){for(;j!==null;){var n=j;if(n.flags&8772){var t=n.alternate;try{if(n.flags&8772)switch(n.tag){case 0:case 11:case 15:ie||di(5,n);break;case 1:var r=n.stateNode;if(n.flags&4&&!ie)if(t===null)r.componentDidMount();else{var i=n.elementType===n.type?t.memoizedProps:Pe(n.type,t.memoizedProps);r.componentDidUpdate(i,t.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=n.updateQueue;s!==null&&ja(n,s,r);break;case 3:var o=n.updateQueue;if(o!==null){if(t=null,n.child!==null)switch(n.child.tag){case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}ja(n,o,t)}break;case 5:var a=n.stateNode;if(t===null&&n.flags&4){t=a;var l=n.memoizedProps;switch(n.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(n.memoizedState===null){var c=n.alternate;if(c!==null){var g=c.memoizedState;if(g!==null){var v=g.dehydrated;v!==null&&Ft(v)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(y(163))}ie||n.flags&512&&Ds(n)}catch(m){V(n,n.return,m)}}if(n===e){j=null;break}if(t=n.sibling,t!==null){t.return=n.return,j=t;break}j=n.return}}function ba(e){for(;j!==null;){var n=j;if(n===e){j=null;break}var t=n.sibling;if(t!==null){t.return=n.return,j=t;break}j=n.return}}function za(e){for(;j!==null;){var n=j;try{switch(n.tag){case 0:case 11:case 15:var t=n.return;try{di(4,n)}catch(l){V(n,t,l)}break;case 1:var r=n.stateNode;if(typeof r.componentDidMount=="function"){var i=n.return;try{r.componentDidMount()}catch(l){V(n,i,l)}}var s=n.return;try{Ds(n)}catch(l){V(n,s,l)}break;case 5:var o=n.return;try{Ds(n)}catch(l){V(n,o,l)}}}catch(l){V(n,n.return,l)}if(n===e){j=null;break}var a=n.sibling;if(a!==null){a.return=n.return,j=a;break}j=n.return}}var xp=Math.ceil,Kr=Ke.ReactCurrentDispatcher,wo=Ke.ReactCurrentOwner,Ce=Ke.ReactCurrentBatchConfig,D=0,Y=null,G=null,ee=0,ve=0,Gn=gn(0),W=0,Wt=null,kn=0,ci=0,To=0,kt=null,de=null,No=0,st=1/0,Ue=null,Xr=!1,Os=null,dn=null,hr=!1,rn=null,Yr=0,Rt=0,Fs=null,Ar=-1,Pr=0;function ae(){return D&6?$():Ar!==-1?Ar:Ar=$()}function cn(e){return e.mode&1?D&2&&ee!==0?ee&-ee:rp.transition!==null?(Pr===0&&(Pr=ql()),Pr):(e=q,e!==0||(e=window.event,e=e===void 0?16:Ul(e.type)),e):1}function De(e,n,t,r){if(50<Rt)throw Rt=0,Fs=null,Error(y(185));Kt(e,t,r),(!(D&2)||e!==Y)&&(e===Y&&(!(D&2)&&(ci|=t),W===4&&nn(e,ee)),fe(e,r),t===1&&D===0&&!(n.mode&1)&&(st=$()+500,ai&&hn()))}function fe(e,n){var t=e.callbackNode;rc(e,n);var r=_r(e,e===Y?ee:0);if(r===0)t!==null&&Jo(t),e.callbackNode=null,e.callbackPriority=0;else if(n=r&-r,e.callbackPriority!==n){if(t!=null&&Jo(t),n===1)e.tag===0?tp(Ua.bind(null,e)):ou(Ua.bind(null,e)),Yc(function(){!(D&6)&&hn()}),t=null;else{switch(_l(r)){case 1:t=Ys;break;case 4:t=Il;break;case 16:t=qr;break;case 536870912:t=Dl;break;default:t=qr}t=id(t,Xu.bind(null,e))}e.callbackPriority=n,e.callbackNode=t}}function Xu(e,n){if(Ar=-1,Pr=0,D&6)throw Error(y(327));var t=e.callbackNode;if(Yn()&&e.callbackNode!==t)return null;var r=_r(e,e===Y?ee:0);if(r===0)return null;if(r&30||r&e.expiredLanes||n)n=Zr(e,r);else{n=r;var i=D;D|=2;var s=Zu();(Y!==e||ee!==n)&&(Ue=null,st=$()+500,wn(e,n));do try{Lp();break}catch(a){Yu(e,a)}while(!0);po(),Kr.current=s,D=i,G!==null?n=0:(Y=null,ee=0,n=W)}if(n!==0){if(n===2&&(i=ds(e),i!==0&&(r=i,n=Ms(e,i))),n===1)throw t=Wt,wn(e,0),nn(e,r),fe(e,$()),t;if(n===6)nn(e,r);else{if(i=e.current.alternate,!(r&30)&&!Sp(i)&&(n=Zr(e,r),n===2&&(s=ds(e),s!==0&&(r=s,n=Ms(e,s))),n===1))throw t=Wt,wn(e,0),nn(e,r),fe(e,$()),t;switch(e.finishedWork=i,e.finishedLanes=r,n){case 0:case 1:throw Error(y(345));case 2:Sn(e,de,Ue);break;case 3:if(nn(e,r),(r&130023424)===r&&(n=No+500-$(),10<n)){if(_r(e,0)!==0)break;if(i=e.suspendedLanes,(i&r)!==r){ae(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=ys(Sn.bind(null,e,de,Ue),n);break}Sn(e,de,Ue);break;case 4:if(nn(e,r),(r&4194240)===r)break;for(n=e.eventTimes,i=-1;0<r;){var o=31-Ie(r);s=1<<o,o=n[o],o>i&&(i=o),r&=~s}if(r=i,r=$()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*xp(r/1960))-r,10<r){e.timeoutHandle=ys(Sn.bind(null,e,de,Ue),r);break}Sn(e,de,Ue);break;case 5:Sn(e,de,Ue);break;default:throw Error(y(329))}}}return fe(e,$()),e.callbackNode===t?Xu.bind(null,e):null}function Ms(e,n){var t=kt;return e.current.memoizedState.isDehydrated&&(wn(e,n).flags|=256),e=Zr(e,n),e!==2&&(n=de,de=t,n!==null&&bs(n)),e}function bs(e){de===null?de=e:de.push.apply(de,e)}function Sp(e){for(var n=e;;){if(n.flags&16384){var t=n.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var r=0;r<t.length;r++){var i=t[r],s=i.getSnapshot;i=i.value;try{if(!qe(s(),i))return!1}catch{return!1}}}if(t=n.child,n.subtreeFlags&16384&&t!==null)t.return=n,n=t;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function nn(e,n){for(n&=~To,n&=~ci,e.suspendedLanes|=n,e.pingedLanes&=~n,e=e.expirationTimes;0<n;){var t=31-Ie(n),r=1<<t;e[t]=-1,n&=~r}}function Ua(e){if(D&6)throw Error(y(327));Yn();var n=_r(e,0);if(!(n&1))return fe(e,$()),null;var t=Zr(e,n);if(e.tag!==0&&t===2){var r=ds(e);r!==0&&(n=r,t=Ms(e,r))}if(t===1)throw t=Wt,wn(e,0),nn(e,n),fe(e,$()),t;if(t===6)throw Error(y(345));return e.finishedWork=e.current.alternate,e.finishedLanes=n,Sn(e,de,Ue),fe(e,$()),null}function Ao(e,n){var t=D;D|=1;try{return e(n)}finally{D=t,D===0&&(st=$()+500,ai&&hn())}}function Rn(e){rn!==null&&rn.tag===0&&!(D&6)&&Yn();var n=D;D|=1;var t=Ce.transition,r=q;try{if(Ce.transition=null,q=1,e)return e()}finally{q=r,Ce.transition=t,D=n,!(D&6)&&hn()}}function Po(){ve=Gn.current,F(Gn)}function wn(e,n){e.finishedWork=null,e.finishedLanes=0;var t=e.timeoutHandle;if(t!==-1&&(e.timeoutHandle=-1,Xc(t)),G!==null)for(t=G.return;t!==null;){var r=t;switch(lo(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&zr();break;case 3:rt(),F(pe),F(se),yo();break;case 5:ho(r);break;case 4:rt();break;case 13:F(b);break;case 19:F(b);break;case 10:mo(r.type._context);break;case 22:case 23:Po()}t=t.return}if(Y=e,G=e=pn(e.current,null),ee=ve=n,W=0,Wt=null,To=ci=kn=0,de=kt=null,Ln!==null){for(n=0;n<Ln.length;n++)if(t=Ln[n],r=t.interleaved,r!==null){t.interleaved=null;var i=r.next,s=t.pending;if(s!==null){var o=s.next;s.next=i,r.next=o}t.pending=r}Ln=null}return e}function Yu(e,n){do{var t=G;try{if(po(),wr.current=Jr,Wr){for(var r=z.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}Wr=!1}if(Pn=0,X=Q=z=null,At=!1,$t=0,wo.current=null,t===null||t.return===null){W=1,Wt=n,G=null;break}e:{var s=e,o=t.return,a=t,l=n;if(n=ee,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,g=a,v=g.tag;if(!(g.mode&1)&&(v===0||v===11||v===15)){var m=g.alternate;m?(g.updateQueue=m.updateQueue,g.memoizedState=m.memoizedState,g.lanes=m.lanes):(g.updateQueue=null,g.memoizedState=null)}var E=Aa(o);if(E!==null){E.flags&=-257,Pa(E,o,a,s,n),E.mode&1&&Na(s,c,n),n=E,l=c;var x=n.updateQueue;if(x===null){var S=new Set;S.add(l),n.updateQueue=S}else x.add(l);break e}else{if(!(n&1)){Na(s,c,n),ko();break e}l=Error(y(426))}}else if(M&&a.mode&1){var T=Aa(o);if(T!==null){!(T.flags&65536)&&(T.flags|=256),Pa(T,o,a,s,n),uo(it(l,a));break e}}s=l=it(l,a),W!==4&&(W=2),kt===null?kt=[s]:kt.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,n&=-n,s.lanes|=n;var d=_u(s,l,n);Sa(s,d);break e;case 1:a=l;var u=s.type,p=s.stateNode;if(!(s.flags&128)&&(typeof u.getDerivedStateFromError=="function"||p!==null&&typeof p.componentDidCatch=="function"&&(dn===null||!dn.has(p)))){s.flags|=65536,n&=-n,s.lanes|=n;var h=Ou(s,a,n);Sa(s,h);break e}}s=s.return}while(s!==null)}nd(t)}catch(L){n=L,G===t&&t!==null&&(G=t=t.return);continue}break}while(!0)}function Zu(){var e=Kr.current;return Kr.current=Jr,e===null?Jr:e}function ko(){(W===0||W===3||W===2)&&(W=4),Y===null||!(kn&268435455)&&!(ci&268435455)||nn(Y,ee)}function Zr(e,n){var t=D;D|=2;var r=Zu();(Y!==e||ee!==n)&&(Ue=null,wn(e,n));do try{jp();break}catch(i){Yu(e,i)}while(!0);if(po(),D=t,Kr.current=r,G!==null)throw Error(y(261));return Y=null,ee=0,W}function jp(){for(;G!==null;)ed(G)}function Lp(){for(;G!==null&&!Wd();)ed(G)}function ed(e){var n=rd(e.alternate,e,ve);e.memoizedProps=e.pendingProps,n===null?nd(e):G=n,wo.current=null}function nd(e){var n=e;do{var t=n.alternate;if(e=n.return,n.flags&32768){if(t=gp(t,n),t!==null){t.flags&=32767,G=t;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{W=6,G=null;return}}else if(t=vp(t,n,ve),t!==null){G=t;return}if(n=n.sibling,n!==null){G=n;return}G=n=e}while(n!==null);W===0&&(W=5)}function Sn(e,n,t){var r=q,i=Ce.transition;try{Ce.transition=null,q=1,Cp(e,n,t,r)}finally{Ce.transition=i,q=r}return null}function Cp(e,n,t,r){do Yn();while(rn!==null);if(D&6)throw Error(y(327));t=e.finishedWork;var i=e.finishedLanes;if(t===null)return null;if(e.finishedWork=null,e.finishedLanes=0,t===e.current)throw Error(y(177));e.callbackNode=null,e.callbackPriority=0;var s=t.lanes|t.childLanes;if(ic(e,s),e===Y&&(G=Y=null,ee=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||hr||(hr=!0,id(qr,function(){return Yn(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=Ce.transition,Ce.transition=null;var o=q;q=1;var a=D;D|=4,wo.current=null,yp(e,t),Ju(t,e),Bc(gs),Or=!!vs,gs=vs=null,e.current=t,Ep(t),Jd(),D=a,q=o,Ce.transition=s}else e.current=t;if(hr&&(hr=!1,rn=e,Yr=i),s=e.pendingLanes,s===0&&(dn=null),Yd(t.stateNode),fe(e,$()),n!==null)for(r=e.onRecoverableError,t=0;t<n.length;t++)i=n[t],r(i.value,{componentStack:i.stack,digest:i.digest});if(Xr)throw Xr=!1,e=Os,Os=null,e;return Yr&1&&e.tag!==0&&Yn(),s=e.pendingLanes,s&1?e===Fs?Rt++:(Rt=0,Fs=e):Rt=0,hn(),null}function Yn(){if(rn!==null){var e=_l(Yr),n=Ce.transition,t=q;try{if(Ce.transition=null,q=16>e?16:e,rn===null)var r=!1;else{if(e=rn,rn=null,Yr=0,D&6)throw Error(y(331));var i=D;for(D|=4,j=e.current;j!==null;){var s=j,o=s.child;if(j.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(j=c;j!==null;){var g=j;switch(g.tag){case 0:case 11:case 15:Pt(8,g,s)}var v=g.child;if(v!==null)v.return=g,j=v;else for(;j!==null;){g=j;var m=g.sibling,E=g.return;if(Gu(g),g===c){j=null;break}if(m!==null){m.return=E,j=m;break}j=E}}}var x=s.alternate;if(x!==null){var S=x.child;if(S!==null){x.child=null;do{var T=S.sibling;S.sibling=null,S=T}while(S!==null)}}j=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,j=o;else e:for(;j!==null;){if(s=j,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Pt(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,j=d;break e}j=s.return}}var u=e.current;for(j=u;j!==null;){o=j;var p=o.child;if(o.subtreeFlags&2064&&p!==null)p.return=o,j=p;else e:for(o=u;j!==null;){if(a=j,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:di(9,a)}}catch(L){V(a,a.return,L)}if(a===o){j=null;break e}var h=a.sibling;if(h!==null){h.return=a.return,j=h;break e}j=a.return}}if(D=i,hn(),Me&&typeof Me.onPostCommitFiberRoot=="function")try{Me.onPostCommitFiberRoot(ti,e)}catch{}r=!0}return r}finally{q=t,Ce.transition=n}}return!1}function Va(e,n,t){n=it(t,n),n=_u(e,n,1),e=un(e,n,1),n=ae(),e!==null&&(Kt(e,1,n),fe(e,n))}function V(e,n,t){if(e.tag===3)Va(e,e,t);else for(;n!==null;){if(n.tag===3){Va(n,e,t);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(dn===null||!dn.has(r))){e=it(t,e),e=Ou(n,e,1),n=un(n,e,1),e=ae(),n!==null&&(Kt(n,1,e),fe(n,e));break}}n=n.return}}function wp(e,n,t){var r=e.pingCache;r!==null&&r.delete(n),n=ae(),e.pingedLanes|=e.suspendedLanes&t,Y===e&&(ee&t)===t&&(W===4||W===3&&(ee&130023424)===ee&&500>$()-No?wn(e,0):To|=t),fe(e,n)}function td(e,n){n===0&&(e.mode&1?(n=ar,ar<<=1,!(ar&130023424)&&(ar=4194304)):n=1);var t=ae();e=We(e,n),e!==null&&(Kt(e,n,t),fe(e,t))}function Tp(e){var n=e.memoizedState,t=0;n!==null&&(t=n.retryLane),td(e,t)}function Np(e,n){var t=0;switch(e.tag){case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(t=i.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(y(314))}r!==null&&r.delete(n),td(e,t)}var rd;rd=function(e,n,t){if(e!==null)if(e.memoizedProps!==n.pendingProps||pe.current)ce=!0;else{if(!(e.lanes&t)&&!(n.flags&128))return ce=!1,fp(e,n,t);ce=!!(e.flags&131072)}else ce=!1,M&&n.flags&1048576&&au(n,Hr,n.index);switch(n.lanes=0,n.tag){case 2:var r=n.type;Nr(e,n),e=n.pendingProps;var i=et(n,se.current);Xn(n,t),i=xo(null,n,r,e,i,t);var s=So();return n.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(n.tag=1,n.memoizedState=null,n.updateQueue=null,me(r)?(s=!0,Ur(n)):s=!1,n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,vo(n),i.updater=ui,n.stateNode=i,i._reactInternals=n,ws(n,r,e,t),n=As(null,n,r,!0,s,t)):(n.tag=0,M&&s&&ao(n),oe(null,n,i,t),n=n.child),n;case 16:r=n.elementType;e:{switch(Nr(e,n),e=n.pendingProps,i=r._init,r=i(r._payload),n.type=r,i=n.tag=Pp(r),e=Pe(r,e),i){case 0:n=Ns(null,n,r,e,t);break e;case 1:n=Ia(null,n,r,e,t);break e;case 11:n=ka(null,n,r,e,t);break e;case 14:n=Ra(null,n,r,Pe(r.type,e),t);break e}throw Error(y(306,r,""))}return n;case 0:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Pe(r,i),Ns(e,n,r,i,t);case 1:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Pe(r,i),Ia(e,n,r,i,t);case 3:e:{if(zu(n),e===null)throw Error(y(387));r=n.pendingProps,s=n.memoizedState,i=s.element,mu(e,n),Gr(n,r,null,t);var o=n.memoizedState;if(r=o.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},n.updateQueue.baseState=s,n.memoizedState=s,n.flags&256){i=it(Error(y(423)),n),n=Da(e,n,r,t,i);break e}else if(r!==i){i=it(Error(y(424)),n),n=Da(e,n,r,t,i);break e}else for(ge=ln(n.stateNode.containerInfo.firstChild),he=n,M=!0,Re=null,t=cu(n,null,r,t),n.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(nt(),r===i){n=Je(e,n,t);break e}oe(e,n,r,t)}n=n.child}return n;case 5:return fu(n),e===null&&js(n),r=n.type,i=n.pendingProps,s=e!==null?e.memoizedProps:null,o=i.children,hs(r,i)?o=null:s!==null&&hs(r,s)&&(n.flags|=32),bu(e,n),oe(e,n,o,t),n.child;case 6:return e===null&&js(n),null;case 13:return Uu(e,n,t);case 4:return go(n,n.stateNode.containerInfo),r=n.pendingProps,e===null?n.child=tt(n,null,r,t):oe(e,n,r,t),n.child;case 11:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Pe(r,i),ka(e,n,r,i,t);case 7:return oe(e,n,n.pendingProps,t),n.child;case 8:return oe(e,n,n.pendingProps.children,t),n.child;case 12:return oe(e,n,n.pendingProps.children,t),n.child;case 10:e:{if(r=n.type._context,i=n.pendingProps,s=n.memoizedProps,o=i.value,_(Br,r._currentValue),r._currentValue=o,s!==null)if(qe(s.value,o)){if(s.children===i.children&&!pe.current){n=Je(e,n,t);break e}}else for(s=n.child,s!==null&&(s.return=n);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===r){if(s.tag===1){l=$e(-1,t&-t),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var g=c.pending;g===null?l.next=l:(l.next=g.next,g.next=l),c.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),Ls(s.return,t,n),a.lanes|=t;break}l=l.next}}else if(s.tag===10)o=s.type===n.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(y(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),Ls(o,t,n),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===n){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}oe(e,n,i.children,t),n=n.child}return n;case 9:return i=n.type,r=n.pendingProps.children,Xn(n,t),i=we(i),r=r(i),n.flags|=1,oe(e,n,r,t),n.child;case 14:return r=n.type,i=Pe(r,n.pendingProps),i=Pe(r.type,i),Ra(e,n,r,i,t);case 15:return Fu(e,n,n.type,n.pendingProps,t);case 17:return r=n.type,i=n.pendingProps,i=n.elementType===r?i:Pe(r,i),Nr(e,n),n.tag=1,me(r)?(e=!0,Ur(n)):e=!1,Xn(n,t),qu(n,r,i),ws(n,r,i,t),As(null,n,r,!0,e,t);case 19:return Vu(e,n,t);case 22:return Mu(e,n,t)}throw Error(y(156,n.tag))};function id(e,n){return Rl(e,n)}function Ap(e,n,t,r){this.tag=e,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Le(e,n,t,r){return new Ap(e,n,t,r)}function Ro(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Pp(e){if(typeof e=="function")return Ro(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Js)return 11;if(e===Ks)return 14}return 2}function pn(e,n){var t=e.alternate;return t===null?(t=Le(e.tag,n,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=n,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=e.flags&14680064,t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,n=e.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},t.sibling=e.sibling,t.index=e.index,t.ref=e.ref,t}function kr(e,n,t,r,i,s){var o=2;if(r=e,typeof e=="function")Ro(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case On:return Tn(t.children,i,s,n);case Ws:o=8,i|=8;break;case Ji:return e=Le(12,t,n,i|2),e.elementType=Ji,e.lanes=s,e;case Ki:return e=Le(13,t,n,i),e.elementType=Ki,e.lanes=s,e;case Xi:return e=Le(19,t,n,i),e.elementType=Xi,e.lanes=s,e;case fl:return pi(t,i,s,n);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case pl:o=10;break e;case ml:o=9;break e;case Js:o=11;break e;case Ks:o=14;break e;case Ye:o=16,r=null;break e}throw Error(y(130,e==null?e:typeof e,""))}return n=Le(o,t,n,i),n.elementType=e,n.type=r,n.lanes=s,n}function Tn(e,n,t,r){return e=Le(7,e,r,n),e.lanes=t,e}function pi(e,n,t,r){return e=Le(22,e,r,n),e.elementType=fl,e.lanes=t,e.stateNode={isHidden:!1},e}function Bi(e,n,t){return e=Le(6,e,null,n),e.lanes=t,e}function $i(e,n,t){return n=Le(4,e.children!==null?e.children:[],e.key,n),n.lanes=t,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}function kp(e,n,t,r,i){this.tag=n,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=wi(0),this.expirationTimes=wi(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=wi(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Io(e,n,t,r,i,s,o,a,l){return e=new kp(e,n,t,a,l),n===1?(n=1,s===!0&&(n|=8)):n=0,s=Le(3,null,null,n),e.current=s,s.stateNode=e,s.memoizedState={element:r,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},vo(s),e}function Rp(e,n,t){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:_n,key:r==null?null:""+r,children:e,containerInfo:n,implementation:t}}function sd(e){if(!e)return fn;e=e._reactInternals;e:{if(Dn(e)!==e||e.tag!==1)throw Error(y(170));var n=e;do{switch(n.tag){case 3:n=n.stateNode.context;break e;case 1:if(me(n.type)){n=n.stateNode.__reactInternalMemoizedMergedChildContext;break e}}n=n.return}while(n!==null);throw Error(y(171))}if(e.tag===1){var t=e.type;if(me(t))return su(e,t,n)}return n}function od(e,n,t,r,i,s,o,a,l){return e=Io(t,r,!0,e,i,s,o,a,l),e.context=sd(null),t=e.current,r=ae(),i=cn(t),s=$e(r,i),s.callback=n??null,un(t,s,i),e.current.lanes=i,Kt(e,i,r),fe(e,r),e}function mi(e,n,t,r){var i=n.current,s=ae(),o=cn(i);return t=sd(t),n.context===null?n.context=t:n.pendingContext=t,n=$e(s,o),n.payload={element:e},r=r===void 0?null:r,r!==null&&(n.callback=r),e=un(i,n,o),e!==null&&(De(e,i,o,s),Cr(e,i,o)),o}function ei(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ha(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var t=e.retryLane;e.retryLane=t!==0&&t<n?t:n}}function Do(e,n){Ha(e,n),(e=e.alternate)&&Ha(e,n)}function Ip(){return null}var ad=typeof reportError=="function"?reportError:function(e){console.error(e)};function qo(e){this._internalRoot=e}fi.prototype.render=qo.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(y(409));mi(e,n,null,null)};fi.prototype.unmount=qo.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;Rn(function(){mi(null,e,null,null)}),n[Qe]=null}};function fi(e){this._internalRoot=e}fi.prototype.unstable_scheduleHydration=function(e){if(e){var n=Ml();e={blockedOn:null,target:e,priority:n};for(var t=0;t<en.length&&n!==0&&n<en[t].priority;t++);en.splice(t,0,e),t===0&&zl(e)}};function _o(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function vi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ba(){}function Dp(e,n,t,r,i){if(i){if(typeof r=="function"){var s=r;r=function(){var c=ei(o);s.call(c)}}var o=od(n,r,e,0,null,!1,!1,"",Ba);return e._reactRootContainer=o,e[Qe]=o.current,zt(e.nodeType===8?e.parentNode:e),Rn(),o}for(;i=e.lastChild;)e.removeChild(i);if(typeof r=="function"){var a=r;r=function(){var c=ei(l);a.call(c)}}var l=Io(e,0,!1,null,null,!1,!1,"",Ba);return e._reactRootContainer=l,e[Qe]=l.current,zt(e.nodeType===8?e.parentNode:e),Rn(function(){mi(n,l,t,r)}),l}function gi(e,n,t,r,i){var s=t._reactRootContainer;if(s){var o=s;if(typeof i=="function"){var a=i;i=function(){var l=ei(o);a.call(l)}}mi(n,o,e,i)}else o=Dp(t,n,e,i,r);return ei(o)}Ol=function(e){switch(e.tag){case 3:var n=e.stateNode;if(n.current.memoizedState.isDehydrated){var t=St(n.pendingLanes);t!==0&&(Zs(n,t|1),fe(n,$()),!(D&6)&&(st=$()+500,hn()))}break;case 13:Rn(function(){var r=We(e,1);if(r!==null){var i=ae();De(r,e,1,i)}}),Do(e,1)}};eo=function(e){if(e.tag===13){var n=We(e,134217728);if(n!==null){var t=ae();De(n,e,134217728,t)}Do(e,134217728)}};Fl=function(e){if(e.tag===13){var n=cn(e),t=We(e,n);if(t!==null){var r=ae();De(t,e,n,r)}Do(e,n)}};Ml=function(){return q};bl=function(e,n){var t=q;try{return q=e,n()}finally{q=t}};as=function(e,n,t){switch(n){case"input":if(es(e,t),n=t.name,t.type==="radio"&&n!=null){for(t=e;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+n)+'][type="radio"]'),n=0;n<t.length;n++){var r=t[n];if(r!==e&&r.form===e.form){var i=oi(r);if(!i)throw Error(y(90));gl(r),es(r,i)}}}break;case"textarea":yl(e,t);break;case"select":n=t.value,n!=null&&Qn(e,!!t.multiple,n,!1)}};wl=Ao;Tl=Rn;var qp={usingClientEntryPoint:!1,Events:[Yt,zn,oi,Ll,Cl,Ao]},yt={findFiberByHostInstance:jn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},_p={bundleType:yt.bundleType,version:yt.version,rendererPackageName:yt.rendererPackageName,rendererConfig:yt.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ke.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Pl(e),e===null?null:e.stateNode},findFiberByHostInstance:yt.findFiberByHostInstance||Ip,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var yr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!yr.isDisabled&&yr.supportsFiber)try{ti=yr.inject(_p),Me=yr}catch{}}Ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=qp;Ee.createPortal=function(e,n){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!_o(n))throw Error(y(200));return Rp(e,n,null,t)};Ee.createRoot=function(e,n){if(!_o(e))throw Error(y(299));var t=!1,r="",i=ad;return n!=null&&(n.unstable_strictMode===!0&&(t=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),n=Io(e,1,!1,null,null,t,!1,r,i),e[Qe]=n.current,zt(e.nodeType===8?e.parentNode:e),new qo(n)};Ee.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(y(188)):(e=Object.keys(e).join(","),Error(y(268,e)));return e=Pl(n),e=e===null?null:e.stateNode,e};Ee.flushSync=function(e){return Rn(e)};Ee.hydrate=function(e,n,t){if(!vi(n))throw Error(y(200));return gi(null,e,n,!0,t)};Ee.hydrateRoot=function(e,n,t){if(!_o(e))throw Error(y(405));var r=t!=null&&t.hydratedSources||null,i=!1,s="",o=ad;if(t!=null&&(t.unstable_strictMode===!0&&(i=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),n=od(n,null,e,1,t??null,i,!1,s,o),e[Qe]=n.current,zt(e),r)for(e=0;e<r.length;e++)t=r[e],i=t._getVersion,i=i(t._source),n.mutableSourceEagerHydrationData==null?n.mutableSourceEagerHydrationData=[t,i]:n.mutableSourceEagerHydrationData.push(t,i);return new fi(n)};Ee.render=function(e,n,t){if(!vi(n))throw Error(y(200));return gi(null,e,n,!1,t)};Ee.unmountComponentAtNode=function(e){if(!vi(e))throw Error(y(40));return e._reactRootContainer?(Rn(function(){gi(null,null,e,!1,function(){e._reactRootContainer=null,e[Qe]=null})}),!0):!1};Ee.unstable_batchedUpdates=Ao;Ee.unstable_renderSubtreeIntoContainer=function(e,n,t,r){if(!vi(t))throw Error(y(200));if(e==null||e._reactInternals===void 0)throw Error(y(38));return gi(e,n,t,!1,r)};Ee.version="18.3.1-next-f1338f8080-20240426";function ld(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ld)}catch(e){console.error(e)}}ld(),ll.exports=Ee;var Op=ll.exports,ud,$a=Op;ud=$a.createRoot,$a.hydrateRoot;/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Fp={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mp=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),ze=(e,n)=>{const t=K.forwardRef(({color:r="currentColor",size:i=24,strokeWidth:s=2,absoluteStrokeWidth:o,className:a="",children:l,...c},g)=>K.createElement("svg",{ref:g,...Fp,width:i,height:i,stroke:r,strokeWidth:o?Number(s)*24/Number(i):s,className:["lucide",`lucide-${Mp(e)}`,a].join(" "),...c},[...n.map(([v,m])=>K.createElement(v,m)),...Array.isArray(l)?l:[l]]));return t.displayName=`${e}`,t};/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bp=ze("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ga=ze("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qa=ze("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wa=ze("GraduationCap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zp=ze("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Up=ze("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vp=ze("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hp=ze("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bp=ze("Sparkles",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gi=ze("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);function $p(e){try{const t=new DOMParser().parseFromString(e,"text/xml");if(t.querySelector("parsererror"))throw new Error("Le format du flux RSS est invalide (parsererror).");const i=t.querySelector("channel");if(!i)throw new Error("Contenu invalide: la balise 'channel' est introuvable.");return{items:Array.from(i.querySelectorAll("item")).map(o=>{var a,l,c,g,v;return{title:((a=o.querySelector("title"))==null?void 0:a.textContent)||"",link:((l=o.querySelector("link"))==null?void 0:l.textContent)||"",pubDate:((c=o.querySelector("pubDate"))==null?void 0:c.textContent)||null,guid:((g=o.querySelector("guid"))==null?void 0:g.textContent)||((v=o.querySelector("link"))==null?void 0:v.textContent)||""}})}}catch(n){return{items:[],error:n.message}}}function Gp({apiPath:e,feedUrl:n,limit:t=10,displayMode:r="default"}){const[i,s]=K.useState([]),[o,a]=K.useState(""),[l,c]=K.useState(!0);return K.useEffect(()=>{if(!n||!e){a("Configuration du composant RssFeed incomplète."),c(!1);return}(async()=>{c(!0),a("");try{const v=`${e}?feedUrl=${encodeURIComponent(n)}&_=${new Date().getTime()}`,m=await fetch(v);if(!m.ok){const S=await m.json().catch(()=>({error:"Réponse d'erreur non-JSON"}));throw new Error(S.details||S.error||`Le serveur a répondu avec une erreur ${m.status}`)}const E=await m.text(),x=$p(E);if(x.error)throw new Error(x.error);s(x.items.slice(0,t))}catch(v){a(`Erreur de chargement du flux : ${v.message}`),s([])}finally{c(!1)}})()},[e,n,t]),l?f.jsx("div",{role:"status","aria-live":"polite",children:"Chargement du flux…"}):o?f.jsx("div",{role:"alert",style:{color:"#b00020",padding:"10px",background:"#ffebee",borderRadius:"8px"},children:o}):!i||i.length===0?f.jsx("div",{children:"Aucun article à afficher."}):r==="simple"?f.jsx("div",{className:"animate-marquee whitespace-nowrap flex items-center",children:[...i,...i].map((g,v)=>f.jsxs("a",{href:g.link,target:"_blank",rel:"noreferrer",className:"text-2xl text-black font-medium mx-8 hover:text-gray-600 transition-colors cursor-pointer underline decoration-dotted",children:["• ",g.title]},`${g.guid||g.link||v}-${v}`))}):f.jsx("section",{"aria-label":"Lecteur RSS"})}const Qp=`
{
    "chapitres": [
        {
            "titre": "Chapitre 1 : Le temps de travail",
            "page": 7,
            "mots_cles": [
                "durée légale",
                "temps de travail",
                "plages fixes",
                "plages souplesse",
                "heures supplémentaires",
                "astreintes",
                "travail de nuit",
                "temps partiel",
                "journée solidarité",
                "sujétions"
            ],
            "articles": [
                {
                    "titre": "Article 1 : Définition",
                    "page": 7,
                    "mots_cles": [
                        "travail effectif",
                        "arrêt maladie",
                        "position d'activité",
                        "1607h",
                        "jours travaillés",
                        "jours fériés",
                        "repos hebdo",
                        "solidarité"
                    ]
                },
                {
                    "titre": "Article 2 : Les durées du temps de travail",
                    "page": 7,
                    "mots_cles": [
                        "cycles hebdomadaires",
                        "annualisation",
                        "jours non travaillés",
                        "JNT",
                        "temps de travail",
                        "crèches",
                        "37h",
                        "38h"
                    ]
                },
                {
                    "titre": "Article 3 : Les plages fixes et plages de souplesse",
                    "page": 8,
                    "mots_cles": [
                        "plages fixes",
                        "plages souplesse",
                        "horaires variables",
                        "présence obligatoire",
                        "planning",
                        "flexibilité",
                        "pause méridienne",
                        "présentiel"
                    ]
                },
                {
                    "titre": "Article 4 : Les garanties minimales",
                    "page": 9,
                    "mots_cles": [
                        "repos quotidien",
                        "repos hebdomadaire",
                        "pause",
                        "amplitude",
                        "travail de nuit",
                        "décret 2000-815",
                        "dérogations",
                        "service public"
                    ]
                },
                {
                    "titre": "Article 5 : Heures supplémentaires et complémentaires",
                    "page": 9,
                    "mots_cles": [
                        "heures supplémentaires",
                        "majoration",
                        "récupération",
                        "dimanche",
                        "nuit",
                        "formulaire",
                        "agents B et C",
                        "25 heures"
                    ]
                },
                {
                    "titre": "Article 6 : Le temps partiel",
                    "page": 10,
                    "mots_cles": [
                        "temps partiel",
                        "quotité",
                        "temps partiel de droit",
                        "temps partiel sur autorisation",
                        "rémunération",
                        "congés",
                        "retraite",
                        "surcotisation"
                    ]
                },
                {
                    "titre": "Article 7 : La journée de solidarité",
                    "page": 14,
                    "mots_cles": [
                        "solidarité",
                        "7h",
                        "fractionnement",
                        "RTT",
                        "jour férié",
                        "congés",
                        "modalités",
                        "temps partiel"
                    ]
                },
                {
                    "titre": "Article 8 : Les astreintes et permanences",
                    "page": 15,
                    "mots_cles": [
                        "astreinte",
                        "permanence",
                        "intervention",
                        "rémunération",
                        "repos compensateur",
                        "logement",
                        "sécurité",
                        "filière technique"
                    ]
                },
                {
                    "titre": "Article 9 : Les sujétions particulières",
                    "page": 17,
                    "mots_cles": [
                        "sujétions",
                        "travail de nuit",
                        "dimanche",
                        "jours fériés",
                        "compensation",
                        "cycles",
                        "barème",
                        "impact santé"
                    ]
                }
            ]
        },
        {
            "titre": "Chapitre 2 : Les congés",
            "page": 19,
            "mots_cles": [
                "congés annuels",
                "congé bonifié",
                "ARTT",
                "don de jours",
                "CET",
                "congés naissance",
                "fractionnement",
                "jours fériés",
                "temps partiel",
                "report"
            ],
            "articles": [
                {
                    "titre": "Article 1 : Les congés annuels",
                    "page": 19,
                    "mots_cles": [
                        "jours ouvrés",
                        "planning",
                        "fractionnement",
                        "report",
                        "priorité",
                        "vacances scolaires",
                        "temps partiel",
                        "31 décembre"
                    ]
                },
                {
                    "titre": "Article 2 : Le congé bonifié",
                    "page": 23,
                    "mots_cles": [
                        "outre-mer",
                        "fonctionnaires",
                        "Guadeloupe",
                        "Réunion",
                        "conditions",
                        "décret 2020-851",
                        "durée",
                        "transport"
                    ]
                },
                {
                    "titre": "Article 3 : Les jours d'A.R.T.T",
                    "page": 24,
                    "mots_cles": [
                        "RTT",
                        "compensation",
                        "quotité",
                        "cycle",
                        "absence",
                        "réduction",
                        "prise",
                        "déduction"
                    ]
                },
                {
                    "titre": "Article 4 : Les dons de jours de repos",
                    "page": 27,
                    "mots_cles": [
                        "don jours",
                        "RTT",
                        "congé annuel",
                        "enfant malade",
                        "aide familiale",
                        "justificatif",
                        "congé solidaire",
                        "31 jours"
                    ]
                },
                {
                    "titre": "Article 5 : Le Compte Épargne Temps",
                    "page": 27,
                    "mots_cles": [
                        "CET",
                        "alimentation",
                        "jours non pris",
                        "formulaire",
                        "ouverture",
                        "indemnisation",
                        "retraite",
                        "report"
                    ]
                },
                {
                    "titre": "Article 6 : Les congés liés aux naissances",
                    "page": 29,
                    "mots_cles": [
                        "congé maternité",
                        "congé paternité",
                        "durée",
                        "hospitalisation",
                        "naissance",
                        "temps partiel",
                        "indemnisation",
                        "certificat"
                    ]
                }
            ]
        },
        {
            "titre": "Chapitre 3 : Autorisations spéciales d'absence",
            "page": 31,
            "mots_cles": [
                "autorisations absence",
                "fêtes religieuses",
                "garde enfant",
		            "nourrice",
                "maladie",
                "proche aidant",
                "décès",
                "maternité",
                "rentrée scolaire",
                "consultation médicale",
                "mariage"
            ],
            "articles": [
                {
                    "titre": "Article 1 : Fêtes religieuses",
                    "page": 31,
                    "mots_cles": [
                        "religion",
                        "calendrier",
                        "musulmane",
                        "juive",
                        "chrétienne",
                        "orthodoxe",
                        "préfecture",
                        "jours fériés"
                    ]
                },
                {
                    "titre": "Article 2 : Pour garde d'enfant malade",
                    "page": 31,
                    "mots_cles": [
                        "garde enfant",
			                  "nourrice",
                        "maladie",
                        "école fermée",
                        "RTT",
                        "conjoint",
                        "quotité",
                        "âge",
                        "plafond"
                    ]
                },
                {
                    "titre": "Article 3 : Pour prodiguer des soins ou assister un malade",
                    "page": 33,
                    "mots_cles": [
                        "soins",
                        "maladie",
                        "ascendants",
                        "enfant",
                        "jours ouvrés",
                        "certificat médical",
                        "temps partiel",
                        "justificatif"
                    ]
                },
                {
                    "titre": "Article 4 : Pour accompagner une personne en fin de vie",
                    "page": 33,
                    "mots_cles": [
                        "proche aidant",
                        "AJPA",
                        "pathologie",
                        "temps partiel",
                        "certificat",
                        "ascendants",
                        "absence non rémunérée",
                        "congé spécifique"
                    ]
                },
                {
                    "titre": "Article 5 : En cas de décès d'un membre de la famille",
                    "page": 34,
                    "mots_cles": [
                        "décès",
                        "famille",
                        "jours",
                        "frère",
                        "sœur",
                        "oncle",
                        "conjoint",
                        "enfant"
                    ]
                },
                {
                    "titre": "Article 6 : À l'occasion d'un mariage ou pacs",
                    "page": 35,
                    "mots_cles": [
                        "mariage",
                        "pacs",
                        "congé exceptionnel",
                        "durée",
                        "partenaire",
                        "cérémonie",
                        "justificatif",
                        "conjoint"
                    ]
                },
                {
                    "titre": "Article 7 : Absence liée à la maternité",
                    "page": 35,
                    "mots_cles": [
                        "absence maternité",
                        "mère",
                        "bébé",
                        "accouchement",
                        "congé spécifique",
                        "temps plein",
                        "certificat médical",
                        "suspension"
                    ]
                },
                {
                    "titre": "Article 8 : Pour une consultation médicale",
                    "page": 35,
                    "mots_cles": [
                        "consultation",
                        "médical",
                        "autorisée",
                        "temps partiel",
                        "justificatif",
                        "maternité",
                        "rendez-vous",
                        "absence"
                    ]
                },
                {
                    "titre": "Article 9 : Rentrée Scolaire",
                    "page": 36,
                    "mots_cles": [
                        "rentrée scolaire",
                        "enfants",
                        "parents",
                        "congés",
                        "autorisation",
                        "école",
                        "présence",
                        "temps partiel"
                    ]
                },
                {
                    "titre": "Article 10 : Déménagement",
                    "page": 36,
                    "mots_cles": [
                        "déménagement",
			                  "demenagement",
                        "changement domicile",
                        "autorisation",
                        "jour",
                        "préavis",
                        "mutation",
                        "justificatif",
                        "personnel"
                    ]
                },
                {
                    "titre": "Article 11 : Formation",
                    "page": 36,
                    "mots_cles": [
                        "formation",
                        "stage",
                        "autorisation absence",
                        "présence obligatoire",
                        "plan de formation",
                        "inscription",
                        "temps de travail",
                        "congé"
                    ]
                }
            ]
        },
        {
            "titre": "Chapitre 4 : Les absences pour maladies et accidents",
            "page": 38,
            "mots_cles": [
                "maladie",
                "accident travail",
                "accident trajet",
                "rémunération",
                "arrêt",
                "CLM",
                "CLD",
                "prise en charge",
                "pénibilité",
                "accident service"
            ],
            "articles": [
                {
                    "titre": "Article 1 : La maladie",
                    "page": 38,
                    "mots_cles": [
                        "arrêt maladie",
                        "congé maladie",
                        "rémunération",
                        "justificatif",
                        "traitement",
                        "absences",
                        "soins",
                        "certificat"
                    ]
                },
                {
                    "titre": "Article 2 : Les accidents de service et de trajet",
                    "page": 41,
                    "mots_cles": [
                        "accident service",
                        "accident trajet",
                        "responsabilité",
                        "prise en charge",
                        "déclaration",
                        "arrêt",
                        "indemnisation",
                        "soins"
                    ]
                },
                {
                    "titre": "Article 3 : La prise en charge de la rémunération",
                    "page": 41,
                    "mots_cles": [
                        "rémunération",
                        "maladie",
                        "accident",
                        "traitement indiciaire",
                        "temps partiel",
                        "invalidité",
                        "CLM",
                        "CLD"
                    ]
                }
            ]
        },
        {
            "titre": "Annexes",
            "page": 43,
            "mots_cles": [
                "cycles hebdomadaires",
                "annualisation",
                "directions",
                "travail de nuit",
                "dimanches",
                "jours fériés",
                "métiers",
                "DESS",
                "DCJ",
                "DME"
            ]
        }
    ]
}
`.trim(),Wp={1:`
CHAPITRE 1 : LE TEMPS DE TRAVAIL
ARTICLE 1 : DEFINITION
La durée du travail effectif s'entend comme « le temps pendant lequel les agents sont à la disposition de leur employeur et doivent se conformer à ses directives sans pouvoir vaquer librement à des occupations personnelles ».
Lorsqu'un agent est en arrêt maladie, il est en position d'activité, mais il n'est pas en situation de travail effectif, ni de service.
Nombre total de Jours sur l'année: 365
Repos hebdomadaire (2 jours x 52 semaines): -104
Congés annuels (5 fois les obligations hebdomadaires de travail): -25
Jours fériés: -8
Nombre de jours travaillés: =228
Nombre de jours travaillés = Nb de Jours x 7 heures: 1596h, arrondi à 1600h
+ Journée de solidarité:  +7h
TOTAL en heures: 1607 heures
ARTICLE 2 : LES DUREES DU TEMPS DE TRAVAIL
LA FIXATION DE LA DUREE DE TRAVAIL HEBDOMADAIRE
Au sein de la collectivité de Gennevilliers, les cycles de travail sont définis comme suite :
    37 heures par semaine
    37.5 heures par semaine
    38 heures par semaine
    39 heures par semaine pour les agents travaillant dans les crèches
LE CYCLE ANNUALISE
L'annualisation du temps de travail permet de :
     Condenser le temps de travail de l'agent sur les périodes où le besoin est le plus intense et libérer du temps de travail sur les périodes creuses
     Lisser la rémunération, quel que soit le temps de travail effectué chaque mois.
Dans le cadre de l'annualisation du temps de travail, le nombre de jour fériés n'est pas forfaitaire mais décompté au réel.
Journée non travaillée définition (JNT) :
Les périodes non travaillées correspondent pour partie à sa quote-part de congés annuels et pour le reste à la récupération des heures effectuées en sus. A la différence d'une A.R.T.T que l'agent peut prendre selon son souhait en accord avec sa hiérarchie,
les JNT sont planifiés d'office dans un agenda et ne sont pas mutables / échangeables ou au choix.
C'est le service qui les positionne, en fonction du flux d'activités et des nécessités de services.
ARTICLE 3 : LES PLAGES FIXES ET PLAGES DE SOUPLESSE
DEFINITION DES PLAGES FIXES :
Il s'agit des horaires de travail de présence obligatoire, tels que la collectivité les propose.
DEFINITION DES PLAGES DE SOUPLESSE DE TRAVAIL :
Il s'agit d'organiser dans chacun des services, et dans la limite des nécessités de service, des horaires de travail permettant aux agents de choisir plus librement, en accord avec leur hiérarchie et dans une limite définie, les horaires de début, de pause méridienne et de fin de leur journée de travail.
La durée de travail hebdomadaire ne change pas et s'inscrit toujours dans le respect des dispositions légales et réglementaires.
Cette possibilité est ouverte à toutes les catégories d'agents. Elle est accordée dès lors que la nature du travail et les nécessités de service le permettent, notamment avec les effectifs d'agents suffisants.
               DU LUNDI AU JEUDI                           Plage fixe                 Plage de souplesse
               Matin                                     De 9h30 à 12h                  De 7h30 à 9h30
               Pause déjeuner (45 min)                        45 min                       12h à 14h
               Après-midi                                 14h à 16h30                     16h30 à 19h
               VENDREDI                                    Plage fixe                 Plage de souplesse
               Matin                                     De 9h30 à 12h                  De 7h30 à 9h30
               Pause déjeuner (45 min)                        45 min                       12h à 14h
               Après-midi                                 14h à 16h00                     16h00 à 19h
Un planning hebdomadaire sera mis en place avec chaque direction ou chef de service il sera décidé pour l'année et sera revu à chaque rentrée scolaire (en septembre).
ARTICLE 4 - LES GARANTIES MINIMALES
L'organisation du temps de travail doit respecter les garanties minimales suivantes fixées par l'article 3 du décret n°2000-815 du 25 août 2000 :
       Durée hebdomadaire de travail effectif                    48 heures maximum ou 44 heures en moyenne sur 12 semaines
       Durée quotidienne du travail                              10 heures maximum
       Travail de nuit                                           La période comprise entre 22 heures et 5 heures ou une autre période de 7 heures consécutives comprise entre 22 heures et 7 heures
       Amplitude d'une journée de travail                        12 heures maximum
       Repos hebdomadaire (heures consécutives)                  35 heures minimum
       Repos quotidien (heures consécutives)                     11 heures minimum
       Après une période continue de travail de 6 h              20 minutes de pause minimum
Il ne peut être dérogé aux garanties minimales que dans deux situations précises :
Lorsque l'objet même du service public en cause l'exige en permanence, notamment pour la protection des personnes et des biens (par décret en Conseil d'Etat qui détermine les contreparties accordées aux catégories d'agents concernés)
Lorsque des circonstances exceptionnelles le justifient et pour une période limitée, par décision de l'autorité territoriale : en ce cas, les membres du comité technique doivent être immédiatement informés.
 ARTICLE 5 - LES HEURES SUPPLEMENTAIRES, LES HEURES COMPLEMENTAIRES
Les heures supplémentaires :
Les heures supplémentaires ne se déclencheront qu'au-delà du temps de travail normal de l'agent.
Les heures supplémentaires sont obligatoirement réalisées à la demande des supérieurs hiérarchiques et ne concernent que les agents titulaires et non titulaires de catégorie B et C*.
Ne peuvent être réaliser que 25 heures supplémentaires par mois au maximum.
Elles sont formalisées et font l'objet d'un état récapitulatif signé par le chef de service.
Elles correspondent à une charge de travail exceptionnelle et ne sauraient être accordées pour effectuer des missions normales de service.
Les heures supplémentaires effectuées feront prioritairement l'objet de récupération, dans un délai maximum de deux mois et seront majorées sur un taux identique à celui appliqué à la rémunération :
Les heures supplémentaires sont majorées de 25% pour les 14 premières heures et de 27% pour les heures suivantes (de la 15ème à la 25ème).
Les heures supplémentaires de nuit (de 22h00 à 7h00) sont majorées à 100% (multipliées par 2). Les heures supplémentaires de dimanche et jours fériés sont majorées à 66%.
Ces majorations peuvent se cumuler entres elles : 
                                         De la 1ère à la 14ème heure        De 22h à 7h00 (nuit)           Le dimanche                                                                                                                            1h00                             1h00                             1h00
Heures supplémentaires effectuées
Heures majoréesà récupérer de la              1h15                            2h30                            2h05
         1° à la 14°Heure
 De la 15ème à la 25ème heure.                1h17                            2h34                             2h07        
Elles peuvent être indemnisées à titre exceptionnel, à la demande spécifique du chef de service et quand les nécessités de service n'ont pas permis la récupération.
*Pour la liste des métiers concernés se référer à la délibération correspondante
Les heures complémentaires :
Les agents titulaires et non titulaires à temps non complet ou temps partiel de catégorie A, B et C de toutes filières, peuvent être amenés exceptionnellement à effectuer des heures complémentaires jusqu'à concurrence de 35h00 / semaine.
ARTICLE 6 - LE TEMPS PARTIEL
La Ville de Gennevilliers a fixé la durée du temps partiel à hauteur de 50%, 60%, 70%, 80% ou 90% du temps complet.
LE TEMPS PARTIEL DE DROIT
Conformément au décret n°2004-777 du 29 juillet 2004 et au décret n°2024-1263 du 30 décembre 2024, l'autorisation d'accomplir un travail à temps partiel selon les quotités de 50%, 60%, 70% ou 80%, 90% est accordée de plein droit aux fonctionnaires et agents contractuels dans les conditions suivantes :
     A l'occasion de chaque naissance jusqu'au 3ème anniversaire de l'enfant
     A l'occasion de chaque adoption jusqu'à l'expiration d'un délai de trois ans à compter de l'arrivée au foyer de l'enfant adopté.
     Pour donner des soins à son conjoint, à un enfant à charge ou à un ascendant atteint d'un handicap nécessitant la présence d'une tierce personne, ou victime d'un accident ou maladie grave ;
     Aux agents reconnus travailleurs handicapés.
Les agents à temps non complet peuvent bénéficier d'un temps partiel de droit, contrairement au temps partiel sur autorisation.
Dans les cas de temps partiel de droit, les modalités restent conjointement définies entre l'agent et la collectivité.
Les agents à temps partiel n'ont pas le droit de modifier librement la répartition de leur temps de travail dans une semaine en fonction des jours fériés qui pourraient y avoir.
Les jours fériés ne sont pas récupérables lorsqu'ils tombent un jour où l'agent ne travaille pas en raison de son temps partiel.
Le temps consacré à la formation, étant du temps de travail effectif, pourra être récupéré s'il tombe un jour où l'agent ne travaille pas en raison de son temps partiel.
Quelles sont les incidences sur la rémunération ?
Le traitement indiciaire, l'indemnité de résidence, les primes et indemnités liées au grade, à l'échelon ou à l'emploi sont versés au prorata du temps travaillé pour les agents exerçant à 50 %, 60 % ou 70 % d'un temps plein.
La rémunération est légèrement supérieure pour les agents travaillant à 80 % (payée 85,72 %) ou 90 % (payée à 91,42 %).
Le supplément familial de traitement est calculé en fonction de la quotité de traitement perçu, à l'exception du supplément familial de traitement pour un enfant, qui n'est pas proratisé. En cas de retenue pour grève et pour absence de service fait, la retenue est effectuée sur la rémunération réellement perçue, et non sur celle correspondant à un temps plein.
Quelles incidences sur les congés ?
Les agents autorisés à effectuer leurs fonctions à temps partiel, de droit ou sur autorisation, ont droit aux congés annuels au prorata de leur temps de travail.
Les agents à temps partiel n'ont pas le droit de modifier librement la répartition de leur temps de travail dans la semaine en fonction des jours fériés.
Quelles sont les incidences sur la carrière et la retraite ?
Sur la carrière :
Les périodes de travail à temps partiel sont assimilées à des périodes à temps complet pour la détermination des droits à l'avancement, promotion et à formation.
Sur la retraite :
Les périodes de service à temps partiel de droit pour élever un enfant, dans la limite de 3 ans par enfant né ou adopté à partir du 1er janvier 2004, sont prises en compte pour la totalité de leur durée pour la constitution des droits à pension. Concernant la liquidation de la pension, les périodes de travail à temps partiel de droit pour élever un enfant sont assimilées à des périodes à temps plein.
Surcotisassions :
Par dérogation au principe général, les services à temps partiel accomplis à compter du 1er janvier 2004 peuvent, dans une certaine limite, être assimilés pour le décompte à des périodes de travail à temps plein, en contrepartie du versement d'une retenue pour pension.
Cette assimilation ne peut pas augmenter la durée de service retenue pour la liquidation de la pension de plus de 4 trimestres.
Le fonctionnaire souhaitant bénéficier de l'assimilation, doit présenter une demande écrite en ce sens lors de sa demande initiale de travail à temps partiel [case « surcotisassions » à cocher sur le formulaire] ou lors de son renouvellement.
Pour les fonctionnaires handicapés dont l'incapacité permanente est au moins égale à 80 %, la prise en compte de la durée non travaillée et surcotisée peut concerner 8 trimestres et la cotisation retraite est calculée sur la base du traitement effectivement versé en fonction de la quotité de travail de l'agent.
Peut-on mettre fin à l'autorisation d'exercer ses fonctions à temps partiel à n'importe quel moment ?
Suspension :
Le fonctionnaire ou l'agent contractuel placé en congé de maternité, paternité ou d'adoption, voit l'autorisation d'effectuer un temps partiel suspendue pendant la durée du congé. L'agent est donc
rétabli dans le droit des agents à temps plein.
Réintégration à temps plein avant terme :
Réintégration à temps plein ou la modification des conditions d'exercice du temps partiel peut intervenir au cours de la période, sur demande écrite de l'agent, présentée au moins deux mois avant la date souhaitée.
La réintégration à temps plein peut intervenir sans délai en cas de motif grave, tel qu'une diminution des revenus du ménage ou un changement de situation familiale.
Réintégration à temps plein à terme :
A l'issue de la période de service à temps partiel, le fonctionnaire ou l'agent contractuel est admis à réintégrer son emploi d'origine à temps plein sur demande écrite de l'agent.
LE TEMPS PARTIEL SUR AUTORISATION
Conformément au décret n°2004-777 du 29 juillet 2004, les agents peuvent être autorisés, sur leurs demandes et sous réserve de la continuité et du fonctionnement du service et des possibilités
d'aménagement de l'organisation du travail, à bénéficier d'un service à temps partiel qui ne peut être inférieur à 50%.
Les bénéficiaires de ce temps partiel sont :
    Les agents titulaires occupant un emploi à temps complet en position d'activité ou de détachement ;
    Les agents contractuels employés en continu depuis plus d'un an à temps complet ;
    Les agents stagiaires dont la durée de stage est allongée pour correspondre à la durée effectuée par les agents à temps plein, sauf ceux dont le statut prévoit l'accomplissement d'une période de stage dans un établissement de formation ou dont le stage comporte un enseignement professionnel
    Les agents ayant pour projet de créer ou de reprendre une entreprise.
Le temps partiel ne peut être imposé, il résulte d'une demande écrite de l'agent. Il n'est pas un droit, mais est accordé selon les nécessités de service.
Ainsi, un agent pourra se voir refuser le jour ou la quotité demandée et le temps partiel pourra être accordé pour un autre jour ou une autre quotité.
Quelles sont les incidences sur la rémunération ?
Le traitement indiciaire, l'indemnité de résidence, les primes et indemnités liées au grade ou à l'emploi sont versés au prorata du temps travaillé pour les agents exerçant à 50 %, 60 % ou 70 % d'un temps plein. La rémunération est légèrement supérieure pour les agents travaillant à 80 % (payée 85,72 %) et ceux travaillant à 90 % (91,42 %).
Le supplément familial de traitement est calculé en fonction de la quotité de traitement perçu, à l'exception du supplément familial de traitement perçu pour un enfant, qui n'est pas proratisé.
En cas de retenue pour grève et pour absence de service fait, la retenue est effectuée sur la rémunération réellement perçue, et non sur celle correspondant à un temps plein.
Quelles incidences sur les congés ?
Les agents autorisés à assurer leurs fonctions à temps partiel sur autorisation, ont droit aux congés annuels au prorata de leur temps de travail.
Les agents à temps partiel n'ont pas le droit de modifier librement la répartition de leur temps de travail dans la semaine en fonction des jours fériés.
Quelles sont les incidences sur la carrière et la retraite ?
Sur la carrière :
Les périodes de travail à temps partiel sont assimilées à des périodes à temps complet pour la détermination des droits à avancement, promotion et formation.
Sur la retraite :
Les périodes de service à temps partiel sur autorisation sont prises en compte pour la totalité de leur durée pour la constitution des droits à pension. En revanche, concernant la liquidation des droits, les
périodes de service à temps partiel sur autorisation sont retenues au prorata de la quotité de travail.
Surcotisassions :
Par dérogation au principe général, les services à temps partiel accomplis à compter du 1er janvier 2004 peuvent, dans une certaine limite, être assimilés pour le décompte à des périodes de travail à temps plein, en contrepartie du versement d'une retenue pour pension. Cette assimilation ne peut pas augmenter la durée de service retenue pour la liquidation de la pension de plus de 4 trimestres.
Le fonctionnaire souhaitant bénéficier de l'assimilation, doit présenter une demande écrite en ce sens lors de sa demande initiale de travail à temps partiel [case « surcotisassions » à cocher sur le formulaire] ou lors de son renouvellement.
Peut-on mettre fin à l'autorisation d'exercer ses fonctions à temps partiel à n'importe quel moment ?
Suspension :
Le fonctionnaire ou l'agent non titulaire placé en congé de maternité, paternité ou d'adoption, voit l'autorisation d'effectuer un temps partiel suspendue pendant la durée du congé. L'agent est donc rétabli dans le droit des agents à temps plein.
Réintégration à temps plein avant terme :
La réintégration à temps plein ou la modification des conditions d'exercice du temps partiel peut intervenir au cours de la période, sur demande écrite de l'agent, présentée au moins deux mois avant la date souhaitée. La réintégration à temps plein peut intervenir sans délai en cas de motif grave, tel qu'une diminution des revenus du ménage ou un changement de situation familiale.
Réintégration à temps plein à terme :
A l'issue de la période de service à temps partiel, le fonctionnaire ou l'agent non titulaire est admis à réintégrer son emploi d'origine à temps plein sur demande écrite présentée par l'agent.
LE TEMPS PARTIEL THERAPEUTIQUE
Le mi-temps thérapeutique, accordé par le médecin traitant est fixé à 50 %, 60 %, 70 %, 80 % ou 90 % correspond à un pourcentage de la quotité de travail hebdomadaire de l'agent à temps plein sur son poste (37h, 37h30, 38h ou 39h) (Décret n° 2021-1462 du 08/11/2021 article 1 ; décret n° 87-602 du 30/07/1987 article 13-1).
L'agent a droit proportionnellement aux RTT* et aux CA (5X le nombre de jours travaillés par semaine). (Décret n° 2021-1462 du 08/11/2021 article 1er ; décret n° 87-602 du 30/07/1987 article 13-11).
L'autorisation est accordée sur la base d'un certificat médical (par le médecin traitant ou la médecine professionnelle) par période de 1 à 3 mois maximum et dans la limite d'une durée totale d'un an. Au-delà de 3 mois, une visite auprès d'un médecin agréé est obligatoire pour le renouvellement et définir la quotité de travail.
ARTICLE 7 - LA JOURNEE DE SOLIDARITE
LA JOURNEE DE SOLIDARITE PEUT ETRE ACCOMPLIE SELON 3 MODALITES
       Travail un jour férié précédemment chômé (autre que le 1er mai)
       Travail d'un jour d'A.R.T.T
       Autre modalité permettant le travail de 7h précédemment non travaillé (à l'exclusion des jours de congé annuel).
Modalités d'exercice choisi :
       7 heures supplémentaires travaillées sur l'année civile, fractionnées à raison de deux minutes par jour
       Pour tous les agents de la collectivité
       Cette journée sera proratisée en fonction du temps partiel de l'agent
*Jours d'A.R.T.T. : Se référer page 25 article 3 - Les jours d'A.R.T.T
ARTICLE 8 - LES ASTREINTES ET PERMANENCES
Pour la liste des métiers ainsi que les différentes indemnités se référer à la délibération correspondante.
L'ASTREINTE - DEFINITION
La période d'astreinte s'entend comme une période pendant laquelle l'agent, sans être à la disposition permanente et immédiate de son employeur, a l'obligation de demeurer à son domicile ou à proximité afin d'être en mesure d'intervenir pour effectuer un travail au service de l'administration.
Ce temps n'est en aucun cas assimilé à du travail effectif.
C'est pourquoi, l'article 5 du décret N°2001-623 du 12 juillet 2001 prévoit que le temps passé en astreinte soit obligatoirement rémunéré ou compensé.
En revanche, le travail effectué pendant cette astreinte, à savoir « l'intervention » ainsi que le « temps de trajet » sont comptabilisés comme du temps de travail effectif.
Ces dispositions sont applicables aux agents titulaires, stagiaires et contractuels de droit public quel que soit leur cadre d'emplois, selon des modalités différentes selon que les agents relèvent de la filière technique ou des autres filières.
Sont exclus de ce dispositif les agents qui bénéficient d'une concession de logement par nécessité absolue de service ou d'une NBI au titre de l'exercice de fonctions de responsabilité supérieure (emplois fonctionnels).
Bien que la règlementation ne prévoie pas de limite au nombre maximal d'astreinte à effectuer par agent dans l'année, l'attention des services est appelée sur la fréquence du recours aux astreintes et les abus éventuels constatés, consistant à placer de façon trop importante un salarié en position d'astreinte.
Aussi, en vertu du principe de parité il est recommandé qu'un agent n'assure pas plus de 14 semaines d'astreintes par année civile.
Il convient de distinguer les astreintes pour la filière technique (régime spécifique) et les astreintes pour les agents relevant des autres filières (régime de droit commun).
Les astreintes dans la filière technique:
Il existe trois sortes d'astreintes pour la filière technique. A chacune correspond un barème d'indemnités.
Le temps d'intervention (intervention et temps de trajet) peut être indemnisé ou donner lieu à un repos compensateur.
     L'astreinte d'exploitation : elle concerne la situation des agents tenus, pour des raisons de nécessité de service, de demeurer à leur domicile ou à proximité, afin d'être en mesure d'intervenir dans le cadre d'activités particulières (déneigement, intervention sur dysfonctionnement technique …)
     L'astreinte de décision : elle concerne la situation du personnel d'encadrement pouvant être joint directement par l'autorité territoriale, en dehors des heures d'activité normales du service, afin de prendre les mesures et les dispositions nécessaires.
     L'astreinte de sécurité : elle concerne des agents appelés à participer à un plan d'intervention dans le cas d'un besoin en renforcement en moyens humains faisant suite à un évènement soudain ou imprévu (situation de crise, inondations, fortes tempêtes …)
Les astreintes ne sont pas cumulables entre elles pour la même période
Les astreintes dans les autres filières
    Il n'existe qu'une sorte d'astreinte pour les agents des filières autres que techniques : dite de sécurité.
    Les périodes d'astreinte doivent être indemnisées.
    Le temps d'intervention (intervention et temps de trajet) peut être indemnisé ou donné lieu à un repos compensateur.
LA PERMANENCE:
La permanence correspond à l'obligation faite à un agent de se trouver sur son lieu de travail habituel, ou un lieu désigné par son chef de service, pour nécessité de service, un samedi, un dimanche ou lors d'un jour férié.
Ces dispositions sont applicables aux agents titulaires, stagiaires et contractuels de droit public quel que soit leur cadre d'emploi, selon des modalités différentes pour les agents relevant de la filière technique et des autres filières.
Une période de permanence peut être indemnisée ou compensée pour les agents des filières autres que techniques. Elle ne peut qu'être indemnisée pour les agents de la filière technique.
Sont exclus de ce dispositif les agents logés et les agents qui bénéficient d'une NBI pour l'exercice de fonctions responsabilité supérieure.
ARTICLE 9 - LES SUJETIONS PARTICULIERES
DEFINITION:
Dans le cadre de cette nouvelle réforme du temps de travail, la collectivité de Gennevilliers est amenée à tenir compte de certaines sujétions particulières.
En effet, le temps de travail des agents concernés nécessite de déroger à la durée légale annuelle de 1607 heures du fait qu'ils peuvent etre amenés à travailler, de manière régulière et planifiée, les dimanches ou les jours fériés ou sur des horaires de nuit, soit en début de nuit, soit en début de  matinée et que cela pourrait un impact sur leur santé ou vie personnelle.
Il est donc décidé de prendre en compte uniquement deux sujétions particulières liées aux cyles de travail à compter du 1er janvier 2022 :
      Travail de nuit
      Travail des dimanches et jours fériés
LE TRAVAIL DE NUIT:
Il est décidé de prendre en compte le temps de travail de nuit annuel réalisé de manière régulière et planifiée, en raison de son caractère atypique et pénible et d'accorder des jours de compensation selon le bareme ci-dessous :
      Entre 21 heures annuelles de nuit et 55 heures annuelles de nuit = 1 jour de compensation
      Entre 56 heures annuelles de nuit et 100 heures annuelles de nuit = 2 jours de compensation
      Entre 101 heures annuelles de nuit et 150 heures annuelles de nuit = 2.5 jours de compensation
      Entre 151 heures annuelle de nuit et 225 heures annuelles de nuit = 3 jours de compensation
      Entre 226 heures annuelles de nuit et 286 heures annuelles de nuit = 3.5 jours de compensation
      Au-delà de 287 heures annuelles de nuit = 4 jours de compensation
LE TRAVAIL DU DIMANCHE ET JOURS FERIES:
Il est décidé de prendre en compte le nombre de dimanches et jours fériés travaillés annuellement de manière régulière et planifiée, en raison de son impact sur la vie personnelle et d'accorder des jours de compensation selon le bareme ci-dessous :
      Toute heure travaillée un dimanche ou un jour férié = vaut pour 1 journée entière travaillée
      Les modalités de compensation s'appliquent à partir d'un minimum de 10 dimanches travaillés ou jours fériés travaillés
      Entre 10 dimanches / jours fériés et 19 dimanches / jours fériés travaillés = 1 jour de compensation soit 7h
      Entre 20 dimanches / jours fériés et 29 dimanches / jours fériés travaillés = 2 jours de compensation soit 14h
      Entre 30 dimanches / jours fériés et 39 dimanches / jours fériés travaillés = 3 jours de compensation soit 21h
      40 dimanches / jours fériés travaillés et plus = 4 jours de compensation soit 28h
Les jours de compensation seront décomptés si l'agent ne réalise pas les jours pour lesquels il bénéficie de ces compensations.
Le calcul est basé sur le même principe que le décompte des jours de A.R.T.T en cas d'absence.
                `.trim(),2:`
CHAPITRE 2 - LES CONGES
ARTICLE 1 : LES CONGES ANNUELS
Les congés annuels à Gennevilliers sont de 25 jours ouvrés sur une base de 5 jours de travail hebdomadaire.
Les congés annuels sont calculés en fonction des obligations hebdomadaires et multipliés par 5.
5 jours travaillés/semaine: 25 C.A
4.5 jours travaillés/semaine: 22.5 C.A
4 jours travaillés/semaine: 20 C.A
3.5 jours travaillés/semaine: 17.5 C.A
3 jours travaillés/semaine: 15 C.A 
2.5 jours travaillés/semaine: 12.5 C.A
Les agents contractuels non permanents travaillant dans le cadre d'un contrat à durée déterminée doivent prendre leurs congés pendant la durée de leur contrat et non sur l'année civile avec les mêmes délais de prévenance que les autres agents permanents. Dans le cas d'une démission ou d'un licenciement en cours de contrat, les congés feront l'objet d'une proratisation et devront être pris avant la date effective de départ.
Il est rappelé que les droits à congé sont calculés au prorata du temps de présence.
Les agents arrivés ou partant en cours d'année exercent leur droit au prorata de leur temps de présence au travail.
LES MODALITES GENERALES
Modalités de prise des jours de CA
De manière générale, les congés annuels doivent être pris avant le 31 décembre de l'année en cours.
Ils peuvent être posé en ½ journée ou journée complète.
La demande de congés
La demande de congés est formulée par l'agent sur la fiche commune à l'ensemble des services (à télécharger sur Intranet). Les Directeurs sont responsables des modalités de gestion et de planification des congés des agents de leur direction.
Les délais minimums de demande de congé
Pour les congés dits estivaux
(mi-juin/mi-septembre) ils doivent être planifiés pour le 1er mars au plus tard, au sein de chaque service (ou direction) ; lorsque des agents n'ont pas posé leurs congés estivaux dans les délais impartis, l'octroi de leur congé s'effectuera en fonction des possibilités restantes répondant aux besoins du service.
1er mars - date limite de dépôt des congé s dits estivaux
Juin - Septembre: Période des congés dits estivaux
Pour les congés hors période dite estivale
Entre 5 et 10 jours ouvrés, ils sont posés au moins un mois avant le début du congé.
Pour les congés inférieurs à 5 jours ouvrés
Ils sont posés au minimum 15 jours avant la prise de congés.
Pour 1 journée de congé
Le délai est fixé à 5 jours ouvrés avant la prise.
Pour une situation exceptionnelle la hiérarchie pourra considérer les demandes ne respectantpas ces délais.
Les délais maximums de réponse de la hiérarchie :
Courent à compter de la date de dépôt du formulaire de demande :
Pour les congés dits estivaux
La réponse devra être donnée au plus tard le 15 mars (ou jour ouvré le plus proche).
Pour les congés hors période dite estivale
La réponse devra être donnée dans les 15 jours ouvrables suivant la demande.
Pour les congés inférieurs à 5 jours ouvrés
La réponse devra être donnée dans les 3 jours ouvrables suivant la demande.
Pour 1 journée
La réponse devra être donnée au plus tard sous 48 heures ouvrées.
Tout refus ou report de congé doit être motivé et argumenté par écrit puis notifié à l'agent par la hiérarchie dans les délais fixés ci-dessus.
L'agent qui s'absente sans attendre l'autorisation formelle ou malgré un refus se place en absence injustifiée. Une retenue sur salaire sera appliquée.
Aucun agent ne peut être placé d'office en congé annuel sans en avoir fait la demande.
L'original de la fiche de congé reste, pendant la période annuelle de travail concernée, au sein du service pour la gestion du suivi, un double étant établi et remis à l'agent s'il le souhaite à chaque demande de congés.
En cas de préavis de grève, les demandes d'autorisation d'absence sont accordées sous réserve des nécessités de service et en conformité avec les délais posés par le présent règlement. Compte tenu du risque de sous-effectif le jour de ces mobilisations, ces demandes seront examinées avec une vigilance particulière.
REGLES D'ATTRIBUTION DES CONGES ANNUELS
Le droit à congé annuel s'exerce sous réserve des nécessités du service public. Ce sont les responsables de service qui en assurent la gestion sous la responsabilité des Directeurs auxquels ils sont rattachés.
En cas de désaccord avec le responsable de service, l'agent peut saisir le directeur et si le désaccord persiste, la Direction des Ressources Humaines pour avis et vérification de l'application des règles et droits des congés.
Lorsque plusieurs agents demandent la même période et que les nécessités du service ne permettent pas de leur attribuer en même temps, une priorité est donnée aux agents :
       Ayant des charges de famille, uniquement en période de vacances scolaires ;
       Dont l'entreprise des conjoints (es) ferme un mois déterminé et place obligatoirement en congé ses salariés ce mois-là ;
       En situation de garde d'enfants partagée ou alternée ;
       Les parents d'enfants gravement handicapés - titulaires d'une carte d'invalidité quel que soit l'âge des enfants, à condition que l'établissement spécialisé auquel l'enfant a été confié, impose aux parents de le reprendre pendant ces vacances.
Ces critères de priorité doivent être justifiés.
Dans le cas où des agents d'une même unité de travail seraient confrontés aux mêmes contraintes, chacun d'entre eux bénéficiera par roulement de cette priorité.
La durée maximum autorisée d'absence lors des congés est de 31 jours consécutifs ; le décompte s'effectue à partir du 1er jour de cessation d'activité. Cette règle s'applique quelle que soit la situation des agents à temps complet, temps non complet, temps partiel...
N.B : le terme de conjoint est utilisé génériquement pour les mariages civils, les PACS et l'union libre (justificatifs nécessaires).
DEROGATION DE LA REGLE DES 31 JOURS
Les agents sont autorisés pour se rendre dans leur pays d'origine (hors U.E) ou pour accompagner leur conjoint se rendant dans leur pays d'origine, à cumuler des congés sur 2 années.
La demande de report de congé pour ce motif, accompagnée des justificatifs1, devra être faite par écrit au cours de l'année où les congés ne seront pas pris (soit en partie ou en totalité) et adressée à
la Direction des Ressources Humaines. En aucun cas, l'agent travaillant à temps complet ne pourra dépasser l'autorisation du double de CA auquel il a le droit au regard de ses obligation hebdomadaire
(ex : semaine de 4 jours de travail = 20*2 soit 40 CA).
Dans ce cas, l'agent qui réserve le maximum de congés annuels doit prendre les A.R.T.T dans les mêmes conditions que les autres agents.
S'agissant des jours de CET, ils peuvent être pris en étant accolés à des jours de congés annuels et dépasser 31 jours consécutifs.
Compte tenu de la mise en place du CET, les congés annuels doivent désormais être impérativement pris au plus tard le dernier jour des congés scolaires de Noël, sauf cas de report indiqué ci-dessous.
LES REPORTS
En principe, les congés non pris au 31 décembre sont perdus et ne peuvent pas être reportés sur l'année suivante. Néanmoins, si l'agent n'a pas pu prendre tout ou partie de ses congés annuels en raison d'une absence prolongée pour raison de santé (MO, AT, CLM, CLD, CGM) les congés annuels non pris sont automatiquement reportés dans la limite de 4 semaines de congés sur une période de 15 mois maximum après l'année de référence (arrêt du Conseil d'Etat CE26.04.2017 conformément aux dispositions de l'article 7 de la directive européenne 2003/88/CE).
A titre exceptionnel et uniquement pour les congés annuels, une dérogation peut être accordée par le chef de service s/c du directeur, aux agents qui sont en congé de maternité, afin de reporter le reliquat de congés de l'année N à l'année N+1, à l'issue d'un congé maternité ou de couches pathologiques. Les congés annuels qui seront reportés ne donnent lieu à aucune bonification pour fractionnement.
A titre exceptionnel et uniquement pour les congés annuels un report au 31 Janvier n+1 peut être accordé sous réserve de nécessité ou contrainte de service.
CONGES NON PRIS DU FAIT DE CONGES POUR INDISPONIBILITE PHYSIQUE
En cas d'arrêt de travail pour maladie survenu pendant un congé annuel, l'agent a le droit de récupérer ultérieurement la période de congé non-utilisée d'une durée équivalente à celle de sa maladie.
Aucune disposition législative ou réglementaire n'oblige l'agent à reprendre ses fonctions après un congé de maladie pour pouvoir bénéficier du reliquat de congé annuel.
Elle pourra être prise soit immédiatement à la suite du congé maladie soit à une période ultérieure sous réserve de l'accord préalable du responsable hiérarchique.
Un fonctionnaire et un agent contractuel en CDI, ayant acquis des congés annuels durant une année mais qui n'aurait pas pu en bénéficier du fait d'un congé maladie peut en retrouver l'usage à l'issue
de ce congé y compris si ce dernier se termine une autre année que l'année d'acquisition de ses congés annuels. Justificatifs : acte de naissance de l'agent, conjoint et parents ou double nationalité de l'agent ou conjoint.
CONGES ANNUELS, TEMPS PARTIEL ET TEMPS PARTIEL THERAPEUTIQUE
L'agent autorisé à effectuer son travail à temps partiel ou encore à temps partiel thérapeutique bénéficie à ce titre de congés annuels.
Ces congés annuels seront calculés sur ces obligations de travail hebdomadaire [voir Article 1 : Les congés annuels]
LES JOURS DE FRACTIONNEMENT
Seuls, les congés annuels effectivement pris entre le 1er janvier et le 30 avril et le 1er novembre et le 31 décembre de chaque année ouvrent droit à une bonification :
    1 jour de congé supplémentaire pour 5 à 7 jours de congés annuels (consécutifs ou non) pris pendant ces périodes
Ou
    2 jours supplémentaires pour 8 jours et plus de congés annuels (consécutifs ou non) pris pendant ces périodes.
En résumé, le cumul des congés pris durant ces périodes donne droit à la bonification.
Cette bonification est fixée à 2 jours de congé maximum par année civile à prendre avant le 31 décembre. Elle est accordée à partir du moment où les conditions sont remplies pour l'obtenir.
EXERCICE D'UNE ACTIVITE PENDANT LES CONGES
La règlementation relative au cumul d'activités des agents publics s'applique en période de congés annuels, du fait du maintien en position d'activité pendant cette période.
L'exercice d'une activité accessoire pendant les vacances suppose une demande et un accord préalable (exemple : animation d'une colonie de vacances, vendanges, etc.)
ARTICLE 2 - LE CONGE BONIFIE
Les fonctionnaires municipaux titulaires dont le centre des intérêts moraux et matériels se trouve dans un département ou une collectivité unique d'outre-mer ont droit aux congés bonifiés.
Il s'agit d'un congé annuel pour les fonctionnaires originaires de Guadeloupe, Martinique, Guyane,Réunion, Saint Pierre et Miquelon, Mayotte, Saint Barthélémy, Saint Martin et qui exercent en métropole.
Le congé bonifié est octroyé tous les 2 ans sous réserve d'en remplir les conditions. Le congé bonifié ne peut pas dépasser 31 jours calendaire consécutifs maximum à compter du 1er jour d'absence.
La demande de congé bonifié est à adresser au Maire, au plus tard le 28 février de l'année ouvrant droit à ces congés pour permettre l'étude des droits par la Direction des Ressources Humaines. Si les conditions légales sont remplies, le congé est accordé en fonction des nécessités du service. La Ville et ses établissements publics se réservent le droit de négocier les dates de départ et de retour en fonction des tarifs et des disponibilités des compagnies aériennes.
Les conditions d'ouverture des droits sont définies par le décret n°2020-851 du 2 juillet 2020.
Depuis le 5 juillet 2020, il n'y a plus de bonification mais des dispositions transitoires ont été prévues.
En effet, les fonctionnaires qui remplissent les conditions depuis le 5 juillet 2020 peuvent opter :
      Soit pour le bénéfice d'un dernier congé bonifié dans les conditions fixées par l'ancien dispositif dans un délai de 12 mois à compter de l'ouverture du droit (option 1)
      Soit pour l'application immédiate du nouveau dispositif (option 2)
ARTICLE 3 - LES JOURS D'A.R.T.T
Les jours de réduction du temps de travail, dits jours de A.R.T.T, constituent une compensation, sous la forme de jours de repos, à un mode d'organisation du temps de travail fixant une durée hebdomadaire de travail supérieure à 35 heures hebdomadaires toute l'année.
Ils sont générés par le travail accompli au-delà de la durée légale de travail dans la limite des plafonds fixés pour chaque cycle de travail.
Les A.R.T.T peuvent bénéficier à l'ensemble des agents répondant aux conditions d'octroi, à l'exception des agents nommés sur des postes à temps non complets qui ne génèrent quant à eux pas de jours de A.R.T.T.
Pour les agents exerçant leurs fonctions à temps partiel, le nombre de jours de A.R.T.T est proratisé à hauteur de leur quotité de travail, sur la base des droits ouverts pour un agent à temps complet soumis au même régime de temps de travail.
Pour faciliter la gestion des jours d'absence, le nombre est arrondi à la demi-journée supérieure. Le tableau ci-après précise les types d'absences qui génèrent ou non pendant cette période des droits au titre de la A.R.T.T.
LA GESTION DES A.R.T.T
Néanmoins les demandes d'absences A.R.T.T et leur planification sont soumises aux mêmes conditions que les jours de congés annuels, par journée ou demi- journée, sur les journées normalement travaillées par l'agent et avant ou après des jours de congés annuels ainsi qu'entre deux périodes de congés annuels.
Les jours A.R.T.T sont à prendre au cours de l'année civile et jusqu'au 31 Décembre. (les A.R.T.T du mois de décembre seront anticipés).
Les jours de A.R.T.T non pris sur l'année peuvent être versés sur le compte épargne temps selon les règles définies, sinon ils seront considérés comme perdus.
Les agents contractuels sur emplois saisonniers bénéficiant de A.R.T.T doivent impérativement les poser avant l'issue de leur contrat. A défaut, ils seront perdus.
Les jours de A.R.T.T ne peuvent pas faire l'objet d'une indemnisation financière au terme d'un contrat
d'engagement.
Les jours A.R.T.T attribués en compensation du dépassement de la durée annuelle de travail de 1607 heures le sont au regard de la durée hebdomadaire de travail pour les cycles hebdomadaires et en fonction du temps de travail de l'agent (temps plein ou partiel), comme suit, soit avec arrondi à la demi-journée supérieure :
Durée hebdomadaire de travail                      37 h               37,5 h                  38 h                   39 h
NB de Jours A.R.T.T pour un agent à temps complet  12 jours           15 jours                18 jours               23 jours
Temps partiel 90 % (Temps annuel)                  11 jours           13,5 jours              16 jours               21 jours
Temps partiel 80 %                                 10 jours           12 jours                14,5 jours             18,5 jours
Temps partiel 70 %                                 8,5 jours          10,5 jours              13 jours               16 jours
Temps partiel 60 %                                 7,5 jours          9 jours                 11 jours               14 jours
Temps partiel 50 %                                 6 jours            7,5 jours               9 jours                11,5 jours
LES DISPOSITIONS SPECIFIQUES LIEES AU MODE DE DECOMPTE DES A.R.T.T
Les jours non travaillés n'ont pas vocation à être considérés comme du temps de travail effectif et par voie de conséquence, n'ouvrent pas droit à des jours de réduction du temps de travail.
Les absences au titre des congés pour raison de santé réduisent proportionnellement le nombre de jours de A.R.T.T que l'agent peut acquérir, conformément aux préconisations de la circulaire du 18 janvier 2012 relative aux modalités de mise en œuvre de l'article 115 de la loi n°2010-1657 du 29 décembre 2010 de finances pour 2011.
Cette règle s'applique également aux agents exerçant leurs fonctions à temps partiel au prorata de leur quotité de travail.
Ces motifs d'absence réduisent à due proportion le nombre de jours de A.R.T.T acquis annuellement pour les agents qui se sont absentés.
Un quotient de réduction du nombre de jours de A.R.T.T est calculé de la manière suivante, arrondi à la journée supérieure :
Q = Nombre de jours travaillés par an / Nombre de jours de A.R.T.T attribués annuellement
Dès lors, pour un agent qui, en cours d'année, atteint en une seule fois ou cumulativement, un nombre
de jours d'absence pour raisons de santé égal à Q, il convient d'amputer son crédit annuel de jours
A.R.T.T d'une journée » où Q est le « quotient de réduction » déterminé de la manière suivante : Q = N1 (nombre de jours ouvrables en régime hebdomadaire soit 228 jours (365 – 104 jours de week-end – 25 jours de congés payés – 8 jours fériés) / N2 (nombre de jours maximum de RTT générés en régime hebdomadaire).
Exemple : un agent soumis à un régime hebdomadaire à 38h sur 5 jours, bénéficie de 18 A.R.T.T.
       Cycles de                         Calcul effectué                                   Quotient a appliqué
        travail
       37 heures                         228/12 A.R.T.T= 19                      1 jour déduit pour 19 jours d'absences
       37,5 heures                      228/15 A.R.T.T= 15.2                            1 jour déduit pour 15,5 jours d'absences
       38 heures                       228/18 A.R.T.T= 12 ,66                    1 jour déduit pour 13 jours d'absences
       39 heures                        228/23 A.R.T.T= 9.91                     1 jour déduit pour 10 jours d'absences
Pour les agents à temps partiel, le calcul de N1 et N2 est proratisé en fonction de leur quotité de travail.
Le décompte des jours de A.R.T.T à retrancher du crédit de A.R.T.T annuels de l'agent est réalisé au fur et à mesure, dès que l'agent est placé en congés de maladie et que le nombre de jours de congés
atteint « Q ». Aucune disposition législative ou réglementaire ne permet le report du nombre de jours A.R.T.T non pris sur l'année N+1 suite à un congé pour raisons de santé.
Lorsque l'agent atteint, au cours de l'année, cumulativement, un nombre de jours d'absence égal au quotient de réduction, une journée de A.R.T.T est déduite de son crédit annuel de jours de A.R.T.T.
La déduction de A.R.T.T sera calculée à la journée.
Les jours de A.R.T.T ainsi déduits du capital annuel à la suite d'un congé pour raisons de santé sont défalqués au fur et à mesure sur la période de référence. Dans le cas où le nombre de jours de A.R.T.T à déduire est supérieur au droit de l'agent, la déduction peut s'effectuer sur les droits de la période suivante.
MODALITES DE PRISE DES JOURS DE A.R.T.T
50% des Jours de A.R.T.T devront être pris au 15/09/N de chaque année :
       Cycle de 37h00 : 6 Jours de A.R.T.T (sur 12)
       Cycle de 37h30 : 7,5 Jours de A.R.T.T (sur 15)
       Cycle de 38h00 : 9 Jours de A.R.T.T (sur 18)
       Cycle de 39h00 : 11,5 Jours de A.R.T.T (sur 23)
ARTICLE 4 - LES DONS DE JOURS DE REPOS
À UN AGENT D'UN ENFANT GRAVEMENT MALADE OU AIDANT FAMILIAL
Un agent peut sur sa demande renoncer anonymement et sans contrepartie, à tout ou partie de ses jours de RTT non pris et de jours de congés annuels dans la limite de 5 jours par an, au bénéfice d'un autre agent public relevant du même employeur, qui :
      Assume la charge d'un enfant âgé de moins de vingt ans atteint d'une maladie, d'un handicap ou victime d'un accident d'une particulière gravité rendant indispensables une présence soutenue et des soins contraignants ;
      Vient en aide à une personne atteinte d'une perte d'autonomie d'une particulière gravité ou présentant un handicap, lorsque cette personne est, pour le bénéficiaire du don, l'une de celles mentionnées aux 1° à 9° de l'article L. 3142-16 du codedu travail.
Le don de jours non épargnés sur un compte épargne-temps peut être fait jusqu'au 31 décembre de l'année au titre de laquelle les jours de repos sont acquis.
L'agent qui souhaite bénéficier d'un don de jours de repos formule sa demande par écrit auprès de l'autorité territoriale. Cette demande est accompagnée d'un certificat médical détaillé remis sous pli confidentiel établi par le médecin qui suit l'enfant ou l'adulte et attestant la particulière gravité de la maladie, du handicap ou de l'accident rendant indispensable une présence soutenue et des soins contraignants auprès de l'enfant ou de l'adulte.
L'agent qui donne un ou plusieurs jours de repos signifie par écrit à son responsable, le don et le nombre de jours afférents. Le don est définitif après accord du chef de service.
L'autorité territoriale dispose de 15 jours ouvrables pour informer l'agent bénéficiaire du don de jours de repos.
L'absence du service des agents publics bénéficiaires d'un don de jours de repos ne peut excéder 31jours consécutifs.
ARTICLE 5 - LE COMPTE EPARGNE TEMPS
DEFINITION
Le compte épargne-temps (C.E.T) permet de conserver des jours de congés annuels ou d' A.R.T.T non pris sur plusieurs années. Il est ouvert à la demande de l'agent qui est informé annuellement des droits épargnés et consommés.
Les jours épargnés peuvent être, en tout ou partie, utilisés sous forme de congés ou, si une délibération le prévoit, indemnisés ou pris en compte pour la retraite complémentaire.
Agent Bénéficiaires
Fonctionnaire titulaire ou contractuel
Vous pouvez demander l'ouverture d'un compte épargne temps (CET), que vous occupiez un emploi à temps complet ou non complet, si vous remplissez toutes les conditions suivantes :
      Être employé de manière continue
       Avoir accompli au moins 1 an de service
       Ne pas être soumis à des obligations de service fixées par le statut particulier
Agents Exclus
Les Fonctionnaires Stagiaires
Si avant d'être nommé stagiaire, un agent avait un CET, en tant que fonctionnaire titulaire ou contractuel, il ne peut pas utiliser les jours épargnés, ni en accumuler de nouveaux, pendant son stage.
À la titularisation, il pourra de nouveau utiliser les jours épargnés sur son CET et en épargner de nouveaux.
OUVERTURE ET ALIMENTATION
Demande d'ouverture ou d'alimentation du CET doit être faite par le biais des formulaires prévus à cet effet (à télécharger sur l'intranet).
Alimentation (Nombre de jours maxi) :
       Jours de congés annuels* :5 J
       Jours de fractionnement : 2 J
       Jour de A.R.T.T
*L'agent doit obligatoirement avoir pris au minimum 20 jours de congés annuels dans l'année en cours
ARTICLE 6 - LES CONGES LIES AUX NAISSANCES
CONGE MATERNITE
La constatation médicale de grossesse doit être effectuée par un médecin ou par une sage-femme.
Une déclaration de grossesse doit être adressée avant le 4e mois :
  Au service GCR pour les fonctionnaires et les stagiaires ;
  à la caisse de sécurité sociale pour les agents relevant du régime général ainsi qu'au service GCR.
La constatation de grossesse doit être effectuée avant la fin du troisième mois et déclarée à l'autorité territoriale avant la fin du 4ème mois.
DUREE
     NB de naissance         Rang de l'enfant                                  Durée en semaines
                                                           Prénatal               Postnatal                      Total                              
                                 1 ou 2ème                     6                       10                          16
              1
                                3ème ou plus                8 ou 10*                18 ou 16*                      26
         Jumeaux                                           12 ou 16**               22 ou 18**                     34
      Triplés ou plus                                          24                      22                          36
*La période prénatale du congé peut être portée à 10 semaines ; dans ce cas la période postnatale est de 16 semaines.
** La période prénatale du congé peut être augmentée de 4 semaines au maximum ; la période postnatale est alors réduite d'autant.
CONGES SUPPLEMENTAIRES LIES A LA SANTE DE LA MERE
Sur prescription médicale, le congé de maternité peut être augmenté :
  De 2 semaines, avant la date présumée de l'accouchement, pour grossesse pathologique ;
  De 4 semaines, après l'accouchement, en cas d'arrêt de travail nécessité par les suites de couches (couches pathologiques)
LA REMUNERATION
La rémunération de l'agent est versée à plein traitement.
En cas de travail à temps partiel, l'agent est rétabli à temps plein pour les droits à rémunération et à congés annuels.
CONGE PATERNITE
Après la naissance d'un enfant, le père ou la personne vivant en couple avec la mère : mariage, pacs ou concubinage (union libre) peut bénéficier d'un congé de paternité et d'accueil de l'enfant. Le bénéficiaire du congé peut être fonctionnaire (stagiaire ou titulaire) ou contractuel. La durée du congé varie selon qu'il s'agit d'une naissance unique ou multiple.
Durée du congé :
     Naissance d'un enfant : 25 jours calendaires
     Naissances multiples : 32 jours calendaires
Sur ces 25 ou 32 jours calendaires, 4 doivent obligatoirement être pris consécutivement et immédiatement après le congé de naissance de 3 jours.
Les agents peuvent choisir de prendre la période restante de 21 ou 28 jours calendaires de manière continue ou fractionnée en 2 périodes maximum d'au moins 5 jours chacune.
Ces 21 ou 28 jours doivent être pris dans les 6 mois suivant la naissance.
HOSPITALISATION DE L'ENFANT APRES LA NAISSANCE
Quand l'état de santé de l'enfant nécessite son hospitalisation immédiate après la naissance, une période supplémentaire de congé est accordée durant l'hospitalisation.
La période de congé de 4 jours consécutifs peut être prolongée, pendant la durée de l'hospitalisation, dans la limite de 30 jours consécutifs.
La période de 21 jours calendaires doit alors être prise dans les 6 mois suivant la fin de l'hospitalisation.
L'agent doit en faire la demande. L'administration ne peut pas refuser cette prolongation.
Demande de congé de paternité ou d'accueil de l'enfant (formulaire accessible sur Intranet).`.trim(),3:`
CHAPITRE 3 - AUTORISATIONS SPECIALE D'ABSENCES
Le congé annuel ne peut pas être interrompu par une autorisation d'absence, dans la mesure où celle- ci n'est accordée que pour permettre à un agent, qui aurait dû être présent pour assurer ses fonctions de s'absenter exceptionnellement de son service. Ces autorisations ne sont pas récupérables.
ARTICLE 1 - FETES RELIGIEUSES
Conformément aux dispositions réglementaires, les agents membre de la communauté arménienne, ou de confession religieuse bouddhiste, juive, musulmane, orthodoxe sont autorisés de manière prioritaire et sous réserve des nécessités de service, à poser une journée de congés. Les calendriers religieux sont rappelés annuellement par circulaire préfectorale.
FETES JUIVES
  Roch Hacha na (Jour de l'an)
  Yom Kippour (Grand pardon)
FETES MUSULMANES
  Al Mawlid Annabi
  Aïd El Fitr
  Aïd El Adha
Les dates pour certaines de ces fêtes étant fixées à un jour près, les autorisations d'absences pourront être accordées sur demande de l'agent avec un décalage d'un jour en plus ou en moins.
ARTICLE 2 - POUR GARDE D'ENFANT MALADE
Ces autorisations d'absence sont accordées pour soigner un enfant malade ou pour en assurer momentanément la garde sous réserve de nécessité de service et sur présentation d'un justificatif uniquement lorsque la situation résulte d'une cause imprévue.
Exemple : enfant malade ou nourrice malade, crèche ou école de l'enfant fermée.
Néanmoins, lorsqu'un mouvement de grève engendre un problème de garde, la ville accepte la pose d'une journée de garde d'enfant.
Ex : Ecole fermée pour grève.
L'agent qui accompagne son enfant à une consultation médicale prévue ne peut bénéficier d'autorisation de garde d'enfant (sauf pour les maladies graves ou handicaps).
Ces autorisations d'absence sont accordées à la famille jusqu'aux 16 ans de l'enfant (sans limite d'âge pour les enfants handicapés), quel que soit le nombre d'enfants.
DUREE DE DROIT COMMUN
Pour les agents travaillant à temps complet :
1 fois les obligations hebdomadaires de services + 1 jour soit 6 jours
Pour les agents travaillant à temps partiel :
1 fois les obligations hebdomadaires de services + 1 jour /quotité de travail de l'intéressé.
Exemple : Agent travaillant à 60% : (5+1) /100*60= 3.6 soit 4 jours
Ces jours peuvent être pris de manières fractionnées ou en continue en fonction de la situation et du besoin de l'agent.
Cas particuliers :
Doublement de la durée de droit commun pour (sur justificatif) :
  L'agent assumant seul la charge d'un enfant
  Le conjoint est à la recherche d'un emploi
  Le conjoint ne bénéficie d'aucune autorisation d'absence rémunérée.
L'agent, dont le conjoint bénéficie d'un nombre d'autorisations rémunérées inférieur au sien, peut obtenir la différence en supplément.
Exemple : Agent à temps complet dont le conjoint ne peut bénéficier que de 3 jours dans son emploi aura droit à 6+3=9 jours.
Le fait que le conjoint soit au foyer ne réduit pas le nombre de jours minimum d'autorisation d'absence.
L'agent peut bénéficier de 6 jours.
La demande peut être formulée a posteriori par écrit et sur présentation des justificatifs, l'agent doit cependant impérativement prévenir son responsable hiérarchique pour demander l'autorisation de s'absenter.
Dans le cas où ces autorisations ne seraient pas attribuées de manière fractionnée, leur durée totale peut être portée à 8 jours consécutifs (samedi et dimanche inclus) dans le 1er cas et 15 jours consécutifs dans le second.
Le décompte des jours octroyés se fait sur l'année civile sans report.
La première demande d'autorisation d'absence pour garde d'enfant doit faire l'objet de la présentation d'une attestation de l'employeur du conjoint précisant si celui-ci bénéficie de ces autorisations et leur durée. Dans l'hypothèse où les deux conjoints sont employés municipaux, ils doivent respectivement informer leurs responsables de service de la solution choisie : 6 jours chacun ou 12 jours à un seul des parents, ou toute autre formule souhaitée dans le cadre des 12 jours.
La Direction des Ressources Humaines (Service GCR) centralise les autorisations d'absence pour garde d'enfants qui doivent être demandées par l'agent à son Responsable de service, qui la transmet ensuite à la GCR (Cf. courrier du 13 janvier 2003). L'agent fait sa demande par le biais du formulaire disponible sur l'intranet.
Lorsqu'un agent arrive dans la collectivité en cours d'année, il bénéficie de la totalité des autorisations d'absence « garde d'enfant ». Il n'est pas possible de les proratiser en fonction de la date d'arrivée de l'agent dans la collectivité.
Pour des raisons de sécurité et de responsabilité de la collectivité, le personnel n'est pas autorisé à venir avec ses enfants sur le lieu de travail en cas de difficulté de garde.
ARTICLE 3 - POUR PRODIGUER DES SOINS OU ASSISTER UN MALADE
Au 1 janvier 2022, les agents municipaux sont autorisés, sur présentation d'un certificat médical précisant la nécessité absolue de leur présence auprès du malade, à s'absenter pendant :
Conjoint : 5 jours ouvrés
Père, mère : 5 jours ouvrés
Enfant à charge de + 16 ans : 5 jours ouvrés
Ascendants (Agent ou conjoint), frère, sœur, oncle, tante, neveu, nièce, beau-frère, belle-sœur : 3
jours ouvrés
Ces jours ne sont pas nécessairement consécutifs mais doivent faire l'objet d'une programmation.
Pour les autres membres de la famille, l'agent peut déposer une demande de congés annuels ou A.R.T.T.
ARTICLE 4 - POUR ACCOMPAGNER UNE PERSONNE EN FIN DE VIE : CONGE PROCHE AIDANT
Dans certaines situations de dépendance d'un proche, les agents peuvent être amenés à solliciter un congé proche aidant. Il s'agit d'un congé non rémunéré permettant à l'agent bénéficiaire de cesser totalement son activité lorsqu'un ascendant, un descendant, un frère, une sœur, une personne partageant le même domicile (liste des personnes à l'article L. 3142-16 du code du travail) ou l'ayant désigné comme sa personne de confiance au sens de l'article L. 1111-6 (*) du code de la santé publique, souffre d'une pathologie mettant en jeu le pronostic vital ou est en phase avancée ou terminale d'une affection grave et incurable, quelle qu'en soit la cause.
Le congé proche aidant est accordé, sur demande écrite de l'agent (congé non rémunéré) :
Pour une période continue d'une durée maximale de trois mois, renouvelable dans la limite d'un an sur l'ensemble de la carrière.
Par périodes fractionnées d'au moins sept jours consécutifs, dont la durée cumulée ne peut être supérieure à six mois ;
Sous forme d'un service à temps partiel dont la durée est de 50 %, 60 %, 70 % ou 80 % du temps de service que les fonctionnaires à temps plein exerçant les mêmes fonctions doivent effectuer. Le service à temps partiel est accordé pour une durée maximale de trois mois, renouvelable une fois.
Pendant la période de congé de proche aidant, l'agent n'est pas rémunéré par la collectivité mais il peut demander à bénéficier d'une allocation journalière du proche aidant (AJPA) de la part de la CAF.
Lors de la demande de congés proche aidant, l'agent doit fournir à l'appui de sa demande
les pièces justificatives suivantes :
    Déclaration sur l'honneur de votre lien familial avec la personne aidée ou de l'aide apportée à une personne âgée ou handicapée avec laquelle vous résidez ou entretenez des liens étroits et stables
    Déclaration sur l'honneur précisant que vous n'avez pas déjà bénéficié, au cours de votre carrière, d'un congé de proche aidant ou bien la durée pendant laquelle vous avez bénéficié de ce congé.
    La demande doit être accompagnée de la copie d'un certificat médical attestant l'état de santé de la personne accompagnée : la décision justifiant d'un taux d'incapacité permanente au moins égal à 80 % si la personne aidée est un enfant ou un adulte handicapé ou la décision d'attribution de l'allocation personnalisée d'autonomie (APA) si la personne aidée souffre d'une perte d'autonomie
Le congé de proche aidant prend fin :
   Soit à l'expiration de l'une des périodes de trois mois ;
   Soit dans les trois jours qui suivent le décès de la personne accompagnée ;
   Soit à la demande de l'agent, à une date antérieure.
ARTICLE 5 – EN CAS DE DECES D'UN MEMBRE DE LA FAMILLE
Les agents municipaux sont autorisés, sur présentation d'un certificat de décès, au plus tard à leurretour, à s'absenter à l'occasion des obsèques.
     Conjoint : 5 jours ouvrés
     Parents : 5 jours ouvrés
     Beaux-parents : 3 jours ouvrés
     Ascendants de l'agent ou de son conjoint : 3 jours ouvrés
     Petits-Enfants : 3 jours ouvrés
     Frères et sœurs de l'agent ou de son conjoint : 3 jours ouvrés
     Oncle, tante, neveu, nièce de l'agent ou du conjoint : 1 jour ouvré
     Enfant et/ou enfant du conjoint :
 Conditions                                                     Nombre de Jours d'autorisation
 Enfant de moins de 25 ans
 Enfant de moins de 25 ans à la charge effective et             14 jours ouvrables + 8 jours dans un délai d'un an à
 permanente de l'agent                                          compter du décès
 Enfant de plus de 25 ans ayant au moins un enfant
 Enfant de plus de 25 ans sans enfant                           12 jours ouvrables
ARTICLE 6 - A L'OCCASION D'UN MARIAGE OU PACS
Le mariage ou Pacs d'un membre de la famille de l'agent ouvre droit à autorisation d'absence surprésentation d'un acte de mariage.
     Agent : 7 jours ouvrés
     Enfant des agents : 3 jours ouvrés
     Ascendant, descendant, frère, sœur, beau-frère, belle-sœur, oncle, tante, neveu, nièce : 1 jour ouvré
Les jours accordés au titre d'un PACS ne pourront être de nouveau attribués en cas de mariage pour la même personne.
Ces jours ouvrés sont consécutifs et non fractionnables et doivent être pris impérativement au moment de la célébration ou à des dates entourant obligatoirement cette célébration.
ARTICLE 7 - ABSENCE LIEE A LA MATERNITE
Une circulaire ministérielle du 21 mars 1996 prévoit que, sur présentation d'un certificat médical ou avis de la médecine professionnelle, l'agent, dans la période antérieure au congé prénatal, peut bénéficier d'autorisations spéciales d'absence pour :
     Les séances préparatoires à l'accouchement psychoprophylactique (sans douleur) lorsque ces séances ne peuvent avoir lieu en dehors des heures de service.
     Les examens prénataux obligatoires si ceux-ci ne peuvent se dérouler en dehors des heures de service. L'autorisation ne peut excéder une demi-journée.
     Une heure par jour d'aménagement des horaires de travail à partir du premier jour du troisième mois de grossesse jusqu'au congé de maternité, sans récupération. Cette heure n'est pas due en cas de congés divers ou d'arrêt pour maladie ou accident du travail.
ARTICLE 8 - POUR UNE CONSULTATION MEDICALE
Les agents exerçant leur activité à temps plein sont autorisés, exceptionnellement, à s'absenter, sous réserve des nécessités de service, pour se rendre en consultation. Ces absences doivent faire l'objet de la présentation de la convocation au rendez-vous et devront faire l'objet d'une récupération ultérieure.
Par exception, les temps de consultation à la demande de la GCR chez les médecins experts ne sont pas récupérés.
Pour un traitement hospitalier de longue durée, un aménagement d'horaire est envisageable avec le responsable de service.
Exceptionnellement, pour les agents en situation de handicap (reconnaissance RQTH) ou de maladies graves, 4 jours par an (fractionnables en 8 demi-journées) peuvent leur être octroyer afin d'assurer leur suivi médical et soins.
La médecine de prévention atteste les agents répondant aux conditions requises (Formation spécialisée du 08/12/2023).
DON DU SANG OU DE PLAQUETTE
Les agents sont autorisés à s'absenter pour le don du sang et de plaquettes. Ils doivent préalablement en faire la demande auprès de leur responsable hiérarchique et produire un justificatif à leur retour.
ARTICLE 9 - RENTREE SCOLAIRE
Le jour de la rentrée scolaire et sous réserve des nécessités de service, les agents peuvent bénéficier de facilités horaires dans la limite d'une heure (dans la journée) pour accompagner ou aller chercher leur enfant à l'école (concerne les enfants scolarisés en maternelle, primaire et l'entrée en 6ème).
ARTICLE 10 – DEMENAGEMENT
A l'occasion d'un déménagement, les agents bénéficient, la semaine précédant ou la semaine suivant le déménagement, d'une journée d'autorisation d'absence (justifié par le changement d'adresse).
ARTICLE 11 – FORMATION
La journée de formation est considérée comme une journée de travail.
Si la journée de formation tombe sur une journée non travaillée (exemple : un samedi ou un dimanche), celle-ci sera récupérée.
Si la journée de formation tombe sur une demi-journée de travail (exemple : un agent qui travaille sur 4,5 Jours ou sur 4 Jours), l'agent récupère cette demi-journée.
Si la journée de formation a une durée supérieure au temps de travail habituel, il n'y a pas de récupération, et inversement si la durée est inférieure au temps de travail habituel, l'agent ne doit pas rendre d'heure à la collectivité.
CONGE DE PARTICIPATION OU EPREUVES D'UN CONCOURS OU EXAMEN PROFESSIONNEL
Concours ou examens professionnels de la fonction publique territoriale de catégories A, B ou C : 1 jour avant la 1ère épreuve d'admissibilité et 2 jours avant la 1ère épreuve d'admission sur présentation des convocations et justificatif de présence aux épreuves.
Ces jours sont accordés pour une seule participation à un concours et un examen par année civile.
PARTICIPATION A DES JURYS DE CONCOURS ET EXAMENS OU COMME FORMATEUR
Une autorisation d'absence, sous réserve des nécessités de service, de 10 jours fractionnables (en demi-journée) est accordée pour participer en tant que jury de concours et examens ou comme formateur dans les conditions suivantes.
Il sera accordé par année civile, pour les agents à temps complet (proratisé pour les agents à temps non-complet et à temps partiel) et dans la mesure où ces prestations ouvrent droit à rémunération :
     5 jours par an pour la participation à des jurys de concours. Au-delà les absences devront être prises sur des jours de congés.
     5 jours par an pour assurer des formations ou intervenir à des colloques. Au-delà, les absences devront être prises sur des jours de congés.
Les formations assurées, à Gennevilliers, pour des agents de la Ville seront de 5 jours maximum par an.
Les agents concernés doivent, dans tous les cas, avoir obtenu préalablement une autorisation de cumuls d'emplois (à déposer à la GCR avec l'avis du responsable hiérarchique). La demande devra être déposée au minimum 15 jours avant l'absence. L'agent doit accompagner sa demande de la copie de sa lettre de mission ou d'intervention.
Aucun report ou prise par anticipation de ces autorisations d'absence ne peut être effectué.
CONGE DE REPRESENTATION
Les agents qui ont reçu mandat d'une association ou d'une mutuelle pour la représenter à l'occasion d'une réunion organisée par une des instances de l'Etat ou d'une Collectivité Territoriale peuvent bénéficier d'un congé dans la limite de 9 jours ouvrables par an avec possibilité d'un cumul maximum pouvant être porté à 12 jours ouvrables annuels dans la limite des délais légaux.
Les agents qui ont un mandat politique bénéficieront sur leur demande, des autorisations d'absence en fonction de la réglementation en vigueur.
Les agents doivent en faire la demande par écrit auprès de l'autorité territoriale au moins 15 jours avant en précisant la date et la durée de l'absence accompagnée de tous les éléments et documents justifiant qu'ils ont reçu mandat d'une association ou mutuelle pour la représenter à cette occasion. A son retour de congé, l'agent remet à l'autorité territoriale une attestation de présence effective à la réunion de cette instance.`.trim(),4:`
CHAPITRE 4 - LES ABSENCES POUR MALADIES ET ACCIDENTS
ARTICLE 1 - LA MALADIE
Il apparaît nécessaire de rappeler les règles de gestion des absences pour maladie ordinaire car leur non-respect peut notamment mettre les services en difficulté et avoir des conséquences sur la prise en charge des arrêts par la Sécurité Sociale et le versement des indemnités journalières.
Pour obtenir un congé de maladie ou son renouvellement, fonctionnaires et agents contractuels n'ont pas la même démarche à suivre. Néanmoins la première étape citée ci-après leur est commune.
Congés de maladie d'un agent annualisé :
     Si le congé de maladie est sur une journée normalement travaillée : les heures initialement prévues sont considérées comme faites.
     Si le congé de maladie est sur une journée non travaillée : aucune incidence.
     Si le congé de maladie est sur un jour de congé annuel posé et validé : l'agent a droit au report de son congé.
1ERE ETAPE - AVERTIR LE SERVICE                                                                                             38
Il est recommandé de prévenir ou de faire prévenir le service le plus rapidement possible de son absence au travail. Il en va de la bonne marche du service. Toutes les absences n'ont pas les mêmes conséquences mais toutes ont un effet sur l'organisation et plus vite le service est prévenu, plus vite il peut réagir.
L'information comprend éventuellement deux phases :
     "je ne peux pas venir travailler aujourd'hui".
     "je suis arrêté(e) jusqu'à telle date".
De même, en cas de prolongation, il est recommandé d'avertir le service, la veille de la reprise initialement prévue afin d'informer des nouvelles dates d'arrêt.
2EME ETAPE : TRANSMETTRE L'ARRÊT MALADIE
Cette seconde étape est différente selon que l'on est :
Fonctionnaire (stagiaire ou titulaire affilié à la CNRACL)
     L'agent doit adresser à la GCR les volets n°2 et n°3 de l'avis d'arrêt de travail dans les 48 heures suivant son établissement par voie postale à la Direction des Ressources Humaines - Service Gestion des Carrières et des Rémunérations (adresse postale 177, avenue Gabriel-Péri - 92237 GENNEVILLIERS cedex). Toutefois, ce délai d'envoi peut être dépassé si l'agent justifie d'une hospitalisation.
     Le volet n°1 dans lequel figurent les données médicales confidentielles doit être conservé par l'agent. En cas de contrôle médical, le médecin contrôleur peut l'exiger.
A l'exception du 1er volet, gardé par l'agent, l'arrêt de travail doit être impérativement transmis, sous 48 heures, par voie postale à la Direction des Ressources Humaines - Service Gestion des Carrières et des Rémunérations (adresse postale 177, avenue Gabriel-Péri – 92237 GENNEVILLIERS cedex).
Agent contractuel :
L'agent doit adresser dans les 48 heures suivant la date d'interruption de travail :
   Les volets n°1 et n°2 de son avis d'arrêt de travail à sa CPAM afin de bénéficier des indemnités journalières.
   Le volet n°3 à la Direction des Ressources Humaines - Service Gestion des Carrières et des Rémunérations (adresse postale 177, avenue Gabriel-Péri – 92237 GENNEVILLIERS cedex).
Les arrêts maladie sont transmis par l'agent au centre de Sécurité Sociale dont il relève, sous 48 heures. Ce délai est impératif sous peine d'un refus de prise en charge par celui-ci.
En aucun cas, l'arrêt de travail ne doit être transmis au service de l'agent.
JOURNEE DE CARENCE
Une journée de carence sera établie pour les agents titulaires et stagiaires, à temps complet, non complet et à temps partiel mais également pour les contractuels de droit public détenant une ancienneté supérieure à 4 mois.
Pour les agents de droit privé et les agents ayant moins de 4 mois d'ancienneté dans la collectivité, la carence de 3 jours sera appliquée.
Cette carence ne peut en aucun cas être compensée par des jours de congé ou de RTT. La carence ne s'applique pas dans le cadre : d'une prolongation d'arrêt, d'un deuxième arrêt initial quand la reprise entre les deux arrêts initiaux n'excède pas 48h00, d'un arrêt pour accident de service, d'une maladie professionnelle, d'un congé longue maladie, d'un congé de longue durée, d'un congé de grave maladie, d'une affection de longue durée, d'un arrêt maladie en lien avec un état de grossesse
si déclaration de grossesse transmise à l'employeur.
La retenue de la carence est effectuée sur le traitement de base, le régime indemnitaire, la NBI etl'indemnité de résidence à hauteur de 1/30ième ou 3/30ième (pour les agents de droit privé et ceux ayant moins de 4 mois d'ancienneté).
LA CONTRE VISITE
Le contrôle médical concerne tous les agents fonctionnaires, stagiaires et contractuels.                                    40
L'autorité territoriale peut procéder à tout moment à une contre visite par un médecin agréé afin de vérifier le bien-fondé du congé de maladie.
L'agent a l'obligation de s'y soumettre. Cette contre visite doit être obligatoirement organisée pendant
le congé maladie.
Le contrôle médical s'effectue, soit sur convocation au cabinet du médecin, soit au domicile de l'intéressé. Tout changement de résidence doit être signalé par l'agent à la DRH.
Lorsque le contrôle n'a pu être exercé du fait de la négligence de l'agent à communiquer l'adresse où il peut être visité, son traitement pourra être suspendu.
Le service GCR de la DRH informe l'agent du jour et du créneau horaire de la contre visite afin que celui-ci soit présent à son domicile.
L'autorité territoriale pourra suspendre le versement des rémunérations et engager une procédure disciplinaire à l'encontre de l'agent qui refuse de se soumettre au contrôle.
L'EXPERTISE MEDICALE
Concernant les accidents de service et les maladies professionnelles, une expertise peut être engagée pour vérifier la validité de l'arrêt de travail.
LES ABSENCES INJUSTIFIEES
En cas d'absence injustifiée d'un agent, le service en informe la DRH dès qu'il en a connaissance, et dans un délai maximal de deux mois. Un courrier est adressé par la DRH à l'agent afin qu'il produise un justificatif.
A défaut de justificatif, une retenue sur rémunération sera opérée.
Il est rappelé que toute absence injustifiée constitue un manquement à l'obligation de servir à laquelle est soumise tous les agents publics.
ARTICLE 2 - LES ACCIDENTS DE SERVICE (OU DE TRAVAIL) ET DE TRAJET
LES ACCIDENTS DE SERVICE ET DE TRAJET
Définitions
        L'accident de service s'applique à tout accident survenu dans le temps et sur le lieu du service, dans
        l'exercice ou à l'occasion de l'exercice des fonctions ou d'une activité qui en constitue le prolongement
        normal.
        L'accident de trajet lui concerne l'accident dont est victime l'agent qui se produit sur le parcours
        habituel entre le lieu où s'accomplit son service et son lieu de résidence ou de restauration.
Déclaration
En cas d'accident de service ou de trajet, l'agent doit transmettre à la DRH (service GCR) une
déclaration d'accident (formulaire disponible sur Intranet) et la transmettre :                                                41
   Sous 48 heures pour l'agent contractuel ou fonctionnaire rattaché au régime général
   Sous 15 jours pour le fonctionnaire affilié au Régime Spéciale
L'agent doit également faire constater son état par un médecin qui établit un certificat médical
décrivant les lésions et leur localisation ou la nature de la maladie et transmettre ce certificat médical à la DRH (service GCR) sous 48h.
ARTICLE 3 – LA PRISE EN CHARGE DE LA REMUNERATION
POUR LES AGENTS TITULAIRES AFFILIES A LA CNRACL

Nature de l'arrêt                            Durée              Plein traitement (salaire             Demi-traitement (demi-
                                            maximum                     complet)                             salaire)
Maladie ordinaire                               1 an                        3 mois                               9 mois
Longue maladie                                 3 ans                          1 an                               2 ans
Longue durée                                   5 ans                         3 ans                               2 ans
Accident de service et de trajet                       Plein traitement jusqu'à la reprise de son activité
POUR LES AGENTS TITULAIRES AFFILIES A L'IRCANTEC

Nature de l'arrêt                            Durée              Plein traitement (salaire             Demi-traitement (demi-
                                            maximum                     complet)                             salaire)
Maladie ordinaire                               1 an                        3 mois                               9 mois
Grave maladie                                  3 ans                          1 an                               2 ans
Accident de service et de trajet             Tant que                        3 ans                   Pas de demi-traitement,
                                           l'agent est                                                  la CPAM versera
                                          inapte à ses                                              directement à l'agent ses
                                            fonctions                                                indemnités journalières
POUR LES AGENTS CONTRACTUELS AFFILIES AU REGIME GENERAL DE LA SECURITE SOCIALE
Nature de l'arrêt
                                           Ancienneté de l'agent                    Plein             Demi-traitement (demi-
                                                                                 traitement                  salaire)           42
                                                                                   (salaire
                                                                                  complet)
Maladie ordinaire                                   < 4 mois
                                              > 4 mois < 2 ans                     1 mois                        1 mois
                                                 2 ans < 3 ans                     2 mois                        2 mois
                                                    > 3 ans                          3 mois                      3 mois
Grave maladie                                        > 3 ans
                                                 3 ans et plus                       1 ans                       2 ans
Accident de service et de trajet                       > 1 an                      1 mois
                                                  1= > 3 ans                       2 mois                          (**)
                                                    > 3 ans                        3 mois
`.trim()},Jp=`
            RÈGLEMENT INTÉRIEUR FORMATION
Préambule
La formation joue un rôle clef dans la politique mise en œuvre par la collectivité. Elle doit permettre aussi d'adapter et de perfectionner les services aux nouvelles technologies, à la gestion et au développement de projets complexes. Il s'agit de maintenir une adéquation entre les compétences des agents et l'évolution de leurs emplois, pour leur permettre d'exercer plus efficacement leurs fonctions en vue de satisfaire au mieux les
besoins des usagers.
La formation doit favoriser la promotion professionnelle et le développement des qualifications et compétences des agents. C'est un outil de gestion du parcours individuel des agents.
La formation peut permettre des évolutions de carrière par l'intermédiaire des concours et examens professionnels ou faciliter l'obtention de diplômes grâce à la validation des acquis de l'expérience (VAE).
Elle concourt à l'égalité d'accès aux différents grades et emplois, en particulier entre femmes et hommes, et à la progression des personnes les moins qualifiées
Enfin la formation tient une place primordiale aussi bien dans la gestion prévisionnelle
des emplois, des effectifs et des compétences (GPEEC), que dans le cadre d'une démarche de professionnalisation des agents.
L'objectif du règlement de formation est de permettre à chaque agent de la Ville, du CCAS, de la Caisse des Ecoles, de connaître ses droits et ses obligations en matière de formation, les conditions d'accès aux formations et les modalités d'exercice.
Le droit à la formation
Les agents stagiaires, titulaires, contractuels de droit public qui occupent un emploi permanent sont concernés par la formation dans les conditions prévues par les textes de référence (loi n°2019-828 du 6 août 2019)
Sont également concernés les agents en congé parental.
L'ensemble des agents de la collectivité bénéficie d'un accès à la formation conformément à la réglementation en vigueur, et dans la mesure de la continuité du service. A cet effet, un plan de formation est réalisé annuellement grâce au recueil des
besoins de l'ensemble des agents (Art. L423-3 du Code Général de la Fonction Publique).
Toute période de formation professionnelle est considérée comme du temps de travail,
sauf dans les cas particuliers de la disponibilité pour études ou recherches.
L'autorisation de participer à une formation est toujours soumise aux nécessités de service.
Les agents en congé de maladie, d'accident de service ou en congé de maternité ne peuvent pas participer aux actions de formation.
Toutefois, par exception, un fonctionnaire peut bénéficier d'une formation ou d'un bilan de compétences, à sa demande et sous réserve d'un avis médical favorable et de l'avis du service développement des compétences RH, pendant un congé pour indisponibilité physique (congé de maladie ordinaire, congé de longue maladie, congé de longue durée, congé d'invalidité temporaire imputable au service), mais uniquement en vue de sa réadaptation ou de sa reconversion professionnelle (article L.822-30 du code général de la fonction publique). Pour les agents IRCANTEC soumis au régime général de la sécurité sociale, l'accord de la CPAM doit être également sollicité (article L.323-3-1 du code de la sécurité sociale).
Un accès à la formation est également privilégié pour les agents concernés par une
procédure de reclassement pour inaptitude physique.
Les agents en position de disponibilité sont exclus des formations prises en charge par l'employeur.
Acteurs de la formation
INTERNES A LA COLLECTIVITE :
       - Les élus : l'organe délibérant approuve, sur proposition de l'autorité territoriale, par ses délibérations, les dispositions relatives à la formation qui lui sont soumises (il vote par exemple les crédits alloués à la formation). Le plan de formation lui est présenté.
       - L'autorité territoriale autorise les départs en formation, soumis aux nécessités de service.
        - La direction des ressources humaines, par le biais du service DCRH, recueille et traite les demandes des agents et organise les formations obligatoires prévues par le statut pour certains grades. Le référent formation assure le conseil, la mise en œuvre et le suivi administratif et financier du plan de formation.
       - Le responsable hiérarchique évalue et participe à la définition des besoins individuels et collectifs des agents de son service. Il évalue également les bénéfices des actions de formation. Il a, auprès des agents, un rôle d'explication du règlement, outil sur lequel il pourra s'appuyer lors des entretiens annuels d'évaluation pour aborder les questions de formation.
       - Les agents expriment leurs besoins de formation. Ils peuvent bénéficier, à leur demande, d'un accompagnement personnalisé destiné à les aider à élaborer et à mettre en œuvre leur projet professionnel. Par leur implication, Ils sont les principaux acteurs de leur parcours de formation et à ce titre, ils font valoir leurs droits et remplissent leurs obligations règlementaires à cet égard.
LES INSTANCES CONSULTATIVES :
Le Comité Social Territorial :
Le CST de la collectivité territoriale doit être consulté pour avis sur toutes les dispositions générales relatives à la formation. Le plan de formation lui est présenté ainsi que le bilan des actions de formation, notamment dans le cadre du rapport social unique (RSU).
Les Commissions Administratives Paritaires et les Commissions
Consultatives Paritaires :
Les CAP et les CCP sont consultées sur certaines questions d'ordre individuel relatives à la formation.
EXTERNES A LA COLLECTIVITE
Le Centre National de la Fonction Publique Territoriale, le CNFPT est l'établissement public chargé de dispenser les formations, auquel la collectivité territoriale ou l'établissement public verse une cotisation correspondant à 0,9 % de la masse salariale.
La collectivité de Gennevilliers verse sa cotisation au CNFPT – délégation Ile de France.
Les agents doivent donc prioritairement s'inscrire sur les formations délivrées par celle-ci. Une copie du plan de formation est transmise à la délégation régionale du CNFPT.
LES AUTRES ORGANISMES DE FORMATION :
Lorsqu'un agent souhaite bénéficier d'une formation non dispensée par le CNFPT, il doit en faire la demande par le biais du formulaire dédié disponible sur l'Intranet de la Ville. Ce formulaire dûment complété et comportant l'avis hiérarchique doit être accompagné d'un devis avant transmission au service DCRH. La demande fait l'objet d'un arbitrage en fonction de sa pertinence, de son recensement préalable, de son coût.
Le service DCRH informe l'agent et sa direction de l'accord ou du refus de formation.
Type de formation
Formations obligatoires :
Formation d'intégration :
  •   Objectif : doter le fonctionnaire nouvellement nommé dans un cadre d'emplois
      ainsi que les agents recrutés sur un emploi permanent pour une durée d'au moins
      un an, des connaissances relatives à l'environnement territorial. La formation
      porte notamment sur l'organisation et le fonctionnement des collectivités
      territoriales et sur le statut de la fonction publique. Le suivi de cette formation en
      intégralité dans les délais impartis conditionne la titularisation.
         o   Bénéficiaires : Tous les fonctionnaires des catégories A, B, et C, ainsi que
             les agents contractuels recrutés pour une durée d'au moins un an sur poste
             permanent.
         o   Durée : 10 jours pour les catégories A et B, 5 jours pour la catégorie C.
         o   Délai : Doit être réalisée dans l'année suivant la nomination.
         o   Dispenses : Dispenses possibles pour certains agents ou sur demande
             avec justification.
         o   Démarches : Inscription dès la nomination via la plateforme du CNFPT.
         o   Prise en charge : En région Ile de France, prise en charge des frais de
             transport à 100% (transport en commun).
                 ▪   En dehors d'Ile de France, frais de transport et d'hébergement
                     indemnisés selon le barème du CNFPT.
Formation de professionnalisation :
         o   Objectif : permettre aux fonctionnaires de s'adapter à leur emploi et de maintenir leurs compétences à niveau tout au long de leur carrière. La durée des formations est au minimum celle prévue par le statut particulier de chacune d'entre elles et son contenu est choisi par l'agent en lien avec la collectivité et avec le concours du CNFPT. Elle se décline en plusieurs types, chacun répondant à des besoins spécifiques en fonction de l'évolution professionnelle de l'agent.
Formation de Professionnalisation au Premier Emploi
o Objectif : Permettre aux nouveaux agents de s'adapter rapidement à leur premier emploi, en fonction des missions définies par leurs statuts particuliers.
o Bénéficiaires : Tous les fonctionnaires nouvellement nommés stagiaires, y compris ceux en détachement et ceux nommés par promotion interne.
o Durée : 5 à 10 jours pour les agents de catégorie A et B, 3 à 10 jours pour les agents de catégorie C.
o Délai : Doit être réalisée dans les 2 ans suivant la nomination dans le cadre d'emploi.
Formation de Professionnalisation Tout au Long de la Carrière
o Objectif : Maintenir et développer les compétences des agents tout au long de leur carrière, pour répondre aux évolutions des métiers.
o Bénéficiaires : Tous les fonctionnaires.
o Durée : 2 à 10 jours pour tous les agents, indépendamment de leur catégorie.
o Périodicité : Tous les 5 ans suivant la formation de professionnalisation au premier emploi.
Formation de Professionnalisation à la suite de l'affectation sur un poste à responsabilité
o Objectif : Préparer les agents à assumer des responsabilités accrues lorsqu'ils sont affectés à un poste à responsabilité.
o Bénéficiaires : Tous les fonctionnaires.
o Durée : 3 à 10 jours pour tous les agents.
o Délai : Doit être réalisée dans les 6 mois suivant l'affectation sur un poste à responsabilité.
Dispenses
• Dispense Totale ou Partielle : Possible en concertation avec l'agent, compte tenu des formations professionnelles.
• Demande de Dispense : L'autorité territoriale présente un dossier de demande de dispense au CNFPT, qui décide de l'accorder ou non.
  o Prise en charge :
    ▪ En région Ile de France, prise en charge des frais de transport à 100% (transport en commun).
    ▪ En dehors d'Ile de France, frais de transport et d'hébergement indemnisés selon le barème du CNFPT.
    • La promotion interne est subordonnée, entre autres critères, à l'accomplissement des formations de professionnalisation prévues par le statut particulier du cadre d'emplois d'origine du fonctionnaire.
Les formations en hygiène et sécurité
        o   Objectif : permettre de développer les compétences et les connaissances des agents en vue d'assurer leur sécurité et protéger leur santé au travail. Ces obligations de formations englobent la formation générale à la sécurité (la formation aux premiers secours, gestes et postures…), ainsi que des formations techniques spécifiques liées aux postes de travail ou aux matériels utilisés (habilitation électrique, conduite d'engins ou de véhicules, HACCP…)
        o   Bénéficiaires : Fonctionnaires titulaires ou stagiaires, agents contractuels.
        o   Durée : Variable selon la formation
        o   Démarches : Demande à l'employeur, 6 semaines avant
        o   Prise en charge : Frais pédagogiques et frais annexes pris en charge par l'employeur ou le CNFPT.
Formations non obligatoires :
Préparation aux concours et examens professionnels :
        o   Objectif : Préparer les agents aux avancements de grade ou changements de cadre d'emplois.
        o   Bénéficiaires : Fonctionnaires titulaires ou stagiaires, agents contractuels.
        o   Durée : Variable selon le concours ou examen préparé.
        o   Délais : 12 mois entre deux formations similaires, sauf si la durée effective est inférieure à 8 jours.
        o   Démarches : Inscription sur la plateforme du CNFPT, demande d'autorisation à l'autorité territoriale.
        o   Prise en charge :
               ▪   Frais pédagogiques couverts par la cotisation au CNFPT
               ▪   Frais de déplacement 75 % (transport en commun) et de restauration (14 €) prise en charge par la collectivité en Ile de France
               ▪   Si préparation en dehors d'Ile de France, exceptionnellement pour des préparations non organisées en Ile de France, pris en charge de la DAF, si pas de prise en charge par le CNFPT.
Participation à des Concours ou Examens Professionnels
        o   Les jours des épreuves sont sur du temps de travail, seulement pour les concours et les examens de la fonction publique territoriale.
        o   Congés pour préparation : 1 jour avant les épreuves d'admissibilité et 2 jours avant l'épreuve d'admission, sur présentation des convocations et justificatifs de présence. Accordé une seule fois par an pour un concours ou examen.
        o   Démarches : Demande à l'employeur dès réception de la convocation à l'épreuve.
        o   Prise en charge : 75 % du titre de transport en commun si pas de passe Navigo.
Reconnaissance de l'Expérience Professionnelle (REP)
        o   Objectif : La REP permet aux agents de la fonction publique territoriale de faire reconnaître leur expérience professionnelle comme équivalente à un diplôme, facilitant ainsi l'accès à certains concours sans posséder les diplômes requis.
        o   Bénéficiaires : Tous les agents territoriaux peuvent bénéficier de la REP.
        o   Conditions d'Éligibilité : Les agents doivent justifier d'une expérience professionnelle significative et pertinente par rapport au concours visé.
        o   Démarches : L'agent doit soumettre une demande de REP à l'organisateur du concours, en fournissant les preuves de son expérience professionnelle.
        o   Examen de la Demande : L'organisateur du concours examine l'expérience professionnelle du candidat en comparaison avec les connaissances, compétences et aptitudes requises pour l'obtention du diplôme et décide si l'expérience professionnelle du candidat est suffisante pour accéder au concours sans diplôme.
Lutte contre l'illettrisme et apprentissage du français :
        o   Objectif : Réacquérir les savoirs de base en lecture, écriture, calcul.
        o   Bénéficiaires : Agents ne maîtrisant pas les savoirs de base.
        o   Durée : sans durée prescrite, selon niveaux définis par le CNFPT
        o   Démarches : Demande à l'employeur 6 semaine avant le début de la formation, autorisation sous réserve des nécessités de service.
        o   Prise en charge : Cotisation du CNFPT.
        o   Refus : L'autorité territoriale ne peut opposer deux refus successifs à un agent demandant à bénéficier d'une même action de formation qu'après avis de la commission administrative paritaire.
               ▪   S'il l'agent n'a pas l'accord de son employeur 2 années de suite, il peut s'adresser au CNFPT auprès duquel il bénéficie d'une priorité d'accès aux actions de formations équivalentes.
Formation diplômante ou qualifiante :
        o   Objectif : Obtenir un diplôme ou une qualification reconnue.
        o   Bénéficiaires : Fonctionnaires et agents contractuels.
        o   Durée : Variable selon le diplôme ou la qualification visée.
        o   Démarches : Demande à l'employeur 6 semaines avant le début de la formation.
        o   Prise en charge : sous réserve des priorités de la collectivité, du budget alloué et de l'inscription dans le plan de formation.
               ▪   si formation est à la demande de l'agent uniquement, la participation de la collectivité est à hauteur de 70 % des frais pédagogique.
               ▪   Pas de prise en charge de frais annexes.
Formation de perfectionnement :
        o   Objectif : Développer ou acquérir de nouvelles compétences liées au poste et au métier.
        o   Bénéficiaires : Fonctionnaires et agents contractuels.
        o   Durée : Sans durée prescrite.
        o   Délais : 12 mois entre deux formations similaires, sauf si la durée effective est inférieure à 8 jours.
        o   Démarches : Demande à l'employeur 6 semaines avant
        o   Prise en charge : sous réserve des priorités de la collectivité, du budget alloué et de l'inscription dans le plan de formation.
               ▪   si formation est à la demande de l'agent uniquement, la participation de la collectivité est à hauteur de 70 % des frais pédagogique.
               ▪   Pas de prise en charge de frais annexes.
        o   Refus : L'autorité territoriale ne peut opposer deux refus successifs à un agent demandant à bénéficier d'une même action de formation qu'après avis de la commission administrative paritaire.
               ▪   S'il l'agent n'a pas l'accord de son employeur 2 années de suite, il peut s'adresser au CNFPT auprès duquel il bénéficie d'une priorité d'accès aux actions de formations équivalentes.
Formation syndicale :
        o   Objectif : Acquérir des connaissances en matière syndicale.
        o   Bénéficiaires : Tous les agents, fonctionnaires ou contractuels. Dans les collectivités de plus de 100 agents, le pourcentage des agents partant en congé pour formation syndicale ne peut représenter que 5% de l'effectif réel.
        o   Durée : 12 jours ouvrables par an.
        o   Démarches : Demande écrite à l'autorité territoriale au moins un mois avant le début du stage.
        o   Prise en charge : Frais à la charge de l'organisation syndicale organisatrice.
        o   Refus : L'employeur peut refuser un tel congé pour des raisons de nécessité de service. En cas de refus , celui-ci doit être motivé est communiqué à la CAP/ CCP.
La formation des membres du CST :
        o   Objectif : La formation des membres du CST est essentielle pour leur permettre d'exercer efficacement leurs missions en matière de santé, de sécurité et de conditions de travail. Elle vise à leur fournir les connaissances nécessaires pour identifier les risques professionnels, proposer des actions de prévention et contribuer à l'amélioration des conditions de travail.
        o   Bénéficiaires : Tous les membres, qu'ils soient titulaires ou suppléants, doivent bénéficier de la formation nécessaire à l'exercice de leurs missions.
        o   Durée : La durée de la formation est généralement de 3 à 5 jours, selon les besoins et les thématiques abordées.
        o   Contenu : La formation couvre divers aspects, notamment :
               ▪   Les missions et le fonctionnement du CST.
               ▪   Les principes généraux de prévention des risques professionnels.
               ▪   Les méthodes d'analyse des risques et des conditions de travail.
       ▪   Les obligations de l'employeur en matière de santé et sécurité au travail.
       ▪   Les droits et devoirs des membres du CST.
o   Organisme de Formation : La formation est assurée par des organismes agréés par le ministère du Travail ou des organismes spécialisés dans la formation en santé et sécurité au travail.
o   Prise en Charge : Les frais pédagogique et les frais annexes sont pris en charge par l'employeur.
Périodes Spécifiques au Service de la Formation
Congés :
Congé de formation professionnelle :
        o   Objectif : Suivre une formation longue pour un projet professionnel ou personnel.
        o   Bénéficiaires : Fonctionnaires et agents contractuels avec au moins 3 ans de service, dont les 12 derniers mois dans la collectivité.
        o   Durée : Maximum 3 ans sur la carrière, utilisable en une ou plusieurs fois. Cette durée peut être de 5 ans pour les agents de catégorie C ne disposant pas du baccalauréat ou bénéficiaire de l'obligation d'emploi ou confrontés à un risque d'usure professionnelle attesté par le médecin du travail.
        o   Démarches : Demande écrite 90 jours avant le début de la formation, réponse de l'employeur dans les 30 jours.
        o   Prise en charge : Frais de formation à la charge de l'agent sauf accord de la collectivité ;
        o    Rémunération : L'agent en formation perçoit pendant la première année de congé une indemnité mensuelle égale à 85 % de son traitement indiciaire brut et de l'indemnité de résidence perçus au moment de sa mise en congé. Toutefois, cette indemnité mensuelle ne peut pas être supérieure à 2 778,62 € brut par mois. Les années de congé suivantes ne sont pas rémunérées, sauf pour les agents de catégorie C ne disposant pas du baccalauréat ou bénéficiaire de l'obligation d'emploi ou confrontés à un risque d'usure professionnelle attesté par le médecin du travail, pour qui la seconde année est rémunérée.
        o   Refus : L'autorité territoriale ne peut opposer deux refus successifs à un agent demandant à bénéficier d'une même action de formation qu'après avis de la commission administrative paritaire.
Congé pour bilan de compétences :
        o   Objectif : Analyser les compétences, aptitudes et motivations professionnelles.
        o   Bénéficiaires : Fonctionnaires, agents contractuels, assistants maternels et familiaux.
        o   Durée : 24 heures de temps de service, fractionnables en plusieurs
            séances. Pour les agents territoriaux appartenant à certaines catégories,
            cette durée est portée à 72 heures de temps de service. Ces catégories incluent :
               ▪   Les agents de catégorie C n'ayant pas atteint un niveau de formation sanctionné par un diplôme ou un titre professionnel correspondant au niveau 4.
               ▪   Les agents en situation de handicap.
               ▪   Les agents particulièrement exposés à un risque d'usure professionnelle.
        o   Fréquence : Un agent ne peut prétendre à un autre bilan de compétences qu'à l'expiration d'un délai de cinq ans après l'achèvement du précédent, sauf pour certains agents où ce délai est réduit à trois ans (liste ci-dessus).
        o   Démarches : Demande 60 jours avant le début du bilan, réponse de l'employeur dans les 30 jours.
        o   Prise en charge : sous réserve des priorités de la collectivité, du budget alloué et de l'inscription dans le plan de formation.
Congé pour validation des acquis de l'expérience (VAE) :
        o   Objectif : Obtenir un diplôme ou une qualification grâce à l'expérience professionnelle.
        o   Bénéficiaires : Fonctionnaires, agents contractuels, assistants maternels et familiaux.
        o   Durée : 24 heures, 72 heures pour les agents de catégorie C ne disposant pas du baccalauréat ou bénéficiaire de l'obligation d'emploi ou confrontés à un risque d'usure professionnelle attesté par le médecin du travail.
        o   Démarches : Demande 60 jours avant le début des actions de VAE, réponse de l'employeur dans les 30 jours.
        o   Prise en charge : sous réserve des priorités de la collectivité, du budget alloué et de l'inscription dans le plan de formation.
Congé de transition professionnelle :
        o   Objectif : permettre à certains agents, en cas de nécessité d'exercer un nouveau métier constaté d'un commun accord entre l'agent et la collectivité qui l'emploie, de suivre une action ou un parcours de formation longs, en vue d'exercer le nouveau métier.
        o   Sont éligibles les actions ou parcours de formation :
               ▪   D'une durée égale ou supérieure à 120 heures et sanctionnées par une certification professionnelle enregistrée au répertoire national prévu à l'article L. 6113-1 du code du travail, par une attestation de validation de blocs de compétences ou par une certification ou habilitation enregistrée dans le répertoire spécifique mentionné à l'article L. 6113-6 du même code.
               ▪   D'une durée égale ou supérieure à 70 heures et permettant d'accompagner et de conseiller les créateurs ou repreneurs d'entreprises.
        o   Bénéficiaires : agents de catégorie C ne disposant pas du baccalauréat ou bénéficiaire de l'obligation d'emploi ou confrontés à un risque d'usure professionnelle attesté par le médecin du travail.
        o   Durée : Maximum 1 an, prolongeable par un congé de formation professionnelle.
        o   Démarches : Demande 3 mois avant le début de la formation, réponse de l'employeur dans les 2 mois.
        o   Prise en charge : Frais de formation et annexes à la charge de la collectivité, dans la limite d'un plafond de 6000 €. Réf. délibération du 25 juin 2025.
        o   Rémunération : L'agent en congé de transition professionnelle conserve son traitement brut et, le cas échéant, l'indemnité de résidence et le SFT. Les primes et indemnités sont maintenues pour les situations d'agent en suppression d'emploi et en situation d'inaptitude au poste. Réf. délibération du 25 juin 2025.
Autres Dispositifs :
  •   Période d'immersion professionnelle :
         o   Objectif : permet aux agents d'appréhender la réalité d'un métier, d'observer sa pratique et l'environnement professionnel dans lequel elle se déroule. Cela vise à confirmer leur projet d'évolution professionnelle et à faire un choix éclairé de mobilité.
         o   Bénéficiaires : Tous les agents publics.
         o   Employeur d'Accueil : La période d'immersion professionnelle peut être
             effectuée auprès de divers organismes :
                ▪   Établissement public de l'État
                ▪   Collectivité territoriale ou établissement public territorial
                ▪   Établissement public hospitalier
                ▪   Tout autre organisme public.
         o   Durée : 2 à 10 jours, maximum 20 jours sur 3 ans.
         o   Démarches : Demande 3 mois avant le début de l'immersion, réponse de l'employeur dans le mois suivant.
         o   Convention Tripartite : En cas d'acceptation, la mise en œuvre d'une période d'immersion donne lieu à une convention tripartite entre l'agent, l'administration d'emploi et la structure d'accueil. La convention définit les fonctions observées par l'agent, le lieu, la durée, la ou les date, ainsi que les conditions nécessaires au bon déroulement de cette période.
         o   Prise en charge : Pas de frais spécifiques.
•   Disponibilité pour études ou recherches :
       o   Objectif : Effectuer des études ou recherches présentant un intérêt général.
       o   Bénéficiaires : Fonctionnaires.
       o   Durée : Maximum 3 ans, renouvelable une fois.
       o   Démarches : Demande écrite 3 mois avant la date souhaitée, réponse de l'employeur dans les 2 mois.
       o   Prise en charge : Pas de rémunération ni de droits à l'avancement et à la retraite pendant la disponibilité.
       o   Refus : L'autorité territoriale ne peut opposer deux refus successifs à un agent demandant à bénéficier d'une même action de formation qu'après avis de la commission administrative paritaire.
Compte Personnel d'Activité
Compte Personnel de Formation (CPF) :
•   Objectif
•   Le Compte Personnel de Formation (CPF) permet aux agents de la fonction publique territoriale d'accéder à des formations pour obtenir une qualification ou développer des compétences nécessaires à leur évolution professionnelle. Il est alimenté en heures, permettant une plus grande flexibilité dans le choix des formations.
•   Bénéficiaires : Fonctionnaires titulaires ou stagiaires, Agents contractuels
•   Alimentation du Compte : 25 heures par an, avec un plafond de 150 heures. Pour un agent à temps non complet, un calcul au prorata du temps travaillé.
•   Crédit d'heures supplémentaire :
        o   Pour les agents de catégorie C n'ayant pas atteint un niveau de formation sanctionné par un diplôme ou un titre professionnel correspondant au niveau 3, un crédit de 50 heures par an est accordé, avec un plafond de 400 heures.
        o   Pour les agents souhaitant prévenir une situation d'inaptitude physique, un crédit d'heures supplémentaires est accordé, dans la limite de 150 heures, complété par 300 heures pour un agent à temps complet ou 550 heures pour un agent de catégorie C ayant un niveau inférieur au niveau V du répertoire national des certifications professionnelles.
•   Formations éligibles : Le CPF peut être utilisé pour des formations diplômantes, certifiantes, ou pour préparer des concours et examens professionnels.
•   Démarches : L'agent doit soumettre une demande écrite à l'employeur, précisant le projet d'évolution professionnelle.
•   Accord de l'employeur : Un accord écrit est nécessaire sur la nature, le calendrier et le financement de la formation.
•   Prise en charge : Frais pédagogiques des formations via le CPF plafonnés à 5% du budget annuel dédié à la formation, Réf. délibération du 25 juin 2025. Les demandes de formation dans le cadre du CPF sont instruites selon des critères de priorité :
       o   Reconversion Professionnelle pour Motif Médical : Actions de formation, accompagnement, ou bilan de compétences permettant d'accompagner une reconversion professionnelle pour motif médical (inaptitude, préconisation ou restriction médicale).
       o   Validation des Acquis de l'Expérience (VAE) : Actions de VAE, en tenant compte des évolutions sur des métiers en tension et des besoins de la collectivité.
       o   Actions de Formation Personnelle : Actions de formation correspondant aux besoins de la collectivité identifiés dans le plan de formation.
•   Pour les dossiers prioritaires, les frais pédagogiques de formation via le CPF sont pris en charge à 100% par la collectivité. Les frais occasionnés par le déplacement des agents lors de ces formations sont pris en charge conformément à la réglementation en vigueur.
•   Les demandes de CPF non priorisées par la collectivité sont traitées par arbitrages individuels pour définir la décision (accord ou refus) du départ en formation (accord des heures CPF).
•   Portabilité des Droits : Les droits acquis dans le secteur privé peuvent être convertis en heures pour être utilisés dans la fonction publique.
•   Refus : le 3ème rejet d'une formation de même nature ne pourra être prononcé qu'après avis de l'instance paritaire compétente. L'employeur ne peut refuser les formations relevant du socle de connaissances et de compétences fondamentales. Seul un report d'une année sur l'autre en raison des nécessités de service est possible. Elles concernent notamment la communication en Français et les règles de calculs et de raisonnement mathématiques.
Compte d'Engagement Citoyen (CEC) :
 •   Objectif : Valoriser les activités bénévoles ou de volontariat par des droits à formation.
        o   Bénéficiaires : Tous les agents de la fonction publique.
        o   Alimentation : 240 euros (20 heures) par activité éligible, plafond de 720 euros (60 heures).
        o   Activités éligibles : Service civique, réserve militaire, bénévolat associatif, etc.
        o   Démarches : Déclaration des activités éligibles via le service dématérialisé.
        o   Prise en charge : Financement par l'État ou l'organisme compétent selon l'activité.
Dispositif des formateurs et des jurys de concours
Formateurs internes occasionnels :
 •   Conditions préalables pour devenir formateur interne :
        o   Les agents ayants une expertise métier ou technique
        o   Selon les besoins identifiés par la collectivité et sous réserve de l'accord de la DCRH et du responsable hiérarchique de l'agent.
        o   Suivi une formation de formateur (avec attestation)
        o   La formation ne soit pas inscrite dans le profil de l'agent ( ne fait pas partie des missions).
 •   Conditions préalables pour réaliser une formation :
        o   Chaque formateur doit proposer un déroulé pédagogique à la DCRH qui doit être validé avant toute formation. Il engage le formateur sur le contenu de la formation qu'il dispensera.
        o   En fonction des formations, un livrable pourra être conçu par le formateur et distribué aux agents ayant participé à la formation
        o   Le nombre de sessions de formation réalisé par an sera convenu entre le formateur et la DCRH, en accord avec la hiérarchie de l'agent au regard des nécessités de service.
        o   Le matériel nécessaire au formateur pour le bon déroulé de sa formation sera fourni par le service DCRH
        o   Le service DCRH se charge de l'ingénierie de la formation, dont la constitution des groupes, la réservation de la salle , la convocation des participants, les feuilles d'émargements et les attestations de formation.
 •   Droits du formateur :
        o   La préparation des formations se fera sur le temps de travail et sera rémunérée à hauteur d'une journée, lors de la première formation dispensée.
     o   Le support de formation réalisé par le formateur est sa propriété et non celle de la ville. Il ne sera pas diffusé en dehors des agents ayant suivi la formation.
     o   La formation dispensée par le formateur est rémunérée conformément aux dispositions du RIFSEEP.
     o   Les formations se déroulent en mairie et sur le temps de travail.
Participation à des Jurys ou comme Formateur
externes
     o   Sous réserve d'une autorisation de cumul d'emploi et des nécessités de service, Une autorisation d'absence de 10 jours fractionnables (en demi-journée) est accordée pour participer en tant que jury de concours et
         examens ou comme formateur en externe dans les conditions suivantes :
         Il sera accordé par année civile, pour les agents à temps complet (proratise pour les agents à temps non-complet et à temps partiel) et dans la mesure où ces prestations ouvrent droit à rémunération :
            ▪    5 jours par an pour la participation à des jurys de concours. Au-delà les absences devront être prises sur des jours de congés.
            ▪   5 jours par an pour assurer des formations ou intervenir à des colloques. Au-delà, les absences devront être prises sur des jours de congés.
L'organisation de la formation
Les modes d'organisation de la formation
       Les formations peuvent être dispensées de différentes manières :
   •   Les formations dites « INTRA » : à la suite du recueil des besoins en formation, la collectivité organise des formations dans ses locaux. Cette organisation permet de regrouper des agents de différents services autour d'une thématique commune. Les dates ainsi que le contenu du programme de formation sont personnalisables et s'adaptent en fonction des besoins des services.
   •   Les formations dites « INTER » : ces formations réunissent les agents de plusieurs collectivités autour d'une formation commune organisée par le prestataire, le CNFPT ou d'autres organismes de formation.
   •   Les formations dites « INTRA-UNION » : ce sont des formations qui sont proposées principalement par le CNFPT. Elles sont organisées par une des collectivités de l'EPT 5 sur un thème défini répondant aux demandes des collectivités.
   •   Les formations en distanciel : ce sont des formations organisées à distance, généralement via des plateformes en ligne. Cela permet une plus grande flexibilité en termes d'horaires et de lieu de formation et facilite l'accès à la formation pour les agents éloignés géographiquement ou ayant des contraintes de temps. Pour les agents qui ne disposent pas d'ordinateur ou de bureau pour suivre une formation à distance, le service DCRH mettra à leur disposition des ordinateurs portables et la salle de formation équipée en ordinateur.
   •   Les formation Mixte : ce sont des formations qui combinent des sessions en présentiel et des modules en distanciel.
       Inscription à une formation CNFPT ?
   o   L'inscription se fait uniquement en ligne (pas de format papier).
   o   Aller sur son compte IEL (inscription en ligne du CNFPT - www.cnfpt.fr), sélectionner la formation désirée puis dans le menu déroulant, choisir le type de formation (1er emploi, tout au long de la carrière…etc) puis valider.
   o   La demande arrive dans la boite mail du responsable hiérarchique pour validation ou non de la formation.
   o   Enfin, le service DCRH valide la demande.
   o   La procédure d'inscription pas à pas figure également sur l'Intranet de la ville – rubrique formation – 2 – choisir sa formation et en annexe du présent document ;
   o   Les agents du service DCRH peuvent également vous aider à créer votre compte IEL.
Inscription à une formation avec un autre organisme 
Préparation de la demande par l'agent :
   o   L'agent remplit le formulaire de demande d'inscription.
   o   Il fournit les renseignements indispensables et joint le bulletin d'inscription de l'organisme.
Soumission de la demande :
   o   L'agent soumet le formulaire complété à sa hiérarchie
   o   La demande doit être soumise 8 semaines avant le début de la formation.
Soumission de la demande au service DCRH
   o   La demande doit être soumise 6 semaines avant le début de la formation
   o   Le service DCRH vérifie que la demande est totalement et correctement remplie.
   o   Il examine la motivation de l'agent et l'utilité de la formation et sa pertinence, en fonction du plan de formation, des priorités de la collectivité et du budget alloué.
Validation de la demande :
   o   Si la demande est approuvée, elle est validée par le service DCRH.
   o   Si la demande n'est pas approuvée, le service DCRH informe la direction et l'agent.
Inscription à la formation :
   o   Le service DCRH finalise son inscription auprès de l'organisme de formation.
   o   L'agent suit la formation selon les dates et la durée spécifiées.
Attestation de formation : à l'issue de chaque formation réalisée, une attestation de formation est transmise à l'agent par l'organisme de formation. Le service DCRH reçoit automatiquement toutes les attestations du CNFPT. Pour les autres organismes la transmission n'est systématique. Les agents sont invités à les transmettre au service DCRH qui les verse dans leur dossier administratif.
Les droits et devoirs des agents
Journée de Formation est une journée d'activité :
         o   Si la formation tombe sur un jour non travaillé (ex. : week-end), l'agent récupère cette journée.
         o   Si la journée de formation tombe sur une demi-journée hors cycle de travail (exemple : un agent qui travaille sur 4,5 Jours ou sur 4 Jours), l'agent récupère cette demi-journée.
         o   Si la durée de la formation est supérieure au temps de travail habituel, il n'y a pas de récupération. Inversement, si la durée est inférieure, l'agent ne doit pas rendre d'heures.
         o   Pour une formation d'une demi-journée, l'agent doit être présent l'autre demi-journée, sauf si le trajet excède deux heures.
   •   Temps de déplacement : Lors des formations et stages les temps de déplacement ne sont pas récupérés.
Formation en dehors du temps de travail :
         o   Possible dans le cadre du Compte Personnel de Formation (CPF) à la demande de l'agent et avec accord de la hiérarchie.
Tenue et Comportement
         o   Tenue : la présentation en tenue respectant les principes du service public et des principes de laïcité et la neutralité, la journée de formation étant une journée de travail.
         o   Comportement : Téléphone portable éteint ou en mode silencieux pendant la formation, sauf utilisation demandée par le formateur.
Horaires de Stage
         o   Respect des horaires : Les horaires sont communiqués par convocation ou programme de formation.
         o   Modification : Le service DCRH peut modifier les horaires en fonction des nécessités de service.
         o   Retard et absence : Doivent être signalés immédiatement au service DCRH.
Usage du Matériel
         o   Conservation : Le matériel doit être conservé en bon état et utilisé conformément à son objet.
         o   Restitution : Tout matériel et document doivent être restitués à la fin du stage, sauf documents pédagogiques distribués.
Accès aux Formations pour les Agents en Situation de Handicap
Les agents en situation de handicap bénéficient d'un accès prioritaire à plusieurs types de formations. Les formations peuvent être adaptées pour répondre aux besoins spécifiques des agents en situation de handicap, en termes de contenu, de durée et de modalités de formation. Ils peuvent bénéficier d'un accompagnement personnalisé pour les aider à préparer les concours et examens, incluant des aménagements spécifiques pour les épreuves. Pour les dispositifs ci-dessous, les agents en situation de handicap bénéficient de conditions spécifiques et avantageuses pour accéder y accéder :
Congé de Formation Professionnelle
   •   Durée : La durée maximale du congé de formation professionnelle est portée à 5 ans sur l'ensemble de la carrière pour les agents en situation de handicap.
   •   Indemnité : Le montant de l'indemnité est porté à 100% du traitement brut et de l'indemnité de résidence pendant une durée limitée aux douze premiers mois, puis à 85% pendant une durée limitée aux douze mois suivants.
Congé pour Bilan de Compétences
   •   Durée : La durée du congé pour bilan de compétences est portée à 72 heures de temps de service pour les agents en situation de handicap.
   •   Fréquence : Le délai pour prétendre à un autre bilan de compétences est réduit à trois ans pour les agents en situation de handicap.
Congé pour Validation des Acquis de l'Expérience (VAE)
   •   Durée : La durée du congé pour VAE est portée à 72 heures de temps de service pour les agents en situation de handicap.
Congé de Transition Professionnelle
   •   Durée : La durée du congé de transition professionnelle est portée à 5 ans sur l'ensemble de la carrière pour les agents en situation de handicap.
Période d'Immersion Professionnelle
    •  Aides Spécifiques : Lorsque le bénéficiaire de la période d'immersion professionnelle est un agent en situation de handicap, son employeur s'assure qu'il bénéficie des aides nécessaires au bon déroulement de cette période. Ces aides sont définies dans la convention tripartite.
Compte Personnel de Formation (CPF)
    •  Crédit d'Heures Supplémentaire : Les agents en situation de handicap bénéficient d'un crédit d'heures supplémentaire pour prévenir une situation d'inaptitude physique, dans la limite de 150 heures, complété par 300 heures au total.
Compte d'Engagement Citoyen (CEC)
    •  Activités Éligibles : Les agents en situation de handicap peuvent bénéficier de droits supplémentaires au titre du CEC pour les activités bénévoles ou de volontariat de la vie ;
Glossaire
     •   CACES : certificat d'aptitude à la conduite d'engins en sécurité
     •   CAP : commission administrative paritaire
     •   FIMO : formation initiale minimale obligatoire
     •   HACCP : hazard analysis critical control point : analyse des dangers et
         maîtrise des points critiques
     •   VAE : validation des acquis de l'expérience`.trim(),zs=[{id:1,title:"Accident de trajet : où commence le trajet domicile-travail lorsqu'un agent réside dans un immeuble collectif ?",content:"Le trajet domicile-travail commence dès la sortie de l'immeuble collectif où réside l'agent. Cela inclut les parties communes de l'immeuble (hall, escaliers, ascenseur) jusqu'à la voie publique. En cas d'accident dans ces espaces communs, celui-ci peut être reconnu comme accident de trajet si l'agent se rendait effectivement au travail ou en revenait."},{id:2,title:"Un fonctionnaire territorial peut-il demander une mutation tout en étant en disponibilité  ?",content:"Dans la fonction publique territoriale, un fonctionnaire placé en disponibilité ne peut pas être muté directement puisqu’il n’est pas en position d’activité. Toutefois, il lui reste possible de préparer sa mobilité et de poser sa candidature à une mutation, à condition de respecter la procédure adaptée. Ce cadre juridique doit être bien compris par les services RH afin d’accompagner correctement les agents."},{id:3,title:"Repenser le recrutement pour une fonction publique plus inclusive.",content:"La fonction publique territoriale s'engage vers plus d'inclusivité en diversifiant ses méthodes de recrutement. Cela passe par l'adaptation des épreuves pour les personnes en situation de handicap, la valorisation de l'expérience professionnelle via la reconnaissance des acquis, et le développement de parcours d'insertion pour favoriser l'égalité des chances dans l'accès aux emplois publics."},{id:4,title:"Sanction: Utilisation WhatApp.",content:"La circonstance qu’un agent ait envoyé depuis son téléphone personnel et sa messagerie WhatsApp, à l'attention de plusieurs personnes, dont des élus, des photos montages assortis de sous-titre déshonorants à l'encontre de la maire de la ville et de son troisième adjoint, présente un caractère fautif et non humoristique, compte-tenu de la nature des photographies diffusées et des personnes visées par ces montages. Par suite, le comportement de l’intéressé constitue un manquement à son obligation de dignité, de réserve de probité, d'intégrité et de loyauté, justifiant son exclusion de fonctions durant deux ans. La circonstance que les messages incriminés soient provenus de la messagerie privée de l'intéressé et en dehors du service est sans incidence dès lors que le comportement d'un agent public peut avoir pour effet de perturber le service ou de jeter le discrédit sur l'administration, comme en l'espèce.TA Cergy-Pontoise 2201748 du 09.07.2025."}];zs.map(e=>e.title).join(" • ");var Kp={};const Xp=Kp.REACT_APP_API_KEY,Yp="https://api.perplexity.ai/chat/completions",Ja=[{label:"France Info — Politique",url:"https://www.franceinfo.fr/politique.rss"}],Qi=JSON.parse(Qp),Ka=e=>typeof e!="string"?"":e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w\s]/gi,"").trim(),Zp=e=>{const n=Ka(e),t=n.split(/\s+/).filter(s=>s.length>0),r=new Map;if(Qi.chapitres.forEach((s,o)=>{let a=0;const l=o+1,c=s.mots_cles||[],g=(s.articles||[]).flatMap(m=>m.mots_cles||[]);if([...c,...g].forEach(m=>{const E=Ka(m);E&&(t.includes(E)?a+=10:n.includes(E)&&(a+=5))}),a>0){const m=r.get(l)||{score:0};m.score+=a,r.set(l,m)}}),r.size===0)return"Aucun chapitre spécifique trouvé pour cette question. Voici un aperçu général des thèmes: "+Qi.chapitres.map(s=>s.titre).join(", ");const i=Array.from(r.entries()).sort(([,s],[,o])=>o.score-s.score).slice(0,3).map(([s])=>{const o=Qi.chapitres[s-1],a=Wp[s]||null;return a?`Source: ${o.titre}
Contenu: ${a}`:(console.warn(`Le contenu pour le chapitre ID ${s} (${o.titre}) n'a pas été trouvé dans temps.ts.`),null)}).filter(Boolean);return i.length===0?"Aucun contenu textuel trouvé pour les chapitres pertinents.":i.join(`

---

`)};function em(){const[e,n]=K.useState({currentView:"menu",selectedDomain:null,messages:[],isProcessing:!1}),[t,r]=K.useState(""),[i,s]=K.useState(null);K.useState(Ja[0].url);const o=K.useRef(null),a=K.useRef(null),l=K.useRef(null);K.useEffect(()=>{var T;e.currentView==="chat"&&((T=o.current)==null||T.scrollIntoView({behavior:"smooth"}))},[e.messages,e.currentView]);const c=T=>s(T),g=T=>{n({currentView:"chat",selectedDomain:T,messages:[{type:"assistant",content:T===0?"Bonjour ! Je peux vous aider avec vos questions sur les horaires, congés, ARTT, temps partiel, heures supplémentaires, absences, etc.":"Bonjour ! Je peux vous renseigner sur le CPF, les congés de formation, la VAE, les concours, les bilans de compétences, etc. Quelle est votre question ?",timestamp:new Date}],isProcessing:!1}),setTimeout(()=>{var d;if(l.current){const p=l.current.offsetTop,h=Math.max(0,p-200);window.scrollTo({top:h,behavior:"smooth"})}(d=a.current)==null||d.focus()},100)},v=()=>{n({currentView:"menu",selectedDomain:null,messages:[],isProcessing:!1}),r(""),s(null)},m=async T=>{const d={model:"sonar-pro",messages:T},u=await fetch(Yp,{method:"POST",headers:{Authorization:`Bearer ${Xp}`,"Content-Type":"application/json"},body:JSON.stringify(d)});if(!u.ok){const h=await u.text();throw console.error("Détail de l'erreur API:",h),new Error(`Erreur API (${u.status}): ${u.statusText}`)}return(await u.json()).choices[0].message.content},E=async T=>{let d="";e.selectedDomain===0?d=Zp(T):d=JSON.stringify(Jp,null,2);const u=`
        Tu es un assistant syndical spécialiste pour la mairie de Gennevilliers.
        Ta mission est de répondre aux questions des agents en te basant EXCLUSIVEMENT sur la documentation fournie ci-dessous.
        NE JAMAIS utiliser tes connaissances générales.
        Si la réponse ne se trouve pas dans la documentation, réponds : "Je ne trouve pas l'information dans les documents à ma disposition. Veuillez contacter le 64 64 pour plus de détails."
        Sois précis et cite le titre du chapitre si possible.
        --- DEBUT DE LA DOCUMENTATION PERTINENTE ---
        ${d}
        --- FIN DE LA DOCUMENTATION PERTINENTE ---
    `,p=e.messages.slice(1).map(w=>({role:w.type==="user"?"user":"assistant",content:w.content})),h=[{role:"system",content:u},...p,{role:"user",content:T}];return await m(h)},x=async()=>{const T=t.trim();if(!T||e.isProcessing)return;const d={type:"user",content:T,timestamp:new Date};n(u=>({...u,messages:[...u.messages,d],isProcessing:!0})),r("");try{const p={type:"assistant",content:await E(T),timestamp:new Date};n(h=>({...h,messages:[...h.messages,p]}))}catch(u){console.error("Erreur lors du traitement de la question:",u);const p={type:"assistant",content:"Désolé, une erreur est survenue. Veuillez réessayer ou contacter un représentant si le problème persiste.",timestamp:new Date};n(h=>({...h,messages:[...h.messages,p]}))}finally{n(u=>({...u,isProcessing:!1})),setTimeout(()=>{var u;return(u=a.current)==null?void 0:u.focus()},100)}},S=T=>{T.key==="Enter"&&!T.shiftKey&&(T.preventDefault(),x())};return f.jsxs("div",{className:"min-h-screen relative",children:[f.jsx("div",{className:"fixed inset-0 bg-cover bg-center bg-no-repeat z-0",style:{backgroundImage:"url('/abstract-gradient-bg.png')"}}),f.jsx("div",{className:"fixed inset-0 bg-black/10 z-0"}),f.jsx("header",{className:"relative bg-gradient-to-r from-white/95 via-orange-50/95 to-white/95 shadow-2xl border-b-4 border-orange-500 z-10",children:f.jsxs("div",{className:"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 justify-between",children:[f.jsxs("div",{className:"flex flex-col sm:flex-row items-center gap-6 flex-grow",children:[f.jsxs("div",{className:"relative",children:[f.jsx("div",{className:"absolute -inset-4 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 rounded-full blur-lg opacity-70 animate-pulse"}),f.jsx("div",{className:"relative p-6 bg-gradient-to-br from-white to-orange-50 rounded-full shadow-2xl",children:f.jsx(Gi,{className:"w-20 h-20 text-orange-500"})})]}),f.jsxs("div",{children:[f.jsx("h1",{className:"text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent drop-shadow-sm",children:"Atlas: Chatbot CFDT"}),f.jsx("h2",{className:"text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent",children:"Mairie de GENNEVILLIERS"}),f.jsxs("p",{className:"mt-4 flex justify-center sm:justify-start items-center gap-2 text-lg text-gray-700",children:[f.jsx(Gi,{className:"text-orange-500 w-5 h-5 animate-pulse"}),"Assistant syndical CFDT pour les agents municipaux"]})]})]}),f.jsxs("div",{className:"relative",children:[f.jsx("div",{className:"absolute -inset-8 bg-gradient-to-r from-orange-400 via-orange-500 to-red-400 rounded-full blur-2xl opacity-90 animate-pulse"}),f.jsx("div",{className:"absolute -inset-6 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 rounded-full blur-xl opacity-70"}),f.jsx("div",{className:"absolute -inset-4 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 rounded-full blur-lg opacity-50"}),f.jsx("div",{className:"relative bg-white rounded-full p-2 shadow-lg",children:f.jsx("img",{src:"/logo-cfdt-orange.png",alt:"Logo CFDT",className:"relative w-44 h-44 object-contain z-20",style:{maxHeight:"176px"}})})]})]})}),f.jsxs("main",{className:"relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10",children:[e.currentView==="menu"&&f.jsxs(f.Fragment,{children:[f.jsx("section",{className:"relative bg-orange-300 text-black overflow-hidden mx-4 rounded-2xl shadow-lg z-10",children:f.jsxs("div",{className:"relative h-20 flex items-center overflow-hidden",children:[f.jsx("div",{className:"absolute left-0 top-0 h-full w-40 flex items-center justify-center bg-orange-400 z-20 shadow-md",children:f.jsx("span",{className:"text-2xl font-bold",children:"NEWS FTP:"})}),f.jsx("div",{className:"animate-marquee whitespace-nowrap flex items-center pl-44",children:[...zs,...zs].map((T,d)=>f.jsxs("button",{onClick:()=>c(T),className:"text-2xl font-medium mx-8 hover:text-blue-200 transition-colors cursor-pointer underline decoration-dotted",children:["#",T.id,": ",T.title]},`${T.id}-${d}`))})]})}),i&&f.jsxs("section",{className:"info-detail bg-white p-6 rounded-lg shadow-md mt-8 max-w-4xl mx-auto",children:[f.jsx("h3",{className:"text-xl font-bold mb-4",children:i.title}),f.jsx("p",{children:i.content}),f.jsx("button",{onClick:()=>s(null),className:"mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",children:"Fermer"})]}),f.jsxs("section",{className:"text-center my-16",children:[f.jsx("h3",{className:"text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-purple-700 bg-clip-text text-transparent mb-4",children:"Choisissez votre domaine d'assistance"}),f.jsx("p",{className:"text-xl text-gray-700 max-w-3xl mx-auto",children:"Sélectionnez le service qui correspond à vos besoins. Nos assistants IA spécialisés vous aideront."})]}),f.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20",children:[f.jsxs("button",{onClick:()=>g(0),className:"group relative overflow-hidden bg-white/95 border-2 border-orange-200 rounded-3xl p-10 transition-all duration-500 hover:border-orange-400 hover:shadow-2xl hover:-translate-y-2",children:[f.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity"}),f.jsxs("div",{className:"relative z-10 flex flex-col items-center gap-6",children:[f.jsxs("div",{className:"relative",children:[f.jsx("span",{className:"absolute -inset-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl opacity-20 transition blur-lg group-hover:scale-110"}),f.jsx("div",{className:"relative p-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl group-hover:rotate-3 group-hover:scale-110 transition-all",children:f.jsx(Qa,{className:"w-12 h-12 text-white"})})]}),f.jsx("h4",{className:"text-2xl font-bold text-gray-800 group-hover:text-orange-700",children:"Règlement du Temps de Travail"}),f.jsx("p",{className:"text-center text-gray-600",children:"Horaires, congés, ARTT, temps partiel, heures sup, absences…"}),f.jsxs("div",{className:"flex items-center gap-2 text-orange-500 opacity-0 group-hover:opacity-100 transition",children:[f.jsx("span",{className:"font-semibold",children:"Accéder à l'assistant"}),f.jsx(Ga,{className:"w-4 h-4 animate-pulse"})]})]})]}),f.jsxs("button",{onClick:()=>g(1),className:"group relative overflow-hidden bg-white/95 border-2 border-purple-200 rounded-3xl p-10 transition-all duration-500 hover:border-purple-400 hover:shadow-2xl hover:-translate-y-2",children:[f.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"}),f.jsxs("div",{className:"relative z-10 flex flex-col items-center gap-6",children:[f.jsxs("div",{className:"relative",children:[f.jsx("span",{className:"absolute -inset-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl opacity-20 transition blur-lg group-hover:scale-110"}),f.jsx("div",{className:"relative p-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl shadow-2xl group-hover:rotate-3 group-hover:scale-110 transition-all",children:f.jsx(Wa,{className:"w-12 h-12 text-white"})})]}),f.jsx("h4",{className:"text-2xl font-bold text-gray-800 group-hover:text-purple-700",children:"Formation Professionnelle"}),f.jsx("p",{className:"text-center text-gray-600",children:"CPF, congés formation, VAE, concours, bilan de compétences…"}),f.jsxs("div",{className:"flex items-center gap-2 text-purple-500 opacity-0 group-hover:opacity-100 transition",children:[f.jsx("span",{className:"font-semibold",children:"Accéder à l'assistant"}),f.jsx(Ga,{className:"w-4 h-4 animate-pulse"})]})]})]})]})]}),e.currentView==="chat"&&f.jsxs("div",{ref:l,className:"bg-white/95 border-2 border-blue-200 rounded-3xl shadow-2xl overflow-hidden",children:[f.jsx("div",{className:"bg-gradient-to-r from-orange-500 to-blue-600 text-white p-6",children:f.jsxs("div",{className:"flex items-center justify-between",children:[f.jsxs("div",{className:"flex items-center gap-3",children:[e.selectedDomain===0?f.jsx(Qa,{className:"w-8 h-8"}):f.jsx(Wa,{className:"w-8 h-8"}),f.jsxs("div",{children:[f.jsx("h3",{className:"text-xl font-bold",children:e.selectedDomain===0?"Assistant Temps de Travail":"Assistant Formation"}),f.jsx("p",{className:"text-blue-100 text-sm",children:"CFDT Gennevilliers"})]})]}),f.jsxs("button",{onClick:v,className:"flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors",children:[f.jsx(bp,{className:"w-4 h-4"}),f.jsx("span",{className:"hidden sm:inline",children:"Retour"})]})]})}),f.jsxs("div",{className:"min-h-[300px] max-h-[500px] overflow-y-auto p-6 space-y-4",children:[e.messages.map((T,d)=>f.jsx("div",{className:`flex ${T.type==="user"?"justify-end":"justify-start"}`,children:f.jsxs("div",{className:`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${T.type==="user"?"bg-gradient-to-r from-blue-500 to-purple-600 text-white":"bg-gray-100 text-gray-800 border"}`,children:[f.jsx("div",{className:"whitespace-pre-wrap break-words",children:T.content}),f.jsx("div",{className:`text-xs mt-2 ${T.type==="user"?"text-blue-100":"text-gray-500"}`,children:T.timestamp.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]})},d)),e.isProcessing&&f.jsx("div",{className:"flex justify-start",children:f.jsx("div",{className:"bg-gray-100 border px-4 py-3 rounded-2xl",children:f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-bounce"}),f.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-bounce",style:{animationDelay:"0.1s"}}),f.jsx("div",{className:"w-2 h-2 bg-blue-500 rounded-full animate-bounce",style:{animationDelay:"0.2s"}}),f.jsx("span",{className:"text-gray-600 ml-2",children:"L'assistant réfléchit..."})]})})}),f.jsx("div",{ref:o})]}),f.jsx("div",{className:"border-t bg-gray-50 p-4",children:f.jsxs("div",{className:"flex gap-3",children:[f.jsx("input",{ref:a,type:"text",value:t,onChange:T=>r(T.target.value),onKeyPress:S,placeholder:e.selectedDomain===0?"Ex: Quels sont mes horaires ?":"Ex: Comment utiliser mon CPF ?",className:"flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all",disabled:e.isProcessing}),f.jsxs("button",{onClick:x,disabled:!t.trim()||e.isProcessing,className:"px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2",children:[f.jsx(Hp,{className:"w-4 h-4"}),f.jsx("span",{className:"hidden sm:inline",children:"Envoyer"})]})]})})]}),f.jsxs("section",{className:"relative bg-blue-100/50 text-blue-800 text-center p-8 mx-4 mt-16 rounded-2xl shadow-lg z-40",children:[f.jsx("div",{className:"flex justify-center mb-4",children:f.jsx(Bp,{className:"w-8 h-8 text-blue-600"})}),f.jsx("h4",{className:"text-2xl font-bold mb-6",children:"Flux d'actualités"}),f.jsx("div",{className:"mb-6 flex flex-col sm:flex-row items-center justify-center gap-4",children:f.jsx("div",{className:"font-semibold text-blue-700",children:"Source: France Info "})}),f.jsx("div",{className:"bg-green-400 text-white overflow-hidden rounded-xl shadow-inner",children:f.jsxs("div",{className:"relative h-16 flex items-center overflow-hidden",children:[f.jsx("div",{className:"absolute left-0 top-0 h-full w-32 flex items-center justify-center bg-green-500 z-20 shadow-md",children:f.jsx("span",{className:"text-lg font-bold",children:"ACTU:"})}),f.jsx("div",{className:"pl-36",children:f.jsx(Gp,{apiPath:"/api/fresh-rss",feedUrl:Ja[0].url,limit:10,displayMode:"simple"})})]})})]}),f.jsxs("section",{className:"relative bg-gradient-to-r from-orange-300 to-red-600 text-white text-center p-8 mx-4 mt-16 rounded-2xl shadow-2xl z-10",children:[f.jsx("h4",{className:"text-2xl font-bold mb-6",children:"Un humain ? Appelez le 64 64"}),f.jsxs("div",{className:"flex flex-col sm:flex-row justify-center items-center gap-4",children:[f.jsxs("a",{href:"tel:0140856464",className:"flex items-center gap-3 bg-white/20 px-4 py-3 rounded-lg hover:bg-white/30 transition-colors",children:[f.jsx(Vp,{className:"w-5 h-5 animate-pulse"}),"01 40 85 64 64"]}),f.jsxs("a",{href:"mailto:cfdt-interco@ville-gennevilliers.fr",className:"flex items-center gap-3 bg-white/20 px-4 py-3 rounded-lg hover:bg-white/30 transition-colors break-all",children:[f.jsx(zp,{className:"w-5 h-5 animate-pulse"}),"cfdt-interco@ville-gennevilliers.fr"]}),f.jsxs("span",{className:"flex items-center gap-3 bg-white/20 px-4 py-3 rounded-lg",children:[f.jsx(Up,{className:"w-5 h-5 animate-pulse"}),"177 av. Gabriel-Péri"]})]})]})]}),f.jsxs("footer",{className:"relative bg-gray-900/95 text-gray-400 text-center py-8 mt-20 z-10",children:[f.jsxs("div",{className:"flex justify-center items-center gap-3 mb-3",children:[f.jsx(Gi,{className:"w-8 h-8 text-orange-300"}),f.jsx("span",{className:"text-orange-300 font-medium",children:"CFDT Gennevilliers"})]}),f.jsx("p",{className:"text-xs",children:"Centre administratif Waldeck-L'Huillier — 177 av. Gabriel-Péri — 92237 Gennevilliers Cedex"})]})]})}ud(document.getElementById("root")).render(f.jsx(K.StrictMode,{children:f.jsx(em,{})}));
