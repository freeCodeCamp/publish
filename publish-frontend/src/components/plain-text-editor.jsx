import * as React from 'react'
import { useEffect } from "react";

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

const theme = {}

// Error handler
function onError(error) {
  console.error(error);
}

// Create a custom plugin
// takes in onChange handler
function MyOnChangePlugin(props) {
  // get a reference to the editor from the composer context
  // (get an access to the editor instance)
  const [editor] = useLexicalComposerContext();
  // destructure the props
  const { onChange } = props;
  React.useEffect(() => {
    // register an update listener
    // https://lexical.dev/docs/concepts/listeners#registerupdatelistener
    // editorState is going to get passed when any changes are made to the editor
    editor.registerUpdateListener((editorState) => {
      // invoke onChange function with it
      onChange(editorState);
      // save it in a backend in the onChange function?
    });
  }, [onChange, editor]);
  return null;
}

function onChange(editorState) {
  // save the editorState in a backend
  // console.log(editorState.editorState);
}

// https://github.com/facebook/lexical/discussions/3720
const EditorCapturePlugin = React.forwardRef((props, ref) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    ref.current = editor;
    return () => {
      ref.current = null;
    };
  }, [editor, ref]);

  return null;
})

export const PlainTextEditor = React.forwardRef((props, ref) => {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
  };

  return (
    <div className='editorWrapper'>
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={<ContentEditable className="contentEditable" />}
          placeholder={<div className="placeholder">Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <EditorCapturePlugin ref={ref} />
        <HistoryPlugin />
        <MyOnChangePlugin onChange={ (editorState) => { onChange(editorState) }} />
      </LexicalComposer>
    </div>
  );
});
export default PlainTextEditor;

// export default function PlainTextEditor({}) {
//   const initialConfig = {
//     namespace: 'MyEditor',
//     theme,
//     onError,
//   };

//   return (
//     <div className='editorWrapper'>
//       <LexicalComposer initialConfig={initialConfig}>
//         <PlainTextPlugin
//           contentEditable={<ContentEditable className="contentEditable" />}
//           placeholder={<div className="placeholder">Enter some text...</div>}
//           ErrorBoundary={LexicalErrorBoundary}
//         />
//         <HistoryPlugin />
//         <MyOnChangePlugin onChange={ (editorState) => { onChange(editorState) }} />
//       </LexicalComposer>
//     </div>

//   );
// }

