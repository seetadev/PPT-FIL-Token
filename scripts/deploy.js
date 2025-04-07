const hre = require('hardhat')

async function main(){

  // const contract = await hre.ethers.deployContract("PPTToken",[200_000_000])
  // await contract.waitForDeployment();

  // console.log("Contract deployed at : ",contract.target);

  // console.log("Waiting 30 seconds before verification...")
  // await new Promise(resolve => setTimeout(resolve, 30000));
  
  // await hre.run("verify:verify",{
  //   address : contract.target,
  //   constructorArguments : [200_000_000]
  // })

  const invoiceContract = await hre.ethers.deployContract("MedInvoiceContract",["0xC00BBC9A2C88712dC1e094866973F036373C7134"])
  await invoiceContract.waitForDeployment();

  console.log("Contract deployed at : ",invoiceContract.target);

  console.log("Waiting 30 seconds before verification...")
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  // await hre.run("verify:verify",{
  //   address : invoiceContract.target,
  //   constructorArguments : [contract.target]
  // })

}


main()
.then(()=>{process.exit(0)})
.catch((error)=>{
  console.log(error);
  process.exit(1);
})