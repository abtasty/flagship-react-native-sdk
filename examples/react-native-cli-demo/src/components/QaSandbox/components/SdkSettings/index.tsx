import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Switch, Text, View} from 'react-native';
import {Button, CheckBox, Input, Slider} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import NativeTachyons, {styles as s} from 'react-native-style-tachyons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useDispatch, useSelector} from 'react-redux';

import {storeData} from '../../../../../src/lib/localStorage';
import commonStyles, {appColors} from '../../../../assets/commonStyles';
import {RootState} from '../../../../redux/rootReducer';
import {apiV1, apiV2, apiStagingV2} from '../../../../settings';
import {RootStackParamList} from '../..//stackContainer';
import {updateConfig} from './../../../../redux//stuff/sdkSettings/actions';
import VisitorSettings from './components/VisitorSettings';

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
  },
  labelColor: {
    color: appColors.grey,
  },
});

type ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SdkSettings'
>;

interface Props {
  navigation: ScreenNavigationProp;
}

export const commonInputStyle = {
  inputContainerStyle: [s.mb3],
  labelStyle: [s.mt3, styles.labelColor],
  inputStyle: [s.red],
  leftIconContainerStyle: [s.mr3],
  placeholderTextColor: appColors.grey,
};

export const commonIconStyle = {
  size: 16,
  color: appColors.dark,
};

