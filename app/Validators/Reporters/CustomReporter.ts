import {
    VanillaErrorNode,
    MessagesBagContract,
    ErrorReporterContract,
} from '@ioc:Adonis/Core/Validator'
import {ValidationException} from '@adonisjs/validator/build/src/ValidationException'


/**
 * The vanilla error reporter to stores an array of messages in
 * reference to a given field. Tailored for displaying messages
 * next to a form field.
 */
export class CustomReporter implements ErrorReporterContract<VanillaErrorNode> {
    /**
     * Collected errors
     */
    private errors: VanillaErrorNode = {}

    /**
     * A boolean to know if an error has been reported or
     * not
     */
    public hasErrors = false

    constructor(private messages: MessagesBagContract, private bail: boolean) {
    }

    /**
     * Report a new error
     */
    public report(
        pointer: string,
        rule: string,
        message: string,
        arrayExpressionPointer?: string,
        args?: any
    ) {
        this.hasErrors = true

        const errorMessage = this.messages.get(
            pointer,
            rule,
            message,
            arrayExpressionPointer,
            args,
        )

        this.errors[pointer] = this.errors[pointer] || []
        if (!this.errors[pointer].includes(errorMessage))
            this.errors[pointer].push(errorMessage)

        /**
         * Raise exception right away when `bail=true`.
         */
        if (this.bail) {
            throw this.toError()
        }
    }

    /**
     * Returns an instance of [[ValidationException]]
     */
    public toError() {
        return new ValidationException(false, this.toJSON())
    }

    /**
     * Return errors
     */
    public toJSON() {
        return {
            errors: this.errors,
        }
    }
}
