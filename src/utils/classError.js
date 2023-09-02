

export class ModifyError extends Error {
    constructor(msg, status) {
        super(msg)
        this.status = status || 500
    }

}