
/*==========================================================================*/

const url = "http://192.168.56.197/api/ipam/ip-addresses";
window.addEventListener("load", getJson());

window.addEventListener("load", function() {
  document.getElementById("ip-info").style.display = "none";
});

const IPCIDR = require("ip-cidr");
const ipMap = new Map();

const btn = document.createElement("button");
const subnet = document.getElementById("subnet");

const a = document.createElement("a");
const ips = document.getElementById("ips");

const summarys = document.getElementsByClassName("summary");

const ranges = document.getElementById("ranges");
const range = document.getElementsByClassName("range");

let jsonAPI;
let toggleSubnet = new Array();

async function getJson() {
  let response = await fetch(url);
  let parsed = await response.json();
  console.log(parsed.results);
  if(parsed.count < 1) noContent();
  jsonAPI = parsed.results;
  showIPs(jsonAPI);
  createVisualization(parsed.results);
  summaryListen();
}

function summaryListen() {
  for (let i = 0; i < summarys.length; i++) {
    summarys[i].addEventListener("click",function() {
        console.log(`summary ${i} was clicked`);
        document.getElementById("ip-info").style.display = "inline";
        subnet.style.display = "inline";
        if(toggleSubnet.includes(i)) subnet.style.display = "none";
        showSubnet(i);
        showRange(i);
    }
    ,false);
  }
}

function showIPs(json) {
  json.forEach(element => {
    let row = ips.insertRow(ips.rows.length);
    let ip = row.insertCell(0);
    let name = row.insertCell(1);
    let status = row.insertCell(2);
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
      validate(json[i].address);
      createSubnet(json[i].address,i);
    }
}

function createSubnet(address, index) {
  const cidr = new IPCIDR(address);
  let cidrArray = cidr.toArray();
  
  createRange(cidr.toRange(), cidrArray.length);

  ipMap.set(address, cidrArray);
  
  if (cidrArray.length > 2) {
    cidrArray.shift();
    cidrArray.pop();
    if (cidrArray.length > 256) toggleSubnet.push(index);
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

function createRange(range, length) {
  btn.innerHTML = `Subnet Range: ${range[0]} - ${range[1]} (${length})`;
  btn.setAttribute("class", "range");
  ranges.appendChild(btn.cloneNode(true));
}

function showRange(index) {
  hideRange();
  range[index].style.display = "inline";
}

function hideRange(){
  for (let i = 0; i < range.length; i++) {
    range[i].style.display = "none";
  }
}

function validate(ip) {
    // console.log(`ip: ${ip}, and map size: ${ipMap.size}`);
    let i = 0;
    if(ipMap.size < 1) return;
    ipMap.forEach((value) => {
      if (value.includes(ip.split('/')[0])) {
        changeCSS(ip, i);
      }
      i++;
    });
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

function changeCSS(ip, i) {
  let inSubnet = ip.split(/[\.\/]/)[3]; //CHANGE only for /24
  // console.log(`ip: ${ip}, subnet: ${inSubnet}, index: ${i}`);
  let newCSSS = document.querySelector(".ip"+i+"#ip"+inSubnet);
  let newCSS = document.getElementById('ip'+inSubnet);
    newCSS.style.backgroundColor = 'rgb(51,122,183)';
    newCSSS.style.borderColor = '#337AB7'; //Active
    newCSSS.style.borderColor = '#5BC0DE'; //Reserved
    newCSSS.style.borderColor = '#D9534F'; //Deprecated
    newCSS.disabled = true;
}

function noContent() {
    let err = document.getElementById('err');
    let msg = document.createElement('h4');
    msg.innerHTML = 'No IPs from API endpoint';
    err.appendChild(msg);
}

/*==========================================================================*/
