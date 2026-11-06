import React,{useCallback,useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import{AnimatePresence,motion}from'framer-motion';
import{ArrowLeft,ArrowRight,Check,HelpCircle,Sparkles,X}from'lucide-react';

const KEY='n8n_architect_tour_v2';
const steps=[
 {target:'.page-heading',route:'Overview',title:'Welcome to your sprint HQ',text:'Your 21-day roadmap and ৳1,00,000 revenue sprint live in one workspace. This quick tour shows you where everything is.'},
 {target:'.mastery-card',route:'Overview',title:'Watch your mastery grow',text:'Every completed day adds XP. Your progress, rank, and streak stay saved as you work through the game map.'},
 {target:'.focus-card',route:'Overview',title:'Know what to do next',text:'Today’s Focus brings your next unfinished lesson and its hands-on deliverable right to the overview.'},
 {target:'.timer-panel',route:'Overview',title:'Make time for deep work',text:'Start a two-hour session or choose a focused 30-minute learning block and a 60-minute build.'},
 {target:'.roadmap-list',route:'Learning path',title:'Follow the full learning path',text:'Navigate through 4 worlds. Each level unlocks sequentially, with epic Boss Quests at the end of each world.'},
 {target:'.qg-root',route:'Learning path',title:'Beginner Quest Guide',text:'Your quest panel has an ELI5 breakdown, a curated tutorial, 4 click-by-click mission steps, personal notes, and a JSON backup vault.'},
 {target:'.project-grid',route:'Portfolio',title:'Build your client portfolio',text:'Track the status of your three proof projects, add a demo video, and keep each workflow JSON close at hand.'},
 {target:'.pipeline-card',route:'Revenue',title:'Keep every opportunity moving',text:'Add leads, update their stage, and track closed-paid project value toward your ৳1,00,000 target.'},
 {target:'.simulator-card',route:'Revenue',title:'Plan a path to your goal',text:'Adjust project deals and retainers to see how different offer mixes can reach the target.'},
 {target:'.n8ny-root',title:'Meet N8ny, your workflow companion',text:'Tap the floating bot for advice, practical hints, client pitch drafts, or cheering as you complete mini-steps! You can drag N8ny to a comfortable corner.'},
];

function Tour(){
 const[active,setActive]=useState(false),[step,setStep]=useState(0),[rect,setRect]=useState(null),[placement,setPlacement]=useState({top:0,left:0});
 const finish=useCallback(()=>{setActive(false);setRect(null);localStorage.setItem(KEY,'done');},[]);
 const start=useCallback(()=>{
  [...document.querySelectorAll('.nav-item')].find(el=>el.textContent.includes('Overview'))?.click();
  setStep(0);
  setActive(true);
 },[]);

 useEffect(()=>{
  if(localStorage.getItem(KEY)!=='done'){
   const id=setTimeout(start,950);
   return()=>clearTimeout(id);
  }
 },[start]);

 useEffect(()=>{
  if(!active)return;
  const item=steps[step];
  if(item.route){
   const nav=[...document.querySelectorAll('.nav-item')].find(el=>el.textContent.includes(item.route));
   nav?.click();
  }
  setRect(null);

  let cancelled = false;
  let attempts = 0;
  const maxAttempts = item.route ? 20 : 8;

  const locate = () => {
   if (cancelled) return;
   const el = document.querySelector(item.target);
   if (!el) {
    if (++attempts < maxAttempts) {
     setTimeout(locate, 50);
    }
    return;
   }
   el.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});
   setTimeout(()=>{
    if (cancelled) return;
    const r=el.getBoundingClientRect();
    setRect({top:r.top,left:r.left,width:r.width,height:r.height});
    const popW=Math.min(350,window.innerWidth-32),popH=225;
    let left=Math.max(16,Math.min(window.innerWidth-popW-16,r.left+r.width/2-popW/2));
    let top=r.bottom+16;
    if(top+popH>window.innerHeight-16) top=Math.max(16,r.top-popH-16);
    setPlacement({top,left});
   },240);
  };

  const id = setTimeout(locate, item.route ? 460 : 40);

  const resize=()=>{
   const el=document.querySelector(item.target);
   if(el){
    const r=el.getBoundingClientRect();
    setRect({top:r.top,left:r.left,width:r.width,height:r.height});
   }
  };
  window.addEventListener('resize',resize);
  window.addEventListener('scroll',resize,true);
  return()=>{
   cancelled = true;
   clearTimeout(id);
   window.removeEventListener('resize',resize);
   window.removeEventListener('scroll',resize,true);
  };
 },[active,step]);

 const next=()=>step===steps.length-1?finish():setStep(x=>x+1),prev=()=>setStep(x=>Math.max(0,x-1));

 return (
  <div className="tour-root">
   {!active && (
    <button className="tour-help" onClick={start} aria-label="Replay the guided tour" title="Replay the guided tour">
     <HelpCircle size={17}/>
    </button>
   )}
   <AnimatePresence>
    {active && (
     <motion.div className="tour-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.22}}>
      <div className="tour-dim"/>
      {rect && (
       <motion.div
        className="tour-spotlight"
        animate={{top:rect.top-7,left:rect.left-7,width:rect.width+14,height:rect.height+14}}
        transition={{type:'spring',stiffness:300,damping:25}}
       />
      )}
      <motion.section
       className="tour-popover"
       style={placement}
       key={step}
       initial={{opacity:0,y:12,scale:.97}}
       animate={{opacity:1,y:0,scale:1}}
       transition={{type:'spring',stiffness:300,damping:25}}
      >
       <div className="tour-topline">
        <span><Sparkles size={13}/> QUICK TOUR</span>
        <button onClick={finish} aria-label="Close tour"><X size={16}/></button>
       </div>
       <div className="tour-progress"><i style={{width:`${(step+1)/steps.length*100}%`}}/></div>
       <small className="tour-count">STEP {String(step+1).padStart(2,'0')} / {String(steps.length).padStart(2,'0')}</small>
       <h2>{steps[step].title}</h2>
       <p>{steps[step].text}</p>
       <div className="tour-controls">
        <button className="tour-skip" onClick={finish}>Skip tour</button>
        <div>
         {step>0&&<button className="tour-prev" onClick={prev}><ArrowLeft size={14}/> Back</button>}
         <button className="tour-next" onClick={next}>
          {step===steps.length-1?<><Check size={14}/> Finish</>:<>Next <ArrowRight size={14}/></>}
         </button>
        </div>
       </div>
      </motion.section>
     </motion.div>
    )}
   </AnimatePresence>
  </div>
 );
}

createRoot(document.getElementById('tour-root')).render(<Tour/>);
