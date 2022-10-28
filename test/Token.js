const { expect } = require("chai");
// const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

// describe("NFT contract", function(){

//     it("shold return correct name", async function(){
//         const myContract = await hre.ethers.getContractFactory("NFT");
//         const myContractDeployed = await myContract.deploy("MyContractName", "TNT", "https://fdf",  "https://fdf");
//         await myContractDeployed.deployed();

//         expect(await myContract.name().to.equal("MyContractName"))
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
        console.log(nft.name);
    })

    it("should be deployed", async function(){
        expect(await nft.name().to.equal("TNT"));
    })
})


// describe("NFT contract", function(){
//     async function deployNFTFixture(){
//         const NFT = await ethers.getContractFactory("NFT");
//         const [owner, addr1, addr2] = await ethers.getSigners();

//         const hardhatNFT = await NFT.deploy("MyContractName", "TNT", "https://fdf",  "https://fdf");
//         await hardhatNFT.deployed();

//         return{NFT, hardhatNFT, owner, addr1, addr2};
//     }

//     describe("Deployment", function(){
//         it("Should set the right owner", async function(){
//             const {hardhatNFT, owner} = await loadFixture(deployNFTFixture);
//             expect(await hardhatNFT.owner().to.equal(owner.address));
//         });



//     });
// })