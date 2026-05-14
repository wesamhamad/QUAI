(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const u of l)if(u.type==="childList")for(const d of u.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function i(l){const u={};return l.integrity&&(u.integrity=l.integrity),l.referrerPolicy&&(u.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?u.credentials="include":l.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function s(l){if(l.ep)return;l.ep=!0;const u=i(l);fetch(l.href,u)}})();var id={exports:{}},Vo={};var xg;function gy(){if(xg)return Vo;xg=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(s,l,u){var d=null;if(u!==void 0&&(d=""+u),l.key!==void 0&&(d=""+l.key),"key"in l){u={};for(var h in l)h!=="key"&&(u[h]=l[h])}else u=l;return l=u.ref,{$$typeof:o,type:s,key:d,ref:l!==void 0?l:null,props:u}}return Vo.Fragment=e,Vo.jsx=i,Vo.jsxs=i,Vo}var yg;function _y(){return yg||(yg=1,id.exports=gy()),id.exports}var wt=_y(),ad={exports:{}},ge={};var Sg;function vy(){if(Sg)return ge;Sg=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),d=Symbol.for("react.context"),h=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),v=Symbol.for("react.lazy"),x=Symbol.for("react.activity"),y=Symbol.iterator;function M(L){return L===null||typeof L!="object"?null:(L=y&&L[y]||L["@@iterator"],typeof L=="function"?L:null)}var T={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w=Object.assign,S={};function g(L,rt,Nt){this.props=L,this.context=rt,this.refs=S,this.updater=Nt||T}g.prototype.isReactComponent={},g.prototype.setState=function(L,rt){if(typeof L!="object"&&typeof L!="function"&&L!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,L,rt,"setState")},g.prototype.forceUpdate=function(L){this.updater.enqueueForceUpdate(this,L,"forceUpdate")};function F(){}F.prototype=g.prototype;function N(L,rt,Nt){this.props=L,this.context=rt,this.refs=S,this.updater=Nt||T}var U=N.prototype=new F;U.constructor=N,w(U,g.prototype),U.isPureReactComponent=!0;var W=Array.isArray;function V(){}var P={H:null,A:null,T:null,S:null},q=Object.prototype.hasOwnProperty;function D(L,rt,Nt){var K=Nt.ref;return{$$typeof:o,type:L,key:rt,ref:K!==void 0?K:null,props:Nt}}function C(L,rt){return D(L.type,rt,L.props)}function G(L){return typeof L=="object"&&L!==null&&L.$$typeof===o}function ft(L){var rt={"=":"=0",":":"=2"};return"$"+L.replace(/[=:]/g,function(Nt){return rt[Nt]})}var st=/\/+/g;function Mt(L,rt){return typeof L=="object"&&L!==null&&L.key!=null?ft(""+L.key):rt.toString(36)}function Et(L){switch(L.status){case"fulfilled":return L.value;case"rejected":throw L.reason;default:switch(typeof L.status=="string"?L.then(V,V):(L.status="pending",L.then(function(rt){L.status==="pending"&&(L.status="fulfilled",L.value=rt)},function(rt){L.status==="pending"&&(L.status="rejected",L.reason=rt)})),L.status){case"fulfilled":return L.value;case"rejected":throw L.reason}}throw L}function z(L,rt,Nt,K,yt){var Bt=typeof L;(Bt==="undefined"||Bt==="boolean")&&(L=null);var zt=!1;if(L===null)zt=!0;else switch(Bt){case"bigint":case"string":case"number":zt=!0;break;case"object":switch(L.$$typeof){case o:case e:zt=!0;break;case v:return zt=L._init,z(zt(L._payload),rt,Nt,K,yt)}}if(zt)return yt=yt(L),zt=K===""?"."+Mt(L,0):K,W(yt)?(Nt="",zt!=null&&(Nt=zt.replace(st,"$&/")+"/"),z(yt,rt,Nt,"",function(pe){return pe})):yt!=null&&(G(yt)&&(yt=C(yt,Nt+(yt.key==null||L&&L.key===yt.key?"":(""+yt.key).replace(st,"$&/")+"/")+zt)),rt.push(yt)),1;zt=0;var $t=K===""?".":K+":";if(W(L))for(var Jt=0;Jt<L.length;Jt++)K=L[Jt],Bt=$t+Mt(K,Jt),zt+=z(K,rt,Nt,Bt,yt);else if(Jt=M(L),typeof Jt=="function")for(L=Jt.call(L),Jt=0;!(K=L.next()).done;)K=K.value,Bt=$t+Mt(K,Jt++),zt+=z(K,rt,Nt,Bt,yt);else if(Bt==="object"){if(typeof L.then=="function")return z(Et(L),rt,Nt,K,yt);throw rt=String(L),Error("Objects are not valid as a React child (found: "+(rt==="[object Object]"?"object with keys {"+Object.keys(L).join(", ")+"}":rt)+"). If you meant to render a collection of children, use an array instead.")}return zt}function $(L,rt,Nt){if(L==null)return L;var K=[],yt=0;return z(L,K,"","",function(Bt){return rt.call(Nt,Bt,yt++)}),K}function tt(L){if(L._status===-1){var rt=L._result;rt=rt(),rt.then(function(Nt){(L._status===0||L._status===-1)&&(L._status=1,L._result=Nt)},function(Nt){(L._status===0||L._status===-1)&&(L._status=2,L._result=Nt)}),L._status===-1&&(L._status=0,L._result=rt)}if(L._status===1)return L._result.default;throw L._result}var Pt=typeof reportError=="function"?reportError:function(L){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var rt=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof L=="object"&&L!==null&&typeof L.message=="string"?String(L.message):String(L),error:L});if(!window.dispatchEvent(rt))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",L);return}console.error(L)},Ft={map:$,forEach:function(L,rt,Nt){$(L,function(){rt.apply(this,arguments)},Nt)},count:function(L){var rt=0;return $(L,function(){rt++}),rt},toArray:function(L){return $(L,function(rt){return rt})||[]},only:function(L){if(!G(L))throw Error("React.Children.only expected to receive a single React element child.");return L}};return ge.Activity=x,ge.Children=Ft,ge.Component=g,ge.Fragment=i,ge.Profiler=l,ge.PureComponent=N,ge.StrictMode=s,ge.Suspense=m,ge.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=P,ge.__COMPILER_RUNTIME={__proto__:null,c:function(L){return P.H.useMemoCache(L)}},ge.cache=function(L){return function(){return L.apply(null,arguments)}},ge.cacheSignal=function(){return null},ge.cloneElement=function(L,rt,Nt){if(L==null)throw Error("The argument must be a React element, but you passed "+L+".");var K=w({},L.props),yt=L.key;if(rt!=null)for(Bt in rt.key!==void 0&&(yt=""+rt.key),rt)!q.call(rt,Bt)||Bt==="key"||Bt==="__self"||Bt==="__source"||Bt==="ref"&&rt.ref===void 0||(K[Bt]=rt[Bt]);var Bt=arguments.length-2;if(Bt===1)K.children=Nt;else if(1<Bt){for(var zt=Array(Bt),$t=0;$t<Bt;$t++)zt[$t]=arguments[$t+2];K.children=zt}return D(L.type,yt,K)},ge.createContext=function(L){return L={$$typeof:d,_currentValue:L,_currentValue2:L,_threadCount:0,Provider:null,Consumer:null},L.Provider=L,L.Consumer={$$typeof:u,_context:L},L},ge.createElement=function(L,rt,Nt){var K,yt={},Bt=null;if(rt!=null)for(K in rt.key!==void 0&&(Bt=""+rt.key),rt)q.call(rt,K)&&K!=="key"&&K!=="__self"&&K!=="__source"&&(yt[K]=rt[K]);var zt=arguments.length-2;if(zt===1)yt.children=Nt;else if(1<zt){for(var $t=Array(zt),Jt=0;Jt<zt;Jt++)$t[Jt]=arguments[Jt+2];yt.children=$t}if(L&&L.defaultProps)for(K in zt=L.defaultProps,zt)yt[K]===void 0&&(yt[K]=zt[K]);return D(L,Bt,yt)},ge.createRef=function(){return{current:null}},ge.forwardRef=function(L){return{$$typeof:h,render:L}},ge.isValidElement=G,ge.lazy=function(L){return{$$typeof:v,_payload:{_status:-1,_result:L},_init:tt}},ge.memo=function(L,rt){return{$$typeof:p,type:L,compare:rt===void 0?null:rt}},ge.startTransition=function(L){var rt=P.T,Nt={};P.T=Nt;try{var K=L(),yt=P.S;yt!==null&&yt(Nt,K),typeof K=="object"&&K!==null&&typeof K.then=="function"&&K.then(V,Pt)}catch(Bt){Pt(Bt)}finally{rt!==null&&Nt.types!==null&&(rt.types=Nt.types),P.T=rt}},ge.unstable_useCacheRefresh=function(){return P.H.useCacheRefresh()},ge.use=function(L){return P.H.use(L)},ge.useActionState=function(L,rt,Nt){return P.H.useActionState(L,rt,Nt)},ge.useCallback=function(L,rt){return P.H.useCallback(L,rt)},ge.useContext=function(L){return P.H.useContext(L)},ge.useDebugValue=function(){},ge.useDeferredValue=function(L,rt){return P.H.useDeferredValue(L,rt)},ge.useEffect=function(L,rt){return P.H.useEffect(L,rt)},ge.useEffectEvent=function(L){return P.H.useEffectEvent(L)},ge.useId=function(){return P.H.useId()},ge.useImperativeHandle=function(L,rt,Nt){return P.H.useImperativeHandle(L,rt,Nt)},ge.useInsertionEffect=function(L,rt){return P.H.useInsertionEffect(L,rt)},ge.useLayoutEffect=function(L,rt){return P.H.useLayoutEffect(L,rt)},ge.useMemo=function(L,rt){return P.H.useMemo(L,rt)},ge.useOptimistic=function(L,rt){return P.H.useOptimistic(L,rt)},ge.useReducer=function(L,rt,Nt){return P.H.useReducer(L,rt,Nt)},ge.useRef=function(L){return P.H.useRef(L)},ge.useState=function(L){return P.H.useState(L)},ge.useSyncExternalStore=function(L,rt,Nt){return P.H.useSyncExternalStore(L,rt,Nt)},ge.useTransition=function(){return P.H.useTransition()},ge.version="19.2.0",ge}var Mg;function Ch(){return Mg||(Mg=1,ad.exports=vy()),ad.exports}var Ye=Ch(),sd={exports:{}},ko={},rd={exports:{}},od={};var Eg;function xy(){return Eg||(Eg=1,(function(o){function e(z,$){var tt=z.length;z.push($);t:for(;0<tt;){var Pt=tt-1>>>1,Ft=z[Pt];if(0<l(Ft,$))z[Pt]=$,z[tt]=Ft,tt=Pt;else break t}}function i(z){return z.length===0?null:z[0]}function s(z){if(z.length===0)return null;var $=z[0],tt=z.pop();if(tt!==$){z[0]=tt;t:for(var Pt=0,Ft=z.length,L=Ft>>>1;Pt<L;){var rt=2*(Pt+1)-1,Nt=z[rt],K=rt+1,yt=z[K];if(0>l(Nt,tt))K<Ft&&0>l(yt,Nt)?(z[Pt]=yt,z[K]=tt,Pt=K):(z[Pt]=Nt,z[rt]=tt,Pt=rt);else if(K<Ft&&0>l(yt,tt))z[Pt]=yt,z[K]=tt,Pt=K;else break t}}return $}function l(z,$){var tt=z.sortIndex-$.sortIndex;return tt!==0?tt:z.id-$.id}if(o.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;o.unstable_now=function(){return u.now()}}else{var d=Date,h=d.now();o.unstable_now=function(){return d.now()-h}}var m=[],p=[],v=1,x=null,y=3,M=!1,T=!1,w=!1,S=!1,g=typeof setTimeout=="function"?setTimeout:null,F=typeof clearTimeout=="function"?clearTimeout:null,N=typeof setImmediate<"u"?setImmediate:null;function U(z){for(var $=i(p);$!==null;){if($.callback===null)s(p);else if($.startTime<=z)s(p),$.sortIndex=$.expirationTime,e(m,$);else break;$=i(p)}}function W(z){if(w=!1,U(z),!T)if(i(m)!==null)T=!0,V||(V=!0,ft());else{var $=i(p);$!==null&&Et(W,$.startTime-z)}}var V=!1,P=-1,q=5,D=-1;function C(){return S?!0:!(o.unstable_now()-D<q)}function G(){if(S=!1,V){var z=o.unstable_now();D=z;var $=!0;try{t:{T=!1,w&&(w=!1,F(P),P=-1),M=!0;var tt=y;try{e:{for(U(z),x=i(m);x!==null&&!(x.expirationTime>z&&C());){var Pt=x.callback;if(typeof Pt=="function"){x.callback=null,y=x.priorityLevel;var Ft=Pt(x.expirationTime<=z);if(z=o.unstable_now(),typeof Ft=="function"){x.callback=Ft,U(z),$=!0;break e}x===i(m)&&s(m),U(z)}else s(m);x=i(m)}if(x!==null)$=!0;else{var L=i(p);L!==null&&Et(W,L.startTime-z),$=!1}}break t}finally{x=null,y=tt,M=!1}$=void 0}}finally{$?ft():V=!1}}}var ft;if(typeof N=="function")ft=function(){N(G)};else if(typeof MessageChannel<"u"){var st=new MessageChannel,Mt=st.port2;st.port1.onmessage=G,ft=function(){Mt.postMessage(null)}}else ft=function(){g(G,0)};function Et(z,$){P=g(function(){z(o.unstable_now())},$)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(z){z.callback=null},o.unstable_forceFrameRate=function(z){0>z||125<z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):q=0<z?Math.floor(1e3/z):5},o.unstable_getCurrentPriorityLevel=function(){return y},o.unstable_next=function(z){switch(y){case 1:case 2:case 3:var $=3;break;default:$=y}var tt=y;y=$;try{return z()}finally{y=tt}},o.unstable_requestPaint=function(){S=!0},o.unstable_runWithPriority=function(z,$){switch(z){case 1:case 2:case 3:case 4:case 5:break;default:z=3}var tt=y;y=z;try{return $()}finally{y=tt}},o.unstable_scheduleCallback=function(z,$,tt){var Pt=o.unstable_now();switch(typeof tt=="object"&&tt!==null?(tt=tt.delay,tt=typeof tt=="number"&&0<tt?Pt+tt:Pt):tt=Pt,z){case 1:var Ft=-1;break;case 2:Ft=250;break;case 5:Ft=1073741823;break;case 4:Ft=1e4;break;default:Ft=5e3}return Ft=tt+Ft,z={id:v++,callback:$,priorityLevel:z,startTime:tt,expirationTime:Ft,sortIndex:-1},tt>Pt?(z.sortIndex=tt,e(p,z),i(m)===null&&z===i(p)&&(w?(F(P),P=-1):w=!0,Et(W,tt-Pt))):(z.sortIndex=Ft,e(m,z),T||M||(T=!0,V||(V=!0,ft()))),z},o.unstable_shouldYield=C,o.unstable_wrapCallback=function(z){var $=y;return function(){var tt=y;y=$;try{return z.apply(this,arguments)}finally{y=tt}}}})(od)),od}var bg;function yy(){return bg||(bg=1,rd.exports=xy()),rd.exports}var ld={exports:{}},ti={};var Tg;function Sy(){if(Tg)return ti;Tg=1;var o=Ch();function e(m){var p="https://react.dev/errors/"+m;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var v=2;v<arguments.length;v++)p+="&args[]="+encodeURIComponent(arguments[v])}return"Minified React error #"+m+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var s={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function u(m,p,v){var x=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:x==null?null:""+x,children:m,containerInfo:p,implementation:v}}var d=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function h(m,p){if(m==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return ti.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,ti.createPortal=function(m,p){var v=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(e(299));return u(m,p,null,v)},ti.flushSync=function(m){var p=d.T,v=s.p;try{if(d.T=null,s.p=2,m)return m()}finally{d.T=p,s.p=v,s.d.f()}},ti.preconnect=function(m,p){typeof m=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,s.d.C(m,p))},ti.prefetchDNS=function(m){typeof m=="string"&&s.d.D(m)},ti.preinit=function(m,p){if(typeof m=="string"&&p&&typeof p.as=="string"){var v=p.as,x=h(v,p.crossOrigin),y=typeof p.integrity=="string"?p.integrity:void 0,M=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;v==="style"?s.d.S(m,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:x,integrity:y,fetchPriority:M}):v==="script"&&s.d.X(m,{crossOrigin:x,integrity:y,fetchPriority:M,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},ti.preinitModule=function(m,p){if(typeof m=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var v=h(p.as,p.crossOrigin);s.d.M(m,{crossOrigin:v,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0})}}else p==null&&s.d.M(m)},ti.preload=function(m,p){if(typeof m=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var v=p.as,x=h(v,p.crossOrigin);s.d.L(m,v,{crossOrigin:x,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},ti.preloadModule=function(m,p){if(typeof m=="string")if(p){var v=h(p.as,p.crossOrigin);s.d.m(m,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:v,integrity:typeof p.integrity=="string"?p.integrity:void 0})}else s.d.m(m)},ti.requestFormReset=function(m){s.d.r(m)},ti.unstable_batchedUpdates=function(m,p){return m(p)},ti.useFormState=function(m,p,v){return d.H.useFormState(m,p,v)},ti.useFormStatus=function(){return d.H.useHostTransitionStatus()},ti.version="19.2.0",ti}var Ag;function My(){if(Ag)return ld.exports;Ag=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),ld.exports=Sy(),ld.exports}var wg;function Ey(){if(wg)return ko;wg=1;var o=yy(),e=Ch(),i=My();function s(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function u(t){var n=t,a=t;if(t.alternate)for(;n.return;)n=n.return;else{t=n;do n=t,(n.flags&4098)!==0&&(a=n.return),t=n.return;while(t)}return n.tag===3?a:null}function d(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function h(t){if(t.tag===31){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function m(t){if(u(t)!==t)throw Error(s(188))}function p(t){var n=t.alternate;if(!n){if(n=u(t),n===null)throw Error(s(188));return n!==t?null:t}for(var a=t,r=n;;){var c=a.return;if(c===null)break;var f=c.alternate;if(f===null){if(r=c.return,r!==null){a=r;continue}break}if(c.child===f.child){for(f=c.child;f;){if(f===a)return m(c),t;if(f===r)return m(c),n;f=f.sibling}throw Error(s(188))}if(a.return!==r.return)a=c,r=f;else{for(var _=!1,b=c.child;b;){if(b===a){_=!0,a=c,r=f;break}if(b===r){_=!0,r=c,a=f;break}b=b.sibling}if(!_){for(b=f.child;b;){if(b===a){_=!0,a=f,r=c;break}if(b===r){_=!0,r=f,a=c;break}b=b.sibling}if(!_)throw Error(s(189))}}if(a.alternate!==r)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?t:n}function v(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=v(t),n!==null)return n;t=t.sibling}return null}var x=Object.assign,y=Symbol.for("react.element"),M=Symbol.for("react.transitional.element"),T=Symbol.for("react.portal"),w=Symbol.for("react.fragment"),S=Symbol.for("react.strict_mode"),g=Symbol.for("react.profiler"),F=Symbol.for("react.consumer"),N=Symbol.for("react.context"),U=Symbol.for("react.forward_ref"),W=Symbol.for("react.suspense"),V=Symbol.for("react.suspense_list"),P=Symbol.for("react.memo"),q=Symbol.for("react.lazy"),D=Symbol.for("react.activity"),C=Symbol.for("react.memo_cache_sentinel"),G=Symbol.iterator;function ft(t){return t===null||typeof t!="object"?null:(t=G&&t[G]||t["@@iterator"],typeof t=="function"?t:null)}var st=Symbol.for("react.client.reference");function Mt(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===st?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case w:return"Fragment";case g:return"Profiler";case S:return"StrictMode";case W:return"Suspense";case V:return"SuspenseList";case D:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case T:return"Portal";case N:return t.displayName||"Context";case F:return(t._context.displayName||"Context")+".Consumer";case U:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case P:return n=t.displayName||null,n!==null?n:Mt(t.type)||"Memo";case q:n=t._payload,t=t._init;try{return Mt(t(n))}catch{}}return null}var Et=Array.isArray,z=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,$=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,tt={pending:!1,data:null,method:null,action:null},Pt=[],Ft=-1;function L(t){return{current:t}}function rt(t){0>Ft||(t.current=Pt[Ft],Pt[Ft]=null,Ft--)}function Nt(t,n){Ft++,Pt[Ft]=t.current,t.current=n}var K=L(null),yt=L(null),Bt=L(null),zt=L(null);function $t(t,n){switch(Nt(Bt,n),Nt(yt,t),Nt(K,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?V0(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=V0(n),t=k0(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}rt(K),Nt(K,t)}function Jt(){rt(K),rt(yt),rt(Bt)}function pe(t){t.memoizedState!==null&&Nt(zt,t);var n=K.current,a=k0(n,t.type);n!==a&&(Nt(yt,t),Nt(K,a))}function je(t){yt.current===t&&(rt(K),rt(yt)),zt.current===t&&(rt(zt),Bo._currentValue=tt)}var be,ln;function k(t){if(be===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);be=n&&n[1]||"",ln=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+be+t+ln}var Rn=!1;function xe(t,n){if(!t||Rn)return"";Rn=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(n){var At=function(){throw Error()};if(Object.defineProperty(At.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(At,[])}catch(mt){var ct=mt}Reflect.construct(t,[],At)}else{try{At.call()}catch(mt){ct=mt}t.call(At.prototype)}}else{try{throw Error()}catch(mt){ct=mt}(At=t())&&typeof At.catch=="function"&&At.catch(function(){})}}catch(mt){if(mt&&ct&&typeof mt.stack=="string")return[mt.stack,ct.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var c=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,"name");c&&c.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=r.DetermineComponentFrameRoot(),_=f[0],b=f[1];if(_&&b){var B=_.split(`
`),at=b.split(`
`);for(c=r=0;r<B.length&&!B[r].includes("DetermineComponentFrameRoot");)r++;for(;c<at.length&&!at[c].includes("DetermineComponentFrameRoot");)c++;if(r===B.length||c===at.length)for(r=B.length-1,c=at.length-1;1<=r&&0<=c&&B[r]!==at[c];)c--;for(;1<=r&&0<=c;r--,c--)if(B[r]!==at[c]){if(r!==1||c!==1)do if(r--,c--,0>c||B[r]!==at[c]){var St=`
`+B[r].replace(" at new "," at ");return t.displayName&&St.includes("<anonymous>")&&(St=St.replace("<anonymous>",t.displayName)),St}while(1<=r&&0<=c);break}}}finally{Rn=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?k(a):""}function Te(t,n){switch(t.tag){case 26:case 27:case 5:return k(t.type);case 16:return k("Lazy");case 13:return t.child!==n&&n!==null?k("Suspense Fallback"):k("Suspense");case 19:return k("SuspenseList");case 0:case 15:return xe(t.type,!1);case 11:return xe(t.type.render,!1);case 1:return xe(t.type,!0);case 31:return k("Activity");default:return""}}function j(t){try{var n="",a=null;do n+=Te(t,a),a=t,t=t.return;while(t);return n}catch(r){return`
Error generating stack: `+r.message+`
`+r.stack}}var I=Object.prototype.hasOwnProperty,Dt=o.unstable_scheduleCallback,R=o.unstable_cancelCallback,E=o.unstable_shouldYield,H=o.unstable_requestPaint,nt=o.unstable_now,ht=o.unstable_getCurrentPriorityLevel,ot=o.unstable_ImmediatePriority,xt=o.unstable_UserBlockingPriority,pt=o.unstable_NormalPriority,Ht=o.unstable_LowPriority,ee=o.unstable_IdlePriority,vt=o.log,Ut=o.unstable_setDisableYieldValue,Vt=null,Ct=null;function kt(t){if(typeof vt=="function"&&Ut(t),Ct&&typeof Ct.setStrictMode=="function")try{Ct.setStrictMode(Vt,t)}catch{}}var ae=Math.clz32?Math.clz32:O,se=Math.log,Xt=Math.LN2;function O(t){return t>>>=0,t===0?32:31-(se(t)/Xt|0)|0}var Ot=256,Q=262144,gt=4194304;function It(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function Tt(t,n,a){var r=t.pendingLanes;if(r===0)return 0;var c=0,f=t.suspendedLanes,_=t.pingedLanes;t=t.warmLanes;var b=r&134217727;return b!==0?(r=b&~f,r!==0?c=It(r):(_&=b,_!==0?c=It(_):a||(a=b&~t,a!==0&&(c=It(a))))):(b=r&~f,b!==0?c=It(b):_!==0?c=It(_):a||(a=r&~t,a!==0&&(c=It(a)))),c===0?0:n!==0&&n!==c&&(n&f)===0&&(f=c&-c,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:c}function Qt(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function Ge(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ze(){var t=gt;return gt<<=1,(gt&62914560)===0&&(gt=4194304),t}function le(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function tn(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function Cn(t,n,a,r,c,f){var _=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var b=t.entanglements,B=t.expirationTimes,at=t.hiddenUpdates;for(a=_&~a;0<a;){var St=31-ae(a),At=1<<St;b[St]=0,B[St]=-1;var ct=at[St];if(ct!==null)for(at[St]=null,St=0;St<ct.length;St++){var mt=ct[St];mt!==null&&(mt.lane&=-536870913)}a&=~At}r!==0&&si(t,r,0),f!==0&&c===0&&t.tag!==0&&(t.suspendedLanes|=f&~(_&~n))}function si(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var r=31-ae(n);t.entangledLanes|=n,t.entanglements[r]=t.entanglements[r]|1073741824|a&261930}function Kn(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var r=31-ae(a),c=1<<r;c&n|t[r]&n&&(t[r]|=n),a&=~c}}function Fn(t,n){var a=n&-n;return a=(a&42)!==0?1:Qn(a),(a&(t.suspendedLanes|n))!==0?0:a}function Qn(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function Mn(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function sa(){var t=$.p;return t!==0?t:(t=window.event,t===void 0?32:dg(t.type))}function Zi(t,n){var a=$.p;try{return $.p=t,n()}finally{$.p=a}}var Hn=Math.random().toString(36).slice(2),Ze="__reactFiber$"+Hn,pn="__reactProps$"+Hn,ri="__reactContainer$"+Hn,Oa="__reactEvents$"+Hn,ms="__reactListeners$"+Hn,$r="__reactHandles$"+Hn,gs="__reactResources$"+Hn,Ci="__reactMarker$"+Hn;function A(t){delete t[Ze],delete t[pn],delete t[Oa],delete t[ms],delete t[$r]}function Y(t){var n=t[Ze];if(n)return n;for(var a=t.parentNode;a;){if(n=a[ri]||a[Ze]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=K0(t);t!==null;){if(a=t[Ze])return a;t=K0(t)}return n}t=a,a=t.parentNode}return null}function lt(t){if(t=t[Ze]||t[ri]){var n=t.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return t}return null}function ut(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(s(33))}function Z(t){var n=t[gs];return n||(n=t[gs]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function Rt(t){t[Ci]=!0}var qt=new Set,Zt={};function Kt(t,n){re(t,n),re(t+"Capture",n)}function re(t,n){for(Zt[t]=n,t=0;t<n.length;t++)qt.add(n[t])}var de=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),oe={},Me={};function Pe(t){return I.call(Me,t)?!0:I.call(oe,t)?!1:de.test(t)?Me[t]=!0:(oe[t]=!0,!1)}function en(t,n,a){if(Pe(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var r=n.toLowerCase().slice(0,5);if(r!=="data-"&&r!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,""+a)}}function Ke(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,""+a)}}function dt(t,n,a,r){if(r===null)t.removeAttribute(a);else{switch(typeof r){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,""+r)}}function _t(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Gt(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Lt(t,n,a){var r=Object.getOwnPropertyDescriptor(t.constructor.prototype,n);if(!t.hasOwnProperty(n)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var c=r.get,f=r.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return c.call(this)},set:function(_){a=""+_,f.call(this,_)}}),Object.defineProperty(t,n,{enumerable:r.enumerable}),{getValue:function(){return a},setValue:function(_){a=""+_},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function Yt(t){if(!t._valueTracker){var n=Gt(t)?"checked":"value";t._valueTracker=Lt(t,n,""+t[n])}}function we(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),r="";return t&&(r=Gt(t)?t.checked?"true":"false":t.value),t=r,t!==a?(n.setValue(t),!0):!1}function me(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var hn=/[\n"\\]/g;function ne(t){return t.replace(hn,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function Qe(t,n,a,r,c,f,_,b){t.name="",_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"?t.type=_:t.removeAttribute("type"),n!=null?_==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+_t(n)):t.value!==""+_t(n)&&(t.value=""+_t(n)):_!=="submit"&&_!=="reset"||t.removeAttribute("value"),n!=null?mn(t,_,_t(n)):a!=null?mn(t,_,_t(a)):r!=null&&t.removeAttribute("value"),c==null&&f!=null&&(t.defaultChecked=!!f),c!=null&&(t.checked=c&&typeof c!="function"&&typeof c!="symbol"),b!=null&&typeof b!="function"&&typeof b!="symbol"&&typeof b!="boolean"?t.name=""+_t(b):t.removeAttribute("name")}function vn(t,n,a,r,c,f,_,b){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(t.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){Yt(t);return}a=a!=null?""+_t(a):"",n=n!=null?""+_t(n):a,b||n===t.value||(t.value=n),t.defaultValue=n}r=r??c,r=typeof r!="function"&&typeof r!="symbol"&&!!r,t.checked=b?t.checked:!!r,t.defaultChecked=!!r,_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"&&(t.name=_),Yt(t)}function mn(t,n,a){n==="number"&&me(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function cn(t,n,a,r){if(t=t.options,n){n={};for(var c=0;c<a.length;c++)n["$"+a[c]]=!0;for(a=0;a<t.length;a++)c=n.hasOwnProperty("$"+t[a].value),t[a].selected!==c&&(t[a].selected=c),c&&r&&(t[a].defaultSelected=!0)}else{for(a=""+_t(a),n=null,c=0;c<t.length;c++){if(t[c].value===a){t[c].selected=!0,r&&(t[c].defaultSelected=!0);return}n!==null||t[c].disabled||(n=t[c])}n!==null&&(n.selected=!0)}}function un(t,n,a){if(n!=null&&(n=""+_t(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+_t(a):""}function Le(t,n,a,r){if(n==null){if(r!=null){if(a!=null)throw Error(s(92));if(Et(r)){if(1<r.length)throw Error(s(93));r=r[0]}a=r}a==null&&(a=""),n=a}a=_t(n),t.defaultValue=a,r=t.textContent,r===a&&r!==""&&r!==null&&(t.value=r),Yt(t)}function Fe(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var Tn=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Jn(t,n,a){var r=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?r?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":r?t.setProperty(n,a):typeof a!="number"||a===0||Tn.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function fn(t,n,a){if(n!=null&&typeof n!="object")throw Error(s(62));if(t=t.style,a!=null){for(var r in a)!a.hasOwnProperty(r)||n!=null&&n.hasOwnProperty(r)||(r.indexOf("--")===0?t.setProperty(r,""):r==="float"?t.cssFloat="":t[r]="");for(var c in n)r=n[c],n.hasOwnProperty(c)&&a[c]!==r&&Jn(t,c,r)}else for(var f in n)n.hasOwnProperty(f)&&Jn(t,f,n[f])}function Sn(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var He=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),he=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Ae(t){return he.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function Re(){}var zn=null;function ra(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var $n=null,js=null;function Gh(t){var n=lt(t);if(n&&(t=n.stateNode)){var a=t[pn]||null;t:switch(t=n.stateNode,n.type){case"input":if(Qe(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+ne(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var r=a[n];if(r!==t&&r.form===t.form){var c=r[pn]||null;if(!c)throw Error(s(90));Qe(r,c.value,c.defaultValue,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name)}}for(n=0;n<a.length;n++)r=a[n],r.form===t.form&&we(r)}break t;case"textarea":un(t,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&cn(t,!!a.multiple,n,!1)}}}var eu=!1;function Vh(t,n,a){if(eu)return t(n,a);eu=!0;try{var r=t(n);return r}finally{if(eu=!1,($n!==null||js!==null)&&(Wl(),$n&&(n=$n,t=js,js=$n=null,Gh(n),t)))for(n=0;n<t.length;n++)Gh(t[n])}}function to(t,n){var a=t.stateNode;if(a===null)return null;var r=a[pn]||null;if(r===null)return null;a=r[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break t;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(s(231,n,typeof a));return a}var oa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),nu=!1;if(oa)try{var eo={};Object.defineProperty(eo,"passive",{get:function(){nu=!0}}),window.addEventListener("test",eo,eo),window.removeEventListener("test",eo,eo)}catch{nu=!1}var za=null,iu=null,rl=null;function kh(){if(rl)return rl;var t,n=iu,a=n.length,r,c="value"in za?za.value:za.textContent,f=c.length;for(t=0;t<a&&n[t]===c[t];t++);var _=a-t;for(r=1;r<=_&&n[a-r]===c[f-r];r++);return rl=c.slice(t,1<r?1-r:void 0)}function ol(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function ll(){return!0}function Xh(){return!1}function ui(t){function n(a,r,c,f,_){this._reactName=a,this._targetInst=c,this.type=r,this.nativeEvent=f,this.target=_,this.currentTarget=null;for(var b in t)t.hasOwnProperty(b)&&(a=t[b],this[b]=a?a(f):f[b]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?ll:Xh,this.isPropagationStopped=Xh,this}return x(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=ll)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=ll)},persist:function(){},isPersistent:ll}),n}var _s={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},cl=ui(_s),no=x({},_s,{view:0,detail:0}),pv=ui(no),au,su,io,ul=x({},no,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:ou,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==io&&(io&&t.type==="mousemove"?(au=t.screenX-io.screenX,su=t.screenY-io.screenY):su=au=0,io=t),au)},movementY:function(t){return"movementY"in t?t.movementY:su}}),qh=ui(ul),mv=x({},ul,{dataTransfer:0}),gv=ui(mv),_v=x({},no,{relatedTarget:0}),ru=ui(_v),vv=x({},_s,{animationName:0,elapsedTime:0,pseudoElement:0}),xv=ui(vv),yv=x({},_s,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Sv=ui(yv),Mv=x({},_s,{data:0}),Wh=ui(Mv),Ev={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},bv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Tv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Av(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=Tv[t])?!!n[t]:!1}function ou(){return Av}var wv=x({},no,{key:function(t){if(t.key){var n=Ev[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=ol(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?bv[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:ou,charCode:function(t){return t.type==="keypress"?ol(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?ol(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Rv=ui(wv),Cv=x({},ul,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Yh=ui(Cv),Dv=x({},no,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:ou}),Uv=ui(Dv),Lv=x({},_s,{propertyName:0,elapsedTime:0,pseudoElement:0}),Nv=ui(Lv),Ov=x({},ul,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),zv=ui(Ov),Pv=x({},_s,{newState:0,oldState:0}),Iv=ui(Pv),Bv=[9,13,27,32],lu=oa&&"CompositionEvent"in window,ao=null;oa&&"documentMode"in document&&(ao=document.documentMode);var Fv=oa&&"TextEvent"in window&&!ao,jh=oa&&(!lu||ao&&8<ao&&11>=ao),Zh=" ",Kh=!1;function Qh(t,n){switch(t){case"keyup":return Bv.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Jh(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Zs=!1;function Hv(t,n){switch(t){case"compositionend":return Jh(n);case"keypress":return n.which!==32?null:(Kh=!0,Zh);case"textInput":return t=n.data,t===Zh&&Kh?null:t;default:return null}}function Gv(t,n){if(Zs)return t==="compositionend"||!lu&&Qh(t,n)?(t=kh(),rl=iu=za=null,Zs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return jh&&n.locale!=="ko"?null:n.data;default:return null}}var Vv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function $h(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!Vv[t.type]:n==="textarea"}function tp(t,n,a,r){$n?js?js.push(r):js=[r]:$n=r,n=$l(n,"onChange"),0<n.length&&(a=new cl("onChange","change",null,a,r),t.push({event:a,listeners:n}))}var so=null,ro=null;function kv(t){P0(t,0)}function fl(t){var n=ut(t);if(we(n))return t}function ep(t,n){if(t==="change")return n}var np=!1;if(oa){var cu;if(oa){var uu="oninput"in document;if(!uu){var ip=document.createElement("div");ip.setAttribute("oninput","return;"),uu=typeof ip.oninput=="function"}cu=uu}else cu=!1;np=cu&&(!document.documentMode||9<document.documentMode)}function ap(){so&&(so.detachEvent("onpropertychange",sp),ro=so=null)}function sp(t){if(t.propertyName==="value"&&fl(ro)){var n=[];tp(n,ro,t,ra(t)),Vh(kv,n)}}function Xv(t,n,a){t==="focusin"?(ap(),so=n,ro=a,so.attachEvent("onpropertychange",sp)):t==="focusout"&&ap()}function qv(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return fl(ro)}function Wv(t,n){if(t==="click")return fl(n)}function Yv(t,n){if(t==="input"||t==="change")return fl(n)}function jv(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var vi=typeof Object.is=="function"?Object.is:jv;function oo(t,n){if(vi(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),r=Object.keys(n);if(a.length!==r.length)return!1;for(r=0;r<a.length;r++){var c=a[r];if(!I.call(n,c)||!vi(t[c],n[c]))return!1}return!0}function rp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function op(t,n){var a=rp(t);t=0;for(var r;a;){if(a.nodeType===3){if(r=t+a.textContent.length,t<=n&&r>=n)return{node:a,offset:n-t};t=r}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=rp(a)}}function lp(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?lp(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function cp(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=me(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=me(t.document)}return n}function fu(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var Zv=oa&&"documentMode"in document&&11>=document.documentMode,Ks=null,du=null,lo=null,hu=!1;function up(t,n,a){var r=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;hu||Ks==null||Ks!==me(r)||(r=Ks,"selectionStart"in r&&fu(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),lo&&oo(lo,r)||(lo=r,r=$l(du,"onSelect"),0<r.length&&(n=new cl("onSelect","select",null,n,a),t.push({event:n,listeners:r}),n.target=Ks)))}function vs(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var Qs={animationend:vs("Animation","AnimationEnd"),animationiteration:vs("Animation","AnimationIteration"),animationstart:vs("Animation","AnimationStart"),transitionrun:vs("Transition","TransitionRun"),transitionstart:vs("Transition","TransitionStart"),transitioncancel:vs("Transition","TransitionCancel"),transitionend:vs("Transition","TransitionEnd")},pu={},fp={};oa&&(fp=document.createElement("div").style,"AnimationEvent"in window||(delete Qs.animationend.animation,delete Qs.animationiteration.animation,delete Qs.animationstart.animation),"TransitionEvent"in window||delete Qs.transitionend.transition);function xs(t){if(pu[t])return pu[t];if(!Qs[t])return t;var n=Qs[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in fp)return pu[t]=n[a];return t}var dp=xs("animationend"),hp=xs("animationiteration"),pp=xs("animationstart"),Kv=xs("transitionrun"),Qv=xs("transitionstart"),Jv=xs("transitioncancel"),mp=xs("transitionend"),gp=new Map,mu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");mu.push("scrollEnd");function Fi(t,n){gp.set(t,n),Kt(n,[t])}var dl=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},Di=[],Js=0,gu=0;function hl(){for(var t=Js,n=gu=Js=0;n<t;){var a=Di[n];Di[n++]=null;var r=Di[n];Di[n++]=null;var c=Di[n];Di[n++]=null;var f=Di[n];if(Di[n++]=null,r!==null&&c!==null){var _=r.pending;_===null?c.next=c:(c.next=_.next,_.next=c),r.pending=c}f!==0&&_p(a,c,f)}}function pl(t,n,a,r){Di[Js++]=t,Di[Js++]=n,Di[Js++]=a,Di[Js++]=r,gu|=r,t.lanes|=r,t=t.alternate,t!==null&&(t.lanes|=r)}function _u(t,n,a,r){return pl(t,n,a,r),ml(t)}function ys(t,n){return pl(t,null,null,n),ml(t)}function _p(t,n,a){t.lanes|=a;var r=t.alternate;r!==null&&(r.lanes|=a);for(var c=!1,f=t.return;f!==null;)f.childLanes|=a,r=f.alternate,r!==null&&(r.childLanes|=a),f.tag===22&&(t=f.stateNode,t===null||t._visibility&1||(c=!0)),t=f,f=f.return;return t.tag===3?(f=t.stateNode,c&&n!==null&&(c=31-ae(a),t=f.hiddenUpdates,r=t[c],r===null?t[c]=[n]:r.push(n),n.lane=a|536870912),f):null}function ml(t){if(50<Uo)throw Uo=0,wf=null,Error(s(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var $s={};function $v(t,n,a,r){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function xi(t,n,a,r){return new $v(t,n,a,r)}function vu(t){return t=t.prototype,!(!t||!t.isReactComponent)}function la(t,n){var a=t.alternate;return a===null?(a=xi(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function vp(t,n){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function gl(t,n,a,r,c,f){var _=0;if(r=t,typeof t=="function")vu(t)&&(_=1);else if(typeof t=="string")_=ay(t,a,K.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(t){case D:return t=xi(31,a,n,c),t.elementType=D,t.lanes=f,t;case w:return Ss(a.children,c,f,n);case S:_=8,c|=24;break;case g:return t=xi(12,a,n,c|2),t.elementType=g,t.lanes=f,t;case W:return t=xi(13,a,n,c),t.elementType=W,t.lanes=f,t;case V:return t=xi(19,a,n,c),t.elementType=V,t.lanes=f,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case N:_=10;break t;case F:_=9;break t;case U:_=11;break t;case P:_=14;break t;case q:_=16,r=null;break t}_=29,a=Error(s(130,t===null?"null":typeof t,"")),r=null}return n=xi(_,a,n,c),n.elementType=t,n.type=r,n.lanes=f,n}function Ss(t,n,a,r){return t=xi(7,t,r,n),t.lanes=a,t}function xu(t,n,a){return t=xi(6,t,null,n),t.lanes=a,t}function xp(t){var n=xi(18,null,null,0);return n.stateNode=t,n}function yu(t,n,a){return n=xi(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var yp=new WeakMap;function Ui(t,n){if(typeof t=="object"&&t!==null){var a=yp.get(t);return a!==void 0?a:(n={value:t,source:n,stack:j(n)},yp.set(t,n),n)}return{value:t,source:n,stack:j(n)}}var tr=[],er=0,_l=null,co=0,Li=[],Ni=0,Pa=null,Ki=1,Qi="";function ca(t,n){tr[er++]=co,tr[er++]=_l,_l=t,co=n}function Sp(t,n,a){Li[Ni++]=Ki,Li[Ni++]=Qi,Li[Ni++]=Pa,Pa=t;var r=Ki;t=Qi;var c=32-ae(r)-1;r&=~(1<<c),a+=1;var f=32-ae(n)+c;if(30<f){var _=c-c%5;f=(r&(1<<_)-1).toString(32),r>>=_,c-=_,Ki=1<<32-ae(n)+c|a<<c|r,Qi=f+t}else Ki=1<<f|a<<c|r,Qi=t}function Su(t){t.return!==null&&(ca(t,1),Sp(t,1,0))}function Mu(t){for(;t===_l;)_l=tr[--er],tr[er]=null,co=tr[--er],tr[er]=null;for(;t===Pa;)Pa=Li[--Ni],Li[Ni]=null,Qi=Li[--Ni],Li[Ni]=null,Ki=Li[--Ni],Li[Ni]=null}function Mp(t,n){Li[Ni++]=Ki,Li[Ni++]=Qi,Li[Ni++]=Pa,Ki=n.id,Qi=n.overflow,Pa=t}var qn=null,gn=null,Ie=!1,Ia=null,Oi=!1,Eu=Error(s(519));function Ba(t){var n=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw uo(Ui(n,t)),Eu}function Ep(t){var n=t.stateNode,a=t.type,r=t.memoizedProps;switch(n[Ze]=t,n[pn]=r,a){case"dialog":De("cancel",n),De("close",n);break;case"iframe":case"object":case"embed":De("load",n);break;case"video":case"audio":for(a=0;a<No.length;a++)De(No[a],n);break;case"source":De("error",n);break;case"img":case"image":case"link":De("error",n),De("load",n);break;case"details":De("toggle",n);break;case"input":De("invalid",n),vn(n,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case"select":De("invalid",n);break;case"textarea":De("invalid",n),Le(n,r.value,r.defaultValue,r.children)}a=r.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||r.suppressHydrationWarning===!0||H0(n.textContent,a)?(r.popover!=null&&(De("beforetoggle",n),De("toggle",n)),r.onScroll!=null&&De("scroll",n),r.onScrollEnd!=null&&De("scrollend",n),r.onClick!=null&&(n.onclick=Re),n=!0):n=!1,n||Ba(t,!0)}function bp(t){for(qn=t.return;qn;)switch(qn.tag){case 5:case 31:case 13:Oi=!1;return;case 27:case 3:Oi=!0;return;default:qn=qn.return}}function nr(t){if(t!==qn)return!1;if(!Ie)return bp(t),Ie=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||Vf(t.type,t.memoizedProps)),a=!a),a&&gn&&Ba(t),bp(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));gn=Z0(t)}else if(n===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));gn=Z0(t)}else n===27?(n=gn,Ja(t.type)?(t=Yf,Yf=null,gn=t):gn=n):gn=qn?Pi(t.stateNode.nextSibling):null;return!0}function Ms(){gn=qn=null,Ie=!1}function bu(){var t=Ia;return t!==null&&(pi===null?pi=t:pi.push.apply(pi,t),Ia=null),t}function uo(t){Ia===null?Ia=[t]:Ia.push(t)}var Tu=L(null),Es=null,ua=null;function Fa(t,n,a){Nt(Tu,n._currentValue),n._currentValue=a}function fa(t){t._currentValue=Tu.current,rt(Tu)}function Au(t,n,a){for(;t!==null;){var r=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,r!==null&&(r.childLanes|=n)):r!==null&&(r.childLanes&n)!==n&&(r.childLanes|=n),t===a)break;t=t.return}}function wu(t,n,a,r){var c=t.child;for(c!==null&&(c.return=t);c!==null;){var f=c.dependencies;if(f!==null){var _=c.child;f=f.firstContext;t:for(;f!==null;){var b=f;f=c;for(var B=0;B<n.length;B++)if(b.context===n[B]){f.lanes|=a,b=f.alternate,b!==null&&(b.lanes|=a),Au(f.return,a,t),r||(_=null);break t}f=b.next}}else if(c.tag===18){if(_=c.return,_===null)throw Error(s(341));_.lanes|=a,f=_.alternate,f!==null&&(f.lanes|=a),Au(_,a,t),_=null}else _=c.child;if(_!==null)_.return=c;else for(_=c;_!==null;){if(_===t){_=null;break}if(c=_.sibling,c!==null){c.return=_.return,_=c;break}_=_.return}c=_}}function ir(t,n,a,r){t=null;for(var c=n,f=!1;c!==null;){if(!f){if((c.flags&524288)!==0)f=!0;else if((c.flags&262144)!==0)break}if(c.tag===10){var _=c.alternate;if(_===null)throw Error(s(387));if(_=_.memoizedProps,_!==null){var b=c.type;vi(c.pendingProps.value,_.value)||(t!==null?t.push(b):t=[b])}}else if(c===zt.current){if(_=c.alternate,_===null)throw Error(s(387));_.memoizedState.memoizedState!==c.memoizedState.memoizedState&&(t!==null?t.push(Bo):t=[Bo])}c=c.return}t!==null&&wu(n,t,a,r),n.flags|=262144}function vl(t){for(t=t.firstContext;t!==null;){if(!vi(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function bs(t){Es=t,ua=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Wn(t){return Tp(Es,t)}function xl(t,n){return Es===null&&bs(t),Tp(t,n)}function Tp(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},ua===null){if(t===null)throw Error(s(308));ua=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else ua=ua.next=n;return a}var tx=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,r){t.push(r)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},ex=o.unstable_scheduleCallback,nx=o.unstable_NormalPriority,Dn={$$typeof:N,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ru(){return{controller:new tx,data:new Map,refCount:0}}function fo(t){t.refCount--,t.refCount===0&&ex(nx,function(){t.controller.abort()})}var ho=null,Cu=0,ar=0,sr=null;function ix(t,n){if(ho===null){var a=ho=[];Cu=0,ar=Nf(),sr={status:"pending",value:void 0,then:function(r){a.push(r)}}}return Cu++,n.then(Ap,Ap),n}function Ap(){if(--Cu===0&&ho!==null){sr!==null&&(sr.status="fulfilled");var t=ho;ho=null,ar=0,sr=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function ax(t,n){var a=[],r={status:"pending",value:null,reason:null,then:function(c){a.push(c)}};return t.then(function(){r.status="fulfilled",r.value=n;for(var c=0;c<a.length;c++)(0,a[c])(n)},function(c){for(r.status="rejected",r.reason=c,c=0;c<a.length;c++)(0,a[c])(void 0)}),r}var wp=z.S;z.S=function(t,n){u0=nt(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&ix(t,n),wp!==null&&wp(t,n)};var Ts=L(null);function Du(){var t=Ts.current;return t!==null?t:dn.pooledCache}function yl(t,n){n===null?Nt(Ts,Ts.current):Nt(Ts,n.pool)}function Rp(){var t=Du();return t===null?null:{parent:Dn._currentValue,pool:t}}var rr=Error(s(460)),Uu=Error(s(474)),Sl=Error(s(542)),Ml={then:function(){}};function Cp(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Dp(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(Re,Re),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Lp(t),t;default:if(typeof n.status=="string")n.then(Re,Re);else{if(t=dn,t!==null&&100<t.shellSuspendCounter)throw Error(s(482));t=n,t.status="pending",t.then(function(r){if(n.status==="pending"){var c=n;c.status="fulfilled",c.value=r}},function(r){if(n.status==="pending"){var c=n;c.status="rejected",c.reason=r}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Lp(t),t}throw ws=n,rr}}function As(t){try{var n=t._init;return n(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(ws=a,rr):a}}var ws=null;function Up(){if(ws===null)throw Error(s(459));var t=ws;return ws=null,t}function Lp(t){if(t===rr||t===Sl)throw Error(s(483))}var or=null,po=0;function El(t){var n=po;return po+=1,or===null&&(or=[]),Dp(or,t,n)}function mo(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function bl(t,n){throw n.$$typeof===y?Error(s(525)):(t=Object.prototype.toString.call(n),Error(s(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function Np(t){function n(J,X){if(t){var it=J.deletions;it===null?(J.deletions=[X],J.flags|=16):it.push(X)}}function a(J,X){if(!t)return null;for(;X!==null;)n(J,X),X=X.sibling;return null}function r(J){for(var X=new Map;J!==null;)J.key!==null?X.set(J.key,J):X.set(J.index,J),J=J.sibling;return X}function c(J,X){return J=la(J,X),J.index=0,J.sibling=null,J}function f(J,X,it){return J.index=it,t?(it=J.alternate,it!==null?(it=it.index,it<X?(J.flags|=67108866,X):it):(J.flags|=67108866,X)):(J.flags|=1048576,X)}function _(J){return t&&J.alternate===null&&(J.flags|=67108866),J}function b(J,X,it,bt){return X===null||X.tag!==6?(X=xu(it,J.mode,bt),X.return=J,X):(X=c(X,it),X.return=J,X)}function B(J,X,it,bt){var ce=it.type;return ce===w?St(J,X,it.props.children,bt,it.key):X!==null&&(X.elementType===ce||typeof ce=="object"&&ce!==null&&ce.$$typeof===q&&As(ce)===X.type)?(X=c(X,it.props),mo(X,it),X.return=J,X):(X=gl(it.type,it.key,it.props,null,J.mode,bt),mo(X,it),X.return=J,X)}function at(J,X,it,bt){return X===null||X.tag!==4||X.stateNode.containerInfo!==it.containerInfo||X.stateNode.implementation!==it.implementation?(X=yu(it,J.mode,bt),X.return=J,X):(X=c(X,it.children||[]),X.return=J,X)}function St(J,X,it,bt,ce){return X===null||X.tag!==7?(X=Ss(it,J.mode,bt,ce),X.return=J,X):(X=c(X,it),X.return=J,X)}function At(J,X,it){if(typeof X=="string"&&X!==""||typeof X=="number"||typeof X=="bigint")return X=xu(""+X,J.mode,it),X.return=J,X;if(typeof X=="object"&&X!==null){switch(X.$$typeof){case M:return it=gl(X.type,X.key,X.props,null,J.mode,it),mo(it,X),it.return=J,it;case T:return X=yu(X,J.mode,it),X.return=J,X;case q:return X=As(X),At(J,X,it)}if(Et(X)||ft(X))return X=Ss(X,J.mode,it,null),X.return=J,X;if(typeof X.then=="function")return At(J,El(X),it);if(X.$$typeof===N)return At(J,xl(J,X),it);bl(J,X)}return null}function ct(J,X,it,bt){var ce=X!==null?X.key:null;if(typeof it=="string"&&it!==""||typeof it=="number"||typeof it=="bigint")return ce!==null?null:b(J,X,""+it,bt);if(typeof it=="object"&&it!==null){switch(it.$$typeof){case M:return it.key===ce?B(J,X,it,bt):null;case T:return it.key===ce?at(J,X,it,bt):null;case q:return it=As(it),ct(J,X,it,bt)}if(Et(it)||ft(it))return ce!==null?null:St(J,X,it,bt,null);if(typeof it.then=="function")return ct(J,X,El(it),bt);if(it.$$typeof===N)return ct(J,X,xl(J,it),bt);bl(J,it)}return null}function mt(J,X,it,bt,ce){if(typeof bt=="string"&&bt!==""||typeof bt=="number"||typeof bt=="bigint")return J=J.get(it)||null,b(X,J,""+bt,ce);if(typeof bt=="object"&&bt!==null){switch(bt.$$typeof){case M:return J=J.get(bt.key===null?it:bt.key)||null,B(X,J,bt,ce);case T:return J=J.get(bt.key===null?it:bt.key)||null,at(X,J,bt,ce);case q:return bt=As(bt),mt(J,X,it,bt,ce)}if(Et(bt)||ft(bt))return J=J.get(it)||null,St(X,J,bt,ce,null);if(typeof bt.then=="function")return mt(J,X,it,El(bt),ce);if(bt.$$typeof===N)return mt(J,X,it,xl(X,bt),ce);bl(X,bt)}return null}function te(J,X,it,bt){for(var ce=null,Ve=null,ie=X,ye=X=0,Oe=null;ie!==null&&ye<it.length;ye++){ie.index>ye?(Oe=ie,ie=null):Oe=ie.sibling;var ke=ct(J,ie,it[ye],bt);if(ke===null){ie===null&&(ie=Oe);break}t&&ie&&ke.alternate===null&&n(J,ie),X=f(ke,X,ye),Ve===null?ce=ke:Ve.sibling=ke,Ve=ke,ie=Oe}if(ye===it.length)return a(J,ie),Ie&&ca(J,ye),ce;if(ie===null){for(;ye<it.length;ye++)ie=At(J,it[ye],bt),ie!==null&&(X=f(ie,X,ye),Ve===null?ce=ie:Ve.sibling=ie,Ve=ie);return Ie&&ca(J,ye),ce}for(ie=r(ie);ye<it.length;ye++)Oe=mt(ie,J,ye,it[ye],bt),Oe!==null&&(t&&Oe.alternate!==null&&ie.delete(Oe.key===null?ye:Oe.key),X=f(Oe,X,ye),Ve===null?ce=Oe:Ve.sibling=Oe,Ve=Oe);return t&&ie.forEach(function(is){return n(J,is)}),Ie&&ca(J,ye),ce}function ue(J,X,it,bt){if(it==null)throw Error(s(151));for(var ce=null,Ve=null,ie=X,ye=X=0,Oe=null,ke=it.next();ie!==null&&!ke.done;ye++,ke=it.next()){ie.index>ye?(Oe=ie,ie=null):Oe=ie.sibling;var is=ct(J,ie,ke.value,bt);if(is===null){ie===null&&(ie=Oe);break}t&&ie&&is.alternate===null&&n(J,ie),X=f(is,X,ye),Ve===null?ce=is:Ve.sibling=is,Ve=is,ie=Oe}if(ke.done)return a(J,ie),Ie&&ca(J,ye),ce;if(ie===null){for(;!ke.done;ye++,ke=it.next())ke=At(J,ke.value,bt),ke!==null&&(X=f(ke,X,ye),Ve===null?ce=ke:Ve.sibling=ke,Ve=ke);return Ie&&ca(J,ye),ce}for(ie=r(ie);!ke.done;ye++,ke=it.next())ke=mt(ie,J,ye,ke.value,bt),ke!==null&&(t&&ke.alternate!==null&&ie.delete(ke.key===null?ye:ke.key),X=f(ke,X,ye),Ve===null?ce=ke:Ve.sibling=ke,Ve=ke);return t&&ie.forEach(function(my){return n(J,my)}),Ie&&ca(J,ye),ce}function sn(J,X,it,bt){if(typeof it=="object"&&it!==null&&it.type===w&&it.key===null&&(it=it.props.children),typeof it=="object"&&it!==null){switch(it.$$typeof){case M:t:{for(var ce=it.key;X!==null;){if(X.key===ce){if(ce=it.type,ce===w){if(X.tag===7){a(J,X.sibling),bt=c(X,it.props.children),bt.return=J,J=bt;break t}}else if(X.elementType===ce||typeof ce=="object"&&ce!==null&&ce.$$typeof===q&&As(ce)===X.type){a(J,X.sibling),bt=c(X,it.props),mo(bt,it),bt.return=J,J=bt;break t}a(J,X);break}else n(J,X);X=X.sibling}it.type===w?(bt=Ss(it.props.children,J.mode,bt,it.key),bt.return=J,J=bt):(bt=gl(it.type,it.key,it.props,null,J.mode,bt),mo(bt,it),bt.return=J,J=bt)}return _(J);case T:t:{for(ce=it.key;X!==null;){if(X.key===ce)if(X.tag===4&&X.stateNode.containerInfo===it.containerInfo&&X.stateNode.implementation===it.implementation){a(J,X.sibling),bt=c(X,it.children||[]),bt.return=J,J=bt;break t}else{a(J,X);break}else n(J,X);X=X.sibling}bt=yu(it,J.mode,bt),bt.return=J,J=bt}return _(J);case q:return it=As(it),sn(J,X,it,bt)}if(Et(it))return te(J,X,it,bt);if(ft(it)){if(ce=ft(it),typeof ce!="function")throw Error(s(150));return it=ce.call(it),ue(J,X,it,bt)}if(typeof it.then=="function")return sn(J,X,El(it),bt);if(it.$$typeof===N)return sn(J,X,xl(J,it),bt);bl(J,it)}return typeof it=="string"&&it!==""||typeof it=="number"||typeof it=="bigint"?(it=""+it,X!==null&&X.tag===6?(a(J,X.sibling),bt=c(X,it),bt.return=J,J=bt):(a(J,X),bt=xu(it,J.mode,bt),bt.return=J,J=bt),_(J)):a(J,X)}return function(J,X,it,bt){try{po=0;var ce=sn(J,X,it,bt);return or=null,ce}catch(ie){if(ie===rr||ie===Sl)throw ie;var Ve=xi(29,ie,null,J.mode);return Ve.lanes=bt,Ve.return=J,Ve}finally{}}}var Rs=Np(!0),Op=Np(!1),Ha=!1;function Lu(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Nu(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function Ga(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Va(t,n,a){var r=t.updateQueue;if(r===null)return null;if(r=r.shared,(We&2)!==0){var c=r.pending;return c===null?n.next=n:(n.next=c.next,c.next=n),r.pending=n,n=ml(t),_p(t,null,a),n}return pl(t,r,n,a),ml(t)}function go(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var r=n.lanes;r&=t.pendingLanes,a|=r,n.lanes=a,Kn(t,a)}}function Ou(t,n){var a=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,a===r)){var c=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var _={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?c=f=_:f=f.next=_,a=a.next}while(a!==null);f===null?c=f=n:f=f.next=n}else c=f=n;a={baseState:r.baseState,firstBaseUpdate:c,lastBaseUpdate:f,shared:r.shared,callbacks:r.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var zu=!1;function _o(){if(zu){var t=sr;if(t!==null)throw t}}function vo(t,n,a,r){zu=!1;var c=t.updateQueue;Ha=!1;var f=c.firstBaseUpdate,_=c.lastBaseUpdate,b=c.shared.pending;if(b!==null){c.shared.pending=null;var B=b,at=B.next;B.next=null,_===null?f=at:_.next=at,_=B;var St=t.alternate;St!==null&&(St=St.updateQueue,b=St.lastBaseUpdate,b!==_&&(b===null?St.firstBaseUpdate=at:b.next=at,St.lastBaseUpdate=B))}if(f!==null){var At=c.baseState;_=0,St=at=B=null,b=f;do{var ct=b.lane&-536870913,mt=ct!==b.lane;if(mt?(Ne&ct)===ct:(r&ct)===ct){ct!==0&&ct===ar&&(zu=!0),St!==null&&(St=St.next={lane:0,tag:b.tag,payload:b.payload,callback:null,next:null});t:{var te=t,ue=b;ct=n;var sn=a;switch(ue.tag){case 1:if(te=ue.payload,typeof te=="function"){At=te.call(sn,At,ct);break t}At=te;break t;case 3:te.flags=te.flags&-65537|128;case 0:if(te=ue.payload,ct=typeof te=="function"?te.call(sn,At,ct):te,ct==null)break t;At=x({},At,ct);break t;case 2:Ha=!0}}ct=b.callback,ct!==null&&(t.flags|=64,mt&&(t.flags|=8192),mt=c.callbacks,mt===null?c.callbacks=[ct]:mt.push(ct))}else mt={lane:ct,tag:b.tag,payload:b.payload,callback:b.callback,next:null},St===null?(at=St=mt,B=At):St=St.next=mt,_|=ct;if(b=b.next,b===null){if(b=c.shared.pending,b===null)break;mt=b,b=mt.next,mt.next=null,c.lastBaseUpdate=mt,c.shared.pending=null}}while(!0);St===null&&(B=At),c.baseState=B,c.firstBaseUpdate=at,c.lastBaseUpdate=St,f===null&&(c.shared.lanes=0),Ya|=_,t.lanes=_,t.memoizedState=At}}function zp(t,n){if(typeof t!="function")throw Error(s(191,t));t.call(n)}function Pp(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)zp(a[t],n)}var lr=L(null),Tl=L(0);function Ip(t,n){t=ya,Nt(Tl,t),Nt(lr,n),ya=t|n.baseLanes}function Pu(){Nt(Tl,ya),Nt(lr,lr.current)}function Iu(){ya=Tl.current,rt(lr),rt(Tl)}var yi=L(null),zi=null;function ka(t){var n=t.alternate;Nt(An,An.current&1),Nt(yi,t),zi===null&&(n===null||lr.current!==null||n.memoizedState!==null)&&(zi=t)}function Bu(t){Nt(An,An.current),Nt(yi,t),zi===null&&(zi=t)}function Bp(t){t.tag===22?(Nt(An,An.current),Nt(yi,t),zi===null&&(zi=t)):Xa()}function Xa(){Nt(An,An.current),Nt(yi,yi.current)}function Si(t){rt(yi),zi===t&&(zi=null),rt(An)}var An=L(0);function Al(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||qf(a)||Wf(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var da=0,_e=null,nn=null,Un=null,wl=!1,cr=!1,Cs=!1,Rl=0,xo=0,ur=null,sx=0;function En(){throw Error(s(321))}function Fu(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!vi(t[a],n[a]))return!1;return!0}function Hu(t,n,a,r,c,f){return da=f,_e=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,z.H=t===null||t.memoizedState===null?Sm:ef,Cs=!1,f=a(r,c),Cs=!1,cr&&(f=Hp(n,a,r,c)),Fp(t),f}function Fp(t){z.H=Mo;var n=nn!==null&&nn.next!==null;if(da=0,Un=nn=_e=null,wl=!1,xo=0,ur=null,n)throw Error(s(300));t===null||Ln||(t=t.dependencies,t!==null&&vl(t)&&(Ln=!0))}function Hp(t,n,a,r){_e=t;var c=0;do{if(cr&&(ur=null),xo=0,cr=!1,25<=c)throw Error(s(301));if(c+=1,Un=nn=null,t.updateQueue!=null){var f=t.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}z.H=Mm,f=n(a,r)}while(cr);return f}function rx(){var t=z.H,n=t.useState()[0];return n=typeof n.then=="function"?yo(n):n,t=t.useState()[0],(nn!==null?nn.memoizedState:null)!==t&&(_e.flags|=1024),n}function Gu(){var t=Rl!==0;return Rl=0,t}function Vu(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function ku(t){if(wl){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}wl=!1}da=0,Un=nn=_e=null,cr=!1,xo=Rl=0,ur=null}function oi(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Un===null?_e.memoizedState=Un=t:Un=Un.next=t,Un}function wn(){if(nn===null){var t=_e.alternate;t=t!==null?t.memoizedState:null}else t=nn.next;var n=Un===null?_e.memoizedState:Un.next;if(n!==null)Un=n,nn=t;else{if(t===null)throw _e.alternate===null?Error(s(467)):Error(s(310));nn=t,t={memoizedState:nn.memoizedState,baseState:nn.baseState,baseQueue:nn.baseQueue,queue:nn.queue,next:null},Un===null?_e.memoizedState=Un=t:Un=Un.next=t}return Un}function Cl(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function yo(t){var n=xo;return xo+=1,ur===null&&(ur=[]),t=Dp(ur,t,n),n=_e,(Un===null?n.memoizedState:Un.next)===null&&(n=n.alternate,z.H=n===null||n.memoizedState===null?Sm:ef),t}function Dl(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return yo(t);if(t.$$typeof===N)return Wn(t)}throw Error(s(438,String(t)))}function Xu(t){var n=null,a=_e.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var r=_e.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(n={data:r.data.map(function(c){return c.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Cl(),_e.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),r=0;r<t;r++)a[r]=C;return n.index++,a}function ha(t,n){return typeof n=="function"?n(t):n}function Ul(t){var n=wn();return qu(n,nn,t)}function qu(t,n,a){var r=t.queue;if(r===null)throw Error(s(311));r.lastRenderedReducer=a;var c=t.baseQueue,f=r.pending;if(f!==null){if(c!==null){var _=c.next;c.next=f.next,f.next=_}n.baseQueue=c=f,r.pending=null}if(f=t.baseState,c===null)t.memoizedState=f;else{n=c.next;var b=_=null,B=null,at=n,St=!1;do{var At=at.lane&-536870913;if(At!==at.lane?(Ne&At)===At:(da&At)===At){var ct=at.revertLane;if(ct===0)B!==null&&(B=B.next={lane:0,revertLane:0,gesture:null,action:at.action,hasEagerState:at.hasEagerState,eagerState:at.eagerState,next:null}),At===ar&&(St=!0);else if((da&ct)===ct){at=at.next,ct===ar&&(St=!0);continue}else At={lane:0,revertLane:at.revertLane,gesture:null,action:at.action,hasEagerState:at.hasEagerState,eagerState:at.eagerState,next:null},B===null?(b=B=At,_=f):B=B.next=At,_e.lanes|=ct,Ya|=ct;At=at.action,Cs&&a(f,At),f=at.hasEagerState?at.eagerState:a(f,At)}else ct={lane:At,revertLane:at.revertLane,gesture:at.gesture,action:at.action,hasEagerState:at.hasEagerState,eagerState:at.eagerState,next:null},B===null?(b=B=ct,_=f):B=B.next=ct,_e.lanes|=At,Ya|=At;at=at.next}while(at!==null&&at!==n);if(B===null?_=f:B.next=b,!vi(f,t.memoizedState)&&(Ln=!0,St&&(a=sr,a!==null)))throw a;t.memoizedState=f,t.baseState=_,t.baseQueue=B,r.lastRenderedState=f}return c===null&&(r.lanes=0),[t.memoizedState,r.dispatch]}function Wu(t){var n=wn(),a=n.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=t;var r=a.dispatch,c=a.pending,f=n.memoizedState;if(c!==null){a.pending=null;var _=c=c.next;do f=t(f,_.action),_=_.next;while(_!==c);vi(f,n.memoizedState)||(Ln=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,r]}function Gp(t,n,a){var r=_e,c=wn(),f=Ie;if(f){if(a===void 0)throw Error(s(407));a=a()}else a=n();var _=!vi((nn||c).memoizedState,a);if(_&&(c.memoizedState=a,Ln=!0),c=c.queue,Zu(Xp.bind(null,r,c,t),[t]),c.getSnapshot!==n||_||Un!==null&&Un.memoizedState.tag&1){if(r.flags|=2048,fr(9,{destroy:void 0},kp.bind(null,r,c,a,n),null),dn===null)throw Error(s(349));f||(da&127)!==0||Vp(r,n,a)}return a}function Vp(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=_e.updateQueue,n===null?(n=Cl(),_e.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function kp(t,n,a,r){n.value=a,n.getSnapshot=r,qp(n)&&Wp(t)}function Xp(t,n,a){return a(function(){qp(n)&&Wp(t)})}function qp(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!vi(t,a)}catch{return!0}}function Wp(t){var n=ys(t,2);n!==null&&mi(n,t,2)}function Yu(t){var n=oi();if(typeof t=="function"){var a=t;if(t=a(),Cs){kt(!0);try{a()}finally{kt(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ha,lastRenderedState:t},n}function Yp(t,n,a,r){return t.baseState=a,qu(t,nn,typeof r=="function"?r:ha)}function ox(t,n,a,r,c){if(Ol(t))throw Error(s(485));if(t=n.action,t!==null){var f={payload:c,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(_){f.listeners.push(_)}};z.T!==null?a(!0):f.isTransition=!1,r(f),a=n.pending,a===null?(f.next=n.pending=f,jp(n,f)):(f.next=a.next,n.pending=a.next=f)}}function jp(t,n){var a=n.action,r=n.payload,c=t.state;if(n.isTransition){var f=z.T,_={};z.T=_;try{var b=a(c,r),B=z.S;B!==null&&B(_,b),Zp(t,n,b)}catch(at){ju(t,n,at)}finally{f!==null&&_.types!==null&&(f.types=_.types),z.T=f}}else try{f=a(c,r),Zp(t,n,f)}catch(at){ju(t,n,at)}}function Zp(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(r){Kp(t,n,r)},function(r){return ju(t,n,r)}):Kp(t,n,a)}function Kp(t,n,a){n.status="fulfilled",n.value=a,Qp(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,jp(t,a)))}function ju(t,n,a){var r=t.pending;if(t.pending=null,r!==null){r=r.next;do n.status="rejected",n.reason=a,Qp(n),n=n.next;while(n!==r)}t.action=null}function Qp(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function Jp(t,n){return n}function $p(t,n){if(Ie){var a=dn.formState;if(a!==null){t:{var r=_e;if(Ie){if(gn){e:{for(var c=gn,f=Oi;c.nodeType!==8;){if(!f){c=null;break e}if(c=Pi(c.nextSibling),c===null){c=null;break e}}f=c.data,c=f==="F!"||f==="F"?c:null}if(c){gn=Pi(c.nextSibling),r=c.data==="F!";break t}}Ba(r)}r=!1}r&&(n=a[0])}}return a=oi(),a.memoizedState=a.baseState=n,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jp,lastRenderedState:n},a.queue=r,a=vm.bind(null,_e,r),r.dispatch=a,r=Yu(!1),f=tf.bind(null,_e,!1,r.queue),r=oi(),c={state:n,dispatch:null,action:t,pending:null},r.queue=c,a=ox.bind(null,_e,c,f,a),c.dispatch=a,r.memoizedState=t,[n,a,!1]}function tm(t){var n=wn();return em(n,nn,t)}function em(t,n,a){if(n=qu(t,n,Jp)[0],t=Ul(ha)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var r=yo(n)}catch(_){throw _===rr?Sl:_}else r=n;n=wn();var c=n.queue,f=c.dispatch;return a!==n.memoizedState&&(_e.flags|=2048,fr(9,{destroy:void 0},lx.bind(null,c,a),null)),[r,f,t]}function lx(t,n){t.action=n}function nm(t){var n=wn(),a=nn;if(a!==null)return em(n,a,t);wn(),n=n.memoizedState,a=wn();var r=a.queue.dispatch;return a.memoizedState=t,[n,r,!1]}function fr(t,n,a,r){return t={tag:t,create:a,deps:r,inst:n,next:null},n=_e.updateQueue,n===null&&(n=Cl(),_e.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(r=a.next,a.next=t,t.next=r,n.lastEffect=t),t}function im(){return wn().memoizedState}function Ll(t,n,a,r){var c=oi();_e.flags|=t,c.memoizedState=fr(1|n,{destroy:void 0},a,r===void 0?null:r)}function Nl(t,n,a,r){var c=wn();r=r===void 0?null:r;var f=c.memoizedState.inst;nn!==null&&r!==null&&Fu(r,nn.memoizedState.deps)?c.memoizedState=fr(n,f,a,r):(_e.flags|=t,c.memoizedState=fr(1|n,f,a,r))}function am(t,n){Ll(8390656,8,t,n)}function Zu(t,n){Nl(2048,8,t,n)}function cx(t){_e.flags|=4;var n=_e.updateQueue;if(n===null)n=Cl(),_e.updateQueue=n,n.events=[t];else{var a=n.events;a===null?n.events=[t]:a.push(t)}}function sm(t){var n=wn().memoizedState;return cx({ref:n,nextImpl:t}),function(){if((We&2)!==0)throw Error(s(440));return n.impl.apply(void 0,arguments)}}function rm(t,n){return Nl(4,2,t,n)}function om(t,n){return Nl(4,4,t,n)}function lm(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function cm(t,n,a){a=a!=null?a.concat([t]):null,Nl(4,4,lm.bind(null,n,t),a)}function Ku(){}function um(t,n){var a=wn();n=n===void 0?null:n;var r=a.memoizedState;return n!==null&&Fu(n,r[1])?r[0]:(a.memoizedState=[t,n],t)}function fm(t,n){var a=wn();n=n===void 0?null:n;var r=a.memoizedState;if(n!==null&&Fu(n,r[1]))return r[0];if(r=t(),Cs){kt(!0);try{t()}finally{kt(!1)}}return a.memoizedState=[r,n],r}function Qu(t,n,a){return a===void 0||(da&1073741824)!==0&&(Ne&261930)===0?t.memoizedState=n:(t.memoizedState=a,t=d0(),_e.lanes|=t,Ya|=t,a)}function dm(t,n,a,r){return vi(a,n)?a:lr.current!==null?(t=Qu(t,a,r),vi(t,n)||(Ln=!0),t):(da&42)===0||(da&1073741824)!==0&&(Ne&261930)===0?(Ln=!0,t.memoizedState=a):(t=d0(),_e.lanes|=t,Ya|=t,n)}function hm(t,n,a,r,c){var f=$.p;$.p=f!==0&&8>f?f:8;var _=z.T,b={};z.T=b,tf(t,!1,n,a);try{var B=c(),at=z.S;if(at!==null&&at(b,B),B!==null&&typeof B=="object"&&typeof B.then=="function"){var St=ax(B,r);So(t,n,St,bi(t))}else So(t,n,r,bi(t))}catch(At){So(t,n,{then:function(){},status:"rejected",reason:At},bi())}finally{$.p=f,_!==null&&b.types!==null&&(_.types=b.types),z.T=_}}function ux(){}function Ju(t,n,a,r){if(t.tag!==5)throw Error(s(476));var c=pm(t).queue;hm(t,c,n,tt,a===null?ux:function(){return mm(t),a(r)})}function pm(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:tt,baseState:tt,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ha,lastRenderedState:tt},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ha,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function mm(t){var n=pm(t);n.next===null&&(n=t.alternate.memoizedState),So(t,n.next.queue,{},bi())}function $u(){return Wn(Bo)}function gm(){return wn().memoizedState}function _m(){return wn().memoizedState}function fx(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=bi();t=Ga(a);var r=Va(n,t,a);r!==null&&(mi(r,n,a),go(r,n,a)),n={cache:Ru()},t.payload=n;return}n=n.return}}function dx(t,n,a){var r=bi();a={lane:r,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Ol(t)?xm(n,a):(a=_u(t,n,a,r),a!==null&&(mi(a,t,r),ym(a,n,r)))}function vm(t,n,a){var r=bi();So(t,n,a,r)}function So(t,n,a,r){var c={lane:r,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Ol(t))xm(n,c);else{var f=t.alternate;if(t.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var _=n.lastRenderedState,b=f(_,a);if(c.hasEagerState=!0,c.eagerState=b,vi(b,_))return pl(t,n,c,0),dn===null&&hl(),!1}catch{}finally{}if(a=_u(t,n,c,r),a!==null)return mi(a,t,r),ym(a,n,r),!0}return!1}function tf(t,n,a,r){if(r={lane:2,revertLane:Nf(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Ol(t)){if(n)throw Error(s(479))}else n=_u(t,a,r,2),n!==null&&mi(n,t,2)}function Ol(t){var n=t.alternate;return t===_e||n!==null&&n===_e}function xm(t,n){cr=wl=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function ym(t,n,a){if((a&4194048)!==0){var r=n.lanes;r&=t.pendingLanes,a|=r,n.lanes=a,Kn(t,a)}}var Mo={readContext:Wn,use:Dl,useCallback:En,useContext:En,useEffect:En,useImperativeHandle:En,useLayoutEffect:En,useInsertionEffect:En,useMemo:En,useReducer:En,useRef:En,useState:En,useDebugValue:En,useDeferredValue:En,useTransition:En,useSyncExternalStore:En,useId:En,useHostTransitionStatus:En,useFormState:En,useActionState:En,useOptimistic:En,useMemoCache:En,useCacheRefresh:En};Mo.useEffectEvent=En;var Sm={readContext:Wn,use:Dl,useCallback:function(t,n){return oi().memoizedState=[t,n===void 0?null:n],t},useContext:Wn,useEffect:am,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,Ll(4194308,4,lm.bind(null,n,t),a)},useLayoutEffect:function(t,n){return Ll(4194308,4,t,n)},useInsertionEffect:function(t,n){Ll(4,2,t,n)},useMemo:function(t,n){var a=oi();n=n===void 0?null:n;var r=t();if(Cs){kt(!0);try{t()}finally{kt(!1)}}return a.memoizedState=[r,n],r},useReducer:function(t,n,a){var r=oi();if(a!==void 0){var c=a(n);if(Cs){kt(!0);try{a(n)}finally{kt(!1)}}}else c=n;return r.memoizedState=r.baseState=c,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:c},r.queue=t,t=t.dispatch=dx.bind(null,_e,t),[r.memoizedState,t]},useRef:function(t){var n=oi();return t={current:t},n.memoizedState=t},useState:function(t){t=Yu(t);var n=t.queue,a=vm.bind(null,_e,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:Ku,useDeferredValue:function(t,n){var a=oi();return Qu(a,t,n)},useTransition:function(){var t=Yu(!1);return t=hm.bind(null,_e,t.queue,!0,!1),oi().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var r=_e,c=oi();if(Ie){if(a===void 0)throw Error(s(407));a=a()}else{if(a=n(),dn===null)throw Error(s(349));(Ne&127)!==0||Vp(r,n,a)}c.memoizedState=a;var f={value:a,getSnapshot:n};return c.queue=f,am(Xp.bind(null,r,f,t),[t]),r.flags|=2048,fr(9,{destroy:void 0},kp.bind(null,r,f,a,n),null),a},useId:function(){var t=oi(),n=dn.identifierPrefix;if(Ie){var a=Qi,r=Ki;a=(r&~(1<<32-ae(r)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Rl++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=sx++,n="_"+n+"r_"+a.toString(32)+"_";return t.memoizedState=n},useHostTransitionStatus:$u,useFormState:$p,useActionState:$p,useOptimistic:function(t){var n=oi();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=tf.bind(null,_e,!0,a),a.dispatch=n,[t,n]},useMemoCache:Xu,useCacheRefresh:function(){return oi().memoizedState=fx.bind(null,_e)},useEffectEvent:function(t){var n=oi(),a={impl:t};return n.memoizedState=a,function(){if((We&2)!==0)throw Error(s(440));return a.impl.apply(void 0,arguments)}}},ef={readContext:Wn,use:Dl,useCallback:um,useContext:Wn,useEffect:Zu,useImperativeHandle:cm,useInsertionEffect:rm,useLayoutEffect:om,useMemo:fm,useReducer:Ul,useRef:im,useState:function(){return Ul(ha)},useDebugValue:Ku,useDeferredValue:function(t,n){var a=wn();return dm(a,nn.memoizedState,t,n)},useTransition:function(){var t=Ul(ha)[0],n=wn().memoizedState;return[typeof t=="boolean"?t:yo(t),n]},useSyncExternalStore:Gp,useId:gm,useHostTransitionStatus:$u,useFormState:tm,useActionState:tm,useOptimistic:function(t,n){var a=wn();return Yp(a,nn,t,n)},useMemoCache:Xu,useCacheRefresh:_m};ef.useEffectEvent=sm;var Mm={readContext:Wn,use:Dl,useCallback:um,useContext:Wn,useEffect:Zu,useImperativeHandle:cm,useInsertionEffect:rm,useLayoutEffect:om,useMemo:fm,useReducer:Wu,useRef:im,useState:function(){return Wu(ha)},useDebugValue:Ku,useDeferredValue:function(t,n){var a=wn();return nn===null?Qu(a,t,n):dm(a,nn.memoizedState,t,n)},useTransition:function(){var t=Wu(ha)[0],n=wn().memoizedState;return[typeof t=="boolean"?t:yo(t),n]},useSyncExternalStore:Gp,useId:gm,useHostTransitionStatus:$u,useFormState:nm,useActionState:nm,useOptimistic:function(t,n){var a=wn();return nn!==null?Yp(a,nn,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:Xu,useCacheRefresh:_m};Mm.useEffectEvent=sm;function nf(t,n,a,r){n=t.memoizedState,a=a(r,n),a=a==null?n:x({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var af={enqueueSetState:function(t,n,a){t=t._reactInternals;var r=bi(),c=Ga(r);c.payload=n,a!=null&&(c.callback=a),n=Va(t,c,r),n!==null&&(mi(n,t,r),go(n,t,r))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var r=bi(),c=Ga(r);c.tag=1,c.payload=n,a!=null&&(c.callback=a),n=Va(t,c,r),n!==null&&(mi(n,t,r),go(n,t,r))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=bi(),r=Ga(a);r.tag=2,n!=null&&(r.callback=n),n=Va(t,r,a),n!==null&&(mi(n,t,a),go(n,t,a))}};function Em(t,n,a,r,c,f,_){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,f,_):n.prototype&&n.prototype.isPureReactComponent?!oo(a,r)||!oo(c,f):!0}function bm(t,n,a,r){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,r),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,r),n.state!==t&&af.enqueueReplaceState(n,n.state,null)}function Ds(t,n){var a=n;if("ref"in n){a={};for(var r in n)r!=="ref"&&(a[r]=n[r])}if(t=t.defaultProps){a===n&&(a=x({},a));for(var c in t)a[c]===void 0&&(a[c]=t[c])}return a}function Tm(t){dl(t)}function Am(t){console.error(t)}function wm(t){dl(t)}function zl(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(r){setTimeout(function(){throw r})}}function Rm(t,n,a){try{var r=t.onCaughtError;r(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(c){setTimeout(function(){throw c})}}function sf(t,n,a){return a=Ga(a),a.tag=3,a.payload={element:null},a.callback=function(){zl(t,n)},a}function Cm(t){return t=Ga(t),t.tag=3,t}function Dm(t,n,a,r){var c=a.type.getDerivedStateFromError;if(typeof c=="function"){var f=r.value;t.payload=function(){return c(f)},t.callback=function(){Rm(n,a,r)}}var _=a.stateNode;_!==null&&typeof _.componentDidCatch=="function"&&(t.callback=function(){Rm(n,a,r),typeof c!="function"&&(ja===null?ja=new Set([this]):ja.add(this));var b=r.stack;this.componentDidCatch(r.value,{componentStack:b!==null?b:""})})}function hx(t,n,a,r,c){if(a.flags|=32768,r!==null&&typeof r=="object"&&typeof r.then=="function"){if(n=a.alternate,n!==null&&ir(n,a,c,!0),a=yi.current,a!==null){switch(a.tag){case 31:case 13:return zi===null?Yl():a.alternate===null&&bn===0&&(bn=3),a.flags&=-257,a.flags|=65536,a.lanes=c,r===Ml?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([r]):n.add(r),Df(t,r,c)),!1;case 22:return a.flags|=65536,r===Ml?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([r])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([r]):a.add(r)),Df(t,r,c)),!1}throw Error(s(435,a.tag))}return Df(t,r,c),Yl(),!1}if(Ie)return n=yi.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=c,r!==Eu&&(t=Error(s(422),{cause:r}),uo(Ui(t,a)))):(r!==Eu&&(n=Error(s(423),{cause:r}),uo(Ui(n,a))),t=t.current.alternate,t.flags|=65536,c&=-c,t.lanes|=c,r=Ui(r,a),c=sf(t.stateNode,r,c),Ou(t,c),bn!==4&&(bn=2)),!1;var f=Error(s(520),{cause:r});if(f=Ui(f,a),Do===null?Do=[f]:Do.push(f),bn!==4&&(bn=2),n===null)return!0;r=Ui(r,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=c&-c,a.lanes|=t,t=sf(a.stateNode,r,t),Ou(a,t),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(ja===null||!ja.has(f))))return a.flags|=65536,c&=-c,a.lanes|=c,c=Cm(c),Dm(c,t,a,r),Ou(a,c),!1}a=a.return}while(a!==null);return!1}var rf=Error(s(461)),Ln=!1;function Yn(t,n,a,r){n.child=t===null?Op(n,null,a,r):Rs(n,t.child,a,r)}function Um(t,n,a,r,c){a=a.render;var f=n.ref;if("ref"in r){var _={};for(var b in r)b!=="ref"&&(_[b]=r[b])}else _=r;return bs(n),r=Hu(t,n,a,_,f,c),b=Gu(),t!==null&&!Ln?(Vu(t,n,c),pa(t,n,c)):(Ie&&b&&Su(n),n.flags|=1,Yn(t,n,r,c),n.child)}function Lm(t,n,a,r,c){if(t===null){var f=a.type;return typeof f=="function"&&!vu(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,Nm(t,n,f,r,c)):(t=gl(a.type,null,r,n,n.mode,c),t.ref=n.ref,t.return=n,n.child=t)}if(f=t.child,!pf(t,c)){var _=f.memoizedProps;if(a=a.compare,a=a!==null?a:oo,a(_,r)&&t.ref===n.ref)return pa(t,n,c)}return n.flags|=1,t=la(f,r),t.ref=n.ref,t.return=n,n.child=t}function Nm(t,n,a,r,c){if(t!==null){var f=t.memoizedProps;if(oo(f,r)&&t.ref===n.ref)if(Ln=!1,n.pendingProps=r=f,pf(t,c))(t.flags&131072)!==0&&(Ln=!0);else return n.lanes=t.lanes,pa(t,n,c)}return of(t,n,a,r,c)}function Om(t,n,a,r){var c=r.children,f=t!==null?t.memoizedState:null;if(t===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,t!==null){for(r=n.child=t.child,c=0;r!==null;)c=c|r.lanes|r.childLanes,r=r.sibling;r=c&~f}else r=0,n.child=null;return zm(t,n,f,a,r)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&yl(n,f!==null?f.cachePool:null),f!==null?Ip(n,f):Pu(),Bp(n);else return r=n.lanes=536870912,zm(t,n,f!==null?f.baseLanes|a:a,a,r)}else f!==null?(yl(n,f.cachePool),Ip(n,f),Xa(),n.memoizedState=null):(t!==null&&yl(n,null),Pu(),Xa());return Yn(t,n,c,a),n.child}function Eo(t,n){return t!==null&&t.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function zm(t,n,a,r,c){var f=Du();return f=f===null?null:{parent:Dn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},t!==null&&yl(n,null),Pu(),Bp(n),t!==null&&ir(t,n,r,!0),n.childLanes=c,null}function Pl(t,n){return n=Bl({mode:n.mode,children:n.children},t.mode),n.ref=t.ref,t.child=n,n.return=t,n}function Pm(t,n,a){return Rs(n,t.child,null,a),t=Pl(n,n.pendingProps),t.flags|=2,Si(n),n.memoizedState=null,t}function px(t,n,a){var r=n.pendingProps,c=(n.flags&128)!==0;if(n.flags&=-129,t===null){if(Ie){if(r.mode==="hidden")return t=Pl(n,r),n.lanes=536870912,Eo(null,t);if(Bu(n),(t=gn)?(t=j0(t,Oi),t=t!==null&&t.data==="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Pa!==null?{id:Ki,overflow:Qi}:null,retryLane:536870912,hydrationErrors:null},a=xp(t),a.return=n,n.child=a,qn=n,gn=null)):t=null,t===null)throw Ba(n);return n.lanes=536870912,null}return Pl(n,r)}var f=t.memoizedState;if(f!==null){var _=f.dehydrated;if(Bu(n),c)if(n.flags&256)n.flags&=-257,n=Pm(t,n,a);else if(n.memoizedState!==null)n.child=t.child,n.flags|=128,n=null;else throw Error(s(558));else if(Ln||ir(t,n,a,!1),c=(a&t.childLanes)!==0,Ln||c){if(r=dn,r!==null&&(_=Fn(r,a),_!==0&&_!==f.retryLane))throw f.retryLane=_,ys(t,_),mi(r,t,_),rf;Yl(),n=Pm(t,n,a)}else t=f.treeContext,gn=Pi(_.nextSibling),qn=n,Ie=!0,Ia=null,Oi=!1,t!==null&&Mp(n,t),n=Pl(n,r),n.flags|=4096;return n}return t=la(t.child,{mode:r.mode,children:r.children}),t.ref=n.ref,n.child=t,t.return=n,t}function Il(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function of(t,n,a,r,c){return bs(n),a=Hu(t,n,a,r,void 0,c),r=Gu(),t!==null&&!Ln?(Vu(t,n,c),pa(t,n,c)):(Ie&&r&&Su(n),n.flags|=1,Yn(t,n,a,c),n.child)}function Im(t,n,a,r,c,f){return bs(n),n.updateQueue=null,a=Hp(n,r,a,c),Fp(t),r=Gu(),t!==null&&!Ln?(Vu(t,n,f),pa(t,n,f)):(Ie&&r&&Su(n),n.flags|=1,Yn(t,n,a,f),n.child)}function Bm(t,n,a,r,c){if(bs(n),n.stateNode===null){var f=$s,_=a.contextType;typeof _=="object"&&_!==null&&(f=Wn(_)),f=new a(r,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=af,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=r,f.state=n.memoizedState,f.refs={},Lu(n),_=a.contextType,f.context=typeof _=="object"&&_!==null?Wn(_):$s,f.state=n.memoizedState,_=a.getDerivedStateFromProps,typeof _=="function"&&(nf(n,a,_,r),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(_=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),_!==f.state&&af.enqueueReplaceState(f,f.state,null),vo(n,r,f,c),_o(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),r=!0}else if(t===null){f=n.stateNode;var b=n.memoizedProps,B=Ds(a,b);f.props=B;var at=f.context,St=a.contextType;_=$s,typeof St=="object"&&St!==null&&(_=Wn(St));var At=a.getDerivedStateFromProps;St=typeof At=="function"||typeof f.getSnapshotBeforeUpdate=="function",b=n.pendingProps!==b,St||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(b||at!==_)&&bm(n,f,r,_),Ha=!1;var ct=n.memoizedState;f.state=ct,vo(n,r,f,c),_o(),at=n.memoizedState,b||ct!==at||Ha?(typeof At=="function"&&(nf(n,a,At,r),at=n.memoizedState),(B=Ha||Em(n,a,B,r,ct,at,_))?(St||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=at),f.props=r,f.state=at,f.context=_,r=B):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),r=!1)}else{f=n.stateNode,Nu(t,n),_=n.memoizedProps,St=Ds(a,_),f.props=St,At=n.pendingProps,ct=f.context,at=a.contextType,B=$s,typeof at=="object"&&at!==null&&(B=Wn(at)),b=a.getDerivedStateFromProps,(at=typeof b=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(_!==At||ct!==B)&&bm(n,f,r,B),Ha=!1,ct=n.memoizedState,f.state=ct,vo(n,r,f,c),_o();var mt=n.memoizedState;_!==At||ct!==mt||Ha||t!==null&&t.dependencies!==null&&vl(t.dependencies)?(typeof b=="function"&&(nf(n,a,b,r),mt=n.memoizedState),(St=Ha||Em(n,a,St,r,ct,mt,B)||t!==null&&t.dependencies!==null&&vl(t.dependencies))?(at||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(r,mt,B),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(r,mt,B)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||_===t.memoizedProps&&ct===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===t.memoizedProps&&ct===t.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=mt),f.props=r,f.state=mt,f.context=B,r=St):(typeof f.componentDidUpdate!="function"||_===t.memoizedProps&&ct===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===t.memoizedProps&&ct===t.memoizedState||(n.flags|=1024),r=!1)}return f=r,Il(t,n),r=(n.flags&128)!==0,f||r?(f=n.stateNode,a=r&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,t!==null&&r?(n.child=Rs(n,t.child,null,c),n.child=Rs(n,null,a,c)):Yn(t,n,a,c),n.memoizedState=f.state,t=n.child):t=pa(t,n,c),t}function Fm(t,n,a,r){return Ms(),n.flags|=256,Yn(t,n,a,r),n.child}var lf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function cf(t){return{baseLanes:t,cachePool:Rp()}}function uf(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=Ei),t}function Hm(t,n,a){var r=n.pendingProps,c=!1,f=(n.flags&128)!==0,_;if((_=f)||(_=t!==null&&t.memoizedState===null?!1:(An.current&2)!==0),_&&(c=!0,n.flags&=-129),_=(n.flags&32)!==0,n.flags&=-33,t===null){if(Ie){if(c?ka(n):Xa(),(t=gn)?(t=j0(t,Oi),t=t!==null&&t.data!=="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Pa!==null?{id:Ki,overflow:Qi}:null,retryLane:536870912,hydrationErrors:null},a=xp(t),a.return=n,n.child=a,qn=n,gn=null)):t=null,t===null)throw Ba(n);return Wf(t)?n.lanes=32:n.lanes=536870912,null}var b=r.children;return r=r.fallback,c?(Xa(),c=n.mode,b=Bl({mode:"hidden",children:b},c),r=Ss(r,c,a,null),b.return=n,r.return=n,b.sibling=r,n.child=b,r=n.child,r.memoizedState=cf(a),r.childLanes=uf(t,_,a),n.memoizedState=lf,Eo(null,r)):(ka(n),ff(n,b))}var B=t.memoizedState;if(B!==null&&(b=B.dehydrated,b!==null)){if(f)n.flags&256?(ka(n),n.flags&=-257,n=df(t,n,a)):n.memoizedState!==null?(Xa(),n.child=t.child,n.flags|=128,n=null):(Xa(),b=r.fallback,c=n.mode,r=Bl({mode:"visible",children:r.children},c),b=Ss(b,c,a,null),b.flags|=2,r.return=n,b.return=n,r.sibling=b,n.child=r,Rs(n,t.child,null,a),r=n.child,r.memoizedState=cf(a),r.childLanes=uf(t,_,a),n.memoizedState=lf,n=Eo(null,r));else if(ka(n),Wf(b)){if(_=b.nextSibling&&b.nextSibling.dataset,_)var at=_.dgst;_=at,r=Error(s(419)),r.stack="",r.digest=_,uo({value:r,source:null,stack:null}),n=df(t,n,a)}else if(Ln||ir(t,n,a,!1),_=(a&t.childLanes)!==0,Ln||_){if(_=dn,_!==null&&(r=Fn(_,a),r!==0&&r!==B.retryLane))throw B.retryLane=r,ys(t,r),mi(_,t,r),rf;qf(b)||Yl(),n=df(t,n,a)}else qf(b)?(n.flags|=192,n.child=t.child,n=null):(t=B.treeContext,gn=Pi(b.nextSibling),qn=n,Ie=!0,Ia=null,Oi=!1,t!==null&&Mp(n,t),n=ff(n,r.children),n.flags|=4096);return n}return c?(Xa(),b=r.fallback,c=n.mode,B=t.child,at=B.sibling,r=la(B,{mode:"hidden",children:r.children}),r.subtreeFlags=B.subtreeFlags&65011712,at!==null?b=la(at,b):(b=Ss(b,c,a,null),b.flags|=2),b.return=n,r.return=n,r.sibling=b,n.child=r,Eo(null,r),r=n.child,b=t.child.memoizedState,b===null?b=cf(a):(c=b.cachePool,c!==null?(B=Dn._currentValue,c=c.parent!==B?{parent:B,pool:B}:c):c=Rp(),b={baseLanes:b.baseLanes|a,cachePool:c}),r.memoizedState=b,r.childLanes=uf(t,_,a),n.memoizedState=lf,Eo(t.child,r)):(ka(n),a=t.child,t=a.sibling,a=la(a,{mode:"visible",children:r.children}),a.return=n,a.sibling=null,t!==null&&(_=n.deletions,_===null?(n.deletions=[t],n.flags|=16):_.push(t)),n.child=a,n.memoizedState=null,a)}function ff(t,n){return n=Bl({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function Bl(t,n){return t=xi(22,t,null,n),t.lanes=0,t}function df(t,n,a){return Rs(n,t.child,null,a),t=ff(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function Gm(t,n,a){t.lanes|=n;var r=t.alternate;r!==null&&(r.lanes|=n),Au(t.return,n,a)}function hf(t,n,a,r,c,f){var _=t.memoizedState;_===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:a,tailMode:c,treeForkCount:f}:(_.isBackwards=n,_.rendering=null,_.renderingStartTime=0,_.last=r,_.tail=a,_.tailMode=c,_.treeForkCount=f)}function Vm(t,n,a){var r=n.pendingProps,c=r.revealOrder,f=r.tail;r=r.children;var _=An.current,b=(_&2)!==0;if(b?(_=_&1|2,n.flags|=128):_&=1,Nt(An,_),Yn(t,n,r,a),r=Ie?co:0,!b&&t!==null&&(t.flags&128)!==0)t:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Gm(t,a,n);else if(t.tag===19)Gm(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break t;for(;t.sibling===null;){if(t.return===null||t.return===n)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(c){case"forwards":for(a=n.child,c=null;a!==null;)t=a.alternate,t!==null&&Al(t)===null&&(c=a),a=a.sibling;a=c,a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null),hf(n,!1,c,a,f,r);break;case"backwards":case"unstable_legacy-backwards":for(a=null,c=n.child,n.child=null;c!==null;){if(t=c.alternate,t!==null&&Al(t)===null){n.child=c;break}t=c.sibling,c.sibling=a,a=c,c=t}hf(n,!0,a,null,f,r);break;case"together":hf(n,!1,null,null,void 0,r);break;default:n.memoizedState=null}return n.child}function pa(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),Ya|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(ir(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(s(153));if(n.child!==null){for(t=n.child,a=la(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=la(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function pf(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&vl(t)))}function mx(t,n,a){switch(n.tag){case 3:$t(n,n.stateNode.containerInfo),Fa(n,Dn,t.memoizedState.cache),Ms();break;case 27:case 5:pe(n);break;case 4:$t(n,n.stateNode.containerInfo);break;case 10:Fa(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Bu(n),null;break;case 13:var r=n.memoizedState;if(r!==null)return r.dehydrated!==null?(ka(n),n.flags|=128,null):(a&n.child.childLanes)!==0?Hm(t,n,a):(ka(n),t=pa(t,n,a),t!==null?t.sibling:null);ka(n);break;case 19:var c=(t.flags&128)!==0;if(r=(a&n.childLanes)!==0,r||(ir(t,n,a,!1),r=(a&n.childLanes)!==0),c){if(r)return Vm(t,n,a);n.flags|=128}if(c=n.memoizedState,c!==null&&(c.rendering=null,c.tail=null,c.lastEffect=null),Nt(An,An.current),r)break;return null;case 22:return n.lanes=0,Om(t,n,a,n.pendingProps);case 24:Fa(n,Dn,t.memoizedState.cache)}return pa(t,n,a)}function km(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)Ln=!0;else{if(!pf(t,a)&&(n.flags&128)===0)return Ln=!1,mx(t,n,a);Ln=(t.flags&131072)!==0}else Ln=!1,Ie&&(n.flags&1048576)!==0&&Sp(n,co,n.index);switch(n.lanes=0,n.tag){case 16:t:{var r=n.pendingProps;if(t=As(n.elementType),n.type=t,typeof t=="function")vu(t)?(r=Ds(t,r),n.tag=1,n=Bm(null,n,t,r,a)):(n.tag=0,n=of(null,n,t,r,a));else{if(t!=null){var c=t.$$typeof;if(c===U){n.tag=11,n=Um(null,n,t,r,a);break t}else if(c===P){n.tag=14,n=Lm(null,n,t,r,a);break t}}throw n=Mt(t)||t,Error(s(306,n,""))}}return n;case 0:return of(t,n,n.type,n.pendingProps,a);case 1:return r=n.type,c=Ds(r,n.pendingProps),Bm(t,n,r,c,a);case 3:t:{if($t(n,n.stateNode.containerInfo),t===null)throw Error(s(387));r=n.pendingProps;var f=n.memoizedState;c=f.element,Nu(t,n),vo(n,r,null,a);var _=n.memoizedState;if(r=_.cache,Fa(n,Dn,r),r!==f.cache&&wu(n,[Dn],a,!0),_o(),r=_.element,f.isDehydrated)if(f={element:r,isDehydrated:!1,cache:_.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=Fm(t,n,r,a);break t}else if(r!==c){c=Ui(Error(s(424)),n),uo(c),n=Fm(t,n,r,a);break t}else{switch(t=n.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(gn=Pi(t.firstChild),qn=n,Ie=!0,Ia=null,Oi=!0,a=Op(n,null,r,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(Ms(),r===c){n=pa(t,n,a);break t}Yn(t,n,r,a)}n=n.child}return n;case 26:return Il(t,n),t===null?(a=tg(n.type,null,n.pendingProps,null))?n.memoizedState=a:Ie||(a=n.type,t=n.pendingProps,r=tc(Bt.current).createElement(a),r[Ze]=n,r[pn]=t,jn(r,a,t),Rt(r),n.stateNode=r):n.memoizedState=tg(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return pe(n),t===null&&Ie&&(r=n.stateNode=Q0(n.type,n.pendingProps,Bt.current),qn=n,Oi=!0,c=gn,Ja(n.type)?(Yf=c,gn=Pi(r.firstChild)):gn=c),Yn(t,n,n.pendingProps.children,a),Il(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&Ie&&((c=r=gn)&&(r=qx(r,n.type,n.pendingProps,Oi),r!==null?(n.stateNode=r,qn=n,gn=Pi(r.firstChild),Oi=!1,c=!0):c=!1),c||Ba(n)),pe(n),c=n.type,f=n.pendingProps,_=t!==null?t.memoizedProps:null,r=f.children,Vf(c,f)?r=null:_!==null&&Vf(c,_)&&(n.flags|=32),n.memoizedState!==null&&(c=Hu(t,n,rx,null,null,a),Bo._currentValue=c),Il(t,n),Yn(t,n,r,a),n.child;case 6:return t===null&&Ie&&((t=a=gn)&&(a=Wx(a,n.pendingProps,Oi),a!==null?(n.stateNode=a,qn=n,gn=null,t=!0):t=!1),t||Ba(n)),null;case 13:return Hm(t,n,a);case 4:return $t(n,n.stateNode.containerInfo),r=n.pendingProps,t===null?n.child=Rs(n,null,r,a):Yn(t,n,r,a),n.child;case 11:return Um(t,n,n.type,n.pendingProps,a);case 7:return Yn(t,n,n.pendingProps,a),n.child;case 8:return Yn(t,n,n.pendingProps.children,a),n.child;case 12:return Yn(t,n,n.pendingProps.children,a),n.child;case 10:return r=n.pendingProps,Fa(n,n.type,r.value),Yn(t,n,r.children,a),n.child;case 9:return c=n.type._context,r=n.pendingProps.children,bs(n),c=Wn(c),r=r(c),n.flags|=1,Yn(t,n,r,a),n.child;case 14:return Lm(t,n,n.type,n.pendingProps,a);case 15:return Nm(t,n,n.type,n.pendingProps,a);case 19:return Vm(t,n,a);case 31:return px(t,n,a);case 22:return Om(t,n,a,n.pendingProps);case 24:return bs(n),r=Wn(Dn),t===null?(c=Du(),c===null&&(c=dn,f=Ru(),c.pooledCache=f,f.refCount++,f!==null&&(c.pooledCacheLanes|=a),c=f),n.memoizedState={parent:r,cache:c},Lu(n),Fa(n,Dn,c)):((t.lanes&a)!==0&&(Nu(t,n),vo(n,null,null,a),_o()),c=t.memoizedState,f=n.memoizedState,c.parent!==r?(c={parent:r,cache:r},n.memoizedState=c,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=c),Fa(n,Dn,r)):(r=f.cache,Fa(n,Dn,r),r!==c.cache&&wu(n,[Dn],a,!0))),Yn(t,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(s(156,n.tag))}function ma(t){t.flags|=4}function mf(t,n,a,r,c){if((n=(t.mode&32)!==0)&&(n=!1),n){if(t.flags|=16777216,(c&335544128)===c)if(t.stateNode.complete)t.flags|=8192;else if(g0())t.flags|=8192;else throw ws=Ml,Uu}else t.flags&=-16777217}function Xm(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!sg(n))if(g0())t.flags|=8192;else throw ws=Ml,Uu}function Fl(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?ze():536870912,t.lanes|=n,mr|=n)}function bo(t,n){if(!Ie)switch(t.tailMode){case"hidden":n=t.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var r=null;a!==null;)a.alternate!==null&&(r=a),a=a.sibling;r===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function _n(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,r=0;if(n)for(var c=t.child;c!==null;)a|=c.lanes|c.childLanes,r|=c.subtreeFlags&65011712,r|=c.flags&65011712,c.return=t,c=c.sibling;else for(c=t.child;c!==null;)a|=c.lanes|c.childLanes,r|=c.subtreeFlags,r|=c.flags,c.return=t,c=c.sibling;return t.subtreeFlags|=r,t.childLanes=a,n}function gx(t,n,a){var r=n.pendingProps;switch(Mu(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return _n(n),null;case 1:return _n(n),null;case 3:return a=n.stateNode,r=null,t!==null&&(r=t.memoizedState.cache),n.memoizedState.cache!==r&&(n.flags|=2048),fa(Dn),Jt(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(nr(n)?ma(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,bu())),_n(n),null;case 26:var c=n.type,f=n.memoizedState;return t===null?(ma(n),f!==null?(_n(n),Xm(n,f)):(_n(n),mf(n,c,null,r,a))):f?f!==t.memoizedState?(ma(n),_n(n),Xm(n,f)):(_n(n),n.flags&=-16777217):(t=t.memoizedProps,t!==r&&ma(n),_n(n),mf(n,c,t,r,a)),null;case 27:if(je(n),a=Bt.current,c=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==r&&ma(n);else{if(!r){if(n.stateNode===null)throw Error(s(166));return _n(n),null}t=K.current,nr(n)?Ep(n):(t=Q0(c,r,a),n.stateNode=t,ma(n))}return _n(n),null;case 5:if(je(n),c=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==r&&ma(n);else{if(!r){if(n.stateNode===null)throw Error(s(166));return _n(n),null}if(f=K.current,nr(n))Ep(n);else{var _=tc(Bt.current);switch(f){case 1:f=_.createElementNS("http://www.w3.org/2000/svg",c);break;case 2:f=_.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;default:switch(c){case"svg":f=_.createElementNS("http://www.w3.org/2000/svg",c);break;case"math":f=_.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;case"script":f=_.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof r.is=="string"?_.createElement("select",{is:r.is}):_.createElement("select"),r.multiple?f.multiple=!0:r.size&&(f.size=r.size);break;default:f=typeof r.is=="string"?_.createElement(c,{is:r.is}):_.createElement(c)}}f[Ze]=n,f[pn]=r;t:for(_=n.child;_!==null;){if(_.tag===5||_.tag===6)f.appendChild(_.stateNode);else if(_.tag!==4&&_.tag!==27&&_.child!==null){_.child.return=_,_=_.child;continue}if(_===n)break t;for(;_.sibling===null;){if(_.return===null||_.return===n)break t;_=_.return}_.sibling.return=_.return,_=_.sibling}n.stateNode=f;t:switch(jn(f,c,r),c){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break t;case"img":r=!0;break t;default:r=!1}r&&ma(n)}}return _n(n),mf(n,n.type,t===null?null:t.memoizedProps,n.pendingProps,a),null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==r&&ma(n);else{if(typeof r!="string"&&n.stateNode===null)throw Error(s(166));if(t=Bt.current,nr(n)){if(t=n.stateNode,a=n.memoizedProps,r=null,c=qn,c!==null)switch(c.tag){case 27:case 5:r=c.memoizedProps}t[Ze]=n,t=!!(t.nodeValue===a||r!==null&&r.suppressHydrationWarning===!0||H0(t.nodeValue,a)),t||Ba(n,!0)}else t=tc(t).createTextNode(r),t[Ze]=n,n.stateNode=t}return _n(n),null;case 31:if(a=n.memoizedState,t===null||t.memoizedState!==null){if(r=nr(n),a!==null){if(t===null){if(!r)throw Error(s(318));if(t=n.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(557));t[Ze]=n}else Ms(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;_n(n),t=!1}else a=bu(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return n.flags&256?(Si(n),n):(Si(n),null);if((n.flags&128)!==0)throw Error(s(558))}return _n(n),null;case 13:if(r=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(c=nr(n),r!==null&&r.dehydrated!==null){if(t===null){if(!c)throw Error(s(318));if(c=n.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(s(317));c[Ze]=n}else Ms(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;_n(n),c=!1}else c=bu(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=c),c=!0;if(!c)return n.flags&256?(Si(n),n):(Si(n),null)}return Si(n),(n.flags&128)!==0?(n.lanes=a,n):(a=r!==null,t=t!==null&&t.memoizedState!==null,a&&(r=n.child,c=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(c=r.alternate.memoizedState.cachePool.pool),f=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(f=r.memoizedState.cachePool.pool),f!==c&&(r.flags|=2048)),a!==t&&a&&(n.child.flags|=8192),Fl(n,n.updateQueue),_n(n),null);case 4:return Jt(),t===null&&If(n.stateNode.containerInfo),_n(n),null;case 10:return fa(n.type),_n(n),null;case 19:if(rt(An),r=n.memoizedState,r===null)return _n(n),null;if(c=(n.flags&128)!==0,f=r.rendering,f===null)if(c)bo(r,!1);else{if(bn!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(f=Al(t),f!==null){for(n.flags|=128,bo(r,!1),t=f.updateQueue,n.updateQueue=t,Fl(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)vp(a,t),a=a.sibling;return Nt(An,An.current&1|2),Ie&&ca(n,r.treeForkCount),n.child}t=t.sibling}r.tail!==null&&nt()>Xl&&(n.flags|=128,c=!0,bo(r,!1),n.lanes=4194304)}else{if(!c)if(t=Al(f),t!==null){if(n.flags|=128,c=!0,t=t.updateQueue,n.updateQueue=t,Fl(n,t),bo(r,!0),r.tail===null&&r.tailMode==="hidden"&&!f.alternate&&!Ie)return _n(n),null}else 2*nt()-r.renderingStartTime>Xl&&a!==536870912&&(n.flags|=128,c=!0,bo(r,!1),n.lanes=4194304);r.isBackwards?(f.sibling=n.child,n.child=f):(t=r.last,t!==null?t.sibling=f:n.child=f,r.last=f)}return r.tail!==null?(t=r.tail,r.rendering=t,r.tail=t.sibling,r.renderingStartTime=nt(),t.sibling=null,a=An.current,Nt(An,c?a&1|2:a&1),Ie&&ca(n,r.treeForkCount),t):(_n(n),null);case 22:case 23:return Si(n),Iu(),r=n.memoizedState!==null,t!==null?t.memoizedState!==null!==r&&(n.flags|=8192):r&&(n.flags|=8192),r?(a&536870912)!==0&&(n.flags&128)===0&&(_n(n),n.subtreeFlags&6&&(n.flags|=8192)):_n(n),a=n.updateQueue,a!==null&&Fl(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),r=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(r=n.memoizedState.cachePool.pool),r!==a&&(n.flags|=2048),t!==null&&rt(Ts),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),fa(Dn),_n(n),null;case 25:return null;case 30:return null}throw Error(s(156,n.tag))}function _x(t,n){switch(Mu(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return fa(Dn),Jt(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return je(n),null;case 31:if(n.memoizedState!==null){if(Si(n),n.alternate===null)throw Error(s(340));Ms()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 13:if(Si(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(s(340));Ms()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return rt(An),null;case 4:return Jt(),null;case 10:return fa(n.type),null;case 22:case 23:return Si(n),Iu(),t!==null&&rt(Ts),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return fa(Dn),null;case 25:return null;default:return null}}function qm(t,n){switch(Mu(n),n.tag){case 3:fa(Dn),Jt();break;case 26:case 27:case 5:je(n);break;case 4:Jt();break;case 31:n.memoizedState!==null&&Si(n);break;case 13:Si(n);break;case 19:rt(An);break;case 10:fa(n.type);break;case 22:case 23:Si(n),Iu(),t!==null&&rt(Ts);break;case 24:fa(Dn)}}function To(t,n){try{var a=n.updateQueue,r=a!==null?a.lastEffect:null;if(r!==null){var c=r.next;a=c;do{if((a.tag&t)===t){r=void 0;var f=a.create,_=a.inst;r=f(),_.destroy=r}a=a.next}while(a!==c)}}catch(b){$e(n,n.return,b)}}function qa(t,n,a){try{var r=n.updateQueue,c=r!==null?r.lastEffect:null;if(c!==null){var f=c.next;r=f;do{if((r.tag&t)===t){var _=r.inst,b=_.destroy;if(b!==void 0){_.destroy=void 0,c=n;var B=a,at=b;try{at()}catch(St){$e(c,B,St)}}}r=r.next}while(r!==f)}}catch(St){$e(n,n.return,St)}}function Wm(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{Pp(n,a)}catch(r){$e(t,t.return,r)}}}function Ym(t,n,a){a.props=Ds(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(r){$e(t,n,r)}}function Ao(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var r=t.stateNode;break;case 30:r=t.stateNode;break;default:r=t.stateNode}typeof a=="function"?t.refCleanup=a(r):a.current=r}}catch(c){$e(t,n,c)}}function Ji(t,n){var a=t.ref,r=t.refCleanup;if(a!==null)if(typeof r=="function")try{r()}catch(c){$e(t,n,c)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(c){$e(t,n,c)}else a.current=null}function jm(t){var n=t.type,a=t.memoizedProps,r=t.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&r.focus();break t;case"img":a.src?r.src=a.src:a.srcSet&&(r.srcset=a.srcSet)}}catch(c){$e(t,t.return,c)}}function gf(t,n,a){try{var r=t.stateNode;Fx(r,t.type,a,n),r[pn]=n}catch(c){$e(t,t.return,c)}}function Zm(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&Ja(t.type)||t.tag===4}function _f(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||Zm(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&Ja(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function vf(t,n,a){var r=t.tag;if(r===5||r===6)t=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(t),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Re));else if(r!==4&&(r===27&&Ja(t.type)&&(a=t.stateNode,n=null),t=t.child,t!==null))for(vf(t,n,a),t=t.sibling;t!==null;)vf(t,n,a),t=t.sibling}function Hl(t,n,a){var r=t.tag;if(r===5||r===6)t=t.stateNode,n?a.insertBefore(t,n):a.appendChild(t);else if(r!==4&&(r===27&&Ja(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(Hl(t,n,a),t=t.sibling;t!==null;)Hl(t,n,a),t=t.sibling}function Km(t){var n=t.stateNode,a=t.memoizedProps;try{for(var r=t.type,c=n.attributes;c.length;)n.removeAttributeNode(c[0]);jn(n,r,a),n[Ze]=t,n[pn]=a}catch(f){$e(t,t.return,f)}}var ga=!1,Nn=!1,xf=!1,Qm=typeof WeakSet=="function"?WeakSet:Set,Gn=null;function vx(t,n){if(t=t.containerInfo,Hf=oc,t=cp(t),fu(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else t:{a=(a=t.ownerDocument)&&a.defaultView||window;var r=a.getSelection&&a.getSelection();if(r&&r.rangeCount!==0){a=r.anchorNode;var c=r.anchorOffset,f=r.focusNode;r=r.focusOffset;try{a.nodeType,f.nodeType}catch{a=null;break t}var _=0,b=-1,B=-1,at=0,St=0,At=t,ct=null;e:for(;;){for(var mt;At!==a||c!==0&&At.nodeType!==3||(b=_+c),At!==f||r!==0&&At.nodeType!==3||(B=_+r),At.nodeType===3&&(_+=At.nodeValue.length),(mt=At.firstChild)!==null;)ct=At,At=mt;for(;;){if(At===t)break e;if(ct===a&&++at===c&&(b=_),ct===f&&++St===r&&(B=_),(mt=At.nextSibling)!==null)break;At=ct,ct=At.parentNode}At=mt}a=b===-1||B===-1?null:{start:b,end:B}}else a=null}a=a||{start:0,end:0}}else a=null;for(Gf={focusedElem:t,selectionRange:a},oc=!1,Gn=n;Gn!==null;)if(n=Gn,t=n.child,(n.subtreeFlags&1028)!==0&&t!==null)t.return=n,Gn=t;else for(;Gn!==null;){switch(n=Gn,f=n.alternate,t=n.flags,n.tag){case 0:if((t&4)!==0&&(t=n.updateQueue,t=t!==null?t.events:null,t!==null))for(a=0;a<t.length;a++)c=t[a],c.ref.impl=c.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&f!==null){t=void 0,a=n,c=f.memoizedProps,f=f.memoizedState,r=a.stateNode;try{var te=Ds(a.type,c);t=r.getSnapshotBeforeUpdate(te,f),r.__reactInternalSnapshotBeforeUpdate=t}catch(ue){$e(a,a.return,ue)}}break;case 3:if((t&1024)!==0){if(t=n.stateNode.containerInfo,a=t.nodeType,a===9)Xf(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":Xf(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(s(163))}if(t=n.sibling,t!==null){t.return=n.return,Gn=t;break}Gn=n.return}}function Jm(t,n,a){var r=a.flags;switch(a.tag){case 0:case 11:case 15:va(t,a),r&4&&To(5,a);break;case 1:if(va(t,a),r&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(_){$e(a,a.return,_)}else{var c=Ds(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(c,n,t.__reactInternalSnapshotBeforeUpdate)}catch(_){$e(a,a.return,_)}}r&64&&Wm(a),r&512&&Ao(a,a.return);break;case 3:if(va(t,a),r&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Pp(t,n)}catch(_){$e(a,a.return,_)}}break;case 27:n===null&&r&4&&Km(a);case 26:case 5:va(t,a),n===null&&r&4&&jm(a),r&512&&Ao(a,a.return);break;case 12:va(t,a);break;case 31:va(t,a),r&4&&e0(t,a);break;case 13:va(t,a),r&4&&n0(t,a),r&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=wx.bind(null,a),Yx(t,a))));break;case 22:if(r=a.memoizedState!==null||ga,!r){n=n!==null&&n.memoizedState!==null||Nn,c=ga;var f=Nn;ga=r,(Nn=n)&&!f?xa(t,a,(a.subtreeFlags&8772)!==0):va(t,a),ga=c,Nn=f}break;case 30:break;default:va(t,a)}}function $m(t){var n=t.alternate;n!==null&&(t.alternate=null,$m(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&A(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var xn=null,fi=!1;function _a(t,n,a){for(a=a.child;a!==null;)t0(t,n,a),a=a.sibling}function t0(t,n,a){if(Ct&&typeof Ct.onCommitFiberUnmount=="function")try{Ct.onCommitFiberUnmount(Vt,a)}catch{}switch(a.tag){case 26:Nn||Ji(a,n),_a(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Nn||Ji(a,n);var r=xn,c=fi;Ja(a.type)&&(xn=a.stateNode,fi=!1),_a(t,n,a),zo(a.stateNode),xn=r,fi=c;break;case 5:Nn||Ji(a,n);case 6:if(r=xn,c=fi,xn=null,_a(t,n,a),xn=r,fi=c,xn!==null)if(fi)try{(xn.nodeType===9?xn.body:xn.nodeName==="HTML"?xn.ownerDocument.body:xn).removeChild(a.stateNode)}catch(f){$e(a,n,f)}else try{xn.removeChild(a.stateNode)}catch(f){$e(a,n,f)}break;case 18:xn!==null&&(fi?(t=xn,W0(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),Er(t)):W0(xn,a.stateNode));break;case 4:r=xn,c=fi,xn=a.stateNode.containerInfo,fi=!0,_a(t,n,a),xn=r,fi=c;break;case 0:case 11:case 14:case 15:qa(2,a,n),Nn||qa(4,a,n),_a(t,n,a);break;case 1:Nn||(Ji(a,n),r=a.stateNode,typeof r.componentWillUnmount=="function"&&Ym(a,n,r)),_a(t,n,a);break;case 21:_a(t,n,a);break;case 22:Nn=(r=Nn)||a.memoizedState!==null,_a(t,n,a),Nn=r;break;default:_a(t,n,a)}}function e0(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{Er(t)}catch(a){$e(n,n.return,a)}}}function n0(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Er(t)}catch(a){$e(n,n.return,a)}}function xx(t){switch(t.tag){case 31:case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new Qm),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new Qm),n;default:throw Error(s(435,t.tag))}}function Gl(t,n){var a=xx(t);n.forEach(function(r){if(!a.has(r)){a.add(r);var c=Rx.bind(null,t,r);r.then(c,c)}})}function di(t,n){var a=n.deletions;if(a!==null)for(var r=0;r<a.length;r++){var c=a[r],f=t,_=n,b=_;t:for(;b!==null;){switch(b.tag){case 27:if(Ja(b.type)){xn=b.stateNode,fi=!1;break t}break;case 5:xn=b.stateNode,fi=!1;break t;case 3:case 4:xn=b.stateNode.containerInfo,fi=!0;break t}b=b.return}if(xn===null)throw Error(s(160));t0(f,_,c),xn=null,fi=!1,f=c.alternate,f!==null&&(f.return=null),c.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)i0(n,t),n=n.sibling}var Hi=null;function i0(t,n){var a=t.alternate,r=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:di(n,t),hi(t),r&4&&(qa(3,t,t.return),To(3,t),qa(5,t,t.return));break;case 1:di(n,t),hi(t),r&512&&(Nn||a===null||Ji(a,a.return)),r&64&&ga&&(t=t.updateQueue,t!==null&&(r=t.callbacks,r!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?r:a.concat(r))));break;case 26:var c=Hi;if(di(n,t),hi(t),r&512&&(Nn||a===null||Ji(a,a.return)),r&4){var f=a!==null?a.memoizedState:null;if(r=t.memoizedState,a===null)if(r===null)if(t.stateNode===null){t:{r=t.type,a=t.memoizedProps,c=c.ownerDocument||c;e:switch(r){case"title":f=c.getElementsByTagName("title")[0],(!f||f[Ci]||f[Ze]||f.namespaceURI==="http://www.w3.org/2000/svg"||f.hasAttribute("itemprop"))&&(f=c.createElement(r),c.head.insertBefore(f,c.querySelector("head > title"))),jn(f,r,a),f[Ze]=t,Rt(f),r=f;break t;case"link":var _=ig("link","href",c).get(r+(a.href||""));if(_){for(var b=0;b<_.length;b++)if(f=_[b],f.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&f.getAttribute("rel")===(a.rel==null?null:a.rel)&&f.getAttribute("title")===(a.title==null?null:a.title)&&f.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){_.splice(b,1);break e}}f=c.createElement(r),jn(f,r,a),c.head.appendChild(f);break;case"meta":if(_=ig("meta","content",c).get(r+(a.content||""))){for(b=0;b<_.length;b++)if(f=_[b],f.getAttribute("content")===(a.content==null?null:""+a.content)&&f.getAttribute("name")===(a.name==null?null:a.name)&&f.getAttribute("property")===(a.property==null?null:a.property)&&f.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&f.getAttribute("charset")===(a.charSet==null?null:a.charSet)){_.splice(b,1);break e}}f=c.createElement(r),jn(f,r,a),c.head.appendChild(f);break;default:throw Error(s(468,r))}f[Ze]=t,Rt(f),r=f}t.stateNode=r}else ag(c,t.type,t.stateNode);else t.stateNode=ng(c,r,t.memoizedProps);else f!==r?(f===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):f.count--,r===null?ag(c,t.type,t.stateNode):ng(c,r,t.memoizedProps)):r===null&&t.stateNode!==null&&gf(t,t.memoizedProps,a.memoizedProps)}break;case 27:di(n,t),hi(t),r&512&&(Nn||a===null||Ji(a,a.return)),a!==null&&r&4&&gf(t,t.memoizedProps,a.memoizedProps);break;case 5:if(di(n,t),hi(t),r&512&&(Nn||a===null||Ji(a,a.return)),t.flags&32){c=t.stateNode;try{Fe(c,"")}catch(te){$e(t,t.return,te)}}r&4&&t.stateNode!=null&&(c=t.memoizedProps,gf(t,c,a!==null?a.memoizedProps:c)),r&1024&&(xf=!0);break;case 6:if(di(n,t),hi(t),r&4){if(t.stateNode===null)throw Error(s(162));r=t.memoizedProps,a=t.stateNode;try{a.nodeValue=r}catch(te){$e(t,t.return,te)}}break;case 3:if(ic=null,c=Hi,Hi=ec(n.containerInfo),di(n,t),Hi=c,hi(t),r&4&&a!==null&&a.memoizedState.isDehydrated)try{Er(n.containerInfo)}catch(te){$e(t,t.return,te)}xf&&(xf=!1,a0(t));break;case 4:r=Hi,Hi=ec(t.stateNode.containerInfo),di(n,t),hi(t),Hi=r;break;case 12:di(n,t),hi(t);break;case 31:di(n,t),hi(t),r&4&&(r=t.updateQueue,r!==null&&(t.updateQueue=null,Gl(t,r)));break;case 13:di(n,t),hi(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(kl=nt()),r&4&&(r=t.updateQueue,r!==null&&(t.updateQueue=null,Gl(t,r)));break;case 22:c=t.memoizedState!==null;var B=a!==null&&a.memoizedState!==null,at=ga,St=Nn;if(ga=at||c,Nn=St||B,di(n,t),Nn=St,ga=at,hi(t),r&8192)t:for(n=t.stateNode,n._visibility=c?n._visibility&-2:n._visibility|1,c&&(a===null||B||ga||Nn||Us(t)),a=null,n=t;;){if(n.tag===5||n.tag===26){if(a===null){B=a=n;try{if(f=B.stateNode,c)_=f.style,typeof _.setProperty=="function"?_.setProperty("display","none","important"):_.display="none";else{b=B.stateNode;var At=B.memoizedProps.style,ct=At!=null&&At.hasOwnProperty("display")?At.display:null;b.style.display=ct==null||typeof ct=="boolean"?"":(""+ct).trim()}}catch(te){$e(B,B.return,te)}}}else if(n.tag===6){if(a===null){B=n;try{B.stateNode.nodeValue=c?"":B.memoizedProps}catch(te){$e(B,B.return,te)}}}else if(n.tag===18){if(a===null){B=n;try{var mt=B.stateNode;c?Y0(mt,!0):Y0(B.stateNode,!1)}catch(te){$e(B,B.return,te)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===t)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break t;for(;n.sibling===null;){if(n.return===null||n.return===t)break t;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}r&4&&(r=t.updateQueue,r!==null&&(a=r.retryQueue,a!==null&&(r.retryQueue=null,Gl(t,a))));break;case 19:di(n,t),hi(t),r&4&&(r=t.updateQueue,r!==null&&(t.updateQueue=null,Gl(t,r)));break;case 30:break;case 21:break;default:di(n,t),hi(t)}}function hi(t){var n=t.flags;if(n&2){try{for(var a,r=t.return;r!==null;){if(Zm(r)){a=r;break}r=r.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var c=a.stateNode,f=_f(t);Hl(t,f,c);break;case 5:var _=a.stateNode;a.flags&32&&(Fe(_,""),a.flags&=-33);var b=_f(t);Hl(t,b,_);break;case 3:case 4:var B=a.stateNode.containerInfo,at=_f(t);vf(t,at,B);break;default:throw Error(s(161))}}catch(St){$e(t,t.return,St)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function a0(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;a0(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),t=t.sibling}}function va(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)Jm(t,n.alternate,n),n=n.sibling}function Us(t){for(t=t.child;t!==null;){var n=t;switch(n.tag){case 0:case 11:case 14:case 15:qa(4,n,n.return),Us(n);break;case 1:Ji(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&Ym(n,n.return,a),Us(n);break;case 27:zo(n.stateNode);case 26:case 5:Ji(n,n.return),Us(n);break;case 22:n.memoizedState===null&&Us(n);break;case 30:Us(n);break;default:Us(n)}t=t.sibling}}function xa(t,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var r=n.alternate,c=t,f=n,_=f.flags;switch(f.tag){case 0:case 11:case 15:xa(c,f,a),To(4,f);break;case 1:if(xa(c,f,a),r=f,c=r.stateNode,typeof c.componentDidMount=="function")try{c.componentDidMount()}catch(at){$e(r,r.return,at)}if(r=f,c=r.updateQueue,c!==null){var b=r.stateNode;try{var B=c.shared.hiddenCallbacks;if(B!==null)for(c.shared.hiddenCallbacks=null,c=0;c<B.length;c++)zp(B[c],b)}catch(at){$e(r,r.return,at)}}a&&_&64&&Wm(f),Ao(f,f.return);break;case 27:Km(f);case 26:case 5:xa(c,f,a),a&&r===null&&_&4&&jm(f),Ao(f,f.return);break;case 12:xa(c,f,a);break;case 31:xa(c,f,a),a&&_&4&&e0(c,f);break;case 13:xa(c,f,a),a&&_&4&&n0(c,f);break;case 22:f.memoizedState===null&&xa(c,f,a),Ao(f,f.return);break;case 30:break;default:xa(c,f,a)}n=n.sibling}}function yf(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&fo(a))}function Sf(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&fo(t))}function Gi(t,n,a,r){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)s0(t,n,a,r),n=n.sibling}function s0(t,n,a,r){var c=n.flags;switch(n.tag){case 0:case 11:case 15:Gi(t,n,a,r),c&2048&&To(9,n);break;case 1:Gi(t,n,a,r);break;case 3:Gi(t,n,a,r),c&2048&&(t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&fo(t)));break;case 12:if(c&2048){Gi(t,n,a,r),t=n.stateNode;try{var f=n.memoizedProps,_=f.id,b=f.onPostCommit;typeof b=="function"&&b(_,n.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(B){$e(n,n.return,B)}}else Gi(t,n,a,r);break;case 31:Gi(t,n,a,r);break;case 13:Gi(t,n,a,r);break;case 23:break;case 22:f=n.stateNode,_=n.alternate,n.memoizedState!==null?f._visibility&2?Gi(t,n,a,r):wo(t,n):f._visibility&2?Gi(t,n,a,r):(f._visibility|=2,dr(t,n,a,r,(n.subtreeFlags&10256)!==0||!1)),c&2048&&yf(_,n);break;case 24:Gi(t,n,a,r),c&2048&&Sf(n.alternate,n);break;default:Gi(t,n,a,r)}}function dr(t,n,a,r,c){for(c=c&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=t,_=n,b=a,B=r,at=_.flags;switch(_.tag){case 0:case 11:case 15:dr(f,_,b,B,c),To(8,_);break;case 23:break;case 22:var St=_.stateNode;_.memoizedState!==null?St._visibility&2?dr(f,_,b,B,c):wo(f,_):(St._visibility|=2,dr(f,_,b,B,c)),c&&at&2048&&yf(_.alternate,_);break;case 24:dr(f,_,b,B,c),c&&at&2048&&Sf(_.alternate,_);break;default:dr(f,_,b,B,c)}n=n.sibling}}function wo(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,r=n,c=r.flags;switch(r.tag){case 22:wo(a,r),c&2048&&yf(r.alternate,r);break;case 24:wo(a,r),c&2048&&Sf(r.alternate,r);break;default:wo(a,r)}n=n.sibling}}var Ro=8192;function hr(t,n,a){if(t.subtreeFlags&Ro)for(t=t.child;t!==null;)r0(t,n,a),t=t.sibling}function r0(t,n,a){switch(t.tag){case 26:hr(t,n,a),t.flags&Ro&&t.memoizedState!==null&&sy(a,Hi,t.memoizedState,t.memoizedProps);break;case 5:hr(t,n,a);break;case 3:case 4:var r=Hi;Hi=ec(t.stateNode.containerInfo),hr(t,n,a),Hi=r;break;case 22:t.memoizedState===null&&(r=t.alternate,r!==null&&r.memoizedState!==null?(r=Ro,Ro=16777216,hr(t,n,a),Ro=r):hr(t,n,a));break;default:hr(t,n,a)}}function o0(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function Co(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var r=n[a];Gn=r,c0(r,t)}o0(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)l0(t),t=t.sibling}function l0(t){switch(t.tag){case 0:case 11:case 15:Co(t),t.flags&2048&&qa(9,t,t.return);break;case 3:Co(t);break;case 12:Co(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,Vl(t)):Co(t);break;default:Co(t)}}function Vl(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var r=n[a];Gn=r,c0(r,t)}o0(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:qa(8,n,n.return),Vl(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,Vl(n));break;default:Vl(n)}t=t.sibling}}function c0(t,n){for(;Gn!==null;){var a=Gn;switch(a.tag){case 0:case 11:case 15:qa(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var r=a.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:fo(a.memoizedState.cache)}if(r=a.child,r!==null)r.return=a,Gn=r;else t:for(a=t;Gn!==null;){r=Gn;var c=r.sibling,f=r.return;if($m(r),r===a){Gn=null;break t}if(c!==null){c.return=f,Gn=c;break t}Gn=f}}}var yx={getCacheForType:function(t){var n=Wn(Dn),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a},cacheSignal:function(){return Wn(Dn).controller.signal}},Sx=typeof WeakMap=="function"?WeakMap:Map,We=0,dn=null,Ce=null,Ne=0,Je=0,Mi=null,Wa=!1,pr=!1,Mf=!1,ya=0,bn=0,Ya=0,Ls=0,Ef=0,Ei=0,mr=0,Do=null,pi=null,bf=!1,kl=0,u0=0,Xl=1/0,ql=null,ja=null,Pn=0,Za=null,gr=null,Sa=0,Tf=0,Af=null,f0=null,Uo=0,wf=null;function bi(){return(We&2)!==0&&Ne!==0?Ne&-Ne:z.T!==null?Nf():sa()}function d0(){if(Ei===0)if((Ne&536870912)===0||Ie){var t=Q;Q<<=1,(Q&3932160)===0&&(Q=262144),Ei=t}else Ei=536870912;return t=yi.current,t!==null&&(t.flags|=32),Ei}function mi(t,n,a){(t===dn&&(Je===2||Je===9)||t.cancelPendingCommit!==null)&&(_r(t,0),Ka(t,Ne,Ei,!1)),tn(t,a),((We&2)===0||t!==dn)&&(t===dn&&((We&2)===0&&(Ls|=a),bn===4&&Ka(t,Ne,Ei,!1)),$i(t))}function h0(t,n,a){if((We&6)!==0)throw Error(s(327));var r=!a&&(n&127)===0&&(n&t.expiredLanes)===0||Qt(t,n),c=r?bx(t,n):Cf(t,n,!0),f=r;do{if(c===0){pr&&!r&&Ka(t,n,0,!1);break}else{if(a=t.current.alternate,f&&!Mx(a)){c=Cf(t,n,!1),f=!1;continue}if(c===2){if(f=n,t.errorRecoveryDisabledLanes&f)var _=0;else _=t.pendingLanes&-536870913,_=_!==0?_:_&536870912?536870912:0;if(_!==0){n=_;t:{var b=t;c=Do;var B=b.current.memoizedState.isDehydrated;if(B&&(_r(b,_).flags|=256),_=Cf(b,_,!1),_!==2){if(Mf&&!B){b.errorRecoveryDisabledLanes|=f,Ls|=f,c=4;break t}f=pi,pi=c,f!==null&&(pi===null?pi=f:pi.push.apply(pi,f))}c=_}if(f=!1,c!==2)continue}}if(c===1){_r(t,0),Ka(t,n,0,!0);break}t:{switch(r=t,f=c,f){case 0:case 1:throw Error(s(345));case 4:if((n&4194048)!==n)break;case 6:Ka(r,n,Ei,!Wa);break t;case 2:pi=null;break;case 3:case 5:break;default:throw Error(s(329))}if((n&62914560)===n&&(c=kl+300-nt(),10<c)){if(Ka(r,n,Ei,!Wa),Tt(r,0,!0)!==0)break t;Sa=n,r.timeoutHandle=X0(p0.bind(null,r,a,pi,ql,bf,n,Ei,Ls,mr,Wa,f,"Throttled",-0,0),c);break t}p0(r,a,pi,ql,bf,n,Ei,Ls,mr,Wa,f,null,-0,0)}}break}while(!0);$i(t)}function p0(t,n,a,r,c,f,_,b,B,at,St,At,ct,mt){if(t.timeoutHandle=-1,At=n.subtreeFlags,At&8192||(At&16785408)===16785408){At={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Re},r0(n,f,At);var te=(f&62914560)===f?kl-nt():(f&4194048)===f?u0-nt():0;if(te=ry(At,te),te!==null){Sa=f,t.cancelPendingCommit=te(M0.bind(null,t,n,f,a,r,c,_,b,B,St,At,null,ct,mt)),Ka(t,f,_,!at);return}}M0(t,n,f,a,r,c,_,b,B)}function Mx(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var r=0;r<a.length;r++){var c=a[r],f=c.getSnapshot;c=c.value;try{if(!vi(f(),c))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Ka(t,n,a,r){n&=~Ef,n&=~Ls,t.suspendedLanes|=n,t.pingedLanes&=~n,r&&(t.warmLanes|=n),r=t.expirationTimes;for(var c=n;0<c;){var f=31-ae(c),_=1<<f;r[f]=-1,c&=~_}a!==0&&si(t,a,n)}function Wl(){return(We&6)===0?(Lo(0),!1):!0}function Rf(){if(Ce!==null){if(Je===0)var t=Ce.return;else t=Ce,ua=Es=null,ku(t),or=null,po=0,t=Ce;for(;t!==null;)qm(t.alternate,t),t=t.return;Ce=null}}function _r(t,n){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,Vx(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),Sa=0,Rf(),dn=t,Ce=a=la(t.current,null),Ne=n,Je=0,Mi=null,Wa=!1,pr=Qt(t,n),Mf=!1,mr=Ei=Ef=Ls=Ya=bn=0,pi=Do=null,bf=!1,(n&8)!==0&&(n|=n&32);var r=t.entangledLanes;if(r!==0)for(t=t.entanglements,r&=n;0<r;){var c=31-ae(r),f=1<<c;n|=t[c],r&=~f}return ya=n,hl(),a}function m0(t,n){_e=null,z.H=Mo,n===rr||n===Sl?(n=Up(),Je=3):n===Uu?(n=Up(),Je=4):Je=n===rf?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,Mi=n,Ce===null&&(bn=1,zl(t,Ui(n,t.current)))}function g0(){var t=yi.current;return t===null?!0:(Ne&4194048)===Ne?zi===null:(Ne&62914560)===Ne||(Ne&536870912)!==0?t===zi:!1}function _0(){var t=z.H;return z.H=Mo,t===null?Mo:t}function v0(){var t=z.A;return z.A=yx,t}function Yl(){bn=4,Wa||(Ne&4194048)!==Ne&&yi.current!==null||(pr=!0),(Ya&134217727)===0&&(Ls&134217727)===0||dn===null||Ka(dn,Ne,Ei,!1)}function Cf(t,n,a){var r=We;We|=2;var c=_0(),f=v0();(dn!==t||Ne!==n)&&(ql=null,_r(t,n)),n=!1;var _=bn;t:do try{if(Je!==0&&Ce!==null){var b=Ce,B=Mi;switch(Je){case 8:Rf(),_=6;break t;case 3:case 2:case 9:case 6:yi.current===null&&(n=!0);var at=Je;if(Je=0,Mi=null,vr(t,b,B,at),a&&pr){_=0;break t}break;default:at=Je,Je=0,Mi=null,vr(t,b,B,at)}}Ex(),_=bn;break}catch(St){m0(t,St)}while(!0);return n&&t.shellSuspendCounter++,ua=Es=null,We=r,z.H=c,z.A=f,Ce===null&&(dn=null,Ne=0,hl()),_}function Ex(){for(;Ce!==null;)x0(Ce)}function bx(t,n){var a=We;We|=2;var r=_0(),c=v0();dn!==t||Ne!==n?(ql=null,Xl=nt()+500,_r(t,n)):pr=Qt(t,n);t:do try{if(Je!==0&&Ce!==null){n=Ce;var f=Mi;e:switch(Je){case 1:Je=0,Mi=null,vr(t,n,f,1);break;case 2:case 9:if(Cp(f)){Je=0,Mi=null,y0(n);break}n=function(){Je!==2&&Je!==9||dn!==t||(Je=7),$i(t)},f.then(n,n);break t;case 3:Je=7;break t;case 4:Je=5;break t;case 7:Cp(f)?(Je=0,Mi=null,y0(n)):(Je=0,Mi=null,vr(t,n,f,7));break;case 5:var _=null;switch(Ce.tag){case 26:_=Ce.memoizedState;case 5:case 27:var b=Ce;if(_?sg(_):b.stateNode.complete){Je=0,Mi=null;var B=b.sibling;if(B!==null)Ce=B;else{var at=b.return;at!==null?(Ce=at,jl(at)):Ce=null}break e}}Je=0,Mi=null,vr(t,n,f,5);break;case 6:Je=0,Mi=null,vr(t,n,f,6);break;case 8:Rf(),bn=6;break t;default:throw Error(s(462))}}Tx();break}catch(St){m0(t,St)}while(!0);return ua=Es=null,z.H=r,z.A=c,We=a,Ce!==null?0:(dn=null,Ne=0,hl(),bn)}function Tx(){for(;Ce!==null&&!E();)x0(Ce)}function x0(t){var n=km(t.alternate,t,ya);t.memoizedProps=t.pendingProps,n===null?jl(t):Ce=n}function y0(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=Im(a,n,n.pendingProps,n.type,void 0,Ne);break;case 11:n=Im(a,n,n.pendingProps,n.type.render,n.ref,Ne);break;case 5:ku(n);default:qm(a,n),n=Ce=vp(n,ya),n=km(a,n,ya)}t.memoizedProps=t.pendingProps,n===null?jl(t):Ce=n}function vr(t,n,a,r){ua=Es=null,ku(n),or=null,po=0;var c=n.return;try{if(hx(t,c,n,a,Ne)){bn=1,zl(t,Ui(a,t.current)),Ce=null;return}}catch(f){if(c!==null)throw Ce=c,f;bn=1,zl(t,Ui(a,t.current)),Ce=null;return}n.flags&32768?(Ie||r===1?t=!0:pr||(Ne&536870912)!==0?t=!1:(Wa=t=!0,(r===2||r===9||r===3||r===6)&&(r=yi.current,r!==null&&r.tag===13&&(r.flags|=16384))),S0(n,t)):jl(n)}function jl(t){var n=t;do{if((n.flags&32768)!==0){S0(n,Wa);return}t=n.return;var a=gx(n.alternate,n,ya);if(a!==null){Ce=a;return}if(n=n.sibling,n!==null){Ce=n;return}Ce=n=t}while(n!==null);bn===0&&(bn=5)}function S0(t,n){do{var a=_x(t.alternate,t);if(a!==null){a.flags&=32767,Ce=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){Ce=t;return}Ce=t=a}while(t!==null);bn=6,Ce=null}function M0(t,n,a,r,c,f,_,b,B){t.cancelPendingCommit=null;do Zl();while(Pn!==0);if((We&6)!==0)throw Error(s(327));if(n!==null){if(n===t.current)throw Error(s(177));if(f=n.lanes|n.childLanes,f|=gu,Cn(t,a,f,_,b,B),t===dn&&(Ce=dn=null,Ne=0),gr=n,Za=t,Sa=a,Tf=f,Af=c,f0=r,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,Cx(pt,function(){return w0(),null})):(t.callbackNode=null,t.callbackPriority=0),r=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||r){r=z.T,z.T=null,c=$.p,$.p=2,_=We,We|=4;try{vx(t,n,a)}finally{We=_,$.p=c,z.T=r}}Pn=1,E0(),b0(),T0()}}function E0(){if(Pn===1){Pn=0;var t=Za,n=gr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=z.T,z.T=null;var r=$.p;$.p=2;var c=We;We|=4;try{i0(n,t);var f=Gf,_=cp(t.containerInfo),b=f.focusedElem,B=f.selectionRange;if(_!==b&&b&&b.ownerDocument&&lp(b.ownerDocument.documentElement,b)){if(B!==null&&fu(b)){var at=B.start,St=B.end;if(St===void 0&&(St=at),"selectionStart"in b)b.selectionStart=at,b.selectionEnd=Math.min(St,b.value.length);else{var At=b.ownerDocument||document,ct=At&&At.defaultView||window;if(ct.getSelection){var mt=ct.getSelection(),te=b.textContent.length,ue=Math.min(B.start,te),sn=B.end===void 0?ue:Math.min(B.end,te);!mt.extend&&ue>sn&&(_=sn,sn=ue,ue=_);var J=op(b,ue),X=op(b,sn);if(J&&X&&(mt.rangeCount!==1||mt.anchorNode!==J.node||mt.anchorOffset!==J.offset||mt.focusNode!==X.node||mt.focusOffset!==X.offset)){var it=At.createRange();it.setStart(J.node,J.offset),mt.removeAllRanges(),ue>sn?(mt.addRange(it),mt.extend(X.node,X.offset)):(it.setEnd(X.node,X.offset),mt.addRange(it))}}}}for(At=[],mt=b;mt=mt.parentNode;)mt.nodeType===1&&At.push({element:mt,left:mt.scrollLeft,top:mt.scrollTop});for(typeof b.focus=="function"&&b.focus(),b=0;b<At.length;b++){var bt=At[b];bt.element.scrollLeft=bt.left,bt.element.scrollTop=bt.top}}oc=!!Hf,Gf=Hf=null}finally{We=c,$.p=r,z.T=a}}t.current=n,Pn=2}}function b0(){if(Pn===2){Pn=0;var t=Za,n=gr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=z.T,z.T=null;var r=$.p;$.p=2;var c=We;We|=4;try{Jm(t,n.alternate,n)}finally{We=c,$.p=r,z.T=a}}Pn=3}}function T0(){if(Pn===4||Pn===3){Pn=0,H();var t=Za,n=gr,a=Sa,r=f0;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?Pn=5:(Pn=0,gr=Za=null,A0(t,t.pendingLanes));var c=t.pendingLanes;if(c===0&&(ja=null),Mn(a),n=n.stateNode,Ct&&typeof Ct.onCommitFiberRoot=="function")try{Ct.onCommitFiberRoot(Vt,n,void 0,(n.current.flags&128)===128)}catch{}if(r!==null){n=z.T,c=$.p,$.p=2,z.T=null;try{for(var f=t.onRecoverableError,_=0;_<r.length;_++){var b=r[_];f(b.value,{componentStack:b.stack})}}finally{z.T=n,$.p=c}}(Sa&3)!==0&&Zl(),$i(t),c=t.pendingLanes,(a&261930)!==0&&(c&42)!==0?t===wf?Uo++:(Uo=0,wf=t):Uo=0,Lo(0)}}function A0(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,fo(n)))}function Zl(){return E0(),b0(),T0(),w0()}function w0(){if(Pn!==5)return!1;var t=Za,n=Tf;Tf=0;var a=Mn(Sa),r=z.T,c=$.p;try{$.p=32>a?32:a,z.T=null,a=Af,Af=null;var f=Za,_=Sa;if(Pn=0,gr=Za=null,Sa=0,(We&6)!==0)throw Error(s(331));var b=We;if(We|=4,l0(f.current),s0(f,f.current,_,a),We=b,Lo(0,!1),Ct&&typeof Ct.onPostCommitFiberRoot=="function")try{Ct.onPostCommitFiberRoot(Vt,f)}catch{}return!0}finally{$.p=c,z.T=r,A0(t,n)}}function R0(t,n,a){n=Ui(a,n),n=sf(t.stateNode,n,2),t=Va(t,n,2),t!==null&&(tn(t,2),$i(t))}function $e(t,n,a){if(t.tag===3)R0(t,t,a);else for(;n!==null;){if(n.tag===3){R0(n,t,a);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(ja===null||!ja.has(r))){t=Ui(a,t),a=Cm(2),r=Va(n,a,2),r!==null&&(Dm(a,r,n,t),tn(r,2),$i(r));break}}n=n.return}}function Df(t,n,a){var r=t.pingCache;if(r===null){r=t.pingCache=new Sx;var c=new Set;r.set(n,c)}else c=r.get(n),c===void 0&&(c=new Set,r.set(n,c));c.has(a)||(Mf=!0,c.add(a),t=Ax.bind(null,t,n,a),n.then(t,t))}function Ax(t,n,a){var r=t.pingCache;r!==null&&r.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,dn===t&&(Ne&a)===a&&(bn===4||bn===3&&(Ne&62914560)===Ne&&300>nt()-kl?(We&2)===0&&_r(t,0):Ef|=a,mr===Ne&&(mr=0)),$i(t)}function C0(t,n){n===0&&(n=ze()),t=ys(t,n),t!==null&&(tn(t,n),$i(t))}function wx(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),C0(t,a)}function Rx(t,n){var a=0;switch(t.tag){case 31:case 13:var r=t.stateNode,c=t.memoizedState;c!==null&&(a=c.retryLane);break;case 19:r=t.stateNode;break;case 22:r=t.stateNode._retryCache;break;default:throw Error(s(314))}r!==null&&r.delete(n),C0(t,a)}function Cx(t,n){return Dt(t,n)}var Kl=null,xr=null,Uf=!1,Ql=!1,Lf=!1,Qa=0;function $i(t){t!==xr&&t.next===null&&(xr===null?Kl=xr=t:xr=xr.next=t),Ql=!0,Uf||(Uf=!0,Ux())}function Lo(t,n){if(!Lf&&Ql){Lf=!0;do for(var a=!1,r=Kl;r!==null;){if(t!==0){var c=r.pendingLanes;if(c===0)var f=0;else{var _=r.suspendedLanes,b=r.pingedLanes;f=(1<<31-ae(42|t)+1)-1,f&=c&~(_&~b),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,N0(r,f))}else f=Ne,f=Tt(r,r===dn?f:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),(f&3)===0||Qt(r,f)||(a=!0,N0(r,f));r=r.next}while(a);Lf=!1}}function Dx(){D0()}function D0(){Ql=Uf=!1;var t=0;Qa!==0&&Gx()&&(t=Qa);for(var n=nt(),a=null,r=Kl;r!==null;){var c=r.next,f=U0(r,n);f===0?(r.next=null,a===null?Kl=c:a.next=c,c===null&&(xr=a)):(a=r,(t!==0||(f&3)!==0)&&(Ql=!0)),r=c}Pn!==0&&Pn!==5||Lo(t),Qa!==0&&(Qa=0)}function U0(t,n){for(var a=t.suspendedLanes,r=t.pingedLanes,c=t.expirationTimes,f=t.pendingLanes&-62914561;0<f;){var _=31-ae(f),b=1<<_,B=c[_];B===-1?((b&a)===0||(b&r)!==0)&&(c[_]=Ge(b,n)):B<=n&&(t.expiredLanes|=b),f&=~b}if(n=dn,a=Ne,a=Tt(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),r=t.callbackNode,a===0||t===n&&(Je===2||Je===9)||t.cancelPendingCommit!==null)return r!==null&&r!==null&&R(r),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||Qt(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(r!==null&&R(r),Mn(a)){case 2:case 8:a=xt;break;case 32:a=pt;break;case 268435456:a=ee;break;default:a=pt}return r=L0.bind(null,t),a=Dt(a,r),t.callbackPriority=n,t.callbackNode=a,n}return r!==null&&r!==null&&R(r),t.callbackPriority=2,t.callbackNode=null,2}function L0(t,n){if(Pn!==0&&Pn!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(Zl()&&t.callbackNode!==a)return null;var r=Ne;return r=Tt(t,t===dn?r:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),r===0?null:(h0(t,r,n),U0(t,nt()),t.callbackNode!=null&&t.callbackNode===a?L0.bind(null,t):null)}function N0(t,n){if(Zl())return null;h0(t,n,!0)}function Ux(){kx(function(){(We&6)!==0?Dt(ot,Dx):D0()})}function Nf(){if(Qa===0){var t=ar;t===0&&(t=Ot,Ot<<=1,(Ot&261888)===0&&(Ot=256)),Qa=t}return Qa}function O0(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Ae(""+t)}function z0(t,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,t.id&&a.setAttribute("form",t.id),n.parentNode.insertBefore(a,n),t=new FormData(t),a.parentNode.removeChild(a),t}function Lx(t,n,a,r,c){if(n==="submit"&&a&&a.stateNode===c){var f=O0((c[pn]||null).action),_=r.submitter;_&&(n=(n=_[pn]||null)?O0(n.formAction):_.getAttribute("formAction"),n!==null&&(f=n,_=null));var b=new cl("action","action",null,r,c);t.push({event:b,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(Qa!==0){var B=_?z0(c,_):new FormData(c);Ju(a,{pending:!0,data:B,method:c.method,action:f},null,B)}}else typeof f=="function"&&(b.preventDefault(),B=_?z0(c,_):new FormData(c),Ju(a,{pending:!0,data:B,method:c.method,action:f},f,B))},currentTarget:c}]})}}for(var Of=0;Of<mu.length;Of++){var zf=mu[Of],Nx=zf.toLowerCase(),Ox=zf[0].toUpperCase()+zf.slice(1);Fi(Nx,"on"+Ox)}Fi(dp,"onAnimationEnd"),Fi(hp,"onAnimationIteration"),Fi(pp,"onAnimationStart"),Fi("dblclick","onDoubleClick"),Fi("focusin","onFocus"),Fi("focusout","onBlur"),Fi(Kv,"onTransitionRun"),Fi(Qv,"onTransitionStart"),Fi(Jv,"onTransitionCancel"),Fi(mp,"onTransitionEnd"),re("onMouseEnter",["mouseout","mouseover"]),re("onMouseLeave",["mouseout","mouseover"]),re("onPointerEnter",["pointerout","pointerover"]),re("onPointerLeave",["pointerout","pointerover"]),Kt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Kt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Kt("onBeforeInput",["compositionend","keypress","textInput","paste"]),Kt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Kt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Kt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var No="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),zx=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(No));function P0(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var r=t[a],c=r.event;r=r.listeners;t:{var f=void 0;if(n)for(var _=r.length-1;0<=_;_--){var b=r[_],B=b.instance,at=b.currentTarget;if(b=b.listener,B!==f&&c.isPropagationStopped())break t;f=b,c.currentTarget=at;try{f(c)}catch(St){dl(St)}c.currentTarget=null,f=B}else for(_=0;_<r.length;_++){if(b=r[_],B=b.instance,at=b.currentTarget,b=b.listener,B!==f&&c.isPropagationStopped())break t;f=b,c.currentTarget=at;try{f(c)}catch(St){dl(St)}c.currentTarget=null,f=B}}}}function De(t,n){var a=n[Oa];a===void 0&&(a=n[Oa]=new Set);var r=t+"__bubble";a.has(r)||(I0(n,t,2,!1),a.add(r))}function Pf(t,n,a){var r=0;n&&(r|=4),I0(a,t,r,n)}var Jl="_reactListening"+Math.random().toString(36).slice(2);function If(t){if(!t[Jl]){t[Jl]=!0,qt.forEach(function(a){a!=="selectionchange"&&(zx.has(a)||Pf(a,!1,t),Pf(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[Jl]||(n[Jl]=!0,Pf("selectionchange",!1,n))}}function I0(t,n,a,r){switch(dg(n)){case 2:var c=cy;break;case 8:c=uy;break;default:c=Jf}a=c.bind(null,n,a,t),c=void 0,!nu||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(c=!0),r?c!==void 0?t.addEventListener(n,a,{capture:!0,passive:c}):t.addEventListener(n,a,!0):c!==void 0?t.addEventListener(n,a,{passive:c}):t.addEventListener(n,a,!1)}function Bf(t,n,a,r,c){var f=r;if((n&1)===0&&(n&2)===0&&r!==null)t:for(;;){if(r===null)return;var _=r.tag;if(_===3||_===4){var b=r.stateNode.containerInfo;if(b===c)break;if(_===4)for(_=r.return;_!==null;){var B=_.tag;if((B===3||B===4)&&_.stateNode.containerInfo===c)return;_=_.return}for(;b!==null;){if(_=Y(b),_===null)return;if(B=_.tag,B===5||B===6||B===26||B===27){r=f=_;continue t}b=b.parentNode}}r=r.return}Vh(function(){var at=f,St=ra(a),At=[];t:{var ct=gp.get(t);if(ct!==void 0){var mt=cl,te=t;switch(t){case"keypress":if(ol(a)===0)break t;case"keydown":case"keyup":mt=Rv;break;case"focusin":te="focus",mt=ru;break;case"focusout":te="blur",mt=ru;break;case"beforeblur":case"afterblur":mt=ru;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":mt=qh;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":mt=gv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":mt=Uv;break;case dp:case hp:case pp:mt=xv;break;case mp:mt=Nv;break;case"scroll":case"scrollend":mt=pv;break;case"wheel":mt=zv;break;case"copy":case"cut":case"paste":mt=Sv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":mt=Yh;break;case"toggle":case"beforetoggle":mt=Iv}var ue=(n&4)!==0,sn=!ue&&(t==="scroll"||t==="scrollend"),J=ue?ct!==null?ct+"Capture":null:ct;ue=[];for(var X=at,it;X!==null;){var bt=X;if(it=bt.stateNode,bt=bt.tag,bt!==5&&bt!==26&&bt!==27||it===null||J===null||(bt=to(X,J),bt!=null&&ue.push(Oo(X,bt,it))),sn)break;X=X.return}0<ue.length&&(ct=new mt(ct,te,null,a,St),At.push({event:ct,listeners:ue}))}}if((n&7)===0){t:{if(ct=t==="mouseover"||t==="pointerover",mt=t==="mouseout"||t==="pointerout",ct&&a!==zn&&(te=a.relatedTarget||a.fromElement)&&(Y(te)||te[ri]))break t;if((mt||ct)&&(ct=St.window===St?St:(ct=St.ownerDocument)?ct.defaultView||ct.parentWindow:window,mt?(te=a.relatedTarget||a.toElement,mt=at,te=te?Y(te):null,te!==null&&(sn=u(te),ue=te.tag,te!==sn||ue!==5&&ue!==27&&ue!==6)&&(te=null)):(mt=null,te=at),mt!==te)){if(ue=qh,bt="onMouseLeave",J="onMouseEnter",X="mouse",(t==="pointerout"||t==="pointerover")&&(ue=Yh,bt="onPointerLeave",J="onPointerEnter",X="pointer"),sn=mt==null?ct:ut(mt),it=te==null?ct:ut(te),ct=new ue(bt,X+"leave",mt,a,St),ct.target=sn,ct.relatedTarget=it,bt=null,Y(St)===at&&(ue=new ue(J,X+"enter",te,a,St),ue.target=it,ue.relatedTarget=sn,bt=ue),sn=bt,mt&&te)e:{for(ue=Px,J=mt,X=te,it=0,bt=J;bt;bt=ue(bt))it++;bt=0;for(var ce=X;ce;ce=ue(ce))bt++;for(;0<it-bt;)J=ue(J),it--;for(;0<bt-it;)X=ue(X),bt--;for(;it--;){if(J===X||X!==null&&J===X.alternate){ue=J;break e}J=ue(J),X=ue(X)}ue=null}else ue=null;mt!==null&&B0(At,ct,mt,ue,!1),te!==null&&sn!==null&&B0(At,sn,te,ue,!0)}}t:{if(ct=at?ut(at):window,mt=ct.nodeName&&ct.nodeName.toLowerCase(),mt==="select"||mt==="input"&&ct.type==="file")var Ve=ep;else if($h(ct))if(np)Ve=Yv;else{Ve=qv;var ie=Xv}else mt=ct.nodeName,!mt||mt.toLowerCase()!=="input"||ct.type!=="checkbox"&&ct.type!=="radio"?at&&Sn(at.elementType)&&(Ve=ep):Ve=Wv;if(Ve&&(Ve=Ve(t,at))){tp(At,Ve,a,St);break t}ie&&ie(t,ct,at),t==="focusout"&&at&&ct.type==="number"&&at.memoizedProps.value!=null&&mn(ct,"number",ct.value)}switch(ie=at?ut(at):window,t){case"focusin":($h(ie)||ie.contentEditable==="true")&&(Ks=ie,du=at,lo=null);break;case"focusout":lo=du=Ks=null;break;case"mousedown":hu=!0;break;case"contextmenu":case"mouseup":case"dragend":hu=!1,up(At,a,St);break;case"selectionchange":if(Zv)break;case"keydown":case"keyup":up(At,a,St)}var ye;if(lu)t:{switch(t){case"compositionstart":var Oe="onCompositionStart";break t;case"compositionend":Oe="onCompositionEnd";break t;case"compositionupdate":Oe="onCompositionUpdate";break t}Oe=void 0}else Zs?Qh(t,a)&&(Oe="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(Oe="onCompositionStart");Oe&&(jh&&a.locale!=="ko"&&(Zs||Oe!=="onCompositionStart"?Oe==="onCompositionEnd"&&Zs&&(ye=kh()):(za=St,iu="value"in za?za.value:za.textContent,Zs=!0)),ie=$l(at,Oe),0<ie.length&&(Oe=new Wh(Oe,t,null,a,St),At.push({event:Oe,listeners:ie}),ye?Oe.data=ye:(ye=Jh(a),ye!==null&&(Oe.data=ye)))),(ye=Fv?Hv(t,a):Gv(t,a))&&(Oe=$l(at,"onBeforeInput"),0<Oe.length&&(ie=new Wh("onBeforeInput","beforeinput",null,a,St),At.push({event:ie,listeners:Oe}),ie.data=ye)),Lx(At,t,at,a,St)}P0(At,n)})}function Oo(t,n,a){return{instance:t,listener:n,currentTarget:a}}function $l(t,n){for(var a=n+"Capture",r=[];t!==null;){var c=t,f=c.stateNode;if(c=c.tag,c!==5&&c!==26&&c!==27||f===null||(c=to(t,a),c!=null&&r.unshift(Oo(t,c,f)),c=to(t,n),c!=null&&r.push(Oo(t,c,f))),t.tag===3)return r;t=t.return}return[]}function Px(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function B0(t,n,a,r,c){for(var f=n._reactName,_=[];a!==null&&a!==r;){var b=a,B=b.alternate,at=b.stateNode;if(b=b.tag,B!==null&&B===r)break;b!==5&&b!==26&&b!==27||at===null||(B=at,c?(at=to(a,f),at!=null&&_.unshift(Oo(a,at,B))):c||(at=to(a,f),at!=null&&_.push(Oo(a,at,B)))),a=a.return}_.length!==0&&t.push({event:n,listeners:_})}var Ix=/\r\n?/g,Bx=/\u0000|\uFFFD/g;function F0(t){return(typeof t=="string"?t:""+t).replace(Ix,`
`).replace(Bx,"")}function H0(t,n){return n=F0(n),F0(t)===n}function an(t,n,a,r,c,f){switch(a){case"children":typeof r=="string"?n==="body"||n==="textarea"&&r===""||Fe(t,r):(typeof r=="number"||typeof r=="bigint")&&n!=="body"&&Fe(t,""+r);break;case"className":Ke(t,"class",r);break;case"tabIndex":Ke(t,"tabindex",r);break;case"dir":case"role":case"viewBox":case"width":case"height":Ke(t,a,r);break;case"style":fn(t,r,f);break;case"data":if(n!=="object"){Ke(t,"data",r);break}case"src":case"href":if(r===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(r==null||typeof r=="function"||typeof r=="symbol"||typeof r=="boolean"){t.removeAttribute(a);break}r=Ae(""+r),t.setAttribute(a,r);break;case"action":case"formAction":if(typeof r=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&an(t,n,"name",c.name,c,null),an(t,n,"formEncType",c.formEncType,c,null),an(t,n,"formMethod",c.formMethod,c,null),an(t,n,"formTarget",c.formTarget,c,null)):(an(t,n,"encType",c.encType,c,null),an(t,n,"method",c.method,c,null),an(t,n,"target",c.target,c,null)));if(r==null||typeof r=="symbol"||typeof r=="boolean"){t.removeAttribute(a);break}r=Ae(""+r),t.setAttribute(a,r);break;case"onClick":r!=null&&(t.onclick=Re);break;case"onScroll":r!=null&&De("scroll",t);break;case"onScrollEnd":r!=null&&De("scrollend",t);break;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(s(61));if(a=r.__html,a!=null){if(c.children!=null)throw Error(s(60));t.innerHTML=a}}break;case"multiple":t.multiple=r&&typeof r!="function"&&typeof r!="symbol";break;case"muted":t.muted=r&&typeof r!="function"&&typeof r!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(r==null||typeof r=="function"||typeof r=="boolean"||typeof r=="symbol"){t.removeAttribute("xlink:href");break}a=Ae(""+r),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":r!=null&&typeof r!="function"&&typeof r!="symbol"?t.setAttribute(a,""+r):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":r&&typeof r!="function"&&typeof r!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":r===!0?t.setAttribute(a,""):r!==!1&&r!=null&&typeof r!="function"&&typeof r!="symbol"?t.setAttribute(a,r):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":r!=null&&typeof r!="function"&&typeof r!="symbol"&&!isNaN(r)&&1<=r?t.setAttribute(a,r):t.removeAttribute(a);break;case"rowSpan":case"start":r==null||typeof r=="function"||typeof r=="symbol"||isNaN(r)?t.removeAttribute(a):t.setAttribute(a,r);break;case"popover":De("beforetoggle",t),De("toggle",t),en(t,"popover",r);break;case"xlinkActuate":dt(t,"http://www.w3.org/1999/xlink","xlink:actuate",r);break;case"xlinkArcrole":dt(t,"http://www.w3.org/1999/xlink","xlink:arcrole",r);break;case"xlinkRole":dt(t,"http://www.w3.org/1999/xlink","xlink:role",r);break;case"xlinkShow":dt(t,"http://www.w3.org/1999/xlink","xlink:show",r);break;case"xlinkTitle":dt(t,"http://www.w3.org/1999/xlink","xlink:title",r);break;case"xlinkType":dt(t,"http://www.w3.org/1999/xlink","xlink:type",r);break;case"xmlBase":dt(t,"http://www.w3.org/XML/1998/namespace","xml:base",r);break;case"xmlLang":dt(t,"http://www.w3.org/XML/1998/namespace","xml:lang",r);break;case"xmlSpace":dt(t,"http://www.w3.org/XML/1998/namespace","xml:space",r);break;case"is":en(t,"is",r);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=He.get(a)||a,en(t,a,r))}}function Ff(t,n,a,r,c,f){switch(a){case"style":fn(t,r,f);break;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(s(61));if(a=r.__html,a!=null){if(c.children!=null)throw Error(s(60));t.innerHTML=a}}break;case"children":typeof r=="string"?Fe(t,r):(typeof r=="number"||typeof r=="bigint")&&Fe(t,""+r);break;case"onScroll":r!=null&&De("scroll",t);break;case"onScrollEnd":r!=null&&De("scrollend",t);break;case"onClick":r!=null&&(t.onclick=Re);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Zt.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(c=a.endsWith("Capture"),n=a.slice(2,c?a.length-7:void 0),f=t[pn]||null,f=f!=null?f[a]:null,typeof f=="function"&&t.removeEventListener(n,f,c),typeof r=="function")){typeof f!="function"&&f!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(n,r,c);break t}a in t?t[a]=r:r===!0?t.setAttribute(a,""):en(t,a,r)}}}function jn(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":De("error",t),De("load",t);var r=!1,c=!1,f;for(f in a)if(a.hasOwnProperty(f)){var _=a[f];if(_!=null)switch(f){case"src":r=!0;break;case"srcSet":c=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:an(t,n,f,_,a,null)}}c&&an(t,n,"srcSet",a.srcSet,a,null),r&&an(t,n,"src",a.src,a,null);return;case"input":De("invalid",t);var b=f=_=c=null,B=null,at=null;for(r in a)if(a.hasOwnProperty(r)){var St=a[r];if(St!=null)switch(r){case"name":c=St;break;case"type":_=St;break;case"checked":B=St;break;case"defaultChecked":at=St;break;case"value":f=St;break;case"defaultValue":b=St;break;case"children":case"dangerouslySetInnerHTML":if(St!=null)throw Error(s(137,n));break;default:an(t,n,r,St,a,null)}}vn(t,f,b,B,at,_,c,!1);return;case"select":De("invalid",t),r=_=f=null;for(c in a)if(a.hasOwnProperty(c)&&(b=a[c],b!=null))switch(c){case"value":f=b;break;case"defaultValue":_=b;break;case"multiple":r=b;default:an(t,n,c,b,a,null)}n=f,a=_,t.multiple=!!r,n!=null?cn(t,!!r,n,!1):a!=null&&cn(t,!!r,a,!0);return;case"textarea":De("invalid",t),f=c=r=null;for(_ in a)if(a.hasOwnProperty(_)&&(b=a[_],b!=null))switch(_){case"value":r=b;break;case"defaultValue":c=b;break;case"children":f=b;break;case"dangerouslySetInnerHTML":if(b!=null)throw Error(s(91));break;default:an(t,n,_,b,a,null)}Le(t,r,c,f);return;case"option":for(B in a)if(a.hasOwnProperty(B)&&(r=a[B],r!=null))switch(B){case"selected":t.selected=r&&typeof r!="function"&&typeof r!="symbol";break;default:an(t,n,B,r,a,null)}return;case"dialog":De("beforetoggle",t),De("toggle",t),De("cancel",t),De("close",t);break;case"iframe":case"object":De("load",t);break;case"video":case"audio":for(r=0;r<No.length;r++)De(No[r],t);break;case"image":De("error",t),De("load",t);break;case"details":De("toggle",t);break;case"embed":case"source":case"link":De("error",t),De("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(at in a)if(a.hasOwnProperty(at)&&(r=a[at],r!=null))switch(at){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:an(t,n,at,r,a,null)}return;default:if(Sn(n)){for(St in a)a.hasOwnProperty(St)&&(r=a[St],r!==void 0&&Ff(t,n,St,r,a,void 0));return}}for(b in a)a.hasOwnProperty(b)&&(r=a[b],r!=null&&an(t,n,b,r,a,null))}function Fx(t,n,a,r){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var c=null,f=null,_=null,b=null,B=null,at=null,St=null;for(mt in a){var At=a[mt];if(a.hasOwnProperty(mt)&&At!=null)switch(mt){case"checked":break;case"value":break;case"defaultValue":B=At;default:r.hasOwnProperty(mt)||an(t,n,mt,null,r,At)}}for(var ct in r){var mt=r[ct];if(At=a[ct],r.hasOwnProperty(ct)&&(mt!=null||At!=null))switch(ct){case"type":f=mt;break;case"name":c=mt;break;case"checked":at=mt;break;case"defaultChecked":St=mt;break;case"value":_=mt;break;case"defaultValue":b=mt;break;case"children":case"dangerouslySetInnerHTML":if(mt!=null)throw Error(s(137,n));break;default:mt!==At&&an(t,n,ct,mt,r,At)}}Qe(t,_,b,B,at,St,f,c);return;case"select":mt=_=b=ct=null;for(f in a)if(B=a[f],a.hasOwnProperty(f)&&B!=null)switch(f){case"value":break;case"multiple":mt=B;default:r.hasOwnProperty(f)||an(t,n,f,null,r,B)}for(c in r)if(f=r[c],B=a[c],r.hasOwnProperty(c)&&(f!=null||B!=null))switch(c){case"value":ct=f;break;case"defaultValue":b=f;break;case"multiple":_=f;default:f!==B&&an(t,n,c,f,r,B)}n=b,a=_,r=mt,ct!=null?cn(t,!!a,ct,!1):!!r!=!!a&&(n!=null?cn(t,!!a,n,!0):cn(t,!!a,a?[]:"",!1));return;case"textarea":mt=ct=null;for(b in a)if(c=a[b],a.hasOwnProperty(b)&&c!=null&&!r.hasOwnProperty(b))switch(b){case"value":break;case"children":break;default:an(t,n,b,null,r,c)}for(_ in r)if(c=r[_],f=a[_],r.hasOwnProperty(_)&&(c!=null||f!=null))switch(_){case"value":ct=c;break;case"defaultValue":mt=c;break;case"children":break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(s(91));break;default:c!==f&&an(t,n,_,c,r,f)}un(t,ct,mt);return;case"option":for(var te in a)if(ct=a[te],a.hasOwnProperty(te)&&ct!=null&&!r.hasOwnProperty(te))switch(te){case"selected":t.selected=!1;break;default:an(t,n,te,null,r,ct)}for(B in r)if(ct=r[B],mt=a[B],r.hasOwnProperty(B)&&ct!==mt&&(ct!=null||mt!=null))switch(B){case"selected":t.selected=ct&&typeof ct!="function"&&typeof ct!="symbol";break;default:an(t,n,B,ct,r,mt)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var ue in a)ct=a[ue],a.hasOwnProperty(ue)&&ct!=null&&!r.hasOwnProperty(ue)&&an(t,n,ue,null,r,ct);for(at in r)if(ct=r[at],mt=a[at],r.hasOwnProperty(at)&&ct!==mt&&(ct!=null||mt!=null))switch(at){case"children":case"dangerouslySetInnerHTML":if(ct!=null)throw Error(s(137,n));break;default:an(t,n,at,ct,r,mt)}return;default:if(Sn(n)){for(var sn in a)ct=a[sn],a.hasOwnProperty(sn)&&ct!==void 0&&!r.hasOwnProperty(sn)&&Ff(t,n,sn,void 0,r,ct);for(St in r)ct=r[St],mt=a[St],!r.hasOwnProperty(St)||ct===mt||ct===void 0&&mt===void 0||Ff(t,n,St,ct,r,mt);return}}for(var J in a)ct=a[J],a.hasOwnProperty(J)&&ct!=null&&!r.hasOwnProperty(J)&&an(t,n,J,null,r,ct);for(At in r)ct=r[At],mt=a[At],!r.hasOwnProperty(At)||ct===mt||ct==null&&mt==null||an(t,n,At,ct,r,mt)}function G0(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Hx(){if(typeof performance.getEntriesByType=="function"){for(var t=0,n=0,a=performance.getEntriesByType("resource"),r=0;r<a.length;r++){var c=a[r],f=c.transferSize,_=c.initiatorType,b=c.duration;if(f&&b&&G0(_)){for(_=0,b=c.responseEnd,r+=1;r<a.length;r++){var B=a[r],at=B.startTime;if(at>b)break;var St=B.transferSize,At=B.initiatorType;St&&G0(At)&&(B=B.responseEnd,_+=St*(B<b?1:(b-at)/(B-at)))}if(--r,n+=8*(f+_)/(c.duration/1e3),t++,10<t)break}}if(0<t)return n/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var Hf=null,Gf=null;function tc(t){return t.nodeType===9?t:t.ownerDocument}function V0(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function k0(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function Vf(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var kf=null;function Gx(){var t=window.event;return t&&t.type==="popstate"?t===kf?!1:(kf=t,!0):(kf=null,!1)}var X0=typeof setTimeout=="function"?setTimeout:void 0,Vx=typeof clearTimeout=="function"?clearTimeout:void 0,q0=typeof Promise=="function"?Promise:void 0,kx=typeof queueMicrotask=="function"?queueMicrotask:typeof q0<"u"?function(t){return q0.resolve(null).then(t).catch(Xx)}:X0;function Xx(t){setTimeout(function(){throw t})}function Ja(t){return t==="head"}function W0(t,n){var a=n,r=0;do{var c=a.nextSibling;if(t.removeChild(a),c&&c.nodeType===8)if(a=c.data,a==="/$"||a==="/&"){if(r===0){t.removeChild(c),Er(n);return}r--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")r++;else if(a==="html")zo(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,zo(a);for(var f=a.firstChild;f;){var _=f.nextSibling,b=f.nodeName;f[Ci]||b==="SCRIPT"||b==="STYLE"||b==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=_}}else a==="body"&&zo(t.ownerDocument.body);a=c}while(a);Er(n)}function Y0(t,n){var a=t;t=0;do{var r=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),r&&r.nodeType===8)if(a=r.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=r}while(a)}function Xf(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Xf(a),A(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function qx(t,n,a,r){for(;t.nodeType===1;){var c=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!r&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(r){if(!t[Ci])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(f=t.getAttribute("rel"),f==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(f!==c.rel||t.getAttribute("href")!==(c.href==null||c.href===""?null:c.href)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin)||t.getAttribute("title")!==(c.title==null?null:c.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(f=t.getAttribute("src"),(f!==(c.src==null?null:c.src)||t.getAttribute("type")!==(c.type==null?null:c.type)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin))&&f&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var f=c.name==null?null:""+c.name;if(c.type==="hidden"&&t.getAttribute("name")===f)return t}else return t;if(t=Pi(t.nextSibling),t===null)break}return null}function Wx(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=Pi(t.nextSibling),t===null))return null;return t}function j0(t,n){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=Pi(t.nextSibling),t===null))return null;return t}function qf(t){return t.data==="$?"||t.data==="$~"}function Wf(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function Yx(t,n){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=n;else if(t.data!=="$?"||a.readyState!=="loading")n();else{var r=function(){n(),a.removeEventListener("DOMContentLoaded",r)};a.addEventListener("DOMContentLoaded",r),t._reactRetry=r}}function Pi(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return t}var Yf=null;function Z0(t){t=t.nextSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(n===0)return Pi(t.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}t=t.nextSibling}return null}function K0(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return t;n--}else a!=="/$"&&a!=="/&"||n++}t=t.previousSibling}return null}function Q0(t,n,a){switch(n=tc(a),t){case"html":if(t=n.documentElement,!t)throw Error(s(452));return t;case"head":if(t=n.head,!t)throw Error(s(453));return t;case"body":if(t=n.body,!t)throw Error(s(454));return t;default:throw Error(s(451))}}function zo(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);A(t)}var Ii=new Map,J0=new Set;function ec(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var Ma=$.d;$.d={f:jx,r:Zx,D:Kx,C:Qx,L:Jx,m:$x,X:ey,S:ty,M:ny};function jx(){var t=Ma.f(),n=Wl();return t||n}function Zx(t){var n=lt(t);n!==null&&n.tag===5&&n.type==="form"?mm(n):Ma.r(t)}var yr=typeof document>"u"?null:document;function $0(t,n,a){var r=yr;if(r&&typeof n=="string"&&n){var c=ne(n);c='link[rel="'+t+'"][href="'+c+'"]',typeof a=="string"&&(c+='[crossorigin="'+a+'"]'),J0.has(c)||(J0.add(c),t={rel:t,crossOrigin:a,href:n},r.querySelector(c)===null&&(n=r.createElement("link"),jn(n,"link",t),Rt(n),r.head.appendChild(n)))}}function Kx(t){Ma.D(t),$0("dns-prefetch",t,null)}function Qx(t,n){Ma.C(t,n),$0("preconnect",t,n)}function Jx(t,n,a){Ma.L(t,n,a);var r=yr;if(r&&t&&n){var c='link[rel="preload"][as="'+ne(n)+'"]';n==="image"&&a&&a.imageSrcSet?(c+='[imagesrcset="'+ne(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(c+='[imagesizes="'+ne(a.imageSizes)+'"]')):c+='[href="'+ne(t)+'"]';var f=c;switch(n){case"style":f=Sr(t);break;case"script":f=Mr(t)}Ii.has(f)||(t=x({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),Ii.set(f,t),r.querySelector(c)!==null||n==="style"&&r.querySelector(Po(f))||n==="script"&&r.querySelector(Io(f))||(n=r.createElement("link"),jn(n,"link",t),Rt(n),r.head.appendChild(n)))}}function $x(t,n){Ma.m(t,n);var a=yr;if(a&&t){var r=n&&typeof n.as=="string"?n.as:"script",c='link[rel="modulepreload"][as="'+ne(r)+'"][href="'+ne(t)+'"]',f=c;switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=Mr(t)}if(!Ii.has(f)&&(t=x({rel:"modulepreload",href:t},n),Ii.set(f,t),a.querySelector(c)===null)){switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Io(f)))return}r=a.createElement("link"),jn(r,"link",t),Rt(r),a.head.appendChild(r)}}}function ty(t,n,a){Ma.S(t,n,a);var r=yr;if(r&&t){var c=Z(r).hoistableStyles,f=Sr(t);n=n||"default";var _=c.get(f);if(!_){var b={loading:0,preload:null};if(_=r.querySelector(Po(f)))b.loading=5;else{t=x({rel:"stylesheet",href:t,"data-precedence":n},a),(a=Ii.get(f))&&jf(t,a);var B=_=r.createElement("link");Rt(B),jn(B,"link",t),B._p=new Promise(function(at,St){B.onload=at,B.onerror=St}),B.addEventListener("load",function(){b.loading|=1}),B.addEventListener("error",function(){b.loading|=2}),b.loading|=4,nc(_,n,r)}_={type:"stylesheet",instance:_,count:1,state:b},c.set(f,_)}}}function ey(t,n){Ma.X(t,n);var a=yr;if(a&&t){var r=Z(a).hoistableScripts,c=Mr(t),f=r.get(c);f||(f=a.querySelector(Io(c)),f||(t=x({src:t,async:!0},n),(n=Ii.get(c))&&Zf(t,n),f=a.createElement("script"),Rt(f),jn(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},r.set(c,f))}}function ny(t,n){Ma.M(t,n);var a=yr;if(a&&t){var r=Z(a).hoistableScripts,c=Mr(t),f=r.get(c);f||(f=a.querySelector(Io(c)),f||(t=x({src:t,async:!0,type:"module"},n),(n=Ii.get(c))&&Zf(t,n),f=a.createElement("script"),Rt(f),jn(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},r.set(c,f))}}function tg(t,n,a,r){var c=(c=Bt.current)?ec(c):null;if(!c)throw Error(s(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=Sr(a.href),a=Z(c).hoistableStyles,r=a.get(n),r||(r={type:"style",instance:null,count:0,state:null},a.set(n,r)),r):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=Sr(a.href);var f=Z(c).hoistableStyles,_=f.get(t);if(_||(c=c.ownerDocument||c,_={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(t,_),(f=c.querySelector(Po(t)))&&!f._p&&(_.instance=f,_.state.loading=5),Ii.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ii.set(t,a),f||iy(c,t,a,_.state))),n&&r===null)throw Error(s(528,""));return _}if(n&&r!==null)throw Error(s(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=Mr(a),a=Z(c).hoistableScripts,r=a.get(n),r||(r={type:"script",instance:null,count:0,state:null},a.set(n,r)),r):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,t))}}function Sr(t){return'href="'+ne(t)+'"'}function Po(t){return'link[rel="stylesheet"]['+t+"]"}function eg(t){return x({},t,{"data-precedence":t.precedence,precedence:null})}function iy(t,n,a,r){t.querySelector('link[rel="preload"][as="style"]['+n+"]")?r.loading=1:(n=t.createElement("link"),r.preload=n,n.addEventListener("load",function(){return r.loading|=1}),n.addEventListener("error",function(){return r.loading|=2}),jn(n,"link",a),Rt(n),t.head.appendChild(n))}function Mr(t){return'[src="'+ne(t)+'"]'}function Io(t){return"script[async]"+t}function ng(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var r=t.querySelector('style[data-href~="'+ne(a.href)+'"]');if(r)return n.instance=r,Rt(r),r;var c=x({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return r=(t.ownerDocument||t).createElement("style"),Rt(r),jn(r,"style",c),nc(r,a.precedence,t),n.instance=r;case"stylesheet":c=Sr(a.href);var f=t.querySelector(Po(c));if(f)return n.state.loading|=4,n.instance=f,Rt(f),f;r=eg(a),(c=Ii.get(c))&&jf(r,c),f=(t.ownerDocument||t).createElement("link"),Rt(f);var _=f;return _._p=new Promise(function(b,B){_.onload=b,_.onerror=B}),jn(f,"link",r),n.state.loading|=4,nc(f,a.precedence,t),n.instance=f;case"script":return f=Mr(a.src),(c=t.querySelector(Io(f)))?(n.instance=c,Rt(c),c):(r=a,(c=Ii.get(f))&&(r=x({},a),Zf(r,c)),t=t.ownerDocument||t,c=t.createElement("script"),Rt(c),jn(c,"link",r),t.head.appendChild(c),n.instance=c);case"void":return null;default:throw Error(s(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(r=n.instance,n.state.loading|=4,nc(r,a.precedence,t));return n.instance}function nc(t,n,a){for(var r=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),c=r.length?r[r.length-1]:null,f=c,_=0;_<r.length;_++){var b=r[_];if(b.dataset.precedence===n)f=b;else if(f!==c)break}f?f.parentNode.insertBefore(t,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function jf(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function Zf(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var ic=null;function ig(t,n,a){if(ic===null){var r=new Map,c=ic=new Map;c.set(a,r)}else c=ic,r=c.get(a),r||(r=new Map,c.set(a,r));if(r.has(t))return r;for(r.set(t,null),a=a.getElementsByTagName(t),c=0;c<a.length;c++){var f=a[c];if(!(f[Ci]||f[Ze]||t==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var _=f.getAttribute(n)||"";_=t+_;var b=r.get(_);b?b.push(f):r.set(_,[f])}}return r}function ag(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function ay(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return t=n.disabled,typeof n.precedence=="string"&&t==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function sg(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function sy(t,n,a,r){if(a.type==="stylesheet"&&(typeof r.media!="string"||matchMedia(r.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var c=Sr(r.href),f=n.querySelector(Po(c));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(t.count++,t=ac.bind(t),n.then(t,t)),a.state.loading|=4,a.instance=f,Rt(f);return}f=n.ownerDocument||n,r=eg(r),(c=Ii.get(c))&&jf(r,c),f=f.createElement("link"),Rt(f);var _=f;_._p=new Promise(function(b,B){_.onload=b,_.onerror=B}),jn(f,"link",r),a.instance=f}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=ac.bind(t),n.addEventListener("load",a),n.addEventListener("error",a))}}var Kf=0;function ry(t,n){return t.stylesheets&&t.count===0&&rc(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var r=setTimeout(function(){if(t.stylesheets&&rc(t,t.stylesheets),t.unsuspend){var f=t.unsuspend;t.unsuspend=null,f()}},6e4+n);0<t.imgBytes&&Kf===0&&(Kf=62500*Hx());var c=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&rc(t,t.stylesheets),t.unsuspend)){var f=t.unsuspend;t.unsuspend=null,f()}},(t.imgBytes>Kf?50:800)+n);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(r),clearTimeout(c)}}:null}function ac(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)rc(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var sc=null;function rc(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,sc=new Map,n.forEach(oy,t),sc=null,ac.call(t))}function oy(t,n){if(!(n.state.loading&4)){var a=sc.get(t);if(a)var r=a.get(null);else{a=new Map,sc.set(t,a);for(var c=t.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<c.length;f++){var _=c[f];(_.nodeName==="LINK"||_.getAttribute("media")!=="not all")&&(a.set(_.dataset.precedence,_),r=_)}r&&a.set(null,r)}c=n.instance,_=c.getAttribute("data-precedence"),f=a.get(_)||r,f===r&&a.set(null,c),a.set(_,c),this.count++,r=ac.bind(this),c.addEventListener("load",r),c.addEventListener("error",r),f?f.parentNode.insertBefore(c,f.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(c,t.firstChild)),n.state.loading|=4}}var Bo={$$typeof:N,Provider:null,Consumer:null,_currentValue:tt,_currentValue2:tt,_threadCount:0};function ly(t,n,a,r,c,f,_,b,B){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=le(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=le(0),this.hiddenUpdates=le(null),this.identifierPrefix=r,this.onUncaughtError=c,this.onCaughtError=f,this.onRecoverableError=_,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=B,this.incompleteTransitions=new Map}function rg(t,n,a,r,c,f,_,b,B,at,St,At){return t=new ly(t,n,a,_,B,at,St,At,b),n=1,f===!0&&(n|=24),f=xi(3,null,null,n),t.current=f,f.stateNode=t,n=Ru(),n.refCount++,t.pooledCache=n,n.refCount++,f.memoizedState={element:r,isDehydrated:a,cache:n},Lu(f),t}function og(t){return t?(t=$s,t):$s}function lg(t,n,a,r,c,f){c=og(c),r.context===null?r.context=c:r.pendingContext=c,r=Ga(n),r.payload={element:a},f=f===void 0?null:f,f!==null&&(r.callback=f),a=Va(t,r,n),a!==null&&(mi(a,t,n),go(a,t,n))}function cg(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function Qf(t,n){cg(t,n),(t=t.alternate)&&cg(t,n)}function ug(t){if(t.tag===13||t.tag===31){var n=ys(t,67108864);n!==null&&mi(n,t,67108864),Qf(t,67108864)}}function fg(t){if(t.tag===13||t.tag===31){var n=bi();n=Qn(n);var a=ys(t,n);a!==null&&mi(a,t,n),Qf(t,n)}}var oc=!0;function cy(t,n,a,r){var c=z.T;z.T=null;var f=$.p;try{$.p=2,Jf(t,n,a,r)}finally{$.p=f,z.T=c}}function uy(t,n,a,r){var c=z.T;z.T=null;var f=$.p;try{$.p=8,Jf(t,n,a,r)}finally{$.p=f,z.T=c}}function Jf(t,n,a,r){if(oc){var c=$f(r);if(c===null)Bf(t,n,r,lc,a),hg(t,r);else if(dy(c,t,n,a,r))r.stopPropagation();else if(hg(t,r),n&4&&-1<fy.indexOf(t)){for(;c!==null;){var f=lt(c);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var _=It(f.pendingLanes);if(_!==0){var b=f;for(b.pendingLanes|=2,b.entangledLanes|=2;_;){var B=1<<31-ae(_);b.entanglements[1]|=B,_&=~B}$i(f),(We&6)===0&&(Xl=nt()+500,Lo(0))}}break;case 31:case 13:b=ys(f,2),b!==null&&mi(b,f,2),Wl(),Qf(f,2)}if(f=$f(r),f===null&&Bf(t,n,r,lc,a),f===c)break;c=f}c!==null&&r.stopPropagation()}else Bf(t,n,r,null,a)}}function $f(t){return t=ra(t),td(t)}var lc=null;function td(t){if(lc=null,t=Y(t),t!==null){var n=u(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=d(n),t!==null)return t;t=null}else if(a===31){if(t=h(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return lc=t,null}function dg(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(ht()){case ot:return 2;case xt:return 8;case pt:case Ht:return 32;case ee:return 268435456;default:return 32}default:return 32}}var ed=!1,$a=null,ts=null,es=null,Fo=new Map,Ho=new Map,ns=[],fy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function hg(t,n){switch(t){case"focusin":case"focusout":$a=null;break;case"dragenter":case"dragleave":ts=null;break;case"mouseover":case"mouseout":es=null;break;case"pointerover":case"pointerout":Fo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ho.delete(n.pointerId)}}function Go(t,n,a,r,c,f){return t===null||t.nativeEvent!==f?(t={blockedOn:n,domEventName:a,eventSystemFlags:r,nativeEvent:f,targetContainers:[c]},n!==null&&(n=lt(n),n!==null&&ug(n)),t):(t.eventSystemFlags|=r,n=t.targetContainers,c!==null&&n.indexOf(c)===-1&&n.push(c),t)}function dy(t,n,a,r,c){switch(n){case"focusin":return $a=Go($a,t,n,a,r,c),!0;case"dragenter":return ts=Go(ts,t,n,a,r,c),!0;case"mouseover":return es=Go(es,t,n,a,r,c),!0;case"pointerover":var f=c.pointerId;return Fo.set(f,Go(Fo.get(f)||null,t,n,a,r,c)),!0;case"gotpointercapture":return f=c.pointerId,Ho.set(f,Go(Ho.get(f)||null,t,n,a,r,c)),!0}return!1}function pg(t){var n=Y(t.target);if(n!==null){var a=u(n);if(a!==null){if(n=a.tag,n===13){if(n=d(a),n!==null){t.blockedOn=n,Zi(t.priority,function(){fg(a)});return}}else if(n===31){if(n=h(a),n!==null){t.blockedOn=n,Zi(t.priority,function(){fg(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function cc(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=$f(t.nativeEvent);if(a===null){a=t.nativeEvent;var r=new a.constructor(a.type,a);zn=r,a.target.dispatchEvent(r),zn=null}else return n=lt(a),n!==null&&ug(n),t.blockedOn=a,!1;n.shift()}return!0}function mg(t,n,a){cc(t)&&a.delete(n)}function hy(){ed=!1,$a!==null&&cc($a)&&($a=null),ts!==null&&cc(ts)&&(ts=null),es!==null&&cc(es)&&(es=null),Fo.forEach(mg),Ho.forEach(mg)}function uc(t,n){t.blockedOn===n&&(t.blockedOn=null,ed||(ed=!0,o.unstable_scheduleCallback(o.unstable_NormalPriority,hy)))}var fc=null;function gg(t){fc!==t&&(fc=t,o.unstable_scheduleCallback(o.unstable_NormalPriority,function(){fc===t&&(fc=null);for(var n=0;n<t.length;n+=3){var a=t[n],r=t[n+1],c=t[n+2];if(typeof r!="function"){if(td(r||a)===null)continue;break}var f=lt(a);f!==null&&(t.splice(n,3),n-=3,Ju(f,{pending:!0,data:c,method:a.method,action:r},r,c))}}))}function Er(t){function n(B){return uc(B,t)}$a!==null&&uc($a,t),ts!==null&&uc(ts,t),es!==null&&uc(es,t),Fo.forEach(n),Ho.forEach(n);for(var a=0;a<ns.length;a++){var r=ns[a];r.blockedOn===t&&(r.blockedOn=null)}for(;0<ns.length&&(a=ns[0],a.blockedOn===null);)pg(a),a.blockedOn===null&&ns.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(r=0;r<a.length;r+=3){var c=a[r],f=a[r+1],_=c[pn]||null;if(typeof f=="function")_||gg(a);else if(_){var b=null;if(f&&f.hasAttribute("formAction")){if(c=f,_=f[pn]||null)b=_.formAction;else if(td(c)!==null)continue}else b=_.action;typeof b=="function"?a[r+1]=b:(a.splice(r,3),r-=3),gg(a)}}}function _g(){function t(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(_){return c=_})},focusReset:"manual",scroll:"manual"})}function n(){c!==null&&(c(),c=null),r||setTimeout(a,20)}function a(){if(!r&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var r=!1,c=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){r=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),c!==null&&(c(),c=null)}}}function nd(t){this._internalRoot=t}dc.prototype.render=nd.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(s(409));var a=n.current,r=bi();lg(a,r,t,n,null,null)},dc.prototype.unmount=nd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;lg(t.current,2,null,t,null,null),Wl(),n[ri]=null}};function dc(t){this._internalRoot=t}dc.prototype.unstable_scheduleHydration=function(t){if(t){var n=sa();t={blockedOn:null,target:t,priority:n};for(var a=0;a<ns.length&&n!==0&&n<ns[a].priority;a++);ns.splice(a,0,t),a===0&&pg(t)}};var vg=e.version;if(vg!=="19.2.0")throw Error(s(527,vg,"19.2.0"));$.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(s(188)):(t=Object.keys(t).join(","),Error(s(268,t)));return t=p(n),t=t!==null?v(t):null,t=t===null?null:t.stateNode,t};var py={bundleType:0,version:"19.2.0",rendererPackageName:"react-dom",currentDispatcherRef:z,reconcilerVersion:"19.2.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var hc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!hc.isDisabled&&hc.supportsFiber)try{Vt=hc.inject(py),Ct=hc}catch{}}return ko.createRoot=function(t,n){if(!l(t))throw Error(s(299));var a=!1,r="",c=Tm,f=Am,_=wm;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(_=n.onRecoverableError)),n=rg(t,1,!1,null,null,a,r,null,c,f,_,_g),t[ri]=n.current,If(t),new nd(n)},ko.hydrateRoot=function(t,n,a){if(!l(t))throw Error(s(299));var r=!1,c="",f=Tm,_=Am,b=wm,B=null;return a!=null&&(a.unstable_strictMode===!0&&(r=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(_=a.onCaughtError),a.onRecoverableError!==void 0&&(b=a.onRecoverableError),a.formState!==void 0&&(B=a.formState)),n=rg(t,1,!0,n,a??null,r,c,B,f,_,b,_g),n.context=og(null),a=n.current,r=bi(),r=Qn(r),c=Ga(r),c.callback=null,Va(a,c,r),a=r,n.current.lanes=a,tn(n,a),$i(n),t[ri]=n.current,If(t),new dc(n)},ko.version="19.2.0",ko}var Rg;function by(){if(Rg)return sd.exports;Rg=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),sd.exports=Ey(),sd.exports}var Ty=by();const Dh="171",Ay=0,Cg=1,wy=2,L_=1,N_=2,Ra=3,hs=0,_i=1,Ri=2,fs=0,Hr=1,Dg=2,Ug=3,Lg=4,Ry=5,Gs=100,Cy=101,Dy=102,Uy=103,Ly=104,Ny=200,Oy=201,zy=202,Py=203,Vd=204,kd=205,Iy=206,By=207,Fy=208,Hy=209,Gy=210,Vy=211,ky=212,Xy=213,qy=214,Xd=0,qd=1,Wd=2,kr=3,Yd=4,jd=5,Zd=6,Kd=7,O_=0,Wy=1,Yy=2,ds=0,jy=1,Zy=2,Ky=3,z_=4,Qy=5,Jy=6,$y=7,P_=300,Xr=301,qr=302,Qd=303,Jd=304,Qc=306,$d=1e3,Xs=1001,th=1002,ji=1003,tS=1004,pc=1005,na=1006,cd=1007,qs=1008,Na=1009,I_=1010,B_=1011,el=1012,Uh=1013,Ws=1014,Da=1015,nl=1016,Lh=1017,Nh=1018,Wr=1020,F_=35902,H_=1021,G_=1022,Yi=1023,V_=1024,k_=1025,Gr=1026,Yr=1027,X_=1028,Oh=1029,q_=1030,zh=1031,Ph=1033,Bc=33776,Fc=33777,Hc=33778,Gc=33779,eh=35840,nh=35841,ih=35842,ah=35843,sh=36196,rh=37492,oh=37496,lh=37808,ch=37809,uh=37810,fh=37811,dh=37812,hh=37813,ph=37814,mh=37815,gh=37816,_h=37817,vh=37818,xh=37819,yh=37820,Sh=37821,Vc=36492,Mh=36494,Eh=36495,W_=36283,bh=36284,Th=36285,Ah=36286,eS=3200,nS=3201,Y_=0,iS=1,us="",ii="srgb",jr="srgb-linear",qc="linear",rn="srgb",br=7680,Ng=519,aS=512,sS=513,rS=514,j_=515,oS=516,lS=517,cS=518,uS=519,Og=35044,zg="300 es",Ua=2e3,Wc=2001;class Kr{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(i)===-1&&s[e].push(i)}hasEventListener(e,i){if(this._listeners===void 0)return!1;const s=this._listeners;return s[e]!==void 0&&s[e].indexOf(i)!==-1}removeEventListener(e,i){if(this._listeners===void 0)return;const l=this._listeners[e];if(l!==void 0){const u=l.indexOf(i);u!==-1&&l.splice(u,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const s=this._listeners[e.type];if(s!==void 0){e.target=this;const l=s.slice(0);for(let u=0,d=l.length;u<d;u++)l[u].call(this,e);e.target=null}}}const ei=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ud=Math.PI/180,wh=180/Math.PI;function il(){const o=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(ei[o&255]+ei[o>>8&255]+ei[o>>16&255]+ei[o>>24&255]+"-"+ei[e&255]+ei[e>>8&255]+"-"+ei[e>>16&15|64]+ei[e>>24&255]+"-"+ei[i&63|128]+ei[i>>8&255]+"-"+ei[i>>16&255]+ei[i>>24&255]+ei[s&255]+ei[s>>8&255]+ei[s>>16&255]+ei[s>>24&255]).toLowerCase()}function Be(o,e,i){return Math.max(e,Math.min(i,o))}function fS(o,e){return(o%e+e)%e}function fd(o,e,i){return(1-i)*o+i*e}function Xo(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function gi(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}class qe{constructor(e=0,i=0){qe.prototype.isVector2=!0,this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,s=this.y,l=e.elements;return this.x=l[0]*i+l[3]*s+l[6],this.y=l[1]*i+l[4]*s+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=Be(this.x,e.x,i.x),this.y=Be(this.y,e.y,i.y),this}clampScalar(e,i){return this.x=Be(this.x,e,i),this.y=Be(this.y,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Be(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(e)/i;return Math.acos(Be(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,s=this.y-e.y;return i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const s=Math.cos(i),l=Math.sin(i),u=this.x-e.x,d=this.y-e.y;return this.x=u*s-d*l+e.x,this.y=u*l+d*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Se{constructor(e,i,s,l,u,d,h,m,p){Se.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,s,l,u,d,h,m,p)}set(e,i,s,l,u,d,h,m,p){const v=this.elements;return v[0]=e,v[1]=l,v[2]=h,v[3]=i,v[4]=u,v[5]=m,v[6]=s,v[7]=d,v[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,s=e.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],this}extractBasis(e,i,s){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const s=e.elements,l=i.elements,u=this.elements,d=s[0],h=s[3],m=s[6],p=s[1],v=s[4],x=s[7],y=s[2],M=s[5],T=s[8],w=l[0],S=l[3],g=l[6],F=l[1],N=l[4],U=l[7],W=l[2],V=l[5],P=l[8];return u[0]=d*w+h*F+m*W,u[3]=d*S+h*N+m*V,u[6]=d*g+h*U+m*P,u[1]=p*w+v*F+x*W,u[4]=p*S+v*N+x*V,u[7]=p*g+v*U+x*P,u[2]=y*w+M*F+T*W,u[5]=y*S+M*N+T*V,u[8]=y*g+M*U+T*P,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],s=e[1],l=e[2],u=e[3],d=e[4],h=e[5],m=e[6],p=e[7],v=e[8];return i*d*v-i*h*p-s*u*v+s*h*m+l*u*p-l*d*m}invert(){const e=this.elements,i=e[0],s=e[1],l=e[2],u=e[3],d=e[4],h=e[5],m=e[6],p=e[7],v=e[8],x=v*d-h*p,y=h*m-v*u,M=p*u-d*m,T=i*x+s*y+l*M;if(T===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/T;return e[0]=x*w,e[1]=(l*p-v*s)*w,e[2]=(h*s-l*d)*w,e[3]=y*w,e[4]=(v*i-l*m)*w,e[5]=(l*u-h*i)*w,e[6]=M*w,e[7]=(s*m-p*i)*w,e[8]=(d*i-s*u)*w,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,s,l,u,d,h){const m=Math.cos(u),p=Math.sin(u);return this.set(s*m,s*p,-s*(m*d+p*h)+d+e,-l*p,l*m,-l*(-p*d+m*h)+h+i,0,0,1),this}scale(e,i){return this.premultiply(dd.makeScale(e,i)),this}rotate(e){return this.premultiply(dd.makeRotation(-e)),this}translate(e,i){return this.premultiply(dd.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,-s,0,s,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,s=e.elements;for(let l=0;l<9;l++)if(i[l]!==s[l])return!1;return!0}fromArray(e,i=0){for(let s=0;s<9;s++)this.elements[s]=e[s+i];return this}toArray(e=[],i=0){const s=this.elements;return e[i]=s[0],e[i+1]=s[1],e[i+2]=s[2],e[i+3]=s[3],e[i+4]=s[4],e[i+5]=s[5],e[i+6]=s[6],e[i+7]=s[7],e[i+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const dd=new Se;function Z_(o){for(let e=o.length-1;e>=0;--e)if(o[e]>=65535)return!0;return!1}function Yc(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function dS(){const o=Yc("canvas");return o.style.display="block",o}const Pg={};function Br(o){o in Pg||(Pg[o]=!0,console.warn(o))}function hS(o,e,i){return new Promise(function(s,l){function u(){switch(o.clientWaitSync(e,o.SYNC_FLUSH_COMMANDS_BIT,0)){case o.WAIT_FAILED:l();break;case o.TIMEOUT_EXPIRED:setTimeout(u,i);break;default:s()}}setTimeout(u,i)})}function pS(o){const e=o.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function mS(o){const e=o.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ig=new Se().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bg=new Se().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gS(){const o={enabled:!0,workingColorSpace:jr,spaces:{},convert:function(l,u,d){return this.enabled===!1||u===d||!u||!d||(this.spaces[u].transfer===rn&&(l.r=La(l.r),l.g=La(l.g),l.b=La(l.b)),this.spaces[u].primaries!==this.spaces[d].primaries&&(l.applyMatrix3(this.spaces[u].toXYZ),l.applyMatrix3(this.spaces[d].fromXYZ)),this.spaces[d].transfer===rn&&(l.r=Vr(l.r),l.g=Vr(l.g),l.b=Vr(l.b))),l},fromWorkingColorSpace:function(l,u){return this.convert(l,this.workingColorSpace,u)},toWorkingColorSpace:function(l,u){return this.convert(l,u,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===us?qc:this.spaces[l].transfer},getLuminanceCoefficients:function(l,u=this.workingColorSpace){return l.fromArray(this.spaces[u].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,u,d){return l.copy(this.spaces[u].toXYZ).multiply(this.spaces[d].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],s=[.3127,.329];return o.define({[jr]:{primaries:e,whitePoint:s,transfer:qc,toXYZ:Ig,fromXYZ:Bg,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:ii},outputColorSpaceConfig:{drawingBufferColorSpace:ii}},[ii]:{primaries:e,whitePoint:s,transfer:rn,toXYZ:Ig,fromXYZ:Bg,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:ii}}}),o}const Xe=gS();function La(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function Vr(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let Tr;class _S{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Tr===void 0&&(Tr=Yc("canvas")),Tr.width=e.width,Tr.height=e.height;const s=Tr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Tr}return i.width>2048||i.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),i.toDataURL("image/jpeg",.6)):i.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=Yc("canvas");i.width=e.width,i.height=e.height;const s=i.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const l=s.getImageData(0,0,e.width,e.height),u=l.data;for(let d=0;d<u.length;d++)u[d]=La(u[d]/255)*255;return s.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let s=0;s<i.length;s++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[s]=Math.floor(La(i[s]/255)*255):i[s]=La(i[s]);return{data:i,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let vS=0;class K_{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:vS++}),this.uuid=il(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},l=this.data;if(l!==null){let u;if(Array.isArray(l)){u=[];for(let d=0,h=l.length;d<h;d++)l[d].isDataTexture?u.push(hd(l[d].image)):u.push(hd(l[d]))}else u=hd(l);s.url=u}return i||(e.images[this.uuid]=s),s}}function hd(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?_S.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let xS=0;class ci extends Kr{constructor(e=ci.DEFAULT_IMAGE,i=ci.DEFAULT_MAPPING,s=Xs,l=Xs,u=na,d=qs,h=Yi,m=Na,p=ci.DEFAULT_ANISOTROPY,v=us){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xS++}),this.uuid=il(),this.name="",this.source=new K_(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=s,this.wrapT=l,this.magFilter=u,this.minFilter=d,this.anisotropy=p,this.format=h,this.internalFormat=null,this.type=m,this.offset=new qe(0,0),this.repeat=new qe(1,1),this.center=new qe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Se,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=v,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),i||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==P_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $d:e.x=e.x-Math.floor(e.x);break;case Xs:e.x=e.x<0?0:1;break;case th:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $d:e.y=e.y-Math.floor(e.y);break;case Xs:e.y=e.y<0?0:1;break;case th:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}ci.DEFAULT_IMAGE=null;ci.DEFAULT_MAPPING=P_;ci.DEFAULT_ANISOTROPY=1;class on{constructor(e=0,i=0,s=0,l=1){on.prototype.isVector4=!0,this.x=e,this.y=i,this.z=s,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,s,l){return this.x=e,this.y=i,this.z=s,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,s=this.y,l=this.z,u=this.w,d=e.elements;return this.x=d[0]*i+d[4]*s+d[8]*l+d[12]*u,this.y=d[1]*i+d[5]*s+d[9]*l+d[13]*u,this.z=d[2]*i+d[6]*s+d[10]*l+d[14]*u,this.w=d[3]*i+d[7]*s+d[11]*l+d[15]*u,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,s,l,u;const m=e.elements,p=m[0],v=m[4],x=m[8],y=m[1],M=m[5],T=m[9],w=m[2],S=m[6],g=m[10];if(Math.abs(v-y)<.01&&Math.abs(x-w)<.01&&Math.abs(T-S)<.01){if(Math.abs(v+y)<.1&&Math.abs(x+w)<.1&&Math.abs(T+S)<.1&&Math.abs(p+M+g-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const N=(p+1)/2,U=(M+1)/2,W=(g+1)/2,V=(v+y)/4,P=(x+w)/4,q=(T+S)/4;return N>U&&N>W?N<.01?(s=0,l=.707106781,u=.707106781):(s=Math.sqrt(N),l=V/s,u=P/s):U>W?U<.01?(s=.707106781,l=0,u=.707106781):(l=Math.sqrt(U),s=V/l,u=q/l):W<.01?(s=.707106781,l=.707106781,u=0):(u=Math.sqrt(W),s=P/u,l=q/u),this.set(s,l,u,i),this}let F=Math.sqrt((S-T)*(S-T)+(x-w)*(x-w)+(y-v)*(y-v));return Math.abs(F)<.001&&(F=1),this.x=(S-T)/F,this.y=(x-w)/F,this.z=(y-v)/F,this.w=Math.acos((p+M+g-1)/2),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=Be(this.x,e.x,i.x),this.y=Be(this.y,e.y,i.y),this.z=Be(this.z,e.z,i.z),this.w=Be(this.w,e.w,i.w),this}clampScalar(e,i){return this.x=Be(this.x,e,i),this.y=Be(this.y,e,i),this.z=Be(this.z,e,i),this.w=Be(this.w,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Be(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this.z=e.z+(i.z-e.z)*s,this.w=e.w+(i.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class yS extends Kr{constructor(e=1,i=1,s={}){super(),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=1,this.scissor=new on(0,0,e,i),this.scissorTest=!1,this.viewport=new on(0,0,e,i);const l={width:e,height:i,depth:1};s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:na,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},s);const u=new ci(l,s.mapping,s.wrapS,s.wrapT,s.magFilter,s.minFilter,s.format,s.type,s.anisotropy,s.colorSpace);u.flipY=!1,u.generateMipmaps=s.generateMipmaps,u.internalFormat=s.internalFormat,this.textures=[];const d=s.count;for(let h=0;h<d;h++)this.textures[h]=u.clone(),this.textures[h].isRenderTargetTexture=!0;this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this.depthTexture=s.depthTexture,this.samples=s.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,i,s=1){if(this.width!==e||this.height!==i||this.depth!==s){this.width=e,this.height=i,this.depth=s;for(let l=0,u=this.textures.length;l<u;l++)this.textures[l].image.width=e,this.textures[l].image.height=i,this.textures[l].image.depth=s;this.dispose()}this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let s=0,l=e.textures.length;s<l;s++)this.textures[s]=e.textures[s].clone(),this.textures[s].isRenderTargetTexture=!0;const i=Object.assign({},e.texture.image);return this.texture.source=new K_(i),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ys extends yS{constructor(e=1,i=1,s={}){super(e,i,s),this.isWebGLRenderTarget=!0}}class Q_ extends ci{constructor(e=null,i=1,s=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:s,depth:l},this.magFilter=ji,this.minFilter=ji,this.wrapR=Xs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class SS extends ci{constructor(e=null,i=1,s=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:s,depth:l},this.magFilter=ji,this.minFilter=ji,this.wrapR=Xs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class al{constructor(e=0,i=0,s=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=s,this._w=l}static slerpFlat(e,i,s,l,u,d,h){let m=s[l+0],p=s[l+1],v=s[l+2],x=s[l+3];const y=u[d+0],M=u[d+1],T=u[d+2],w=u[d+3];if(h===0){e[i+0]=m,e[i+1]=p,e[i+2]=v,e[i+3]=x;return}if(h===1){e[i+0]=y,e[i+1]=M,e[i+2]=T,e[i+3]=w;return}if(x!==w||m!==y||p!==M||v!==T){let S=1-h;const g=m*y+p*M+v*T+x*w,F=g>=0?1:-1,N=1-g*g;if(N>Number.EPSILON){const W=Math.sqrt(N),V=Math.atan2(W,g*F);S=Math.sin(S*V)/W,h=Math.sin(h*V)/W}const U=h*F;if(m=m*S+y*U,p=p*S+M*U,v=v*S+T*U,x=x*S+w*U,S===1-h){const W=1/Math.sqrt(m*m+p*p+v*v+x*x);m*=W,p*=W,v*=W,x*=W}}e[i]=m,e[i+1]=p,e[i+2]=v,e[i+3]=x}static multiplyQuaternionsFlat(e,i,s,l,u,d){const h=s[l],m=s[l+1],p=s[l+2],v=s[l+3],x=u[d],y=u[d+1],M=u[d+2],T=u[d+3];return e[i]=h*T+v*x+m*M-p*y,e[i+1]=m*T+v*y+p*x-h*M,e[i+2]=p*T+v*M+h*y-m*x,e[i+3]=v*T-h*x-m*y-p*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,s,l){return this._x=e,this._y=i,this._z=s,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const s=e._x,l=e._y,u=e._z,d=e._order,h=Math.cos,m=Math.sin,p=h(s/2),v=h(l/2),x=h(u/2),y=m(s/2),M=m(l/2),T=m(u/2);switch(d){case"XYZ":this._x=y*v*x+p*M*T,this._y=p*M*x-y*v*T,this._z=p*v*T+y*M*x,this._w=p*v*x-y*M*T;break;case"YXZ":this._x=y*v*x+p*M*T,this._y=p*M*x-y*v*T,this._z=p*v*T-y*M*x,this._w=p*v*x+y*M*T;break;case"ZXY":this._x=y*v*x-p*M*T,this._y=p*M*x+y*v*T,this._z=p*v*T+y*M*x,this._w=p*v*x-y*M*T;break;case"ZYX":this._x=y*v*x-p*M*T,this._y=p*M*x+y*v*T,this._z=p*v*T-y*M*x,this._w=p*v*x+y*M*T;break;case"YZX":this._x=y*v*x+p*M*T,this._y=p*M*x+y*v*T,this._z=p*v*T-y*M*x,this._w=p*v*x-y*M*T;break;case"XZY":this._x=y*v*x-p*M*T,this._y=p*M*x-y*v*T,this._z=p*v*T+y*M*x,this._w=p*v*x+y*M*T;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+d)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const s=i/2,l=Math.sin(s);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,s=i[0],l=i[4],u=i[8],d=i[1],h=i[5],m=i[9],p=i[2],v=i[6],x=i[10],y=s+h+x;if(y>0){const M=.5/Math.sqrt(y+1);this._w=.25/M,this._x=(v-m)*M,this._y=(u-p)*M,this._z=(d-l)*M}else if(s>h&&s>x){const M=2*Math.sqrt(1+s-h-x);this._w=(v-m)/M,this._x=.25*M,this._y=(l+d)/M,this._z=(u+p)/M}else if(h>x){const M=2*Math.sqrt(1+h-s-x);this._w=(u-p)/M,this._x=(l+d)/M,this._y=.25*M,this._z=(m+v)/M}else{const M=2*Math.sqrt(1+x-s-h);this._w=(d-l)/M,this._x=(u+p)/M,this._y=(m+v)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let s=e.dot(i)+1;return s<Number.EPSILON?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Be(this.dot(e),-1,1)))}rotateTowards(e,i){const s=this.angleTo(e);if(s===0)return this;const l=Math.min(1,i/s);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const s=e._x,l=e._y,u=e._z,d=e._w,h=i._x,m=i._y,p=i._z,v=i._w;return this._x=s*v+d*h+l*p-u*m,this._y=l*v+d*m+u*h-s*p,this._z=u*v+d*p+s*m-l*h,this._w=d*v-s*h-l*m-u*p,this._onChangeCallback(),this}slerp(e,i){if(i===0)return this;if(i===1)return this.copy(e);const s=this._x,l=this._y,u=this._z,d=this._w;let h=d*e._w+s*e._x+l*e._y+u*e._z;if(h<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,h=-h):this.copy(e),h>=1)return this._w=d,this._x=s,this._y=l,this._z=u,this;const m=1-h*h;if(m<=Number.EPSILON){const M=1-i;return this._w=M*d+i*this._w,this._x=M*s+i*this._x,this._y=M*l+i*this._y,this._z=M*u+i*this._z,this.normalize(),this}const p=Math.sqrt(m),v=Math.atan2(p,h),x=Math.sin((1-i)*v)/p,y=Math.sin(i*v)/p;return this._w=d*x+this._w*y,this._x=s*x+this._x*y,this._y=l*x+this._y*y,this._z=u*x+this._z*y,this._onChangeCallback(),this}slerpQuaternions(e,i,s){return this.copy(e).slerp(i,s)}random(){const e=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),s=Math.random(),l=Math.sqrt(1-s),u=Math.sqrt(s);return this.set(l*Math.sin(e),l*Math.cos(e),u*Math.sin(i),u*Math.cos(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class et{constructor(e=0,i=0,s=0){et.prototype.isVector3=!0,this.x=e,this.y=i,this.z=s}set(e,i,s){return s===void 0&&(s=this.z),this.x=e,this.y=i,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(Fg.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(Fg.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,s=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[3]*s+u[6]*l,this.y=u[1]*i+u[4]*s+u[7]*l,this.z=u[2]*i+u[5]*s+u[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,s=this.y,l=this.z,u=e.elements,d=1/(u[3]*i+u[7]*s+u[11]*l+u[15]);return this.x=(u[0]*i+u[4]*s+u[8]*l+u[12])*d,this.y=(u[1]*i+u[5]*s+u[9]*l+u[13])*d,this.z=(u[2]*i+u[6]*s+u[10]*l+u[14])*d,this}applyQuaternion(e){const i=this.x,s=this.y,l=this.z,u=e.x,d=e.y,h=e.z,m=e.w,p=2*(d*l-h*s),v=2*(h*i-u*l),x=2*(u*s-d*i);return this.x=i+m*p+d*x-h*v,this.y=s+m*v+h*p-u*x,this.z=l+m*x+u*v-d*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,s=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[4]*s+u[8]*l,this.y=u[1]*i+u[5]*s+u[9]*l,this.z=u[2]*i+u[6]*s+u[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=Be(this.x,e.x,i.x),this.y=Be(this.y,e.y,i.y),this.z=Be(this.z,e.z,i.z),this}clampScalar(e,i){return this.x=Be(this.x,e,i),this.y=Be(this.y,e,i),this.z=Be(this.z,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Be(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this.z=e.z+(i.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const s=e.x,l=e.y,u=e.z,d=i.x,h=i.y,m=i.z;return this.x=l*m-u*h,this.y=u*d-s*m,this.z=s*h-l*d,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const s=e.dot(this)/i;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return pd.copy(this).projectOnVector(e),this.sub(pd)}reflect(e){return this.sub(pd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(e)/i;return Math.acos(Be(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,s=this.y-e.y,l=this.z-e.z;return i*i+s*s+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,s){const l=Math.sin(i)*e;return this.x=l*Math.sin(s),this.y=Math.cos(i)*e,this.z=l*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,s){return this.x=e*Math.sin(i),this.y=s,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=s,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,i=Math.random()*2-1,s=Math.sqrt(1-i*i);return this.x=s*Math.cos(e),this.y=i,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const pd=new et,Fg=new al;class sl{constructor(e=new et(1/0,1/0,1/0),i=new et(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,s=e.length;i<s;i+=3)this.expandByPoint(Vi.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,s=e.count;i<s;i++)this.expandByPoint(Vi.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,s=e.length;i<s;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const s=Vi.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const u=s.getAttribute("position");if(i===!0&&u!==void 0&&e.isInstancedMesh!==!0)for(let d=0,h=u.count;d<h;d++)e.isMesh===!0?e.getVertexPosition(d,Vi):Vi.fromBufferAttribute(u,d),Vi.applyMatrix4(e.matrixWorld),this.expandByPoint(Vi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),mc.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),mc.copy(s.boundingBox)),mc.applyMatrix4(e.matrixWorld),this.union(mc)}const l=e.children;for(let u=0,d=l.length;u<d;u++)this.expandByObject(l[u],i);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Vi),Vi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,s;return e.normal.x>0?(i=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),i<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qo),gc.subVectors(this.max,qo),Ar.subVectors(e.a,qo),wr.subVectors(e.b,qo),Rr.subVectors(e.c,qo),as.subVectors(wr,Ar),ss.subVectors(Rr,wr),Ns.subVectors(Ar,Rr);let i=[0,-as.z,as.y,0,-ss.z,ss.y,0,-Ns.z,Ns.y,as.z,0,-as.x,ss.z,0,-ss.x,Ns.z,0,-Ns.x,-as.y,as.x,0,-ss.y,ss.x,0,-Ns.y,Ns.x,0];return!md(i,Ar,wr,Rr,gc)||(i=[1,0,0,0,1,0,0,0,1],!md(i,Ar,wr,Rr,gc))?!1:(_c.crossVectors(as,ss),i=[_c.x,_c.y,_c.z],md(i,Ar,wr,Rr,gc))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Vi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Vi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ea[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ea[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ea[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ea[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ea[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ea[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ea[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ea[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ea),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ea=[new et,new et,new et,new et,new et,new et,new et,new et],Vi=new et,mc=new sl,Ar=new et,wr=new et,Rr=new et,as=new et,ss=new et,Ns=new et,qo=new et,gc=new et,_c=new et,Os=new et;function md(o,e,i,s,l){for(let u=0,d=o.length-3;u<=d;u+=3){Os.fromArray(o,u);const h=l.x*Math.abs(Os.x)+l.y*Math.abs(Os.y)+l.z*Math.abs(Os.z),m=e.dot(Os),p=i.dot(Os),v=s.dot(Os);if(Math.max(-Math.max(m,p,v),Math.min(m,p,v))>h)return!1}return!0}const MS=new sl,Wo=new et,gd=new et;class Jc{constructor(e=new et,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const s=this.center;i!==void 0?s.copy(i):MS.setFromPoints(e).getCenter(s);let l=0;for(let u=0,d=e.length;u<d;u++)l=Math.max(l,s.distanceToSquared(e[u]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const s=this.center.distanceToSquared(e);return i.copy(e),s>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wo.subVectors(e,this.center);const i=Wo.lengthSq();if(i>this.radius*this.radius){const s=Math.sqrt(i),l=(s-this.radius)*.5;this.center.addScaledVector(Wo,l/s),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(gd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wo.copy(e.center).add(gd)),this.expandByPoint(Wo.copy(e.center).sub(gd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ba=new et,_d=new et,vc=new et,rs=new et,vd=new et,xc=new et,xd=new et;class J_{constructor(e=new et,i=new et(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ba)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const s=i.dot(this.direction);return s<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=ba.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(ba.copy(this.origin).addScaledVector(this.direction,i),ba.distanceToSquared(e))}distanceSqToSegment(e,i,s,l){_d.copy(e).add(i).multiplyScalar(.5),vc.copy(i).sub(e).normalize(),rs.copy(this.origin).sub(_d);const u=e.distanceTo(i)*.5,d=-this.direction.dot(vc),h=rs.dot(this.direction),m=-rs.dot(vc),p=rs.lengthSq(),v=Math.abs(1-d*d);let x,y,M,T;if(v>0)if(x=d*m-h,y=d*h-m,T=u*v,x>=0)if(y>=-T)if(y<=T){const w=1/v;x*=w,y*=w,M=x*(x+d*y+2*h)+y*(d*x+y+2*m)+p}else y=u,x=Math.max(0,-(d*y+h)),M=-x*x+y*(y+2*m)+p;else y=-u,x=Math.max(0,-(d*y+h)),M=-x*x+y*(y+2*m)+p;else y<=-T?(x=Math.max(0,-(-d*u+h)),y=x>0?-u:Math.min(Math.max(-u,-m),u),M=-x*x+y*(y+2*m)+p):y<=T?(x=0,y=Math.min(Math.max(-u,-m),u),M=y*(y+2*m)+p):(x=Math.max(0,-(d*u+h)),y=x>0?u:Math.min(Math.max(-u,-m),u),M=-x*x+y*(y+2*m)+p);else y=d>0?-u:u,x=Math.max(0,-(d*y+h)),M=-x*x+y*(y+2*m)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,x),l&&l.copy(_d).addScaledVector(vc,y),M}intersectSphere(e,i){ba.subVectors(e.center,this.origin);const s=ba.dot(this.direction),l=ba.dot(ba)-s*s,u=e.radius*e.radius;if(l>u)return null;const d=Math.sqrt(u-l),h=s-d,m=s+d;return m<0?null:h<0?this.at(m,i):this.at(h,i)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/i;return s>=0?s:null}intersectPlane(e,i){const s=this.distanceToPlane(e);return s===null?null:this.at(s,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let s,l,u,d,h,m;const p=1/this.direction.x,v=1/this.direction.y,x=1/this.direction.z,y=this.origin;return p>=0?(s=(e.min.x-y.x)*p,l=(e.max.x-y.x)*p):(s=(e.max.x-y.x)*p,l=(e.min.x-y.x)*p),v>=0?(u=(e.min.y-y.y)*v,d=(e.max.y-y.y)*v):(u=(e.max.y-y.y)*v,d=(e.min.y-y.y)*v),s>d||u>l||((u>s||isNaN(s))&&(s=u),(d<l||isNaN(l))&&(l=d),x>=0?(h=(e.min.z-y.z)*x,m=(e.max.z-y.z)*x):(h=(e.max.z-y.z)*x,m=(e.min.z-y.z)*x),s>m||h>l)||((h>s||s!==s)&&(s=h),(m<l||l!==l)&&(l=m),l<0)?null:this.at(s>=0?s:l,i)}intersectsBox(e){return this.intersectBox(e,ba)!==null}intersectTriangle(e,i,s,l,u){vd.subVectors(i,e),xc.subVectors(s,e),xd.crossVectors(vd,xc);let d=this.direction.dot(xd),h;if(d>0){if(l)return null;h=1}else if(d<0)h=-1,d=-d;else return null;rs.subVectors(this.origin,e);const m=h*this.direction.dot(xc.crossVectors(rs,xc));if(m<0)return null;const p=h*this.direction.dot(vd.cross(rs));if(p<0||m+p>d)return null;const v=-h*rs.dot(xd);return v<0?null:this.at(v/d,u)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yn{constructor(e,i,s,l,u,d,h,m,p,v,x,y,M,T,w,S){yn.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,s,l,u,d,h,m,p,v,x,y,M,T,w,S)}set(e,i,s,l,u,d,h,m,p,v,x,y,M,T,w,S){const g=this.elements;return g[0]=e,g[4]=i,g[8]=s,g[12]=l,g[1]=u,g[5]=d,g[9]=h,g[13]=m,g[2]=p,g[6]=v,g[10]=x,g[14]=y,g[3]=M,g[7]=T,g[11]=w,g[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yn().fromArray(this.elements)}copy(e){const i=this.elements,s=e.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],i[9]=s[9],i[10]=s[10],i[11]=s[11],i[12]=s[12],i[13]=s[13],i[14]=s[14],i[15]=s[15],this}copyPosition(e){const i=this.elements,s=e.elements;return i[12]=s[12],i[13]=s[13],i[14]=s[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,s){return e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(e,i,s){return this.set(e.x,i.x,s.x,0,e.y,i.y,s.y,0,e.z,i.z,s.z,0,0,0,0,1),this}extractRotation(e){const i=this.elements,s=e.elements,l=1/Cr.setFromMatrixColumn(e,0).length(),u=1/Cr.setFromMatrixColumn(e,1).length(),d=1/Cr.setFromMatrixColumn(e,2).length();return i[0]=s[0]*l,i[1]=s[1]*l,i[2]=s[2]*l,i[3]=0,i[4]=s[4]*u,i[5]=s[5]*u,i[6]=s[6]*u,i[7]=0,i[8]=s[8]*d,i[9]=s[9]*d,i[10]=s[10]*d,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,s=e.x,l=e.y,u=e.z,d=Math.cos(s),h=Math.sin(s),m=Math.cos(l),p=Math.sin(l),v=Math.cos(u),x=Math.sin(u);if(e.order==="XYZ"){const y=d*v,M=d*x,T=h*v,w=h*x;i[0]=m*v,i[4]=-m*x,i[8]=p,i[1]=M+T*p,i[5]=y-w*p,i[9]=-h*m,i[2]=w-y*p,i[6]=T+M*p,i[10]=d*m}else if(e.order==="YXZ"){const y=m*v,M=m*x,T=p*v,w=p*x;i[0]=y+w*h,i[4]=T*h-M,i[8]=d*p,i[1]=d*x,i[5]=d*v,i[9]=-h,i[2]=M*h-T,i[6]=w+y*h,i[10]=d*m}else if(e.order==="ZXY"){const y=m*v,M=m*x,T=p*v,w=p*x;i[0]=y-w*h,i[4]=-d*x,i[8]=T+M*h,i[1]=M+T*h,i[5]=d*v,i[9]=w-y*h,i[2]=-d*p,i[6]=h,i[10]=d*m}else if(e.order==="ZYX"){const y=d*v,M=d*x,T=h*v,w=h*x;i[0]=m*v,i[4]=T*p-M,i[8]=y*p+w,i[1]=m*x,i[5]=w*p+y,i[9]=M*p-T,i[2]=-p,i[6]=h*m,i[10]=d*m}else if(e.order==="YZX"){const y=d*m,M=d*p,T=h*m,w=h*p;i[0]=m*v,i[4]=w-y*x,i[8]=T*x+M,i[1]=x,i[5]=d*v,i[9]=-h*v,i[2]=-p*v,i[6]=M*x+T,i[10]=y-w*x}else if(e.order==="XZY"){const y=d*m,M=d*p,T=h*m,w=h*p;i[0]=m*v,i[4]=-x,i[8]=p*v,i[1]=y*x+w,i[5]=d*v,i[9]=M*x-T,i[2]=T*x-M,i[6]=h*v,i[10]=w*x+y}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ES,e,bS)}lookAt(e,i,s){const l=this.elements;return Ti.subVectors(e,i),Ti.lengthSq()===0&&(Ti.z=1),Ti.normalize(),os.crossVectors(s,Ti),os.lengthSq()===0&&(Math.abs(s.z)===1?Ti.x+=1e-4:Ti.z+=1e-4,Ti.normalize(),os.crossVectors(s,Ti)),os.normalize(),yc.crossVectors(Ti,os),l[0]=os.x,l[4]=yc.x,l[8]=Ti.x,l[1]=os.y,l[5]=yc.y,l[9]=Ti.y,l[2]=os.z,l[6]=yc.z,l[10]=Ti.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const s=e.elements,l=i.elements,u=this.elements,d=s[0],h=s[4],m=s[8],p=s[12],v=s[1],x=s[5],y=s[9],M=s[13],T=s[2],w=s[6],S=s[10],g=s[14],F=s[3],N=s[7],U=s[11],W=s[15],V=l[0],P=l[4],q=l[8],D=l[12],C=l[1],G=l[5],ft=l[9],st=l[13],Mt=l[2],Et=l[6],z=l[10],$=l[14],tt=l[3],Pt=l[7],Ft=l[11],L=l[15];return u[0]=d*V+h*C+m*Mt+p*tt,u[4]=d*P+h*G+m*Et+p*Pt,u[8]=d*q+h*ft+m*z+p*Ft,u[12]=d*D+h*st+m*$+p*L,u[1]=v*V+x*C+y*Mt+M*tt,u[5]=v*P+x*G+y*Et+M*Pt,u[9]=v*q+x*ft+y*z+M*Ft,u[13]=v*D+x*st+y*$+M*L,u[2]=T*V+w*C+S*Mt+g*tt,u[6]=T*P+w*G+S*Et+g*Pt,u[10]=T*q+w*ft+S*z+g*Ft,u[14]=T*D+w*st+S*$+g*L,u[3]=F*V+N*C+U*Mt+W*tt,u[7]=F*P+N*G+U*Et+W*Pt,u[11]=F*q+N*ft+U*z+W*Ft,u[15]=F*D+N*st+U*$+W*L,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],s=e[4],l=e[8],u=e[12],d=e[1],h=e[5],m=e[9],p=e[13],v=e[2],x=e[6],y=e[10],M=e[14],T=e[3],w=e[7],S=e[11],g=e[15];return T*(+u*m*x-l*p*x-u*h*y+s*p*y+l*h*M-s*m*M)+w*(+i*m*M-i*p*y+u*d*y-l*d*M+l*p*v-u*m*v)+S*(+i*p*x-i*h*M-u*d*x+s*d*M+u*h*v-s*p*v)+g*(-l*h*v-i*m*x+i*h*y+l*d*x-s*d*y+s*m*v)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,s){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=s),this}invert(){const e=this.elements,i=e[0],s=e[1],l=e[2],u=e[3],d=e[4],h=e[5],m=e[6],p=e[7],v=e[8],x=e[9],y=e[10],M=e[11],T=e[12],w=e[13],S=e[14],g=e[15],F=x*S*p-w*y*p+w*m*M-h*S*M-x*m*g+h*y*g,N=T*y*p-v*S*p-T*m*M+d*S*M+v*m*g-d*y*g,U=v*w*p-T*x*p+T*h*M-d*w*M-v*h*g+d*x*g,W=T*x*m-v*w*m-T*h*y+d*w*y+v*h*S-d*x*S,V=i*F+s*N+l*U+u*W;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/V;return e[0]=F*P,e[1]=(w*y*u-x*S*u-w*l*M+s*S*M+x*l*g-s*y*g)*P,e[2]=(h*S*u-w*m*u+w*l*p-s*S*p-h*l*g+s*m*g)*P,e[3]=(x*m*u-h*y*u-x*l*p+s*y*p+h*l*M-s*m*M)*P,e[4]=N*P,e[5]=(v*S*u-T*y*u+T*l*M-i*S*M-v*l*g+i*y*g)*P,e[6]=(T*m*u-d*S*u-T*l*p+i*S*p+d*l*g-i*m*g)*P,e[7]=(d*y*u-v*m*u+v*l*p-i*y*p-d*l*M+i*m*M)*P,e[8]=U*P,e[9]=(T*x*u-v*w*u-T*s*M+i*w*M+v*s*g-i*x*g)*P,e[10]=(d*w*u-T*h*u+T*s*p-i*w*p-d*s*g+i*h*g)*P,e[11]=(v*h*u-d*x*u-v*s*p+i*x*p+d*s*M-i*h*M)*P,e[12]=W*P,e[13]=(v*w*l-T*x*l+T*s*y-i*w*y-v*s*S+i*x*S)*P,e[14]=(T*h*l-d*w*l-T*s*m+i*w*m+d*s*S-i*h*S)*P,e[15]=(d*x*l-v*h*l+v*s*m-i*x*m-d*s*y+i*h*y)*P,this}scale(e){const i=this.elements,s=e.x,l=e.y,u=e.z;return i[0]*=s,i[4]*=l,i[8]*=u,i[1]*=s,i[5]*=l,i[9]*=u,i[2]*=s,i[6]*=l,i[10]*=u,i[3]*=s,i[7]*=l,i[11]*=u,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,s,l))}makeTranslation(e,i,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,s,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,i,-s,0,0,s,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,0,s,0,0,1,0,0,-s,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,-s,0,0,s,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const s=Math.cos(i),l=Math.sin(i),u=1-s,d=e.x,h=e.y,m=e.z,p=u*d,v=u*h;return this.set(p*d+s,p*h-l*m,p*m+l*h,0,p*h+l*m,v*h+s,v*m-l*d,0,p*m-l*h,v*m+l*d,u*m*m+s,0,0,0,0,1),this}makeScale(e,i,s){return this.set(e,0,0,0,0,i,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,i,s,l,u,d){return this.set(1,s,u,0,e,1,d,0,i,l,1,0,0,0,0,1),this}compose(e,i,s){const l=this.elements,u=i._x,d=i._y,h=i._z,m=i._w,p=u+u,v=d+d,x=h+h,y=u*p,M=u*v,T=u*x,w=d*v,S=d*x,g=h*x,F=m*p,N=m*v,U=m*x,W=s.x,V=s.y,P=s.z;return l[0]=(1-(w+g))*W,l[1]=(M+U)*W,l[2]=(T-N)*W,l[3]=0,l[4]=(M-U)*V,l[5]=(1-(y+g))*V,l[6]=(S+F)*V,l[7]=0,l[8]=(T+N)*P,l[9]=(S-F)*P,l[10]=(1-(y+w))*P,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,s){const l=this.elements;let u=Cr.set(l[0],l[1],l[2]).length();const d=Cr.set(l[4],l[5],l[6]).length(),h=Cr.set(l[8],l[9],l[10]).length();this.determinant()<0&&(u=-u),e.x=l[12],e.y=l[13],e.z=l[14],ki.copy(this);const p=1/u,v=1/d,x=1/h;return ki.elements[0]*=p,ki.elements[1]*=p,ki.elements[2]*=p,ki.elements[4]*=v,ki.elements[5]*=v,ki.elements[6]*=v,ki.elements[8]*=x,ki.elements[9]*=x,ki.elements[10]*=x,i.setFromRotationMatrix(ki),s.x=u,s.y=d,s.z=h,this}makePerspective(e,i,s,l,u,d,h=Ua){const m=this.elements,p=2*u/(i-e),v=2*u/(s-l),x=(i+e)/(i-e),y=(s+l)/(s-l);let M,T;if(h===Ua)M=-(d+u)/(d-u),T=-2*d*u/(d-u);else if(h===Wc)M=-d/(d-u),T=-d*u/(d-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+h);return m[0]=p,m[4]=0,m[8]=x,m[12]=0,m[1]=0,m[5]=v,m[9]=y,m[13]=0,m[2]=0,m[6]=0,m[10]=M,m[14]=T,m[3]=0,m[7]=0,m[11]=-1,m[15]=0,this}makeOrthographic(e,i,s,l,u,d,h=Ua){const m=this.elements,p=1/(i-e),v=1/(s-l),x=1/(d-u),y=(i+e)*p,M=(s+l)*v;let T,w;if(h===Ua)T=(d+u)*x,w=-2*x;else if(h===Wc)T=u*x,w=-1*x;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+h);return m[0]=2*p,m[4]=0,m[8]=0,m[12]=-y,m[1]=0,m[5]=2*v,m[9]=0,m[13]=-M,m[2]=0,m[6]=0,m[10]=w,m[14]=-T,m[3]=0,m[7]=0,m[11]=0,m[15]=1,this}equals(e){const i=this.elements,s=e.elements;for(let l=0;l<16;l++)if(i[l]!==s[l])return!1;return!0}fromArray(e,i=0){for(let s=0;s<16;s++)this.elements[s]=e[s+i];return this}toArray(e=[],i=0){const s=this.elements;return e[i]=s[0],e[i+1]=s[1],e[i+2]=s[2],e[i+3]=s[3],e[i+4]=s[4],e[i+5]=s[5],e[i+6]=s[6],e[i+7]=s[7],e[i+8]=s[8],e[i+9]=s[9],e[i+10]=s[10],e[i+11]=s[11],e[i+12]=s[12],e[i+13]=s[13],e[i+14]=s[14],e[i+15]=s[15],e}}const Cr=new et,ki=new yn,ES=new et(0,0,0),bS=new et(1,1,1),os=new et,yc=new et,Ti=new et,Hg=new yn,Gg=new al;class aa{constructor(e=0,i=0,s=0,l=aa.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=s,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,s,l=this._order){return this._x=e,this._y=i,this._z=s,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,s=!0){const l=e.elements,u=l[0],d=l[4],h=l[8],m=l[1],p=l[5],v=l[9],x=l[2],y=l[6],M=l[10];switch(i){case"XYZ":this._y=Math.asin(Be(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-v,M),this._z=Math.atan2(-d,u)):(this._x=Math.atan2(y,p),this._z=0);break;case"YXZ":this._x=Math.asin(-Be(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(h,M),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-x,u),this._z=0);break;case"ZXY":this._x=Math.asin(Be(y,-1,1)),Math.abs(y)<.9999999?(this._y=Math.atan2(-x,M),this._z=Math.atan2(-d,p)):(this._y=0,this._z=Math.atan2(m,u));break;case"ZYX":this._y=Math.asin(-Be(x,-1,1)),Math.abs(x)<.9999999?(this._x=Math.atan2(y,M),this._z=Math.atan2(m,u)):(this._x=0,this._z=Math.atan2(-d,p));break;case"YZX":this._z=Math.asin(Be(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-v,p),this._y=Math.atan2(-x,u)):(this._x=0,this._y=Math.atan2(h,M));break;case"XZY":this._z=Math.asin(-Be(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(y,p),this._y=Math.atan2(h,u)):(this._x=Math.atan2(-v,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,s){return Hg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hg,i,s)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return Gg.setFromEuler(this),this.setFromQuaternion(Gg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}aa.DEFAULT_ORDER="XYZ";class $_{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let TS=0;const Vg=new et,Dr=new al,Ta=new yn,Sc=new et,Yo=new et,AS=new et,wS=new al,kg=new et(1,0,0),Xg=new et(0,1,0),qg=new et(0,0,1),Wg={type:"added"},RS={type:"removed"},Ur={type:"childadded",child:null},yd={type:"childremoved",child:null};class Xn extends Kr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:TS++}),this.uuid=il(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xn.DEFAULT_UP.clone();const e=new et,i=new aa,s=new al,l=new et(1,1,1);function u(){s.setFromEuler(i,!1)}function d(){i.setFromQuaternion(s,void 0,!1)}i._onChange(u),s._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new yn},normalMatrix:{value:new Se}}),this.matrix=new yn,this.matrixWorld=new yn,this.matrixAutoUpdate=Xn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return Dr.setFromAxisAngle(e,i),this.quaternion.multiply(Dr),this}rotateOnWorldAxis(e,i){return Dr.setFromAxisAngle(e,i),this.quaternion.premultiply(Dr),this}rotateX(e){return this.rotateOnAxis(kg,e)}rotateY(e){return this.rotateOnAxis(Xg,e)}rotateZ(e){return this.rotateOnAxis(qg,e)}translateOnAxis(e,i){return Vg.copy(e).applyQuaternion(this.quaternion),this.position.add(Vg.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(kg,e)}translateY(e){return this.translateOnAxis(Xg,e)}translateZ(e){return this.translateOnAxis(qg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ta.copy(this.matrixWorld).invert())}lookAt(e,i,s){e.isVector3?Sc.copy(e):Sc.set(e,i,s);const l=this.parent;this.updateWorldMatrix(!0,!1),Yo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ta.lookAt(Yo,Sc,this.up):Ta.lookAt(Sc,Yo,this.up),this.quaternion.setFromRotationMatrix(Ta),l&&(Ta.extractRotation(l.matrixWorld),Dr.setFromRotationMatrix(Ta),this.quaternion.premultiply(Dr.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wg),Ur.child=e,this.dispatchEvent(Ur),Ur.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(RS),yd.child=e,this.dispatchEvent(yd),yd.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ta.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ta.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ta),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wg),Ur.child=e,this.dispatchEvent(Ur),Ur.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let s=0,l=this.children.length;s<l;s++){const d=this.children[s].getObjectByProperty(e,i);if(d!==void 0)return d}}getObjectsByProperty(e,i,s=[]){this[e]===i&&s.push(this);const l=this.children;for(let u=0,d=l.length;u<d;u++)l[u].getObjectsByProperty(e,i,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yo,e,AS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yo,wS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(e){e(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].updateMatrixWorld(e)}updateWorldMatrix(e,i){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let u=0,d=l.length;u<d;u++)l[u].updateWorldMatrix(!1,!0)}}toJSON(e){const i=e===void 0||typeof e=="string",s={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.visibility=this._visibility,l.active=this._active,l.bounds=this._bounds.map(h=>({boxInitialized:h.boxInitialized,boxMin:h.box.min.toArray(),boxMax:h.box.max.toArray(),sphereInitialized:h.sphereInitialized,sphereRadius:h.sphere.radius,sphereCenter:h.sphere.center.toArray()})),l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.geometryCount=this._geometryCount,l.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(l.boundingSphere={center:l.boundingSphere.center.toArray(),radius:l.boundingSphere.radius}),this.boundingBox!==null&&(l.boundingBox={min:l.boundingBox.min.toArray(),max:l.boundingBox.max.toArray()}));function u(h,m){return h[m.uuid]===void 0&&(h[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=u(e.geometries,this.geometry);const h=this.geometry.parameters;if(h!==void 0&&h.shapes!==void 0){const m=h.shapes;if(Array.isArray(m))for(let p=0,v=m.length;p<v;p++){const x=m[p];u(e.shapes,x)}else u(e.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const h=[];for(let m=0,p=this.material.length;m<p;m++)h.push(u(e.materials,this.material[m]));l.material=h}else l.material=u(e.materials,this.material);if(this.children.length>0){l.children=[];for(let h=0;h<this.children.length;h++)l.children.push(this.children[h].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let h=0;h<this.animations.length;h++){const m=this.animations[h];l.animations.push(u(e.animations,m))}}if(i){const h=d(e.geometries),m=d(e.materials),p=d(e.textures),v=d(e.images),x=d(e.shapes),y=d(e.skeletons),M=d(e.animations),T=d(e.nodes);h.length>0&&(s.geometries=h),m.length>0&&(s.materials=m),p.length>0&&(s.textures=p),v.length>0&&(s.images=v),x.length>0&&(s.shapes=x),y.length>0&&(s.skeletons=y),M.length>0&&(s.animations=M),T.length>0&&(s.nodes=T)}return s.object=l,s;function d(h){const m=[];for(const p in h){const v=h[p];delete v.metadata,m.push(v)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let s=0;s<e.children.length;s++){const l=e.children[s];this.add(l.clone())}return this}}Xn.DEFAULT_UP=new et(0,1,0);Xn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Xi=new et,Aa=new et,Sd=new et,wa=new et,Lr=new et,Nr=new et,Yg=new et,Md=new et,Ed=new et,bd=new et,Td=new on,Ad=new on,wd=new on;class Wi{constructor(e=new et,i=new et,s=new et){this.a=e,this.b=i,this.c=s}static getNormal(e,i,s,l){l.subVectors(s,i),Xi.subVectors(e,i),l.cross(Xi);const u=l.lengthSq();return u>0?l.multiplyScalar(1/Math.sqrt(u)):l.set(0,0,0)}static getBarycoord(e,i,s,l,u){Xi.subVectors(l,i),Aa.subVectors(s,i),Sd.subVectors(e,i);const d=Xi.dot(Xi),h=Xi.dot(Aa),m=Xi.dot(Sd),p=Aa.dot(Aa),v=Aa.dot(Sd),x=d*p-h*h;if(x===0)return u.set(0,0,0),null;const y=1/x,M=(p*m-h*v)*y,T=(d*v-h*m)*y;return u.set(1-M-T,T,M)}static containsPoint(e,i,s,l){return this.getBarycoord(e,i,s,l,wa)===null?!1:wa.x>=0&&wa.y>=0&&wa.x+wa.y<=1}static getInterpolation(e,i,s,l,u,d,h,m){return this.getBarycoord(e,i,s,l,wa)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(u,wa.x),m.addScaledVector(d,wa.y),m.addScaledVector(h,wa.z),m)}static getInterpolatedAttribute(e,i,s,l,u,d){return Td.setScalar(0),Ad.setScalar(0),wd.setScalar(0),Td.fromBufferAttribute(e,i),Ad.fromBufferAttribute(e,s),wd.fromBufferAttribute(e,l),d.setScalar(0),d.addScaledVector(Td,u.x),d.addScaledVector(Ad,u.y),d.addScaledVector(wd,u.z),d}static isFrontFacing(e,i,s,l){return Xi.subVectors(s,i),Aa.subVectors(e,i),Xi.cross(Aa).dot(l)<0}set(e,i,s){return this.a.copy(e),this.b.copy(i),this.c.copy(s),this}setFromPointsAndIndices(e,i,s,l){return this.a.copy(e[i]),this.b.copy(e[s]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,s,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xi.subVectors(this.c,this.b),Aa.subVectors(this.a,this.b),Xi.cross(Aa).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Wi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return Wi.getBarycoord(e,this.a,this.b,this.c,i)}getInterpolation(e,i,s,l,u){return Wi.getInterpolation(e,this.a,this.b,this.c,i,s,l,u)}containsPoint(e){return Wi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Wi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const s=this.a,l=this.b,u=this.c;let d,h;Lr.subVectors(l,s),Nr.subVectors(u,s),Md.subVectors(e,s);const m=Lr.dot(Md),p=Nr.dot(Md);if(m<=0&&p<=0)return i.copy(s);Ed.subVectors(e,l);const v=Lr.dot(Ed),x=Nr.dot(Ed);if(v>=0&&x<=v)return i.copy(l);const y=m*x-v*p;if(y<=0&&m>=0&&v<=0)return d=m/(m-v),i.copy(s).addScaledVector(Lr,d);bd.subVectors(e,u);const M=Lr.dot(bd),T=Nr.dot(bd);if(T>=0&&M<=T)return i.copy(u);const w=M*p-m*T;if(w<=0&&p>=0&&T<=0)return h=p/(p-T),i.copy(s).addScaledVector(Nr,h);const S=v*T-M*x;if(S<=0&&x-v>=0&&M-T>=0)return Yg.subVectors(u,l),h=(x-v)/(x-v+(M-T)),i.copy(l).addScaledVector(Yg,h);const g=1/(S+w+y);return d=w*g,h=y*g,i.copy(s).addScaledVector(Lr,d).addScaledVector(Nr,h)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const tv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ls={h:0,s:0,l:0},Mc={h:0,s:0,l:0};function Rd(o,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?o+(e-o)*6*i:i<1/2?e:i<2/3?o+(e-o)*6*(2/3-i):o}class Ue{constructor(e,i,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,s)}set(e,i,s){if(i===void 0&&s===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=ii){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.toWorkingColorSpace(this,i),this}setRGB(e,i,s,l=Xe.workingColorSpace){return this.r=e,this.g=i,this.b=s,Xe.toWorkingColorSpace(this,l),this}setHSL(e,i,s,l=Xe.workingColorSpace){if(e=fS(e,1),i=Be(i,0,1),s=Be(s,0,1),i===0)this.r=this.g=this.b=s;else{const u=s<=.5?s*(1+i):s+i-s*i,d=2*s-u;this.r=Rd(d,u,e+1/3),this.g=Rd(d,u,e),this.b=Rd(d,u,e-1/3)}return Xe.toWorkingColorSpace(this,l),this}setStyle(e,i=ii){function s(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let u;const d=l[1],h=l[2];switch(d){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return s(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,i);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return s(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,i);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return s(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const u=l[1],d=u.length;if(d===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,i);if(d===6)return this.setHex(parseInt(u,16),i);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=ii){const s=tv[e.toLowerCase()];return s!==void 0?this.setHex(s,i):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=La(e.r),this.g=La(e.g),this.b=La(e.b),this}copyLinearToSRGB(e){return this.r=Vr(e.r),this.g=Vr(e.g),this.b=Vr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ii){return Xe.fromWorkingColorSpace(ni.copy(this),e),Math.round(Be(ni.r*255,0,255))*65536+Math.round(Be(ni.g*255,0,255))*256+Math.round(Be(ni.b*255,0,255))}getHexString(e=ii){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=Xe.workingColorSpace){Xe.fromWorkingColorSpace(ni.copy(this),i);const s=ni.r,l=ni.g,u=ni.b,d=Math.max(s,l,u),h=Math.min(s,l,u);let m,p;const v=(h+d)/2;if(h===d)m=0,p=0;else{const x=d-h;switch(p=v<=.5?x/(d+h):x/(2-d-h),d){case s:m=(l-u)/x+(l<u?6:0);break;case l:m=(u-s)/x+2;break;case u:m=(s-l)/x+4;break}m/=6}return e.h=m,e.s=p,e.l=v,e}getRGB(e,i=Xe.workingColorSpace){return Xe.fromWorkingColorSpace(ni.copy(this),i),e.r=ni.r,e.g=ni.g,e.b=ni.b,e}getStyle(e=ii){Xe.fromWorkingColorSpace(ni.copy(this),e);const i=ni.r,s=ni.g,l=ni.b;return e!==ii?`color(${e} ${i.toFixed(3)} ${s.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(s*255)},${Math.round(l*255)})`}offsetHSL(e,i,s){return this.getHSL(ls),this.setHSL(ls.h+e,ls.s+i,ls.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,s){return this.r=e.r+(i.r-e.r)*s,this.g=e.g+(i.g-e.g)*s,this.b=e.b+(i.b-e.b)*s,this}lerpHSL(e,i){this.getHSL(ls),e.getHSL(Mc);const s=fd(ls.h,Mc.h,i),l=fd(ls.s,Mc.s,i),u=fd(ls.l,Mc.l,i);return this.setHSL(s,l,u),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,s=this.g,l=this.b,u=e.elements;return this.r=u[0]*i+u[3]*s+u[6]*l,this.g=u[1]*i+u[4]*s+u[7]*l,this.b=u[2]*i+u[5]*s+u[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ni=new Ue;Ue.NAMES=tv;let CS=0;class Qr extends Kr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:CS++}),this.uuid=il(),this.name="",this.type="Material",this.blending=Hr,this.side=hs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vd,this.blendDst=kd,this.blendEquation=Gs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ue(0,0,0),this.blendAlpha=0,this.depthFunc=kr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ng,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=br,this.stencilZFail=br,this.stencilZPass=br,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const s=e[i];if(s===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(s):l&&l.isVector3&&s&&s.isVector3?l.copy(s):this[i]=s}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const s={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Hr&&(s.blending=this.blending),this.side!==hs&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Vd&&(s.blendSrc=this.blendSrc),this.blendDst!==kd&&(s.blendDst=this.blendDst),this.blendEquation!==Gs&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==kr&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ng&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==br&&(s.stencilFail=this.stencilFail),this.stencilZFail!==br&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==br&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function l(u){const d=[];for(const h in u){const m=u[h];delete m.metadata,d.push(m)}return d}if(i){const u=l(e.textures),d=l(e.images);u.length>0&&(s.textures=u),d.length>0&&(s.images=d)}return s}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let s=null;if(i!==null){const l=i.length;s=new Array(l);for(let u=0;u!==l;++u)s[u]=i[u].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ih extends Qr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new aa,this.combine=O_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const On=new et,Ec=new qe;class ia{constructor(e,i,s=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=s,this.usage=Og,this.updateRanges=[],this.gpuType=Da,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,s){e*=this.itemSize,s*=i.itemSize;for(let l=0,u=this.itemSize;l<u;l++)this.array[e+l]=i.array[s+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,s=this.count;i<s;i++)Ec.fromBufferAttribute(this,i),Ec.applyMatrix3(e),this.setXY(i,Ec.x,Ec.y);else if(this.itemSize===3)for(let i=0,s=this.count;i<s;i++)On.fromBufferAttribute(this,i),On.applyMatrix3(e),this.setXYZ(i,On.x,On.y,On.z);return this}applyMatrix4(e){for(let i=0,s=this.count;i<s;i++)On.fromBufferAttribute(this,i),On.applyMatrix4(e),this.setXYZ(i,On.x,On.y,On.z);return this}applyNormalMatrix(e){for(let i=0,s=this.count;i<s;i++)On.fromBufferAttribute(this,i),On.applyNormalMatrix(e),this.setXYZ(i,On.x,On.y,On.z);return this}transformDirection(e){for(let i=0,s=this.count;i<s;i++)On.fromBufferAttribute(this,i),On.transformDirection(e),this.setXYZ(i,On.x,On.y,On.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let s=this.array[e*this.itemSize+i];return this.normalized&&(s=Xo(s,this.array)),s}setComponent(e,i,s){return this.normalized&&(s=gi(s,this.array)),this.array[e*this.itemSize+i]=s,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=Xo(i,this.array)),i}setX(e,i){return this.normalized&&(i=gi(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=Xo(i,this.array)),i}setY(e,i){return this.normalized&&(i=gi(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=Xo(i,this.array)),i}setZ(e,i){return this.normalized&&(i=gi(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=Xo(i,this.array)),i}setW(e,i){return this.normalized&&(i=gi(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,s){return e*=this.itemSize,this.normalized&&(i=gi(i,this.array),s=gi(s,this.array)),this.array[e+0]=i,this.array[e+1]=s,this}setXYZ(e,i,s,l){return e*=this.itemSize,this.normalized&&(i=gi(i,this.array),s=gi(s,this.array),l=gi(l,this.array)),this.array[e+0]=i,this.array[e+1]=s,this.array[e+2]=l,this}setXYZW(e,i,s,l,u){return e*=this.itemSize,this.normalized&&(i=gi(i,this.array),s=gi(s,this.array),l=gi(l,this.array),u=gi(u,this.array)),this.array[e+0]=i,this.array[e+1]=s,this.array[e+2]=l,this.array[e+3]=u,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Og&&(e.usage=this.usage),e}}class ev extends ia{constructor(e,i,s){super(new Uint16Array(e),i,s)}}class nv extends ia{constructor(e,i,s){super(new Uint32Array(e),i,s)}}class Zn extends ia{constructor(e,i,s){super(new Float32Array(e),i,s)}}let DS=0;const Bi=new yn,Cd=new Xn,Or=new et,Ai=new sl,jo=new sl,Vn=new et;class ai extends Kr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:DS++}),this.uuid=il(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Z_(e)?nv:ev)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,s=0){this.groups.push({start:e,count:i,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const u=new Se().getNormalMatrix(e);s.applyNormalMatrix(u),s.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Bi.makeRotationFromQuaternion(e),this.applyMatrix4(Bi),this}rotateX(e){return Bi.makeRotationX(e),this.applyMatrix4(Bi),this}rotateY(e){return Bi.makeRotationY(e),this.applyMatrix4(Bi),this}rotateZ(e){return Bi.makeRotationZ(e),this.applyMatrix4(Bi),this}translate(e,i,s){return Bi.makeTranslation(e,i,s),this.applyMatrix4(Bi),this}scale(e,i,s){return Bi.makeScale(e,i,s),this.applyMatrix4(Bi),this}lookAt(e){return Cd.lookAt(e),Cd.updateMatrix(),this.applyMatrix4(Cd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Or).negate(),this.translate(Or.x,Or.y,Or.z),this}setFromPoints(e){const i=this.getAttribute("position");if(i===void 0){const s=[];for(let l=0,u=e.length;l<u;l++){const d=e[l];s.push(d.x,d.y,d.z||0)}this.setAttribute("position",new Zn(s,3))}else{const s=Math.min(e.length,i.count);for(let l=0;l<s;l++){const u=e[l];i.setXYZ(l,u.x,u.y,u.z||0)}e.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sl);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new et(-1/0,-1/0,-1/0),new et(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let s=0,l=i.length;s<l;s++){const u=i[s];Ai.setFromBufferAttribute(u),this.morphTargetsRelative?(Vn.addVectors(this.boundingBox.min,Ai.min),this.boundingBox.expandByPoint(Vn),Vn.addVectors(this.boundingBox.max,Ai.max),this.boundingBox.expandByPoint(Vn)):(this.boundingBox.expandByPoint(Ai.min),this.boundingBox.expandByPoint(Ai.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jc);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new et,1/0);return}if(e){const s=this.boundingSphere.center;if(Ai.setFromBufferAttribute(e),i)for(let u=0,d=i.length;u<d;u++){const h=i[u];jo.setFromBufferAttribute(h),this.morphTargetsRelative?(Vn.addVectors(Ai.min,jo.min),Ai.expandByPoint(Vn),Vn.addVectors(Ai.max,jo.max),Ai.expandByPoint(Vn)):(Ai.expandByPoint(jo.min),Ai.expandByPoint(jo.max))}Ai.getCenter(s);let l=0;for(let u=0,d=e.count;u<d;u++)Vn.fromBufferAttribute(e,u),l=Math.max(l,s.distanceToSquared(Vn));if(i)for(let u=0,d=i.length;u<d;u++){const h=i[u],m=this.morphTargetsRelative;for(let p=0,v=h.count;p<v;p++)Vn.fromBufferAttribute(h,p),m&&(Or.fromBufferAttribute(e,p),Vn.add(Or)),l=Math.max(l,s.distanceToSquared(Vn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=i.position,l=i.normal,u=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ia(new Float32Array(4*s.count),4));const d=this.getAttribute("tangent"),h=[],m=[];for(let q=0;q<s.count;q++)h[q]=new et,m[q]=new et;const p=new et,v=new et,x=new et,y=new qe,M=new qe,T=new qe,w=new et,S=new et;function g(q,D,C){p.fromBufferAttribute(s,q),v.fromBufferAttribute(s,D),x.fromBufferAttribute(s,C),y.fromBufferAttribute(u,q),M.fromBufferAttribute(u,D),T.fromBufferAttribute(u,C),v.sub(p),x.sub(p),M.sub(y),T.sub(y);const G=1/(M.x*T.y-T.x*M.y);isFinite(G)&&(w.copy(v).multiplyScalar(T.y).addScaledVector(x,-M.y).multiplyScalar(G),S.copy(x).multiplyScalar(M.x).addScaledVector(v,-T.x).multiplyScalar(G),h[q].add(w),h[D].add(w),h[C].add(w),m[q].add(S),m[D].add(S),m[C].add(S))}let F=this.groups;F.length===0&&(F=[{start:0,count:e.count}]);for(let q=0,D=F.length;q<D;++q){const C=F[q],G=C.start,ft=C.count;for(let st=G,Mt=G+ft;st<Mt;st+=3)g(e.getX(st+0),e.getX(st+1),e.getX(st+2))}const N=new et,U=new et,W=new et,V=new et;function P(q){W.fromBufferAttribute(l,q),V.copy(W);const D=h[q];N.copy(D),N.sub(W.multiplyScalar(W.dot(D))).normalize(),U.crossVectors(V,D);const G=U.dot(m[q])<0?-1:1;d.setXYZW(q,N.x,N.y,N.z,G)}for(let q=0,D=F.length;q<D;++q){const C=F[q],G=C.start,ft=C.count;for(let st=G,Mt=G+ft;st<Mt;st+=3)P(e.getX(st+0)),P(e.getX(st+1)),P(e.getX(st+2))}}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new ia(new Float32Array(i.count*3),3),this.setAttribute("normal",s);else for(let y=0,M=s.count;y<M;y++)s.setXYZ(y,0,0,0);const l=new et,u=new et,d=new et,h=new et,m=new et,p=new et,v=new et,x=new et;if(e)for(let y=0,M=e.count;y<M;y+=3){const T=e.getX(y+0),w=e.getX(y+1),S=e.getX(y+2);l.fromBufferAttribute(i,T),u.fromBufferAttribute(i,w),d.fromBufferAttribute(i,S),v.subVectors(d,u),x.subVectors(l,u),v.cross(x),h.fromBufferAttribute(s,T),m.fromBufferAttribute(s,w),p.fromBufferAttribute(s,S),h.add(v),m.add(v),p.add(v),s.setXYZ(T,h.x,h.y,h.z),s.setXYZ(w,m.x,m.y,m.z),s.setXYZ(S,p.x,p.y,p.z)}else for(let y=0,M=i.count;y<M;y+=3)l.fromBufferAttribute(i,y+0),u.fromBufferAttribute(i,y+1),d.fromBufferAttribute(i,y+2),v.subVectors(d,u),x.subVectors(l,u),v.cross(x),s.setXYZ(y+0,v.x,v.y,v.z),s.setXYZ(y+1,v.x,v.y,v.z),s.setXYZ(y+2,v.x,v.y,v.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,s=e.count;i<s;i++)Vn.fromBufferAttribute(e,i),Vn.normalize(),e.setXYZ(i,Vn.x,Vn.y,Vn.z)}toNonIndexed(){function e(h,m){const p=h.array,v=h.itemSize,x=h.normalized,y=new p.constructor(m.length*v);let M=0,T=0;for(let w=0,S=m.length;w<S;w++){h.isInterleavedBufferAttribute?M=m[w]*h.data.stride+h.offset:M=m[w]*v;for(let g=0;g<v;g++)y[T++]=p[M++]}return new ia(y,v,x)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new ai,s=this.index.array,l=this.attributes;for(const h in l){const m=l[h],p=e(m,s);i.setAttribute(h,p)}const u=this.morphAttributes;for(const h in u){const m=[],p=u[h];for(let v=0,x=p.length;v<x;v++){const y=p[v],M=e(y,s);m.push(M)}i.morphAttributes[h]=m}i.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let h=0,m=d.length;h<m;h++){const p=d[h];i.addGroup(p.start,p.count,p.materialIndex)}return i}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(e[p]=m[p]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const s=this.attributes;for(const m in s){const p=s[m];e.data.attributes[m]=p.toJSON(e.data)}const l={};let u=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],v=[];for(let x=0,y=p.length;x<y;x++){const M=p[x];v.push(M.toJSON(e.data))}v.length>0&&(l[m]=v,u=!0)}u&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(e.data.groups=JSON.parse(JSON.stringify(d)));const h=this.boundingSphere;return h!==null&&(e.data.boundingSphere={center:h.center.toArray(),radius:h.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone(i));const l=e.attributes;for(const p in l){const v=l[p];this.setAttribute(p,v.clone(i))}const u=e.morphAttributes;for(const p in u){const v=[],x=u[p];for(let y=0,M=x.length;y<M;y++)v.push(x[y].clone(i));this.morphAttributes[p]=v}this.morphTargetsRelative=e.morphTargetsRelative;const d=e.groups;for(let p=0,v=d.length;p<v;p++){const x=d[p];this.addGroup(x.start,x.count,x.materialIndex)}const h=e.boundingBox;h!==null&&(this.boundingBox=h.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const jg=new yn,zs=new J_,bc=new Jc,Zg=new et,Tc=new et,Ac=new et,wc=new et,Dd=new et,Rc=new et,Kg=new et,Cc=new et;class Wt extends Xn{constructor(e=new ai,i=new Ih){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=l.length;u<d;u++){const h=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=u}}}}getVertexPosition(e,i){const s=this.geometry,l=s.attributes.position,u=s.morphAttributes.position,d=s.morphTargetsRelative;i.fromBufferAttribute(l,e);const h=this.morphTargetInfluences;if(u&&h){Rc.set(0,0,0);for(let m=0,p=u.length;m<p;m++){const v=h[m],x=u[m];v!==0&&(Dd.fromBufferAttribute(x,e),d?Rc.addScaledVector(Dd,v):Rc.addScaledVector(Dd.sub(i),v))}i.add(Rc)}return i}raycast(e,i){const s=this.geometry,l=this.material,u=this.matrixWorld;l!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),bc.copy(s.boundingSphere),bc.applyMatrix4(u),zs.copy(e.ray).recast(e.near),!(bc.containsPoint(zs.origin)===!1&&(zs.intersectSphere(bc,Zg)===null||zs.origin.distanceToSquared(Zg)>(e.far-e.near)**2))&&(jg.copy(u).invert(),zs.copy(e.ray).applyMatrix4(jg),!(s.boundingBox!==null&&zs.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,i,zs)))}_computeIntersections(e,i,s){let l;const u=this.geometry,d=this.material,h=u.index,m=u.attributes.position,p=u.attributes.uv,v=u.attributes.uv1,x=u.attributes.normal,y=u.groups,M=u.drawRange;if(h!==null)if(Array.isArray(d))for(let T=0,w=y.length;T<w;T++){const S=y[T],g=d[S.materialIndex],F=Math.max(S.start,M.start),N=Math.min(h.count,Math.min(S.start+S.count,M.start+M.count));for(let U=F,W=N;U<W;U+=3){const V=h.getX(U),P=h.getX(U+1),q=h.getX(U+2);l=Dc(this,g,e,s,p,v,x,V,P,q),l&&(l.faceIndex=Math.floor(U/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const T=Math.max(0,M.start),w=Math.min(h.count,M.start+M.count);for(let S=T,g=w;S<g;S+=3){const F=h.getX(S),N=h.getX(S+1),U=h.getX(S+2);l=Dc(this,d,e,s,p,v,x,F,N,U),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(d))for(let T=0,w=y.length;T<w;T++){const S=y[T],g=d[S.materialIndex],F=Math.max(S.start,M.start),N=Math.min(m.count,Math.min(S.start+S.count,M.start+M.count));for(let U=F,W=N;U<W;U+=3){const V=U,P=U+1,q=U+2;l=Dc(this,g,e,s,p,v,x,V,P,q),l&&(l.faceIndex=Math.floor(U/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const T=Math.max(0,M.start),w=Math.min(m.count,M.start+M.count);for(let S=T,g=w;S<g;S+=3){const F=S,N=S+1,U=S+2;l=Dc(this,d,e,s,p,v,x,F,N,U),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}}}function US(o,e,i,s,l,u,d,h){let m;if(e.side===_i?m=s.intersectTriangle(d,u,l,!0,h):m=s.intersectTriangle(l,u,d,e.side===hs,h),m===null)return null;Cc.copy(h),Cc.applyMatrix4(o.matrixWorld);const p=i.ray.origin.distanceTo(Cc);return p<i.near||p>i.far?null:{distance:p,point:Cc.clone(),object:o}}function Dc(o,e,i,s,l,u,d,h,m,p){o.getVertexPosition(h,Tc),o.getVertexPosition(m,Ac),o.getVertexPosition(p,wc);const v=US(o,e,i,s,Tc,Ac,wc,Kg);if(v){const x=new et;Wi.getBarycoord(Kg,Tc,Ac,wc,x),l&&(v.uv=Wi.getInterpolatedAttribute(l,h,m,p,x,new qe)),u&&(v.uv1=Wi.getInterpolatedAttribute(u,h,m,p,x,new qe)),d&&(v.normal=Wi.getInterpolatedAttribute(d,h,m,p,x,new et),v.normal.dot(s.direction)>0&&v.normal.multiplyScalar(-1));const y={a:h,b:m,c:p,normal:new et,materialIndex:0};Wi.getNormal(Tc,Ac,wc,y.normal),v.face=y,v.barycoord=x}return v}class fe extends ai{constructor(e=1,i=1,s=1,l=1,u=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:s,widthSegments:l,heightSegments:u,depthSegments:d};const h=this;l=Math.floor(l),u=Math.floor(u),d=Math.floor(d);const m=[],p=[],v=[],x=[];let y=0,M=0;T("z","y","x",-1,-1,s,i,e,d,u,0),T("z","y","x",1,-1,s,i,-e,d,u,1),T("x","z","y",1,1,e,s,i,l,d,2),T("x","z","y",1,-1,e,s,-i,l,d,3),T("x","y","z",1,-1,e,i,s,l,u,4),T("x","y","z",-1,-1,e,i,-s,l,u,5),this.setIndex(m),this.setAttribute("position",new Zn(p,3)),this.setAttribute("normal",new Zn(v,3)),this.setAttribute("uv",new Zn(x,2));function T(w,S,g,F,N,U,W,V,P,q,D){const C=U/P,G=W/q,ft=U/2,st=W/2,Mt=V/2,Et=P+1,z=q+1;let $=0,tt=0;const Pt=new et;for(let Ft=0;Ft<z;Ft++){const L=Ft*G-st;for(let rt=0;rt<Et;rt++){const Nt=rt*C-ft;Pt[w]=Nt*F,Pt[S]=L*N,Pt[g]=Mt,p.push(Pt.x,Pt.y,Pt.z),Pt[w]=0,Pt[S]=0,Pt[g]=V>0?1:-1,v.push(Pt.x,Pt.y,Pt.z),x.push(rt/P),x.push(1-Ft/q),$+=1}}for(let Ft=0;Ft<q;Ft++)for(let L=0;L<P;L++){const rt=y+L+Et*Ft,Nt=y+L+Et*(Ft+1),K=y+(L+1)+Et*(Ft+1),yt=y+(L+1)+Et*Ft;m.push(rt,Nt,yt),m.push(Nt,K,yt),tt+=6}h.addGroup(M,tt,D),M+=tt,y+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fe(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Zr(o){const e={};for(const i in o){e[i]={};for(const s in o[i]){const l=o[i][s];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][s]=null):e[i][s]=l.clone():Array.isArray(l)?e[i][s]=l.slice():e[i][s]=l}}return e}function li(o){const e={};for(let i=0;i<o.length;i++){const s=Zr(o[i]);for(const l in s)e[l]=s[l]}return e}function LS(o){const e=[];for(let i=0;i<o.length;i++)e.push(o[i].clone());return e}function iv(o){const e=o.getRenderTarget();return e===null?o.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Xe.workingColorSpace}const NS={clone:Zr,merge:li};var OS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ps extends Qr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=OS,this.fragmentShader=zS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zr(e.uniforms),this.uniformsGroups=LS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const d=this.uniforms[l].value;d&&d.isTexture?i.uniforms[l]={type:"t",value:d.toJSON(e).uuid}:d&&d.isColor?i.uniforms[l]={type:"c",value:d.getHex()}:d&&d.isVector2?i.uniforms[l]={type:"v2",value:d.toArray()}:d&&d.isVector3?i.uniforms[l]={type:"v3",value:d.toArray()}:d&&d.isVector4?i.uniforms[l]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?i.uniforms[l]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?i.uniforms[l]={type:"m4",value:d.toArray()}:i.uniforms[l]={value:d}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const s={};for(const l in this.extensions)this.extensions[l]===!0&&(s[l]=!0);return Object.keys(s).length>0&&(i.extensions=s),i}}class av extends Xn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yn,this.projectionMatrix=new yn,this.projectionMatrixInverse=new yn,this.coordinateSystem=Ua}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,i){super.updateWorldMatrix(e,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const cs=new et,Qg=new qe,Jg=new qe;class wi extends av{constructor(e=50,i=1,s=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=wh*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ud*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return wh*2*Math.atan(Math.tan(ud*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,i,s){cs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(cs.x,cs.y).multiplyScalar(-e/cs.z),cs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(cs.x,cs.y).multiplyScalar(-e/cs.z)}getViewSize(e,i){return this.getViewBounds(e,Qg,Jg),i.subVectors(Jg,Qg)}setViewOffset(e,i,s,l,u,d){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(ud*.5*this.fov)/this.zoom,s=2*i,l=this.aspect*s,u=-.5*l;const d=this.view;if(this.view!==null&&this.view.enabled){const m=d.fullWidth,p=d.fullHeight;u+=d.offsetX*l/m,i-=d.offsetY*s/p,l*=d.width/m,s*=d.height/p}const h=this.filmOffset;h!==0&&(u+=e*h/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+l,i,i-s,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const zr=-90,Pr=1;class PS extends Xn{constructor(e,i,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new wi(zr,Pr,e,i);l.layers=this.layers,this.add(l);const u=new wi(zr,Pr,e,i);u.layers=this.layers,this.add(u);const d=new wi(zr,Pr,e,i);d.layers=this.layers,this.add(d);const h=new wi(zr,Pr,e,i);h.layers=this.layers,this.add(h);const m=new wi(zr,Pr,e,i);m.layers=this.layers,this.add(m);const p=new wi(zr,Pr,e,i);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[s,l,u,d,h,m]=i;for(const p of i)this.remove(p);if(e===Ua)s.up.set(0,1,0),s.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),h.up.set(0,1,0),h.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===Wc)s.up.set(0,-1,0),s.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),h.up.set(0,-1,0),h.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of i)this.add(p),p.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[u,d,h,m,p,v]=this.children,x=e.getRenderTarget(),y=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),T=e.xr.enabled;e.xr.enabled=!1;const w=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,e.setRenderTarget(s,0,l),e.render(i,u),e.setRenderTarget(s,1,l),e.render(i,d),e.setRenderTarget(s,2,l),e.render(i,h),e.setRenderTarget(s,3,l),e.render(i,m),e.setRenderTarget(s,4,l),e.render(i,p),s.texture.generateMipmaps=w,e.setRenderTarget(s,5,l),e.render(i,v),e.setRenderTarget(x,y,M),e.xr.enabled=T,s.texture.needsPMREMUpdate=!0}}class sv extends ci{constructor(e,i,s,l,u,d,h,m,p,v){e=e!==void 0?e:[],i=i!==void 0?i:Xr,super(e,i,s,l,u,d,h,m,p,v),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class IS extends Ys{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},l=[s,s,s,s,s,s];this.texture=new sv(l,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:na}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new fe(5,5,5),u=new ps({name:"CubemapFromEquirect",uniforms:Zr(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:_i,blending:fs});u.uniforms.tEquirect.value=i;const d=new Wt(l,u),h=i.minFilter;return i.minFilter===qs&&(i.minFilter=na),new PS(1,10,this).update(e,d),i.minFilter=h,d.geometry.dispose(),d.material.dispose(),this}clear(e,i,s,l){const u=e.getRenderTarget();for(let d=0;d<6;d++)e.setRenderTarget(this,d),e.clear(i,s,l);e.setRenderTarget(u)}}class Bh{constructor(e,i=1,s=1e3){this.isFog=!0,this.name="",this.color=new Ue(e),this.near=i,this.far=s}clone(){return new Bh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class BS extends Xn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new aa,this.environmentIntensity=1,this.environmentRotation=new aa,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}const Ud=new et,FS=new et,HS=new Se;class Fs{constructor(e=new et(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,s,l){return this.normal.set(e,i,s),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,s){const l=Ud.subVectors(s,i).cross(FS.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i){const s=e.delta(Ud),l=this.normal.dot(s);if(l===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const u=-(e.start.dot(this.normal)+this.constant)/l;return u<0||u>1?null:i.copy(e.start).addScaledVector(s,u)}intersectsLine(e){const i=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return i<0&&s>0||s<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const s=i||HS.getNormalMatrix(e),l=this.coplanarPoint(Ud).applyMatrix4(e),u=this.normal.applyMatrix3(s).normalize();return this.constant=-l.dot(u),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ps=new Jc,Uc=new et;class Fh{constructor(e=new Fs,i=new Fs,s=new Fs,l=new Fs,u=new Fs,d=new Fs){this.planes=[e,i,s,l,u,d]}set(e,i,s,l,u,d){const h=this.planes;return h[0].copy(e),h[1].copy(i),h[2].copy(s),h[3].copy(l),h[4].copy(u),h[5].copy(d),this}copy(e){const i=this.planes;for(let s=0;s<6;s++)i[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,i=Ua){const s=this.planes,l=e.elements,u=l[0],d=l[1],h=l[2],m=l[3],p=l[4],v=l[5],x=l[6],y=l[7],M=l[8],T=l[9],w=l[10],S=l[11],g=l[12],F=l[13],N=l[14],U=l[15];if(s[0].setComponents(m-u,y-p,S-M,U-g).normalize(),s[1].setComponents(m+u,y+p,S+M,U+g).normalize(),s[2].setComponents(m+d,y+v,S+T,U+F).normalize(),s[3].setComponents(m-d,y-v,S-T,U-F).normalize(),s[4].setComponents(m-h,y-x,S-w,U-N).normalize(),i===Ua)s[5].setComponents(m+h,y+x,S+w,U+N).normalize();else if(i===Wc)s[5].setComponents(h,x,w,N).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ps.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),Ps.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ps)}intersectsSprite(e){return Ps.center.set(0,0,0),Ps.radius=.7071067811865476,Ps.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ps)}intersectsSphere(e){const i=this.planes,s=e.center,l=-e.radius;for(let u=0;u<6;u++)if(i[u].distanceToPoint(s)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let s=0;s<6;s++){const l=i[s];if(Uc.x=l.normal.x>0?e.max.x:e.min.x,Uc.y=l.normal.y>0?e.max.y:e.min.y,Uc.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(Uc)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let s=0;s<6;s++)if(i[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class kc extends Qr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const jc=new et,Zc=new et,$g=new yn,Zo=new J_,Lc=new Jc,Ld=new et,t_=new et;class Ko extends Xn{constructor(e=new ai,i=new kc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=i,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,s=[0];for(let l=1,u=i.count;l<u;l++)jc.fromBufferAttribute(i,l-1),Zc.fromBufferAttribute(i,l),s[l]=s[l-1],s[l]+=jc.distanceTo(Zc);e.setAttribute("lineDistance",new Zn(s,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,i){const s=this.geometry,l=this.matrixWorld,u=e.params.Line.threshold,d=s.drawRange;if(s.boundingSphere===null&&s.computeBoundingSphere(),Lc.copy(s.boundingSphere),Lc.applyMatrix4(l),Lc.radius+=u,e.ray.intersectsSphere(Lc)===!1)return;$g.copy(l).invert(),Zo.copy(e.ray).applyMatrix4($g);const h=u/((this.scale.x+this.scale.y+this.scale.z)/3),m=h*h,p=this.isLineSegments?2:1,v=s.index,y=s.attributes.position;if(v!==null){const M=Math.max(0,d.start),T=Math.min(v.count,d.start+d.count);for(let w=M,S=T-1;w<S;w+=p){const g=v.getX(w),F=v.getX(w+1),N=Nc(this,e,Zo,m,g,F);N&&i.push(N)}if(this.isLineLoop){const w=v.getX(T-1),S=v.getX(M),g=Nc(this,e,Zo,m,w,S);g&&i.push(g)}}else{const M=Math.max(0,d.start),T=Math.min(y.count,d.start+d.count);for(let w=M,S=T-1;w<S;w+=p){const g=Nc(this,e,Zo,m,w,w+1);g&&i.push(g)}if(this.isLineLoop){const w=Nc(this,e,Zo,m,T-1,M);w&&i.push(w)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=l.length;u<d;u++){const h=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=u}}}}}function Nc(o,e,i,s,l,u){const d=o.geometry.attributes.position;if(jc.fromBufferAttribute(d,l),Zc.fromBufferAttribute(d,u),i.distanceSqToSegment(jc,Zc,Ld,t_)>s)return;Ld.applyMatrix4(o.matrixWorld);const m=e.ray.origin.distanceTo(Ld);if(!(m<e.near||m>e.far))return{distance:m,point:t_.clone().applyMatrix4(o.matrixWorld),index:l,face:null,faceIndex:null,barycoord:null,object:o}}class kn extends Xn{constructor(){super(),this.isGroup=!0,this.type="Group"}}class Oc extends ci{constructor(e,i,s,l,u,d,h,m,p){super(e,i,s,l,u,d,h,m,p),this.isCanvasTexture=!0,this.needsUpdate=!0}}class rv extends ci{constructor(e,i,s,l,u,d,h,m,p,v=Gr){if(v!==Gr&&v!==Yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");s===void 0&&v===Gr&&(s=Ws),s===void 0&&v===Yr&&(s=Wr),super(null,l,u,d,h,m,v,s,p),this.isDepthTexture=!0,this.image={width:e,height:i},this.magFilter=h!==void 0?h:ji,this.minFilter=m!==void 0?m:ji,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class Ca extends ai{constructor(e=1,i=1,s=1,l=32,u=1,d=!1,h=0,m=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:i,height:s,radialSegments:l,heightSegments:u,openEnded:d,thetaStart:h,thetaLength:m};const p=this;l=Math.floor(l),u=Math.floor(u);const v=[],x=[],y=[],M=[];let T=0;const w=[],S=s/2;let g=0;F(),d===!1&&(e>0&&N(!0),i>0&&N(!1)),this.setIndex(v),this.setAttribute("position",new Zn(x,3)),this.setAttribute("normal",new Zn(y,3)),this.setAttribute("uv",new Zn(M,2));function F(){const U=new et,W=new et;let V=0;const P=(i-e)/s;for(let q=0;q<=u;q++){const D=[],C=q/u,G=C*(i-e)+e;for(let ft=0;ft<=l;ft++){const st=ft/l,Mt=st*m+h,Et=Math.sin(Mt),z=Math.cos(Mt);W.x=G*Et,W.y=-C*s+S,W.z=G*z,x.push(W.x,W.y,W.z),U.set(Et,P,z).normalize(),y.push(U.x,U.y,U.z),M.push(st,1-C),D.push(T++)}w.push(D)}for(let q=0;q<l;q++)for(let D=0;D<u;D++){const C=w[D][q],G=w[D+1][q],ft=w[D+1][q+1],st=w[D][q+1];(e>0||D!==0)&&(v.push(C,G,st),V+=3),(i>0||D!==u-1)&&(v.push(G,ft,st),V+=3)}p.addGroup(g,V,0),g+=V}function N(U){const W=T,V=new qe,P=new et;let q=0;const D=U===!0?e:i,C=U===!0?1:-1;for(let ft=1;ft<=l;ft++)x.push(0,S*C,0),y.push(0,C,0),M.push(.5,.5),T++;const G=T;for(let ft=0;ft<=l;ft++){const Mt=ft/l*m+h,Et=Math.cos(Mt),z=Math.sin(Mt);P.x=D*z,P.y=S*C,P.z=D*Et,x.push(P.x,P.y,P.z),y.push(0,C,0),V.x=Et*.5+.5,V.y=z*.5*C+.5,M.push(V.x,V.y),T++}for(let ft=0;ft<l;ft++){const st=W+ft,Mt=G+ft;U===!0?v.push(Mt,Mt+1,st):v.push(Mt+1,Mt,st),q+=3}p.addGroup(g,q,U===!0?1:2),g+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ca(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Kc extends Ca{constructor(e=1,i=1,s=32,l=1,u=!1,d=0,h=Math.PI*2){super(0,e,i,s,l,u,d,h),this.type="ConeGeometry",this.parameters={radius:e,height:i,radialSegments:s,heightSegments:l,openEnded:u,thetaStart:d,thetaLength:h}}static fromJSON(e){return new Kc(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ta extends ai{constructor(e=1,i=1,s=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:s,heightSegments:l};const u=e/2,d=i/2,h=Math.floor(s),m=Math.floor(l),p=h+1,v=m+1,x=e/h,y=i/m,M=[],T=[],w=[],S=[];for(let g=0;g<v;g++){const F=g*y-d;for(let N=0;N<p;N++){const U=N*x-u;T.push(U,-F,0),w.push(0,0,1),S.push(N/h),S.push(1-g/m)}}for(let g=0;g<m;g++)for(let F=0;F<h;F++){const N=F+p*g,U=F+p*(g+1),W=F+1+p*(g+1),V=F+1+p*g;M.push(N,U,V),M.push(U,W,V)}this.setIndex(M),this.setAttribute("position",new Zn(T,3)),this.setAttribute("normal",new Zn(w,3)),this.setAttribute("uv",new Zn(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ta(e.width,e.height,e.widthSegments,e.heightSegments)}}class Vs extends ai{constructor(e=1,i=32,s=16,l=0,u=Math.PI*2,d=0,h=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:i,heightSegments:s,phiStart:l,phiLength:u,thetaStart:d,thetaLength:h},i=Math.max(3,Math.floor(i)),s=Math.max(2,Math.floor(s));const m=Math.min(d+h,Math.PI);let p=0;const v=[],x=new et,y=new et,M=[],T=[],w=[],S=[];for(let g=0;g<=s;g++){const F=[],N=g/s;let U=0;g===0&&d===0?U=.5/i:g===s&&m===Math.PI&&(U=-.5/i);for(let W=0;W<=i;W++){const V=W/i;x.x=-e*Math.cos(l+V*u)*Math.sin(d+N*h),x.y=e*Math.cos(d+N*h),x.z=e*Math.sin(l+V*u)*Math.sin(d+N*h),T.push(x.x,x.y,x.z),y.copy(x).normalize(),w.push(y.x,y.y,y.z),S.push(V+U,1-N),F.push(p++)}v.push(F)}for(let g=0;g<s;g++)for(let F=0;F<i;F++){const N=v[g][F+1],U=v[g][F],W=v[g+1][F],V=v[g+1][F+1];(g!==0||d>0)&&M.push(N,U,V),(g!==s-1||m<Math.PI)&&M.push(U,W,V)}this.setIndex(M),this.setAttribute("position",new Zn(T,3)),this.setAttribute("normal",new Zn(w,3)),this.setAttribute("uv",new Zn(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vs(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class tl extends ai{constructor(e=1,i=.4,s=12,l=48,u=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:i,radialSegments:s,tubularSegments:l,arc:u},s=Math.floor(s),l=Math.floor(l);const d=[],h=[],m=[],p=[],v=new et,x=new et,y=new et;for(let M=0;M<=s;M++)for(let T=0;T<=l;T++){const w=T/l*u,S=M/s*Math.PI*2;x.x=(e+i*Math.cos(S))*Math.cos(w),x.y=(e+i*Math.cos(S))*Math.sin(w),x.z=i*Math.sin(S),h.push(x.x,x.y,x.z),v.x=e*Math.cos(w),v.y=e*Math.sin(w),y.subVectors(x,v).normalize(),m.push(y.x,y.y,y.z),p.push(T/l),p.push(M/s)}for(let M=1;M<=s;M++)for(let T=1;T<=l;T++){const w=(l+1)*M+T-1,S=(l+1)*(M-1)+T-1,g=(l+1)*(M-1)+T,F=(l+1)*M+T;d.push(w,S,F),d.push(S,g,F)}this.setIndex(d),this.setAttribute("position",new Zn(h,3)),this.setAttribute("normal",new Zn(m,3)),this.setAttribute("uv",new Zn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tl(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class ve extends Qr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Y_,this.normalScale=new qe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new aa,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class GS extends Qr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=eS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class VS extends Qr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class $c extends Xn{constructor(e,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Ue(e),this.intensity=i}dispose(){}copy(e,i){return super.copy(e,i),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const i=super.toJSON(e);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,this.groundColor!==void 0&&(i.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(i.object.distance=this.distance),this.angle!==void 0&&(i.object.angle=this.angle),this.decay!==void 0&&(i.object.decay=this.decay),this.penumbra!==void 0&&(i.object.penumbra=this.penumbra),this.shadow!==void 0&&(i.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(i.object.target=this.target.uuid),i}}class kS extends $c{constructor(e,i,s){super(e,s),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ue(i)}copy(e,i){return super.copy(e,i),this.groundColor.copy(e.groundColor),this}}const Nd=new yn,e_=new et,n_=new et;class ov{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new qe(512,512),this.map=null,this.mapPass=null,this.matrix=new yn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Fh,this._frameExtents=new qe(1,1),this._viewportCount=1,this._viewports=[new on(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const i=this.camera,s=this.matrix;e_.setFromMatrixPosition(e.matrixWorld),i.position.copy(e_),n_.setFromMatrixPosition(e.target.matrixWorld),i.lookAt(n_),i.updateMatrixWorld(),Nd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Nd),s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(Nd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const i_=new yn,Qo=new et,Od=new et;class XS extends ov{constructor(){super(new wi(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new qe(4,2),this._viewportCount=6,this._viewports=[new on(2,1,1,1),new on(0,1,1,1),new on(3,1,1,1),new on(1,1,1,1),new on(3,0,1,1),new on(1,0,1,1)],this._cubeDirections=[new et(1,0,0),new et(-1,0,0),new et(0,0,1),new et(0,0,-1),new et(0,1,0),new et(0,-1,0)],this._cubeUps=[new et(0,1,0),new et(0,1,0),new et(0,1,0),new et(0,1,0),new et(0,0,1),new et(0,0,-1)]}updateMatrices(e,i=0){const s=this.camera,l=this.matrix,u=e.distance||s.far;u!==s.far&&(s.far=u,s.updateProjectionMatrix()),Qo.setFromMatrixPosition(e.matrixWorld),s.position.copy(Qo),Od.copy(s.position),Od.add(this._cubeDirections[i]),s.up.copy(this._cubeUps[i]),s.lookAt(Od),s.updateMatrixWorld(),l.makeTranslation(-Qo.x,-Qo.y,-Qo.z),i_.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),this._frustum.setFromProjectionMatrix(i_)}}class Jo extends $c{constructor(e,i,s=0,l=2){super(e,i),this.isPointLight=!0,this.type="PointLight",this.distance=s,this.decay=l,this.shadow=new XS}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,i){return super.copy(e,i),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class lv extends av{constructor(e=-1,i=1,s=1,l=-1,u=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=s,this.bottom=l,this.near=u,this.far=d,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,s,l,u,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let u=s-e,d=s+e,h=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,v=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=p*this.view.offsetX,d=u+p*this.view.width,h-=v*this.view.offsetY,m=h-v*this.view.height}this.projectionMatrix.makeOrthographic(u,d,h,m,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class qS extends ov{constructor(){super(new lv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class WS extends $c{constructor(e,i){super(e,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xn.DEFAULT_UP),this.updateMatrix(),this.target=new Xn,this.shadow=new qS}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class YS extends $c{constructor(e,i){super(e,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class jS extends wi{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ZS{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=a_(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const i=a_();e=(i-this.oldTime)/1e3,this.oldTime=i,this.elapsedTime+=e}return e}}function a_(){return performance.now()}function s_(o,e,i,s){const l=KS(s);switch(i){case H_:return o*e;case V_:return o*e;case k_:return o*e*2;case X_:return o*e/l.components*l.byteLength;case Oh:return o*e/l.components*l.byteLength;case q_:return o*e*2/l.components*l.byteLength;case zh:return o*e*2/l.components*l.byteLength;case G_:return o*e*3/l.components*l.byteLength;case Yi:return o*e*4/l.components*l.byteLength;case Ph:return o*e*4/l.components*l.byteLength;case Bc:case Fc:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case Hc:case Gc:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case nh:case ah:return Math.max(o,16)*Math.max(e,8)/4;case eh:case ih:return Math.max(o,8)*Math.max(e,8)/2;case sh:case rh:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case oh:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case lh:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case ch:return Math.floor((o+4)/5)*Math.floor((e+3)/4)*16;case uh:return Math.floor((o+4)/5)*Math.floor((e+4)/5)*16;case fh:return Math.floor((o+5)/6)*Math.floor((e+4)/5)*16;case dh:return Math.floor((o+5)/6)*Math.floor((e+5)/6)*16;case hh:return Math.floor((o+7)/8)*Math.floor((e+4)/5)*16;case ph:return Math.floor((o+7)/8)*Math.floor((e+5)/6)*16;case mh:return Math.floor((o+7)/8)*Math.floor((e+7)/8)*16;case gh:return Math.floor((o+9)/10)*Math.floor((e+4)/5)*16;case _h:return Math.floor((o+9)/10)*Math.floor((e+5)/6)*16;case vh:return Math.floor((o+9)/10)*Math.floor((e+7)/8)*16;case xh:return Math.floor((o+9)/10)*Math.floor((e+9)/10)*16;case yh:return Math.floor((o+11)/12)*Math.floor((e+9)/10)*16;case Sh:return Math.floor((o+11)/12)*Math.floor((e+11)/12)*16;case Vc:case Mh:case Eh:return Math.ceil(o/4)*Math.ceil(e/4)*16;case W_:case bh:return Math.ceil(o/4)*Math.ceil(e/4)*8;case Th:case Ah:return Math.ceil(o/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function KS(o){switch(o){case Na:case I_:return{byteLength:1,components:1};case el:case B_:case nl:return{byteLength:2,components:1};case Lh:case Nh:return{byteLength:2,components:4};case Ws:case Uh:case Da:return{byteLength:4,components:1};case F_:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${o}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Dh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Dh);function cv(){let o=null,e=!1,i=null,s=null;function l(u,d){i(u,d),s=o.requestAnimationFrame(l)}return{start:function(){e!==!0&&i!==null&&(s=o.requestAnimationFrame(l),e=!0)},stop:function(){o.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(u){i=u},setContext:function(u){o=u}}}function QS(o){const e=new WeakMap;function i(h,m){const p=h.array,v=h.usage,x=p.byteLength,y=o.createBuffer();o.bindBuffer(m,y),o.bufferData(m,p,v),h.onUploadCallback();let M;if(p instanceof Float32Array)M=o.FLOAT;else if(p instanceof Uint16Array)h.isFloat16BufferAttribute?M=o.HALF_FLOAT:M=o.UNSIGNED_SHORT;else if(p instanceof Int16Array)M=o.SHORT;else if(p instanceof Uint32Array)M=o.UNSIGNED_INT;else if(p instanceof Int32Array)M=o.INT;else if(p instanceof Int8Array)M=o.BYTE;else if(p instanceof Uint8Array)M=o.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)M=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:y,type:M,bytesPerElement:p.BYTES_PER_ELEMENT,version:h.version,size:x}}function s(h,m,p){const v=m.array,x=m.updateRanges;if(o.bindBuffer(p,h),x.length===0)o.bufferSubData(p,0,v);else{x.sort((M,T)=>M.start-T.start);let y=0;for(let M=1;M<x.length;M++){const T=x[y],w=x[M];w.start<=T.start+T.count+1?T.count=Math.max(T.count,w.start+w.count-T.start):(++y,x[y]=w)}x.length=y+1;for(let M=0,T=x.length;M<T;M++){const w=x[M];o.bufferSubData(p,w.start*v.BYTES_PER_ELEMENT,v,w.start,w.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(h){return h.isInterleavedBufferAttribute&&(h=h.data),e.get(h)}function u(h){h.isInterleavedBufferAttribute&&(h=h.data);const m=e.get(h);m&&(o.deleteBuffer(m.buffer),e.delete(h))}function d(h,m){if(h.isInterleavedBufferAttribute&&(h=h.data),h.isGLBufferAttribute){const v=e.get(h);(!v||v.version<h.version)&&e.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}const p=e.get(h);if(p===void 0)e.set(h,i(h,m));else if(p.version<h.version){if(p.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,h,m),p.version=h.version}}return{get:l,remove:u,update:d}}var JS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$S=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,tM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,eM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,iM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,sM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,oM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,uM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,fM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,dM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,hM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,pM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_M=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,vM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,xM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,yM=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,SM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,MM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,EM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,bM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,TM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,AM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,wM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,RM="gl_FragColor = linearToOutputTexel( gl_FragColor );",CM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,DM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,UM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,LM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,NM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,OM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,zM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,PM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,IM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,BM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,FM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,HM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,GM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,VM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,kM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,XM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,qM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,WM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,YM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ZM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,KM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,QM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,JM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$M=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,tE=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,eE=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nE=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,iE=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,aE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,rE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,oE=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,uE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hE=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,pE=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,gE=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,_E=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xE=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,yE=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,SE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ME=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,EE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,bE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,TE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,AE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,wE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,RE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,CE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,DE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,UE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,LE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,NE=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,OE=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,zE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,PE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,IE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,BE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,FE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,HE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,GE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,VE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,kE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,XE=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,qE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,WE=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,YE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ZE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,KE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const QE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,JE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$E=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,t1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,e1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,n1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,i1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,a1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,s1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,r1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,o1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,l1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,u1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,f1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,d1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,g1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,v1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,x1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,y1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,M1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,E1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,b1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,T1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,A1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,w1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,R1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,C1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,D1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ee={alphahash_fragment:JS,alphahash_pars_fragment:$S,alphamap_fragment:tM,alphamap_pars_fragment:eM,alphatest_fragment:nM,alphatest_pars_fragment:iM,aomap_fragment:aM,aomap_pars_fragment:sM,batching_pars_vertex:rM,batching_vertex:oM,begin_vertex:lM,beginnormal_vertex:cM,bsdfs:uM,iridescence_fragment:fM,bumpmap_pars_fragment:dM,clipping_planes_fragment:hM,clipping_planes_pars_fragment:pM,clipping_planes_pars_vertex:mM,clipping_planes_vertex:gM,color_fragment:_M,color_pars_fragment:vM,color_pars_vertex:xM,color_vertex:yM,common:SM,cube_uv_reflection_fragment:MM,defaultnormal_vertex:EM,displacementmap_pars_vertex:bM,displacementmap_vertex:TM,emissivemap_fragment:AM,emissivemap_pars_fragment:wM,colorspace_fragment:RM,colorspace_pars_fragment:CM,envmap_fragment:DM,envmap_common_pars_fragment:UM,envmap_pars_fragment:LM,envmap_pars_vertex:NM,envmap_physical_pars_fragment:XM,envmap_vertex:OM,fog_vertex:zM,fog_pars_vertex:PM,fog_fragment:IM,fog_pars_fragment:BM,gradientmap_pars_fragment:FM,lightmap_pars_fragment:HM,lights_lambert_fragment:GM,lights_lambert_pars_fragment:VM,lights_pars_begin:kM,lights_toon_fragment:qM,lights_toon_pars_fragment:WM,lights_phong_fragment:YM,lights_phong_pars_fragment:jM,lights_physical_fragment:ZM,lights_physical_pars_fragment:KM,lights_fragment_begin:QM,lights_fragment_maps:JM,lights_fragment_end:$M,logdepthbuf_fragment:tE,logdepthbuf_pars_fragment:eE,logdepthbuf_pars_vertex:nE,logdepthbuf_vertex:iE,map_fragment:aE,map_pars_fragment:sE,map_particle_fragment:rE,map_particle_pars_fragment:oE,metalnessmap_fragment:lE,metalnessmap_pars_fragment:cE,morphinstance_vertex:uE,morphcolor_vertex:fE,morphnormal_vertex:dE,morphtarget_pars_vertex:hE,morphtarget_vertex:pE,normal_fragment_begin:mE,normal_fragment_maps:gE,normal_pars_fragment:_E,normal_pars_vertex:vE,normal_vertex:xE,normalmap_pars_fragment:yE,clearcoat_normal_fragment_begin:SE,clearcoat_normal_fragment_maps:ME,clearcoat_pars_fragment:EE,iridescence_pars_fragment:bE,opaque_fragment:TE,packing:AE,premultiplied_alpha_fragment:wE,project_vertex:RE,dithering_fragment:CE,dithering_pars_fragment:DE,roughnessmap_fragment:UE,roughnessmap_pars_fragment:LE,shadowmap_pars_fragment:NE,shadowmap_pars_vertex:OE,shadowmap_vertex:zE,shadowmask_pars_fragment:PE,skinbase_vertex:IE,skinning_pars_vertex:BE,skinning_vertex:FE,skinnormal_vertex:HE,specularmap_fragment:GE,specularmap_pars_fragment:VE,tonemapping_fragment:kE,tonemapping_pars_fragment:XE,transmission_fragment:qE,transmission_pars_fragment:WE,uv_pars_fragment:YE,uv_pars_vertex:jE,uv_vertex:ZE,worldpos_vertex:KE,background_vert:QE,background_frag:JE,backgroundCube_vert:$E,backgroundCube_frag:t1,cube_vert:e1,cube_frag:n1,depth_vert:i1,depth_frag:a1,distanceRGBA_vert:s1,distanceRGBA_frag:r1,equirect_vert:o1,equirect_frag:l1,linedashed_vert:c1,linedashed_frag:u1,meshbasic_vert:f1,meshbasic_frag:d1,meshlambert_vert:h1,meshlambert_frag:p1,meshmatcap_vert:m1,meshmatcap_frag:g1,meshnormal_vert:_1,meshnormal_frag:v1,meshphong_vert:x1,meshphong_frag:y1,meshphysical_vert:S1,meshphysical_frag:M1,meshtoon_vert:E1,meshtoon_frag:b1,points_vert:T1,points_frag:A1,shadow_vert:w1,shadow_frag:R1,sprite_vert:C1,sprite_frag:D1},jt={common:{diffuse:{value:new Ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Se},alphaMap:{value:null},alphaMapTransform:{value:new Se},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Se}},envmap:{envMap:{value:null},envMapRotation:{value:new Se},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Se}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Se}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Se},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Se},normalScale:{value:new qe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Se},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Se}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Se}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Se}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Se},alphaTest:{value:0},uvTransform:{value:new Se}},sprite:{diffuse:{value:new Ue(16777215)},opacity:{value:1},center:{value:new qe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Se},alphaMap:{value:null},alphaMapTransform:{value:new Se},alphaTest:{value:0}}},ea={basic:{uniforms:li([jt.common,jt.specularmap,jt.envmap,jt.aomap,jt.lightmap,jt.fog]),vertexShader:Ee.meshbasic_vert,fragmentShader:Ee.meshbasic_frag},lambert:{uniforms:li([jt.common,jt.specularmap,jt.envmap,jt.aomap,jt.lightmap,jt.emissivemap,jt.bumpmap,jt.normalmap,jt.displacementmap,jt.fog,jt.lights,{emissive:{value:new Ue(0)}}]),vertexShader:Ee.meshlambert_vert,fragmentShader:Ee.meshlambert_frag},phong:{uniforms:li([jt.common,jt.specularmap,jt.envmap,jt.aomap,jt.lightmap,jt.emissivemap,jt.bumpmap,jt.normalmap,jt.displacementmap,jt.fog,jt.lights,{emissive:{value:new Ue(0)},specular:{value:new Ue(1118481)},shininess:{value:30}}]),vertexShader:Ee.meshphong_vert,fragmentShader:Ee.meshphong_frag},standard:{uniforms:li([jt.common,jt.envmap,jt.aomap,jt.lightmap,jt.emissivemap,jt.bumpmap,jt.normalmap,jt.displacementmap,jt.roughnessmap,jt.metalnessmap,jt.fog,jt.lights,{emissive:{value:new Ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ee.meshphysical_vert,fragmentShader:Ee.meshphysical_frag},toon:{uniforms:li([jt.common,jt.aomap,jt.lightmap,jt.emissivemap,jt.bumpmap,jt.normalmap,jt.displacementmap,jt.gradientmap,jt.fog,jt.lights,{emissive:{value:new Ue(0)}}]),vertexShader:Ee.meshtoon_vert,fragmentShader:Ee.meshtoon_frag},matcap:{uniforms:li([jt.common,jt.bumpmap,jt.normalmap,jt.displacementmap,jt.fog,{matcap:{value:null}}]),vertexShader:Ee.meshmatcap_vert,fragmentShader:Ee.meshmatcap_frag},points:{uniforms:li([jt.points,jt.fog]),vertexShader:Ee.points_vert,fragmentShader:Ee.points_frag},dashed:{uniforms:li([jt.common,jt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ee.linedashed_vert,fragmentShader:Ee.linedashed_frag},depth:{uniforms:li([jt.common,jt.displacementmap]),vertexShader:Ee.depth_vert,fragmentShader:Ee.depth_frag},normal:{uniforms:li([jt.common,jt.bumpmap,jt.normalmap,jt.displacementmap,{opacity:{value:1}}]),vertexShader:Ee.meshnormal_vert,fragmentShader:Ee.meshnormal_frag},sprite:{uniforms:li([jt.sprite,jt.fog]),vertexShader:Ee.sprite_vert,fragmentShader:Ee.sprite_frag},background:{uniforms:{uvTransform:{value:new Se},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ee.background_vert,fragmentShader:Ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Se}},vertexShader:Ee.backgroundCube_vert,fragmentShader:Ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ee.cube_vert,fragmentShader:Ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ee.equirect_vert,fragmentShader:Ee.equirect_frag},distanceRGBA:{uniforms:li([jt.common,jt.displacementmap,{referencePosition:{value:new et},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ee.distanceRGBA_vert,fragmentShader:Ee.distanceRGBA_frag},shadow:{uniforms:li([jt.lights,jt.fog,{color:{value:new Ue(0)},opacity:{value:1}}]),vertexShader:Ee.shadow_vert,fragmentShader:Ee.shadow_frag}};ea.physical={uniforms:li([ea.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Se},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Se},clearcoatNormalScale:{value:new qe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Se},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Se},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Se},sheen:{value:0},sheenColor:{value:new Ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Se},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Se},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Se},transmissionSamplerSize:{value:new qe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Se},attenuationDistance:{value:0},attenuationColor:{value:new Ue(0)},specularColor:{value:new Ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Se},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Se},anisotropyVector:{value:new qe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Se}}]),vertexShader:Ee.meshphysical_vert,fragmentShader:Ee.meshphysical_frag};const zc={r:0,b:0,g:0},Is=new aa,U1=new yn;function L1(o,e,i,s,l,u,d){const h=new Ue(0);let m=u===!0?0:1,p,v,x=null,y=0,M=null;function T(N){let U=N.isScene===!0?N.background:null;return U&&U.isTexture&&(U=(N.backgroundBlurriness>0?i:e).get(U)),U}function w(N){let U=!1;const W=T(N);W===null?g(h,m):W&&W.isColor&&(g(W,1),U=!0);const V=o.xr.getEnvironmentBlendMode();V==="additive"?s.buffers.color.setClear(0,0,0,1,d):V==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,d),(o.autoClear||U)&&(s.buffers.depth.setTest(!0),s.buffers.depth.setMask(!0),s.buffers.color.setMask(!0),o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil))}function S(N,U){const W=T(U);W&&(W.isCubeTexture||W.mapping===Qc)?(v===void 0&&(v=new Wt(new fe(1,1,1),new ps({name:"BackgroundCubeMaterial",uniforms:Zr(ea.backgroundCube.uniforms),vertexShader:ea.backgroundCube.vertexShader,fragmentShader:ea.backgroundCube.fragmentShader,side:_i,depthTest:!1,depthWrite:!1,fog:!1})),v.geometry.deleteAttribute("normal"),v.geometry.deleteAttribute("uv"),v.onBeforeRender=function(V,P,q){this.matrixWorld.copyPosition(q.matrixWorld)},Object.defineProperty(v.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(v)),Is.copy(U.backgroundRotation),Is.x*=-1,Is.y*=-1,Is.z*=-1,W.isCubeTexture&&W.isRenderTargetTexture===!1&&(Is.y*=-1,Is.z*=-1),v.material.uniforms.envMap.value=W,v.material.uniforms.flipEnvMap.value=W.isCubeTexture&&W.isRenderTargetTexture===!1?-1:1,v.material.uniforms.backgroundBlurriness.value=U.backgroundBlurriness,v.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,v.material.uniforms.backgroundRotation.value.setFromMatrix4(U1.makeRotationFromEuler(Is)),v.material.toneMapped=Xe.getTransfer(W.colorSpace)!==rn,(x!==W||y!==W.version||M!==o.toneMapping)&&(v.material.needsUpdate=!0,x=W,y=W.version,M=o.toneMapping),v.layers.enableAll(),N.unshift(v,v.geometry,v.material,0,0,null)):W&&W.isTexture&&(p===void 0&&(p=new Wt(new ta(2,2),new ps({name:"BackgroundMaterial",uniforms:Zr(ea.background.uniforms),vertexShader:ea.background.vertexShader,fragmentShader:ea.background.fragmentShader,side:hs,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(p)),p.material.uniforms.t2D.value=W,p.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,p.material.toneMapped=Xe.getTransfer(W.colorSpace)!==rn,W.matrixAutoUpdate===!0&&W.updateMatrix(),p.material.uniforms.uvTransform.value.copy(W.matrix),(x!==W||y!==W.version||M!==o.toneMapping)&&(p.material.needsUpdate=!0,x=W,y=W.version,M=o.toneMapping),p.layers.enableAll(),N.unshift(p,p.geometry,p.material,0,0,null))}function g(N,U){N.getRGB(zc,iv(o)),s.buffers.color.setClear(zc.r,zc.g,zc.b,U,d)}function F(){v!==void 0&&(v.geometry.dispose(),v.material.dispose()),p!==void 0&&(p.geometry.dispose(),p.material.dispose())}return{getClearColor:function(){return h},setClearColor:function(N,U=1){h.set(N),m=U,g(h,m)},getClearAlpha:function(){return m},setClearAlpha:function(N){m=N,g(h,m)},render:w,addToRenderList:S,dispose:F}}function N1(o,e){const i=o.getParameter(o.MAX_VERTEX_ATTRIBS),s={},l=y(null);let u=l,d=!1;function h(C,G,ft,st,Mt){let Et=!1;const z=x(st,ft,G);u!==z&&(u=z,p(u.object)),Et=M(C,st,ft,Mt),Et&&T(C,st,ft,Mt),Mt!==null&&e.update(Mt,o.ELEMENT_ARRAY_BUFFER),(Et||d)&&(d=!1,U(C,G,ft,st),Mt!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,e.get(Mt).buffer))}function m(){return o.createVertexArray()}function p(C){return o.bindVertexArray(C)}function v(C){return o.deleteVertexArray(C)}function x(C,G,ft){const st=ft.wireframe===!0;let Mt=s[C.id];Mt===void 0&&(Mt={},s[C.id]=Mt);let Et=Mt[G.id];Et===void 0&&(Et={},Mt[G.id]=Et);let z=Et[st];return z===void 0&&(z=y(m()),Et[st]=z),z}function y(C){const G=[],ft=[],st=[];for(let Mt=0;Mt<i;Mt++)G[Mt]=0,ft[Mt]=0,st[Mt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:ft,attributeDivisors:st,object:C,attributes:{},index:null}}function M(C,G,ft,st){const Mt=u.attributes,Et=G.attributes;let z=0;const $=ft.getAttributes();for(const tt in $)if($[tt].location>=0){const Ft=Mt[tt];let L=Et[tt];if(L===void 0&&(tt==="instanceMatrix"&&C.instanceMatrix&&(L=C.instanceMatrix),tt==="instanceColor"&&C.instanceColor&&(L=C.instanceColor)),Ft===void 0||Ft.attribute!==L||L&&Ft.data!==L.data)return!0;z++}return u.attributesNum!==z||u.index!==st}function T(C,G,ft,st){const Mt={},Et=G.attributes;let z=0;const $=ft.getAttributes();for(const tt in $)if($[tt].location>=0){let Ft=Et[tt];Ft===void 0&&(tt==="instanceMatrix"&&C.instanceMatrix&&(Ft=C.instanceMatrix),tt==="instanceColor"&&C.instanceColor&&(Ft=C.instanceColor));const L={};L.attribute=Ft,Ft&&Ft.data&&(L.data=Ft.data),Mt[tt]=L,z++}u.attributes=Mt,u.attributesNum=z,u.index=st}function w(){const C=u.newAttributes;for(let G=0,ft=C.length;G<ft;G++)C[G]=0}function S(C){g(C,0)}function g(C,G){const ft=u.newAttributes,st=u.enabledAttributes,Mt=u.attributeDivisors;ft[C]=1,st[C]===0&&(o.enableVertexAttribArray(C),st[C]=1),Mt[C]!==G&&(o.vertexAttribDivisor(C,G),Mt[C]=G)}function F(){const C=u.newAttributes,G=u.enabledAttributes;for(let ft=0,st=G.length;ft<st;ft++)G[ft]!==C[ft]&&(o.disableVertexAttribArray(ft),G[ft]=0)}function N(C,G,ft,st,Mt,Et,z){z===!0?o.vertexAttribIPointer(C,G,ft,Mt,Et):o.vertexAttribPointer(C,G,ft,st,Mt,Et)}function U(C,G,ft,st){w();const Mt=st.attributes,Et=ft.getAttributes(),z=G.defaultAttributeValues;for(const $ in Et){const tt=Et[$];if(tt.location>=0){let Pt=Mt[$];if(Pt===void 0&&($==="instanceMatrix"&&C.instanceMatrix&&(Pt=C.instanceMatrix),$==="instanceColor"&&C.instanceColor&&(Pt=C.instanceColor)),Pt!==void 0){const Ft=Pt.normalized,L=Pt.itemSize,rt=e.get(Pt);if(rt===void 0)continue;const Nt=rt.buffer,K=rt.type,yt=rt.bytesPerElement,Bt=K===o.INT||K===o.UNSIGNED_INT||Pt.gpuType===Uh;if(Pt.isInterleavedBufferAttribute){const zt=Pt.data,$t=zt.stride,Jt=Pt.offset;if(zt.isInstancedInterleavedBuffer){for(let pe=0;pe<tt.locationSize;pe++)g(tt.location+pe,zt.meshPerAttribute);C.isInstancedMesh!==!0&&st._maxInstanceCount===void 0&&(st._maxInstanceCount=zt.meshPerAttribute*zt.count)}else for(let pe=0;pe<tt.locationSize;pe++)S(tt.location+pe);o.bindBuffer(o.ARRAY_BUFFER,Nt);for(let pe=0;pe<tt.locationSize;pe++)N(tt.location+pe,L/tt.locationSize,K,Ft,$t*yt,(Jt+L/tt.locationSize*pe)*yt,Bt)}else{if(Pt.isInstancedBufferAttribute){for(let zt=0;zt<tt.locationSize;zt++)g(tt.location+zt,Pt.meshPerAttribute);C.isInstancedMesh!==!0&&st._maxInstanceCount===void 0&&(st._maxInstanceCount=Pt.meshPerAttribute*Pt.count)}else for(let zt=0;zt<tt.locationSize;zt++)S(tt.location+zt);o.bindBuffer(o.ARRAY_BUFFER,Nt);for(let zt=0;zt<tt.locationSize;zt++)N(tt.location+zt,L/tt.locationSize,K,Ft,L*yt,L/tt.locationSize*zt*yt,Bt)}}else if(z!==void 0){const Ft=z[$];if(Ft!==void 0)switch(Ft.length){case 2:o.vertexAttrib2fv(tt.location,Ft);break;case 3:o.vertexAttrib3fv(tt.location,Ft);break;case 4:o.vertexAttrib4fv(tt.location,Ft);break;default:o.vertexAttrib1fv(tt.location,Ft)}}}}F()}function W(){q();for(const C in s){const G=s[C];for(const ft in G){const st=G[ft];for(const Mt in st)v(st[Mt].object),delete st[Mt];delete G[ft]}delete s[C]}}function V(C){if(s[C.id]===void 0)return;const G=s[C.id];for(const ft in G){const st=G[ft];for(const Mt in st)v(st[Mt].object),delete st[Mt];delete G[ft]}delete s[C.id]}function P(C){for(const G in s){const ft=s[G];if(ft[C.id]===void 0)continue;const st=ft[C.id];for(const Mt in st)v(st[Mt].object),delete st[Mt];delete ft[C.id]}}function q(){D(),d=!0,u!==l&&(u=l,p(u.object))}function D(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:q,resetDefaultState:D,dispose:W,releaseStatesOfGeometry:V,releaseStatesOfProgram:P,initAttributes:w,enableAttribute:S,disableUnusedAttributes:F}}function O1(o,e,i){let s;function l(p){s=p}function u(p,v){o.drawArrays(s,p,v),i.update(v,s,1)}function d(p,v,x){x!==0&&(o.drawArraysInstanced(s,p,v,x),i.update(v,s,x))}function h(p,v,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,p,0,v,0,x);let M=0;for(let T=0;T<x;T++)M+=v[T];i.update(M,s,1)}function m(p,v,x,y){if(x===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let T=0;T<p.length;T++)d(p[T],v[T],y[T]);else{M.multiDrawArraysInstancedWEBGL(s,p,0,v,0,y,0,x);let T=0;for(let w=0;w<x;w++)T+=v[w]*y[w];i.update(T,s,1)}}this.setMode=l,this.render=u,this.renderInstances=d,this.renderMultiDraw=h,this.renderMultiDrawInstances=m}function z1(o,e,i,s){let l;function u(){if(l!==void 0)return l;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");l=o.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function d(P){return!(P!==Yi&&s.convert(P)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_FORMAT))}function h(P){const q=P===nl&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==Na&&s.convert(P)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Da&&!q)}function m(P){if(P==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=i.precision!==void 0?i.precision:"highp";const v=m(p);v!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",v,"instead."),p=v);const x=i.logarithmicDepthBuffer===!0,y=i.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),M=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),T=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=o.getParameter(o.MAX_TEXTURE_SIZE),S=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),g=o.getParameter(o.MAX_VERTEX_ATTRIBS),F=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),N=o.getParameter(o.MAX_VARYING_VECTORS),U=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),W=T>0,V=o.getParameter(o.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:u,getMaxPrecision:m,textureFormatReadable:d,textureTypeReadable:h,precision:p,logarithmicDepthBuffer:x,reverseDepthBuffer:y,maxTextures:M,maxVertexTextures:T,maxTextureSize:w,maxCubemapSize:S,maxAttributes:g,maxVertexUniforms:F,maxVaryings:N,maxFragmentUniforms:U,vertexTextures:W,maxSamples:V}}function P1(o){const e=this;let i=null,s=0,l=!1,u=!1;const d=new Fs,h=new Se,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(x,y){const M=x.length!==0||y||s!==0||l;return l=y,s=x.length,M},this.beginShadows=function(){u=!0,v(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(x,y){i=v(x,y,0)},this.setState=function(x,y,M){const T=x.clippingPlanes,w=x.clipIntersection,S=x.clipShadows,g=o.get(x);if(!l||T===null||T.length===0||u&&!S)u?v(null):p();else{const F=u?0:s,N=F*4;let U=g.clippingState||null;m.value=U,U=v(T,y,N,M);for(let W=0;W!==N;++W)U[W]=i[W];g.clippingState=U,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=F}};function p(){m.value!==i&&(m.value=i,m.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function v(x,y,M,T){const w=x!==null?x.length:0;let S=null;if(w!==0){if(S=m.value,T!==!0||S===null){const g=M+w*4,F=y.matrixWorldInverse;h.getNormalMatrix(F),(S===null||S.length<g)&&(S=new Float32Array(g));for(let N=0,U=M;N!==w;++N,U+=4)d.copy(x[N]).applyMatrix4(F,h),d.normal.toArray(S,U),S[U+3]=d.constant}m.value=S,m.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,S}}function I1(o){let e=new WeakMap;function i(d,h){return h===Qd?d.mapping=Xr:h===Jd&&(d.mapping=qr),d}function s(d){if(d&&d.isTexture){const h=d.mapping;if(h===Qd||h===Jd)if(e.has(d)){const m=e.get(d).texture;return i(m,d.mapping)}else{const m=d.image;if(m&&m.height>0){const p=new IS(m.height);return p.fromEquirectangularTexture(o,d),e.set(d,p),d.addEventListener("dispose",l),i(p.texture,d.mapping)}else return null}}return d}function l(d){const h=d.target;h.removeEventListener("dispose",l);const m=e.get(h);m!==void 0&&(e.delete(h),m.dispose())}function u(){e=new WeakMap}return{get:s,dispose:u}}const Fr=4,r_=[.125,.215,.35,.446,.526,.582],ks=20,zd=new lv,o_=new Ue;let Pd=null,Id=0,Bd=0,Fd=!1;const Hs=(1+Math.sqrt(5))/2,Ir=1/Hs,l_=[new et(-Hs,Ir,0),new et(Hs,Ir,0),new et(-Ir,0,Hs),new et(Ir,0,Hs),new et(0,Hs,-Ir),new et(0,Hs,Ir),new et(-1,1,-1),new et(1,1,-1),new et(-1,1,1),new et(1,1,1)];class c_{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,i=0,s=.1,l=100){Pd=this._renderer.getRenderTarget(),Id=this._renderer.getActiveCubeFace(),Bd=this._renderer.getActiveMipmapLevel(),Fd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const u=this._allocateTargets();return u.depthBuffer=!0,this._sceneToCubeUV(e,s,l,u),i>0&&this._blur(u,0,0,i),this._applyPMREM(u),this._cleanup(u),u}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=d_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=f_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Pd,Id,Bd),this._renderer.xr.enabled=Fd,e.scissorTest=!1,Pc(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===Xr||e.mapping===qr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Pd=this._renderer.getRenderTarget(),Id=this._renderer.getActiveCubeFace(),Bd=this._renderer.getActiveMipmapLevel(),Fd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=i||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,s={magFilter:na,minFilter:na,generateMipmaps:!1,type:nl,format:Yi,colorSpace:jr,depthBuffer:!1},l=u_(e,i,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=u_(e,i,s);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=B1(u)),this._blurMaterial=F1(u,e,i)}return l}_compileMaterial(e){const i=new Wt(this._lodPlanes[0],e);this._renderer.compile(i,zd)}_sceneToCubeUV(e,i,s,l){const h=new wi(90,1,i,s),m=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],v=this._renderer,x=v.autoClear,y=v.toneMapping;v.getClearColor(o_),v.toneMapping=ds,v.autoClear=!1;const M=new Ih({name:"PMREM.Background",side:_i,depthWrite:!1,depthTest:!1}),T=new Wt(new fe,M);let w=!1;const S=e.background;S?S.isColor&&(M.color.copy(S),e.background=null,w=!0):(M.color.copy(o_),w=!0);for(let g=0;g<6;g++){const F=g%3;F===0?(h.up.set(0,m[g],0),h.lookAt(p[g],0,0)):F===1?(h.up.set(0,0,m[g]),h.lookAt(0,p[g],0)):(h.up.set(0,m[g],0),h.lookAt(0,0,p[g]));const N=this._cubeSize;Pc(l,F*N,g>2?N:0,N,N),v.setRenderTarget(l),w&&v.render(T,h),v.render(e,h)}T.geometry.dispose(),T.material.dispose(),v.toneMapping=y,v.autoClear=x,e.background=S}_textureToCubeUV(e,i){const s=this._renderer,l=e.mapping===Xr||e.mapping===qr;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=d_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=f_());const u=l?this._cubemapMaterial:this._equirectMaterial,d=new Wt(this._lodPlanes[0],u),h=u.uniforms;h.envMap.value=e;const m=this._cubeSize;Pc(i,0,0,3*m,2*m),s.setRenderTarget(i),s.render(d,zd)}_applyPMREM(e){const i=this._renderer,s=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let u=1;u<l;u++){const d=Math.sqrt(this._sigmas[u]*this._sigmas[u]-this._sigmas[u-1]*this._sigmas[u-1]),h=l_[(l-u-1)%l_.length];this._blur(e,u-1,u,d,h)}i.autoClear=s}_blur(e,i,s,l,u){const d=this._pingPongRenderTarget;this._halfBlur(e,d,i,s,l,"latitudinal",u),this._halfBlur(d,e,s,s,l,"longitudinal",u)}_halfBlur(e,i,s,l,u,d,h){const m=this._renderer,p=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const v=3,x=new Wt(this._lodPlanes[l],p),y=p.uniforms,M=this._sizeLods[s]-1,T=isFinite(u)?Math.PI/(2*M):2*Math.PI/(2*ks-1),w=u/T,S=isFinite(u)?1+Math.floor(v*w):ks;S>ks&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${ks}`);const g=[];let F=0;for(let P=0;P<ks;++P){const q=P/w,D=Math.exp(-q*q/2);g.push(D),P===0?F+=D:P<S&&(F+=2*D)}for(let P=0;P<g.length;P++)g[P]=g[P]/F;y.envMap.value=e.texture,y.samples.value=S,y.weights.value=g,y.latitudinal.value=d==="latitudinal",h&&(y.poleAxis.value=h);const{_lodMax:N}=this;y.dTheta.value=T,y.mipInt.value=N-s;const U=this._sizeLods[l],W=3*U*(l>N-Fr?l-N+Fr:0),V=4*(this._cubeSize-U);Pc(i,W,V,3*U,2*U),m.setRenderTarget(i),m.render(x,zd)}}function B1(o){const e=[],i=[],s=[];let l=o;const u=o-Fr+1+r_.length;for(let d=0;d<u;d++){const h=Math.pow(2,l);i.push(h);let m=1/h;d>o-Fr?m=r_[d-o+Fr-1]:d===0&&(m=0),s.push(m);const p=1/(h-2),v=-p,x=1+p,y=[v,v,x,v,x,x,v,v,x,x,v,x],M=6,T=6,w=3,S=2,g=1,F=new Float32Array(w*T*M),N=new Float32Array(S*T*M),U=new Float32Array(g*T*M);for(let V=0;V<M;V++){const P=V%3*2/3-1,q=V>2?0:-1,D=[P,q,0,P+2/3,q,0,P+2/3,q+1,0,P,q,0,P+2/3,q+1,0,P,q+1,0];F.set(D,w*T*V),N.set(y,S*T*V);const C=[V,V,V,V,V,V];U.set(C,g*T*V)}const W=new ai;W.setAttribute("position",new ia(F,w)),W.setAttribute("uv",new ia(N,S)),W.setAttribute("faceIndex",new ia(U,g)),e.push(W),l>Fr&&l--}return{lodPlanes:e,sizeLods:i,sigmas:s}}function u_(o,e,i){const s=new Ys(o,e,i);return s.texture.mapping=Qc,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Pc(o,e,i,s,l){o.viewport.set(e,i,s,l),o.scissor.set(e,i,s,l)}function F1(o,e,i){const s=new Float32Array(ks),l=new et(0,1,0);return new ps({name:"SphericalGaussianBlur",defines:{n:ks,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:fs,depthTest:!1,depthWrite:!1})}function f_(){return new ps({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:fs,depthTest:!1,depthWrite:!1})}function d_(){return new ps({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fs,depthTest:!1,depthWrite:!1})}function Hh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function H1(o){let e=new WeakMap,i=null;function s(h){if(h&&h.isTexture){const m=h.mapping,p=m===Qd||m===Jd,v=m===Xr||m===qr;if(p||v){let x=e.get(h);const y=x!==void 0?x.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==y)return i===null&&(i=new c_(o)),x=p?i.fromEquirectangular(h,x):i.fromCubemap(h,x),x.texture.pmremVersion=h.pmremVersion,e.set(h,x),x.texture;if(x!==void 0)return x.texture;{const M=h.image;return p&&M&&M.height>0||v&&M&&l(M)?(i===null&&(i=new c_(o)),x=p?i.fromEquirectangular(h):i.fromCubemap(h),x.texture.pmremVersion=h.pmremVersion,e.set(h,x),h.addEventListener("dispose",u),x.texture):null}}}return h}function l(h){let m=0;const p=6;for(let v=0;v<p;v++)h[v]!==void 0&&m++;return m===p}function u(h){const m=h.target;m.removeEventListener("dispose",u);const p=e.get(m);p!==void 0&&(e.delete(m),p.dispose())}function d(){e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function G1(o){const e={};function i(s){if(e[s]!==void 0)return e[s];let l;switch(s){case"WEBGL_depth_texture":l=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=o.getExtension(s)}return e[s]=l,l}return{has:function(s){return i(s)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(s){const l=i(s);return l===null&&Br("THREE.WebGLRenderer: "+s+" extension not supported."),l}}}function V1(o,e,i,s){const l={},u=new WeakMap;function d(x){const y=x.target;y.index!==null&&e.remove(y.index);for(const T in y.attributes)e.remove(y.attributes[T]);y.removeEventListener("dispose",d),delete l[y.id];const M=u.get(y);M&&(e.remove(M),u.delete(y)),s.releaseStatesOfGeometry(y),y.isInstancedBufferGeometry===!0&&delete y._maxInstanceCount,i.memory.geometries--}function h(x,y){return l[y.id]===!0||(y.addEventListener("dispose",d),l[y.id]=!0,i.memory.geometries++),y}function m(x){const y=x.attributes;for(const M in y)e.update(y[M],o.ARRAY_BUFFER)}function p(x){const y=[],M=x.index,T=x.attributes.position;let w=0;if(M!==null){const F=M.array;w=M.version;for(let N=0,U=F.length;N<U;N+=3){const W=F[N+0],V=F[N+1],P=F[N+2];y.push(W,V,V,P,P,W)}}else if(T!==void 0){const F=T.array;w=T.version;for(let N=0,U=F.length/3-1;N<U;N+=3){const W=N+0,V=N+1,P=N+2;y.push(W,V,V,P,P,W)}}else return;const S=new(Z_(y)?nv:ev)(y,1);S.version=w;const g=u.get(x);g&&e.remove(g),u.set(x,S)}function v(x){const y=u.get(x);if(y){const M=x.index;M!==null&&y.version<M.version&&p(x)}else p(x);return u.get(x)}return{get:h,update:m,getWireframeAttribute:v}}function k1(o,e,i){let s;function l(y){s=y}let u,d;function h(y){u=y.type,d=y.bytesPerElement}function m(y,M){o.drawElements(s,M,u,y*d),i.update(M,s,1)}function p(y,M,T){T!==0&&(o.drawElementsInstanced(s,M,u,y*d,T),i.update(M,s,T))}function v(y,M,T){if(T===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,M,0,u,y,0,T);let S=0;for(let g=0;g<T;g++)S+=M[g];i.update(S,s,1)}function x(y,M,T,w){if(T===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let g=0;g<y.length;g++)p(y[g]/d,M[g],w[g]);else{S.multiDrawElementsInstancedWEBGL(s,M,0,u,y,0,w,0,T);let g=0;for(let F=0;F<T;F++)g+=M[F]*w[F];i.update(g,s,1)}}this.setMode=l,this.setIndex=h,this.render=m,this.renderInstances=p,this.renderMultiDraw=v,this.renderMultiDrawInstances=x}function X1(o){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function s(u,d,h){switch(i.calls++,d){case o.TRIANGLES:i.triangles+=h*(u/3);break;case o.LINES:i.lines+=h*(u/2);break;case o.LINE_STRIP:i.lines+=h*(u-1);break;case o.LINE_LOOP:i.lines+=h*u;break;case o.POINTS:i.points+=h*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",d);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:s}}function q1(o,e,i){const s=new WeakMap,l=new on;function u(d,h,m){const p=d.morphTargetInfluences,v=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,x=v!==void 0?v.length:0;let y=s.get(h);if(y===void 0||y.count!==x){let C=function(){q.dispose(),s.delete(h),h.removeEventListener("dispose",C)};var M=C;y!==void 0&&y.texture.dispose();const T=h.morphAttributes.position!==void 0,w=h.morphAttributes.normal!==void 0,S=h.morphAttributes.color!==void 0,g=h.morphAttributes.position||[],F=h.morphAttributes.normal||[],N=h.morphAttributes.color||[];let U=0;T===!0&&(U=1),w===!0&&(U=2),S===!0&&(U=3);let W=h.attributes.position.count*U,V=1;W>e.maxTextureSize&&(V=Math.ceil(W/e.maxTextureSize),W=e.maxTextureSize);const P=new Float32Array(W*V*4*x),q=new Q_(P,W,V,x);q.type=Da,q.needsUpdate=!0;const D=U*4;for(let G=0;G<x;G++){const ft=g[G],st=F[G],Mt=N[G],Et=W*V*4*G;for(let z=0;z<ft.count;z++){const $=z*D;T===!0&&(l.fromBufferAttribute(ft,z),P[Et+$+0]=l.x,P[Et+$+1]=l.y,P[Et+$+2]=l.z,P[Et+$+3]=0),w===!0&&(l.fromBufferAttribute(st,z),P[Et+$+4]=l.x,P[Et+$+5]=l.y,P[Et+$+6]=l.z,P[Et+$+7]=0),S===!0&&(l.fromBufferAttribute(Mt,z),P[Et+$+8]=l.x,P[Et+$+9]=l.y,P[Et+$+10]=l.z,P[Et+$+11]=Mt.itemSize===4?l.w:1)}}y={count:x,texture:q,size:new qe(W,V)},s.set(h,y),h.addEventListener("dispose",C)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)m.getUniforms().setValue(o,"morphTexture",d.morphTexture,i);else{let T=0;for(let S=0;S<p.length;S++)T+=p[S];const w=h.morphTargetsRelative?1:1-T;m.getUniforms().setValue(o,"morphTargetBaseInfluence",w),m.getUniforms().setValue(o,"morphTargetInfluences",p)}m.getUniforms().setValue(o,"morphTargetsTexture",y.texture,i),m.getUniforms().setValue(o,"morphTargetsTextureSize",y.size)}return{update:u}}function W1(o,e,i,s){let l=new WeakMap;function u(m){const p=s.render.frame,v=m.geometry,x=e.get(m,v);if(l.get(x)!==p&&(e.update(x),l.set(x,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",h)===!1&&m.addEventListener("dispose",h),l.get(m)!==p&&(i.update(m.instanceMatrix,o.ARRAY_BUFFER),m.instanceColor!==null&&i.update(m.instanceColor,o.ARRAY_BUFFER),l.set(m,p))),m.isSkinnedMesh){const y=m.skeleton;l.get(y)!==p&&(y.update(),l.set(y,p))}return x}function d(){l=new WeakMap}function h(m){const p=m.target;p.removeEventListener("dispose",h),i.remove(p.instanceMatrix),p.instanceColor!==null&&i.remove(p.instanceColor)}return{update:u,dispose:d}}const uv=new ci,h_=new rv(1,1),fv=new Q_,dv=new SS,hv=new sv,p_=[],m_=[],g_=new Float32Array(16),__=new Float32Array(9),v_=new Float32Array(4);function Jr(o,e,i){const s=o[0];if(s<=0||s>0)return o;const l=e*i;let u=p_[l];if(u===void 0&&(u=new Float32Array(l),p_[l]=u),e!==0){s.toArray(u,0);for(let d=1,h=0;d!==e;++d)h+=i,o[d].toArray(u,h)}return u}function In(o,e){if(o.length!==e.length)return!1;for(let i=0,s=o.length;i<s;i++)if(o[i]!==e[i])return!1;return!0}function Bn(o,e){for(let i=0,s=e.length;i<s;i++)o[i]=e[i]}function tu(o,e){let i=m_[e];i===void 0&&(i=new Int32Array(e),m_[e]=i);for(let s=0;s!==e;++s)i[s]=o.allocateTextureUnit();return i}function Y1(o,e){const i=this.cache;i[0]!==e&&(o.uniform1f(this.addr,e),i[0]=e)}function j1(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(In(i,e))return;o.uniform2fv(this.addr,e),Bn(i,e)}}function Z1(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(o.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(In(i,e))return;o.uniform3fv(this.addr,e),Bn(i,e)}}function K1(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(In(i,e))return;o.uniform4fv(this.addr,e),Bn(i,e)}}function Q1(o,e){const i=this.cache,s=e.elements;if(s===void 0){if(In(i,e))return;o.uniformMatrix2fv(this.addr,!1,e),Bn(i,e)}else{if(In(i,s))return;v_.set(s),o.uniformMatrix2fv(this.addr,!1,v_),Bn(i,s)}}function J1(o,e){const i=this.cache,s=e.elements;if(s===void 0){if(In(i,e))return;o.uniformMatrix3fv(this.addr,!1,e),Bn(i,e)}else{if(In(i,s))return;__.set(s),o.uniformMatrix3fv(this.addr,!1,__),Bn(i,s)}}function $1(o,e){const i=this.cache,s=e.elements;if(s===void 0){if(In(i,e))return;o.uniformMatrix4fv(this.addr,!1,e),Bn(i,e)}else{if(In(i,s))return;g_.set(s),o.uniformMatrix4fv(this.addr,!1,g_),Bn(i,s)}}function tb(o,e){const i=this.cache;i[0]!==e&&(o.uniform1i(this.addr,e),i[0]=e)}function eb(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(In(i,e))return;o.uniform2iv(this.addr,e),Bn(i,e)}}function nb(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(In(i,e))return;o.uniform3iv(this.addr,e),Bn(i,e)}}function ib(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(In(i,e))return;o.uniform4iv(this.addr,e),Bn(i,e)}}function ab(o,e){const i=this.cache;i[0]!==e&&(o.uniform1ui(this.addr,e),i[0]=e)}function sb(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(In(i,e))return;o.uniform2uiv(this.addr,e),Bn(i,e)}}function rb(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(In(i,e))return;o.uniform3uiv(this.addr,e),Bn(i,e)}}function ob(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(In(i,e))return;o.uniform4uiv(this.addr,e),Bn(i,e)}}function lb(o,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(o.uniform1i(this.addr,l),s[0]=l);let u;this.type===o.SAMPLER_2D_SHADOW?(h_.compareFunction=j_,u=h_):u=uv,i.setTexture2D(e||u,l)}function cb(o,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(o.uniform1i(this.addr,l),s[0]=l),i.setTexture3D(e||dv,l)}function ub(o,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(o.uniform1i(this.addr,l),s[0]=l),i.setTextureCube(e||hv,l)}function fb(o,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(o.uniform1i(this.addr,l),s[0]=l),i.setTexture2DArray(e||fv,l)}function db(o){switch(o){case 5126:return Y1;case 35664:return j1;case 35665:return Z1;case 35666:return K1;case 35674:return Q1;case 35675:return J1;case 35676:return $1;case 5124:case 35670:return tb;case 35667:case 35671:return eb;case 35668:case 35672:return nb;case 35669:case 35673:return ib;case 5125:return ab;case 36294:return sb;case 36295:return rb;case 36296:return ob;case 35678:case 36198:case 36298:case 36306:case 35682:return lb;case 35679:case 36299:case 36307:return cb;case 35680:case 36300:case 36308:case 36293:return ub;case 36289:case 36303:case 36311:case 36292:return fb}}function hb(o,e){o.uniform1fv(this.addr,e)}function pb(o,e){const i=Jr(e,this.size,2);o.uniform2fv(this.addr,i)}function mb(o,e){const i=Jr(e,this.size,3);o.uniform3fv(this.addr,i)}function gb(o,e){const i=Jr(e,this.size,4);o.uniform4fv(this.addr,i)}function _b(o,e){const i=Jr(e,this.size,4);o.uniformMatrix2fv(this.addr,!1,i)}function vb(o,e){const i=Jr(e,this.size,9);o.uniformMatrix3fv(this.addr,!1,i)}function xb(o,e){const i=Jr(e,this.size,16);o.uniformMatrix4fv(this.addr,!1,i)}function yb(o,e){o.uniform1iv(this.addr,e)}function Sb(o,e){o.uniform2iv(this.addr,e)}function Mb(o,e){o.uniform3iv(this.addr,e)}function Eb(o,e){o.uniform4iv(this.addr,e)}function bb(o,e){o.uniform1uiv(this.addr,e)}function Tb(o,e){o.uniform2uiv(this.addr,e)}function Ab(o,e){o.uniform3uiv(this.addr,e)}function wb(o,e){o.uniform4uiv(this.addr,e)}function Rb(o,e,i){const s=this.cache,l=e.length,u=tu(i,l);In(s,u)||(o.uniform1iv(this.addr,u),Bn(s,u));for(let d=0;d!==l;++d)i.setTexture2D(e[d]||uv,u[d])}function Cb(o,e,i){const s=this.cache,l=e.length,u=tu(i,l);In(s,u)||(o.uniform1iv(this.addr,u),Bn(s,u));for(let d=0;d!==l;++d)i.setTexture3D(e[d]||dv,u[d])}function Db(o,e,i){const s=this.cache,l=e.length,u=tu(i,l);In(s,u)||(o.uniform1iv(this.addr,u),Bn(s,u));for(let d=0;d!==l;++d)i.setTextureCube(e[d]||hv,u[d])}function Ub(o,e,i){const s=this.cache,l=e.length,u=tu(i,l);In(s,u)||(o.uniform1iv(this.addr,u),Bn(s,u));for(let d=0;d!==l;++d)i.setTexture2DArray(e[d]||fv,u[d])}function Lb(o){switch(o){case 5126:return hb;case 35664:return pb;case 35665:return mb;case 35666:return gb;case 35674:return _b;case 35675:return vb;case 35676:return xb;case 5124:case 35670:return yb;case 35667:case 35671:return Sb;case 35668:case 35672:return Mb;case 35669:case 35673:return Eb;case 5125:return bb;case 36294:return Tb;case 36295:return Ab;case 36296:return wb;case 35678:case 36198:case 36298:case 36306:case 35682:return Rb;case 35679:case 36299:case 36307:return Cb;case 35680:case 36300:case 36308:case 36293:return Db;case 36289:case 36303:case 36311:case 36292:return Ub}}class Nb{constructor(e,i,s){this.id=e,this.addr=s,this.cache=[],this.type=i.type,this.setValue=db(i.type)}}class Ob{constructor(e,i,s){this.id=e,this.addr=s,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=Lb(i.type)}}class zb{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,s){const l=this.seq;for(let u=0,d=l.length;u!==d;++u){const h=l[u];h.setValue(e,i[h.id],s)}}}const Hd=/(\w+)(\])?(\[|\.)?/g;function x_(o,e){o.seq.push(e),o.map[e.id]=e}function Pb(o,e,i){const s=o.name,l=s.length;for(Hd.lastIndex=0;;){const u=Hd.exec(s),d=Hd.lastIndex;let h=u[1];const m=u[2]==="]",p=u[3];if(m&&(h=h|0),p===void 0||p==="["&&d+2===l){x_(i,p===void 0?new Nb(h,o,e):new Ob(h,o,e));break}else{let x=i.map[h];x===void 0&&(x=new zb(h),x_(i,x)),i=x}}}class Xc{constructor(e,i){this.seq=[],this.map={};const s=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let l=0;l<s;++l){const u=e.getActiveUniform(i,l),d=e.getUniformLocation(i,u.name);Pb(u,d,this)}}setValue(e,i,s,l){const u=this.map[i];u!==void 0&&u.setValue(e,s,l)}setOptional(e,i,s){const l=i[s];l!==void 0&&this.setValue(e,s,l)}static upload(e,i,s,l){for(let u=0,d=i.length;u!==d;++u){const h=i[u],m=s[h.id];m.needsUpdate!==!1&&h.setValue(e,m.value,l)}}static seqWithValue(e,i){const s=[];for(let l=0,u=e.length;l!==u;++l){const d=e[l];d.id in i&&s.push(d)}return s}}function y_(o,e,i){const s=o.createShader(e);return o.shaderSource(s,i),o.compileShader(s),s}const Ib=37297;let Bb=0;function Fb(o,e){const i=o.split(`
`),s=[],l=Math.max(e-6,0),u=Math.min(e+6,i.length);for(let d=l;d<u;d++){const h=d+1;s.push(`${h===e?">":" "} ${h}: ${i[d]}`)}return s.join(`
`)}const S_=new Se;function Hb(o){Xe._getMatrix(S_,Xe.workingColorSpace,o);const e=`mat3( ${S_.elements.map(i=>i.toFixed(4))} )`;switch(Xe.getTransfer(o)){case qc:return[e,"LinearTransferOETF"];case rn:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",o),[e,"LinearTransferOETF"]}}function M_(o,e,i){const s=o.getShaderParameter(e,o.COMPILE_STATUS),l=o.getShaderInfoLog(e).trim();if(s&&l==="")return"";const u=/ERROR: 0:(\d+)/.exec(l);if(u){const d=parseInt(u[1]);return i.toUpperCase()+`

`+l+`

`+Fb(o.getShaderSource(e),d)}else return l}function Gb(o,e){const i=Hb(e);return[`vec4 ${o}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function Vb(o,e){let i;switch(e){case jy:i="Linear";break;case Zy:i="Reinhard";break;case Ky:i="Cineon";break;case z_:i="ACESFilmic";break;case Jy:i="AgX";break;case $y:i="Neutral";break;case Qy:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),i="Linear"}return"vec3 "+o+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Ic=new et;function kb(){Xe.getLuminanceCoefficients(Ic);const o=Ic.x.toFixed(4),e=Ic.y.toFixed(4),i=Ic.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${o}, ${e}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xb(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",o.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($o).join(`
`)}function qb(o){const e=[];for(const i in o){const s=o[i];s!==!1&&e.push("#define "+i+" "+s)}return e.join(`
`)}function Wb(o,e){const i={},s=o.getProgramParameter(e,o.ACTIVE_ATTRIBUTES);for(let l=0;l<s;l++){const u=o.getActiveAttrib(e,l),d=u.name;let h=1;u.type===o.FLOAT_MAT2&&(h=2),u.type===o.FLOAT_MAT3&&(h=3),u.type===o.FLOAT_MAT4&&(h=4),i[d]={type:u.type,location:o.getAttribLocation(e,d),locationSize:h}}return i}function $o(o){return o!==""}function E_(o,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function b_(o,e){return o.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Yb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Rh(o){return o.replace(Yb,Zb)}const jb=new Map;function Zb(o,e){let i=Ee[e];if(i===void 0){const s=jb.get(e);if(s!==void 0)i=Ee[s],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("Can not resolve #include <"+e+">")}return Rh(i)}const Kb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function T_(o){return o.replace(Kb,Qb)}function Qb(o,e,i,s){let l="";for(let u=parseInt(e);u<parseInt(i);u++)l+=s.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return l}function A_(o){let e=`precision ${o.precision} float;
	precision ${o.precision} int;
	precision ${o.precision} sampler2D;
	precision ${o.precision} samplerCube;
	precision ${o.precision} sampler3D;
	precision ${o.precision} sampler2DArray;
	precision ${o.precision} sampler2DShadow;
	precision ${o.precision} samplerCubeShadow;
	precision ${o.precision} sampler2DArrayShadow;
	precision ${o.precision} isampler2D;
	precision ${o.precision} isampler3D;
	precision ${o.precision} isamplerCube;
	precision ${o.precision} isampler2DArray;
	precision ${o.precision} usampler2D;
	precision ${o.precision} usampler3D;
	precision ${o.precision} usamplerCube;
	precision ${o.precision} usampler2DArray;
	`;return o.precision==="highp"?e+=`
#define HIGH_PRECISION`:o.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Jb(o){let e="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===L_?e="SHADOWMAP_TYPE_PCF":o.shadowMapType===N_?e="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===Ra&&(e="SHADOWMAP_TYPE_VSM"),e}function $b(o){let e="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case Xr:case qr:e="ENVMAP_TYPE_CUBE";break;case Qc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function tT(o){let e="ENVMAP_MODE_REFLECTION";if(o.envMap)switch(o.envMapMode){case qr:e="ENVMAP_MODE_REFRACTION";break}return e}function eT(o){let e="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case O_:e="ENVMAP_BLENDING_MULTIPLY";break;case Wy:e="ENVMAP_BLENDING_MIX";break;case Yy:e="ENVMAP_BLENDING_ADD";break}return e}function nT(o){const e=o.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:s,maxMip:i}}function iT(o,e,i,s){const l=o.getContext(),u=i.defines;let d=i.vertexShader,h=i.fragmentShader;const m=Jb(i),p=$b(i),v=tT(i),x=eT(i),y=nT(i),M=Xb(i),T=qb(u),w=l.createProgram();let S,g,F=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(S=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter($o).join(`
`),S.length>0&&(S+=`
`),g=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter($o).join(`
`),g.length>0&&(g+=`
`)):(S=[A_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+v:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($o).join(`
`),g=[A_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+p:"",i.envMap?"#define "+v:"",i.envMap?"#define "+x:"",y?"#define CUBEUV_TEXEL_WIDTH "+y.texelWidth:"",y?"#define CUBEUV_TEXEL_HEIGHT "+y.texelHeight:"",y?"#define CUBEUV_MAX_MIP "+y.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==ds?"#define TONE_MAPPING":"",i.toneMapping!==ds?Ee.tonemapping_pars_fragment:"",i.toneMapping!==ds?Vb("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",Ee.colorspace_pars_fragment,Gb("linearToOutputTexel",i.outputColorSpace),kb(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter($o).join(`
`)),d=Rh(d),d=E_(d,i),d=b_(d,i),h=Rh(h),h=E_(h,i),h=b_(h,i),d=T_(d),h=T_(h),i.isRawShaderMaterial!==!0&&(F=`#version 300 es
`,S=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,g=["#define varying in",i.glslVersion===zg?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===zg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const N=F+S+d,U=F+g+h,W=y_(l,l.VERTEX_SHADER,N),V=y_(l,l.FRAGMENT_SHADER,U);l.attachShader(w,W),l.attachShader(w,V),i.index0AttributeName!==void 0?l.bindAttribLocation(w,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(w,0,"position"),l.linkProgram(w);function P(G){if(o.debug.checkShaderErrors){const ft=l.getProgramInfoLog(w).trim(),st=l.getShaderInfoLog(W).trim(),Mt=l.getShaderInfoLog(V).trim();let Et=!0,z=!0;if(l.getProgramParameter(w,l.LINK_STATUS)===!1)if(Et=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(l,w,W,V);else{const $=M_(l,W,"vertex"),tt=M_(l,V,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(w,l.VALIDATE_STATUS)+`

Material Name: `+G.name+`
Material Type: `+G.type+`

Program Info Log: `+ft+`
`+$+`
`+tt)}else ft!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ft):(st===""||Mt==="")&&(z=!1);z&&(G.diagnostics={runnable:Et,programLog:ft,vertexShader:{log:st,prefix:S},fragmentShader:{log:Mt,prefix:g}})}l.deleteShader(W),l.deleteShader(V),q=new Xc(l,w),D=Wb(l,w)}let q;this.getUniforms=function(){return q===void 0&&P(this),q};let D;this.getAttributes=function(){return D===void 0&&P(this),D};let C=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=l.getProgramParameter(w,Ib)),C},this.destroy=function(){s.releaseStatesOfProgram(this),l.deleteProgram(w),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=Bb++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=W,this.fragmentShader=V,this}let aT=0;class sT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const i=e.vertexShader,s=e.fragmentShader,l=this._getShaderStage(i),u=this._getShaderStage(s),d=this._getShaderCacheForMaterial(e);return d.has(l)===!1&&(d.add(l),l.usedTimes++),d.has(u)===!1&&(d.add(u),u.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const s of i)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let s=i.get(e);return s===void 0&&(s=new Set,i.set(e,s)),s}_getShaderStage(e){const i=this.shaderCache;let s=i.get(e);return s===void 0&&(s=new rT(e),i.set(e,s)),s}}class rT{constructor(e){this.id=aT++,this.code=e,this.usedTimes=0}}function oT(o,e,i,s,l,u,d){const h=new $_,m=new sT,p=new Set,v=[],x=l.logarithmicDepthBuffer,y=l.vertexTextures;let M=l.precision;const T={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(D){return p.add(D),D===0?"uv":`uv${D}`}function S(D,C,G,ft,st){const Mt=ft.fog,Et=st.geometry,z=D.isMeshStandardMaterial?ft.environment:null,$=(D.isMeshStandardMaterial?i:e).get(D.envMap||z),tt=$&&$.mapping===Qc?$.image.height:null,Pt=T[D.type];D.precision!==null&&(M=l.getMaxPrecision(D.precision),M!==D.precision&&console.warn("THREE.WebGLProgram.getParameters:",D.precision,"not supported, using",M,"instead."));const Ft=Et.morphAttributes.position||Et.morphAttributes.normal||Et.morphAttributes.color,L=Ft!==void 0?Ft.length:0;let rt=0;Et.morphAttributes.position!==void 0&&(rt=1),Et.morphAttributes.normal!==void 0&&(rt=2),Et.morphAttributes.color!==void 0&&(rt=3);let Nt,K,yt,Bt;if(Pt){const le=ea[Pt];Nt=le.vertexShader,K=le.fragmentShader}else Nt=D.vertexShader,K=D.fragmentShader,m.update(D),yt=m.getVertexShaderID(D),Bt=m.getFragmentShaderID(D);const zt=o.getRenderTarget(),$t=o.state.buffers.depth.getReversed(),Jt=st.isInstancedMesh===!0,pe=st.isBatchedMesh===!0,je=!!D.map,be=!!D.matcap,ln=!!$,k=!!D.aoMap,Rn=!!D.lightMap,xe=!!D.bumpMap,Te=!!D.normalMap,j=!!D.displacementMap,I=!!D.emissiveMap,Dt=!!D.metalnessMap,R=!!D.roughnessMap,E=D.anisotropy>0,H=D.clearcoat>0,nt=D.dispersion>0,ht=D.iridescence>0,ot=D.sheen>0,xt=D.transmission>0,pt=E&&!!D.anisotropyMap,Ht=H&&!!D.clearcoatMap,ee=H&&!!D.clearcoatNormalMap,vt=H&&!!D.clearcoatRoughnessMap,Ut=ht&&!!D.iridescenceMap,Vt=ht&&!!D.iridescenceThicknessMap,Ct=ot&&!!D.sheenColorMap,kt=ot&&!!D.sheenRoughnessMap,ae=!!D.specularMap,se=!!D.specularColorMap,Xt=!!D.specularIntensityMap,O=xt&&!!D.transmissionMap,Ot=xt&&!!D.thicknessMap,Q=!!D.gradientMap,gt=!!D.alphaMap,It=D.alphaTest>0,Tt=!!D.alphaHash,Qt=!!D.extensions;let Ge=ds;D.toneMapped&&(zt===null||zt.isXRRenderTarget===!0)&&(Ge=o.toneMapping);const ze={shaderID:Pt,shaderType:D.type,shaderName:D.name,vertexShader:Nt,fragmentShader:K,defines:D.defines,customVertexShaderID:yt,customFragmentShaderID:Bt,isRawShaderMaterial:D.isRawShaderMaterial===!0,glslVersion:D.glslVersion,precision:M,batching:pe,batchingColor:pe&&st._colorsTexture!==null,instancing:Jt,instancingColor:Jt&&st.instanceColor!==null,instancingMorph:Jt&&st.morphTexture!==null,supportsVertexTextures:y,outputColorSpace:zt===null?o.outputColorSpace:zt.isXRRenderTarget===!0?zt.texture.colorSpace:jr,alphaToCoverage:!!D.alphaToCoverage,map:je,matcap:be,envMap:ln,envMapMode:ln&&$.mapping,envMapCubeUVHeight:tt,aoMap:k,lightMap:Rn,bumpMap:xe,normalMap:Te,displacementMap:y&&j,emissiveMap:I,normalMapObjectSpace:Te&&D.normalMapType===iS,normalMapTangentSpace:Te&&D.normalMapType===Y_,metalnessMap:Dt,roughnessMap:R,anisotropy:E,anisotropyMap:pt,clearcoat:H,clearcoatMap:Ht,clearcoatNormalMap:ee,clearcoatRoughnessMap:vt,dispersion:nt,iridescence:ht,iridescenceMap:Ut,iridescenceThicknessMap:Vt,sheen:ot,sheenColorMap:Ct,sheenRoughnessMap:kt,specularMap:ae,specularColorMap:se,specularIntensityMap:Xt,transmission:xt,transmissionMap:O,thicknessMap:Ot,gradientMap:Q,opaque:D.transparent===!1&&D.blending===Hr&&D.alphaToCoverage===!1,alphaMap:gt,alphaTest:It,alphaHash:Tt,combine:D.combine,mapUv:je&&w(D.map.channel),aoMapUv:k&&w(D.aoMap.channel),lightMapUv:Rn&&w(D.lightMap.channel),bumpMapUv:xe&&w(D.bumpMap.channel),normalMapUv:Te&&w(D.normalMap.channel),displacementMapUv:j&&w(D.displacementMap.channel),emissiveMapUv:I&&w(D.emissiveMap.channel),metalnessMapUv:Dt&&w(D.metalnessMap.channel),roughnessMapUv:R&&w(D.roughnessMap.channel),anisotropyMapUv:pt&&w(D.anisotropyMap.channel),clearcoatMapUv:Ht&&w(D.clearcoatMap.channel),clearcoatNormalMapUv:ee&&w(D.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:vt&&w(D.clearcoatRoughnessMap.channel),iridescenceMapUv:Ut&&w(D.iridescenceMap.channel),iridescenceThicknessMapUv:Vt&&w(D.iridescenceThicknessMap.channel),sheenColorMapUv:Ct&&w(D.sheenColorMap.channel),sheenRoughnessMapUv:kt&&w(D.sheenRoughnessMap.channel),specularMapUv:ae&&w(D.specularMap.channel),specularColorMapUv:se&&w(D.specularColorMap.channel),specularIntensityMapUv:Xt&&w(D.specularIntensityMap.channel),transmissionMapUv:O&&w(D.transmissionMap.channel),thicknessMapUv:Ot&&w(D.thicknessMap.channel),alphaMapUv:gt&&w(D.alphaMap.channel),vertexTangents:!!Et.attributes.tangent&&(Te||E),vertexColors:D.vertexColors,vertexAlphas:D.vertexColors===!0&&!!Et.attributes.color&&Et.attributes.color.itemSize===4,pointsUvs:st.isPoints===!0&&!!Et.attributes.uv&&(je||gt),fog:!!Mt,useFog:D.fog===!0,fogExp2:!!Mt&&Mt.isFogExp2,flatShading:D.flatShading===!0,sizeAttenuation:D.sizeAttenuation===!0,logarithmicDepthBuffer:x,reverseDepthBuffer:$t,skinning:st.isSkinnedMesh===!0,morphTargets:Et.morphAttributes.position!==void 0,morphNormals:Et.morphAttributes.normal!==void 0,morphColors:Et.morphAttributes.color!==void 0,morphTargetsCount:L,morphTextureStride:rt,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:D.dithering,shadowMapEnabled:o.shadowMap.enabled&&G.length>0,shadowMapType:o.shadowMap.type,toneMapping:Ge,decodeVideoTexture:je&&D.map.isVideoTexture===!0&&Xe.getTransfer(D.map.colorSpace)===rn,decodeVideoTextureEmissive:I&&D.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(D.emissiveMap.colorSpace)===rn,premultipliedAlpha:D.premultipliedAlpha,doubleSided:D.side===Ri,flipSided:D.side===_i,useDepthPacking:D.depthPacking>=0,depthPacking:D.depthPacking||0,index0AttributeName:D.index0AttributeName,extensionClipCullDistance:Qt&&D.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Qt&&D.extensions.multiDraw===!0||pe)&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:D.customProgramCacheKey()};return ze.vertexUv1s=p.has(1),ze.vertexUv2s=p.has(2),ze.vertexUv3s=p.has(3),p.clear(),ze}function g(D){const C=[];if(D.shaderID?C.push(D.shaderID):(C.push(D.customVertexShaderID),C.push(D.customFragmentShaderID)),D.defines!==void 0)for(const G in D.defines)C.push(G),C.push(D.defines[G]);return D.isRawShaderMaterial===!1&&(F(C,D),N(C,D),C.push(o.outputColorSpace)),C.push(D.customProgramCacheKey),C.join()}function F(D,C){D.push(C.precision),D.push(C.outputColorSpace),D.push(C.envMapMode),D.push(C.envMapCubeUVHeight),D.push(C.mapUv),D.push(C.alphaMapUv),D.push(C.lightMapUv),D.push(C.aoMapUv),D.push(C.bumpMapUv),D.push(C.normalMapUv),D.push(C.displacementMapUv),D.push(C.emissiveMapUv),D.push(C.metalnessMapUv),D.push(C.roughnessMapUv),D.push(C.anisotropyMapUv),D.push(C.clearcoatMapUv),D.push(C.clearcoatNormalMapUv),D.push(C.clearcoatRoughnessMapUv),D.push(C.iridescenceMapUv),D.push(C.iridescenceThicknessMapUv),D.push(C.sheenColorMapUv),D.push(C.sheenRoughnessMapUv),D.push(C.specularMapUv),D.push(C.specularColorMapUv),D.push(C.specularIntensityMapUv),D.push(C.transmissionMapUv),D.push(C.thicknessMapUv),D.push(C.combine),D.push(C.fogExp2),D.push(C.sizeAttenuation),D.push(C.morphTargetsCount),D.push(C.morphAttributeCount),D.push(C.numDirLights),D.push(C.numPointLights),D.push(C.numSpotLights),D.push(C.numSpotLightMaps),D.push(C.numHemiLights),D.push(C.numRectAreaLights),D.push(C.numDirLightShadows),D.push(C.numPointLightShadows),D.push(C.numSpotLightShadows),D.push(C.numSpotLightShadowsWithMaps),D.push(C.numLightProbes),D.push(C.shadowMapType),D.push(C.toneMapping),D.push(C.numClippingPlanes),D.push(C.numClipIntersection),D.push(C.depthPacking)}function N(D,C){h.disableAll(),C.supportsVertexTextures&&h.enable(0),C.instancing&&h.enable(1),C.instancingColor&&h.enable(2),C.instancingMorph&&h.enable(3),C.matcap&&h.enable(4),C.envMap&&h.enable(5),C.normalMapObjectSpace&&h.enable(6),C.normalMapTangentSpace&&h.enable(7),C.clearcoat&&h.enable(8),C.iridescence&&h.enable(9),C.alphaTest&&h.enable(10),C.vertexColors&&h.enable(11),C.vertexAlphas&&h.enable(12),C.vertexUv1s&&h.enable(13),C.vertexUv2s&&h.enable(14),C.vertexUv3s&&h.enable(15),C.vertexTangents&&h.enable(16),C.anisotropy&&h.enable(17),C.alphaHash&&h.enable(18),C.batching&&h.enable(19),C.dispersion&&h.enable(20),C.batchingColor&&h.enable(21),D.push(h.mask),h.disableAll(),C.fog&&h.enable(0),C.useFog&&h.enable(1),C.flatShading&&h.enable(2),C.logarithmicDepthBuffer&&h.enable(3),C.reverseDepthBuffer&&h.enable(4),C.skinning&&h.enable(5),C.morphTargets&&h.enable(6),C.morphNormals&&h.enable(7),C.morphColors&&h.enable(8),C.premultipliedAlpha&&h.enable(9),C.shadowMapEnabled&&h.enable(10),C.doubleSided&&h.enable(11),C.flipSided&&h.enable(12),C.useDepthPacking&&h.enable(13),C.dithering&&h.enable(14),C.transmission&&h.enable(15),C.sheen&&h.enable(16),C.opaque&&h.enable(17),C.pointsUvs&&h.enable(18),C.decodeVideoTexture&&h.enable(19),C.decodeVideoTextureEmissive&&h.enable(20),C.alphaToCoverage&&h.enable(21),D.push(h.mask)}function U(D){const C=T[D.type];let G;if(C){const ft=ea[C];G=NS.clone(ft.uniforms)}else G=D.uniforms;return G}function W(D,C){let G;for(let ft=0,st=v.length;ft<st;ft++){const Mt=v[ft];if(Mt.cacheKey===C){G=Mt,++G.usedTimes;break}}return G===void 0&&(G=new iT(o,C,D,u),v.push(G)),G}function V(D){if(--D.usedTimes===0){const C=v.indexOf(D);v[C]=v[v.length-1],v.pop(),D.destroy()}}function P(D){m.remove(D)}function q(){m.dispose()}return{getParameters:S,getProgramCacheKey:g,getUniforms:U,acquireProgram:W,releaseProgram:V,releaseShaderCache:P,programs:v,dispose:q}}function lT(){let o=new WeakMap;function e(d){return o.has(d)}function i(d){let h=o.get(d);return h===void 0&&(h={},o.set(d,h)),h}function s(d){o.delete(d)}function l(d,h,m){o.get(d)[h]=m}function u(){o=new WeakMap}return{has:e,get:i,remove:s,update:l,dispose:u}}function cT(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.material.id!==e.material.id?o.material.id-e.material.id:o.z!==e.z?o.z-e.z:o.id-e.id}function w_(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.z!==e.z?e.z-o.z:o.id-e.id}function R_(){const o=[];let e=0;const i=[],s=[],l=[];function u(){e=0,i.length=0,s.length=0,l.length=0}function d(x,y,M,T,w,S){let g=o[e];return g===void 0?(g={id:x.id,object:x,geometry:y,material:M,groupOrder:T,renderOrder:x.renderOrder,z:w,group:S},o[e]=g):(g.id=x.id,g.object=x,g.geometry=y,g.material=M,g.groupOrder=T,g.renderOrder=x.renderOrder,g.z=w,g.group=S),e++,g}function h(x,y,M,T,w,S){const g=d(x,y,M,T,w,S);M.transmission>0?s.push(g):M.transparent===!0?l.push(g):i.push(g)}function m(x,y,M,T,w,S){const g=d(x,y,M,T,w,S);M.transmission>0?s.unshift(g):M.transparent===!0?l.unshift(g):i.unshift(g)}function p(x,y){i.length>1&&i.sort(x||cT),s.length>1&&s.sort(y||w_),l.length>1&&l.sort(y||w_)}function v(){for(let x=e,y=o.length;x<y;x++){const M=o[x];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:i,transmissive:s,transparent:l,init:u,push:h,unshift:m,finish:v,sort:p}}function uT(){let o=new WeakMap;function e(s,l){const u=o.get(s);let d;return u===void 0?(d=new R_,o.set(s,[d])):l>=u.length?(d=new R_,u.push(d)):d=u[l],d}function i(){o=new WeakMap}return{get:e,dispose:i}}function fT(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={direction:new et,color:new Ue};break;case"SpotLight":i={position:new et,direction:new et,color:new Ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new et,color:new Ue,distance:0,decay:0};break;case"HemisphereLight":i={direction:new et,skyColor:new Ue,groundColor:new Ue};break;case"RectAreaLight":i={color:new Ue,position:new et,halfWidth:new et,halfHeight:new et};break}return o[e.id]=i,i}}}function dT(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qe};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qe};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qe,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[e.id]=i,i}}}let hT=0;function pT(o,e){return(e.castShadow?2:0)-(o.castShadow?2:0)+(e.map?1:0)-(o.map?1:0)}function mT(o){const e=new fT,i=dT(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new et);const l=new et,u=new yn,d=new yn;function h(p){let v=0,x=0,y=0;for(let D=0;D<9;D++)s.probe[D].set(0,0,0);let M=0,T=0,w=0,S=0,g=0,F=0,N=0,U=0,W=0,V=0,P=0;p.sort(pT);for(let D=0,C=p.length;D<C;D++){const G=p[D],ft=G.color,st=G.intensity,Mt=G.distance,Et=G.shadow&&G.shadow.map?G.shadow.map.texture:null;if(G.isAmbientLight)v+=ft.r*st,x+=ft.g*st,y+=ft.b*st;else if(G.isLightProbe){for(let z=0;z<9;z++)s.probe[z].addScaledVector(G.sh.coefficients[z],st);P++}else if(G.isDirectionalLight){const z=e.get(G);if(z.color.copy(G.color).multiplyScalar(G.intensity),G.castShadow){const $=G.shadow,tt=i.get(G);tt.shadowIntensity=$.intensity,tt.shadowBias=$.bias,tt.shadowNormalBias=$.normalBias,tt.shadowRadius=$.radius,tt.shadowMapSize=$.mapSize,s.directionalShadow[M]=tt,s.directionalShadowMap[M]=Et,s.directionalShadowMatrix[M]=G.shadow.matrix,F++}s.directional[M]=z,M++}else if(G.isSpotLight){const z=e.get(G);z.position.setFromMatrixPosition(G.matrixWorld),z.color.copy(ft).multiplyScalar(st),z.distance=Mt,z.coneCos=Math.cos(G.angle),z.penumbraCos=Math.cos(G.angle*(1-G.penumbra)),z.decay=G.decay,s.spot[w]=z;const $=G.shadow;if(G.map&&(s.spotLightMap[W]=G.map,W++,$.updateMatrices(G),G.castShadow&&V++),s.spotLightMatrix[w]=$.matrix,G.castShadow){const tt=i.get(G);tt.shadowIntensity=$.intensity,tt.shadowBias=$.bias,tt.shadowNormalBias=$.normalBias,tt.shadowRadius=$.radius,tt.shadowMapSize=$.mapSize,s.spotShadow[w]=tt,s.spotShadowMap[w]=Et,U++}w++}else if(G.isRectAreaLight){const z=e.get(G);z.color.copy(ft).multiplyScalar(st),z.halfWidth.set(G.width*.5,0,0),z.halfHeight.set(0,G.height*.5,0),s.rectArea[S]=z,S++}else if(G.isPointLight){const z=e.get(G);if(z.color.copy(G.color).multiplyScalar(G.intensity),z.distance=G.distance,z.decay=G.decay,G.castShadow){const $=G.shadow,tt=i.get(G);tt.shadowIntensity=$.intensity,tt.shadowBias=$.bias,tt.shadowNormalBias=$.normalBias,tt.shadowRadius=$.radius,tt.shadowMapSize=$.mapSize,tt.shadowCameraNear=$.camera.near,tt.shadowCameraFar=$.camera.far,s.pointShadow[T]=tt,s.pointShadowMap[T]=Et,s.pointShadowMatrix[T]=G.shadow.matrix,N++}s.point[T]=z,T++}else if(G.isHemisphereLight){const z=e.get(G);z.skyColor.copy(G.color).multiplyScalar(st),z.groundColor.copy(G.groundColor).multiplyScalar(st),s.hemi[g]=z,g++}}S>0&&(o.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=jt.LTC_FLOAT_1,s.rectAreaLTC2=jt.LTC_FLOAT_2):(s.rectAreaLTC1=jt.LTC_HALF_1,s.rectAreaLTC2=jt.LTC_HALF_2)),s.ambient[0]=v,s.ambient[1]=x,s.ambient[2]=y;const q=s.hash;(q.directionalLength!==M||q.pointLength!==T||q.spotLength!==w||q.rectAreaLength!==S||q.hemiLength!==g||q.numDirectionalShadows!==F||q.numPointShadows!==N||q.numSpotShadows!==U||q.numSpotMaps!==W||q.numLightProbes!==P)&&(s.directional.length=M,s.spot.length=w,s.rectArea.length=S,s.point.length=T,s.hemi.length=g,s.directionalShadow.length=F,s.directionalShadowMap.length=F,s.pointShadow.length=N,s.pointShadowMap.length=N,s.spotShadow.length=U,s.spotShadowMap.length=U,s.directionalShadowMatrix.length=F,s.pointShadowMatrix.length=N,s.spotLightMatrix.length=U+W-V,s.spotLightMap.length=W,s.numSpotLightShadowsWithMaps=V,s.numLightProbes=P,q.directionalLength=M,q.pointLength=T,q.spotLength=w,q.rectAreaLength=S,q.hemiLength=g,q.numDirectionalShadows=F,q.numPointShadows=N,q.numSpotShadows=U,q.numSpotMaps=W,q.numLightProbes=P,s.version=hT++)}function m(p,v){let x=0,y=0,M=0,T=0,w=0;const S=v.matrixWorldInverse;for(let g=0,F=p.length;g<F;g++){const N=p[g];if(N.isDirectionalLight){const U=s.directional[x];U.direction.setFromMatrixPosition(N.matrixWorld),l.setFromMatrixPosition(N.target.matrixWorld),U.direction.sub(l),U.direction.transformDirection(S),x++}else if(N.isSpotLight){const U=s.spot[M];U.position.setFromMatrixPosition(N.matrixWorld),U.position.applyMatrix4(S),U.direction.setFromMatrixPosition(N.matrixWorld),l.setFromMatrixPosition(N.target.matrixWorld),U.direction.sub(l),U.direction.transformDirection(S),M++}else if(N.isRectAreaLight){const U=s.rectArea[T];U.position.setFromMatrixPosition(N.matrixWorld),U.position.applyMatrix4(S),d.identity(),u.copy(N.matrixWorld),u.premultiply(S),d.extractRotation(u),U.halfWidth.set(N.width*.5,0,0),U.halfHeight.set(0,N.height*.5,0),U.halfWidth.applyMatrix4(d),U.halfHeight.applyMatrix4(d),T++}else if(N.isPointLight){const U=s.point[y];U.position.setFromMatrixPosition(N.matrixWorld),U.position.applyMatrix4(S),y++}else if(N.isHemisphereLight){const U=s.hemi[w];U.direction.setFromMatrixPosition(N.matrixWorld),U.direction.transformDirection(S),w++}}}return{setup:h,setupView:m,state:s}}function C_(o){const e=new mT(o),i=[],s=[];function l(v){p.camera=v,i.length=0,s.length=0}function u(v){i.push(v)}function d(v){s.push(v)}function h(){e.setup(i)}function m(v){e.setupView(i,v)}const p={lightsArray:i,shadowsArray:s,camera:null,lights:e,transmissionRenderTarget:{}};return{init:l,state:p,setupLights:h,setupLightsView:m,pushLight:u,pushShadow:d}}function gT(o){let e=new WeakMap;function i(l,u=0){const d=e.get(l);let h;return d===void 0?(h=new C_(o),e.set(l,[h])):u>=d.length?(h=new C_(o),d.push(h)):h=d[u],h}function s(){e=new WeakMap}return{get:i,dispose:s}}const _T=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,vT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function xT(o,e,i){let s=new Fh;const l=new qe,u=new qe,d=new on,h=new GS({depthPacking:nS}),m=new VS,p={},v=i.maxTextureSize,x={[hs]:_i,[_i]:hs,[Ri]:Ri},y=new ps({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new qe},radius:{value:4}},vertexShader:_T,fragmentShader:vT}),M=y.clone();M.defines.HORIZONTAL_PASS=1;const T=new ai;T.setAttribute("position",new ia(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new Wt(T,y),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=L_;let g=this.type;this.render=function(V,P,q){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||V.length===0)return;const D=o.getRenderTarget(),C=o.getActiveCubeFace(),G=o.getActiveMipmapLevel(),ft=o.state;ft.setBlending(fs),ft.buffers.color.setClear(1,1,1,1),ft.buffers.depth.setTest(!0),ft.setScissorTest(!1);const st=g!==Ra&&this.type===Ra,Mt=g===Ra&&this.type!==Ra;for(let Et=0,z=V.length;Et<z;Et++){const $=V[Et],tt=$.shadow;if(tt===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(tt.autoUpdate===!1&&tt.needsUpdate===!1)continue;l.copy(tt.mapSize);const Pt=tt.getFrameExtents();if(l.multiply(Pt),u.copy(tt.mapSize),(l.x>v||l.y>v)&&(l.x>v&&(u.x=Math.floor(v/Pt.x),l.x=u.x*Pt.x,tt.mapSize.x=u.x),l.y>v&&(u.y=Math.floor(v/Pt.y),l.y=u.y*Pt.y,tt.mapSize.y=u.y)),tt.map===null||st===!0||Mt===!0){const L=this.type!==Ra?{minFilter:ji,magFilter:ji}:{};tt.map!==null&&tt.map.dispose(),tt.map=new Ys(l.x,l.y,L),tt.map.texture.name=$.name+".shadowMap",tt.camera.updateProjectionMatrix()}o.setRenderTarget(tt.map),o.clear();const Ft=tt.getViewportCount();for(let L=0;L<Ft;L++){const rt=tt.getViewport(L);d.set(u.x*rt.x,u.y*rt.y,u.x*rt.z,u.y*rt.w),ft.viewport(d),tt.updateMatrices($,L),s=tt.getFrustum(),U(P,q,tt.camera,$,this.type)}tt.isPointLightShadow!==!0&&this.type===Ra&&F(tt,q),tt.needsUpdate=!1}g=this.type,S.needsUpdate=!1,o.setRenderTarget(D,C,G)};function F(V,P){const q=e.update(w);y.defines.VSM_SAMPLES!==V.blurSamples&&(y.defines.VSM_SAMPLES=V.blurSamples,M.defines.VSM_SAMPLES=V.blurSamples,y.needsUpdate=!0,M.needsUpdate=!0),V.mapPass===null&&(V.mapPass=new Ys(l.x,l.y)),y.uniforms.shadow_pass.value=V.map.texture,y.uniforms.resolution.value=V.mapSize,y.uniforms.radius.value=V.radius,o.setRenderTarget(V.mapPass),o.clear(),o.renderBufferDirect(P,null,q,y,w,null),M.uniforms.shadow_pass.value=V.mapPass.texture,M.uniforms.resolution.value=V.mapSize,M.uniforms.radius.value=V.radius,o.setRenderTarget(V.map),o.clear(),o.renderBufferDirect(P,null,q,M,w,null)}function N(V,P,q,D){let C=null;const G=q.isPointLight===!0?V.customDistanceMaterial:V.customDepthMaterial;if(G!==void 0)C=G;else if(C=q.isPointLight===!0?m:h,o.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){const ft=C.uuid,st=P.uuid;let Mt=p[ft];Mt===void 0&&(Mt={},p[ft]=Mt);let Et=Mt[st];Et===void 0&&(Et=C.clone(),Mt[st]=Et,P.addEventListener("dispose",W)),C=Et}if(C.visible=P.visible,C.wireframe=P.wireframe,D===Ra?C.side=P.shadowSide!==null?P.shadowSide:P.side:C.side=P.shadowSide!==null?P.shadowSide:x[P.side],C.alphaMap=P.alphaMap,C.alphaTest=P.alphaTest,C.map=P.map,C.clipShadows=P.clipShadows,C.clippingPlanes=P.clippingPlanes,C.clipIntersection=P.clipIntersection,C.displacementMap=P.displacementMap,C.displacementScale=P.displacementScale,C.displacementBias=P.displacementBias,C.wireframeLinewidth=P.wireframeLinewidth,C.linewidth=P.linewidth,q.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const ft=o.properties.get(C);ft.light=q}return C}function U(V,P,q,D,C){if(V.visible===!1)return;if(V.layers.test(P.layers)&&(V.isMesh||V.isLine||V.isPoints)&&(V.castShadow||V.receiveShadow&&C===Ra)&&(!V.frustumCulled||s.intersectsObject(V))){V.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,V.matrixWorld);const st=e.update(V),Mt=V.material;if(Array.isArray(Mt)){const Et=st.groups;for(let z=0,$=Et.length;z<$;z++){const tt=Et[z],Pt=Mt[tt.materialIndex];if(Pt&&Pt.visible){const Ft=N(V,Pt,D,C);V.onBeforeShadow(o,V,P,q,st,Ft,tt),o.renderBufferDirect(q,null,st,Ft,V,tt),V.onAfterShadow(o,V,P,q,st,Ft,tt)}}}else if(Mt.visible){const Et=N(V,Mt,D,C);V.onBeforeShadow(o,V,P,q,st,Et,null),o.renderBufferDirect(q,null,st,Et,V,null),V.onAfterShadow(o,V,P,q,st,Et,null)}}const ft=V.children;for(let st=0,Mt=ft.length;st<Mt;st++)U(ft[st],P,q,D,C)}function W(V){V.target.removeEventListener("dispose",W);for(const q in p){const D=p[q],C=V.target.uuid;C in D&&(D[C].dispose(),delete D[C])}}}const yT={[Xd]:qd,[Wd]:Zd,[Yd]:Kd,[kr]:jd,[qd]:Xd,[Zd]:Wd,[Kd]:Yd,[jd]:kr};function ST(o,e){function i(){let O=!1;const Ot=new on;let Q=null;const gt=new on(0,0,0,0);return{setMask:function(It){Q!==It&&!O&&(o.colorMask(It,It,It,It),Q=It)},setLocked:function(It){O=It},setClear:function(It,Tt,Qt,Ge,ze){ze===!0&&(It*=Ge,Tt*=Ge,Qt*=Ge),Ot.set(It,Tt,Qt,Ge),gt.equals(Ot)===!1&&(o.clearColor(It,Tt,Qt,Ge),gt.copy(Ot))},reset:function(){O=!1,Q=null,gt.set(-1,0,0,0)}}}function s(){let O=!1,Ot=!1,Q=null,gt=null,It=null;return{setReversed:function(Tt){if(Ot!==Tt){const Qt=e.get("EXT_clip_control");Ot?Qt.clipControlEXT(Qt.LOWER_LEFT_EXT,Qt.ZERO_TO_ONE_EXT):Qt.clipControlEXT(Qt.LOWER_LEFT_EXT,Qt.NEGATIVE_ONE_TO_ONE_EXT);const Ge=It;It=null,this.setClear(Ge)}Ot=Tt},getReversed:function(){return Ot},setTest:function(Tt){Tt?zt(o.DEPTH_TEST):$t(o.DEPTH_TEST)},setMask:function(Tt){Q!==Tt&&!O&&(o.depthMask(Tt),Q=Tt)},setFunc:function(Tt){if(Ot&&(Tt=yT[Tt]),gt!==Tt){switch(Tt){case Xd:o.depthFunc(o.NEVER);break;case qd:o.depthFunc(o.ALWAYS);break;case Wd:o.depthFunc(o.LESS);break;case kr:o.depthFunc(o.LEQUAL);break;case Yd:o.depthFunc(o.EQUAL);break;case jd:o.depthFunc(o.GEQUAL);break;case Zd:o.depthFunc(o.GREATER);break;case Kd:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}gt=Tt}},setLocked:function(Tt){O=Tt},setClear:function(Tt){It!==Tt&&(Ot&&(Tt=1-Tt),o.clearDepth(Tt),It=Tt)},reset:function(){O=!1,Q=null,gt=null,It=null,Ot=!1}}}function l(){let O=!1,Ot=null,Q=null,gt=null,It=null,Tt=null,Qt=null,Ge=null,ze=null;return{setTest:function(le){O||(le?zt(o.STENCIL_TEST):$t(o.STENCIL_TEST))},setMask:function(le){Ot!==le&&!O&&(o.stencilMask(le),Ot=le)},setFunc:function(le,tn,Cn){(Q!==le||gt!==tn||It!==Cn)&&(o.stencilFunc(le,tn,Cn),Q=le,gt=tn,It=Cn)},setOp:function(le,tn,Cn){(Tt!==le||Qt!==tn||Ge!==Cn)&&(o.stencilOp(le,tn,Cn),Tt=le,Qt=tn,Ge=Cn)},setLocked:function(le){O=le},setClear:function(le){ze!==le&&(o.clearStencil(le),ze=le)},reset:function(){O=!1,Ot=null,Q=null,gt=null,It=null,Tt=null,Qt=null,Ge=null,ze=null}}}const u=new i,d=new s,h=new l,m=new WeakMap,p=new WeakMap;let v={},x={},y=new WeakMap,M=[],T=null,w=!1,S=null,g=null,F=null,N=null,U=null,W=null,V=null,P=new Ue(0,0,0),q=0,D=!1,C=null,G=null,ft=null,st=null,Mt=null;const Et=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,$=0;const tt=o.getParameter(o.VERSION);tt.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(tt)[1]),z=$>=1):tt.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(tt)[1]),z=$>=2);let Pt=null,Ft={};const L=o.getParameter(o.SCISSOR_BOX),rt=o.getParameter(o.VIEWPORT),Nt=new on().fromArray(L),K=new on().fromArray(rt);function yt(O,Ot,Q,gt){const It=new Uint8Array(4),Tt=o.createTexture();o.bindTexture(O,Tt),o.texParameteri(O,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(O,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let Qt=0;Qt<Q;Qt++)O===o.TEXTURE_3D||O===o.TEXTURE_2D_ARRAY?o.texImage3D(Ot,0,o.RGBA,1,1,gt,0,o.RGBA,o.UNSIGNED_BYTE,It):o.texImage2D(Ot+Qt,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,It);return Tt}const Bt={};Bt[o.TEXTURE_2D]=yt(o.TEXTURE_2D,o.TEXTURE_2D,1),Bt[o.TEXTURE_CUBE_MAP]=yt(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),Bt[o.TEXTURE_2D_ARRAY]=yt(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),Bt[o.TEXTURE_3D]=yt(o.TEXTURE_3D,o.TEXTURE_3D,1,1),u.setClear(0,0,0,1),d.setClear(1),h.setClear(0),zt(o.DEPTH_TEST),d.setFunc(kr),xe(!1),Te(Cg),zt(o.CULL_FACE),k(fs);function zt(O){v[O]!==!0&&(o.enable(O),v[O]=!0)}function $t(O){v[O]!==!1&&(o.disable(O),v[O]=!1)}function Jt(O,Ot){return x[O]!==Ot?(o.bindFramebuffer(O,Ot),x[O]=Ot,O===o.DRAW_FRAMEBUFFER&&(x[o.FRAMEBUFFER]=Ot),O===o.FRAMEBUFFER&&(x[o.DRAW_FRAMEBUFFER]=Ot),!0):!1}function pe(O,Ot){let Q=M,gt=!1;if(O){Q=y.get(Ot),Q===void 0&&(Q=[],y.set(Ot,Q));const It=O.textures;if(Q.length!==It.length||Q[0]!==o.COLOR_ATTACHMENT0){for(let Tt=0,Qt=It.length;Tt<Qt;Tt++)Q[Tt]=o.COLOR_ATTACHMENT0+Tt;Q.length=It.length,gt=!0}}else Q[0]!==o.BACK&&(Q[0]=o.BACK,gt=!0);gt&&o.drawBuffers(Q)}function je(O){return T!==O?(o.useProgram(O),T=O,!0):!1}const be={[Gs]:o.FUNC_ADD,[Cy]:o.FUNC_SUBTRACT,[Dy]:o.FUNC_REVERSE_SUBTRACT};be[Uy]=o.MIN,be[Ly]=o.MAX;const ln={[Ny]:o.ZERO,[Oy]:o.ONE,[zy]:o.SRC_COLOR,[Vd]:o.SRC_ALPHA,[Gy]:o.SRC_ALPHA_SATURATE,[Fy]:o.DST_COLOR,[Iy]:o.DST_ALPHA,[Py]:o.ONE_MINUS_SRC_COLOR,[kd]:o.ONE_MINUS_SRC_ALPHA,[Hy]:o.ONE_MINUS_DST_COLOR,[By]:o.ONE_MINUS_DST_ALPHA,[Vy]:o.CONSTANT_COLOR,[ky]:o.ONE_MINUS_CONSTANT_COLOR,[Xy]:o.CONSTANT_ALPHA,[qy]:o.ONE_MINUS_CONSTANT_ALPHA};function k(O,Ot,Q,gt,It,Tt,Qt,Ge,ze,le){if(O===fs){w===!0&&($t(o.BLEND),w=!1);return}if(w===!1&&(zt(o.BLEND),w=!0),O!==Ry){if(O!==S||le!==D){if((g!==Gs||U!==Gs)&&(o.blendEquation(o.FUNC_ADD),g=Gs,U=Gs),le)switch(O){case Hr:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case Dg:o.blendFunc(o.ONE,o.ONE);break;case Ug:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case Lg:o.blendFuncSeparate(o.ZERO,o.SRC_COLOR,o.ZERO,o.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Hr:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case Dg:o.blendFunc(o.SRC_ALPHA,o.ONE);break;case Ug:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case Lg:o.blendFunc(o.ZERO,o.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}F=null,N=null,W=null,V=null,P.set(0,0,0),q=0,S=O,D=le}return}It=It||Ot,Tt=Tt||Q,Qt=Qt||gt,(Ot!==g||It!==U)&&(o.blendEquationSeparate(be[Ot],be[It]),g=Ot,U=It),(Q!==F||gt!==N||Tt!==W||Qt!==V)&&(o.blendFuncSeparate(ln[Q],ln[gt],ln[Tt],ln[Qt]),F=Q,N=gt,W=Tt,V=Qt),(Ge.equals(P)===!1||ze!==q)&&(o.blendColor(Ge.r,Ge.g,Ge.b,ze),P.copy(Ge),q=ze),S=O,D=!1}function Rn(O,Ot){O.side===Ri?$t(o.CULL_FACE):zt(o.CULL_FACE);let Q=O.side===_i;Ot&&(Q=!Q),xe(Q),O.blending===Hr&&O.transparent===!1?k(fs):k(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),d.setFunc(O.depthFunc),d.setTest(O.depthTest),d.setMask(O.depthWrite),u.setMask(O.colorWrite);const gt=O.stencilWrite;h.setTest(gt),gt&&(h.setMask(O.stencilWriteMask),h.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),h.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),I(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?zt(o.SAMPLE_ALPHA_TO_COVERAGE):$t(o.SAMPLE_ALPHA_TO_COVERAGE)}function xe(O){C!==O&&(O?o.frontFace(o.CW):o.frontFace(o.CCW),C=O)}function Te(O){O!==Ay?(zt(o.CULL_FACE),O!==G&&(O===Cg?o.cullFace(o.BACK):O===wy?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):$t(o.CULL_FACE),G=O}function j(O){O!==ft&&(z&&o.lineWidth(O),ft=O)}function I(O,Ot,Q){O?(zt(o.POLYGON_OFFSET_FILL),(st!==Ot||Mt!==Q)&&(o.polygonOffset(Ot,Q),st=Ot,Mt=Q)):$t(o.POLYGON_OFFSET_FILL)}function Dt(O){O?zt(o.SCISSOR_TEST):$t(o.SCISSOR_TEST)}function R(O){O===void 0&&(O=o.TEXTURE0+Et-1),Pt!==O&&(o.activeTexture(O),Pt=O)}function E(O,Ot,Q){Q===void 0&&(Pt===null?Q=o.TEXTURE0+Et-1:Q=Pt);let gt=Ft[Q];gt===void 0&&(gt={type:void 0,texture:void 0},Ft[Q]=gt),(gt.type!==O||gt.texture!==Ot)&&(Pt!==Q&&(o.activeTexture(Q),Pt=Q),o.bindTexture(O,Ot||Bt[O]),gt.type=O,gt.texture=Ot)}function H(){const O=Ft[Pt];O!==void 0&&O.type!==void 0&&(o.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function nt(){try{o.compressedTexImage2D.apply(o,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ht(){try{o.compressedTexImage3D.apply(o,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ot(){try{o.texSubImage2D.apply(o,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function xt(){try{o.texSubImage3D.apply(o,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function pt(){try{o.compressedTexSubImage2D.apply(o,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ht(){try{o.compressedTexSubImage3D.apply(o,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ee(){try{o.texStorage2D.apply(o,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function vt(){try{o.texStorage3D.apply(o,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ut(){try{o.texImage2D.apply(o,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Vt(){try{o.texImage3D.apply(o,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ct(O){Nt.equals(O)===!1&&(o.scissor(O.x,O.y,O.z,O.w),Nt.copy(O))}function kt(O){K.equals(O)===!1&&(o.viewport(O.x,O.y,O.z,O.w),K.copy(O))}function ae(O,Ot){let Q=p.get(Ot);Q===void 0&&(Q=new WeakMap,p.set(Ot,Q));let gt=Q.get(O);gt===void 0&&(gt=o.getUniformBlockIndex(Ot,O.name),Q.set(O,gt))}function se(O,Ot){const gt=p.get(Ot).get(O);m.get(Ot)!==gt&&(o.uniformBlockBinding(Ot,gt,O.__bindingPointIndex),m.set(Ot,gt))}function Xt(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),d.setReversed(!1),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),v={},Pt=null,Ft={},x={},y=new WeakMap,M=[],T=null,w=!1,S=null,g=null,F=null,N=null,U=null,W=null,V=null,P=new Ue(0,0,0),q=0,D=!1,C=null,G=null,ft=null,st=null,Mt=null,Nt.set(0,0,o.canvas.width,o.canvas.height),K.set(0,0,o.canvas.width,o.canvas.height),u.reset(),d.reset(),h.reset()}return{buffers:{color:u,depth:d,stencil:h},enable:zt,disable:$t,bindFramebuffer:Jt,drawBuffers:pe,useProgram:je,setBlending:k,setMaterial:Rn,setFlipSided:xe,setCullFace:Te,setLineWidth:j,setPolygonOffset:I,setScissorTest:Dt,activeTexture:R,bindTexture:E,unbindTexture:H,compressedTexImage2D:nt,compressedTexImage3D:ht,texImage2D:Ut,texImage3D:Vt,updateUBOMapping:ae,uniformBlockBinding:se,texStorage2D:ee,texStorage3D:vt,texSubImage2D:ot,texSubImage3D:xt,compressedTexSubImage2D:pt,compressedTexSubImage3D:Ht,scissor:Ct,viewport:kt,reset:Xt}}function MT(o,e,i,s,l,u,d){const h=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new qe,v=new WeakMap;let x;const y=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function T(R,E){return M?new OffscreenCanvas(R,E):Yc("canvas")}function w(R,E,H){let nt=1;const ht=Dt(R);if((ht.width>H||ht.height>H)&&(nt=H/Math.max(ht.width,ht.height)),nt<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const ot=Math.floor(nt*ht.width),xt=Math.floor(nt*ht.height);x===void 0&&(x=T(ot,xt));const pt=E?T(ot,xt):x;return pt.width=ot,pt.height=xt,pt.getContext("2d").drawImage(R,0,0,ot,xt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ht.width+"x"+ht.height+") to ("+ot+"x"+xt+")."),pt}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ht.width+"x"+ht.height+")."),R;return R}function S(R){return R.generateMipmaps}function g(R){o.generateMipmap(R)}function F(R){return R.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?o.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?o.TEXTURE_2D_ARRAY:o.TEXTURE_2D}function N(R,E,H,nt,ht=!1){if(R!==null){if(o[R]!==void 0)return o[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ot=E;if(E===o.RED&&(H===o.FLOAT&&(ot=o.R32F),H===o.HALF_FLOAT&&(ot=o.R16F),H===o.UNSIGNED_BYTE&&(ot=o.R8)),E===o.RED_INTEGER&&(H===o.UNSIGNED_BYTE&&(ot=o.R8UI),H===o.UNSIGNED_SHORT&&(ot=o.R16UI),H===o.UNSIGNED_INT&&(ot=o.R32UI),H===o.BYTE&&(ot=o.R8I),H===o.SHORT&&(ot=o.R16I),H===o.INT&&(ot=o.R32I)),E===o.RG&&(H===o.FLOAT&&(ot=o.RG32F),H===o.HALF_FLOAT&&(ot=o.RG16F),H===o.UNSIGNED_BYTE&&(ot=o.RG8)),E===o.RG_INTEGER&&(H===o.UNSIGNED_BYTE&&(ot=o.RG8UI),H===o.UNSIGNED_SHORT&&(ot=o.RG16UI),H===o.UNSIGNED_INT&&(ot=o.RG32UI),H===o.BYTE&&(ot=o.RG8I),H===o.SHORT&&(ot=o.RG16I),H===o.INT&&(ot=o.RG32I)),E===o.RGB_INTEGER&&(H===o.UNSIGNED_BYTE&&(ot=o.RGB8UI),H===o.UNSIGNED_SHORT&&(ot=o.RGB16UI),H===o.UNSIGNED_INT&&(ot=o.RGB32UI),H===o.BYTE&&(ot=o.RGB8I),H===o.SHORT&&(ot=o.RGB16I),H===o.INT&&(ot=o.RGB32I)),E===o.RGBA_INTEGER&&(H===o.UNSIGNED_BYTE&&(ot=o.RGBA8UI),H===o.UNSIGNED_SHORT&&(ot=o.RGBA16UI),H===o.UNSIGNED_INT&&(ot=o.RGBA32UI),H===o.BYTE&&(ot=o.RGBA8I),H===o.SHORT&&(ot=o.RGBA16I),H===o.INT&&(ot=o.RGBA32I)),E===o.RGB&&H===o.UNSIGNED_INT_5_9_9_9_REV&&(ot=o.RGB9_E5),E===o.RGBA){const xt=ht?qc:Xe.getTransfer(nt);H===o.FLOAT&&(ot=o.RGBA32F),H===o.HALF_FLOAT&&(ot=o.RGBA16F),H===o.UNSIGNED_BYTE&&(ot=xt===rn?o.SRGB8_ALPHA8:o.RGBA8),H===o.UNSIGNED_SHORT_4_4_4_4&&(ot=o.RGBA4),H===o.UNSIGNED_SHORT_5_5_5_1&&(ot=o.RGB5_A1)}return(ot===o.R16F||ot===o.R32F||ot===o.RG16F||ot===o.RG32F||ot===o.RGBA16F||ot===o.RGBA32F)&&e.get("EXT_color_buffer_float"),ot}function U(R,E){let H;return R?E===null||E===Ws||E===Wr?H=o.DEPTH24_STENCIL8:E===Da?H=o.DEPTH32F_STENCIL8:E===el&&(H=o.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Ws||E===Wr?H=o.DEPTH_COMPONENT24:E===Da?H=o.DEPTH_COMPONENT32F:E===el&&(H=o.DEPTH_COMPONENT16),H}function W(R,E){return S(R)===!0||R.isFramebufferTexture&&R.minFilter!==ji&&R.minFilter!==na?Math.log2(Math.max(E.width,E.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?E.mipmaps.length:1}function V(R){const E=R.target;E.removeEventListener("dispose",V),q(E),E.isVideoTexture&&v.delete(E)}function P(R){const E=R.target;E.removeEventListener("dispose",P),C(E)}function q(R){const E=s.get(R);if(E.__webglInit===void 0)return;const H=R.source,nt=y.get(H);if(nt){const ht=nt[E.__cacheKey];ht.usedTimes--,ht.usedTimes===0&&D(R),Object.keys(nt).length===0&&y.delete(H)}s.remove(R)}function D(R){const E=s.get(R);o.deleteTexture(E.__webglTexture);const H=R.source,nt=y.get(H);delete nt[E.__cacheKey],d.memory.textures--}function C(R){const E=s.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),s.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let nt=0;nt<6;nt++){if(Array.isArray(E.__webglFramebuffer[nt]))for(let ht=0;ht<E.__webglFramebuffer[nt].length;ht++)o.deleteFramebuffer(E.__webglFramebuffer[nt][ht]);else o.deleteFramebuffer(E.__webglFramebuffer[nt]);E.__webglDepthbuffer&&o.deleteRenderbuffer(E.__webglDepthbuffer[nt])}else{if(Array.isArray(E.__webglFramebuffer))for(let nt=0;nt<E.__webglFramebuffer.length;nt++)o.deleteFramebuffer(E.__webglFramebuffer[nt]);else o.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&o.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&o.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let nt=0;nt<E.__webglColorRenderbuffer.length;nt++)E.__webglColorRenderbuffer[nt]&&o.deleteRenderbuffer(E.__webglColorRenderbuffer[nt]);E.__webglDepthRenderbuffer&&o.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const H=R.textures;for(let nt=0,ht=H.length;nt<ht;nt++){const ot=s.get(H[nt]);ot.__webglTexture&&(o.deleteTexture(ot.__webglTexture),d.memory.textures--),s.remove(H[nt])}s.remove(R)}let G=0;function ft(){G=0}function st(){const R=G;return R>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+l.maxTextures),G+=1,R}function Mt(R){const E=[];return E.push(R.wrapS),E.push(R.wrapT),E.push(R.wrapR||0),E.push(R.magFilter),E.push(R.minFilter),E.push(R.anisotropy),E.push(R.internalFormat),E.push(R.format),E.push(R.type),E.push(R.generateMipmaps),E.push(R.premultiplyAlpha),E.push(R.flipY),E.push(R.unpackAlignment),E.push(R.colorSpace),E.join()}function Et(R,E){const H=s.get(R);if(R.isVideoTexture&&j(R),R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){const nt=R.image;if(nt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(nt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(H,R,E);return}}i.bindTexture(o.TEXTURE_2D,H.__webglTexture,o.TEXTURE0+E)}function z(R,E){const H=s.get(R);if(R.version>0&&H.__version!==R.version){K(H,R,E);return}i.bindTexture(o.TEXTURE_2D_ARRAY,H.__webglTexture,o.TEXTURE0+E)}function $(R,E){const H=s.get(R);if(R.version>0&&H.__version!==R.version){K(H,R,E);return}i.bindTexture(o.TEXTURE_3D,H.__webglTexture,o.TEXTURE0+E)}function tt(R,E){const H=s.get(R);if(R.version>0&&H.__version!==R.version){yt(H,R,E);return}i.bindTexture(o.TEXTURE_CUBE_MAP,H.__webglTexture,o.TEXTURE0+E)}const Pt={[$d]:o.REPEAT,[Xs]:o.CLAMP_TO_EDGE,[th]:o.MIRRORED_REPEAT},Ft={[ji]:o.NEAREST,[tS]:o.NEAREST_MIPMAP_NEAREST,[pc]:o.NEAREST_MIPMAP_LINEAR,[na]:o.LINEAR,[cd]:o.LINEAR_MIPMAP_NEAREST,[qs]:o.LINEAR_MIPMAP_LINEAR},L={[aS]:o.NEVER,[uS]:o.ALWAYS,[sS]:o.LESS,[j_]:o.LEQUAL,[rS]:o.EQUAL,[cS]:o.GEQUAL,[oS]:o.GREATER,[lS]:o.NOTEQUAL};function rt(R,E){if(E.type===Da&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===na||E.magFilter===cd||E.magFilter===pc||E.magFilter===qs||E.minFilter===na||E.minFilter===cd||E.minFilter===pc||E.minFilter===qs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),o.texParameteri(R,o.TEXTURE_WRAP_S,Pt[E.wrapS]),o.texParameteri(R,o.TEXTURE_WRAP_T,Pt[E.wrapT]),(R===o.TEXTURE_3D||R===o.TEXTURE_2D_ARRAY)&&o.texParameteri(R,o.TEXTURE_WRAP_R,Pt[E.wrapR]),o.texParameteri(R,o.TEXTURE_MAG_FILTER,Ft[E.magFilter]),o.texParameteri(R,o.TEXTURE_MIN_FILTER,Ft[E.minFilter]),E.compareFunction&&(o.texParameteri(R,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(R,o.TEXTURE_COMPARE_FUNC,L[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===ji||E.minFilter!==pc&&E.minFilter!==qs||E.type===Da&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||s.get(E).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");o.texParameterf(R,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,l.getMaxAnisotropy())),s.get(E).__currentAnisotropy=E.anisotropy}}}function Nt(R,E){let H=!1;R.__webglInit===void 0&&(R.__webglInit=!0,E.addEventListener("dispose",V));const nt=E.source;let ht=y.get(nt);ht===void 0&&(ht={},y.set(nt,ht));const ot=Mt(E);if(ot!==R.__cacheKey){ht[ot]===void 0&&(ht[ot]={texture:o.createTexture(),usedTimes:0},d.memory.textures++,H=!0),ht[ot].usedTimes++;const xt=ht[R.__cacheKey];xt!==void 0&&(ht[R.__cacheKey].usedTimes--,xt.usedTimes===0&&D(E)),R.__cacheKey=ot,R.__webglTexture=ht[ot].texture}return H}function K(R,E,H){let nt=o.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(nt=o.TEXTURE_2D_ARRAY),E.isData3DTexture&&(nt=o.TEXTURE_3D);const ht=Nt(R,E),ot=E.source;i.bindTexture(nt,R.__webglTexture,o.TEXTURE0+H);const xt=s.get(ot);if(ot.version!==xt.__version||ht===!0){i.activeTexture(o.TEXTURE0+H);const pt=Xe.getPrimaries(Xe.workingColorSpace),Ht=E.colorSpace===us?null:Xe.getPrimaries(E.colorSpace),ee=E.colorSpace===us||pt===Ht?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,E.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,E.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);let vt=w(E.image,!1,l.maxTextureSize);vt=I(E,vt);const Ut=u.convert(E.format,E.colorSpace),Vt=u.convert(E.type);let Ct=N(E.internalFormat,Ut,Vt,E.colorSpace,E.isVideoTexture);rt(nt,E);let kt;const ae=E.mipmaps,se=E.isVideoTexture!==!0,Xt=xt.__version===void 0||ht===!0,O=ot.dataReady,Ot=W(E,vt);if(E.isDepthTexture)Ct=U(E.format===Yr,E.type),Xt&&(se?i.texStorage2D(o.TEXTURE_2D,1,Ct,vt.width,vt.height):i.texImage2D(o.TEXTURE_2D,0,Ct,vt.width,vt.height,0,Ut,Vt,null));else if(E.isDataTexture)if(ae.length>0){se&&Xt&&i.texStorage2D(o.TEXTURE_2D,Ot,Ct,ae[0].width,ae[0].height);for(let Q=0,gt=ae.length;Q<gt;Q++)kt=ae[Q],se?O&&i.texSubImage2D(o.TEXTURE_2D,Q,0,0,kt.width,kt.height,Ut,Vt,kt.data):i.texImage2D(o.TEXTURE_2D,Q,Ct,kt.width,kt.height,0,Ut,Vt,kt.data);E.generateMipmaps=!1}else se?(Xt&&i.texStorage2D(o.TEXTURE_2D,Ot,Ct,vt.width,vt.height),O&&i.texSubImage2D(o.TEXTURE_2D,0,0,0,vt.width,vt.height,Ut,Vt,vt.data)):i.texImage2D(o.TEXTURE_2D,0,Ct,vt.width,vt.height,0,Ut,Vt,vt.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){se&&Xt&&i.texStorage3D(o.TEXTURE_2D_ARRAY,Ot,Ct,ae[0].width,ae[0].height,vt.depth);for(let Q=0,gt=ae.length;Q<gt;Q++)if(kt=ae[Q],E.format!==Yi)if(Ut!==null)if(se){if(O)if(E.layerUpdates.size>0){const It=s_(kt.width,kt.height,E.format,E.type);for(const Tt of E.layerUpdates){const Qt=kt.data.subarray(Tt*It/kt.data.BYTES_PER_ELEMENT,(Tt+1)*It/kt.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,Q,0,0,Tt,kt.width,kt.height,1,Ut,Qt)}E.clearLayerUpdates()}else i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,Q,0,0,0,kt.width,kt.height,vt.depth,Ut,kt.data)}else i.compressedTexImage3D(o.TEXTURE_2D_ARRAY,Q,Ct,kt.width,kt.height,vt.depth,0,kt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else se?O&&i.texSubImage3D(o.TEXTURE_2D_ARRAY,Q,0,0,0,kt.width,kt.height,vt.depth,Ut,Vt,kt.data):i.texImage3D(o.TEXTURE_2D_ARRAY,Q,Ct,kt.width,kt.height,vt.depth,0,Ut,Vt,kt.data)}else{se&&Xt&&i.texStorage2D(o.TEXTURE_2D,Ot,Ct,ae[0].width,ae[0].height);for(let Q=0,gt=ae.length;Q<gt;Q++)kt=ae[Q],E.format!==Yi?Ut!==null?se?O&&i.compressedTexSubImage2D(o.TEXTURE_2D,Q,0,0,kt.width,kt.height,Ut,kt.data):i.compressedTexImage2D(o.TEXTURE_2D,Q,Ct,kt.width,kt.height,0,kt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):se?O&&i.texSubImage2D(o.TEXTURE_2D,Q,0,0,kt.width,kt.height,Ut,Vt,kt.data):i.texImage2D(o.TEXTURE_2D,Q,Ct,kt.width,kt.height,0,Ut,Vt,kt.data)}else if(E.isDataArrayTexture)if(se){if(Xt&&i.texStorage3D(o.TEXTURE_2D_ARRAY,Ot,Ct,vt.width,vt.height,vt.depth),O)if(E.layerUpdates.size>0){const Q=s_(vt.width,vt.height,E.format,E.type);for(const gt of E.layerUpdates){const It=vt.data.subarray(gt*Q/vt.data.BYTES_PER_ELEMENT,(gt+1)*Q/vt.data.BYTES_PER_ELEMENT);i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,gt,vt.width,vt.height,1,Ut,Vt,It)}E.clearLayerUpdates()}else i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,vt.width,vt.height,vt.depth,Ut,Vt,vt.data)}else i.texImage3D(o.TEXTURE_2D_ARRAY,0,Ct,vt.width,vt.height,vt.depth,0,Ut,Vt,vt.data);else if(E.isData3DTexture)se?(Xt&&i.texStorage3D(o.TEXTURE_3D,Ot,Ct,vt.width,vt.height,vt.depth),O&&i.texSubImage3D(o.TEXTURE_3D,0,0,0,0,vt.width,vt.height,vt.depth,Ut,Vt,vt.data)):i.texImage3D(o.TEXTURE_3D,0,Ct,vt.width,vt.height,vt.depth,0,Ut,Vt,vt.data);else if(E.isFramebufferTexture){if(Xt)if(se)i.texStorage2D(o.TEXTURE_2D,Ot,Ct,vt.width,vt.height);else{let Q=vt.width,gt=vt.height;for(let It=0;It<Ot;It++)i.texImage2D(o.TEXTURE_2D,It,Ct,Q,gt,0,Ut,Vt,null),Q>>=1,gt>>=1}}else if(ae.length>0){if(se&&Xt){const Q=Dt(ae[0]);i.texStorage2D(o.TEXTURE_2D,Ot,Ct,Q.width,Q.height)}for(let Q=0,gt=ae.length;Q<gt;Q++)kt=ae[Q],se?O&&i.texSubImage2D(o.TEXTURE_2D,Q,0,0,Ut,Vt,kt):i.texImage2D(o.TEXTURE_2D,Q,Ct,Ut,Vt,kt);E.generateMipmaps=!1}else if(se){if(Xt){const Q=Dt(vt);i.texStorage2D(o.TEXTURE_2D,Ot,Ct,Q.width,Q.height)}O&&i.texSubImage2D(o.TEXTURE_2D,0,0,0,Ut,Vt,vt)}else i.texImage2D(o.TEXTURE_2D,0,Ct,Ut,Vt,vt);S(E)&&g(nt),xt.__version=ot.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function yt(R,E,H){if(E.image.length!==6)return;const nt=Nt(R,E),ht=E.source;i.bindTexture(o.TEXTURE_CUBE_MAP,R.__webglTexture,o.TEXTURE0+H);const ot=s.get(ht);if(ht.version!==ot.__version||nt===!0){i.activeTexture(o.TEXTURE0+H);const xt=Xe.getPrimaries(Xe.workingColorSpace),pt=E.colorSpace===us?null:Xe.getPrimaries(E.colorSpace),Ht=E.colorSpace===us||xt===pt?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,E.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,E.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ht);const ee=E.isCompressedTexture||E.image[0].isCompressedTexture,vt=E.image[0]&&E.image[0].isDataTexture,Ut=[];for(let gt=0;gt<6;gt++)!ee&&!vt?Ut[gt]=w(E.image[gt],!0,l.maxCubemapSize):Ut[gt]=vt?E.image[gt].image:E.image[gt],Ut[gt]=I(E,Ut[gt]);const Vt=Ut[0],Ct=u.convert(E.format,E.colorSpace),kt=u.convert(E.type),ae=N(E.internalFormat,Ct,kt,E.colorSpace),se=E.isVideoTexture!==!0,Xt=ot.__version===void 0||nt===!0,O=ht.dataReady;let Ot=W(E,Vt);rt(o.TEXTURE_CUBE_MAP,E);let Q;if(ee){se&&Xt&&i.texStorage2D(o.TEXTURE_CUBE_MAP,Ot,ae,Vt.width,Vt.height);for(let gt=0;gt<6;gt++){Q=Ut[gt].mipmaps;for(let It=0;It<Q.length;It++){const Tt=Q[It];E.format!==Yi?Ct!==null?se?O&&i.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,It,0,0,Tt.width,Tt.height,Ct,Tt.data):i.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,It,ae,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):se?O&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,It,0,0,Tt.width,Tt.height,Ct,kt,Tt.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,It,ae,Tt.width,Tt.height,0,Ct,kt,Tt.data)}}}else{if(Q=E.mipmaps,se&&Xt){Q.length>0&&Ot++;const gt=Dt(Ut[0]);i.texStorage2D(o.TEXTURE_CUBE_MAP,Ot,ae,gt.width,gt.height)}for(let gt=0;gt<6;gt++)if(vt){se?O&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,Ut[gt].width,Ut[gt].height,Ct,kt,Ut[gt].data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,ae,Ut[gt].width,Ut[gt].height,0,Ct,kt,Ut[gt].data);for(let It=0;It<Q.length;It++){const Qt=Q[It].image[gt].image;se?O&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,It+1,0,0,Qt.width,Qt.height,Ct,kt,Qt.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,It+1,ae,Qt.width,Qt.height,0,Ct,kt,Qt.data)}}else{se?O&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,Ct,kt,Ut[gt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,ae,Ct,kt,Ut[gt]);for(let It=0;It<Q.length;It++){const Tt=Q[It];se?O&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,It+1,0,0,Ct,kt,Tt.image[gt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+gt,It+1,ae,Ct,kt,Tt.image[gt])}}}S(E)&&g(o.TEXTURE_CUBE_MAP),ot.__version=ht.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function Bt(R,E,H,nt,ht,ot){const xt=u.convert(H.format,H.colorSpace),pt=u.convert(H.type),Ht=N(H.internalFormat,xt,pt,H.colorSpace),ee=s.get(E),vt=s.get(H);if(vt.__renderTarget=E,!ee.__hasExternalTextures){const Ut=Math.max(1,E.width>>ot),Vt=Math.max(1,E.height>>ot);ht===o.TEXTURE_3D||ht===o.TEXTURE_2D_ARRAY?i.texImage3D(ht,ot,Ht,Ut,Vt,E.depth,0,xt,pt,null):i.texImage2D(ht,ot,Ht,Ut,Vt,0,xt,pt,null)}i.bindFramebuffer(o.FRAMEBUFFER,R),Te(E)?h.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,nt,ht,vt.__webglTexture,0,xe(E)):(ht===o.TEXTURE_2D||ht>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&ht<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,nt,ht,vt.__webglTexture,ot),i.bindFramebuffer(o.FRAMEBUFFER,null)}function zt(R,E,H){if(o.bindRenderbuffer(o.RENDERBUFFER,R),E.depthBuffer){const nt=E.depthTexture,ht=nt&&nt.isDepthTexture?nt.type:null,ot=U(E.stencilBuffer,ht),xt=E.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,pt=xe(E);Te(E)?h.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,pt,ot,E.width,E.height):H?o.renderbufferStorageMultisample(o.RENDERBUFFER,pt,ot,E.width,E.height):o.renderbufferStorage(o.RENDERBUFFER,ot,E.width,E.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,xt,o.RENDERBUFFER,R)}else{const nt=E.textures;for(let ht=0;ht<nt.length;ht++){const ot=nt[ht],xt=u.convert(ot.format,ot.colorSpace),pt=u.convert(ot.type),Ht=N(ot.internalFormat,xt,pt,ot.colorSpace),ee=xe(E);H&&Te(E)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,ee,Ht,E.width,E.height):Te(E)?h.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,ee,Ht,E.width,E.height):o.renderbufferStorage(o.RENDERBUFFER,Ht,E.width,E.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function $t(R,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(o.FRAMEBUFFER,R),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const nt=s.get(E.depthTexture);nt.__renderTarget=E,(!nt.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),Et(E.depthTexture,0);const ht=nt.__webglTexture,ot=xe(E);if(E.depthTexture.format===Gr)Te(E)?h.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,ht,0,ot):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,ht,0);else if(E.depthTexture.format===Yr)Te(E)?h.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,ht,0,ot):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,ht,0);else throw new Error("Unknown depthTexture format")}function Jt(R){const E=s.get(R),H=R.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==R.depthTexture){const nt=R.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),nt){const ht=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,nt.removeEventListener("dispose",ht)};nt.addEventListener("dispose",ht),E.__depthDisposeCallback=ht}E.__boundDepthTexture=nt}if(R.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");$t(E.__webglFramebuffer,R)}else if(H){E.__webglDepthbuffer=[];for(let nt=0;nt<6;nt++)if(i.bindFramebuffer(o.FRAMEBUFFER,E.__webglFramebuffer[nt]),E.__webglDepthbuffer[nt]===void 0)E.__webglDepthbuffer[nt]=o.createRenderbuffer(),zt(E.__webglDepthbuffer[nt],R,!1);else{const ht=R.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ot=E.__webglDepthbuffer[nt];o.bindRenderbuffer(o.RENDERBUFFER,ot),o.framebufferRenderbuffer(o.FRAMEBUFFER,ht,o.RENDERBUFFER,ot)}}else if(i.bindFramebuffer(o.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=o.createRenderbuffer(),zt(E.__webglDepthbuffer,R,!1);else{const nt=R.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ht=E.__webglDepthbuffer;o.bindRenderbuffer(o.RENDERBUFFER,ht),o.framebufferRenderbuffer(o.FRAMEBUFFER,nt,o.RENDERBUFFER,ht)}i.bindFramebuffer(o.FRAMEBUFFER,null)}function pe(R,E,H){const nt=s.get(R);E!==void 0&&Bt(nt.__webglFramebuffer,R,R.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),H!==void 0&&Jt(R)}function je(R){const E=R.texture,H=s.get(R),nt=s.get(E);R.addEventListener("dispose",P);const ht=R.textures,ot=R.isWebGLCubeRenderTarget===!0,xt=ht.length>1;if(xt||(nt.__webglTexture===void 0&&(nt.__webglTexture=o.createTexture()),nt.__version=E.version,d.memory.textures++),ot){H.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[pt]=[];for(let Ht=0;Ht<E.mipmaps.length;Ht++)H.__webglFramebuffer[pt][Ht]=o.createFramebuffer()}else H.__webglFramebuffer[pt]=o.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let pt=0;pt<E.mipmaps.length;pt++)H.__webglFramebuffer[pt]=o.createFramebuffer()}else H.__webglFramebuffer=o.createFramebuffer();if(xt)for(let pt=0,Ht=ht.length;pt<Ht;pt++){const ee=s.get(ht[pt]);ee.__webglTexture===void 0&&(ee.__webglTexture=o.createTexture(),d.memory.textures++)}if(R.samples>0&&Te(R)===!1){H.__webglMultisampledFramebuffer=o.createFramebuffer(),H.__webglColorRenderbuffer=[],i.bindFramebuffer(o.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let pt=0;pt<ht.length;pt++){const Ht=ht[pt];H.__webglColorRenderbuffer[pt]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,H.__webglColorRenderbuffer[pt]);const ee=u.convert(Ht.format,Ht.colorSpace),vt=u.convert(Ht.type),Ut=N(Ht.internalFormat,ee,vt,Ht.colorSpace,R.isXRRenderTarget===!0),Vt=xe(R);o.renderbufferStorageMultisample(o.RENDERBUFFER,Vt,Ut,R.width,R.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+pt,o.RENDERBUFFER,H.__webglColorRenderbuffer[pt])}o.bindRenderbuffer(o.RENDERBUFFER,null),R.depthBuffer&&(H.__webglDepthRenderbuffer=o.createRenderbuffer(),zt(H.__webglDepthRenderbuffer,R,!0)),i.bindFramebuffer(o.FRAMEBUFFER,null)}}if(ot){i.bindTexture(o.TEXTURE_CUBE_MAP,nt.__webglTexture),rt(o.TEXTURE_CUBE_MAP,E);for(let pt=0;pt<6;pt++)if(E.mipmaps&&E.mipmaps.length>0)for(let Ht=0;Ht<E.mipmaps.length;Ht++)Bt(H.__webglFramebuffer[pt][Ht],R,E,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Ht);else Bt(H.__webglFramebuffer[pt],R,E,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);S(E)&&g(o.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(xt){for(let pt=0,Ht=ht.length;pt<Ht;pt++){const ee=ht[pt],vt=s.get(ee);i.bindTexture(o.TEXTURE_2D,vt.__webglTexture),rt(o.TEXTURE_2D,ee),Bt(H.__webglFramebuffer,R,ee,o.COLOR_ATTACHMENT0+pt,o.TEXTURE_2D,0),S(ee)&&g(o.TEXTURE_2D)}i.unbindTexture()}else{let pt=o.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pt=R.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),i.bindTexture(pt,nt.__webglTexture),rt(pt,E),E.mipmaps&&E.mipmaps.length>0)for(let Ht=0;Ht<E.mipmaps.length;Ht++)Bt(H.__webglFramebuffer[Ht],R,E,o.COLOR_ATTACHMENT0,pt,Ht);else Bt(H.__webglFramebuffer,R,E,o.COLOR_ATTACHMENT0,pt,0);S(E)&&g(pt),i.unbindTexture()}R.depthBuffer&&Jt(R)}function be(R){const E=R.textures;for(let H=0,nt=E.length;H<nt;H++){const ht=E[H];if(S(ht)){const ot=F(R),xt=s.get(ht).__webglTexture;i.bindTexture(ot,xt),g(ot),i.unbindTexture()}}}const ln=[],k=[];function Rn(R){if(R.samples>0){if(Te(R)===!1){const E=R.textures,H=R.width,nt=R.height;let ht=o.COLOR_BUFFER_BIT;const ot=R.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,xt=s.get(R),pt=E.length>1;if(pt)for(let Ht=0;Ht<E.length;Ht++)i.bindFramebuffer(o.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ht,o.RENDERBUFFER,null),i.bindFramebuffer(o.FRAMEBUFFER,xt.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ht,o.TEXTURE_2D,null,0);i.bindFramebuffer(o.READ_FRAMEBUFFER,xt.__webglMultisampledFramebuffer),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let Ht=0;Ht<E.length;Ht++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ht|=o.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ht|=o.STENCIL_BUFFER_BIT)),pt){o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,xt.__webglColorRenderbuffer[Ht]);const ee=s.get(E[Ht]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,ee,0)}o.blitFramebuffer(0,0,H,nt,0,0,H,nt,ht,o.NEAREST),m===!0&&(ln.length=0,k.length=0,ln.push(o.COLOR_ATTACHMENT0+Ht),R.depthBuffer&&R.resolveDepthBuffer===!1&&(ln.push(ot),k.push(ot),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,k)),o.invalidateFramebuffer(o.READ_FRAMEBUFFER,ln))}if(i.bindFramebuffer(o.READ_FRAMEBUFFER,null),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),pt)for(let Ht=0;Ht<E.length;Ht++){i.bindFramebuffer(o.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ht,o.RENDERBUFFER,xt.__webglColorRenderbuffer[Ht]);const ee=s.get(E[Ht]).__webglTexture;i.bindFramebuffer(o.FRAMEBUFFER,xt.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+Ht,o.TEXTURE_2D,ee,0)}i.bindFramebuffer(o.DRAW_FRAMEBUFFER,xt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&m){const E=R.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT;o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[E])}}}function xe(R){return Math.min(l.maxSamples,R.samples)}function Te(R){const E=s.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function j(R){const E=d.render.frame;v.get(R)!==E&&(v.set(R,E),R.update())}function I(R,E){const H=R.colorSpace,nt=R.format,ht=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||H!==jr&&H!==us&&(Xe.getTransfer(H)===rn?(nt!==Yi||ht!==Na)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}function Dt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(p.width=R.naturalWidth||R.width,p.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(p.width=R.displayWidth,p.height=R.displayHeight):(p.width=R.width,p.height=R.height),p}this.allocateTextureUnit=st,this.resetTextureUnits=ft,this.setTexture2D=Et,this.setTexture2DArray=z,this.setTexture3D=$,this.setTextureCube=tt,this.rebindTextures=pe,this.setupRenderTarget=je,this.updateRenderTargetMipmap=be,this.updateMultisampleRenderTarget=Rn,this.setupDepthRenderbuffer=Jt,this.setupFrameBufferTexture=Bt,this.useMultisampledRTT=Te}function ET(o,e){function i(s,l=us){let u;const d=Xe.getTransfer(l);if(s===Na)return o.UNSIGNED_BYTE;if(s===Lh)return o.UNSIGNED_SHORT_4_4_4_4;if(s===Nh)return o.UNSIGNED_SHORT_5_5_5_1;if(s===F_)return o.UNSIGNED_INT_5_9_9_9_REV;if(s===I_)return o.BYTE;if(s===B_)return o.SHORT;if(s===el)return o.UNSIGNED_SHORT;if(s===Uh)return o.INT;if(s===Ws)return o.UNSIGNED_INT;if(s===Da)return o.FLOAT;if(s===nl)return o.HALF_FLOAT;if(s===H_)return o.ALPHA;if(s===G_)return o.RGB;if(s===Yi)return o.RGBA;if(s===V_)return o.LUMINANCE;if(s===k_)return o.LUMINANCE_ALPHA;if(s===Gr)return o.DEPTH_COMPONENT;if(s===Yr)return o.DEPTH_STENCIL;if(s===X_)return o.RED;if(s===Oh)return o.RED_INTEGER;if(s===q_)return o.RG;if(s===zh)return o.RG_INTEGER;if(s===Ph)return o.RGBA_INTEGER;if(s===Bc||s===Fc||s===Hc||s===Gc)if(d===rn)if(u=e.get("WEBGL_compressed_texture_s3tc_srgb"),u!==null){if(s===Bc)return u.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===Fc)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===Hc)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Gc)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(u=e.get("WEBGL_compressed_texture_s3tc"),u!==null){if(s===Bc)return u.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Fc)return u.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Hc)return u.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Gc)return u.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===eh||s===nh||s===ih||s===ah)if(u=e.get("WEBGL_compressed_texture_pvrtc"),u!==null){if(s===eh)return u.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===nh)return u.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===ih)return u.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===ah)return u.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===sh||s===rh||s===oh)if(u=e.get("WEBGL_compressed_texture_etc"),u!==null){if(s===sh||s===rh)return d===rn?u.COMPRESSED_SRGB8_ETC2:u.COMPRESSED_RGB8_ETC2;if(s===oh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:u.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===lh||s===ch||s===uh||s===fh||s===dh||s===hh||s===ph||s===mh||s===gh||s===_h||s===vh||s===xh||s===yh||s===Sh)if(u=e.get("WEBGL_compressed_texture_astc"),u!==null){if(s===lh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:u.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===ch)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:u.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===uh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:u.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===fh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:u.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===dh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:u.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===hh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:u.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===ph)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:u.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===mh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:u.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===gh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:u.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===_h)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:u.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===vh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:u.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===xh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:u.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===yh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:u.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Sh)return d===rn?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:u.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Vc||s===Mh||s===Eh)if(u=e.get("EXT_texture_compression_bptc"),u!==null){if(s===Vc)return d===rn?u.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:u.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Mh)return u.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===Eh)return u.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===W_||s===bh||s===Th||s===Ah)if(u=e.get("EXT_texture_compression_rgtc"),u!==null){if(s===Vc)return u.COMPRESSED_RED_RGTC1_EXT;if(s===bh)return u.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===Th)return u.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Ah)return u.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Wr?o.UNSIGNED_INT_24_8:o[s]!==void 0?o[s]:null}return{convert:i}}const bT={type:"move"};class Gd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new kn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new kn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new et,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new et),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new kn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new et,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new et),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const s of e.hand.values())this._getHandJoint(i,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,s){let l=null,u=null,d=null;const h=this._targetRay,m=this._grip,p=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(p&&e.hand){d=!0;for(const w of e.hand.values()){const S=i.getJointPose(w,s),g=this._getHandJoint(p,w);S!==null&&(g.matrix.fromArray(S.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=S.radius),g.visible=S!==null}const v=p.joints["index-finger-tip"],x=p.joints["thumb-tip"],y=v.position.distanceTo(x.position),M=.02,T=.005;p.inputState.pinching&&y>M+T?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&y<=M-T&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(u=i.getPose(e.gripSpace,s),u!==null&&(m.matrix.fromArray(u.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,u.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(u.linearVelocity)):m.hasLinearVelocity=!1,u.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(u.angularVelocity)):m.hasAngularVelocity=!1));h!==null&&(l=i.getPose(e.targetRaySpace,s),l===null&&u!==null&&(l=u),l!==null&&(h.matrix.fromArray(l.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,l.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(l.linearVelocity)):h.hasLinearVelocity=!1,l.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(l.angularVelocity)):h.hasAngularVelocity=!1,this.dispatchEvent(bT)))}return h!==null&&(h.visible=l!==null),m!==null&&(m.visible=u!==null),p!==null&&(p.visible=d!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const s=new kn;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[i.jointName]=s,e.add(s)}return e.joints[i.jointName]}}const TT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,AT=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class wT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,i,s){if(this.texture===null){const l=new ci,u=e.properties.get(l);u.__webglTexture=i.texture,(i.depthNear!=s.depthNear||i.depthFar!=s.depthFar)&&(this.depthNear=i.depthNear,this.depthFar=i.depthFar),this.texture=l}}getMesh(e){if(this.texture!==null&&this.mesh===null){const i=e.cameras[0].viewport,s=new ps({vertexShader:TT,fragmentShader:AT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Wt(new ta(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class RT extends Kr{constructor(e,i){super();const s=this;let l=null,u=1,d=null,h="local-floor",m=1,p=null,v=null,x=null,y=null,M=null,T=null;const w=new wT,S=i.getContextAttributes();let g=null,F=null;const N=[],U=[],W=new qe;let V=null;const P=new wi;P.viewport=new on;const q=new wi;q.viewport=new on;const D=[P,q],C=new jS;let G=null,ft=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let yt=N[K];return yt===void 0&&(yt=new Gd,N[K]=yt),yt.getTargetRaySpace()},this.getControllerGrip=function(K){let yt=N[K];return yt===void 0&&(yt=new Gd,N[K]=yt),yt.getGripSpace()},this.getHand=function(K){let yt=N[K];return yt===void 0&&(yt=new Gd,N[K]=yt),yt.getHandSpace()};function st(K){const yt=U.indexOf(K.inputSource);if(yt===-1)return;const Bt=N[yt];Bt!==void 0&&(Bt.update(K.inputSource,K.frame,p||d),Bt.dispatchEvent({type:K.type,data:K.inputSource}))}function Mt(){l.removeEventListener("select",st),l.removeEventListener("selectstart",st),l.removeEventListener("selectend",st),l.removeEventListener("squeeze",st),l.removeEventListener("squeezestart",st),l.removeEventListener("squeezeend",st),l.removeEventListener("end",Mt),l.removeEventListener("inputsourceschange",Et);for(let K=0;K<N.length;K++){const yt=U[K];yt!==null&&(U[K]=null,N[K].disconnect(yt))}G=null,ft=null,w.reset(),e.setRenderTarget(g),M=null,y=null,x=null,l=null,F=null,Nt.stop(),s.isPresenting=!1,e.setPixelRatio(V),e.setSize(W.width,W.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){u=K,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){h=K,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||d},this.setReferenceSpace=function(K){p=K},this.getBaseLayer=function(){return y!==null?y:M},this.getBinding=function(){return x},this.getFrame=function(){return T},this.getSession=function(){return l},this.setSession=async function(K){if(l=K,l!==null){if(g=e.getRenderTarget(),l.addEventListener("select",st),l.addEventListener("selectstart",st),l.addEventListener("selectend",st),l.addEventListener("squeeze",st),l.addEventListener("squeezestart",st),l.addEventListener("squeezeend",st),l.addEventListener("end",Mt),l.addEventListener("inputsourceschange",Et),S.xrCompatible!==!0&&await i.makeXRCompatible(),V=e.getPixelRatio(),e.getSize(W),l.renderState.layers===void 0){const yt={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:u};M=new XRWebGLLayer(l,i,yt),l.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),F=new Ys(M.framebufferWidth,M.framebufferHeight,{format:Yi,type:Na,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let yt=null,Bt=null,zt=null;S.depth&&(zt=S.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,yt=S.stencil?Yr:Gr,Bt=S.stencil?Wr:Ws);const $t={colorFormat:i.RGBA8,depthFormat:zt,scaleFactor:u};x=new XRWebGLBinding(l,i),y=x.createProjectionLayer($t),l.updateRenderState({layers:[y]}),e.setPixelRatio(1),e.setSize(y.textureWidth,y.textureHeight,!1),F=new Ys(y.textureWidth,y.textureHeight,{format:Yi,type:Na,depthTexture:new rv(y.textureWidth,y.textureHeight,Bt,void 0,void 0,void 0,void 0,void 0,void 0,yt),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:y.ignoreDepthValues===!1})}F.isXRRenderTarget=!0,this.setFoveation(m),p=null,d=await l.requestReferenceSpace(h),Nt.setContext(l),Nt.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return w.getDepthTexture()};function Et(K){for(let yt=0;yt<K.removed.length;yt++){const Bt=K.removed[yt],zt=U.indexOf(Bt);zt>=0&&(U[zt]=null,N[zt].disconnect(Bt))}for(let yt=0;yt<K.added.length;yt++){const Bt=K.added[yt];let zt=U.indexOf(Bt);if(zt===-1){for(let Jt=0;Jt<N.length;Jt++)if(Jt>=U.length){U.push(Bt),zt=Jt;break}else if(U[Jt]===null){U[Jt]=Bt,zt=Jt;break}if(zt===-1)break}const $t=N[zt];$t&&$t.connect(Bt)}}const z=new et,$=new et;function tt(K,yt,Bt){z.setFromMatrixPosition(yt.matrixWorld),$.setFromMatrixPosition(Bt.matrixWorld);const zt=z.distanceTo($),$t=yt.projectionMatrix.elements,Jt=Bt.projectionMatrix.elements,pe=$t[14]/($t[10]-1),je=$t[14]/($t[10]+1),be=($t[9]+1)/$t[5],ln=($t[9]-1)/$t[5],k=($t[8]-1)/$t[0],Rn=(Jt[8]+1)/Jt[0],xe=pe*k,Te=pe*Rn,j=zt/(-k+Rn),I=j*-k;if(yt.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(I),K.translateZ(j),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),$t[10]===-1)K.projectionMatrix.copy(yt.projectionMatrix),K.projectionMatrixInverse.copy(yt.projectionMatrixInverse);else{const Dt=pe+j,R=je+j,E=xe-I,H=Te+(zt-I),nt=be*je/R*Dt,ht=ln*je/R*Dt;K.projectionMatrix.makePerspective(E,H,nt,ht,Dt,R),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function Pt(K,yt){yt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(yt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(l===null)return;let yt=K.near,Bt=K.far;w.texture!==null&&(w.depthNear>0&&(yt=w.depthNear),w.depthFar>0&&(Bt=w.depthFar)),C.near=q.near=P.near=yt,C.far=q.far=P.far=Bt,(G!==C.near||ft!==C.far)&&(l.updateRenderState({depthNear:C.near,depthFar:C.far}),G=C.near,ft=C.far),P.layers.mask=K.layers.mask|2,q.layers.mask=K.layers.mask|4,C.layers.mask=P.layers.mask|q.layers.mask;const zt=K.parent,$t=C.cameras;Pt(C,zt);for(let Jt=0;Jt<$t.length;Jt++)Pt($t[Jt],zt);$t.length===2?tt(C,P,q):C.projectionMatrix.copy(P.projectionMatrix),Ft(K,C,zt)};function Ft(K,yt,Bt){Bt===null?K.matrix.copy(yt.matrixWorld):(K.matrix.copy(Bt.matrixWorld),K.matrix.invert(),K.matrix.multiply(yt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(yt.projectionMatrix),K.projectionMatrixInverse.copy(yt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=wh*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(y===null&&M===null))return m},this.setFoveation=function(K){m=K,y!==null&&(y.fixedFoveation=K),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=K)},this.hasDepthSensing=function(){return w.texture!==null},this.getDepthSensingMesh=function(){return w.getMesh(C)};let L=null;function rt(K,yt){if(v=yt.getViewerPose(p||d),T=yt,v!==null){const Bt=v.views;M!==null&&(e.setRenderTargetFramebuffer(F,M.framebuffer),e.setRenderTarget(F));let zt=!1;Bt.length!==C.cameras.length&&(C.cameras.length=0,zt=!0);for(let Jt=0;Jt<Bt.length;Jt++){const pe=Bt[Jt];let je=null;if(M!==null)je=M.getViewport(pe);else{const ln=x.getViewSubImage(y,pe);je=ln.viewport,Jt===0&&(e.setRenderTargetTextures(F,ln.colorTexture,y.ignoreDepthValues?void 0:ln.depthStencilTexture),e.setRenderTarget(F))}let be=D[Jt];be===void 0&&(be=new wi,be.layers.enable(Jt),be.viewport=new on,D[Jt]=be),be.matrix.fromArray(pe.transform.matrix),be.matrix.decompose(be.position,be.quaternion,be.scale),be.projectionMatrix.fromArray(pe.projectionMatrix),be.projectionMatrixInverse.copy(be.projectionMatrix).invert(),be.viewport.set(je.x,je.y,je.width,je.height),Jt===0&&(C.matrix.copy(be.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),zt===!0&&C.cameras.push(be)}const $t=l.enabledFeatures;if($t&&$t.includes("depth-sensing")){const Jt=x.getDepthInformation(Bt[0]);Jt&&Jt.isValid&&Jt.texture&&w.init(e,Jt,l.renderState)}}for(let Bt=0;Bt<N.length;Bt++){const zt=U[Bt],$t=N[Bt];zt!==null&&$t!==void 0&&$t.update(zt,yt,p||d)}L&&L(K,yt),yt.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:yt}),T=null}const Nt=new cv;Nt.setAnimationLoop(rt),this.setAnimationLoop=function(K){L=K},this.dispose=function(){}}}const Bs=new aa,CT=new yn;function DT(o,e){function i(S,g){S.matrixAutoUpdate===!0&&S.updateMatrix(),g.value.copy(S.matrix)}function s(S,g){g.color.getRGB(S.fogColor.value,iv(o)),g.isFog?(S.fogNear.value=g.near,S.fogFar.value=g.far):g.isFogExp2&&(S.fogDensity.value=g.density)}function l(S,g,F,N,U){g.isMeshBasicMaterial||g.isMeshLambertMaterial?u(S,g):g.isMeshToonMaterial?(u(S,g),x(S,g)):g.isMeshPhongMaterial?(u(S,g),v(S,g)):g.isMeshStandardMaterial?(u(S,g),y(S,g),g.isMeshPhysicalMaterial&&M(S,g,U)):g.isMeshMatcapMaterial?(u(S,g),T(S,g)):g.isMeshDepthMaterial?u(S,g):g.isMeshDistanceMaterial?(u(S,g),w(S,g)):g.isMeshNormalMaterial?u(S,g):g.isLineBasicMaterial?(d(S,g),g.isLineDashedMaterial&&h(S,g)):g.isPointsMaterial?m(S,g,F,N):g.isSpriteMaterial?p(S,g):g.isShadowMaterial?(S.color.value.copy(g.color),S.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function u(S,g){S.opacity.value=g.opacity,g.color&&S.diffuse.value.copy(g.color),g.emissive&&S.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(S.map.value=g.map,i(g.map,S.mapTransform)),g.alphaMap&&(S.alphaMap.value=g.alphaMap,i(g.alphaMap,S.alphaMapTransform)),g.bumpMap&&(S.bumpMap.value=g.bumpMap,i(g.bumpMap,S.bumpMapTransform),S.bumpScale.value=g.bumpScale,g.side===_i&&(S.bumpScale.value*=-1)),g.normalMap&&(S.normalMap.value=g.normalMap,i(g.normalMap,S.normalMapTransform),S.normalScale.value.copy(g.normalScale),g.side===_i&&S.normalScale.value.negate()),g.displacementMap&&(S.displacementMap.value=g.displacementMap,i(g.displacementMap,S.displacementMapTransform),S.displacementScale.value=g.displacementScale,S.displacementBias.value=g.displacementBias),g.emissiveMap&&(S.emissiveMap.value=g.emissiveMap,i(g.emissiveMap,S.emissiveMapTransform)),g.specularMap&&(S.specularMap.value=g.specularMap,i(g.specularMap,S.specularMapTransform)),g.alphaTest>0&&(S.alphaTest.value=g.alphaTest);const F=e.get(g),N=F.envMap,U=F.envMapRotation;N&&(S.envMap.value=N,Bs.copy(U),Bs.x*=-1,Bs.y*=-1,Bs.z*=-1,N.isCubeTexture&&N.isRenderTargetTexture===!1&&(Bs.y*=-1,Bs.z*=-1),S.envMapRotation.value.setFromMatrix4(CT.makeRotationFromEuler(Bs)),S.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=g.reflectivity,S.ior.value=g.ior,S.refractionRatio.value=g.refractionRatio),g.lightMap&&(S.lightMap.value=g.lightMap,S.lightMapIntensity.value=g.lightMapIntensity,i(g.lightMap,S.lightMapTransform)),g.aoMap&&(S.aoMap.value=g.aoMap,S.aoMapIntensity.value=g.aoMapIntensity,i(g.aoMap,S.aoMapTransform))}function d(S,g){S.diffuse.value.copy(g.color),S.opacity.value=g.opacity,g.map&&(S.map.value=g.map,i(g.map,S.mapTransform))}function h(S,g){S.dashSize.value=g.dashSize,S.totalSize.value=g.dashSize+g.gapSize,S.scale.value=g.scale}function m(S,g,F,N){S.diffuse.value.copy(g.color),S.opacity.value=g.opacity,S.size.value=g.size*F,S.scale.value=N*.5,g.map&&(S.map.value=g.map,i(g.map,S.uvTransform)),g.alphaMap&&(S.alphaMap.value=g.alphaMap,i(g.alphaMap,S.alphaMapTransform)),g.alphaTest>0&&(S.alphaTest.value=g.alphaTest)}function p(S,g){S.diffuse.value.copy(g.color),S.opacity.value=g.opacity,S.rotation.value=g.rotation,g.map&&(S.map.value=g.map,i(g.map,S.mapTransform)),g.alphaMap&&(S.alphaMap.value=g.alphaMap,i(g.alphaMap,S.alphaMapTransform)),g.alphaTest>0&&(S.alphaTest.value=g.alphaTest)}function v(S,g){S.specular.value.copy(g.specular),S.shininess.value=Math.max(g.shininess,1e-4)}function x(S,g){g.gradientMap&&(S.gradientMap.value=g.gradientMap)}function y(S,g){S.metalness.value=g.metalness,g.metalnessMap&&(S.metalnessMap.value=g.metalnessMap,i(g.metalnessMap,S.metalnessMapTransform)),S.roughness.value=g.roughness,g.roughnessMap&&(S.roughnessMap.value=g.roughnessMap,i(g.roughnessMap,S.roughnessMapTransform)),g.envMap&&(S.envMapIntensity.value=g.envMapIntensity)}function M(S,g,F){S.ior.value=g.ior,g.sheen>0&&(S.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),S.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(S.sheenColorMap.value=g.sheenColorMap,i(g.sheenColorMap,S.sheenColorMapTransform)),g.sheenRoughnessMap&&(S.sheenRoughnessMap.value=g.sheenRoughnessMap,i(g.sheenRoughnessMap,S.sheenRoughnessMapTransform))),g.clearcoat>0&&(S.clearcoat.value=g.clearcoat,S.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(S.clearcoatMap.value=g.clearcoatMap,i(g.clearcoatMap,S.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,i(g.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(S.clearcoatNormalMap.value=g.clearcoatNormalMap,i(g.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===_i&&S.clearcoatNormalScale.value.negate())),g.dispersion>0&&(S.dispersion.value=g.dispersion),g.iridescence>0&&(S.iridescence.value=g.iridescence,S.iridescenceIOR.value=g.iridescenceIOR,S.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(S.iridescenceMap.value=g.iridescenceMap,i(g.iridescenceMap,S.iridescenceMapTransform)),g.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=g.iridescenceThicknessMap,i(g.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),g.transmission>0&&(S.transmission.value=g.transmission,S.transmissionSamplerMap.value=F.texture,S.transmissionSamplerSize.value.set(F.width,F.height),g.transmissionMap&&(S.transmissionMap.value=g.transmissionMap,i(g.transmissionMap,S.transmissionMapTransform)),S.thickness.value=g.thickness,g.thicknessMap&&(S.thicknessMap.value=g.thicknessMap,i(g.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=g.attenuationDistance,S.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(S.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(S.anisotropyMap.value=g.anisotropyMap,i(g.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=g.specularIntensity,S.specularColor.value.copy(g.specularColor),g.specularColorMap&&(S.specularColorMap.value=g.specularColorMap,i(g.specularColorMap,S.specularColorMapTransform)),g.specularIntensityMap&&(S.specularIntensityMap.value=g.specularIntensityMap,i(g.specularIntensityMap,S.specularIntensityMapTransform))}function T(S,g){g.matcap&&(S.matcap.value=g.matcap)}function w(S,g){const F=e.get(g).light;S.referencePosition.value.setFromMatrixPosition(F.matrixWorld),S.nearDistance.value=F.shadow.camera.near,S.farDistance.value=F.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:l}}function UT(o,e,i,s){let l={},u={},d=[];const h=o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS);function m(F,N){const U=N.program;s.uniformBlockBinding(F,U)}function p(F,N){let U=l[F.id];U===void 0&&(T(F),U=v(F),l[F.id]=U,F.addEventListener("dispose",S));const W=N.program;s.updateUBOMapping(F,W);const V=e.render.frame;u[F.id]!==V&&(y(F),u[F.id]=V)}function v(F){const N=x();F.__bindingPointIndex=N;const U=o.createBuffer(),W=F.__size,V=F.usage;return o.bindBuffer(o.UNIFORM_BUFFER,U),o.bufferData(o.UNIFORM_BUFFER,W,V),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,N,U),U}function x(){for(let F=0;F<h;F++)if(d.indexOf(F)===-1)return d.push(F),F;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function y(F){const N=l[F.id],U=F.uniforms,W=F.__cache;o.bindBuffer(o.UNIFORM_BUFFER,N);for(let V=0,P=U.length;V<P;V++){const q=Array.isArray(U[V])?U[V]:[U[V]];for(let D=0,C=q.length;D<C;D++){const G=q[D];if(M(G,V,D,W)===!0){const ft=G.__offset,st=Array.isArray(G.value)?G.value:[G.value];let Mt=0;for(let Et=0;Et<st.length;Et++){const z=st[Et],$=w(z);typeof z=="number"||typeof z=="boolean"?(G.__data[0]=z,o.bufferSubData(o.UNIFORM_BUFFER,ft+Mt,G.__data)):z.isMatrix3?(G.__data[0]=z.elements[0],G.__data[1]=z.elements[1],G.__data[2]=z.elements[2],G.__data[3]=0,G.__data[4]=z.elements[3],G.__data[5]=z.elements[4],G.__data[6]=z.elements[5],G.__data[7]=0,G.__data[8]=z.elements[6],G.__data[9]=z.elements[7],G.__data[10]=z.elements[8],G.__data[11]=0):(z.toArray(G.__data,Mt),Mt+=$.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,ft,G.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function M(F,N,U,W){const V=F.value,P=N+"_"+U;if(W[P]===void 0)return typeof V=="number"||typeof V=="boolean"?W[P]=V:W[P]=V.clone(),!0;{const q=W[P];if(typeof V=="number"||typeof V=="boolean"){if(q!==V)return W[P]=V,!0}else if(q.equals(V)===!1)return q.copy(V),!0}return!1}function T(F){const N=F.uniforms;let U=0;const W=16;for(let P=0,q=N.length;P<q;P++){const D=Array.isArray(N[P])?N[P]:[N[P]];for(let C=0,G=D.length;C<G;C++){const ft=D[C],st=Array.isArray(ft.value)?ft.value:[ft.value];for(let Mt=0,Et=st.length;Mt<Et;Mt++){const z=st[Mt],$=w(z),tt=U%W,Pt=tt%$.boundary,Ft=tt+Pt;U+=Pt,Ft!==0&&W-Ft<$.storage&&(U+=W-Ft),ft.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),ft.__offset=U,U+=$.storage}}}const V=U%W;return V>0&&(U+=W-V),F.__size=U,F.__cache={},this}function w(F){const N={boundary:0,storage:0};return typeof F=="number"||typeof F=="boolean"?(N.boundary=4,N.storage=4):F.isVector2?(N.boundary=8,N.storage=8):F.isVector3||F.isColor?(N.boundary=16,N.storage=12):F.isVector4?(N.boundary=16,N.storage=16):F.isMatrix3?(N.boundary=48,N.storage=48):F.isMatrix4?(N.boundary=64,N.storage=64):F.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",F),N}function S(F){const N=F.target;N.removeEventListener("dispose",S);const U=d.indexOf(N.__bindingPointIndex);d.splice(U,1),o.deleteBuffer(l[N.id]),delete l[N.id],delete u[N.id]}function g(){for(const F in l)o.deleteBuffer(l[F]);d=[],l={},u={}}return{bind:m,update:p,dispose:g}}class LT{constructor(e={}){const{canvas:i=dS(),context:s=null,depth:l=!0,stencil:u=!1,alpha:d=!1,antialias:h=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:v="default",failIfMajorPerformanceCaveat:x=!1,reverseDepthBuffer:y=!1}=e;this.isWebGLRenderer=!0;let M;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=s.getContextAttributes().alpha}else M=d;const T=new Uint32Array(4),w=new Int32Array(4);let S=null,g=null;const F=[],N=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ii,this.toneMapping=ds,this.toneMappingExposure=1;const U=this;let W=!1,V=0,P=0,q=null,D=-1,C=null;const G=new on,ft=new on;let st=null;const Mt=new Ue(0);let Et=0,z=i.width,$=i.height,tt=1,Pt=null,Ft=null;const L=new on(0,0,z,$),rt=new on(0,0,z,$);let Nt=!1;const K=new Fh;let yt=!1,Bt=!1;const zt=new yn,$t=new yn,Jt=new et,pe=new on,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let be=!1;function ln(){return q===null?tt:1}let k=s;function Rn(A,Y){return i.getContext(A,Y)}try{const A={alpha:!0,depth:l,stencil:u,antialias:h,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:v,failIfMajorPerformanceCaveat:x};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Dh}`),i.addEventListener("webglcontextlost",gt,!1),i.addEventListener("webglcontextrestored",It,!1),i.addEventListener("webglcontextcreationerror",Tt,!1),k===null){const Y="webgl2";if(k=Rn(Y,A),k===null)throw Rn(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let xe,Te,j,I,Dt,R,E,H,nt,ht,ot,xt,pt,Ht,ee,vt,Ut,Vt,Ct,kt,ae,se,Xt,O;function Ot(){xe=new G1(k),xe.init(),se=new ET(k,xe),Te=new z1(k,xe,e,se),j=new ST(k,xe),Te.reverseDepthBuffer&&y&&j.buffers.depth.setReversed(!0),I=new X1(k),Dt=new lT,R=new MT(k,xe,j,Dt,Te,se,I),E=new I1(U),H=new H1(U),nt=new QS(k),Xt=new N1(k,nt),ht=new V1(k,nt,I,Xt),ot=new W1(k,ht,nt,I),Ct=new q1(k,Te,R),vt=new P1(Dt),xt=new oT(U,E,H,xe,Te,Xt,vt),pt=new DT(U,Dt),Ht=new uT,ee=new gT(xe),Vt=new L1(U,E,H,j,ot,M,m),Ut=new xT(U,ot,Te),O=new UT(k,I,Te,j),kt=new O1(k,xe,I),ae=new k1(k,xe,I),I.programs=xt.programs,U.capabilities=Te,U.extensions=xe,U.properties=Dt,U.renderLists=Ht,U.shadowMap=Ut,U.state=j,U.info=I}Ot();const Q=new RT(U,k);this.xr=Q,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const A=xe.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=xe.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return tt},this.setPixelRatio=function(A){A!==void 0&&(tt=A,this.setSize(z,$,!1))},this.getSize=function(A){return A.set(z,$)},this.setSize=function(A,Y,lt=!0){if(Q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=A,$=Y,i.width=Math.floor(A*tt),i.height=Math.floor(Y*tt),lt===!0&&(i.style.width=A+"px",i.style.height=Y+"px"),this.setViewport(0,0,A,Y)},this.getDrawingBufferSize=function(A){return A.set(z*tt,$*tt).floor()},this.setDrawingBufferSize=function(A,Y,lt){z=A,$=Y,tt=lt,i.width=Math.floor(A*lt),i.height=Math.floor(Y*lt),this.setViewport(0,0,A,Y)},this.getCurrentViewport=function(A){return A.copy(G)},this.getViewport=function(A){return A.copy(L)},this.setViewport=function(A,Y,lt,ut){A.isVector4?L.set(A.x,A.y,A.z,A.w):L.set(A,Y,lt,ut),j.viewport(G.copy(L).multiplyScalar(tt).round())},this.getScissor=function(A){return A.copy(rt)},this.setScissor=function(A,Y,lt,ut){A.isVector4?rt.set(A.x,A.y,A.z,A.w):rt.set(A,Y,lt,ut),j.scissor(ft.copy(rt).multiplyScalar(tt).round())},this.getScissorTest=function(){return Nt},this.setScissorTest=function(A){j.setScissorTest(Nt=A)},this.setOpaqueSort=function(A){Pt=A},this.setTransparentSort=function(A){Ft=A},this.getClearColor=function(A){return A.copy(Vt.getClearColor())},this.setClearColor=function(){Vt.setClearColor.apply(Vt,arguments)},this.getClearAlpha=function(){return Vt.getClearAlpha()},this.setClearAlpha=function(){Vt.setClearAlpha.apply(Vt,arguments)},this.clear=function(A=!0,Y=!0,lt=!0){let ut=0;if(A){let Z=!1;if(q!==null){const Rt=q.texture.format;Z=Rt===Ph||Rt===zh||Rt===Oh}if(Z){const Rt=q.texture.type,qt=Rt===Na||Rt===Ws||Rt===el||Rt===Wr||Rt===Lh||Rt===Nh,Zt=Vt.getClearColor(),Kt=Vt.getClearAlpha(),re=Zt.r,de=Zt.g,oe=Zt.b;qt?(T[0]=re,T[1]=de,T[2]=oe,T[3]=Kt,k.clearBufferuiv(k.COLOR,0,T)):(w[0]=re,w[1]=de,w[2]=oe,w[3]=Kt,k.clearBufferiv(k.COLOR,0,w))}else ut|=k.COLOR_BUFFER_BIT}Y&&(ut|=k.DEPTH_BUFFER_BIT),lt&&(ut|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(ut)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",gt,!1),i.removeEventListener("webglcontextrestored",It,!1),i.removeEventListener("webglcontextcreationerror",Tt,!1),Vt.dispose(),Ht.dispose(),ee.dispose(),Dt.dispose(),E.dispose(),H.dispose(),ot.dispose(),Xt.dispose(),O.dispose(),xt.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",si),Q.removeEventListener("sessionend",Kn),Fn.stop()};function gt(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),W=!0}function It(){console.log("THREE.WebGLRenderer: Context Restored."),W=!1;const A=I.autoReset,Y=Ut.enabled,lt=Ut.autoUpdate,ut=Ut.needsUpdate,Z=Ut.type;Ot(),I.autoReset=A,Ut.enabled=Y,Ut.autoUpdate=lt,Ut.needsUpdate=ut,Ut.type=Z}function Tt(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Qt(A){const Y=A.target;Y.removeEventListener("dispose",Qt),Ge(Y)}function Ge(A){ze(A),Dt.remove(A)}function ze(A){const Y=Dt.get(A).programs;Y!==void 0&&(Y.forEach(function(lt){xt.releaseProgram(lt)}),A.isShaderMaterial&&xt.releaseShaderCache(A))}this.renderBufferDirect=function(A,Y,lt,ut,Z,Rt){Y===null&&(Y=je);const qt=Z.isMesh&&Z.matrixWorld.determinant()<0,Zt=Oa(A,Y,lt,ut,Z);j.setMaterial(ut,qt);let Kt=lt.index,re=1;if(ut.wireframe===!0){if(Kt=ht.getWireframeAttribute(lt),Kt===void 0)return;re=2}const de=lt.drawRange,oe=lt.attributes.position;let Me=de.start*re,Pe=(de.start+de.count)*re;Rt!==null&&(Me=Math.max(Me,Rt.start*re),Pe=Math.min(Pe,(Rt.start+Rt.count)*re)),Kt!==null?(Me=Math.max(Me,0),Pe=Math.min(Pe,Kt.count)):oe!=null&&(Me=Math.max(Me,0),Pe=Math.min(Pe,oe.count));const en=Pe-Me;if(en<0||en===1/0)return;Xt.setup(Z,ut,Zt,lt,Kt);let Ke,dt=kt;if(Kt!==null&&(Ke=nt.get(Kt),dt=ae,dt.setIndex(Ke)),Z.isMesh)ut.wireframe===!0?(j.setLineWidth(ut.wireframeLinewidth*ln()),dt.setMode(k.LINES)):dt.setMode(k.TRIANGLES);else if(Z.isLine){let _t=ut.linewidth;_t===void 0&&(_t=1),j.setLineWidth(_t*ln()),Z.isLineSegments?dt.setMode(k.LINES):Z.isLineLoop?dt.setMode(k.LINE_LOOP):dt.setMode(k.LINE_STRIP)}else Z.isPoints?dt.setMode(k.POINTS):Z.isSprite&&dt.setMode(k.TRIANGLES);if(Z.isBatchedMesh)if(Z._multiDrawInstances!==null)dt.renderMultiDrawInstances(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount,Z._multiDrawInstances);else if(xe.get("WEBGL_multi_draw"))dt.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{const _t=Z._multiDrawStarts,Gt=Z._multiDrawCounts,Lt=Z._multiDrawCount,Yt=Kt?nt.get(Kt).bytesPerElement:1,we=Dt.get(ut).currentProgram.getUniforms();for(let me=0;me<Lt;me++)we.setValue(k,"_gl_DrawID",me),dt.render(_t[me]/Yt,Gt[me])}else if(Z.isInstancedMesh)dt.renderInstances(Me,en,Z.count);else if(lt.isInstancedBufferGeometry){const _t=lt._maxInstanceCount!==void 0?lt._maxInstanceCount:1/0,Gt=Math.min(lt.instanceCount,_t);dt.renderInstances(Me,en,Gt)}else dt.render(Me,en)};function le(A,Y,lt){A.transparent===!0&&A.side===Ri&&A.forceSinglePass===!1?(A.side=_i,A.needsUpdate=!0,Ze(A,Y,lt),A.side=hs,A.needsUpdate=!0,Ze(A,Y,lt),A.side=Ri):Ze(A,Y,lt)}this.compile=function(A,Y,lt=null){lt===null&&(lt=A),g=ee.get(lt),g.init(Y),N.push(g),lt.traverseVisible(function(Z){Z.isLight&&Z.layers.test(Y.layers)&&(g.pushLight(Z),Z.castShadow&&g.pushShadow(Z))}),A!==lt&&A.traverseVisible(function(Z){Z.isLight&&Z.layers.test(Y.layers)&&(g.pushLight(Z),Z.castShadow&&g.pushShadow(Z))}),g.setupLights();const ut=new Set;return A.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;const Rt=Z.material;if(Rt)if(Array.isArray(Rt))for(let qt=0;qt<Rt.length;qt++){const Zt=Rt[qt];le(Zt,lt,Z),ut.add(Zt)}else le(Rt,lt,Z),ut.add(Rt)}),N.pop(),g=null,ut},this.compileAsync=function(A,Y,lt=null){const ut=this.compile(A,Y,lt);return new Promise(Z=>{function Rt(){if(ut.forEach(function(qt){Dt.get(qt).currentProgram.isReady()&&ut.delete(qt)}),ut.size===0){Z(A);return}setTimeout(Rt,10)}xe.get("KHR_parallel_shader_compile")!==null?Rt():setTimeout(Rt,10)})};let tn=null;function Cn(A){tn&&tn(A)}function si(){Fn.stop()}function Kn(){Fn.start()}const Fn=new cv;Fn.setAnimationLoop(Cn),typeof self<"u"&&Fn.setContext(self),this.setAnimationLoop=function(A){tn=A,Q.setAnimationLoop(A),A===null?Fn.stop():Fn.start()},Q.addEventListener("sessionstart",si),Q.addEventListener("sessionend",Kn),this.render=function(A,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(W===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(Y),Y=Q.getCamera()),A.isScene===!0&&A.onBeforeRender(U,A,Y,q),g=ee.get(A,N.length),g.init(Y),N.push(g),$t.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),K.setFromProjectionMatrix($t),Bt=this.localClippingEnabled,yt=vt.init(this.clippingPlanes,Bt),S=Ht.get(A,F.length),S.init(),F.push(S),Q.enabled===!0&&Q.isPresenting===!0){const Rt=U.xr.getDepthSensingMesh();Rt!==null&&Qn(Rt,Y,-1/0,U.sortObjects)}Qn(A,Y,0,U.sortObjects),S.finish(),U.sortObjects===!0&&S.sort(Pt,Ft),be=Q.enabled===!1||Q.isPresenting===!1||Q.hasDepthSensing()===!1,be&&Vt.addToRenderList(S,A),this.info.render.frame++,yt===!0&&vt.beginShadows();const lt=g.state.shadowsArray;Ut.render(lt,A,Y),yt===!0&&vt.endShadows(),this.info.autoReset===!0&&this.info.reset();const ut=S.opaque,Z=S.transmissive;if(g.setupLights(),Y.isArrayCamera){const Rt=Y.cameras;if(Z.length>0)for(let qt=0,Zt=Rt.length;qt<Zt;qt++){const Kt=Rt[qt];sa(ut,Z,A,Kt)}be&&Vt.render(A);for(let qt=0,Zt=Rt.length;qt<Zt;qt++){const Kt=Rt[qt];Mn(S,A,Kt,Kt.viewport)}}else Z.length>0&&sa(ut,Z,A,Y),be&&Vt.render(A),Mn(S,A,Y);q!==null&&(R.updateMultisampleRenderTarget(q),R.updateRenderTargetMipmap(q)),A.isScene===!0&&A.onAfterRender(U,A,Y),Xt.resetDefaultState(),D=-1,C=null,N.pop(),N.length>0?(g=N[N.length-1],yt===!0&&vt.setGlobalState(U.clippingPlanes,g.state.camera)):g=null,F.pop(),F.length>0?S=F[F.length-1]:S=null};function Qn(A,Y,lt,ut){if(A.visible===!1)return;if(A.layers.test(Y.layers)){if(A.isGroup)lt=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(Y);else if(A.isLight)g.pushLight(A),A.castShadow&&g.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||K.intersectsSprite(A)){ut&&pe.setFromMatrixPosition(A.matrixWorld).applyMatrix4($t);const qt=ot.update(A),Zt=A.material;Zt.visible&&S.push(A,qt,Zt,lt,pe.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||K.intersectsObject(A))){const qt=ot.update(A),Zt=A.material;if(ut&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),pe.copy(A.boundingSphere.center)):(qt.boundingSphere===null&&qt.computeBoundingSphere(),pe.copy(qt.boundingSphere.center)),pe.applyMatrix4(A.matrixWorld).applyMatrix4($t)),Array.isArray(Zt)){const Kt=qt.groups;for(let re=0,de=Kt.length;re<de;re++){const oe=Kt[re],Me=Zt[oe.materialIndex];Me&&Me.visible&&S.push(A,qt,Me,lt,pe.z,oe)}}else Zt.visible&&S.push(A,qt,Zt,lt,pe.z,null)}}const Rt=A.children;for(let qt=0,Zt=Rt.length;qt<Zt;qt++)Qn(Rt[qt],Y,lt,ut)}function Mn(A,Y,lt,ut){const Z=A.opaque,Rt=A.transmissive,qt=A.transparent;g.setupLightsView(lt),yt===!0&&vt.setGlobalState(U.clippingPlanes,lt),ut&&j.viewport(G.copy(ut)),Z.length>0&&Zi(Z,Y,lt),Rt.length>0&&Zi(Rt,Y,lt),qt.length>0&&Zi(qt,Y,lt),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function sa(A,Y,lt,ut){if((lt.isScene===!0?lt.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[ut.id]===void 0&&(g.state.transmissionRenderTarget[ut.id]=new Ys(1,1,{generateMipmaps:!0,type:xe.has("EXT_color_buffer_half_float")||xe.has("EXT_color_buffer_float")?nl:Na,minFilter:qs,samples:4,stencilBuffer:u,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Xe.workingColorSpace}));const Rt=g.state.transmissionRenderTarget[ut.id],qt=ut.viewport||G;Rt.setSize(qt.z,qt.w);const Zt=U.getRenderTarget();U.setRenderTarget(Rt),U.getClearColor(Mt),Et=U.getClearAlpha(),Et<1&&U.setClearColor(16777215,.5),U.clear(),be&&Vt.render(lt);const Kt=U.toneMapping;U.toneMapping=ds;const re=ut.viewport;if(ut.viewport!==void 0&&(ut.viewport=void 0),g.setupLightsView(ut),yt===!0&&vt.setGlobalState(U.clippingPlanes,ut),Zi(A,lt,ut),R.updateMultisampleRenderTarget(Rt),R.updateRenderTargetMipmap(Rt),xe.has("WEBGL_multisampled_render_to_texture")===!1){let de=!1;for(let oe=0,Me=Y.length;oe<Me;oe++){const Pe=Y[oe],en=Pe.object,Ke=Pe.geometry,dt=Pe.material,_t=Pe.group;if(dt.side===Ri&&en.layers.test(ut.layers)){const Gt=dt.side;dt.side=_i,dt.needsUpdate=!0,Hn(en,lt,ut,Ke,dt,_t),dt.side=Gt,dt.needsUpdate=!0,de=!0}}de===!0&&(R.updateMultisampleRenderTarget(Rt),R.updateRenderTargetMipmap(Rt))}U.setRenderTarget(Zt),U.setClearColor(Mt,Et),re!==void 0&&(ut.viewport=re),U.toneMapping=Kt}function Zi(A,Y,lt){const ut=Y.isScene===!0?Y.overrideMaterial:null;for(let Z=0,Rt=A.length;Z<Rt;Z++){const qt=A[Z],Zt=qt.object,Kt=qt.geometry,re=ut===null?qt.material:ut,de=qt.group;Zt.layers.test(lt.layers)&&Hn(Zt,Y,lt,Kt,re,de)}}function Hn(A,Y,lt,ut,Z,Rt){A.onBeforeRender(U,Y,lt,ut,Z,Rt),A.modelViewMatrix.multiplyMatrices(lt.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),Z.onBeforeRender(U,Y,lt,ut,A,Rt),Z.transparent===!0&&Z.side===Ri&&Z.forceSinglePass===!1?(Z.side=_i,Z.needsUpdate=!0,U.renderBufferDirect(lt,Y,ut,Z,A,Rt),Z.side=hs,Z.needsUpdate=!0,U.renderBufferDirect(lt,Y,ut,Z,A,Rt),Z.side=Ri):U.renderBufferDirect(lt,Y,ut,Z,A,Rt),A.onAfterRender(U,Y,lt,ut,Z,Rt)}function Ze(A,Y,lt){Y.isScene!==!0&&(Y=je);const ut=Dt.get(A),Z=g.state.lights,Rt=g.state.shadowsArray,qt=Z.state.version,Zt=xt.getParameters(A,Z.state,Rt,Y,lt),Kt=xt.getProgramCacheKey(Zt);let re=ut.programs;ut.environment=A.isMeshStandardMaterial?Y.environment:null,ut.fog=Y.fog,ut.envMap=(A.isMeshStandardMaterial?H:E).get(A.envMap||ut.environment),ut.envMapRotation=ut.environment!==null&&A.envMap===null?Y.environmentRotation:A.envMapRotation,re===void 0&&(A.addEventListener("dispose",Qt),re=new Map,ut.programs=re);let de=re.get(Kt);if(de!==void 0){if(ut.currentProgram===de&&ut.lightsStateVersion===qt)return ri(A,Zt),de}else Zt.uniforms=xt.getUniforms(A),A.onBeforeCompile(Zt,U),de=xt.acquireProgram(Zt,Kt),re.set(Kt,de),ut.uniforms=Zt.uniforms;const oe=ut.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(oe.clippingPlanes=vt.uniform),ri(A,Zt),ut.needsLights=$r(A),ut.lightsStateVersion=qt,ut.needsLights&&(oe.ambientLightColor.value=Z.state.ambient,oe.lightProbe.value=Z.state.probe,oe.directionalLights.value=Z.state.directional,oe.directionalLightShadows.value=Z.state.directionalShadow,oe.spotLights.value=Z.state.spot,oe.spotLightShadows.value=Z.state.spotShadow,oe.rectAreaLights.value=Z.state.rectArea,oe.ltc_1.value=Z.state.rectAreaLTC1,oe.ltc_2.value=Z.state.rectAreaLTC2,oe.pointLights.value=Z.state.point,oe.pointLightShadows.value=Z.state.pointShadow,oe.hemisphereLights.value=Z.state.hemi,oe.directionalShadowMap.value=Z.state.directionalShadowMap,oe.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,oe.spotShadowMap.value=Z.state.spotShadowMap,oe.spotLightMatrix.value=Z.state.spotLightMatrix,oe.spotLightMap.value=Z.state.spotLightMap,oe.pointShadowMap.value=Z.state.pointShadowMap,oe.pointShadowMatrix.value=Z.state.pointShadowMatrix),ut.currentProgram=de,ut.uniformsList=null,de}function pn(A){if(A.uniformsList===null){const Y=A.currentProgram.getUniforms();A.uniformsList=Xc.seqWithValue(Y.seq,A.uniforms)}return A.uniformsList}function ri(A,Y){const lt=Dt.get(A);lt.outputColorSpace=Y.outputColorSpace,lt.batching=Y.batching,lt.batchingColor=Y.batchingColor,lt.instancing=Y.instancing,lt.instancingColor=Y.instancingColor,lt.instancingMorph=Y.instancingMorph,lt.skinning=Y.skinning,lt.morphTargets=Y.morphTargets,lt.morphNormals=Y.morphNormals,lt.morphColors=Y.morphColors,lt.morphTargetsCount=Y.morphTargetsCount,lt.numClippingPlanes=Y.numClippingPlanes,lt.numIntersection=Y.numClipIntersection,lt.vertexAlphas=Y.vertexAlphas,lt.vertexTangents=Y.vertexTangents,lt.toneMapping=Y.toneMapping}function Oa(A,Y,lt,ut,Z){Y.isScene!==!0&&(Y=je),R.resetTextureUnits();const Rt=Y.fog,qt=ut.isMeshStandardMaterial?Y.environment:null,Zt=q===null?U.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:jr,Kt=(ut.isMeshStandardMaterial?H:E).get(ut.envMap||qt),re=ut.vertexColors===!0&&!!lt.attributes.color&&lt.attributes.color.itemSize===4,de=!!lt.attributes.tangent&&(!!ut.normalMap||ut.anisotropy>0),oe=!!lt.morphAttributes.position,Me=!!lt.morphAttributes.normal,Pe=!!lt.morphAttributes.color;let en=ds;ut.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(en=U.toneMapping);const Ke=lt.morphAttributes.position||lt.morphAttributes.normal||lt.morphAttributes.color,dt=Ke!==void 0?Ke.length:0,_t=Dt.get(ut),Gt=g.state.lights;if(yt===!0&&(Bt===!0||A!==C)){const mn=A===C&&ut.id===D;vt.setState(ut,A,mn)}let Lt=!1;ut.version===_t.__version?(_t.needsLights&&_t.lightsStateVersion!==Gt.state.version||_t.outputColorSpace!==Zt||Z.isBatchedMesh&&_t.batching===!1||!Z.isBatchedMesh&&_t.batching===!0||Z.isBatchedMesh&&_t.batchingColor===!0&&Z.colorTexture===null||Z.isBatchedMesh&&_t.batchingColor===!1&&Z.colorTexture!==null||Z.isInstancedMesh&&_t.instancing===!1||!Z.isInstancedMesh&&_t.instancing===!0||Z.isSkinnedMesh&&_t.skinning===!1||!Z.isSkinnedMesh&&_t.skinning===!0||Z.isInstancedMesh&&_t.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&_t.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&_t.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&_t.instancingMorph===!1&&Z.morphTexture!==null||_t.envMap!==Kt||ut.fog===!0&&_t.fog!==Rt||_t.numClippingPlanes!==void 0&&(_t.numClippingPlanes!==vt.numPlanes||_t.numIntersection!==vt.numIntersection)||_t.vertexAlphas!==re||_t.vertexTangents!==de||_t.morphTargets!==oe||_t.morphNormals!==Me||_t.morphColors!==Pe||_t.toneMapping!==en||_t.morphTargetsCount!==dt)&&(Lt=!0):(Lt=!0,_t.__version=ut.version);let Yt=_t.currentProgram;Lt===!0&&(Yt=Ze(ut,Y,Z));let we=!1,me=!1,hn=!1;const ne=Yt.getUniforms(),Qe=_t.uniforms;if(j.useProgram(Yt.program)&&(we=!0,me=!0,hn=!0),ut.id!==D&&(D=ut.id,me=!0),we||C!==A){j.buffers.depth.getReversed()?(zt.copy(A.projectionMatrix),pS(zt),mS(zt),ne.setValue(k,"projectionMatrix",zt)):ne.setValue(k,"projectionMatrix",A.projectionMatrix),ne.setValue(k,"viewMatrix",A.matrixWorldInverse);const cn=ne.map.cameraPosition;cn!==void 0&&cn.setValue(k,Jt.setFromMatrixPosition(A.matrixWorld)),Te.logarithmicDepthBuffer&&ne.setValue(k,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(ut.isMeshPhongMaterial||ut.isMeshToonMaterial||ut.isMeshLambertMaterial||ut.isMeshBasicMaterial||ut.isMeshStandardMaterial||ut.isShaderMaterial)&&ne.setValue(k,"isOrthographic",A.isOrthographicCamera===!0),C!==A&&(C=A,me=!0,hn=!0)}if(Z.isSkinnedMesh){ne.setOptional(k,Z,"bindMatrix"),ne.setOptional(k,Z,"bindMatrixInverse");const mn=Z.skeleton;mn&&(mn.boneTexture===null&&mn.computeBoneTexture(),ne.setValue(k,"boneTexture",mn.boneTexture,R))}Z.isBatchedMesh&&(ne.setOptional(k,Z,"batchingTexture"),ne.setValue(k,"batchingTexture",Z._matricesTexture,R),ne.setOptional(k,Z,"batchingIdTexture"),ne.setValue(k,"batchingIdTexture",Z._indirectTexture,R),ne.setOptional(k,Z,"batchingColorTexture"),Z._colorsTexture!==null&&ne.setValue(k,"batchingColorTexture",Z._colorsTexture,R));const vn=lt.morphAttributes;if((vn.position!==void 0||vn.normal!==void 0||vn.color!==void 0)&&Ct.update(Z,lt,Yt),(me||_t.receiveShadow!==Z.receiveShadow)&&(_t.receiveShadow=Z.receiveShadow,ne.setValue(k,"receiveShadow",Z.receiveShadow)),ut.isMeshGouraudMaterial&&ut.envMap!==null&&(Qe.envMap.value=Kt,Qe.flipEnvMap.value=Kt.isCubeTexture&&Kt.isRenderTargetTexture===!1?-1:1),ut.isMeshStandardMaterial&&ut.envMap===null&&Y.environment!==null&&(Qe.envMapIntensity.value=Y.environmentIntensity),me&&(ne.setValue(k,"toneMappingExposure",U.toneMappingExposure),_t.needsLights&&ms(Qe,hn),Rt&&ut.fog===!0&&pt.refreshFogUniforms(Qe,Rt),pt.refreshMaterialUniforms(Qe,ut,tt,$,g.state.transmissionRenderTarget[A.id]),Xc.upload(k,pn(_t),Qe,R)),ut.isShaderMaterial&&ut.uniformsNeedUpdate===!0&&(Xc.upload(k,pn(_t),Qe,R),ut.uniformsNeedUpdate=!1),ut.isSpriteMaterial&&ne.setValue(k,"center",Z.center),ne.setValue(k,"modelViewMatrix",Z.modelViewMatrix),ne.setValue(k,"normalMatrix",Z.normalMatrix),ne.setValue(k,"modelMatrix",Z.matrixWorld),ut.isShaderMaterial||ut.isRawShaderMaterial){const mn=ut.uniformsGroups;for(let cn=0,un=mn.length;cn<un;cn++){const Le=mn[cn];O.update(Le,Yt),O.bind(Le,Yt)}}return Yt}function ms(A,Y){A.ambientLightColor.needsUpdate=Y,A.lightProbe.needsUpdate=Y,A.directionalLights.needsUpdate=Y,A.directionalLightShadows.needsUpdate=Y,A.pointLights.needsUpdate=Y,A.pointLightShadows.needsUpdate=Y,A.spotLights.needsUpdate=Y,A.spotLightShadows.needsUpdate=Y,A.rectAreaLights.needsUpdate=Y,A.hemisphereLights.needsUpdate=Y}function $r(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return q},this.setRenderTargetTextures=function(A,Y,lt){Dt.get(A.texture).__webglTexture=Y,Dt.get(A.depthTexture).__webglTexture=lt;const ut=Dt.get(A);ut.__hasExternalTextures=!0,ut.__autoAllocateDepthBuffer=lt===void 0,ut.__autoAllocateDepthBuffer||xe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ut.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,Y){const lt=Dt.get(A);lt.__webglFramebuffer=Y,lt.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(A,Y=0,lt=0){q=A,V=Y,P=lt;let ut=!0,Z=null,Rt=!1,qt=!1;if(A){const Kt=Dt.get(A);if(Kt.__useDefaultFramebuffer!==void 0)j.bindFramebuffer(k.FRAMEBUFFER,null),ut=!1;else if(Kt.__webglFramebuffer===void 0)R.setupRenderTarget(A);else if(Kt.__hasExternalTextures)R.rebindTextures(A,Dt.get(A.texture).__webglTexture,Dt.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const oe=A.depthTexture;if(Kt.__boundDepthTexture!==oe){if(oe!==null&&Dt.has(oe)&&(A.width!==oe.image.width||A.height!==oe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(A)}}const re=A.texture;(re.isData3DTexture||re.isDataArrayTexture||re.isCompressedArrayTexture)&&(qt=!0);const de=Dt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(de[Y])?Z=de[Y][lt]:Z=de[Y],Rt=!0):A.samples>0&&R.useMultisampledRTT(A)===!1?Z=Dt.get(A).__webglMultisampledFramebuffer:Array.isArray(de)?Z=de[lt]:Z=de,G.copy(A.viewport),ft.copy(A.scissor),st=A.scissorTest}else G.copy(L).multiplyScalar(tt).floor(),ft.copy(rt).multiplyScalar(tt).floor(),st=Nt;if(j.bindFramebuffer(k.FRAMEBUFFER,Z)&&ut&&j.drawBuffers(A,Z),j.viewport(G),j.scissor(ft),j.setScissorTest(st),Rt){const Kt=Dt.get(A.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Kt.__webglTexture,lt)}else if(qt){const Kt=Dt.get(A.texture),re=Y||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,Kt.__webglTexture,lt||0,re)}D=-1},this.readRenderTargetPixels=function(A,Y,lt,ut,Z,Rt,qt){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Zt=Dt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&qt!==void 0&&(Zt=Zt[qt]),Zt){j.bindFramebuffer(k.FRAMEBUFFER,Zt);try{const Kt=A.texture,re=Kt.format,de=Kt.type;if(!Te.textureFormatReadable(re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Te.textureTypeReadable(de)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=A.width-ut&&lt>=0&&lt<=A.height-Z&&k.readPixels(Y,lt,ut,Z,se.convert(re),se.convert(de),Rt)}finally{const Kt=q!==null?Dt.get(q).__webglFramebuffer:null;j.bindFramebuffer(k.FRAMEBUFFER,Kt)}}},this.readRenderTargetPixelsAsync=async function(A,Y,lt,ut,Z,Rt,qt){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Zt=Dt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&qt!==void 0&&(Zt=Zt[qt]),Zt){const Kt=A.texture,re=Kt.format,de=Kt.type;if(!Te.textureFormatReadable(re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Te.textureTypeReadable(de))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=A.width-ut&&lt>=0&&lt<=A.height-Z){j.bindFramebuffer(k.FRAMEBUFFER,Zt);const oe=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,oe),k.bufferData(k.PIXEL_PACK_BUFFER,Rt.byteLength,k.STREAM_READ),k.readPixels(Y,lt,ut,Z,se.convert(re),se.convert(de),0);const Me=q!==null?Dt.get(q).__webglFramebuffer:null;j.bindFramebuffer(k.FRAMEBUFFER,Me);const Pe=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await hS(k,Pe,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,oe),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,Rt),k.deleteBuffer(oe),k.deleteSync(Pe),Rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,Y=null,lt=0){A.isTexture!==!0&&(Br("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,A=arguments[1]);const ut=Math.pow(2,-lt),Z=Math.floor(A.image.width*ut),Rt=Math.floor(A.image.height*ut),qt=Y!==null?Y.x:0,Zt=Y!==null?Y.y:0;R.setTexture2D(A,0),k.copyTexSubImage2D(k.TEXTURE_2D,lt,0,0,qt,Zt,Z,Rt),j.unbindTexture()};const gs=k.createFramebuffer(),Ci=k.createFramebuffer();this.copyTextureToTexture=function(A,Y,lt=null,ut=null,Z=0,Rt=null){A.isTexture!==!0&&(Br("WebGLRenderer: copyTextureToTexture function signature has changed."),ut=arguments[0]||null,A=arguments[1],Y=arguments[2],Rt=arguments[3]||0,lt=null),Rt===null&&(Z!==0?(Br("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Rt=Z,Z=0):Rt=0);let qt,Zt,Kt,re,de,oe,Me,Pe,en;const Ke=A.isCompressedTexture?A.mipmaps[Rt]:A.image;if(lt!==null)qt=lt.max.x-lt.min.x,Zt=lt.max.y-lt.min.y,Kt=lt.isBox3?lt.max.z-lt.min.z:1,re=lt.min.x,de=lt.min.y,oe=lt.isBox3?lt.min.z:0;else{const vn=Math.pow(2,-Z);qt=Math.floor(Ke.width*vn),Zt=Math.floor(Ke.height*vn),A.isDataArrayTexture?Kt=Ke.depth:A.isData3DTexture?Kt=Math.floor(Ke.depth*vn):Kt=1,re=0,de=0,oe=0}ut!==null?(Me=ut.x,Pe=ut.y,en=ut.z):(Me=0,Pe=0,en=0);const dt=se.convert(Y.format),_t=se.convert(Y.type);let Gt;Y.isData3DTexture?(R.setTexture3D(Y,0),Gt=k.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(R.setTexture2DArray(Y,0),Gt=k.TEXTURE_2D_ARRAY):(R.setTexture2D(Y,0),Gt=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,Y.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,Y.unpackAlignment);const Lt=k.getParameter(k.UNPACK_ROW_LENGTH),Yt=k.getParameter(k.UNPACK_IMAGE_HEIGHT),we=k.getParameter(k.UNPACK_SKIP_PIXELS),me=k.getParameter(k.UNPACK_SKIP_ROWS),hn=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,Ke.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Ke.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,re),k.pixelStorei(k.UNPACK_SKIP_ROWS,de),k.pixelStorei(k.UNPACK_SKIP_IMAGES,oe);const ne=A.isDataArrayTexture||A.isData3DTexture,Qe=Y.isDataArrayTexture||Y.isData3DTexture;if(A.isDepthTexture){const vn=Dt.get(A),mn=Dt.get(Y),cn=Dt.get(vn.__renderTarget),un=Dt.get(mn.__renderTarget);j.bindFramebuffer(k.READ_FRAMEBUFFER,cn.__webglFramebuffer),j.bindFramebuffer(k.DRAW_FRAMEBUFFER,un.__webglFramebuffer);for(let Le=0;Le<Kt;Le++)ne&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Dt.get(A).__webglTexture,Z,oe+Le),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Dt.get(Y).__webglTexture,Rt,en+Le)),k.blitFramebuffer(re,de,qt,Zt,Me,Pe,qt,Zt,k.DEPTH_BUFFER_BIT,k.NEAREST);j.bindFramebuffer(k.READ_FRAMEBUFFER,null),j.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(Z!==0||A.isRenderTargetTexture||Dt.has(A)){const vn=Dt.get(A),mn=Dt.get(Y);j.bindFramebuffer(k.READ_FRAMEBUFFER,gs),j.bindFramebuffer(k.DRAW_FRAMEBUFFER,Ci);for(let cn=0;cn<Kt;cn++)ne?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,vn.__webglTexture,Z,oe+cn):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,vn.__webglTexture,Z),Qe?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,mn.__webglTexture,Rt,en+cn):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,mn.__webglTexture,Rt),Z!==0?k.blitFramebuffer(re,de,qt,Zt,Me,Pe,qt,Zt,k.COLOR_BUFFER_BIT,k.NEAREST):Qe?k.copyTexSubImage3D(Gt,Rt,Me,Pe,en+cn,re,de,qt,Zt):k.copyTexSubImage2D(Gt,Rt,Me,Pe,re,de,qt,Zt);j.bindFramebuffer(k.READ_FRAMEBUFFER,null),j.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else Qe?A.isDataTexture||A.isData3DTexture?k.texSubImage3D(Gt,Rt,Me,Pe,en,qt,Zt,Kt,dt,_t,Ke.data):Y.isCompressedArrayTexture?k.compressedTexSubImage3D(Gt,Rt,Me,Pe,en,qt,Zt,Kt,dt,Ke.data):k.texSubImage3D(Gt,Rt,Me,Pe,en,qt,Zt,Kt,dt,_t,Ke):A.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,Rt,Me,Pe,qt,Zt,dt,_t,Ke.data):A.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,Rt,Me,Pe,Ke.width,Ke.height,dt,Ke.data):k.texSubImage2D(k.TEXTURE_2D,Rt,Me,Pe,qt,Zt,dt,_t,Ke);k.pixelStorei(k.UNPACK_ROW_LENGTH,Lt),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Yt),k.pixelStorei(k.UNPACK_SKIP_PIXELS,we),k.pixelStorei(k.UNPACK_SKIP_ROWS,me),k.pixelStorei(k.UNPACK_SKIP_IMAGES,hn),Rt===0&&Y.generateMipmaps&&k.generateMipmap(Gt),j.unbindTexture()},this.copyTextureToTexture3D=function(A,Y,lt=null,ut=null,Z=0){return A.isTexture!==!0&&(Br("WebGLRenderer: copyTextureToTexture3D function signature has changed."),lt=arguments[0]||null,ut=arguments[1]||null,A=arguments[2],Y=arguments[3],Z=arguments[4]||0),Br('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,Y,lt,ut,Z)},this.initRenderTarget=function(A){Dt.get(A).__webglFramebuffer===void 0&&R.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?R.setTextureCube(A,0):A.isData3DTexture?R.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?R.setTexture2DArray(A,0):R.setTexture2D(A,0),j.unbindTexture()},this.resetState=function(){V=0,P=0,q=null,j.reset(),Xt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ua}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorspace=Xe._getDrawingBufferColorSpace(e),i.unpackColorSpace=Xe._getUnpackColorSpace()}}function NT(){const o=Ye.useRef(null),e=Ye.useRef(null),i=Ye.useRef(null),s=Ye.useRef({scene:null,camera:null,renderer:null,player:{x:0,y:1.7,z:18,yaw:0,pitch:0},keys:{},enemies:[],questionStations:[],activeStation:null,locked:!1,stair:null,joy:{x:0,y:0},look:{up:!1,down:!1,left:!1,right:!1}}),[l,u]=Ye.useState(!1),[d,h]=Ye.useState(!1),[m,p]=Ye.useState(!1),[v,x]=Ye.useState(!1),[y,M]=Ye.useState(3),[T,w]=Ye.useState(0),[S,g]=Ye.useState(null),[F,N]=Ye.useState(30),[U,W]=Ye.useState(null),[V,P]=Ye.useState(!1),[q,D]=Ye.useState(0),C=Ye.useRef(0);Ye.useEffect(()=>{C.current=q},[q]);const G=3;Ye.useEffect(()=>{const j=()=>{const E="ontouchstart"in window||navigator.maxTouchPoints>0,H=window.innerWidth<900;u(E||H)};j(),window.addEventListener("resize",j);let I=document.querySelector('meta[name="viewport"]'),Dt=!1;I||(I=document.createElement("meta"),I.setAttribute("name","viewport"),document.head.appendChild(I),Dt=!0);const R=I.getAttribute("content");return I.setAttribute("content","width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"),()=>{window.removeEventListener("resize",j),Dt?I.remove():R&&I.setAttribute("content",R)}},[]);const ft=[{q:"ما هي عاصمة المملكة العربية السعودية؟",options:["جدة","الرياض","بريدة","الدمام"],correct:1,difficulty:"easy"},{q:"في أي مدينة تقع جامعة القصيم؟",options:["الرياض","بريدة","عنيزة","حائل"],correct:1,difficulty:"easy"},{q:"كم عدد أركان الإسلام؟",options:["3","4","5","6"],correct:2,difficulty:"easy"},{q:"ما هي اللغة الرسمية للمملكة؟",options:["English","العربية","Urdu","French"],correct:1,difficulty:"easy"},{q:"في أي عام تأسست جامعة القصيم؟",options:["1990","2000","2004","2010"],correct:2,difficulty:"medium"},{q:"ما هو شعار رؤية المملكة؟",options:["2020","2025","2030","2040"],correct:2,difficulty:"medium"},{q:"كم عدد الكليات في جامعة القصيم تقريباً؟",options:["10","20","30","40+"],correct:3,difficulty:"medium"},{q:"ما هي عملة المملكة العربية السعودية؟",options:["دينار","ريال","درهم","دولار"],correct:1,difficulty:"medium"},{q:"ما هو أكبر صحراء في المملكة؟",options:["النفود","الربع الخالي","الدهناء","الصحراء الكبرى"],correct:1,difficulty:"hard"},{q:"كم عدد الصلوات المفروضة في اليوم؟",options:["3","4","5","6"],correct:2,difficulty:"hard"}],st=j=>({id:j.id??null,q:j.q??j.question??"",qEn:j.qEn??j.question_en??"",options:j.options??[],correct:j.correct??j.correctIndex??0,difficulty:j.difficulty??"medium"}),Mt=j=>{let I=[],Dt=[],R=[];if(j&&!Array.isArray(j)&&(j.easy||j.medium||j.hard))I=(j.easy||[]).map(st),Dt=(j.medium||[]).map(st),R=(j.hard||[]).map(st);else{const E=(j||[]).map(st);I=E.filter(H=>H.difficulty==="easy"),Dt=E.filter(H=>H.difficulty==="medium"),R=E.filter(H=>H.difficulty==="hard"),I.length===0&&Dt.length===0&&R.length===0&&(Dt=E)}return{easy:I,medium:Dt,hard:R}},Et=typeof window<"u"&&window.GAME_DATA||{},z=(()=>{const j=Mt(Et.groupedQuestions||Et.questions);return j.easy.length+j.medium.length+j.hard.length>=10?j:Mt(ft)})(),$=Et.courseCode||"TEST",tt=Et.courseId||null,Pt=Et.attachmentKey||null,Ft=Et.csrfToken||"",L=Ye.useRef({startedAt:0,perQuestion:[],difficultyChanges:[]}),rt=Ye.useRef(`game_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`),Nt=Ye.useRef({easy:[],medium:[],hard:[]}),K=Ye.useRef("easy"),yt={easy:"medium",medium:"hard",hard:"hard"},Bt={hard:"medium",medium:"easy",easy:"easy"},zt=(j,{correct:I,time_taken:Dt,timed_out:R,lives_after:E})=>R||!I?Bt[j]:E<=1?j:Dt<10?yt[j]:j,$t=j=>{const I=j==="hard"?["hard","medium","easy"]:j==="easy"?["easy","medium","hard"]:["medium","easy","hard"];for(const Dt of I){const R=Nt.current[Dt];if(R&&R.length>0)return R.shift()}return null},Jt=[{name:"قاعة المحاضرات",nameEn:"Lecture Hall",qIdx:5,color:4886754},{name:"المكتبة",nameEn:"Library",qIdx:6,color:13138490},{name:"المختبر",nameEn:"Laboratory",qIdx:7,color:8053322},{name:"قاعة الاجتماعات",nameEn:"Meeting Room",qIdx:8,color:10504930},{name:"المسجد",nameEn:"Mosque",qIdx:9,color:27701}],pe=()=>{const j=document.createElement("canvas");j.width=1024,j.height=1024;const I=j.getContext("2d");I.fillStyle="#f0e8d0",I.fillRect(0,0,1024,1024),I.strokeStyle="#e0d6b8",I.lineWidth=1.5;for(let nt=0;nt<=1024;nt+=64)I.beginPath(),I.moveTo(nt,0),I.lineTo(nt,1024),I.stroke(),I.beginPath(),I.moveTo(0,nt),I.lineTo(1024,nt),I.stroke();const Dt=512,R=512,E=["#c87a3a","#3d6b5c","#c87a3a","#3d6b5c","#c87a3a","#3d6b5c","#c87a3a","#3d6b5c"];I.fillStyle="#1a1a1a";for(let nt=0;nt<8;nt++){const ht=nt/8*Math.PI*2,ot=Dt+Math.cos(ht)*200,xt=R+Math.sin(ht)*200;I.beginPath();for(let pt=0;pt<8;pt++){const Ht=pt/8*Math.PI*2,ee=ot+Math.cos(Ht)*130,vt=xt+Math.sin(Ht)*130;pt===0?I.moveTo(ee,vt):I.lineTo(ee,vt)}I.closePath(),I.fill()}for(let nt=0;nt<8;nt++){const ht=nt/8*Math.PI*2,ot=Dt+Math.cos(ht)*200,xt=R+Math.sin(ht)*200;I.fillStyle=E[nt],I.beginPath();for(let pt=0;pt<8;pt++){const Ht=pt/8*Math.PI*2,ee=ot+Math.cos(Ht)*118,vt=xt+Math.sin(Ht)*118;pt===0?I.moveTo(ee,vt):I.lineTo(ee,vt)}I.closePath(),I.fill()}I.save(),I.translate(Dt,R),I.fillStyle="#1a1a1a",I.fillRect(-145,-145,290,290),I.rotate(Math.PI/4),I.fillRect(-145,-145,290,290),I.restore(),I.save(),I.translate(Dt,R),I.fillStyle="#c87a3a",I.fillRect(-130,-130,260,260),I.rotate(Math.PI/4),I.fillRect(-130,-130,260,260),I.restore();const H=new Oc(j);return H.colorSpace=ii,H},je=()=>{const j=document.createElement("canvas");j.width=1024,j.height=512;const I=j.getContext("2d");I.fillStyle="#006c35",I.fillRect(0,0,1024,512),I.fillStyle="#f5e9d4",I.fillRect(40,40,944,432),I.fillStyle="#006c35",I.font="bold 130px serif",I.textAlign="center",I.textBaseline="middle",I.fillText("جامعة القصيم",512,180),I.fillRect(200,250,624,6),I.fillStyle="#1a4a2a",I.font="bold 70px sans-serif",I.fillText("QASSIM UNIVERSITY",512,320),I.font="40px serif",I.fillStyle="#8a6f55",I.fillText("Established 1424 H — 2004",512,400);const Dt=new Oc(j);return Dt.colorSpace=ii,Dt},be=()=>{const j=document.createElement("canvas");j.width=800,j.height=533;const I=j.getContext("2d");I.fillStyle="#006c35",I.fillRect(0,0,800,533),I.fillStyle="#ffffff",I.font="bold 75px serif",I.textAlign="center",I.fillText("لا إله إلا الله محمد رسول الله",400,200),I.strokeStyle="#ffffff",I.lineWidth=8,I.beginPath(),I.moveTo(150,350),I.lineTo(650,350),I.stroke(),I.beginPath(),I.moveTo(150,350),I.lineTo(180,335),I.lineTo(180,365),I.closePath(),I.fillStyle="#ffffff",I.fill(),I.fillRect(640,340,30,20),I.fillRect(660,325,15,50);const Dt=new Oc(j);return Dt.colorSpace=ii,Dt},ln=Ye.useCallback(()=>{const j=o.current;if(!j)return;const I=new BS;I.background=new Ue(13161696),I.fog=new Bh(13940856,90,250);const Dt=new wi(75,j.clientWidth/j.clientHeight,.1,500);Dt.position.set(0,1.7,28);const R=new LT({antialias:!0});R.setSize(j.clientWidth,j.clientHeight),R.setPixelRatio(Math.min(window.devicePixelRatio,2)),R.shadowMap.enabled=!0,R.shadowMap.type=N_,R.toneMapping=z_,R.toneMappingExposure=1.15,j.appendChild(R.domElement);const E=new YS(16773328,.95);I.add(E);const H=new WS(16774600,1.4);H.position.set(20,90,25),H.castShadow=!0,H.shadow.mapSize.width=2048,H.shadow.mapSize.height=2048,H.shadow.camera.left=-80,H.shadow.camera.right=80,H.shadow.camera.top=80,H.shadow.camera.bottom=-80,I.add(H);const nt=new kS(13161696,13146216,.55);I.add(nt);const ht=new ve({color:13940856,roughness:.93}),ot=new ve({color:12097632,roughness:.93}),xt=new ve({color:15060885,roughness:.9}),pt=new ve({color:657930,roughness:.2,metalness:.7}),Ht=new ve({color:15919836,roughness:.4}),ee=new ve({color:11040840,roughness:.85});new ve({color:27701,roughness:.6});const vt=26,Ut=26,Vt=7,Ct=3.2,kt=6,ae=1.2,se=new Wt(new fe(200,.2,200),new ve({color:12097640,roughness:.95}));se.position.y=-.2,se.receiveShadow=!0,I.add(se);const Xt=new Wt(new fe(vt*2,.2,Ut*2),Ht);Xt.position.y=-.05,Xt.receiveShadow=!0,I.add(Xt);const O=new Wt(new ta(14,14),new ve({map:pe(),roughness:.4}));O.rotation.x=-Math.PI/2,O.position.set(0,.06,5),O.receiveShadow=!0,I.add(O);function Ot(dt){const _t=new kn,Gt=vt-dt*ae,Lt=Ut-dt*ae,Yt=dt*Ct;if(dt===0){[{x:0,z:-Ut-Vt/2,w:(vt+Vt)*2,d:Vt},{x:0,z:Ut+Vt/2,w:(vt+Vt)*2,d:Vt},{x:-vt-Vt/2,z:0,w:Vt,d:Ut*2},{x:vt+Vt/2,z:0,w:Vt,d:Ut*2}].forEach(Re=>{const zn=new Wt(new fe(Re.w,.2,Re.d),Ht);zn.position.set(Re.x,0,Re.z),zn.receiveShadow=!0,_t.add(zn)});const Le=vt+Vt,Fe=Ut+Vt,Tn=new Wt(new fe(Le*2,Ct,.5),ht);Tn.position.set(0,Ct/2,-Fe+.25),Tn.castShadow=!0,Tn.receiveShadow=!0,_t.add(Tn);const Jn=Tn.clone();Jn.position.set(0,Ct/2,Fe-.25),_t.add(Jn);const fn=new Wt(new fe(.5,Ct,Fe*2),ht);fn.position.set(-Le+.25,Ct/2,0),fn.castShadow=!0,_t.add(fn);const Sn=new Wt(new fe(.5,Ct-2.4,6),ht);Sn.position.set(Le-.25,Ct-(Ct-2.4)/2,0),_t.add(Sn);const He=new Wt(new fe(.5,Ct,Fe-3),ht);He.position.set(Le-.25,Ct/2,-Fe/2-1.5),He.castShadow=!0,_t.add(He);const he=He.clone();he.position.set(Le-.25,Ct/2,Fe/2+1.5),_t.add(he);const Ae=new Wt(new fe(.7,.15,6.4),ot);return Ae.position.set(Le-.25,2.4,0),_t.add(Ae),_t}const we=.5;function me(un,Le){const Fe=new kn;if(un<=0)return Fe;const Tn=new Wt(new fe(un,we,Le),ot);Tn.position.set(0,-we/2,Le/2-.5),Tn.castShadow=!0,Tn.receiveShadow=!0,Fe.add(Tn);const Jn=new Wt(new fe(un-.1,.05,Le-.3),Ht);Jn.position.set(0,.025,Le/2-.5),Jn.receiveShadow=!0,Fe.add(Jn);const fn=new Wt(new fe(un,.95,.4),ht);fn.position.set(0,.475,-.2),fn.castShadow=!0,fn.receiveShadow=!0,Fe.add(fn);const Sn=new Wt(new fe(un,.1,.5),ot);return Sn.position.set(0,1,-.2),Fe.add(Sn),Fe}function hn(un,Le){const Fe=new kn;if(un<=0)return Fe;const Tn=new Wt(new fe(un,1.4,.4),ht);Tn.position.set(0,.7,Le-.2),Tn.castShadow=!0,Fe.add(Tn);const Jn=new Wt(new fe(un,.5,.15),pt);Jn.position.set(0,1.7,Le-.4),Fe.add(Jn);const fn=new Wt(new fe(un,Ct-2.1,.4),ht);fn.position.set(0,1.95+(Ct-2.1)/2,Le-.2),fn.castShadow=!0,Fe.add(fn);const Sn=new Wt(new fe(un,.2,.5),xt);return Sn.position.set(0,Ct-.1,Le-.3),Fe.add(Sn),Fe}const ne=Vt,Qe=8,vn=(Gt+Lt)/2,mn=2*vn*Math.sin(Math.PI/Qe),cn=vn*Math.cos(Math.PI/Qe);for(let un=0;un<Qe;un++){const Le=un/Qe*Math.PI*2,Fe=Math.cos(Le)*cn,Tn=Math.sin(Le)*cn,Jn=-Le-Math.PI/2,fn=new kn,Sn=mn*.18,He=1.6,he=(mn-Sn*2)/2;if(he>0){const $n=new kn;$n.add(me(he,ne+1.5)),$n.add(hn(he,ne+1.5)),$n.position.x=-(Sn+he/2),fn.add($n)}const Ae=Math.atan2(He,Sn),Re=Math.sqrt(Sn**2+He**2),zn=new kn;zn.add(me(Re,ne+1.5)),zn.add(hn(Re,ne+1.5)),zn.position.set(-Sn/2,0,-He/2),zn.rotation.y=Ae,fn.add(zn);const ra=new kn;if(ra.add(me(Re,ne+1.5)),ra.add(hn(Re,ne+1.5)),ra.position.set(Sn/2,0,-He/2),ra.rotation.y=-Ae,fn.add(ra),he>0){const $n=new kn;$n.add(me(he,ne+1.5)),$n.add(hn(he,ne+1.5)),$n.position.x=Sn+he/2,fn.add($n)}fn.position.set(Fe,Yt,Tn),fn.rotation.y=Jn,_t.add(fn)}return _t}for(let dt=0;dt<kt;dt++)I.add(Ot(dt));const Q=vt+Vt,gt=32,It=5,Tt=9,Qt=8,Ge=new Wt(new fe(gt,.2,It),Ht);Ge.position.set(Q+gt/2,0,0),Ge.receiveShadow=!0,I.add(Ge);const ze=new Wt(new fe(gt,.3,It),ht);ze.position.set(Q+gt/2,Ct-.15,0),I.add(ze);for(let dt=4;dt<gt;dt+=6){const _t=new Wt(new fe(1.2,.05,.6),new ve({color:16777164,emissive:16774592,emissiveIntensity:.8}));_t.position.set(Q+dt,Ct-.4,0),I.add(_t);const Gt=new Jo(16774592,.7,12);Gt.position.set(Q+dt,Ct-.5,0),I.add(Gt)}const le=[{side:-1,x:Q+6,qIdx:0},{side:-1,x:Q+16,qIdx:1},{side:-1,x:Q+26,qIdx:2},{side:1,x:Q+8,qIdx:3},{side:1,x:Q+22,qIdx:4}],tn=[];le.forEach((dt,_t)=>{const Gt=Jt[dt.qIdx],Lt=dt.x,Yt=dt.side*(It/2+Tt/2),we=new Wt(new fe(Qt,.2,Tt),Ht);we.position.set(Lt,0,Yt),we.receiveShadow=!0,I.add(we);const me=new Wt(new fe(Qt,.3,Tt),ht);me.position.set(Lt,Ct-.15,Yt),I.add(me);const hn=Yt-dt.side*Tt/2,ne=2.5,Qe=(Qt-ne)/2,vn=new Wt(new fe(Qe,Ct,.4),ht);vn.position.set(Lt-(ne/2+Qe/2),Ct/2,hn),vn.castShadow=!0,vn.receiveShadow=!0,I.add(vn);const mn=vn.clone();mn.position.set(Lt+(ne/2+Qe/2),Ct/2,hn),I.add(mn);const cn=new Wt(new fe(ne,.7,.4),ht);cn.position.set(Lt,Ct-.35,hn),I.add(cn);const un=Yt+dt.side*Tt/2,Le=new Wt(new fe(Qt,Ct,.4),ht);Le.position.set(Lt,Ct/2,un),Le.castShadow=!0,Le.receiveShadow=!0,I.add(Le);const Fe=new Wt(new fe(.4,Ct,Tt),ht);Fe.position.set(Lt-Qt/2,Ct/2,Yt),Fe.castShadow=!0,I.add(Fe);const Tn=Fe.clone();if(Tn.position.set(Lt+Qt/2,Ct/2,Yt),I.add(Tn),Gt.nameEn==="Library"){for(let he=-1;he<=1;he+=2){const Ae=new Wt(new fe(.4,2.4,Tt-1),new ve({color:7029795,roughness:.8}));Ae.position.set(Lt+he*(Qt/2-.5),1.2,Yt),Ae.castShadow=!0,I.add(Ae);for(let Re=0;Re<8;Re++){const zn=new Wt(new fe(.3,.4,.7),new ve({color:[13122122,4886696,3844216,13138490,8014536][Re%5]}));zn.position.set(Lt+he*(Qt/2-.7),.6+Re%4*.5,Yt-Tt/2+1+Math.floor(Re/4)*(Tt/2)),I.add(zn)}}const He=new Wt(new fe(2,.1,1.2),new ve({color:4861984}));He.position.set(Lt,.8,Yt),I.add(He);for(let he=-.8;he<=.8;he+=1.6)for(let Ae=-.5;Ae<=.5;Ae+=1){const Re=new Wt(new fe(.08,.8,.08),new ve({color:2758672}));Re.position.set(Lt+he,.4,Yt+Ae),I.add(Re)}}else if(Gt.nameEn==="Lecture Hall"){for(let he=0;he<3;he++)for(let Ae=-1;Ae<=1;Ae++){const Re=new Wt(new fe(.6,.5,.6),new ve({color:4864554}));Re.position.set(Lt+Ae*1.2,.25,Yt-dt.side*(Tt/4-he*1)),I.add(Re);const zn=new Wt(new fe(.6,.7,.1),new ve({color:4864554}));zn.position.set(Lt+Ae*1.2,.85,Yt-dt.side*(Tt/4-he*1)+dt.side*.25),I.add(zn)}const He=new Wt(new ta(4,1.8),new ve({color:16777215,roughness:.6}));He.position.set(Lt,1.7,un-dt.side*.25),He.rotation.y=dt.side>0?0:Math.PI,I.add(He)}else if(Gt.nameEn==="Laboratory")for(let He=-1;He<=1;He+=2){const he=new Wt(new fe(2.5,.1,1),new ve({color:13158600,roughness:.5}));he.position.set(Lt+He*1.8,.85,Yt),I.add(he);for(let Ae=0;Ae<3;Ae++){const Re=new Wt(new Ca(.12,.12,.3,8),new ve({color:[4886696,13122122,3844216][Ae],emissive:[4886696,13122122,3844216][Ae],emissiveIntensity:.2}));Re.position.set(Lt+He*1.8+(Ae-1)*.5,1.05,Yt),I.add(Re)}}else if(Gt.nameEn==="Meeting Room"){const He=new Wt(new fe(Qt-3,.15,Tt-4),new ve({color:3811866,roughness:.5}));He.position.set(Lt,.85,Yt),I.add(He);for(let he=-2;he<=2;he+=2)for(let Ae=-1;Ae<=1;Ae+=2){const Re=new Wt(new fe(.5,.5,.5),new ve({color:1710618}));Re.position.set(Lt+he,.25,Yt+Ae*(Tt/2-2)),I.add(Re)}}else if(Gt.nameEn==="Mosque"){for(let he=0;he<4;he++){const Ae=new Wt(new fe(Qt-1,.04,.8),new ve({color:27701,roughness:.95}));Ae.position.set(Lt,.06,Yt+(he-1.5)*1.2),I.add(Ae)}const He=new Wt(new fe(1.5,2.5,.3),new ve({color:27701,roughness:.7}));He.position.set(Lt,1.5,un-dt.side*.3),I.add(He)}const Jn=(()=>{const He=document.createElement("canvas");He.width=512,He.height=128;const he=He.getContext("2d");he.fillStyle="#006c35",he.fillRect(0,0,512,128),he.fillStyle="#f5e9d4",he.font="bold 50px serif",he.textAlign="center",he.textBaseline="middle",he.fillText(Gt.name,256,50),he.font="bold 24px sans-serif",he.fillText(Gt.nameEn,256,95);const Ae=new Oc(He);return Ae.colorSpace=ii,Ae})(),fn=new Wt(new ta(1.8,.45),new ve({map:Jn,side:Ri,roughness:.6}));fn.position.set(Lt+(Qe/2+ne/2)-.5,2.5,hn-dt.side*.3),fn.rotation.y=dt.side>0?0:Math.PI,I.add(fn);const Sn=new Jo(16773328,.6,14);Sn.position.set(Lt,Ct-.5,Yt),I.add(Sn),tn.push({x:Lt,z:Yt,name:Gt.name,idx:_t})});const Cn=new Wt(new fe(.5,Ct,It+4),ht);Cn.position.set(Q+gt+.25,Ct/2,0),Cn.castShadow=!0,I.add(Cn),[{fromX:Q,toX:Q+2,side:-1},{fromX:Q+10,toX:Q+12,side:-1},{fromX:Q+20,toX:Q+22,side:-1},{fromX:Q+30,toX:Q+gt,side:-1},{fromX:Q,toX:Q+4,side:1},{fromX:Q+12,toX:Q+18,side:1},{fromX:Q+26,toX:Q+gt,side:1}].forEach(dt=>{const _t=dt.toX-dt.fromX;if(_t<=0)return;const Gt=new Wt(new fe(_t,Ct,.4),ht);Gt.position.set((dt.fromX+dt.toX)/2,Ct/2,dt.side*(It/2+.2)),Gt.castShadow=!0,I.add(Gt)}),s.current.rooms=tn;const si=kt*Ct,Kn=vt+6,Fn=11,Qn=new Wt(new Vs(1,64,32,0,Math.PI*2,0,Math.PI/2),new ve({color:16775392,transparent:!0,opacity:.1,side:Ri,roughness:.4}));Qn.scale.set(Kn,Fn,Kn),Qn.position.y=si,I.add(Qn);const Mn=new kc({color:13150328,transparent:!0,opacity:.95}),sa=new kc({color:12095584,transparent:!0,opacity:.6}),Zi=new kc({color:15255704,transparent:!0,opacity:1}),Hn=48,Ze=12,pn=(dt,_t)=>{const Gt=dt/Hn*Math.PI*2,Lt=_t/Ze*(Math.PI/2),Yt=Math.pow(Math.cos(Lt),.7),we=Math.pow(Math.sin(Lt),1.2);return new et(Math.cos(Gt)*Yt*Kn,we*Fn+si,Math.sin(Gt)*Yt*Kn)},ri=new et(0,Fn+si,0);for(let dt=0;dt<Hn;dt++){const _t=[];for(let Lt=0;Lt<=Ze;Lt++)_t.push(pn(dt,Lt));_t[_t.length-1]=ri.clone();const Gt=new ai().setFromPoints(_t);I.add(new Ko(Gt,Mn))}for(let dt=1;dt<Ze;dt++){const _t=[];for(let Lt=0;Lt<=Hn;Lt++)_t.push(pn(Lt,dt));const Gt=new ai().setFromPoints(_t);I.add(new Ko(Gt,Mn))}for(let dt=0;dt<Ze;dt++)for(let _t=0;_t<Hn;_t++){const Gt=pn(_t,dt),Lt=dt===Ze-1?ri.clone():pn(_t+1,dt+1),Yt=new ai().setFromPoints([Gt,Lt]);I.add(new Ko(Yt,sa))}for(let dt=0;dt<Ze;dt++)for(let _t=0;_t<Hn;_t++){const Gt=pn(_t+1,dt),Lt=dt===Ze-1?ri.clone():pn(_t,dt+1),Yt=new ai().setFromPoints([Gt,Lt]);I.add(new Ko(Yt,sa))}for(let dt=0;dt<Hn;dt+=2){const _t=pn(dt,0),Gt=new ai().setFromPoints([_t,ri.clone()]);I.add(new Ko(Gt,Zi))}const Oa=new Wt(new Vs(.8,16,16),new Ih({color:16774608,transparent:!0,opacity:.6}));Oa.position.copy(ri),I.add(Oa);const ms=new Wt(new tl(Kn,.4,8,64),new ve({color:9072712,roughness:.85}));ms.rotation.x=Math.PI/2,ms.position.y=si,I.add(ms);function $r(dt,_t){const Gt=new kn,Lt=16,Yt=.55,we=7;for(let hn=0;hn<Lt;hn++){const ne=new Wt(new fe(we,.2,Yt),ee);ne.position.set(0,hn*(Ct/Lt),-hn*Yt),ne.castShadow=!0,ne.receiveShadow=!0,Gt.add(ne)}[-we/2-.3,we/2+.3].forEach(hn=>{const ne=new Wt(new fe(.6,1.5,Lt*Yt+1),ht);ne.position.set(hn,1,-Lt*Yt/2),ne.castShadow=!0,Gt.add(ne)});const me=new Wt(new fe(we,.2,4),ee);return me.position.set(0,Ct,-Lt*Yt-2),me.castShadow=!0,Gt.add(me),Gt.position.set(dt,0,_t),Gt}const gs=-8;I.add($r(0,gs)),s.current.stair={x:0,zStart:gs,stepCount:16,stepDepth:.55,stairWidth:7,floorHeight:Ct,numFloors:kt};const Ci=new Wt(new Ca(1.2,1.2,Ct*2,16),ht);Ci.position.set(-12,Ct,-10),Ci.castShadow=!0,I.add(Ci);const A=new Wt(new Ca(1.5,1.2,.4,16),ot);A.position.set(-12,Ct*2-.2,-10),I.add(A);const Y=Ci.clone();Y.position.set(12,Ct,-10),I.add(Y);const lt=A.clone();lt.position.set(12,Ct*2-.2,-10),I.add(lt);const ut=new Wt(new ta(10,5),new ve({map:je(),side:Ri,roughness:.7}));ut.position.set(0,11,-Ut+.3),I.add(ut);const Z=new ve({map:be(),side:Ri,roughness:.6}),Rt=new Wt(new ta(3.5,2.3),Z);Rt.position.set(-8,10,-Ut+.3),I.add(Rt);const qt=new Wt(new ta(3.5,2.3),Z);qt.position.set(8,10,-Ut+.3),I.add(qt);function Zt(dt,_t,Gt){const Lt=new kn,Yt=[4880954,4024877,5933642];for(let we=0;we<6;we++){const me=new Wt(new fe(.25,.25,.25),new ve({color:Yt[we%Yt.length],roughness:.85}));me.position.set((Math.random()-.5)*.6,-Math.random()*.4,(Math.random()-.5)*.3),Lt.add(me)}return Lt.position.set(dt,_t,Gt),Lt}for(let dt=1;dt<kt;dt++){const _t=vt-dt*ae,Gt=Ut-dt*ae,Lt=dt*Ct+.4;for(let Yt=-2;Yt<=2;Yt++)Yt!==0&&Math.abs(Yt)===2&&(I.add(Zt(Yt*(_t/3),Lt,-Gt-.3)),I.add(Zt(Yt*(_t/3),Lt,Gt+.3)))}function Kt(dt,_t,Gt=0){const Lt=new kn,Yt=new Wt(new fe(2.5,.15,.7),new ve({color:9071178,roughness:.8}));return Yt.position.y=.5,Yt.castShadow=!0,Lt.add(Yt),[-1,1].forEach(we=>{const me=new Wt(new fe(.1,.5,.5),new ve({color:4864554}));me.position.set(we,.25,0),Lt.add(me)}),Lt.position.set(dt,0,_t),Lt.rotation.y=Gt,Lt}[[-22,12,0],[-12,12,0],[12,12,0],[22,12,0],[-22,-2,0],[-22,-14,0],[22,-2,0],[22,-14,0]].forEach(([dt,_t,Gt])=>I.add(Kt(dt,_t,Gt)));function re(dt,_t){const Gt=new kn,Lt=new Wt(new Ca(.3,.4,1.4,8),new ve({color:16448250,roughness:.85}));Lt.position.y=.7,Lt.castShadow=!0,Gt.add(Lt);const Yt=new Wt(new Vs(.2,12,12),new ve({color:13150328}));Yt.position.y=1.55,Gt.add(Yt);const we=new Wt(new Kc(.26,.35,8),new ve({color:16777215,roughness:.7}));we.position.y=1.75,Gt.add(we);const me=new Wt(new tl(.2,.03,8,16),new ve({color:1710618}));return me.rotation.x=Math.PI/2,me.position.y=1.68,Gt.add(me),Gt.position.set(dt,0,_t),Gt}I.add(re(-3,-3)),I.add(re(0,-2)),I.add(re(3,-3)),I.add(re(-15,6)),I.add(re(15,6));const de=[{x:-22,z:-16,color:27701,qIdx:0},{x:22,z:-16,color:14852170,qIdx:1},{x:-22,z:16,color:27701,qIdx:2},{x:22,z:16,color:27701,qIdx:3},{x:0,z:18,color:14830202,qIdx:4}];le.forEach((dt,_t)=>{const Gt=Jt[dt.qIdx],Lt=dt.x,Yt=dt.side*(It/2+Tt/2);de.push({x:Lt,z:Yt,color:Gt.color,qIdx:5+_t})});const oe=[];de.forEach(dt=>{const _t=new kn,Gt=new Wt(new Ca(.7,.8,.3,8),ot);Gt.position.y=.15,_t.add(Gt);const Lt=new Wt(new fe(.5,1.6,.5),new ve({color:dt.color,emissive:dt.color,emissiveIntensity:.5}));Lt.position.y=1.1,Lt.castShadow=!0,_t.add(Lt);const Yt=new Wt(new fe(.6,.6,.6),new ve({color:16777215,emissive:dt.color,emissiveIntensity:.9}));Yt.position.y=2.5,_t.add(Yt);const we=new Jo(dt.color,1.3,12);we.position.y=2.3,_t.add(we),_t.position.set(dt.x,0,dt.z),_t.userData={idx:dt.qIdx,q:Yt,originalColor:dt.color,answered:!1},I.add(_t),oe.push(_t)}),s.current.questionStations=oe;function Me(dt,_t){const Gt=new kn,Lt=new Wt(new Ca(.35,.45,1.5,8),new ve({color:1710618,roughness:.8}));Lt.position.y=.75,Lt.castShadow=!0,Gt.add(Lt);const Yt=new Wt(new Vs(.25,12,12),new ve({color:13150328}));Yt.position.y=1.65,Gt.add(Yt);const we=new Wt(new Kc(.32,.45,8),new ve({color:11674146,roughness:.7}));we.position.y=1.85,Gt.add(we);const me=new Wt(new tl(.25,.04,8,16),new ve({color:1710618}));me.rotation.x=Math.PI/2,me.position.y=1.78,Gt.add(me);const hn=new ve({color:16711680,emissive:16711680,emissiveIntensity:1});return[-.08,.08].forEach(ne=>{const Qe=new Wt(new Vs(.04,6,6),hn);Qe.position.set(ne,1.68,.22),Gt.add(Qe)}),Gt.position.set(dt,0,_t),Gt.userData={speed:.03,target:new et(dt,0,_t)},Gt}const Pe=[Me(-25,-10),Me(25,10),Me(0,-20)];Pe.forEach(dt=>I.add(dt)),s.current.enemies=Pe;for(let dt=1;dt<kt;dt++){const _t=new Jo(16773836,.4,50);_t.position.set(0,dt*Ct+1,0),I.add(_t)}const en=new Jo(16774608,1.7,120);en.position.set(0,si+12,0),I.add(en),s.current.scene=I,s.current.camera=Dt,s.current.renderer=R,s.current.atriumX=vt,s.current.atriumZ=Ut,s.current.roomBoxes=le.map(dt=>{const _t=dt.x,Gt=dt.side*(It/2+Tt/2);return{minX:_t-Qt/2+.5,maxX:_t+Qt/2-.5,minZ:Gt-Tt/2+.5,maxZ:Gt+Tt/2-.5}});const Ke=()=>{j&&(Dt.aspect=j.clientWidth/j.clientHeight,Dt.updateProjectionMatrix(),R.setSize(j.clientWidth,j.clientHeight))};return window.addEventListener("resize",Ke),()=>{window.removeEventListener("resize",Ke),R.domElement&&R.domElement.parentNode&&R.domElement.parentNode.removeChild(R.domElement),R.dispose()}},[]);Ye.useEffect(()=>{d&&(Nt.current={easy:[...z.easy],medium:[...z.medium],hard:[...z.hard]},K.current="easy")},[d]),Ye.useEffect(()=>{if(!d)return;const j=()=>{if(s.current.locked)return;const Xt=s.current.player,O=s.current.questionStations;let Ot=null,Q=3;if(O.forEach(gt=>{if(gt.userData.answered)return;const It=gt.position.x-Xt.x,Tt=gt.position.z-Xt.z,Qt=Math.sqrt(It*It+Tt*Tt);Qt<Q&&(Q=Qt,Ot=gt)}),Ot){const gt=$t(K.current);if(!gt)return;s.current.activeStation=Ot,s.current.locked=!0,g(gt),N(30)}};s.current.tryInteract=j;const I=Xt=>{if(s.current.keys[Xt.code]=!0,Xt.code==="KeyE"&&j(),Xt.code==="KeyR"){const O=s.current;O.player&&(O.player.x=0,O.player.y=1.7,O.player.z=18,O.player.yaw=0,O.player.pitch=0,O.joy.x=0,O.joy.y=0,O.look.up=O.look.down=O.look.left=O.look.right=!1,O.locked=!1,O.activeStation=null),s.current.locked||(g(null),W(null))}},Dt=Xt=>{s.current.keys[Xt.code]=!1};let R=null,E=null;const H=Xt=>{if(!s.current.locked&&!l){if(R!==null&&E!==null){const O=Xt.clientX-R,Ot=Xt.clientY-E,Q=s.current.player;Q.yaw-=O*.005,Q.pitch-=Ot*.005,Q.pitch=Math.max(-1.535,Math.min(1.535,Q.pitch))}R=Xt.clientX,E=Xt.clientY}},nt=e.current,ht=i.current;let ot=null,xt={x:0,y:0};const pt=50,Ht=Xt=>{if(Xt.preventDefault(),ot!==null)return;const O=Xt.changedTouches?Xt.changedTouches[0]:Xt;ot=Xt.changedTouches?O.identifier:"mouse";const Ot=nt.getBoundingClientRect();xt={x:Ot.left+Ot.width/2,y:Ot.top+Ot.height/2};const Q=nt.querySelector("[data-knob]");Q&&(Q.style.transition="none")},ee=Xt=>{if(ot===null)return;Xt.preventDefault();let O;if(Xt.changedTouches){for(const Tt of Xt.changedTouches)if(Tt.identifier===ot){O=Tt;break}if(!O)return}else O=Xt;let Ot=O.clientX-xt.x,Q=O.clientY-xt.y;const gt=Math.sqrt(Ot*Ot+Q*Q);gt>pt&&(Ot=Ot/gt*pt,Q=Q/gt*pt);const It=nt.querySelector("[data-knob]");It&&(It.style.transform=`translate(${Ot}px, ${Q}px)`),s.current.joy.x=Ot/pt,s.current.joy.y=-Q/pt},vt=Xt=>{if(ot===null)return;if(Xt.changedTouches){let Ot=!1;for(const Q of Xt.changedTouches)if(Q.identifier===ot){Ot=!0;break}if(!Ot)return}Xt.preventDefault(),ot=null,s.current.joy.x=0,s.current.joy.y=0;const O=nt.querySelector("[data-knob]");O&&(O.style.transition="transform 0.15s",O.style.transform="translate(0px, 0px)")};let Ut=null,Vt={x:0,y:0};const Ct=.005,kt=Xt=>{if(Xt.preventDefault(),s.current.locked)return;const O=Xt.changedTouches?Xt.changedTouches[0]:Xt;Ut=Xt.changedTouches?O.identifier:"mouse",Vt={x:O.clientX,y:O.clientY}},ae=Xt=>{if(Ut===null||s.current.locked)return;Xt.preventDefault();let O;if(Xt.changedTouches){for(const It of Xt.changedTouches)if(It.identifier===Ut){O=It;break}if(!O)return}else O=Xt;const Ot=O.clientX-Vt.x,Q=O.clientY-Vt.y;Vt={x:O.clientX,y:O.clientY};const gt=s.current.player;gt.yaw-=Ot*Ct,gt.pitch-=Q*Ct,gt.pitch=Math.max(-1.535,Math.min(1.535,gt.pitch))},se=Xt=>{if(Ut!==null){if(Xt.changedTouches){let O=!1;for(const Ot of Xt.changedTouches)if(Ot.identifier===Ut){O=!0;break}if(!O)return}Ut=null}};return nt&&(nt.addEventListener("touchstart",Ht,{passive:!1}),nt.addEventListener("mousedown",Ht)),window.addEventListener("touchmove",ee,{passive:!1}),window.addEventListener("touchend",vt,{passive:!1}),window.addEventListener("touchcancel",vt,{passive:!1}),window.addEventListener("mousemove",ee),window.addEventListener("mouseup",vt),ht&&(ht.addEventListener("touchstart",kt,{passive:!1}),ht.addEventListener("mousedown",kt)),window.addEventListener("touchmove",ae,{passive:!1}),window.addEventListener("touchend",se,{passive:!1}),window.addEventListener("touchcancel",se,{passive:!1}),window.addEventListener("mousemove",ae),window.addEventListener("mouseup",se),window.addEventListener("keydown",I),window.addEventListener("keyup",Dt),window.addEventListener("mousemove",H),()=>{window.removeEventListener("keydown",I),window.removeEventListener("keyup",Dt),window.removeEventListener("mousemove",H),nt&&(nt.removeEventListener("touchstart",Ht),nt.removeEventListener("mousedown",Ht)),window.removeEventListener("touchmove",ee),window.removeEventListener("touchend",vt),window.removeEventListener("touchcancel",vt),window.removeEventListener("mousemove",ee),window.removeEventListener("mouseup",vt),ht&&(ht.removeEventListener("touchstart",kt),ht.removeEventListener("mousedown",kt)),window.removeEventListener("touchmove",ae),window.removeEventListener("touchend",se),window.removeEventListener("touchcancel",se)}},[d,l]),Ye.useEffect(()=>{if(!d)return;let j;const I=new ZS,Dt=()=>{j=requestAnimationFrame(Dt);const R=I.getDelta(),E=I.getElapsedTime(),H=s.current;if(!H.scene)return;if(!H.locked){const xt=9*R,pt=H.player,Ht=new et(-Math.sin(pt.yaw),0,-Math.cos(pt.yaw)),ee=new et(Math.cos(pt.yaw),0,-Math.sin(pt.yaw));let vt=pt.x,Ut=pt.z;(H.keys.KeyW||H.keys.ArrowUp)&&(vt+=Ht.x*xt,Ut+=Ht.z*xt),(H.keys.KeyS||H.keys.ArrowDown)&&(vt-=Ht.x*xt,Ut-=Ht.z*xt),(H.keys.KeyA||H.keys.ArrowLeft)&&(vt-=ee.x*xt,Ut-=ee.z*xt),(H.keys.KeyD||H.keys.ArrowRight)&&(vt+=ee.x*xt,Ut+=ee.z*xt),(H.joy.x!==0||H.joy.y!==0)&&(vt+=Ht.x*xt*H.joy.y,Ut+=Ht.z*xt*H.joy.y,vt+=ee.x*xt*H.joy.x,Ut+=ee.z*xt*H.joy.x);const Vt=1.8*R,Ct=H.look;Ct.left&&(pt.yaw+=Vt),Ct.right&&(pt.yaw-=Vt),Ct.up&&(pt.pitch+=Vt),Ct.down&&(pt.pitch-=Vt),pt.pitch=Math.max(-1.535,Math.min(1.535,pt.pitch));const kt=Math.round((pt.y-1.7)/3.2),ae=Math.abs(pt.x)<=4&&pt.z<=-6&&pt.z>=-22,se=H.atriumX,Xt=H.atriumZ,O=.6,Q=se+6+32,gt=H.roomBoxes||[],It=(ze,le)=>{if(kt===0){const tn=ze>=-se-6+O&&ze<=se+6-O&&le>=-Xt-6+O&&le<=Xt+6-O,Cn=se+6-O,si=ze>=Cn-.4,Kn=2.5-O,Fn=Math.abs(le)<=Kn;if(tn&&(!si||Fn)||ze>=Cn&&ze<=Q-O&&Math.abs(le)<=Kn)return!0;const Qn=C.current>=G;for(const Mn of gt)if(Qn){if(ze>=Mn.minX&&ze<=Mn.maxX&&le>=Mn.minZ&&le<=Mn.maxZ)return!0;if(ze>=Mn.minX&&ze<=Mn.maxX){if((Mn.minZ+Mn.maxZ)/2<0){if(le>=Mn.maxZ&&le<=2.5-O)return!0}else if(le<=Mn.minZ&&le>=-2.5+O)return!0}}return!1}else{const tn=kt*1.2,si=(se-tn)*Math.cos(Math.PI/8),Kn=1.6,Fn=se+6-O,Qn=Math.sqrt(ze*ze+le*le);if(Qn>Fn)return!1;const Mn=si-Kn-O;return!(Qn<Mn)}};ae||It(vt,Ut)?(pt.x=vt,pt.z=Ut):It(vt,pt.z)?pt.x=vt:It(pt.x,Ut)&&(pt.z=Ut);const Tt=H.stair;let Qt=1.7;if(Tt)if(Math.abs(pt.x-Tt.x)<=Tt.stairWidth/2+.5&&pt.z<=Tt.zStart&&pt.z>=Tt.zStart-Tt.stepCount*Tt.stepDepth-3){const le=Tt.zStart-pt.z,tn=Tt.stepCount*Tt.stepDepth;Qt=Math.max(0,Math.min(1,le/tn))*Tt.floorHeight+1.7,le>tn&&(Qt=Tt.floorHeight+1.7)}else{const le=Math.round((pt.y-1.7)/Tt.floorHeight);Qt=Math.max(0,Math.min(Tt.numFloors-1,le))*Tt.floorHeight+1.7}pt.y+=(Qt-pt.y)*Math.min(1,12*R),H.camera.position.set(pt.x,pt.y,pt.z);const Ge=new et(-Math.sin(pt.yaw)*Math.cos(pt.pitch),Math.sin(pt.pitch),-Math.cos(pt.yaw)*Math.cos(pt.pitch));H.camera.lookAt(pt.x+Ge.x,pt.y+Ge.y,pt.z+Ge.z)}H.questionStations.forEach(xt=>{xt.userData.answered||(xt.userData.q.rotation.y+=.02,xt.userData.q.position.y=2.5+Math.sin(E*2+xt.userData.idx)*.15)});const nt=H.player,ht=nt.y<2.5;let ot=!1;H.enemies.forEach(xt=>{if(!ht){const vt=xt.userData.target.x-xt.position.x,Ut=xt.userData.target.z-xt.position.z,Vt=Math.sqrt(vt*vt+Ut*Ut);Vt<.3?xt.userData.target.set((Math.random()-.5)*50,0,(Math.random()-.5)*36):(xt.position.x+=vt/Vt*xt.userData.speed*30*R,xt.position.z+=Ut/Vt*xt.userData.speed*30*R,xt.lookAt(xt.userData.target.x,xt.position.y+1,xt.userData.target.z));return}const pt=nt.x-xt.position.x,Ht=nt.z-xt.position.z,ee=Math.sqrt(pt*pt+Ht*Ht);if(ee<9&&!H.locked)ot=!0,xt.position.x+=pt/ee*xt.userData.speed*60*R,xt.position.z+=Ht/ee*xt.userData.speed*60*R,xt.lookAt(nt.x,xt.position.y+1,nt.z);else{const vt=xt.userData.target.x-xt.position.x,Ut=xt.userData.target.z-xt.position.z,Vt=Math.sqrt(vt*vt+Ut*Ut);Vt<.3?xt.userData.target.set((Math.random()-.5)*50,0,(Math.random()-.5)*36):(xt.position.x+=vt/Vt*xt.userData.speed*30*R,xt.position.z+=Ut/Vt*xt.userData.speed*30*R,xt.lookAt(xt.userData.target.x,xt.position.y+1,xt.userData.target.z))}ee<1.3&&!H.locked&&ht&&(nt.x-=pt/ee*3,nt.z-=Ht/ee*3,M(vt=>{const Ut=vt-1;return Ut<=0&&p(!0),Ut}))}),P(ot),H.renderer.render(H.scene,H.camera)};return Dt(),()=>cancelAnimationFrame(j)},[d]),Ye.useEffect(()=>d?ln():void 0,[d,ln]),Ye.useEffect(()=>{if(!S)return;if(L.current.startedAt===0&&(L.current.startedAt=Date.now()),F<=0){k(-1);return}const j=setTimeout(()=>N(I=>I-1),1e3);return()=>clearTimeout(j)},[S,F]);const k=j=>{const I=j===S.correct,Dt=s.current.activeStation,R=L.current.startedAt||Date.now(),E=Math.max(0,(Date.now()-R)/1e3);L.current.perQuestion.push({id:S.id??null,difficulty:S.difficulty??"medium",time_taken:E,correct:I,timed_out:j===-1}),L.current.startedAt=0;const H=I?y:y-1,nt=K.current,ht=zt(nt,{correct:I,time_taken:E,timed_out:j===-1,lives_after:H});ht!==nt&&(L.current.difficultyChanges.push({from:nt,to:ht,after_question:L.current.perQuestion.length,reason:j===-1?"timeout":I?E<10?"fast_correct":"hold":"wrong"}),K.current=ht),I?(w(ot=>ot+100),W({ok:!0,msg:"✓ إجابة صحيحة! +100"}),Dt&&(Dt.userData.answered=!0,Dt.userData.q.material.emissive=new Ue(65348),Dt.userData.q.material.color=new Ue(65348))):(M(ot=>{const xt=ot-1;return xt<=0&&p(!0),xt}),W({ok:!1,msg:j===-1?"⏱ انتهى الوقت! -1 ❤":"✗ إجابة خاطئة! -1 ❤"})),D(ot=>{const xt=ot+1;return I&&xt>=10&&x(!0),xt}),setTimeout(()=>{g(null),W(null),s.current.locked=!1,s.current.activeStation=null},1400)},Rn=Ye.useRef(!1);Ye.useEffect(()=>{if(!(m||v)||Rn.current)return;Rn.current=!0;const j=L.current.perQuestion,I=j.map(ot=>ot.time_taken),Dt=j.filter(ot=>ot.correct).length,R=j.length-Dt,E=Math.round(I.reduce((ot,xt)=>ot+xt,0)),H=I.length?I.reduce((ot,xt)=>ot+xt,0)/I.length:0,nt=I.length?Math.min(...I):null,ht=I.length?Math.max(...I):null;fetch("/quiz/record-performance",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Ft,Accept:"application/json"},credentials:"same-origin",body:JSON.stringify({course_code:$,attachment_key:Pt,session_id:rt.current,total_questions:j.length,correct_answers:Dt,wrong_answers:R,lives_remaining:Math.max(0,y),total_time:E,avg_answer_time:Number(H.toFixed(2)),fastest_answer:nt,slowest_answer:ht,starting_difficulty:j[0]?.difficulty??"easy",ending_difficulty:j[j.length-1]?.difficulty??"easy",difficulty_changes:L.current.difficultyChanges,questions_answered:j})}).catch(ot=>console.warn("record-performance failed",ot))},[m,v,y,$,Pt,Ft]);const xe=()=>{h(!1),p(!1),x(!1),M(3),w(0),D(0),g(null),N(30),W(null),Nt.current={easy:[],medium:[],hard:[]},K.current="easy",L.current={startedAt:0,perQuestion:[],difficultyChanges:[]},rt.current=`game_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`,Rn.current=!1,s.current={scene:null,camera:null,renderer:null,player:{x:0,y:1.7,z:18,yaw:0,pitch:0},keys:{},enemies:[],questionStations:[],activeStation:null,locked:!1,stair:null,joy:{x:0,y:0},look:{up:!1,down:!1,left:!1,right:!1}}},Te=()=>{const j=s.current;j.player&&(j.player.x=0,j.player.y=1.7,j.player.z=18,j.player.yaw=0,j.player.pitch=0,j.joy.x=0,j.joy.y=0,j.look&&(j.look.up=j.look.down=j.look.left=j.look.right=!1),j.locked=!1,j.activeStation=null,j.camera&&(j.camera.position.set(0,1.7,18),j.camera.lookAt(0,1.7,17)))};return wt.jsxs("div",{style:{position:"relative",width:"100%",height:"100vh",background:"#f5f3ee",fontFamily:"'Tajawal', 'Cairo', system-ui, sans-serif",overflow:"hidden",touchAction:"none",userSelect:"none",WebkitUserSelect:"none",WebkitTouchCallout:"none"},children:[wt.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&family=Amiri:wght@700&display=swap",rel:"stylesheet"}),wt.jsx("div",{ref:o,style:{width:"100%",height:"100%",cursor:d?"none":"default"}}),!d&&!m&&!v&&wt.jsxs("div",{style:{position:"absolute",inset:0,color:"#1f2937",textAlign:"center",touchAction:"auto",overflow:"hidden",zIndex:100},children:[wt.jsx("style",{children:`
            @keyframes qu-rise   { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
            @keyframes qu-pulse  { 0%,100% { box-shadow: 0 10px 30px rgba(0,108,53,.18), 0 0 0 6px rgba(0,108,53,.05) }
                                   50%     { box-shadow: 0 14px 40px rgba(0,108,53,.28), 0 0 0 10px rgba(0,108,53,.07) } }
            .qu-start-cta { transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease; }
            .qu-start-cta:hover  { transform: translateY(-2px); filter: brightness(1.05); box-shadow: 0 14px 32px rgba(0,108,53,.28), inset 0 1px 0 rgba(255,255,255,.2); }
            .qu-start-cta:active { transform: translateY(0); filter: brightness(.96); }
            .qu-controls { animation: qu-rise 600ms ease 200ms both; }
            .qu-title    { animation: qu-rise 600ms ease 60ms both; }
            .qu-cta      { animation: qu-rise 600ms ease 120ms both; }
          `}),wt.jsx("div",{style:{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 55% at 50% 0%, rgba(0,108,53,0.10), transparent 60%),linear-gradient(180deg, #ffffff 0%, #f7f5ef 60%, #efece4 100%)"}}),wt.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,height:4,background:"linear-gradient(90deg, transparent, #006c35 50%, transparent)",opacity:.7,pointerEvents:"none"}}),wt.jsxs("div",{style:{position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"clamp(20px, 4vh, 40px)",height:"100%",padding:"max(28px, 4vh) 24px",fontFamily:"'Tajawal', 'Cairo', system-ui, sans-serif"},children:[wt.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&family=Amiri:wght@700&display=swap",rel:"stylesheet"}),wt.jsxs("div",{className:"qu-title",children:[wt.jsx("div",{style:{width:104,height:104,borderRadius:"50%",margin:"0 auto 22px",background:"linear-gradient(135deg, #006c35 0%, #00854a 70%)",border:"1px solid rgba(0,108,53,0.25)",display:"grid",placeItems:"center",animation:"qu-pulse 4s ease-in-out infinite"},children:wt.jsx("span",{style:{fontFamily:"Amiri, serif",fontSize:36,fontWeight:700,color:"#fff"},children:"QU"})}),wt.jsx("h1",{style:{fontFamily:"Amiri, serif",fontSize:"clamp(40px, 7vw, 84px)",fontWeight:700,color:"#0d2e1c",margin:"0 0 14px",letterSpacing:2},children:"جامعة القصيم"}),wt.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:10,fontSize:"clamp(11px, 1.5vw, 13px)",color:"#006c35",fontWeight:800,background:"#fff",border:"1px solid rgba(0,108,53,0.18)",padding:"6px 18px",borderRadius:999,letterSpacing:1.6,boxShadow:"0 1px 2px rgba(0,0,0,0.04)"},children:[wt.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:"#006c35"}}),"QASSIM UNIVERSITY · QU QUEST",wt.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:"#006c35"}})]})]}),wt.jsxs("div",{className:"qu-cta",style:{display:"flex",flexDirection:"column",alignItems:"center",gap:18},children:[wt.jsx("button",{className:"qu-start-cta",onClick:()=>h(!0),onTouchEnd:j=>{j.preventDefault(),h(!0)},style:{background:"linear-gradient(135deg, #006c35, #00854a)",color:"white",border:"1px solid rgba(0,108,53,0.4)",padding:"16px 56px",fontSize:"clamp(16px, 4vw, 22px)",fontWeight:800,borderRadius:8,cursor:"pointer",letterSpacing:1.6,boxShadow:"0 10px 24px rgba(0,108,53,0.22), inset 0 1px 0 rgba(255,255,255,0.18)"},children:"ابدأ اللعبة · START GAME"}),wt.jsxs("div",{className:"qu-controls",style:{background:"#ffffff",border:"1px solid rgba(15,23,42,0.08)",borderRadius:12,padding:"14px 20px",maxWidth:520,width:"92%",boxSizing:"border-box",boxShadow:"0 4px 16px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)"},children:[wt.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10,fontSize:"clamp(11px, 2.4vw, 12px)",color:"#6b7280",fontWeight:700,letterSpacing:1.2,textTransform:"uppercase"},children:[wt.jsx("span",{style:{width:18,height:1,background:"rgba(15,23,42,0.15)"}}),l?"التحكم باللمس · TOUCH CONTROLS":"التحكم · CONTROLS",wt.jsx("span",{style:{width:18,height:1,background:"rgba(15,23,42,0.15)"}})]}),wt.jsx("div",{style:{display:"grid",gap:6,fontSize:"clamp(11px, 2.4vw, 13px)",color:"#374151",textAlign:"left"},children:l?wt.jsxs(wt.Fragment,{children:[wt.jsxs("div",{children:[wt.jsx("kbd",{style:qi,children:"عصا"})," Move with joystick / تحرّك"]}),wt.jsxs("div",{children:[wt.jsx("kbd",{style:qi,children:"اسحب"})," Drag screen to look / النظر"]}),wt.jsxs("div",{children:[wt.jsx("kbd",{style:qi,children:"تفاعل"})," Tap green button / تفاعل"]}),wt.jsxs("div",{children:[wt.jsx("kbd",{style:qi,children:"درج"})," Walk into stairs to climb"]}),wt.jsxs("div",{children:[wt.jsx("kbd",{style:qi,children:"↻"}),' "عُد للبداية" if stuck / إذا علقت']})]}):wt.jsxs(wt.Fragment,{children:[wt.jsxs("div",{children:[wt.jsx("kbd",{style:qi,children:"W A S D"})," Move / تحرّك"]}),wt.jsxs("div",{children:[wt.jsx("kbd",{style:qi,children:"Mouse"})," Move mouse to look / النظر"]}),wt.jsxs("div",{children:[wt.jsx("kbd",{style:qi,children:"E"})," Interact / تفاعل"]}),wt.jsxs("div",{children:[wt.jsx("kbd",{style:qi,children:"R"})," Respawn if stuck / عُد للبداية"]}),wt.jsxs("div",{children:[wt.jsx("kbd",{style:qi,children:"Stairs"})," Walk into them / امشي للدرج"]})]})})]})]})]})]}),d&&!m&&!v&&wt.jsxs(wt.Fragment,{children:[l&&wt.jsx("div",{ref:i,style:{position:"absolute",inset:0,zIndex:1,touchAction:"none"}}),wt.jsx("div",{style:{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg, rgba(0,108,53,0.85), rgba(0,133,74,0.85))",color:"#fff",padding:"5px 14px",borderRadius:4,fontSize:"clamp(10px, 2.5vw, 13px)",fontWeight:700,letterSpacing:1.2,pointerEvents:"none",zIndex:5,border:"1px solid rgba(217,199,154,0.4)",backdropFilter:"blur(4px)",whiteSpace:"nowrap"},children:"جامعة القصيم · QASSIM UNIVERSITY"}),wt.jsxs("div",{style:{position:"absolute",top:50,left:12,right:12,display:"flex",justifyContent:"space-between",alignItems:"center",pointerEvents:"none",zIndex:5},children:[wt.jsx("div",{style:D_,children:wt.jsxs("span",{style:{color:"#ff6b6b",fontSize:"clamp(16px, 4vw, 22px)"},children:["❤".repeat(Math.max(0,y)),wt.jsx("span",{style:{color:"#444"},children:"❤".repeat(3-Math.max(0,y))})]})}),wt.jsx("div",{style:D_,children:wt.jsxs("span",{style:{color:"#d9c79a",fontWeight:700,fontSize:"clamp(11px, 2.8vw, 14px)"},children:[q,"/10 ✦ ",T," pts"]})})]}),wt.jsxs("button",{onClick:Te,onTouchEnd:j=>{j.preventDefault(),Te()},title:"عُد لنقطة البداية / Return to spawn",style:{position:"absolute",top:95,right:12,background:"rgba(20,15,10,0.75)",border:"1px solid rgba(217,199,154,0.4)",color:"#d9c79a",padding:"6px 12px",borderRadius:4,fontSize:"clamp(10px, 2.4vw, 12px)",fontWeight:700,cursor:"pointer",zIndex:10,backdropFilter:"blur(4px)",fontFamily:"inherit",touchAction:"manipulation",display:"flex",alignItems:"center",gap:6},children:[wt.jsx("span",{style:{fontSize:"1.2em"},children:"↻"}),wt.jsx("span",{children:"عُد للبداية"})]}),!l&&wt.jsxs("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:24,height:24,pointerEvents:"none",zIndex:5},children:[wt.jsx("div",{style:U_("h")}),wt.jsx("div",{style:U_("v")})]}),l&&wt.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:8,height:8,borderRadius:"50%",background:"rgba(0,108,53,0.7)",border:"2px solid rgba(255,255,255,0.5)",pointerEvents:"none",zIndex:5}}),V&&wt.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -120%)",background:"rgba(178,34,34,0.85)",color:"white",padding:"8px 24px",borderRadius:4,fontWeight:700,animation:"pulse 0.6s ease-in-out infinite",pointerEvents:"none",zIndex:5,fontSize:"clamp(11px, 2.8vw, 14px)"},children:"⚠ GUARD APPROACHING — حذر"}),!l&&wt.jsxs("div",{style:{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",color:"#d9c79a",fontSize:14,pointerEvents:"none",zIndex:5,textAlign:"center",background:"rgba(20,15,10,0.78)",border:"1px solid rgba(217,199,154,0.4)",borderRadius:8,padding:"10px 18px",backdropFilter:"blur(6px)",boxShadow:"0 4px 14px rgba(0,0,0,0.45)",maxWidth:"90vw"},children:[wt.jsxs("div",{children:["اقترب من صندوق الأسئلة واضغط ",wt.jsx("kbd",{style:qi,children:"E"})]}),q<G?wt.jsxs("div",{style:{fontSize:12,marginTop:6,color:"#ffd97a",fontWeight:700},children:["🔒 أجب على ",G-q," ",G-q===1?"سؤال":"أسئلة"," في الساحة لفتح القاعات",wt.jsx("br",{}),"Answer ",G-q," more in the atrium to unlock the rooms"]}):wt.jsxs("div",{style:{fontSize:12,marginTop:4,color:"#a7e8a7",fontWeight:700},children:["✅ القاعات مفتوحة · توجّه شرقاً ثم ادخل من أي باب جانبي",wt.jsx("br",{}),"Rooms unlocked — head east, then enter any side door"]})]}),l&&wt.jsxs(wt.Fragment,{children:[wt.jsxs("div",{ref:e,style:{position:"absolute",bottom:30,left:30,width:120,height:120,borderRadius:"50%",background:"rgba(20,15,10,0.55)",border:"2px solid rgba(217,199,154,0.5)",touchAction:"none",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"},children:[wt.jsx("div",{"data-knob":!0,style:{width:50,height:50,borderRadius:"50%",background:"linear-gradient(135deg, #006c35, #00854a)",border:"2px solid rgba(217,199,154,0.7)",pointerEvents:"none",boxShadow:"0 4px 12px rgba(0,0,0,0.4)"}}),wt.jsxs("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",color:"rgba(217,199,154,0.3)",fontSize:11,fontWeight:700},children:[wt.jsx("div",{style:{position:"absolute",top:4},children:"↑"}),wt.jsx("div",{style:{position:"absolute",bottom:4},children:"↓"}),wt.jsx("div",{style:{position:"absolute",left:6},children:"←"}),wt.jsx("div",{style:{position:"absolute",right:6},children:"→"})]})]}),wt.jsx("div",{style:{position:"absolute",bottom:8,left:30,width:120,textAlign:"center",color:"#d9c79a",fontSize:10,fontWeight:700,pointerEvents:"none",zIndex:10,opacity:.7},children:"تحرّك / MOVE"}),wt.jsx("button",{onTouchStart:j=>{j.preventDefault(),s.current.tryInteract?.()},onClick:j=>{j.preventDefault(),s.current.tryInteract?.()},style:{position:"absolute",bottom:30,right:30,width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg, #006c35, #00a050)",border:"2px solid rgba(217,199,154,0.7)",color:"white",fontSize:22,fontWeight:700,cursor:"pointer",zIndex:10,boxShadow:"0 4px 12px rgba(0,108,53,0.5)",touchAction:"none",fontFamily:"inherit"},children:"تفاعل"}),(()=>{const j=E=>H=>{H.preventDefault(),s.current.look&&(s.current.look[E]=!0)},I=E=>H=>{H.preventDefault(),s.current.look&&(s.current.look[E]=!1)},Dt={position:"absolute",width:44,height:44,borderRadius:"50%",background:"rgba(20,15,10,0.7)",border:"2px solid rgba(217,199,154,0.6)",color:"#d9c79a",fontSize:20,fontWeight:700,cursor:"pointer",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center",userSelect:"none",touchAction:"none",fontFamily:"inherit",padding:0},R=(E,H,nt)=>wt.jsx("button",{onMouseDown:j(E),onMouseUp:I(E),onMouseLeave:I(E),onTouchStart:j(E),onTouchEnd:I(E),onTouchCancel:I(E),onContextMenu:ht=>ht.preventDefault(),style:{...Dt,...nt},"aria-label":`look ${E}`,children:H},E);return wt.jsxs("div",{style:{position:"absolute",bottom:120,right:30,width:140,height:140,zIndex:10},children:[R("up","↑",{top:0,left:48}),R("left","←",{top:48,left:0}),R("right","→",{top:48,right:0}),R("down","↓",{bottom:0,left:48}),wt.jsxs("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",color:"rgba(217,199,154,0.5)",fontSize:9,fontWeight:700},children:["LOOK",wt.jsx("br",{}),"النظر"]})]})})()]})]}),S&&wt.jsx("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",justifyContent:"center",alignItems:"center",padding:24,backdropFilter:"blur(4px)",touchAction:"auto",zIndex:100},children:wt.jsxs("div",{style:{background:"linear-gradient(180deg, #1f1810, #2a1f15)",border:"1px solid rgba(0,108,53,0.5)",borderRadius:8,padding:"clamp(16px, 4vw, 32px)",maxWidth:600,width:"100%",maxHeight:"90vh",overflowY:"auto",color:"#f5e9d4",boxShadow:"0 20px 60px rgba(0,0,0,0.6)",touchAction:"auto"},children:[wt.jsx("div",{style:{fontSize:11,color:"#006c35",fontWeight:700,letterSpacing:1.5,marginBottom:12},children:"QU QUEST · جامعة القصيم"}),wt.jsx("div",{style:{height:6,background:"#2a1f15",borderRadius:3,overflow:"hidden",marginBottom:20},children:wt.jsx("div",{style:{height:"100%",width:`${F/30*100}%`,background:F>10?"linear-gradient(90deg, #006c35, #00a050)":"linear-gradient(90deg, #b22222, #ff4444)",transition:"width 1s linear"}})}),wt.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:14,fontSize:"clamp(12px, 3vw, 14px)",color:"#b8a878"},children:[wt.jsxs("span",{children:["سؤال ",q+1," / 10"]}),wt.jsxs("span",{style:{color:F<=10?"#ff6b6b":"#d9c79a",fontWeight:700},children:["⏱ ",F,"s"]})]}),(()=>{const j=S.difficulty||"medium",I={easy:{label:"سهل",bg:"rgba(0,108,53,0.25)",fg:"#3ecf7a",bd:"rgba(0,160,80,0.5)"},medium:{label:"متوسط",bg:"rgba(217,164,45,0.25)",fg:"#e6b94a",bd:"rgba(217,164,45,0.55)"},hard:{label:"صعب",bg:"rgba(178,34,34,0.25)",fg:"#ff6b6b",bd:"rgba(255,107,107,0.55)"}}[j]||{label:j,bg:"rgba(217,199,154,0.12)",fg:"#d9c79a",bd:"rgba(217,199,154,0.35)"};return wt.jsx("div",{style:{marginBottom:10,direction:"rtl"},children:wt.jsx("span",{style:{display:"inline-block",padding:"3px 10px",borderRadius:999,fontSize:"clamp(11px, 2.5vw, 13px)",fontWeight:700,background:I.bg,color:I.fg,border:`1px solid ${I.bd}`,letterSpacing:.3},children:I.label})})})(),wt.jsx("div",{style:{fontSize:"clamp(18px, 4.5vw, 24px)",fontWeight:700,marginBottom:8,fontFamily:"Amiri, serif",lineHeight:1.4,direction:"rtl"},children:S.q}),wt.jsx("div",{style:{fontSize:"clamp(12px, 3vw, 14px)",color:"#b8a878",marginBottom:20,fontStyle:"italic"},children:S.qEn}),wt.jsx("div",{style:{display:"grid",gap:8},children:S.options.map((j,I)=>wt.jsxs("button",{onClick:()=>!U&&k(I),onTouchEnd:Dt=>{Dt.preventDefault(),U||k(I)},disabled:!!U,style:{background:U&&I===S.correct?"rgba(0,108,53,0.4)":U&&!U.ok&&I!==S.correct?"rgba(178,34,34,0.2)":"rgba(217,199,154,0.08)",border:"1px solid rgba(217,199,154,0.3)",color:"#f5e9d4",padding:"12px 16px",fontSize:"clamp(15px, 3.5vw, 18px)",borderRadius:4,cursor:U?"default":"pointer",textAlign:"right",direction:"rtl",fontFamily:"inherit",transition:"all 0.2s"},onMouseEnter:Dt=>{U||(Dt.currentTarget.style.background="rgba(0,108,53,0.18)")},onMouseLeave:Dt=>{U||(Dt.currentTarget.style.background="rgba(217,199,154,0.08)")},children:[wt.jsxs("span",{style:{color:"#006c35",marginLeft:8,fontWeight:700},children:[["أ","ب","ج","د"][I],"."]}),j]},I))}),U&&wt.jsx("div",{style:{marginTop:16,padding:12,background:U.ok?"rgba(0,108,53,0.3)":"rgba(178,34,34,0.3)",borderRadius:4,textAlign:"center",fontWeight:700,fontSize:"clamp(15px, 3.5vw, 18px)"},children:U.msg})]})}),(m||v)&&wt.jsxs("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",color:"#f5e9d4",textAlign:"center",padding:24,touchAction:"auto",zIndex:100},children:[wt.jsx("div",{style:{fontFamily:"Amiri, serif",fontSize:64,fontWeight:700,color:v?"#006c35":"#b22222",marginBottom:16},children:v?"🏆 مبروك!":"💀 انتهت اللعبة"}),wt.jsx("div",{style:{fontSize:20,marginBottom:8},children:v?"You completed QU Quest!":"Game Over"}),wt.jsxs("div",{style:{fontSize:24,color:"#d9c79a",marginBottom:32},children:["النقاط النهائية: ",T]}),wt.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",alignItems:"center"},children:[wt.jsx("button",{onClick:xe,onTouchEnd:j=>{j.preventDefault(),xe()},style:{background:"linear-gradient(135deg, #006c35, #00854a)",color:"white",border:"none",padding:"14px 32px",fontSize:18,fontWeight:700,borderRadius:8,cursor:"pointer",boxShadow:"0 6px 14px -4px rgba(0,108,53,0.5)"},children:"إعادة / PLAY AGAIN"}),wt.jsx("button",{onClick:()=>{window.location.href=`/courses/${tt??$}`},onTouchEnd:j=>{j.preventDefault(),window.location.href=`/courses/${tt??$}`},style:{background:"linear-gradient(135deg, #1f2937, #374151)",color:"#f5e9d4",border:"1px solid rgba(217,199,154,0.4)",padding:"14px 32px",fontSize:18,fontWeight:700,borderRadius:8,cursor:"pointer",boxShadow:"0 6px 14px -4px rgba(0,0,0,0.5)"},children:"← العودة إلى المقرر / BACK TO COURSE"})]})]}),wt.jsx("style",{children:`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        kbd { font-family: inherit; }
      `})]})}const D_={background:"rgba(20,15,10,0.7)",border:"1px solid rgba(0,108,53,0.4)",padding:"8px 16px",borderRadius:4,backdropFilter:"blur(4px)"},qi={background:"#f3f4f6",border:"1px solid rgba(15,23,42,0.12)",borderBottomWidth:2,padding:"2px 8px",borderRadius:4,fontSize:12,fontWeight:700,color:"#0d2e1c",margin:"0 4px",fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace"},U_=o=>({position:"absolute",background:"rgba(0,108,53,0.85)",...o==="h"?{top:"50%",left:0,right:0,height:2,transform:"translateY(-50%)"}:{left:"50%",top:0,bottom:0,width:2,transform:"translateX(-50%)"}});function OT(){return wt.jsx("div",{className:"App",children:wt.jsx(NT,{})})}Ty.createRoot(document.getElementById("root")).render(wt.jsx(Ye.StrictMode,{children:wt.jsx(OT,{})}));
