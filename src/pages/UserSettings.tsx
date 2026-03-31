import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Camera, Save } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';

export default function UserSettings() {
  const { user } = useFirebase();
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage('');

    try {
      // Update display name
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      // Update email
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Update password
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setMessage('Passwords do not match!');
          setSaving(false);
          return;
        }
        await updatePassword(user, newPassword);
        setNewPassword('');
        setConfirmPassword('');
      }

      setMessage('Profile updated successfully! ✅');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // TODO: Upload to storage and update photoURL
    setMessage('Photo upload feature coming soon!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <p className="text-white">Please login to view settings</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-24 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">⚙️ Account Settings</h1>
          <p className="text-gray-400">Manage your profile and account preferences</p>
        </motion.div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Profile Photo
            </h3>
            
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-[#3B31B8] rounded-full flex items-center justify-center text-3xl font-bold">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
              </div>
              
              <div>
                <label className="cursor-pointer inline-block px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  Change Photo
                </label>
                <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (max 2MB)</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3B31B8]"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3B31B8]"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3B31B8]"
                  placeholder="Enter new password (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3B31B8]"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-xl ${message.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
              {message}
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#3B31B8] hover:bg-[#4d42d4] text-white px-6 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
