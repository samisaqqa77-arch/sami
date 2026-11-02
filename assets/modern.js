(()=>{
 'use strict';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 const top=document.createElement('button');top.className='back-top';top.type='button';top.textContent='↑';top.setAttribute('aria-label','العودة إلى أعلى الصفحة');document.body.append(top);
 top.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced.matches?'auto':'smooth'}));
 let queued=false;
 function updateScroll(){const height=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform='scaleX('+(height>0?Math.min(1,Math.max(0,window.scrollY/height)):0)+')';top.classList.toggle('shown',window.scrollY>650);queued=false;}
 window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateScroll)}},{passive:true});window.addEventListener('resize',updateScroll);updateScroll();
 // Visible content remains the fallback when motion is disabled or APIs are unavailable.
 if(!reduced.matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:0.08,rootMargin:'0px 0px 30px 0px'});
  document.querySelectorAll('.product,.why-card,.step,.home-achievement,.achievement,.classification-card,.section-title').forEach((el,i)=>{if(el.getBoundingClientRect().top>window.innerHeight*.8){el.classList.add('reveal-pending');el.style.setProperty('--reveal-delay',(i%3)*65+'ms');observer.observe(el)}});
  reduced.addEventListener('change',event=>{if(event.matches){document.querySelectorAll('.reveal-pending').forEach(el=>el.classList.add('is-visible'));observer.disconnect()}});
 }
 document.querySelectorAll('.hero,.product,.home-achievement').forEach(el=>{
  let frame=0,x=0,y=0;
  el.addEventListener('pointermove',event=>{if(reduced.matches||!fine.matches)return;x=event.clientX;y=event.clientY;if(!frame)frame=requestAnimationFrame(()=>{const rect=el.getBoundingClientRect();el.style.setProperty('--pointer-x',(x-rect.left)+'px');el.style.setProperty('--pointer-y',(y-rect.top)+'px');frame=0})},{passive:true});
 });
})();
