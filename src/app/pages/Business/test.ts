function get() {
    return fetch ('https://ngodingers.com')
    .then(res => res.text())
    .catch(err => console.log('err', err))
    
}