import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─── */
const C = {
  bg: "#080810", surface: "#0F0F1A", card: "#161625",
  border: "#232338", borderLight: "#2E2E4A",
  primary: "#6C63FF", primaryLight: "#9B95FF", primaryDark: "#4A42CC",
  accent: "#FF6584", accentGold: "#FFD166", accentTeal: "#06D6A0",
  text: "#EEEEFF", textSub: "#8888BB", textMuted: "#44445A",
  online: "#06D6A0", away: "#FFD166", offline: "#44445A",
  danger: "#FF4757", warn: "#FFA502",
};
const F = { display: "'Syne', sans-serif", body: "'DM Sans', sans-serif" };

function FontLoader() {
  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);
  return null;
}

const USERS = [
  { id:1, name:"Aria Moonwell",  avatar:"AM", status:"online",  lastMsg:"See you tomorrow! 👋",        time:"2m",  unread:3, color:"#6C63FF" },
  { id:2, name:"Kai Stormfield", avatar:"KS", status:"away",    lastMsg:"Did you check the designs?",  time:"14m", unread:0, color:"#FF6584" },
  { id:3, name:"Nova Sterling",  avatar:"NS", status:"online",  lastMsg:"🔥 That looks amazing!",       time:"1h",  unread:1, color:"#FFD166" },
  { id:4, name:"Zephyr Cross",   avatar:"ZC", status:"offline", lastMsg:"Let me know when ready",      time:"3h",  unread:0, color:"#06D6A0" },
  { id:5, name:"Luna Bright",    avatar:"LB", status:"online",  lastMsg:"haha yes exactly!!!",         time:"5h",  unread:0, color:"#FF9F43" },
];

const INIT_MSGS = [
  { id:1, from:"them", type:"text",  text:"Hey! Just saw your portfolio — absolutely incredible 🔥",        time:"10:21 AM" },
  { id:2, from:"me",   type:"text",  text:"Thanks! Spent the whole weekend on it",                          time:"10:23 AM" },
  { id:3, from:"them", type:"text",  text:"The animations are so smooth. Which framework?",                  time:"10:24 AM" },
  { id:4, from:"me",   type:"text",  text:"Flutter for mobile + React for web, shared design system",        time:"10:25 AM" },
  { id:5, from:"them", type:"image", img:"🏔️", imgLabel:"Mountains.jpg",                                    time:"10:26 AM" },
  { id:6, from:"me",   type:"text",  text:"Absolutely! Around 3pm works for me 🙌",                          time:"10:27 AM" },
  { id:7, from:"them", type:"text",  text:"Perfect! See you tomorrow! 👋",                                   time:"10:28 AM" },
];

const NOTIFS = [
  { id:1, icon:"❤️", color:"#FF6584", title:"Aria Moonwell liked your post",       sub:"Check it out →",                    time:"Just now",   read:false },
  { id:2, icon:"💬", color:"#6C63FF", title:"Nova Sterling replied to your comment",sub:"\"That's exactly what I was thinking\"",time:"5m",     read:false },
  { id:3, icon:"🤝", color:"#06D6A0", title:"Kai Stormfield sent you a request",   sub:"View profile →",                    time:"20m",        read:false },
  { id:4, icon:"🚀", color:"#FFD166", title:"Your post reached 1,000 views!",      sub:"Tap to see analytics",              time:"1h",         read:true  },
  { id:5, icon:"🎉", color:"#FF9F43", title:"Luna Bright is now following you",    sub:"Say hello!",                        time:"3h",         read:true  },
  { id:6, icon:"🔔", color:"#9B95FF", title:"Weekly digest ready",                 sub:"7 new highlights this week",        time:"Yesterday",  read:true  },
  { id:7, icon:"⭐", color:"#FFD166", title:"You earned the 'Streak' badge",       sub:"30 days in a row!",                 time:"2 days ago", read:true  },
];

const SLIDES = [
  { emoji:"🌌", grad:`linear-gradient(160deg,#6C63FF33,#FF658422)`, tag:"Connect", title:"Your people,\none tap away",       sub:"Join a community of creators, thinkers, and dreamers. Real conversations, no noise.",         accent:"#6C63FF" },
  { emoji:"⚡", grad:`linear-gradient(160deg,#FFD16633,#06D6A022)`, tag:"Create",  title:"Share moments\nthat matter",       sub:"Send photos, voice notes, and GIFs in ultra-fast encrypted chats that feel alive.",            accent:"#FFD166" },
  { emoji:"🔮", grad:`linear-gradient(160deg,#06D6A033,#6C63FF22)`, tag:"Thrive",  title:"Built for the\nway you live",      sub:"HD video calls, smart notifications, and total privacy — all in one beautiful app.",            accent:"#06D6A0" },
];

/* ─── SHARED ─── */
function Avatar({ initials, color, size=44, status }) {
  const dot = status==="online"?C.online:status==="away"?C.away:status==="offline"?C.offline:null;
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{ width:size, height:size, borderRadius:"50%",
        background:`linear-gradient(135deg,${color}DD,${color}66)`,
        border:`2px solid ${color}55`, display:"flex", alignItems:"center",
        justifyContent:"center", fontFamily:F.display, fontWeight:700,
        fontSize:size*0.33, color:"#fff", boxShadow:`0 4px 20px ${color}44` }}>
        {initials}
      </div>
      {dot && <div style={{ position:"absolute", bottom:1, right:1,
        width:size*0.28, height:size*0.28, borderRadius:"50%",
        background:dot, border:`2.5px solid ${C.bg}`, boxShadow:`0 0 6px ${dot}` }} />}
    </div>
  );
}

function Btn({ children, onClick, variant="primary", full, sm, disabled, sx={} }) {
  const [hov,setHov]=useState(false), [pr,setPr]=useState(false);
  const v = {
    primary:{ bg:hov?`linear-gradient(135deg,${C.primaryLight},${C.primary})`:`linear-gradient(135deg,${C.primary},${C.primaryDark})`, color:"#fff", border:"none", sh:hov?`0 10px 35px ${C.primary}66`:`0 4px 18px ${C.primary}44` },
    ghost:  { bg:hov?`${C.primary}18`:"transparent", color:C.primaryLight, border:`1.5px solid ${hov?C.primary:C.border}`, sh:"none" },
    danger: { bg:hov?C.danger:`${C.danger}CC`, color:"#fff", border:"none", sh:hov?`0 6px 20px ${C.danger}55`:"none" },
    success:{ bg:C.accentTeal, color:"#fff", border:"none", sh:"none" },
    dark:   { bg:hov?C.card:C.surface, color:C.textSub, border:`1.5px solid ${C.border}`, sh:"none" },
  }[variant]||{};
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setPr(false);}}
      onMouseDown={()=>setPr(true)} onMouseUp={()=>setPr(false)}
      style={{ width:full?"100%":"auto", padding:sm?"9px 18px":"14px 26px",
        borderRadius:14, fontFamily:F.display, fontWeight:700,
        fontSize:sm?12:14, letterSpacing:"0.04em",
        cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1,
        background:v.bg, color:v.color, border:v.border||"none",
        boxShadow:v.sh, transform:pr?"scale(0.96)":"scale(1)",
        transition:"all 0.2s", ...sx }}>
      {children}
    </button>
  );
}

