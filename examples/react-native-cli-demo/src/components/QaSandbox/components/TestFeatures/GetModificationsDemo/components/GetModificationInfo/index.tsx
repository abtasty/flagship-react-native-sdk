import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import NativeTachyons, { styles as s } from 'react-native-style-tachyons';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from 'react-native-elements';
import { RootStackParamList } from '../../../stackContainer';
import { useFsModifications, useFlagship } from '@flagship.io/react-native-sdk';



interface Props {
  // Nothing
}

type ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GetModificationsDemo'
>;

interface Props {
  navigation: ScreenNavigationProp;
}




const GetModificationInfo: React.SFC<Props> = ({ navigation }) => {

const { getModificationInfo: fsGetInfo } = useFlagship();

  const [key, setKey] = useState("");
  // campaignId
  const [campaignId, SetCampaignId] = useState("-------------");
  const [variationGroupId, setVariationGroupId] = useState("-------------");
  const [variationId, setVariationId] = useState("-------------");


  return (<SafeAreaView>
    <View>
      <Text style={styles.Title} >Enter the key for modification</Text>
     
      <TextInput style={styles.input} value={key} onChangeText={(txt) => setKey(txt)} ></TextInput>

      <Text style={styles.label} >variationId is: <Text style={styles.labelBis}>{variationId}</Text></Text>

      <Text style={styles.label} >CampaignId is: <Text style={styles.labelBis}>{campaignId}</Text></Text>

      <Text style={styles.label} >VariationGroupId is:<Text  style={styles.labelBis}>{variationGroupId}</Text></Text>

     

      <Button style={styles.label} title="Get modification info" onPress={() => {
        console.log("-----------")

        console.log(key)
        fsGetInfo(key).then( infos => {
          /// set the varriation group id
          setVariationGroupId(infos.variationGroupId);
          /// set the campaig id 
          SetCampaignId(infos.campaignId)
          /// set the variation id
          setVariationId(infos.variationId);
          
        }).catch(error => {
          console.log(error);
        });
      }}></Button>

      <Button style={styles.label} title="Go back" onPress={() => {
        navigation.goBack();
      }}></Button>
    </View>
  </SafeAreaView>)
};




const styles = StyleSheet.create({

  input: {
    fontSize: 18, borderColor: 'black', borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop:5,
    marginBottom:10
  },

  label: {
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 5,
    fontStyle:"normal"
  }, 
  labelBis: {
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 5,
    fontStyle:"italic",
    fontWeight:'bold'
  }, 

  Title: {
    fontSize: 18,
    fontWeight:'bold',
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 20
  }
});

export default NativeTachyons.wrap(GetModificationInfo);




this.defaultProps = {
  initialeValue: {
    title: '',
    content: ''
  }
}