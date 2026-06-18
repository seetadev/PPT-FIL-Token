const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("PPTToken Contract", () => {
    let pptToken;
    let owner;
    let addr1;
    let addr2;

    const INITIAL_SUPPLY = 1000n;
    const MINTED_SUPPLY = INITIAL_SUPPLY * 10n ** 18n;

    beforeEach(async () => {
        const PPTToken = await ethers.getContractFactory("PPTToken");
        [owner, addr1, addr2] = await ethers.getSigners();

        pptToken = await PPTToken.deploy(INITIAL_SUPPLY);
        await pptToken.waitForDeployment();
    });

    describe('Deployment', () => {
        it('Should set the correct total supply', async () => {
            expect(await pptToken.totalSupply()).to.equal(MINTED_SUPPLY);
        });

        it('Should assign the total supply to the owner', async () => {
            expect(await pptToken.balanceOf(owner.address)).to.equal(MINTED_SUPPLY);
        });

        it('Should set the correct token name and symbol', async () => {
            expect(await pptToken.name()).to.equal("Park Pro Token");
            expect(await pptToken.symbol()).to.equal("PPT");
        });
    });

    describe('Transactions', () => {
        it('Should transfer tokens between accounts', async () => {
            const amount = ethers.parseEther("50");
            await pptToken.transfer(addr1.address, amount);
            expect(await pptToken.balanceOf(addr1.address)).to.equal(amount);

            await pptToken.connect(addr1).transfer(addr2.address, amount);
            expect(await pptToken.balanceOf(addr2.address)).to.equal(amount);
        });

        it('Should fail if sender does not have enough tokens', async () => {
            const initialOwnerBalance = await pptToken.balanceOf(owner.address);

            await expect(
                pptToken.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
            ).to.be.reverted;

            expect(await pptToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it('Should update balances after transfers', async () => {
            const amount = ethers.parseEther("100");
            const initialOwnerBalance = await pptToken.balanceOf(owner.address);

            await pptToken.transfer(addr1.address, amount);

            expect(await pptToken.balanceOf(owner.address)).to.equal(initialOwnerBalance - amount);
            expect(await pptToken.balanceOf(addr1.address)).to.equal(amount);
        });

        it('Should emit Transfer event on transfer', async () => {
            const amount = ethers.parseEther("10");
            await expect(pptToken.transfer(addr1.address, amount))
                .to.emit(pptToken, "Transfer")
                .withArgs(owner.address, addr1.address, amount);
        });
    });

    describe('Allowances', () => {
        it('Should approve and transferFrom correctly', async () => {
            const amount = ethers.parseEther("200");
            await pptToken.approve(addr1.address, amount);
            expect(await pptToken.allowance(owner.address, addr1.address)).to.equal(amount);

            await pptToken.connect(addr1).transferFrom(owner.address, addr2.address, amount);
            expect(await pptToken.balanceOf(addr2.address)).to.equal(amount);
        });

        it('Should fail transferFrom if allowance is insufficient', async () => {
            const amount = ethers.parseEther("100");
            await pptToken.approve(addr1.address, amount);

            await expect(
                pptToken.connect(addr1).transferFrom(owner.address, addr2.address, amount + 1n)
            ).to.be.reverted;
        });
    });
});
