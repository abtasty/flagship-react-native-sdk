import AsyncStorage from '@react-native-community/async-storage';

export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error: storeData local storage failed with ' + error);
  }
};

export const loadData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error('Error: loadData local storage failed with ' + error);
  }
};

export const clearLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error: clear local storage failed with ' + error);
  }
};

export const getLocalStorageData = async () => {
  try {
    const data = await AsyncStorage.getAllKeys();
    return data;
  } catch (error) {
    console.error(
      'Error: getLocalStorageData local storage failed with ' + error,
    );
  }
};
