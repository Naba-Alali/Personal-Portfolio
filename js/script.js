

// Sets the website theme (light or dark) and stores preference in localStorage
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}



// ===== On load =====
const savedTheme = localStorage.getItem("theme");
if (savedTheme) setTheme(savedTheme);

document.getElementById("year").textContent = new Date().getFullYear();


// Toggle theme when user clicks theme button
document.getElementById("themeBtn").addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "light" ? "dark" : "light");
});

// Opens modal and dynamically updates content based on selected project
function showProject(projectName) {
  const modal = document.getElementById("projectModal");
  const meta = document.getElementById("modalMeta");
  const title = document.getElementById("modalTitle");
  const desc = document.getElementById("modalDescription");
  const highlights = document.getElementById("modalHighlights");
  const tags = document.getElementById("modalTags");

  if (!modal || !meta || !title || !desc || !highlights || !tags) return;

  const projects = {
    "Horse App": {
      meta: "2025 • Full-stack database application",
      title: "Horse Racing Database System",
      description:
        "A database-driven system designed to manage horse races, trainers, stables, and administrative records. The project focused on organizing racing data in a clear and structured way while supporting both admin and guest access.",
      highlights: [
        "Designed a relational database structure for race tracking and management",
        "Implemented role-based access for Admin and Guest users",
        "Combined database logic with a clean interface for easier data interaction"
      ],
      tags: ["Python", "SQL", "Database"]
    },

    "Club Zone": {
      meta: "2026 • UI/UX and platform concept",
      title: "Club Zone",
      description:
        "A student club management platform that connects students, clubs, and events in one place. The project focused on improving communication, accessibility, and user experience through a clean and organized interface.",
      highlights: [
        "Designed the platform structure and user journey for students and clubs",
        "Created UI/UX screens in Figma with focus on clarity and usability",
        "Improved event discovery and club interaction through a unified interface"
      ],
      tags: ["UI/UX", "Figma", "Java"]
    }
  };

  const project = projects[projectName];

  if (!project) return;

  meta.textContent = project.meta;
  title.textContent = project.title;
  desc.textContent = project.description;

  highlights.innerHTML = "";
  project.highlights.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    highlights.appendChild(li);
  });

  tags.innerHTML = "";
  project.tags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    tags.appendChild(span);
  });

  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("projectModal");
  if (modal) modal.style.display = "none";
}

window.showProject = showProject;
window.closeModal = closeModal;

function closeModal() {
  // close when clicking outside the modal-content OR on close button
  const modal = document.getElementById("projectModal");
  if (modal) modal.style.display = "none";
}

// IMPORTANT: expose functions for inline onclick=""
window.showProject = showProject;
window.closeModal = closeModal;




// ===== Contact form validation (no backend) =====
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

function showError(id, msg) {
  document.getElementById(id).textContent = msg;
}

function clearErrors() {
  showError("nameErr", "");
  showError("emailErr", "");
  showError("msgErr", "");
}

// Contact form validation (client-side only, no backend)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();
  statusEl.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  let ok = true;

  if (name.length < 2) {
    showError("nameErr", "Name must be at least 2 characters.");
    ok = false;
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValid) {
    showError("emailErr", "Please enter a valid email address.");
    ok = false;
  }

  if (message.length < 5) {
    showError("msgErr", "Message must be at least 5 characters.");
    ok = false;
  }

  if (ok) {
  // Show loading message first
  statusEl.textContent = "Sending...";

  setTimeout(() => {
    statusEl.textContent = "✅ Message sent!";
    form.reset();
  }, 1000);

} else {
  statusEl.textContent = "⚠️ Please fix the errors above.";
}
});



// ===== Scroll to top button =====
const toTopBtn = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  toTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    // update active button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // show/hide projects
    projectCards.forEach((card) => {
      const category = card.dataset.category;

      if (filter === "all" || category === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});


// ===== Typing Effect =====
const codeEl = document.getElementById("codeContent");

const codeLines = [
  { n: 1, html: `<span class="kw">const</span> <span class="var">Naba</span> = {` },
  { n: 2, html: `  role: <span class="str">'Software Engineering Student'</span>,` },
  { n: 3, html: `  focus: [<span class="str">'web'</span>, <span class="str">'ui/ux'</span>, <span class="str">'frontend'</span>],` },
  { n: 4, html: `  skills: [<span class="str">'HTML'</span>, <span class="str">'CSS'</span>, <span class="str">'JavaScript'</span>],` },
  { n: 5, html: `  location: <span class="str">'Dhahran'</span>,` },
  { n: 6, html: `  loves: <span class="str">'clean design + good user experience'</span>,` },
  { n: 7, html: `  status: <span class="str">'building better projects'</span>` },
  { n: 8, html: `};` },
  { n: 9, html: `<span class="var">Naba</span>.<span class="fn">create</span>();` }
];

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function tokenizeLine(html) {
  const tokens = [];
  const regex = /(<span class="[^"]+">.*?<\/span>)/g;
  const parts = html.split(regex).filter(Boolean);

  for (const part of parts) {
    if (part.startsWith('<span')) {
      tokens.push(part);
    } else {
      for (const ch of part) {
        tokens.push(escapeHtml(ch));
      }
    }
  }
  return tokens;
}

function renderLines(lines) {
  const rendered = lines.map(line => {
    return `<span class="line-num">${line.n}</span> ${line.visible.join("")}`;
  });

  codeEl.innerHTML = rendered.join("<br>");
}

function startTypingLoop() {
  if (!codeEl) return;

  const lines = codeLines.map(line => ({
    n: line.n,
    tokens: tokenizeLine(line.html),
    visible: []
  }));

  let lineIndex = 0;
  let tokenIndex = 0;

  codeEl.innerHTML = "";

  function typeStep() {
    if (lineIndex >= lines.length) {
      // ⏱️ ينتظر 30 ثانية ثم يعيد
      setTimeout(() => {
        startTypingLoop();
      }, 10000);
      return;
    }

    const currentLine = lines[lineIndex];

    if (tokenIndex < currentLine.tokens.length) {
      currentLine.visible.push(currentLine.tokens[tokenIndex]);
      tokenIndex++;

      renderLines(lines.slice(0, lineIndex + 1));

      setTimeout(typeStep, 35); // 🐢 سرعة أبطأ
    } else {
      lineIndex++;
      tokenIndex = 0;

      renderLines(lines.slice(0, lineIndex));

      setTimeout(typeStep, 200); // ⏸️ توقف بين السطور
    }
  }

  typeStep();
}

startTypingLoop();