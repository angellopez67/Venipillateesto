const wrap=document.getElementById('scenes'),nav=document.getElementById('nav'),
file=document.getElementById('file'),lb=document.getElementById('lb');
let n=0,target=null;
const lines=[
"<b>Cristo Rey</b><br><br><b>Imagen 1</b><br><b>Luppi:</b> —¡Uy, parce! Mira esa vista, desde acá Cali se ve una chimba.<br><b>Saby:</b> —De una, mi hermano. Pero pilas, que Cristo Rey no es solo pa’ venir a tomarse fotos, también tiene mucha historia.<br><br><b>Imagen 2</b><br><b>Luppi:</b> —¿Y cuál es la historia de esta estatua, parce?<br><b>Saby:</b> —Ve, píllate esta estatua: ahí donde la vez, está desde 1949 y se inauguró en 1953; la hicieron como símbolo de paz y se volvió emblemática en nuestra ciudad de Cali, ve.",

"<b>Bulevar del Río</b><br><br><b>Imagen 1</b><br><b>Saby:</b> —Parce, el bulevar es una chimba, la gente viene a parchar y a distraerse.<br><b>Luppi:</b> —¡Uy, sí, parce! El bulevar es una chimba para parcharse; se ha vuelto más comercial, ¿pero sabes algo parce?<br><br><b>Imagen 2</b><br><b>Luppi:</b> —El bulevar lo creó la caleña Elly Burckhardt en 2012 y se inauguró el 16 de mayo de 2013 con ese fin de conectar más a la gente y el comercio en la ciudad.<br><b>Saby:</b> —¡Uy, qué chimba, ve! No sabía de ese dato.",

"<b>San Antonio</b><br><br><b>Imagen 1</b><br><b>Saby:</b> —Mano, San Antonio es lo mejor para venir a pasar la música y relajarse.<br><b>Luppi:</b> —¡Parce!, hay hasta una iglesia; parce, San Antonio es un lugar antiguo que a través del tiempo se convirtió en un sitio emblemático y popular, atrayendo a los turistas.<br><br><b>Imagen 2</b><br><b>Saby:</b> —¡Uy, parce!, es viejo este lugar y hay mucha gente que aún no sabe la historia.<br><b>Luppi:</b> —Manito, la historia la debería conocer tanto la gente local como la gente de afuera de la ciudad.",

"<b>Pance</b><br><br><b>Imagen 1</b><br><b>Luppi:</b> —¡Saby, qué chimba estar aquí en el sur de la ciudad tirando baño en Pance! La verdad, ¡Pance nunca falla!<br><b>Saby:</b> —¡Jamás, parce! Pance se creó en los años 70, fue puesto como ecoparque por la gobernación, manito, y desde ahí pues disfrutando de este lugar maravilloso.<br><br><b>Imagen 2</b><br><b>Luppi:</b> —Y sin hablar de la cantidad de turistas que atrae Pance; es que Pance es la emoción y algo único.<br><b>Saby:</b> —Es más, manito, existe una novela que se llama <i>El alférez real</i>, escrita por Eustaquio Palacios, donde nos cuentan que unos protagonistas viajan a caballo admirando esta maravilla de lo que es Pance."
];

const imgs=[
  ["img/escena1-1.jpg","img/escena1-2.jpg"],
  ["img/escena2-1.jpg","img/escena2-2.jpg"],
  ["img/escena3-1.jpg","img/escena3-2.jpg"],
  ["img/escena4-1.jpg","img/escena4-2.jpg"]
];
/* ---------- Escenas ---------- */
function addScene(text){
  n++;const id=n;
  const s=document.createElement('section');s.className='scene';s.id='e'+id;
  s.setAttribute('aria-label','Escena '+id);
  s.innerHTML=`<h2><span>Escena ${id}</span><button class="btn r del" title="Borrar escena" aria-label="Borrar escena ${id}">🗑</button></h2>
  <div class="pair">${[1,2].map(i=>`<div class="slot" data-i="${i}" role="button" tabindex="0" aria-label="Imagen ${i} de la escena ${id}"><div class="hint"><b>🖼️</b>Toca para subir la imagen ${i}</div></div>`).join('')}</div>
  <div class="bubble" contenteditable="true" spellcheck="false" role="textbox" aria-label="Diálogo de la escena ${id}">${text||lines[(id-1)%lines.length]}</div>
  <div class="tools">
    <button class="btn like">🔥 ¡Qué chimba! <b>0</b></button>
    <button class="btn g speak" aria-label="Escuchar escena ${id}">🔊 Escuchar</button>
    <button class="btn rec" aria-label="Grabar narración de la escena ${id}">🎙️ Grabar</button>
    <button class="btn up" aria-label="Subir audio de la escena ${id}">📁 Subir audio</button>
    <audio class="narr" controls hidden aria-label="Narración de la escena ${id}"></audio>
  </div>`;
  wrap.appendChild(s);
  const pics=imgs[id-1];
if(pics){
  s.querySelectorAll('.slot').forEach((slot,i)=>{
    if(!pics[i])return;
    slot.innerHTML=`<img src="${pics[i]}" alt="Imagen ${i+1} de la escena ${id}"><button class="x" title="Quitar" aria-label="Quitar imagen">✕</button>`;
    slot.classList.add('has');
  });
}
  const b=document.createElement('button');b.textContent='Escena '+id;b.dataset.t=s.id;
  nav.appendChild(b);
}

