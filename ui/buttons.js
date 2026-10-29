const style = document.createElement("style");

style.textContent = `

.signori-line-btn {
    position: relative;
    display: inline-block;
    color: #242424;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.4s ease;
}

/* NORMAL — Thin line under text */

.signori-line-btn::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 100%;
    height: 1px;
    background: currentColor;

    transform: scaleX(1);
    transform-origin: left center;
    transition: transform 0.5s ease;
}

/* HOVER — Text turns grey */

.signori-line-btn:hover {
    color: #999999;
}

/* HOVER — Line disappears to the right */

.signori-line-btn:hover::after {
    transform: scaleX(0);
    transform-origin: right center;
}

/* MOUSE LEAVE — Line returns left to right */

.signori-line-btn:not(:hover)::after {
    transform-origin: left center;
}

`;

document.head.appendChild(style);