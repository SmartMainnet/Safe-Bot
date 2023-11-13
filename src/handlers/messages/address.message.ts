import { ContextType } from '../../types/index.ts'
import { audit } from '../../utils/index.ts'

export const addressMessage = async (ctx: ContextType) => audit(ctx)