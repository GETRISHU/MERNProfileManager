
import React from 'react';
import { Button } from '@/components/ui/button';

interface CompletionPageProps {
  onReset: () => void;
}

const CompletionPage = ({ onReset }: CompletionPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold text-center">Profile Updated Successfully!</h2>
      
      <p className="text-muted-foreground text-center max-w-md">
        Your profile information has been updated successfully. Thank you for completing the form.
      </p>
      
      <div className="flex flex-col space-y-4 mt-4">
        <Button onClick={onReset}>Update Profile Again</Button>
        <Button variant="outline" asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default CompletionPage;
