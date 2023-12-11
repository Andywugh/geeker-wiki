(()=>{var o=class{container;constructor(){this.container=document.createElement("div"),this.container.className="snackbars",document.body.appendChild(this.container)}add(e,t=2e3){let r=document.createElement("div");r.className="snackbar",r.innerText=e,this.container.appendChild(r),setTimeout(()=>{r.remove()},t)}},u=new o,c=u;var l={storage:"local"};var d=class{str2buf(e){return new TextEncoder().encode(e)}buf2str(e){return new TextDecoder("utf-8").decode(e)}hex2buf(e){return new Uint8Array(e.match(/.{2}/g).map(t=>parseInt(t,16)))}async deriveKey(e,t){return t=t??crypto.getRandomValues(new Uint8Array(8)),await crypto.subtle.importKey("raw",this.str2buf(e),"PBKDF2",!1,["deriveKey"]).then(async r=>await crypto.subtle.deriveKey({name:"PBKDF2",salt:t,iterations:1e3,hash:"SHA-256"},r,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])).then(r=>[r,t])}decryptBlock(e,t=""){if(t===""&&(t=e.querySelector("input").value),t==="")return;let r=e.querySelector(".hugo-encrypt-content");this.decrypt(t,r.innerText).then(n=>{this.digestMessage(n.replace(/\r?\n?[^\r\n]*$/,"")).then(s=>{n.includes(s)&&(r.innerHTML=n,e.classList.add("decrypted"),this.rememberPassword(e.getAttribute("data-id")??"",t))}).catch(s=>{throw s})}).catch(n=>{c.add(e.getAttribute("data-error-msg")),this.clearPassword(e.getAttribute("data-id")??""),console.log(n)})}showBlock(e,t=""){if(t===""&&(t=e.querySelector("input").value),t==="")return;let n=e.querySelector(".hugo-encrypt-content").querySelector(".hugo-encrypt-sha1-sum");this.digestMessage(t).then(s=>{if(n.innerText==s)e.classList.add("decrypted"),this.storage()===localStorage?this.setItemWithExpiry("show-content-password",t,1e3*60):this.rememberPassword(e.getAttribute("data-id")??"",t);else throw new Error("Password is incorrect")}).catch(s=>{c.add(e.getAttribute("data-error-msg")),this.storage()===localStorage?this.storage().removeItem("show-content-password"):this.clearPassword(e.getAttribute("data-id")??""),console.log(s)})}storage(){return l.storage==="session"?sessionStorage:localStorage}cacheKey(e){return`hugo-encrypt-password-${location.pathname}-${e}`}setItemWithExpiry(e,t,r){let s={value:t,expiry:new Date().getTime()+r};localStorage.setItem(e,JSON.stringify(s))}getItemWithExpiry(e){let t=localStorage.getItem(e);if(!t)return null;let r=JSON.parse(t);return new Date().getTime()>r.expiry?(localStorage.removeItem(e),null):r.value}rememberPassword(e,t){this.storage().setItem(this.cacheKey(e),t)}clearPassword(e){this.storage().removeItem(this.cacheKey(e))}recover(e){let t=e.getAttribute("data-id");if(t==null)return;let r=this.storage().getItem(this.cacheKey(t));r!==null&&this.showBlock(e,r)}recoverGlobal(e){if(this.storage()===localStorage){let t=this.getItemWithExpiry("show-content-password");t!==null&&this.showBlock(e,t)}else this.recover(e)}async decrypt(e,t){let[r,n,s]=t.split("-").map(this.hex2buf);return await this.deriveKey(e,r).then(async([a])=>await crypto.subtle.decrypt({name:"AES-GCM",iv:n},a,s)).then(a=>this.buf2str(new Uint8Array(a)))}async digestMessage(e){let t=new TextEncoder().encode(e),r=await crypto.subtle.digest("SHA-1",t);return Array.from(new Uint8Array(r)).map(a=>a.toString(16).padStart(2,"0")).join("")}},h=d;document.addEventListener("DOMContentLoaded",()=>{let i=new h;document.querySelectorAll(".hugo-decrypt-button").forEach(t=>{let r=t.closest(".hugo-encrypt");i.recoverGlobal(r),t.addEventListener("click",()=>{i.showBlock(r)})})});})();
