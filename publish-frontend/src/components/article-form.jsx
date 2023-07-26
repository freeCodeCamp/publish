import React, { useState } from "react";
import Tiptap from '@/components/tiptap';
// Chakra UI components
import { Button } from '@chakra-ui/react';

const ArticleForm = ({ onSubmit, initialValues, onContentChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor='title'>Title</label>
      <input
        type='text'
        id='title'
        name='title'
        defaultValue={initialValues?.attributes?.title}
        required
      />
      <br />

      <Tiptap
        onChange={onContentChange}
        defaultValue={initialValues?.attributes?.body}
      />

      <Button colorScheme='blue' type='submit'>
        Save
      </Button>
    </form>
  );
};

export default ArticleForm;
