import type { CompilationResult } from '../types'

export function useShaderCompiler() {
  function parseWebGLError(error: string): CompilationResult {
    // Parse WebGL shader compilation errors
    // Example: "ERROR: 0:5: 'foo' : undeclared identifier"
    const lineMatch = error.match(/ERROR: \d+:(\d+):/)
    const messageMatch = error.match(/: (.+)$/)

    return {
      success: false,
      error,
      lineNumber: lineMatch ? parseInt(lineMatch[1]) : undefined,
      message: messageMatch ? messageMatch[1] : error,
    }
  }

  function validateShaderSyntax(code: string): CompilationResult {
    // Basic syntax validation
    if (!code.includes('void main()')) {
      return {
        success: false,
        error: 'Fragment shader must include a main() function',
      }
    }

    if (!code.includes('gl_FragColor')) {
      return {
        success: false,
        error: 'Fragment shader must set gl_FragColor',
      }
    }

    return { success: true, error: null }
  }

  return {
    parseWebGLError,
    validateShaderSyntax,
  }
}
