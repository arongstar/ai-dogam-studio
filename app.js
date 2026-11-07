'use strict';
/* =====================================================================
   AI 도감 스튜디오  v2
   초등 AI 융합 프로젝트(8차시)용 웹앱 — 어느 학교에서나 쓸 수 있게 만든 판
   - 사진과 학습은 모두 이 기기(브라우저) 안에서만 처리합니다. 서버가 없습니다.
   - AI: TensorFlow.js MobileNet 특징 추출 + 최근접 이웃 분류
   - 교사는 '학급 만들기'로 학생용 링크·QR과 차시 열기 코드를 만듭니다.
   ===================================================================== */
const APP_VERSION = '2.0.1';

/* ---------- 주제 템플릿 ---------- */
const TEMPLATES = {
  plant: {
    label: '식물 도감', icon: '🌿', name: '우리 학교 식물 도감', item: '식물', part: '잎', audience: '1학년 동생', modeName: '동생 모드',
    question: '우리 학교에 사는 식물을 1학년 동생들도 알아볼 수 있게 하려면 어떻게 해야 할까?',
    season: '잎이 무성한 봄~가을에 알맞아요.',
    rules: ['안전하게, 친구와 함께 움직여요', '떨어진 잎을 먼저 줍고, 딸 때는 한 그루에 한 장만', '사람 얼굴은 찍지 않아요'],
    features: [
      { k: 'shape', label: '잎 모양', ph: '예: 부채, 손바닥, 달걀 모양' },
      { k: 'vein', label: '잎맥', opts: ['그물맥', '나란히맥', '잘 모르겠음'] },
      { k: 'edge', label: '가장자리', opts: ['매끈함', '톱니 모양', '갈라짐', '잘 모르겠음'] },
      { k: 'other', label: '그 밖의 특징', ph: '예: 잎자루가 길다, 잎이 두껍다' },
    ],
    obsExtra: [{ k: 'touch', ph: '촉감·냄새' }],
    placeLabel: '발견 장소',
    guide: 'leaf',
    card: [
      { k: 'feature', label: '잎의 특징', icon: '🍃', ph: '예: 잎이 부채처럼 생겼어요. 줄무늬가 나란히 있어요.' },
      { k: 'role', label: '잎이 하는 일', icon: '☀️', ph: '예: 햇빛을 받아 나무가 먹을 양분을 만들어요.' },
      { k: 'place', label: '찾을 수 있는 곳', icon: '📍', ph: '예: 운동장 옆 화단', short: true },
    ],
    messagePh: '예: 가을에 노랗게 변하는 걸 찾아봐!',
    reasonPh: '예: 잎맥이 나란히맥이고 부채 모양이라서 은행나무예요',
    fixPh: '예: 은행나무 사진을 손바닥 위, 땅바닥 위에서도 10장 더 찍어 넣는다',
    trap: ['A 식물은 책상 위에서만, B 식물은 손바닥 위에서만 10장씩 찍어 학습시킵니다.', 'A 식물 잎을 손바닥 위에 올려 보여 주면 AI가 B라고 답하기 쉽습니다.'],
    kioskTitle: '이 잎은 어떤 식물일까?', kioskPrompt: '잎을 카메라에 보여 주세요!', kioskBtn: '잎 보여 주기',
    standards: [
      ['6과11-02', '식물의 각 기관의 구조를 관찰하고, 기능을 알아보는 실험을 수행하여 식물 각 기관의 구조와 기능을 설명할 수 있다.'],
      ['6과11-03', '여러 가지 식물의 특징을 설명하는 자료를 만들어 공유할 수 있다.'],
      ['6실05-04', '디지털 데이터와 아날로그 데이터의 특징을 이해하고, 인공지능에 활용할 수 있는 데이터의 유형이나 형태를 탐색한다.'],
      ['6실05-05', '인공지능이 만들어지는 과정을 체험하고, 인공지능이 사회에 미치는 영향을 탐색한다.'],
      ['6국03-01', '알맞은 내용을 선정하여 대상의 특성이 나타나게 설명하는 글을 쓴다.'],
      ['6국06-03', '적합한 양식과 수용자의 반응을 고려하여 복합양식 매체 자료를 제작하고 공유한다.'],
    ],
  },
  recycle: {
    label: '분리배출 도우미', icon: '♻️', name: 'AI 분리배출 도우미', item: '분리배출 종류', part: '물건', audience: '1학년 동생', modeName: '동생 모드',
    question: '1학년 동생들이 쓰레기를 올바르게 분리배출하도록 도우려면 어떻게 해야 할까?',
    season: '계절과 상관없이 교실에서 할 수 있어요.',
    rules: ['깨끗하게 씻은 물건만 가져와요', '깨진 유리나 날카로운 물건은 만지지 않아요', '사람 얼굴은 찍지 않아요'],
    features: [
      { k: 'material', label: '재질', opts: ['플라스틱', '종이', '종이팩', '캔·금속', '유리', '비닐', '잘 모르겠음'] },
      { k: 'mark', label: '분리배출 표시', ph: '예: PET, 플라스틱, 캔류, 종이팩' },
      { k: 'shape', label: '모양·색', ph: '예: 투명하고 길쭉함' },
      { k: 'other', label: '버리기 전에 할 일', ph: '예: 헹구기, 라벨 떼기, 납작하게' },
    ],
    obsExtra: [{ k: 'touch', ph: '만졌을 때 느낌·소리' }],
    placeLabel: '어디서 나온 물건인지',
    guide: 'recycle',
    card: [
      { k: 'feature', label: '이런 물건이에요', icon: '🔎', ph: '예: 투명한 음료수 병이에요. PET 표시가 있어요.' },
      { k: 'role', label: '이렇게 버려요', icon: '♻️', ph: '예: 내용물을 비우고 물로 헹군 다음 라벨을 떼요.' },
      { k: 'place', label: '버리는 곳', icon: '🗑️', ph: '예: 투명 페트병 수거함', short: true },
    ],
    messagePh: '예: 우유갑은 일반 종이와 따로 모아요!',
    reasonPh: '예: PET 표시가 있고 투명해서 플라스틱이에요',
    fixPh: '예: 구겨진 캔, 라벨이 붙은 병 사진도 10장 더 찍어 넣는다',
    trap: ['A 종류는 흰 책상 위에서만, B 종류는 바닥 위에서만 10장씩 찍어 학습시킵니다.', 'A 종류 물건을 바닥에 놓고 보여 주면 AI가 B라고 답하기 쉽습니다.'],
    kioskTitle: '이건 어디에 버릴까?', kioskPrompt: '버릴 물건을 카메라에 보여 주세요!', kioskBtn: '물건 보여 주기',
    standards: [
      ['6실02-03', '생활자원의 올바른 사용이 가정과 환경에 도움이 됨을 이해하고 재활용, 재사용 등 환경을 고려한 관리 방법을 실천한다.'],
      ['6실02-10', '자신의 생활공간을 쾌적하고 위생적으로 관리하는 것의 중요성을 알고, 정리정돈과 청소 및 쓰레기 처리의 방법을 익혀 실천한다.'],
      ['6실05-04', '디지털 데이터와 아날로그 데이터의 특징을 이해하고, 인공지능에 활용할 수 있는 데이터의 유형이나 형태를 탐색한다.'],
      ['6실05-05', '인공지능이 만들어지는 과정을 체험하고, 인공지능이 사회에 미치는 영향을 탐색한다.'],
      ['6사12-02', '지구촌을 위협하는 다양한 문제들을 파악하고, 지속가능한 미래를 위한 해결 방안을 탐색한다.'],
      ['6국03-04', '독자와 매체를 고려하여 내용을 생성하고 표현하며 글을 쓴다.'],
    ],
  },
  custom: {
    label: '직접 정하기', icon: '🔎', name: '우리 반 AI 도감', item: '종류', part: '대상', audience: '1학년 동생', modeName: '공유 모드',
    question: '우리가 조사한 것을 다른 사람도 알아볼 수 있게 하려면 어떻게 해야 할까?',
    season: '주제에 맞게 선생님이 정해요.',
    rules: ['안전하게 관찰해요', '살아 있는 생물이나 물건을 소중히 다뤄요', '사람 얼굴은 찍지 않아요'],
    features: [
      { k: 'shape', label: '모양', ph: '예: 둥글다, 길쭉하다' },
      { k: 'color', label: '색·무늬', ph: '예: 노란색에 검은 줄무늬' },
      { k: 'size', label: '크기·촉감', ph: '예: 손가락만 하다, 매끈하다' },
      { k: 'other', label: '그 밖의 특징', ph: '' },
    ],
    obsExtra: [],
    placeLabel: '찾은 곳',
    guide: 'generic',
    card: [
      { k: 'feature', label: '생김새', icon: '🔎', ph: '예: 몸이 세 부분으로 나뉘어 있어요.' },
      { k: 'role', label: '알아 두면 좋은 점', icon: '💡', ph: '예: 꽃가루를 옮겨 식물을 도와요.' },
      { k: 'place', label: '찾을 수 있는 곳', icon: '📍', ph: '예: 학교 꽃밭', short: true },
    ],
    messagePh: '예: 다음에 만나면 인사해 줘!',
    reasonPh: '예: 특징표에 적은 모양과 색이 같아서',
    fixPh: '예: 다른 배경과 각도에서 찍은 사진을 10장 더 넣는다',
    trap: ['A 종류는 흰 배경에서만, B 종류는 어두운 배경에서만 10장씩 찍어 학습시킵니다.', 'A 종류를 어두운 배경에서 보여 주면 AI가 B라고 답하기 쉽습니다.'],
    kioskTitle: '이건 무엇일까?', kioskPrompt: '카메라에 보여 주세요!', kioskBtn: '보여 주기',
    standards: [
      ['6실05-04', '디지털 데이터와 아날로그 데이터의 특징을 이해하고, 인공지능에 활용할 수 있는 데이터의 유형이나 형태를 탐색한다.'],
      ['6실05-05', '인공지능이 만들어지는 과정을 체험하고, 인공지능이 사회에 미치는 영향을 탐색한다.'],
    ],
  },
};
const isTpl = k => typeof k === 'string' && Object.prototype.hasOwnProperty.call(TEMPLATES, k);
// 링크·파일에서 들어온 주제 값은 정해진 항목만, 글자만 남깁니다.
function sanitizeTopic(t) {
  const o = { tpl: isTpl(t?.tpl) ? t.tpl : 'plant' };
  for (const k of ['title', 'item', 'part', 'audience', 'question']) {
    const v = clean(t?.[k], k === 'question' ? 200 : 40);
    if (v) o[k] = v;
  }
  return o;
}
// 지금 프로젝트의 주제(템플릿 + 선생님이 바꾼 값)
function T(p = P) {
  const tp = p?.topic || {};
  const base = isTpl(tp.tpl) ? TEMPLATES[tp.tpl] : TEMPLATES.plant;
  return { ...base, tpl: isTpl(tp.tpl) ? tp.tpl : 'plant',
    name: tp.title || base.name, item: tp.item || base.item, part: tp.part || base.part,
    audience: tp.audience || base.audience, question: tp.question || base.question };
}

/* ---------- 상수 ---------- */
const STEPS = [
  { n: 1, key: 'observe',  icon: '🔍', title: () => '관찰 노트',   sub: t => '관찰하고 특징을 기록해요' },
  { n: 2, key: 'criteria', icon: '📋', title: () => '기준 설계',   sub: t => `${t.part}의 특징으로 구별하는 기준을 세워요` },
  { n: 3, key: 'train',    icon: '🧠', title: () => 'AI 가르치기', sub: t => '사진 데이터로 AI를 가르쳐요' },
  { n: 4, key: 'test',     icon: '🧪', title: () => 'AI 시험',     sub: t => `AI가 처음 보는 ${josa(t.part, '으로/로')} 시험해요` },
  { n: 5, key: 'fix',      icon: '🛠️', title: () => '오답 노트',   sub: t => 'AI가 틀린 이유를 찾고 고쳐요' },
  { n: 6, key: 'cards',    icon: '🃏', title: () => '도감 카드',   sub: t => `${t.audience}에게 보여 줄 설명을 써요` },
  { n: 7, key: 'kid',      icon: '🧒', title: t => t.modeName,     sub: t => '안전장치를 정하고 직접 보여 줘요' },
  { n: 8, key: 'reflect',  icon: '🌱', title: () => '성찰',        sub: t => '돌아보고 더 나은 도감으로 다듬어요' },
];
const STEP_HELP = {
  observe: t => [`[관찰 사진 찍기]로 ${t.part} 사진을 찍어요.`, '사진마다 특징을 3가지 이상 적어요. 이름을 모르면 비워 둬도 괜찮아요.', '사람 얼굴은 찍지 않아요.'],
  criteria: t => [`도감에 넣을 ${t.item} 3~4가지를 정해요.`, `${josa(t.part, '을/를')} 보고 다른 것과 구별되는 특징을 적어요.`, '특징표만 보고 다른 모둠이 맞힐 수 있는지 시험해요.', 'AI도 우리 기준으로 구별할지 예상을 적어요.'],
  train: t => [`${t.item}마다 15~20장씩, 여러 방향·배경·밝기로 찍어요.`, `시험할 ${josa(t.part, '은/는')} 찍지 말고 따로 남겨 둬요.`, '[AI 학습시키기]를 눌러요.', '[바로 시험해 보기]로 잘 배웠는지 확인해요.'],
  test: t => [`다른 모둠과 바꾼 시험용 ${josa(t.part, '을/를')} 찍어요.`, 'AI 판단을 보고, 실제로 무엇인지 내가 골라요.', '근거를 특징표의 말로 써요.', '10개 이상 시험해 봐요.'],
  fix: t => ['AI가 틀린 사진마다 원인을 골라요.', '보완 계획을 쓰고 사진을 더 넣어요.', '다시 학습한 뒤 버전별 정확도를 비교해요.'],
  cards: t => [`${t.audience}에게 맞는 쉬운 말로 써요.`, '대표 사진을 고르고 출처를 밝혀요.', '[읽어 주기]로 들어 보고 고쳐요.', '짝 모둠의 의견을 받아 고쳐 써요.'],
  kid: t => ['AI가 틀리면 누구 책임일지 토의해요.', '확신도 기준을 바꿔 보며 결과를 비교하고, 우리 기준을 정해요.', `[${t.modeName} 시작]을 눌러 ${t.audience}에게 보여 줘요.`],
  reflect: t => ['피드백 결과를 보고 마지막으로 고쳐요.', '성찰 질문에 한 사람씩 답해요.', '포트폴리오를 만들어요.'],
};
const CAUSES = [
  { k: 'bg', label: '배경이 달라요' }, { k: 'color', label: '색이 달라요' }, { k: 'angle', label: '각도·밝기가 달라요' },
  { k: 'few', label: '사진이 부족해요' }, { k: 'similar', label: '비슷하게 생겼어요' }, { k: 'other', label: '기타' },
];
const RESP = ['AI', '만든 우리', '선생님', '사용한 사람'];
const REFLECT_QS = [
  { k: 'q1', q: 'AI는 어떻게 배웠나요?' },
  { k: 'q2', q: '우리가 특징표로 구별한 방법과 AI가 배운 방법은 무엇이 달랐나요?' },
  { k: 'q3', q: 'AI가 틀리지 않게 하려고 우리가 한 일은 무엇인가요?' },
  { k: 'q4', q: '앞으로 생활 속에서 AI를 쓸 때 꼭 기억할 점은 무엇인가요?' },
];
const COLORS = ['#2f9e44', '#e8590c', '#1971c2', '#c2255c', '#7048e8', '#0c8599'];

