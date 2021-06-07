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
  const RATE = 10 ** 9;
  // The amount that the sender will send to the contract, 10 ** 9 equals to one gwei
  const AMMOUNT_TO_BUY =  RATE;
  beforeEach(async function () {
    [dev, owner, alice, ico] = await ethers.getSigners();
    Aeternam = await ethers.getContractFactory('Aeternam');
    aeternam = await Aeternam.connect(dev).deploy(owner.address, INIT_SUPPLY);
    await aeternam.deployed();

    Ico = await ethers.getContractFactory('Ico');
    ico = await Ico.connect(owner).deploy(aeternam.address, RATE);                                                                   
    await ico.deployed();
    await aeternam.connect(owner).approve(ico.address, INIT_SUPPLY);
    // The user that have some token, can approve calculator and then the calculator can spend and recieve token 
  });

  // Deployement test (for the token) 
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
  
  // Owner approve ICO to spend his whole supply
  describe('ICO INIT-SUPPY', async function () {
    it("Should approve the Ico contract to transfer aeternam's Owner's funds.", async function () {
      expect(await aeternam.allowance(owner.address, ico.address)).to.be.equal(INIT_SUPPLY);
    });
  });
  
  // This is where we test our time-based business logic.
  describe('Active Ico', async function() {
     it("Should transfer the amount of token to the buyer.", async function () {
      await ico.connect(alice).buyTokens({value: AMMOUNT_TO_BUY});
      expect(await aeternam.connect(alice).balanceOf(alice.address)).to.equal(ethers.utils.parseEther('1'));
     });
     it("Should decrease ether balance of sender", async function () {
      prov = await ethers.getDefaultProvider()
      aliceBalance = await prov.getBalance(alice.address)
      tx = await ico.connect(alice).buyTokens({value: AMMOUNT_TO_BUY})
      expect(tx).to.changeEtherBalance(alice, aliceBalance - AMMOUNT_TO_BUY)
     });
     it("Should emit event when investor buy tokens.", async function () {
      await expect(ico.connect(alice).buyTokens({value: AMMOUNT_TO_BUY})) 
      .to.emit(ico, 'TokenBuyed')
      .withArgs(alice.address, ethers.utils.parseEther('1'));
     });
     it("Should increase the balance of the contract", async function() {
      tx = await ico.connect(alice).buyTokens({value: AMMOUNT_TO_BUY})
      expect(tx).to.changeEtherBalance(ico, AMMOUNT_TO_BUY);
     });
     it('Should revert if owner of ico tries to buy tokens', async function () {
      await expect(ico.connect(owner).buyTokens({value: AMMOUNT_TO_BUY}))
        .to.be.reverted;
     });
     it("Should revert if the ICO contract is not allowed to spend aeternam.owner tokens", async function() {
      ico = await Ico.connect(owner).deploy(aeternam.address, RATE);
      ico.deployed();
      await expect(ico.connect(alice).buyTokens({value: AMMOUNT_TO_BUY}))
      .to.be.revertedWith("ICO : aeternam is not being sold yet.");
     });
  });

  describe('Withdrawal', async function() {
    beforeEach(async function () {
      await ico.connect(alice).buyTokens({value: 10 * RATE, gasPrice: 0});
      total = await ico.balanceOfIco()
    })  
     it("Should withdraw the funds to the owner's wallet", async function() {
      await network.provider.send('evm_increaseTime', [604801])
      await network.provider.send('evm_mine');
      expect (await ico.connect(owner).withdrawProfit()).to.changeEtherBalance(owner, 10 * RATE);
      expect(await ico.balanceOfIco()).to.equal(0);
    });
     it("Should emit event when owner withdraws", async function () {
      await network.provider.send('evm_increaseTime', [604801])
      await network.provider.send('evm_mine');
      expect(await ico.connect(owner).withdrawProfit())
        .to.emit(ico, 'Withdrew')
        .withArgs(owner.address, total);
     });
     it('Should revert if not owner', async function () {
      await expect(ico.connect(alice).withdrawProfit()).to.be.revertedWith('Ownable: caller is not the owner');
    });
     it('Should revert if ico is not over', async function () {
      await expect(ico.connect(owner).withdrawProfit()).to.be.revertedWith(
        "ICO: Ico is not over yet"
      );
    });
  });

  describe("Getters", async function () {
    it("Should return the balance of ICO (in ethers)", async function () {
      await ico.connect(alice).buyTokens({value : AMMOUNT_TO_BUY})
      expect(await ico.connect(owner).balanceOfIco())
      .to.equal(AMMOUNT_TO_BUY);
    });
    it("Should return the remaining tokens in allowance", async function() {
      allowance =  await aeternam.connect(owner).allowance(owner.address, ico.address)
      await ico.connect(alice).buyTokens({value: AMMOUNT_TO_BUY})
      newAllowance = await aeternam.connect(owner).allowance(owner.address, ico.address)
      expect(await ico.connect(owner).remainingToken())
      .to.equal(newAllowance)
    });
  });

});
