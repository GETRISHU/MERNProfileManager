
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfessionalDetailsFormProps {
  formData: {
    profession: string;
    companyName: string;
    addressLine1: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onPrevious: () => void;
}

const ProfessionalDetailsForm = ({ formData, setFormData, onNext, onPrevious }: ProfessionalDetailsFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  useEffect(() => {
    // Show company details if profession is Entrepreneur
    setShowCompanyDetails(formData.profession === 'Entrepreneur');
  }, [formData.profession]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, profession: value }));
    
    // Clear profession error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.profession;
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Perform validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.profession) {
      newErrors.profession = 'Please select your profession';
    }
    
    if (formData.profession === 'Entrepreneur' && !formData.companyName) {
      newErrors.companyName = 'Company name is required for entrepreneurs';
    }
    
    if (!formData.addressLine1) {
      newErrors.addressLine1 = 'Address is required';
    }
    
    setErrors(newErrors);
    
    // If no errors, proceed to next step
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profession">Profession</Label>
          <Select 
            value={formData.profession} 
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className={errors.profession ? "border-destructive" : ""}>
              <SelectValue placeholder="Select your profession" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
              <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
            </SelectContent>
          </Select>
          {errors.profession && (
            <p className="text-destructive text-sm">{errors.profession}</p>
          )}
        </div>
        
        {showCompanyDetails && (
          <div className="space-y-2 animate-in fade-in-50 slide-in-from-top-5 duration-300">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your Company"
              className={errors.companyName ? "border-destructive" : ""}
            />
            {errors.companyName && (
              <p className="text-destructive text-sm">{errors.companyName}</p>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Address</Label>
          <Input
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="123 Main St"
            className={errors.addressLine1 ? "border-destructive" : ""}
          />
          {errors.addressLine1 && (
            <p className="text-destructive text-sm">{errors.addressLine1}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default ProfessionalDetailsForm;
