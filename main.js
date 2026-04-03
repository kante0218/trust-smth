/* ===================================
   TRUST SMITH & CAPITAL - Main JS
   =================================== */

// =====================
// microCMS Configuration
// =====================
// microCMS のサービスドメインとAPIキーを設定してください
// ダッシュボード: https://app.microcms.io/
const MICROCMS_CONFIG = {
  serviceDomain: 'YOUR_SERVICE_DOMAIN', // 例: 'trustsmith'
  apiKey: 'YOUR_API_KEY',               // APIキーをここに設定
  endpoints: {
    news: 'news',       // ニュース記事用エンドポイント
    // microCMS管理画面で以下のスキーマを作成してください:
    // エンドポイント名: news (リスト形式)
    // フィールド:
    //   - title: テキストフィールド (記事タイトル)
    //   - body: リッチエディタ (記事本文)
    //   - category: セレクトフィールド (press / event / media / info)
    //   - date: 日時フィールド (公開日)
    //   - thumbnail: 画像フィールド (サムネイル画像) ※任意
  }
};

// =====================
// DOM Ready
// =====================
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initCountUp();
  initPortfolioFilter();
  initNewsFilter();
  initParticles();
  initBackToTop();
  initContactForm();
  initSmoothScroll();
  initPrivacyPolicy();
  initPortfolioCards();
  loadNewsFromMicroCMS();
});

// =====================
// Loader
// =====================
function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1800);
  });
  // Fallback
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3000);
}

// =====================
// Header Scroll Effect
// =====================
function initHeader() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Toggle scrolled class
        header.classList.toggle('scrolled', scrollY > 60);

        // Active nav link
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
          const top = section.offsetTop - 120;
          if (scrollY >= top) {
            current = section.getAttribute('id');
          }
        });
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === current);
        });

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// =====================
// Mobile Menu
// =====================
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// =====================
// Scroll Animations (Intersection Observer)
// =====================
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// =====================
// Count Up Animation
// =====================
function initCountUp() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animateCount(el, 0, target, 2000);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

function animateCount(el, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(start + (end - start) * eased);
    el.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// =====================
// Portfolio Filter
// =====================
function initPortfolioFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// =====================
// News Filter
// =====================
function initNewsFilter() {
  const buttons = document.querySelectorAll('.news-filter-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.newsFilter;
      const items = document.querySelectorAll('.news-item');

      items.forEach(item => {
        const category = item.dataset.category || '';
        if (filter === 'all' || category === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// =====================
// Particle Background
// =====================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width, height, particles;

  function resize() {
    width = canvas.width = container.offsetWidth;
    height = canvas.height = container.offsetHeight;
  }

  function createParticles() {
    const count = Math.floor((width * height) / 15000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity * 0.4})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

// =====================
// Back to Top
// =====================
function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =====================
// Contact Form
// =====================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';
    submitBtn.style.opacity = '0.6';

    // Simulate form submission (replace with actual API call)
    // 例: fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', body: formData })
    console.log('Form data:', data);

    setTimeout(() => {
      // Remove existing message if any
      const existingMsg = form.querySelector('.form-success');
      if (existingMsg) existingMsg.remove();

      // Show success message
      const msg = document.createElement('div');
      msg.className = 'form-success';
      msg.style.cssText = `
        background: rgba(0,224,158,0.1); border: 2px solid #00e09e;
        padding: 20px 24px; margin-top: 20px; text-align: center;
        font-weight: 700; color: #000; font-size: 0.9rem;
      `;
      msg.textContent = 'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。';
      form.appendChild(msg);

      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = '';

      // Remove message after 5 seconds
      setTimeout(() => { msg.remove(); }, 5000);
    }, 800);
  });
}

// =====================
// Smooth Scroll
// =====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // Auto-select contact type if service link has data-contact-type
        const contactType = anchor.dataset.contactType;
        if (contactType && href === '#contact') {
          const select = document.getElementById('contactType');
          if (select) select.value = contactType;
        }

        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// =====================
// microCMS Integration
// =====================
async function loadNewsFromMicroCMS() {
  const { serviceDomain, apiKey, endpoints } = MICROCMS_CONFIG;
  const loadingEl = document.getElementById('newsLoading');
  const fallbackEl = document.getElementById('newsFallback');
  const newsList = document.getElementById('newsList');

  // APIキーが未設定の場合はフォールバック表示（スピナーを一切見せない）
  if (apiKey === 'YOUR_API_KEY' || !apiKey) {
    if (loadingEl) loadingEl.remove();
    if (fallbackEl) fallbackEl.style.display = 'block';
    console.info(
      '[microCMS] APIキーが未設定です。\n' +
      'main.js の MICROCMS_CONFIG にサービスドメインとAPIキーを設定してください。\n' +
      'microCMS管理画面: https://app.microcms.io/'
    );
    return;
  }

  try {
    const res = await fetch(
      `https://${serviceDomain}.microcms.io/api/v1/${endpoints.news}?limit=10&orders=-date`,
      {
        headers: {
          'X-MICROCMS-API-KEY': apiKey
        }
      }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (loadingEl) loadingEl.style.display = 'none';

    if (data.contents && data.contents.length > 0) {
      renderNewsArticles(data.contents);
    } else {
      if (fallbackEl) fallbackEl.style.display = 'block';
    }
  } catch (err) {
    console.warn('[microCMS] 記事の読み込みに失敗しました:', err.message);
    if (loadingEl) loadingEl.style.display = 'none';
    if (fallbackEl) fallbackEl.style.display = 'block';
  }
}

function renderNewsArticles(articles) {
  const newsList = document.getElementById('newsList');

  const categoryMap = {
    press: { label: 'プレスリリース', class: 'press' },
    event: { label: 'イベント', class: 'event' },
    media: { label: 'メディア掲載', class: 'media' },
    info: { label: 'お知らせ', class: 'info' }
  };

  const html = articles.map((article, i) => {
    const date = new Date(article.date || article.publishedAt);
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    const cat = categoryMap[article.category] || categoryMap.info;
    const delayClass = i < 4 ? ` delay-${i}` : '';

    return `
      <article class="news-item fade-up${delayClass}" data-category="${article.category || 'info'}" data-id="${article.id}">
        <time class="news-date">${dateStr}</time>
        <span class="news-category news-category--${cat.class}">${cat.label}</span>
        <h3 class="news-title">${escapeHtml(article.title)}</h3>
      </article>
    `;
  }).join('');

  newsList.innerHTML = html;

  // Re-initialize scroll animations for new elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  newsList.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Add click handlers to open articles
  newsList.querySelectorAll('.news-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      if (id) {
        openNewsArticle(id);
      }
    });
  });
}

