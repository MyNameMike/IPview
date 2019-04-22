
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

const ranges = document.getElementById("ranges");

let jsonAPI;

async function getJson() {
  let response = await fetch(url);
  let parsed = await response.json();
  console.log(parsed.results);
  if(parsed.count < 1) noContent();
  jsonAPI = parsed.results;
  showIPs(jsonAPI);
  //   createVisualization(parsed.results);
  summaryListen();
}

function summaryListen() {
  for (let i = 0; i < summarys.length; i++) {
    summarys[i].addEventListener("click",function() {
        console.log(`summary ${i} was clicked`);
        showSubnet(i);
    }
    ,false);
  }
}

function showIPs(json) {
  json.forEach(element => {
    let row = ips.insertRow(ips.rows.length);
    let ip = row.insertCell(0);
    let name = row.insertCell(1);
    let status =row.insertCell(2);
    a.innerHTML = element.address;
    name.innerHTML = element.interface.virtual_machine.name;
    status.innerHTML = element.status.label;
    a.setAttribute("class", "summary");
    ip.appendChild(a.cloneNode(true));
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
  
  if (cidrArray.length > 256) {
      console.log(`in createSubnet, arr size: ${cidrArray.length}, of ip: ${address} @index:${index}`);
      showRange(cidr.toRange(), cidrArray.length);
  }
  
  ipMap.set(address, cidrArray);
  
  if (cidrArray.length > 2) {
      cidrArray.shift();
    cidrArray.pop();
  }
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

function showRange(range, length) {
    btn.innerHTML = `Subnet Range: ${range[0]} - ${range[1]} (${length})`;
    btn.setAttribute("class", "range");
    ranges.appendChild(btn.cloneNode(true));
}

function validate(ip) {
    let val = new Boolean();
    if(ipMap.size < 1) return;
    // changeCSS(ip);
    ipMap.forEach((value) => { 
        if (!value.includes(ip.split('/')[0])) {
            val = false;
        }
    });
    return val;
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

function changeCSS(ip) {
    let inSubnet = ip.split(/[\.\/]/)[3]; //CHANGE only for /24
    let newCSS = document.getElementById('ip'+inSubnet);
    newCSS.style.color = 'gray';
    newCSS.style.borderColor = 'gray';
    newCSS.disabled = true;
}

function noContent() {
    let err = document.getElementById('err');
    let msg = document.createElement('h4');
    msg.innerHTML = 'No IPs from API endpoint';
    err.appendChild(msg);
}

/*==========================================================================*/
