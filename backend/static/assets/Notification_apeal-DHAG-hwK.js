import{A as G,r as u,o as H,G as O,a as w,b as n,c as g,d as v,w as y,f as t,t as r,D as Q,h as J,u as K,i as F,e as a,q as m,l as x,j as T,k as I,F as S,g as L,s as U,v as W}from"./index-BTxt8QXF.js";import{_ as X}from"./editapeals-jLKbMa-J.js";const Y={__name:"reversecountdown",props:{startDate:{type:String,required:!0}},setup(z){const h=z,q=G(()=>new Date(h.startDate).getTime()),_=u(""),c=()=>{const f=new Date().getTime()-q.value;if(f<0){_.value="hali vaqt mavjud",clearInterval(p);return}const l=Math.floor(f/(1e3*60*60*24)),b=Math.floor(f%(1e3*60*60*24)/(1e3*60*60)),C=Math.floor(f%(1e3*60*60)/(1e3*60)),$=Math.floor(f%(1e3*60)/1e3);_.value=`${l} kun ${b} : ${C} : ${$}s`};let p;return H(()=>{c(),p=setInterval(c,1e3)}),O(()=>{clearInterval(p)}),(M,f)=>{const l=w("n-tag");return n(),g("div",null,[v(l,{type:"error"},{default:y(()=>[t("p",null,r(_.value),1)]),_:1})])}}},Z={class:"overflow-x-auto custom-scroll pb-[50px]"},tt=t("p",{class:"text-lg"},[t("span",{class:"text-[20px] font-bold"}," Qayta ko'rilmagan murojaatlar ")],-1),et={class:"mx-auto select-auto mt-5 w-full lg:w-[1200px] items-center gap-4 flex flex-col"},at={class:"container overflow-x-clip"},st=t("thead",null,[t("tr",null,[t("th",null,"№"),t("th",null,[t("div",{class:"text-center"}," F.I ")]),t("th",null,[t("div",{class:"text-center"},"Telefon raqami ")]),t("th",{class:"flex justify-center"},"Tasnifi"),t("th",{class:"text-center"},[t("div",{class:"text-center"},"Holati")]),t("th",{class:"text-center"},[t("div",{class:"text-center"},"Vaqti")]),t("th",{class:"text-center"},"Tahrirlash"),t("th",{class:"text-center"},"Qayta ko'rish"),t("th",{class:"text-center"},[t("div",{class:"text-red-600"},"O'chirish")])])],-1),nt={class:"text-justify ps-4 font-bold"},lt={class:"text-center select-text"},ot={class:"text-center"},rt={class:"text-center"},ct={class:"text-center"},it={class:"flex justify-center"},dt=t("i",{class:"fas fa-pen"},null,-1),ut={key:0},ht={key:1},_t={class:"flex justify-center"},pt=t("i",{class:"far fa-trash-can"},null,-1),ft=t("thead",null,[t("tr",null,[t("th",null,"№"),t("th",null,[t("div",{class:"text-center"}," F.I ")]),t("th",null,[t("div",{class:"text-center"},"Telefon raqami ")]),t("th",{class:"flex justify-center"},"Tasnifi"),t("th",{class:"text-center"},[t("div",{class:"text-center"},"Holati")]),t("th",{class:"text-center"},[t("div",{class:"text-center"},"Vaqti")]),t("th",null,"####")])],-1),mt={class:"text-center font-bold"},xt={class:"text-center"},vt={class:"text-center"},gt={class:"text-center"},kt={class:"text-center"},wt={class:"text-center"},yt={class:"font-bold"},bt=t("span",{class:"text-green-600"},"Barcha ma'lumotlar soni ",-1),Ct=["title"],jt={__name:"Notification_apeal",setup(z){let h=Q();function q(d){h.modals.editApeal.show=!0,h.modals.editApeal.data=d}let _=u(""),c=u(!1),p=u(null),M=async function(){let d=localStorage.token;try{let s=await fetch(`${L}apeal/edit/byid/${p.value}`,{method:"DELETE",headers:{"Content-Type":"application/json; charset=utf-8","-x-token":d}});if(s.status==200){b.success("Ma'lumot o'chirilid"),j(l.value);return}if(s.status==401)return B.push("/login");s.status==400&&(s=await s.json(),b.error(s.error))}catch{}},f=function(){},l=u(1),b=J(),C=u(10),$=u([]),A=u(1),i=u(!1),N=u(0),B=K();F(l,(d,s)=>{j(d)});let j=async d=>{$.value=[],i.value=!0;let s=localStorage.token;try{let o=await fetch(`${L}notification/getapel/all?${new URLSearchParams({page:d,size:C.value}).toString()}`,{method:"GET",headers:{"Content-Type":"application/json; charset=utf-8","-x-token":s}});if(o.status==200){o=await o.json(),A.value=Math.ceil(new Number(o[0].total)/10),$.value=[...o],i.value=!1,N.value=o[0].total;return}if(o.status==401)return B.push("/login")}catch(o){if(o.message=="Failed to fetch")return b.error("Server bilan aloqa uzildi")}};return H(async()=>{j(1)}),F(()=>h.modals.editApeal.loading,(d,s)=>{d&&j(l.value)},{deep:!0}),(d,s)=>{const o=w("n-button"),E=w("n-table"),k=w("n-skeleton"),P=w("n-pagination"),V=w("n-modal");return n(),g(S,null,[t("div",null,[t("div",Z,[tt,t("div",et,[t("div",at,[a(i)?x("",!0):(n(),m(E,{key:0,bordered:!1,"single-line":!1},{default:y(()=>[st,t("tbody",null,[(n(!0),g(S,null,U(a($),(e,D)=>(n(),g("tr",{class:"bg-red-600",key:new Number(e.id)},[t("td",null,r(D+1+(a(l)-1)*a(C)),1),t("td",nt,[t("span",{class:W(e.status==4?"line-through text-red-700":"")},r(e.lastname)+" "+r(e.firstname),3)]),t("td",lt,r(e.phone),1),t("td",ot,r(e.description),1),t("td",rt,r(e.statusname),1),t("td",ct,r(new Date(e.created_at).toLocaleString()),1),t("td",null,[t("div",it,[v(o,{type:"tertiary",onClick:R=>q(e)},{default:y(()=>[dt]),_:2},1032,["onClick"])])]),e.reseen?(n(),g("td",ut,[I(r(new Date(e.reseen).toLocaleString())+" ",1),v(Y,{startDate:e.reseen},null,8,["startDate"])])):(n(),g("td",ht,"Mavjud emas")),t("td",null,[t("div",_t,[v(o,{type:"error",onClick:R=>{T(c)?c.value=!0:c=!0,T(p)?p.value=e.id:p=e.id,T(_)?_.value=`${e.lastname} ${e.firstname}dan kelgan taklifni o'chirasizmi ?`:_=`${e.lastname} ${e.firstname}dan kelgan taklifni o'chirasizmi ?`}},{default:y(()=>[pt]),_:2},1032,["onClick"])])])]))),128))])]),_:1})),a(i)?(n(),m(E,{key:1,bordered:!1,"single-line":!1},{default:y(()=>[ft,t("tbody",null,[(n(),g(S,null,U(5,(e,D)=>t("tr",{key:D},[t("td",null,r(+ +D+(a(l)-1)*a(C)),1),t("td",mt,[a(i)?(n(),m(k,{key:0,height:"40px",width:"100%"})):x("",!0)]),t("td",xt,[a(i)?(n(),m(k,{key:0,height:"40px",width:"100%"})):x("",!0)]),t("td",vt,[a(i)?(n(),m(k,{key:0,height:"40px",width:"100%"})):x("",!0)]),t("td",gt,[a(i)?(n(),m(k,{key:0,height:"40px",width:"100%"})):x("",!0)]),t("td",kt,[a(i)?(n(),m(k,{key:0,height:"40px",width:"100%"})):x("",!0)]),t("td",wt,[a(i)?(n(),m(k,{key:0,height:"40px",width:"100%"})):x("",!0)])])),64))])]),_:1})):x("",!0)]),v(P,{page:a(l),"onUpdate:page":s[0]||(s[0]=e=>T(l)?l.value=e:l=e),"page-count":a(A)},null,8,["page","page-count"]),t("div",yt,[bt,I(": "),t("span",{title:a(N)},r(a(N)),9,Ct)])])])]),v(V,{show:a(h).modals.editApeal.show,"onUpdate:show":s[1]||(s[1]=e=>a(h).modals.editApeal.show=e),class:"custom-card",preset:"card",style:{width:"600px"},title:`${a(h).modals.editApeal.data.lastname} ${a(h).modals.editApeal.data.firstname}`,bordered:!0,size:"huge",segmented:{content:"soft",footer:"soft"}},{default:y(()=>[v(X)]),_:1},8,["show","title"]),v(V,{show:a(c),"onUpdate:show":s[2]||(s[2]=e=>T(c)?c.value=e:c=e),preset:"dialog",title:"O'chirish",content:a(_),"positive-text":"Ha","negative-text":"Bekor qilindi",onPositiveClick:a(M),onNegativeClick:a(f)},null,8,["show","content","onPositiveClick","onNegativeClick"])],64)}}};export{jt as default};
