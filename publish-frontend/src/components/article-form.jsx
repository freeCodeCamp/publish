import React from "react";
import Tiptap from "@/components/tiptap";


const ArticleForm = ({ onSubmit, initialValues, onContentChange }) => {
  return (
    <div className="page">
      <div className="side-drawer">
        <div className="navigation">
          <h2> Go Back</h2>
        </div>
        <h2>Your Drafts</h2>
        <ul>
          <li>Article 1</li>
          <li>Article 2</li>
          <li>Article 3</li>
        </ul>
        <h2>Pinned Articles</h2>
        <ul>
          <li>Article 1</li>
          <li>Article 2</li>
          <li>Article 3</li>
        </ul>
        <h2>Published</h2>
        <ul>
          <li>Article 1</li>
          <li>Article 2</li>
          <li>Article 3</li>
        </ul>
        <button className="submit-button draft-button" type='submit'>
          Save Draft
        </button>
      </div>
      <div className='article-container'>

        <div className="header">
          <div className="title">Article Title</div>
          <div className="buttons">
            <button className="preview-button">
              Preview
            </button>
            <button className="submit-button">
              Publish
            </button>
          </div>
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
