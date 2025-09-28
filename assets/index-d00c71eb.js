(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&c(n)}).observe(document,{childList:!0,subtree:!0});function a(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function c(t){if(t.ep)return;t.ep=!0;const e=a(t);fetch(t.href,e)}})();const m="modulepreload",p=function(o){return"/aquabuild-pool/"+o},d={},g=function(r,a,c){if(!a||a.length===0)return r();const t=document.getElementsByTagName("link");return Promise.all(a.map(e=>{if(e=p(e),e in d)return;d[e]=!0;const n=e.endsWith(".css"),f=n?'[rel="stylesheet"]':"";if(!!c)for(let i=t.length-1;i>=0;i--){const l=t[i];if(l.href===e&&(!n||l.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${e}"]${f}`))return;const s=document.createElement("link");if(s.rel=n?"stylesheet":m,n||(s.as="script",s.crossOrigin=""),s.href=e,document.head.appendChild(s),n)return new Promise((i,l)=>{s.addEventListener("load",i),s.addEventListener("error",()=>l(new Error(`Unable to preload CSS for ${e}`)))})})).then(()=>r()).catch(e=>{const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=e,window.dispatchEvent(n),!n.defaultPrevented)throw e})};window.addEventListener("error",o=>{console.error("Error global:",o.error);const r=document.getElementById("app");r&&(r.innerHTML=`
      <div class="min-h-screen flex items-center justify-center bg-red-50">
        <div class="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 class="text-xl font-bold text-red-600 mb-4">Error en la aplicación</h2>
          <p class="text-gray-700 mb-4">Se ha producido un error al cargar la aplicación.</p>
          <p class="text-sm text-gray-500 mb-4">Abre la consola del navegador (F12) para ver detalles.</p>
          <button onclick="location.reload()" class="btn btn-primary">Recargar</button>
        </div>
      </div>
    `)});async function u(){try{const{App:o}=await g(()=>import("./app-cbd351b6.js").then(r=>r.a),[]);new o}catch(o){console.error("Error al cargar la aplicación:",o);const r=document.getElementById("app");r&&(r.innerHTML=`
        <div class="min-h-screen flex items-center justify-center bg-red-50">
          <div class="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 class="text-xl font-bold text-red-600 mb-4">Error de carga</h2>
            <p class="text-gray-700 mb-4">${o.message}</p>
            <button onclick="location.reload()" class="btn btn-primary">Recargar</button>
          </div>
        </div>
      `)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",u):u();export{g as _};
