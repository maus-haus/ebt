// Navigation — show/hide sections, update bottom nav

let current = '';

export function go(sec) {
  if (!sec) sec = 'overview';
  document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(sec);
  if (target) target.classList.add('active');

  document.querySelectorAll('#bottomNav button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.s === sec);
  });
  current = sec;
  // update hash without scroll
  history.replaceState(null, '', '#' + sec);
}

export function initNav() {
  window.addEventListener('popstate', () => {
    go(location.hash.slice(1) || 'overview');
  });
}

export function getCurrent() { return current; }
