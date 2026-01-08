import type { Uniform, Vector2 } from 'three'

export interface ShaderEditorProps {
  initialCode?: string
  height?: string
  showLineNumbers?: boolean
  readonly?: boolean
}

export interface ShaderUniforms {
  uTime: Uniform<number>
  uResolution: Uniform<Vector2>
  uMouse: Uniform<Vector2>
}

export interface CompilationError {
  message: string
  lineNumber?: number
  severity: 'error' | 'warning'
}

export interface CompilationResult {
  success: boolean
  error: string | null
  lineNumber?: number
  message?: string
}