// =====================
// News Article Detail Modal
// =====================
async function openNewsArticle(id) {
  const { serviceDomain, apiKey, endpoints } = MICROCMS_CONFIG;

  if (apiKey === 'YOUR_API_KEY') return;

  try {
    const res = await fetch(
      `https://${serviceDomain}.microcms.io/api/v1/${endpoints.news}/${id}`,
      {
        headers: { 'X-MICROCMS-API-KEY': apiKey }
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const article = await res.json();

    showArticleModal(article);
  } catch (err) {
    console.warn('[microCMS] 記事の読み込みに失敗:', err.message);
  }
}

function showArticleModal(article) {
  // Remove existing modal
  const existing = document.getElementById('articleModal');
  if (existing) existing.remove();

  const date = new Date(article.date || article.publishedAt);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

  const modal = document.createElement('div');
  modal.id = 'articleModal';
  modal.style.cssText = `
    position: fixed; inset: 0; z-index: 2000;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px; opacity: 0; transition: opacity 0.3s;
  `;

  modal.innerHTML = `
    <div style="
      background: #fff; border-radius: 20px; max-width: 720px; width: 100%;
      max-height: 80vh; overflow-y: auto; padding: 48px;
      box-shadow: 0 25px 80px rgba(0,0,0,0.15);
    ">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px;">
        <time style="font-size:0.85rem; color:#6b7280;">${dateStr}</time>
        <button onclick="this.closest('#articleModal').remove()" style="
          background:none; border:none; font-size:1.5rem; cursor:pointer;
          color:#9ca3af; padding:4px 8px; line-height:1;
        ">&times;</button>
      </div>
      <h2 style="
        font-family:'Roboto Slab','Noto Sans JP',serif;
        font-size:1.5rem; font-weight:700; margin-bottom:24px;
        color:#0a1628; line-height:1.6;
      ">${escapeHtml(article.title)}</h2>
      <div style="
        font-size:0.95rem; color:#374151; line-height:2;
      " class="article-body">${article.body || ''}</div>
    </div>
  `;

  document.body.appendChild(modal);

  // Animate in
  requestAnimationFrame(() => {
    modal.style.opacity = '1';
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // Close on Escape
  const onEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);
}

// =====================
// Utility
// =====================
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// =====================
// Privacy Policy Modal
// =====================
function initPrivacyPolicy() {
  const link = document.getElementById('privacyPolicyLink');
  if (!link) return;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    showPrivacyPolicyModal();
  });
}

function showPrivacyPolicyModal() {
  const existing = document.getElementById('privacyModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'privacyModal';
  modal.style.cssText = `
    position: fixed; inset: 0; z-index: 2000;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px; opacity: 0; transition: opacity 0.3s;
  `;

  modal.innerHTML = `
    <div style="
      background: #fff; border-radius: 0; max-width: 720px; width: 100%;
      max-height: 80vh; overflow-y: auto; padding: 48px;
      box-shadow: 0 25px 80px rgba(0,0,0,0.15);
    ">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px;">
        <h2 style="font-size:1.5rem; font-weight:900; color:#0a1628;">プライバシーポリシー</h2>
        <button onclick="this.closest('#privacyModal').remove()" style="
          background:none; border:none; font-size:1.5rem; cursor:pointer;
          color:#9ca3af; padding:4px 8px; line-height:1;
        ">&times;</button>
      </div>
      <div style="font-size:0.9rem; color:#374151; line-height:2;">
        <h3 style="font-size:1.1rem; font-weight:700; margin:24px 0 12px; color:#0a1628;">1. 個人情報の取得</h3>
        <p>当社は、お問い合わせフォーム等を通じて、お名前、メールアドレス、会社名等の個人情報を取得することがあります。</p>
        <h3 style="font-size:1.1rem; font-weight:700; margin:24px 0 12px; color:#0a1628;">2. 利用目的</h3>
        <p>取得した個人情報は、お問い合わせへの対応、サービスのご案内、その他当社事業に関連する目的に利用いたします。</p>
        <h3 style="font-size:1.1rem; font-weight:700; margin:24px 0 12px; color:#0a1628;">3. 第三者への提供</h3>
        <p>法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。</p>
        <h3 style="font-size:1.1rem; font-weight:700; margin:24px 0 12px; color:#0a1628;">4. 安全管理</h3>
        <p>個人情報の漏洩、滅失又は毀損の防止のため、適切な安全管理措置を講じます。</p>
        <h3 style="font-size:1.1rem; font-weight:700; margin:24px 0 12px; color:#0a1628;">5. お問い合わせ</h3>
        <p>個人情報の取扱いに関するお問い合わせは、当サイトのお問い合わせフォームよりご連絡ください。</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => { modal.style.opacity = '1'; });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  const onEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);
}

// =====================
// Portfolio Card Click
// =====================
function initPortfolioCards() {
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('h3')?.textContent || '';
      const desc = card.querySelector('p')?.textContent || '';
      const stage = card.querySelector('.portfolio-stage')?.textContent || '';
      const tag = card.querySelector('.portfolio-tag')?.textContent || '';
      showPortfolioModal(name, desc, stage, tag);
    });
  });
}

function showPortfolioModal(name, desc, stage, tag) {
  const existing = document.getElementById('portfolioModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'portfolioModal';
  modal.style.cssText = `
    position: fixed; inset: 0; z-index: 2000;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px; opacity: 0; transition: opacity 0.3s;
  `;

  modal.innerHTML = `
    <div style="
      background: #fff; border-radius: 0; max-width: 560px; width: 100%;
      padding: 48px; box-shadow: 0 25px 80px rgba(0,0,0,0.15);
    ">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px;">
        <span style="font-size:0.75rem; font-weight:700; background:#00e09e; color:#000; padding:4px 12px; text-transform:uppercase; letter-spacing:0.05em;">${escapeHtml(tag)}</span>
        <button onclick="this.closest('#portfolioModal').remove()" style="
          background:none; border:none; font-size:1.5rem; cursor:pointer;
          color:#9ca3af; padding:4px 8px; line-height:1;
        ">&times;</button>
      </div>
      <h2 style="font-size:1.5rem; font-weight:900; color:#0a1628; margin-bottom:12px;">${escapeHtml(name)}</h2>
      <p style="font-size:0.95rem; color:#374151; line-height:1.9; margin-bottom:20px;">${escapeHtml(desc)}</p>
      <span style="font-size:0.8rem; font-weight:700; color:#000; background:rgba(0,224,158,0.15); padding:6px 16px;">${escapeHtml(stage)}</span>
      <div style="margin-top:32px; padding-top:24px; border-top:1px solid #e8e8e8;">
        <p style="font-size:0.85rem; color:#6b7280; line-height:1.8;">この企業についての詳細やご質問は、<a href="#contact" style="color:#00c98e; font-weight:700;" onclick="this.closest('#portfolioModal').remove()">お問い合わせフォーム</a>よりご連絡ください。</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => { modal.style.opacity = '1'; });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  const onEsc = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);
}

// CSS animation keyframe (injected dynamically)
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
