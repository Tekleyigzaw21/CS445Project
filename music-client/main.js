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
        <table class='table' id="firstTable">
        <thead>
        <tr>
        <th scope='col'>id</th>
        <th scope='col'>title</th>
        <th scope='col'>releaseDate</th>
        <th scope='col'>Actions</th>
        </tr>
        </thead>
        <tbody id="table-body">
        `;
      musicDB.forEach((musicObj) => {
        html += `
        <tr>
        <th scope="row" >${musicDB.indexOf(musicObj) + 1}</th>
        <td id="byTitle">${musicObj.title}</td>
        <td>${musicObj.releaseDate}</td>
        <td><button id='addBtn' onclick='addByIcon()'>
        <img src="./images/plusIcon.webp" alt="Icon" style="width:30px" id ='plusicon'/>
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
    <table class='table' id="scondTable">
    <thead>
    <tr>
    <th scope='col'>index</th>
    <th scope='col'>title</th>
    <th scope='col'>Actions</th>
    </tr>
    </thead>
    <tbody id="table-body">
    `;
      playlistDB.forEach((playlistObj) => {
        html += `
    <tr id="tr${playlistObj.id}" ">
    <th scope="row" >${playlistDB.indexOf(playlistObj) + 1}</th>
    <td >${playlistObj.title}</td>
    <td id="deletePlay" style="padding-left:30px"><button onclick='removeMusic(${
      playlistObj.id
    })'>
      <img src="./images/cross.jpg" alt="Delet" style="width:30px;">
     </button>
     <button onclick='playMusic(${playlistObj.id})'>
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
// function addByIcon() {
// let table = document.getElementById("firstTable");
// let playTable = document.getElementById("scondTable");
// let row = playTable.insertRow(playTable.length);
// let cell1 = row.insertCell(0);
// let cell2 = row.insertCell(1);
// let cell3 = row.insertCell(2);
//let cell4 = row.insertCell(3);
// let tr1 = table.getElementsByTagName("tr");
// let td1 = tr1.getElementsByTagName("td");
// let tr2 = playTable.getElementsByTagName("tr");
// let td2 = tr2.getElementsByTagName("td");
// cell1.innerHTML = td1[0].innerHTML;
// cell2.innerHTML = td1[1].innerHTML;
// cell3.innerHTML = td2[2].innerHTML;
// cell4.innerHTML = td[3].innerHTML;

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
  })
    .then((response) => response.json())
    .then((playlistDB) => {
      console.log("button", document.getElementById("addBtn"));
      let count = 1;

      playlistDB.forEach((playlistObj) => {
        if (!playlistDB.includes(playlistObj.title)) {
          if (playlistObj.title === title) {
            count++;
            playlistDB.push(playlistObj.title);
          }

          addedPart += `
  <tr>
  <th scope="row" >${playlistDB.indexOf(playlistObj) + 1}</th>
  <td >${playlistObj.title}</td>
  <td id="deletePlay" style="padding-left:30px"><button onclick='removeMusic(${
    playlistObj.id
  })'>
  <img src="./images/cross.jpg" alt="Delet" style="width:30px;">
   </button>
   <button onclick='playMusic(${playlistObj.id})'>
   <img src="./images/playIcon.jpg" alt="play" style="width:30px">
  </button></td>
  </tr>
  `;
          document.getElementById("table-body").innerHTML += addedPart;
        }
      });
    });
}

function removeMusic(id) {
  //playTable.deleteRow(0);
  fetch(`${SERVER_ROOT}/api/playlist/remove`, {
    method: "POST",
    //body: JSON.stringify({}),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(id).remove();
    });
}

function playMusic() {}

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
  addByIcon("addBtn");
}

function notLogin() {
  document.getElementById("search").style.display = "none";
  document.getElementById("logout-div").style.display = "none";
  document.getElementById("login-div").style.display = "block";
  document.getElementById("content").innerHTML = "Welcome to MIU Station";
  document.getElementById("musiclist").style.display = "none";
  document.getElementById("playlists").style.display = "none";
  document.getElementById("favoriteMusic").style.display = "none";
}
