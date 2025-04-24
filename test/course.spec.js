const path = require("path");
const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache");
const BigNumber = require("bignumber.js");
const web3 = new Web3(ganache.provider());
// 引入合约的json
const CourseList = require(path.resolve(
  __dirname,
  "../src/compiled/CourseList.json"
));
const Course = require(path.resolve(__dirname, "../src/compiled/Course.json"));

// 定义全局变量
let accounts;
let courseList;
let course;
describe("测试课程", () => {
  before(async () => {
    accounts = await web3.eth.getAccounts();

    // 1.虚拟部署 CourseList 合约
    courseList = await new web3.eth.Contract(CourseList.abi)
      .deploy({ data: "0x" + CourseList.evm.bytecode.object })
      .send({
        from: accounts[9],
        gas: "5000000",
      });
  });

  it("合约部署成功", () => {
    assert.ok(courseList.options.address);
  });

  it("测试添加课程", async () => {
    const oldAddress = await courseList.methods.getCourses().call();
    await courseList.methods
      .createCourse(
        accounts[0],
        "蜗牛的React课程",
        "React+redux+reactrouter4开发招聘app",
        web3.utils.toWei("8"),
        web3.utils.toWei("2"),
        web3.utils.toWei("4"),
        "图片的hash",
        "",
        0,
        false
      )
      .send({
        from: accounts[0],
        gas: "5000000",
      });
    const address = await courseList.methods.getCourses().call();
    assert.equal(address.length, oldAddress.length + 1);
  });
  it("添加课程的属性", async () => {
    const address = await courseList.methods.getCourses().call();
    course = await new web3.eth.Contract(
      Course.abi,
      address[address.length - 1]
    );
    const name = await course.methods.name().call();
    const content = await course.methods.content().call();
    const target = await course.methods.target().call();
    const fundingPrice = await course.methods.fundingPrice().call();
    const price = await course.methods.price().call();
    const img = await course.methods.img().call();
    const count = await course.methods.count().call();
    const isOnline = await course.methods.isOnline().call();

    assert.equal(name, "蜗牛的React课程");
    assert.equal(content, "React+redux+reactrouter4开发招聘app");
    assert.equal(target, web3.utils.toWei("8"));
    assert.equal(fundingPrice, web3.utils.toWei("2"));
    assert.equal(price, web3.utils.toWei("4"));
    assert.equal(img, "图片的hash");
    assert.ok(!isOnline);
    assert.equal(count, 0);
  });
  it("删除功能", async () => {
    await courseList.methods
      .createCourse(
        accounts[0],
        "蜗牛的Vue课程",
        "vue开发招聘app",
        web3.utils.toWei("8"),
        web3.utils.toWei("2"),
        web3.utils.toWei("4"),
        "图片的hash",
        "",
        0,
        false
      )
      .send({
        from: accounts[0],
        gas: "5000000",
      });
    const address = await courseList.methods.getCourses().call();
    assert.equal(address.length, 2);

    try {
      await courseList.methods.removeCourse(3).send({
        from: accounts[9],
        gas: "5000000",
      });
      assert(false);
    } catch (e) {
      assert.ok(e);
    }

    try {
      await courseList.methods.removeCourse(0).send({
        from: accounts[0],
        gas: "5000000",
      });
      assert(false);
    } catch (e) {
      assert.ok(e);
    }

    await courseList.methods.removeCourse(1).send({
      from: accounts[9],
      gas: "5000000",
    });
    const address1 = await courseList.methods.getCourses().call();
    assert.equal(address1.length, 1);
  });

  it("判断是不是ceo", async () => {
    const isCeol1 = await courseList.methods.isCeo().call({
      from: accounts[9],
    });

    const isCeol2 = await courseList.methods.isCeo().call({
      from: accounts[1],
    });
    assert.ok(isCeol1);
    assert.ok(!isCeol2);
  });

  it("金钱转换", () => {
    assert.equal(web3.utils.toWei("2"), "2000000000000000000");
  });
  it("课程购买", async () => {
    await course.methods.buy().send({
      from: accounts[2],
      value: web3.utils.toWei("2"),
    });
    const value = await course.methods.users(accounts[2]).call();
    assert.equal(value, web3.utils.toWei("2"));
    const count = await course.methods.count().call();
    assert.equal(count, 1);

    const detail = await course.methods.getDetail().call({ from: accounts[0] });
    assert.equal(detail[9], 0);

    const detail_new = await course.methods
      .getDetail()
      .call({ from: accounts[2] });
    assert.equal(detail_new[9], 1);
    const detail_new3 = await course.methods
      .getDetail()
      .call({ from: accounts[1] });
    assert.equal(detail_new3[9], 2);
  });
  it("还没上线,购买的课不入账", async () => {
    const oldBlance = new BigNumber(await web3.eth.getBalance(accounts[0]));
    await course.methods.buy().send({
      from: accounts[3],
      value: web3.utils.toWei("2"),
    });
    const newBalance = new BigNumber(await web3.eth.getBalance(accounts[0]));
    const diff = newBalance.minus(oldBlance);
    assert.equal(diff, 0);
  });

  it("还没上线,不能上传视频", async () => {
    try {
      await course.methods.addVideo("video的hash").send({
        from: accounts[0],
        gas: "500000",
      });
      assert.ok(false);
    } catch (e) {
      assert.ok(e);
    }
  });
  it("课程不能重复购买", async () => {
    try {
      await course.methods.buy().send({
        from: accounts[2],
        value: web3.utils.toWei("2"),
      });

      assert.ok(false);
    } catch (e) {
      assert.ok(e);
    }
  });
  it("课程必须是众筹价", async () => {
    try {
      await course.methods.buy().send({
        from: accounts[4],
        value: web3.utils.toWei("3"),
      });

      assert.ok(false);
    } catch (e) {
      assert.ok(e);
    }
  });
  // it("众筹上线后 钱到账", async () => {
  //   const oldBlance = new BigNumber(await web3.eth.getBalance(accounts[0]));
  //   await course.methods.buy().send({
  //     from: accounts[5],
  //     value: web3.utils.toWei("2"),
  //   });
  //   await course.methods.buy().send({
  //     from: accounts[6],
  //     value: web3.utils.toWei("2"),
  //   });
  //   const count = await course.methods.count().call();
  //   const isOnline = await course.methods.isOnline().call();
  
  //   assert.equal(count, 4);
  //   // assert.ok(isOnline);
  //   // const newBalance = new BigNumber(await web3.eth.getBalance(accounts[0]));
  //   // const diff  = newBalance.minus(oldBlance)
  //   // assert.equal(diff,web3.utils.toWei('8'))
  // });

 
});
