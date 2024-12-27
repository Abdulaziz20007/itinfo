class ApiError extends Error {
    constructor (status, message) {
        super()
        this.status = status;
        this.message = message;
    }

    static badRequest (message) {
        return new ApiError(400)
    }
    static forbidden (message) {
        return new ApiError(403)
    }
    static unauthorized (message) {
        return new ApiError(401)
    }
    static internal (message) {
        return new ApiError(500)
    }
}

module.exports = ApiError