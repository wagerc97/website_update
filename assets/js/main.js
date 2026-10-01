(() => {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.site-sidebar');
  const groups = [...document.querySelectorAll('.nav-group')];

  const closeGroups = () => groups.forEach(group => { group.open = false; });
  const openSidebar = () => {
    if (!sidebar || !toggle) return;
    sidebar.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  };
  const closeSidebar = () => {
    if (!sidebar || !toggle) return;
    sidebar.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
  }

  groups.forEach(group => {
    group.addEventListener('toggle', () => {
      if (group.open) groups.forEach(other => { if (other !== group) other.open = false; });
    });
    group.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { closeGroups(); closeSidebar(); }));
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.nav-group')) closeGroups();
    if (sidebar?.classList.contains('open') && !event.target.closest('.site-sidebar') && !event.target.closest('.menu-toggle')) closeSidebar();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeGroups(); closeSidebar(); }
  });

  const search = document.querySelector('#nav-search');
  if (search) search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll('.site-nav > ul > li').forEach(item => {
      const match = !query || item.textContent.toLowerCase().includes(query);
      item.hidden = !match;
      if (query && match && item.querySelector('.nav-group')) item.querySelector('.nav-group').open = true;
    });
  });

  const reveal = document.querySelector('[data-email-reveal]');
  if (reveal) reveal.addEventListener('click', () => {
    const email = ['clemens.wager', 'donau-uni.ac.at'].join('@');
    const output = document.querySelector('.email-output');
    output.innerHTML = `<a href="mailto:${email}">${email}</a>`;
    reveal.hidden = true;
  });
})();
