// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; // Gunakan versi yang lebih spesifik

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract DappEscrow is ReentrancyGuard {
    using Address for address payable;

    // Gunakan Enum agar kode lebih mudah dibaca
    enum State { Created, Funded, Delivered, Released, Refunded, Canceled }

    address public immutable client;    // Gunakan immutable untuk hemat gas
    address public immutable designer;
    State public status;

    constructor(address _client, address _designer) {
        require(_client != address(0) && _designer != address(0), "Zero address");
        require(_client != _designer, "Client and designer cannot be same");
        client = _client;
        designer = _designer;
        status = State.Created;
    }

    modifier onlyClient() {
        require(msg.sender == client, "Only client");
        _;
    }

    modifier onlyDesigner() {
        require(msg.sender == designer, "Only designer");
        _;
    }

    modifier inStatus(State _status) {
        require(status == _status, "Invalid status");
        _;
    }

    event Funded(address indexed client, uint256 amount);
    event Delivered(address indexed designer);
    event Released(address indexed designer, uint256 amount);
    event Refunded(address indexed client, uint256 amount);
    event Canceled(address indexed client, uint256 amount);
    event Reset(address indexed client);

    function fundEscrow() external payable onlyClient inStatus(State.Created) {
        require(msg.value > 0, "ETH required");
        status = State.Funded;
        emit Funded(msg.sender, msg.value);
    }

    function markAsDelivered() external onlyDesigner inStatus(State.Funded) {
        status = State.Delivered;
        emit Delivered(msg.sender);
    }

    function releasePayment() external onlyClient inStatus(State.Delivered) nonReentrant {
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance");
        
        status = State.Released;
        payable(designer).sendValue(amount);
        emit Released(designer, amount);
    }

    //Klien bisa refund jika sudah delivered (ditolak)
    function refundClient() external onlyClient inStatus(State.Delivered) nonReentrant {
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance");

        status = State.Refunded;
        payable(client).sendValue(amount);
        emit Refunded(client, amount); 
    }

    // Cancel sebelum designer selesai menengerjakan
    function cancelEscrow() external onlyClient inStatus(State.Funded)  {
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance");

        status = State.Canceled;
        payable (client).sendValue(amount);
        emit Canceled(client, amount);
    }

    function resetEscrow() external onlyClient {
        status = State.Created;
        emit Reset(msg.sender);
    }
}