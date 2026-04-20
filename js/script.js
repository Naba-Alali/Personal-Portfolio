

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
  const title = document.getElementById("modalTitle");
  const desc = document.getElementById("modalDescription");

  if (!modal || !title || !desc) {
    console.error("Modal elements not found. Check IDs in index.html");
    return;
  }

  if (projectName === "Horse App") {
    title.textContent = "Horse Racing Database System";
    desc.innerHTML = `
      <strong>Type:</strong> University Course Project<br><br>
      <strong>Technologies:</strong> Python, SQL, Database Design<br><br>
      <strong>Description:</strong> A system designed to manage horse races, trainers, and stables.
      Includes administrative controls and guest viewing features.<br><br>
      <strong>What I Learned:</strong> Database structure design and UI layout planning.
    `;
  } else if (projectName === "Club Zone") {
    title.textContent = "Club Zone";
    desc.innerHTML = `
      <strong>Type:</strong> University Course Project<br><br>
      <strong>Technologies:</strong> Java, Figma, UX/UI Design<br><br>
      <strong>Description:</strong> A student club management platform allowing users to join clubs,
      explore events, and manage activities.<br><br>
      <strong>What I Learned:</strong> Front-end structuring and responsive design.
    `;
  } else {
    title.textContent = projectName;
    desc.textContent = "Details coming soon.";
  }

  modal.style.display = "flex";
}

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
