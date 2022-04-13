import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  Button,
  Modal,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { firebase } from "../Firebase/firebase";
import { onSnapshot, collection, query, where} from "firebase/firestore";
import { WebView } from 'react-native-webview';
import storage from '@react-native-firebase/storage';
import 'firebase/storage';
import { doc, setDoc } from "firebase/firestore";

const Home = ({ navigation, route }) => {
  const [searchPart, setSearchPart] = useState("");
  const [feed, setFeed] = useState([]);
  const [temp, setTemp] = useState([]);
  // const [pieceName, setPieceName] = route.params

  const [searchContent, setSearchContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [sheetUrl, setSheetUrl] = useState(null);
  const [newName, setNewName] = useState('');
  const [id, setId] = useState(3);
  const [thumbnailDone, setThumbnailDone] = useState(false);
  const [videoDone, setVideoDone] = useState(false);
  const [sheetDone, setSheetDone] = useState(false);
  const [allData, setAllData] = useState([])

  const [modalVisible, setModalVisible] = useState(false);
  const [nameOfDeleteInstr, setNameOfDeletInstr] = useState("");
  const [nameList, setNameList] = useState([]);

  // Set manual feeds
  // FIXME: feeds manually created (link with DB)
  // Update has already linked to database, dummy data has already been stored in firebase, and the function works properly
  useEffect(() => {
    // TODO: make sure that all properties in fetched data can work fine with all the frontend tags
    const db = firebase.firestore()
    var curInfoList = []
    var instrNameList = []
    async function fetchVideo(db) {
      await db.collection('videos1').doc(route.params.pieceName)
              .collection(route.params.pieceName).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                  const curInfo = doc.data()
                  curInfoList.push(curInfo)
                  instrNameList.push(doc.id)
                })
              })
      console.log(curInfoList)
      console.log(route.params.pieceName)
      setTemp(curInfoList)
      setAllData(curInfoList)
      setNameList(instrNameList)
    }
    fetchVideo(db)
  }, []);

  const selectThumbnailImage = async (e) => {
    console.log("selectThumbnailImage")
    const file = e.target.files[0]
    var storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(route.params.pieceName.concat(file.name))
    await fileRef.put(file)
    const ThumbnailUrl = await fileRef.getDownloadURL()
    setThumbnailUrl(ThumbnailUrl)
    setThumbnailDone(true);
    console.log('thumbnailImage url: ', ThumbnailUrl)
  }

  const selectVideo = async (e) => {
    console.log("selectVideo")
    const file = e.target.files[0]
    var storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(route.params.pieceName.concat(file.name))
    await fileRef.put(file)
    const VideoUrl = await fileRef.getDownloadURL()
    setVideoUrl(VideoUrl)
    setVideoDone(true);
    console.log('video url: ', VideoUrl)
  }

  const selectSheetImage = async (e) => {
    console.log("selectSheetImage")
    const file = e.target.files[0]
    var storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(route.params.pieceName.concat(file.name))
    await fileRef.put(file)
    const SheetUrl = await fileRef.getDownloadURL()
    setSheetUrl(SheetUrl)
    setSheetDone(true);
    console.log('sheetImage url: ', SheetUrl)
  }

  const createNew = () => {
    const db = firebase.firestore()
    // await setDoc(doc(db, "videos", newName), {
    //   partName: newName,
    //   partThumbnail: thumbnailUrl,
    //   sheet: sheetUrl,
    //   url: videoUrl,
    // })
    console.log("ready to create")
    const newNameInStorage = newName.concat(route.params.pieceName)
    db.collection("videos1").doc(route.params.pieceName).collection(route.params.pieceName).doc(newNameInStorage).set({
      partId: id,
      partName: newName,
      partThumbnail: thumbnailUrl,
      sheet: sheetUrl,
      url: videoUrl,
    }).then(() => {
      console.log("a new doc has been created!")
      window.location.reload(false);
    })
    .catch((error) => {
      console.log("Error writing new doc: ", error);
    });
    const newId = id + 1;
    setId(newId);
    //window.location.reload();
  }

  const pressToSearch = () => {
    if (searchContent == '') {
      setTemp(allData)
    } else {
      var searchRes = []
      for (let i = 0; i < allData.length; i++) {
        if (allData[i].partName.toLowerCase().includes(searchContent.toLocaleLowerCase())) {
          searchRes.push(allData[i])
        }
      }
      // console.log(searchRes)
      setTemp(searchRes)
      console.log(temp)
    }
  }

  const deleteInstrument = (instrName) => {
    const db = firebase.firestore()
    db.collection("videos1").doc(route.params.pieceName).collection(route.params.pieceName).doc(instrName).delete().then(() => {
      setModalVisible(!modalVisible)
      console.log("Document successfully deleted!");
      window.location.reload(false);
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  return (
    <View style={styles.mainView}>
      {/* // FIXME: piece name hard code */}
      <Text style={styles.header}>{route.params.pieceName}</Text>

      <View style={{flexDirection: 'row', width: '90%', marginBottom: 25, marginLeft: 50}}>
      <TextInput
        style={styles.textInput}
        placeholder={"Search your part"}
        onChangeText={text => setSearchContent(text)}
        // value={searchPart}
      />
      <TouchableOpacity style={styles.searchButton} title="search" onPress={pressToSearch}>search</TouchableOpacity>
      </View>

      <View style={styles.partsContent}>
        {temp.length < 1 ? (
          <ActivityIndicator size={"large"} color={"black"} />
        ) : (
          <FlatList
            //data={feed}
            data = {temp}
            keyExtractor={(item, index) => {
              return item.partId.toString();
            }}
            renderItem={({ item, index }) => (
              <View style={styles.partConent}>
                <View style={styles.partNameOuter}>
                  <View style={styles.imageView}>
                    <TouchableOpacity
                      style={styles.thumbnailButton}
                      onPress={() =>
                        navigation.navigate("Player", {data: item, pieceName: route.params.pieceName})
                      }
                    >
                      <Image
                        style={styles.partThumbnail}
                        // BUG: 1.why require does not work for each item? 2.How to link with google drive(JSON)
                        source={{ uri: item.partThumbnail }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.partName}>{item.partName}</Text>
                  </View>
                  <View style={{height: '50%', marginTop: 30}}>
                    <View style={styles.centeredView}>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                          Alert.alert("Modal has been closed.");
                          setModalVisible(!modalVisible);
                        }}
                      >
                        <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                            <Text style={styles.modalText}>Are you sure to delete this instrument?</Text>
                            <View style={{flexDirection: 'row'}}>
                              <View style={{marginRight: 10}}>
                                <Pressable
                                  style={[styles.button, styles.buttonClose]}
                                  onPress={() => deleteInstrument(nameOfDeleteInstr)}
                                >
                                  <Text style={styles.textStyle}>Yes</Text>
                                </Pressable>
                              </View>
                              <View style={{marginLeft: 10}}>
                                <Pressable
                                  style={[styles.button, styles.buttonClose]}
                                  onPress={() => setModalVisible(!modalVisible)}
                                >
                                  <Text style={styles.textStyle}>No</Text>
                                </Pressable>
                              </View>
                            </View>
                            
                          </View>
                        </View>
                      </Modal>
                      <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => {setModalVisible(true); setNameOfDeletInstr(nameList[index])}}
                      >
                        <Text style={styles.textStyle}>delete this instrument: {nameList[index]}</Text>
                      </Pressable>
                    </View>
                  </View>


                  <Icon style={styles.optionsIcon} name="options-vertical" />
                </View>
              </View>
            )}
          />
        )}
      </View>
      <View style={{alignItems: 'flex-start'}}>
        <View style={styles.upload}>
          <Text style={{fontSize: 20, marginRight: 10}}>Upload thumbnail image:</Text>
          <input type='file' onChange={selectThumbnailImage}/>
          {thumbnailDone ? <Text style={{fontSize: 15,marginLeft: 10}}>Upload Successful!</Text> : null}
        </View>
        <View style={styles.upload}>
          <Text style={{fontSize: 20, marginRight: 10}}>Upload video:</Text>
          <input type='file' onChange={selectVideo}/>
          {videoDone ? <Text style={{fontSize: 15,marginLeft: 10}}>Upload Successful!</Text> : null}
        </View>
        <View style={styles.upload}>
          <Text style={{fontSize: 20, marginRight: 10}}>Upload sheet image:</Text>
          <input type='file' onChange={selectSheetImage}/>
          {sheetDone ? <Text style={{fontSize: 15,marginLeft: 10}}>Upload Successful!</Text> : null}
        </View>
        <View style={styles.upload}>
          <Text style={{fontSize: 20}}>Give it a name: </Text>
          <TextInput style={{borderWidth: 1.0}} placeholder='Name it' onChangeText={text => setNewName(text)}></TextInput>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.upload1}>
            {(thumbnailUrl != null && videoUrl != null && sheetUrl != null && newName != '') ?
              <Button color='green' title='create new set' onPress={createNew}/>
            : null}
          </View>
          <View style={{marginTop: 4}}>
            {(thumbnailUrl != null && videoUrl != null && sheetUrl != null && newName != '') ?
              <Text style={{fontSize: 17}}>Please refresh this page after clicking this</Text>
            : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    marginTop: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#e8e8db",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    marginRight: 180,
    marginTop: 50,
  },
  textInput: {
    marginBottom: 25,
    width: "85%",
    borderWidth: 3,
    borderColor: "#4D4D3D",
    borderRadius: 30,
    height: 40,
    fontWeight: "bold",
    fontSize: 18,
    paddingLeft: 10,
  },
  partsContent: {
    width: "100%",
  },
  partConent: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  partNameOuter: {
    width: "80%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  partThumbnail: {
    backgroundColor: "rgba(0,0,0,0.06)",
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  imageView: {
    flexDirection: "row",
  },
  partName: {
    fontSize: 21,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingVertical: 32,
    color: "#58555A",
    alignItems: "center",
  },
  optionsIcon: {
    paddingVertical: 36,
    color: "#58555A",
    alignItems: "center",
  },
  thumbnailButton: {
    backgroundColor: "#e8e8db",
    width: 80,
    height: 80,
  },
  upload: {
    flexDirection: 'row',
    marginBottom: 15
  },
  upload1: {
    flexDirection: 'column',
    marginBottom: 10,
    minWidth: 150,
    marginRight: 10
  },
  searchButton: {
    marginLeft: 10,
    marginTop: 5,
    color: 'black',
    borderWidth: 3,
    height: '50%',
    width: 85,
    overflow: 'hidden',
    borderRadius: 10,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Home;
