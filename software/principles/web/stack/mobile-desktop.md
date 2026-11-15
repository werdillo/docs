# PS — mobile and desktop

Beyond the browser, when a project asks for a shell of its own:

- **Mobile** — **NativeScript**, or **Capacitor**
  ([capacitorjs.com](https://capacitorjs.com/)) as the alternative: the web UI
  in a native shell. Either shares the TypeScript and the contracts package with
  the web client.
- **Desktop** — **GPUIX** ([gpuix.dev](https://gpuix.dev/)) with its **Solid**
  adapter (`@gpuix/solid` + `@gpuix/native`): a native, GPU-rendered app written
  in TypeScript, no Electron and no web view. Or **Electrobun**
  ([electrobun.dev](https://electrobun.dev/)) as the alternative: **Bun** plus
  the system webview, when the UI is the web one.

All of these are options, added only when a project needs them; they do not
change the architecture, and the contracts package is what they reuse.
