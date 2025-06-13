import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Post } from '../components/Post';
import { BounceLoader } from 'react-spinners';
import './HomePage.css'; 

export function HomePage() {
  const { getPosts, uploadPost } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [postsLoaded, setPostsLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.title = 'Home';
  }, []);

  useEffect(() => {
    const initialLoad = async () => {
      setPostsLoaded(false);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      setPostsLoaded(true);
    };
    initialLoad();
  }, [getPosts]);

  const loadPosts = async () => {
    setPostsLoaded(false);
    const fetchedPosts = await getPosts();
    setPosts(fetchedPosts);
    setPostsLoaded(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    await uploadPost(newContent);
    setNewContent('');
    loadPosts();
  };

  return (
    <div className="main-content">
      <div className="post-form-container">
        <form onSubmit={handleUpload} className="post-form">
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="What's on your mind?"
            className="post-input"
            rows="3"
          />
          <button type="submit" className="post-button">
            Post
          </button>
        </form>
      </div>

      <div className="posts-container">
        {!postsLoaded ?
          (
            <div className="spinner-container">
              <BounceLoader size="150px" color="#008ed8" />
              <p>Loading posts...</p>
            </div>
          )
          :
          posts.map(post => (
            <Post className={"post"} key={post.id} post={post} onUpdate={loadPosts} />
          ))
        }
      </div>
    </div>
  );
}