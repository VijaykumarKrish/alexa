const Alexa = require('ask-sdk-core');
// const Alexa = require('ask-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const { ExpressAdapter } = require('ask-sdk-express-adapter');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


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






















const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
      const speechText = 'Welcome to your SDK weather skill. Ask me the weather!';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('Welcome to your SDK weather skill. Ask me the weather!', speechText)
        .getResponse();
    }
  };

  const AskWeatherIntentHandler = {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskWeatherIntents';
    },
    handle(handlerInput) {

      const speechText = 'The weather today is sunny.';

      const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      const userQuery = handlerInput.requestEnvelope.request.intent.slots.InfoType.value;
     
  
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
    AskWeatherIntentHandler,
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
const adapter = new ExpressAdapter(skill, true, true);

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
