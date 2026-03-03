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

    const refresh = async () => {
        await api.get("/items", {
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZTA0YzU0Yy0yMWFlLTQ5NDMtOGU2Zi04YTE0M2U1NzdmMGIiLCJpYXQiOjE3NzA0NzY5NTEsImV4cCI6MTc3MDU2MzM1MX0.qkfjVkXOyP8_Ox3T61rwLP5QabttBkbyz2HJ1NqAROQ`
            }
        })
    }

    if (isLoading) return <Text>Loading...</Text>
    if (error) return <Text>Error: {error.message}</Text>

    return (
        <View style={{ padding: 50 }}>
            <Text>Index</Text>
            <Text>Name {data.name}</Text>
            <Text>Email {data.email}</Text>
            <Button title="Logout" onPress={logout} />
            <Button title="Refresh" onPress={refresh} />
        </View>
    );
}