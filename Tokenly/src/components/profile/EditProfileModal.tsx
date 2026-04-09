import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Camera, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import type { EditProfileModalProps } from '../../types/profile';
import { uploadAvatar, uploadCover } from '../../services/storageService';

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  userId,
  onSave,
}) => {
  const [formData, setFormData] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Keep form in sync when user prop changes (modal re-opens)
  useEffect(() => {
    if (isOpen) {
      setFormData(user);
      setAvatarPreview(null);
      setCoverPreview(null);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Show local preview immediately
    setAvatarPreview(URL.createObjectURL(file));

    setUploading(true);
    const { data, error } = await uploadAvatar(userId, file);
    setUploading(false);

    if (error) {
      console.error('Avatar upload failed:', error);
      setAvatarPreview(null);
      return;
    }

    if (data?.url) {
      const freshUrl = `${data.url}?t=${Date.now()}`;
      setAvatarPreview(freshUrl);
      setFormData((prev) => ({ ...prev, profileImageUrl: freshUrl }));
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setCoverPreview(URL.createObjectURL(file));

    setUploading(true);
    const { data, error } = await uploadCover(userId, file);
    setUploading(false);

    if (error) {
      console.error('Cover upload failed:', error);
      setCoverPreview(null);
      return;
    }

    if (data?.url) {
      const freshUrl = `${data.url}?t=${Date.now()}`;
      setCoverPreview(freshUrl);
      setFormData((prev) => ({ ...prev, coverImage: freshUrl }));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setFormData((prev) => ({ ...prev, profileImageUrl: '' }));
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setFormData((prev) => ({ ...prev, coverImage: '' }));
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  // Resolve what to show: local preview → existing URL → nothing
  const displayAvatar = avatarPreview || formData.profileImageUrl || '';
  const displayCover = coverPreview || formData.coverImage || '';
  const initials = formData.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* ========== COVER IMAGE ========== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image
              </label>
              <div className="relative h-32 w-full overflow-hidden rounded-xl border border-gray-200 bg-linear-to-r from-indigo-100 via-sky-100 to-purple-100">
                {displayCover ? (
                  <img
                    src={displayCover}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                ) : null}

                {/* Overlay buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition hover:bg-black/30 hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow transition hover:bg-white"
                  >
                    <ImagePlus size={14} className="mr-1 inline" />
                    {displayCover ? 'Change' : 'Upload'}
                  </button>
                  {displayCover ? (
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-rose-600 shadow transition hover:bg-white"
                    >
                      <Trash2 size={14} className="mr-1 inline" />
                      Remove
                    </button>
                  ) : null}
                </div>

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
              </div>
            </div>

            {/* ========== PROFILE PICTURE ========== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-gray-200 bg-linear-to-br from-indigo-500 to-sky-500 text-xl font-bold text-white">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials || '?'
                    )}
                  </div>

                  {/* Camera badge */}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow transition hover:bg-indigo-700"
                  >
                    <Camera size={13} />
                  </button>

                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                  >
                    Upload new photo
                  </button>
                  {displayAvatar ? (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-sm text-rose-500 transition hover:text-rose-600"
                    >
                      Remove photo
                    </button>
                  ) : (
                    <p className="text-xs text-gray-500">
                      JPG, PNG or WebP. Max 2MB.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Uploading indicator */}
            {uploading ? (
              <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
                <Loader2 size={14} className="animate-spin" />
                Uploading image...
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., Software Engineer, UX Designer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website (Optional)
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Tell others about yourself, your skills, and what you're passionate about..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;