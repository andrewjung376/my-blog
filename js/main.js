document.addEventListener('DOMContentLoaded', function () {
  var postList = document.getElementById('post-list');
  var tagFilter = document.getElementById('tag-filter');
  var allPosts = [];
  var activeTag = null;

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function renderPosts(posts) {
    if (posts.length === 0) {
      postList.innerHTML = '<li class="error-message">해당 태그의 글이 없습니다.</li>';
      return;
    }

    postList.innerHTML = posts.map(function (post) {
      var tags = (post.tags || []).map(function (t) {
        return '<span class="tag">' + escapeHtml(t) + '</span>';
      }).join('');

      return '<li>' +
        '<a class="post-card" href="post.html?slug=' + encodeURIComponent(post.slug) + '">' +
          '<h2 class="post-card__title">' + escapeHtml(post.title) + '</h2>' +
          '<div class="post-card__meta">' +
            '<time class="post-card__date" datetime="' + escapeHtml(post.date) + '">' +
              formatDate(post.date) +
            '</time>' +
            tags +
          '</div>' +
          '<p class="post-card__excerpt">' + escapeHtml(post.excerpt || '') + '</p>' +
        '</a>' +
      '</li>';
    }).join('');
  }

  function initTagFilter(posts) {
    var tagSet = new Set();
    posts.forEach(function (p) {
      (p.tags || []).forEach(function (t) { tagSet.add(t); });
    });

    if (tagSet.size === 0) return;

    var allBtn = document.createElement('button');
    allBtn.className = 'tag-filter-btn active';
    allBtn.textContent = '전체';
    allBtn.addEventListener('click', function () {
      activeTag = null;
      updateActiveBtn(allBtn);
      renderPosts(allPosts);
    });
    tagFilter.appendChild(allBtn);

    tagSet.forEach(function (tag) {
      var btn = document.createElement('button');
      btn.className = 'tag-filter-btn';
      btn.textContent = tag;
      btn.addEventListener('click', function () {
        activeTag = tag;
        updateActiveBtn(btn);
        renderPosts(allPosts.filter(function (p) {
          return (p.tags || []).includes(tag);
        }));
      });
      tagFilter.appendChild(btn);
    });
  }

  function updateActiveBtn(activeBtn) {
    tagFilter.querySelectorAll('.tag-filter-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    activeBtn.classList.add('active');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showError(msg) {
    postList.innerHTML = '<li class="error-message">' + msg + '</li>';
  }

  fetch('posts/index.json')
    .then(function (res) {
      if (!res.ok) throw new Error('index.json 로딩 실패');
      return res.json();
    })
    .then(function (posts) {
      allPosts = posts;
      initTagFilter(posts);
      renderPosts(posts);
    })
    .catch(function (err) {
      showError('포스트를 불러오지 못했습니다. 로컬 서버로 실행 중인지 확인해주세요.');
      console.error(err);
    });
});
