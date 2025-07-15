function generatePortfolio() {
  const name = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const skills = document.getElementById("skills").value.trim();
  const projects = document.getElementById("projects").value.trim();
  const email = document.getElementById("email").value.trim();
  const template = document.getElementById("template").value;

  if (!name || !bio || !skills || !projects || !email) {
    alert("⚠️ Please fill all fields before generating your portfolio.");
    return;
  }

  const skillsList = skills
    .split(',')
    .map(skill => `<li class="text-sm">${skill.trim()}</li>`)
    .join('');

  const projectsList = projects
    .split('\n')
    .map(project => `<li class="text-sm">${project.trim()}</li>`)
    .join('');

  const outputHTML = `
    <div class="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h1 class="text-3xl font-bold text-blue-700">${name}</h1>
      <p class="mt-2 text-gray-700">${bio}</p>

      <div class="mt-4">
        <h2 class="text-xl font-semibold text-gray-800">Skills</h2>
        <ul class="list-disc ml-6 mt-2 text-gray-600">${skillsList}</ul>
      </div>

      <div class="mt-4">
        <h2 class="text-xl font-semibold text-gray-800">Projects</h2>
        <ul class="list-disc ml-6 mt-2 text-gray-600">${projectsList}</ul>
      </div>

      <p class="mt-4 text-gray-700">📧 <strong>Contact:</strong> <a href="mailto:${email}" class="text-blue-600 underline">${email}</a></p>
    </div>
  `;

  document.getElementById("output").innerHTML = outputHTML;
}

function toggleTheme() {
  const body = document.body;
  const checkbox = document.getElementById("themeToggle");
  const thumb = document.getElementById("toggleThumb");

  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    checkbox.checked = true;
    thumb.style.transform = "translateX(24px)";
  } else {
    localStorage.setItem("theme", "light");
    checkbox.checked = false;
    thumb.style.transform = "translateX(0)";
  }
}

// Load saved theme on startup
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const thumb = document.getElementById("toggleThumb");
  const checkbox = document.getElementById("themeToggle");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    checkbox.checked = true;
    if (thumb) thumb.style.transform = "translateX(24px)";
  } else {
    checkbox.checked = false;
    if (thumb) thumb.style.transform = "translateX(0)";
  }
});
