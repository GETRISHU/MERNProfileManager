
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ProfilePictureProps {
  onImageChange: (file: File | null) => void;
  currentImage: string | null;
}

const ProfilePicture = ({ onImageChange, currentImage }: ProfilePictureProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (!file) {
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG and PNG images are allowed');
      return;
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should not exceed 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Pass file to parent component
    onImageChange(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Profile Preview" 
              className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
            />
            <button 
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <Label htmlFor="profile-pic" className="mb-1">Profile Picture</Label>
        <input
          ref={fileInputRef}
          id="profile-pic"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={triggerFileInput}
          className="text-sm"
        >
          {previewUrl ? 'Change Photo' : 'Upload Photo'}
        </Button>
        
        {error && (
          <p className="text-destructive text-sm mt-2">{error}</p>
        )}
        
        <p className="text-muted-foreground text-xs mt-2">
          JPG or PNG, max 2MB
        </p>
      </div>
    </div>
  );
};

export default ProfilePicture;
