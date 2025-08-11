
const socketIo = require('socket.io');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log("user: ", userId, "type: ", userType);
            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        
        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;

                if (!userId || !location || !location.ltd || !location.lng) {
                    return socket.emit('error', { message: 'Invalid location data' });
                }

                const updatedCaptain = await captainModel.findOneAndUpdate(
                    { _id: userId },
                    {
                        $set: {
                            location: {
                                ltd: location.ltd,
                                lng: location.lng
                            }
                        }
                    },
                    { new: true } // returns the updated document
                );

                if (!updatedCaptain) {
                    return socket.emit('error', { message: 'Captain not found' });
                }

                // Optionally confirm back to sender
                // socket.emit('location-updated', { success: true, captainId: updatedCaptain._id });
            } catch (err) {
                console.error('Error updating location:', err);
                socket.emit('error', { message: 'Server error updating location' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

    console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { 
    initializeSocket, 
    sendMessageToSocketId ,
};

