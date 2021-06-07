const { expect } = require('chai');

describe('Calculator', () => {
  let dev, aeternamOwner, calculatorOwner, alice, Aeternam, aeternam, Calculator, calculator;
  const INIT_SUPPLY = ethers.utils.parseEther('10000000000');
  beforeEach(async () => {
    [dev, aeternamOwner, calculatorOwner, alice] = await ethers.getSigners();
    Aeternam = await ethers.getContractFactory('Aeternam');
    aeternam = await Aeternam.connect(dev).deploy(aeternamOwner.address, INIT_SUPPLY);
    await aeternam.deployed();
    Calculator = await ethers.getContractFactory('Calculator');
    calculator = await Calculator.deploy(aeternam.address, calculatorOwner.address);
    await calculator.deployed();
    await aeternam.connect(aeternamOwner).transfer(dev.address, ethers.utils.parseEther('10'));
    await aeternam.approve(calculator.address, ethers.utils.parseEther('10'));
  });

  describe('Deployment', function () {
    it('Should return owner address', async function () {
      expect(await calculator.owner()).to.equal(calculatorOwner.address);
    });
    it('Should return the fee to use the calculator', async function () {
      expect(await calculator.fee()).to.equal(ethers.utils.parseEther('1'));
    });
    it("Should return the allowance of the calculator to be 10", async function() {
        
    });
  });

  describe('On deploy, payable calculator', function () {
    beforeEach(async function () {
      await aeternam.connect(aeternamOwner).transfer(alice.address, ethers.utils.parseEther('1'));
      await aeternam.connect(alice).approve(calculator.address, ethers.utils.parseEther('100'));
    });

    it('Should transfer 1 aeternam from alice to calculator contract', async function () {
      await calculator.connect(alice).add(3, 7);
      expect(await aeternam.balanceOf(alice.address)).to.equal(0);
      expect(await aeternam.allowance(alice.address, calculator.address)).to.equal(ethers.utils.parseEther('99'));
      expect(await aeternam.balanceOf(calculator.address)).to.equal(ethers.utils.parseEther('1'));
    });
    it('Should revert if not enough aeternam', async function () {
      await calculator.connect(alice).add(3, 7);
      await expect(calculator.connect(alice).mul(6, 2)).to.be.revertedWith(
        'Calculator: you do not have enough aeternam to use this function'
      );
    });
    it('Should revert if not approve for at least 1 aeternam', async function () {
      await expect(calculator.connect(aeternamOwner).sub(5, 12)).to.be.revertedWith(
        'Calculator: you need to approve this smart contract for at least 1 aeternam before using it'
      );
    });
  });

  describe('Addition', function () {
    it('Should addition 2 numbers correctly', async function () {
      await expect(calculator.add(2, 3)).to.emit(calculator, 'Calculated').withArgs('Addition', dev.address, 2, 3, 5);
    });
  });
  describe('Subtraction', () => {
    it('Should subtract 2 numbers correctly', async () => {
      await expect(calculator.sub(2, 3))
        .to.emit(calculator, 'Calculated')
        .withArgs('Substraction', dev.address, 2, 3, -1);
    });
  });

  describe('Multiplication', () => {
    it('Should multiply 2 numbers correctly', async () => {
      await expect(calculator.mul(1, 8))
        .to.emit(calculator, 'Calculated')
        .withArgs('Multiplication', dev.address, 1, 8, 8);
      await expect(calculator.mul(1, 3))
        .to.emit(calculator, 'Calculated')
        .withArgs('Multiplication', dev.address, 1, 3, 3);
    });
  });

  describe('Division', () => {
    it('Should revert: can not divide by zero', async () => {
      await expect(calculator.div(2, 0)).to.be.revertedWith('Calculator: can not divide by zero');
    });

    it('Should divide 2 numbers correctly', async () => {
      await expect(calculator.div(2, 3)).to.emit(calculator, 'Calculated').withArgs('Division', dev.address, 2, 3, 0);
      await expect(calculator.div(10, 2))
        .to.emit(calculator, 'Calculated')
        .withArgs('Division', dev.address, 10, 2, 5);
    });
  });

  describe('Modulus', () => {
    it('Should revert: can not modulus by zero', async () => {
      await expect(calculator.mod(2, 0)).to.be.revertedWith('Calculator: can not modulus by zero');
    });

    it('Should modulus 2 numbers correctly', async () => {
      await expect(calculator.mod(2, 3)).to.emit(calculator, 'Calculated').withArgs('Modulus', dev.address, 2, 3, 2);
    });
  });

  describe('Withdraw', async function () {
    beforeEach(async function () {
      await aeternam.connect(aeternamOwner).transfer(alice.address, ethers.utils.parseEther('1'));
      await aeternam.connect(alice).approve(calculator.address, ethers.utils.parseEther('100'));
    });
    it("Should revert if alice tries to withdraw the profit", async function () {
        await calculator.connect(alice).add(2, 2);
        await expect(calculator.connect(alice).withdraw()).to.be.revertedWith("Calculator: only owner can call this function.")
    });
    it("Should revert if owner tries to withdraw the profit wihout anything in it", async function () {
        await expect(calculator.connect(calculatorOwner).withdraw()).to.be.revertedWith("Calculator : the contract contains 0 aeternam")
    });
    it("Should actualize owner's token balance after withdrawal", async function () {
        await calculator.connect(alice).add(2, 2);
        await expect(() => calculator.connect(calculatorOwner).withdraw())
        .to.changeTokenBalance(aeternam, calculatorOwner, ethers.utils.parseEther('1'));
    });
  });
});