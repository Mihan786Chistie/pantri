import { useRegisterMutation } from "@/src/features/auth/hooks/useAuthMutation";
import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const registerMutation = useRegisterMutation();

    const handleRegister = () => {
        registerMutation.mutate(
            { email, password, name },
            {
                onError: (error: any) => {
                    const message = error.response.data.message.map((m: string) => m).join("\n") || "Registration failed";
                    Alert.alert("Registration Failed", message);
                },
            }
        );
    };
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Register Screen</Text>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
                style={{ borderWidth: 1, marginBottom: 10, width: "90%" }}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={{ borderWidth: 1, marginBottom: 10, width: "90%" }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderWidth: 1, marginBottom: 10, width: "90%" }}
            />
            <Button onPress={handleRegister}>Register</Button>
            <Button onPress={() => router.replace("/(auth)/login")}>Login</Button>
        </View>
    );
}
