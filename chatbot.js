const chatToggle=document.getElementById('chatToggle'),chatWindow=document.getElementById('chatWindow'),chatMessages=document.getElementById('chatMessages'),chatInput=document.getElementById('chatInput'),chatSend=document.getElementById('chatSend');
const PHONE='4156298055';const CHAT_ENDPOINT='/api/chat';
let chatOpen=false,chatStarted=false,sending=false,leadCaptured=false;
const chatHistory=[];
chatToggle.addEventListener('click',()=>{chatOpen=!chatOpen;chatWindow.classList.toggle('visible',chatOpen);chatToggle.classList.toggle('open',chatOpen);chatToggle.innerHTML=chatOpen?'✕':'💬';if(chatOpen){chatInput.focus();if(!chatStarted)startChat()}});
function addMsg(text,sender,isHTML){const d=document.createElement('div');d.className='msg '+sender;if(isHTML)d.innerHTML=text;else d.textContent=text;chatMessages.appendChild(d);chatMessages.scrollTop=chatMessages.scrollHeight;return d;}
function showTyping(){const d=document.createElement('div');d.className='msg bot typing';d.id='typingIndicator';d.innerHTML='<div class="dots"><span></span><span></span><span></span></div>';chatMessages.appendChild(d);chatMessages.scrollTop=chatMessages.scrollHeight;return d;}
function hideTyping(){const t=document.getElementById('typingIndicator');if(t)t.remove();}
function startChat(){chatStarted=true;addMsg("Hey there! 👋 I'm Junkaway's AI assistant. I'll grab a few quick details and text them straight to Aymen so he can get back to you fast with a free quote. I don't quote prices myself — but Aymen will. What do you need help with today?",'bot');}
async function sendToAI(userText){
  chatHistory.push({role:'user',content:userText});showTyping();sending=true;chatSend.disabled=true;
  try{const r=await fetch(CHAT_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:chatHistory})});hideTyping();if(!r.ok)throw new Error('HTTP '+r.status);const data=await r.json();const reply=(data.reply||'').trim();if(!reply)throw new Error('empty reply');const leadMatch=reply.match(/<LEAD>([\s\S]*?)<\/LEAD>/);const visibleText=reply.replace(/<LEAD>[\s\S]*?<\/LEAD>/,'').trim();if(visibleText)addMsg(visibleText,'bot');chatHistory.push({role:'assistant',content:reply});if(leadMatch&&!leadCaptured){try{const lead=JSON.parse(leadMatch[1]);showLeadHandoff(lead);leadCaptured=true;}catch(e){console.warn('LEAD parse failed',e);}}}
  catch(err){hideTyping();addMsg("Sorry — I'm having trouble connecting right now. You can text or call Aymen directly:",'bot');addMsg('<a class="sms-link" href="sms:'+PHONE+'">📲 Text Aymen</a><br><a class="call-link" href="tel:'+PHONE+'">Or call (415) 629-8055</a>','bot',true);console.error(err);}
  finally{sending=false;chatSend.disabled=false;if(chatOpen)chatInput.focus();}
}
function showLeadHandoff(lead){const summary='New lead from website:\n\nName: '+(lead.name||'')+'\nPhone: '+(lead.phone||'')+'\nService: '+(lead.service||'')+'\nLocation: '+(lead.location||'')+'\nTiming: '+(lead.timing||'');const smsLink='sms:'+PHONE+'?body='+encodeURIComponent(summary);addMsg('<a class="sms-link" href="'+smsLink+'">📲 Text My Info to Aymen</a><br><a class="call-link" href="tel:'+PHONE+'">Or call directly: (415) 629-8055</a>','bot',true);}
function handleSend(){if(sending)return;const t=chatInput.value.trim();if(!t)return;chatInput.value='';addMsg(t,'user');sendToAI(t);}
chatSend.addEventListener('click',handleSend);
chatInput.addEventListener('keydown',(e)=>{if(e.key==='Enter')handleSend()});
