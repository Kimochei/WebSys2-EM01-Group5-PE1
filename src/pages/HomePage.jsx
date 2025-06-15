import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Post } from '../components/Post';
import { BounceLoader } from 'react-spinners';
import { useInView } from 'react-intersection-observer';
import './HomePage.css';

export function HomePage() {
  const { getPosts, uploadPost } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [postsLoaded, setPostsLoaded] = useState(false);

  // page tracker for infinite scrolling (like threads/twitter)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.title = 'Home';
  }, []);

  // initial post loads (page 1)
  useEffect(() => {
    const initialLoad = async () => {
      setPostsLoaded(true);
      const fetchedPosts = await getPosts(1);
      setPosts(fetchedPosts);
      setPostsLoaded(false);
    };
    initialLoad();
  }, [getPosts]);

  // for infinite scrolling
  // as of coding there are 12 posts in the API and only 10 of them are shown - cdg (@unawarespecs)
  useEffect(() => {
    const loadMore = async () => {
      if (inView && !postsLoaded && hasMore) {
        setPostsLoaded(true);
        const nextPage = page + 1;
        const newPosts = await getPosts(nextPage);

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          // Filter out duplicates based on post ID
          const uniquePosts = [...posts];
          newPosts.forEach(newPost => {
            if (!uniquePosts.some(existing => existing.id === newPost.id)) {
              uniquePosts.push(newPost);
            }
          });

          setPosts(uniquePosts);
          setPage(nextPage);
        }
        setPostsLoaded(false);
      }
    };
    loadMore();
  }, [inView, postsLoaded, hasMore, page, getPosts]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    await uploadPost(newContent);
    setNewContent('');

    // Reset to initial state and reload first page
    setPage(1);
    setHasMore(true);
    const fetchedPosts = await getPosts(1);
    setPosts(fetchedPosts);
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

        {/* Loading indicator */}
        {postsLoaded && (
          <div className="spinner-container">
            <BounceLoader size="150px" color="#008ed8"/>
            <p>Loading posts...</p>
          </div>
        )}

        {/* Intersection observer target */}
        {hasMore && <div ref={ref} style={{ height: '20px' }}/>}

        {/* No more posts indicator */}
        {!hasMore && !postsLoaded && (
          <div className="no-more-posts">
            <p>No more posts to load.</p>
          </div>
        )}
      </div>
    </div>
  );
}