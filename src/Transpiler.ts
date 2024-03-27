import { ExpressionParser } from './parser/expressionParse.ts'
import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'

export default class Transpiler {
    public static commandArgs(): string[] {
        let args: string[] = process.argv.slice(2, process.argv.length)
        
        switch(args.length) {
            case 0:
                throw new Error('no wrapper name and overladable class name')
            case 1:
                throw new Error('no overladable class name')
            case 2:
                
            default:
                break
        }

        return args
    }

    public static transpile() {
        try {
            let [wrapperName, fileName]: string[] = this.commandArgs()
            wrapperName = wrapperName.split('(')[0]
            const originalFile = readFileSync(fileName, 'utf-8')
            let readFile: string[] = originalFile.split('\n')
            let readOriginal: string = ''
            let newFile: string = ''

            readFile.forEach((i: string) => {
                if(i) {
                    try {
                        readOriginal = i.match(`(?<=${wrapperName}\\().*(?=\\))`)[0]
                        i = i.replace(RegExp(`${wrapperName}\\(.*\\)`), ExpressionParser.transpileFull('Vector', readOriginal))
                        newFile += i + '\n'
                    }catch(err) {
                        throw new Error('wrong input file')
                    }
                    
                }
            })

            writeFileSync('_' + basename(fileName), newFile)
        }catch(err) {
            switch(err.message) {
                case 'wrong input file':
                    console.log(err.message)
                    break
                case 'no wrapper name and overladable class name':
                    console.log(err.message)
                    break
                case 'no overladable class name':
                    console.log(err.message)
                    break
            }
            
            return 1
        }
    }
}
