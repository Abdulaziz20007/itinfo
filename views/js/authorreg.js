document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      author_first_name: document.getElementById("author_first_name").value,
      author_last_name: document.getElementById("author_last_name").value,
      author_nick_name: document.getElementById("author_nick_name").value,
      author_email: document.getElementById("author_email").value,
      author_phone: document.getElementById("author_phone").value,
      author_password: document.getElementById("author_password").value,
    };

    try {
      const response = await fetch(
        "http://45.138.158.245:3030/api/author/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        window.location.href = "/login";
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  });
});
