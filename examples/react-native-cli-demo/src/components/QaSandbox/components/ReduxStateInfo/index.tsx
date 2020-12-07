import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import NativeTachyons, {styles as s} from 'react-native-style-tachyons';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ScrollView} from 'react-native-gesture-handler';
import JSONTree from 'react-native-json-tree';
import {RootStackParamList} from '../../stackContainer';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from 'react-native-elements';
import {themeJsonTree} from '../../../../assets/commonStyles';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../../../redux/rootReducer';
import {resetDemo} from '../../../../redux/stuff/demo/actions';
import {resetSettings} from '../../../../redux/stuff/sdkSettings/actions';

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
  },
});

interface Props {
  // Nothing
}

type ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CurrentSettings'
>;

interface Props {
  navigation: ScreenNavigationProp;
}

const ReduxStateInfo: React.SFC<Props> = ({navigation}) => {
  const sdkSettings = useSelector((state: RootState) => state.sdkSettings);
  const demo = useSelector((state: RootState) => state.demo);
  const fsVisitor = useSelector((state: RootState) => state.fsVisitor);
  const dispatch = useDispatch();
  return (
    <SafeAreaView>
      <ScrollView style={[s.ph3, styles.body]}>
        <Text style={[s.mt4, s.f3]}>state.sdkSettings:</Text>
        <View>
          <JSONTree data={sdkSettings} theme={themeJsonTree} />
        </View>
        <Text style={[s.mt4, s.f3]}>state.demo:</Text>
        <View>
          <JSONTree data={demo} theme={themeJsonTree} />
        </View>
        <Text style={[s.mt4, s.f3]}>state.fsVisitor:</Text>
        <Text style={[s.f7, s.b]}>NOTE:</Text>

        <Text style={[s.f7]}>
          This reducer only shows the data returned by internal React SDK. All
          changes on the visitor are done in the "sdkSettings" reducer.
        </Text>
        <View>
          <JSONTree data={fsVisitor} theme={themeJsonTree} />
        </View>
        <Button
          title="Reset"
          containerStyle={[s.mv2]}
          buttonStyle={[{backgroundColor: 'red'}]}
          onPress={() => {
            dispatch(resetDemo());
            dispatch(resetSettings());
          }}
        />
        <Button
          title="Go back"
          containerStyle={[s.mv2]}
          onPress={() => {
            navigation.navigate('QaSandbox');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NativeTachyons.wrap(ReduxStateInfo);
