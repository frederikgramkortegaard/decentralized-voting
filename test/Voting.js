const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");


describe("Voting Factory", function () {

  async function deployFixture() {
    const contractFactory = await ethers.getContractFactory("PollFactory");
    const contractInstance = await contractFactory.deploy();
    return { contractInstance };
  }

  it("Should deploy Voting Factory", async function () {
    const { contractInstance } = await deployFixture();

    // Ensure proper deployment
    expect(await contractInstance.getPolls()).to.deep.equal([]);
  });

  it("Create Poll", async function () {
    const { contractInstance } = await deployFixture();

    // Create a new poll
    const poll = await contractInstance.makePoll("Test", ["1", "2", "3"], 5);
    // Get the address of the new poll
    const pollAddress = await contractInstance.polls(0);
    // Get contract at address
    const pollContract = await ethers.getContractAt("Poll", pollAddress);
    // Cast a vote
    await pollContract.vote("1");
    // Get the votes
    expect(await pollContract.getVotes("1")).to.equal(1);
  });
});
describe("Voting", function () {

  async function deployFixture() {
    const contractFactory = await ethers.getContractFactory("Poll");
    const contractInstance = await contractFactory.deploy("Test", ["1", "2", "3"], 5, []);
    return { contractInstance };
  }

  it("Should deploy Voting", async function () {
    const { contractInstance } = await deployFixture();

    // Ensure proper deployment
    expect(await contractInstance.getQuestion()).to.equal("Test");
    expect(await contractInstance.getOptions()).to.deep.equal(["1", "2", "3"]);
    expect(await contractInstance.getVotes("1")).to.equal(0);
  });

  it("Valid Voting", async function () {
    const { contractInstance } = await deployFixture();

    // Vote for the first option
    await contractInstance.vote("1");
    expect(await contractInstance.getVotes("1")).to.equal(1);

    // Attempt to vote again (should err)
    await expect(contractInstance.vote("1")).to.be.revertedWith("Already voted");

    // Attempt to vote for the second option (should err)
    await expect(contractInstance.vote("2")).to.be.revertedWith("Already voted");

    // Get the votes (Expect 1 for the first option)
    expect(await contractInstance.getVotes("1")).to.equal(1);
    expect(await contractInstance.getVotes("2")).to.equal(0);
    expect(await contractInstance.getVotes("3")).to.equal(0);

  });

  it("Paused Voting", async function () {
    const { contractInstance } = await deployFixture();

    // Pause the contract
    await contractInstance.changePauseState();

    // Attempt to vote (should err)
    await expect(contractInstance.vote("1")).to.be.revertedWith("The contract is paused");

    // Unpause the contract
    await contractInstance.changePauseState();

    // Vote for the first option
    await contractInstance.vote("1");
    expect(await contractInstance.getVotes("1")).to.equal(1);

  });

  it("Verify Winner", async function () {
    const { contractInstance } = await deployFixture();

    // Vote for the first option
    await contractInstance.vote("1");
    expect(await contractInstance.getVotes("1")).to.equal(1);

    // Get the winner
    expect(await contractInstance.getWinner()).to.equal("1");

  });

  it("Timelock", async function () {

    const { contractInstance } = await deployFixture();

    // Wait for 5 seconds
    await time.increase(5);

    // Attempt to vote
    await expect(contractInstance.vote("1")).to.be.revertedWith("The poll has ended");

  });

  it("Info", async function () {
    const { contractInstance } = await deployFixture();
    const info = await contractInstance.getAllInfo();
    console.log(info);

    // Pretty get votes
    const votes = await contractInstance.prettyGetVotes();
    console.log(votes);

  });

});
