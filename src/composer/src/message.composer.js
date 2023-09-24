import { Composer } from 'telegraf'
import { checkAddress, checkChains } from '../../middleware/index.js'
import audit from '../../utils/audit.js'

const composer = new Composer()

export const messageComposer = composer.on('text',
  checkAddress,
  checkChains,
  ctx => audit(ctx)
)