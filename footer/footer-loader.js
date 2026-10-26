(() => {
    const loaderScript = document.currentScript;
    const footerDirectory = new URL("./", loaderScript.src);

    const footerPlaceholder = document.getElementById("footer-placeholder");

    if (!footerPlaceholder) return;

    // Load footer CSS
    const footerStyles = document.createElement("link");
    footerStyles.rel = "stylesheet";
    footerStyles.href = new URL("footer.css", footerDirectory).href;
    document.head.appendChild(footerStyles);

    // Load footer HTML
    fetch(new URL("footer.html", footerDirectory))
        .then(response => {
            if (!response.ok) {
                throw new Error("Footer HTML could not be loaded.");
            }

            return response.text();
        })
        .then(html => {
            footerPlaceholder.innerHTML = html;

            // Load footer JavaScript after the HTML is inserted
            const footerScript = document.createElement("script");
            footerScript.src = new URL("footer.js", footerDirectory).href;
            document.body.appendChild(footerScript);
        })
        .catch(error => {
            console.error("Footer loading error:", error);
        });
})();