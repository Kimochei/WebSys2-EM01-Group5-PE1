import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { Post } from '../components/Post';
import { BounceLoader } from 'react-spinners';
import { useInView } from 'react-intersection-observer';
import './HomePage.css';

export function HomePage() {
  const { getPosts, uploadPost } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // page tracker for infinite scrolling (like threads/twitter)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.title = 'Home';
  }, []);

  const loadPosts = useCallback(async (pageNum) => {
    setPostsLoaded(true);
    try {
      const fetchedPosts = await getPosts(pageNum);
      if (fetchedPosts.length === 0) {
        setHasMore(false);
      } else {
        if (pageNum === 1) {
          setPosts(fetchedPosts);
        } else {
          // Filter out duplicates based on post ID
          setPosts(prevPosts => {
            const uniquePosts = [...prevPosts];
            fetchedPosts.forEach(newPost => {
              if (!uniquePosts.some(existing => existing.id === newPost.id)) {
                uniquePosts.push(newPost);
              }
            });
            return uniquePosts;
          });
        }
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
    setPostsLoaded(false);
  }, [getPosts]);

  // initial post loads (page 1)
  useEffect(() => {
    if (isInitialLoad) {
      loadPosts(1);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, loadPosts]);

  // for infinite scrolling
  useEffect(() => {
    if (inView && !postsLoaded && hasMore && !isInitialLoad) {
      const nextPage = page + 1;
      loadPosts(nextPage);
      setPage(nextPage);
    }
  }, [inView, postsLoaded, hasMore, page, loadPosts, isInitialLoad]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    await uploadPost(newContent);
    setNewContent('');
    setShowPopup(false);

    // reset to initial state and reload first page
    setPage(1);
    setHasMore(true);
    setIsInitialLoad(true);
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
        {posts.map(post => (
          <Post
            className="post" key={post.id} post={post}
            onUpdate={() => {
              setPage(1);
              setHasMore(true);
              getPosts(1).then(setPosts);
            }}
          />
        ))}

        {/*loading indicator*/}
        {postsLoaded && (
          <div className="spinner-container">
            <BounceLoader size="150px" color="#008ed8" />
            <p>Loading posts...</p>
          </div>
        )}

        {/*intersection observer target*/}
        {hasMore && <div ref={ref} style={{ height: '20px' }} />}

        {/*no more posts indicator*/}
        {!hasMore && !postsLoaded && (
          <div className="no-more-posts">
            <p>No more posts to load.</p>
          </div>
        )}
      </div>

      {/* Floating + Button */}
      <button className="floating-plus-btn" onClick={() => setShowPopup(true)}>+</button>

      {/* Popup Post Prompt */}
      {showPopup && (
        <div className="post-popup">
          <div className="post-popup-overlay" onClick={() => setShowPopup(false)} />
          <div className="post-popup-content">
            <form onSubmit={handleUpload} className="post-form">
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="What's on your mind?"
                className="post-input"
                rows="3"
              />
              <button type="submit" className="post-button">Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
