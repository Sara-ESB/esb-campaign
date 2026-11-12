// Runs by itself every minute (see netlify.toml). Sends queued emails in small batches.
const {run}=require("../lib/queue.js");
exports.handler=async()=>{
 try{const r=await run({maxMs:20000});console.log("scheduled-send",JSON.stringify(r))}
 catch(e){console.log("scheduled-send ERROR",String((e&&e.message)||e))}
 return{statusCode:200};
};
