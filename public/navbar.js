// Navbar Component
class Navbar {
  constructor(config = {}) {
    this.style = config.style || "user-bar"; // 'user-bar' or 'navbar'
    this.menuItems = config.menuItems || [
      { href: "/create", i18nKey: "nav.create", id: "createLink", icon: "✨" },
      { href: "/my-urls", i18nKey: "nav.myUrls", id: "myUrlsLink" },
      { href: "/chat", i18nKey: "nav.chat", id: "chatLink", icon: "💬" },
      {
        href: "/admin",
        i18nKey: "nav.admin",
        id: "adminLink",
        icon: "📊",
        requiresRole: ["ADMIN", "SUPER_ADMIN"],
      },
    ];

    this.onAuthChange = config.onAuthChange || null; // Callback when auth state changes
    this.init();
  }

  // Generate navbar HTML (full navbar style)
  getNavbarHTML() {
    const navLinks = this.menuItems
      .map((item) => {
        const classes = item.requiresRole
          ? "navbar-link hidden"
          : "navbar-link";
        const icon = item.icon ? `${item.icon} ` : "";
        return `<a href="${item.href}" id="${item.id}" class="${classes}" data-i18n="${item.i18nKey}">${icon}</a>`;
      })
      .join("");

    return `
      <nav class="navbar hidden" id="navbar">
        <div class="navbar-container">
          <a href="/" class="navbar-brand">
            <span class="brand-icon">🔗</span>
            DUDX
          </a>
          <div class="navbar-menu">
            ${navLinks}
            <button class="navbar-link" id="logoutBtn" data-i18n="nav.logout">ออกจากระบบ</button>
            <div class="language-buttons">
              <button class="lang-btn" id="langBtnTh" data-lang="th">TH</button>
              <button class="lang-btn" id="langBtnEn" data-lang="en">EN</button>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  // Generate user-bar HTML (compact style for my-urls)
  getUserBarHTML() {
    const navLinks = this.menuItems
      .map((item) => {
        const classes = item.requiresRole ? "hidden" : "";
        const icon = item.icon ? `${item.icon} ` : "";
        return `<a href="${item.href}" id="${item.id}" class="${classes}" style="text-decoration: none; color: #007bff; font-size: 14px; font-weight: 500;" data-i18n="${item.i18nKey}">${icon}</a>`;
      })
      .join("");

    return `
      <div class="floating-menu hidden" id="floatingMenu">
        <button class="menu-item" id="menuLangTh">TH</button>
        <button class="menu-item" id="menuLangEn">EN</button>
        <button class="menu-item logout" id="menuLogout">Logout</button>
      </div>
      <div class="user-bar hidden" id="userBar">
        ${navLinks}
        <div class="user-info">
          <img class="user-photo" id="userPhoto" src="" alt="User" />
          <span class="user-name" id="userName"></span>
        </div>
        <button class="menu-btn" id="menuBtn">☰</button>
      </div>
    `;
  }

  init() {
    const navbarContainer = document.createElement("div");
    navbarContainer.innerHTML =
      this.style === "navbar" ? this.getNavbarHTML() : this.getUserBarHTML();
    document.body.insertBefore(navbarContainer, document.body.firstChild);

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (this.style === "navbar") {
      this.setupNavbarListeners();
    } else {
      this.setupUserBarListeners();
    }
  }

  setupNavbarListeners() {
    const logoutBtn = document.getElementById("logoutBtn");
    const langBtnTh = document.getElementById("langBtnTh");
    const langBtnEn = document.getElementById("langBtnEn");

    logoutBtn?.addEventListener("click", async () => {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/";
    });

    const updateActiveLanguage = () => {
      const currentLang = window.i18n?.getLang() || "th";
      if (currentLang === "th") {
        langBtnTh?.classList.add("active");
        langBtnEn?.classList.remove("active");
      } else {
        langBtnEn?.classList.add("active");
        langBtnTh?.classList.remove("active");
      }
    };

    langBtnTh?.addEventListener("click", () => {
      window.i18n?.setLang("th");
      updateActiveLanguage();
    });

    langBtnEn?.addEventListener("click", () => {
      window.i18n?.setLang("en");
      updateActiveLanguage();
    });

    setTimeout(updateActiveLanguage, 100);
  }

  setupUserBarListeners() {
    const menuBtn = document.getElementById("menuBtn");
    const floatingMenu = document.getElementById("floatingMenu");
    const menuLangTh = document.getElementById("menuLangTh");
    const menuLangEn = document.getElementById("menuLangEn");
    const menuLogout = document.getElementById("menuLogout");

    menuBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      floatingMenu?.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (
        floatingMenu &&
        !floatingMenu.contains(e.target) &&
        e.target !== menuBtn
      ) {
        floatingMenu.classList.add("hidden");
      }
    });

    const updateActiveLanguage = () => {
      const currentLang = window.i18n?.currentLang || "th";
      if (currentLang === "th") {
        menuLangTh?.classList.add("active");
        menuLangEn?.classList.remove("active");
      } else {
        menuLangEn?.classList.add("active");
        menuLangTh?.classList.remove("active");
      }
    };

    menuLangTh?.addEventListener("click", () => {
      window.i18n?.setLang("th");
      updateActiveLanguage();
      floatingMenu?.classList.add("hidden");
    });

    menuLangEn?.addEventListener("click", () => {
      window.i18n?.setLang("en");
      updateActiveLanguage();
      floatingMenu?.classList.add("hidden");
    });

    setTimeout(updateActiveLanguage, 100);

    menuLogout?.addEventListener("click", () => {
      window.location.href = "/auth/logout";
    });
  }

  updateMenuVisibility(userRole) {
    this.menuItems.forEach((item) => {
      if (item.requiresRole) {
        const link = document.getElementById(item.id);
        if (link) {
          if (item.requiresRole.includes(userRole)) {
            link.classList.remove("hidden");
          } else {
            link.classList.add("hidden");
          }
        }
      }
    });
  }

  async checkAuth() {
    try {
      const res = await fetch("/api/user");
      if (!res.ok) {
        throw new Error("Not authenticated");
      }

      const data = await res.json();

      if (!data.isAuthenticated) {
        this.hideNavbar();
        this.onAuthChange?.(null);
        return null;
      }

      // User is authenticated
      const user = data;
      this.showNavbar(user);
      this.updateMenuVisibility(user.role);
      this.onAuthChange?.(user);

      return user;
    } catch (e) {
      console.error("Auth check failed:", e);
      this.hideNavbar();
      this.onAuthChange?.(null);
      return null;
    }
  }

  showNavbar(user) {
    if (this.style === "navbar") {
      const navbar = document.getElementById("navbar");
      navbar?.classList.remove("hidden");
    } else {
      const userBar = document.getElementById("userBar");
      const userName = document.getElementById("userName");
      const userPhoto = document.getElementById("userPhoto");

      userBar?.classList.remove("hidden");
      if (userName) userName.textContent = user.name;

      if (user.photo && userPhoto) {
        userPhoto.src = user.photo;
        userPhoto.onerror = function () {
          this.style.display = "none";
        };
      } else if (userPhoto) {
        userPhoto.style.display = "none";
      }
    }
  }

  hideNavbar() {
    if (this.style === "navbar") {
      const navbar = document.getElementById("navbar");
      navbar?.classList.add("hidden");
    } else {
      const userBar = document.getElementById("userBar");
      userBar?.classList.add("hidden");
    }
  }
}

// Export for use in other scripts
window.Navbar = Navbar;
