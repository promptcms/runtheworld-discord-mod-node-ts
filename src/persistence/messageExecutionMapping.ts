import {LRUCache} from "lru-cache";

class MessageExecutionMapping {
    private readonly messageToExecutionId: LRUCache<string, string>;
    constructor() {
        this.messageToExecutionId = new LRUCache<string, string>({
            max: 500,
        });
    }

    public get(messageId: string) {
        return this.messageToExecutionId.get(messageId);
    }

    public set(messageId: string, executionId: string) {
        return this.messageToExecutionId.set(messageId, executionId);
    }

}

export default new MessageExecutionMapping();
