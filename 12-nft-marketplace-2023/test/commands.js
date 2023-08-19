
const instance = await NftMarket.deployed();

instance.mintToken("https://crimson-shallow-rodent-132.mypinata.cloud/ipfs/QmY2LxUZmNdr8ZrbiEzdUbmXS6wqiZUgfdh5m2QTTkNf2z", "500000000000000000", {value: "25000000000000000", from: accounts[0]})

instance.mintToken("https://crimson-shallow-rodent-132.mypinata.cloud/ipfs/QmdncwcqvSjsop4Ko1xyr56gAu9cE9wLcPsacnQDGytbRQ", "300000000000000000", {value: "25000000000000000", from: accounts[0]})
