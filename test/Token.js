const { expect } = require("chai");
// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { waffle } = require("hardhat");
// const { deployContract } = waffle;

// describe("NFT contract", function(){

//     it("shold return correct name", async function(){
//         const myContract = await hre.ethers.getContractFactory("NFT");
//         const myContractDeployed = await myContract.deploy("MyContractName", "TNT", "https://fdf",  "https://fdf");
//         await myContractDeployed.deployed();
//     })
//     it("should be deployed with right name", async function(){
//         expect(await myContractDeployed.name()).to.equal("MyContractName");
//     })
// })

describe("NFT contract", function(){
    let acc1
    let acc2
    let nft

    beforeEach(async function(){
        [acc1, acc2] = await ethers.getSigners();
        const NFT = await ethers.getContractFactory("NFT", acc1);
        nft = await NFT.deploy("MyContractName", "TNT", "https://fdf123",  "https://fdf456");
        await nft.deployed();
    })

    it("should be deployed with right name", async function(){
        expect(await nft.name()).to.equal("MyContractName");
    })
    it("should be deployed with right symbol", async function(){
        expect(await nft.symbol()).to.equal("TNT");
    })
    it("setmaxMintAmount", async function(){
        await nft.setmaxMintAmount(2);
        expect(await nft.maxMintAmount()).to.equal(2);
    })
    

    describe("Mint", function(){
        it("owner mint with add to addressMintedBalance", async function(){
            let addrOwner = acc1.address
            await nft.mint(1);
            expect(await nft.addressMintedBalance(addrOwner)).to.equal(1);
        })
        it("not an owner mint with add to addressMintedBalance", async function(){
            let addrNotAnOwner = acc2.address;
            await nft.onlyWhitelisted(true);
            await nft.isWhitelisted(true);
            await nft.connect(acc2).mint(1);
            expect(await nft.connect(acc2).addressMintedBalance(addrNotAnOwner)).to.equal(1);
        })
    })
    
})


// describe("NFT contract", function(){

//     let NFT, NFTContract, owner, addr1, addr2, addr3

//     beforeEach(async function() {
//     NFT = await ethers.getContractFactory("NFT");
//     let [owner, addr1, addr2, addr3] = await ethers.getSigners();
//     NFTContract = await NFT.deploy("MyContractName", "TNT", "https://fdf",  "https://fdf");
//     await NFTContract.deployed();
//     })

    // describe("deploy", function(){
    //     it("should be owner", async function(){
    //         expect(await NFTContract.owner()).to.equal(owner.address);
    //     })
    // })

//     describe("reveal", function(){
//         it("should be owner reveal", async function(){
//             expect(await NFTContract.connect(addr1).reveal(false)).to.be.revertedWith("You are not an owner");
//         })
//     })
// })