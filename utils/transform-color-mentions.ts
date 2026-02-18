const COLOR_MENTION_REGEX = /\{@(#[0-9a-fA-F]{3,8}|0x[0-9a-fA-F]{3,8})\}/g

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformColorMentions(file: any) {
  if (!file.body || typeof file.body !== 'string') {
    return
  }

  file.body = file.body.replace(COLOR_MENTION_REGEX, (_match: string, color: string) => {
    return `:magic-color{value="${color}"}`
  })
}
