async function getAuthors() {
  let accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    window.location.href = "/login";
  }
  console.log("Access token", accessToken);
  const accessTokenExpTime = getTokenExpiration(accessToken);
  console.log("Exp time", accessTokenExpTime);

  if (accessTokenExpTime) {
    const currentTime = new Date();
    if (currentTime < accessTokenExpTime) {
      console.log("Access token faol");
    } else {
      console.log("Access token muddati o'tdi");
      accessToken = await refreshTokenFunc();
    }
  }

  try {
    fetch("http://45.138.158.245:3030/api/author", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          console.log("Success");
          return res.json();
        } else {
          console.error("Failed");
          return res.json().then((err) => {
            throw err;
          });
        }
      })
      .then((data) => {
        console.log(data);
        data.authors.forEach((element) => {
          document.getElementById("author-container").innerHTML += `
                <div class="col">
                    <div class="card h-100 shadow-sm hover-shadow">
                        <img src="${element.author_photo}" class="card-img-top object-fit-cover" style="height: 200px;" alt="Author photo" />
                        <div class="card-body text-center">
                            <h5 class="card-title fw-bold mb-2">${element.author_first_name} ${element.author_last_name}</h5>
                            <p class="card-text text-muted">@${element.author_nick_name}</p>
                        </div>
                    </div>
                </div>
                `;
        });
      })
      .catch((err) => {
        console.error("An error occurred:", err);
      });
  } catch (err) {
    console.log("Unexpected error:", err);
  }
}
getAuthors();

function getTokenExpiration(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  if (decodedToken.exp) {
    return new Date(decodedToken.exp * 1000);
  } else null;
}

async function refreshTokenFunc(token) {
  try {
    const response = await fetch(
      "http://45.138.158.245:3030/api/author/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.error && data.error == "jwt expired") {
      console.log("Refresh token expired");
      return window.location.replace("/login");
    }
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (err) {
    console.log(err);
    return window.location.replace("/login");
  }
}
