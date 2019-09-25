const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// connect mongodb
mongo.connect('mongodb://127.0.0.1/mongochat',(err,db)=>{
  if(err) throw err

  console.log('mongodb connected ...')
  client.on('connection', function(socket){
    let chat =db.collection('chats');

    const sendSataus = status=>socket.emit('status',status)
    

    chat.find().limit(100).sort({_id:1}).toArray((err,res)=>{
      if(err) throw err
      socket.emit('output',res)
    })


    socket.on('input',(data)=>{
      const {name, message} = data;
      if(!name){
        sendSataus({message:'please enter a name'})
        return
      } 
      if(!message) {
        sendSataus({message:'please enter a message'})
        return
      }
      chat.insert({name, message},()=>{
        client.emit('output',[data])
        sendSataus({
          message:'message sent',
          clear:true,
          date: new Date()
        })
      })

    })

    socket.on('clear', ()=>{
      chat.remove({},()=>socket.emit('clear'))
    })

  })
})