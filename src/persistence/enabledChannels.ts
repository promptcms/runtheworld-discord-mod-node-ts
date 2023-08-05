class EnabledChannels {
    private readonly enabledChannels: Set<string>;
    constructor() {
        this.enabledChannels = new Set<string>();
    }

    public has(channelId: string) {
        return this.enabledChannels.has(channelId);
    }

    public add(channelId: string) {
        return this.enabledChannels.add(channelId);
    }

    public delete(channelId: string) {
        return this.enabledChannels.delete(channelId);
    }

}

export default new EnabledChannels();
