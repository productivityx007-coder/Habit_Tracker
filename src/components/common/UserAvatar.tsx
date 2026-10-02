import React, { useState } from 'react';

interface UserAvatarProps {
  photoURL?: string | null;
  displayName?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  photoURL,
  displayName,
  alt = 'Avatar',
  className,
  style,
  title,
}) => {
  const [prevPhotoURL, setPrevPhotoURL] = useState(photoURL);
  const [imageFailed, setImageFailed] = useState(false);

  // Reset failure state directly during render when photoURL changes
  if (photoURL !== prevPhotoURL) {
    setPrevPhotoURL(photoURL);
    setImageFailed(false);
  }

  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    displayName || 'User'
  )}`;

  const effectiveSrc = !imageFailed && photoURL ? photoURL : defaultAvatar;

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      className={className}
      style={style}
      title={title}
      referrerPolicy="no-referrer"
      onError={() => setImageFailed(true)}
    />
  );
};
