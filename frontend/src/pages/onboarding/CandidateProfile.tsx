import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const CandidateProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock save profile
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-secondary">Let's set up your verified profile so employers can find you.</p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex gap-4">
            <Input label="First Name" placeholder="John" required className="flex-1" />
            <Input label="Last Name" placeholder="Doe" required className="flex-1" />
          </div>
          
          <Input 
            type="tel" 
            label="Phone Number" 
            placeholder="+1 (555) 000-0000" 
          />
          
          <Input 
            type="url" 
            label="LinkedIn Profile URL" 
            placeholder="https://linkedin.com/in/johndoe" 
          />

          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <Button type="submit" isLoading={isLoading} className="w-full">
              Save Profile & Continue
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CandidateProfile;