/* ---------- 작은 도구들 ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const pct = x => (x == null || isNaN(x)) ? '-' : Math.round(x * 100) + '%';
const pad = n => String(n).padStart(2, '0');
const fmtDate = t => { const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const fmtFull = t => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const ymd = () => { const d = new Date(); return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`; };
const nextFrame = () => new Promise(r => setTimeout(r, 0)); // 화면이 가려져도 멈추지 않도록 타이머 사용
const clean = (s, max = 60) => (typeof s === 'string' || typeof s === 'number' ? String(s) : '').replace(/[|<>"'`\\]/g, '').trim().slice(0, max);
const BAD_KEYS = ['__proto__', 'constructor', 'prototype'];
const safeId = s => typeof s === 'string' && /^[\w-]{1,64}$/.test(s);
const safeImg = s => typeof s === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s);
const safeColor = s => typeof s === 'string' && /^#[0-9a-f]{6}$/i.test(s);
const toInt = (v, lo, hi, d) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };
const toNum = (v, lo, hi, d) => { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };
const str = (v, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '');
// 받침에 따라 조사 고르기: josa('잎','으로/로') → '잎으로'
function josa(word, pair) {
  const w = String(word || '');
  const [a, b] = pair.split('/');
  const c = w.charCodeAt(w.length - 1);
  if (!(c >= 0xAC00 && c <= 0xD7A3)) return w + (pair === '으로/로' ? '(으)로' : `${a}(${b})`);
  const jong = (c - 0xAC00) % 28;
  if (pair === '으로/로') return w + (jong === 0 || jong === 8 ? '로' : '으로');
  return w + (jong ? a : b);
}
// FNV-1a 해시 (비밀번호·열기 코드용, 보안 장치가 아니라 교실용 잠금)
function fnv(s) {
  let h = 0x811c9dc5;
  const bytes = unescape(encodeURIComponent(s));
  for (let i = 0; i < bytes.length; i++) { h ^= bytes.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}
const hashPin = pin => 'h' + fnv('ai-dogam-pin:' + pin).toString(36);
const openCode = (key, n) => String(fnv(`${key}:open:${n}`) % 10000).padStart(4, '0');
const b64e = obj => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64d = s => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ---------- 저장소 (IndexedDB, 실패하면 메모리) ---------- */
const DB = {
  db: null,
  mem: { projects: {}, settings: {} },
  async open() {
    try {
      this.db = await new Promise((res, rej) => {
        const r = indexedDB.open('ai-dogam-studio', 1);
        r.onupgradeneeded = () => { r.result.createObjectStore('projects', { keyPath: 'id' }); r.result.createObjectStore('settings'); };
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    } catch (e) {
      this.db = null;
      setTimeout(() => toast('이 브라우저에서는 자동 저장이 안 돼요. 꼭 [파일로 저장]을 눌러 주세요.'), 500);
    }
  },
  _r(store, mode, fn) {
    return new Promise((res, rej) => {
      const r = fn(this.db.transaction(store, mode).objectStore(store));
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  },
  allProjects() { return this.db ? this._r('projects', 'readonly', os => os.getAll()) : Promise.resolve(Object.values(this.mem.projects)); },
  getProject(id) { return this.db ? this._r('projects', 'readonly', os => os.get(id)) : Promise.resolve(this.mem.projects[id]); },
  putProject(p) { if (!this.db) { this.mem.projects[p.id] = JSON.parse(JSON.stringify(p)); return Promise.resolve(); } return this._r('projects', 'readwrite', os => os.put(p)); },
  delProject(id) { if (!this.db) { delete this.mem.projects[id]; return Promise.resolve(); } return this._r('projects', 'readwrite', os => os.delete(id)); },
  getSetting(k) { return this.db ? this._r('settings', 'readonly', os => os.get(k)) : Promise.resolve(this.mem.settings[k]); },
  setSetting(k, v) { if (!this.db) { this.mem.settings[k] = v; return Promise.resolve(); } return this._r('settings', 'readwrite', os => os.put(v, k)); },
};

/* ---------- 상태 ---------- */
let P = null; // 지금 열려 있는 프로젝트
const ui = {
  step: 1, saveState: 'saved', aiState: 'idle',
  testDraft: null, member: '', kidSim: null, evalBusy: false,
  reflMember: null, kiosk: null, teacherUntil: 0, join: null, offline: null,
};
let saveTimer = null;

function newProject({ cls = '', group = '', school = '', topic = { tpl: 'plant' }, classId = null, classKey = null, pinHash = null } = {}) {
  return {
    id: uid(), app: 'ai-dogam-studio', schema: 2,
    school, cls, group, members: [], topic: { ...topic },
    classId, classKey, pinHash,
    createdAt: Date.now(), updatedAt: Date.now(), lastExportAt: null,
    unlocked: 1, lastStep: 1,
    rules: {}, observations: [], lostInfo: '',
    plants: [], criteriaReason: '', exchangeNote: '', prediction: '',
    aiGuess: '', samples: [], versions: [], goodData: '',
    tests: [], trustNote: '',
    trapNote: '', fixPlan: '', biasSociety: '', versionEval: [],
    copyrightNote: '', cards: {},
    kid: { threshold: 0.7, reason: '', resp: [], respNote: '', feedback: [] }, kidObservation: '',
    predictionCheck: '', reflection: {},
  };
}
// 기기 밖에서 들어온 파일(불러오기·대시보드)도 안전하게: 모양이 맞는 값만 남깁니다.
function normalize(p) {
  const base = newProject();
  for (const k in base) if (p[k] === undefined || typeof p[k] !== typeof base[k] && base[k] !== null) p[k] = base[k];
  if (!safeId(p.id)) p.id = uid();
  p.school = clean(p.school); p.cls = clean(p.cls); p.group = clean(p.group);
  p.topic = sanitizeTopic(p.topic);
  p.classId = safeId(p.classId) ? p.classId : null;
  p.classKey = safeId(p.classKey) ? p.classKey : null;
  p.pinHash = safeId(p.pinHash) ? p.pinHash : null;
  p.unlocked = toInt(p.unlocked, 1, 8, 1);
  p.lastStep = toInt(p.lastStep, 1, 8, 1);
  p.updatedAt = toNum(p.updatedAt, 0, 9e15, Date.now());
  p.lastExportAt = p.lastExportAt ? toNum(p.lastExportAt, 0, 9e15, null) : null;
  p.members = (Array.isArray(p.members) ? p.members : []).map(m => clean(m, 20)).filter(m => m && !BAD_KEYS.includes(m));
  const arr = a => (Array.isArray(a) ? a : []);
  p.observations = arr(p.observations).filter(o => o && safeId(o.id) && safeImg(o.img));
  p.plants = arr(p.plants).filter(x => x && safeId(x.id)).map((x, i) => ({ ...x, name: clean(x.name, 30), color: safeColor(x.color) ? x.color : COLORS[i % COLORS.length] }));
  p.samples = arr(p.samples).filter(s => s && safeId(s.id) && safeId(s.plantId) && safeImg(s.img));
  p.versions = arr(p.versions).filter(v => v && safeId(v.id)).map(v => ({ ...v, num: toInt(v.num, 1, 999, 1), experiment: !!v.experiment, at: toNum(v.at, 0, 9e15, 0), sampleIds: arr(v.sampleIds).filter(safeId), note: str(v.note, 100) }));
  p.tests = arr(p.tests).filter(x => x && safeId(x.id) && safeImg(x.img)).map(x => ({ ...x, aiConf: toNum(x.aiConf, 0, 1, 0), at: toNum(x.at, 0, 9e15, 0), reason: str(x.reason, 500), by: clean(x.by, 20), causes: arr(x.causes).filter(k => CAUSES.some(c => c.k === k)), version: safeId(x.version) ? x.version : null }));
  p.versionEval = arr(p.versionEval).map(e => ({ versionId: safeId(e.versionId) ? e.versionId : '', label: clean(e.label, 12), experiment: !!e.experiment, acc: e.acc == null ? null : toNum(e.acc, 0, 1, 0), ok: toInt(e.ok, 0, 9999, 0), n: toInt(e.n, 0, 9999, 0), at: toNum(e.at, 0, 9e15, 0) }));
  const cards = {};
  for (const [k, c] of Object.entries(p.cards && typeof p.cards === 'object' ? p.cards : {})) if (safeId(k) && c && typeof c === 'object') cards[k] = { ...c, photo: safeId(c.photo) ? c.photo : null, srcType: c.srcType === 'other' ? 'other' : 'own' };
  p.cards = cards;
  const refl = {};
  for (const [k, r] of Object.entries(p.reflection && typeof p.reflection === 'object' ? p.reflection : {})) { const kk = clean(k, 20); if (kk && !BAD_KEYS.includes(kk) && r && typeof r === 'object') refl[kk] = r; }
  p.reflection = refl;
  p.kid = { ...base.kid, ...(p.kid && typeof p.kid === 'object' ? p.kid : {}) };
  p.kid.threshold = toNum(p.kid.threshold, 0.3, 0.95, 0.7);
  p.kid.resp = arr(p.kid.resp).filter(r => RESP.includes(r));
  p.kid.feedback = arr(p.kid.feedback).map(f => ({ at: toNum(f.at, 0, 9e15, 0), plantId: safeId(f.plantId) ? f.plantId : null, conf: f.conf == null ? null : toNum(f.conf, 0, 1, 0), shown: !!f.shown, ok: f.ok === true ? true : f.ok === false ? false : null }));
  return p;
}
function save() {
  if (!P) return;
  P.updatedAt = Date.now();
  setSaveState('saving');
  clearTimeout(saveTimer);
  const proj = P; // 타이머가 돌 때 다른 프로젝트로 바뀌어도, 이 프로젝트를 저장합니다
  saveTimer = setTimeout(() => flushSave(proj), 400);
}
async function flushSave(proj = P) {
  clearTimeout(saveTimer);
  if (!proj) return;
  try { await DB.putProject(proj); setSaveState('saved'); }
  catch (e) { setSaveState('error'); toast('저장하지 못했어요: ' + e.message); }
}
function setSaveState(s) { ui.saveState = s; const el = $('#save-state'); if (el) el.textContent = saveLabel(); }
const saveLabel = () => ({ saving: '저장 중…', saved: '✓ 자동 저장됨', error: '⚠ 저장 실패' })[ui.saveState];

/* ---------- 프로젝트 조회 도우미 ---------- */
const plantById = id => P.plants.find(p => p.id === id);
const plantName = id => plantById(id)?.name || '(삭제된 항목)';
const plantColor = id => plantById(id)?.color || '#868e96';
const activeSamples = () => P.samples.filter(s => !s.removed);
const samplesOf = pid => activeSamples().filter(s => s.plantId === pid);
const mainVersions = () => P.versions.filter(v => !v.experiment);
const currentVersion = () => mainVersions().at(-1) || null;
const versionLabel = v => v ? (v.experiment ? `실험${v.num}` : `v${v.num}`) : '-';
const versionById = id => P.versions.find(v => v.id === id);
function needsRetrain() {
  const v = currentVersion();
  const now = activeSamples().map(s => s.id).sort().join();
  if (!v) return now.length > 0;
  return now !== [...v.sampleIds].sort().join();
}
function cardDoneIn(p, pid) {
  const c = p.cards[pid] || {};
  return ['feature', 'role', 'place'].every(k => (c[k] || '').trim()) && !!c.photo;
}
const cardDone = pid => cardDoneIn(P, pid);
const hasWork = () => P && (P.observations.length || P.samples.length || P.tests.length);

/* ---------- 이미지 처리 ---------- */
function loadImg(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}
// 가운데를 정사각형으로 잘라 224×224 JPEG로 저장 (AI 입력 크기와 같음)
function squareJpeg(source, size = 224) {
  const w = source.videoWidth || source.naturalWidth || source.width;
  const h = source.videoHeight || source.naturalHeight || source.height;
  const s = Math.min(w, h);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  c.getContext('2d').drawImage(source, (w - s) / 2, (h - s) / 2, s, s, 0, 0, size, size);
  return c.toDataURL('image/jpeg', 0.85);
}
async function fileToSquare(file) {
  const url = URL.createObjectURL(file);
  try { return squareJpeg(await loadImg(url)); } finally { URL.revokeObjectURL(url); }
}

/* ---------- AI 엔진 ---------- */
const AI = {
  model: null, promise: null, emb: new Map(),
  load() {
    if (this.model) return Promise.resolve(this.model);
    if (!this.promise) {
      setAiState('loading');
      this.promise = (async () => {
        if (typeof tf === 'undefined' || typeof mobilenet === 'undefined') throw new Error('AI 라이브러리를 불러오지 못했어요');
        await tf.ready();
        this.model = await mobilenet.load({ version: 2, alpha: 1.0 });
        setAiState('ready');
        checkOffline();
        return this.model;
      })().catch(e => { this.promise = null; setAiState('error'); throw e; });
    }
    return this.promise;
  },
  // 사진 → 특징 벡터(길이 1로 정규화). 같은 사진은 다시 계산하지 않음
  async embed(id, src) {
    if (this.emb.has(id)) return this.emb.get(id);
    const m = await this.load();
    const img = await loadImg(src);
    const v = tf.tidy(() => { const t = m.infer(img, true); return t.div(t.norm()).dataSync(); });
    const arr = Float32Array.from(v);
    this.emb.set(id, arr);
    return arr;
  },
  forget(id) { this.emb.delete(id); },
};
function setAiState(s) {
  ui.aiState = s;
  const el = $('#ai-state');
  if (el) { el.className = 'ai-state ' + s; el.textContent = aiLabel(); }
}
const aiLabel = () => ({ idle: 'AI 대기', loading: 'AI 준비 중…', ready: '● AI 준비 완료', error: '⚠ AI 연결 안 됨 (눌러서 다시)' })[ui.aiState];

// 최근접 이웃 분류: 항목마다 '가장 닮은 학습 사진 3장'과의 평균 유사도를 구해 가장 높은 항목으로 판단.
// 확신도 = (항목끼리 비교한 소프트맥스 값) × (익숙함: 가장 닮은 학습 사진과의 유사도).
// 학습하지 않은 물체를 보여 주면 익숙함이 낮아져 '처음 보는 것'이 커지고 확신도가 떨어집니다.
// 실제 사진으로 써 보고 필요하면 FAM_LO·FAM_HI를 조정하세요.
const SIM_TOP = 3, SIM_TEMP = 0.04, FAM_LO = 0.45, FAM_HI = 0.72;
const UNKNOWN = '__unknown';
async function predict(emb, version) {
  // 지운 항목의 사진은 다시 학습하기 전이라도 판단에 쓰지 않습니다
  const samples = version.sampleIds.map(id => P.samples.find(s => s.id === id)).filter(s => s && plantById(s.plantId));
  if (!samples.length) return null;
  const byPlant = {};
  for (const s of samples) {
    const e = await AI.embed(s.id, s.img);
    let d = 0;
    for (let i = 0; i < e.length; i++) d += e[i] * emb[i];
    (byPlant[s.plantId] ||= []).push(d);
  }
  const scores = Object.entries(byPlant).map(([plantId, arr]) => {
    arr.sort((a, b) => b - a);
    const k = Math.min(SIM_TOP, arr.length);
    return { plantId, m: arr.slice(0, k).reduce((a, b) => a + b, 0) / k };
  });
  const top = Math.max(...scores.map(s => s.m));
  let tot = 0;
  scores.forEach(s => { s.e = Math.exp((s.m - top) / SIM_TEMP); tot += s.e; });
  const best = scores.reduce((a, b) => (b.m > a.m ? b : a));
  const fam = Math.max(0, Math.min(1, (best.m - FAM_LO) / (FAM_HI - FAM_LO)));
  const dist = P.plants.map(pl => ({ plantId: pl.id, p: fam * (scores.find(s => s.plantId === pl.id)?.e || 0) / tot }));
  if (fam < 1) dist.push({ plantId: UNKNOWN, p: 1 - fam });
  dist.sort((a, b) => b.p - a.p);
  return { plantId: best.plantId, conf: fam * best.e / tot, dist, sim: best.m, fam };
}
async function predictImage(img, version) {
  const id = 'tmp-' + uid();
  try { const e = await AI.embed(id, img); return await predict(e, version); }
  finally { AI.forget(id); }
}
async function trainNew({ experiment = false, limit = null } = {}) {
  let set = activeSamples().filter(s => plantById(s.plantId));
  if (limit) {
    const keep = new Set(set.filter(s => s.plantId === limit.plantId).slice(0, limit.n).map(s => s.id));
    set = set.filter(s => s.plantId !== limit.plantId || keep.has(s.id));
  }
  if (new Set(set.map(s => s.plantId)).size < 2) { toast(`${T().item} 2가지 이상에 사진이 있어야 학습할 수 있어요.`); return null; }
  showModal(`<div class="train-progress"><div class="brain">🧠</div><h3>AI가 배우는 중…</h3>
    <p class="muted">사진마다 특징을 뽑아 기억하고 있어요.</p>
    <div class="progress"><div id="tp-bar"></div></div><p id="tp-text">준비 중…</p></div>`, { closable: false });
  try {
    await AI.load();
    for (let i = 0; i < set.length; i++) {
      await AI.embed(set[i].id, set[i].img);
      const bar = $('#tp-bar'), txt = $('#tp-text');
      if (bar) bar.style.width = ((i + 1) / set.length * 100) + '%';
      if (txt) txt.textContent = `${i + 1} / ${set.length}장`;
      await nextFrame();
    }
  } catch (e) {
    closeModal();
    toast('AI를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.');
    return null;
  }
  closeModal();
  const num = P.versions.filter(v => !!v.experiment === experiment).length + 1;
  const counts = {};
  set.forEach(s => { counts[s.plantId] = (counts[s.plantId] || 0) + 1; });
  const v = {
    id: uid(), num, experiment, at: Date.now(), sampleIds: set.map(s => s.id), counts,
    note: limit ? `${plantName(limit.plantId)} 사진 ${limit.n}장만 사용` : '',
  };
  P.versions.push(v);
  ui.kidSim = null;
  save();
  toast(`${versionLabel(v)} 학습 완료! 사진 ${set.length}장을 배웠어요.`);
  return v;
}
async function evalVersion(v) {
  let ok = 0, n = 0;
  for (const t of P.tests) {
    if (!plantById(t.actualPlantId)) continue;
    const e = await AI.embed(t.id, t.img);
    const r = await predict(e, v);
    n++;
    if (r && r.plantId === t.actualPlantId) ok++;
  }
  return { ok, n, acc: n ? ok / n : null };
}

/* ---------- 모달 ---------- */
const modalStack = [];
function showModal(html, { onClose, closable = true, wide = false, cls = '' } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap';
  wrap.innerHTML = `<div class="modal ${wide ? 'wide' : ''} ${cls}" role="dialog" aria-modal="true">${html}</div>`;
  if (closable) wrap.addEventListener('mousedown', e => { if (e.target === wrap) closeModal(); });
  wrap.dataset.closable = closable ? '1' : '';
  $('#modal-root').appendChild(wrap);
  modalStack.push({ wrap, onClose });
  return wrap.querySelector('.modal');
}
function closeModal() {
  const top = modalStack.pop();
  if (!top) return;
  top.wrap.remove();
  top.onClose?.();
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalStack.length && modalStack.at(-1).wrap.dataset.closable) closeModal();
});

/* ---------- 비밀번호 ---------- */
async function devicePinHash() {
  let h = await DB.getSetting('pinHash');
  if (!h) { const legacy = await DB.getSetting('pin'); if (legacy) { h = hashPin(legacy); await DB.setSetting('pinHash', h); } }
  return h || null;
}
// 학급 링크로 만든 프로젝트는 링크에 담긴 선생님 비밀번호를, 그 밖에는 이 기기의 비밀번호를 씁니다.
// 학생 태블릿처럼 기기 비밀번호가 없으면, 이 기기에 있는 학급 프로젝트의 선생님 비밀번호를 씁니다.
async function classPinHash() { return (await DB.allProjects()).find(p => safeId(p.pinHash))?.pinHash || null; }
async function activePinHash() { return P?.pinHash || await devicePinHash() || await classPinHash(); }
function setPinModal() {
  return new Promise(res => {
    let ok = false;
    const m = showModal(`<h3>🔒 교사용 비밀번호 정하기</h3>
      <p class="muted">이 기기에서 교사 메뉴를 열 때 쓸 비밀번호예요. 학생에게 알려 주지 마세요.</p>
      <input type="password" inputmode="numeric" id="np1" placeholder="새 비밀번호 (4자리 이상)" autocomplete="new-password" class="pin-input">
      <input type="password" inputmode="numeric" id="np2" placeholder="한 번 더" autocomplete="new-password" class="pin-input" style="margin-top:8px">
      <p class="err" id="np-err"></p>
      <div class="row end"><button class="btn ghost" data-x="no">취소</button><button class="btn primary" data-x="ok">정하기</button></div>`,
      { onClose: () => res(ok), cls: 'narrow' });
    const go = async () => {
      const a = m.querySelector('#np1').value.trim(), b = m.querySelector('#np2').value.trim();
      if (a.length < 4) { m.querySelector('#np-err').textContent = '4자리 이상으로 정해 주세요.'; return; }
      if (a !== b) { m.querySelector('#np-err').textContent = '두 번 입력한 비밀번호가 달라요.'; return; }
      await DB.setSetting('pinHash', hashPin(a));
      ok = true;
      closeModal();
      toast('교사용 비밀번호를 정했어요.');
    };
    m.querySelector('[data-x=ok]').onclick = go;
    m.querySelector('[data-x=no]').onclick = () => closeModal();
    m.querySelector('#np2').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    setTimeout(() => m.querySelector('#np1').focus(), 50);
  });
}
function askPin(title = '선생님 확인', hash) {
  return new Promise(res => {
    let ok = false;
    const m = showModal(`<h3>🔒 ${esc(title)}</h3><p class="muted">교사용 비밀번호를 입력하세요.</p>
      <input type="password" inputmode="numeric" id="pin-in" autocomplete="off" class="pin-input">
      <p class="err" id="pin-err"></p>
      <div class="row end"><button class="btn ghost" data-pin="no">취소</button><button class="btn primary" data-pin="ok">확인</button></div>`,
      { onClose: () => res(ok), cls: 'narrow' });
    const input = m.querySelector('#pin-in');
    const check = () => {
      if (hashPin(input.value) === hash) { ok = true; closeModal(); }
      else { m.querySelector('#pin-err').textContent = '비밀번호가 달라요.'; input.select(); }
    };
    m.querySelector('[data-pin=ok]').onclick = check;
    m.querySelector('[data-pin=no]').onclick = () => closeModal();
    input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    setTimeout(() => input.focus(), 50);
  });
}
// allowCreate: 비밀번호가 하나도 없는 기기에서만, 교사 메뉴 버튼으로 들어올 때 새로 정하게 합니다.
async function teacherGate(title, allowCreate = false) {
  if (Date.now() < ui.teacherUntil) return true;
  const h = await activePinHash();
  if (!h) {
    if (!allowCreate) { toast('교사용 비밀번호가 아직 없어요. 선생님이 [🔒 교사] 메뉴에서 먼저 정해 주세요.'); return false; }
    if (!(await setPinModal())) return false;
    ui.teacherUntil = Date.now() + 10 * 60 * 1000;
    return true;
  }
  const ok = await askPin(title, h);
  if (ok) ui.teacherUntil = Date.now() + 10 * 60 * 1000;
  return ok;
}

/* ---------- 카메라 ---------- */
async function openCamera({ title = '사진 찍기', multi = false, kid = false, onCapture, onClose }) {
  let stream = null, count = 0;
  const m = showModal(`<div class="cam ${kid ? 'kid' : ''}">
      <div class="cam-head"><h3>${esc(title)}</h3><button class="icon-btn" data-cam="close" aria-label="닫기">✕</button></div>
      <div class="cam-view"><video playsinline muted autoplay></video><div class="cam-msg">카메라를 켜는 중…</div><div class="cam-flash"></div></div>
      <p class="cam-tip">${kid ? '화면 가운데에 크게 보이게 해 주세요' : '네모 안에 꽉 차게 찍어요. 보이는 그대로 저장돼요.'}</p>
      <div class="cam-bar">
        <label class="btn ghost file-btn">🖼️ 사진 고르기<input type="file" accept="image/*" ${multi ? 'multiple' : ''} hidden data-cam="file"></label>
        <button class="shutter" data-cam="shot" disabled aria-label="찍기"></button>
        <label class="btn primary file-btn cam-fallback" hidden>📷 카메라로 찍기<input type="file" accept="image/*" capture="environment" hidden data-cam="file"></label>
        <div class="cam-count">${multi ? '<b id="cam-n">0</b>장 찍음' : ''}</div>
      </div>
      ${multi ? '<div class="cam-strip"></div><div class="row end"><button class="btn primary" data-cam="close">다 찍었어요</button></div>' : ''}
    </div>`, { onClose: () => { stream?.getTracks().forEach(t => t.stop()); onClose?.(); }, wide: true, cls: 'cam-modal' });

  const video = m.querySelector('video'), msg = m.querySelector('.cam-msg'), shot = m.querySelector('[data-cam=shot]');
  const flash = () => { const f = m.querySelector('.cam-flash'); f.classList.remove('on'); void f.offsetWidth; f.classList.add('on'); };
  const deliver = dataURL => {
    count++;
    if (multi) {
      m.querySelector('#cam-n').textContent = count;
      m.querySelector('.cam-strip').insertAdjacentHTML('afterbegin', `<img src="${dataURL}" alt="">`);
      flash();
      onCapture(dataURL);
    } else {
      closeModal();
      onCapture(dataURL);
    }
  };
  const showFallback = () => { shot.hidden = true; m.querySelector('.cam-fallback').hidden = false; };
  shot.onclick = () => { if (video.videoWidth) deliver(squareJpeg(video)); };
  m.querySelectorAll('input[data-cam=file]').forEach(fi => {
    fi.onchange = async () => {
      for (const f of [...fi.files]) {
        try { const d = await fileToSquare(f); deliver(d); if (!multi) break; }
        catch { toast('이 사진은 열 수 없어요.'); }
      }
      fi.value = '';
    };
  });
  m.querySelectorAll('[data-cam=close]').forEach(b => { b.onclick = () => closeModal(); });

  if (navigator.mediaDevices?.getUserMedia && window.isSecureContext) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      if (!document.body.contains(m)) { stream.getTracks().forEach(t => t.stop()); return; }
      video.srcObject = stream;
      await video.play().catch(() => {});
      msg.remove();
      shot.disabled = false;
    } catch (e) {
      msg.innerHTML = '카메라를 켤 수 없어요.<br>아래 버튼으로 사진을 찍거나 골라 주세요.';
      showFallback();
    }
  } else {
    msg.innerHTML = '이 화면에서는 카메라를 바로 켤 수 없어요.<br>아래 버튼으로 사진을 찍거나 골라 주세요.';
    showFallback();
  }
}

