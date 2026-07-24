/* ============================================================
   BookLoop — Vanilla JS
   Structure:
   1. Data (sample books, users, feed, notifications, chats)
   2. State + localStorage
   3. Utilities (DOM helpers, toast)
   4. Renderers (features, books, discovery, how, community, dash)
   5. Interactions (nav, theme, modals, carousel, filters, auth, chat...)
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     1. DATA
     ============================================================ */
  const COVERS = {
    Fiction: ["#c98a3b", "#a9692a"],
    "Non-fiction": ["#6b8f71", "#4c6b52"],
    "Sci-Fi": ["#5c6f8a", "#3d4d63"],
    "Self-Help": ["#c98a3b", "#8a5a24"],
    Fantasy: ["#8a6d5b", "#6a5040"],
    Biography: ["#a86f6f", "#824f4f"],
  };

  const BOOKS = [
    { id: 1, title: "Atomic Habits", author: "James Clear", genre: "Self-Help", distance: 1.2, status: "available", type: "Borrow", price: 0, rating: 4.9, owner: "Nora P.", ownerColor: "#c98a3b", added: 12, popularity: 98, desc: "Tiny changes, remarkable results. A practical guide to building good habits and breaking bad ones." },
    { id: 2, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", distance: 2.8, status: "available", type: "Exchange", price: 0, rating: 4.7, owner: "Leo M.", ownerColor: "#6b8f71", added: 5, popularity: 92, desc: "A shepherd's journey to find treasure teaches us to follow our dreams and listen to our hearts." },
    { id: 3, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", distance: 4.5, status: "available", type: "Buy", price: 12, rating: 4.8, owner: "Ravi S.", ownerColor: "#5c6f8a", added: 20, popularity: 88, desc: "An epic saga of politics, religion and ecology on the desert planet Arrakis." },
    { id: 4, title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-fiction", distance: 0.8, status: "available", type: "Borrow", price: 0, rating: 4.6, owner: "Mia J.", ownerColor: "#a86f6f", added: 2, popularity: 95, desc: "A brief history of humankind — from the Stone Age to the modern era." },
    { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", distance: 3.1, status: "unavailable", type: "Exchange", price: 0, rating: 4.9, owner: "Sam K.", ownerColor: "#8a6d5b", added: 30, popularity: 90, desc: "Bilbo Baggins embarks on an unexpected adventure to a lonely mountain." },
    { id: 6, title: "Educated", author: "Tara Westover", genre: "Biography", distance: 6.2, status: "available", type: "Buy", price: 9, rating: 4.7, owner: "Ada W.", ownerColor: "#6b8f71", added: 8, popularity: 84, desc: "A memoir about a woman who leaves her survivalist family and earns a PhD." },
    { id: 7, title: "Project Hail Mary", author: "Andy Weir", genre: "Sci-Fi", distance: 2.0, status: "available", type: "Borrow", price: 0, rating: 4.9, owner: "Nora P.", ownerColor: "#c98a3b", added: 1, popularity: 91, desc: "A lone astronaut must save Earth from disaster in this thrilling space adventure." },
    { id: 8, title: "The Midnight Library", author: "Matt Haig", genre: "Fiction", distance: 5.4, status: "available", type: "Exchange", price: 0, rating: 4.5, owner: "Leo M.", ownerColor: "#6b8f71", added: 3, popularity: 87, desc: "Between life and death lies a library of the lives you could have lived." },
    { id: 9, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genre: "Non-fiction", distance: 7.8, status: "available", type: "Buy", price: 14, rating: 4.4, owner: "Ravi S.", ownerColor: "#5c6f8a", added: 15, popularity: 80, desc: "A tour of the mind's two systems that drive the way we think and decide." },
    { id: 10, title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Fantasy", distance: 1.9, status: "available", type: "Borrow", price: 0, rating: 4.8, owner: "Ada W.", ownerColor: "#6b8f71", added: 6, popularity: 89, desc: "The tale of Kvothe, a magically gifted young man who grows into a legend." },
    { id: 11, title: "Becoming", author: "Michelle Obama", genre: "Biography", distance: 9.1, status: "available", type: "Exchange", price: 0, rating: 4.6, owner: "Mia J.", ownerColor: "#a86f6f", added: 11, popularity: 82, desc: "An intimate memoir by the former First Lady of the United States." },
    { id: 12, title: "The Subtle Art", author: "Mark Manson", genre: "Self-Help", distance: 3.7, status: "unavailable", type: "Buy", price: 8, rating: 4.2, owner: "Sam K.", ownerColor: "#8a6d5b", added: 18, popularity: 78, desc: "A counterintuitive approach to living a good life by caring about less." },
  ];

  // My own books (dashboard / exchange offers)
  const MY_BOOKS = [
    { id: 101, title: "Normal People", author: "Sally Rooney", genre: "Fiction", type: "Exchange", price: 0, status: "available" },
    { id: 102, title: "The Pragmatic Programmer", author: "Hunt & Thomas", genre: "Non-fiction", type: "Borrow", price: 0, status: "available" },
    { id: 103, title: "Circe", author: "Madeline Miller", genre: "Fantasy", type: "Buy", price: 7, status: "unavailable" },
  ];

  const FEATURES = [
    { icon: "book", title: "Borrow Books", desc: "Borrow titles from readers nearby, completely free, and return them when you're done." },
    { icon: "swap", title: "Exchange Books", desc: "Trade a book you've finished for one on your wishlist. Keep your shelf fresh." },
    { icon: "tag", title: "Buy Used Books", desc: "Pick up pre-loved books at affordable prices from your local community." },
    { icon: "pin", title: "Discover Nearby Readers", desc: "Meet like-minded readers in your area and grow your reading circle." },
    { icon: "shelf", title: "Build Your Library", desc: "Curate a personal library, track borrows and showcase your collection." },
  ];

  const FEATURE_ICONS = {
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    swap: '<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>',
    tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.8 8.8a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    shelf: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18"/>',
  };

  const HOW_STEPS = [
    { title: "Find a Book", desc: "Search or browse books shared by readers near you.", icon: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>' },
    { title: "Send a Request", desc: "Tap borrow, exchange or buy and send your request instantly.", icon: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>' },
    { title: "Connect with the Reader", desc: "Chat to arrange a handover time and place that suits you both.", icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
    { title: "Read, Return, or Exchange", desc: "Enjoy the book, then return it or pass it along the loop.", icon: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>' },
  ];

  const FEED = [
    { who: "Leo M.", color: "#6b8f71", text: "shared <strong>The Alchemist</strong> for exchange", time: "2m ago" },
    { who: "Nora P.", color: "#c98a3b", text: "is lending <strong>Atomic Habits</strong> near you", time: "9m ago" },
    { who: "Ravi S.", color: "#5c6f8a", text: "completed an exchange with Ada W.", time: "18m ago" },
    { who: "Mia J.", color: "#a86f6f", text: "added <strong>Sapiens</strong> to the community", time: "31m ago" },
    { who: "Sam K.", color: "#8a6d5b", text: "is looking for <strong>Fantasy</strong> reads", time: "44m ago" },
  ];

  const TRENDING = [
    { genre: "Fiction", pct: 92 }, { genre: "Self-Help", pct: 78 },
    { genre: "Sci-Fi", pct: 64 }, { genre: "Fantasy", pct: 51 }, { genre: "Biography", pct: 37 },
  ];

  const NOTIFS = [
    { icon: "🔄", title: "New exchange request", body: "Leo M. wants to exchange for your copy of Circe.", time: "3m ago", unread: true },
    { icon: "✅", title: "Request accepted", body: "Nora P. accepted your borrow request for Atomic Habits.", time: "1h ago", unread: true },
    { icon: "🔖", title: "Someone saved your book", body: "2 readers saved The Pragmatic Programmer.", time: "3h ago", unread: true },
    { icon: "💬", title: "New message", body: "Ada W. sent you a message.", time: "5h ago", unread: false },
    { icon: "📍", title: "Nearby book available", body: "Dune is now available 4.5km away.", time: "1d ago", unread: false },
  ];

  const CONVERSATIONS = [
    { id: 1, name: "Nora P.", color: "#c98a3b", online: true, last: "Sounds good, see you at 5!", time: "2m",
      messages: [
        { from: "in", text: "Hi! Is Atomic Habits still available?", time: "4:02 PM" },
        { from: "out", text: "Yes it is! When would you like to pick it up?", time: "4:05 PM" },
        { from: "in", text: "Would today around 5 work?", time: "4:06 PM" },
        { from: "out", text: "Sounds good, see you at 5!", time: "4:07 PM" },
      ] },
    { id: 2, name: "Leo M.", color: "#6b8f71", online: true, last: "I can offer The Hobbit 🙂", time: "20m",
      messages: [
        { from: "in", text: "Interested in exchanging for The Alchemist?", time: "3:40 PM" },
        { from: "out", text: "Maybe! What do you have?", time: "3:45 PM" },
        { from: "in", text: "I can offer The Hobbit 🙂", time: "3:47 PM" },
      ] },
    { id: 3, name: "Ada W.", color: "#6b8f71", online: false, last: "Thanks for the book!", time: "2h",
      messages: [
        { from: "in", text: "Thanks for the book!", time: "1:15 PM" },
        { from: "out", text: "Anytime — enjoy the read!", time: "1:20 PM" },
      ] },
    { id: 4, name: "Ravi S.", color: "#5c6f8a", online: false, last: "Let me check my shelf", time: "1d",
      messages: [
        { from: "in", text: "Do you still have Dune?", time: "Yesterday" },
        { from: "out", text: "Let me check my shelf", time: "Yesterday" },
      ] },
  ];

  const EMOJIS = ["😊", "📚", "👍", "🙌", "😄", "🔖", "🤝", "✨", "📖", "❤️"];

  /* ============================================================
     2. STATE + localStorage
     ============================================================ */
  const store = {
    get saved() { try { return JSON.parse(localStorage.getItem("bl_saved") || "[]"); } catch { return []; } },
    set saved(v) { localStorage.setItem("bl_saved", JSON.stringify(v)); },
    get theme() { return localStorage.getItem("bl_theme") || "light"; },
    set theme(v) { localStorage.setItem("bl_theme", v); },
  };

  const state = {
    discoverTab: "near",
    filters: { genre: "", distance: 10, type: "", available: false, price: 30 },
    sort: "relevance",
    activeConv: 1,
    exchangeTarget: null,
    exchangeOffer: null,
    requests: [
      { book: "The Hobbit", with: "Sam K.", status: "pending" },
      { book: "Sapiens", with: "Mia J.", status: "accepted" },
      { book: "Dune", with: "Ravi S.", status: "completed" },
    ],
    myBooks: [...MY_BOOKS],
    notifs: NOTIFS.map((n) => ({ ...n })),
  };

  /* ============================================================
     3. UTILITIES
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const coverColors = (genre) => COVERS[genre] || ["#c98a3b", "#a9692a"];
  const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  function toast(title, msg, type = "info") {
    const icons = { success: "✅", error: "⚠️", info: "🔔" };
    const t = el("div", `toast toast--${type}`,
      `<span class="toast__icon">${icons[type]}</span>
       <div class="toast__body"><strong>${title}</strong><span>${msg}</span></div>`);
    $("#toastContainer").appendChild(t);
    setTimeout(() => { t.classList.add("is-leaving"); setTimeout(() => t.remove(), 320); }, 3200);
  }

  function bookCoverArt(b, big) {
    const [c1, c2] = coverColors(b.genre);
    const cls = big ? "book-detail__art" : "book-cover__art";
    return `<div class="${cls}" style="background:linear-gradient(135deg,${c1},${c2})">
      <b>${b.title}</b><small>${b.author}</small></div>`;
  }

  function bookMini(genre) {
    const [c1, c2] = coverColors(genre);
    return `<span class="book-mini" style="--c1:${c1};--c2:${c2}"></span>`;
  }

  /* ============================================================
     4. RENDERERS
     ============================================================ */
  function renderFeatures() {
    const grid = $("#featureGrid");
    grid.innerHTML = FEATURES.map((f) => `
      <article class="feature-card reveal">
        <div class="feature-card__icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FEATURE_ICONS[f.icon]}</svg>
        </div>
        <h3>${f.title}</h3>
        <p>${f.desc}</p>
      </article>`).join("");
    observeReveals();
  }

  function bookCardHTML(b) {
    const saved = store.saved.includes(b.id);
    const statusCls = b.status === "available" ? "" : "book-status--out";
    const statusText = b.status === "available" ? "Available" : "On loan";
    const priceHTML = b.type === "Buy" ? `<span class="price">$${b.price}</span>` : `<span class="price">Free</span>`;
    return `
      <article class="book-card" data-id="${b.id}">
        <div class="book-cover">
          ${bookCoverArt(b)}
          <span class="book-status ${statusCls}">${statusText}</span>
          <button class="book-bookmark ${saved ? "is-saved" : ""}" data-bookmark="${b.id}" aria-label="Save book">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="${saved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
        <div class="book-info">
          <h3>${b.title}</h3>
          <span class="author">${b.author}</span>
          <div class="book-meta">
            <span class="tag">${b.genre}</span>
            <span>📍 ${b.distance} km</span>
            <span>★ ${b.rating}</span>
          </div>
          <div class="book-owner">
            <span class="avatar" style="--a:${b.ownerColor}">${initials(b.owner)}</span>
            <span>${b.owner}</span>
            ${priceHTML}
          </div>
        </div>
        <div class="book-actions">
          <button class="btn btn--primary" data-action="${b.type}" data-id="${b.id}">${b.type}</button>
          <button class="btn btn--outline" data-view="${b.id}">Details</button>
        </div>
      </article>`;
  }

  function renderCarousel() {
    $("#carouselTrack").innerHTML = BOOKS.map(bookCardHTML).join("");
  }

  function renderDiscovery() {
    const f = state.filters;
    let list = BOOKS.filter((b) => {
      if (f.genre && b.genre !== f.genre) return false;
      if (b.distance > f.distance) return false;
      if (f.type && b.type !== f.type) return false;
      if (f.available && b.status !== "available") return false;
      if (b.type === "Buy" && b.price > f.price) return false;
      return true;
    });

    // Tab ordering
    if (state.discoverTab === "near") list.sort((a, b) => a.distance - b.distance);
    else if (state.discoverTab === "popular") list.sort((a, b) => b.popularity - a.popularity);
    else if (state.discoverTab === "recent") list.sort((a, b) => a.added - b.added);
    else if (state.discoverTab === "recommended") list.sort((a, b) => b.rating - a.rating);

    // Sort override
    if (state.sort === "distance") list.sort((a, b) => a.distance - b.distance);
    else if (state.sort === "priceLow") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "priceHigh") list.sort((a, b) => b.price - a.price);
    else if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);

    const grid = $("#bookGrid");
    const empty = $("#emptyState");
    $("#resultCount").textContent = `${list.length} book${list.length !== 1 ? "s" : ""}`;
    if (!list.length) { grid.innerHTML = ""; empty.hidden = false; return; }
    empty.hidden = true;
    grid.innerHTML = list.map(bookCardHTML).join("");
  }

  function renderHow() {
    $("#howSteps").innerHTML = HOW_STEPS.map((s, i) => `
      <div class="how-step ${i === 0 ? "is-active" : ""}" data-step="${i}">
        <div class="how-step__num">${i + 1}</div>
        <div><h3>${s.title}</h3><p>${s.desc}</p></div>
      </div>`).join("");
    updateHowVisual(0);
  }

  function updateHowVisual(i) {
    const s = HOW_STEPS[i];
    $("#howVisual").innerHTML = `
      <div>
        <div class="how-visual__icon">
          <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${s.icon}</svg>
        </div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>`;
  }

  function renderCommunity() {
    $("#feedList").innerHTML = FEED.map((a) => `
      <div class="activity">
        <span class="avatar" style="--a:${a.color}">${initials(a.who)}</span>
        <div class="activity__body"><strong>${a.who}</strong> ${a.text}<time>${a.time}</time></div>
      </div>`).join("");

    $("#trendingList").innerHTML = TRENDING.map((t) => `
      <div class="trend">
        <span>${t.genre}</span>
        <div class="trend__bar"><i style="width:0" data-w="${t.pct}"></i></div>
        <small>${t.pct}%</small>
      </div>`).join("");
  }

  function renderNotifs() {
    const list = $("#notifList");
    const unread = state.notifs.filter((n) => n.unread).length;
    const badge = $("#notifBadge");
    if (unread) { badge.textContent = unread; badge.style.display = "grid"; }
    else badge.style.display = "none";

    if (!state.notifs.length) { list.innerHTML = `<div class="empty-state" style="padding:30px"><p>You're all caught up 🎉</p></div>`; return; }
    list.innerHTML = state.notifs.map((n, i) => `
      <div class="notif ${n.unread ? "is-unread" : ""}" data-notif="${i}">
        <span class="notif__dot"></span>
        <div class="notif__body">
          <strong>${n.icon} ${n.title}</strong>
          <p>${n.body}</p>
          <time>${n.time}</time>
        </div>
      </div>`).join("");
  }

  /* ---- Dashboard ---- */
  function renderDash(tab = "overview") {
    const main = $("#dashMain");
    const views = {
      overview: dashOverview,
      mybooks: dashMyBooks,
      borrowed: dashBorrowed,
      requests: dashRequests,
      messages: dashMessages,
      saved: dashSaved,
      settings: dashSettings,
    };
    main.innerHTML = (views[tab] || dashOverview)();
    if (tab === "overview") animateChart();
    if (tab === "mybooks") bindMyBooksTools();
  }

  function dashOverview() {
    return `
      <div class="dash-widgets">
        <div class="widget"><strong>${state.myBooks.length}</strong><span>Books listed</span></div>
        <div class="widget"><strong>4</strong><span>Books borrowed</span></div>
        <div class="widget"><strong>7</strong><span>Exchanges done</span></div>
        <div class="widget"><strong>${state.requests.filter(r => r.status === "pending").length}</strong><span>Pending requests</span></div>
      </div>
      <div class="dash-cols">
        <div class="dash-panel">
          <h3>Activity this week</h3>
          <div class="chart" id="dashChart">
            ${[["Mon",40],["Tue",65],["Wed",30],["Thu",80],["Fri",55],["Sat",95],["Sun",70]].map(([d,h]) =>
              `<div class="chart__bar"><i data-h="${h}" style="height:0"></i><small>${d}</small></div>`).join("")}
          </div>
        </div>
        <div class="dash-panel">
          <h3>Recent activity</h3>
          <div class="timeline">
            <div class="timeline__item"><div><p>You lent <strong>Normal People</strong> to Ada W.</p><time>Today</time></div></div>
            <div class="timeline__item"><div><p>Exchange completed with <strong>Ravi S.</strong></p><time>Yesterday</time></div></div>
            <div class="timeline__item"><div><p>You saved <strong>Project Hail Mary</strong></p><time>2 days ago</time></div></div>
            <div class="timeline__item"><div><p>Listed <strong>Circe</strong> for sale</p><time>4 days ago</time></div></div>
          </div>
        </div>
      </div>`;
  }

  function dashMyBooks() {
    return `
      <div class="dash-toolbar">
        <input type="search" id="myBookSearch" placeholder="Search your books..." />
        <select id="myBookFilter">
          <option value="">All status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <button class="btn btn--primary" id="dashAddBook">+ Add Book</button>
      </div>
      <div id="myBooksList">${myBooksRows(state.myBooks)}</div>`;
  }

  function myBooksRows(list) {
    if (!list.length) return `<div class="empty-state" style="padding:40px"><p>No books match. Try adding one!</p></div>`;
    return list.map((b) => `
      <div class="list-row">
        ${bookMini(b.genre)}
        <div class="list-row__body">
          <strong>${b.title}</strong>
          <span>${b.author} · ${b.genre} · ${b.type}${b.type === "Buy" ? " · $" + b.price : ""}</span>
        </div>
        <span class="status-badge ${b.status === "available" ? "status-accepted" : "status-declined"}">${b.status === "available" ? "Available" : "Unavailable"}</span>
        <div class="list-row__actions">
          <button class="mini-btn" data-toggle-status="${b.id}">Toggle</button>
          <button class="mini-btn" data-edit-book="${b.id}">Edit</button>
          <button class="mini-btn mini-btn--danger" data-delete-book="${b.id}">Delete</button>
        </div>
      </div>`).join("");
  }

  function dashBorrowed() {
    const borrowed = [
      { title: "Atomic Habits", genre: "Self-Help", from: "Nora P.", due: "in 5 days" },
      { title: "Sapiens", genre: "Non-fiction", from: "Mia J.", due: "in 12 days" },
    ];
    return `<h3 style="margin-bottom:16px">Currently borrowed</h3>${borrowed.map((b) => `
      <div class="list-row">${bookMini(b.genre)}
        <div class="list-row__body"><strong>${b.title}</strong><span>from ${b.from} · due ${b.due}</span></div>
        <button class="mini-btn">Return</button>
      </div>`).join("")}`;
  }

  function dashRequests() {
    return `<h3 style="margin-bottom:16px">Exchange requests</h3>${state.requests.map((r) => `
      <div class="list-row">${bookMini("Fiction")}
        <div class="list-row__body"><strong>${r.book}</strong><span>with ${r.with}</span></div>
        <span class="status-badge status-${r.status}">${r.status[0].toUpperCase() + r.status.slice(1)}</span>
      </div>`).join("")}`;
  }

  function dashMessages() {
    return `<h3 style="margin-bottom:16px">Messages</h3>
      <p style="color:var(--text-soft);margin-bottom:16px">Open your conversations in the chat panel.</p>
      <button class="btn btn--primary" onclick="document.getElementById('chatFab').click()">Open Messages</button>`;
  }

  function dashSaved() {
    const saved = BOOKS.filter((b) => store.saved.includes(b.id));
    if (!saved.length) return `<div class="empty-state" style="padding:50px"><h3>No saved books yet</h3><p>Bookmark books to find them here later.</p></div>`;
    return `<h3 style="margin-bottom:16px">Saved books</h3>${saved.map((b) => `
      <div class="list-row">${bookMini(b.genre)}
        <div class="list-row__body"><strong>${b.title}</strong><span>${b.author} · ${b.distance} km away</span></div>
        <button class="mini-btn" data-view="${b.id}">View</button>
      </div>`).join("")}`;
  }

  function dashSettings() {
    return `
      <h3 style="margin-bottom:16px">Settings</h3>
      <div class="donut-wrap" style="margin-bottom:24px">
        <div class="donut" style="background:conic-gradient(var(--accent) 0 55%, var(--green) 55% 80%, var(--brown) 80% 100%)"></div>
        <div class="donut-legend">
          <strong style="font-family:var(--font-display);font-size:1.1rem">Your loop breakdown</strong>
          <span><i style="background:var(--accent)"></i> Borrowed · 55%</span>
          <span><i style="background:var(--green)"></i> Exchanged · 25%</span>
          <span><i style="background:var(--brown)"></i> Bought · 20%</span>
        </div>
      </div>
      <div class="dash-toolbar" style="flex-direction:column;align-items:stretch;gap:14px;max-width:360px">
        <label class="check"><input type="checkbox" checked> Email notifications</label>
        <label class="check"><input type="checkbox" checked> Show my location to nearby readers</label>
        <label class="check"><input type="checkbox"> Weekly reading digest</label>
        <button class="btn btn--primary" data-save-settings>Save Settings</button>
      </div>`;
  }

  function animateChart() {
    requestAnimationFrame(() => {
      $$("#dashChart .chart__bar i").forEach((bar) => { bar.style.height = bar.dataset.h + "%"; });
    });
  }

  /* ============================================================
     5. INTERACTIONS
     ============================================================ */

  /* ---- Theme ---- */
  function initTheme() {
    document.documentElement.setAttribute("data-theme", store.theme);
    $("#themeToggle").addEventListener("click", () => {
      const next = store.theme === "light" ? "dark" : "light";
      store.theme = next;
      document.documentElement.setAttribute("data-theme", next);
      toast("Theme changed", `Switched to ${next} mode`, "info");
    });
  }

  /* ---- Nav / scroll ---- */
  function initNav() {
    const nav = $("#nav");
    window.addEventListener("scroll", () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 10);
      updateActiveLink();
    });

    // Smooth active link + close mobile menu on click
    $$('.nav__link, .mobile-menu__link').forEach((a) => {
      a.addEventListener("click", () => closeMobileMenu());
    });

    // Hamburger
    $("#hamburger").addEventListener("click", () => {
      const open = $("#mobileMenu").hidden;
      $("#mobileMenu").hidden = !open;
      $("#hamburger").classList.toggle("is-open", open);
      $("#hamburger").setAttribute("aria-expanded", String(open));
    });
  }

  function closeMobileMenu() {
    $("#mobileMenu").hidden = true;
    $("#hamburger").classList.remove("is-open");
    $("#hamburger").setAttribute("aria-expanded", "false");
  }

  function updateActiveLink() {
    const sections = ["home", "explore", "how", "community", "about"];
    let current = "home";
    for (const id of sections) {
      const sec = document.getElementById(id);
      if (sec && sec.getBoundingClientRect().top <= 120) current = id;
    }
    $$(".nav__link").forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + current));
  }

  /* ---- Dropdowns ---- */
  function initDropdowns() {
    const setup = (btnId, panelId) => {
      const btn = $("#" + btnId), panel = $("#" + panelId);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = panel.classList.contains("is-open");
        closeAllDropdowns();
        if (!open) { panel.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
      });
    };
    setup("notifToggle", "notifPanel");
    setup("profileToggle", "profilePanel");
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dropdown")) closeAllDropdowns();
    });

    // notif interactions
    $("#notifList").addEventListener("click", (e) => {
      const row = e.target.closest("[data-notif]");
      if (!row) return;
      const i = +row.dataset.notif;
      state.notifs[i].unread = false;
      renderNotifs();
    });
    $("#clearNotifs").addEventListener("click", () => {
      state.notifs = [];
      renderNotifs();
      toast("Cleared", "All notifications cleared", "success");
    });

    // profile menu goto
    $$("#profilePanel [data-goto]").forEach((b) => b.addEventListener("click", () => {
      closeAllDropdowns();
      const map = { dashboard: "#dashboard", mybooks: "#dashboard", chat: null };
      if (b.dataset.goto === "chat") { $("#chatFab").click(); return; }
      const target = map[b.dataset.goto];
      if (target) document.querySelector(target).scrollIntoView({ behavior: "smooth" });
    }));
    $("#openLoginFromMenu").addEventListener("click", () => { closeAllDropdowns(); openAuth("login"); });
  }

  function closeAllDropdowns() {
    $$(".dropdown__panel").forEach((p) => p.classList.remove("is-open"));
    $$("[aria-expanded]").forEach((b) => { if (b.closest(".dropdown")) b.setAttribute("aria-expanded", "false"); });
  }

  /* ---- Nav search ---- */
  function initSearch() {
    const bar = $("#navSearch"), input = $("#globalSearch"), suggest = $("#searchSuggest");
    $("#searchToggle").addEventListener("click", () => {
      bar.hidden = !bar.hidden;
      if (!bar.hidden) { input.focus(); renderSuggest(""); }
    });
    $("#closeSearch").addEventListener("click", () => { bar.hidden = true; });

    input.addEventListener("input", () => renderSuggest(input.value.trim().toLowerCase()));

    function renderSuggest(q) {
      let results = BOOKS;
      if (q) results = BOOKS.filter((b) =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q));
      if (!results.length) {
        suggest.innerHTML = `<div class="suggest">No matches for "${q}" — try another title.</div>`;
        return;
      }
      suggest.innerHTML = results.slice(0, 6).map((b) =>
        `<button class="suggest" data-view="${b.id}">${b.title} <small>· ${b.author}</small></button>`).join("");
    }
  }

  /* ---- Finder ---- */
  function initFinder() {
    $("#finderBtn").addEventListener("click", () => {
      const q = $("#finderQuery").value.trim();
      const cat = $("#finderCategory").value;
      if (cat) { state.filters.genre = cat; $("#fGenre").value = cat; renderDiscovery(); }
      document.getElementById("discover").scrollIntoView({ behavior: "smooth" });
      toast("Searching", q ? `Showing results for "${q}"` : "Showing books near you", "success");
    });
    $$("[data-recent]").forEach((c) => c.addEventListener("click", () => {
      $("#finderQuery").value = c.dataset.recent;
      $("#finderBtn").click();
    }));
  }

  /* ---- Carousel ---- */
  function initCarousel() {
    const track = $("#carouselTrack"), wrap = $("#carousel");
    let pos = 0;
    const step = 280;
    const maxScroll = () => track.scrollWidth - wrap.clientWidth;

    const move = (dir) => {
      pos = Math.max(0, Math.min(maxScroll(), pos + dir * step * 2));
      track.style.transform = `translateX(${-pos}px)`;
    };
    $("#carNext").addEventListener("click", () => move(1));
    $("#carPrev").addEventListener("click", () => move(-1));

    // Drag to scroll
    let isDown = false, startX = 0, startPos = 0;
    const down = (x) => { isDown = true; startX = x; startPos = pos; wrap.classList.add("is-dragging"); };
    const moveDrag = (x) => {
      if (!isDown) return;
      pos = Math.max(0, Math.min(maxScroll(), startPos - (x - startX)));
      track.style.transition = "none";
      track.style.transform = `translateX(${-pos}px)`;
    };
    const up = () => { isDown = false; wrap.classList.remove("is-dragging"); track.style.transition = ""; };

    wrap.addEventListener("mousedown", (e) => down(e.pageX));
    window.addEventListener("mousemove", (e) => moveDrag(e.pageX));
    window.addEventListener("mouseup", up);
    wrap.addEventListener("touchstart", (e) => down(e.touches[0].pageX), { passive: true });
    wrap.addEventListener("touchmove", (e) => moveDrag(e.touches[0].pageX), { passive: true });
    wrap.addEventListener("touchend", up);
  }

  /* ---- Discovery tabs / filters ---- */
  function initDiscovery() {
    $$("#discoverTabs .tab").forEach((t) => t.addEventListener("click", () => {
      $$("#discoverTabs .tab").forEach((x) => x.classList.remove("is-active"));
      t.classList.add("is-active");
      state.discoverTab = t.dataset.tab;
      renderDiscovery();
    }));

    const f = state.filters;
    $("#fGenre").addEventListener("change", (e) => { f.genre = e.target.value; renderDiscovery(); });
    $("#fType").addEventListener("change", (e) => { f.type = e.target.value; renderDiscovery(); });
    $("#fAvailable").addEventListener("change", (e) => { f.available = e.target.checked; renderDiscovery(); });
    $("#fDistance").addEventListener("input", (e) => { f.distance = +e.target.value; $("#fDistanceVal").textContent = e.target.value; renderDiscovery(); });
    $("#fPrice").addEventListener("input", (e) => { f.price = +e.target.value; $("#fPriceVal").textContent = e.target.value; renderDiscovery(); });
    $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderDiscovery(); });

    const reset = () => {
      Object.assign(f, { genre: "", distance: 10, type: "", available: false, price: 30 });
      $("#fGenre").value = ""; $("#fType").value = ""; $("#fAvailable").checked = false;
      $("#fDistance").value = 10; $("#fDistanceVal").textContent = "10";
      $("#fPrice").value = 30; $("#fPriceVal").textContent = "30";
      state.sort = "relevance"; $("#sortSelect").value = "relevance";
      renderDiscovery();
    };
    $("#resetFilters").addEventListener("click", reset);
    $("#clearFromEmpty").addEventListener("click", reset);
  }

  /* ---- How steps ---- */
  function initHow() {
    $("#howSteps").addEventListener("click", (e) => {
      const step = e.target.closest(".how-step");
      if (!step) return;
      $$(".how-step").forEach((s) => s.classList.remove("is-active"));
      step.classList.add("is-active");
      updateHowVisual(+step.dataset.step);
    });
    // hover preview
    $("#howSteps").addEventListener("mouseover", (e) => {
      const step = e.target.closest(".how-step");
      if (step) updateHowVisual(+step.dataset.step);
    });
  }

  /* ---- Bookmarks + book actions (event delegation) ---- */
  function initBookActions() {
    document.addEventListener("click", (e) => {
      // bookmark
      const bm = e.target.closest("[data-bookmark]");
      if (bm) {
        e.stopPropagation();
        toggleSave(+bm.dataset.bookmark);
        return;
      }
      // view details
      const view = e.target.closest("[data-view]");
      if (view) { openBookModal(+view.dataset.view); $("#navSearch").hidden = true; return; }
      // action buttons (Borrow/Exchange/Buy)
      const act = e.target.closest("[data-action]");
      if (act) { handleBookAction(act.dataset.action, +act.dataset.id); return; }
    });
  }

  function toggleSave(id) {
    const saved = store.saved;
    const idx = saved.indexOf(id);
    if (idx >= 0) { saved.splice(idx, 1); toast("Removed", "Book removed from saved", "info"); }
    else { saved.push(id); toast("Saved", "Book added to your saved list", "success"); }
    store.saved = saved;
    // refresh visible bookmark buttons
    $$(`[data-bookmark="${id}"]`).forEach((btn) => {
      const on = store.saved.includes(id);
      btn.classList.toggle("is-saved", on);
      btn.querySelector("svg").setAttribute("fill", on ? "currentColor" : "none");
    });
  }

  function handleBookAction(action, id) {
    const b = BOOKS.find((x) => x.id === id);
    if (!b) return;
    if (b.status !== "available") { toast("Unavailable", "This book is currently on loan", "error"); return; }
    if (action === "Exchange") { openExchange(b); return; }
    if (action === "Buy") { toast("Added to cart", `${b.title} · $${b.price}`, "success"); return; }
    toast("Request sent", `Borrow request sent to ${b.owner}`, "success");
    // push notification
    state.notifs.unshift({ icon: "📖", title: "Borrow request sent", body: `You requested ${b.title} from ${b.owner}.`, time: "just now", unread: true });
    renderNotifs();
  }

  /* ---- Book modal ---- */
  function openBookModal(id) {
    const b = BOOKS.find((x) => x.id === id);
    if (!b) return;
    const saved = store.saved.includes(id);
    const price = b.type === "Buy" ? `$${b.price}` : "Free";
    $("#bookModalContent").innerHTML = `
      <div class="book-detail__cover">${bookCoverArt(b, true)}</div>
      <div class="book-detail__body">
        <h2>${b.title}</h2>
        <p class="author">by ${b.author}</p>
        <div class="book-detail__meta">
          <span class="tag chip">${b.genre}</span>
          <span class="chip">★ ${b.rating}</span>
          <span class="chip">📍 ${b.distance} km</span>
          <span class="book-status ${b.status === "available" ? "" : "book-status--out"}" style="position:static">${b.status === "available" ? "Available" : "On loan"}</span>
        </div>
        <p class="book-detail__desc">${b.desc}</p>
        <div class="book-detail__owner">
          <span class="avatar avatar--lg" style="--a:${b.ownerColor}">${initials(b.owner)}</span>
          <div><strong>${b.owner}</strong><span>Owner · ${price} · usually replies in 1h</span></div>
        </div>
        <div class="book-detail__actions">
          <button class="btn btn--primary" data-action="Borrow" data-id="${b.id}">Borrow</button>
          <button class="btn btn--outline" data-action="Exchange" data-id="${b.id}">Exchange</button>
          <button class="btn btn--outline" data-action="Buy" data-id="${b.id}">Buy ${b.type === "Buy" ? price : ""}</button>
          <button class="btn btn--outline" data-bookmark="${b.id}">${saved ? "★ Saved" : "☆ Save"}</button>
        </div>
      </div>`;
    openModal("#bookModal");
  }

  /* ---- Exchange flow ---- */
  function openExchange(book) {
    state.exchangeTarget = book;
    state.exchangeOffer = null;
    const offers = state.myBooks.filter((b) => b.status === "available");
    $("#exchangeContent").innerHTML = `
      <h2>Propose an exchange</h2>
      <p class="exchange__sub">Offer one of your books to ${book.owner} in exchange for their copy.</p>
      <div class="exchange__target">
        ${bookMini(book.genre)}
        <div><strong>${book.title}</strong><br><small style="color:var(--text-faint)">${book.author} · ${book.owner}</small></div>
      </div>
      <span class="exchange__label">Choose a book to offer</span>
      <div class="offer-grid">
        ${offers.length ? offers.map((b) => `
          <div class="offer-card" data-offer="${b.id}">
            ${bookMini(b.genre)}<strong>${b.title}</strong>
          </div>`).join("") : `<p style="color:var(--text-soft)">You have no available books to offer. Add one first!</p>`}
      </div>
      <span class="exchange__label">Add a message (optional)</span>
      <textarea id="exchangeMsg" rows="3" placeholder="Hi ${book.owner}, would you like to swap?"></textarea>
      <button class="btn btn--primary btn--block" id="submitExchange">Send Exchange Request</button>`;
    openModal("#exchangeModal");

    $$("#exchangeContent .offer-card").forEach((c) => c.addEventListener("click", () => {
      $$("#exchangeContent .offer-card").forEach((x) => x.classList.remove("is-selected"));
      c.classList.add("is-selected");
      state.exchangeOffer = +c.dataset.offer;
    }));

    $("#submitExchange").addEventListener("click", () => {
      if (!offers.length) { toast("No books", "Add a book to your library first", "error"); return; }
      if (!state.exchangeOffer) { toast("Select a book", "Choose a book to offer first", "error"); return; }
      const offered = state.myBooks.find((b) => b.id === state.exchangeOffer);
      $("#exchangeContent").innerHTML = `
        <div class="exchange__success">
          <div class="success-check">✓</div>
          <h2>Request sent!</h2>
          <p>You offered <strong>${offered.title}</strong> for <strong>${book.title}</strong>. We'll notify you when ${book.owner} responds.</p>
          <button class="btn btn--primary" data-close>Done</button>
        </div>`;
      state.requests.unshift({ book: book.title, with: book.owner, status: "pending" });
      state.notifs.unshift({ icon: "🔄", title: "Exchange request sent", body: `You offered ${offered.title} for ${book.title}.`, time: "just now", unread: true });
      renderNotifs();
      $$("#exchangeContent [data-close]").forEach((b) => b.addEventListener("click", () => closeModal($("#exchangeModal"))));
    });
  }

  /* ---- Generic modal helpers ---- */
  let lastFocused = null;
  function openModal(sel) {
    const m = $(sel);
    lastFocused = document.activeElement;
    m.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal(m) {
    m.hidden = true;
    if (!$$(".modal:not([hidden]), .chat-drawer:not([hidden])").length) document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
  function initModals() {
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) {
        const m = e.target.closest(".modal, .chat-drawer");
        if (m) closeModal(m);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        $$(".modal:not([hidden]), .chat-drawer:not([hidden])").forEach(closeModal);
        $("#navSearch").hidden = true;
        closeMobileMenu();
      }
    });
  }

  /* ---- Auth ---- */
  function openAuth(tab) {
    setAuthTab(tab);
    openModal("#authModal");
  }
  function setAuthTab(tab) {
    $$(".auth__tab").forEach((t) => t.classList.toggle("is-active", t.dataset.auth === tab));
    $("#loginForm").hidden = tab !== "login";
    $("#registerForm").hidden = tab !== "register";
  }

  function initAuth() {
    [$("#loginBtn"), $("#loginBtnMobile"), $("#openLoginFromMenu")].forEach((b) =>
      b && b.addEventListener("click", () => { openAuth("login"); closeMobileMenu(); }));

    $$(".auth__tab").forEach((t) => t.addEventListener("click", () => setAuthTab(t.dataset.auth)));

    // password toggles
    $$(".pw-toggle").forEach((btn) => btn.addEventListener("click", () => {
      const inp = $("#" + btn.dataset.pw);
      inp.type = inp.type === "password" ? "text" : "password";
      btn.style.opacity = inp.type === "text" ? "1" : ".7";
    }));

    // validation helpers
    const setError = (input, msg) => {
      const field = input.closest(".field");
      const err = field && field.querySelector(".field__err");
      if (err) err.textContent = msg || "";
      input.classList.toggle("is-invalid", !!msg);
      input.classList.toggle("is-valid", !msg && input.value.trim() !== "");
    };
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    // LOGIN submit
    $("#loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#loginEmail"), pw = $("#loginPassword");
      let ok = true;
      if (!isEmail(email.value)) { setError(email, "Enter a valid email"); ok = false; } else setError(email, "");
      if (pw.value.length < 6) { setError(pw, "Password must be 6+ characters"); ok = false; } else setError(pw, "");
      if (!ok) return;
      const btn = e.submitter; loadingBtn(btn, "Logging in...");
      setTimeout(() => {
        resetBtn(btn, "Log In");
        closeModal($("#authModal"));
        toast("Welcome back!", "You're now logged in", "success");
      }, 900);
    });

    // REGISTER live validation
    const rp = $("#regPassword");
    rp.addEventListener("input", () => updatePwStrength(rp.value));
    $("#regConfirm").addEventListener("input", () => {
      const c = $("#regConfirm");
      if (c.value && c.value !== rp.value) setError(c, "Passwords do not match");
      else setError(c, "");
    });
    $("#regEmail").addEventListener("blur", () => {
      const em = $("#regEmail");
      setError(em, em.value && !isEmail(em.value) ? "Enter a valid email" : "");
    });

    $("#registerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#regName"), email = $("#regEmail"), pw = $("#regPassword"),
            conf = $("#regConfirm"), loc = $("#regLocation"), terms = $("#regTerms");
      let ok = true;
      if (name.value.trim().length < 2) { setError(name, "Please enter your name"); ok = false; } else setError(name, "");
      if (!isEmail(email.value)) { setError(email, "Enter a valid email"); ok = false; } else setError(email, "");
      if (pw.value.length < 6) { setError(pw, "Password must be 6+ characters"); ok = false; } else setError(pw, "");
      if (conf.value !== pw.value) { setError(conf, "Passwords do not match"); ok = false; } else setError(conf, "");
      if (!loc.value.trim()) { setError(loc, "Add your location"); ok = false; } else setError(loc, "");
      if (!terms.checked) { toast("Terms required", "Please accept the terms to continue", "error"); ok = false; }
      if (!ok) return;
      const btn = e.submitter; loadingBtn(btn, "Creating...");
      setTimeout(() => {
        resetBtn(btn, "Create Account");
        closeModal($("#authModal"));
        toast("Account created!", `Welcome to BookLoop, ${name.value.split(" ")[0]} 🎉`, "success");
      }, 1000);
    });

    // social
    $$(".social-btn").forEach((b) => b.addEventListener("click", () =>
      toast("Coming soon", `${b.dataset.social} login is a demo only`, "info")));
  }

  function updatePwStrength(val) {
    const bar = $("#pwBar"), label = $("#pwLabel");
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const levels = [
      { w: "0%", c: "", t: "Enter a password" },
      { w: "25%", c: "var(--red)", t: "Weak" },
      { w: "50%", c: "#d98c3b", t: "Fair" },
      { w: "75%", c: "#c9a83b", t: "Good" },
      { w: "100%", c: "var(--green)", t: "Strong" },
    ];
    const lvl = levels[Math.min(4, score)];
    bar.style.width = lvl.w;
    bar.style.background = lvl.c;
    label.textContent = val ? "Strength: " + lvl.t : "Enter a password";
  }

  function loadingBtn(btn, text) { if (!btn) return; btn.dataset.orig = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spinner"></span> ${text}`; }
  function resetBtn(btn, text) { if (!btn) return; btn.disabled = false; btn.innerHTML = text; }

  /* ---- List a book / My Books management ---- */
  function initBookForm() {
    const open = () => openBookFormModal();
    [$("#listBookBtn"), $("#listBookBtnMobile"), $("#heroListBtn")].forEach((b) =>
      b && b.addEventListener("click", () => { open(); closeMobileMenu(); }));

    $("#bookForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const title = $("#bfTitle"), author = $("#bfAuthor");
      let ok = true;
      const setErr = (inp, msg) => {
        const err = inp.closest(".field").querySelector(".field__err");
        err.textContent = msg; inp.classList.toggle("is-invalid", !!msg);
        if (msg) ok = false;
      };
      setErr(title, title.value.trim() ? "" : "Title is required");
      setErr(author, author.value.trim() ? "" : "Author is required");
      if (!ok) return;

      const id = $("#bookFormId").value;
      const data = {
        title: title.value.trim(), author: author.value.trim(),
        genre: $("#bfGenre").value, type: $("#bfType").value,
        price: +$("#bfPrice").value, status: $("#bfStatus").value,
      };
      if (id) {
        const b = state.myBooks.find((x) => x.id === +id);
        Object.assign(b, data);
        toast("Book updated", `${data.title} was updated`, "success");
      } else {
        state.myBooks.unshift({ id: Date.now(), ...data });
        toast("Book listed!", `${data.title} is now shared with the community`, "success");
      }
      closeModal($("#bookFormModal"));
      refreshMyBooks();
      renderDash("mybooks");
      $$(".dash__nav").forEach((n) => n.classList.toggle("is-active", n.dataset.dash === "mybooks"));
    });
  }

  function openBookFormModal(book) {
    $("#bookFormId").value = book ? book.id : "";
    $("#bookFormTitle").textContent = book ? "Edit book" : "List a book";
    $("#bfTitle").value = book ? book.title : "";
    $("#bfAuthor").value = book ? book.author : "";
    $("#bfGenre").value = book ? book.genre : "Fiction";
    $("#bfType").value = book ? book.type : "Borrow";
    $("#bfPrice").value = book ? book.price : 0;
    $("#bfStatus").value = book ? book.status : "available";
    $$("#bookForm .field__err").forEach((e) => (e.textContent = ""));
    $$("#bookForm .is-invalid").forEach((e) => e.classList.remove("is-invalid"));
    openModal("#bookFormModal");
  }

  function refreshMyBooks() {
    const list = $("#myBooksList");
    if (list) list.innerHTML = myBooksRows(state.myBooks);
  }

  function bindMyBooksTools() {
    const add = $("#dashAddBook");
    if (add) add.addEventListener("click", () => openBookFormModal());
    const search = $("#myBookSearch"), filter = $("#myBookFilter");
    const apply = () => {
      const q = (search.value || "").toLowerCase();
      const st = filter.value;
      const list = state.myBooks.filter((b) =>
        (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) &&
        (!st || b.status === st));
      $("#myBooksList").innerHTML = myBooksRows(list);
    };
    if (search) search.addEventListener("input", apply);
    if (filter) filter.addEventListener("change", apply);
  }

  // delegated actions for my-books rows + settings
  function initDashDelegation() {
    $("#dashMain").addEventListener("click", (e) => {
      const del = e.target.closest("[data-delete-book]");
      if (del) {
        const id = +del.dataset.deleteBook;
        state.myBooks = state.myBooks.filter((b) => b.id !== id);
        refreshMyBooks(); toast("Deleted", "Book removed from your library", "info"); return;
      }
      const edit = e.target.closest("[data-edit-book]");
      if (edit) { openBookFormModal(state.myBooks.find((b) => b.id === +edit.dataset.editBook)); return; }
      const tog = e.target.closest("[data-toggle-status]");
      if (tog) {
        const b = state.myBooks.find((x) => x.id === +tog.dataset.toggleStatus);
        b.status = b.status === "available" ? "unavailable" : "available";
        refreshMyBooks(); toast("Status updated", `${b.title} is now ${b.status}`, "success"); return;
      }
      if (e.target.closest("[data-save-settings]")) { toast("Saved", "Your settings were updated", "success"); }
    });
  }

  function initDashNav() {
    $$(".dash__nav").forEach((n) => n.addEventListener("click", () => {
      $$(".dash__nav").forEach((x) => x.classList.remove("is-active"));
      n.classList.add("is-active");
      renderDash(n.dataset.dash);
    }));
  }

  /* ---- Chat ---- */
  function initChat() {
    $("#chatFab").addEventListener("click", () => { openModal("#chatDrawer"); $("#chatDrawer").hidden = false; document.body.style.overflow = "hidden"; renderConversations(); openConversation(state.activeConv); });
    renderConversations();

    $("#convSearch").addEventListener("input", (e) => renderConversations(e.target.value.toLowerCase()));

    // emoji
    $("#emojiBtn").addEventListener("click", () => {
      const inp = $("#chatInput");
      inp.value += EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      inp.focus();
    });
    $("#attachBtn").addEventListener("click", () => toast("Attachment", "File attachments are demo-only", "info"));

    $("#chatForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = $("#chatInput");
      const text = inp.value.trim();
      if (!text) return;
      const conv = CONVERSATIONS.find((c) => c.id === state.activeConv);
      const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      conv.messages.push({ from: "out", text, time: now });
      conv.last = text;
      inp.value = "";
      renderMessages(conv);
      renderConversations($("#convSearch").value.toLowerCase());
      simulateReply(conv);
    });
  }

  function renderConversations(q = "") {
    const list = CONVERSATIONS.filter((c) => c.name.toLowerCase().includes(q));
    $("#convList").innerHTML = list.map((c) => `
      <div class="conv ${c.id === state.activeConv ? "is-active" : ""}" data-conv="${c.id}">
        <div class="conv__avatar">
          <span class="avatar" style="--a:${c.color}">${initials(c.name)}</span>
          <span class="conv__status ${c.online ? "is-online" : ""}"></span>
        </div>
        <div class="conv__body">
          <strong>${c.name} <time>${c.time}</time></strong>
          <p>${c.last}</p>
        </div>
      </div>`).join("");
    $$("#convList .conv").forEach((row) => row.addEventListener("click", () => openConversation(+row.dataset.conv)));
  }

  function openConversation(id) {
    state.activeConv = id;
    const conv = CONVERSATIONS.find((c) => c.id === id);
    $("#chatHead").innerHTML = `
      <span class="avatar" style="--a:${conv.color}">${initials(conv.name)}</span>
      <div><strong>${conv.name}</strong><br><span>${conv.online ? "● Online" : "Offline"}</span></div>`;
    renderMessages(conv);
    renderConversations($("#convSearch").value.toLowerCase());
  }

  function renderMessages(conv) {
    const box = $("#chatMessages");
    box.innerHTML = conv.messages.map((m) =>
      `<div class="msg msg--${m.from}">${m.text}<time>${m.time}</time></div>`).join("");
    box.scrollTop = box.scrollHeight;
  }

  function simulateReply(conv) {
    const typing = $("#typing");
    typing.hidden = false;
    const replies = ["Got it! 👍", "Sounds great 📚", "Sure, let's do it!", "Perfect, thanks!", "I'll check and let you know 🙂"];
    setTimeout(() => {
      typing.hidden = true;
      const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      conv.messages.push({ from: "in", text: replies[Math.floor(Math.random() * replies.length)], time: now });
      conv.last = conv.messages[conv.messages.length - 1].text;
      if (!$("#chatDrawer").hidden) renderMessages(conv);
      renderConversations($("#convSearch").value.toLowerCase());
    }, 1600);
  }

  /* ---- Community CTAs ---- */
  function initCommunity() {
    [$("#joinCommunity"), $("#aboutJoin"), $("#footerJoin")].forEach((b) =>
      b && b.addEventListener("click", (e) => { e.preventDefault(); openAuth("register"); }));
  }

  /* ---- Count-up stats ---- */
  function animateCount(elm) {
    const target = +elm.dataset.count;
    const suffix = elm.dataset.suffix || "";
    const dur = 1400; const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(eased * target);
      elm.textContent = val.toLocaleString() + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); }
      });
    }, { threshold: .5 });
    $$("#heroStats dt").forEach((d) => io.observe(d));

    // community numeric stats
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        countTo($("#cstat1"), 1284); countTo($("#cstat2"), 342); countTo($("#cstat3"), 87);
        // trending bars
        $$("#trendingList .trend__bar i").forEach((i) => (i.style.width = i.dataset.w + "%"));
        cio.disconnect();
      });
    }, { threshold: .4 });
    const cs = $("#community");
    if (cs) cio.observe(cs);
  }
  function countTo(elm, target) {
    if (!elm) return;
    const dur = 1400, start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      elm.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---- Scroll reveal ---- */
  let revealObserver;
  function observeReveals() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); revealObserver.unobserve(en.target); } });
      }, { threshold: .12 });
    }
    $$(".reveal:not(.is-visible)").forEach((r) => revealObserver.observe(r));
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    $("#year").textContent = new Date().getFullYear();
    initTheme();
    renderFeatures();
    renderCarousel();
    renderDiscovery();
    renderHow();
    renderCommunity();
    renderNotifs();
    renderDash("overview");

    initNav();
    initDropdowns();
    initSearch();
    initFinder();
    initCarousel();
    initDiscovery();
    initHow();
    initBookActions();
    initModals();
    initAuth();
    initBookForm();
    initDashNav();
    initDashDelegation();
    initChat();
    initCommunity();
    initCounters();
    observeReveals();

    // Mark reveal on section heads/cards added statically
    $$(".section, .book-card").forEach(() => {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
