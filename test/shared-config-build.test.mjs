import assert from 'node:assert/strict'
import { readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { createBuilder } from 'vite'
import { serverProductionEntryPlugin } from '../dist/esm/plugin/index.js'

const fixtureRoot = fileURLToPath(new URL('./fixtures/shared-config-build/', import.meta.url))
const outDirRoot = path.join(tmpdir(), `vite-plugin-server-entry-${process.pid}`)

after(async () => {
  await rm(outDirRoot, { recursive: true, force: true })
})

test('emits the server entry for an environments.ssr build with shared config', async () => {
  const builder = await createBuilder({
    root: fixtureRoot,
    logLevel: 'silent',
    builder: { sharedConfigBuild: true },
    environments: {
      client: {
        consumer: 'client',
        build: {
          emptyOutDir: true,
          outDir: path.join(outDirRoot, 'client'),
          rollupOptions: { input: { client: path.join(fixtureRoot, 'client.js') } },
        },
      },
      ssr: {
        consumer: 'server',
        build: {
          emptyOutDir: true,
          outDir: path.join(outDirRoot, 'server'),
          rollupOptions: { input: { server: path.join(fixtureRoot, 'server.js') } },
          ssr: true,
        },
      },
    },
    plugins: [
      serverProductionEntryPlugin({
        libraryName: 'Integration Test',
        getServerProductionEntry: () => `export const serverEntryMarker = 'shared-config-build'`,
      }),
    ],
  })

  await builder.buildApp()

  const serverEntry = await readFile(path.join(outDirRoot, 'server', 'entry.js'), 'utf8')
  assert.match(serverEntry, /shared-config-build/)
})
