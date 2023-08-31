const serverUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  async function fetchAndDisplayArticles() {
    try {
      const response = await fetch(`${serverUrl}/articles`); 
      const articles = await response.json();

      const articleList = document.getElementById("article-list");
      articleList.innerHTML = ""; 

      const memberType = localStorage.getItem("memberType");

      let articleLimit = articles.length; 
      if (memberType === "A") {
        articleLimit = 3;
      } else if (memberType === "B") {
        articleLimit = 10;
      }

      articles.slice(0, articleLimit).forEach((article) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");

        const titleElement = document.createElement("h3");
        titleElement.textContent = article.title;

        const contentElement = document.createElement("p");
        contentElement.textContent = article.content; 

        listItem.appendChild(titleElement);
        listItem.appendChild(contentElement);

        articleList.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }

  fetchAndDisplayArticles();
  const registrationForm = document.getElementById("registration-form");

  if (registrationForm) {
    registrationForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(registrationForm);
      const requestBody = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`${serverUrl}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          window.location.href = "/client/login.html";
        } else {
          alert("Registration failed: " + data.message);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    });
  }

  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const loginData = new FormData(loginForm);
    const loginRequestBody = Object.fromEntries(loginData.entries());

    try {
      const response = await fetch(`${serverUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequestBody),
      });

      const loginResponse = await response.json();
      console.log(loginResponse, "<<<<<<<<<");
      if (response.ok) {
        alert("Login successful");

        localStorage.setItem("memberType", loginResponse.memberType);
        window.location.href = "/client/home.html";
      } else {
        alert("Login failed: " + loginResponse.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });
  const gmailLoginButton = document.getElementById("gmail-login");

  gmailLoginButton.addEventListener("click", () => {
    window.location.href =
      "https://accounts.google.com/o/oauth2/auth?client_id=230730064761-sag6foervcfk3miflkkckki05q1bjmgf.apps.googleusercontent.com&redirect_uri=http://127.0.0.1:5500/client/home.html&response_type=code&scope=email%20profile";
  });

  const facebookLoginButtons = document.querySelectorAll(".facebook-login");

  facebookLoginButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const response = await FB.login();
        if (response.status === "connected") {
          const accessToken = response.authResponse.accessToken;
        } else {
          console.log("Facebook login failed.");
        }
      } catch (error) {
        console.error("Error during Facebook login:", error);
      }
    });
  });

  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("access_token");
    window.location.href = "/client/login.html";
  });
});
