// ── Step 2 복약 알림 ── (shared across all v2 files)
// Globals expected from host file: PRESCRIPTIONS, selectedRxIds, reminderSettings,
//   rmExpandedIds, editingDrugsMap, currentStep, setStepTab, renderStep1, goStep3

function parseFreqCount(freq) {
  var m = /([0-9]+)\s*회/.exec(freq || '');
  return m ? parseInt(m[1], 10) : 1;
}

function defaultSlotsForTimes(n) {
  if (n <= 1) return ['아침'];
  if (n === 2) return ['아침', '점심'];
  if (n === 3) return ['아침', '점심', '저녁'];
  return ['아침', '점심', '저녁', '취침전'];
}

function todayISO() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function initReminderSettings() {
  selectedRxIds.forEach(function(id) {
    if (reminderSettings[id]) return;
    var rx = PRESCRIPTIONS.find(function(r) { return r.id === id; });
    var drugs = editingDrugsMap[id] || rx.drugs;
    var times = Math.min(4, Math.max.apply(null, drugs.map(function(d) { return parseFreqCount(d.freq); })));
    reminderSettings[id] = {
      enabled: true,
      times: times,
      slots: new Set(defaultSlotsForTimes(times)),
      timing: '식후 30분',
      startDate: todayISO(),
      days: Math.max.apply(null, drugs.map(function(d){ return d.days || rx.days; }))
    };
  });
}

function goStep2() {
  if (!selectedCustomer) return;
  if (!selectedRxIds.length && !(selectedCustomer && selectedCustomer.isNew)) return;
  currentStep = 2;
  setStepTab(2);
  initReminderSettings();
  renderReminderBody();
}

