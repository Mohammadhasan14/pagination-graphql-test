const mongoose = require('mongoose');

main().then(()=>{
    console.log('MongoDB connection is ready...')
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/gggg');

}

// const newSchema = new mongoose.Schema({
//     name: ''
// })