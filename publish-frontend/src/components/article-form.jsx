import React, { useState } from "react";
import Tiptap from './tiptap';

const ArticleForm = ({ onSubmit, initialValues, onContentChange }) => {


  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" defaultValue={initialValues.title} required />
      <br />

      <Tiptap onChange={onContentChange} defaultValue={initialValues.body} />

      <button type="submit">Submit</button>
    </form>
  );
};

export default ArticleForm;
