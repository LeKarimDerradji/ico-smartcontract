/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');

describe('Aeternam Token', async function () {
  let dev, owner, Aeternam, aeternam, Ico, ico;
  const NAME = 'Aeternam';
  const SYMBOL = 'AETER';
  const INIT_SUPPLY = ethers.utils.parseEther('1000000');
  beforeEach(async function () {
    [dev, owner, ico] = await ethers.getSigners();
    Aeternam = await ethers.getContractFactory('Aeternam');
    aeternam = await Aeternam.connect(dev).deploy(owner.address, INIT_SUPPLY);
    await aeternam.deployed();
    Ico = await ethers.getContractFactory('Ico');
    ico = await Ico.connect(owner).deploy(aeternam.address, 1628410088,  1629101288); 
                                                         /* 1628410088 is 08/08/2021 at 8h8m8s GMT time, 
                                                                         1629101288 is 08/16/2021 at 8h8m8s GMT time */
    await ico.deployed();
    await aeternam.connect(owner).approve(ico.address, INIT_SUPPLY);
  });

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

  describe('ICO INIT-SUPPY', async function () {
    it('Should approve the Ico contract to manipulate the total supply', async function () {
      expect(await aeternam.allowance(owner.address, ico.address)).to.be.equal(INIT_SUPPLY);
    });
  describe('ICO : Time Based Logic', async function () {

  })
  });
});
