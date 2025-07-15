function generatePortfolio() {
  const name = document.getElementById("name").value;
  const bio = document.getElementById("bio").value;
  const skills = document.getElementById("skills").value.split(",").map(s => s.trim());
  const projects = document.getElementById("projects").value.split("\n").map(p => p.trim());
  const email = document.getElementById("email").value;
  const template = document.getElementById("template").value;
  const photoInput = document.getElementById("photo");
  const resume = document.getElementById("resume").files[0];

  if (photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageURL = e.target.result;
      renderTemplate(template, { name, bio, skills, projects, email, imageURL, resume });
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    renderTemplate(template, { name, bio, skills, projects, email, imageURL: "", resume });
  }
}

function renderTemplate(template, data) {
  let skillsHTML = data.skills.map(skill => `<span class="bg-indigo-500 text-white px-2 py-1 rounded mr-1">${skill}</span>`).join(" ");
  let projectsHTML = data.projects.map(p => `<li>${p}</li>`).join("");
  let photo = data.imageURL ? `<img src="${data.imageURL}" class="w-28 h-28 rounded-full mx-auto mb-4" />` : '';
  let resumeLink = data.resume ? `<p class="mt-4"><strong>Resume:</strong> <a href="#" onclick="alert('Host to enable download.')">Download Resume</a></p>` : '';

  let content = `
    <div class="text-center">
      ${photo}
      <h2 class="text-2xl font-bold">${data.name}</h2>
      <p class="text-gray-600 mb-4">${data.bio}</p>
      <div class="mb-4">${skillsHTML}</div>
      <h3 class="text-lg font-semibold">Projects</h3>
      <ul class="list-disc list-inside">${projectsHTML}</ul>
      <p class="mt-4"><strong>Email:</strong> <a href="mailto:${data.email}" class="text-blue-600">${data.email}</a></p>
      ${resumeLink}
    </div>
  `;

  if (template === "minimal") {
    content = `
      <div class="text-left space-y-2">
        <h2 class="text-xl font-semibold">${data.name}</h2>
        <p>${data.bio}</p>
        <div><strong>Skills:</strong> ${skillsHTML}</div>
        <div><strong>Projects:</strong><ul>${projectsHTML}</ul></div>
        <p><strong>Contact:</strong> ${data.email}</p>
        ${resumeLink}
      </div>
    `;
  }

  document.getElementById("portfolio").innerHTML = content;
}
function generateShareLink() {
  const profileName = prompt("Enter a name to save your profile for sharing (e.g., prashu123):");
  if (!profileName) return;

  const data = {
    name: document.getElementById("name").value,
    bio: document.getElementById("bio").value,
    skills: document.getElementById("skills").value,
    projects: document.getElementById("projects").value,
    email: document.getElementById("email").value,
    template: document.getElementById("template").value
  };

  database.ref("shared/" + profileName).set(data)
    .then(() => {
      const url = `${window.location.origin}${window.location.pathname}?profile=${profileName}`;
      prompt("🔗 Share this link:", url);
    })
    .catch(err => alert("Error generating link: " + err.message));
}


// Theme Toggle
function toggleTheme() {
  const html = document.documentElement;
  if (html.getAttribute("data-theme") === "dark") {
    html.setAttribute("data-theme", "light");
    document.body.classList.remove("bg-gray-900", "text-white");
    document.body.classList.add("bg-gray-100", "text-gray-900");
  } else {
    html.setAttribute("data-theme", "dark");
    document.body.classList.add("bg-gray-900", "text-white");
    document.body.classList.remove("bg-gray-100", "text-gray-900");
  }
}

// Call it on page load
window.onload = () => {
  updateProfileList?.();
  loadSharedProfileFromURL();
};


// HTML & PDF Download
function downloadHTML() {
  const htmlContent = document.getElementById("portfolio").innerHTML;
  const blob = new Blob([`<html><body>${htmlContent}</body></html>`], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "portfolio.html";
  link.click();
}

function downloadPDF() {
  const element = document.getElementById("portfolio");
  html2pdf().from(element).save("portfolio.pdf");
}

// Firebase Save
function saveProfileToFirebase() {
  const profileName = document.getElementById("profileName").value.trim();
  if (!profileName) return alert("Enter a profile name!");

  const data = {
    name: document.getElementById("name").value,
    bio: document.getElementById("bio").value,
    skills: document.getElementById("skills").value,
    projects: document.getElementById("projects").value,
    email: document.getElementById("email").value,
    template: document.getElementById("template").value
  };

  database.ref("profiles/" + profileName).set(data)
    .then(() => alert("☁ Profile saved to Firebase!"))
    .catch(err => alert("Error: " + err.message));
}

// Firebase Load
function loadProfileFromFirebase() {
  const profileName = document.getElementById("profileName").value.trim();
  if (!profileName) return alert("Enter profile name to load!");

  database.ref("profiles/" + profileName).once("value")
    .then(snapshot => {
      if (!snapshot.exists()) return alert("❌ Profile not found!");

      const data = snapshot.val();
      document.getElementById("name").value = data.name;
      document.getElementById("bio").value = data.bio;
      document.getElementById("skills").value = data.skills;
      document.getElementById("projects").value = data.projects;
      document.getElementById("email").value = data.email;
      document.getElementById("template").value = data.template;

      alert("☁ Profile loaded from Firebase!");
    })
    .catch(err => alert("Error: " + err.message));
}
function loadSharedProfileFromURL() {
  const params = new URLSearchParams(window.location.search);
  const profileId = params.get("profile");
  if (!profileId) return;

  database.ref("shared/" + profileId).once("value")
    .then(snapshot => {
      if (!snapshot.exists()) {
        document.getElementById("portfolio").innerHTML = `<p class="text-red-600">❌ Shared profile not found.</p>`;
        return;
      }

      const data = snapshot.val();
      const parsedData = {
        ...data,
        skills: data.skills.split(","),
        projects: data.projects.split("\n"),
        imageURL: "" // no image for shared view
      };

      renderTemplate(data.template, parsedData);
    })
    .catch(err => {
      document.getElementById("portfolio").innerHTML = `<p class="text-red-600">⚠ Error loading profile: ${err.message}</p>`;
    });
}

// Call it on page load
window.onload = () => {
  updateProfileList?.();
  loadSharedProfileFromURL();
};

