class Dialog{static OK_OPTION=1;static CANCEL_OPTION=0;static async confirmDialog(t,n){const o=document.createElement("dialog");const a=document.createElement("h4");const s=document.createElement("div");const e=document.createElement("div");const i=document.createElement("button");const r=document.createElement("button");o.setAttribute("id","inputDialog");a.setAttribute("id","title");s.setAttribute("id","message");e.setAttribute("id","divButtons");i.setAttribute("id","btnOk");i.innerText="OK";r.setAttribute("id","btnCancel");r.innerText="Cancel";e.append(i,r);o.append(a,s,e);$("body").prepend(o);const d={operation:0};return new Promise(e=>{if(!o.open){o.showModal();a.innerText=t;s.innerHTML=n;i.addEventListener("click",()=>{o.close();$(o).remove();d.operation=1;e(d)});r.addEventListener("click",()=>{o.close();$(o).remove();d.operation=0;e(d)})}})}static async changePasswordDialog(t,o){const a=document.createElement("dialog");const s=document.createElement("h4");const i=document.createElement("div");const e=document.createElement("form");const r=document.createElement("input");const d=document.createElement("input");const n=document.createElement("div");const c=document.createElement("button");const l=document.createElement("button");const m=document.createElement("div");r.setAttribute("class","form-control mb-3");d.setAttribute("class","form-control");a.setAttribute("id","inputDialog");s.setAttribute("id","title");i.setAttribute("id","message");n.setAttribute("id","divButtons");c.setAttribute("id","btnSave");c.innerText="Save";l.setAttribute("id","btnCancel");l.innerText="Cancel";r.setAttribute("type","password");r.setAttribute("placeholder","New Password");r.setAttribute("id","newPassword");d.setAttribute("type","password");d.setAttribute("placeholder","Confirm Password");d.setAttribute("id","confirmPassword");m.setAttribute("id","errorMessage");m.style.color="red";e.append(r,d,m);n.append(c,l);a.append(s,i,e,n);document.body.prepend(a);const u={operation:0,newPassword:null};return new Promise(n=>{a.showModal();s.innerText=t;i.innerHTML=o;c.addEventListener("click",()=>{const e=r.value.trim();const t=d.value.trim();if(e===t){a.close();$(a).remove();u.operation=1;u.newPassword=e;n(u)}else{m.innerHTML=`<div class="alert alert-danger" role="alert">
                    Passwords do not match. Please try again.
                    </div>`}});l.addEventListener("click",()=>{a.close();$(a).remove();n(u)});r.addEventListener("input",e);d.addEventListener("input",e);function e(){const e=r.value.trim();const t=d.value.trim();const n=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;if(e!==t&&t.length>0){m.innerText="Passwords do not match."}else if(!n.test(e)){m.innerHTML=`
                    <div class="alert alert-danger" role="alert">
                        "Password must be at least 8 characters <br>and include both letters and numbers.";
                    </div>
                `}else{m.innerHTML=""}}})}static async showCropModal(e,t,n,o){const a=document.createElement("dialog");a.setAttribute("id","messageDialog");a.style.width="700px";a.style.padding="20px";a.style.textAlign="center";a.style.borderRadius="0.5rem";o.sort((e,t)=>t.totalAreaPlanted-e.totalAreaPlanted);a.innerHTML=`
        <div class="container-fluid">
            <ul class="nav nav-tabs d-flex justify-content-around w-100" style="border-bottom: 2px solid #007bff;">
                <li class="nav-item w-50">
                    <a class="nav-link active bg-white text-center w-100" id="cropInfoTab" href="#" style="font-weight: bold; color: #28a745;">Crop Information</a>
                </li>
                <li class="nav-item w-50">
                    <a class="nav-link bg-white text-center w-100" id="varietyTab" href="#" style="font-weight: bold; color: #6c757d;">Variety</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade show active bg-transparent" id="cropInfoContent" style="text-align: justify; font-size: 0.9rem; margin-top: 15px;">
                    <div class="text-center">
                        <div style="background-color: #C9AF94; color: white; padding: 10px; border-radius: 8px; font-weight: bold; font-size: 1.5rem; margin-bottom: 15px;">
                            ${n}
                        </div>
                        <img id="cropImg" src="${e}" alt="Crop Image" class="img-fluid border border-primary rounded" style="width: 30rem; height: auto; margin-bottom: 10px;">
                    </div>
    
                    <div class="text-dark mt-2">${t}</div>
                </div>
                <div class="tab-pane fade bg-transparent" id="varietyContent" style="text-align: justify; font-size: 0.9rem; color: #333;">
                    <div class="accordion" id="varietyAccordion">
                        ${o.map((e,t)=>`
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading${t}">
                                <button class="bg-success accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${t}" aria-expanded="false" aria-controls="collapse${t}">
                                    ${e.varietyName} (Total Area Planted: ${e.totalAreaPlanted})
                                </button>
                            </h2>
                            <div id="collapse${t}" class="accordion-collapse collapse" aria-labelledby="heading${t}" data-bs-parent="#varietyAccordion">
                                <div class="accordion-body">
                                    <img src="${e.cropImg}" alt="${e.varietyName} Image" class="img-fluid border border-primary rounded" style="width: 20rem; height: auto; margin-bottom: 10px;">
                                    <p><strong>Characteristics:</strong></p>
                                    <p><strong>Color:</strong> ${e.color}</p>
                                    <p><strong>Size:</strong> ${e.size}</p>
                                    <p><strong>Flavor:</strong> ${e.flavor}</p>
                                    <p><strong>Growth Conditions:</strong> ${e.growthConditions}</p>
                                    <p><strong>Pest/Disease Resistance:</strong> ${e.pestDiseaseResistance}</p>
                                    <p><strong>Recommended Practices:</strong> ${e.recommendedPractices}</p>
                                </div>
                            </div>
                        </div>
                        `).join("")}
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-3">
                <button id="btnClose" class="btn btn-danger" style="font-weight: bold;">Close</button>
            </div>
        </div>
        `;document.body.append(a);const s={operation:0};return new Promise(e=>{if(!a.open){a.showModal();const n=a.querySelector("#cropInfoContent");const o=a.querySelector("#varietyContent");a.querySelector(".nav-tabs").addEventListener("click",e=>{const t=e.target;if(t.id==="cropInfoTab"){n.classList.add("show","active");o.classList.remove("show","active");t.style.color="#28a745";a.querySelector("#varietyTab").style.color="#6c757d"}else if(t.id==="varietyTab"){o.classList.add("show","active");n.classList.remove("show","active");t.style.color="#28a745";a.querySelector("#cropInfoTab").style.color="#6c757d"}});a.querySelector("#btnClose").addEventListener("click",()=>{a.close();a.remove();s.operation=1;e(s)})}})}static async downloadDialog(){const n=document.createElement("dialog");const e=document.createElement("div");const t=document.createElement("h5");const o=document.createElement("div");const a=document.createElement("button");const s=document.createElement("button");const i=document.createElement("button");const r=document.createElement("button");n.setAttribute("id","downloadModal");n.setAttribute("role","dialog");n.setAttribute("aria-labelledby","downloadModalLabel");n.style.padding="20px";n.style.borderRadius="8px";n.style.maxWidth="400px";n.style.boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)";t.className="modal-title text-center mb-4";t.id="downloadModalLabel";t.innerText="Download Options";r.type="button";r.innerText="Close";r.className="dialog-close btn btn-secondary";r.style.width="100%";r.addEventListener("click",()=>{n.close()});a.className="btn btn-primary mb-3";a.innerHTML='<i class="fas fa-file-csv"></i> Download CSV';a.setAttribute("data-format","csv");a.style.width="100%";s.className="btn btn-success mb-3";s.innerHTML='<i class="fas fa-file-excel"></i> Download Excel';s.setAttribute("data-format","xlsx");s.style.width="100%";i.className="btn btn-danger mb-3";i.innerHTML='<i class="fas fa-file-pdf"></i> Download PDF';i.setAttribute("data-format","pdf");i.style.width="100%";let d;const c=new Promise(e=>{d=e});[a,s,i].forEach(e=>{e.addEventListener("click",e=>{const t=e.currentTarget.getAttribute("data-format");if(d){d(t)}n.close()})});o.className="d-grid gap-3";o.append(a,s,i,r);e.className="text-center";e.append(t,o);n.appendChild(e);document.body.appendChild(n);n.showModal();return c}static async showInfoModal(e){const t=document.createElement("dialog");const n=document.createElement("div");const o=document.createElement("button");const a=document.createElement("div");t.setAttribute("id","messageDialog");o.setAttribute("id","btnClose");o.innerText="Close";t.style.maxWidth="1000px";t.style.padding="20px";t.style.fontSize="1em";t.style.textAlign="justify";t.style.margin="20px";n.style.display="flex";n.style.flexDirection="column";n.style.alignItems="center";n.style.gap="20px";n.style.margin="20px";n.innerHTML=e;a.style.display="flex";a.style.justifyContent="flex-end";a.append(o);n.append(a);t.append(n);document.body.append(t);const s={operation:0};return new Promise(e=>{if(!t.open){t.showModal();o.addEventListener("click",()=>{t.close();t.remove();s.operation=1;e(s)})}})}static async showMessageDialog(n,o){const a=document.createElement("dialog");const s=document.createElement("h4");const i=document.createElement("div");const r=document.createElement("button");a.setAttribute("id","messageDialog");s.setAttribute("id","title");i.setAttribute("id","message");r.setAttribute("id","btnOk");r.innerText="OK";a.append(s,i,r);$("body").prepend(a);return new Promise(e=>{if(!a.open){a.showModal();s.innerText=n;i.innerHTML=o;r.focus();function t(e){if(e.key==="Enter"&&document.activeElement===r){e.preventDefault();r.dispatchEvent(new Event("click"))}}document.addEventListener("keydown",t);r.addEventListener("click",()=>{a.close();$(a).remove();document.removeEventListener("keydown",t);e()})}})}}export default Dialog;