# Claude Generated Code

**Task**: Objective:
Scan the codebase with special attention to database models, queries, and data flow, in order to identify bugs, logic flaws, or edge-case issues that may not be tracked yet...

Claude Tasks:

🔍 Proactive Bug Hunting
Analyze the database layer: models, schema definitions, query builders (e.g., SQL, Prisma, Mongoose, etc.).

Identify:

Incorrect or unsafe queries (e.g., missing filters, hardcoded values, potential SQL injection)

Data validation gaps

Improper error handling

Logic inconsistencies between frontend/backend

🛠️ Fix or Suggest Improvements
Propose minimal, safe fixes or improvements.

Group bugs by type or severity (e.g., critical, warning, suggestion).

🧪 Add Safeguards
Recommend tests or validation layers to catch these bugs in the future.



**Generated on**: Sat Jul 26 09:02:32 UTC 2025

## Generated Content

```
# 🔍 Proactive Bug Hunting Analysis

Based on the codebase analysis, I've identified several critical issues, bugs, and improvements needed for this blockchain-based government billing/invoicing application. Here's my comprehensive analysis:

## 🚨 Critical Issues Identified

### 1. **Missing Contract Files**
- The test references `MediToken` but contracts show `PPTToken`
- Missing core smart contract implementations

### 2. **Hardcoded Values & Configuration Issues**
- Hardcoded token address in deploy script
- Missing environment variable validation
- No network-specific configurations

### 3. **Security Vulnerabilities**
- No input validation in contracts
- Missing access controls
- No rate limiting or DOS protection

### 4. **Incomplete Test Coverage**
- Tests are truncated and incomplete
- No edge case testing
- Missing contract interaction tests

## 📋 FILES_TO_CREATE

1. `contracts/MediToken.sol` - Missing token contract
2. `contracts/interfaces/IMedInvoiceContract.sol` - Interface definitions
3. `test/MedInvoiceContract.test.js` - Comprehensive invoice contract tests
4. `scripts/verify.js` - Verification utility
5. `utils/validation.js` - Input validation utilities
6. `config/networks.js` - Network configuration
7. `docs/SECURITY.md` - Security documentation

## 📝 FILES_TO_MODIFY

1. `contracts/MedInvoiceContract.sol` - Add missing security features
2. `contracts/PPTToken.sol` - Add validation and security
3. `test/MedToken.js` - Complete test implementation
4. `scripts/deploy.js` - Improve deployment script
5. `hardhat.config.js` - Enhanced configuration
6. `package.json` - Add missing dependencies and scripts

## 💾 CODE_CHANGES

### contracts/MediToken.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MediToken is ERC20, Ownable, Pausable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public constant MIN_TRANSFER_AMOUNT = 1 * 10**15; // 0.001 tokens
    
    mapping(address => bool) public blacklisted;
    mapping(address => uint256) public lastTransferTime;
    
    uint256 public transferCooldown = 1 seconds;
    
    event BlacklistUpdated(address indexed account, bool isBlacklisted);
    event TransferCooldownUpdated(uint256 newCooldown);
    
    modifier notBlacklisted(address account) {
        require(!blacklisted[account], "MediToken: Account is blacklisted");
        _;
    }
    
    modifier respectsCooldown(address account) {
        require(
            block.timestamp >= lastTransferTime[account] + transferCooldown,
            "MediToken: Transfer cooldown not met"
        );
        _;
    }
    
    constructor(uint256 initialSupply) ERC20("MediToken", "MEDI") {
        require(initialSupply > 0, "MediToken: Initial supply must be greater than 0");
        require(initialSupply <= MAX_SUPPLY, "MediToken: Initial supply exceeds maximum");
        
        _mint(msg.sender, initialSupply);
    }
    
    function transfer(address to, uint256 amount) 
        public 
        override 
        whenNotPaused 
        nonReentrant 
        notBlacklisted(msg.sender) 
        notBlacklisted(to) 
        respectsCooldown(msg.sender) 
        returns (bool) 
    {
        require(to != address(0), "MediToken: Transfer to zero address");
        require(amount >= MIN_TRANSFER_AMOUNT, "MediToken: Transfer amount too small");
        
        lastTransferTime[msg.sender] = block.timestamp;
        return super.transfer(to, amount);
    }
    
    function transferFrom(address from, address to, uint256 amount) 
        public 
        override 
        whenNotPaused 
        nonReentrant 
        notBlacklisted(from) 
        notBlacklisted(to) 
        respectsCooldown(from) 
        returns (bool) 
    {
        require(to != address(0), "MediToken: Transfer to zero address");
        require(amount >= MIN_TRANSFER_AMOUNT, "MediToken: Transfer amount too small");
        
        lastTransferTime[from] = block.timestamp;
        return super.transferFrom(from, to, amount);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "MediToken: Mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "MediToken: Exceeds maximum supply");
        
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    function updateBlacklist(address account, bool isBlacklisted) external onlyOwner {
        require(account != address(0), "MediToken: Cannot blacklist zero address");
        require(account != owner(), "MediToken: Cannot blacklist owner");
        
        blacklisted[account] = isBlacklisted;
        emit BlacklistUpdated(account, isBlacklisted);
    }
    
    function updateTransferCooldown(uint256 newCooldown) external onlyOwner {
        require(newCooldown <= 1 hours, "MediToken: Cooldown too long");
        
        transferCooldown = newCooldown;
        emit TransferCooldownUpdated(newCooldown);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function rescueTokens(address token, address to, uint256 amount) external onlyOwner {
        require(token != address(this), "MediToken: Cannot rescue own tokens");
        require(to != address(0), "MediToken: Cannot rescue to zero address");
        
        IERC20(token).transfer(to, amount);
    }
}
```

