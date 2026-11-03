(()=>{
 const form=document.getElementById('serviceRequest');
 const labels={refund:'الاسترداد الضريبي للجمعيات',zakat:'رفع الإقرار الزكوي للجمعيات',both:'الاسترداد الضريبي ورفع الإقرار الزكوي للجمعيات'};
 const selected=new URLSearchParams(location.search).get('service');
 if(Object.hasOwn(labels,selected))form.querySelector(`[value="${selected}"]`).checked=true;
 const normalize=value=>value.replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[\s()-]/g,'');
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const org=document.getElementById('taxOrg').value.trim(),person=document.getElementById('taxPerson').value.trim(),phone=normalize(document.getElementById('taxPhone').value);
  const error=document.getElementById('serviceError');
  if(!org||!person||! /^(?:05\d{8}|(?:\+|00)?9665\d{8})$/.test(phone)){
   error.textContent='أدخل اسم الجمعية ومسؤول التواصل ورقم جوال سعودي صحيحًا.';error.hidden=false;return;
  }
  error.hidden=true;
  const service=labels[form.querySelector('[name="service"]:checked').value];
  const message=['السلام عليكم، أرغب في طلب خدمة من سامي مستشار الحوكمة.','الخدمة: '+service,'اسم الجمعية: '+org,'مسؤول التواصل: '+person,'الجوال: '+phone,'أرجو التواصل لتحديد المتطلبات ونطاق العمل والتكلفة.'].join('\n');
  const button=form.querySelector('button[type="submit"]');button.disabled=true;
  try{let reference='';if(SamiDB.ready){const saved=await SamiDB.submit({kind:form.querySelector('[name="service"]:checked').value,organization:org,person,phone});reference='\nرقم الطلب: '+saved.id}window.location.assign('https://wa.me/966535802823?text='+encodeURIComponent(message+reference));}catch(e){error.textContent=e.message;error.hidden=false}finally{button.disabled=false}
 });
})();
