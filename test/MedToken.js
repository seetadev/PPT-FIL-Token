const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("MediToken Contract", () => {
    let medToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async () => {
        const MedToken = await ethers.getContractFactory("MediToken");
        [owner, addr1, addr2] = await ethers.getSigners();

        medToken = await MedToken.deploy(1000); 
        await medToken.waitForDeployment();
    });

    describe('Deployment', () => {
        it('Should set the correct total supply', async () => {
            expect(await medToken.totalSupply()).to.equal(1000);
        });

        it('Should assign the total supply to the owner', async () => {
            expect(await medToken.balanceOf(owner.address)).to.equal(1000);
        });
    });

    describe('Transactions', () => {
        it('Should transfer tokens between accounts', async () => {
            await medToken.transfer(addr1.address, 50);
            expect(await medToken.balanceOf(addr1.address)).to.equal(50);

            await medToken.connect(addr1).transfer(addr2.address, 50);
            expect(await medToken.balanceOf(addr2.address)).to.equal(50);
        });

        it('Should fail if sender doesn’t have enough tokens', async () => {
            const initialOwnerBalance = await medToken.balanceOf(owner.address);

            await expect(
                medToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.reverted;

            expect(await medToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it('Should update balances after transfers', async () => {
            const initialOwnerBalance = await medToken.balanceOf(owner.address);

            await medToken.transfer(addr1.address, 100);

            const finalOwnerBalance = await medToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(100));

            const addr1Balance = await medToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);
        });
    });
});