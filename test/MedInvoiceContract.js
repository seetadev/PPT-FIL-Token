const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("MedInvoiceContract", () => {
    let pptToken;
    let invoiceContract;
    let owner;
    let subscriber;
    let nonSubscriber;

    const INITIAL_SUPPLY = 1_000_000n;
    const SUBSCRIPTION_AMOUNT = ethers.parseEther("10");

    beforeEach(async () => {
        [owner, subscriber, nonSubscriber] = await ethers.getSigners();

        const PPTToken = await ethers.getContractFactory("PPTToken");
        pptToken = await PPTToken.deploy(INITIAL_SUPPLY);
        await pptToken.waitForDeployment();

        const MedInvoice = await ethers.getContractFactory("MedInvoiceContract");
        invoiceContract = await MedInvoice.deploy(await pptToken.getAddress());
        await invoiceContract.waitForDeployment();

        // Fund subscriber and contract with tokens so subscribe() works
        await pptToken.transfer(subscriber.address, SUBSCRIPTION_AMOUNT * 10n);
        await pptToken.transfer(await invoiceContract.getAddress(), SUBSCRIPTION_AMOUNT * 100n);

        // subscriber approves the contract to pull tokens
        await pptToken.connect(subscriber).approve(await invoiceContract.getAddress(), SUBSCRIPTION_AMOUNT);
    });

    describe("Deployment", () => {
        it("Should set pptToken address correctly", async () => {
            expect(await invoiceContract.pptToken()).to.equal(await pptToken.getAddress());
        });

        it("Should set the deployer as owner", async () => {
            expect(await invoiceContract.owner()).to.equal(owner.address);
        });

        it("Should have correct SUBSCRIPTION_AMOUNT", async () => {
            expect(await invoiceContract.SUBSCRIPTION_AMOUNT()).to.equal(SUBSCRIPTION_AMOUNT);
        });
    });

    describe("subscribe()", () => {
        it("Should allow a user to subscribe when they have approved tokens", async () => {
            await invoiceContract.connect(subscriber).subscribe();
            expect(await invoiceContract.isSubscribed(subscriber.address)).to.be.true;
        });

        it("Should emit NewSubscription event", async () => {
            await expect(invoiceContract.connect(subscriber).subscribe())
                .to.emit(invoiceContract, "NewSubscription")
                .withArgs(subscriber.address, (endTime) => endTime > 0n);
        });

        it("Should set subscription end time ~365 days from now", async () => {
            const tx = await invoiceContract.connect(subscriber).subscribe();
            const receipt = await tx.wait();
            const block = await ethers.provider.getBlock(receipt.blockNumber);
            const endTime = await invoiceContract.subscriptionEndTimes(subscriber.address);
            const expected = BigInt(block.timestamp) + BigInt(365 * 24 * 60 * 60);
            expect(endTime).to.equal(expected);
        });

        it("Should revert if user is already subscribed", async () => {
            await invoiceContract.connect(subscriber).subscribe();
            await pptToken.connect(subscriber).approve(await invoiceContract.getAddress(), SUBSCRIPTION_AMOUNT);
            await expect(
                invoiceContract.connect(subscriber).subscribe()
            ).to.be.revertedWith("Already subscribed");
        });

        it("Should revert if contract has insufficient token balance to send", async () => {
            // Deploy a fresh contract with no token balance to confirm transfer failure
            const MedInvoice = await ethers.getContractFactory("MedInvoiceContract");
            const emptyContract = await MedInvoice.deploy(await pptToken.getAddress());
            await emptyContract.waitForDeployment();
            await expect(
                emptyContract.connect(nonSubscriber).subscribe()
            ).to.be.reverted;
        });
    });

    describe("saveFile()", () => {
        it("Should allow token holder to save a file", async () => {
            await invoiceContract.connect(subscriber).saveFile("ipfs://Qm123");
            const files = await invoiceContract.connect(subscriber).getFiles();
            expect(files).to.include("ipfs://Qm123");
        });

        it("Should emit FileSaved event", async () => {
            await expect(invoiceContract.connect(subscriber).saveFile("ipfs://Qm123"))
                .to.emit(invoiceContract, "FileSaved")
                .withArgs(subscriber.address, "ipfs://Qm123", (ts) => ts > 0n);
        });

        it("Should revert if file content is empty", async () => {
            await expect(
                invoiceContract.connect(subscriber).saveFile("")
            ).to.be.revertedWith("File content cannot be empty");
        });

        it("Should revert if caller holds no PPT tokens", async () => {
            await expect(
                invoiceContract.connect(nonSubscriber).saveFile("ipfs://Qm123")
            ).to.be.revertedWith("You need to hold a MediToken to save.");
        });

        it("Should allow saving multiple files", async () => {
            await invoiceContract.connect(subscriber).saveFile("ipfs://file1");
            await invoiceContract.connect(subscriber).saveFile("ipfs://file2");
            const files = await invoiceContract.connect(subscriber).getFiles();
            expect(files.length).to.equal(2);
        });
    });

    describe("getFiles()", () => {
        it("Should return files for a token holder", async () => {
            await invoiceContract.connect(subscriber).saveFile("ipfs://Qm999");
            const files = await invoiceContract.connect(subscriber).getFiles();
            expect(files[0]).to.equal("ipfs://Qm999");
        });

        it("Should revert if caller holds no PPT tokens", async () => {
            await expect(
                invoiceContract.connect(nonSubscriber).getFiles()
            ).to.be.revertedWith("You need to hold a MediToken to view saved files.");
        });

        it("Should return empty array for a new token holder with no files", async () => {
            const files = await invoiceContract.connect(subscriber).getFiles();
            expect(files.length).to.equal(0);
        });
    });

    describe("isSubscribed() / getSubscriptionDetails()", () => {
        it("Should return false for a non-subscriber", async () => {
            expect(await invoiceContract.isSubscribed(nonSubscriber.address)).to.be.false;
        });

        it("Should return true after subscribing", async () => {
            await invoiceContract.connect(subscriber).subscribe();
            expect(await invoiceContract.isSubscribed(subscriber.address)).to.be.true;
        });

        it("getSubscriptionDetails should return exists=false for new user", async () => {
            const [exists] = await invoiceContract.connect(nonSubscriber).getSubscriptionDetails();
            expect(exists).to.be.false;
        });

        it("getSubscriptionDetails should return exists=true after subscribe", async () => {
            await invoiceContract.connect(subscriber).subscribe();
            const [exists, endTime] = await invoiceContract.connect(subscriber).getSubscriptionDetails();
            expect(exists).to.be.true;
            expect(endTime).to.be.gt(0n);
        });
    });

    describe("getUserTokens()", () => {
        it("Should return the caller's token balance", async () => {
            const balance = await invoiceContract.connect(subscriber).getUserTokens();
            expect(balance).to.equal(SUBSCRIPTION_AMOUNT * 10n);
        });
    });

    describe("withdrawTokens()", () => {
        it("Should allow owner to withdraw tokens", async () => {
            const contractBalance = await pptToken.balanceOf(await invoiceContract.getAddress());
            const ownerBefore = await pptToken.balanceOf(owner.address);
            await invoiceContract.connect(owner).withdrawTokens(contractBalance);
            expect(await pptToken.balanceOf(owner.address)).to.equal(ownerBefore + contractBalance);
        });

        it("Should revert if called by non-owner", async () => {
            await expect(
                invoiceContract.connect(subscriber).withdrawTokens(1n)
            ).to.be.revertedWithCustomError(invoiceContract, "OwnableUnauthorizedAccount");
        });

        it("Should revert if withdrawing more than contract balance", async () => {
            const contractBalance = await pptToken.balanceOf(await invoiceContract.getAddress());
            await expect(
                invoiceContract.connect(owner).withdrawTokens(contractBalance + 1n)
            ).to.be.reverted;
        });
    });
});
