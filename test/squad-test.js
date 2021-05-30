/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');

describe('Aeternam Token', async function () {
  let dev, owner, Aeternam, aeternam;
  const NAME = 'Aeternam';
  const SYMBOL = 'AETER';
  const INIT_SUPPLY = ethers.utils.parseEther('1000000');
  beforeEach(async function () {
    [dev, owner] = await ethers.getSigners();
    Aeternam = await ethers.getContractFactory('Aeternam');
    aeternam = await Aeternam.connect(dev).deploy(owner.address, INIT_SUPPLY);
    await aeternam.deployed();
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
});
