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

    it("paused false", async function(){
        expect(await nft.paused()).to.equal(false);
    })

    it("revealed false", async function(){
        expect(await nft.revealed()).to.equal(false);
    })
    
    it("onlyWhitelisted false", async function(){
        expect(await nft.onlyWhitelisted()).to.equal(true);
    })
    
    

    describe("Mint", function(){
        it("owner mint with add to addressMintedBalance", async function(){
            let addrOwner = acc1.address
            await nft.mint(1);
            expect(await nft.addressMintedBalance(addrOwner)).to.equal(1);
        })
        it("not an owner and without wl try to mint", async function(){
            let addrNotAnOwner = acc2.address;
            // await nft.onlyWhitelisted(true);
            // await nft.isWhitelisted(true);
            // await nft.connect(acc2).mint(1);
            expect(await nft.connect(acc2).addressMintedBalance(addrNotAnOwner)).to.be.revertedWith("not an owner"); //be.revertedWith("not an owner");
        })
    })
    
})
