
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ProfilePicture from './ProfilePicture';
import PasswordStrengthMeter from './PasswordStrengthMeter';

interface PersonalInfoFormProps {
  formData: {
    profilePicture: File | null;
    profilePictureUrl: string | null;
    username: string;
    currentPassword: string;
    newPassword: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
}

const PersonalInfoForm = ({ formData, setFormData, onNext }: PersonalInfoFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null);

  const validateUsername = (username: string) => {
    // Clear previous timeout if any
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    // Basic validation
    if (!username) {
      setErrors(prev => ({ ...prev, username: 'Username is required' }));
      setUsernameAvailable(null);
      return;
    }

    if (username.length < 4 || username.length > 20) {
      setErrors(prev => ({ ...prev, username: 'Username must be between 4 and 20 characters' }));
      setUsernameAvailable(null);
      return;
    }

    if (username.includes(' ')) {
      setErrors(prev => ({ ...prev, username: 'Username cannot contain spaces' }));
      setUsernameAvailable(null);
      return;
    }

    // Set a new timeout for the API call
    const timeoutId = setTimeout(() => {
      setIsCheckingUsername(true);
      
      // Simulate API call to check username availability
      setTimeout(() => {
        const isAvailable = !['admin', 'test', 'user'].includes(username.toLowerCase());
        setUsernameAvailable(isAvailable);
        
        if (!isAvailable) {
          setErrors(prev => ({ ...prev, username: 'Username is already taken' }));
        } else {
          setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors.username;
            return newErrors;
          });
        }
        
        setIsCheckingUsername(false);
      }, 800);
    }, 500);

    setValidationTimeout(timeoutId);
  };

  const validatePassword = (currentPassword: string, newPassword: string) => {
    const newErrors: Record<string, string> = {};
    
    // Only validate if user is trying to change password
    if (newPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = 'Current password is required to set a new password';
      }
      
      if (newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters long';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        newErrors.newPassword = 'Password must contain at least one special character';
      } else if (!/\d/.test(newPassword)) {
        newErrors.newPassword = 'Password must contain at least one number';
      }
    }
    
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    
    // Validate username in real time
    if (name === 'username') {
      validateUsername(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Perform validation
    let newErrors: Record<string, string> = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    
    if (formData.username && (formData.username.length < 4 || formData.username.length > 20)) {
      newErrors.username = 'Username must be between 4 and 20 characters';
    }
    
    if (formData.username && formData.username.includes(' ')) {
      newErrors.username = 'Username cannot contain spaces';
    }
    
    // Validate passwords
    const passwordErrors = validatePassword(formData.currentPassword, formData.newPassword);
    newErrors = { ...newErrors, ...passwordErrors };
    
    // Check if profile picture is required
    if (!formData.profilePicture && !formData.profilePictureUrl) {
      newErrors.profilePicture = 'Profile picture is required';
    }
    
    // Check if username is available
    if (usernameAvailable === false) {
      newErrors.username = 'Username is already taken';
    }
    
    setErrors(newErrors);
    
    // If no errors, proceed to next step
    if (Object.keys(newErrors).length === 0 && usernameAvailable !== false) {
      onNext();
    }
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({ 
      ...prev, 
      profilePicture: file,
      profilePictureUrl: file ? URL.createObjectURL(file) : null
    }));
    
    // Clear profile picture error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.profilePicture;
      return newErrors;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-center mb-8">
        <ProfilePicture 
          onImageChange={handleImageChange}
          currentImage={formData.profilePictureUrl}
        />
      </div>
      {errors.profilePicture && (
        <p className="text-destructive text-sm text-center">
          {errors.profilePicture}
        </p>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              className={errors.username ? "border-destructive" : ""}
            />
            {isCheckingUsername && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="animate-spin h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            {usernameAvailable === true && !isCheckingUsername && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
            )}
          </div>
          {errors.username ? (
            <p className="text-destructive text-sm">{errors.username}</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Username must be between 4 and 20 characters with no spaces
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password (required if changing password)</Label>
          <Input
            id="current-password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            className={errors.currentPassword ? "border-destructive" : ""}
          />
          {errors.currentPassword && (
            <p className="text-destructive text-sm">{errors.currentPassword}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            className={errors.newPassword ? "border-destructive" : ""}
          />
          {errors.newPassword ? (
            <p className="text-destructive text-sm">{errors.newPassword}</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Password must be at least 8 characters with 1 special character and 1 number
            </p>
          )}
          {formData.newPassword && (
            <PasswordStrengthMeter password={formData.newPassword} />
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
