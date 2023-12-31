import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import MissingEntryPointException from '../helpers/MissingEntryPoint'
import ViteAssetManager from '../helpers/ViteAssetMenager'

export default class ViteProvider {
    public static needsApplication = true

    constructor(protected app: ApplicationContract) {}

    public register() {
        // Register your own bindings
        this.app.container.singleton('AdonisJS/Vite', () => new ViteAssetManager(this.app))
    }

    public async boot() {
        // IoC container is ready
        const View = this.app.container.resolveBinding('Adonis/Core/View')
        const assetManager = this.app.container.resolveBinding('AdonisJS/Vite')
        View.global('viteAssetsManager', assetManager)

        View.registerTag({
            tagName: 'vite',
            seekable: true,
            block: false,
            compile(parser, buffer, token) {
                if (!token.properties.jsArg.trim()) {
                    throw new MissingEntryPointException()
                }
                const parsed = parser.utils.transformAst(
                    parser.utils.generateAST(token.properties.jsArg, token.loc, token.filename),
                    token.filename,
                    parser
                )
                const entrypointName = parser.utils.stringify(parsed)
                buffer.outputExpression(
                    `await state.viteAssetsManager.getMarkup(${entrypointName})`,
                    token.filename,
                    token.loc.start.line,
                    false
                )
            },
        })
    }
}