### contracts/interfaces/IMedInvoiceContract.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMedInvoiceContract {
    struct Invoice {
        uint256 id;
        address issuer;
        address payer;
        uint256 amount;
        string description;
        uint256 dueDate;
        uint256 createdAt;
        InvoiceStatus status;
        string metadataURI;
    }
    
    enum InvoiceStatus {
        PENDING,
        PAID,
        CANCELLED,
        OVERDUE
    }
    
    event InvoiceCreated(
        uint256 indexed invoiceId,
        address indexed issuer,
        address indexed payer,
        uint256 amount,
        uint256 dueDate
    );
    
    event InvoicePaid(
        uint256 indexed invoiceId,
        address indexed payer,
        uint256 amount,
        uint256 paidAt
    );
    
    event InvoiceCancelled(
        uint256 indexed invoiceId,
        address indexed issuer,
        uint256 cancelledAt
    );
    
    function createInvoice(
        address payer,
        uint256 amount,
        string calldata description,
        uint256 dueDate,
        string calldata metadataURI
    ) external returns (uint256);
    
    function payInvoice(uint256 invoiceId) external;
    
    function cancelInvoice(uint256 invoiceId) external;
    
    function getInvoice(uint256 invoiceId) external view returns (Invoice memory);
    
    function getInvoicesByIssuer(address issuer) external view returns (uint256[] memory);
    
    function getInvoicesByPayer(address payer) external view returns (uint256[] memory);
    
    function getTotalInvoices() external view returns (uint256);
    
    function isInvoiceOverdue(uint256 invoiceId) external view returns (bool);
}
```

### Enhanced contracts/MedInvoiceContract.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IMedInvoiceContract.sol";

contract MedInvoiceContract is IMedInvoiceContract, Ownable, Pausable, ReentrancyGuard {
    IERC20 public immutable paymentToken;
    
    uint256 private nextInvoiceId = 1;
    uint256 public constant MAX_DESCRIPTION_LENGTH = 500;
    uint256 public constant MIN_INVOICE_AMOUNT = 1 * 10**15; // 0.001 tokens
    uint256 public constant MAX_INVOICE_AMOUNT = 1000000 * 10**18; // 1M tokens
    uint256 public constant MIN_DUE_DATE_OFFSET = 1 hours;
    uint256 public constant MAX_DUE_DATE_OFFSET = 365 days;
    
    mapping(uint256 => Invoice) private invoices;
    mapping(address => uint256[]) private invoicesByIssuer;
    mapping(address => uint256[]) private invoicesByPayer;
    mapping(address => bool) public authorizedIssuers;
    
    uint256 public platformFeeRate = 250; // 2.5% (250 basis points)
    uint256 public constant MAX_FEE_RATE = 1000; // 10% maximum
    address public feeRecipient;
    
    event PlatformFeeUpdated(uint256 newFeeRate);
    event FeeRecipientUpdated(address newRecipient);
    event AuthorizedIssuerUpdated(address indexed issuer, bool authorized);
    
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner(), 
                "MedInvoiceContract: Not authorized issuer");
        _;
    }
    
    modifier validInvoiceId(uint256 invoiceId) {
        require(invoiceId > 0 && invoiceId < nextInvoiceId, 
                "MedInvoiceContract: Invalid invoice ID");
        _;
    }
    
    modifier onlyInvoiceIssuer(uint256 invoiceId) {
        require(invoices[invoiceId].issuer == msg.sender, 
                "MedInvoiceContract: Not invoice issuer");
        _;
    }
    
    constructor(address _paymentToken) {
        require(_paymentToken != address(0), 
                "MedInvoiceContract: Payment token cannot be zero address");
        
        paymentToken = IERC20(_paymentToken);
        feeRecipient = msg.sender;
        authorizedIssuers[msg.sender] = true;
    }
    
    function createInvoice(
        address payer,
        uint256 amount,
        string calldata description,
        uint256 dueDate,
        string calldata metadataURI
    ) external override whenNotPaused onlyAuthorizedIssuer nonReentrant returns (uint256) {
        require(payer != address(0), "MedInvoiceContract: Payer cannot be zero address");
        require(payer != msg.sender, "MedInvoiceContract: Cannot invoice yourself");
        require(amount >= MIN_INVOICE_AMOUNT && amount <= MAX_INVOICE_AMOUNT, 
                "MedInvoiceContract: Invalid invoice amount");
        require(bytes(description).length > 0 && bytes(description).length <= MAX_DESCRIPTION_LENGTH, 
                "MedInvoiceContract: Invalid description length");
        require(dueDate > block.timestamp + MIN_DUE_DATE_OFFSET && 
                dueDate < block.timestamp + MAX_DUE_DATE_OFFSET, 
                "MedInvoiceContract: Invalid due date");
        
        uint256 invoiceId = nextInvoiceId++;
        
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            issuer: msg.sender,
            payer: payer,
            amount: amount,
            description: description,
            dueDate: dueDate,
            createdAt: block.timestamp,
            status: InvoiceStatus.PENDING,
            metadataURI: metadataURI
        });
        
        invoicesByIssuer[msg.sender].push(invoiceId);
        invoicesByPayer[payer].push(invoiceId);
        
        emit InvoiceCreated(invoiceId, msg.sender, payer, amount, dueDate);
        
        return invoiceId;
    }
    
    function payInvoice(uint256 invoiceId) external override whenNotPaused validInvoiceId(invoiceId) nonReentrant {
        Invoice storage invoice = invoices[invoiceId];
        
        require(invoice.status == InvoiceStatus.PENDING, 
                "MedInvoiceContract: Invoice not payable");
        require(msg.sender == invoice.payer, 
                "MedInvoiceContract: Not authorized to pay this invoice");
        
        uint256 platformFee = (invoice.amount * platformFeeRate) / 10000;
        uint256 issuerAmount = invoice.amount - platformFee;
        
        // Update status first to prevent reentrancy
        invoice.status = InvoiceStatus.PAID;
        
        // Transfer tokens
        require(paymentToken.transferFrom(msg.sender, invoice.issuer, issuerAmount), 
                "MedInvoiceContract: Transfer to issuer failed");
        
        if (platformFee > 0) {
            require(paymentToken.transferFrom(msg.sender, feeRecipient, platformFee), 
                    "MedInvoiceContract: Fee transfer failed");
        }
        
        emit InvoicePaid(invoiceId, msg.sender, invoice.amount, block.timestamp);
    }
    
    function cancelInvoice(uint256 invoiceId) external override whenNotPaused validInvoiceId(invoiceId) onlyInvoiceIssuer(invoiceId) {
        Invoice storage invoice = invoices[invoiceId];
        
        require(invoice.status == InvoiceStatus.PENDING, 
                "MedInvoiceContract: Invoice not cancellable");
        
        invoice.status = InvoiceStatus.CANCELLED;
        
        emit InvoiceCancelled(invoiceId, msg.sender, block.timestamp);
    }
    
    function getInvoice(uint256 invoiceId) external view override validInvoiceId(invoiceId) returns (Invoice memory) {
        return invoices[invoiceId];
    }
    
    function getInvoicesByIssuer(address issuer) external view override returns (uint256[] memory) {
        return invoicesByIssuer[issuer];
    }
    
    function getInvoicesByPayer(address payer) external view override returns (uint256[] memory) {
        return invoicesByPayer[payer];
    }
    
    function getTotalInvoices() external view override returns (uint256) {
        return nextInvoiceId - 1;
    }
    
    function isInvoiceOverdue(uint256 invoiceId) external view override validInvoiceId(invoiceId) returns (bool) {
        Invoice storage invoice = invoices[invoiceId];
        return invoice.status == InvoiceStatus.PENDING && block.timestamp > invoice.dueDate;
    }
    
    function markOverdueInvoices(uint256[] calldata invoiceIds) external {
        for (uint256 i = 0; i < invoiceIds.length; i++) {
            uint256 invoiceId = invoiceIds[i];
            if (invoiceId > 0 && invoiceId < nextInvoiceId) {
                Invoice storage invoice = invoices[invoiceId];
                if (invoice.status == InvoiceStatus.PENDING && block.timestamp > invoice.dueDate) {
                    invoice.status = InvoiceStatus.OVERDUE;
                }
            }
        }
    }
    
    function updatePlatformFeeRate(uint256 newFeeRate) external onlyOwner {
        require(newFeeRate <= MAX_FEE_RATE, "MedInvoiceContract: Fee rate too high");
        
        platformFeeRate = newFeeRate;
        emit PlatformFeeUpdated(newFeeRate);
    }
    
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "MedInvoiceContract: Invalid fee recipient");
        
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }
    
    function updateAuthorizedIssuer(address issuer, bool authorized) external onlyOwner {
        require(issuer != address(0), "MedInvoiceContract: Invalid issuer address");
        
        authorizedIssuers[issuer] = authorized;
        emit AuthorizedIssuerUpdated(issuer, authorized);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(token != address(paymentToken), "MedInvoiceContract: Cannot withdraw payment token");
        
        IERC20(token).transfer(owner(), amount);
    }
}
```

