const socket = io()

socket.on('connect', () => {
    console.log('Connected to Websocket')
})

socket.on('MESSAGES_INIT', (messages) => {
    console.log(messages)
    fetch('http://localhost:8080/messages.hbs')
        .then(res => {
            return res.text()
        })
        .then(res => {
            const chatTemplate = Handlebars.compile(res)
            const chatHTML = chatTemplate({ messages })
            document.querySelector('#chatBox').innerHTML = chatHTML
        })
})

socket.on('NEW_MESSAGE', msg => {
    console.log(msg)
    document.querySelector('#chatBox').append(`<p><b>${msg.username} - ${msg.type}</b> [${msg.dateString}]: ${msg.body}</p>`)
})

sendMessage = () => {
    const username = document.getElementById('email').value
    const body = document.getElementById('message').value
    const type = document.getElementById('type').value
    const date = new Date()
    const dateString = `${date.toLocaleString()}`
    socket.emit('POST_MESSAGE', {username, type, body, dateString})
}