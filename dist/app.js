'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2}).format(n)+' ₽';
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state={step:0,audience:null,concern:null,material:null,experience:null,arches:'unknown',system:'metalLig'};
let lastQuote=null;
const scenes=[
  ['Сначала — ваши пожелания','Начать с себя.','Несколько неровных зубов. Желание улыбаться свободнее. Начнём с разговора.'],
  ['После диагностики и обсуждения плана','Установка брекетов.','Система установлена. Врач объясняет уход и помогает разобраться в периоде адаптации.'],
  ['Плановые визиты к ортодонту','Коррекция системы.','Постепенные изменения и контроль на приёмах. Их частота и срок лечения индивидуальны.'],
  ['После основного этапа лечения','Снятие системы.','Врач оценивает результат и обсуждает дальнейшее наблюдение.'],
  ['Ваша улыбка — и жизнь дальше','Улыбаться смелее.','Финал этой иллюстративной истории. Сохранение результата в жизни — отдельная часть вашего плана.']
];
let activeScene=-1;
function setScene(index){
  if(index===activeScene)return;activeScene=index;
  const scene=scenes[index];$('.hero-art').dataset.scene=String(index);
  $('.journey').dataset.stage=String(index);
  $$('.portrait-slide').forEach((img,i)=>{img.classList.toggle('active',i===index);img.setAttribute('aria-hidden',String(i!==index));});
  $('#pointer-caption').textContent=['До начала лечения','Установка брекетов','Коррекция брекетов','Снятие системы','Сохранение результата'][index];
  $('#scene-label').textContent=scene[0];$('#scene-title').textContent=scene[1];$('#scene-copy').textContent=scene[2];$('#scene-number').textContent=`0${index+1} / 05`;
  $$('.scene-dots button').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});
}
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function updateSceneFromScroll(){
  const journey=$('.journey');const distance=journey.offsetHeight-$('.hero-sticky').offsetHeight;
  if(reducedMotion.matches||distance<=0)return;
  const progress=Math.min(1,Math.max(0,(-journey.getBoundingClientRect().top+parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header')))/distance));
  setScene(Math.min(scenes.length-1,Math.floor(progress*scenes.length)));
}
let scrollTick=false;addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(()=>{updateSceneFromScroll();scrollTick=false;});scrollTick=true;}},{passive:true});
$$('.scene-dots button').forEach(b=>b.addEventListener('click',()=>{
  const i=Number(b.dataset.scene);setScene(i);
  if(!reducedMotion.matches){const j=$('.journey'),h=$('.hero-sticky').offsetHeight;const top=j.getBoundingClientRect().top+scrollY-parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header'));scrollTo({top:top+(j.offsetHeight-h)*(i/(scenes.length-1)),behavior:'smooth'});}
}));setScene(0);
const menu=$('.menu-toggle');menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));$('#mobile-menu').hidden=expanded;});
$$('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');$('#mobile-menu').hidden=true;}));

