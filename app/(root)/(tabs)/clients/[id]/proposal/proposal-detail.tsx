import React, { useCallback, useMemo, useRef, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { vs } from "react-native-size-matters";
import {
  ArrowDownToLine,
  CalendarDays,
  ChevronRight,
  Share2,
  Pencil,
  Trash2,
  Settings,
} from "lucide-react-native";
import { images, getImageUrl } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Backdrop } from "@/common/components/Backdrop";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { moveFile, showErrorAlert, showSuccessAlert } from "@/utils";
import { HeaderButton } from "@/common/components";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Create HTML template for the PDF
const createProposalTemplate = (data: any) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 40px;
            color: #1C1C1C;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .project-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .project-type {
            color: #1B78B9;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #E5E5E5;
          }
          .label {
            color: #666;
          }
          .value {
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="project-title">${data.jobName || "Unnamed Project"}</div>
          <div class="project-type">${data.clientType || "Construction"}</div>
          <div>Date: ${formatDate(data.date?.toString() || new Date().toString())}</div>
        </div>

        <div class="info-row">
          <span class="label">Client Name:</span>
          <span class="value">${data.clientName || "Not Specified"}</span>
        </div>
        <div class="info-row">
          <span class="label">Project Director:</span>
          <span class="value">${data.projectDirector || "Not Specified"}</span>
        </div>
        <div class="info-row">
          <span class="label">Job Phone:</span>
          <span class="value">${data.jobPhone || "Not Specified"}</span>
        </div>
        <div class="info-row">
          <span class="label">Address:</span>
          <span class="value">${data.address || "Not Specified"}</span>
        </div>
        <div class="info-row">
          <span class="label">City:</span>
          <span class="value">${data.city || "Not Specified"}</span>
        </div>
        <div class="info-row">
          <span class="label">Zip:</span>
          <span class="value">${data.zip || "Not Specified"}</span>
        </div>
        <div class="info-row">
          <span class="label">Estimated Days:</span>
          <span class="value">${data.estimatedDays || "Not Specified"}</span>
        </div>
        <div class="info-row">
          <span class="label">Estimated Cost:</span>
          <span class="value">$${data.estimatedCost || "Not Specified"}</span>
        </div>
      </body>
    </html>
  `;
};

const Proposal = () => {
  const {
    id,
    jobName,
    jobPhone,
    city,
    zip,
    estimatedDays,
    clientName,
    clientType,
    address,
    date,
    clientId,
    estimatedCost,
    projectDirector,
    specification,
  } = useLocalSearchParams();

  // Download/Share Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const clientRepo = ClientRepository.getInstance();

  const snapPoints = useMemo(() => {
    return ["50%", "50%"];
  }, []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          onPress={handlePresentModalPress}
          icon={<Settings size={16} color="#ffffff" />}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleEditProposal = () => {
    bottomSheetModalRef.current?.close();
    router.push({
      pathname: "/(root)/(tabs)/clients/[id]/proposal/add-proposal",
      params: {
        id: Number(id),
        proposalId: id,
        job_name: jobName,
        job_phone: jobPhone,
        city: city,
        zip_code: zip,
        estimated_days: estimatedDays,
        address: address,
        date: date,
        client_id: clientId,
        estimated_cost: estimatedCost,
        project_director: projectDirector,
        specification: specification,
      },
    });
  };

  const handleDeleteProposal = () => {
    Alert.alert(
      "Delete Proposal",
      "Are you sure you want to delete this proposal?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await clientRepo.deleteProposal(Number(id));

              router.push({
                pathname: `/(root)/(tabs)/clients/${clientId}/proposal`,
                params: { id: clientId },
              });
            } catch (error) {
              console.error("Error deleting proposal:", error);
              Alert.alert("Error", "Failed to delete proposal");
            }
          },
        },
      ]
    );
  };

  // Generate PDF function
  const generatePDF = async () => {
    try {
      const proposalData = {
        jobName,
        jobPhone,
        city,
        zip,
        estimatedDays,
        clientName,
        clientType,
        address,
        date,
        estimatedCost,
        projectDirector,
      };

      const html = createProposalTemplate(proposalData);
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      return uri;
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF");
      return null;
    }
  };

  const handleDownloadProposal = async () => {
    bottomSheetModalRef?.current?.close();
    const uri = await generatePDF();
    if (!uri) return;
    const resp = await moveFile(uri);
    if (!resp.success) showErrorAlert(resp.message);
    else showSuccessAlert(resp.message);
  };

  const handleShareProposal = async () => {
    try {
      const uri = await generatePDF();
      if (uri) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: "Share Proposal",
            UTI: "com.adobe.pdf",
          });
          bottomSheetModalRef.current?.close();
        }
      }
    } catch (error) {
      console.error("Error sharing proposal:", error);
      Alert.alert("Error", "Failed to share proposal");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
            <View className="pb-4">
              <View className="bg-white mt-4">
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text className="text-base sm:text-lg font-ManropeBold text-dark w-full">
                      {jobName || "Unnamed Project"}
                    </Text>
                    <View>
                      <View className="flex-row items-center mt-1.5">
                        <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                          <View className="bg-blue w-1.5 h-1.5" />
                        </View>
                        <Text className="text-sm font-ManropeMedium text-blue ml-2">
                          {clientType?.replaceAll("_", " ") || "Construction"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text className="text-sm font-ManropeMedium text-dark-100 mt-3">
                  Project details for {jobName || "Unnamed Project"}:
                </Text>
                <View className="bg-light w-full h-px my-3" />
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Image
                      source={
                        clientName?.logo
                          ? { uri: getImageUrl(clientName.logo) }
                          : images.user
                      }
                      resizeMode="cover"
                      className="rounded-full"
                      style={{ width: vs(25), height: vs(25) }}
                    />
                    <Text className="text-sm text-dark font-ManropeMedium ml-1.5">
                      {clientName || "Unknown Client"}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <CalendarDays
                      size={16}
                      strokeWidth={1.5}
                      className="text-dark"
                    />
                    <Text className="text-sm text-dark-100 font-ManropeMedium ml-1">
                      {date ? formatDate(date?.toString()) : "No Date"}
                    </Text>
                  </View>
                </View>
                <View className="bg-light w-full h-px mt-3" />
                <View className="flex-row items-center justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Project Director
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    {projectDirector || "Not Specified"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Job Name
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    {jobName || "Not Specified"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Job Phone
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      jobPhone && Linking.openURL(`tel:${jobPhone}`)
                    }
                  >
                    <Text className="text-sm sm:text-base text-blue font-ManropeMedium flex-1 text-right pl-6">
                      {jobPhone || "Not Specified"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-start justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Address
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    {address || "Not Specified"}
                  </Text>
                </View>
                <View className="flex-row items-start justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    City
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    {city || "Not Specified"}
                  </Text>
                </View>
                <View className="flex-row items-start justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Zip
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    {zip || "Not Specified"}
                  </Text>
                </View>
                <View className="flex-row items-start justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Estimated Days
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    {estimatedDays || "Not Specified"}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>

        {/* Bottom Sheet */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backdropComponent={Backdrop}
          backgroundStyle={{
            borderRadius: 24,
          }}
        >
          <BottomSheetView>
            <View className="p-4 pt-2">
              {Platform.OS !== "ios" && (
                <TouchableOpacity
                  onPress={handleDownloadProposal}
                  className="flex-row items-center justify-between border border-light rounded-xl p-2.5"
                >
                  <View className="flex-row items-center">
                    <LinearGradient
                      colors={["#1B78B9", "#63348F"]}
                      className="rounded-full w-8 h-8"
                      start={[0, 0]}
                      end={[1, 1]}
                    >
                      <TouchableOpacity className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px">
                        <ArrowDownToLine size={16} color="#ffffff" />
                      </TouchableOpacity>
                    </LinearGradient>
                    <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                      Download
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#1C1C1C" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleShareProposal}
                className="flex-row items-center justify-between border border-light rounded-xl p-2.5 mt-3"
              >
                <View className="flex-row items-center">
                  <TouchableOpacity className="bg-dark rounded-full w-8 h-8 flex flex-row justify-center items-center">
                    <Share2 size={16} className="text-white" />
                  </TouchableOpacity>
                  <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                    Share
                  </Text>
                </View>
                <ChevronRight size={16} color="#1C1C1C" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleEditProposal}
                className="flex-row items-center justify-between border border-light rounded-xl p-2.5 mt-3"
              >
                <View className="flex-row items-center">
                  <LinearGradient
                    colors={["#1B78B9", "#63348F"]}
                    className="rounded-full w-8 h-8"
                    start={[0, 0]}
                    end={[1, 1]}
                  >
                    <TouchableOpacity className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px">
                      <Pencil size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </LinearGradient>
                  <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                    Edit Proposal
                  </Text>
                </View>
                <ChevronRight size={16} color="#1C1C1C" />
              </TouchableOpacity>
              {/* Delete Proposal Button */}
              <TouchableOpacity
                onPress={handleDeleteProposal}
                className="flex-row items-center justify-between border border-light rounded-xl p-2.5 mt-3"
              >
                <View className="flex-row items-center">
                  <LinearGradient
                    colors={["#B72D2D", "#F29D2E"]}
                    className="rounded-full w-8 h-8"
                    start={[0, 0]}
                    end={[1, 1]}
                  >
                    <TouchableOpacity className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px">
                      <Trash2 size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </LinearGradient>
                  <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                    Delete Proposal
                  </Text>
                </View>
                <ChevronRight size={16} color="#1C1C1C" />
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Proposal;
