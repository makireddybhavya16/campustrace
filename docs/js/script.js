const API = "https://campustracer.onrender.com/items"

let allItems = []

function generateId() {
  return Date.now()
}

async function loadItems() {
  const res = await fetch(API)
  allItems = await res.json()
  renderItems("all")
}

function renderItems(filter) {
  const container = document.getElementById("items")
  if (!container) return

  container.innerHTML = ""

  let items = allItems

  if (filter !== "all") {
    items = items.filter(i =>
      filter === "unclaimed" ? i.status === "unclaimed" :
      filter === "claimed" ? i.status === "claimed" :
      i.type === filter
    )
  }

  items.forEach(item => {
    const card = document.createElement("div")
    card.className = "item-card"

    card.innerHTML = `
      <div class="item-top">
        <span class="badge ${item.type}">${item.type.toUpperCase()}</span>
        ${item.status === "claimed" ? `<span class="badge claimed">CLAIMED</span>` : ""}
      </div>

      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p class="location">${item.location}</p>
      <small>${item.date}</small>

      ${
        item.status === "claimed" && item.finderContact
          ? `<div class="contact">
              <strong>Finder Contact Details</strong><br>
              Name: ${item.finderContact.name}<br>
              Phone: ${item.finderContact.phone}<br>
              ${item.finderContact.email ? `Email: ${item.finderContact.email}` : ""}
            </div>`
          : ""
      }

      ${
        item.type === "found" && item.status === "unclaimed"
          ? `<a href="claim.html?id=${item.id}" class="claim-btn">Verify & Claim</a>`
          : ""
      }
    `
    container.appendChild(card)
  })
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"))
    btn.classList.add("active")
    renderItems(btn.dataset.filter)
  }
})

document.addEventListener("DOMContentLoaded", () => {

  const lostForm = document.getElementById("lostForm")
  const foundForm = document.getElementById("foundForm")
  const claimForm = document.getElementById("claimForm")

  if (lostForm) {
    lostForm.addEventListener("submit", async e => {
      e.preventDefault()
      const f = e.target

      const item = {
        id: generateId(),
        type: "lost",
        name: f.querySelector("#name").value,
        description: f.querySelector("#description").value,
        location: f.querySelector("#location").value,
        date: f.querySelector("#date").value,
        color: f.querySelector("#color").value,
        brand: f.querySelector("#brand").value,
        identifiers: f.querySelector("#identifiers").value,
        status: "unclaimed"
      }

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      })

      if (res.ok) {
        window.location.href = "browse.html"
      } else {
        alert("Lost item not registered")
      }
    })
  }

  if (foundForm) {
    foundForm.addEventListener("submit", async e => {
      e.preventDefault()
      const f = e.target

      const imageFile = f.querySelector("#itemImage").files[0]
      let image = ""

      if (imageFile) {
        image = await readImage(imageFile)
      }

      const item = {
        id: generateId(),
        type: "found",
        name: f.querySelector("#name").value,
        description: f.querySelector("#description").value,
        image: image,
        location: f.querySelector("#location").value,
        date: f.querySelector("#date").value,
        color: f.querySelector("#color").value,
        brand: f.querySelector("#brand").value,
        identifiers: f.querySelector("#identifiers").value,
        finderContact: {
          name: f.querySelector("#finderName").value,
          phone: f.querySelector("#finderPhone").value,
          email: f.querySelector("#finderEmail").value
        },
        status: "unclaimed"
      }

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      })

      if (res.ok) {
        window.location.href = "browse.html"
      } else {
        alert("Found item not registered")
      }
    })
  }

  if (claimForm) {
    claimForm.addEventListener("submit", async e => {
      e.preventDefault()

      const params = new URLSearchParams(window.location.search)
      const id = params.get("id")

      const res = await fetch(API)
      const items = await res.json()

      let item

      if (id) {
        item = items.find(i => i.id == id)
      } else {
        item = [...items].reverse().find(i => i.type === "found" && i.status === "unclaimed")
      }

      if (!item) {
        alert("Item not found")
        return
      }

      item.status = "claimed"

      const update = await fetch(`${API}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      })

      if (!update.ok) {
        alert("Failed to claim item")
        return
      }

      alert("Successfully claimed. Finder contact details unlocked.")
      window.location.href = "browse.html"
    })
  }

  loadItems()
})
