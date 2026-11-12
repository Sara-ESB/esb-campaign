const {timingSafeEqual}=require("crypto");
exports.J=(code,obj)=>({statusCode:code,headers:{"content-type":"application/json"},body:JSON.stringify(obj)});
exports.H=(event,name)=>{const h=event.headers||{};const k=Object.keys(h).find(x=>x.toLowerCase()===name.toLowerCase());return k?String(h[k]):""};
exports.safe=(a,b)=>{const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&timingSafeEqual(x,y)};
exports.body=event=>{let b=event.body||"";if(event.isBase64Encoded)b=Buffer.from(b,"base64").toString("utf8");try{return JSON.parse(b||"{}")}catch(e){return{}}};
