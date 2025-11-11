// Navbar Component
class Navbar {
  constructor(config = {}) {
    // Configuration: array of menu items
    this.menuItems = config.menuItems || [
      {
        href: "/create",
        i18nKey: "nav.create",
        id: "createLink",
        icon: "✨",
      },
      {
        href: "/my-urls",
        i18nKey: "nav.myUrls",
        id: "myUrlsLink",
      },
      {
        href: "/chat",
        i18nKey: "nav.chat",
        id: "chatLink",
        icon: "💬",
      },
      {
        href: "/admin",
        i18nKey: "nav.admin",
        id: "adminLink",
        icon: "📊",
        requiresRole: ["ADMIN", "SUPER_ADMIN"], // Only show for these roles
      },
    ];

    this.init();
  }

  // Generate navigation links HTML from config
  generateNavLinks() {
    return this.menuItems
      .map((item) => {
        const classes = item.requiresRole ? "hidden" : "";
        const icon = item.icon ? `${item.icon} ` : "";

        return `
            <a
                href="${item.href}"
                id="${item.id}"
                class="${classes}"
                style="
                    text-decoration: none;
                    color: #007bff;
                    font-size: 14px;
                    font-weight: 500;
                "
                data-i18n="${item.i18nKey}"
            >${icon}</a>
        `;
      })
      .join("");
  }

  // Get navbar HTML
  getHTML() {
    return `
        <!-- Floating Menu -->
        <div class="floating-menu hidden" id="floatingMenu">
            <button class="menu-item" id="menuLangTh">TH</button>
            <button class="menu-item" id="menuLangEn">EN</button>
            <button class="menu-item logout" id="menuLogout">Logout</button>
        </div>

        <!-- User Bar -->
        <div class="user-bar hidden" id="userBar">
            ${this.generateNavLinks()}
            <div class="user-info">
                <img class="user-photo" id="userPhoto" src="" alt="User" />
                <span class="user-name" id="userName"></span>
            </div>
            <button class="menu-btn" id="menuBtn">☰</button>
        </div>
        `;
  }

  // Initialize navbar
  init() {
    // Inject HTML at the beginning of body
    const navbarContainer = document.createElement("div");
    navbarContainer.innerHTML = this.getHTML();
    document.body.insertBefore(navbarContainer, document.body.firstChild);

    // Setup event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    const menuBtn = document.getElementById("menuBtn");
    const floatingMenu = document.getElementById("floatingMenu");
    const menuLangTh = document.getElementById("menuLangTh");
    const menuLangEn = document.getElementById("menuLangEn");
    const menuLogout = document.getElementById("menuLogout");

    // Menu toggle functionality
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      floatingMenu.classList.toggle("hidden");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!floatingMenu.contains(e.target) && e.target !== menuBtn) {
        floatingMenu.classList.add("hidden");
      }
    });

    // Update active language button
    const updateActiveLanguage = () => {
      const currentLang = window.i18n?.currentLang || "th";
      if (currentLang === "th") {
        menuLangTh.classList.add("active");
        menuLangEn.classList.remove("active");
      } else {
        menuLangEn.classList.add("active");
        menuLangTh.classList.remove("active");
      }
    };

    // Language buttons in menu
    menuLangTh.addEventListener("click", () => {
      window.i18n.setLang("th");
      updateActiveLanguage();
      floatingMenu.classList.add("hidden");
    });

    menuLangEn.addEventListener("click", () => {
      window.i18n.setLang("en");
      updateActiveLanguage();
      floatingMenu.classList.add("hidden");
    });

    // Initialize active language on load
    setTimeout(updateActiveLanguage, 100);

    // Logout button in menu
    menuLogout.addEventListener("click", () => {
      window.location.href = "/auth/logout";
    });
  }

  // Update menu visibility based on user role
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

  // Check authentication and show/hide navbar
  async checkAuth() {
    try {
      const res = await fetch("/auth/user");
      const userBar = document.getElementById("userBar");
      const userName = document.getElementById("userName");
      const userPhoto = document.getElementById("userPhoto");

      if (res.ok) {
        const user = await res.json();

        // Show navbar
        userBar.classList.remove("hidden");
        userName.textContent = user.name;

        // Set photo with error handling
        if (user.photo) {
          userPhoto.src = user.photo;
          userPhoto.onerror = function () {
            this.style.display = "none";
            console.warn("Failed to load avatar, using fallback");
          };
        } else {
          userPhoto.style.display = "none";
        }

        // Update menu visibility based on user role
        this.updateMenuVisibility(user.role);

        return user;
      } else {
        // User is not authenticated
        userBar.classList.add("hidden");
        return null;
      }
    } catch (e) {
      console.error("Auth check failed:", e);
      const userBar = document.getElementById("userBar");
      userBar.classList.add("hidden");
      return null;
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.navbar = new Navbar();
  });
} else {
  window.navbar = new Navbar();
}
