const pages = ["dashboard","academy","ai","savings","budget","visa","marketplace","journey"];


function academyTab(tabId, button){
  document.querySelectorAll(".academy-panel").forEach(panel => panel.classList.remove("active"));
  document.querySelectorAll(".academy-tab").forEach(tab => tab.classList.remove("active"));
  const panel = document.getElementById(tabId);
  if(panel) panel.classList.add("active");
  if(button) button.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

function showPage(page){
  const aliases={
    dashboard:"dashboard", ai:"ai", profile:"profile", safety:"safety",
    journey:"journey", academy:"academy", packing:"packing",
    haramain:"haramain-smart-journey", gold:"gold-savings",
    takaful:"takaful", budget:"budget", visa:"visa",
    packages:"marketplace", nusuk:"nusuk-hub", money:"money", live:"live", arabic:"arabic", quran:"quran", contact:"contact"
  };
  const targetId=aliases[page]||page;
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const target=document.getElementById(targetId);
  if(target) target.classList.add("active");
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
  const titles={
    dashboard:"Dashboard",ai:"AI Assistant",profile:"Pilgrim Profile",safety:"SafeJourney",
    journey:"Journey Planner",academy:"VR Academy",ihramGuide:"Ihram Do's & Don'ts",packing:"Pilgrim Packing",
    haramain:"Haramain Smart Journey",gold:"Gold Savings",takaful:"Travel Takaful",
    budget:"Smart Budget",visa:"Visa & Route",packages:"Verified Packages",
    nusuk:"Nusuk Hub",money:"Money & Shopping",live:"Live Makkah & Madinah", arabic:"Arabic Conversation", contact:"Contact Us"
  };
  const title=document.getElementById("pageTitle");
  if(title) title.textContent=titles[page]||"Dashboard";
  document.querySelector(".sidebar")?.classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}

document.getElementById("mobileMenu").addEventListener("click",()=>{
  document.querySelector(".sidebar").classList.toggle("open");
});

function toast(message){
  const el=document.getElementById("toast");
  el.textContent=message; el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>el.classList.remove("show"),2500);
}

let goldSavingBalance=12850000;
const COIN_VALUE=500000;
function updateGoldSavings(){
  const target=Number(document.getElementById("targetInput")?.value)||18900000;
  const pct=Math.min(100,Math.round((goldSavingBalance/Math.max(target,1))*100));
  const gap=Math.max(target-goldSavingBalance,0);
  const coins=Math.floor(goldSavingBalance/COIN_VALUE);
  const remainder=goldSavingBalance%COIN_VALUE;
  const grams=(goldSavingBalance/1600000).toFixed(1);
  const bal=document.getElementById("savingBalance"); if(bal)bal.textContent=goldSavingBalance.toLocaleString("id-ID");
  const goal=document.getElementById("goalDisplay"); if(goal)goal.textContent=target.toLocaleString("id-ID");
  const perc=document.getElementById("savingPercent"); if(perc)perc.textContent=pct+"%";
  const prog=document.getElementById("goldProgress"); if(prog)prog.style.width=pct+"%";
  const gapEl=document.getElementById("savingGap"); if(gapEl)gapEl.textContent=gap.toLocaleString("id-ID");
  const weight=document.getElementById("goldWeight"); if(weight)weight.textContent=grams;
  const cc=document.getElementById("coinCount"); if(cc)cc.textContent=coins;
  const next=COIN_VALUE-remainder;
  const nextEl=document.getElementById("nextCoinText"); if(nextEl)nextEl.textContent=remainder===0?"Next coin unlocked!":`Rp ${next.toLocaleString("id-ID")} to next coin`;
  const msg=document.getElementById("coinMessage");
  if(msg){
    if(pct>=100) msg.textContent="🎉 Goal reached! Your pilgrimage fund is fully covered in this prototype.";
    else if(coins>=30) msg.textContent="🌟 Excellent progress! Your gold vault is getting stronger.";
    else if(coins>=20) msg.textContent="✨ Great! Keep adding coins to move closer to your pilgrimage.";
    else msg.textContent="🪙 You are building your pilgrimage fund one coin at a time.";
  }
  renderGoldCoins(coins);
  document.querySelectorAll(".milestone").forEach(m=>m.classList.remove("reached"));
  [1000000,5000000,10000000].forEach(v=>{if(goldSavingBalance>=v){const ms=[...document.querySelectorAll(".milestone")].find(x=>x.querySelector("b")?.textContent.includes(v.toLocaleString("id-ID")));if(ms)ms.classList.add("reached");}});
  const m15=document.getElementById("milestone15");if(m15)m15.classList.toggle("reached",goldSavingBalance>=15000000);
  const mg=document.getElementById("milestoneGoal");if(mg)mg.classList.toggle("reached",goldSavingBalance>=target);
}
function renderGoldCoins(count){
  const vault=document.getElementById("coinVault"); if(!vault)return;
  const visible=Math.min(count,48);
  vault.innerHTML=Array.from({length:visible},(_,i)=>`<div class="gold-coin" style="animation-delay:${Math.min(i*.018,.4)}s" title="Gold savings coin ${i+1}"></div>`).join("");
  if(count>48) vault.innerHTML+=`<div class="gold-coin partial" title="${count-48} more coins">+${count-48}</div>`;
}
function addGoldSaving(){
  const amount=Math.max(0,Number(document.getElementById("addSavingInput")?.value)||0);
  if(!amount){toast("Enter a saving amount first");return;}
  goldSavingBalance+=amount;
  updateGoldSavings();
  const newCoins=Math.floor(goldSavingBalance/COIN_VALUE);
  toast(`Rp ${amount.toLocaleString("id-ID")} added — your gold vault now has ${newCoins} coins.`);
}
function calculateSavings(){
  const target=Number(document.getElementById("targetInput").value)||0;
  const monthly=Number(document.getElementById("monthlyInput").value)||1;
  const remaining=Math.max(target-goldSavingBalance,0);
  const months=Math.ceil(remaining/monthly);
  document.getElementById("calcResult").textContent=remaining===0
    ?"Congratulations — your current savings have reached the target."
    :`At Rp${monthly.toLocaleString("id-ID")}/month, you need approximately ${months} month${months===1?"":"s"} to close the remaining Rp${remaining.toLocaleString("id-ID")} gap.`;
  updateGoldSavings();
}

function calculateBudget(){
  const values=["bPackage","bFlight","bVisa","bSpend"].map(id=>Number(document.getElementById(id).value)||0);
  const total=values.reduce((a,b)=>a+b,0);
  const savings=goldSavingBalance;
  const pct=Math.min(100,Math.round((savings/total)*100));
  document.getElementById("budgetTotal").textContent=`Rp ${total.toLocaleString("id-ID")}`;
  document.getElementById("budgetProgress").style.width=`${pct}%`;
  document.getElementById("budgetStatus").textContent=`${pct}% financially covered`;
}

function selectVisa(card,name){
  document.querySelectorAll(".visa-card").forEach(c=>c.classList.remove("selected"));
  card.classList.add("selected");
  document.getElementById("visaSelected").textContent=name;
  card.querySelector("b").textContent="Selected";
  toast(`${name} selected`);
}

function filterPackages(){
  const query=(document.getElementById("packageSearch").value||"").toLowerCase();
  const type=document.getElementById("typeFilter").value;
  document.querySelectorAll(".package-card").forEach(card=>{
    const matchesText=card.dataset.search.includes(query);
    const matchesType=type==="all"||card.dataset.type===type;
    card.style.display=(matchesText&&matchesType)?"block":"none";
  });
}


const aiLanguageConfig = {
  en:{name:"English",speech:"en-US",dir:"ltr",ui:{
    language:"Language",hint:"Choose your preferred language for HARAMAIN360 AI.",translate:"↻ Translate conversation",
    online:"Personal Pilgrimage Assistant · Online",voice:"🔊 Voice ready",voiceListening:"🎙️ Listening…",
    packages:"Find packages",saving:"Savings plan",visa:"Visa route",placeholder:"Ask HARAMAIN360 AI anything…",
    send:"Send ↑",voiceNote:"Voice input and read-aloud use your browser's speech services. For the production app, connect a reviewed multilingual AI voice service.",
    title:"AI Pilgrimage Assistant",subtitle:"Your personalised digital companion for Umrah and Hajj preparation."
  }},
  ms:{name:"Bahasa Melayu",speech:"ms-MY",dir:"ltr",ui:{
    language:"Bahasa",hint:"Pilih bahasa pilihan anda untuk HARAMAIN360 AI.",translate:"↻ Terjemah perbualan",
    online:"Pembantu Perjalanan Ibadah · Dalam talian",voice:"🔊 Suara sedia",voiceListening:"🎙️ Sedang mendengar…",
    packages:"Cari pakej",saving:"Pelan simpanan",visa:"Laluan visa",placeholder:"Tanya HARAMAIN360 AI apa sahaja…",
    send:"Hantar ↑",voiceNote:"Input suara dan bacaan jawapan menggunakan perkhidmatan suara pelayar. Untuk versi sebenar, gunakan perkhidmatan AI suara pelbagai bahasa yang telah disemak.",
    title:"Pembantu Ibadah AI",subtitle:"Teman digital diperibadikan untuk persediaan Umrah dan Haji."
  }},
  ar:{name:"العربية",speech:"ar-SA",dir:"rtl",ui:{
    language:"اللغة",hint:"اختر لغتك المفضلة لمساعد HARAMAIN360 AI.",translate:"↻ ترجمة المحادثة",
    online:"مساعد الرحلة الإيمانية · متصل",voice:"🔊 الصوت جاهز",voiceListening:"🎙️ جارٍ الاستماع…",
    packages:"البحث عن الباقات",saving:"خطة الادخار",visa:"مسار التأشيرة",placeholder:"اسأل HARAMAIN360 AI أي شيء…",
    send:"إرسال ↑",voiceNote:"يستخدم الإدخال الصوتي وقراءة الإجابات خدمات الكلام في المتصفح. في النسخة الإنتاجية يُنصح بربط خدمة صوتية متعددة اللغات تمت مراجعتها.",
    title:"مساعد الحج والعمرة بالذكاء الاصطناعي",subtitle:"رفيق رقمي شخصي للاستعداد للعمرة والحج."
  }},
  id:{name:"Bahasa Indonesia",speech:"id-ID",dir:"ltr",ui:{
    language:"Bahasa",hint:"Pilih bahasa yang Anda inginkan untuk HARAMAIN360 AI.",translate:"↻ Terjemahkan percakapan",
    online:"Asisten Perjalanan Ibadah · Online",voice:"🔊 Suara siap",voiceListening:"🎙️ Mendengarkan…",
    packages:"Cari paket",saving:"Rencana tabungan",visa:"Jalur visa",placeholder:"Tanyakan apa saja kepada HARAMAIN360 AI…",
    send:"Kirim ↑",voiceNote:"Input suara dan pembacaan jawaban menggunakan layanan suara di browser. Untuk versi produksi, gunakan layanan AI suara multibahasa yang telah ditinjau.",
    title:"Asisten Ibadah AI",subtitle:"Pendamping digital pribadi untuk persiapan Umrah dan Haji."
  }},
  tr:{name:"Türkçe",speech:"tr-TR",dir:"ltr",ui:{
    language:"Dil",hint:"HARAMAIN360 AI için tercih ettiğiniz dili seçin.",translate:"↻ Konuşmayı çevir",
    online:"Kişisel Hac ve Umre Asistanı · Çevrimiçi",voice:"🔊 Ses hazır",voiceListening:"🎙️ Dinliyor…",
    packages:"Paketleri bul",saving:"Birikim planı",visa:"Vize yolu",placeholder:"HARAMAIN360 AI'a her şeyi sorun…",
    send:"Gönder ↑",voiceNote:"Sesli giriş ve yanıt okuma tarayıcınızın konuşma hizmetlerini kullanır. Üretim sürümünde incelenmiş çok dilli bir yapay zekâ ses hizmeti kullanılmalıdır.",
    title:"Yapay Zekâ Hac ve Umre Asistanı",subtitle:"Hac ve Umre hazırlığınız için kişiselleştirilmiş dijital yardımcınız."
  }},
  ur:{name:"اردو",speech:"ur-PK",dir:"rtl",ui:{
    language:"زبان",hint:"HARAMAIN360 AI کے لیے اپنی پسندیدہ زبان منتخب کریں۔",translate:"↻ گفتگو کا ترجمہ",
    online:"ذاتی زیارت معاون · آن لائن",voice:"🔊 آواز تیار ہے",voiceListening:"🎙️ سن رہا ہے…",
    packages:"پیکیجز تلاش کریں",saving:"بچت کا منصوبہ",visa:"ویزا راستہ",placeholder:"HARAMAIN360 AI سے کچھ بھی پوچھیں…",
    send:"بھیجیں ↑",voiceNote:"آواز اور جواب سنانے کے لیے براؤزر کی اسپیچ سروس استعمال ہوتی ہے۔ حتمی ورژن میں جانچی ہوئی کثیر لسانی AI وائس سروس استعمال کی جائے گی۔",
    title:"AI زیارت معاون",subtitle:"عمرہ اور حج کی تیاری کے لیے آپ کا ذاتی ڈیجیٹل معاون۔"
  }},
  zh:{name:"中文",speech:"zh-CN",dir:"ltr",ui:{
    language:"语言",hint:"选择 HARAMAIN360 AI 的首选语言。",translate:"↻ 翻译对话",
    online:"智能朝觐助手 · 在线",voice:"🔊 语音就绪",voiceListening:"🎙️ 正在聆听…",
    packages:"查找套餐",saving:"储蓄计划",visa:"签证路径",placeholder:"向 HARAMAIN360 AI 提问…",
    send:"发送 ↑",voiceNote:"语音输入和朗读使用浏览器的语音服务。正式版本建议接入经过审核的多语言 AI 语音服务。",
    title:"AI 朝觐助手",subtitle:"为您的小朝觐和朝觐准备提供个性化数字陪伴。"
  }}
};

const aiTranslations = {
  en:{
    greeting:"Assalamualaikum! I can help you with your pilgrimage preparation, savings goal, package selection, visa pathway and journey planning. What would you like to know?",
    financial:"You have Rp 12.850.000 saved towards your Rp 18.900.000 target, giving you 68% financial readiness. You are Rp 6.050.000 away from your current target.",
    package:"Based on your current Rp 12.850.000 savings, the prototype marketplace shows packages from Rp 12.500.000. I recommend comparing provider verification, hotel location, duration and included services before selecting.",
    saving:"Your current target is Rp 18.900.000 and your savings are Rp 12.850.000. You are 68% towards the target, with Rp 6.050.000 remaining.",
    visa:"The prototype supports Umrah Visa and Tourist/Travel Visa pathways. Actual eligibility and requirements should always be verified through current official Saudi channels.",
    general:"I can help you compare packages, plan your savings, understand the visa pathway and prepare your pilgrimage checklist."
  },
  ms:{
    greeting:"Assalamualaikum! Saya boleh membantu persediaan ibadah anda, sasaran simpanan, pemilihan pakej, laluan visa dan perancangan perjalanan. Apakah yang ingin anda ketahui?",
    financial:"Anda telah menyimpan Rp 12.850.000 daripada sasaran Rp 18.900.000, iaitu 68% tahap kesiapsiagaan kewangan. Baki sasaran anda ialah Rp 6.050.000.",
    package:"Dengan simpanan Rp 12.850.000, prototaip marketplace menunjukkan pakej bermula sekitar Rp 12.500.000. Bandingkan pengesahan pengendali, lokasi hotel, tempoh dan perkhidmatan sebelum memilih.",
    saving:"Sasaran semasa ialah Rp 18.900.000 dan simpanan anda Rp 12.850.000. Anda telah mencapai 68%, dengan baki Rp 6.050.000.",
    visa:"Prototaip menyokong laluan Visa Umrah dan Visa Pelancong/Perjalanan. Kelayakan serta syarat sebenar hendaklah disemak melalui saluran rasmi Saudi yang terkini.",
    general:"Saya boleh membantu membandingkan pakej, merancang simpanan, memahami laluan visa dan menyediakan senarai semak perjalanan ibadah."
  },
  ar:{
    greeting:"السلام عليكم! يمكنني مساعدتك في الاستعداد للعمرة والحج، وأهداف الادخار، واختيار الباقات، ومسار التأشيرة وتخطيط الرحلة. ماذا تريد أن تعرف؟",
    financial:"لديك Rp 12.850.000 مدخرة من هدف Rp 18.900.000، أي أن جاهزيتك المالية تبلغ 68%. المتبقي من هدفك Rp 6.050.000.",
    package:"بناءً على مدخراتك الحالية البالغة Rp 12.850.000، تعرض المنصة التجريبية باقات تبدأ من Rp 12.500.000. يُنصح بمقارنة اعتماد مقدم الخدمة وموقع الفندق والمدة والخدمات قبل الاختيار.",
    saving:"هدفك الحالي Rp 18.900.000 ومدخراتك Rp 12.850.000. لقد وصلت إلى 68%، والمتبقي Rp 6.050.000.",
    visa:"يدعم النموذج مساري تأشيرة العمرة والتأشيرة السياحية/تأشيرة السفر. يجب دائماً التحقق من الأهلية والمتطلبات الفعلية من القنوات السعودية الرسمية الحالية.",
    general:"يمكنني مساعدتك في مقارنة الباقات وتخطيط الادخار وفهم مسار التأشيرة وإعداد قائمة الاستعداد للرحلة."
  },
  id:{
    greeting:"Assalamualaikum! Saya dapat membantu persiapan ibadah, target tabungan, pemilihan paket, jalur visa, dan perencanaan perjalanan Anda. Apa yang ingin Anda ketahui?",
    financial:"Anda telah menabung Rp12.850 dari target Rp18.900, sehingga kesiapan finansial Anda 68%. Sisa target Anda Rp6.050.",
    package:"Dengan tabungan Rp12.850, marketplace prototipe menampilkan paket mulai sekitar Rp12.500. Bandingkan verifikasi penyedia, lokasi hotel, durasi, dan layanan sebelum memilih.",
    saving:"Target Anda Rp18.900 dan tabungan saat ini Rp12.850. Anda sudah mencapai 68%, dengan sisa Rp6.050.",
    visa:"Prototipe mendukung Visa Umrah dan Visa Turis/Perjalanan. Kelayakan dan persyaratan aktual harus selalu diverifikasi melalui kanal resmi Saudi terbaru.",
    general:"Saya dapat membantu membandingkan paket, merencanakan tabungan, memahami jalur visa, dan menyiapkan daftar persiapan perjalanan."
  },
  tr:{
    greeting:"Selamünaleyküm! Umre ve hac hazırlığınız, birikim hedefiniz, paket seçiminiz, vize yolunuz ve seyahat planınız konusunda yardımcı olabilirim. Ne öğrenmek istersiniz?",
    financial:"Rp18.900 hedefiniz için Rp12.850 birikiminiz var; finansal hazırlık oranınız %68. Hedefiniz için Rp6.050 kaldı.",
    package:"Mevcut Rp12.850 birikiminize göre prototip pazaryeri yaklaşık Rp12.500'den başlayan paketler gösteriyor. Seçmeden önce sağlayıcı doğrulaması, otel konumu, süre ve hizmetleri karşılaştırın.",
    saving:"Mevcut hedefiniz Rp18.900 ve birikiminiz Rp12.850. Hedefin %68'ine ulaştınız; Rp6.050 kaldı.",
    visa:"Prototip Umre Vizesi ve Turist/Seyahat Vizesi yollarını destekler. Gerçek uygunluk ve şartlar güncel Suudi Arabistan resmî kanallarından doğrulanmalıdır.",
    general:"Paketleri karşılaştırmanıza, birikim planlamanıza, vize yolunu anlamanıza ve seyahat hazırlık listenizi oluşturmanıza yardımcı olabilirim."
  },
  ur:{
    greeting:"السلام علیکم! میں آپ کی عمرہ و حج کی تیاری، بچت کے ہدف، پیکیج کے انتخاب، ویزا کے راستے اور سفر کی منصوبہ بندی میں مدد کر سکتا ہوں۔ آپ کیا جاننا چاہتے ہیں؟",
    financial:"آپ نے Rp 18.900.000 کے ہدف میں سے Rp 12.850.000 بچائے ہیں، یعنی مالی تیاری 68% ہے۔ آپ کے ہدف میں Rp 6.050.000 باقی ہیں۔",
    package:"آپ کی موجودہ Rp 12.850.000 بچت کے مطابق پروٹوٹائپ مارکیٹ پلیس تقریباً Rp 12.500.000 سے شروع ہونے والے پیکیجز دکھاتی ہے۔ انتخاب سے پہلے فراہم کنندہ کی تصدیق، ہوٹل کا مقام، مدت اور خدمات کا موازنہ کریں۔",
    saving:"آپ کا موجودہ ہدف Rp 18.900.000 اور بچت Rp 12.850.000 ہے۔ آپ 68% تک پہنچ چکے ہیں اور Rp 6.050.000 باقی ہیں۔",
    visa:"پروٹوٹائپ عمرہ ویزا اور ٹورسٹ/ٹریول ویزا کے راستوں کو سپورٹ کرتا ہے۔ اصل اہلیت اور شرائط سعودی عرب کے موجودہ سرکاری ذرائع سے ضرور چیک کریں۔",
    general:"میں پیکیجز کا موازنہ، بچت کی منصوبہ بندی، ویزا کے راستے کو سمجھنے اور سفر کی چیک لسٹ تیار کرنے میں مدد کر سکتا ہوں۔"
  },
  zh:{
    greeting:"愿您平安！我可以帮助您准备朝觐、设定储蓄目标、选择套餐、了解签证路径以及规划行程。您想了解什么？",
    financial:"您目前已为 Rp 18.900.000 的目标储蓄 Rp 12.850.000，财务准备度为 68%，距离目标还差 Rp 6.050.000。",
    package:"根据您目前 Rp 12.850.000 的储蓄，原型平台显示套餐约从 Rp 12.500.000 起。选择前建议比较服务商认证、酒店位置、行程时间和包含的服务。",
    saving:"您的当前目标为 Rp 18.900.000，储蓄为 Rp 12.850.000，已完成 68%，还差 Rp 6.050.000。",
    visa:"原型支持小朝觐签证以及旅游/旅行签证路径。实际资格和要求必须通过最新的沙特官方渠道确认。",
    general:"我可以帮助您比较套餐、制定储蓄计划、了解签证路径并准备朝觐行程清单。"
  }
};

let currentAILanguage = "en";
let aiListening = false;

function currentAIReply(key){
  return (aiTranslations[currentAILanguage]||aiTranslations.en)[key] || aiTranslations.en[key];
}

