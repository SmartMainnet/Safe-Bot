import audit from '../../utils/audit.js'

// const address = /^(0x)?[0-9a-f]{40}$/i

export const addressMessage = async ctx => audit(ctx)