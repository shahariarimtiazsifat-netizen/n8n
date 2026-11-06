import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{AnimatePresence,motion}from'framer-motion';
import confetti from'canvas-confetti';
import{ArrowRight,AudioLines,Check,ChevronRight,Flame,Headphones,Lightbulb,MessageCircle,Moon,Send,Sparkles,Sun,Target,X,Zap}from'lucide-react';

const KEY='n8n_game_cloud_v5';
const defaultDay1 = {
 day: 1,
 phase: 1,
 title: 'Local Setup, Canvas UI & JSON Item Structure ($json, $input)',
 deliverable: 'Run npx n8n locally and build a 3-node trigger-to-action test workflow.',
 sourceName: 'n8n Academy — N8N101 Essentials',
 sourceUrlOrQuery: 'https://learn.n8n.io/'
};

const nudge=(s)=>{
 const days = (s.days && s.days.length) ? s.days : [defaultDay1];
 const day = days.find(d=>!d.completed);
 const goal=100000;
 if(!day)return 'All 21 days are done. Pick a portfolio project and show someone what you built!';
 const left=Math.max(0,goal-(s.deals||[]).filter(d=>d.status==='Closed Paid').reduce((n,d)=>n+(+d.value||0),0));
 return `Your next quest is Day ${day.day}: ${day.title}. Deliverable: ${day.deliverable} You’re ৳${left.toLocaleString('en-BD')} from the revenue goal.`;
};

