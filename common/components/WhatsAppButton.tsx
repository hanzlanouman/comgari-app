import React from 'react';
import { TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { ms } from 'react-native-size-matters';

export const WhatsAppButton = () => {
    const pathname = usePathname();

    const excludedPaths = [
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/otp',
        '/privacy-policy',
        '/welcome',
        '/onboarding',
        '/sign-in',
        '/sign-up',
        '/google-profile',
        '/go-pro'
    ];

    const isExcluded = excludedPaths.some(path => pathname === path || pathname?.startsWith(`${path}/`));

    if (isExcluded) {
        return null;
    }

    const handlePress = () => {
        Linking.openURL('https://wa.me/+12317302424');
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePress}
            style={styles.button}
        >
            <FontAwesome name="whatsapp" size={ms(32)} color="white" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: ms(80), // Adjusted to be above the tab bar
        right: ms(20),
        backgroundColor: '#25D366', // Green color similar to WhatsApp
        width: ms(56),
        height: ms(56),
        borderRadius: ms(28),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        zIndex: 9999,
    },
});

export default WhatsAppButton;
