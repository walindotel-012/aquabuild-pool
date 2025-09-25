(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();class C{constructor(e){this.onNavigate=e,this.currentTab="dashboard"}render(){const e=document.createElement("header");return e.className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-lg",e.innerHTML=`
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">🌊</span>
            <h1 class="text-xl font-bold">AquaBuild</h1>
          </div>
          <nav>
            <ul class="flex space-x-6">
              <li><a href="#" data-tab="dashboard" class="tab-link hover:text-cyan-200 transition-colors">Dashboard</a></li>
              <li><a href="#" data-tab="clients" class="tab-link hover:text-cyan-200 transition-colors">Clientes</a></li>
              <li><a href="#" data-tab="quotes" class="tab-link hover:text-cyan-200 transition-colors">Cotizaciones</a></li>
              <li><a href="#" data-tab="invoices" class="tab-link hover:text-cyan-200 transition-colors">Facturas</a></li>
            </ul>
          </nav>
        </div>
      </div>
    `,e.querySelectorAll(".tab-link").forEach(t=>{t.addEventListener("click",s=>{s.preventDefault();const n=t.getAttribute("data-tab");this.setActiveTab(n),this.onNavigate(n)})}),e}setActiveTab(e){this.currentTab=e,document.querySelectorAll(".tab-link").forEach(t=>{t.classList.remove("font-bold","text-cyan-200"),t.getAttribute("data-tab")===e&&t.classList.add("font-bold","text-cyan-200")})}}const c={getClients(){return JSON.parse(localStorage.getItem("clients")||"[]")},saveClients(i){localStorage.setItem("clients",JSON.stringify(i))},getQuotes(){return JSON.parse(localStorage.getItem("quotes")||"[]")},saveQuotes(i){localStorage.setItem("quotes",JSON.stringify(i))},getInvoices(){return JSON.parse(localStorage.getItem("invoices")||"[]")},saveInvoices(i){localStorage.setItem("invoices",JSON.stringify(i))},getQuoteCounter(){return parseInt(localStorage.getItem("quoteCounter")||"1")},saveQuoteCounter(i){localStorage.setItem("quoteCounter",i.toString())},getInvoiceCounter(){return parseInt(localStorage.getItem("invoiceCounter")||"1")},saveInvoiceCounter(i){localStorage.setItem("invoiceCounter",i.toString())}},h={getAll(){return c.getClients()},getById(i){return this.getAll().find(t=>t.id===i)},create(i){const e=this.getAll(),t={id:Date.now().toString(),...i};return e.push(t),c.saveClients(e),t},update(i,e){const t=this.getAll(),s=t.findIndex(n=>n.id===i);return s!==-1?(t[s]={...t[s],...e},c.saveClients(t),t[s]):null},delete(i){const e=this.getAll(),t=e.filter(s=>s.id!==i);return c.saveClients(t),t.length!==e.length}},m={getQuotes(){return c.getQuotes()},createQuote(i){const e=this.getQuotes(),t=c.getQuoteCounter(),s={id:Date.now().toString(),number:`COT-${t.toString().padStart(4,"0")}`,status:"Pendiente",...i};return e.push(s),c.saveQuotes(e),c.saveQuoteCounter(t+1),s},deleteQuote(i){const e=this.getQuotes(),t=e.filter(s=>s.id!==i);return c.saveQuotes(t),t.length!==e.length},getInvoices(){return c.getInvoices()},createInvoice(i){const e=this.getInvoices(),t=c.getInvoiceCounter(),s={id:Date.now().toString(),number:`FAC-${t.toString().padStart(4,"0")}`,...i};return e.push(s),c.saveInvoices(e),c.saveInvoiceCounter(t+1),s},deleteInvoice(i){const e=this.getInvoices(),t=e.filter(s=>s.id!==i);return c.saveInvoices(t),t.length!==e.length}};class x{render(){const e=h.getAll(),t=m.getQuotes(),s=m.getInvoices(),n=document.createElement("div");n.className="space-y-6";const a=`
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-blue-800 mb-2">Clientes</h3>
            <p class="text-3xl font-bold text-blue-600">${e.length}</p>
            <p class="text-sm text-blue-600 mt-1">Total de clientes registrados</p>
          </div>
        </div>
        
        <div class="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-green-800 mb-2">Cotizaciones</h3>
            <p class="text-3xl font-bold text-green-600">${t.length}</p>
            <p class="text-sm text-green-600 mt-1">Cotizaciones generadas</p>
          </div>
        </div>
        
        <div class="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">Facturas</h3>
            <p class="text-3xl font-bold text-yellow-600">${s.length}</p>
            <p class="text-sm text-yellow-600 mt-1">Facturas emitidas</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Bienvenido a AquaBuild</h2>
        <p class="text-gray-600 mb-4">
          Sistema de gestión para empresas de construcción y reparación de piscinas.
          Aquí puede gestionar sus clientes, crear cotizaciones y facturas, y llevar un control
          completo de su negocio.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold text-blue-800 mb-2">Características</h3>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Gestión completa de clientes (CRUD)</li>
              <li>• Creación de cotizaciones con numeración automática</li>
              <li>• Generación de facturas con secuencia</li>
              <li>• Impresión en PDF</li>
              <li>• Almacenamiento local seguro</li>
            </ul>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-green-800 mb-2">Consejos de uso</h3>
            <ul class="text-sm text-green-700 space-y-1">
              <li>• Comience creando sus clientes</li>
              <li>• Use cotizaciones para presupuestos</li>
              <li>• Convierta cotizaciones en facturas</li>
              <li>• Imprima documentos para sus clientes</li>
              <li>• Revise el dashboard para estadísticas</li>
            </ul>
          </div>
        </div>
      </div>
    `;return n.innerHTML=a,n}}class S{constructor(e,t){this.onEdit=e,this.onDelete=t}render(){const e=h.getAll(),t=document.createElement("div");if(t.className="card",e.length===0)return t.innerHTML=`
        <div class="text-center py-8">
          <p class="text-gray-500">No hay clientes registrados</p>
        </div>
      `,t;const s=`
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${e.map(n=>`
              <tr>
                <td class="font-mono text-xs">${n.id.substring(0,8)}</td>
                <td class="font-medium">${n.name}</td>
                <td>${n.email||"-"}</td>
                <td>${n.phone}</td>
                <td>${n.address||"-"}</td>
                <td>
                  <div class="flex space-x-2">
                    <button class="btn btn-warning btn-sm edit-client" data-id="${n.id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-client" data-id="${n.id}">Eliminar</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;return t.innerHTML=s,t.querySelectorAll(".edit-client").forEach(n=>{n.addEventListener("click",a=>{const o=a.target.getAttribute("data-id"),l=h.getById(o);this.onEdit(l)})}),t.querySelectorAll(".delete-client").forEach(n=>{n.addEventListener("click",a=>{const o=a.target.getAttribute("data-id");if(confirm("¿Está seguro de eliminar este cliente? Se eliminarán también sus cotizaciones y facturas.")){const l=m.getQuotes().filter(d=>d.clientId!==o),r=m.getInvoices().filter(d=>d.clientId!==o);localStorage.setItem("quotes",JSON.stringify(l)),localStorage.setItem("invoices",JSON.stringify(r)),h.delete(o)&&this.onDelete()}})}),t}}class I{constructor(){this.element=null}show(e,t,s="Confirmar",n=null){this.element=document.createElement("div"),this.element.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",this.element.innerHTML=`
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">${e}</h3>
          <button class="close-modal text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          ${t}
        </div>
        <div class="flex justify-end space-x-3 p-6 border-t">
          <button class="btn btn-outline cancel-modal">Cancelar</button>
          <button class="btn btn-primary confirm-modal">${s}</button>
        </div>
      </div>
    `,document.body.appendChild(this.element),this.element.querySelector(".close-modal").addEventListener("click",()=>this.close()),this.element.querySelector(".cancel-modal").addEventListener("click",()=>this.close()),this.element.querySelector("div.bg-white").addEventListener("click",a=>{a.stopPropagation()}),n&&n(this)}close(){this.element&&this.element.parentNode&&(this.element.parentNode.removeChild(this.element),this.element=null)}}class q{constructor(e){this.onSubmit=e,this.modal=new I}show(e=null){const t=e?"Editar Cliente":"Nuevo Cliente",s=`
      <form id="client-form" class="space-y-4">
        <input type="hidden" id="client-id">
        <div>
          <label for="client-name" class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
          <input type="text" id="client-name" class="form-control" required>
        </div>
        <div>
          <label for="client-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" id="client-email" class="form-control">
        </div>
        <div>
          <label for="client-phone" class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
          <input type="tel" id="client-phone" class="form-control" required>
        </div>
        <div>
          <label for="client-address" class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input type="text" id="client-address" class="form-control">
        </div>
      </form>
    `;this.modal.show(t,s,"Guardar Cliente",n=>{const a=document.getElementById("client-form");e&&(document.getElementById("client-id").value=e.id,document.getElementById("client-name").value=e.name,document.getElementById("client-email").value=e.email||"",document.getElementById("client-phone").value=e.phone,document.getElementById("client-address").value=e.address||""),a.addEventListener("submit",o=>{o.preventDefault(),this.handleSubmit(n)})})}handleSubmit(e){const t=document.getElementById("client-id").value,s={name:document.getElementById("client-name").value,email:document.getElementById("client-email").value,phone:document.getElementById("client-phone").value,address:document.getElementById("client-address").value};let n;t?n=h.update(t,s):n=h.create(s),n&&(this.onSubmit(),e.close())}}class L{constructor(){this.clientForm=new q(()=>this.refresh())}render(){const e=document.createElement("div");e.className="space-y-6";const t=document.createElement("div");return t.className="flex justify-between items-center",t.innerHTML=`
      <h2 class="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
      <button id="new-client-btn" class="btn btn-primary">+ Nuevo Cliente</button>
    `,e.appendChild(t),this.clientList=new S(s=>this.clientForm.show(s),()=>this.refresh()),e.appendChild(this.clientList.render()),e.querySelector("#new-client-btn").addEventListener("click",()=>{this.clientForm.show()}),e}refresh(){const e=this.render(),t=document.querySelector("#page-content");t&&(t.innerHTML="",t.appendChild(e))}}class w{constructor(e,t){this.type=e,this.onDelete=t}render(){const e=this.type==="quote"?m.getQuotes():m.getInvoices(),t=document.createElement("div");if(t.className="card",e.length===0){const o=this.type==="quote"?"No hay cotizaciones registradas":"No hay facturas registradas";return t.innerHTML=`
        <div class="text-center py-8">
          <p class="text-gray-500">${o}</p>
        </div>
      `,t}const s=this.type==="quote"?"<th>Número</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th>":"<th>Número</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Acciones</th>",n=e.map(o=>{const l=`₡${o.total.toFixed(2)}`;if(this.type==="quote"){const r=o.status==="Pendiente"?"bg-yellow-100 text-yellow-800":"bg-green-100 text-green-800";return`
          <tr>
            <td class="font-mono">${o.number}</td>
            <td class="font-medium">${o.clientName}</td>
            <td>${o.date}</td>
            <td class="font-medium">${l}</td>
            <td><span class="px-2 py-1 rounded text-xs font-medium ${r}">${o.status}</span></td>
            <td>
              <div class="flex space-x-2">
                <button class="btn btn-warning btn-sm">Editar</button>
                <button class="btn btn-danger btn-sm delete-doc" data-id="${o.id}">Eliminar</button>
              </div>
            </td>
          </tr>
        `}else return`
          <tr>
            <td class="font-mono">${o.number}</td>
            <td class="font-medium">${o.clientName}</td>
            <td>${o.date}</td>
            <td class="font-medium">${l}</td>
            <td>
              <div class="flex space-x-2">
                <button class="btn btn-warning btn-sm">Imprimir</button>
                <button class="btn btn-danger btn-sm delete-doc" data-id="${o.id}">Eliminar</button>
              </div>
            </td>
          </tr>
        `}).join(""),a=`
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>${s}</tr>
          </thead>
          <tbody>${n}</tbody>
        </table>
      </div>
    `;return t.innerHTML=a,t.querySelectorAll(".delete-doc").forEach(o=>{o.addEventListener("click",l=>{const r=l.target.getAttribute("data-id"),d=this.type==="quote"?"¿Está seguro de eliminar esta cotización?":"¿Está seguro de eliminar esta factura?";if(confirm(d)){let p=!1;this.type==="quote"?p=m.deleteQuote(r):p=m.deleteInvoice(r),p&&this.onDelete()}})}),t}}class E{constructor(e,t){this.type=e,this.onSubmit=t,this.modal=new I,this.items=[]}show(){const e=this.type==="quote"?"Nueva Cotización":"Nueva Factura",t=`
      <form id="document-form" class="space-y-6">
        <input type="hidden" id="document-type" value="${this.type}">
        
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">Cliente *</label>
          <div class="flex space-x-3 mb-3">
            <button type="button" class="btn btn-outline select-existing">Seleccionar Existente</button>
            <button type="button" class="btn btn-outline create-new">Crear Nuevo</button>
          </div>
          
          <div id="existing-client-section">
            <select id="existing-client" class="form-control">
              <option value="">Seleccione un cliente</option>
              ${h.getAll().map(s=>`<option value="${s.id}">${s.name}</option>`).join("")}
            </select>
          </div>
          
          <div id="new-client-section" class="hidden space-y-3">
            <input type="text" id="new-client-name" class="form-control" placeholder="Nombre completo *" required>
            <input type="email" id="new-client-email" class="form-control" placeholder="Email">
            <input type="tel" id="new-client-phone" class="form-control" placeholder="Teléfono *" required>
            <input type="text" id="new-client-address" class="form-control" placeholder="Dirección">
          </div>
        </div>
        
        <div>
          <label for="document-date" class="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
          <input type="date" id="document-date" class="form-control" required>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Items</label>
          <div id="items-container" class="space-y-3"></div>
          <button type="button" id="add-item" class="btn btn-success mt-2">+ Agregar Item</button>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-end space-y-2 flex-col">
            <div class="flex justify-between">
              <span class="font-medium">Subtotal:</span>
              <span id="subtotal">₡0.00</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">IVA (13%):</span>
              <span id="iva">₡0.00</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-gray-200">
              <span class="font-bold text-lg">Total:</span>
              <span id="total" class="font-bold text-lg text-blue-600">₡0.00</span>
            </div>
          </div>
        </div>
      </form>
    `;this.modal.show(e,t,"Guardar",s=>{document.getElementById("document-date").valueAsDate=new Date,document.querySelector(".select-existing").addEventListener("click",()=>{document.getElementById("existing-client-section").classList.remove("hidden"),document.getElementById("new-client-section").classList.add("hidden")}),document.querySelector(".create-new").addEventListener("click",()=>{document.getElementById("existing-client-section").classList.add("hidden"),document.getElementById("new-client-section").classList.remove("hidden")}),this.addItem(),document.getElementById("add-item").addEventListener("click",()=>{this.addItem()}),document.getElementById("document-form").addEventListener("submit",n=>{n.preventDefault(),this.handleSubmit(s)})})}addItem(){const e=document.getElementById("items-container"),t=e.children.length,s=`
      <div class="item-row flex space-x-3 p-3 bg-white rounded border">
        <div class="flex-1">
          <input type="text" class="form-control item-description" placeholder="Descripción del servicio o producto" required>
        </div>
        <div class="w-20">
          <input type="number" class="form-control item-quantity" placeholder="1" min="1" value="1" required>
        </div>
        <div class="w-32">
          <input type="number" class="form-control item-price" placeholder="0.00" min="0" step="0.01" required>
        </div>
        <div class="w-32">
          <input type="text" class="form-control item-total" readonly>
        </div>
        <button type="button" class="btn btn-danger remove-item self-end">✕</button>
      </div>
    `;e.insertAdjacentHTML("beforeend",s);const n=e.lastElementChild;this.setupItemListeners(n,t)}setupItemListeners(e,t){const s=e.querySelector(".item-quantity"),n=e.querySelector(".item-price"),a=e.querySelector(".item-total"),o=e.querySelector(".remove-item"),l=()=>{const r=parseFloat(s.value)||0,d=parseFloat(n.value)||0,p=r*d;a.value=p>0?`₡${p.toFixed(2)}`:"",this.calculateTotals()};s.addEventListener("input",l),n.addEventListener("input",l),o.addEventListener("click",()=>{e.remove(),this.calculateTotals()})}calculateTotals(){let e=0;document.querySelectorAll(".item-row").forEach(a=>{const o=parseFloat(a.querySelector(".item-quantity").value)||0,l=parseFloat(a.querySelector(".item-price").value)||0;e+=o*l});const s=e*.13,n=e+s;document.getElementById("subtotal").textContent=`₡${e.toFixed(2)}`,document.getElementById("iva").textContent=`₡${s.toFixed(2)}`,document.getElementById("total").textContent=`₡${n.toFixed(2)}`}handleSubmit(e){const t=document.getElementById("existing-client-section").classList.contains("hidden")===!1;let s,n;if(t){if(s=document.getElementById("existing-client").value,!s){alert("Por favor seleccione un cliente");return}n=h.getById(s).name}else{const u={name:document.getElementById("new-client-name").value,email:document.getElementById("new-client-email").value,phone:document.getElementById("new-client-phone").value,address:document.getElementById("new-client-address").value};if(!u.name||!u.phone){alert("Nombre y teléfono son requeridos");return}const b=h.create(u);s=b.id,n=b.name}const a=[],o=document.querySelectorAll(".item-row");let l=!1;if(o.forEach(u=>{const b=u.querySelector(".item-description").value,g=parseFloat(u.querySelector(".item-quantity").value)||0,f=parseFloat(u.querySelector(".item-price").value)||0;b&&g>0&&f>0&&(a.push({description:b,quantity:g,price:f,total:g*f}),l=!0)}),!l){alert("Por favor agregue al menos un item válido");return}const r=a.reduce((u,b)=>u+b.total,0),d=r*.13,p=r+d,y={clientId:s,clientName:n,date:document.getElementById("document-date").value,items:a,subtotal:r,iva:d,total:p};let v;this.type==="quote"?v=m.createQuote(y):v=m.createInvoice(y),v&&(this.onSubmit(),e.close())}}class N{constructor(){this.documentForm=new E("quote",()=>this.refresh())}render(){const e=document.createElement("div");e.className="space-y-6";const t=document.createElement("div");return t.className="flex justify-between items-center",t.innerHTML=`
      <h2 class="text-2xl font-bold text-gray-800">Gestión de Cotizaciones</h2>
      <button id="new-quote-btn" class="btn btn-primary">+ Nueva Cotización</button>
    `,e.appendChild(t),this.documentList=new w("quote",()=>this.refresh()),e.appendChild(this.documentList.render()),e.querySelector("#new-quote-btn").addEventListener("click",()=>{this.documentForm.show()}),e}refresh(){const e=this.render(),t=document.querySelector("#page-content");t&&(t.innerHTML="",t.appendChild(e))}}class B{constructor(){this.documentForm=new E("invoice",()=>this.refresh())}render(){const e=document.createElement("div");e.className="space-y-6";const t=document.createElement("div");return t.className="flex justify-between items-center",t.innerHTML=`
      <h2 class="text-2xl font-bold text-gray-800">Gestión de Facturas</h2>
      <button id="new-invoice-btn" class="btn btn-primary">+ Nueva Factura</button>
    `,e.appendChild(t),this.documentList=new w("invoice",()=>this.refresh()),e.appendChild(this.documentList.render()),e.querySelector("#new-invoice-btn").addEventListener("click",()=>{this.documentForm.show()}),e}refresh(){const e=this.render(),t=document.querySelector("#page-content");t&&(t.innerHTML="",t.appendChild(e))}}class ${constructor(){this.currentPage=null,this.header=new C(e=>this.navigate(e)),this.init()}init(){const e=document.getElementById("app");e.innerHTML=`
      <div class="min-h-screen bg-gray-100">
        <header id="app-header"></header>
        <main class="container mx-auto px-4 py-8">
          <div id="page-content"></div>
        </main>
      </div>
    `,document.getElementById("app-header").appendChild(this.header.render()),this.navigate("dashboard")}navigate(e){let t;switch(e){case"dashboard":t=new x;break;case"clients":t=new L;break;case"quotes":t=new N;break;case"invoices":t=new B;break;default:t=new x}this.currentPage=t,document.getElementById("page-content").innerHTML="",document.getElementById("page-content").appendChild(t.render()),this.header.setActiveTab(e)}}document.addEventListener("DOMContentLoaded",()=>{new $});
