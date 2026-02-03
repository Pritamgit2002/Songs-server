class CustomError extends Error {
    status_code: number

    constructor(
        message = 'Internal Server Error',
        status_code = 500
    ) {
        super(message)
        this.status_code = status_code

        Object.setPrototypeOf(this, CustomError.prototype)

        Error.captureStackTrace(this, this.constructor)
    }
}

export default CustomError
