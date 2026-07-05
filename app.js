const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const defaultWallpaper = '';
const defaultAlbum = '';

const state = {
  wallpaper: defaultWallpaper,
  hour: 7,
  minute: 8,
  date: '2026-07-06',
  carrier: '',
  battery: 83,
  notificationY: 338,
  musicMode: 'none',
  album: defaultAlbum,
  songTitle: '낭만 한도 초과',
  songArtist: '하이키',
  songElapsed: '1:08',
  songRemaining: '−2:34',
  songProgress: 37,
  notifications: [],
};

const apps = {
  kakao: { name: '카카오톡', icon: svgIcon('#FEE500', `<path fill="#3B2F19" d="M12 5.1c-4.6 0-8.3 2.75-8.3 6.14 0 2.15 1.5 4.03 3.77 5.14l-.96 3.48 4.04-2.66c.47.06.95.09 1.45.09 4.58 0 8.3-2.75 8.3-6.14S16.58 5.1 12 5.1Z"/>`) },
  instagram: { name: 'Instagram', icon: svgIcon('url(#ig)', `<defs><linearGradient id="ig" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse"><stop stop-color="#FEDA75"/><stop offset=".45" stop-color="#D62976"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17.2" cy="6.9" r="1.1" fill="#fff"/>`) },
  messages: { name: '메시지', icon: svgIcon('#34C759', `<path d="M5 6.3A4.3 4.3 0 0 1 9.3 2h5.4A4.3 4.3 0 0 1 19 6.3v3.4A4.3 4.3 0 0 1 14.7 14H12l-4.4 3 .9-3.5A4.3 4.3 0 0 1 5 9.7V6.3Z" fill="#fff"/>`) },
  discord: { name: 'Discord', icon: svgIcon('#5865F2', `<g transform="translate(0 1.15)"><path d="M7.3 7.2c2-1.48 7.35-1.48 9.35 0 .72 1.16 1.22 2.47 1.46 3.84-.96 1.2-2.3 2.19-3.9 2.81l-.48-.65c.58-.22 1.12-.5 1.6-.83-1.77.83-4.65.83-6.42 0 .48.33 1.02.61 1.6.83l-.48.65c-1.6-.62-2.94-1.6-3.9-2.81.24-1.37.74-2.68 1.46-3.84ZM9.6 10.7c.65 0 1.18-.62 1.18-1.38S10.25 7.94 9.6 7.94s-1.18.62-1.18 1.38.53 1.38 1.18 1.38Zm4.8 0c.65 0 1.18-.62 1.18-1.38s-.53-1.38-1.18-1.38-1.18.62-1.18 1.38.53 1.38 1.18 1.38Z" fill="#fff"/></g>`) },
  phone: { name: '전화', icon: svgIcon('#34C759', `<path d="M7.1 3.7 9.5 7l-1.6 1.84c1.18 2.45 3.1 4.38 5.55 5.55L15.3 12.8l3.3 2.38c.6.43.81 1.21.5 1.9l-.88 1.9c-.29.64-.96.98-1.65.85C9.42 18.5 5.5 14.58 4.17 7.43c-.13-.69.2-1.36.85-1.65l1.9-.88c.69-.31 1.47-.1 1.9.5Z" fill="#fff"/>`) },
};

function svgIcon(background, inside) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="${background}"/>${inside}</svg>`)}`;
}

function escapeHTML(value = '') {
  return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

function parseDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date)) return '';
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
}

function twoDigits(n) { return String(Math.max(0, Number(n) || 0)).padStart(2, '0'); }
function timeText() { return `${Number(state.hour)}:${twoDigits(state.minute)}`; }
function readFile(input, callback) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function renderNotificationEditor() {
  const editor = $('#notificationEditor');
  editor.innerHTML = '';
  const template = $('#notificationTemplate');

  state.notifications.forEach((notification, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    $('.notification-number', node).textContent = index + 1;
    $('.notification-app', node).value = notification.app;
    $('.notification-sender', node).value = notification.sender;
    $('.notification-message', node).value = notification.message;
    $('.notification-time', node).value = notification.time;
    $('.phone-only', node).classList.toggle('hidden', notification.app !== 'phone');

    $('.notification-app', node).addEventListener('change', event => {
      notification.app = event.target.value;
      if (notification.app === 'phone') {
        notification.sender ||= '부재중 전화';
        notification.message ||= '걸려온 전화';
      }
      renderNotificationEditor();
      renderPhone();
    });
    $('.notification-sender', node).addEventListener('input', event => { notification.sender = event.target.value; renderPhone(); });
    $('.notification-message', node).addEventListener('input', event => { notification.message = event.target.value; renderPhone(); });
    $('.notification-time', node).addEventListener('input', event => { notification.time = event.target.value; renderPhone(); });
    $('.notification-icon', node).addEventListener('change', event => readFile(event.target, data => { notification.icon = data; renderPhone(); }));
    $('.delete-notification', node).addEventListener('click', () => {
      state.notifications = state.notifications.filter(item => item.id !== notification.id);
      renderNotificationEditor();
      renderPhone();
    });
    editor.append(node);
  });
}

