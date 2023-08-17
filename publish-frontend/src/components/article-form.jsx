import { useState } from "react";
import Tiptap from "@/components/tiptap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from "@fortawesome/free-solid-svg-icons";


const ArticleForm = ({ tags, initialValues, onContentChange }) => {
  // editing title
  const [title, setTitle] = useState('this is the title');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  //const [tags, setTags] = useState([]);

  const [isFocused, setIsFocused] = useState(false);

  const [featureImage, setFeatureImage] = useState(null);

  function handleFileInputChange(event) {
    const file = event.target.files[0];
    setFeatureImage(URL.createObjectURL(file));
  }

  function addTag(event) {

    // check if it already contain the tag
    if (!tags.includes(event.target.value)) {
      // remove the tag
      setTags([...tags, event.target.value]);
    }

    const tagContainer = document.getElementById('tag-container');

    tagContainer.innerHTML = '';

    tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.classList.add('tag');
      tagElement.innerHTML = tag;
      const removeButton = document.createElement('button');
      removeButton.innerHTML = 'x';
      removeButton.classList.add('remove-button');
      removeButton.addEventListener('click', () => removeTag(tag));
      tagElement.appendChild(removeButton);
      tagContainer.appendChild(tagElement);
    });
  }

  return (
    <div className="page">
      <div className="side-drawer">
        {!isFocused ? <ManageArticles /> : (
          <div>

            <h2 className="input-title">Feature Image</h2>
            <div className="feature-image">
              {featureImage ? (
                <img src={featureImage} alt="Feature Image" />
              ) : (
                <>
                  <label htmlFor="feature-image" className="custom-file-upload">
                    <button type="button" onClick={() => document.getElementById('feature-image').click()}>Select Image</button>
                  </label>
                  <input type="file" id="feature-image" accept="image/*" style={{ display: 'none' }} onChange={handleFileInputChange} />
                </>
              )}
            </div>
            {
              featureImage && (<button className="submit-button full-width-btn delete-button" onClick={() => setFeatureImage(null)}>
                Delete
              </button>)
            }
            <h2 className="input-title">Tags</h2>
            <div id="tag-container">
            </div>
            <select className="tag-selector" onChange={addTag}>
              <option value="0">Select a tag</option>
              {
                tags.map(tag => (
                  <option value={tag}>{tag}</option>
                ))
              }
            </select>
            <h2 className="input-title">Authors</h2>
            <select className="tag-selector">
              <option value="0">Select an author</option>
              <option value="1">Author 1</option>
              <option value="2">Author 2</option>
              <option value="3">Author 3</option>
            </select>
            <h2 className="input-title">Publish Date</h2>
            <div className="time-date-input">
              <input type="date" id="publish-date" name="publish-date" required />
              <input type="time" id="publish-time" name="publish-time" required />
            </div>
            <h2 className="input-title">Post URL</h2>
            <input type="text" id="slug" name="slug" required pattern="\S+" />
            <button className="submit-button full-width-btn">
              Save
            </button>
            <br />
            <hr />
            <button className="submit-button full-width-btn" onClick={() => setIsFocused(false)}>
              View Articles
            </button>
          </div>
        )}
      </div>
      <div className='article-container'>
        <div className="header">
          <div className="title-pos" id="title">
            {
              isEditingTitle ? (
                <div>
                  <input
                    type="text"
                    className="title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <button className="submit-button icon-margin" onClick={() => setIsEditingTitle(false)}>
                    Save
                  </button>
                </div>
              ) : (

                <button onClick={() => setIsEditingTitle(true)}>
                  <h1 className="title icon-margin-left">
                    <span>{title}</span>
                    <FontAwesomeIcon icon={faEdit} />
                  </h1>
                </button>
              )
            }
          </div>
          <div>
            <button className="preview-button">
              Preview
            </button>
            <button className="submit-button">
              Send for Review
            </button>
          </div>
        </div>
        <div className="editor" onClick={() => setIsFocused(true)}>
          <Tiptap
            onChange={onContentChange}
            defaultValue={initialValues?.attributes?.body}
          />
        </div>
      </div>
    </div>

  );
};

function ManageArticles() {
  const [showDrafts, setShowDrafts] = useState(true);
  const [showPinned, setShowPinned] = useState(true);
  const [showPublished, setShowPublished] = useState(true);

  return (
    <>
      <button className="dropdown-button" onClick={() => setShowDrafts(!showDrafts)}>
        <h2>Drafts</h2>
      </button>
      {showDrafts && (
        <div>
          <ol>
            <li>Article 1</li>
            <li>Article 2</li>
            <li>Article 3</li>
          </ol>
        </div>
      )}

      <button className="dropdown-button" onClick={() => setShowPinned(!showPinned)}>
        <h2>Pinned</h2>
      </button>
      {showPinned && (
        <div>
          <ol>
            <li>Article 4</li>
            <li>Article 5</li>
            <li>Article 6</li>
          </ol>
        </div>
      )}

      <button className="dropdown-button" onClick={() => setShowPublished(!showPublished)}>
        <h2>Published</h2>
      </button>
      {showPublished && (
        <div>
          <ol>
            <li>Article 7</li>
            <li>Article 8</li>
            <li>Article 9</li>
          </ol>
        </div>
      )}

      <button className="submit-button full-width-btn" type="submit">
        Save Draft
      </button>
    </>
  );
}

export default ArticleForm;