/* ---------- Audio ---------- */
const audioIn=document.createElement('input');
audioIn.type='file';audioIn.accept='audio/*';audioIn.hidden=true;
document.body.appendChild(audioIn);
let audioScene=null,recorder=null,chunks=[];

function setAudio(sc,blob){
  const a=sc.querySelector('.narr');
  a.src=URL.createObjectURL(blob);a.hidden=false;a.load();
}

audioIn.addEventListener('change',()=>{
  const f=audioIn.files[0];
  if(f&&audioScene)setAudio(audioScene,f);
  audioIn.value='';
});

/* ---------- Clicks en las escenas ---------- */
wrap.addEventListener('click',async e=>{
  const sc=e.target.closest('.scene');if(!sc)return;

  // Borrar escena
  if(e.target.closest('.del')){
    if(confirm('¿Borrar esta escena?')){nav.querySelector(`[data-t="${sc.id}"]`)?.remove();sc.remove();}
    return;
  }

  // Me gusta
  if(e.target.closest('.like')){
    const b=sc.querySelector('.like b');b.textContent=+b.textContent+1;return;
  }

  // Escuchar: reproduce la narración si existe; si no, lee el diálogo
  if(e.target.closest('.speak')){
    const a=sc.querySelector('.narr');
    if(!a.hidden&&a.src){a.paused?a.play():a.pause();return;}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(
      'Escena '+sc.id.slice(1)+'. '+sc.querySelector('.bubble').textContent);
    u.lang='es-CO';speechSynthesis.speak(u);
    return;
  }

  // Quitar imagen
  if(e.target.classList.contains('x')){
    const slot=e.target.closest('.slot');slot.classList.remove('has');
    slot.innerHTML=`<div class="hint"><b>🖼️</b>Toca para subir la imagen ${slot.dataset.i}</div>`;return;
  }

  // Subir / ampliar imagen
  const slot=e.target.closest('.slot');if(!slot)return;
  if(slot.classList.contains('has')){lb.querySelector('img').src=slot.querySelector('img').src;lb.classList.add('on');}
  else{target=slot;file.click();}
});

// Teclado (Enter o espacio) sobre las imágenes
wrap.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('slot')){
    e.preventDefault();e.target.click();
  }
});

/* ---------- Imágenes ---------- */
file.addEventListener('change',()=>{
  const f=file.files[0];if(!f||!target)return;
  const slot=target;
  slot.innerHTML=`<img alt="Imagen del cómic"><button class="x" title="Quitar" aria-label="Quitar imagen">✕</button>`;
  slot.querySelector('img').src=URL.createObjectURL(f);
  slot.classList.add('has');file.value='';
});

lb.addEventListener('click',()=>lb.classList.remove('on'));
document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on');});

/* ---------- Navegación y controles ---------- */
nav.addEventListener('click',e=>{
  const t=e.target.dataset.t;
  if(t)document.getElementById(t)?.scrollIntoView();
});
document.getElementById('theme').onclick=()=>{
  const r=document.documentElement,
  dark=getComputedStyle(r).getPropertyValue('--bg').trim()==='#15131a';
  r.setAttribute('data-theme',dark?'light':'dark');
};
document.getElementById('read').onclick=()=>{
  const first=wrap.querySelector('.scene');if(first)first.scrollIntoView();
};
document.getElementById('add').onclick=()=>{
  addScene('Escribe aquí el diálogo...');wrap.lastElementChild.scrollIntoView();
};
addEventListener('scroll',()=>{
  const h=document.documentElement;
  document.getElementById('bar').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100)+'%';
},{passive:true});

/* ---------- Inicio ---------- */
for(let i=0;i<4;i++)addScene();
