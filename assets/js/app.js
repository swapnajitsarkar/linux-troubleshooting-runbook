/* ── Linux Troubleshooting Runbook — app.js ── */

document.addEventListener("DOMContentLoaded", () => {

  // ── Navigation ─────────────────────────────────

  const navItems  = document.querySelectorAll(".nav-item[data-page]");
  const pages     = document.querySelectorAll(".page");

  function showPage(id) {
    pages.forEach(p => p.classList.toggle("active", p.id === id));
    navItems.forEach(n => n.classList.toggle("active", n.dataset.page === id));
    window.scrollTo(0, 0);
  }

  navItems.forEach(item => {
    item.addEventListener("click", () => showPage(item.dataset.page));
  });

  // home-card shortcuts
  document.querySelectorAll(".home-card[data-page]").forEach(card => {
    card.addEventListener("click", () => showPage(card.dataset.page));
  });

  // ── Accordion ──────────────────────────────────

  document.querySelectorAll(".scenario-header").forEach(header => {
    header.addEventListener("click", () => {
      const scenario = header.closest(".scenario");
      scenario.classList.toggle("open");
    });
  });

  // ── Search ─────────────────────────────────────

  const searchInput = document.getElementById("sidebar-search");

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();

    if (!q) {
      // restore everything
      document.querySelectorAll(".scenario").forEach(s => {
        s.style.display = "";
        restoreText(s);
      });
      document.querySelectorAll(".mistake-card").forEach(c => {
        c.style.display = "";
        restoreText(c);
      });
      return;
    }

    // search across all scenarios
    document.querySelectorAll(".scenario").forEach(s => {
      const text = s.innerText.toLowerCase();
      s.style.display = text.includes(q) ? "" : "none";
      if (text.includes(q)) {
        restoreText(s);
        highlightText(s, q);
        s.classList.add("open");
      }
    });

    // search mistakes
    document.querySelectorAll(".mistake-card").forEach(c => {
      const text = c.innerText.toLowerCase();
      c.style.display = text.includes(q) ? "" : "none";
      if (text.includes(q)) {
        restoreText(c);
        highlightText(c, q);
      }
    });

    // switch to the page that has visible results
    const visibleScenario = document.querySelector(".scenario[style='']");
    if (visibleScenario) {
      const page = visibleScenario.closest(".page");
      if (page) showPage(page.id);
    }
  });

  function highlightText(node, q) {
    if (node.nodeType === Node.TEXT_NODE) {
      const idx = node.textContent.toLowerCase().indexOf(q);
      if (idx === -1) return;
      const span = document.createElement("span");
      span.innerHTML =
        escapeHtml(node.textContent.slice(0, idx)) +
        "<mark>" + escapeHtml(node.textContent.slice(idx, idx + q.length)) + "</mark>" +
        escapeHtml(node.textContent.slice(idx + q.length));
      node.parentNode.replaceChild(span, node);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      !["SCRIPT","STYLE","MARK"].includes(node.tagName)
    ) {
      Array.from(node.childNodes).forEach(child => highlightText(child, q));
    }
  }

  function restoreText(el) {
    el.querySelectorAll("mark").forEach(m => {
      m.replaceWith(document.createTextNode(m.textContent));
    });
    // also undo any span wrappers we created
    el.querySelectorAll("span[data-restore]").forEach(s => {
      s.replaceWith(document.createTextNode(s.textContent));
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // ── Default page ───────────────────────────────
  showPage("home");
});
