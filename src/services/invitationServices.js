import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/BoardModel";
import { invitationModel } from "~/models/invitationModels";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from "~/utils/constants";
import { pickUser } from "~/utils/formatter";

const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    //nguopi moi: chinh la nguoi dang request, lay tu token
    const inviter = await userModel.findOneByID(inviterId);
    // console.log("🚀 ~ createNewBoardInvitation ~ inviter:", inviter);

    // Người được mời: lấy theo email nhận từ phía FE
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail);
    // console.log("🚀 ~ createNewBoardInvitation ~ invitee:", invitee);

    // Tìm luôn cái board ra để lấy data xử lý
    const board = await boardModel.findOneByID(reqBody.boardId);
    // console.log("🚀 ~ createNewBoardInvitation ~ board:", board);

    // Nếu khong tồn tại 1 trong 3 thì cứ thẳng tay reject
    if (!invitee || !inviter || !board) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Inviter, Invitee or Board not found!"
      );
    }

    // Tạo data cần thiết để lưu vào trong DB
    // Có thể thử bỏ hoặc làm sai lệch type, boardInvitation, status để test xem Model validate ok chưa.
    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(), // chuyển từ ObjectId về String vì sang bên Model có check lại data ở hàm create
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING,
      },
    };

    // Gọi sang Model đề lưu vào DB
    const createdInvitation = await invitationModel.createNewBoardInvitation(
      newInvitationData
    );
    // console.log(
    //   "🚀 ~ createNewBoardInvitation ~ createdInvitation:",
    //   createdInvitation
    // );
    const getInvitation = await invitationModel.findOneByID(
      createdInvitation.insertedId
    );
    console.log(
      "🚀 ~ createNewBoardInvitation ~ getInvitation:",
      getInvitation
    );
    // Ngoài thông tin của cái board invitation mới tạo thì trả về đủ cả luôn board, inviter, invitee cho FE thoải mái xử lý.
    const resInvitation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee),
    };
    return resInvitation;
  } catch (error) {
    throw error;
  }
};

const getInvitation = async (userId) => {
  try {
    const getInvitation = await invitationModel.findByUser(userId);
    // console.log("🚀 ~ getInvitation ~ getInvitation:", getInvitation);

    //vi inviter va invitee va board dang la gia tri cua 1 mang nen doi ve 1 object de de xu li
    const resInvitations = getInvitation.map((i) => {
      return {
        ...i,
        inviter: i.inviter[0] || {},
        invitee: i.invitee[0] || {},
        board: i.board[0] || {},
      };
    });
    return resInvitations;
  } catch (error) {
    throw error;
  }
};
const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    //tim ban ghi invitation trong model
    const getInvitation = await invitationModel.findOneByID(invitationId);
    if (!getInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Invitation not found");
    }

    //sau khi co invitation r thi lay thong tn cua board
    const boardId = getInvitation.boardInvitation.boardId;
    const getBoard = await boardModel.findOneByID(boardId);
    if (!getBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }
    //kiem tra neu status laf accepted ma userId (invitee) da owner or member cua board roi thoi bao loi
    //owner va member dang la objectId nen doi ve string
    const boardOwnerAndMemberIds = [
      ...getBoard.ownerIds,
      ...getBoard.memberIds,
    ].toString();
    if (
      status === BOARD_INVITATION_STATUS.ACCEPTED &&
      boardOwnerAndMemberIds.includes(userId)
    ) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "You are already a member or owner this board."
      );
    }
    //tao du lieu de update ban ghi invitation
    const updateData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status: status,
      },
    };

    //b1: cap nhat status
    const updateInvitation = await invitationModel.update(
      invitationId,
      updateData
    );

    //b2:accepted thanh cong:them thong tin cua userId vao ban ghi memberIds cua boardId
    if (
      updateInvitation.boardInvitation.status ===
      BOARD_INVITATION_STATUS.ACCEPTED
    ) {
      await boardModel.pushMemberIds(boardId, userId);
    }

    return updateInvitation;
  } catch (error) {
    throw error;
  }
};
export const invitationService = {
  createNewBoardInvitation,
  getInvitation,
  updateBoardInvitation,
};