function applyAIUILanguage(lang){
  const cfg=aiLanguageConfig[lang]||aiLanguageConfig.en;
  currentAILanguage=lang;
  document.documentElement.lang=lang;
  const aiPage=document.getElementById("ai");
  if(aiPage) aiPage.dir=cfg.dir;
  const map={
    languageLabel:"language",languageHint:"hint",aiOnlineLabel:"online",
    suggestPackage:"packages",suggestSaving:"saving",suggestVisa:"visa",
    chatInput:"placeholder",sendAIButton:"send",aiVoiceNote:"voiceNote",
    aiPageTitle:"title",aiPageSubtitle:"subtitle"
  };
  Object.entries(map).forEach(([id,key])=>{
    const el=document.getElementById(id); if(!el)return;
    if(key==="placeholder")el.placeholder=cfg.ui[key];
    else el.textContent=cfg.ui[key];
  });
  const tr=document.querySelector(".ai-translate-btn"); if(tr)tr.textContent=cfg.ui.translate;
  const status=document.getElementById("aiVoiceStatus"); if(status)status.textContent=cfg.ui.voice;
  translateConversation(false);
}

function changeAILanguage(lang){
  applyAIUILanguage(lang);
  toast(`${aiLanguageConfig[lang].name} selected`);
}

function translateConversation(showToast=true){
  const t=aiTranslations[currentAILanguage]||aiTranslations.en;
  document.querySelectorAll("#chatBody .message").forEach(msg=>{
    const en=msg.dataset.en;
    if(!en)return;
    let translated=en;
    if(en.includes("Assalamualaikum! I can help")) translated=t.greeting;
    else if(en.includes("You have Rp 12.850.000 saved")) translated=t.financial;
    else if(en==="Am I financially ready for Umrah?") translated={
      en:"Am I financially ready for Umrah?",
      ms:"Adakah saya bersedia dari segi kewangan untuk Umrah?",
      ar:"هل أنا مستعد مالياً للعمرة؟",
      id:"Apakah saya siap secara finansial untuk Umrah?",
      tr:"Umre için finansal olarak hazır mıyım?",
      ur:"کیا میں عمرہ کے لیے مالی طور پر تیار ہوں؟",
      zh:"我的财务状况适合去小朝觐吗？"
    }[currentAILanguage];
    else translated=msg.classList.contains("user")?en:t.general;
    // Preserve the speak button on AI messages.
    const speak=msg.querySelector(".message-speak");
    msg.textContent=translated;
    if(speak && !msg.classList.contains("user")) msg.appendChild(speak);
  });
  if(showToast)toast(`Conversation translated to ${aiLanguageConfig[currentAILanguage].name}`);
}