function renderReminderBody() {
  var B = document.getElementById('mbody');
  var F = document.getElementById('mfoot');

  var chevronSVG = '<svg class="rm-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  var itemsHTML = selectedRxIds.map(function(id) {
    var rx = PRESCRIPTIONS.find(function(r) { return r.id === id; });
    var drugs = editingDrugsMap[id] || rx.drugs;
    var s = reminderSettings[id];
    var isOpen = rmExpandedIds.has(id);
    var timesPills = [1, 2, 3, 4].map(function(n) {
      return '<button class="rm-pill' + (s.times === n ? ' on' : '') + '" onclick="rmSetTimes(\'' + id + '\',' + n + ')">' + n + '회</button>';
    }).join('');
    var slotPills = ['아침', '점심', '저녁', '취침전'].map(function(t) {
      return '<button class="rm-pill' + (s.slots.has(t) ? ' on' : '') + '" onclick="rmToggleSlot(\'' + id + '\',\'' + t + '\')">' + t + '</button>';
    }).join('');
    var timingPills = ['식전', '식후', '식후 30분'].map(function(t) {
      return '<button class="rm-pill' + (s.timing === t ? ' on' : '') + '" onclick="rmSetTiming(\'' + id + '\',\'' + t + '\')">' + t + '</button>';
    }).join('');
    var summaryChip = s.enabled ? (s.times + '회 · ' + s.days + '일분') : '전송 안 함';

    var row = '<div class="rm-row' + (isOpen ? ' open' : '') + '" onclick="rmToggleExpand(\'' + id + '\')">'
      + '<div class="rm-row-body">'
      + '<div class="rm-row-top"><span class="rm-row-hospital">' + rx.hospital + '</span><span class="rm-row-dept">' + rx.dept + '</span></div>'
      + '<div class="rm-row-meta">' + drugs.map(function(d) { return d.name; }).join(', ') + '</div>'
      + '</div>'
      + '<div class="rm-row-right">'
      + '<span class="rm-chip">' + summaryChip + '</span>'
      + '<label class="rm-switch" onclick="event.stopPropagation();"><input type="checkbox" ' + (s.enabled ? 'checked' : '') + ' onchange="rmToggleEnabled(\'' + id + '\')"><span class="rm-slider"></span></label>'
      + chevronSVG
      + '</div></div>';

    var drugNameList = drugs.map(function(d) {
      return '<li class="rm-drug-item">' + d.name + '</li>';
    }).join('');
    var panel = '<div class="rm-panel' + (isOpen ? ' open' : '') + (s.enabled ? '' : ' disabled') + '">'
      + '<div class="rm-field rm-drug-list-field"><div class="rm-field-label">포함 약품</div><ul class="rm-drug-list">' + drugNameList + '</ul></div>'
      + '<div class="rm-field"><div class="rm-field-label">복약 횟수</div><div class="rm-pills">' + timesPills + '</div></div>'
      + '<div class="rm-field"><div class="rm-field-label">복약 시간</div><div class="rm-pills">' + slotPills + '</div></div>'
      + '<div class="rm-field"><div class="rm-field-label">복약 시점</div><div class="rm-pills">' + timingPills + '</div></div>'
      + '<div class="rm-2col">'
      + '<div class="rm-field"><div class="rm-field-label">복약 시작일</div><input class="rm-date-input" type="date" value="' + s.startDate + '" onclick="event.stopPropagation();" onchange="rmSetStartDate(\'' + id + '\',this.value)"></div>'
      + '<div class="rm-field"><div class="rm-field-label">복약 기간</div><div class="rm-days-ctrl">'
      + '<button class="rm-days-btn" onclick="rmChangeDays(\'' + id + '\',-1)">−</button>'
      + '<input class="rm-days-input" type="number" min="1" value="' + s.days + '" onclick="event.stopPropagation();" onchange="rmSetDays(\'' + id + '\',this.value)">'
      + '<span style="font-size:12px;color:#888;">일</span>'
      + '<button class="rm-days-btn" onclick="rmChangeDays(\'' + id + '\',1)">+</button>'
      + '</div></div>'
      + '</div></div>';

    return '<div class="rm-item">' + row + panel + '</div>';
  }).join('');

  B.innerHTML = '<p style="font-size:12px;color:#888;margin-bottom:14px;line-height:1.6;">환자의 처방전 정보를 기반으로 복약 알림을 자동 설정했습니다. 설정한 알림은 웰체크 환자 앱에 자동 등록됩니다.<br>알림 수정이 필요한 경우, 수정할 처방전을 클릭해 주세요. 알림을 발송하지 않을 처방전은 토글을 꺼 주세요.</p>'
    + (itemsHTML || '<div class="rm-empty-tip">설정할 처방전이 없습니다.</div>');

  F.innerHTML = '<span class="rm-step-lbl">Step 2 / 4 · 복약 알림</span>'
    + '<button class="btn-cancel" onclick="goBackToStep1()">← 이전</button>'
    + '<button class="btn-cancel" onclick="goStep2Skip()">이 단계 건너뛰기</button>'
    + '<button class="btn-next" onclick="goStep3()">다음 단계 →</button>';
}

function rmToggleExpand(id) {
  if (rmExpandedIds.has(id)) rmExpandedIds.delete(id); else rmExpandedIds.add(id);
  renderReminderBody();
}
function rmToggleEnabled(id) {
  reminderSettings[id].enabled = !reminderSettings[id].enabled;
  renderReminderBody();
}
function rmSetTimes(id, n) {
  var s = reminderSettings[id];
  s.times = n;
  s.slots = new Set(defaultSlotsForTimes(n));
  renderReminderBody();
}
function rmToggleSlot(id, slot) {
  var s = reminderSettings[id];
  if (s.slots.has(slot)) s.slots.delete(slot); else s.slots.add(slot);
  renderReminderBody();
}
function rmSetTiming(id, val) {
  reminderSettings[id].timing = val;
  renderReminderBody();
}
function rmSetStartDate(id, val) {
  reminderSettings[id].startDate = val;
}
function rmChangeDays(id, delta) {
  var s = reminderSettings[id];
  s.days = Math.max(1, (s.days || 1) + delta);
  renderReminderBody();
}
function rmSetDays(id, val) {
  var s = reminderSettings[id];
  s.days = Math.max(1, parseInt(val, 10) || 1);
  renderReminderBody();
}
function goStep2Skip() {
  selectedRxIds.forEach(function(id) { reminderSettings[id].enabled = false; });
  goStep3();
}
