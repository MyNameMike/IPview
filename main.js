const url = "http://192.168.56.197/api/ipam/ip-addresses";
window.addEventListener("load", getJson());

const IPCIDR = require("ip-cidr");
const ipMap = new Map();

const btn = document.createElement("button");
const subnet = document.getElementById("subnet");

const a = document.createElement("a");
const ips = document.getElementById("ips");

const summarys = document.getElementsByClassName("summary");
const subnets = document.getElementsByClassName("ip");

async function getJson() {
  let response = await fetch(url);
  let parsed = await response.json();
  console.log(parsed.results);
  showIPs(parsed.results);
  createVisualization(parsed.results);
  listen();
  hideSubnet();
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

// function createVisualization(json) {
//     let i = -1;
//     json.forEach(element => {
//         const cidr = new IPCIDR(element.address);
//         i++;
//         cidr.toArray().forEach(ip=>{
//             let end = ip.split(/[\.\/]/);
//             btn.innerHTML = `.${end[3]}`;
//             btn.setAttribute('class', 'ip' + i);
//             subnet.appendChild(btn.cloneNode(true));
//         });
//     });
// }

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
  ipMap.set(address, cidrArray);
  cidrArray.forEach(ip => {
    let end = ip.split(/[\.\/]/);
    btn.innerHTML = `.${end[3]}`;
    btn.setAttribute("class", "ip" + index);
    subnet.appendChild(btn.cloneNode(true));
  });
  //console.log(ipMap.get(address).includes(address.split('/')[0]));
}

function validate(ip) {
    let val = new Boolean();
    if(ipMap.size < 1) return;
    ipMap.forEach((value, key) => { 
        if (!value.includes(ip.split('/')[0])) {
            val = false;
        }
    });
    return val;
}

function hideSubnet() {
  for (let i = 0; i < subnets.length; i++) {
    document.getElementsByClassName("ip" + i)[i].style.display = "none";
  }
}

function showSubnet(index) {
  hideSubnet();
  document.getElementsByClassName("ip" + index)[index].style.display = "inline";
}

function listen() {
  for (let i = 0; i < summarys.length; i++) {
    summarys[i].addEventListener("click",function() {
        showSubnet(i);
    }
    ,false);
  }
}

/*==========================================================================*/
