import {
  StyleProp,
  TextInputProps,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  className?: string;
  IconLeft?: string;
  IconRight?: string;
  iconSize?: number;
  /** Merged onto the gradient wrapper (e.g. compact height for inline actions). */
  gradientStyle?: StyleProp<ViewStyle>;
}

declare interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  error?: string | false;
  errorStyle?: string;
  className?: string;
  ref?: any;
  generatePasswordIcon?: boolean;
  disabled?: boolean
  onGeneratePassword?: (password: string) => void;
}

declare interface SelectOption {
  key: string;
  value: string;
  disabled?: boolean;
}