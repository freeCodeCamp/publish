import TwitterEmbed from '@/components/twitter-embed';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export const Embed = Node.create({
  name: 'twitter-embed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      tweetId: {
        default: null
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'twitter-embed'
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['twitter-embed', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TwitterEmbed);
  },

  addCommands() {
    return {
      setTwitterEmbed:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  }
});
