const url = "api.json";
window.addEventListener('load', getJson());

const IPCIDR = require("ip-cidr");

const btn = document.createElement('button');
const subnet = document.getElementById('subnet');

const a = document.createElement('a');
const ips = document.getElementById('ips');


async function getJson() {
    let response = await fetch(url);
    let parsed = await response.json();
    showIPs(parsed.results)
    createVisualization(parsed.results)
}

function showIPs(json) {
    json.forEach(element => {
        a.innerHTML = `${element.address} ${element.interface.virtual_machine.name} ${element.status.label}`;
        ips.appendChild(a.cloneNode(true));
    });
}

function createVisualization(json) {
    console.log(json);
    json.forEach(element => {
        const cidr = new IPCIDR(element.address);

        // let ip = element.address.split(/[\.\/]/);
        // btn.innerHTML = `.${ip[3]}`;
        cidr.toArray().forEach(ip=>{
            let end = ip.split(/[\.\/]/);
            btn.innerHTML = `.${end[3]}`;
            subnet.appendChild(btn.cloneNode(true));
        });
        // btn.innerHTML = `${cidr.toArray()}`;

        // subnet.appendChild(btn.cloneNode(true));
    });
}