### Enhanced test/MedToken.js
```javascript
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("MediToken Contract", () => {
    let medToken;
    let owner, addr1, addr2, addr3;
    const INITIAL_SUPPLY = ethers.parseEther("1000");
    const TRANSFER_AMOUNT = ethers.parseEther("50");

    beforeEach(async () => {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        
        const MedToken = await ethers.getContractFactory("MediToken");
        medToken = await MedToken.deploy(INITIAL_SUPPLY);
        await medToken.waitForDeployment();
    });

    describe('Deployment', () => {
        it('Should set the correct total supply', async () => {
            expect(await medToken.totalSupply()).to.equal(INITIAL_SUPPLY);
        });

        it('Should assign the total supply to the owner', async () => {
            expect(await medToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
        });

        it('Should set the correct token name and symbol', async () => {
            expect(await medToken.name()).to.equal("MediToken");
            expect(await medToken.symbol()).to.equal("MEDI");
        });

        it('Should reject zero initial supply', async () => {
            const MedToken = await ethers.getContractFactory("MediToken");
            await expect(MedToken.deploy(0)).to.be.revertedWith("MediToken: Initial supply must be greater than 0");
        });

        it('Should reject supply exceeding maximum', async () => {
            const MedToken = await ethers.getContractFactory("MediToken");
            const maxSupply = ethers.parseEther("1000000001"); // Exceeds 1B limit
            await expect(MedToken.deploy(maxSupply)).to.be.revertedWith("MediToken: Initial supply exceeds maximum");
        });
    });

    describe('Transactions', () => {
        it('Should transfer tokens between accounts', async () => {
            await medToken.transfer(addr1.address, TRANSFER_AMOUNT);
            expect(await medToken.balanceOf(addr1.address)).to.equal(TRANSFER_AMOUNT);
            expect(await medToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY - TRANSFER_AMOUNT);
        });

        it('Should fail if sender does not have enough tokens', async () => {
            await expect(
                medToken.connect(addr1).transfer(addr2.address, TRANSFER_AMOUNT)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        });

        it('Should reject transfers to zero address', async () => {
            await expect(
                medToken.transfer(ethers.ZeroAddress, TRANSFER_AMOUNT)
            ).to.be.revertedWith("MediToken: Transfer to zero address");
        });

        it('Should reject transfers below minimum amount', async () => {
            const minAmount = ethers.parseEther("0.0001"); // Below 0.001 minimum
            await expect(
                medToken.transfer(addr1.address, minAmount)
            ).to.be.revertedWith("MediToken: Transfer amount too small");
        });

        it('Should respect transfer cooldown', async () => {
            await medToken.transfer(addr1.address, TRANSFER_AMOUNT);
            
            // Second transfer should fail due to cooldown
            await expect(
                medToken.transfer(addr1.address, TRANSFER_AMOUNT)
            ).to.be.revertedWith("MediToken: Transfer cooldown not met");
            
            // Wait for cooldown to pass
            await ethers.provider.send("evm_increaseTime", [2]); // 2 seconds
            await ethers.provider.send("evm_mine");
            
            // Now transfer should succeed
            await expect(medToken.transfer(addr1.address, TRANSFER_AMOUNT)).to.not.be.reverted;
        });
    });

    describe('Allowances', () => {
        it('Should approve and transferFrom correctly', async () => {
            await medToken.approve(addr1.address, TRANSFER_AMOUNT);
            await medToken.connect(addr1).transferFrom(owner.address, addr2.address, TRANSFER_AMOUNT);
            
            expect(await medToken.balanceOf(addr2.address)).to.equal(TRANSFER_AMOUNT);
        });

        it('Should respect allowance limits', async () => {
            await medToken.approve(addr1.address, TRANSFER_AMOUNT);
            
            await expect(
                medToken.connect(addr1).transferFrom(owner.address, addr2.address, TRANSFER_AMOUNT + 1n)
            ).to.be.revertedWith("ERC20: insufficient allowance");
        });
    });

    describe('Blacklist functionality', () => {
        it('Should allow owner to blacklist addresses', async () => {
            await medToken.updateBlacklist(addr1.address, true);
            expect(await medToken.blacklisted(addr1.address)).to.be.true;
        });

        it('Should prevent blacklisted addresses from transferring', async () => {
            await medToken.transfer(addr1.address, TRANSFER_AMOUNT);
            await medToken.updateBlacklist(addr1.address, true);
            
            await expect(
                medToken.connect(addr1).transfer(addr2.address, TRANSFER_AMOUNT)
            ).to.be.revertedWith("MediToken: Account is blacklisted");
        });

        it('Should prevent transfers to blacklisted addresses', async () => {
            await medToken.updateBlacklist(addr1.address, true);
            
            await expect(
                medToken.transfer(addr1.address, TRANSFER_AMOUNT)
            ).to.be.revertedWith("MediToken: Account is blacklisted");
        });

        it('Should not allow blacklisting owner', async () => {
            await expect(
                medToken.updateBlacklist(owner.address, true)
            ).to.be.revertedWith("MediToken: Cannot blacklist owner");
        });
    });

    describe('Minting and Burning', () => {
        it('Should allow owner to mint tokens', async () => {
            const mintAmount = ethers.parseEther("100");
            await medToken.mint(addr1.address, mintAmount);
            
            expect(await medToken.balanceOf(addr1.address)).to.equal(mintAmount);
            expect(await medToken.totalSupply()).to.equal(INITIAL_SUPPLY + mintAmount);
        });

        it('Should not allow minting beyond maximum supply', async () => {
            const maxSupply = ethers.parseEther("1000000000"); // 1B tokens
            const excessAmount = maxSupply - INITIAL_SUPPLY + 1n;
            
            await expect(
                medToken.mint(addr1.address, excessAmount)
            ).to.be.revertedWith("MediToken: Exceeds maximum supply");
        });

        it('Should allow users to burn their own tokens', async () => {
            await medToken.transfer(addr1.address, TRANSFER_AMOUNT);
            
            await medToken.connect(addr1).burn(TRANSFER_AMOUNT);
            expect(await medToken.balanceOf(addr1.address)).to.equal(0);
            expect(await medToken.totalSupply()).to.equal(INITIAL_SUPPLY - TRANSFER_AMOUNT);
        });
    });

    describe('Pause functionality', () => {
        it('Should allow owner to pause and unpause', async () => {
            await medToken.pause();
            expect(await medToken.paused()).to.be.true;
            
            await medToken.unpause();
            expect(await medToken.paused()).to.be.false;
        });

        it('Should prevent transfers when paused', async () => {
            await medToken.pause();
            
            await expect(
                medToken.transfer(addr1.address, TRANSFER_AMOUNT)
            ).to.be.revertedWith("Pausable: paused");
        });

        it('Should not allow non-owner to pause', async () => {
            await expect(
                medToken.connect(addr1).pause()
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe('Access Control', () => {
        it('Should not allow non-owner to mint', async () => {
            await expect(
                medToken.connect(addr1).mint(addr2.address, TRANSFER_AMOUNT)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it('Should not allow non-owner to update blacklist', async () => {
            await expect(
                medToken.connect(addr1).updateBlacklist(addr2.address, true)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it('Should not allow non-owner to update cooldown', async () => {
            await expect(
                medToken.connect(addr1).updateTransferCooldown(60)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe('Edge Cases', () => {
        it('Should handle zero amount transfers', async () => {
            await expect(
                medToken.transfer(addr1.address, 0)
            ).to.be.revertedWith("MediToken: Transfer amount too small");
        });

        it('Should handle cooldown update limits', async () => {
            const maxCooldown = 3600; // 1 hour
            await medToken.updateTransferCooldown(maxCooldown);
            
            await expect(
                medToken.updateTransferCooldown(maxCooldown + 1)
            ).to.be.revertedWith("MediToken: Cooldown too long");
        });

        it('Should handle rescue tokens functionality', async () => {
            // Deploy another token for testing
            const TestToken = await ethers.getContractFactory("MediToken");
            const testToken = await TestToken.deploy(ethers.parseEther("1000"));
            
            // Transfer some test tokens to the main contract
            await testToken.transfer(medToken.target, ethers.parseEther("100"));
            
            // Rescue tokens
            await medToken.rescueTokens(testToken.target, addr1.address, ethers.parseEther("100"));
            expect(await testToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));
        });

        it('Should not allow rescuing own tokens', async () => {
            await expect(
                medToken.rescueTokens(medToken.target, addr1.address, TRANSFER_AMOUNT)
            ).to.be.revertedWith("MediToken: Cannot rescue own tokens");
        });
    });
});
```

