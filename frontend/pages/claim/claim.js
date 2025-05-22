document.addEventListener("DOMContentLoaded", () => {
  const item = JSON.parse(localStorage.getItem("claimItem"));
  console.log("Claimed item data:", item); // Add this line

  if (item) {
    document.getElementById("item-name").textContent = item.name;
    document.getElementById("item-desc").textContent = item.description;
    document.getElementById("item-date").textContent = formatDate(item.dateFound);
    document.getElementById("item-location").textContent = item.locationFound;
    document.getElementById("item-image").src = item.imageUrl;
    document.getElementById("item-image").alt = item.name;
    document.getElementById("secret-question").textContent = `Secret Question: ${item.secretQuestion}`;
  } else {
    // Fallback if no item data is found
    document.querySelector(".left-section").innerHTML = "<p>No item selected. Please go back to the catalogue.</p>";
  }
});

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

document.getElementById("claimForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to submit a claim.");
    window.location.href = "/login.";
    return;
  }

  const item = JSON.parse(localStorage.getItem("claimItem"));
  const itemId = item?._id;

  const form = e.target;

  const payload = {
    itemId,
    additionalInfo: form.querySelector("textarea").value,
    secretAnswer: form.querySelectorAll("input")[0].value,
    claimantName: form.querySelectorAll("input")[1].value,
    claimantEmail: form.querySelectorAll("input")[2].value,
    collegeId: form.querySelectorAll("input")[3].value,
  };
  

  try {
    const res = await fetch("/api/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text(); // 🛠 instead of .json()
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Response not JSON:", text); // 🚨 raw server response
      throw new Error("Invalid JSON from server");
    }

    if (res.ok) {
      alert(data.isMatch ? "Claim matched and submitted!" : "Claim submitted, but secret answer did not match.");
      window.location.href = "/catalogues";
    } else {
      alert(data.message || "Claim failed.");
    }

  } catch (err) {
    console.error("Catch block error:", err);
    alert("Error submitting claim.");
  }
  
});