const audiences=[['young','Для себя, мне 18–24 года','Хочу понять варианты и расходы'],['adult','Для себя, мне 25 лет или больше','Давно думаю об этом — хочу разобраться'],['parent','Для подростка — я родитель','Нужен понятный план для нашей семьи']];
const concernOptions={
  young:[['budget','Общая стоимость'],['looks','Заметность брекетов'],['comfort','Возможный дискомфорт'],['doctor','Выбор врача'],['explore','Пока хочу разобраться']],
  adult:[['budget','Не понимаю полный бюджет'],['doctor','Боюсь ошибиться с врачом'],['looks','Переживаю из-за внешнего вида'],['life','Не знаю, как совместить с работой'],['explore','Пока изучаю варианты']],
  parent:[['need','Необходимо ли лечение'],['doctor','Как выбрать врача'],['care','Справится ли подросток с уходом'],['budget','Как спланировать расходы'],['comfort','Какие ощущения возможны']]
};
const helpTexts={
  budget:['Важно учесть весь путь','Сумма выше относится к выбранной позиции прайса. Диагностика, наблюдение, снятие и ретенция требуют уточнения — так проще заранее обсудить реальные расходы.'],
  looks:['Заметность можно сравнить','Керамические брекеты близки по оттенку к зубам, но дуга и другие элементы могут быть заметны. Обсудите внешний вид разных систем с ортодонтом.'],
  doctor:['Сначала — знакомство с врачом','Ваш ортодонт — Мнежжа Аймен. На консультации можно обсудить основания плана, необходимые обследования и альтернативы. Решение об установке не нужно принимать в квизе.'],
  comfort:['Об адаптации можно спросить заранее','Обсудите с ортодонтом возможные ощущения после установки, правила ухода и порядок связи, если что-то беспокоит.'],
  life:['Лечение в привычном ритме','Расскажите врачу о работе, поездках и графике. Частота посещений определяется планом, а расположение клиники в Шушарах поможет оценить удобство маршрута.'],
  need:['Необходимость определяет врач','Для подростка важны осмотр и оценка развития прикуса. Квиз не назначает лечение: на консультации обсудите, какие действия нужны сейчас.'],
  care:['В лечении участвует и подросток','Обсудите с врачом уход, посещения и то, как поддержать ребёнка. Подростку важно понимать свои задачи и иметь возможность задавать вопросы.'],
  explore:['Можно начать с вопросов','Этот расчёт помогает сравнить опубликованные цены. На консультации ортодонт оценит ситуацию и объяснит дальнейшие диагностические шаги.']
};
function stepInfo(){
  if(state.step===0)return{title:'Для кого рассматриваете брекеты?',sub:'У каждого свой повод начать. Подстроим пояснения под вашу ситуацию.',options:audiences,key:'audience'};
  if(state.step===1)return{title:state.audience==='parent'?'Что важно выяснить в первую очередь?':state.audience==='young'?'Что больше всего беспокоит?':'Что мешает начать лечение?',sub:'Выберите главное. Ответ изменит пояснение, но не стоимость.',options:concernOptions[state.audience],key:'concern'};
  if(state.step===2)return{title:'Какие системы хотите сравнить?',sub:'Выбор в квизе — ориентир для расчёта. Подходящий вариант обсуждается с врачом.',options:[['metal','Металлические','Заметны на зубах'],['ceramic','Керамические','Близки по оттенку к зубам'],['compare',state.audience==='parent'?'Пока нужна рекомендация врача':'Покажите разницу','Сравним варианты без обязательств']],key:'material'};
  return{title:state.audience==='parent'?'Подросток уже был у ортодонта?':'Уже консультировались с ортодонтом?',sub:'Если есть рекомендации, можно указать рекомендованный объём. Если нет — покажем цену за единицу из прайса.',options:[['no','Нет, начинаем разбираться'],['yes','Да, есть рекомендации'],['ongoing',state.audience==='parent'?'Уже проходит лечение':'Хочу обсудить продолжение лечения']],key:'experience'};
}
function renderQuiz(focus=false){
  $('#quiz-step-label').textContent=state.step===4?'Ваш результат':`Шаг ${state.step+1} из 4`;
  $('#quiz-percent').textContent=state.step===4?'100%':`${(state.step+1)*25}%`;
  $('#quiz-progress').style.width=`${state.step===4?100:(state.step+1)*25}%`;
  $$('.quiz-step-list li').forEach((li,i)=>{li.classList.toggle('current',state.step===i);li.classList.toggle('done',state.step>i);});
  const panel=$('#quiz-main');
  if(state.step===4){renderResult();if(focus)focusHeading();return;}
  const info=stepInfo();
  panel.innerHTML=`<p class="quiz-kicker">${['Ваш сценарий','Ваши приоритеты','Материал системы','Предыдущий опыт'][state.step]}</p><h3 tabindex="-1">${info.title}</h3><p class="quiz-sub">${info.sub}</p><div class="quiz-options" role="group" aria-label="${info.title}">${info.options.map((o,i)=>`<button class="quiz-option ${state[info.key]===o[0]?'selected':''}" data-answer="${o[0]}" aria-pressed="${state[info.key]===o[0]}"><span class="option-icon">${state[info.key]===o[0]?'✓':String(i+1).padStart(2,'0')}</span><span>${o[1]}${o[2]?`<span class="option-desc">${o[2]}</span>`:''}</span></button>`).join('')}</div>${state.step===3&&state.experience==='yes'?`<label class="quiz-extra">Какой объём рекомендовал врач?<select id="recommended-arches"><option value="unknown">Не помню / пока не определён</option><option value="1" ${state.arches==='1'?'selected':''}>Одна челюсть</option><option value="2" ${state.arches==='2'?'selected':''}>Две челюсти</option></select></label>`:''}<div class="quiz-nav">${state.step>0?'<button class="back-button" id="quiz-back">← Назад</button>':'<span class="fine-print">Ваши ответы не отправляются</span>'}<button class="button primary" id="quiz-next" ${state[info.key]?'':'disabled'}>${state.step===3?'Посмотреть расчёт':'Дальше'} ↗</button></div>`;
  $$('#quiz-main [data-answer]').forEach(b=>b.addEventListener('click',()=>{
    const old=state[info.key];state[info.key]=b.dataset.answer;
    if(info.key==='audience'&&old!==state.audience){state.concern=null;}
    if(info.key==='material')state.system=state.material==='ceramic'?'ceramicSelf':'metalLig';
    if(info.key==='experience'&&state.experience!=='yes')state.arches='unknown';
    renderQuiz();
    const chosen=$(`#quiz-main [data-answer="${state[info.key]}"]`);if(chosen)chosen.focus({preventScroll:true});
  }));
  $('#quiz-next').addEventListener('click',()=>{if(!state[info.key])return;state.step++;renderQuiz(true);});
  $('#quiz-back')?.addEventListener('click',()=>{state.step--;renderQuiz(true);});
  $('#recommended-arches')?.addEventListener('change',e=>{state.arches=e.target.value;});
  if(focus)focusHeading();
}
function focusHeading(){const h=$('#quiz-main h3');h?.focus({preventScroll:true});if(innerWidth<601){const y=$('#calculator').getBoundingClientRect().top+scrollY-80;scrollTo({top:y,behavior:reducedMotion.matches?'auto':'smooth'});}}
function getQuote(){return BracesCalc.quote(state.system,state.arches==='2'?2:1);}
function renderResult(){
  const panel=$('#quiz-main');
  if(state.experience==='ongoing'){
    lastQuote=null;panel.innerHTML='<div class="result-empty"><p class="quiz-kicker">Ваша ситуация требует отдельной оценки</p><h3 tabindex="-1">Продолжение лечения — после знакомства с вашей историей.</h3><p>Стоимость новой системы не подходит для расчёта начатого лечения. Ортодонт оценит документы, текущую ситуацию и дальнейшие шаги на консультации.</p><button class="button primary" id="ongoing-book">Обсудить продолжение лечения ↗</button><div class="quiz-nav"><button class="back-button" id="result-back">← Изменить ответы</button></div></div>';
    $('#ongoing-book').addEventListener('click',()=>openBooking('Продолжение ортодонтического лечения'));$('#result-back').addEventListener('click',()=>{state.step=3;renderQuiz(true);});return;
  }
  const q=getQuote();lastQuote=q;
  const help=helpTexts[state.concern]||helpTexts.explore;
  const unit=q.unitUnconfirmed?'объём позиции требует уточнения':state.arches==='2'?'две челюсти · расчётный сценарий':state.arches==='1'?'одна челюсть по рекомендации':'одна челюсть · единица прайса';
  panel.innerHTML=`<div class="result-top"><span class="tag">Ориентир по прайсу клиники</span><button class="back-button" id="result-back">Изменить ответы</button></div><h3 tabindex="-1">${q.item.name}</h3><p class="result-subprice">${unit}</p><div class="result-controls"><label>Система<select id="result-system">${Object.entries(BracesCalc.systems).map(([key,s])=>`<option value="${key}" ${key===state.system?'selected':''}>${s.name}</option>`).join('')}</select></label><label>Расчётный объём<select id="result-arches" ${q.unitUnconfirmed?'disabled':''}><option value="unknown" ${state.arches==='unknown'?'selected':''}>Пока не определён · цена за 1 челюсть</option><option value="1" ${state.arches==='1'?'selected':''}>1 челюсть по рекомендации врача</option><option value="2" ${state.arches==='2'?'selected':''}>2 челюсти по рекомендации врача</option></select></label></div><p class="result-price">${money(q.total)}</p><p class="result-subprice">За выбранную позицию${q.count===2?' × 2':''}. Это не полная стоимость лечения.</p><div class="notice">${q.unitUnconfirmed?'Для этой позиции прайс не уточняет количество челюстей. Сумма не умножается.':'Состав пакета нужно уточнить: диагностика, наблюдение, снятие и ретенция могут оплачиваться отдельно.'}</div><details class="inline-details"><summary>Какие ещё расходы нужно обсудить?</summary><div class="cost-lines"><div class="cost-line"><span>Первичная консультация</span><span>800 ₽</span></div><div class="cost-line"><span>Диагностический приём</span><span>6 500 ₽</span></div><div class="cost-line"><span>Активация · 1 челюсть</span><span>3 500 ₽</span></div><div class="cost-line"><span>Снятие · 1 челюсть</span><span>8 700 ₽</span></div><div class="cost-line"><span>Фиксация ретейнера · 1 челюсть</span><span>4 500 ₽</span></div></div><p class="fine-print">Это отдельные позиции прайса. Они не прибавлены автоматически, чтобы не посчитать включённые услуги дважды. Подготовка, исследования, гигиена и другие процедуры — по показаниям и составу плана.</p></details><div class="result-payment"><h4>Если распределить выбранную сумму</h4><div class="result-payment-grid"><div><span>Первый взнос · 50%</span><b>${money(q.schedule.initial)}</b></div><div><span>Месяцы 1–6 · каждый</span><b>${money(q.schedule.monthly)}</b></div><div><span>Месяц 7</span><b>${money(q.schedule.last)}</b></div></div><div class="result-chart" aria-hidden="true">${q.schedule.payments.map((v,i)=>`<i style="height:${Math.max(9,v/q.total*110)}px" title="${i===0?'Первый платёж':'Месяц '+i}"></i>`).join('')}</div><p class="fine-print" style="margin:12px 0 0">Пример для выбранной позиции. Применение схемы и состав суммы согласуются с клиникой. Срок оплаты не равен сроку лечения.</p></div><div class="result-help"><strong>${help[0]}</strong>${help[1]}</div><div class="result-footer"><button class="button primary" id="result-book">${state.audience==='parent'?'Записать подростка':'Записаться и уточнить расчёт'} ↗</button><button class="text-link" id="download-quote">Сохранить расчёт ↓</button></div><p class="fine-print" style="margin:14px 0 0">Персональный план и итоговая стоимость — после диагностики. ${state.audience==='parent'?'Консультация детского ортодонта':'Консультация ортодонта'} — 800 ₽.</p>`;
  $('#result-back').addEventListener('click',()=>{state.step=3;renderQuiz(true);});
  $('#result-system').addEventListener('change',e=>{state.system=e.target.value;renderResult();$('#result-system').focus({preventScroll:true});});
  $('#result-arches').addEventListener('change',e=>{state.arches=e.target.value;renderResult();$('#result-arches').focus({preventScroll:true});});
  $('#result-book').addEventListener('click',()=>openBooking(`${q.item.name} · ${unit} · ${money(q.total)} по выбранной позиции`));
  $('#download-quote').addEventListener('click',downloadQuote);
}
function quoteText(){if(!lastQuote)return'';const q=lastQuote;return`Звёздная Улыбка — предварительный расчёт\n${q.item.name}\nОбъём: ${q.unitUnconfirmed?'уточняется':q.count+' челюсть(и)'}\nПозиция прайса: ${money(q.total)}\nЭто не полная стоимость лечения.\n\nПример оплаты выбранной суммы:\nПервый платёж: ${money(q.schedule.initial)}\nМесяцы 1–6: по ${money(q.schedule.monthly)}\nМесяц 7: ${money(q.schedule.last)}\nВсего: ${money(q.total)}\n\nСостав пакета, дополнительные расходы и применение схемы уточняются с клиникой.\nКонсультация — 800 ₽.\nТелефон: +7 (921) 864-66-99\nШушары, Новгородский проспект, 2, к.1\nИсточник цен: https://clinic-bk.ru/prices\nДата расчёта: ${new Date().toLocaleDateString('ru-RU')}`;}
function downloadQuote(){const url=URL.createObjectURL(new Blob(['\uFEFF'+quoteText()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Звёздная-Улыбка-предварительный-расчёт.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);showToast('Расчёт сохранён. Его можно взять на консультацию.');}
$$('[data-concern]').forEach(b=>b.addEventListener('click',()=>{state.concern=b.dataset.concern;$('#calculator').scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth'});}));
$$('[data-choose-system]').forEach(b=>b.addEventListener('click',()=>{state.material=b.dataset.chooseSystem;state.system=state.material==='ceramic'?'ceramicSelf':'metalLig';if(state.step===4)renderResult();$('#calculator').scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth'});}));

const dialog=$('#booking-dialog');
function openBooking(context){$('#booking-context').textContent=context+'. Консультация — 800 ₽.';$('#booking-form .form-status').textContent='';dialog.showModal();document.body.classList.add('dialog-open');}
$$('[data-book]').forEach(b=>b.addEventListener('click',()=>openBooking(b.dataset.book)));
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
$$('input[type=tel]').forEach(input=>{input.addEventListener('input',()=>input.setCustomValidity(''));input.addEventListener('blur',()=>{if(input.value.trim()){const d=input.value.replace(/\D/g,'');input.setCustomValidity(/^[78]\d{10}$/.test(d)?'':'Введите российский номер: +7 и ещё 10 цифр');}});});
for(const id of ['contact-form','booking-form']){
  const form=$('#'+id);form.addEventListener('submit',event=>{
    event.preventDefault();const input=form.elements.phone;const digits=input.value.replace(/\D/g,'');
    if(!/^[78]\d{10}$/.test(digits)){input.setCustomValidity('Введите российский номер: +7 и ещё 10 цифр');input.reportValidity();return;}
    if(!form.reportValidity())return;
    form.querySelector('.form-status').innerHTML='Форма заполнена, но заявка <strong>не отправлена</strong>: доставка пока не подключена. Для записи <a href="https://w1860597.yclients.com" target="_blank" rel="noopener">откройте онлайн-запись клиники</a> или позвоните <a href="tel:+79218646699">+7 (921) 864-66-99</a>.';
  });
}
function showToast(text){const toast=$('#toast');toast.textContent=text;toast.classList.add('visible');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('visible'),4000);}

/* A deterministic illustration. It is deliberately not presented as a patient case. */
function dentalSVG(material='metal',progress=1,braces=true){
  const positions=[-138,-104,-67,-23,23,67,104,138];
  const teeth=positions.map((x,i)=>{
    const edge=Math.abs(i-3.5)/3.5;const y=14+edge*edge*30;
    const w=edge>.7?32:edge>.3?37:42;
    const shift=[-8,11,-13,7,-7,12,-9,8][i]*(1-progress);
    const rotation=[-18,15,-13,10,-12,17,-16,19][i]*(1-progress);
    const bracket=material==='ceramic'?'#e9e6d7':'url(#metalGrad)';
    return`<g class="tooth-group" transform="translate(${x+shift},${y}) rotate(${rotation})"><path d="M${-w/2} -28 Q0 -39 ${w/2} -28 L${w/2-1} 19 Q${w/2-2} 35 0 36 Q${-w/2+2} 35 ${-w/2+1} 19Z" fill="url(#enamelGrad)" stroke="#d4d4bd" stroke-width=".8"/>${braces?`<rect x="-10" y="-2" width="20" height="17" rx="4" fill="${bracket}" stroke="${material==='ceramic'?'#cacbbd':'#89918e'}" stroke-width="1"/><path d="M-8 3h16M-8 10h16M-4 -1v15M4 -1v15" stroke="${material==='ceramic'?'#d5d5c7':'#f6f8f4'}" stroke-width="1.8"/>`:''}</g>`;
  }).join('');
  return`<svg viewBox="0 0 420 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="enamelGrad" x1="0" y1="0" x2="0.3" y2="1"><stop stop-color="#fffef4"/><stop offset=".65" stop-color="#f1efdc"/><stop offset="1" stop-color="#dedfc9"/></linearGradient><linearGradient id="metalGrad"><stop stop-color="#f8faf7"/><stop offset=".5" stop-color="#85928d"/><stop offset="1" stop-color="#e6ece5"/></linearGradient><filter id="toothShadow" x="-30%" y="-50%" width="160%" height="210%"><feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#6c8869" flood-opacity=".14"/></filter></defs><ellipse cx="210" cy="173" rx="145" ry="10" fill="#7e967b" opacity=".1"/><g transform="translate(210,91)" filter="url(#toothShadow)"><path d="M-158 27 Q-170 -36 -132 -40 Q0 -85 132 -40 Q170 -36 158 27 Q0 -20 -158 27" fill="#dfb9a7" opacity=".72"/>${teeth}${braces?'<path d="M-153 49Q0 -5 153 49" fill="none" stroke="#8c9690" stroke-width="2"/>':''}</g></svg>`;
}
$$('[data-teeth]').forEach(el=>el.innerHTML=dentalSVG(el.dataset.teeth,1,true));
function setAlignment(value){
  const p=Math.min(100,Math.max(0,Number(value)||0));
  $('#alignment-range').value=String(p);
  $('#alignment-percent').textContent=p+'%';
  const model=$('#alignment-model');
  model.style.setProperty('--alignment',p+'%');
  model.style.setProperty('--divider-position',p+'%');
  model.innerHTML=dentalSVG('metal',p/100,false)+'<span class="comparison-divider" aria-hidden="true"></span>';
}
function updateAlignment(){setAlignment($('#alignment-range').value);}
$('#alignment-range').addEventListener('input',updateAlignment);updateAlignment();renderQuiz();
const comparison=$('#alignment-model');
let comparisonPointer=null;
function moveComparison(event){
  const rect=comparison.getBoundingClientRect();
  if(!rect.width)return;
  const percent=Math.round(Math.min(100,Math.max(0,(event.clientX-rect.left)/rect.width*100)));
  setAlignment(percent);
}
comparison.addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse'&&event.button!==0)return;
  event.preventDefault();comparisonPointer=event.pointerId;
  comparison.setPointerCapture(event.pointerId);comparison.classList.add('dragging');moveComparison(event);
});
comparison.addEventListener('pointermove',event=>{if(comparisonPointer===event.pointerId)moveComparison(event);});
function releaseComparison(event){if(comparisonPointer===event.pointerId){comparisonPointer=null;comparison.classList.remove('dragging');if(comparison.hasPointerCapture(event.pointerId))comparison.releasePointerCapture(event.pointerId);}}
comparison.addEventListener('pointerup',releaseComparison);
comparison.addEventListener('pointercancel',releaseComparison);
comparison.addEventListener('lostpointercapture',()=>{comparisonPointer=null;comparison.classList.remove('dragging');});
