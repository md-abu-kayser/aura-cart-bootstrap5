// JS Start
// -------------------------------------------------------------->
// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = "ocean-blue";
    this.isDarkMode = false;
    this.init();
  }

  init() {
    this.loadPreferences();
    this.bindEvents();
    this.applyTheme();
  }

  loadPreferences() {
    const savedTheme = localStorage.getItem("theme");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedTheme) this.currentTheme = savedTheme;
    if (savedDarkMode) this.isDarkMode = JSON.parse(savedDarkMode);
  }

  bindEvents() {
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setTheme(e.target.dataset.theme);
      });
    });

    document.getElementById("darkModeToggle").addEventListener("click", () => {
      this.toggleDarkMode();
    });

    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem("darkMode")) {
            this.isDarkMode = e.matches;
            this.applyTheme();
          }
        });
    }
  }

  setTheme(themeName) {
    this.currentTheme = themeName;

    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`[data-theme="${themeName}"]`)
      .classList.add("active");

    this.applyTheme();
    this.savePreferences();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const toggleBtn = document.getElementById("darkModeToggle");

    if (this.isDarkMode) {
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }

    this.applyTheme();
    this.savePreferences();
  }

  applyTheme() {
    const html = document.documentElement;

    html.setAttribute("data-color-theme", this.currentTheme);

    if (this.isDarkMode) {
      html.setAttribute("data-theme", "dark");
    } else {
      html.removeAttribute("data-theme");
    }
  }

  savePreferences() {
    localStorage.setItem("theme", this.currentTheme);
    localStorage.setItem("darkMode", JSON.stringify(this.isDarkMode));
  }
}

// Search
class SearchManager {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const searchToggle = document.getElementById("searchToggle");
    const searchClose = document.getElementById("searchClose");
    const searchBar = document.getElementById("searchBar");

    searchToggle.addEventListener("click", () => this.toggleSearch());
    searchClose.addEventListener("click", () => this.closeSearch());

    document.addEventListener("click", (e) => {
      if (!searchBar.contains(e.target) && !searchToggle.contains(e.target)) {
        this.closeSearch();
      }
    });
  }

  toggleSearch() {
    const searchBar = document.getElementById("searchBar");
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      searchBar.classList.add("active");
      searchBar.querySelector("input").focus();
    } else {
      this.closeSearch();
    }
  }

  closeSearch() {
    const searchBar = document.getElementById("searchBar");
    searchBar.classList.remove("active");
    this.isOpen = false;
  }
}

// Product
class ProductManager {
  constructor() {
    this.cart = [];
    this.wishlist = [];
    this.init();
  }

  init() {
    this.loadCart();
    this.loadWishlist();
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.addToCart(e.target.closest(".product-card"));
      });
    });

    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.toggleWishlist(e.target.closest(".product-card"));
      });
    });

    document.querySelectorAll(".quick-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.quickView(e.target.closest(".product-card"));
      });
    });
  }

  addToCart(productCard) {
    const product = {
      id: this.generateId(),
      name: productCard.querySelector(".product-title").textContent,
      price: productCard.querySelector(".current-price").textContent,
      image: productCard.querySelector("img").src,
    };

    this.cart.push(product);
    this.saveCart();
    this.showNotification("Product added to cart!", "success");
    this.updateCartBadge();
    this.animateAddToCart(productCard);
  }

  toggleWishlist(productCard) {
    const productId = productCard.dataset.productId || this.generateId();
    const wishlistBtn = productCard.querySelector(".wishlist-btn");
    const isInWishlist = this.wishlist.find((item) => item.id === productId);

    if (isInWishlist) {
      this.wishlist = this.wishlist.filter((item) => item.id !== productId);
      wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
      this.showNotification("Removed from wishlist", "info");
    } else {
      const product = {
        id: productId,
        name: productCard.querySelector(".product-title").textContent,
        price: productCard.querySelector(".current-price").textContent,
        image: productCard.querySelector("img").src,
      };
      this.wishlist.push(product);
      wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
      this.showNotification("Added to wishlist!", "success");
    }

    this.saveWishlist();
    this.animateWishlist(wishlistBtn);
  }

  quickView(productCard) {
    this.showNotification("Quick view feature would open here", "info");
  }

  animateAddToCart(productCard) {
    const btn = productCard.querySelector(".add-to-cart-btn");
    btn.style.transform = "scale(0.95)";

    setTimeout(() => {
      btn.style.transform = "";
    }, 150);
  }

  animateWishlist(btn) {
    btn.style.transform = "scale(1.2)";

    setTimeout(() => {
      btn.style.transform = "";
    }, 300);
  }

  updateCartBadge() {
    const cartBadge = document.querySelector(
      '.user-action-btn[title="Cart"] .action-badge'
    );
    if (cartBadge) {
      cartBadge.textContent = this.cart.length;
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            border-left: 4px solid ${this.getNotificationColor(type)};
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  }

  getNotificationColor(type) {
    const colors = {
      success: "#48bb78",
      error: "#f56565",
      warning: "#ed8936",
      info: "#4299e1",
    };
    return colors[type] || "#4299e1";
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.updateCartBadge();
    }
  }

  saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(this.wishlist));
  }

  loadWishlist() {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      this.wishlist = JSON.parse(savedWishlist);
    }
  }
}

// Newsletter
class NewsletterManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const form = document.getElementById("subscriptionForm");
    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    this.showLoading();

    setTimeout(() => {
      this.hideLoading();
      this.showSuccess();
      e.target.reset();
    }, 1500);
  }

  showLoading() {
    const submitBtn = document.querySelector(
      '#subscriptionForm button[type="submit"]'
    );
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
  }

  hideLoading() {
    const submitBtn = document.querySelector(
      '#subscriptionForm button[type="submit"]'
    );
    submitBtn.innerHTML =
      '<i class="fas fa-paper-plane me-2"></i>Subscribe Now';
    submitBtn.disabled = false;
  }

  showSuccess() {
    alert("Thank you for subscribing! You will receive our newsletter soon.");
  }
}

// Navigation
class NavigationManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
    window.addEventListener("scroll", () => this.handleScroll());
  }

  handleScroll() {
    const navbar = document.querySelector(".mega-navbar");
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.backdropFilter = "blur(10px)";
    } else {
      navbar.style.background = "";
      navbar.style.backdropFilter = "";
    }
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.observeElements();
  }

  observeElements() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );
    document
      .querySelectorAll(".product-card, .feature-card, .category-card")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  bindEvents() {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mouseenter", this.createRipple);
    });
  }

  createRipple(e) {
    const btn = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - btn.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - btn.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = btn.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }

    btn.appendChild(circle);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new ThemeManager();
  new SearchManager();
  new ProductManager();
  new NewsletterManager();
  new NavigationManager();
  new AnimationManager();
  const style = document.createElement("style");
  style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .product-card, .feature-card, .category-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
  document.head.appendChild(style);
});

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

window.addEventListener("error", function (e) {
  console.error("Error occurred:", e.error);
});

// Responsive Image Handling
function handleImageFallbacks() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("error", function () {
      this.src =
        "https://via.placeholder.com/400x300/f8f9fa/6c757d?text=Image+Not+Found";
      this.alt = "Image not available";
    });
  });
}

document.addEventListener("DOMContentLoaded", handleImageFallbacks);

// JS End
// ------------------------------------------------------------------------------------------------->
