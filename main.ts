function assure<T extends new (...args: any[]) => any>(a: any, b: T): InstanceType<T> {
    if (a instanceof b) return a;
    throw new TypeError(`${a} is not ${b.name}.`);
}

let button: HTMLDivElement;

let startTime: number;
let setTime: number;
let passed: number;

let inited: boolean;
let paused: boolean;
let alarmStopped: boolean;

function clicked() {
    if (!inited) init();
    else if (!paused) pause();
    else start();
}

function init() {
    const minDOM = assure(document.getElementById("min"), HTMLInputElement);
    const secDOM = assure(document.getElementById("sec"), HTMLInputElement);

    minDOM.disabled = true;    
    secDOM.disabled = true;
    minDOM.style.boxShadow = "none";
    secDOM.style.boxShadow = "none";

    setTime = 60000 * (+minDOM.value) + 1000 * (+secDOM.value);
    passed = 0;
    alarmStopped = false;

    inited = true;
    start();
}

function start() {
    startTime = performance.now() - passed;
    paused = false;
    assure(document.getElementById("circle"), HTMLDivElement).style.backgroundImage =
     "linear-gradient(327deg, #e5dd00 0%, #e52525 74%)";
    update();

    button.classList.remove("paused");
    button.classList.add("playing");
}

function pause() {
    paused = true;
    alarmStopped = true;

    assure(document.getElementById("circle"), HTMLDivElement).style.backgroundImage =
     "linear-gradient(327deg, #aaa 0%, #777 74%)";

     button.classList.remove("playing");
     button.classList.add("paused");
}

function msToString(ms: number): string {
    const _sec = Math.floor(Math.abs(ms) / 1000);
    const min = Math.floor(_sec / 60);
    const sec = _sec - min * 60;

    const strMin = ("" + min).length < 2 ? "0" + min : "" + min;
    const strSec = ("" + sec).length < 2 ? "0" + sec : "" + sec;
    return (ms < 0 ? "-" : "") + strMin + ":" + strSec;
}

function update() {
    if (0 < setTime - passed && setTime - (performance.now() - startTime) < 0) {
        alarmStopped = false;
        alarm()
    };

    passed = performance.now() - startTime;
    const rest = setTime - passed;

    assure(document.getElementById("passed"), HTMLDivElement).textContent = msToString(passed);
    assure(document.getElementById("rest"), HTMLDivElement).textContent = msToString(rest);

    const rate = rest / setTime;
    const mask = assure(document.getElementById("mask"), HTMLDivElement);
    if (0 < rate) {
        if (rate < 0.5) {
            mask.style.backgroundColor = "inherit";
            mask.style.transform = "rotate(" + rate + "turn)";
        }
        else {
            mask.style.backgroundColor = "#000";
            mask.style.transform = "rotate(" + (rate - 0.5) + "turn)";
        }
    }
    else {
        mask.style.backgroundColor = "inherit";
        mask.style.transform = "rotate(0turn)";
    }

    if (!paused) requestAnimationFrame(update);
}

function alarm() {
    window.navigator.vibrate(400);
    if(!alarmStopped) setTimeout(alarm, 1000);
}

window.onload = () => {
    button = assure(document.getElementById("button"), HTMLDivElement);
    button.addEventListener("click", clicked);
};