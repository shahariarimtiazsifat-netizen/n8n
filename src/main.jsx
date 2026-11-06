import React,{useEffect,useRef,useState} from 'react';
import{createRoot}from'react-dom/client';
import{AnimatePresence,motion}from'framer-motion';
import confetti from'canvas-confetti';
import{
  Activity,ArrowDownToLine,ArrowUpFromLine,ArrowUpRight,BarChart3,
  Check,CheckCircle2,ChevronDown,ChevronRight,Clock3,Code2,Crown,
  Flame,FolderKanban,Hexagon,Link2,Lock,Menu,MoreHorizontal,
  Pause,Play,Plus,Radio,RotateCcw,Settings2,Shield,Sparkles,
  Target,Timer,Trash2,Trophy,Workflow,X,Zap
} from 'lucide-react';
import{curriculum,phases}from'./data/curriculum';
import QuestGuide from'./components/QuestGuide.jsx';
import './components/N8nyPet.jsx';
import './components/GuidedTour.jsx';
import './style.css';

/* ─── Storage key (bumped to v5 to bust old cache) ─────────────────── */
const KEY = 'n8n_game_cloud_v5';
const today = () => new Date().toISOString().slice(0,10);

/* ─── Default step-progress: 4 unchecked booleans per day ──────────── */
const defaultStepProgress = () =>
  Object.fromEntries(curriculum.map(d => [d.day, [false,false,false,false]]));

function normalizeStepProgress(saved = {}, savedDays = []) {
  const normalized = defaultStepProgress();
  for (const day of curriculum) {
    const savedSteps = saved[day.day] ?? saved[String(day.day)];
    if (Array.isArray(savedSteps)) {
      normalized[day.day] = Array.from({length: 4}, (_, i) => savedSteps[i] === true);
    } else {
      const wasCompleted = savedDays.find(item => item.id === day.id || item.day === day.day)?.completed;
      if (wasCompleted) normalized[day.day] = [true, true, true, true];
    }
  }
  return normalized;
}

/* ─── Initial state factory ─────────────────────────────────────────── */
function initial() {
  return {
    days: curriculum.map(x => ({...x, isBoss: x.isBoss ?? x.boss})),
    currentStreak: 0,
    bestStreak: 0,
    lastCheckInDate: null,
    streakFreezes: 2,
    activityLog: [],
    totalXP: 0,
    godMode: false,
    stepProgress: defaultStepProgress(),
    projects: [
      {id:'ecom',  name:'E-Commerce Support Agent',  tag:'CUSTOMER EXPERIENCE', description:'A helpful AI agent that handles order questions, returns, and customer support around the clock.',status:'Not Started',demoUrl:'',workflowJson:''},
      {id:'lead',  name:'Lead Qualifier & CRM Sync', tag:'SALES AUTOMATION',    description:'Qualify inbound leads, enrich their details, and keep the right CRM records in sync.',          status:'Not Started',demoUrl:'',workflowJson:''},
      {id:'content',name:'Automated Content Engine', tag:'CONTENT OPERATIONS',  description:'Turn ideas into reviewed, channel-ready content with a consistent publishing workflow.',           status:'Not Started',demoUrl:'',workflowJson:''},
    ],
    deals: [],
    timer: {running:false,remaining:7200,mode:'full',startedAt:null,endsAt:null},
  };
}

/* ─── Hydrate from localStorage ─────────────────────────────────────── */
function readState() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (!s) return initial();
    const d = initial();
    const savedDays = Array.isArray(s.days) ? s.days : [];
    const savedSteps = (s.stepProgress && typeof s.stepProgress === 'object') ? s.stepProgress : {};
    const stepProgress = normalizeStepProgress(savedSteps, savedDays);
    return {
      ...d, ...s,
      godMode: Boolean(s.godMode),
      stepProgress,
      days: curriculum.map(x => {
        const old = savedDays.find(y => y.id === x.id || y.day === x.day) || {};
        return {
          ...x, isBoss: x.isBoss ?? x.boss,
          completed:    Boolean(old.completed),
          notes:        typeof old.notes       === 'string' ? old.notes       : '',
          demoUrl:      typeof old.demoUrl     === 'string' ? old.demoUrl     : '',
          workflowJson: typeof old.workflowJson=== 'string' ? old.workflowJson: '',
        };
      }),
      projects: d.projects.map(x => {
        const old = (s.projects||[]).find(y => y.id === x.id) || {};
        return {...x,...old, demoUrl:typeof old.demoUrl==='string'?old.demoUrl:'', workflowJson:old.workflowJson||''};
      }),
      deals:      Array.isArray(s.deals)      ? s.deals      : [],
      activityLog:Array.isArray(s.activityLog)? s.activityLog: [],
    };
  } catch { return initial(); }
}

/* ─── Utility helpers ───────────────────────────────────────────────── */
function fireworks(opts) {
  try { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) confetti(opts); } catch {}
}
function partyPoppers() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fire = o => confetti(o);
    const c = ['#10b981','#8b5cf6','#ff6d5a','#ffd166','#ffffff','#67e4ff'];
    fire({particleCount:80,spread:62,origin:{x:.06,y:.64},colors:c,scalar:1.05});
    fire({particleCount:80,spread:62,origin:{x:.94,y:.64},colors:c,scalar:1.05});
    setTimeout(()=>fire({particleCount:130,spread:118,origin:{x:.5,y:.36},colors:c}),140);
    setTimeout(()=>fire({particleCount:60,spread:135,origin:{x:.5,y:.52},colors:['#ffd166','#ff6d5a','#ffffff']}),300);
    setTimeout(()=>{
      fire({particleCount:40,spread:150,origin:{x:.25,y:.45},colors:c});
      fire({particleCount:40,spread:150,origin:{x:.75,y:.45},colors:c});
    },460);
  } catch {}
}
function playSound(kind='click') {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const ctx = playSound.ctx || (playSound.ctx = new C());
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const seqs = {
      click:   [880,.05,.0],
      nav:     [660,.06,.0],
      success: [523,.12,.0,659,.12,.11,784,.18,.22],
      complete:[784,.14,.0,988,.16,.13,1318,.2,.27],
      pop:     [440,.06,.0,660,.06,.09],
    };
    const seq = seqs[kind] || seqs.click;
    for (let i=0;i<seq.length;i+=3) {
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type = (kind==='click'||kind==='nav') ? 'triangle' : 'sine';
      o.frequency.value = seq[i];
      g.gain.setValueAtTime(0, now+seq[i+2]);
      g.gain.linearRampToValueAtTime(seq[i+1], now+seq[i+2]+.012);
      g.gain.exponentialRampToValueAtTime(.0001, now+seq[i+2]+seq[i+1]+.04);
      o.connect(g); g.connect(ctx.destination);
      o.start(now+seq[i+2]); o.stop(now+seq[i+2]+seq[i+1]+.06);
    }
  } catch {}
}

