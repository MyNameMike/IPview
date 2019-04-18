
/*==========================================================================*/

const url = "http://192.168.56.197/api/ipam/ip-addresses";
window.addEventListener("load", getJson());

const IPCIDR = require("ip-cidr");
const ipMap = new Map();

const btn = document.createElement("button");
const subnet = document.getElementById("subnet");

const a = document.createElement("a");
const ips = document.getElementById("ips");

const summarys = document.getElementsByClassName("summary");

async function getJson() {
  let response = await fetch(url);
  let parsed = await response.json();
  console.log(parsed.results);
  showIPs(parsed.results);
  createVisualization(parsed.results);
  listen();
}

function showIPs(json) {
  json.forEach(element => {
    a.innerHTML = `${element.address} ${
      element.interface.virtual_machine.name
    } ${element.status.label}`;
    a.setAttribute("class", "summary");
    ips.appendChild(a.cloneNode(true));
  });
}

function createVisualization(json) {
  let i = 0;
  for (i = 0; i < json.length; i++) {
      if (validate(json[i].address)) continue;
      createSubnet(json[i].address,i);
  }
}

function createSubnet(address, index) {
  const cidr = new IPCIDR(address);
  let cidrArray = cidr.toArray();
  cidrArray.shift();
  cidrArray.pop();
  ipMap.set(address, cidrArray);
  let i = 0;
  cidrArray.forEach(ip => {
    let end = ip.split(/[\.\/]/);
    btn.innerHTML = `.${end[3]}`;
    btn.setAttribute("class", "ip" + index);
    btn.setAttribute("id", "ip" + i);
    i++;
    subnet.appendChild(btn.cloneNode(true));
  });
}

function validate(ip) {
    let val = new Boolean();
    if(ipMap.size < 1) return;
    changeCSS(ip);
    ipMap.forEach((value) => { 
        if (!value.includes(ip.split('/')[0])) {
            val = false;
        }
    });
    return val;
}

function changeCSS(ip) {
    let inSubnet = ip.split(/[\.\/]/)[3]; //CHANGE only for /24
    let newCSS = document.getElementById('ip'+inSubnet);
    newCSS.style.color = 'gray';
    newCSS.style.borderColor = 'gray';
}

function hideSubnet() {
    let j = -1;
    ipMap.forEach((value) => {
        j++;
        for (let i = 0; i < value.length; i++) {
            document.getElementsByClassName("ip" + j)[i].style.display = "none";
        }
    });
}

function showSubnet(index) {
  hideSubnet();
  let subnetIP = Array.from(ipMap.keys())[index];
  let length = ipMap.get(subnetIP).length;
  for (let i = 0; i < length; i++) {
    document.getElementsByClassName("ip" + index)[i].style.display = "inline";
  }
}

function listen() {
  for (let i = 0; i < summarys.length; i++) {
    summarys[i].addEventListener("click",function() {
        console.log(`summary ${i} was clicked`);
        showSubnet(i);
    }
    ,false);
  }
}

/*==========================================================================*/