function Field({ label, type="text", placeholder, value, onChange, icon }) {
  const [foc,setFoc]=useState(false);
  return (
    <div style={{ marginBottom:18 }}>
      {label && <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.1em",
        color:foc?C.primaryLight:C.textMuted, marginBottom:7, fontFamily:F.display,
        textTransform:"uppercase", transition:"color 0.2s" }}>{label}</label>}
      <div style={{ position:"relative" }}>
        {icon && <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
          fontSize:17, opacity:0.5, pointerEvents:"none" }}>{icon}</span>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
          style={{ width:"100%", boxSizing:"border-box",
            padding:icon?"13px 14px 13px 42px":"13px 16px",
            background:foc?"#1A1A2E":C.card,
            border:`1.5px solid ${foc?C.primary:C.border}`,
            borderRadius:13, color:C.text, fontFamily:F.body, fontSize:14,
            outline:"none", transition:"all 0.22s",
            boxShadow:foc?`0 0 0 3px ${C.primary}1E`:"none" }} />
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{ width:46, height:25, borderRadius:13,
      background:on?C.primary:C.border, position:"relative",
      cursor:"pointer", transition:"background 0.25s", flexShrink:0,
      boxShadow:on?`0 0 12px ${C.primary}55`:"none" }}>
      <div style={{ position:"absolute", top:2.5, left:on?23:2.5,
        width:20, height:20, borderRadius:"50%", background:"#fff",
        transition:"left 0.25s", boxShadow:"0 2px 6px rgba(0,0,0,0.4)" }} />
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background:C.card, border:`1px solid ${C.border}`,
      borderRadius:12, width:38, height:38, display:"flex", alignItems:"center",
      justifyContent:"center", cursor:"pointer", fontSize:18, color:C.textSub, flexShrink:0 }}>←</button>
  );
}

/* ─── ONBOARDING ─── */
function OnboardingScreen({ onNavigate }) {
  const [idx,setIdx]=useState(0);
  const s=SLIDES[idx], last=idx===SLIDES.length-1;
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column",
      background:s.grad, transition:"background 0.5s", minHeight:700 }}>
      <div style={{ display:"flex", justifyContent:"flex-end", padding:"18px 24px 0" }}>
        {!last && <span onClick={()=>onNavigate("login")} style={{ fontSize:13,
          color:C.textSub, fontWeight:600, cursor:"pointer", fontFamily:F.display }}>Skip →</span>}
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", padding:"0 32px 16px", textAlign:"center" }}>
        <div style={{ fontSize:96, marginBottom:28, lineHeight:1, animation:"floatY 3s ease-in-out infinite",
          filter:"drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}>{s.emoji}</div>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em",
          color:s.accent, textTransform:"uppercase", fontFamily:F.display }}>{s.tag}</span>
        <h1 style={{ margin:"10px 0 14px", fontSize:34, fontWeight:800, lineHeight:1.15,
          color:C.text, fontFamily:F.display, letterSpacing:"-0.02em",
          whiteSpace:"pre-line" }}>{s.title}</h1>
        <p style={{ fontSize:14, color:C.textSub, fontFamily:F.body, lineHeight:1.7,
          maxWidth:270 }}>{s.sub}</p>
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:28 }}>
        {SLIDES.map((_,i)=>(
          <div key={i} onClick={()=>setIdx(i)} style={{ height:7, width:i===idx?26:7,
            borderRadius:4, background:i===idx?s.accent:C.border,
            cursor:"pointer", transition:"all 0.3s" }} />
        ))}
      </div>
      <div style={{ padding:"0 24px 36px", display:"flex", flexDirection:"column", gap:10 }}>
        <Btn full onClick={()=>last?onNavigate("login"):setIdx(i=>i+1)}>
          {last?"Get Started →":"Continue →"}
        </Btn>
        {idx===0 && <Btn full variant="ghost" onClick={()=>onNavigate("login")}>I already have an account</Btn>}
      </div>
    </div>
  );
}

/* ─── LOGIN ─── */
function LoginScreen({ onNavigate }) {
  const [email,setEmail]=useState(""), [pw,setPw]=useState(""), [loading,setLoading]=useState(false);
  const go=()=>{ setLoading(true); setTimeout(()=>{ setLoading(false); onNavigate("otp"); },1000); };
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"28px" }}>
      <div style={{ marginBottom:36 }}>
        <div style={{ width:54, height:54, borderRadius:17,
          background:`linear-gradient(135deg,${C.primary},${C.accent})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:24, marginBottom:22, boxShadow:`0 12px 35px ${C.primary}55` }}>⚡</div>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em",
          color:C.primary, textTransform:"uppercase", marginBottom:8, fontFamily:F.display }}>Welcome back</div>
        <h1 style={{ margin:0, fontSize:34, fontWeight:800, lineHeight:1.1, color:C.text,
          fontFamily:F.display, letterSpacing:"-0.02em" }}>
          Sign into<br/>
          <span style={{ background:`linear-gradient(135deg,${C.primary},${C.accent})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>your world</span>
        </h1>
      </div>
      <Field label="Email" type="email" placeholder="you@example.com" icon="✉️" value={email} onChange={e=>setEmail(e.target.value)} />
      <Field label="Password" type="password" placeholder="••••••••" icon="🔒" value={pw} onChange={e=>setPw(e.target.value)} />
      <div style={{ textAlign:"right", marginBottom:22 }}>
        <span style={{ fontSize:13, color:C.primaryLight, cursor:"pointer", fontWeight:600 }}>Forgot password?</span>
      </div>
      <Btn full onClick={go} disabled={loading}>{loading?"Signing in…":"Sign In →"}</Btn>
      <div style={{ display:"flex", alignItems:"center", gap:14, margin:"22px 0" }}>
        <div style={{ flex:1, height:1, background:C.border }} />
        <span style={{ fontSize:11, color:C.textMuted, fontFamily:F.body }}>or continue with</span>
        <div style={{ flex:1, height:1, background:C.border }} />
      </div>
      <div style={{ display:"flex", gap:10 }}>
        {["🍎 Apple","🌐 Google","🐙 GitHub"].map(s=>(
          <button key={s} style={{ flex:1, padding:"11px 0", background:C.card,
            border:`1.5px solid ${C.border}`, borderRadius:12, color:C.textSub,
            fontFamily:F.body, fontSize:11, fontWeight:500, cursor:"pointer" }}>{s}</button>
        ))}
      </div>
      <p style={{ textAlign:"center", marginTop:28, fontSize:13, color:C.textMuted, fontFamily:F.body }}>
        No account?{" "}
        <span onClick={()=>onNavigate("signup")} style={{ color:C.primaryLight, fontWeight:600, cursor:"pointer" }}>Create one →</span>
      </p>
      <p style={{ textAlign:"center", marginTop:8, fontSize:11, color:C.textMuted, fontFamily:F.body }}>
        <span onClick={()=>onNavigate("onboarding")} style={{ cursor:"pointer" }}>← View onboarding</span>
      </p>
    </div>
  );
}

