const Alexa = require('ask-sdk-core');
// const Alexa = require('ask-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const mqtt = require('mqtt');
const fs = require('fs');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let topic = "e831cd2181f4/command";

// const LaunchRequestHandler = {
//     canHandle(handlerInput) {
//         return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
//     },
//     handle(handlerInput) {
//         const speechText = 'Welcome to your Alexa skill1234!';

//         return handlerInput.responseBuilder
//             .speak(speechText)
//             .reprompt(speechText)
//             .getResponse();
//     },
// };

// const skillBuilder = Alexa.SkillBuilders.custom()
//     .addRequestHandlers(
//         LaunchRequestHandler
//         // Add other request handlers here
//     )
//     .create();


//     app.get('/', async (req, res) => {
//         res.json("response");
//     });

// app.post('/alexa', async (req, res) => {
//     // console.log('Received request:', JSON.stringify(req.body, null, 2));
//     try {
//         const response = await skillBuilder.invoke(req.body);
//         res.json(response);
//     } catch (error) {
//         console.error('Error handling the request:', error);
//         res.status(500).send('Error handling the request');
//     }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
















// const decimal = 500;
// const littleEndianBuffer = decimalToLittleEndian(decimal);




// client = connect();


const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
      const speechText = 'Welcome to smart home. Ask about the window!';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('Welcome to smart home. Ask about the window!', speechText)
        .getResponse();
    }
  };


  

  const AskWindowIntentHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskWindowIntents';
    },
    handle(handlerInput) {
      console.log("handlerInput: ",handlerInput);
      let speechText = 'window is started to working';

      const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      const userQuery = handlerInput.requestEnvelope.request.intent.slots.window.value;
      const question = handlerInput.requestEnvelope.request.intent.slots.query.value;

      if(question.startsWith("move")){

        //let payload = [0x0d ,0x0f, 0x00, 0x30, 0x05, 0x96, 0x73, 0x00, 0x20, 0x01, 0x64, 0x07, 0x64]
        const extractedNumbers = extractNumbersFromSentence(question);
       if(extractedNumbers.length === 0){
        speechText = "please provide any prcentage"
       }else{
        let percentageVlaue = (parseInt(extractedNumbers[0])*1000)/100;
        const littleEndianBuffer = decimalToLittleEndian(percentageVlaue);
        console.log(littleEndianBuffer);
        let payload = `000f cf00 0073 9605 2001 ${littleEndianBuffer} 0732`;

        // client.publish('e831cd2181f4/command', Buffer.from(payload, 'hex'));
        console.log("payload "+Buffer.from(payload, 'hex'));
        speechText = "window is ready to move";
       }
      
      }else if(question.startsWith("open")){

        let arr = `000f cf00 0073 9605 2001 e803 0732`;

        

      //  client.publish('e831cd2181f4/command', Buffer.from(arr, 'hex'));

        speechText = "window is ready to open";
      }else if(question.startsWith("close")){
        let payload ='000f cf00 0073 9605 2001 0000 0732';
        // client.publish('e831cd2181f4/command', Buffer.from(arr, 'hex'));

        speechText = "window is ready to close";
      }else{
        speechText = "please tell me the proper command";
      }
     
  
      console.log(`Intent received: ${intentName}`);
      console.log(`User query: ${userQuery}`);
      console.log(`Slots: ${JSON.stringify(slots)}`);
      console.log(`question: ${JSON.stringify(question)}`);
  

      return handlerInput.responseBuilder
        .speak(speechText)
        // .withShouldEndSession(false)
        // .reprompt("ok")
        .withSimpleCard(speechText)
        .getResponse();
    }
  };




  const AskWeatherIntentHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskWeatherIntents';
    },
    handle(handlerInput) {
      console.log("handlerInput: ",handlerInput);
      const speechText = 'The weather today is sunny.';

      const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      const userQuery = handlerInput.requestEnvelope.request.intent.slots.InfoType.value;
      const fullQuestion = handlerInput.requestEnvelope.request.intent.slots.FullQuestion.value;


      console.log(`Full question: ${fullQuestion}`);
     
  
      console.log(`Intent received: ${intentName}`);
      console.log(`User query: ${userQuery}`);
      console.log(`Slots: ${JSON.stringify(slots)}`);
  

      return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(false)
        .withSimpleCard('The weather today is sunny.', speechText)
        .getResponse();
    }
  };
  const HelpIntentHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      const speechText = 'You can ask me the weather!';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('You can ask me the weather!', speechText)
        .getResponse();
    }
  };
  const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
          || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      const speechText = 'Goodbye!';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('Goodbye!', speechText)
        .withShouldEndSession(true)
        .getResponse();
    }
  };
  const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      // Any clean-up logic goes here.
      return handlerInput.responseBuilder.getResponse();
    }
  };

  const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
  
      return handlerInput.responseBuilder
        .speak('Sorry, I don\'t understand your command. Please say it again.')
        .reprompt('Sorry, I don\'t understand your command. Please say it again.')
        .getResponse();
    }
  };

