
let ctx;function sound(f=500){try{ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();let o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.055,ctx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.18);o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+.2)}catch(e){}}

function emotionSound(name){
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const origin = ctx.currentTime;
    function note(from, offset, duration, to, type='sine', volume=.06) {
      const oscillator=ctx.createOscillator(), gain=ctx.createGain();
      oscillator.type=type;
      oscillator.frequency.setValueAtTime(from,origin+offset);
      if(to) oscillator.frequency.exponentialRampToValueAtTime(to,origin+offset+duration);
      gain.gain.setValueAtTime(.0001,origin+offset);
      gain.gain.exponentialRampToValueAtTime(volume,origin+offset+.025);
      gain.gain.exponentialRampToValueAtTime(.0001,origin+offset+duration);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(origin+offset);oscillator.stop(origin+offset+duration+.02);
    }
    if(name.includes('Enojo')) {note(140,0,.3,87,'sawtooth',.025);note(108,.29,.25,80,'sawtooth',.025);}
    else if(name.includes('Tristeza')) {note(440,0,.32,330);note(330,.3,.42,220);}
    else if(name.includes('Miedo')) {note(510,0,.16,610,'triangle');note(640,.19,.21,490,'triangle');}
    else if(name.includes('Alegría')) {note(523,0,.14);note(659,.16,.14);note(784,.33,.25);}
    else if(name.includes('Nervios')) {note(430,0,.12);note(465,.15,.12);note(430,.30,.12);}
    else {note(440,0,.18);}
  }catch(e){ /* Optional audio: never block the activity if muted or unsupported. */ }
}

const level=document.getElementById('level'),after=document.getElementById('after');function render(){let n=+level.value;document.getElementById('number').textContent=n;document.getElementById('indicator').style.bottom=n*10+'%';document.getElementById('zone').textContent=n===0?'🔵 Tranquilidad':n<=3?'🟢 Emoción leve':n<=6?'🟡 Emoción moderada':n<=8?'🟠 Emoción alta':'🔴 Emoción muy alta';document.getElementById('message').textContent=n>=7?'Puedo pedir compañía y ayuda a un adulto.':n>=4?'Puedo hacer una pausa y buscar una herramienta.':'Puedo notar cómo se siente mi cuerpo.';after.value=n;document.getElementById('afterNum').textContent=n}
level.addEventListener('input',()=>{render();sound(320+Number(level.value)*45)});after.addEventListener('input',()=>{document.getElementById('afterNum').textContent=after.value;sound(400)});document.querySelectorAll('#emotions button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#emotions button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');emotionSound(b.textContent)}));
document.getElementById('window').addEventListener('click',()=>{let el=document.getElementById('tools'),open=el.classList.toggle('hidden')===false;document.getElementById('window').setAttribute('aria-expanded',open);document.getElementById('window').textContent=open?'🚪 Cerrar ventanita':'🚪 Abrir ventanita ✨';sound(open?650:400)});
['🌬️ Respirar despacio','🧸 Abrazar un peluche','🎨 Dibujar','💬 Hablar con un adulto','🛋️ Descansar','🎵 Escuchar música','🚶 Caminar','💧 Tomar agua'].forEach((t,i)=>{let b=document.createElement('button');b.className='choice tool';b.textContent=t;b.addEventListener('click',()=>{document.getElementById('feedback').textContent='¡Elegiste '+t+'!';sound(550+i*35)});document.getElementById('toolChoices').appendChild(b)});
document.getElementById('reset').addEventListener('click',()=>{level.value=4;render();document.querySelectorAll('input[type=checkbox]').forEach(x=>x.checked=false);document.getElementById('feedback').textContent='';sound(480)});render();
