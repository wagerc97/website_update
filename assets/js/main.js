(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav-group').forEach(group => group.addEventListener('toggle', () => {
    if (group.open) document.querySelectorAll('.nav-group').forEach(other => { if (other !== group) other.open = false; });
  }));
  const reveal = document.querySelector('[data-email-reveal]');
  if (reveal) reveal.addEventListener('click', () => {
    const email = ['clemens.wager','donau-uni.ac.at'].join('@');
    const output = document.querySelector('.email-output');
    output.innerHTML = `<a href="mailto:${email}">${email}</a>`;
    reveal.hidden = true;
  });
})();
