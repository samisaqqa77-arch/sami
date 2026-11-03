(()=>{
 const db=window.SamiDB;
 window.samiCatalogReady=!db.ready;
 let catalog=null;
 window.samiTierPrice=id=>!db.ready?new Intl.NumberFormat('ar-SA').format([2500,3000,4000,4500,5000][id-1])+' ريال':catalog===null?'جارٍ التحقق من السعر…':catalog.some(p=>p.id===id)?new Intl.NumberFormat('ar-SA').format(catalog.find(p=>p.id===id).price)+' ريال':'الباقة غير متاحة حاليًا';
 window.samiTierAvailable=id=>!db.ready||Boolean(catalog?.some(p=>p.id===id));
 if(!db.ready)return;
 const home=document.body.dataset.page==='index';
 if(home){document.getElementById('products').textContent='جارٍ تحميل الباقات والأسعار…';document.getElementById('checkoutBtn').disabled=true;}
 if(home||document.getElementById('classifyForm'))db.products().then(rows=>{
  catalog=rows.map(p=>({...p,id:Number(p.id),price:Number(p.price)}));
  if(home){products.splice(0,products.length,...catalog.map(p=>({id:p.id,name:p.name,price:p.price,desc:p.description})));cart=cart.filter(x=>products.some(p=>p.id===x.id));renderProducts();renderCart();document.getElementById('checkoutBtn').disabled=false;if(!products.length)document.getElementById('products').textContent='لا توجد باقات متاحة حاليًا. يمكنك التواصل معنا.';}
  window.samiCatalogReady=true;
  const result=document.getElementById('classificationResult');
  if(result&&!result.hidden){const id=Number(document.getElementById('tierNumber').textContent);document.getElementById('tierPrice').textContent=window.samiTierPrice(id);document.getElementById('packageLink').hidden=!window.samiTierAvailable(id)}
 }).catch(()=>{
  if(home)document.getElementById('products').textContent='تعذر تحميل الباقات. يرجى تحديث الصفحة أو التواصل معنا.';
  window.samiTierPrice=()=> 'تعذر تحميل السعر؛ يرجى تحديث الصفحة';
  const price=document.getElementById('tierPrice');if(price)price.textContent=window.samiTierPrice();
 });
})();