function Pet(){
 const[progress,setProgress]=useState(()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return{}}});
 const[open,setOpen]=useState(false),[bubble,setBubble]=useState(true),[reply,setReply]=useState(''),[celebrate,setCelebrate]=useState(false),[dismissed,setDismissed]=useState(false),[light,setLight]=useState(()=>document.documentElement.dataset.theme==='light');

 const toggleTheme=()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;try{localStorage.setItem('n8n_theme',next)}catch{}setLight(next==='light');window.dispatchEvent(new CustomEvent('n8n-theme',{detail:next}))};
 useEffect(()=>{const sync=()=>setLight(document.documentElement.dataset.theme==='light');window.addEventListener('n8n-theme',sync);return()=>window.removeEventListener('n8n-theme',sync)},[]);

 useEffect(()=>{
  const refresh=()=>{try{
   const next=JSON.parse(localStorage.getItem(KEY))||{};
   setProgress(prev=>{
    const oldDone=(prev.days||[]).filter(x=>x.completed).length,newDone=(next.days||[]).filter(x=>x.completed).length;
    const oldClosed=(prev.deals||[]).filter(x=>x.status==='Closed Paid').length,newClosed=(next.deals||[]).filter(x=>x.status==='Closed Paid').length;
    if(newDone>oldDone||newClosed>oldClosed){
     setCelebrate(true);
     confetti({particleCount:75,spread:65,startVelocity:27,origin:{x:.93,y:.79},colors:['#FF6D5A','#10B981','#8B5CF6','#f7d794']});
     setTimeout(()=>setCelebrate(false),2300);
    }
    return next;
   });
  }catch{}};
  refresh();
  const id=setInterval(refresh,1000);
  return()=>clearInterval(id);
 },[]);

 /* Listen to mini-step checkboxes from QuestGuide */
 useEffect(()=>{
  const onStepCheck=(e)=>{
   setCelebrate(true);
   confetti({particleCount:45,spread:55,startVelocity:22,origin:{x:.93,y:.82},colors:['#10B981','#FFD166','#8B5CF6','#67E4FF']});
   const cheers=[
    "Great job! Mini-step nailed! ⭐",
    "Step complete! You're making real progress! 🚀",
    "One step closer to shipping today's workflow! ✨",
    "Boom! Keep the momentum rolling! 🔥",
    "Nice work! Tick off all 4 to unlock the level! 🏆"
   ];
   setReply(cheers[Math.floor(Math.random()*cheers.length)]);
   setBubble(true);
   setTimeout(()=>setCelebrate(false),1900);
  };
  window.addEventListener('n8n-step-check',onStepCheck);
  return()=>window.removeEventListener('n8n-step-check',onStepCheck);
 },[]);

 const day=useMemo(()=>{
  const days = (progress.days && progress.days.length) ? progress.days : [defaultDay1];
  return days.find(d=>!d.completed) || null;
 },[progress]);
 const deals=progress.deals||[],earned=deals.filter(d=>d.status==='Closed Paid').reduce((n,d)=>n+(+d.value||0),0),left=Math.max(0,100000-earned),today=new Date().toISOString().slice(0,10),checkedIn=progress.lastCheckInDate===today,timer=!!progress.timer?.running;
 useEffect(()=>{if(!dismissed){const id=setInterval(()=>setBubble(true),150000);return()=>clearInterval(id)}},[dismissed]);
 const danger=!checkedIn&&((progress.currentStreak||0)>0),mode=celebrate?'celebrate':timer?'focus':danger?'danger':'idle';
 const showNudge=()=>{setBubble(true);setDismissed(false)};
 const beginFocus=()=>{window.dispatchEvent(new CustomEvent('n8n-start-focus'));setReply(`Two hours on Day ${day?.day||21}. Let’s make something real.`);setOpen(false)};
 const hint=()=>{const d=day?.day||21, tips={1:'Pin down the item shape first: inspect the trigger output, then reference fields with expressions like {{$json.email}}. Run each node once so you can see the data it passes forward.',2:'Split the order array, filter out-of-stock products, then route VIP orders with Number($json.total) > 5000. Aggregate the surviving items after routing.',3:'Use $input.all().map(({json}) => ({json: {...json, phone: "+880" + json.phone.replace(/\\D/g, "").replace(/^880/, ""), margin: Number(json.price) - Number(json.cost) - Number(json.discount||0)}})). Return each result as a {json} item.',4:'For a synchronous form response, set the Webhook to “Using Respond to Webhook node”. Return a small JSON body and test the production URL only after activating the workflow.',5:'Keep tokens in n8n Credentials. Set Authorization to Bearer <token>, inspect the response status, then map only the fields your next node needs.',6:'Give the agent a narrow role, explicit boundaries, and a clear fallback. Ask it to return a concise answer when a tool is not needed.',7:'Use a Text Classifier to label each message Sales, Support, or Refund, then route to a dedicated prompt chain. Add sentiment as a second routing signal.',8:'Use a stable per-user sessionId (phone or account ID), not the execution ID, so separate messages retrieve the same memory.',9:'Define required keys, types, and allowed enum values in the schema. Validate the parsed output before any action node runs.',10:'Give the Agent Calendar, Sheets, and Gmail tools with clear descriptions. Check availability first, then book, log the lead, and send a confirmation.',11:'Give each sub-agent a constrained input/output contract. Return structured JSON to the manager so it can route the result predictably.',12:'Use Recursive Character Text Splitter, add document ID/page/source metadata before embedding, and test retrieval with representative questions.',13:'Keep the source document ID on every vector. On file change, delete vectors for that ID before inserting the newly embedded chunks.',14:'Require citations from retrieved metadata and have the agent say when the retrieved context does not contain an answer.',15:'Route stock questions to a live SQL/table tool and policy questions to vector search; do not let the model guess inventory.',16:'Branch on MIME type first. Transcribe audio into text, preserve the original binary, and then join at a deliberate point.',17:'Include execution URL, workflow name, and failed node in the alert. Keep credentials and customer payloads out of chat notifications.',18:'Set Loop Over Items to batch 10 of 100, then place a controlled Wait on the loop path and inspect API headers for 429 responses.',19:'Verify webhook challenge and signature, then test with a dedicated test number and a short allow-listed flow.',20:'Require Header Auth on public webhooks, add prompt-injection defenses before tool calls, and export an account-independent JSON backup of each modular workflow.',21:'Record the business problem first, show one live happy path, and finish on the readable workflow canvas.'};setReply(tips[d]||tips[21])};
 const pep=()=>setReply((progress.currentStreak||0)>=7?`A ${progress.currentStreak}-day streak and ৳${earned.toLocaleString('en-BD')} in closed work? You’re building serious momentum. Ship the next node, Architect.`:`You have ${progress.totalXP||0} XP and ৳${earned.toLocaleString('en-BD')} closed. Every workflow is proof you can solve a real problem. One focused session. Go.`);
 const pitch=()=>{const phase=day?.phase||4,offer=phase===1?'order routing, API integrations, and reliable workflow automation':phase===2?'AI receptionists that qualify leads, answer questions, and book meetings':phase===3?'grounded knowledge assistants that answer from your company documents': 'reliable client systems with error alerts, rate-limit protection, and secure AI guardrails';setReply(`Hi [Name] — I build n8n automations for teams like yours. I’m currently helping businesses with ${offer}. I noticed [specific process] may take your team time every week. I’d be happy to map out a small, low-risk demo around it. Open to a 15-minute chat this week?`)};

 return <motion.div className="n8ny-root" drag dragMomentum={false} dragElastic={0.12} dragConstraints={{left:-window.innerWidth+100,right:0,top:-window.innerHeight+100,bottom:0}} whileDrag={{scale:1.04}}>
  <AnimatePresence>{bubble&&!open&&<motion.div className={`n8ny-nudge nudge-${mode}`} initial={{opacity:0,y:12,scale:.94}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:.95}} transition={{type:'spring',stiffness:300,damping:25}}><button className="nudge-close" aria-label="Dismiss nudge" onClick={()=>setBubble(false)}><X size={12}/></button><span className="nudge-overline"><Sparkles size={11}/> N8NY CHECK-IN</span><p>{danger?"Open your n8n Cloud canvas, build today's node architecture, and don't forget to export and save your workflow JSON before your 14-day workspace rotates!":nudge(progress)}</p><div className="nudge-progress"><span>৳{earned.toLocaleString('en-BD')} earned</span><span>৳{left.toLocaleString('en-BD')} to go</span></div></motion.div>}</AnimatePresence>
  <AnimatePresence>{open&&<motion.section className="n8ny-drawer" initial={{opacity:0,y:18,scale:.96,transformOrigin:'bottom right'}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:.97}} transition={{type:'spring',stiffness:300,damping:25}}><div className="drawer-head"><div className="drawer-avatar"><PetFace mode={mode}/></div><div><b>N8ny <span className="online-dot"/></b><small>Your workflow companion</small></div><div className="drawer-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle light / dark theme" title="Toggle light / dark theme"><AnimatePresence mode="wait" initial={false}><motion.span key={light?'moon':'sun'} initial={{rotate:-90,opacity:0,scale:.5}} animate={{rotate:0,opacity:1,scale:1}} exit={{rotate:90,opacity:0,scale:.5}} transition={{duration:.18}}>{light?<Moon size={14}/>:<Sun size={14}/>}</motion.span></AnimatePresence>{light?'Dark':'Light'}</button><button onClick={()=>setOpen(false)} aria-label="Close N8ny"><X size={16}/></button></div></div><div className="advisor"><div className="advisor-label"><Sparkles size={13}/> WHAT SHOULD I DO RIGHT NOW?</div>{day?<><h3>Day {day.day}: {day.title}</h3><p>Start with <a href={day.sourceUrlOrQuery} target="_blank" rel="noreferrer">{day.sourceName}</a>. Then build this:</p><p className="deliverable-copy">{day.deliverable}</p></>:<><h3>Day 21 complete!</h3><p>Polish your three portfolio demos and send your first pitch.</p></>}<button className="focus-cta" onClick={beginFocus}><AudioLines size={15}/> Start 2-Hr Focus Timer{day?` for Day ${day.day}`:''}<ArrowRight size={14}/></button></div><div className="pet-reply" aria-live="polite">{reply?<><span className="reply-label"><MessageCircle size={12}/> N8ny says</span><p>{reply}</p></>:<p className="reply-empty">Need a spark? Pick a prompt and I’ll help you move forward.</p>}</div><div className="prompt-list"><button onClick={hint}><Lightbulb size={14}/> Give me a hint for today’s deliverable <ChevronRight size={14}/></button><button onClick={pep}><Flame size={14}/> Roast / motivate my progress <ChevronRight size={14}/></button><button onClick={pitch}><Send size={14}/> How do I pitch this to clients? <ChevronRight size={14}/></button></div><div className="drawer-footer"><span><Target size={12}/> ৳{earned.toLocaleString('en-BD')} / ৳1,00,000</span><span>{progress.currentStreak||0} day streak <Flame size={12}/></span></div></motion.section>}</AnimatePresence>
  <AnimatePresence>{!open&&<motion.button className={`n8ny-button pet-${mode}`} onClick={()=>{setOpen(true);setBubble(false)}} aria-label="Open N8ny workflow companion" initial={{scale:0}} animate={{scale:1}} whileHover={{scale:1.08}} whileTap={{scale:.94}} transition={{type:'spring',stiffness:300,damping:25}}><PetFace mode={mode}/><span className="pet-online"/>{mode==='danger'&&<span className="pet-alert">!</span>}</motion.button>}</AnimatePresence>
  <span className="n8ny-name">N8ny <i>·</i> {mode==='focus'?'in focus mode':mode==='danger'?'streak check-in':mode==='celebrate'?'cheering you on!':'at your service'}</span>
 </motion.div>;
}

