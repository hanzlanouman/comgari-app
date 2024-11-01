import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  className?: string;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  error?: string;
  errorStyle?: string;
  className?: string;
  ref?: any;
  generatePasswordIcon?: boolean;
  onGeneratePassword?: (password: string) => void;
}
