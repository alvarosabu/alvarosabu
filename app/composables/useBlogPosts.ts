import type { CollectionQueryBuilder } from '@nuxt/content'

type BlogStatus = 'draft' | 'published'

export function useBlogPosts() {
  const isDev = import.meta.dev

  function filterByStatus<T extends CollectionQueryBuilder<'blog'>>(query: T): T {
    if (isDev) {
      return query
    }
    return query.where('status', '=', 'published' as BlogStatus) as T
  }

  function isPostVisible(status: BlogStatus | undefined): boolean {
    if (isDev) return true
    return status === 'published'
  }

  return {
    isDev,
    filterByStatus,
    isPostVisible,
  }
}
