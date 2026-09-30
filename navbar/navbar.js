document.addEventListener("DOMContentLoaded", () => {
    fetch("../navbar/navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("site-menu").innerHTML = data;
            
            // Initsializirane na plavashtoto menyu sled kato HTML-at se zaredi
            const menuButton = document.getElementById("menuButton");
            const sideDrawer = document.getElementById("sideDrawer");
            const drawerOverlay = document.getElementById("drawerOverlay");

            if (menuButton && sideDrawer && drawerOverlay) {
                // Otvaryane na menyuto pri klik na burgera
                menuButton.addEventListener("click", () => {
                    sideDrawer.classList.add("open");
                    drawerOverlay.classList.add("active");
                });

                // Zatvaryane na menyuto pri klik izvun nego (varhu tumnata chast)
                drawerOverlay.addEventListener("click", () => {
                    sideDrawer.classList.remove("open");
                    drawerOverlay.classList.remove("active");
                });
            }
        })
        .catch(error => {
            console.error("Menu loading error:", error);
        });
});