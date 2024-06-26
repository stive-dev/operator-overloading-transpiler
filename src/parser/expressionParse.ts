import Stack from '@/structures/stack/Stack.ts'
import { ExpressionFormat } from '@/formatter/expressionFormat.ts'

export namespace ExpressionParser {
    const operators: object = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    }
    
    export function expressionParse(expression: string[]): Stack<string> {
        let parsedExpression: Stack<string> = new Stack<string>()
        let operatorStack: Stack<string> = new Stack<string>()

        for(let i: number = 0; i < expression.length; i++) {
            if(expression[i].match('\\(')) {
                operatorStack.push(expression[i])
            }

            if(expression[i].match('[+|*|/|-]')) {
                if(operatorStack.top) {
                    if(operators[operatorStack.top.value] >= operators[expression[i]]) {
                        parsedExpression.push(operatorStack.pop())
                        operatorStack.push(expression[i])
                    }else {
                        operatorStack.push(expression[i])
                    }
                }
            }

            if(expression[i].match('\\w')) {
                parsedExpression.push(expression[i])
            }

            if(expression[i].match('\\)')) {
                while(operatorStack.top) {
                    if(operatorStack.top.value.match('\\(')) {
                        operatorStack.pop()
                        break
                    }

                    parsedExpression.push(operatorStack.pop())
                }
            }
            
        }

        return parsedExpression
    }

    export function transpile(className: string, expression: Stack<string>): string {
        let transpiled: string = ''
        let reversedExpression: Stack<string> = reverseExpression(expression)
        let operand: Stack<string> = new Stack<string>()

        while(reversedExpression.top) {
            console.log(reversedExpression.top.value)
            let operand1: string
            let operand2: string
            
            switch(reversedExpression.top.value) {
                case '+':
                    [operand1, operand2] = [operand.pop(), operand.pop()]
                    transpiled = `${className}.__add(${operand2}, ${operand1})`
                    operand.push(transpiled)
                    reversedExpression.pop()
                    break
                case '-':
                    [operand1, operand2] = [operand.pop(), operand.pop()]
                    if(operand2 == null) {
                        transpiled = `${className}.__sub(${operand2}, ${operand1})`
                        reversedExpression.pop()
                        reversedExpression.push(transpiled)
                    }else {
                        transpiled = `${className}.__sub(${operand2}, ${operand1})`
                        operand.push(transpiled)
                        reversedExpression.pop()
                    }
                    break
                case '*':
                    [operand1, operand2] = [operand.pop(), operand.pop()]
                    transpiled = `${className}.__mul(${operand2}, ${operand1})`
                    operand.push(transpiled)
                    reversedExpression.pop()
                    break
                case '/':
                    [operand1, operand2] = [operand.pop(), operand.pop()]
                    transpiled = `${className}.__mul(${operand2}, ${operand1})`
                    operand.push(transpiled)
                    reversedExpression.pop()
                    break
                default:
                    operand.push(reversedExpression.pop())
                    break
            }
        }
        
        return transpiled
    }

    export function transpileFull(className: string, expression: string): string {
        return transpile(
            className,
            expressionParse(
                ExpressionFormat.expressionBuild(expression)
            )
        )
    }

    function reverseExpression(expression: Stack<string>): Stack<string> {
        let reversed: Stack<string> = new Stack<string>()

        while(expression.top) {
            reversed.push(expression.pop())
        }

        return reversed
    }
}