//   let skill;

// exports.handler = async function (event, context) {
//   console.log(`REQUEST++++${JSON.stringify(event)}`);
//   if (!skill) {
//     skill = Alexa.SkillBuilders.custom()
//       .addRequestHandlers(
//         LaunchRequestHandler,
//         AskWeatherIntentHandler,
//         HelpIntentHandler,
//         CancelAndStopIntentHandler,
//         SessionEndedRequestHandler,
//       )
//       .addErrorHandlers(ErrorHandler)
//       .create();
//   }

//   const response = await skill.invoke(event, context);
//   console.log(`RESPONSE++++${JSON.stringify(response)}`);

//   return response;
// };

skill = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    AskWindowIntentHandler,
    // AskWeatherIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
    )
  .addErrorHandlers(ErrorHandler)
  .create();


// const skillBuilder = Alexa.SkillBuilders.custom()
//   .addRequestHandlers(
//     {
//       canHandle(handlerInput) {
//         return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
//       },
//       handle(handlerInput) {
//         const speechText = 'Welcome to your Alexa skill!';
//         return handlerInput.responseBuilder
//           .speak(speechText)
//           .getResponse();
//       },
//     }
//     // Add more handlers here
//   );

// const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);

app.get('/get', (req,res) => {
    res.send("getting working!!!")
})


app.post('/alexa', async (req, res) => {
        console.log('Received request:', JSON.stringify(req.body, null, 2));
        try {
            const response = await skill.invoke(req.body);
            res.json(response);
        } catch (error) {
            console.error('Error handling the request:', error);
            res.status(500).send('Error handling the request');
        }
    });

app.post('/', adapter.getRequestHandlers());

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

function connect() {
  // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
  let encodedString = fs.readFileSync('./ca.pem');

  // let decodedString = Buffer.from(encodedString, 'base64').toString("binary");

  
  // let decodedString = atob(encodedString);

  this.mqttClient = mqtt.connect("mqtts://ec2-3-226-44-11.compute-1.amazonaws.com:8883", { username: "celllabs", password: "celllabs",  ca: encodedString },
  );
  // this.mqttClient = mqtt.connect("mqtt://krishna@localhost:1883");
  

  // Mqtt error calback
  this.mqttClient.on('error', (err) => {
    console.log(err);
    this.mqttClient.end();
  });

  // Connection callback
  this.mqttClient.on('connect', () => {
    console.log(`mqtt client connected`);
  });

  // mqtt subscriptions
  this.mqttClient.subscribe('e831cd2181f4/command', {qos: 0});

  // When a message arrives, console.log it
  this.mqttClient.on('message', function (topic, message) {
    console.log(message.toString());
  });

  this.mqttClient.on('close', () => {
    console.log(`mqtt client disconnected`);
  });
  
  return this.mqttClient;
}

function decimalToLittleEndian(decimalNumber) {
  const buffer = Buffer.alloc(4);
  buffer.writeInt32LE(decimalNumber);
  return buffer.toString('hex', 0, 2);
}
function extractNumbersFromSentence(sentence) {
  const numbers = sentence.match(/\d+/g);
  return numbers ? numbers : [];
}

 // Output: <Buffer 96 75 16 0>






