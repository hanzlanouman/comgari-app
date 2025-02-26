import React, { useEffect } from 'react';

import { Platform } from 'react-native';

import MultipleSelectList from "@/common/components/multi-select-list/core";

import { ErrorText } from '@/common/components/InputField';

import { SelectOption } from '@/types/type';

import { ChevronDown, Search, X } from 'lucide-react-native';


type MutlitSelectProps = {
    options: SelectOption[];
    onSelect: (value: string[]) => void;
    save?: 'key' | 'value';
    search?: boolean
    placeholder?: string;
    error?: string | undefined | null;
    mt?: number;
    label?: string;
    /* 
    * selected items value property
    */
    value?: string[];
    valueTitles?: string[];
}

export function MutlitSelectWithDefault({ label, onSelect, options, placeholder, error, save = 'value', search = false, value, valueTitles }: MutlitSelectProps) {
    const [selected, setSelected] = React.useState<string[]>(value || []);

    useEffect(() => {
        if (value) {
            setSelected(value);
        }
    }, [value]);

    return (
        <>
            <MultipleSelectList
                setSelected={setSelected}
                onSelect={() => onSelect(selected)}
                data={options}
                defaultOptions={valueTitles ? valueTitles : value ? value : []}
                save={save}
                fontFamily="Manrope-Medium"
                placeholder={placeholder}
                search={search}
                label={label}
                arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
                searchicon={<Search size={16} color="#1C1C1C" />}
                closeicon={<X size={16} color="#1C1C1C" />}
                boxStyles={{
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: error ? "red" : "#EDEDED",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingTop: Platform.OS === "ios" ? 15 : 13,
                    paddingBottom: Platform.OS === "ios" ? 16 : 16,
                    alignItems: "center",
                }}
                inputStyles={{ color: "#1C1C1C", fontSize: 15 }}
                dropdownStyles={{
                    borderWidth: 1,
                    borderColor: "#EDEDED",
                    borderRadius: 12,
                    overflow: "scroll",
                }}
                badgeStyles={{
                    backgroundColor: "#1B78B9",
                    paddingHorizontal: 12,
                    borderWidth: 0,
                }}
            />
            <ErrorText error={error} />
        </>
    );
}