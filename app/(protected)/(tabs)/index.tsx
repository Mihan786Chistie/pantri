import { api } from "@/src/api/client";
import { useAuthStore } from "@/src/store/auth";
import { useQuery } from "@tanstack/react-query";
import { Button, Text, View } from "react-native";

export default function Index() {

    const logout = useAuthStore((s) => s.logout)

    const { data, isLoading, error } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await api.get("/users/profile")
            return res.data
        },
    })

    if (isLoading) return <Text>Loading...</Text>
    if (error) return <Text>Error: {error.message}</Text>

    return (
        <View style={{ padding: 50 }}>
            <Text>Index</Text>
            <Text>Name {data.name}</Text>
            <Text>Email {data.email}</Text>
            <Button title="Logout" onPress={logout} />
        </View>
    );
}