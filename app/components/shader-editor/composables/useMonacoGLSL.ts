import * as monaco from 'monaco-editor'

export function useMonacoGLSL() {
  const isRegistered = ref(false)

  function registerGLSLLanguage() {
    if (isRegistered.value) return

    // Register the language
    monaco.languages.register({ id: 'glsl' })

    // Set language configuration
    monaco.languages.setLanguageConfiguration('glsl', {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/'],
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
      ],
    })

    // Set tokenization rules
    monaco.languages.setMonarchTokensProvider('glsl', {
      keywords: [
        'attribute', 'const', 'uniform', 'varying',
        'break', 'continue', 'do', 'for', 'while',
        'if', 'else', 'in', 'out', 'inout',
        'true', 'false', 'discard', 'return',
        'struct', 'void',
      ],
      typeKeywords: [
        'float', 'int', 'bool',
        'vec2', 'vec3', 'vec4',
        'ivec2', 'ivec3', 'ivec4',
        'bvec2', 'bvec3', 'bvec4',
        'mat2', 'mat3', 'mat4',
        'sampler2D', 'samplerCube',
      ],
      builtins: [
        'radians', 'degrees', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
        'pow', 'exp', 'log', 'exp2', 'log2', 'sqrt', 'inversesqrt',
        'abs', 'sign', 'floor', 'ceil', 'fract', 'mod', 'min', 'max', 'clamp',
        'mix', 'step', 'smoothstep',
        'length', 'distance', 'dot', 'cross', 'normalize', 'reflect', 'refract',
        'texture2D', 'textureCube',
        'gl_FragColor', 'gl_Position', 'gl_FragCoord',
      ],
      tokenizer: {
        root: [
          [/[a-z_$][\w$]*/, {
            cases: {
              '@keywords': 'keyword',
              '@typeKeywords': 'type',
              '@builtins': 'predefined',
              '@default': 'identifier',
            },
          }],
          [/[A-Z][\w$]*/, 'type.identifier'],
          [/[0-9]*\.[0-9]+([eE][-+]?[0-9]+)?/, 'number.float'],
          [/[0-9]+/, 'number'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string'],
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],
        ],
        string: [
          [/[^\\"]+/, 'string'],
          [/"/, 'string', '@pop'],
        ],
        comment: [
          [/[^/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[/*]/, 'comment'],
        ],
      },
    })

    isRegistered.value = true
  }

  return {
    registerGLSLLanguage,
    isRegistered,
  }
}
