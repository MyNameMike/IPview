const url = 'http://192.168.56.197/api/ipam/ip-addresses/';
const IPCIDR = require('ip-cidr');
const cidrMap = new Map(); 

fetch(url)
.then(response=>{return response.json()})
.then(json=>{json.results.forEach((element) => 
    {
        const cidr = new IPCIDR(element.address);
        //console.log(cidr.toArray());
        cidrMap.set(element.address, cidr.toArray);
        console.log(`${element.address} ${element.interface.virtual_machine.name} ${element.status.label}`)
    }
)})

console.log(cidrMap.size);
cidrMap.forEach((v, k) => {
    console.log(`${v}, ${k}`);
});