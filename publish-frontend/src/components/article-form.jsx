import React from "react";
import dynamic from 'next/dynamic'
import { Button } from '@chakra-ui/react';
const Tiptap = dynamic(
  () => import('@/components/tiptap'),
  { ssr: false }
)

const ArticleForm = ({ onSubmit, initialValues, onContentChange }) => {
  return (
    <div className="page">
      <div className="side-drawer">
        <Button className="submit-button draft-button" type='submit'>
          Save Draft
        </Button>
      </div>
      <div className='article-container'>
        <div className="buttons">
        <button className="preview-button">
          Preview
        </button>
        <button className="submit-button">
          Publish
        </button>
        </div>
        <div className="editor">
          <br />
          <Tiptap
            onChange={onContentChange}
            defaultValue={initialValues?.attributes?.body}
          />
        </div>
      </div>
    </div>

  );
};

export default ArticleForm;
