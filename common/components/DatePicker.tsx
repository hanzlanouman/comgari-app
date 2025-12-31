import React, { useState } from 'react';

import { TouchableOpacity, Text } from 'react-native';

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { format } from "date-fns";

import { ErrorText } from './InputField';

export type DatePickerProps = {
    placeholder?: string,
    selectedDate: string | null | undefined,
    setSelectedDate?: (value: string | null) => void,
    error?: string | undefined | null;
    containerStyle?: string;
    disabled?: boolean;
}

export function DatePicker({ placeholder = "Select Date", selectedDate, setSelectedDate, error, containerStyle, disabled = false }: DatePickerProps) {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        const dateString = date.toISOString();
        if (setSelectedDate)
            setSelectedDate(dateString);
        hideDatePicker();
    };


    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onPress={disabled ? undefined : showDatePicker}
                style={{ height: 48 }}
                className={`flex flex-row justify-start items-center relative bg-white rounded-[10px] border border-black ${containerStyle}`}
            >
                <Text className="rounded-xl px-4 py-2 font-MontserratMedium text-[15px] flex-1">
                    {selectedDate ?
                        format(selectedDate, 'DD MMM YYYY')
                        :
                        <Text className="text-[#BAB7B7] pb-[2px]">{placeholder}</Text>
                    }
                </Text>
            </TouchableOpacity>
            {error ? (
                <ErrorText error={error} />
            ) : null}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </>
    );
}

