/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');


describe('Aeternam Token', async function () {
  let dev, owner, alice, Aeternam, aeternam, Ico, ico;
  const NAME = 'Aeternam';
  const SYMBOL = 'AETER';
  const INIT_SUPPLY = ethers.utils.parseEther('10000000000');
  const ICO_START_TIME = 1628410088; /* 1628410088 is 08/08/2021 at 8h8m8s GMT time */
  const ICO_END_TIME = 1629101288; /* 1629101288 is 08/16/2021 at 8h8m8s GMT time */
  const RATE = 10 ** 9;
  beforeEach(async function () {
    [dev, owner, alice, ico] = await ethers.getSigners();
    Aeternam = await ethers.getContractFactory('Aeternam');
    aeternam = await Aeternam.connect(dev).deploy(owner.address, INIT_SUPPLY);
    await aeternam.deployed();

    Ico = await ethers.getContractFactory('Ico');
    ico = await Ico.connect(owner).deploy(aeternam.address, ICO_START_TIME , ICO_END_TIME, RATE);                                                                   
    await ico.deployed();
    await aeternam.connect(owner).approve(ico.address, INIT_SUPPLY);
  });

  // This is where we test that the constructor of Aeternam Token actually worked right. 
  it(`Should have name ${NAME}`, async function () {
    expect(await aeternam.name()).to.equal(NAME);
  });
  it(`Should have name ${SYMBOL}`, async function () {
    expect(await aeternam.symbol()).to.equal(SYMBOL);
  });
  it(`Should have total supply ${INIT_SUPPLY.toString()}`, async function () {
    expect(await aeternam.totalSupply()).to.equal(INIT_SUPPLY);
  });
  it(`Should mint initial supply ${INIT_SUPPLY.toString()} to owner`, async function () {
    expect(await aeternam.balanceOf(owner.address)).to.equal(INIT_SUPPLY);
  });
  
  // This is where we test that the Ico contract, is able to spend the total ammount of tokens of aeternam.owner
  describe('ICO INIT-SUPPY', async function () {
    it("Should approve the Ico contract to transfer aeternam's Owner's funds.", async function () {
      expect(await aeternam.allowance(owner.address, ico.address)).to.be.equal(INIT_SUPPLY);
    });
  });
  
  // This is where we test our time-based business logic.
  describe('ICO : Time-Based-Logic guards : Too late, or too early.', async function () {
    // Initalizing the function buyToken with time-based modifier, triggering it too early, should revert. 
    it("Should revert if the function buyToken is called before the ICO Begins.", async function () {
      await expect(ico.connect(alice).buyTokens())
      .to.be.reverted;
    });
    it("Should transfer the amount of token to the buyer.", async function () {
      // The amount that the sender will send to the contract, 10 ** 9 equals to one gwei
      const AMMOUNT_TO_BUY = 10 ** 9;
      await ethers.provider.send("evm_setNextBlockTimestamp", [ICO_START_TIME]);
      await ethers.provider.send('evm_mine');
      await ico.connect(alice).buyTokens({value: AMMOUNT_TO_BUY});
      // When we check for the transfer of the tokens to the spender's wallet, we need to use parseEther 
      expect(await aeternam.connect(alice).balanceOf(alice.address)).to.equal(ethers.utils.parseEther('1'));
     });
    // Initalizing the function buyToken with time-based modifier, triggering it too late, should revert
    it("Should revert if the function buyToken is called after the ICO Ended.", async function () {
      await ethers.provider.send("evm_setNextBlockTimestamp", [ICO_END_TIME]);
      await ethers.provider.send('evm_mine');
      await expect(ico.connect(alice).buyTokens())
      .to.be.reverted;
    });
  });
});
