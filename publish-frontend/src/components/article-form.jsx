import React from "react";
import Tiptap from "@/components/tiptap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";


const ArticleForm = ({ onSubmit, initialValues, onContentChange }) => {
  return (
    <div className="page">
      <div className="side-drawer">
        <div className="navigation">
          <FontAwesomeIcon icon={faLongArrowAltLeft} />
          <h2><span>Go Back</span></h2>
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
          <div className="title" id="title">
            <span>Article Title</span>
            <FontAwesomeIcon icon={faEdit} />
          </div>
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
