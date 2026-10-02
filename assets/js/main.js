(() => {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.site-sidebar');
  const groups = [...document.querySelectorAll('.nav-group')];
  const desktopSidebar = window.matchMedia('(min-width: 1001px)');

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

  const search = document.querySelector('#nav-search');
  const searchResults = document.querySelector('.search-results');
  if (search && searchResults) {
    const isSubpage = document.querySelector('.brand')?.getAttribute('href')?.startsWith('../');
    const path = (name) => (isSubpage ? name : `sites/${name}`);
    const pages = [
      {
        title: 'Home',
        href: isSubpage ? '../index.html' : 'index.html',
        text: 'computational materials scientist permanent magnets University of Vienna Krems machine learning optimization uncertainty',
      },
      {
        title: 'Research',
        href: path('research.html'),
        text: 'permanent magnet design uncertainty quantification surrogate models active learning optimization Nd Fe B materials',
      },
      {
        title: 'Publications',
        href: path('publications.html'),
        text: 'papers presentations talks conferences JEMS REPM MMM Intermag neural networks uncertainty aware',
      },
      {
        title: 'Profile',
        href: path('profile.html'),
        text: 'CV doctorate physics University of Vienna masters computational science education skills Python Bash Java',
      },
      {
        title: 'Writing',
        href: path('writing.html'),
        text: 'blog notes scientific software modeling machine learning',
      },
      {
        title: 'Selected Work',
        href: path('work.html'),
        text: 'GitHub projects software NOx sensor cloud backup locusts SIR classifier simulation',
      },
    ];
    const renderResults = (query) => {
      const normalized = query.trim().toLowerCase();
      if (!normalized) {
        searchResults.hidden = true;
        searchResults.replaceChildren();
        return;
      }
      const matches = pages.filter((page) =>
        `${page.title} ${page.text}`.toLowerCase().includes(normalized),
      );
      searchResults.hidden = false;
      searchResults.replaceChildren();
      if (!matches.length) {
        const empty = document.createElement('li');
        empty.textContent = 'No matching pages';
        searchResults.append(empty);
        return;
      }
      matches.forEach((page) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = page.href;
        link.textContent = page.title;
        link.addEventListener('click', closeSidebar);
        item.append(link);
        searchResults.append(item);
      });
    };
    search.addEventListener('input', () => renderResults(search.value));
  }

  const reveal = document.querySelector('[data-email-reveal]');
  if (reveal)
    reveal.addEventListener('click', () => {
      const email = ['clemens.wager', 'donau-uni.ac.at'].join('@');
      const output = document.querySelector('.email-output');
      output.innerHTML = `<a href="mailto:${email}">${email}</a>`;
      reveal.hidden = true;
    });
})();