function speakText(text){
  if(!("speechSynthesis" in window)){
    toast("Voice playback is not supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang=(aiLanguageConfig[currentAILanguage]||aiLanguageConfig.en).speech;
  utterance.rate=currentAILanguage==="ar"||currentAILanguage==="ur"?0.82:0.9;
  utterance.pitch=.95;
  utterance.volume=1;
  utterance.onstart=()=>{const s=document.getElementById("aiVoiceStatus");if(s)s.textContent="🔊 Speaking…";};
  utterance.onend=()=>{const s=document.getElementById("aiVoiceStatus");if(s)s.textContent=(aiLanguageConfig[currentAILanguage]||aiLanguageConfig.en).ui.voice;};
  window.speechSynthesis.speak(utterance);
}

function speakMessage(button){
  const msg=button?.closest(".message");
  if(msg)speakText(msg.innerText.replace("🔊","").trim());
}

function speakLastAI(){
  const msgs=[...document.querySelectorAll("#chatBody .message.ai")];
  const last=msgs[msgs.length-1];
  if(last)speakMessage(last.querySelector(".message-speak"));
}

function startAIVoiceInput(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){
    toast("Voice input is not supported by this browser. Try Chrome or Edge.");
    return;
  }
  if(aiListening)return;
  const cfg=aiLanguageConfig[currentAILanguage]||aiLanguageConfig.en;
  const recognition=new SR();
  recognition.lang=cfg.speech;
  recognition.interimResults=false;
  recognition.maxAlternatives=1;
  aiListening=true;
  const btn=document.getElementById("voiceInputBtn"), status=document.getElementById("aiVoiceStatus");
  if(btn)btn.classList.add("listening");
  if(status)status.textContent=cfg.ui.voiceListening;
  recognition.onresult=(event)=>{
    const transcript=event.results[0][0].transcript;
    document.getElementById("chatInput").value=transcript;
    sendAI();
  };
  recognition.onerror=()=>toast("Voice input could not be captured. Please try again.");
  recognition.onend=()=>{
    aiListening=false;
    if(btn)btn.classList.remove("listening");
    if(status)status.textContent=cfg.ui.voice;
  };
  recognition.start();
}

function askAI(question){
  const input=document.getElementById("chatInput");
  if(input){ input.value=question; sendAI(); }
}

/* ===== iHARAM AI — DEMO KNOWLEDGE ENGINE =====
   This is a deterministic prototype assistant, not a live LLM.
   It answers only from verified demo knowledge and clearly flags items
   that require current official/provider verification.
*/
const HARAMAIN360DemoData = {
  savings:{saved:12850,target:18900,monthly:750},
  packageMin:6390,
  packageExamples:[
    ["Andalusia Travel & Tours Sdn Bhd","Umrah Transit Sharjah","Rp 6.390.000"],
    ["Glocal Travel & Tours Sdn Bhd","Umrah Mampu Milik","Rp 6.990.000"],
    ["Nuh Travel & Tours Sdn Bhd","Umrah Menara Jam Dubai City","Rp 8.390.000"]
  ],
  cities:{makkah:"Makkah",madinah:"Madinah"}
};

function aiMoney(n){
  return "Rp "+Number(n).toLocaleString("id-ID",{maximumFractionDigits:0});
}
function aiSavingsResult(){
  const s=HARAMAIN360DemoData.savings;
  const gap=Math.max(0,s.target-s.saved);
  const pct=Math.min(100,(s.saved/s.target)*100);
  const months=s.monthly>0?Math.ceil(gap/s.monthly):null;
  return {gap,pct,months};
}
function aiNormalise(q){
  return q.toLowerCase()
    .replace(/[’']/g,"'")
    .replace(/[?!.:,;]/g," ")
    .replace(/\s+/g," ").trim();
}
function aiHas(q, words){
  return words.some(w=>q.includes(w));
}
function aiLangText(key){
  const t=aiTranslations[currentAILanguage]||aiTranslations.en;
  return t[key] || aiTranslations.en[key] || "";
}
function aiMakeReply(enReply){
  /* For the demo, English is the source of truth. Existing translation
     support remains available for the predefined intents. */
  return enReply;
}

function detectAIIntent(question){
  const q=aiNormalise(question);

  if(aiHas(q,[
    "who are you","what can you do","help me","what do you do",
    "apa yang boleh","boleh bantu","siapa awak","bantuan"
  ])) return "greeting";

  if(aiHas(q,[
    "financially ready","financial ready","am i ready","ready for umrah",
    "ready for hajj","financial readiness","kewangan","kewangan saya",
    "cukup duit","cukup wang","bersedia dari segi kewangan","financial"
  ])) return "financial";

  if(aiHas(q,[
    "how much should i save","monthly saving","monthly savings","save monthly",
    "how much save","savings plan","simpan sebulan","simpanan bulanan",
    "berapa perlu simpan","berapa sebulan","monthly contribution"
  ])) return "saving";

  if(aiHas(q,[
    "package","packages","pakej","pakej umrah","pakej haji","harga pakej",
    "price package","within my budget","bajet saya","travel package"
  ])) return "package";

  if(aiHas(q,[
    "visa","visa umrah","umrah visa","hajj visa","visa route",
    "visa pathway","dokumen visa","visa documents","syarat visa"
  ])) return "visa";

  if(aiHas(q,[
    "tawaf","tawaf start","black stone","hajar aswad","circumambulation"
  ])) return "tawaf";

  if(aiHas(q,[
    "sa'i","sai","sa i","safa","marwah"
  ])) return "sai";

  if(aiHas(q,[
    "ihram","miqat","talbiyah","ihram rules","pantang ihram"
  ])) return "ihram";

  if(aiHas(q,[
    "packing","what to bring","bring","barang","bawa","packing list",
    "things to bring","apa perlu bawa"
  ])) return "packing";

  if(aiHas(q,[
    "hotel","hotels","makkah hotel","madinah hotel","penginapan"
  ])) return "hotel";

  if(aiHas(q,[
    "weather","cuaca","temperature","suhu"
  ])) return "weather";

  if(aiHas(q,[
    "exchange rate","currency","money exchange","tukar duit","mata wang",
    "sar rate","sar"
  ])) return "currency";

  if(aiHas(q,[
    "takaful","travel protection","insurance","perlindungan"
  ])) return "takaful";

  if(aiHas(q,[
    "nusuk","nusk","appointment","permit"
  ])) return "nusuk";

  return "general";
}

function aiReplyForIntent(intent, question){
  const s=HARAMAIN360DemoData.savings, r=aiSavingsResult();

  switch(intent){
    case "greeting":
      return "Assalamualaikum! I am HARAMAIN360 AI, the pilgrimage preparation assistant in this prototype. I can help you understand your savings position, compare the demo packages, prepare for Ihram, Tawaf and Sa'i (Walking between Safa and Marwah), organise packing, understand visa pathways, and plan your journey. For live prices, visa eligibility, Nusuk appointments and official religious rulings, I will clearly direct you to the relevant official or authorised source.";

    case "financial":
      return `Based on the current demo profile, you have ${aiMoney(s.saved)} saved towards a ${aiMoney(s.target)} pilgrimage target. That is ${r.pct.toFixed(0)}% financial readiness, leaving a gap of ${aiMoney(r.gap)}. With the current planned contribution of ${aiMoney(s.monthly)} per month, the remaining amount would take approximately ${r.months} months to cover, assuming no change in the target or contribution. This is a budgeting estimate, not a financial guarantee.`;

    case "saving":
      return `Your demo target is ${aiMoney(s.target)} and your current savings are ${aiMoney(s.saved)}. The remaining gap is ${aiMoney(r.gap)}. At ${aiMoney(s.monthly)} per month, you would need about ${r.months} months. If you want to reach the target faster, the prototype can recalculate the journey using a higher monthly contribution.`;

    case "package":
      return `For the current prototype package data, the displayed starting prices are ${HARAMAIN360DemoData.packageExamples.map(x=>x[2]).join(", ")}. The three demo examples are: ${HARAMAIN360DemoData.packageExamples.map(x=>x[0]+" — "+x[1]+" ("+x[2]+")").join("; ")}. These are demonstration listings, not a live booking feed. Before purchase, users should verify the operator's current MOTAC status, package terms, inclusions, departure date, hotel details and cancellation/refund conditions.`;

    case "visa":
      return "Visa requirements can change and depend on nationality, pilgrimage type and the current Saudi regulations. HARAMAIN360 AI should not invent or guarantee eligibility. In the prototype, use Visa & Route to organise the required documents and pathway, then confirm the current requirements through the official Saudi authorities, Nusuk and the relevant Malaysian authorities before applying.";

    case "ihram":
      return "For the learning prototype: prepare before reaching the applicable Miqat, understand the Ihram requirements for your pilgrimage, make the intention at the appropriate point and recite the Talbiyah. Men generally use the prescribed unstitched Ihram garments; women do not have a special two-piece Ihram garment and should follow the applicable rules of modest dress. The exact rulings can differ by circumstance and school of thought, so confirm personal questions with a qualified guide or scholar.";

    case "tawaf":
      return "Tawaf is performed around the Ka'bah with the Ka'bah on the left. The conventional starting point is aligned with the Black Stone (Hajar al-Aswad), and the seven circuits are completed at that starting point. The prototype should guide the learner using the starting marker, direction arrows and circuit counter. There is no requirement to recite one fixed supplication for every part of Tawaf; authentic general dhikr and personal dua may be made, while specific established supplications should be presented from an approved scholarly source.";

    case "sai":
      return "Sa'i (Walking between Safa and Marwah) is performed between Safa and Marwah for seven trips, beginning at Safa and ending at Marwah. The learner should follow the marked route and count each trip correctly. The green-marker section indicates the area where men traditionally hasten; women continue at their normal pace. There is no single mandatory dua for every section, so the prototype should use approved supplications and general dhikr rather than inventing fixed wording.";

    case "packing":
      return "For a typical 10-day Umrah/Hajj journey, the prototype packing checklist can include passport and visa documents, identification copies, medication and prescriptions, comfortable clothing, toiletries, prayer items, comfortable footwear, phone and charger, power bank, universal adaptor, small day bag, reusable water bottle and basic personal supplies. Men should include suitable Ihram garments; women should prepare suitable modest clothing and headscarves. Medication should remain in original labelled packaging with relevant documentation. The final list should be personalised to the traveller, season, airline allowance and package itinerary.";

    case "hotel":
      return "The hotel module contains demo listings for Makkah and Madinah. Users can compare hotel location, distance to the mosque, estimated walking time, room/package information and price. Hotel prices change by date, room type and availability, so the displayed prototype prices should not be treated as live quotations.";

    case "weather":
      return "The weather section is designed for live Makkah and Madinah conditions. Because weather changes continuously, this demo should use a live weather source rather than a hard-coded answer. Check the displayed city, local time, temperature and forecast before travelling.";

    case "currency":
      return "The Money & Shopping module is designed to show SAR exchange information, exchange locations in Makkah and Madinah, and shopping areas. Exchange rates and provider fees change, so the prototype should label rates with their update time and distinguish indicative rates from actual counter rates.";

    case "takaful":
      return "Travel Takaful is an optional protection layer in the prototype. Users can compare coverage such as medical assistance, travel disruption, baggage and other eligible benefits. Coverage, exclusions and Shariah structure depend on the actual certificate, so users should read the product disclosure and certificate wording before purchase.";

    case "nusuk":
      return "Nusuk is Saudi Arabia's official digital platform used for pilgrimage-related services and, where applicable, permits or bookings. The HARAMAIN360 prototype can provide a shortcut and preparation checklist, but it should not claim to issue a permit itself. Users should complete the actual service through the current official Nusuk platform.";

    default:
      return "I can help with Umrah and Hajj preparation, but I do not want to guess and give you an incorrect religious, visa or travel answer. Try asking about: savings readiness, Umrah packages, visa documents, Ihram, Tawaf, Sa'i (Walking between Safa and Marwah), packing, hotels, Takaful, Nusuk, currency exchange or journey planning.";
  }
}

function sendAI(){
  const input=document.getElementById("chatInput");
  if(!input)return;
  const text=input.value.trim();
  if(!text)return;

  const body=document.getElementById("chatBody");
  const user=document.createElement("div");
  user.className="message user";
  user.textContent=text;
  user.dataset.en=text;
  body.appendChild(user);
  input.value="";
  body.scrollTop=body.scrollHeight;

  const thinking=document.createElement("div");
  thinking.className="message ai ai-thinking";
  thinking.textContent="HARAMAIN360 AI is checking your question…";
  body.appendChild(thinking);
  body.scrollTop=body.scrollHeight;

  setTimeout(()=>{
    const intent=detectAIIntent(text);
    const reply=aiReplyForIntent(intent,text);

    thinking.classList.remove("ai-thinking");
    thinking.dataset.en=reply;
    thinking.innerHTML=`${reply}<button class="message-speak" onclick="speakMessage(this)" title="Listen">🔊</button>`;
    body.scrollTop=body.scrollHeight;
  },350);
}

document.getElementById("chatInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendAI()});

let vrRound = 1;
function enterVR(){
  const scene = document.querySelector('#vrStage a-scene');
  if(scene && scene.enterVR) {
    scene.enterVR();
  } else {
    toast("WebXR is not available in this browser. Use the 3D simulation instead.");
  }
}
function toggleVRFullscreen(){
  const shell=document.getElementById("vrSimulationShell");
  if(shell.requestFullscreen) shell.requestFullscreen();
  else toast("Fullscreen is not supported by this browser.");
}

function nextRound(){vrRound=Math.min(7,vrRound+1);document.getElementById("vrRoundNumber").textContent=`${vrRound} / 7`;toast(`Tawaf round ${vrRound} selected`);}
function prevRound(){vrRound=Math.max(1,vrRound-1);document.getElementById("vrRoundNumber").textContent=`${vrRound} / 7`;toast(`Tawaf round ${vrRound} selected`);}

const sacredWeather = {
  makkah:{lat:21.4225,lon:39.8262},
  madinah:{lat:24.4672,lon:39.6024}
};
let currentWeatherCity="makkah", currentPrayerCity="makkah";
const demoImams = {
  makkah:{fajr:"Scheduled — official feed",dhuhr:"Scheduled — official feed",asr:"Scheduled — official feed",maghrib:"Scheduled — official feed",isha:"Scheduled — official feed"},
  madinah:{fajr:"Scheduled — official feed",dhuhr:"Scheduled — official feed",asr:"Scheduled — official feed",maghrib:"Scheduled — official feed",isha:"Scheduled — official feed"}
};
function loadWeather(city,button){
  currentWeatherCity=city;
  document.querySelectorAll(".weather-city").forEach(b=>b.classList.remove("active"));
  if(button) button.classList.add("active");
  const p=sacredWeather[city];
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=Asia%2FRiyadh`)
    .then(r=>r.json()).then(d=>{
      const c=d.current;
      document.getElementById("weatherTemp").textContent=Math.round(c.temperature_2m)+"°C";
      document.getElementById("weatherFeels").textContent=Math.round(c.apparent_temperature)+"°C";
      document.getElementById("weatherHumidity").textContent=Math.round(c.relative_humidity_2m)+"%";
      document.getElementById("weatherWind").textContent=Math.round(c.wind_speed_10m)+" km/h";
      document.getElementById("weatherDesc").textContent=weatherDescription(c.weather_code);
      document.getElementById("weatherIcon").textContent=weatherEmoji(c.weather_code);
    }).catch(()=>{document.getElementById("weatherDesc").textContent="Weather temporarily unavailable";});
}
function weatherDescription(code){
  if(code===0)return"Clear sky"; if([1,2,3].includes(code))return"Partly cloudy"; if([45,48].includes(code))return"Fog"; if(code>=51&&code<=67)return"Rain"; if(code>=80&&code<=82)return"Rain showers"; if(code>=95)return"Thunderstorm"; return"Variable conditions";
}
function weatherEmoji(code){if(code===0)return"☀️";if([1,2,3].includes(code))return"⛅";if(code>=51&&code<=82)return"🌧️";if(code>=95)return"⛈️";return"🌤️";}
function updateWorldClocks(){
  const zones={clockMakkah:"Asia/Riyadh",clockMadinah:"Asia/Riyadh",clockMalaysia:"Asia/Jakarta",clockLondon:"Europe/London",clockNewYork:"America/New_York",clockTokyo:"Asia/Tokyo"};
  Object.entries(zones).forEach(([id,tz])=>{const el=document.getElementById(id);if(el)el.textContent=new Intl.DateTimeFormat("en-GB",{timeZone:tz,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(new Date());});
  const sd=document.getElementById("saudiDate");if(sd)sd.textContent=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Riyadh",weekday:"short",day:"2-digit",month:"short",year:"numeric"}).format(new Date());
}
function setPrayerCity(city,button){
  currentPrayerCity=city;
  document.querySelectorAll(".prayer-city-switch button").forEach(b=>b.classList.remove("active"));
  if(button)button.classList.add("active");
  fetchPrayerTimes(city);
}
function fetchPrayerTimes(city){
  const p=sacredWeather[city];
  fetch(`https://api.aladhan.com/v1/timingsByCoordinates?latitude=${p.lat}&longitude=${p.lon}&method=4`)
    .then(r=>r.json()).then(d=>{
      const t=d.data.timings;
      const ids={Fajr:["fajrTime","fajrIqamah"],Dhuhr:["dhuhrTime","dhuhrIqamah"],Asr:["asrTime","asrIqamah"],Maghrib:["maghribTime","maghribIqamah"],Isha:["ishaTime","ishaIqamah"]};
      Object.entries(ids).forEach(([k,arr])=>{
        document.getElementById(arr[0]).textContent=t[k];
        document.getElementById(arr[1]).textContent="—";
      });
      updateNextPrayer(t);
    }).catch(()=>{});
  const im=demoImams[city];
  [["fajrImam","fajr"],["dhuhrImam","dhuhr"],["asrImam","asr"],["maghribImam","maghrib"],["ishaImam","isha"]].forEach(([id,k])=>document.getElementById(id).textContent=im[k]);
}
function updateNextPrayer(t){
  const now=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Riyadh"}));
  const mins=now.getHours()*60+now.getMinutes();
  const list=[["Fajr",t.Fajr],["Dhuhr",t.Dhuhr],["Asr",t.Asr],["Maghrib",t.Maghrib],["Isha",t.Isha]];
  let next=list.find(([n,v])=>{const [h,m]=v.split(":").map(Number);return h*60+m>mins;});
  if(!next)next=["Fajr",t.Fajr];
  document.getElementById("nextPrayerText").textContent=`Next in Makkah/Madinah: ${next[0]} at ${next[1]} (Saudi time)`;
}
function initLiveSacredSites(){
  loadWeather("makkah",document.querySelector(".weather-city"));
  fetchPrayerTimes("makkah");
  updateWorldClocks();
  setInterval(updateWorldClocks,1000);
  const u=document.getElementById("liveUpdated");if(u)u.textContent="Live data enabled";
}
document.addEventListener("DOMContentLoaded",initLiveSacredSites);

const stayData={
  makkah:{
    label:"Makkah",tag:"MAKKAH",icon:"🕋",
    hotels:[
      {name:"Fairmont Makkah Clock Royal Tower",stars:5,distance:"Clock Tower / Haram",walk:"~2 min",price:"Rp 1.450.000",shuttle:false,tags:["5★","Closest","Premium"],img:"https://flagsinttravel.co.uk/wp-content/uploads/2024/11/11-scaled.jpg",source:"Real hotel photo reference"},
      {name:"Anjum Hotel Makkah",stars:5,distance:"Near Haram",walk:"~8 min",price:"Rp 850.000",shuttle:true,tags:["5★","Shuttle","Family"],img:"https://global.almosafer.com/image/hotels?q=75&url=http%3A%2F%2Fhotelcms-contents-live.almosafer.com%2F00c16edd-76a7-4da9-8d35-31e06bddd8cc.jpg&w=3840",source:"Real hotel photo reference"},
      {name:"Elaf Kinda Hotel",stars:5,distance:"Central Makkah",walk:"~5 min",price:"Rp 920.000",shuttle:false,tags:["5★","Haram area","Family"],img:"https://i.ytimg.com/vi/Rmpi38jvrNc/maxresdefault.jpg",source:"Real hotel photo reference"},
      {name:"M Hotel Makkah by Millennium",stars:5,distance:"Ibrahim Al Khalil",walk:"Transport",price:"Rp 430.000",shuttle:true,tags:["5★","Shuttle","Value"],img:"https://cdn.halalstatic.com/2022%2F11%2F14%2F09%2F08%2F28%2F8fe85c93-43a4-4247-97ba-6059f87ab8f9%2F62285_Y4DyeoAqRMuqt6tH3XKU4Q.jpg?fit=bounds&format=jpg&width=1600",source:"Real hotel photo reference"}
    ],
    places:[
      {icon:"🕋",name:"Masjid al-Haram",tag:"Essential",desc:"The central destination for Tawaf, prayer and Umrah."},
      {icon:"⛰️",name:"Jabal al-Nour",tag:"Historical",desc:"Mountain associated with the Cave of Hira."},
      {icon:"⛰️",name:"Jabal Thawr",tag:"Historical",desc:"Mountain associated with the Hijrah journey."},
      {icon:"🕌",name:"Masjid Aisha / Tan'im",tag:"Umrah preparation",desc:"Important location for pilgrims starting a new Umrah from Makkah."},
      {icon:"🏕️",name:"Mina",tag:"Hajj",desc:"Major Hajj site; visit according to official Hajj arrangements."},
      {icon:"🌄",name:"Arafat",tag:"Hajj",desc:"Central Hajj site; not an Umrah ritual location."}
    ]
  },
  madinah:{
    label:"Madinah",tag:"MADINAH",icon:"🌙",
    hotels:[
      {name:"Anwar Al Madinah Mövenpick Hotel",stars:5,distance:"Masjid an-Nabawi",walk:"~3 min",price:"Rp 780.000",shuttle:true,tags:["5★","Central","Family"],img:"https://res.cloudinary.com/lastminute/image/upload/q_auto/v1756668690/xjhpkgcy86qcpbpt2gtw.jpg",source:"Real hotel photo reference"},
      {name:"Pullman Zamzam Madinah",stars:5,distance:"Near Masjid an-Nabawi",walk:"~3 min",price:"Rp 720.000",shuttle:false,tags:["5★","Central","Family"],img:"https://rihla.co.id/uploads/0000/14/2024/04/15/pullman-zam-zam-madinah-4.png",source:"Real hotel photo reference"},
      {name:"Saja Al Madinah Hotel",stars:4,distance:"Central Madinah",walk:"~5 min",price:"Rp 430.000",shuttle:true,tags:["4★","Shuttle","Value"],img:"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",source:"Hotel-style placeholder; replace with licensed hotel image"},
      {name:"Emaar Royal Hotel",stars:4,distance:"Central Madinah",walk:"~7 min",price:"Rp 480.000",shuttle:false,tags:["4★","Value"],img:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=85",source:"Hotel-style placeholder; replace with licensed hotel image"}
    ],
    places:[
      {icon:"🌙",name:"Masjid an-Nabawi",tag:"Essential",desc:"The Prophet's Mosque and the heart of the Madinah visit."},
      {icon:"🕌",name:"Quba Mosque",tag:"Historical",desc:"One of the most significant mosques in Madinah."},
      {icon:"⛰️",name:"Uhud Mountain",tag:"Historical",desc:"Historic Uhud area and the martyrs' cemetery."},
      {icon:"🕌",name:"Masjid Qiblatain",tag:"Historical",desc:"Historic mosque associated with the change of qiblah."},
      {icon:"🏘️",name:"Khandaq / Trench Area",tag:"Historical",desc:"Area associated with the Battle of the Trench."},
      {icon:"🚂",name:"Hejaz Railway Station",tag:"Heritage",desc:"Historic railway heritage site in Madinah."}
    ]
  }
};
let currentStayCity="makkah", currentStayTab="hotels", currentPlannerStyle="Elderly-friendly";
function switchStayCity(city,button){
  currentStayCity=city;
  document.querySelectorAll(".city-btn").forEach(b=>b.classList.remove("active"));
  if(button)button.classList.add("active");
  const d=stayData[city];
  document.querySelector(".stay-hero .tag").textContent=d.tag;
  document.querySelector(".stay-hero h2").textContent=city==="makkah"?"Your smart base near the Haram.":"Your smart base near Masjid an-Nabawi.";
  document.querySelector(".stay-hero-icon").textContent=d.icon;
  document.getElementById("hotelHeading").textContent=`Hotels in ${d.label}`;
  document.getElementById("placesHeading").textContent=`Places to Visit in ${d.label}`;
  document.getElementById("transportCity").textContent=d.label;
  document.getElementById("plannerCity").textContent=d.label;
  renderHotels(); renderPlaces();
}
function stayTab(tab,button){
  currentStayTab=tab;
  document.querySelectorAll(".stay-panel").forEach(p=>p.classList.remove("active"));
  document.querySelectorAll(".stay-tab").forEach(b=>b.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
  if(button)button.classList.add("active");
}
function renderHotels(){
  const grid=document.getElementById("hotelGrid"); if(!grid)return;
  const filter=document.getElementById("hotelFilter")?.value||"all";
  let hotels=stayData[currentStayCity].hotels;
  if(filter==="5")hotels=hotels.filter(h=>h.stars===5);
  if(filter==="4")hotels=hotels.filter(h=>h.stars===4);
  if(filter==="shuttle")hotels=hotels.filter(h=>h.shuttle);
  if(filter==="near")hotels=hotels.filter(h=>h.distance.toLowerCase().includes("haram")||h.walk.includes("2 min")||h.walk.includes("3 min")||h.walk.includes("4 min"));
  grid.innerHTML=hotels.map(h=>`<div class="hotel-card">
    <div class="hotel-image photo-hotel"><img src="${h.img}" alt="${h.name} hotel exterior" onerror="this.parentElement.classList.add('image-fallback');this.style.display='none'"><span class="hotel-badge">PHOTO</span><span class="hotel-source">${h.source}</span></div>
    <div class="hotel-body"><h3>${h.name}</h3><div class="location">📍 ${h.distance} · ${h.walk} walking</div>
    <div class="hotel-meta">${h.tags.map(t=>`<span>${t}</span>`).join("")}${h.shuttle?'<span>🚌 Shuttle</span>':""}</div>
    <div class="hotel-bottom"><div><small>Indicative from</small><strong>${h.price}</strong><small>/ night</small></div><button onclick="toast('${h.name} selected')">View</button></div></div></div>`).join("");
}
function renderPlaces(){
  const grid=document.getElementById("placeGrid"); if(!grid)return;
  grid.innerHTML=stayData[currentStayCity].places.map(p=>`<div class="place-card"><div class="place-icon">${p.icon}</div><div class="place-body"><h3>${p.name}</h3><p>${p.desc}</p><span class="place-tag">${p.tag}</span></div></div>`).join("");
}
function filterHotels(){renderHotels();stayTab("hotels",document.querySelector(".stay-tab"));}
function filterHotelsByShuttle(){document.getElementById("hotelFilter").value="shuttle";renderHotels();stayTab("hotels",document.querySelector(".stay-tab"));}
function selectPlannerStyle(button){
  document.querySelectorAll(".planner-option").forEach(b=>b.classList.remove("active"));
  button.classList.add("active"); currentPlannerStyle=button.textContent.trim();
}
function generateZiyarat(){
  const city=currentStayCity, elderly=currentPlannerStyle.includes("Elderly"), family=currentPlannerStyle.includes("Family");
  const places=stayData[city].places;
  const selected=elderly?places.filter(p=>p.tag==="Essential"||p.tag==="Historical").slice(0,3):places.slice(0,5);
  const times=elderly?["08:00","10:30","14:30"]:["08:00","10:00","12:00","15:00","17:00"];
  const route=selected.map((p,i)=>`<div class="route-item"><time>${times[i]||"18:00"}</time><span class="route-dot">${p.icon}</span><div><strong>${p.name}</strong><small>${p.desc}</small></div><em>${i===0?"Start":"Visit"}</em></div>`).join("");
  document.getElementById("itineraryPreview").innerHTML=`<div class="route-list"><div class="eyebrow">${city.toUpperCase()} · ${currentPlannerStyle.toUpperCase()}</div><h3 style="font-size:13px;margin:5px 0 12px">Suggested ${city} ziyarat route</h3>${route}<div style="margin-top:12px;font-size:7px;color:#888">AI-generated prototype itinerary. Always verify opening hours, access restrictions, transport and current religious guidance before travel.</div></div>`;
}

// ---------------- GUIDED IHRAM VR TOUR ----------------
let ihramTourTimer=null;
const ihramStagePositions=[
  {stage:1,x:-7,label:"01  PREPARE",text:"Begin with personal preparation. Learn the preparation sequence before entering the sacred state."},
  {stage:2,x:-2.35,label:"02  GARMENTS",text:"Men learn the two-piece Ihram garment. Women use permissible modest clothing; there is no special women's Ihram uniform."},
  {stage:3,x:2.35,label:"03  MIQAT",text:"Identify the Miqat that applies to your route. Do not pass the applicable Miqat intending Umrah without entering Ihram."},
  {stage:4,x:7,label:"04  INTENTION + TALBIYAH",text:"Make the intention for the intended rite and begin the Talbiyah. Use the selected male recording in the audio panel."}
];

function focusIhramStage(stage){
  const data=ihramStagePositions[stage-1]||ihramStagePositions[0];
  const camera=document.getElementById("academyCamera");
  if(!camera)return;
  const z=6.8;
  camera.setAttribute("position",`${data.x} 2.15 ${z}`);
  camera.setAttribute("rotation","0 0 0");
  const status=document.getElementById("ihramStatus3D");
  if(status)status.setAttribute("value",`${data.label}\n${data.text}`);
  document.querySelectorAll(".vr-stage-btn").forEach((b,i)=>b.classList.toggle("active",i===stage-1));
  const mode=document.getElementById("vrLessonMode"), text=document.getElementById("vrLessonText");
  if(mode)mode.textContent="IHRAM + MIQAT · STAGE "+String(stage).padStart(2,"0");
  if(text)text.textContent=data.text;
}

function startIhramGuidedTour(){
  if(ihramTourTimer)clearInterval(ihramTourTimer);
  setVRScene("ihram");
  let stage=1;
  focusIhramStage(stage);
  ihramTourTimer=setInterval(()=>{
    stage++;
    if(stage>4){
      clearInterval(ihramTourTimer); ihramTourTimer=null;
      toast("Ihram guided tour completed");
      return;
    }
    focusIhramStage(stage);
  },3500);
  toast("Guided Ihram tour started");
}

document.addEventListener("DOMContentLoaded",()=>{renderHotels();renderPlaces();});

document.addEventListener("DOMContentLoaded",()=>{if(document.getElementById("savings"))updateGoldSavings();});

let selectedTakaful="Family";
function toggleTakaful(){
  const on=document.getElementById("takafulToggle")?.checked;
  document.querySelector(".takaful-hero h2").textContent=on?"Protection added to your pilgrimage plan.":"Travel with greater peace of mind.";
  toast(on?"Takaful protection enabled":"Takaful protection disabled");
}
function selectTakaful(card,plan){
  document.querySelectorAll(".takaful-card").forEach(c=>c.classList.remove("selected"));
  card.classList.add("selected");
  selectedTakaful=plan;
  const toggle=document.getElementById("takafulToggle"); if(toggle)toggle.checked=true;
  toast(`${plan} Takaful plan selected`);
}

const moneyData={
  makkah:{
    label:"Makkah",
    exchanges:[
      {name:"Alamoudi Exchange Company",area:"Ibrahim Al Khalil Road · Al Shubaikah",rating:"4.4",hours:"09:00–00:00",note:"Near the central Haram area"},
      {name:"Hossam Alharthi Exchange",area:"Clock Towers · Ground Floor",rating:"3.7",hours:"08:00–23:30",note:"Convenient for pilgrims staying near Abraj Al-Bait"},
      {name:"Al Minhali Currency Exchange",area:"Al Jummayzah · Al Masjid Al Haram Road",rating:"4.6",hours:"Split daily hours",note:"Licensed exchange-service listing"}
    ],
    shopping:[
      {icon:"🛍️",name:"Abraj Al-Bait Shopping Center",desc:"Large shopping complex beside the Haram and Clock Towers.",tags:["Premium","Central","Gifts"]},
      {icon:"🏬",name:"Makkah Mall",desc:"Modern mall with fashion, food and family shopping.",tags:["Brands","Family","Food"]},
      {icon:"🛒",name:"Al Hijaz Mall",desc:"Popular mall for everyday shopping and family needs.",tags:["Value","Family","Food"]},
      {icon:"🛍️",name:"Masar Park",desc:"Large shopping and leisure destination in Makkah.",tags:["Shopping","Leisure","Food"]}
    ]
  },
  madinah:{
    label:"Madinah",
    exchanges:[
      {name:"Mubarak Salim Al-Lahibi & Sons Exchange",area:"King Fahd Road · Bada'ah",rating:"4.7",hours:"07:30–23:00",note:"Popular exchange-service listing in Madinah"},
      {name:"Salim S.D. Alluhibi & Sons",area:"Abi Ubaidah Al Jarrah · Bada'ah",rating:"4.7",hours:"08:00–23:00",note:"Near the central Madinah area"},
      {name:"Ahmed Oudah Alharbi Exchange",area:"Near Masjid an-Nabawi · Sheikh Abdulaziz bin Saleh St",rating:"4.6",hours:"08:00–23:00",note:"Convenient central location"}
    ],
    shopping:[
      {icon:"🛍️",name:"Taiba Commercial Center",desc:"Very close to Masjid an-Nabawi with souvenirs, dates, clothing and gifts.",tags:["Near Haram","Dates","Gifts"]},
      {icon:"🏬",name:"Al Noor Mall",desc:"Modern family shopping destination with fashion, dining and services.",tags:["Family","Brands","Food"]},
      {icon:"🌴",name:"Madinah Date Market",desc:"A useful stop for dates and food gifts; compare prices and quality.",tags:["Ajwa","Dates","Gifts"]},
      {icon:"🛍️",name:"Al Rashid Mega Mall",desc:"Large modern mall option for brands, food and family shopping.",tags:["Brands","Family","Leisure"]}
    ]
  }
};
let currentMoneyCity="makkah", fxRateMYRSAR=null;
function switchMoneyCity(city,button){
  currentMoneyCity=city;
  document.querySelectorAll(".money-city").forEach(b=>b.classList.remove("active"));
  if(button)button.classList.add("active");
  document.getElementById("exchangeHeading").textContent=`Money Exchange in ${moneyData[city].label}`;
  document.getElementById("shoppingHeading").textContent=`Shop in ${moneyData[city].label}`;
  renderExchange(); renderShopping();
}
function renderExchange(){
  const grid=document.getElementById("exchangeGrid"); if(!grid)return;
  grid.innerHTML=moneyData[currentMoneyCity].exchanges.map(x=>`<div class="exchange-card"><span class="safe-badge">✓ Exchange service</span><h3>${x.name}</h3><p>📍 ${x.area}</p><div class="exchange-rating">★ ${x.rating}</div><div class="exchange-meta"><span>🕒 ${x.hours}</span><span>🧾 Receipt recommended</span></div><small style="font-size:7px;color:#888;display:block;margin-bottom:9px">${x.note}</small><button onclick="toast('Map route opened for ${x.name}')">Open Map ↗</button></div>`).join("");
}
function renderShopping(){
  const grid=document.getElementById("shoppingGrid"); if(!grid)return;
  grid.innerHTML=moneyData[currentMoneyCity].shopping.map(s=>`<div class="shopping-card"><div class="shopping-icon">${s.icon}</div><h3>${s.name}</h3><p>${s.desc}</p><div class="shopping-tags">${s.tags.map(t=>`<span>${t}</span>`).join("")}</div><button onclick="toast('${s.name} added to Journey Planner')">Add to Journey</button></div>`).join("");
}
async function loadFxRate(){
  const rateEl=document.getElementById("fxRate"), timeEl=document.getElementById("fxTime");
  try{
    const r=await fetch("https://api.frankfurter.app/latest?from=IDR&to=SAR");
    const d=await r.json();
    if(d.rates&&d.rates.SAR){fxRateMYRSAR=Number(d.rates.SAR);rateEl.textContent=fxRateMYRSAR.toFixed(7);timeEl.textContent=`Updated ${d.date}`;convertFx();return;}
  }catch(e){}
  // Prototype fallback based on a current indicative rate; production should use a licensed/authoritative FX feed.
  fxRateMYRSAR=null; rateEl.textContent="—"; timeEl.textContent="Kurs langsung tidak tersedia";
  convertFx();
}
function convertFx(){
  if(!fxRateMYRSAR)return;
  const amount=Number(document.getElementById("fxAmount")?.value||0);
  const out=document.getElementById("fxResult"); if(out)out.textContent=(amount*fxRateMYRSAR).toFixed(2);
}
function calculateCash(){
  const d=Number(document.getElementById("dailyCash")?.value||0), days=Number(document.getElementById("cashDays")?.value||0);
  const el=document.getElementById("cashTotal"); if(el)el.textContent=`Estimated cash: SAR ${(d*days).toLocaleString("id-ID")}`;
}
document.addEventListener("DOMContentLoaded",()=>{renderExchange();renderShopping();loadFxRate();});

// ---------------- GOLD COIN SAVINGS ----------------
let goldSaved = 12850000;
let goldTarget = 18900000;
const GOLD_COIN_VALUE = 500000;

function renderGoldCoins(){
  const grid=document.getElementById("coinGrid");
  const label=document.getElementById("coinCountLabel");
  const more=document.getElementById("coinMore");
  if(!grid)return;

  const coins=Math.floor(goldSaved/GOLD_COIN_VALUE);
  const remainder=goldSaved%GOLD_COIN_VALUE;
  grid.innerHTML="";
  const visible=Math.min(coins,36);
  for(let i=0;i<visible;i++){
    const c=document.createElement("div");
    c.className="gold-coin";
    c.innerHTML="<span>🪙</span><small>Rp 500.000</small>";
    c.title=`Gold coin ${i+1}`;
    grid.appendChild(c);
  }
  if(coins>visible) more.textContent=`+ ${coins-visible} more coins`;
  else if(remainder>0) more.textContent=`Rp ${remainder.toLocaleString("id-ID")} saved towards the next coin`;
  else more.textContent="Every coin represents another Rp 500.000 saved.";
  label.textContent=`${coins} coin${coins===1?"":"s"} collected`;
}

function updateGoldSummary(){
  const target=Math.max(1,Number(document.getElementById("goldTarget")?.value||18900000));
  goldTarget=target;
  const monthly=Math.max(1,Number(document.getElementById("goldMonthly")?.value||750));
  const gap=Math.max(0,target-goldSaved);
  const months=Math.ceil(gap/monthly);
  const pct=Math.min(100,(goldSaved/target)*100);
  const remaining=Math.max(0,target-goldSaved);

  const total=document.getElementById("goldTotal");
  if(total)total.textContent=`Rp ${goldSaved.toLocaleString("id-ID")}`;
  const grams=document.getElementById("goldGrams");
  if(grams)grams.textContent=`≈ ${(goldSaved/573.66).toFixed(1)}g gold accumulated`;
  const pctEl=document.getElementById("goldPercent");
  if(pctEl)pctEl.textContent=`${Math.round(pct)}%`;
  const bar=document.getElementById("goldProgressBar");
  if(bar)bar.style.width=`${pct}%`;
  const remain=document.getElementById("goldRemaining");
  if(remain)remain.textContent=remaining>0?`Rp ${remaining.toLocaleString("id-ID")} remaining`:"🎉 Pilgrimage goal reached!";
  const goal=document.getElementById("goldGoalLabel");
  if(goal)goal.textContent=`Rp ${target.toLocaleString("id-ID")}`;
  const milestone=document.getElementById("milestoneGoal");
  if(milestone)milestone.textContent=`Rp ${target.toLocaleString("id-ID")}`;
  const note=document.getElementById("goldJourneyNote");
  if(note)note.textContent=gap>0?`At Rp${monthly.toLocaleString("id-ID")}/month, you need approximately ${months} month${months===1?"":"s"} to close the remaining gap.`:"Your current savings have reached the selected pilgrimage goal.";
  renderGoldCoins();
}

function calculateGoldJourney(){
  updateGoldSummary();
  toast("Your gold savings journey has been updated");
}

function addGoldSaving(){
  const input=document.getElementById("goldAddAmount");
  const amount=Math.max(0,Number(input?.value||0));
  if(!amount){toast("Enter a saving amount first");return;}
  goldSaved+=amount;
  updateGoldSummary();
  const msg=document.getElementById("goldAddMessage");
  if(msg)msg.textContent=`Rp ${amount.toLocaleString("id-ID")} added. Your gold journey now shows ${Math.floor(goldSaved/GOLD_COIN_VALUE)} visual coins.`;
  toast(`Rp ${amount.toLocaleString("id-ID")} added to Gold Savings`);
}

document.addEventListener("DOMContentLoaded",()=>{
  updateGoldSummary();
});

// ---------------- CONSOLIDATED NAVIGATION CONTROLLER ----------------
(function(){
  function activatePage(pageId){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(b=>b.classList.remove("active"));

    const page=document.getElementById(pageId);
    const button=document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if(page)page.classList.add("active");
    if(button)button.classList.add("active");

    window.scrollTo({top:0,behavior:"smooth"});
  }

  document.addEventListener("click",(e)=>{
    const btn=e.target.closest(".nav-item");
    if(!btn)return;
    e.preventDefault();
    activatePage(btn.dataset.page);
  });

  window.showPage=function(pageId){ activatePage(pageId); };

  document.addEventListener("DOMContentLoaded",()=>{
    const active=document.querySelector(".nav-item.active");
    activatePage(active?.dataset.page || "dashboard");
  });
})();

// ---------------- ENHANCED VR ACADEMY ----------------
if (window.AFRAME) {
  AFRAME.registerComponent("ritual-walker", {
    schema: {
      mode: {type:"string", default:"tawaf"},
      radius: {type:"number", default:5.2},
      speed: {type:"number", default:.00016},
      offset: {type:"number", default:0},
      lateral: {type:"number", default:0}
    },
    init:function(){
      this.start=performance.now();
      this.el.classList.add("generated-pilgrim");
      this.buildAvatar();
    },
    buildAvatar:function(){
      const root=this.el;
      // Male learner: simple, respectful white ihram-style drape for ritual simulation.
      const body=document.createElement("a-entity");
      body.setAttribute("position","0 0 0");
      body.innerHTML=`
        <a-cylinder class="pilgrim-body" position="0 .82 0" radius=".32" height="1.25" color="#f7f4eb"></a-cylinder>
        <a-box position="0 .94 .08" width=".72" height=".20" depth=".54" color="#fffdf7"></a-box>
        <a-sphere class="pilgrim-head" position="0 1.62 0" radius=".27" color="#b78364"></a-sphere>
        <a-cylinder class="pilgrim-leg leg-left" position="-.16 .12 0" radius=".075" height=".48" color="#a9a49a"></a-cylinder>
        <a-cylinder class="pilgrim-leg leg-right" position=".16 .12 0" radius=".075" height=".48" color="#a9a49a"></a-cylinder>
        <a-cylinder class="pilgrim-arm arm-left" position="-.43 1.03 0" radius=".065" height=".62" color="#b78364" rotation="0 0 -18"></a-cylinder>
        <a-cylinder class="pilgrim-arm arm-right" position=".43 1.03 0" radius=".065" height=".62" color="#b78364" rotation="0 0 18"></a-cylinder>
        <a-text class="avatar-label" value="LEARNER" color="#173343" width="2.6" position="0 2.12 0" align="center"></a-text>
        <a-ring position="0 .035 0" rotation="-90 0 0" radius-inner=".45" radius-outer=".54" color="#d8b24f"></a-ring>
      `;
      body.setAttribute("scale","1.22 1.22 1.22");
      root.appendChild(body);
    },
    tick:function(time){
      const t=(time-this.start)*this.data.speed+this.data.offset;
      let x=0,z=0,rot=0;

      if(this.data.mode==="tawaf"){
        // Counter-clockwise around the Kaaba: x=cos(t), z=sin(t).
        const r=this.data.radius;
        x=Math.cos(t)*r; z=Math.sin(t)*r;
        rot=(-t + Math.PI/2);
      }else if(this.data.mode==="saie"){
        // Seven one-way passes: Safa(-10) -> Marwah(+10) = pass 1;
        // reverse = pass 2; final pass 7 ends at Marwah.
        const span=20;
        const cycle=t%(7);
        const leg=Math.floor(cycle);
        const p=cycle-leg;
        const forward=(leg%2===0);
        x=forward ? -10 + p*span : 10 - p*span;
        z=this.data.lateral || 0;
        rot=forward ? Math.PI/2 : -Math.PI/2;

        // Men jog in the green-marker zone; otherwise walk.
        const jogging=(x>-2 && x<2);
        const body=root.querySelector(".pilgrim-body");
        if(body) body.setAttribute("scale", jogging ? "1.02 1.02 1.02" : "1 1 1");
      }else{
        // Ihram: a visible guided walk between four learning stations.
        // The learner pauses briefly at each station, then advances to the next.
        const xs=[-7,-2.35,2.35,7];
        const cycle=t%4;
        const station=Math.floor(cycle);
        const p=cycle-station;
        const cur=xs[station];
        const next=xs[(station+1)%4];
        const eased=p*p*(3-2*p);
        x=cur+(next-cur)*eased;
        z=0.15;
        rot=(next>cur)?Math.PI/2:-Math.PI/2;

        const body=root.querySelector(".pilgrim-body")?.parentElement;
        const swing=Math.sin(time*.012)*18;
        const leftArm=root.querySelector(".arm-left");
        const rightArm=root.querySelector(".arm-right");
        const leftLeg=root.querySelector(".leg-left");
        const rightLeg=root.querySelector(".leg-right");
        if(leftArm)leftArm.setAttribute("rotation",`0 0 ${-18+swing}`);
        if(rightArm)rightArm.setAttribute("rotation",`0 0 ${18-swing}`);
        if(leftLeg)leftLeg.setAttribute("rotation",`0 0 ${swing*.45}`);
        if(rightLeg)rightLeg.setAttribute("rotation",`0 0 ${-swing*.45}`);
        if(body){
          const bounce=1+Math.sin(time*.018)*.018;
          body.object3D.scale.set(1.22,bounce*1.22,1.22);
        }
      }

      root.object3D.position.set(x,.1,z);
      root.object3D.rotation.y=rot;
    }
  });
}


let devotionalMode="talbiyah";
let devotionalSpeaking=false;
const devotionalText={
  talbiyah:{
    title:"Talbiyah",
    subtitle:"Guided recitation · tap to listen",
    arabic:"لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    rate:.78
  },
  selawat:{
    title:"Selawat",
    subtitle:"Salawat reminder · tap to listen",
    arabic:"اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    rate:.72
  }
};

function setDevotional(mode,button){
  devotionalMode=mode;
  document.querySelectorAll(".audio-choice").forEach(b=>b.classList.remove("active"));
  if(button)button.classList.add("active");
  const d=devotionalText[mode];
  const title=document.getElementById("audioTitle");
  const subtitle=document.getElementById("audioSubtitle");
  if(title)title.textContent=d.title;
  if(subtitle)subtitle.textContent=d.subtitle;
  if(devotionalSpeaking)stopDevotionalAudio();
}

function playDevotionalAudio(){
  if(!("speechSynthesis" in window)){
    toast("Your browser does not support voice playback. Add a licensed audio recording to the prototype.");
    return;
  }
  window.speechSynthesis.cancel();
  const d=devotionalText[devotionalMode];
  const u=new SpeechSynthesisUtterance(d.arabic);
  u.lang="ar-SA";
  u.rate=d.rate;
  u.pitch=.9;
  u.volume=1;
  devotionalSpeaking=true;
  u.onend=()=>{devotionalSpeaking=false;};
  u.onerror=()=>{devotionalSpeaking=false;};
  window.speechSynthesis.speak(u);
  toast(`${d.title} playback started`);
}

function stopDevotionalAudio(){
  if("speechSynthesis" in window)window.speechSynthesis.cancel();
  devotionalSpeaking=false;
  toast("Recitation stopped");
}

function setVRScene(sceneName){
  const title=document.getElementById("vrSceneTitle");
  const tawafWorld=document.getElementById("tawafWorld");
  const saieWorld=document.getElementById("saieWorld");
  const ihramWorld=document.getElementById("ihramWorld");
  const learnerT=document.getElementById("learnerAvatar");
  const learnerS=document.getElementById("learnerAvatarSaie");
  const learnerI=document.getElementById("learnerAvatarIhram");
  const lessonMode=document.getElementById("vrLessonMode");
  const lessonText=document.getElementById("vrLessonText");
  const accuracy=document.getElementById("vrAccuracyText");
  const label=document.getElementById("vrStepLabel");
  const number=document.getElementById("vrRoundNumber");
  const camera=document.getElementById("academyCamera");

  [tawafWorld,saieWorld,ihramWorld].forEach(e=>e&&e.setAttribute("visible","false"));
  [learnerT,learnerS,learnerI].forEach(e=>e&&e.setAttribute("visible","false"));

  if(sceneName==="saie"){
    title.textContent="Sa'i (Walking between Safa and Marwah) Training Environment";
    saieWorld?.setAttribute("visible","true");
    learnerS?.setAttribute("visible","true");
    if(learnerS)learnerS.setAttribute("ritual-walker","mode: saie; speed: .00010; offset: 0; lateral: 0");
    label.textContent="Sa'i (Walking between Safa and Marwah) Pass";
    number.textContent="1 / 7";
    lessonMode.textContent="GUIDED SA'I PRACTICE";
    lessonText.textContent="Start at Safa. Follow the learner to Marwah, then return to Safa. The seventh pass ends at Marwah.";
    accuracy.textContent="Sa'i (Walking between Safa and Marwah): 7 passes — Safa → Marwah is 1; Marwah → Safa is 2; final pass ends at Marwah. Men jog only in the marked green section.";
    camera.setAttribute("position","-8 1.65 5.8");
    camera.setAttribute("rotation","0 90 0");
  }else if(sceneName==="ihram"){
    title.textContent="Ihram & Miqat Preparation Environment";
    ihramWorld?.setAttribute("visible","true");
    learnerI?.setAttribute("visible","true");
    if(learnerI)learnerI.setAttribute("ritual-walker","mode: ihram; speed: .000055; offset: 0");
    label.textContent="Miqat";
    number.textContent="PREP";
    lessonMode.textContent="IHRAM + MIQAT PRACTICE";
    lessonText.textContent="Prepare, understand the garments, identify your applicable Miqat, then enter Ihram with intention and Talbiyah.";
    accuracy.textContent="Accuracy: Ihram is the sacred state. The applicable Miqat must be observed; do not cross it intending Umrah without entering Ihram.";
    camera.setAttribute("position","-10 2.0 6.8");
    camera.setAttribute("rotation","0 0 0");
    const companion=document.getElementById("ihramCompanion");
    companion?.setAttribute("visible","true");
    focusIhramStage(1);
  }else{
    title.textContent="Tawaf Training Environment";
    tawafWorld?.setAttribute("visible","true");
    learnerT?.setAttribute("visible","true");
    if(learnerT)learnerT.setAttribute("ritual-walker","mode: tawaf; radius: 5.2; speed: .00016; offset: 0");
    label.textContent="Tawaf Round";
    number.textContent=`${vrRound} / 7`;
    lessonMode.textContent="GUIDED TAWAF PRACTICE";
    lessonText.textContent="Begin at the Black Stone, keep the Kaaba on your left and move counter-clockwise for seven rounds.";
    accuracy.textContent="Tawaf: 7 counter-clockwise rounds; start and end at alignment with the Black Stone. Allahu Akbar is said when aligned.";
    camera.setAttribute("position","8 1.65 8");
    camera.setAttribute("rotation","0 45 0");
  }
}
document.addEventListener("DOMContentLoaded",()=>{
  setTimeout(()=>setVRScene("tawaf"),300);
});

// ---------------- SELECTED MALE TALBIYAH RECORDING ----------------
const selectedTalbiyahUrl = "https://www.youtube.com/embed/R1jUKQh7Xic?autoplay=1&rel=0&modestbranding=1";

function playSelectedTalbiyah(){
  const wrap=document.getElementById("talbiyahPlayerWrap");
  const player=document.getElementById("talbiyahPlayer");
  if(!wrap || !player)return;
  player.src=selectedTalbiyahUrl;
  wrap.hidden=false;
  toast("Selected Talbiyah recording started");
}
function stopSelectedTalbiyah(){
  const wrap=document.getElementById("talbiyahPlayerWrap");
  const player=document.getElementById("talbiyahPlayer");
  if(player)player.src="";
  if(wrap)wrap.hidden=true;
  toast("Talbiyah recording stopped");
}

// ---------------- PILGRIM PACKING GUIDE ----------------
const packingBase = {
  universal:[
    ["Travel documents","Passport, visa/entry documents, travel itinerary, accommodation details and digital copies.",1,"documents"],
    ["Nusuk / permit details","Keep current Nusuk information and required permits accessible.",1,"documents"],
    ["Medication","Daily medicines in sufficient quantity, plus copies/prescriptions where appropriate.",1,"health"],
    ["Health supplies","Basic personal health supplies appropriate to your needs.",1,"health"],
    ["Unscented toiletries","Personal-care products suitable for Ihram; avoid fragranced products while in Ihram.",1,"ihram"],
    ["Comfortable walking shoes","Comfortable footwear for substantial walking during the journey.",1,"clothing"],
    ["Anti-slip socks","Useful for comfort and walking; pack several pairs.",1,"clothing"],
    ["Hand sanitiser","Small travel-size bottles.",2,"health"],
    ["Face masks","Useful for crowded environments according to your needs and current guidance.",5,"health"],
    ["Sunscreen","Choose a product appropriate for your needs and follow Ihram restrictions.",1,"health"],
    ["Umbrella","Compact sun/rain umbrella.",1,"travel"],
    ["Phone charger","Charger plus a suitable power bank if permitted by airline/operator.",1,"electronics"],
    ["Small day bag","For essentials during daily movement.",1,"travel"],
    ["Refillable water bottle","Use where permitted and follow current Haram guidance.",1,"travel"],
    ["Laundry bag","Separate worn clothing during a 10-day journey.",1,"travel"],
    ["Travel-size first-aid kit","Plasters and basic personal supplies.",1,"health"]
  ],
  maleUmrah:[
    ["Ihram set","Two unstitched ihram cloths (izar + rida).",2,"ihram"],
    ["Ihram belt / money belt","For securing the izar and carrying small essentials.",1,"ihram"],
    ["Ihram-safe sandals","Comfortable footwear suitable for Ihram and walking.",1,"ihram"],
    ["Modest regular outfits","Lightweight everyday clothes for before/after Ihram.",4,"clothing"],
    ["Underwear","Pack according to your laundry plan.",6,"clothing"],
    ["Extra socks","For non-Ihram periods and hotel use.",4,"clothing"]
  ],
  femaleUmrah:[
    ["Modest travel outfits","Loose, comfortable clothing suitable for travel and worship.",5,"clothing"],
    ["Hijab / scarf","Breathable scarves for daily use.",5,"clothing"],
    ["Prayer garment / telekung","Optional personal prayer garment if preferred.",1,"clothing"],
    ["Long robe / abaya","A lightweight outer robe for travel and daily movement.",2,"clothing"],
    ["Inner caps","Optional head coverings for scarf comfort.",3,"clothing"],
    ["Socks","Comfortable socks for daily use.",6,"clothing"],
    ["Comfortable closed footwear","Practical walking footwear for travel and daily movement.",1,"clothing"],
    ["Note: women's Ihram clothing","There is no specific Ihram garment for women; wear permissible, modest clothing. Avoid niqab and gloves while in Ihram.",1,"ihram"]
  ],
  maleHajj:[
    ["Hajj Ihram set","Two unstitched ihram cloths (izar + rida), plus a spare set.",2,"ihram"],
    ["Ihram belt / money belt","For securing the izar and carrying small essentials.",1,"ihram"],
    ["Ihram-safe sandals","Comfortable footwear for Ihram and walking.",1,"ihram"],
    ["Lightweight regular outfits","For periods outside Ihram according to your Hajj programme.",5,"clothing"],
    ["Small Mina/Arafat day bag","Use only what your operator permits for the tent areas.",1,"hajj"],
    ["Operator-provided Hajj items","Check the exact list supplied by your licensed Hajj operator before departure.",1,"hajj"]
  ],
  femaleHajj:[
    ["Modest travel outfits","Loose, comfortable clothing suitable for the full Hajj programme.",6,"clothing"],
    ["Hijab / scarf","Breathable scarves for daily use.",6,"clothing"],
    ["Prayer garment / telekung","Optional personal prayer garment if preferred.",1,"clothing"],
    ["Long robe / abaya","Lightweight outer robes for travel and worship.",2,"clothing"],
    ["Socks","Comfortable socks for daily use.",7,"clothing"],
    ["Comfortable walking footwear","Practical footwear for long walking days.",1,"clothing"],
    ["Hajj programme kit","Pack only items specifically required by your licensed operator.",1,"hajj"]
  ]
};

const packingDayPlan = [
  ["Day 1","Departure & arrival","Documents, charger, medication, comfortable travel clothes"],
  ["Day 2","Makkah / Madinah orientation","Day bag, walking shoes, hydration and daily essentials"],
  ["Day 3","Pilgrimage learning","VR Academy practice, checklist review and Ihram preparation"],
  ["Day 4","Umrah / worship day","Ihram items for men; modest clothing and scarf for women"],
  ["Day 5","Makkah worship","Comfortable footwear, health supplies and personal essentials"],
  ["Day 6","Rest / ziyarat / free time","Light clothing, day bag and travel documents"],
  ["Day 7","Madinah / Makkah transition","Documents, charger, medication and comfortable footwear"],
  ["Day 8","Ziyarat & worship","Scarf/robe or regular modest clothing according to profile"],
  ["Day 9","Final worship & shopping","Day bag, currency/ID and packing organisation"],
  ["Day 10","Departure","Passport, documents, charger, medication and final luggage check"]
];

function packingItems(type,gender,days){
  const key=(gender==="male"?"male":"female")+(type==="hajj"?"Hajj":"Umrah");
  const items=[...packingBase.universal,...(packingBase[key]||[])];
  const multiplier=Math.max(1,Math.ceil(Number(days)/10));
  return items.map((it,i)=>{
    let qty=it[2];
    if(["clothing"].includes(it[3]) && Number(days)>10) qty=Math.ceil(qty*Number(days)/10);
    return {id:`${type}-${gender}-${i}-${it[0]}`,name:it[0],detail:it[1],qty,cat:it[3]};
  });
}

function packingIcon(cat){
  return ({documents:"🪪",health:"💊",ihram:"🕋",clothing:"👕",travel:"🎒",electronics:"🔌",hajj:"⛺"}[cat]||"✓");
}

function renderPackingGuide(){
  const type=document.getElementById("packingType")?.value||"umrah";
  const gender=document.getElementById("packingGender")?.value||"male";
  const days=Number(document.getElementById("packingDays")?.value||10);
  const grid=document.getElementById("packingGrid");
  if(!grid)return;

  const items=packingItems(type,gender,days);
  const saved=JSON.parse(localStorage.getItem("iharamPacking")||"{}");
  grid.innerHTML=items.map(item=>{
    const checked=!!saved[item.id];
    return `<label class="packing-item ${checked?"checked":""}">
      <input type="checkbox" ${checked?"checked":""} onchange="togglePackingItem('${item.id}',this.checked)">
      <span class="packing-check">${checked?"✓":""}</span>
      <span class="packing-item-icon">${packingIcon(item.cat)}</span>
      <span class="packing-item-content"><strong>${item.name}</strong><small>${item.detail}</small></span>
      <b class="packing-qty">×${item.qty}</b>
    </label>`;
  }).join("");

  const note=document.getElementById("hajjPackingNote");
  if(note)note.hidden=type!=="hajj";
  renderPackingProgress(items);
}

function togglePackingItem(id,checked){
  const saved=JSON.parse(localStorage.getItem("iharamPacking")||"{}");
  if(checked)saved[id]=true; else delete saved[id];
  localStorage.setItem("iharamPacking",JSON.stringify(saved));
  renderPackingGuide();
}

function renderPackingProgress(items){
  const saved=JSON.parse(localStorage.getItem("iharamPacking")||"{}");
  const total=items.length;
  const done=items.filter(x=>saved[x.id]).length;
  const pct=total?Math.round(done/total*100):0;
  const c=document.getElementById("packingCount"), t=document.getElementById("packingTotal"), p=document.getElementById("packingPercent"), bar=document.getElementById("packingProgress");
  if(c)c.textContent=done;if(t)t.textContent=total;if(p)p.textContent=pct+"%";if(bar)bar.style.width=pct+"%";
  const note=document.getElementById("packingNote");
  if(note)note.textContent=pct===100?"Everything on this checklist is marked packed. Review your operator and airline requirements before departure.":"Tick items as you place them in your luggage.";
}

function resetPackingChecklist(){
  localStorage.removeItem("iharamPacking");
  renderPackingGuide();
}

document.addEventListener("DOMContentLoaded",()=>setTimeout(renderPackingGuide,200));

// ---------------- PILGRIM PROFILE + SAFEJOURNEY ----------------
function editProfile(){ toast("Profile editor opened — demo mode"); }
function editHealth(){ toast("Health profile editor opened — demo mode"); }
function uploadDemoDocument(){ toast("Document upload is available in the production workflow — demo mode"); }

function detectPilgrimLocation(){
  if(!navigator.geolocation){ toast("Location is not supported by this browser."); return; }
  toast("Requesting location permission…");
  navigator.geolocation.getCurrentPosition(
    pos=>{
      const lat=pos.coords.latitude.toFixed(5), lon=pos.coords.longitude.toFixed(5);
      const place=document.getElementById("locationPlace"), coords=document.getElementById("locationCoords");
      if(place)place.textContent="Your current location";
      if(coords)coords.textContent=`GPS ${lat}, ${lon} · Accuracy ±${Math.round(pos.coords.accuracy)} m`;
      const pin=document.querySelector(".user-pin");
      if(pin)pin.classList.add("live");
      toast("Location detected. Demo map updated.");
    },
    err=>toast("Location permission was not granted. You can still use the hotel and emergency guidance."),
    {enableHighAccuracy:true,timeout:8000,maximumAge:30000}
  );
}
function activateLostMode(){
  const card=document.getElementById("locationPlace");
  if(card)card.textContent="SafeJourney assistance active";
  toast("🆘 Lost mode: location + hotel route + group contacts are ready.");
  const map=document.getElementById("safeMap");
  if(map)map.classList.add("lost-active");
}
function routeToHotel(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(()=>{
      window.open("https://www.google.com/maps/dir/?api=1&destination=Makkah+Clock+Royal+Tower+Hotel,+Makkah,+Saudi+Arabia&travelmode=walking","_blank");
    },()=>{
      window.open("https://www.google.com/maps/search/?api=1&query=Makkah+Clock+Royal+Tower+Hotel","_blank");
    });
  } else {
    window.open("https://www.google.com/maps/search/?api=1&query=Makkah+Clock+Royal+Tower+Hotel","_blank");
  }
}
function showNearby(type){
  const q=type==="Transport"?"transport near Masjid al-Haram Makkah":type==="Health"?"hospital near Masjid al-Haram Makkah":"shopping near Masjid al-Haram Makkah";
  window.open("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q),"_blank");
}

// ---------------- PILGRIM PROFILE MENU ----------------
function switchProfileTab(name, button){
  document.querySelectorAll(".profile-menu-tabs button").forEach(b=>b.classList.remove("active"));
  if(button)button.classList.add("active");
  document.querySelectorAll(".profile-section").forEach(s=>s.classList.remove("active"));
  const target=document.getElementById("profile-"+name);
  if(target)target.classList.add("active");
  if(target)target.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function scrollToProfileSection(name){
  switchProfileTab(name, document.querySelector(`#profileTabs button:nth-child(${name==="personal"?1:name==="passport"?2:name==="health"?3:name==="documents"?4:5})`));
}
function previewProfilePhoto(event){
  const file=event.target.files?.[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const url=e.target.result;
    const el=document.getElementById("profilePhotoPreview");
    if(el){el.style.backgroundImage=`url("${url}")`;el.textContent="";}
    document.querySelectorAll(".passport-photo-mini").forEach(p=>{
      p.classList.add("photo-filled");
      p.innerHTML=`<img src="${url}" alt="Pilgrim passport photo">`;
    });
    toast("Profile and passport photo updated");
  };
  reader.readAsDataURL(file);
}

// Sidebar grouping: support legacy page names without changing the visual information architecture.
document.addEventListener("DOMContentLoaded",()=>{
  const aliases = {
    journey:"journey-planner",
    packing:"packing-guide",
    haramain:"haramain-smart-journey",
    gold:"gold-savings",
    takaful:"travel-takaful",
    budget:"smart-budget",
    visa:"visa-route",
    packages:"verified-packages",
    nusuk:"nusuk-hub",
    live:"live-makkah"
  };
  document.querySelectorAll(".sidebar .nav-item").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const target = btn.dataset.page;
      const real = document.getElementById(target) || document.getElementById(aliases[target]);
      if(real){
        document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
        real.classList.add("active");
      }
    });
  });
});

/* FINAL SIDEBAR ROUTER */
(function(){
  const aliases = {
    dashboard:["dashboard","home"],
    ai:["ai","assistant","ai-assistant"],
    profile:["profile"],
    safety:["safety","safejourney"],
    journey:["journey","journey-planner","planner"],
    academy:["academy","vr-academy"],
    packing:["packing","packing-guide","pilgrim-packing"],
    haramain:["haramain","haramain-smart-journey"],
    gold:["gold","gold-savings"],
    takaful:["takaful","travel-takaful"],
    budget:["budget","smart-budget"],
    visa:["visa","visa-route","visa-route-planner"],
    packages:["packages","verified-packages"],
    nusuk:["nusuk","nusuk-hub"],
    money:["money","money-shopping","shopping"],
    live:["live","live-makkah","live-makkah-madinah"],
    arabic:["arabic","arabic-conversation"],
    quran:["quran","e-quran"]
  };

  function findPage(key){
    const ids = aliases[key] || [key];
    for(const id of ids){
      const el = document.getElementById(id);
      if(el) return el;
    }
    return null;
  }

  function activatePage(key, btn){
    const target = findPage(key);
    if(!target) return false;

    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active","show"));
    target.classList.add("active","show");

    document.querySelectorAll(".sidebar .nav-item").forEach(b=>b.classList.remove("active"));
    if(btn) btn.classList.add("active");

    window.scrollTo({top:0,behavior:"smooth"});
    return true;
  }

  document.addEventListener("click", function(e){
    const btn = e.target.closest(".sidebar .nav-item");
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();
    activatePage(btn.dataset.page, btn);
  }, true);

  document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll(".sidebar .nav-item").forEach(btn=>{
      btn.addEventListener("click", function(e){
        e.preventDefault();
        activatePage(this.dataset.page,this);
      });
    });
    const initial = document.querySelector(".sidebar .nav-item[data-page='dashboard']");
    if(initial) activatePage("dashboard",initial);
  });
})();


let HARAMAIN360LoggedIn=false;
function handleLogin(event){
  event.preventDefault();
  const id=document.getElementById("loginId")?.value.trim();
  const pw=document.getElementById("loginPassword")?.value;
  if(id==="HARAMAIN360001" && pw==="Umrah2026"){
    HARAMAIN360LoggedIn=true;
    document.body.classList.add("logged-in");
    document.getElementById("loginScreen")?.classList.add("login-hidden");
    toast("Assalamualaikum, selamat datang di HARAMAIN360");
    setTimeout(()=>showPage("dashboard"),80);
  }else{
    toast("Akun demo: HARAMAIN360001 / Umrah2026");
    document.getElementById("loginCard")?.classList.add("login-shake");
  }
}
/* Guest exhibition access: prototype-only, no real account or financial transaction. */
let HARAMAIN360GuestMode=false;
function enterGuestDemo(){
  HARAMAIN360GuestMode=true;
  HARAMAIN360LoggedIn=true;
  document.body.classList.add("logged-in","guest-demo-mode");
  document.getElementById("loginScreen")?.classList.add("login-hidden");
  try { sessionStorage.setItem("haramain360_guest_mode","1"); } catch(e) {}
  showPage("dashboard");
  if(typeof toast==="function") toast("Mode Tamu: Anda menggunakan data simulasi HARAMAIN360.");
}
function togglePassword(){
  const p=document.getElementById("loginPassword");
  if(p)p.type=p.type==="password"?"text":"password";
}

/* FINAL NAVIGATION BINDING */
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".sidebar .nav-item").forEach(btn=>{
    btn.onclick=(e)=>{e.preventDefault();showPage(btn.dataset.page);};
  });
  document.querySelector(".nav-item[data-page='dashboard']")?.classList.add("active");
});

