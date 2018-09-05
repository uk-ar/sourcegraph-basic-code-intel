import {
    activateExtension,
    DefinitionRequest,
    DidOpenTextDocumentNotification,
    DidOpenTextDocumentParams,
    HoverRequest,
    ImplementationRequest,
    ReferencesRequest,
    Registration,
    RegistrationParams,
    RegistrationRequest,
    SourcegraphExtensionAPI,
    TextDocumentPositionParams,
    TypeDefinitionRequest,
} from '@sourcegraph/sourcegraph.proposed/module/extension'
import { createWebWorkerMessageTransports } from '@sourcegraph/sourcegraph.proposed/module/jsonrpc2/transports/webWorker'
import { Handler, Config } from './handler'

/** Entrypoint for the basic code intel Sourcegraph extension. */
export async function run(
    sourcegraph: SourcegraphExtensionAPI<{ 'basic-code-intel': Config }>
): Promise<void> {
    const handler = new Handler(
        sourcegraph.configuration.get('basic-code-intel')
    )

    sourcegraph.windows.subscribe(windows => {
        for (const win of windows) {
            if (win.activeComponent) {
                win.activeComponent.
            }
        }
    })

    // The code intel methods to handle.
    const methods: string[] = [
        DefinitionRequest.type.method,
        ReferencesRequest.type.method,
    ]
    const registrations: Registration[] = []
    for (const method of methods) {
        registrations.push({
            id: method,
            method,
            registerOptions: { documentSelector: ['*'] },
        })

        // Respond to LSP requests for this method.
        sourcegraph.rawConnection.onRequest(
            method,
            async <P extends TextDocumentPositionParams>(params: P) => {
                switch (method) {
                    case DefinitionRequest.type.method:
                    return handler.definition(params)
                    case ReferencesRequest.type.method:
                    return handler.references(params)
                }
            }
        )
    }

    // Tell the client that we provide these code intel features.
    await sourcegraph.rawConnection.sendRequest(RegistrationRequest.type, {
        registrations,
    } as RegistrationParams)
}

// This runs in a Web Worker and communicates using postMessage with the page.
activateExtension<Settings>(
    createWebWorkerMessageTransports(self as DedicatedWorkerGlobalScope),
    run
).catch(err => console.error(err))
