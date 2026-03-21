<script setup lang="ts">
import { motion } from 'motion-v'
import { joinURL } from 'ufo'

useHead({
  title: 'Talks - AlvaroSabu',
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})

const title = 'Talks'

definePageMeta({
  title: 'Talks',
})

const site = useSiteConfig()
const ogImage = joinURL(site.url, '/talks-og.png')

useSeoMeta({
  title,
  ogImage,
  ogImageAlt: 'Alvaro Saburido\'s Public Speaking',
  ogTitle: title,
  ogDescription: 'A collection of talks and presentations about web development, 3D, Vue.js, and TresJS.',
  ogUrl: site.url,
  twitterTitle: title,
  twitterDescription: 'A collection of talks and presentations about web development, 3D, Vue.js, and TresJS.',
  twitterImage: ogImage,
  twitterImageAlt: 'Alvaro Saburido\'s Public Speaking',
})


const { data: talks } = await useAsyncData('talks', () =>
  queryCollection('talks').all()
)

interface TalkGroup {
  title: string
  description: string
  conferences: typeof talks.value
  tags: string[]
}

const talksByTitle = computed<TalkGroup[]>(() => {
  if (!talks.value) return []

  const grouped = talks.value.reduce((acc, talk) => {
    if (!acc[talk.title]) {
      acc[talk.title] = {
        title: talk.title,
        description: talk.description,
        tags: talk.tags,
        conferences: [],
      }
    }
    acc[talk.title].conferences.push(talk)
    return acc
  }, {} as Record<string, TalkGroup>)

  Object.values(grouped).forEach(group => {
    group.conferences.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  return Object.values(grouped).sort((a, b) => {
    const latestDateA = new Date(a.conferences[0].date).getTime()
    const latestDateB = new Date(b.conferences[0].date).getTime()
    return latestDateB - latestDateA
  })
})

const list = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
}

const item = {
  visible: { opacity: 1, y: -50 },
  hidden: { opacity: 0, y: -0 },
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}
</script>

<template>
  <UContainer class="max-w-screen-md">
    <PageTitle title="talks" />

    <section v-if="talksByTitle.length">
      <Motion
        initial="hidden"
        class="flex flex-col gap-16"
        while-in-view="visible"
        :variants="list"
      >
        <section
          v-for="(group, index) in talksByTitle"
          :key="group.title"
          class="flex flex-col gap-6"
        >
          <Motion :variants="item">
            <div class="flex flex-col gap-4">
              <h2 class="text-2xl font-bold">{{ group.title }}</h2>
              <p class="text-muted-foreground">{{ group.description }}</p>

              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="tag in group.tags"
                  :key="tag"
                  :label="tag"
                  color="primary"
                  variant="subtle"
                  size="sm"
                />
              </div>
            </div>

            <div class="mt-6 flex flex-col gap-4">
              <article
                v-for="conference in group.conferences"
                :key="`${conference.event.name}-${conference.date}`"
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pl-4 border-l-2 border-muted"
              >
                <div class="flex flex-col gap-1">
                  <div class="flex flex-wrap items-center gap-2 text-sm">
                    <div class="flex flex-col gap-1">
                      <a
                        :href="conference.event.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-semibold hover:text-primary transition-colors"
                      >
                        {{ conference.event.name }}
                      </a>
                      <p class="text-xs flex items-center gap-2">
                        <span class="text-muted-foreground">{{ formatDate(conference.date) }}</span>
                        <template v-if="conference.location">
                          <span class="text-muted-foreground">·</span>
                          <span class="text-muted-foreground">{{ conference.location }}</span>
                        </template>
                      </p>
                    </div>
                    
                  
                  </div>
                </div>

                <div class="flex flex-wrap gap-2">
                  <UButton
                    v-if="conference.url"
                    :to="conference.url"
                    target="_blank"
                    size="xs"
                    color="primary"
                    variant="soft"
                    icon="i-heroicons-play"
                    label="Watch"
                  />
                  <UButton
                    v-if="conference.slides"
                    :to="conference.slides"
                    target="_blank"
                    size="xs"
                    color="neutral"
                    variant="soft"
                    icon="i-heroicons-presentation-chart-line"
                    label="Slides"
                  />
                  <UButton
                    v-if="conference.pdf"
                    :to="conference.pdf"
                    target="_blank"
                    size="xs"
                    color="neutral"
                    variant="soft"
                    icon="i-heroicons-arrow-down-tray"
                    label="PDF"
                  />
                </div>
              </article>
            </div>
          </Motion>

          <USeparator v-if="index !== talksByTitle.length - 1" />
        </section>
      </Motion>
    </section>

    <section v-else class="text-center text-muted-foreground">
      <p>No talks found.</p>
    </section>
  </UContainer>
</template>
