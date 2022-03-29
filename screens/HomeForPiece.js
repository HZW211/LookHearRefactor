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
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { firebase } from "../Firebase/firebase";
import { onSnapshot, collection, query, where} from "firebase/firestore";
import { WebView } from 'react-native-webview';
import storage from '@react-native-firebase/storage';
import 'firebase/storage';
import { doc, setDoc } from "firebase/firestore";

const Home = ({ navigation }) => {
  const [searchPart, setSearchPart] = useState("");
  const [feed, setFeed] = useState([]);
  const [temp, setTemp] = useState([]);

  const [searchContent, setSearchContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [sheetUrl, setSheetUrl] = useState(null);
  const [newName, setNewName] = useState('');
  const [id, setId] = useState(3);
  const [thumbnailDone, setThumbnailDone] = useState(false);
  const [videoDone, setVideoDone] = useState(false);
  const [sheetDone, setSheetDone] = useState(false);

  const [beforeSearch, setBeforeSearch] = useState([])
  const [afterSearch, setAfterSearch] = useState([])
  const [allData, setAllData] = useState([])

  const [placeholderList,setPlaceholderList] = useState(["zirlerMotet","OrtoMotet","OtherMotet"])
  const [pieceNames, setpieceNames] = useState([])
  const [newPieceName, setNewPieceName] = useState([])

  // Set manual feeds
  // FIXME: feeds manually created (link with DB)
  // Update has already linked to database, dummy data has already been stored in firebase, and the function works properly
  useEffect(() => {
    // TODO: make sure that all properties in fetched data can work fine with all the frontend tags
    const db = firebase.firestore()
    var curInfoList = []
    async function fetchVideo(db) {
      await db.collection('videos1').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          //need to retrieve every property of each doc, and make them as a whole object, so that we can make a list of object and set it as feed
          // const curInfo = doc.data()
          // curInfoList.push(doc.data())
          pieceNames.push(doc.id)
        })
      })
      console.log(pieceNames)
      setTemp(curInfoList)
      // setAllData(curInfoList)
      console.log("complete")
    }
    fetchVideo(db)
  }, []);

  // useEffect(() => {
  //   setId(JSON.parse(window.sessionStorage.getItem("id")));
  // }, []);

  // useEffect(() => {
  //   window.sessionStorage.setItem("count", id);
  // }, [id]);

  //add some comments
  //this is a test for cs103a quiz3

  const selectThumbnailImage = async (e) => {
    console.log("selectThumbnailImage")
    const file = e.target.files[0]
    var storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name)
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
    const fileRef = storageRef.child(file.name)
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
    const fileRef = storageRef.child(file.name)
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
    db.collection("videos").doc(newName).set({
      partId: id,
      partName: newName,
      partThumbnail: thumbnailUrl,
      sheet: sheetUrl,
      url: videoUrl,
    }).then(() => {
      console.log("a new doc has been created!")
    })
    .catch((error) => {
      console.log("Error writing new doc: ", error);
    });
    const newId = id + 1;
    setId(newId);
    //window.location.reload();
  }

  const deletePiece = (pieceName) => {
    const db = firebase.firestore()
    db.collection("videos1").doc(pieceName).delete().then(() => {
      console.log("Document successfully deleted!");
      window.location.reload(false);
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  const createNewPiece = () => {
    const db = firebase.firestore()
    db.collection("videos1").doc(newPieceName).set({
      name: "field is uesless here",
    })
    .then(() => {
      console.log("Document successfully written!");
      window.location.reload(false);
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  }
  // const pressToSearch = () => {
  //   if (searchContent == '') {
  //     setTemp(allData)
  //   } else {
  //     var searchRes = []
  //     for (let i = 0; i < allData.length; i++) {
  //       if (allData[i].partName.toLowerCase().includes(searchContent.toLocaleLowerCase())) {
  //         searchRes.push(allData[i])
  //       }
  //     }
  //     // console.log(searchRes)
  //     setTemp(searchRes)
  //     console.log(temp)
  //   }
  // }

  return (
    <View style={styles.mainView}>
      {/* // FIXME: piece name hard code */}
      <Text style={styles.header}>Home Navigation</Text>

      <View style={{flexDirection: 'row', width: '90%', marginBottom: 25, marginLeft: 50}}>
        <TextInput
        style={styles.textInput}
        placeholder={"Search your part"}
        onChangeText={text => setSearchContent(text)}
        // value={searchPart}
      />
        {/* <TouchableOpacity style={styles.searchButton} title="search" onPress={pressToSearch}>search</TouchableOpacity> */}
      </View>

      <View style={styles.partsContent}>
        {pieceNames.length < 1 ? (
          <ActivityIndicator size={"large"} color={"black"} />
        ) : (
          <FlatList
            //data={feed}
            data = {pieceNames}
            // keyExtractor={(item, index) => {
            //   return item.toString();
            // }}
            renderItem={({ item, index }) => (
              <View style={styles.partConent}>
                <View style={styles.partNameOuter}>
                  <View style={styles.imageView}>
                    <TouchableOpacity
                      style={styles.thumbnailButton}
                      onPress={() =>
                        navigation.navigate("HomeForInstrument", { pieceName: item })
                      }
                    >
                      <Image
                        style={styles.partThumbnail}
                        // BUG: 1.why require does not work for each item? 2.How to link with google drive(JSON)
                        source={{ uri: item.partThumbnail }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.partName}>{item}</Text>
                  </View>
                  <View style={{height: '50%', marginTop: 30}}>
                    <TouchableOpacity style={styles.button} onPress={() => deletePiece(item)}><Text>delete this piece: {item}(DONT click it now!)</Text></TouchableOpacity>
                  </View>
                  
                  <Icon style={styles.optionsIcon} name="options-vertical" />
                </View>
              </View>
            )}
          />
        )}
      </View>

      <View>
        <TextInput style={styles.createButton} onChangeText={setNewPieceName} placeholder="Name the new piece"></TextInput>
        <View style={{marginTop: 2}}>
            {(newPieceName != '') ?
              <Button title="create a new piece" onPress={createNewPiece}></Button>
            : null}
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
    overflow: "auto"
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
    marginBottom: 20
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
  createButton: {
    marginBottom: 5,
    marginTop: 5,
    color: 'black',
    borderWidth: 3,
    overflow: 'hidden',
    borderRadius: 10,
    textAlign: 'center',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
});

export default Home;
