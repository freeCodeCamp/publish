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
        tag: 'blockquote',
        getAttrs: document => {
          const anchorElements = document.getElementsByTagName('a');
          const lastAnchorElement = anchorElements[anchorElements.length - 1];
          const href = lastAnchorElement.getAttribute('href');

          const endOfTweetPath = href.split('/');
          const tweetId = endOfTweetPath[endOfTweetPath.length - 1];

          if (tweetId.includes('?')) {
            const tweetIdSplit = tweetId.split('?');
            return {
              tweetId: tweetIdSplit[0]
            };
          }

          return {
            tweetId: tweetId
          };
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'blockquote',
      mergeAttributes({ class: 'twitter-embed' }, HTMLAttributes)
    ];
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