function calculateRestoredGold(){
  const target=Number(document.getElementById("restoreGoldTarget")?.value)||18900000;
  const monthly=Number(document.getElementById("restoreGoldMonthly")?.value)||750;
  const current=12850;
  const months=Math.max(0,Math.ceil((target-current)/Math.max(monthly,1)));
  const el=document.getElementById("restoreGoldResult");
  if(el) el.textContent=`At Rp${monthly.toLocaleString("id-ID")}/month, you need approximately ${months} months to close the remaining gap.`;
}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".sidebar .nav-item").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      e.preventDefault();
      e.stopPropagation();
      showPage(btn.dataset.page);
    });
  });
});

const HARAMAIN360Hotels = [{"name": "Fairmont Makkah Clock Royal Tower", "city": "Makkah", "stars": "5\u2605", "distance": "0.2 km", "price": "SAR 900\u20131,800", "feature": "Kaaba / Haram view", "url": "https://www.fairmont.com/makkah/"}, {"name": "Raffles Makkah Palace", "city": "Makkah", "stars": "5\u2605", "distance": "0.2 km", "price": "SAR 1,000\u20132,200", "feature": "All-suite \u00b7 Haram view", "url": "https://www.raffles.com/makkah/"}, {"name": "Swiss\u00f4tel Makkah", "city": "Makkah", "stars": "5\u2605", "distance": "0.3 km", "price": "SAR 650\u20131,300", "feature": "Clock Towers \u00b7 Haram access", "url": "https://all.accor.com/hotel/A5B9/index.en.shtml"}, {"name": "Swiss\u00f4tel Al Maqam Makkah", "city": "Makkah", "stars": "5\u2605", "distance": "0.3 km", "price": "SAR 600\u20131,250", "feature": "Clock Towers \u00b7 Haram access", "url": "https://all.accor.com/hotel/A7X4/index.en.shtml"}, {"name": "Pullman Zamzam Makkah", "city": "Makkah", "stars": "5\u2605", "distance": "0.3 km", "price": "SAR 550\u20131,100", "feature": "Near Haram \u00b7 family rooms", "url": "https://all.accor.com/hotel/6036/index.en.shtml"}, {"name": "Hilton Suites Jabal Omar Makkah", "city": "Makkah", "stars": "5\u2605", "distance": "0.5 km", "price": "SAR 580\u20131,050", "feature": "Jabal Omar \u00b7 family friendly", "url": "https://www.hilton.com/en/hotels/mkghihi-hilton-suites-jabal-omar-makkah/"}, {"name": "Conrad Jabal Omar Makkah", "city": "Makkah", "stars": "5\u2605", "distance": "0.5 km", "price": "SAR 640\u20131,200", "feature": "Jabal Omar \u00b7 Haram access", "url": "https://www.hilton.com/en/hotels/mkkjocn-conrad-makkah/"}, {"name": "Jabal Omar Marriott Hotel, Makkah", "city": "Makkah", "stars": "5\u2605", "distance": "0.5 km", "price": "SAR 500\u2013900", "feature": "~3-min walk to Grand Mosque", "url": "https://www.marriott.com/en-us/hotels/qcamc-jabal-omar-marriott-hotel-makkah/overview/"}, {"name": "Hilton Hotel & Convention Jabal Omar", "city": "Makkah", "stars": "5\u2605", "distance": "0.6 km", "price": "SAR 440\u2013900", "feature": "Jabal Omar \u00b7 business/family", "url": "https://www.hilton.com/en/hotels/mkghohi-hilton-makkah-convention-hotel/"}, {"name": "Sheraton Makkah Jabal Al Kaaba", "city": "Makkah", "stars": "4\u2605", "distance": "0.7 km", "price": "SAR 440\u2013850", "feature": "Jabal Al Kaaba \u00b7 value luxury", "url": "https://www.marriott.com/en-us/hotels/jedsi-sheraton-makkah-jabal-al-kaaba-hotel/overview/"}, {"name": "Pullman Zamzam Madina", "city": "Madinah", "stars": "5\u2605", "distance": "0.2 km", "price": "SAR 450\u2013850", "feature": "Adjacent to Al-Masjid an-Nabawi", "url": "https://all.accor.com/hotel/9245/index.en.shtml"}, {"name": "Anwar Al Madinah M\u00f6venpick", "city": "Madinah", "stars": "5\u2605", "distance": "0.3 km", "price": "SAR 400\u2013800", "feature": "Central \u00b7 near Prophet's Mosque", "url": "https://all.accor.com/hotel/6490/index.en.shtml"}, {"name": "Dar Al Taqwa Hotel", "city": "Madinah", "stars": "5\u2605", "distance": "0.2 km", "price": "SAR 500\u2013950", "feature": "Directly near Haram plaza", "url": "https://www.daraltaqwa.com/"}, {"name": "Madinah Hilton", "city": "Madinah", "stars": "5\u2605", "distance": "0.2 km", "price": "SAR 450\u2013900", "feature": "Central \u00b7 Haram access", "url": "https://www.hilton.com/en/hotels/medhitw-madinah-hilton/"}, {"name": "Shahd Al Madinah Hotel", "city": "Madinah", "stars": "5\u2605", "distance": "0.4 km", "price": "SAR 350\u2013750", "feature": "Central Madinah \u00b7 family rooms", "url": "https://www.shahdalmadinah.com/"}, {"name": "The Oberoi Madina", "city": "Madinah", "stars": "5\u2605", "distance": "0.2 km", "price": "SAR 700\u20131,400", "feature": "Premium \u00b7 Haram-facing", "url": "https://www.oberoihotels.com/hotels-in-madinah/"}, {"name": "Taiba Madinah Hotel", "city": "Madinah", "stars": "5\u2605", "distance": "0.5 km", "price": "SAR 300\u2013650", "feature": "Central \u00b7 family friendly", "url": "https://www.taibahmadinah.com/"}, {"name": "Crowne Plaza Madinah", "city": "Madinah", "stars": "5\u2605", "distance": "0.7 km", "price": "SAR 350\u2013750", "feature": "Central \u00b7 shuttle/transport access", "url": "https://www.ihg.com/crowneplaza/hotels/us/en/madinah/medpl/hoteldetail"}, {"name": "Le M\u00e9ridien Medina", "city": "Madinah", "stars": "5\u2605", "distance": "4.5 km", "price": "SAR 300\u2013650", "feature": "Complimentary shuttle to Nabawi", "url": "https://www.marriott.com/en-us/hotels/medmd-le-meridien-medina/overview/"}, {"name": "InterContinental Dar Al Iman Madinah", "city": "Madinah", "stars": "5\u2605", "distance": "0.2 km", "price": "SAR 500\u20131,000", "feature": "Premium \u00b7 central Haram zone", "url": "https://www.ihg.com/intercontinental/hotels/us/en/madinah/medha/hoteldetail"}];
function switchDestination(city,btn){
  document.querySelectorAll(".destination-tabs button").forEach(x=>x.classList.remove("active"));
  if(btn) btn.classList.add("active");
  document.querySelectorAll(".destination-section").forEach(x=>x.classList.remove("active"));
  document.getElementById("dest-"+city)?.classList.add("active");
}
function filterHotels(city,q){
  const section=document.getElementById("dest-"+city);
  if(!section)return;
  const query=(q||"").toLowerCase();
  section.querySelectorAll(".hotel-card").forEach(card=>card.style.display=card.dataset.name.includes(query)?"":"none");
}
function hotelDetails(i){
  const h=HARAMAIN360Hotels[i];
  if(!h)return;
  const existing=document.getElementById("hotelDetailModal");
  if(existing) existing.remove();
  const modal=document.createElement("div");
  modal.id="hotelDetailModal"; modal.className="hotel-modal";
  modal.innerHTML=`<div class="hotel-modal-inner">
    <button class="modal-close" onclick="document.getElementById('hotelDetailModal').remove()">×</button>
    <span class="eyebrow">${h.city} · HOTEL PROFILE</span>
    <h2>${h.name}</h2>
    <div class="hotel-detail-grid">
      <div><b>⭐ Rating class</b><span>${h.stars}</span></div>
      <div><b>📍 Distance</b><span>${h.distance} from main mosque</span></div>
      <div><b>💰 Indicative rate</b><span>${h.price} / night</span></div>
      <div><b>🛏️ Best for</b><span>${h.feature}</span></div>
    </div>
    <p>Hotel rates are date-dependent. The production HARAMAIN360 platform should retrieve availability, room type, taxes and cancellation terms from a live hotel/booking partner.</p>
    <a class="modal-official" href="${h.url}" target="_blank" rel="noopener">Open official hotel information ↗</a>
  </div>`;
  document.body.appendChild(modal);
}
function selectAllZiy(city){
  document.querySelectorAll(`[data-ziy="${city}"]`).forEach(x=>x.checked=true);
}
function buildZiyRoute(){
  const selected=[...document.querySelectorAll(".ziy-card input:checked")].map(x=>x.parentElement.innerText.split("\n")[0]).filter(Boolean);
  const out=document.getElementById("ziyRouteOutput");
  if(!out)return;
  if(!selected.length){out.innerHTML="<b>Your Smart Ziyarat Route</b><span>Please select at least one place.</span>";return;}
  out.innerHTML=`<b>Your Smart Ziyarat Route</b><span>${selected.length} places selected</span><div class="route-chips">${selected.map((x,i)=>`<em>${i+1}. ${x}</em>`).join("")}</div><small>HARAMAIN360 AI can optimise this sequence in production using live traffic, prayer times, opening/visit conditions, mobility needs and hotel location.</small>`;
}

