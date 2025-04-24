1.truffle相当于create-react-app或者vue-cli
2.一开始用没问题 但想要进阶 还是需要自己配置一下webpack

1.使用js测试合约 测试驱动开发




一、编译智能合约
solc包
solc.compile('智能合约文件')
solc 编译.solw文件 生成json 
   生成的文件 bytecode  部署合约用的数据
             interface(abi) 接口声明 测试使用
 二、自动化编译
1.每次compile清空文件 重新生成
 rimraf包 清空文件的   执行 rimraf src/compiled/* && node scripts/compile.js
"compile":"rimraf src/compiled/* && node scripts/compile.js"
2.报错信息打印
3.最好能监听 自动compile
onchange 包 监听文件变化的  执行 onchange 'contract/*.sol' -- npm run compile
"compile:w":"onchange 'contract/*.sol' -- npm run compile"

三、课程

课程列表
   1.每个课程 都是一个单独的合约
   2.使用CouseList来控制课程的合约（合约之间可以交互  合约是有地址的）

课程
  owner 
  name
  content
  target 课程目标是募集 多少ETH
  fundingPrice 众筹价格 8
  price 上线价格 2
  img 课程头图
  video 视频
  count 多少人支持
  isOnline 是否上线

  users{
   用户1:1块钱
   用户2：花了2块钱
  }
  payable 可付款的

  1.如果收到的钱大于目标 上线了
  2.上线前的钱 ceo不分
  3.上线之后卖的钱 ceo分1成

  wei finney szabo ether
  1 ether = 10^3 finnery
  1 ether = 10^6 szabo
  1 ether = 10^18 wei



  
测试使用：mocha
断言使用node自己的assert
本地部署环境 ganache 测试的时候开虚拟环境
bignumber.js包  计算费用太大了 
truffle-hdwallet-provider
web3@1.0.0-beta.34 truffle-hdwallet-provider@0.0.3
拓展
vscode 安装solidity  可以看sol文件不同语法部分显示不同颜色

部署
 
  主网
  本地genache 没有办法在公网访问

  测试网（ropsten）与主网一样的逻辑 只不过币不值钱
  infura.io 部署服务
https://sepolia.infura.io/v3/4336eaa8bff54fabb81cf2ce5d4346ad

 钱包的网切换到测试网  然后充测试币



合约部署地址持久化

配置环境
npm install react-app-rewired --save

npm install babel-plugin-import --save