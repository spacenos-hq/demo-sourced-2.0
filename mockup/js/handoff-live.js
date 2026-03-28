/**
 * Live clock, terminal feed, and staggered agent cards — wizard-ai-handoff mockup.
 */
(function () {
  var clockInterval = null;
  var termTimeouts = [];
  var agentTimeouts = [];

  function clearAll() {
    if (clockInterval !== null) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
    termTimeouts.forEach(function (id) {
      clearTimeout(id);
    });
    termTimeouts = [];
    agentTimeouts.forEach(function (id) {
      clearTimeout(id);
    });
    agentTimeouts = [];
  }

  window.SourcedDestroyHandoffLive = function () {
    clearAll();
  };

  window.SourcedInitHandoffLive = function (root) {
    if (!root) root = document.body;
    clearAll();

    var clockEl = root.querySelector("#handoffClock");
    function tick() {
      if (!clockEl) return;
      var d = new Date();
      clockEl.textContent = d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      });
    }
    if (clockEl) {
      tick();
      clockInterval = setInterval(tick, 1000);
    }

    var term = root.querySelector("#handoffTerm");
    if (term) {
      term.innerHTML = "";
      var lines = [
        '<span class="t-g">[orchestrator]</span> <span class="t-m">Job SRC-8821 · geofence Providence metro</span>',
        '<span class="t-g">[scout]</span> <span class="t-m">34 suppliers in range · ranking by distance</span>',
        '<span class="t-a">[voice-1]</span> <span class="t-m">Dialing Cranston Building Supply…</span>',
        '<span class="t-g">[enrich]</span> <span class="t-m">Pulled contacts · 3 verified numbers</span>',
        '<span class="t-a">[voice-2]</span> <span class="t-m">SMS thread opened · NE Materials Co.</span>',
        '<span class="t-g">[ledger]</span> <span class="t-m">Outreach logged · awaiting bid window</span>'
      ];
      var i = 0;
      function nextLine() {
        if (i >= lines.length) return;
        var div = document.createElement("div");
        div.className = "handoff-term-line";
        div.innerHTML = lines[i];
        term.appendChild(div);
        term.scrollTop = term.scrollHeight;
        i++;
        var tid = setTimeout(nextLine, 520 + Math.floor(Math.random() * 280));
        termTimeouts.push(tid);
      }
      termTimeouts.push(setTimeout(nextLine, 280));
    }

    var agents = root.querySelectorAll(".handoff-agent");
    if (!agents.length) return;

    var reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      agents.forEach(function (ag) {
        ag.classList.add("is-visible");
      });
      return;
    }

    agents.forEach(function (ag, idx) {
      var ms = 450 + idx * 650;
      var tid = setTimeout(function () {
        ag.classList.add("is-visible");
      }, ms);
      agentTimeouts.push(tid);
    });
  };

  function autoInit() {
    if (document.getElementById("spa-outlet")) return;
    window.SourcedInitHandoffLive(document.body);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }
})();
