import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create an axios instance for the social media API (thanks sir) - cdg
export const api = axios.create({
  baseURL: 'https://supabase-socmed.vercel.app/',
  //baseURL: 'https://goshawk-one-bear.ngrok-free.app/',
  headers: {
    'ngrok-skip-browser-warning': 'yes', //needed to skip API errors with the new link
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (token) {
      try {
        const { data: userData } = await api.get('/user');
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user with token.", error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const refreshUser = () => {
    fetchUser();
  };

  const signIn = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      const { data } = await api.post('/sign-in', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      console.log(data);
      const accessToken = data.access_token;

      localStorage.setItem('token', accessToken);
      setToken(accessToken);

    } catch (error) {

      console.error('Full error:', error);

      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Sign in failed');
      }
      throw error;
    }
  };

  const register = async (email, fName, lName, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('fName', fName);
      formData.append('lName', lName);
      formData.append('password', password);

      await api.post('/register', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      await signIn(email, password);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

const updateProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profile', file);

    const { data } = await api.patch('/user/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    
    if (data && typeof data === 'object' && !Array.isArray(data) && data.id) {
      // If the response is a valid object, update the user state directly.
      setUser(data);
    } else {
      // If the response is not a valid object, throw an error.
      console.error('API did not return a valid user object.', data);
      throw new Error('Invalid response from server after picture upload.');
    }

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios error during profile picture update:", error.response);
      throw new Error(error.response.data?.message || 'Failed to update profile picture via API');
    }
    throw error;
  }
};

  // --- Posts API ---
  const getPosts = async (page = 1) => {
    const { data } = await api.get(`/post?page=${page}`);
    return data;
  };

  const getPost = async (id) => {
    const { data } = await api.get(`/post/${id}`);
    return data;
  };

  const uploadPost = async (content) => {
    const formData = new URLSearchParams();
    formData.append('content', content);
    const { data } = await api.post('/post', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
  };

  const likePost = async (id) => {
    await api.post(`/post/${id}/likes`);
  };

  const unlikePost = async (id) => {
    await api.delete(`/post/${id}/likes`);
  };

  const replyToPost = async (id, content) => {
    const formData = new URLSearchParams();
    formData.append('content', content);
    const { data } = await api.post(`/post/${id}/replies`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
  };

  const deleteReply = async (postId, replyId) => {
    const { data } = await api.delete(`/post/${postId}/replies/${replyId}`);
    return data;
  };

  const getPostsLikedByUser = async () => {
    const { data } = await api.get(`/user/likes`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    return data;
  }

  const getUserReplies = async () => {
    const { data } = await api.get(`/user/replies`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    return data;
  }

  const value = {
    user,
    token,
    loading,
    signIn,
    register,
    signOut,
    updateProfilePicture,
    refreshUser,
    getPosts,
    getPost,
    uploadPost,
    likePost,
    unlikePost,
    replyToPost,
    deleteReply,
    getPostsLikedByUser,
    getUserReplies
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}