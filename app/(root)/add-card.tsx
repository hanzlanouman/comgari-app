import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { useState } from "react";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const AddCard = () => {
  const [form, setForm] = useState({
    cardHolderName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 py-4">
        <View>
          <InputField
            label="Card Holder Name"
            value={form.cardHolderName}
            onChangeText={(value: string) =>
              setForm({ ...form, cardHolderName: value })
            }
            placeholder="Card holder name"
          />
        </View>
        <View className="mt-3">
          <InputField
            label="Card Number"
            value={form.cardNumber}
            onChangeText={(value: string) =>
              setForm({ ...form, cardNumber: value })
            }
            placeholder="Card number"
          />
        </View>
        <View className="flex-row -mx-2 mt-3">
          <View className="px-2 w-2/4">
            <InputField
              label="Expiry Date"
              value={form.expDate}
              onChangeText={(value: string) =>
                setForm({ ...form, expDate: value })
              }
              placeholder="26/2024"
            />
          </View>
          <View className="px-2 w-2/4">
            <InputField
              label="CVV"
              value={form.cvv}
              onChangeText={(value: string) => setForm({ ...form, cvv: value })}
              placeholder="Cvv"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
      <View className="px-4 pt-4 bg-white">
        <CustomButton
          title="Add Card"
          onPress={() => router.push("/(root)/go-pro")}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddCard;
