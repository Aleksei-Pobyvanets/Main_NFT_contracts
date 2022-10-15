// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint;

    string public baseURI;
    string public baseExtension = ".json";
    string public notRevealedUri;

    uint public cost = 0.01 ether;
    uint public maxSupply = 15;
    uint public maxMintAmount = 1;
    uint public nftPerAddressLimit = 3;

    bool public paused = false;
    bool public revealed = false;
    bool public onlyWhitelisted = true;

    address[] public whitelistedAddresses;
    mapping(address => uint) public addressMintedBalance;


    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        string memory _initNotRevealedUri
    ) ERC721(_name, _symbol){
        setBaseURI(_initBaseURI);
        setNotRevealedURI(_initNotRevealedUri);
    }

    //internal
    function _baseURI() internal view virtual override returns(string memory){
        return baseURI;
    }

    //public
    function mint(uint _mintAmount) public payable {
        require(!paused, "The contracn is paused");
        uint supply = totalSupply();
        require(_mintAmount > 0, "You need to mint at least 1 NFT");
        require(_mintAmount <= maxMintAmount, "Max mint amount per session exceeded");
        require(supply + _mintAmount <= maxSupply, "Max FT limit exceeded ");
   
    if(msg.sender != owner()){
        if(onlyWhitelisted == true){
            require(isWhitelisted(msg.sender), "User is not whitelisted");
            uint ownerMintedCount = addressMintedBalance[msg.sender];
            require(ownerMintedCount + _mintAmount <= nftPerAddressLimit, "Max NFT per addrress exceeded");
        }
        require(msg.value >= cost * _mintAmount, "insufficient funds");
    }
    
    for(uint i = 1; 1 <= _mintAmount; i++){
        addressMintedBalance[msg.sender]++;
        _safeMint(msg.sender, supply+1);
    }
   }

    function isWhitelisted(address _user) public view returns(bool){
        for(uint i = 0; i< whitelistedAddresses.length; i++){
            if(whitelistedAddresses[i] == _user){
                return true;
            }
        }
        return false;
    }

    function walletOfOwner(address _owner) public view returns(uint[] memory){
        uint ownerTokenCount = balanceOf(_owner);
        uint[] memory tokenIds = new uint[](ownerTokenCount);
        for(uint i; i < ownerTokenCount; i++){
            tokenIds[i] = tokenOfOwnerByIndex(_owner,i);
        }
        return tokenIds;
    }

    function tokenURI(uint tokenId) public view virtual override returns(string memory){
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        if(revealed == false){
            return notRevealedUri;
        }
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
            : "";
    }

    //only owner
    function reveal() public onlyOwner {
        revealed = true;
    }

    function setNftPerAddressLimit(uint _limit) public onlyOwner{
        nftPerAddressLimit = _limit;
    }

    function setCost(uint _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setmaxMintAmount(uint _newmaxMintAmount) public onlyOwner{
        maxMintAmount = _newmaxMintAmount;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner{
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner{
        baseExtension = _newBaseExtension;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner{
        notRevealedUri = _notRevealedURI;
    }

    function pause(bool _state) public onlyOwner{
        paused = _state;
    }

    function setOnlyWhitelisted(bool _state) public onlyOwner{
        onlyWhitelisted = _state;
    }

    function whitelistUsers(address[] calldata _users) public onlyOwner {
        delete whitelistedAddresses;
        whitelistedAddresses = _users;
    }

    // withdraw
    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
    }
}

