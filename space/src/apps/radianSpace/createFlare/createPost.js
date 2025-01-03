import React, { useEffect, useState } from 'react';
import CreateFlareOverlay from './createFlareOverlay/createFlareOverlay';
import CreatePostNonOverlay from './createPostNonOverlay/createPostNonOverlay';
import useApi from '../../../utils/useApi';
import API_BASE_URL from '../../../apiUrl';
import VideoPlayer from '../utils/videoPlayer';
import DOMPurify from 'dompurify';
import { stateToHTML } from 'draft-js-export-html';
import { useCreateFlareContext } from '../../../context/CreateFlareContext';

const CreateFlare = () => {
  const { originalUrlBeforeCreateFlareOverlay: originalUrl } = useCreateFlareContext();
  const { callApi } = useApi();

  const [content, setContent] = useState();

  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [previewMedia, setPreviewMedia] = useState(null);

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);


  const mediaProps = {
    uploadedMedia,
    currentMediaIndex,
    handleNextMedia: () => {
      setCurrentMediaIndex((prev) => prev + 1);
      setPreviewMedia(URL.createObjectURL(uploadedMedia[currentMediaIndex + 1]));
    },
    handlePreviousMedia: () => {
      setCurrentMediaIndex((prev) => prev - 1);
      setPreviewMedia(URL.createObjectURL(uploadedMedia[currentMediaIndex - 1]));
    },
    handleSelectedMedia: (event) => {
      const selectedFiles = Array.from(event.target.files).filter(
        (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
      );
      setUploadedMedia((prev) => [...prev, ...selectedFiles]);
      setPreviewMedia(URL.createObjectURL(selectedFiles[0]));
      setCurrentMediaIndex(0);
    },
    handleMediaUpload: () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*, video/*';
      fileInput.multiple = true;
      fileInput.click();
      fileInput.addEventListener('change', (e) => mediaProps.handleSelectedMedia(e));
    },
  };

  const contentProps = { content, setContent };


  useEffect(() => {
    setCurrentMediaIndex(0);
  }, []);


  const handleSubmit = async (e, content, uploadedMedia, handleSubmitSuccess) => {
    e.preventDefault();
    // Check if either content or media is provided
    if (!content && uploadedMedia.length === 0) {
      alert('Please provide either text or media.');
      return;
    }
    const contentState = content?.getCurrentContent(); // Get current content from the editor
    let sanitizedContent = DOMPurify.sanitize(contentState);
    if (contentState) {
      sanitizedContent = DOMPurify.sanitize(stateToHTML(contentState));
    }

    const formData = new FormData();
    formData.append('text', sanitizedContent);

    uploadedMedia.forEach((file, index) => {
      formData.append(`media[]`, file);
    });

    try {
      const response = await callApi(`radianspace/create-flare/`, 'POST', formData, 'multipart/form-data');
      handleSubmitSuccess(response);
    } catch (err) {
      console.error('Error creating post:', err)
    }
  };



  const renderMediaContent = (uploadedMediaThis, onEnded) => {
    const medias = {
      file: previewMedia,
      media_type: uploadedMediaThis[currentMediaIndex].type,
      id: currentMediaIndex,
    }
    if (uploadedMediaThis[currentMediaIndex].type.includes('video')) {
      return (
        <VideoPlayer
          mediaFile={medias}
          onEnded={onEnded}
          playable={true}
          url={API_BASE_URL}
        />
      );
    } else {
      return (
        <img src={previewMedia} alt={uploadedMediaThis.id} />
      );
    }
  };

  return originalUrl ? (
    <CreateFlareOverlay
      // handleCreateFlareOverlayClose={handleCreateFlareOverlayClose}
      handleSubmit={handleSubmit}
      mediaProps={mediaProps}
      contentProps={contentProps}
      renderMediaContent={renderMediaContent}
    />
  ) : (
    <CreatePostNonOverlay
      handleSubmit={handleSubmit}
      mediaProps={mediaProps}
      contentProps={contentProps}
      renderMediaContent={renderMediaContent}
    />
  );
};

export default CreateFlare;