/* ─── AnimatedNumber ────────────────────────────────────────────────── */
function AnimatedNumber({value=0, format=n=>n, className}) {
  const [display,setDisplay] = useState(0), prev = useRef(0);
  useEffect(() => {
    const from=prev.current, to=Number(value)||0;
    prev.current = to;
    if (from===to || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisplay(to); return; }
    let raf, start;
    const dur=820;
    const tick = t => {
      if (start===undefined) start=t;
      const p=Math.min(1,(t-start)/dur), e=1-Math.pow(1-p,3);
      setDisplay(from+(to-from)*e);
      if (p<1) raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf);
  },[value]);
  return <span className={className}>{format(Math.round(display))}</span>;
}

/* ─── Pointer FX hook ───────────────────────────────────────────────── */
function usePointerFX() {
  useEffect(()=>{
    const root=document.documentElement;
    let raf=0,px=innerWidth*.5,py=innerHeight*.3;
    const paint=()=>{raf=0;root.style.setProperty('--pointer-x',`${px}px`);root.style.setProperty('--pointer-y',`${py}px`);};
    const move=e=>{px=e.clientX;py=e.clientY;if(!raf)raf=requestAnimationFrame(paint);const el=e.target instanceof Element?e.target.closest('.card,.phase-card,.project-card'):null;if(el){const r=el.getBoundingClientRect();el.style.setProperty('--mx',`${e.clientX-r.left}px`);el.style.setProperty('--my',`${e.clientY-r.top}px`);el.style.setProperty('--rx',`${(((e.clientY-r.top)/r.height)-.5)*-3.2}deg`);el.style.setProperty('--ry',`${(((e.clientX-r.left)/r.width)-.5)*3.2}deg`);}};
    const ripple=e=>{const b=e.target instanceof Element?e.target.closest('.checkin-btn,.export-btn,.timer-primary,.timer-reset,.complete-toggle,.tour-next,.focus-cta,.icon-btn,.add-small,.vault-actions button,.nav-item'):null;if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='click-ripple';s.style.left=`${e.clientX-r.left}px`;s.style.top=`${e.clientY-r.top}px`;b.appendChild(s);setTimeout(()=>s.remove(),620);};
    const sound=e=>{const b=e.target instanceof Element?e.target.closest('button'):null;if(!b||b.disabled)return;const kind=b.classList.contains('checkin-btn')?'success':b.classList.contains('complete-toggle')?'complete':b.classList.contains('nav-item')?'nav':b.classList.contains('export-btn')||b.classList.contains('add-small')?'pop':'click';playSound(kind);};
    window.addEventListener('pointermove',move,{passive:true});
    window.addEventListener('pointerdown',ripple,{passive:true});
    window.addEventListener('pointerdown',sound,{passive:true});
    return ()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',ripple);window.removeEventListener('pointerdown',sound);cancelAnimationFrame(raf);};
  },[]);
}

