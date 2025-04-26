/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
export const inviteUserToBoardSocket = (socket) => {
  //lang nghe su kien ma clent emit len
  socket.on("FE_USER_INVITED_TO_BOARD", (invitation) => {
    //emit nguoc lai 1 su kien ve cho moi clent khac ngoai thang vua emit len
    socket.broadcast.emit("FE_USER_INVITED_TO_BOARD", invitation);
  });
};
