let content;
let language=localStorage.getItem('lang')==='en'?'en':'tr';
let galleryProject=null,galleryIndex=0,galleryReturnFocus=null;
const dialog=document.getElementById('gallery-dialog');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function setLang(l){
 language=l;document.documentElement.lang=l;localStorage.setItem('lang',l);
 document.querySelectorAll('[data-tr]').forEach(e=>e.innerHTML=e.dataset[l]);
 ['tr','en'].forEach(x=>{const b=document.getElementById(x);b.classList.toggle('active',x===l);b.setAttribute('aria-pressed',x===l)});
 document.title=l==='en'?'Songül Aydın — Architect':'Songül Aydın — Mimar';
 document.getElementById('gallery-close').setAttribute('aria-label',l==='en'?'Close gallery':'Galeriyi kapat');
 document.getElementById('gallery-prev').setAttribute('aria-label',l==='en'?'Previous image':'Önceki görsel');
 document.getElementById('gallery-next').setAttribute('aria-label',l==='en'?'Next image':'Sonraki görsel');
 if(content)renderContent();if(dialog.open)renderViewer();
}
function renderContent(){
 const n=language==='en'?1:0,en=n===1;
 document.getElementById('projectlist').innerHTML=content.projects.map((p,i)=>`<article class="project" id="project-${p.id}">
 <button class="project-cover" data-project="${p.id}" data-image="0" aria-label="${esc(p.title[n])} — ${en?'open image gallery':'görsel galerisini aç'}"><img class="project-image" src="${p.images[0].src}" alt="${esc(p.title[n])}" loading="lazy" width="800" height="450"></button>
 <div class="meta"><span>${String(i+1).padStart(2,'0')} / ${esc(p.location[n])}</span><span>${p.areaLabel ? esc(p.areaLabel[n]) + ' · ' : ''}${esc(p.area)}</span></div><h3>${esc(p.title[n])}</h3><p>${esc(p.description[n])}</p><footer>${esc(p.company)}</footer>
 <details class="gallery-details"><summary>${en?'Project gallery':'Proje görselleri'} (${p.images.length})</summary><div class="gallery-preview">${p.images.map((im,j)=>`<button data-project="${p.id}" data-image="${j}" aria-label="${esc(p.title[n])} — ${en?'image':'görsel'} ${j+1}"><img src="${im.src}" alt="${esc(p.title[n])} — ${j+1}" loading="lazy" width="240" height="160"></button>`).join('')}</div><p class="gallery-note">${en?'Select an image to view it here.':'Büyük görüntülemek için bir görsel seçin.'}</p></details></article>`).join('');
 document.getElementById('jobs').innerHTML=content.jobs.map(j=>`<article class="job"><time>${j.date}</time><div><h3>${esc(j.company)}</h3><div class="job-info"><p class="job-location">${esc(j.location[n])}</p><p class="job-project"><b>${en?'Project':'Proje'}:</b> ${esc(j.project[n])}</p><p class="job-role"><b>${en?'Position':'Pozisyon'}:</b> ${esc(j.role[n])}</p></div></div></article>`).join('');
}
function openGallery(id,index,trigger){galleryProject=content.projects.find(p=>p.id===id);galleryIndex=index;galleryReturnFocus=trigger;renderViewer();dialog.showModal();document.body.style.overflow='hidden';document.getElementById('gallery-close').focus()}
function renderViewer(){
 const p=galleryProject,n=language==='en'?1:0,en=n===1,im=p.images[galleryIndex];
 document.getElementById('gallery-title').textContent=p.title[n];
 document.getElementById('gallery-count').textContent=`${p.location[n]} · ${galleryIndex+1} / ${p.images.length}`;
 const image=document.getElementById('gallery-main');image.src=im.src;image.alt=`${p.title[n]} — ${en?'image':'görsel'} ${galleryIndex+1}`;

 document.getElementById('gallery-thumbs').innerHTML=p.images.map((m,j)=>`<button type="button" data-viewer-index="${j}" class="${j===galleryIndex?'active':''}" aria-label="${en?'Image':'Görsel'} ${j+1}" aria-pressed="${j===galleryIndex}"><img src="${m.src}" alt=""></button>`).join('');
}
function nextImage(step){galleryIndex=(galleryIndex+step+galleryProject.images.length)%galleryProject.images.length;renderViewer()}
document.getElementById('projectlist').addEventListener('click',e=>{const b=e.target.closest('button[data-project]');if(b)openGallery(b.dataset.project,Number(b.dataset.image),b)});
document.getElementById('gallery-close').addEventListener('click',()=>dialog.close());
document.getElementById('gallery-prev').addEventListener('click',()=>nextImage(-1));
document.getElementById('gallery-next').addEventListener('click',()=>nextImage(1));
document.getElementById('gallery-thumbs').addEventListener('click',e=>{const b=e.target.closest('[data-viewer-index]');if(b){galleryIndex=Number(b.dataset.viewerIndex);renderViewer()}});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();nextImage(-1)}if(e.key==='ArrowRight'){e.preventDefault();nextImage(1)}});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';galleryReturnFocus?.focus()});
document.getElementById('year').textContent=new Date().getFullYear();setLang(language);
fetch('content.json').then(r=>{if(!r.ok)throw Error('Content unavailable');return r.json()}).then(c=>{content=c;renderContent()}).catch(()=>{document.getElementById('projectlist').textContent=language==='en'?'Please refresh the page to load projects.':'Projeleri yüklemek için lütfen sayfayı yenileyin.'});