/* ===== TOP USER / PROFILE ACCOUNT ===== */
function toggleProfileMenu(event){
  if(event) event.stopPropagation();
  const menu=document.getElementById("profileDropdown");
  const btn=document.getElementById("topUserButton");
  if(!menu)return;
  const opening=menu.hidden;
  menu.hidden=!opening;
  if(btn)btn.setAttribute("aria-expanded",String(opening));
}
function closeProfileMenu(){
  const menu=document.getElementById("profileDropdown");
  const btn=document.getElementById("topUserButton");
  if(menu)menu.hidden=true;
  if(btn)btn.setAttribute("aria-expanded","false");
}
function openProfileSettings(tab="profile"){
  closeProfileMenu();
  const modal=document.getElementById("profileSettingsModal");
  if(!modal)return;
  modal.hidden=false;
  switchProfileTab(tab);
}
function closeProfileSettings(){
  const modal=document.getElementById("profileSettingsModal");
  if(modal)modal.hidden=true;
}
function switchProfileTab(tab){
  document.querySelectorAll(".profile-panel").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll("[data-profile-tab]").forEach(x=>x.classList.remove("active"));
  const panel=document.getElementById("profileTab"+tab.charAt(0).toUpperCase()+tab.slice(1));
  if(panel)panel.classList.add("active");
  const tabBtn=document.querySelector(`[data-profile-tab="${tab}"]`);
  if(tabBtn)tabBtn.classList.add("active");
  const title=document.getElementById("profileModalTitle");
  if(title)title.textContent=tab==="security"?"Change Password":tab==="documents"?"Passport & Documents":"Pilgrim Profile";
}
function saveProfile(event){
  event.preventDefault();
  const name=document.getElementById("profileFullName")?.value.trim()||"Haneffa";
  const email=document.getElementById("profileEmail")?.value.trim()||"";
  document.querySelectorAll(".top-user-text b").forEach(x=>x.textContent=name);
  try{localStorage.setItem("iharam_profile_name",name);localStorage.setItem("iharam_profile_email",email)}catch(e){}
  toast("Profile updated successfully.");
}
function changePassword(event){
  event.preventDefault();
  const current=document.getElementById("currentPassword")?.value||"";
  const next=document.getElementById("newPassword")?.value||"";
  const confirm=document.getElementById("confirmPassword")?.value||"";
  if(!current||!next||!confirm){toast("Please complete all password fields.");return}
  if(next.length<8){toast("New password must contain at least 8 characters.");return}
  if(next!==confirm){toast("New passwords do not match.");return}
  try{localStorage.setItem("iharam_demo_password",next)}catch(e){}
  event.target.reset();
  toast("Password updated successfully.");
}
function togglePasswordField(id,btn){
  const input=document.getElementById(id);
  if(!input)return;
  input.type=input.type==="password"?"text":"password";
  btn.textContent=input.type==="password"?"Show":"Hide";
}
function toggleNotifications(event){
  if(event)event.stopPropagation();
  toast("No new pilgrimage notifications.");
}
function demoLogout(){
  closeProfileMenu();
  HARAMAIN360GuestMode=false;
  HARAMAIN360LoggedIn=false;
  try { sessionStorage.removeItem("haramain360_guest_mode"); } catch(e) {}
  document.body.classList.remove("logged-in","guest-demo-mode");
  const login=document.getElementById("loginScreen");
  if(login){login.classList.remove("login-hidden");login.hidden=false}
  toast("Signed out of the demo account.");
}
document.addEventListener("click",function(e){
  const area=document.querySelector(".top-user-area");
  if(area && !area.contains(e.target))closeProfileMenu();
});
document.addEventListener("DOMContentLoaded",function(){
  try{
    const saved=localStorage.getItem("iharam_profile_name");
    if(saved)document.querySelectorAll(".top-user-text b").forEach(x=>x.textContent=saved);
  }catch(e){}
});

/* ===== TOP LEFT HOME / BREADCRUMB BUTTON ===== */
document.addEventListener("DOMContentLoaded",function(){
  const home=document.querySelector(".top-home-button");
  if(home){
    home.addEventListener("click",function(e){
      e.preventDefault();
      closeProfileMenu();
      closeProfileSettings();
      showPage("dashboard");
    });
  }
});

function forceHaneffaPhoto(){
  document.querySelectorAll(".top-avatar").forEach(function(el){
    const small=el.classList.contains("small");
    el.innerHTML='<img src="./assets/pilgrim-profile-photo.jpg" alt="Haneffa profile photo">';
  });
  document.querySelectorAll(".profile-avatar-large").forEach(function(el){
    el.innerHTML='<img src="./assets/pilgrim-profile-photo.jpg" alt="Haneffa profile photo">';
  });
}
document.addEventListener("DOMContentLoaded", forceHaneffaPhoto);

/* ===== HARAMAIN HOTEL LOCATION MAP ===== */
function selectHotelOnMap(index){
  const h=typeof HARAMAIN360Hotels!=="undefined" ? HARAMAIN360Hotels[index] : null;
  if(!h)return;
  document.querySelectorAll(".hotel-map-marker").forEach(x=>x.classList.remove("selected"));
  document.querySelectorAll(`[data-hotel-map="${index}"]`).forEach(x=>x.classList.add("selected"));
  const distance=(h.distance||"—").replace(" from main mosque","");
  const walking={
    "0.2 km":"3–4 min walk","0.3 km":"4–5 min walk","0.4 km":"5–6 min walk",
    "0.5 km":"6–8 min walk","0.6 km":"8–10 min walk","0.7 km":"9–12 min walk",
    "4.5 km":"55–65 min by foot"
  }[distance] || "Route varies";
  const target = h.city==="Makkah"
    ? document.getElementById("selectedHotelMapInfo")
    : document.getElementById("selectedMadinahHotelMapInfo");
  if(!target)return;
  target.innerHTML=`
    <span class="eyebrow">${h.city} · SELECTED HOTEL</span>
    <h3>${h.name}</h3>
    <div class="map-detail-line"><strong>📍</strong><div><b>Distance to mosque</b><span>${h.distance}</span></div></div>
    <div class="map-detail-line"><strong>🚶</strong><div><b>Estimated walk</b><span>${walking}</span></div></div>
    <div class="map-detail-line"><strong>💰</strong><div><b>Indicative rate</b><span>${h.price}/night</span></div></div>
    <button class="map-route-btn" onclick="toast('Route selected: ${h.name} → ${h.city==="Makkah"?"Masjid al-Haram":"Al-Masjid an-Nabawi"}')">Plan route →</button>
  `;
}



/* ===== UNIFIED MAKKAH + MADINAH HOTEL MAP ===== */
function setHaramainMap(city){
  const makkah=document.getElementById("unifiedMakkahMap");
  const madinah=document.getElementById("unifiedMadinahMap");
  const title=document.getElementById("unifiedMapTitle");
  const subtitle=document.getElementById("unifiedMapSubtitle");
  const info=document.getElementById("unifiedInfoTitle");
  if(!makkah || !madinah)return;
  const isMakkah=city==="makkah";
  makkah.hidden=!isMakkah;
  madinah.hidden=isMakkah;
  title.textContent=isMakkah ? "Hotels near Masjid al-Haram" : "Hotels near Al-Masjid an-Nabawi";
  subtitle.textContent=isMakkah
    ? "Makkah hotel locations, distance to Masjid al-Haram and estimated walking time."
    : "Madinah hotel locations, distance to Al-Masjid an-Nabawi and estimated walking time.";
  info.textContent=isMakkah ? "Hotel-to-Haram distance" : "Hotel-to-Masjid distance";
  document.querySelectorAll(".city-map-tab").forEach(function(tab){
    const active=tab.getAttribute("data-city-map")===city;
    tab.classList.toggle("active",active);
    tab.setAttribute("aria-selected",active ? "true" : "false");
  });
}
document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll(".city-map-tab").forEach(function(tab){
    tab.addEventListener("click",function(){
      setHaramainMap(tab.getAttribute("data-city-map"));
    });
  });
  document.querySelectorAll("[data-unified-hotel]").forEach(function(marker){
    marker.addEventListener("click",function(){
      const index=Number(marker.getAttribute("data-unified-hotel"));
      const h=typeof HARAMAIN360Hotels!=="undefined" ? HARAMAIN360Hotels[index] : null;
      if(!h)return;
      document.querySelectorAll("[data-unified-hotel]").forEach(x=>x.classList.remove("selected"));
      marker.classList.add("selected");
      const target=document.getElementById("unifiedMapInfo");
      const distance=h.distance || "—";
      const walking={
        "0.2 km":"3–4 min walk","0.3 km":"4–5 min walk","0.4 km":"5–6 min walk",
        "0.5 km":"6–8 min walk","0.6 km":"8–10 min walk","0.7 km":"9–12 min walk"
      }[distance] || "Route varies";
      target.innerHTML='<span class="eyebrow">'+h.city+' · SELECTED HOTEL</span>'+
        '<h3>'+h.name+'</h3>'+
        '<div class="map-detail-line"><strong>📍</strong><div><b>Distance to mosque</b><span>'+distance+'</span></div></div>'+
        '<div class="map-detail-line"><strong>🚶</strong><div><b>Estimated walk</b><span>'+walking+'</span></div></div>'+
        '<div class="map-detail-line"><strong>💰</strong><div><b>Indicative rate</b><span>'+h.price+'/night</span></div></div>'+
        '<button class="map-route-btn" type="button" onclick="toast(\'Route selected\')">Plan route →</button>';
    });
  });
  setHaramainMap("makkah");
});

