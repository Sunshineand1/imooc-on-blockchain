// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Course {
    address payable public ceo;
     address payable public owner;
    string public name;
   
    string public content;
    uint public target;
    uint public fundingPrice;
    uint public price;
    string public img;
    string public video;
    uint public count;
    bool public isOnline;
    mapping(address => uint) public users;
    constructor(
        address payable _ceo,
        address payable _owner,
        string memory _name,
        string memory _content,
        uint _target,
        uint _fundingPrice,
        uint _price,
        string memory _img,
        string memory _video,
        uint _count,
        bool _isOnline
    ) {
        ceo = _ceo;
        owner = _owner;
        name = _name;
        content = _content;
        target = _target;
        fundingPrice = _fundingPrice;
        price = _price;
        img = _img;
        video = _video;
        count = _count;
        isOnline = _isOnline;
    }
    //上传视频
    function addVideo(string memory _video) public{
     require(msg.sender== owner);
     require(isOnline == true);
     video = _video;
    }
    // 众筹或购买
    function buy() public payable {
        require(users[msg.sender] == 0, "You already bought the course");
        if (isOnline) {
            require(price == msg.value, "Incorrect price for online course");
        } else {
            require(fundingPrice == msg.value, "Incorrect funding amount");
        }

        users[msg.sender] = msg.value;
        count += 1;

        if (target <= count * fundingPrice) {
            if (isOnline) {
                uint value = msg.value;
                ceo.transfer(value / 10);
                owner.transfer(value - value / 10);
            } else {
                isOnline = true;
                owner.transfer(count * fundingPrice);
            }
        }
    }

    // 获取课程详情
    function getDetail()
        public
        view
        returns (
            string memory,
            string memory,
            uint,
            uint,
            uint,
            string memory,
            string memory,
            uint,
            bool,
            uint
        )
    {
        uint role;
        if (owner == msg.sender) {
            role = 0; // 课程创建者
        } else if (users[msg.sender] > 0) {
            role = 1; // 已购买
        } else {
            role = 2; // 未购买
        }

        return (
            name,
            content,
            target,
            fundingPrice,
            price,
            img,
            video,
            count,
            isOnline,
            role
        );
    }
}

contract CourseList {
    address public ceo;
    address[] public courses;

    constructor() {
        ceo = msg.sender;
    }

    function createCourse(
        address payable _owner,
        string memory _name,
        string memory _content,
        uint _target,
        uint _fundingPrice,
        uint _price,
        string memory _img,
        string memory _video,
        uint _count,
        bool _isOnline
    ) public {
        Course newCourse = new Course(
            payable(ceo),
            _owner,
            _name,
            _content,
            _target,
            _fundingPrice,
            _price,
            _img,
            _video,
            _count,
            _isOnline
        );
        courses.push(address(newCourse));
    }

    function getCourses() public view returns (address[] memory) {
        return courses;
    }

    function removeCourse(uint _index) public {
        require(msg.sender == ceo, "Only CEO can remove course");
        require(_index < courses.length, "Invalid index");

        for (uint i = _index; i < courses.length - 1; i++) {
            courses[i] = courses[i + 1];
        }

        courses.pop();
    }

    function isCeo() public view returns (bool) {
        return msg.sender == ceo;
    }
}
