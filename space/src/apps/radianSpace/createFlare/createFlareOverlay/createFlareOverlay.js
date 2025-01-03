import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './createPostOverlay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import useApi from '../../../../utils/useApi';
import DraftEditor from '../../../../utils/editor/editor';
import { useCreateFlareContext } from '../../../../context/CreateFlareContext';

const CreateFlareOverlay = ({
  handleSubmit,
  mediaProps,
  contentProps,
  renderMediaContent,
  // handleCreateFlareOverlayClose,
}) => {
  const { content, setContent } = contentProps;
  const {
    uploadedMedia,
    currentMediaIndex,
    handleNextMedia,
    handlePreviousMedia,
    handleMediaUpload,
  } = mediaProps;

  const { closeCreateFlareOverlay } = useCreateFlareContext();

  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, '', '/radianspace/create-flare');
  }, []);


  const handleSubmitSucess = (response) => {
    closeCreateFlareOverlay(window.location.pathname);
    console.log(response.data)
    navigate(`/radianspace/flare/${response.data.uuid}`);
  }



  return (
    <div className={`create-post-overlay`} onClick={() => closeCreateFlareOverlay(window.location.pathname)}>
      <div className={`create-post-card-overlay`} onClick={(e) => e.stopPropagation(e)}>
        <h2>Create a New Post</h2>
        <form>
          <DraftEditor
            onChangeContent={(state) => setContent(state)}
            placeholder="Write your post here..."
          />
          <div className="create-post-buttons-overlay">
            <button type="submit" onClick={(e) => handleSubmit(e, content, uploadedMedia, handleSubmitSucess)}>Post</button>
          </div>
        </form>
        {uploadedMedia.length > 0 &&
          <div className={`create-post-to-upload-media-overlay`}>
            <div className={`create-post-to-upload-media-overlay-inner`} onClick={handleMediaUpload}>
              <div className="upload-icon-overlay" onClick={handleMediaUpload}>
                +
              </div>
              <div className="upload-text-overlay" onClick={handleMediaUpload}>
                Upload Media
              </div>
            </div>
          </div>
        }
      </div>
      <div className={`media-container-overlay`} onClick={(e) => e.stopPropagation(e)} >
        {/* Conditionally display the uploaded media card */}
        {uploadedMedia.length !== 0 ? (
          <div className={`uploaded-media-card-overlay`} onClick={(e) => e.stopPropagation(e)}>
            <div className={`create-post-previous-next-media-buttons-overlay`}>
              <div className={`create-post-previous-media-button${uploadedMedia[currentMediaIndex].type.includes('video') ? '-video' : ''}-overlay`}>
                {currentMediaIndex !== 0 &&
                  <button onClick={handlePreviousMedia}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                }
              </div>
              <div className={`create-post-next-media-button${uploadedMedia[currentMediaIndex].type.includes('video') ? '-video' : ''}-overlay`}>
                {currentMediaIndex !== (uploadedMedia.length - 1) &&
                  <button onClick={handleNextMedia}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                }
              </div>
            </div>
            {/* Display the uploaded media here */}
            {uploadedMedia.length > 0 && (
              <div className={`create-post-media-display-overlay`} onClick={(e) => e.stopPropagation(e)}>
                {renderMediaContent(uploadedMedia, null)}
              </div>
            )}
          </div>
        ) : null}
        {uploadedMedia.length <= 0 &&
          <div className={`create-post-to-upload-media-overlay`} onClick={(e) => e.stopPropagation(e)}>
            <div className={`create-post-to-upload-media-overlay-inner`} onClick={handleMediaUpload}>
              <div className="upload-icon-overlay" onClick={handleMediaUpload}>
                +
              </div>
              <div className="upload-text-overlay" onClick={handleMediaUpload}>
                Upload Media
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default CreateFlareOverlay;