/* ===== VERIFIED PACKAGE MARKETPLACE ===== */
const verifiedPackageData=[{"company": "Andalusia Travel & Tours Sdn Bhd", "licence": "KPL/LN 1050", "package": "Umrah Transit Sharjah", "duration": "12H/10M", "price": "Rp 6.390.000", "flight": "Air Arabia · 4-person room", "hotel": "Makkah 780m–1km · Madinah 180–315m", "type": "umrah"}, {"company": "Glocal Travel & Tours Sdn Bhd", "licence": "KPL 6917", "package": "Umrah Mampu Milik", "duration": "12H/10M", "price": "Rp 6.990.000", "flight": "AMAL by Malaysia Airlines · Quad", "hotel": "Makkah ±350m · Madinah ±120m", "type": "umrah"}, {"company": "Nuh Travel & Tours Sdn Bhd", "licence": "KPL/LN 9555", "package": "Umrah Menara Jam Dubai City", "duration": "9H/7M", "price": "Rp 8.390.000", "flight": "Package fare shown by provider", "hotel": "Makkah + Madinah", "type": "umrah"}, {"company": "KRS Travel Sdn Bhd", "licence": "KPL/LN 3590", "package": "Umrah Mandhi", "duration": "12H/10M", "price": "Rp 8.250.000", "flight": "Direct flight · Quad", "hotel": "Makkah 350m · Madinah 80m", "type": "umrah"}, {"company": "MKM Ticketing Travel & Tours Sdn Bhd", "licence": "KPL/LN 6666", "package": "Pakej Mawaddah", "duration": "12H/10M", "price": "Rp 8.990.000", "flight": "2026 departure · from", "hotel": "Makkah + Madinah", "type": "umrah"}, {"company": "Qamarun Travel & Tours Sdn Bhd", "licence": "KPL/LN 10770", "package": "Umrah Ekonomi Eksklusif", "duration": "12H", "price": "Rp 4.340.000", "flight": "3★ · package listing", "hotel": "Makkah + Madinah", "type": "umrah"}, {"company": "Qamarun Travel & Tours Sdn Bhd", "licence": "KPL/LN 10770", "package": "Umrah Keluarga", "duration": "12H", "price": "Rp 5.780.000", "flight": "4★ · family package", "hotel": "Makkah + Madinah", "type": "umrah"}, {"company": "Qamarun Travel & Tours Sdn Bhd", "licence": "KPL/LN 10770", "package": "Umrah VIP Eksklusif", "duration": "12H", "price": "Rp 12.010.000", "flight": "5★ · VIP", "hotel": "Fairmont Makkah · Ritz-Carlton Madinah", "type": "umrah"}, {"company": "Mahabbaten Travel & Tours Sdn Bhd", "licence": "KPL/LN 6607", "package": "Umrah VIP", "duration": "14 Days", "price": "Rp 10.820.000", "flight": "5★ · from", "hotel": "Raffles Makkah · Ritz-Carlton Madinah", "type": "umrah"}, {"company": "Zahafiz Travel & Tours", "licence": "KPL/LN 3557", "package": "Umrah Hijaz", "duration": "12H/10M", "price": "Rp 7.990.000", "flight": "Quad · advertised fare", "hotel": "Makkah 260–300m · Madinah 200–250m", "type": "umrah"}, {"company": "Rehlah International Travel & Tours Sdn Bhd", "licence": "KPL/LN 9703", "package": "Haji Ajwa", "duration": "30–45 Days", "price": "Rp 47.990.000", "flight": "PI Awal · 6-person room", "hotel": "Makkah + Madinah + Aziziyah", "type": "hajj"}, {"company": "Rehlah International Travel & Tours Sdn Bhd", "licence": "KPL/LN 9703", "package": "Haji Sultan", "duration": "30–45 Days", "price": "Rp 52.990.000", "flight": "PI Awal · 5-person room", "hotel": "Makkah + Madinah + Aziziyah", "type": "hajj"}, {"company": "Rasnur Travel & Tours Sdn Bhd", "licence": "KPL/LN 11122", "package": "Umrah Ekonomi", "duration": "12H/10M", "price": "Price on latest advert", "flight": "Package listing available", "hotel": "Makkah + Madinah", "type": "umrah"}, {"company": "Glocal Travel & Tours Sdn Bhd", "licence": "KPL 6917", "package": "Umrah Azka", "duration": "10H/8M", "price": "Rp 7.690.000", "flight": "Saudia · Quad", "hotel": "Makkah ±200m · Madinah ±120m", "type": "umrah"}, {"company": "Glocal Travel & Tours Sdn Bhd", "licence": "KPL 6917", "package": "Umrah Elaf Kinda", "duration": "12H/10M", "price": "Rp 8.890.000", "flight": "Saudia · Quad", "hotel": "Makkah ±100m · Madinah ±120m", "type": "umrah"}];
function openPackageDetails(i){
  const p=verifiedPackageData[i]; if(!p)return;
  toast(p.company+" · "+p.package+" selected");
  const saving=document.getElementById("targetInput");
  if(saving && p.price.startsWith("RM")){
    const n=Number(p.price.replace(/[^0-9.]/g,""));
    if(n){ saving.value=n; }
  }
}
function openMotacVerification(){
  window.open("https://www.motac.gov.my/en/kategori-semakan-new/list-of-umrah-advertisement-approvals/","_blank","noopener");
}
function filterPackages(){
  const q=(document.getElementById("packageSearch")?.value||"").toLowerCase();
  const type=document.getElementById("typeFilter")?.value||"all";
  document.querySelectorAll("#packageGrid .verified-package-card").forEach(card=>{
    const matchText=card.textContent.toLowerCase().includes(q);
    const matchType=type==="all" || card.dataset.type===type;
    card.style.display=(matchText&&matchType)?"":"none";
  });
}
function sortVerifiedPackages(){
  const grid=document.getElementById("packageGrid"); if(!grid)return;
  const cards=[...grid.querySelectorAll(".verified-package-card")];
  const mode=document.getElementById("packageSort")?.value||"recommended";
  const priceOf=el=>{
    const t=el.querySelector(".verified-price strong")?.textContent||"";
    const n=parseFloat(t.replace(/[^0-9.]/g,"")); return Number.isFinite(n)?n:999999;
  };
  if(mode==="low")cards.sort((a,b)=>priceOf(a)-priceOf(b));
  else if(mode==="high")cards.sort((a,b)=>priceOf(b)-priceOf(a));
  cards.forEach(c=>grid.appendChild(c));
}

/* ===== VERIFIED PACKAGES NAVIGATION FIX ===== */
function openVerifiedPackages(){
  try {
    if (typeof closeProfileMenu === "function") closeProfileMenu();
    if (typeof closeProfileSettings === "function") closeProfileSettings();
    showPage("packages");
  } catch(e) {
    const target=document.getElementById("marketplace");
    if(target){
      document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
      target.classList.add("active");
      document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page==="packages"));
      const title=document.getElementById("pageTitle");
      if(title) title.textContent="Verified Packages";
      window.scrollTo({top:0,behavior:"smooth"});
    }
  }
}

document.addEventListener("click", function(e){
  const el=e.target.closest(".nav-item[data-page='packages'], [data-open-packages], .open-packages-btn");
  if(el){
    e.preventDefault();
    e.stopPropagation();
    openVerifiedPackages();
    return false;
  }
});
document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll(".nav-item[data-page='packages'], [data-open-packages], .open-packages-btn").forEach(function(el){
    el.setAttribute("role","button");
    el.style.cursor="pointer";
  });
});

/* ===== VERIFIED PACKAGE COMPANY LOGOS ===== */
(function(){
  const logoMap = {
    "Andalusia Travel & Tours Sdn Bhd":"AT",
    "Glocal Travel & Tours Sdn Bhd":"GT",
    "Nuh Travel & Tours Sdn Bhd":"NT",
    "KRS Travel Sdn Bhd":"KRS",
    "MKM Ticketing Travel & Tours Sdn Bhd":"MKM",
    "Qamarun Travel & Tours Sdn Bhd":"QT",
    "Mahabbaten Travel & Tours Sdn Bhd":"MT",
    "Zahafiz Travel & Tours Sdn Bhd":"ZT",
    "Rehlah International Travel & Tours Sdn Bhd":"RI",
    "Rasnur Travel & Tours Sdn Bhd":"RT"
  };
  function applyCompanyLogos(){
    document.querySelectorAll(".package-card, .package, .package-item, [class*='package-card']").forEach(card=>{
      const text=card.textContent||"";
      const company=Object.keys(logoMap).find(k=>text.includes(k));
      if(!company)return;
      let logo=card.querySelector(".company-logo");
      if(!logo){
        const heading=Array.from(card.querySelectorAll("h1,h2,h3,h4,strong,b,p,span")).find(el=>el.textContent.trim()===company);
        if(heading){
          logo=document.createElement("div");
          logo.className="company-logo";
          heading.parentElement.insertBefore(logo, heading);
        }
      }
      if(logo){
        logo.textContent=logoMap[company];
        logo.title=company;
        logo.setAttribute("aria-label", company+" logo");
      }
    });
  }
  document.addEventListener("DOMContentLoaded", applyCompanyLogos);
  window.applyCompanyLogos=applyCompanyLogos;
})();

/* ===== MOTAC VERIFICATION BUTTON — WORKING DEMO ===== */
function verifyPackage(button){
  const card=button.closest(".package-card, .package, .package-item, [class*='package-card']");
  const text=card ? (card.textContent||"") : "";
  const match=text.match(/MOTAC:\s*([A-Z0-9\-\/]+)/i);
  const licence=match ? match[1] : "MOTAC record";
  const companyMatch=Object.keys({
    "Andalusia Travel & Tours Sdn Bhd":1,"Glocal Travel & Tours Sdn Bhd":1,
    "Nuh Travel & Tours Sdn Bhd":1,"KRS Travel Sdn Bhd":1,
    "MKM Ticketing Travel & Tours Sdn Bhd":1,"Qamarun Travel & Tours Sdn Bhd":1,
    "Mahabbaten Travel & Tours Sdn Bhd":1,"Zahafiz Travel & Tours Sdn Bhd":1,
    "Rehlah International Travel & Tours Sdn Bhd":1,"Rasnur Travel & Tours Sdn Bhd":1
  }).find(k=>text.includes(k));
  const company=companyMatch||"Travel operator";
  if(typeof showVerificationModal==="function"){ showVerificationModal(company, licence); return; }
  let modal=document.getElementById("motacVerifyModal");
  if(!modal){
    modal=document.createElement("div");
    modal.id="motacVerifyModal";
    modal.className="motac-modal";
    modal.innerHTML='<div class="motac-modal-card"><button class="motac-close" type="button" aria-label="Close">×</button><div class="motac-mark">✓</div><span class="eyebrow">MOTAC VERIFICATION</span><h2 id="motacCompany"></h2><p>This prototype records the operator as a MOTAC-verified provider. For production deployment, the button should query the current official MOTAC registry/API and display the live licence status.</p><div class="motac-record"><b>Licence / reference</b><span id="motacLicence"></span></div><div class="motac-status">✓ Verification checkpoint passed</div></div>';
    document.body.appendChild(modal);
    modal.querySelector(".motac-close").onclick=()=>modal.classList.remove("open");
    modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});
  }
  modal.querySelector("#motacCompany").textContent=company;
  modal.querySelector("#motacLicence").textContent=licence;
  modal.classList.add("open");
}
document.addEventListener("click",function(e){
  const b=e.target.closest(".motac-verify-btn, [data-verify-motac]");
  if(!b)return;
  e.preventDefault();
  e.stopPropagation();
  verifyPackage(b);
});

/* ===== FINAL PACKAGE CARD LOGOS + MOTAC BUTTON FIX ===== */
(function(){
  const companies = {
    "Andalusia Travel & Tours Sdn Bhd": {initials:"AT", domain:"umrahandalusia.com"},
    "Glocal Travel & Tours Sdn Bhd": {initials:"GT", domain:"glocal.com.my"},
    "Nuh Travel & Tours Sdn Bhd": {initials:"NT", domain:"nuhtravel.com.my"},
    "KRS Travel Sdn Bhd": {initials:"KRS", domain:"krstravel.com.my"},
    "MKM Ticketing Travel & Tours Sdn Bhd": {initials:"MKM", domain:"mkmticketing.com"},
    "Qamarun Travel & Tours Sdn Bhd": {initials:"QT", domain:"qamarun.com.my"},
    "Mahabbaten Travel & Tours Sdn Bhd": {initials:"MT", domain:"mahabbaten.com"},
    "Zahafiz Travel & Tours Sdn Bhd": {initials:"ZT", domain:"zahafiz.com"},
    "Rehlah International Travel & Tours Sdn Bhd": {initials:"RI", domain:"rehlahinternational.com.my"},
    "Rasnur Travel & Tours Sdn Bhd": {initials:"RT", domain:"rasnurtravel.com"}
  };

  function applyFinalPackageLogos(){
    document.querySelectorAll(".verified-package-card").forEach(card=>{
      const text=card.textContent||"";
      const company=Object.keys(companies).find(name=>text.includes(name));
      if(!company)return;
      const data=companies[company];
      const holder=card.querySelector(".company-logo");
      if(!holder)return;
      holder.innerHTML="";
      holder.setAttribute("title",company);
      holder.setAttribute("aria-label",company+" logo");
      const img=document.createElement("img");
      img.alt=company+" logo";
      img.loading="lazy";
      img.referrerPolicy="no-referrer";
      // Internet-enabled demo: retrieve the site's favicon/brand mark.
      img.src="https://www.google.com/s2/favicons?domain="+encodeURIComponent(data.domain)+"&sz=128";
      const fallback=document.createElement("span");
      fallback.textContent=data.initials;
      holder.appendChild(fallback);
      img.addEventListener("load",()=>{
        if(img.naturalWidth>0) {
          fallback.style.display="none";
          holder.insertBefore(img,holder.firstChild);
        }
      });
      img.addEventListener("error",()=>{ img.remove(); fallback.style.display="flex"; });
    });
  }

  function bindMotacButtons(){
    document.querySelectorAll(".verified-package-card .motac-badge, .verified-package-card .motac-verify-btn").forEach(button=>{
      button.type="button";
      button.dataset.verifyMotac="true";
      button.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        verifyPackage(this);
        return false;
      };
    });
  }

  document.addEventListener("DOMContentLoaded",()=>{
    applyFinalPackageLogos();
    bindMotacButtons();
  });
  window.applyFinalPackageLogos=applyFinalPackageLogos;
  window.bindMotacButtons=bindMotacButtons;
})();

/* Capture the actual badge class used by the marketplace cards. */
document.addEventListener("click",function(e){
  const button=e.target.closest(".verified-package-card .motac-badge, .verified-package-card .motac-verify-btn");
  if(!button)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  verifyPackage(button);
  return false;
}, true);


/* ===== DUAS + AL-MA'THURAT + HISNUL MUSLIM + QURAN RECITERS ===== */
const quranReciters = [
  {name:"Mishary Rashid Alafasy", short:"Mishary Alafasy", note:"Popular Quran reciter with a clear, measured style."},
  {name:"Abdul Rahman Al-Sudais", short:"Abdul Rahman Al-Sudais", note:"Well-known reciter associated with the Grand Mosque."},
  {name:"Maher Al-Muaiqly", short:"Maher Al-Muaiqly", note:"Known for a calm and clear recitation style."},
  {name:"Yasser Al-Dosari", short:"Yasser Al-Dosari", note:"Contemporary reciter with a distinctive melodic style."},
  {name:"Abdullah Awad Al-Juhany", short:"Abdullah Al-Juhany", note:"Recognised for a measured and expressive recitation."}
];

function openDuaRoutine(title){
  toast(title+" opened — connect the approved Arabic text/audio library in the production version.");
}
function renderReciters(){
  const list=document.getElementById("reciterList");
  if(!list)return;
  list.innerHTML="";
  quranReciters.forEach((r,i)=>{
    const b=document.createElement("button");
    b.type="button"; b.className="reciter-option"+(i===0?" selected":"");
    b.innerHTML='<span class="reciter-avatar">🎙️</span><span><b>'+r.short+'</b><small>'+r.note+'</small></span><span class="reciter-check">'+(i===0?"✓":"")+'</span>';
    b.onclick=function(){
      document.querySelectorAll(".reciter-option").forEach(x=>x.classList.remove("selected"));
      b.classList.add("selected");
      document.querySelectorAll(".reciter-check").forEach(x=>x.textContent="");
      b.querySelector(".reciter-check").textContent="✓";
      document.getElementById("selectedReciter").textContent=r.name;
      document.getElementById("reciterDescription").textContent=r.note;
    };
    list.appendChild(b);
  });
}
function playRecitation(){
  const name=document.getElementById("selectedReciter")?.textContent||"selected reciter";
  toast("Recitation selected: "+name+". Add your authorised audio stream in the production build.");
}
function stopRecitation(){ toast("Recitation stopped."); }

document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll(".duas-tab").forEach(tab=>{
    tab.addEventListener("click",function(){
      const key=this.dataset.duaTab;
      document.querySelectorAll(".duas-tab").forEach(t=>t.classList.toggle("active",t===this));
      document.querySelectorAll(".duas-panel").forEach(p=>{
        const active=p.id==="duas-"+key;
        p.hidden=!active;
        p.classList.toggle("active",active);
      });
      if(key==="quran") renderReciters();
    });
  });
  renderReciters();
});

