let genMembers;

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

const contentdiv = document.getElementById("members");

async function load() {
  const enDBMembers = await dbRW("r", "members");
  if (typeof enDBMembers !== "string" || enDBMembers.length === 0) return;
  const dBMembers = atob(enDBMembers);
  genMembers = JSON.parse(dBMembers);
  let i = 0
  genMembers.forEach(member => {
const membercard = document.createElement("div");
const img = document.createElement("img");
const name = document.createElement("p");
const pronouns = document.createElement("p");


    name.textContent = member.content.name;
    contentdiv.appendChild(membercard);
    membercard.id = "membercard";
    membercard.style = "border-color: " + member.content.color + ";";
    img.src = "https://spaces.apparyllis.com/avatars/" + member.content.uid + "/" + member.content.avatarUuid
    img.style = "border-radius: 100%; height: 100px"
    pronouns.textContent = member.content.pronouns

membercard.appendChild(img);
membercard.appendChild(name);
membercard.appendChild(pronouns);

    i = i + 1
  });
}

document.addEventListener("DOMContentLoaded", load());
