// Backup: you can also call /api/process-queue?key=CRON_SECRET from a free cron service.
const {run}=require("../lib/queue.js"),{J,H,safe}=require("../lib/http.js");
exports.handler=async event=>{
 const s=process.env.CRON_SECRET||"",k=(event.queryStringParameters||{}).key||"",h=H(event,"authorization").replace("Bearer ","");
 if(!s||!(safe(k,s)||safe(h,s)))return J(401,{error:"Unauthorized. Use ?key=YOUR_CRON_SECRET (and set CRON_SECRET in Netlify)."});
 try{const r=await run({maxMs:7000});return J(r.error?500:200,r)}catch(e){return J(500,{error:String((e&&e.message)||e)})}
};
