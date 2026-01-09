const hre = require('hardhat')

async function main() {
  const pptToken = await hre.ethers.deployContract("PPTToken",[20_000])
  await pptToken.waitForDeployment();

    console.log(
        `PPTToken token deployed to ${pptToken.target}`
    );
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});