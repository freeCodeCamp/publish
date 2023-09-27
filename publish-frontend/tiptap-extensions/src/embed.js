import { Mark, mergeAttributes } from '@tiptap/core'

export const Embed = Mark.create({
  name: 'twitter-embed',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [

    ]
  },

  renderHTML({ HTMLAttributes }) {
    return []
  },

  addCommands() {
    return {

    }
  },

  addKeyboardShortcuts() {
    return {
    }
  },
})
