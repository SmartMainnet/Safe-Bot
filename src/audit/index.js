import checkAddress from "./checkAddress.js";
import startAudit from "./startAudit.js";

export default async (bot, msg) => {
  const address = msg.text.toLowerCase()
  const chain = await checkAddress(bot, msg)

  if (chain) {
    startAudit(bot, msg, address, chain)
  }
}