async function getUsers() {
  const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/main/${GITHUB_FILE_PATH}`);
  return await response.json();
}

async function updateUsers(users) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
  const getRes = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  });
  const { sha } = await getRes.json();
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(users, null, 2))));

  await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "update user data",
      content: content,
      sha: sha
    })
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const regForm = document.getElementById("registerForm");
  if (regForm) {
    regForm.onsubmit = async (e) => {
      e.preventDefault();
      const form = new FormData(regForm);
      const newUser = {
        username: form.get("username"),
        password: form.get("password"),
        whatsapp: form.get("whatsapp"),
        bank: form.get("bank"),
        rekening: form.get("rekening"),
        nama: form.get("nama"),
        saldo: 0
      };
      try {
        const users = await getUsers();
        if (users.find(u => u.username === newUser.username)) {
          alert("Username sudah terdaftar.");
          return;
        }
        users.push(newUser);
        await updateUsers(users);
        alert("Pendaftaran berhasil. Silakan login.");
        location.href = "login.html";
      } catch (err) {
        console.error("Gagal mendaftar:", err);
        alert("Terjadi kesalahan saat mendaftar. Coba lagi nanti.");
      }
    };
  }
});
