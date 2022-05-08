class SvelteErrorHandler {
    apply(compiler) {
        compiler.hooks.done.tap("svelte-error-handler", (stats) => {
            
        })
    }
}

module.exports = SvelteErrorHandler;
// isn't using