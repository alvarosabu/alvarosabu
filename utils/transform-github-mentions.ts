const MENTION_REGEX = /\{@([a-zA-Z0-9-]+)(?:\s*\|\s*([^}]+))?\}/g

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformGitHubMentions(file: any) {
  if (!file.body || typeof file.body !== 'string') {
    console.log('[GitHub Mentions] Skipping - body is not a string')
    return
  }

  console.log('[GitHub Mentions] Transforming:', file._path)

  // Transform {@username} or {@username | label} to :github-mention{username="username" label="label"}
  file.body = file.body.replace(MENTION_REGEX, (_match: string, username: string, label: string | undefined) => {
    const attrs = [`username="${username}"`]
    if (label) {
      attrs.push(`label="${label.trim()}"`)
    }
    return `:github-mention{${attrs.join(' ')}}`
  })

  console.log('[GitHub Mentions] Transformation complete')
}
