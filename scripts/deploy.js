//部署合约到测试网络
const fs = require('fs')
const path = require('path')
const Web3 = require('web3')
const HdWalletProvider = require('truffle-hdwallet-provider')
const contractPath = path.resolve(__dirname,'../src/compiled/CourseList.json')
const {abi,evm} = require(contractPath)
const bytecode = evm.bytecode.object
 const provider = new HdWalletProvider(
  "drill rocket nurse story comfort tobacco tide solid miracle veteran pink shove",
  "https://sepolia.infura.io/v3/4336eaa8bff54fabb81cf2ce5d4346ad"
 )
 const web3 = new Web3(provider);

 (async()=>{
   const accounts = await web3.eth.getAccounts()
   console.log('合约部署的账号',accounts)
   console.time('合约部署消耗时间')
   const result = await new web3.eth.Contract(JSON.parse(abi))
                                    .deploy({data:"0x" + bytecode})
                                    .send({
                                     from:accounts[0],
                                     gas:'500000'
                                    })
   console.timeEnd('合约部署消耗时间')
   const contractAddress = result.options.address
   console.log('合约部署成功地址',contractAddress)
   console.log('合约查看地址',`https://sepolia.etherscan.io/address/${contractAddress}`)

   const addressFile = path.resolve(__dirname,'../src/address.js')
   fs.writeFileSync(addressFile,"export default "+JSON.stringify(contractAddress))
   console.log('地址写入成功',addressFile)
    })()