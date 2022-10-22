import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { grantRole } from "./helpers";
import { deployTicketFixture } from "./helpers/lottery";

describe("Ticket token", () => {
  it("Should be transferable, mintable, burnable", async () => {
    const { ticketToken, restSigners, adminAccount } = await loadFixture(
      deployTicketFixture
    );

    const [minter, acc1, acc2, acc3] = restSigners;

    await expect(
      ticketToken
        .connect(minter)
        .mint(acc1.address, 0, 10, ethers.utils.toUtf8Bytes(""))
    ).to.be.reverted;

    await grantRole(ticketToken, adminAccount, minter.address, "MINTER_ROLE");

    await expect(
      ticketToken
        .connect(minter)
        .mint(acc1.address, 0, 10, ethers.utils.toUtf8Bytes(""))
    ).not.to.be.reverted;

    expect(await ticketToken.balanceOf(acc1.address, 0)).to.eq(10);

    await expect(
      ticketToken
        .connect(acc2)
        .safeTransferFrom(
          acc1.address,
          acc2.address,
          0,
          6,
          ethers.utils.toUtf8Bytes("")
        )
    ).to.be.reverted;

    await ticketToken
      .connect(acc1)
      .safeTransferFrom(
        acc1.address,
        acc2.address,
        0,
        6,
        ethers.utils.toUtf8Bytes("")
      );
    await expect(
      ticketToken
        .connect(acc1)
        .safeTransferFrom(
          acc1.address,
          acc3.address,
          0,
          5,
          ethers.utils.toUtf8Bytes("")
        )
    ).to.be.reverted;
    await ticketToken
      .connect(acc1)
      .safeTransferFrom(
        acc1.address,
        acc3.address,
        0,
        4,
        ethers.utils.toUtf8Bytes("")
      );

    expect(await ticketToken.balanceOf(acc1.address, 0)).to.eq(0);
    expect(await ticketToken.balanceOf(acc2.address, 0)).to.eq(6);
    expect(await ticketToken.balanceOf(acc3.address, 0)).to.eq(4);

    await expect(ticketToken.connect(acc3).burn(acc2.address, 0, 4)).to.be
      .reverted;
    await ticketToken.connect(acc3).burn(acc3.address, 0, 4);

    expect(await ticketToken.balanceOf(acc3.address, 0)).to.eq(0);
  });
});
