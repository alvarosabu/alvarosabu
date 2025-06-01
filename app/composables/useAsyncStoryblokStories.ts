
import { useStoryblokApi, useStoryblokBridge } from '@storyblok/vue';
import type { ISbStoriesParams, ISbStoryData, StoryblokBridgeConfigV2 } from '@storyblok/vue';
import { onMounted, useAsyncData, useState } from '#imports';

export const useAsyncStoryblokStories = async (
  apiOptions: ISbStoriesParams = {},
  bridgeOptions: StoryblokBridgeConfigV2 = {},
) => {
  const storyblokApiInstance = useStoryblokApi();
  const uniqueKey = `${JSON.stringify(apiOptions)}-stories`;
  const stories = useState<ISbStoryData>(`${uniqueKey}-state`);

  onMounted(() => {
    if (stories.value && stories.value.id) {
      useStoryblokBridge(
        stories.value.id,
        evStory => (stories.value = evStory),
        bridgeOptions,
      );
    }
  });

  if (!stories.value) {
    const { data } = await useAsyncData(uniqueKey, () => storyblokApiInstance.get(
      `cdn/stories`,
      apiOptions,
    ));
    if (data) {
      stories.value = data.value?.data.stories;
    }
  }
  return stories;
};
