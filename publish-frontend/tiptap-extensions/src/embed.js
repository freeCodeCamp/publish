import { Node, mergeAttributes } from '@tiptap/core'

export const Embed = Node.create({
  name: 'twitter-embed',

  addOptions() {
    return {
      HTMLAttributes: {
        style: {
          default: 'width: 50px; height: 50px; color: red;',
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
   return {
    setEmbed: options => ({ commands }) => {
      return commands.insertContent({
        type: this.name,
        attrs: options,
      })
    }
   }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-e': () => this.editor.commands.toggleMark('twitter-embed'),
    }
  },
})
