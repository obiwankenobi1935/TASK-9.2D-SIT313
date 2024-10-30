import React, { useState } from 'react';
import { db, storage } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Controlled as CodeMirror } from 'react-codemirror2';
import ReactMarkdown from 'react-markdown';
import './PostForm.css';

// Import CodeMirror styles and mode
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';

const PostForm = () => {
  const [postType, setPostType] = useState('Article');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');  // New state for code
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (image) {
      setUploading(true);
      try {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        setImageURL(url);
        alert('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const collectionName = postType === 'Article' ? 'articles' : 'questions';
      await addDoc(collection(db, collectionName), {
        postType,
        title,
        abstract,
        content,
        code,
        tags: tags.split(',').map(tag => tag.trim()),
        imageURL,
        createdAt: new Date(),
      });

      // Clear fields
      setTitle('');
      setAbstract('');
      setContent('');
      setCode('');
      setTags('');
      setImage(null);
      setImageURL('');

      postType === 'Article' ? navigate('/') : navigate('/questions');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>Create New {postType}</h2>

      <div className="post-type">
        <label>Post Type:</label>
        <input
          type="radio"
          name="postType"
          value="Question"
          checked={postType === 'Question'}
          onChange={handlePostTypeChange}
        /> Question
        <input
          type="radio"
          name="postType"
          value="Article"
          checked={postType === 'Article'}
          onChange={handlePostTypeChange}
        /> Article
      </div>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {postType === 'Article' && (
        <div className="form-group">
          <label>Upload an Image:</label>
          <input type="file" onChange={handleImageChange} />
          <button type="button" onClick={handleUploadImage} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}

      <div className="form-group">
        <label>Abstract</label>
        <textarea
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Code (if any):</label>
        <CodeMirror
          value={code}
          options={{
            mode: 'markdown',
            theme: 'default',
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, value) => setCode(value)}
        />
      </div>

      <div className="form-group">
        <label>Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <button type="submit">Submit</button>

      {/* Markdown Preview */}
      <div className="preview-section">
        <h3>Preview:</h3>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </form>
  );
};

export default PostForm;