const SdkSettings: React.SFC<Props> = ({navigation}) => {
  //   const mySomethingState = useSelector(state => state.something);
  const dispatch = useDispatch();

  const stateEnvId = useSelector((state: RootState) => state.sdkSettings.envId);
  const stateVisId = useSelector(
    (state: RootState) => state.sdkSettings.visitorId,
  );
  const stateConfig = useSelector((state: RootState) => state.sdkSettings);
  const [envId, setEnvId] = React.useState<string | undefined>(undefined);
  const [visId, setVisitorId] = React.useState<string | undefined>(undefined);
  const [config, updateLocalConfig] = React.useState(stateConfig);

  useEffect(() => {
    setEnvId(stateEnvId);
    setVisitorId(stateVisId);
  }, [stateEnvId, stateVisId]);

  return (
    <SafeAreaView>
      <ScrollView style={[s.ph3, styles.body]}>
        <Input
          {...commonInputStyle}
          containerStyle={{marginTop: 10}}
          label="Env ID"
          autoCorrect={false}
          autoCapitalize={'none'}
          autoCompleteType={'off'}
          placeholder="Your environment ID"
          value={envId}
          onChangeText={(txt) => setEnvId(txt)}
          leftIcon={<Icon name="envira" {...commonIconStyle} />}
        />

        <VisitorSettings
          visitorId={visId}
          isAuthValue={config.isAuthenticated}
          onChangeAuthenticated={(bool) =>
            updateLocalConfig((c) => ({...c, isAuthenticated: bool}))
          }
          onChangeVisId={(txt) => setVisitorId(txt)}
          navigation={navigation}
        />

        {/* Config Settings */}
        <View
          style={[s.flex, s.mv2, s.ph2, s.jcsb, s.aic, {flexDirection: 'row'}]}>
          <Text style={[s.f5]}>fetchNow:</Text>
          <Switch
            thumbColor={config.fetchNow ? 'white' : appColors.red}
            ios_backgroundColor="white"
            onValueChange={() => {
              updateLocalConfig((c) => ({...c, fetchNow: !config.fetchNow}));
            }}
            value={!!config.fetchNow}
          />
        </View>
        <View
          style={[s.flex, s.mv2, s.ph2, s.jcsb, s.aic, {flexDirection: 'row'}]}>
          <Text style={[s.f5]}>activateNow:</Text>
          <Switch
            thumbColor={config.activateNow ? 'white' : appColors.red}
            ios_backgroundColor="white"
            onValueChange={() => {
              updateLocalConfig((c) => ({
                ...c,
                activateNow: !config.activateNow,
              }));
            }}
            value={!!config.activateNow}
          />
        </View>
        <View
          style={[s.flex, s.mv2, s.ph2, s.jcsb, s.aic, {flexDirection: 'row'}]}>
          <Text style={[s.f5]}>enableConsoleLogs:</Text>
          <Switch
            thumbColor={config.enableConsoleLogs ? 'white' : appColors.red}
            ios_backgroundColor="white"
            onValueChange={() => {
              updateLocalConfig((c) => ({
                ...c,
                enableConsoleLogs: !config.enableConsoleLogs,
              }));
            }}
            value={!!config.enableConsoleLogs}
          />
        </View>
        <View
          style={[s.flex, s.mv2, s.ph2, s.jcsb, s.aic, {flexDirection: 'row'}]}>
          <Text style={[s.f5]}>enableErrorLayout:</Text>
          <Switch
            thumbColor={config.enableErrorLayout ? 'white' : appColors.red}
            ios_backgroundColor="white"
            onValueChange={() => {
              updateLocalConfig((c) => ({
                ...c,
                enableErrorLayout: !config.enableErrorLayout,
              }));
            }}
            value={!!config.enableErrorLayout}
          />
        </View>
        <View style={[s.mv2, s.ph2]}>
          <Text style={[s.f5, s.mb2]}>nodeEnv:</Text>
          <CheckBox
            title={'production'}
            checked={config.nodeEnv === 'production'}
            onPress={() =>
              updateLocalConfig((c) => ({
                ...c,
                nodeEnv: 'production',
              }))
            }
          />
          <CheckBox
            title={'development'}
            checked={config.nodeEnv === 'development'}
            onPress={() =>
              updateLocalConfig((c) => ({
                ...c,
                nodeEnv: 'development',
              }))
            }
          />
        </View>
        <View style={[s.mv2, s.ph2]}>
          <Text style={[s.f5, s.mb2]}>decisionMode:</Text>
          <CheckBox
            title={'API'}
            checked={config.decisionMode === 'API'}
            onPress={() =>
              updateLocalConfig((c) => ({
                ...c,
                decisionMode: 'API',
              }))
            }
          />
          <CheckBox
            title={'Bucketing'}
            checked={config.decisionMode === 'Bucketing'}
            onPress={() =>
              updateLocalConfig((c) => ({
                ...c,
                decisionMode: 'Bucketing',
              }))
            }
          />
        </View>
        {config.decisionMode === 'Bucketing' && (
          <View style={[s.mv2, s.ph2]}>
            <Text style={[s.f5, s.mb2]}>pollingInterval:</Text>
            <Slider
              value={config.pollingInterval}
              maximumValue={60 * 5}
              minimumValue={5}
              step={1}
              onValueChange={(value) =>
                updateLocalConfig((c) => ({
                  ...c,
                  // pollingInterval: Math.ceil((100 * value) / 10),
                  pollingInterval: value,
                }))
              }
            />
            <Text>{config.pollingInterval} second(s)</Text>
          </View>
        )}
        <View style={[s.mv2, s.ph2]}>
          <Text style={[s.f5, s.mb2]}>timeout:</Text>
          <Slider
            value={config.timeout}
            maximumValue={2}
            minimumValue={0.01}
            step={0.02}
            onValueChange={(value) =>
              updateLocalConfig((c) => ({
                ...c,
                timeout: value,
              }))
            }
          />
          <Text>{config.timeout} second(s)</Text>
        </View>
        <View style={[s.mv2, s.ph2]}>
          <Text style={[s.f5, s.mb2]}>flagshipApi:</Text>
          <CheckBox
            title={apiV1}
            checked={config.flagshipApi === apiV1}
            onPress={() =>
              updateLocalConfig((c) => ({
                ...c,
                flagshipApi: apiV1,
              }))
            }
          />
          <CheckBox
            title={apiV2}
            checked={config.flagshipApi === apiV2}
            onPress={() =>
              updateLocalConfig((c) => ({
                ...c,
                flagshipApi: apiV2,
              }))
            }
          />
          <CheckBox
            title={apiStagingV2}
            checked={config.flagshipApi === apiStagingV2}
            onPress={() =>
              updateLocalConfig((c) => ({
                ...c,
                flagshipApi: apiStagingV2,
              }))
            }
          />
          <CheckBox
            title={'custom'}
            checked={![apiV1, apiV2, apiStagingV2].includes(config.flagshipApi)}
            onPress={() =>
              updateLocalConfig((c) => ({
                ...c,
                flagshipApi: null,
              }))
            }
          />
          {![apiV1, apiV2, apiStagingV2].includes(config.flagshipApi) && (
            <Input
              {...commonInputStyle}
              autoCorrect={false}
              autoCapitalize={'none'}
              autoCompleteType={'off'}
              value={(config.flagshipApi || '').toString()}
              placeholder="null"
              onChangeText={(txt) =>
                updateLocalConfig((c) => ({
                  ...c,
                  flagshipApi: txt === '' ? null : txt,
                }))
              }
            />
          )}
        </View>

        <View style={[s.mt3]}>
          <Text style={[s.f5, s.mb2]}>apiKey:</Text>
          <Input
            {...commonInputStyle}
            autoCorrect={false}
            autoCapitalize={'none'}
            autoCompleteType={'off'}
            value={(config.apiKey || '').toString()}
            placeholder="null"
            onChangeText={(txt) =>
              updateLocalConfig((c) => ({
                ...c,
                apiKey: txt === '' ? null : txt,
              }))
            }
          />
        </View>
        <Button
          title="Save settings"
          containerStyle={[s.mt3, s.mb4]}
          onPress={async () => {
            try {
              await storeData('envId', "envId || ''");
              await storeData('visId', "visId || ''");
              await storeData('visContext', 'visitorContext.toString()');
            } catch (error) {
              console.error('Save settings failed with: ' + error.stack);
            }
            dispatch(
              updateConfig({
                ...config,
                envId,
                visitorId: visId,
                timeout: config.timeout,
              }),
            );
            navigation.navigate('QaSandbox');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NativeTachyons.wrap(SdkSettings);
