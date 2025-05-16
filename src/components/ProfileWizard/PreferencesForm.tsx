
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PreferencesFormProps {
  formData: {
    country: string;
    state: string;
    city: string;
    subscriptionPlan: string;
    newsletter: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onPrevious: () => void;
}

const PreferencesForm = ({ formData, setFormData, onNext, onPrevious }: PreferencesFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState({
    countries: false,
    states: false,
    cities: false
  });

  // Simulating API calls
  useEffect(() => {
    // Fetch countries
    setIsLoading(prev => ({ ...prev, countries: true }));
    
    setTimeout(() => {
      setCountries(['USA', 'Canada', 'UK', 'Australia', 'India']);
      setIsLoading(prev => ({ ...prev, countries: false }));
    }, 500);
  }, []);
  
  // Fetch states when country changes
  useEffect(() => {
    if (formData.country) {
      setIsLoading(prev => ({ ...prev, states: true }));
      setStates([]);
      setCities([]);
      
      // Reset state and city when country changes
      setFormData(prev => ({
        ...prev,
        state: '',
        city: ''
      }));
      
      setTimeout(() => {
        switch(formData.country) {
          case 'USA':
            setStates(['California', 'Texas', 'New York', 'Florida']);
            break;
          case 'Canada':
            setStates(['Ontario', 'Quebec', 'British Columbia']);
            break;
          case 'UK':
            setStates(['England', 'Scotland', 'Wales']);
            break;
          case 'Australia':
            setStates(['New South Wales', 'Victoria', 'Queensland']);
            break;
          case 'India':
            setStates(['Maharashtra', 'Karnataka', 'Tamil Nadu']);
            break;
          default:
            setStates([]);
        }
        setIsLoading(prev => ({ ...prev, states: false }));
      }, 500);
    }
  }, [formData.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.state) {
      setIsLoading(prev => ({ ...prev, cities: true }));
      setCities([]);
      
      // Reset city when state changes
      setFormData(prev => ({
        ...prev,
        city: ''
      }));
      
      setTimeout(() => {
        // This is just a simulation - in a real app you'd fetch from API
        switch(formData.state) {
          case 'California':
            setCities(['Los Angeles', 'San Francisco', 'San Diego']);
            break;
          case 'Texas':
            setCities(['Houston', 'Austin', 'Dallas']);
            break;
          case 'New York':
            setCities(['New York City', 'Buffalo', 'Albany']);
            break;
          case 'Ontario':
            setCities(['Toronto', 'Ottawa', 'Hamilton']);
            break;
          case 'England':
            setCities(['London', 'Manchester', 'Birmingham']);
            break;
          case 'Maharashtra':
            setCities(['Mumbai', 'Pune', 'Nagpur']);
            break;
          default:
            setCities(['City 1', 'City 2', 'City 3']);
        }
        setIsLoading(prev => ({ ...prev, cities: false }));
      }, 500);
    }
  }, [formData.state]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubscriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, subscriptionPlan: value }));
    
    // Clear error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.subscriptionPlan;
      return newErrors;
    });
  };

  const handleNewsletterChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, newsletter: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Perform validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }
    
    if (!formData.state) {
      newErrors.state = 'Please select your state';
    }
    
    if (!formData.city) {
      newErrors.city = 'Please select your city';
    }
    
    if (!formData.subscriptionPlan) {
      newErrors.subscriptionPlan = 'Please select a subscription plan';
    }
    
    setErrors(newErrors);
    
    // If no errors, proceed to next step
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select 
              value={formData.country} 
              onValueChange={(value) => handleSelectChange('country', value)}
              disabled={isLoading.countries}
            >
              <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {isLoading.countries ? (
                  <div className="flex justify-center p-2">
                    <svg className="animate-spin h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-destructive text-sm">{errors.country}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select 
              value={formData.state} 
              onValueChange={(value) => handleSelectChange('state', value)}
              disabled={!formData.country || isLoading.states}
            >
              <SelectTrigger className={errors.state ? "border-destructive" : ""}>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {isLoading.states ? (
                  <div className="flex justify-center p-2">
                    <svg className="animate-spin h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  states.map(state => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-destructive text-sm">{errors.state}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select 
              value={formData.city} 
              onValueChange={(value) => handleSelectChange('city', value)}
              disabled={!formData.state || isLoading.cities}
            >
              <SelectTrigger className={errors.city ? "border-destructive" : ""}>
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {isLoading.cities ? (
                  <div className="flex justify-center p-2">
                    <svg className="animate-spin h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  cities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.city && (
              <p className="text-destructive text-sm">{errors.city}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Subscription Plan</Label>
            <RadioGroup 
              value={formData.subscriptionPlan} 
              onValueChange={handleSubscriptionChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Basic" id="basic" />
                <Label htmlFor="basic" className="cursor-pointer">Basic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Pro" id="pro" />
                <Label htmlFor="pro" className="cursor-pointer">Pro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Enterprise" id="enterprise" />
                <Label htmlFor="enterprise" className="cursor-pointer">Enterprise</Label>
              </div>
            </RadioGroup>
            {errors.subscriptionPlan && (
              <p className="text-destructive text-sm">{errors.subscriptionPlan}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="newsletter" 
              checked={formData.newsletter} 
              onCheckedChange={handleNewsletterChange} 
            />
            <Label htmlFor="newsletter" className="cursor-pointer">
              Subscribe to our newsletter
            </Label>
          </div>
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

export default PreferencesForm;
