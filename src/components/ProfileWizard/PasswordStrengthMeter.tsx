
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const calculateStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains lowercase letters
    if (/[a-z]/.test(password)) strength += 25;
    
    // Contains uppercase letters or numbers
    if (/[A-Z0-9]/.test(password)) strength += 25;
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    return strength;
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  const getColorClass = (strength: number): string => {
    if (strength <= 25) return 'bg-destructive';
    if (strength <= 50) return 'bg-amber-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const strength = calculateStrength(password);
  const label = getStrengthLabel(strength);
  const colorClass = getColorClass(strength);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Password strength:</span>
        <span className="text-xs font-medium">{password ? label : ''}</span>
      </div>
      <Progress value={strength} className={password ? colorClass : ''} />
    </div>
  );
};

export default PasswordStrengthMeter;
