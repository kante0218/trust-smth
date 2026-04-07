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
  initLanguageToggle();
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
    submitBtn.textContent = t('form.sending');
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
      msg.textContent = t('form.success');
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
    press: { label: t('news.cat.press'), class: 'press' },
    event: { label: t('news.cat.event'), class: 'event' },
    media: { label: t('news.cat.media'), class: 'media' },
    info: { label: t('news.cat.info'), class: 'info' }
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
        <h2 style="font-size:1.5rem; font-weight:900; color:#0a1628;">${t('privacy.title')}</h2>
        <button onclick="this.closest('#privacyModal').remove()" style="
          background:none; border:none; font-size:1.5rem; cursor:pointer;
          color:#9ca3af; padding:4px 8px; line-height:1;
        ">&times;</button>
      </div>
      <div style="font-size:0.9rem; color:#374151; line-height:2;">
        <h3 style="font-size:1.1rem; font-weight:700; margin:24px 0 12px; color:#0a1628;">${t('privacy.h1')}</h3>
        <p>${t('privacy.p1')}</p>
        <h3 style="font-size:1.1rem; font-weight:700; margin:24px 0 12px; color:#0a1628;">${t('privacy.h2')}</h3>
        <p>${t('privacy.p2')}</p>
        <h3 style="font-size:1.1rem; font-weight:700; margin:24px 0 12px; color:#0a1628;">${t('privacy.h3')}</h3>
        <p>${t('privacy.p3')}</p>
        <h3 style="font-size:1.1rem; font-weight:700; margin:24px 0 12px; color:#0a1628;">${t('privacy.h4')}</h3>
        <p>${t('privacy.p4')}</p>
        <h3 style="font-size:1.1rem; font-weight:700; margin:24px 0 12px; color:#0a1628;">${t('privacy.h5')}</h3>
        <p>${t('privacy.p5')}</p>
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
        <p style="font-size:0.85rem; color:#6b7280; line-height:1.8;">${t('portfolio.modal.detail').replace('{link}', `<a href="#contact" style="color:#00c98e; font-weight:700;" onclick="this.closest('#portfolioModal').remove()">${t('portfolio.modal.linkText')}</a>`)}</p>
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
// Language Toggle (i18n)
// =====================
const translations = {
  ja: {
    'meta.title': 'TRUST SMITH & CAPITAL | 次世代型インキュベーション・エコシステム',
    'meta.desc': '志の高い起業家を発掘し、革新的なスタートアップを創造するVC 兼 次世代型インキュベーション・エコシステム',
    'aria.menu': 'メニューを開く',
    'aria.backToTop': 'ページ上部へ',
    'hero.label': 'Next-Generation Incubation Ecosystem',
    'hero.title1': 'イノベーションの未来を',
    'hero.title2': '切り拓く。',
    'hero.desc': '革新的なスタートアップを発掘・育成し、<br>社会に新たな価値を生み出すベンチャーキャピタル。',
    'hero.cta1': '資金調達のご相談',
    'hero.cta2': '詳しく見る',
    'about.title': '私たちについて',
    'about.heading': '次世代の産業を共創する<br>インキュベーション・エコシステム',
    'about.desc': 'TRUST SMITH & CAPITALは、単なる資金提供にとどまらず、起業家と共に事業を構想し、成長を加速させる次世代型のベンチャーキャピタルです。テクノロジー、ヘルスケア、サステナビリティなど、社会課題の解決に挑むスタートアップを支援しています。',
    'about.quote': '"信頼と革新の力で、<br>次の時代を切り拓く。"',
    'about.value1desc': '信頼を基盤とした長期的なパートナーシップ',
    'about.value2desc': '革新的なアイデアを形にする実行力',
    'about.value3desc': '起業家と共に成長し続ける姿勢',
    'philosophy.l1': '己の一生賭け、その命を燃やし続けられる',
    'philosophy.l2': '壮大な人生のテーマを発掘せよ。',
    'philosophy.l3': 'そして、誰よりも高く、デカい旗を揚げよ。',
    'philosophy.l4': '見る者の心を奪い、己の胸を熱く震わせる',
    'philosophy.l5': '艶やかで力強い旗を。',
    'philosophy.l6': '愚かなほどの大きなビジョンを掲げ、',
    'philosophy.l7': 'その夢に共鳴する仲間が集まれば、',
    'philosophy.l8': 'あとは、とち狂ったように、突き進むのみ。',
    'philosophy.l9': 'この世界に、風穴を開けよ。',
    'philosophy.l10': '来たるべき未来、その手で書き換えよ。',
    'philosophy.l11': '燃えたぎる魂で、この世の景色を塗り替えていけ。',
    'support.heading': '創業者の人生そのものに、向き合います。',
    'support.desc1': '代表の安藤は、米国物流スタートアップRENATUS ROBOTICS inc.の創業者兼COO、同社の前身となる東大発AIベンチャーTRUST SMITHグループのCOOとして、個性溢れるCEOと共に、AI/ディープテック/ブロックチェーン領域で、累計7法人の事業の立ち上げを経験してきました。',
    'support.desc2': 'これまで培った経験を元に「CEOの妻」として、自分にしか提供できないような、ユニークな価値を創造することをお約束します。',
    'support.biz.title': '経営支援',
    'support.biz.l1': '事業計画/資本政策/プロダクトロードマップの策定',
    'support.biz.l2': '営業/Go To Market戦略の策定と実行',
    'support.biz.l3': '採用支援（CXOクラスの紹介/採用ワークフローの構築）',
    'support.biz.l4': '大企業とのアライアンス/知財戦略の策定',
    'support.biz.l5': '人事戦略の策定（組織図設計/人事評価制度/MVV策定）',
    'support.biz.l6': '広報/マーケティング支援',
    'support.biz.l7': '次ラウンド以降のエクイティ・ファイナンス支援',
    'support.biz.l8': 'デット・ファイナンス支援（融資/RBF/プロジェクト・ファイナンス/Crypto調達）',
    'support.biz.l9': '補助金申請（NEDO/ものづくり補助金等）',
    'support.biz.l10': 'ピッチコンテストの必勝法伝授',
    'support.biz.l11': 'US/日本のアクセラレーターの活用戦略',
    'support.biz.l12': '登記手続き/バックオフィス体制の構築支援',
    'support.biz.l13': 'その他、シリーズAまでに必要な経営サポート',
    'support.life.title': '人生支援',
    'support.life.l1': '人生ブチ上げ経営合宿の企画/運営',
    'support.life.l2': '合トレ（筋トレ/フットサル/野球/バスケ/ランニング等）',
    'support.life.l3': '結婚パートナー探しの支援',
    'support.life.l4': 'Exit後まで含めた20-30年スパンでの人生設計メンタリング',
    'support.life.l5': 'その他、「CEOの人生の幸福度最大化」に資するサポート',
    'strategy.phase.title': '投資/支援フェーズ',
    'strategy.phase.t1': 'Pre-Seed（起業前）',
    'strategy.phase.t2': 'Seed（起業後〜資金調達前）',
    'strategy.focus.title': '注力領域',
    'strategy.focus.t1': 'AI/アルゴリズム',
    'strategy.focus.t2': 'ロボティクス',
    'strategy.focus.t3': '脱炭素/気候変動/環境エネルギー',
    'strategy.focus.t4': '宇宙',
    'strategy.focus.t5': '製造業',
    'strategy.focus.t6': '物流業',
    'strategy.focus.t7': '不動産/建設',
    'strategy.focus.t8': '防衛テック',
    'strategy.focus.note': '「巨大産業×テクノロジー」により、ユニコーン/デカコーンを狙える領域に積極的に投資。',
    'strategy.amount.title': '投資金額',
    'strategy.amount.value': '2,000 - 5,000<span>万円</span>',
    'strategy.amount.note': '1社あたり',
    'strategy.lead.title': 'リード/フォロー',
    'strategy.lead.value': 'リード投資中心',
    'services.title': '事業内容',
    'services.s1title': 'ベンチャー投資',
    'services.s1desc': 'シード〜シリーズBまで幅広いステージのスタートアップに投資。事業の可能性を見極め、最適な資金を提供します。',
    'services.s1link': '資金調達のご相談 <span>&rarr;</span>',
    'services.s2title': 'ハンズオン支援',
    'services.s2desc': '経営戦略、マーケティング、採用、事業開発まで。投資後も伴走型で事業成長を加速させます。',
    'services.s2link': '事業提携のご相談 <span>&rarr;</span>',
    'services.s3title': 'インキュベーション',
    'services.s3desc': '起業前のアイデア段階から支援。事業計画の策定、プロトタイプ開発、初期顧客獲得まで並走します。',
    'services.s3link': '起業のご相談 <span>&rarr;</span>',
    'services.s4title': 'コミュニティ運営',
    'services.s4desc': '起業家同士のネットワーク構築、メンターマッチング、業界エキスパートとの接点を創出します。',
    'services.s4link': 'お問い合わせ <span>&rarr;</span>',
    'portfolio.title': '投資先企業',
    'portfolio.coming': '投資先企業の情報は準備中です。',
    'news.title': 'お知らせ',
    'news.all': 'すべて',
    'news.press': 'プレスリリース',
    'news.event': 'イベント',
    'news.media': 'メディア掲載',
    'news.info': 'お知らせ',
    'news.loading': '記事を読み込み中...',
    'news.cat.press': 'プレスリリース',
    'news.cat.event': 'イベント',
    'news.cat.media': 'メディア掲載',
    'news.cat.info': 'お知らせ',
    'news.empty': '現在お知らせはありません。',
    'news.more': 'もっと見る',
    'team.title': 'チーム',
    'team.coming': 'チーム情報は準備中です。',
    'founder.name': '安藤 奨馬',
    'founder.role': '代表（GP）',
    'founder.c1.t': '京都大学工学部 / 京都大学工学研究科 卒業',
    'founder.c1.d': '日本建築学会全国大会で若手優秀発表賞を受賞',
    'founder.c2.t': 'TRUST SMITHグループ COO',
    'founder.c2.d': 'AI/ディープテック/ブロックチェーン領域で、累計7法人の事業の立ち上げ',
    'founder.c3.t': 'RENATUS ROBOTICS Inc.（米国法人） COO',
    'founder.c3.d1': '「IVS2024 KYOTO LAUNCHPAD」京都国際賞（優勝）&amp; オーディエンス賞のW受賞',
    'founder.c3.d2': '「Berkeley Skydeck IPP/Pad-13 Pitch Contest」1st place（優勝）',
    'program.c1.title': 'デカコーン・ハウス',
    'program.c1.d1': 'デカコーンを狙うイノベーターが集まるシェアハウス「デカコーン・ハウス」の運営をしています。',
    'program.c1.d2': '情報感度の高いイノベーターが、同じ屋根の下で寝食を共にすることで、各住民が入手した門外不出レベルの有益情報がシェアされるため、起業家の成功確率がグッと高まります。',
    'program.c1.h': '大きな挑戦をするためのヒントを得たい方や、自分の視座を爆上げしたい方は、ぜひ一緒にデカコーン・ハウスに遊びにいきましょう。',
    'program.c2.title': 'スカウティング制度',
    'program.c2.d1': 'SMITH &amp; CAPITALの一員として、一緒に投資活動を行う「起業家」を募集します。',
    'program.c2.d2': '「自分の身体がもう一つあったら、この事業に張りたかった！」<br>「自分の経験上、このタイプの起業家は絶対に成功する！」',
    'program.c2.d3': '経営と投資は、表裏一体。投資業務を経験してみたい方、ぜひ一緒にやりましょう。皆さんの考える投資仮説、教えて下さい。',
    'trustsmith.title': 'TRUST SMITHとは？',
    'trustsmith.desc1': 'TRUST SMITHとは、最先端のAI・ロボティクス・数理アルゴリズム・ブロックチェーン等の技術を活用し、世界の巨大産業に対してソリューション提供を行う東京大学発スタートアップ・エコシステムです。',
    'trustsmith.f1': '"技術"ではなく、"決裁者の声"から始まる、再現性の高い創業アプローチ<strong>「トラスミ創業スキーム」</strong>',
    'trustsmith.f2': '顧客の価値提供を追求することで誕生した、独自の経営理論<strong>「スミス理論」</strong>',
    'trustsmith.desc2': 'を提唱し、RENATUS ROBOTICS Inc.をはじめ、グループ内で累計7法人、OB・OGによる起業を含め、国内外で累計10社以上のスタートアップを輩出しています。',
    'trustsmith.tagline': '"Next RENATUS" の発掘へ。',
    'trustsmith.link1': 'TRUST SMITH株式会社 HP',
    'trustsmith.link2': 'RENATUS ROBOTICS HP',
    'outline.r1.l': '組合名',
    'outline.r1.v': 'TRUST SMITH &amp; CAPITAL<br>投資事業有限責任組合',
    'outline.r2.l': '代表（GP）',
    'outline.r2.v': '安藤 奨馬',
    'outline.r3.l': '金額規模',
    'outline.r3.v': '5.1億円（最大10億円）',
    'outline.r4.l': '設立日',
    'outline.r4.v': '2025年1月',
    'form.sending': '送信中...',
    'form.success': 'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。',
    'privacy.title': 'プライバシーポリシー',
    'privacy.h1': '1. 個人情報の取得',
    'privacy.p1': '当社は、お問い合わせフォーム等を通じて、お名前、メールアドレス、会社名等の個人情報を取得することがあります。',
    'privacy.h2': '2. 利用目的',
    'privacy.p2': '取得した個人情報は、お問い合わせへの対応、サービスのご案内、その他当社事業に関連する目的に利用いたします。',
    'privacy.h3': '3. 第三者への提供',
    'privacy.p3': '法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。',
    'privacy.h4': '4. 安全管理',
    'privacy.p4': '個人情報の漏洩、滅失又は毀損の防止のため、適切な安全管理措置を講じます。',
    'privacy.h5': '5. お問い合わせ',
    'privacy.p5': '個人情報の取扱いに関するお問い合わせは、当サイトのお問い合わせフォームよりご連絡ください。',
    'portfolio.modal.detail': 'この企業についての詳細やご質問は、{link}よりご連絡ください。',
    'portfolio.modal.linkText': 'お問い合わせフォーム',
    'careers.title': '採用情報',
    'careers.heading': '未来を共に創る仲間を探しています。',
    'careers.desc': 'TRUST SMITH & CAPITALでは、起業家と共に社会課題の解決に取り組む情熱を持ったメンバーを募集しています。',
    'careers.p1title': '投資担当アソシエイト',
    'careers.fulltime': '正社員',
    'careers.p1desc': 'スタートアップの発掘・分析・投資実行を担当。投資先の成長支援にも携わります。',
    'careers.p1t1': 'VC経験歓迎',
    'careers.p1t2': 'リモート可',
    'careers.p1t3': '東京',
    'careers.p2title': 'バリューアップ担当',
    'careers.fulltime2': '正社員',
    'careers.p2desc': '投資先スタートアップの事業成長支援。戦略立案からオペレーション改善まで幅広く携わります。',
    'careers.p2t1': 'コンサル経験歓迎',
    'careers.p2t2': 'フレックス',
    'careers.p2t3': '東京',
    'careers.p3title': 'インターン',
    'careers.p3type': 'インターン',
    'careers.p3desc': 'リサーチ・分析業務を中心に、VCの実務を経験できるインターンシップ。週2日〜OK。',
    'careers.p3t1': '学生歓迎',
    'careers.p3t2': '週2日〜',
    'careers.p3t3': '東京',
    'careers.apply': '応募する',
    'careers.chat': 'カジュアル面談',
    'funding.title': '資金調達のご相談',
    'funding.desc': '事業アイデアの段階から、シリーズBまで。<br>まずはお気軽にご相談ください。',
    'funding.cta': '相談予約をする',
    'contact.title': 'お問い合わせ',
    'contact.heading': 'お気軽にお問い合わせください',
    'contact.desc': '資金調達のご相談、事業提携、採用についてなど、下記フォームよりお問い合わせください。',
    'contact.location': '所在地',
    'contact.address': '東京都渋谷区',
    'contact.email': 'メール',
    'contact.form.type': 'お問い合わせ種別',
    'contact.form.select': '選択してください',
    'contact.form.funding': '資金調達のご相談',
    'contact.form.partnership': '事業提携',
    'contact.form.careers': '採用について',
    'contact.form.media': '取材・メディア',
    'contact.form.other': 'その他',
    'contact.form.name': 'お名前',
    'contact.form.company': '会社名',
    'contact.form.email': 'メールアドレス',
    'contact.form.message': 'お問い合わせ内容',
    'contact.form.submit': '送信する',
    'footer.desc': '志の高い起業家を発掘し、革新的なスタートアップを創造するVC 兼 次世代型インキュベーション・エコシステム'
  },
  en: {
    'meta.title': 'TRUST SMITH & CAPITAL | Next-Generation Incubation Ecosystem',
    'meta.desc': 'A venture capital firm and next-generation incubation ecosystem that discovers ambitious entrepreneurs and creates innovative startups.',
    'aria.menu': 'Open menu',
    'aria.backToTop': 'Back to top',
    'hero.label': 'Next-Generation Incubation Ecosystem',
    'hero.title1': 'Launching a Future',
    'hero.title2': 'of Innovation',
    'hero.desc': 'A venture capital firm that discovers and nurtures<br> innovative startups to create new value for society.',
    'hero.cta1': 'Funding Consultation',
    'hero.cta2': 'Learn More',
    'about.title': 'About Us',
    'about.heading': 'Co-creating Next-Generation<br>Industries Together',
    'about.desc': 'TRUST SMITH & CAPITAL goes beyond mere funding. We are a next-generation venture capital firm that co-creates businesses with entrepreneurs and accelerates growth. We support startups tackling social challenges in technology, healthcare, sustainability and more.',
    'about.quote': '"Pioneering the next era<br>with trust and innovation."',
    'about.value1desc': 'Long-term partnerships built on trust',
    'about.value2desc': 'Execution power to bring innovative ideas to life',
    'about.value3desc': 'A commitment to growing alongside entrepreneurs',
    'philosophy.l1': 'Unearth the grand life theme',
    'philosophy.l2': 'worth burning every fiber of your being for.',
    'philosophy.l3': 'Then raise a flag higher and bigger than anyone else\'s.',
    'philosophy.l4': 'A vivid, powerful flag that captures hearts',
    'philosophy.l5': 'and sets your own soul ablaze.',
    'philosophy.l6': 'Hold up a vision foolishly grand,',
    'philosophy.l7': 'and once kindred spirits gather around it,',
    'philosophy.l8': 'all that\'s left is to charge forward like a madman.',
    'philosophy.l9': 'Punch a hole in this world.',
    'philosophy.l10': 'Rewrite the future with your own hands.',
    'philosophy.l11': 'Repaint the landscape of this world with a blazing soul.',
    'support.heading': 'We engage with the founder\'s entire life.',
    'support.desc1': 'Our representative Ando is the founder and COO of US logistics startup RENATUS ROBOTICS Inc., and was COO of its predecessor TRUST SMITH Group, a UTokyo-born AI venture. Alongside distinctive CEOs, he has launched seven companies in AI, deep tech, and blockchain.',
    'support.desc2': 'Drawing on that experience, as the "CEO\'s wife," we promise to create unique value that only we can offer.',
    'support.biz.title': 'Business Support',
    'support.biz.l1': 'Crafting business plans, capital strategy, and product roadmaps',
    'support.biz.l2': 'Sales and Go-To-Market strategy and execution',
    'support.biz.l3': 'Hiring support (CXO referrals, recruiting workflow design)',
    'support.biz.l4': 'Alliances with large enterprises and IP strategy',
    'support.biz.l5': 'HR strategy (org design, evaluation systems, MVV)',
    'support.biz.l6': 'PR and marketing support',
    'support.biz.l7': 'Equity finance support for subsequent rounds',
    'support.biz.l8': 'Debt finance support (loans, RBF, project finance, crypto fundraising)',
    'support.biz.l9': 'Government grant applications (NEDO, manufacturing subsidies, etc.)',
    'support.biz.l10': 'Coaching to win pitch contests',
    'support.biz.l11': 'US and Japan accelerator strategy',
    'support.biz.l12': 'Incorporation procedures and back office setup',
    'support.biz.l13': 'Other management support needed up to Series A',
    'support.life.title': 'Life Support',
    'support.life.l1': 'Planning and running life-elevating management retreats',
    'support.life.l2': 'Joint training (gym, futsal, baseball, basketball, running, etc.)',
    'support.life.l3': 'Help finding a marriage partner',
    'support.life.l4': 'Life design mentoring on a 20–30 year horizon, including post-exit',
    'support.life.l5': 'Other support to maximize the CEO\'s life happiness',
    'strategy.phase.title': 'Investment / Support Phase',
    'strategy.phase.t1': 'Pre-Seed (before founding)',
    'strategy.phase.t2': 'Seed (post-founding, pre-funding)',
    'strategy.focus.title': 'Focus Areas',
    'strategy.focus.t1': 'AI / Algorithms',
    'strategy.focus.t2': 'Robotics',
    'strategy.focus.t3': 'Decarbonization / Climate / Energy',
    'strategy.focus.t4': 'Space',
    'strategy.focus.t5': 'Manufacturing',
    'strategy.focus.t6': 'Logistics',
    'strategy.focus.t7': 'Real Estate / Construction',
    'strategy.focus.t8': 'Defense Tech',
    'strategy.focus.note': 'Aggressively investing in "massive industry × technology" areas where unicorns and decacorns can emerge.',
    'strategy.amount.title': 'Investment Size',
    'strategy.amount.value': '¥20M – ¥50M<span></span>',
    'strategy.amount.note': 'per company',
    'strategy.lead.title': 'Lead / Follow',
    'strategy.lead.value': 'Primarily lead investments',
    'services.title': 'Services',
    'services.s1title': 'Venture Investment',
    'services.s1desc': 'Investing in startups from seed to Series B. We identify business potential and provide optimal funding.',
    'services.s1link': 'Funding Inquiry <span>&rarr;</span>',
    'services.s2title': 'Hands-on Support',
    'services.s2desc': 'From business strategy and marketing to hiring and business development. We accelerate growth with hands-on support post-investment.',
    'services.s2link': 'Partnership Inquiry <span>&rarr;</span>',
    'services.s3title': 'Incubation',
    'services.s3desc': 'Supporting from the idea stage before founding. We work alongside you from business planning to prototype development and early customer acquisition.',
    'services.s3link': 'Startup Inquiry <span>&rarr;</span>',
    'services.s4title': 'Community',
    'services.s4desc': 'Building networks among entrepreneurs, mentor matching, and creating connections with industry experts.',
    'services.s4link': 'Contact Us <span>&rarr;</span>',
    'portfolio.title': 'Portfolio',
    'portfolio.coming': 'Portfolio company information coming soon.',
    'news.title': 'News',
    'news.all': 'All',
    'news.press': 'Press Release',
    'news.event': 'Event',
    'news.media': 'Media',
    'news.info': 'Announcement',
    'news.loading': 'Loading articles...',
    'news.cat.press': 'Press Release',
    'news.cat.event': 'Event',
    'news.cat.media': 'Media',
    'news.cat.info': 'Announcement',
    'news.empty': 'No news at this time.',
    'news.more': 'Load More',
    'team.title': 'Team',
    'team.coming': 'Team information coming soon.',
    'founder.name': 'Shoma Ando',
    'founder.role': 'Representative (GP)',
    'founder.c1.t': 'Kyoto University, Faculty & Graduate School of Engineering',
    'founder.c1.d': 'Awarded the Young Researcher\'s Best Presentation Award at the AIJ National Convention',
    'founder.c2.t': 'COO, TRUST SMITH Group',
    'founder.c2.d': 'Launched 7 companies in AI, deep tech, and blockchain',
    'founder.c3.t': 'COO, RENATUS ROBOTICS Inc. (US)',
    'founder.c3.d1': 'IVS2024 KYOTO LAUNCHPAD: Kyoto International Award (1st place) &amp; Audience Award',
    'founder.c3.d2': 'Berkeley Skydeck IPP / Pad-13 Pitch Contest: 1st place',
    'program.c1.title': 'Decacorn House',
    'program.c1.d1': 'We run "Decacorn House," a share house for innovators aiming to build decacorn-scale companies.',
    'program.c1.d2': 'Highly informed innovators living under one roof share insider-level information that dramatically raises each founder\'s odds of success.',
    'program.c1.h': 'If you want hints for taking on big challenges or want to elevate your perspective, come visit Decacorn House with us.',
    'program.c2.title': 'Scouting Program',
    'program.c2.d1': 'We are recruiting "entrepreneurs" to join SMITH &amp; CAPITAL and conduct investment activities together.',
    'program.c2.d2': '"If only I had a second body, I would have bet on this business!"<br>"From experience, this type of founder is bound to succeed!"',
    'program.c2.d3': 'Management and investing are two sides of the same coin. If you want to experience investing, let\'s do it together. Tell us your investment hypotheses.',
    'trustsmith.title': 'What is TRUST SMITH?',
    'trustsmith.desc1': 'TRUST SMITH is a UTokyo-born startup ecosystem that delivers solutions to the world\'s massive industries using cutting-edge AI, robotics, mathematical algorithms, and blockchain.',
    'trustsmith.f1': 'A reproducible founding approach that starts not from "technology" but from the "voice of decision-makers" — <strong>the "Trasmi Founding Scheme"</strong>',
    'trustsmith.f2': 'A unique management theory born from the relentless pursuit of customer value — <strong>"Smith Theory"</strong>',
    'trustsmith.desc2': 'Through these, including RENATUS ROBOTICS Inc., the group has produced 7 companies in-house and over 10 startups in total at home and abroad including those founded by alumni.',
    'trustsmith.tagline': 'In search of the next RENATUS.',
    'trustsmith.link1': 'TRUST SMITH Inc. Website',
    'trustsmith.link2': 'RENATUS ROBOTICS Website',
    'outline.r1.l': 'Fund Name',
    'outline.r1.v': 'TRUST SMITH &amp; CAPITAL<br>Investment Limited Partnership',
    'outline.r2.l': 'Representative (GP)',
    'outline.r2.v': 'Shoma Ando',
    'outline.r3.l': 'Fund Size',
    'outline.r3.v': '¥510M (max ¥1B)',
    'outline.r4.l': 'Established',
    'outline.r4.v': 'January 2025',
    'form.sending': 'Sending...',
    'form.success': 'Thank you for your inquiry. Our team will get back to you shortly.',
    'privacy.title': 'Privacy Policy',
    'privacy.h1': '1. Collection of Personal Information',
    'privacy.p1': 'We may collect personal information such as name, email address, and company name through inquiry forms and similar means.',
    'privacy.h2': '2. Purpose of Use',
    'privacy.p2': 'Personal information collected is used to respond to inquiries, provide service information, and for purposes related to our business.',
    'privacy.h3': '3. Disclosure to Third Parties',
    'privacy.p3': 'Except as required by law, we will not disclose personal information to third parties without the individual\'s consent.',
    'privacy.h4': '4. Security Management',
    'privacy.p4': 'We implement appropriate security measures to prevent leakage, loss, or damage to personal information.',
    'privacy.h5': '5. Contact',
    'privacy.p5': 'For inquiries about our handling of personal information, please contact us through the inquiry form on this site.',
    'portfolio.modal.detail': 'For details or questions about this company, please contact us via the {link}.',
    'portfolio.modal.linkText': 'inquiry form',
    'careers.title': 'Careers',
    'careers.heading': 'Join us in creating the future.',
    'careers.desc': 'We are looking for passionate team members who want to tackle social challenges together with entrepreneurs.',
    'careers.p1title': 'Investment Associate',
    'careers.fulltime': 'Full-time',
    'careers.p1desc': 'Responsible for startup discovery, analysis, and investment execution. Also involved in portfolio growth support.',
    'careers.p1t1': 'VC Experience Welcome',
    'careers.p1t2': 'Remote OK',
    'careers.p1t3': 'Tokyo',
    'careers.p2title': 'Value-up Manager',
    'careers.fulltime2': 'Full-time',
    'careers.p2desc': 'Growth support for portfolio startups. Involved in strategy planning through operational improvement.',
    'careers.p2t1': 'Consulting Exp. Welcome',
    'careers.p2t2': 'Flextime',
    'careers.p2t3': 'Tokyo',
    'careers.p3title': 'Intern',
    'careers.p3type': 'Intern',
    'careers.p3desc': 'Internship centered on research and analysis, gaining hands-on VC experience. 2+ days/week.',
    'careers.p3t1': 'Students Welcome',
    'careers.p3t2': '2+ Days/Week',
    'careers.p3t3': 'Tokyo',
    'careers.apply': 'Apply Now',
    'careers.chat': 'Casual Chat',
    'funding.title': 'Funding Consultation',
    'funding.desc': 'From business ideas to Series B.<br>Feel free to reach out.',
    'funding.cta': 'Book a Consultation',
    'contact.title': 'Contact',
    'contact.heading': 'Get in Touch',
    'contact.desc': 'For funding consultations, business partnerships, careers, and more. Please use the form below.',
    'contact.location': 'Location',
    'contact.address': 'Shibuya, Tokyo',
    'contact.email': 'Email',
    'contact.form.type': 'Inquiry Type',
    'contact.form.select': 'Please select',
    'contact.form.funding': 'Funding Consultation',
    'contact.form.partnership': 'Business Partnership',
    'contact.form.careers': 'Careers',
    'contact.form.media': 'Press / Media',
    'contact.form.other': 'Other',
    'contact.form.name': 'Name',
    'contact.form.company': 'Company',
    'contact.form.email': 'Email Address',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send',
    'footer.desc': 'A venture capital firm that discovers ambitious entrepreneurs and creates innovative startups as a next-generation incubation ecosystem.'
  }
};

