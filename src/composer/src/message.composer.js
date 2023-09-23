import { Composer } from 'telegraf'
import { checkAddress, checkChains } from '../../middleware/index.js'
import audit from '../../utils/audit.js'

const composer = new Composer()

export default composer.on('text',
  checkAddress,
  checkChains,
  ctx => audit(ctx)
)