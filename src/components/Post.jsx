import { useState, useEffect } from 'react';
import { useAuth, api } from '../contexts/AuthContext';
import './Post.css';

export function Post({ post, onUpdate }) {
  const { likePost, unlikePost, replyToPost, token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [likeCount, setLikeCount] = useState(post.likes[0]?.count || 0);

  // Show replies variables.
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  // For post date & time formatting
  const postDateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

  // Initialize like count and status
  useEffect(() => {
    setLikeCount(post.likes[0]?.count || 0);
  }, [post.likes]);

  useEffect(() => {
    if (showReplyForm) {
      fetchReplies();
    }
  }, [showReplyForm]);

  // Fetch all replies to a post when the reply button is clicked
  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      const res = await api.get(`/post/${post.id}`);
      console.log(res.data);
      setReplies(res.data.replies || []);
    } catch (err) {
      console.error(err);
      setReplies([]);
    }
    setLoadingReplies(false);
  };

  /* FIXME: buggy as heck. (may double count and cause all 
      subsequent likes/unlikes to fail w/ HTTP 400, aka Bad Request)
      - cdg
  */
  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost(post.id);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await likePost(post.id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      // Don't call onUpdate here to prevent double counting
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert the like count if the API call fails
      setLikeCount(post.likes[0]?.count || 0);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await replyToPost(post.id, replyContent);
      setReplyContent('');
      await fetchReplies();
      onUpdate();
    } catch (error) {
      console.error('Error replying to post:', error);
    }
  };

  return (
    <div className="post">
      <div className="post-content">
        <p>{post.content}</p>
        <div className="post-meta">
          <span className="post-time">
            {new Date(post.created_at).toLocaleString('en-US', postDateOptions)} - Post #{post.id}
            <br />Created by user_id {post.owned_by}
          </span>
        </div>
      </div>

      <div className="post-actions">
        <button
          className={`action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span className="action-icon">❤️</span>
          <span className="action-count">{likeCount}</span>
        </button>

        <button
          className="action-button"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          <span className="action-icon">💬</span>
          <span className="action-count">{post.replies[0]?.count || 0}</span>
        </button>
      </div>

      {showReplyForm && (
        <>
          <form onSubmit={handleReply} className="reply-form">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="reply-input"
            />
            <button type="submit" className="reply-button">Reply</button>
          </form>
          <div className="replies-list">
            {loadingReplies ? (
              <div>Loading replies...</div>
            ) : (
              replies.length > 0 ? (
                replies.map(reply => (
                  <div key={reply.id} className="reply">
                    <div className="reply-meta">
                      <span>
                        Reply by {reply.users.fName} {reply.users.lName}<br />
                        {reply.created_at
                          ? new Date(reply.created_at).toLocaleString('en-US', postDateOptions)
                          : ''}
                      </span>
                    </div>
                    <div className="reply-content"><p>{reply.content}</p></div>

                  </div>
                ))
              ) : (
                <div>No replies yet.</div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}