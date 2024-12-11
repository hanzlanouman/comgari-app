import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useNavigation, router } from "expo-router";
import { useMutation, useQueryClient } from 'react-query';

import StepsIndicator from './components/steps-indicator';
import JobDetails from './components/job-details';
import Specifications from './components/specifications';
import Review from './components/review';
import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { ClientRepository } from "@/repositories/client/client";

const AddProposal = () => {
  const clientRepo = ClientRepository.getInstance();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    client_id: 0,
    date: '',
    address: '',
    city: '',
    zip_code: 0,
    job_name: '',
    job_phone: '',
    project_director: '',
    estimated_days: 0,
    estimated_cost: 0.0,
    specification: '',
    project_id: 0,
  });
 
  const steps = ['Job details', 'Specifications', 'Review'];
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Add Proposal",
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{}}>
          <ArrowLeft size={24} color="#1C1C1C" />
        </TouchableOpacity>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  // Mutation for creating a proposal
  const createProposalMutation = useMutation(
    (payload) => clientRepo.createProposal(payload),
    {
      onSuccess: (response) => {
        // Invalidate and refetch proposals query
        queryClient.invalidateQueries('proposals');
        

      setTimeout(() => {
                // Show success alert
        alert("Proposal created successfully!");
        router.replace("/(root)/(tabs)/clients/[id]/proposal/");
      }, 500);
      
      },
      onError: (error) => {
        console.error("Error creating proposal:", error);
        alert("Failed to create proposal. Please try again.");
      }
    }
  );

  const updateFormData = (newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  const handleNextStep = (stepData = {}) => {
    updateFormData(stepData);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const payload = {
      client_id: formData.client_id,
      date: formData.date,
      address: formData.address,
      city: formData.city,
      zip_code: formData.zip_code,
      job_name: formData.job_name,
      job_phone: formData.job_phone,
      project_director: formData.project_director,
      estimated_days: formData.estimated_days,
      estimated_cost: formData.estimated_cost,
      specification: formData.specification,
      project_id: formData.project_id,
    };

    // Trigger the mutation
    createProposalMutation.mutate(payload);
  };

  const renderContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <JobDetails 
            initialData={formData}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <Specifications 
            initialData={formData}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 3:
        return (
          <Review 
            formData={formData}
            onSave={handleSave}
            isLoading={createProposalMutation.isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StepsIndicator currentStep={currentStep} steps={steps} />
      {renderContent()}
    </SafeAreaView>
  );
};

export default AddProposal;