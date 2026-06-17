(function () {
  var HLJS_LIGHT = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css';
  var HLJS_DARK  = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark.min.css';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var link = document.getElementById('hljs-theme');
    if (link) {
      link.href = theme === 'dark' ? HLJS_DARK : HLJS_LIGHT;
    }
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  var initialTheme = getSavedTheme() || getSystemTheme();
  applyTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function updateIcon(theme) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
    }

    updateIcon(document.documentElement.getAttribute('data-theme'));

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      updateIcon(next);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!getSavedTheme()) {
        var theme = e.matches ? 'dark' : 'light';
        applyTheme(theme);
        updateIcon(theme);
      }
    });
  });
})();
