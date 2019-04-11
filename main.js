const url = 'http://192.168.56.197/api/ipam/ip-addresses/';

fetch(url)
.then(response=>{return response.json()})
.then(json=>{json.results.forEach((element) => {console.log(`${element.address} ${element.interface.virtual_machine.name} ${element.status.label}`)
}
)})

