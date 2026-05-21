import React, { useState } from "react";
import { TextInput, TouchableOpacity, View, Image } from "react-native";
import { FormikProps } from "formik";
import { Upload } from "lucide-react-native";
import { vs } from "react-native-size-matters";
import {
  InputField,
  MutlitSelectWithDefault,
  PhoneField,
} from "@/common/components";
import { OptionType, ClientType, ClientStatus } from "@/common/types";
import { Action } from "@/common/enum";
import DropdownSelect from "@/common/components/Select";
import { getImageUrl } from "@/constants";
import UserAvatar from "@/common/components/UserAvatar";
import { useUpload } from "@/hooks/use-upload";
import { pickImage, showErrorAlert } from "@/utils";

interface MemberAction {
  staff_id: number;
  action: Action;
}

interface ClientFormValues {
  name: string;
  email: string;
  phone: string;
  description: string;
  logo: string;
  type: ClientType;
  status: ClientStatus;
  member_ids: number[];
  address: string;
  client_Staff: MemberAction[];
}

interface AddClientFormProps {
  formik: FormikProps<ClientFormValues>;
  typeOptions: OptionType[];
  statusOptions: OptionType[];
  memberOptions: OptionType[];
  isEditing?: boolean;
  ClientStatus: typeof ClientStatus;
}

export default function AddClientForm({
  formik,
  typeOptions,
  statusOptions,
  memberOptions,
  isEditing,
  ClientStatus,
}: AddClientFormProps) {
  const { uploadAsync } = useUpload();
  const [selectedMembers, setSelectedMembers] = useState<number[]>(
    formik.values.member_ids || []
  );
  const [memberActions, setMemberActions] = useState<MemberAction[]>(
    formik.values.client_Staff || []
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    formik.values.logo ? getImageUrl(formik.values.logo) : null
  );

  const handleMemberSelection = (field: string, value: string[]) => {
    const newSelected = value.map(Number);

    const addedMembers = newSelected.filter(
      (id) => !selectedMembers.includes(id)
    );
    const removedMembers = selectedMembers.filter(
      (id) => !newSelected.includes(id)
    );
    const newMemberActions = [...memberActions];

    addedMembers.forEach((id) => {
      const existingIndex = newMemberActions.findIndex(
        (item) => item.staff_id === id
      );
      if (existingIndex !== -1) {
        newMemberActions[existingIndex] = { staff_id: id, action: Action.ADD };
      } else {
        newMemberActions.push({ staff_id: id, action: Action.ADD });
      }
    });

    removedMembers.forEach((id) => {
      const existingIndex = newMemberActions.findIndex(
        (item) => item.staff_id === id
      );
      if (existingIndex !== -1) {
        newMemberActions[existingIndex] = {
          staff_id: id,
          action: Action.REMOVE,
        };
      } else {
        newMemberActions.push({ staff_id: id, action: Action.REMOVE });
      }
    });

    setMemberActions(newMemberActions);
    setSelectedMembers(newSelected);
    formik.setFieldValue(field, newSelected);
    formik.setFieldValue("client_Staff", newMemberActions);
  };

  const handleImageUpload = async () => {
    try {
      const rep = await pickImage(false, {
        quality: 1,
        aspect: [1, 1],
        allowsEditing: true,
      });
      if (!rep.isSuccess) {
        showErrorAlert(rep.error);
        return;
      }
      const res = await uploadAsync(rep.result);
      if (res.isSuccess && res.result) {
        formik.setFieldValue("logo", res.result);
        setImagePreview(res.result);
      }
    } catch (error: any) {
      showErrorAlert(error?.message);
    }
  };

  const memberTitles = memberOptions
    ?.map((item: any) =>
      formik.values.member_ids?.includes(item.key) ? item.value : null
    )
    .filter((item: any) => item !== null)
    .flat();

  return (
    <View>
      <View
        className="mt-2.5 relative mx-auto"
        style={{ width: vs(80), height: vs(80) }}
      >
        {imagePreview ? (
          <Image
            source={{ uri: imagePreview }}
            resizeMode="cover"
            className="rounded-full mx-auto"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <UserAvatar name={formik.values.name || 'Client'} size={vs(80)} />
        )}
        <TouchableOpacity
          onPress={handleImageUpload}
          className="bg-blue rounded-full flex-row items-center justify-center absolute bottom-0 right-0 pb-px"
          style={{ width: 28, height: 28 }}
        >
          <Upload size={13} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.name}
          onChangeText={formik.handleChange("name")}
          placeholder="Full Name"
          error={
            typeof formik.errors.name === "string"
              ? formik.errors.name
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.email}
          onChangeText={formik.handleChange("email")}
          placeholder="Email"
          keyboardType="email-address"
          error={
            typeof formik.errors.email === "string"
              ? formik.errors.email
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <PhoneField
          value={formik.values.phone}
          onChangeText={formik.handleChange("phone")}
          // placeholder="Phone"
          error={
            typeof formik.errors.phone === "string"
              ? formik.errors.phone
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.address}
          onChangeText={formik.handleChange("address")}
          placeholder="Address"
          error={
            typeof formik.errors.address === "string"
              ? formik.errors.address
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <MutlitSelectWithDefault
          placeholder="Assign Member"
          options={memberOptions || []}
          save="key"
          onSelect={(val) => handleMemberSelection("member_ids", val)}
          value={formik.values.member_ids.map((id) => String(id))}
          valueTitles={memberTitles}
          error={
            typeof formik.errors.member_ids === "string"
              ? formik.errors.member_ids
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          search={true}
          placeholder="Type"
          data={typeOptions}
          selectedValue={String(formik.values.type || "")}
          setFieldValue={(field, value) => {
            formik.setFieldValue(field, value);
          }}
          error={
            typeof formik.errors.type === "string"
              ? formik.errors.type
              : undefined
          }
          fieldName="type"
        />
      </View>
      {isEditing && (
        <View className="mt-3">
          <DropdownSelect
            placeholder="Status"
            data={statusOptions}
            selectedValue={String(formik.values.status || "")}
            setFieldValue={(field, value) => {
              formik.setFieldValue(field, value);
            }}
            error={
              typeof formik.errors.status === "string"
                ? formik.errors.status
                : undefined
            }
            fieldName="status"
          />
        </View>
      )}

      <View className="mt-3">
        <TextInput
          className="border border-light rounded-xl p-4 font-ManropeMedium text-[15] text-left"
          style={{ height: 112, color: "#1C1C1C" }}
          value={formik.values.description}
          editable
          multiline
          placeholderTextColor="#1C1C1C"
          placeholder="Description"
          onChangeText={formik.handleChange("description")}
        />
      </View>
    </View>
  );
}
