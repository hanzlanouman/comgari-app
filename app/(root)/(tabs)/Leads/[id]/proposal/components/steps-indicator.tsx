import React from 'react';
import { View, Text } from 'react-native';

interface StepsIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepsIndicator: React.FC<StepsIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <View className="bg-gray px-4 py-3 flex-row items-center justify-between">
      {steps.map((step, index) => (
        <View key={index} className="flex-row items-center">
          <View 
            className={`w-7 h-7 rounded-full flex-row items-center justify-center 
              ${currentStep === index + 1 ? 'bg-blue' : 
                index < currentStep ? 'bg-green' : 'bg-white'}`}
          >
            <Text 
              className={`text-sm font-ManropeBold 
                ${currentStep === index + 1 ? 'text-white' : 
                  index < currentStep ? 'text-white' : 'text-dark'}`}
            >
              {index + 1}
            </Text>
          </View>
          <Text 
            className={`text-sm font-ManropeSemibold ml-2 
              ${currentStep === index + 1 ? 'text-blue' : 
                index < currentStep ? 'text-green' : 'text-dark'}`}
          >
            {step}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default StepsIndicator;