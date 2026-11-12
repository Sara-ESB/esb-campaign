const {createClient}=require("@supabase/supabase-js");
const {createHmac}=require("crypto"),{safe}=require("../lib/http.js");
const E=process.env,P=(c,b,t)=>({statusCode:c,headers:{"content-type":t||"text/html; charset=utf-8"},body:b});
exports.handler=async event=>{
 try{
  const q=event.queryStringParameters||{},e=String(q.e||""),t=String(q.t||"");
  if(!E.TOKEN_SECRET||!E.SUPABASE_URL||!E.SUPABASE_SERVICE_KEY)return P(500,"Server is not set up yet.","text/plain");
  if(!safe(t,createHmac("sha256",E.TOKEN_SECRET).update(e).digest("hex")))return P(400,"Invalid link","text/plain");
  const sb=createClient(E.SUPABASE_URL,E.SUPABASE_SERVICE_KEY,{auth:{persistSession:false}});
  await sb.from("contacts").update({unsubscribed:true}).eq("email",e);
  await sb.from("activity_log").insert({username:"public",action:"Unsubscribed "+e});
  return P(200,`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font-family:sans-serif;text-align:center;padding:40px"><img src="/logo.png" width="72" alt=""><h2>You are unsubscribed</h2><p>আপনাকে আনসাবস্ক্রাইব করা হয়েছে। You will not get marketing emails from us.</p></body>`);
 }catch(err){return P(500,"Something went wrong. Please try again.","text/plain")}
};
