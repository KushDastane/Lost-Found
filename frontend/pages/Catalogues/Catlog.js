// Utility: Format date to DD/MM/YYYY
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Check auth status based on token
async function checkAuthStatus() {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token);

  if (!token) {
    updateAuthButton(false);
    return;
  }

  try {
    const response = await fetch("/api/auth/verify", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("Token verification result:", result);
    if (response.ok && result.success) {
      updateAuthButton(true);
    } else {
      localStorage.removeItem("token");
      updateAuthButton(false);
    }
  } catch (error) {
    console.error("Token verification error:", error);
    updateAuthButton(false);
  }
}

// Update auth UI based on login status
function updateAuthButton(isLoggedIn) {
  const authButton = document.getElementById("auth-btn");
  if (!authButton) return;

  authButton.innerHTML = ""; // Clear previous content

  if (isLoggedIn) {
    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.innerText = "Logout";

    const profileIcon = document.createElement("img");
    profileIcon.src = "https://cdn-icons-png.flaticon.com/512/64/64572.png";
    profileIcon.alt = "Profile";
    profileIcon.id = "profile-icon";

    authButton.appendChild(logoutBtn);
    authButton.appendChild(profileIcon);

    logoutBtn.addEventListener("click", logout);
    console.log("Logout button rendered and event listener attached");
  } else {
    const loginBtn = document.createElement("a");
    loginBtn.href = "../Auth/login.html";
    loginBtn.innerHTML = `<button id="login-btn">Login</button>`;
    authButton.appendChild(loginBtn);
  }
}

// Handle logout
function logout() {
  console.log("Logout triggered");

  // Clear token from localStorage
  localStorage.removeItem("token");

  // Reset UI
  updateAuthButton(false);

  // Option 1: Reload the page to reset the state and UI (preferred if you want to reset everything)
  // window.location.reload();

  // Option 2: Redirect to the login page (if you prefer a redirect instead of a full reload)
  window.location.href = "/";
}

// Fetch found items from backend
async function fetchFoundItems() {
  try {
    const res = await fetch("/api/found");
    const data = await res.json();
    return data.length ? data : [];
  } catch (err) {
    console.error("Failed to fetch items:", err);
    return sampleItems;
  }
}

// Render items
function renderItems(items) {
  const container = document.getElementById("items-container");
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Create image element
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.name;

    // Create heading element
    const heading = document.createElement("h3");
    heading.textContent = item.name;

    // Create category paragraph
    const category = document.createElement("p");
    category.innerHTML = `<strong>Category:</strong> ${item.category}`;

    // Create date found paragraph
    const dateFound = document.createElement("p");
    dateFound.innerHTML = `<strong>Date Found:</strong> ${item.dateFound ? formatDate(item.dateFound) : 'Unknown'}`;

    // Create location found paragraph
    const locationFound = document.createElement("p");
    locationFound.innerHTML = `<strong>Location Found:</strong> ${item.locationFound}`;

    // Create Claim button
    const button = document.createElement("button");
    button.textContent = "Claim";

    // Add click event handler to store item and navigate to claim page
    button.addEventListener('click', () => {
      handleItemClick(item, '/claim');
    });

    // Append all elements to the card
    card.appendChild(img);
    card.appendChild(heading);
    card.appendChild(category);
    card.appendChild(dateFound);
    card.appendChild(locationFound);
    card.appendChild(button);

    // Append card to the container
    container.appendChild(card);
  });
}

// Handle button click and redirect if not logged in
function handleItemClick(item, targetPage) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to claim this item.");
    window.location.href = "/login";
  } else {
    storeItemForClaim(item);
    window.location.href = targetPage;
  }
}

// Handle button click and redirect if not logged in for "File Lost" and "File Found"
function handleFileButtonClick(targetPage) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to file a lost or found item.");
    window.location.href = "/login";  // Redirect to login page if not logged in
  } else {
    window.location.href = targetPage;  // Redirect to respective page if logged in
  }
}

// Add event listeners to "File Lost" and "File Found" buttons
document.getElementById("file-lost-btn").addEventListener("click", () => {
  handleFileButtonClick("/lost");  // Redirect to lost page
});

document.getElementById("file-found-btn").addEventListener("click", () => {
  handleFileButtonClick("/found");  // Redirect to found page
});


// Apply filters
function applyFilters() {
  const category = document.getElementById("categoryFilter").value.trim();
  const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
  const dateFilter = document.getElementById("dateFilter").value;

  let filtered = allItems;

  if (category) {
    filtered = filtered.filter(i => i.category === category);
  }

  if (searchTerm) {
    filtered = filtered.filter(i =>
      i.name.toLowerCase().includes(searchTerm) ||
      (i.description?.toLowerCase().includes(searchTerm) || false)
    );
  }

  if (dateFilter) {
    filtered = filtered.filter(i =>
      new Date(i.dateFound).toISOString().slice(0, 10) === dateFilter
    );
  }

  renderItems(filtered);
}

// Global variable for items
let allItems = [];

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  checkAuthStatus(); // Check login status on page load

  allItems = await fetchFoundItems();
  if (allItems.length === 0) {
    document.getElementById("items-container").innerHTML = "<p>No items found.</p>";
  } else {
    renderItems(allItems);
  }

  // Attach event listeners for filters and search
  document.getElementById("categoryFilter").addEventListener("change", applyFilters);
  document.getElementById("dateFilter").addEventListener("change", applyFilters);
  document.getElementById("searchBtn").addEventListener("click", applyFilters);
  document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyFilters();
  });
});

// Store item in localStorage for claim
function storeItemForClaim(item) {
  localStorage.setItem("claimItem", JSON.stringify(item));
}
