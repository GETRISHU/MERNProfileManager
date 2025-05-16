
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PersonalInfoForm from './PersonalInfoForm';
import ProfessionalDetailsForm from './ProfessionalDetailsForm';
import PreferencesForm from './PreferencesForm';
import SummaryPage from './SummaryPage';
import CompletionPage from './CompletionPage';

const steps = [
  'Personal Info',
  'Professional Details',
  'Preferences',
  'Summary',
];

const ProfileWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    profilePicture: null as File | null,
    profilePictureUrl: null as string | null,
    username: '',
    currentPassword: '',
    newPassword: '',
    
    // Step 2: Professional Details
    profession: '',
    companyName: '',
    addressLine1: '',
    
    // Step 3: Preferences
    country: '',
    state: '',
    city: '',
    subscriptionPlan: '',
    newsletter: true,
  });

  // Handle next step
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Handle form submit (final step)
  const handleSubmit = () => {
    // In a real app, you would send the data to your backend here
    console.log('Form submitted:', formData);
    
    // Move to completion page
    setCurrentStep(steps.length);
  };

  // Reset form
  const handleReset = () => {
    setCurrentStep(0);
    setFormData({
      profilePicture: null,
      profilePictureUrl: null,
      username: '',
      currentPassword: '',
      newPassword: '',
      profession: '',
      companyName: '',
      addressLine1: '',
      country: '',
      state: '',
      city: '',
      subscriptionPlan: '',
      newsletter: true,
    });
  };

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep >= index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {index + 1}
                </div>
                <div className="text-xs mt-2 text-muted-foreground">
                  {step}
                </div>
              </div>

              {/* Line between steps */}
              {index < steps.length - 1 && (
                <div 
                  className={`
                    w-12 h-0.5 mx-2
                    ${currentStep > index ? 'bg-primary' : 'bg-muted'}
                  `}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoForm 
            formData={formData} 
            setFormData={setFormData} 
            onNext={handleNext} 
          />
        );
      case 1:
        return (
          <ProfessionalDetailsForm 
            formData={formData} 
            setFormData={setFormData} 
            onNext={handleNext} 
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <PreferencesForm 
            formData={formData} 
            setFormData={setFormData} 
            onNext={handleNext} 
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <SummaryPage 
            formData={formData} 
            onPrevious={handlePrevious} 
            onSubmit={handleSubmit}
          />
        );
      case 4:
        return (
          <CompletionPage onReset={handleReset} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {currentStep === steps.length ? 'Complete!' : 'Update Your Profile'}
      </h1>
      
      {currentStep < steps.length && renderStepIndicators()}
      
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileWizard;
