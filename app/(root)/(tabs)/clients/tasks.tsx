// import {
//     SafeAreaView,
//     ScrollView,
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//     Platform,
//   } from "react-native";
//   import { scale, vs } from "react-native-size-matters";
//   import { images } from "@/constants";
//   import { CustomButton } from "@/common/components";
//   import { router } from "expo-router";
//   import { ChevronDown, ChevronsUp, ChevronUp } from "lucide-react-native";
  
//   const Tasks = () => {
//     const hasData = true;
  
//     return (
//       <SafeAreaView className="flex-1 bg-white">
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
//           {hasData ? (
//             <View className="pb-4">
//               <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
//                 <View className="flex-row items-center">
//                   <ChevronsUp size={18} color="#E03137" className="-ml-[2px]" />
//                   <Text className="text-sm text-red font-ManropeSemibold ml-1.5">
//                     High
//                   </Text>
//                 </View>
//                 <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6 mt-1">
//                   Construction Skills: Definition and Examples.
//                 </Text>
//                 <Text className="text-sm text-dark-100 font-ManropeMedium mt-1">
//                   14 Oct 2024
//                 </Text>
//                 <View className="bg-light w-full h-px my-3" />
//                 <View className="flex-row items-center justify-between">
//                   <View className="flex-row items-center">
//                     <Image
//                       source={images.user}
//                       resizeMode="cover"
//                       className="rounded-full border-2 border-white"
//                       style={{ width: vs(30), height: vs(30) }}
//                     />
//                     <Image
//                       source={images.user}
//                       resizeMode="cover"
//                       className="rounded-full border-2 border-white relative -ml-3"
//                       style={{ width: vs(30), height: vs(30) }}
//                     />
//                   </View>
//                   <View className="flex-row items-center">
//                     <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
//                       <View className="bg-blue w-1.5 h-1.5" />
//                     </View>
//                     <Text className="text-base font-ManropeMedium text-blue ml-2">
//                       Todo
//                     </Text>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//               <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
//                 <View className="flex-row items-center">
//                   <ChevronUp
//                     size={18}
//                     color="#F9A000"
//                     className="-ml-[2px] mt-px"
//                   />
//                   <Text className="text-sm text-yellow font-ManropeSemibold ml-1.5">
//                     Medium
//                   </Text>
//                 </View>
//                 <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6 mt-1">
//                   Construction Skills: Definition and Examples.
//                 </Text>
//                 <Text className="text-sm text-dark-100 font-ManropeMedium mt-1">
//                   14 Oct 2024
//                 </Text>
//                 <View className="bg-light w-full h-px my-3" />
//                 <View className="flex-row items-center justify-between">
//                   <View className="flex-row items-center">
//                     <Image
//                       source={images.user}
//                       resizeMode="cover"
//                       className="rounded-full border-2 border-white"
//                       style={{ width: vs(30), height: vs(30) }}
//                     />
//                     <Image
//                       source={images.user}
//                       resizeMode="cover"
//                       className="rounded-full border-2 border-white relative -ml-3"
//                       style={{ width: vs(30), height: vs(30) }}
//                     />
//                   </View>
//                   <View className="flex-row items-center">
//                     <View className="bg-yellow-100 flex-row items-center justify-center w-3.5 h-3.5">
//                       <View className="bg-yellow w-1.5 h-1.5" />
//                     </View>
//                     <Text className="text-base font-ManropeMedium text-yellow ml-2">
//                       On-going
//                     </Text>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//               <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
//                 <View className="flex-row items-center">
//                   <ChevronDown
//                     size={18}
//                     color="#1B78B9"
//                     className="-ml-[2px] mt-[2px]"
//                   />
//                   <Text className="text-sm text-blue font-ManropeSemibold ml-1.5">
//                     Low
//                   </Text>
//                 </View>
//                 <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6 mt-1">
//                   Construction Skills: Definition and Examples.
//                 </Text>
//                 <Text className="text-sm text-dark-100 font-ManropeMedium mt-1">
//                   14 Oct 2024
//                 </Text>
//                 <View className="bg-light w-full h-px my-3" />
//                 <View className="flex-row items-center justify-between">
//                   <View className="flex-row items-center">
//                     <Image
//                       source={images.user}
//                       resizeMode="cover"
//                       className="rounded-full border-2 border-white"
//                       style={{ width: vs(30), height: vs(30) }}
//                     />
//                     <Image
//                       source={images.user}
//                       resizeMode="cover"
//                       className="rounded-full border-2 border-white relative -ml-3"
//                       style={{ width: vs(30), height: vs(30) }}
//                     />
//                   </View>
//                   <View className="flex-row items-center">
//                     <View className="bg-green-100 flex-row items-center justify-center w-3.5 h-3.5">
//                       <View className="bg-green w-1.5 h-1.5" />
//                     </View>
//                     <Text className="text-base font-ManropeMedium text-green ml-2">
//                       Completed
//                     </Text>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//               <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
//                 <View className="flex-row items-center">
//                   <ChevronsUp size={18} color="#E03137" className="-ml-[2px]" />
//                   <Text className="text-sm text-red font-ManropeSemibold ml-1.5">
//                     High
//                   </Text>
//                 </View>
//                 <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6 mt-1">
//                   Construction Skills: Definition and Examples.
//                 </Text>
//                 <Text className="text-sm text-dark-100 font-ManropeMedium mt-1">
//                   14 Oct 2024
//                 </Text>
//                 <View className="bg-light w-full h-px my-3" />
//                 <View className="flex-row items-center justify-between">
//                   <View className="flex-row items-center">
//                     <Image
//                       source={images.user}
//                       resizeMode="cover"
//                       className="rounded-full border-2 border-white"
//                       style={{ width: vs(30), height: vs(30) }}
//                     />
//                     <Image
//                       source={images.user}
//                       resizeMode="cover"
//                       className="rounded-full border-2 border-white relative -ml-3"
//                       style={{ width: vs(30), height: vs(30) }}
//                     />
//                   </View>
//                   <View className="flex-row items-center">
//                     <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
//                       <View className="bg-blue w-1.5 h-1.5" />
//                     </View>
//                     <Text className="text-base font-ManropeMedium text-blue ml-2">
//                       Todo
//                     </Text>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View className="flex-grow flex-col items-center justify-center px-4">
//               <Image
//                 source={icons.noTask}
//                 resizeMode="contain"
//                 style={{ width: scale(80), height: vs(80) }}
//                 className="mx-auto"
//               />
//               <View className="mt-8">
//                 <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
//                   No Task found, please
//                 </Text>
//                 <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
//                   create task
//                 </Text>
//                 <View className="w-[158px] mx-auto mt-5">
//                   <CustomButton title="Add Task" onPress={() => {}} />
//                 </View>
//               </View>
//             </View>
//           )}
//         </ScrollView>
//       </SafeAreaView>
//     );
//   };
  
//   export default Tasks;