import React, { Component } from 'react';
import { View, TouchableOpacity, Text, TouchableHighlight, Image, ActivityIndicator } from 'react-native';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent
} from '@react-native-community/voice';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animating: false,
      otp: '',
      recognized: '',
      pitch: '',
      error: '',
      end: false,
      started: '',
      results: [],
      partialResults: [],
      otpMatched: false
    }
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }
  onStartButtonPress(e) {
    Voice.start('en-US');
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = (e) => {
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized = (e) => {
    console.log('onSpeechRecognized: ', e);
    this.setState({
      recognized: '√',
    });
  };

  onSpeechEnd = (e) => {
    console.log('onSpeechEnd: ', e);
    this.setState({
      // end: '√',
      // end: true,
      animating: true,
    });
  };

  onSpeechError = (e) => {
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = (e) => {
    console.log('onSpeechResults: ', e);
    let results = e.value
    for(let i=0; i<results.length; i++) {
      if(results[i].replace(/\s/g,'') == this.state.otp) {
        this.setState({
          otpMatched: true,
          results: e.value,
          end: true,
          animating: false,
        })
        return;
      }
    }
    this.setState({
      otpMatched: false,
      results: e.value,
      end: true,
      animating: false,
    })

  };

  onSpeechPartialResults = (e) => {
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechVolumeChanged = (e) => {
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });
  };

  _startRecognizing = async () => {
    this.setState({
      // otp: '',
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: false,
      otpMatched: false
    });

    try {
      await Voice.start('en-IN');
    } catch (e) {
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: false,
    });
  };

  onGenerateOtp = () => {
    let otp = Math.floor(100000 + Math.random() * 900000)
    this.setState({
      otp: otp
    })
  }

  onRestartClick = () => {
    this.setState({
      animating: false,
      otp: '',
      recognized: '',
      pitch: '',
      error: '',
      end: false,
      started: '',
      results: [],
      partialResults: [],
      otpMatched: false
    })
  } 


  render() {
    
    return (
      <View style={styles.container}>
        {this.state.otp.length == 0 ? 
        <View>
          <TouchableOpacity style={styles.otpBtn} 
            onPress={this.onGenerateOtp}
          >
            <Text style={{ fontSize: 20 }}>Generate OTP</Text>
          </TouchableOpacity>

        </View> :
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome to Voice OTP Verification</Text>
          <Text style={{ fontSize: 22, color: 'black'}}>{`OTP: ${this.state.otp}`}</Text>
          <TouchableOpacity 
          // style={styles.otpBtn} 
            onPress={this.onGenerateOtp}
          >
            <Text style={{ fontSize: 14, color: 'green' }}>Regenerate OTP</Text>
          </TouchableOpacity> 
          <Text style={styles.instructions}>
            Press the button and start speaking OTP.
        </Text>
        <TouchableHighlight onPress={this._startRecognizing}>
            <Image style={styles.button} source={require('./button.png')} />
        </TouchableHighlight>
        {this.state.end &&
        <View>
          {/* <Text style={styles.stat}>{`Started: ${this.state.started}`}</Text>
          <Text style={styles.stat}>{`Recognized: ${
            this.state.recognized
            }`}</Text>
          <Text style={styles.stat}>{`Pitch: ${this.state.pitch}`}</Text>
          <Text style={styles.stat}>{`Error: ${this.state.error}`}</Text>
          <Text style={styles.stat}>Results</Text>
          {this.state.results.map((result, index) => {
            return (
              <Text key={`result-${index}`} style={styles.stat}>
                {result}
              </Text>
            );
          })} */}
          <Text style={styles.stat}>Recognized OTP</Text>
          {this.state.results.map((result, index) => {
            return (
              <Text key={`partial-result-${index}`} style={styles.stat}>
                {result}
              </Text>
            );
          })}

          <Text style={this.state.otpMatched ? styles.matchText : styles.unmatchText}>{this.state.otpMatched ? 'OTP matched' : `OTP didn't match` }</Text>
          {/* <Text style={styles.stat}>{`End: ${this.state.end}`}</Text> */}
          
          {/* <TouchableHighlight onPress={this._stopRecognizing}>
            <Text style={styles.action}>Stop Recognizing</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._cancelRecognizing}>
            <Text style={styles.action}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._destroyRecognizer}>
            <Text style={styles.action}>Destroy</Text>
          </TouchableHighlight> */}
          </View>}
          <TouchableOpacity style={styles.restartBtn} 
            onPress={this.onRestartClick}
          >
            <Text style={{ fontSize: 20 }}>Restart</Text>
          </TouchableOpacity>
        </View>}
        {this.state.animating &&
        <ActivityIndicator
          animating={this.state.animating}
          color={'#053972'}
          size="large"
          style={[styles.activityIndicator]}
        />}
        
      </View>
    )
  }

}
const styles = {
  otpBtn: {
    // width: 250,
    // height: 50,
    paddingVertical: 16,
    paddingHorizontal: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey'
  },
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 10,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  matchText: {
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold'
  },
  unmatchText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold'
  },
  restartBtn: {
    // width: 250,
    // height: 50,
    marginTop: '10%',
    paddingVertical: 8,
    paddingHorizontal: '12%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue'
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF88'
},
};
export default App;
