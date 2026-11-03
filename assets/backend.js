(()=>{
 const c=window.SAMI_CONFIG||{};
 const ready=Boolean(/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(c.url||'')&&c.publicKey);
 let token='';
 async function request(route,{method='GET',body,auth=false}={}){
  if(!ready)throw new Error('لم يتم ربط قاعدة البيانات بعد. راجع ملف الإعداد.');
  if(auth&&!token)throw new Error('يرجى تسجيل الدخول مجددًا.');
  const headers={apikey:c.publicKey,'Content-Type':'application/json'};
  if(auth)headers.Authorization='Bearer '+token;
  const response=await fetch(c.url.replace(/\/$/,'')+route,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(18000)});
  const text=await response.text();let data;try{data=text?JSON.parse(text):null}catch{data=null}
  if(!response.ok){if(auth&&response.status===401){token='';window.dispatchEvent(new Event('sami-session-expired'))}throw new Error(data?.message||data?.msg||data?.error_description||'تعذر الاتصال بالخدمة. حاول مجددًا.');}
  return data;
 }
 const rpc=(name,body={},auth=false)=>request('/rest/v1/rpc/'+name,{method:'POST',body,auth});
 const keyFor=body=>JSON.stringify(body);
 let pendingKey='',pendingId='';
 window.SamiDB={ready,rpc,request,
  async login(username,password){
   if(username.trim().toLowerCase()!=='admin'||!c.adminEmail)throw new Error('اسم المستخدم أو إعداد حساب المدير غير صحيح.');
   const result=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email:c.adminEmail,password}});
   token=result.access_token;
   try{if(!await rpc('sami_is_admin',{},true))throw new Error('هذا الحساب لا يملك صلاحية الإدارة.');}catch(e){token='';throw e}
  },
  async logout(){try{if(token)await request('/auth/v1/logout',{method:'POST',auth:true})}finally{token=''}},
  async products(){return request('/rest/v1/sami_products?select=*&active=eq.true&order=id.asc')},
  async submit(payload){
   if(pendingKey!==keyFor(payload)){pendingKey=keyFor(payload);pendingId=crypto.randomUUID()}
   return rpc('sami_submit_order',{payload,request_id:pendingId});
  }
 };
 // Counts page views and approximate browser sessions; no IPs or names in analytics.
 if(ready&&!location.pathname.endsWith('/admin.html')){
  try{
   const day=new Date().toISOString().slice(0,10),key='sami-session-'+day;
   let session=sessionStorage.getItem(key);if(!session){session=crypto.randomUUID();sessionStorage.setItem(key,session)}
   const page=location.pathname.split('/').pop()||'index.html';
   rpc('sami_record_visit',{session_id:session,page_name:page}).catch(()=>{});
  }catch{}
 }
})();
