(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const groups = [...document.querySelectorAll('.nav-group')];
  const closeGroups = () => groups.forEach(group => { group.open = false; });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  groups.forEach(group => {
    group.addEventListener('toggle', () => {
      if (group.open) groups.forEach(other => { if (other !== group) other.open = false; });
    });
    group.querySelectorAll('a').forEach(link => link.addEventListener('click', closeGroups));
  });

  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.nav-group')) closeGroups();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeGroups();
  });

  const reveal = document.querySelector('[data-email-reveal]');
  if (reveal) reveal.addEventListener('click', () => {
    const email = ['clemens.wager', 'donau-uni.ac.at'].join('@');
    const output = document.querySelector('.email-output');
    output.innerHTML = `<a href="mailto:${email}">${email}</a>`;
    reveal.hidden = true;
  });
})();
