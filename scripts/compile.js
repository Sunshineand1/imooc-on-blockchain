// const fs = require('fs')
// const path = require('path')
// const solc = require('solc')

// const contractPath = path.resolve(__dirname,'../contracts/Imooc.sol')

// // 获取合约文件内容
// const source = fs.readFileSync(contractPath,'utf-8')
// console.log(source)
// //编译
// const ret = solc.compile(source)

// console.log(ret)
const solc = require('solc')
const fs = require('fs')
const path = require('path')

const contractPath = path.resolve(__dirname, '../contracts/Imooc.sol')
const source = fs.readFileSync(contractPath, 'utf8')

var input = {
  language: 'Solidity',
  sources: {
    'Imooc.sol': {
      content: source,
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));
if(output.errors){
 console.log(output.errors[0])
}

 const buildPath = path.resolve(__dirname, '../src/compiled')
if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath)
}
 for (let contractName in output.contracts['Imooc.sol']) {
  const contract = output.contracts['Imooc.sol'][contractName]
  const filePath = path.resolve(buildPath, `${contractName}.json`)
  fs.writeFileSync(filePath, JSON.stringify(contract, null, 2))
  console.log(`✔ 已写入 ${contractName}.json`)
}

// if(Array.isArray(output.errors)&&output.errors.length>0){

//  console.log(output.errors[0])
// }else{
 // Object.keys(output.contracts).forEach((fileName)=>{
 //  output.contracts[fileName].forEach(name => {
 //   const contractName = name
 //   console.log('contractName',contractName)
 //   const filePath = path.resolve(__dirname,`../src/compiled/${contractName}.json`)
 //   fs.writeFileSync(filePath,JSON.stringify(output.contracts[name]))
 //   console.log(`${filePath} bingo`)
 //  })
  
 // })
