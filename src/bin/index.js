#! /usr/bin/env node

import path from 'path'
import { readFileSync, watch as watchDir, writeFileSync, existsSync, mkdirSync } from 'fs'
import { startDevServer } from '@web/dev-server'
import { compile } from '../compiler/index.js'
import { walkDir } from '../utils/files.js'
import * as argv from '../utils/argv.js'

const command = argv.command()

const rootPath = path.resolve(argv.option('root')) ?? process.cwd()
const srcDirPath = path.join(rootPath, argv.option('srcDir') ?? './src')
const outDirPath = path.join(rootPath, argv.option('outDir') ?? './wc')

switch (command) {
    case 'build':
        build()
        break
    default:
        build()
        watch()
        break
}

function build() {
    walkDir(srcDirPath, {}, (entry) => {
        if (!entry.name.endsWith('.html')) return
        if (entry.name === 'index.html') return

        const srcFilePath = path.join(entry.parentPath, entry.name)
        const out = resolveOut(srcFilePath)

        const source = readFileSync(srcFilePath, { encoding: 'utf8' })
        const result = compile(source, out)

        if (!existsSync(out.parentPath)) {
            mkdirSync(out.parentPath, { recursive: true })
        }
        writeFileSync(out.filePath, result.code)
    })
}

function watch() {
    watchDir(srcDirPath, { recursive: true }, (_, fileName) => {
        if (!fileName.endsWith('.html')) return
        if (fileName.endsWith('index.html')) return

        const srcFilePath = path.join(srcDirPath, fileName)
        const out = resolveOut(srcFilePath)

        const source = readFileSync(srcFilePath, { encoding: 'utf8' })
        const result = compile(source, out)

        if (!existsSync(out.parentPath)) {
            mkdirSync(out.parentPath, { recursive: true })
        }
        writeFileSync(out.filePath, result.code)
    })

    startDevServer({
        config: {
            rootDir: rootPath,
            port: 3000,
            watch: true,
            open: true,
            nodeResolve: true
        },
        readCliArgs: false,
        readFileConfig: false
    })
}

function resolveOut(srcFilePath) {
    const srcFileName = path.basename(srcFilePath)
    const srcParentPath = path.dirname(srcFilePath)

    const parentPath = path.join(outDirPath, path.relative(srcDirPath, srcParentPath))
    const fileName = srcFileName.replace('.html', '.js')
    const filePath = path.join(parentPath, fileName)
    const importShift = path.relative(parentPath, srcParentPath)
    const customElementName = path.basename(fileName, '.js')

    return {
        parentPath,
        fileName,
        filePath,
        importShift,
        customElementName
    }
}