/* ---------- 음성(읽어 주기) ---------- */
function speak(text) {
  if (!('speechSynthesis' in window)) { toast('이 기기는 읽어 주기를 지원하지 않아요.'); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 0.95;
  const v = speechSynthesis.getVoices().find(x => x.lang && x.lang.startsWith('ko'));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
function cardSpeech(pid) {
  const p = plantById(pid), c = P.cards[pid] || {}, t = T();
  return [p?.name, ...t.card.map(f => c[f.k] && `${f.label}. ${c[f.k]}`), c.message].filter(Boolean).join('. ');
}

/* ---------- 오프라인 준비 상태 ---------- */
async function checkOffline() {
  if (!('caches' in window)) { ui.offline = false; return; }
  try {
    // 라이브러리 파일이 아니라 모델 가중치(model.json)가 저장됐는지 확인
    const c = await caches.open('ai-dogam-model');
    ui.offline = (await c.keys()).some(r => /model\.json|tfhub\.dev|kaggle|storage\.googleapis\.com/.test(r.url));
  } catch { ui.offline = false; }
}

/* ---------- 화면 조각 ---------- */
const ta = (bind, val, ph = '', rows = 3) => `<textarea data-bind="${esc(bind)}" rows="${rows}" placeholder="${esc(ph)}">${esc(val || '')}</textarea>`;
const inp = (bind, val, ph = '') => `<input type="text" data-bind="${esc(bind)}" value="${esc(val || '')}" placeholder="${esc(ph)}">`;
const sel = (bind, val, opts, ph = '선택') => `<select data-bind="${esc(bind)}"><option value="">${esc(ph)}</option>${opts.map(o => `<option ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
const fieldInput = (bind, f, val) => f.opts ? sel(bind, val, f.opts, f.label) : inp(bind, val, f.ph ? `${f.label} (${f.ph})` : f.label);
const empty = t => `<div class="empty">${t}</div>`;
const needMsg = (t, step) => `<section class="card empty-step"><p>${t}</p>${step <= P.unlocked ? `<button class="btn" data-act="go" data-step="${step}">${step}차시로 가기</button>` : ''}</section>`;
const questionBanner = () => `<div class="banner"><span>❓ 핵심 질문</span><b>${esc(T().question)}</b></div>`;
const famNote = r => (r && r.fam < 0.6) ? '<p class="fam-note">🤔 학습한 사진과 많이 달라서 AI가 자신 없어해요. (처음 보는 것이거나 배경·각도가 달라서일 수 있어요)</p>' : '';
function resultBars(dist) {
  return `<div class="bars">${dist.map(d => {
    const unk = d.plantId === UNKNOWN;
    return `<div class="bar-row ${unk ? 'unk' : ''}"><span class="bl">${unk ? '처음 보는 것' : esc(plantName(d.plantId))}</span>
    <div class="btrack"><div class="bfill" style="width:${d.p * 100}%;background:${unk ? '#adb5bd' : plantColor(d.plantId)}"></div></div><span class="bv">${pct(d.p)}</span></div>`;
  }).join('')}</div>`;
}
function stepHelp(key) {
  const items = STEP_HELP[key](T());
  return `<details class="help"><summary>❓ 이렇게 해요</summary><ol>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ol></details>`;
}
function guideCard() {
  const t = T();
  if (t.guide === 'leaf') {
    return `<section class="card leaf-ref">${leafSVG()}<div><h2>잎의 구조</h2><ul class="plain">
      <li><b>잎몸</b> 잎의 넓은 부분</li><li><b>잎자루</b> 잎몸과 줄기를 잇는 부분</li>
      <li><b>잎맥</b> 잎몸에 있는 줄무늬 (그물맥 · 나란히맥)</li><li><b>가장자리</b> 잎의 테두리 (매끈함 · 톱니 · 갈라짐)</li></ul></div></section>`;
  }
  if (t.guide === 'recycle') {
    return `<section class="card"><h2>분리배출 4가지 약속</h2><div class="rule4">
      <div><b>비우기</b><span>내용물을 비워요</span></div><div><b>헹구기</b><span>물로 깨끗이 헹궈요</span></div>
      <div><b>분리하기</b><span>라벨·뚜껑을 떼요</span></div><div><b>섞지 않기</b><span>종류별로 따로 모아요</span></div></div>
      <p class="muted small">물건에 있는 분리배출 표시(PET, 플라스틱, 캔류, 종이팩 등)도 찾아보세요.</p></section>`;
  }
  return `<section class="card"><h2>관찰 포인트</h2><p>${t.features.map(f => `<b>${esc(f.label)}</b>`).join(' · ')}을 살펴보면 서로 구별하기 쉬워요.</p></section>`;
}
function leafSVG() {
  return `<svg viewBox="0 0 260 200" class="leaf-svg" role="img" aria-label="잎의 구조: 잎몸, 잎맥, 잎자루, 가장자리">
    <path d="M130 18 C190 38 214 100 130 152 C46 100 70 38 130 18 Z" fill="#d3f9d8" stroke="#2f9e44" stroke-width="2.5"/>
    <g stroke="#2f9e44" stroke-width="1.6" fill="none">
      <path d="M130 22 L130 152"/><path d="M130 55 L104 40"/><path d="M130 55 L156 40"/>
      <path d="M130 85 L90 68"/><path d="M130 85 L170 68"/><path d="M130 115 L98 102"/><path d="M130 115 L162 102"/>
    </g>
    <path d="M130 152 L130 188" stroke="#8d6e3f" stroke-width="5" stroke-linecap="round"/>
    <g font-size="13" font-weight="700" fill="#1f2d1f">
      <line x1="96" y1="96" x2="30" y2="110" stroke="#868e96"/><text x="6" y="126">잎몸</text>
      <line x1="162" y1="102" x2="222" y2="118" stroke="#868e96"/><text x="212" y="134">잎맥</text>
      <line x1="133" y1="176" x2="178" y2="182" stroke="#868e96"/><text x="182" y="187">잎자루</text>
      <line x1="80" y1="50" x2="32" y2="34" stroke="#868e96"/><text x="4" y="28">가장자리</text>
    </g></svg>`;
}
function topicPickerHTML(prefix, topic = { tpl: 'plant' }) {
  const t = TEMPLATES[topic.tpl] || TEMPLATES.plant;
  return `<div class="field">주제
      <div class="tpl-pick">${Object.entries(TEMPLATES).map(([k, v]) => `<button type="button" class="tpl ${k === topic.tpl ? 'on' : ''}" data-tpl="${k}" data-prefix="${prefix}">
        <span class="ti">${v.icon}</span><b>${v.label}</b><span class="ts">${esc(v.season)}</span></button>`).join('')}</div></div>
    <div class="tpl-custom" id="${prefix}-custom" ${topic.tpl === 'custom' ? '' : 'hidden'}>
      <div class="two"><label class="field">프로젝트 이름 <input id="${prefix}-title" value="${esc(topic.title || '')}" placeholder="예: 우리 학교 곤충 도감"></label>
      <label class="field">구별할 것 (종류) <input id="${prefix}-item" value="${esc(topic.item || '')}" placeholder="예: 곤충"></label></div>
      <div class="two"><label class="field">카메라로 찍을 것 <input id="${prefix}-part" value="${esc(topic.part || '')}" placeholder="예: 곤충"></label>
      <label class="field">핵심 질문 <input id="${prefix}-question" value="${esc(topic.question || '')}" placeholder="비워 두면 기본 질문"></label></div></div>
    <label class="field">도감을 쓸 사람 <input id="${prefix}-audience" value="${esc(topic.audience || '')}" placeholder="${esc(t.audience)} (비워 두면 기본값)"></label>`;
}
function readTopic(root, prefix) {
  const on = root.querySelector(`.tpl.on[data-prefix="${prefix}"]`);
  const tpl = on ? on.dataset.tpl : 'plant';
  const v = id => clean(root.querySelector(`#${prefix}-${id}`)?.value);
  const topic = { tpl };
  if (v('audience')) topic.audience = v('audience');
  if (tpl === 'custom') {
    ['title', 'item', 'part', 'question'].forEach(k => { if (v(k)) topic[k] = v(k); });
  }
  return topic;
}

/* ---------- 메인 렌더 ---------- */
function render() {
  if (!P) { renderStart(); return; }
  const t = T();
  const step = STEPS[ui.step - 1];
  const exportAgo = P.lastExportAt ? fmtDate(P.lastExportAt) : null;
  $('#app').innerHTML = `
    <header class="topbar">
      <div class="brand">${t.icon} <span>${esc(t.name)}</span></div>
      <button class="proj" data-act="groupInfo" title="모둠 정보">${esc(P.cls || '반')} · ${esc(P.group || '모둠')} <span class="muted">✎</span></button>
      <button id="ai-state" class="ai-state ${ui.aiState}" data-act="aiRetry">${aiLabel()}</button>
      <span id="save-state" class="save-state">${saveLabel()}</span>
      <div class="top-actions">
        <button class="btn sm ghost" data-act="exportJson">💾 파일로 저장</button>
        <button class="btn sm ghost" data-act="teacher">🔒 교사</button>
        <button class="btn sm ghost" data-act="switchProject">처음 화면</button>
      </div>
    </header>
    <nav class="steps" aria-label="차시">${STEPS.map(s => `
      <button class="step-pill ${s.n === ui.step ? 'on' : ''} ${s.n > P.unlocked ? 'locked' : ''}" data-act="go" data-step="${s.n}" ${s.n > P.unlocked ? 'aria-label="잠긴 차시, 눌러서 열기 코드 입력"' : ''}>
        <span class="sn">${s.n > P.unlocked ? '🔒' : s.n}</span><span class="st">${esc(s.title(t))}</span></button>`).join('')}
    </nav>
    <main class="main">
      <div class="step-head"><div class="step-icon">${step.icon}</div>
        <div class="grow"><div class="step-kicker">${step.n}차시 · ${esc(step.title(t))}</div><h1>${esc(step.sub(t))}</h1></div></div>
      ${stepHelp(step.key)}
      ${RENDER[step.key]()}
    </main>
    <footer class="foot">
      ${ui.step > 1 ? `<button class="btn ghost" data-act="go" data-step="${ui.step - 1}">← ${ui.step - 1}차시</button>` : '<span></span>'}
      ${hasWork() ? `<button class="export-hint ${exportAgo ? '' : 'warn'}" data-act="exportJson">💾 ${exportAgo ? `마지막 파일 저장 ${exportAgo}` : '아직 파일로 저장하지 않았어요'}</button>` : '<span></span>'}
      ${ui.step < 8 ? (ui.step + 1 <= P.unlocked
        ? `<button class="btn" data-act="go" data-step="${ui.step + 1}">${ui.step + 1}차시 →</button>`
        : `<button class="btn ghost" data-act="go" data-step="${ui.step + 1}">🔒 ${ui.step + 1}차시 열기</button>`) : '<span></span>'}
    </footer>`;
  if (step.key === 'kid') computeKidSim();
}

/* ---------- 시작 화면 ---------- */
async function renderStart() {
  if (ui.join) { renderJoin(); return; }
  const list = (await DB.allProjects()).sort((a, b) => b.updatedAt - a.updatedAt);
  const classes = (await DB.getSetting('classes')) || [];
  $('#app').innerHTML = `<div class="start">
    <div class="start-hero"><div class="logo">🌿</div><h1>AI 도감 스튜디오</h1>
      <p>사진으로 AI를 직접 가르쳐, 동생들을 위한 AI 도감을 만드는 8차시 프로젝트</p></div>
    <div class="start-grid">
      <section class="card"><h2>🧑‍🎓 학생</h2>
        <p class="muted small">선생님이 준 <b>학급 링크나 QR 코드</b>로 들어오면 학급과 주제가 자동으로 정해져요.</p>
        ${list.length ? `<h3>이 기기의 프로젝트</h3><div class="proj-list">${list.map(p => { const t = T(normalize(p)); return `<button class="proj-item" data-act="openProject" data-id="${p.id}">
          <b>${t.icon} ${esc(p.school ? p.school + ' ' : '')}${esc(p.cls)} · ${esc(p.group)}</b><span>${esc(t.name)} · ${p.unlocked}차시까지 열림 · ${fmtDate(p.updatedAt)}</span></button>`; }).join('')}</div>` : ''}
        <label class="btn ghost file-btn full">📂 파일에서 불러오기<input type="file" accept=".json,application/json" data-file="importProject" hidden></label>
        <details class="mini-details"><summary>학급 링크 없이 새로 시작하기</summary>
          <div class="two"><label class="field">반 <input id="np-cls" placeholder="예: 6-1"></label><label class="field">모둠 <input id="np-group" placeholder="예: 3모둠"></label></div>
          ${topicPickerHTML('np')}
          <button class="btn primary full" data-act="newProject">시작하기</button></details>
      </section>
      <section class="card"><h2>🧑‍🏫 선생님</h2>
        <p class="muted small">학급을 만들면 학생용 링크·QR 코드와 차시 열기 코드가 생겨요. 학생 기기마다 따로 설정할 필요가 없어요.</p>
        <button class="btn primary full" data-act="classCreate">＋ 학급 만들기</button>
        ${classes.length ? `<h3>내가 만든 학급</h3><div class="proj-list">${classes.map(c => `<button class="proj-item" data-act="classOpen" data-id="${c.id}">
          <b>${TEMPLATES[c.topic?.tpl]?.icon || '🌿'} ${esc(c.school ? c.school + ' ' : '')}${esc(c.cls)}</b><span>${esc(T({ topic: c.topic }).name)} · 모둠 ${c.groups}개</span></button>`).join('')}</div>` : ''}
        <div class="row wrap" style="margin-top:8px">
          <button class="btn ghost" data-act="guide">📘 교사 안내</button>
          <button class="btn ghost" data-act="teacher">📊 대시보드·설정</button></div>
      </section>
    </div>
    <div class="privacy"><b>🔐 개인정보 안내</b> 사진과 기록은 이 기기 안에만 저장되고 어디로도 보내지 않아요. 회원가입이 없어요. 사람 얼굴은 찍지 않도록 지도해 주세요.</div>
    <p class="muted small center">AI 도감 스튜디오 v${APP_VERSION} · 다른 기기로 옮길 때는 [파일로 저장]을 이용하세요.</p>
  </div>`;
}

/* ---------- 학급 링크로 들어오기 ---------- */
async function renderJoin() {
  const c = ui.join;
  const t = T({ topic: c.t });
  const mine = (await DB.allProjects()).filter(p => p.classId === c.id);
  $('#app').innerHTML = `<div class="start">
    <div class="start-hero"><div class="logo">${t.icon}</div><h1>${esc(c.s ? c.s + ' ' : '')}${esc(c.c)}</h1>
      <p><b>${esc(t.name)}</b> 프로젝트에 참여해요</p></div>
    <section class="card join-card">
      ${mine.length ? `<h2>이어서 하기</h2><div class="proj-list">${mine.map(p => `<button class="proj-item" data-act="openProject" data-id="${p.id}">
        <b>${esc(p.group)}</b><span>${p.unlocked}차시까지 열림 · ${fmtDate(p.updatedAt)} 저장</span></button>`).join('')}</div><h3>새로 시작하기</h3>` : '<h2>우리 모둠을 골라요</h2>'}
      <div class="group-pick">${Array.from({ length: c.g }, (_, i) => `<button class="gbtn" data-act="joinGroup" data-n="${i + 1}">${i + 1}모둠</button>`).join('')}</div>
      <div class="privacy small"><b>약속</b> ${t.rules.map(esc).join(' · ')}<br>사진과 기록은 이 기기에만 저장돼요.</div>
      <button class="btn ghost full" data-act="leaveJoin">처음 화면으로</button>
    </section></div>`;
}

/* =====================================================================
   차시별 화면
   ===================================================================== */
const RENDER = {
  /* ---- 1차시: 관찰 노트 ---- */
  observe() {
    const t = T(), obs = P.observations;
    return `${questionBanner()}
    <section class="card"><h2>관찰 약속</h2>
      <div class="checks">${t.rules.map((r, i) => `<label class="check"><input type="checkbox" data-bind="p|rules.r${i + 1}" ${P.rules?.['r' + (i + 1)] ? 'checked' : ''}> ${esc(r)}</label>`).join('')}</div></section>
    <section class="card">
      <div class="row-between wrap"><h2>관찰 노트 <span class="pill">${obs.length}장</span></h2>
        <button class="btn primary" data-act="obsCapture">📷 관찰 사진 찍기</button></div>
      <p class="muted">사진마다 특징을 3가지 이상 적어 보세요. 이름을 모르면 비워 두어도 괜찮아요.</p>
      ${obs.length ? `<div class="obs-grid">${obs.map(obsCard).join('')}</div>` : empty(`아직 관찰 사진이 없어요. ${esc(t.part)} 사진을 찍어 보세요.`)}
    </section>
    <section class="card think"><h2>💭 생각해 보기</h2>
      <p>실물(아날로그)을 사진(디지털 데이터)으로 바꾸면 어떤 정보가 사라질까요?</p>
      ${ta('p|lostInfo', P.lostInfo, '예: 만졌을 때 느낌, 냄새, 실제 크기…')}</section>`;
  },

  /* ---- 2차시: 기준 설계 ---- */
  criteria() {
    const t = T();
    return `${guideCard()}
    <section class="card">
      <div class="row-between wrap"><h2>도감에 넣을 ${esc(t.item)} <span class="pill">${P.plants.length}가지</span></h2>
        <button class="btn primary" data-act="plantAdd" ${P.plants.length >= 6 ? 'disabled' : ''}>+ 추가</button></div>
      <p class="muted">3~4가지를 골라 서로 구별되는 특징을 적어요. AI도 이 이름으로 배우게 돼요.</p>
      ${P.plants.length ? `<div class="plant-grid">${P.plants.map(plantEditor).join('')}</div>` : empty(`[+ 추가]를 눌러 ${esc(t.item)} 이름을 정해 주세요.`)}
    </section>
    ${P.plants.length ? `<section class="card"><h2>우리 모둠 특징표</h2>
      <p class="muted">다른 모둠에게 이 표만 보여 주고, 맞힐 수 있는지 시험해 보세요.</p><div id="feature-table">${featureTable()}</div></section>` : ''}
    <section class="card think"><h2>📝 기준을 이렇게 정한 이유</h2>
      ${ta('p|criteriaReason', P.criteriaReason, '예: 누가 봐도 똑같이 판단할 수 있는 특징이라서')}
      <h3>기준 교환 시험 결과</h3>
      ${ta('p|exchangeNote', P.exchangeNote, '다른 모둠이 우리 특징표로 맞혔나요? 무엇을 고쳤나요?')}</section>
    <section class="card think"><h2>🔮 예상해 보기</h2>
      <p>AI도 우리가 세운 기준(${t.features.slice(0, 2).map(f => esc(f.label)).join(', ')}…)으로 구별할까요?</p>
      ${ta('p|prediction', P.prediction, '나의 예상과 그 이유')}
      <p class="muted small">이 예상은 8차시에 다시 확인해요.</p></section>`;
  },

  /* ---- 3차시: AI 가르치기 ---- */
  train() {
    const t = T();
    if (P.plants.length < 2) return needMsg(`먼저 2차시에서 ${esc(josa(t.item, '을/를'))} 2가지 이상 정해 주세요.`, 2);
    const cv = currentVersion();
    const counts = P.plants.map(p => samplesOf(p.id).length);
    const max = Math.max(...counts), min = Math.min(...counts);
    const warn = [];
    if (min < 10) warn.push(`사진이 10장보다 적은 ${esc(josa(t.item, '이/가'))} 있어요. 15~20장씩 모아 보세요.`);
    if (min > 0 && max / min >= 2) warn.push('사진 수 차이가 커요. AI가 사진이 많은 쪽으로 기울 수 있어요.');
    const exps = P.versions.filter(v => v.experiment);
    return `<section class="card think"><h2>💭 먼저 생각해 보기</h2>
      <p>사람은 특징표로 구별했어요. AI는 무엇을 보고 배울까요?</p>${ta('p|aiGuess', P.aiGuess, '나의 생각')}</section>
    <section class="card"><h2>학습 데이터 모으기</h2>
      <p class="muted">여러 방향·배경·밝기로 15~20장씩 찍어요. <b>시험할 ${esc(josa(t.part, '은/는'))} 찍지 말고 따로 남겨 두세요!</b></p>
      <div class="sample-list">${P.plants.map(sampleRow).join('')}</div>
      ${warn.length ? `<div class="warn">${warn.map(w => '⚠ ' + w).join('<br>')}</div>` : ''}</section>
    ${trainBox(cv)}
    <section class="card"><div class="row-between wrap"><h2>🔎 바로 시험해 보기</h2>
      <div class="row">${versionSelect()}<button class="btn" data-act="quickTry" ${P.versions.length ? '' : 'disabled'}>📷 찍어서 시험</button></div></div>
      <p class="muted">모둠 안에서 가볍게 확인하는 시험이에요. 기록은 남지 않아요. 정식 시험은 4차시에 해요.</p>
      <div id="quick-result"></div></section>
    <details class="card" ${exps.length ? 'open' : ''}><summary>🧪 데이터 실험: 사진이 적으면 어떻게 될까?</summary>
      <div class="row wrap exp-form">
        <label>${esc(t.item)} <select id="exp-plant">${P.plants.map(p => `<option value="${p.id}">${esc(p.name || '이름 없음')}</option>`).join('')}</select></label>
        <label><input id="exp-n" type="number" min="1" max="30" value="3"> 장만 사용해서</label>
        <button class="btn" data-act="trainExp">실험용 AI 만들기</button></div>
      <p class="muted small">실험용 AI는 위의 [바로 시험해 보기]에서 골라 비교할 수 있어요. 실제 도감에는 쓰이지 않아요.</p>
      ${exps.length ? `<ul class="plain small">${exps.map(v => `<li><b>${versionLabel(v)}</b> ${esc(v.note)} (${fmtDate(v.at)})</li>`).join('')}</ul>` : ''}</details>
    <section class="card think"><h2>📝 정리</h2><p>좋은 학습 데이터의 조건은 무엇일까요?</p>
      ${ta('p|goodData', P.goodData, '예: 사진이 많아야 한다, 여러 배경에서 찍어야 한다…')}</section>`;
  },

  /* ---- 4차시: AI 시험 ---- */
  test() {
    const t = T(), cv = currentVersion();
    if (!cv) return needMsg('먼저 3차시에서 AI를 학습시켜 주세요.', 3);
    const d = ui.testDraft, tests = P.tests, n = tests.length;
    const ok = tests.filter(x => x.aiPlantId === x.actualPlantId).length;
    return `<section class="card test-card"><h2>시험하기 <span class="muted small">· 시험에 쓰는 AI: ${versionLabel(cv)}</span></h2>
      ${needsRetrain() ? '<p class="warn-text">학습 후 바뀐 사진이 있어요. 3차시에서 다시 학습하면 최신 AI로 시험할 수 있어요.</p>' : ''}
      ${d ? testDraftView(d) : `<div class="test-start"><p>AI가 한 번도 본 적 없는 ${esc(josa(t.part, '을/를'))} 보여 주세요. (다른 모둠과 바꾼 시험용)</p>
        ${memberPicker()}<button class="btn big primary" data-act="testCapture">📷 시험할 ${esc(t.part)} 찍기</button></div>`}</section>
    <section class="card"><div class="stats">
      <div class="stat"><div class="num">${n}</div><div>시험한 수</div></div>
      <div class="stat"><div class="num">${ok}</div><div>AI가 맞힌 수</div></div>
      <div class="stat hl"><div class="num">${n ? pct(ok / n) : '-'}</div><div>정확도</div></div></div>
      ${n ? confusion() : ''}</section>
    <section class="card"><h2>판단 기록</h2>${n ? testTable() : empty('아직 시험 기록이 없어요.')}</section>
    <section class="card think"><h2>💭 토의</h2><p>10번 중 8번 맞힌 AI를 ${esc(t.audience)}에게 주어도 될까요? 정확도가 높으면 믿어도 될까요?</p>
      ${ta('p|trustNote', P.trustNote, '우리 모둠의 생각')}</section>`;
  },

  /* ---- 5차시: 오답 노트 ---- */
  fix() {
    const t = T(), cv = currentVersion();
    if (!cv || !P.tests.length) return needMsg('4차시에서 AI 시험 기록을 먼저 남겨 주세요.', 4);
    const wrong = P.tests.filter(x => x.aiPlantId !== x.actualPlantId);
    const cc = {};
    wrong.forEach(x => (x.causes || []).forEach(c => { cc[c] = (cc[c] || 0) + 1; }));
    return `<section class="card think"><h2>💭 AI는 ${esc(josa(t.part, '을/를'))} 본 걸까, 배경을 본 걸까?</h2>
      <p class="muted">선생님의 '함정 AI' 시연을 보고 생각을 적어요.</p>${ta('p|trapNote', P.trapNote, '함정 AI는 왜 틀렸을까?')}</section>
    <section class="card"><h2>오답 노트 <span class="pill">${wrong.length}개</span></h2>
      <p class="muted">AI가 틀린 사진마다 원인을 골라요. 여러 개를 골라도 돼요.</p>
      ${wrong.length ? `<div class="wrong-grid">${wrong.map(wrongCard).join('')}</div>
        <div class="cause-sum"><b>원인 모아 보기</b> ${CAUSES.map(c => `<span class="pill ${cc[c.k] ? 'ok' : ''}">${c.label} ${cc[c.k] || 0}</span>`).join('')}</div>`
        : empty('AI가 틀린 사진이 없어요! 더 헷갈리는 것으로 시험해 볼까요?')}</section>
    <section class="card"><h2>보완 계획</h2>
      ${ta('p|fixPlan', P.fixPlan, t.fixPh, 3)}
      <h3>데이터 보완하기</h3><div class="sample-list compact">${P.plants.map(sampleRow).join('')}</div></section>
    ${trainBox(cv, true)}
    <section class="card"><div class="row-between wrap"><h2>📊 버전별 정확도 비교</h2>
      <button class="btn" data-act="evalVersions" ${ui.evalBusy ? 'disabled' : ''}>${ui.evalBusy ? '계산 중…' : '같은 시험 사진으로 비교하기'}</button></div>
      <p class="muted">4차시 시험 사진 ${P.tests.length}장을 모든 버전의 AI에게 다시 보여 주고 정확도를 비교해요.</p>
      ${versionChart()}</section>
    <section class="card think"><h2>🌏 생각 넓히기</h2><p>사람을 판단하는 AI가 한쪽으로 치우친 데이터로만 배우면 어떤 일이 생길까요?</p>
      ${ta('p|biasSociety', P.biasSociety, '우리 모둠의 생각')}</section>`;
  },

  /* ---- 6차시: 도감 카드 ---- */
  cards() {
    const t = T();
    if (!P.plants.length) return needMsg('먼저 2차시에서 도감에 넣을 것을 정해 주세요.', 2);
    const done = P.plants.filter(p => cardDone(p.id)).length;
    return `<section class="card think"><h2>©️ 인터넷 사진과 글을 그대로 가져와도 될까?</h2>
      <ul class="plain"><li>✔ 우리가 직접 찍은 사진을 써요.</li><li>✔ 책이나 누리집을 참고했다면 출처를 꼭 적어요.</li><li>✔ 남의 글을 그대로 베끼지 않고 우리 말로 바꿔 써요.</li></ul>
      ${ta('p|copyrightNote', P.copyrightNote, '토의에서 정한 우리 모둠의 약속')}</section>
    <section class="card"><h2>도감 카드 <span class="pill ${done === P.plants.length ? 'ok' : ''}">${done}/${P.plants.length} 완성</span></h2>
      <p class="muted">${esc(t.audience)}에게 맞는 쉬운 말로 써요. 어려운 말은 풀어서 설명해요.</p>
      <div class="card-editors">${P.plants.map(cardEditor).join('')}</div></section>`;
  },

  /* ---- 7차시: 공유(동생) 모드 ---- */
  kid() {
    const t = T(), cv = currentVersion();
    if (!cv) return needMsg('먼저 3차시에서 AI를 학습시켜 주세요.', 3);
    const done = P.plants.filter(p => cardDone(p.id)).length;
    return `<section class="card think"><h2>⚖️ 우리 AI가 ${esc(t.audience)}에게 틀린 답을 알려 주면 누구 책임일까?</h2>
      <div class="choice">${RESP.map(r => `<button class="chip ${P.kid.resp?.includes(r) ? 'on' : ''}" data-act="respToggle" data-k="${r}">${r}</button>`).join('')}</div>
      ${ta('p|kid.respNote', P.kid.respNote, '그렇게 생각한 이유')}</section>
    <section class="card"><h2>🛡️ 안전장치: 확신도 기준 정하기</h2>
      <p>AI의 확신도가 기준보다 낮으면 이름 대신 <b>"잘 모르겠어요. 선생님께 물어봐요"</b>를 보여 줘요.</p>
      <div class="threshold"><span class="muted small">30%</span><input type="range" min="30" max="95" step="5" value="${Math.round(P.kid.threshold * 100)}" id="th-range" aria-label="확신도 기준"><span class="muted small">95%</span><div class="th-val" id="th-val">${pct(P.kid.threshold)}</div></div>
      <div id="kid-sim">${kidSimView()}</div>
      <p class="muted small">💡 기준을 너무 높이면? 너무 낮추면? 바꿔 보면서 이야기해 보세요.</p>
      <label class="field">우리 모둠이 이 기준을 고른 이유 ${ta('p|kid.reason', P.kid.reason, '예: 틀린 답을 알려 주는 것보다 모른다고 하는 게 더 안전해서')}</label></section>
    <section class="card kid-launch"><div class="row-between wrap"><div><h2>🧒 ${esc(t.modeName)}</h2>
      <p>도감 카드 ${done}/${P.plants.length} 완성 · AI ${versionLabel(cv)} · 확신도 기준 ${pct(P.kid.threshold)}</p>
      ${done < P.plants.length ? '<p class="warn-text">아직 완성하지 않은 도감 카드가 있어요.</p>' : ''}
      ${needsRetrain() ? '<p class="warn-text">학습 후 바뀐 사진이 있어요. 다시 학습하면 최신 AI가 쓰여요.</p>' : ''}</div>
      <button class="btn big primary" data-act="kidStart">${esc(t.modeName)} 시작 ▶</button></div></section>
    <section class="card"><h2>피드백</h2>${feedbackSummary()}
      <label class="field">사용한 사람이 헷갈려한 점 ${ta('p|kidObservation', P.kidObservation, '시연하면서 본 것을 적어요')}</label></section>`;
  },

  /* ---- 8차시: 성찰 ---- */
  reflect() {
    const members = reflectMembers();
    const m = members.includes(ui.reflMember) ? ui.reflMember : members[0];
    return `<section class="card"><h2>피드백 결과</h2>${feedbackSummary()}</section>
    <section class="card"><div class="row-between wrap"><h2>📈 우리 AI의 성장</h2>
      <button class="btn" data-act="evalVersions" ${ui.evalBusy ? 'disabled' : ''}>${ui.evalBusy ? '계산 중…' : '최신 결과로 다시 계산'}</button></div>
      ${versionChart()}
      <div class="row wrap"><button class="btn ghost" data-act="go" data-step="3">📷 데이터 보완하러 가기</button>
        <button class="btn ghost" data-act="go" data-step="6">🃏 도감 카드 고치러 가기</button></div></section>
    <section class="card think"><h2>🔮 2차시에 한 예상 다시 보기</h2>
      <blockquote>${P.prediction ? esc(P.prediction) : '<span class="muted">예상을 적지 않았어요.</span>'}</blockquote>
      <p>AI가 실제로 무엇을 보고 배웠는지 알게 된 지금, 예상이 맞았나요?</p>
      ${ta('p|predictionCheck', P.predictionCheck, '예상과 실제 비교')}</section>
    <section class="card"><h2>🌱 성찰 질문</h2>
      <div class="row wrap">작성자 ${members.map(x => `<button class="chip ${x === m ? 'on' : ''}" data-act="reflMember" data-k="${esc(x)}">${esc(x)}</button>`).join('')}
        ${P.members.length ? '' : '<button class="btn sm ghost" data-act="groupInfo">모둠원 등록하기</button>'}</div>
      ${REFLECT_QS.map(q => `<label class="field q">${q.q} ${ta(`refl|${m}|${q.k}`, P.reflection[m]?.[q.k], '', 3)}</label>`).join('')}</section>
    <section class="card"><div class="row-between wrap"><div><h2>🖨️ 포트폴리오</h2>
      <p class="muted">8차시 동안의 기록을 모아 인쇄하거나 PDF로 저장해요.</p></div>
      <button class="btn big primary" data-act="print">포트폴리오 만들기</button></div></section>`;
  },
};

/* ---------- 차시 화면에서 쓰는 조각들 ---------- */
// 모둠원 + 모둠원 등록 전에 '모둠' 이름으로 쓴 성찰까지 함께 보여 줍니다
function reflectMembers() {
  const list = [...P.members];
  for (const k of Object.keys(P.reflection)) if (!list.includes(k)) list.push(k);
  return list.length ? list : ['모둠'];
}
function obsCard(o) {
  const t = T();
  return `<div class="obs-card">
    <div class="obs-img"><img src="${o.img}" alt="관찰 사진"><button class="icon-btn del" data-act="obsDel" data-id="${o.id}" aria-label="지우기">✕</button></div>
    <div class="obs-fields">
      <span class="badge" id="ob-${o.id}">${obsBadge(o)}</span>
      ${inp(`obs|${o.id}|name`, o.name, '이름 (알면)')}
      ${t.features.map(f => fieldInput(`obs|${o.id}|${f.k}`, f, o[f.k])).join('')}
      ${t.obsExtra.map(f => inp(`obs|${o.id}|${f.k}`, o[f.k], f.ph)).join('')}
      ${inp(`obs|${o.id}|place`, o.place, t.placeLabel)}
    </div></div>`;
}
function obsBadge(o) {
  const t = T();
  const keys = [...t.features.map(f => f.k), ...t.obsExtra.map(f => f.k)];
  const n = keys.filter(k => (o[k] || '').trim() && o[k] !== '잘 모르겠음').length;
  return `<span class="${n >= 3 ? 'ok' : ''}">특징 ${n}개${n >= 3 ? ' ✓' : ''}</span>`;
}
function plantEditor(p) {
  const t = T();
  return `<div class="plant-card" style="--pc:${p.color}">
    <div class="row"><span class="dot"></span><input class="plant-name" type="text" data-bind="plant|${p.id}|name" value="${esc(p.name)}" placeholder="이름">
      <button class="icon-btn" data-act="plantDel" data-id="${p.id}" aria-label="지우기">✕</button></div>
    ${t.features.map(f => `<label class="field">${esc(f.label)} ${f.opts ? sel(`plant|${p.id}|${f.k}`, p[f.k], f.opts) : inp(`plant|${p.id}|${f.k}`, p[f.k], f.ph)}</label>`).join('')}</div>`;
}
function featureTable() {
  const t = T();
  return `<div class="table-wrap"><table class="ftable"><thead><tr><th>${esc(t.item)}</th>${t.features.map(f => `<th>${esc(f.label)}</th>`).join('')}</tr></thead>
    <tbody>${P.plants.map(p => `<tr><td><span class="dot" style="--pc:${p.color}"></span> <b>${esc(p.name || '이름 없음')}</b></td>
      ${t.features.map(f => `<td>${esc(p[f.k] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function sampleRow(p) {
  const ss = samplesOf(p.id);
  return `<div class="sample-row" style="--pc:${p.color}">
    <div class="sample-head"><span class="dot"></span><b>${esc(p.name || '이름 없음')}</b>
      <span class="pill ${ss.length >= 15 ? 'ok' : ss.length >= 10 ? 'mid' : 'low'}">${ss.length}장</span>
      <span class="grow"></span>
      <button class="btn sm" data-act="sampleCapture" data-id="${p.id}">📷 찍기</button>
      <button class="btn sm ghost" data-act="sampleFromObs" data-id="${p.id}">관찰 노트에서</button></div>
    <div class="thumbs">${ss.map(s => `<div class="thumb"><img src="${s.img}" alt="" loading="lazy"><button class="x" data-act="sampleDel" data-id="${s.id}" aria-label="사진 빼기">✕</button></div>`).join('') || '<span class="muted small">아직 사진이 없어요</span>'}</div></div>`;
}
function trainBox(cv, again = false) {
  return `<section class="card train-box"><div class="row-between wrap">
    <div><h2>${again ? '다시 학습하기' : 'AI 학습시키기'}</h2>
      <p>${cv ? `현재 AI: <b>${versionLabel(cv)}</b> · 사진 ${cv.sampleIds.length}장 학습 · ${fmtDate(cv.at)}` : '아직 학습한 AI가 없어요.'}</p>
      ${cv && needsRetrain() ? '<p class="warn-text">새로 바뀐 사진이 있어요. 다시 학습해야 AI가 배워요.</p>' : ''}</div>
    <button class="btn big primary" data-act="train">🧠 AI 학습시키기 (v${mainVersions().length + 1})</button></div>
    ${mainVersions().length ? `<p class="muted small">학습 기록: ${mainVersions().map(v => `${versionLabel(v)}(${v.sampleIds.length}장)`).join(' → ')}</p>` : ''}</section>`;
}
function versionSelect() {
  const vs = [...P.versions].reverse();
  if (!vs.length) return '';
  const cur = currentVersion();
  return `<select id="quick-version" aria-label="시험할 AI">${vs.map(v => `<option value="${v.id}" ${cur && v.id === cur.id ? 'selected' : ''}>${versionLabel(v)}${v.experiment ? ' (실험)' : ''}</option>`).join('')}</select>`;
}
function memberPicker() {
  if (!P.members.length) return `<p class="muted small">기록하는 사람을 남기려면 <button class="link" data-act="groupInfo">모둠원을 등록</button>하세요.</p>`;
  return `<div class="row wrap member-pick">기록하는 사람 ${P.members.map(m => `<button class="chip ${ui.member === m ? 'on' : ''}" data-act="pickMember" data-k="${esc(m)}">${esc(m)}</button>`).join('')}</div>`;
}
function testDraftView(d) {
  const t = T(), r = d.result;
  const reasonOk = (d.reason || '').trim().length >= 5;
  return `<div class="test-flow">
    <div class="test-img"><img src="${d.img}" alt="시험 사진"></div>
    <div class="test-steps">
      <div class="tstep"><div class="tnum">1</div><div class="tbody"><h3>AI 판단</h3>
        ${d.error ? '<p class="warn-text">AI를 불러오지 못했어요. 인터넷 연결을 확인하고 다시 찍어 주세요.</p>'
          : r ? `<p class="ai-answer" style="--pc:${plantColor(r.plantId)}">🤖 <b>${esc(plantName(r.plantId))}</b> <span>확신도 ${pct(r.conf)}</span></p>${famNote(r)}${resultBars(r.dist)}`
          : '<p class="thinking">🤖 AI가 생각하는 중…</p>'}</div></div>
      <div class="tstep ${r ? '' : 'dim'}"><div class="tnum">2</div><div class="tbody"><h3>내 판단: 실제로는 무엇인가요?</h3>
        <div class="choice">${P.plants.map(p => `<button class="chip ${d.actual === p.id ? 'on' : ''}" style="--pc:${p.color}" data-act="testActual" data-id="${p.id}" ${r ? '' : 'disabled'}>${esc(p.name || '이름 없음')}</button>`).join('')}</div>
        ${d.actual && r ? `<p class="${d.actual === r.plantId ? 'agree' : 'disagree'}">${d.actual === r.plantId ? '✔ AI와 내 판단이 같아요' : '✘ AI와 내 판단이 달라요'}</p>` : ''}</div></div>
      <div class="tstep ${d.actual ? '' : 'dim'}"><div class="tnum">3</div><div class="tbody"><h3>내 근거</h3>
        <p class="muted small">특징표의 말(${t.features.slice(0, 3).map(f => esc(f.label)).join(', ')}…)을 써서 설명해요.</p>
        <textarea id="test-reason" rows="2" ${d.actual ? '' : 'disabled'} placeholder="${esc(t.reasonPh)}">${esc(d.reason || '')}</textarea></div></div>
      <div class="row end"><button class="btn ghost" data-act="testCancel">취소</button>
        <button class="btn primary" data-act="testSave" id="test-save" ${d.actual && reasonOk ? '' : 'disabled'}>기록하고 다음 →</button></div>
    </div></div>`;
}
function confusion() {
  const pl = P.plants;
  const cnt = (a, b) => P.tests.filter(x => x.actualPlantId === a && x.aiPlantId === b).length;
  return `<h3>무엇을 헷갈렸을까?</h3><div class="table-wrap"><table class="ctable">
    <thead><tr><th>실제 ＼ AI 판단</th>${pl.map(p => `<th>${esc(p.name)}</th>`).join('')}</tr></thead>
    <tbody>${pl.map(a => `<tr><th>${esc(a.name)}</th>${pl.map(b => { const c = cnt(a.id, b.id); return `<td class="${c ? (a.id === b.id ? 'hit' : 'miss') : ''}">${c || ''}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div>
    <p class="muted small">초록 칸은 맞힌 수, 빨간 칸은 헷갈린 수예요.</p>`;
}
function testTable() {
  return `<div class="table-wrap"><table class="ttable"><thead><tr><th>사진</th><th>AI 판단</th><th>내 판단</th><th></th><th>근거</th><th>기록</th><th></th></tr></thead>
    <tbody>${[...P.tests].reverse().map(x => {
      const same = x.aiPlantId === x.actualPlantId;
      return `<tr><td><img class="mini" src="${x.img}" alt=""></td>
        <td>${esc(plantName(x.aiPlantId))}<br><span class="muted small">${pct(x.aiConf)}</span></td>
        <td>${esc(plantName(x.actualPlantId))}</td><td class="${same ? 'agree' : 'disagree'}">${same ? '✔' : '✘'}</td>
        <td class="reason">${esc(x.reason)}</td>
        <td class="small muted">${esc(x.by || '')}<br>${versionLabel(versionById(x.version))} · ${fmtDate(x.at)}</td>
        <td><button class="icon-btn" data-act="testDel" data-id="${x.id}" aria-label="기록 지우기">✕</button></td></tr>`;
    }).join('')}</tbody></table></div>`;
}
function wrongCard(x) {
  return `<div class="wrong-card"><img src="${x.img}" alt="">
    <div><p><span class="muted">AI</span> <b style="color:${plantColor(x.aiPlantId)}">${esc(plantName(x.aiPlantId))}</b> → <span class="muted">실제</span> <b style="color:${plantColor(x.actualPlantId)}">${esc(plantName(x.actualPlantId))}</b></p>
    <div class="choice small">${CAUSES.map(c => `<button class="chip sm ${(x.causes || []).includes(c.k) ? 'on' : ''}" data-act="causeToggle" data-id="${x.id}" data-k="${c.k}">${c.label}</button>`).join('')}</div></div></div>`;
}
function versionChart() {
  const ev = P.versionEval || [];
  if (!ev.length) return empty('아직 비교한 결과가 없어요. 버튼을 눌러 계산해 보세요.');
  return `<div class="vchart">${ev.map(e => `<div class="vbar-row ${e.experiment ? 'exp' : ''}"><span class="vl">${esc(e.label)}</span>
    <div class="vtrack"><div class="vfill" style="width:${(e.acc || 0) * 100}%"></div></div><span class="vv">${pct(e.acc)} <small>(${e.ok}/${e.n})</small></span></div>`).join('')}</div>
    <p class="muted small">${fmtDate(ev[0].at)}에 계산 · 시험 사진 ${ev[0].n}장 기준${ev.some(e => e.experiment) ? ' · 회색은 실험용 AI' : ''}</p>`;
}
function cardEditor(p) {
  const t = T(), c = P.cards[p.id] || {}, ss = samplesOf(p.id);
  return `<div class="card-edit" style="--pc:${p.color}">
    <div class="ce-form">
      <h3><span class="dot"></span>${esc(p.name || '이름 없음')} ${cardDone(p.id) ? '<span class="pill ok">완성</span>' : ''}</h3>
      ${t.card.map(f => `<label class="field">${esc(f.label)} ${f.short ? inp(`card|${p.id}|${f.k}`, c[f.k], f.ph) : ta(`card|${p.id}|${f.k}`, c[f.k], f.ph, 2)}</label>`).join('')}
      <label class="field">한마디 ${inp(`card|${p.id}|message`, c.message, t.messagePh)}</label>
      <div class="field">대표 사진<div class="thumbs pick">${ss.map(s => `<button class="thumb ${c.photo === s.id ? 'on' : ''}" data-act="cardPhoto" data-pid="${p.id}" data-id="${s.id}" aria-label="대표 사진으로 고르기"><img src="${s.img}" alt="" loading="lazy"></button>`).join('') || '<span class="muted small">3차시에 찍은 사진이 여기에 나와요</span>'}</div></div>
      <div class="field">사진 출처
        <div class="row wrap"><label class="radio"><input type="radio" name="src-${p.id}" value="own" data-bind="card|${p.id}|srcType" ${c.srcType !== 'other' ? 'checked' : ''}> 우리가 직접 찍음</label>
        <label class="radio"><input type="radio" name="src-${p.id}" value="other" data-bind="card|${p.id}|srcType" ${c.srcType === 'other' ? 'checked' : ''}> 다른 자료</label></div>
        ${inp(`card|${p.id}|ref`, c.ref, '참고한 책·누리집 출처 (있으면)')}</div>
      <label class="field">짝 모둠 의견 ${ta(`card|${p.id}|peer`, c.peer, `${t.audience}에게 쉬운가요? 고칠 점은?`, 2)}</label>
    </div>
    <div class="ce-preview"><p class="muted small">보여 줄 모습</p>${cardView(p, true)}
      <button class="btn sm" data-act="speak" data-pid="${p.id}">🔊 읽어 주기</button></div></div>`;
}
function cardView(p, withId = false, big = false) {
  const t = T(), c = P.cards[p.id] || {};
  const photo = P.samples.find(s => s.id === c.photo);
  return `<div class="dogam-card ${big ? 'big' : ''}" ${withId ? `id="preview-${p.id}"` : ''} style="--pc:${p.color}">
    <div class="dc-photo">${photo ? `<img src="${photo.img}" alt="${esc(p.name)} 사진">` : '<div class="ph">대표 사진</div>'}</div>
    <div class="dc-body"><div class="dc-name">${esc(p.name || '이름 없음')}</div>
      ${t.card.map(f => c[f.k] ? `<p><b>${f.icon} ${esc(f.label)}</b>${esc(c[f.k])}</p>` : '').join('')}
      ${c.message ? `<p class="dc-msg">💬 ${esc(c.message)}</p>` : ''}
      <p class="dc-src">사진: ${c.srcType === 'other' ? '다른 자료' : `${esc(P.cls || '우리 반')} 친구들이 직접 찍음`}${c.ref ? ` · 참고: ${esc(c.ref)}` : ''}</p></div></div>`;
}
function kidSimView() {
  if (!P.tests.length) return '<p class="muted">4차시 시험 기록이 있으면, 기준에 따라 보여 줄 결과를 미리 볼 수 있어요.</p>';
  const s = ui.kidSim;
  if (!s || s.busy) return '<p class="muted">미리 계산하는 중…</p>';
  if (s.error) return '<p class="muted">AI를 불러오지 못해 미리 볼 수 없어요.</p>';
  const th = P.kid.threshold;
  let good = 0, bad = 0, unk = 0;
  s.rows.forEach(r => { if (r.conf < th) unk++; else if (r.correct) good++; else bad++; });
  return `<p class="small muted">4차시 시험 사진 ${s.rows.length}장을 이 기준으로 보여 준다면…</p>
    <div class="sim-bar">${good ? `<div class="g" style="flex:${good}"></div>` : ''}${unk ? `<div class="u" style="flex:${unk}"></div>` : ''}${bad ? `<div class="b" style="flex:${bad}"></div>` : ''}</div>
    <div class="sim-legend"><span class="g">✔ 맞는 답 ${good}장</span><span class="u">🤔 잘 모르겠어요 ${unk}장</span><span class="b">✘ 틀린 답 ${bad}장</span></div>`;
}
async function computeKidSim() {
  const cv = currentVersion();
  if (!cv || !P.tests.length) return;
  if (ui.kidSim && !ui.kidSim.error && !ui.kidSim.busy && ui.kidSim.versionId === cv.id && ui.kidSim.n === P.tests.length) return;
  if (ui.kidSim?.busy) return;
  const pid = P.id;
  ui.kidSim = { busy: true, rows: [] };
  try {
    const rows = [];
    for (const x of P.tests) {
      const e = await AI.embed(x.id, x.img);
      const r = await predict(e, cv);
      rows.push({ conf: r.conf, correct: r.plantId === x.actualPlantId });
    }
    if (!P || P.id !== pid) return;
    ui.kidSim = { versionId: cv.id, n: P.tests.length, rows };
  } catch (e) {
    ui.kidSim = { error: true };
  }
  const el = $('#kid-sim');
  if (el) el.innerHTML = kidSimView();
}
function feedbackSummary() {
  const fb = P.kid.feedback;
  if (!fb.length) return empty('아직 피드백이 없어요.');
  const yes = fb.filter(f => f.shown && f.ok === true).length;
  const no = fb.filter(f => f.shown && f.ok === false).length;
  const unk = fb.filter(f => !f.shown).length;
  const per = P.plants.map(p => {
    const f = fb.filter(x => x.shown && x.plantId === p.id);
    return { p, yes: f.filter(x => x.ok === true).length, no: f.filter(x => x.ok === false).length };
  }).filter(r => r.yes + r.no);
  return `<div class="stats">
      <div class="stat"><div class="num">${fb.length}</div><div>써 본 횟수</div></div>
      <div class="stat good"><div class="num">${yes}</div><div>맞아요 😊</div></div>
      <div class="stat bad"><div class="num">${no}</div><div>틀려요 🤔</div></div>
      <div class="stat"><div class="num">${unk}</div><div>잘 모르겠어요</div></div></div>
    ${per.length ? `<div class="table-wrap"><table class="ftable"><thead><tr><th>AI가 알려 준 답</th><th>맞아요</th><th>틀려요</th></tr></thead>
      <tbody>${per.map(r => `<tr><td>${esc(r.p.name)}</td><td>${r.yes}</td><td>${r.no}</td></tr>`).join('')}</tbody></table></div>` : ''}`;
}

/* =====================================================================
   공유(동생) 모드 — 키오스크
   ===================================================================== */
function kioskOpen() {
  ui.kiosk = { stage: 'home' };
  document.body.insertAdjacentHTML('beforeend', '<div id="kiosk" class="kiosk"></div>');
  kioskRender();
  try { document.documentElement.requestFullscreen?.().catch(() => {}); } catch { /* 전체 화면을 못 써도 괜찮음 */ }
}
function kioskRender() {
  const k = $('#kiosk');
  if (!k) return;
  const t = T(), st = ui.kiosk;
  const top = `<div class="k-top"><span>${t.icon} ${esc(t.name)}</span><button class="k-exit" data-act="kioskExit">나가기</button></div>`;
  if (st.stage === 'home') {
    k.innerHTML = `${top}<div class="k-home"><div class="k-title">${esc(t.kioskTitle)}</div>
      <p>${esc(t.kioskPrompt)}</p>
      <button class="k-shot" data-act="kioskShot"><span class="k-cam">📷</span><span>${esc(t.kioskBtn)}</span></button>
      <p class="k-credit">${esc(P.cls)} ${esc(P.group)} 친구들이 만들었어요</p></div>`;
  } else if (st.stage === 'thinking') {
    k.innerHTML = `${top}<div class="k-home"><div class="k-think">🤖</div><div class="k-title">생각하는 중…</div></div>`;
  } else if (st.stage === 'result') {
    const r = st.result, p = r && plantById(r.plantId);
    if (st.shown && p) {
      k.innerHTML = `${top}<div class="k-result">${cardView(p, false, true)}
        <div class="k-q">맞았나요?</div>
        <div class="k-fb"><button class="k-btn yes" data-act="kidFb" data-ok="1">맞아요 😊</button><button class="k-btn no" data-act="kidFb" data-ok="0">틀려요 🤔</button></div>
        <button class="btn ghost" data-act="kidSpeak">🔊 다시 듣기</button></div>`;
    } else {
      k.innerHTML = `${top}<div class="k-home"><div class="k-think">🤔</div><div class="k-title">잘 모르겠어요</div>
        <p>선생님이나 만든 친구들에게 물어봐요!</p>
        <button class="k-btn yes" data-act="kidFb" data-ok="u">다시 해 볼래요</button></div>`;
    }
  }
}

/* =====================================================================
   인쇄: 포트폴리오 · 학생용 접속 안내
   ===================================================================== */
function printHTML(html) {
  $('#print-root').innerHTML = html;
  document.body.classList.add('printing');
  setTimeout(() => {
    window.print();
    setTimeout(() => { document.body.classList.remove('printing'); $('#print-root').innerHTML = ''; }, 500);
  }, 300);
}
function printPortfolio() {
  const t = T(), pn = id => esc(plantName(id));
  const members = reflectMembers();
  const n = P.tests.length, ok = P.tests.filter(x => x.aiPlantId === x.actualPlantId).length;
  const wrong = P.tests.filter(x => x.aiPlantId !== x.actualPlantId);
  const qa = (q, a) => `<div class="pq"><b>${esc(q)}</b><p>${a ? esc(a) : '<span class="muted">(작성하지 않음)</span>'}</p></div>`;
  printHTML(`<div class="portfolio">
    <h1>${esc(t.name)} 프로젝트 포트폴리오</h1>
    <p class="pmeta">${esc(P.school)} ${esc(P.cls)} ${esc(P.group)} · 모둠원: ${esc(P.members.join(', ') || '-')} · ${fmtFull(Date.now())}</p>
    <p class="pmeta">핵심 질문: ${esc(t.question)}</p>
    <h2>1차시 · 관찰 노트 (${P.observations.length}장)</h2>
    <div class="pgrid">${P.observations.map(o => `<div class="pobs"><img src="${o.img}" alt=""><div>${esc(o.name || '')}<br><span class="small">${esc([...t.features, ...t.obsExtra].map(f => o[f.k]).filter(Boolean).join(' · '))}</span></div></div>`).join('')}</div>
    ${qa('사진으로 바꾸면 사라지는 정보', P.lostInfo)}
    <h2>2차시 · 특징표</h2>${featureTable()}
    ${qa('기준을 정한 이유', P.criteriaReason)}${qa('기준 교환 시험 결과', P.exchangeNote)}${qa('AI도 우리 기준으로 구별할까? (예상)', P.prediction)}
    <h2>3차시 · AI 가르치기</h2>
    <p>${P.plants.map(p => `${esc(p.name)} ${samplesOf(p.id).length}장`).join(' · ')}</p>
    <p>학습 기록: ${P.versions.map(v => `${versionLabel(v)}(${v.sampleIds.length}장${v.note ? ', ' + esc(v.note) : ''})`).join(' → ') || '-'}</p>
    ${qa('AI는 무엇을 보고 배울까?', P.aiGuess)}${qa('좋은 학습 데이터의 조건', P.goodData)}
    <h2>4차시 · AI 시험</h2><p>시험 ${n}개 · AI가 맞힌 수 ${ok}개 · 정확도 ${n ? pct(ok / n) : '-'}</p>
    ${n ? `<table class="ftable"><thead><tr><th>AI 판단</th><th>내 판단</th><th>일치</th><th>근거</th><th>기록</th></tr></thead><tbody>
      ${P.tests.map(x => `<tr><td>${pn(x.aiPlantId)} (${pct(x.aiConf)})</td><td>${pn(x.actualPlantId)}</td><td>${x.aiPlantId === x.actualPlantId ? 'O' : 'X'}</td><td>${esc(x.reason)}</td><td>${esc(x.by || '')}</td></tr>`).join('')}</tbody></table>` : ''}
    ${qa('정확도가 높으면 믿어도 될까?', P.trustNote)}
    <h2>5차시 · 오답 노트</h2>
    ${wrong.length ? `<ul>${wrong.map(x => `<li>AI ${pn(x.aiPlantId)} → 실제 ${pn(x.actualPlantId)} : ${esc((x.causes || []).map(k => CAUSES.find(c => c.k === k)?.label).join(', ') || '원인 미선택')}</li>`).join('')}</ul>` : '<p>AI가 틀린 사진 없음</p>'}
    ${qa('보완 계획', P.fixPlan)}
    <p><b>버전별 정확도</b> ${(P.versionEval || []).map(e => `${esc(e.label)} ${pct(e.acc)}`).join(' → ') || '-'}</p>
    ${qa('한쪽 데이터로 배운 AI가 사람을 판단한다면?', P.biasSociety)}
    <h2>6차시 · 도감 카드</h2>${qa('저작권 약속', P.copyrightNote)}
    <div class="pcards">${P.plants.map(p => cardView(p)).join('')}</div>
    <h2>7차시 · ${esc(t.modeName)}</h2>
    <p>AI 오류의 책임에 대한 우리 생각: ${esc((P.kid.resp || []).join(', ') || '-')}</p>${qa('그 이유', P.kid.respNote)}
    <p>확신도 기준: <b>${pct(P.kid.threshold)}</b></p>${qa('기준을 고른 이유', P.kid.reason)}
    ${feedbackSummary()}${qa('사용한 사람이 헷갈려한 점', P.kidObservation)}
    <h2>8차시 · 성찰</h2>${qa('예상과 실제 비교', P.predictionCheck)}
    ${members.map(m => `<h3>${esc(m)}</h3>${REFLECT_QS.map(q => qa(q.q, P.reflection[m]?.[q.k])).join('')}`).join('')}
  </div>`);
}
function joinLink(c) {
  const payload = { v: 1, id: c.id, k: c.key, s: c.school, c: c.cls, t: c.topic, g: c.groups, h: c.pinHash };
  return `${location.origin}${location.pathname}#join=${b64e(payload)}`;
}
function qrSVG(text, cell = 5) {
  if (typeof qrcode === 'undefined') return '<p class="muted small">QR 코드를 만들 수 없어요(인터넷 연결 확인). 아래 링크를 쓰세요.</p>';
  try {
    const q = qrcode(0, 'M');
    q.addData(text);
    q.make();
    return q.createSvgTag({ cellSize: cell, margin: 2, scalable: true });
  } catch { return '<p class="muted small">링크가 너무 길어 QR 코드를 만들 수 없어요.</p>'; }
}
function printHandout(c) {
  const t = T({ topic: c.topic }), link = joinLink(c);
  printHTML(`<div class="handout">
    <h1>${t.icon} ${esc(t.name)}</h1>
    <p class="pmeta">${esc(c.school)} ${esc(c.cls)} · AI 도감 스튜디오</p>
    <div class="qr-big">${qrSVG(link, 8)}</div>
    <ol class="steps-list"><li>태블릿 카메라로 QR 코드를 찍어요.</li><li>열린 화면에서 <b>우리 모둠 번호</b>를 눌러요. (1~${c.groups}모둠)</li><li>다음 시간에는 같은 태블릿에서 [이어서 하기]를 눌러요.</li></ol>
    <p class="small">약속: ${t.rules.map(esc).join(' · ')}</p>
    <p class="small link-text">${esc(link)}</p></div>`);
}

/* =====================================================================
   파일 · CSV
   ===================================================================== */
function download(name, content, type = 'application/json') {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
function csv(rows) {
  return '﻿' + rows.map(r => r.map(v => {
    const s = String(v ?? '');
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(',')).join('\r\n');
}
function testRowsOf(p) {
  const pn = id => p.plants.find(x => x.id === id)?.name || '';
  const vl = id => { const v = p.versions.find(x => x.id === id); return v ? (v.experiment ? '실험' : 'v') + v.num : ''; };
  return p.tests.map(x => [p.school || '', p.cls, p.group, fmtFull(x.at), vl(x.version), pn(x.aiPlantId), Math.round((x.aiConf || 0) * 100),
    pn(x.actualPlantId), x.aiPlantId === x.actualPlantId ? 'O' : 'X', x.reason, x.by || '',
    (x.causes || []).map(k => CAUSES.find(c => c.k === k)?.label).join('/')]);
}
const TEST_HEAD = ['학교', '반', '모둠', '시각', 'AI 버전', 'AI 판단', '확신도(%)', '학생 판단', '일치', '근거', '기록자', '오답 원인'];
function summaryOf(p) {
  const n = p.tests.length, ok = p.tests.filter(x => x.aiPlantId === x.actualPlantId).length;
  const ev = (p.versionEval || []).filter(e => !e.experiment);
  const fb = p.kid?.feedback || [];
  return {
    school: p.school || '', cls: p.cls, group: p.group, topic: T(p).name, unlocked: p.unlocked, obs: p.observations.length, plants: p.plants.length,
    samples: p.samples.filter(s => !s.removed).length, versions: p.versions.filter(v => !v.experiment).length,
    tests: n, acc: n ? ok / n : null, firstAcc: ev[0]?.acc ?? null, lastAcc: ev.at(-1)?.acc ?? null,
    cards: p.plants.filter(pl => cardDoneIn(p, pl.id)).length, threshold: p.kid?.threshold,
    fbYes: fb.filter(f => f.shown && f.ok === true).length, fbNo: fb.filter(f => f.shown && f.ok === false).length,
    reflections: Object.values(p.reflection || {}).filter(r => Object.values(r).some(v => (v || '').trim())).length,
    updatedAt: p.updatedAt,
  };
}
async function readJsonFiles(files) {
  const out = [];
  for (const f of files) {
    try {
      const p = JSON.parse(await f.text());
      if (p.app === 'ai-dogam-studio') out.push(normalize(p));
      else toast(`${f.name}: AI 도감 스튜디오 파일이 아니에요.`);
    } catch { toast(`${f.name}: 파일을 읽을 수 없어요.`); }
  }
  return out;
}

/* =====================================================================
   모달 화면: 모둠 정보 · 차시 열기 · 교사 메뉴 · 학급 · 대시보드 · 안내
   ===================================================================== */
function groupInfoModal() {
  const t = T();
  const chips = () => P.members.map(x => `<span class="chip on">${esc(x)} <button class="x-in" data-mdel="${esc(x)}" aria-label="빼기">✕</button></span>`).join('') || '<span class="muted small">아직 없어요</span>';
  const m = showModal(`<h3>모둠 정보</h3>
    <p class="muted small">${t.icon} 주제: <b>${esc(t.name)}</b>${P.classId ? ' · 학급 링크로 만든 프로젝트' : ''}</p>
    <div class="two"><label class="field">반 <input id="gi-cls" value="${esc(P.cls)}" ${P.classId ? 'disabled' : ''}></label><label class="field">모둠 <input id="gi-group" value="${esc(P.group)}"></label></div>
    <div class="field">모둠원 <span class="muted small">(실명 대신 번호나 별명을 권장해요)</span>
      <div class="choice" id="gi-members">${chips()}</div>
      <div class="row"><input id="gi-new" placeholder="예: 3번"><button class="btn" id="gi-add">추가</button></div></div>
    <div class="row end"><button class="btn primary" id="gi-ok">확인</button></div>`, { onClose: render, cls: 'narrow' });
  const add = () => {
    const v = clean(m.querySelector('#gi-new').value, 20);
    if (v && !BAD_KEYS.includes(v) && !P.members.includes(v)) { P.members.push(v); save(); m.querySelector('#gi-members').innerHTML = chips(); }
    m.querySelector('#gi-new').value = '';
    m.querySelector('#gi-new').focus();
  };
  m.querySelector('#gi-add').onclick = add;
  m.querySelector('#gi-new').addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
  m.querySelector('#gi-members').addEventListener('click', e => {
    const b = e.target.closest('[data-mdel]');
    if (b) { P.members = P.members.filter(x => x !== b.dataset.mdel); save(); m.querySelector('#gi-members').innerHTML = chips(); }
  });
  m.querySelector('#gi-ok').onclick = () => {
    if (!P.classId) P.cls = clean(m.querySelector('#gi-cls').value);
    P.group = clean(m.querySelector('#gi-group').value);
    save();
    closeModal();
  };
}

function unlockModal(target) {
  const m = showModal(`<h3>🔒 ${target}차시 열기</h3>
    ${P.classKey ? `<p>선생님이 알려 준 <b>열기 코드</b> 4자리를 입력하세요.</p>
      <input id="uc-in" inputmode="numeric" maxlength="4" class="pin-input" autocomplete="off" placeholder="····">
      <p class="err" id="uc-err"></p>
      <div class="row end"><button class="btn ghost" data-x="pin">선생님 비밀번호로 열기</button><button class="btn primary" data-x="ok">열기</button></div>`
    : `<p class="muted">이 프로젝트는 학급 링크 없이 만들어서, 선생님 비밀번호로만 열 수 있어요.</p>
      <div class="row end"><button class="btn ghost" data-x="no">닫기</button><button class="btn primary" data-x="pin">선생님 비밀번호로 열기</button></div>`}`, { cls: 'narrow' });
  const tryCode = () => {
    const v = m.querySelector('#uc-in').value.trim();
    let best = 0;
    for (let n = 1; n <= 8; n++) if (openCode(P.classKey, n) === v) best = n;
    if (!best) { m.querySelector('#uc-err').textContent = '코드가 맞지 않아요. 선생님께 다시 확인해요.'; return; }
    if (best > P.unlocked) P.unlocked = best;
    save();
    closeModal();
    toast(`${P.unlocked}차시까지 열렸어요!`);
    if (target <= P.unlocked) { ui.step = target; P.lastStep = target; }
    render();
  };
  m.addEventListener('click', async e => {
    const x = e.target.closest('[data-x]');
    if (!x) return;
    if (x.dataset.x === 'ok') tryCode();
    if (x.dataset.x === 'no') closeModal();
    if (x.dataset.x === 'pin') { closeModal(); if (await teacherGate()) teacherModal(); }
  });
  const ci = m.querySelector('#uc-in');
  if (ci) { ci.addEventListener('keydown', e => { if (e.key === 'Enter') tryCode(); }); setTimeout(() => ci.focus(), 50); }
}

async function teacherModal() {
  const inProject = !!P;
  let usage = '';
  try {
    const est = await navigator.storage?.estimate?.();
    if (est) usage = `이 기기 저장 공간 사용: ${(est.usage / 1048576).toFixed(1)}MB`;
  } catch { /* 확인 못 해도 괜찮음 */ }
  await checkOffline();
  const t = inProject ? T() : null;
  const m = showModal(`<h3>🔒 교사 메뉴</h3>
    ${inProject ? `<div class="field"><b>열린 차시</b> <span class="muted small">(${esc(P.cls)} ${esc(P.group)})</span>
      <div class="unlock">${STEPS.map(s => `<button class="chip ${s.n <= P.unlocked ? 'on' : ''}" data-unlock="${s.n}">${s.n}차시</button>`).join('')}</div>
      <p class="muted small">이 기기에서 누른 차시까지 열려요. 학급 링크로 만든 프로젝트는 학생이 열기 코드로 직접 열 수도 있어요.</p></div>
      <div class="field"><b>이 프로젝트</b><div class="row wrap">
        <button class="btn sm" data-tm="csv">판단 기록 CSV</button><button class="btn sm" data-tm="json">파일로 저장</button>
        <button class="btn sm danger" data-tm="delete">프로젝트 삭제</button></div>
        <details class="mini-details"><summary>5차시 '함정 AI' 시연 만드는 법</summary>
          <ol class="small"><li>교사용 프로젝트를 새로 만들고 ${esc(t.item)} 2가지를 정합니다.</li>${t.trap.map(x => `<li>${esc(x)}</li>`).join('')}<li>"AI는 무엇을 보고 배웠을까?"로 발문합니다.</li></ol></details></div>` : ''}
    <div class="field"><b>학급</b><div class="row wrap"><button class="btn sm primary" data-tm="dash">📊 교사 대시보드</button><button class="btn sm" data-tm="classes">학급 만들기·관리</button><button class="btn sm" data-tm="guide">📘 교사 안내</button></div></div>
    <div class="field"><b>이 기기</b>
      <p class="small muted">${ui.offline ? '✅ AI 모델이 저장되어 있어 인터넷 없이도 쓸 수 있어요.' : '⏳ AI 모델을 아직 저장하지 않았어요. 인터넷이 될 때 한 번 AI를 불러 두면 다음부터 오프라인에서도 쓸 수 있어요.'}${usage ? '<br>' + usage : ''}</p>
      <div class="row"><input id="tm-pin" type="password" inputmode="numeric" placeholder="새 교사용 비밀번호 (4자리 이상)"><button class="btn sm" data-tm="pin">바꾸기</button></div>
      ${P?.pinHash ? '<p class="muted small">이 프로젝트는 학급을 만든 선생님의 비밀번호를 써요. 여기서 바꾸는 비밀번호는 이 기기의 다른 프로젝트에 쓰여요.</p>' : ''}</div>
    <div class="row end"><button class="btn primary" data-tm="close">닫기</button></div>`, { onClose: () => { if (P) render(); }, cls: 'narrow' });
  m.addEventListener('click', async e => {
    const u = e.target.closest('[data-unlock]');
    if (u) {
      P.unlocked = +u.dataset.unlock;
      if (ui.step > P.unlocked) ui.step = P.unlocked;
      save();
      m.querySelectorAll('[data-unlock]').forEach(b => b.classList.toggle('on', +b.dataset.unlock <= P.unlocked));
      toast(`${P.unlocked}차시까지 열었어요.`);
      return;
    }
    const b = e.target.closest('[data-tm]');
    if (!b) return;
    const a = b.dataset.tm;
    if (a === 'close') closeModal();
    if (a === 'csv') download(`판단기록_${P.cls}_${P.group}_${ymd()}.csv`, csv([TEST_HEAD, ...testRowsOf(P)]), 'text/csv');
    if (a === 'json') ACT.exportJson();
    if (a === 'guide') guideModal();
    if (a === 'classes') { closeModal(); classListModal(); }
    if (a === 'delete') {
      if (confirm(`${P.cls} ${P.group} 프로젝트를 이 기기에서 지울까요?\n파일로 저장하지 않았다면 되살릴 수 없어요.`)) {
        clearTimeout(saveTimer); // 대기 중인 저장이 지운 프로젝트를 되살리지 않도록
        const id = P.id;
        P = null;
        await DB.delProject(id);
        await DB.setSetting('lastProject', null);
        closeModal();
        render();
      }
    }
    if (a === 'pin') {
      const v = m.querySelector('#tm-pin').value.trim();
      if (v.length < 4) { toast('4자리 이상으로 정해 주세요.'); return; }
      await DB.setSetting('pinHash', hashPin(v));
      m.querySelector('#tm-pin').value = '';
      toast('이 기기의 교사용 비밀번호를 바꿨어요.');
    }
    if (a === 'dash') dashboardModal();
  });
}

async function classListModal() {
  const classes = (await DB.getSetting('classes')) || [];
  const m = showModal(`<h3>내가 만든 학급</h3>
    ${classes.length ? `<div class="proj-list">${classes.map(c => `<button class="proj-item" data-cid="${c.id}"><b>${TEMPLATES[c.topic?.tpl]?.icon || '🌿'} ${esc(c.school ? c.school + ' ' : '')}${esc(c.cls)}</b><span>${esc(T({ topic: c.topic }).name)} · 모둠 ${c.groups}개 · ${fmtDate(c.createdAt)}</span></button>`).join('')}</div>` : empty('아직 만든 학급이 없어요.')}
    <div class="row end"><button class="btn ghost" data-x="close">닫기</button><button class="btn primary" data-x="new">＋ 학급 만들기</button></div>`, { cls: 'narrow' });
  m.addEventListener('click', e => {
    const c = e.target.closest('[data-cid]');
    if (c) { closeModal(); classModal(c.dataset.cid); return; }
    const x = e.target.closest('[data-x]');
    if (!x) return;
    closeModal();
    if (x.dataset.x === 'new') classCreateModal();
  });
}

async function classCreateModal() {
  if (!(await devicePinHash())) {
    // 학생 태블릿(학급 프로젝트가 있는 기기)이라면 먼저 그 학급 선생님의 비밀번호를 확인합니다
    const ch = await classPinHash();
    if (ch && Date.now() >= ui.teacherUntil && !(await askPin('학급 만들기', ch))) return;
    toast('먼저 이 기기의 교사용 비밀번호를 정해 주세요.');
    if (!(await setPinModal())) return;
    ui.teacherUntil = Date.now() + 10 * 60 * 1000;
  } else if (Date.now() >= ui.teacherUntil) {
    if (!(await askPin('학급 만들기', await devicePinHash()))) return;
    ui.teacherUntil = Date.now() + 10 * 60 * 1000;
  }
  const m = showModal(`<h3>＋ 학급 만들기</h3>
    <p class="muted small">학급을 만들면 학생용 링크·QR 코드와 차시 열기 코드가 생겨요. 학생 정보는 저장하지 않아요.</p>
    <div class="two"><label class="field">학교 (선택) <input id="cc-school" placeholder="예: 새싹초"></label><label class="field">반 <input id="cc-cls" placeholder="예: 6-1"></label></div>
    ${topicPickerHTML('cc')}
    <label class="field">모둠 수 <input id="cc-groups" type="number" min="1" max="12" value="6"></label>
    <div class="row end"><button class="btn ghost" data-x="no">취소</button><button class="btn primary" data-x="ok">만들기</button></div>`, { wide: true });
  m.addEventListener('click', async e => {
    const x = e.target.closest('[data-x]');
    if (!x) return;
    if (x.dataset.x === 'no') { closeModal(); return; }
    const cls = clean(m.querySelector('#cc-cls').value);
    if (!cls) { toast('반을 적어 주세요.'); return; }
    const topic = readTopic(m, 'cc');
    if (topic.tpl === 'custom' && (!topic.item || !topic.part)) { toast('직접 정하기에서는 구별할 것과 찍을 것을 적어 주세요.'); return; }
    // 차시 열기 코드 8개가 서로 겹치지 않는 열쇠를 고릅니다
    let key;
    do { key = uid() + uid(); } while (new Set(STEPS.map(s => openCode(key, s.n))).size < STEPS.length);
    const c = {
      id: uid(), key, school: clean(m.querySelector('#cc-school').value), cls, topic,
      groups: Math.max(1, Math.min(12, +m.querySelector('#cc-groups').value || 6)), pinHash: await devicePinHash(), createdAt: Date.now(),
    };
    const classes = (await DB.getSetting('classes')) || [];
    classes.unshift(c);
    await DB.setSetting('classes', classes);
    closeModal();
    if (!P) render();
    classModal(c.id);
  });
}

async function classModal(id) {
  const classes = (await DB.getSetting('classes')) || [];
  const c = classes.find(x => x.id === id);
  if (!c) return;
  const t = T({ topic: c.topic }), link = joinLink(c);
  const m = showModal(`<div class="row-between"><h3>${t.icon} ${esc(c.school ? c.school + ' ' : '')}${esc(c.cls)} · ${esc(t.name)}</h3><button class="icon-btn" data-x="close" aria-label="닫기">✕</button></div>
    <div class="class-grid">
      <div><h4>① 학생 접속</h4><div class="qr">${qrSVG(link)}</div>
        <p class="muted small">학생 태블릿 카메라로 QR을 찍거나 링크를 보내 주세요. 학생은 모둠 번호만 고르면 돼요.</p>
        <div class="row wrap"><button class="btn sm" data-x="copy">🔗 링크 복사</button><button class="btn sm" data-x="handout">🖨️ 학생용 안내문 인쇄</button></div></div>
      <div><h4>② 차시 열기 코드</h4>
        <p class="muted small">수업 시간에 그 차시의 코드만 칠판에 적어 주세요. 학생이 잠긴 차시를 누르고 코드를 입력하면 열려요.</p>
        <div class="codes ${'hidden-codes'}" id="codes">${STEPS.map(s => `<div class="code"><span>${s.n}차시</span><b>${openCode(c.key, s.n)}</b></div>`).join('')}</div>
        <button class="btn sm ghost" data-x="toggle">👁 코드 보기</button></div>
    </div>
    <details class="mini-details"><summary>학급 정보</summary><p class="small">주제: ${esc(t.name)} · 구별할 것: ${esc(t.item)} · 찍을 것: ${esc(t.part)} · 사용할 사람: ${esc(t.audience)} · 모둠 ${c.groups}개<br>핵심 질문: ${esc(t.question)}</p>
      <button class="btn sm danger" data-x="delete">이 학급 지우기</button> <span class="muted small">(학생 기기의 기록은 지워지지 않아요)</span></details>`, { wide: true });
  m.addEventListener('click', async e => {
    const x = e.target.closest('[data-x]');
    if (!x) return;
    const a = x.dataset.x;
    if (a === 'close') closeModal();
    if (a === 'toggle') { const el = m.querySelector('#codes'); el.classList.toggle('hidden-codes'); x.textContent = el.classList.contains('hidden-codes') ? '👁 코드 보기' : '🙈 코드 숨기기'; }
    if (a === 'copy') {
      try { await navigator.clipboard.writeText(link); toast('링크를 복사했어요.'); }
      catch { prompt('아래 링크를 복사하세요', link); }
    }
    if (a === 'handout') printHandout(c);
    if (a === 'delete' && confirm('이 학급을 지울까요? 학생용 링크는 계속 쓸 수 있지만, 열기 코드를 다시 볼 수 없게 돼요.')) {
      await DB.setSetting('classes', classes.filter(x2 => x2.id !== id));
      closeModal();
      if (!P) render();
    }
  });
}

async function dashboardModal() {
  let list = [];
  const m = showModal(`<div class="row-between wrap"><h3>📊 교사 대시보드</h3><button class="icon-btn" data-dash="close" aria-label="닫기">✕</button></div>
    <p class="muted small">모둠마다 [💾 파일로 저장]한 파일을 모아 불러오면 진행 상황과 기록을 한눈에 볼 수 있어요. (서버가 없어서 파일로 모아요)</p>
    <div class="row wrap"><label class="btn primary file-btn">📂 모둠 파일 불러오기 (여러 개)<input type="file" accept=".json,application/json" multiple hidden id="dash-files"></label>
      <button class="btn" data-dash="local">이 기기의 프로젝트 모두 보기</button>
      <button class="btn ghost" data-dash="csv">판단 기록 CSV (전체)</button>
      <button class="btn ghost" data-dash="sum">요약 CSV</button></div>
    <div id="dash-body">${empty('불러온 프로젝트가 없어요.')}</div>`, { wide: true });
  const draw = () => {
    const rows = list.map(summaryOf).sort((a, b) => (a.school + a.cls + a.group).localeCompare(b.school + b.cls + b.group, 'ko'));
    m.querySelector('#dash-body').innerHTML = rows.length ? `<div class="table-wrap"><table class="ftable dash">
      <thead><tr><th>반·모둠</th><th>주제</th><th>열린 차시</th><th>관찰</th><th>항목</th><th>학습 사진</th><th>학습 횟수</th><th>시험</th><th>시험 정확도</th><th>첫→마지막 버전</th><th>도감 카드</th><th>확신도 기준</th><th>피드백</th><th>성찰</th><th>저장</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td><b>${esc(r.school)} ${esc(r.cls)} ${esc(r.group)}</b></td><td>${esc(r.topic)}</td><td>${r.unlocked}</td><td>${r.obs}</td><td>${r.plants}</td><td>${r.samples}</td><td>${r.versions}</td><td>${r.tests}</td><td>${pct(r.acc)}</td>
        <td>${r.firstAcc != null ? `${pct(r.firstAcc)} → ${pct(r.lastAcc)}` : '-'}</td><td>${r.cards}/${r.plants}</td><td>${pct(r.threshold)}</td><td>😊${r.fbYes} 🤔${r.fbNo}</td><td>${r.reflections}명</td><td class="small">${fmtDate(r.updatedAt)}</td></tr>`).join('')}</tbody></table></div>
      <p class="muted small">'첫→마지막 버전'은 모둠이 [버전별 정확도 비교]를 눌렀을 때 저장된 값이에요.</p>` : empty('불러온 프로젝트가 없어요.');
  };
  const addProjects = ps => {
    for (const p of ps) { const i = list.findIndex(x => x.id === p.id); if (i >= 0) list[i] = p; else list.push(p); }
    draw();
  };
  m.querySelector('#dash-files').onchange = async e => { addProjects(await readJsonFiles([...e.target.files])); e.target.value = ''; };
  m.addEventListener('click', async e => {
    const b = e.target.closest('[data-dash]');
    if (!b) return;
    const a = b.dataset.dash;
    if (a === 'close') closeModal();
    if (a === 'local') addProjects((await DB.allProjects()).map(p => (P && p.id === P.id ? P : normalize(p))));
    if (a === 'csv') { if (!list.length) return toast('먼저 프로젝트를 불러오세요.'); download(`판단기록_전체_${ymd()}.csv`, csv([TEST_HEAD, ...list.flatMap(testRowsOf)]), 'text/csv'); }
    if (a === 'sum') {
      if (!list.length) return toast('먼저 프로젝트를 불러오세요.');
      const rows = list.map(summaryOf);
      download(`모둠요약_${ymd()}.csv`, csv([['학교', '반', '모둠', '주제', '열린 차시', '관찰', '항목 수', '학습 사진', '학습 횟수', '시험', '시험 정확도(%)', '첫 버전 정확도(%)', '마지막 버전 정확도(%)', '완성 카드', '확신도 기준(%)', '맞아요', '틀려요', '성찰 작성 인원'],
        ...rows.map(r => [r.school, r.cls, r.group, r.topic, r.unlocked, r.obs, r.plants, r.samples, r.versions, r.tests, r.acc == null ? '' : Math.round(r.acc * 100), r.firstAcc == null ? '' : Math.round(r.firstAcc * 100), r.lastAcc == null ? '' : Math.round(r.lastAcc * 100), r.cards, Math.round((r.threshold || 0) * 100), r.fbYes, r.fbNo, r.reflections])]), 'text/csv');
    }
  });
}

function guideModal() {
  const flow = [
    ['1', '관찰 노트', '문제 상황(핵심 질문) 제시, 관찰하고 특징 기록, 실물과 사진 데이터 비교'],
    ['2', '기준 설계', '구별 기준과 특징표 만들기, 모둠끼리 기준 교환 검증 (AI 없이)'],
    ['3', 'AI 가르치기', '항목별 사진 15~20장 수집, AI 학습(v1), 데이터 양 실험'],
    ['4', 'AI 시험', '처음 보는 사진으로 시험: AI 판단 → 내 판단 → 근거, 정확도'],
    ['5', '오답 노트', '오답 원인(편향) 분석, 데이터 보완·재학습, 버전별 정확도 비교'],
    ['6', '도감 카드', '사용자 눈높이의 설명 쓰기, 저작권·출처'],
    ['7', '공유(동생) 모드', 'AI 오류의 책임 토의, 확신도 기준(안전장치) 정하기, 실제 사용자 시연·피드백'],
    ['8', '성찰', '피드백 반영 개선, AI와 사람의 분류 방식 비교, 포트폴리오'],
  ];
  showModal(`<div class="row-between"><h3>📘 교사 안내</h3><button class="icon-btn" onclick="closeModal()" aria-label="닫기">✕</button></div>
    <div class="guide">
      <h4>이 앱으로 하는 프로젝트</h4>
      <p>학생들이 사진으로 이미지 분류 AI를 직접 가르치고, 검증·개선한 뒤, 동생(사용자)을 위한 AI 도감으로 내놓는 8차시 프로젝트예요. 앱 하나에 8차시 동안의 기록이 모두 쌓여 과정 중심 평가 자료가 됩니다.</p>
      <table class="ftable"><thead><tr><th>차시</th><th>모드</th><th>주요 활동</th></tr></thead><tbody>${flow.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>
      <h4>시작하기 (5분)</h4>
      <ol><li>처음 화면 → <b>[학급 만들기]</b>: 반, 주제, 모둠 수를 정해요. (처음 한 번 교사용 비밀번호를 정해요)</li>
        <li>학생용 <b>QR 코드나 링크</b>를 나눠 주면, 학생은 모둠 번호만 골라요.</li>
        <li>수업마다 그 차시의 <b>열기 코드</b>를 칠판에 적어 주세요.</li>
        <li>차시가 끝나면 모둠마다 <b>[💾 파일로 저장]</b>을 하게 해 주세요. 파일을 모으면 <b>[교사 대시보드]</b>에서 한눈에 볼 수 있어요.</li></ol>
      <h4>준비물</h4>
      <ul><li>모둠당 카메라가 있는 태블릿·크롬북 1대 (최신 크롬·엣지·사파리)</li><li>처음 한 번 인터넷 연결 (AI 모델 약 14MB를 받아 저장, 이후 오프라인 가능)</li><li>학생들이 관찰할 실물 (식물 잎, 씻은 재활용품 등)</li></ul>
      <h4>주제별 연계 성취기준 (2022 개정, 5~6학년군)</h4>
      ${Object.values(TEMPLATES).map(v => `<details class="mini-details"><summary>${v.icon} ${v.label}</summary><ul class="small">${v.standards.map(s => `<li><b>[${s[0]}]</b> ${esc(s[1])}</li>`).join('')}</ul></details>`).join('')}
      <p class="muted small">학교 교육과정과 교과서에 맞게 확인해서 쓰세요.</p>
      <h4>개인정보와 안전</h4>
      <ul><li>사진·기록은 학생 기기의 브라우저 안에만 저장되고, 어떤 서버로도 보내지 않아요. 회원가입·로그인이 없어요.</li>
        <li>사람 얼굴이 찍히지 않도록 지도해 주세요. 모둠원 이름은 번호나 별명을 권장해요.</li>
        <li>브라우저의 사이트 데이터를 지우면 기록도 지워져요. 파일로 저장해 두세요.</li></ul>
      <h4>AI는 어떻게 판단하나요?</h4>
      <p class="small">MobileNet이 사진에서 특징을 뽑고, 항목마다 가장 닮은 학습 사진과 비교해 판단해요. 확신도는 '항목끼리의 차이'와 '학습 사진과 얼마나 익숙한지'를 곱한 값이라, 학습하지 않은 것을 보여 주면 '처음 보는 것'이 커지고 확신도가 낮아져요.</p>
      <p class="muted small">AI 도감 스튜디오 v${APP_VERSION} · AI 모델: Google MobileNet v2 (TensorFlow.js, Apache-2.0)</p>
    </div>`, { wide: true });
}

/* =====================================================================
   동작(버튼) 모음
   ===================================================================== */
const ACT = {
  go(el) {
    const n = +el.dataset.step;
    if (n > P.unlocked) { unlockModal(n); return; }
    if (modalStack.length) closeModal();
    ui.step = n; P.lastStep = n; ui.testDraft = null; save(); render(); window.scrollTo(0, 0);
  },
  aiRetry() { if (ui.aiState === 'error' || ui.aiState === 'idle') AI.load().catch(() => toast('AI를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.')); },
  groupInfo() { groupInfoModal(); },
  async teacher() { if (await teacherGate('선생님 확인', true)) teacherModal(); },
  guide() { guideModal(); },
  classCreate() { classCreateModal(); },
  classOpen(el) { classModal(el.dataset.id); },
  async switchProject() { await flushSave(); await DB.setSetting('lastProject', null); P = null; ui.testDraft = null; AI.emb.clear(); render(); },
  exportJson() {
    P.lastExportAt = Date.now();
    download(`AI도감_${P.cls || '반'}_${P.group || '모둠'}_${ymd()}.json`, JSON.stringify(P));
    save();
    toast('파일로 저장했어요. 다운로드 폴더를 확인하세요.');
    const h = $('.export-hint');
    if (h) { h.classList.remove('warn'); h.textContent = `💾 마지막 파일 저장 ${fmtDate(P.lastExportAt)}`; }
  },

  async newProject() {
    const cls = clean($('#np-cls').value), group = clean($('#np-group').value);
    if (!cls || !group) { toast('반과 모둠을 적어 주세요.'); return; }
    const topic = readTopic($('#app'), 'np');
    if (topic.tpl === 'custom' && (!topic.item || !topic.part)) { toast('직접 정하기에서는 구별할 것과 찍을 것을 적어 주세요.'); return; }
    const p = newProject({ cls, group, topic });
    await DB.putProject(p);
    openProject(p);
  },
  async openProject(el) { const p = await DB.getProject(el.dataset.id); if (p) { ui.join = null; clearHash(); openProject(p); } },
  async joinGroup(el) {
    const c = ui.join, n = +el.dataset.n;
    const exists = (await DB.allProjects()).find(p => p.classId === c.id && p.group === `${n}모둠`);
    if (exists && confirm(`${n}모둠 프로젝트가 이미 이 기기에 있어요. 이어서 할까요?\n[취소]를 누르면 새로 만들어요.`)) { ui.join = null; clearHash(); openProject(exists); return; }
    const p = newProject({ cls: c.c, school: c.s || '', group: `${n}모둠`, topic: c.t || { tpl: 'plant' }, classId: c.id, classKey: c.k, pinHash: c.h || null });
    await DB.putProject(p);
    ui.join = null;
    clearHash();
    openProject(p);
    toast(`${n}모둠으로 시작해요!`);
  },
  leaveJoin() { ui.join = null; clearHash(); render(); },

  /* 1차시 */
  obsCapture() {
    openCamera({ title: '관찰 사진 찍기', multi: true,
      onCapture: img => { P.observations.push({ id: uid(), img, at: Date.now() }); save(); }, onClose: render });
  },
  obsDel(el) {
    if (!confirm('이 관찰 사진을 지울까요?')) return;
    P.observations = P.observations.filter(o => o.id !== el.dataset.id); save(); render();
  },

  /* 2차시 */
  plantAdd() {
    const used = P.plants.map(p => p.color);
    P.plants.push({ id: uid(), name: '', color: COLORS.find(c => !used.includes(c)) || COLORS[P.plants.length % COLORS.length] });
    save(); render();
    setTimeout(() => { const ins = document.querySelectorAll('.plant-name'); ins[ins.length - 1]?.focus(); }, 30);
  },
  plantDel(el) {
    const id = el.dataset.id;
    const used = P.samples.some(s => s.plantId === id && !s.removed) || P.tests.some(x => x.actualPlantId === id || x.aiPlantId === id);
    if (used && !confirm('학습 사진과 시험 기록이 있어요. 그래도 지울까요?\n(시험 기록에는 "삭제된 항목"으로 남아요)')) return;
    if (!used && !confirm('지울까요?')) return;
    P.plants = P.plants.filter(p => p.id !== id);
    P.samples.forEach(s => { if (s.plantId === id) s.removed = true; });
    delete P.cards[id];
    save(); render();
  },

  /* 3차시 */
  sampleCapture(el) {
    const pid = el.dataset.id;
    openCamera({ title: `${plantName(pid)} 사진 찍기`, multi: true,
      onCapture: img => { P.samples.push({ id: uid(), plantId: pid, img, at: Date.now() }); save(); }, onClose: render });
  },
  sampleFromObs(el) {
    const pid = el.dataset.id;
    if (!P.observations.length) { toast('관찰 노트에 사진이 없어요.'); return; }
    const picked = new Set();
    const m = showModal(`<h3>관찰 노트에서 ${esc(plantName(pid))} 사진 고르기</h3>
      <div class="thumbs pick big">${P.observations.map(o => `<button class="thumb" data-oid="${o.id}"><img src="${o.img}" alt=""><span class="cap">${esc(o.name || '')}</span></button>`).join('')}</div>
      <div class="row end"><button class="btn ghost" data-x="no">취소</button><button class="btn primary" data-x="ok">넣기</button></div>`, { wide: true });
    m.addEventListener('click', e => {
      const t = e.target.closest('[data-oid]');
      if (t) { const id = t.dataset.oid; picked.has(id) ? picked.delete(id) : picked.add(id); t.classList.toggle('on'); return; }
      const x = e.target.closest('[data-x]');
      if (!x) return;
      if (x.dataset.x === 'ok') {
        P.observations.filter(o => picked.has(o.id)).forEach(o => P.samples.push({ id: uid(), plantId: pid, img: o.img, at: Date.now(), from: 'obs' }));
        save();
        toast(`${picked.size}장을 넣었어요.`);
      }
      closeModal();
      render();
    });
  },
  sampleDel(el) {
    const s = P.samples.find(x => x.id === el.dataset.id);
    if (s) { s.removed = true; save(); render(); }
  },
  async train() { if (await trainNew()) render(); },
  async trainExp() {
    const pid = $('#exp-plant').value, n = Math.max(1, Math.min(30, +$('#exp-n').value || 3));
    if (samplesOf(pid).length <= n) { toast(`${plantName(pid)} 사진이 ${n}장보다 많아야 실험이 의미 있어요.`); return; }
    if (await trainNew({ experiment: true, limit: { plantId: pid, n } })) render();
  },
  quickTry() {
    const v = versionById($('#quick-version')?.value) || currentVersion();
    if (!v) return;
    openCamera({ title: `${versionLabel(v)} AI에게 보여 주기`, onCapture: async img => {
      const box = $('#quick-result');
      if (!box) return;
      box.innerHTML = `<div class="quick"><img src="${img}" alt=""><p class="thinking">🤖 생각하는 중…</p></div>`;
      try {
        const r = await predictImage(img, v);
        box.innerHTML = `<div class="quick"><img src="${img}" alt=""><div class="grow"><p class="ai-answer" style="--pc:${plantColor(r.plantId)}">🤖 <b>${esc(plantName(r.plantId))}</b> <span>확신도 ${pct(r.conf)} · ${versionLabel(v)}</span></p>${famNote(r)}${resultBars(r.dist)}</div></div>`;
      } catch { box.innerHTML = '<p class="warn-text">AI를 불러오지 못했어요.</p>'; }
    } });
  },

  /* 4차시 */
  pickMember(el) { ui.member = el.dataset.k; render(); },
  testCapture() {
    const cv = currentVersion();
    openCamera({ title: `시험할 ${T().part} 찍기`, onCapture: async img => {
      const d = ui.testDraft = { id: uid(), img, version: cv.id };
      render();
      try {
        const e = await AI.embed(d.id, img);
        d.result = await predict(e, cv);
      } catch { d.error = true; }
      if (ui.testDraft === d) render();
    } });
  },
  testActual(el) { if (ui.testDraft) { ui.testDraft.actual = el.dataset.id; render(); setTimeout(() => $('#test-reason')?.focus(), 30); } },
  testCancel() { if (ui.testDraft) AI.forget(ui.testDraft.id); ui.testDraft = null; render(); },
  testSave() {
    const d = ui.testDraft;
    if (!d || !d.result || !d.actual || (d.reason || '').trim().length < 5) return;
    P.tests.push({ id: d.id, img: d.img, at: Date.now(), version: d.version, aiPlantId: d.result.plantId, aiConf: d.result.conf,
      actualPlantId: d.actual, reason: d.reason.trim(), by: ui.member, causes: [] });
    ui.testDraft = null; ui.kidSim = null; save(); render();
    toast('기록했어요! 다음 것을 찍어 보세요.');
  },
  testDel(el) {
    if (!confirm('이 시험 기록을 지울까요?')) return;
    P.tests = P.tests.filter(x => x.id !== el.dataset.id); ui.kidSim = null; save(); render();
  },

  /* 5차시 */
  causeToggle(el) {
    const x = P.tests.find(y => y.id === el.dataset.id);
    if (!x) return;
    const k = el.dataset.k;
    x.causes = (x.causes || []).includes(k) ? x.causes.filter(y => y !== k) : [...(x.causes || []), k];
    save(); render();
  },
  async evalVersions() {
    if (ui.evalBusy) return;
    if (!P.tests.length) { toast('4차시 시험 기록이 있어야 비교할 수 있어요.'); return; }
    const proj = P; // 계산 중에 다른 프로젝트로 바뀌면 결과를 버립니다
    ui.evalBusy = true; render();
    try {
      const out = [];
      for (const v of proj.versions) {
        if (P !== proj) break;
        const r = await evalVersion(v);
        out.push({ versionId: v.id, label: versionLabel(v), experiment: !!v.experiment, acc: r.acc, ok: r.ok, n: r.n, at: Date.now() });
      }
      if (P === proj) { proj.versionEval = out; save(); }
    } catch { toast('AI를 불러오지 못했어요.'); }
    ui.evalBusy = false;
    if (P) render();
  },

  /* 6차시 */
  cardPhoto(el) { (P.cards[el.dataset.pid] ||= {}).photo = el.dataset.id; save(); render(); },
  speak(el) { speak(cardSpeech(el.dataset.pid)); },

  /* 7차시 */
  respToggle(el) {
    const k = el.dataset.k, r = P.kid.resp || [];
    P.kid.resp = r.includes(k) ? r.filter(x => x !== k) : [...r, k];
    save(); el.classList.toggle('on');
  },
  kidStart() { kioskOpen(); },
  kioskShot() {
    const cv = currentVersion();
    openCamera({ title: T().kioskPrompt, kid: true, onCapture: async img => {
      ui.kiosk = { stage: 'thinking' }; kioskRender();
      try {
        const r = await predictImage(img, cv);
        if (!$('#kiosk')) return; // 그사이 나갔으면 아무것도 하지 않음
        const shown = r.conf >= P.kid.threshold && !!plantById(r.plantId);
        ui.kiosk = { stage: 'result', result: r, shown };
        kioskRender();
        if (shown) speak(cardSpeech(r.plantId) || plantName(r.plantId));
        else speak('잘 모르겠어요. 선생님이나 만든 친구들에게 물어봐요.');
      } catch {
        ui.kiosk = { stage: 'home' }; kioskRender(); toast('AI를 불러오지 못했어요.');
      }
    } });
  },
  kidSpeak() { const r = ui.kiosk?.result; if (r) speak(cardSpeech(r.plantId)); },
  kidFb(el) {
    const st = ui.kiosk, r = st?.result, okv = el.dataset.ok;
    if (!st) return;
    P.kid.feedback.push({ at: Date.now(), plantId: r?.plantId || null, conf: r?.conf ?? null, shown: !!st.shown, ok: okv === 'u' ? null : okv === '1' });
    save();
    window.speechSynthesis?.cancel();
    ui.kiosk = { stage: 'home' }; kioskRender();
    if (okv !== 'u') toast('알려 줘서 고마워요!');
  },
  async kioskExit() {
    const h = await activePinHash();
    if (h && !(await askPin('나가기', h))) return;
    $('#kiosk')?.remove(); ui.kiosk = null;
    window.speechSynthesis?.cancel();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    render();
  },

  /* 8차시 */
  reflMember(el) { ui.reflMember = el.dataset.k; render(); },
  print() { printPortfolio(); },
};

/* ---------- 프로젝트 열기 · 불러오기 ---------- */
function openProject(p) {
  P = normalize(p);
  ui.step = Math.min(P.lastStep || 1, P.unlocked);
  ui.testDraft = null; ui.kidSim = null; ui.member = ''; ui.reflMember = null; ui.teacherUntil = 0;
  AI.emb.clear();
  DB.setSetting('lastProject', P.id);
  navigator.storage?.persist?.().catch(() => {});
  render();
  AI.load().catch(() => {});
}
async function importProject(file) {
  const [p] = await readJsonFiles([file]);
  if (!p) return;
  const exists = await DB.getProject(p.id);
  if (exists && !confirm(`${p.cls} ${p.group} 프로젝트가 이미 이 기기에 있어요.\n[확인] 파일 내용으로 바꾸기 · [취소] 복사본으로 불러오기`)) {
    p.id = uid();
    p.group = p.group + ' (복사본)';
  }
  await DB.putProject(p);
  ui.join = null;
  openProject(p);
  toast('프로젝트를 불러왔어요.');
}
function clearHash() { if (location.hash) history.replaceState(null, '', location.pathname + location.search); }
function readJoinHash() {
  const m = location.hash.match(/^#join=(.+)$/);
  if (!m) return null;
  try {
    const raw = b64d(m[1]);
    // 링크는 누구나 만들 수 있으므로, 정해진 모양의 값만 받아들입니다
    const c = { id: raw.id, k: raw.k, s: clean(raw.s), c: clean(raw.c), g: toInt(raw.g, 1, 12, 6), t: sanitizeTopic(raw.t), h: safeId(raw.h) ? raw.h : null };
    if (!safeId(c.id) || !safeId(c.k) || !c.c) throw new Error('bad');
    return c;
  } catch { toast('학급 링크가 올바르지 않아요. 선생님께 다시 받아 주세요.'); return null; }
}

/* ---------- 입력 연결 ---------- */
function bindSet(el) {
  const [kind, a, b] = el.dataset.bind.split('|');
  const val = el.type === 'checkbox' ? el.checked : el.value;
  if (kind === 'p') setPath(P, a, val);
  else if (kind === 'obs') { const o = P.observations.find(x => x.id === a); if (o) { o[b] = val; const bd = $('#ob-' + a); if (bd) bd.innerHTML = obsBadge(o); } }
  else if (kind === 'plant') { const p = plantById(a); if (p) { p[b] = val; const ft = $('#feature-table'); if (ft) ft.innerHTML = featureTable(); } }
  else if (kind === 'card') { (P.cards[a] ||= {})[b] = val; const pv = $('#preview-' + a), p = plantById(a); if (pv && p) pv.outerHTML = cardView(p, true); }
  else if (kind === 'refl') { (P.reflection[a] ||= {})[b] = val; }
  save();
}
function setPath(o, path, v) {
  const ks = path.split('.');
  let cur = o;
  for (let i = 0; i < ks.length - 1; i++) cur = cur[ks[i]] ||= {};
  cur[ks.at(-1)] = v;
}

document.addEventListener('click', e => {
  const tpl = e.target.closest('.tpl[data-tpl]');
  if (tpl) {
    const prefix = tpl.dataset.prefix;
    document.querySelectorAll(`.tpl[data-prefix="${prefix}"]`).forEach(b => b.classList.toggle('on', b === tpl));
    const box = document.getElementById(`${prefix}-custom`);
    if (box) box.hidden = tpl.dataset.tpl !== 'custom';
    const aud = document.getElementById(`${prefix}-audience`);
    if (aud) aud.placeholder = `${TEMPLATES[tpl.dataset.tpl].audience} (비워 두면 기본값)`;
    return;
  }
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACT[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el, e); }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'test-reason' && ui.testDraft) {
    ui.testDraft.reason = t.value;
    const b = $('#test-save');
    if (b) b.disabled = !(ui.testDraft.actual && t.value.trim().length >= 5);
    return;
  }
  if (t.id === 'th-range') {
    P.kid.threshold = +t.value / 100;
    $('#th-val').textContent = pct(P.kid.threshold);
    $('#kid-sim').innerHTML = kidSimView();
    save();
    return;
  }
  if (t.matches('[data-bind]') && t.type !== 'radio' && t.type !== 'checkbox' && t.tagName !== 'SELECT') bindSet(t);
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.matches('[data-bind]') && (t.type === 'radio' || t.tagName === 'SELECT' || t.type === 'checkbox')) bindSet(t);
  if (t.matches('[data-file=importProject]') && t.files[0]) { importProject(t.files[0]); t.value = ''; }
});
document.addEventListener('visibilitychange', () => { if (document.hidden && ui.saveState === 'saving') flushSave(); });
window.addEventListener('pagehide', () => { if (ui.saveState === 'saving') flushSave(); });
window.addEventListener('hashchange', async () => {
  const c = readJoinHash();
  if (!c) return;
  if (P) await flushSave(P); // 열려 있던 프로젝트의 입력을 먼저 저장
  ui.join = c; P = null; ui.testDraft = null;
  render();
});

/* ---------- 오프라인 지원(서비스 워커) ---------- */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
}

/* ---------- 시작 ---------- */
(async function init() {
  await DB.open();
  ui.join = readJoinHash();
  if (ui.join) { render(); return; }
  const last = await DB.getSetting('lastProject');
  if (last) {
    const p = await DB.getProject(last);
    if (p) { openProject(p); return; }
  }
  render();
})();
