if(process.env.NODE_ENV !== 'production') require('dotenv').config()

module.exports = {
    normalizePort: (unormalizedPort) => {
        // Normalize a port into a number, string, or false.
        
        const port = parseInt(unormalizedPort, 10)
        
        if(isNaN(port)) {
            // named pipe
            return unormalizedPort
        }
        
        if(port >= 0) {
            // port number
            return port
        }
        
        return false
    },
    PORT: process.env.PORT || '1337',
}
