let url = "/canciones";
let tbody = document.getElementById("cuerpo");
let cancion = document.getElementById("cancion");
let artist = document.getElementById("artist");
let key = document.getElementById("key");

let canciones = [];
window.onload = getData();

async function getData() {
  await axios.get(url).then((data) => {
    canciones = data.data;
    tbody.innerHTML = "";
    canciones.forEach((c, i) => {
      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${c.title}</td>
          <td>${c.artist}</td>
          <td>${c.key}</td>
          <td>
            <button class="btn btn-warning" onclick="prepararCancion(${i},'${c.id
        }')">Editar</button>
            <button class="btn btn-danger" onclick="eliminarCancion(${i},'${c.id
        }')">Eliminar</button>
          </td>
        </tr>
      `;
    });
  });
  cancion.value = "";
  artist.value = "";
  key.value = "";
}

function nuevaCancion() {
  cancion;
  artist;
  key;

  const id = Math.floor(Math.random() * 9999)
  let data = {
    id,
    title: cancion.value,
    artist: artist.value,
    key: key.value,
  };

  if (data.title === "" || data.artist === "" || data.key === "") {
    alert("Title, artist and key are required to add a new song.");
  } else {
    axios.post(url, data).then(() => getData());
  }
}

function eliminarCancion(i, id) {
  axios.delete(url + "/" + id).then(() => {
    alert("Canción " + canciones[i].title + " eliminada");
    getData();
  });
}

function prepararCancion(i, id) {
  cancion.value = canciones[i].title;
  artist.value = canciones[i].artist;
  key.value = canciones[i].key;
  document
    .getElementById("editar")
    .setAttribute("onclick", `editarCancion('${id}')`);
  document.getElementById("agregar").style.display = "none";
  document.getElementById("editar").style.display = "block";
}

function editarCancion(id) {
  if (cancion.value === "" || artist.value === "" || key.value === "") {
    alert("Title, artist and key are required to modify the existing song.");
  } else {

    axios
      .put(url + "/" + id, {
        id,
        title: cancion.value,
        artist: artist.value,
        key: key.value,
      })
      .then(() => {
        getData();
        document.getElementById("agregar").style.display = "block";
        document.getElementById("editar").style.display = "none";
      });
  }
}