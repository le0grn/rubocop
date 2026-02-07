import build from "./config/esbuild.defaults.js"
import path from "path"

// Plugin to make esbuild watch the src/ directory for Tailwind class changes.
// Uses onResolve (not onLoad) to attach watchDirs, because the PostCSS plugin
// from esbuild.defaults.js already claims onLoad for CSS files and would
// shadow any later onLoad handler for the same filter.
const tailwindErbWatchPlugin = {
  name: "tailwind-erb-watch",
  setup(build) {
    build.onResolve({ filter: /index\.css/ }, async (args) => {
      if (args.pluginData?.fromErbWatch) return null

      const result = await build.resolve(args.path, {
        resolveDir: args.resolveDir,
        kind: args.kind,
        pluginData: { fromErbWatch: true },
      })

      if (result.errors.length > 0) return result

      return {
        path: result.path,
        watchDirs: [path.resolve("src")],
      }
    })
  }
}

/**
 * @typedef { import("esbuild").BuildOptions } BuildOptions
 * @type {BuildOptions}
 */
const esbuildOptions = {
  plugins: [
    tailwindErbWatchPlugin,
  ],
  globOptions: {
    excludeFilter: /\.(dsd|lit)\.css$/
  }
}

build(esbuildOptions)