/* ─── SIGN UP ─── */
function SignupScreen({ onNavigate }) {
  const [name,setName]=useState(""), [email,setEmail]=useState(""), [pw,setPw]=useState("");
  const [loading,setLoading]=useState(false), [av,setAv]=useState(0);
  const emojis=["🧑‍💻","👩‍🎨","🧑‍🚀","👨‍🔬","🧑‍🎤"];
  const strength=Math.min(4,Math.floor(pw.length/2));
  const sColor=[C.border,C.danger,C.warn,C.accentGold,C.accentTeal][strength];
  const go=()=>{ setLoading(true); setTimeout(()=>{ setLoading(false); onNavigate("otp"); },1000); };
  return (
    <div style={{ padding:"24px 28px 32px" }}>
      <BackBtn onClick={()=>onNavigate("login")} />
      <div style={{ marginTop:22, marginBottom:28 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em",
          color:C.accent, textTransform:"uppercase", marginBottom:8, fontFamily:F.display }}>Join today</div>
        <h1 style={{ margin:0, fontSize:32, fontWeight:800, lineHeight:1.1, color:C.text,
          fontFamily:F.display, letterSpacing:"-0.02em" }}>
          Create your<br/>
          <span style={{ background:`linear-gradient(135deg,${C.accent},${C.accentGold})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>free account</span>
        </h1>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:22 }}>
        {emojis.map((em,i)=>(
          <div key={i} onClick={()=>setAv(i)} style={{ width:48, height:48, borderRadius:14,
            background:av===i?`${C.primary}28`:C.card,
            border:`2px solid ${av===i?C.primary:C.border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:22, cursor:"pointer", transition:"all 0.2s",
            boxShadow:av===i?`0 0 14px ${C.primary}44`:"none" }}>{em}</div>
        ))}
      </div>
      <Field label="Full Name" placeholder="Your name" icon="👤" value={name} onChange={e=>setName(e.target.value)} />
      <Field label="Email" type="email" placeholder="you@example.com" icon="✉️" value={email} onChange={e=>setEmail(e.target.value)} />
      <Field label="Password" type="password" placeholder="Min. 8 characters" icon="🔒" value={pw} onChange={e=>setPw(e.target.value)} />
      <div style={{ display:"flex", gap:5, marginBottom:20 }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ flex:1, height:4, borderRadius:4,
            background:strength>i?sColor:C.border, transition:"all 0.3s" }} />
        ))}
      </div>
      <Btn full onClick={go} disabled={loading}>{loading?"Creating account…":"Create Account →"}</Btn>
      <p style={{ textAlign:"center", marginTop:18, fontSize:11, color:C.textMuted,
        fontFamily:F.body, lineHeight:1.6 }}>
        By continuing you agree to our{" "}
        <span style={{ color:C.primaryLight, cursor:"pointer" }}>Terms</span> &{" "}
        <span style={{ color:C.primaryLight, cursor:"pointer" }}>Privacy</span>
      </p>
    </div>
  );
}

/* ─── OTP ─── */
function OTPScreen({ onNavigate }) {
  const [digits,setDigits]=useState(["","","","",""]);
  const [verified,setVerified]=useState(false);
  const [timer,setTimer]=useState(30);
  const [shake,setShake]=useState(false);
  const refs=[useRef(),useRef(),useRef(),useRef(),useRef()];

  useEffect(()=>{ if(timer>0){ const t=setTimeout(()=>setTimer(v=>v-1),1000); return ()=>clearTimeout(t); } },[timer]);

  const handleDigit=(i,v)=>{
    if(!/^\d?$/.test(v)) return;
    const nd=[...digits]; nd[i]=v; setDigits(nd);
    if(v&&i<4) refs[i+1].current?.focus();
    if(nd.every(d=>d)){
      if(nd.join("")==="12345"){ setTimeout(()=>{ setVerified(true); setTimeout(()=>onNavigate("chat"),1400); },300); }
      else { setShake(true); setTimeout(()=>setShake(false),600); }
    }
  };
  const handleKey=(i,e)=>{ if(e.key==="Backspace"&&!digits[i]&&i>0) refs[i-1].current?.focus(); };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"28px" }}>
      <BackBtn onClick={()=>onNavigate("login")} />
      <div style={{ marginTop:32, marginBottom:36, textAlign:"center" }}>
        <div style={{ fontSize:68, marginBottom:18 }}>{verified?"✅":"📱"}</div>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em",
          color:verified?C.accentTeal:C.primary, textTransform:"uppercase",
          marginBottom:10, fontFamily:F.display }}>{verified?"Verified!":"Verification"}</div>
        <h1 style={{ margin:"0 0 10px", fontSize:26, fontWeight:800, color:C.text,
          fontFamily:F.display, letterSpacing:"-0.02em" }}>
          {verified?"You're all set!":"Enter the code"}
        </h1>
        <p style={{ fontSize:13, color:C.textSub, fontFamily:F.body, lineHeight:1.6 }}>
          {verified?"Redirecting you now…":"We sent a 5-digit code to"}<br/>
          {!verified&&<strong style={{ color:C.text }}>+1 (555) 000-1234</strong>}
        </p>
        {!verified&&<p style={{ fontSize:11, color:C.textMuted, fontFamily:F.body, marginTop:6 }}>
          Hint: type <span style={{ color:C.primary }}>1 2 3 4 5</span>
        </p>}
      </div>
      {!verified&&(
        <>
          <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:24,
            animation:shake?"shakeFx 0.5s":"none" }}>
            {digits.map((d,i)=>(
              <input key={i} ref={refs[i]} maxLength={1} value={d}
                onChange={e=>handleDigit(i,e.target.value)}
                onKeyDown={e=>handleKey(i,e)}
                style={{ width:50, height:58, borderRadius:16, textAlign:"center",
                  fontSize:24, fontWeight:800, fontFamily:F.display,
                  background:d?`${C.primary}18`:C.card,
                  border:`2px solid ${d?C.primary:C.border}`,
                  color:C.text, outline:"none", transition:"all 0.2s",
                  boxShadow:d?`0 0 0 3px ${C.primary}22`:"none" }} />
            ))}
          </div>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            {timer>0
              ?<span style={{ fontSize:13, color:C.textMuted, fontFamily:F.body }}>Resend in <strong style={{ color:C.text }}>{timer}s</strong></span>
              :<span onClick={()=>setTimer(30)} style={{ fontSize:13, color:C.primaryLight, fontWeight:600, cursor:"pointer" }}>Resend code →</span>}
          </div>
          <Btn full onClick={()=>{ setShake(true); setTimeout(()=>setShake(false),600); }}>Verify Code</Btn>
        </>
      )}
    </div>
  );
}

