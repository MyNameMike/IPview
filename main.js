const url = 'http://192.168.56.197/api/ipam/ip-addresses/?format=json';
const IPCIDR = require('ip-cidr');
const cidrMap = new Map(); 

fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Token fe49d531f8bc1dd6f05a0902c09f9ec7a1d58553'
    }
})
.then(response=>{return response.json()})
.then(json=>{json.results((element) => 
    {
        const cidr = new IPCIDR(element.address);
        d3.select('body')
        .selectAll('p')
        .data(cidr.toArray())
        .enter()
        .append('p')
        .text(d=>{return d});
        //console.log(cidr.toArray());
        // cidrMap.set(element.address, cidr.toArray);
        console.log(`${element.address} ${element.interface.virtual_machine.name} ${element.status.label}`)
    }
)});

// console.log(cidrMap.size);
// cidrMap.forEach((v, k) => {
//     console.log(`${v}, ${k}`);
// });