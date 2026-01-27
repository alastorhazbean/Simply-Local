let apiurl = "https://api.apparyllis.com";
let websocketurl = "wss://api.apparyllis.com/v1/socket";
let sysinfo;
let gtoken;
let uid;
let config;
let members;


async function dbRW(func, name, content = null) {
  const db = await openDB();
  const tx = db.transaction("store", func === "w" ? "readwrite" : "readonly");
  const store = tx.objectStore("store");

  return new Promise((resolve, reject) => {
    const req =
      func === "w"
        ? store.put(content, name)
        : store.get(name);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("simply-local", 1);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("store")) {
        db.createObjectStore("store");
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function apiRequest(method, params, endpoint) {
const myHeaders = new Headers();
myHeaders.append("Authorization", atob(localStorage.Auth));
  if (method === "get") {
    const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};
    return await fetch(apiurl + "/v1/" + endpoint, requestOptions);

  }
}



async function getSystemID() {
 const fetchres = await apiRequest("get", "na", "me")
 sysinfo = await fetchres.json();
 return sysinfo.id
};

async function getMembers() {
  const fetchres = await apiRequest("get", "na", "members/" + atob(localStorage.uid));
 return fetchres.json();
}


async function getMemberByName(membername) {
  const updatedmembers = await getMembers();
  members = updatedmembers;;
  console.log("Updated Members!");
  const memberinfo = members.find(m => m.content.name === membername);
  return memberinfo;
};


async function getMemberByID(id) {
  const updatedmembers = await getMembers();
  members = updatedmembers;;
  console.log("Updated Members!");
  const fetchres = await apiRequest("get", "na", "member/" + uid + "/" + id);
  return fetchres.json();
};

async function load() {
 console.log("Loading...")
//const configfetch = await fetch("/config.json");
//config = await configfetch.json();
//uid = await getSystemID(localStorage.Auth) //config.token);
//members = await getMembers()
 uid = await getSystemID();
 localStorage.setItem("uid", btoa(uid));
 members = await getMembers();
 await dbRW("w", "members", btoa(JSON.stringify(members)));


 console.log("Loading done!")
 console.log("UID:" + atob(localStorage.uid))
 if (!members) {
   console.error("Failed to get members.")
 }else {
   console.log("Members gathered!")
 }
};


 document.addEventListener("DOMContentLoaded", load);