function renderNotifications() {
  const stack = $('#notificationStack');
  if (state.musicMode === 'full') {
    stack.innerHTML = '';
    return;
  }
  if (!state.notifications.length) {
    stack.innerHTML = '';
    return;
  }
  const groups = [];
  state.notifications.forEach(notification => {
    const current = groups.find(group => group.app === notification.app);
    if (current) current.items.push(notification); else groups.push({ app: notification.app, items: [notification] });
  });
  stack.innerHTML = groups.map(group => {
    const latest = group.items[group.items.length - 1];
    const app = apps[latest.app];
    const count = group.items.length;
    const icon = latest.icon || app.icon;
    const isMissed = latest.app === 'phone';
    const sender = isMissed ? '부재중 전화' : latest.sender || app.name;
    const message = isMissed ? `${latest.sender || '알 수 없음'}${latest.message ? ` · ${latest.message}` : '에게서 걸려온 전화'}` : latest.message;
    return `<div class="group-stack">
      ${count > 1 ? '<div class="stack-shadow second"></div><div class="stack-shadow"></div>' : ''}
      <article class="notification-card">
        <img class="app-icon" src="${icon}" alt="" />
        <div>
          <div class="notification-app-name">${escapeHTML(app.name)}${count > 1 ? `<span class="notification-count">${count}개</span>` : ''}</div>
          <div class="notification-sender">${escapeHTML(sender)}</div>
          <div class="notification-message">${escapeHTML(message || '')}</div>
        </div>
        <span class="notification-time">${escapeHTML(latest.time || '')}</span>
      </article>
    </div>`;
  }).join('');
}

function musicMarkup() {
  if (state.musicMode === 'none') return '';
  const coverStyle = state.album ? `style="background-image:url('${state.album}')"` : '';
  const player = `<div class="music-player">
    <div class="music-row">
      <div class="mini-cover" ${coverStyle}></div>
      <div><div class="music-title">${escapeHTML(state.songTitle || '제목 없음')}</div><div class="music-artist">${escapeHTML(state.songArtist || '아티스트')}</div></div>
      <div class="music-wave">▥</div>
    </div>
    <div class="progress-row"><span>${escapeHTML(state.songElapsed)}</span><div class="progress-track"><div class="progress-fill" style="width:${state.songProgress}%"></div></div><span>${escapeHTML(state.songRemaining)}</span></div>
    <div class="music-controls"><button class="small" type="button" tabindex="-1">☆</button><button type="button" tabindex="-1">◀◀</button><button class="pause" type="button" tabindex="-1">Ⅱ</button><button type="button" tabindex="-1">▶▶</button><button class="small" type="button" tabindex="-1">◉</button></div>
  </div>`;
  if (state.musicMode === 'mini') return `<div class="music-mini">${player}</div>`;
  return `<div class="music-full-card"><div class="album-art" ${coverStyle}></div>${player}</div>`;
}

function renderPhone() {
  const phone = $('#phone');
  phone.classList.toggle('music-full', state.musicMode === 'full');
  $('#wallpaper').style.backgroundImage = state.wallpaper ? `url('${state.wallpaper}')` : '';
  $('#clockText').textContent = timeText();
  $('#dateText').textContent = parseDate(state.date);
  $('#carrierText').textContent = state.carrier;
  $('#batteryFill').style.width = `${state.battery}%`;
  const needsRoomForMiniPlayer = state.musicMode === 'mini' && state.notifications.length > 0;
  const displayedNotificationY = needsRoomForMiniPlayer ? Math.max(500, state.notificationY) : state.notificationY;
  $('#notificationLayer').style.top = `${displayedNotificationY}px`;
  const percent = Math.round(state.battery);
  $('#batteryValue').textContent = `${percent}%`;
  $('#notificationPositionValue').textContent = displayedNotificationY < 300 ? '위쪽' : displayedNotificationY > 510 ? '아래쪽' : '중간';
  renderNotifications();
  const music = $('#musicLayer');
  music.classList.toggle('hidden', state.musicMode === 'none');
  music.innerHTML = musicMarkup();
  if (state.musicMode === 'mini') {
    const musicTop = state.notifications.length ? Math.max(185, displayedNotificationY - 188) : 462;
    music.style.setProperty('--music-top', `${musicTop}px`);
  } else {
    music.style.removeProperty('--music-top');
  }
}

