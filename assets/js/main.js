(() => {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.site-sidebar');
  const groups = [...document.querySelectorAll('.nav-group')];
  const desktopSidebar = window.matchMedia('(min-width: 1001px)');
  const isSubpage = document.querySelector('.brand')?.getAttribute('href')?.startsWith('../');
  const navGroupPages = {
    Publications: isSubpage ? 'publications.html' : 'sites/publications.html',
    Profile: isSubpage ? 'profile.html' : 'sites/profile.html',
  };

  const closeGroups = () =>
    groups.forEach((group) => {
      group.open = false;
    });
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
  const syncSidebarMode = () => {
    if (!sidebar || !toggle) return;
    if (desktopSidebar.matches) {
      sidebar.classList.remove('open');
      toggle.setAttribute(
        'aria-expanded',
        String(!document.body.classList.contains('sidebar-collapsed')),
      );
    } else {
      document.body.classList.remove('sidebar-collapsed');
      toggle.setAttribute('aria-expanded', String(sidebar.classList.contains('open')));
    }
  };
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      if (desktopSidebar.matches) {
        const collapsed = document.body.classList.toggle('sidebar-collapsed');
        toggle.setAttribute('aria-expanded', String(!collapsed));
      } else {
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
      }
    });
    desktopSidebar.addEventListener('change', syncSidebarMode);
    syncSidebarMode();
  }

  groups.forEach((group) => {
    const summary = group.querySelector('summary');
    summary?.addEventListener('click', (event) => {
      if (!group.open) return;
      const href = navGroupPages[summary.textContent.trim()];
      if (!href) return;
      event.preventDefault();
      window.location.assign(href);
    });
    group.addEventListener('toggle', () => {
      if (group.open)
        groups.forEach((other) => {
          if (other !== group) other.open = false;
        });
    });
    group.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', () => {
        closeGroups();
        closeSidebar();
      }),
    );
  });
  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.nav-group')) closeGroups();
    if (
      sidebar?.classList.contains('open') &&
      !event.target.closest('.site-sidebar') &&
      !event.target.closest('.menu-toggle')
    )
      closeSidebar();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeGroups();
      closeSidebar();
    }
  });

  const reveal = document.querySelector('[data-email-reveal]');
  if (reveal)
    reveal.addEventListener('click', () => {
      const email = ['clemens.wager', 'donau-uni.ac.at'].join('@');
      const output = document.querySelector('.email-output');
      output.innerHTML = `<a href="mailto:${email}">${email}</a>`;
      reveal.hidden = true;
    });
})();
