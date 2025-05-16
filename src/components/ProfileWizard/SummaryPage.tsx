
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface SummaryPageProps {
  formData: {
    profilePicture: File | null;
    profilePictureUrl: string | null;
    username: string;
    currentPassword: string;
    newPassword: string;
    profession: string;
    companyName: string;
    addressLine1: string;
    country: string;
    state: string;
    city: string;
    subscriptionPlan: string;
    newsletter: boolean;
  };
  onPrevious: () => void;
  onSubmit: () => void;
}

const SummaryPage = ({ formData, onPrevious, onSubmit }: SummaryPageProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call to submit data
    try {
      // Here you would normally send data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success notification
      toast.success('Profile updated successfully!');
      
      // Call the onSubmit function
      onSubmit();
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center mb-6">Review Your Information</h2>
      
      <div className="flex justify-center mb-6">
        {formData.profilePictureUrl ? (
          <img 
            src={formData.profilePictureUrl} 
            alt="Profile Preview" 
            className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
            <span className="text-4xl text-muted-foreground">?</span>
          </div>
        )}
      </div>
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-muted-foreground">Username:</div>
              <div>{formData.username}</div>
              
              <div className="text-muted-foreground">Password:</div>
              <div>{formData.newPassword ? '••••••••' : 'Not changed'}</div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Professional Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-muted-foreground">Profession:</div>
              <div>{formData.profession}</div>
              
              {formData.profession === 'Entrepreneur' && (
                <>
                  <div className="text-muted-foreground">Company:</div>
                  <div>{formData.companyName}</div>
                </>
              )}
              
              <div className="text-muted-foreground">Address:</div>
              <div>{formData.addressLine1}</div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-muted-foreground">Country:</div>
              <div>{formData.country}</div>
              
              <div className="text-muted-foreground">State:</div>
              <div>{formData.state}</div>
              
              <div className="text-muted-foreground">City:</div>
              <div>{formData.city}</div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Preferences</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-muted-foreground">Subscription Plan:</div>
              <div>{formData.subscriptionPlan}</div>
              
              <div className="text-muted-foreground">Newsletter:</div>
              <div>{formData.newsletter ? 'Subscribed' : 'Not subscribed'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </div>
  );
};

export default SummaryPage;
