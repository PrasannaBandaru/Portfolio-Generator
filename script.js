function applyTheme() {
  const theme = document.getElementById('themeSelector').value;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function applyAccent() {
  const color = document.getElementById('colorSelector').value;
  document.body.setAttribute('data-accent', color);
  localStorage.setItem('accent', color);
}

function applyFont() {
  const font = document.getElementById('fontSelector').value;
  document.body.setAttribute('data-font', font);
  localStorage.setItem('font', font);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  document.getElementById('themeSelector').value = newTheme;
}

function generatePortfolio() {
  const layout = document.getElementById('layoutSelector').value;

  const fullName = document.getElementById('fullName').value;
  const tagline = document.getElementById('tagline').value;
  const jobRole = document.getElementById('jobRole').value;
  const email = document.getElementById('email').value;
  const contact = document.getElementById('contact').value;
  const github = document.getElementById('github').value;
  const linkedin = document.getElementById('linkedin').value;
  const birthday = document.getElementById('birthday').value;
  const gender = document.getElementById('gender').value;
  const projectList = document.getElementById('projects').value.split('\n');

  let projectHTML = "<ul>";
  projectList.forEach(line => {
    const [title, desc] = line.split(" - ");
    if (title) {
      projectHTML += `<li><strong>${title}</strong>: ${desc || ""}</li>`;
    }
  });
  projectHTML += "</ul>";

  const output = `
    <div class="output-card ${layout}">
      <h2>${fullName}</h2>
      <p><em>${tagline}</em></p>
      <p><strong>Role:</strong> ${jobRole}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${contact ? `<p><strong>Contact:</strong> ${contact}</p>` : ""}
      <p><strong>GitHub:</strong> <a href="${github}" target="_blank">${github}</a></p>
      <p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank">${linkedin}</a></p>
      <p><strong>Birthday:</strong> ${birthday}</p>
      <p><strong>Gender:</strong> ${gender}</p>
      <h3>Projects</h3>
      ${projectHTML}
    </div>
  `;
  document.getElementById('output').innerHTML = output;
}

// Load saved theme and preferences
window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme') || 'light';
  const accent = localStorage.getItem('accent') || 'blue';
  const font = localStorage.getItem('font') || 'sans-serif';

  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-accent', accent);
  document.body.setAttribute('data-font', font);

  document.getElementById('themeSelector').value = theme;
  document.getElementById('colorSelector').value = accent;
  document.getElementById('fontSelector').value = font;
});
