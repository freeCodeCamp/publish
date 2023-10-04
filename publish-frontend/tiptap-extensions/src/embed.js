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
      // a private value that stores the children before they are renedered in the dom
      // if this is not done, the React Component will be injected and show an iframe instead.

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
          // This makes sure that the already injected tweet is parsed correctly

          // TODO: check if the last anchor element always contains the tweet id (probably not)
          const anchorElements = document.getElementsByTagName('a');
          console.log(document + 'document');
          if (anchorElements.length === 0) {
            return {
              storeChildren: document
            };
          }

          const lastAnchorElement = anchorElements[anchorElements.length - 1];
          const href = lastAnchorElement.getAttribute('href');

          const endOfTweetPath = href.split('/');
          const tweetId = endOfTweetPath[endOfTweetPath.length - 1];

          // check if the tweet path contains any keys that need to be
          // removed before returning a tweed id

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
    // the dom (element) represents the root of theh node

    const dom = document.createElement('figure');
    dom.setAttribute('class', 'kg-card kg-embed-card');

    // the contentDOM (element) represents the child of the dom element

    const contentDOM = document.createElement('blockqoute');
    contentDOM.setAttribute('class', 'twitter-tweet');
    contentDOM.setAttribute('data-width', '550');

    // the storeChildren attribute contains the children of the node before they are rendered in the dom
    console.log(HTMLAttributes.storeChildren);
    if (HTMLAttributes.storeChildren) {
      Array.from(HTMLAttributes.storeChildren.children).forEach(child => {
        if (child.nodeName !== 'SCRIPT') {
          contentDOM.appendChild(child);
        }
      });
    }

    // now we make sure that the contentDOM is a child of the dom element

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
