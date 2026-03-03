import { useLoginMutation } from "@/src/features/auth/hooks/useAuthMutation"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, Button, TextInput, View } from "react-native"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();

    const loginMutation = useLoginMutation();

    const handleLogin = () => {
        loginMutation.mutate(
            { email, password },
            {
                onError: (error: any) => {
                    const message = error.response?.data?.message || "Invalid credentials";
                    Alert.alert("Login Failed", message);
                },
            }
        );
    };

    return (
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
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
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={() => router.replace("/(auth)/register")} />
        </View>
    )
}