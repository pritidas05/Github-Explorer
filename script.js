const API_URL = "https://api.github.com/users/";
const mainContainer = document.getElementById("main"); 
const formElement = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

async function fetchUserData(username) 
{
  try {
    const { data } = await axios(API_URL + username);
    createProfileCard(data);
    fetchUserRepos(username);
  } 
  catch (err) 
  {
    if (err.response.status == 404) 
    {
      createErrorCard("Please provide a valid username.");
    }
  }
}

async function fetchUserRepos(username) 
{
  try {
    const { data } = await axios(API_URL + username + "/repos?sort=created");
    addReposToCard(data);
  } catch (err) {
    createErrorCard("The attempt to get user repositories failed.");
  }
}

function createProfileCard(user) {
  const name = user.name || user.login;
  const bio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
    <div class="card">
      <div>
        <img src="${user.avatar_url}" alt="${name}" class="dp">
      </div>
      <div class="user-info">
        <h2>${name}</h2>
        ${bio}
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repositories</strong></li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;
  mainContainer.innerHTML = cardHTML;
}

function createErrorCard(message) {
  const cardHTML = `
    <div class="card">
      <h1>${message}</h1>
    </div>
  `;
  mainContainer.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposContainer = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoElement = document.createElement("a");
    repoElement.classList.add("repo");
    repoElement.href = repo.html_url;
    repoElement.target = "_blank";
    repoElement.innerText = repo.name;
    reposContainer.appendChild(repoElement);
  });
}

formElement.addEventListener("submit", (e) =>
 {
  e.preventDefault();
  const username = searchInput.value;
  if (username) {
    fetchUserData(username);
    searchInput.value = "";
  }
});