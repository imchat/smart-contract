pragma solidity ^0.4.24;

import "./IMCToken.sol";

// ----------------------------------------------------------------------------
// 发行记录合约
// ----------------------------------------------------------------------------
contract IMCIssuingRecord is Owned{
    using SafeMath for uint;

    // 发行记录添加日志
    event IssuingRecordAdd(uint _date, bytes32 _hash, uint _depth, uint _userCount, uint _token, string _fileFormat, uint _stripLen);

    // 定义IMCToken实例
    IMCToken public imcToken;

    // 平台账户地址
    address public platformAddr;

    // 执行者地址
    address public executorAddress;

    // Token发行统计记录
    struct RecordInfo {
        uint date;  // 记录日期（解锁ID）
        bytes32 hash;  // 文件hash
        uint depth; // 深度
        uint userCount; // 用户数
        uint token; // 发行token数量
        string fileFormat; // 上链存证的文件格式
        uint stripLen; // 上链存证的文件分区
    }
    
    // 分配记录
    mapping(uint => RecordInfo) public issuingRecord;
    
    // 用户数
    uint public userCount;
    
    // 发行总币数
    uint public totalIssuingBalance;
    
    /**
     * 构造函数
     * @param _tokenAddr address ERC20合约地址
     * @param _platformAddr address 平台帐户地址
     */
    constructor(address _tokenAddr, address _platformAddr) public{
        // 初始化IMCToken实例
        imcToken = IMCToken(_tokenAddr);

        // 初始化平台账户地址
        platformAddr = _platformAddr;
        
        // 初始化合约执行者
        executorAddress = msg.sender;
    }
    
    /**
     * 修改platformAddr，只有owner能够修改
     * @param _addr address 地址
     */
    function modifyPlatformAddr(address _addr) public onlyOwner {
        platformAddr = _addr;
    }
    
    /**
     * 修改executorAddress，只有owner能够修改
     * @param _addr address 地址
     */
    function modifyExecutorAddr(address _addr) public onlyOwner {
        executorAddress = _addr;
    }

    /**
     * 转账到中间帐户
     * @param _tokens uint 币数量
     * @return success 交易成功
     */
    function sendTokenToPlatform(uint _tokens) internal returns (bool) {

        imcToken.issue(platformAddr, _tokens);
        
        return true;
    }

    /**
     * 发行记录添加
     * @param _date uint 记录日期（解锁ID）
     * @param _hash bytes32 文件hash
     * @param _depth uint 深度
     * @param _userCount uint 用户数
     * @param _token uint 发行token数量
     * @param _fileFormat string 上链存证的文件格式
     * @param _stripLen uint 上链存证的文件分区
     * @return success 添加成功
     */
    function issuingRecordAdd(uint _date, bytes32 _hash, uint _depth, uint _userCount, uint _token, string _fileFormat, uint _stripLen) public returns (bool) {
        // 调用者需和Owner设置的执行者地址一致
        require(msg.sender == executorAddress);
        // 防止重复记录
        require(issuingRecord[_date].date != _date);

        // 累计用户数
        userCount = userCount.add(_userCount);

        // 累计发行币数
        totalIssuingBalance = totalIssuingBalance.add(_token);
        
        // 记录发行信息
        issuingRecord[_date] = RecordInfo(_date, _hash, _depth, _userCount, _token, _fileFormat, _stripLen);

        // 转账到中间帐户
        sendTokenToPlatform(_token);

        emit IssuingRecordAdd(_date, _hash, _depth, _userCount, _token, _fileFormat, _stripLen);
        
        return true;
        
    }

}