function PetFace({mode='idle'}){return <motion.svg className={`pet-face face-${mode}`} viewBox="0 0 72 72" animate={mode==='celebrate'?{y:[0,-8,0],rotate:[0,-5,5,0]}:{y:[0,-3,0]}} transition={{duration:mode==='celebrate'?.55:2.8,repeat:Infinity,ease:'easeInOut'}}><defs><linearGradient id="petShell" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#263b42"/><stop offset="1" stopColor="#111c27"/></linearGradient><filter id="petGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M36 7v6m-4-7h8" stroke="#45d8ef" strokeWidth="2.5" strokeLinecap="round"/><circle cx="36" cy="7" r="3" fill="#8cf4ff" filter="url(#petGlow)"/><rect x="12" y="15" width="48" height="43" rx="14" fill="url(#petShell)" stroke={mode==='danger'?'#f1a84b':'#45d8ef'} strokeWidth="2.5"/><rect x="18" y="22" width="36" height="28" rx="9" fill="#07121b" stroke="#42616a" strokeWidth="1"/>{mode==='celebrate'?<g fill="#b6f878" filter="url(#petGlow)"><path d="m26 29 2-4 2 4 4 1-4 2-2 4-2-4-4-2zm16 0 2-4 2 4 4 1-4 2-2 4-2-4-4-2z"/></g>:mode==='danger'?<g fill="#ffbf62" filter="url(#petGlow)"><ellipse cx="27" cy="35" rx="3" ry="4"/><ellipse cx="45" cy="35" rx="3" ry="4"/></g>:<g fill={mode==='focus'?'#95e9ff':'#73edff'} filter="url(#petGlow)"><ellipse cx="27" cy="34" rx="3" ry="4"/><ellipse cx="45" cy="34" rx="3" ry="4"/></g>}<path d="M30 43q6 5 12 0" fill="none" stroke={mode==='danger'?'#ffc66a':'#68d8d3'} strokeWidth="1.8" strokeLinecap="round"/>{mode==='danger'&&<path d="M50 23q-3 3-2 7" fill="none" stroke="#9ceaff" strokeWidth="2" strokeLinecap="round"/>}<path d="M9 31h3m48 0h3" stroke="#73949b" strokeWidth="2" strokeLinecap="round"/>{mode==='focus'&&<g stroke="#ff9b76" strokeWidth="2.5" strokeLinecap="round"><path d="M12 30h4m-4 4h4m44-4h4m-4 4h4"/></g>}<rect x="24" y="58" width="24" height="5" rx="2.5" fill="#22343b" stroke="#45616a" strokeWidth="1"/><circle cx="29" cy="60.5" r="1" fill="#68e8d3"/><circle cx="43" cy="60.5" r="1" fill="#68e8d3"/></motion.svg>}

createRoot(document.getElementById('pet-root')).render(<Pet/>);
