import React from 'react';
import { useNavigate } from 'react-router-dom';
import './createPostNonOverlay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import DraftEditor from '../../../../utils/editor/editor';

const CreatePostNonOverlay = ({ 
  handleSubmit,
  mediaProps,
  contentProps,
  renderMediaContent,
}) => {
  const { content, setContent } = contentProps;
  const {
    uploadedMedia,
    currentMediaIndex,
    handleNextMedia,
    handlePreviousMedia,
    handleMediaUpload,
  } = mediaProps;

  const navigate = useNavigate()


  const handleSubmitSucess = (response) => {
    navigate(`/radianspace/flare/${response.data.uuid}`);
  }


  return (
    <div className={`create-post-overlay-non-overlay`}>
      <div className={`create-post-card-non-overlay`}>
        <h2>Create a New Post</h2>
        <form>
          <DraftEditor
            onChangeContent={(state) => setContent(state)}
            placeholder="Write your post here..."
          />
          <div className="create-post-buttons-non-overlay">
            <button type="submit" onClick={(e) => handleSubmit(e, content, uploadedMedia, handleSubmitSucess)}>Post</button>
          </div>
        </form>
        {uploadedMedia.length > 0 &&
          <div className={`create-post-to-upload-media-non-overlay`}>
            <div className={`create-post-to-upload-media-non-overlay-inner`} onClick={handleMediaUpload}>
              <div className="upload-icon-non-overlay" onClick={handleMediaUpload}>
                +
              </div>
              <div className="upload-text-non-overlay" onClick={handleMediaUpload}>
                Upload Media
              </div>
            </div>
          </div>
        }
      </div>
      <div className={`media-container-non-overlay`}>
        {/* Conditionally display the uploaded media card */}
        {uploadedMedia.length !== 0 ? (
          <div className={`uploaded-media-card-non-overlay`}>
            <div className={`create-post-previous-next-media-buttons-non-overlay`}>
              <div className={`create-post-previous-media-button${uploadedMedia[currentMediaIndex].type.includes('video') ? '-video' : ''}-non-overlay`}>
                {currentMediaIndex !== 0 &&
                  <button onClick={handlePreviousMedia}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                }
              </div>
              <div className={`create-post-next-media-button${uploadedMedia[currentMediaIndex].type.includes('video') ? '-video' : ''}-non-overlay`}>
                {currentMediaIndex !== (uploadedMedia.length - 1) &&
                  <button onClick={handleNextMedia}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                }
              </div>
            </div>
            {/* Display the uploaded media here */}
            {uploadedMedia.length > 0 && (
              <div className={`create-post-media-display-non-overlay`}>
                {renderMediaContent(uploadedMedia, null)}
              </div>
            )}
          </div>
        ) : null}
        {uploadedMedia.length <= 0 &&
          <div className={`create-post-to-upload-media-non-overlay`}>
            <div className={`create-post-to-upload-media-non-overlay-inner`} onClick={handleMediaUpload}>
              <div className="upload-icon-non-overlay" onClick={handleMediaUpload}>
                +
              </div>
              <div className="upload-text-non-overlay" onClick={handleMediaUpload}>
                Upload Media
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default CreatePostNonOverlay;