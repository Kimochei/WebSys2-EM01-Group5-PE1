import {createContext, useContext, useState} from 'react';
import axios from 'axios';

// Create an axios instance for the social media API (thanks sir) - cdg
const api = axios.create({
  baseURL: 'https://supabase-socmed.vercel.app/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
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

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const signIn = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      const {data} = await api.post('/sign-in', formData);
      console.log(data);
      const accessToken = data.access_token;

      // Store token in localStorage
      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      // Fetch user data
      const {data: userData} = await api.get('/user');
      setUser(userData);
    } catch (error) {
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

      await api.post('/register', formData);

      // After registration, sign in the user
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

      const {data} = await api.patch('/user/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(data[0]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update profile picture');
      }
      throw error;
    }
  };

  // --- Posts API ---
  const getPosts = async (page = 1) => {
    const {data} = await api.get(`/post?page=${page}`);
    return data;
  };

  const getPost = async (id) => {
    const {data} = await api.get(`/post/${id}`);
    return data;
  };

  const uploadPost = async (content) => {
    const formData = new URLSearchParams();
    formData.append('content', content);
    const {data} = await api.post('/post', formData);
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
    const {data} = await api.post(`/post/${id}/replies`, formData);
    return data;
  };

  const deleteReply = async (postId, replyId) => {
    const {data} = await api.delete(`/post/${postId}/replies/${replyId}`);
    return data;
  };

  const value = {
    user,
    token,
    signIn,
    register,
    signOut,
    updateProfilePicture,
    //posts API
    getPosts,
    getPost,
    uploadPost,
    likePost,
    unlikePost,
    replyToPost,
    deleteReply
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