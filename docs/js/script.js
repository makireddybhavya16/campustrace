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
              <strong>Finder Contact</strong><br>
              ${item.finderContact.name}<br>
              ${item.finderContact.phone}<br>
              ${item.finderContact.email || ""}
            </div>`
          : ""
      }

      ${
        item.status === "unclaimed"
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

function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(" ")
    .filter(w => w.length > 2)
}

function keywordOverlap(a, b) {
  if (!a || !b) return false
  const x = extractKeywords(a)
  const y = extractKeywords(b)
  return x.some(w => y.includes(w))
}

async function submitClaim(event) {
  event.preventDefault()

  const params = new URLSearchParams(window.location.search)
  const itemId = params.get("id")

  const res = await fetch(API)
  const items = await res.json()
  const foundItem = items.find(i => i.id == itemId)

  if (!foundItem) {
    alert("Item not found")
    return
  }

  const userColor = document.getElementById("color").value
  const userBrand = document.getElementById("brand").value
  const userIdentifiers = document.getElementById("identifiers").value
  const userLocation = document.getElementById("location").value

  const claimerName = document.getElementById("claimerName").value
  const claimerPhone = document.getElementById("claimerPhone").value
  const claimerEmail = document.getElementById("claimerEmail").value

  let score = 0

  if (keywordOverlap(foundItem.color, userColor)) score += 2
  if (keywordOverlap(foundItem.identifiers, userIdentifiers)) score += 2
  if (keywordOverlap(foundItem.location, userLocation)) score += 1
  if (keywordOverlap(foundItem.brand, userBrand)) score += 1

  if (score >= 3) {
    foundItem.status = "claimed"
    foundItem.claimerContact = {
      name: claimerName,
      phone: claimerPhone,
      email: claimerEmail
    }

    await fetch(`${API}/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foundItem)
    })

    alert("Verification successful. Contact details unlocked.")
    window.location.href = "browse.html"
  } else {
    alert("Verification failed. Details do not match.")
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const lostForm = document.getElementById("lostForm")
  const foundForm = document.getElementById("foundForm")
  const claimForm = document.getElementById("claimForm")

  if (lostForm) {
    lostForm.addEventListener("submit", async e => {
      e.preventDefault()

      const inputs = lostForm.querySelectorAll("input, textarea")

      const item = {
        id: generateId(),
        type: "lost",
        name: inputs[0].value,
        description: inputs[1].value,
        location: inputs[2].value,
        date: inputs[3].value,
        color: inputs[4].value,
        brand: inputs[5].value,
        identifiers: inputs[6].value,
        status: "unclaimed"
      }

      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      })

      window.location.href = "browse.html"
    })
  }

  if (foundForm) {
    foundForm.addEventListener("submit", async e => {
      e.preventDefault()

      const inputs = foundForm.querySelectorAll("input, textarea")

      const item = {
        id: generateId(),
        type: "found",
        name: inputs[0].value,
        description: inputs[1].value,
        location: inputs[2].value,
        date: inputs[3].value,
        color: inputs[4].value,
        brand: inputs[5].value,
        identifiers: inputs[6].value,
        finderContact: {
          name: inputs[7].value,
          phone: inputs[8].value,
          email: inputs[9].value
        },
        status: "unclaimed"
      }

      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      })

      window.location.href = "browse.html"
    })
  }

  if (claimForm) {
    claimForm.addEventListener("submit", submitClaim)
  }

  loadItems()
})
