import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { useMutation } from 'react-query';

import StepsIndicator from './components/steps-indicator';
import JobDetails from './components/job-details';
import Specifications from './components/specifications';
import Review from './components/review';
import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { ClientRepository } from "@/repositories/client/client";

const AddProposal = () => {
  const clientRepo = ClientRepository.getInstance();

  // Get route params
  const { proposalId: proposalId, id: projectId, ...initialParams } = useLocalSearchParams();
  const isEditing = Boolean(proposalId && !isNaN(Number(proposalId)));
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    client_id: Number(projectId),
    date: '',
    address: '',
    city: '',
    zip_code: undefined,
    job_name: '',
    job_phone: '',
    project_director: '',
    estimated_days: undefined,
    estimated_cost: undefined,
    specification: '',
    project_id: Number(projectId),
  });

  // Steps for the wizard
  const steps = ['Job details', 'Specifications', 'Review'];
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: isEditing ? "Edit Proposal" : "Add Proposal",
      headerLeft: () => (
        <TouchableOpacity onPressIn={() => router.back()} style={{}}>
          <ArrowLeft size={24} color="#1C1C1C" />
        </TouchableOpacity>
      ),
      headerTitleAlign: "center",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useEffect(() => {
    if (isEditing) {
      setFormData((prevData) => ({
        ...prevData,
        ...initialParams,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);


  // Mutation for creating a proposal
  const createProposalMutation = useMutation(
    (payload) => clientRepo.createProposal(payload),
    {
      onSuccess: (response) => {
        alert("Proposal created successfully!");
        router.replace({
          pathname: `/(root)/(tabs)/clients/${formData.project_id}/proposal`,
          params: { id: formData.project_id },
        });
      },
      onError: (error) => {
        console.error("Error creating proposal:", error);
        alert("Failed to create proposal. Please try again.");
      },
    }
  );

  // Mutation for updating a proposal
  const updateProposalMutation = useMutation(
    ({ proposalId, payload }) => clientRepo.updateProposal(proposalId, payload),
    {
      onSuccess: () => {
        alert("Proposal updated successfully!");
        router.replace({
          pathname: `/(root)/(tabs)/clients/${formData.project_id}/proposal`,
          params: { id: formData.project_id },
        });

      },
      onError: (error) => {
        console.error("Error updating proposal:", error);
        alert("Failed to update proposal. Please try again.");
      },
    }
  );

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
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

    // Trigger the appropriate mutation
    if (isEditing) {
      updateProposalMutation.mutate({ proposalId: Number(proposalId), payload });
    } else {
      createProposalMutation.mutate(payload);
    }
  };




  return (
    <SafeAreaView className="flex-1 bg-white">
      <StepsIndicator currentStep={currentStep} steps={steps} />
      {currentStep === 1 && (<JobDetails
        initialData={formData}
        onNext={handleNextStep}
      />)}
      <Specifications
        initialData={formData}
        onNext={handleNextStep}
        onPrevious={handlePreviousStep}
        currentStep={currentStep}
      />
      {currentStep === 3 && (<Review
        formData={formData}
        onSave={handleSave}
      />)}
    </SafeAreaView>
  );
};

export default AddProposal;
