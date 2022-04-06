import React, {
  useState,
  useEffect,
  Component,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Button,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  PanResponder,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import { firebase } from "../Firebase/firebase";
import 'firebase/storage';

const screen = Dimensions.get("screen");

// FIXME: ugly hard code needs to be replaced
// Data from aluts.js
const position = new Animated.ValueXY({
  x: 0.3016710642040457 * screen.width,
  y: ((3 * screen.height) / 4) * 0.02,
});

const Player = ({ navigation, route }) => {
  useEffect(() => {
    let playPart = route.params.data;
    // TODO : print for testing
    console.log("***********************************");
    console.log(screen);
    console.log(screen.width, screen.height);
    console.log(playPart);
    console.log(playPart.partVideo_url);
  });

  // const { screenWidth, screenHeight } = Dimensions.get("screen");

  const [partData, setPartData] = useState(route.params.data);
  const [pieceName, setPieceName] = useState(route.params.pieceName);
  const [nameList, setNameList] = useState([]);
  const video = React.useRef(null);
  const [videoStatus, setVideoStatus] = React.useState({});
  const [isAnimated, setIsAnimated] = useState(false);
  const [yCoord, setYCoord] = useState(0.2 * 0.08742304309586632);
  const posScale = 0.95;

  // From Zhiwei
  useEffect(() => {
    // TODO: make sure that all properties in fetched data can work fine with all the frontend tags
    const db = firebase.firestore()
    async function fetchInstrumentNames(db) {
      await db.collection('videos1').doc(pieceName)
            .collection(pieceName).get().then((snapshot) => {
              snapshot.docs.forEach(doc => {
                // const curInfo = doc.data()
                nameList.push(doc.id);
              })
            })
    }
    fetchInstrumentNames(db)
  }, []);

  // Animation Coords
  const Lag = [
    { start: 0, end: 1061, x: 0.3016710642040457, y: yCoord },
    {
      start: 27427,
      end: 28453,
      x: 0.09586631486367635,
      y: (0.08742304309586632 + 0.052594547053649965) * 0.75,
    },
    {
      start: 50193,
      end: 50707,
      x: 0.09410729991204925,
      y: (0.08742304309586632 + 0.18856640281442394 * 0.9) * 0.75,
    },
    {
      start: 68876,
      end: 69822,
      x: 0.0932277924362357,
      y: (0.08742304309586632 + 0.32242744063324535 * 0.9) * 0.75,
    },
    {
      start: 84821,
      end: 85328,
      x: 0.08970976253298153,
      y: (0.08742304309586632 + 0.4580474934036939 * 0.85) * 0.75,
    },
    {
      start: 102950,
      end: 103401,
      x: 0.09234828496042216,
      y: (0.08742304309586632 + 0.6028144239226032 * 0.85) * 0.75,
    },
    {
      start: 129593,
      end: 130504,
      x: 0.09058927000879508,
      y: (0.08742304309586632 + 0.7361477572559365 * 0.85) * 0.75,
    },
    {
      start: 162951,
      end: 163444,
      x: 0.08619173262972735,
      y: (0.08742304309586632 + 0.872999120492524 * 0.85) * 0.75,
    },
    {
      start: 185880,
      end: 186113,
      x: 0.08267370272647317,
      y: (0.08742304309586632 + 1.0107299912049252 * 0.84) * 0.75,
    },
    {
      start: 200236,
      end: 201260,
      x: 0.1090589270008795,
      y: (0.08742304309586632 + 1.1472295514511874 * 0.84) * 0.75,
    },
  ];

  // Move position
  const Mov = [
    { start: 1061, end: 27427, x: 0.8865435356200527, y: yCoord },
    {
      start: 28453,
      end: 50193,
      x: 0.8962181178540017,
      y: (0.08742304309586632 + 0.052594547053649965) * 0.75,
    },
    {
      start: 50707,
      end: 68876,
      x: 0.8944591029023746,
      y: (0.08742304309586632 + 0.18856640281442394 * 0.9) * 0.75,
    },
    {
      start: 69822,
      end: 84821,
      x: 0.8944591029023746,
      y: (0.08742304309586632 + 0.32242744063324535 * 0.9) * 0.75,
    },
    {
      start: 85328,
      end: 102950,
      x: 0.8944591029023746,
      y: (0.08742304309586632 + 0.4580474934036939 * 0.85) * 0.75,
    },
    {
      start: 103401,
      end: 129593,
      x: 0.8803869832893579,
      y: (0.08742304309586632 + 0.6028144239226032 * 0.85) * 0.75,
    },
    {
      start: 130504,
      end: 162951,
      x: 0.8768689533861038,
      y: (0.08742304309586632 + 0.7361477572559365 * 0.85) * 0.75,
    },
    {
      start: 163444,
      end: 185880,
      x: 0.8918205804749341,
      y: (0.08742304309586632 + 0.872999120492524 * 0.85) * 0.75,
    },
    {
      start: 186113,
      end: 200236,
      x: 0.8654353562005277,
      y: (0.08742304309586632 + 1.0107299912049252 * 0.84) * 0.75,
    },
    {
      start: 201260,
      end: 227155,
      x: 0.7854001759014951,
      y: (0.08742304309586632 + 1.1472295514511874 * 0.84) * 0.75,
    },
  ];

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  )[0];

  // TODO: Set speed factor only for testing purpose
  const speed = 5;

  let i = 0;
  const runAnimationWithLoop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.stagger((Lag[i].end - Lag[i].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[i].x * screen.width,
              y: Lag[i].y * ((3 * screen.height) / 4),
            },
            duration: 0,
            useNativeDriver: true,
          }),

          Animated.timing(position, {
            toValue: {
              x: Mov[i].x * screen.width * posScale,
              y: Mov[i].y * ((3 * screen.height) / 4),
            },
            duration: (Mov[i].end - Mov[i].start) / speed,
            useNativeDriver: true,
          }),
        ]),
      ]),
      {
        iterations: Mov.length,
      }
    ).start((o) => {
      if (o.finished) {
        runAnimationWithLoop();
      }
    });
  };

  const runAnimationWithoutLoop = () => {
    // TODO: Animation Sequence
    if (videoStatus.isPlaying) {
      Animated.sequence([
        // First Line
        Animated.stagger((Lag[0].end - Lag[0].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[0].x * screen.width,
              y: ((3 * screen.height) / 4) * Lag[0].y,
            },
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: Mov[0].x * screen.width,
              y: ((3 * screen.height) / 4) * Mov[0].y,
            },
            duration: (Mov[0].end - Mov[0].start) / speed,
            useNativeDriver: true,
          }),
        ]),
        // Second Line
        Animated.stagger((Lag[1].end - Lag[1].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[1].x * screen.width,
              y: ((3 * screen.height) / 4) * Lag[1].y,
            },
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: Mov[1].x * screen.width,
              y: ((3 * screen.height) / 4) * Mov[1].y,
            },
            duration: (Mov[1].end - Mov[1].start) / speed,
            useNativeDriver: true,
          }),
        ]),
        // Third Line
        Animated.stagger((Lag[2].end - Lag[2].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[2].x * screen.width,
              y: ((3 * screen.height) / 4) * Lag[2].y,
            },
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: Mov[2].x * screen.width,
              y: ((3 * screen.height) / 4) * Mov[2].y,
            },
            duration: (Mov[2].end - Mov[2].start) / speed,
            useNativeDriver: true,
          }),
        ]),
        // Fourth Line
        Animated.stagger((Lag[3].end - Lag[3].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[3].x * screen.width,
              y: ((3 * screen.height) / 4) * Lag[3].y,
            },
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: Mov[3].x * screen.width,
              y: ((3 * screen.height) / 4) * Mov[3].y,
            },
            duration: (Mov[3].end - Mov[3].start) / speed,
            useNativeDriver: true,
          }),
        ]),
        // Fifth Line
        Animated.stagger((Lag[4].end - Lag[4].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[4].x * screen.width,
              y: ((3 * screen.height) / 4) * Lag[4].y,
            },
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: Mov[4].x * screen.width,
              y: ((3 * screen.height) / 4) * Mov[4].y,
            },
            duration: (Mov[4].end - Mov[4].start) / speed,
            useNativeDriver: true,
          }),
        ]),
        // Sixth Line
        Animated.stagger((Lag[5].end - Lag[5].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[5].x * screen.width,
              y: ((3 * screen.height) / 4) * Lag[5].y,
            },
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: Mov[5].x * screen.width,
              y: ((3 * screen.height) / 4) * Mov[5].y,
            },
            duration: (Mov[5].end - Mov[5].start) / speed,
            useNativeDriver: true,
          }),
        ]),
        // 7th Line
        Animated.stagger((Lag[6].end - Lag[6].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[6].x * screen.width,
              y: ((3 * screen.height) / 4) * Lag[6].y,
            },
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: Mov[6].x * screen.width,
              y: ((3 * screen.height) / 4) * Mov[6].y,
            },
            duration: (Mov[6].end - Mov[6].start) / speed,
            useNativeDriver: true,
          }),
        ]),
        // 8th Line
        Animated.stagger((Lag[7].end - Lag[7].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[7].x * screen.width,
              y: ((3 * screen.height) / 4) * Lag[7].y,
            },
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: Mov[7].x * screen.width,
              y: ((3 * screen.height) / 4) * Mov[7].y,
            },
            duration: (Mov[7].end - Mov[7].start) / speed,
            useNativeDriver: true,
          }),
        ]),
        // 9th Line
        Animated.stagger((Lag[8].end - Lag[8].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[8].x * screen.width,
              y: ((3 * screen.height) / 4) * Lag[8].y,
            },
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: Mov[8].x * screen.width,
              y: ((3 * screen.height) / 4) * Mov[8].y,
            },
            duration: (Mov[8].end - Mov[8].start) / speed,
            useNativeDriver: true,
          }),
        ]),
        // 10th Line
        Animated.stagger((Lag[9].end - Lag[9].start) / speed, [
          Animated.timing(position, {
            toValue: {
              x: Lag[9].x * screen.width,
              y: ((3 * screen.height) / 4) * Lag[9].y,
            },
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(position, {
            toValue: {
              x: Mov[9].x * screen.width,
              y: ((3 * screen.height) / 4) * Mov[9].y,
            },
            duration: (Mov[9].end - Mov[9].start) / speed,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  };

  const moveBar = () => {
    // runAnimationWithLoop();
    runAnimationWithoutLoop();
    // Animated.timing(position, {
    //   toValue: {
    //     x: 0.8865435356200527 * screen.width,
    //     y: ((3 * screen.height) / 4) * 0.02,
    //   },
    //   // FIXME : Duration not correct just for testing
    //   duration: (27427 - 1061) / 5,
    //   useNativeDriver: true,
    // }).start(({ finished }) => {
    //   if (finished) {
    //     // Do something?
    //   }
    // });
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  

  return (
    <View style={styles.main}>
      <View style={{flexDirection: 'row', overflow: 'auto'}}>
        {nameList.map((name, index) => (
          // <TouchableOpacity
          //   style={{marginLeft: 5}}
          //   onPress={() =>
          //     navigation.navigate("Player", {data: item, pieceName: name})
          //   }
          // >
          // </TouchableOpacity>
          <Text style={{marginRight: 5}}>{name}-{index},,, </Text>
        ))}
      </View>
      <View
        style={{
          height: screen.height / 4,
          width: "100%",
          backgroundColor: "#a7a79d",
        }}
      >
        <Video
          ref={video}
          style={styles.video}
          // BUG: same problem with source
          //source={require("../assets/videos/Altus.mp4")}
          //source={{uri: 'https://www.youtube.com/watch?v=RYNVZqpytHM'}}
          // source={{uri: 'https://firebasestorage.googleapis.com/v0/b/lookhearrefactor.appspot.com/o/Cantus.mp4?alt=media&token=d9f3ba13-66fe-43ad-9be2-35249b4dbf56'}}
          source={{ uri: partData.url }}
          useNativeControls
          resizeMode="contain"
          isLooping={false}
          onPlaybackStatusUpdate={(videoStatus) =>
            setVideoStatus(() => videoStatus)
          }
        />
        {/* <WebView
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction
          source={{ uri: 'https://www.youtube.com/watch?v=RYNVZqpytHM' }} 
        /> */}
        {/* <YoutubePlayer
          style={styles.video}
          //height={300}
          play={playing}
          videoId={"RYNVZqpytHM"}
          onChangeState={onStateChange}
        /> */}

        {/* // <Video
          //   ref={video}
          //   style={styles.video}
          //   source={{uri: partData.url}}
          //   useNativeControls
          //   resizeMode="contain"
          //   isLooping
          //   onPlaybackStatusUpdate={(videoStatus) =>
          //     setVideoStatus(() => videoStatus)
          //   }
          // /> */}
        <View style={styles.buttons}>
          {/* <Button

            title={videoStatus.isPlaying ? "Pause" : "Play"}
            onPress={() =>
              videoStatus.isPlaying
                ? video.current.pauseAsync()
                : video.current.playAsync()
            }/> */}
        </View>
      </View>
      {/* <Text style={styles.partName}>{partData.partName}</Text> */}
      <TouchableOpacity onPress={moveBar}>
        <Text>Click me to move the bar</Text>
      </TouchableOpacity>

      <View
        style={{
          height: (3 * screen.height) / 4,
          width: "100%",
        }}
      >
        <ImageBackground
          //source={require("../assets/images/altus.jpg")}
          source={{ uri: partData.sheet }}
          resizeMode="center"
          style={styles.note}
        >
          <Animated.View style={[styles.bar, styles.movebar]}></Animated.View>
          {/* <Animated.View
            style={[
              {
                transform: [{ translateX: pan.x }, { translateY: pan.y }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.bar}></View>
          </Animated.View> */}
        </ImageBackground>
        {/* <Image
          style={styles.note}
          source={require("../assets/images/altus.jpg")}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#e8e8db",
  },
  partName: {
    fontSize: 18,
    fontWeight: "bold",
    // marginTop: 10,
    color: "#58555A",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  buttons: {
    // marginTop: 40,
  },
  note: {
    width: "100%",
    height: "95%",
  },
  bar: {
    height: 55,
    width: 10,
    backgroundColor: "rgba(20,0,250,0.25)",
  },
  movebar: {
    transform: [{ translateX: position.x }, { translateY: position.y }],
  },
});

export default Player;
