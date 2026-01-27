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


async function saveToken(token) {
    localStorage.setItem("Auth", btoa(token));
    console.log("Token has been saved to localstorage as: " + btoa(token));
    return btoa(token);
};

async function getToken() {
const enctoken = localStorage.Auth;
const token = atob(enctoken);
return token;
}


const submitbtn = document.getElementById("submittoken");
const tokenbox = document.getElementById("tokenin");


async function submitEvent() {
    saveToken(tokenbox.value);
    console.log("Token saved successfully!")
};
 async function retoken() {
    tokenbox.value = await getToken();
    return;
  }

let typingTimer;

tokenbox.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(submitEvent, 2000);
});

document.addEventListener("DOMContentLoaded", retoken);
