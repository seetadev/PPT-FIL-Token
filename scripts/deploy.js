const hre = require('hardhat');

async function main() {
  const network = hre.network.name;
  console.log(`\nDeploying to network: ${network}`);

  // Step 1: Deploy PPTToken
  const initialSupply = 200_000_000;
  const pptToken = await hre.ethers.deployContract("PPTToken", [initialSupply]);
  await pptToken.waitForDeployment();
  console.log(`PPTToken deployed at: ${pptToken.target}`);

  // Step 2: Deploy MedInvoiceContract using PPTToken address
  const invoiceContract = await hre.ethers.deployContract("MedInvoiceContract", [pptToken.target]);
  await invoiceContract.waitForDeployment();
  console.log(`MedInvoiceContract deployed at: ${invoiceContract.target}`);

  // Step 3: Verify contracts on block explorer (skip for local hardhat network)
  if (network !== "hardhat" && network !== "localhost") {
    console.log("\nWaiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    try {
      await hre.run("verify:verify", {
        address: pptToken.target,
        constructorArguments: [initialSupply]
      });
      console.log("PPTToken verified.");
    } catch (e) {
      console.warn("PPTToken verification failed:", e.message);
    }

    try {
      await hre.run("verify:verify", {
        address: invoiceContract.target,
        constructorArguments: [pptToken.target]
      });
      console.log("MedInvoiceContract verified.");
    } catch (e) {
      console.warn("MedInvoiceContract verification failed:", e.message);
    }
  }

  console.log("\nDeployment complete.");
  console.log(`  PPTToken:          ${pptToken.target}`);
  console.log(`  MedInvoiceContract: ${invoiceContract.target}`);
}

main()
  .then(() => { process.exit(0); })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
