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
      },
      {
        title: 'Research',
        href: path('research.html'),
      },
      {
        title: 'Publications',
        href: path('publications.html'),
      },
      {
        title: 'Profile',
        href: path('profile.html'),
      },
      {
        title: 'Writing',
        href: path('writing.html'),
      },
      {
        title: 'Selected Work',
        href: path('work.html'),
      },
    ];
    const normalize = (value) => value.replace(/\s+/g, ' ').trim();
    const indexPage = async (page) => {
      try {
        const response = await fetch(page.href);
        if (!response.ok) throw new Error(`Unable to load ${page.href}`);
        const document = new DOMParser().parseFromString(await response.text(), 'text/html');
        const sections = [...document.querySelectorAll('main > section')];
        return sections.map((section) => {
          const heading = normalize(section.querySelector('h1, h2')?.textContent || page.title);
          return {
            page: page.title,
            section: heading,
            href: `${page.href}${section.id ? `#${section.id}` : ''}`,
            text: normalize(`${page.title} ${heading} ${section.textContent}`).toLowerCase(),
          };
        });
      } catch {
        return [];
      }
    };
    const searchIndex = Promise.all(pages.map(indexPage)).then((results) => results.flat());
    let searchRequest = 0;
    const renderResults = async (query) => {
      const request = ++searchRequest;
      const normalized = query.trim().toLowerCase();
      if (!normalized) {
        searchResults.hidden = true;
        searchResults.replaceChildren();
        return;
      }
      const terms = normalized.split(/\s+/).filter(Boolean);
      searchResults.hidden = false;
      searchResults.replaceChildren();
      const loading = document.createElement('li');
      loading.textContent = 'Searching…';
      searchResults.append(loading);
      const matches = (await searchIndex).filter((entry) =>
        terms.every((term) => entry.text.includes(term)),
      );
      if (request !== searchRequest) return;
      searchResults.hidden = false;
      searchResults.replaceChildren();
      if (!matches.length) {
        const empty = document.createElement('li');
        empty.textContent = 'No matching pages';
        searchResults.append(empty);
        return;
      }
      matches.forEach((match) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = match.href;
        link.textContent = `${match.page} — ${match.section}`;
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
