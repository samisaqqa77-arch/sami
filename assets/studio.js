(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const menu=document.getElementById('menuBtn'),nav=document.getElementById('navlinks');
 menu.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));});
 nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
 document.getElementById('year').textContent=new Date().getFullYear();
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 const back=document.createElement('button');back.className='back-top';back.type='button';back.setAttribute('aria-label','العودة إلى أعلى الصفحة');back.innerHTML="<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.65\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z\"/></svg>";document.body.append(back);
 back.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced.matches?'auto':'smooth'}));
 let pending=false;function update(){const range=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(range>0?Math.min(1,Math.max(0,scrollY/range)):0)+')';back.classList.toggle('shown',scrollY>700);pending=false;}
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update();
 if(!reduced.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.04});document.querySelectorAll('.section-heading,.product,.method-list article,.selected-grid .work-card,.journey-grid article').forEach((el,i)=>{if(el.getBoundingClientRect().top>innerHeight*.9){el.classList.add('reveal-pending');el.style.setProperty('--delay',(i%3)*60+'ms');observer.observe(el)}});reduced.addEventListener('change',event=>{if(event.matches){document.querySelectorAll('.reveal-pending').forEach(el=>el.classList.add('is-visible'));observer.disconnect()}});}
 const filters=document.querySelectorAll('[data-filter]'),cards=document.querySelectorAll('.gallery-grid .work-card');
 filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(filter=>{const active=filter===button;filter.classList.toggle('active',active);filter.setAttribute('aria-pressed',String(active))});let count=0;cards.forEach(card=>{const show=button.dataset.filter==='all'||card.dataset.year===button.dataset.filter;card.hidden=!show;card.classList.remove('filter-enter');if(show){count++;if(!reduced.matches){void card.offsetWidth;card.classList.add('filter-enter')}}});document.getElementById('galleryCount').textContent=count+' إنجازًا';}));
})();
