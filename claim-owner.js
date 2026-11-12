const {createClient}=require("@supabase/supabase-js");
const {createHash}=require("crypto"),{J,H,body}=require("../lib/http.js");
const E=process.env;
exports.handler=async event=>{
 try{
  if(event.httpMethod!=="POST")return J(405,{error:"POST only"});
  if(!E.SUPABASE_URL||!E.SUPABASE_SERVICE_KEY)return J(500,{error:"SUPABASE_URL or SUPABASE_SERVICE_KEY is not set in Netlify. Add it and redeploy."});
  if(!E.OWNER_CODE_HASH)return J(500,{error:"OWNER_CODE_HASH is not set in Netlify. Add it and redeploy."});
  const b=body(event),jwt=H(event,"authorization").replace("Bearer ","");
  const sb=createClient(E.SUPABASE_URL,E.SUPABASE_SERVICE_KEY,{auth:{persistSession:false}});
  const {data,error}=await sb.auth.getUser(jwt);
  if(error||!data||!data.user)return J(401,{error:"Not signed in."});
  const {count}=await sb.from("profiles").select("id",{count:"exact",head:true}).eq("role","super");
  if(count>0)return J(409,{error:"An owner account already exists."});
  if(createHash("sha256").update(String(b.code||"")).digest("hex")!==String(E.OWNER_CODE_HASH).trim().toLowerCase())return J(403,{error:"Wrong owner code."});
  const {error:ue}=await sb.from("profiles").update({role:"super",username:"supreme-admin",name:"Supreme Admin"}).eq("id",data.user.id);
  if(ue)return J(500,{error:"Could not save the owner: "+ue.message+" (did schema.sql run completely?)"});
  await sb.from("activity_log").insert({username:"supreme-admin",action:"Owner account created"});
  return J(200,{ok:true});
 }catch(e){return J(500,{error:String((e&&e.message)||e)})}
};