/* ─── PROFILE ─── */
function ProfileScreen({ onNavigate }) {
  const stats=[{l:"Posts",v:"142"},{l:"Friends",v:"2.4k"},{l:"Likes",v:"18.9k"}];
  const badges=["🏆 Top Creator","⚡ Early Adopter","🌟 Verified","🎯 30-Day Streak"];
  const acts=[
    {i:"💬",t:"Commented on Nova's post",s:"2h ago"},
    {i:"❤️",t:"Liked 12 photos",s:"5h ago"},
    {i:"🤝",t:"Connected with Kai Stormfield",s:"Yesterday"},
    {i:"🚀",t:"Published a new article",s:"2 days ago"},
  ];
  return (
    <div style={{ paddingBottom:20 }}>
      <div style={{ background:`linear-gradient(160deg,${C.primary}28,${C.accent}18,transparent)`,
        padding:"28px 24px 20px", position:"relative" }}>
        <div style={{ position:"absolute", top:18, right:20 }}>
          <Btn sm variant="dark" onClick={()=>onNavigate("settings")}>⚙️ Settings</Btn>
        </div>
        <Avatar initials="AJ" color={C.primary} size={76} status="online" />
        <h2 style={{ margin:"14px 0 4px", fontSize:22, fontWeight:800, color:C.text,
          fontFamily:F.display, letterSpacing:"-0.02em" }}>Alex Jordan</h2>
        <p style={{ margin:"0 0 6px", fontSize:13, color:C.textSub, fontFamily:F.body }}>@alex.jordan · Full-stack Designer</p>
        <p style={{ margin:"0 0 16px", fontSize:13, color:C.textSub, fontFamily:F.body, lineHeight:1.6 }}>Building beautiful interfaces by day 🌙</p>
        <div style={{ display:"flex", background:C.card, borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}` }}>
          {stats.map((s,i)=>(
            <div key={s.l} style={{ flex:1, padding:"13px 0", textAlign:"center",
              borderRight:i<stats.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ fontSize:18, fontWeight:800, color:C.text, fontFamily:F.display }}>{s.v}</div>
              <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"16px 24px 0" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", color:C.textMuted,
          textTransform:"uppercase", marginBottom:12 }}>Badges</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {badges.map(b=>(
            <span key={b} style={{ padding:"6px 12px", background:C.card, border:`1px solid ${C.border}`,
              borderRadius:99, fontSize:11, fontWeight:600, color:C.textSub, fontFamily:F.display }}>{b}</span>
          ))}
        </div>
      </div>
      <div style={{ padding:"18px 24px 0" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", color:C.textMuted,
          textTransform:"uppercase", marginBottom:12 }}>Recent Activity</div>
        {acts.map((a,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0",
            borderBottom:i<acts.length-1?`1px solid ${C.border}22`:"none" }}>
            <div style={{ width:36, height:36, borderRadius:11, background:C.card,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{a.i}</div>
            <div>
              <div style={{ fontSize:13, color:C.text, fontFamily:F.body, fontWeight:500 }}>{a.t}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{a.s}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"20px 24px 0" }}>
        <Btn variant="danger" full onClick={()=>onNavigate("onboarding")}>Sign Out</Btn>
      </div>
    </div>
  );
}

/* ─── SETTINGS ─── */
function SettingsScreen({ onNavigate }) {
  const [notifs,setNotifs]=useState(true), [dark,setDark]=useState(true);
  const [sound,setSound]=useState(true), [read,setRead]=useState(false);
  const [biometric,setBiometric]=useState(true), [twofa,setTwofa]=useState(false);

  const Section=({title,children})=>(
    <div style={{ marginBottom:6 }}>
      <div style={{ padding:"14px 24px 6px", fontSize:10, fontWeight:700, letterSpacing:"0.12em",
        color:C.textMuted, textTransform:"uppercase", fontFamily:F.display }}>{title}</div>
      <div style={{ background:C.card, margin:"0 14px", borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden" }}>
        {children}
      </div>
    </div>
  );
  const Row=({icon,label,right,onClick,danger})=>(
    <div onClick={onClick} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 18px",
      borderBottom:`1px solid ${C.border}22`, cursor:onClick?"pointer":"default", transition:"background 0.15s" }}
      onMouseEnter={e=>{ if(onClick) e.currentTarget.style.background=C.surface; }}
      onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}>
      <span style={{ fontSize:19, flexShrink:0 }}>{icon}</span>
      <span style={{ flex:1, fontSize:13, color:danger?C.danger:C.text, fontFamily:F.body, fontWeight:500 }}>{label}</span>
      {right}
    </div>
  );

  return (
    <div style={{ paddingBottom:32 }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 24px 14px" }}>
        <BackBtn onClick={()=>onNavigate("profile")} />
        <span style={{ flex:1, fontSize:21, fontWeight:800, color:C.text, fontFamily:F.display }}>Settings</span>
      </div>
      <div style={{ margin:"0 14px 14px", background:C.card, borderRadius:16, border:`1px solid ${C.border}`,
        padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
        <Avatar initials="AJ" color={C.primary} size={54} status="online" />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.text, fontFamily:F.display }}>Alex Jordan</div>
          <div style={{ fontSize:12, color:C.textSub }}>alex.jordan@email.com</div>
        </div>
        <span style={{ fontSize:18, color:C.textSub }}>›</span>
      </div>
      <Section title="Notifications">
        <Row icon="🔔" label="Push Notifications" right={<Toggle on={notifs} onToggle={()=>setNotifs(v=>!v)} />} />
        <Row icon="🔊" label="Sound & Vibration"  right={<Toggle on={sound} onToggle={()=>setSound(v=>!v)} />} />
        <Row icon="👁️" label="Read Receipts"      right={<Toggle on={read}  onToggle={()=>setRead(v=>!v)} />} />
      </Section>
      <Section title="Appearance">
        <Row icon="🌙" label="Dark Mode" right={<Toggle on={dark} onToggle={()=>setDark(v=>!v)} />} />
        <Row icon="🌐" label="Language"  right={<span style={{ fontSize:12, color:C.textSub }}>English ›</span>} onClick={()=>{}} />
        <Row icon="🎨" label="Theme Color" right={
          <div style={{ display:"flex", gap:6 }}>
            {[C.primary,C.accent,C.accentTeal,C.accentGold].map((clr,i)=>(
              <div key={i} style={{ width:17, height:17, borderRadius:"50%", background:clr,
                border:i===0?`2px solid ${C.text}`:"none" }} />
            ))}
          </div>
        } />
      </Section>
      <Section title="Privacy & Security">
        <Row icon="🔑" label="Biometric Lock"  right={<Toggle on={biometric} onToggle={()=>setBiometric(v=>!v)} />} />
        <Row icon="🛡️" label="Two-Factor Auth"  right={<Toggle on={twofa} onToggle={()=>setTwofa(v=>!v)} />} />
        <Row icon="🔒" label="Change Password"  right={<span style={{ fontSize:12, color:C.textSub }}>›</span>} onClick={()=>{}} />
        <Row icon="📋" label="Privacy Policy"   right={<span style={{ fontSize:12, color:C.textSub }}>›</span>} onClick={()=>{}} />
      </Section>
      <Section title="Storage">
        <Row icon="💾" label="Cache" right={<Btn sm variant="ghost">Clear 128 MB</Btn>} />
        <Row icon="☁️" label="Backup" right={<span style={{ fontSize:12, color:C.accentTeal }}>Last: Today</span>} />
      </Section>
      <Section title="Account">
        <Row icon="🚪" label="Sign Out"       danger onClick={()=>onNavigate("onboarding")} right={<span style={{ color:C.danger }}>›</span>} />
        <Row icon="🗑️" label="Delete Account" danger onClick={()=>{}} right={<span style={{ color:C.danger }}>›</span>} />
      </Section>
      <p style={{ textAlign:"center", fontSize:10, color:C.textMuted, fontFamily:F.body, marginTop:14 }}>Version 2.4.1 · Built with ♥</p>
    </div>
  );
}

/* ─── NOTIFICATIONS ─── */
function NotificationsScreen({ onNavigate }) {
  const [notifs,setNotifs]=useState(NOTIFS);
  const unread=notifs.filter(n=>!n.read).length;
  const markAll=()=>setNotifs(ns=>ns.map(n=>({...n,read:true})));
  const dismiss=(id)=>setNotifs(ns=>ns.filter(n=>n.id!==id));

  return (
    <div style={{ paddingBottom:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 24px 12px" }}>
        <BackBtn onClick={()=>onNavigate("chat")} />
        <span style={{ flex:1, fontSize:21, fontWeight:800, color:C.text, fontFamily:F.display }}>
          Notifications
          {unread>0&&<span style={{ marginLeft:8, fontSize:12, background:C.primary, color:"#fff",
            borderRadius:99, padding:"2px 8px", fontWeight:700 }}>{unread}</span>}
        </span>
        {unread>0&&<span onClick={markAll} style={{ fontSize:12, color:C.primaryLight, fontWeight:600, cursor:"pointer" }}>Mark all read</span>}
      </div>
      {notifs.some(n=>!n.read)&&(
        <>
          <div style={{ padding:"6px 24px 4px", fontSize:10, fontWeight:700, letterSpacing:"0.1em",
            color:C.textMuted, textTransform:"uppercase", fontFamily:F.display }}>New</div>
          {notifs.filter(n=>!n.read).map(n=><NotifRow key={n.id} n={n} onDismiss={()=>dismiss(n.id)} />)}
        </>
      )}
      {notifs.some(n=>n.read)&&(
        <>
          <div style={{ padding:"12px 24px 4px", fontSize:10, fontWeight:700, letterSpacing:"0.1em",
            color:C.textMuted, textTransform:"uppercase", fontFamily:F.display }}>Earlier</div>
          {notifs.filter(n=>n.read).map(n=><NotifRow key={n.id} n={n} onDismiss={()=>dismiss(n.id)} />)}
        </>
      )}
      {notifs.length===0&&(
        <div style={{ textAlign:"center", padding:"60px 24px" }}>
          <div style={{ fontSize:56, marginBottom:14 }}>🎉</div>
          <div style={{ fontSize:15, fontWeight:700, color:C.text, fontFamily:F.display }}>All caught up!</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:6 }}>No new notifications</div>
        </div>
      )}
    </div>
  );
}

function NotifRow({ n, onDismiss }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 24px",
      borderBottom:`1px solid ${C.border}22`, background:n.read?"transparent":`${C.primary}08`, position:"relative" }}>
      <div style={{ width:42, height:42, borderRadius:13, background:`${n.color}1E`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:19, flexShrink:0, border:`1px solid ${n.color}33` }}>{n.icon}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, color:C.text, fontFamily:F.body, fontWeight:n.read?400:600, lineHeight:1.4 }}>{n.title}</div>
        <div style={{ fontSize:11, color:C.primaryLight, marginTop:2, fontFamily:F.body }}>{n.sub}</div>
        <div style={{ fontSize:10, color:C.textMuted, marginTop:3 }}>{n.time}</div>
      </div>
      {!n.read&&<div style={{ width:7, height:7, borderRadius:"50%", background:C.primary,
        flexShrink:0, marginTop:5, boxShadow:`0 0 8px ${C.primary}` }} />}
      <span onClick={onDismiss} style={{ position:"absolute", top:10, right:14,
        fontSize:14, color:C.textMuted, cursor:"pointer", opacity:0.6 }}>✕</span>
    </div>
  );
}

/* ─── CHAT LIST ─── */
function ChatListScreen({ onNavigate, onOpenChat }) {
  const [search,setSearch]=useState("");
  const filtered=USERS.filter(u=>u.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ padding:"18px 24px 12px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", color:C.primary,
              textTransform:"uppercase", marginBottom:5, fontFamily:F.display }}>Messages</div>
            <h2 style={{ margin:0, fontSize:24, fontWeight:800, color:C.text,
              fontFamily:F.display, letterSpacing:"-0.02em" }}>Conversations</h2>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>onNavigate("notifications")} style={{ width:36, height:36,
              borderRadius:11, background:C.card, border:`1px solid ${C.border}`,
              fontSize:17, cursor:"pointer", position:"relative" }}>
              🔔
              <span style={{ position:"absolute", top:4, right:4, width:7, height:7,
                borderRadius:"50%", background:C.accent, border:`1.5px solid ${C.bg}` }} />
            </button>
            <button style={{ width:36, height:36, borderRadius:11, background:C.primary,
              border:"none", fontSize:17, cursor:"pointer" }}>✏️</button>
          </div>
        </div>
        <div style={{ display:"flex", gap:14, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
          {USERS.filter(u=>u.status==="online").map(u=>(
            <div key={u.id} style={{ textAlign:"center", flexShrink:0 }}>
              <Avatar initials={u.avatar} color={u.color} size={46} status={u.status} />
              <div style={{ fontSize:9, color:C.textMuted, marginTop:5, fontWeight:600,
                width:46, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {u.name.split(" ")[0]}
              </div>
            </div>
          ))}
        </div>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
            fontSize:14, opacity:0.4 }}>🔍</span>
          <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:"100%", boxSizing:"border-box", padding:"10px 14px 10px 36px",
              background:C.card, border:`1px solid ${C.border}`, borderRadius:12,
              color:C.text, fontFamily:F.body, fontSize:13, outline:"none" }} />
        </div>
      </div>
      {filtered.map((u)=>(
        <div key={u.id} onClick={()=>onOpenChat(u)}
          style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 24px",
            cursor:"pointer", borderBottom:`1px solid ${C.border}18`, transition:"background 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.background=C.card}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <Avatar initials={u.avatar} color={u.color} size={46} status={u.status} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
              <span style={{ fontWeight:700, fontSize:13, color:C.text, fontFamily:F.display }}>{u.name}</span>
              <span style={{ fontSize:10, color:C.textMuted }}>{u.time}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:u.unread?C.textSub:C.textMuted, fontFamily:F.body,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"78%" }}>{u.lastMsg}</span>
              {u.unread>0&&<span style={{ background:C.primary, color:"#fff", borderRadius:99,
                fontSize:10, fontWeight:700, padding:"2px 7px", fontFamily:F.display,
                boxShadow:`0 2px 8px ${C.primary}55` }}>{u.unread}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── CHAT DETAIL ─── */
const MEDIA_IMGS=[
  {e:"🌅",l:"Sunset.jpg"},{e:"🏙️",l:"City.jpg"},{e:"🌊",l:"Ocean.jpg"},
  {e:"🌸",l:"Flowers.jpg"},{e:"🦋",l:"Nature.jpg"},{e:"⛰️",l:"Mountain.jpg"},
];

function ChatDetailScreen({ user, onBack, onVideoCall, onAudioCall }) {
  const [input,setInput]=useState(""), [msgs,setMsgs]=useState(INIT_MSGS);
  const [showMedia,setShowMedia]=useState(false);
  const endRef=useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const send=()=>{
    if(!input.trim()) return;
    setMsgs(m=>[...m,{id:Date.now(),from:"me",type:"text",text:input,time:"Now"}]);
    setInput("");
    setTimeout(()=>setMsgs(m=>[...m,{id:Date.now()+1,from:"them",type:"text",text:"Got it! Thanks 🙌",time:"Now"}]),800);
  };

  const sendImage=(emoji,label)=>{
    setMsgs(m=>[...m,{id:Date.now(),from:"me",type:"image",img:emoji,imgLabel:label,time:"Now"}]);
    setShowMedia(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Header */}
      <div style={{ padding:"10px 14px", display:"flex", alignItems:"center", gap:10,
        borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
        <BackBtn onClick={onBack} />
        <Avatar initials={user.avatar} color={user.color} size={38} status={user.status} />
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:13, color:C.text, fontFamily:F.display }}>{user.name}</div>
          <div style={{ fontSize:11, color:user.status==="online"?C.accentTeal:C.textMuted }}>
            {user.status==="online"?"● Online":user.status}
          </div>
        </div>
        <button onClick={onAudioCall} style={{ width:34, height:34, borderRadius:10, background:C.card,
          border:`1px solid ${C.border}`, fontSize:15, cursor:"pointer" }}>📞</button>
        <button onClick={onVideoCall} style={{ width:34, height:34, borderRadius:10, background:C.primary,
          border:"none", fontSize:15, cursor:"pointer" }}>📹</button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px" }}>
        {msgs.map(m=>(
          <div key={m.id} style={{ display:"flex",
            justifyContent:m.from==="me"?"flex-end":"flex-start", marginBottom:9 }}>
            {m.from==="them"&&<Avatar initials={user.avatar} color={user.color} size={26} />}
            <div style={{ maxWidth:"72%", marginLeft:m.from==="them"?7:0 }}>
              {m.type==="image"?(
                <div style={{ background:m.from==="me"?`${C.primary}1E`:C.card,
                  borderRadius:m.from==="me"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                  padding:7, border:`1px solid ${m.from==="me"?C.primary+"44":C.border}` }}>
                  <div style={{ width:148, height:108, borderRadius:9,
                    background:`linear-gradient(135deg,${C.border},${C.card})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:44, position:"relative" }}>
                    {m.img}
                    <div style={{ position:"absolute", bottom:5, right:5,
                      background:"rgba(0,0,0,0.6)", borderRadius:5,
                      padding:"1px 6px", fontSize:9, color:"#fff", fontFamily:F.body }}>
                      {m.imgLabel}
                    </div>
                  </div>
                </div>
              ):(
                <div style={{ padding:"9px 13px",
                  background:m.from==="me"?`linear-gradient(135deg,${C.primary},${C.primaryDark})`:C.card,
                  borderRadius:m.from==="me"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                  color:C.text, fontSize:13, fontFamily:F.body, lineHeight:1.5,
                  boxShadow:m.from==="me"?`0 4px 14px ${C.primary}33`:"none",
                  border:m.from==="them"?`1px solid ${C.border}`:"none" }}>{m.text}</div>
              )}
              <div style={{ fontSize:9, color:C.textMuted, marginTop:3,
                textAlign:m.from==="me"?"right":"left" }}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Media picker */}
      {showMedia&&(
        <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, background:C.surface }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, marginBottom:8,
            textTransform:"uppercase", letterSpacing:"0.08em", fontFamily:F.display }}>Choose Image</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7 }}>
            {MEDIA_IMGS.map((img,i)=>(
              <div key={i} onClick={()=>sendImage(img.e,img.l)}
                style={{ height:66, borderRadius:11, background:C.card, border:`1px solid ${C.border}`,
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", fontSize:26, gap:3, transition:"border-color 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.primary}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                {img.e}<span style={{ fontSize:9, color:C.textMuted, fontFamily:F.body }}>{img.l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding:"9px 12px 13px", borderTop:`1px solid ${C.border}`,
        display:"flex", gap:7, alignItems:"center", flexShrink:0, background:C.surface }}>
        <button onClick={()=>setShowMedia(v=>!v)} style={{ width:36, height:36, borderRadius:10,
          background:showMedia?`${C.primary}22`:C.card, border:`1px solid ${showMedia?C.primary:C.border}`,
          fontSize:16, cursor:"pointer", transition:"all 0.2s" }}>🖼️</button>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message…"
          style={{ flex:1, padding:"9px 13px", background:C.card, border:`1px solid ${C.border}`,
            borderRadius:20, color:C.text, fontFamily:F.body, fontSize:13, outline:"none" }} />
        <button style={{ width:36, height:36, borderRadius:10, background:C.card,
          border:`1px solid ${C.border}`, fontSize:16, cursor:"pointer" }}>🎤</button>
        <button onClick={send} style={{ width:36, height:36, borderRadius:10, border:"none",
          background:input.trim()?`linear-gradient(135deg,${C.primary},${C.primaryDark})`:C.card,
          fontSize:16, cursor:"pointer", transition:"all 0.2s",
          boxShadow:input.trim()?`0 4px 14px ${C.primary}44`:"none" }}>↑</button>
      </div>
    </div>
  );
}

/* ─── VIDEO CALL ─── */
function VideoCallScreen({ user, onEnd }) {
  const [muted,setMuted]=useState(false), [camOff,setCamOff]=useState(false);
  const [speaker,setSpeaker]=useState(true), [timer,setTimer]=useState(0), [pip,setPip]=useState(false);
  useEffect(()=>{ const t=setInterval(()=>setTimer(v=>v+1),1000); return ()=>clearInterval(t); },[]);
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{ height:"100%", position:"relative", background:"#000",
      display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* BG */}
      <div style={{ position:"absolute", inset:0,
        background:`radial-gradient(ellipse at 40% 35%,${user.color}28,transparent 60%),linear-gradient(180deg,#0A0A18,#050510)`,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        {[...Array(5)].map((_,i)=>(
          <div key={i} style={{ position:"absolute", width:5+i*3, height:5+i*3, borderRadius:"50%",
            background:`${user.color}44`, top:`${18+i*10}%`, left:`${8+i*16}%`,
            animation:`floatY ${2+i*0.5}s ease-in-out infinite`, animationDelay:`${i*0.3}s` }} />
        ))}
      </div>
      {/* Top bar */}
      <div style={{ position:"relative", zIndex:2, padding:"18px 18px 0",
        display:"flex", justifyContent:"space-between" }}>
        <div style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(10px)",
          borderRadius:10, padding:"7px 12px", border:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)", textTransform:"uppercase",
            letterSpacing:"0.1em", fontFamily:F.display }}>HD · Encrypted</div>
        </div>
        <div style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(10px)",
          borderRadius:10, padding:"7px 12px", border:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:F.display }}>{fmt(timer)}</div>
        </div>
      </div>
      {/* Center */}
      <div style={{ position:"relative", zIndex:2, flex:1, display:"flex",
        flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <Avatar initials={user.avatar} color={user.color} size={88} status="online" />
        <h2 style={{ margin:"14px 0 5px", fontSize:22, fontWeight:800, color:"#fff", fontFamily:F.display }}>{user.name}</h2>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:C.accentTeal, boxShadow:`0 0 8px ${C.accentTeal}` }} />
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.65)", fontFamily:F.body }}>Video Call Connected</span>
        </div>
      </div>
      {/* PiP */}
      <div onClick={()=>setPip(v=>!v)} style={{ position:"absolute", top:76, right:14, zIndex:3,
        width:pip?120:72, height:pip?162:100, borderRadius:14, overflow:"hidden",
        background:`linear-gradient(135deg,${C.primary}44,${C.primaryDark}66)`,
        border:"2px solid rgba(255,255,255,0.2)", boxShadow:"0 8px 30px rgba(0,0,0,0.5)",
        display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
        transition:"all 0.3s" }}>
        <span style={{ fontSize:pip?44:28 }}>🤳</span>
      </div>
      {/* Controls */}
      <div style={{ position:"relative", zIndex:2, padding:"16px 14px 28px" }}>
        <div style={{ background:"rgba(10,10,20,0.75)", backdropFilter:"blur(20px)",
          borderRadius:22, padding:"18px", border:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center" }}>
            {[
              {icon:muted?"🎙️":"🎤",label:"Mute",action:()=>setMuted(v=>!v),active:muted},
              {icon:camOff?"📵":"📹",label:"Camera",action:()=>setCamOff(v=>!v),active:camOff},
              {icon:speaker?"🔊":"🔇",label:"Speaker",action:()=>setSpeaker(v=>!v),active:!speaker},
              {icon:"💬",label:"Chat",action:()=>{},active:false},
            ].map((c,i)=>(
              <div key={i} style={{ textAlign:"center" }}>
                <button onClick={c.action} style={{ width:50, height:50, borderRadius:15,
                  background:c.active?`${C.accent}33`:"rgba(255,255,255,0.09)",
                  border:`1.5px solid ${c.active?C.accent:"rgba(255,255,255,0.14)"}`,
                  fontSize:20, cursor:"pointer", marginBottom:5,
                  boxShadow:c.active?`0 0 16px ${C.accent}44`:"none" }}>{c.icon}</button>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", fontFamily:F.body }}>{c.label}</div>
              </div>
            ))}
            <div style={{ textAlign:"center" }}>
              <button onClick={onEnd} style={{ width:50, height:50, borderRadius:15, background:C.danger,
                border:"none", fontSize:20, cursor:"pointer", boxShadow:`0 4px 18px ${C.danger}77`,
                marginBottom:5 }}>📵</button>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", fontFamily:F.body }}>End</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── AUDIO CALL ─── */
function AudioCallScreen({ user, onEnd }) {
  const [muted,setMuted]=useState(false), [speaker,setSpeaker]=useState(true);
  const [hold,setHold]=useState(false), [timer,setTimer]=useState(0);
  useEffect(()=>{ if(!hold){ const t=setInterval(()=>setTimer(v=>v+1),1000); return ()=>clearInterval(t); } },[hold]);
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column",
      background:`radial-gradient(ellipse at 50% 30%,${user.color}22,transparent 55%),linear-gradient(180deg,#0A0A18,#05050F)` }}>
      {/* Ripple rings */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        {[1,2,3].map(i=>(
          <div key={i} style={{ position:"absolute",
            width:260+i*80, height:260+i*80, borderRadius:"50%",
            border:`1px solid ${user.color}${hold?"08":"1A"}`,
            top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            animation:`pulseRing ${1.2+i*0.5}s ease-out infinite`,
            animationDelay:`${i*0.3}s` }} />
        ))}
      </div>
      {/* Header tag */}
      <div style={{ padding:"18px 18px 0", display:"flex", justifyContent:"flex-end", position:"relative", zIndex:2 }}>
        <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:9, padding:"5px 11px",
          fontSize:10, color:"rgba(255,255,255,0.45)", fontFamily:F.body }}>
          {hold?"⏸ On Hold":"🔒 Encrypted"}
        </div>
      </div>
      {/* User */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", position:"relative", zIndex:2, padding:"0 24px" }}>
        <div style={{ position:"relative", marginBottom:22 }}>
          <Avatar initials={user.avatar} color={user.color} size={96} status="online" />
          {!hold&&<div style={{ position:"absolute", inset:-10, borderRadius:"50%",
            border:`2px solid ${user.color}44`, animation:"pulseRing 1.5s ease-out infinite" }} />}
        </div>
        <h2 style={{ margin:"0 0 7px", fontSize:26, fontWeight:800, color:"#fff", fontFamily:F.display }}>{user.name}</h2>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", fontFamily:F.body, marginBottom:7 }}>Voice Call</div>
        <div style={{ fontSize:22, fontWeight:700, color:hold?C.accentGold:C.accentTeal,
          fontFamily:F.display, letterSpacing:"0.06em" }}>{hold?"On Hold…":fmt(timer)}</div>
      </div>
      {/* Controls */}
      <div style={{ position:"relative", zIndex:2, padding:"14px 18px 30px" }}>
        <div style={{ display:"flex", justifyContent:"space-around", marginBottom:18 }}>
          {[
            {icon:muted?"🎙️":"🎤",label:muted?"Unmute":"Mute",action:()=>setMuted(v=>!v),active:muted},
            {icon:"🔢",label:"Keypad",action:()=>{},active:false},
            {icon:speaker?"🔊":"🔇",label:"Speaker",action:()=>setSpeaker(v=>!v),active:!speaker},
            {icon:hold?"▶️":"⏸",label:hold?"Resume":"Hold",action:()=>setHold(v=>!v),active:hold},
          ].map((c,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <button onClick={c.action} style={{ width:54, height:54, borderRadius:17,
                background:c.active?`${user.color}33`:"rgba(255,255,255,0.08)",
                border:`1.5px solid ${c.active?user.color:"rgba(255,255,255,0.12)"}`,
                fontSize:22, cursor:"pointer", marginBottom:6,
                boxShadow:c.active?`0 0 20px ${user.color}44`:"none" }}>{c.icon}</button>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", fontFamily:F.body }}>{c.label}</div>
            </div>
          ))}
        </div>
        <button onClick={onEnd} style={{ width:"100%", padding:"16px", borderRadius:17,
          background:`linear-gradient(135deg,${C.danger},#CC1133)`,
          border:"none", fontSize:20, cursor:"pointer", fontFamily:F.display, fontWeight:700,
          color:"#fff", letterSpacing:"0.04em", boxShadow:`0 8px 30px ${C.danger}66`,
          display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
          📵 End Call
        </button>
      </div>
    </div>
  );
}

/* ─── NAV ─── */
const NAV=[
  {key:"chat",icon:"💬",label:"Chats"},
  {key:"notifications",icon:"🔔",label:"Alerts"},
  {key:"profile",icon:"👤",label:"Profile"},
];

/* ─── APP ─── */
export default function App() {
  const [screen,setScreen]=useState("onboarding");
  const [chatUser,setChatUser]=useState(null);
  const [callUser,setCallUser]=useState(null);
  const [callType,setCallType]=useState(null);
  const [anim,setAnim]=useState(false);

  const navigate=to=>{ setAnim(true); setTimeout(()=>{ setScreen(to); setChatUser(null); setCallUser(null); setAnim(false); },120); };
  const openChat=user=>{ setAnim(true); setTimeout(()=>{ setChatUser(user); setCallUser(null); setAnim(false); },120); };
  const startCall=(type,user)=>{ setAnim(true); setTimeout(()=>{ setCallUser(user||chatUser); setCallType(type); setAnim(false); },120); };
  const endCall=()=>{ setAnim(true); setTimeout(()=>{ setCallUser(null); setCallType(null); setAnim(false); },120); };

  const isAuth=!["onboarding","login","signup","otp"].includes(screen);
  const showNav=isAuth&&!chatUser&&!callUser;

  const render=()=>{
    if(callUser&&callType==="video") return <VideoCallScreen user={callUser} onEnd={endCall} />;
    if(callUser&&callType==="audio") return <AudioCallScreen user={callUser} onEnd={endCall} />;
    switch(screen){
      case "onboarding":    return <OnboardingScreen onNavigate={navigate} />;
      case "login":         return <LoginScreen onNavigate={navigate} />;
      case "signup":        return <SignupScreen onNavigate={navigate} />;
      case "otp":           return <OTPScreen onNavigate={navigate} />;
      case "profile":       return <ProfileScreen onNavigate={navigate} />;
      case "settings":      return <SettingsScreen onNavigate={navigate} />;
      case "notifications": return <NotificationsScreen onNavigate={navigate} />;
      case "chat": return chatUser
        ? <ChatDetailScreen user={chatUser} onBack={()=>setChatUser(null)}
            onVideoCall={()=>startCall("video",chatUser)} onAudioCall={()=>startCall("audio",chatUser)} />
        : <ChatListScreen onNavigate={navigate} onOpenChat={openChat} />;
      default: return null;
    }
  };

  return (
    <>
      <FontLoader />
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:#020207;}
        input::placeholder{color:#44445A;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:#2A2A3F;border-radius:3px;}
        @keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
        @keyframes pulseRing{0%{opacity:.6;transform:translate(-50%,-50%) scale(.94);}100%{opacity:0;transform:translate(-50%,-50%) scale(1.28);}}
        @keyframes shakeFx{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-8px);}40%,80%{transform:translateX(8px);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
      `}</style>

      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
        justifyContent:"center", background:"#020207", padding:"20px 0" }}>

        {/* Ambient glows */}
        <div style={{ position:"fixed", width:560, height:560, borderRadius:"50%",
          background:`radial-gradient(circle,${C.primary}12,transparent 65%)`,
          top:"-5%", left:"22%", pointerEvents:"none" }} />
        <div style={{ position:"fixed", width:380, height:380, borderRadius:"50%",
          background:`radial-gradient(circle,${C.accent}0C,transparent 65%)`,
          bottom:"5%", right:"14%", pointerEvents:"none" }} />

        {/* Phone frame */}
        <div style={{ width:"100%", maxWidth:406,
          background:C.bg, borderRadius:48, border:`2px solid ${C.border}`, overflow:"hidden",
          boxShadow:`0 60px 140px rgba(0,0,0,0.92),0 0 0 1px ${C.primary}1E,inset 0 1px 0 ${C.borderLight}`,
          minHeight:800, display:"flex", flexDirection:"column" }}>

          {/* Notch */}
          <div style={{ height:36, display:"flex", alignItems:"center",
            justifyContent:"center", flexShrink:0, background:C.bg }}>
            <div style={{ width:122, height:28, background:"#000",
              borderRadius:"0 0 18px 18px", display:"flex",
              alignItems:"center", justifyContent:"center", gap:8 }}>
              <div style={{ width:9, height:9, borderRadius:"50%", background:"#1A1A1A", border:"1px solid #2A2A2A" }} />
              <div style={{ width:56, height:5, borderRadius:3, background:"#111" }} />
            </div>
          </div>

          {/* Screen */}
          <div style={{ flex:1, overflow:callUser||chatUser?"hidden":"auto",
            display:"flex", flexDirection:"column",
            opacity:anim?0:1, transform:anim?"translateY(10px)":"translateY(0)",
            transition:"opacity 0.12s,transform 0.12s", animation:"fadeUp 0.28s ease" }}>
            <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
              {render()}
            </div>
          </div>

          {/* Bottom nav */}
          {showNav&&(
            <div style={{ display:"flex", background:C.surface,
              borderTop:`1px solid ${C.border}`, padding:"10px 0 24px", flexShrink:0 }}>
              {NAV.map(item=>{
                const active=screen===item.key;
                return (
                  <button key={item.key} onClick={()=>navigate(item.key)}
                    style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                      gap:4, background:"none", border:"none", cursor:"pointer",
                      padding:"8px 0", position:"relative" }}>
                    {item.key==="notifications"&&(
                      <span style={{ position:"absolute", top:5, right:"calc(50% - 18px)",
                        width:7, height:7, borderRadius:"50%", background:C.accent,
                        border:`1.5px solid ${C.surface}` }} />
                    )}
                    <div style={{ width:46, height:29, borderRadius:99,
                      background:active?`${C.primary}28`:"transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:19, transition:"all 0.22s",
                      boxShadow:active?`0 0 16px ${C.primary}44`:"none" }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.06em",
                      color:active?C.primaryLight:C.textMuted,
                      textTransform:"uppercase", fontFamily:F.display }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Home indicator */}
          <div style={{ height:9, display:"flex", justifyContent:"center",
            alignItems:"center", background:C.bg, flexShrink:0 }}>
            <div style={{ width:124, height:4, borderRadius:2, background:C.border }} />
          </div>
        </div>
      </div>
    </>
  );
}
