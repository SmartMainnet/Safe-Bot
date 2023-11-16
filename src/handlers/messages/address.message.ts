import { audit } from '../../utils/index.ts'
import { ContextType } from '../../types/index.ts'

export const addressMessage = async (ctx: ContextType) => audit(ctx)