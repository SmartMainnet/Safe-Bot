import { Composer } from 'telegraf'
import { checkChains } from '../../middleware/index.js'
import audit from '../../utils/audit.js'

const composer = new Composer()
const address = /^(0x)?[0-9a-f]{40}$/i

export const addressMessage = composer.hears(
  address,
  checkChains,
  ctx => audit(ctx)
)