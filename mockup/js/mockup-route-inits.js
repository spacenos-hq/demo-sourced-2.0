/**
 * Screen-specific behaviors for mockup HTML (standalone + hash SPA).
 * Each init(root) scopes queries to root; returns destroy() when needed.
 */
(function () {
  var currentDestroy = null;

  function setDestroy(fn) {
    if (currentDestroy) {
      try {
        currentDestroy();
      } catch (e) {}
    }
    currentDestroy = typeof fn === "function" ? fn : null;
  }

  function teardown() {
    setDestroy(null);
    if (typeof window.SourcedDestroyHandoffLive === "function") {
      window.SourcedDestroyHandoffLive();
    }
  }

  function initSplash(root) {
    var splash = root.querySelector(".device__screen--design-rules .splash");
    if (!splash) return;
    splash.style.cursor = "pointer";
    splash.setAttribute("title", "Tap to continue");
    var to = setTimeout(function () {
      if (window.MockupRouter && window.MockupRouter.go) {
        window.MockupRouter.go("onboard");
      } else {
        location.hash = "#onboard";
      }
    }, 1800);
    function onClick() {
      clearTimeout(to);
      if (window.MockupRouter && window.MockupRouter.go) {
        window.MockupRouter.go("onboard");
      } else {
        location.hash = "#onboard";
      }
    }
    splash.addEventListener("click", onClick);
    return function () {
      clearTimeout(to);
      splash.removeEventListener("click", onClick);
    };
  }

  function initOnboarding(root) {
    var track = root.querySelector("#obTrack");
    var dots = root.querySelectorAll(".onboarding__dot");
    var skip = root.querySelector("#obSkip");
    var footer = root.querySelector("#obFooter");
    var viewport = root.querySelector("#obViewport");
    var obDots = root.querySelector("#obDots");
    var slides = root.querySelectorAll(".onboarding__slide");
    if (!track || !obDots || !viewport) return;

    var ac = new AbortController();
    var sig = { signal: ac.signal };
    var i = 0;
    var n = 3;

    function go(index) {
      i = Math.max(0, Math.min(n - 1, index));
      track.style.transform = "translateX(-" + i * 33.333333 + "%)";
      dots.forEach(function (d, j) {
        d.setAttribute("aria-current", j === i ? "true" : "false");
      });
      slides.forEach(function (s, j) {
        s.classList.toggle("onboarding__slide--active", j === i);
      });
      if (skip) skip.hidden = i >= 2;
      if (footer) footer.hidden = i < 2;
    }

    obDots.addEventListener(
      "click",
      function (e) {
        var t = e.target;
        if (t && t.dataset && t.dataset.go != null) go(+t.dataset.go);
      },
      sig
    );

    if (skip) {
      skip.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          go(2);
        },
        sig
      );
    }

    var startX = 0;
    viewport.addEventListener(
      "touchstart",
      function (e) {
        startX = e.changedTouches[0].screenX;
      },
      Object.assign({ passive: true }, sig)
    );
    viewport.addEventListener(
      "touchend",
      function (e) {
        var dx = e.changedTouches[0].screenX - startX;
        if (dx < -48) go(i + 1);
        else if (dx > 48 && i > 0) go(i - 1);
      },
      Object.assign({ passive: true }, sig)
    );

    go(0);
    return function () {
      ac.abort();
    };
  }

  function initRoleSelect(root) {
    var cards = root.querySelectorAll(".role-card");
    var btn = root.querySelector("#roleContinue");
    if (!btn || !cards.length) return;

    var selected = null;
    var ac = new AbortController();
    var sig = { signal: ac.signal };

    function sync() {
      cards.forEach(function (c) {
        c.setAttribute("aria-checked", c === selected ? "true" : "false");
      });
      if (selected) {
        btn.classList.remove("btn--disabled");
        btn.removeAttribute("aria-disabled");
      } else {
        btn.classList.add("btn--disabled");
        btn.setAttribute("aria-disabled", "true");
      }
    }

    cards.forEach(function (c) {
      c.addEventListener(
        "click",
        function () {
          selected = c;
          sync();
        },
        sig
      );
    });

    btn.addEventListener(
      "click",
      function (e) {
        if (!selected) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        var slug = selected.dataset.role === "supplier" ? "signup-supplier" : "signup-contractor";
        if (window.MockupRouter && window.MockupRouter.go) {
          window.MockupRouter.go(slug);
        } else {
          location.href = slug + ".html";
        }
      },
      sig
    );

    sync();
    return function () {
      ac.abort();
    };
  }

  function initSignupContractor(root) {
    var fields = ["name", "company", "email", "phone"].map(function (id) {
      return root.querySelector("#" + id);
    });
    var btn = root.querySelector("#suContinue");
    var emailErr = root.querySelector("#emailErr");
    if (!btn || fields.some(function (x) {
      return !x;
    })) {
      return;
    }

    function emailOk(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    }

    function formatPhone(input) {
      var d = input.value.replace(/\D/g, "").slice(0, 10);
      var p = "";
      if (d.length > 0) p = "(" + d.slice(0, 3);
      if (d.length >= 4) p += ") " + d.slice(3, 6);
      if (d.length >= 7) p += "-" + d.slice(6, 10);
      input.value = p;
    }

    var ac = new AbortController();
    var sig = { signal: ac.signal };

    var phoneEl = root.querySelector("#phone");
    if (phoneEl) {
      phoneEl.addEventListener(
        "input",
        function () {
          formatPhone(this);
          validate();
        },
        sig
      );
    }

    function validate() {
      fields.forEach(function (el) {
        var wrap = el.closest(".field");
        if (!wrap) return;
        var check = wrap.querySelector(".field__check");
        if (!check) return;
        var filled = el.value.trim().length > 0;
        if (el.id === "email") {
          filled = emailOk(el.value);
          if (emailErr) emailErr.hidden = el.value.length === 0 || filled;
        }
        if (el.id === "phone") filled = el.value.replace(/\D/g, "").length >= 10;
        check.hidden = !filled;
      });
      var ok =
        fields[0].value.trim() &&
        fields[1].value.trim() &&
        emailOk(fields[2].value) &&
        fields[3].value.replace(/\D/g, "").length >= 10;
      btn.classList.toggle("btn--disabled", !ok);
      var inSpa = root.id === "spa-outlet";
      if (ok) {
        btn.removeAttribute("aria-disabled");
        btn.setAttribute("href", inSpa ? "#signup-contractor-2" : "signup-contractor-2.html");
      } else {
        btn.setAttribute("aria-disabled", "true");
        btn.removeAttribute("href");
      }
    }

    fields.forEach(function (el) {
      el.addEventListener("input", validate, sig);
      el.addEventListener("blur", validate, sig);
    });
    validate();
    return function () {
      ac.abort();
    };
  }

  function initSignupContractor2(root) {
    var pw = root.querySelector("#pw");
    var btn = root.querySelector("#createBtn");
    var togglePw = root.querySelector("#togglePw");
    if (!pw || !btn) return;

    var ac = new AbortController();
    var sig = { signal: ac.signal };
    var navTimer = null;

    if (togglePw) {
      togglePw.addEventListener(
        "click",
        function () {
          pw.type = pw.type === "password" ? "text" : "password";
          this.textContent = pw.type === "password" ? "Show" : "Hide";
        },
        sig
      );
    }

    function check() {
      var v = pw.value;
      var len = v.length >= 8;
      var num = /\d/.test(v);
      var spec = /[^A-Za-z0-9]/.test(v);
      var rLen = root.querySelector("#r-len");
      var rNum = root.querySelector("#r-num");
      var rSpec = root.querySelector("#r-spec");
      if (rLen) rLen.classList.toggle("met", len);
      if (rNum) rNum.classList.toggle("met", num);
      if (rSpec) rSpec.classList.toggle("met", spec);
      var score = [len, num, spec].filter(Boolean).length + (v.length >= 12 ? 1 : 0);
      score = Math.min(4, score);
      for (var i = 0; i < 4; i++) {
        var seg = root.querySelector("#s" + i);
        if (seg) seg.classList.toggle("on", i < score);
      }
      var ok = len && num && spec;
      btn.classList.toggle("btn--disabled", !ok);
      btn.disabled = !ok;
    }

    pw.addEventListener("input", check, sig);
    btn.addEventListener(
      "click",
      function () {
        if (btn.disabled) return;
        btn.textContent = "Creating…";
        btn.classList.add("btn--disabled");
        navTimer = setTimeout(function () {
          navTimer = null;
          if (window.MockupRouter && window.MockupRouter.go) {
            window.MockupRouter.go("wizard-welcome");
          } else {
            location.href = "wizard-welcome.html";
          }
        }, 900);
      },
      sig
    );
    check();
    return function () {
      ac.abort();
      if (navTimer) clearTimeout(navTimer);
    };
  }

  function initWizardReq1(root) {
    var chips = root.querySelectorAll(".mat-chip");
    var mat = root.querySelector("#mat");
    if (!chips.length || !mat) return;

    var ac = new AbortController();
    chips.forEach(function (b) {
      b.addEventListener(
        "click",
        function () {
          mat.value = b.textContent;
        },
        { signal: ac.signal }
      );
    });
    return function () {
      ac.abort();
    };
  }

  var INIT_BY_SLUG = {
    splash: initSplash,
    onboard: initOnboarding,
    onboarding: initOnboarding,
    "role-select": initRoleSelect,
    "signup-contractor": initSignupContractor,
    "signup-contractor-2": initSignupContractor2,
    "wizard-req-1": initWizardReq1
  };

  window.MockupRouteInits = {
    teardown: teardown,

    /**
     * Run init for slug inside root; stacks destroy with handoff teardown.
     */
    afterNavigate: function (slug, root) {
      var initFn = INIT_BY_SLUG[slug];
      if (initFn) {
        var d = initFn(root);
        setDestroy(d);
      }
      if (slug === "wizard-ai-handoff" && typeof window.SourcedInitHandoffLive === "function") {
        window.SourcedInitHandoffLive(root);
      }
    },

    /**
     * Standalone pages: call from DOMContentLoaded with page slug.
     */
    runStandalone: function (slug) {
      if (document.getElementById("spa-outlet")) return;
      var root = document.querySelector(".catalog-main") || document.body;
      teardown();
      var initFn = INIT_BY_SLUG[slug];
      if (initFn) {
        var d = initFn(root);
        setDestroy(d);
      }
    }
  };
})();
