import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text } from "react-native";
import { PhoneInput, PhoneInputRef, CountryCode } from "rn-phone-input-field";
// Leverage library constants to derive initial calling code for default country
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - importing internal module to fetch calling codes
import constants from "rn-phone-input-field/dist/main/constants/constants";

type PhoneFieldProps = {
  value?: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string | undefined;
  defaultCountry?: CountryCode;
  containerClassName?: string;
  onBlur?: () => void;
};

export const PhoneField = ({
  value,
  onChangeText,
  placeholder,
  error,
  defaultCountry = "US",
  containerClassName = "",
  onBlur,
}: PhoneFieldProps) => {
  const phoneInputRef = useRef<PhoneInputRef>(null);
  const [callingCode, setCallingCode] = useState<string>("");
  const [nationalValue, setNationalValue] = useState<string>("");

  useEffect(() => {
    if (typeof value !== "string" || !value) return;

    if (value.startsWith("+")) {
      const numeric = value.replace(/[^\d]/g, "");

      // Find the best matching country from constants (longest matching calling code)
      let bestMatch: { countryCode: CountryCode; callingCode: string; length: number } | null = null;
      for (const countryKey in constants) {
        const cc = String(constants[countryKey].callingCode).replace(/[^\d]/g, "");
        if (numeric.startsWith(cc) && cc.length > (bestMatch?.length || 0)) {
          bestMatch = {
            countryCode: countryKey as CountryCode,
            callingCode: cc,
            length: cc.length
          };
        }
      }

      if (bestMatch) {
        setCallingCode(bestMatch.callingCode);
        const national = numeric.slice(bestMatch.length);
        setNationalValue(national);
        phoneInputRef.current?.defaultCountry(bestMatch.countryCode);
        phoneInputRef.current?.defaultValue(national);
      } else {
        // Fallback: if no match found, use heuristic or treat as national
        const heuristicNational = numeric.replace(/^\d{1,4}/, (cc) => {
          setCallingCode(cc);
          return "";
        });
        setNationalValue(heuristicNational);
        phoneInputRef.current?.defaultValue(heuristicNational);
      }
    } else {
      setNationalValue(value);
      phoneInputRef.current?.defaultValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (defaultCountry && !value) {
      phoneInputRef.current?.defaultCountry(defaultCountry);
      try {
        const cc =
          constants?.[defaultCountry as keyof typeof constants]?.callingCode;
        if (cc) setCallingCode(String(cc).replace(/[^\d]/g, ""));
      } catch { }
    }
  }, [defaultCountry, value]);

  const emitE164 = useMemo(() => {
    return (local: string) => {
      const numericLocal = local.replace(/[^\d]/g, "");
      const full = callingCode
        ? `+${callingCode}${numericLocal}`
        : numericLocal;
      onChangeText(full);
    };
  }, [callingCode, onChangeText]);

  return (
    <View className="" style={{ width: "100%" }}>
      <View
        className={`bg-white rounded-xl border border-light ${containerClassName}`}
      >
        <PhoneInput
          ref={phoneInputRef}
          defaultCountry={defaultCountry}
          defaultValue={nationalValue || ""}
          placeholder={placeholder ?? ""}
          placeholderColor="#9AA3AF"
          onChangeText={(text: string) => {
            setNationalValue(text);
            emitE164(text);
          }}
          onSelectCountryCode={({
            callingCode: cc,
          }: {
            callingCode: string;
          }) => {
            const newCc = String(cc).replace(/[^\d]/g, "");
            setCallingCode(newCc);
            const numericLocal = nationalValue.replace(/[^\d]/g, "");
            onChangeText(newCc ? `+${newCc}${numericLocal}` : numericLocal);
          }}
          containerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 0,
            backgroundColor: "transparent",
          }}
          textInputStyle={{
            fontSize: 16,
            color: "#111827",
            flex: 1,
            width: undefined,
            paddingVertical: 0,
          }}
          codeTextStyle={{ fontSize: 16, color: "#111827", fontWeight: "600" }}
          iconContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 4,
          }}
          searchInputProps={{ placeholder: "Search country" }}
          inputProps={{ keyboardType: "phone-pad", onBlur }}
        />
      </View>
      {error ? <Text className="text-red mt-1">{error}</Text> : null}
    </View>
  );
};

export default PhoneField;
