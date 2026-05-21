import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const EmptyStateIllustration = () => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    Your pantri starts here
                </Text>

                <Text style={styles.subtitle}>
                    Tap the + to add your first item
                </Text>
            </View>

            <View>
                <Image
                    source={require('@/assets/images/arrow2.svg')}
                    style={styles.image}
                    contentFit="contain"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingBottom: 28,
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -100,
    },

    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#374151',
        letterSpacing: -0.8,
        marginBottom: 10,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 22,
        fontWeight: '500',
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 240,
    },

    image: {
        width: 220,
        height: 360,
    }
});