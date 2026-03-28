/**
 * Hash router for mockup/app.html — fetches screen HTML, injects main, rewrites links.
 */
(function () {
  var ROUTES = [
    { slug: "splash", file: "splash.html", title: "Sourced — Splash (mobile mockup)" },
    { slug: "onboard", file: "onboarding.html", title: "Sourced — Onboarding (mockup)", aliases: ["onboarding"] },
    { slug: "role-select", file: "role-select.html", title: "Sourced — Role select (mockup)" },
    { slug: "signup-contractor", file: "signup-contractor.html", title: "Sourced — Sign up (mockup)" },
    { slug: "signup-contractor-2", file: "signup-contractor-2.html", title: "Sourced — Sign up step 2 (mockup)" },
    { slug: "signup-supplier", file: "signup-supplier.html", title: "Sourced — Supplier sign up (mockup)" },
    { slug: "wizard-welcome", file: "wizard-welcome.html", title: "Sourced — Wizard welcome (mockup)" },
    { slug: "wizard-req-1", file: "wizard-req-1.html", title: "Sourced — Wizard material (mockup)" },
    { slug: "wizard-req-2", file: "wizard-req-2.html", title: "Sourced — Wizard delivery (mockup)" },
    { slug: "wizard-ai-handoff", file: "wizard-ai-handoff.html", title: "Sourced — AI handoff (mockup)" },
    { slug: "home", file: "home.html", title: "Sourced — Home dashboard (mockup)" },
    { slug: "new-rfq", file: "new-rfq.html", title: "Sourced — New requirement (mockup)" },
    { slug: "outreach", file: "outreach.html", title: "Sourced — Outreach (mockup)" },
    { slug: "tracker", file: "tracker.html", title: "Sourced — AI Working (mockup)" },
    { slug: "compare", file: "compare.html", title: "Sourced — Compare bids (mockup)" },
    { slug: "confirm", file: "confirm.html", title: "Sourced — Confirm order (mockup)" },
    { slug: "success", file: "success.html", title: "Sourced — Order confirmed (mockup)" },
    { slug: "supplier-dashboard", file: "supplier-dashboard.html", title: "Sourced — Supplier home (mockup)" },
    { slug: "supplier-bid-submit", file: "supplier-bid-submit.html", title: "Sourced — Submit bid (mockup)" },
    { slug: "order-tracking", file: "order-tracking.html", title: "Sourced — Order tracking (mockup)" },
    { slug: "savings-report", file: "savings-report.html", title: "Sourced — Savings report (mockup)" },
    { slug: "notifications", file: "notifications.html", title: "Sourced — Notifications (mockup)" },
    { slug: "settings-account", file: "settings-account.html", title: "Sourced — Account (mockup)" }
  ];

  var slugToRoute = {};
  var fileToSlug = {};

  ROUTES.forEach(function (r) {
    slugToRoute[r.slug] = r;
    fileToSlug[r.file] = r.slug;
    (r.aliases || []).forEach(function (a) {
      slugToRoute[a] = r;
    });
  });

  var cache = new Map();
  var outlet = null;
  var styleSlot = null;

  function normalizeHash() {
    var h = (location.hash || "").replace(/^#/, "").replace(/^\//, "").trim().toLowerCase();
    if (!h) return "splash";
    return h;
  }

  function resolveSlug(raw) {
    var s = String(raw || "")
      .replace(/^#/, "")
      .replace(/^\//, "")
      .trim()
      .toLowerCase();
    if (!s) s = "splash";
    return slugToRoute[s] ? s : null;
  }

  function rewriteLinks(html) {
    return html.replace(/href="([^"]+\.html)"/g, function (_, path) {
      var base = path.split("/").pop();
      if (!fileToSlug[base]) return 'href="' + path + '"';
      return 'href="#' + fileToSlug[base] + '"';
    });
  }

  function applyRouteStyles(doc) {
    if (!styleSlot) return;
    var styles = doc.querySelectorAll("head style");
    var buf = [];
    styles.forEach(function (s) {
      buf.push(s.textContent || "");
    });
    styleSlot.textContent = buf.join("\n");
  }

  function navigate() {
    var slug = normalizeHash();
    var route = slugToRoute[slug];
    if (!route) {
      location.hash = "#splash";
      return;
    }

    if (typeof window.MockupRouteInits !== "undefined") {
      window.MockupRouteInits.teardown();
    }

    var url = route.file;
    var p = cache.has(url)
      ? Promise.resolve(cache.get(url))
      : fetch(url, { credentials: "same-origin" }).then(function (res) {
          if (!res.ok) throw new Error(res.status);
          return res.text();
        });

    p.then(function (text) {
      cache.set(url, text);
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, "text/html");
      applyRouteStyles(doc);

      var main = doc.querySelector("main.catalog-main");
      if (!main) throw new Error("No main.catalog-main in " + url);

      var inner = main.innerHTML;
      inner = rewriteLinks(inner);

      outlet.innerHTML = inner;
      document.title = route.title;

      if (typeof window.DibbsCatalogInitMocks === "function") {
        window.DibbsCatalogInitMocks(outlet);
      }
      if (typeof window.SourcedInitMockMaps === "function") {
        window.SourcedInitMockMaps(outlet);
      }
      if (typeof window.MockupRouteInits !== "undefined") {
        window.MockupRouteInits.afterNavigate(slug, outlet);
      }

      window.scrollTo(0, 0);
    }).catch(function () {
      outlet.innerHTML =
        '<p class="mockup-label" style="padding:24px">Could not load screen. Serve the mockup folder over HTTP (not file://).</p>';
    });
  }

  window.MockupRouter = {
    go: function (slug) {
      var s = resolveSlug(slug);
      if (!s) return;
      location.hash = "#" + s;
    },
    normalizeHash: normalizeHash,
    fileToSlug: fileToSlug
  };

  function boot() {
    outlet = document.getElementById("spa-outlet");
    styleSlot = document.getElementById("spa-route-styles");
    if (!outlet) return;

    if (!location.hash || location.hash === "#" || location.hash === "#/") {
      history.replaceState(null, "", location.pathname + location.search + "#splash");
    }

    window.addEventListener("hashchange", navigate);
    navigate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
