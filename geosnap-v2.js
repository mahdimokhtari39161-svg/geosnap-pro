(function(){
'use strict';
var KEY='geosnap_pro_v2_workspace';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{"projects":[],"logs":[]}')}catch(e){return {projects:[],logs:[]}}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var css='.v2launch{margin:16px 0;background:linear-gradient(135deg,#102b35,#20535a);color:white;border-radius:18px;padding:17px}.v2launch p{color:#d0e0e0;font-size:12px;line-height:1.8}.v2launch button,.v2btn{background:#159b75;color:white;border:0;border-radius:11px;padding:12px;width:100%;font-weight:bold}.v2shell{display:none;position:fixed;inset:0;z-index:90;background:#f2f5f6;overflow:auto}.v2shell.open{display:block}.v2head{position:sticky;top:0;background:#102b35;color:white;padding:16px;display:flex;justify-content:space-between}.v2head button{background:#ffffff22;color:white;border:0;border-radius:9px;padding:8px}.v2body{max-width:680px;margin:auto;padding:15px}.v2tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v2tab{padding:12px;border:1px solid #dfe8e9;background:white;border-radius:12px;text-align:right}.v2tab.active{background:#dff5ed;border-color:#159b75}.v2panel{background:white;border:1px solid #e2e9eb;border-radius:15px;padding:14px;margin:12px 0}.v2panel h3{font-size:15px;margin:0 0 12px}.v2field{margin:10px 0}.v2field label{display:block;font-size:12px;font-weight:bold;margin-bottom:6px}.v2field input,.v2field textarea,.v2field select{width:100%;box-sizing:border-box;padding:11px;border:1px solid #dfe8e9;border-radius:10px;font:inherit;background:#fbfdfd}.v2field textarea{min-height:70px}.v2row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v2item{padding:11px;border:1px solid #e5ecee;border-radius:11px;margin:8px 0;font-size:13px}.v2item small{display:block;color:#71828a;line-height:1.8;margin-top:5px}.v2hint{font-size:12px;color:#71828a;line-height:1.9}.v2preview{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v2preview img{width:100%;height:140px;object-fit:cover;background:#eee;border-radius:9px}@media print{body>*:not(#geosnapV2){display:none!important}#geosnapV2{display:block!important;position:static;background:white}.v2head,.v2tabs,.v2btn{display:none!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var launch=document.createElement('section');launch.className='v2launch';launch.innerHTML='<h3>GeoSnap Pro · نسخه ۲.۰</h3><p>تمام امکانات نسخه ۲.۰ برای همه کاربران رایگان است؛ فضای کاری عمومی، مهندسی، املاک و نقشه‌برداری با ذخیره‌سازی محلی و امکانات آفلاین. هزینه توسعه از تبلیغات غیرمزاحم تپسل تأمین می‌شود.</p><button type="button">ورود به فضای کاری حرفه‌ای ←</button>';
var grid=document.querySelector('#home .grid');if(grid)grid.insertAdjacentElement('afterend',launch);
var shell=document.createElement('div');shell.id='geosnapV2';shell.className='v2shell';shell.innerHTML='<div class="v2head"><b>GeoSnap Pro 2.0 · فضای کاری</b><button type="button" id="v2close">بستن ✕</button></div><div class="v2body"><p class="v2hint">اطلاعات این بخش روی همین دستگاه ذخیره می‌شود. ثبت عکس و GPS اصلی برنامه بدون تغییر باقی مانده است.</p><div class="v2tabs"><button class="v2tab active" data-tab="general">📷 عمومی</button><button class="v2tab" data-tab="engineering">🏗️ پروژه و مهندسی</button><button class="v2tab" data-tab="property">🏠 املاک</button><button class="v2tab" data-tab="survey">🧭 نقشه‌برداری</button><button class="v2tab" data-tab="compare">↔️ قبل و بعد</button><button class="v2tab" data-tab="reports">📄 گزارش‌ها</button></div><div id="v2content"></div></div>';document.body.appendChild(shell);
var content=shell.querySelector('#v2content'),tab='general';launch.querySelector('button').onclick=function(){shell.classList.add('open');render()};shell.querySelector('#v2close').onclick=function(){shell.classList.remove('open')};
shell.querySelectorAll('[data-tab]').forEach(function(b){b.onclick=function(){tab=b.getAttribute('data-tab');render()}});
function item(x){return '<div class="v2item"><b>'+esc(x.title||x.name)+'</b><small>'+esc(x.type||'')+' · '+esc(x.date||'')+'<br>'+esc(x.notes||x.details||'')+(x.status?'<br>وضعیت: '+esc(x.status):'')+(x.lat!=null?'<br>مختصات: '+esc(x.lat)+', '+esc(x.lon)+' · دقت: '+esc(x.accuracy||'نامشخص')+' متر':'')+'</small></div>'}
function log(x){var d=load();x.date=new Date().toLocaleString('fa-IR');d.logs.push(x);save(d);render()}
function field(id,label,placeholder,type){return '<div class="v2field"><label>'+label+'</label><input id="'+id+'" type="'+(type||'text')+'" placeholder="'+(placeholder||'')+'"></div>'}
function area(id,label,placeholder){return '<div class="v2field"><label>'+label+'</label><textarea id="'+id+'" placeholder="'+(placeholder||'')+'"></textarea></div>'}
function button(id,label){return '<button class="v2btn" id="'+id+'">'+label+'</button>'}
function render(){var d=load();shell.querySelectorAll('[data-tab]').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-tab')===tab)});var h='';
if(tab==='general'){h='<div class="v2panel"><h3>یادداشت عمومی</h3>'+field('qtitle','عنوان یادداشت','مثلاً بازدید از محل')+area('qnote','توضیحات','یادداشت خود را بنویسید')+button('qsave','ذخیره یادداشت')+'</div><div class="v2panel"><h3>یادداشت‌های اخیر</h3>'+d.logs.filter(function(x){return x.type==='یادداشت عمومی'}).slice().reverse().map(item).join('')+'</div><p class="v2hint">برای ثبت عکس همراه GPS از گزینه «ثبت عکس جدید» در صفحه اصلی استفاده کنید.</p>';}
if(tab==='engineering'){h='<div class="v2panel"><h3>ایجاد پروژه</h3>'+field('pname','نام پروژه','نام کارگاه یا پروژه')+'<div class="v2row">'+field('pclient','کارفرما','نام مشتری')+field('pcode','شماره پروژه','اختیاری')+'</div>'+field('pplace','محل پروژه','نشانی یا منطقه')+area('pdesc','شرح پروژه','توضیحات')+button('psave','ایجاد پروژه')+'</div><div class="v2panel"><h3>ثبت گزارش بازدید</h3><div class="v2field"><label>پروژه</label><select id="logproject"><option value="">بدون پروژه</option>'+d.projects.map(function(p){return '<option>'+esc(p.name)+'</option>'}).join('')+'</select></div>'+field('vtitle','عنوان بازدید','مثلاً کنترل اجرای سازه')+'<div class="v2field"><label>وضعیت</label><select id="vstatus"><option>در حال بررسی</option><option>تأیید شد</option><option>نیازمند اصلاح</option></select></div>'+area('vnotes','شرح مشاهدات و اقدامات','شرح بازدید')+button('vsave','ثبت گزارش')+'</div><div class="v2panel"><h3>پروژه‌ها</h3>'+d.projects.map(item).join('')+'</div><div class="v2panel"><h3>گزارش‌های بازدید</h3>'+d.logs.filter(function(x){return x.type==='گزارش بازدید'}).slice().reverse().map(item).join('')+'</div>';}
if(tab==='property'){h='<div class="v2panel"><h3>پرونده ملک</h3>'+field('rtitle','عنوان ملک','زمین، آپارتمان یا واحد تجاری')+'<div class="v2row"><div class="v2field"><label>نوع ملک</label><select id="rtype"><option>زمین</option><option>مسکونی</option><option>تجاری</option><option>اداری</option><option>باغ و کشاورزی</option><option>سایر</option></select></div>'+field('rarea','مساحت مترمربع','اختیاری','number')+'</div>'+field('raddress','نشانی','نشانی یا منطقه')+area('rnotes','مشخصات و توضیحات','توضیحات ملک')+button('rsave','ذخیره پرونده ملک')+'</div><div class="v2panel"><h3>پرونده‌های ذخیره‌شده</h3>'+d.logs.filter(function(x){return x.type==='پرونده ملک'}).slice().reverse().map(item).join('')+'</div>';}
if(tab==='survey'){h='<div class="v2panel"><h3>ثبت نقطه نقشه‌برداری</h3><p class="v2hint">مختصات را دستی وارد کنید یا از GPS دستگاه دریافت کنید.</p>'+field('sname','نام نقطه','مثلاً نقطه کنترل A1')+'<div class="v2row">'+field('slat','عرض جغرافیایی','Latitude')+field('slon','طول جغرافیایی','Longitude')+'</div><div class="v2row">'+field('salt','ارتفاع متر','اختیاری','number')+field('sacc','دقت GPS متر','اختیاری','number')+'</div><button class="v2btn" id="locate">دریافت مختصات از GPS گوشی</button>'+button('ssave','ذخیره نقطه')+'</div><div class="v2panel"><h3>نقاط ذخیره‌شده</h3>'+d.logs.filter(function(x){return x.type==='نقطه نقشه‌برداری'}).slice().reverse().map(item).join('')+'</div>';}
if(tab==='compare'){h='<div class="v2panel"><h3>مقایسه قبل و بعد</h3><p class="v2hint">دو تصویر را انتخاب کنید؛ سپس برگه مقایسه را برای چاپ یا ذخیره PDF آماده کنید.</p><div class="v2row">'+field('before','تصویر قبل','','file')+field('after','تصویر بعد','','file')+'</div><div class="v2preview"><img id="bprev"><img id="aprev"></div>'+area('cnotes','شرح تغییرات','توضیح مقایسه')+button('cprint','چاپ / ذخیره PDF')+'</div>';}
if(tab==='reports'){h='<div class="v2panel"><h3>گزارش حرفه‌ای</h3>'+field('reporttitle','عنوان گزارش','گزارش فعالیت GeoSnap Pro')+button('rprint','تهیه گزارش و چاپ / PDF')+'</div><div class="v2panel"><h3>خلاصه فضای کاری</h3><p>پروژه‌ها: '+d.projects.length+' · گزارش‌ها و یادداشت‌ها: '+d.logs.length+'</p>'+button('backup','دریافت پشتیبان فضای کاری')+'</div>';}
content.innerHTML=h;bind();}
function bind(){var $=function(id){return document.getElementById(id)},val=function(id){return $(id).value};
if($('qsave'))$('qsave').onclick=function(){if(!val('qtitle').trim())return alert('عنوان را وارد کنید.');log({type:'یادداشت عمومی',title:val('qtitle'),notes:val('qnote')})};
if($('psave'))$('psave').onclick=function(){if(!val('pname').trim())return alert('نام پروژه را وارد کنید.');var d=load();d.projects.push({type:'پروژه',name:val('pname'),title:val('pname'),client:val('pclient'),code:val('pcode'),place:val('pplace'),notes:val('pdesc'),date:new Date().toLocaleDateString('fa-IR')});save(d);render()};
if($('vsave'))$('vsave').onclick=function(){if(!val('vtitle').trim())return alert('عنوان بازدید را وارد کنید.');log({type:'گزارش بازدید',title:val('vtitle'),project:val('logproject'),status:val('vstatus'),notes:val('vnotes')})};
if($('rsave'))$('rsave').onclick=function(){if(!val('rtitle').trim())return alert('عنوان ملک را وارد کنید.');log({type:'پرونده ملک',title:val('rtitle'),details:'نوع: '+val('rtype')+' · مساحت: '+(val('rarea')||'ثبت نشده')+' مترمربع · '+val('raddress'),notes:val('rnotes')})};
if($('locate'))$('locate').onclick=function(){if(!navigator.geolocation)return alert('GPS پشتیبانی نمی‌شود.');navigator.geolocation.getCurrentPosition(function(p){$('slat').value=p.coords.latitude.toFixed(7);$('slon').value=p.coords.longitude.toFixed(7);$('salt').value=p.coords.altitude==null?'':p.coords.altitude;$('sacc').value=Math.round(p.coords.accuracy)},function(e){alert('دریافت موقعیت ناموفق بود: '+e.message)},{enableHighAccuracy:true,timeout:20000,maximumAge:0})};
if($('ssave'))$('ssave').onclick=function(){var lat=Number(val('slat')),lon=Number(val('slon'));if(!val('sname').trim()||!val('slat')||!val('slon')||!isFinite(lat)||!isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return alert('نام و مختصات معتبر را وارد کنید.');log({type:'نقطه نقشه‌برداری',title:val('sname'),lat:lat,lon:lon,accuracy:val('sacc'),notes:'ارتفاع: '+val('salt')+' متر'})};
['before','after'].forEach(function(id){if($(id))$(id).onchange=function(e){var f=e.target.files[0];if(f){var u=URL.createObjectURL(f);$(id==='before'?'bprev':'aprev').src=u}}});
if($('cprint'))$('cprint').onclick=function(){if(!$('bprev').src||!$('aprev').src)return alert('هر دو تصویر را انتخاب کنید.');printPage('مقایسه قبل و بعد','<p>'+esc(val('cnotes'))+'</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><h3>قبل</h3><img src="'+$('bprev').src+'" style="width:100%"></div><div><h3>بعد</h3><img src="'+$('aprev').src+'" style="width:100%"></div></div>')};
if($('rprint'))$('rprint').onclick=function(){var d=load(),body=d.projects.map(function(p){return '<article><h3>پروژه: '+esc(p.name)+'</h3><p>کارفرما: '+esc(p.client)+' · محل: '+esc(p.place)+'</p><p>'+esc(p.notes)+'</p></article>'}).join('')+d.logs.map(function(x){return '<article><h3>'+esc(x.title)+' — '+esc(x.type)+'</h3><p>'+esc(x.date)+' · '+esc(x.status||'')+'</p><p>'+esc(x.notes||x.details||'')+'</p></article>'}).join('');printPage(val('reporttitle')||'گزارش GeoSnap Pro',body||'<p>اطلاعاتی ثبت نشده است.</p>')};
if($('backup'))$('backup').onclick=function(){var blob=new Blob([JSON.stringify({app:'GeoSnap Pro',version:2,workspace:load()},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='GeoSnap-Pro-Workspace-Backup.json';a.click();URL.revokeObjectURL(url)};
}
function printPage(title,body){var w=window.open('','_blank');if(!w)return alert('اجازه باز شدن پنجره چاپ را فعال کنید.');w.document.write('<!doctype html><html lang="fa" dir="rtl"><meta charset="utf-8"><title>'+esc(title)+'</title><style>body{font-family:Tahoma,Arial;padding:25px;line-height:2;color:#20343b}article{border:1px solid #ddd;border-radius:10px;padding:12px;margin:12px 0}img{max-height:420px;object-fit:contain}</style><h1>'+esc(title)+'</h1><p>GeoSnap Pro · '+new Date().toLocaleString('fa-IR')+'</p>'+body+'</html>');w.document.close();w.onload=function(){w.print()}}
render();

/* GeoSnap Pro 2.0 premium workspace enhancements */
var v2$ = function(id){return document.getElementById(id)};
var premiumCss = document.createElement('style');
premiumCss.textContent = `
:root{--lux-ink:#0b1e29;--lux-teal:#087f70;--lux-gold:#c5a46d}
body{background:#f4f6f7;color:#142b35}
.app{max-width:760px}
header{background:radial-gradient(ellipse at 90% 0%,#245b59 0%,transparent 48%),linear-gradient(135deg,#091c28 0%,#153c46 58%,#0b665d 100%);border-radius:0 0 30px 30px;padding:27px 22px 30px;box-shadow:0 16px 36px #0b26351c}
.logo{background:linear-gradient(145deg,#d1b37d,#8d7048);color:#102b35;box-shadow:0 5px 18px #0003}
header h1{letter-spacing:.2px;font-size:21px}
.status{backdrop-filter:blur(10px);background:#ffffff12;border-color:#ffffff28}
main{padding:21px}
.action,.panel,.photo-card,.v2panel{box-shadow:0 7px 24px #122c3709;transition:transform .18s ease,box-shadow .18s ease}
.action{border-radius:20px;min-height:125px}
.action:active,.v2tab:active{transform:scale(.985)}
.primary,.btn-green{background:linear-gradient(135deg,#087f70,#159b75)}
.secondary{border-color:#e3e9e9}
.section-title{letter-spacing:-.2px}
nav{max-width:760px;box-shadow:0 -8px 25px #102b350b;padding-top:12px}
nav button.active{color:#087f70}
.panel,.modal-card{border-radius:19px}
.v2shell{background:#f3f6f6}
.v2head{background:linear-gradient(120deg,#091c28,#174c50);padding:19px;box-shadow:0 6px 20px #0b263522}
.v2body{max-width:760px;padding:18px}
.v2tab{border-radius:14px;padding:14px;border-color:#e4e9e8;font-weight:600;color:#1c3941}
.v2tab.active{background:linear-gradient(135deg,#e2f3ed,#f5f8f5);border-color:#6eb7a0;color:#075d50}
.v2panel{border-radius:18px;border-color:#e5ebea;padding:17px}
.v2panel h3{color:#173943}
.v2btn{background:linear-gradient(120deg,#087f70,#159b75);border-radius:12px;padding:14px}
.v2field input,.v2field textarea,.v2field select{border-radius:11px;border-color:#e2e9e8}
.v2launch{border:1px solid #c3a879;background:radial-gradient(ellipse at 95% 0%,#35665e,transparent 55%),linear-gradient(125deg,#091c28,#17434a);border-radius:21px;padding:20px;box-shadow:0 13px 30px #0c2d3924}
.v2launch h3{font-size:17px;letter-spacing:.2px}
.v2launch button{background:linear-gradient(120deg,#c9ae7e,#a88b5b);color:#102b35;padding:14px;border-radius:12px}
.v2premium-tools{margin-top:14px}
.v2premium-tools .v2btn.secondary{background:#eef4f2;color:#17423e}
.v2canvas{width:100%;max-height:420px;object-fit:contain;background:#e9eeee;border-radius:13px;margin-top:12px}
.v2check{display:flex;gap:9px;align-items:flex-start;padding:11px;border:1px solid #e7eceb;border-radius:11px;margin:7px 0;font-size:13px}
.v2check input{margin-top:3px;accent-color:#087f70}
.v2gold{color:#c5a46d}
@media(min-width:700px){.grid{grid-template-columns:repeat(4,1fr)}}
`;
document.head.appendChild(premiumCss);
var v2body=shell.querySelector('.v2body');
var toolsPanel=document.createElement('div');
toolsPanel.className='v2panel v2premium-tools';
toolsPanel.innerHTML='<h3>ابزارهای حرفه‌ای</h3><p class="v2hint">ابزارهای کاربردی نسخه ۲.۰؛ رایگان و قابل استفاده روی همین دستگاه</p><div class="v2row"><button class="v2btn" type="button" id="v2stampOpen">✦ مهر اختصاصی روی عکس</button><button class="v2btn" type="button" id="v2inspectionOpen">✓ چک‌لیست بازرسی</button></div>';
v2body.appendChild(toolsPanel);
var stamp=document.createElement('section');
stamp.className='v2panel hidden';
stamp.id='v2stamp';
stamp.innerHTML='<h3>مهر حرفه‌ای تصویر</h3><p class="v2hint">تصویر را انتخاب کنید و اطلاعات مکانی، تاریخ، نام پروژه و توضیحات را روی آن درج کنید. پردازش تصویر در خود دستگاه انجام می‌شود.</p><div class="v2field"><label>انتخاب تصویر</label><input id="v2stampFile" type="file" accept="image/*"></div><div class="v2row"><div class="v2field"><label>نام پروژه / شرکت</label><input id="v2stampProject" placeholder="Project / Company"></div><div class="v2field"><label>عنوان محل</label><input id="v2stampTitle" placeholder="Site inspection"></div></div><div class="v2row"><div class="v2field"><label>عرض جغرافیایی</label><input id="v2stampLat" placeholder="Latitude"></div><div class="v2field"><label>طول جغرافیایی</label><input id="v2stampLon" placeholder="Longitude"></div></div><div class="v2field"><label>توضیحات</label><input id="v2stampNote" placeholder="Notes (optional)"></div><button class="v2btn" id="v2stampGps" type="button">دریافت مختصات فعلی GPS</button><canvas id="v2stampCanvas" class="v2canvas"></canvas><button class="v2btn" id="v2stampDownload" type="button" disabled>ذخیره تصویر مهرخورده</button>';
v2body.appendChild(stamp);
var inspect=document.createElement('section');
inspect.className='v2panel hidden';
inspect.id='v2inspection';
inspect.innerHTML='<h3>فرم بازرسی و بازدید</h3><p class="v2hint">موارد را علامت بزنید و نتیجه بازدید را به‌صورت آفلاین ذخیره کنید.</p><div class="v2field"><label>عنوان بازدید</label><input id="v2inspectTitle" placeholder="مثلاً بازدید مرحله اجرای پروژه"></div><div class="v2field"><label>نام پروژه / محل</label><input id="v2inspectProject" placeholder="Project name"></div><div id="v2inspectChecks"></div><div class="v2field"><label>شرح نواقص و اقدامات اصلاحی</label><textarea id="v2inspectNotes" placeholder="شرح مشاهدات، نواقص و اقدامات لازم"></textarea></div><button class="v2btn" id="v2inspectSave" type="button">ذخیره گزارش بازرسی</button><div id="v2inspectHistory"></div>';
v2body.appendChild(inspect);
var checks=['وضعیت عمومی محل بررسی شد','ایمنی و دسترسی بررسی شد','ابعاد و اندازه‌ها کنترل شد','کیفیت اجرا بررسی شد','مستندات تصویری ثبت شد','موارد نیازمند اصلاح مشخص شد'];
v2$('v2inspectChecks').innerHTML=checks.map(function(x,i){return '<label class="v2check"><input type="checkbox" value="'+i+'"><span>'+x+'</span></label>'}).join('');
v2$('v2stampOpen').onclick=function(){stamp.classList.toggle('hidden');inspect.classList.add('hidden');stamp.scrollIntoView({behavior:'smooth',block:'start'})};
v2$('v2inspectionOpen').onclick=function(){inspect.classList.toggle('hidden');stamp.classList.add('hidden');renderInspectionHistory();inspect.scrollIntoView({behavior:'smooth',block:'start'})};
var stampImage=null,stampUrl=null;
v2$('v2stampFile').onchange=function(e){var file=e.target.files&&e.target.files[0];if(!file)return;if(!file.type.startsWith('image/')){alert('لطفاً یک تصویر معتبر انتخاب کنید.');return}if(stampUrl)URL.revokeObjectURL(stampUrl);stampUrl=URL.createObjectURL(file);stampImage=new Image();stampImage.onload=drawStamp;stampImage.onerror=function(){alert('خواندن تصویر ممکن نشد.')};stampImage.src=stampUrl};
['v2stampProject','v2stampTitle','v2stampLat','v2stampLon','v2stampNote'].forEach(function(id){v2$(id).addEventListener('input',function(){if(stampImage)drawStamp()})});
function drawStamp(){var c=v2$('v2stampCanvas'),ctx=c.getContext('2d');var max=2200,scale=Math.min(1,max/stampImage.width,max/stampImage.height);c.width=Math.round(stampImage.width*scale);c.height=Math.round(stampImage.height*scale);ctx.drawImage(stampImage,0,0,c.width,c.height);var h=Math.max(116,c.height*.17),y=c.height-h;ctx.fillStyle='rgba(7,25,34,.82)';ctx.fillRect(0,y,c.width,h);ctx.fillStyle='#d1b47d';ctx.fillRect(0,y,Math.max(5,c.width*.008),h);var pad=Math.max(18,c.width*.025),line=Math.max(18,c.width*.027);ctx.textAlign='left';ctx.direction='ltr';ctx.fillStyle='#ffffff';ctx.font='bold '+line+'px Arial';var title=v2$('v2stampTitle').value||'GEOSNAP PRO · FIELD RECORD';ctx.fillText(title,pad,y+line*1.55);ctx.fillStyle='#d9e8e5';ctx.font=Math.max(13,line*.68)+'px Arial';var project=v2$('v2stampProject').value;var coords=v2$('v2stampLat').value&&v2$('v2stampLon').value?('GPS  '+v2$('v2stampLat').value+', '+v2$('v2stampLon').value):'GPS coordinates not provided';ctx.fillText((project?'PROJECT  '+project+'   ·   ':'')+coords,pad,y+line*2.75);var note=v2$('v2stampNote').value;var date=new Date().toLocaleString();ctx.fillText((note?note+'   ·   ':'')+date,pad,y+line*3.8);ctx.fillStyle='#d1b47d';ctx.font='bold '+Math.max(12,line*.62)+'px Arial';ctx.textAlign='right';ctx.fillText('GEOSNAP PRO',c.width-pad,c.height-line*.55);v2$('v2stampDownload').disabled=false}
v2$('v2stampGps').onclick=function(){if(!navigator.geolocation)return alert('GPS در دسترس نیست.');navigator.geolocation.getCurrentPosition(function(p){v2$('v2stampLat').value=p.coords.latitude.toFixed(7);v2$('v2stampLon').value=p.coords.longitude.toFixed(7);if(stampImage)drawStamp()},function(e){alert('دریافت GPS انجام نشد: '+e.message)},{enableHighAccuracy:true,timeout:20000,maximumAge:0})};
v2$('v2stampDownload').onclick=function(){if(!stampImage)return;var c=v2$('v2stampCanvas');c.toBlob(function(blob){if(!blob)return alert('ساخت تصویر ناموفق بود.');var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='GeoSnap-Pro-Stamped-'+new Date().toISOString().slice(0,10)+'.jpg';a.click();setTimeout(function(){URL.revokeObjectURL(u)},1500)},'image/jpeg',.94)};
function renderInspectionHistory(){var d=load(),items=d.logs.filter(function(x){return x.type==='فرم بازرسی'}).slice().reverse().slice(0,8);v2$('v2inspectHistory').innerHTML='<h3 style="margin-top:18px">بازرسی‌های اخیر</h3>'+(items.length?items.map(item).join(''):'<p class="v2hint">هنوز گزارشی ثبت نشده است.</p>')}
v2$('v2inspectSave').onclick=function(){var title=v2$('v2inspectTitle').value.trim();if(!title)return alert('عنوان بازدید را وارد کنید.');var selected=Array.from(v2$('v2inspectChecks').querySelectorAll('input:checked')).map(function(x){return checks[Number(x.value)]});log({type:'فرم بازرسی',title:title,name:title,project:v2$('v2inspectProject').value,notes:v2$('v2inspectNotes').value,details:'موارد کنترل‌شده: '+selected.length+' از '+checks.length+'\n'+selected.join('، '),status:selected.length===checks.length?'همه موارد کنترل شد':'بازرسی ناقص / نیازمند پیگیری'});v2$('v2inspectTitle').value='';v2$('v2inspectProject').value='';v2$('v2inspectNotes').value='';v2$('v2inspectChecks').querySelectorAll('input').forEach(function(x){x.checked=false});renderInspectionHistory()};


/* Warm, joyful international visual theme */
var warmTheme=document.createElement('style');
warmTheme.textContent=`
:root{--warm-cream:#fff8ef;--warm-peach:#ffe2cf;--warm-coral:#ef805f;--warm-orange:#f29a48;--warm-yellow:#ffd36e;--warm-teal:#4f9b8b;--warm-ink:#49352e;--warm-muted:#8c7468}
body{background:#fff8f1!important;color:#493b35}
header{background:radial-gradient(circle at 85% 8%,#ffd98a 0%,transparent 26%),radial-gradient(circle at 5% 100%,#f5a28a 0%,transparent 36%),linear-gradient(125deg,#e97758 0%,#f29b61 48%,#f4bd68 100%)!important;color:#fffdf8}
header .logo{background:linear-gradient(145deg,#fff0c9,#ffd36e)!important;color:#a64f38!important;box-shadow:0 7px 18px #9c4d3228}
header .status{background:#fff7e82b!important;border:1px solid #fff9e65c!important}
header .status strong{color:#fff8e9!important}
main{background:transparent}
.section-title{color:#67483c}
.action{background:linear-gradient(145deg,#fffefa,#fff0e4)!important;border:1px solid #f5d8c7!important;color:#65473b!important;box-shadow:0 8px 22px #b86b3b12!important}
.action.primary,.primary,.btn-green{background:linear-gradient(120deg,#e9785b,#f39a57)!important;color:#fff!important}
.action.secondary{background:linear-gradient(145deg,#fffdf8,#fff3d9)!important}
.action .emoji{filter:saturate(1.15)}
.notice{background:#fff0d7!important;border:1px solid #f5d9a6!important;color:#795637!important}
nav{background:#fffaf4!important;border-top:1px solid #f3dfd1!important}
nav button{color:#98796b!important}
nav button.active{color:#e87556!important}
.photo-card,.panel,.modal-card{background:#fffdf9!important;border-color:#f2dfd2!important;box-shadow:0 9px 24px #a65e3d12!important}
.photo-info strong,.page-head h2{color:#594037}
.btn-dark{background:#725347!important}
.btn-light{background:#fff0d9!important;color:#725347!important}
.btn-danger{background:#fff0ed!important;color:#cf604c!important}
.gps-overlay{background:linear-gradient(135deg,#5c9b8b,#397a70)!important}
.v2shell{background:linear-gradient(180deg,#fff8ef,#fff1e5)!important;color:#493b35}
.v2head{background:linear-gradient(110deg,#e97758,#f29a57 65%,#f3bd68)!important;color:#fffdf8}
.v2head button{background:#fff5e833!important;border:1px solid #fff8e866!important}
.v2body{padding-bottom:34px}
.v2hint,.v2item small{color:#90796d!important}
.v2tab{background:#fffdf9!important;border-color:#f1dccc!important;color:#765647!important}
.v2tab.active{background:linear-gradient(120deg,#ffe3d3,#fff0ca)!important;border-color:#efa17d!important;color:#b85d45!important}
.v2panel{background:#fffdfa!important;border-color:#f2dfd2!important;box-shadow:0 8px 23px #9e60400e!important}
.v2panel h3{color:#65463b!important}
.v2item{background:#fff8ef!important;border-color:#f2dfd2!important}
.v2btn,.v2launch button{background:linear-gradient(120deg,#e9785b,#f3a04f)!important;color:#fff!important;box-shadow:0 5px 13px #d77a4b22}
.v2launch{background:radial-gradient(circle at 90% 0%,#ffd77d 0%,transparent 38%),linear-gradient(125deg,#e9785b,#f2a15d 70%,#f4bd68)!important;border:1px solid #f6c28e!important;color:white!important;box-shadow:0 12px 28px #bd70402a!important}
.v2launch p{color:#fff7ed!important}
.v2field input,.v2field textarea,.v2field select{background:#fffaf5!important;border-color:#f0d9c9!important;color:#523f36!important}
.v2field input:focus,.v2field textarea:focus,.v2field select:focus{outline:2px solid #f3b28b!important;border-color:#e98263!important}
.v2check{background:#fff8f0;border-color:#f2dfd2}
.v2check input{accent-color:#e9785b}
.v2canvas{background:#fff0e3!important}
#toast{background:#68483c!important}
@media(hover:hover){.action:hover,.photo-card:hover,.v2panel:hover{transform:translateY(-2px);box-shadow:0 12px 27px #b96b4618!important}}
`;
document.head.appendChild(warmTheme);
var brandTitle=document.querySelector('header h1');
if(brandTitle)brandTitle.style.textShadow='0 2px 12px #8e472a30';

})();