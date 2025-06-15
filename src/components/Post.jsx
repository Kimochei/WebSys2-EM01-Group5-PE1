// kimochei/websys2-em01-group5-pe1/WebSys2-EM01-Group5-PE1-PE1/src/components/Post.jsx

import { useState, useEffect } from 'react';
import { useAuth, api } from '../contexts/AuthContext';
import './Post.css';
// Import icons
import { FaHeart, FaRegHeart, FaRegCommentDots } from 'react-icons/fa';

export function Post({ post, onUpdate }) {
  const { likePost, unlikePost, replyToPost } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [likeCount, setLikeCount] = useState(post.likes[0]?.count || 0);

  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  useEffect(() => {
    setLikeCount(post.likes[0]?.count || 0);
  }, [post.likes]);

  useEffect(() => {
    if (showReplyForm) {
      fetchReplies();
    }
  }, [showReplyForm]);

  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      const res = await api.get(`/post/${post.id}`);
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
  // patanggal na lang ng comment above if you managed to fix this, ty - cdg (@unawarespecs)

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
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert the local state on failure
      setLikeCount(post.likes[0]?.count || 0);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
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
        <div className="post-avatar">
            {/*use placeholder profpic if user has no assigned profile picture*/}
            <img src={post.users?.profile_picture ||
              'https://www.placeholderimage.online/images/generic/user-photo.jpg'}
                 alt={`${post.users?.fName || 'Unknown user'}'s avatar`} />
        </div>
        <div className="post-main">
            <div className="post-header">
              {/*same thing if user has no first or last name registered*/}
                <span className="post-author">{post.users?.fName || 'Unknown'} {post.users?.lName || 'user'}</span>
                <span className="post-time">
                    {new Date(post.created_at).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric'}
                    )}
                </span>
            </div>
            <div className="post-content">
                <p>{post.content}</p>
            </div>
            <div className="post-actions">
                <button
                    className={`action-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    {isLiked ? <FaHeart className="action-icon" /> : <FaRegHeart className="action-icon" />}
                </button>
                <button
                    className="action-button"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                >
                    <FaRegCommentDots className="action-icon" />
                </button>
            </div>
            <div className="post-footer">
                <span className="footer-link">{post.replies[0]?.count || 0} replies</span>
                <span className="footer-separator">·</span>
                <span className="footer-link">{likeCount} likes</span>
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
                                Reply by {reply.users.fName} {reply.users.lName} - {new Date(reply.created_at).toLocaleString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              month: 'numeric',
                              day: 'numeric',
                              year: 'numeric'})}
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
    </div>
  );
}