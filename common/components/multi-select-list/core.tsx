/* eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable @typescript-eslint/no-unused-vars*/
/* eslint-disable @typescript-eslint/no-empty-function*/
/* eslint-disable @typescript-eslint/no-empty-function*/
/* eslint-disable max-len*/

import { images } from '@/constants';

import React, { useEffect } from 'react';

import {
    Image,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    TextInput,
    Pressable,
    Keyboard
} from 'react-native';

import { MultipleSelectListProps } from 'react-native-dropdown-select-list';

type L1Keys = { key?: any; value?: any; disabled?: boolean | undefined }

const MultipleSelectList: React.FC<MultipleSelectListProps & {
    defaultOptions?: string[]
}> = ({
    fontFamily,
    setSelected,
    placeholder,
    boxStyles,
    inputStyles,
    dropdownStyles,
    dropdownItemStyles,
    dropdownTextStyles,
    maxHeight,
    data,
    searchicon = false,
    arrowicon = false,
    closeicon = false,
    search = true,
    searchPlaceholder = "search",
    onSelect = () => { },
    label,
    notFoundText = "No data found",
    disabledItemStyles,
    disabledTextStyles,
    disabledCheckBoxStyles,
    labelStyles,
    badgeStyles,
    badgeTextStyles,
    checkBoxStyles,
    save = 'key',
    dropdownShown = false,
    defaultOptions = [],
}) => {

        const [_firstRender, _setFirstRender] = React.useState<boolean>(true);
        const [_defaultSet, _setDefaultSet] = React.useState<boolean>(false);
        const [dropdown, setDropdown] = React.useState<boolean>(dropdownShown);
        const [selectedval, setSelectedVal] = React.useState<any>([]);
        const [height, setHeight] = React.useState<number>(350);
        const animatedvalue = React.useRef(new Animated.Value(0)).current;
        const [filtereddata, setFilteredData] = React.useState(data);

        useEffect(() => {
            if (defaultOptions && defaultOptions.length > 0 && !_defaultSet) {
                setSelectedVal(defaultOptions);
                _setDefaultSet(true);
            }
        }, [defaultOptions]);


        const slidedown = () => {
            setDropdown(true);

            Animated.timing(animatedvalue, {
                toValue: height,
                duration: 500,
                useNativeDriver: false,

            }).start();
        };
        const slideup = () => {

            Animated.timing(animatedvalue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,

            }).start(() => setDropdown(false));
        };

        React.useEffect(() => {
            if (maxHeight)
                setHeight(maxHeight);
        }, [maxHeight]);


        React.useEffect(() => {
            setFilteredData(data);
        }, [data]);


        React.useEffect(() => {
            if (_firstRender) {
                _setFirstRender(false);

                return;
            }
            onSelect();

        }, [selectedval]);

        React.useEffect(() => {
            if (!_firstRender) {
                if (dropdownShown)
                    slidedown();
                else
                    slideup();

            }

        }, [dropdownShown]);


        return (
            <View>
                {
                    (dropdown && search)
                        ?
                        <View style={[styles.wrapper, boxStyles]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                {
                                    (!searchicon)
                                        ?
                                        <Image
                                            source={images.search}
                                            resizeMode='contain'
                                            style={{ width: 20, height: 20, marginRight: 7 }}
                                        />
                                        :
                                        searchicon
                                }

                                <TextInput
                                    placeholder={searchPlaceholder}
                                    onChangeText={(val) => {
                                        const result = data.filter((item: L1Keys) => {
                                            val.toLowerCase();
                                            const row = item.value.toLowerCase();

                                            return row.search(val.toLowerCase()) > -1;
                                        });
                                        setFilteredData(result);
                                    }}
                                    style={[{ padding: 0, height: 20, flex: 1, fontFamily }, inputStyles]}
                                />
                                <TouchableOpacity onPress={() => {
                                    slideup();
                                    // setTimeout(() => setFilteredData(data), 800)
                                }} >
                                    {
                                        (!closeicon)
                                            ?
                                            <Image
                                                source={images.close}
                                                resizeMode='contain'
                                                style={{ width: 17, height: 17 }}
                                            />
                                            :
                                            closeicon
                                    }
                                </TouchableOpacity>


                            </View>

                        </View>
                        :

                        (selectedval?.length > 0)

                            ?
                            <TouchableOpacity style={[styles.wrapper, boxStyles]} onPress={() => { if (!dropdown) { Keyboard.dismiss(); slidedown(); } else { slideup(); } }} >
                                <View>
                                    <Text style={[{ fontWeight: '600', fontFamily }, labelStyles]}>{label}</Text>
                                    <View style={{ flexDirection: 'row', marginBottom: 8, flexWrap: 'wrap' }}>
                                        {
                                            selectedval?.map((item, index) => {
                                                return (
                                                    <View key={index} style={[{ backgroundColor: 'gray', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 50, marginRight: 10, marginTop: 10 }, badgeStyles]}>
                                                        <Text style={[{ color: 'white', fontSize: 12, fontFamily }, badgeTextStyles]}>{item}</Text>
                                                    </View>
                                                );
                                            })
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={[styles.wrapper, boxStyles]} onPress={() => { if (!dropdown) { Keyboard.dismiss(); slidedown(); } else { slideup(); } }}>
                                <Text style={[{ fontFamily }, inputStyles]}>{(selectedval == "") ? (placeholder) ? placeholder : 'Select option' : selectedval}</Text>
                                {
                                    (!arrowicon)
                                        ?
                                        <Image
                                            source={images.chevron}
                                            resizeMode='contain'
                                            style={{ width: 20, height: 20 }}
                                        />
                                        :
                                        arrowicon
                                }

                            </TouchableOpacity>
                }

                {
                    (dropdown)
                        ?
                        <Animated.View style={[{ maxHeight: animatedvalue }, styles.dropdown, dropdownStyles]}>
                            <View style={[{ maxHeight: height }]}>
                                <ScrollView contentContainerStyle={{ paddingVertical: 10 }} nestedScrollEnabled={true}>

                                    {
                                        (filtereddata.length >= 1)
                                            ?
                                            filtereddata.map((item: L1Keys, index: number) => {
                                                const key = item.key ?? item.value ?? item;
                                                const value = item.value ?? item;
                                                const disabled = item.disabled ?? false;
                                                if (disabled) {
                                                    return (
                                                        <TouchableOpacity style={[styles.disabledoption, disabledItemStyles]} key={index}>
                                                            <View style={[{ width: 15, height: 15, marginRight: 10, borderRadius: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#c4c5c6' }, disabledCheckBoxStyles]}>
                                                                {
                                                                    (selectedval?.includes(value))
                                                                        ?
                                                                        <Image
                                                                            key={index}
                                                                            source={images.check}
                                                                            resizeMode='contain'
                                                                            style={{ width: 8, height: 8, paddingLeft: 7 }}
                                                                        />
                                                                        :
                                                                        null
                                                                }
                                                            </View>
                                                            <Text style={[{ fontFamily, color: '#c4c5c6' }, disabledTextStyles]}>{value}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                } else {
                                                    return (
                                                        <TouchableOpacity style={[styles.option, dropdownItemStyles]} key={index} onPress={() => {
                                                            const existing = selectedval?.indexOf(value);
                                                            if (existing != -1 && existing != undefined) {

                                                                const sv = [...selectedval];
                                                                sv.splice(existing, 1);
                                                                setSelectedVal(sv);
                                                                setSelected((val: any) => {
                                                                    const temp = [...val];
                                                                    temp.splice(existing, 1);

                                                                    return temp;
                                                                });
                                                            } else {
                                                                if (save === 'value') {
                                                                    setSelected((val: any) => {
                                                                        const temp = [...new Set([...val, value])];

                                                                        return temp;
                                                                    });
                                                                } else {
                                                                    setSelected((val: any) => {
                                                                        const temp = [...new Set([...val, key])];

                                                                        return temp;
                                                                    });
                                                                }

                                                                setSelectedVal((val: any) => {
                                                                    const temp = [...new Set([...val, value])];

                                                                    return temp;
                                                                });
                                                            }
                                                        }}>
                                                            <View style={[{ width: 15, height: 15, borderWidth: 1, marginRight: 10, borderColor: 'gray', borderRadius: 3, justifyContent: 'center', alignItems: 'center' }, checkBoxStyles]}>
                                                                {
                                                                    (selectedval?.includes(value))
                                                                        ?
                                                                        <Image
                                                                            key={index}
                                                                            source={images.check}
                                                                            resizeMode='contain'
                                                                            style={{ width: 8, height: 8, paddingLeft: 7 }}
                                                                        />
                                                                        :
                                                                        null

                                                                }
                                                            </View>
                                                            <Text style={[{ fontFamily }, dropdownTextStyles]}>{value}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                }

                                            })
                                            :
                                            <TouchableOpacity style={[styles.option, dropdownItemStyles]} onPress={() => {
                                                setSelected(undefined);
                                                setSelectedVal("");
                                                slideup();
                                                setTimeout(() => setFilteredData(data), 800);
                                            }}>
                                                <Text style={dropdownTextStyles}>{notFoundText}</Text>
                                            </TouchableOpacity>
                                    }



                                </ScrollView>

                                {
                                    (selectedval?.length > 0)
                                        ?
                                        <Pressable>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20 }}>
                                                <Text style={{ marginRight: 20, fontWeight: '600', fontFamily }}>Selected</Text>
                                                <View style={{ height: 1, flex: 1, backgroundColor: 'gray' }} />
                                            </View>
                                            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, flexWrap: 'wrap' }}>

                                                {
                                                    selectedval?.map((item, index) => {
                                                        return (
                                                            <View key={index} style={[{ backgroundColor: 'gray', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 50, marginRight: 10, marginTop: 10 }, badgeStyles]}>
                                                                <Text style={[{ color: 'white', fontSize: 12, fontFamily }, badgeTextStyles]}>{item}</Text>
                                                            </View>
                                                        );
                                                    })
                                                }

                                            </View>
                                        </Pressable>
                                        :
                                        null
                                }
                            </View>
                        </Animated.View>
                        :
                        null
                }
            </View>
        );
    };

export default MultipleSelectList;

const styles = StyleSheet.create({
    wrapper: { borderWidth: 1, borderRadius: 10, borderColor: 'gray', paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    dropdown: { borderWidth: 1, borderRadius: 10, borderColor: 'gray', overflow: 'hidden' },
    option: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' },
    disabledoption: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'whitesmoke' }
});
