import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images, icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import {
  CalendarDays,
  ChevronDown,
  ChevronsUp,
  ChevronUp,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Backdrop from "@/components/Backdrop";
import InputField from "@/components/InputField";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";

const assignmentData = [
  { key: "1", value: "Super Admin" },
  { key: "2", value: "Admin" },
  { key: "3", value: "User" },
  { key: "4", value: "Contractor" },
  { key: "5", value: "Dealer" },
];

const priorityData = [
  { key: "1", value: "Super Admin" },
  { key: "2", value: "Admin" },
  { key: "3", value: "User" },
  { key: "4", value: "Contractor" },
  { key: "5", value: "Dealer" },
];

const Tasks = () => {
  const hasData = false;

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [assignment, setAssignment] = useState([]);
  const [priority, setPriority] = useState([]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const dateString = date.toISOString().split("T")[0].replaceAll("-", "/");
    setSelectedDate(dateString);
    hideDatePicker();
  };

  const [form, setForm] = useState({
    title: "",
  });

  // Coupon Code Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => {
    return ["49%", "80%"];
  }, []);

  // Coupon Code callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
            {hasData ? (
              <View className="pb-4">
                <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
                  <View className="flex-row items-center">
                    <ChevronsUp
                      size={18}
                      color="#E03137"
                      className="-ml-[2px]"
                    />
                    <Text className="text-sm text-red font-ManropeSemibold ml-1.5">
                      High
                    </Text>
                  </View>
                  <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6 mt-1">
                    Construction Skills: Definition and Examples.
                  </Text>
                  <Text className="text-sm text-dark-100 font-ManropeMedium mt-1">
                    14 Oct 2024
                  </Text>
                  <View className="bg-light w-full h-px my-3" />
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Image
                        source={images.user}
                        resizeMode="cover"
                        className="rounded-full border-2 border-white"
                        style={{ width: vs(30), height: vs(30) }}
                      />
                      <Image
                        source={images.user}
                        resizeMode="cover"
                        className="rounded-full border-2 border-white relative -ml-3"
                        style={{ width: vs(30), height: vs(30) }}
                      />
                    </View>
                    <View className="flex-row items-center">
                      <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                        <View className="bg-blue w-1.5 h-1.5" />
                      </View>
                      <Text className="text-base font-ManropeMedium text-blue ml-2">
                        Todo
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
                  <View className="flex-row items-center">
                    <ChevronUp
                      size={18}
                      color="#F9A000"
                      className="-ml-[2px] mt-px"
                    />
                    <Text className="text-sm text-yellow font-ManropeSemibold ml-1.5">
                      Medium
                    </Text>
                  </View>
                  <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6 mt-1">
                    Construction Skills: Definition and Examples.
                  </Text>
                  <Text className="text-sm text-dark-100 font-ManropeMedium mt-1">
                    14 Oct 2024
                  </Text>
                  <View className="bg-light w-full h-px my-3" />
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Image
                        source={images.user}
                        resizeMode="cover"
                        className="rounded-full border-2 border-white"
                        style={{ width: vs(30), height: vs(30) }}
                      />
                      <Image
                        source={images.user}
                        resizeMode="cover"
                        className="rounded-full border-2 border-white relative -ml-3"
                        style={{ width: vs(30), height: vs(30) }}
                      />
                    </View>
                    <View className="flex-row items-center">
                      <View className="bg-yellow-100 flex-row items-center justify-center w-3.5 h-3.5">
                        <View className="bg-yellow w-1.5 h-1.5" />
                      </View>
                      <Text className="text-base font-ManropeMedium text-yellow ml-2">
                        On-going
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
                  <View className="flex-row items-center">
                    <ChevronDown
                      size={18}
                      color="#1B78B9"
                      className="-ml-[2px] mt-[2px]"
                    />
                    <Text className="text-sm text-blue font-ManropeSemibold ml-1.5">
                      Low
                    </Text>
                  </View>
                  <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6 mt-1">
                    Construction Skills: Definition and Examples.
                  </Text>
                  <Text className="text-sm text-dark-100 font-ManropeMedium mt-1">
                    14 Oct 2024
                  </Text>
                  <View className="bg-light w-full h-px my-3" />
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Image
                        source={images.user}
                        resizeMode="cover"
                        className="rounded-full border-2 border-white"
                        style={{ width: vs(30), height: vs(30) }}
                      />
                      <Image
                        source={images.user}
                        resizeMode="cover"
                        className="rounded-full border-2 border-white relative -ml-3"
                        style={{ width: vs(30), height: vs(30) }}
                      />
                    </View>
                    <View className="flex-row items-center">
                      <View className="bg-green-100 flex-row items-center justify-center w-3.5 h-3.5">
                        <View className="bg-green w-1.5 h-1.5" />
                      </View>
                      <Text className="text-base font-ManropeMedium text-green ml-2">
                        Completed
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
                  <View className="flex-row items-center">
                    <ChevronsUp
                      size={18}
                      color="#E03137"
                      className="-ml-[2px]"
                    />
                    <Text className="text-sm text-red font-ManropeSemibold ml-1.5">
                      High
                    </Text>
                  </View>
                  <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6 mt-1">
                    Construction Skills: Definition and Examples.
                  </Text>
                  <Text className="text-sm text-dark-100 font-ManropeMedium mt-1">
                    14 Oct 2024
                  </Text>
                  <View className="bg-light w-full h-px my-3" />
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Image
                        source={images.user}
                        resizeMode="cover"
                        className="rounded-full border-2 border-white"
                        style={{ width: vs(30), height: vs(30) }}
                      />
                      <Image
                        source={images.user}
                        resizeMode="cover"
                        className="rounded-full border-2 border-white relative -ml-3"
                        style={{ width: vs(30), height: vs(30) }}
                      />
                    </View>
                    <View className="flex-row items-center">
                      <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                        <View className="bg-blue w-1.5 h-1.5" />
                      </View>
                      <Text className="text-base font-ManropeMedium text-blue ml-2">
                        Todo
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-grow flex-col items-center justify-center px-4">
                <Image
                  source={icons.noTask}
                  resizeMode="contain"
                  style={{ width: scale(80), height: vs(80) }}
                  className="mx-auto"
                />
                <View className="mt-8">
                  <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                    No Task found, please
                  </Text>
                  <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                    create task
                  </Text>
                  <View className="w-[158px] mx-auto mt-5">
                    <CustomButton
                      title="Add Task"
                      onPress={handlePresentModalPress}
                      IconLeft={Plus}
                      iconSize={20}
                    />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backdropComponent={Backdrop}
          backgroundStyle={{
            borderRadius: 24,
          }}
        >
          <BottomSheetView className="relative flex-grow p-4">
            <View className="mt-0">
              <InputField
                label=""
                value={form.title}
                onChangeText={(value: string) =>
                  setForm({ ...form, title: value })
                }
                placeholder="Title"
              />
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={showDatePicker}
              className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-2.5 relative"
            >
              <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2px]">
                {selectedDate ? (
                  selectedDate
                ) : (
                  <Text className="text-[#4A4A4A] pb-[2px]">Date</Text>
                )}
              </Text>
              <CalendarDays size={16} color="#4A4A4A" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <View className="mt-2.5">
              <MultipleSelectList
                setSelected={(val) => setAssignment(val)}
                data={assignmentData}
                save="value"
                fontFamily="Manrope-Medium"
                placeholder="Assignment"
                search={false}
                searchPlaceholder="Search..."
                arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
                searchicon={<Search size={16} color="#1C1C1C" />}
                closeicon={<X size={16} color="#1C1C1C" />}
                placeholderTextColor="#1B78B9"
                onSelect={() => {}}
                label="Permissions"
                boxStyles={{
                  backgroundColor: "#fff",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#EDEDED",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingTop: Platform.OS === "ios" ? 15 : 13,
                  paddingBottom: Platform.OS === "ios" ? 16 : 16,
                  alignItems: "center",
                  marginBottom: 2,
                }}
                inputStyles={{
                  color: "#1C1C1C",
                  fontSize: 15,
                }}
                dropdownStyles={{
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#EDEDED",
                  borderRadius: 12,
                  transition: "all 0.1s ease",
                }}
                badgeStyles={{
                  backgroundColor: "#1B78B9",
                  paddingHorizontal: 12,
                  paddingBottom: 6.5,
                  borderWidth: 0,
                }}
              />
            </View>
            <View className="mt-2">
              <SelectList
                setSelected={(val) => setPriority(val)}
                data={priorityData}
                save="value"
                fontFamily="Manrope-Medium"
                placeholder="Priority"
                search={false}
                arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
                placeholderTextColor="#1B78B9"
                boxStyles={{
                  backgroundColor: "#fff",
                  height: 54,
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#EDEDED",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingTop: Platform.OS === "ios" ? 12 : 10,
                  alignItems: "center",
                }}
                inputStyles={{
                  color: "#1C1C1C",
                  paddingHorizontal: 0,
                  fontSize: 15,
                }}
                dropdownStyles={{
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#EDEDED",
                  borderRadius: 12,
                  backgroundColor: "#fff",
                }}
              />
            </View>
            <View className="bg-white mt-4">
              <CustomButton title="Add Task" onPress={() => router.push("/")} />
            </View>
            <View className="-mx-1.5 mt-4 flex-row items-center">
              <View className="px-1.5 w-2/4">
                <CustomButton
                  title="Edit Task"
                  onPress={() => router.push("/")}
                  IconLeft={Pencil}
                />
              </View>
              <View className="px-1.5 w-2/4">
                <TouchableOpacity
                  onPress={() => router.push("/")}
                  className="bg-red rounded-xl h-[52px] rounded-xl pb-0.5 flex flex-row justify-center items-center"
                >
                  <Trash2 size={16} color="#ffffff" className="mr-2" />
                  <Text className="text-sm sm:text-base font-ManropeSemibold text-white text-center">
                    Delete Task
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Tasks;
