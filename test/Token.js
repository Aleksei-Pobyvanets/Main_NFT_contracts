const { expect } = require("chai");
// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { waffle } = require("hardhat");


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
            let numb = 1;
            await nft.mint(numb);
            expect(await nft.addressMintedBalance(acc1.address)).to.equal(numb);
        })
        it("not an owner and without wl try to mint", async function(){
            let numb = 1;
            await nft.onlyWhitelisted(false);
            // await nft.isWhitelisted(true);
            await nft.connect(acc2).mint(numb);
            expect(await nft.addressMintedBalance(acc2.address)).to.equal(1); //be.revertedWith("not an owner");
        })
    })
    
})