function bindControls() {
  $('#wallpaperInput').addEventListener('change', event => readFile(event.target, data => { state.wallpaper = data; renderPhone(); }));
  $('#resetWallpaper').addEventListener('click', () => { state.wallpaper = defaultWallpaper; $('#wallpaperInput').value = ''; renderPhone(); });
  $('#hourInput').addEventListener('input', event => { state.hour = Math.min(23, Math.max(0, event.target.value)); renderPhone(); });
  $('#minuteInput').addEventListener('input', event => { state.minute = Math.min(59, Math.max(0, event.target.value)); renderPhone(); });
  $('#dateInput').addEventListener('input', event => { state.date = event.target.value; renderPhone(); });
  $('#carrierInput').addEventListener('input', event => { state.carrier = event.target.value; renderPhone(); });
  $('#batteryInput').addEventListener('input', event => { state.battery = event.target.value; renderPhone(); });
  $('#notificationPosition').addEventListener('input', event => { state.notificationY = Number(event.target.value); renderPhone(); });
  $('#addNotification').addEventListener('click', () => {
    state.notifications.push({ id: crypto.randomUUID(), app: 'kakao', sender: '', message: '', time: '지금', icon: '' });
    if (state.musicMode === 'mini') {
      state.notificationY = Math.max(500, state.notificationY);
      $('#notificationPosition').value = state.notificationY;
    }
    renderNotificationEditor();
    renderPhone();
  });

  $('#musicMode').addEventListener('change', event => {
    state.musicMode = event.target.value;
    if (state.musicMode === 'mini' && state.notifications.length) {
      state.notificationY = Math.max(500, state.notificationY);
      $('#notificationPosition').value = state.notificationY;
    }
    renderPhone();
  });
  $('#albumInput').addEventListener('change', event => readFile(event.target, data => { state.album = data; renderPhone(); }));
  $('#songTitle').addEventListener('input', event => { state.songTitle = event.target.value; renderPhone(); });
  $('#songArtist').addEventListener('input', event => { state.songArtist = event.target.value; renderPhone(); });
  $('#songElapsed').addEventListener('input', event => { state.songElapsed = event.target.value; renderPhone(); });
  $('#songRemaining').addEventListener('input', event => { state.songRemaining = event.target.value; renderPhone(); });
  $('#songProgress').addEventListener('input', event => { state.songProgress = event.target.value; renderPhone(); });

  $('#savePng').addEventListener('click', async () => {
    const button = $('#savePng');
    const old = button.textContent;
    button.textContent = '저장 중…';
    try {
      const canvas = await html2canvas($('#phoneExport'), { backgroundColor: null, scale: 2, useCORS: true, logging: false });
      const link = document.createElement('a');
      link.download = `screenstory-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      alert('PNG 저장에 실패했어. 새로고침 후 다시 시도해봐.');
      console.error(error);
    } finally { button.textContent = old; }
  });

  const layer = $('#notificationLayer');
  let drag = null;
  layer.addEventListener('pointerdown', event => {
    if (state.musicMode === 'full') return;
    drag = { startY: event.clientY, startTop: state.notificationY };
    layer.setPointerCapture(event.pointerId);
  });
  layer.addEventListener('pointermove', event => {
    if (!drag) return;
    const minimum = state.musicMode === 'mini' && state.notifications.length ? 500 : 180;
    const next = Math.min(700, Math.max(minimum, drag.startTop + event.clientY - drag.startY));
    state.notificationY = Math.round(next);
    $('#notificationPosition').value = state.notificationY;
    renderPhone();
  });
  layer.addEventListener('pointerup', () => { drag = null; });
  layer.addEventListener('pointercancel', () => { drag = null; });
}

renderNotificationEditor();
bindControls();
renderPhone();
