function fetchPlexPin(product, clientId) {
    const data = new URLSearchParams();
    data.append("strong", "false");
    data.append("X-Plex-Product", product);
    data.append("X-Plex-Client-Identifier", clientId);
    return fetch("https://plex.tv/api/v2/pins", {
        method: "POST",
        headers: {
            "Accept": "application/json"
        },
        body: data
    })
        .then(r => r.json());
}

function fetchPlexAuthToken(clientId, pin) {
    let data2 = new URLSearchParams();
    data2.append("code", pin);
    data2.append("X-Plex-Client-Identifier", clientId);
    return fetch("https://plex.tv/api/v2/pins/" + j.id + "?" + data2.toString(), {
        headers: {
            "Accept": "application/json"
        }
    })
        .then(r => r.json());
}


document.addEventListener('DOMContentLoaded', () => {
    // Initialize form logic
    document.forms[0].onsubmit = e => e.preventDefault();
    document.getElementById("random-id").onclick = () => {
        document.getElementById("client-id").value = crypto.randomUUID();
    }

    // Handle generation
    let checkForPin = null;
    document.getElementById("generate").onclick = () => {
        // Refresh check if clicked again
        if (checkForPin !== null)
            window.clearInterval(checkForPin);

        let product = document.getElementById("product").value;
        let clientId = document.getElementById("client-id").value;
        if (product === '' || clientId === '') return;

        fetchPlexPin(product, clientId)
            .then(pin => {
                // Set QR code
                const pinContainer = document.getElementById("pin-container");
                pinContainer.querySelector("img").setAttribute('src', pin.qr);

                // Display PIN
                document.getElementById("pin").innerText = pin.code;
                pinContainer.style.display = "block";

                checkForPin = window.setInterval(() => {
                    fetchPlexAuthToken(clientId, pin.code)
                        .then(token => {
                            // If we're going to expire before the next pull, make the user generate again
                            if (token.expiresIn < 5) {
                                window.clearInterval(checkForPin);
                                pinContainer.style.display = "none";
                            }

                            // If there's no token, keep waiting
                            if (!token.authToken) return;

                            pinContainer.style.display = "none";
                            document.getElementById("plex-token").innerText = token.authToken;
                            document.getElementById("token-container").style.display = "block";
                            window.clearInterval(checkForPin);
                        })
                }, 5000);
            });
    }
})