document.addEventListener('DOMContentLoaded', function () {
  var postHeader  = document.getElementById('post-header');
  var postContent = document.getElementById('post-content');
  var postNav     = document.getElementById('post-nav');

  function getSlug() {
    return new URLSearchParams(location.search).get('slug');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function showError(msg) {
    postContent.innerHTML =
      '<div class="error-message">' +
        '<p>' + msg + '</p>' +
        '<p><a href="index.html">← 목록으로 돌아가기</a></p>' +
      '</div>';
  }

  function setupMarked() {
    var renderer = new marked.Renderer();

    renderer.code = function (codeOrToken, lang) {
      var code, language;
      if (typeof codeOrToken === 'object' && codeOrToken !== null) {
        code = codeOrToken.text || '';
        language = codeOrToken.lang || '';
      } else {
        code = codeOrToken;
        language = lang || '';
      }
      var validLang = (language && typeof hljs !== 'undefined' && hljs.getLanguage(language))
        ? language
        : 'plaintext';
      var highlighted = (typeof hljs !== 'undefined')
        ? hljs.highlight(code, { language: validLang }).value
        : escapeHtml(code);
      return '<pre><code class="hljs language-' + validLang + '">' + highlighted + '</code></pre>';
    };

    marked.use({ renderer: renderer });
  }

  function renderMeta(meta) {
    var tags = (meta.tags || []).map(function (t) {
      return '<span class="tag">' + escapeHtml(t) + '</span>';
    }).join('');

    postHeader.innerHTML =
      '<h1 class="post-title">' + escapeHtml(meta.title) + '</h1>' +
      '<div class="post-meta">' +
        '<time datetime="' + escapeHtml(meta.date) + '">' + formatDate(meta.date) + '</time>' +
        tags +
      '</div>';

    document.title = meta.title + ' | My Blog';
  }

  function enhanceCodeBlocks() {
    postContent.querySelectorAll('pre').forEach(function (pre) {
      var code = pre.querySelector('code');
      if (!code) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      var langClass = Array.from(code.classList).find(function (c) {
        return c.startsWith('language-');
      });
      var lang = langClass ? langClass.replace('language-', '') : '';

      if (lang && lang !== 'plaintext') {
        var label = document.createElement('span');
        label.className = 'code-lang-label';
        label.textContent = lang;
        wrapper.appendChild(label);
      }

      var copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = '복사';
      copyBtn.addEventListener('click', function () {
        var text = code.innerText || code.textContent;
        var fallback = function () {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          try { document.execCommand('copy'); } catch (e) {}
          document.body.removeChild(ta);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            markCopied(copyBtn);
          }).catch(fallback);
        } else {
          fallback();
          markCopied(copyBtn);
        }
      });
      wrapper.appendChild(copyBtn);
    });
  }

  function markCopied(btn) {
    btn.textContent = '복사됨!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = '복사';
      btn.classList.remove('copied');
    }, 2000);
  }

  function renderNavigation(posts, currentSlug) {
    var idx = posts.findIndex(function (p) { return p.slug === currentSlug; });
    if (idx === -1) return;

    var prev = idx < posts.length - 1 ? posts[idx + 1] : null;
    var next = idx > 0 ? posts[idx - 1] : null;

    var html = '';
    if (prev) {
      html += '<a class="post-nav__link prev" href="post.html?slug=' + encodeURIComponent(prev.slug) + '">' +
        '<span class="post-nav__label">← 이전 글</span>' +
        '<span class="post-nav__title">' + escapeHtml(prev.title) + '</span>' +
      '</a>';
    }
    if (next) {
      html += '<a class="post-nav__link next" href="post.html?slug=' + encodeURIComponent(next.slug) + '">' +
        '<span class="post-nav__label">다음 글 →</span>' +
        '<span class="post-nav__title">' + escapeHtml(next.title) + '</span>' +
      '</a>';
    }
    postNav.innerHTML = html;
  }

  var slug = getSlug();
  if (!slug) {
    location.href = 'index.html';
    return;
  }

  setupMarked();

  fetch('posts/index.json')
    .then(function (res) {
      if (!res.ok) throw new Error('index.json 로딩 실패');
      return res.json();
    })
    .then(function (posts) {
      var meta = posts.find(function (p) { return p.slug === slug; });
      if (!meta) {
        showError('존재하지 않는 포스트입니다. (slug: ' + escapeHtml(slug) + ')');
        return;
      }

      renderMeta(meta);
      renderNavigation(posts, slug);

      return fetch('posts/' + encodeURIComponent(slug) + '.md')
        .then(function (res) {
          if (!res.ok) throw new Error('마크다운 파일을 찾을 수 없습니다.');
          return res.text();
        })
        .then(function (markdown) {
          postContent.innerHTML = marked.parse(markdown);
          enhanceCodeBlocks();
        });
    })
    .catch(function (err) {
      showError(err.message || '포스트를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    });
});
