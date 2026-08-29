const canvas=document.getElementById('sea'); const ctx=canvas.getContext('2d');
let W=0,H=0,dpr=Math.min(2,window.devicePixelRatio||1);
function resize(){W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);}
addEventListener('resize',resize); resize();
const BETS=[0.05,0.10,0.25,0.50,1];
const ROUND_MS=180000;
const COLORS=['#3ee7ff','#ffd24a','#ff5ad1','#7cff6b'];
const NAMES=['P1 CYAN','P2 GOLD','P3 PINK','P4 LIME'];
const LEVELS=[
 {name:'CORAL SHALLOWS', bg:'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=70',
  fish:[
   {name:'Flashfin',emoji:'\u{1F41F}',hp:1,spd:3.0,pay:[0.25,0.70],w:34,h:22,prob:30,spec:null,move:'linear_fast',col:'#00f0ff'},
   {name:'Clownfin',emoji:'\u{1F420}',hp:2,spd:2.1,pay:[0.50,1.20],w:42,h:30,prob:20,spec:null,move:'sinusoidal',col:'#ff6b00'},
   {name:'Puffer',emoji:'\u{1F421}',hp:4,spd:1.3,pay:[1.10,2.20],w:50,h:42,prob:14,spec:'inflate',move:'slow_linear',col:'#7cff3a'},
   {name:'Turtle',emoji:'\u{1F422}',hp:6,spd:1.1,pay:[1.80,3.40],w:58,h:44,prob:10,spec:null,move:'wave',col:'#2ee6a8'},
   {name:'Reef Crab',emoji:'\u{1F980}',hp:8,spd:0.8,pay:[2.20,4.00],w:70,h:52,prob:6,spec:null,move:'slow_linear',col:'#ff7a4d'}
  ],
  boss:{name:'Coral Titan Crab',emoji:'\u{1F980}',hp:28,spd:0.55,pay:[8,14],w:110,h:80,spec:'boss',move:'tentacle_swipe',col:'#ff4d6d'}
 },
 {name:'NEON REEF', bg:'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1600&q=70',
  fish:[
   {name:'Neon Tetra',emoji:'\u{1F41F}',hp:1,spd:3.2,pay:[0.22,0.65],w:34,h:22,prob:28,spec:null,move:'linear_fast',col:'#3ee7ff'},
   {name:'Aurora Koi',emoji:'\u{1F38F}',hp:3,spd:1.6,pay:[0.90,2.10],w:60,h:44,prob:12,spec:'golden',move:'wave',col:'#ffd24a'},
   {name:'Jelly',emoji:'\u{1FABC}',hp:2,spd:1.0,pay:[0.55,1.30],w:46,h:50,prob:14,spec:'freeze',move:'floating_pulse',col:'#c84dff'},
   {name:'Octo',emoji:'\u{1F419}',hp:7,spd:1.15,pay:[1.70,3.20],w:56,h:52,prob:10,spec:null,move:'erratic',col:'#5ad0ff'},
   {name:'Crystal Crab',emoji:'\u{1F980}',hp:10,spd:0.7,pay:[2.40,4.40],w:78,h:58,prob:6,spec:null,move:'slow_linear',col:'#ff4fd8'}
  ],
  boss:{name:'Prism Dragon',emoji:'\u{1F409}',hp:36,spd:0.7,pay:[10,18],w:120,h:78,spec:'boss',move:'tentacle_swipe',col:'#ff7a00'}
 },
 {name:'MIDNIGHT TRENCH', bg:'https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=1600&q=70',
  fish:[
   {name:'Spark Eel',emoji:'\u26A1',hp:5,spd:2.6,pay:[1.10,2.40],w:92,h:20,prob:16,spec:null,move:'zigzag',col:'#ffe14a'},
   {name:'Blaze Shark',emoji:'\u{1F988}',hp:12,spd:2.0,pay:[2.80,5.20],w:76,h:40,prob:10,spec:null,move:'aggressive_linear',col:'#ff5a2a'},
   {name:'Gloom Ray',emoji:'\u{1F987}',hp:8,spd:1.7,pay:[1.80,3.50],w:100,h:48,prob:10,spec:null,move:'wave',col:'#6aa0ff'},
   {name:'Angler',emoji:'\u{1F41F}',hp:9,spd:1.2,pay:[2.00,3.80],w:70,h:50,prob:10,spec:null,move:'erratic',col:'#ff8a3d'},
   {name:'Puffer',emoji:'\u{1F421}',hp:4,spd:1.25,pay:[0.90,1.90],w:50,h:42,prob:14,spec:'inflate',move:'slow_linear',col:'#9cff57'}
  ],
  boss:{name:'Trench Leviathan',emoji:'\u{1F40B}',hp:48,spd:0.6,pay:[12,22],w:150,h:80,spec:'boss',move:'wave',col:'#4d7cff'}
 },
 {name:'ABYSS GATE', bg:'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1600&q=70',
  fish:[
   {name:'Voidfin',emoji:'\u{1F41F}',hp:2,spd:2.4,pay:[0.40,1.00],w:38,h:24,prob:22,spec:null,move:'linear_fast',col:'#7a5cff'},
   {name:'Inkveil',emoji:'\u{1F991}',hp:8,spd:1.3,pay:[1.70,3.30],w:62,h:56,prob:12,spec:null,move:'erratic',col:'#b14dff'},
   {name:'Shadow Manta',emoji:'\u{1F987}',hp:11,spd:1.8,pay:[2.40,4.60],w:120,h:52,prob:8,spec:null,move:'wave',col:'#3ee7ff'},
   {name:'Jelly',emoji:'\u{1FABC}',hp:3,spd:0.95,pay:[0.60,1.40],w:48,h:52,prob:12,spec:'freeze',move:'floating_pulse',col:'#d24dff'},
   {name:'Abyss Crab',emoji:'\u{1F980}',hp:14,spd:0.65,pay:[3.00,5.50],w:88,h:64,prob:6,spec:null,move:'slow_linear',col:'#ff4d88'}
  ],
  boss:{name:'Nova Krakenling',emoji:'\u{1F991}',hp:70,spd:0.5,pay:[16,28],w:160,h:120,spec:'boss',move:'tentacle_swipe',col:'#9b4dff'}
 }
];
const state={level:0,running:false,endsAt:0,pot:0,fishes:[],bullets:[],parts:[],pops:[],freezeUntil:0,boss:null,last:performance.now(),mouse:{x:0,y:0,down:false}};
const players=[0,1,2,3].map(i=>({id:i,name:NAMES[i],color:COLORS[i],human:i===0,sat:true,credits:25,betIdx:2,auto:i!==0,won:0,lastShot:0,aim:0}));
function money(n){return '$'+Number(n).toFixed(2);}
function rand(a,b){return a+Math.random()*(b-a);}
function toast(t){const e=document.getElementById('toast');e.textContent=t;setTimeout(()=>{if(e.textContent===t)e.textContent='';},1400);}
function showWin(t){const e=document.getElementById('winPop');e.textContent=t;e.classList.remove('show');void e.offsetWidth;e.classList.add('show');}
function lvl(){return LEVELS[state.level%LEVELS.length];}
function setBg(){document.getElementById('bg').style.backgroundImage="url('"+lvl().bg+"')";}
function pickFish(){const arr=lvl().fish;const tot=arr.reduce((a,t)=>a+t.prob,0);let r=Math.random()*tot;for(const t of arr){r-=t.prob;if(r<=0)return t;}return arr[0];}
function cannonPos(i){const pad=70;if(i===0)return{x:W*0.28,y:H-78};if(i===1)return{x:W*0.72,y:H-78};if(i===2)return{x:pad+10,y:H*0.42};return{x:W-pad-10,y:H*0.42};}
function renderSeats(){
 document.getElementById('seats').innerHTML=players.map(p=>`<div class="seat ${p.human&&p.sat?'you':''}" data-id="${p.id}"><div class="nm" style="color:${p.color}">${p.name} ${p.human?'\u2022 YOU':(p.sat?'\u2022 CPU':'')}</div><div>${money(p.credits)}</div><div class="row"><button data-act="bet" data-id="${p.id}">${money(BETS[p.betIdx])}</button>${p.human?`<button data-act="auto" data-id="${p.id}" class="${p.auto?'on':''}">${p.auto?'AUTO':'MAN'}</button>`:`<button data-act="kick" data-id="${p.id}">${p.sat?'CPU ON':'SIT CPU'}</button>`}</div></div>`).join('');
}
document.getElementById('seats').addEventListener('click',e=>{
 const btn=e.target.closest('button'); if(!btn) return;
 const p=players[+btn.dataset.id];
 if(btn.dataset.act==='bet') p.betIdx=(p.betIdx+1)%BETS.length;
 if(btn.dataset.act==='auto') p.auto=!p.auto;
 if(btn.dataset.act==='kick'){p.sat=!p.sat;p.auto=p.sat;}
 renderSeats();
});
class Fish{
 constructor(type,isBoss){const t=type;this.t=t;this.boss=!!isBoss;this.hp=t.hp;this.w=t.w;this.h=t.h;this.dir=Math.random()<.5?1:-1;this.x=this.dir>0?-this.w-16:W+this.w+16;this.y=rand(80,H*0.70);this.baseY=this.y;this.spd=t.spd*rand(.86,1.16)*this.dir;this.vy=0;this.phase=Math.random()*Math.PI*2;this.scale=1;this.flash=0;this.dead=false;this.trail=[];}
 update(dt){if(Date.now()<state.freezeUntil&&!this.boss)return;const b=this.t.move;this.phase+=dt*(b==='zigzag'?10:b==='erratic'?6:3.1);
  switch(b){case 'linear_fast':this.x+=this.spd*60*dt;this.y=this.baseY+Math.sin(this.phase)*6;break;case 'sinusoidal':this.x+=this.spd*60*dt;this.y=this.baseY+Math.sin(this.phase)*22;break;case 'wave':this.x+=this.spd*60*dt;this.y=this.baseY+Math.sin(this.phase)*16;break;case 'zigzag':this.x+=this.spd*60*dt;this.y=this.baseY+Math.sin(this.phase)*26*(Math.sin(this.phase*2)>0?1:-.5);break;case 'erratic':if(Math.random()<.018)this.spd*=-1;this.x+=this.spd*60*dt;this.y=this.baseY+Math.sin(this.phase)*18+Math.cos(this.phase*1.6)*8;break;case 'floating_pulse':this.x+=this.spd*34*dt;this.y=this.baseY+Math.sin(this.phase)*16;this.scale=1+Math.sin(this.phase*2.2)*0.12;break;case 'aggressive_linear':this.x+=this.spd*68*dt;this.y=this.baseY+Math.sin(this.phase)*9;break;case 'tentacle_swipe':this.x+=this.spd*38*dt;if(Math.sin(this.phase)>.93)this.vy=(Math.random()<.5?1:-1)*80;this.y+=this.vy*dt;this.vy*=.86;break;default:this.x+=this.spd*50*dt;this.y=this.baseY+Math.sin(this.phase)*8;}
  this.y=Math.max(70,Math.min(H*0.74,this.y));this.flash=Math.max(0,this.flash-dt*4);if(Math.abs(this.spd)>2.1){this.trail.push({x:this.x,y:this.y});if(this.trail.length>5)this.trail.shift();}}
 draw(){ctx.save();this.trail.forEach((p,i)=>{ctx.globalAlpha=.1+i*.04;ctx.fillStyle=this.t.col;ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;ctx.translate(this.x,this.y);if(this.spd<0)ctx.scale(-1,1);ctx.scale(this.scale*(this.flash?1.07:1),this.scale);ctx.shadowBlur=16;ctx.shadowColor=this.t.col;ctx.font=this.h+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';if(this.flash)ctx.filter='brightness(2)';ctx.fillText(this.t.emoji,0,0);ctx.restore();}
 hit(owner){this.hp-=1;this.flash=1;if(this.t.spec==='inflate')this.scale=Math.min(1.45,this.scale+.1);burst(this.x,this.y,[this.t.col,'#fff'],6,2.6);if(this.hp<=0){this.dead=true;this.payout(owner);return true;}return false;}
 payout(owner){const bet=BETS[owner.betIdx];const mult=rand(this.t.pay[0],this.t.pay[1]);const earned=+(bet*mult*0.92).toFixed(2);owner.credits+=earned;owner.won+=earned;state.pot+=earned;burst(this.x,this.y,this.t.spec==='golden'?['#ffd24a','#fff']:[this.t.col,'#ffd24a','#fff'],this.boss?36:16,this.boss?8:5);state.pops.push({x:this.x,y:this.y,txt:'+'+money(earned),col:owner.color,life:1});if(earned>=bet*6)showWin(owner.name+'  '+money(earned));if(this.t.spec==='freeze'){state.freezeUntil=Date.now()+1400;toast('FREEZE');}if(this===state.boss)state.boss=null;renderSeats();}
 off(){return this.dir>0?this.x>W+this.w+30:this.x<-this.w-30;}
}
function burst(x,y,cols,n,spd){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=rand(spd*.3,spd);state.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,c:cols[i%cols.length],sz:rand(2,4)});}}
function spawn(){if(state.fishes.length>13)return;state.fishes.push(new Fish(pickFish(),false));}
function spawnBoss(){if(state.boss)return;const f=new Fish(lvl().boss,true);state.fishes.push(f);state.boss=f;toast('BOSS \u00b7 '+lvl().boss.name);}
function fire(p){if(!p.sat||!state.running)return;const cost=BETS[p.betIdx];if(p.credits<cost){if(p.human)toast('Need credits');return;}p.credits=Math.max(0,+(p.credits-cost).toFixed(2));const c=cannonPos(p.id);let ang;if(p.human&&!p.auto)ang=Math.atan2(state.mouse.y-c.y,state.mouse.x-c.x);else{const live=state.fishes.filter(f=>!f.dead);const tgt=live[Math.floor(Math.random()*Math.max(1,live.length))];if(!tgt)return;ang=Math.atan2(tgt.y-c.y,tgt.x-c.x)+rand(-0.18,0.18);}state.bullets.push({x:c.x,y:c.y,vx:Math.cos(ang)*12.5,vy:Math.sin(ang)*12.5,owner:p});renderSeats();}
function drawCannon(p){if(!p.sat)return;const c=cannonPos(p.id);let ang;if(p.human&&!p.auto)ang=Math.atan2(state.mouse.y-c.y,state.mouse.x-c.x);else ang=p.aim||-Math.PI/2;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(ang);ctx.fillStyle='#18243f';ctx.fillRect(0,-7,48,14);ctx.fillStyle=p.color;ctx.fillRect(42,-5,12,10);ctx.restore();ctx.beginPath();ctx.arc(c.x,c.y,18,0,Math.PI*2);ctx.fillStyle='#10182c';ctx.fill();ctx.strokeStyle=p.color;ctx.lineWidth=3;ctx.stroke();}
function startRound(){state.running=true;state.endsAt=Date.now()+ROUND_MS;state.fishes.length=0;state.bullets.length=0;state.parts.length=0;state.pops.length=0;state.boss=null;state.pot=0;state.freezeUntil=0;players.forEach(p=>p.won=0);setBg();document.getElementById('lvlName').textContent='L'+(state.level%LEVELS.length+1);document.getElementById('lvlSub').textContent=lvl().name;document.getElementById('overlay').classList.remove('show');for(let i=0;i<7;i++)spawn();setTimeout(()=>{if(state.running)spawnBoss();},18000);renderSeats();}
function endRound(){state.running=false;const next=LEVELS[(state.level+1)%LEVELS.length];const rows=players.filter(p=>p.sat).sort((a,b)=>b.won-a.won).map(p=>`<div><span style="color:${p.color}">${p.name}</span><span>${money(p.won)}</span></div>`).join('');document.getElementById('card').innerHTML=`<h2>ROUND OVER</h2><p>${lvl().name} complete. House keeps the edge.</p><div class="scores">${rows||'<div>No seated players</div>'}</div><p>Next: <b>${next.name}</b></p><button class="gold" id="goNext">NEXT LEVEL</button>`;document.getElementById('overlay').classList.add('show');document.getElementById('goNext').onclick=()=>{state.level++;startRound();};}
function loop(now){const dt=Math.min(.033,(now-state.last)/1000);state.last=now;ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(4,8,24,.22)';ctx.fillRect(0,0,W,H);
 if(state.running){const left=Math.max(0,state.endsAt-Date.now());const s=Math.ceil(left/1000);document.getElementById('timer').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');document.getElementById('pot').textContent=money(state.pot);if(left<=0)endRound();if(Math.random()<0.035)spawn();if(!state.boss&&Math.random()<0.0012)spawnBoss();
  players.forEach(p=>{if(!p.sat)return;const gap=p.human&&!p.auto?150:280+p.id*40;if((p.auto||(p.human&&state.mouse.down))&&now-p.lastShot>gap){fire(p);p.lastShot=now;}});}
 for(let i=state.fishes.length-1;i>=0;i--){const f=state.fishes[i];if(state.running)f.update(dt);if(f.off()||f.dead)state.fishes.splice(i,1);else f.draw();}
 for(let i=state.bullets.length-1;i>=0;i--){const b=state.bullets[i];b.x+=b.vx;b.y+=b.vy;ctx.fillStyle=b.owner.color;ctx.beginPath();ctx.arc(b.x,b.y,3.4,0,Math.PI*2);ctx.fill();let hit=false;for(const f of state.fishes){if(Math.abs(b.x-f.x)<f.w*.42&&Math.abs(b.y-f.y)<f.h*.42){f.hit(b.owner);hit=true;break;}}if(hit||b.x<-20||b.x>W+20||b.y<-20||b.y>H+20)state.bullets.splice(i,1);}
 for(let i=state.parts.length-1;i>=0;i--){const p=state.parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=7*dt;p.life-=dt*1.7;ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,p.sz,p.sz);if(p.life<=0)state.parts.splice(i,1);}ctx.globalAlpha=1;
 for(let i=state.pops.length-1;i>=0;i--){const p=state.pops[i];p.y-=18*dt;p.life-=dt;ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.col||'#ffd24a';ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.fillText(p.txt,p.x,p.y);if(p.life<=0)state.pops.splice(i,1);}ctx.globalAlpha=1;
 players.forEach(drawCannon);requestAnimationFrame(loop);
}
canvas.addEventListener('pointermove',e=>{state.mouse.x=e.clientX;state.mouse.y=e.clientY;});
canvas.addEventListener('pointerdown',e=>{state.mouse.x=e.clientX;state.mouse.y=e.clientY;state.mouse.down=true;const human=players.find(p=>p.human&&p.sat);if(human&&!human.auto)fire(human);});
addEventListener('pointerup',()=>state.mouse.down=false);
renderSeats();
document.getElementById('card').innerHTML='<h2>4-SEAT OCEAN TABLE</h2><p>180 second rounds. New waters and a new boss each level. No health bars. Payouts are house-edged practice credits.</p><p>You are <b style="color:#3ee7ff">P1 CYAN</b>. Other seats start as CPU.</p><button class="gold" id="goStart">START ROUND</button>';
document.getElementById('overlay').classList.add('show');
document.getElementById('goStart').onclick=startRound;
setBg();
requestAnimationFrame(loop);
