import { Server } from "socket.io";

let io: Server | null = null;

export const setSocketServer = (socketServer: Server) => {
  io = socketServer;
};

export const emitOrderUpdate = (updatedOrder: any) => {
  if (!io) {
    console.error("Socket.io server not initialized");
    return;
  }

  io.emit("orderUpdated", updatedOrder);
};