/* ===== FINAL VERIFIED PACKAGES + DUAS NAVIGATION REPAIR ===== */
(function(){
  function goToVerifiedPackages(){
    document.querySelectorAll(".page").forEach(function(p){p.classList.remove("active");});
    var target=document.getElementById("marketplace");
    if(target) target.classList.add("active");
    document.querySelectorAll(".sidebar .nav-item").forEach(function(n){
      n.classList.toggle("active", n.getAttribute("data-page")==="packages");
    });
    var title=document.getElementById("pageTitle");
    if(title) title.textContent="Verified Packages";
    document.querySelector(".sidebar")?.classList.remove("open");
    window.scrollTo(0,0);
  }

  /* Capture phase wins over the old duplicated package listeners and inline
     onclick handlers. */
  document.addEventListener("click", function(e){
    var btn=e.target.closest(".nav-item[data-page='packages']");
    if(!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    goToVerifiedPackages();
  }, true);

  /* Make all existing package CTA buttons use the same target. */
  document.addEventListener("click", function(e){
    var btn=e.target.closest("[data-open-packages], .open-packages-btn");
    if(!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    goToVerifiedPackages();
  }, true);

  window.openVerifiedPackagesFixed=goToVerifiedPackages;
})();

/* ===== IHRAM DO'S & DON'TS — SIMPLE GAMIFICATION ===== */
(function(){
  const questions = [
    {
      category:"IHRAM BASICS",
      q:"Before crossing the Miqat for Umrah, what should a pilgrim do?",
      options:["Wait until reaching Makkah","Enter Ihram with intention before crossing the Miqat","Only change clothes after reaching the hotel","Skip the Talbiyah"],
      answer:1,
      why:"The pilgrim should enter Ihram and make the intention before crossing the applicable Miqat."
    },
    {
      category:"PERSONAL CARE",
      q:"Which should generally be avoided after entering Ihram?",
      options:["Perfume or fragranced products","Drinking water","Using an unscented soap when needed","Resting"],
      answer:0,
      why:"Perfume and fragranced products are among the things prohibited during Ihram."
    },
    {
      category:"GROOMING",
      q:"While in Ihram, which grooming action should be avoided?",
      options:["Washing with care","Cutting hair or trimming nails","Brushing teeth","Changing position while sleeping"],
      answer:1,
      why:"Removing hair and trimming nails are prohibited during Ihram."
    },
    {
      category:"MEN",
      q:"What is a key clothing rule for men in Ihram?",
      options:["Wear a stitched suit","Cover the head with a cap","Use the prescribed unstitched Ihram sheets and avoid covering the head","Wear any uniform"],
      answer:2,
      why:"Men normally use the izar and rida' and should not cover the head while in Ihram."
    },
    {
      category:"WOMEN",
      q:"Which statement is correct about women's Ihram clothing?",
      options:["Women must wear white only","Women must wear a special two-piece Ihram","Women can wear normal modest clothing; no special colour is required","Women must wear men's Ihram sheets"],
      answer:2,
      why:"Women do not have a special two-piece Ihram uniform and may wear normal modest clothing."
    },
    {
      category:"BEHAVIOUR",
      q:"What is the best approach if you are unsure whether an action is permitted?",
      options:["Guess","Copy another pilgrim","Ask a qualified scholar or authorised guide","Ignore the rule"],
      answer:2,
      why:"When in doubt, seek qualified guidance rather than guessing."
    },
    {
      category:"SPIRITUAL JOURNEY",
      q:"Which behaviour is encouraged during Ihram?",
      options:["Arguing with other pilgrims","Patience, remembrance and good manners","Pushing through crowds","Disturbing other pilgrims"],
      answer:1,
      why:"Pilgrims should maintain patience, remembrance, good manners and avoid harming others."
    },
    {
      category:"KNOWLEDGE CHECK",
      q:"Which statement is NOT a general Ihram prohibition?",
      options:["Using perfume after entering Ihram","Cutting nails","Drinking water","Cutting hair"],
      answer:2,
      why:"Drinking water is not prohibited simply because a person is in Ihram."
    }
  ];

  let index=0, score=0, answered=false;

  function render(){
    const q=questions[index];
    const qEl=document.getElementById("ihramQuizQuestion");
    const cat=document.getElementById("ihramQuizCategory");
    const opts=document.getElementById("ihramQuizOptions");
    const feedback=document.getElementById("ihramQuizFeedback");
    const next=document.getElementById("ihramNextBtn");
    const progress=document.getElementById("ihramQuizProgress");
    const bar=document.getElementById("ihramQuizBar");
    const points=document.getElementById("ihramQuizPoints");
    if(!qEl||!opts)return;

    answered=false;
    qEl.textContent=q.q;
    cat.textContent=q.category;
    feedback.textContent="";
    feedback.className="quiz-feedback";
    next.disabled=true;
    next.textContent=index===questions.length-1?"See my result →":"Next question →";
    progress.textContent=`Question ${index+1} of ${questions.length}`;
    bar.style.width=((index/questions.length)*100)+"%";
    points.textContent=`⭐ ${score} points`;
    opts.innerHTML=q.options.map((o,i)=>`<button type="button" class="quiz-option" onclick="answerIhramQuestion(${i})"><span>${String.fromCharCode(65+i)}</span>${o}</button>`).join("");
  }

  window.answerIhramQuestion=function(choice){
    if(answered)return;
    answered=true;
    const q=questions[index];
    const options=document.querySelectorAll("#ihramQuizOptions .quiz-option");
    options.forEach((b,i)=>{
      b.disabled=true;
      if(i===q.answer)b.classList.add("correct");
      if(i===choice && choice!==q.answer)b.classList.add("wrong");
    });
    const feedback=document.getElementById("ihramQuizFeedback");
    if(choice===q.answer){
      score++;
      feedback.className="quiz-feedback good";
      feedback.textContent="✓ Correct! "+q.why;
    }else{
      feedback.className="quiz-feedback bad";
      feedback.textContent="Not quite. "+q.why;
    }
    document.getElementById("ihramQuizPoints").textContent=`⭐ ${score} points`;
    document.getElementById("ihramNextBtn").disabled=false;
  };

  window.nextIhramQuestion=function(){
    if(!answered)return;
    if(index<questions.length-1){
      index++;
      render();
      document.getElementById("ihramQuizBar").style.width=((index/questions.length)*100)+"%";
    }else{
      const card=document.getElementById("ihramQuizCard");
      const result=document.getElementById("ihramQuizResult");
      if(card)card.hidden=true;
      if(result)result.hidden=false;
      document.getElementById("ihramQuizScore").textContent=`${score}/${questions.length}`;
      document.getElementById("ihramQuizBar").style.width="100%";
      const title=document.getElementById("ihramResultTitle");
      const text=document.getElementById("ihramResultText");
      const badge=document.getElementById("ihramQuizBadge");
      if(score===8){
        title.textContent="Ihram Master 🏆";
        text.textContent="Excellent! You got every question right. You are ready for the next learning step.";
        badge.textContent="Ihram Master";
      }else if(score>=6){
        title.textContent="Great preparation! 🌟";
        text.textContent=`You scored ${score}/8. Review the points you missed, then try the challenge again.`;
        badge.textContent="Well Prepared";
      }else if(score>=4){
        title.textContent="Good start! 👍";
        text.textContent=`You scored ${score}/8. A quick review of the Do's & Don'ts will strengthen your knowledge.`;
        badge.textContent="Keep Learning";
      }else{
        title.textContent="Let's practise again 💡";
        text.textContent=`You scored ${score}/8. Review the guide above and try again — learning is part of the journey.`;
        badge.textContent="Learning Journey";
      }
    }
  };

  window.restartIhramQuiz=function(){
    index=0; score=0; answered=false;
    document.getElementById("ihramQuizCard").hidden=false;
    document.getElementById("ihramQuizResult").hidden=true;
    document.getElementById("ihramQuizScore").textContent="0/8";
    document.getElementById("ihramQuizBadge").textContent="Start the challenge";
    render();
  };

  document.addEventListener("DOMContentLoaded",function(){
    if(document.getElementById("ihramQuizOptions"))render();
  });
})();

/* ===== iHARAM GOLDVR™ GLOBAL WEBSITE LANGUAGE SYSTEM ===== */
(function(){
  const siteLanguages = {
    id:{name:"Bahasa Indonesia",dir:"ltr"},
    ms:{name:"Bahasa Melayu",dir:"ltr"},
    en:{name:"English",dir:"ltr"},
    zh:{name:"中文",dir:"ltr"},
    ta:{name:"தமிழ்",dir:"ltr"},
    ar:{name:"العربية",dir:"rtl"}
  };

  const T = {
    "Learn & Prepare":{
      ms:"BELAJAR & PERSEDIAAN",en:"LEARN & PREPARE",zh:"学习与准备",ta:"கற்றல் & தயாரிப்பு",ar:"التعلّم والاستعداد"
    },
    "VR Academy":{
      ms:"Akademi VR",en:"VR Academy",zh:"VR 学院",ta:"VR அகாடமி",ar:"أكاديمية الواقع الافتراضي"
    },
    "Ihram Do's & Don'ts":{
      ms:"Do's & Don'ts Ihram",en:"Ihram Do's & Don'ts",zh:"受戒须知：应做与禁忌",ta:"இஹ்ராம் செய்ய வேண்டியவை & தவிர்க்க வேண்டியவை",ar:"آداب الإحرام: ما يجب وما يجب تجنّبه"
    },
    "Pilgrim Packing":{
      ms:"Panduan Bagasi Jemaah",en:"Pilgrim Packing",zh:"朝觐行李指南",ta:"யாத்திரிகர் பயணப் பொருள்",ar:"دليل تجهيز أمتعة الحاج"
    },
    "Haramain Smart Journey":{
      ms:"Perjalanan Pintar Haramain",en:"Haramain Smart Journey",zh:"两圣地智慧行程",ta:"ஹரமைன் ஸ்மார்ட் பயணம்",ar:"رحلة الحرمين الذكية"
    },
    "Duas":{
      ms:"Doa",en:"Duas",zh:"祈祷与记念",ta:"துஆக்கள்",ar:"الأدعية"
    },
    "Finance & Protection":{
      ms:"KEWANGAN & PERLINDUNGAN",en:"FINANCE & PROTECTION",zh:"财务与保障",ta:"நிதி & பாதுகாப்பு",ar:"التمويل والحماية"
    },
    "Gold Savings":{
      ms:"Simpanan Emas",en:"Gold Savings",zh:"黄金储蓄",ta:"தங்கச் சேமிப்பு",ar:"الادخار بالذهب"
    },
    "Travel Takaful":{
      ms:"Takaful Perjalanan",en:"Travel Takaful",zh:"旅行回教保险",ta:"பயண தகாஃபுல்",ar:"تكافل السفر"
    },
    "Smart Budget":{
      ms:"Bajet Pintar",en:"Smart Budget",zh:"智能预算",ta:"ஸ்மார்ட் பட்ஜெட்",ar:"الميزانية الذكية"
    },
    "Dashboard":{
      ms:"Papan Pemuka",en:"Dashboard",zh:"仪表板",ta:"டாஷ்போர்டு",ar:"لوحة التحكم"
    },
    "AI Assistant":{
      ms:"Pembantu AI",en:"AI Assistant",zh:"AI 助手",ta:"AI உதவியாளர்",ar:"مساعد الذكاء الاصطناعي"
    },
    "Pilgrim Profile":{
      ms:"Profil Jemaah",en:"Pilgrim Profile",zh:"朝觐者档案",ta:"யாத்திரிகர் சுயவிவரம்",ar:"ملف الحاج"
    },
    "SafeJourney":{
      ms:"SafeJourney",en:"SafeJourney",zh:"安全旅程",ta:"பாதுகாப்பான பயணம்",ar:"رحلة آمنة"
    },
    "Journey Planner":{
      ms:"Perancang Perjalanan",en:"Journey Planner",zh:"行程规划",ta:"பயணத் திட்டமிடுபவர்",ar:"مخطط الرحلة"
    },
    "Learn · Practise · Check":{
      ms:"BELAJAR · AMALI · SEMAK",en:"LEARN · PRACTISE · CHECK",zh:"学习 · 练习 · 检查",ta:"கற்று · பயிற்சி · சரிபார்",ar:"تعلّم · طبّق · تحقّق"
    },
    "Ihram Do's & Don'ts":{
      ms:"Do's & Don'ts Ihram",en:"Ihram Do's & Don'ts",zh:"受戒须知：应做与禁忌",ta:"இஹ்ராம் செய்ய வேண்டியவை & தவிர்க்க வேண்டியவை",ar:"آداب الإحرام: ما يجب وما يجب تجنّبه"
    },
    "Learn the key rules in a simple way, then test your knowledge with a short pilgrimage quiz.":{
      ms:"Pelajari peraturan utama dengan mudah, kemudian uji pengetahuan anda melalui kuiz ringkas.",en:"Learn the key rules in a simple way, then test your knowledge with a short pilgrimage quiz.",zh:"以简单方式学习主要规则，然后通过简短朝觐测验测试您的知识。",ta:"முக்கிய விதிகளை எளிமையாகக் கற்றுக்கொண்டு, குறுகிய வினாடி வினா மூலம் உங்கள் அறிவைச் சோதிக்கவும்.",ar:"تعلّم القواعد الأساسية بطريقة بسيطة، ثم اختبر معلوماتك من خلال اختبار قصير."
    },
    "Know what to do — and what to avoid.":{
      ms:"Ketahui perkara yang perlu dilakukan — dan perkara yang perlu dielakkan.",en:"Know what to do — and what to avoid.",zh:"了解应该做什么，以及应该避免什么。",ta:"எதைச் செய்ய வேண்டும் — எதைத் தவிர்க்க வேண்டும் என்பதை அறிந்து கொள்ளுங்கள்.",ar:"اعرف ما يجب فعله وما يجب تجنّبه."
    },
    "DO":{
      ms:"LAKUKAN",en:"DO",zh:"应做",ta:"செய்யவும்",ar:"افعل"
    },
    "During Ihram":{
      ms:"Semasa Ihram",en:"During Ihram",zh:"受戒期间",ta:"இஹ்ராமின் போது",ar:"أثناء الإحرام"
    },
    "DON'T":{
      ms:"JANGAN",en:"DON'T",zh:"禁忌",ta:"செய்ய வேண்டாம்",ar:"لا تفعل"
    },
    "Things to Avoid":{
      ms:"Perkara yang Perlu Dielakkan",en:"Things to Avoid",zh:"需要避免的事项",ta:"தவிர்க்க வேண்டியவை",ar:"أمور يجب تجنّبها"
    },
    "MEN":{
      ms:"LELAKI",en:"MEN",zh:"男性",ta:"ஆண்கள்",ar:"الرجال"
    },
    "Male Ihram":{
      ms:"Ihram Lelaki",en:"Male Ihram",zh:"男性受戒服",ta:"ஆண்களின் இஹ்ராம்",ar:"إحرام الرجال"
    },
    "WOMEN":{
      ms:"WANITA",en:"WOMEN",zh:"女性",ta:"பெண்கள்",ar:"النساء"
    },
    "Female Ihram":{
      ms:"Ihram Wanita",en:"Female Ihram",zh:"女性受戒",ta:"பெண்களின் இஹ்ராம்",ar:"إحرام النساء"
    },
    "REMEMBER":{
      ms:"INGAT",en:"REMEMBER",zh:"请记住",ta:"நினைவில் கொள்க",ar:"تذكّر"
    },
    "Simple rule":{
      ms:"Peraturan mudah",en:"Simple rule",zh:"简单规则",ta:"எளிய விதி",ar:"قاعدة بسيطة"
    },
    "GAMIFIED KNOWLEDGE CHECK":{
      ms:"🎮 UJIAN PENGETAHUAN BERGAMIFIKASI",en:"🎮 GAMIFIED KNOWLEDGE CHECK",zh:"🎮 游戏化知识测试",ta:"🎮 விளையாட்டு முறை அறிவுச் சோதனை",ar:"🎮 اختبار معرفي تفاعلي"
    },
    "Ihram Challenge":{
      ms:"Cabaran Ihram",en:"Ihram Challenge",zh:"受戒挑战",ta:"இஹ்ராம் சவால்",ar:"تحدّي الإحرام"
    },
    "8 quick questions. Choose an answer, get instant feedback and earn a badge.":{
      ms:"8 soalan ringkas. Pilih jawapan, dapatkan maklum balas segera dan raih lencana.",en:"8 quick questions. Choose an answer, get instant feedback and earn a badge.",zh:"8道快速题目。选择答案，立即获得反馈并赢取徽章。",ta:"8 விரைவான கேள்விகள். பதிலைத் தேர்ந்தெடுத்து உடனடி பின்னூட்டத்தையும் பதக்கத்தையும் பெறுங்கள்.",ar:"8 أسئلة سريعة. اختر الإجابة واحصل على ملاحظات فورية واربح شارة."
    },
    "Start the challenge":{
      ms:"Mulakan cabaran",en:"Start the challenge",zh:"开始挑战",ta:"சவாலைத் தொடங்குங்கள்",ar:"ابدأ التحدي"
    },
    "Next question →":{
      ms:"Soalan seterusnya →",en:"Next question →",zh:"下一题 →",ta:"அடுத்த கேள்வி →",ar:"السؤال التالي →"
    },
    "See my result →":{
      ms:"Lihat keputusan saya →",en:"See my result →",zh:"查看我的结果 →",ta:"என் முடிவைப் பார்க்க →",ar:"اعرض نتيجتي →"
    }
  };

  function translateTextNodes(lang){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const raw=node.nodeValue;
      const key=raw.trim();
      if(!key || !T[key] || !T[key][lang]) return;
      const leading=raw.match(/^\s*/)?.[0]||"";
      const trailing=raw.match(/\s*$/)?.[0]||"";
      node.nodeValue=leading+T[key][lang]+trailing;
    });
  }

  function updateSpecialElements(lang){
    const score=document.getElementById("ihramQuizScore");
    const badge=document.getElementById("ihramQuizBadge");
    const next=document.getElementById("ihramNextBtn");
    if(score && score.textContent==="0/8") score.textContent="0/8";
    if(badge && !badge.dataset.completed) badge.textContent=T["Start the challenge"][lang];
    if(next && !next.disabled) next.textContent=T["Next question →"][lang];
  }

  window.changeSiteLanguage=function(lang){
    if(!siteLanguages[lang]) lang="id";
    document.documentElement.lang=lang;
    document.documentElement.dir=siteLanguages[lang].dir;
    localStorage.setItem("HARAMAIN360SiteLanguage",lang);
    const select=document.getElementById("siteLanguage");
    if(select) select.value=lang;

    // Rebuild from the original English snapshot so switching languages back and forth
    // never creates a "translated translation".
    if(!window.__HARAMAIN360EnglishTextSnapshot){
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      window.__HARAMAIN360EnglishTextSnapshot=[];
      while(walker.nextNode()){
        window.__HARAMAIN360EnglishTextSnapshot.push([walker.currentNode,walker.currentNode.nodeValue]);
      }
    }
    window.__HARAMAIN360EnglishTextSnapshot.forEach(([node,text])=>{ if(node && node.parentNode) node.nodeValue=text; });
    translateTextNodes(lang);
    updateSpecialElements(lang);

    // Also synchronise the existing AI language selector when the selected language exists there.
    const ai=document.getElementById("aiLanguage");
    if(ai && ["id","en","ms","ar","zh"].includes(lang)) {
      ai.value=lang;
      if(typeof window.changeAILanguage==="function") window.changeAILanguage(lang);
    }
  };

  document.addEventListener("DOMContentLoaded",function(){
    const saved=localStorage.getItem("HARAMAIN360SiteLanguage")||"id";
    const select=document.getElementById("siteLanguage");
    if(select) select.value=saved;
    window.changeSiteLanguage(saved);
  });
})();

/* FINAL DUAS NAVIGATION SAFETY */
(function(){
  function openDuasPage(){
    document.querySelectorAll(".page").forEach(function(p){p.classList.remove("active");});
    var page=document.getElementById("spiritual");
    if(page) page.classList.add("active");
    document.querySelectorAll(".nav-item").forEach(function(n){
      n.classList.toggle("active", n.getAttribute("data-page")==="spiritual");
    });
    var title=document.getElementById("pageTitle");
    if(title) title.textContent="Duas";
    window.scrollTo(0,0);
  }
  document.addEventListener("click",function(e){
    var n=e.target.closest(".nav-item[data-page='spiritual']");
    if(!n)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openDuasPage();
  },true);
  window.openDuasPageFixed=openDuasPage;
})();


/* ===== ARABIC CONVERSATION COACH ===== */
const arabicPhrases = [
 {topic:"greeting", ar:"السَّلَامُ عَلَيْكُمْ", roman:"As-salāmu ʿalaykum", en:"Peace be upon you"},
 {topic:"greeting", ar:"وَعَلَيْكُمُ السَّلَامُ", roman:"Wa ʿalaykum as-salām", en:"And peace be upon you"},
 {topic:"greeting", ar:"شُكْرًا", roman:"Shukran", en:"Thank you"},
 {topic:"greeting", ar:"عَفْوًا", roman:"ʿAfwan", en:"You're welcome / Excuse me"},
 {topic:"haramain", ar:"أَيْنَ الْمَسْجِدُ الْحَرَامُ؟", roman:"Ayna al-Masjid al-Harām?", en:"Where is Masjid al-Haram?"},
 {topic:"haramain", ar:"أَيْنَ الْمَسْجِدُ النَّبَوِيُّ؟", roman:"Ayna al-Masjid an-Nabawī?", en:"Where is the Prophet's Mosque?"},
 {topic:"direction", ar:"أَيْنَ الْحَمَّامُ؟", roman:"Ayna al-hammām?", en:"Where is the toilet?"},
 {topic:"direction", ar:"مِنْ فَضْلِكَ، أَيْنَ هَذَا الْمَكَانُ؟", roman:"Min faḍlik, ayna hādhā al-makān?", en:"Please, where is this place?"},
 {topic:"hotel", ar:"أَيْنَ فُنْدُقِي؟", roman:"Ayna funduqī?", en:"Where is my hotel?"},
 {topic:"hotel", ar:"لَدَيَّ حَجْزٌ", roman:"Ladayya ḥajz", en:"I have a reservation"},
 {topic:"shopping", ar:"كَمْ هَذَا؟", roman:"Kam hādhā?", en:"How much is this?"},
 {topic:"shopping", ar:"هَلْ يُمْكِنُكَ خَفْضُ السِّعْرِ؟", roman:"Hal yumkinuka khafḍu as-siʿr?", en:"Can you lower the price?"},
 {topic:"transport", ar:"أُرِيدُ سَيَّارَةَ أُجْرَةٍ", roman:"Urīdu sayyārata ujrah", en:"I need a taxi"},
 {topic:"transport", ar:"إِلَى مَكَّانِ الْحَرَمِ، مِنْ فَضْلِكَ", roman:"Ilā makāni al-ḥaram, min faḍlik", en:"To the Haram, please"},
 {topic:"help", ar:"أَحْتَاجُ إِلَى الْمُسَاعَدَةِ", roman:"Aḥtāju ilā al-musāʿadah", en:"I need help"},
 {topic:"help", ar:"أَيْنَ أَقْرَبُ مُسْتَشْفًى؟", roman:"Ayna aqrabu mustashfā?", en:"Where is the nearest hospital?"}
];

const arabicScenarios={
 hotel:{
   coach:["مَرْحَبًا! هَلْ لَدَيْكَ حَجْزٌ؟","Marhaban! Hal ladayka ḥajz?","Hello! Do you have a reservation?"],
   replies:["نَعَمْ، لَدَيَّ حَجْزٌ","Naʿam, ladayya ḥajz","Yes, I have a reservation."]
 },
 taxi:{
   coach:["إِلَى أَيْنَ تُرِيدُ الذَّهَابَ؟","Ilā ayna turīdu adh-dhahāb?","Where would you like to go?"],
   replies:["أُرِيدُ الذَّهَابَ إِلَى الْحَرَمِ","Urīdu adh-dhahāba ilā al-ḥaram","I would like to go to the Haram."]
 },
 shopping:{
   coach:["مَاذَا تُرِيدُ أَنْ تَشْتَرِيَ؟","Mādhā turīdu an tashtariya?","What would you like to buy?"],
   replies:["كَمْ هَذَا؟","Kam hādhā?","How much is this?"]
 },
 haram:{
   coach:["هَلْ تَحْتَاجُ إِلَى مُسَاعَدَةٍ؟","Hal taḥtāju ilā musāʿadah?","Do you need help?"],
   replies:["نَعَمْ، أَيْنَ مَدْخَلُ الْحَرَمِ؟","Naʿam, ayna madkhal al-ḥaram?","Yes, where is the entrance to the Haram?"]
 }
};

let arabicPractised=0, arabicScenario="hotel";

function renderArabicPhrases(){
 const grid=document.getElementById("arabicPhraseGrid"), sel=document.getElementById("arabicTopic");
 if(!grid)return;
 const topic=sel?sel.value:"all";
 const list=topic==="all"?arabicPhrases:arabicPhrases.filter(p=>p.topic===topic);
 grid.innerHTML=list.map((p,i)=>`
   <div class="arabic-phrase" onclick="markArabicPhrase()">
     <div class="ar">${p.ar}</div>
     <div class="roman">${p.roman}</div>
     <div class="meaning">${p.en}</div>
     <button onclick="event.stopPropagation();speakArabic(${JSON.stringify(p.ar)})">🔊 Listen</button>
   </div>`).join("");
}
function markArabicPhrase(){
 arabicPractised=Math.min(arabicPhrases.length,arabicPractised+1);
 const el=document.getElementById("arabicProgress");
 if(el)el.textContent=`${arabicPractised} / ${arabicPhrases.length}`;
}
function speakArabic(text){
 if(!("speechSynthesis" in window)){toast("Arabic voice playback is not supported in this browser.");return;}
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);
 u.lang="ar-SA"; u.rate=.78; u.pitch=.95; u.volume=1;
 const voices=speechSynthesis.getVoices();
 const arVoice=voices.find(v=>/^ar(-|_)/i.test(v.lang));
 if(arVoice)u.voice=arVoice;
 u.onstart=()=>{const s=document.querySelector(".arabic-online");if(s)s.textContent="● Speaking";};
 u.onend=()=>{const s=document.querySelector(".arabic-online");if(s)s.textContent="● Ready";};
 speechSynthesis.speak(u);
}
function arabicBubble(ar,roman,en,who="coach"){
 const div=document.createElement("div");
 div.className=`arabic-bubble ${who}`;
 div.innerHTML=`<strong>${ar}</strong><span>${roman}</span><small>${en}</small>
 <button class="arabic-speak" data-text="${ar.replace(/"/g,"&quot;")}" onclick="speakArabic(this.dataset.text)">🔊 Listen</button>`;
 return div;
}
function setArabicScenario(key,btn){
 arabicScenario=key;
 document.querySelectorAll(".arabic-scenario").forEach(b=>b.classList.remove("active"));
 if(btn)btn.classList.add("active");
 const body=document.getElementById("arabicChatBody"); if(!body)return;
 const s=arabicScenarios[key];
 body.innerHTML="";
 body.appendChild(arabicBubble(s.coach[0],s.coach[1],s.coach[2],"coach"));
 body.scrollTop=body.scrollHeight;
}
function arabicQuickReply(text){
 const input=document.getElementById("arabicInput");
 if(input){input.value=text;sendArabicChat();}
}
function sendArabicChat(){
 const input=document.getElementById("arabicInput");
 const body=document.getElementById("arabicChatBody");
 if(!input||!body)return;
 const text=input.value.trim(); if(!text)return;
 const s=arabicScenarios[arabicScenario];
 const user=document.createElement("div");
 user.className="arabic-bubble user";
 user.innerHTML=`<small>${text}</small>`;
 body.appendChild(user);
 input.value="";
 const reply=s.replies[0];
 setTimeout(()=>{
   body.appendChild(arabicBubble(reply[0],reply[1],reply[2],"coach"));
   body.scrollTop=body.scrollHeight;
 },250);
}
function startArabicVoice(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){toast("Arabic voice input is not supported by this browser. Try Chrome or Edge.");return;}
 const btn=document.getElementById("arabicMicBtn");
 const rec=new SR();
 rec.lang="id-ID";
 rec.interimResults=false; rec.maxAlternatives=1;
 if(btn)btn.textContent="🔴";
 rec.onresult=e=>{
   const text=e.results[0][0].transcript;
   const input=document.getElementById("arabicInput");
   if(input){input.value=text;sendArabicChat();}
 };
 rec.onerror=()=>toast("Microphone input could not be captured. Please allow microphone access.");
 rec.onend=()=>{if(btn)btn.textContent="🎙️";};
 rec.start();
}
document.addEventListener("DOMContentLoaded",()=>renderArabicPhrases());

/* ===== ARABIC MENU HARD FIX =====
   Independent of the generic page-navigation controller.
*/
function openArabicConversation(event){
  if(event){
    event.preventDefault();
    event.stopPropagation();
  }
  const page=document.getElementById("arabic");
  if(!page){
    console.error("Arabic Conversation page was not found.");
    return false;
  }
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  page.classList.add("active");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.remove("active"));
  const btn=document.querySelector('.nav-item[data-page="arabic"]');
  if(btn)btn.classList.add("active");
  const title=document.getElementById("pageTitle");
  if(title)title.textContent="Arabic Conversation";
  if(typeof renderArabicPhrases==="function")renderArabicPhrases();
  window.scrollTo({top:0,behavior:"smooth"});
  return false;
}
window.openArabicConversation=openArabicConversation;


