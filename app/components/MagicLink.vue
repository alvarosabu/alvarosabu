<script setup lang="ts">
const reHtmlProtocol = /^https?:\/\//i
const reGitHubScope = /^(?:https?:\/\/)?github\.com\/([\w_-]*?)(?:$|\/)/

const props = defineProps<{
  label: string;
}>();

const linksMap: Record<string, string> = {
  'TresJS': 'https://tresjs.org',
  'ThreeJS': 'https://threejs.org',
  'Vue': 'https://vuejs.org',
  'Nuxt': 'https://nuxt.com',
  'Directus': 'https://directus.io',
  'Storyblok': 'https://www.storyblok.com',
  'Porsche Digital': 'https://www.porsche.digital',
  'Netcentric': 'https://www.netcentric.biz',
  'Blender': 'https://www.blender.org',
  'alvarosabu': 'https://github.com/alvarosabu',
  'AlvaroDevLabs': 'https://www.youtube.com/@AlvaroDevLabs',
}
const imageOverrides: Record<string, string> = {
  'TresJS': 'https://tresjs.org/favicon.svg',
  'ThreeJS': 'https://threejs.org/files/favicon.ico',
  'Vue': 'https://vuejs.org/logo.svg',
  'Nuxt': 'https://nuxt.com/icon.png',
  'Directus': 'https://directus.io/favicon.svg',
  'Storyblok': 'https://www.storyblok.com/favicon.svg',
  'Porsche Digital': 'https://www.porsche.digital/favicon.ico',
  'Netcentric': 'https://www.netcentric.biz/icons/favicon.ico',
  'Blender': 'https://www.blender.org/favicon.ico',
  'AlvaroDevLabs': 'https://www.youtube.com/favicon.ico',
}

const type = computed(() => {
  if (reGitHubScope.test(linksMap[props.label] || props.label)) return 'github-at'
  if (reHtmlProtocol.test(linksMap[props.label] || props.label)) return 'link'
  return 'default'
})

const avatarUrl = computed(() => {
  // If avatar is provided, use it
  if (imageOverrides[props.label]) return imageOverrides[props.label]

  // For GitHub handles, use GitHub's avatar API
  if (type.value === 'github-at') {
    return `https://github.com/${props.label}.png`
  }

  // For HTML URLs, try to get favicon
  if (type.value === 'link') {
    try {
      const linkUrl = new URL(linksMap[props.label] || props.label)
      return `${linkUrl.origin}/favicon.ico`
    } catch {
      return undefined
    }
  }

  return undefined
})

const item = computed(() => ({
  label: props.label,
  avatar: avatarUrl.value
}))
</script>
<template>
  <a class="magic-link not-prose" :href="linksMap[item.label]" :target="'_blank'" :rel="'noopener noreferrer'">
    <UBadge
      class="translate-y-0.5 rounded-full"
      :label="item.label" 
      :avatar="item.avatar ? { src: item.avatar, class: 'm-0!' } : undefined" 
      variant="soft"
      color="neutral"
      :size="'sm'"
    />
  </a>
</template>