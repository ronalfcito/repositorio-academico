async function login() {

  const username =
    document.getElementById("user").value;

  const password =
    document.getElementById("pass").value;

  const response = await fetch(
    "/api/login",
    {
      method: "POST",
      headers: {
        "Content-Type":
        "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }
  );

  const data = await response.json();

  if(data.success){

    alert("Bienvenido");

    cargarApuntes();

  }else{

    alert("Credenciales incorrectas");

  }
}

async function cargarApuntes(){

  const response =
    await fetch("/api/get-apuntes");

  const apuntes =
    await response.json();

  let html = "";

  apuntes.forEach(a => {

    html += `
      <div class="card">
        <h2>${a.titulo}</h2>
        <p>${a.contenido}</p>
      </div>
    `;

  });

  document.getElementById(
    "contenido"
  ).innerHTML = html;
}