/* ─── JsonVault (used in PortfolioPage) ─────────────────────────────── */
function JsonVault({value,onChange,downloadName='n8n-workflow.json'}) {
  const input=useRef(null);
  const read=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>onChange(String(r.result||''));r.readAsText(f);e.target.value='';};
  const save=()=>{if(!value)return;const b=new Blob([value],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=downloadName;a.click();URL.revokeObjectURL(a.href);};
  return (
    <div className="json-vault">
      <div className="vault-actions">
        <button type="button" onClick={()=>input.current?.click()}>↑ Upload .json</button>
        <button type="button" onClick={save} disabled={!value}>↓ Download backup</button>
        <input ref={input} hidden type="file" accept=".json,application/json" onChange={read}/>
      </div>
      <textarea className="workflow-input" aria-label="Workflow JSON backup" placeholder="Paste workflow JSON or upload an exported .json file…" value={value} onChange={e=>onChange(e.target.value)}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════════════ */
function App() {
  usePointerFX();
  const [state,     setState]     = useState(readState);
  const [activeDay, setActiveDay] = useState(1);
  const [tab,       setTab]       = useState('Overview');
  const [modal,     setModal]     = useState(null);
  const [dealDraft, setDealDraft] = useState({name:'',type:'AI Automation',value:'',retainer:'',status:'Pitched'});
  const [simDeals,  setSimDeals]  = useState(3);
  const [simRetainer,setSimRetainer] = useState(20000);
  const [notice,    setNotice]    = useState('');
  const [mobileOpen,setMobileOpen]= useState(false);
  const [clock,     setClock]     = useState(Date.now());
  const [theme,     setTheme]     = useState(()=>{try{return localStorage.getItem('n8n_theme')==='light'?'light':'dark'}catch{return'dark';}});
  const fileRef  = useRef(null);
  const scrollRef= useRef(null);

  /* ── Persist state ── */
  useEffect(()=>{ try{localStorage.setItem(KEY,JSON.stringify(state));}catch{} },[state]);
  useEffect(()=>{ try{localStorage.setItem('n8n_theme',theme);document.documentElement.dataset.theme=theme;}catch{} },[theme]);

  /* ── Theme event bridge (N8ny bot sets theme) ── */
  useEffect(()=>{
    const onTheme=e=>{if(e&&e.detail)setTheme(e.detail);};
    window.addEventListener('n8n-theme',onTheme);
    return ()=>window.removeEventListener('n8n-theme',onTheme);
  },[]);

  /* ── Focus timer event bridge ── */
  useEffect(()=>{
    const start=()=>setState(s=>({...s,timer:{mode:'full',remaining:7200,running:true,startedAt:Date.now(),endsAt:Date.now()+7200000}}));
    window.addEventListener('n8n-start-focus',start);
    return ()=>window.removeEventListener('n8n-start-focus',start);
  },[]);

  /* ── Clock tick ── */
  useEffect(()=>{ const id=setInterval(()=>setClock(Date.now()),500); return ()=>clearInterval(id); },[]);

  /* ── Timer expiry ── */
  useEffect(()=>{
    if (state.timer.running && state.timer.endsAt && clock>=state.timer.endsAt) {
      setState(s=>({...s,timer:{...s.timer,running:false,remaining:0,endsAt:null}}));
      try {
        const c=new(window.AudioContext||window.webkitAudioContext)();
        for(let i=0;i<3;i++){const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=740;g.gain.value=.08;o.start(c.currentTime+i*.18);o.stop(c.currentTime+i*.18+.12);}
      } catch {}
      notify('Deep work session complete — nice work!');
    }
  },[clock,state.timer.running,state.timer.endsAt]);

  /* ── Keyboard shortcuts ── */
  useEffect(()=>{
    const onKey=e=>{
      const t=e.target;
      if (t instanceof Element && t.closest('input,textarea,select,[contenteditable="true"]')) return;
      const map={'1':'Overview','2':'Learning path','3':'Portfolio','4':'Revenue'};
      if (map[e.key]){e.preventDefault();setTab(map[e.key]);setMobileOpen(false);}
    };
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[]);

  /* ── Scroll to top on tab change ── */
  useEffect(()=>{ window.scrollTo({top:0,behavior:'smooth'}); },[tab]);

  /* ── Scroll progress bar ── */
  useEffect(()=>{
    const bar=scrollRef.current;
    if (!bar) return;
    let raf=0;
    const paint=()=>{raf=0;const h=document.documentElement.scrollHeight-innerHeight;bar.style.width=`${h>0?Math.min(100,scrollY/h*100):0}%`;};
    const onScroll=()=>{if(!raf)raf=requestAnimationFrame(paint);};
    window.addEventListener('scroll',onScroll,{passive:true});
    paint();
    return ()=>{window.removeEventListener('scroll',onScroll);cancelAnimationFrame(raf);};
  },[]);

  /* ── Computed values ── */
  const complete   = state.days.filter(d=>d.completed).length;
  const nextIncomplete = state.days.find(d=>!d.completed) || state.days[20];
  const earned     = state.deals.reduce((n,d)=>n+(d.status==='Closed Paid'?Number(d.value)||0:0),0);
  const monthly    = state.deals.reduce((n,d)=>n+(d.status==='Closed Paid'?Number(d.retainer)||0:0),0);
  const rank       = state.totalXP<501?'JSON Apprentice':state.totalXP<1101?'Webhook Wrangler':state.totalXP<1601?'RAG Engineer':'AI Systems Architect';
  const rankNext   = state.totalXP<501?500:state.totalXP<1101?1100:state.totalXP<1601?1600:2100;
  const rankFloor  = state.totalXP<501?0:state.totalXP<1101?501:state.totalXP<1601?1101:1601;
  const rankPct    = Math.min(100,Math.max(0,(state.totalXP-rankFloor)/(rankNext-rankFloor)*100));
  const activeDays = new Set(state.activityLog);
  const week       = Array.from({length:21},(_,i)=>{const dt=new Date();dt.setDate(dt.getDate()-20+i);const key=dt.toISOString().slice(0,10);return{key,day:dt.getDate(),active:activeDays.has(key),today:key===today(),future:key>today()};});
  const phaseProgress = phases.map(p=>({...p,done:state.days.filter(d=>d.phase===p.id&&d.completed).length,total:state.days.filter(d=>d.phase===p.id).length}));
  const simTotal   = simDeals*35000+simRetainer*2;
  const goalPct    = Math.min(100,earned/100000*100);

  /* ── Revenue goal celebrate ── */
  const prevEarned = useRef(earned);
  useEffect(()=>{
    if (prevEarned.current<100000 && earned>=100000) {
      fireworks({particleCount:180,spread:100,origin:{y:.62},colors:['#10b981','#8b5cf6','#ff6d5a','#f7d794']});
      notify('৳1,00,000 goal reached — incredible!');
    }
    prevEarned.current=earned;
  },[earned]);

  /* ── Helpers ── */
  const notify = m => { setNotice(m); setTimeout(()=>setNotice(''),2800); };
  const fmt    = n => new Intl.NumberFormat('en-BD').format(n);
  const time   = state.timer.running&&state.timer.endsAt ? Math.max(0,Math.ceil((state.timer.endsAt-clock)/1000)) : state.timer.remaining;
  const timeStr= `${String(Math.floor(time/3600)).padStart(2,'0')}:${String(Math.floor(time%3600/60)).padStart(2,'0')}:${String(time%60).padStart(2,'0')}`;

  /* ── God Mode toggle ── */
  const toggleGodMode = () => {
    setState(s => ({...s, godMode: !s.godMode}));
    notify(state.godMode ? 'God Mode OFF — progression rules back on.' : '⚡ God Mode ON — all levels unlocked!');
  };

  /* ── Day unlock helper ── */
  const isDayUnlocked = (dayObj) => {
    if (!dayObj) return false;
    return state.godMode || dayObj.day === 1 || state.days.find(d => d.day === dayObj.day - 1)?.completed === true;
  };

  /* ── Check-in ── */
  function checkIn() {
    setState(s => {
      const t=today();
      if (s.lastCheckInDate===t) return s;
      let streak=s.currentStreak,freezes=s.streakFreezes;
      if (s.lastCheckInDate) {
        const diff=Math.round((new Date(t)-new Date(s.lastCheckInDate))/86400000);
        if (diff===1) streak+=1;
        else if (diff>1) { if(freezes>0){freezes--;streak+=1;}else streak=1; }
      } else streak=1;
      return {...s,currentStreak:streak,bestStreak:Math.max(streak,s.bestStreak),streakFreezes:freezes,lastCheckInDate:t,activityLog:[...new Set([...s.activityLog,t])]};
    });
    partyPoppers(); playSound('success'); notify('Study session logged. Keep your streak alive!');
  }

  /* ── Complete a day (called from QuestGuide) ── */
  function completeDay(id) {
    const day = state.days.find(d => d.id === id);
    if (!day || day.completed) return;
    const isBoss = day.isBoss === true;
    const xpEarned = isBoss ? 350 : 100;
    setState(s => {
      let xp = s.totalXP + xpEarned;
      const days = s.days.map(d => d.day===day.day ? {...d, completed:true} : d);
      const t = today();
      let streak=s.currentStreak, freezes=s.streakFreezes;
      if (s.lastCheckInDate!==t) {
        if (s.lastCheckInDate) {
          const diff=Math.round((new Date(t)-new Date(s.lastCheckInDate))/86400000);
          if (diff===1) streak++;
          else if (diff>1) { if(freezes>0){freezes--;streak++;}else streak=1; }
        } else streak=1;
      }
      return {...s,days,totalXP:xp,currentStreak:streak,bestStreak:Math.max(streak,s.bestStreak),streakFreezes:freezes,lastCheckInDate:t,activityLog:[...new Set([...s.activityLog,t])]};
    });
    // Celebration
    partyPoppers();
    playSound('complete');
    if (isBoss) {
      fireworks({particleCount:200,spread:120,origin:{y:.5},colors:['#ffd166','#ff6d5a','#8b5cf6','#10b981','#ffffff']});
      notify(`👑 BOSS QUEST COMPLETE! +${xpEarned} XP earned!`);
    } else {
      fireworks({particleCount:95,spread:78,origin:{y:.6},colors:['#10b981','#8b5cf6','#ff6d5a','#b6f878']});
      notify(`🏆 Level ${id} complete! +${xpEarned} XP`);
    }
    // Auto-advance to next day
    if (day.day < curriculum.length) {
      setTimeout(() => setActiveDay(day.day + 1), 900);
    }
  }

  /* ── Toggle a mini-step ── */
  function toggleStep(dayId, stepIndex) {
    setState(s => {
      const prev = s.stepProgress[dayId] || [false,false,false,false];
      const next = prev.map((v,i) => i===stepIndex ? !v : v);
      return {...s, stepProgress: {...s.stepProgress, [dayId]: next}};
    });
    playSound('click');
    // Dispatch custom event so N8ny pet cheers!
    window.dispatchEvent(new CustomEvent('n8n-step-check', {detail:{dayId,stepIndex}}));
  }

  /* ── Mark all steps for a day at once ── */
  function markAllSteps(dayId) {
    setState(s => ({
      ...s,
      stepProgress: {
        ...s.stepProgress,
        [dayId]: [true, true, true, true]
      }
    }));
    playSound('click');
    window.dispatchEvent(new CustomEvent('n8n-step-check', {detail:{dayId, stepIndex: 3}}));
  }

  /* ── toggleDay (fixed for boss XP consistency) ── */
  function toggleDay(id) {
    const dayObj = state.days.find(d => d.id === id);
    const wasDone = dayObj?.completed;
    const xpAmt = dayObj?.isBoss ? 350 : 100;
    setState(s => {
      let xp = s.totalXP;
      const days = s.days.map(d => d.day === dayObj.day ? { ...d, completed: !d.completed } : d);
      if (wasDone) xp = Math.max(0, xp - xpAmt);
      else xp += xpAmt;
      let next = { ...s, days, totalXP: xp };
      if (!wasDone) {
        const t = today();
        let streak = s.currentStreak, freezes = s.streakFreezes;
        if (s.lastCheckInDate !== t) {
          if (s.lastCheckInDate) {
            const diff = Math.round((new Date(t) - new Date(s.lastCheckInDate)) / 86400000);
            if (diff === 1) streak++;
            else if (diff > 1) {
              if (freezes > 0) { freezes--; streak++; } else streak = 1;
            }
          } else streak = 1;
        }
        next = { ...next, currentStreak: streak, bestStreak: Math.max(streak, s.bestStreak), streakFreezes: freezes, lastCheckInDate: t, activityLog: [...new Set([...s.activityLog, t])] };
      }
      return next;
    });
    if (!wasDone) {
      fireworks({ particleCount: 95, spread: 78, origin: { y: .6 }, colors: ['#10b981', '#8b5cf6', '#ff6d5a', '#b6f878'] });
      playSound('complete');
      notify(`Day complete — +${xpAmt} XP earned!`);
    }
  }

  function updateDay(id,field,value){ setState(s=>({...s,days:s.days.map(d=>d.id===id?{...d,[field]:value}:d)})); }
  function updateProject(id,field,value){ setState(s=>({...s,projects:s.projects.map(p=>p.id===id?{...p,[field]:value}:p)})); }
  function startTimer(mode='full'){const secs=mode==='full'?7200:mode==='theory'?1800:mode==='reverse'?1800:3600;setState(s=>({...s,timer:{mode,remaining:secs,running:true,startedAt:Date.now(),endsAt:Date.now()+secs*1000}}));}
  function pauseTimer(){setState(s=>{const remaining=s.timer.endsAt?Math.max(0,Math.ceil((s.timer.endsAt-Date.now())/1000)):s.timer.remaining;return{...s,timer:{...s.timer,remaining,running:false,endsAt:null}};});}
  function resumeTimer(){setState(s=>({...s,timer:{...s.timer,running:true,endsAt:Date.now()+s.timer.remaining*1000}}));}
  function resetTimer(){setState(s=>({...s,timer:{...s.timer,remaining:s.timer.mode==='full'?7200:s.timer.mode==='theory'||s.timer.mode==='reverse'?1800:3600,running:false,endsAt:null}}));}

  function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`n8n-architect-${today()}.json`;a.click();URL.revokeObjectURL(a.href);notify('Backup exported.');}
  function importData(e){
    const file=e.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const parsed=JSON.parse(reader.result);
        if(!parsed||typeof parsed!=='object'||!Array.isArray(parsed.days)||!Array.isArray(parsed.projects)||!Array.isArray(parsed.deals))throw Error();
        const defaults=initial();
        const importedDays=parsed.days;
        const days=curriculum.map(day=>{
          const old=importedDays.find(item=>item.id===day.id||item.day===day.day)||{};
          return{...day,isBoss:day.isBoss??day.boss,completed:Boolean(old.completed),notes:typeof old.notes==='string'?old.notes:'',demoUrl:typeof old.demoUrl==='string'?old.demoUrl:'',workflowJson:typeof old.workflowJson==='string'?old.workflowJson:''};
        });
        const importedProgress=parsed.stepProgress&&typeof parsed.stepProgress==='object'?parsed.stepProgress:{};
        setState({...defaults,...parsed,godMode:Boolean(parsed.godMode),stepProgress:normalizeStepProgress(importedProgress,importedDays),days});
        notify('Backup restored successfully.');
      }catch{notify('That file is not a valid n8n Architect backup.');}
      e.target.value='';
    };
    reader.readAsText(file);
  }

  function addDeal(){if(!dealDraft.name.trim()||!dealDraft.value)return;setState(s=>({...s,deals:[...s.deals,{...dealDraft,id:crypto.randomUUID()}]}));setDealDraft({name:'',type:'AI Automation',value:'',retainer:'',status:'Pitched'});setModal(null);notify('Lead added to your pipeline.');}
  function updateDeal(id,key,value){const prev=state.deals.find(d=>d.id===id);setState(s=>({...s,deals:s.deals.map(d=>d.id===id?{...d,[key]:value}:d)}));if(key==='status'&&value==='Closed Paid'&&prev?.status!=='Closed Paid'){fireworks({particleCount:120,spread:85,origin:{y:.55},colors:['#10b981','#8b5cf6','#ff6d5a','#f7d794']});partyPoppers();playSound('success');notify('Deal closed — revenue added!');}}
  function deleteDeal(id){ setState(s=>({...s,deals:s.deals.filter(d=>d.id!==id)})); }

  /* ── NAV ── */
  const navItems = [['Overview',Activity],['Learning path',Workflow],['Portfolio',FolderKanban],['Revenue',BarChart3]];

  return (
    <div className="app-shell">
      <div className="ambient" aria-hidden="true"><i/><i/><i/></div>
      <div className="cursor-glow" aria-hidden="true"/>
      <div className="scroll-progress" aria-hidden="true"><i ref={scrollRef}/></div>

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${mobileOpen?'open':''}`}>
        <a href="#overview" className="brand">
          <span className="brand-mark"><Hexagon size={24}/><span>n</span></span>
          <span><b>n8n architect</b><small>MASTERY SPRINT</small></span>
        </a>
        <div className="side-label">WORKSPACE</div>
        <nav>
          {navItems.map(([n,I])=>(
            <button className={`nav-item ${tab===n?'selected':''}`} onClick={()=>{setTab(n);setMobileOpen(false);playSound('nav');}} key={n}>
              {tab===n && <motion.span layoutId="nav-pill" className="nav-pill" transition={{type:'spring',stiffness:420,damping:34}}/>}
              <I size={17}/>{n}{n==='Learning path'&&<span className="nav-count">21</span>}
            </button>
          ))}
        </nav>
        <div className="side-label side-label-gap">YOUR PROGRESS</div>
        <div className="side-rank">
          <div className="rank-icon"><Zap size={16}/></div>
          <div><small>CURRENT RANK</small><strong>{rank}</strong></div>
          <ChevronRight size={15}/>
        </div>
        <div className="rank-track"><i style={{width:`${rankPct}%`}}/></div>
        <div className="rank-meta">
          <span><AnimatedNumber value={state.totalXP} format={n=>Math.round(n).toLocaleString()}/> XP</span>
          <span>{rankNext} XP</span>
        </div>
        <div className="side-spacer"/>
        <div className="streak-card">
          <div className="streak-head"><Flame size={17}/><span>Current streak</span><strong>{state.currentStreak} days</strong></div>
          <div className="streak-dots">
            {week.slice(-7).map(d=>(
              <i title={d.key} className={`${d.active?'dot-active':''} ${d.today?'dot-today':''}`} key={d.key}>
                {d.active?<Check size={9}/>:null}
              </i>
            ))}
          </div>
          <div className="streak-foot"><span>{state.streakFreezes} streak freezes</span><span className="freeze-icon">❄</span></div>
        </div>
        <button className="side-settings" onClick={exportData}><Settings2 size={16}/> Export your progress <ArrowUpRight size={14}/></button>
        <div className="profile">
          <div className="avatar">A</div>
          <div><b>My workspace</b><small>Personal sprint</small></div>
          <MoreHorizontal size={19}/>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)}><Menu/></button>
          <div className="crumb">Workspace <ChevronRight size={13}/> <b>{tab}</b></div>
          <div className="top-actions">
            <div className="today-label">
              <span className={`header-streak ${state.currentStreak>=7?'plasma':''}`} title={`${state.currentStreak} day streak`}>
                <Flame size={14}/>{state.currentStreak}
              </span>
              <span className="live-dot"/> DAY {nextIncomplete.day} <span className="muted">OF 21</span>
            </div>

            {/* ⚡ GOD MODE TOGGLE */}
            <button
              className={`god-mode-btn ${state.godMode?'god-mode-on':''}`}
              onClick={toggleGodMode}
              title={state.godMode ? 'God Mode is ON — click to disable' : 'Enable God Mode to unlock all levels'}
            >
              <Zap size={12}/>
              {state.godMode ? '⚡ God Mode (Unlock All): ON' : '⚡ God Mode (Unlock All)'}
            </button>

            <button className="icon-btn" title="Import JSON" onClick={()=>fileRef.current?.click()}>
              <ArrowUpFromLine size={16}/><span>Import</span>
            </button>
            <button className="export-btn" onClick={exportData}><ArrowDownToLine size={15}/> Export JSON</button>
            <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={importData}/>
          </div>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="page-content" key={tab}
            initial={{opacity:0,y:24,filter:'blur(10px)',scale:.985}}
            animate={{opacity:1,y:0,filter:'blur(0px)',scale:1}}
            exit={{opacity:0,y:-16,filter:'blur(8px)',scale:.99}}
            transition={{duration:.42,ease:[.22,.9,.28,1]}}
          >
            {tab==='Overview' ? (
              <>
                <div className="page-heading">
                  <div>
                    <div className="eyebrow"><span className="eyebrow-dot"/> YOUR PERSONAL AUTOMATION SPRINT</div>
                    <h1>Build your unfair <em>advantage.</em></h1>
                    <p>21 days to master n8n. 8 weeks to ৳1,00,000.</p>
                  </div>
                  <button className="checkin-btn" onClick={checkIn}><CheckCircle2 size={16}/> Log daily study session</button>
                </div>
                <section className="hero-grid">
                  <div className="card mastery-card">
                    <div className="card-top">
                      <div className="section-overline"><span className="green-pulse"/> MASTERY TRACKER</div>
                      <div className="days-left">{21-complete} DAYS LEFT <ArrowUpRight size={13}/></div>
                    </div>
                    <div className="mastery-main">
                      <div>
                        <div className="big-stat"><AnimatedNumber value={complete}/><span> / 21</span></div>
                        <div className="stat-caption">learning days completed</div>
                      </div>
                      <div className="circle-progress" style={{'--p':`${complete/21*100}%`}}>
                        <div><strong><AnimatedNumber value={complete/21*100} format={n=>Math.round(n)}/><small>%</small></strong><span>COMPLETE</span></div>
                      </div>
                    </div>
                    <div className="progress-track"><i style={{width:`${complete/21*100}%`}}/></div>
                    <div className="progress-foot">
                      <span><Zap size={13}/><AnimatedNumber value={state.totalXP} format={n=>Math.round(n).toLocaleString()}/> XP earned</span>
                      <span><Shield size={13}/>{state.streakFreezes} freezes available</span>
                    </div>
                  </div>
                  <div className="card focus-card">
                    <div className="focus-top">
                      <div className="section-overline">TODAY'S FOCUS</div>
                      <button className="plain-icon" onClick={()=>setTab('Learning path')}><ArrowUpRight size={16}/></button>
                    </div>
                    <div className="focus-day">DAY {nextIncomplete.day} <span>·</span> PHASE {nextIncomplete.phase}</div>
                    <h3>{state.days.find(d=>!d.completed)?.title||'All 21 days complete!'}</h3>
                    <p>{state.days.find(d=>!d.completed)?.deliverable||'You have earned the title of AI Systems Architect.'}</p>
                    <button className="text-link" onClick={()=>{setTab('Learning path');setActiveDay(nextIncomplete.day);}}>Continue learning <ChevronRight size={14}/></button>
                  </div>
                </section>

                <section className="quick-grid">
                  <div className="card streak-panel">
                    <div className="panel-heading">
                      <div><span className="section-overline">CONSISTENCY BUILDS MASTERY</span><h2>Your study rhythm</h2></div>
                      <button className="soft-tag"><Flame size={13}/>{state.currentStreak} day streak</button>
                    </div>
                    <div className="heatmap">
                      {week.map((d,i)=>(
                        <div className={`heat-cell ${d.active?'heat-on':''} ${d.today?'heat-today':''} ${d.future?'heat-future':''}`} key={i} title={d.key}>
                          {d.active?<Check size={13}/>:d.today?'TODAY':''}
                        </div>
                      ))}
                    </div>
                    <div className="heat-legend">
                      <span>{week[0].key.slice(5)} — {week[20].key.slice(5)}</span>
                      <span className="legend-key"><i/> Study session logged</span>
                    </div>
                  </div>
                  <div className="card timer-panel">
                    <div className="timer-head"><div><span className="section-overline">DEEP WORK</span><h2>Focus timer</h2></div><Timer size={18}/></div>
                    <div className="timer-display">{timeStr}</div>
                    <div className="timer-sub">
                      <span className="timer-status"><i className={state.timer.running?'status-live':''}/>{state.timer.running?'SESSION IN PROGRESS':'2-HOUR SPRINT'}</span>
                      <span>THEORY · BUILD · SHIP</span>
                    </div>
                    <div className="timer-actions">
                      {state.timer.running
                        ? <button className="timer-primary" onClick={pauseTimer}><Pause size={15}/> Pause</button>
                        : <button className="timer-primary" onClick={()=>state.timer.remaining!==7200&&state.timer.remaining!==0?resumeTimer():startTimer('full')}><Play size={15} fill="currentColor"/> {time===0||time===7200?'Start session':'Resume'}</button>}
                      <button className="timer-reset" onClick={resetTimer}><RotateCcw size={14}/> Reset</button>
                    </div>
                    <div className="timer-phases">
                      <span><i className="phase-theory"/>30m theory</span>
                      <span><i className="phase-reverse"/>30m explore</span>
                      <span><i className="phase-build"/>60m build</span>
                    </div>
                    <div className="mini-starts">
                      <button onClick={()=>startTimer('theory')}>30m Theory</button>
                      <button onClick={()=>startTimer('reverse')}>30m Explore</button>
                      <button onClick={()=>startTimer('build')}>60m Build</button>
                    </div>
                  </div>
                </section>

                <div className="section-title-row">
                  <div><span className="section-overline">YOUR 21-DAY ROADMAP</span><h2>One day at a time.</h2></div>
                  <button className="view-all" onClick={()=>setTab('Learning path')}>View learning path <ArrowUpRight size={14}/></button>
                </div>
                <div className="phase-grid">
                  {phaseProgress.map(p=>(
                    <button
                      className="phase-card"
                      key={p.id}
                      onClick={() => {
                        setTab('Learning path');
                        const phaseDays = state.days.filter(d => d.phase === p.id);
                        const target = phaseDays.find(d => !d.completed && isDayUnlocked(d))
                          || phaseDays.find(d => isDayUnlocked(d))
                          || state.days.find(d => !d.completed && isDayUnlocked(d))
                          || state.days[0];
                        setActiveDay(target.id);
                      }}
                    >
                      <div className="phase-card-head"><span className="phase-no">{p.icon}</span><span className="phase-count">{p.done}/{p.total} DAYS</span></div>
                      <h3>{p.name}</h3>
                      <span className="phase-range">{p.range}</span>
                      <div className="phase-line"><i style={{width:`${p.done/p.total*100}%`}}/></div>
                    </button>
                  ))}
                </div>

                <section className="revenue-preview card">
                  <div className="rev-icon"><Target size={19}/></div>
                  <div className="rev-copy">
                    <span className="section-overline">THE 8-WEEK REVENUE SPRINT</span>
                    <h2>৳<AnimatedNumber value={earned} format={fmt}/> <span>of ৳1,00,000 earned</span></h2>
                    <div className="rev-bar"><i style={{width:`${goalPct}%`}}/></div>
                  </div>
                  <div className="rev-right">
                    <strong>{Math.round(goalPct)}%</strong>
                    <button onClick={()=>setTab('Revenue')}>Open pipeline <ArrowUpRight size={14}/></button>
                  </div>
                </section>
              </>
            ) : tab==='Learning path' ? (
              <LearningPage
                state={state}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                completeDay={completeDay}
                toggleStep={toggleStep}
                markAllSteps={markAllSteps}
                updateDay={updateDay}
                phaseProgress={phaseProgress}
                isDayUnlocked={isDayUnlocked}
                notify={notify}
              />
            ) : tab==='Portfolio' ? (
              <PortfolioPage state={state} updateProject={updateProject}/>
            ) : (
              <RevenuePage
                state={state} fmt={fmt} earned={earned} monthly={monthly}
                goalPct={goalPct} simDeals={simDeals} setSimDeals={setSimDeals}
                simRetainer={simRetainer} setSimRetainer={setSimRetainer}
                simTotal={simTotal} addDeal={()=>setModal('deal')}
                updateDeal={updateDeal} deleteDeal={deleteDeal}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── DEAL MODAL ── */}
      {modal==='deal' && (
        <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal">
            <div className="modal-head">
              <div><span className="section-overline">NEW OPPORTUNITY</span><h2>Add a client lead</h2></div>
              <button className="plain-icon" onClick={()=>setModal(null)}><X size={18}/></button>
            </div>
            <label>Client name<input autoFocus placeholder="e.g. Northstar Commerce" value={dealDraft.name} onChange={e=>setDealDraft({...dealDraft,name:e.target.value})}/></label>
            <label>Project type
              <select value={dealDraft.type} onChange={e=>setDealDraft({...dealDraft,type:e.target.value})}>
                {['AI Automation','E-commerce agent','Lead qualification','Content engine','Custom workflow','Other'].map(x=><option key={x}>{x}</option>)}
              </select>
            </label>
            <div className="modal-fields">
              <label>Deal value (BDT)<input type="number" placeholder="50000" value={dealDraft.value} onChange={e=>setDealDraft({...dealDraft,value:e.target.value})}/></label>
              <label>Monthly retainer<input type="number" placeholder="10000" value={dealDraft.retainer} onChange={e=>setDealDraft({...dealDraft,retainer:e.target.value})}/></label>
            </div>
            <label>Pipeline stage
              <select value={dealDraft.status} onChange={e=>setDealDraft({...dealDraft,status:e.target.value})}>
                {['Pitched','Beta Deal','Closed Paid'].map(x=><option key={x}>{x}</option>)}
              </select>
            </label>
            <div className="modal-actions">
              <button className="timer-reset" onClick={()=>setModal(null)}>Cancel</button>
              <button className="export-btn" onClick={addDeal}><Plus size={15}/> Add to pipeline</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      <AnimatePresence>
        {notice && (
          <motion.div className="toast" initial={{opacity:0,y:18,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:.96}} transition={{type:'spring',stiffness:380,damping:26}}>
            <CheckCircle2 size={17}/>{notice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LEARNING PAGE  — left sidebar day map + right QuestGuide panel
═══════════════════════════════════════════════════════════════════════ */
function LearningPage({state, activeDay, setActiveDay, completeDay, toggleStep, markAllSteps, updateDay, phaseProgress, isDayUnlocked, notify}) {
  const [selectedPhase, setSelectedPhase] = useState(() => {
    // Auto-open the phase that contains the active day
    const d = state.days.find(x => x.id === activeDay);
    return d ? d.phase : 1;
  });
  const [shakingDayId, setShakingDayId] = useState(null);

  // Auto-expand the phase accordion when activeDay changes (e.g. Next Day, auto-advance)
  useEffect(() => {
    const d = state.days.find(x => x.id === activeDay);
    if (d && d.phase !== selectedPhase) {
      setSelectedPhase(d.phase);
    }
  }, [activeDay]);

  const day = state.days.find(d => d.id === activeDay) || state.days[0];
  const steps = state.stepProgress?.[day.id] || [false,false,false,false];
  const fmtPhase = p => phaseProgress.find(x => x.id === p);

  function handleSelectDay(d) {
    if (!isDayUnlocked(d)) {
      setShakingDayId(d.id);
      setTimeout(() => setShakingDayId(null), 550);
      notify(`Complete Level ${d.day - 1} first, or enable God Mode!`);
      return;
    }
    setActiveDay(d.id);
  }

  const nextDayObj = state.days.find(d => d.id === day.id + 1);
  const isNextUnlocked = day.id >= 21 || (nextDayObj ? isDayUnlocked(nextDayObj) : false);

  return (
    <>
      <div className="page-heading subpage-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot"/> THE LEARNING PATH</div>
          <h1>Build it <em>from the ground up.</em></h1>
          <p>21 focused days. Every concept ends in a real, portfolio-ready build.</p>
        </div>
        <div className="learning-xp">
          <Zap size={15}/>
          <AnimatedNumber value={state.totalXP} format={n=>Math.round(n).toLocaleString()}/> XP
          <span>·</span> {state.days.filter(d=>d.completed).length}/21 days
        </div>
      </div>

      <div className="learning-layout">
        {/* ── LEFT: Phased day list ── */}
        <div className="roadmap-list">
          {phases.map(p => {
            const q = fmtPhase(p.id);
            return (
              <div className="roadmap-phase" key={p.id}>
                <button
                  className={`roadmap-phase-head ${selectedPhase===p.id?'phase-open':''}`}
                  onClick={()=>setSelectedPhase(selectedPhase===p.id?0:p.id)}
                >
                  <span className="roadmap-num">{p.icon}</span>
                  <span className="roadmap-phase-copy">
                    <b>{p.name}</b>
                    <small>{p.range} <span>·</span> {q.done}/{q.total} complete</small>
                  </span>
                  <span className="roadmap-mini-track"><i style={{width:`${q.done/q.total*100}%`}}/></span>
                  <ChevronDown size={16}/>
                </button>

                {selectedPhase===p.id && (
                  <div className="roadmap-days">
                    {state.days.filter(d=>d.phase===p.id).map(d => {
                      const unlocked = isDayUnlocked(d);
                      return (
                        <button
                          key={d.id}
                          className={[
                            'roadmap-day',
                            activeDay===d.id    ? 'day-selected' : '',
                            d.completed         ? 'day-complete' : '',
                            !unlocked           ? 'day-locked'   : '',
                            d.isBoss            ? 'day-boss'     : '',
                            shakingDayId===d.id ? 'shake'        : '',
                          ].join(' ')}
                          onClick={()=>handleSelectDay(d)}
                          title={!unlocked ? `Complete Level ${d.day-1} first, or enable God Mode!` : d.isBoss ? '👑 BOSS QUEST' : ''}
                        >
                          <span className="day-number">
                            {!unlocked
                              ? <Lock size={11}/>
                              : d.completed
                                ? <Check size={13}/>
                                : String(d.day).padStart(2,'0')}
                          </span>
                          <span className="day-title-small">{d.title}</span>
                          <span className="day-xp">
                            {d.isBoss && <Crown size={10} className="boss-crown"/>}
                            {d.completed
                              ? <><CheckCircle2 size={13}/> DONE</>
                              : d.isBoss ? '+350 XP' : '+100 XP'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── RIGHT: QuestGuide ── */}
        <QuestGuide
          day={day}
          completedSteps={steps}
          onToggleStep={idx => toggleStep(day.id, idx)}
          onMarkAllSteps={() => markAllSteps(day.id)}
          isDayCompleted={day.completed}
          isDayUnlocked={isDayUnlocked(day)}
          isNextUnlocked={isNextUnlocked}
          onCompleteDay={() => completeDay(day.id)}
          notes={day.notes}
          onChangeNotes={v => updateDay(day.id, 'notes', v)}
          demoUrl={day.demoUrl}
          onChangeDemoUrl={v => updateDay(day.id, 'demoUrl', v)}
          workflowJson={day.workflowJson}
          onChangeWorkflowJson={v => updateDay(day.id, 'workflowJson', v)}
          onPrevDay={() => day.id > 1 && setActiveDay(day.id - 1)}
          onNextDay={() => {
            if (isNextUnlocked) {
              setActiveDay(day.id + 1);
            } else {
              notify(`Complete Level ${day.id} first to unlock Day ${day.id + 1}!`);
            }
          }}
          onLockedNext={() => notify(`Complete Level ${day.id} first to unlock Day ${day.id + 1}!`)}
        />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PORTFOLIO PAGE
═══════════════════════════════════════════════════════════════════════ */
function PortfolioPage({state,updateProject}) {
  return (
    <>
      <div className="page-heading subpage-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot"/> PROOF THAT SELLS</div>
          <h1>Three builds. <em>Real proof.</em></h1>
          <p>Your portfolio turns new skills into trust, conversations, and paid work.</p>
        </div>
        <div className="learning-xp"><FolderKanban size={15}/>{state.projects.filter(p=>p.status==='Ready to Pitch').length} / 3 ready to pitch</div>
      </div>
      <div className="project-grid">
        {state.projects.map((p,i)=>(
          <article className="card project-card" key={p.id}>
            <div className={`project-art art-${i}`}>
              <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
              {i===0?<Radio size={37}/>:i===1?<Target size={37}/>:<Sparkles size={37}/>}
              <span className="art-code">0{i+1}</span>
            </div>
            <div className="project-body">
              <span className="section-overline">{p.tag}</span>
              <h2>{p.name}</h2>
              <p>{p.description}</p>
              <label className="field-caption">BUILD STATUS</label>
              <select className={`project-status status-${p.status.toLowerCase().replaceAll(' ','-')}`} value={p.status} onChange={e=>updateProject(p.id,'status',e.target.value)}>
                {['Not Started','Building','Ready to Pitch'].map(x=><option key={x}>{x}</option>)}
              </select>
              <label className="field-caption">DEMO VIDEO URL</label>
              <div className="loom-field project-link">
                <Link2 size={14}/>
                <input placeholder="https://…" value={p.demoUrl} onChange={e=>updateProject(p.id,'demoUrl',e.target.value)}/>
                {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noreferrer"><ArrowUpRight size={14}/></a>}
              </div>
              <label className="field-caption">WORKFLOW JSON BACKUP</label>
              <JsonVault value={p.workflowJson||''} onChange={v=>updateProject(p.id,'workflowJson',v)} downloadName={`project-${p.id}-workflow.json`}/>
              <div className="project-footer">
                <span>{p.status==='Ready to Pitch'?<><CheckCircle2 size={13}/> Pitch ready</>:p.status==='Building'?<><Code2 size={13}/> In progress</>:<><Clock3 size={13}/> On the roadmap</>}</span>
                <span>PROJECT 0{i+1}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   REVENUE PAGE
═══════════════════════════════════════════════════════════════════════ */
function RevenuePage({state,fmt,earned,monthly,goalPct,simDeals,setSimDeals,simRetainer,setSimRetainer,simTotal,addDeal,updateDeal,deleteDeal}) {
  return (
    <>
      <div className="page-heading subpage-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot"/> YOUR 8-WEEK SPRINT</div>
          <h1>Make your first <em>৳1,00,000.</em></h1>
          <p>One clear offer. A handful of good clients. Every deal tracked.</p>
        </div>
        <button className="checkin-btn" onClick={addDeal}><Plus size={16}/> Add a lead</button>
      </div>
      <div className="revenue-stats">
        <div className="card revenue-main-stat">
          <div className="section-overline">CLOSED PAID</div>
          <strong>৳<AnimatedNumber value={earned} format={fmt}/></strong>
          <div className="stat-meter"><i style={{width:`${goalPct}%`}}/></div>
          <span>{Math.round(goalPct)}% of ৳1,00,000 goal</span>
        </div>
        <div className="card revenue-small-stat">
          <span className="rev-stat-icon"><Target size={16}/></span>
          <div><small>GOAL REMAINING</small><strong>৳<AnimatedNumber value={Math.max(0,100000-earned)} format={fmt}/></strong><span>{earned>=100000?'Goal reached — you did it!':'Keep moving, deal by deal'}</span></div>
        </div>
        <div className="card revenue-small-stat">
          <span className="rev-stat-icon rev-stat-green"><Activity size={16}/></span>
          <div><small>MONTHLY RETAINERS</small><strong>৳<AnimatedNumber value={monthly} format={fmt}/></strong><span>Recurring revenue</span></div>
        </div>
        <div className="card revenue-small-stat">
          <span className="rev-stat-icon rev-stat-orange"><FolderKanban size={16}/></span>
          <div><small>ACTIVE LEADS</small><strong><AnimatedNumber value={state.deals.filter(x=>x.status!=='Closed Paid').length}/></strong><span>{state.deals.length} total opportunities</span></div>
        </div>
      </div>
      <div className="revenue-content-grid">
        <section className="card pipeline-card">
          <div className="panel-heading">
            <div><span className="section-overline">FROM CONVERSATION TO CASH</span><h2>Your deal pipeline</h2></div>
            <button className="export-btn add-small" onClick={addDeal}><Plus size={14}/> Add lead</button>
          </div>
          {!state.deals.length ? (
            <div className="empty-pipeline">
              <div className="empty-icon"><Target size={20}/></div>
              <h3>Your next opportunity starts here.</h3>
              <p>Add a lead to track their project, quote, and progress through your pipeline.</p>
              <button className="checkin-btn" onClick={addDeal}><Plus size={15}/> Add your first lead</button>
            </div>
          ) : (
            <>
              <div className="pipeline-columns"><div>CLIENT / PROJECT</div><div>PROJECT VALUE</div><div>MONTHLY</div><div>STAGE</div><div/></div>
              <div className="deal-list">
                {state.deals.map(d=>(
                  <div className="deal-row" key={d.id}>
                    <div className="deal-client">
                      <div className="deal-avatar">{d.name.charAt(0).toUpperCase()}</div>
                      <div><b>{d.name}</b><small>{d.type}</small></div>
                    </div>
                    <div className="deal-money">৳{fmt(Number(d.value)||0)}</div>
                    <div className="deal-money muted-money">৳{fmt(Number(d.retainer)||0)}</div>
                    <select className={`deal-status deal-${d.status.toLowerCase().replaceAll(' ','-')}`} value={d.status} onChange={e=>updateDeal(d.id,'status',e.target.value)}>
                      {['Pitched','Beta Deal','Closed Paid'].map(x=><option key={x}>{x}</option>)}
                    </select>
                    <button className="delete-deal" title="Remove lead" onClick={()=>deleteDeal(d.id)}><Trash2 size={15}/></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
        <aside className="card simulator-card">
          <div className="sim-heading"><span className="section-overline">A LITTLE MOMENTUM GOES A LONG WAY</span><span className="sim-spark"><Sparkles size={15}/></span></div>
          <h2>Run your numbers.</h2>
          <p>Shape a simple offer mix and see what it takes to cross ৳1 Lac.</p>
          <div className="sim-divider"/>
          <div className="slider-row"><div><label>PROJECT DEALS</label><strong>{simDeals} × ৳35,000</strong></div><span className="slider-value">৳{fmt(simDeals*35000)}</span></div>
          <input aria-label="Number of project deals" className="range" type="range" min="1" max="6" value={simDeals} style={{'--fill':`${(simDeals-1)/5*100}%`}} onChange={e=>setSimDeals(+e.target.value)}/>
          <div className="range-labels"><span>1 deal</span><span>6 deals</span></div>
          <div className="slider-row retainer-row"><div><label>MONTHLY RETAINER</label><strong>× 2 months</strong></div><span className="slider-value">৳{fmt(simRetainer*2)}</span></div>
          <input aria-label="Monthly retainer amount" className="range" type="range" min="5000" max="40000" step="2500" value={simRetainer} style={{'--fill':`${(simRetainer-5000)/35000*100}%`}} onChange={e=>setSimRetainer(+e.target.value)}/>
          <div className="range-labels"><span>৳5,000/mo</span><span>৳40,000/mo</span></div>
          <div className="sim-result">
            <div><small>YOUR SIMULATED TOTAL</small><strong>৳<AnimatedNumber value={simTotal} format={fmt}/></strong></div>
            <span className={simTotal>=100000?'sim-success':''}>{simTotal>=100000?<><CheckCircle2 size={14}/> Goal crossed!</>:<>৳{fmt(100000-simTotal)} to go</>}</span>
          </div>
          <div className="sim-equation">{simDeals} projects × ৳35,000 + 2 months × ৳{fmt(simRetainer)} retainer</div>
        </aside>
      </div>
    </>
  );
}

/* ── Boot ── */
createRoot(document.getElementById('root')).render(<App/>);
