export type AutoImporter =
  | AutoImporterCleared
  | {
      status: 'SET'
      pluginVersion: string
      loadServerEntry: () => Promise<void>
      paths: AutoImporterPaths
    }
// prettier-ignore
// biome-ignore format:
export type AutoImporterCleared =
  | { status: 'UNSET' }
  | { status: 'BUILDING' }
export type AutoImporterPaths = {
  autoImporterFilePathOriginal: string
  autoImporterFilePathActual: string
  serverEntryFilePathRelative: string
  serverEntryFilePathOriginal: string
  serverEntryFilePathResolved: () => string
  /** The Vite config root of the project that wrote this autoImporter. Used to prevent cross-project mixups in monorepos. */
  projectRoot?: string
}
