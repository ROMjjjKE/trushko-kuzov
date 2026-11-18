/* ТРУШКО: меню, аккордеон, карта кузова, мастер после ДТП, форма */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var WA = 'https://wa.me/375298188166';

  /* меню */
  var drawer = $('drawer'), burger = $('burger'), closeBtn = $('drawerClose'), lastFocus = null;
  function openD() {
    lastFocus = document.activeElement;
    drawer.setAttribute('data-open', 'true');
    document.body.classList.add('is-locked');
    burger.setAttribute('aria-expanded', 'true');
    var f = drawer.querySelector('a,button'); if (f) f.focus();
  }
  function closeD() {
    if (!drawer) return;
    drawer.setAttribute('data-open', 'false');
    document.body.classList.remove('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (burger) burger.addEventListener('click', openD);
  if (closeBtn) closeBtn.addEventListener('click', closeD);
  if (drawer) {
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeD(); });
    document.addEventListener('keydown', function (e) {
      if (drawer.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') { closeD(); return; }
      if (e.key === 'Tab') {
        var f = drawer.querySelectorAll('a,button'); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1099 && drawer.getAttribute('data-open') === 'true') closeD();
    });
  }

  /* аккордеон */
  document.querySelectorAll('.faq__q').forEach(function (b) {
    b.addEventListener('click', function () {
      var it = b.parentElement, open = it.getAttribute('data-open') === 'true';
      var box = it.closest('.faq');
      if (box) box.querySelectorAll('.faq__i').forEach(function (x) { x.setAttribute('data-open', 'false'); });
      it.setAttribute('data-open', open ? 'false' : 'true');
    });
  });

  /* карта кузова */
  var Z = {
    kapot: ['Капот', 'сколы, вмятина от удара, коррозия по кромке', 'рихтовка по каркасу, при сильном повреждении — замена', 'петли и болты, регулировка зазоров', '1–3 дня с покраской'],
    krilo: ['Переднее крыло', 'вмятина от контакта, разрыв металла', 'рихтовка, споттер, при разрыве — замена', 'болты и сварка по стойке, герметик', '2–3 дня'],
    door_f: ['Передняя дверь', 'вмятина, залом ребра, потёртость', 'рихтовка, вытяжка споттером, покраска с переходом', 'петли, замок, стеклоподъёмник', '2–4 дня'],
    door_r: ['Задняя дверь', 'вмятина, коррозия по низу', 'рихтовка, замена низа двери, антикор внутри', 'петли, замок, направляющие', '2–4 дня'],
    quarter: ['Задняя четверть', 'удар в бок, растяжение металла', 'рихтовка, при необходимости — вставка или замена четверти', 'сварка по стыкам, стекло и обшивка снимаются', '3–6 дней'],
    porog: ['Порог', 'сквозная коррозия, замятие после удара', 'вырезаем повреждённое, ввариваем ремонтную вставку', 'сварка, шов герметиком, антикор и покраска', '2–4 дня на сторону'],
    roof: ['Крыша', 'вмятина, залом после опрокидывания', 'рихтовка, при сложной деформации — замена полотна', 'сварка по периметру, снятие обшивки и стёкол', '4–8 дней'],
    bumper: ['Бампер', 'трещина, разрыв, потеря креплений', 'пайка пластика, армирование, шпатлёвка, покраска', 'клипсы и кронштейны, подбор при поломке', '1–2 дня']
  };
  var map = document.querySelector('[data-panel]');
  if (map) {
    var body = document.querySelector('[data-panel-body]');
    var chips = document.querySelector('[data-chips]');
    var list = [];
    var current = 'porog';
    function chipsRender() {
      chips.innerHTML = list.map(function (k) {
        return '<span class="chip">' + Z[k][0] + '<button type="button" data-rm="' + k + '" aria-label="Убрать ' + Z[k][0] + '">×</button></span>';
      }).join('');
      var link = document.querySelector('[data-list]');
      link.href = WA + '?text=' + encodeURIComponent('Здравствуйте! Хочу записаться на осмотр. Элементы: ' + (list.length ? list.map(function (k) { return Z[k][0]; }).join(', ') : 'уточню в переписке') + '.');
      chips.querySelectorAll('[data-rm]').forEach(function (b) {
        b.addEventListener('click', function () {
          list = list.filter(function (x) { return x !== b.getAttribute('data-rm'); });
          chipsRender();
        });
      });
    }
    function render(k) {
      current = k;
      var z = Z[k];
      body.innerHTML = '<h3>' + z[0] + '</h3><ul class="panel__list">' +
        '<li><b style="font-weight:600">Что бывает:</b> ' + z[1] + '</li>' +
        '<li><b style="font-weight:600">Как делаем:</b> ' + z[2] + '</li>' +
        '<li><b style="font-weight:600">Крепление:</b> ' + z[3] + '</li></ul>' +
        '<div class="panel__rows"><div><span>Ориентир по сроку</span><b>' + z[4] + '</b></div>' +
        '<div><span>Покраска</span><b>с переходом или полностью</b></div></div>' +
        '<button class="btn" type="button" data-add>' + (list.indexOf(k) > -1 ? 'Уже в списке' : 'Добавить в список') + '</button>';
      var add = body.querySelector('[data-add]');
      add.addEventListener('click', function () {
        if (list.indexOf(k) === -1) list.push(k);
        chipsRender(); render(k);
      });
      document.querySelectorAll('[data-pin]').forEach(function (p) {
        var on = p.getAttribute('data-pin') === k ? 'true' : 'false';
        p.setAttribute('data-on', on);
        document.querySelector('[data-pin-t="' + p.getAttribute('data-pin') + '"]').setAttribute('data-on', on);
      });
      document.querySelectorAll('[data-z]').forEach(function (r) { r.setAttribute('data-on', r.getAttribute('data-z') === k ? 'true' : 'false'); });
      document.querySelectorAll('[data-legend]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-legend') === k ? 'true' : 'false'); });
    }
    document.querySelectorAll('[data-pin], [data-z], [data-legend]').forEach(function (el) {
      var k = el.getAttribute('data-pin') || el.getAttribute('data-z') || el.getAttribute('data-legend');
      el.addEventListener('click', function () { render(k); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); render(k); } });
    });
    chipsRender(); render(current);
  }

  /* мастер после ДТП */
  var wiz = document.querySelector('[data-wiz-out]');
  if (wiz) {
    var st = { zone: 'front', kind: 'scratch', extra: 'none' };
    var ZN = { front: 'Передняя часть', rear: 'Задняя часть', side: 'Бок', roof: 'Крыша и стойка' };
    var KN = { scratch: 'царапины', dent: 'вмятина без разрыва', tear: 'разрыв металла', shift: 'сдвиг и перекос' };
    var EN = { none: 'только кузов', replace: 'нужна замена элементов', electro: 'электрика и стёкла', van: 'микроавтобус' };

    function calc() {
      var steps = [], days = [1, 2], verdict = '';
      if (st.kind === 'scratch') { steps = [['Подготовка', '2 слоя'], ['Покраска элемента', '1–2 дня']]; days = [1, 2]; verdict = 'Покраска без ремонта металла'; }
      else if (st.kind === 'dent') { steps = [['Рихтовка', '1–2 дня'], ['Споттер', 'по месту'], ['Покраска', '1–2 дня']]; days = [2, 4]; verdict = 'Рихтовка и покраска'; }
      else if (st.kind === 'tear') { steps = [['Сварка металла', '1 день'], ['Рихтовка шва', '1 день'], ['Антикор', 'после шва'], ['Покраска', '1–2 дня']]; days = [3, 5]; verdict = 'Сварка, рихтовка, покраска'; }
      else { steps = [['Проверка геометрии', 'замеры'], ['Стапель или силовая правка', '2–5 дней'], ['Сварка и рихтовка', '1–2 дня'], ['Покраска', '1–2 дня']]; days = [5, 10]; verdict = 'Восстановление геометрии'; }
      if (st.extra === 'replace') { steps.push(['Замена элемента', '+1–2 дня']); days = [days[0] + 1, days[1] + 2]; }
      if (st.extra === 'electro') steps.push(['Электрика и стёкла', 'до покраски']);
      if (st.extra === 'van') { days = [days[0] + 1, days[1] + 2]; }
      var zoneWork = { front: 'капот, крылья, телевизор, бампер', rear: 'крышка багажника, четверти, задняя панель', side: 'двери, пороги, четверть, стойки', roof: 'крыша, стойки, стёкла' };
      wiz.innerHTML = '<h3>Ориентир по работам</h3>' +
        '<div class="wiz__verdict"><b>' + verdict + '</b><span>' + ZN[st.zone] + ' · ' + KN[st.kind] + ' · ' + EN[st.extra] + '</span></div>' +
        '<div class="route">' + steps.map(function (s, i) {
          return '<div><i>' + ('0' + (i + 1)).slice(-2) + '</i><span>' + s[0] + '</span><b>' + s[1] + '</b></div>';
        }).join('') + '</div>' +
        '<div class="wiz__verdict"><b>' + days[0] + '–' + days[1] + ' ' + (days[1] % 10 === 1 && days[1] % 100 !== 11 ? 'день' : (days[1] % 10 >= 2 && days[1] % 10 <= 4 && (days[1] % 100 < 10 || days[1] % 100 >= 20) ? 'дня' : 'дней')) + '</b><span>ориентир по сроку · ' + zoneWork[st.zone] + '</span></div>' +
        '<a class="btn" href="' + WA + '?text=' + encodeURIComponent('Здравствуйте! После ДТП: ' + ZN[st.zone] + ', ' + KN[st.kind] + ', ' + EN[st.extra] + '. Подскажите по ремонту.') + '" target="_blank" rel="noopener">Отправить в WhatsApp</a>' +
        '<small>Перечень работ и срок уточняются на осмотре. Подушки, ремни и электрика после удара проверяются отдельно.</small>';
    }
    document.querySelectorAll('.wiz [data-group] button').forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.parentElement.getAttribute('data-group');
        st[g] = b.getAttribute('data-' + g);
        b.parentElement.querySelectorAll('button').forEach(function (x) {
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        calc();
      });
    });
    calc();
  }

  /* форма */
  var form = $('reqForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (id) { var el = $(id); return el && el.value ? el.value.trim() : ''; };
      if (!g('fName')) { $('fName').focus(); return; }
      if (!g('fTel')) { $('fTel').focus(); return; }
      var text = 'Заявка с сайта ТРУШКО\nИмя: ' + g('fName') + '\nТелефон: ' + g('fTel') +
        '\nЧто нужно: ' + g('fWhat') + (g('fMsg') ? '\nАвто и повреждение: ' + g('fMsg') : '');
      window.open(WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }
})();
