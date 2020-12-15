import FlagshipProvider from '@flagship.io/react-native-sdk';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import NativeTachyons, {styles as s} from 'react-native-style-tachyons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../redux/rootReducer';
import Home from '../Home';
import QaSbStackContainer from '../QaSandbox/stackContainer';
import {updateFsVisitor} from '../../redux/stuff/fsVisitor/actions';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import LocalNotification from 'react-native-local-notification';
import {useEffect} from 'react';
import {useState} from 'react';

// REACT NAVIGATION: begin
const Tab = createBottomTabNavigator();

var mainStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

const FlagshipWrapper = () => {
  const FsLoadingProvider = () => (
    <View style={[s.flex, s.jcc, s.asc, {height: '100%'}]}>
      <Text style={[s.f4]}>Loading...</Text>
    </View>
  );
  const sdkSettings = useSelector((state: RootState) => state.sdkSettings);
  const safeModeRedux = useSelector((state: RootState) => state.demo.safeMode);
  const dispatch = useDispatch();
  const context: {[key: string]: number | boolean | string} = {};

  sdkSettings.visitorContext.forEach(({key, value}) => {
    context[key] = value;
  });
  const inputRef = React.useRef('localNotification');

  useEffect(() => {
    inputRef?.current?.showNotification &&
      inputRef?.current?.showNotification({
        title: 'Settings updated',
        text: '',
        onPress: () => console.log('onPress'),
        onHide: () => console.log('onHide'),
      });
  }, [sdkSettings]);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, position: 'relative'}}>
        <NavigationContainer>
          <LocalNotification ref={inputRef} duration={3000} />

          <FlagshipProvider
            envId={sdkSettings.envId || ''}
            apiKey={sdkSettings.apiKey}
            onUpdate={({fsModifications, ...other}, fsVisitor) => {
              dispatch(updateFsVisitor(fsVisitor));
              if (safeModeRedux.triggerTest) {
                throw new Error('Crash test react native');
              } else {
                // inputRef.current.showNotification({
                //   title: '[dev] onUpdate triggered',
                //   text: '',
                //   onPress: () => console.log('onPress'),
                //   onHide: () => console.log('onHide'),
                // });
              }
            }}
            fetchNow={sdkSettings.fetchNow}
            pollingInterval={sdkSettings.pollingInterval}
            decisionMode={sdkSettings.decisionMode}
            enableConsoleLogs={sdkSettings.enableConsoleLogs}
            enableErrorLayout={sdkSettings.enableErrorLayout}
            nodeEnv={sdkSettings.nodeEnv}
            flagshipApi={sdkSettings.flagshipApi}
            timeout={sdkSettings.timeout}
            loadingComponent={<FsLoadingProvider />}
            onInitStart={() => {
              console.log('init start');
            }}
            onInitDone={() => {
              console.log('init done');
            }}
            onBucketingSuccess={(data) => {
              inputRef.current.showNotification({
                title: 'Bucketing polling success',
                text: 'Status code="' + data.status + '"',
                onPress: () => console.log('onPress'),
                onHide: () => console.log('onHide'),
              });
            }}
            onBucketingFail={(error) => {
              inputRef.current.showNotification({
                title: 'Bucketing polling fail',
                text: 'with error: ' + error.stack,
              });
            }}
            visitorData={{
              id: sdkSettings.visitorId || '',
              context,
              isAuthenticated: sdkSettings.isAuthenticated,
            }}>
            <Tab.Navigator>
              <Tab.Screen
                name="Home"
                component={Home}
                options={{
                  tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons
                      name="home"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="QA Sandbox"
                component={QaSbStackContainer}
                options={{
                  tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons
                      name="beaker-outline"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          </FlagshipProvider>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default FlagshipWrapper;
