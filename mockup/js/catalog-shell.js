/**
 * Theme + scroll progress for catalog shell (index + individual mockups).
 */
(function () {
  var stored = localStorage.getItem("dibbs_theme");
  var prefersLight =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  var theme = stored || (prefersLight ? "light" : "dark");
  document.documentElement.dataset.theme = theme;

  var btn = document.getElementById("themeToggle");
  function sync() {
    if (btn) {
      btn.textContent = document.documentElement.dataset.theme === "light" ? "Light" : "Night";
    }
  }
  sync();
  if (btn) {
    btn.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("dibbs_theme", next);
      sync();
    });
  }

  window.addEventListener("scroll", function () {
    var bar = document.getElementById("doc-progress");
    if (!bar) return;
    var h = document.body.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (100 * window.scrollY) / h + "%" : "0%";
  });
})();

/**
 * In-device mock interactions (screens with .device__screen--design-rules).
 */
(function () {
  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function initRoot(root) {
    if (!root || root.dataset.mockInteractionsInit === "1") return;
    root.dataset.mockInteractionsInit = "1";

    var cd = root.querySelector(".countdown");
    if (cd) {
      var text = cd.textContent.trim();
      var parts = text.split(":").map(function (x) {
        return parseInt(x, 10);
      });
      if (
        parts.length === 3 &&
        parts.every(function (n) {
          return !isNaN(n);
        })
      ) {
        var sec = parts[0] * 3600 + parts[1] * 60 + parts[2];
        setInterval(function () {
          if (sec <= 0) return;
          sec -= 1;
          cd.textContent =
            pad2(Math.floor(sec / 3600)) +
            ":" +
            pad2(Math.floor((sec % 3600) / 60)) +
            ":" +
            pad2(sec % 60);
        }, 1000);
      }
    }

    var mmssDown = root.querySelector("[data-mock-mmss-down]");
    if (mmssDown) {
      var segs = mmssDown.textContent.trim().split(":");
      var rem =
        parseInt(segs[0], 10) * 60 + parseInt(segs[1] || "0", 10);
      if (!isNaN(rem) && rem > 0) {
        setInterval(function () {
          if (rem <= 0) return;
          rem -= 1;
          mmssDown.textContent = pad2(Math.floor(rem / 60)) + ":" + pad2(rem % 60);
        }, 1000);
      }
    }

    var tb = root.querySelector(".bid-table tbody");
    if (tb) {
      tb.querySelectorAll("tr").forEach(function (tr) {
        tr.setAttribute("tabindex", "0");
        tr.addEventListener("click", function () {
          tb.querySelectorAll("tr").forEach(function (x) {
            x.classList.remove("bid-row--picked");
          });
          tr.classList.add("bid-row--picked");
        });
      });
    }

    var markRead = root.querySelector("[data-mock-mark-read]");
    if (markRead) {
      markRead.addEventListener("click", function (e) {
        e.preventDefault();
        root.querySelectorAll(".notif-row.unread").forEach(function (r) {
          r.classList.remove("unread");
        });
      });
    }

    var chipBar = root.querySelector(".chip-scroller");
    if (chipBar) {
      chipBar.addEventListener("click", function (e) {
        var chip = e.target.closest(".mat-chip");
        if (!chip) return;
        chipBar.querySelectorAll(".mat-chip").forEach(function (c) {
          c.classList.remove("is-active");
        });
        chip.classList.add("is-active");
      });
    }

    root.querySelectorAll(".set-row").forEach(function (row) {
      var t = row.querySelector(".toggle-fake");
      if (!t) return;
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", "0");
      row.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        t.classList.toggle("toggle-fake--off");
      });
      row.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          t.classList.toggle("toggle-fake--off");
        }
      });
    });

    root.querySelectorAll(".btn-google").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        b.style.opacity = "0.7";
        setTimeout(function () {
          b.style.opacity = "";
        }, 280);
      });
    });

    root.querySelectorAll(".mock-text-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var prev = btn.textContent;
        btn.textContent = "Passed (demo)";
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = prev;
          btn.disabled = false;
        }, 1600);
      });
    });

    root.querySelectorAll(".mock-download-demo").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = btn.textContent;
        btn.textContent = "Preparing… (demo)";
        setTimeout(function () {
          btn.textContent = t;
        }, 900);
      });
    });

    root.querySelectorAll(".mock-fill-price").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var inp = root.querySelector("#bidPrice") || root.querySelector('input.field__input[type="text"]');
        if (inp) {
          inp.value = "4.10";
          inp.focus();
        }
      });
    });

    root.querySelectorAll(".mock-notes-toggle").forEach(function (b) {
      b.addEventListener("click", function () {
        var panel = root.querySelector(".mock-notes-panel");
        if (!panel) return;
        var open = panel.hasAttribute("hidden");
        if (open) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
        b.textContent = open ? "Hide notes −" : "Add notes for contractor +";
      });
    });
  }

  function isMockHomeContext() {
    if (/home\.html/i.test(location.pathname)) return true;
    var p = location.pathname.toLowerCase();
    var onAppShell = /\/app\.html$/i.test(p) || /\/app$/i.test(p);
    if (onAppShell && /#home\b/i.test(location.hash)) return true;
    return false;
  }

  window.DibbsCatalogInitMocks = function (root) {
    if (!root) root = document;
    root.querySelectorAll(".device__screen--design-rules").forEach(initRoot);
    if (!isMockHomeContext()) return;
    root.querySelectorAll(".device__screen--design-rules").forEach(function (homeRoot) {
      var bell = homeRoot.querySelector(".dash-bell");
      if (!bell || bell.dataset.mockBadgeListener === "1") return;
      bell.dataset.mockBadgeListener = "1";
      var badge = homeRoot.querySelector(".dash-bell__badge");
      if (badge && sessionStorage.getItem("mock_dash_badge_cleared") === "1") {
        badge.style.display = "none";
      }
      bell.addEventListener(
        "click",
        function () {
          sessionStorage.setItem("mock_dash_badge_cleared", "1");
        },
        true
      );
    });
  };
  window.DibbsCatalogInitMocks(document);
})();
