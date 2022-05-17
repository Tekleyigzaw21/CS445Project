const SERVER_ROOT = "http://localhost:3000";
window.onload = function () {
  if (localStorage.getItem("accessToken")) {
    afterLogin();
  } else {
    notLogin();
  }

  document.getElementById("loginBtn").onclick = function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${SERVER_ROOT}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => loggedInFeatures(data));
  };

  document.getElementById("logoutBtn").onclick = function () {
    localStorage.removeItem("accessToken");
    notLogin();
  };
  document.getElementById("searchBtn").onclick = function () {
    let txtValue;
    let searchInput = document.getElementById("search-input");
    let filter = searchInput.value.toUpperCase();
    let table = document.getElementById("firstTable");
    let tr = table.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };
};

function loggedInFeatures(data) {
  if (data.status) {
    document.getElementById("errormessage").innerHTML = data.message;
  } else {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    localStorage.setItem("accessToken", data.accessToken);
    afterLogin();
  }
}

function fetchMusic() {
  fetch(`${SERVER_ROOT}/api/music`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    // .then((songs) => console.log(songs));
    .then((musicDB) => {
      let html = `
        <table class="table id="firstTable">
        <thead>
        <tr>
        <th scope="col">id</th>
        <th scope="col">title</th>
        <th scope="col">releaseDate</th>
        <th scope="col">Actions</th>
        </tr>
        </thead>
        <tbody id="tabody">
        `;
      musicDB.forEach((musicObj) => {
        html += `
        <tr>
        <th scope="row" >${musicDB.indexOf(musicObj) + 1}</th>
        <td id="byTitle">${musicObj.title}</td>
        <td>${musicObj.releaseDate}</td>
        <td><button id="addBtn" onclick="addByIcon('${musicObj.id}')">
        <img src="./images/plusIcon.webp" alt="Icon" style="width:30px" id ="plusicon"/>
        </button></td>
        </tr>
        `;
      });
      html += `
        </tbody>
        </table>
        `;
      document.getElementById("musiclist").innerHTML = html;
    });
}

function fetchPlayList() {
  fetch(`${SERVER_ROOT}/api/playlist`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    // .then((songs) => console.log(songs));
    .then((playlistDB) => {
      let html = `
    <table class="table" id="scondTable">
    <thead>
    <tr>
    <th scope="col">index</th>
    <th scope="col">title</th>
    <th scope="col">Actions</th>
    </tr>
    </thead>
    <tbody id="table-body">
    `;
      playlistDB.forEach((playlistObj) => {
        html += `
    <tr id="tr${playlistObj.songID}">
    <th scope="row" >${playlistDB.indexOf(playlistObj) + 1}</th>
    <td >${playlistObj.title}</td>
    <td id="deletePlay" style="padding-left:30px">
    <button id="rem" data-music="${playlistObj.songID}" 
      onclick="removeMusic('${playlistObj}')">
      <img src="./images/cross.jpg" alt="Delet" style="width:30px;">
     </button>
     <button onclick="playMusic('${playlistObj.urlPath}')">
     <img src="./images/playIcon.jpg" alt="play" style="width:30px">
    </button></td>
    </tr>
    `;
      });
      html += `
    </tbody>
    </table>
    `;
      document.getElementById("playlists").innerHTML = html;
    });
}

function addByIcon(id) {
  fetch(`${SERVER_ROOT}/api/playlist/add`, {
    method: "POST",
    body: JSON.stringify({
      songId: id,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  fetchPlayList();
}

function removeMusic(musicObj) {
  fetch(`${SERVER_ROOT}/api/playlist/remove`, {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then(() => {
      let arr = document.getElementById("table-body");
      //arr.forEach((i) => i.remove());
      arr.remove();
    });

  // let sId = musicObj.getAttribute("data-music");
  // fetch(`${SERVER_ROOT}/api/playlist/remove`, {
  // method: "post",
  // body: JSON.stringify({
  // sId,
  // }),
  // headers: {
  // "Content-Type": "application/json",
  // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  // },
  // });
  // fetchPlayList();
}

function playMusic() {
  let mp3 = document.getElementsByTagName("audio")[0];
  mp3.setAttribute("src= `${playlistDB.urlPath}`");
  mp3.play();
}

function afterLogin() {
  document.getElementById("search").style.display = "block";
  document.getElementById("logout-div").style.display = "block";
  document.getElementById("login-div").style.display = "none";
  fetchMusic();
  document.getElementById("musiclist").style.display = "block";
  fetchPlayList();
  document.getElementById("playlists").style.display = "block";
  document.getElementById("content").innerHTML = "Content of the music";
  document.getElementById("favoriteMusic").style.display = "block";
  document.getElementById("audio").style.display = "block";
  // addByIcon("addBtn");
}

function notLogin() {
  document.getElementById("search").style.display = "none";
  document.getElementById("logout-div").style.display = "none";
  document.getElementById("login-div").style.display = "block";
  document.getElementById("content").innerHTML = "Welcome to MIU Station";
  document.getElementById("musiclist").style.display = "none";
  document.getElementById("playlists").style.display = "none";
  document.getElementById("favoriteMusic").style.display = "none";
  document.getElementById("audio").style.display = "none";
}
