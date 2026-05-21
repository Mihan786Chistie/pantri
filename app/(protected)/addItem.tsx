import { AddItemForm } from "@/src/features/items/components/organisms/AddItemForm";
import { AddItemTemplate } from "@/src/features/items/components/templates/AddItemTemplate";
import { useRouter } from "expo-router";
import React from "react";

export default function AddItem() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <AddItemTemplate onBack={handleBack}>
            <AddItemForm onSuccess={handleBack} />
        </AddItemTemplate>
    );
}