// Placeholder translations for form inputs
const placeholders = {
  ja: {
    contactName: '山田 太郎',
    contactCompany: '株式会社〇〇',
    contactEmail: 'example@email.com',
    contactMessage: 'お問い合わせ内容をご記入ください'
  },
  en: {
    contactName: 'Taro Yamada',
    contactCompany: 'Company Inc.',
    contactEmail: 'example@email.com',
    contactMessage: 'Please enter your inquiry'
  }
};

let currentLang = localStorage.getItem('lang') || 'ja';

function t(key) {
  const dict = translations[currentLang] || translations.ja;
  return dict[key] !== undefined ? dict[key] : (translations.ja[key] || key);
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  const dict = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  // aria-label translations
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] !== undefined) {
      el.setAttribute('aria-label', dict[key].replace(/<[^>]*>/g, ''));
    }
  });

  // Page title and meta description
  if (dict['meta.title']) document.title = dict['meta.title'];
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dict['meta.desc']) metaDesc.setAttribute('content', dict['meta.desc']);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && dict['meta.title']) ogTitle.setAttribute('content', dict['meta.title']);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && dict['meta.desc']) ogDesc.setAttribute('content', dict['meta.desc']);

  // Update placeholders
  const ph = placeholders[lang];
  Object.keys(ph).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.placeholder = ph[id];
  });

  // Update active state on all toggle groups
  document.querySelectorAll('.lang-toggle').forEach(toggle => {
    toggle.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  });
}

function initLanguageToggle() {
  document.querySelectorAll('.lang-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      const lang = btn.dataset.lang;
      setLanguage(lang);
    });
  });

  // Apply saved language
  if (currentLang !== 'ja') {
    setLanguage(currentLang);
  }
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
