import { AskRequest, AskResponse } from '@project/shared';

export interface RagEngine {
  ask(request: AskRequest): Promise<AskResponse>;
}
