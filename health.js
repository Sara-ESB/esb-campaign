const {createClient}=require("@supabase/supabase-js");
const nodemailer=require("nodemailer"),{J,H,safe}=require("../lib/http.js");
const E=process.env;
exports.handler=async event=>{
 const s=E.CRON_SECRET||"",k=(event.queryStringParameters||{}).key||"";
 if(!s||!safe(k,s))return J(401,{error:"Use /api/health?key=YOUR_CRON_SECRET"});
 const names=["SUPABASE_URL","SUPABASE_SERVICE_KEY","SMTP_HOST","SMTP_PORT","SMTP_USER","SMTP_PASS","SITE_URL","TOKEN_SECRET","CRON_SECRET","OWNER_CODE_HASH"];
 const out={env:Object.fromEntries(names.map(n=>[n,E[n]?"set":(n==="SMTP_PORT"||n==="SITE_URL"?"not set (default will be used)":"MISSING")]))};
 try{const sb=createClient(E.SUPABASE_URL,E.SUPABASE_SERVICE_KEY,{auth:{persistSession:false}});
  const {error,count}=await sb.from("profiles").select("id",{count:"exact",head:true});
  out.database=error?"ERROR: "+error.message+" (did schema.sql run?)":"ok, "+count+" profile(s)";
  const m=await sb.from("messages").select("id",{count:"exact",head:true}).eq("status","queued");out.queued_messages=m.error?"ERROR: "+m.error.message:m.count;
 }catch(e){out.database="ERROR: "+e.message}
 try{const port=+E.SMTP_PORT||465,tr=nodemailer.createTransport({host:E.SMTP_HOST,port,secure:port===465,auth:{user:E.SMTP_USER,pass:E.SMTP_PASS},connectionTimeout:6000,greetingTimeout:6000,socketTimeout:6000});await tr.verify();out.smtp="ok: login works"}catch(e){out.smtp="ERROR: "+e.message}
 return J(200,out);
};
