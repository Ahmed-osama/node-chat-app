const $ = id=>document.getElementById(id)
const el = {
    get msgs(){
      return $('messages')
    },
    get clear(){
      return $('clear')},
    get input(){
      return $('input')},
    get send(){
      return $('send')},
    get username(){
      return $('username')},
    get status(){
      return $('status')},
}
const tpl= {
  incomingMsg(msg){
    return `
    <div class="incoming_msg">
      <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
      </div>
      <div class="received_msg">
        <div class="received_withd_msg">
          <p>${msg.body}</p>
          <span class="time_date"> ${msg.name}</span>
        </div>
      </div>
    </div>`
  },

  outgoingMsg(msg){
    return `<div class="outgoing_msg">
    <div class="sent_msg">
      <p>${msg.body}</p>
      <span class="time_date"> ${msg.name}</span>
    </div>
  </div>`
  }
}
const set = {
  msg(msg){
    el.msgs.insertAdjacentHTML( 'beforeend',tpl[msg.type =='incoming'?'incomingMsg':'outgoingMsg'](msg))
  },
  status(status){
    el.status.textContent = status.message;
    if(status.message === "message sent"){
      el.input.value = ''
    }
    if(el.status.textContent) {
      setTimeout(() => {
      el.status.textContent = ''
    }, 4000);
  }
  }
}

const utils = {
  pushMessage(e, inpt = e.target){
    if(e.code !== 'Enter' && e.type !== 'click') return
    socket.emit('input',{
      name:el.username.value,
      message:inpt.value
    })
    
  }
}
const socket = io.connect('http://127.0.0.1:4000')

if(typeof socket !== typeof undefined){
  socket.on('status',set.status)
  el.input.addEventListener('keyup', utils.pushMessage)
  el.send.addEventListener('click', e => utils.pushMessage(e,el.input))
  socket.on('output',data=>{
    data.forEach(({name, message}) => {
      set.msg({
        type:name!==el.username.value?'incoming':'outgoing,',
        body:message,
        name
      })
    });
    el.msgs.scrollTop = el.msgs.scrollHeight
  })
el.clear.addEventListener('click',socket.emit('clear'))
} 
