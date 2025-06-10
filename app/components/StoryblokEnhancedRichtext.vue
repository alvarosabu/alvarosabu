<script setup lang="ts">
import type { VNode } from 'vue'
import { TextTypes, StoryblokComponent } from '@storyblok/vue'
import type { StoryblokRichTextNode, StoryblokRichTextResolvers, StoryblokRichTextNodeResolver } from '@storyblok/vue'
import { CodeBlock, MagicLink } from '#components';
import { richTextResolver } from '@storyblok/richtext';
import { createTextVNode } from 'vue';

const props = defineProps<{
  doc: typeof StoryblokRichTextNode;
  resolvers: typeof StoryblokRichTextResolvers<VNode>;
}>();

const componentResolver: StoryblokRichTextNodeResolver<VNode> = (
  node: StoryblokRichTextNode<VNode>,
): VNode => {
  return h(
    StoryblokComponent,
    {
      blok: node?.attrs?.body[0],
      id: node.attrs?.id,
    },
    node.children,
  );
};

const renderedDoc = ref();
const root = () => renderedDoc.value;

// Custom resolver for magic links
const magicLinkResolver = (node: { text?: string }, ctx): VNode => {
  const magicLinkRegex = /{@([^}]+)}/g;
  const parts = node.text?.split(magicLinkRegex);
  if (parts && parts.length <= 1) return ctx.originalResolvers.get(TextTypes.TEXT)(node, ctx)

  return h('span', {}, parts?.map((part: string, index: number) => {
    if (index % 2 === 0) return part;
    
    return h(MagicLink, {
      label: part,
    });
  }));
};

const codeBlockResolver = (node: StoryblokRichTextNode<VNode>, ctx): VNode => {
  return h(CodeBlock, {
    lang: node.attrs?.class.split('-')[1],
    code: node.content[0]?.text ?? '',
  });
};

watch([() => props.doc, () => props.resolvers], ([doc, resolvers]) => {
  const { render } = richTextResolver<VNode>({
    renderFn: h,
    textFn: createTextVNode,
    keyedResolvers: true,
    resolvers: {
      ...(resolvers as StoryblokRichTextResolvers<VNode>),
        [BlockTypes.COMPONENT]: componentResolver,
      [TextTypes.TEXT]: magicLinkResolver,
      [BlockTypes.CODE_BLOCK]: codeBlockResolver,
    },
  });
  renderedDoc.value = render(doc as StoryblokRichTextNode<VNode>);
}, {
  immediate: true,
  deep: true,
});
</script>

<template>
  <root />
</template>