const actionDialog=document.getElementById('action-dialog');
let actionTrigger=null;
function showAction(kind,trigger){
 const en=language==='en';actionTrigger=trigger;
 document.getElementById('action-close').setAttribute('aria-label',en?'Close':'Kapat');
 document.getElementById('action-status').textContent='';
 if(kind==='cv'){
  document.getElementById('action-title').textContent=en?'Curriculum vitae':'Özgeçmiş';
  document.getElementById('action-body').innerHTML=`<div class="action-buttons"><button type="button" id="download-cv">${en?'Download PDF ↓':'PDF’yi indir ↓'}</button><a class="secondary arrow-up-right" href="${new URL('songul-aydin-cv.pdf',location.href).href}" target="_blank" rel="noopener noreferrer">${en?'Open in new tab':'Yeni sekmede aç'}</a></div><div class="cv-previews">${[1,2,3,4].map(i=>`<img src="cv-page-${i}.webp" alt="${en?'CV page':'CV sayfa'} ${i}" loading="lazy">`).join('')}</div>`;
  document.getElementById('download-cv').addEventListener('click',downloadCV);
 }else{
  const phone=kind==='phone',value=phone?'+90 (533) 372 07 16':'mimarch06@hotmail.com',url=phone?'tel:+905333720716':'mailto:mimarch06@hotmail.com';
  document.getElementById('action-title').textContent=phone?(en?'Phone':'Telefon'):(en?'Email':'E-posta');
  document.getElementById('action-body').innerHTML=`<p class="action-value">${value}</p><div class="action-buttons"><button type="button" id="copy-contact">${en?'Copy':'Kopyala'}</button><a class="arrow-up-right" href="${url}" target="_blank" rel="noopener noreferrer">${phone?(en?'Call':'Ara'):(en?'Open email app':'E-posta uygulamasını aç')}</a></div><input id="contact-copy-fallback" readonly value="${value}" aria-label="${en?'Contact detail':'İletişim bilgisi'}" hidden>`;
  document.getElementById('copy-contact').addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText(phone?'+905333720716':value);document.getElementById('action-status').textContent=en?'Copied.':'Kopyalandı.'}
   catch{const field=document.getElementById('contact-copy-fallback');field.hidden=false;field.focus();field.select();document.getElementById('action-status').textContent=en?'Select and copy the contact detail above.':'Yukarıdaki bilgiyi seçip kopyalayabilirsin.'}
  });
 }
 actionDialog.showModal();document.body.style.overflow='hidden';document.getElementById('action-close').focus();
}
async function downloadCV(){
 const en=language==='en',status=document.getElementById('action-status'),button=document.getElementById('download-cv');button.disabled=true;status.textContent=en?'Preparing PDF…':'PDF hazırlanıyor…';
 try{
  const response=await fetch('songul-aydin-cv.pdf');if(!response.ok)throw Error('PDF unavailable');
  const blob=await response.blob();if(!blob.size)throw Error('Empty PDF');
  const url=URL.createObjectURL(new Blob([blob],{type:'application/pdf'})),link=document.createElement('a');link.href=url;link.download='Songul-Aydin-CV.pdf';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  status.textContent=en?'Download started.':'İndirme başlatıldı.';
 }catch{status.textContent=en?'Use “Open in new tab” to access the PDF.':'PDF’ye erişmek için “Yeni sekmede aç” seçeneğini kullanabilirsin.'}finally{button.disabled=false}
}
document.querySelectorAll('[data-action]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showAction(a.dataset.action,a)}));
document.getElementById('action-close').addEventListener('click',()=>actionDialog.close());
actionDialog.addEventListener('close',()=>{document.body.style.overflow='';actionTrigger?.focus()});
actionDialog.addEventListener('click',e=>{if(e.target===actionDialog){const r=actionDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)actionDialog.close()}});

document.querySelectorAll('.section-toggle').forEach(button => {
 const sectionContent = document.getElementById(button.getAttribute('aria-controls'));
 button.addEventListener('click', () => {
  const collapsed = sectionContent.toggleAttribute('data-collapsed');
  button.setAttribute('aria-expanded', String(!collapsed));
  if (collapsed) button.scrollIntoView({block: 'nearest'});
 });
});
