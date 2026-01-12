const firebaseConfig = { databaseURL: "https://m-legacy-5cf2b-default-rtdb.firebaseio.com/" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const viewport = document.getElementById('pixel-viewport');
const mover = document.getElementById('canvas-mover');
const mCanvas = document.getElementById('mainCanvas');
const mCtx = mCanvas.getContext('2d');
const counter = document.getElementById('pixel-count-display');

mCanvas.width = 5000; mCanvas.height = 2000;
let scale = 0.2, posX = 0, posY = 0, isDragging = false, startX, startY, pixelStore = {};

function update() { mover.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`; }

// নীল রঙের গাঢ় গ্রিড ড্রয়িং
function drawBlueGrid() {
    mCtx.strokeStyle = "rgba(0, 86, 179, 0.3)"; // গাঢ় নীল গ্রিড
    mCtx.lineWidth = 0.5;
    for(let x=0; x<=5000; x+=10){ mCtx.beginPath(); mCtx.moveTo(x,0); mCtx.lineTo(x,2000); mCtx.stroke(); }
    for(let y=0; y<=2000; y+=10){ mCtx.beginPath(); mCtx.moveTo(0,y); mCtx.lineTo(5000,y); mCtx.stroke(); }
}

// অটো জুম সার্চ ফাংশন
function searchPixel() {
    const id = document.getElementById('searchInput').value;
    const pixel = pixelStore[id];
    if(pixel) {
        scale = 2; // জুম বাড়িয়ে ২ করা হলো
        posX = (viewport.clientWidth/2) - (pixel.x * scale);
        posY = (viewport.clientHeight/2) - (pixel.y * scale);
        update();
    } else { alert("Order ID not found!"); }
}

db.ref('pixels').on('value', snap => {
    pixelStore = snap.val() || {};
    let sold = 0;
    Object.keys(pixelStore).forEach(k => { sold += parseInt(pixelStore[k].pixelCount || 0); });
    counter.innerText = sold.toLocaleString();
    render();
});

function render() {
    mCtx.clearRect(0,0,5000,2000);
    drawBlueGrid();
    // এখানে পিক্সেল ড্রয়িং লজিক থাকবে
}

viewport.onwheel = (e) => { 
    e.preventDefault(); scale *= (e.deltaY > 0) ? 0.9 : 1.1; 
    scale = Math.max(0.1, Math.min(scale, 5)); update(); 
};
viewport.onmousedown = (e) => { isDragging = true; startX = e.clientX-posX; startY = e.clientY-posY; };
window.onmouseup = () => isDragging = false;
window.onmousemove = (e) => { if(isDragging){ posX = e.clientX-startX; posY = e.clientY-startY; update(); } };
