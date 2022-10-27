const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("NFT contract", function(){
    async function deployNFTFixture(){
        const NFT = await ethers.getContractFactory("NFT");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const hardhatNFT = await NFT.deploy();
        await hardhatNFT.deployed();

        return{NFT, hardhatNFT, owner, addr1, addr2};
    }

    describe("Deployment", function(){
        it("Should set the right owner", async function(){
            const {hardhatNFT, owner} = await loadFixture(deployNFTFixture);
            expect(await hardhatNFT.owner().to.equal(owner.address));
        });



    });
})