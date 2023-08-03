import React, { useState } from "react";
import Tiptap from '@/components/tiptap';
// Chakra UI components
import { Button } from '@chakra-ui/react';

const ArticleForm = ({ onSubmit, initialValues, onContentChange }) => {
  return (
    <div className='article-container'>
      <div className="editor">
        <form onSubmit={onSubmit}>
          <input
            type='text'
            id='title'
            name='title'
            defaultValue={initialValues?.attributes?.title}
            placeholder='Post Title'
            required
          />
          <br />

          <Tiptap
            onChange={onContentChange}
            defaultValue={initialValues?.attributes?.body}
          />

          <br />
          <label>Post URL</label>
          <br />
          <input
            type='text'
            id='slug'
            name='slug'
            defaultValue={initialValues?.attributes?.slug}
            placeholder='your-article-slug'
            required
          />
          <br />

          <Button colorScheme='blue' type='submit'>
            Save
          </Button>
        </form>
      </div>

    </div>
  );
};

export default ArticleForm;
