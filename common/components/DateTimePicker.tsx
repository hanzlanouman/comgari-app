import React, { useState } from 'react';

import { isBefore } from "date-fns";

import { TouchableOpacity } from 'react-native';

import
DateTimePickerModal,
{ DateTimePickerProps } from "react-native-modal-datetime-picker";

import { showAlertBox } from '@/utils';

interface DateTimePickerComponentProps extends Omit<DateTimePickerProps, 'date' | 'onConfirm' | 'onCancel'> {
    setDate: (date: string | undefined) => void,
    date: string | undefined,
    tigger: React.ReactNode,
    minimumTime?: undefined | Date
    minimumTimeMessage?: undefined | string
}

export function DateTimePicker({ minimumTime, minimumTimeMessage, date, setDate, tigger, ...props }: DateTimePickerComponentProps) {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        if (minimumTime) {
            if (isBefore(date, minimumTime)) {
                hideDatePicker();
                showAlertBox("Error", minimumTimeMessage || "Minimum time is after current time");

                return;
            }
        }
        const dateString = date.toISOString();
        setDate(dateString);
        hideDatePicker();
    };

    return (
        <>
            <TouchableOpacity onPress={showDatePicker}>
                {tigger}
            </TouchableOpacity>
            <DateTimePickerModal
                {...props}
                date={date ? new Date(date) : undefined}
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                buttonTextColorIOS="#000"
            />
        </>
    );
}

