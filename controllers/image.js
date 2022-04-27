const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.API_CLARIFAI}`);

// const Clarifai = require('clarifai');
// console.log(Clarifai);

// const app = new Clarifai.App({
//     apiKey: "5075370a2e3f46d38c93e3e70f2d513f",
//   });
const handleApiCall = (req, res) => {
stub.PostModelOutputs(
  {
      model_id: "a403429f2ddf4b49b307e318f00e528b",
      inputs: [{data: {image: {url: req.body.input}}}],
  },
  metadata,
  (err, response) => {
      if (err) {
          console.log("Error: " + err);
          return;
      }

      if (response.status.code !== 10000) {
          console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
          return;
      }

      console.log("Predicted concepts, with confidence values:")
      for (const c of response.outputs[0].data.concepts) {
          console.log(c.name + ": " + c.value);
      }
      res.json(response);
  }
);
}


//   app.models
//   .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
//   .then(data => {
//       res.json(data);
//     })
//     .catch(err => res.status(400).json("unable to work with API"))
    
// }


const handleImage = (req, res, db) => {
    
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      console.log(entries);
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json("unable to get entries"))  
  }

  module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
    };