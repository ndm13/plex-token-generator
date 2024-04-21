document.addEventListener('DOMContentLoaded', () => {
    document.forms[0].onsubmit = e => e.preventDefault();
    document.getElementById("random-id").onclick = e => {
        document.getElementById("client-id").value = crypto.randomUUID();
    }
    let check = null;
    document.getElementById("generate").onclick = e => {
        if (check !== null)
            clearInterval(check);
        let product = document.getElementById("product").value;
        let clientId = document.getElementById("client-id").value;
        if (product === '' || clientId === '')
            return;
        let data = new URLSearchParams();
        data.append("strong", "false");
        data.append("X-Plex-Product", product);
        data.append("X-Plex-Client-Identifier", clientId);
        fetch("https://plex.tv/api/v2/pins", {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: data
        })
            .then(r => r.json())
            .then(j => {
                let pc = document.getElementById("pin-container");
                pc.getElementsByTagName("img")[0].setAttribute('src', j.qr);
                let pin = j.code;
                document.getElementById("pin").innerText = pin;
                pc.style.display = "block";
                check = setInterval(e => {
                    let data2 = new URLSearchParams();
                    data2.append("code", pin);
                    data2.append("X-Plex-Client-Identifier", clientId);
                    fetch("https://plex.tv/api/v2/pins/" + j.id + "?" + data2.toString(), {
                        headers: {
                            "Accept": "application/json"
                        }
                    })
                        .then(r => r.json())
                        .then(j2 => {
                            if (j2.expiresIn < 5) {
                                clearInterval(check);
                                document.getElementById("pin-container").style.display = "none";
                            }
                            if (!j2.authToken)
                                return;
                            pc.style.display = "none";
                            document.getElementById("plex-token").innerText = j2.authToken;
                            document.getElementById("token-container").style.display = "block";
                            clearInterval(check);
                        })
                }, 5000)
            });
    }
})