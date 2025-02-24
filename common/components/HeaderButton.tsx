import React from 'react'
import { TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

type HeaderButtonProps = {
    onPress: () => void;
    disabled?: boolean;
    icon: React.ReactNode | React.JSX.Element;
}

export function HeaderButton({ onPress, disabled, icon }: HeaderButtonProps) {
    return (
        <LinearGradient
            colors={["#1B78B9", "#63348F"]}
            style={{
                borderRadius: 999,
                width: 32,
                height: 32,
                marginLeft: 16,
            }}
            start={[0, 0]}
            end={[1, 1]}>
            <TouchableOpacity
                onPress={onPress}
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                disabled={disabled}>
                {icon}
            </TouchableOpacity>
        </LinearGradient>
    )
}
