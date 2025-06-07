import { useAuth } from '../contexts/AuthContext';

export function ProfilePictureUpload() {
  const { updateProfilePicture, user } = useAuth();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await updateProfilePicture(file);
    } catch (error) {
      console.error('Failed to update profile picture:', error);
    }
  };

  return (
    <div>
      {user?.profile_picture && (
        <img 
          src={user.profile_picture} 
          alt="Profile" 
          style={{ width: 100, height: 100, borderRadius: '50%' }} 
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
} 