// Simple page loader utility
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  // Hide on initial load after small delay
  setTimeout(() => loader.style.display = 'none', 200);
  // Show loader on navigation (link clicks)
  document.body.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || a.target === '_blank') return;
    loader.style.display = 'flex';
  });
});
