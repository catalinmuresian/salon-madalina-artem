import{a as r,c as _,h as i,g as I,r as O,x as S,y as A,z as le,A as ue,o as ie,T as se,B as oe,C as re}from"./index.3b052c21.js";import{h as ce,b as T}from"./render.2bc86737.js";import{u as de,a as ve,R as fe}from"./use-router-link.43b11456.js";const P={xs:18,sm:24,md:32,lg:38,xl:46},W={size:String};function U(e,u=P){return r(()=>e.size!==void 0?{fontSize:e.size in u?`${u[e.size]}px`:e.size}:null)}const Q="0 0 24 24",K=e=>e,M=e=>`ionicons ${e}`,V={"mdi-":e=>`mdi ${e}`,"icon-":K,"bt-":e=>`bt ${e}`,"eva-":e=>`eva ${e}`,"ion-md":M,"ion-ios":M,"ion-logo":M,"iconfont ":K,"ti-":e=>`themify-icon ${e}`,"bi-":e=>`bootstrap-icons ${e}`},H={o_:"-outlined",r_:"-round",s_:"-sharp"},X={sym_o_:"-outlined",sym_r_:"-rounded",sym_s_:"-sharp"},ge=new RegExp("^("+Object.keys(V).join("|")+")"),be=new RegExp("^("+Object.keys(H).join("|")+")"),N=new RegExp("^("+Object.keys(X).join("|")+")"),me=/^[Mm]\s?[-+]?\.?\d/,he=/^img:/,ye=/^svguse:/,ke=/^ion-/,xe=/^(fa-(classic|sharp|solid|regular|light|brands|duotone|thin)|[lf]a[srlbdk]?) /;var F=_({name:"QIcon",props:{...W,tag:{type:String,default:"i"},name:String,color:String,left:Boolean,right:Boolean},setup(e,{slots:u}){const{proxy:{$q:v}}=I(),x=U(e),q=r(()=>"q-icon"+(e.left===!0?" on-left":"")+(e.right===!0?" on-right":"")+(e.color!==void 0?` text-${e.color}`:"")),d=r(()=>{let c,a=e.name;if(a==="none"||!a)return{none:!0};if(v.iconMapFn!==null){const s=v.iconMapFn(a);if(s!==void 0)if(s.icon!==void 0){if(a=s.icon,a==="none"||!a)return{none:!0}}else return{cls:s.cls,content:s.content!==void 0?s.content:" "}}if(me.test(a)===!0){const[s,h=Q]=a.split("|");return{svg:!0,viewBox:h,nodes:s.split("&&").map(n=>{const[B,g,k]=n.split("@@");return i("path",{style:g,d:B,transform:k})})}}if(he.test(a)===!0)return{img:!0,src:a.substring(4)};if(ye.test(a)===!0){const[s,h=Q]=a.split("|");return{svguse:!0,src:s.substring(7),viewBox:h}}let y=" ";const E=a.match(ge);if(E!==null)c=V[E[1]](a);else if(xe.test(a)===!0)c=a;else if(ke.test(a)===!0)c=`ionicons ion-${v.platform.is.ios===!0?"ios":"md"}${a.substring(3)}`;else if(N.test(a)===!0){c="notranslate material-symbols";const s=a.match(N);s!==null&&(a=a.substring(6),c+=X[s[1]]),y=a}else{c="notranslate material-icons";const s=a.match(be);s!==null&&(a=a.substring(2),c+=H[s[1]]),y=a}return{cls:c,content:y}});return()=>{const c={class:q.value,style:x.value,"aria-hidden":"true",role:"presentation"};return d.value.none===!0?i(e.tag,c,ce(u.default)):d.value.img===!0?i(e.tag,c,T(u.default,[i("img",{src:d.value.src})])):d.value.svg===!0?i(e.tag,c,T(u.default,[i("svg",{viewBox:d.value.viewBox||"0 0 24 24"},d.value.nodes)])):d.value.svguse===!0?i(e.tag,c,T(u.default,[i("svg",{viewBox:d.value.viewBox},[i("use",{"xlink:href":d.value.src})])])):(d.value.cls!==void 0&&(c.class+=" "+d.value.cls),i(e.tag,c,T(u.default,[d.value.content])))}}});const qe={size:{type:[String,Number],default:"1em"},color:String};function Ee(e){return{cSize:r(()=>e.size in P?`${P[e.size]}px`:e.size),classes:r(()=>"q-spinner"+(e.color?` text-${e.color}`:""))}}var Be=_({name:"QSpinner",props:{...qe,thickness:{type:Number,default:5}},setup(e){const{cSize:u,classes:v}=Ee(e);return()=>i("svg",{class:v.value+" q-spinner-mat",width:u.value,height:u.value,viewBox:"25 25 50 50"},[i("circle",{class:"path",cx:"50",cy:"50",r:"20",fill:"none",stroke:"currentColor","stroke-width":e.thickness,"stroke-miterlimit":"10"})])}});const G={left:"start",center:"center",right:"end",between:"between",around:"around",evenly:"evenly",stretch:"stretch"},Se=Object.keys(G),we={align:{type:String,validator:e=>Se.includes(e)}};function Re(e){return r(()=>{const u=e.align===void 0?e.vertical===!0?"stretch":"left":e.align;return`${e.vertical===!0?"items":"justify"}-${G[u]}`})}const D={none:0,xs:4,sm:8,md:16,lg:24,xl:32},Le={xs:8,sm:10,md:14,lg:20,xl:24},$e=["button","submit","reset"],Ce=/[^\s]\/[^\s]/,Te=["flat","outline","push","unelevated"];function ze(e,u){return e.flat===!0?"flat":e.outline===!0?"outline":e.push===!0?"push":e.unelevated===!0?"unelevated":u}const Me={...W,...de,type:{type:String,default:"button"},label:[Number,String],icon:String,iconRight:String,...Te.reduce((e,u)=>(e[u]=Boolean)&&e,{}),square:Boolean,rounded:Boolean,glossy:Boolean,size:String,fab:Boolean,fabMini:Boolean,padding:String,color:String,textColor:String,noCaps:Boolean,noWrap:Boolean,dense:Boolean,tabindex:[Number,String],ripple:{type:[Boolean,Object],default:!0},align:{...we.align,default:"center"},stack:Boolean,stretch:Boolean,loading:{type:Boolean,default:null},disable:Boolean},Pe={...Me,round:Boolean};function _e(e){const u=U(e,Le),v=Re(e),{hasRouterLink:x,hasLink:q,linkTag:d,linkAttrs:c,navigateOnClick:a}=ve({fallbackTag:"button"}),y=r(()=>{const l=e.fab===!1&&e.fabMini===!1?u.value:{};return e.padding!==void 0?Object.assign({},l,{padding:e.padding.split(/\s+/).map(m=>m in D?D[m]+"px":m).join(" "),minWidth:"0",minHeight:"0"}):l}),E=r(()=>e.rounded===!0||e.fab===!0||e.fabMini===!0),s=r(()=>e.disable!==!0&&e.loading!==!0),h=r(()=>s.value===!0?e.tabindex||0:-1),n=r(()=>ze(e,"standard")),B=r(()=>{const l={tabindex:h.value};return q.value===!0?Object.assign(l,c.value):$e.includes(e.type)===!0&&(l.type=e.type),d.value==="a"?(e.disable===!0?l["aria-disabled"]="true":l.href===void 0&&(l.role="button"),x.value!==!0&&Ce.test(e.type)===!0&&(l.type=e.type)):e.disable===!0&&(l.disabled="",l["aria-disabled"]="true"),e.loading===!0&&e.percentage!==void 0&&Object.assign(l,{role:"progressbar","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":e.percentage}),l}),g=r(()=>{let l;e.color!==void 0?e.flat===!0||e.outline===!0?l=`text-${e.textColor||e.color}`:l=`bg-${e.color} text-${e.textColor||"white"}`:e.textColor&&(l=`text-${e.textColor}`);const m=e.round===!0?"round":`rectangle${E.value===!0?" q-btn--rounded":e.square===!0?" q-btn--square":""}`;return`q-btn--${n.value} q-btn--${m}`+(l!==void 0?" "+l:"")+(s.value===!0?" q-btn--actionable q-focusable q-hoverable":e.disable===!0?" disabled":"")+(e.fab===!0?" q-btn--fab":e.fabMini===!0?" q-btn--fab-mini":"")+(e.noCaps===!0?" q-btn--no-uppercase":"")+(e.dense===!0?" q-btn--dense":"")+(e.stretch===!0?" no-border-radius self-stretch":"")+(e.glossy===!0?" glossy":"")+(e.square?" q-btn--square":"")}),k=r(()=>v.value+(e.stack===!0?" column":" row")+(e.noWrap===!0?" no-wrap text-no-wrap":"")+(e.loading===!0?" q-btn__content--hidden":""));return{classes:g,style:y,innerClasses:k,attributes:B,hasLink:q,linkTag:d,navigateOnClick:a,isActionable:s}}const{passiveCapture:f}=re;let w=null,R=null,L=null;var Qe=_({name:"QBtn",props:{...Pe,percentage:Number,darkPercentage:Boolean,onTouchstart:[Function,Array]},emits:["click","keydown","mousedown","keyup"],setup(e,{slots:u,emit:v}){const{proxy:x}=I(),{classes:q,style:d,innerClasses:c,attributes:a,hasLink:y,linkTag:E,navigateOnClick:s,isActionable:h}=_e(e),n=O(null),B=O(null);let g=null,k,l=null;const m=r(()=>e.label!==void 0&&e.label!==null&&e.label!==""),J=r(()=>e.disable===!0||e.ripple===!1?!1:{keyCodes:y.value===!0?[13,32]:[13],...e.ripple===!0?{}:e.ripple}),Y=r(()=>({center:e.round})),Z=r(()=>{const t=Math.max(0,Math.min(100,e.percentage));return t>0?{transition:"transform 0.6s",transform:`translateX(${t-100}%)`}:{}}),p=r(()=>{if(e.loading===!0)return{onMousedown:C,onTouchstart:C,onClick:C,onKeydown:C,onKeyup:C};if(h.value===!0){const t={onClick:j,onKeydown:te,onMousedown:ae};if(x.$q.platform.has.touch===!0){const o=e.onTouchstart!==void 0?"":"Passive";t[`onTouchstart${o}`]=ne}return t}return{onClick:S}}),ee=r(()=>({ref:n,class:"q-btn q-btn-item non-selectable no-outline "+q.value,style:d.value,...a.value,...p.value}));function j(t){if(n.value!==null){if(t!==void 0){if(t.defaultPrevented===!0)return;const o=document.activeElement;if(e.type==="submit"&&o!==document.body&&n.value.contains(o)===!1&&o.contains(n.value)===!1){n.value.focus();const z=()=>{document.removeEventListener("keydown",S,!0),document.removeEventListener("keyup",z,f),n.value!==null&&n.value.removeEventListener("blur",z,f)};document.addEventListener("keydown",S,!0),document.addEventListener("keyup",z,f),n.value.addEventListener("blur",z,f)}}s(t)}}function te(t){n.value!==null&&(v("keydown",t),A(t,[13,32])===!0&&R!==n.value&&(R!==null&&$(),t.defaultPrevented!==!0&&(n.value.focus(),R=n.value,n.value.classList.add("q-btn--active"),document.addEventListener("keyup",b,!0),n.value.addEventListener("blur",b,f)),S(t)))}function ne(t){n.value!==null&&(v("touchstart",t),t.defaultPrevented!==!0&&(w!==n.value&&(w!==null&&$(),w=n.value,g=t.target,g.addEventListener("touchcancel",b,f),g.addEventListener("touchend",b,f)),k=!0,l!==null&&clearTimeout(l),l=setTimeout(()=>{l=null,k=!1},200)))}function ae(t){n.value!==null&&(t.qSkipRipple=k===!0,v("mousedown",t),t.defaultPrevented!==!0&&L!==n.value&&(L!==null&&$(),L=n.value,n.value.classList.add("q-btn--active"),document.addEventListener("mouseup",b,f)))}function b(t){if(n.value!==null&&!(t!==void 0&&t.type==="blur"&&document.activeElement===n.value)){if(t!==void 0&&t.type==="keyup"){if(R===n.value&&A(t,[13,32])===!0){const o=new MouseEvent("click",t);o.qKeyEvent=!0,t.defaultPrevented===!0&&le(o),t.cancelBubble===!0&&ue(o),n.value.dispatchEvent(o),S(t),t.qKeyEvent=!0}v("keyup",t)}$()}}function $(t){const o=B.value;t!==!0&&(w===n.value||L===n.value)&&o!==null&&o!==document.activeElement&&(o.setAttribute("tabindex",-1),o.focus()),w===n.value&&(g!==null&&(g.removeEventListener("touchcancel",b,f),g.removeEventListener("touchend",b,f)),w=g=null),L===n.value&&(document.removeEventListener("mouseup",b,f),L=null),R===n.value&&(document.removeEventListener("keyup",b,!0),n.value!==null&&n.value.removeEventListener("blur",b,f),R=null),n.value!==null&&n.value.classList.remove("q-btn--active")}function C(t){S(t),t.qSkipRipple=!0}return ie(()=>{$(!0)}),Object.assign(x,{click:t=>{h.value===!0&&j(t)}}),()=>{let t=[];e.icon!==void 0&&t.push(i(F,{name:e.icon,left:e.stack!==!0&&m.value===!0,role:"img"})),m.value===!0&&t.push(i("span",{class:"block"},[e.label])),t=T(u.default,t),e.iconRight!==void 0&&e.round===!1&&t.push(i(F,{name:e.iconRight,right:e.stack!==!0&&m.value===!0,role:"img"}));const o=[i("span",{class:"q-focus-helper",ref:B})];return e.loading===!0&&e.percentage!==void 0&&o.push(i("span",{class:"q-btn__progress absolute-full overflow-hidden"+(e.darkPercentage===!0?" q-btn__progress--dark":"")},[i("span",{class:"q-btn__progress-indicator fit block",style:Z.value})])),o.push(i("span",{class:"q-btn__content text-center col items-center q-anchor--skip "+c.value},t)),e.loading!==null&&o.push(i(se,{name:"q-transition--fade"},()=>e.loading===!0?[i("span",{key:"loading",class:"absolute-full flex flex-center"},u.loading!==void 0?u.loading():[i(Be)])]:null)),oe(i(E.value,ee.value,o),[[fe,J.value,void 0,Y.value]])}}});export{Qe as Q,F as a,Be as b,U as c,W as u};
