// import { View, Text } from "react-native";
// import React, { useEffect, useState } from "react";
// import { InputField } from "@/common/components";
// import { useStripe } from "@stripe/stripe-react-native";
// import { useQuery } from "react-query";
// import { PaymentRepository } from "@/repositories/payment/payment";

// export default function AddPaymentcards() {
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();
//   const paymentRepo = PaymentRepository.getInstance();
//   const [form, setForm] = useState({
//     cardHolderName: "",
//     cardNumber: "",
//     expDate: "",
//     cvv: "",
//   });
//   const { data: res } = useQuery(
//     ["create-buyer"],
//     async () => {
//       return await paymentRepo.createBuyer();
//     },
//     {}
//   );
//   useEffect(() => {
//     if (res) {
//       const { setupIntent, customer, ephemeralKeys } = res?.data;
//       const { error } = await initPaymentSheet({
//         customerId: customer,
//         customerEphemeralKeySecret: ephemeralKeys.secret,
//         setupIntentClientSecret: setupIntent,
//         merchantDisplayName: "EAFA",
//       });
//     }
//   }, [res]);
//   return (
//     <View className="flex-1 px-5 py-4">
//       <View>
//         <InputField
//           label="Card Holder Name"
//           value={form.cardHolderName}
//           onChangeText={(value: string) =>
//             setForm({ ...form, cardHolderName: value })
//           }
//           placeholder="Card holder name"
//         />
//       </View>
//       <View className="mt-3">
//         <InputField
//           label="Card Number"
//           value={form.cardNumber}
//           onChangeText={(value: string) =>
//             setForm({ ...form, cardNumber: value })
//           }
//           placeholder="Card number"
//         />
//       </View>
//       <View className="flex-row -mx-2 mt-3">
//         <View className="px-2 w-2/4">
//           <InputField
//             label="Expiry Date"
//             value={form.expDate}
//             onChangeText={(value: string) =>
//               setForm({ ...form, expDate: value })
//             }
//             placeholder="26/2024"
//           />
//         </View>
//         <View className="px-2 w-2/4">
//           <InputField
//             label="CVV"
//             value={form.cvv}
//             onChangeText={(value: string) => setForm({ ...form, cvv: value })}
//             placeholder="Cvv"
//             keyboardType="numeric"
//           />
//         </View>
//       </View>
//     </View>
//   );
// }