/* ===== ARABIC GAMIFICATION ===== */
const arabicGameBank = [
  {type:"quiz", prompt:"Which Arabic phrase means “Thank you”?", answer:"شُكْرًا", options:["شُكْرًا","عَفْوًا","مَرْحَبًا","مَعَ السَّلَامَةِ"]},
  {type:"quiz", prompt:"What should you say when greeting someone?", answer:"السَّلَامُ عَلَيْكُمْ", options:["كَمْ هَذَا؟","السَّلَامُ عَلَيْكُمْ","أَيْنَ الْفُنْدُقُ؟","أَحْتَاجُ إِلَى الْمُسَاعَدَةِ"]},
  {type:"quiz", prompt:"Which phrase asks “How much is this?”", answer:"كَمْ هَذَا؟", options:["أَيْنَ الْحَمَّامُ؟","كَمْ هَذَا؟","شُكْرًا","لَدَيَّ حَجْزٌ"]},
  {type:"quiz", prompt:"Which phrase means “I need help”?", answer:"أَحْتَاجُ إِلَى الْمُسَاعَدَةِ", options:["أَيْنَ فُنْدُقِي؟","أَحْتَاجُ إِلَى الْمُسَاعَدَةِ","كَمْ هَذَا؟","عَفْوًا"]},
  {type:"quiz", prompt:"Which phrase means “Where is my hotel?”", answer:"أَيْنَ فُنْدُقِي؟", options:["أَيْنَ فُنْدُقِي؟","أَيْنَ الْمَسْجِدُ؟","أُرِيدُ سَيَّارَةَ أُجْرَةٍ","شُكْرًا"]},
  {type:"meaning", prompt:"What does “Ayna al-Masjid al-Harām?” mean?", answer:"Where is Masjid al-Haram?", options:["Where is Masjid al-Haram?","How much is this?","I need a taxi","I have a reservation"]},
  {type:"meaning", prompt:"What does “Ladayya ḥajz” mean?", answer:"I have a reservation", options:["I have a reservation","I need help","Thank you","Where is the toilet?"]},
  {type:"meaning", prompt:"What does “Urīdu sayyārata ujrah” mean?", answer:"I need a taxi", options:["I need a taxi","I need a hotel","Where is the mosque?","Can you help me?"]},
  {type:"listen", prompt:"Listen carefully. Which phrase did you hear?", answer:"كَمْ هَذَا؟", audio:"كَمْ هَذَا؟", options:["كَمْ هَذَا؟","شُكْرًا","عَفْوًا","أَيْنَ فُنْدُقِي؟"]},
  {type:"listen", prompt:"Listen carefully. Which phrase did you hear?", answer:"أَحْتَاجُ إِلَى الْمُسَاعَدَةِ", audio:"أَحْتَاجُ إِلَى الْمُسَاعَدَةِ", options:["أَيْنَ فُنْدُقِي؟","أَحْتَاجُ إِلَى الْمُسَاعَدَةِ","شُكْرًا","كَمْ هَذَا؟"]}
];

let arabicGameMode="quiz", arabicGameIndex=0, arabicGameScore=0, arabicGameStreak=0, arabicGameQuestions=[];

function shuffleArabic(a){
  const x=[...a];
  for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}
  return x;
}
function startArabicGame(mode="quiz",btn){
  arabicGameMode=mode;
  arabicGameIndex=0;
  arabicGameScore=0;
  arabicGameStreak=0;
  arabicGameQuestions=shuffleArabic(arabicGameBank.filter(q=>q.type===mode));
  document.querySelectorAll(".game-mode").forEach(b=>b.classList.remove("active"));
  if(btn)btn.classList.add("active");
  updateArabicGameScore();
  renderArabicGameQuestion();
}
function renderArabicGameQuestion(){
  const q=arabicGameQuestions[arabicGameIndex];
  const prompt=document.getElementById("gamePrompt"), options=document.getElementById("gameOptions");
  const feedback=document.getElementById("gameFeedback"), next=document.getElementById("gameNext");
  if(!q||!prompt||!options)return;
  document.getElementById("gameQuestionNo").textContent=arabicGameIndex+1;
  document.getElementById("gameTotal").textContent=arabicGameQuestions.length;
  document.getElementById("gameBarFill").style.width=((arabicGameIndex)/arabicGameQuestions.length*100)+"%";
  prompt.textContent=q.prompt;
  feedback.textContent="";
  feedback.className="game-feedback";
  next.hidden=true;
  options.innerHTML="";
  if(q.type==="listen"){
    const play=document.createElement("button");
    play.className="listen-question";
    play.textContent="🔊 Play Arabic phrase";
    play.onclick=()=>speakArabic(q.audio);
    options.appendChild(play);
  }
  shuffleArabic(q.options).forEach(option=>{
    const b=document.createElement("button");
    b.className="game-option";
    b.textContent=option;
    b.onclick=()=>checkArabicGameAnswer(option,b);
    options.appendChild(b);
  });
}
function checkArabicGameAnswer(option,button){
  const q=arabicGameQuestions[arabicGameIndex];
  if(!q)return;
  document.querySelectorAll(".game-option").forEach(b=>b.disabled=true);
  const correct=option===q.answer;
  if(correct){
    button.classList.add("correct");
    arabicGameStreak++;
    arabicGameScore+=10+(arabicGameStreak>=3?5:0);
    document.getElementById("gameFeedback").textContent=arabicGameStreak>=3?"Excellent! 🔥 Streak bonus +15 XP":"Correct! +10 XP";
    document.getElementById("gameFeedback").className="game-feedback correct";
  }else{
    button.classList.add("wrong");
    arabicGameStreak=0;
    document.querySelectorAll(".game-option").forEach(b=>{if(b.textContent===q.answer)b.classList.add("correct");});
    document.getElementById("gameFeedback").textContent=`Not quite. Correct answer: ${q.answer}`;
    document.getElementById("gameFeedback").className="game-feedback wrong";
  }
  updateArabicGameScore();
  document.getElementById("gameNext").hidden=false;
}
function nextArabicGameQuestion(){
  arabicGameIndex++;
  if(arabicGameIndex>=arabicGameQuestions.length){
    finishArabicGame();
  }else renderArabicGameQuestion();
}
function finishArabicGame(){
  const area=document.getElementById("arabicGameArea");
  const max=arabicGameQuestions.length*10;
  const pct=Math.round((arabicGameScore/Math.max(max,1))*100);
  area.innerHTML=`
    <div class="game-complete">🏆</div>
    <div class="game-badge">MISSION COMPLETE</div>
    <h3>You scored ${arabicGameScore} XP</h3>
    <p>${pct>=80?"Mā shā’ Allāh! You are building strong Arabic confidence.":pct>=50?"Good progress! Practise the phrases again to improve.":"Keep practising — repetition will make these phrases easier to remember."}</p>
    <button class="game-next" onclick="startArabicGame('${arabicGameMode}',document.querySelector('.game-mode.active'))">Play again ↻</button>`;
  document.getElementById("gameBarFill").style.width="100%";
}
function updateArabicGameScore(){
  const xp=document.getElementById("arabicXP"), streak=document.getElementById("arabicStreak"), level=document.getElementById("arabicLevel");
  if(xp)xp.textContent=arabicGameScore;
  if(streak)streak.textContent=`🔥 ${arabicGameStreak}`;
  if(level)level.textContent=arabicGameScore>=150?"Arabic Ready":arabicGameScore>=100?"Pilgrim Speaker":arabicGameScore>=50?"Phrase Explorer":"Beginner";
}

/* Speaking exercise: browser-native recognition where available. */
let arabicSpeakingPhrase=null;
function startArabicSpeakingExercise(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const result=document.getElementById("speakingResult");
  arabicSpeakingPhrase=arabicPhrases[Math.floor(Math.random()*arabicPhrases.length)];
  if(!result)return;
  result.innerHTML=`Phrase: <strong dir="rtl">${arabicSpeakingPhrase.ar}</strong> — ${arabicSpeakingPhrase.en}`;
  speakArabic(arabicSpeakingPhrase.ar);
  if(!SR){
    result.innerHTML += "<br><small>Microphone practice is not supported in this browser. Try Chrome or Edge.</small>";
    return;
  }
  setTimeout(()=>{
    const rec=new SR();
    rec.lang="ar-SA";
    rec.interimResults=false;
    rec.maxAlternatives=3;
    result.innerHTML += "<br><span>🎙️ Listening… say the phrase now.</span>";
    rec.onresult=e=>{
      const heard=e.results[0][0].transcript.trim();
      const target=arabicSpeakingPhrase.ar.replace(/[ًٌٍَُِّْـٰ]/g,"").replace(/\s+/g," ");
      const got=heard.replace(/[ًٌٍَُِّْـٰ]/g,"").replace(/\s+/g," ");
      const close=got===target || got.includes(target) || target.includes(got);
      if(close){
        arabicGameScore+=15; arabicGameStreak++;
        updateArabicGameScore();
        result.innerHTML=`<span class="speak-success">🎉 Great pronunciation practice! +15 XP</span><br><small>Heard: ${heard}</small>`;
      }else{
        arabicGameStreak=0; updateArabicGameScore();
        result.innerHTML=`<span class="speak-try">Keep practising — the browser heard: ${heard}</span><br><small>Try again after listening once more.</small>`;
      }
    };
    rec.onerror=()=>result.innerHTML+="<br><small>Microphone access was unavailable. Please allow microphone permission.</small>";
    rec.start();
  },900);
}
document.addEventListener("DOMContentLoaded",()=>startArabicGame("quiz",document.querySelector(".game-mode.active")));


/* ===== FINAL LEARN MENU ROUTER FIX =====
   Capture-phase handlers override legacy duplicate navigation handlers.
*/
(function(){
  function openLearnPage(id, pageTitle, dataPage){
    const page=document.getElementById(id);
    if(!page){ console.error("Missing page:",id); return false; }
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active","show"));
    page.classList.add("active","show");
    document.querySelectorAll(".sidebar .nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===dataPage));
    const title=document.getElementById("pageTitle");
    if(title) title.textContent=pageTitle;
    document.querySelector(".sidebar")?.classList.remove("open");
    window.scrollTo(0,0);
    return true;
  }
  document.addEventListener("click",function(e){
    const btn=e.target.closest(".sidebar .nav-item[data-page='arabic']");
    if(btn){
      e.preventDefault(); e.stopImmediatePropagation();
      openLearnPage("arabic","Arabic Conversation","arabic");
      if(typeof renderArabicPhrases==="function") renderArabicPhrases();
    }
  },true);
  document.addEventListener("click",function(e){
    const btn=e.target.closest(".sidebar .nav-item[data-page='quran']");
    if(btn){
      e.preventDefault(); e.stopImmediatePropagation();
      openLearnPage("quran","E-Quran","quran");
      if(typeof renderQuranList==="function") renderQuranList();
      if(typeof updateQuranProgress==="function") updateQuranProgress();
    }
  },true);
})();


/* ===== E-QURAN READING PROGRESS ===== */
const quranSurahDemo = [
  ["1","Al-Fatihah",7],["2","Al-Baqarah",286],["3","Ali 'Imran",200],["4","An-Nisa",176],
  ["5","Al-Ma'idah",120],["6","Al-An'am",165],["7","Al-A'raf",206],["8","Al-Anfal",75],
  ["9","At-Tawbah",129],["10","Yunus",109],["11","Hud",123],["12","Yusuf",111]
];
const quranStoreKey="iharamQuranProgress";
function getQuranProgress(){
  try{return JSON.parse(localStorage.getItem(quranStoreKey)||"{}")}catch(e){return {}}
}
function saveQuranProgress(data){localStorage.setItem(quranStoreKey,JSON.stringify(data))}
function updateQuranProgress(){
  const data=getQuranProgress();
  const completed=Object.values(data.completed||{}).filter(Boolean).length;
  const pages=Number(data.pages||0);
  const percent=Math.round(completed/quranSurahDemo.length*100);
  const el=id=>document.getElementById(id);
  if(el("quranPercent"))el("quranPercent").textContent=percent+"%";
  if(el("quranCompleted"))el("quranCompleted").textContent=completed;
  if(el("quranPages"))el("quranPages").textContent=pages;
  if(el("quranStreak"))el("quranStreak").textContent=Number(data.streak||0);
  if(el("quranTrackFill"))el("quranTrackFill").style.width=percent+"%";
  const next=quranSurahDemo.find(s=>!(data.completed||{})[s[0]])||quranSurahDemo[0];
  if(el("quranContinueTitle"))el("quranContinueTitle").textContent=`Surah ${next[1]}`;
  if(el("quranContinueMeta"))el("quranContinueMeta").textContent=`Surah ${next[0]} · ${next[2]} verses · ${completed} of ${quranSurahDemo.length} demo surahs completed`;
}
function renderQuranList(){
  const box=document.getElementById("quranSurahList"); if(!box)return;
  const filter=document.getElementById("quranFilter")?.value||"all";
  const data=getQuranProgress(), done=data.completed||{};
  box.innerHTML="";
  quranSurahDemo.forEach(s=>{
    const isDone=!!done[s[0]];
    if(filter==="completed"&&!isDone)return;
    if(filter==="pending"&&isDone)return;
    const row=document.createElement("div"); row.className="quran-surah-row"+(isDone?" completed":"");
    row.innerHTML=`<div class="surah-number">${s[0]}</div><div class="surah-name"><strong>${s[1]}</strong><span>${s[2]} verses</span></div><button onclick="toggleQuranSurah('${s[0]}')">${isDone?"✓ Completed":"Mark complete"}</button>`;
    box.appendChild(row);
  });
}
function toggleQuranSurah(id){
  const data=getQuranProgress(); data.completed=data.completed||{};
  data.completed[id]=!data.completed[id];
  saveQuranProgress(data); updateQuranProgress(); renderQuranList();
}
function saveQuranGoal(){
  const data=getQuranProgress();
  data.dailyGoal=Math.max(1,Number(document.getElementById("quranDailyGoal")?.value)||5);
  saveQuranProgress(data);
}
function logQuranPages(){
  const data=getQuranProgress();
  const goal=Number(data.dailyGoal||5);
  const pages=Number(prompt("How many Qur'an pages did you read today?",String(goal)));
  if(!Number.isFinite(pages)||pages<1)return;
  data.pages=Number(data.pages||0)+Math.round(pages);
  const today=new Date().toISOString().slice(0,10);
  if(data.lastLog!==today){
    const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
    data.streak=data.lastLog===yesterday?Number(data.streak||0)+1:1;
    data.lastLog=today;
  }
  saveQuranProgress(data); updateQuranProgress();
}
function resetQuranProgress(){
  if(confirm("Reset your Qur'an reading progress on this device?")){
    localStorage.removeItem(quranStoreKey); updateQuranProgress(); renderQuranList();
  }
}
function openQuranReading(){
  window.open("https://quran.com/","_blank","noopener,noreferrer");
}
function speakQuranSample(){
  if(typeof speechSynthesis==="undefined"){toast("Audio is not supported by this browser.");return;}
  const u=new SpeechSynthesisUtterance("Bismillāhir-Raḥmānir-Raḥīm");
  u.lang="ar-SA"; u.rate=.8; speechSynthesis.cancel(); speechSynthesis.speak(u);
}
document.addEventListener("DOMContentLoaded",()=>{
  updateQuranProgress(); renderQuranList();
});

/* HD REAL KAABAH TAWAF ENVIRONMENT */
document.addEventListener("DOMContentLoaded",()=>{
  const pano=document.getElementById("makkahPanorama");
  const sky=document.querySelector("#academyVRScene a-sky");
  if(pano && sky){
    const setRealPanorama=()=>{
      sky.setAttribute("src","#makkahPanorama");
      sky.setAttribute("rotation","0 -90 0");
    };
    if(pano.complete) setRealPanorama();
    else pano.addEventListener("load",setRealPanorama,{once:true});
  }
});

/* ===== ESSENTIAL PILLARS ===== */
const pillarSets={
  umrah:{
    label:"UMRAH", title:"Essential Pillars of Umrah",
    intro:"In Malaysian Tabung Haji guidance, the Umrah sequence covers ihram/niat, Tawaf, Sa'i (Walking between Safa and Marwah), bercukur/bergunting (tahallul), and tertib.",
    items:[
      ["1","Intention for Umrah Ihram","Miqat","Enter Ihram and make the intention for Umrah at the applicable Miqat.","🕋"],
      ["2","Umrah Tawaf","Kaabah","Perform seven rounds around the Kaabah, keeping the Kaabah on your left.","🔄"],
      ["3","Umrah Sa'i (Walking between Safa and Marwah)","Safa → Marwah","Complete seven trips between Safa and Marwah; each journey from Safa to Marwah counts as one.","🏃"],
      ["4","Shaving or Trimming the Hair","After Sa'i (Walking between Safa and Marwah)","Complete the required hair-cutting act to exit Ihram, according to the applicable guidance.","✂️"],
      ["5","Correct Sequence (Tertib)","In sequence","Complete the essential acts in the required order.","✓"]
    ]
  },
  hajj:{
    label:"HAJJ", title:"Essential Pillars of Hajj",
    intro:"The Malaysian Tabung Haji guide presents six rukun Hajj: niat ihram, wuquf, Tawaf, Sa'i (Walking between Safa and Marwah), bercukur/bergunting and tertib.",
    items:[
      ["1","Intention for Hajj Ihram","Miqat","Enter ihram and make the intention for Hajj according to your Hajj type.","🕋"],
      ["2","Standing at Arafah (Wuquf)","Arafah","Be present at Arafah during the prescribed time of wuquf.","⛰️"],
      ["3","Tawaf al-Ifadah","Kaabah","Perform the required Tawaf after the relevant Hajj stage.","🔄"],
      ["4","Sa'i (Walking between Safa and Marwah)","Safa → Marwah","Complete seven trips between Safa and Marwah when required for your Hajj.","🏃"],
      ["5","Shaving or Trimming the Hair","Exit from Ihram (Tahallul)","Complete the required hair-cutting act to exit Ihram, according to the applicable guidance.","✂️"],
      ["6","Correct Sequence (Tertib)","Required sequence","Observe the required order of the essential pillars according to the applicable guidance.","✓"]
    ]
  }
};
let activePillarSet="umrah", pillarScore=0;
function getPillarDone(){try{return JSON.parse(localStorage.getItem("iharamPillarsDone")||"{}")}catch(e){return {}}}
function savePillarDone(x){localStorage.setItem("iharamPillarsDone",JSON.stringify(x))}
function showPillarSet(type,btn){
  activePillarSet=type;
  document.querySelectorAll(".pillar-tab").forEach(b=>b.classList.remove("active"));
  if(btn)btn.classList.add("active");
  const set=pillarSets[type], d=getPillarDone();
  document.getElementById("pillarSetLabel").textContent=set.label;
  document.getElementById("pillarSetTitle").textContent=set.title;
  document.getElementById("pillarSetIntro").textContent=set.intro;
  document.getElementById("pillarCount").textContent=`${set.items.filter(x=>d[type+"-"+x[0]]).length} / ${set.items.length}`;
  const cards=document.getElementById("pillarCards"); cards.innerHTML="";
  set.items.forEach(x=>{
    const key=type+"-"+x[0], done=!!d[key];
    const card=document.createElement("article"); card.className="pillar-card"+(done?" done":"");
    card.innerHTML=`<div class="pillar-icon">${x[4]}</div><div class="pillar-number">${x[0]}</div><div class="pillar-main"><span>${x[2]}</span><h3>${x[1]}</h3><p>${x[3]}</p></div><button onclick="togglePillar('${type}','${x[0]}')">${done?"✓ Learned":"Mark learned"}</button>`;
    cards.appendChild(card);
  });
  updatePillarProgress();
  renderPillarQuiz();
}
function togglePillar(type,id){
  const d=getPillarDone(), key=type+"-"+id; d[key]=!d[key]; savePillarDone(d); showPillarSet(type,document.querySelector(".pillar-tab.active"));
}
function updatePillarProgress(){
  const d=getPillarDone(), all=Object.keys(pillarSets).flatMap(t=>pillarSets[t].items.map(x=>t+"-"+x[0]));
  const done=all.filter(k=>d[k]).length, pct=Math.round(done/all.length*100);
  const el=document.getElementById("pillarProgress"); if(el)el.textContent=pct+"%";
}
const pillarQuizBank={
  umrah:[
    ["How many Tawaf rounds are completed for Umrah?","7","5","7","3"],
    ["Sa'i (Walking between Safa and Marwah) begins at which location?","Safa","Marwah","Arafah","Mina"],
    ["What follows Sa'i in the basic Umrah sequence?","Shave or trim the hair","Standing at Arafah (Wuquf)","Muzdalifah","Jamarat"]
  ],
  hajj:[
    ["Where is wuquf performed?","Arafah","Mina","Safa","Madinah"],
    ["How many Sa'i (Walking between Safa and Marwah) trips are completed?","7","3","5","10"],
    ["Which is a rukun Hajj?","Standing at Arafah (Wuquf)","Shopping","Hotel check-in","Currency exchange"]
  ]
};
let pillarQuizIndex=0;
function renderPillarQuiz(){
  const box=document.getElementById("pillarQuiz"); if(!box)return;
  const q=pillarQuizBank[activePillarSet][pillarQuizIndex%pillarQuizBank[activePillarSet].length];
  box.innerHTML=`<div class="pillar-question"><span>Challenge ${pillarQuizIndex%3+1} / 3</span><h3>${q[0]}</h3><div class="pillar-options">${q.slice(1).map((o,i)=>`<button onclick="answerPillar('${o.replace(/'/g,"&#39;")}',this,'${q[1].replace(/'/g,"&#39;")}')">${o}</button>`).join("")}</div><div id="pillarQuizFeedback"></div></div>`;
}
function answerPillar(ans,btn,correct){
  document.querySelectorAll(".pillar-options button").forEach(b=>b.disabled=true);
  const f=document.getElementById("pillarQuizFeedback");
  if(ans===correct){btn.classList.add("correct");pillarScore+=10;f.textContent="Correct! +10 XP 🎉";f.className="quiz-good";}
  else{btn.classList.add("wrong");f.textContent=`Not quite. Correct answer: ${correct}`;f.className="quiz-bad";document.querySelectorAll(".pillar-options button").forEach(b=>{if(b.textContent===correct)b.classList.add("correct")});}
  const next=document.createElement("button"); next.className="pillar-next";next.textContent="Next challenge →";next.onclick=()=>{pillarQuizIndex++;renderPillarQuiz()};f.appendChild(next);
  const s=document.getElementById("pillarScore");if(s)s.textContent=pillarScore;
}
(function(){
 document.addEventListener("click",function(e){
   const b=e.target.closest(".sidebar .nav-item[data-page='pillars']");
   if(!b)return;
   e.preventDefault();e.stopImmediatePropagation();
   document.querySelectorAll(".page").forEach(p=>p.classList.remove("active","show"));
   const p=document.getElementById("pillars"); if(!p)return;
   p.classList.add("active","show");
   document.querySelectorAll(".sidebar .nav-item").forEach(x=>x.classList.toggle("active",x===b));
   const t=document.getElementById("pageTitle");if(t)t.textContent="Essential Pillars";
   window.scrollTo(0,0);
   showPillarSet("umrah",document.querySelector(".pillar-tab"));
 },true);
})();
document.addEventListener("DOMContentLoaded",()=>{if(document.getElementById("pillars"))showPillarSet("umrah",document.querySelector(".pillar-tab"));});


// Contact Us actions
function openContactAI(){
  if (typeof showPage === "function") showPage("ai");
  else alert("AI Assistant is available from the main menu.");
}
function openContactWhatsApp(){
  window.open("https://wa.me/60123456789", "_blank", "noopener");
}
function demoSocial(e, name){
  e.preventDefault();
  alert(name + " link is a demo placeholder. Replace it with the official HARAMAIN360 account before deployment.");
}
