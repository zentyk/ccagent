class Config {
    constructor(n8nhost,n8nport) { 
        this.n8nconfig = {
            url: `${n8nhost}:${n8nport}`,
        } 
    }
}

module.exports = Config;