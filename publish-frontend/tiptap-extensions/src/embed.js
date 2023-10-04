import TwitterEmbed from '@/components/twitter-embed';
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export const Embed = Node.create({
  name: 'twitter-embed',
  group: 'block',
  content: 'text*',
  addAttributes() {
    return {
      tweetId: {
        default: null
      },
      storeChildren: {
        default: null
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        attrs: {
          class: 'kg-card kg-embed-card'
        },
        getAttrs: document => {
          const anchorElements = document.getElementsByTagName('a');
          const lastAnchorElement = anchorElements[anchorElements.length - 1];
          const href = lastAnchorElement.getAttribute('href');

          const endOfTweetPath = href.split('/');
          const tweetId = endOfTweetPath[endOfTweetPath.length - 1];

          if (tweetId.includes('?')) {
            const tweetIdSplit = tweetId.split('?');
            return {
              tweetId: tweetIdSplit[0],
              storeChildren: document
            };
          }

          return {
            tweetId: tweetId,
            storeChildren: document
          };
        }
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const dom = document.createElement('figure');
    dom.setAttribute('class', 'kg-card kg-embed-card');

    const contentDOM = document.createElement('blockqoute');
    contentDOM.setAttribute('class', 'twitter-tweet');
    contentDOM.setAttribute('data-width', '550');

    Array.from(HTMLAttributes.storeChildren?.children).forEach(child => {
      if (child.nodeName !== 'SCRIPT') {
        contentDOM.appendChild(child);
      }
    });

    dom.appendChild(contentDOM);

    return {
      dom,
      contentDOM
    };
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