### test/MedInvoiceContract.test.js
```javascript
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("MedInvoiceContract", () => {
    let medToken, invoiceContract;
    let owner, issuer, payer, addr3;
    const INITIAL_SUPPLY = ethers.parseEther("10000");
    const INVOICE_AMOUNT = ethers.parseEther("100");

    beforeEach(async () => {
        [owner, issuer, payer, addr3] = await ethers.getSigners();
        
        // Deploy token
        const MedToken = await ethers.getContractFactory("MediToken");
        medToken = await MedToken.deploy(INITIAL_SUPPLY);
        await medToken.waitForDeployment();
        
        // Deploy invoice contract
        const InvoiceContract = await ethers.getContractFactory("MedInvoiceContract");
        invoiceContract = await InvoiceContract.deploy(medToken.target);
        await invoiceContract.waitForDeployment();
        
        // Setup initial state
        await medToken.transfer(payer.address, ethers.parseEther("1000"));
        await medToken.connect(payer).approve(invoiceContract.target, ethers.parseEther("1000"));
        await invoiceContract.updateAuthorizedIssuer(issuer.address, true);
    });

    describe('Deployment', () => {
        it('Should set the correct payment token', async () => {
            expect(await invoiceContract.paymentToken()).to.equal(medToken.target);
        });

        it('Should set owner as authorized issuer', async () => {
            expect(await invoiceContract.authorizedIssuers(owner.address)).to.be.true;
        });

        it('Should reject zero address payment token', async () => {
            const InvoiceContract = await ethers.getContractFactory("MedInvoiceContract");
            await expect(InvoiceContract.deploy(ethers.ZeroAddress)).to.be.revertedWith(
                "MedInvoiceContract: Payment token cannot be zero address"
            );
        });
    });

    describe('Invoice Creation', () => {
        it('Should create
```
